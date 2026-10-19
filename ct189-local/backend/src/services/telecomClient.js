import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";
import { config } from "../config.js";
import { decodeTelecomPayload } from "./crypto189.js";
import { performPasswordLogin } from "./passwordLogin.js";
import { createSessionPool } from "./sessionPool.js";

const profilesDir = path.join(config.dataDir, "browser");
const sessions = createSessionPool(createClient);
let engineMajor;

function profileDirectory(accountId) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(accountId)) {
    throw new Error("无效的本地账号标识");
  }
  return path.join(profilesDir, accountId);
}

const API = {
  qryLoginAccno: "/wap2017/re/activity/qryLoginAccno",
  activityCheck: "/wap2017/re/wapFree/rightsInterestsAct/activityCheckV3",
  queryPreactiveInfo: "/wap2017/re/wapFree/rightsInterestsAct/queryPreactiveInfo",
  doRights: "/wap2017/re/wapFree/rightsInterestsAct/doCheckRightsInterestsV3",
  queryAllNumBalance: "/wap2017/re/wapFree/balanceNewQuery/queryAllNumBalance",
  qryAccountBal: "/wap2017/re/wapFree/balanceNewQuery/qryAccountBal",
  queryAccountBill: "/wap2017/re/wapFree/balanceNewQuery/queryAccountBill",
  queryAccountPackageDetail: "/wap2017/re/wapFree/balanceNewQuery/queryAccountPackageDetail",
  openAccessToken: "/wap2017/re/wapFree/login/openAccessToken"
};

async function createClient(accountId) {
  if (!engineMajor) {
    engineMajor = execFileSync(chromium.executablePath(), ["--version"], { encoding: "utf8", timeout: 5000 }).match(/\b(\d+)\./)?.[1];
    if (!engineMajor) throw new Error("无法识别本地登录引擎版本");
  }
  fs.mkdirSync(profilesDir, { recursive: true });
  const userDataDir = profileDirectory(accountId);
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: true,
    args: ["--disable-blink-features=AutomationControlled"],
    ignoreDefaultArgs: ["--enable-automation"],
    viewport: { width: 390, height: 844 },
    userAgent:
      `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${engineMajor}.0.0.0 Safari/537.36`
  });
  const page = context.pages()[0] || (await context.newPage());
  page.setDefaultTimeout(config.requestTimeoutMs);
  page.setDefaultNavigationTimeout(config.requestTimeoutMs);
  return { context, page, initialized: false };
}

export async function getClient(accountId) {
  return sessions.get(accountId);
}

export async function closeClient(accountId) {
  return sessions.run(accountId, () => sessions.close(accountId));
}

export async function removeClient(accountId) {
  return sessions.run(accountId, () => discardSession(accountId));
}

async function ensureOfficialPage(accountId) {
  const client = await getClient(accountId);
  const page = client.page;
  if (!client.initialized || new URL(page.url()).origin !== config.officialOrigin) {
    try {
      // Analytics and long-lived official connections must not hold up login.
      await page.goto(config.officialEntry, { waitUntil: "domcontentloaded" });
      if (new URL(page.url()).origin !== config.officialOrigin) throw new Error("unexpected origin");
      client.initialized = true;
    } catch (error) {
      client.initialized = false;
      throw error;
    }
  }
  return page;
}

export async function request189(accountId, endpoint, data = {}, options = {}) {
  return sessions.run(accountId, () => requestInSession(accountId, endpoint, data, options));
}

async function requestInSession(accountId, endpoint, data = {}, options = {}) {
  if (options.reinitialize) (await getClient(accountId)).initialized = false;
  const page = await ensureOfficialPage(accountId);
  const result = await page.evaluate(
    async ({ endpoint, data, method, timeout }) => {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        const payload = method === "GET" ? null : JSON.stringify(data || {});
        xhr.open(method, endpoint, true);
        xhr.timeout = timeout;
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
        if (method !== "GET") xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        xhr.onreadystatechange = () => {
          if (xhr.readyState !== 4) return;
          resolve({
            ok: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
            url: xhr.responseURL || endpoint,
            text: xhr.responseText || "",
            contentType: xhr.getResponseHeader("content-type") || "",
            pageUrl: window.location.href,
            cookieNames: document.cookie
              .split(";")
              .map((item) => item.trim().split("=")[0])
              .filter(Boolean)
          });
        };
        xhr.onerror = xhr.ontimeout = xhr.onabort = () => {
          resolve({
            ok: false,
            status: xhr.status || 0,
            url: xhr.responseURL || endpoint,
            text: "",
            contentType: "",
            pageUrl: window.location.href,
            cookieNames: document.cookie
              .split(";")
              .map((item) => item.trim().split("=")[0])
              .filter(Boolean)
          });
        };
        xhr.send(payload);
      });
    },
    { endpoint, data, method: options.method || "POST", timeout: config.requestTimeoutMs }
  );

  const safePath = (url) => {
    try { return new URL(url, config.officialOrigin).pathname; } catch { return ""; }
  };
  if (!result.ok) (await getClient(accountId)).initialized = false;
  return {
    ok: result.ok,
    status: result.status,
    data: decodeTelecomPayload(result.text),
    diagnostic: {
      status: result.status,
      url: safePath(result.url),
      pageUrl: safePath(result.pageUrl),
      contentType: result.contentType,
      textLength: result.text?.length || 0,
      cookieNames: result.cookieNames || []
    }
  };
}

export async function loginByServicePassword(accountId, phone, password) {
  return sessions.run(accountId, async () => {
    try {
      const result = await performPasswordLogin(phone, password,
        (endpoint, data, options) => requestInSession(accountId, endpoint, data, options));
      // Failed or mismatched logins must not leave an old usable session behind.
      if (!result.ok) await discardSession(accountId);
      return result;
    } catch (error) {
      await discardSession(accountId);
      throw error;
    }
  });
}

async function discardSession(accountId) {
  // Close first, then remove the profile. Cookie operations fail on a crashed
  // context and must not prevent deletion or hide the original login error.
  await sessions.close(accountId);
  fs.rmSync(profileDirectory(accountId), { recursive: true, force: true });
}

export async function queryLoginAccount(accountId) {
  return request189(accountId, API.qryLoginAccno, {});
}

export async function queryActivity(accountId) {
  const [info, chance] = await Promise.all([
    request189(accountId, API.queryPreactiveInfo, { activeId: "310", channelId: "", staffCode: "" }),
    request189(accountId, API.activityCheck, { activeId: "310" })
  ]);
  return { info: info.data, chance: chance.data };
}

export async function drawRights(accountId) {
  return request189(accountId, API.doRights, { activeId: "310", channelId: "", staffCode: "" });
}

export async function queryBalance(accountId) {
  const [allNum, accountBal, packageDetail] = await Promise.allSettled([
    request189(accountId, API.queryAllNumBalance, {}),
    request189(accountId, API.qryAccountBal, {}),
    request189(accountId, API.queryAccountPackageDetail, {})
  ]);
  return {
    allNum: settledData(allNum),
    accountBal: settledData(accountBal),
    packageDetail: settledData(packageDetail)
  };
}

export async function queryBill(accountId, payload = {}) {
  return request189(accountId, API.queryAccountBill, payload);
}

export async function getOpenAccessToken(accountId, payload = {}) {
  return request189(accountId, API.openAccessToken, payload);
}

function settledData(result) {
  if (result.status === "fulfilled") return result.value.data;
  return { result: -1, retCode: "LOCAL_ERROR", retMsg: result.reason?.message || "请求失败" };
}

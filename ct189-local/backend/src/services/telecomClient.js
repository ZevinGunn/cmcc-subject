import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { config } from "../config.js";
import { decodeTelecomPayload, encryptServicePassword } from "./crypto189.js";

const profilesDir = path.join(config.dataDir, "browser");
const clients = new Map();

const API = {
  passwordCheck: "/wap2017/re/wapFree/cancelAccount/passwordCheck",
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
  fs.mkdirSync(profilesDir, { recursive: true });
  const userDataDir = path.join(profilesDir, accountId);
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: config.headless,
    viewport: { width: 390, height: 844 },
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1"
  });
  const page = context.pages()[0] || (await context.newPage());
  page.setDefaultTimeout(config.requestTimeoutMs);
  page.setDefaultNavigationTimeout(config.requestTimeoutMs);
  return { context, page };
}

export async function getClient(accountId) {
  if (!clients.has(accountId)) {
    clients.set(accountId, await createClient(accountId));
  }
  return clients.get(accountId);
}

export async function closeClient(accountId) {
  const client = clients.get(accountId);
  if (!client) return;
  await client.context.close();
  clients.delete(accountId);
}

async function ensureOfficialPage(accountId) {
  const client = await getClient(accountId);
  const page = client.page;
  if (!page.url().startsWith(config.officialOrigin)) {
    await page.goto(config.officialEntry, { waitUntil: "networkidle" });
  }
  return page;
}

export async function request189(accountId, endpoint, data = {}, options = {}) {
  const page = await ensureOfficialPage(accountId);
  const result = await page.evaluate(
    async ({ endpoint, data, method }) => {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        const payload = method === "GET" ? null : JSON.stringify(data || {});
        xhr.open(method, endpoint, true);
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
        xhr.onerror = () => {
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
    { endpoint, data, method: options.method || "POST" }
  );

  return {
    ...result,
    data: decodeTelecomPayload(result.text),
    diagnostic: {
      status: result.status,
      url: result.url,
      pageUrl: result.pageUrl,
      contentType: result.contentType,
      textLength: result.text?.length || 0,
      cookieNames: result.cookieNames || []
    }
  };
}

export async function loginByServicePassword(accountId, phone, password) {
  const encryptedPassword = encryptServicePassword(password);
  return request189(accountId, API.passwordCheck, {
    phoneNum: String(phone || "").trim(),
    password: encryptedPassword
  });
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

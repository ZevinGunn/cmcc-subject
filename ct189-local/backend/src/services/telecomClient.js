import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";
import { config } from "../config.js";
import { decodeTelecomPayload } from "./crypto189.js";
import { performPasswordLogin } from "./passwordLogin.js";
import { createSessionPool } from "./sessionPool.js";
import {
  CLASSIC_RIGHTS,
  claimMessage,
  explainClassicEligibility,
  findClassicOffer,
} from "./classicRights.js";

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

const CLASSIC_ACTIVITY_PAGE =
  "/wap2017/index_highcvip/highMember_cvip_qy_activity.html";
const CLASSIC_ACTIVITY_DETAIL =
  "/wap2017/re/wapFree/rightsInterests/interestsActivityDetaiList";
const CLASSIC_PRECHECK =
  "/wap2017/re/wapFree/rightsInterests/doCheckRightsInterests";
const CLASSIC_CLAIM =
  "/wap2017/re/wapFree/rightsInterests/doRightsInterests";

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
      // A fresh profile first receives a 412 challenge that reloads itself.
      // Its anonymous API can already succeed, but credentials issued from it
      // race the reload. Observe navigation before goto so even an immediate
      // reload is caught, without injecting polling code into the challenge.
      let documentStatus = 0;
      const onResponse = (response) => {
        if (response.request().isNavigationRequest() && response.frame() === page.mainFrame()) {
          documentStatus = response.status();
        }
      };
      page.on("response", onResponse);
      try {
        const ready = page.waitForURL(
          (url) => url.origin === config.officialOrigin && documentStatus > 0 && documentStatus !== 412,
          { waitUntil: "domcontentloaded", timeout: config.requestTimeoutMs }
        );
        await Promise.all([
          page.goto(config.officialEntry, { waitUntil: "domcontentloaded" }),
          ready
        ]);
      } finally {
        page.off("response", onResponse);
      }
      // The anonymous business-API handshake remains the readiness check;
      // reaching a replacement document alone does not prove API availability.
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

function parseClassicResponse(text) {
  try {
    const value = JSON.parse(text || "");
    return value && typeof value === "object" ? value : null;
  } catch {
    return null;
  }
}

function waitForClassicResponse(page, endpoint, timeout = config.requestTimeoutMs) {
  return new Promise((resolve, reject) => {
    let timer;
    const onResponse = async (response) => {
      let url;
      try {
        url = new URL(response.url());
      } catch {
        return;
      }
      if (url.origin !== config.officialOrigin || url.pathname !== endpoint) return;
      page.off("response", onResponse);
      clearTimeout(timer);
      try {
        resolve({ status: response.status(), data: parseClassicResponse(await response.text()) });
      } catch {
        resolve({ status: response.status(), data: null });
      }
    };
    page.on("response", onResponse);
    timer = setTimeout(() => {
      page.off("response", onResponse);
      reject(Object.assign(new Error("经典权益接口响应超时"), { status: 504 }));
    }, timeout);
  });
}

async function prepareClassicPage(page, activityId) {
  const url = `${config.officialOrigin}${CLASSIC_ACTIVITY_PAGE}?activityId=${encodeURIComponent(activityId)}&level=1`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: config.requestTimeoutMs });
  await page.waitForFunction(
    () => typeof window.rights_interests?.interestsActivityDetaiList === "function",
    { timeout: config.requestTimeoutMs },
  );
}

async function loadClassicActivity(page, activityId) {
  await prepareClassicPage(page, activityId);
  const response = waitForClassicResponse(page, CLASSIC_ACTIVITY_DETAIL);
  await page.evaluate((id) => window.rights_interests.interestsActivityDetaiList(Number(id)), activityId);
  const result = await response;
  if (result.status < 200 || result.status >= 300 || !result.data)
    throw Object.assign(new Error("活动资格查询失败"), { status: result.status || 502 });
  return result.data;
}

async function invokeClassicClaim(page, definition, activityId) {
  const args = [definition.offerCode, definition.offerName, activityId, "1", "2"];
  return new Promise(async (resolve, reject) => {
    let timer;
    let check;
    let claim;
    const finish = () => {
      if (!check || (check.data?.object?.resultCode === "0" && !claim)) return;
      page.off("response", onResponse);
      clearTimeout(timer);
      if (check.status < 200 || check.status >= 300 || !check.data)
        reject(Object.assign(new Error("活动预校验连接失败"), { status: check.status || 502 }));
      else resolve({ check: check.data, claim: claim?.data || null });
    };
    const onResponse = async (response) => {
      let url;
      try {
        url = new URL(response.url());
      } catch {
        return;
      }
      if (url.origin !== config.officialOrigin) return;
      if (url.pathname !== CLASSIC_PRECHECK && url.pathname !== CLASSIC_CLAIM) return;
      const value = { status: response.status(), data: parseClassicResponse(await response.text()) };
      if (url.pathname === CLASSIC_PRECHECK) check = value;
      else claim = value;
      finish();
    };
    page.on("response", onResponse);
    timer = setTimeout(() => {
      page.off("response", onResponse);
      reject(Object.assign(new Error("经典权益领取接口响应超时"), { status: 504 }));
    }, config.requestTimeoutMs);
    try {
      // The official page calls doRightsInterests from the successful pre-check
      // callback. Both listeners are installed before the call; neither
      // request is retried because the second one has an external side effect.
      await page.evaluate(
        ([offerCode, offerName, id, level, busType]) =>
          window.rights_interests.doCheckRightsInterests(offerCode, offerName, id, level, busType),
        args,
      );
    } catch (error) {
      page.off("response", onResponse);
      clearTimeout(timer);
      reject(error);
    }
  });
}

async function classicActivityForDefinition(page, definition) {
  const ids = definition.activityId
    ? [definition.activityId]
    : definition.activityIdCandidates;
  let last = null;
  for (const activityId of ids) {
    try {
      const activity = await loadClassicActivity(page, activityId);
      const offer = findClassicOffer(activity, definition);
      if (offer) return { activityId, activity, offer };
      last = activity;
    } catch (error) {
      last = error;
    }
  }
  if (last instanceof Error) throw last;
  return { activityId: ids[0], activity: last, offer: null };
}

export async function claimClassicRight(accountId, action) {
  const definition = CLASSIC_RIGHTS[action];
  if (!definition) throw Object.assign(new Error("不支持的经典权益活动"), { status: 400 });
  return sessions.run(accountId, async () => {
    const page = await ensureOfficialPage(accountId);
    const found = await classicActivityForDefinition(page, definition);
    const failure = explainClassicEligibility(found.activity, found.offer, definition);
    if (failure) throw Object.assign(new Error(failure), { status: 409 });
    const result = await invokeClassicClaim(page, definition, found.activityId);
    const checkMessage = claimMessage(result.check);
    if (!result.claim)
      throw Object.assign(new Error(checkMessage), { status: 409 });
    const message = claimMessage(result.claim);
    const ok = result.claim?.object?.resultCode === "0";
    if (!ok) throw Object.assign(new Error(message), { status: 409 });
    return {
      ok: true,
      activityId: found.activityId,
      offerCode: definition.offerCode,
      offerName: definition.offerName,
      message,
      check: result.check,
      claim: result.claim,
    };
  });
}

export async function queryClassicRight(accountId, action) {
  const definition = CLASSIC_RIGHTS[action];
  if (!definition) throw Object.assign(new Error("不支持的经典权益活动"), { status: 400 });
  return sessions.run(accountId, async () => {
    const page = await ensureOfficialPage(accountId);
    const found = await classicActivityForDefinition(page, definition);
    return {
      action,
      activityId: found.activityId,
      activity: found.activity,
      offer: found.offer,
      eligibilityMessage: explainClassicEligibility(found.activity, found.offer, definition),
    };
  });
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

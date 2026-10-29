import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";
import { config } from "../config.js";
import { decodeTelecomPayload } from "./crypto189.js";
import { performPasswordLogin } from "./passwordLogin.js";
import { createSessionPool } from "./sessionPool.js";
import { appendLog } from "./accountStore.js";
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
const CLASSIC_ACTIVITY_APP_PAGE =
  "/wap2017/apps/serviceapps/highMember_cvip_qy_activity/index.html";
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
        let settled = false;
        const snapshot = (failureType = "") => {
          let contentType = "";
          try {
            contentType = xhr.getResponseHeader("content-type") || "";
          } catch {
            // Aborted and timed-out XHRs may no longer expose response headers.
          }
          return {
            ok: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
            url: xhr.responseURL || endpoint,
            text: xhr.responseText || "",
            contentType,
            failureType,
            pageUrl: window.location.href,
            cookieNames: document.cookie
              .split(";")
              .map((item) => item.trim().split("=")[0])
              .filter(Boolean)
          };
        };
        xhr.onreadystatechange = () => {
          if (xhr.readyState !== 4) return;
          if (settled) return;
          settled = true;
          resolve(snapshot(xhr.status ? "" : "status_zero"));
        };
        const fail = (failureType) => {
          if (settled) return;
          settled = true;
          resolve({ ...snapshot(failureType), ok: false, status: xhr.status || 0, text: "" });
        };
        xhr.onerror = () => fail("error");
        xhr.ontimeout = () => fail("timeout");
        xhr.onabort = () => fail("abort");
        xhr.send(payload);
      });
    },
    { endpoint, data, method: options.method || "POST", timeout: config.requestTimeoutMs }
  );

  const safePath = (url) => {
    try { return new URL(url, config.officialOrigin).pathname; } catch { return ""; }
  };
  if (!result.ok) (await getClient(accountId)).initialized = false;
  const decoded = decodeTelecomPayload(result.text);
  const diagnostic = {
    status: result.status,
    url: safePath(result.url),
    pageUrl: safePath(result.pageUrl),
    contentType: result.contentType,
    textLength: result.text?.length || 0,
    cookieNames: result.cookieNames || [],
    ...(result.failureType ? { failureType: result.failureType } : {})
  };
  try {
    appendLog(accountId, "api_request", {
      stage: options.stage || "business_api",
      endpoint,
      method: options.method || "POST",
      request: data,
      response: { ok: result.ok, status: result.status, data: decoded },
      diagnostic,
    });
  } catch {
    // Logging must never change the upstream request result.
  }
  return {
    ok: result.ok,
    status: result.status,
    data: decoded,
    diagnostic,
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

export async function queryLoginAccount(accountId, options = {}) {
  return request189(accountId, API.qryLoginAccno, {}, options);
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

function classicResponseSummary(value) {
  const data = value?.data || value;
  if (!data || typeof data !== "object") return null;
  const object = data.object;
  return {
    ...(value?.status != null ? { status: value.status } : {}),
    result: data.result,
    retCode: data.retCode,
    ...(typeof data.retMsg === "string" ? { retMsg: data.retMsg.replace(/1\d{10}/g, "手机号").slice(0, 180) } : {}),
    ...(object && typeof object === "object" ? {
      handle: object.handle,
      receive: object.receive,
      resultCode: object.resultCode,
      ...(typeof object.resultMessage === "string" ? { resultMessage: object.resultMessage.slice(0, 180) } : {}),
    } : {}),
  };
}

function waitForClassicResponse(page, endpoint, timeout = config.requestTimeoutMs) {
  let cancel;
  const pending = new Promise((resolve, reject) => {
    let timer;
    let settled = false;
    const onResponse = async (response) => {
      let url;
      try {
        url = new URL(response.url());
      } catch {
        return;
      }
      if (url.origin !== config.officialOrigin || url.pathname !== endpoint) return;
      settled = true;
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
      settled = true;
      page.off("response", onResponse);
      reject(Object.assign(new Error("经典权益接口响应超时"), { status: 504 }));
    }, timeout);
    cancel = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      page.off("response", onResponse);
    };
  });
  pending.cancel = () => cancel?.();
  return pending;
}

async function navigateOfficialDocument(page, url) {
  let documentStatus = 0;
  const onResponse = (response) => {
    if (response.request().isNavigationRequest() && response.frame() === page.mainFrame())
      documentStatus = response.status();
  };
  page.on("response", onResponse);
  try {
    const ready = page.waitForURL(
      (current) => current.origin === config.officialOrigin && documentStatus > 0 && documentStatus !== 412,
      { waitUntil: "domcontentloaded", timeout: config.requestTimeoutMs },
    );
    await Promise.all([
      page.goto(url, { waitUntil: "domcontentloaded", timeout: config.requestTimeoutMs }),
      ready,
    ]);
  } finally {
    page.off("response", onResponse);
  }
  const result = { status: documentStatus, pageUrl: new URL(page.url()).pathname };
  if (result.status >= 400)
    throw Object.assign(new Error(`活动页面返回 HTTP ${result.status}`), result);
  return result;
}

async function prepareClassicPage(page, activityId, accountId) {
  const urls = [CLASSIC_ACTIVITY_PAGE, CLASSIC_ACTIVITY_APP_PAGE];
  let lastError;
  for (const endpoint of urls) {
    const url = `${config.officialOrigin}${endpoint}?activityId=${encodeURIComponent(activityId)}&level=1`;
    try {
      const navigation = await navigateOfficialDocument(page, url);
      await page.waitForFunction(
        () => typeof window.rights_interests?.interestsActivityDetaiList === "function",
        { timeout: Math.min(config.requestTimeoutMs, 8000) },
      );
      try {
        appendLog(accountId, "api_request", {
          stage: "rights_activity_page",
          endpoint,
          method: "GET",
          request: { activityId },
          response: { ok: true, status: navigation.status, pageUrl: navigation.pageUrl },
        });
      } catch {}
      return;
    } catch (error) {
      lastError = error;
    }
  }
  {
    const error = lastError || new Error("活动页面未加载权益脚本");
    let pageInfo = {};
    try {
      pageInfo = {
        pageUrl: new URL(page.url()).pathname,
        title: await page.title(),
        textLength: await page.locator("body").innerText({ timeout: 1000 }).then((text) => text.length).catch(() => 0),
      };
    } catch {}
    try {
      appendLog(accountId, "api_request", {
        stage: "rights_activity_page",
        endpoint: urls.join(","),
        method: "GET",
        request: { activityId },
        response: null,
        diagnostic: pageInfo,
        error: { name: error?.name, message: error?.message, status: error?.status },
      });
    } catch {}
    throw error;
  }
}

async function loadClassicActivity(page, activityId, accountId) {
  await prepareClassicPage(page, activityId, accountId);
  const response = waitForClassicResponse(page, CLASSIC_ACTIVITY_DETAIL);
  let result;
  try {
    await page.evaluate((id) => window.rights_interests.interestsActivityDetaiList(Number(id)), activityId);
    result = await response;
  } catch (error) {
    response.cancel?.();
    try {
      appendLog(accountId, "api_request", {
        stage: "rights_activity",
        endpoint: CLASSIC_ACTIVITY_DETAIL,
        method: "POST",
        request: { activityId },
        response: null,
        error: { name: error?.name, message: error?.message, status: error?.status },
      });
    } catch {}
    throw error;
  }
  try {
    appendLog(accountId, "api_request", {
      stage: "rights_activity",
      endpoint: CLASSIC_ACTIVITY_DETAIL,
      method: "POST",
      request: { activityId },
      response: { ok: result.status >= 200 && result.status < 300, status: result.status, data: result.data },
    });
  } catch {}
  if (result.status < 200 || result.status >= 300 || !result.data)
    throw Object.assign(new Error("活动资格查询失败"), { status: result.status || 502, responseSummary: { activity: classicResponseSummary(result) } });
  return result.data;
}

async function invokeClassicClaim(page, definition, activityId, accountId) {
  const args = [definition.offerCode, definition.offerName, activityId, "1", "2"];
  const request = {
    offerCode: definition.offerCode,
    offerName: definition.offerName,
    activityId,
    level: "1",
    busType: "2",
  };
  return new Promise(async (resolve, reject) => {
    let timer;
    let check;
    let claim;
    const finish = () => {
      if (!check || (check.data?.object?.resultCode === "0" && !claim)) return;
      page.off("response", onResponse);
      clearTimeout(timer);
      if (check.status < 200 || check.status >= 300 || !check.data)
        reject(Object.assign(new Error("活动预校验连接失败"), { status: check.status || 502, responseSummary: { check: classicResponseSummary(check) } }));
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
      try {
        appendLog(accountId, "api_request", {
          stage: url.pathname === CLASSIC_PRECHECK ? "rights_precheck" : "rights_claim",
          endpoint: url.pathname,
          method: "POST",
          request: {
            ...request,
          },
          response: { ok: value.status >= 200 && value.status < 300, status: value.status, data: value.data },
        });
      } catch {}
      if (url.pathname === CLASSIC_PRECHECK) check = value;
      else claim = value;
      finish();
    };
    page.on("response", onResponse);
    timer = setTimeout(() => {
      page.off("response", onResponse);
      try {
        appendLog(accountId, "api_request", {
          stage: "rights_claim",
          endpoint: `${CLASSIC_PRECHECK},${CLASSIC_CLAIM}`,
          method: "POST",
          request,
          response: null,
          error: { name: "TimeoutError", message: "经典权益接口响应超时", status: 504 },
        });
      } catch {}
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
      try {
        appendLog(accountId, "api_request", {
          stage: "rights_claim",
          endpoint: `${CLASSIC_PRECHECK},${CLASSIC_CLAIM}`,
          method: "POST",
          request,
          response: null,
          error: { name: error?.name, message: error?.message, status: error?.status },
        });
      } catch {}
      reject(error);
    }
  });
}

async function classicActivityForDefinition(page, definition, accountId) {
  const ids = definition.activityId
    ? [definition.activityId]
    : definition.activityIdCandidates;
  let last = null;
  for (const activityId of ids) {
    try {
      const activity = await loadClassicActivity(page, activityId, accountId);
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
    const found = await classicActivityForDefinition(page, definition, accountId);
    const failure = explainClassicEligibility(found.activity, found.offer, definition);
    if (failure) throw Object.assign(new Error(failure), { status: 409, responseSummary: { activity: classicResponseSummary(found.activity), offer: found.offer ? { offerCode: definition.offerCode, receiveMark: found.offer.receiveMark, realNumber: found.offer.realNumber } : null } });
    const result = await invokeClassicClaim(page, definition, found.activityId, accountId);
    const checkMessage = claimMessage(result.check);
    if (!result.claim)
      throw Object.assign(new Error(checkMessage), { status: 409, responseSummary: { check: classicResponseSummary(result.check) } });
    const message = claimMessage(result.claim);
    const ok = result.claim?.object?.resultCode === "0";
    if (!ok) throw Object.assign(new Error(message), { status: 409, responseSummary: { check: classicResponseSummary(result.check), claim: classicResponseSummary(result.claim) } });
    return {
      ok: true,
      activityId: found.activityId,
      offerCode: definition.offerCode,
      offerName: definition.offerName,
      message,
      responses: {
        check: classicResponseSummary(result.check),
        claim: classicResponseSummary(result.claim),
      },
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

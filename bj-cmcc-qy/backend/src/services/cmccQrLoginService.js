import crypto from "node:crypto";

const LOGIN_ORIGIN = "https://login.10086.cn";
const WX_ORIGIN = "https://wx.10086.cn";
const DEFAULT_CHANNEL_ID = "12028";
const DEFAULT_BACK_URL = "https://wx.10086.cn/website/spa/main/newHome";
const FLOW_TTL_MS = 5 * 60 * 1000;
const MAX_REDIRECTS = 8;

const flows = new Map();

function now() {
  return Date.now();
}

function cleanupFlows() {
  const cutoff = now();
  for (const [flowId, flow] of flows.entries()) {
    if (flow.expiresAt <= cutoff) flows.delete(flowId);
  }
}

function toHeaderValue(headers, name) {
  return headers.get(name) || headers.get(name.toLowerCase()) || "";
}

function splitSetCookieHeader(headerValue) {
  if (!headerValue) return [];
  return String(headerValue).split(/,(?=\s*[^;,=\s]+=[^;,]+)/g).map((item) => item.trim()).filter(Boolean);
}

function getSetCookieList(headers) {
  if (typeof headers.getSetCookie === "function") return headers.getSetCookie();
  return splitSetCookieHeader(toHeaderValue(headers, "set-cookie"));
}

function cookiePair(setCookieValue) {
  return String(setCookieValue || "").split(";", 1)[0].trim();
}

function mergeSetCookie(cookieMap, setCookieHeaders) {
  for (const item of setCookieHeaders || []) {
    const pair = cookiePair(item);
    const eq = pair.indexOf("=");
    if (eq <= 0) continue;
    cookieMap.set(pair.slice(0, eq), pair.slice(eq + 1));
  }
}

function cookieHeader(cookieMap) {
  return [...cookieMap.entries()].map(([key, value]) => `${key}=${value}`).join("; ");
}

function publicCookieNames(cookieMap) {
  return [...cookieMap.keys()].sort();
}

function redactUrl(rawUrl) {
  if (!rawUrl) return "";
  try {
    const url = new URL(rawUrl);
    for (const key of [...url.searchParams.keys()]) url.searchParams.set(key, "<redacted>");
    return url.toString();
  } catch {
    return "";
  }
}

function decodePossiblyEncodedUrl(value) {
  let out = String(value || "");
  for (let i = 0; i < 3; i += 1) {
    try {
      const next = decodeURIComponent(out);
      if (next === out) break;
      out = next;
    } catch {
      break;
    }
  }
  return out;
}

function normalizeBackUrl(backUrl) {
  const candidate = decodePossiblyEncodedUrl(backUrl || DEFAULT_BACK_URL);
  let url;
  try {
    url = new URL(candidate);
  } catch {
    return DEFAULT_BACK_URL;
  }
  if (!["https:", "http:"].includes(url.protocol)) return DEFAULT_BACK_URL;
  if (!url.hostname.endsWith("10086.cn")) return DEFAULT_BACK_URL;
  return url.toString();
}

function getFlow(flowId) {
  cleanupFlows();
  const flow = flows.get(flowId);
  if (!flow) throw new Error("扫码会话不存在或已过期，请重新生成二维码");
  return flow;
}

async function fetchTextWithCookies(url, options, cookieMap) {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    ...(options?.headers || {})
  };
  const cookies = cookieHeader(cookieMap);
  if (cookies) headers.Cookie = cookies;

  const response = await fetch(url, {
    ...options,
    headers,
    redirect: "manual"
  });
  mergeSetCookie(cookieMap, getSetCookieList(response.headers));
  return {
    response,
    text: await response.text().catch(() => "")
  };
}

async function followRedirects(startUrl, cookieMap) {
  let current = startUrl;
  const visited = [];
  for (let i = 0; i < MAX_REDIRECTS; i += 1) {
    const { response, text } = await fetchTextWithCookies(current, {
      method: "GET",
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Referer: current
      }
    }, cookieMap);

    visited.push({
      url: redactUrl(current),
      status: response.status,
      cookieNames: publicCookieNames(cookieMap)
    });

    const location = toHeaderValue(response.headers, "location");
    if (response.status < 300 || response.status >= 400 || !location) {
      return { finalUrl: current, status: response.status, text, visited };
    }
    current = new URL(location, current).toString();
  }
  return { finalUrl: current, status: 0, text: "", visited };
}

function buildAssertUrl(data, flow) {
  const assertUrl = data.assertUrl || "https://wx.10086.cn/website/spa/complaint/list";
  const url = new URL(assertUrl, WX_ORIGIN);
  url.searchParams.set("backUrl", flow.backUrl);
  url.searchParams.set("artifact", data.artifact || "");
  return url.toString();
}

async function refreshNewHome(cookieMap) {
  const { response, text } = await fetchTextWithCookies(DEFAULT_BACK_URL, {
    method: "GET",
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      Referer: DEFAULT_BACK_URL
    }
  }, cookieMap);

  return {
    status: response.status,
    ok: response.status >= 200 && response.status < 400,
    hasUserScript: /var\s+user\s*=/.test(text),
    cookieNames: publicCookieNames(cookieMap)
  };
}

export async function createQrLoginFlow(options = {}) {
  cleanupFlows();
  const channelId = String(options.channelId || DEFAULT_CHANNEL_ID).trim() || DEFAULT_CHANNEL_ID;
  const backUrl = normalizeBackUrl(options.backUrl);
  const flowId = crypto.randomUUID();
  const cookieMap = new Map();

  const qrUrl = `${LOGIN_ORIGIN}/genqr.htm?timestamp=${Date.now()}`;
  const response = await fetch(qrUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      Referer: `${LOGIN_ORIGIN}/?channelID=${encodeURIComponent(channelId)}&backUrl=${encodeURIComponent(backUrl)}`
    }
  });
  const setCookie = getSetCookieList(response.headers);
  mergeSetCookie(cookieMap, setCookie);
  const imageBuffer = Buffer.from(await response.arrayBuffer());
  const lgToken = cookieMap.get("lgToken") || "";
  if (!response.ok || !imageBuffer.length || !lgToken) {
    throw new Error("二维码生成失败，未获取到 lgToken");
  }

  flows.set(flowId, {
    flowId,
    channelId,
    backUrl,
    lgToken,
    cookieMap,
    createdAt: now(),
    expiresAt: now() + FLOW_TTL_MS,
    status: "pending",
    lastMessage: "等待扫码"
  });

  return {
    flowId,
    expiresInSeconds: Math.floor(FLOW_TTL_MS / 1000),
    qrImage: `data:image/png;base64,${imageBuffer.toString("base64")}`,
    cookieNames: publicCookieNames(cookieMap),
    backUrl: redactUrl(backUrl)
  };
}

export async function pollQrLoginFlow(flowId) {
  const flow = getFlow(flowId);
  if (flow.status === "success") return summarizeFlow(flow);

  const body = new URLSearchParams({
    lgToken: flow.lgToken,
    targetChannelID: flow.channelId,
    backUrl: encodeURIComponent(flow.backUrl)
  }).toString();

  const { response, text } = await fetchTextWithCookies(`${LOGIN_ORIGIN}/chkqr.htm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "application/json, text/javascript, */*; q=0.01",
      Origin: LOGIN_ORIGIN,
      Referer: `${LOGIN_ORIGIN}/?channelID=${encodeURIComponent(flow.channelId)}&backUrl=${encodeURIComponent(flow.backUrl)}`,
      "X-Requested-With": "XMLHttpRequest"
    },
    body
  }, flow.cookieMap);

  const trimmed = text.trim();
  if (!trimmed) {
    flow.lastMessage = "等待 App 扫码确认";
    return summarizeFlow(flow, { upstreamStatus: response.status });
  }

  let data;
  try {
    data = JSON.parse(trimmed);
  } catch {
    flow.lastMessage = "轮询返回不是 JSON";
    return summarizeFlow(flow, { upstreamStatus: response.status, rawLength: trimmed.length });
  }

  if (data.resultCode === "0000") {
    const assertUrl = buildAssertUrl(data, flow);
    const redirect = await followRedirects(assertUrl, flow.cookieMap);
    const newHome = await refreshNewHome(flow.cookieMap);
    flow.status = "success";
    flow.lastMessage = "扫码确认成功，已尝试换取 10086 Cookie";
    flow.assertUrl = assertUrl;
    flow.finalUrl = redirect.finalUrl;
    flow.redirectTrace = redirect.visited;
    flow.newHome = newHome;
    return summarizeFlow(flow, {
      resultCode: data.resultCode,
      redirectTrace: redirect.visited,
      newHome
    });
  }

  if (data.resultCode === "8020") {
    flow.status = "expired";
    flow.lastMessage = "二维码已失效，请刷新二维码";
    return summarizeFlow(flow, { resultCode: data.resultCode });
  }

  flow.lastMessage = data.resultMsg || data.message || `等待扫码确认（${data.resultCode || "未知状态"}）`;
  return summarizeFlow(flow, { resultCode: data.resultCode });
}

export function getQrLoginCookie(flowId) {
  const flow = getFlow(flowId);
  if (flow.status !== "success") throw new Error("扫码尚未成功，暂无可用 Cookie");
  return {
    cookie: cookieHeader(flow.cookieMap),
    cookieNames: publicCookieNames(flow.cookieMap),
    cookieLength: cookieHeader(flow.cookieMap).length,
    newHome: flow.newHome || null
  };
}

function summarizeFlow(flow, extra = {}) {
  return {
    flowId: flow.flowId,
    status: flow.status,
    message: flow.lastMessage,
    cookieNames: publicCookieNames(flow.cookieMap),
    cookieLength: cookieHeader(flow.cookieMap).length,
    finalUrl: redactUrl(flow.finalUrl),
    expiresInSeconds: Math.max(0, Math.floor((flow.expiresAt - now()) / 1000)),
    ...extra
  };
}

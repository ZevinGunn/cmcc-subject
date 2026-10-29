const TOKEN_KEY = "bmcc_local_token";
const ACCOUNTS_KEY = "bmcc_accounts";
const PLUS99_ACCESS_KEY = "bmcc_plus99_new_access_code";
const API_RETRY_DELAY_MS = 350;
let sessionExpiredHandler = null;

function apiBase() {
  const path = window.location.pathname || "";
  if (path.startsWith("/app/bj-rights/")) return "/app/bj-rights/api";
  return "/api";
}

function withApiBase(path) {
  if (!path.startsWith("/api/")) return path;
  return `${apiBase()}${path.slice(4)}`;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveAccount(account) {
  const phoneNo = account?.user?.phoneNo || "";
  const accounts = getAccounts().filter(
    (item) =>
      item.localToken !== account.localToken &&
      item.label !== account.label &&
      (phoneNo ? item?.user?.phoneNo !== phoneNo : true)
  );
  accounts.unshift({ ...account, updatedAt: Date.now() });
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts.slice(0, 10)));
}

export function removeAccount(localToken) {
  const accounts = getAccounts().filter((item) => item.localToken !== localToken);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  if (getToken() === localToken) setToken(accounts[0]?.localToken || "");
  return accounts;
}

export function setSessionExpiredHandler(handler) {
  sessionExpiredHandler = typeof handler === "function" ? handler : null;
}

export function getPlus99AccessCode() {
  return localStorage.getItem(PLUS99_ACCESS_KEY) || "";
}

export function setPlus99AccessCode(code) {
  if (code) localStorage.setItem(PLUS99_ACCESS_KEY, code);
  else localStorage.removeItem(PLUS99_ACCESS_KEY);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function compactText(text) {
  return String(text || "").replace(/\s+/g, " ").trim().slice(0, 120);
}

function nonJsonMessage(resp, text) {
  const snippet = compactText(text);
  const contentType = resp.headers.get("content-type") || "";
  if (!text) return `接口返回为空（HTTP ${resp.status}）`;
  if (contentType.includes("text/html") || snippet.startsWith("<!doctype") || snippet.startsWith("<html")) {
    return `接口临时返回了页面内容（HTTP ${resp.status}），请稍后重试`;
  }
  return `接口返回格式异常（HTTP ${resp.status}${snippet ? `：${snippet}` : ""}）`;
}

async function readApiJson(resp) {
  const text = await resp.text();
  if (!text) {
    return { ok: false, json: { ok: false, message: nonJsonMessage(resp, text) }, text };
  }
  try {
    return { ok: true, json: JSON.parse(text), text };
  } catch {
    return { ok: false, json: { ok: false, message: nonJsonMessage(resp, text) }, text };
  }
}

function shouldRetryApiResponse(resp, parsed) {
  if (resp.status === 429) return false;
  if (resp.status >= 500) return true;
  return !parsed.ok;
}

export async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  const token = getToken();
  if (token) headers["x-local-token"] = token;
  const plus99AccessCode = getPlus99AccessCode();
  if (plus99AccessCode && path.startsWith("/api/plus99-new")) {
    headers["x-plus99-access-code"] = plus99AccessCode;
  }

  const request = {
    ...options,
    headers,
    body: options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body
  };
  const url = withApiBase(path);
  let resp;
  let json;
  let lastNetworkError = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      resp = await fetch(url, request);
      const parsed = await readApiJson(resp);
      json = parsed.json;
      if (parsed.ok || attempt > 0 || !shouldRetryApiResponse(resp, parsed)) break;
      await sleep(API_RETRY_DELAY_MS);
    } catch (error) {
      lastNetworkError = error;
      if (attempt > 0) throw error;
      await sleep(API_RETRY_DELAY_MS);
    }
  }

  if (!resp || !json) {
    throw lastNetworkError || new Error("接口请求失败");
  }

  if (!resp.ok || json.ok === false) {
    const error = new Error(json.message || `HTTP ${resp.status}`);
    error.status = resp.status;
    if (
      resp.status === 401 ||
      String(error.message).includes("未登录或登录信息失效") ||
      String(error.message).includes("请先登录")
    ) {
      sessionExpiredHandler?.(error);
    }
    throw error;
  }
  if (isBusinessSessionExpired(json.data)) {
    const error = new Error("登录已失效，请重新登录");
    error.status = 401;
    sessionExpiredHandler?.(error);
    throw error;
  }
  return json.data;
}

function isBusinessSessionExpired(data) {
  const candidates = [data, data?.result, data?.raw].filter(Boolean);
  return candidates.some((item) => {
    const message = String(item.resultMsg || item.message || "");
    return item.resultCode === "-1" && (message.includes("未登录") || message.includes("登录信息失效") || message.includes("请先登录"));
  });
}

export const endpoints = {
  sendLoginSms: (phone) => api("/api/auth/sms/send", { method: "POST", body: { phone } }),
  login: (phone, code) => api("/api/auth/sms/login", { method: "POST", body: { phone, code, retailerCode: 'BJYDJTAPP001', sonRetailerCode: 'A004' } }),
  loginWithGroupToken: (body) => api("/api/auth/group-token/login", { method: "POST", body }),
  startAppQrLogin: (body = {}) => api("/api/auth/app-qr/start", { method: "POST", body }),
  pollAppQrLogin: (flowId) => api("/api/auth/app-qr/poll", { method: "POST", body: { flowId } }),
  getAppQrCookie: (flowId) => api("/api/auth/app-qr/cookie", { method: "POST", body: { flowId } }),
  me: () => api("/api/auth/me"),
  refreshUser: () => api("/api/auth/refresh", { method: "POST", body: {} }),
  logout: () => api("/api/auth/logout", { method: "POST", body: {} }),
  coupons: () => api("/api/coupons/summary"),
  rights: (query = {}) => api(`/api/rights?${new URLSearchParams(query).toString()}`),
  plusPackages: () => api("/api/rights/plus-packages"),
  rightDetail: (legalRightsNbr) => api(`/api/rights/${encodeURIComponent(legalRightsNbr)}`),
  previewExchange: (body) => api("/api/exchange/preview", { method: "POST", body }),
  submitExchange: (body) => api("/api/exchange/submit", { method: "POST", body: { ...body, confirmed: true } }),
  quickRightExchange: (body) => api("/api/exchange/quick-right", { method: "POST", body: { ...body, confirmed: true } }),
  sendExchangeSms: (body) => api("/api/exchange/sms/send", { method: "POST", body }),
  submitLimitMore: (body) => api("/api/exchange/limit-more", { method: "POST", body: { ...body, confirmed: true } }),
  orders: (query = {}) => api(`/api/orders?${new URLSearchParams(query).toString()}`),
  orderDetail: (id) => api(`/api/orders/${encodeURIComponent(id)}`),
  fortuneRights: () => api("/api/fortune/rights"),
  fortuneSearch: (keyword) => api(`/api/fortune/search?${new URLSearchParams({ keyword }).toString()}`),
  batchExchange: (items) => api("/api/fortune/batch-exchange", { method: "POST", body: { items, confirmed: true } }),
  syncExchange: (item) => api("/api/fortune/sync-exchange", { method: "POST", body: { item, confirmed: true } }),
  fortuneOrders: (query = {}) => api(`/api/fortune/orders?${new URLSearchParams(query).toString()}`),
  codeDetail: (body) => api("/api/fortune/codes/detail", { method: "POST", body }),
  targetCodes: (target) => api(`/api/fortune/codes/${target}`),
  plus99NewSummary: () => api("/api/plus99-new/summary"),
  plus99NewCore: () => api("/api/plus99-new/core"),
  plus99NewCommon: () => api("/api/plus99-new/common"),
  plus99NewDiscount: () => api("/api/plus99-new/discount"),
  plus99NewExclusive: () => api("/api/plus99-new/exclusive"),
  plus99NewDetail: (legalRightsNbr) => api(`/api/plus99-new/detail/${encodeURIComponent(legalRightsNbr)}`),
  plus99NewNeedSms: (body) => api("/api/plus99-new/sms/need", { method: "POST", body }),
  sendPlus99NewSms: (body) => api("/api/plus99-new/sms/send", { method: "POST", body }),
  plus99NewClaim: (body) => api("/api/plus99-new/claim", { method: "POST", body: { ...body, confirmed: true } }),
  plus99NewExclusiveClaim: (body) => api("/api/plus99-new/exclusive/claim", { method: "POST", body: { ...body, confirmed: true } }),
  offerOrderNeedSms: (body) => api("/api/offer-order/sms/need", { method: "POST", body }),
  sendOfferOrderSms: (body) => api("/api/offer-order/sms/send", { method: "POST", body }),
  submitOfferOrder: (body) => api("/api/offer-order/submit", { method: "POST", body: { ...body, confirmed: true } })
};

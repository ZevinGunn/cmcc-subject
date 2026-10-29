import { encryptServicePassword } from "./crypto189.js";

export function isTelecomSuccess(response) {
  if (!response?.ok || !response.data || typeof response.data !== "object") return false;
  const { result, retCode } = response.data;
  return (result != null || retCode != null)
    && (result == null || String(result) === "0")
    && (retCode == null || String(retCode) === "000000");
}

export function responseMessage(response, fallback) {
  if (!response?.ok) {
    const failureType = response?.diagnostic?.failureType;
    if (failureType === "timeout") return "电信接口请求超时，请稍后重试";
    if (failureType === "abort") return "电信请求被页面刷新中止，请稍后重试";
    return `电信接口暂不可用（HTTP ${response?.status || 0}），请稍后重试`;
  }
  if (!response.data || typeof response.data !== "object") return "电信未返回有效登录结果，请稍后重试";
  return typeof response.data.retMsg === "string" ? response.data.retMsg.slice(0, 200) : fallback;
}

function safeText(value, limit = 180) {
  return String(value || "")
    .replace(/(?:password|passwd|pwd|token|cookie|authorization)\s*[:=：]\s*[^,;\s]+/gi, "敏感字段=[已隐藏]")
    .replace(/1\d{10}/g, "手机号")
    .slice(0, limit);
}

export function responseDiagnostic(response, stage = "unknown") {
  const status = Number(response?.status || 0);
  const failureType = response?.diagnostic?.failureType;
  const retMsg = typeof response?.data?.retMsg === "string"
    ? safeText(response.data.retMsg)
    : "";
  let category = "unknown";
  if (failureType === "timeout") category = "timeout";
  else if (failureType === "abort") category = "page_reloaded";
  else if (status === 412) category = "waf_challenge";
  else if ([502, 503, 504].includes(status)) category = "upstream_unavailable";
  else if (!response?.ok || status === 0) category = "network_error";
  else if (status >= 400) category = "http_error";
  else if (response?.data && typeof response.data === "object") {
    const code = String(response.data.retCode ?? response.data.result ?? "");
    if (isTelecomSuccess(response)) category = "success";
    else if (/密码|password|credential/i.test(retMsg)) category = "password_rejected";
    else if (code && code !== "0" && code !== "000000") category = "business_rejected";
    else category = "business_rejected";
  }
  return { stage, status, category, ...(failureType ? { failureType } : {}), result: response?.data?.result, retCode: response?.data?.retCode, retMsg };
}

async function requestAtStage(request, endpoint, data, stage, reinitialize = false) {
  try {
    return await request(endpoint, data, { stage, reinitialize });
  } catch (error) {
    error.loginStage = stage;
    throw error;
  }
}

export function loginErrorDiagnostic(error) {
  const message = String(error?.message || "");
  let category = "connection_failed";
  if (/timeout/i.test(error?.name || "") || /timed out|timeout/i.test(message)) category = "timeout";
  else if (/executable.*exist|browser.*install|ENOENT/i.test(message)) category = "engine_unavailable";
  else if (/execution context.*destroyed|frame.*detached|ERR_ABORTED/i.test(message)) category = "page_reloaded";
  else if (/target.*closed|browser.*closed/i.test(message)) category = "engine_closed";
  else if (/net::|network/i.test(message)) category = "network_error";
  const stages = ["initialization", "password_submission", "account_confirmation"];
  const status = Number(error?.status || 0);
  return { stage: stages.includes(error?.loginStage) ? error.loginStage : "initialization", category, ...(status ? { status } : {}) };
}

export async function performPasswordLogin(phone, password, request) {
  if (!/^1\d{10}$/.test(phone) || !/^\d{1,32}$/.test(password)) {
    const error = new Error("请输入 11 位手机号和数字服务密码（最多 32 位）");
    error.status = 400;
    throw error;
  }
  // Confirm that initialization reached the business API before sending credentials.
  let initialized;
  let initializationAttempts = 0;
  for (let attempt = 0; attempt < 2; attempt++) {
    initializationAttempts = attempt + 1;
    try {
      initialized = await requestAtStage(request, "/wap2017/re/activity/qryLoginAccno", {}, "initialization", attempt > 0);
    } catch (error) {
      if (attempt === 0) continue;
      throw error;
    }
    if (isTelecomSuccess(initialized)) break;
    // Only the anonymous handshake is retried; credentials are never replayed.
    const retryable = [0, 400, 408, 412, 502, 503, 504].includes(initialized?.status)
      || (initialized?.ok && typeof initialized.data !== "object");
    if (!retryable) break;
  }
  if (!isTelecomSuccess(initialized)) {
    return { ok: false, message: responseMessage(initialized, "电信会话初始化失败"), initialization: initialized, initializationAttempts, login: null, loginAccount: null };
  }
  const login = await requestAtStage(request, "/wap2017/re/wapFree/cancelAccount/passwordCheck", {
    phoneNum: phone,
    password: encryptServicePassword(password)
  }, "password_submission");
  if (!isTelecomSuccess(login)) {
    return { ok: false, message: responseMessage(login, "登录失败，请检查服务密码"), initialization: initialized, initializationAttempts, login, loginAccount: null };
  }
  const loginAccount = await requestAtStage(request, "/wap2017/re/activity/qryLoginAccno", {}, "account_confirmation");
  const ok = isTelecomSuccess(loginAccount) && loginAccount.data.object === phone;
  return {
    ok,
    message: ok ? "登录成功" : "登录号码未通过核验，请重新登录",
    initialization: initialized,
    initializationAttempts,
    login,
    loginAccount
  };
}

// Login logs and responses must never echo passwords, cookies, or upstream tokens.
export function loginSummary(response, stage = "unknown") {
  if (!response) return null;
  return {
    status: response.status,
    result: response.data?.result,
    retCode: response.data?.retCode,
    ...(typeof response.data?.retMsg === "string" ? { retMsg: safeText(response.data.retMsg) } : {}),
    ...(stage !== "unknown" ? { stage, response: responseDiagnostic(response, stage) } : {}),
    diagnostic: response.diagnostic
  };
}

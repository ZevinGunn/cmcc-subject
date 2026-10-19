import { encryptServicePassword } from "./crypto189.js";

export function isTelecomSuccess(response) {
  if (!response?.ok || !response.data || typeof response.data !== "object") return false;
  const { result, retCode } = response.data;
  return (result != null || retCode != null)
    && (result == null || String(result) === "0")
    && (retCode == null || String(retCode) === "000000");
}

export function responseMessage(response, fallback) {
  if (!response?.ok) return `电信接口暂不可用（HTTP ${response?.status || 0}），请稍后重试`;
  if (!response.data || typeof response.data !== "object") return "电信未返回有效登录结果，请稍后重试";
  return typeof response.data.retMsg === "string" ? response.data.retMsg.slice(0, 200) : fallback;
}

export async function performPasswordLogin(phone, password, request) {
  if (!/^1\d{10}$/.test(phone) || !/^\d{1,32}$/.test(password)) {
    const error = new Error("请输入 11 位手机号和数字服务密码（最多 32 位）");
    error.status = 400;
    throw error;
  }
  // Confirm that initialization reached the business API before sending credentials.
  const initialized = await request("/wap2017/re/activity/qryLoginAccno", {});
  if (!isTelecomSuccess(initialized)) {
    return { ok: false, message: responseMessage(initialized, "电信会话初始化失败"), login: null, loginAccount: null };
  }
  const login = await request("/wap2017/re/wapFree/cancelAccount/passwordCheck", {
    phoneNum: phone,
    password: encryptServicePassword(password)
  });
  if (!isTelecomSuccess(login)) {
    return { ok: false, message: responseMessage(login, "登录失败，请检查服务密码"), login, loginAccount: null };
  }
  const loginAccount = await request("/wap2017/re/activity/qryLoginAccno", {});
  const ok = isTelecomSuccess(loginAccount) && loginAccount.data.object === phone;
  return {
    ok,
    message: ok ? "登录成功" : "登录号码未通过核验，请重新登录",
    login,
    loginAccount
  };
}

// Login logs and responses must never echo passwords, cookies, or upstream tokens.
export function loginSummary(response) {
  if (!response) return null;
  return {
    status: response.status,
    result: response.data?.result,
    retCode: response.data?.retCode,
    diagnostic: response.diagnostic
  };
}

import { clientFor } from "../bmccClient.js";
import { config } from "../config.js";
import { createSession, deleteSession, publicUser, updateSession } from "../sessionStore.js";

export async function sendLoginSms(phone) {
  return clientFor().invoke("SMS_VERI_CODE_SEND", { receviNo: phone }, { public: true });
}

export async function loginWithSms(phone, verificationCode, retailer = {}) {
  const result = await clientFor().invoke("APP_LOGIN_CHK_SMS", {
    receviNo: phone,
    verificationCode,
    retailerCode: retailer.retailerCode || config.defaultRetailerCode,
    sonRetailerCode: retailer.sonRetailerCode || config.defaultSonRetailerCode
  });

  if (result.resultCode !== "0" || !result.data) return { result };
  const localToken = createSession(result.data);
  return { result, localToken, user: publicUser({ userInfo: result.data, sessKey: result.data.sessKey }) };
}

export async function loginWithGroupToken(token, options = {}) {
  const phone = String(options.phone || "").trim();
  const body = {
    sonRetailerCode: options.sonRetailerCode || "P20251005001",
    retailerCode: options.retailerCode || config.defaultRetailerCode,
    token,
    phoneNetCheckMethod: options.phoneNetCheckMethod || "1"
  };

  const result = await clientFor().invoke("GROUP_TOKEN_VALIDATE", body, {
    traceMemberPhone: phone || undefined
  });

  if (result.resultCode !== "0" || !result.data) return { result };
  const userInfo = {
    ...result.data,
    phoneNo: result.data.phoneNo || result.data.memberInfo?.phoneNo || phone || ""
  };
  const localToken = createSession(userInfo);
  return { result, localToken, user: publicUser({ userInfo, sessKey: userInfo.sessKey }) };
}

export function logout(localToken) {
  deleteSession(localToken);
}

export async function refreshUser(localToken, session) {
  const result = await clientFor(session).invoke("GET_USER_INFO", {});
  if (result.resultCode === "0" && result.data) {
    updateSession(localToken, {
      userInfo: { ...session.userInfo, ...result.data },
      sessKey: result.data.sessKey || session.sessKey
    });
  }
  return result;
}

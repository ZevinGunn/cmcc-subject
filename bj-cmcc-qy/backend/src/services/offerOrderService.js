import { clientFor } from "../bmccClient.js";

export async function queryOfferNeedSms(session, payload) {
  return normalizeOfferResult(
    await clientFor(session).invoke("BIZ_NEED_CONFIRM_SMS_QRY", buildOfferOrderBody(payload)),
    "BIZ_NEED_CONFIRM_SMS_QRY"
  );
}

export async function sendOfferConfirmSms(session, payload) {
  return normalizeOfferResult(
    await clientFor(session).invoke("BIZ_CONFIRM_SMS_SEND", buildOfferOrderBody(payload)),
    "BIZ_CONFIRM_SMS_SEND"
  );
}

export async function submitOfferOrder(session, payload = {}) {
  return normalizeOfferResult(
    await clientFor(session).invoke("INNER_OPEN_MEMBER_SHIP", buildOfferOrderBody(payload, true), { showToast: true }),
    "INNER_OPEN_MEMBER_SHIP"
  );
}

export function buildOfferOrderBody(payload = {}, includeVerifyCode = false) {
  const source = payload && typeof payload === "object" ? payload : { offerId: payload };
  const offerId = String(source.offerId ?? "").trim();
  const offerType = String(source.offerType ?? "").trim();
  const verifyCode = String(source.verifyCode ?? "").trim();
  const body = { offerId };
  if (offerType) body.offerType = offerType;
  if (includeVerifyCode && verifyCode) body.verifyCode = verifyCode;
  return body;
}

function normalizeOfferResult(result, abilityCode) {
  const resultCode = String(result?.resultCode ?? "");
  return {
    abilityCode,
    success: resultCode === "0",
    resultCode,
    resultMsg: result?.resultMsg || "",
    body: result?.data,
    transactionId: result?.raw?.transactionId || "",
    raw: result?.raw || result,
    debug: result?._debug || null
  };
}

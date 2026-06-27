import { clientFor } from "../bmccClient.js";

export async function queryOfferNeedSms(session, offerId) {
  return normalizeOfferResult(
    await clientFor(session).invoke("BIZ_NEED_CONFIRM_SMS_QRY", { offerId }),
    "BIZ_NEED_CONFIRM_SMS_QRY"
  );
}

export async function sendOfferConfirmSms(session, offerId) {
  return normalizeOfferResult(
    await clientFor(session).invoke("BIZ_CONFIRM_SMS_SEND", { offerId }),
    "BIZ_CONFIRM_SMS_SEND"
  );
}

export async function submitOfferOrder(session, payload = {}) {
  const body = { offerId: payload.offerId };
  if (payload.verifyCode) body.verifyCode = payload.verifyCode;
  return normalizeOfferResult(
    await clientFor(session).invoke("INNER_OPEN_MEMBER_SHIP", body, { showToast: true }),
    "INNER_OPEN_MEMBER_SHIP"
  );
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

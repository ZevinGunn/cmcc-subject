import { clientFor } from "../bmccClient.js";
import { queryCouponSummary, summarizeCoupon } from "./couponService.js";
import { queryRightDetail } from "./rightsService.js";
import { couponEnough } from "./rightsCatalog.js";

const UNIVERSAL_CERTIFICATE_ID = "1387830401690525697";

export async function previewExchange(session, payload) {
  const legalRightsNbr = payload.legalRightsNbr || payload.rightCode;
  const [rightResult, couponResult] = await Promise.all([
    queryRightDetail(session, legalRightsNbr),
    queryCouponSummary(session)
  ]);

  const right = rightResult.item;
  const coupon = summarizeCoupon(couponResult.data || {});
  return {
    rightResult,
    couponResult,
    preview: {
      canSubmit: Boolean(
        right?.offerId &&
          right?.legalRightsId &&
          couponEnough(couponResult.data, right, payload.certificateId || payload.defaultCertificateId || UNIVERSAL_CERTIFICATE_ID)
      ),
      right,
      coupon,
      submitPayload: right
        ? {
            offerId: payload.offerId || right.offerId,
            rightCode: right.legalRightsNbr,
            rightId: right.legalRightsId,
            certificateId: payload.certificateId || payload.defaultCertificateId || UNIVERSAL_CERTIFICATE_ID,
            certificateNum: right.certificateNum || right.exchangeNum || 0
          }
        : null
    }
  };
}

export async function submitExchange(session, payload) {
  const requestBody = {
    offerId: payload.offerId,
    rightCode: payload.rightCode,
    rightId: payload.rightId,
    certificateId: payload.certificateId,
    certificateNum: payload.certificateNum,
    checkSwitch: false
  };
  if (payload.verifyCode) requestBody.verifyCode = payload.verifyCode;
  if (payload.wtAc) requestBody.wtAc = payload.wtAc;
  if (payload.wtAcId) requestBody.wtAcId = payload.wtAcId;

  return clientFor(session).invoke("COUPON_OPEN_TEL_FEE_AUTH", requestBody, { showToast: true });
}

export async function quickRightExchange(session, payload = {}) {
  const requestBody = {
    accNbr: payload.accNbr || session?.userInfo?.phoneNo,
    offerId: payload.offerId,
    rightCode: payload.rightCode || payload.legalRightsNbr,
    memberLevelCode: payload.memberLevelCode || "1"
  };

  if (!requestBody.accNbr) throw new Error("当前会话缺少手机号 accNbr");
  if (!requestBody.offerId) throw new Error("缺少兑换参数 offerId");
  if (!requestBody.rightCode) throw new Error("缺少兑换参数 rightCode");

  return clientFor(session).invoke("INNER_OPEN_TEL_FEE_AUTH", requestBody, { showToast: true });
}

export async function sendBizConfirmSms(session, payload) {
  return clientFor(session).invoke("BIZ_CONFIRM_SMS_SEND", payload);
}

export async function submitLimitMore(session, payload) {
  return clientFor(session).invoke("OPEN_TEL_AUTH_LIMIT_MORE", await buildLimitMoreBody(session, payload), { showToast: true });
}

async function buildLimitMoreBody(session, payload = {}) {
  const legalRightsNbr = payload.legalRightsNbr || payload.rightCode;
  const body = {};

  if (legalRightsNbr) {
    const rightResult = await queryRightDetail(session, legalRightsNbr);
    const right = rightResult.item;
    if (!right) {
      throw new Error(`未查询到权益编号 ${legalRightsNbr}`);
    }
    body.offerId = payload.offerId || right.offerId;
    body.rightCode = right.legalRightsNbr;
    body.rightId = right.legalRightsId;
  } else {
    body.offerId = payload.offerId;
    if (payload.rightCode) body.rightCode = payload.rightCode;
    if (payload.rightId) body.rightId = payload.rightId;
  }

  if (payload.verifyCode) body.verifyCode = payload.verifyCode;
  if (payload.wtAc) body.wtAc = payload.wtAc;
  if (payload.wtAcId) body.wtAcId = payload.wtAcId;

  if (!body.offerId) {
    throw new Error("请输入 offerId 或 legalRightsNbr");
  }
  if (legalRightsNbr && (!body.rightCode || !body.rightId)) {
    throw new Error("权益订购参数不完整，缺少 rightCode 或 rightId");
  }

  return body;
}

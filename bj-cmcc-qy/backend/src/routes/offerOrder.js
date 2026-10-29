import { Router } from "express";
import { maskPhone } from "../sessionStore.js";
import { appendOfferOrderLog } from "../services/offerOrderLogService.js";
import { queryOfferNeedSms, sendOfferConfirmSms, submitOfferOrder } from "../services/offerOrderService.js";
import { fail, ok, requireSession } from "../utils/http.js";

export const offerOrderRouter = Router();

offerOrderRouter.use(requireSession);

offerOrderRouter.post("/sms/need", async (req, res) => {
  try {
    const offerConfig = cleanOfferConfig(req.body);
    if (!offerConfig.offerId) return fail(res, "请输入 offerId");
    ok(res, await queryOfferNeedSms(req.session, offerConfig));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

offerOrderRouter.post("/sms/send", async (req, res) => {
  try {
    const offerConfig = cleanOfferConfig(req.body);
    if (!offerConfig.offerId) return fail(res, "请输入 offerId");
    ok(res, await sendOfferConfirmSms(req.session, offerConfig));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

offerOrderRouter.post("/submit", async (req, res) => {
  let logContext = null;
  try {
    const { confirmed } = req.body || {};
    if (confirmed !== true) return fail(res, "订购需要 confirmed=true 二次确认");
    const offerConfig = cleanOfferConfig(req.body);
    if (!offerConfig.offerId) return fail(res, "请输入 offerId");

    logContext = {
      ...offerConfig,
      businessName: cleanText(req.body?.businessName),
      verifyCode: cleanText(req.body?.verifyCode)
    };

    const result = await submitOfferOrder(req.session, {
      ...offerConfig,
      verifyCode: logContext.verifyCode
    });

    appendOfferOrderLog(buildSubmitLog(req, logContext, result));
    ok(res, result);
  } catch (error) {
    if (logContext) {
      appendOfferOrderLog(buildSubmitLog(req, logContext, null, error));
    }
    fail(res, error.message, 500);
  }
});

function cleanOfferId(value) {
  return String(value ?? "").trim();
}

function cleanText(value) {
  return String(value ?? "").trim();
}

function cleanOfferConfig(body = {}) {
  return {
    offerId: cleanOfferId(body?.offerId),
    offerType: cleanText(body?.offerType)
  };
}

function buildSubmitLog(req, context, result, error = null) {
  const phoneNo = req.session?.userInfo?.phoneNo || "";
  const success = error ? false : Boolean(result?.success);
  return {
    action: "offer-order-submit",
    phoneNo,
    maskedPhone: maskPhone(phoneNo),
    businessName: context.businessName,
    offerId: context.offerId,
    offerType: context.offerType,
    verifyCode: context.verifyCode,
    success,
    resultCode: error ? "EXCEPTION" : result?.resultCode || "",
    resultMsg: error ? error.message : result?.resultMsg || "",
    transactionId: result?.transactionId || "",
    abilityCode: result?.abilityCode || "INNER_OPEN_MEMBER_SHIP"
  };
}

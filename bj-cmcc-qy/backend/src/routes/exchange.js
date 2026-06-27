import { Router } from "express";
import { previewExchange, quickRightExchange, sendBizConfirmSms, submitExchange, submitLimitMore } from "../services/exchangeService.js";
import { fail, ok, requireSession } from "../utils/http.js";

export const exchangeRouter = Router();

exchangeRouter.post("/preview", requireSession, async (req, res) => {
  try {
    ok(res, await previewExchange(req.session, req.body || {}));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

exchangeRouter.post("/submit", requireSession, async (req, res) => {
  try {
    const { confirmed, ...payload } = req.body || {};
    if (confirmed !== true) return fail(res, "兑换需要 confirmed=true 二次确认");
    for (const field of ["offerId", "rightCode", "rightId", "certificateId"]) {
      if (!payload[field]) return fail(res, `缺少兑换参数 ${field}`);
    }
    ok(res, await submitExchange(req.session, payload));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

exchangeRouter.post("/sms/send", requireSession, async (req, res) => {
  try {
    ok(res, await sendBizConfirmSms(req.session, req.body || {}));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

exchangeRouter.post("/limit-more", requireSession, async (req, res) => {
  try {
    const { confirmed, ...payload } = req.body || {};
    if (confirmed !== true) return fail(res, "订购需要 confirmed=true 二次确认");
    ok(res, await submitLimitMore(req.session, payload));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

exchangeRouter.post("/quick-right", requireSession, async (req, res) => {
  try {
    const { confirmed, ...payload } = req.body || {};
    if (confirmed !== true) return fail(res, "兑换需要 confirmed=true 二次确认");
    ok(res, await quickRightExchange(req.session, payload));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

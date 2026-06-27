import { Router } from "express";
import { batchExchange, queryFortuneBag, searchFortuneBag, syncExchangeOne, targetCouponCodes } from "../services/fortuneBagService.js";
import { queryAllOrders, queryCertificateCodes } from "../services/orderService.js";
import { fail, ok, requireSession } from "../utils/http.js";

export const fortuneRouter = Router();

fortuneRouter.get("/rights", requireSession, async (req, res) => {
  try {
    ok(res, await queryFortuneBag(req.session, req.query));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

fortuneRouter.get("/search", requireSession, async (req, res) => {
  try {
    ok(res, await searchFortuneBag(req.session, req.query.keyword || req.query.legalRightsName || ""));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

fortuneRouter.post("/batch-exchange", requireSession, async (req, res) => {
  try {
    const { confirmed, items = [] } = req.body || {};
    if (confirmed !== true) return fail(res, "批量兑换需要 confirmed=true 二次确认");
    if (!Array.isArray(items) || !items.length) return fail(res, "购物车为空");
    ok(res, await batchExchange(req.session, items));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

fortuneRouter.post("/sync-exchange", requireSession, async (req, res) => {
  try {
    const { confirmed, item } = req.body || {};
    if (confirmed !== true) return fail(res, "同步兑换需要 confirmed=true 二次确认");
    if (!item || typeof item !== "object") return fail(res, "兑换权益不能为空");
    ok(res, await syncExchangeOne(req.session, item));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

fortuneRouter.get("/orders", requireSession, async (req, res) => {
  try {
    ok(res, await queryAllOrders(req.session, req.query || {}));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

fortuneRouter.post("/codes/detail", requireSession, async (req, res) => {
  try {
    ok(res, await queryCertificateCodes(req.session, req.body || {}));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

fortuneRouter.get("/codes/:target", requireSession, async (req, res) => {
  try {
    ok(res, await targetCouponCodes(req.session, req.params.target));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

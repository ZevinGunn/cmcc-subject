import { Router } from "express";
import { queryCouponSummary, summarizeCoupon } from "../services/couponService.js";
import { fail, ok, requireSession } from "../utils/http.js";

export const couponsRouter = Router();

couponsRouter.get("/summary", requireSession, async (req, res) => {
  try {
    const result = await queryCouponSummary(req.session);
    if (result.resultCode !== "0") {
      return fail(res, result.resultMsg || "优惠券数量查询失败", 400, result);
    }
    ok(res, { result, summary: summarizeCoupon(result.data || {}) });
  } catch (error) {
    fail(res, error.message, 500);
  }
});

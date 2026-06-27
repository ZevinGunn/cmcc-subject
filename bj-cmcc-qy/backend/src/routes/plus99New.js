import { Router } from "express";
import { config } from "../config.js";
import {
  claimPlus99NewExclusive,
  claimPlus99NewRight,
  queryActivityInfo,
  queryCommonRights,
  queryCoreRights,
  queryDiscountRights,
  queryExclusiveRights,
  queryPlus99NewNeedSms,
  queryPlus99NewDetail,
  queryPlus99NewSummary,
  sendPlus99NewSms
} from "../services/plus99NewService.js";
import { fail, ok, requireSession } from "../utils/http.js";

export const plus99NewRouter = Router();

plus99NewRouter.use(requirePlus99NewAccess);
plus99NewRouter.use(requireSession);

plus99NewRouter.get("/summary", async (req, res) => {
  try {
    ok(res, await queryPlus99NewSummary(req.session));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

plus99NewRouter.get("/core", async (req, res) => {
  try {
    ok(res, await queryCoreRights(req.session));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

plus99NewRouter.get("/common", async (req, res) => {
  try {
    ok(res, await queryCommonRights(req.session));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

plus99NewRouter.get("/discount", async (req, res) => {
  try {
    ok(res, {
      activity: await queryActivityInfo(req.session),
      list: await queryDiscountRights(req.session)
    });
  } catch (error) {
    fail(res, error.message, 500);
  }
});

plus99NewRouter.get("/exclusive", async (req, res) => {
  try {
    ok(res, { list: await queryExclusiveRights(req.session) });
  } catch (error) {
    fail(res, error.message, 500);
  }
});

plus99NewRouter.get("/detail/:legalRightsNbr", async (req, res) => {
  try {
    ok(res, await queryPlus99NewDetail(req.session, req.params.legalRightsNbr));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

plus99NewRouter.post("/sms/need", async (req, res) => {
  try {
    const { rightsCode, legalRightsNbr, legalRightsCode, rightCode } = req.body || {};
    if (!(rightsCode || legalRightsNbr || legalRightsCode || rightCode)) return fail(res, "缺少权益编码 rightsCode");
    ok(res, await queryPlus99NewNeedSms(req.session, req.body || {}));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

plus99NewRouter.post("/sms/send", async (req, res) => {
  try {
    const { rightsCode, legalRightsNbr, legalRightsCode, rightCode } = req.body || {};
    if (!(rightsCode || legalRightsNbr || legalRightsCode || rightCode)) return fail(res, "缺少权益编码 rightsCode");
    ok(res, await sendPlus99NewSms(req.session, req.body || {}));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

plus99NewRouter.post("/claim", async (req, res) => {
  try {
    const { confirmed, legalRightsCode, legalRightsNbr, rightCode } = req.body || {};
    if (confirmed !== true) return fail(res, "99plus 权益订购需要 confirmed=true 二次确认");
    if (!(legalRightsCode || legalRightsNbr || rightCode)) return fail(res, "缺少权益编码 legalRightsCode");
    ok(res, await claimPlus99NewRight(req.session, req.body || {}));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

plus99NewRouter.post("/exclusive/claim", async (req, res) => {
  try {
    const { confirmed, discountType, batchId, actId } = req.body || {};
    if (confirmed !== true) return fail(res, "99plus 专属权益领取需要 confirmed=true 二次确认");
    if (!discountType || !batchId || !actId) return fail(res, "缺少专属权益领取参数");
    ok(res, await claimPlus99NewExclusive(req.session, req.body || {}));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

function requirePlus99NewAccess(req, res, next) {
  if (!config.plus99NewAccessCode) return next();
  const code = req.headers["x-plus99-access-code"] || req.query.accessCode || req.body?.accessCode;
  if (String(code || "") !== String(config.plus99NewAccessCode)) {
    return fail(res, "无权访问 99plus 新权益页面", 403);
  }
  next();
}

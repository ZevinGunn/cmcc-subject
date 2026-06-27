import { Router } from "express";
import { clientFor } from "../bmccClient.js";
import { fail, ok, requireSession } from "../utils/http.js";

export const debugRouter = Router();

debugRouter.post("/invoke", requireSession, async (req, res) => {
  try {
    const { abilityCode, body = {} } = req.body || {};
    if (!abilityCode) return fail(res, "缺少 abilityCode");
    ok(res, await clientFor(req.session).invoke(abilityCode, body));
  } catch (error) {
    fail(res, error.message, 500);
  }
});


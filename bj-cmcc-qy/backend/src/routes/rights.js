import { Router } from "express";
import { plusPackages, queryRightDetail, queryRights } from "../services/rightsService.js";
import { fail, ok, requireSession } from "../utils/http.js";

export const rightsRouter = Router();

rightsRouter.get("/", requireSession, async (req, res) => {
  try {
    const result = await queryRights(req.session, req.query);
    ok(res, result);
  } catch (error) {
    fail(res, error.message, 500);
  }
});

rightsRouter.get("/plus-packages", (req, res) => {
  ok(res, { items: plusPackages() });
});

rightsRouter.get("/:legalRightsNbr", requireSession, async (req, res) => {
  try {
    ok(res, await queryRightDetail(req.session, req.params.legalRightsNbr));
  } catch (error) {
    fail(res, error.message, 500);
  }
});


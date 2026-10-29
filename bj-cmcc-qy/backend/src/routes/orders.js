import { Router } from "express";
import { queryOrderDetail, queryOrders } from "../services/orderService.js";
import { fail, ok, requireSession } from "../utils/http.js";

export const ordersRouter = Router();

ordersRouter.get("/", requireSession, async (req, res) => {
  try {
    ok(res, await queryOrders(req.session, req.query));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

ordersRouter.get("/:custOrderId", requireSession, async (req, res) => {
  try {
    ok(res, await queryOrderDetail(req.session, req.params.custOrderId));
  } catch (error) {
    fail(res, error.message, 500);
  }
});


import express from "express";
import { consumeWorker } from "../services/externalExecutor.js";

export const internalExecutorRouter = express.Router();

function isLoopback(address) {
  return ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(address);
}

internalExecutorRouter.post("/", async (req, res, next) => {
  if (!isLoopback(req.socket.remoteAddress)) {
    res.status(403).json({ ok: false, message: "仅允许本机执行器回调" });
    return;
  }
  try {
    res.json(await consumeWorker(req.body || {}));
  } catch (error) {
    next(error);
  }
});

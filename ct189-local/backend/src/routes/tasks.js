import express from "express";
import { listTasks } from "../services/accountStore.js";
import { enqueueTask } from "../services/taskRunner.js";
export const tasksRouter = express.Router();
tasksRouter.get("/", (req, res) => res.json({ ok: true, tasks: listTasks() }));
tasksRouter.post("/", (req, res, next) => {
  try {
    res
      .status(202)
      .json({
        ok: true,
        task: enqueueTask(req.body?.action, req.body?.accountIds),
      });
  } catch (error) {
    next(error);
  }
});

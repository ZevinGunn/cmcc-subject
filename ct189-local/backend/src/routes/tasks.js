import express from "express";
import { listTasks } from "../services/accountStore.js";
import { enqueueTask } from "../services/taskRunner.js";
export const tasksRouter = express.Router();
tasksRouter.get("/", (req, res) => res.json({ ok: true, tasks: listTasks() }));
tasksRouter.get("/:id", (req, res) => {
  const task = listTasks().find((item) => item.id === req.params.id);
  if (!task)
    return res.status(404).json({ ok: false, message: "本次操作结果不存在" });
  res.json({ ok: true, task });
});
tasksRouter.post("/", (req, res, next) => {
  try {
    res.status(202).json({
      ok: true,
      task: enqueueTask(req.body?.action, req.body?.accountIds, undefined, {
        concurrency: req.body?.concurrency,
        executor: req.body?.executor,
      }),
    });
  } catch (error) {
    next(error);
  }
});

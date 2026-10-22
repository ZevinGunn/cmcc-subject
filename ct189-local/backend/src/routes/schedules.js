import express from "express";
import { deleteSchedule, listSchedules, saveSchedule } from "../services/accountStore.js";
import { createSchedule, nextRunAt, validateScheduleInput } from "../services/scheduler.js";

export const schedulesRouter = express.Router();
schedulesRouter.get("/", (req, res) => res.json({ ok: true, schedules: listSchedules() }));
schedulesRouter.post("/", (req, res, next) => {
  try {
    const schedule = createSchedule(req.body || {});
    saveSchedule(schedule);
    res.status(201).json({ ok: true, schedule });
  } catch (error) { next(error); }
});
schedulesRouter.patch("/:id", (req, res, next) => {
  try {
    const current = listSchedules().find((item) => item.id === req.params.id);
    if (!current) return res.status(404).json({ ok: false, message: "定时任务不存在" });
    const normalized = validateScheduleInput({ ...current, ...req.body });
    const schedule = { ...current, ...normalized, enabled: req.body.enabled !== undefined ? Boolean(req.body.enabled) : current.enabled, updatedAt: new Date().toISOString() };
    if (req.body.cron || req.body.timezone) schedule.nextRunAt = nextRunAt(schedule.cron, new Date(), schedule.timezone);
    saveSchedule(schedule);
    res.json({ ok: true, schedule });
  } catch (error) { next(error); }
});
schedulesRouter.delete("/:id", (req, res) => {
  if (!deleteSchedule(req.params.id)) return res.status(404).json({ ok: false, message: "定时任务不存在" });
  res.json({ ok: true });
});

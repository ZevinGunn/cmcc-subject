import { randomUUID } from "node:crypto";
import { appendLog, getAccount, listSchedules, saveSchedule } from "./accountStore.js";
import { accountSessions } from "./accountSession.js";
import { enqueueTask } from "./taskRunner.js";

export const SCHEDULE_ACTIONS = new Set(["friday_wdmei", "rights_bag_cash"]);
export const MAX_SCHEDULE_CONCURRENCY = 8;

function fields(cron) {
  const values = String(cron || "").trim().split(/\s+/);
  if (values.length !== 5) throw new Error("计划时间需使用 5 段 cron（分 时 日 月 周）");
  return values;
}
function matchPart(value, token, min, max) {
  if (token === "*") return true;
  return token.split(",").some((piece) => {
    const [base, stepText] = piece.split("/");
    const step = stepText ? Number(stepText) : 1;
    if (!Number.isInteger(step) || step < 1) return false;
    if (base === "*") return (value - min) % step === 0;
    if (base.includes("-")) {
      const [start, end] = base.split("-").map(Number);
      return Number.isInteger(start) && Number.isInteger(end) && value >= start && value <= end && (value - start) % step === 0;
    }
    return Number(base) === value;
  });
}
function zonedParts(date, timezone = "Asia/Shanghai") {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", weekday: "short",
  }).formatToParts(date).reduce((out, item) => ({ ...out, [item.type]: item.value }), {});
  const weekdays = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { minute: Number(parts.minute), hour: Number(parts.hour), day: Number(parts.day), month: Number(parts.month), weekday: weekdays[parts.weekday] };
}
export function cronMatches(date, cron, timezone = "Asia/Shanghai") {
  const [minute, hour, day, month, weekday] = fields(cron);
  const value = zonedParts(date, timezone);
  return matchPart(value.minute, minute, 0, 59) && matchPart(value.hour, hour, 0, 23) && matchPart(value.day, day, 1, 31) && matchPart(value.month, month, 1, 12) && matchPart(value.weekday, weekday, 0, 6);
}
export function nextRunAt(cron, from = new Date(), timezone = "Asia/Shanghai") {
  fields(cron);
  const cursor = new Date(from);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);
  for (let i = 0; i < 60 * 24 * 8; i++) {
    if (cronMatches(cursor, cron, timezone)) return cursor.toISOString();
    cursor.setMinutes(cursor.getMinutes() + 1);
  }
  throw new Error("计划时间在未来 8 天内没有可执行时刻");
}
export function validateScheduleInput(input) {
  const action = String(input?.action || "");
  if (!SCHEDULE_ACTIONS.has(action)) throw Object.assign(new Error("定时任务仅支持周五狂欢日和权益福袋"), { status: 400 });
  const accountIds = [...new Set(input?.accountIds || [])];
  if (accountIds.length < 1 || accountIds.length > 200 || accountIds.some((id) => typeof id !== "string" || !getAccount(id)))
    throw Object.assign(new Error("请选择 1–200 个有效账号"), { status: 400 });
  const concurrency = Number(input?.concurrency ?? 1);
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > MAX_SCHEDULE_CONCURRENCY)
    throw Object.assign(new Error(`并发数必须是 1–${MAX_SCHEDULE_CONCURRENCY} 的整数`), { status: 400 });
  const warmupMinutes = Number(input?.warmupMinutes ?? 5);
  if (!Number.isInteger(warmupMinutes) || warmupMinutes < 0 || warmupMinutes > 30)
    throw Object.assign(new Error("预热时间必须是 0–30 分钟"), { status: 400 });
  const cron = String(input?.cron || "").trim();
  fields(cron);
  nextRunAt(cron, new Date(), input?.timezone || "Asia/Shanghai");
  return { action, accountIds, concurrency, warmupMinutes, cron, timezone: "Asia/Shanghai" };
}

function mask(id) {
  const phone = getAccount(id)?.phone || "未知号码";
  return phone.replace(/^(\d{3})\d{4}/, "$1****");
}
export function createScheduler({ now = () => new Date(), ensure = (id) => accountSessions.ensureSession(id), enqueue = enqueueTask } = {}) {
  const warmed = new Set();
  let timer;
  async function tick() {
    const current = new Date(now());
    for (const schedule of listSchedules()) {
      if (!schedule.enabled) continue;
      const runAt = Date.parse(schedule.nextRunAt || "");
      if (!Number.isFinite(runAt)) {
        schedule.nextRunAt = nextRunAt(schedule.cron, current, schedule.timezone);
        saveSchedule(schedule);
        continue;
      }
      const diff = runAt - current.getTime();
      const warmKey = `${schedule.id}:${runAt}`;
      if (diff > 0 && diff <= schedule.warmupMinutes * 60_000 && !warmed.has(warmKey)) {
        warmed.add(warmKey);
        await Promise.all(schedule.accountIds.map(async (id) => {
          try {
            const result = await ensure(id);
            if (!result?.ok) appendLog(id, "schedule_warmup", { scheduleId: schedule.id, status: "failed", message: result?.message || "会话预热失败" });
            else appendLog(id, "schedule_warmup", { scheduleId: schedule.id, status: "success", message: "定时任务会话预热完成" });
          } catch (error) {
            appendLog(id, "schedule_warmup", { scheduleId: schedule.id, status: "failed", message: "会话预热异常" });
          }
        }));
      }
      if (diff <= 0 && schedule.lastRunAt !== new Date(runAt).toISOString()) {
        schedule.lastRunAt = new Date(runAt).toISOString();
        schedule.nextRunAt = nextRunAt(schedule.cron, new Date(runAt), schedule.timezone);
        try {
          const task = enqueue(schedule.action, schedule.accountIds, undefined, { concurrency: schedule.concurrency });
          schedule.lastTaskId = task.id;
        } catch (error) {
          schedule.lastError = error.message === "选中账号已有任务，请等待完成" ? "账号已有任务，已跳过本次执行" : "定时任务创建失败";
          for (const id of schedule.accountIds) appendLog(id, "schedule_run", { scheduleId: schedule.id, status: "failed", message: schedule.lastError });
        }
        saveSchedule(schedule);
      }
    }
  }
  return {
    tick,
    start() {
      if (timer) return;
      timer = setInterval(() => tick().catch(() => {}), 30_000);
      timer.unref?.();
      tick().catch(() => {});
    },
    stop() { if (timer) clearInterval(timer); timer = undefined; },
  };
}
export function createSchedule(input) {
  const normalized = validateScheduleInput(input);
  const now = new Date().toISOString();
  return {
    id: randomUUID(), ...normalized, title: normalized.action === "friday_wdmei" ? "周五狂欢日 · 味多美" : "权益福袋 · 10 元权益金",
    enabled: input?.enabled !== false, createdAt: now, updatedAt: now,
    nextRunAt: nextRunAt(normalized.cron, new Date(), normalized.timezone), lastRunAt: "", lastTaskId: "", lastError: "",
  };
}

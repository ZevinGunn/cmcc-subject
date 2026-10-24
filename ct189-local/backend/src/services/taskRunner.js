import { randomUUID } from "node:crypto";
import {
  appendLog,
  getAccount,
  listTasks,
  patchAccount,
  saveTask,
  sanitizeLogValue,
} from "./accountStore.js";
import { claimClassicRight, queryActivity, queryBalance } from "./telecomClient.js";
import { isTelecomSuccess } from "./passwordLogin.js";
import { accountSessions } from "./accountSession.js";
import { normalizeExecutor, runExternalExecutor } from "./externalExecutor.js";

export const taskActions = {
  check: "检查登录",
  relogin_saved: "批量重新登录",
  refresh: "更新资料",
  close: "关闭会话",
  friday_wdmei: "周五狂欢日 · 味多美 10 元兑换券",
  rights_bag_cash: "权益福袋 · 10 元翼支付通用权益金",
};
const RIGHTS_ACTIONS = new Set(["friday_wdmei", "rights_bag_cash"]);
const SERIAL_LOGIN_ACTIONS = new Set(["friday_wdmei", "rights_bag_cash", "relogin_saved"]);
class TaskExecutionError extends Error {}
function safeErrorMessage(error) {
  const message = String(error?.message || "").replace(/\s+/g, " ").trim();
  return /net::|ERR_[A-Z_]+|timeout|超时|活动|接口|页面|响应|执行器|脚本|runtime|WAF|HTTP\s*\d{3}/i.test(message)
    ? message.slice(0, 180)
    : "";
}
function describeTaskError(error, fallback = "连接失败，请检查登录或稍后重试") {
  const status = Number(error?.status || 0);
  if (status === 504 || /timeout|超时/i.test(String(error?.message || "")))
    return "活动接口响应超时，请查看接口日志后重试";
  const message = safeErrorMessage(error);
  return message ? `活动领取失败：${message.slice(0, 180)}` : fallback;
}
function errorDetails(error) {
  return sanitizeLogValue({
    status: error?.status,
    name: error?.name,
    ...(safeErrorMessage(error) ? { message: safeErrorMessage(error) } : {}),
    ...(error?.responseSummary ? { responses: error.responseSummary } : {}),
  });
}
// An interrupted operation is never replayed after restart.
for (const task of listTasks()) {
  if (["queued", "running"].includes(task.status)) {
    task.status = "interrupted";
    task.finishedAt = new Date().toISOString();
    for (const item of task.items)
      if (["queued", "running"].includes(item.status))
        Object.assign(item, {
          status: "interrupted",
          message: "服务重启，任务未完成",
        });
    saveTask(task);
  }
}
export function accountHasPendingTask(id) {
  return listTasks().some(
    (task) =>
      ["queued", "running"].includes(task.status) &&
      task.items.some(
        (item) =>
          item.accountId === id && ["queued", "running"].includes(item.status),
      ),
  );
}
async function execute(action, account, { sessionReady = false, executor = "native", taskId = "" } = {}) {
  if (action === "close") {
    return (await accountSessions.closeSession(account.id)).message;
  }
  if (action === "relogin_saved") {
    const result = await accountSessions.reloginSaved(account.id);
    if (!result?.ok) throw new TaskExecutionError(result?.message || "重新登录失败");
    return result.message || "已重新登录";
  }
  let session;
  if (!sessionReady) {
    session = await accountSessions.ensureSession(account.id);
    if (!session.ok) throw new TaskExecutionError(session.message);
  }
  if (action === "check") return sessionReady ? "登录状态已核验" : session.message;
  if (RIGHTS_ACTIONS.has(action)) {
    try {
      const result = executor === "native"
        ? await claimClassicRight(account.id, action)
        : await runExternalExecutor({ executor, action, accountId: account.id, taskId });
      if (result?.ok === false) throw new Error(result.message || "权益领取失败");
      return {
        status: "success",
        message: result.message,
        details: executor === "native" ? {
          activityId: result.activityId,
          offerCode: result.offerCode,
          offerName: result.offerName,
          ...(result.responses ? { responses: result.responses } : {}),
        } : result.details,
      };
    } catch (error) {
      if (error?.status === 409) {
        const wrapped = new TaskExecutionError(error.message);
        wrapped.details = error.responseSummary ? { responses: error.responseSummary } : undefined;
        throw wrapped;
      }
      throw error;
    }
  }
  const activity = await queryActivity(account.id);
  const balance = await queryBalance(account.id);
  const responses = [activity.info, activity.chance, ...Object.values(balance)];
  const failed = responses.filter(
    (data) => !isTelecomSuccess({ ok: true, data }),
  ).length;
  patchAccount(account.id, {
    activityInfo: activity.info,
    rights: activity.chance,
    balance,
    lastRefreshAt: new Date().toISOString(),
    lastError: failed ? `${failed} 项查询失败，已保存返回结果` : "",
  });
  return {
    status: failed ? "partial" : "success",
    message: failed ? `${failed} 项查询失败，已保存返回结果` : "资料已更新",
  };
}
const DEFAULT_CONCURRENCY = 1;
const MAX_CONCURRENCY = 8;
const pendingRuns = new Set();
export function enqueueTask(action, ids, executor = execute, options = {}) {
  if (!Object.hasOwn(taskActions, action))
    throw Object.assign(new Error("不支持的任务"), { status: 400 });
  const activeTasks = listTasks().filter((task) =>
    ["queued", "running"].includes(task.status),
  );
  if (activeTasks.length >= 25)
    throw Object.assign(new Error("任务队列已满，请等待后重试"), {
      status: 429,
    });
  if (
    !Array.isArray(ids) ||
    ids.length < 1 ||
    ids.length > 200 ||
    ids.some((id) => typeof id !== "string" || !getAccount(id))
  )
    throw Object.assign(new Error("请选择 1–200 个有效账号"), { status: 400 });
  const unique = [...new Set(ids)];
  const concurrency = Number(options?.concurrency ?? DEFAULT_CONCURRENCY);
  const executorName = normalizeExecutor(options?.executor);
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > MAX_CONCURRENCY)
    throw Object.assign(new Error(`并发数必须是 1–${MAX_CONCURRENCY} 的整数`), { status: 400 });
  const pendingAccounts = new Set(
    activeTasks.flatMap((task) =>
      task.items
        .filter((item) => ["queued", "running"].includes(item.status))
        .map((item) => item.accountId),
    ),
  );
  if (unique.some((id) => pendingAccounts.has(id)))
    throw Object.assign(new Error("选中账号已有任务，请等待完成"), {
      status: 409,
    });
  const task = {
    id: randomUUID(),
    action,
    title: taskActions[action],
    executor: executorName,
    concurrency,
    status: "queued",
    createdAt: new Date().toISOString(),
    items: unique.map((accountId) => ({
      accountId,
      maskedPhone: getAccount(accountId).phone.replace(
        /^(\d{3})\d{4}/,
        "$1****",
      ),
      status: "queued",
      message: "等待执行",
    })),
  };
  saveTask(task);
  const run = async () => {
    task.status = "running";
    saveTask(task);
    if (SERIAL_LOGIN_ACTIONS.has(action)) {
      // Login/session initialization is deliberately serialized across all
      // selected accounts. Rights claims may fan out only after this phase.
      const ensure = options.ensureSession || ((id) => accountSessions.ensureSession(id));
      const reloginSaved = options.reloginSaved || ((id) => accountSessions.reloginSaved(id));
      for (const item of task.items) {
        const account = getAccount(item.accountId);
        if (!account || (account.enabled === false && action !== "close")) {
          Object.assign(item, { status: "skipped", message: "账号已停用或删除" });
          saveTask(task);
          continue;
        }
        item.status = "running";
        item.message = "登录中";
        saveTask(task);
        try {
          const session = action === "relogin_saved"
            ? await reloginSaved(item.accountId)
            : await ensure(item.accountId);
          if (!session?.ok) {
            Object.assign(item, {
              status: "failed",
              message: session?.message || (action === "relogin_saved" ? "重新登录失败" : "登录失败，未执行权益领取"),
            });
          } else if (action === "relogin_saved") {
            Object.assign(item, {
              status: "success",
              message: session.message || "已重新登录",
            });
          } else {
            item.status = "queued";
            item.message = "登录成功，等待领取";
            item.sessionReady = true;
          }
        } catch (error) {
          Object.assign(item, {
            status: "failed",
            message: error instanceof TaskExecutionError
              ? error.message
              : describeTaskError(error, "登录连接失败，未执行权益领取"),
            ...(error instanceof TaskExecutionError && error.details
              ? { details: error.details }
              : { details: { error: errorDetails(error) } }),
          });
        }
        appendLog(item.accountId, action, {
          status: item.status,
          message: item.message,
          taskId: task.id,
          stage: "session_prepare",
        });
        saveTask(task);
      }
    }
    let cursor = 0;
    const worker = async () => {
      while (cursor < task.items.length) {
        const item = task.items[cursor++];
      if (item.status !== "queued") {
        continue;
      }
      const account = getAccount(item.accountId);
      if (!account || (account.enabled === false && action !== "close")) {
        Object.assign(item, { status: "skipped", message: "账号已停用或删除" });
      } else {
        item.status = "running";
        saveTask(task);
        try {
          const result = await executor(action, account, {
            sessionReady: Boolean(item.sessionReady),
            executor: task.executor,
            taskId: task.id,
          });
          Object.assign(
            item,
            typeof result === "string"
              ? { status: "success", message: result }
              : result,
          );
        } catch (error) {
          Object.assign(item, {
            status: "failed",
            message: error instanceof TaskExecutionError
              ? error.message
              : describeTaskError(error),
            ...(error?.details ? { details: error.details } : { details: { error: errorDetails(error) } }),
          });
        }
        appendLog(item.accountId, action, {
          status: item.status,
          message: item.message,
          taskId: task.id,
          activity: action === "friday_wdmei" ? "周五狂欢日 · 味多美" : action === "rights_bag_cash" ? "权益福袋 · 10 元权益金" : undefined,
          ...(item.details ? { response: item.details } : {}),
        });
      }
      saveTask(task);
      }
    };
    await Promise.all(Array.from({ length: Math.min(concurrency, task.items.length) }, () => worker()));
    const statuses = task.items.map((item) => item.status);
    task.status = statuses.every((status) => status === "success")
      ? "success"
      : statuses.every((status) => status === "failed")
        ? "failed"
        : "partial";
    task.finishedAt = new Date().toISOString();
    saveTask(task);
  };
  const queue = Promise.resolve().then(run).catch(() => {
    task.status = "interrupted";
    task.finishedAt = new Date().toISOString();
    saveTask(task);
  });
  pendingRuns.add(queue);
  queue.finally(() => pendingRuns.delete(queue)).catch(() => {});
  return structuredClone(task);
}
export function waitForTasks() {
  return Promise.allSettled([...pendingRuns]);
}

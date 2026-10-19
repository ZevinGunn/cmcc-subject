import { randomUUID } from "node:crypto";
import {
  appendLog,
  getAccount,
  listTasks,
  patchAccount,
  saveTask,
} from "./accountStore.js";
import {
  closeClient,
  queryActivity,
  queryBalance,
  queryLoginAccount,
} from "./telecomClient.js";
import { isTelecomSuccess } from "./passwordLogin.js";

export const taskActions = {
  check: "检查登录",
  refresh: "更新资料",
  close: "关闭会话",
};
class TaskExecutionError extends Error {}
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
async function execute(action, account) {
  if (action === "close") {
    await closeClient(account.id);
    patchAccount(account.id, { loginStatus: "closed", loginNumber: "" });
    return "会话已关闭";
  }
  const identity = await queryLoginAccount(account.id);
  const valid =
    isTelecomSuccess(identity) && identity.data.object === account.phone;
  patchAccount(account.id, {
    loginStatus: valid ? "valid" : "invalid",
    loginNumber: valid ? account.phone : "",
    lastError: valid ? "" : "登录已失效，请重新登录",
  });
  if (!valid) throw new TaskExecutionError("登录已失效，请重新登录");
  if (action === "check") return "登录号码核验通过";
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
let queue = Promise.resolve();
export function enqueueTask(action, ids, executor = execute) {
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
    for (const item of task.items) {
      const account = getAccount(item.accountId);
      if (!account || (account.enabled === false && action !== "close")) {
        Object.assign(item, { status: "skipped", message: "账号已停用或删除" });
      } else {
        item.status = "running";
        saveTask(task);
        try {
          const result = await executor(action, account);
          Object.assign(
            item,
            typeof result === "string"
              ? { status: "success", message: result }
              : result,
          );
        } catch (error) {
          Object.assign(item, {
            status: "failed",
            message:
              error instanceof TaskExecutionError
                ? error.message
                : "连接失败，请检查登录或稍后重试",
          });
        }
        appendLog(item.accountId, action, {
          status: item.status,
          message: item.message,
        });
      }
      saveTask(task);
    }
    const statuses = task.items.map((item) => item.status);
    task.status = statuses.every((status) => status === "success")
      ? "success"
      : statuses.every((status) => status === "failed")
        ? "failed"
        : "partial";
    task.finishedAt = new Date().toISOString();
    saveTask(task);
  };
  queue = queue.then(run).catch(() => {
    task.status = "interrupted";
    task.finishedAt = new Date().toISOString();
    saveTask(task);
  });
  return structuredClone(task);
}
export function waitForTasks() {
  return queue;
}

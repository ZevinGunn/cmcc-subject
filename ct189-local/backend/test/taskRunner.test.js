import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "ct189-task-runner-"));
process.env.CT189_DATA_DIR = dataDir;

const { upsertAccount, listTasks } = await import("../src/services/accountStore.js");
const { enqueueTask, waitForTasks } = await import("../src/services/taskRunner.js");

test.after(() => fs.rmSync(dataDir, { recursive: true, force: true }));

test("权益任务先串行登录，再按并发数领取且跳过登录失败账号", async () => {
  const accounts = ["18900000011", "18900000012", "18900000013"].map((phone) =>
    upsertAccount({ phone }),
  );
  assert.throws(
    () => enqueueTask("check", [accounts[0].id], undefined, { executor: "ruby" }),
    /执行器必须是/,
  );
  const loginOrder = [];
  let activeLogins = 0;
  let maxActiveLogins = 0;
  const claimOrder = [];
  let activeClaims = 0;
  let maxActiveClaims = 0;
  const ensureSession = async (id) => {
    loginOrder.push(id);
    activeLogins += 1;
    maxActiveLogins = Math.max(maxActiveLogins, activeLogins);
    await new Promise((resolve) => setTimeout(resolve, 10));
    activeLogins -= 1;
    return { ok: id !== accounts[1].id, message: id === accounts[1].id ? "登录失败" : "登录成功" };
  };
  const executor = async (action, account, options) => {
    assert.equal(action, "friday_wdmei");
    assert.equal(options.sessionReady, true);
    assert.equal(options.executor, "python");
    claimOrder.push(account.id);
    activeClaims += 1;
    maxActiveClaims = Math.max(maxActiveClaims, activeClaims);
    await new Promise((resolve) => setTimeout(resolve, 20));
    activeClaims -= 1;
    return { status: "success", message: "领取成功" };
  };

  const task = enqueueTask(
    "friday_wdmei",
    accounts.map((account) => account.id),
    executor,
    { concurrency: 2, ensureSession, executor: "python" },
  );
  await waitForTasks();

  assert.deepEqual(loginOrder, accounts.map((account) => account.id));
  assert.equal(maxActiveLogins, 1);
  assert.equal(maxActiveClaims, 2);
  assert.deepEqual(claimOrder.sort(), [accounts[0].id, accounts[2].id].sort());
  const finished = listTasks().find((item) => item.id === task.id);
  assert.equal(finished.status, "partial");
  assert.equal(finished.executor, "python");
  assert.deepEqual(
    finished.items.map((item) => item.status),
    ["success", "failed", "success"],
  );
});

test("批量重新登录强制使用保存密码并保持账号间串行", async () => {
  const accounts = ["18900000021", "18900000022", "18900000023"].map((phone) =>
    upsertAccount({ phone }),
  );
  const loginOrder = [];
  let activeLogins = 0;
  let maxActiveLogins = 0;
  const reloginSaved = async (id) => {
    loginOrder.push(id);
    activeLogins += 1;
    maxActiveLogins = Math.max(maxActiveLogins, activeLogins);
    await new Promise((resolve) => setTimeout(resolve, 10));
    activeLogins -= 1;
    return {
      ok: id !== accounts[1].id,
      message: id === accounts[1].id ? "保存密码登录失败" : "已重新登录",
    };
  };
  const task = enqueueTask(
    "relogin_saved",
    accounts.map((account) => account.id),
    () => {
      throw new Error("重新登录不应进入并发执行阶段");
    },
    { concurrency: 8, reloginSaved },
  );
  await waitForTasks();

  assert.deepEqual(loginOrder, accounts.map((account) => account.id));
  assert.equal(maxActiveLogins, 1);
  const finished = listTasks().find((item) => item.id === task.id);
  assert.equal(finished.title, "批量重新登录");
  assert.equal(finished.status, "partial");
  assert.deepEqual(
    finished.items.map((item) => item.status),
    ["success", "failed", "success"],
  );
});

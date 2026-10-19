import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import express from "express";
import { execFileSync } from "node:child_process";

test("account migration, import validation, metadata protection and durable isolated tasks", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ct189-management-"));
  process.env.CT189_DATA_DIR = dir;
  fs.writeFileSync(
    path.join(dir, "accounts.json"),
    JSON.stringify({
      accounts: [
        {
          id: "legacy",
          phone: "18900000001",
          label: "654321",
          loginStatus: "valid",
        },
      ],
      logs: [],
    }),
  );
  const store = await import("../src/services/accountStore.js");
  const { accountsRouter } = await import("../src/routes/accounts.js");
  const { enqueueTask, waitForTasks } =
    await import("../src/services/taskRunner.js");
  const app = express();
  app.use(express.json());
  app.use("/api/accounts", accountsRouter);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}/api/accounts`;
  const request = async (url, body, method = "POST") => {
    const response = await fetch(base + url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return { status: response.status, ...(await response.json()) };
  };
  try {
    assert.equal(store.listAccounts()[0].group, "未分组");
    assert.equal(store.listAccounts()[0].enabled, true);
    assert.equal(store.listAccounts()[0].label, "189****0001");
    assert.equal(store.getAccount("legacy").label, "");
    assert.equal((await request("", { phone: "18900000001" })).status, 409);
    const bad = await request("/import", {
      accounts: [{ phone: "18900000002" }, { phone: "wrong" }],
    });
    assert.equal(bad.status, 400);
    assert.equal(store.listAccounts().length, 1);
    const result = await request("/import", {
      accounts: [
        { phone: "18900000001" },
        { phone: "18900000002", group: "工作", password: "must-not-save" },
        { phone: "18900000002" },
        { phone: "18900000003", enabled: false },
      ],
    });
    assert.equal(result.added, 2);
    assert.equal(result.skipped, 2);
    const second = store.listAccounts().find((a) => a.phone.endsWith("2"));
    const third = store.listAccounts().find((a) => a.phone.endsWith("3"));
    assert.equal(second.group, "工作");
    const patch = await request(
      "/legacy",
      {
        enabled: false,
        group: "家庭",
        phone: "18900000009",
        password: "must-not-save",
        loginStatus: "forged",
        id: "changed",
      },
      "PATCH",
    );
    assert.equal(patch.account.phone, "18900000001");
    assert.equal(patch.account.loginStatus, "valid");
    assert.equal(patch.account.group, "家庭");
    assert.equal(patch.account.enabled, false);
    await request("/legacy", { label: "新备注" }, "PATCH");
    assert.equal(
      store.listAccounts().find((a) => a.id === "legacy").enabled,
      false,
    );
    let unblock;
    const firstStep = new Promise((resolve) => {
      unblock = resolve;
    });
    const calls = [];
    const task = enqueueTask(
      "check",
      ["legacy", second.id, third.id],
      async (action, account) => {
        calls.push(account.id);
        await firstStep;
        throw new Error("secret network detail");
      },
    );
    assert.equal(task.status, "queued");
    assert.throws(() => enqueueTask("check", [second.id]), /已有任务/);
    assert.throws(() => enqueueTask("signin", [second.id]), /不支持/);
    assert.equal(
      (await request(`/${second.id}`, undefined, "DELETE")).status,
      409,
    );
    unblock();
    await waitForTasks();
    const complete = store.listTasks()[0];
    assert.equal(complete.status, "partial");
    assert.deepEqual(
      complete.items.map((i) => i.status),
      ["skipped", "failed", "skipped"],
    );
    assert.deepEqual(calls, [second.id]);
    const serial = [];
    enqueueTask("close", ["legacy", second.id], async (_, account) => {
      serial.push(account.id);
      return "已关闭";
    });
    await waitForTasks();
    assert.deepEqual(serial, ["legacy", second.id]);
    assert.equal(store.listTasks()[0].status, "success");
    const profile = path.join(dir, "browser", second.id);
    fs.mkdirSync(profile, { recursive: true });
    fs.writeFileSync(path.join(profile, "fixture"), "local test profile");
    assert.equal(
      (await request(`/${second.id}`, undefined, "DELETE")).status,
      200,
    );
    assert.equal(fs.existsSync(profile), false);
    assert.equal(store.getAccount(second.id), null);
    const persisted = fs.readFileSync(path.join(dir, "accounts.json"), "utf8");
    assert.ok(!persisted.includes("must-not-save"));
    assert.ok(!persisted.includes("secret network detail"));
    assert.equal(JSON.parse(persisted).tasks.length, 2);
    assert.equal(
      fs.statSync(path.join(dir, "accounts.json")).mode & 0o777,
      0o600,
    );
    const data = JSON.parse(persisted);
    data.tasks.push({
      id: "unfinished",
      status: "running",
      items: [
        { accountId: second.id, status: "running" },
        { accountId: third.id, status: "queued" },
      ],
    });
    fs.writeFileSync(path.join(dir, "accounts.json"), JSON.stringify(data));
    const recovered = execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `await import(${JSON.stringify(new URL("../src/services/taskRunner.js", import.meta.url).href)}); const {listTasks} = await import(${JSON.stringify(new URL("../src/services/accountStore.js", import.meta.url).href)}); console.log(JSON.stringify(listTasks().find(task => task.id === 'unfinished')))`,
      ],
      { env: { ...process.env, CT189_DATA_DIR: dir }, encoding: "utf8" },
    );
    assert.equal(JSON.parse(recovered).status, "interrupted");
    assert.deepEqual(
      JSON.parse(recovered).items.map((item) => item.status),
      ["interrupted", "interrupted"],
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

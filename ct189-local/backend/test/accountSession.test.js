import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createCredentialVault } from "../src/services/credentialVault.js";
import { createAccountSessionManager } from "../src/services/accountSessionManager.js";

const phone = "18900000001";
const response = (number) => ({
  ok: true,
  status: 200,
  data: { result: 0, retCode: "000000", object: number },
});
const loggedIn = () => ({
  ok: true,
  login: response(),
  loginAccount: response(phone),
});
function setup(t, options = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "ct189-vault-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const vault = createCredentialVault(directory);
  const account = {
    id: "account-one",
    phone,
    label: "测试账号",
    enabled: true,
    loginStatus: "valid",
    autoLoginStatus: "enabled",
  };
  const logs = [],
    calls = { queries: 0, passwords: [] },
    clock = { now: Date.parse("2026-10-19T00:00:00Z") };
  if (options.saved !== false)
    account.savedPassword = vault.seal(account.id, "001234");
  const publicAccount = () => ({
    id: account.id,
    phone,
    label: account.label,
    loginStatus: account.loginStatus,
    autoLoginStatus: account.autoLoginStatus,
    hasSavedPassword: Boolean(account.savedPassword),
  });
  const deps = {
    getAccount: (id) => (id === account.id ? account : null),
    patchAccount: (id, patch) => {
      Object.assign(account, patch);
      return publicAccount();
    },
    vault,
    appendLog: (id, action, payload) => logs.push({ id, action, payload }),
    now: () => clock.now,
    queryLoginAccount: async () => {
      calls.queries++;
      return options.query ? options.query() : response(null);
    },
    closeClient: async () => {},
    loginByServicePassword: async (id, number, password) => {
      calls.passwords.push(password);
      return options.login ? options.login(password) : loggedIn();
    },
  };
  return {
    manager: createAccountSessionManager(deps),
    account,
    vault,
    calls,
    logs,
    clock,
    directory,
  };
}

test("vault uses randomized authenticated encryption, account binding, persistent private key and tamper rejection", (t) => {
  const { vault, directory } = setup(t, { saved: false });
  const a = vault.seal("a", "001234"),
    b = vault.seal("a", "001234");
  assert.notEqual(a.ciphertext, b.ciphertext);
  assert.equal(createCredentialVault(directory).open("a", a), "001234");
  assert.throws(() => vault.open("b", a));
  assert.throws(() =>
    vault.open("a", { ...a, tag: Buffer.alloc(16).toString("base64") }),
  );
  assert.equal(
    fs.statSync(path.join(directory, "credential.key")).mode & 0o777,
    0o600,
  );
  assert.ok(!JSON.stringify(a).includes("001234"));
});
test("manual login remembers only verified passwords, never returns credentials or logs them", async (t) => {
  const s = setup(t, { saved: false });
  const result = await s.manager.manualLogin("account-one", "005678");
  assert.equal(result.ok, true);
  assert.equal(result.account.hasSavedPassword, true);
  assert.equal(s.vault.open(s.account.id, s.account.savedPassword), "005678");
  assert.ok(!JSON.stringify(result).includes("005678"));
  assert.ok(!JSON.stringify(s.logs).includes("005678"));
});
test("saved-password relogin decrypts only on the server", async (t) => {
  const s = setup(t);
  const result = await s.manager.reloginSaved("account-one");
  assert.equal(result.ok, true);
  assert.deepEqual(s.calls.passwords, ["001234"]);
  assert.ok(!JSON.stringify(result).includes("001234"));
  assert.ok(!JSON.stringify(s.logs).includes("001234"));
});
test("concurrent expiry checks deduplicate automatic password submission", async (t) => {
  const s = setup(t);
  const results = await Promise.all([
    s.manager.ensureSession(s.account.id),
    s.manager.ensureSession(s.account.id),
    s.manager.ensureSession(s.account.id),
  ]);
  assert.ok(results.every((r) => r.ok));
  assert.equal(s.calls.queries, 1);
  assert.deepEqual(s.calls.passwords, ["001234"]);
  assert.equal(s.account.autoLoginStatus, "enabled");
  assert.equal(s.account.lastAutoLoginAt, new Date(s.clock.now).toISOString());
});
test("an already valid identity does not submit saved credentials", async (t) => {
  const s = setup(t, { query: () => response(phone) });
  assert.equal((await s.manager.ensureSession(s.account.id)).ok, true);
  assert.equal(s.calls.passwords.length, 0);
});
test("password rejection stops automatic attempts until a successful manual replacement", async (t) => {
  let bad = true;
  const s = setup(t, {
    login: (password) =>
      bad
        ? {
            ok: false,
            login: {
              ok: true,
              status: 200,
              data: {
                result: 1,
                retCode: "fixture-rejected",
                retMsg: "服务密码错误",
              },
            },
          }
        : loggedIn(),
  });
  const first = await s.manager.ensureSession(s.account.id);
  assert.equal(first.ok, false);
  assert.match(first.message, /服务密码错误/);
  assert.equal(s.account.autoLoginStatus, "manual_required");
  s.clock.now += 24 * 60 * 60_000;
  await s.manager.ensureSession(s.account.id);
  assert.equal(s.calls.passwords.length, 1);
  bad = false;
  await s.manager.manualLogin(s.account.id, "005678");
  assert.equal(s.account.autoLoginStatus, "enabled");
  assert.equal(s.vault.open(s.account.id, s.account.savedPassword), "005678");
  await s.manager.ensureSession(s.account.id);
  assert.equal(s.calls.passwords.at(-1), "005678");
});
test("failed manual replacement retains old encrypted password but pauses its automatic use", async (t) => {
  const s = setup(t, {
    login: () => ({
      ok: false,
      login: { ok: true, status: 200, data: { result: 1 } },
    }),
  });
  const previous = s.account.savedPassword;
  await s.manager.manualLogin(s.account.id, "009999");
  assert.deepEqual(s.account.savedPassword, previous);
  assert.equal(s.account.autoLoginStatus, "manual_required");
  await s.manager.ensureSession(s.account.id);
  assert.equal(s.calls.passwords.length, 1);
});
test("network/WAF failures and identity mismatch never cause a password submission", async (t) => {
  for (const query of [
    () => ({ ok: false, status: 412, data: null }),
    () => {
      throw new Error("secret upstream");
    },
    () => response("18900000002"),
  ]) {
    const s = setup(t, { query });
    assert.equal((await s.manager.ensureSession(s.account.id)).ok, false);
    assert.equal(s.calls.passwords.length, 0);
    assert.ok(!JSON.stringify(s.logs).includes("secret"));
  }
});
test("initialization failure backs off; ambiguous password submission stops automatic retries", async (t) => {
  const s = setup(t, { login: () => ({ ok: false, login: null }) });
  await s.manager.ensureSession(s.account.id);
  assert.equal(s.account.autoLoginStatus, "retry_wait");
  await s.manager.ensureSession(s.account.id);
  assert.equal(s.calls.passwords.length, 1);
  const other = setup(t, {
    login: () => {
      const error = new Error("private payload");
      error.loginStage = "password_submission";
      throw error;
    },
  });
  await other.manager.ensureSession(other.account.id);
  assert.equal(other.account.autoLoginStatus, "manual_required");
  other.clock.now += 60 * 60_000;
  await other.manager.ensureSession(other.account.id);
  assert.equal(other.calls.passwords.length, 1);
  assert.ok(!JSON.stringify(other.logs).includes("private payload"));
});
test("opt-out clears credentials; disabled/closed accounts and lost keys cannot auto-login", async (t) => {
  const s = setup(t);
  await s.manager.manualLogin(s.account.id, "005678", false);
  assert.equal(s.account.savedPassword, null);
  assert.equal(s.account.autoLoginStatus, "not_saved");
  await s.manager.ensureSession(s.account.id);
  assert.equal(s.calls.passwords.length, 1);
  for (const patch of [{ enabled: false }, { loginStatus: "closed" }]) {
    const other = setup(t);
    Object.assign(other.account, patch);
    await other.manager.ensureSession(other.account.id);
    assert.equal(other.calls.queries, 0);
    assert.equal(other.calls.passwords.length, 0);
  }
  const lost = setup(t);
  fs.unlinkSync(path.join(lost.directory, "credential.key"));
  await lost.manager.ensureSession(lost.account.id);
  assert.equal(lost.account.autoLoginStatus, "manual_required");
  assert.equal(lost.calls.passwords.length, 0);
});
test("closing a session serializes with automatic login and prevents it from reopening", async (t) => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const s = setup(t, { query: () => gate });
  const checking = s.manager.ensureSession(s.account.id);
  await new Promise((resolve) => setImmediate(resolve));
  const closing = s.manager.closeSession(s.account.id);
  release(response(null));
  await Promise.all([checking, closing]);
  assert.equal(s.account.loginStatus, "closed");
  assert.equal(s.account.autoLoginStatus, "paused");
  await s.manager.ensureSession(s.account.id);
  assert.equal(s.calls.queries, 1);
});
test("disabling during a check prevents login; opting out also removes the secret on failed login", async (t) => {
  let release;
  const s = setup(t, {
    query: () =>
      new Promise((resolve) => {
        release = resolve;
      }),
  });
  const checking = s.manager.ensureSession(s.account.id);
  await new Promise((resolve) => setImmediate(resolve));
  s.account.enabled = false;
  release(response(null));
  await checking;
  assert.equal(s.calls.passwords.length, 0);
  const other = setup(t, {
    login: () => ({
      ok: false,
      login: { ok: true, status: 200, data: { result: 1 } },
    }),
  });
  await other.manager.manualLogin(other.account.id, "005678", false);
  assert.equal(other.account.savedPassword, null);
});

test("login checks are serialized across different accounts", async (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "ct189-vault-serial-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const vault = createCredentialVault(directory);
  const accounts = [
    { id: "serial-a", phone: "18900000021", enabled: true, loginStatus: "valid", autoLoginStatus: "enabled" },
    { id: "serial-b", phone: "18900000022", enabled: true, loginStatus: "valid", autoLoginStatus: "enabled" },
  ];
  for (const account of accounts) account.savedPassword = vault.seal(account.id, "001234");
  const active = { count: 0, max: 0 };
  const order = [];
  const manager = createAccountSessionManager({
    getAccount: (id) => accounts.find((account) => account.id === id) || null,
    patchAccount: (id, patch) => {
      const account = accounts.find((item) => item.id === id);
      Object.assign(account, patch);
      return { id, hasSavedPassword: Boolean(account.savedPassword) };
    },
    vault,
    appendLog: () => {},
    queryLoginAccount: async (id) => {
      active.count += 1;
      active.max = Math.max(active.max, active.count);
      order.push(`query:${id}`);
      await new Promise((resolve) => setTimeout(resolve, 10));
      active.count -= 1;
      return response(null);
    },
    loginByServicePassword: async (id, phoneNumber) => {
      active.count += 1;
      active.max = Math.max(active.max, active.count);
      order.push(`login:${id}`);
      await new Promise((resolve) => setTimeout(resolve, 10));
      active.count -= 1;
      return { ok: true, login: response(), loginAccount: response(phoneNumber) };
    },
    closeClient: async () => {},
  });

  await Promise.all(accounts.map((account) => manager.ensureSession(account.id)));
  assert.equal(active.max, 1);
  assert.deepEqual(order, [
    "query:serial-a",
    "login:serial-a",
    "query:serial-b",
    "login:serial-b",
  ]);
});

test("retryable session responses reinitialize before automatic login", async (t) => {
  let queries = 0;
  const s = setup(t, {
    query: () => {
      queries += 1;
      return queries === 1 ? { ok: false, status: 400, data: null } : response(null);
    },
  });
  const result = await s.manager.ensureSession(s.account.id);
  assert.equal(result.ok, true);
  assert.equal(queries, 2);
  assert.deepEqual(s.calls.passwords, ["001234"]);
});

test("transient network failures do not permanently block saved-password relogin", async (t) => {
  const s = setup(t, {
    login: () => ({
      ok: false,
      login: null,
      initialization: { ok: false, status: 0, data: null },
    }),
  });
  s.account.autoLoginStatus = "manual_required";
  s.account.lastError = "电信网络连接失败，请检查网络后重试";
  const result = await s.manager.ensureSession(s.account.id);
  assert.equal(result.ok, false);
  assert.deepEqual(s.calls.passwords, ["001234"]);
});

test("account confirmation network failure is not mislabeled as a phone mismatch", async (t) => {
  const s = setup(t, {
    login: () => ({
      ok: false,
      login: response(),
      loginAccount: { ok: false, status: 0, data: null, diagnostic: { failureType: "status_zero" } },
    }),
  });
  const result = await s.manager.ensureSession(s.account.id);
  assert.equal(result.ok, false);
  assert.match(result.message, /网络连接失败/);
  assert.doesNotMatch(result.message, /手机号核验不匹配/);
});

test("a transient check failure within the 30-minute session lease preserves login state", async (t) => {
  const s = setup(t, { query: () => ({ ok: false, status: 0, data: null }) });
  s.account.lastLoginAt = new Date(s.clock.now - 5 * 60_000).toISOString();
  const result = await s.manager.ensureSession(s.account.id);
  assert.equal(result.ok, true);
  assert.match(result.message, /有效期内/);
  assert.equal(result.account.loginStatus, "valid");
  assert.equal(s.account.loginStatus, "valid");
  assert.equal(s.calls.passwords.length, 0);
});

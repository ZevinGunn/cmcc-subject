import assert from "node:assert/strict";
import { test } from "node:test";
import { performPasswordLogin, isTelecomSuccess, loginSummary, loginErrorDiagnostic } from "../src/services/passwordLogin.js";
import { encryptServicePassword } from "../src/services/crypto189.js";
import { createSessionPool } from "../src/services/sessionPool.js";

const phone = "18900000001";
const success = (object = null) => ({ ok: true, status: 200, data: { result: 0, retCode: "000000", object } });

test("login initializes, encrypts the password, then verifies the exact phone", async () => {
  const calls = [];
  const result = await performPasswordLogin(phone, "001234", async (path, body) => {
    calls.push({ path, body });
    return success(calls.length === 3 ? phone : null);
  });
  assert.equal(result.ok, true);
  assert.deepEqual(calls.map(call => call.path.split("/").at(-1)), ["qryLoginAccno", "passwordCheck", "qryLoginAccno"]);
  assert.deepEqual(calls[1].body, { phoneNum: phone, password: encryptServicePassword("001234") });
  assert.ok(!JSON.stringify(calls).includes("001234"));
});

test("WAF failure blocks credential submission", async () => {
  let calls = 0;
  const result = await performPasswordLogin(phone, "123456", async () => {
    calls++;
    return { ok: false, status: 412, data: "<html>challenge</html>" };
  });
  assert.equal(calls, 2);
  assert.equal(result.ok, false);
  assert.match(result.message, /412/);
});

test("a challenge reload retries initialization without replaying a password", async () => {
  let queries = 0;
  let passwords = 0;
  const result = await performPasswordLogin(phone, "123456", async (path, body, options) => {
    if (path.endsWith("passwordCheck")) { passwords++; return success(); }
    queries++;
    if (queries === 1) throw new Error("Execution context was destroyed, most likely because of a navigation");
    if (queries === 2) assert.equal(options.reinitialize, true);
    return success(passwords ? phone : null);
  });
  assert.equal(result.ok, true);
  assert.equal(result.initializationAttempts, 2);
  assert.equal(queries, 3);
  assert.equal(passwords, 1);
});

test("submission or confirmation errors never trigger another password attempt", async () => {
  for (const failStage of ["password_submission", "account_confirmation"]) {
    let passwords = 0;
    const result = performPasswordLogin(phone, "123456", async (path, body, options) => {
      if (path.endsWith("passwordCheck")) passwords++;
      if (options.stage === failStage) throw new Error("Execution context was destroyed; sensitive details must not be logged");
      return success();
    });
    await assert.rejects(result, error => {
      assert.deepEqual(loginErrorDiagnostic(error), { stage: failStage, category: "page_reloaded" });
      return true;
    });
    assert.equal(passwords, 1);
  }
});

test("repeated initialization failures are bounded and classified without logging messages", async () => {
  let attempts = 0;
  await assert.rejects(performPasswordLogin(phone, "123456", async () => {
    attempts++;
    const error = new Error("page.goto: Timeout exceeded; private upstream URL");
    error.name = "TimeoutError";
    throw error;
  }), error => {
    assert.deepEqual(loginErrorDiagnostic(error), { stage: "initialization", category: "timeout" });
    return true;
  });
  assert.equal(attempts, 2);
});

test("empty and contradictory success responses never count as a login", () => {
  for (const response of [
    { ok: true, data: "" }, { ok: true, data: {} },
    { ok: false, data: { result: 0 } },
    { ok: true, data: { result: 0, retCode: "100001" } },
    { ok: true, data: { result: 1, retCode: "000000" } }
  ]) assert.equal(isTelecomSuccess(response), false);
  assert.equal(isTelecomSuccess({ ok: true, data: { result: "0", retCode: "000000" } }), true);
});

test("a rejected password cannot reuse the old logged-in account", async () => {
  let calls = 0;
  const result = await performPasswordLogin(phone, "123456", async () => {
    calls++;
    return calls === 1 ? success(phone) : { ok: true, status: 200, data: { result: 1, retCode: "101", retMsg: "密码错误" } };
  });
  assert.equal(calls, 2);
  assert.equal(result.ok, false);
  assert.equal(result.loginAccount, null);
});

test("missing or mismatched login identities are rejected", async () => {
  for (const identity of [null, "18900000002", { phone }]) {
    let calls = 0;
    const result = await performPasswordLogin(phone, "123456", async () => success(++calls === 3 ? identity : null));
    assert.equal(result.ok, false);
  }
});

test("invalid credentials never reach the network", async () => {
  for (const [number, password] of [["123", "123456"], [phone, ""], [phone, "abc"], [phone, "1".repeat(33)]]) {
    await assert.rejects(performPasswordLogin(number, password, () => { assert.fail("network called"); }), { status: 400 });
  }
});

test("summaries omit sensitive upstream fields", () => {
  const summary = loginSummary({ ...success(), data: { result: 0, retCode: "000000", password: "secret", token: "token", object: { cookie: "cookie" } } });
  assert.deepEqual(summary, { status: 200, result: 0, retCode: "000000", diagnostic: undefined });
});

test("concurrent session creation is deduplicated and failures can retry", async () => {
  let created = 0;
  const pool = createSessionPool(async () => { if (++created === 1) throw new Error("launch failed"); return { context: { close() {} } }; });
  await assert.rejects(pool.get("a"), /launch failed/);
  const [first, second] = await Promise.all([pool.get("a"), pool.get("a")]);
  assert.equal(first, second);
  assert.equal(created, 2);
  await pool.close("a");
  assert.equal(pool.existing("a"), undefined);
});

test("account transactions serialize and a failed task does not poison the queue", async () => {
  const pool = createSessionPool(() => {});
  const events = [];
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const first = pool.run("a", async () => { events.push("start"); await gate; events.push("end"); throw new Error("fail"); });
  const second = pool.run("a", () => { events.push("second"); });
  await pool.run("b", () => events.push("other account"));
  assert.deepEqual(events, ["start", "other account"]);
  release();
  await assert.rejects(first, /fail/);
  await second;
  assert.deepEqual(events, ["start", "other account", "end", "second"]);
});

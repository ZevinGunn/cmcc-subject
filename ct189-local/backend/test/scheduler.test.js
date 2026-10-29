import assert from "node:assert/strict";
import { test } from "node:test";
import { cronMatches, nextRunAt } from "../src/services/scheduler.js";
import { responseDiagnostic } from "../src/services/passwordLogin.js";

test("cron scheduler uses Beijing time and calculates the next minute", () => {
  const friday = new Date("2026-10-23T02:00:00.000Z"); // 10:00 Asia/Shanghai
  assert.equal(cronMatches(friday, "0 10 * * 5"), true);
  assert.equal(cronMatches(friday, "5 10 * * 5"), false);
  assert.equal(nextRunAt("0 10 * * 5", friday), "2026-10-30T02:00:00.000Z");
});

test("login response diagnostics distinguish WAF, upstream and password rejection", () => {
  assert.equal(responseDiagnostic({ ok: false, status: 412, data: null }, "initialization").category, "waf_challenge");
  assert.equal(responseDiagnostic({ ok: false, status: 502, data: null }, "initialization").category, "upstream_unavailable");
  const rejected = responseDiagnostic({ ok: true, status: 200, data: { result: 1, retCode: "1001", retMsg: "服务密码错误" } }, "password_submission");
  assert.equal(rejected.category, "password_rejected");
  assert.equal(rejected.retMsg, "服务密码错误");
  const timeout = responseDiagnostic({
    ok: false,
    status: 0,
    data: null,
    diagnostic: { failureType: "timeout" },
  }, "password_submission");
  assert.equal(timeout.category, "timeout");
  assert.equal(timeout.failureType, "timeout");
});

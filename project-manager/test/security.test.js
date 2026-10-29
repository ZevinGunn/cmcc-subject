import assert from "node:assert/strict";
import test from "node:test";

process.env.PROJECT_MANAGER_NO_LISTEN = "1";
process.env.MANAGER_PASSWORD ||= "test-manager-password";
process.env.MANAGER_SESSION_SECRET ||= "test-session-secret-at-least-32-bytes";

const { testHelpers } = await import("../server.js");

test("redacts authorization headers for bearer and basic credentials", () => {
  const output = testHelpers.redact([
    "Authorization: Bearer bearer-value-123",
    "authorization: Basic dXNlcjpwYXNz",
  ].join("\n"));

  assert.equal(output.includes("bearer-value-123"), false);
  assert.equal(output.includes("dXNlcjpwYXNz"), false);
  assert.match(output, /Authorization: \[REDACTED\]/i);
});

test("redacts complete cookie headers and token-like JSON fields", () => {
  const output = testHelpers.redact([
    "Cookie: sid=first; refresh=second; theme=dark",
    JSON.stringify({ cookie: "sid=json-first; refresh=json-second", refreshToken: "refresh-value", qqtAccessToken: "qqt-value", password: "secret-value" }),
  ].join("\n"));

  for (const secret of ["first", "second", "json-first", "json-second", "refresh-value", "qqt-value", "secret-value"]) {
    assert.equal(output.includes(secret), false);
  }
});

test("redacts database URLs and configured manager credentials", () => {
  const output = testHelpers.redact("DATABASE_URL=postgresql://user:pass@127.0.0.1/app");
  assert.equal(output.includes("user:pass"), false);
  assert.match(output, /\[REDACTED/);
});

test("redacts complete quoted JSON credentials containing spaces and separators", () => {
  const secrets = {
    password: "alpha beta",
    accessToken: "abc,def",
    apiKey: "key;rest",
    nested_secret: "quoted value, with; separators",
  };
  const output = testHelpers.redact(JSON.stringify(secrets));

  for (const secret of Object.values(secrets)) assert.equal(output.includes(secret), false);
  assert.equal((output.match(/\[REDACTED\]/g) || []).length, Object.keys(secrets).length);
});

test("admin password changes enforce policy and verify stored or recovery credentials", () => {
  assert.equal(testHelpers.adminPasswordPolicyError("short"), "password_too_short");
  assert.equal(testHelpers.adminPasswordPolicyError("x".repeat(257)), "password_too_long");
  assert.equal(testHelpers.adminPasswordPolicyError("memorable-passphrase"), "");

  const admin = {
    id: "operator-1",
    passwordHash: testHelpers.hashAdminPassword("current-password"),
  };
  assert.equal(testHelpers.adminPasswordMatches(admin, "current-password"), true);
  assert.equal(testHelpers.adminPasswordMatches(admin, "wrong-password"), false);
  const legacyLongPassword = "legacy-".padEnd(300, "x");
  assert.equal(testHelpers.adminPasswordMatches({
    id: "legacy-admin",
    passwordHash: testHelpers.hashAdminPassword(legacyLongPassword),
  }, legacyLongPassword), true);
  assert.equal(testHelpers.adminPasswordMatches({
    ...admin,
    id: "bootstrap-admin",
  }, process.env.MANAGER_PASSWORD), true);
});

test("password change session revocation keeps only the current session", () => {
  const sessionStore = new Map([
    ["current", { adminId: "admin-1" }],
    ["other", { adminId: "admin-1" }],
    ["unrelated", { adminId: "admin-2" }],
  ]);

  assert.equal(testHelpers.revokeSessionsForAdmin(sessionStore, "admin-1", "current"), 1);
  assert.deepEqual([...sessionStore.keys()], ["current", "unrelated"]);
});

test("login rate limiting isolates trusted-proxy clients without a shared socket bucket", () => {
  const proxiedRequest = (ip) => ({
    headers: { "x-manager-client-ip": ip },
    socket: { remoteAddress: "127.0.0.1" },
  });

  testHelpers.clearLoginAttempts();
  for (let index = 1; index <= 200; index += 1) {
    const { buckets } = testHelpers.loginRateStates(proxiedRequest(`198.51.100.${index}`));
    assert.equal(buckets.length, 1);
    buckets[0].state.failures += 1;
  }

  const freshClient = testHelpers.loginRateStates(proxiedRequest("203.0.113.10")).buckets[0];
  assert.equal(freshClient.state.failures, 0);
  for (let attempt = 0; attempt < freshClient.limit; attempt += 1) freshClient.state.failures += 1;
  assert.equal(freshClient.state.failures >= freshClient.limit, true);
  testHelpers.clearLoginAttempts();
});

test("forwarded client IP headers are trusted only from loopback proxies", () => {
  assert.equal(testHelpers.clientIp({
    headers: { "x-manager-client-ip": "203.0.113.20" },
    socket: { remoteAddress: "127.0.0.1" },
  }), "203.0.113.20");
  assert.equal(testHelpers.clientIp({
    headers: { "x-manager-client-ip": "203.0.113.20" },
    socket: { remoteAddress: "198.51.100.20" },
  }), "198.51.100.20");
});

test("only trusts configured HTTPS Cloudflare Access redirects", () => {
  const allowedHosts = ["cmcc.cloudflareaccess.com"];
  assert.equal(
    testHelpers.trustedAuthRedirect("https://wangka.1008086.xyz/cdn-cgi/access/login", allowedHosts),
    false,
  );
  assert.equal(
    testHelpers.trustedAuthRedirect("https://cmcc.cloudflareaccess.com/cdn-cgi/access/login", allowedHosts),
    true,
  );
  assert.equal(
    testHelpers.trustedAuthRedirect("https://other.cloudflareaccess.com/cdn-cgi/access/login", allowedHosts),
    false,
  );
  assert.equal(
    testHelpers.trustedAuthRedirect("http://cmcc.cloudflareaccess.com/cdn-cgi/access/login", allowedHosts),
    false,
  );
});

test("restricted services distinguish exposure, closed routes, and verified auth", () => {
  const allowedHosts = ["cmcc.cloudflareaccess.com"];
  assert.equal(testHelpers.restrictedAccessState([
    { code: 204, redirectLocation: "" },
    { code: 404, redirectLocation: "" },
  ], allowedHosts), "exposed");
  assert.equal(testHelpers.restrictedAccessState([
    { code: 404, redirectLocation: "" },
    { code: 0, redirectLocation: "" },
  ], allowedHosts), "closed");
  assert.equal(testHelpers.restrictedAccessState([
    { code: 403, redirectLocation: "" },
    { code: 404, redirectLocation: "" },
  ], allowedHosts), "protected");
  assert.equal(testHelpers.restrictedAccessState([
    { code: 302, redirectLocation: "https://example.com/login" },
    { code: 404, redirectLocation: "" },
  ], allowedHosts), "unknown");
  assert.equal(testHelpers.restrictedAccessState([
    { code: 302, redirectLocation: "https://cmcc.cloudflareaccess.com/cdn-cgi/access/login" },
    { code: 404, redirectLocation: "" },
  ], allowedHosts), "protected");
});

test("aggregate results expose only real execution steps", () => {
  const result = testHelpers.aggregateResult("deploy example", [
    { title: "测试", result: { ok: true, code: 0, command: "npm test", stdout: "passed", stderr: "" } },
    { title: "构建", result: { ok: false, code: 1, command: "npm run build", stdout: "", stderr: "failed" } },
  ]);

  assert.equal(result.ok, false);
  assert.deepEqual(result.steps.map((step) => [step.name, step.status]), [
    ["测试", "completed"],
    ["构建", "failed"],
  ]);
  assert.equal(result.steps.some((step) => step.name === "切换产物"), false);
});

test("running operations accumulate stages and finish the current stage honestly", () => {
  const operation = { id: "operation-test", action: "check", stage: "queued", steps: [], progress: 0 };
  testHelpers.advanceOperationStage(operation, "executing");
  testHelpers.advanceOperationStage(operation, "checking");
  const result = { ok: false, code: 1, command: "check example", stdout: "", stderr: "health failed" };
  testHelpers.finishOperationStages(operation, result);

  assert.deepEqual(operation.steps.map((step) => step.status), ["completed", "failed"]);
  assert.equal(operation.steps[1].name, "运行检测");
  assert.match(operation.steps[1].detail, /health failed/);
  assert.equal(operation.progress, 100);
  assert.deepEqual(result.steps.map((step) => step.status), ["completed", "failed"]);
});

test("stage updater publishes live step and progress snapshots in order", async () => {
  const operation = {
    id: "operation-live-test",
    action: "check",
    target: "example",
    status: "running",
    stage: "queued",
    startedAt: new Date().toISOString(),
    steps: [],
    progress: 0,
  };
  const snapshots = [];
  const setStage = testHelpers.createOperationStageUpdater(operation, async (snapshot) => {
    snapshots.push(snapshot);
  });

  setStage("executing");
  setStage("checking");
  await setStage.flush();

  const result = testHelpers.commandResult("check example", true, "status:healthy");
  testHelpers.finishOperationStages(operation, result);
  operation.status = "completed";
  operation.stage = "completed";
  await setStage.sync();

  assert.deepEqual(snapshots.map((snapshot) => snapshot.progress), [22, 34, 100]);
  assert.deepEqual(snapshots[0].steps.map((step) => [step.name, step.status]), [
    ["开始执行", "running"],
  ]);
  assert.deepEqual(snapshots[1].steps.map((step) => [step.name, step.status]), [
    ["开始执行", "completed"],
    ["运行检测", "running"],
  ]);
  assert.equal(snapshots[2].status, "completed");
  assert.deepEqual(snapshots[2].steps.map((step) => step.status), ["completed", "completed"]);
});

test("single command results become real audit steps instead of empty legacy records", () => {
  const startedAt = "2026-07-19T00:00:00.000Z";
  const finishedAt = "2026-07-19T00:00:01.000Z";
  const result = testHelpers.commandResult("check example", true, "status:healthy");
  const steps = testHelpers.operationResultSteps("check", result, startedAt, finishedAt);

  assert.deepEqual(steps.map((step) => [step.name, step.status]), [["check", "completed"]]);
  assert.equal(steps[0].command, "check example");
  assert.match(steps[0].detail, /status:healthy/);
  assert.equal(steps[0].startedAt, startedAt);
  assert.equal(steps[0].finishedAt, finishedAt);
});

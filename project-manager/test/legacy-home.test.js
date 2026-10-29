import assert from "node:assert/strict";
import test from "node:test";

process.env.PROJECT_MANAGER_NO_LISTEN = "1";
process.env.MANAGER_PASSWORD ||= "test-manager-password";
process.env.MANAGER_SESSION_SECRET ||= "test-session-secret-at-least-32-bytes";

const { testHelpers } = await import("../server.js");

test("旧版项目工作台不再展示山西移动入口", () => {
  assert.equal(testHelpers.legacyProjectIds().includes("shanxi"), false);
  assert.equal(testHelpers.legacyProjectIds().includes("home"), true);
});

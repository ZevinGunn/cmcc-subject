import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import express from "express";

test("local API logs in without opening an external page and clears a mismatched session", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ct189-login-test-"));
  process.env.CT189_DATA_DIR = dir;
  const { ct189Router } = await import("../src/routes/ct189.js");
  const { accountsRouter } = await import("../src/routes/accounts.js");
  const { getClient, closeClient } =
    await import("../src/services/telecomClient.js");
  const { config } = await import("../src/config.js");
  const app = express();
  app.use(express.json());
  app.use("/api/accounts", accountsRouter);
  app.use("/api/ct189", ct189Router);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = async (url, body, method = "POST") => {
    const response = await fetch(base + url, {
      method,
      headers: { "Content-Type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    return { status: response.status, data: await response.json() };
  };
  let id;
  let otherId;
  try {
    const phone = "18900000001";
    const account = await request("/api/accounts", {
      phone,
      label: "登录回归",
    });
    id = account.data.account.id;
    const client = await getClient(id);
    assert.equal(config.headless, true);
    let passwordSubmitted = false;
    let mismatch = false;
    let submissions = 0;
    let entryLoads = 0;
    let requestsOnChallenge = 0;
    // All requests are intercepted. This test cannot reach the official service.
    await client.context.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.pathname === "/echnwap/scratchLogon") {
        entryLoads++;
        if (entryLoads === 1) {
          return route.fulfill({
            status: 412,
            contentType: "text/html",
            body: "<!doctype html><script>setTimeout(() => location.reload(), 250)</script>",
          });
        }
        return route.fulfill({
          // The real entry may be 400 after its challenge; business APIs work.
          status: 400,
          contentType: "text/html",
          body: "<!doctype html><html><body><div id='app'>Local fixture</div></body></html>",
        });
      }
      assert.equal(url.hostname, "wapbj.189.cn");
      if (entryLoads === 1) requestsOnChallenge++;
      if (url.pathname.endsWith("passwordCheck")) {
        submissions++;
        const body = route.request().postDataJSON();
        assert.equal(body.phoneNum, phone);
        assert.notEqual(body.password, "001234");
        passwordSubmitted = true;
      } else {
        assert.ok(url.pathname.endsWith("qryLoginAccno"));
        // Even a successful anonymous response on the challenge document is
        // insufficient: the upcoming reload can destroy the password request.
      }
      const response = {
        result: 0,
        retCode: "000000",
        object:
          url.pathname.endsWith("qryLoginAccno") && passwordSubmitted
            ? mismatch
              ? "18900000002"
              : phone
            : null,
      };
      await route.fulfill({
        contentType: "application/json",
        body: Buffer.from(JSON.stringify(response)).toString("base64"),
      });
    });
    const result = await request(`/api/ct189/${id}/login/password`, {
      password: "001234",
    });
    assert.equal(result.data.ok, true);
    assert.equal(result.data.account.loginNumber, phone);
    assert.equal(result.data.account.loginStatus, "valid");
    assert.equal(result.data.account.hasSavedPassword, true);
    assert.equal(Object.hasOwn(result.data.account, "savedPassword"), false);
    assert.equal(client.context.pages().length, 1);
    assert.ok(!JSON.stringify(result.data).includes("001234"));
    assert.equal(submissions, 1);
    assert.equal(entryLoads, 2);
    assert.equal(requestsOnChallenge, 0);
    const apiLogs = await request(`/api/accounts/${id}/logs`, null, "GET");
    const passwordRequestLog = apiLogs.data.logs.find(
      (entry) => entry.action === "api_request" && entry.payload.endpoint.endsWith("passwordCheck"),
    );
    assert.ok(passwordRequestLog);
    assert.equal(passwordRequestLog.payload.request.password, "[已隐藏]");
    assert.equal(passwordRequestLog.payload.response.status, 200);
    assert.equal(passwordRequestLog.payload.response.data.retCode, "000000");
    const other = await request("/api/accounts", { phone: "18900000002" });
    otherId = other.data.account.id;
    const isolated = await getClient(otherId);
    assert.notEqual(isolated.context, client.context);
    await client.context.addCookies([
      {
        name: "isolation_fixture",
        value: "local-test-only",
        url: config.officialOrigin,
      },
    ]);
    assert.equal(
      (await isolated.context.cookies()).some(
        (cookie) => cookie.name === "isolation_fixture",
      ),
      false,
    );
    // Simulate a confirmed expired session. The stored secret must restore it
    // through the same local XHR flow, without receiving another password.
    passwordSubmitted = false;
    const renewed = await request(`/api/ct189/${id}/check-login`, {});
    assert.equal(renewed.data.ok, true);
    assert.equal(renewed.data.account.autoLoginStatus, "enabled");
    assert.equal(submissions, 2);
    const alreadyValid = await request(`/api/ct189/${id}/check-login`, {});
    assert.equal(alreadyValid.data.ok, true);
    assert.equal(submissions, 2);
    // Attempts to replace the profile path or forge login state are ignored.
    const patched = await request(
      `/api/accounts/${id}`,
      { label: "备注", id: "../../", loginStatus: "valid" },
      "PATCH",
    );
    assert.equal(patched.data.account.id, id);
    const changed = await request("/api/accounts", {
      id,
      phone: "18900000002",
    });
    assert.equal(changed.status, 400);
    mismatch = true;
    const rejected = await request(`/api/ct189/${id}/login/password`, {
      password: "001234",
    });
    assert.equal(rejected.data.ok, false);
    assert.equal(rejected.data.account.loginStatus, "invalid");
    assert.equal(rejected.data.account.loginNumber, "");
    assert.equal(fs.existsSync(path.join(dir, "browser", id)), false);
    assert.equal(fs.existsSync(path.join(dir, "browser", otherId)), true);
    const logs = await request(`/api/accounts/${id}/logs`, null, "GET");
    assert.ok(!JSON.stringify(logs.data).includes("001234"));
    assert.ok(
      !fs
        .readFileSync(path.join(dir, "accounts.json"), "utf8")
        .includes("001234"),
    );
    // A closed renderer previously escaped without any diagnostic log.
    await isolated.context.close();
    const disconnected = await request(`/api/ct189/${otherId}/login/password`, {
      password: "001234",
    });
    assert.equal(disconnected.status, 502);
    assert.equal(disconnected.data.account.loginStatus, "invalid");
    assert.equal(fs.existsSync(path.join(dir, "browser", otherId)), false);
    const failures = await request(
      `/api/accounts/${otherId}/logs`,
      null,
      "GET",
    );
    assert.deepEqual(failures.data.logs[0].payload.error, {
      stage: "initialization",
      category: "engine_closed",
    });
    assert.ok(!JSON.stringify(failures.data).includes("001234"));
  } finally {
    if (id) await closeClient(id);
    if (otherId) await closeClient(otherId);
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

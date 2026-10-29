import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import express from "express";
import {
  createSiteAccess,
  passwordRecord,
} from "../src/services/siteAccess.js";

test("public account access requires login, trusted Origin and CSRF; logout/expiry revoke access", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ct189-access-"));
  const credentialsFile = path.join(dir, "access.json"),
    password = "fixture-access-password";
  fs.writeFileSync(
    credentialsFile,
    JSON.stringify({ username: "admin", ...(await passwordRecord(password)) }),
  );
  let time = Date.now();
  const origin = "https://ct189.example.test";
  const access = createSiteAccess({
    required: true,
    credentialsFile,
    origins: [origin],
    now: () => time,
    ttlMs: 1000,
  });
  const app = express();
  app.use(express.json());
  app.use("/api", (req, res, next) =>
    Promise.resolve(access.handle(req, res, next)).catch(next),
  );
  app.all("/api/accounts", (req, res) => res.json({ ok: true, accounts: [] }));
  const server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = async (
    url,
    {
      method = "GET",
      body,
      cookie,
      csrf,
      source = origin,
      ip = "192.0.2.1",
    } = {},
  ) =>
    fetch(base + url, {
      method,
      headers: {
        Origin: source,
        "CF-Connecting-IP": ip,
        "Content-Type": "application/json",
        ...(cookie ? { Cookie: cookie } : {}),
        ...(csrf ? { "X-CSRF-Token": csrf } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  try {
    assert.equal((await request("/api/accounts")).status, 401);
    const status = await (await request("/api/access/session")).json();
    assert.equal(status.authenticated, false);
    assert.equal(JSON.stringify(status).includes(password), false);
    assert.equal(
      (
        await request("/api/access/login", {
          method: "POST",
          source: "https://evil.test",
          body: { username: "admin", password },
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await request("/api/access/login", {
          method: "POST",
          body: { username: "admin", password: "wrong" },
        })
      ).status,
      401,
    );
    const login = await request("/api/access/login", {
      method: "POST",
      body: { username: "admin", password },
    });
    assert.equal(login.status, 200);
    const header = login.headers.get("set-cookie"),
      cookie = header.split(";")[0];
    for (const flag of [
      "__Host-ct189_access=",
      "Secure",
      "HttpOnly",
      "SameSite=Strict",
      "Path=/",
    ])
      assert.ok(header.includes(flag));
    assert.equal(header.includes("Domain="), false);
    const { csrfToken: csrf } = await login.json();
    const rememberedLogin = await request("/api/access/login", {
      method: "POST",
      body: { username: "admin", password, remember: true },
    });
    assert.equal(rememberedLogin.status, 200);
    const rememberedHeader = rememberedLogin.headers.get("set-cookie");
    assert.ok(rememberedHeader.includes("Max-Age=2592000"));
    const rememberedBody = await rememberedLogin.json();
    assert.equal(rememberedBody.remember, true);
    assert.equal(
      (await request("/api/accounts", { cookie: rememberedHeader.split(";")[0] })).status,
      200,
    );
    assert.equal((await request("/api/accounts", { cookie })).status, 200);
    assert.equal(
      (await request("/api/accounts", { method: "POST", cookie, body: {} }))
        .status,
      403,
    );
    assert.equal(
      (
        await request("/api/accounts", {
          method: "POST",
          cookie,
          csrf,
          source: "https://evil.test",
          body: {},
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await request("/api/accounts", {
          method: "POST",
          cookie,
          csrf,
          body: {},
        })
      ).status,
      200,
    );
    assert.equal(
      (await request("/api/accounts", { method: "DELETE", cookie, csrf }))
        .status,
      200,
    );
    assert.equal(
      (await request("/api/accounts", { method: "DELETE", cookie })).status,
      403,
    );
    assert.equal(
      (await request("/api/access/session", { cookie })).headers.get(
        "cache-control",
      ),
      "no-store",
    );
    assert.equal(
      (
        await request("/api/access/logout", {
          method: "POST",
          cookie,
          csrf,
          body: {},
        })
      ).status,
      200,
    );
    assert.equal((await request("/api/accounts", { cookie })).status, 401);
    const login2 = await request("/api/access/login", {
      method: "POST",
      body: { username: "admin", password },
    });
    const cookie2 = login2.headers.get("set-cookie").split(";")[0];
    time += 1001;
    assert.equal(
      (await request("/api/accounts", { cookie: cookie2 })).status,
      401,
    );
    assert.equal(
      (await request("/api/accounts", { cookie: cookie2 + "tampered" })).status,
      401,
    );
    for (let n = 0; n < 5; n++)
      assert.equal(
        (
          await request("/api/access/login", {
            method: "POST",
            body: { username: "admin", password: "wrong" },
            ip: "192.0.2.2",
          })
        ).status,
        401,
      );
    const limited = await request("/api/access/login", {
      method: "POST",
      body: { username: "admin", password },
      ip: "192.0.2.2",
    });
    assert.equal(limited.status, 429);
    assert.ok(Number(limited.headers.get("retry-after")) > 0);
    assert.equal(
      (
        await request("/api/access/login", {
          method: "POST",
          body: { username: "admin", password },
          ip: "192.0.2.3",
        })
      ).status,
      200,
    );
  } finally {
    await new Promise((r) => server.close(r));
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("production credentials are mandatory and malformed records fail closed", () => {
  assert.throws(() =>
    createSiteAccess({
      required: true,
      credentialsFile: "/missing/ct189-access-file",
      origins: [],
    }),
  );
  assert.equal(
    createSiteAccess({ required: false, origins: [] }).required,
    false,
  );
});

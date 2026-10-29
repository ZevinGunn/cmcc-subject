import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { chromium } from "../backend/node_modules/playwright/index.mjs";
const root = fileURLToPath(new URL("../", import.meta.url));
const base = "https://ct189.1008086.xyz";
const credentials = fs.readFileSync(
  path.join(root, "backend/data/site-access-credentials.txt"),
  "utf8",
);
const username = credentials.match(/^访问账号：(.+)$/m)?.[1];
const password = credentials.match(/^访问密码：(.+)$/m)?.[1];
assert.ok(username && password, "缺少本机访问凭据");
const request = (url, options) =>
  fetch(base + url, { ...options, signal: AbortSignal.timeout(15000) });
const expectedVersion = JSON.parse(
  fs.readFileSync(path.join(root, "frontend/dist/version.json")),
).revision;
const health = await (await request("/api/health")).json();
assert.equal(health.displayName, "北京电信快捷服务");
assert.equal(health.accessRequired, true);
assert.equal(health.version, expectedVersion);
for (const url of ["/api/accounts", "/api/accounts/logs", "/api/tasks"])
  assert.equal((await request(url)).status, 401);
const html = await (await request("/")).text();
assert.ok(html.includes("<title>北京电信快捷服务</title>"));
const assets = [...html.matchAll(/(?:src|href)="(\/[^"#]+)"/g)].map(
  (m) => m[1],
);
for (const asset of new Set([
  ...assets,
  "/telecom-logo.png",
  "/version.json",
])) {
  const response = await request(asset);
  assert.equal(response.status, 200, asset);
  const hash = (bytes) =>
    crypto.createHash("sha256").update(bytes).digest("hex");
  assert.equal(
    hash(Buffer.from(await response.arrayBuffer())),
    hash(fs.readFileSync(path.join(root, "frontend/dist", asset.slice(1)))),
    asset,
  );
}
const browser = await chromium.launch({ headless: true });
let fixtureId, activePage;
const mutate = (page, url, method, body) =>
  page.evaluate(
    async ({ url, method, body }) => {
      const session = await (await fetch("/api/access/session")).json();
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": session.csrfToken,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      return { status: response.status, data: await response.json() };
    },
    { url, method, body },
  );
try {
  for (const width of [1440, 390, 320]) {
    const context = await browser.newContext({
      viewport: { width, height: 850 },
    });
    const page = await context.newPage();
    activePage = page;
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base, { waitUntil: "networkidle", timeout: 45000 });
    await page.getByRole("heading", { name: "登录快捷服务" }).waitFor();
    assert.equal(await page.locator("tbody tr").count(), 0);
    if (process.env.CT189_QA_DIR) {
      fs.mkdirSync(process.env.CT189_QA_DIR, { recursive: true });
      await page.screenshot({
        path: path.join(process.env.CT189_QA_DIR, `public-login-${width}.png`),
        fullPage: true,
      });
    }
    await page.getByLabel("访问账号", { exact: true }).fill(username);
    await page.getByLabel("访问密码", { exact: true }).fill(password);
    await page.getByRole("button", { name: "登录", exact: true }).click();
    await page
      .getByRole("heading", { name: "账号管理", exact: true })
      .waitFor();
    const cookie = (await context.cookies()).find(
      (c) => c.name === "__Host-ct189_access",
    );
    assert.ok(
      cookie?.secure && cookie.httpOnly && cookie.sameSite === "Strict",
    );
    const csrfMissing = await context.request.post(base + "/api/accounts", {
      headers: { Origin: base },
      data: {},
    });
    assert.equal(csrfMissing.status(), 403);
    await page.reload({ waitUntil: "networkidle" });
    await page
      .getByRole("heading", { name: "账号管理", exact: true })
      .waitFor();
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    if (width === 1440) {
      const phone = `199${String(Date.now()).slice(-8)}`;
      await page
        .getByRole("button", { name: "＋ 添加账号", exact: true })
        .click();
      await page
        .locator("#account-form")
        .getByLabel("手机号", { exact: true })
        .fill(phone);
      await page
        .locator("#account-form")
        .getByLabel("备注", { exact: true })
        .fill("公网验收临时账号");
      const created = page.waitForResponse(
        (r) =>
          new URL(r.url()).pathname === "/api/accounts" &&
          r.request().method() === "POST",
      );
      await page.getByRole("button", { name: "保存账号", exact: true }).click();
      const payload = await (await created).json();
      fixtureId = payload.account.id;
      assert.ok(fixtureId);
      const row = page
        .locator("tbody tr")
        .filter({ hasText: "公网验收临时账号" });
      await row.waitFor();
      await row.getByRole("button", { name: "编辑", exact: true }).click();
      await page
        .locator("#account-form")
        .getByLabel("分组", { exact: true })
        .fill("公网验收");
      const patched = page.waitForResponse(
        (r) =>
          r.url().endsWith(`/api/accounts/${fixtureId}`) &&
          r.request().method() === "PATCH",
      );
      await page.getByRole("button", { name: "保存账号", exact: true }).click();
      assert.equal((await (await patched).json()).account.group, "公网验收");
      await row.getByRole("button", { name: "登录", exact: true }).click();
      assert.equal(
        await page.locator("#login-form input[type=tel]").inputValue(),
        phone,
      );
      assert.equal(
        await page.getByLabel("服务密码", { exact: true }).inputValue(),
        "",
      );
      assert.equal(
        await page.getByLabel("记住服务密码，过期自动补登").isChecked(),
        true,
      );
      await page.getByRole("button", { name: "关闭弹窗", exact: true }).click();
      assert.equal(
        (await mutate(page, `/api/accounts/${fixtureId}`, "DELETE")).status,
        200,
      );
      fixtureId = null;
      await page.getByRole("button", { name: "刷新", exact: true }).click();
      await row.waitFor({ state: "detached" });
    }
    await page.getByRole("button", { name: "退出", exact: true }).click();
    await page.getByRole("heading", { name: "登录快捷服务" }).waitFor();
    assert.equal(
      (await context.request.get(base + "/api/accounts")).status(),
      401,
    );
    assert.equal(errors.length, 0);
    await context.close();
    console.log(`公网 ${width}px：访问登录、会话恢复、退出与页面边界通过`);
  }
  console.log(
    `公网版本 ${expectedVersion}，静态资源哈希、匿名拦截、CSRF 和账号新增/编辑/删除通过。`,
  );
} finally {
  if (fixtureId && activePage && !activePage.isClosed())
    await mutate(activePage, `/api/accounts/${fixtureId}`, "DELETE").catch(
      () => {},
    );
  await browser.close();
}

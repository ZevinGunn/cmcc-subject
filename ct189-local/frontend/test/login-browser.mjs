import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "../../backend/node_modules/playwright/index.mjs";

const base = process.env.CT189_UI_BASE || "http://127.0.0.1:5711";
const output = process.env.CT189_QA_DIR;
const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  for (const width of [1280, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.on("pageerror", error => errors.push(error.message));
    const account = { id: "fixture", phone: "18900000001", maskedPhone: "189****0001", label: "测试账号", loginStatus: "new", loginNumber: "" };
    let attempts = 0;
    let pending;
    await page.route("**/api/**", async route => {
      const path = new URL(route.request().url()).pathname;
      const fulfill = data => route.fulfill({ contentType: "application/json", body: JSON.stringify(data) });
      if (path === "/api/health") return fulfill({ ok: true });
      if (path === "/api/accounts") return fulfill({ ok: true, accounts: [account] });
      if (path.endsWith("/logs")) return fulfill({ ok: true, logs: [] });
      if (path.endsWith("/login/password")) {
        attempts++;
        assert.equal(route.request().postDataJSON().password, "001234");
        if (attempts === 1) {
          pending = () => {
            Object.assign(account, { loginStatus: "valid", loginNumber: account.phone });
            return fulfill({ ok: true, message: "登录成功", account });
          };
          return;
        }
        Object.assign(account, { loginStatus: "invalid", loginNumber: "", lastError: "服务密码错误，请重试" });
        return fulfill({ ok: false, message: account.lastError, account });
      }
      throw new Error(`Unexpected request ${path}`);
    });
    await page.goto(base);
    const password = page.getByLabel("服务密码", { exact: true });
    await password.fill("abc");
    assert.equal(await page.getByRole("button", { name: "快捷登录", exact: true }).isDisabled(), true);
    await password.fill("001234");
    await password.press("Enter");
    await page.getByRole("button", { name: "正在登录…" }).waitFor();
    assert.equal(await password.isDisabled(), true);
    assert.equal(await page.getByRole("button", { name: /测试账号/ }).isDisabled(), true);
    assert.equal(attempts, 1);
    await pending();
    await page.getByRole("status").filter({ hasText: "登录成功" }).waitFor();
    assert.equal(await password.inputValue(), "");
    assert.equal(page.context().pages().length, 1);
    assert.equal(page.url(), base + "/");
    await password.fill("001234");
    await page.getByRole("button", { name: "快捷登录", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "服务密码错误" }).waitFor();
    assert.equal(await password.inputValue(), "");
    assert.equal(attempts, 2);
    assert.equal(await page.locator(".overview-grid .metric").nth(1).locator("strong").innerText(), "失效");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (output) {
      fs.mkdirSync(output, { recursive: true });
      await page.locator(".login-panel").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${output}/login-${width}.png`, fullPage: true });
    }
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log("Desktop/mobile login checks passed: pending, success, failure, keyboard, no redirect, no overflow.");
} finally {
  await browser.close();
}

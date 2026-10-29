import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "../../backend/node_modules/playwright/index.mjs";
const base = process.env.CT189_UI_BASE || "http://127.0.0.1:5711";
const output = process.env.CT189_QA_DIR;
const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.on("pageerror", (e) => errors.push(e.message));
    let accounts = Array.from({ length: 6 }, (_, i) => ({
      id: `fixture-${i}`,
      phone: `1890000000${i + 1}`,
      maskedPhone: `189****000${i + 1}`,
      label: [
        "主号码",
        "工作号码",
        "家庭副卡",
        "备用号码",
        "654321",
        "流量副卡",
      ][i],
      group: ["个人", "工作", "家庭"][i % 3],
      enabled: i !== 5,
      loginStatus: i % 2 ? "invalid" : "valid",
      hasSavedPassword: i % 2 === 0,
      autoLoginStatus: i % 2 ? "manual_required" : "enabled",
      lastLoginAt: "2026-10-19T00:20:00Z",
      lastError: i === 1 ? "服务密码错误，请手动重新登录并更新密码" : "",
    }));
    accounts[0].hasSavedPassword = false;
    accounts[0].autoLoginStatus = "not_saved";
    let attempts = 0,
      pending,
      importCalls = 0,
      failAccounts = false,
      batch = null,
      historyReads = 0;
    await page.route("**/api/**", async (route) => {
      const path = new URL(route.request().url()).pathname,
        method = route.request().method();
      const body = () => route.request().postDataJSON();
      const fulfill = (data) =>
        route.fulfill({
          contentType: "application/json",
          body: JSON.stringify(data),
        });
      if (path === "/api/health") return fulfill({ ok: true });
      if (path === "/api/accounts" && method === "GET") {
        if (failAccounts)
          return route.fulfill({
            status: 503,
            contentType: "application/json",
            body: '{"ok":false,"message":"离线"}',
          });
        return fulfill({ ok: true, accounts });
      }
      if (path === "/api/tasks" && method === "GET") {
        historyReads++;
        throw new Error("Web must not fetch task history");
      }
      if (path === "/api/tasks" && method === "POST") {
        batch = {
          id: "batch-fixture",
          title: "检查登录",
          status: "queued",
          items: body().accountIds.map((id) => ({
            accountId: id,
            maskedPhone: accounts.find((a) => a.id === id).maskedPhone,
            status: "queued",
            message: "等待执行",
          })),
        };
        return fulfill({ ok: true, task: batch });
      }
      if (path === "/api/tasks/batch-fixture") {
        batch.status = "partial";
        batch.items.forEach((item, i) =>
          Object.assign(item, {
            status: i ? "failed" : "success",
            message: i ? "请更新服务密码" : "登录号码核验通过",
          }),
        );
        return fulfill({ ok: true, task: batch });
      }
      if (path === "/api/accounts/import") {
        importCalls++;
        const added = body().accounts.map((a, i) => ({
          ...a,
          id: `import-${i}`,
          maskedPhone: a.phone.replace(/^(\d{3})\d{4}/, "$1****"),
          loginStatus: "new",
          enabled: true,
        }));
        accounts.push(...added);
        return fulfill({ ok: true, added: added.length, skipped: 0 });
      }
      if (path === "/api/accounts" && method === "POST") {
        const account = {
          ...body(),
          id: "added",
          maskedPhone: "189****0011",
          loginStatus: "new",
        };
        accounts.push(account);
        return fulfill({ ok: true, account });
      }
      const id = path.split("/")[3],
        account = accounts.find((a) => a.id === id);
      if (method === "PATCH") {
        Object.assign(account, body());
        return fulfill({ ok: true, account });
      }
      if (method === "DELETE") {
        accounts = accounts.filter((a) => a.id !== id);
        return fulfill({ ok: true });
      }
      if (path.endsWith("/login/password")) {
        attempts++;
        assert.equal(body().password, "001234");
        if (attempts === 1) {
          assert.equal(body().rememberPassword, true);
          pending = () => {
            Object.assign(account, {
              hasSavedPassword: true,
              autoLoginStatus: "enabled",
              loginStatus: "valid",
              lastError: "",
            });
            return fulfill({ ok: true, account });
          };
          return;
        }
        if (attempts === 2) {
          Object.assign(account, {
            autoLoginStatus: "manual_required",
            loginStatus: "invalid",
            lastError: "服务密码错误，请手动重新登录并更新密码",
          });
          return fulfill({ ok: false, message: account.lastError, account });
        }
        assert.equal(body().rememberPassword, false);
        Object.assign(account, {
          hasSavedPassword: false,
          autoLoginStatus: "not_saved",
          loginStatus: "valid",
          lastError: "",
        });
        return fulfill({ ok: true, account });
      }
      throw new Error(`Unexpected API ${method} ${path}`);
    });
    await page.goto(base);
    await page
      .getByRole("button", { name: "189****0001", exact: true })
      .waitFor();
    assert.equal(await page.locator("tbody tr").count(), 6);
    assert.equal(await page.getByText("654321", { exact: true }).count(), 0);
    assert.equal(
      await page.getByText("青龙自动化", { exact: true }).count(),
      0,
    );
    assert.equal(await page.getByText("任务记录", { exact: true }).count(), 0);
    assert.equal(historyReads, 0);
    assert.ok(
      await page
        .locator(".brand img")
        .evaluate((img) => img.complete && img.naturalWidth > 0),
    );
    assert.equal(
      await page.locator('link[rel="icon"]').getAttribute("href"),
      "/favicon.png",
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    if (output) {
      fs.mkdirSync(output, { recursive: true });
      await page.screenshot({
        path: `${output}/accounts-${width}.png`,
        fullPage: true,
      });
    }
    await page.getByLabel("搜索账号").fill("家庭副卡");
    assert.equal(await page.locator("tbody tr").count(), 1);
    await page.getByLabel("搜索账号").fill("");
    await page
      .getByRole("button", { name: "编辑", exact: true })
      .first()
      .click();
    await page.getByLabel("备注", { exact: true }).fill("123456");
    await page.getByRole("button", { name: "保存账号" }).click();
    await page
      .getByRole("alert")
      .filter({ hasText: "备注不要填写服务密码" })
      .waitFor();
    await page.getByLabel("备注", { exact: true }).fill("主号已编辑");
    await page.getByLabel("分组", { exact: true }).fill("新分组");
    await page.getByRole("button", { name: "保存账号" }).click();
    await page.getByText("主号已编辑", { exact: true }).waitFor();
    await page
      .getByRole("button", { name: "登录", exact: true })
      .first()
      .click();
    assert.equal(
      await page.getByLabel("手机号", { exact: true }).inputValue(),
      "18900000001",
    );
    assert.equal(
      await page.getByLabel("手机号", { exact: true }).getAttribute("readonly"),
      "",
    );
    assert.equal(
      await page.getByLabel("记住服务密码，过期自动补登").isChecked(),
      true,
    );
    const password = page.getByLabel("服务密码", { exact: true });
    assert.equal(await password.getAttribute("type"), "password");
    await password.fill("abc");
    assert.equal(
      await page
        .getByRole("button", { name: "快捷登录", exact: true })
        .isDisabled(),
      true,
    );
    await password.fill("001234");
    await password.press("Enter");
    await page.getByRole("button", { name: "正在登录…" }).waitFor();
    assert.equal(await password.isDisabled(), true);
    assert.equal(
      await page.getByRole("button", { name: "关闭弹窗" }).isDisabled(),
      true,
    );
    await pending();
    await page
      .getByRole("status")
      .filter({ hasText: "登录成功，已加密记住" })
      .waitFor();
    await page
      .getByRole("button", { name: "重新登录", exact: true })
      .first()
      .click();
    assert.equal(await password.inputValue(), "");
    assert.equal(
      await page.getByLabel("手机号", { exact: true }).inputValue(),
      "18900000001",
    );
    await password.fill("001234");
    await password.press("Enter");
    await page.getByRole("alert").filter({ hasText: "服务密码错误" }).waitFor();
    assert.equal(await password.inputValue(), "");
    if (width < 500) await page.setViewportSize({ width, height: 540 });
    assert.ok(
      await page.locator("dialog").evaluate((el) => {
        const r = el.getBoundingClientRect();
        return (
          r.top >= 0 &&
          r.bottom <= innerHeight &&
          r.left >= 0 &&
          r.right <= innerWidth
        );
      }),
    );
    assert.ok(
      !(await page
        .locator("body")
        .innerText()
        .then((text) => text.includes("001234"))),
    );
    if (output)
      await page.screenshot({
        path: `${output}/relogin-${width}.png`,
        fullPage: true,
      });
    await page.keyboard.press("Escape");
    await page
      .getByRole("button", { name: "重新登录", exact: true })
      .first()
      .click();
    assert.equal(await password.inputValue(), "");
    await page.getByLabel("记住服务密码，过期自动补登").uncheck();
    await password.fill("001234");
    await password.press("Enter");
    await page
      .getByRole("status")
      .filter({ hasText: "本次不记住密码" })
      .waitFor();
    assert.equal(page.context().pages().length, 1);
    assert.equal(page.url(), base + "/");
    assert.ok(
      await page.evaluate(
        () =>
          !JSON.stringify({ ...localStorage, ...sessionStorage }).includes(
            "001234",
          ),
      ),
    );
    await page.setViewportSize({ width, height: 900 });
    await page.getByRole("button", { name: "批量导入", exact: true }).click();
    await page
      .getByRole("textbox", { name: "账号列表", exact: true })
      .fill("18900000009#123456#个人");
    await page.getByRole("button", { name: "确认导入" }).click();
    await page.getByRole("alert").filter({ hasText: "每行格式" }).waitFor();
    assert.equal(importCalls, 0);
    await page
      .getByRole("textbox", { name: "账号列表", exact: true })
      .fill("18900000009#导入账号#个人");
    await page.getByRole("button", { name: "确认导入" }).click();
    await page.getByText("导入账号", { exact: true }).waitFor();
    await page.getByLabel("选择 189****0001", { exact: true }).check();
    await page.getByLabel("选择 189****0002", { exact: true }).check();
    await page.getByRole("button", { name: "检查登录", exact: true }).click();
    await page
      .getByRole("region", { name: "本次操作结果" })
      .getByText("登录号码核验通过", { exact: true })
      .waitFor();
    assert.equal(historyReads, 0);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    failAccounts = true;
    await page.getByRole("button", { name: "刷新", exact: true }).click();
    await page
      .getByRole("alert")
      .filter({ hasText: "已保留当前列表" })
      .waitFor();
    assert.equal(await page.locator("tbody tr").count(), 7);
    failAccounts = false;
    accounts = [];
    await page.getByRole("button", { name: "刷新", exact: true }).click();
    await page.getByText("添加第一个北京电信账号", { exact: true }).waitFor();
    await page
      .getByRole("button", { name: "添加账号", exact: true })
      .last()
      .click();
    await page.getByLabel("手机号", { exact: true }).fill("18900000011");
    await page.getByLabel("备注", { exact: true }).fill("新增账号");
    await page.getByRole("button", { name: "保存账号", exact: true }).click();
    await page.getByText("新增账号", { exact: true }).waitFor();
    await page.getByLabel("选择 189****0011", { exact: true }).check();
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "删除", exact: true }).click();
    await page.getByText("添加第一个北京电信账号", { exact: true }).waitFor();
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log(
    "Desktop/H5 1440/390/320 passed: logo/favicon, no history requests, secret masking, default remember, prefilled phone, manual replacement, opt-out, import, inline batch results, offline preservation, bounded dialogs.",
  );
} finally {
  await browser.close();
}

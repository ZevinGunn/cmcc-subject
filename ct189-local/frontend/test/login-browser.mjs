import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "../../backend/node_modules/playwright/index.mjs";
const base = process.env.CT189_UI_BASE || "http://127.0.0.1:5711";
const output = process.env.CT189_QA_DIR;
const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 960 } });
    page.on("pageerror", (error) => errors.push(error.message));
    let accounts = Array.from({ length: 8 }, (_, i) => ({
      id: `fixture-${i}`,
      phone: `1890000000${i + 1}`,
      maskedPhone: `189****000${i + 1}`,
      label: [
        "主号码",
        "工作号码",
        "家庭副卡",
        "备用号码",
        "出差专用",
        "流量副卡",
        "测试号码",
        "备用副卡",
      ][i],
      group: ["个人", "工作", "家庭"][i % 3],
      enabled: i !== 6,
      loginStatus: i % 3 === 0 ? "valid" : i % 3 === 1 ? "invalid" : "new",
      lastLoginAt: i % 3 === 0 ? "2026-10-19T00:20:00Z" : "",
      lastRefreshAt: i % 3 === 0 ? "2026-10-19T00:35:00Z" : "",
      lastError: i === 1 ? "登录已失效，请重新登录" : "",
    }));
    let tasks = [],
      attempts = 0,
      pending,
      importCalls = 0,
      failAccounts = false;
    await page.route("**/api/**", async (route) => {
      const path = new URL(route.request().url()).pathname;
      const method = route.request().method();
      const body = () => route.request().postDataJSON();
      const fulfill = (data) =>
        route.fulfill({
          contentType: "application/json",
          body: JSON.stringify(data),
        });
      if (path === "/api/health") return fulfill({ ok: true });
      if (path === "/api/accounts" && method === "GET" && failAccounts)
        return route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({ ok: false, message: "离线" }),
        });
      if (path === "/api/accounts" && method === "GET")
        return fulfill({ ok: true, accounts });
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
      if (path === "/api/tasks") {
        if (method === "POST") {
          tasks.unshift({
            id: "task-fixture",
            title: "检查登录",
            action: body().action,
            status: "partial",
            createdAt: "2026-10-19T00:40:00Z",
            items: body().accountIds.map((id, i) => ({
              accountId: id,
              maskedPhone: accounts.find((a) => a.id === id).maskedPhone,
              status: i === 0 ? "success" : "failed",
              message: i === 0 ? "登录号码核验通过" : "登录已失效，请重新登录",
            })),
          });
          return fulfill({ ok: true, task: tasks[0] });
        }
        return fulfill({ ok: true, tasks });
      }
      if (path.endsWith("/logs")) return fulfill({ ok: true, logs: [] });
      const id = path.split("/")[3];
      const account = accounts.find((a) => a.id === id);
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
          pending = () => {
            Object.assign(account, { loginStatus: "valid", lastError: "" });
            return fulfill({ ok: true, account });
          };
          return;
        }
        Object.assign(account, {
          loginStatus: "invalid",
          lastError: "服务密码错误，请重试",
        });
        return fulfill({ ok: false, message: account.lastError, account });
      }
      throw new Error(`Unexpected request ${method} ${path}`);
    });
    await page.goto(base);
    await page.getByRole("button", { name: "主号码", exact: true }).waitFor();
    assert.equal(await page.locator("tbody tr").count(), 8);
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
    await page.getByLabel("备注", { exact: true }).fill("主号已编辑");
    await page.getByLabel("分组", { exact: true }).fill("新分组");
    await page.getByRole("button", { name: "保存账号", exact: true }).click();
    await page
      .getByRole("button", { name: "主号已编辑", exact: true })
      .waitFor();
    assert.equal(accounts[0].group, "新分组");
    await page
      .getByRole("button", { name: "登录", exact: true })
      .first()
      .click();
    const password = page.getByLabel("服务密码", { exact: true });
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
    await page.getByRole("status").filter({ hasText: "登录成功" }).waitFor();
    await page
      .getByRole("button", { name: "登录", exact: true })
      .first()
      .click();
    assert.equal(await password.inputValue(), "");
    await password.fill("001234");
    await password.press("Enter");
    await page.getByRole("alert").filter({ hasText: "服务密码错误" }).waitFor();
    assert.equal(await password.inputValue(), "");
    assert.equal(attempts, 2);
    assert.equal(browser.contexts().length > 0, true);
    assert.equal(page.context().pages().length, 1);
    assert.equal(page.url(), base + "/");
    if (output)
      await page.screenshot({
        path: `${output}/login-error-${width}.png`,
        fullPage: true,
      });
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "批量导入", exact: true }).click();
    await page
      .getByRole("textbox", { name: "账号列表", exact: true })
      .fill("错误号码#备注");
    await page.getByRole("button", { name: "确认导入" }).click();
    await page.getByRole("alert").filter({ hasText: "每行格式" }).waitFor();
    assert.equal(importCalls, 0);
    await page
      .getByRole("textbox", { name: "账号列表", exact: true })
      .fill("18900000009#导入账号#个人");
    await page.getByRole("button", { name: "确认导入" }).click();
    await page.getByRole("button", { name: "导入账号", exact: true }).waitFor();
    assert.equal(importCalls, 1);
    await page.getByLabel("选择 189****0001", { exact: true }).check();
    await page.getByLabel("选择 189****0002", { exact: true }).check();
    await page.getByRole("button", { name: "检查登录", exact: true }).click();
    await page
      .getByRole("status")
      .filter({ hasText: "任务已加入队列" })
      .waitFor();
    await page.getByRole("button", { name: "任务记录", exact: true }).click();
    await page.getByText("部分完成", { exact: true }).waitFor();
    await page.getByRole("button", { name: "结果", exact: true }).click();
    await page.getByText("登录号码核验通过", { exact: true }).waitFor();
    if (output)
      await page.screenshot({
        path: `${output}/task-result-${width}.png`,
        fullPage: true,
      });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "青龙自动化", exact: true }).click();
    await page.getByText("独立 Python 脚本", { exact: true }).waitFor();
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await page.getByRole("button", { name: /^账号管理/ }).click();
    failAccounts = true;
    await page.getByRole("button", { name: "刷新", exact: true }).click();
    await page
      .getByRole("alert")
      .filter({ hasText: "已保留当前列表" })
      .waitFor();
    assert.equal(await page.locator("tbody tr").count(), 9);
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
    await page.getByRole("button", { name: "新增账号", exact: true }).waitFor();
    await page.getByLabel("选择 189****0011", { exact: true }).check();
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "删除", exact: true }).click();
    await page.getByText("添加第一个北京电信账号", { exact: true }).waitFor();
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log(
    "Desktop/mobile checks passed: filters, edit, login pending/success/failure, import validation, batch tasks, results, automation, no redirect or overflow.",
  );
} finally {
  await browser.close();
}

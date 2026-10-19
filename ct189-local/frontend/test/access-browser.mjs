import assert from "node:assert/strict";
import { chromium } from "../../backend/node_modules/playwright/index.mjs";
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 780 } });
    let authenticated = false,
      reads = 0;
    await page.route("**/api/**", async (route) => {
      const req = route.request(),
        url = new URL(req.url()).pathname;
      const reply = (data, status = 200) =>
        route.fulfill({
          status,
          contentType: "application/json",
          body: JSON.stringify(data),
        });
      if (url === "/api/health")
        return reply({ ok: true, accessRequired: true });
      if (url === "/api/access/session")
        return reply({
          ok: true,
          required: true,
          authenticated,
          csrfToken: authenticated ? "fixture-csrf" : "",
        });
      if (url === "/api/access/login") {
        assert.equal(req.postDataJSON().username, "admin");
        authenticated =
          req.postDataJSON().password === "fixture-access-password";
        return reply(
          authenticated
            ? { ok: true, csrfToken: "fixture-csrf" }
            : { ok: false, message: "访问账号或密码错误" },
          authenticated ? 200 : 401,
        );
      }
      if (url === "/api/access/logout") {
        assert.equal(req.headers()["x-csrf-token"], "fixture-csrf");
        authenticated = false;
        return reply({ ok: true });
      }
      if (url === "/api/accounts") {
        reads++;
        assert.equal(authenticated, true);
        return reply({ ok: true, accounts: [] });
      }
      throw Error(`Unexpected request: ${url}`);
    });
    await page.goto(process.env.CT189_UI_BASE || "http://127.0.0.1:5711");
    await page.getByRole("heading", { name: "登录快捷服务" }).waitFor();
    assert.equal(reads, 0);
    assert.equal(await page.title(), "北京电信快捷服务");
    await page.getByLabel("访问密码", { exact: true }).fill("wrong");
    await page.getByRole("button", { name: "登录", exact: true }).click();
    await page.getByRole("alert").waitFor();
    assert.equal(
      await page.getByLabel("访问密码", { exact: true }).inputValue(),
      "",
    );
    await page
      .getByLabel("访问密码", { exact: true })
      .fill("fixture-access-password");
    await page.getByRole("button", { name: "登录", exact: true }).click();
    await page
      .getByRole("heading", { name: "账号管理", exact: true })
      .waitFor();
    assert.ok(reads > 0);
    await page.getByRole("button", { name: "退出", exact: true }).click();
    await page.getByRole("heading", { name: "登录快捷服务" }).waitFor();
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    assert.equal(
      await page.evaluate(() => localStorage.length + sessionStorage.length),
      0,
    );
    await page.close();
  }
  console.log(
    "Public access UI 1440/390/320 passed: gate, password masking, login failure, CSRF, logout, no account reads before authentication.",
  );
} finally {
  await browser.close();
}

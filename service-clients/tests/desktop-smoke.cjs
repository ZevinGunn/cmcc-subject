const { _electron: electron } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
(async () => {
  const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'suixing-test-'));
  const root = path.resolve(__dirname, '..');
  const application = await electron.launch({ executablePath: process.env.CLIENT_ELECTRON || require('electron'),
    args: [root, `--user-data-dir=${profile}`], timeout: 40000 });
  try {
    const shell = await application.firstWindow();
    await shell.waitForLoadState('domcontentloaded');
    await shell.getByRole('button', { name: '专属链接', exact: true }).click();
    await shell.getByLabel('专属链接或邀请码').fill('http://evil.test/public?link=fixture_only');
    await shell.getByRole('button', { name: '打开并登录' }).click();
    await shell.getByRole('alert').filter({ hasText: 'HTTPS' }).waitFor();
    await shell.getByRole('button', { name: '取消', exact: true }).click();
    assert.equal(await shell.locator('dialog').evaluate(element => element.open), false);
    assert.equal(await shell.locator('[data-service]').count(), require('../shared/services.json').services.length);
    await shell.locator('#tool-search').fill('合约');
    assert.equal(await shell.locator('[data-service]').count(), 1);
    await shell.locator('#tool-search').fill('不存在的工具');
    assert.equal(await shell.locator('#no-results').isVisible(), true);
    await shell.locator('#tool-search').fill('');
    for (const [name, service] of [['星巴克卡券','starbucks'], ['周三拼图','puzzle'], ['移动账号','mobile']]) {
      await shell.getByRole('button', { name, exact: true }).click();
      await shell.locator(`[data-service="${service}"][aria-current="page"]`).waitFor();
    }
    const isolation = await application.evaluate(({ BrowserWindow }) => {
      const win = BrowserWindow.getAllWindows()[0];
      const remote = win.contentView.children[0].webContents;
      const prefs = remote.getLastWebPreferences();
      return { nodeIntegration: prefs.nodeIntegration, contextIsolation: prefs.contextIsolation, sandbox: prefs.sandbox, preload: prefs.preload, url: remote.getURL() };
    });
    assert.equal(isolation.nodeIntegration, false); assert.equal(isolation.contextIsolation, true); assert.equal(isolation.sandbox, true); assert.ok(!isolation.preload);
    await shell.getByRole('status').filter({ hasText: '已连接' }).waitFor({ timeout: 50000 });
    let runtime;
    for (let attempt = 0; attempt < 40; attempt++) {
      runtime = await application.evaluate(async ({ BrowserWindow }) => {
      const remote = BrowserWindow.getAllWindows()[0].contentView.children[0].webContents;
      return remote.executeJavaScript('({node: typeof process, bridge: typeof window.toolbox, text: document.body.innerText.slice(0, 600), width: innerWidth, scrollWidth: document.documentElement.scrollWidth, url: location.origin + location.pathname, ready: document.readyState})');
      });
      if (runtime.text.length > 0 && runtime.url.startsWith('https://home.1008086.xyz')) break;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    assert.equal(runtime.node, 'undefined'); assert.equal(runtime.bridge, 'undefined');
    assert.ok(runtime.text.length > 0, `公网页面应有可见内容：${JSON.stringify(runtime)}`);
    await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setContentSize(800, 600));
    await shell.screenshot({ path: path.join(root, 'artifacts/desktop-shell-800.png') });
    async function captureRemote(name) {
      const base64 = await application.evaluate(async ({ BrowserWindow }) => {
        const remote = BrowserWindow.getAllWindows()[0].contentView.children[0].webContents;
        const image = await remote.capturePage(); return image.toPNG().toString('base64');
      });
      await fs.writeFile(path.join(root, 'artifacts', name), Buffer.from(base64, 'base64'));
    }
    await captureRemote('desktop-service-800.png');
    await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setContentSize(1280, 860));
    await shell.screenshot({ path: path.join(root, 'artifacts/desktop-shell-1280.png') });
    await captureRemote('desktop-service-1280.png');
    console.log('桌面测试通过：公网页面加载、工具切换、无效链接拦截、弹窗关闭、窗口适配、远程网页隔离');
  } finally { await application.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });

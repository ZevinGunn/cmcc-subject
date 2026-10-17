const { _electron: electron } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
(async () => {
  const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'suixing-security-'));
  const application = await electron.launch({ executablePath: process.env.CLIENT_ELECTRON || require('electron'),
    args: [path.resolve(__dirname, '..'), `--user-data-dir=${profile}`], timeout: 40000 });
  try {
    const shell = await application.firstWindow();
    await shell.waitForLoadState('domcontentloaded');
    await shell.locator('[data-service="mobile"]').waitFor();
    await application.evaluate(({ BrowserWindow, session, shell }) => {
      globalThis.testExternalURLs = [];
      shell.openExternal = async url => { globalThis.testExternalURLs.push(url); };
      const store = session.fromPartition('persist:suixing-service');
      BrowserWindow.getAllWindows()[0].contentView.children[0].webContents.stop();
      store.protocol.handle('https', request => new Response('<!doctype html><html><body><h1>隔离测试页面</h1><p>' + request.url + '</p></body></html>', { headers: { 'content-type': 'text/html' } }));
      return BrowserWindow.getAllWindows()[0].contentView.children[0].webContents.loadURL('https://home.1008086.xyz/test-fixture');
    });
    await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].contentView.children[0].webContents.executeJavaScript("window.open('https://dev.coc.10086.cn/test-fixture', '_blank'); void 0;", true));
    await wait(200);
    let state = await application.evaluate(({ BrowserWindow }) => ({ windows: BrowserWindow.getAllWindows().length, external: globalThis.testExternalURLs }));
    assert.equal(state.windows, 1); assert.equal(state.external.length, 1);
    await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].contentView.children[0].webContents.executeJavaScript("window.open('file:///etc/passwd', '_blank'); void 0;", true));
    await wait(200);
    assert.equal(await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().length), 1);
    await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].contentView.children[0].webContents.executeJavaScript("window.testPopup = window.open('about:blank', '_blank'); void 0;", true));
    await wait(200);
    const popupPrefs = await application.evaluate(({ BrowserWindow }) => {
      const popup = BrowserWindow.getAllWindows().find(win => !win.contentView.children.length);
      const prefs = popup.webContents.getLastWebPreferences();
      return { node: prefs.nodeIntegration, sandbox: prefs.sandbox, context: prefs.contextIsolation, preload: prefs.preload };
    });
    assert.equal(popupPrefs.node, false); assert.equal(popupPrefs.sandbox, true); assert.equal(popupPrefs.context, true); assert.ok(!popupPrefs.preload);
    await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().find(win => win.contentView.children.length).contentView.children[0].webContents.executeJavaScript("window.testPopup.location = 'https://dev.coc.10086.cn/test-fixture-2'; void 0;", true));
    await wait(300);
    state = await application.evaluate(({ BrowserWindow }) => ({ windows: BrowserWindow.getAllWindows().length, external: globalThis.testExternalURLs }));
    assert.equal(state.windows, 1); assert.equal(state.external.length, 2);
    const privileged = await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].contentView.children[0].webContents.executeJavaScript('({ bridge: typeof window.toolbox, node: typeof require })'));
    assert.equal(privileged.node, 'undefined'); assert.equal(privileged.bridge, 'undefined');
    for (const service of require('../shared/services.json').services) {
      await shell.locator('#tool-search').fill(service.name);
      await shell.locator(`[data-service="${service.id}"]`).click();
      await shell.getByRole('button', { name: '工具首页', exact: true }).click();
      let current = '';
      for (let attempt = 0; attempt < 50; attempt++) {
        current = await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].contentView.children[0].webContents.getURL());
        if (current === service.url) break;
        await wait(50);
      }
      assert.equal(current, service.url, service.name);
      assert.equal(await shell.locator('#current-tool').textContent(), service.name);
    }
    await shell.locator('#tool-search').fill('');
    console.log('桌面安全交互通过：全部工具跨域切换、搜索、外部跳转、异步空白弹窗、危险协议拦截、弹窗隔离；未访问真实业务接口');
  } finally { await application.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });

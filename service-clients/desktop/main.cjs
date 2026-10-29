const { app, BrowserWindow, WebContentsView, ipcMain, Menu, shell, dialog, session } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { config, isInternal, isExternal, serviceURL, invitationURL, navigationKind } = require('../shared/policy.cjs');
const fs = require('node:fs');
const shellFile = path.join(__dirname, 'index.html');
const shellURL = pathToFileURL(shellFile).href;
const partition = 'persist:suixing-service';
let main, view, activeService = 'mobile', loading = false, error = '', overlay = false;
let navigationId = 0;
const pages = new Map();
const popups = new Set();
const locked = app.requestSingleInstanceLock();
if (!locked) app.quit();
function readPreferences() {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(app.getPath('userData'), 'preferences.json'), 'utf8'));
    if (config.services.some(item => item.id === data.service)) activeService = data.service;
  } catch { /* 首次启动使用默认入口 */ }
}
function savePreferences() {
  // 仅保存工具编号，不保存专属链接、网页地址、账号或令牌。
  try { fs.writeFileSync(path.join(app.getPath('userData'), 'preferences.json'), JSON.stringify({ service: activeService })); } catch { /* 不阻断工具打开 */ }
}
function sendState() {
  if (!main || main.isDestroyed() || !view) return;
  const contents = view.webContents;
  main.webContents.send('toolbox:state', { service: activeService, loading, error,
    url: contents.getURL(),
    canGoBack: contents.navigationHistory.canGoBack(), canGoForward: contents.navigationHistory.canGoForward(), version: app.getVersion() });
}
function layout() {
  if (!main || !view) return;
  const [width, height] = main.getContentSize();
  view.setVisible(!overlay);
  const sidebar = width <= 900 ? 200 : 232;
  view.setBounds({ x: sidebar, y: 104, width: Math.max(0, width - sidebar), height: Math.max(0, height - 104) });
}
async function openExternal(value) {
  if (!isExternal(value)) return;
  try { await shell.openExternal(value); } catch { error = '无法打开浏览器，请稍后重试'; sendState(); }
}
function secureContents(contents, popup) {
  const navigate = (event, url) => {
    const kind = navigationKind(url);
    if (kind === 'internal' || (popup && url === 'about:blank')) return;
    event.preventDefault();
    if (kind === 'external') void openExternal(url);
    if (popup && !popup.isDestroyed()) popup.close();
  };
  contents.on('will-navigate', navigate);
  contents.on('will-redirect', navigate);
  contents.on('will-attach-webview', event => event.preventDefault());
  contents.setWindowOpenHandler(({ url }) => {
    if (isExternal(url) && !isInternal(url)) { void openExternal(url); return { action: 'deny' }; }
    if (!isInternal(url) && url !== 'about:blank') return { action: 'deny' };
    return { action: 'allow', overrideBrowserWindowOptions: { width: 1100, height: 800,
      autoHideMenuBar: true, backgroundColor: '#ffffff',
      webPreferences: { partition, nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true, navigateOnDragDrop: false } } };
  });
  contents.on('did-create-window', child => {
    popups.add(child);
    child.setMenu(null);
    secureContents(child.webContents, child);
    child.on('closed', () => popups.delete(child));
  });
  contents.on('context-menu', (_event, params) => {
    const items = [];
    if (params.isEditable) items.push({ role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' });
    else if (params.selectionText) items.push({ role: 'copy' }, { role: 'selectAll' });
    if (items.length) Menu.buildFromTemplate(items).popup();
  });
}
function navigate(id, url) {
  if (!config.services.some(item => item.id === id)) throw new Error('未知工具');
  if (url && !isInternal(url)) throw new Error('访问地址无效');
  if (view && !view.webContents.isDestroyed()) {
    const current = view.webContents.getURL();
    // 只在当前进程保留页面，退出后不保留查询参数中的凭证。
    if (isInternal(current)) pages.set(activeService, current);
  }
  activeService = id; error = ''; loading = true; savePreferences();
  const currentNavigation = ++navigationId;
  sendState();
  void view.webContents.loadURL(url || pages.get(id) || serviceURL(id)).catch(failure => {
    if (currentNavigation !== navigationId || failure.code === 'ERR_ABORTED' || failure.errno === -3) return;
    error = '页面暂时无法连接，请检查网络后重试'; loading = false; sendState();
  });
}
function installSessionPolicy() {
  const store = session.fromPartition(partition);
  const allowedPermission = (contents, permission, details = {}) => {
    const source = details.requestingUrl || details.securityOrigin || contents?.getURL();
    return isInternal(source) && ['clipboard-sanitized-write', 'clipboard-write'].includes(permission);
  };
  store.setPermissionRequestHandler((contents, permission, callback, details) => callback(allowedPermission(contents, permission, details)));
  store.setPermissionCheckHandler((contents, permission, origin, details) => allowedPermission(contents, permission, { ...details, securityOrigin: origin }));
  store.on('will-download', async (_event, item) => {
    item.pause();
    try {
      const result = await dialog.showSaveDialog(main, { defaultPath: path.join(app.getPath('downloads'), path.basename(item.getFilename())) });
      if (result.canceled || !result.filePath) item.cancel();
      else { item.setSavePath(result.filePath); item.resume(); }
    } catch { item.cancel(); }
  });
}
function createWindow() {
  readPreferences();
  main = new BrowserWindow({ width: 1280, height: 860, minWidth: 760, minHeight: 560, show: false,
    title: '随行工具箱', backgroundColor: '#f6f7f9',
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.cjs'), sandbox: true, contextIsolation: true, nodeIntegration: false } });
  main.webContents.on('will-navigate', event => event.preventDefault());
  main.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  view = new WebContentsView({ webPreferences: { partition, sandbox: true, contextIsolation: true, nodeIntegration: false,
    webSecurity: true, navigateOnDragDrop: false, spellcheck: false } });
  main.contentView.addChildView(view);
  secureContents(view.webContents);
  view.webContents.on('did-start-loading', () => { loading = true; error = ''; sendState(); });
  view.webContents.on('did-stop-loading', () => { loading = false; sendState(); });
  view.webContents.on('did-fail-load', (_event, code, _description, _url, mainFrame) => {
    if (mainFrame && code !== -3) { loading = false; error = '页面暂时无法连接，请检查网络后重试'; sendState(); }
  });
  view.webContents.on('render-process-gone', () => { loading = false; error = '页面已停止运行，请点击刷新恢复'; sendState(); });
  view.webContents.on('did-navigate', sendState);
  view.webContents.on('did-navigate-in-page', sendState);
  main.on('resize', layout);
  main.on('closed', () => {
    for (const popup of popups) if (!popup.isDestroyed()) popup.close();
    if (view && !view.webContents.isDestroyed()) view.webContents.close();
    view = null; main = null;
  });
  main.once('ready-to-show', () => { main.show(); layout(); });
  main.webContents.once('did-finish-load', () => navigate(activeService));
  void main.loadFile(shellFile);
  const command = process.platform === 'darwin' ? 'Cmd' : 'Ctrl';
  const template = [
    ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []),
    { label: '工具', submenu: [
      ...config.services.map((item, index) => ({ label: item.name, ...(index < 9 ? { accelerator: `${command}+${index + 1}` } : {}), click: () => navigate(item.id) })),
      { type: 'separator' }, { label: '刷新', accelerator: `${command}+R`, click: () => view?.webContents.reload() },
      { label: '返回', accelerator: 'Alt+Left', click: () => { if (view?.webContents.navigationHistory.canGoBack()) view.webContents.navigationHistory.goBack(); } },
      { role: 'close' }
    ] },
    { role: 'editMenu' }, { role: 'viewMenu' }, { role: 'windowMenu' }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
ipcMain.handle('toolbox:action', async (event, action, value) => {
  if (event.sender !== main?.webContents || event.senderFrame?.url !== shellURL) throw new Error('访问来源无效');
  try {
    switch (action) {
      case 'state': sendState(); return { ok: true, services: config.services, groups: config.groups };
      case 'service': navigate(value); break;
      case 'home': pages.delete(activeService); navigate(activeService, serviceURL(activeService)); break;
      case 'invite': navigate('mobile', invitationURL(value)); break;
      case 'back': if (view.webContents.navigationHistory.canGoBack()) view.webContents.navigationHistory.goBack(); break;
      case 'forward': if (view.webContents.navigationHistory.canGoForward()) view.webContents.navigationHistory.goForward(); break;
      case 'reload': view.webContents.reload(); break;
      case 'browser': await openExternal(view.webContents.getURL()); break;
      case 'overlay': overlay = value === true; layout(); break;
      case 'clear': {
        const result = await dialog.showMessageBox(main, { type: 'question', buttons: ['取消', '清除并退出登录'], defaultId: 0, cancelId: 0,
          message: '清除此客户端的登录数据？', detail: '会退出各工具的站点登录。服务端账号和任务不会被删除。' });
        if (result.response !== 1) break;
        for (const popup of popups) if (!popup.isDestroyed()) popup.close();
        await view.webContents.loadURL('about:blank');
        await view.webContents.session.clearStorageData();
        await view.webContents.session.clearCache();
        pages.clear(); navigate('mobile'); break;
      }
      default: throw new Error('不支持此操作');
    }
    return { ok: true };
  } catch (failure) { return { ok: false, message: failure.message || '操作失败，请重试' }; }
});
app.on('second-instance', () => { if (main) { if (main.isMinimized()) main.restore(); main.show(); main.focus(); } });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
if (locked) app.whenReady().then(() => { installSessionPolicy(); createWindow(); });
app.on('activate', () => { if (locked && !main) createWindow(); });

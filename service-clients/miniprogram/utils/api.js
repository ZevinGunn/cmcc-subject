const ORIGIN = 'https://home.1008086.xyz';
const SESSION_KEY = 'suixing.session.v1';
let redirecting = false;
let generation = 0;
function session() {
  const value = wx.getStorageSync(SESSION_KEY);
  if (!value) return '';
  if (!value.cookie || value.expiresAt <= Date.now()) { clearSession(); return ''; }
  return value.cookie;
}
function clearSession() { generation++; wx.removeStorageSync(SESSION_KEY); if (typeof getApp === 'function') getApp().globalData.user = null; }
function captureSession(response) {
  const cookies = Array.isArray(response.cookies) ? response.cookies : [];
  const raw = response.header && (response.header['Set-Cookie'] || response.header['set-cookie']);
  if (raw) cookies.push(String(raw));
  for (const value of cookies) {
    const match = String(value).match(/(?:^|[,;]\s*)user_session=([^;,\s]*)/);
    if (match) {
      if (!match[1]) { clearSession(); return; }
      wx.setStorageSync(SESSION_KEY, { cookie: `user_session=${match[1]}`, expiresAt: Date.now() + 30 * 86400000 });
      generation++;
      return;
    }
  }
}
function request(route, options) {
  const config = options || {};
  if (!/^\/api\/[a-zA-Z0-9/_?=&%-]+$/.test(route) || route.indexOf('..') !== -1) return Promise.reject(new Error('接口地址无效'));
  const cookie = session(), requestGeneration = generation;
  return new Promise((resolve, reject) => {
    wx.request({ url: ORIGIN + route, method: config.method || 'GET', data: config.data,
      timeout: 25000,
      header: { 'Content-Type': 'application/json', 'Cookie': cookie, 'x-starbucks-client': '1' },
      success(response) {
        try {
        if (requestGeneration !== generation) { reject(new Error('登录状态已变更，请重新查询')); return; }
        const body = response.data;
        if (response.statusCode === 401) clearSession();
        if (!body || typeof body !== 'object' || typeof body.ok !== 'boolean') {
          reject(new Error(`服务暂不可用（HTTP ${response.statusCode}）`)); return;
        }
        if (response.statusCode >= 400 || !body.ok) {
          const message = typeof body.message === 'string' && !/[<>]/.test(body.message) ? body.message : '请求未完成，请稍后重试';
          const failure = new Error(message); failure.status = response.statusCode; reject(failure); return;
        }
        captureSession(response); resolve(body.data);
        } catch { reject(new Error('无法保存登录状态，请检查本机存储后重试')); }
      },
      fail() { reject(new Error('无法连接服务，请检查网络或小程序合法域名配置')); }
    });
  });
}
function requireLogin() {
  if (session()) return true;
  if (!redirecting) {
    redirecting = true;
    wx.navigateTo({ url: '/pages/login/index', complete() { redirecting = false; } });
  }
  return false;
}
function showError(error) { wx.showToast({ title: error && error.message || '操作失败，请重试', icon: 'none', duration: 3500 }); }
function invitation(value) {
  const text = String(value || '').trim();
  const match = text.match(/^https:\/\/home\.1008086\.xyz(?::443)?\/(?:public|app\/cmcc-public\/?|app\/cmcc-public\/public)\?([^#]*)/i);
  let code = text;
  if (/^http/i.test(text)) {
    if (!match) throw new Error('请使用本站的 HTTPS 专属链接');
    const item = match[1].split('&').find(part => part.split('=')[0] === 'link');
    try { code = item ? decodeURIComponent(item.slice(5)) : ''; } catch { code = ''; }
  }
  if (!/^[a-zA-Z0-9_-]{6,128}$/.test(code)) throw new Error('请输入有效的专属链接或邀请码');
  return code;
}
module.exports = { ORIGIN, request, session, clearSession, requireLogin, showError, invitation };

const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
function harness() {
  const storage = new Map(); let response, lastRequest, deferred = false;
  const app = { globalData: { user: null } };
  const context = { module: { exports: {} }, Date, Promise, Error, String, Array, getApp: () => app,
    wx: { getStorageSync: key => storage.get(key), setStorageSync: (key,value) => storage.set(key,value), removeStorageSync: key => storage.delete(key),
      request: args => { lastRequest = args; if (!deferred) args.success(response); }, navigateTo: args => args.complete() } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../miniprogram/utils/api.js'), 'utf8'), context);
  return { api: context.module.exports, storage, app, respond: value => { response = value; }, request: () => lastRequest,
    defer: () => { deferred = true; }, finish: value => lastRequest.success(value) };
}
test('小程序从登录响应读取站点 Cookie，仅向固定 HTTPS API 发送', async () => {
  const h = harness();
  h.respond({ statusCode: 200, data: { ok: true, data: { user: { username: 'fixture' } } }, cookies: ['user_session=fixture-session; Path=/; HttpOnly; Secure'] });
  await h.api.request('/api/auth/link-login', { method: 'POST', data: { link: 'fixture_123' } });
  assert.equal(h.api.session(), 'user_session=fixture-session');
  h.respond({ statusCode: 200, data: { ok: true, data: { accounts: [] } } });
  await h.api.request('/api/auth/accounts');
  assert.equal(h.request().header.Cookie, 'user_session=fixture-session');
  assert.equal(h.request().url, 'https://home.1008086.xyz/api/auth/accounts');
  await assert.rejects(h.api.request('https://evil.test/api/auth/accounts'));
  await assert.rejects(h.api.request('/api/../credentials'));
});
test('HTML 错误和过期认证不会泄漏源码，401 清除登录', async () => {
  const h = harness();
  h.respond({ statusCode: 403, data: '<html>secret-server-error</html>' });
  await assert.rejects(h.api.request('/api/auth/me'), error => !error.message.includes('<html>') && !error.message.includes('secret-server-error'));
  h.storage.set('suixing.session.v1', { cookie: 'user_session=fixture', expiresAt: Date.now() + 60000 });
  h.app.globalData.user = { id: 'fixture' };
  h.respond({ statusCode: 401, data: { ok: false, message: '未登录' } });
  await assert.rejects(h.api.request('/api/auth/me'));
  assert.equal(h.api.session(), ''); assert.equal(h.app.globalData.user, null);
});
test('小程序链接校验与桌面端保持同一安全边界', () => {
  const h = harness();
  assert.equal(h.api.invitation('https://home.1008086.xyz/public?link=fixture_123&token=ignored'), 'fixture_123');
  assert.equal(h.api.invitation('fixture_123'), 'fixture_123');
  for (const value of ['https://home.1008086.xyz.evil.test/public?link=fixture_123', 'http://home.1008086.xyz/public?link=fixture_123', 'https://evil.test/?link=fixture_123']) assert.throws(() => h.api.invitation(value));
});
test('退出登录后迟到的账号响应不能恢复旧用户数据', async () => {
  const h = harness();
  h.storage.set('suixing.session.v1', { cookie: 'user_session=old-fixture', expiresAt: Date.now() + 60000 });
  h.defer();
  const pending = h.api.request('/api/auth/bootstrap');
  h.api.clearSession();
  h.finish({ statusCode: 200, data: { ok: true, data: { user: { id: 'old-user' } } } });
  await assert.rejects(pending, /登录状态已变更/);
  assert.equal(h.api.session(), ''); assert.equal(h.app.globalData.user, null);
});

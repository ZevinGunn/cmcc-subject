import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'yunpan-session-tests-'));
process.env.YUNPAN_DATA_DIR = directory;
process.env.YUNPAN_LOG_DIR = path.join(directory, 'logs');
const { saveSession, patchSession, loadSession, clearSession, sessionSummary } = await import('./sessionStore.js');
const { importAuthorization, querySpecToken } = await import('./yunpanClient.js');

test('并行更新不丢字段，保存权限为 0600', async () => {
  await saveSession({ account: 'test' });
  await Promise.all([patchSession({ lastCappAt: 'a' }), patchSession({ lastCloudPhoneAt: 'b' })]);
  const state = await loadSession();
  assert.equal(state.lastCappAt, 'a'); assert.equal(state.lastCloudPhoneAt, 'b');
  assert.equal((await fs.stat(path.join(directory, 'session.json'))).mode & 0o777, 0o600);
});

test('导入新账号清除旧账号票据，不把导入当成已验证登录', async () => {
  await saveSession({ lastGlobalAccessToken: 'old-secret', lastCappUrl: 'old-link' });
  const authorization = 'Basic ' + Buffer.from('mobile:13800000000:synthetic-demo').toString('base64');
  const result = await importAuthorization({ authorization });
  const state = await loadSession();
  assert.equal(result.session.authState, 'cached');
  assert.equal(state.lastGlobalAccessToken, ''); assert.equal(state.lastCappUrl, '');
  assert.equal(state.authToken, 'synthetic-demo');
  await assert.rejects(importAuthorization({ authorization: 'Bearer invalid' }), /Basic/);
});

test('App V2 真实请求为明文来源，拒绝携带 token 的失败响应', async () => {
  const oldFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url, options) => {
      assert.match(url, /querySpecTokenV2$/);
      assert.deepEqual(JSON.parse(options.body), { toSourceId: '001191' });
      assert.equal(options.headers['hcy-cool-flag'], undefined);
      assert.equal(options.headers['mcloud-skey'], undefined);
      assert.equal(options.headers['x-MM-Source'], '001');
      return Response.json({ success: false, code: '403', message: '暂无权限', data: { token: 'stale-token' } });
    };
    const result = await querySpecToken({ mode: 'auto', protocol: 'auto', toSourceId: '001191' });
    assert.equal(result.success, false); assert.equal(result.ssoToken, '');
    assert.equal(result.protocol, 'querySpecTokenV2-app');
    assert.equal((await loadSession()).lastSsoToken, '');
  } finally { globalThis.fetch = oldFetch; }
});

test('清空会话也清空全球通与云手机所有凭据', async () => {
  await patchSession({ lastGlobalAccessToken: 'demo', cloudPhoneSession: { token: 'demo' } });
  await clearSession();
  const state = await loadSession();
  assert.equal(state.authorization, ''); assert.equal(state.lastGlobalAccessToken, '');
  assert.equal(state.cloudPhoneSession, null);
});

test('鉴权失效清空全部业务缓存，成功换票恢复验证状态', async () => {
  await importAuthorization({ authorization: 'Basic ' + Buffer.from('mobile:13800000000:synthetic-demo').toString('base64') });
  await patchSession({ lastWxCookie: 'old', lastGlobalAccessToken: 'old',
    lastBuiltUrl: 'old', lastCappUrl: 'old', lastAiPhoneUrl: 'old', cloudPhoneSession: { token: 'old' } });
  const oldFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => Response.json({ success: false, code: '1010010015', message: '鉴权失效' });
    assert.equal((await querySpecToken({ mode: 'auto', protocol: 'auto', toSourceId: '001191' })).success, false);
    const state = await loadSession();
    assert.equal(sessionSummary(state).authState, 'expired');
    for (const key of ['lastWxCookie', 'lastGlobalAccessToken', 'lastBuiltUrl', 'lastCappUrl', 'lastAiPhoneUrl']) assert.equal(state[key], '');
    assert.equal(state.cloudPhoneSession, null);
    globalThis.fetch = async () => Response.json({ success: true, code: '0000', data: { token: 'new-demo' } });
    assert.equal((await querySpecToken({ mode: 'auto', protocol: 'auto', toSourceId: '001191' })).success, true);
    assert.equal(sessionSummary(await loadSession()).authState, 'active');
  } finally { globalThis.fetch = oldFetch; }
});

test.after(async () => { await fs.rm(directory, { recursive: true, force: true }); });

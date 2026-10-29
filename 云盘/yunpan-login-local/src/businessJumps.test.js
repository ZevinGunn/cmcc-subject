import assert from 'node:assert/strict';
import test from 'node:test';
import { generateBusinessJump, collectGlobalAccessToken } from './businessJumps.js';

test('全球通独立请求 001191，不把 001003 票据当作全球通成功', async () => {
  let asked;
  const result = await generateBusinessJump('global', {}, {
    query: async input => { asked = input; return { success: false, response: { code: '403', message: '暂无权限' } }; },
    persist: () => assert.fail('失败不保存链接')
  });
  assert.deepEqual(asked, { toSourceId: '001191', mode: 'v2', protocol: 'app' });
  assert.equal(result.success, false);
  assert.equal(result.message, '暂无权限');
  assert.equal(result.url, undefined);
});

test('每次生成云手机链接都重新换取 001216 票据', async () => {
  let calls = 0;
  const deps = { query: async input => {
    assert.equal(input.toSourceId, '001216');
    return { success: true, ssoToken: `fresh-${++calls}` };
  }, persist: async () => {} };
  const a = await generateBusinessJump('cloudphone', {}, deps);
  const b = await generateBusinessJump('cloudphone', {}, deps);
  assert.notEqual(a.url, b.url);
  assert.equal(calls, 2);
  assert.equal(new URLSearchParams(new URL(a.url).hash.split('?')[1]).get('token'), 'fresh-1');
  assert.equal(a.validationState, 'issued');
});

test('CAPP 使用换票后的 tmpToken，保留 hash 路由和应用 i', async () => {
  const result = await generateBusinessJump('capp', {}, {
    query: async ({ toSourceId }) => { assert.equal(toSourceId, '001216'); return { success: true, ssoToken: 'cloud-short' }; },
    exchange: async ({ ticket, targetSourceId }) => {
      assert.equal(ticket, 'cloud-short'); assert.equal(targetSourceId, '001304');
      return { tmpToken: 'capp-short', session: { token: 'cloud-long' } };
    }, persist: async patch => assert.equal(patch.cloudPhoneSession.token, 'cloud-long')
  });
  const params = new URLSearchParams(new URL(result.url).hash.split('?')[1]);
  assert.equal(params.get('token'), 'capp-short');
  assert.equal(params.get('targetSourceId'), '001304');
  assert.equal(params.get('i'), 'DYFvhV8fncc=');
});

test('错误 CAPP 域名在签发或消费票据之前拒绝', async () => {
  await assert.rejects(generateBusinessJump('capp', { template: 'https://evil.example/#/?i=a' }, {
    query: () => assert.fail('不应请求上游')
  }), /CAPP 模板/);
});

test('原生全球通链接可以独立验证，失败不保存 access_token', async () => {
  const url = 'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/new/ssoTokenLogin.action?backUrl=https%3A%2F%2Fqqt.cmicrwx.cn%2F2016tyjf%2Fxdractivity&token=native-ticket&targetSourceId=001191';
  const patches = [];
  const result = await collectGlobalAccessToken({ url }, {
    query: () => assert.fail('已有原生链接无须再次签发'),
    exchangeGlobal: async () => ({ success: false }),
    persist: async patch => patches.push(patch)
  });
  assert.equal(result.success, false);
  assert.deepEqual(patches, [{ lastGlobalTelecomUrl: '', lastGlobalTelecomAt: '',
    lastGlobalAccessToken: '', lastGlobalCookie: '', lastGlobalAccessAt: '' }]);
});

test('全球通网络异常前即清除可能已消费的短票和旧认证', async () => {
  const url = 'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/new/ssoTokenLogin.action?backUrl=https%3A%2F%2Fqqt.cmicrwx.cn%2F2016tyjf%2Fxdractivity&token=native-ticket';
  let cleared = false;
  await assert.rejects(collectGlobalAccessToken({ url }, {
    persist: async patch => { cleared = patch.lastGlobalAccessToken === '' && patch.lastGlobalTelecomUrl === ''; },
    exchangeGlobal: async () => { assert.equal(cleared, true); throw new Error('network timeout'); }
  }), /network timeout/);
});

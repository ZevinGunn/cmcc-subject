import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import test from 'node:test';
import { cloudPhoneHeaders, exchangeCloudPhoneTicket, buildCappUrl } from './cloudPhone.js';

test('云手机 H5 签名包括请求 ID、业务 Token 和时间戳', () => {
  const header = cloudPhoneHeaders('business-secret', 1791813904136);
  assert.equal(header.sign, crypto.createHash('md5').update(header.requestId + '3099801business-secretesdkabncgfsfkmlondn1791813904136').digest('hex'));
  assert.equal(header.platform, 'h5');
});

test('tokenValidate 的业务 Token 必须用于后续 getRcsToken 和签名', async () => {
  const calls = [];
  const result = await exchangeCloudPhoneTicket({ ticket: 'short-ticket', targetSourceId: '001005', fetchImpl: async (url, opts) => {
    calls.push({ url, opts, body: JSON.parse(opts.body) });
    return Response.json({ header: { status: '200' }, data: calls.length === 1 ? { token: 'long-business-token' } : { tmpToken: 'ai-short', ssoToken: null } });
  } });
  assert.deepEqual(calls[0].body, { token: 'short-ticket', version: '1.2', pintype: 5 });
  assert.equal(calls[0].opts.headers.token, '');
  assert.deepEqual(calls[1].body, { targetSourceId: '001005', token: 'long-business-token' });
  assert.equal(calls[1].opts.headers.token, 'long-business-token');
  assert.equal(result.tmpToken, 'ai-short');
});

test('HTTP 200 的业务登录失败不能继续换票', async () => {
  let calls = 0;
  await assert.rejects(exchangeCloudPhoneTicket({ ticket: 'bad', fetchImpl: async () => {
    calls += 1; return Response.json({ header: { status: '500001', errMsg: '登录失效' }, data: { token: 'stale' } });
  } }), /登录失效/);
  assert.equal(calls, 1);
});

test('CAPP 拒绝伪造域名且正确编码 token 内的特殊字符', () => {
  assert.throws(() => buildCappUrl('ticket', 'https://capp.139.com.evil.example/#/?i=x'), /CAPP 模板/);
  assert.throws(() => buildCappUrl('ticket', 'https://capp.139.com/#/?token=x'), /缺少应用/);
  const url = new URL(buildCappUrl('a+/=&b'));
  assert.equal(url.search, '');
  assert.equal(new URLSearchParams(url.hash.split('?')[1]).get('token'), 'a+/=&b');
});

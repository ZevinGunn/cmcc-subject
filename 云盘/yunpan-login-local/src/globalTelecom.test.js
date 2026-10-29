import assert from 'node:assert/strict';
import test from 'node:test';

import {
  GLOBAL_TELECOM_BIND_URL,
  buildGlobalTelecomJump,
  exchangeGlobalTelecomAccessToken,
  validateGlobalTelecomUrl
} from './globalTelecom.js';

const validJump =
  'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/new/ssoTokenLogin.action?backUrl=https%3A%2F%2Fqqt.cmicrwx.cn%2Findex.html&token=sso-ticket';

test('global telecom bind URL targets channel 001191', () => {
  const url = new URL(GLOBAL_TELECOM_BIND_URL);
  assert.equal(url.hostname, 'wx.10086.cn');
  assert.equal(url.searchParams.get('netUniChannelId'), '001191');
  assert.match(url.searchParams.get('netUniBackUrl'), /^https:\/\/qqt\.cmicrwx\.cn\//);
});

test('全球通拒绝复用邮箱来源 001003 的票据', async () => {
  await assert.rejects(buildGlobalTelecomJump({ ssoToken: 'mail-ticket', sourceId: '001003' }), /必须使用 001191/);
});

test('全球通活动编号独立配置，回跳完整编码并保留 enableShare', async () => {
  const url = new URL((await buildGlobalTelecomJump({ ssoToken: 'demo', campaign: '66051' })).url);
  assert.equal(url.searchParams.get('backUrl'), 'https://qqt.cmicrwx.cn/2016tyjf/xdractivity?sspId=66051');
  assert.equal(url.searchParams.get('enableShare'), '1');
  await assert.rejects(buildGlobalTelecomJump({ ssoToken: 'demo', campaign: '66050&evil=1' }), /必须为数字/);
});

test('全球通必须新下发 access_token 且登录状态为 1', async () => {
  const calls = [];
  const result = await exchangeGlobalTelecomAccessToken({ url: validJump, fetchImpl: async (url, options) => {
    calls.push({ url, options });
    if (calls.length === 1) return new Response('', { status: 302, headers: { 'Set-Cookie': 'access_token=new-auth; Path=/', Location: 'https://qqt.cmicrwx.cn/2016tyjf/xdractivity?sspId=66050' } });
    if (calls.length === 2) return new Response('landing');
    return Response.json({ status: '1', msg: '已登录' });
  } });
  assert.equal(result.success, true);
  assert.equal(result.accessToken, 'new-auth');
  assert.equal(result.validationState, 'authenticated');
  assert.equal(calls[0].options.headers.Cookie, undefined);
  assert.equal(calls[2].options.headers.Cookie, 'access_token=new-auth');
});

test('登录页 HTTP 200 不能冒充全球通认证成功', async () => {
  const result = await exchangeGlobalTelecomAccessToken({ url: validJump, fetchImpl: async () => new Response('login required') });
  assert.equal(result.success, false);
  assert.equal(result.accessToken, undefined);
});

test('全球通下发 Cookie 后仍检查业务登录状态', async () => {
  let calls = 0;
  const result = await exchangeGlobalTelecomAccessToken({ url: validJump, fetchImpl: async () => ++calls === 1 ?
    new Response('', { headers: { 'Set-Cookie': 'access_token=rejected' } }) : Response.json({ status: '0' }) });
  assert.equal(result.success, false);
  assert.equal(result.accessToken, '');
});

test('不向外部重定向发送全球通 Cookie', async () => {
  let calls = 0;
  const result = await exchangeGlobalTelecomAccessToken({ url: validJump, fetchImpl: async () => {
    calls += 1; return new Response('', { status: 302, headers: { Location: 'https://evil.example/' } });
  } });
  assert.equal(result.success, false);
  assert.equal(calls, 1);
});

test('global telecom jump accepts only the known SSO endpoint with token', () => {
  assert.equal(validateGlobalTelecomUrl(validJump), validJump);
  assert.equal(
    validateGlobalTelecomUrl('https://qqt.cmicrwx.cn.evil.example/2016tyjf/xhmqqthy/new/ssoTokenLogin.action?token=x'),
    ''
  );
  assert.equal(
    validateGlobalTelecomUrl('https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/new/ssoTokenLogin.action'),
    ''
  );
});

test('global telecom jump builds the current direct yunpan SSO entry', async () => {
  const result = await buildGlobalTelecomJump({ ssoToken: 'yunpan-ticket' });
  const url = new URL(result.url);

  assert.equal(result.success, true);
  assert.equal(url.hostname, 'qqt.cmicrwx.cn');
  assert.equal(url.searchParams.get('token'), 'yunpan-ticket');
  assert.equal(url.searchParams.get('targetSourceId'), '001191');
});

test('global telecom jump uses cached 10086 cookie and returns redirect', async () => {
  let request;
  const result = await buildGlobalTelecomJump({
    cookie: 'shareToken=cached-secret',
    fetchImpl: async (url, options) => {
      request = { url, options };
      return new Response('', { status: 302, headers: { Location: validJump } });
    }
  });

  assert.equal(result.success, true);
  assert.equal(result.url, validJump);
  assert.equal(request.url, GLOBAL_TELECOM_BIND_URL);
  assert.equal(request.options.headers.Cookie, 'shareToken=cached-secret');
  assert.equal(request.options.redirect, 'manual');
});

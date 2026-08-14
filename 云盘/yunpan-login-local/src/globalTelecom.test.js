import assert from 'node:assert/strict';
import test from 'node:test';

import {
  GLOBAL_TELECOM_BIND_URL,
  buildGlobalTelecomJump,
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

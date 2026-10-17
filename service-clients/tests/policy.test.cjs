const { test } = require('node:test');
const assert = require('node:assert/strict');
const { isInternal, isExternal, invitationURL, navigationKind, serviceURL } = require('../shared/policy.cjs');
test('内部导航严格限制协议、域名与凭证，拒绝伪装域名和脚本', () => {
  for (const url of ['http://home.1008086.xyz/public', 'https://home.1008086.xyz.evil.test/public', 'https://home.1008086.xyz@evil.test/', 'javascript:alert(1)', 'file:///etc/passwd', 'https://user@home.1008086.xyz/', 'https://home.1008086.xyz:8443/', 'data:text/html,test']) assert.equal(isInternal(url), false, url);
  assert.equal(isInternal('https://home.1008086.xyz/public?link=fixture_only'), true);
  assert.equal(navigationKind('https://dev.coc.10086.cn/example'), 'external');
  assert.equal(isExternal('intent://example'), false);
});
test('专属链接仅保留必要参数，不携带混入的重定向或 token', () => {
  assert.equal(invitationURL('fixture_123'), 'https://home.1008086.xyz/public?link=fixture_123');
  assert.equal(invitationURL('https://home.1008086.xyz/public?token=secret-fixture&link=fixture_123&redirect=https://evil.test'), 'https://home.1008086.xyz/public?link=fixture_123');
  assert.equal(invitationURL('https://home.1008086.xyz/app/cmcc-public/?link=fixture_123'), 'https://home.1008086.xyz/public?link=fixture_123');
  for (const value of ['', 'abc', 'https://evil.test/public?link=fixture_123', 'http://home.1008086.xyz/public?link=fixture_123', 'https://home.1008086.xyz/other?link=fixture_123', 'fixture_123\n<html>']) assert.throws(() => invitationURL(value));
  assert.throws(() => serviceURL('unknown'));
});

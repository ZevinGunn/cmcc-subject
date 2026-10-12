import assert from 'node:assert/strict';
import test from 'node:test';
import { browserLoginResult, validateBrowserSsoUrl } from './ssoBrowser.js';

test('浏览器登录必须匹配官方 HTTP 和业务状态，302 或 Cookie 不足以成功', () => {
  assert.equal(browserLoginResult('global', 200, { status: '1' }), true);
  assert.equal(browserLoginResult('global', 200, { status: 1 }), false);
  assert.equal(browserLoginResult('global', 302, { status: '1' }), false);
  assert.equal(browserLoginResult('cloudphone', 200, { header: { status: '200' }, data: { token: 'demo' } }), true);
  assert.equal(browserLoginResult('cloudphone', 200, { header: { status: '200' }, data: {} }), false);
});

test('浏览器拒绝外部、明文和错误目标云手机链接', () => {
  const good = 'https://cloud.139.com/#/?channelSrc=02207&loginType=0&token=demo&targetSourceId=001216';
  assert.equal(validateBrowserSsoUrl('cloudphone', good), good);
  for (const invalid of [good.replace('https:', 'http:'), good.replace('cloud.139.com', 'evil.example'), good.replace('001216', '001191'), good.replace('cloud.139.com', 'user@cloud.139.com')]) assert.equal(validateBrowserSsoUrl('cloudphone', invalid), '');
});

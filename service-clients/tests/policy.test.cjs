const { test } = require('node:test');
const assert = require('node:assert/strict');
const { config, isInternal, isExternal, invitationURL, navigationKind, serviceURL } = require('../shared/policy.cjs');
test('内部导航严格限制协议、域名与凭证，拒绝伪装域名和脚本', () => {
  for (const url of ['http://home.1008086.xyz/public', 'https://home.1008086.xyz.evil.test/public', 'https://home.1008086.xyz@evil.test/', 'javascript:alert(1)', 'file:///etc/passwd', 'https://user@home.1008086.xyz/', 'https://home.1008086.xyz:8443/', 'data:text/html,test']) assert.equal(isInternal(url), false, url);
  assert.equal(isInternal('https://home.1008086.xyz/public?link=fixture_only'), true);
  assert.equal(navigationKind('https://dev.coc.10086.cn/example'), 'external');
  assert.equal(isExternal('intent://example'), false);
});
test('工具目录覆盖部署清单中的全部公网项目，别名可用且关闭的入口不扩大权限', () => {
  const inventory = require('../../project-manager/services.json');
  const ids = new Set();
  for (const service of config.services) {
    assert.ok(!ids.has(service.id)); ids.add(service.id);
    const source = inventory.services.find(item => item.id === service.sourceService);
    assert.equal(source?.exposure, 'public', service.id);
    const url = new URL(service.url);
    assert.equal(url.protocol, 'https:'); assert.ok(source.domains.includes(url.hostname));
    assert.ok(config.groups.includes(service.group)); assert.equal(serviceURL(service.id), service.url);
    assert.equal(navigationKind(service.url), 'internal');
    assert.equal(isInternal(`https://${url.hostname}.evil.test/`), false);
    assert.equal(isInternal(`http://${url.hostname}/`), false);
    assert.equal(isInternal(`https://${url.hostname}:8443/`), false);
  }
  for (const source of inventory.services.filter(item => item.exposure === 'public')) {
    assert.ok(config.services.some(item => item.sourceService === source.id), `遗漏公网项目：${source.id}`);
    for (const host of source.domains) assert.equal(isInternal(`https://${host}/`), true, host);
  }
  for (const url of ['https://wangka.1008086.xyz/', 'https://yunpan.1008086.xyz/', 'https://unknown.1008086.xyz/']) assert.equal(isInternal(url), false);
  assert.throws(() => invitationURL('https://tools.1008086.xyz/public?link=fixture_123'));
});
test('专属链接仅保留必要参数，不携带混入的重定向或 token', () => {
  assert.equal(invitationURL('fixture_123'), 'https://home.1008086.xyz/public?link=fixture_123');
  assert.equal(invitationURL('https://home.1008086.xyz/public?token=secret-fixture&link=fixture_123&redirect=https://evil.test'), 'https://home.1008086.xyz/public?link=fixture_123');
  assert.equal(invitationURL('https://home.1008086.xyz/app/cmcc-public/?link=fixture_123'), 'https://home.1008086.xyz/public?link=fixture_123');
  for (const value of ['', 'abc', 'https://evil.test/public?link=fixture_123', 'http://home.1008086.xyz/public?link=fixture_123', 'https://home.1008086.xyz/other?link=fixture_123', 'fixture_123\n<html>']) assert.throws(() => invitationURL(value));
  assert.throws(() => serviceURL('unknown'));
});

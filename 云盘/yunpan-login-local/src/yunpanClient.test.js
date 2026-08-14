import assert from 'node:assert/strict';
import test from 'node:test';

import { DEFAULT_FLOW_SHOP_SOURCE_ID, DEFAULT_FLOW_SHOP_URL, __test__ } from './yunpanClient.js';

test('10086 jump uses the current authorized source id', () => {
  assert.equal(DEFAULT_FLOW_SHOP_SOURCE_ID, '001003');
  assert.match(DEFAULT_FLOW_SHOP_URL, /targetSourceId=001003$/);
});

test('SMS login matches the current web payload contract', () => {
  assert.deepEqual(__test__.buildSmsLoginPayload('13800000000', '123456', '+86'), {
    account: '13800000000',
    dycPwd: '123456',
    loginStyle: 'passSMS',
    ifOpenAccount: '1',
    verType: 2,
    clientEnv: '3',
    setCookie: 0
  });
});

test('SMS login request includes the web client id', () => {
  const request = __test__.buildSmsLoginRequest(
    __test__.buildSmsLoginPayload('13800000000', '123456', '+86'),
    '1234567890abcdef'
  );
  assert.equal(request.clientId, '10701');
  assert.equal(request.autoLogin, true);
  assert.equal(request.returnToken, true);
  assert.ok(request.encryptMsg);
});

test('querySpecToken V1 uses account', () => {
  assert.deepEqual(__test__.buildQuerySpecTokenV1Payload('13800000000', '001003'), {
    account: '13800000000',
    toSourceId: '001003'
  });
});

test('querySpecToken V2 matches the current web payload contract', () => {
  assert.deepEqual(__test__.buildQuerySpecTokenV2Payload('13800000000', '001003'), {
    phoneNumber: '13800000000',
    toSourceId: '001003'
  });
});

test('toSourceId is required', () => {
  assert.throws(() => __test__.requireSourceId(''), /toSourceId 不能为空/);
});

test('user domain route only accepts trusted HTTPS hosts', () => {
  assert.equal(
    __test__.resolveUserDomainUrl([
      { modName: 'user', httpsUrl: 'https://user-gz.yun.139.com/user/' }
    ]),
    'https://user-gz.yun.139.com/user'
  );
  assert.equal(
    __test__.resolveUserDomainUrl([
      { modName: 'user', httpsUrl: 'https://example.com/collect' }
    ]),
    'https://user-njs.yun.139.com/user'
  );
});

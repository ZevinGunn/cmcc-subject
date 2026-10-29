import assert from 'node:assert/strict';
import test from 'node:test';

import { DEFAULT_FLOW_SHOP_SOURCE_ID, DEFAULT_FLOW_SHOP_URL, __test__ } from './yunpanClient.js';
import { aesCbcEncryptWithIvPrefix, aesCbcDecryptWithIvPrefix, SMS_AES_KEY } from './cryptoBox.js';

test('10086 jump uses the current authorized source id', () => {
  assert.equal(DEFAULT_FLOW_SHOP_SOURCE_ID, '001003');
  assert.match(DEFAULT_FLOW_SHOP_URL, /targetSourceId=001003$/);
});

test('App V2 仅传 toSourceId，与旧 Web V2 分开', () => {
  assert.deepEqual(__test__.buildQuerySpecTokenV2Payload('13800000000', '001216', 'app'), { toSourceId: '001216' });
});

test('新版短信滑块使用 phoneNumber 和大小写准确的 puzzleVerfycode', () => {
  const payload = __test__.buildSmsPayload('13800000000', '+86', 'fresh-proof', 2);
  assert.equal(payload.phoneNumber, '13800000000');
  assert.equal(payload.clientType, '412');
  assert.equal(payload.captchaType, 2);
  assert.equal(payload.puzzleVerfycode, 'fresh-proof');
  assert.equal(payload.account, undefined);
  assert.equal(payload.puzzleVerfyCode, undefined);
  const encrypted = aesCbcEncryptWithIvPrefix(payload, SMS_AES_KEY);
  assert.deepEqual(JSON.parse(aesCbcDecryptWithIvPrefix(encrypted, SMS_AES_KEY)), payload);
  assert.throws(() => aesCbcDecryptWithIvPrefix(encrypted));
});

test('短信专用请求不携带旧网关协议头或旧账号凭据', () => {
  const headers = __test__.buildSmsHeaders('+86');
  assert.equal(headers['hcy-cool-flag'], '1');
  for (const key of Object.keys(headers)) assert.doesNotMatch(key, /^mcloud-|^CMS-|authorization|cookie|skey/i);
});

test('短信响应同时识别新协议结果和旧网关解密错误，拒绝不透明原文', () => {
  const good = { success: true, code: '0000' };
  const bad = { success: false, code: '01000019', message: '动态解密错误' };
  assert.deepEqual(__test__.decodeSmsResponse(JSON.stringify(aesCbcEncryptWithIvPrefix(good, SMS_AES_KEY))).response, good);
  assert.deepEqual(__test__.decodeSmsResponse(aesCbcEncryptWithIvPrefix(bad)).response, bad);
  assert.equal(__test__.decodeSmsResponse('opaque-secret').response.code, 'SMS_RESPONSE_INVALID');
});

test('原生明文 SSO 保留捕获上下文但拒绝旧加密头和头注入', () => {
  const replay = { 'User-Agent': 'captured-browser', 'x-DeviceInfo': 'captured-device', Cookie: 'demo=synthetic' };
  const headers = __test__.buildAppSsoHeaders({ authorization: 'Basic synthetic', ssoReplayHeaders: replay });
  assert.equal(headers['user-agent'], 'captured-browser');
  assert.equal(headers['x-deviceinfo'], 'captured-device');
  assert.equal(headers.cookie, 'demo=synthetic');
  assert.equal(headers.Authorization, 'Basic synthetic');
  for (const key of Object.keys(headers)) assert.doesNotMatch(key, /^mcloud-|hcy-cool-flag/i);
  assert.throws(() => __test__.validateSsoHeaders({ 'hcy-cool-flag': '1' }), /不支持/);
  assert.throws(() => __test__.validateSsoHeaders({ cookie: 'a\r\nInjected: true' }), /不合法/);
  assert.throws(() => __test__.validateSsoHeaders({ origin: 'https://evil.example' }), /云盘 HTTPS/);
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

import assert from 'node:assert/strict';
import test from 'node:test';

import { sanitizeLogData, sanitizeUrl } from './diagnosticLogger.js';

test('diagnostic log redacts credentials and phone numbers', () => {
  assert.deepEqual(
    sanitizeLogData({
      account: '13800000000',
      token: 'secret-token',
      code: '0000',
      message: 'account 13800000000 failed'
    }),
    {
      account: '[REDACTED]',
      token: '[REDACTED]',
      code: '0000',
      message: 'account [REDACTED_PHONE] failed'
    }
  );
});

test('diagnostic log keeps routing fields and redacts URL secrets', () => {
  const sanitized = sanitizeUrl(
    'https://wx.10086.cn/website/businessPlatform/flowShop?targetSourceId=001003&netToken=secret'
  );
  const url = new URL(sanitized);
  assert.equal(url.searchParams.get('targetSourceId'), '001003');
  assert.equal(url.searchParams.get('netToken'), '[REDACTED]');
});

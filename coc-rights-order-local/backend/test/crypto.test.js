import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  buildSmsPayload,
  buildOrderProof,
  encryptOrderPhone,
  encryptOrderSmsCode,
  reverseBase64
} from '../src/crypto.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../../..');
const harPath = path.join(root, '订购权益业务.har');

function getDirectOrderBody() {
  const har = JSON.parse(fs.readFileSync(harPath, 'utf8'));
  const entry = har.log.entries.find((item) =>
    item.request.url.includes('/coc3-market-order/api/external/order/directOrder')
  );
  return JSON.parse(entry.request.postData.text);
}

test('reverseBase64 matches the reversible order proof format', () => {
  const value = '13800138000';
  const reversed = reverseBase64(value);
  assert.equal(Buffer.from(reversed.split('').reverse().join(''), 'base64').toString('utf8'), value);
});

test('order proof reproduces m2/s2 from HAR sample', () => {
  const body = getDirectOrderBody();
  const phone = Buffer.from(body.m1.split('').reverse().join(''), 'base64').toString('utf8');
  const smsCode = Buffer.from(body.s1.split('').reverse().join(''), 'base64').toString('utf8');
  const proof = buildOrderProof(phone, smsCode);
  assert.equal(proof.m1, body.m1);
  assert.equal(proof.m2, body.m2);
  assert.equal(proof.s1, body.s1);
  assert.equal(proof.s2, body.s2);
  assert.equal(encryptOrderPhone(phone), body.phone);
  assert.equal(encryptOrderSmsCode(smsCode), body.smsCode);
});

test('sms payload phone encryption matches HAR sample', () => {
  const har = JSON.parse(fs.readFileSync(harPath, 'utf8'));
  const smsEntry = har.log.entries.find((item) =>
    item.request.url.includes('/coc3-market/api/sms/qwSendSmsCode')
  );
  const smsBody = JSON.parse(smsEntry.request.postData.text);
  const directBody = getDirectOrderBody();
  const phone = Buffer.from(directBody.m1.split('').reverse().join(''), 'base64').toString('utf8');
  const payload = buildSmsPayload({ phone, skuId: '77626' });
  assert.equal(payload.receivers, smsBody.receivers);
});

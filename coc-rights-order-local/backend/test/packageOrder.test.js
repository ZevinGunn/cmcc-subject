import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { makePackageBookProductRequest } from '../src/packageOrderBuilder.js';
import { makePackageSmsRequest } from '../src/packageOrderBuilder.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../../..');
const harPath = path.join(root, '星巴克权益订购.har');

test('package bookProduct payload reproduces HAR digest and mobile proof', () => {
  const har = JSON.parse(fs.readFileSync(harPath, 'utf8'));
  const body = JSON.parse(
    har.log.entries.find((item) => item.request.url.includes('/pkg/order/bookProduct')).request
      .postData.text
  );
  const phone = Buffer.from(body.mobile.split('').reverse().join(''), 'base64').toString('utf8');
  const payload = makePackageBookProductRequest({
    phone,
    smsCode: body.smsCode,
    pageId: body.pageId,
    productCode: body.productCode,
    touchCode: body.touchCode,
    protocolSequenceId: body.protocolSequenceId,
    referer: 'xbklhhy',
    userId: ''
  });
  assert.equal(payload.digest, body.digest);
  assert.equal(payload.mobile, body.mobile);
  assert.deepEqual(payload.encrypt, body.encrypt);
  assert.equal(payload.sourceUrl, body.sourceUrl);
  assert.equal(payload.ext, body.ext);
});

test('package sms request builds encrypted coc headers', () => {
  const request = makePackageSmsRequest({
    phone: '13800138000',
    pageId: '1878635095121567744',
    productCode: '100000098326',
    touchCode: 'P00000132000',
    smsCodeTypeEnum: '505'
  });
  assert.equal(typeof request.body.cocEnContent, 'string');
  assert.ok(request.body.cocEnContent.length > 20);
  assert.equal(request.headers['coc-en-version'], '1486234121417629696');
  assert.equal(request.headers['coc-aurora-v'], '2');
  assert.ok(request.headers['coc-aurora'].length > 100);
});

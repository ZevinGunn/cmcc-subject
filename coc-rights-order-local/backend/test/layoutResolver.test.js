import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { extractLayoutInfo } from '../src/layoutResolver.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../../..');

function readHarLayout(fileName) {
  const har = JSON.parse(fs.readFileSync(path.join(root, fileName), 'utf8'));
  const content = har.log.entries[0].response.content;
  let text = content.text || '';
  if (content.encoding === 'base64') text = Buffer.from(text, 'base64').toString('utf8');
  return JSON.parse(text);
}

test('rightsmarket goods order layout resolves skuid', () => {
  const layout = JSON.parse(fs.readFileSync(path.join(root, '随心选生活折扣包.json'), 'utf8'));
  const info = extractLayoutInfo('sxxshzgb', layout);
  assert.equal(info.name, '随心选生活折扣包');
  assert.equal(info.skuId, '34622');
  assert.equal(info.component.name, 'Rights-PictureGoodsOrderComp');
  assert.equal(info.component.rawSkuField, 'skuid');
});

test('package layout exposes touchCode but lacks directOrder skuId', () => {
  const layout = readHarLayout('星巴克联合会员权益查询.har');
  const info = extractLayoutInfo('xbklhhy', layout);
  assert.equal(info.name, '星巴克联合会员');
  assert.equal(info.touchCode, 'P00000104637');
  assert.equal(info.layoutFamily, 'package-h5-canvas');
  assert.equal(info.skuId, '');
});

import assert from 'node:assert/strict'
import test from 'node:test'
import {
  decryptShopWireInput,
  extractShopWireValue,
  SHOP_BUSINESS_KEY,
  shopWireDecrypt,
  shopWireEncrypt,
} from '../src/services/cryptoService.js'
import { normalizeShopBusiness } from '../src/services/shopBusinessClient.js'

const ANONYMIZED_PHONE_PATH = 'c244Qmdac3M1c1Q3LzEyRFBtZ1dYUT09'
const ANONYMIZED_UNSUBSCRIBE_INPUT =
  'b3JlSlcvSG1WTFMrYXdrYS8wUWpITGs0TlY4M29JNk8wczVDYkJxVlo3clRTZlR6Q3pyaUUrcHVyK3JVZ3oxaU9vSjN4VGhmUkVwejhuV3hOREJkVllQbDlUTUQ5TVVXQ0lGU3hBcUo4Ym9ndjlqOFo4MzlIRWZYc3h6endBQnBYdlk2U1lTZitYQkNkbHJrYnZjdWYxMUdrRGljckVzZ1FPRmVxbDg2d0NBPQ=='

test('shop protocol key and anonymized phone path match the source implementation', () => {
  assert.equal(SHOP_BUSINESS_KEY, '043AOQGK6ykklyZA')
  assert.equal(shopWireDecrypt(ANONYMIZED_PHONE_PATH), '13800138000')
})

test('anonymized unsubscribe inParam decrypts to the expected business fields', () => {
  assert.deepEqual(JSON.parse(shopWireDecrypt(ANONYMIZED_UNSUBSCRIBE_INPUT)), {
    orderInfos: [
      {
        busiType: '01',
        bizCode: 'null',
        busiCode: '100000000001',
        spid: 'null',
        oprCode: '01',
        smsCode: '123456',
      },
    ],
  })
})

test('shop wire helper round-trips UTF-8 JSON and extracts common HAR containers', () => {
  const plain = JSON.stringify({ msgType: '02', name: '测试业务' })
  const encrypted = shopWireEncrypt(plain)
  assert.equal(shopWireDecrypt(encrypted), plain)
  assert.equal(extractShopWireValue(JSON.stringify({ data: { outParam: encrypted } })), encrypted)
  assert.deepEqual(decryptShopWireInput(JSON.stringify({ inParam: encrypted })), JSON.parse(plain))
})

test('shop business normalization allows every queried item to attempt unsubscribe', () => {
  const item = normalizeShopBusiness(
    { busiName: '测试业务', busiCode: '1001', busiType: '02', isOrdered: '02', isUnOrder: '02' },
    '02',
    3,
  )
  assert.equal(item.categoryLabel, '增值业务')
  assert.equal(item.canUnsubscribe, true)
  assert.equal(item.isUnOrder, '02')
})

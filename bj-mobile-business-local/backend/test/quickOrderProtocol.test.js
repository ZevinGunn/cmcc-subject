import test from 'node:test'
import assert from 'node:assert/strict'
import { gridInternals } from '../src/services/quickOrders/adapters/grid.js'
import { retailAuthDecrypt, retailAuthEncrypt, retailWireDecrypt, retailWireEncrypt } from '../src/services/quickOrders/adapters/retailCrypto.js'
import { sanitizeExternalUrl } from '../src/utils/http.js'
import { cloudComputerInternals } from '../src/services/quickOrders/adapters/cloudComputer.js'
import { xywInternals } from '../src/services/quickOrders/adapters/xyw.js'
import { sanitize } from '../src/utils/logger.js'

test('retail authentication encryption is uppercase hex and round trips JSON', () => {
  const encrypted = retailAuthEncrypt({ backUrl: '/website/test' })
  assert.match(encrypted, /^[0-9A-F]+$/)
  assert.deepEqual(JSON.parse(retailAuthDecrypt(encrypted)), { backUrl: '/website/test' })
})

test('retail wire encryption is Base64URL compatible and round trips JSON', () => {
  const encrypted = retailWireEncrypt({ normId: 2285851, name: '欢畅流量' })
  assert.doesNotMatch(encrypted, /[+/]/)
  assert.deepEqual(JSON.parse(retailWireDecrypt(encrypted)), { normId: 2285851, name: '欢畅流量' })
})

test('grid entry accepts only the fixed HTTPS host, path and required channel context', () => {
  const valid = 'https://ysmapp.bj.10086.cn/app/channel-web/busiCore/showCustomIndex.action?submitWarePackageId=A1000770&channel=app_share&code=C1&empCode=E1&nbc=N1'
  assert.equal(gridInternals.validateEntry(valid).origin, 'https://ysmapp.bj.10086.cn')
  assert.throws(() => gridInternals.validateEntry(valid.replace('ysmapp.bj.10086.cn', 'example.com')), /不在允许范围/)
  assert.throws(() => gridInternals.validateEntry(valid.replace('&nbc=N1', '')), /缺少 nbc/)
})

test('external URL logging removes sensitive query values', () => {
  const value = sanitizeExternalUrl('https://example.com/a?code=SECRET&phone=13800138000&safe=ok')
  assert.doesNotMatch(value, /SECRET|13800138000/)
  assert.match(value, /safe=ok/)
})

test('cloud computer constants match the HAR and source-derived campaign contract', () => {
  assert.equal(cloudComputerInternals.ORIGIN, 'https://mop.bmcc.com.cn')
  assert.equal(cloudComputerInternals.CHANNEL_CODE, '173')
  assert.equal(cloudComputerInternals.MKT_CODE, '98fd4c5440394f42b012112e8ccb7076')
  assert.equal(cloudComputerInternals.PAGE_CODE, '94d4682c390e4a8b876d22a2d46505b9')
  assert.deepEqual(cloudComputerInternals.PRODUCT_CONFIG.map((item) => item.id), [
    '78870ece2bdf42bc8a278e9e9bc595ea',
    '78289f7840634282b781f28576bbace5',
  ])
})

test('xyw constants and RSA login payload match the captured campaign contract', () => {
  assert.equal(xywInternals.ORIGIN, 'https://xyw.bj.10086.cn')
  assert.equal(xywInternals.CHANNEL_CODE, '173')
  assert.equal(xywInternals.MKT_CODE, '17a230e954bd28443c5dcdbaacaa8158')
  assert.equal(xywInternals.PAGE_CODE, '40037504236102b839b417e30cd9891e')
  assert.equal(xywInternals.PRODUCT_CODE, 'f98e0730ee990b2b32553e8c571286f9')
  const encrypted = xywInternals.encryptLoginPayload({ phone: '13800138000' })
  assert.match(encrypted, /^[A-Za-z0-9+/]+={0,2}$/)
  assert.doesNotMatch(encrypted, /13800138000/)
})

test('logging sanitizer removes xyw login ciphertext and both verification-code field names', () => {
  const value = sanitize({ encipherParam: 'ciphertext', verifyCode: '123456', smsCode: '654321' })
  assert.doesNotMatch(JSON.stringify(value), /ciphertext|123456|654321/)
})

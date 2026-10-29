import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildCompositePayload,
  customOrderInternals,
  normalizeCustomOrderConfig,
  previewCustomOrder,
} from '../src/services/customOrderService.js'
import { serializePortalQuery } from '../src/services/portalClient.js'

test('normalizes the minimum custom product order configuration', () => {
  const result = normalizeCustomOrderConfig({
    activityName: '承诺低消权益回馈版',
    proType: 'CNDXZYHK',
    packageId: '55412',
    packageCode: 'CNDXZYHK',
    productShowCode: 'PRODUCT_01',
  })
  assert.equal(result.ok, true)
  assert.equal(result.data.pitemShowCode, 'KT')
  assert.equal(result.data.operType, 'commitProductNew')
})

test('builds the observed compositeCommit payload and scalar extensions', () => {
  const payload = buildCompositePayload({
    packageId: '55412',
    packageCode: 'HCLLFF26',
    productShowCode: 'PRODUCT_02',
    pitemShowCode: 'KT',
    mtOtherParams: '1-128',
    extraContent: { channelFlag: true },
  })
  assert.deepEqual(payload, {
    common: { operType: 'commitProductNew' },
    body: {
      content: {
        packageId: '55412',
        packageCode: 'HCLLFF26',
        productShowCode: 'PRODUCT_02',
        pitemShowCode: 'KT',
        mtOtherParams: '1-128',
        channelFlag: true,
      },
    },
  })
})

test('rejects protected, nested, and malformed custom fields', () => {
  assert.equal(previewCustomOrder({ packageId: '55412', packageCode: 'A', productShowCode: 'P', extraContent: { packageId: 'x' } }).ok, false)
  assert.equal(previewCustomOrder({ packageId: '55412', packageCode: 'A', productShowCode: 'P', extraContent: { nested: {} } }).ok, false)
  assert.equal(previewCustomOrder({ packageId: 'bad value', packageCode: 'A', productShowCode: 'P' }).ok, false)
})

test('unwraps portal data and detects SMS confirmation responses', () => {
  assert.deepEqual(customOrderInternals.unwrapData({ data: { data: { resultCode: '00' } } }), { resultCode: '00' })
  assert.equal(customOrderInternals.isSmsRequired({ raw: { code: 'need_sms_check' }, data: {} }), true)
  assert.equal(customOrderInternals.isSmsRequired({ raw: { code: 'bizSuccess' }, data: {} }), false)
})

test('normalizes six-digit order codes and eight-digit verification passwords', () => {
  assert.equal(customOrderInternals.normalizeSmsVerificationCode('123456', 'OTHER'), '123456')
  assert.equal(customOrderInternals.normalizeSmsVerificationCode('12345678', 'JFBXHY'), '123458')
  assert.equal(customOrderInternals.normalizeSmsVerificationCode('12345678', 'OTHER'), '')
  assert.equal(customOrderInternals.normalizeSmsVerificationCode('1234567', 'JFBXHY'), '')
  assert.equal(customOrderInternals.normalizeSmsVerificationCode('12345A78', 'JFBXHY'), '')
})

test('builds SMS input audit metadata without retaining verification code values', () => {
  assert.deepEqual(customOrderInternals.buildSmsVerificationAudit('12345678', 'JFBXHY'), {
    inputLength: 8,
    normalizedLength: 6,
    transformRule: 'first5_last1',
  })
  assert.deepEqual(customOrderInternals.buildSmsVerificationAudit('123456', 'OTHER'), {
    inputLength: 6,
    normalizedLength: 6,
    transformRule: 'direct_6',
  })
  assert.deepEqual(customOrderInternals.buildSmsVerificationAudit('12345678', 'OTHER'), {
    inputLength: 8,
    normalizedLength: 0,
    transformRule: 'rejected',
  })
  assert.equal('smsCode' in customOrderInternals.buildSmsVerificationAudit('123456', 'OTHER'), false)
})

test('builds SMS response context audit metadata without retaining the product key', () => {
  const audit = customOrderInternals.buildSmsContextAudit(
    {
      packageId: '2840305334',
      packageCode: 'JFBXHY',
      productShowCode: 'G_JFBXHY',
      pitemShowCode: 'KT',
      mtOtherParams: '1-128',
    },
    {
      smsType: 'need_sms_check_v2',
      smsTypeSource: 'compositeCommit_response',
      typeKey: 'sensitive-product-key',
      productItemDesc: 'desc',
      busiTime: '2026-08-08',
    },
    { raw: { code: 'need_sms_check' } },
    { executionId: 'execution-1', orderId: 'order-1' },
  )
  assert.equal(audit.smsSendPath, '/portal-bff/api/mtsms/v1.0/sendDXSMSV2')
  assert.equal(audit.smsQueryMode, 'clear')
  assert.equal(audit.smsContextHandleLength, 21)
  assert.equal(audit.knownInputRule, 'first5_last1_from_8_or_direct_6')
  assert.equal('typeKey' in audit, false)
  assert.equal('productItemDesc' in audit, false)
})

test('preserves nested activity business data while removing credentials and identity data', () => {
  assert.deepEqual(customOrderInternals.sanitizeActivityValue({
    activityId: '2840305334',
    productName: '积分倍享合约',
    groups: [{ id: 'group-1', name: '合约', accessToken: 'secret', mobile: '13800138000' }],
    cookie: 'secret-cookie',
  }), {
    activityId: '2840305334',
    productName: '积分倍享合约',
    groups: [{ id: 'group-1', name: '合约' }],
  })
})

test('serializes encrypted GET plaintext without converting spaces to plus', () => {
  assert.equal(serializePortalQuery({ productKey: 'a b', mtOtherParams: '1-128', blank: '' }), 'productKey=a%20b&mtOtherParams=1-128')
})

test('exposes a route for discarding stale SMS order context before editing parameters', async () => {
  const source = await import('node:fs/promises').then((fs) => fs.readFile(
    new URL('../src/routes/customOrders.js', import.meta.url),
    'utf8',
  ))
  assert.match(source, /router\.delete\('\/:orderId'/)
  assert.match(source, /discardCustomOrder/)
})

test('exposes a session-protected fly-card usage query before ordering', async () => {
  const source = await import('node:fs/promises').then((fs) => fs.readFile(
    new URL('../src/routes/customOrders.js', import.meta.url),
    'utf8',
  ))
  assert.match(source, /router\.post\('\/fly-card-usage'/)
  assert.match(source, /loadFlyCardUsage\(session\)/)
})

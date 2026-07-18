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

test('serializes encrypted GET plaintext without converting spaces to plus', () => {
  assert.equal(serializePortalQuery({ productKey: 'a b', mtOtherParams: '1-128', blank: '' }), 'productKey=a%20b&mtOtherParams=1-128')
})

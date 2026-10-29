import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildUnsubscribePayload,
  normalizePackageData,
  normalizeUnsubscribeResult,
} from '../src/services/portalClient.js'

const session = {
  userInfo: {
    mobile: '13800138000',
    brand: '全球通',
  },
}

test('value-added ywCode is sent as field1 without unsupported fields', () => {
  const payload = buildUnsubscribePayload(session, {
    category: 'valueAdded',
    originalIndex: 40,
    field1: '41',
    xh: '41',
    ywCode: '111004037173',
    raw: { ywCode: '111004037173', xh: '41' },
  })

  assert.deepEqual(payload, {
    phoneNum: '13800138000',
    brand: '全球通',
    field1: '111004037173',
  })
  assert.equal('ywCode' in payload, false)
})

test('package offerId is sent as field1 instead of its list index', () => {
  assert.deepEqual(
    buildUnsubscribePayload(session, {
      category: 'package',
      originalIndex: 3,
      field1: '3',
      offerId: '111603018812',
      raw: { offerId: '111603018812' },
    }),
    {
      phoneNum: '13800138000',
      brand: '全球通',
      field1: '111603018812',
    },
  )
})

test('normalization separates display indexes from unsubscribe codes', () => {
  const normalized = normalizePackageData({
    mwywList: [{ ywName: '测试业务', ywCode: '100000000001', xh: '9' }],
    tcShowList: [{ offerName: '测试套餐', offerId: '200000000001' }],
  })

  assert.equal(normalized.categories.valueAdded[0].originalIndex, 0)
  assert.equal(normalized.categories.valueAdded[0].xh, '9')
  assert.equal(normalized.categories.valueAdded[0].unsubscribeCode, '100000000001')
  assert.equal(normalized.categories.valueAdded[0].field1, '100000000001')
  assert.equal(normalized.categories.package[0].field1, '200000000001')
})

test('oldPage value-added protocol retains its one-based position mapping', () => {
  const normalized = normalizePackageData(
    { mwywList: [{ ywCode: '1001' }, { ywCode: '1002', xh: '88' }] },
    'oldPage',
  )

  assert.equal(normalized.categories.valueAdded[1].unsubscribeCode, '2')
  assert.equal(normalized.categories.valueAdded[1].field1, '2')
})

test('manual unsubscribe code is supported when query data has no code', () => {
  assert.equal(buildUnsubscribePayload(session, { unsubscribeCode: '300000000001', field1: '0' }).field1, '300000000001')
  assert.equal(buildUnsubscribePayload(session, { originalIndex: 0, xh: '1' }).field1, '')
})

test('dialog parameter overrides become the exact three-field portal payload', () => {
  assert.deepEqual(
    buildUnsubscribePayload(session, {
      phoneNum: '13900139000',
      brand: '动感地带',
      unsubscribeCode: '900000000001',
      raw: { ywCode: '100000000001' },
    }),
    {
      phoneNum: '13900139000',
      brand: '动感地带',
      field1: '900000000001',
    },
  )
})

test('portal unsubscribe success and rejection messages are preserved', () => {
  assert.deepEqual(normalizeUnsubscribeResult({ resType: 'success' }), {
    success: true,
    message: 'success',
    raw: { resType: 'success' },
  })
  assert.deepEqual(normalizeUnsubscribeResult({ resType: '该活动不允许线上退订' }), {
    success: false,
    message: '该活动不允许线上退订',
    raw: { resType: '该活动不允许线上退订' },
  })
})

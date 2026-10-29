import test from 'node:test'
import assert from 'node:assert/strict'
import { createCloudComputerAdapter, cloudComputerInternals } from '../src/services/quickOrders/adapters/cloudComputer.js'
import { QuickOrderService } from '../src/services/quickOrders/service.js'
import { CLOUD_HAR_FIXTURE, SOURCE_DERIVED_SUCCESS } from '../testFixtures/cloudComputerHar.js'

function jsonResponse(data, status = 200) {
  return { status, data: JSON.stringify(data), headers: {} }
}

function mockCloud({ finalResponse = SOURCE_DERIVED_SUCCESS, failPath = '' } = {}) {
  const calls = []
  const request = async (config) => {
    const path = new URL(config.url).pathname
    const body = JSON.parse(config.data)
    calls.push({ path, body, maxAttempts: config.maxAttempts, allowLegacyRenegotiation: config.allowLegacyRenegotiation, headers: config.headers })
    if (path === failPath) throw Object.assign(new Error('socket hang up'), { code: 'ECONNRESET' })
    if (path.endsWith('/login/decryptPhoneByTokenJt')) return jsonResponse(CLOUD_HAR_FIXTURE.login)
    if (path.endsWith('/marketInfo/getMarketStatus')) return jsonResponse(CLOUD_HAR_FIXTURE.marketStatus)
    if (path.endsWith('/productInfo/getProductInfo')) return jsonResponse(CLOUD_HAR_FIXTURE.products[body.productCode])
    if (path.endsWith('/orderConfirm/getMarketProInfo')) return jsonResponse(CLOUD_HAR_FIXTURE.orderInfo)
    if (path.endsWith('/orderConfirm/sendOrderConfirmVerifyCode')) return jsonResponse(CLOUD_HAR_FIXTURE.smsSent)
    if (path.endsWith('/orderConfirm/marketOrder')) return jsonResponse(finalResponse)
    throw new Error(`Unexpected mock request ${path}`)
  }
  const adapter = createCloudComputerAdapter({ request })
  const service = new QuickOrderService({ adapters: { cloud: adapter }, logger: async () => {} })
  return { adapter, service, calls }
}

async function ready(service) {
  const created = await service.create({ platform: 'cloud', auth: { appToken: 'mock-app-token-from-current-login' } })
  const prepared = await service.prepare(created.id)
  const selected = await service.select(created.id, '78289f7840634282b781f28576bbace5')
  return { id: created.id, created, prepared, selected }
}

test('cloud adapter follows the HAR-derived authentication, product, protocol and SMS sequence', async () => {
  const { service, calls } = mockCloud()
  const { id, created, prepared, selected } = await ready(service)
  assert.equal(created.businessId, 'cloud-computer')
  assert.equal(created.maskedPhone, '138****8000')
  assert.equal(prepared.product.options.length, 2)
  assert.match(selected.product.protocol.content, /29\.9元\/月/)

  const sms = await service.sendSms(id, { agreed: true, realOrderConfirmed: true, confirmationId: 'cloud_confirm_123456' })
  assert.equal(sms.stage, 'SMS_SENT')
  const smsCall = calls.find((item) => item.path.endsWith('/sendOrderConfirmVerifyCode'))
  assert.equal(smsCall.maxAttempts, 1)
  assert.deepEqual(smsCall.body, {
    productCode: '78289f7840634282b781f28576bbace5',
    mktCode: cloudComputerInternals.MKT_CODE,
    pageCode: cloudComputerInternals.PAGE_CODE,
  })
  assert.ok(calls.every((item) => item.allowLegacyRenegotiation === true))
})

test('cloud final submit uses the exact captured fields and one attempt', async () => {
  const { service, calls } = mockCloud()
  const { id } = await ready(service)
  const confirmation = { agreed: true, realOrderConfirmed: true, confirmationId: 'cloud_confirm_123456' }
  await service.sendSms(id, confirmation)
  const result = await service.confirm(id, { ...confirmation, smsCode: '123456' })
  assert.equal(result.session.stage, 'FINISHED')
  const finalCall = calls.find((item) => item.path.endsWith('/orderConfirm/marketOrder'))
  assert.equal(finalCall.maxAttempts, 1)
  assert.deepEqual(finalCall.body, {
    mktCode: cloudComputerInternals.MKT_CODE,
    productCode: '78289f7840634282b781f28576bbace5',
    verifyCode: '123456',
    pageCode: cloudComputerInternals.PAGE_CODE,
    channelCode: cloudComputerInternals.CHANNEL_CODE,
  })
})

test('HAR code 99904 is recoverable and keeps the SMS stage', async () => {
  const { service } = mockCloud({ finalResponse: CLOUD_HAR_FIXTURE.invalidSmsOrder })
  const { id } = await ready(service)
  const confirmation = { agreed: true, realOrderConfirmed: true, confirmationId: 'cloud_confirm_123456' }
  await service.sendSms(id, confirmation)
  await assert.rejects(() => service.confirm(id, { ...confirmation, smsCode: '000000' }), /验证码错误/)
  assert.equal(service.read(id).stage, 'SMS_SENT')
})

test('missing final result semantics and network loss both become UNKNOWN without retry', async () => {
  const incomplete = { success: true, data: { code: '200', msg: '操作成功', obj: {} } }
  for (const setup of [
    { finalResponse: incomplete },
    { failPath: '/mkt_web/s/orderConfirm/marketOrder' },
  ]) {
    const { service, calls } = mockCloud(setup)
    const { id } = await ready(service)
    const confirmation = { agreed: true, realOrderConfirmed: true, confirmationId: `cloud_${Math.random().toString(36).slice(2)}_confirm` }
    await service.sendSms(id, confirmation)
    const result = await service.confirm(id, { ...confirmation, smsCode: '123456' })
    assert.equal(result.session.stage, 'UNKNOWN')
    assert.equal(result.session.lastResult.retryAllowed, false)
    assert.equal(calls.filter((item) => item.path.endsWith('/orderConfirm/marketOrder')).length, 1)
  }
})

test('App token redemption is one attempt but does not misclassify login failures as an order result', async () => {
  const { service } = mockCloud({ failPath: '/mkt_web/s/login/decryptPhoneByTokenJt' })
  await assert.rejects(
    () => service.create({ platform: 'cloud', auth: { appToken: 'mock-app-token-from-current-login' } }),
    (error) => error.code === 'CLOUD_AUTH_NETWORK_FAILED' && !error.details?.uncertain,
  )
})

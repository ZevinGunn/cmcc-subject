import test from 'node:test'
import assert from 'node:assert/strict'
import { QuickOrderError } from '../src/services/quickOrders/errors.js'
import { QuickOrderService } from '../src/services/quickOrders/service.js'

function fixture({ confirm, sendSms } = {}) {
  const calls = []
  const adapter = {
    async create() {
      calls.push('create')
      return { privateContext: {}, publicContext: { maskedPhone: '138****8000', authSummary: 'mock' } }
    },
    async prepare() {
      calls.push('prepare')
      return { name: '测试业务', eligible: true, options: [{ id: 'REAL_OPTION', name: '实时档位', feeText: '100 元' }], protocol: { name: '协议', content: '测试协议' }, warnings: [] }
    },
    async select(context, option) {
      calls.push(`select:${option.id}`)
      context.selected = option.id
      return { ...option, effectText: '立即生效' }
    },
    async sendSms() {
      calls.push('sendSms')
      return sendSms ? sendSms() : { message: 'sent' }
    },
    async confirm(context, code) {
      calls.push(`confirm:${code}`)
      return confirm ? confirm(context, code) : { accepted: true, uncertain: false, code: '0', message: '已受理', orderId: 'ORDER-1' }
    },
  }
  const service = new QuickOrderService({ adapters: { north: adapter }, logger: async () => {} })
  return { service, calls }
}

async function ready(service) {
  const created = await service.create({ platform: 'north' })
  await service.prepare(created.id)
  await service.select(created.id, 'REAL_OPTION')
  return created.id
}

test('runs the shared quick-order state machine and returns only public context', async () => {
  const { service, calls } = fixture()
  const id = await ready(service)
  const sms = await service.sendSms(id, { agreed: true, realOrderConfirmed: true, confirmationId: 'confirm_12345678' })
  assert.equal(sms.stage, 'SMS_SENT')
  const result = await service.confirm(id, { smsCode: '123456', agreed: true, realOrderConfirmed: true, confirmationId: 'confirm_12345678' })
  assert.equal(result.session.stage, 'FINISHED')
  assert.equal(result.session.lastResult.retryAllowed, false)
  assert.equal(result.session.lastResult.orderId, 'ORDER-1')
  assert.equal('privateContext' in result.session, false)
  assert.deepEqual(calls, ['create', 'prepare', 'select:REAL_OPTION', 'sendSms', 'confirm:123456'])
})

test('rejects browser-injected options and invalid stage transitions', async () => {
  const { service } = fixture()
  const created = await service.create({ platform: 'north' })
  await assert.rejects(() => service.select(created.id, 'FAKE_OPTION'), /当前阶段不能选择档位/)
  await service.prepare(created.id)
  await assert.rejects(() => service.select(created.id, 'FAKE_OPTION'), /实时返回的有效档位/)
})

test('requires agreement, explicit real-order confirmation and stable confirmation id before SMS', async () => {
  const { service } = fixture()
  const id = await ready(service)
  await assert.rejects(() => service.sendSms(id, { agreed: true }), /真实订购操作/)
  await assert.rejects(() => service.sendSms(id, { agreed: true, realOrderConfirmed: true, confirmationId: 'short' }), /确认标识无效/)
})

test('returns the same final result for the same confirmation id and rejects a different id', async () => {
  const { service, calls } = fixture()
  const id = await ready(service)
  await service.sendSms(id, { agreed: true, realOrderConfirmed: true, confirmationId: 'confirm_12345678' })
  await service.confirm(id, { smsCode: '123456', agreed: true, realOrderConfirmed: true, confirmationId: 'confirm_12345678' })
  const repeated = await service.confirm(id, { smsCode: '123456', agreed: true, realOrderConfirmed: true, confirmationId: 'confirm_12345678' })
  assert.equal(repeated.idempotent, true)
  assert.equal(calls.filter((item) => item.startsWith('confirm:')).length, 1)
  await assert.rejects(
    () => service.confirm(id, { smsCode: '123456', agreed: true, realOrderConfirmed: true, confirmationId: 'confirm_DIFFERENT' }),
    /不能更换确认标识/,
  )
})

test('keeps the SMS stage after an explicit verification-code error', async () => {
  const { service } = fixture({ confirm: async () => { throw new QuickOrderError('验证码错误', 'SMS_CODE_MISMATCH', 400, { recoverable: true }) } })
  const id = await ready(service)
  await service.sendSms(id, { agreed: true, realOrderConfirmed: true, confirmationId: 'confirm_12345678' })
  await assert.rejects(() => service.confirm(id, { smsCode: '000000', agreed: true, realOrderConfirmed: true, confirmationId: 'confirm_12345678' }), /验证码错误/)
  assert.equal(service.read(id).stage, 'SMS_SENT')
})

test('maps final network ambiguity to UNKNOWN and forbids retry', async () => {
  const { service } = fixture({ confirm: async () => { const error = new Error('socket hang up'); error.code = 'ECONNRESET'; throw error } })
  const id = await ready(service)
  await service.sendSms(id, { agreed: true, realOrderConfirmed: true, confirmationId: 'confirm_12345678' })
  const result = await service.confirm(id, { smsCode: '123456', agreed: true, realOrderConfirmed: true, confirmationId: 'confirm_12345678' })
  assert.equal(result.session.stage, 'UNKNOWN')
  assert.equal(result.session.lastResult.retryAllowed, false)
})

test('makes a direct result from the SMS stage idempotent by confirmation id', async () => {
  const { service, calls } = fixture({ sendSms: async () => ({ finalResult: { accepted: true, uncertain: false, code: '0', message: '直接受理' } }) })
  const id = await ready(service)
  const input = { agreed: true, realOrderConfirmed: true, confirmationId: 'confirm_12345678' }
  assert.equal((await service.sendSms(id, input)).stage, 'FINISHED')
  assert.equal((await service.sendSms(id, input)).stage, 'FINISHED')
  assert.equal(calls.filter((item) => item === 'sendSms').length, 1)
})

test('maps explicitly uncertain first-submit errors to UNKNOWN', async () => {
  const { service } = fixture({ sendSms: async () => { throw new QuickOrderError('未确认', 'FIRST_UNKNOWN', 424, { uncertain: true }) } })
  const id = await ready(service)
  const result = await service.sendSms(id, { agreed: true, realOrderConfirmed: true, confirmationId: 'confirm_12345678' })
  assert.equal(result.stage, 'UNKNOWN')
  assert.equal(result.lastResult.retryAllowed, false)
})

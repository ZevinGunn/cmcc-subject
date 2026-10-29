import assert from 'node:assert/strict'
import express from 'express'
import callbackRoutes from '../routes/callbackAppointments.js'
import { callbackFlowAllowed, createCallbackService, parseCallbackResult } from '../services/cmccCallback.js'

assert.equal(parseCallbackResult({ returnCode: '-9999', ok: false, data: { flag: 2 } }).status, 'duplicate')
assert.equal(parseCallbackResult({ returnCode: '0', data: { flag: 0 } }).status, 'failed')
assert.equal(parseCallbackResult({ returnCode: '-1', data: { flag: 1 } }).status, 'failed')
assert.equal(parseCallbackResult({ returnCode: '0', data: { flag: 1, bizOrderId: 'test-order' } }).bizOrderId, 'test-order')
assert.equal(callbackFlowAllowed({ flowChannel: 202 }, '30011'), false)
assert.equal(callbackFlowAllowed({ flowChannel: 3, standardDecision: 2 }, '10002'), false)
assert.equal(callbackFlowAllowed({ flowChannel: 2 }, '30011'), false)
assert.equal(callbackFlowAllowed({ flowChannel: 1 }, '30011'), true)
assert.equal(callbackFlowAllowed({ flowChannel: 3, configType: 2, flowChannelList: ['1', '3'] }, '30011'), true)

const adminKey = process.env.ADMIN_KEY
process.env.ADMIN_KEY = 'callback-unit-only'
const app = express().use(express.json()).use('/api/callback-appointments', callbackRoutes)
const server = app.listen(0, '127.0.0.1')
await new Promise<void>(resolve => server.once('listening', resolve))
try {
  const address = server.address() as { port: number }
  for (const action of ['products', 'prepare', 'confirm']) {
    const response = await fetch(`http://127.0.0.1:${address.port}/api/callback-appointments/foreign-account/${action}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ productCode: '11531947', sessionId: 'stolen', preparationId: 'stolen' }) })
    assert.equal(response.status, 401, `Anonymous ${action} is rejected before upstream access`)
    assert.equal((await response.json()).errorCode, 'UNAUTHENTICATED')
  }
} finally {
  server.closeAllConnections()
  await new Promise<void>(resolve => server.close(() => resolve()))
  if (adminKey === undefined) delete process.env.ADMIN_KEY
  else process.env.ADMIN_KEY = adminKey
}

let clock = 1_000, creates = 0, mode = 'success', ruleMode = 'failed', precheckOk = false, precheckStatus = '-1'
const calls: { path: string; body: Record<string, unknown> }[] = []
let release: (() => void) | undefined
const service = createCallbackService(async () => ({
  phone: '13800000000', maskedPhone: '138****0000', channelCode: '30011', provinceCode: '100', cityCode: '101',
  request: async (path, body) => {
    calls.push({ path, body: body as Record<string, unknown> })
    if (path.endsWith('prodWithNormList')) return { returnCode: '0', data: { productName: '测试业务', productId: 42, norms: [{ normId: 7, name: '测试档位', price: '800' }] } }
    if (path.endsWith('/norm')) return { returnCode: '0', data: { id: 7, name: '测试档位', productCode: 'test-package', price: '800' } }
    if (path.endsWith('ruleNew')) return { returnCode: '0', data: [{ ruleType: 11, secondRuleType: ruleMode === 'active' ? 1101 : 1107, ruleId: 'active-rule', flowChannel: 1, normIds: [7] }] }
    if (path.endsWith('productPreCheck')) return { returnCode: '0', data: JSON.stringify({ status: precheckOk ? '0' : precheckStatus, message: '测试资格失败' }) }
    if (path.endsWith('failedOrder/check')) return { returnCode: '0', data: { flag: 1, flowChannel: 1, ruleId: 'fresh-rule', standardDecision: 2, requestId: 'fresh-request', businessId: 'PERSONAL', businessType: 'NP_YYD', subBusinessType: 'test-subtype' } }
    assert.ok(path.endsWith('opportunity/create'))
    creates++
    if (mode === 'hold') await new Promise<void>(resolve => { release = resolve })
    if (mode === 'timeout') throw new Error('timeout')
    return mode === 'failed' ? { returnCode: '-1', returnMessage: '繁忙', data: { flag: 0 } } : { returnCode: '0', data: { flag: 1, bizOrderId: 'test-order' } }
  },
}), () => clock)
const start = () => service.start({ ownerKey: 'user:1', accountId: 'account:1', productCode: '11531947', cookie: 'mock', expectedPhone: '13800000000' })
const s = await start()
await assert.rejects(service.prepare(s.sessionId, 'user:2', 'account:1', '7'), /无权访问/)
await assert.rejects(service.prepare(s.sessionId, 'user:1', 'account:2', '7'), /无权访问/)
await assert.rejects(service.prepare(s.sessionId, 'user:1', 'account:1', '8'), /不属于/)
await assert.rejects(service.confirm(s.sessionId, 'user:1', 'account:1', 'fake'), /先查询/)
const p = await service.prepare(s.sessionId, 'user:1', 'account:1', '7')
assert.equal(creates, 0, 'Preparing never creates an appointment or orders a product')
const reasonRequest = calls.find(row => row.path.endsWith('failedOrder/check'))!
assert.equal(reasonRequest.body.failedReason, '测试资格失败')
mode = 'hold'
const pending = service.confirm(s.sessionId, 'user:1', 'account:1', p.preparationId)
await assert.rejects(service.confirm(s.sessionId, 'user:1', 'account:1', p.preparationId), /重复提交/)
release!()
assert.equal((await pending).status, 'success')
assert.equal((await service.confirm(s.sessionId, 'user:1', 'account:1', p.preparationId)).status, 'success')
assert.equal(creates, 1)
const body = calls.find(row => row.path.endsWith('opportunity/create'))!.body
assert.equal(body.ruleId, 'fresh-rule'); assert.equal(body.requestId, 'fresh-request'); assert.equal(body.type, 2); assert.equal(body.secondType, 202); assert.equal(body.orderType, 2)
assert.equal('telephone' in body, false)
clock += 31 * 60_000
await assert.rejects(service.prepare(s.sessionId, 'user:1', 'account:1', '7'), /过期/)
ruleMode = 'active'
const s2 = await start(), p2 = await service.prepare(s2.sessionId, 'user:1', 'account:1', '7')
mode = 'failed'
assert.equal((await service.confirm(s2.sessionId, 'user:1', 'account:1', p2.preparationId)).status, 'failed')
mode = 'timeout'
assert.equal((await service.confirm(s2.sessionId, 'user:1', 'account:1', p2.preparationId)).status, 'unknown')
const afterTimeout = creates
assert.equal((await service.confirm(s2.sessionId, 'user:1', 'account:1', p2.preparationId)).status, 'unknown')
assert.equal(creates, afterTimeout, 'No automatic retry after uncertain submission')
ruleMode = 'failed'; precheckOk = true
const s3 = await start()
await assert.rejects(service.prepare(s3.sessionId, 'user:1', 'account:1', '7'), /未提供/)
precheckOk = false; precheckStatus = '1'
assert.ok((await service.prepare(s3.sessionId, 'user:1', 'account:1', '7')).preparationId, 'Official status=1 is also a failed precheck')
await assert.rejects(service.start({ accountId: 'account:1', ownerKey: 'user:1', cookie: 'mock', productCode: '12', expectedPhone: '13900000000' }), /不一致/)
console.log('callback-unit: passed (response semantics, rule selection, isolation, locking, expiry, uncertain result)')

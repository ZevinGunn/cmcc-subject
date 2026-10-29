import test from 'node:test'
import assert from 'node:assert/strict'
import {
  checkPremiumBroadband,
  initializePremiumBroadband,
  submitPremiumBroadband,
} from '../src/services/premiumBroadbandService.js'

function runner(responses) {
  const calls = []
  const run = async (_session, step) => {
    calls.push(step)
    return responses.shift()
  }
  return { calls, run }
}

test('uses the authenticated portal session with the premium broadband referer', async () => {
  const mock = runner([{ ok: true, status: 200, raw: { code: 'success', data: { gears: [] } } }])
  const result = await initializePremiumBroadband({ id: 'session-1' }, mock.run)
  assert.equal(result.ok, true)
  assert.equal(mock.calls[0].path, '/portal-bff/api/ajybz/v1.0/indexQQTZX')
  assert.equal(mock.calls[0].refererPath, '/nwt/portal/qqtzxBroadbandOrder')
})

test('sends itemCode in the encrypted POST body without a clear query parameter', async () => {
  const mock = runner([{ ok: true, status: 200, raw: { code: 'success', data: { message: 'Y' } } }])
  const result = await checkPremiumBroadband({ id: 'session-1' }, { itemCode: 'QQT-24' }, mock.run)
  assert.equal(result.ok, true)
  assert.deepEqual(mock.calls[0].body, { itemCode: 'QQT-24' })
  assert.equal('query' in mock.calls[0], false)
})

test('attempts commit after a rejected precheck and preserves every upstream response', async () => {
  const mock = runner([
    { ok: true, status: 200, raw: { code: 'success', data: { message: 'NOT_ELIGIBLE', isRealName: 'N' } } },
    { ok: true, status: 200, raw: { code: 'success', data: { message: 'true' } } },
    { ok: true, status: 200, raw: { code: 'failed', message: '活动资格不匹配', data: { reason: 'NOT_ELIGIBLE' } } },
  ])
  const result = await submitPremiumBroadband({ id: 'session-1' }, {
    itemCode: 'QQT-24',
    ownerName: '测试用户',
    identityNumber: '110101199001011234',
    address: '海淀区-测试路1号',
    contactPhone: '13800138000',
    installDate: '20990101',
    timeSlot: '1',
  }, mock.run)
  assert.equal(result.ok, true)
  assert.equal(mock.calls.at(-1).path.endsWith('/commitQQTZX'), true)
  assert.equal(result.data.precheck.response.data.message, 'NOT_ELIGIBLE')
  assert.equal(result.data.realName.response.data.message, 'true')
  assert.equal(result.data.commit.response.data.reason, 'NOT_ELIGIBLE')
  assert.equal(result.data.resultQuery, undefined)
})

test('queries the concrete result callback after a successful commit', async () => {
  const mock = runner([
    { ok: true, status: 200, raw: { code: 'success', data: { message: 'Y', isRealName: 'Y' } } },
    { ok: true, status: 200, raw: { code: 'success', message: '提交成功' } },
    { ok: true, status: 200, raw: { code: 'success', data: { resultCode: '00', resultDesc: '办理成功' } } },
  ])
  const result = await submitPremiumBroadband({ id: 'session-1' }, {
    itemCode: 'QQT-24',
    ownerName: '测试用户',
    address: '海淀区-测试路1号',
    contactPhone: '13800138000',
    installDate: '20990101',
    timeSlot: '1',
  }, mock.run)
  assert.equal(mock.calls.at(-1).path, '/portal-bff/api/pcConsole/v1.0/showBLJG')
  assert.equal(result.data.resultQuery.response.data.resultDesc, '办理成功')
})

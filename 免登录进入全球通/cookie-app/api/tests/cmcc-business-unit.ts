import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import https from 'node:https'
import { EventEmitter } from 'node:events'
import { prepareBusinessH5Request } from '../services/cmccBusinessH5.js'
import { __test__, queryUnsubscribeStatus, sendUnsubscribeSms, unsubscribeBusiness } from '../services/cmccBusinessQuery.js'
import { businessUnsubscribeTimeLabel, businessUnsubscribeTimeOptions } from '../../shared/businessUnsubscribeTime.js'
import { decryptBusinessRequestBody, encryptBusinessResponseBody } from '../services/cmccBusinessCrypto.js'

const business = { businessName: '测试业务', codeType: '01', productCode: 'TEST-PRODUCT', instanceId: 'TEST-INSTANCE', busiReturnEffTime: '2', effTimeType: '0|1|3' }
const input = { business, phone: '13800000000', cookie: 'JSESSIONID=test-session', smsCode: '000000', effectiveTimeType: '0' }
assert.deepEqual(businessUnsubscribeTimeOptions(business), ['0', '1', '3'])
assert.equal(businessUnsubscribeTimeLabel('3'), '次日失效')
assert.equal(__test__.resolveUnsubscribeEffectiveTime({ busiReturnEffTime: 0 }, '1'), '0')
assert.equal(__test__.resolveUnsubscribeEffectiveTime({ busiReturnEffTime: '3' }, '1'), '3')
assert.equal(__test__.resolveUnsubscribeEffectiveTime(business, '2'), '0')
assert.equal(__test__.resolveUnsubscribeEffectiveTime({ busiReturnEffTime: '2' }, '0'), '0')
assert.equal(__test__.resolveUnsubscribeEffectiveTime({}, '3'), '')
for (const [time, smsTime] of [['0', '2'], ['1', '1'], ['3', '5']]) {
  assert.equal(__test__.buildUnsubscribeBody({ ...input, effectiveTimeType: time }).busiReturnEffTime, time)
  assert.equal(__test__.buildUnsubscribeSmsBody({ ...input, effectiveTimeType: time }).effectiveType, smsTime)
}
const ny = { bunessName: '省端业务', bunessType: '02', bunessCode: 'NY-CODE', spid: 'SP-CODE', bizCode: 'BIZ-CODE', offerId: 'UNRELATED-OFFER', bindList: [{ bindedBusiName: '关联业务' }] }
const nyBody = __test__.buildUnsubscribeBody({ ...input, business: ny })
assert.equal(nyBody.productId, 'NY-CODE')
assert.equal(nyBody.productType, '02')
assert.equal(nyBody.spid, 'SP-CODE')
assert.equal(nyBody.bizCode, 'BIZ-CODE')
assert.equal(__test__.buildUnsubscribeSmsBody({ ...input, business: ny }).productName, '省端业务,关联业务')
assert.equal(__test__.buildUnsubscribeBody({ ...input, idOverride: { productCode: 'OVERRIDE', offerId: 'OVERRIDE-BIZ' } }).productId, 'OVERRIDE')
assert.equal(__test__.buildUnsubscribeBody({ ...input, idOverride: { offerId: 'OVERRIDE-BIZ' } }).bizCode, 'OVERRIDE-BIZ')

const h5Args = { url: 'https://app.10086.cn/biz-orange/BH/unifyCancelServiceh5/getUnifyCancel', body: { reqBody: { synthetic: true }, xk: 'TEST' }, cookie: input.cookie, pageUrl: 'https://wx.10086.cn/cmcc-service/app-pages/main/businessQuery' }
const prepared = prepareBusinessH5Request(h5Args)
assert.equal(prepared.headers['x-qen'], '17')
assert.equal(prepared.headers['content-type'], 'application/x-www-form-urlencoded')
assert.equal(prepared.headers.accept, 'application/json')
assert.match(prepared.headers['x-nonce'], /^\d{8}$/)
assert.match(prepared.headers['x-time'], /^\d{13}$/)
assert.equal(prepared.headers['x-sign'], crypto.createHash('md5').update(`${prepared.headers['x-token']}_${prepared.headers['x-time']}_${prepared.headers['x-nonce']}_test-session`).digest('hex'))
assert.match(prepared.body, /^[A-Za-z0-9+/=]+$/)
assert.equal(prepared.body.includes('synthetic'), false)
const otherSession = prepareBusinessH5Request({ ...h5Args, cookie: 'JSESSIONID=other-session' })
assert.equal(otherSession.headers['x-sign'], crypto.createHash('md5').update(`${otherSession.headers['x-token']}_${otherSession.headers['x-time']}_${otherSession.headers['x-nonce']}_other-session`).digest('hex'))
assert.throws(() => prepareBusinessH5Request({ ...h5Args, url: 'https://clientaccess.10086.cn/biz-orange/BH/unifyCancelService/getUnifyCancel' }), /不支持/)
const response = (payload: unknown, headers = {}) => ({ headers, bodyText: JSON.stringify(payload) })
assert.deepEqual(prepared.decodeResponse(response({ retCode: '000000', retDesc: '受理成功', rspBody: { accepted: true } })), { retCode: '000000', retDesc: '受理成功', rspBody: { accepted: true } })
assert.throws(() => prepared.decodeResponse(response({ body: 'invalid' }, { 'x-pen': '2' })), /不支持/)
assert.throws(() => prepared.decodeResponse(response({ body: 'invalid' }, { 'x-pen': '17' })))
assert.throws(() => prepared.decodeResponse(response({ body: 'invalid' })), /业务结果码/)
const unknown = __test__.parseBusinessResponse({ statusCode: 200, ...response({ body: 'invalid' }, { 'x-pen': '17', 'set-cookie': ['JSESSIONID=updated; Path=/'] }) }, input.cookie, prepared.decodeResponse)
assert.equal(unknown.ok, false)
assert.equal(unknown.cookieUpdated, true)
assert.equal(unknown.cookie, 'JSESSIONID=updated')
assert.match(unknown.message!, /结果尚未确认/)

// Exercise the complete service chain through a fake HTTPS transport; no upstream writes.
const originalRequest = https.request
const calls: { url: string; headers: Record<string, string>; body: string }[] = []
let mockResponse = { statusCode: 200, headers: {}, bodyText: JSON.stringify({ retCode: '000000', retDesc: '受理成功', rspBody: {} }) }
https.request = ((url: string, options: { headers: Record<string, string> }, callback: (response: unknown) => void) => {
  const call = { url, headers: options.headers, body: '' }
  calls.push(call)
  const request = Object.assign(new EventEmitter(), {
    getHeaders: () => options.headers,
    setTimeout() {},
    write(value: string) { call.body += value },
    end() {
      // Status/SMS must retain the independently verified version-1 contract.
      const legacy = options.headers['x-qen'] === '1' && mockResponse.statusCode === 200
      const headers = legacy ? { ...mockResponse.headers, 'x-pen': '1' } : mockResponse.headers
      const bodyText = legacy ? JSON.stringify({ body: encryptBusinessResponseBody(mockResponse.bodyText) }) : mockResponse.bodyText
      const incoming = Object.assign(new EventEmitter(), { statusCode: mockResponse.statusCode, headers })
      callback(incoming)
      incoming.emit('data', Buffer.from(bodyText))
      incoming.emit('end')
    },
  })
  return request
}) as unknown as typeof https.request
try {
  assert.equal((await queryUnsubscribeStatus(input)).ok, true)
  assert.equal((await sendUnsubscribeSms(input)).ok, true)
  assert.equal((await unsubscribeBusiness(input)).ok, true)
  assert.deepEqual(calls.map((call) => new URL(call.url).pathname), [
    '/biz-orange/BH/unifyQueryService/getUnifyQuery', '/biz-orange/BH/sms/getSmsCode', '/biz-orange/BH/unifyCancelServiceh5/getUnifyCancel',
  ])
  assert.deepEqual(calls.map((call) => call.headers['x-qen']), ['1', '1', '17'], 'Do not upgrade status/SMS based on the submission SDK route table')
  for (const call of calls.slice(0, 2)) {
    const envelope = JSON.parse(decryptBusinessRequestBody(call.body))
    assert.equal(envelope.tel, input.phone)
    assert.equal(envelope.lk, 'CKyscfssVfp4V80E61EBj8lbYbaTkhrZ')
    assert.equal(envelope.reqBody.cellNum, input.phone)
    assert.equal(call.headers.xs, crypto.createHash('md5').update(`${call.url}_${JSON.stringify(envelope)}CMCCIT`).digest('hex'))
  }
  const sms = JSON.parse(decryptBusinessRequestBody(calls[1].body)).reqBody
  assert.equal(sms.productId, business.productCode)
  assert.equal(sms.productName, business.businessName)
  assert.equal(sms.effectiveType, '2')
  assert.ok(calls.every((call) => !call.body.includes(input.smsCode)))
  mockResponse = { statusCode: 403, headers: {}, bodyText: '<html><h1>403 Forbidden</h1><script>secret</script></html>' }
  const count = calls.length
  const forbidden = await unsubscribeBusiness(input)
  assert.equal(calls.length, count + 1, 'A rejected submission must not retry via another gateway')
  assert.equal(forbidden.ok, false)
  assert.equal(/<|secret/.test(forbidden.message!), false)
  const incomplete = { ...input, business: { codeType: '01' } }
  assert.match((await sendUnsubscribeSms(incomplete)).message!, /productId/)
  assert.match((await unsubscribeBusiness(incomplete)).message!, /productId/)
  assert.equal(calls.length, count + 1, 'Missing IDs must fail before any network request')
} finally {
  https.request = originalRequest
}
console.log('cmcc-business-unit: OK (offline only)')

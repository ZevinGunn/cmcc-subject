import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import https from 'node:https'
import { EventEmitter } from 'node:events'
import { AGE_FEED_DEFAULTS, AGE_FEED_TIERS, AGE_FEED_SOURCE_URL } from '../../shared/ageFeed.js'
import { ageFeedEligibility, prepareAgeFeedProduct } from '../services/cmccAgeFeedOrder.js'
import { buildCocPackageUrl, isCocPackageTarget } from '../services/cocPackageSession.js'
import { cocAuroraDecrypt, cocAuroraEncrypt } from '../services/cmccBenefitOrderCrypto.js'
import {
  createBusinessOrderSession, prepareBusinessOrderProduct, sendBusinessOrderConfirmSms,
  confirmBusinessOrder, deleteBusinessOrderSession, readBusinessOrderSession,
} from '../services/cmccBusinessOrder.js'

const url = new URL(buildCocPackageUrl('age_feed', 'test-ticket'))
assert.equal(isCocPackageTarget('age_feed'), true)
assert.equal(url.pathname, '/coc/web6/ageFeedPackage/')
assert.equal(url.searchParams.get('pageId'), AGE_FEED_DEFAULTS.pageId)
assert.equal(url.searchParams.get('channelId'), AGE_FEED_DEFAULTS.touchCode)
assert.equal(url.searchParams.get('token'), 'test-ticket')
for (const tier of AGE_FEED_TIERS) {
  assert.equal(ageFeedEligibility('20年0个月', '01', tier.tag).tier?.productCode, tier.productCode)
  assert.equal(ageFeedEligibility('20年0个月', '01', tier.tag).eligible, true)
}
assert.equal(ageFeedEligibility('19年11个月', '01', '003').eligible, false)
assert.equal(ageFeedEligibility('11个月', '01', '003').eligible, false)
assert.equal(ageFeedEligibility('', '01', '003').eligible, false)
assert.equal(ageFeedEligibility('20年', '03', '003').eligible, true)
for (const level of ['00', '06', '07', '04', '08', '', '99']) {
  assert.equal(ageFeedEligibility('30年', level, '003').eligible, false, level)
}
assert.equal(ageFeedEligibility('30年', '03', '002').eligible, false)
assert.equal(ageFeedEligibility('30年', '01', 'unknown').eligible, false)

const originalRequest = https.request
const originalRandomBytes = crypto.randomBytes
const key = '0123456789abcdef'
const calls: Array<{ path: string; headers: Record<string, string>; body: Record<string, unknown> }> = []
let tag = '002'
let age = '25年6个月'
let level = '01'
let ordered = false
let malformedRelation = false
let missingProtocol = false
let tagResult = '0000'
let failPath = ''
let orderCalls = 0
let orderHttpFailure = false

// 固定测试密钥便于核对 Meteor 请求和加密响应；所有 HTTP 请求均由本地桩处理。
crypto.randomBytes = ((size: number) => size === 8 ? Buffer.from(key, 'hex') : originalRandomBytes(size)) as typeof crypto.randomBytes
https.request = ((url: string, options: { headers: Record<string, string> }, callback: (response: unknown) => void) => {
  let wire = ''
  return Object.assign(new EventEmitter(), {
    getHeaders: () => options.headers,
    setTimeout() {},
    write(value: string) { wire += value },
    end() {
      const path = new URL(url).pathname.replace('/coc/', '')
      const meteor = Boolean(options.headers['coc-meteor'])
      const outer = JSON.parse(wire)
      const body = meteor ? JSON.parse(cocAuroraDecrypt(Buffer.from(outer.cocEnContent, 'base64').toString('utf8'), key)) : outer
      calls.push({ path, headers: options.headers, body })
      let data: unknown
      switch (path) {
        case 'pkg/contract/common/newProductRelation':
          data = { isOrder: malformedRelation ? undefined : ordered, respDTOList: ordered ? [{ goodsId: AGE_FEED_TIERS[1].goodsId }] : [] }; break
        case 'activities/common/queryUserInfoNew': data = { userChinaMobileage: age }; break
        case 'editor/common/proxy/toC/gsmLabelQuery': data = { entity: { gbrandlevelInfo: { gbrandLevel: level } } }; break
        case 'pkg/common/queryMobileTagNew': data = { resultCode: tagResult, productInfos: [{ products: tag }] }; break
        case 'personalization/page/getDefault': data = {}; break
        case 'grocer/copyWriting/page/query': data = { configList: [{ subContent: '<p>官方活动规则</p>' }] }; break
        case 'grocer/protocol/prov/queryProtocol': data = missingProtocol ? [] : [{ protocolName: '网龄直升协议', protocolSequenceId: `test-sequence-${body.productCode}`, content: '<p>测试协议</p>' }]; break
        case 'user/smsCode': data = {}; break
        case 'user/loginCheck': data = { token: 'test-token' }; break
        case 'pkg/order/bookProduct': data = {}; orderCalls++; break
        default: throw new Error(`意外接口 ${path}`)
      }
      const payload = { code: path === failPath ? '40' : '0', message: path === failPath ? '登录已失效' : '成功', data }
      const response = Object.assign(new EventEmitter(), { statusCode: path === 'pkg/order/bookProduct' && orderHttpFailure ? 503 : 200, headers: {} })
      callback(response)
      response.emit('data', Buffer.from(JSON.stringify(meteor ? { returnData: cocAuroraEncrypt(payload, key) } : payload)))
      response.emit('end')
    },
  })
}) as unknown as typeof https.request

let id = ''
try {
  await assert.rejects(createBusinessOrderSession({ target: 'age_feed', phone: '13800138000', ownerKey: 'user:test', productCode: 'unknown' }), /请选择银卡/)
  const session = await createBusinessOrderSession({
    target: 'age_feed', phone: '13800138000', ownerKey: 'user:test',
    productCode: 'auto', pageId: 'wrong-page', touchCode: 'wrong-channel',
    authSession: { target: 'age_feed', cookie: 'User-Token=test-token', token: 'test-token', userId: 'test-user', provinceCode: '100', loginUrl: AGE_FEED_SOURCE_URL },
  })
  id = session.id
  assert.equal(session.pageId, AGE_FEED_DEFAULTS.pageId)
  let ready = await prepareBusinessOrderProduct(id, { productCode: 'auto', touchCode: 'wrong-channel' })
  assert.equal(ready.productCode, AGE_FEED_TIERS[1].productCode)
  assert.equal(ready.product?.orderAllowed, true)
  assert.equal(ready.product?.protocol.sequenceId, `test-sequence-${AGE_FEED_TIERS[1].productCode}`)
  assert.match(ready.product!.rulesHtml, /官方活动规则/)
  assert.deepEqual(calls.slice(0, 4).map((call) => call.path), [
    'pkg/contract/common/newProductRelation', 'activities/common/queryUserInfoNew',
    'editor/common/proxy/toC/gsmLabelQuery', 'pkg/common/queryMobileTagNew',
  ])
  assert.deepEqual(calls[0].body.productCodes, AGE_FEED_TIERS.map((tier) => tier.goodsId))
  assert.deepEqual(calls[3].body, { touchCode: AGE_FEED_DEFAULTS.touchCode, tagIds: '02519304000160', channelCode: '025193040002', eventCode: 'eventJE000000160' })
  for (const call of calls.filter((call) => call.path.startsWith('grocer/'))) {
    assert.ok(call.headers['coc-meteor'])
    assert.equal(call.headers['coc-meteor-v'], '2')
    assert.equal(call.headers.Referer, AGE_FEED_SOURCE_URL)
  }
  assert.equal(calls.find((call) => call.path.includes('copyWriting'))!.body.productCode, '100000096245')
  assert.equal(calls.find((call) => call.path.includes('queryProtocol'))!.body.productCode, AGE_FEED_TIERS[1].productCode)
  await assert.rejects(sendBusinessOrderConfirmSms(id, false), /同意/)
  await sendBusinessOrderConfirmSms(id, true)
  await assert.rejects(sendBusinessOrderConfirmSms(id, true), /秒后/)
  assert.deepEqual(calls.at(-1)!.body, { mobile: '13800138000', productCode: AGE_FEED_TIERS[1].productCode, pageId: AGE_FEED_DEFAULTS.pageId, smsCodeTypeEnum: '505', userId: 'test-user' })
  await assert.rejects(confirmBusinessOrder({ id, code: '123456', acceptedProtocol: true, confirmationText: '' }), /确认订购/)
  assert.equal(orderCalls, 0)
  const result = await confirmBusinessOrder({ id, code: '123456', acceptedProtocol: true, confirmationText: '确认订购' })
  assert.equal(result.result.success, true)
  assert.deepEqual(calls.at(-2)!.body, { mobile: '13800138000', smsCode: '123456', userId: 'test-user', smsCodeTypeEnum: '505', productCode: AGE_FEED_TIERS[1].productCode, verifyType: 0 })
  assert.deepEqual(calls.at(-1)!.body, { pageId: AGE_FEED_DEFAULTS.pageId, productCode: AGE_FEED_TIERS[1].productCode, touchCode: AGE_FEED_DEFAULTS.touchCode, verifyType: 2, sourceUrl: AGE_FEED_SOURCE_URL, protocolSequenceId: `test-sequence-${AGE_FEED_TIERS[1].productCode}` })
  await assert.rejects(confirmBusinessOrder({ id, code: '123456', acceptedProtocol: true, confirmationText: '确认订购' }))
  assert.equal(orderCalls, 1, '不允许重复提交已完成订单')

  age = '19年11个月'
  const before = calls.length
  ready = await prepareBusinessOrderProduct(id)
  assert.equal(ready.product?.orderAllowed, false)
  assert.match(ready.product!.eligibilityDetail!, /未满 20 年/)
  assert.equal(calls.length, before + 2, '低网龄不请求协议、等级或定向标签')
  await assert.rejects(sendBusinessOrderConfirmSms(id, true), /资格核验/)
  age = '25年'
  tagResult = '0001'
  ready = await prepareBusinessOrderProduct(id)
  assert.equal(ready.product?.orderAllowed, false)
  tagResult = '0000'
  level = '07'
  ready = await prepareBusinessOrderProduct(id)
  assert.equal(ready.product?.orderAllowed, false)
  level = '01'
  ordered = true
  ready = await prepareBusinessOrderProduct(id)
  assert.equal(ready.product?.relationOrdered, true)
  assert.equal(ready.product?.orderAllowed, true, '官方已有关系分支仍然获取协议进入订购')
  assert.ok(ready.product?.protocol.sequenceId)
  ordered = false
  malformedRelation = true
  await assert.rejects(prepareBusinessOrderProduct(id), /响应不完整/)
  malformedRelation = false
  missingProtocol = true
  await assert.rejects(prepareBusinessOrderProduct(id), /协议/)
  missingProtocol = false
  failPath = 'activities/common/queryUserInfoNew'
  await assert.rejects(prepareBusinessOrderProduct(id), /登录已失效/)
  assert.equal(orderCalls, 1)
  failPath = ''
  deleteBusinessOrderSession(id)

  // 手动选择三种正式档位，资格不符也允许尝试，但不能伪造资格通过。
  age = '5年'
  tag = '001'
  level = '00'
  for (const tier of AGE_FEED_TIERS) {
    const manual = await createBusinessOrderSession({
      target: 'age_feed', phone: '13800138000', ownerKey: 'user:test', productCode: tier.productCode,
      authSession: { target: 'age_feed', cookie: 'User-Token=test-token', token: 'test-token', userId: 'test-user', provinceCode: '100', loginUrl: AGE_FEED_SOURCE_URL },
    })
    id = manual.id
    const prepared = await prepareBusinessOrderProduct(id)
    assert.equal(prepared.ageFeedTier, tier.productCode)
    assert.equal(prepared.productCode, tier.productCode)
    assert.equal(prepared.product?.eligible, false)
    assert.equal(prepared.product?.orderAllowed, true)
    assert.match(prepared.product!.eligibilityDetail!, /手动选择/)
    assert.match(prepared.product!.warnings.join(''), /不代表资格通过/)
    assert.equal(calls.at(-1)!.body.productCode, tier.productCode, '协议使用选中档位')
    age = '25年'
    level = '01'
    const reference = await prepareBusinessOrderProduct(id)
    assert.equal(reference.product?.eligible, tier.tag === '001', '官方仅匹配银卡时，不得将手动金卡或白金卡标成资格通过')
    age = '5年'
    level = '00'
    const beforeInvalid = calls.length
    await assert.rejects(prepareBusinessOrderProduct(id, { productCode: 'sandbox-product' }), /请选择银卡/)
    assert.equal(calls.length, beforeInvalid, '非法档位不得请求上游或改变有效协议')
    failPath = 'user/smsCode'
    await assert.rejects(sendBusinessOrderConfirmSms(id, true), /登录已失效/)
    failPath = ''
    await sendBusinessOrderConfirmSms(id, true)
    assert.equal(calls.at(-1)!.body.productCode, tier.productCode)
    const submitted = await confirmBusinessOrder({ id, code: '123456', acceptedProtocol: true, confirmationText: '确认订购' })
    assert.equal(submitted.result.success, true)
    assert.equal(calls.at(-2)!.body.productCode, tier.productCode, '短信校验使用选中档位')
    assert.equal(calls.at(-1)!.body.productCode, tier.productCode, '下单使用选中档位')
    assert.equal(calls.at(-1)!.body.sourceUrl, AGE_FEED_SOURCE_URL)
    assert.equal(calls.at(-1)!.body.protocolSequenceId, `test-sequence-${tier.productCode}`, '下单协议必须属于选中档位')
    deleteBusinessOrderSession(id)
  }
  assert.equal(orderCalls, 4)

  const switching = await createBusinessOrderSession({
    target: 'age_feed', phone: '13800138000', ownerKey: 'user:test', productCode: AGE_FEED_TIERS[0].productCode,
    authSession: { target: 'age_feed', cookie: 'User-Token=test-token', token: 'test-token', userId: 'test-user', provinceCode: '100', loginUrl: AGE_FEED_SOURCE_URL },
  })
  id = switching.id
  await prepareBusinessOrderProduct(id)
  await sendBusinessOrderConfirmSms(id, true)
  const pending = prepareBusinessOrderProduct(id, { productCode: AGE_FEED_TIERS[2].productCode })
  await assert.rejects(prepareBusinessOrderProduct(id, { productCode: AGE_FEED_TIERS[1].productCode }), /正在获取/)
  const changed = await pending
  assert.equal(changed.productCode, AGE_FEED_TIERS[2].productCode)
  assert.ok(changed.orderSmsCooldownSeconds > 0)
  await assert.rejects(sendBusinessOrderConfirmSms(id, true), /秒后/)
  await assert.rejects(confirmBusinessOrder({ id, code: '123456', acceptedProtocol: true, confirmationText: '确认订购' }))
  assert.equal(orderCalls, 4, '切换档位后旧验证码不得下单')
  deleteBusinessOrderSession(id)
  const uncertain = await createBusinessOrderSession({
    target: 'age_feed', phone: '13800138000', ownerKey: 'user:test', productCode: AGE_FEED_TIERS[1].productCode,
    authSession: { target: 'age_feed', cookie: 'User-Token=test-token', token: 'test-token', userId: 'test-user', provinceCode: '100', loginUrl: AGE_FEED_SOURCE_URL },
  })
  id = uncertain.id
  await prepareBusinessOrderProduct(id)
  await sendBusinessOrderConfirmSms(id, true)
  orderHttpFailure = true
  await assert.rejects(confirmBusinessOrder({ id, code: '123456', acceptedProtocol: true, confirmationText: '确认订购' }), /上游 HTTP 503/)
  assert.equal(readBusinessOrderSession(id).lastResult?.uncertain, true)
  await assert.rejects(prepareBusinessOrderProduct(id, { productCode: AGE_FEED_TIERS[2].productCode }), /结果未确认/)
  assert.equal(orderCalls, 5, '下单结果未知时禁止通过换档位再次下单')
} finally {
  if (id) deleteBusinessOrderSession(id)
  https.request = originalRequest
  crypto.randomBytes = originalRandomBytes
}

await assert.rejects(prepareAgeFeedProduct({ phone: '13800138000', request: async () => ({ code: '40', message: '登录失效' }) }), /登录失效/)
console.log('age-feed-unit: OK（全部离线模拟，无真实短信和订购）')

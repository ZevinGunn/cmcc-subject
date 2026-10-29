import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import https from 'node:https'
import { EventEmitter } from 'node:events'
import { Readable } from 'node:stream'
import { mock } from 'node:test'
import {
  assertBenefitOrderSessionAccess, createLuckyBagSession, sendBenefitLoginSms, loginBenefitSession,
  prepareBenefitProduct, selectBenefitProduct, sendBenefitOrderSms, confirmBenefitOrder,
  rewindBenefitOrderSession, deleteBenefitOrderSession,
} from '../services/cmccBenefitOrder.js'
import {
  LUCKY_BAG_PRESETS, readLuckyBagVariant, parseLuckyBagRelation,
} from '../services/luckyBagOrder.js'
import { cocAuroraDecrypt, cocAuroraEncrypt, cocMeteorEncrypt } from '../services/cmccBenefitOrderCrypto.js'

const rsaPlaintexts = new Map<string, string>()
const log = mock.method(console, 'log', () => undefined)
const originalEncrypt = crypto.publicEncrypt
const rsaObserver = mock.method(crypto, 'publicEncrypt', ((options: Parameters<typeof originalEncrypt>[0], value: Buffer) => {
  const encrypted = originalEncrypt(options, value)
  rsaPlaintexts.set(encrypted.toString('base64'), value.toString())
  return encrypted
}) as typeof originalEncrypt)

type Call = { path: string; body: Record<string, unknown>; headers: Record<string, string>; variant: 'standard' | 'deluxe' }
const calls: Call[] = []
let mainOrdered = false
let currentBenefit = ''
let protocolMissing = false
let loginExpired = false
let missingUserId = false
let orderReply: unknown = { code: '0', message: '模拟受理', data: { commonOrderId: 'mock-order' } }
let gate: Promise<void> | undefined

// All network requests are intercepted. No real SMS or subscription may escape.
const transport = mock.method(https, 'request', ((url: string, options: { headers?: Record<string, string> }, callback: (res: unknown) => void) => {
  assert.equal(new URL(url).hostname, 'dev.coc.10086.cn')
  const req = new EventEmitter() as EventEmitter & { getHeaders: () => object; setTimeout: () => void; write: (value: string) => void; end: () => void }
  req.getHeaders = () => options.headers || {}
  req.setTimeout = () => undefined
  let raw = ''
  req.write = (value) => { raw += value }
  req.end = () => {
    const headers = options.headers || {}
    let body = JSON.parse(raw)
    const meteor = Boolean(headers['coc-meteor'])
    const rsaText = rsaPlaintexts.get(headers['coc-meteor'] || headers['coc-aurora'])
    const key = meteor ? Buffer.from(rsaText!, 'base64').toString() : rsaText
    if (key) {
      assert.match(key, /^[0-9a-f]{16}$/)
      assert.equal(meteor ? headers['coc-meteor-v'] : headers['coc-aurora-v'], '2')
      const cipher = meteor ? Buffer.from(body.cocEnContent, 'base64').toString() : body.cocEnContent
      body = JSON.parse(cocAuroraDecrypt(cipher, key))
    }
    const path = new URL(url).pathname.replace('/coc/', '')
    const variant = headers.Referer.includes('numbericalBag_prime') ? 'deluxe' : 'standard'
    calls.push({ path, body, headers, variant })
    const held = gate
    void (async () => {
      if (held) await held
      let payload: unknown = { code: '0', data: {} }
      if (path === 'user/userVerification') payload = { code: '0', data: { isCmcc: '0', cityId: '100', areaCode: '010' } }
      else if (path === 'user/loginCheck') payload = { code: '0', data: { userId: missingUserId ? '' : 'mock-user', provinceCode: '100' } }
      else if (path.endsWith('productRelation')) {
        assert.match(headers.Cookie, /User-Token=mock-only/)
        const main = (body.productCodes as string[]).includes(LUCKY_BAG_PRESETS[variant].mainProductCode)
        const codes = main ? (mainOrdered ? [LUCKY_BAG_PRESETS[variant].mainProductCode] : []) : currentBenefit ? [currentBenefit] : []
        payload = loginExpired ? { code: '40' } : { code: '0', data: { isOrder: codes.length > 0, respDTOList: codes.map((productCode) => ({ productCode })) } }
      } else if (path.endsWith('queryProtocol')) {
        assert.equal(meteor, true, 'protocol uses Meteor, not Aurora')
        payload = { code: '0', data: protocolMissing ? [] : [{ protocolName: '模拟福袋协议', protocolSequenceId: 'mock-sequence', content: '<p>仅模拟：费用与更换规则。</p>' }] }
      } else if (path.endsWith('page/query')) {
        assert.equal(meteor, true, 'copywriting uses Meteor')
        payload = { code: '0', data: { configList: [{ subContent: '<p>模拟规则</p>' }] } }
      } else if (path.startsWith('pkg/order/')) payload = orderReply
      else assert.equal(path, 'user/smsCode', `unexpected upstream path ${path}`)
      if (payload instanceof Error) { req.emit('error', payload); return }
      if (meteor) payload = { returnData: cocAuroraEncrypt(payload, key!) }
      const res = Object.assign(Readable.from([typeof payload === 'string' ? payload : JSON.stringify(payload)]), {
        statusCode: 200, headers: path === 'user/loginCheck' ? { 'set-cookie': ['User-Token=mock-only; Path=/'] } : {},
      })
      callback(res)
    })().catch((error) => req.emit('error', error))
  }
  return req
}) as unknown as typeof https.request)

let phoneIndex = 1
async function login(variant: 'standard' | 'deluxe', phone = `1390000${String(phoneIndex++).padStart(4, '0')}`) {
  const s = await createLuckyBagSession({ ownerKey: 'user:mock', phone, bagVariant: variant })
  assert.equal(s.stage, 'initialized')
  assert.throws(() => assertBenefitOrderSessionAccess(s.id, 'user:other'), /无权/)
  assertBenefitOrderSessionAccess(s.id, 'user:mock')
  await sendBenefitLoginSms(s.id)
  await assert.rejects(sendBenefitLoginSms(s.id), (e: { code: string }) => e.code === 'SMS_COOLDOWN')
  await loginBenefitSession(s.id, '123456')
  return s.id
}

try {
  assert.equal(readLuckyBagVariant('standard'), 'standard')
  assert.throws(() => readLuckyBagVariant('__proto__'), /请选择/)
  for (const invalid of [{}, { code: '0', data: {} }, { code: '0', data: { isOrder: true } }, { code: '0', data: { isOrder: false, respDTOList: [{ productCode: 'x' }] } }]) {
    assert.throws(() => parseLuckyBagRelation(invalid, ['x']))
  }
  assert.deepEqual(parseLuckyBagRelation({ code: '0', data: { isOrder: 'false' } }, ['x']), [])
  assert.throws(() => parseLuckyBagRelation({ code: '0', data: { isOrder: true, respDTOList: [{ productCode: 'foreign' }] } }, ['x']))
  // Source contract: Meteor wraps the AES Base64 in another Base64 layer.
  const encrypted = cocMeteorEncrypt({ a: 1 }, '0123456789abcdef')
  assert.equal(JSON.parse(cocAuroraDecrypt(Buffer.from(encrypted, 'base64').toString(), '0123456789abcdef')).a, 1)

  let count = 0
  for (const variant of ['standard', 'deluxe'] as const) {
    const config = LUCKY_BAG_PRESETS[variant]
    for (const benefit of config.benefits) {
      mainOrdered = false; currentBenefit = ''; calls.length = 0
      const id = await login(variant)
      const product = await prepareBenefitProduct(id)
      assert.equal(product.product?.bagStatus?.action, 'main_order')
      assert.equal(product.product?.norms?.length, config.benefits.length)
      await assert.rejects(selectBenefitProduct(id, ['foreign']), (e: { code: string }) => e.code === 'INVALID_BAG_BENEFIT')
      const selected = await selectBenefitProduct(id, [benefit.code])
      assert.equal(selected.product?.selectedPrice, config.fee)
      const selectedAgain = await selectBenefitProduct(id, [benefit.code])
      assert.equal(selectedAgain.product?.rulesHtml, selected.product?.rulesHtml, 'reselection replaces benefit details without duplicating them')
      assert.equal([...calls].reverse().find((call) => call.path.endsWith('queryProtocol'))?.body.productCode, benefit.bundle)
      await assert.rejects(sendBenefitOrderSms(id, false), /协议/)
      await sendBenefitOrderSms(id, true)
      assert.equal(calls.at(-1)?.body.productCode, benefit.bundle)
      await assert.rejects(confirmBenefitOrder({ id, code: '123456', acceptedProtocol: false, confirmationText: '确认订购' }), /确认/)
      const result = await confirmBenefitOrder({ id, code: '123456', acceptedProtocol: true, confirmationText: '确认订购' })
      assert.equal(result.result.success, true)
      const order = calls.at(-1)!
      assert.equal(order.path, 'pkg/order/combineBookProduct')
      assert.equal(order.body.productCode, benefit.bundle)
      assert.equal(order.body.nProductCode, variant === 'deluxe' ? config.mainProductCode : undefined)
      assert.ok(!order.headers['coc-aurora'] && !order.headers['coc-meteor'], 'order uses plain JSON')
      await assert.rejects(confirmBenefitOrder({ id, code: '123456', acceptedProtocol: true, confirmationText: '确认订购' }), /状态/)
      await assert.rejects(prepareBenefitProduct(id), (e: { code: string }) => e.code === 'BAG_ORDER_PENDING')
      mainOrdered = true; currentBenefit = benefit.code
      const refreshed = await prepareBenefitProduct(id)
      assert.equal(refreshed.product?.bagStatus?.action, 'benefit_change')
      assert.ok(!refreshed.product?.norms?.some((n) => n.id === benefit.code))
      await assert.rejects(selectBenefitProduct(id, [benefit.code]), /已订购/)
      deleteBenefitOrderSession(id)
      count += 1
    }

    // Existing main tariff: both initial benefit selection and replacement use the change endpoint.
    for (const previous of ['', config.benefits[0].code]) {
      mainOrdered = true; currentBenefit = previous
      const id = await login(variant)
      const p = await prepareBenefitProduct(id)
      assert.equal(p.product?.bagStatus?.action, previous ? 'benefit_change' : 'benefit_order')
      const next = config.benefits[1]
      await selectBenefitProduct(id, [next.code])
      await sendBenefitOrderSms(id, true)
      assert.equal(calls.at(-1)?.body.productCode, next.code)
      const rewound = rewindBenefitOrderSession(id)
      assert.equal(rewound.product?.protocol, undefined)
      assert.ok(rewound.orderSmsCooldownSeconds > 0, 'back preserves SMS cooldown')
      await selectBenefitProduct(id, [next.code])
      await assert.rejects(sendBenefitOrderSms(id, true), /频繁/)
      deleteBenefitOrderSession(id)
      const id2 = await login(variant)
      await prepareBenefitProduct(id2); await selectBenefitProduct(id2, [next.code]); await sendBenefitOrderSms(id2, true)
      const result = await confirmBenefitOrder({ id: id2, code: '123456', acceptedProtocol: true, confirmationText: '确认订购' })
      assert.equal(result.result.success, true)
      assert.equal(calls.at(-1)?.path, 'pkg/order/combineProductChange')
      assert.equal(calls.at(-1)?.body.productCode, next.code)
      assert.equal(calls.at(-1)?.body.pcardPasswd, config.mainProductCode)
      if (variant === 'deluxe') assert.match(String(calls.at(-1)?.body.mobile), /\*{4}/)
      currentBenefit = next.code; await prepareBenefitProduct(id2); deleteBenefitOrderSession(id2)
    }
  }

  mainOrdered = false; currentBenefit = ''
  const id = await login('standard')
  let release!: () => void
  gate = new Promise<void>((resolve) => { release = resolve })
  const first = prepareBenefitProduct(id)
  await assert.rejects(prepareBenefitProduct(id), /正在进行/)
  assert.throws(() => deleteBenefitOrderSession(id), /正在进行/)
  gate = undefined; release(); await first
  protocolMissing = true
  await assert.rejects(selectBenefitProduct(id, ['100000096334']), /协议/)
  protocolMissing = false
  await selectBenefitProduct(id, ['100000096334'])
  mainOrdered = true
  await assert.rejects(sendBenefitOrderSms(id, true), (e: { code: string }) => e.code === 'BAG_RELATION_CHANGED')
  mainOrdered = false
  await sendBenefitOrderSms(id, true)
  mainOrdered = true
  await assert.rejects(confirmBenefitOrder({ id, code: '123456', acceptedProtocol: true, confirmationText: '确认订购' }), /关系已变化/)
  mainOrdered = false
  orderReply = '<html>模拟响应损坏</html>'
  const uncertain = await confirmBenefitOrder({ id, code: '123456', acceptedProtocol: true, confirmationText: '确认订购' })
  assert.equal(uncertain.result.uncertain, true)
  await assert.rejects(prepareBenefitProduct(id), /上次办理/)
  deleteBenefitOrderSession(id)

  const expiredId = await login('deluxe')
  loginExpired = true
  await assert.rejects(prepareBenefitProduct(expiredId), (e: { code: string; status: number }) => e.code === 'COC_LOGIN_EXPIRED' && e.status === 410)
  loginExpired = false; deleteBenefitOrderSession(expiredId)

  // Same phone across independent sessions: cooldown cannot be bypassed by restart,
  // and only one in-flight/accepted order may proceed until relation confirms it.
  mainOrdered = false; currentBenefit = ''; orderReply = { code: '0' }
  let fakeNow = Date.now()
  const clock = mock.method(Date, 'now', () => fakeNow)
  try {
    const phone = '13900005000'
    const firstId = await login('standard', phone)
    const restarted = await createLuckyBagSession({ ownerKey: 'user:mock', phone, bagVariant: 'deluxe' })
    assert.ok(restarted.loginSmsCooldownSeconds > 0)
    await assert.rejects(sendBenefitLoginSms(restarted.id), (e: { code: string }) => e.code === 'SMS_COOLDOWN')
    deleteBenefitOrderSession(restarted.id)
    await prepareBenefitProduct(firstId); await selectBenefitProduct(firstId, ['100000096334']); await sendBenefitOrderSms(firstId, true)
    fakeNow += 61_000
    const secondId = await login('standard', phone)
    await prepareBenefitProduct(secondId); await selectBenefitProduct(secondId, ['100000096337']); await sendBenefitOrderSms(secondId, true)
    let allowOrder!: () => void
    gate = new Promise<void>((resolve) => { allowOrder = resolve })
    const oneOrder = confirmBenefitOrder({ id: firstId, code: '123456', acceptedProtocol: true, confirmationText: '确认订购' })
    await assert.rejects(confirmBenefitOrder({ id: secondId, code: '123456', acceptedProtocol: true, confirmationText: '确认订购' }), (e: { code: string }) => e.code === 'ORDER_IN_FLIGHT')
    gate = undefined; allowOrder(); await oneOrder
    await assert.rejects(confirmBenefitOrder({ id: secondId, code: '123456', acceptedProtocol: true, confirmationText: '确认订购' }), (e: { code: string }) => e.code === 'BAG_ORDER_PENDING')
    deleteBenefitOrderSession(firstId); deleteBenefitOrderSession(secondId)
  } finally { clock.mock.restore() }

  missingUserId = true
  await assert.rejects(login('deluxe'), /缺少独立登录凭证/)
  log.mock.restore()
  console.log(`lucky-bag-unit: ${count} benefit mappings, main/benefit/change flows, Meteor, permissions, cooldown, concurrency and uncertain results passed (mock only)`)
} finally { transport.mock.restore(); rsaObserver.mock.restore(); log.mock.restore() }

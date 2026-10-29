import test from 'node:test'
import assert from 'node:assert/strict'
import { createXywAdapter, xywInternals } from '../src/services/quickOrders/adapters/xyw.js'
import { QuickOrderService } from '../src/services/quickOrders/service.js'

const RESPONSES = {
  loginSms: { success: true, data: { code: '200', msg: '短信验证码发送成功！' } },
  login: { success: true, data: { code: '200', msg: '登录成功！', obj: { headerName: 'vgop_mkt_web_token', phone: '13800138000', token: 'session-token-value' } } },
  status: { success: true, data: { code: '200', msg: '操作成功', obj: { status: 1 } } },
  product: { success: true, data: { code: '200', msg: '操作成功', obj: [{ productCode: xywInternals.PRODUCT_CODE, offerId: '111603010506', productName: '咪咕视频会员年包合约', descr: '<p>0元/年，立即生效，有效期12个月。</p>' }] } },
  rule: { success: true, data: { code: '200', msg: '操作成功', obj: { result: true } } },
  confirmInfo: { success: true, data: { code: '200', msg: '操作成功', obj: { phone: '13800138000', product_name: '咪咕视频会员年包合约（方案编号：24BJ200850）', full_descr: '<p>产品资费：0元/年</p><p>立即订购，立即生效</p>' } } },
  orderSms: { success: true, data: { code: '200', msg: '短信验证码发送成功！' } },
  order: { success: true, data: { code: '200', msg: '操作成功', obj: { result: 'true' } } },
}

function jsonResponse(value) {
  return { status: 200, data: JSON.stringify(value), headers: {} }
}

function mockXyw({ finalResponse = RESPONSES.order, failFinal = false, failOrderSms = false } = {}) {
  const calls = []
  const browserCalls = []
  const loginCookies = [{ name: 'BMCC_MKT', value: 'browser-issued-value', domain: 'xyw.bj.10086.cn', path: '/', secure: true, httpOnly: false, sameSite: 'Lax', expires: -1 }]
  const loginStorageState = { cookies: loginCookies, origins: [{ origin: xywInternals.ORIGIN, localStorage: [{ name: 'c', value: '173' }] }] }
  const browserFlow = {
    async sendLoginSms(input) {
      browserCalls.push({ action: 'sendLoginSms', ...input })
      return { response: JSON.stringify(RESPONSES.loginSms), cookies: loginCookies, storageState: loginStorageState }
    },
    async verifyLogin(input) {
      browserCalls.push({ action: 'verifyLogin', ...input })
      return { response: JSON.stringify(RESPONSES.login), cookies: loginCookies, storageState: loginStorageState }
    },
  }
  const request = async (options) => {
    const path = new URL(options.url).pathname
    const body = JSON.parse(options.data)
    const cookie = await options.jar.getCookieString(options.url)
    calls.push({ ...options, path, body, cookie })
    if (failFinal && path.endsWith('/marketInfo/marketOrder')) {
      const error = new Error('socket hang up')
      error.code = 'ECONNRESET'
      throw error
    }
    if (failOrderSms && path.endsWith('/orderConfirm/sendOrderConfirmVerifyCode')) {
      const error = new Error('socket hang up')
      error.code = 'ECONNRESET'
      throw error
    }
    if (path.endsWith('/marketInfo/getMarketStatus')) return jsonResponse(RESPONSES.status)
    if (path.endsWith('/productInfo/getProductInfo')) return jsonResponse(RESPONSES.product)
    if (path.endsWith('/marketRule/getMarketRule')) return jsonResponse(RESPONSES.rule)
    if (path.endsWith('/orderConfirm/getMarketProInfo')) return jsonResponse(RESPONSES.confirmInfo)
    if (path.endsWith('/orderConfirm/sendOrderConfirmVerifyCode')) return jsonResponse(RESPONSES.orderSms)
    if (path.endsWith('/marketInfo/marketOrder')) return jsonResponse(finalResponse)
    throw new Error(`Unexpected mock request ${path}`)
  }
  const adapter = createXywAdapter({ request, browserFlow })
  const service = new QuickOrderService({ adapters: { xyw: adapter }, logger: async () => {} })
  return { service, calls, browserCalls, loginStorageState }
}

function mockXywWithLoginPhone(phone) {
  const fixture = mockXyw()
  fixture.service.adapters.xyw = createXywAdapter({
    request: async (options) => {
      const path = new URL(options.url).pathname
      if (path.endsWith('/marketInfo/getMarketStatus')) return jsonResponse(RESPONSES.status)
      if (path.endsWith('/productInfo/getProductInfo')) return jsonResponse(RESPONSES.product)
      if (path.endsWith('/marketRule/getMarketRule')) return jsonResponse(RESPONSES.rule)
      if (path.endsWith('/orderConfirm/getMarketProInfo')) return jsonResponse(RESPONSES.confirmInfo)
      throw new Error(`Unexpected mock request ${path}`)
    },
    browserFlow: {
      async sendLoginSms() {
        return { response: JSON.stringify(RESPONSES.loginSms), cookies: [], storageState: { cookies: [], origins: [] } }
      },
      async verifyLogin() {
        const response = { ...RESPONSES.login, data: { ...RESPONSES.login.data, obj: { ...RESPONSES.login.data.obj, phone } } }
        return { response: JSON.stringify(response), cookies: [], storageState: { cookies: [], origins: [] } }
      },
    },
  })
  return fixture.service
}

async function authenticated(service) {
  const created = await service.create({ platform: 'xyw', auth: { phone: '13800138000' } })
  const sent = await service.sendAuthSms(created.id)
  const verified = await service.verifyAuth(created.id, { smsCode: '123456' })
  return { id: created.id, created, sent, verified }
}

async function selected(service) {
  const state = await authenticated(service)
  const prepared = await service.prepare(state.id)
  const selection = await service.select(state.id, xywInternals.PRODUCT_CODE)
  return { ...state, prepared, selection }
}

test('xyw requires a separate encrypted login SMS flow before product selection', async () => {
  const { service, calls, browserCalls, loginStorageState } = mockXyw()
  const created = await service.create({ platform: 'xyw', auth: { phone: '13800138000' } })
  assert.equal(created.businessId, 'migu-video-year')
  assert.equal(created.stage, 'LOGIN_REQUIRED')
  assert.equal(created.maskedPhone, '138****8000')
  await assert.rejects(() => service.prepare(created.id), /不能重新读取产品/)

  const sent = await service.sendAuthSms(created.id)
  assert.equal(sent.stage, 'LOGIN_SMS_SENT')
  assert.equal(calls.length, 0)
  assert.equal(browserCalls.length, 1)
  assert.equal(browserCalls[0].action, 'sendLoginSms')
  assert.equal(browserCalls[0].phone, '13800138000')
  assert.equal(browserCalls[0].storageState, null)

  const verified = await service.verifyAuth(created.id, { smsCode: '123456' })
  assert.equal(verified.stage, 'AUTHENTICATED')
  assert.equal(verified.authSummary, 'xyw.bj 短信登录已认证')
  assert.equal(browserCalls.length, 2)
  assert.equal(browserCalls[1].action, 'verifyLogin')
  assert.equal(browserCalls[1].smsCode, '123456')
  assert.equal(browserCalls[1].storageState, loginStorageState)
  assert.equal('privateContext' in verified, false)
})

test('xyw starts every order with an isolated official-page login state', async () => {
  const first = mockXyw()
  const second = mockXyw()
  const firstSession = await first.service.create({ platform: 'xyw', auth: { phone: '13800138000' } })
  const secondSession = await second.service.create({ platform: 'xyw', auth: { phone: '13800138000' } })
  await first.service.sendAuthSms(firstSession.id)
  await second.service.sendAuthSms(secondSession.id)
  assert.equal(first.browserCalls[0].storageState, null)
  assert.equal(second.browserCalls[0].storageState, null)
})

test('xyw accepts a successful token response with a non-canonical phone but keeps the strict pre-order phone guard', async () => {
  const service = mockXywWithLoginPhone('15200004812')
  const created = await service.create({ platform: 'xyw', auth: { phone: '13800138000' } })
  await service.sendAuthSms(created.id)
  const verified = await service.verifyAuth(created.id, { smsCode: '123456' })
  assert.equal(verified.stage, 'AUTHENTICATED')
  assert.equal(verified.maskedPhone, '138****8000')
  await service.prepare(created.id)
  await service.select(created.id, xywInternals.PRODUCT_CODE)

  const guarded = mockXywWithLoginPhone('15200004812')
  const guardedCreated = await guarded.create({ platform: 'xyw', auth: { phone: '13900139000' } })
  await guarded.sendAuthSms(guardedCreated.id)
  await guarded.verifyAuth(guardedCreated.id, { smsCode: '123456' })
  await guarded.prepare(guardedCreated.id)
  await assert.rejects(
    () => guarded.select(guardedCreated.id, xywInternals.PRODUCT_CODE),
    /已阻止发送订购验证码/,
  )
})

test('xyw follows the captured product, rule, confirmation, order SMS and final order contract', async () => {
  const { service, calls } = mockXyw()
  const { id, prepared, selection } = await selected(service)
  assert.equal(prepared.product.eligible, true)
  assert.deepEqual(prepared.product.options.map((item) => item.id), [xywInternals.PRODUCT_CODE])
  assert.match(selection.product.protocol.content, /0元\/年/)
  const authenticatedCall = calls.find((item) => item.path.endsWith('/productInfo/getProductInfo') && item.headers.vgop_mkt_web_token === 'session-token-value')
  assert.equal(authenticatedCall.headers.vgop_mkt_web_token, 'session-token-value')

  const confirmation = { agreed: true, realOrderConfirmed: true, confirmationId: 'xyw_confirm_123456' }
  assert.equal((await service.sendSms(id, confirmation)).stage, 'SMS_SENT')
  const smsCall = calls.find((item) => item.path.endsWith('/orderConfirm/sendOrderConfirmVerifyCode'))
  assert.deepEqual(smsCall.body, {
    productCode: xywInternals.PRODUCT_CODE,
    mktCode: xywInternals.MKT_CODE,
    channelCode: xywInternals.CHANNEL_CODE,
  })
  assert.equal(smsCall.maxAttempts, 1)

  const result = await service.confirm(id, { ...confirmation, smsCode: '654321' })
  assert.equal(result.session.stage, 'FINISHED')
  const finalCall = calls.find((item) => item.path.endsWith('/marketInfo/marketOrder'))
  assert.deepEqual(finalCall.body, {
    mktCode: xywInternals.MKT_CODE,
    productCode: xywInternals.PRODUCT_CODE,
    verifyCode: '654321',
    channelCode: xywInternals.CHANNEL_CODE,
  })
  assert.equal(finalCall.maxAttempts, 1)
})

test('xyw verification errors stay recoverable while an ambiguous final response becomes UNKNOWN', async () => {
  const invalidCode = { success: false, data: { code: '210', msg: '验证码错误' } }
  const recoverable = mockXyw({ finalResponse: invalidCode })
  const ready = await selected(recoverable.service)
  const confirmation = { agreed: true, realOrderConfirmed: true, confirmationId: 'xyw_confirm_123456' }
  await recoverable.service.sendSms(ready.id, confirmation)
  await assert.rejects(() => recoverable.service.confirm(ready.id, { ...confirmation, smsCode: '000000' }), /验证码错误/)
  assert.equal(recoverable.service.read(ready.id).stage, 'SMS_SENT')

  const ambiguous = mockXyw({ failFinal: true })
  const second = await selected(ambiguous.service)
  await ambiguous.service.sendSms(second.id, confirmation)
  const result = await ambiguous.service.confirm(second.id, { ...confirmation, smsCode: '654321' })
  assert.equal(result.session.stage, 'UNKNOWN')
  assert.equal(result.session.lastResult.retryAllowed, false)
})

test('an ambiguous order-SMS response enters cooldown instead of allowing an immediate duplicate send', async () => {
  const { service } = mockXyw({ failOrderSms: true })
  const { id } = await selected(service)
  const confirmation = { agreed: true, realOrderConfirmed: true, confirmationId: 'xyw_confirm_123456' }
  const result = await service.sendSms(id, confirmation)
  assert.equal(result.stage, 'SMS_SENT')
  assert.ok(result.smsCooldownSeconds > 0)
  await assert.rejects(() => service.sendSms(id, confirmation), /秒后重发短信/)
})

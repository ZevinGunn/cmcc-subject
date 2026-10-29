import { CookieJar } from 'tough-cookie'
import { requestWithJar } from '../../../utils/http.js'
import { QuickOrderError } from '../errors.js'
import { array, beijingTime, maskPhone, parseNestedJson, record, text } from './common.js'
import { retailAuthDecrypt, retailAuthEncrypt, retailWireDecrypt, retailWireEncrypt } from './retailCrypto.js'

const ORIGIN = 'https://wx.10086.cn'
const BASE = `${ORIGIN}/website/nrapigate/`
const PERSONAL_PAGE_ID = '2026042315380104102006140'

async function loadCookie(jar, cookie) {
  for (const item of String(cookie || '').split(';')) {
    const index = item.indexOf('=')
    if (index <= 0) continue
    const name = item.slice(0, index).trim()
    const value = item.slice(index + 1).trim()
    if (name && value) await jar.setCookie(`${name}=${value}; Path=/; Domain=wx.10086.cn; Secure`, ORIGIN)
  }
}

function parseJson(value, label) {
  try {
    return typeof value === 'string' ? JSON.parse(value) : value
  } catch {
    throw new QuickOrderError(`${label}返回格式无法解析`, 'RETAIL_RESPONSE_FORMAT', 424)
  }
}

function headers(context, auth = false) {
  return {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json; charset=UTF-8',
    Origin: ORIGIN,
    Referer: `${ORIGIN}/website/businessPlatform/newCustomShopDetail?personalPageId=${PERSONAL_PAGE_ID}`,
    'User-Agent': context.userAgent,
    channelid: 'BUSINESS_H5',
    'x-app-version': auth ? '1.0.1' : '1.0.2',
    ...(auth ? { 'chop-real-host': 'wx.10086.cn', pageType: 'xds18' } : {}),
    ...(context.authorization ? { Authorization: context.authorization } : {}),
    ...(context.secondChannel ? { 'Chop-Second-Channel': context.secondChannel } : {}),
  }
}

async function authRequest(context) {
  const res = await requestWithJar({
    jar: context.jar, url: `${BASE}nrauth/auth/encryt/userAuth`, method: 'POST', headers: headers(context, true),
    data: retailAuthEncrypt({ backUrl: `/website/businessPlatform/newCustomShopDetail?personalPageId=${PERSONAL_PAGE_ID}` }), maxAttempts: 2,
  })
  if (res.status < 200 || res.status >= 300) throw new QuickOrderError(`中移商城 SSO HTTP ${res.status}`, 'RETAIL_SSO_HTTP', 424)
  const outer = parseJson(res.data, '中移商城 SSO')
  const payload = parseJson(retailAuthDecrypt(text(outer.body, 200000)), '中移商城 SSO')
  ensureSuccess(payload, '中移商城 SSO 失败')
  return payload
}

async function retailRequest(context, path, body, { final = false } = {}) {
  const res = await requestWithJar({
    jar: context.jar, url: new URL(path, BASE).toString(), method: 'POST', headers: headers(context),
    data: retailWireEncrypt(body), maxAttempts: final ? 1 : 2, timeout: final ? 30_000 : 20_000,
  })
  if (res.status < 200 || res.status >= 300) throw new QuickOrderError(`中移商城接口 HTTP ${res.status}`, 'RETAIL_UPSTREAM_HTTP', 424, final ? { uncertain: true } : {})
  try {
    const outer = parseJson(res.data, '中移商城接口')
    if (!outer.body) throw new Error('响应缺少加密正文')
    return parseJson(retailWireDecrypt(outer.body), '中移商城接口')
  } catch (error) {
    if (final) throw new QuickOrderError('中移商城最终响应格式无法确认', 'RETAIL_FINAL_RESPONSE_UNKNOWN', 424, { uncertain: true })
    throw error
  }
}

function ensureSuccess(payload, fallback) {
  if (text(payload?.returnCode, 80) !== '0') throw new QuickOrderError(text(payload?.returnMessage, 500) || fallback, text(payload?.returnCode, 80) || 'RETAIL_REJECTED', 424)
}

function resolvePhone(value) {
  const source = text(value, 500)
  if (/^1\d{10}$/.test(source)) return source
  if (!/^[A-Fa-f0-9]+$/.test(source) || source.length % 32 !== 0) return ''
  try {
    const decrypted = retailAuthDecrypt(source)
    if (/^1\d{10}$/.test(decrypted)) return decrypted
    const parsed = JSON.parse(decrypted)
    return typeof parsed === 'string' && /^1\d{10}$/.test(parsed) ? parsed : ''
  } catch {
    return ''
  }
}

function collectNormIds(value, output = new Set(), depth = 0) {
  if (depth > 8 || value == null) return output
  if (Array.isArray(value)) value.forEach((item) => collectNormIds(item, output, depth + 1))
  else if (typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      if (key === 'normId' && /^\d{1,20}$/.test(text(item, 30))) output.add(text(item, 30))
      else collectNormIds(item, output, depth + 1)
    }
  }
  return output
}

function protocolFrom(value) {
  const root = record(value)
  const candidates = [value, ...array(root.protocolList), ...array(root.backstopProtocolList)].map(record)
  const item = candidates.find((entry) => entry.id || entry.ptId || entry.protocolId || entry.protocolSequenceId || entry.protocolContent)
  if (!item) return null
  return {
    name: text(item.protocolName || item.name, 200) || '业务受理协议',
    content: text(item.protocolContent || item.content, 20000),
    id: text(item.protocolSequenceId || item.protocolId || item.ptId || item.id, 100),
    idType: item.protocolSequenceId ? 'protocolSequenceId' : 'ptId',
  }
}

function eligibilityFrom(value) {
  let current = parseNestedJson(value)
  if (record(current).data !== undefined) current = parseNestedJson(record(current).data)
  const item = record(current)
  return { eligible: text(item.status, 30) === '0', message: text(item.message, 500) || '资格预校验完成' }
}

export const retailAdapter = {
  async create({ auth, userAgent }) {
    const cookie = text(auth?.cookie, 20000)
    if (cookie.length < 8) throw new QuickOrderError('请输入当前中移商城 Cookie', 'RETAIL_COOKIE_REQUIRED', 400)
    const context = { jar: new CookieJar(), authorization: '', secondChannel: '', phone: '', provinceCode: '', cityCode: '', userAgent, norms: new Map(), personalPageId: PERSONAL_PAGE_ID }
    await loadCookie(context.jar, cookie)
    const payload = await authRequest(context)
    const userInfo = record(record(payload.data).userInfo)
    context.authorization = text(record(payload.data).token || userInfo.token, 5000)
    context.phone = resolvePhone(userInfo.telephone || userInfo.aesTelNum)
    context.provinceCode = text(userInfo.provinceCode, 30)
    context.cityCode = text(userInfo.cityCode, 30)
    context.secondChannel = text(userInfo.secondChannel, 100)
    if (!context.authorization || !context.phone) throw new QuickOrderError('中移商城 SSO 未返回有效账号信息', 'RETAIL_SSO_INVALID', 424)
    return { privateContext: context, publicContext: { maskedPhone: maskPhone(context.phone), authSummary: '商城 SSO 已认证' } }
  },

  async prepare(context) {
    const page = await retailRequest(context, 'nrmix/product/newProductPersonalPageById', { id: context.personalPageId, appFlag: 0 })
    ensureSuccess(page, '中移商城商品页查询失败')
    const pageData = record(page.data)
    context.productId = text(pageData.productId, 30) || '2180820'
    context.productCode = text(pageData.productCode, 30) || '12287504'
    const ids = [...collectNormIds(pageData)]
    if (!ids.length) ids.push('2285851')
    const options = []
    for (const id of ids.slice(0, 20)) {
      const payload = await retailRequest(context, 'nrmix/product/norm', { normId: id })
      ensureSuccess(payload, '中移商城规格查询失败')
      const norm = record(payload.data)
      context.norms.set(text(norm.id || norm.normId, 30) || id, norm)
      options.push({
        id: text(norm.id || norm.normId, 30) || id,
        name: text(norm.name || norm.specBaseNm, 200) || `规格 ${id}`,
        feeText: Number.isFinite(Number(norm.price)) ? `${Number(norm.price) / 100} 元` : '以实时规则为准',
      })
    }
    return {
      name: text(pageData.pageName || pageData.productName, 200) || '欢畅流量翻番',
      code: context.productCode,
      description: '中移商城个性化商品页实时返回的欢畅流量翻番业务。',
      eligible: true,
      eligibilityMessage: '已读取实时商品，选择档位后执行资格预校验',
      options,
      protocol: null,
      warnings: ['最终资格、承诺消费和生效规则以所选规格的实时预校验与协议为准。'],
    }
  },

  async select(context, option) {
    const norm = context.norms.get(option.id)
    if (!norm) throw new QuickOrderError('所选商城规格已失效，请重新读取产品', 'RETAIL_NORM_STALE', 409)
    const protocolPayload = await retailRequest(context, 'nrproduct/atom/protocol/queryProtocol', {
      provinceCode: context.provinceCode, productCode: Number(context.productCode), queryType: '', normId: Number(option.id), cityCode: context.cityCode,
    })
    ensureSuccess(protocolPayload, '中移商城协议查询失败')
    context.protocol = protocolFrom(protocolPayload.data)
    const precheckPayload = await retailRequest(context, 'nrmix/preCheck/productPreCheck', {
      packageId: text(norm.productCode, 60), isMain: 0, shopProvinceCode: context.provinceCode,
      busiEffectType: text(norm.busiEffectType, 80) || 'Type_Default', specialOfferType: Number(norm.specialOfferType || 0),
      preCheckType: text(norm.preCheckTypes || norm.preCheckType, 30) || '2', productCode: Number(context.productCode),
      normId: Number(option.id), bizIntfCode: text(norm.bizIntfCode, 100), touchCode: '', shopPageId: '', productPersonalPageId: context.personalPageId,
    })
    ensureSuccess(precheckPayload, '中移商城资格预校验失败')
    const eligibility = eligibilityFrom(precheckPayload.data)
    context.selectedNorm = norm
    context.selectedNormId = option.id
    context.effectType = text(norm.busiEffectType, 80) || 'Type_Default'
    context.eligible = eligibility.eligible
    return {
      id: option.id, name: option.name, feeText: option.feeText, effectText: context.effectType,
      eligible: eligibility.eligible, eligibilityMessage: eligibility.message, protocol: context.protocol,
    }
  },

  async sendSms(context) {
    if (!context.selectedNormId) throw new QuickOrderError('请先选择商城规格', 'RETAIL_SELECTION_REQUIRED', 409)
    if (!context.eligible) throw new QuickOrderError('该规格资格预校验未通过，系统不会发送订购短信', 'RETAIL_NOT_ELIGIBLE', 409)
    const payload = await retailRequest(context, 'nrmix/sms/sendSms', { busiId: '2', normIds: context.selectedNormId, userEffectType: context.effectType })
    ensureSuccess(payload, '中移商城订购短信发送失败')
    const data = record(payload.data)
    if (text(data.status, 30) && text(data.status, 30) !== '0') throw new QuickOrderError(text(data.message, 500) || '中移商城订购短信发送失败', text(data.status, 80), 424)
    context.bookTime = beijingTime()
    return { message: '中移商城订购验证码已发送。' }
  },

  async confirm(context, smsCode) {
    const protocolFields = context.protocol?.id ? { [context.protocol.idType]: context.protocol.id } : {}
    const payload = await retailRequest(context, 'nrmix/order/createOrder', {
      agentid: '', tuikeInfo: '', shopid: '', normid: Number(context.selectedNormId), ordertype: 1, staffId: '',
      timeSpan: Date.now(), password: smsCode, selectedCouponId: '', productId: Number(context.productId), productCode: Number(context.productCode),
      serialId: '', processmethod: 'productOrder', redCode: '', rcmSrc: '', fromRecommend: '', recommendTraceId: '',
      employeeId: '', employeeProvinceId: '', sendResultComp: '', sendResultId: '', sendResultType: '', sendResultAtyCode: '',
      cmgSmsCode: smsCode, verifyCode: smsCode, productPersonalPageId: context.personalPageId, confirmTime: beijingTime(),
      sellerId: '', posterPhone: '', extendParams: [{ type: 'newPersonalId', content: context.personalPageId }], bookTime: context.bookTime,
      userEffectType: context.effectType, ...protocolFields,
    }, { final: true })
    const code = text(payload.returnCode, 80) || 'RETAIL_REJECTED'
    if (code === 'SMS_9999') throw new QuickOrderError(text(payload.returnMessage, 500) || '短信验证码不正确', code, 400, { recoverable: true })
    if (code === 'A00012') return { accepted: true, uncertain: true, code, message: '商城已收到请求但结果未确认，请通过官方渠道核验。' }
    const accepted = code === '0'
    const data = record(payload.data)
    return { accepted, uncertain: false, code, message: text(payload.returnMessage, 500) || (accepted ? '中移商城已受理业务订购请求。' : '中移商城未受理业务订购请求。'), orderId: text(data.orderNumber, 100) || undefined }
  },
}

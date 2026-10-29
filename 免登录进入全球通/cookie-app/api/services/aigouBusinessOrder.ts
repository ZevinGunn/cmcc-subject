import crypto from 'node:crypto'
import { httpsRequestText } from './cmccHttp.js'
import { mergeCookieWithSetCookie, parseCookieHeader } from './cookieUtils.js'
import type { AigouSessionRecord } from './accountsStore.js'

const AIGOU_ORIGIN = 'https://dev.coc.10086.cn'
const LAYOUT_ORIGIN = 'https://res.coc.10086.cn/res/cdn/coc1/fixedPath'
const RISK_DEVICE_TOKEN_URL = 'https://yxfk.market.chinamobile.com:8081/mgt/decision-engine/udid/c1?'
const DEFAULT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'
const SMS_SKU_KEY = Buffer.from('72fc912ce498430d', 'utf8')
const ORDER_FIELD_KEY = Buffer.from('a4jdiq597p3gls0r', 'utf8')
export const AIGOU_GENERIC_DEFAULTS = {
  channelCode: 'P00000139704',
  selfChannelCode: 'P00000139704',
  referer: 'bojinyear',
} as const

type JsonRecord = Record<string, unknown>

export type AigouOrderMode = 'rights' | 'package'

export type AigouProductInput = {
  code: string
  skuId: string
  name?: string
  orderMode: AigouOrderMode
  channelCode: string
  selfChannelCode: string
  referer: string
  activityId?: string
  productCode?: string
  pageId?: string
  touchCode?: string
  protocolSequenceId?: string
  smsCodeTypeEnum?: string
}

export type AigouProduct = AigouProductInput & {
  name: string
  pageId?: string
  pageTitle?: string
  price?: number
  originPrice?: number
  agreementName?: string
  agreementContent?: string
  skuType?: unknown
  genericContext: boolean
  source: 'layout' | 'input'
}

export type AigouOrderResult = {
  success: boolean
  resultCode: string
  message: string
  data?: unknown
  response: unknown
  precheck: {
    success: boolean
    resultCode: string
    message: string
    isBlackList?: boolean
    response?: unknown
  }
  riskPreparation?: AigouRiskPreparation
  attempted: boolean
}

export type AigouSmsResult = {
  success: boolean
  resultCode: string
  message: string
  response: unknown
  cooldownSeconds: 60
}

export type AigouRiskPreparation = {
  deviceToken: 'provided' | 'generated' | 'unavailable'
  wasmParams: 'provided' | 'unavailable'
  operDfp: 'provided' | 'session-cookie' | 'unavailable'
  tokenResultCode?: string
  tokenMessage?: string
}

export type AigouRiskContext = {
  grRiskP1?: string
  grRiskP2?: string
  grRiskP3?: string
  wasmParams?: string
  operDfp?: string
}

export const AIGOU_PRODUCT_PRESETS: AigouProductInput[] = [
  { code: 'mzonebojindg', name: '铂金会员校园版', skuId: '26804', orderMode: 'rights', channelCode: 'P00000151769', selfChannelCode: 'P00000151769', referer: 'mzonebojindg', activityId: '17466' },
  { code: 'bojinbyhb', name: '铂金会员优惠版', skuId: '', orderMode: 'rights', channelCode: 'P00000151769', selfChannelCode: 'P00000151769', referer: 'bojinbyhb' },
  { code: 'bojinbnbyhb', name: '铂金会员半年包优惠版', skuId: '', orderMode: 'rights', channelCode: 'P00000151769', selfChannelCode: 'P00000151769', referer: 'bojinbnbyhb' },
  { code: 'bojinyearyhb', name: '铂金会员年包优惠版', skuId: '', orderMode: 'rights', channelCode: 'P00000151769', selfChannelCode: 'P00000151769', referer: 'bojinyearyhb' },
  { code: 'bojinyear', name: '铂金会员年包', skuId: '77626', orderMode: 'rights', channelCode: 'P00000139704', selfChannelCode: 'P00000139704', referer: 'bojinyear' },
  { code: 'sxxshzgb', name: '随心选生活折扣包', skuId: '34622', orderMode: 'rights', channelCode: 'P00000139704', selfChannelCode: 'P00000139704', referer: 'sxxshzgb' },
  { code: 'xbklhhy', name: '星巴克联合会员', skuId: '100000098326', productCode: '100000098326', pageId: '1878635095121567744', protocolSequenceId: '2071296758389432320', orderMode: 'package', channelCode: 'P00000132000', selfChannelCode: 'P00000132000', touchCode: 'P00000132000', referer: 'xbklhhy', smsCodeTypeEnum: '505' },
]

export class AigouOrderError extends Error {
  readonly code: string
  readonly status: number
  readonly response?: unknown

  constructor(message: string, code = 'AIGOU_ORDER_ERROR', status = 424, response?: unknown) {
    super(message)
    this.name = 'AigouOrderError'
    this.code = code
    this.status = status
    this.response = response
  }
}

function asRecord(value: unknown): JsonRecord | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : undefined
}

function text(value: unknown): string {
  return value === null || value === undefined ? '' : String(value).trim()
}

function resultCode(payload: JsonRecord | undefined): string {
  return text(payload?.resultCode ?? payload?.code)
}

function resultMessage(payload: JsonRecord | undefined, fallback: string): string {
  return text(payload?.msg ?? payload?.message ?? payload?.resultMsg) || fallback
}

function parseJson(value: string): JsonRecord {
  try {
    const parsed = JSON.parse(value) as unknown
    const record = asRecord(parsed)
    if (record) return record
  } catch {
    // Normalized below.
  }
  throw new AigouOrderError('爱购商城返回了无法解析的响应', 'INVALID_UPSTREAM_RESPONSE', 502)
}

function identifier(value: unknown, field: string, required = true): string {
  const result = text(value)
  if (!result && !required) return ''
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(result)) {
    throw new AigouOrderError(`${field} 格式不正确`, 'INVALID_PARAMETER', 400)
  }
  return result
}

export function normalizeProductInput(value: Partial<AigouProductInput>): AigouProductInput {
  const requestedCode = identifier(value.code, '页面 code', false)
  const requestedSkuId = identifier(value.skuId, 'skuId', false)
  const preset = requestedSkuId
    ? AIGOU_PRODUCT_PRESETS.find((item) => item.skuId === requestedSkuId)
    : AIGOU_PRODUCT_PRESETS.find((item) => requestedCode && item.code === requestedCode)
  const code = requestedCode || preset?.code || ''
  const skuId = requestedSkuId || preset?.skuId || ''
  if (!code && !skuId) throw new AigouOrderError('页面 code 与 skuId 至少填写一项', 'PRODUCT_REQUIRED', 400)
  const orderMode = preset?.orderMode || value.orderMode || 'rights'
  if (orderMode !== 'rights' && orderMode !== 'package') {
    throw new AigouOrderError('orderMode 格式不正确', 'INVALID_PARAMETER', 400)
  }
  const fallback = orderMode === 'rights' ? AIGOU_GENERIC_DEFAULTS : undefined
  const channelCode = identifier(value.channelCode || preset?.channelCode || fallback?.channelCode, 'channelCode')
  return {
    code,
    skuId,
    name: text(value.name || preset?.name) || undefined,
    orderMode,
    channelCode,
    selfChannelCode: identifier(value.selfChannelCode || preset?.selfChannelCode || channelCode, 'selfChannelCode'),
    referer: identifier(value.referer || preset?.referer || code || fallback?.referer, 'referer'),
    activityId: identifier(value.activityId || preset?.activityId, 'activityId', false) || undefined,
    productCode: identifier(value.productCode || preset?.productCode, 'productCode', false) || undefined,
    pageId: identifier(value.pageId || preset?.pageId, 'pageId', false) || undefined,
    touchCode: identifier(value.touchCode || preset?.touchCode, 'touchCode', false) || undefined,
    protocolSequenceId: identifier(value.protocolSequenceId || preset?.protocolSequenceId, 'protocolSequenceId', false) || undefined,
    smsCodeTypeEnum: identifier(value.smsCodeTypeEnum || preset?.smsCodeTypeEnum, 'smsCodeTypeEnum', false) || undefined,
  }
}

function zeroPadEncrypt(value: string, key: Buffer): string {
  const input = Buffer.from(value, 'utf8')
  const padded = Buffer.alloc(Math.ceil(input.length / 16) * 16)
  input.copy(padded)
  const cipher = crypto.createCipheriv('aes-128-cbc', key, key)
  cipher.setAutoPadding(false)
  return Buffer.concat([cipher.update(padded), cipher.final()]).toString('base64')
}

export function encryptAigouSmsSku(skuId: string, timestamp = Date.now()): string {
  return zeroPadEncrypt(`${identifier(skuId, 'skuId')}_${timestamp}`, SMS_SKU_KEY)
}

export function encryptAigouOrderCode(smsCode: string): string {
  if (!/^\d{4,8}$/.test(smsCode)) {
    throw new AigouOrderError('请输入 4-8 位数字验证码', 'INVALID_SMS_CODE', 400)
  }
  return zeroPadEncrypt(smsCode, ORDER_FIELD_KEY)
}

function sanitize(value: unknown, depth = 0): unknown {
  if (depth > 5) return undefined
  if (value === null || value === undefined) return value
  if (typeof value === 'string') return value.replace(/1\d{10}/g, (phone) => `${phone.slice(0, 3)}****${phone.slice(-4)}`)
  if (typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map((item) => sanitize(item, depth + 1))
  const output: JsonRecord = {}
  for (const [key, item] of Object.entries(value as JsonRecord)) {
    if (/(cookie|token|ticket|phone|mobile|receiver|sms|dfp|fingerprint|wasm|risk)/i.test(key)) continue
    output[key] = sanitize(item, depth + 1)
  }
  return output
}

function flatten(value: unknown, output: JsonRecord[] = []): JsonRecord[] {
  if (Array.isArray(value)) {
    for (const item of value) flatten(item, output)
  } else if (value && typeof value === 'object') {
    const record = value as JsonRecord
    output.push(record)
    for (const item of Object.values(record)) flatten(item, output)
  }
  return output
}

function parseSpecify(value: unknown): JsonRecord | undefined {
  if (typeof value !== 'string') return asRecord(value)
  try { return asRecord(JSON.parse(value) as unknown) } catch { return undefined }
}

export function extractLayoutProduct(code: string, layout: JsonRecord): Partial<AigouProduct> {
  const specs = flatten(layout).map((item) => parseSpecify(item.specify)).filter(Boolean) as JsonRecord[]
  const order = specs.find((item) => {
    const name = text(item.name)
    return name === 'Rights-PictureMemberOrderComp'
      || name === 'Rights-PictureGoodsOrderComp'
      || name.includes('Order')
      || Boolean(text(item.vipSkuId ?? item.skuid ?? item.skuId ?? item.skuID))
  })
  return {
    code,
    skuId: text(order?.vipSkuId ?? order?.skuid ?? order?.skuId ?? order?.skuID),
    orderMode: 'rights',
    channelCode: text(layout.touchCode),
    selfChannelCode: text(layout.touchCode),
    referer: code,
    name: text(layout.name ?? layout.title),
    pageTitle: text(layout.title),
    pageId: text(layout.id),
    source: 'layout',
  }
}

export class AigouBusinessOrderClient {
  private sessionValue: AigouSessionRecord

  constructor(session: AigouSessionRecord) {
    this.sessionValue = { ...session }
  }

  get session(): AigouSessionRecord { return { ...this.sessionValue } }

  private referer(product: Pick<AigouProductInput, 'referer' | 'channelCode'>): string {
    const url = new URL(`/coc3/canvas/rightsmarket-h5-canvas/online/${encodeURIComponent(product.referer)}`, AIGOU_ORIGIN)
    url.searchParams.set('channelCode', product.channelCode)
    url.searchParams.set('pageRecorded', 'true')
    return url.toString()
  }

  private async request(path: string, options: {
    method?: 'GET' | 'POST'
    body?: unknown
    product: Pick<AigouProductInput, 'referer' | 'channelCode'>
    headers?: Record<string, string>
  }): Promise<JsonRecord> {
    const method = options.method || 'GET'
    const response = await httpsRequestText({
      url: new URL(path, AIGOU_ORIGIN).toString(),
      method,
      headers: {
        Cookie: this.sessionValue.cookie,
        phone: this.sessionValue.token,
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        Referer: this.referer(options.product),
        'User-Agent': DEFAULT_UA,
        ...(method === 'POST' ? { 'Content-Type': 'application/json;charset=UTF-8', Origin: AIGOU_ORIGIN } : {}),
        ...options.headers,
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      timeoutMs: 20_000,
    })
    const merged = mergeCookieWithSetCookie({ cookie: this.sessionValue.cookie, setCookie: response.headers['set-cookie'] })
    if (merged.changed) this.sessionValue = { ...this.sessionValue, cookie: merged.cookie }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      let upstream: unknown = response.bodyText
      try { upstream = sanitize(parseJson(response.bodyText)) } catch { upstream = sanitize(response.bodyText) }
      throw new AigouOrderError(`爱购商城上游返回 HTTP ${response.statusCode}`, 'UPSTREAM_HTTP_ERROR', 502, upstream)
    }
    return parseJson(response.bodyText)
  }

  private async fetchRiskDeviceToken(product: Pick<AigouProductInput, 'referer' | 'channelCode'>): Promise<{
    token: string
    resultCode: string
    message: string
  }> {
    const response = await httpsRequestText({
      url: RISK_DEVICE_TOKEN_URL,
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        Origin: AIGOU_ORIGIN,
        Referer: this.referer(product),
        'User-Agent': DEFAULT_UA,
      },
      timeoutMs: 10_000,
    })
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new AigouOrderError(`设备风险令牌接口返回 HTTP ${response.statusCode}`, 'RISK_TOKEN_HTTP_ERROR', 502)
    }
    const payload = parseJson(response.bodyText)
    const token = text(payload.data)
    if (!token) {
      throw new AigouOrderError(resultMessage(payload, '设备风险令牌接口未返回令牌'), 'RISK_TOKEN_EMPTY', 424)
    }
    return {
      token,
      resultCode: text(payload.status ?? payload.code),
      message: resultMessage(payload, '设备风险令牌已生成'),
    }
  }

  async resolveProduct(inputValue: Partial<AigouProductInput>): Promise<AigouProduct> {
    let input = normalizeProductInput(inputValue)
    if (input.orderMode !== 'rights') {
      throw new AigouOrderError('该商品使用 COC 套餐订购协议，请通过套餐订购流程办理', 'PACKAGE_ORDER_REQUIRED', 409)
    }
    let layout: Partial<AigouProduct> = { source: 'input' }
    if (input.code) {
      const url = `${LAYOUT_ORIGIN}/production.rightsmarket-h5-canvas.online.layout.${encodeURIComponent(input.code)}.json?tes=${Date.now()}`
      const response = await httpsRequestText({ url, method: 'GET', headers: { Accept: 'application/json,text/plain,*/*', Referer: `${AIGOU_ORIGIN}/`, 'User-Agent': DEFAULT_UA }, timeoutMs: 15_000 })
      if (response.statusCode >= 200 && response.statusCode < 300) layout = extractLayoutProduct(input.code, parseJson(response.bodyText))
      input = normalizeProductInput({
        ...input,
        skuId: text(layout.skuId) || input.skuId,
        channelCode: input.channelCode || text(layout.channelCode),
        selfChannelCode: input.selfChannelCode || text(layout.selfChannelCode),
      })
    }
    if (!input.skuId) throw new AigouOrderError('页面布局未解析到 skuId，请手动填写', 'SKU_REQUIRED', 400)
    const query = new URLSearchParams({ id: input.skuId, isNeedDesc: 'true', t: String(Math.floor(Date.now() / 1000)) })
    const payload = await this.request(`/coc3/coc3-market/arrange/getProductDetailById?${query}`, { product: input })
    if (resultCode(payload) !== '0') throw new AigouOrderError(resultMessage(payload, '商品详情查询失败'), 'PRODUCT_QUERY_FAILED')
    const detail = asRecord(payload.data) || {}
    let skuType: unknown
    try {
      const skuTypePayload = await this.request('/coc3/coc3-market-member/api/member/getSkuType', {
        method: 'POST', product: input, body: { skuId: input.skuId },
      })
      skuType = sanitize(skuTypePayload)
    } catch (error) {
      skuType = { available: false, message: error instanceof Error ? error.message : 'SKU 类型查询失败' }
    }
    const matchedPreset = AIGOU_PRODUCT_PRESETS.some((item) => item.orderMode === 'rights' && item.skuId && item.skuId === input.skuId)
    return {
      ...input,
      name: text(detail.name) || text(layout.name) || `SKU ${input.skuId}`,
      pageId: text(layout.pageId) || undefined,
      pageTitle: text(layout.pageTitle) || undefined,
      price: Number.isFinite(Number(detail.price)) ? Number(detail.price) : undefined,
      originPrice: Number.isFinite(Number(detail.originPrice)) ? Number(detail.originPrice) : undefined,
      agreementName: text(detail.serviceAgreementName) || undefined,
      agreementContent: text(detail.serviceAgreementContent) || undefined,
      skuType,
      genericContext: !matchedPreset && !input.code,
      source: layout.source === 'layout' ? 'layout' : 'input',
    }
  }

  async sendSms(productValue: Partial<AigouProductInput>): Promise<AigouSmsResult> {
    const product = normalizeProductInput(productValue)
    if (product.orderMode !== 'rights') throw new AigouOrderError('套餐商品不能调用爱购权益短信接口', 'PACKAGE_ORDER_REQUIRED', 409)
    const payload = await this.request('/coc3/coc3-market/api/sms/qwSendSmsCode', {
      method: 'POST', product,
      body: { receivers: this.sessionValue.token, skuId: encryptAigouSmsSku(product.skuId), member: true, businessChannelCode: product.channelCode },
    })
    const code = resultCode(payload)
    return {
      success: code === '0',
      resultCode: code,
      message: resultMessage(payload, code === '0' ? '验证码已发送' : '验证码发送失败'),
      response: sanitize(payload),
      cooldownSeconds: 60,
    }
  }

  async confirmOrder(productValue: Partial<AigouProductInput>, smsCode: string, risk: AigouRiskContext = {}): Promise<AigouOrderResult> {
    const product = normalizeProductInput(productValue)
    if (product.orderMode !== 'rights') throw new AigouOrderError('套餐商品不能调用 directOrder', 'PACKAGE_ORDER_REQUIRED', 409)
    let precheckPayload: JsonRecord = {}
    let precheckError: unknown
    try {
      precheckPayload = await this.request('/coc3/coc3-market-order/api/external/black/checkBlacklist', {
        method: 'POST', product, body: { skuId: product.skuId },
      })
    } catch (error) {
      precheckError = error
    }
    const precheckData = asRecord(precheckPayload.data)
    const precheckCode = resultCode(precheckPayload)
    const effectiveRisk: AigouRiskContext = { ...risk }
    const cookieDfp = text(parseCookieHeader(this.sessionValue.cookie).get('BSFIT_DEVICEID'))
    const riskPreparation: AigouRiskPreparation = {
      deviceToken: effectiveRisk.grRiskP3 ? 'provided' : 'unavailable',
      wasmParams: effectiveRisk.wasmParams ? 'provided' : 'unavailable',
      operDfp: effectiveRisk.operDfp ? 'provided' : cookieDfp ? 'session-cookie' : 'unavailable',
    }
    if (!effectiveRisk.grRiskP3) {
      try {
        const generated = await this.fetchRiskDeviceToken(product)
        effectiveRisk.grRiskP3 = generated.token
        riskPreparation.deviceToken = 'generated'
        riskPreparation.tokenResultCode = generated.resultCode
        riskPreparation.tokenMessage = generated.message
      } catch (error) {
        riskPreparation.tokenMessage = error instanceof Error ? error.message : '设备风险令牌获取失败'
      }
    }
    if (!effectiveRisk.operDfp && cookieDfp) effectiveRisk.operDfp = cookieDfp
    const headers: Record<string, string> = {}
    if (effectiveRisk.grRiskP1) headers['gr-risk-p1'] = effectiveRisk.grRiskP1
    if (effectiveRisk.grRiskP2) headers['gr-risk-p2'] = effectiveRisk.grRiskP2
    if (effectiveRisk.grRiskP3) headers['gr-risk-p3'] = effectiveRisk.grRiskP3
    if (effectiveRisk.wasmParams) headers.wasmParams = effectiveRisk.wasmParams
    let payload: JsonRecord
    try {
      payload = await this.request('/coc3/coc3-market-order/api/external/order/directOrder', {
        method: 'POST', product, headers,
        body: {
          skuId: product.skuId,
          channelCode: product.channelCode,
          selfChannelCode: product.selfChannelCode,
          smsCode: encryptAigouOrderCode(smsCode),
          dealType: 0,
          receipt: true,
          receiptModule: true,
          referer: product.referer,
          operDfp: effectiveRisk.operDfp || null,
        },
      })
    } catch (error) {
      const orderError = error instanceof AigouOrderError ? error : undefined
      return {
        success: false,
        resultCode: orderError?.code || 'ORDER_REQUEST_FAILED',
        message: error instanceof Error ? error.message : '订购接口请求失败',
        response: orderError?.response !== undefined
          ? sanitize(orderError.response)
          : sanitize({ code: orderError?.code || 'ORDER_REQUEST_FAILED', message: error instanceof Error ? error.message : '订购接口请求失败' }),
        precheck: {
          success: !precheckError && precheckCode === '0',
          resultCode: precheckCode || (precheckError instanceof AigouOrderError ? precheckError.code : 'PRECHECK_FAILED'),
          message: precheckError instanceof Error ? `${precheckError.message}，已继续尝试提交` : resultMessage(precheckPayload, '预检完成'),
          isBlackList: precheckData ? Boolean(precheckData.isBlackList ?? precheckData.blackList) : undefined,
          response: precheckError instanceof AigouOrderError ? sanitize(precheckError.response) : sanitize(precheckPayload),
        },
        riskPreparation,
        attempted: true,
      }
    }
    const code = resultCode(payload)
    return {
      success: code === '0',
      resultCode: code,
      message: resultMessage(payload, code === '0' ? '订购请求已受理' : '订购请求未受理'),
      data: sanitize(payload.data),
      response: sanitize(payload),
      precheck: {
        success: !precheckError && precheckCode === '0',
        resultCode: precheckCode || (precheckError instanceof AigouOrderError ? precheckError.code : 'PRECHECK_FAILED'),
        message: precheckError instanceof Error ? `${precheckError.message}，已继续尝试提交` : resultMessage(precheckPayload, precheckCode === '0' ? '预检完成' : '预检失败，已继续尝试提交'),
        isBlackList: precheckData ? Boolean(precheckData.isBlackList ?? precheckData.blackList) : undefined,
        response: precheckError instanceof AigouOrderError ? sanitize(precheckError.response) : sanitize(precheckPayload),
      },
      riskPreparation,
      attempted: true,
    }
  }
}

export const __test__ = { zeroPadEncrypt, extractLayoutProduct, sanitize }

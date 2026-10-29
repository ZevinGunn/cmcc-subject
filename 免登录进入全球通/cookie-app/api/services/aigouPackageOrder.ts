import crypto from 'node:crypto'
import { cocAuroraEncrypt, createCocAuroraContext } from './cmccBenefitOrderCrypto.js'
import { httpsRequestText } from './cmccHttp.js'
import { buildCookieHeader, mergeCookieWithSetCookie, parseCookieHeader } from './cookieUtils.js'
import { AigouOrderError, normalizeProductInput, type AigouOrderResult, type AigouProduct, type AigouProductInput, type AigouSmsResult } from './aigouBusinessOrder.js'
import type { CocPackageSessionRecord } from './cocPackageSession.js'

const COC_ORIGIN = 'https://dev.coc.10086.cn'
const COC_API_ORIGIN = `${COC_ORIGIN}/coc/`
const ENCRYPTION_VERSION = '1486234121417629696'
const DEFAULT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'

type JsonRecord = Record<string, unknown>

function asRecord(value: unknown): JsonRecord | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : undefined
}

function text(value: unknown): string {
  return value === undefined || value === null ? '' : String(value).trim()
}

function resultCode(payload?: JsonRecord): string {
  return text(payload?.resultCode ?? payload?.code)
}

function resultMessage(payload: JsonRecord | undefined, fallback: string): string {
  return text(payload?.msg ?? payload?.message ?? payload?.resultMsg) || fallback
}

function parseJson(value: string): JsonRecord {
  const candidates = [String(value || '').trim()]
  if (/^[A-Za-z0-9+/]+={0,2}$/.test(candidates[0]) && candidates[0].length % 4 === 0) {
    candidates.push(Buffer.from(candidates[0], 'base64').toString('utf8'))
  }
  for (const candidate of candidates) {
    try {
      const record = asRecord(JSON.parse(candidate) as unknown)
      if (record) return record
    } catch {
      // Try the decoded response next.
    }
  }
  throw new AigouOrderError('COC 套餐接口返回了无法解析的响应', 'INVALID_UPSTREAM_RESPONSE', 502)
}

function sanitize(value: unknown, depth = 0): unknown {
  if (depth > 5) return undefined
  if (value === null || value === undefined) return value
  if (typeof value === 'string') return value.replace(/1\d{10}/g, (phone) => `${phone.slice(0, 3)}****${phone.slice(-4)}`)
  if (typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map((item) => sanitize(item, depth + 1))
  const output: JsonRecord = {}
  for (const [key, item] of Object.entries(value as JsonRecord)) {
    if (/(cookie|token|ticket|phone|mobile|receiver|sms|identity)/i.test(key)) continue
    output[key] = sanitize(item, depth + 1)
  }
  return output
}

function packageReferer(product: AigouProductInput): string {
  const url = new URL(`/coc/canvas/package-h5-canvas/online/${encodeURIComponent(product.referer)}`, COC_ORIGIN)
  if (product.pageId) url.searchParams.set('pageId', product.pageId)
  url.searchParams.set('channelId', product.touchCode || product.channelCode)
  return url.toString()
}

function reverseBase64(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64').split('').reverse().join('')
}

function packageBookProductPayload(product: AigouProductInput, phone: string, smsCode: string, userId: string): JsonRecord {
  const mobile = reverseBase64(phone)
  const touchCode = product.touchCode || product.channelCode
  return {
    digest: crypto.createHash('md5').update(`${phone}coc${mobile}`).digest('hex'),
    pageId: product.pageId,
    productCode: product.productCode || product.skuId,
    touchCode,
    sellerId: null,
    sellerMobile: null,
    verifyType: 2,
    protocolSequenceId: product.protocolSequenceId,
    sourceUrl: packageReferer(product),
    userId,
    encrypt: { mobile },
    mobile,
    smsCode,
    ext: JSON.stringify({ wtAc: `${touchCode}_` }),
  }
}

export class AigouPackageOrderClient {
  private sessionValue: CocPackageSessionRecord

  constructor(session: CocPackageSessionRecord, private readonly phone: string) {
    this.sessionValue = { ...session }
  }

  get session(): CocPackageSessionRecord { return { ...this.sessionValue } }

  private async request(path: string, product: AigouProductInput, body: JsonRecord, encrypted = false): Promise<JsonRecord> {
    let requestBody: JsonRecord = body
    const encryptionHeaders: Record<string, string> = {}
    if (encrypted) {
      const aurora = createCocAuroraContext()
      requestBody = { cocEnContent: cocAuroraEncrypt(body, aurora.key) }
      encryptionHeaders['coc-en-version'] = ENCRYPTION_VERSION
      encryptionHeaders['coc-aurora'] = aurora.encryptedKey
      encryptionHeaders['coc-aurora-v'] = '2'
    }
    const response = await httpsRequestText({
      url: new URL(path, COC_API_ORIGIN).toString(),
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8',
        Origin: COC_ORIGIN,
        Referer: packageReferer(product),
        'User-Agent': DEFAULT_UA,
        Cookie: this.sessionValue.cookie,
        ...encryptionHeaders,
      },
      body: JSON.stringify(requestBody),
      timeoutMs: 20_000,
    })
    const merged = mergeCookieWithSetCookie({ cookie: this.sessionValue.cookie, setCookie: response.headers['set-cookie'] })
    if (merged.changed) this.sessionValue = { ...this.sessionValue, cookie: merged.cookie }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      let upstream: unknown = response.bodyText
      try { upstream = sanitize(parseJson(response.bodyText)) } catch { upstream = sanitize(response.bodyText) }
      throw new AigouOrderError(`COC 套餐上游返回 HTTP ${response.statusCode}`, 'UPSTREAM_HTTP_ERROR', 502, upstream)
    }
    return parseJson(response.bodyText)
  }

  async resolveProduct(inputValue: Partial<AigouProductInput>): Promise<AigouProduct> {
    const product = normalizeProductInput(inputValue)
    if (product.orderMode !== 'package') throw new AigouOrderError('不是 COC 套餐商品', 'INVALID_ORDER_MODE', 400)
    if (!product.productCode || !product.pageId || !product.touchCode || !product.protocolSequenceId) {
      throw new AigouOrderError('套餐商品缺少 productCode、pageId、touchCode 或协议序列号', 'PACKAGE_PARAMETERS_REQUIRED', 400)
    }
    let name = product.name || `套餐 ${product.productCode}`
    let agreementName: string | undefined
    let agreementContent: string | undefined
    try {
      const page = await this.request('personalization/page/getDefault', product, {
        pageId: product.pageId, touchCode: product.touchCode, handSingle: 0,
      })
      const pageData = asRecord(page.data)
      const products = Array.isArray(pageData?.products) ? pageData.products : []
      const matched = products.map(asRecord).find((item) => text(item?.productCode) === product.productCode)
      name = text(matched?.productName ?? matched?.prodcutName) || name
    } catch {
      // The verified local catalog remains usable when optional page metadata is unavailable.
    }
    try {
      const protocol = await this.request('grocer/protocol/prov/queryProtocol', product, {
        mobile: this.phone,
        pageId: product.pageId,
        productCode: product.productCode,
        provinceCode: this.sessionValue.provinceCode,
        userId: this.sessionValue.userId,
        verifyType: '0',
      })
      const first = Array.isArray(protocol.data) ? asRecord(protocol.data[0]) : undefined
      if (text(first?.protocolSequenceId)) product.protocolSequenceId = text(first?.protocolSequenceId)
      agreementName = text(first?.protocolName) || undefined
      agreementContent = text(first?.content) || undefined
    } catch {
      // Fall back to the protocol sequence captured in the verified product configuration.
    }
    return {
      ...product,
      name,
      pageTitle: product.name,
      agreementName,
      agreementContent,
      genericContext: false,
      source: 'input',
    }
  }

  async sendSms(inputValue: Partial<AigouProductInput>): Promise<AigouSmsResult> {
    const product = normalizeProductInput(inputValue)
    if (product.orderMode !== 'package') throw new AigouOrderError('不是 COC 套餐商品', 'INVALID_ORDER_MODE', 400)
    const payload = await this.request('user/smsCode', product, {
      mobile: this.phone,
      pageId: product.pageId,
      productCode: product.productCode || product.skuId,
      smsCodeTypeEnum: product.smsCodeTypeEnum || '505',
      touchCode: product.touchCode || product.channelCode,
    }, true)
    const code = resultCode(payload)
    return {
      success: code === '0',
      resultCode: code,
      message: resultMessage(payload, code === '0' ? '验证码已发送' : '验证码发送失败'),
      response: sanitize(payload),
      cooldownSeconds: 60,
    }
  }

  async confirmOrder(inputValue: Partial<AigouProductInput>, smsCode: string): Promise<AigouOrderResult> {
    if (!/^\d{4,8}$/.test(smsCode)) throw new AigouOrderError('请输入 4-8 位数字验证码', 'INVALID_SMS_CODE', 400)
    const product = normalizeProductInput(inputValue)
    if (product.orderMode !== 'package') throw new AigouOrderError('不是 COC 套餐商品', 'INVALID_ORDER_MODE', 400)
    const login = await this.request('user/loginCheck', product, {
      mobile: this.phone,
      smsCode,
      uid: '',
      userId: this.sessionValue.userId,
      verifyType: 1,
    }, true)
    const loginCode = resultCode(login)
    const loginData = asRecord(login.data)
    const nextUserId = text(loginData?.userId) || this.sessionValue.userId
    const nextToken = text(loginData?.token)
    if (nextToken) {
      const cookies = parseCookieHeader(this.sessionValue.cookie)
      cookies.set('User-Token', nextToken)
      this.sessionValue = { ...this.sessionValue, cookie: buildCookieHeader(cookies), token: nextToken, userId: nextUserId }
    }
    if (loginCode !== '0') {
      return {
        success: false,
        resultCode: loginCode,
        message: resultMessage(login, '订购验证码校验失败'),
        response: sanitize({ stage: 'loginCheck', loginCheck: login }),
        precheck: { success: false, resultCode: loginCode, message: resultMessage(login, '订购验证码校验失败') },
        attempted: false,
      }
    }
    let order: JsonRecord
    try {
      order = await this.request('pkg/order/bookProduct', product, packageBookProductPayload(product, this.phone, smsCode, nextUserId))
    } catch (error) {
      const orderError = error instanceof AigouOrderError ? error : undefined
      return {
        success: false,
        resultCode: orderError?.code || 'ORDER_REQUEST_FAILED',
        message: error instanceof Error ? error.message : '订购接口请求失败',
        response: sanitize({ stage: 'bookProduct', loginCheck: login, order: orderError?.response || { message: error instanceof Error ? error.message : '请求失败' } }),
        precheck: { success: true, resultCode: loginCode, message: '订购验证码校验通过' },
        attempted: true,
      }
    }
    const code = resultCode(order)
    return {
      success: code === '0',
      resultCode: code,
      message: resultMessage(order, code === '0' ? '订购请求已受理' : '订购请求未受理'),
      data: sanitize(order.data),
      response: sanitize({ stage: 'bookProduct', loginCheck: login, order }),
      precheck: { success: true, resultCode: loginCode, message: '订购验证码校验通过' },
      attempted: true,
    }
  }
}

export const __test__ = { packageReferer, reverseBase64, packageBookProductPayload, sanitize }

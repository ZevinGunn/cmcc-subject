import crypto from 'node:crypto'
import { httpsRequestText } from './cmccHttp.js'
import { buildCookieHeader, mergeCookieWithSetCookie, parseCookieHeader } from './cookieUtils.js'
import type { CocPackageSessionRecord } from './cocPackageSession.js'
import { AGE_FEED_DEFAULTS, findAgeFeedTier } from '../../shared/ageFeed.js'
import { prepareAgeFeedProduct } from './cmccAgeFeedOrder.js'
import { cocAuroraDecrypt, cocMeteorEncrypt, createCocMeteorContext } from './cmccBenefitOrderCrypto.js'

const BASE_URL = 'https://dev.coc.10086.cn/coc/'
const DEFAULT_PAGE_ID = '1889216886548430848'
const DEFAULT_TOUCH_CODE = 'P00000078835'
const DEFAULT_PRODUCT_CODE = '1000000100290'
const ENCRYPTION_VERSION = '1486234121417629696'
const ENCRYPTION_KEY = Buffer.from('0226942d11914188', 'utf8')
const SESSION_TTL_MS = 15 * 60_000
const SMS_COOLDOWN_MS = 60_000
const DEFAULT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'

export const BUSINESS_ORDER_DEFAULTS = {
  pageId: DEFAULT_PAGE_ID,
  touchCode: DEFAULT_TOUCH_CODE,
  productCode: DEFAULT_PRODUCT_CODE,
} as const

export type BusinessOrderStage =
  | 'phone_verified'
  | 'login_sms_sent'
  | 'logged_in'
  | 'product_ready'
  | 'order_sms_sent'
  | 'ordering'
  | 'finished'

type UpstreamPayload = {
  code?: string | number
  message?: string
  success?: boolean
  data?: unknown
  [key: string]: unknown
}

export type BusinessOrderProtocol = {
  name: string
  content: string
  sequenceId: string
}

export type BusinessOrderProduct = {
  productCode: string
  productName: string
  pageTitle?: string
  configured: boolean
  available: boolean
  eligible?: boolean
  relationOrdered?: boolean
  rulesHtml: string
  protocol: BusinessOrderProtocol
  warnings: string[]
  orderAllowed?: boolean
  eligibilitySummary?: string
  eligibilityDetail?: string
}

export type BusinessOrderResult = {
  success: boolean
  uncertain: boolean
  code: string
  message: string
  completedAt: string
  data?: unknown
  response?: unknown
}

type BusinessOrderSession = {
  id: string
  target: 'diamond_package' | 'age_feed'
  ownerKey: string
  stage: BusinessOrderStage
  phone: string
  maskedPhone: string
  productCode: string
  pageId: string
  touchCode: string
  ageFeedTier?: string
  cookie: string
  userId?: string
  provinceCode?: string
  cityCode?: string
  cityName?: string
  areaName?: string
  product?: BusinessOrderProduct
  loginSmsSentAt?: number
  orderSmsSentAt?: number
  orderInFlight: boolean
  productInFlight?: boolean
  lastResult?: BusinessOrderResult
  createdAt: number
  updatedAt: number
  expiresAt: number
}

export type BusinessOrderSessionView = {
  id: string
  target: 'diamond_package' | 'age_feed'
  stage: BusinessOrderStage
  maskedPhone: string
  productCode: string
  pageId: string
  touchCode: string
  ageFeedTier?: string
  provinceCode?: string
  cityCode?: string
  cityName?: string
  areaName?: string
  product?: BusinessOrderProduct
  loginSmsCooldownSeconds: number
  orderSmsCooldownSeconds: number
  lastResult?: BusinessOrderResult
  createdAt: string
  updatedAt: string
  expiresAt: string
}

export class BusinessOrderError extends Error {
  readonly code: string
  readonly status: number

  constructor(message: string, code = 'UPSTREAM_ERROR', status = 424) {
    super(message)
    this.name = 'BusinessOrderError'
    this.code = code
    this.status = status
  }
}

const sessions = new Map<string, BusinessOrderSession>()

function now(): number {
  return Date.now()
}

function isSuccess(payload: UpstreamPayload): boolean {
  return String(payload.code ?? '') === '0'
}

function payloadMessage(payload: UpstreamPayload, fallback: string): string {
  const value = typeof payload.message === 'string' ? payload.message.trim() : ''
  return value || fallback
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function stringValue(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

function secondsRemaining(sentAt?: number): number {
  if (!sentAt) return 0
  return Math.max(0, Math.ceil((sentAt + SMS_COOLDOWN_MS - now()) / 1000))
}

function maskPhone(phone: string): string {
  return /^1\d{10}$/.test(phone) ? `${phone.slice(0, 3)}****${phone.slice(-4)}` : '***'
}

function touch(session: BusinessOrderSession): void {
  session.updatedAt = now()
  session.expiresAt = session.updatedAt + SESSION_TTL_MS
}

function cleanupExpiredSessions(): void {
  const current = now()
  for (const [id, session] of sessions.entries()) {
    if (session.expiresAt <= current) sessions.delete(id)
  }
}

function sessionView(session: BusinessOrderSession): BusinessOrderSessionView {
  return {
    id: session.id,
    target: session.target,
    stage: session.stage,
    maskedPhone: session.maskedPhone,
    productCode: session.productCode,
    pageId: session.pageId,
    touchCode: session.touchCode,
    ageFeedTier: session.ageFeedTier,
    provinceCode: session.provinceCode,
    cityCode: session.cityCode,
    cityName: session.cityName,
    areaName: session.areaName,
    product: session.product,
    loginSmsCooldownSeconds: secondsRemaining(session.loginSmsSentAt),
    orderSmsCooldownSeconds: secondsRemaining(session.orderSmsSentAt),
    lastResult: session.lastResult,
    createdAt: new Date(session.createdAt).toISOString(),
    updatedAt: new Date(session.updatedAt).toISOString(),
    expiresAt: new Date(session.expiresAt).toISOString(),
  }
}

function getSession(id: string): BusinessOrderSession {
  cleanupExpiredSessions()
  const session = sessions.get(id)
  if (!session) throw new BusinessOrderError('订购会话不存在或已过期，请重新开始', 'SESSION_NOT_FOUND', 404)
  return session
}

function requireStage(session: BusinessOrderSession, allowed: BusinessOrderStage[], action: string): void {
  if (allowed.includes(session.stage)) return
  throw new BusinessOrderError(`当前流程状态不能${action}，请按步骤操作`, 'INVALID_STAGE', 409)
}

function encryptLoginPayload(value: unknown): string {
  const cipher = crypto.createCipheriv('aes-128-ecb', ENCRYPTION_KEY, null)
  return Buffer.concat([
    cipher.update(JSON.stringify(value), 'utf8'),
    cipher.final(),
  ]).toString('base64')
}

function decryptLoginPayload(cipherText: string): string {
  const decipher = crypto.createDecipheriv('aes-128-ecb', ENCRYPTION_KEY, null)
  return Buffer.concat([
    decipher.update(cipherText, 'base64'),
    decipher.final(),
  ]).toString('utf8')
}

function parseUpstreamPayload(text: string): UpstreamPayload {
  const trimmed = String(text || '').trim()
  if (!trimmed) throw new BusinessOrderError('上游返回为空', 'UPSTREAM_EMPTY')

  const candidates = [trimmed]
  if (/^[A-Za-z0-9+/]+={0,2}$/.test(trimmed) && trimmed.length % 4 === 0) {
    try {
      candidates.push(Buffer.from(trimmed, 'base64').toString('utf8'))
    } catch {
      // The plain JSON candidate below will produce the final format error.
    }
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as unknown
      const record = asRecord(parsed)
      if (record) return record as UpstreamPayload
    } catch {
      // Try the next candidate.
    }
  }
  throw new BusinessOrderError('上游返回格式异常', 'UPSTREAM_FORMAT')
}

function sourceUrl(session: Pick<BusinessOrderSession, 'pageId' | 'touchCode' | 'target'>): string {
  const url = new URL(session.target === 'age_feed' ? 'web6/ageFeedPackage/' : 'web6/diamondPackage/', BASE_URL)
  url.searchParams.set('pageId', session.pageId)
  url.searchParams.set('channelId', session.touchCode)
  return url.toString()
}

function buildProtocolQueryPayload(
  session: Pick<BusinessOrderSession, 'phone' | 'pageId' | 'productCode' | 'provinceCode' | 'userId'>,
) {
  return {
    mobile: session.phone,
    pageId: session.pageId,
    productCode: session.productCode,
    provinceCode: session.provinceCode,
    userId: session.userId,
    verifyType: '0',
  }
}

function buildOrderSmsPayload(
  session: Pick<BusinessOrderSession, 'phone' | 'productCode' | 'pageId' | 'userId'>,
) {
  return {
    mobile: session.phone,
    productCode: session.productCode,
    pageId: session.pageId,
    smsCodeTypeEnum: '505',
    userId: session.userId,
  }
}

function buildOrderVerificationPayload(
  session: Pick<BusinessOrderSession, 'phone' | 'productCode' | 'userId'>,
  code: string,
) {
  return {
    mobile: session.phone,
    smsCode: code,
    userId: session.userId,
    smsCodeTypeEnum: '505',
    productCode: session.productCode,
    verifyType: 0,
  }
}

async function upstreamRequest(args: {
  session: BusinessOrderSession
  path: string
  body: unknown
  encrypted?: boolean
  encryption?: 'meteor'
}): Promise<UpstreamPayload> {
  const meteor = args.encryption === 'meteor' ? createCocMeteorContext() : undefined
  const bodyObject = meteor ? { cocEnContent: cocMeteorEncrypt(args.body, meteor.key) } : args.encrypted
    ? { cocEnContent: encryptLoginPayload(args.body) }
    : args.body
  const body = JSON.stringify(bodyObject)
  const response = await httpsRequestText({
    url: new URL(args.path, BASE_URL).toString(),
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json',
      Origin: 'https://dev.coc.10086.cn',
      Referer: sourceUrl(args.session),
      'User-Agent': DEFAULT_UA,
      ...(args.encrypted ? { 'coc-en-version': ENCRYPTION_VERSION } : {}),
      ...(meteor ? { 'coc-meteor': meteor.encryptedKey, 'coc-meteor-v': '2' } : {}),
      ...(args.session.cookie ? { Cookie: args.session.cookie } : {}),
      'Content-Length': Buffer.byteLength(body).toString(),
    },
    body,
    timeoutMs: 15_000,
  })

  const merged = mergeCookieWithSetCookie({
    cookie: args.session.cookie,
    setCookie: response.headers['set-cookie'],
  })
  args.session.cookie = merged.cookie

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new BusinessOrderError(`上游 HTTP ${response.statusCode}`, 'UPSTREAM_HTTP')
  }
  const payload = parseUpstreamPayload(response.bodyText)
  if (meteor && typeof payload.returnData === 'string') {
    return parseUpstreamPayload(cocAuroraDecrypt(payload.returnData, meteor.key))
  }
  return payload
}

function ensureBusinessSuccess(payload: UpstreamPayload, fallback: string): void {
  if (isSuccess(payload)) return
  throw new BusinessOrderError(payloadMessage(payload, fallback), String(payload.code || 'UPSTREAM_ERROR'))
}

function ensureUserToken(session: BusinessOrderSession, data: Record<string, unknown>): void {
  const cookies = parseCookieHeader(session.cookie)
  if (cookies.has('User-Token')) return
  const token = stringValue(data.token).trim()
  if (!token) return
  cookies.set('User-Token', token)
  session.cookie = buildCookieHeader(cookies)
}

function productFromPage(data: Record<string, unknown> | undefined, productCode: string): {
  configured: boolean
  productName: string
  pageTitle?: string
} {
  const products = asArray(data?.products)
  const match = products
    .map(asRecord)
    .find((product) => stringValue(product?.productCode) === productCode)
  const bodyTitle = asRecord(data?.bodyTitle)
  return {
    configured: Boolean(match),
    productName: stringValue(match?.productName || match?.prodcutName) || `产品 ${productCode}`,
    pageTitle: stringValue(bodyTitle?.bodyTitle) || undefined,
  }
}

function extractRulesHtml(data: Record<string, unknown> | undefined): string {
  const configs = asArray(data?.configList).map(asRecord)
  return configs.map((item) => stringValue(item?.subContent)).filter(Boolean).join('\n')
}

function extractProtocol(data: unknown): BusinessOrderProtocol | undefined {
  const first = asRecord(asArray(data)[0])
  const sequenceId = stringValue(first?.protocolSequenceId).trim()
  if (!first || !sequenceId) return undefined
  return {
    name: stringValue(first.protocolName) || '业务受理协议',
    content: stringValue(first.content),
    sequenceId,
  }
}

function sanitizeResultData(value: unknown, depth = 0): unknown {
  if (depth > 5) return undefined
  if (Array.isArray(value)) return value.map((item) => sanitizeResultData(item, depth + 1))
  const record = asRecord(value)
  if (!record) return value
  const output: Record<string, unknown> = {}
  for (const [key, item] of Object.entries(record)) {
    if (/(token|cookie|mobile|phone|encrypt|ticket|identity)/i.test(key)) continue
    output[key] = sanitizeResultData(item, depth + 1)
  }
  return output
}

function readAgeFeedSelection(value: string | undefined): string {
  const selection = value || 'auto'
  if (selection !== 'auto' && !findAgeFeedTier(selection)) {
    throw new BusinessOrderError('请选择银卡、金卡、白金卡或自动匹配', 'INVALID_AGE_FEED_TIER', 400)
  }
  return selection
}

export async function createBusinessOrderSession(args: {
  phone: string
  ownerKey: string
  target?: 'diamond_package' | 'age_feed'
  productCode?: string
  pageId?: string
  touchCode?: string
  authSession?: CocPackageSessionRecord
}): Promise<BusinessOrderSessionView> {
  cleanupExpiredSessions()
  const timestamp = now()
  const ageFeedTier = args.target === 'age_feed' ? readAgeFeedSelection(args.productCode) : undefined
  const session: BusinessOrderSession = {
    id: crypto.randomUUID(),
    target: args.target || 'diamond_package',
    ownerKey: args.ownerKey,
    stage: args.authSession ? 'logged_in' : 'phone_verified',
    phone: args.phone,
    maskedPhone: args.authSession?.maskedMobile || maskPhone(args.phone),
    productCode: args.target === 'age_feed' ? (ageFeedTier === 'auto' ? AGE_FEED_DEFAULTS.productCode : ageFeedTier!) : args.productCode || DEFAULT_PRODUCT_CODE,
    ageFeedTier,
    pageId: args.target === 'age_feed' ? AGE_FEED_DEFAULTS.pageId : args.pageId || DEFAULT_PAGE_ID,
    touchCode: args.target === 'age_feed' ? AGE_FEED_DEFAULTS.touchCode : args.touchCode || DEFAULT_TOUCH_CODE,
    cookie: args.authSession?.cookie || '',
    userId: args.authSession?.userId,
    provinceCode: args.authSession?.provinceCode,
    cityCode: args.authSession?.cityCode,
    orderInFlight: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    expiresAt: timestamp + SESSION_TTL_MS,
  }

  if (!args.authSession) {
    const verification = await upstreamRequest({
      session,
      path: 'user/userVerification',
      body: { mobile: session.phone },
      encrypted: true,
    })
    ensureBusinessSuccess(verification, '号码校验失败')
    const data = asRecord(verification.data)
    if (stringValue(data?.isCmcc) !== '0') {
      throw new BusinessOrderError('请输入有效的中国移动手机号', 'PHONE_NOT_CMCC', 400)
    }
    session.cityName = stringValue(data?.cityName) || undefined
    session.areaName = stringValue(data?.areaName) || undefined
  }
  sessions.set(session.id, session)
  return sessionView(session)
}

function canAccessBusinessOrderSession(sessionOwnerKey: string, requestOwnerKey: string): boolean {
  return requestOwnerKey === 'admin' || sessionOwnerKey === requestOwnerKey
}

export function assertBusinessOrderSessionAccess(id: string, ownerKey: string): void {
  const session = getSession(id)
  if (canAccessBusinessOrderSession(session.ownerKey, ownerKey)) return
  throw new BusinessOrderError('无权访问该订购会话', 'FORBIDDEN', 403)
}

export function readBusinessOrderSession(id: string): BusinessOrderSessionView {
  return sessionView(getSession(id))
}

export async function sendBusinessOrderLoginSms(id: string): Promise<BusinessOrderSessionView> {
  const session = getSession(id)
  requireStage(session, ['phone_verified', 'login_sms_sent'], '发送登录验证码')
  const remaining = secondsRemaining(session.loginSmsSentAt)
  if (remaining > 0) {
    throw new BusinessOrderError(`请 ${remaining} 秒后再发送`, 'SMS_COOLDOWN', 429)
  }
  const response = await upstreamRequest({
    session,
    path: 'user/smsCode',
    body: { mobile: session.phone, smsCodeTypeEnum: '502', userId: '' },
    encrypted: true,
  })
  ensureBusinessSuccess(response, '登录验证码发送失败')
  session.stage = 'login_sms_sent'
  session.loginSmsSentAt = now()
  touch(session)
  return sessionView(session)
}

export async function loginBusinessOrderSession(id: string, code: string): Promise<BusinessOrderSessionView> {
  const session = getSession(id)
  requireStage(session, ['login_sms_sent'], '登录')
  const response = await upstreamRequest({
    session,
    path: 'user/loginCheck',
    body: {
      mobile: session.phone,
      smsCode: code,
      userId: '',
      smsCodeTypeEnum: 502,
      verifyType: 0,
    },
    encrypted: true,
  })
  ensureBusinessSuccess(response, '登录失败')
  const data = asRecord(response.data) ?? {}
  ensureUserToken(session, data)
  session.maskedPhone = stringValue(data.maskedMobile) || session.maskedPhone
  session.userId = stringValue(data.userId) || undefined
  session.provinceCode = stringValue(data.provinceCode) || undefined
  session.cityCode = stringValue(data.cityCode) || undefined
  if (!session.userId || !session.provinceCode) {
    throw new BusinessOrderError('登录响应缺少用户或省份信息', 'UPSTREAM_FORMAT')
  }
  session.stage = 'logged_in'
  touch(session)
  return sessionView(session)
}

export async function prepareBusinessOrderProduct(
  id: string,
  overrides: { productCode?: string; pageId?: string; touchCode?: string } = {},
): Promise<BusinessOrderSessionView> {
  const session = getSession(id)
  if (session.productInFlight) throw new BusinessOrderError('产品信息正在获取，请稍后重试', 'PRODUCT_IN_PROGRESS', 409)
  if (session.target === 'age_feed') {
    readAgeFeedSelection(overrides.productCode || session.ageFeedTier)
    if (session.lastResult?.uncertain) throw new BusinessOrderError('上次订购结果未确认，请先核对官方已订业务', 'ORDER_UNCERTAIN', 409)
  }
  session.productInFlight = true
  try {
    return await prepareBusinessOrderProductInternal(session, overrides)
  } finally {
    session.productInFlight = false
  }
}

async function prepareBusinessOrderProductInternal(
  session: BusinessOrderSession,
  overrides: { productCode?: string; pageId?: string; touchCode?: string },
): Promise<BusinessOrderSessionView> {
  requireStage(session, ['logged_in', 'product_ready', 'order_sms_sent', 'finished'], '获取产品信息')

  if (session.target !== 'age_feed') {
    session.productCode = overrides.productCode || session.productCode
    session.pageId = overrides.pageId || session.pageId
    session.touchCode = overrides.touchCode || session.touchCode
  }
  session.product = undefined
  // 换档位使旧验证码不可提交，但不清除已经开始的短信冷却。
  if (session.target !== 'age_feed') session.orderSmsSentAt = undefined
  session.lastResult = undefined
  session.stage = 'logged_in'
  if (session.target === 'age_feed') {
    session.ageFeedTier = readAgeFeedSelection(overrides.productCode || session.ageFeedTier)
    session.product = await prepareAgeFeedProduct({
      phone: session.phone, userId: session.userId, provinceCode: session.provinceCode,
      selectedProductCode: session.ageFeedTier === 'auto' ? undefined : session.ageFeedTier,
      request: (path, body, encryption) => upstreamRequest({ session, path, body, encryption }),
    })
    session.productCode = session.product.productCode
    session.stage = 'product_ready'
    touch(session)
    return sessionView(session)
  }
  const warnings: string[] = []

  const pageResponse = await upstreamRequest({
    session,
    path: 'personalization/page/getDefault',
    body: { pageId: session.pageId, touchCode: session.touchCode, handSingle: 0 },
  })
  ensureBusinessSuccess(pageResponse, '产品页面配置查询失败')
  const pageData = asRecord(pageResponse.data)
  const pageProduct = productFromPage(pageData, session.productCode)
  if (!pageProduct.configured) {
    warnings.push('当前页面配置中未找到该产品编码，上游可能拒绝订购')
  }

  let rulesHtml = ''
  try {
    const rulesResponse = await upstreamRequest({
      session,
      path: 'grocer/copyWriting/page/query',
      body: {
        configType: '2',
        pageId: session.pageId,
        productCode: session.productCode,
        provinceCode: session.provinceCode,
      },
    })
    ensureBusinessSuccess(rulesResponse, '产品规则查询失败')
    rulesHtml = extractRulesHtml(asRecord(rulesResponse.data))
  } catch (error) {
    warnings.push(`产品规则查询失败：${error instanceof Error ? error.message : '未知错误'}`)
  }

  let available = false
  try {
    const supplierResponse = await upstreamRequest({
      session,
      path: 'blackstone/product/supplier/status/select',
      body: { provinceCode: session.provinceCode, productCodes: [session.productCode] },
    })
    ensureBusinessSuccess(supplierResponse, '产品供应状态查询失败')
    available = asArray(supplierResponse.data).some(
      (value) => stringValue(value) === session.productCode,
    )
    if (!available) warnings.push('当前号码归属省未返回该产品，上游可能拒绝订购')
  } catch (error) {
    warnings.push(`产品供应状态查询失败：${error instanceof Error ? error.message : '未知错误'}`)
  }

  let eligible: boolean | undefined
  let relationOrdered: boolean | undefined
  if (session.productCode === DEFAULT_PRODUCT_CODE) {
    try {
      const relationResponse = await upstreamRequest({
        session,
        path: 'pkg/contract/common/newProductRelation',
        body: {
          productCodes: ['2025999900003193', '2025999900047916'],
          type: 20,
          touchCode: '',
          pageId: '',
          userId: session.userId,
          mobile: '',
        },
      })
      ensureBusinessSuccess(relationResponse, '重复订购关系查询失败')
      relationOrdered = Boolean(asRecord(relationResponse.data)?.isOrder)
    } catch (error) {
      warnings.push(`重复订购关系查询失败：${error instanceof Error ? error.message : '未知错误'}`)
    }

    try {
      const eligibilityResponse = await upstreamRequest({
        session,
        path: 'pkg/newIop/globalDiamondCard/iopCheck',
        body: {
          tagIds: '02519304000159',
          touchCode: session.touchCode,
          eventCode: 'eventJE000000282',
          channelCode: '025193040002',
        },
      })
      ensureBusinessSuccess(eligibilityResponse, '卓越钻石卡资格查询失败')
      eligible = eligibilityResponse.data === true || eligibilityResponse.data === 1
    } catch (error) {
      warnings.push(`卓越钻石卡资格查询失败：${error instanceof Error ? error.message : '未知错误'}`)
    }
    if (eligible === false) warnings.push('上游资格校验未通过，最终订购预计会失败')
    if (relationOrdered) warnings.push('上游返回已存在相关产品关系，请先核对已订业务')
  } else {
    warnings.push('自定义产品未执行卓越钻石卡专用资格与互斥关系检查')
  }

  const protocolResponse = await upstreamRequest({
    session,
    path: 'grocer/protocol/prov/queryProtocol',
    body: buildProtocolQueryPayload(session),
  })
  ensureBusinessSuccess(protocolResponse, '业务受理协议查询失败')
  const protocol = extractProtocol(protocolResponse.data)
  if (!protocol) {
    throw new BusinessOrderError('未取得可用的业务受理协议', 'PROTOCOL_NOT_FOUND', 409)
  }

  session.product = {
    productCode: session.productCode,
    productName: pageProduct.productName,
    pageTitle: pageProduct.pageTitle,
    configured: pageProduct.configured,
    available,
    eligible,
    relationOrdered,
    rulesHtml,
    protocol,
    warnings,
  }
  session.stage = 'product_ready'
  touch(session)
  return sessionView(session)
}

export async function sendBusinessOrderConfirmSms(
  id: string,
  acceptedProtocol: boolean,
): Promise<BusinessOrderSessionView> {
  const session = getSession(id)
  requireStage(session, ['product_ready', 'order_sms_sent'], '发送订购验证码')
  if (!acceptedProtocol) {
    throw new BusinessOrderError('请先阅读并同意业务受理协议', 'PROTOCOL_REQUIRED', 400)
  }
  if (session.target === 'age_feed' && session.product?.orderAllowed !== true) {
    throw new BusinessOrderError('当前号码未通过网龄直升资格核验', 'AGE_FEED_INELIGIBLE', 409)
  }
  if (!session.product?.protocol.sequenceId) {
    throw new BusinessOrderError('当前会话缺少有效协议，请重新获取产品信息', 'PROTOCOL_NOT_FOUND', 409)
  }
  const remaining = secondsRemaining(session.orderSmsSentAt)
  if (remaining > 0) {
    throw new BusinessOrderError(`请 ${remaining} 秒后再发送`, 'SMS_COOLDOWN', 429)
  }
  const response = await upstreamRequest({
    session,
    path: 'user/smsCode',
    body: buildOrderSmsPayload(session),
  })
  ensureBusinessSuccess(response, '订购验证码发送失败')
  session.stage = 'order_sms_sent'
  session.orderSmsSentAt = now()
  touch(session)
  return sessionView(session)
}

export async function confirmBusinessOrder(args: {
  id: string
  code: string
  acceptedProtocol: boolean
  confirmationText: string
}): Promise<{ session: BusinessOrderSessionView; result: BusinessOrderResult }> {
  const session = getSession(args.id)
  requireStage(session, ['order_sms_sent'], '确认订购')
  if (!args.acceptedProtocol) {
    throw new BusinessOrderError('请先阅读并同意业务受理协议', 'PROTOCOL_REQUIRED', 400)
  }
  if (session.target === 'age_feed' && session.product?.orderAllowed !== true) {
    throw new BusinessOrderError('当前号码未通过网龄直升资格核验', 'AGE_FEED_INELIGIBLE', 409)
  }
  if (args.confirmationText !== '确认订购') {
    throw new BusinessOrderError('请输入“确认订购”后再提交', 'CONFIRMATION_REQUIRED', 400)
  }
  if (session.orderInFlight) {
    throw new BusinessOrderError('当前订购正在提交，请勿重复操作', 'ORDER_IN_PROGRESS', 409)
  }
  const protocolSequenceId = session.product?.protocol.sequenceId
  if (!protocolSequenceId) {
    throw new BusinessOrderError('当前会话缺少有效协议，请重新获取产品信息', 'PROTOCOL_NOT_FOUND', 409)
  }

  session.orderInFlight = true
  session.stage = 'ordering'
  touch(session)
  let reachedOrderEndpoint = false
  try {
    const verification = await upstreamRequest({
      session,
      path: 'user/loginCheck',
      body: buildOrderVerificationPayload(session, args.code),
    })
    ensureBusinessSuccess(verification, '订购验证码校验失败')
    ensureUserToken(session, asRecord(verification.data) ?? {})

    reachedOrderEndpoint = true
    const order = await upstreamRequest({
      session,
      path: 'pkg/order/bookProduct',
      body: {
        pageId: session.pageId,
        productCode: session.productCode,
        touchCode: session.touchCode,
        verifyType: 2,
        sourceUrl: sourceUrl(session),
        protocolSequenceId,
      },
    })
    const result: BusinessOrderResult = {
      success: isSuccess(order),
      uncertain: false,
      code: String(order.code ?? ''),
      message: payloadMessage(order, isSuccess(order) ? '订购成功' : '订购失败'),
      completedAt: new Date().toISOString(),
      data: sanitizeResultData(order.data),
      response: sanitizeResultData(order),
    }
    session.lastResult = result
    session.stage = result.success ? 'finished' : 'product_ready'
    session.orderSmsSentAt = undefined
    touch(session)
    return { session: sessionView(session), result }
  } catch (error) {
    session.orderSmsSentAt = undefined
    if (reachedOrderEndpoint && error instanceof BusinessOrderError) {
      session.lastResult = {
        success: false,
        uncertain: true,
        code: error.code,
        message: '订购结果未确认，请先通过官方渠道查询，不要直接重复提交',
        completedAt: new Date().toISOString(),
        response: sanitizeResultData({ code: error.code, message: error.message }),
      }
      session.stage = 'finished'
    } else {
      session.stage = 'product_ready'
    }
    touch(session)
    throw error
  } finally {
    session.orderInFlight = false
  }
}

export function deleteBusinessOrderSession(id: string): boolean {
  return sessions.delete(id)
}

export const __test__ = {
  encryptLoginPayload,
  decryptLoginPayload,
  parseUpstreamPayload,
  maskPhone,
  isSuccess,
  sanitizeResultData,
  canAccessBusinessOrderSession,
  buildProtocolQueryPayload,
  buildOrderSmsPayload,
  buildOrderVerificationPayload,
  sourceUrl,
}

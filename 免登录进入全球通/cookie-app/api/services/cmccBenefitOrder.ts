import crypto from 'node:crypto'
import { httpsRequestText } from './cmccHttp.js'
import { mergeCookieWithSetCookie, parseCookieHeader, buildCookieHeader } from './cookieUtils.js'
import {
  cocAuroraEncrypt,
  cocAuroraDecrypt,
  cocMeteorEncrypt,
  createCocAuroraContext,
  createCocMeteorContext,
  premiumAuthDecrypt,
  premiumAuthEncrypt,
  premiumWireDecrypt,
  premiumWireEncrypt,
  type CocAuroraContext,
} from './cmccBenefitOrderCrypto.js'
import type { CocPackageSessionRecord } from './cocPackageSession.js'
import {
  luckyBagSourceUrl, prepareLuckyBagProduct, selectLuckyBagProduct,
  assertLuckyBagRelationUnchanged, buildLuckyBagSmsBody, buildLuckyBagOrder, lockLuckyBagOrder, recordLuckyBagResult,
  lockLuckyBagSms, recordLuckyBagSms, luckyBagSmsSentAt,
  type LuckyBagVariant, type LuckyBagStatus, type LuckyBagRequest,
} from './luckyBagOrder.js'

const COC_BASE_URL = 'https://dev.coc.10086.cn/coc/'
const RETAIL_BASE_URL = 'https://wx.10086.cn/website/nrapigate/'
const DEFAULT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'
const SESSION_TTL_MS = 15 * 60_000
const SMS_COOLDOWN_MS = 60_000
const BUILDING_FLOW_CODES = [
  '500000050360', '500000050361', '500000050362',
  '500000050363', '500000050364', '500000050365',
] as const
const BUILDING_VOICE_CODES = [
  '500000050354', '500000050355', '500000050356',
  '500000050357', '500000050358', '500000050359',
] as const

export const BENEFIT_ORDER_DEFAULTS = {
  building_bricks: {
    pageId: '1610185761689767936',
    touchCode: 'P00000001555',
    mainProductCode: '500000050353',
    orderProductCode: '789000000750',
    qualificationGoodsId: '2022999800082739',
    orderSmsTemplateNo: '1871462953729064960',
  },
  premium_membership: {
    productId: '2171755',
    productCode: '15890747',
    touchCode: 'P00000102705',
    marketingCode: '1319080049',
    secondChannel: 'P00000116110',
    effectType: 'Type_NextCycle',
  },
  coc_app: {
    smart_life: {
      pageId: '1969953714210263040',
      touchCode: 'P00000044852',
      productCode: '500000051649',
      sourcePath: 'web6/szhydg/',
    },
    five_ga: {
      pageId: '1879370128044171264',
      touchCode: 'P00000055499',
      productCode: '500000051295',
      sourcePath: 'web6/applet5gaH5/home',
    },
  },
} as const

export const COC_APP_PRODUCT_PRESETS = {
  smart_life: {
    id: 'smart_life',
    name: '智臻会员 COC版',
    description: '中国移动 App 内智臻会员套餐页',
    ...BENEFIT_ORDER_DEFAULTS.coc_app.smart_life,
    sourceUrl: 'https://dev.coc.10086.cn/coc/web6/szhydg/?pageId=1969953714210263040',
    warning: '主套餐变更可能影响原套餐及关联业务',
  },
  five_ga: {
    id: 'five_ga',
    name: '全球通 5GA',
    description: '全球通 5GA 199-999 元档套餐',
    ...BENEFIT_ORDER_DEFAULTS.coc_app.five_ga,
    sourceUrl: 'https://dev.coc.10086.cn/coc/web6/applet5gaH5/home?pageId=1879370128044171264&channelId=P00000055499',
    warning: '主套餐变更与宽带、家庭共享及全球通权益实时联动',
  },
} as const

export type CocAppBusinessId = keyof typeof COC_APP_PRODUCT_PRESETS

export const RETAIL_PRODUCT_PRESETS = {
  custom: {
    id: 'custom',
    name: '自定义移动商城业务',
    description: '按产品编码查询并办理',
    productId: '0',
    productCode: '',
    secondChannel: '',
    touchCode: '',
    marketingCode: '',
    effectType: 'Type_Default',
    pageMode: 'product_code',
    personalPageId: '',
    mergeCode: '',
    sourceParams: {},
    warning: '自定义产品请核对产品、档位、生效方式和协议后再提交',
  },
  premium_membership: {
    id: 'premium_membership',
    name: '智臻会员',
    description: '智臻会员权益订阅',
    productId: '2171755',
    productCode: '15890747',
    secondChannel: 'P00000116110',
    touchCode: 'P00000102705',
    marketingCode: '1319080049',
    effectType: 'Type_NextCycle',
    pageMode: 'product_code',
    personalPageId: '',
    mergeCode: '',
    sourceParams: {},
    warning: '套餐变更为次月生效，原主套餐可能失效',
  },
  five_g_enjoy: {
    id: 'five_g_enjoy',
    name: '5G畅享套餐',
    description: '78 至 598 元多档主套餐',
    productId: '2126865',
    productCode: '6784393',
    secondChannel: '',
    touchCode: '',
    marketingCode: '',
    effectType: 'Type_Default',
    pageMode: 'product_code',
    personalPageId: '',
    mergeCode: '',
    sourceParams: { fromRecommend: '3', pageSource: '100', pageid: 'f3f4486601a4496bb461cc032a615d10' },
    warning: '主套餐变更可能影响原套餐及关联业务，请核对档位规则',
  },
  fly_card_8: {
    id: 'fly_card_8',
    name: '8元4G飞享卡',
    description: '8 元基础主套餐',
    productId: '2165665',
    productCode: '11489145',
    secondChannel: '',
    touchCode: '',
    marketingCode: '',
    effectType: 'Type_Default',
    pageMode: 'product_code',
    personalPageId: '',
    mergeCode: '',
    sourceParams: {},
    warning: '主套餐变更可能影响原套餐及关联业务，请核对档位规则',
  },
  excellent_device_offer: {
    id: 'excellent_device_offer',
    name: '卓越会员购机优惠',
    description: '0 元购机优惠权益',
    productId: '2154200',
    productCode: '12193836',
    secondChannel: 'WXQ',
    touchCode: '',
    marketingCode: '',
    effectType: 'Type_Default',
    pageMode: 'product_code',
    personalPageId: '',
    mergeCode: '',
    sourceParams: { secondChannel: 'WXQ' },
    warning: '本业务为购机优惠权益，最终资格以上游实时校验为准',
  },
  traffic_member_20: {
    id: 'traffic_member_20',
    name: '10GB流量+热门会员',
    description: '20 元流量与会员融合包',
    productId: '2126211',
    productCode: '4888051',
    secondChannel: 'WXQ',
    touchCode: '',
    marketingCode: '',
    effectType: 'Type_Default',
    pageMode: 'product_code',
    personalPageId: '',
    mergeCode: '',
    sourceParams: { secondChannel: 'WXQ' },
    warning: '合约期 12 个月，流量与会员权益以实时产品规则为准',
  },
  good_gifts_membership: {
    id: 'good_gifts_membership',
    name: '好礼多多会员版',
    description: '承诺消费、20GB 流量与 PLUS 灵活会员',
    productId: '',
    productCode: '',
    secondChannel: '',
    touchCode: '',
    marketingCode: '',
    effectType: 'Type_Default',
    pageMode: 'personal_page',
    personalPageId: '2025100909463488702003179',
    mergeCode: '2394993',
    sourceParams: { fromRecommend: '3', pageSource: '100', pageid: 'bff92c1764dc4fb18b5bf03c33d9a5c5' },
    warning: '活动立即生效、有效期 24 个月并自动续订；承诺低消和权益以上游实时规则为准',
  },
  good_gifts_data: {
    id: 'good_gifts_data',
    name: '好礼多多流量版',
    description: '通过个性化商品页实时查询流量版档位',
    productId: '',
    productCode: '',
    secondChannel: '',
    touchCode: '',
    marketingCode: '',
    effectType: 'Type_Default',
    pageMode: 'personal_page',
    personalPageId: '2025101316480230602003289',
    mergeCode: '4892902',
    sourceParams: { fromRecommend: '3', pageSource: '100', pageid: 'bff92c1764dc4fb18b5bf03c33d9a5c5' },
    warning: '流量、承诺消费、合约期和续订规则以上游个性化商品页实时返回为准',
  },
} as const

export type RetailBusinessId = keyof typeof RETAIL_PRODUCT_PRESETS

export function getRetailProductPreset(value: unknown): typeof RETAIL_PRODUCT_PRESETS[RetailBusinessId] {
  const id = text(value) as RetailBusinessId
  return RETAIL_PRODUCT_PRESETS[id] || RETAIL_PRODUCT_PRESETS.premium_membership
}

export type BenefitOrderWorkflow = 'building_bricks' | 'premium_membership' | 'coc_app' | 'lucky_bag'
export type BenefitOrderStage =
  | 'initialized'
  | 'login_sms_sent'
  | 'authenticated'
  | 'product_ready'
  | 'selection_ready'
  | 'order_sms_sent'
  | 'ordering'
  | 'finished'

type JsonRecord = Record<string, unknown>

export type BenefitModule = {
  id: string
  productCode: string
  name: string
  fee: number
  display: string
  standards: string
  category: 'flow' | 'voice' | 'sms'
}

export type PremiumNorm = {
  id: string
  packageId: string
  name: string
  price: number
  bizIntfCode: string
  productTags: string
  candidateIds: string[]
  variantCount: number
}

export type CustomPremiumNormInput = {
  id: string
  packageId?: string
  name?: string
  price?: number
  bizIntfCode?: string
}

export type BenefitProtocol = {
  name: string
  content: string
  sequenceId?: string
  protocolId?: string
}

export type BenefitOrderResult = {
  success: boolean
  accepted: boolean
  uncertain: boolean
  code: string
  message: string
  orderId?: string
  orderStatus?: string
  completedAt: string
  response?: unknown
}

export type BenefitOrderProduct = {
  bagStatus?: LuckyBagStatus
  name: string
  productCode: string
  rulesHtml: string
  modules?: BenefitModule[]
  norms?: PremiumNorm[]
  selectedIds?: string[]
  selectedName?: string
  selectedPrice?: number
  details?: Array<{ label: string; value: string }>
  eligible?: boolean
  eligibilityMessage?: string
  protocol?: BenefitProtocol
  protocolRequired?: boolean
  warnings: string[]
}

type SessionBase = {
  id: string
  ownerKey: string
  workflow: BenefitOrderWorkflow
  stage: BenefitOrderStage
  phone: string
  maskedPhone: string
  accountId?: string
  provinceCode?: string
  cityCode?: string
  product?: BenefitOrderProduct
  loginSmsSentAt?: number
  orderSmsSentAt?: number
  orderInFlight: boolean
  lastResult?: BenefitOrderResult
  createdAt: number
  updatedAt: number
  expiresAt: number
}

type BuildingSession = SessionBase & {
  workflow: 'building_bricks'
  cookie: string
  aurora: CocAuroraContext
  userId?: string
  pageId: string
  touchCode: string
  mainProductCode: string
  orderProductCode: string
}

type PremiumSession = SessionBase & {
  workflow: 'premium_membership'
  channelCode?: string
  cookie: string
  authorization: string
  secondChannel: string
  productId: string
  productCode: string
  touchCode: string
  marketingCode: string
  effectType: string
  pageMode: 'product_code' | 'personal_page'
  personalPageId: string
  mergeCode: string
  businessId: RetailBusinessId
  productName: string
  sourceParams: Record<string, string>
  warning: string
  productRaw?: JsonRecord
  normRaw?: JsonRecord
  relevanceActivities?: Array<{ relActivityId: string; relActivityType: number }>
  retailActivityFields?: { activityType?: number; activityId?: string }
  bookTime?: string
}

type CocAppSession = SessionBase & {
  workflow: 'coc_app'
  appBusinessId: CocAppBusinessId
  cookie: string
  aurora: CocAuroraContext
  userId?: string
  pageId: string
  touchCode: string
  productCode: string
  sourcePath: string
  sourceUrl: string
  warning: string
  relationOrdered?: boolean
  loginMode: 'sms' | 'app_cookie'
}

type LuckyBagSession = SessionBase & {
  workflow: 'lucky_bag'
  bagVariant: LuckyBagVariant
  cookie: string
  aurora: CocAuroraContext
  userId?: string
  operationInFlight?: boolean
  bagBaseRulesHtml?: string
}

type CocSession = BuildingSession | CocAppSession | LuckyBagSession
type BenefitOrderSession = CocSession | PremiumSession

export type BenefitOrderSessionView = {
  id: string
  workflow: BenefitOrderWorkflow
  stage: BenefitOrderStage
  maskedPhone: string
  accountId?: string
  provinceCode?: string
  cityCode?: string
  loginMode?: 'sms' | 'app_cookie'
  sourceUrl?: string
  product?: BenefitOrderProduct
  loginSmsCooldownSeconds: number
  orderSmsCooldownSeconds: number
  lastResult?: BenefitOrderResult
  createdAt: string
  updatedAt: string
  expiresAt: string
}

export class BenefitOrderError extends Error {
  readonly code: string
  readonly status: number

  constructor(message: string, code = 'UPSTREAM_ERROR', status = 424) {
    super(message)
    this.name = 'BenefitOrderError'
    this.code = code
    this.status = status
  }
}

const sessions = new Map<string, BenefitOrderSession>()

function asRecord(value: unknown): JsonRecord | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : undefined
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function text(value: unknown): string {
  return value === null || value === undefined ? '' : String(value)
}

function richText(value: unknown, depth = 0): string {
  if (depth > 4 || value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map((item) => richText(item, depth + 1)).filter(Boolean).join('\n')
  const record = asRecord(value)
  if (!record) return text(value)
  for (const key of ['protocolContent', 'content', 'agreementContent', 'html', 'text', 'value']) {
    const result = richText(record[key], depth + 1)
    if (result) return result
  }
  return ''
}

function numberValue(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function maskPhone(phone: string): string {
  return /^1\d{10}$/.test(phone) ? `${phone.slice(0, 3)}****${phone.slice(-4)}` : '***'
}

function extractCocAppCookie(cookie: string): string {
  const userToken = parseCookieHeader(cookie).get('User-Token')
  return userToken ? buildCookieHeader(new Map([['User-Token', userToken]])) : ''
}

function resolvePremiumPhone(value: unknown): string {
  const candidate = text(value).trim()
  if (/^1\d{10}$/.test(candidate)) return candidate
  if (!/^[A-Fa-f0-9]+$/.test(candidate) || candidate.length % 32 !== 0) return ''
  try {
    const decrypted = premiumAuthDecrypt(candidate)
    if (/^1\d{10}$/.test(decrypted)) return decrypted
    const parsed = JSON.parse(decrypted) as unknown
    return typeof parsed === 'string' && /^1\d{10}$/.test(parsed) ? parsed : ''
  } catch {
    return ''
  }
}

function secondsRemaining(sentAt?: number): number {
  if (!sentAt) return 0
  return Math.max(0, Math.ceil((sentAt + SMS_COOLDOWN_MS - Date.now()) / 1000))
}

function cleanupSessions(): void {
  const current = Date.now()
  for (const [id, session] of sessions) {
    if (session.expiresAt <= current) sessions.delete(id)
  }
}

function touch(session: BenefitOrderSession): void {
  session.updatedAt = Date.now()
  session.expiresAt = session.updatedAt + SESSION_TTL_MS
}

function view(session: BenefitOrderSession): BenefitOrderSessionView {
  return {
    id: session.id,
    workflow: session.workflow,
    stage: session.stage,
    maskedPhone: session.maskedPhone,
    accountId: session.accountId,
    provinceCode: session.provinceCode,
    cityCode: session.cityCode,
    loginMode: session.workflow === 'lucky_bag' ? 'sms' : session.workflow === 'coc_app' ? session.loginMode : undefined,
    sourceUrl: session.workflow === 'lucky_bag' ? luckyBagSourceUrl(session.bagVariant) : session.workflow === 'coc_app' ? session.sourceUrl : undefined,
    product: session.product,
    loginSmsCooldownSeconds: secondsRemaining(session.loginSmsSentAt),
    orderSmsCooldownSeconds: secondsRemaining(session.orderSmsSentAt),
    lastResult: session.lastResult,
    createdAt: new Date(session.createdAt).toISOString(),
    updatedAt: new Date(session.updatedAt).toISOString(),
    expiresAt: new Date(session.expiresAt).toISOString(),
  }
}

function getSession(id: string): BenefitOrderSession {
  cleanupSessions()
  const session = sessions.get(id)
  if (!session) throw new BenefitOrderError('订购会话不存在或已过期，请重新开始', 'SESSION_NOT_FOUND', 404)
  return session
}

function requireStage(session: BenefitOrderSession, allowed: BenefitOrderStage[], action: string): void {
  if (allowed.includes(session.stage)) return
  throw new BenefitOrderError(`当前流程状态不能${action}，请按步骤操作`, 'INVALID_STAGE', 409)
}

function requireCooldown(sentAt: number | undefined, action: string): void {
  const remaining = secondsRemaining(sentAt)
  if (remaining > 0) throw new BenefitOrderError(`${action}过于频繁，请 ${remaining} 秒后重试`, 'SMS_COOLDOWN', 429)
}

function parseJson(textValue: string): JsonRecord {
  try {
    const parsed = JSON.parse(textValue) as unknown
    const record = asRecord(parsed)
    if (record) return record
  } catch {
    // Try the Base64 COC response form below.
  }
  try {
    const parsed = JSON.parse(Buffer.from(textValue, 'base64').toString('utf8')) as unknown
    const record = asRecord(parsed)
    if (record) return record
  } catch {
    // Fall through to a stable upstream error.
  }
  throw new BenefitOrderError('上游返回格式异常', 'UPSTREAM_FORMAT')
}

function ensureCocSuccess(payload: JsonRecord, fallback: string): void {
  if (text(payload.code) === '0') return
  throw new BenefitOrderError(text(payload.message) || fallback, text(payload.code) || 'UPSTREAM_ERROR')
}

function ensureRetailSuccess(payload: JsonRecord, fallback: string): void {
  if (text(payload.returnCode) === '0') return
  throw new BenefitOrderError(text(payload.returnMessage) || fallback, text(payload.returnCode) || 'UPSTREAM_ERROR')
}

function cocReferer(session: CocSession): string {
  if (session.workflow === 'lucky_bag') return luckyBagSourceUrl(session.bagVariant)
  if (session.workflow === 'building_bricks') {
    return `https://dev.coc.10086.cn/coc/web2/buildingBricksPak/?pageId=${encodeURIComponent(session.pageId)}&channelId=${encodeURIComponent(session.touchCode)}`
  }
  const url = new URL(session.sourcePath, COC_BASE_URL)
  url.searchParams.set('pageId', session.pageId)
  if (session.touchCode && session.appBusinessId === 'five_ga') url.searchParams.set('channelId', session.touchCode)
  return url.toString()
}

async function cocRequest(session: CocSession, path: string, body: unknown, encrypted: boolean | 'meteor' = false): Promise<JsonRecord> {
  const meteor = encrypted === 'meteor' ? createCocMeteorContext() : undefined
  const requestBody = JSON.stringify(meteor ? { cocEnContent: cocMeteorEncrypt(body, meteor.key) } : encrypted
    ? { cocEnContent: cocAuroraEncrypt(body, session.aurora.key) }
    : body)
  const response = await httpsRequestText({
    url: new URL(path, COC_BASE_URL).toString(),
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Origin: 'https://dev.coc.10086.cn',
      Referer: cocReferer(session),
      'User-Agent': DEFAULT_UA,
      ...(meteor ? { 'coc-meteor': meteor.encryptedKey, 'coc-meteor-v': '2' } : encrypted ? {
        'coc-en-version': '1486234121417629696',
        'coc-aurora': session.aurora.encryptedKey,
        'coc-aurora-v': '2',
      } : {}),
      ...(session.cookie ? { Cookie: session.cookie } : {}),
    },
    body: requestBody,
    timeoutMs: 20_000,
  })
  const merged = mergeCookieWithSetCookie({ cookie: session.cookie, setCookie: response.headers['set-cookie'] })
  session.cookie = merged.cookie
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new BenefitOrderError(`上游 HTTP ${response.statusCode}`, 'UPSTREAM_HTTP')
  }
  const payload = parseJson(response.bodyText)
  if (meteor && typeof payload.returnData === 'string') {
    return parseJson(cocAuroraDecrypt(payload.returnData, meteor.key))
  }
  if (session.workflow === 'lucky_bag' && text(payload.code) === '40') {
    throw new BenefitOrderError('福袋登录态已过期，请重新开始短信登录', 'COC_LOGIN_EXPIRED', 410)
  }
  return payload
}

function luckyRequest(session: LuckyBagSession): LuckyBagRequest {
  return (path, body, encryption) => cocRequest(session, path, body, encryption === 'meteor' ? 'meteor' : encryption === 'aurora')
}

async function withLuckySessionLock<T>(id: string, task: () => Promise<T>): Promise<T> {
  const session = getSession(id)
  if (session.workflow !== 'lucky_bag') return task()
  if (session.operationInFlight) throw new BenefitOrderError('福袋操作正在进行，请稍后重试', 'BAG_OPERATION_IN_FLIGHT', 409)
  session.operationInFlight = true
  try { return await task() } finally { session.operationInFlight = false }
}

async function withLuckySmsLock<T>(id: string, kind: 'login' | 'order', task: () => Promise<T>): Promise<T> {
  return withLuckySessionLock(id, async () => {
    const session = getSession(id)
    if (session.workflow !== 'lucky_bag') return task()
    const unlock = lockLuckyBagSms(session, kind)
    try { return await task() } finally { unlock() }
  })
}

export async function createLuckyBagSession(args: { ownerKey: string; phone: string; accountId?: string; bagVariant: LuckyBagVariant }): Promise<BenefitOrderSessionView> {
  if (!/^1\d{10}$/.test(args.phone)) throw new BenefitOrderError('请输入正确的11位移动手机号', 'INVALID_PHONE', 400)
  const now = Date.now()
  const session: LuckyBagSession = {
    id: crypto.randomUUID(), ownerKey: args.ownerKey, accountId: args.accountId,
    workflow: 'lucky_bag', bagVariant: args.bagVariant, stage: 'initialized', phone: args.phone,
    maskedPhone: maskPhone(args.phone), cookie: '', aurora: createCocAuroraContext(),
    orderInFlight: false, createdAt: now, updatedAt: now, expiresAt: now + SESSION_TTL_MS,
    loginSmsSentAt: luckyBagSmsSentAt(args, 'login'), orderSmsSentAt: luckyBagSmsSentAt(args, 'order'),
  }
  const payload = await cocRequest(session, 'user/userVerification', { mobile: session.phone }, true)
  ensureCocSuccess(payload, '手机号校验失败')
  const data = asRecord(payload.data)
  if (!data || text(data.isCmcc) === '1') throw new BenefitOrderError('请输入中国移动手机号', 'NOT_CMCC_PHONE', 400)
  session.provinceCode = text(data.cityId)
  session.cityCode = text(data.areaCode)
  sessions.set(session.id, session)
  return view(session)
}

function premiumPageParams(session: PremiumSession): URLSearchParams {
  if (session.pageMode === 'personal_page') {
    const params = new URLSearchParams()
    for (const key of ['fromRecommend', 'pageid']) {
      if (session.sourceParams[key]) params.set(key, session.sourceParams[key])
    }
    params.set('personalPageId', session.personalPageId)
    return params
  }
  const params = new URLSearchParams({ productCode: session.productCode, ...session.sourceParams })
  if (session.marketingCode) params.set('yx', session.marketingCode)
  if (session.touchCode) params.set('channelId', session.touchCode)
  if (session.secondChannel) params.set('secondChannel', session.secondChannel)
  return params
}

function premiumPagePath(session: PremiumSession): string {
  return session.pageMode === 'personal_page' ? 'newCustomShopDetail' : 'shopDetail'
}

function premiumHeaders(session: PremiumSession, auth = false): Record<string, string> {
  const refererParams = premiumPageParams(session)
  return {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json; charset=UTF-8',
    Origin: 'https://wx.10086.cn',
    Referer: `https://wx.10086.cn/website/businessPlatform/${premiumPagePath(session)}?${refererParams.toString()}`,
    'User-Agent': DEFAULT_UA,
    channelid: 'BUSINESS_H5',
    'x-app-version': auth ? '1.0.1' : '1.0.2',
    ...(auth ? {
      'chop-real-host': 'wx.10086.cn',
      pageType: 'xds18',
    } : {}),
    ...(session.secondChannel ? { 'Chop-Second-Channel': session.secondChannel } : {}),
    ...(session.authorization ? { Authorization: session.authorization } : {}),
    ...(session.cookie ? { Cookie: session.cookie } : {}),
  }
}

async function retailRequest(session: PremiumSession, path: string, body: unknown): Promise<JsonRecord> {
  const response = await httpsRequestText({
    url: new URL(path, RETAIL_BASE_URL).toString(),
    method: 'POST',
    headers: premiumHeaders(session),
    body: premiumWireEncrypt(body),
    timeoutMs: path.endsWith('/order/createOrder') ? 30_000 : 20_000,
  })
  const merged = mergeCookieWithSetCookie({ cookie: session.cookie, setCookie: response.headers['set-cookie'] })
  session.cookie = merged.cookie
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new BenefitOrderError(`新零售网关 HTTP ${response.statusCode}`, 'UPSTREAM_HTTP')
  }
  const outer = parseJson(response.bodyText)
  const cipher = text(outer.body)
  if (!cipher) throw new BenefitOrderError('新零售网关响应缺少加密正文', 'UPSTREAM_FORMAT')
  return parseJson(premiumWireDecrypt(cipher))
}

async function authenticatePremium(args: {
  cookie: string
  ownerKey: string
  accountId: string
  productId?: string
  productCode?: string
  touchCode?: string
  marketingCode?: string
  secondChannel?: string
  businessId?: RetailBusinessId
  sourceParams?: Record<string, string>
  productName?: string
  effectType?: string
  pageMode?: 'product_code' | 'personal_page'
  personalPageId?: string
  mergeCode?: string
  warning?: string
}): Promise<PremiumSession> {
  const defaults = RETAIL_PRODUCT_PRESETS.premium_membership
  const current = Date.now()
  const session: PremiumSession = {
    id: crypto.randomUUID(),
    ownerKey: args.ownerKey,
    accountId: args.accountId,
    workflow: 'premium_membership',
    stage: 'initialized',
    phone: '',
    maskedPhone: '***',
    cookie: args.cookie,
    authorization: '',
    secondChannel: args.secondChannel ?? defaults.secondChannel,
    productId: args.productId ?? defaults.productId,
    productCode: args.productCode ?? defaults.productCode,
    touchCode: args.touchCode ?? defaults.touchCode,
    marketingCode: args.marketingCode ?? defaults.marketingCode,
    effectType: args.effectType ?? defaults.effectType,
    pageMode: args.pageMode ?? defaults.pageMode,
    personalPageId: args.personalPageId ?? defaults.personalPageId,
    mergeCode: args.mergeCode ?? defaults.mergeCode,
    businessId: args.businessId || 'premium_membership',
    productName: args.productName ?? defaults.name,
    sourceParams: { ...(args.sourceParams || {}) },
    warning: args.warning ?? defaults.warning,
    orderInFlight: false,
    createdAt: current,
    updatedAt: current,
    expiresAt: current + SESSION_TTL_MS,
  }
  if (session.pageMode === 'personal_page' && !session.personalPageId) {
    throw new BenefitOrderError('个性化商品页缺少 personalPageId', 'PERSONAL_PAGE_ID_REQUIRED', 400)
  }
  const backUrl = `/website/businessPlatform/${premiumPagePath(session)}?${premiumPageParams(session).toString()}`
  const response = await httpsRequestText({
    url: new URL('nrauth/auth/encryt/userAuth', RETAIL_BASE_URL).toString(),
    method: 'POST',
    headers: premiumHeaders(session, true),
    body: premiumAuthEncrypt({ backUrl }),
    timeoutMs: 20_000,
  })
  const merged = mergeCookieWithSetCookie({ cookie: session.cookie, setCookie: response.headers['set-cookie'] })
  session.cookie = merged.cookie
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new BenefitOrderError(`智臻会员 SSO HTTP ${response.statusCode}`, 'PREMIUM_SSO_FAILED')
  }
  const outer = parseJson(response.bodyText)
  const payload = parseJson(premiumAuthDecrypt(text(outer.body)))
  ensureRetailSuccess(payload, '智臻会员 SSO 登录失败')
  const data = asRecord(payload.data)
  const userInfo = asRecord(data?.userInfo)
  const token = text(data?.token || userInfo?.token)
  const phone = resolvePremiumPhone(userInfo?.telephone || userInfo?.aesTelNum)
  if (!token || !/^1\d{10}$/.test(phone)) {
    throw new BenefitOrderError('智臻会员 SSO 未返回有效账号信息', 'PREMIUM_SSO_INVALID')
  }
  session.authorization = token
  session.phone = phone
  session.maskedPhone = maskPhone(phone)
  session.provinceCode = text(userInfo?.provinceCode)
  session.cityCode = text(userInfo?.cityCode)
  session.channelCode = text(userInfo?.channel)
  session.secondChannel = text(userInfo?.secondChannel) || session.secondChannel
  session.stage = 'authenticated'
  touch(session)
  sessions.set(session.id, session)
  return session
}

// Internal transport for callback appointments. Credentials never leave the server.
export async function createRetailCallbackClient(args: { accountId: string; cookie: string; productCode: string }) {
  const session = await authenticatePremium({
    ...args, ownerKey: `callback:${args.accountId}`, businessId: 'custom',
    productId: '', touchCode: '', marketingCode: '', secondChannel: '', productName: '10086 预约回访',
  })
  sessions.delete(session.id)
  const channelCode = session.channelCode || ''
  return {
    phone: session.phone, maskedPhone: session.maskedPhone,
    provinceCode: session.provinceCode || '', cityCode: session.cityCode || '', channelCode,
    request: (path: string, body: unknown) => retailRequest(session, path, body),
  }
}

export async function createRetailProductQuerySession(args: {
  accountId: string
  cookie: string
  productCode: string
}): Promise<string> {
  const session = await authenticatePremium({
    ownerKey: `retail-product-query:${args.accountId}`,
    accountId: args.accountId,
    cookie: args.cookie,
    productCode: args.productCode,
    productId: '',
    touchCode: '',
    marketingCode: '',
    secondChannel: '',
    businessId: 'custom',
    productName: '产品查询',
    warning: '',
  })
  return session.id
}

export async function queryRetailProductInSession(id: string, productCode: string): Promise<Record<string, unknown>> {
  const session = getSession(id)
  if (session.workflow !== 'premium_membership') {
    throw new BenefitOrderError('商城查询会话类型错误', 'INVALID_SESSION_TYPE', 409)
  }
  session.productCode = productCode
  return retailRequest(session, 'nrmix/product/prodWithNormList', { productCode })
}

export function deleteRetailProductQuerySession(id: string): void {
  sessions.delete(id)
}

export async function createBuildingBricksSession(args: {
  ownerKey: string
  phone: string
  accountId?: string
  pageId?: string
  touchCode?: string
  mainProductCode?: string
  orderProductCode?: string
  authSession?: CocPackageSessionRecord
}): Promise<BenefitOrderSessionView> {
  if (!/^1\d{10}$/.test(args.phone)) throw new BenefitOrderError('请输入正确的 11 位手机号', 'INVALID_PHONE', 400)
  const defaults = BENEFIT_ORDER_DEFAULTS.building_bricks
  const current = Date.now()
  const session: BuildingSession = {
    id: crypto.randomUUID(),
    ownerKey: args.ownerKey,
    accountId: args.accountId,
    workflow: 'building_bricks',
    stage: args.authSession ? 'authenticated' : 'initialized',
    phone: args.phone,
    maskedPhone: args.authSession?.maskedMobile || maskPhone(args.phone),
    cookie: args.authSession?.cookie || '',
    aurora: createCocAuroraContext(),
    pageId: args.pageId || defaults.pageId,
    touchCode: args.touchCode || defaults.touchCode,
    mainProductCode: args.mainProductCode || defaults.mainProductCode,
    orderProductCode: args.orderProductCode || defaults.orderProductCode,
    userId: args.authSession?.userId,
    provinceCode: args.authSession?.provinceCode,
    cityCode: args.authSession?.cityCode,
    orderInFlight: false,
    createdAt: current,
    updatedAt: current,
    expiresAt: current + SESSION_TTL_MS,
  }
  if (!args.authSession) {
    const payload = await cocRequest(session, 'user/userVerification', { mobile: session.phone }, true)
    ensureCocSuccess(payload, '手机号校验失败')
    const data = asRecord(payload.data)
    if (text(data?.isCmcc) === '1') throw new BenefitOrderError('请输入中国移动手机号', 'NOT_CMCC_PHONE', 400)
    session.provinceCode = text(data?.cityId)
    session.cityCode = text(data?.areaCode)
  }
  sessions.set(session.id, session)
  return view(session)
}

export async function createPremiumMembershipSession(args: {
  ownerKey: string
  accountId: string
  cookie: string
  productId?: string
  productCode?: string
  touchCode?: string
  marketingCode?: string
  secondChannel?: string
  businessId?: RetailBusinessId
  sourceParams?: Record<string, string>
  productName?: string
  effectType?: string
  pageMode?: 'product_code' | 'personal_page'
  personalPageId?: string
  mergeCode?: string
  warning?: string
}): Promise<BenefitOrderSessionView> {
  return view(await authenticatePremium(args))
}

export async function createCocAppSession(args: {
  ownerKey: string
  phone: string
  accountId: string
  appCookie?: string
  authSession?: CocPackageSessionRecord
  appBusinessId: CocAppBusinessId
  pageId?: string
  touchCode?: string
  productCode?: string
}): Promise<BenefitOrderSessionView> {
  if (!/^1\d{10}$/.test(args.phone)) throw new BenefitOrderError('请输入正确的 11 位手机号', 'INVALID_PHONE', 400)
  const preset = COC_APP_PRODUCT_PRESETS[args.appBusinessId]
  if (!preset) throw new BenefitOrderError('不支持的 COC App 业务', 'INVALID_COC_APP_BUSINESS', 400)
  if (args.authSession && args.authSession.target !== args.appBusinessId) {
    throw new BenefitOrderError('COC 订购凭证与目标业务不匹配', 'COC_SESSION_TARGET_MISMATCH', 400)
  }
  const appCookie = args.authSession?.cookie || extractCocAppCookie(args.appCookie || '')
  const current = Date.now()
  const session: CocAppSession = {
    id: crypto.randomUUID(),
    ownerKey: args.ownerKey,
    accountId: args.accountId,
    workflow: 'coc_app',
    appBusinessId: args.appBusinessId,
    stage: args.authSession ? 'authenticated' : 'initialized',
    phone: args.phone,
    maskedPhone: args.authSession?.maskedMobile || maskPhone(args.phone),
    cookie: appCookie,
    aurora: createCocAuroraContext(),
    pageId: args.pageId || preset.pageId,
    touchCode: args.touchCode || preset.touchCode,
    productCode: args.productCode || preset.productCode,
    sourcePath: preset.sourcePath,
    sourceUrl: preset.sourceUrl,
    warning: preset.warning,
    userId: args.authSession?.userId,
    provinceCode: args.authSession?.provinceCode,
    cityCode: args.authSession?.cityCode,
    loginMode: appCookie ? 'app_cookie' : 'sms',
    orderInFlight: false,
    createdAt: current,
    updatedAt: current,
    expiresAt: current + SESSION_TTL_MS,
  }
  if (!args.authSession) {
    const verification = await cocRequest(session, 'user/userVerification', { mobile: session.phone }, true)
    ensureCocSuccess(verification, '手机号校验失败')
    const data = asRecord(verification.data)
    if (text(data?.isCmcc) === '1') throw new BenefitOrderError('请输入中国移动手机号', 'NOT_CMCC_PHONE', 400)
  }
  sessions.set(session.id, session)
  return view(session)
}

export function readBenefitOrderSession(id: string): BenefitOrderSessionView {
  const session = getSession(id)
  touch(session)
  return view(session)
}

export function rewindBenefitOrderSession(id: string): BenefitOrderSessionView {
  const session = getSession(id)
  if (session.workflow === 'lucky_bag') {
    if (session.operationInFlight) throw new BenefitOrderError('福袋操作正在进行', 'BAG_OPERATION_IN_FLIGHT', 409)
    requireStage(session, ['selection_ready', 'order_sms_sent'], '返回上一步')
    if (session.product) session.product = {
      ...session.product, selectedIds: undefined, selectedName: undefined, selectedPrice: undefined,
      protocol: undefined, protocolRequired: false, eligible: undefined, eligibilityMessage: undefined,
      rulesHtml: session.bagBaseRulesHtml || '',
    }
    session.stage = 'product_ready'
    touch(session)
    return view(session)
  }
  if (session.workflow !== 'premium_membership') {
    throw new BenefitOrderError('只有移动商城业务支持返回上一步', 'BACK_NOT_SUPPORTED', 409)
  }
  requireStage(session, ['selection_ready', 'order_sms_sent'], '返回上一步')
  if (!session.product) throw new BenefitOrderError('请先加载产品信息', 'PRODUCT_REQUIRED', 409)
  session.product = {
    ...session.product,
    selectedIds: undefined,
    selectedName: undefined,
    selectedPrice: undefined,
    details: undefined,
    eligible: undefined,
    eligibilityMessage: undefined,
    protocol: undefined,
    protocolRequired: false,
    warnings: [],
  }
  session.normRaw = undefined
  session.relevanceActivities = undefined
  session.retailActivityFields = undefined
  session.bookTime = undefined
  session.orderSmsSentAt = undefined
  session.lastResult = undefined
  session.stage = 'product_ready'
  touch(session)
  return view(session)
}

export function assertBenefitOrderSessionAccess(id: string, ownerKey: string): void {
  const session = getSession(id)
  if (ownerKey === 'admin' || session.ownerKey === ownerKey) return
  throw new BenefitOrderError('无权访问该订购会话', 'SESSION_FORBIDDEN', 403)
}

export const sendBenefitLoginSms = (id: string) => withLuckySmsLock(id, 'login', () => sendBenefitLoginSmsImpl(id))
async function sendBenefitLoginSmsImpl(id: string): Promise<BenefitOrderSessionView> {
  const session = getSession(id)
  if (session.workflow === 'premium_membership') throw new BenefitOrderError('该业务不使用独立登录验证码', 'LOGIN_SMS_NOT_REQUIRED', 409)
  requireStage(session, ['initialized', 'login_sms_sent'], '发送登录验证码')
  requireCooldown(session.loginSmsSentAt, '登录验证码发送')
  const body = session.workflow === 'lucky_bag'
    ? { mobile: session.phone, userId: '' }
    : session.workflow === 'building_bricks'
    ? { mobile: session.phone }
    : { mobile: session.phone, userId: '', smsCodeTypeEnum: '502' }
  const payload = await cocRequest(session, 'user/smsCode', body, true)
  ensureCocSuccess(payload, '登录验证码发送失败')
  session.loginSmsSentAt = Date.now()
  if (session.workflow === 'lucky_bag') recordLuckyBagSms(session, 'login')
  session.stage = 'login_sms_sent'
  touch(session)
  return view(session)
}

export const loginBenefitSession = (id: string, code: string) => withLuckySessionLock(id, () => loginBenefitSessionImpl(id, code))
async function loginBenefitSessionImpl(id: string, code: string): Promise<BenefitOrderSessionView> {
  const session = getSession(id)
  if (session.workflow === 'premium_membership') throw new BenefitOrderError('该业务已通过账号 SSO 登录', 'LOGIN_NOT_REQUIRED', 409)
  requireStage(session, ['login_sms_sent'], '登录')
  if (session.workflow === 'lucky_bag' && !/^\d{6}$/.test(code)) throw new BenefitOrderError('请输入6位登录验证码', 'INVALID_SMS_CODE', 400)
  const payload = await cocRequest(session, 'user/loginCheck', session.workflow === 'lucky_bag' ? {
    mobile: session.phone, smsCode: code, verifyType: 0,
  } : {
    mobile: session.phone,
    smsCode: code,
    userId: '',
    smsCodeTypeEnum: 502,
    verifyType: 0,
  }, true)
  ensureCocSuccess(payload, '登录失败')
  const data = asRecord(payload.data)
  session.userId = text(data?.userId)
  session.provinceCode = text(data?.provinceCode) || session.provinceCode
  session.cityCode = text(data?.cityCode) || session.cityCode
  if (session.workflow === 'lucky_bag') {
    if (!session.userId || !session.provinceCode) throw new BenefitOrderError('上游缺少独立登录凭证', 'LOGIN_DATA_INCOMPLETE', 424)
    const masked = text(data?.maskedMobile)
    if (masked && masked !== maskPhone(session.phone)) throw new BenefitOrderError('登录账号与办理手机号不一致', 'ACCOUNT_SESSION_MISMATCH', 409)
    session.maskedPhone = masked || maskPhone(session.phone)
  }
  if (session.workflow === 'coc_app') session.loginMode = 'sms'
  const cookies = parseCookieHeader(session.cookie)
  const token = text(data?.token)
  if (token && !cookies.has('User-Token')) {
    cookies.set('User-Token', token)
    session.cookie = buildCookieHeader(cookies)
  }
  session.stage = 'authenticated'
  touch(session)
  return view(session)
}

function normalizeModules(entity: JsonRecord | undefined): BenefitModule[] {
  const groups: Array<[BenefitModule['category'], unknown]> = [
    ['flow', entity?.flow],
    ['voice', entity?.calls],
    ['sms', entity?.sms],
  ]
  return groups.flatMap(([category, items]) => asArray(items).map(asRecord).filter(Boolean).map((item) => ({
    id: text(item?.goodsId),
    productCode: text(item?.productCode),
    name: text(item?.goodsName),
    fee: numberValue(item?.fee),
    display: text(item?.display),
    standards: text(item?.standards),
    category,
  })).filter((item) => item.id && item.productCode))
}

function resolveBuildingMainProductCode(flowCode: string, voiceCode: string): string {
  const flowIndex = BUILDING_FLOW_CODES.indexOf(flowCode as typeof BUILDING_FLOW_CODES[number])
  const voiceIndex = BUILDING_VOICE_CODES.indexOf(voiceCode as typeof BUILDING_VOICE_CODES[number])
  if (flowIndex < 0 || voiceIndex < 0) {
    throw new BenefitOrderError('所选流量或语音模组缺少主套餐映射', 'BUILDING_PRODUCT_MAPPING_MISSING', 409)
  }
  return String(789000000750 + flowIndex * BUILDING_VOICE_CODES.length + voiceIndex)
}

function normalizeNorms(product: JsonRecord | undefined): PremiumNorm[] {
  const norms = asArray(product?.norms).map(asRecord).filter(Boolean).map((norm) => ({
    id: text(norm?.normId),
    packageId: text(norm?.productCode),
    name: text(norm?.name),
    price: numberValue(norm?.price) / 100,
    bizIntfCode: text(norm?.bizIntfCode) || '001_JIYUN',
    productTags: text(norm?.productTags),
    candidateIds: [text(norm?.normId)],
    variantCount: 1,
  })).filter((norm) => norm.id && norm.packageId)
  const grouped = new Map<string, PremiumNorm>()
  for (const norm of norms) {
    const key = `${norm.name}\u0000${norm.price}`
    const existing = grouped.get(key)
    if (existing) {
      existing.candidateIds.push(norm.id)
      existing.variantCount = existing.candidateIds.length
    } else {
      grouped.set(key, norm)
    }
  }
  return Array.from(grouped.values())
}

function personalPageRulesHtml(page: JsonRecord, product: JsonRecord): string {
  const parts: string[] = []
  for (const component of asArray(page.components).map(asRecord).filter(Boolean)) {
    const popup = asRecord(component?.popup)
    const popupRows = asArray(popup?.keyValuePairs).map(asRecord).filter(Boolean)
    if (popupRows.length > 0) {
      parts.push(`<table><tbody>${popupRows.map((row) => `<tr><th>${text(row?.leftvalue)}</th><td>${text(row?.rightvalue)}</td></tr>`).join('')}</tbody></table>`)
    }
    const description = text(asRecord(component?.configContent)?.desc)
    if (description) parts.push(description)
  }
  for (const norm of asArray(product.norms).map(asRecord).filter(Boolean)) {
    for (const segment of [
      ...asArray(norm?.freedomSegments),
      ...asArray(norm?.segments),
      ...asArray(norm?.mergeVmList),
    ].map(asRecord).filter(Boolean)) {
      const title = text(segment?.title)
      const content = text(segment?.content)
      const rows = asArray(segment?.table).map(asRecord).filter(Boolean)
      if (content) parts.push(`${title ? `<h3>${title}</h3>` : ''}${content}`)
      if (rows.length > 0) {
        parts.push(`${title ? `<h3>${title}</h3>` : ''}<table><tbody>${rows.map((row) => `<tr><th>${text(row?.leftname || row?.leftvalue)}</th><td>${text(row?.rightname || row?.rightvalue)}</td></tr>`).join('')}</tbody></table>`)
      }
    }
  }
  return Array.from(new Set(parts.filter(Boolean))).join('\n') || richText(product.intro)
}

function retailProductSaleMessage(product: JsonRecord, now = Date.now()): string {
  if (numberValue(product.status) !== 2) return '当前业务未处于在售状态'
  const startAt = numberValue(product.startsendTimeSpan)
  const endAt = numberValue(product.expiretimeSpan)
  if (startAt && now < startAt) return `商品将于 ${text(product.startSendTime) || '活动开始时间'} 开售`
  if (endAt && now > endAt) return '商品活动已结束'
  return ''
}

function normalizeCocTariffs(value: unknown): PremiumNorm[] {
  return asArray(value).map(asRecord).filter(Boolean).map((item) => {
    const productCode = text(item?.productCode)
    return {
      id: productCode,
      packageId: productCode,
      name: text(item?.productName) || `套餐 ${productCode}`,
      price: numberValue(item?.productPrice || item?.priceTier),
      bizIntfCode: '',
      productTags: text(item?.globalLevel),
      candidateIds: [productCode],
      variantCount: 1,
    }
  }).filter((item) => item.id)
}

function normalizeFiveGaProducts(value: unknown): PremiumNorm[] {
  const data = asRecord(value)
  const candidates = [
    data?.mainRecommend,
    ...asArray(data?.recommendList),
    ...asArray(data?.hideRecommendList),
  ]
  const unique = new Map<string, JsonRecord>()
  for (const candidate of candidates.map(asRecord).filter(Boolean)) {
    const code = text(candidate?.productCode)
    if (code) unique.set(code, candidate!)
  }
  return normalizeCocTariffs(Array.from(unique.values())).sort((left, right) => left.price - right.price)
}

function cocRulesHtml(value: unknown): string {
  const data = asRecord(value)
  return asArray(data?.configList).map(asRecord).map((item) => text(item?.subContent)).filter(Boolean).join('\n')
}

export const prepareBenefitProduct = (id: string) => withLuckySessionLock(id, () => prepareBenefitProductImpl(id))
async function prepareBenefitProductImpl(id: string): Promise<BenefitOrderSessionView> {
  const session = getSession(id)
  if (session.workflow === 'lucky_bag') {
    requireStage(session, ['authenticated', 'product_ready', 'selection_ready', 'finished'], '查询福袋产品与订购关系')
    session.product = await prepareLuckyBagProduct(session, luckyRequest(session))
    session.lastResult = undefined
    session.stage = 'product_ready'
    touch(session)
    return view(session)
  }
  requireStage(session, ['authenticated', 'product_ready', 'selection_ready'], '获取产品信息')
  if (session.workflow === 'building_bricks') {
    const feePayload = await cocRequest(session, 'editor/common/proxy/toC/building/cost/info/query', {})
    ensureCocSuccess(feePayload, '积木套餐模组查询失败')
    const feeData = asRecord(feePayload.data)
    const modules = normalizeModules(asRecord(feeData?.entity))
    if (!modules.some((item) => item.category === 'flow') || !modules.some((item) => item.category === 'voice')) {
      throw new BenefitOrderError('上游未返回完整的流量和语音模组', 'MODULES_INCOMPLETE')
    }
    const rulesPayload = await cocRequest(session, 'grocer/copyWriting/page/query', {
      configType: '2',
      pageId: session.pageId,
      productCode: session.mainProductCode,
      provinceCode: session.provinceCode,
    })
    ensureCocSuccess(rulesPayload, '积木套餐规则查询失败')
    const rulesData = asRecord(rulesPayload.data)
    const rulesHtml = asArray(rulesData?.configList).map(asRecord).map((item) => text(item?.subContent)).filter(Boolean).join('\n')
    session.product = {
      name: '积木套餐',
      productCode: session.mainProductCode,
      rulesHtml,
      modules,
      warnings: [],
    }
  } else if (session.workflow === 'coc_app') {
    let norms: PremiumNorm[] = []
    let eligible: boolean | undefined
    const warnings: string[] = []
    if (session.appBusinessId === 'smart_life') {
      const tariff = await cocRequest(session, 'pkg/smart/life/queryTariff', {
        provinceCode: session.provinceCode,
        productCode: session.productCode,
      })
      ensureCocSuccess(tariff, '智臻会员档位查询失败')
      norms = normalizeCocTariffs(tariff.data)
      const relationGroups = [
        ['2025999900037603', '2025999900037604', '2025999900037605', '2025999900037606', '2025999900037607', '2025999900037608', '2025999900037609'],
        ['2025999900037610', '2025999900037611', '2025999900037612', '2025999900037613', '2025999900037614', '2025999900037615', '2025999900037616'],
        ['2025999900037617', '2025999900037618', '2025999900037619', '2025999900037620', '2025999900037621', '2025999900037622', '2025999900037623'],
      ]
      const relations = await Promise.all(relationGroups.map((productCodes) => cocRequest(
        session,
        'pkg/contract/common/newProductRelation',
        { productCodes, type: 20, touchCode: '', pageId: '', userId: session.userId, mobile: '' },
      )))
      session.relationOrdered = relations.some((payload) => text(payload.code) === '0' && Boolean(asRecord(payload.data)?.isOrder))
      if (session.relationOrdered) warnings.push('账号已存在智臻会员相关产品关系，请核对后再办理')
    } else {
      const products = await cocRequest(session, 'card/bundling/auxiliary/selectFiveGAProduct', {
        pageId: session.pageId,
        touchCode: session.touchCode,
        userId: session.userId,
      })
      ensureCocSuccess(products, '全球通 5GA 档位查询失败')
      norms = normalizeFiveGaProducts(products.data)
      const relation = await cocRequest(session, 'card/bundling/auxiliary/fiveGARelationCheck', {
        productCodes: norms.map((item) => item.id),
        touchCode: session.touchCode,
        pageId: session.pageId,
        userId: session.userId,
        provinceCode: session.provinceCode,
      })
      ensureCocSuccess(relation, '全球通 5GA 资格查询失败')
      eligible = Boolean(asRecord(relation.data)?.fiveGAValid)
      if (!eligible) warnings.push('全球通 5GA 资格预校验未通过，仍可在明确确认后尝试提交')
    }
    if (norms.length === 0) throw new BenefitOrderError('上游未返回可办理档位', 'NORMS_EMPTY')
    session.product = {
      name: COC_APP_PRODUCT_PRESETS[session.appBusinessId].name,
      productCode: session.productCode,
      rulesHtml: '',
      norms,
      eligible,
      eligibilityMessage: eligible === undefined ? undefined : eligible ? '资格校验通过' : '资格校验未通过',
      protocolRequired: true,
      warnings,
    }
  } else {
    const payload = session.pageMode === 'personal_page'
      ? await retailRequest(session, 'nrmix/product/newProductPersonalPageById', { id: session.personalPageId, appFlag: 0 })
      : await retailRequest(session, 'nrmix/product/prodWithNormList', { productCode: session.productCode })
    ensureRetailSuccess(payload, `${session.productName}产品查询失败`)
    const pageRaw = asRecord(payload.data)
    const productRaw = session.pageMode === 'personal_page' ? asRecord(pageRaw?.productData) : pageRaw
    const norms = normalizeNorms(productRaw)
    if (!productRaw || (norms.length === 0 && session.businessId !== 'custom')) {
      throw new BenefitOrderError('上游未返回可办理档位', 'NORMS_EMPTY')
    }
    if (session.pageMode === 'personal_page') {
      const saleMessage = retailProductSaleMessage(productRaw)
      if (saleMessage) throw new BenefitOrderError(saleMessage, 'PRODUCT_NOT_FOR_SALE', 409)
    }
    session.productRaw = productRaw
    session.productId = text(productRaw.productId) || session.productId
    session.productCode = text(productRaw.productCode) || session.productCode
    session.product = {
      name: text(pageRaw?.pageName || productRaw.productName) || session.productName,
      productCode: text(productRaw.productCode) || session.productCode,
      rulesHtml: session.pageMode === 'personal_page' && pageRaw
        ? personalPageRulesHtml(pageRaw, productRaw)
        : richText(productRaw.intro),
      norms,
      protocolRequired: false,
      warnings: [],
    }
  }
  session.stage = 'product_ready'
  session.orderSmsSentAt = undefined
  touch(session)
  return view(session)
}

function flattenNormDetails(norm: JsonRecord): Array<{ label: string; value: string }> {
  const out: Array<{ label: string; value: string }> = []
  for (const segment of asArray(norm.segments).map(asRecord).filter(Boolean)) {
    for (const row of asArray(segment?.table).map(asRecord).filter(Boolean)) {
      const label = text(row?.leftvalue)
      const value = text(row?.rightvalue)
      if (label && value && !/^(resource|supply)/i.test(label)) out.push({ label, value })
    }
  }
  return out.slice(0, 30)
}

function parseNestedEligibility(value: unknown): { eligible: boolean; message: string } {
  let current = value
  for (let index = 0; index < 2 && typeof current === 'string'; index += 1) {
    try { current = JSON.parse(current) as unknown } catch { break }
    const record = asRecord(current)
    if (record && typeof record.data === 'string') current = record.data
  }
  const record = asRecord(current)
  const status = text(record?.status)
  return { eligible: status === '0', message: text(record?.message) || (status === '0' ? '资格校验通过' : '资格校验未通过') }
}

function parseRetailProtocol(value: unknown): BenefitProtocol | undefined {
  const root = asRecord(value)
  const candidates = [
    ...(Array.isArray(value) ? value : [value]),
    ...asArray(root?.protocolList),
    ...asArray(root?.backstopProtocolList),
  ].map(asRecord).filter(Boolean)
  for (const candidate of candidates) {
    const sequenceId = text(candidate?.protocolSequenceId)
    const protocolId = text(candidate?.protocolId || candidate?.ptId || candidate?.id)
    const content = richText(candidate?.protocolContent || candidate?.content)
    const name = text(candidate?.protocolName || candidate?.name)
    if (sequenceId || protocolId || content) {
      return {
        name: name || '业务受理协议',
        content,
        sequenceId: sequenceId || undefined,
        protocolId: protocolId || undefined,
      }
    }
  }
  return undefined
}

function optionalContractOperation(marketingCode: string): { contractOperation?: string } {
  return marketingCode ? { contractOperation: `&${marketingCode}&&` } : {}
}

function retailOrderSourceFields(sourceParams: Record<string, string>): {
  redCode: string
  rcmSrc: string
  fromRecommend: string
  agentid: string
  recommendTraceId: string
} {
  return {
    redCode: sourceParams.redCode || '',
    rcmSrc: sourceParams.rcm_src || '',
    fromRecommend: sourceParams.fromRecommend || '',
    agentid: sourceParams.agentid || '',
    recommendTraceId: sourceParams.traceId || '',
  }
}

function resolveCocSelectedNorm(
  norms: PremiumNorm[],
  selectedIds: string[],
  customNorm?: CustomPremiumNormInput,
): PremiumNorm {
  if (customNorm) {
    const productCode = text(customNorm.packageId || customNorm.id)
    if (!/^\d{1,20}$/.test(productCode)) {
      throw new BenefitOrderError('自定义产品编码必须为 1-20 位数字', 'INVALID_CUSTOM_NORM', 400)
    }
    return {
      id: productCode,
      packageId: productCode,
      name: customNorm.name || `自定义档位 ${productCode}`,
      price: Number.isFinite(customNorm.price) ? Number(customNorm.price) : 0,
      bizIntfCode: '',
      productTags: '',
      candidateIds: [productCode],
      variantCount: 1,
    }
  }
  if (selectedIds.length !== 1) throw new BenefitOrderError('请选择一个业务档位', 'INVALID_NORM_SELECTION', 400)
  const norm = norms.find((item) => item.id === selectedIds[0])
  if (!norm) throw new BenefitOrderError('所选档位不存在或已更新', 'NORM_NOT_FOUND', 400)
  return norm
}

export const selectBenefitProduct = (id: string, selectedIds: string[], customNorm?: CustomPremiumNormInput) =>
  withLuckySessionLock(id, () => selectBenefitProductImpl(id, selectedIds, customNorm))
async function selectBenefitProductImpl(
  id: string,
  selectedIds: string[],
  customNorm?: CustomPremiumNormInput,
): Promise<BenefitOrderSessionView> {
  const session = getSession(id)
  requireStage(session, ['product_ready', 'selection_ready'], '选择产品')
  if (!session.product) throw new BenefitOrderError('请先加载产品信息', 'PRODUCT_REQUIRED', 409)
  if (session.workflow === 'lucky_bag') {
    if (customNorm) throw new BenefitOrderError('福袋不支持跨资费自定义权益', 'INVALID_BAG_BENEFIT', 400)
    session.product = await selectLuckyBagProduct(session, selectedIds, luckyRequest(session))
    session.stage = 'selection_ready'
    touch(session)
    return view(session)
  }
  if (session.workflow === 'building_bricks') {
    const available = new Map((session.product.modules || []).map((item) => [item.id, item]))
    const selected = selectedIds.map((value) => available.get(value)).filter((item): item is BenefitModule => Boolean(item))
    const flow = selected.filter((item) => item.category === 'flow')
    const voice = selected.filter((item) => item.category === 'voice')
    if (flow.length !== 1 || voice.length !== 1 || selected.length !== selectedIds.length) {
      throw new BenefitOrderError('积木套餐必须选择一档流量和一档语音，可选择一个短信包', 'INVALID_MODULE_SELECTION', 400)
    }
    if (selected.filter((item) => item.category === 'sms').length > 1) {
      throw new BenefitOrderError('短信可选包最多选择一档', 'INVALID_MODULE_SELECTION', 400)
    }
    if (selected.some((item) => item.category === 'sms')) {
      throw new BenefitOrderError('短信可选包需在主套餐办理后单独加购，本次请只选择流量和语音模组', 'OPTIONAL_MODULE_SEPARATE_ORDER', 409)
    }
    session.orderProductCode = resolveBuildingMainProductCode(flow[0].productCode, voice[0].productCode)
    const qualify = await cocRequest(session, 'editor/common/proxy/toC/checkBizQualifyServ', {
      numType: '1',
      checkType: '3',
      goodsID: BENEFIT_ORDER_DEFAULTS.building_bricks.qualificationGoodsId,
      productList: [flow[0], voice[0]].map((item) => ({ productType: '', productID: item.id })),
    })
    const qualifyData = asRecord(qualify.data)
    const entity = asRecord(qualifyData?.entity)
    const bizRsp = asRecord(entity?.bizRsp)
    const eligible = text(qualify.code) === '0' && text(bizRsp?.bizOrderResult) === '0000'
    const protocolPayload = await cocRequest(session, 'grocer/protocol/prov/queryProtocol', {
      pageId: session.pageId,
      productCode: session.mainProductCode,
      provinceCode: session.provinceCode,
      userId: session.userId,
      verifyType: '0',
    })
    ensureCocSuccess(protocolPayload, '业务受理协议查询失败')
    const protocol = asRecord(asArray(protocolPayload.data)[0])
    const sequenceId = text(protocol?.protocolSequenceId)
    if (!sequenceId) throw new BenefitOrderError('上游未返回协议流水', 'PROTOCOL_MISSING')
    session.product = {
      ...session.product,
      selectedIds,
      selectedName: selected.map((item) => item.name).join(' + '),
      selectedPrice: selected.reduce((sum, item) => sum + item.fee, 0),
      eligible,
      eligibilityMessage: text(bizRsp?.reserve || entity?.bizDesc || qualify.message) || (eligible ? '资格校验通过' : '业务规则限制'),
      protocol: {
        name: text(protocol?.protocolName) || '业务受理协议',
        content: text(protocol?.content),
        sequenceId,
      },
      protocolRequired: true,
      warnings: eligible ? [] : ['资格预校验未通过，最终提交仍可能被上游拒绝'],
    }
  } else if (session.workflow === 'coc_app') {
    const norm = resolveCocSelectedNorm(session.product.norms || [], selectedIds, customNorm)
    session.productCode = norm.packageId
    const rules = await cocRequest(session, 'grocer/copyWriting/page/query', {
      configType: 2,
      pageId: session.pageId,
      productCode: session.productCode,
      provinceCode: session.provinceCode,
      ...(session.appBusinessId === 'five_ga' ? { touchCode: session.touchCode } : {}),
    })
    ensureCocSuccess(rules, '产品规则查询失败')
    const protocolPayload = await cocRequest(session, 'grocer/protocol/prov/queryProtocol', {
      pageId: session.pageId,
      productCode: session.productCode,
      provinceCode: session.provinceCode,
      userId: session.userId,
      verifyType: '0',
    })
    ensureCocSuccess(protocolPayload, '业务受理协议查询失败')
    const protocol = asRecord(asArray(protocolPayload.data)[0])
    const sequenceId = text(protocol?.protocolSequenceId)
    if (!sequenceId) throw new BenefitOrderError('上游未返回协议流水', 'PROTOCOL_MISSING')
    session.product = {
      ...session.product,
      productCode: session.productCode,
      rulesHtml: cocRulesHtml(rules.data),
      selectedIds: [norm.id],
      selectedName: norm.name,
      selectedPrice: norm.price,
      protocol: {
        name: text(protocol?.protocolName) || '业务受理协议',
        content: text(protocol?.content),
        sequenceId,
      },
      protocolRequired: true,
      warnings: [...session.product.warnings, ...(customNorm ? ['当前使用自定义档位参数'] : []), session.warning],
    }
  } else {
    if (customNorm && !/^\d{1,20}$/.test(customNorm.id)) {
      throw new BenefitOrderError('自定义 normId 必须为 1-20 位数字', 'INVALID_CUSTOM_NORM', 400)
    }
    if (!customNorm && selectedIds.length !== 1) throw new BenefitOrderError('请选择一个业务档位', 'INVALID_NORM_SELECTION', 400)
    const norm = customNorm
      ? {
          id: customNorm.id,
          packageId: customNorm.packageId || '',
          name: customNorm.name || `自定义档位 ${customNorm.id}`,
          price: Number.isFinite(customNorm.price) ? Number(customNorm.price) : 0,
          bizIntfCode: customNorm.bizIntfCode || '001_JIYUN',
          productTags: '',
          candidateIds: [customNorm.id],
          variantCount: 1,
        }
      : (session.product.norms || []).find((item) => item.id === selectedIds[0])
    if (!norm) throw new BenefitOrderError('所选档位不存在或已更新', 'NORM_NOT_FOUND', 400)
    const rawCandidates = customNorm
      ? [{
          normId: customNorm.id,
          productCode: customNorm.packageId || '',
          name: norm.name,
          price: Math.max(0, norm.price) * 100,
          bizIntfCode: norm.bizIntfCode,
        }]
      : asArray(session.productRaw?.norms)
          .map(asRecord)
          .filter((item) => norm.candidateIds.includes(text(item?.normId)))
    if (rawCandidates.length === 0) throw new BenefitOrderError('档位候选版本已失效，请刷新产品', 'NORM_NOT_FOUND', 409)

    const evaluatedCandidates = await Promise.all(rawCandidates.map(async (rawCandidate) => {
      const candidateId = text(rawCandidate?.normId)
      const detailPayload = await retailRequest(session, 'nrmix/product/norm', { normId: Number(candidateId) })
      ensureRetailSuccess(detailPayload, `${session.productName}档位查询失败`)
      const detail = asRecord(detailPayload.data) || rawCandidate || {}
      const actualId = text(detail.id || detail.normId) || candidateId
      const actualPackageId = text(detail.productCode || rawCandidate?.productCode)
      const actualEffectType = text(detail.busiEffectType) || session.effectType
      const actualBizIntfCode = text(detail.bizIntfCode || rawCandidate?.bizIntfCode) || '001_JIYUN'
      const precheckRequired = text(detail.preCheck || rawCandidate?.preCheck) !== '0'
      let candidateEligibility = { eligible: true, message: '该档位无需资格预校验' }
      if (precheckRequired) {
        const precheck = await retailRequest(session, 'nrmix/preCheck/productPreCheck', {
          packageId: actualPackageId,
          isMain: text(detail.commonCategoryCode || detail.commonCode).split('_')[1] === 'package' ? 1 : 0,
          shopProvinceCode: session.provinceCode,
          busiEffectType: actualEffectType,
          specialOfferType: numberValue(detail.specialOfferType),
          preCheckType: text(detail.preCheckTypes || detail.preCheckType) || '5',
          productCode: Number(session.productCode),
          normId: Number(actualId),
          bizIntfCode: actualBizIntfCode,
          touchCode: session.touchCode,
          shopPageId: session.pageMode === 'personal_page' ? session.sourceParams.pageid || '' : text(detail.pageId),
          productPersonalPageId: session.pageMode === 'personal_page' ? session.personalPageId : text(detail.personalPageUrl),
          ...optionalContractOperation(session.marketingCode),
        })
        try {
          ensureRetailSuccess(precheck, `${session.productName}资格预校验失败`)
          candidateEligibility = parseNestedEligibility(precheck.data)
        } catch (error) {
          candidateEligibility = {
            eligible: false,
            message: error instanceof Error ? error.message : '资格预校验未通过',
          }
        }
      }
      return {
        detail,
        eligibility: candidateEligibility,
        effectType: actualEffectType,
        norm: {
          ...norm,
          id: actualId,
          packageId: actualPackageId,
          name: customNorm && !customNorm.name ? text(detail.name) || norm.name : norm.name,
          price: customNorm && customNorm.price === undefined ? numberValue(detail.price) / 100 : norm.price,
          bizIntfCode: actualBizIntfCode,
        } as PremiumNorm,
      }
    }))
    const selectedCandidate = evaluatedCandidates.find((candidate) => candidate.eligibility.eligible) || evaluatedCandidates[0]
    const selectedNorm = selectedCandidate.norm
    const selectedRaw = selectedCandidate.detail
    const eligibility = selectedCandidate.eligibility
    session.relevanceActivities = undefined
    session.retailActivityFields = undefined
    session.effectType = selectedCandidate.effectType
    session.normRaw = selectedRaw
    const relevance = await retailRequest(session, 'nrmix/product/queryRelevancy', {
      productId: Number(session.productId),
      productCode: Number(session.productCode),
      productType: 1,
      promotionPage: session.pageMode === 'personal_page' ? '2' : '1',
    })
    if (text(relevance.returnCode) === '0') {
      const relevanceData = asRecord(relevance.data)
      const activities: Array<{ relActivityId: string; relActivityType: number }> = []
      const promoteActivityId = text(relevanceData?.promoteActivityId)
      if (promoteActivityId) activities.push({ relActivityId: promoteActivityId, relActivityType: 12 })
      const courtesyIds = asArray(relevanceData?.handleCourtesyId).map(text).filter(Boolean)
      if (courtesyIds.length > 0) {
        try {
          const courtesy = await retailRequest(session, 'nrpromotion/atom/courtesy/hcByNorm', { normId: selectedNorm.id })
          if (text(courtesy.returnCode) === '0') {
            const eligibleGifts = asArray(courtesy.data).map(asRecord).filter((item) => (
              Boolean(item)
              && courtesyIds.includes(text(item?.id))
              && item?.hasPromotionStock !== false
              && ![1, 2].includes(numberValue(item?.validCode))
            ))
            const giftIds = eligibleGifts.map((item) => text(item?.id)).filter(Boolean)
            if (giftIds.length > 0) activities.push({ relActivityId: giftIds.join(','), relActivityType: 2 })
            const cashGift = eligibleGifts.find((item) => numberValue(item?.consumeType) === 1)
            session.retailActivityFields = {
              ...(eligibleGifts.some((item) => numberValue(item?.consumeType) === 0) ? { activityType: 2 } : {}),
              ...(cashGift ? { activityId: text(cashGift.id) } : {}),
            }
          }
        } catch {
          session.retailActivityFields = undefined
        }
      }
      session.relevanceActivities = activities
    }
    const protocolPayload = await retailRequest(session, 'nrproduct/atom/protocol/queryProtocol', {
      provinceCode: session.provinceCode,
      productCode: Number(session.productCode),
      queryType: '',
      normId: Number(selectedNorm.id),
      cityCode: session.cityCode,
    })
    ensureRetailSuccess(protocolPayload, `${session.productName}协议查询失败`)
    const protocol = parseRetailProtocol(protocolPayload.data)
    const variantMessage = norm.variantCount > 1
      ? `已在 ${norm.variantCount} 个同名版本中选择实时校验${eligibility.eligible ? '通过' : '结果最匹配'}的版本`
      : ''
    session.product = {
      ...session.product,
      selectedIds: [selectedNorm.id],
      selectedName: selectedNorm.name,
      selectedPrice: selectedNorm.price,
      details: flattenNormDetails(selectedRaw),
      eligible: eligibility.eligible,
      eligibilityMessage: [eligibility.message, variantMessage].filter(Boolean).join('；'),
      protocol,
      protocolRequired: Boolean(protocol),
      warnings: [
        ...(!eligibility.eligible ? ['资格预校验未通过，最终提交仍可能被上游拒绝'] : []),
        session.warning,
        ...(!protocol ? ['上游未返回实时协议，商城流程允许不携带协议流水继续办理'] : []),
      ],
    }
  }
  session.stage = 'selection_ready'
  session.orderSmsSentAt = undefined
  touch(session)
  return view(session)
}

export const sendBenefitOrderSms = (id: string, acceptedProtocol: boolean, forceAttempt = false) =>
  withLuckySmsLock(id, 'order', () => sendBenefitOrderSmsImpl(id, acceptedProtocol, forceAttempt))
async function sendBenefitOrderSmsImpl(id: string, acceptedProtocol: boolean, forceAttempt = false): Promise<BenefitOrderSessionView> {
  const session = getSession(id)
  requireStage(session, ['selection_ready', 'order_sms_sent'], '发送订购验证码')
  requireCooldown(session.orderSmsSentAt, '订购验证码发送')
  if (session.workflow === 'lucky_bag') {
    if (!acceptedProtocol || !session.product?.protocol?.sequenceId) throw new BenefitOrderError('请阅读并同意福袋实时协议', 'PROTOCOL_NOT_ACCEPTED', 400)
    await assertLuckyBagRelationUnchanged(session, luckyRequest(session))
    const payload = await cocRequest(session, 'user/smsCode', buildLuckyBagSmsBody(session), true)
    ensureCocSuccess(payload, '福袋订购验证码发送失败')
    session.orderSmsSentAt = Date.now()
    recordLuckyBagSms(session, 'order')
    session.stage = 'order_sms_sent'
    touch(session)
    return view(session)
  }
  if (session.product?.protocolRequired && (!acceptedProtocol || !session.product.protocol)) {
    throw new BenefitOrderError('请先阅读并同意实时业务受理协议', 'PROTOCOL_NOT_ACCEPTED', 400)
  }
  if (session.product.eligible === false && !forceAttempt) {
    throw new BenefitOrderError('资格预校验未通过；如仍需尝试，请开启“仍尝试提交”', 'QUALIFICATION_FAILED', 409)
  }
  if (session.workflow === 'building_bricks') {
    const payload = await cocRequest(session, 'user/smsCode', {
      mobile: session.phone,
      userId: session.userId,
      productCode: session.orderProductCode,
      smsCodeTypeEnum: '505',
      pageId: session.pageId,
      touchCode: session.touchCode,
      templateNo: BENEFIT_ORDER_DEFAULTS.building_bricks.orderSmsTemplateNo,
    }, true)
    ensureCocSuccess(payload, '订购验证码发送失败')
  } else if (session.workflow === 'coc_app') {
    const endpoint = session.appBusinessId === 'five_ga' ? 'user/smsCodeToken' : 'user/smsCode'
    const payload = await cocRequest(session, endpoint, {
      mobile: session.phone,
      userId: session.userId,
      productCode: session.productCode,
      smsCodeTypeEnum: '505',
      pageId: session.pageId,
      touchCode: session.touchCode,
    }, true)
    ensureCocSuccess(payload, `${COC_APP_PRODUCT_PRESETS[session.appBusinessId].name}订购验证码发送失败`)
  } else {
    const normId = session.product.selectedIds?.[0]
    const payload = await retailRequest(session, 'nrmix/sms/sendSms', {
      busiId: '2',
      normIds: normId,
      userEffectType: session.effectType,
      ...optionalContractOperation(session.marketingCode),
    })
    ensureRetailSuccess(payload, `${session.productName}订购验证码发送失败`)
    const data = asRecord(payload.data)
    if (text(data?.status) && text(data?.status) !== '0') {
      throw new BenefitOrderError(text(data?.message) || '订购验证码发送失败', text(data?.status))
    }
    session.bookTime = formatBeijingTime(new Date())
  }
  session.orderSmsSentAt = Date.now()
  session.stage = 'order_sms_sent'
  touch(session)
  return view(session)
}

function formatBeijingTime(date: Date): string {
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}:${values.second}`
}

function resultFromError(error: unknown): BenefitOrderResult {
  const uncertain = error instanceof Error && /UPSTREAM_TIMEOUT|ECONNRESET|socket|timed out/i.test(error.message)
  return {
    success: false,
    accepted: false,
    uncertain,
    code: uncertain ? 'RESULT_UNCERTAIN' : error instanceof BenefitOrderError ? error.code : 'UPSTREAM_ERROR',
    message: uncertain ? '订购结果未确认，请先通过官方渠道查询，不要直接重复提交' : error instanceof Error ? error.message : '订购失败',
    completedAt: new Date().toISOString(),
    response: sanitizeOrderResponse({
      code: uncertain ? 'RESULT_UNCERTAIN' : error instanceof BenefitOrderError ? error.code : 'UPSTREAM_ERROR',
      message: error instanceof Error ? error.message : '订购失败',
    }),
  }
}

function sanitizeOrderResponse(value: unknown, depth = 0): unknown {
  if (depth > 6) return undefined
  if (value === null || value === undefined) return value
  if (typeof value === 'string') return value.replace(/1\d{10}/g, (phone) => `${phone.slice(0, 3)}****${phone.slice(-4)}`).slice(0, 5_000)
  if (typeof value !== 'object') return value
  if (Array.isArray(value)) return value.slice(0, 100).map((item) => sanitizeOrderResponse(item, depth + 1))
  const output: JsonRecord = {}
  for (const [key, item] of Object.entries(value as JsonRecord).slice(0, 200)) {
    if (/(cookie|token|ticket|mobile|phone|receiver|sms|password|identity|cert|dfp|fingerprint|wasm|risk)/i.test(key)) continue
    output[key] = sanitizeOrderResponse(item, depth + 1)
  }
  return output
}

function resultFromRetailOrder(payload: JsonRecord): BenefitOrderResult {
  const code = text(payload.returnCode) || 'UPSTREAM_ERROR'
  const data = asRecord(payload.data)
  const bean = asRecord(data?.bean)
  const submittedUncertain = code === 'A00012'
  const success = code === '0'
  return {
    success,
    accepted: success || submittedUncertain,
    uncertain: submittedUncertain,
    code,
    message: text(payload.returnMessage || bean?.reason) || (
      submittedUncertain
        ? '办理申请已提交，办理结果以短信通知为准'
        : success ? '办理申请已提交' : '订购失败'
    ),
    orderId: success || submittedUncertain
      ? text(data?.orderNumber || bean?.orderId) || undefined
      : undefined,
    orderStatus: success
      ? text(bean?.orderStatusName || bean?.busiStatusName) || '办理中'
      : submittedUncertain ? '结果待确认' : '未受理',
    completedAt: new Date().toISOString(),
    response: sanitizeOrderResponse(payload),
  }
}

type ConfirmBenefitArgs = {
  id: string
  code: string
  acceptedProtocol: boolean
  confirmationText: string
  forceAttempt?: boolean
}
export const confirmBenefitOrder = (args: ConfirmBenefitArgs) => withLuckySessionLock(args.id, () => confirmBenefitOrderImpl(args))
async function confirmBenefitOrderImpl(args: ConfirmBenefitArgs): Promise<{ session: BenefitOrderSessionView; result: BenefitOrderResult }> {
  const session = getSession(args.id)
  requireStage(session, ['order_sms_sent'], '确认订购')
  if (!/^\d{6}$/.test(args.code)) throw new BenefitOrderError('请输入 6 位订购验证码', 'INVALID_SMS_CODE', 400)
  if (session.orderInFlight) throw new BenefitOrderError('订购正在提交，请勿重复操作', 'ORDER_IN_FLIGHT', 409)
  if ((session.product?.protocolRequired && !args.acceptedProtocol) || args.confirmationText !== '确认订购') {
    throw new BenefitOrderError('请完成确认并输入“确认订购”', 'CONFIRMATION_REQUIRED', 400)
  }
  if (session.product?.eligible === false && !args.forceAttempt) {
    throw new BenefitOrderError('资格预校验未通过，未授权继续尝试', 'QUALIFICATION_FAILED', 409)
  }
  if (session.workflow === 'lucky_bag') return confirmLuckyBagOrder(session, args.code)
  session.orderInFlight = true
  session.stage = 'ordering'
  touch(session)
  let result: BenefitOrderResult
  try {
    if (session.workflow === 'building_bricks') {
      const payload = await cocRequest(session, 'card/bundling/change', {
        pageId: session.pageId,
        productCode: session.orderProductCode,
        touchCode: session.touchCode,
        uid: '',
        mobile: session.phone,
        sellerId: '',
        channelSeqId: '',
        sourceUrl: `https://dev.coc.10086.cn/coc/web2/buildingBricksPak/?pageId=${session.pageId}&channelId=${session.touchCode}`,
        protocolSequenceId: session.product?.protocol?.sequenceId,
        smsCode: args.code,
        verifyType: 0,
        smsCodeTypeEnum: '505',
        userId: session.userId,
        tyingProductCodes: [],
        ext: JSON.stringify({ wtAc: `${session.touchCode}_`, wtAcId: '' }),
      })
      const success = text(payload.code) === '0'
      const data = asRecord(payload.data)
      result = {
        success,
        accepted: success,
        uncertain: false,
        code: text(payload.code) || 'UPSTREAM_ERROR',
        message: text(payload.message) || (success ? '订购成功' : '订购失败'),
        orderId: success ? text(data?.commonOrderId) || undefined : undefined,
        orderStatus: success ? '已受理' : '未受理',
        completedAt: new Date().toISOString(),
        response: sanitizeOrderResponse(payload),
      }
    } else if (session.workflow === 'coc_app') {
      if (session.appBusinessId === 'five_ga') {
        const verified = await cocRequest(session, 'user/loginCheckToken', {
          mobile: session.phone,
          smsCodeTypeEnum: '505',
          smsCode: args.code,
          verifyType: '0',
          touchCode: session.touchCode,
          pageId: session.pageId,
          productCode: session.productCode,
        }, true)
        ensureCocSuccess(verified, '订购验证码校验失败')
      }
      const orderBody = session.appBusinessId === 'five_ga'
        ? {
            touchCode: session.touchCode,
            pageId: session.pageId,
            productCode: session.productCode,
            uid: '',
            mobile: session.phone,
            sellerId: '',
            sellerMobile: '',
            channelSeqId: '',
            sourceUrl: `https://h.app.coc.10086.cn/activity/transferXcx/index.html?platform=cmcc&pageId=${encodeURIComponent(session.pageId)}&channelId=${encodeURIComponent(session.touchCode)}`,
            protocolSequenceId: session.product?.protocol?.sequenceId,
            verifyType: 2,
            smsCodeTypeEnum: '505',
            ext: JSON.stringify({ wtAc: `${session.touchCode}_`, wtAcId: '' }),
          }
        : {
            mobile: session.phone,
            pageId: session.pageId,
            productCode: session.productCode,
            smsCode: args.code,
            touchCode: session.touchCode,
            sellerMobile: '',
            verifyType: '0',
            smsCodeTypeEnum: '505',
            userId: session.userId,
            uid: '',
          }
      const payload = await cocRequest(session, 'pkg/order/change', orderBody, true)
      const success = text(payload.code) === '0'
      const data = asRecord(payload.data)
      result = {
        success,
        accepted: success,
        uncertain: false,
        code: text(payload.code) || 'UPSTREAM_ERROR',
        message: text(payload.message) || (success ? '订购成功' : '订购失败'),
        orderId: success ? text(data?.commonOrderId) || undefined : undefined,
        orderStatus: success ? '已受理' : '未受理',
        completedAt: new Date().toISOString(),
        response: sanitizeOrderResponse(payload),
      }
    } else {
      const normId = session.product?.selectedIds?.[0]
      const relevanceActivityVO = session.relevanceActivities?.length ? session.relevanceActivities : undefined
      const protocolFields = session.product?.protocol?.sequenceId
        ? { protocolSequenceId: session.product.protocol.sequenceId }
        : session.product?.protocol?.protocolId
          ? { ptId: session.product.protocol.protocolId }
          : {}
      const personalPageFields = session.pageMode === 'personal_page'
        ? {
            productPersonalPageId: session.personalPageId,
            processmethod: 'productOrder',
            extendParams: [{ type: 'newPersonalId', content: session.personalPageId }],
            ...(session.retailActivityFields || {}),
          }
        : { orderResource: 20, extendParams: [] }
      const payload = await retailRequest(session, 'nrmix/order/createOrder', {
        agentid: '', tuikeInfo: '', shopid: session.pageMode === 'personal_page' ? session.sourceParams.pageid || '' : '',
        normid: Number(normId), ordertype: 1, staffId: '',
        timeSpan: Date.now(), password: args.code, productId: Number(session.productId),
        productCode: Number(session.productCode), serialId: '',
        ...retailOrderSourceFields(session.sourceParams),
        employeeId: '', employeeProvinceId: '',
        sendResultComp: '', sendResultId: '', sendResultType: '', sendResultAtyCode: '',
        cmgSmsCode: args.code, verifyCode: args.code, confirmTime: formatBeijingTime(new Date()),
        sellerId: '', posterPhone: '', ...personalPageFields,
        selectedCouponId: '', touchCode: session.touchCode, bookTime: session.bookTime,
        ...(session.pageMode === 'personal_page' ? {} : { userEffectType: session.effectType, signActivity: false }),
        ...protocolFields,
        ...optionalContractOperation(session.marketingCode),
        ...(relevanceActivityVO ? { relevanceActivityVO } : {}),
      })
      result = resultFromRetailOrder(payload)
    }
  } catch (error) {
    result = resultFromError(error)
  } finally {
    session.orderInFlight = false
  }
  session.lastResult = result
  session.stage = 'finished'
  touch(session)
  return { session: view(session), result }
}

async function confirmLuckyBagOrder(session: LuckyBagSession, code: string): Promise<{ session: BenefitOrderSessionView; result: BenefitOrderResult }> {
  const unlock = lockLuckyBagOrder(session)
  try {
    // Failures here are read-only: no order has been sent and the user may refresh.
    await assertLuckyBagRelationUnchanged(session, luckyRequest(session))
    const order = buildLuckyBagOrder(session, code)
    session.orderInFlight = true
    session.stage = 'ordering'
    touch(session)
    let result: BenefitOrderResult
    try {
      const payload = await cocRequest(session, order.path, order.body)
      if (payload.code === undefined || payload.code === null || text(payload.code).trim() === '') throw new Error('订购响应缺少业务状态')
      const success = text(payload.code) === '0'
      const data = asRecord(payload.data)
      result = {
        success, accepted: success, uncertain: false, code: text(payload.code),
        message: text(payload.message) || (success ? '福袋办理申请已受理，请刷新订购关系确认生效' : '福袋订购未成功'),
        orderId: success ? text(data?.commonOrderId || data?.orderId) || undefined : undefined,
        orderStatus: success ? '已受理，待确认生效' : '未受理', completedAt: new Date().toISOString(), response: sanitizeOrderResponse(payload),
      }
    } catch (error) {
      // Any transport/format failure after dispatch may hide an accepted order.
      const expired = error instanceof BenefitOrderError && error.code === 'COC_LOGIN_EXPIRED'
      result = {
        success: false, accepted: false, uncertain: !expired,
        code: expired ? 'COC_LOGIN_EXPIRED' : 'RESULT_UNCERTAIN',
        message: expired ? error.message : '福袋订购结果未确认，请先通过官方渠道核查，不要重复提交',
        completedAt: new Date().toISOString(),
      }
    } finally { session.orderInFlight = false }
    recordLuckyBagResult(session, result)
    session.lastResult = result
    session.stage = 'finished'
    touch(session)
    return { session: view(session), result }
  } finally { unlock() }
}

export function deleteBenefitOrderSession(id: string): boolean {
  const session = sessions.get(id)
  if (session?.workflow === 'lucky_bag' && (session.operationInFlight || session.orderInFlight)) {
    throw new BenefitOrderError('福袋操作正在进行，请等待完成', 'BAG_OPERATION_IN_FLIGHT', 409)
  }
  return sessions.delete(id)
}

export const __test__ = {
  richText,
  personalPageRulesHtml,
  retailProductSaleMessage,
  normalizeModules,
  resolveBuildingMainProductCode,
  normalizeNorms,
  parseNestedEligibility,
  parseRetailProtocol,
  optionalContractOperation,
  retailOrderSourceFields,
  resultFromRetailOrder,
  sanitizeOrderResponse,
  resolvePremiumPhone,
  formatBeijingTime,
  extractCocAppCookie,
  normalizeCocTariffs,
  normalizeFiveGaProducts,
  resolveCocSelectedNorm,
  canAccess(ownerKey: string, requester: string) {
    return requester === 'admin' || ownerKey === requester
  },
}

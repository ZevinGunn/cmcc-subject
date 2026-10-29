import crypto from 'node:crypto'
import {
  clearBmccActivityLoginCache,
  readBmccActivityLoginCache,
  saveBmccActivityLoginCache,
  touchBmccActivityLoginCache,
} from './bmccActivityLoginCache.js'

const DEFAULT_BMCC_API_URL = 'http://127.0.0.1:8788/api/'
const SESSION_TTL_MS = 30 * 60_000
const SMS_COOLDOWN_MS = 60_000
const REQUEST_TIMEOUT_MS = 45_000

export type BmccActivityConfig = {
  activityName: string
  displayName: string
  proType?: string
  packageId: string
  packageCode: string
  packageName?: string
  productShowCode?: string
  productShowName?: string
  productSendUrl?: string
  pitemShowCode: string
  pitemShowName?: string
  pitemSendUrl?: string
  mtOtherParams?: string
  prodValue?: string
  isQd2018?: boolean
  activityUrl?: string
}

export const BMCC_ACTIVITY_PRESETS: ReadonlyArray<BmccActivityConfig> = [
  {
    activityName: 'VPzD4o4vvy',
    displayName: '5GA 加速服务',
    proType: 'QQTJSFF',
    packageId: '55412',
    packageCode: 'QQTJSFF',
    productShowCode: 'G_QQTJSFF_0_0',
    pitemShowCode: 'KT',
  },
  {
    activityName: 'bounsPoints_XY',
    displayName: 'AI豆倍享合约（到期自动续约）',
    packageName: 'AI豆倍享合约',
    packageId: '2840305334',
    packageCode: 'JFBXHY',
    productShowCode: 'G_JFBXHY',
    productShowName: '积分倍享合约',
    productSendUrl: '',
    pitemShowCode: 'XY',
    pitemShowName: '合约',
    pitemSendUrl: '',
    activityUrl: 'https://service.bj.10086.cn/nwt/portal/bounsPoints',
  },
  {
    activityName: 'bounsPoints_BXY',
    displayName: 'AI豆倍享合约（到期自动取消）',
    packageName: 'AI豆倍享合约',
    packageId: '2840305334',
    packageCode: 'JFBXHY',
    productShowCode: 'G_JFBXHY',
    productShowName: '积分倍享合约',
    productSendUrl: '',
    pitemShowCode: 'BXY',
    pitemShowName: '合约',
    pitemSendUrl: '',
    activityUrl: 'https://service.bj.10086.cn/nwt/portal/bounsPoints',
  },
  {
    activityName: 'flyCard8_8TC',
    displayName: '8元4G飞享卡',
    packageName: '8元4G飞享卡',
    packageId: '529',
    packageCode: '4GFXTC',
    productShowCode: 'fxtcsb',
    productShowName: '4G飞享套餐升级版',
    pitemShowCode: '8TC',
    pitemShowName: '套餐',
    activityUrl: 'https://service.bj.10086.cn/m/jsp/2025Mobile/8y4g/index.jsp',
  },
]

export type BmccJsonValue = string | number | boolean | null | BmccJsonValue[] | BmccJsonObject
export type BmccJsonObject = { [key: string]: BmccJsonValue }

export type BmccActivityInfo = {
  resultCode?: string
  eligible?: boolean
  alreadyOrdered?: boolean
  canAttempt: boolean
  message: string
  details: BmccJsonObject
}

export type BmccActivityOrderResult = {
  success: boolean
  uncertain: boolean
  code: string
  message: string
  completedAt: string
  details?: BmccJsonObject
}

export type BmccActivityOrderStage =
  | 'captcha_ready'
  | 'login_sms_sent'
  | 'logged_in'
  | 'activity_ready'
  | 'order_sms_required'
  | 'finished'

export type BmccActivityLoginCacheStatus = 'missing' | 'expired' | 'reused' | 'saved'

type BmccActivityOrderSession = {
  id: string
  ownerKey: string
  accountId?: string
  phone: string
  maskedPhone: string
  remoteSessionId: string
  loginCacheStatus: BmccActivityLoginCacheStatus
  loginCachedAt?: number
  loginValidatedAt?: number
  stage: BmccActivityOrderStage
  config?: BmccActivityConfig
  configFingerprint?: string
  captchaImage?: string
  loginSmsSentAt?: number
  orderSmsSentAt?: number
  pendingRemoteOrderId?: string
  orderSms?: {
    smsType?: string
    productItemName?: string
    productItemDesc?: string
    busiTime?: string
  }
  activity?: BmccActivityInfo
  lastResult?: BmccActivityOrderResult
  orderInFlight: boolean
  createdAt: number
  updatedAt: number
  expiresAt: number
}

export type BmccActivityOrderSessionView = {
  id: string
  accountId?: string
  maskedPhone: string
  stage: BmccActivityOrderStage
  loginCacheStatus: BmccActivityLoginCacheStatus
  loginCachedAt?: string
  loginValidatedAt?: string
  config?: BmccActivityConfig
  configFingerprint?: string
  captchaImage?: string
  loginSmsCooldownSeconds: number
  orderSmsCooldownSeconds: number
  orderSms?: BmccActivityOrderSession['orderSms']
  activity?: BmccActivityInfo
  lastResult?: BmccActivityOrderResult
  createdAt: string
  updatedAt: string
  expiresAt: string
}

type RemoteResponse<T> =
  | { ok: true; data: T }
  | { ok: false; message?: string; errorCode?: string }

export type AuthenticatedBmccActivityOrderContext = {
  accountId: string
  phone: string
  maskedPhone: string
  remoteSessionId: string
}

export type BmccPremiumBroadbandAction = 'initialize' | 'check' | 'submit'

export class BmccActivityOrderError extends Error {
  readonly code: string
  readonly status: number

  constructor(message: string, code = 'BMCC_UPSTREAM_ERROR', status = 424) {
    super(message)
    this.name = 'BmccActivityOrderError'
    this.code = code
    this.status = status
  }
}

const sessions = new Map<string, BmccActivityOrderSession>()

function text(value: unknown, maxLength = 500): string {
  return String(value ?? '').trim().slice(0, maxLength)
}

function identifier(value: unknown, field: string, required = true): string {
  const result = text(value, 128)
  if (!result && !required) return ''
  if (!result || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(result)) {
    throw new BmccActivityOrderError(`${field}格式不正确`, 'INVALID_ACTIVITY_CONFIG', 400)
  }
  return result
}

function stripControlCharacters(value: string, preserveWhitespace = false): string {
  return Array.from(value).filter((character) => {
    const code = character.charCodeAt(0)
    if (preserveWhitespace && [0x09, 0x0a, 0x0d].includes(code)) return true
    return code >= 0x20 && code !== 0x7f
  }).join('')
}

function displayText(value: unknown, fallback: string): string {
  const result = stripControlCharacters(text(value || fallback, 100))
  if (!result) throw new BmccActivityOrderError('活动名称不能为空', 'INVALID_ACTIVITY_CONFIG', 400)
  return result
}

function optionalText(value: unknown, maxLength = 1000): string {
  return stripControlCharacters(text(value, maxLength), true)
}

function activityUrl(value: unknown): string {
  const result = optionalText(value, 1000)
  if (!result) return ''
  let parsed: URL
  try {
    parsed = new URL(result)
  } catch {
    throw new BmccActivityOrderError('活动地址格式不正确', 'INVALID_ACTIVITY_CONFIG', 400)
  }
  if (parsed.protocol !== 'https:' || parsed.hostname !== 'service.bj.10086.cn') {
    throw new BmccActivityOrderError('活动地址仅支持北京移动官方 HTTPS 地址', 'INVALID_ACTIVITY_CONFIG', 400)
  }
  return parsed.toString()
}

export function resolveBmccActivityConfig(input: Record<string, unknown> = {}): BmccActivityConfig {
  const activityName = identifier(input.activityName || BMCC_ACTIVITY_PRESETS[0].activityName, 'activityName')
  const preset = BMCC_ACTIVITY_PRESETS.find((item) => item.activityName === activityName)
  const proType = identifier(input.proType ?? preset?.proType, 'proType', false)
  const packageId = identifier(input.packageId ?? preset?.packageId, 'packageId')
  const packageCode = identifier(input.packageCode ?? preset?.packageCode, 'packageCode')
  const productShowCode = identifier(
    input.productShowCode ?? preset?.productShowCode,
    'productShowCode',
    false,
  )
  const pitemShowCode = identifier(input.pitemShowCode ?? preset?.pitemShowCode ?? 'KT', 'pitemShowCode')
  const mtOtherParams = text(input.mtOtherParams ?? preset?.mtOtherParams, 1000)
  const optionalFields = {
    packageName: optionalText(input.packageName ?? preset?.packageName),
    productShowName: optionalText(input.productShowName ?? preset?.productShowName),
    productSendUrl: optionalText(input.productSendUrl ?? preset?.productSendUrl),
    pitemShowName: optionalText(input.pitemShowName ?? preset?.pitemShowName),
    pitemSendUrl: optionalText(input.pitemSendUrl ?? preset?.pitemSendUrl),
    prodValue: optionalText(input.prodValue ?? preset?.prodValue),
    activityUrl: activityUrl(input.activityUrl ?? preset?.activityUrl),
  }
  const isQd2018 = typeof input.isQd2018 === 'boolean'
    ? input.isQd2018
    : typeof preset?.isQd2018 === 'boolean' ? preset.isQd2018 : undefined
  if (!proType && !productShowCode) {
    throw new BmccActivityOrderError(
      'proType 或 productShowCode 至少填写一项',
      'INVALID_ACTIVITY_CONFIG',
      400,
    )
  }
  return {
    activityName,
    displayName: displayText(input.displayName, preset?.displayName || activityName),
    ...(proType ? { proType } : {}),
    packageId,
    packageCode,
    ...(optionalFields.packageName ? { packageName: optionalFields.packageName } : {}),
    ...(productShowCode ? { productShowCode } : {}),
    ...(optionalFields.productShowName ? { productShowName: optionalFields.productShowName } : {}),
    ...(optionalFields.productSendUrl ? { productSendUrl: optionalFields.productSendUrl } : {}),
    pitemShowCode,
    ...(optionalFields.pitemShowName ? { pitemShowName: optionalFields.pitemShowName } : {}),
    ...(optionalFields.pitemSendUrl ? { pitemSendUrl: optionalFields.pitemSendUrl } : {}),
    ...(mtOtherParams ? { mtOtherParams } : {}),
    ...(optionalFields.prodValue ? { prodValue: optionalFields.prodValue } : {}),
    ...(isQd2018 === undefined ? {} : { isQd2018 }),
    ...(optionalFields.activityUrl ? { activityUrl: optionalFields.activityUrl } : {}),
  }
}

function configFingerprint(config: BmccActivityConfig): string {
  return crypto.createHash('sha256').update(JSON.stringify(config)).digest('hex').slice(0, 16)
}

function maskPhone(phone: string): string {
  return /^1\d{10}$/.test(phone) ? `${phone.slice(0, 3)}****${phone.slice(-4)}` : '***'
}

function remainingSeconds(sentAt?: number): number {
  if (!sentAt) return 0
  return Math.max(0, Math.ceil((sentAt + SMS_COOLDOWN_MS - Date.now()) / 1000))
}

function touch(session: BmccActivityOrderSession): void {
  session.updatedAt = Date.now()
  session.expiresAt = session.updatedAt + SESSION_TTL_MS
}

function cleanupExpired(): void {
  const now = Date.now()
  for (const [id, session] of sessions.entries()) {
    if (session.expiresAt <= now) sessions.delete(id)
  }
}

function getSession(id: string): BmccActivityOrderSession {
  cleanupExpired()
  const session = sessions.get(id)
  if (!session) {
    throw new BmccActivityOrderError('订购会话不存在或已过期，请重新开始', 'SESSION_NOT_FOUND', 404)
  }
  return session
}

function sessionView(session: BmccActivityOrderSession): BmccActivityOrderSessionView {
  return {
    id: session.id,
    accountId: session.accountId,
    maskedPhone: session.maskedPhone,
    stage: session.stage,
    loginCacheStatus: session.loginCacheStatus,
    loginCachedAt: session.loginCachedAt ? new Date(session.loginCachedAt).toISOString() : undefined,
    loginValidatedAt: session.loginValidatedAt ? new Date(session.loginValidatedAt).toISOString() : undefined,
    config: session.config,
    configFingerprint: session.configFingerprint,
    captchaImage: session.captchaImage,
    loginSmsCooldownSeconds: remainingSeconds(session.loginSmsSentAt),
    orderSmsCooldownSeconds: remainingSeconds(session.orderSmsSentAt),
    orderSms: session.orderSms,
    activity: session.activity,
    lastResult: session.lastResult,
    createdAt: new Date(session.createdAt).toISOString(),
    updatedAt: new Date(session.updatedAt).toISOString(),
    expiresAt: new Date(session.expiresAt).toISOString(),
  }
}

function bmccBaseUrl(): URL {
  const configured = text(process.env.BMCC_LOCAL_API_URL || DEFAULT_BMCC_API_URL, 500)
  let parsed: URL
  try {
    parsed = new URL(configured)
  } catch {
    throw new BmccActivityOrderError('BMCC 本地服务地址配置错误', 'BMCC_CONFIG_INVALID', 500)
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new BmccActivityOrderError('BMCC 本地服务地址配置错误', 'BMCC_CONFIG_INVALID', 500)
  }
  if (!parsed.pathname.endsWith('/')) parsed.pathname += '/'
  return parsed
}

async function bmccRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const response = await fetch(new URL(path.replace(/^\/+/, ''), bmccBaseUrl()), {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
      signal: controller.signal,
    })
    const raw = await response.text()
    let payload: RemoteResponse<T>
    try {
      payload = JSON.parse(raw) as RemoteResponse<T>
    } catch {
      throw new BmccActivityOrderError('BMCC 本地服务返回格式异常', 'BMCC_RESPONSE_INVALID', 502)
    }
    if (payload.ok === false) {
      throw new BmccActivityOrderError(
        payload.message || 'BMCC 业务请求失败',
        payload.errorCode || 'BMCC_UPSTREAM_ERROR',
        response.status >= 400 ? response.status : 424,
      )
    }
    return payload.data
  } catch (error) {
    if (error instanceof BmccActivityOrderError) throw error
    const timedOut = error instanceof Error && error.name === 'AbortError'
    throw new BmccActivityOrderError(
      timedOut ? 'BMCC 本地服务请求超时' : 'BMCC 本地服务不可用，请确认 8788 服务已启动',
      timedOut ? 'BMCC_SERVICE_TIMEOUT' : 'BMCC_SERVICE_UNAVAILABLE',
      timedOut ? 504 : 503,
    )
  } finally {
    clearTimeout(timeout)
  }
}

const blockedDetailKey = /(?:mobile|phone|token|cookie|identity|idcard|cert|artifact|key)/i

function safeJsonValue(value: unknown, depth = 0): BmccJsonValue | undefined {
  if (depth > 6) return undefined
  if (value === null) return null
  if (typeof value === 'string') return value.slice(0, 5000)
  if (typeof value === 'number') return Number.isFinite(value) ? value : String(value)
  if (typeof value === 'boolean') return value
  if (Array.isArray(value)) {
    return value.slice(0, 100)
      .map((item) => safeJsonValue(item, depth + 1))
      .filter((item): item is BmccJsonValue => item !== undefined)
  }
  if (!value || typeof value !== 'object') return undefined
  const output: BmccJsonObject = {}
  for (const [key, item] of Object.entries(value as Record<string, unknown>).slice(0, 200)) {
    if (blockedDetailKey.test(key)) continue
    const safe = safeJsonValue(item, depth + 1)
    if (safe !== undefined) output[key.slice(0, 128)] = safe
  }
  return output
}

function jsonDetails(value: unknown): BmccJsonObject {
  const safe = safeJsonValue(value)
  return safe && typeof safe === 'object' && !Array.isArray(safe) ? safe : {}
}

export function sanitizeBmccActivityInfo(value: unknown): BmccActivityInfo {
  const initialization = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const info = initialization.activityInfo && typeof initialization.activityInfo === 'object'
    ? initialization.activityInfo as Record<string, unknown>
    : {}
  const raw = info.raw && typeof info.raw === 'object' ? info.raw as Record<string, unknown> : {}
  const merged = { ...raw, ...info }
  delete merged.raw
  const details = jsonDetails(merged)
  const resultCode = text(details.resultCode, 80) || undefined
  return {
    resultCode,
    eligible: typeof initialization.eligible === 'boolean' ? initialization.eligible : undefined,
    alreadyOrdered: typeof initialization.alreadyOrdered === 'boolean' ? initialization.alreadyOrdered : undefined,
    canAttempt: resultCode !== '99',
    message: text(initialization.message, 500) || '活动信息已返回',
    details,
  }
}

function fixedBmccActivityInfo(config: BmccActivityConfig): BmccActivityInfo {
  const isAiBeanContract = config.packageCode === 'JFBXHY' && config.productShowCode === 'G_JFBXHY'
  const isFlyCard8 = config.packageCode === '4GFXTC' && config.productShowCode === 'fxtcsb'
  const renewalPolicy = config.pitemShowCode === 'XY'
    ? '合约到期后按相同规则自动续约一次'
    : config.pitemShowCode === 'BXY' ? '合约到期后自动取消' : '以运营商最终受理规则为准'
  const details: BmccJsonObject = {
    sourceMode: '固定参数直订',
    packageName: config.packageName || config.displayName,
    packageId: config.packageId,
    packageCode: config.packageCode,
    productName: config.productShowName || config.displayName,
    productCode: config.productShowCode || '',
    pitemShowName: config.pitemShowName || '',
    pitemShowCode: config.pitemShowCode,
    activityUrl: config.activityUrl || '',
  }
  if (isAiBeanContract) {
    Object.assign(details, {
      sourceStatus: 'JSP 原版活动页可访问；是否可办以订购接口实时返回为准',
      contractPeriod: '36个月',
      effectiveTime: '办理成功后次月生效',
      aiBeanValidity: 'AI豆自下发之月起36个月内有效，过期自动失效',
      networkCommitment: '合约期内需持续使用中国移动网络',
      terminationRule: '转户、提前解约、离网或携号转网需前往营业厅办理提前取消合约',
      breachPenalty: '违约金为合约期内AI豆倍享增发部分的AI豆价值',
      renewalPolicy,
      globalTelecomRate: '全球通普卡/银卡3倍，金卡4倍，白金卡/钻石卡6倍',
      otherCustomerRate: '非全球通客户网龄1-3个月1倍；网龄每增长3个月增加0.1倍；60个月以上3倍',
    })
  }
  if (isFlyCard8) {
    Object.assign(details, {
      sourceStatus: '2025 年 JSP 原版活动页固定参数直订',
      planCode: '24BJ201078',
      monthlyFee: '8元/月',
      voiceAllowance: '国内通话30分钟/月',
      dataAllowance: '国内通用流量10MB/月，另含10GB咪咕定向流量',
      outOfBundle: '国内通话0.25元/分钟；国内流量30元/GB；国内点对点短信0.1元/条',
      effectiveTime: '新入网或未开通主套餐立即生效；套餐变更次月生效',
      validity: '自生效当月起36个月，期满无异议自动续展36个月',
      incompatibility: '与WAP不限量业务互斥',
      terminationRule: '可通过中国移动APP、营业厅、10086等变更为其他在售套餐',
      breachPenalty: '变更、退订、销户或携转无需承担违约责任',
    })
  }
  return {
    resultCode: isAiBeanContract ? 'JSP_SOURCE' : isFlyCard8 ? 'JSP_FIXED_CONFIG' : 'FIXED_CONFIG',
    canAttempt: true,
    message: isAiBeanContract || isFlyCard8
      ? 'JSP 原版业务信息已加载，最终是否受理由运营商接口实时决定。'
      : '固定业务信息已加载，最终是否受理由运营商接口决定。',
    details,
  }
}

function resultFromRemote(value: unknown): BmccActivityOrderResult {
  const order = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const result = order.result && typeof order.result === 'object'
    ? order.result as Record<string, unknown>
    : order
  return {
    success: order.status === 'accepted' || order.accepted === true,
    uncertain: false,
    code: text(order.resType || result.resType || order.status || 'accepted', 80),
    message: text(order.message, 500) || '业务订购请求已受理，最终结果以北京移动返回和实际生效情况为准。',
    completedAt: new Date().toISOString(),
    details: jsonDetails(order),
  }
}

function uncertainResult(message: string): BmccActivityOrderResult {
  return {
    success: false,
    uncertain: true,
    code: 'RESULT_UNCERTAIN',
    message,
    completedAt: new Date().toISOString(),
    details: { code: 'RESULT_UNCERTAIN', message },
  }
}

function requireStage(session: BmccActivityOrderSession, stages: BmccActivityOrderStage[], action: string): void {
  if (stages.includes(session.stage)) return
  throw new BmccActivityOrderError(`当前流程状态不能${action}，请按顺序操作`, 'INVALID_STAGE', 409)
}

export async function createBmccActivityOrderSession(args: {
  ownerKey: string
  accountId?: string
  phone: string
  loginCacheStatus?: BmccActivityLoginCacheStatus
}): Promise<BmccActivityOrderSessionView> {
  if (!/^1\d{10}$/.test(args.phone)) {
    throw new BmccActivityOrderError('账号缺少可用手机号', 'INVALID_PHONE', 400)
  }
  const remote = await bmccRequest<{ session: { id: string } }>('auth/session', { method: 'POST' })
  const remoteSessionId = text(remote.session?.id, 100)
  if (!remoteSessionId) throw new BmccActivityOrderError('BMCC 未返回登录会话', 'BMCC_SESSION_INVALID', 502)
  try {
    await bmccRequest('auth/prepare', {
      method: 'POST',
      body: JSON.stringify({ sessionId: remoteSessionId }),
    })
    const captcha = await bmccRequest<{ image: string }>(`auth/captcha?sessionId=${encodeURIComponent(remoteSessionId)}`)
    const now = Date.now()
    const session: BmccActivityOrderSession = {
      id: crypto.randomUUID(),
      ownerKey: args.ownerKey,
      accountId: args.accountId,
      phone: args.phone,
      maskedPhone: maskPhone(args.phone),
      remoteSessionId,
      stage: 'captcha_ready',
      loginCacheStatus: args.loginCacheStatus || 'missing',
      captchaImage: text(captcha.image, 2_000_000),
      orderInFlight: false,
      createdAt: now,
      updatedAt: now,
      expiresAt: now + SESSION_TTL_MS,
    }
    sessions.set(session.id, session)
    return sessionView(session)
  } catch (error) {
    void bmccRequest(`auth/session/${encodeURIComponent(remoteSessionId)}`, { method: 'DELETE' }).catch(() => undefined)
    throw error
  }
}

async function resumeBmccActivityOrderSession(args: {
  ownerKey: string
  accountId?: string
  phone: string
  remoteSessionId: string
  loggedInAt: string
}): Promise<BmccActivityOrderSessionView> {
  const validated = await bmccRequest<{ valid: boolean; validatedAt?: string }>('auth/session/validate', {
    method: 'POST',
    body: JSON.stringify({ sessionId: args.remoteSessionId, phone: args.phone }),
  })
  if (!validated.valid) {
    throw new BmccActivityOrderError('北京移动登录缓存已失效，请重新登录', 'LOGIN_SESSION_EXPIRED', 401)
  }
  const now = Date.now()
  const session: BmccActivityOrderSession = {
    id: crypto.randomUUID(),
    ownerKey: args.ownerKey,
    accountId: args.accountId,
    phone: args.phone,
    maskedPhone: maskPhone(args.phone),
    remoteSessionId: args.remoteSessionId,
    stage: 'logged_in',
    loginCacheStatus: 'reused',
    loginCachedAt: Date.parse(args.loggedInAt) || now,
    loginValidatedAt: Date.parse(validated.validatedAt || '') || now,
    orderInFlight: false,
    createdAt: now,
    updatedAt: now,
    expiresAt: now + SESSION_TTL_MS,
  }
  sessions.set(session.id, session)
  return sessionView(session)
}

const invalidCachedLoginCodes = new Set([
  'SESSION_NOT_FOUND',
  'NOT_LOGGED_IN',
  'LOGIN_SESSION_EXPIRED',
  'LOGIN_SESSION_PHONE_MISMATCH',
])

export async function restoreCachedBmccActivityOrderSession(args: {
  ownerKey: string
  accountId?: string
  phone: string
}): Promise<{ status: 'missing' | 'expired' | 'reused'; session?: BmccActivityOrderSessionView }> {
  const cached = await readBmccActivityLoginCache(args)
  if (!cached) return { status: 'missing' }
  try {
    const session = await resumeBmccActivityOrderSession({ ...args, ...cached })
    await touchBmccActivityLoginCache(args)
    return { status: 'reused', session }
  } catch (error) {
    if (!(error instanceof BmccActivityOrderError) || !invalidCachedLoginCodes.has(error.code)) throw error
    await clearBmccActivityLoginCache(args)
    void bmccRequest(`auth/session/${encodeURIComponent(cached.remoteSessionId)}`, { method: 'DELETE' })
      .catch(() => undefined)
    return { status: 'expired' }
  }
}

export async function createOrRestoreBmccActivityOrderSession(args: {
  ownerKey: string
  accountId?: string
  phone: string
}): Promise<BmccActivityOrderSessionView> {
  const restored = await restoreCachedBmccActivityOrderSession(args)
  if (restored.session) return restored.session
  return createBmccActivityOrderSession({ ...args, loginCacheStatus: restored.status })
}

export function canAccessBmccActivityOrderSession(sessionOwnerKey: string, requestOwnerKey: string): boolean {
  return requestOwnerKey === 'admin' || sessionOwnerKey === requestOwnerKey
}

export function assertBmccActivityOrderSessionAccess(id: string, ownerKey: string): void {
  const session = getSession(id)
  if (canAccessBmccActivityOrderSession(session.ownerKey, ownerKey)) return
  throw new BmccActivityOrderError('无权访问该订购会话', 'FORBIDDEN', 403)
}

export function readBmccActivityOrderSession(id: string): BmccActivityOrderSessionView {
  return sessionView(getSession(id))
}

export function readAuthenticatedBmccActivityOrderContext(args: {
  id: string
  ownerKey: string
  accountId: string
}): AuthenticatedBmccActivityOrderContext {
  const session = getSession(args.id)
  if (!canAccessBmccActivityOrderSession(session.ownerKey, args.ownerKey)) {
    throw new BmccActivityOrderError('无权访问该北京移动登录会话', 'FORBIDDEN', 403)
  }
  if (!session.accountId || session.accountId !== args.accountId) {
    throw new BmccActivityOrderError('北京移动登录会话与办理账号不一致，请重新开始', 'LOGIN_SESSION_ACCOUNT_MISMATCH', 409)
  }
  if (!['logged_in', 'activity_ready', 'order_sms_required', 'finished'].includes(session.stage)) {
    throw new BmccActivityOrderError('请先完成北京移动验证码登录', 'BMCC_LOGIN_REQUIRED', 401)
  }
  return {
    accountId: session.accountId,
    phone: session.phone,
    maskedPhone: session.maskedPhone,
    remoteSessionId: session.remoteSessionId,
  }
}

export async function requestBmccPremiumBroadband<T>(
  remoteSessionId: string,
  action: BmccPremiumBroadbandAction,
  input: Record<string, unknown> = {},
): Promise<T> {
  return bmccRequest<T>(`custom-orders/premium-broadband/${action}`, {
    method: 'POST',
    body: JSON.stringify({ sessionId: remoteSessionId, ...input }),
  })
}

export async function refreshBmccActivityCaptcha(id: string): Promise<BmccActivityOrderSessionView> {
  const session = getSession(id)
  requireStage(session, ['captcha_ready', 'login_sms_sent'], '刷新图形验证码')
  const captcha = await bmccRequest<{ image: string }>(
    `auth/captcha?sessionId=${encodeURIComponent(session.remoteSessionId)}`,
  )
  session.captchaImage = text(captcha.image, 2_000_000)
  touch(session)
  return sessionView(session)
}

export async function sendBmccActivityLoginSms(id: string, captcha: string): Promise<BmccActivityOrderSessionView> {
  const session = getSession(id)
  requireStage(session, ['captcha_ready', 'login_sms_sent'], '发送登录验证码')
  const remaining = remainingSeconds(session.loginSmsSentAt)
  if (remaining > 0) throw new BmccActivityOrderError(`请 ${remaining} 秒后再发送`, 'SMS_COOLDOWN', 429)
  if (!text(captcha, 20)) throw new BmccActivityOrderError('请输入图形验证码', 'CAPTCHA_REQUIRED', 400)
  await bmccRequest('auth/send-sms', {
    method: 'POST',
    body: JSON.stringify({ sessionId: session.remoteSessionId, phone: session.phone, captcha: text(captcha, 20) }),
  })
  session.stage = 'login_sms_sent'
  session.loginSmsSentAt = Date.now()
  touch(session)
  return sessionView(session)
}

export async function loginBmccActivityOrderSession(id: string, code: string): Promise<BmccActivityOrderSessionView> {
  const session = getSession(id)
  requireStage(session, ['login_sms_sent'], '登录')
  if (!/^\d{6}$/.test(code)) throw new BmccActivityOrderError('请输入 6 位登录验证码', 'INVALID_CODE', 400)
  await bmccRequest('auth/login', {
    method: 'POST',
    body: JSON.stringify({ sessionId: session.remoteSessionId, phone: session.phone, code }),
  })
  session.stage = 'logged_in'
  session.captchaImage = undefined
  touch(session)
  return sessionView(session)
}

export async function cacheBmccActivityOrderLogin(id: string): Promise<BmccActivityOrderSessionView> {
  const session = getSession(id)
  requireStage(session, ['logged_in'], '缓存登录状态')
  const cached = await saveBmccActivityLoginCache({
    accountId: session.accountId,
    phone: session.phone,
    remoteSessionId: session.remoteSessionId,
  })
  session.loginCacheStatus = 'saved'
  session.loginCachedAt = Date.parse(cached.loggedInAt)
  session.loginValidatedAt = Date.parse(cached.checkedAt)
  touch(session)
  return sessionView(session)
}

export async function loadBmccActivityInfo(
  id: string,
  configInput: BmccActivityConfig,
): Promise<BmccActivityOrderSessionView> {
  const session = getSession(id)
  requireStage(session, ['logged_in', 'activity_ready'], '查询活动')
  const config = resolveBmccActivityConfig(configInput as unknown as Record<string, unknown>)
  session.config = config
  session.configFingerprint = configFingerprint(config)
  if (config.proType) {
    const data = await bmccRequest<{ initialization: unknown }>('custom-orders/initialize', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: session.remoteSessionId,
        config: { proType: config.proType },
      }),
    })
    session.activity = sanitizeBmccActivityInfo(data.initialization)
  } else {
    session.activity = fixedBmccActivityInfo(config)
    if (config.packageCode === '4GFXTC' && config.productShowCode === 'fxtcsb') {
      try {
        const data = await bmccRequest<{ usage: unknown }>('custom-orders/fly-card-usage', {
          method: 'POST',
          body: JSON.stringify({ sessionId: session.remoteSessionId }),
        })
        const usage = data.usage && typeof data.usage === 'object'
          ? data.usage as Record<string, unknown>
          : {}
        session.activity = {
          ...session.activity,
          message: text(usage.message, 500) || session.activity.message,
          details: {
            ...session.activity.details,
            ...jsonDetails(usage),
          },
        }
      } catch {
        session.activity = {
          ...session.activity,
          details: {
            ...session.activity.details,
            usageAvailable: false,
            usageMessage: '上月用量查询暂不可用，仍可核对套餐后尝试办理。',
          },
        }
      }
    }
  }
  session.stage = 'activity_ready'
  touch(session)
  return sessionView(session)
}

function remoteOrderConfig(config: BmccActivityConfig): Record<string, unknown> {
  return {
    activityName: `${config.displayName} (${config.activityName})`,
    ...(config.proType ? { proType: config.proType } : {}),
    packageId: config.packageId,
    packageCode: config.packageCode,
    packageName: config.packageName || '',
    productShowCode: config.productShowCode || '',
    productShowName: config.productShowName || '',
    productSendUrl: config.productSendUrl || '',
    pitemShowCode: config.pitemShowCode,
    pitemShowName: config.pitemShowName || '',
    pitemSendUrl: config.pitemSendUrl || '',
    mtOtherParams: config.mtOtherParams || '',
    prodValue: config.prodValue || '',
    ...(config.isQd2018 === undefined ? {} : { isQd2018: config.isQd2018 }),
  }
}

export async function updateBmccActivityOrderRequest(
  id: string,
  configInput: BmccActivityConfig,
): Promise<BmccActivityOrderSessionView> {
  const session = getSession(id)
  requireStage(session, ['activity_ready', 'order_sms_required'], '修改订购参数')
  const config = resolveBmccActivityConfig(configInput as unknown as Record<string, unknown>)
  if (session.pendingRemoteOrderId) {
    await bmccRequest(`custom-orders/${encodeURIComponent(session.pendingRemoteOrderId)}`, {
      method: 'DELETE',
      body: JSON.stringify({ sessionId: session.remoteSessionId }),
    })
  }
  session.config = config
  session.configFingerprint = configFingerprint(config)
  session.pendingRemoteOrderId = undefined
  session.orderSms = undefined
  session.orderSmsSentAt = undefined
  session.lastResult = undefined
  if (config.proType) {
    session.activity = undefined
    session.stage = 'logged_in'
  } else {
    session.activity = fixedBmccActivityInfo(config)
    session.stage = 'activity_ready'
  }
  touch(session)
  return sessionView(session)
}

export async function submitBmccActivityOrder(args: {
  id: string
  acceptedProtocol: boolean
  confirmationText: string
}): Promise<BmccActivityOrderSessionView> {
  const session = getSession(args.id)
  requireStage(session, ['activity_ready'], '提交订购')
  if (!session.config || !session.configFingerprint || !session.activity) {
    throw new BmccActivityOrderError('请先选择活动配置并查询活动信息', 'ACTIVITY_NOT_READY', 409)
  }
  if (!args.acceptedProtocol || args.confirmationText !== '确认订购') {
    throw new BmccActivityOrderError('请核对活动参数、勾选确认并输入“确认订购”', 'CONFIRMATION_REQUIRED', 400)
  }
  if (session.orderInFlight) throw new BmccActivityOrderError('订购正在提交，请勿重复操作', 'ORDER_IN_PROGRESS', 409)
  session.orderInFlight = true
  try {
    const data = await bmccRequest<{ order: Record<string, unknown> }>('custom-orders/submit', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: session.remoteSessionId,
        config: remoteOrderConfig(session.config),
        agreed: true,
        confirmationId: `${session.id.replace(/-/g, '')}_${session.configFingerprint}`,
      }),
    })
    const order = data.order || {}
    if (order.status === 'sms_required') {
      const remoteOrderId = text(order.orderId, 100)
      if (!remoteOrderId) throw new BmccActivityOrderError('订购短信上下文不完整', 'ORDER_SMS_CONTEXT_INVALID', 502)
      const sms = order.sms && typeof order.sms === 'object' ? order.sms as Record<string, unknown> : {}
      session.pendingRemoteOrderId = remoteOrderId
      session.orderSms = {
        smsType: text(sms.smsType, 80) || undefined,
        productItemName: text(sms.productItemName, 300) || session.config.displayName,
        productItemDesc: text(sms.productItemDesc, 3000) || undefined,
        busiTime: text(sms.busiTime, 300) || undefined,
      }
      session.stage = 'order_sms_required'
    } else {
      session.lastResult = resultFromRemote(order)
      session.stage = 'finished'
    }
    touch(session)
    return sessionView(session)
  } catch (error) {
    if (error instanceof BmccActivityOrderError && ['BMCC_SERVICE_TIMEOUT', 'BMCC_SERVICE_UNAVAILABLE'].includes(error.code)) {
      session.lastResult = uncertainResult('订购提交时本地服务连接中断，结果无法确认。请先通过官方渠道查询，不要直接重复订购。')
      session.stage = 'finished'
      touch(session)
      return sessionView(session)
    }
    throw error
  } finally {
    session.orderInFlight = false
  }
}

export async function sendBmccActivityOrderSms(id: string): Promise<BmccActivityOrderSessionView> {
  const session = getSession(id)
  requireStage(session, ['order_sms_required'], '发送订购验证码')
  const remaining = remainingSeconds(session.orderSmsSentAt)
  if (remaining > 0) throw new BmccActivityOrderError(`请 ${remaining} 秒后再发送`, 'SMS_COOLDOWN', 429)
  if (!session.pendingRemoteOrderId) throw new BmccActivityOrderError('订购短信上下文已失效', 'ORDER_SMS_CONTEXT_INVALID', 409)
  await bmccRequest(`custom-orders/${encodeURIComponent(session.pendingRemoteOrderId)}/sms/send`, {
    method: 'POST',
    body: JSON.stringify({ sessionId: session.remoteSessionId }),
  })
  session.orderSmsSentAt = Date.now()
  touch(session)
  return sessionView(session)
}

function normalizeBmccOrderSmsCode(value: unknown, packageCode: string): string {
  const code = text(value, 10)
  if (/^\d{6}$/.test(code)) return code
  if (packageCode === 'JFBXHY' && /^\d{8}$/.test(code)) return `${code.slice(0, 5)}${code.slice(-1)}`
  throw new BmccActivityOrderError(
    packageCode === 'JFBXHY'
      ? '请输入短信中的 8 位验证密码，或截取后的 6 位验证码'
      : '请输入 6 位短信验证码',
    'INVALID_CODE',
    400,
  )
}

export async function confirmBmccActivityOrder(id: string, code: string): Promise<BmccActivityOrderSessionView> {
  const session = getSession(id)
  requireStage(session, ['order_sms_required'], '确认订购')
  const normalizedCode = normalizeBmccOrderSmsCode(code, session.config?.packageCode || '')
  if (!session.orderSmsSentAt) throw new BmccActivityOrderError('请先发送订购验证码', 'ORDER_SMS_NOT_SENT', 409)
  if (!session.pendingRemoteOrderId) throw new BmccActivityOrderError('订购短信上下文已失效', 'ORDER_SMS_CONTEXT_INVALID', 409)
  if (session.orderInFlight) throw new BmccActivityOrderError('订购正在提交，请勿重复操作', 'ORDER_IN_PROGRESS', 409)
  session.orderInFlight = true
  try {
    const data = await bmccRequest<{ order: Record<string, unknown> }>(
      `custom-orders/${encodeURIComponent(session.pendingRemoteOrderId)}/sms/verify`,
      {
        method: 'POST',
        body: JSON.stringify({ sessionId: session.remoteSessionId, smsCode: normalizedCode }),
      },
    )
    session.lastResult = resultFromRemote(data.order)
    session.stage = 'finished'
    session.pendingRemoteOrderId = undefined
    touch(session)
    return sessionView(session)
  } catch (error) {
    if (error instanceof BmccActivityOrderError && ['BMCC_SERVICE_TIMEOUT', 'BMCC_SERVICE_UNAVAILABLE'].includes(error.code)) {
      session.lastResult = uncertainResult('验证码提交后本地服务连接中断，结果无法确认。请先通过官方渠道查询，不要直接重复订购。')
      session.stage = 'finished'
      touch(session)
      return sessionView(session)
    }
    throw error
  } finally {
    session.orderInFlight = false
  }
}

export function deleteBmccActivityOrderSession(id: string): boolean {
  return sessions.delete(id)
}

export const __test__ = {
  activityPresets: BMCC_ACTIVITY_PRESETS,
  canAccessBmccActivityOrderSession,
  fixedBmccActivityInfo,
  normalizeBmccOrderSmsCode,
  remoteOrderConfig,
  resolveBmccActivityConfig,
  sanitizeBmccActivityInfo,
}

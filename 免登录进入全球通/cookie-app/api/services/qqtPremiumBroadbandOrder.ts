import crypto from 'node:crypto'
import { getAccountById } from './accountsStore.js'
import {
  BmccActivityOrderError,
  readAuthenticatedBmccActivityOrderContext,
  requestBmccPremiumBroadband,
} from './bmccActivityOrder.js'

const SESSION_TTL_MS = 30 * 60_000
const PRODUCT_NAME = '全球通等级尊享宽带（两年）套餐'
const PREMIUM_BROADBAND_ITEM_CODE = '111602058352'
const DISTRICTS = new Set([
  '东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区', '房山区',
  '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区',
])

type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject
type JsonObject = { [key: string]: JsonValue }

type RemotePortalStep = {
  transportOk: boolean
  status: number
  code: string
  message: string
  response: unknown
}

type PortalResult = {
  ok: boolean
  status: number
  data?: unknown
  raw?: unknown
  message?: string
}

export type QqtPremiumBroadbandGear = {
  itemCode: string
  name: string
}

export type QqtPremiumBroadbandCheck = {
  eligible: boolean
  needsRealName: boolean
  blocked: boolean
  code: string
  message: string
  response: JsonValue
}

export type QqtPremiumBroadbandResult = {
  attempted: boolean
  success: boolean
  uncertain: boolean
  code: string
  message: string
  completedAt: string
  response: JsonValue
}

export type QqtPremiumBroadbandSessionView = {
  id: string
  accountId: string
  maskedPhone: string
  maskedOwnerName?: string
  stage: 'ready' | 'checked' | 'finished'
  productName: string
  contractMonths: 24
  gears: QqtPremiumBroadbandGear[]
  itemCode: string
  initializationMessage?: string
  initializationResponse?: JsonValue
  precheck?: QqtPremiumBroadbandCheck
  lastResult?: QqtPremiumBroadbandResult
  createdAt: string
  updatedAt: string
  expiresAt: string
}

type Session = {
  id: string
  ownerKey: string
  accountId: string
  phone: string
  maskedPhone: string
  ownerName?: string
  stage: QqtPremiumBroadbandSessionView['stage']
  remoteSessionId: string
  gears: QqtPremiumBroadbandGear[]
  itemCode: string
  initializationMessage?: string
  initializationResponse?: JsonValue
  precheck?: QqtPremiumBroadbandCheck
  lastResult?: QqtPremiumBroadbandResult
  orderInFlight: boolean
  createdAt: number
  updatedAt: number
  expiresAt: number
}

export class QqtPremiumBroadbandError extends Error {
  readonly code: string
  readonly status: number
  readonly response?: JsonValue

  constructor(message: string, code = 'QQT_BROADBAND_UPSTREAM_ERROR', status = 424, response?: JsonValue) {
    super(message)
    this.name = 'QqtPremiumBroadbandError'
    this.code = code
    this.status = status
    this.response = response
  }
}

const sessions = new Map<string, Session>()

function record(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined
}

function text(value: unknown, max = 500): string {
  return typeof value === 'string' || typeof value === 'number'
    ? String(value).trim().slice(0, max)
    : ''
}

function maskPhone(value: string): string {
  return /^1\d{10}$/.test(value) ? `${value.slice(0, 3)}****${value.slice(-4)}` : '***'
}

function maskName(value: string | undefined): string | undefined {
  if (!value) return undefined
  const chars = Array.from(value.trim())
  if (!chars.length) return undefined
  if (chars.length === 1) return '*'
  return `${chars[0]}${'*'.repeat(Math.min(3, chars.length - 1))}`
}

export function sanitizeQqtBroadbandResponse(value: unknown, depth = 0): JsonValue {
  if (depth > 7 || value === undefined) return null
  if (value === null) return null
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return Number.isFinite(value) ? value : String(value)
  if (typeof value === 'string') {
    return value
      .replace(/1\d{10}/g, (phone) => maskPhone(phone))
      .replace(/\b\d{17}[\dXx]\b/g, '[证件号码已脱敏]')
      .slice(0, 5_000)
  }
  if (Array.isArray(value)) return value.slice(0, 100).map((item) => sanitizeQqtBroadbandResponse(item, depth + 1))
  const source = record(value)
  if (!source) return String(value).slice(0, 500)
  const output: JsonObject = {}
  for (const [key, item] of Object.entries(source).slice(0, 200)) {
    if (/^name$/i.test(key) || /(cookie|authorization|token|ticket|secret|password|sms|phone|mobile|address|identity|cert|idcard|fingerprint|dfp|wasm|trace|owner.?name|user.?name|cust.?name)/i.test(key)) continue
    output[key.slice(0, 128)] = sanitizeQqtBroadbandResponse(item, depth + 1)
  }
  return output
}

function walkObjects(value: unknown, visit: (item: Record<string, unknown>) => void, depth = 0): void {
  if (depth > 7) return
  if (Array.isArray(value)) {
    for (const item of value.slice(0, 200)) walkObjects(item, visit, depth + 1)
    return
  }
  const source = record(value)
  if (!source) return
  visit(source)
  for (const item of Object.values(source)) walkObjects(item, visit, depth + 1)
}

export function extractQqtBroadbandGears(value: unknown): QqtPremiumBroadbandGear[] {
  const output: QqtPremiumBroadbandGear[] = []
  const seen = new Set<string>()
  walkObjects(value, (item) => {
    const itemCode = text(item.gearId ?? item.itemCode ?? item.item_code ?? item.ITEM_CODE, 80)
    if (!itemCode || seen.has(itemCode)) return
    const name = text(item.gearName ?? item.itemName ?? item.productName ?? item.name, 120) || PRODUCT_NAME
    seen.add(itemCode)
    output.push({ itemCode, name })
  })
  return output
}

function findOwnerName(value: unknown): string {
  let found = ''
  walkObjects(value, (item) => {
    if (found) return
    const hasPhone = Object.entries(item).some(([key, entry]) =>
      /^(phone|phoneNo|mobile|mobileNo|userMobile|ownerMobile)$/i.test(key) && typeof entry === 'string',
    )
    for (const [key, entry] of Object.entries(item)) {
      if ((/^(ownerName|userName|custName|customerName)$/i.test(key) || (hasPhone && /^name$/i.test(key)))
        && typeof entry === 'string' && entry.trim()) {
        found = entry.trim()
        break
      }
    }
  })
  return found
}

function rawRecord(result: PortalResult): Record<string, unknown> {
  return record(result.raw) || record(result.data) || {}
}

function resultCode(result: PortalResult): string {
  const raw = rawRecord(result)
  return text(raw.code ?? record(raw.data)?.code ?? (result.ok ? 'HTTP_2XX' : `HTTP_${result.status}`), 80)
}

function resultMessage(result: PortalResult): string {
  const raw = rawRecord(result)
  const data = record(raw.data)
  return text(raw.message ?? data?.message ?? result.message, 500)
}

export function interpretQqtBroadbandCheck(result: PortalResult): QqtPremiumBroadbandCheck {
  const raw = rawRecord(result)
  const data = record(raw.data) || record(result.data) || {}
  const code = resultCode(result)
  const upstreamMessage = text(data.message ?? raw.message, 500)
  const needsRealName = text(data.isRealName).toUpperCase() !== 'Y'
  const blocked = text(data.isBlack).toUpperCase() === 'Y'
  const ruleRejected = Boolean(upstreamMessage && upstreamMessage.toUpperCase() !== 'Y')
  return {
    eligible: result.ok && code === 'success' && !needsRealName && !blocked && !ruleRejected,
    needsRealName,
    blocked,
    code,
    message: upstreamMessage || (blocked ? '上游返回黑名单限制' : needsRealName ? '上游要求补充实名核验' : `上游返回业务码 ${code}`),
    response: sanitizeQqtBroadbandResponse(result.raw ?? result.data),
  }
}

function now(): number {
  return Date.now()
}

function touch(session: Session): void {
  session.updatedAt = now()
  session.expiresAt = session.updatedAt + SESSION_TTL_MS
}

function cleanup(): void {
  const current = now()
  for (const [id, session] of sessions.entries()) {
    if (session.expiresAt <= current) sessions.delete(id)
  }
}

function getSession(id: string): Session {
  cleanup()
  const session = sessions.get(id)
  if (!session) throw new QqtPremiumBroadbandError('尊享宽带订购会话不存在或已过期，请重新开始', 'QQT_BROADBAND_SESSION_EXPIRED', 404)
  return session
}

function requireActive(session: Session): void {
  if (session.stage === 'finished') {
    throw new QqtPremiumBroadbandError('本次订购已结束，请重新开始', 'QQT_BROADBAND_SESSION_FINISHED', 409)
  }
}

function view(session: Session): QqtPremiumBroadbandSessionView {
  return {
    id: session.id,
    accountId: session.accountId,
    maskedPhone: session.maskedPhone,
    maskedOwnerName: maskName(session.ownerName),
    stage: session.stage,
    productName: PRODUCT_NAME,
    contractMonths: 24,
    gears: session.gears,
    itemCode: session.itemCode,
    initializationMessage: session.initializationMessage,
    initializationResponse: session.initializationResponse,
    precheck: session.precheck,
    lastResult: session.lastResult,
    createdAt: new Date(session.createdAt).toISOString(),
    updatedAt: new Date(session.updatedAt).toISOString(),
    expiresAt: new Date(session.expiresAt).toISOString(),
  }
}

function portalResult(step: RemotePortalStep): PortalResult {
  return {
    ok: step.transportOk,
    status: step.status,
    raw: step.response,
    message: step.message,
  }
}

function convertBmccError(error: unknown): never {
  if (error instanceof BmccActivityOrderError) {
    throw new QqtPremiumBroadbandError(error.message, error.code, error.status)
  }
  throw error
}

async function checkMobile(session: Session): Promise<QqtPremiumBroadbandCheck> {
  try {
    const data = await requestBmccPremiumBroadband<{ check: RemotePortalStep }>(
      session.remoteSessionId,
      'check',
      { itemCode: PREMIUM_BROADBAND_ITEM_CODE },
    )
    return interpretQqtBroadbandCheck(portalResult(data.check))
  } catch (error) {
    return convertBmccError(error)
  }
}

export async function createQqtPremiumBroadbandSession(args: {
  ownerKey: string
  accountId: string
  loginSessionId: string
}): Promise<QqtPremiumBroadbandSessionView> {
  const account = await getAccountById(args.accountId)
  if (!account || account.disabledAt) throw new QqtPremiumBroadbandError('账号不存在或已停用', 'ACCOUNT_NOT_FOUND', 404)
  let loginContext
  try {
    loginContext = readAuthenticatedBmccActivityOrderContext({
      id: args.loginSessionId,
      ownerKey: args.ownerKey,
      accountId: args.accountId,
    })
  } catch (error) {
    return convertBmccError(error)
  }
  if (loginContext.phone !== account.phone) {
    throw new QqtPremiumBroadbandError('北京移动登录号码与办理账号不一致，请重新开始', 'LOGIN_SESSION_PHONE_MISMATCH', 409)
  }
  const createdAt = now()
  const session: Session = {
    id: crypto.randomUUID(),
    ownerKey: args.ownerKey,
    accountId: args.accountId,
    phone: loginContext.phone,
    maskedPhone: loginContext.maskedPhone,
    stage: 'ready',
    remoteSessionId: loginContext.remoteSessionId,
    gears: [],
    itemCode: PREMIUM_BROADBAND_ITEM_CODE,
    orderInFlight: false,
    createdAt,
    updatedAt: createdAt,
    expiresAt: createdAt + SESSION_TTL_MS,
  }
  sessions.set(session.id, session)
  try {
    const data = await requestBmccPremiumBroadband<{ initialization: RemotePortalStep }>(
      session.remoteSessionId,
      'initialize',
    )
    const initialized = portalResult(data.initialization)
    session.initializationResponse = sanitizeQqtBroadbandResponse(data.initialization.response)
    session.initializationMessage = resultMessage(initialized) || (initialized.ok ? undefined : `初始化接口 HTTP ${initialized.status}`)
    session.gears = extractQqtBroadbandGears(data.initialization.response)
    session.ownerName = findOwnerName(data.initialization.response) || undefined
  } catch (error) {
    session.initializationMessage = error instanceof Error ? error.message : '上游产品初始化失败'
    session.initializationResponse = sanitizeQqtBroadbandResponse({ code: 'INITIALIZATION_FAILED', message: session.initializationMessage })
  }
  touch(session)
  return view(session)
}

export function assertQqtPremiumBroadbandSessionAccess(id: string, ownerKey: string): void {
  if (getSession(id).ownerKey !== ownerKey) throw new QqtPremiumBroadbandError('无权访问该尊享宽带订购会话', 'QQT_BROADBAND_SESSION_FORBIDDEN', 403)
}

export function deleteQqtPremiumBroadbandSession(id: string): boolean {
  return sessions.delete(id)
}

export async function checkQqtPremiumBroadband(id: string): Promise<QqtPremiumBroadbandSessionView> {
  const session = getSession(id)
  requireActive(session)
  session.itemCode = PREMIUM_BROADBAND_ITEM_CODE
  session.precheck = await checkMobile(session)
  session.stage = 'checked'
  touch(session)
  return view(session)
}

function validateSubmission(input: Record<string, unknown>): {
  itemCode: string
  ownerName: string
  identityNumber: string
  district: string
  address: string
  contactPhone: string
  installDate: string
  timeSlot: string
} {
  const itemCode = PREMIUM_BROADBAND_ITEM_CODE
  const ownerName = text(input.ownerName, 50)
  const identityNumber = text(input.identityNumber, 20).toUpperCase()
  const district = text(input.district, 20)
  const address = text(input.address, 300)
  const contactPhone = text(input.contactPhone, 20)
  const installDate = text(input.installDate, 10)
  const timeSlot = text(input.timeSlot, 2)
  if (ownerName && (ownerName.length < 2 || ownerName.length > 50)) throw new QqtPremiumBroadbandError('机主姓名格式不正确', 'QQT_BROADBAND_OWNER_NAME_INVALID', 400)
  if (identityNumber && !/^\d{14,17}[\dX]$/.test(identityNumber)) throw new QqtPremiumBroadbandError('证件号码格式不正确', 'QQT_BROADBAND_IDENTITY_INVALID', 400)
  if (!DISTRICTS.has(district)) throw new QqtPremiumBroadbandError('请选择北京市城区', 'QQT_BROADBAND_DISTRICT_INVALID', 400)
  if (!address || address.length < 3) throw new QqtPremiumBroadbandError('请填写详细安装地址', 'QQT_BROADBAND_ADDRESS_REQUIRED', 400)
  if (!/^1\d{10}$/.test(contactPhone)) throw new QqtPremiumBroadbandError('请填写11位安装联系电话', 'QQT_BROADBAND_CONTACT_INVALID', 400)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(installDate)) throw new QqtPremiumBroadbandError('请选择期望安装日期', 'QQT_BROADBAND_DATE_INVALID', 400)
  const selectedDate = new Date(`${installDate}T00:00:00+08:00`).getTime()
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  if (!Number.isFinite(selectedDate) || selectedDate < todayStart) throw new QqtPremiumBroadbandError('期望安装日期不能早于今天', 'QQT_BROADBAND_DATE_INVALID', 400)
  if (!['1', '2', '3', '4'].includes(timeSlot)) throw new QqtPremiumBroadbandError('请选择期望安装时段', 'QQT_BROADBAND_TIME_SLOT_INVALID', 400)
  return { itemCode, ownerName, identityNumber, district, address, contactPhone, installDate, timeSlot }
}

export async function submitQqtPremiumBroadband(id: string, input: Record<string, unknown>): Promise<QqtPremiumBroadbandSessionView> {
  const session = getSession(id)
  requireActive(session)
  if (session.orderInFlight) throw new QqtPremiumBroadbandError('订单正在提交，请勿重复操作', 'QQT_BROADBAND_ORDER_IN_FLIGHT', 409)
  if (input.acceptedProtocol !== true || text(input.confirmationText, 20) !== '确认订购') {
    throw new QqtPremiumBroadbandError('请阅读协议并输入“确认订购”', 'QQT_BROADBAND_CONFIRMATION_REQUIRED', 400)
  }
  const form = validateSubmission(input)
  session.orderInFlight = true
  session.itemCode = form.itemCode
  touch(session)
  let attempted = false
  try {
    attempted = true
    const data = await requestBmccPremiumBroadband<{
      submission: {
        precheck: RemotePortalStep
        realName?: RemotePortalStep
        commit: RemotePortalStep
        resultQuery?: RemotePortalStep
      }
    }>(session.remoteSessionId, 'submit', {
      itemCode: form.itemCode,
      ownerName: form.ownerName || session.ownerName || '',
      identityNumber: form.identityNumber,
      address: `${form.district}-${form.address}`,
      contactPhone: form.contactPhone,
      installDate: form.installDate.replace(/-/g, ''),
      timeSlot: form.timeSlot,
    })
    const submission = data.submission
    const precheck = interpretQqtBroadbandCheck(portalResult(submission.precheck))
    session.precheck = precheck
    const commit = portalResult(submission.commit)
    const code = resultCode(commit)
    const success = commit.ok && code === 'success'
    const upstreamMessage = resultMessage(commit)
    session.lastResult = {
      attempted: true,
      success,
      uncertain: !commit.ok || !code || code === 'HTTP_2XX',
      code,
      message: upstreamMessage || `上游提交接口返回业务码 ${code}`,
      completedAt: new Date().toISOString(),
      response: sanitizeQqtBroadbandResponse({
        stage: 'commitQQTZX',
        precheck: submission.precheck.response,
        ...(submission.realName ? { realName: submission.realName.response } : {}),
        commit: submission.commit.response,
        ...(submission.resultQuery ? { resultQuery: submission.resultQuery.response } : {}),
      }),
    }
  } catch (error) {
    session.lastResult = {
      attempted,
      success: false,
      uncertain: true,
      code: error instanceof BmccActivityOrderError || error instanceof QqtPremiumBroadbandError ? error.code : 'REQUEST_FAILED',
      message: error instanceof Error ? error.message : '提交接口请求失败',
      completedAt: new Date().toISOString(),
      response: sanitizeQqtBroadbandResponse({
        code: error instanceof BmccActivityOrderError || error instanceof QqtPremiumBroadbandError ? error.code : 'REQUEST_FAILED',
        message: error instanceof Error ? error.message : '提交接口请求失败',
      }),
    }
  } finally {
    session.orderInFlight = false
    session.stage = 'finished'
    touch(session)
  }
  return view(session)
}

export const __test__ = {
  PREMIUM_BROADBAND_ITEM_CODE,
  extractQqtBroadbandGears,
  interpretQqtBroadbandCheck,
  sanitizeQqtBroadbandResponse,
  validateSubmission,
}

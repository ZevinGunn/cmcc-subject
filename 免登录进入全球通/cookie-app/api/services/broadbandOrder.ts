import crypto from 'node:crypto'
import { getAccountById, getAccountCookie } from './accountsStore.js'
import {
  broadbandPortalRequest,
  createBroadbandPortalSession,
  type BroadbandPortalResult,
  type BroadbandPortalSession,
} from './broadbandPortalClient.js'
import {
  getBroadbandProductConfig,
  listBroadbandProductConfigs,
  projectBroadbandConfig,
  type BroadbandFlowType,
  type BroadbandJsonObject,
  type BroadbandJsonValue,
  type BroadbandOperationMode,
  type BroadbandProductConfig,
} from './broadbandOrderConfigs.js'

const SESSION_TTL_MS = 30 * 60_000
const SMS_COOLDOWN_MS = 60_000
const MAX_FIELD_BYTES = 50_000
const RENEWAL_BASE = '/portal-bff/api/avoidLogin/renewalBroadband/v1.0'

export type BroadbandOrderStage =
  | 'created'
  | 'captcha_ready'
  | 'account_ready'
  | 'catalog_ready'
  | 'sms_sent'
  | 'verified'
  | 'prepared'
  | 'finished'

export type BroadbandOrderResult = {
  success: boolean
  uncertain: boolean
  paymentRequired: boolean
  code: string
  message: string
  paymentUrl?: string
  completedAt: string
  details?: BroadbandJsonObject
}

export type BroadbandAccountOption = {
  id: string
  maskedNumber: string
  itemName: string
  endTime: string
  isExpire?: string | boolean
}

export type BroadbandOrderSessionView = {
  id: string
  accountId: string
  maskedPhone: string
  flowType: BroadbandFlowType
  stage: BroadbandOrderStage
  captchaImage?: string
  captchaPurpose?: 'lookup' | 'sms' | 'commit'
  accounts: BroadbandAccountOption[]
  selectedBroadband?: BroadbandAccountOption
  products: BroadbandProductConfig[]
  selectedProduct?: BroadbandProductConfig
  context?: BroadbandJsonObject
  balanceWarning?: string
  smsCooldownSeconds: number
  lastResult?: BroadbandOrderResult
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
  flowType: BroadbandFlowType
  stage: BroadbandOrderStage
  portal: BroadbandPortalSession
  captchaImage?: string
  captchaPurpose?: 'lookup' | 'sms' | 'commit'
  accountRecords: Record<string, unknown>[]
  selectedBroadbandRecord?: Record<string, unknown>
  products: BroadbandProductConfig[]
  selectedProduct?: BroadbandProductConfig
  renewalContext?: Record<string, unknown>
  installPreparedContext?: Record<string, unknown>
  balanceWarning?: string
  smsSentAt?: number
  orderInFlight: boolean
  lastResult?: BroadbandOrderResult
  createdAt: number
  updatedAt: number
  expiresAt: number
}

export class BroadbandOrderError extends Error {
  readonly code: string
  readonly status: number

  constructor(message: string, code = 'BROADBAND_UPSTREAM_ERROR', status = 424) {
    super(message)
    this.name = 'BroadbandOrderError'
    this.code = code
    this.status = status
  }
}

const sessions = new Map<string, Session>()

function now(): number {
  return Date.now()
}

function record(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined
}

function array(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function text(value: unknown, max = 500): string {
  return typeof value === 'string' || typeof value === 'number'
    ? String(value).trim().slice(0, max)
    : ''
}

function maskPhone(value: string): string {
  return /^1\d{10}$/.test(value) ? `${value.slice(0, 3)}****${value.slice(-4)}` : '***'
}

function maskAccount(value: string): string {
  if (value.length <= 4) return '*'.repeat(Math.max(1, value.length))
  return `${'*'.repeat(Math.min(8, value.length - 4))}${value.slice(-4)}`
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
  if (!session) throw new BroadbandOrderError('宽带办理会话不存在或已过期，请重新开始', 'BROADBAND_SESSION_EXPIRED', 404)
  return session
}

function requireFlow(session: Session, flowType: BroadbandFlowType): void {
  if (session.flowType !== flowType) throw new BroadbandOrderError('当前会话业务类型不匹配', 'BROADBAND_FLOW_MISMATCH', 409)
}

function requireStage(session: Session, allowed: BroadbandOrderStage[], action: string): void {
  if (!allowed.includes(session.stage)) {
    throw new BroadbandOrderError(`当前流程状态不能${action}`, 'BROADBAND_INVALID_STAGE', 409)
  }
}

function smsCooldown(session: Session): number {
  if (!session.smsSentAt) return 0
  return Math.max(0, Math.ceil((session.smsSentAt + SMS_COOLDOWN_MS - now()) / 1000))
}

function accountOption(item: Record<string, unknown>, index: number): BroadbandAccountOption {
  const realBill = text(item.realBill || item.bill_id || item.billId, 100)
  return {
    id: crypto.createHash('sha256').update(`${realBill}:${index}`).digest('hex').slice(0, 16),
    maskedNumber: maskAccount(realBill),
    itemName: text(item.itemName || item.productName, 120) || `宽带 ${index + 1}`,
    endTime: text(item.endTime || item.failureTime, 60),
    ...(item.isExpire !== undefined ? { isExpire: item.isExpire as string | boolean } : {}),
  }
}

function safeContext(value: Record<string, unknown> | undefined): BroadbandJsonObject | undefined {
  if (!value) return undefined
  const bbUser = record(value.bbUser)
  return {
    resType: text(value.resType),
    busiCode: text(value.busiCode),
    userGrade: text(value.userGrade),
    productName: text(bbUser?.productName, 160),
    userAccCode: maskAccount(text(bbUser?.userAccCode, 100)),
    payerMobile: maskPhone(text(bbUser?.payerMobile, 30)),
    effectiveTime: text(bbUser?.effectiveTime, 60),
    failureTime: text(bbUser?.failureTime, 60),
    isHideField: typeof value.isHideField === 'boolean' ? value.isHideField : text(value.isHideField),
  }
}

function sessionView(session: Session): BroadbandOrderSessionView {
  const options = session.accountRecords.map(accountOption)
  const selectedIndex = session.selectedBroadbandRecord
    ? session.accountRecords.indexOf(session.selectedBroadbandRecord)
    : -1
  return {
    id: session.id,
    accountId: session.accountId,
    maskedPhone: session.maskedPhone,
    flowType: session.flowType,
    stage: session.stage,
    captchaImage: session.captchaImage,
    captchaPurpose: session.captchaPurpose,
    accounts: options,
    selectedBroadband: selectedIndex >= 0 ? options[selectedIndex] : undefined,
    products: session.products,
    selectedProduct: session.selectedProduct,
    context: safeContext(session.renewalContext),
    balanceWarning: session.balanceWarning,
    smsCooldownSeconds: smsCooldown(session),
    lastResult: session.lastResult,
    createdAt: new Date(session.createdAt).toISOString(),
    updatedAt: new Date(session.updatedAt).toISOString(),
    expiresAt: new Date(session.expiresAt).toISOString(),
  }
}

function safeFields(value: unknown): BroadbandJsonObject {
  const source = record(value)
  if (!source) return {}
  const serialized = JSON.stringify(source)
  if (serialized.length > MAX_FIELD_BYTES) throw new BroadbandOrderError('业务字段不能超过50KB', 'BROADBAND_FIELDS_TOO_LARGE', 400)
  if (/"(?:__proto__|prototype|constructor)"\s*:/.test(serialized)) {
    throw new BroadbandOrderError('业务字段包含不允许的键', 'BROADBAND_FIELDS_INVALID', 400)
  }
  return JSON.parse(serialized) as BroadbandJsonObject
}

function deepMerge(...values: unknown[]): BroadbandJsonObject {
  const out: BroadbandJsonObject = {}
  for (const value of values) {
    const source = safeFields(value)
    for (const [key, next] of Object.entries(source)) {
      const current = out[key]
      if (record(current) && record(next)) out[key] = deepMerge(current, next)
      else out[key] = next
    }
  }
  return out
}

function stringJson(value: unknown): unknown {
  if (typeof value !== 'string') return value
  const trimmed = value.trim()
  if (!trimmed || !/^[\[{]/.test(trimmed)) return value
  try {
    return JSON.parse(trimmed) as unknown
  } catch {
    return value
  }
}

function responseData(result: { ok: boolean; status: number; data?: unknown; message?: string }, action: string): Record<string, unknown> {
  if (!result.ok) throw new BroadbandOrderError(result.message || `${action}失败 (HTTP ${result.status})`)
  return record(result.data) || (result.data === undefined || result.data === null ? {} : { data: result.data })
}

function eligibilityResponse(result: BroadbandPortalResult): string {
  if (!result.ok) throw new BroadbandOrderError(result.message || `校验宽带续约资格失败 (HTTP ${result.status})`)
  if (result.data === null || result.data === undefined) return ''
  const source = record(result.data)
  if (!source) return text(result.data, 500)
  const candidate = source.message ?? source.data ?? source.result
  return candidate === null || candidate === undefined ? '' : text(candidate, 500)
}

function installCommitFields(value: unknown): BroadbandJsonObject {
  const fields = safeFields(value)
  const topLevel = Object.fromEntries(
    Object.entries(fields).filter(([key]) => !['query', 'selection', 'commit', 'runtimeProduct', 'precheck'].includes(key)),
  ) as BroadbandJsonObject
  return deepMerge(topLevel, fields.commit)
}

function renewalOrderFields(value: unknown): BroadbandJsonObject {
  const fields = safeFields(value)
  return Object.fromEntries(
    Object.entries(fields).filter(([key]) => !['query', 'selection', 'commit', 'runtimeProduct', 'precheck'].includes(key)),
  ) as BroadbandJsonObject
}

function installPreparedFields(value: unknown): BroadbandJsonObject {
  const source = safeFields(value)
  return Object.fromEntries(
    Object.entries(source).filter(([key]) => !['code', 'message', 'errmesg', 'resType', 'result', 'success', 'itemsJson', 'runtimeProduct'].includes(key)),
  ) as BroadbandJsonObject
}

function runtimeId(prefix: string, value: unknown): string {
  return `runtime:${prefix}:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 14)}`
}

function installProduct(item: Record<string, unknown>, parent: BroadbandProductConfig): BroadbandProductConfig {
  const displayName = text(item.productItemName || item.offerName, 120) || '未命名宽带产品'
  const fields = deepMerge(parent.fields, {
    selection: {
      PITEMSHOWCODE: text(item.otherInfo1 || item.pitemShowCode, 120),
      info: displayName,
      chooseName: text(item.feeInfo, 200),
      OFFER_ID: text(item.showField1 || item.offer || item.otherInfo2, 160),
    },
    runtimeProduct: safeFields(item),
  })
  return {
    id: runtimeId('install', item),
    configKey: `${parent.configKey}-${text(item.otherInfo1, 60) || 'runtime'}`,
    flowType: 'install',
    operationMode: 'install',
    displayName,
    description: text(item.productItemDesc || item.feeInfo, 220),
    category: parent.category,
    fields,
    source: 'runtime',
    editable: false,
  }
}

function findCandidateRecords(value: unknown, out: Record<string, unknown>[] = [], depth = 0): Record<string, unknown>[] {
  if (depth > 7 || out.length >= 200) return out
  if (Array.isArray(value)) {
    for (const item of value) findCandidateRecords(item, out, depth + 1)
    return out
  }
  const source = record(stringJson(value))
  if (!source) return out
  const name = text(source.offerName || source.productName || source.productItemName)
  const code = text(source.offerId || source.busiSelect || source.offerCode || source.productCode)
  if (name && code) out.push(source)
  for (const child of Object.values(source)) findCandidateRecords(stringJson(child), out, depth + 1)
  return out
}

function runtimeRenewalProduct(item: Record<string, unknown>, category = 'RUNTIME'): BroadbandProductConfig {
  const offerId = text(item.offerId || item.busiSelect || item.offerCode || item.productCode, 120)
  const offerName = text(item.offerName || item.productName || item.productItemName, 160) || offerId
  const single = Boolean(item.offerId && (item.payFee !== undefined || item.flagBG !== undefined || category === 'DKKD'))
  const operationMode: BroadbandOperationMode = single ? 'renewal_single' : 'renewal_aj'
  const businessInfo: BroadbandJsonObject = {
    offerName,
    offerVasFee: text(item.offerVasFee || item.payFee, 60),
    opType: single ? '3' : text(item.opType, 10) || '1',
    paymentType: text(item.paymentType, 10) || '1',
    invoicetype: text(item.invoicetype, 20),
  }
  if (single) {
    businessInfo.offerId = offerId
    businessInfo.payFee = text(item.payFee, 60)
    businessInfo.payFeeShow = text(item.payFeeShow, 60)
    businessInfo.expiredDate = text(item.expiredDate, 80)
    businessInfo.flagBG = text(item.flagBG, 30)
  } else {
    businessInfo.busiSelect = offerId
    businessInfo.hyq = text(item.hyq || item.contractMonths, 20)
  }
  return {
    id: runtimeId('renewal', item),
    configKey: `runtime-${offerId}`,
    flowType: 'renewal',
    operationMode,
    displayName: offerName,
    description: text(item.payFeeShow || item.expiredDate || item.offerVasFee, 200),
    category,
    fields: {
      bbBusiType: category,
      busiCode: '',
      businessInfo,
      runtimeProduct: safeFields(item),
    },
    source: 'runtime',
    editable: false,
  }
}

function dedupeProducts(products: BroadbandProductConfig[]): BroadbandProductConfig[] {
  const seen = new Set<string>()
  return products.filter((item) => {
    const businessInfo = record(item.fields.businessInfo)
    const selection = record(item.fields.selection)
    const key = [item.flowType, item.operationMode, item.category, text(businessInfo?.offerId || businessInfo?.busiSelect || selection?.PITEMSHOWCODE), item.displayName].join('|')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function detectImageMime(buffer: Buffer): string | undefined {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg'
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png'
  if (buffer.length >= 6 && ['GIF87a', 'GIF89a'].includes(buffer.subarray(0, 6).toString('ascii'))) return 'image/gif'
  if (buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') return 'image/webp'
  return undefined
}

async function queryInstallProducts(
  session: Session,
  configs: BroadbandProductConfig[],
): Promise<BroadbandProductConfig[]> {
  const products: BroadbandProductConfig[] = []
  for (const config of configs) {
    try {
      const response = responseData(await broadbandPortalRequest(session.portal, {
        method: 'POST',
        path: '/portal-bff/api/avoidLogin/broadband/bbConsole/v1.0/showKDYSL',
        data: record(config.fields.query) || {},
      }), '查询可新装产品')
      const items = array(stringJson(response.itemsJson)).map(record).filter((item): item is Record<string, unknown> => Boolean(item))
      products.push(...items.map((item) => installProduct(item, config)))
    } catch {
      // Product entry points are independent; keep all other runtime and local products.
    }
  }
  return products
}

function paymentUrl(value: unknown): string | undefined {
  const candidate = text(value, 2_000)
  if (!candidate) return undefined
  try {
    const parsed = new URL(candidate)
    if (parsed.protocol !== 'https:' || !/(^|\.)10086\.cn$|(^|\.)bmcc\.com\.cn$/.test(parsed.hostname)) return undefined
    return parsed.toString()
  } catch {
    return undefined
  }
}

function resultDetails(value: unknown): BroadbandJsonObject | undefined {
  const source = record(value)
  if (!source) return undefined
  const sanitize = (item: unknown, depth = 0): BroadbandJsonValue | undefined => {
    if (depth > 6 || item === undefined) return undefined
    if (item === null) return null
    if (typeof item === 'boolean') return item
    if (typeof item === 'number') return Number.isFinite(item) ? item : String(item)
    if (typeof item === 'string') return item.replace(/1\d{10}/g, (phone) => maskPhone(phone)).slice(0, 5_000)
    if (Array.isArray(item)) return item.slice(0, 100).map((entry) => sanitize(entry, depth + 1)).filter((entry): entry is BroadbandJsonValue => entry !== undefined)
    const nested = record(item)
    if (!nested) return undefined
    const output: BroadbandJsonObject = {}
    for (const [key, entry] of Object.entries(nested).slice(0, 200)) {
      if (/(cookie|token|ticket|mobile|phone|receiver|sms|password|identity|cert|dfp|fingerprint|wasm|risk)/i.test(key)) continue
      const safe = sanitize(entry, depth + 1)
      if (safe !== undefined) output[key.slice(0, 128)] = safe
    }
    return output
  }
  const result = sanitize(source)
  return result && typeof result === 'object' && !Array.isArray(result) ? result : undefined
}

export async function createBroadbandOrderSession(args: {
  ownerKey: string
  accountId: string
  flowType: BroadbandFlowType
}): Promise<BroadbandOrderSessionView> {
  const account = await getAccountById(args.accountId)
  if (!account || account.disabledAt) throw new BroadbandOrderError('账号不存在或已停用', 'ACCOUNT_NOT_FOUND', 404)
  const cookie = await getAccountCookie(args.accountId)
  if (!cookie) throw new BroadbandOrderError('账号缺少可用 Cookie，请先刷新登录状态', 'COOKIE_INVALID', 410)
  const createdAt = now()
  const session: Session = {
    id: crypto.randomUUID(),
    ownerKey: args.ownerKey,
    accountId: args.accountId,
    phone: account.phone,
    maskedPhone: maskPhone(account.phone),
    flowType: args.flowType,
    stage: 'created',
    portal: createBroadbandPortalSession(cookie, args.flowType, account.qqtAccessToken),
    accountRecords: [],
    products: [],
    orderInFlight: false,
    createdAt,
    updatedAt: createdAt,
    expiresAt: createdAt + SESSION_TTL_MS,
  }
  sessions.set(session.id, session)
  return sessionView(session)
}

export function assertBroadbandOrderSessionAccess(id: string, ownerKey: string): void {
  const session = getSession(id)
  if (session.ownerKey !== ownerKey) throw new BroadbandOrderError('无权访问该宽带办理会话', 'BROADBAND_SESSION_FORBIDDEN', 403)
}

export function readBroadbandOrderSession(id: string): BroadbandOrderSessionView {
  return sessionView(getSession(id))
}

export function deleteBroadbandOrderSession(id: string): boolean {
  return sessions.delete(id)
}

export async function refreshBroadbandCaptcha(id: string, purpose: 'lookup' | 'sms' | 'commit'): Promise<BroadbandOrderSessionView> {
  const session = getSession(id)
  const result = await broadbandPortalRequest(session.portal, {
    method: 'GET',
    path: '/portal-bff/common/pulic/getRandomImage',
    clearQuery: { type: 'KDXF' },
    binary: true,
  })
  if (!result.ok || !result.bodyBuffer) throw new BroadbandOrderError('图形验证码加载失败', 'BROADBAND_CAPTCHA_FAILED')
  const mime = detectImageMime(result.bodyBuffer)
  if (!mime) {
    throw new BroadbandOrderError('上游验证码格式异常', 'BROADBAND_CAPTCHA_FORMAT')
  }
  session.captchaImage = `data:${mime};base64,${result.bodyBuffer.toString('base64')}`
  session.captchaPurpose = purpose
  session.stage = session.stage === 'created' ? 'captcha_ready' : session.stage
  touch(session)
  return sessionView(session)
}

export async function loadInstallCatalog(id: string, configId: string, overrides?: unknown): Promise<BroadbandOrderSessionView> {
  const session = getSession(id)
  requireFlow(session, 'install')
  const config = await getBroadbandProductConfig(configId)
  if (!config || config.flowType !== 'install') throw new BroadbandOrderError('新装产品配置不存在', 'BROADBAND_CONFIG_NOT_FOUND', 404)
  const effective = { ...config, fields: deepMerge(config.fields, overrides) }
  const allConfigs = await listBroadbandProductConfigs()
  const installConfigs = allConfigs.filter((item) => item.flowType === 'install')
    .map((item) => item.id === effective.id ? effective : item)
    .sort((left, right) => left.id === effective.id ? -1 : right.id === effective.id ? 1 : 0)
  await broadbandPortalRequest(session.portal, {
    method: 'POST',
    path: '/portal-bff/api/avoidLogin/broadband/v1.0/queryBbNewZoneInfo',
    data: {},
  })
  const runtime = await queryInstallProducts(session, installConfigs)
  const projected = allConfigs.filter((item) => item.flowType === 'renewal')
    .map((item) => projectBroadbandConfig(item, 'install'))
  session.products = dedupeProducts([...runtime, ...installConfigs, ...projected])
  session.stage = 'catalog_ready'
  session.selectedProduct = undefined
  touch(session)
  return sessionView(session)
}

export async function queryRenewalAccounts(id: string, billId: string, verificationCode: string): Promise<BroadbandOrderSessionView> {
  const session = getSession(id)
  requireFlow(session, 'renewal')
  if (!billId.trim()) throw new BroadbandOrderError('请输入宽带账号', 'BROADBAND_ACCOUNT_REQUIRED', 400)
  if (!/^[A-Za-z0-9_-]{4,80}$/.test(billId.trim())) throw new BroadbandOrderError('宽带账号格式不正确', 'BROADBAND_ACCOUNT_INVALID', 400)
  if (!/^[A-Za-z0-9]{4}$/.test(verificationCode)) throw new BroadbandOrderError('请输入4位图形验证码', 'BROADBAND_CAPTCHA_INVALID', 400)
  const data = responseData(await broadbandPortalRequest(session.portal, {
    method: 'POST',
    path: `${RENEWAL_BASE}/getBBnumberByMobile`,
    data: { billId: billId.trim(), verificationCode },
  }), '查询宽带账号')
  const message = stringJson(data.message)
  session.accountRecords = array(message).map(record).filter((item): item is Record<string, unknown> => Boolean(item))
  if (!session.accountRecords.length) throw new BroadbandOrderError('没有查询到可续约宽带记录', 'BROADBAND_ACCOUNT_NOT_FOUND', 404)
  session.stage = 'account_ready'
  session.captchaImage = undefined
  touch(session)
  return sessionView(session)
}

export async function selectRenewalAccount(id: string, optionId: string, input?: unknown): Promise<BroadbandOrderSessionView> {
  const session = getSession(id)
  requireFlow(session, 'renewal')
  requireStage(session, ['account_ready', 'catalog_ready', 'verified'], '选择宽带账号')
  const index = session.accountRecords.findIndex((item, itemIndex) => accountOption(item, itemIndex).id === optionId)
  if (index < 0) throw new BroadbandOrderError('宽带账号选项不存在', 'BROADBAND_ACCOUNT_NOT_FOUND', 404)
  const selected = session.accountRecords[index]
  const extras = safeFields(input)
  const billId = text(selected.realBill || selected.bill_id || selected.billId, 100)
  const bbBusiType = text(extras.bbBusiType, 40) || 'AJKD'
  const toData = responseData(await broadbandPortalRequest(session.portal, {
    method: 'POST',
    path: `${RENEWAL_BASE}/toRenewalPage`,
    data: { billId, busiCode: text(extras.busiCode, 80), bbBusiType },
  }), '进入续约页面')
  const mainData = responseData(await broadbandPortalRequest(session.portal, {
    method: 'POST',
    path: `${RENEWAL_BASE}/mainOfRenewal`,
    data: {
      bbBusiType,
      isReslt: text(extras.isReslt, 10) || '1',
      saleId: text(extras.saleId, 80),
      spreaderMobile: text(extras.spreaderMobile, 30),
      agent: text(extras.agent, 80),
    },
  }), '查询可续约产品')
  session.selectedBroadbandRecord = selected
  session.renewalContext = { ...mainData, toRenewalPage: toData }
  const allConfigs = await listBroadbandProductConfigs()
  const configs = allConfigs.filter((item) => item.flowType === 'renewal')
  const runtime = findCandidateRecords(mainData).map((item) => runtimeRenewalProduct(item, 'RUNTIME'))
  const single: BroadbandProductConfig[] = []
  for (const bandwidth of ['200', '300', '500']) {
    try {
      const lookup = responseData(await broadbandPortalRequest(session.portal, {
        method: 'POST',
        path: `${RENEWAL_BASE}/newajaxCXKDKXD`,
        data: { bandwidth, couponCode: '' },
      }), '查询单宽带产品')
      for (const item of array(lookup.data).map(record).filter((entry): entry is Record<string, unknown> => Boolean(entry))) {
        single.push(runtimeRenewalProduct(item, 'DKKD'))
      }
    } catch {
      // Retain the other product groups when one optional bandwidth query fails.
    }
  }
  const installConfigs = allConfigs.filter((item) => item.flowType === 'install')
  const projectedLocal = installConfigs.map((item) => projectBroadbandConfig(item, 'renewal'))
  let projectedRuntime: BroadbandProductConfig[] = []
  try {
    await broadbandPortalRequest(session.portal, {
      method: 'POST',
      path: '/portal-bff/api/avoidLogin/broadband/v1.0/queryBbNewZoneInfo',
      data: {},
    })
    projectedRuntime = (await queryInstallProducts(session, installConfigs))
      .map((item) => projectBroadbandConfig(item, 'renewal'))
  } catch {
    // Installation catalog lookup is optional in a renewal session.
  }
  session.products = dedupeProducts([...runtime, ...single, ...configs, ...projectedRuntime, ...projectedLocal])
  session.selectedProduct = undefined
  session.stage = 'catalog_ready'
  session.captchaImage = undefined
  touch(session)
  return sessionView(session)
}

export async function selectBroadbandProduct(
  id: string,
  configId: string,
  overrides?: unknown,
  replaceFields = false,
): Promise<BroadbandOrderSessionView> {
  const session = getSession(id)
  requireStage(session, ['catalog_ready', 'verified'], '选择产品')
  const product = session.products.find((item) => item.id === configId || item.configKey === configId)
    || await getBroadbandProductConfig(configId)
  if (!product || product.flowType !== session.flowType) throw new BroadbandOrderError('宽带产品配置不存在', 'BROADBAND_CONFIG_NOT_FOUND', 404)
  session.selectedProduct = {
    ...product,
    fields: replaceFields ? safeFields(overrides) : deepMerge(product.fields, overrides),
  }
  session.balanceWarning = undefined
  if (session.flowType === 'renewal' && session.stage !== 'verified') session.stage = 'catalog_ready'
  touch(session)
  return sessionView(session)
}

function renewalPhone(session: Session, override?: string): string {
  if (override && /^1\d{10}$/.test(override)) return override
  const user = record(session.renewalContext?.bbUser)
  const phone = text(user?.payerMobile || user?.userMobile, 30)
  if (!phone) throw new BroadbandOrderError('未取得续约主号码，请在业务字段中补充 phoneNo', 'BROADBAND_PHONE_REQUIRED', 400)
  return phone
}

export async function sendRenewalSms(id: string, verificationCode: string, phoneNo?: string): Promise<BroadbandOrderSessionView> {
  const session = getSession(id)
  requireFlow(session, 'renewal')
  requireStage(session, ['catalog_ready', 'sms_sent', 'verified'], '发送验证码')
  if (!session.selectedProduct) throw new BroadbandOrderError('请先选择续约产品', 'BROADBAND_PRODUCT_REQUIRED', 400)
  if (smsCooldown(session)) throw new BroadbandOrderError(`请${smsCooldown(session)}秒后再发送`, 'BROADBAND_RATE_LIMITED', 429)
  if (!/^[A-Za-z0-9]{4}$/.test(verificationCode)) throw new BroadbandOrderError('请输入4位图形验证码', 'BROADBAND_CAPTCHA_INVALID', 400)
  const target = renewalPhone(session, phoneNo)
  const endpoint = session.selectedProduct.operationMode === 'renewal_single' ? 'sendMsg2NowMainTel_DKXF' : 'sendMsg2NowMainTel'
  const data = responseData(await broadbandPortalRequest(session.portal, {
    method: 'POST',
    path: `${RENEWAL_BASE}/${endpoint}`,
    params: { phoneNo: target, verificationCode },
  }), '发送续约短信验证码')
  if (!(data.success === 1 || data.success === '1' || data.success === true)) {
    throw new BroadbandOrderError(text(data.message) || '短信发送失败', 'BROADBAND_SMS_SEND_FAILED')
  }
  session.smsSentAt = now()
  session.stage = 'sms_sent'
  session.captchaImage = undefined
  touch(session)
  return sessionView(session)
}

export async function verifyRenewalSms(id: string, code: string, phoneNo?: string): Promise<BroadbandOrderSessionView> {
  const session = getSession(id)
  requireFlow(session, 'renewal')
  requireStage(session, ['sms_sent'], '校验短信验证码')
  if (!/^\d{6}$/.test(code)) throw new BroadbandOrderError('请输入6位短信验证码', 'BROADBAND_SMS_INVALID', 400)
  const target = renewalPhone(session, phoneNo)
  const endpoint = session.selectedProduct?.operationMode === 'renewal_single' ? 'checkNowMainSMSCode_DKXF' : 'checkNowMainSMSCode'
  const data = responseData(await broadbandPortalRequest(session.portal, {
    method: 'POST',
    path: `${RENEWAL_BASE}/${endpoint}`,
    params: { phoneNo: target, yzm: code },
  }), '校验续约短信验证码')
  if (!(data.mess === true || data.mess === 'true' || data.success === true || data.success === '1')) {
    throw new BroadbandOrderError('短信验证码错误或已过期', 'BROADBAND_SMS_INVALID', 400)
  }
  session.stage = 'verified'
  touch(session)
  return sessionView(session)
}

export async function prepareBroadbandOrder(id: string, input?: {
  fields?: unknown
  acceptBalance?: boolean
}): Promise<BroadbandOrderSessionView> {
  const session = getSession(id)
  if (!session.selectedProduct) throw new BroadbandOrderError('请先选择宽带产品', 'BROADBAND_PRODUCT_REQUIRED', 400)
  session.selectedProduct = { ...session.selectedProduct, fields: deepMerge(session.selectedProduct.fields, input?.fields) }
  if (session.flowType === 'install') {
    requireStage(session, ['catalog_ready', 'prepared'], '准备新装订单')
    const selection = record(session.selectedProduct.fields.selection) || {}
    const data = responseData(await broadbandPortalRequest(session.portal, {
      method: 'POST',
      path: '/portal-bff/api/avoidLogin/broadband/sjyw/v1.0/commitBroadBandProduct',
      data: selection,
    }), '准备宽带新装')
    session.installPreparedContext = data
    session.stage = 'prepared'
  } else {
    requireStage(session, ['verified', 'prepared'], '准备续约订单')
    const fields = session.selectedProduct.fields
    const businessInfo = record(fields.businessInfo) || {}
    if (session.selectedProduct.operationMode === 'renewal_single') {
      const offerId = text(businessInfo.offerId, 120)
      if (!offerId) throw new BroadbandOrderError('单宽带配置缺少 offerId', 'BROADBAND_FIELDS_INVALID', 400)
      const validation = responseData(await broadbandPortalRequest(session.portal, {
        method: 'POST',
        path: `${RENEWAL_BASE}/validateBeforRenewal`,
        params: { offerId },
      }), '校验单宽带续约')
      if (text(validation.code) && text(validation.code) !== 'success') {
        throw new BroadbandOrderError(text(validation.message) || '单宽带续约校验未通过', 'BROADBAND_NOT_ELIGIBLE', 409)
      }
    } else {
      const eligibility = eligibilityResponse(await broadbandPortalRequest(session.portal, {
        method: 'POST',
        path: `${RENEWAL_BASE}/canAJRenew`,
        data: {
          offerVasFeeAJ: businessInfo.offerVasFee ?? '',
          opType: businessInfo.opType ?? '1',
          paymentType: businessInfo.paymentType ?? '1',
          busiSelect: businessInfo.busiSelect ?? '',
        },
      }))
      const eligibilityValue = eligibility
      if (eligibilityValue.startsWith('BALANCE,')) {
        session.balanceWarning = eligibilityValue
        if (!input?.acceptBalance) {
          touch(session)
          return sessionView(session)
        }
      } else if (eligibilityValue && eligibilityValue !== 'null' && eligibilityValue !== 'success') {
        throw new BroadbandOrderError(eligibilityValue, 'BROADBAND_NOT_ELIGIBLE', 409)
      }
      const prepared = responseData(await broadbandPortalRequest(session.portal, {
        method: 'POST',
        path: `${RENEWAL_BASE}/newbusinessOrderAJ`,
        data: deepMerge(renewalOrderFields(fields), { busiCode: text(session.renewalContext?.busiCode) }),
      }), '创建宽带续约订单上下文')
      session.renewalContext = { ...session.renewalContext, preparedItemType: prepared.itemType }
    }
    session.stage = 'prepared'
  }
  session.captchaImage = undefined
  session.balanceWarning = undefined
  touch(session)
  return sessionView(session)
}

function normalizeInstallResult(data: Record<string, unknown>): BroadbandOrderResult {
  const resType = text(data.resType || data.code) || 'UNKNOWN'
  const success = resType === 'successOld'
  const uncertain = resType === 'showbljg' || !['successOld', 'skerror', 'error'].includes(resType)
  return {
    success,
    uncertain,
    paymentRequired: false,
    code: resType,
    message: text(data.message || data.errmesg, 500) || (success ? '宽带新装申请已受理' : uncertain ? '宽带新装结果待确认' : '宽带新装未成功'),
    completedAt: new Date().toISOString(),
    details: resultDetails(data),
  }
}

function normalizeRenewalResult(data: Record<string, unknown>, mode: BroadbandOperationMode): BroadbandOrderResult {
  const code = text(data.resType || data.code) || 'UNKNOWN'
  const success = ['success', 'SUCCESS', 'successShowSpeedup'].includes(code)
    || (mode === 'renewal_single' && text(data.code) === 'success' && text(data.resType) === 'SUCCESS')
  const payment = code === 'REDIRECT_URL' || text(data.resType) === 'REDIRECT_URL'
  const redirect = paymentUrl(data.redirectPage || record(data.data)?.redirectUrl)
  const explicitFailure = ['input', 'index', 'login'].includes(code) || text(data.code) === 'input'
  return {
    success,
    uncertain: payment || (!success && !explicitFailure),
    paymentRequired: payment,
    code,
    message: text(data.errmesg || data.message, 500) || (success ? '宽带续约申请已受理' : payment ? '订单已创建，请继续完成支付' : explicitFailure ? '宽带续约未成功' : '宽带续约结果待确认'),
    paymentUrl: redirect,
    completedAt: new Date().toISOString(),
    details: resultDetails(data),
  }
}

export async function commitBroadbandOrder(id: string, input: {
  captcha: string
  fields?: unknown
  acceptedProtocol: boolean
  confirmationText: string
}): Promise<BroadbandOrderSessionView> {
  const session = getSession(id)
  requireStage(session, ['prepared'], '提交订单')
  if (!session.selectedProduct) throw new BroadbandOrderError('宽带产品配置已丢失', 'BROADBAND_PRODUCT_REQUIRED', 400)
  const expectedConfirmation = session.flowType === 'install' ? '确认订购' : '确认续约'
  if (!input.acceptedProtocol || input.confirmationText !== expectedConfirmation) {
    throw new BroadbandOrderError('请核对业务信息并完成提交确认', 'BROADBAND_CONFIRMATION_REQUIRED', 400)
  }
  if (!/^[A-Za-z0-9]{4}$/.test(input.captcha)) throw new BroadbandOrderError('请输入4位图形验证码', 'BROADBAND_CAPTCHA_INVALID', 400)
  if (session.orderInFlight) throw new BroadbandOrderError('订单正在提交，请勿重复操作', 'BROADBAND_ORDER_IN_FLIGHT', 409)
  session.orderInFlight = true
  touch(session)
  try {
    let result: BroadbandOrderResult
    if (session.flowType === 'install') {
      const fields = deepMerge(session.selectedProduct.fields, input.fields)
      const selection = record(fields.selection) || {}
      const payload = deepMerge(selection, installPreparedFields(session.installPreparedContext), installCommitFields(fields), {
        verificationCode: input.captcha,
        onlineMobile: session.phone,
      })
      const data = responseData(await broadbandPortalRequest(session.portal, {
        method: 'POST',
        path: '/portal-bff/api/avoidLogin/broadband/sjyw/v1.0/commitDoBroadBand',
        data: payload,
      }), '提交宽带新装')
      result = normalizeInstallResult(data)
      if (result.code === 'showbljg') {
        try {
          const queried = responseData(await broadbandPortalRequest(session.portal, {
            method: 'POST', path: '/portal-bff/api/pcConsole/v1.0/showBLJG', data: {},
          }), '查询宽带新装结果')
          result = { ...normalizeInstallResult(queried), details: resultDetails(queried) }
        } catch {
          // Preserve UNKNOWN rather than retrying the order.
        }
      }
    } else {
      const fields = deepMerge(session.selectedProduct.fields, input.fields)
      const businessInfo = record(fields.businessInfo) || {}
      const mode = session.selectedProduct.operationMode
      const payload = mode === 'renewal_single'
        ? {
            businessInfo,
            payFeeVO: { imgCode: input.captcha, payNum: businessInfo.offerVasFee ?? businessInfo.payFee ?? '' },
          }
        : {
            bbBusiType: fields.bbBusiType ?? '',
            businessInfoVO: businessInfo,
            payFeeVO: { imgCode: input.captcha },
          }
      const data = responseData(await broadbandPortalRequest(session.portal, {
        method: 'POST',
        path: `${RENEWAL_BASE}/${mode === 'renewal_single' ? 'newbusinessPayFeeCommit' : 'businessPayFeeCommitAJ'}`,
        data: payload as BroadbandJsonObject,
      }), '提交宽带续约')
      result = normalizeRenewalResult(data, mode)
    }
    session.lastResult = result
    session.stage = 'finished'
    session.captchaImage = undefined
    touch(session)
    return sessionView(session)
  } catch (error) {
    if (error instanceof BroadbandOrderError && error.code === 'BROADBAND_CAPTCHA_INVALID') throw error
    session.lastResult = {
      success: false,
      uncertain: true,
      paymentRequired: false,
      code: 'UNKNOWN',
      message: error instanceof Error ? error.message : '上游提交结果未知，请勿重复提交',
      completedAt: new Date().toISOString(),
      details: resultDetails({ code: 'UNKNOWN', message: error instanceof Error ? error.message : '上游提交结果未知，请勿重复提交' }),
    }
    session.stage = 'finished'
    touch(session)
    return sessionView(session)
  } finally {
    session.orderInFlight = false
  }
}

export const __test__ = {
  detectImageMime,
  deepMerge,
  dedupeProducts,
  maskAccount,
  normalizeInstallResult,
  normalizeRenewalResult,
  runtimeRenewalProduct,
  safeFields,
  eligibilityResponse,
  installCommitFields,
  installPreparedFields,
  renewalOrderFields,
}

import { createHash } from 'node:crypto'
import { decryptBusinessResponseBody, encryptBusinessRequest } from './cmccBusinessCrypto.js'
import { httpsRequestText } from './cmccHttp.js'
import { prepareQqtApiSession, type QqtPreparedSession } from './qqtSign.js'
import { assertQqtActivitySuccess, readQqtSignDays, verifyQqtActivityState } from './qqtActivityState.js'
import { blindBoxCampaign, blindBoxFulfillmentUrl, mergeBlindBoxTasks, readBlindBoxDraw, type BlindBoxTask } from './qqtBlindBox.js'

const QQT_BASE = 'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy'
const QQT_REFERER = `${QQT_BASE}/res/wap/xdrNormal.html`
const GSM_BASE = 'https://10086.online-cmcc.cn:20010/cmcc-gateway/outside/gsm'
const GSM_STATIC_TOKEN = 'YnBBRmFrMkxFOGR3OFJpOXNhRnlvQT09'
const QQT_GSM_SSO_PATH = '/getCmpSSOTokenNew.action'
const SESSION_CACHE_TTL_MS = 5 * 60_000
const OVERVIEW_CACHE_TTL_MS = 60_000
const OVERVIEW_STALE_TTL_MS = 10 * 60_000
const PERSISTED_OVERVIEW_TTL_MS = 24 * 60 * 60_000
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'

type JsonRecord = Record<string, unknown>

export type GlobalTelecomDay = {
  dayNum: number
  signStatus: number
  reSign: boolean
  tasks: Array<{ taskId: number; taskStatus: number }>
  prize?: {
    prizeId: string
    prizeName: string
    kind?: number
    prizeStatus?: number
    isVirtual?: boolean
  }
}

export type GlobalTelecomOverview = {
  refreshedAt: string
  accessToken?: string
  cache: {
    status: 'live' | 'fresh-cache' | 'stale-cache' | 'persistent-cache'
    expiresAt: string
    retryAfterSeconds: number
  }
  identity: {
    levelCode?: string
    levelName?: string
    phoneMasked?: string
    province?: string
    netAge?: string
    joinedAt?: string
    gsmState?: string
  }
  xdr: {
    availableCount: number
    freeCount: number
    paidCount: number
    claimedProductIds: number[]
  }
  sign: {
    reSignRemaining: number
    days: GlobalTelecomDay[]
  }
  blindBox: {
    drawTotal: number
    drawUsed: number
    drawRemaining: number
    tasks: BlindBoxTask[]
    campaignMonth?: string
    drawLimit?: number
    drawAllowed?: boolean
    unavailableReason?: string
    prizes: Array<{ prizeCode: string; imageUrl?: string }>
  }
  manager?: {
    name?: string
    nickname?: string
    serviceNumber?: string
    teamName?: string
    groupName?: string
    cityName?: string
    staffLevel?: string
    staffId?: string
    available: boolean
  }
  growth?: {
    year?: string
    month?: string
    currentLevel?: string
    nextLevel?: string
    annualGrowthValue?: number
    nextLevelGrowthValue?: number
    remainingGrowthValue?: number
    growthValueEnabled?: boolean
    shieldingPeriod?: boolean
    levels: Array<{ name: string; value?: number; label: string }>
    monthlyGrowthValues: Array<{ month: string; value: number; rawValue: string }>
  }
  errors: Partial<Record<'identity' | 'xdr' | 'sign' | 'blindBox' | 'manager' | 'growth' | 'system', string>>
}

export type GlobalTelecomActionResult = {
  accessToken: string
  payload: unknown
  message: string
  blindBoxPrize?: { prizeCode: string; prizeName?: string; fulfillmentUrl?: string }
}

type PreparedGlobalTelecomSession = Required<Pick<QqtPreparedSession, 'accessToken' | 'sessionCookie'>> & {
  ssoToken?: string
}

type OverviewCacheEntry = {
  overview: GlobalTelecomOverview
  expiresAt: number
  staleUntil: number
}

const preparedSessionCache = new Map<string, { session: PreparedGlobalTelecomSession; expiresAt: number }>()
const preparedSessionInflight = new Map<string, Promise<PreparedGlobalTelecomSession>>()
const overviewCache = new Map<string, OverviewCacheEntry>()
const overviewInflight = new Map<string, Promise<GlobalTelecomOverview>>()

function record(value: unknown): JsonRecord | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as JsonRecord
    : undefined
}

function parseJson(text: string): unknown {
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch {
    throw new Error('上游返回了无法解析的数据')
  }
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as unknown
    } catch {
      return value
    }
  }
  return value
}

function text(source: JsonRecord | undefined, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = source?.[key]
    if (value === undefined || value === null) continue
    const normalized = String(value).trim()
    if (normalized) return normalized
  }
  return undefined
}

function numeric(value: unknown, fallback = 0): number {
  if (value === null || value === undefined || value === '') return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function list(value: unknown): unknown[] {
  if (Array.isArray(value)) return value
  if (value && typeof value === 'object') return [value]
  return []
}

function optionalNumeric(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined
}

function upstreamMessage(payload: unknown): string {
  const root = record(payload)
  const data = record(root?.data)
  return text(root, ['msg', 'message', 'rtnMsg', 'retDesc']) ||
    text(data, ['msg', 'message']) || '上游请求失败'
}

function assertQqtSuccess(payload: unknown): void {
  const root = record(payload)
  const status = root?.status ?? root?.code
  const message = upstreamMessage(payload)
  if (isPreparedSessionAuthError(message)) throw new Error(message)
  if (status !== undefined && !['1', '0', '200'].includes(String(status))) {
    throw new Error(message)
  }
}

function isPreparedSessionAuthError(message: string): boolean {
  return /(?:未登录|请先登录|登录(?:已)?失效|重新登录|认证(?:失败|失效)|授权(?:失败|失效)|非法|access[_ -]?token.*(?:失效|无效|invalid)|(?:会话|token).*(?:失效|过期|无效)|HTTP (?:401|403))/i.test(message)
}

function qqtHeaders(sessionCookie: string, sspid: string, json = false): Record<string, string> {
  const query = new URLSearchParams({ sspId: sspid })
  return {
    Cookie: sessionCookie,
    Accept: 'application/json, text/javascript, */*; q=0.01',
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    'X-Requested-With': 'XMLHttpRequest',
    Origin: 'https://qqt.cmicrwx.cn',
    Referer: `${QQT_REFERER}?${query.toString()}`,
    'User-Agent': USER_AGENT,
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  }
}

async function qqtGet(sessionCookie: string, path: string, sspid: string, query?: Record<string, string>): Promise<unknown> {
  const url = new URL(`${QQT_BASE}${path}`)
  for (const [key, value] of Object.entries(query ?? {})) url.searchParams.set(key, value)
  const response = await httpsRequestText({
    url: url.toString(),
    method: 'GET',
    headers: qqtHeaders(sessionCookie, sspid),
    timeoutMs: 12000,
  })
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`全球通上游 HTTP ${response.statusCode}`)
  }
  const payload = parseJson(response.bodyText)
  if (path.startsWith('/sign/') || path.startsWith('/luckBox/')) assertQqtActivitySuccess(payload)
  assertQqtSuccess(payload)
  return payload
}

async function qqtPostJson(sessionCookie: string, path: string, sspid: string, body: JsonRecord): Promise<unknown> {
  const response = await httpsRequestText({
    url: `${QQT_BASE}${path}`,
    method: 'POST',
    headers: qqtHeaders(sessionCookie, sspid, true),
    body: JSON.stringify(body),
    timeoutMs: 12000,
  })
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`全球通上游 HTTP ${response.statusCode}`)
  }
  const payload = parseJson(response.bodyText)
  if (path.startsWith('/sign/') || path.startsWith('/luckBox/')) assertQqtActivitySuccess(payload)
  assertQqtSuccess(payload)
  return payload
}

async function queryVipLevel(sessionCookie: string, sspid: string): Promise<unknown> {
  const body = new URLSearchParams({ sspId: sspid, tag: 'qqtindex' }).toString()
  const response = await httpsRequestText({
    url: `${QQT_BASE}/member/func/queryVipLevel.do`,
    method: 'POST',
    headers: {
      ...qqtHeaders(sessionCookie, sspid),
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body,
    timeoutMs: 12000,
  })
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`全球通会员信息上游 HTTP ${response.statusCode}`)
  }
  const payload = parseJson(response.bodyText)
  assertQqtSuccess(payload)
  return payload
}

async function gsmPost(path: string, body: JsonRecord, sessionId?: string): Promise<JsonRecord> {
  const response = await httpsRequestText({
    url: `${GSM_BASE}${path}`,
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Lrsbhbg8: GSM_STATIC_TOKEN,
      ...(sessionId ? { 'X-GSM-TOKEN': sessionId } : {}),
      'User-Agent': USER_AGENT,
    },
    body: encryptBusinessRequest(body),
    timeoutMs: 8000,
    allowUnsafeLegacyRenegotiation: true,
  })
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`GSM 网关 HTTP ${response.statusCode}`)
  }
  const outer = record(parseJson(response.bodyText))
  if (!outer || String(outer.rtnCode) !== '0' || typeof outer.encryptData !== 'string') {
    throw new Error(text(outer, ['rtnMsg', 'message']) || 'GSM 网关响应异常')
  }
  let decrypted: unknown
  try {
    decrypted = parseJson(decryptBusinessResponseBody(outer.encryptData))
  } catch {
    throw new Error('GSM 网关响应解密失败')
  }
  const result = record(decrypted)
  if (!result) throw new Error('GSM 网关业务数据为空')
  return result
}

async function queryGrowth(ssoToken: string): Promise<{ state: JsonRecord; detail: JsonRecord }> {
  const login = await gsmPost('/login', { token: ssoToken })
  const loginData = record(login.data)
  const sessionId = text(loginData, ['sessionId'])
  if (!sessionId || String(record(login.restStatus)?.status ?? login.status ?? '') !== '0') {
    throw new Error(text(record(login.restStatus), ['message']) || text(login, ['message']) || 'GSM 登录失败')
  }
  const state = await gsmPost('/iservice/direct/serviceUnified/getGsmState', {}, sessionId)
  if (String(state.retCode ?? '') !== '000000') throw new Error(upstreamMessage(state))
  const stateBody = record(state.rspBody) ?? {}
  const detail = await gsmPost(
    '/iservice/direct/gsmInfo/queryGsmInfo',
    { gsmState: text(stateBody, ['gsmState']) || '', appFlag: '0' },
    sessionId,
  )
  if (String(detail.retCode ?? '') !== '000000') throw new Error(upstreamMessage(detail))
  return { state: stateBody, detail: record(detail.rspBody) ?? {} }
}

function normalizeSign(payload: unknown): GlobalTelecomOverview['sign'] {
  const data = record(record(payload)?.data)
  const signDays = readQqtSignDays(payload)
  const remaining = optionalNumeric(data?.reSignNum)
  if (remaining === undefined || !Number.isInteger(remaining) || remaining < 0) {
    throw new Error('补签剩余次数缺失或异常，无法判断是否可补签')
  }
  const days = signDays.map((raw) => {
    const item = record(raw) ?? {}
    const prize = record(item.newPrize) ?? record(list(item.prize)[0])
    return {
      dayNum: numeric(item.dayNum),
      signStatus: numeric(item.signStatus, -1),
      reSign: item.reSign === true || item.reSign === 1 || item.reSign === '1' || item.reSign === 'true',
      tasks: (Array.isArray(item.task) ? item.task : record(item.task) ? [item.task] : []).map((rawTask) => {
        const task = record(rawTask) ?? {}
        const taskId = optionalNumeric(task.taskId)
        const taskStatus = optionalNumeric(task.taskStatus)
        if (!taskId || !Number.isInteger(taskId) || taskId < 1 || (taskStatus !== 0 && taskStatus !== 1)) {
          throw new Error('补签任务数据异常，无法判断任务进度')
        }
        return { taskId, taskStatus }
      }),
      ...(prize ? {
        prize: {
          prizeId: text(prize, ['prizeId']) || '',
          prizeName: text(prize, ['prizeName']) || '未命名奖品',
          kind: prize.kind === undefined ? undefined : numeric(prize.kind),
          prizeStatus: prize.prizeStatus === undefined ? undefined : numeric(prize.prizeStatus),
          isVirtual: Boolean(prize.isVirtual),
        },
      } : {}),
    }
  }).filter((day) => day.dayNum > 0)
  return { reSignRemaining: remaining, days }
}

function normalizeXdr(payload: unknown): GlobalTelecomOverview['xdr'] {
  const data = record(record(payload)?.data)
  return {
    availableCount: Math.max(0, numeric(data?.enjoycollectabletimes)),
    freeCount: Math.max(0, numeric(data?.freeEnjoy)),
    paidCount: Math.max(0, numeric(data?.enjoy)),
    claimedProductIds: list(data?.prodList).map((item) => numeric(item)).filter((item) => item > 0),
  }
}

function normalizeBlindBoxPrizes(payload: unknown): GlobalTelecomOverview['blindBox']['prizes'] {
  return list(record(payload)?.data).map((raw) => {
    const prize = record(raw) ?? {}
    return { prizeCode: text(prize, ['prizeCode']) || '', imageUrl: text(prize, ['prizeImage']) }
  }).filter((prize) => Boolean(prize.prizeCode))
}

function normalizeBlindBox(statusPayload: unknown, prizePayload: unknown, now = new Date()): GlobalTelecomOverview['blindBox'] {
  assertQqtActivitySuccess(statusPayload)
  const data = record(record(statusPayload)?.data)
  if (!Array.isArray(data?.tasks)) throw new Error('盲盒任务数据缺失，无法判断是否完成')
  for (const key of ['drawTotal', 'drawUsed', 'drawRemain']) {
    if (data[key] == null || data[key] === '' || !Number.isInteger(Number(data[key])) || (key !== 'drawRemain' && Number(data[key]) < 0)) {
      throw new Error('盲盒抽奖次数数据异常，无法判断可用机会')
    }
  }
  const campaign = blindBoxCampaign(now)
  const drawAllowed = campaign.known && Number(data.drawRemain) > 0 && Number(data.drawUsed) < campaign.drawLimit
  return {
    drawTotal: Math.max(0, numeric(data?.drawTotal)),
    drawUsed: Math.max(0, numeric(data?.drawUsed ?? data?.drawNumber)),
    drawRemaining: Math.max(0, numeric(data?.drawRemain)),
    campaignMonth: campaign.month,
    drawLimit: campaign.drawLimit,
    drawAllowed,
    unavailableReason: !campaign.known ? '本期活动任务清单需更新' : Number(data.drawUsed) >= campaign.drawLimit
      ? '已达到本阶段抽奖次数上限' : Number(data.drawRemain) <= 0 ? '暂无抽奖机会' : undefined,
    tasks: mergeBlindBoxTasks(data.tasks, now),
    prizes: normalizeBlindBoxPrizes(prizePayload),
  }
}

function normalizeManager(payload: unknown): NonNullable<GlobalTelecomOverview['manager']> {
  const data = record(record(payload)?.data)
  const manager = record(data?.object)
  const staffId = text(manager, ['staffId'])
  return {
    name: text(manager, ['staffName']),
    nickname: text(manager, ['nickNm']),
    serviceNumber: text(manager, ['serviceNum']),
    teamName: text(manager, ['teamName']),
    groupName: text(manager, ['dutyGroupName']),
    cityName: text(manager, ['homeCityName']),
    staffLevel: text(manager, ['staffLevel']),
    staffId,
    available: Boolean(staffId && text(manager, ['staffSex'])),
  }
}

function normalizeGrowth(state: JsonRecord, detail: JsonRecord): NonNullable<GlobalTelecomOverview['growth']> {
  const stateCode = text(detail, ['gsmState']) || text(state, ['gsmState'])
  const levels = list(detail.gsmList).map((raw) => {
    const level = record(raw) ?? {}
    const rawValue = text(level, ['value']) || ''
    const value = Number(rawValue)
    return {
      name: text(level, ['name']) || '未命名等级',
      value: Number.isFinite(value) ? value : undefined,
      label: rawValue || '--',
    }
  })
  const levelNames: Record<string, string> = {
    '0': '普卡',
    '1': '银卡',
    '2': '金卡',
    '3': '白金卡',
    '4': '钻石卡',
    '5': '钻石卡',
    '8': '卓越钻石卡',
  }
  return {
    year: text(detail, ['year']),
    month: text(detail, ['month']),
    currentLevel: stateCode ? levelNames[stateCode] || stateCode : undefined,
    nextLevel: text(detail, ['gsmNext']),
    annualGrowthValue: detail.consumptionTotal === undefined ? undefined : numeric(detail.consumptionTotal),
    nextLevelGrowthValue: detail.consumptionRequired === undefined ? undefined : numeric(detail.consumptionRequired),
    remainingGrowthValue: detail.consumptionRe === undefined ? undefined : numeric(detail.consumptionRe),
    growthValueEnabled: String(detail.growthValueSwitch ?? '') === '1',
    shieldingPeriod: String(detail.isShieldingPeriod ?? '') === '1',
    levels,
    monthlyGrowthValues: list(detail.transactionDetails).map((raw) => {
      const row = record(raw) ?? {}
      const rawBill = text(row, ['bill']) || '0'
      return { month: text(row, ['month']) || '', value: numeric(rawBill), rawValue: rawBill }
    }).filter((row) => Boolean(row.month)),
  }
}

const OVERVIEW_ERROR_KEYS = ['identity', 'xdr', 'sign', 'blindBox', 'manager', 'growth', 'system'] as const

function sanitizeOverviewDisplay(value: unknown): GlobalTelecomOverview | undefined {
  const root = record(value)
  const identityRaw = record(root?.identity)
  const xdrRaw = record(root?.xdr)
  const signRaw = record(root?.sign)
  const blindBoxRaw = record(root?.blindBox)
  const refreshedAt = text(root, ['refreshedAt'])
  if (!root || !identityRaw || !xdrRaw || !signRaw || !blindBoxRaw || !refreshedAt || !Number.isFinite(Date.parse(refreshedAt))) {
    return undefined
  }

  const managerRaw = record(root.manager)
  const growthRaw = record(root.growth)
  const errorsRaw = record(root.errors)
  const errors: GlobalTelecomOverview['errors'] = {}
  for (const key of OVERVIEW_ERROR_KEYS) {
    const message = text(errorsRaw, [key])
    if (message) errors[key] = message
  }

  const days: GlobalTelecomDay[] = list(signRaw.days).map((rawDay) => {
    const day = record(rawDay) ?? {}
    const prize = record(day.prize)
    return {
      dayNum: numeric(day.dayNum),
      signStatus: numeric(day.signStatus, -1),
      reSign: day.reSign === true,
      tasks: list(day.tasks).map((rawTask) => {
        const task = record(rawTask) ?? {}
        return { taskId: numeric(task.taskId), taskStatus: numeric(task.taskStatus) }
      }).filter((task) => task.taskId > 0),
      ...(prize ? {
        prize: {
          prizeId: text(prize, ['prizeId']) || '',
          prizeName: text(prize, ['prizeName']) || '未命名奖品',
          kind: optionalNumeric(prize.kind),
          prizeStatus: optionalNumeric(prize.prizeStatus),
          isVirtual: prize.isVirtual === true,
        },
      } : {}),
    }
  }).filter((day) => day.dayNum > 0)

  const overview: GlobalTelecomOverview = {
    refreshedAt,
    cache: {
      status: 'persistent-cache',
      expiresAt: new Date(Date.now() + OVERVIEW_CACHE_TTL_MS).toISOString(),
      retryAfterSeconds: Math.ceil(OVERVIEW_CACHE_TTL_MS / 1000),
    },
    identity: {
      levelCode: text(identityRaw, ['levelCode']),
      levelName: text(identityRaw, ['levelName']),
      phoneMasked: text(identityRaw, ['phoneMasked']),
      province: text(identityRaw, ['province']),
      netAge: text(identityRaw, ['netAge']),
      joinedAt: text(identityRaw, ['joinedAt']),
      gsmState: text(identityRaw, ['gsmState']),
    },
    xdr: {
      availableCount: Math.max(0, numeric(xdrRaw.availableCount)),
      freeCount: Math.max(0, numeric(xdrRaw.freeCount)),
      paidCount: Math.max(0, numeric(xdrRaw.paidCount)),
      claimedProductIds: list(xdrRaw.claimedProductIds).map((item) => numeric(item)).filter((item) => item > 0),
    },
    sign: {
      reSignRemaining: Math.max(0, numeric(signRaw.reSignRemaining)),
      days,
    },
    blindBox: {
      drawTotal: Math.max(0, numeric(blindBoxRaw.drawTotal)),
      drawUsed: Math.max(0, numeric(blindBoxRaw.drawUsed)),
      drawRemaining: Math.max(0, numeric(blindBoxRaw.drawRemaining)),
      campaignMonth: text(blindBoxRaw, ['campaignMonth']),
      drawLimit: optionalNumeric(blindBoxRaw.drawLimit),
      drawAllowed: blindBoxRaw.drawAllowed === true,
      unavailableReason: text(blindBoxRaw, ['unavailableReason']),
      tasks: list(blindBoxRaw.tasks).map((rawTask) => {
        const task = record(rawTask) ?? {}
        return {
          number: numeric(task.number),
          completed: task.completed === true,
          name: text(task, ['name']),
          available: task.available === true,
          unavailableReason: text(task, ['unavailableReason']),
          opensAt: text(task, ['opensAt']),
          url: text(task, ['url']),
          completedAt: optionalNumeric(task.completedAt),
        }
      }).filter((task) => task.number > 0),
      prizes: list(blindBoxRaw.prizes).map((rawPrize) => {
        const prize = record(rawPrize) ?? {}
        return { prizeCode: text(prize, ['prizeCode']) || '', imageUrl: text(prize, ['imageUrl']) }
      }).filter((prize) => Boolean(prize.prizeCode)),
    },
    errors,
  }

  if (managerRaw) {
    overview.manager = {
      name: text(managerRaw, ['name']),
      nickname: text(managerRaw, ['nickname']),
      serviceNumber: text(managerRaw, ['serviceNumber']),
      teamName: text(managerRaw, ['teamName']),
      groupName: text(managerRaw, ['groupName']),
      cityName: text(managerRaw, ['cityName']),
      staffLevel: text(managerRaw, ['staffLevel']),
      staffId: text(managerRaw, ['staffId']),
      available: managerRaw.available === true,
    }
  }
  if (growthRaw) {
    overview.growth = {
      year: text(growthRaw, ['year']),
      month: text(growthRaw, ['month']),
      currentLevel: text(growthRaw, ['currentLevel']),
      nextLevel: text(growthRaw, ['nextLevel']),
      annualGrowthValue: optionalNumeric(growthRaw.annualGrowthValue),
      nextLevelGrowthValue: optionalNumeric(growthRaw.nextLevelGrowthValue),
      remainingGrowthValue: optionalNumeric(growthRaw.remainingGrowthValue),
      growthValueEnabled: optionalBoolean(growthRaw.growthValueEnabled),
      shieldingPeriod: optionalBoolean(growthRaw.shieldingPeriod),
      levels: list(growthRaw.levels).map((rawLevel) => {
        const level = record(rawLevel) ?? {}
        return {
          name: text(level, ['name']) || '未命名等级',
          value: optionalNumeric(level.value),
          label: text(level, ['label']) || '--',
        }
      }),
      monthlyGrowthValues: list(growthRaw.monthlyGrowthValues).map((rawRow) => {
        const row = record(rawRow) ?? {}
        return {
          month: text(row, ['month']) || '',
          value: numeric(row.value),
          rawValue: text(row, ['rawValue']) || String(numeric(row.value)),
        }
      }).filter((row) => Boolean(row.month)),
    }
  }
  return overview
}

export function createGlobalTelecomOverviewSnapshot(overview: GlobalTelecomOverview): JsonRecord {
  const sanitized = sanitizeOverviewDisplay(overview)
  if (!sanitized) throw new Error('全球通快照数据不完整')
  const display: JsonRecord = { ...sanitized }
  delete display.cache
  delete display.accessToken
  return { version: 1, overview: display }
}

export function readGlobalTelecomOverviewSnapshot(
  qqtInfo: unknown,
  options: { now?: number; maxAgeMs?: number; systemError?: string } = {},
): GlobalTelecomOverview | undefined {
  const info = record(qqtInfo)
  const snapshot = record(info?.globalTelecomOverview)
  const rawOverview = record(snapshot?.overview) ?? snapshot
  const overview = sanitizeOverviewDisplay(rawOverview)
  if (!overview) return undefined
  const now = options.now ?? Date.now()
  const maxAgeMs = options.maxAgeMs ?? PERSISTED_OVERVIEW_TTL_MS
  if (now - Date.parse(overview.refreshedAt) > maxAgeMs) return undefined
  return withCacheStatus(
    overview,
    'persistent-cache',
    now + OVERVIEW_CACHE_TTL_MS,
    options.systemError,
  )
}

export function mergeGlobalTelecomOverview(
  previous: GlobalTelecomOverview | undefined,
  current: GlobalTelecomOverview,
): GlobalTelecomOverview {
  if (!previous) return current
  const fallbackError = (key: keyof GlobalTelecomOverview['errors']): string | undefined => {
    const message = current.errors[key]
    return message ? `实时查询失败，当前展示最近成功数据：${message}` : undefined
  }
  return {
    ...current,
    identity: {
      ...previous.identity,
      ...Object.fromEntries(Object.entries(current.identity).filter(([, value]) => value !== undefined && value !== '')),
    },
    xdr: current.errors.xdr ? previous.xdr : current.xdr,
    sign: current.errors.sign ? previous.sign : current.sign,
    blindBox: current.errors.blindBox ? previous.blindBox : current.blindBox,
    manager: current.errors.manager ? previous.manager : current.manager,
    growth: current.errors.growth || !current.growth ? previous.growth : current.growth,
    errors: {
      ...current.errors,
      identity: fallbackError('identity') ?? current.errors.identity,
      xdr: fallbackError('xdr') ?? current.errors.xdr,
      sign: fallbackError('sign') ?? current.errors.sign,
      blindBox: fallbackError('blindBox') ?? current.errors.blindBox,
      manager: fallbackError('manager') ?? current.errors.manager,
      growth: fallbackError('growth') ?? current.errors.growth,
    },
  }
}

function credentialCacheKey(args: { cmccCookie: string; accessToken?: string; sspid?: string }): string {
  return createHash('sha256')
    .update(JSON.stringify([args.cmccCookie, args.accessToken || '', args.sspid || '']))
    .digest('hex')
}

async function fetchGsmSsoToken(sessionCookie: string, sspid: string): Promise<string> {
  const response = await httpsRequestText({
    url: `${QQT_BASE}${QQT_GSM_SSO_PATH}`,
    method: 'POST',
    headers: {
      ...qqtHeaders(sessionCookie, sspid),
      Accept: '*/*',
      Referer: `${QQT_BASE}/res/wap/growUpLv.html?${new URLSearchParams({ sspId: sspid }).toString()}`,
    },
    body: '',
    timeoutMs: 12000,
  })
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`成长值 Token 上游 HTTP ${response.statusCode}`)
  }
  const payload = parseJson(response.bodyText)
  assertQqtSuccess(payload)
  const token = text(record(payload), ['data'])
  if (!token) throw new Error('成长值 Token 为空')
  return token
}

async function warmGrowthContext(sessionCookie: string, sspid: string): Promise<void> {
  const response = await httpsRequestText({
    url: `${QQT_BASE}/customer/growthValue`,
    method: 'GET',
    headers: {
      ...qqtHeaders(sessionCookie, sspid),
      Referer: `${QQT_BASE}/res/wap/growUpLv.html?${new URLSearchParams({ sspId: sspid }).toString()}`,
    },
    timeoutMs: 12000,
  })
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`成长值上下文预热 HTTP ${response.statusCode}`)
  }
}

function shouldRetryGrowth(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error || '')
  return /无用户信息|用户信息为空|未查询到用户|用户不存在/.test(message)
}

async function queryFreshGrowth(sessionCookie: string, sspid: string): Promise<{ state: JsonRecord; detail: JsonRecord }> {
  const execute = async () => queryGrowth(await fetchGsmSsoToken(sessionCookie, sspid))
  try {
    await warmGrowthContext(sessionCookie, sspid)
  } catch {
    // The warm-up endpoint is advisory; a fresh one-time GSM token can still succeed.
  }
  try {
    return await execute()
  } catch (error) {
    if (!shouldRetryGrowth(error)) throw error
    await queryVipLevel(sessionCookie, sspid)
    await warmGrowthContext(sessionCookie, sspid)
    return execute()
  }
}

async function prepareUncached(args: {
  cmccCookie: string
  requestHeaders?: Record<string, string>
  accessToken?: string
  sspid: string
}): Promise<PreparedGlobalTelecomSession> {
  let session = await prepareQqtApiSession(args)
  if ((!session.ok || !session.accessToken || !session.sessionCookie) && args.accessToken && args.cmccCookie) {
    session = await prepareQqtApiSession({
      cmccCookie: args.cmccCookie,
      requestHeaders: args.requestHeaders,
    })
  }
  if (!session.ok || !session.accessToken || !session.sessionCookie) {
    throw new Error(session.message || '全球通会话建立失败')
  }
  return { accessToken: session.accessToken, sessionCookie: session.sessionCookie, ssoToken: session.ssoToken }
}

function shouldRetryPreparedSession(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error || '')
  return isPreparedSessionAuthError(message)
}

async function prepare(args: {
  cmccCookie: string
  requestHeaders?: Record<string, string>
  accessToken?: string
  sspid: string
}): Promise<PreparedGlobalTelecomSession> {
  const key = credentialCacheKey(args)
  const cached = preparedSessionCache.get(key)
  if (cached && cached.expiresAt > Date.now()) return cached.session
  const existing = preparedSessionInflight.get(key)
  if (existing) return existing
  const promise = prepareUncached(args)
    .then((session) => {
      preparedSessionCache.set(key, { session, expiresAt: Date.now() + SESSION_CACHE_TTL_MS })
      return session
    })
    .finally(() => {
      if (preparedSessionInflight.get(key) === promise) preparedSessionInflight.delete(key)
    })
  preparedSessionInflight.set(key, promise)
  return promise
}

async function queryGlobalTelecomOverviewLive(args: {
  cmccCookie: string
  requestHeaders?: Record<string, string>
  accessToken?: string
  sspid: string
  cachedProfile?: JsonRecord
}): Promise<GlobalTelecomOverview> {
  const session = await prepare(args)
  const errors: GlobalTelecomOverview['errors'] = {}
  const capture = async <T>(key: keyof GlobalTelecomOverview['errors'], action: () => Promise<T>): Promise<T | undefined> => {
    try {
      return await action()
    } catch (error) {
      errors[key] ||= error instanceof Error ? error.message : '查询失败'
      return undefined
    }
  }

  // Validate the cached access token before starting the dashboard requests.
  // Authentication failures are allowed to escape so the recovery path can
  // exchange a new token from the CMCC cookie; other module failures remain partial.
  let identityRaw: unknown
  try {
    identityRaw = await queryVipLevel(session.sessionCookie, args.sspid)
  } catch (error) {
    if (shouldRetryPreparedSession(error)) throw error
    errors.identity = error instanceof Error ? error.message : '查询失败'
  }
  const [xdrRaw, signRaw, blindStatusRaw, blindPrizesRaw, managerRaw, growthRaw] = await Promise.all([
    capture('xdr', () => qqtGet(session.sessionCookie, '/member/func/queryIndexReceive.do', args.sspid)),
    capture('sign', () => qqtGet(session.sessionCookie, '/sign/info', args.sspid)),
    capture('blindBox', () => qqtGet(session.sessionCookie, '/luckBox/status', args.sspid, { channelCode: args.sspid, type: '1' })),
    capture('blindBox', () => qqtGet(session.sessionCookie, '/luckBox/infoList', args.sspid, { channelCode: args.sspid, type: '1' })),
    capture('manager', () => qqtGet(session.sessionCookie, '/clientManager/checkTarget', args.sspid)),
    capture('growth', () => queryFreshGrowth(session.sessionCookie, args.sspid)),
  ])
  if (!identityRaw && !xdrRaw && !signRaw && !blindStatusRaw && !blindPrizesRaw && !managerRaw && !growthRaw) {
    throw new Error(Object.values(errors)[0] || '全球通上游暂不可用')
  }
  const identityData = record(record(identityRaw)?.data)
  const cachedData = record(args.cachedProfile?.data)
  const cachedCmcc = record(args.cachedProfile?.cmccProfile)
  const growth = growthRaw as { state: JsonRecord; detail: JsonRecord } | undefined
  const normalizedGrowth = growth ? normalizeGrowth(growth.state, growth.detail) : undefined
  const identity: GlobalTelecomOverview['identity'] = {
    levelCode: text(identityData, ['userLevel']),
    levelName: text(identityData, ['levelName']) || text(cachedData, ['levelName']) || text(cachedCmcc, ['levelName']),
    phoneMasked: text(identityData, ['phone']),
    province: text(identityData, ['province']) || text(cachedData, ['province']) || text(cachedCmcc, ['province']),
    netAge: text(identityData, ['netAge']) || text(growth?.state, ['userChinaMobileage']) || text(cachedData, ['netAge']) || text(cachedCmcc, ['netAge']),
    joinedAt: text(growth?.state, ['userBegin']) || text(cachedData, ['userBegin']) || text(cachedCmcc, ['userBegin']),
    gsmState: normalizedGrowth?.currentLevel,
  }

  if (!blindStatusRaw && !blindPrizesRaw) errors.blindBox ||= '盲盒状态查询失败'
  return {
    refreshedAt: new Date().toISOString(),
    accessToken: session.accessToken,
    cache: {
      status: 'live',
      expiresAt: new Date(Date.now() + OVERVIEW_CACHE_TTL_MS).toISOString(),
      retryAfterSeconds: Math.ceil(OVERVIEW_CACHE_TTL_MS / 1000),
    },
    identity,
    xdr: normalizeXdr(xdrRaw),
    sign: await capture('sign', async () => normalizeSign(signRaw)) ?? { days: [], reSignRemaining: 0 },
    blindBox: await capture('blindBox', async () => normalizeBlindBox(blindStatusRaw, blindPrizesRaw)) ?? {
      tasks: [], prizes: normalizeBlindBoxPrizes(blindPrizesRaw), drawTotal: 0, drawUsed: 0, drawRemaining: 0,
    },
    manager: managerRaw ? normalizeManager(managerRaw) : undefined,
    growth: normalizedGrowth,
    errors,
  }
}

async function queryGlobalTelecomOverviewWithSessionRecovery(args: {
  cmccCookie: string
  requestHeaders?: Record<string, string>
  accessToken?: string
  sspid: string
  cachedProfile?: JsonRecord
  refreshCmccCookie?: () => Promise<string>
  refreshAccessToken?: () => Promise<string>
}): Promise<GlobalTelecomOverview> {
  try {
    return await queryGlobalTelecomOverviewLive(args)
  } catch (error) {
    if (!args.accessToken || !shouldRetryPreparedSession(error)) throw error
    if (args.refreshAccessToken) {
      const key = credentialCacheKey(args)
      preparedSessionCache.delete(key)
      preparedSessionInflight.delete(key)
      return queryGlobalTelecomOverviewLive({ ...args, accessToken: await args.refreshAccessToken() })
    }
    const cmccCookie = args.refreshCmccCookie
      ? await args.refreshCmccCookie()
      : args.cmccCookie
    if (!cmccCookie) throw error
    const key = credentialCacheKey(args)
    preparedSessionCache.delete(key)
    preparedSessionInflight.delete(key)
    return queryGlobalTelecomOverviewLive({ ...args, cmccCookie, accessToken: undefined })
  }
}

function withCacheStatus(
  overview: GlobalTelecomOverview,
  status: GlobalTelecomOverview['cache']['status'],
  expiresAt: number,
  systemError?: string,
): GlobalTelecomOverview {
  return {
    ...overview,
    cache: {
      status,
      expiresAt: new Date(expiresAt).toISOString(),
      retryAfterSeconds: Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)),
    },
    errors: systemError ? { ...overview.errors, system: systemError } : overview.errors,
  }
}

export async function queryGlobalTelecomOverview(args: {
  cmccCookie: string
  requestHeaders?: Record<string, string>
  accessToken?: string
  sspid: string
  cachedProfile?: JsonRecord
  cacheKey?: string
  refreshCmccCookie?: () => Promise<string>
  refreshAccessToken?: () => Promise<string>
}): Promise<GlobalTelecomOverview> {
  const key = args.cacheKey?.trim()
  if (!key) return queryGlobalTelecomOverviewWithSessionRecovery(args)
  const cached = overviewCache.get(key)
  if (cached && cached.expiresAt > Date.now()) {
    return withCacheStatus(
      cached.overview,
      cached.overview.errors.system ? 'stale-cache' : 'fresh-cache',
      cached.expiresAt,
    )
  }
  const existing = overviewInflight.get(key)
  if (existing) return existing
  const promise = queryGlobalTelecomOverviewWithSessionRecovery(args)
    .then((overview) => {
      const expiresAt = Date.now() + OVERVIEW_CACHE_TTL_MS
      overviewCache.set(key, {
        overview,
        expiresAt,
        staleUntil: Date.now() + OVERVIEW_STALE_TTL_MS,
      })
      return withCacheStatus(overview, 'live', expiresAt)
    })
    .catch((error) => {
      if (cached && cached.staleUntil > Date.now()) {
        const message = error instanceof Error ? error.message : '上游查询失败'
        const expiresAt = Date.now() + OVERVIEW_CACHE_TTL_MS
        const fallback = withCacheStatus(cached.overview, 'stale-cache', expiresAt, `上游暂不可用，正在展示最近成功数据：${message}`)
        overviewCache.set(key, { ...cached, overview: fallback, expiresAt })
        return fallback
      }
      throw error
    })
    .finally(() => {
      if (overviewInflight.get(key) === promise) overviewInflight.delete(key)
    })
  overviewInflight.set(key, promise)
  return promise
}

export async function queryGlobalTelecomSign(args: {
  cmccCookie: string
  requestHeaders?: Record<string, string>
  accessToken?: string
  sspid: string
  refreshCmccCookie?: () => Promise<string>
  refreshAccessToken?: () => Promise<string>
}): Promise<{ accessToken: string; sign: GlobalTelecomOverview['sign'] }> {
  const query = async (input: typeof args): Promise<{ accessToken: string; sign: GlobalTelecomOverview['sign'] }> => {
    const session = await prepare(input)
    // Match the overview's member-context initialization before querying activity state.
    await queryVipLevel(session.sessionCookie, input.sspid)
    const payload = await qqtGet(session.sessionCookie, '/sign/info', input.sspid)
    return { accessToken: session.accessToken, sign: normalizeSign(payload) }
  }
  try {
    return await query(args)
  } catch (error) {
    if (!args.accessToken || !shouldRetryPreparedSession(error)) throw error
    if (args.refreshAccessToken) {
      const key = credentialCacheKey(args)
      preparedSessionCache.delete(key)
      preparedSessionInflight.delete(key)
      return await query({ ...args, accessToken: await args.refreshAccessToken() })
    }
    const cmccCookie = args.refreshCmccCookie
      ? await args.refreshCmccCookie()
      : args.cmccCookie
    if (!cmccCookie) throw error
    const key = credentialCacheKey(args)
    preparedSessionCache.delete(key)
    preparedSessionInflight.delete(key)
    return await query({ ...args, cmccCookie, accessToken: undefined })
  }
}

export async function queryGlobalTelecomBlindBox(args: {
  cmccCookie: string
  requestHeaders?: Record<string, string>
  accessToken?: string
  sspid: string
  refreshCmccCookie?: () => Promise<string>
  refreshAccessToken?: () => Promise<string>
}): Promise<{ accessToken: string; blindBox: GlobalTelecomOverview['blindBox'] }> {
  const query = async (input: typeof args): Promise<{
    accessToken: string
    blindBox: GlobalTelecomOverview['blindBox']
  }> => {
    const session = await prepare(input)
    await queryVipLevel(session.sessionCookie, input.sspid)
    const payload = await qqtGet(session.sessionCookie, '/luckBox/status', input.sspid, {
      channelCode: input.sspid,
      type: '1',
    })
    return { accessToken: session.accessToken, blindBox: normalizeBlindBox(payload, undefined) }
  }
  try {
    return await query(args)
  } catch (error) {
    if (!args.accessToken || !shouldRetryPreparedSession(error)) throw error
    if (args.refreshAccessToken) {
      const key = credentialCacheKey(args)
      preparedSessionCache.delete(key)
      preparedSessionInflight.delete(key)
      return await query({ ...args, accessToken: await args.refreshAccessToken() })
    }
    const cmccCookie = args.refreshCmccCookie
      ? await args.refreshCmccCookie()
      : args.cmccCookie
    if (!cmccCookie) throw error
    const key = credentialCacheKey(args)
    preparedSessionCache.delete(key)
    preparedSessionInflight.delete(key)
    return await query({ ...args, cmccCookie, accessToken: undefined })
  }
}

export function invalidateGlobalTelecomOverview(accountId: string): void {
  const prefix = `${accountId}:`
  for (const key of overviewCache.keys()) {
    if (key.startsWith(prefix)) overviewCache.delete(key)
  }
}

async function runAction(args: {
  cmccCookie: string
  requestHeaders?: Record<string, string>
  accessToken?: string
  sspid: string
  path: string
  body: JsonRecord
}): Promise<GlobalTelecomActionResult> {
  const session = await prepare(args)
  const payload = await qqtPostJson(session.sessionCookie, args.path, args.sspid, args.body)
  return { accessToken: session.accessToken, payload, message: upstreamMessage(payload) }
}

export function globalTelecomSign(args: {
  cmccCookie: string
  requestHeaders?: Record<string, string>
  accessToken?: string
  sspid: string
}): Promise<GlobalTelecomActionResult> {
  return runAction({ ...args, path: '/sign/sign', body: { sspid: args.sspid } })
}

export async function globalTelecomResign(args: {
  cmccCookie: string
  requestHeaders?: Record<string, string>
  accessToken?: string
  sspid: string
  dayNum: number
  taskIds: number[]
}): Promise<GlobalTelecomActionResult> {
  const session = await prepare(args)
  const results: Array<{ taskId: number; payload: unknown; message: string }> = []
  for (const taskId of args.taskIds) {
    const payload = await qqtPostJson(session.sessionCookie, '/sign/finshResignTask', args.sspid, {
      dayNum: args.dayNum,
      taskId,
      sspid: args.sspid,
    })
    results.push({ taskId, payload, message: upstreamMessage(payload) })
  }
  const signPayload = await qqtGet(session.sessionCookie, '/sign/info', args.sspid)
  return {
    accessToken: session.accessToken,
    payload: {
      completedTaskIds: args.taskIds,
      results,
      sign: normalizeSign(signPayload),
    },
    message: args.taskIds.length > 1 ? `${args.taskIds.length} 项补签任务已依次提交` : upstreamMessage(results[0]?.payload),
  }
}

export function globalTelecomAcceptReward(args: {
  cmccCookie: string
  requestHeaders?: Record<string, string>
  accessToken?: string
  sspid: string
  dayNum: number
  prizeId: string
  mark: boolean
  isVirtual: boolean
}): Promise<GlobalTelecomActionResult> {
  return runAction({
    ...args,
    path: '/sign/toaccept',
    body: { sspId: Number(args.sspid), dayNum: args.dayNum, prizeId: args.prizeId, mark: args.mark, isVirtual: args.isVirtual },
  })
}

export async function globalTelecomBlindBoxAction(args: {
  cmccCookie: string
  requestHeaders?: Record<string, string>
  accessToken?: string
  sspid: string
  action: 'draw' | 'receive' | 'complete-task' | 'complete-all'
  prizeCode?: string
  taskNumber?: number
}): Promise<GlobalTelecomActionResult> {
  const session = await prepare(args)
  const vip = record(record(await queryVipLevel(session.sessionCookie, args.sspid))?.data)
  if (vip?.userLevel == null || String(vip.userLevel).trim() === '') throw new Error('未获取到活动参与资格，请刷新全球通信息后重试')
  if (['6', '7', '-1'].includes(String(vip?.userLevel))) throw new Error('当前号码不符合全球通盲盒活动参与资格，可继续查询全球通信息')
  const readState = async () => normalizeBlindBox(await qqtGet(session.sessionCookie, '/luckBox/status', args.sspid,
    { channelCode: args.sspid, type: '1' }), undefined)
  const post = (path: string, body: JsonRecord) => qqtPostJson(session.sessionCookie, path, args.sspid, body)
  if (args.action === 'draw') {
    const state = await readState()
    if (!state.drawAllowed) throw new Error(state.unavailableReason || '当前不可抽奖')
    // Never retry a draw: a lost response can still have consumed an opportunity.
    const payload = await post('/luckBox/draw', { channelCode: args.sspid, type: 1 })
    const prize = readBlindBoxDraw(payload)
    return { accessToken: session.accessToken, payload, blindBoxPrize: prize,
      message: prize.prizeCode === '9999' ? '本次未抽中奖品' : `已抽中${prize.prizeName || `奖品 #${prize.prizeCode}`}，请确认领取` }
  }
  if (args.action === 'receive') {
    if (!/^\d{1,10}$/.test(args.prizeCode || '') || Number(args.prizeCode) <= 0 || Number(args.prizeCode) === 9999) throw new Error('无有效盲盒奖品可领取')
    const payload = await post('/luckBox/receive', { prizeCode: Number(args.prizeCode), channelCode: args.sspid })
    const fulfillmentUrl = blindBoxFulfillmentUrl(args.prizeCode!)
    return { accessToken: session.accessToken, payload,
      blindBoxPrize: { prizeCode: args.prizeCode!, fulfillmentUrl },
      message: fulfillmentUrl ? '奖品领取成功，请前往官方页面填写领奖信息' : upstreamMessage(payload) || '奖品领取成功，权益按官方规则发放' }
  }
  const state = await readState()
  if (!blindBoxCampaign().known) throw new Error('本期活动任务清单需更新')
  const plan = args.action === 'complete-all' ? state.tasks.filter((task) => !task.completed && task.available) :
    state.tasks.filter((task) => task.number === args.taskNumber)
  if (args.action === 'complete-task' && plan.length !== 1) throw new Error('盲盒任务编号不在官方任务清单中')
  const completed: number[] = []
  const failures: string[] = []
  for (const task of plan) {
    if (task.completed) continue
    if (!task.available) throw new Error(task.unavailableReason || '任务尚未开放')
    try {
      await post('/luckBox/completeTask', { number: task.number, type: 1, channelCode: args.sspid })
      await verifyQqtActivityState({ query: readState,
        completed: (latest) => latest.tasks.some((item) => item.number === task.number && item.completed),
        message: `${task.name}提交后未确认完成，请刷新后重试`,
      })
      completed.push(task.number)
    } catch (error) {
      if (args.action === 'complete-task') throw error
      failures.push(`${task.name}：${error instanceof Error ? error.message : '未确认完成'}`)
    }
  }
  return { accessToken: session.accessToken, payload: { status: '1', data: { completed, failures } },
    message: failures.length ? `完成 ${completed.length}/${plan.length} 项；${failures.join('；')}` :
      plan.length ? `已核验完成 ${completed.length} 项盲盒任务` : '当前可完成的盲盒任务已完成，未开放任务暂不提交' }
}

export type GlobalTelecomFailure = {
  status: number
  message: string
  errorCode: string
  retryAfterSeconds?: number
}

export function classifyGlobalTelecomFailure(error: unknown): GlobalTelecomFailure {
  const rawMessage = error instanceof Error ? error.message : '全球通上游请求失败'
  const message = rawMessage.trim() || '全球通上游请求失败'
  if (message.includes('UPSTREAM_TIMEOUT')) {
    return { status: 504, message: '全球通上游超时，请重试', errorCode: 'UPSTREAM_TIMEOUT' }
  }

  const throttled = /(?:\bHTTP\s*429\b|请求过于频繁|请求频繁|操作频繁|访问频繁|触发限流|稍后再试|活动火爆|风险控制|风控|rate.?limit|throttl)/i.test(message)
  if (throttled) {
    return {
      status: 429,
      message,
      errorCode: 'GLOBAL_TELECOM_RATE_LIMIT',
      retryAfterSeconds: 60,
    }
  }

  const authenticationFailed = /(?:access[_ -]?token|token|cookie|\bck\b).*(?:失效|无效|过期|缺失|不存在)|(?:未登录|请先登录|重新登录|登录失效|认证失败|授权失败)/i.test(message)
  if (authenticationFailed) {
    return { status: 401, message, errorCode: 'GLOBAL_TELECOM_AUTH_INVALID' }
  }

  return { status: 502, message, errorCode: 'GLOBAL_TELECOM_UPSTREAM_ERROR' }
}

export const __test__ = {
  assertQqtSuccess,
  classifyGlobalTelecomFailure,
  createGlobalTelecomOverviewSnapshot,
  fetchGsmSsoToken,
  mergeGlobalTelecomOverview,
  normalizeBlindBox,
  normalizeGrowth,
  normalizeSign,
  normalizeXdr,
  parseJson,
  readGlobalTelecomOverviewSnapshot,
  shouldRetryGrowth,
  shouldRetryPreparedSession,
}

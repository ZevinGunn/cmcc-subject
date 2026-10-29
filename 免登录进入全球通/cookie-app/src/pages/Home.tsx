import BrandLogo from '@/components/BrandLogo'
import PhoneInput from '@/components/PhoneInput'
import YunpanJumpActions from '@/components/YunpanJumpActions'
import { getAccountLoginState } from '@/lib/accountLoginState'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  FileText,
  KeyRound,
  Loader2,
  Phone,
  Puzzle,
  QrCode,
  RefreshCcw,
  Save,
  Search,
  ShieldCheck,
  Wrench,
  Link2,
  ListChecks,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import AccountLoginDialog, { type LoginMethod } from '@/components/AccountLoginDialog'
import {
  extractXdrReceive,
  formatPrizeNames,
  loadXdrPrizeMap,
} from '@/lib/xdrPrize'

const WED_APP_TOKEN_CONFIG_KEY = 'wed_recharge_app_token_config'

type ApiOk<T> = { ok: true; data: T; message?: string; requestId?: string }
type ApiErr = {
  ok: false
  message: string
  errorCode?: string
  requestId?: string
  phase?: string
  debug?: unknown
}
type ApiResp<T> = ApiOk<T> | ApiErr

type AccountSummary = {
  id: string
  label?: string
  phone?: string
  publicLinkIds?: string[]
  phoneMasked: string
  displayPhone?: string
  hasCookie: boolean
  cookieUpdatedAt?: string
  cookieInvalidAt?: string
  cookieInvalidReason?: string
  lastLoginMethod?: 'cmcc_sms' | 'cmcc_qr' | 'yunpan' | 'manual_cookie'
  lastLoginAt?: string
  cookieSource?: 'sms' | 'qr' | 'yunpan' | 'manual' | 'qqt_sso'
  cookieExpireAt?: string
  cookieTtlSeconds?: number
  activationInfo?: Record<string, unknown>
  activationCheckedAt?: string
  updatedAt: string
  newHomeUrl?: string
  qqtAccessToken?: string
  qqtAccessTokenCheckedAt?: string
  hasYunpanSession?: boolean
  yunpanSessionUpdatedAt?: string
  qqtInfo?: Record<string, unknown>
  qqtSignInfo?: Record<string, unknown>
  qqtSignResult?: Record<string, unknown>
  qqtSignUpdatedAt?: string
  xdrReceive?: Record<string, unknown>
  xdrReceiveUpdatedAt?: string
  wedRechargeInfo?: WedRechargeInfo
  wedRechargeUpdatedAt?: string
  disabledAt?: string
  disabledReason?: string
}

type QrLoginFlowState = {
  flowId: string
  status: 'pending' | 'success' | 'expired'
  message?: string
  qrImage?: string
  cookieNames: string[]
  cookieLength?: number
  expiresInSeconds?: number
}

type WedRechargeInfo = {
  activeIndex?: number
  drawTimes?: string
  pictureList?: Record<string, Record<string, string>>
  r4Status?: number
  r5Status?: number
  r6Status?: number
  r4DrawStatus?: number
  r5DrawStatus?: number
  r6DrawStatus?: number
  updatedAt?: string
}

type ActivationSummary = {
  status?: number | string
  message?: string
  resultStatusCode?: number | string
  resultStatusDesc?: string
  dataResultCode?: string
  dataResultDesc?: string
  tariffPackages?: string
  customerAssignment?: string
  brandLevelName?: string
  telNumStar?: string
  oprTime?: string
  id?: string
}

type ActivationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | {
      status: 'ok'
      decrypted: string
      encrypted: string
      cookieUpdated: boolean
      summary?: ActivationSummary
      cookieValid: boolean | null
    }
  | { status: 'error'; message: string }

type SessionBridgeResp = {
  cookie: string
  cookieUpdated: boolean
  sessionTokenUpdated?: boolean
  fields?: string[]
  finalUrl?: string
  steps?: Array<{
    name: string
    status: number
    cookieUpdated: boolean
    location?: string
  }>
}

type SessionCapabilities = {
  hasCookie: boolean
  fields: Record<string, boolean>
  availableFields: string[]
  missingFields: string[]
  groups: {
    activity: boolean
    pcSso: boolean
    cmccApp: boolean
    basic10086: boolean
  }
  summary: string
}

type QqtAccountState = {
  accessToken?: string
  tokenStatus?: 'valid' | 'invalid' | 'unknown'
  tokenCheckedAt?: string
  signResult?: unknown
  signInfo?: unknown
  signSource?: 'sign' | 'info'
  signUpdatedAt?: string
  error?: string
  loading?: 'sign' | 'info' | 'token'
}

type QqtSignSummary = {
  statusText: string
  message?: string
  prize?: string
}

type PublicLinkSummary = {
  linkId: string
  createdAt: string
  updatedAt: string
  accountCount: number
  url: string
  ipUrl?: string
  pushplusEnabled: boolean
  pushplusBound: boolean
  notifyLogin: boolean
  notifyCookieInvalid: boolean
  notifyRushResult: boolean
  pushplusSubscribeUrl?: string
  pushplusQrImageUrl?: string
  pushplusQrNote?: string
  redirectEnabled: boolean
  redirectUrl?: string
  redirectNote?: string
}

type BatchProgress = {
  total: number
  completed: number
  currentIndex: number
  currentLabel: string
}

type TokenCopyProgress = {
  running: boolean
  message: string
  logs: string[]
  exported?: number
  unique?: number
  skipped?: number
  tokenText?: string
}

type BatchTaskItem = {
  id: string
  accountId: string
  accountLabel?: string
  orderIndex: number
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped'
  message?: string
  startedAt?: string
  finishedAt?: string
}

type BatchTaskSummary = {
  id: string
  type:
    | 'refresh'
    | 'sign'
    | 'refresh_and_sign'
    | 'wed_recharge'
    | 'query_info'
    | 'yunpan_activate'
    | 'ck_maintenance'
    | 'activity_session_refresh'
    | 'cmcc_session_exchange'
    | 'keepalive'
  scopeType: 'admin_all' | 'public_link' | 'account' | 'selected_accounts'
  scopeId?: string
  source: string
  scheduleId?: string
  status: 'pending' | 'running' | 'success' | 'failed' | 'partial_success'
  sspid?: string
  timezone?: string
  totalCount: number
  completedCount: number
  successCount: number
  failedCount: number
  skippedCount: number
  currentLabel?: string
  message?: string
  startedAt?: string
  finishedAt?: string
  createdAt: string
  updatedAt: string
  items: BatchTaskItem[]
}

type TaskScheduleSummary = {
  id: string
  name: string
  enabled: boolean
  scopeType: 'admin_all' | 'public_link'
  scopeId?: string
  action:
    | 'refresh'
    | 'sign'
    | 'refresh_and_sign'
    | 'activity_session_refresh'
    | 'cmcc_session_exchange'
    | 'keepalive'
  timezone: string
  sspid?: string
  times: string[]
  lastTriggeredAt?: string
  createdAt: string
  updatedAt: string
}

function onlyDigits(value: string): string {
  return value.replace(/\D+/g, '')
}

function formatBeijingDateTime(isoText?: string): string {
  if (!isoText) return '—'
  const date = new Date(isoText)
  if (Number.isNaN(date.getTime())) return isoText
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const map: Record<string, string> = {}
  for (const p of parts) {
    if (p.type !== 'literal') map[p.type] = p.value
  }
  if (
    !map.year ||
    !map.month ||
    !map.day ||
    !map.hour ||
    !map.minute ||
    !map.second
  ) {
    return isoText
  }
  return `${map.year}年${map.month}月${map.day}日 ${map.hour}:${map.minute}:${map.second}`
}

function formatLoginMethod(method?: AccountSummary['lastLoginMethod']): string {
  if (method === 'cmcc_qr') return 'App扫码'
  if (method === 'yunpan') return '云盘'
  if (method === 'manual_cookie') return '手动CK'
  return '验证码'
}

function formatExpiryRemain(expireAt?: string): string {
  if (!expireAt) return ''
  const expireMs = Date.parse(expireAt)
  if (!Number.isFinite(expireMs)) return ''
  const diff = expireMs - Date.now()
  if (diff <= 0) return '已过期'
  const hours = Math.floor(diff / (60 * 60 * 1000))
  if (hours >= 24) return `剩余 ${Math.floor(hours / 24)} 天 ${hours % 24} 小时`
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
  return `剩余 ${hours} 小时 ${minutes} 分`
}

function parseActivationSummary(
  rawText: string,
): ActivationSummary | undefined {
  try {
    const parsed = JSON.parse(rawText) as Record<string, unknown>
    if (!parsed || typeof parsed !== 'object') return undefined
    const resultStatus = (parsed.resultStatus ?? {}) as Record<string, unknown>
    const data = (parsed.data ?? {}) as Record<string, unknown>
    const resultData = (data.resultData ?? {}) as Record<string, unknown>
    return {
      status: parsed.status as number | string | undefined,
      message: typeof parsed.message === 'string' ? parsed.message : undefined,
      resultStatusCode: resultStatus.resultCode as number | string | undefined,
      resultStatusDesc:
        typeof resultStatus.resultDesc === 'string'
          ? resultStatus.resultDesc
          : undefined,
      dataResultCode:
        typeof data.resultCode === 'string' ? data.resultCode : undefined,
      dataResultDesc:
        typeof data.resultDesc === 'string' ? data.resultDesc : undefined,
      tariffPackages:
        typeof resultData.tariffPackages === 'string'
          ? resultData.tariffPackages
          : undefined,
      customerAssignment:
        typeof resultData.customerAssignment === 'string'
          ? resultData.customerAssignment
          : undefined,
      brandLevelName:
        typeof resultData.brandLevelName === 'string'
          ? resultData.brandLevelName
          : undefined,
      telNumStar:
        typeof resultData.telNumStar === 'string'
          ? resultData.telNumStar
          : undefined,
      oprTime: typeof data.oprTime === 'string' ? data.oprTime : undefined,
      id: typeof parsed.id === 'string' ? parsed.id : undefined,
    }
  } catch {
    return undefined
  }
}

function parseObjectRecord(rawText: string): Record<string, unknown> | undefined {
  try {
    const parsed = JSON.parse(rawText) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return undefined
    }
    return parsed as Record<string, unknown>
  } catch {
    return undefined
  }
}

function computeCookieValid(summary?: ActivationSummary): boolean | null {
  if (!summary) return null
  const statusOk = summary.status === 0 || summary.status === '0'
  const resultOk =
    summary.resultStatusCode === 0 || summary.resultStatusCode === '0'
  const dataOk = summary.dataResultCode === '0000'
  if (statusOk || resultOk || dataOk) return true
  const statusKnown =
    summary.status !== undefined ||
    summary.resultStatusCode !== undefined ||
    summary.dataResultCode !== undefined
  return statusKnown ? false : null
}

function parseHeadersInputValue(
  rawText: string,
): Record<string, string> | undefined {
  const text = rawText.trim()
  if (!text) return undefined
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    const fallback = extractHeadersObject(text) ?? parseHeaderLines(text)
    if (!fallback) {
      throw new Error('请求头格式不正确，请按每行 Key: Value 输入')
    }
    parsed = fallback
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('请求头格式不正确，请按每行 Key: Value 输入')
  }
  const obj = parsed as Record<string, unknown>
  const headersObj =
    obj.headers &&
    typeof obj.headers === 'object' &&
    !Array.isArray(obj.headers)
      ? (obj.headers as Record<string, unknown>)
      : obj
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(headersObj)) {
    const key = k.trim().toLowerCase()
    if (!key || key === 'cookie') continue
    if (v === null || v === undefined) continue
    out[key] = String(v)
  }
  return out
}

function extractHeadersObject(text: string): Record<string, unknown> | null {
  const idx = text.indexOf('"headers"')
  if (idx < 0) return null
  const braceStart = text.indexOf('{', idx)
  if (braceStart < 0) return null
  let depth = 0
  for (let i = braceStart; i < text.length; i += 1) {
    const ch = text[i]
    if (ch === '{') depth += 1
    if (ch === '}') {
      depth -= 1
      if (depth === 0) {
        const slice = text.slice(braceStart, i + 1)
        try {
          return JSON.parse(slice) as Record<string, unknown>
        } catch {
          return null
        }
      }
    }
  }
  return null
}

function parseHeaderLines(text: string): Record<string, unknown> | null {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length === 0) return null
  const out: Record<string, unknown> = {}
  for (const line of lines) {
    const idx = line.indexOf(':')
    if (idx <= 0) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    if (!key || !value) continue
    out[key] = value
  }
  return Object.keys(out).length ? out : null
}

const beijingDayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

function getDayKey(date = new Date()): string {
  const parts = beijingDayFormatter.formatToParts(date)
  const map: Record<string, string> = {}
  for (const part of parts) {
    if (part.type !== 'literal') {
      map[part.type] = part.value
    }
  }
  if (!map.year || !map.month || !map.day) {
    return date.toISOString().slice(0, 10)
  }
  return `${map.year}-${map.month}-${map.day}`
}

function formatHeadersAsLines(headers?: Record<string, string>): string {
  if (!headers || Object.keys(headers).length === 0) return ''
  return Object.entries(headers)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
}

function isHarAccount(account?: { newHomeUrl?: string }): boolean {
  if (!account?.newHomeUrl) return false
  return account.newHomeUrl.includes('code=')
}

function shouldPromptHar(message: string): boolean {
  const lower = message.toLowerCase()
  return (
    lower.includes('newhome') ||
    lower.includes('csrf') ||
    lower.includes('http 500') ||
    message.includes('newHome')
  )
}

function parseQqtSignSummary(raw: unknown): QqtSignSummary | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  const status = obj.status
  const msg =
    typeof obj.msg === 'string'
      ? obj.msg
      : typeof obj.message === 'string'
        ? obj.message
        : undefined
  let prize: string | undefined
  if (Array.isArray(obj.data)) {
    const first = obj.data[0] as Record<string, unknown> | undefined
    if (first && typeof first.prizeName === 'string') {
      prize = first.prizeName
    }
  }
  const statusText =
    status === 1 || status === '1'
      ? '成功'
      : status === 0 || status === '0'
        ? '失败'
        : msg && msg.includes('已签到')
          ? '已签到'
          : '未知'
  return { statusText, message: msg, prize }
}

function isTodayIso(isoText?: string): boolean {
  if (!isoText) return false
  const date = new Date(isoText)
  if (Number.isNaN(date.getTime())) return false
  return getDayKey(date) === getDayKey()
}

function extractXdrCache(raw: unknown): {
  prodList: number[]
  enjoycollectabletimes?: number
} | null {
  const parsed = extractXdrReceive(raw)
  if (!parsed) return null
  return {
    prodList: parsed.prodList,
    enjoycollectabletimes: parsed.enjoycollectabletimes,
  }
}

function isTokenInvalidMessage(message?: string): boolean {
  if (!message) return false
  const lower = message.toLowerCase()
  if (lower.includes('401') || lower.includes('403')) return true
  if (
    lower.includes('token') &&
    (lower.includes('失效') || lower.includes('无效') || lower.includes('过期'))
  ) {
    return true
  }
  if (
    message.includes('未登录') ||
    message.includes('非法') ||
    message.includes('授权')
  )
    return true
  return false
}

function normalizeScheduleTime(value: string): string {
  const text = String(value || '').trim()
  if (!text) return '09:00'
  const match = text.match(/^(\d{1,2}):(\d{1,2})$/)
  if (!match) return '09:00'
  const hour = Math.max(0, Math.min(23, Number(match[1])))
  const minute = Math.max(0, Math.min(59, Number(match[2])))
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function normalizeScheduleTimes(values: string[]): string[] {
  const set = new Set<string>()
  for (const value of values) {
    const normalized = normalizeScheduleTime(value)
    if (normalized) set.add(normalized)
  }
  return Array.from(set).sort()
}

function getCurrentHm(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Shanghai',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const map: Record<string, string> = {}
  for (const part of parts) {
    if (part.type !== 'literal') map[part.type] = part.value
  }
  if (!map.hour || !map.minute) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }
  return `${map.hour}:${map.minute}`
}

async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  return await fetch(input, {
    ...init,
    headers: new Headers(init.headers ?? {}),
    credentials: 'same-origin',
  })
}

async function postJson<T>(url: string, body: unknown): Promise<ApiResp<T>> {
  const res = await apiFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return readJsonResponse<T>(res)
}

async function readJsonResponse<T>(res: Response): Promise<ApiResp<T>> {
  const text = await res.text()
  if (!text.trim()) {
    return {
      ok: false,
      message: `接口返回为空（HTTP ${res.status}）`,
      errorCode: 'EMPTY_RESPONSE',
    }
  }
  try {
    const json = JSON.parse(text) as ApiResp<T>
    if (!json.ok) console.warn('[api-error]', json)
    return json
  } catch {
    const snippet = text.replace(/\s+/g, ' ').trim().slice(0, 500)
    console.warn('[api-invalid-json]', {
      status: res.status,
      statusText: res.statusText,
      bodySnippet: snippet,
    })
    const looksHtml = /^<!doctype|^<html|<body/i.test(snippet)
    return {
      ok: false,
      message: looksHtml
        ? `接口临时返回了页面内容（HTTP ${res.status}），请稍后重试`
        : `接口返回格式异常（HTTP ${res.status}${snippet ? `：${snippet}` : ''}）`,
      errorCode: 'INVALID_JSON',
    }
  }
}

export default function Home() {
  const [authTab, setAuthTab] = useState<'sms' | 'cookie' | 'qr' | 'yunpan'>('sms')
  const [smsPhone, setSmsPhone] = useState('')
  const [smsLabel, setSmsLabel] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [yunpanPhone, setYunpanPhone] = useState('')
  const [yunpanLabel, setYunpanLabel] = useState('')
  const [yunpanCode, setYunpanCode] = useState('')
  const [cookiePhone, setCookiePhone] = useState('')
  const [cookieInput, setCookieInput] = useState('')
  const [qrPhone, setQrPhone] = useState('')
  const [qrLabel, setQrLabel] = useState('')
  const [qrFlow, setQrFlow] = useState<QrLoginFlowState | null>(null)
  const [batchCookieInput, setBatchCookieInput] = useState('')
  const [headersInput, setHeadersInput] = useState('')
  const [newHomeUrlInput, setNewHomeUrlInput] = useState('')
  const [harParsing, setHarParsing] = useState(false)
  // token 导入已移除

  const [accounts, setAccounts] = useState<AccountSummary[]>([])
  const [expandedAccountId, setExpandedAccountId] = useState<string>('')
  const [expandedCookie, setExpandedCookie] = useState<string>('')
  const [activeAccountId, setActiveAccountId] = useState<string>('')
  const [activationById, setActivationById] = useState<
    Record<string, ActivationState>
  >({})
  const [refreshingById, setRefreshingById] = useState<Record<string, boolean>>(
    {},
  )
  const [sessionBusyById, setSessionBusyById] = useState<
    Record<string, 'activity' | 'cmcc' | undefined>
  >({})
  const [sessionCapabilitiesById, setSessionCapabilitiesById] = useState<
    Record<string, SessionCapabilities | undefined>
  >({})
  const [sessionCapabilityLoadingById, setSessionCapabilityLoadingById] = useState<
    Record<string, boolean>
  >({})
  const [harHintById, setHarHintById] = useState<Record<string, string>>({})

  const [cooldown, setCooldown] = useState(0)

  const [sending, setSending] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const [cookieLoggingIn, setCookieLoggingIn] = useState(false)
  const [qrBusy, setQrBusy] = useState(false)
  const [qrSaving, setQrSaving] = useState(false)
  const [batchImporting, setBatchImporting] = useState(false)
  const [copying, setCopying] = useState(false)
  const [tokenCopyProgress, setTokenCopyProgress] = useState<TokenCopyProgress | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeAdminTask, setActiveAdminTask] = useState<BatchTaskSummary | null>(null)
  const [activeAdminTasks, setActiveAdminTasks] = useState<BatchTaskSummary[]>([])
  const [taskLogModalTask, setTaskLogModalTask] = useState<BatchTaskSummary | null>(null)
  const [taskSchedules, setTaskSchedules] = useState<TaskScheduleSummary[]>([])
  const [scheduleName, setScheduleName] = useState('每日刷新签到')
  const [scheduleTimeInput, setScheduleTimeInput] = useState('09:00')
  const [scheduleTimes, setScheduleTimes] = useState<string[]>([])
  const [scheduleSaving, setScheduleSaving] = useState(false)
  const [refreshAllInProgress, setRefreshAllInProgress] = useState(false)
  const [refreshBatchProgress, setRefreshBatchProgress] =
    useState<BatchProgress | null>(null)
  const [qqtSspid, setQqtSspid] = useState<string>('')
  const [qqtById, setQqtById] = useState<Record<string, QqtAccountState>>({})
  const [xdrById, setXdrById] = useState<
    Record<
      string,
      { prodList: number[]; enjoycollectabletimes?: number; updatedAt?: string }
    >
  >({})
  const [xdrPrizeMap, setXdrPrizeMap] = useState<Record<string, string>>({})
  const [signAllInProgress, setSignAllInProgress] = useState(false)
  const [signBatchProgress, setSignBatchProgress] =
    useState<BatchProgress | null>(null)
  const [tokenRefreshingAll, setTokenRefreshingAll] = useState(false)
  const [cleanupInProgress, setCleanupInProgress] = useState(false)
  const [dedupInProgress, setDedupInProgress] = useState(false)
  const [publicLinks, setPublicLinks] = useState<PublicLinkSummary[]>([])
  const [linkCountInput, setLinkCountInput] = useState<number>(1)
  const harInputRef = useRef<HTMLInputElement | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [loginDialogAccount, setLoginDialogAccount] = useState<AccountSummary | null>(null)
  const [showLinksModal, setShowLinksModal] = useState(false)
  const [showAssignLinkModal, setShowAssignLinkModal] = useState(false)
  const [assignLinkAccountId, setAssignLinkAccountId] = useState<string | null>(
    null,
  )
  const [assignLinkId, setAssignLinkId] = useState('')
  const [assignLinkLoading, setAssignLinkLoading] = useState(false)
  const [assignLinkError, setAssignLinkError] = useState<string | null>(null)
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null)
  const [linkAccountsById, setLinkAccountsById] = useState<
    Record<string, AccountSummary[]>
  >({})
  const [linkAccountsLoadingId, setLinkAccountsLoadingId] = useState<string | null>(
    null,
  )
  const [linkAccountsErrorById, setLinkAccountsErrorById] = useState<
    Record<string, string>
  >({})
  const [linkAccountsOpenId, setLinkAccountsOpenId] = useState<string | null>(
    null,
  )
  const initialLoadRef = useRef(false)
  const qrPollTimerRef = useRef<number | null>(null)
  const qrPollingRef = useRef(false)
  const [rewardTab, setRewardTab] = useState<'all' | 'unreceived' | 'received'>(
    'all',
  )
  const [ckFilter, setCkFilter] = useState<'all' | 'valid' | 'invalid'>('all')
  const [showUnlinkedOnly, setShowUnlinkedOnly] = useState(false)
  const [linkFilterId, setLinkFilterId] = useState('')
  const [linkFilterInput, setLinkFilterInput] = useState('')
  const [accountSearchInput, setAccountSearchInput] = useState('')
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([])
  const [batchDisablingAccounts, setBatchDisablingAccounts] = useState(false)
  const [batchDeletingAccounts, setBatchDeletingAccounts] = useState(false)
  const [wedRechargeAccountId, setWedRechargeAccountId] = useState<string | null>(null)
  const [wedRechargeInfo, setWedRechargeInfo] = useState<WedRechargeInfo | null>(null)
  const [wedRechargeLoading, setWedRechargeLoading] = useState<string | null>(null)
  const [wedRechargeError, setWedRechargeError] = useState<string | null>(null)
  const [wedRechargeSuccess, setWedRechargeSuccess] = useState<string | null>(null)
  const [wedRechargeTask, setWedRechargeTask] = useState<BatchTaskSummary | null>(null)
  const [sortKey, setSortKey] = useState<
    'account' | 'cookieUpdatedAt' | 'token' | 'signUpdatedAt' | 'xdr'
  >('account')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [showGlobalToolbox, setShowGlobalToolbox] = useState(false)
  const [showGlobalAppTokenConfig, setShowGlobalAppTokenConfig] = useState(false)
  const [showScheduleSettings, setShowScheduleSettings] = useState(false)
  const [showFilterTools, setShowFilterTools] = useState(false)
  const [appTokenInput, setAppTokenInput] = useState('')
  const [appTokenActivitySid, setAppTokenActivitySid] = useState('')
  const [appTokenUserCheckId, setAppTokenUserCheckId] = useState('')
  const [wedRechargeUseAppToken, setWedRechargeUseAppToken] = useState(false)
  const [wedAppTokenConfigLoaded, setWedAppTokenConfigLoaded] = useState(false)
  const [accountToolboxId, setAccountToolboxId] = useState<string | null>(null)
  const [dailySignCache, setDailySignCache] = useState<Record<string, string>>({})
  const todayKeyRef = useRef(getDayKey())

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(WED_APP_TOKEN_CONFIG_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as {
          enabled?: boolean
          appTokenInput?: string
          sid?: string
          userCheckId?: string
        }
        setWedRechargeUseAppToken(typeof parsed.enabled === 'boolean' ? parsed.enabled : true)
        if (typeof parsed.appTokenInput === 'string') setAppTokenInput(parsed.appTokenInput)
        if (typeof parsed.sid === 'string') setAppTokenActivitySid(parsed.sid)
        if (typeof parsed.userCheckId === 'string') setAppTokenUserCheckId(parsed.userCheckId)
      }
    } catch {
      // ignore invalid local config
    } finally {
      setWedAppTokenConfigLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!wedAppTokenConfigLoaded) return
    try {
      window.localStorage.setItem(WED_APP_TOKEN_CONFIG_KEY, JSON.stringify({
        enabled: wedRechargeUseAppToken,
        appTokenInput,
        sid: appTokenActivitySid,
        userCheckId: appTokenUserCheckId,
      }))
    } catch {
      // ignore storage failures
    }
  }, [appTokenActivitySid, appTokenInput, appTokenUserCheckId, wedAppTokenConfigLoaded, wedRechargeUseAppToken])

  const smsNormalizedPhone = useMemo(
    () => onlyDigits(smsPhone),
    [smsPhone],
  )
  const smsNormalizedCode = useMemo(
    () => onlyDigits(smsCode).slice(0, 6),
    [smsCode],
  )
  const cookieNormalizedPhone = useMemo(
    () => onlyDigits(cookiePhone),
    [cookiePhone],
  )
  const yunpanNormalizedPhone = useMemo(
    () => onlyDigits(yunpanPhone),
    [yunpanPhone],
  )
  const yunpanNormalizedCode = useMemo(
    () => onlyDigits(yunpanCode).slice(0, 6),
    [yunpanCode],
  )
  const qrNormalizedPhone = useMemo(
    () => onlyDigits(qrPhone),
    [qrPhone],
  )

  const smsPhoneValid = /^1\d{10}$/.test(smsNormalizedPhone)
  const yunpanPhoneValid = /^1\d{10}$/.test(yunpanNormalizedPhone)
  const qrPhoneValid = /^1\d{10}$/.test(qrNormalizedPhone)
  const canSend = smsPhoneValid && cooldown === 0 && !sending && !loggingIn
  const canLogin = smsPhoneValid && smsNormalizedCode.length === 6 && !loggingIn
  const canSendYunpan =
    yunpanPhoneValid && cooldown === 0 && !sending && !loggingIn
  const canLoginYunpan =
    yunpanPhoneValid && yunpanNormalizedCode.length === 6 && !loggingIn
  const canCookieLogin =
    cookieInput.trim().length > 0 && !cookieLoggingIn && !sending && !loggingIn
  const canStartQrLogin = !qrBusy && !qrSaving
  const canSaveQrLogin =
    Boolean(qrFlow?.flowId) &&
    qrFlow?.status === 'success' &&
    !qrSaving &&
    (qrPhone.length === 0 || qrPhoneValid)
  const canBatchImport =
    batchCookieInput.trim().length > 0 &&
    !batchImporting &&
    !cookieLoggingIn &&
    !sending &&
    !loggingIn
  const hasRefreshTargets = accounts.some((a) => a.hasCookie)
  const qqtSspidValid = qqtSspid.trim().length > 0
  const hasHarAccounts = accounts.some((a) => isHarAccount(a))
  const hasTokenExportTargets = accounts.some(
    (a) => a.hasCookie || a.hasYunpanSession || qqtById[a.id]?.accessToken || a.qqtAccessToken,
  )
  const adminTaskRunning =
    activeAdminTasks.some((task) => task.status === 'pending' || task.status === 'running') ||
    activeAdminTask?.status === 'pending' ||
    activeAdminTask?.status === 'running'

  function hydrateCachedState(list: AccountSummary[]) {
    const nextActivation: Record<string, ActivationState> = {}
    const nextQqt: Record<string, QqtAccountState> = {}
    const nextXdr: Record<
      string,
      { prodList: number[]; enjoycollectabletimes?: number; updatedAt?: string }
    > = {}

    for (const account of list) {
      if (account.activationInfo) {
        const decrypted = JSON.stringify(account.activationInfo)
        const summary = parseActivationSummary(decrypted)
        nextActivation[account.id] = {
          status: 'ok',
          encrypted: '',
          decrypted,
          summary,
          cookieUpdated: false,
          cookieValid: computeCookieValid(summary),
        }
      }

      if (
        account.qqtAccessToken ||
        account.qqtInfo ||
        account.qqtSignInfo ||
        account.qqtSignResult
      ) {
        nextQqt[account.id] = {
          accessToken: account.qqtAccessToken,
          tokenStatus: account.qqtAccessToken ? 'valid' : 'unknown',
          tokenCheckedAt:
            account.qqtAccessTokenCheckedAt ?? account.updatedAt,
          signInfo: account.qqtSignInfo,
          signResult: account.qqtSignResult,
          signSource: account.qqtSignInfo
            ? 'info'
            : account.qqtSignResult
              ? 'sign'
              : undefined,
          signUpdatedAt: account.qqtSignUpdatedAt,
        }
      }

      const xdr = extractXdrCache(account.xdrReceive)
      if (xdr) {
        nextXdr[account.id] = {
          ...xdr,
          updatedAt: account.xdrReceiveUpdatedAt,
        }
      }
    }

    setActivationById((prev) => ({ ...prev, ...nextActivation }))
    setQqtById((prev) => ({ ...prev, ...nextQqt }))
    setXdrById((prev) => ({ ...prev, ...nextXdr }))
  }

  function patchAccountSummary(id: string, patch: Partial<AccountSummary>) {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === id ? { ...account, ...patch } : account,
      ),
    )
  }

  function getAccountDisplayLabel(account: AccountSummary): string {
    if (account.displayPhone && account.displayPhone.trim()) {
      return account.displayPhone.trim()
    }
    if (account.label && account.label.trim()) return account.label.trim()
    return account.id.slice(0, 8)
  }

  function stopQrPolling() {
    if (qrPollTimerRef.current) {
      window.clearInterval(qrPollTimerRef.current)
      qrPollTimerRef.current = null
    }
  }

  useEffect(() => {
    return () => stopQrPolling()
  }, [])

  useEffect(() => {
    const stored = window.localStorage.getItem('cmcc_qqt_sspid')
    if (stored) setQqtSspid(stored)
  }, [])

  useEffect(() => {
    void (async () => {
      const map = await loadXdrPrizeMap()
      setXdrPrizeMap(map)
    })()
  }, [])

  useEffect(() => {
    if (qqtSspid) {
      window.localStorage.setItem('cmcc_qqt_sspid', qqtSspid)
    } else {
      window.localStorage.removeItem('cmcc_qqt_sspid')
    }
  }, [qqtSspid])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem('cmcc_daily_sign_cache')
      if (!raw) {
        setDailySignCache({})
        todayKeyRef.current = getDayKey()
        return
      }
      const parsed = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object') {
        setDailySignCache({})
        todayKeyRef.current = getDayKey()
        return
      }
      const todayKey = getDayKey()
      const filtered = Object.fromEntries(
        Object.entries(parsed).filter(([, value]) => value === todayKey),
      )
      setDailySignCache(filtered as Record<string, string>)
      todayKeyRef.current = todayKey
    } catch {
      setDailySignCache({})
      todayKeyRef.current = getDayKey()
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(
      'cmcc_daily_sign_cache',
      JSON.stringify(dailySignCache),
    )
  }, [dailySignCache])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handle = window.setInterval(() => {
      const todayKey = getDayKey()
      if (todayKey !== todayKeyRef.current) {
        todayKeyRef.current = todayKey
        setDailySignCache((prev) => {
          const next: Record<string, string> = {}
          for (const [accountId, dateKey] of Object.entries(prev)) {
            if (dateKey === todayKey) {
              next[accountId] = dateKey
            }
          }
          return next
        })
        setQqtById({})
        setXdrById({})
      }
    }, 60_000)
    return () => window.clearInterval(handle)
  }, [])

  useEffect(() => {
    if (initialLoadRef.current) return
    initialLoadRef.current = true
    ;(async () => {
      try {
        const res = await apiFetch('/api/accounts', { method: 'GET' })
        const r = (await res.json()) as ApiResp<{ accounts: AccountSummary[] }>
        if (r.ok) {
          setAccounts(r.data.accounts)
          hydrateCachedState(r.data.accounts)
        }
      } catch {
        // ignore
      }
    })()
  }, [])

  useEffect(() => {
    void refreshPublicLinks()
  }, [])

  useEffect(() => {
    setSelectedAccountIds((prev) =>
      prev.filter((id) => accounts.some((account) => account.id === id)),
    )
  }, [accounts])

  useEffect(() => {
    void loadActiveAdminTask().catch(() => undefined)
    void refreshTaskSchedules().catch(() => undefined)
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = window.setInterval(() => {
      setCooldown((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => window.clearInterval(t)
  }, [cooldown])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2000)
    return () => window.clearTimeout(t)
  }, [toast])

  useEffect(() => {
    if (!error && !success) return
    const t = window.setTimeout(() => {
      setError(null)
      setSuccess(null)
    }, 2600)
    return () => window.clearTimeout(t)
  }, [error, success])

  useEffect(() => {
    if (!activeAdminTask) return
    if (
      activeAdminTask.status !== 'pending' &&
      activeAdminTask.status !== 'running'
    ) {
      void refreshAccounts(activeAccountId || undefined).catch(() => undefined)
      void refreshPublicLinks().catch(() => undefined)
      return
    }
    const t = window.setInterval(() => {
      void loadTaskById(activeAdminTask.id).catch(() => undefined)
    }, 2000)
    return () => window.clearInterval(t)
  }, [activeAdminTask, activeAccountId])

  useEffect(() => {
    void loadActiveAdminTasks().catch(() => undefined)
    const tick = () => {
      void loadActiveAdminTasks().catch(() => undefined)
    }
    const t = window.setInterval(tick, document.hidden ? 12000 : 2500)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem('cmcc_daily_data_cache')
      if (!raw) return
      const parsed = JSON.parse(raw) as {
        day?: string
        qqtById?: Record<string, QqtAccountState>
        xdrById?: Record<
          string,
          { prodList: number[]; enjoycollectabletimes?: number; updatedAt?: string }
        >
      }
      if (!parsed || parsed.day !== getDayKey()) return
      if (parsed.qqtById && typeof parsed.qqtById === 'object') {
        setQqtById(parsed.qqtById)
      }
      if (parsed.xdrById && typeof parsed.xdrById === 'object') {
        setXdrById(parsed.xdrById)
      }
    } catch {
      // ignore cache errors
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const payload = {
      day: getDayKey(),
      qqtById,
      xdrById,
    }
    window.localStorage.setItem(
      'cmcc_daily_data_cache',
      JSON.stringify(payload),
    )
  }, [qqtById, xdrById])

  async function fetchXdrReceive(id: string, opts?: { silent?: boolean }) {
    const cached = xdrById[id]
    if (isTodayIso(cached?.updatedAt)) {
      return
    }
    try {
      const r = await postJson<{ receive: unknown }>(
        `/api/accounts/${id}/qqt/xdr/receive`,
        {},
      )
      if (!r.ok) {
        if (!opts?.silent) setError(r.message || '星动日查询失败')
        return
      }
      const parsed = extractXdrReceive(r.data.receive)
      if (!parsed) return
      setXdrById((prev) => ({
        ...prev,
        [id]: {
          prodList: parsed.prodList,
          enjoycollectabletimes: parsed.enjoycollectabletimes,
          updatedAt: new Date().toISOString(),
        },
      }))
      patchAccountSummary(id, {
        xdrReceive:
          r.data.receive && typeof r.data.receive === 'object'
            ? (r.data.receive as Record<string, unknown>)
            : undefined,
        xdrReceiveUpdatedAt: new Date().toISOString(),
      })
    } catch (e) {
      if (!opts?.silent) {
        const msg = e instanceof Error ? e.message : '星动日查询失败'
        setError(msg)
      }
    }
  }

  async function refreshXdrReceives(list?: AccountSummary[]) {
    const targets = (list ?? accounts).filter(
      (a) => a.hasCookie || a.hasYunpanSession || a.qqtAccessToken || qqtById[a.id]?.accessToken,
    )
    if (targets.length === 0) return
    await Promise.allSettled(
      targets.map((account) => fetchXdrReceive(account.id, { silent: true })),
    )
  }

  async function runWithConcurrency<T>(
    items: T[],
    limit: number,
    worker: (item: T) => Promise<void>,
  ): Promise<void> {
    if (items.length === 0) return
    const concurrency = Math.max(1, Math.min(limit, items.length))
    let cursor = 0
    const runners = Array.from({ length: concurrency }).map(async () => {
      while (cursor < items.length) {
        const idx = cursor
        cursor += 1
        await worker(items[idx])
      }
    })
    await Promise.all(runners)
  }

  async function runSequential<T>(
    items: T[],
    worker: (item: T, index: number) => Promise<void>,
  ): Promise<void> {
    for (let i = 0; i < items.length; i += 1) {
      await worker(items[i], i)
    }
  }

  async function refreshAccountDetails(list?: AccountSummary[]) {
    const targets = (list ?? accounts).filter((a) => a.hasCookie)
    if (targets.length === 0) return
    await runWithConcurrency(targets, 3, async (account) => {
      try {
        await activateAccount(account.id)
        if (qqtSspidValid) {
          await queryQqtSignInfo(account.id, {
            silent: true,
            skipCookieRefresh: true,
            skipRefreshAccounts: true,
          })
        }
        if (!isTodayIso(xdrById[account.id]?.updatedAt)) {
          await fetchXdrReceive(account.id, { silent: true })
        }
      } catch {
        // ignore per-account failures
      }
    })
  }

  async function refreshAccounts(nextSelectedId?: string): Promise<AccountSummary[]> {
    const res = await apiFetch('/api/accounts', { method: 'GET' })
    const r = (await res.json()) as ApiResp<{ accounts: AccountSummary[] }>
    if (!r.ok) throw new Error(r.message || '加载账号失败')
    setAccounts(r.data.accounts)
    hydrateCachedState(r.data.accounts)
    void refreshXdrReceives(r.data.accounts)
    if (nextSelectedId) setActiveAccountId(nextSelectedId)
    return r.data.accounts
  }

  async function loadActiveAdminTask(): Promise<BatchTaskSummary | null> {
    const res = await apiFetch('/api/tasks/active?scopeType=admin_all', { method: 'GET' })
    const r = (await res.json()) as ApiResp<{ task: BatchTaskSummary | null }>
    if (!r.ok) throw new Error(r.message || '加载任务失败')
    setActiveAdminTask(r.data.task ?? null)
    return r.data.task ?? null
  }

  async function loadActiveAdminTasks(): Promise<BatchTaskSummary[]> {
    const res = await apiFetch('/api/tasks/active-list', { method: 'GET' })
    const r = (await res.json()) as ApiResp<{ tasks: BatchTaskSummary[] }>
    if (!r.ok) throw new Error(r.message || '加载后台任务失败')
    setActiveAdminTasks(r.data.tasks)
    setActiveAdminTask((current) => current ?? r.data.tasks[0] ?? null)
    return r.data.tasks
  }

  async function loadTaskById(taskId: string): Promise<BatchTaskSummary | null> {
    const res = await apiFetch(`/api/tasks/${taskId}`, { method: 'GET' })
    const r = (await res.json()) as ApiResp<{ task: BatchTaskSummary }>
    if (!r.ok) throw new Error(r.message || '加载任务失败')
    setActiveAdminTask(r.data.task)
    setActiveAdminTasks((prev) => [r.data.task, ...prev.filter((task) => task.id !== r.data.task.id)])
    setTaskLogModalTask((current) => (current?.id === taskId ? r.data.task : current))
    return r.data.task
  }

  function formatTaskTypeName(type: BatchTaskSummary['type']): string {
    if (type === 'refresh_and_sign') return '刷新+签到+拼图'
    if (type === 'wed_recharge') return '周三拼图'
    if (type === 'yunpan_activate') return '置换云盘全球通 Token'
    if (type === 'ck_maintenance') return 'CK 自动维护'
    if (type === 'activity_session_refresh') return '活动 CK 续期'
    if (type === 'cmcc_session_exchange') return 'CMCC CK 置换'
    if (type === 'keepalive') return '保活'
    if (type === 'query_info') return '查询信息'
    if (type === 'refresh') return '刷新 CK'
    if (type === 'sign') return '签到'
    return type
  }

  function openTaskLogModal(task: BatchTaskSummary) {
    setTaskLogModalTask(task)
    void loadTaskById(task.id).catch(() => undefined)
  }

  async function cancelTask(taskId: string): Promise<void> {
    const r = await postJson<{ task: BatchTaskSummary | null }>(`/api/tasks/${taskId}/cancel`, {})
    if (!r.ok || !r.data.task) {
      setError(r.message || '停止任务失败')
      return
    }
    setActiveAdminTask(r.data.task)
    setActiveAdminTasks((prev) => [r.data.task!, ...prev.filter((task) => task.id !== taskId)])
    setTaskLogModalTask((current) => (current?.id === taskId ? r.data.task : current))
    setSuccess('任务已停止')
  }

  async function startAdminBatchTask(
    type:
      | 'refresh'
      | 'sign'
      | 'refresh_and_sign'
      | 'wed_recharge'
      | 'yunpan_activate'
      | 'ck_maintenance'
      | 'activity_session_refresh'
      | 'cmcc_session_exchange'
      | 'keepalive',
  ): Promise<void> {
    setError(null)
    setSuccess(null)
    const body: Record<string, unknown> = { scopeType: 'admin_all' }
    if (
      type !== 'refresh' &&
      type !== 'wed_recharge' &&
      type !== 'yunpan_activate' &&
      type !== 'ck_maintenance' &&
      type !== 'activity_session_refresh' &&
      type !== 'cmcc_session_exchange' &&
      type !== 'keepalive'
    ) {
      if (!qqtSspid.trim()) {
        setError('请先填写 SSPID')
        return
      }
	      body.sspid = qqtSspid.trim()
	      body.forceDaily = true
	    }
    if (type === 'wed_recharge' || type === 'refresh_and_sign') {
      if (!validateWedRechargeAppTokenInput()) return
      if (type === 'wed_recharge') {
        body.autoTaskList = true
        body.draw = false
      }
      Object.assign(body, buildWedRechargeRequestPayload())
    }
    const r = await postJson<{ task: BatchTaskSummary; reused: boolean }>(
      `/api/tasks/${
        type === 'refresh_and_sign'
          ? 'refresh-and-sign'
          : type === 'wed_recharge'
            ? 'wed-recharge'
            : type === 'activity_session_refresh'
              ? 'activity-session-refresh'
              : type === 'cmcc_session_exchange'
                ? 'cmcc-session-exchange'
                : type === 'yunpan_activate'
                  ? 'yunpan-activate'
                : type === 'ck_maintenance'
                  ? 'ck-maintenance'
                : type === 'keepalive'
                  ? 'keepalive'
                  : type
      }`,
      body,
    )
    if (!r.ok) {
      setError(r.message || '启动任务失败')
      return
    }
    setActiveAdminTask(r.data.task)
    setActiveAdminTasks((prev) => [r.data.task, ...prev.filter((task) => task.id !== r.data.task.id)])
    setSuccess(
      r.data.reused
        ? '已有同类任务正在执行，已为你恢复进度'
        : type === 'wed_recharge'
          ? '周三拼图任务已提交，后台会逐个账号串行执行'
          : type === 'activity_session_refresh'
            ? '活动 CK 续期任务已提交'
            : type === 'cmcc_session_exchange'
              ? 'CMCC CK 置换任务已提交'
              : type === 'yunpan_activate'
                ? '云盘账号 10086 CK 激活任务已提交'
              : type === 'ck_maintenance'
                ? 'CK 自动维护任务已提交'
              : type === 'keepalive'
                ? '保活任务已提交'
              : type === 'refresh_and_sign'
                ? '已开始依次激活CK、更新信息、获取新Token并签到'
                : '任务已提交到服务端执行',
    )
  }

  async function startSelectedBatchTask(
    type:
      | 'refresh'
      | 'refresh_and_sign'
      | 'query_info'
      | 'yunpan_activate'
      | 'ck_maintenance'
      | 'wed_recharge'
      | 'activity_session_refresh'
      | 'cmcc_session_exchange'
      | 'keepalive',
  ): Promise<void> {
    const ids = selectedVisibleAccountIds.length > 0
      ? selectedVisibleAccountIds
      : selectedAccountIds
    const accountIds = Array.from(new Set(ids))
    if (accountIds.length === 0) {
      setError('请先选择要操作的账号')
      return
    }
    setError(null)
    setSuccess(null)
    const body: Record<string, unknown> = {
      scopeType: 'selected_accounts',
      accountIds,
    }
	    if (type === 'refresh_and_sign') {
      if (!qqtSspid.trim()) {
        setError('请先填写 SSPID')
        return
      }
	      body.sspid = qqtSspid.trim()
	      body.forceDaily = true
	    }
    if (type === 'wed_recharge' || type === 'refresh_and_sign') {
      if (!validateWedRechargeAppTokenInput()) return
      if (type === 'wed_recharge') {
        body.autoTaskList = true
        body.draw = false
      }
      Object.assign(body, buildWedRechargeRequestPayload())
    }
    const endpoint =
      type === 'refresh_and_sign'
        ? 'refresh-and-sign'
        : type === 'wed_recharge'
          ? 'wed-recharge'
          : type === 'activity_session_refresh'
            ? 'activity-session-refresh'
          : type === 'cmcc_session_exchange'
            ? 'cmcc-session-exchange'
            : type === 'yunpan_activate'
              ? 'yunpan-activate'
            : type === 'ck_maintenance'
              ? 'ck-maintenance'
            : type === 'keepalive'
                ? 'keepalive'
                : type === 'query_info'
                  ? 'query-info'
                  : 'refresh'
    const r = await postJson<{ task: BatchTaskSummary; reused: boolean }>(
      `/api/tasks/${endpoint}`,
      body,
    )
    if (!r.ok) {
      setError(r.message || '启动批量任务失败')
      return
    }
    setActiveAdminTask(r.data.task)
    setActiveAdminTasks((prev) => [r.data.task, ...prev.filter((task) => task.id !== r.data.task.id)])
    setSuccess(
      r.data.reused
        ? '已有相同批量任务正在执行，已恢复进度'
        : `已提交 ${accountIds.length} 个选中账号的批量任务`,
    )
  }

  async function refreshTaskSchedules(): Promise<void> {
    const res = await apiFetch('/api/tasks/schedules/list', { method: 'GET' })
    const r = (await res.json()) as ApiResp<{ schedules: TaskScheduleSummary[] }>
    if (!r.ok) throw new Error(r.message || '加载计划失败')
    setTaskSchedules(r.data.schedules)
  }

  async function createTaskSchedule(): Promise<void> {
    if (scheduleSaving) return
    setScheduleSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const timesToSave = normalizeScheduleTimes([...scheduleTimes, scheduleTimeInput])
      const r = await postJson<{ schedule: TaskScheduleSummary }>('/api/tasks/schedules', {
        name: scheduleName.trim() || '每日 CK 保活',
        times: timesToSave,
        action: 'keepalive',
        timezone: 'Asia/Shanghai',
      })
      if (!r.ok) {
        setError(r.message || '创建计划失败')
        return
      }
      setScheduleTimeInput('09:00')
      setScheduleTimes([])
      await refreshTaskSchedules()
      setSuccess('服务端定时计划已保存')
    } finally {
      setScheduleSaving(false)
    }
  }

  function addScheduleTime() {
    setScheduleTimes((prev) => normalizeScheduleTimes([...prev, scheduleTimeInput]))
  }

  function removeScheduleTime(target: string) {
    setScheduleTimes((prev) => prev.filter((item) => item !== target))
  }

  async function updateTaskScheduleItem(
    id: string,
    patch: Partial<Pick<TaskScheduleSummary, 'enabled' | 'times' | 'name' | 'sspid'>>,
  ): Promise<void> {
    const res = await apiFetch(`/api/tasks/schedules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...patch,
        times: patch.times,
        sspid: patch.sspid,
      }),
    })
    const r = (await res.json()) as ApiResp<{ schedule: TaskScheduleSummary }>
    if (!r.ok) throw new Error(r.message || '更新计划失败')
    setTaskSchedules((prev) => prev.map((item) => (item.id === id ? r.data.schedule : item)))
  }

  async function deleteTaskScheduleItem(id: string): Promise<void> {
    const res = await apiFetch(`/api/tasks/schedules/${id}`, { method: 'DELETE' })
    const r = (await res.json()) as ApiResp<{ id: string }>
    if (!r.ok) throw new Error(r.message || '删除计划失败')
    setTaskSchedules((prev) => prev.filter((item) => item.id !== id))
  }

  async function ensureAccountId(
    phone: string,
    label?: string,
    allowEmpty = false,
  ): Promise<string> {
    try {
      const r = await postJson<{ account: AccountSummary }>('/api/accounts', {
        phone,
        label: label?.trim() || undefined,
        allowEmpty,
      })
      if (!r.ok) throw new Error(r.message || '添加账号失败')
      setActiveAccountId(r.data.account.id)
      await refreshAccounts(r.data.account.id)
      return r.data.account.id
    } catch {
      throw new Error('网络异常，请重试')
    }
  }

  async function onDeleteAccount(id: string) {
    setError(null)
    setSuccess(null)
    try {
      const res = await apiFetch(`/api/accounts/${id}`, { method: 'DELETE' })
      const r = (await res.json()) as ApiResp<Record<string, never>>
      if (!r.ok) {
        setError(r.message || '失效处理失败')
        return
      }
      if (activeAccountId === id) setActiveAccountId('')
      if (expandedAccountId === id) {
        setExpandedAccountId('')
        setExpandedCookie('')
      }
      setQqtById((prev) => {
        if (!prev[id]) return prev
        const next = { ...prev }
        delete next[id]
        return next
      })
      setHarHintById((prev) => {
        if (!prev[id]) return prev
        const next = { ...prev }
        delete next[id]
        return next
      })
      await refreshAccounts()
      setSelectedAccountIds((prev) => prev.filter((item) => item !== id))
      setSuccess('账号已失效处理')
    } catch {
      setError('网络异常，请重试')
    }
  }

  async function onRemoveAccount(id: string) {
    setError(null)
    setSuccess(null)
    if (!window.confirm('确认永久删除该账号吗？此操作会移除账号及其关联数据。')) {
      return
    }
    try {
      const res = await apiFetch(`/api/accounts/${id}`, { method: 'DELETE' })
      const r = (await res.json()) as ApiResp<Record<string, never>>
      if (!r.ok) {
        setError(r.message || '删除账号失败')
        return
      }
      if (activeAccountId === id) setActiveAccountId('')
      if (expandedAccountId === id) {
        setExpandedAccountId('')
        setExpandedCookie('')
      }
      setQqtById((prev) => {
        if (!prev[id]) return prev
        const next = { ...prev }
        delete next[id]
        return next
      })
      setHarHintById((prev) => {
        if (!prev[id]) return prev
        const next = { ...prev }
        delete next[id]
        return next
      })
      await refreshAccounts()
      setSelectedAccountIds((prev) => prev.filter((item) => item !== id))
      setSuccess('账号已删除')
    } catch {
      setError('网络异常，请重试')
    }
  }

  async function onDisableSelectedAccounts() {
    const ids = Array.from(new Set(selectedAccountIds))
    if (ids.length === 0 || batchDisablingAccounts) return
    if (!window.confirm(`确认将 ${ids.length} 个账号设置为失效吗？后续可从数据库恢复。`)) {
      return
    }
    setBatchDisablingAccounts(true)
    setError(null)
    setSuccess(null)
    try {
      const r = await postJson<{ disabled: string[] }>('/api/accounts/batch/disable', {
        accountIds: ids,
        reason: '账号管理批量失效处理',
      })
      if (!r.ok) {
        setError(r.message || '批量失效处理失败')
        return
      }
      setSelectedAccountIds([])
      await refreshAccounts()
      setSuccess(`已失效处理 ${r.data.disabled.length} 个账号`)
    } catch {
      setError('网络异常，请重试')
    } finally {
      setBatchDisablingAccounts(false)
    }
  }

  async function onDeleteSelectedAccounts() {
    const ids = Array.from(new Set(selectedAccountIds))
    if (ids.length === 0 || batchDeletingAccounts) return
    if (!window.confirm(`确认永久删除选中的 ${ids.length} 个账号吗？此操作会移除账号及其关联数据。`)) {
      return
    }
    setBatchDeletingAccounts(true)
    setError(null)
    setSuccess(null)
    try {
      const r = await postJson<{ deleted: string[] }>('/api/accounts/batch/delete', {
        accountIds: ids,
      })
      if (!r.ok) {
        setError(r.message || '批量删除失败')
        return
      }
      const deletedIds = new Set(r.data.deleted)
      setSelectedAccountIds((prev) => prev.filter((id) => !deletedIds.has(id)))
      if (activeAccountId && deletedIds.has(activeAccountId)) setActiveAccountId('')
      if (expandedAccountId && deletedIds.has(expandedAccountId)) {
        setExpandedAccountId('')
        setExpandedCookie('')
      }
      setQqtById((prev) => {
        const next = { ...prev }
        for (const id of deletedIds) delete next[id]
        return next
      })
      setHarHintById((prev) => {
        const next = { ...prev }
        for (const id of deletedIds) delete next[id]
        return next
      })
      await refreshAccounts()
      setSuccess(`已删除 ${r.data.deleted.length} 个账号`)
    } catch {
      setError('网络异常，请重试')
    } finally {
      setBatchDeletingAccounts(false)
    }
  }

  function openWedRechargePanel(account: AccountSummary) {
    setWedRechargeAccountId(account.id)
    setWedRechargeInfo(account.wedRechargeInfo ?? null)
    setWedRechargeError(null)
    setWedRechargeSuccess(null)
    setWedRechargeTask(null)
  }

  function closeWedRechargePanel() {
    setWedRechargeAccountId(null)
    setWedRechargeInfo(null)
    setWedRechargeError(null)
    setWedRechargeSuccess(null)
    setWedRechargeTask(null)
  }

  function applyWedRechargeInfo(id: string, info?: WedRechargeInfo) {
    if (!info) return
    setWedRechargeInfo(info)
    patchAccountSummary(id, {
      wedRechargeInfo: info,
      wedRechargeUpdatedAt: info.updatedAt,
    })
  }

  function buildWedRechargeAppTokenLoginInput(): Record<string, unknown> | undefined {
    const raw = appTokenInput.trim()
    const activitySidInput = appTokenActivitySid.trim()
    let sid = activitySidInput
    let activityUrl = ''
    if (activitySidInput.includes('://')) {
      activityUrl = activitySidInput
      try {
        const parsed = new URL(activitySidInput)
        sid = parsed.searchParams.get('sid')?.trim() || parsed.searchParams.get('token')?.trim() || ''
      } catch {
        sid = ''
      }
    }
    const fallback: Record<string, unknown> = {
      token: raw,
      sid,
      activityUrl,
      userCheckId: appTokenUserCheckId.trim(),
    }
    if (!raw) return sid || activityUrl ? { sid, activityUrl, userCheckId: appTokenUserCheckId.trim() } : undefined
    try {
      const parsed = JSON.parse(raw) as unknown
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const obj = parsed as Record<string, unknown>
        const parsedActivityUrl =
          typeof obj.activityUrl === 'string' && obj.activityUrl.trim()
            ? obj.activityUrl.trim()
            : activityUrl
        const parsedSid =
          typeof obj.sid === 'string' && obj.sid.trim()
            ? obj.sid.trim()
            : sid
        const postBody =
          obj.postBody && typeof obj.postBody === 'object' && !Array.isArray(obj.postBody)
            ? (obj.postBody as Record<string, unknown>)
            : obj
        const parsedToken =
          typeof obj.token === 'string' && obj.token.trim()
            ? obj.token.trim()
            : typeof postBody.token === 'string' && postBody.token.trim()
              ? postBody.token.trim()
              : raw
        return {
          ...obj,
          token: parsedToken,
          postBody,
          sid: parsedSid,
          loginUrl: typeof obj.loginUrl === 'string' && obj.loginUrl.trim() ? obj.loginUrl.trim() : undefined,
          activityUrl: parsedActivityUrl,
          userCheckId:
            typeof obj.userCheckId === 'string' && obj.userCheckId.trim()
              ? obj.userCheckId.trim()
              : appTokenUserCheckId.trim(),
        }
      }
    } catch {
      // Plain cookie-style token input.
    }
    return fallback
  }

  function validateWedRechargeAppTokenInput(): boolean {
    if (!wedRechargeUseAppToken) return true
    const appTokenLogin = buildWedRechargeAppTokenLoginInput()
    const appToken = String(appTokenLogin?.token || '').trim()
    const sid = String(appTokenLogin?.sid || '').trim()
    const loginUrl = String(appTokenLogin?.loginUrl || '').trim()
    const activityUrl = String(appTokenLogin?.activityUrl || '').trim()
    if (!appToken) {
      setWedRechargeError('请先填写 App token，再参加周三拼图')
      return false
    }
    if (!sid && !loginUrl && !activityUrl) {
      setWedRechargeError('请填写活动 sid/token，或粘贴带 sid/token 参数的活动 URL')
      return false
    }
    return true
  }

  function buildWedRechargeRequestPayload(): Record<string, unknown> {
    return { useAppToken: false }
  }

  async function importWedRechargeHar(file: File): Promise<void> {
    try {
      const text = await file.text()
      const har = JSON.parse(text) as {
        log?: {
          entries?: Array<{
            request?: {
              url?: string
              postData?: { text?: string }
            }
          }>
        }
      }
      let sid = ''
      let loginUrl = ''
      let appTokenBody: Record<string, unknown> | undefined
      for (const entry of har.log?.entries ?? []) {
        const url = entry.request?.url || ''
        if (!sid && url.includes('/qwhdsso/appTokenLogin')) {
          try {
            const parsed = new URL(url)
            sid = parsed.searchParams.get('sid')?.trim() || ''
            loginUrl = url
          } catch {
            sid = ''
          }
        }
        if (!sid && url.includes('/act-wedrecharge/')) {
          try {
            const parsed = new URL(url)
            sid = parsed.searchParams.get('sid')?.trim() || parsed.searchParams.get('token')?.trim() || ''
          } catch {
            sid = ''
          }
        }
        const postText = entry.request?.postData?.text
        if (!appTokenBody && postText && url.includes('/qwhdsso/appTokenLogin')) {
          try {
            const parsed = JSON.parse(postText) as unknown
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
              appTokenBody = parsed as Record<string, unknown>
            }
          } catch {
            appTokenBody = undefined
          }
        }
      }
      if (appTokenBody) {
        setAppTokenInput(JSON.stringify({ ...appTokenBody, sid, loginUrl, postBody: appTokenBody }, null, 2))
        if (typeof appTokenBody.userCheckId === 'string') setAppTokenUserCheckId(appTokenBody.userCheckId)
      }
      if (sid) setAppTokenActivitySid(sid)
      if (!sid && !appTokenBody) {
        setWedRechargeError('HAR 中未找到 appTokenLogin 请求')
        return
      }
      setWedRechargeUseAppToken(true)
      setWedRechargeError(null)
      setWedRechargeSuccess('已从 HAR 导入 appTokenLogin 参数')
    } catch {
      setWedRechargeError('HAR 解析失败，请检查文件内容')
    }
  }

  async function queryWedRecharge(
    id: string,
    opts?: { silentSuccess?: boolean },
  ) {
    setWedRechargeLoading('query')
    setWedRechargeError(null)
    setWedRechargeSuccess(null)
    try {
      const r = await postJson<{ info: WedRechargeInfo }>(
        `/api/accounts/${id}/wed-recharge/query`,
        { useAppToken: false },
      )
      if (!r.ok) {
        setWedRechargeError(r.message || '查询失败')
        return
      }
      applyWedRechargeInfo(id, r.data.info)
      if (!opts?.silentSuccess) setWedRechargeSuccess('碎片情况已刷新')
    } catch {
      setWedRechargeError('网络异常，请重试')
    } finally {
      setWedRechargeLoading(null)
    }
  }

  async function runWedRecharge(id: string) {
    await startWedRechargeTask(id, false, 'run')
  }

  async function startWedRechargeTask(
    id: string,
    draw: boolean,
    mode: 'add' | 'run',
  ) {
    setWedRechargeLoading(mode)
    setWedRechargeError(null)
    setWedRechargeSuccess(null)
    try {
      const r = await postJson<{ task: BatchTaskSummary; reused: boolean }>(
        `/api/accounts/${id}/wed-recharge/start`,
        {
          autoTaskList: true,
          draw,
          ...buildWedRechargeRequestPayload(),
        },
      )
      if (!r.ok) {
        setWedRechargeError(r.message || '启动任务失败')
        return
      }
      setWedRechargeSuccess(
        r.data.reused
          ? '已有周三拼图任务正在执行，已恢复进度'
          : '任务已进入后台队列，页面可继续操作其他账号',
      )
      setWedRechargeTask(r.data.task)
      void pollWedRechargeTask(id, r.data.task.id)
    } catch {
      setWedRechargeError('网络异常，请重试')
    } finally {
      setWedRechargeLoading(null)
    }
  }

  async function pollWedRechargeTask(accountId: string, taskId: string) {
    for (let i = 0; i < 180; i += 1) {
      try {
        const res = await apiFetch(`/api/tasks/${taskId}`, { method: 'GET' })
        const r = (await res.json()) as ApiResp<{ task: BatchTaskSummary }>
        if (r.ok) {
          setWedRechargeTask(r.data.task)
          const done = !['pending', 'running'].includes(r.data.task.status)
          if (done) {
            await queryWedRecharge(accountId, { silentSuccess: true }).catch(() => undefined)
            setWedRechargeSuccess(r.data.task.message || '周三拼图任务已完成')
            return
          }
        }
      } catch {
        // 后台任务仍会继续跑，轮询失败时下一轮再补。
      }
      await new Promise((resolve) => window.setTimeout(resolve, 2000))
    }
  }

  async function fetchCookieForAccount(id: string): Promise<string> {
    const res = await apiFetch(`/api/accounts/${id}/cookie`, { method: 'GET' })
    const r = (await res.json()) as ApiResp<{ cookie: string }>
    if (!r.ok) throw new Error(r.message || '暂无 Cookie')
    return r.data.cookie
  }

  async function activateAccount(id: string): Promise<boolean> {
    return activateAccountInternal(id)
  }

  async function activateAccountInternal(
    id: string,
    opts?: { suppressInvalidPush?: boolean },
  ): Promise<boolean> {
    const account = accounts.find((item) => item.id === id)
    const cachedActivation = activationById[id]
    const activationFresh =
      Boolean(account?.activationCheckedAt) &&
      Boolean(account?.cookieUpdatedAt) &&
      new Date(account.activationCheckedAt || 0).getTime() >=
        new Date(account.cookieUpdatedAt || 0).getTime()
    if (cachedActivation?.status === 'ok' && activationFresh) {
      return cachedActivation.cookieValid === true
    }
    setActivationById((s) => ({ ...s, [id]: { status: 'loading' } }))
    try {
      const res = await apiFetch(`/api/accounts/${id}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suppressInvalidPush: opts?.suppressInvalidPush === true,
        }),
      })
      const r = (await res.json()) as ApiResp<{
        encrypted: string
        decrypted: string
        cookieUpdated: boolean
        phoneUpdated?: boolean
      }>
      if (!r.ok) throw new Error(r.message || '激活失败')
      setHarHintById((s) => {
        if (!s[id]) return s
        const next = { ...s }
        delete next[id]
        return next
      })
      const summary = parseActivationSummary(r.data.decrypted)
      const cookieValid = computeCookieValid(summary)
      setActivationById((s) => ({
        ...s,
        [id]: {
          status: 'ok',
          decrypted: r.data.decrypted,
          encrypted: r.data.encrypted,
          cookieUpdated: Boolean(r.data.cookieUpdated),
          summary,
          cookieValid,
        },
      }))
      patchAccountSummary(id, {
        activationInfo: parseObjectRecord(r.data.decrypted),
        activationCheckedAt: new Date().toISOString(),
      })
      if (r.data.cookieUpdated || r.data.phoneUpdated) await refreshAccounts(id)
      return cookieValid === true
    } catch (e) {
      const msg = e instanceof Error ? e.message : '激活失败'
      setActivationById((s) => ({
        ...s,
        [id]: { status: 'error', message: msg },
      }))
      await refreshAccounts(id).catch(() => undefined)
      if (shouldPromptHar(msg)) {
        setHarHintById((s) => ({ ...s, [id]: 'newHome 失效，请重新导入 HAR' }))
      }
      return false
    }
  }

  async function refreshAccountInternal(
    id: string,
    opts?: {
      silent?: boolean
      includeQqtLifecycle?: boolean
      suppressInvalidPush?: boolean
    },
  ): Promise<boolean> {
    const silent = opts?.silent ?? false
    const includeQqtLifecycle = opts?.includeQqtLifecycle ?? true
    if (!silent) {
      setError(null)
      setSuccess(null)
    }
    setRefreshingById((s) => ({ ...s, [id]: true }))
    let success = false
    try {
      const res = await apiFetch(`/api/accounts/${id}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          force: opts?.includeQqtLifecycle === true,
          suppressInvalidPush: opts?.suppressInvalidPush === true,
        }),
      })
      const r = (await res.json()) as ApiResp<{
        cookie: string
        cookieUpdated: boolean
      }>
      if (!r.ok) {
        const msg = r.message || '刷新失败'
        const err = r as ApiErr
        if (err.errorCode === 'COOKIE_INVALID_CLEARED') {
          await refreshAccounts()
          setActivationById((s) => ({
            ...s,
            [id]: { status: 'error', message: msg },
          }))
          setError(msg)
          return false
        }
        if (shouldPromptHar(msg)) {
          setHarHintById((s) => ({
            ...s,
            [id]: 'newHome 失效，请重新导入 HAR',
          }))
        }
        if (!silent) setError(msg)
        return false
      }
      setHarHintById((s) => {
        if (!s[id]) return s
        const next = { ...s }
        delete next[id]
        return next
      })
      if (expandedAccountId === id) {
        setExpandedCookie(r.data.cookie)
      }
      if (r.data.cookieUpdated) {
        await refreshAccounts(silent ? undefined : id)
        if (!silent) setSuccess('Cookie 已刷新')
      } else if (!silent) {
        setSuccess('Cookie 无需更新')
      }
      success = true
    } catch (e) {
      const msg = e instanceof Error ? e.message : '刷新失败'
      if (!silent) setError(msg)
      if (shouldPromptHar(msg)) {
        setHarHintById((s) => ({ ...s, [id]: 'newHome 失效，请重新导入 HAR' }))
      }
      success = false
    } finally {
      setRefreshingById((s) => ({ ...s, [id]: false }))
    }
    if (success) {
      const activated = await activateAccountInternal(id, {
        suppressInvalidPush: opts?.suppressInvalidPush,
      })
      if (includeQqtLifecycle && activated) {
        await refreshQqtToken(id, {
          silent: true,
          skipCookieRefresh: true,
          force: true,
        })
        await ensureQqtLifecycle(id, { silent: true, skipCookieRefresh: true })
      }
    }
    return success
  }

  async function refreshAccount(id: string): Promise<boolean> {
    return refreshAccountInternal(id)
  }

  async function runAccountToolboxAction(
    id: string,
    action:
      | 'activate'
      | 'sign'
      | 'refresh'
      | 'relogin'
      | 'yunpanRefresh'
      | 'activity'
      | 'cmcc'
      | 'jump10086'
      | 'business'
      | 'shopBusiness'
      | 'legacyBusiness'
      | 'wed'
      | 'assign'
      | 'disable'
      | 'remove',
  ): Promise<void> {
    if (action === 'activate') {
      const account = accounts.find((item) => item.id === id)
      if (!account?.hasCookie) return
      setExpandedAccountId(id)
      try {
        const cookie = await fetchCookieForAccount(id)
        setExpandedCookie(cookie)
      } catch {
        setExpandedCookie('')
      }
      await activateAccount(id)
      return
    }
    if (action === 'sign') {
      await signQqtAccount(id)
      return
    }
    if (action === 'refresh') {
      await refreshAccount(id)
      return
    }
    if (action === 'relogin') {
      const account = accounts.find((item) => item.id === id)
      if (account) openLoginDialog(account)
      return
    }
    if (action === 'yunpanRefresh') {
      await refreshByYunpan(id)
      return
    }
    if (action === 'activity') {
      await runSessionBridge(id, 'activity')
      return
    }
    if (action === 'cmcc') {
      await runSessionBridge(id, 'cmcc')
      return
    }
    if (action === 'jump10086') {
      setError(null)
      setSuccess(null)
      try {
        const r = await postJson<{ ssoUrl: string; ssoToken: string }>(
          `/api/accounts/${id}/yunpan/sso-link`,
          {},
        )
        if (!r.ok) throw new Error(r.message || '生成 86 优惠商城跳转链接失败')
        await copyText(r.data.ssoUrl)
        setSuccess('86 优惠商城链接已生成并复制')
      } catch (e) {
        setError(e instanceof Error ? e.message : '生成 86 优惠商城跳转链接失败')
      }
      return
    }
    if (action === 'business') {
      window.location.href = `/business-query?accountId=${encodeURIComponent(id)}`
      return
    }
    if (action === 'shopBusiness') {
      window.location.href = `/shop-query?accountId=${encodeURIComponent(id)}`
      return
    }
    if (action === 'legacyBusiness') {
      window.location.href = `/legacy-business-query?accountId=${encodeURIComponent(id)}&returnTo=${encodeURIComponent('/')}`
      return
    }
    if (action === 'wed') {
      const account = accounts.find((item) => item.id === id)
      if (account) openWedRechargePanel(account)
      return
    }
    if (action === 'assign') {
      await openAssignLinkModal(id)
      return
    }
    if (action === 'disable') {
      await onDeleteAccount(id)
      return
    }
    if (action === 'remove') {
      await onRemoveAccount(id)
    }
  }

  async function runSessionBridge(
    id: string,
    action: 'activity' | 'cmcc',
  ): Promise<boolean> {
    setError(null)
    setSuccess(null)
    setSessionBusyById((s) => ({ ...s, [id]: action }))
    try {
      const endpoint =
        action === 'activity' ? 'refresh-activity' : 'exchange-cmcc'
      const r = await postJson<SessionBridgeResp>(
        `/api/accounts/${id}/session/${endpoint}`,
        {},
      )
      if (!r.ok) throw new Error(r.message || '会话处理失败')
      if (expandedAccountId === id) {
        setExpandedCookie(r.data.cookie)
      }
      await refreshAccounts(id)
      await inspectSessionCapability(id, { silent: true })
      const fields = r.data.fields?.length ? `（${r.data.fields.join(', ')}）` : ''
      setSuccess(
        action === 'activity'
          ? `活动 CK 续期完成${fields}`
          : `CMCC CK 置换完成${fields}`,
      )
      return true
    } catch (e) {
      const msg = e instanceof Error ? e.message : '会话处理失败'
      setError(msg)
      return false
    } finally {
      setSessionBusyById((s) => ({ ...s, [id]: undefined }))
    }
  }

  async function inspectSessionCapability(
    id: string,
    opts?: { silent?: boolean },
  ): Promise<SessionCapabilities | undefined> {
    if (!opts?.silent) {
      setError(null)
      setSuccess(null)
    }
    setSessionCapabilityLoadingById((s) => ({ ...s, [id]: true }))
    try {
      const res = await apiFetch(`/api/accounts/${id}/session/capabilities`, {
        method: 'GET',
      })
      const r = (await res.json()) as ApiResp<SessionCapabilities>
      if (!r.ok) throw new Error(r.message || '检测会话能力失败')
      setSessionCapabilitiesById((s) => ({ ...s, [id]: r.data }))
      if (!opts?.silent) setSuccess(r.data.summary)
      return r.data
    } catch (e) {
      const msg = e instanceof Error ? e.message : '检测会话能力失败'
      if (!opts?.silent) setError(msg)
      return undefined
    } finally {
      setSessionCapabilityLoadingById((s) => ({ ...s, [id]: false }))
    }
  }

  async function refreshAllAccounts(list?: AccountSummary[]): Promise<void> {
    if (refreshAllInProgress) return
    const targets = (list ?? accounts).filter((a) => a.hasCookie)
    if (targets.length === 0) return
    setError(null)
    setSuccess(null)
    setRefreshAllInProgress(true)
    setRefreshBatchProgress({
      total: targets.length,
      completed: 0,
      currentIndex: 0,
      currentLabel: '-',
    })
    try {
      await runSequential(targets, async (account, index) => {
        setRefreshBatchProgress({
          total: targets.length,
          completed: index,
          currentIndex: index + 1,
          currentLabel: getAccountDisplayLabel(account),
        })
        await refreshAccountInternal(account.id, { silent: true })
        setRefreshBatchProgress({
          total: targets.length,
          completed: index + 1,
          currentIndex: index + 1,
          currentLabel: getAccountDisplayLabel(account),
        })
      })
      await refreshAccounts(activeAccountId || undefined)
      setSuccess('账号已按顺序刷新完成')
    } finally {
      setRefreshAllInProgress(false)
      setRefreshBatchProgress(null)
    }
  }

  async function refreshAllCookiesThenTokens(list?: AccountSummary[]): Promise<void> {
    if (refreshAllInProgress || tokenRefreshingAll) return
    const baseAccounts = list ?? accounts
    const targets = baseAccounts.filter((a) => a.hasCookie)
    if (targets.length === 0) return
    setError(null)
    setSuccess(null)
    setRefreshAllInProgress(true)
    setRefreshBatchProgress({
      total: targets.length,
      completed: 0,
      currentIndex: 0,
      currentLabel: '-',
    })
    try {
      await runSequential(targets, async (account, index) => {
        setRefreshBatchProgress({
          total: targets.length,
          completed: index,
          currentIndex: index + 1,
          currentLabel: getAccountDisplayLabel(account),
        })
        await refreshAccountInternal(account.id, {
          silent: true,
          includeQqtLifecycle: true,
          suppressInvalidPush: true,
        })
        setRefreshBatchProgress({
          total: targets.length,
          completed: index + 1,
          currentIndex: index + 1,
          currentLabel: getAccountDisplayLabel(account),
        })
      })
      await refreshAccounts(activeAccountId || undefined)
      try {
        await pushOperationSummary('一键刷新汇总')
      } catch {
        // ignore push failure
      }
      setSuccess('Cookie、Token 与签到状态已按顺序更新')
    } catch (e) {
      const msg = e instanceof Error ? e.message : '刷新失败'
      setError(msg)
    } finally {
      setRefreshAllInProgress(false)
      setRefreshBatchProgress(null)
    }
  }

  function isAccountCookieValid(id: string): boolean {
    const activation = activationById[id]
    if (!activation || activation.status !== 'ok') return false
    return computeCookieValid(activation.summary) === true
  }

  async function ensureCookieValidForQqtAction(
    id: string,
    opts?: { skipRefresh?: boolean },
  ): Promise<void> {
    const account = accounts.find((item) => item.id === id)
    if (!account?.hasCookie || account.hasYunpanSession) return
    if (opts?.skipRefresh) return
    if (isAccountCookieValid(id)) return
    const refreshed = await refreshAccountInternal(id, {
      silent: true,
      includeQqtLifecycle: false,
    })
    if (!refreshed) {
      throw new Error('Cookie 无法刷新')
    }
  }

  async function cleanupInvalidAccounts() {
    if (cleanupInProgress) return
    setCleanupInProgress(true)
    setError(null)
    setSuccess(null)
    try {
      const r = await postJson<{
        deleted: number
        kept: number
        refreshed: number
      }>('/api/accounts/cleanup/invalid', {})
      if (!r.ok) throw new Error(r.message || '清理失败')
      await refreshAccounts()
      setSuccess(
        `已清理无效 CK：清空 ${r.data.deleted} 个，保留 ${r.data.kept} 个`,
      )
    } catch (e) {
      const msg = e instanceof Error ? e.message : '清理失败'
      setError(msg)
    } finally {
      setCleanupInProgress(false)
    }
  }

  async function cleanupDuplicateAccounts() {
    if (dedupInProgress) return
    setDedupInProgress(true)
    setError(null)
    setSuccess(null)
    try {
      const r = await postJson<{
        groups: number
        deleted: number
        deletedIds: string[]
      }>('/api/accounts/cleanup/duplicates', {})
      if (!r.ok) throw new Error(r.message || '去重失败')
      await refreshAccounts()
      setSuccess(`账号去重完成：命中 ${r.data.groups} 组，删除 ${r.data.deleted} 个`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '去重失败'
      setError(msg)
    } finally {
      setDedupInProgress(false)
    }
  }

  function hasSignedToday(id: string): boolean {
    return dailySignCache[id] === getDayKey()
  }

  function markSignedToday(id: string): void {
    const todayKey = getDayKey()
    setDailySignCache((prev) => {
      const filtered = Object.fromEntries(
        Object.entries(prev).filter(([, dateKey]) => dateKey === todayKey),
      ) as Record<string, string>
      if (filtered[id] === todayKey) return filtered
      return { ...filtered, [id]: todayKey }
    })
  }

  function updateQqtState(id: string, patch: Partial<QqtAccountState>) {
    setQqtById((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  async function refreshQqtToken(
    id: string,
    opts?: { silent?: boolean; skipCookieRefresh?: boolean; force?: boolean },
  ): Promise<string | undefined> {
    updateQqtState(id, { loading: 'token', error: undefined })
    const now = new Date().toISOString()
    try {
      if (!opts?.skipCookieRefresh) {
        await ensureCookieValidForQqtAction(id)
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Cookie 无效'
      updateQqtState(id, {
        loading: undefined,
        error: msg,
        tokenStatus: 'invalid',
        tokenCheckedAt: now,
      })
      if (!opts?.silent) setError(msg)
      return undefined
    }

    try {
      const r = await postJson<{
        accessToken: string
        userInfo?: Record<string, unknown>
      }>(`/api/accounts/${id}/qqt/token`, {
        force: opts?.force === true,
      })
      if (!r.ok) throw new Error(r.message || '获取 token 失败')
      updateQqtState(id, {
        accessToken: r.data.accessToken,
        tokenStatus: 'valid',
        tokenCheckedAt: now,
        loading: undefined,
        error: undefined,
      })
      setAccounts((prev) =>
        prev.map((account) =>
          account.id === id
            ? {
                ...account,
                qqtAccessToken: r.data.accessToken,
                qqtInfo: r.data.userInfo ?? account.qqtInfo,
              }
            : account,
        ),
      )
      if (!opts?.silent) setSuccess('Token 已更新')
      return r.data.accessToken
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取 token 失败'
      updateQqtState(id, {
        loading: undefined,
        error: msg,
        tokenStatus: 'invalid',
        tokenCheckedAt: now,
      })
      if (!opts?.silent) setError(msg)
      return undefined
    }
  }

  async function ensureQqtLifecycle(
    id: string,
    opts?: {
      silent?: boolean
      skipCookieRefresh?: boolean
      skipRefreshAccounts?: boolean
    },
  ) {
    if (!qqtSspidValid) return
    const silent = opts?.silent ?? true
    const cached = qqtById[id]
    const cachedXdr = xdrById[id]
    if (
      cached?.accessToken &&
      isTodayIso(cached.signUpdatedAt) &&
      isTodayIso(cachedXdr?.updatedAt)
    ) {
      return
    }
    let alreadySigned = false
    let infoLoaded = false
    let tokenReady = Boolean(cached?.accessToken)
    try {
      const queryResult = await queryQqtSignInfo(id, {
        silent,
        skipCookieRefresh: opts?.skipCookieRefresh,
        skipRefreshAccounts: opts?.skipRefreshAccounts,
      })
      alreadySigned = Boolean(queryResult)
      infoLoaded = queryResult !== undefined
    } catch {
      alreadySigned = false
    }
    if (!infoLoaded && !cached?.accessToken) {
      const refreshedToken = await refreshQqtToken(id, {
        silent: true,
        skipCookieRefresh: opts?.skipCookieRefresh,
      })
      tokenReady = Boolean(refreshedToken)
    }
    if (!infoLoaded && !tokenReady) {
      return
    }
    if (!alreadySigned) {
      await signQqtAccount(id, {
        silent: true,
        skipCookieRefresh: opts?.skipCookieRefresh,
      })
    }
    if (!isTodayIso(xdrById[id]?.updatedAt)) {
      await fetchXdrReceive(id, { silent: true })
    }
  }

  async function signQqtAccount(
    id: string,
    opts?: { silent?: boolean; skipCookieRefresh?: boolean; force?: boolean },
  ) {
    if (!qqtSspidValid) {
      if (!opts?.silent) updateQqtState(id, { error: '请输入 SSPID' })
      return
    }
    const account = accounts.find((item) => item.id === id)
    const existing = qqtById[id]
    if (!opts?.force && hasSignedToday(id)) {
      if (!opts?.silent) {
        updateQqtState(id, { error: undefined })
        setSuccess('今日已签到，无需重复执行')
      }
      return
    }
    if (!opts?.force && isTodayIso(existing?.signUpdatedAt) && existing?.signInfo) {
      markSignedToday(id)
      updateQqtState(id, { loading: undefined, error: undefined })
      return true
    }
    updateQqtState(id, { loading: 'sign', error: undefined })
    const now = new Date().toISOString()
    try {
      if (!opts?.skipCookieRefresh) {
        await ensureCookieValidForQqtAction(id)
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Cookie 无效'
      updateQqtState(id, {
        loading: undefined,
        error: msg,
        tokenStatus: 'invalid',
        tokenCheckedAt: now,
      })
      if (!opts?.silent) setError(msg)
      return
    }
    let accessToken =
      existing?.accessToken || account?.qqtAccessToken || undefined
    const tokenCheckedAt = existing?.tokenCheckedAt
    const cookieUpdatedAt = account?.cookieUpdatedAt
    const shouldRefreshToken =
      Boolean(account?.hasCookie || account?.hasYunpanSession) &&
      (!accessToken ||
        !tokenCheckedAt ||
        (cookieUpdatedAt &&
          tokenCheckedAt &&
          new Date(cookieUpdatedAt).getTime() >
            new Date(tokenCheckedAt).getTime()))
    if (shouldRefreshToken) {
      const newToken = await refreshQqtToken(id, {
        silent: true,
        skipCookieRefresh: true,
        force: true,
      })
      accessToken = newToken || undefined
    }
    let triedFallback = false
    while (true) {
      try {
        const r = await postJson<{ accessToken: string; result: unknown }>(
          `/api/accounts/${id}/qqt/sign`,
          {
            sspid: qqtSspid.trim(),
            accessToken,
          },
        )
        if (!r.ok) throw new Error(r.message || '签到失败')
      updateQqtState(id, {
        accessToken: r.data.accessToken,
        signResult: r.data.result,
        signSource: 'sign',
        signUpdatedAt: now,
        tokenStatus: 'valid',
        tokenCheckedAt: now,
        loading: undefined,
        error: undefined,
      })
      patchAccountSummary(id, {
        qqtAccessToken: r.data.accessToken,
        qqtSignResult:
          r.data.result && typeof r.data.result === 'object'
            ? (r.data.result as Record<string, unknown>)
            : undefined,
        qqtSignInfo:
          existing?.signInfo && typeof existing.signInfo === 'object'
            ? (existing.signInfo as Record<string, unknown>)
            : undefined,
        qqtSignUpdatedAt: now,
      })
      markSignedToday(id)
      return
      } catch (e) {
        const msg = e instanceof Error ? e.message : '签到失败'
        const invalid = isTokenInvalidMessage(msg)
        if (invalid && !triedFallback) {
          triedFallback = true
          const newToken = await refreshQqtToken(id, {
            silent: true,
            skipCookieRefresh: true,
            force: true,
          })
          accessToken = newToken || undefined
          continue
        }
        updateQqtState(id, {
          loading: undefined,
          error: msg,
          tokenStatus: invalid ? 'invalid' : existing?.tokenStatus,
          tokenCheckedAt: invalid ? now : existing?.tokenCheckedAt,
        })
        return false
      }
    }
  }

  async function queryQqtSignInfo(
    id: string,
    opts?: {
      silent?: boolean
      skipCookieRefresh?: boolean
      skipRefreshAccounts?: boolean
    },
  ): Promise<boolean> {
    if (!qqtSspidValid) {
      if (!opts?.silent) updateQqtState(id, { error: '请输入 SSPID' })
      return false
    }
    const existing = qqtById[id]
    if (isTodayIso(existing?.signUpdatedAt) && existing?.signInfo) {
      const summary = parseQqtSignSummary(existing.signInfo)
      const signed =
        !!summary &&
        (summary.statusText === '成功' ||
          summary.statusText === '已签到' ||
          summary.message?.includes('已签到'))
      if (signed) {
        markSignedToday(id)
      }
      return signed
    }
    updateQqtState(id, { loading: 'info', error: undefined })
    const now = new Date().toISOString()
    let accessToken = existing?.accessToken || undefined
    const account = accounts.find((item) => item.id === id)
    const tokenCheckedAt = existing?.tokenCheckedAt
    const cookieUpdatedAt = account?.cookieUpdatedAt
    const shouldRefreshToken =
      Boolean(account?.hasCookie) &&
      (!accessToken ||
        !tokenCheckedAt ||
        (cookieUpdatedAt &&
          tokenCheckedAt &&
          new Date(cookieUpdatedAt).getTime() >
            new Date(tokenCheckedAt).getTime()))
    if (shouldRefreshToken) {
      const newToken = await refreshQqtToken(id, {
        silent: true,
        skipCookieRefresh: true,
        force: true,
      })
      accessToken = newToken || undefined
    }
    let triedFallback = false
    while (true) {
      try {
        if (!opts?.skipCookieRefresh) {
          await ensureCookieValidForQqtAction(id)
        }
        const r = await postJson<{ accessToken: string; info: unknown }>(
          `/api/accounts/${id}/qqt/info`,
          {
            sspid: qqtSspid.trim(),
            accessToken,
          },
        )
        if (!r.ok) throw new Error(r.message || '查询失败')
        updateQqtState(id, {
          accessToken: r.data.accessToken,
          signInfo: r.data.info,
          signSource: 'info',
          signUpdatedAt: now,
          tokenStatus: 'valid',
          tokenCheckedAt: now,
          loading: undefined,
          error: undefined,
        })
        patchAccountSummary(id, {
          qqtAccessToken: r.data.accessToken,
          qqtInfo:
            r.data.info && typeof r.data.info === 'object'
              ? (r.data.info as Record<string, unknown>)
              : undefined,
          qqtSignInfo:
            r.data.info && typeof r.data.info === 'object'
              ? (r.data.info as Record<string, unknown>)
              : undefined,
          qqtSignUpdatedAt: now,
        })
        const summary = parseQqtSignSummary(r.data.info)
        const signed =
          !!summary &&
          (summary.statusText === '成功' ||
            summary.statusText === '已签到' ||
            summary.message?.includes('已签到'))
        if (signed) {
          markSignedToday(id)
        }
        return signed
      } catch (e) {
        const msg = e instanceof Error ? e.message : '查询失败'
        const invalid = isTokenInvalidMessage(msg)
        if (invalid && !triedFallback) {
          triedFallback = true
          const newToken = await refreshQqtToken(id, {
            silent: true,
            skipCookieRefresh: true,
            force: true,
          })
          accessToken = newToken || undefined
          continue
        }
        updateQqtState(id, {
          loading: undefined,
          error: msg,
          tokenStatus: invalid ? 'invalid' : existing?.tokenStatus,
          tokenCheckedAt: invalid ? now : existing?.tokenCheckedAt,
        })
        return
      }
    }
  }

  async function signAllAccounts() {
    if (signAllInProgress) return
    const allTargets = accounts.filter(
      (a) => a.hasCookie || a.hasYunpanSession || a.qqtAccessToken || qqtById[a.id]?.accessToken,
    )
    if (allTargets.length === 0) return
    if (!qqtSspidValid) {
      setError('请先填写 SSPID')
      return
    }
    const targets = allTargets
    setError(null)
    setSignAllInProgress(true)
    setSignBatchProgress({
      total: targets.length,
      completed: 0,
      currentIndex: 0,
      currentLabel: '-',
    })
    try {
      await runSequential(targets, async (account, index) => {
        setSignBatchProgress({
          total: targets.length,
          completed: index,
          currentIndex: index + 1,
          currentLabel: getAccountDisplayLabel(account),
        })
        await signQqtAccount(account.id, { silent: true, force: true })
        setSignBatchProgress({
          total: targets.length,
          completed: index + 1,
          currentIndex: index + 1,
          currentLabel: getAccountDisplayLabel(account),
        })
      })
      await refreshAccounts(activeAccountId || undefined)
      try {
        await pushOperationSummary('一键签到汇总')
      } catch {
        // ignore push failure
      }
      setSuccess('账号已按顺序签到完成')
    } finally {
      setSignAllInProgress(false)
      setSignBatchProgress(null)
    }
  }

  async function refreshAllQqtTokens(opts?: {
    silent?: boolean
    suppressSuccess?: boolean
    skipCookieRefresh?: boolean
  }) {
    if (tokenRefreshingAll) return
    const targets = accounts.filter((a) => a.hasCookie)
    if (targets.length === 0) return
    setTokenRefreshingAll(true)
    try {
      const r = await postJson<{
        total: number
        success: number
        failed: number
      }>('/api/worker/refresh-tokens', {
        accountIds: targets.map((account) => account.id),
      })
      if (!r.ok) throw new Error(r.message || '获取 token 失败')
      await refreshAccounts()
      if (!opts?.silent && !opts?.suppressSuccess) {
        setSuccess('Token 已刷新')
      }
    } finally {
      setTokenRefreshingAll(false)
    }
  }

  async function parseHarFiles(files: File[]) {
    setError(null)
    setSuccess(null)
    setHarParsing(true)
    const importedIds: string[] = []
    try {
      if (files.length === 1) {
        const harText = await files[0].text()
        const r = await postJson<{
          cookie: string
          headers: Record<string, string>
          newHomeUrl: string
        }>('/api/accounts/har/parse', { harText })
        if (!r.ok) throw new Error(r.message || 'HAR 解析失败')
        setCookieInput(r.data.cookie)
        setHeadersInput(formatHeadersAsLines(r.data.headers))
        setNewHomeUrlInput(r.data.newHomeUrl || '')
        setSuccess('HAR 解析成功，已填充 Cookie 与请求头')
        return
      }

      let imported = 0
      for (const file of files) {
        const harText = await file.text()
        const r = await postJson<{
          cookie: string
          headers: Record<string, string>
          newHomeUrl: string
        }>('/api/accounts/har/parse', { harText })
        if (!r.ok) continue
        const label = `HAR:${file.name}`
        const accountId = await ensureAccountId('', label, true)
        const newHomeUrl = r.data.newHomeUrl || undefined
        const setCookieRes = await postJson<{ cookie: string }>(
          `/api/accounts/${accountId}/cookie`,
          {
            cookie: r.data.cookie,
            headers: r.data.headers,
            newHomeUrl,
          },
        )
        if (!setCookieRes.ok) continue
        imported += 1
        importedIds.push(accountId)
      }
      await refreshAccounts()
      await Promise.allSettled(importedIds.map((id) => activateAccount(id)))
      setSuccess(`已导入 ${imported} 个 HAR 账号`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'HAR 解析失败'
      setError(msg)
    } finally {
      setHarParsing(false)
    }
  }

  async function onSendSms() {
    setError(null)
    setSuccess(null)
    setSending(true)
    try {
      const accountId = await ensureAccountId(smsNormalizedPhone, smsLabel)
      const r = await postJson<{ cooldownSeconds: number }>(
        `/api/accounts/${accountId}/sms/send`,
        {},
      )
      if (!r.ok) {
        setError(r.message || '发送验证码失败')
        return
      }
      setSuccess('验证码已发送')
      setCooldown(Math.max(1, Math.min(120, r.data.cooldownSeconds || 60)))
    } catch {
      setError('网络异常，请重试')
    } finally {
      setSending(false)
    }
  }

  async function onLogin() {
    setError(null)
    setSuccess(null)
    setLoggingIn(true)
    try {
      const accountId = await ensureAccountId(smsNormalizedPhone, smsLabel)
      const r = await postJson<{ cookie: string }>(
        `/api/accounts/${accountId}/login`,
        {
          code: smsNormalizedCode,
        },
      )
      if (!r.ok) {
        setError(r.message || '登录失败')
        return
      }
      setSuccess('Cookie 已获取')
      await refreshAccounts(accountId)
      setExpandedAccountId(accountId)
      setExpandedCookie(r.data.cookie)
      await activateAccount(accountId)
      setSmsPhone('')
      setSmsLabel('')
      setSmsCode('')
      setCooldown(0)
      setShowAddModal(false)
    } catch {
      setError('网络异常，请重试')
    } finally {
      setLoggingIn(false)
    }
  }

  async function onSendYunpanSms() {
    setError(null)
    setSuccess(null)
    setSending(true)
    try {
      const r = await postJson<{ cooldownSeconds: number }>(
        '/api/accounts/yunpan/sms/send',
        { phone: yunpanNormalizedPhone },
      )
      if (!r.ok) {
        setError(r.message || '云盘验证码发送失败')
        return
      }
      setSuccess('云盘验证码已发送')
      setCooldown(Math.max(1, Math.min(120, r.data.cooldownSeconds || 60)))
    } catch {
      setError('网络异常，请重试')
    } finally {
      setSending(false)
    }
  }

  async function onLoginByYunpan() {
    setError(null)
    setSuccess(null)
    setLoggingIn(true)
    try {
      const r = await postJson<{
        account: AccountSummary
        cookie?: string
        cookieLength: number
        cookieNames: string[]
        ssoUrl: string
        warning?: string
      }>('/api/accounts/yunpan/login', {
        phone: yunpanNormalizedPhone,
        code: yunpanNormalizedCode,
        label: yunpanLabel.trim() || undefined,
      })
      if (!r.ok) {
        setError(r.message || '云盘登录换取 CK 失败')
        return
      }
      setSuccess(
        r.data.cookieLength > 0
          ? `云盘登录成功，已获取 10086 CK（${r.data.cookieLength} 字符）`
          : r.data.warning || '云盘登录成功，云盘会话已保存，可在用户管理页生成 10086 链接',
      )
      await refreshAccounts(r.data.account.id)
      setExpandedAccountId(r.data.account.id)
      if (r.data.cookie) {
        setExpandedCookie(r.data.cookie)
        await activateAccount(r.data.account.id)
      }
      setYunpanPhone('')
      setYunpanLabel('')
      setYunpanCode('')
      setCooldown(0)
      setShowAddModal(false)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '云盘登录失败'
      setError(msg)
    } finally {
      setLoggingIn(false)
    }
  }

  async function refreshByYunpan(id: string): Promise<boolean> {
    setError(null)
    setSuccess(null)
    setRefreshingById((s) => ({ ...s, [id]: true }))
    try {
      const r = await postJson<{
        cookie: string
        cookieLength: number
        cookieNames: string[]
        ssoUrl: string
      }>(`/api/accounts/${id}/yunpan/refresh`, {})
      if (!r.ok) {
        setError(r.message || '云盘刷新 10086 CK 失败')
        return false
      }
      if (expandedAccountId === id) setExpandedCookie(r.data.cookie)
      await refreshAccounts(id)
      await activateAccountInternal(id)
      setSuccess(`已通过云盘会话刷新 10086 CK（${r.data.cookieLength} 字符）`)
      return true
    } catch (e) {
      const msg = e instanceof Error ? e.message : '云盘刷新失败'
      setError(msg)
      return false
    } finally {
      setRefreshingById((s) => ({ ...s, [id]: false }))
    }
  }

  async function onLoginDialogSuccess(args: {
    accountId: string
    cookie?: string
    method?: LoginMethod
    warning?: string
  }) {
    await refreshAccounts(args.accountId)
    setExpandedAccountId(args.accountId)
    if (args.cookie) setExpandedCookie(args.cookie)
    if (args.method !== 'yunpan') await activateAccount(args.accountId)
    setShowAddModal(false)
    setLoginDialogAccount(null)
    setSuccess(args.warning || (args.method === 'yunpan' ? args.cookie ? '云盘登录成功，全球通 Token 与 10086 CK 已更新' : '云盘登录成功，全球通 Token 已更新' : '登录成功，账号信息已更新'))
  }

  function openLoginDialog(account?: AccountSummary) {
    setLoginDialogAccount(account ?? null)
    setShowAddModal(true)
    setError(null)
    setSuccess(null)
  }

  async function onLoginByCookie() {
    setError(null)
    setSuccess(null)
    setCookieLoggingIn(true)
    try {
      const rawCookie = cookieInput.trim()
      if (!rawCookie) {
        setError('请输入 Cookie')
        return
      }
      let requestHeaders: Record<string, string> | undefined = undefined
      try {
        requestHeaders = parseHeadersInputValue(headersInput)
      } catch (e) {
        const msg = e instanceof Error ? e.message : '请求头格式不正确'
        setError(msg)
        return
      }
      if (!requestHeaders && !headersInput.trim()) {
        const confirmed = window.confirm(
          '未提供请求头，Cookie 可能在 1 小时后失效，是否继续登录？',
        )
        if (!confirmed) return
      }
      const rawLabel = cookiePhone.trim()
      const phoneForAccount = /^1\d{10}$/.test(cookieNormalizedPhone)
        ? cookieNormalizedPhone
        : ''
      const labelForAccount =
        rawLabel && !phoneForAccount ? rawLabel : undefined
      const accountId = await ensureAccountId(
        phoneForAccount,
        labelForAccount,
        !phoneForAccount,
      )
      const newHomeUrl = newHomeUrlInput.trim() || undefined
      const r = await postJson<{ cookie: string }>(
        `/api/accounts/${accountId}/cookie`,
        {
          cookie: rawCookie,
          headers: requestHeaders,
          newHomeUrl,
        },
      )
      if (!r.ok) {
        setError(r.message || 'Cookie 登录失败')
        return
      }
      setExpandedAccountId(accountId)
      setExpandedCookie(r.data.cookie)
      await refreshAccounts(accountId)
      await refreshAccount(accountId)
      setCookiePhone('')
      setCookieInput('')
      setHeadersInput('')
      setNewHomeUrlInput('')
      setShowAddModal(false)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Cookie 登录失败'
      setError(msg)
    } finally {
      setCookieLoggingIn(false)
    }
  }

  async function pollQrLogin(targetFlowId?: string) {
    const flowId = targetFlowId || qrFlow?.flowId
    if (!flowId || qrPollingRef.current) return
    qrPollingRef.current = true
    try {
      const r = await postJson<Omit<QrLoginFlowState, 'qrImage'>>(
        '/api/accounts/qr-login/poll',
        { flowId },
      )
      if (!r.ok) {
        setError(r.message || '检查扫码状态失败')
        stopQrPolling()
        return
      }
      setQrFlow((prev) => ({
        ...(prev || { flowId, cookieNames: [] }),
        ...r.data,
      }))
      if (r.data.status === 'success') {
        stopQrPolling()
        setSuccess('扫码确认成功，已换取 CK，请保存为账号')
      } else if (r.data.status === 'expired') {
        stopQrPolling()
        setError('二维码已失效，请重新生成')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '检查扫码状态失败')
      stopQrPolling()
    } finally {
      qrPollingRef.current = false
    }
  }

  function startQrPolling(flowId: string) {
    stopQrPolling()
    qrPollTimerRef.current = window.setInterval(() => {
      void pollQrLogin(flowId)
    }, 2000)
  }

  async function onStartQrLogin() {
    setError(null)
    setSuccess(null)
    setQrBusy(true)
    try {
      stopQrPolling()
      const r = await postJson<{
        flowId: string
        expiresInSeconds: number
        qrImage: string
        cookieNames: string[]
      }>('/api/accounts/qr-login/start', {})
      if (!r.ok) {
        setError(r.message || '生成二维码失败')
        return
      }
      setQrFlow({
        flowId: r.data.flowId,
        status: 'pending',
        message: '等待中国移动 App 扫码确认',
        qrImage: r.data.qrImage,
        cookieNames: r.data.cookieNames,
        expiresInSeconds: r.data.expiresInSeconds,
      })
      setSuccess('二维码已生成，请使用中国移动 App 扫码')
      startQrPolling(r.data.flowId)
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成二维码失败')
    } finally {
      setQrBusy(false)
    }
  }

  async function onSaveQrLogin() {
    if (!qrFlow?.flowId) return
    setError(null)
    setSuccess(null)
    setQrSaving(true)
    try {
      const phoneForAccount = qrPhoneValid ? qrNormalizedPhone : ''
      const labelForAccount =
        qrLabel.trim() || (!phoneForAccount && qrPhone.trim() ? qrPhone.trim() : undefined)
      const r = await postJson<{
        account: AccountSummary
        cookie: string
        cookieNames: string[]
        cookieLength: number
      }>('/api/accounts/qr-login/save', {
        flowId: qrFlow.flowId,
        phone: phoneForAccount || undefined,
        label: labelForAccount,
      })
      if (!r.ok) {
        setError(r.message || '保存扫码 CK 失败')
        return
      }
      setExpandedAccountId(r.data.account.id)
      setExpandedCookie(r.data.cookie)
      setActiveAccountId(r.data.account.id)
      await refreshAccounts(r.data.account.id)
      await refreshAccount(r.data.account.id)
      setSuccess(`扫码 CK 已保存，Cookie 长度 ${r.data.cookieLength}`)
      setQrPhone('')
      setQrLabel('')
      setQrFlow(null)
      stopQrPolling()
      setShowAddModal(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存扫码 CK 失败')
    } finally {
      setQrSaving(false)
    }
  }

  function normalizeCookieLine(input: string): string {
    let text = input.trim()
    if (!text) return ''
    text = text
      .replace(/^cookie\\s*:/i, '')
      .replace(/^set-cookie\\s*:/i, '')
      .trim()
    return text
  }

  async function onBatchImportCookies() {
    setError(null)
    setSuccess(null)
    setBatchImporting(true)
    try {
      const lines = batchCookieInput
        .split(/\\r?\\n/)
        .map((line) => normalizeCookieLine(line))
        .filter(Boolean)
      if (lines.length === 0) {
        setError('请输入至少一条 Cookie')
        return
      }
      let requestHeaders: Record<string, string> | undefined = undefined
      try {
        requestHeaders = parseHeadersInputValue(headersInput)
      } catch (e) {
        const msg = e instanceof Error ? e.message : '请求头格式不正确'
        setError(msg)
        return
      }
      if (!requestHeaders && !headersInput.trim()) {
        const confirmed = window.confirm(
          '未提供请求头，Cookie 可能在 1 小时后失效，是否继续批量导入？',
        )
        if (!confirmed) return
      }
      const newHomeUrl = newHomeUrlInput.trim() || undefined
      let successCount = 0
      let failCount = 0
      for (let i = 0; i < lines.length; i += 1) {
        const cookie = lines[i]
        const label = `批量导入 ${i + 1}`
        try {
          const accountId = await ensureAccountId('', label, true)
          const r = await postJson<{ cookie: string }>(
            `/api/accounts/${accountId}/cookie`,
            {
              cookie,
              headers: requestHeaders,
              newHomeUrl,
            },
          )
          if (!r.ok) {
            failCount += 1
            continue
          }
          setExpandedAccountId(accountId)
          setExpandedCookie(r.data.cookie)
          await refreshAccounts(accountId)
          await refreshAccount(accountId)
          successCount += 1
        } catch {
          failCount += 1
        }
      }
      if (successCount > 0) {
        setBatchCookieInput('')
        setHeadersInput('')
        setNewHomeUrlInput('')
        setShowAddModal(false)
      }
      if (successCount === 0) {
        setError('批量导入失败，请检查 Cookie 是否有效')
      } else {
        setSuccess(`批量导入完成：成功 ${successCount}，失败 ${failCount}`)
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : '批量导入失败'
      setError(msg)
    } finally {
      setBatchImporting(false)
    }
  }

  async function onCopy(text: string) {
    if (!text) return
    setCopying(true)
    try {
      await navigator.clipboard.writeText(text)
      setToast('已复制 Cookie')
    } catch {
      setError('复制失败，请手动选择复制')
    } finally {
      setCopying(false)
    }
  }

  async function onCopyTokens() {
    if (copying) return
    setCopying(true)
    setError(null)
    setTokenCopyProgress({
      running: true,
      message: '准备导出未领取权益 token',
      logs: ['准备导出未领取权益 token'],
    })
    try {
      setTokenCopyProgress((prev) =>
        prev
          ? {
              ...prev,
              message: '正在刷新 CK、置换并过滤 token，请稍候…',
              logs: [...prev.logs, '正在请求后端刷新 CK、置换全球通 token，并过滤已领取权益账号'],
            }
          : prev,
      )
      const r = await postJson<{
        total: number
        skipped: number
        skipReasons: Record<string, number>
        tokens: Array<{ accessToken: string }>
      }>('/api/accounts/qqt/tokens/export', {
        refresh: true,
        strict: true,
        concurrency: 4,
        updatedWithinMinutes: 30,
        validForMinutes: 120,
      })
      if (!r.ok) {
        setTokenCopyProgress((prev) =>
          prev
            ? {
                ...prev,
                running: false,
                message: r.message || '复制 token 失败',
                logs: [...prev.logs, `失败：${r.message || '复制 token 失败'}`],
              }
            : prev,
        )
        setError(r.message || '复制 token 失败')
        return
      }
      setTokenCopyProgress((prev) =>
        prev
          ? {
              ...prev,
              message: '后端过滤完成，正在去重',
              exported: r.data.tokens.length,
              skipped: r.data.skipped,
              logs: [
                ...prev.logs,
                `后端过滤完成：可导出 ${r.data.tokens.length} 个，跳过 ${r.data.skipped} 个`,
              ],
            }
          : prev,
      )
      const unique = Array.from(
        new Set(r.data.tokens.map((item) => item.accessToken.trim()).filter(Boolean)),
      )
      setTokenCopyProgress((prev) =>
        prev
          ? {
              ...prev,
              message: unique.length > 0 ? '正在复制到剪贴板' : '没有可复制 token',
              unique: unique.length,
              logs: [...prev.logs, `去重完成：${unique.length} 个 token`],
            }
          : prev,
      )
      if (unique.length === 0) {
        setTokenCopyProgress((prev) =>
          prev
            ? {
                ...prev,
                running: false,
                message: '暂无确认未领取权益的全球通 token',
                logs: [...prev.logs, '结束：暂无确认未领取权益的全球通 token'],
              }
            : prev,
        )
        setError('暂无确认未领取权益的全球通 token')
        return
      }
      await copyText(unique.join('\n'))
      setTokenCopyProgress((prev) =>
        prev
          ? {
              ...prev,
              running: false,
              message: `已复制 ${unique.length} 个 token`,
              tokenText: unique.join('\n'),
              logs: [...prev.logs, `完成：已复制 ${unique.length} 个确认有效的全球通未领取权益 token`],
            }
          : prev,
      )
      setToast(`已复制 ${unique.length} 个确认有效的全球通未领取权益 token`)
      await refreshAccounts(activeAccountId || undefined).catch(() => undefined)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '复制 token 失败'
      setTokenCopyProgress((prev) =>
        prev
          ? {
              ...prev,
              running: false,
              message: msg,
              logs: [...prev.logs, `失败：${msg}`],
            }
          : prev,
      )
      setError(msg)
    } finally {
      setCopying(false)
    }
  }

  async function copyExportedTokensAgain() {
    const tokenText = tokenCopyProgress?.tokenText || ''
    if (!tokenText) return
    try {
      await copyText(tokenText)
      const count = tokenText.split('\n').filter(Boolean).length
      setToast(`已重新复制 ${count} 个本次有效 token`)
    } catch (e) {
      setError(e instanceof Error ? e.message : '复制 token 失败')
    }
  }

  async function copyText(text: string): Promise<void> {
    if (!text) return
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return
    }
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  async function refreshPublicLinks() {
    try {
      const res = await apiFetch('/api/accounts/public/links', { method: 'GET' })
      const r = (await res.json()) as ApiResp<{
        links: {
          linkId: string
          createdAt: string
          updatedAt: string
          accountCount: number
          url?: string
          ipUrl?: string
          pushplusEnabled: boolean
          pushplusBound: boolean
          notifyLogin: boolean
          notifyCookieInvalid: boolean
          notifyRushResult: boolean
          pushplusSubscribeUrl?: string
          pushplusQrImageUrl?: string
          pushplusQrNote?: string
          redirectEnabled: boolean
          redirectUrl?: string
          redirectNote?: string
        }[]
      }>
      if (!r.ok) throw new Error(r.message || '加载失败')
      const links = r.data.links.map((item) => ({
        ...item,
        url: item.url || `${window.location.origin}/public?link=${item.linkId}`,
        ipUrl: item.ipUrl,
      }))
      setPublicLinks(links)
      return links
    } catch (e) {
      const msg = e instanceof Error ? e.message : '加载失败'
      setError(msg)
      return []
    }
  }

  async function fetchLinkAccounts(linkId: string) {
    if (!linkId) return
    setLinkAccountsLoadingId(linkId)
    setLinkAccountsErrorById((prev) => ({ ...prev, [linkId]: '' }))
    try {
      const res = await apiFetch(`/api/accounts/public/link/${linkId}/accounts`, {
        method: 'GET',
      })
      const r = (await res.json()) as ApiResp<{ accounts: AccountSummary[] }>
      if (!r.ok) throw new Error(r.message || '查询账号失败')
      setLinkAccountsById((prev) => ({ ...prev, [linkId]: r.data.accounts }))
    } catch (e) {
      const msg = e instanceof Error ? e.message : '查询账号失败'
      setLinkAccountsErrorById((prev) => ({ ...prev, [linkId]: msg }))
    } finally {
      setLinkAccountsLoadingId((prev) => (prev === linkId ? null : prev))
    }
  }

  async function openAssignLinkModal(accountId: string) {
    setAssignLinkAccountId(accountId)
    setAssignLinkError(null)
    setAssignLinkLoading(false)
    let links = publicLinks
    if (links.length === 0) {
      links = await refreshPublicLinks()
    }
    if (links.length > 0) {
      setAssignLinkId(links[0].linkId)
    } else {
      setAssignLinkId('')
    }
    setShowAssignLinkModal(true)
  }

  async function assignAccountToLink() {
    if (!assignLinkAccountId) return
    if (!assignLinkId) {
      setAssignLinkError('请选择一个邀请码')
      return
    }
    setAssignLinkLoading(true)
    setAssignLinkError(null)
    setError(null)
    setSuccess(null)
    try {
      const r = await postJson<{ linkId: string }>(
        `/api/accounts/public/link/${assignLinkId}/account`,
        { accountId: assignLinkAccountId },
      )
      if (!r.ok) throw new Error(r.message || '绑定失败')
      setSuccess('账号已分配至邀请码')
      await refreshPublicLinks()
      setShowAssignLinkModal(false)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '绑定失败'
      setAssignLinkError(msg)
    } finally {
      setAssignLinkLoading(false)
    }
  }

  async function onCreatePublicLink() {
    setError(null)
    setSuccess(null)
    try {
      const r = await postJson<{ links: { linkId: string; url: string }[] }>(
        '/api/accounts/public/link/new',
        { count: linkCountInput },
      )
      if (!r.ok) throw new Error(r.message || '生成失败')
      const urls = r.data.links
        .map((item) => item.url || `${window.location.origin}/public?link=${item.linkId}`)
        .join('\n')
      await copyText(urls)
      setToast(`已复制 ${r.data.links.length} 条邀请码地址`)
      await refreshPublicLinks()
      setShowLinksModal(true)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '生成失败'
      setError(msg)
    }
  }

  async function onDeletePublicLink(linkId: string) {
    setDeletingLinkId(linkId)
    setError(null)
    setSuccess(null)
    try {
      const res = await apiFetch(`/api/accounts/public/link/${linkId}`, {
        method: 'DELETE',
      })
      const r = (await res.json()) as ApiResp<{ linkId: string }>
      if (!r.ok) {
        setError(r.message || '邀请码失效处理失败')
        return
      }
      if (assignLinkId === linkId) {
        setAssignLinkId('')
      }
      if (linkAccountsOpenId === linkId) {
        setLinkAccountsOpenId(null)
      }
      setLinkAccountsById((prev) => {
        if (!prev[linkId]) return prev
        const next = { ...prev }
        delete next[linkId]
        return next
      })
      setPublicLinks((prev) => prev.filter((item) => item.linkId !== linkId))
      setSuccess('邀请码已失效处理')
    } catch {
      setError('网络异常，请重试')
    } finally {
      setDeletingLinkId(null)
    }
  }

  function toggleSort(nextKey: typeof sortKey) {
    if (sortKey === nextKey) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(nextKey)
      setSortDir('asc')
    }
  }

  function sortIndicator(key: typeof sortKey) {
    if (sortKey !== key) return ''
    return sortDir === 'asc' ? '▲' : '▼'
  }

  function sortValue(account: AccountSummary): string | number {
    if (sortKey === 'account') {
      return (
        account.displayPhone ||
        account.phoneMasked ||
        account.label ||
        account.id
      )
    }
    if (sortKey === 'cookieUpdatedAt') {
      return account.cookieUpdatedAt || account.updatedAt || ''
    }
    if (sortKey === 'token') {
      return qqtById[account.id]?.accessToken || account.qqtAccessToken || ''
    }
    if (sortKey === 'signUpdatedAt') {
      return qqtById[account.id]?.signUpdatedAt || ''
    }
    if (sortKey === 'xdr') {
      const xdr = xdrById[account.id]
      return xdr && xdr.prodList && xdr.prodList.length > 0 ? 1 : 0
    }
    return ''
  }

  const cookieValidityById = useMemo(() => {
    type CookieValidity = 'valid' | 'invalid' | 'unknown'
    const next: Record<string, CookieValidity> = {}
    for (const account of accounts) {
      let current: CookieValidity = 'unknown'
      if (!account.hasCookie) {
        current = 'invalid'
      } else {
        const activation = activationById[account.id]
        if (activation) {
          if (activation.status === 'ok') {
            if (activation.cookieValid === true) {
              current = 'valid'
            } else if (activation.cookieValid === false) {
              current = 'invalid'
            }
          } else if (activation.status === 'error') {
            current = 'invalid'
          }
        }
      }
      if (harHintById[account.id]) {
        current = 'invalid'
      }
      next[account.id] = current
    }
    return next
  }, [accounts, activationById, harHintById])

  const ckValidityCounts = useMemo(() => {
    const counts = { valid: 0, invalid: 0, unknown: 0 }
    for (const state of Object.values(cookieValidityById)) {
      if (state === 'valid') counts.valid += 1
      else if (state === 'invalid') counts.invalid += 1
      else counts.unknown += 1
    }
    return counts
  }, [cookieValidityById])

  async function pushOperationSummary(action: '一键刷新汇总' | '一键签到汇总') {
    const validCount = accounts.filter(
      (account) => cookieValidityById[account.id] === 'valid',
    ).length
    const invalidCount = accounts.filter(
      (account) => cookieValidityById[account.id] === 'invalid',
    ).length
    const unknownCount = accounts.length - validCount - invalidCount
    const unreceivedValidCount = accounts.filter((account) => {
      if (cookieValidityById[account.id] !== 'valid') return false
      const xdr = xdrById[account.id]
      return !xdr || !xdr.prodList || xdr.prodList.length === 0
    }).length
    const signedTodayCount = accounts.filter((account) => hasSignedToday(account.id)).length
    const signSuccessCount = accounts.filter((account) => {
      const signInfo = qqtById[account.id]?.signInfo
      const signResult = qqtById[account.id]?.signResult
      const summary = parseQqtSignSummary(signInfo || signResult)
      return Boolean(
        summary &&
          (summary.statusText === '成功' ||
            summary.statusText === '已签到' ||
            summary.message?.includes('已签到')),
      )
    }).length
    const r = await postJson<Record<string, never>>('/api/accounts/notify/summary', {
      action,
      lines: [
        `- 总账号数: ${accounts.length}`,
        `- 当前有效 CK: ${validCount}`,
        `- 当前失效 CK: ${invalidCount}`,
        `- 当前未知 CK: ${unknownCount}`,
        `- 未领取权益且 CK 有效账号: ${unreceivedValidCount}`,
        `- 今日已签到账号: ${signedTodayCount}`,
        `- 签到成功/已签到账号: ${signSuccessCount}`,
        `- 时间: ${new Date().toLocaleString('zh-CN', { hour12: false })}`,
      ],
    })
    if (!r.ok) {
      throw new Error(r.message || '推送失败')
    }
  }

  const sortedAccounts = [...accounts].sort((a, b) => {
    const va = sortValue(a)
    const vb = sortValue(b)
    const dir = sortDir === 'asc' ? 1 : -1
    if (typeof va === 'number' && typeof vb === 'number') {
      return (va - vb) * dir
    }
    const sa = String(va)
    const sb = String(vb)
    return sa.localeCompare(sb, 'zh-CN') * dir
  })
  const unreceivedAccounts = sortedAccounts.filter((a) => {
    const xdr = xdrById[a.id]
    return !xdr || !xdr.prodList || xdr.prodList.length === 0
  })
  const receivedAccounts = sortedAccounts.filter((a) => {
    const xdr = xdrById[a.id]
    return Boolean(xdr && xdr.prodList && xdr.prodList.length > 0)
  })
  const accountsBaseForReward =
    rewardTab === 'all'
      ? sortedAccounts
      : rewardTab === 'unreceived'
        ? unreceivedAccounts
        : receivedAccounts
  const normalizedAccountSearch = accountSearchInput.trim().toLowerCase()
  const accountsBaseForSearch = accountsBaseForReward.filter((account) => {
    if (!normalizedAccountSearch) return true
    const haystack = [
      account.id,
      account.phone,
      account.phoneMasked,
      account.displayPhone,
      account.label,
      account.publicLinkIds?.join(' '),
      account.cookieInvalidReason,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(normalizedAccountSearch)
  })
  const unlinkedAccountsCount = sortedAccounts.filter(
    (account) => !account.publicLinkIds || account.publicLinkIds.length === 0,
  ).length
  const normalizedLinkFilter = linkFilterInput.trim().toLowerCase()
  const accountsBaseForLink = accountsBaseForSearch.filter((account) => {
    if (showUnlinkedOnly) {
      return !account.publicLinkIds || account.publicLinkIds.length === 0
    }
    const linkFilter = linkFilterId || normalizedLinkFilter
    if (linkFilter) {
      return Boolean(
        account.publicLinkIds?.some((id) =>
          id.toLowerCase().includes(linkFilter.toLowerCase()),
        ),
      )
    }
    return true
  })
  const accountsToRender = accountsBaseForLink.filter((account) => {
    if (ckFilter === 'all') return true
    const state = cookieValidityById[account.id] ?? 'unknown'
    return ckFilter === 'valid' ? state === 'valid' : state === 'invalid'
  })
  const selectedVisibleAccountIds = accountsToRender
    .map((account) => account.id)
    .filter((id) => selectedAccountIds.includes(id))
  const allVisibleSelected =
    accountsToRender.length > 0 &&
    selectedVisibleAccountIds.length === accountsToRender.length
  const wedRechargeAccount = wedRechargeAccountId
    ? accounts.find((account) => account.id === wedRechargeAccountId)
    : undefined
  const accountToolboxAccount = accountToolboxId
    ? accounts.find((account) => account.id === accountToolboxId)
    : undefined

  async function onToggleRow(id: string) {
    if (expandedAccountId === id) {
      setExpandedAccountId('')
      setExpandedCookie('')
      return
    }
    setExpandedAccountId(id)
    setExpandedCookie('')
    try {
      const cookie = await fetchCookieForAccount(id)
      setExpandedCookie(cookie)
    } catch {
      setExpandedCookie('')
    }
  }

  const feedbackMessage = error || success || toast
  const feedbackType = error ? 'error' : 'success'
  const v2Enabled =
    String(
      (import.meta.env as { VITE_UI_V2_ENABLED?: string } | undefined)?.VITE_UI_V2_ENABLED ??
        '1',
    ).toLowerCase() !== '0'

  return (
    <div className="brand-page min-h-screen text-zinc-900">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-2 pb-3 pt-3 sm:px-3 sm:pb-4 sm:pt-4 xl:px-5">
        <header className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm">
          <div>
            <h1 className="brand-heading text-base font-semibold tracking-tight sm:text-lg">
              <BrandLogo className="h-7 w-7" />
              中国移动用户管理
            </h1>
            <div className="mt-0.5 text-[11px] text-zinc-500">V1 经典版</div>
          </div>
          {v2Enabled ? (
            <Link
              to="/v2"
              className="inline-flex h-8 items-center rounded-md bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 hover:bg-emerald-100">
              切换到 V2 新版
            </Link>
          ) : null}
        </header>

        {feedbackMessage ? (
          <div className="fixed left-1/2 top-4 z-[80] w-[calc(100%-24px)] max-w-[460px] -translate-x-1/2">
            <div
              className={cn(
                'flex items-start gap-2 rounded-lg px-3 py-2 text-sm shadow-lg',
                feedbackType === 'error' ? 'bg-rose-600 text-white' : 'bg-zinc-900 text-white',
              )}>
              {feedbackType === 'error' ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
              <span className="min-w-0 flex-1">{feedbackMessage}</span>
              <button
                type="button"
                onClick={() => {
                  setError(null)
                  setSuccess(null)
                  setToast(null)
                }}
                className="text-white/80 hover:text-white">
                ×
              </button>
            </div>
          </div>
        ) : null}

        {tokenCopyProgress ? (
          <div className="fixed right-3 top-20 z-[70] w-[calc(100%-24px)] max-w-sm rounded-2xl border border-zinc-200 bg-white p-3 text-xs shadow-xl">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-zinc-900">复制未领取权益 Token</div>
                <div className="mt-0.5 text-zinc-500">{tokenCopyProgress.message}</div>
              </div>
              <button
                type="button"
                disabled={tokenCopyProgress.running}
                onClick={() => setTokenCopyProgress(null)}
                className={cn(
                  'rounded-lg px-2 py-1 font-medium',
                  tokenCopyProgress.running
                    ? 'cursor-not-allowed bg-zinc-100 text-zinc-400'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200',
                )}>
                关闭
              </button>
            </div>
            <div className="mb-2 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-zinc-50 px-2 py-1">
                <div className="font-semibold text-zinc-900">{tokenCopyProgress.exported ?? '—'}</div>
                <div className="text-zinc-500">导出</div>
              </div>
              <div className="rounded-lg bg-zinc-50 px-2 py-1">
                <div className="font-semibold text-zinc-900">{tokenCopyProgress.unique ?? '—'}</div>
                <div className="text-zinc-500">去重</div>
              </div>
              <div className="rounded-lg bg-zinc-50 px-2 py-1">
                <div className="font-semibold text-zinc-900">{tokenCopyProgress.skipped ?? '—'}</div>
                <div className="text-zinc-500">跳过</div>
              </div>
            </div>
            <div className="max-h-36 space-y-1 overflow-y-auto rounded-xl bg-zinc-50 p-2 text-zinc-600">
              {tokenCopyProgress.logs.map((line, index) => (
                <div key={`${index}-${line}`} className="flex gap-1">
                  <span className="text-zinc-400">{index + 1}.</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
            {tokenCopyProgress.running ? (
              <div className="mt-2 flex items-center gap-1 text-blue-700">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                处理中…
              </div>
            ) : tokenCopyProgress.tokenText ? (
              <button
                type="button"
                onClick={() => void copyExportedTokensAgain()}
                className="mt-2 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-3 font-medium text-white hover:bg-zinc-800">
                <Copy className="h-3.5 w-3.5" />
                复制本次 Token
              </button>
            ) : null}
          </div>
        ) : null}
        <AccountLoginDialog
          open={showAddModal}
          title={loginDialogAccount ? '重新登录账号' : '添加账号'}
          account={loginDialogAccount ?? undefined}
          defaultMethod={
            (loginDialogAccount?.lastLoginMethod === 'cmcc_qr' ||
            loginDialogAccount?.lastLoginMethod === 'manual_cookie' || loginDialogAccount?.lastLoginMethod === 'yunpan'
              ? loginDialogAccount.lastLoginMethod
              : 'cmcc_sms') as LoginMethod
          }
          apiFetch={apiFetch}
          onClose={() => {
            setShowAddModal(false)
            setLoginDialogAccount(null)
          }}
          onSuccess={onLoginDialogSuccess}
        />

        {false && showAddModal ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
            onClick={() => setShowAddModal(false)}>
            <div
              className="w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl sm:p-4"
              onClick={(e) => e.stopPropagation()}>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold">添加账号</h2>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200">
                  关闭
                </button>
              </div>
              <div className="max-h-[65vh] overflow-y-auto pr-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2 rounded-xl bg-zinc-100 p-1 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setAuthTab('sms')}
                    className={cn(
                      'flex-1 rounded-full px-3 py-2 transition',
                      authTab === 'sms'
                        ? 'bg-white text-zinc-900 shadow-sm'
                        : 'text-zinc-500',
                    )}>
                    短信验证码登录
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthTab('qr')}
                    className={cn(
                      'flex-1 rounded-full px-3 py-2 transition',
                      authTab === 'qr'
                        ? 'bg-white text-zinc-900 shadow-sm'
                        : 'text-zinc-500',
                    )}>
                    App扫码登录
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthTab('yunpan')}
                    className={cn(
                      'flex-1 rounded-full px-3 py-2 transition',
                      authTab === 'yunpan'
                        ? 'bg-white text-zinc-900 shadow-sm'
                        : 'text-zinc-500',
                    )}>
                    云盘登录转 CK
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthTab('cookie')}
                    className={cn(
                      'flex-1 rounded-full px-3 py-2 transition',
                      authTab === 'cookie'
                        ? 'bg-white text-zinc-900 shadow-sm'
                        : 'text-zinc-500',
                    )}>
                    Cookie + 请求头登录
                  </button>
                </div>

                {authTab === 'sms' ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-700">
                        新增账号手机号
                      </label>
                      <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                        <Phone className="h-4 w-4 text-zinc-500" />
                        <PhoneInput
                          value={smsPhone}
                          onValueChange={setSmsPhone}
                          name="tel"
                          placeholder="请输入 11 位手机号"
                          className="w-full bg-transparent text-sm outline-none"
                        />
                      </div>
                      <p
                        className={cn(
                          'text-xs',
                          smsPhone.length === 0 || smsPhoneValid
                            ? 'text-zinc-500'
                            : 'text-red-600',
                        )}>
                        {smsPhone.length === 0 || smsPhoneValid
                          ? '仅支持 11 位手机号。'
                          : '手机号格式不正确。'}
                      </p>

                      <div className="flex items-center gap-2">
                        <input
                          value={smsLabel}
                          onChange={(e) => setSmsLabel(e.target.value)}
                          placeholder="备注(可选)"
                          className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-700">
                        短信验证码
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-1 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                          <KeyRound className="h-4 w-4 text-zinc-500" />
                          <input
                            value={smsCode}
                            onChange={(e) => setSmsCode(onlyDigits(e.target.value).slice(0, 6))}
                            id="sms_code"
                            name="code"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            pattern="[0-9]{6}"
                            maxLength={6}
                            enterKeyHint="done"
                            required
                            aria-label="短信验证码"
                            placeholder="请输入 6 位验证码"
                            className="w-full bg-transparent text-sm outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={onSendSms}
                          disabled={!canSend}
                          className={cn(
                            'inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium transition',
                            canSend
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                          )}>
                          {sending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : null}
                          {cooldown > 0
                            ? `重新获取(${cooldown}s)`
                            : '获取验证码'}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onLogin}
                      disabled={!canLogin}
                      className={cn(
                        'inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition',
                        canLogin
                          ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                          : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                      )}>
                      {loggingIn ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      确认登录 / 获取 Cookie
                    </button>
                  </div>
                ) : authTab === 'yunpan' ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-700">
                        云盘登录手机号
                      </label>
                      <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                        <Phone className="h-4 w-4 text-zinc-500" />
                        <PhoneInput
                          value={yunpanPhone}
                          onValueChange={setYunpanPhone}
                          name="yunpan_tel"
                          placeholder="请输入 11 位手机号"
                          className="w-full bg-transparent text-sm outline-none"
                        />
                      </div>
                      <p
                        className={cn(
                          'text-xs',
                          yunpanPhone.length === 0 || yunpanPhoneValid
                            ? 'text-zinc-500'
                            : 'text-red-600',
                        )}>
                        {yunpanPhone.length === 0 || yunpanPhoneValid
                          ? '使用云盘短信登录，自动获取 ssoToken 并换取 wx.10086.cn CK。'
                          : '手机号格式不正确。'}
                      </p>

                      <input
                        value={yunpanLabel}
                        onChange={(e) => setYunpanLabel(e.target.value)}
                        placeholder="备注(可选)"
                        className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-700">
                        云盘短信验证码
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-1 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                          <KeyRound className="h-4 w-4 text-zinc-500" />
                          <input
                            value={yunpanCode}
                            onChange={(e) => setYunpanCode(onlyDigits(e.target.value).slice(0, 6))}
                            id="yunpan_sms_code"
                            name="yunpan_code"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            pattern="[0-9]{6}"
                            maxLength={6}
                            enterKeyHint="done"
                            required
                            aria-label="云盘短信验证码"
                            placeholder="请输入 6 位验证码"
                            className="w-full bg-transparent text-sm outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={onSendYunpanSms}
                          disabled={!canSendYunpan}
                          className={cn(
                            'inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium transition',
                            canSendYunpan
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                          )}>
                          {sending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : null}
                          {cooldown > 0
                            ? `重新获取(${cooldown}s)`
                            : '获取验证码'}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onLoginByYunpan}
                      disabled={!canLoginYunpan}
                      className={cn(
                        'inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition',
                        canLoginYunpan
                          ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                          : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                      )}>
                      {loggingIn ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      云盘登录并获取 10086 CK
                    </button>
                  </div>
                ) : authTab === 'qr' ? (
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-700">
                          手机号（可选）
                        </label>
                        <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                          <Phone className="h-4 w-4 text-zinc-500" />
                          <PhoneInput
                            value={qrPhone}
                            onValueChange={setQrPhone}
                            allowText
                            placeholder="可填手机号或备注"
                            className="w-full bg-transparent text-sm outline-none"
                          />
                        </div>
                        <p
                          className={cn(
                            'text-xs',
                            qrPhone.length === 0 || qrPhoneValid
                              ? 'text-zinc-500'
                              : 'text-red-600',
                          )}>
                          {qrPhone.length === 0 || qrPhoneValid
                            ? '可留空保存为扫码账号，后续校验会尝试回填手机号。'
                            : '手机号格式不正确；如需备注请填写下方备注。'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-700">
                          备注（可选）
                        </label>
                        <input
                          value={qrLabel}
                          onChange={(e) => setQrLabel(e.target.value)}
                          placeholder="例如：家人号码/扫码账号"
                          className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                        <p className="text-xs text-zinc-500">
                          使用中国移动 App 扫码确认后保存 wx.10086.cn CK。
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-sm font-semibold text-zinc-900">
                            中国移动 App 扫码登录
                          </div>
                          <div className="mt-1 text-xs text-zinc-500">
                            生成二维码后用中国移动 App 扫码并确认授权。
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={onStartQrLogin}
                          disabled={!canStartQrLogin}
                          className={cn(
                            'inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium transition',
                            canStartQrLogin
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                          )}>
                          {qrBusy ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <RefreshCcw className="h-3.5 w-3.5" />
                          )}
                          生成/刷新二维码
                        </button>
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-[176px_1fr]">
                        <div className="flex aspect-square h-44 w-44 items-center justify-center rounded-xl border border-zinc-200 bg-white p-2">
                          {qrFlow?.qrImage ? (
                            <img
                              src={qrFlow.qrImage}
                              alt="中国移动 App 扫码登录二维码"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <QrCode className="h-16 w-16 text-zinc-300" />
                          )}
                        </div>
                        <div className="space-y-2 text-xs text-zinc-600">
                          <div className="rounded-lg bg-white p-3">
                            <div className="font-medium text-zinc-900">
                              {qrFlow?.message || '点击生成二维码后等待扫码。'}
                            </div>
                            {qrFlow?.expiresInSeconds !== undefined ? (
                              <div className="mt-1 text-zinc-500">
                                剩余约 {qrFlow.expiresInSeconds}s
                              </div>
                            ) : null}
                            {qrFlow?.cookieLength ? (
                              <div className="mt-1 text-zinc-500">
                                Cookie 长度 {qrFlow.cookieLength}
                              </div>
                            ) : null}
                            {qrFlow?.cookieNames.length ? (
                              <div className="mt-1 break-all text-zinc-500">
                                Cookie: {qrFlow.cookieNames.join(', ')}
                              </div>
                            ) : null}
                          </div>
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                              type="button"
                              onClick={() => void pollQrLogin()}
                              disabled={!qrFlow?.flowId || qrBusy || qrSaving}
                              className={cn(
                                'inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium transition',
                                qrFlow?.flowId && !qrBusy && !qrSaving
                                  ? 'bg-white text-zinc-700 hover:bg-zinc-100'
                                  : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                              )}>
                              <RefreshCcw className="h-3.5 w-3.5" />
                              检查状态
                            </button>
                            <button
                              type="button"
                              onClick={onSaveQrLogin}
                              disabled={!canSaveQrLogin}
                              className={cn(
                                'inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium transition',
                                canSaveQrLogin
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                              )}>
                              {qrSaving ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Save className="h-3.5 w-3.5" />
                              )}
                              保存扫码账号
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : authTab === 'cookie' ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-700">
                        Cookie 对应手机号/备注（可选）
                      </label>
                      <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                        <Phone className="h-4 w-4 text-zinc-500" />
                        <PhoneInput
                          value={cookiePhone}
                          onValueChange={setCookiePhone}
                          allowText
                          placeholder="可填手机号或备注"
                          className="w-full bg-transparent text-sm outline-none"
                        />
                      </div>
                      <p className="text-xs text-zinc-500">
                        手机号可选，未填写时将根据激活信息更新展示。
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-700">
                        Cookie
                      </label>
                      <textarea
                        value={cookieInput}
                        onChange={(e) => setCookieInput(e.target.value)}
                        placeholder="粘贴 Cookie（必填）"
                        className="h-20 w-full resize-none rounded-xl border border-zinc-200 bg-white p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-700">
                        批量导入 Cookie（每行一条）
                      </label>
                      <textarea
                        value={batchCookieInput}
                        onChange={(e) => setBatchCookieInput(e.target.value)}
                        placeholder="每行一条 Cookie，可包含 Cookie: 前缀"
                        className="h-24 w-full resize-none rounded-xl border border-zinc-200 bg-white p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                      <div className="flex items-center justify-between text-[11px] text-zinc-500">
                        <span>示例：Cookie: a=b; c=d</span>
                        <span>
                          共{' '}
                          {
                            batchCookieInput
                              .split(/\r?\n/)
                              .filter((line) => line.trim()).length
                          }{' '}
                          条
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-700">
                        自定义请求头(可选)
                      </label>
                      <textarea
                        value={headersInput}
                        onChange={(e) => setHeadersInput(e.target.value)}
                        placeholder="每行 Key: Value"
                        className="h-20 w-full resize-none rounded-xl border border-zinc-200 bg-white p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          ref={harInputRef}
                          type="file"
                          accept=".har,application/json"
                          multiple
                          onChange={(e) => {
                            const list = Array.from(e.target.files || [])
                            if (list.length === 0) return
                            void parseHarFiles(list)
                            e.currentTarget.value = ''
                          }}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => harInputRef.current?.click()}
                          disabled={harParsing}
                          className={cn(
                            'inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-medium',
                            !harParsing
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                          )}>
                          {harParsing ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : null}
                          导入 HAR（newHome）
                        </button>
                        <span className="text-[11px] text-zinc-500">
                          支持多选 HAR，批量导入多个账号
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-700">
                        newHome URL(可选)
                      </label>
                      <input
                        value={newHomeUrlInput}
                        onChange={(e) => setNewHomeUrlInput(e.target.value)}
                        placeholder="从 HAR 自动填充，包含 ys/code/state 参数"
                        className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                      <p className="text-[11px] text-zinc-500">
                        如果未填写，默认使用
                        https://wx.10086.cn/website/spa/main/newHome
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={onLoginByCookie}
                      disabled={!canCookieLogin}
                      className={cn(
                        'inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition',
                        canCookieLogin
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                      )}>
                      {cookieLoggingIn ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      使用 Cookie 登录
                    </button>

                    <button
                      type="button"
                      onClick={onBatchImportCookies}
                      disabled={!canBatchImport}
                      className={cn(
                        'inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition',
                        canBatchImport
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                      )}>
                      {batchImporting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      批量导入 Cookie
                    </button>
                  </div>
                ) : null}

              </div>
            </div>
          </div>
        ) : null}

        {showAssignLinkModal ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
            onClick={() => {
              setShowAssignLinkModal(false)
              setAssignLinkError(null)
            }}>
            <div
              className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold">分配邀请码</h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignLinkModal(false)
                    setAssignLinkError(null)
                  }}
                  className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200">
                  关闭
                </button>
              </div>
              <div className="text-[12px] text-zinc-500">
                账号:{' '}
                <span className="font-medium">
                  {accounts.find((item) => item.id === assignLinkAccountId)
                    ?.displayPhone ||
                    accounts.find((item) => item.id === assignLinkAccountId)
                      ?.phoneMasked ||
                    '未知'}
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-2 text-xs text-zinc-500">
                {publicLinks.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-3 text-[12px]">
                    当前没有邀请码记录，
                    <button
                      type="button"
                      onClick={refreshPublicLinks}
                      className="ml-1 text-blue-600 underline">
                      先刷新链接
                    </button>
                  </div>
                ) : (
                  <label className="text-[11px] font-medium text-zinc-600">
                    选择链接
                    <select
                      value={assignLinkId}
                      onChange={(e) => setAssignLinkId(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                      {publicLinks.map((link) => (
                        <option key={link.linkId} value={link.linkId}>
                          {link.url}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {assignLinkError ? (
                  <div className="text-red-600">{assignLinkError}</div>
                ) : null}
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  disabled={!assignLinkId || assignLinkLoading}
                  onClick={assignAccountToLink}
                  className={cn(
                    'rounded-lg px-3 py-1 font-medium',
                    assignLinkId && !assignLinkLoading
                      ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                      : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                  )}>
                  {assignLinkLoading ? '绑定中' : '确认绑定'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignLinkModal(false)
                    setAssignLinkError(null)
                  }}
                  className="rounded-lg bg-zinc-100 px-3 py-1 font-medium text-xs text-zinc-600 hover:bg-zinc-200">
                  取消
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {showGlobalToolbox ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
            onClick={() => setShowGlobalToolbox(false)}>
            <div
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold">工具箱</h2>
                <button
                  type="button"
                  onClick={() => setShowGlobalToolbox(false)}
                  className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200">
                  关闭
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                {[
                  {
                    label: '添加账号',
                    icon: Phone,
                    run: () => {
                      openLoginDialog()
                      setShowGlobalToolbox(false)
                    },
                    disabled: false,
                  },
                  {
                    label: 'App扫码登录',
                    icon: QrCode,
                    run: () => {
                      openLoginDialog()
                      setShowGlobalToolbox(false)
                    },
                    disabled: false,
                  },
                  {
                    label: '一键 CK 维护',
                    icon: ShieldCheck,
                    run: () => void startAdminBatchTask('ck_maintenance'),
                    disabled: !hasRefreshTargets || adminTaskRunning,
                  },
                  {
                    label: '选中 CK 维护',
                    icon: ShieldCheck,
                    run: () => void startSelectedBatchTask('ck_maintenance'),
                    disabled: selectedAccountIds.length === 0 || adminTaskRunning,
                  },
                  {
                    label: '一键签到+拼图',
                    icon: ListChecks,
                    run: () => void startAdminBatchTask('refresh_and_sign'),
                    disabled: !hasRefreshTargets || adminTaskRunning,
                  },
                  {
                    label: '选中签到+拼图',
                    icon: ListChecks,
                    run: () => void startSelectedBatchTask('refresh_and_sign'),
                    disabled: selectedAccountIds.length === 0 || adminTaskRunning,
                  },
                  {
                    label: '选中查询信息',
                    icon: Search,
                    run: () => void startSelectedBatchTask('query_info'),
                    disabled: selectedAccountIds.length === 0 || adminTaskRunning,
                  },
                  {
                    label: '一键完成周三拼图',
                    icon: RefreshCcw,
                    run: () => void startAdminBatchTask('wed_recharge'),
                    disabled: !hasRefreshTargets || adminTaskRunning,
                  },
                  {
                    label: '选中周三拼图',
                    icon: RefreshCcw,
                    run: () => void startSelectedBatchTask('wed_recharge'),
                    disabled: selectedAccountIds.length === 0 || adminTaskRunning,
                  },
                  {
                    label: '复制未领取权益 Token',
                    icon: Copy,
                    run: () => void onCopyTokens(),
                    disabled: !hasTokenExportTargets,
                  },
                  {
                    label: '清除无效 CK',
                    icon: AlertTriangle,
                    run: () => void cleanupInvalidAccounts(),
                    disabled: !hasRefreshTargets || cleanupInProgress,
                  },
                  {
                    label: '账号去重',
                    icon: ListChecks,
                    run: () => void cleanupDuplicateAccounts(),
                    disabled: accounts.length === 0 || dedupInProgress,
                  },
                  {
                    label: '选中失效处理',
                    icon: AlertTriangle,
                    run: () => void onDisableSelectedAccounts(),
                    disabled: selectedAccountIds.length === 0 || batchDisablingAccounts,
                  },
                  {
                    label: '选中删除账号',
                    icon: AlertTriangle,
                    run: () => void onDeleteSelectedAccounts(),
                    disabled: selectedAccountIds.length === 0 || batchDeletingAccounts,
                  },
                  {
                    label: '邀请码记录',
                    icon: Link2,
                    run: () => {
                      setShowLinksModal(true)
                      void refreshPublicLinks()
                    },
                    disabled: false,
                  },
                  {
                    label: '用户管理',
                    icon: KeyRound,
                    run: () => {
                      window.location.href = '/users'
                    },
                    disabled: false,
                  },
                  { label: '周三拼图互转', icon: Puzzle, run: () => { window.location.href = '/benefits/wed-puzzle?from=home' }, disabled: false },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.label}
                      type="button"
                      disabled={item.disabled}
                      onClick={() => {
                        item.run()
                        if (item.label !== '添加账号') setShowGlobalToolbox(false)
                      }}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border px-3 py-2 text-left font-medium',
                        !item.disabled
                          ? 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50'
                          : 'cursor-not-allowed border-zinc-100 bg-zinc-50 text-zinc-400',
                      )}>
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        ) : null}

        {showGlobalAppTokenConfig ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
            onClick={() => setShowGlobalAppTokenConfig(false)}>
            <div
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">全局 appck 配置</h2>
                  <div className="mt-0.5 text-[11px] text-zinc-500">
                    批量和 public 周三拼图默认使用这里保存的当日配置。
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGlobalAppTokenConfig(false)}
                  className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200">
                  关闭
                </button>
              </div>
              <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                <label className="flex items-center gap-2 font-medium">
                  <input
                    type="checkbox"
                    checked={wedRechargeUseAppToken}
                    onChange={(e) => setWedRechargeUseAppToken(e.target.checked)}
                    className="h-4 w-4 rounded border-amber-300"
                  />
                  周三任务全局使用 appToken 置换 appck
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <textarea
                    value={appTokenInput}
                    onChange={(e) => setAppTokenInput(e.target.value)}
                    disabled={!wedRechargeUseAppToken}
                    placeholder="粘贴 appTokenLogin JSON 或 token"
                    className="h-24 resize-y rounded-lg border border-amber-200 bg-white px-2 py-1 text-zinc-800 outline-none disabled:bg-zinc-100 disabled:text-zinc-400"
                  />
                  <div className="space-y-2">
                    <input
                      value={appTokenActivitySid}
                      onChange={(e) => setAppTokenActivitySid(e.target.value)}
                      disabled={!wedRechargeUseAppToken}
                      placeholder="活动 sid/token 或完整 URL"
                      className="h-9 w-full rounded-lg border border-amber-200 bg-white px-2 text-zinc-800 outline-none disabled:bg-zinc-100 disabled:text-zinc-400"
                    />
                    <input
                      value={appTokenUserCheckId}
                      onChange={(e) => setAppTokenUserCheckId(e.target.value)}
                      disabled={!wedRechargeUseAppToken}
                      placeholder="userCheckId，可选"
                      className="h-9 w-full rounded-lg border border-amber-200 bg-white px-2 text-zinc-800 outline-none disabled:bg-zinc-100 disabled:text-zinc-400"
                    />
                    <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-white px-2 py-1 font-medium text-amber-800 hover:bg-amber-100">
                      <input
                        type="file"
                        accept=".har,application/json"
                        className="hidden"
                        disabled={!wedRechargeUseAppToken}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          e.currentTarget.value = ''
                          if (file) void importWedRechargeHar(file)
                        }}
                      />
                      导入 HAR 自动填入
                    </label>
                  </div>
                </div>
                <div className="text-[11px] leading-5 text-amber-800">
                  取消勾选后，周三拼图不会置换 appck，会直接使用当前 10086 活动会话执行。
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {accountToolboxAccount ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
            onClick={() => setAccountToolboxId(null)}>
            <div
              className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">账号工具箱</h2>
                  <div className="mt-0.5 text-[11px] text-zinc-500">
                    {getAccountDisplayLabel(accountToolboxAccount)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAccountToolboxId(null)}
                  className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200">
                  关闭
                </button>
              </div>
              <button type="button" disabled={!accountToolboxAccount.phone}
                onClick={() => { const id = accountToolboxAccount.id; setAccountToolboxId(null); void runAccountToolboxAction(id, 'relogin') }}
                className="mb-3 min-h-10 w-full rounded-lg border border-zinc-200 px-3 py-2 text-left text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:text-zinc-400">重新登录</button>
              {accountToolboxAccount.hasYunpanSession || accountToolboxAccount.qqtAccessToken ? <div className="mb-3"><YunpanJumpActions accountId={accountToolboxAccount.id} apiFetch={apiFetch} includeGlobal canRefreshGlobal={Boolean(accountToolboxAccount.hasYunpanSession || accountToolboxAccount.hasCookie)} disabled={Boolean(accountToolboxAccount.disabledAt)} onUpdated={() => refreshAccounts(accountToolboxAccount.id)} /></div> : null}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: '激活信息', action: 'activate' as const, disabled: !accountToolboxAccount.hasCookie },
                  { label: '刷新 CK', action: 'refresh' as const, disabled: !accountToolboxAccount.hasCookie },
                  { label: '活动续期', action: 'activity' as const, disabled: !accountToolboxAccount.hasCookie },
                  { label: '置换 CMCC', action: 'cmcc' as const, disabled: !accountToolboxAccount.hasCookie },
                  { label: '已订业务', action: 'business' as const, disabled: !accountToolboxAccount.hasCookie },
                  { label: '旧版已订业务', action: 'legacyBusiness' as const, disabled: false },
                  { label: '查询和退订', action: 'shopBusiness' as const, disabled: !accountToolboxAccount.hasCookie },
                  { label: '全球通签到', action: 'sign' as const, disabled: !accountToolboxAccount.hasCookie && !accountToolboxAccount.hasYunpanSession && !accountToolboxAccount.qqtAccessToken },
                  { label: '周三拼图', action: 'wed' as const, disabled: !accountToolboxAccount.hasCookie },
                  { label: '分配邀请码', action: 'assign' as const, disabled: false },
                  { label: '失效处理', action: 'disable' as const, disabled: false },
                  { label: '删除账号', action: 'remove' as const, disabled: false },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    disabled={item.disabled}
                    onClick={() => {
                      const id = accountToolboxAccount.id
                      setAccountToolboxId(null)
                      void runAccountToolboxAction(id, item.action)
                    }}
                    className={cn(
                      'rounded-lg border px-3 py-2 text-left font-medium',
                      !item.disabled
                        ? 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50'
                        : 'cursor-not-allowed border-zinc-100 bg-zinc-50 text-zinc-400',
                    )}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {showLinksModal ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
            onClick={() => setShowLinksModal(false)}>
            <div
              className="w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl sm:p-4"
              onClick={(e) => e.stopPropagation()}>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold">邀请码记录</h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      if (publicLinks.length === 0) return
                      const text = publicLinks.map((item) => item.url).join('\n')
                      await copyText(text)
                      setToast(`已复制 ${publicLinks.length} 条邀请码地址`)
                    }}
                    className="rounded-lg bg-zinc-900 px-2 py-1 text-xs font-medium text-white hover:bg-zinc-800">
                    一键复制
                  </button>
                  <button
                    type="button"
                    onClick={refreshPublicLinks}
                    className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200">
                    刷新记录
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLinksModal(false)}
                    className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200">
                    关闭
                  </button>
                </div>
              </div>
              <div className="max-h-[65vh] overflow-y-auto pr-1">
                {publicLinks.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-zinc-200 p-2 text-xs text-zinc-500">
                    暂无邀请码记录。
                  </div>
                ) : (
                  <div className="space-y-2">
                    {publicLinks.map((item) => {
                      const isOpen = linkAccountsOpenId === item.linkId
                      const accounts = linkAccountsById[item.linkId] ?? []
                      const loading = linkAccountsLoadingId === item.linkId
                      const error = linkAccountsErrorById[item.linkId]
                      return (
                      <div
                        key={item.linkId}
                        className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-2 text-xs text-zinc-700 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                          <div>邀请码地址: {item.url}</div>
                          <div>
                            账号数: {item.accountCount} ·
                            创建: {formatBeijingDateTime(item.createdAt)} ·
                            更新: {formatBeijingDateTime(item.updatedAt)}
                          </div>
                          {isOpen ? (
                            <div className="mt-2 rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-2 text-[11px]">
                              {loading ? (
                                <div className="text-zinc-500">加载中...</div>
                              ) : error ? (
                                <div className="text-red-600">{error}</div>
                              ) : accounts.length === 0 ? (
                                <div className="text-zinc-500">暂无账号</div>
                              ) : (
                                <div className="space-y-1">
                                  {accounts.map((acc) => (
                                    <div key={acc.id} className="flex flex-wrap gap-2">
                                      <span className="font-medium">
                                        {acc.displayPhone || acc.phoneMasked || '未获取'}
                                      </span>
                                      <span
                                        className={cn(
                                          'font-medium',
                                          acc.hasCookie ? 'text-emerald-700' : 'text-red-600',
                                        )}>
                                        {acc.hasCookie ? '有 CK' : '无 CK'}
                                      </span>
                                      {acc.label ? (
                                        <span className="text-zinc-500">标签: {acc.label}</span>
                                      ) : null}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={async () => {
                              await copyText(item.url)
                              setToast('已复制邀请码地址')
                            }}
                            className="rounded-md bg-zinc-900 px-2 py-1 font-medium text-white hover:bg-zinc-800">
                            复制
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              const nextOpen = isOpen ? null : item.linkId
                              setLinkAccountsOpenId(nextOpen)
                              if (!isOpen) {
                                await fetchLinkAccounts(item.linkId)
                              }
                            }}
                            className="rounded-md bg-zinc-100 px-2 py-1 font-medium text-zinc-700 hover:bg-zinc-200">
                            {isOpen ? '收起账号' : '查看账号'}
                          </button>
                          <button
                            type="button"
                            disabled={deletingLinkId === item.linkId}
                            onClick={() => {
                              if (!window.confirm(`确认将邀请码 ${item.linkId} 设置为失效吗？关联账号也会同步失效。`)) {
                                return
                              }
                              void onDeletePublicLink(item.linkId)
                            }}
                            className={cn(
                              'rounded-md px-2 py-1 font-medium',
                              deletingLinkId === item.linkId
                                ? 'cursor-not-allowed bg-zinc-100 text-zinc-400'
                                : 'bg-red-50 text-red-700 hover:bg-red-100',
                            )}>
                            {deletingLinkId === item.linkId ? '处理中' : '失效'}
                          </button>
                        </div>
                      </div>
                    )})}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {showScheduleSettings ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
            onClick={() => setShowScheduleSettings(false)}>
            <div
              className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">定时计划</h2>
                <button
                  type="button"
                  onClick={() => setShowScheduleSettings(false)}
                  className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200">
                  关闭
                </button>
              </div>
              <div className="grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
                <label className="space-y-1">
                  <span className="text-zinc-500">SSPID</span>
                  <input
                    value={qqtSspid}
                    onChange={(e) => setQqtSspid(e.target.value)}
                    placeholder="例如 75442"
                    className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-zinc-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-zinc-500">计划名</span>
                  <input
                    value={scheduleName}
                    onChange={(e) => setScheduleName(e.target.value)}
                    placeholder="例如 每日刷新签到"
                    className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-zinc-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-zinc-500">时间点</span>
                  <input
                    type="time"
                    step={60}
                    value={normalizeScheduleTime(scheduleTimeInput)}
                    onChange={(e) => setScheduleTimeInput(normalizeScheduleTime(e.target.value))}
                    className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-zinc-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                  />
                </label>
                <div className="grid grid-cols-2 gap-2 pt-5">
                  <button
                    type="button"
                    onClick={addScheduleTime}
                    className="h-9 rounded-md bg-zinc-100 px-2 font-medium text-zinc-700 hover:bg-zinc-200">
                    添加
                  </button>
                  <button
                    type="button"
                    onClick={() => void createTaskSchedule()}
                    disabled={scheduleSaving}
                    className={cn(
                      'h-9 rounded-md px-2 font-medium',
                      !scheduleSaving
                        ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                        : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                    )}>
                    {scheduleSaving ? '保存中' : '保存'}
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-600">
                <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-blue-700">
                  当前选择：{normalizeScheduleTime(scheduleTimeInput)}
                </span>
                {scheduleTimes.map((time) => (
                  <span key={time} className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2 py-1">
                    {time}
                    <button
                      type="button"
                      onClick={() => removeScheduleTime(time)}
                      disabled={scheduleTimes.length === 1}
                      className={cn(
                        'font-medium',
                        scheduleTimes.length > 1 ? 'text-rose-600 hover:text-rose-700' : 'cursor-not-allowed text-zinc-300',
                      )}>
                      删除
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-3 max-h-[42vh] overflow-y-auto rounded-lg border border-zinc-200 text-xs">
                {taskSchedules.length > 0 ? (
                  taskSchedules.map((schedule) => (
                    <div key={schedule.id} className="flex flex-wrap items-center gap-2 border-b border-zinc-100 px-3 py-2 last:border-b-0">
                      <span className="font-medium text-zinc-900">{schedule.name}</span>
                      <span className="text-zinc-500">{schedule.times.join(', ')}</span>
                      <span className={schedule.enabled ? 'text-emerald-600' : 'text-zinc-400'}>
                        {schedule.enabled ? '已启用' : '已暂停'}
                      </span>
                      {schedule.lastTriggeredAt ? <span className="text-zinc-500">上次触发 {formatBeijingDateTime(schedule.lastTriggeredAt)}</span> : null}
                      <button
                        type="button"
                        onClick={() =>
                          void updateTaskScheduleItem(schedule.id, { enabled: !schedule.enabled })
                            .then(() => setSuccess(schedule.enabled ? '定时计划已暂停' : '定时计划已启用'))
                            .catch((e: unknown) => setError(e instanceof Error ? e.message : '更新计划失败'))
                        }
                        className="ml-auto text-blue-600 hover:text-blue-700">
                        {schedule.enabled ? '暂停' : '启用'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          void deleteTaskScheduleItem(schedule.id)
                            .then(() => setSuccess('定时计划已删除'))
                            .catch((e: unknown) => setError(e instanceof Error ? e.message : '删除计划失败'))
                        }
                        className="text-rose-600 hover:text-rose-700">
                        删除
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-6 text-center text-zinc-400">暂无定时计划</div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {showFilterTools ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
            onClick={() => setShowFilterTools(false)}>
            <div
              className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">筛选与选择</h2>
                <button
                  type="button"
                  onClick={() => setShowFilterTools(false)}
                  className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200">
                  关闭
                </button>
              </div>
              <div className="grid gap-2 text-xs sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-zinc-500">邀请码</span>
                  <select
                    value={showUnlinkedOnly ? '__unlinked__' : linkFilterId}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '__unlinked__') {
                        setShowUnlinkedOnly(true)
                        setLinkFilterId('')
                        setLinkFilterInput('')
                      } else {
                        setShowUnlinkedOnly(false)
                        setLinkFilterId(value)
                        setLinkFilterInput('')
                      }
                      setSelectedAccountIds([])
                    }}
                    className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-zinc-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200">
                    <option value="">全部账号</option>
                    <option value="__unlinked__">未关联邀请码</option>
                    {publicLinks.map((link) => (
                      <option key={link.linkId} value={link.linkId}>
                        {link.linkId}（{link.accountCount}）
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-zinc-500">链接 ID</span>
                  <input
                    value={linkFilterInput}
                    onChange={(e) => {
                      setShowUnlinkedOnly(false)
                      setLinkFilterId('')
                      setLinkFilterInput(e.target.value)
                      setSelectedAccountIds([])
                    }}
                    placeholder="输入链接ID筛选"
                    className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-zinc-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                  />
                </label>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setShowUnlinkedOnly((prev) => {
                      const next = !prev
                      if (next) {
                        setLinkFilterId('')
                        setLinkFilterInput('')
                      }
                      return next
                    })
                    setSelectedAccountIds([])
                  }}
                  className={cn(
                    'h-8 rounded-md px-3 font-medium',
                    showUnlinkedOnly ? 'bg-amber-100 text-amber-800' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200',
                  )}>
                  {showUnlinkedOnly ? '已仅看未关联' : '仅看未关联'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const visibleIds = accountsToRender.map((account) => account.id)
                    setSelectedAccountIds((prev) => {
                      if (allVisibleSelected) return prev.filter((id) => !visibleIds.includes(id))
                      return Array.from(new Set([...prev, ...visibleIds]))
                    })
                  }}
                  disabled={accountsToRender.length === 0}
                  className={cn(
                    'h-8 rounded-md px-3 font-medium',
                    accountsToRender.length > 0 ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200' : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                  )}>
                  {allVisibleSelected ? '取消当前筛选' : '全选当前筛选'}
                </button>
                <span className="text-zinc-500">未关联 {unlinkedAccountsCount} 个，当前 {accountsToRender.length} 个，已选 {selectedAccountIds.length} 个</span>
              </div>
            </div>
          </div>
        ) : null}

        {wedRechargeAccountId ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-4 shadow-xl">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-zinc-900">
                    周三充值日拼图活动
                  </h3>
                  <div className="mt-1 text-xs text-zinc-500">
                    账号：{wedRechargeAccount?.displayPhone || wedRechargeAccount?.phoneMasked || wedRechargeAccountId}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeWedRechargePanel}
                  className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200">
                  关闭
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-white px-2 py-1 font-medium text-zinc-700">
                      当前轮次：{wedRechargeInfo?.activeIndex ? `dp${wedRechargeInfo.activeIndex}` : '未查询'}
                    </span>
                    <span className="rounded-full bg-white px-2 py-1 font-medium text-zinc-700">
                      剩余抽取：{wedRechargeInfo?.drawTimes ?? '—'}
                    </span>
                    <span className="rounded-full bg-white px-2 py-1 font-medium text-zinc-700">
                      更新时间：{formatBeijingDateTime(wedRechargeInfo?.updatedAt || wedRechargeAccount?.wedRechargeUpdatedAt)}
                    </span>
                  </div>
                  {wedRechargeInfo?.pictureList ? (
                    <div className="space-y-2 text-xs text-zinc-700">
                      {Object.entries(wedRechargeInfo.pictureList).map(([round, pieces]) => (
                        <div key={round} className="rounded-lg border border-zinc-200 bg-white p-2">
                          <div className="mb-1 font-medium text-zinc-900">第 {round} 轮</div>
                          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                            {Object.entries(pieces).map(([pieceId, count]) => (
                              <div
                                key={pieceId}
                                className={cn(
                                  'rounded-md px-2 py-1',
                                  Number(count) > 0
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-zinc-50 text-zinc-500',
                                )}>
                                {pieceId}: {count}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-zinc-200 bg-white p-4 text-center text-xs text-zinc-500">
                      还没有查询碎片情况。
                    </div>
                  )}
                </div>

                <div className="space-y-3 rounded-xl border border-zinc-200 p-3 text-xs text-zinc-700">
                  <div className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-zinc-50">
                    <div className="flex items-center justify-between gap-3 px-3 py-2">
                      <span className="text-zinc-500">活动凭证</span>
                      <span className="font-medium text-zinc-900">10086 CK</span>
                    </div>
                    <div className="flex items-start justify-between gap-3 px-3 py-2">
                      <span className="text-zinc-500">自动任务</span>
                      <span className="text-right font-medium text-zinc-900">类型 1-6</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={Boolean(wedRechargeLoading)}
                      onClick={() => void queryWedRecharge(wedRechargeAccountId)}
                      className="rounded-lg bg-zinc-100 px-3 py-2 font-medium text-zinc-700 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:text-zinc-400">
                      {wedRechargeLoading === 'query'
                          ? '查询中'
                          : '查询碎片'}
                    </button>
                    <button
                      type="button"
                      disabled={Boolean(wedRechargeLoading)}
                      onClick={() => void runWedRecharge(wedRechargeAccountId)}
                      className="rounded-lg bg-zinc-900 px-3 py-2 font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-200">
                      {wedRechargeLoading === 'run'
                          ? '执行中'
                          : '一键完成'}
                    </button>
                  </div>
                  {wedRechargeSuccess ? (
                    <div className="whitespace-pre-line rounded-lg bg-emerald-50 p-2 text-emerald-700">
                      {wedRechargeSuccess}
                    </div>
                  ) : null}
                  {wedRechargeError ? (
                    <div className="rounded-lg bg-red-50 p-2 text-red-700">
                      {wedRechargeError}
                    </div>
                  ) : null}
                  {wedRechargeTask ? (
                    <div className="rounded-lg border border-sky-200 bg-sky-50 p-2 text-sky-800">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-medium">
                          后台任务：{wedRechargeTask.status} · {wedRechargeTask.completedCount}/
                          {wedRechargeTask.totalCount}
                        </div>
                        <button
                          type="button"
                          onClick={() => openTaskLogModal(wedRechargeTask)}
                          className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 font-medium text-sky-700 hover:bg-sky-100">
                          <FileText className="h-3.5 w-3.5" />
                          日志
                        </button>
                      </div>
                      <div className="mt-2 text-[11px]">
                        任务已在服务端执行，关闭弹窗也不会中断。
                      </div>
                    </div>
                  ) : null}
                  <div className="text-[11px] leading-5 text-zinc-500">
                    周三拼图会先用当前 10086 CK 自动刷新活动会话，再查询或执行任务。
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {taskLogModalTask ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="shrink-0 flex items-center justify-between border-b border-zinc-200 px-5 py-4">
                <div>
                  <div className="text-lg font-semibold text-zinc-900">任务日志</div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {formatTaskTypeName(taskLogModalTask.type)} · {taskLogModalTask.status} · {taskLogModalTask.completedCount}/{taskLogModalTask.totalCount}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void loadTaskById(taskLogModalTask.id).catch(() => undefined)}
                    className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200">
                    刷新
                  </button>
                  {taskLogModalTask.status === 'pending' || taskLogModalTask.status === 'running' ? (
                    <button
                      type="button"
                      onClick={() => void cancelTask(taskLogModalTask.id)}
                      className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100">
                      停止任务
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setTaskLogModalTask(null)}
                    className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200">
                    关闭
                  </button>
                </div>
              </div>
              <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[280px_1fr]">
                <div className="min-h-0 border-b border-zinc-200 bg-zinc-50 p-3 lg:border-b-0 lg:border-r">
                  <div className="mb-2 text-xs font-medium text-zinc-500">任务队列</div>
                  <div className="max-h-72 space-y-2 overflow-auto lg:max-h-none lg:h-[calc(88vh-130px)]">
                    {activeAdminTasks.length > 0 ? activeAdminTasks.map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          'rounded-lg border px-3 py-2 text-xs',
                          task.id === taskLogModalTask.id
                            ? 'border-sky-300 bg-sky-50 text-sky-900'
                            : 'border-zinc-200 bg-white text-zinc-700',
                        )}>
                        <button
                          type="button"
                          onClick={() => openTaskLogModal(task)}
                          className="w-full text-left">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium">{formatTaskTypeName(task.type)}</span>
                            <span>{task.status}</span>
                          </div>
                          <div className="mt-1 text-zinc-500">{task.completedCount}/{task.totalCount}</div>
                        </button>
                        {task.status === 'pending' || task.status === 'running' ? (
                          <button
                            type="button"
                            onClick={() => void cancelTask(task.id)}
                            className="mt-2 rounded-md bg-red-50 px-2 py-1 font-medium text-red-700 hover:bg-red-100">
                            停止
                          </button>
                        ) : null}
                      </div>
                    )) : (
                      <div className="rounded-lg border border-dashed border-zinc-200 bg-white p-3 text-xs text-zinc-500">
                        暂无进行中的任务。
                      </div>
                    )}
                  </div>
                </div>
                <div className="min-h-0 overflow-y-auto p-4">
                  <div className="mb-3 grid gap-2 text-xs text-zinc-700 sm:grid-cols-4">
                    <div className="rounded-lg bg-zinc-50 p-2">总数：{taskLogModalTask.totalCount}</div>
                    <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">成功：{taskLogModalTask.successCount}</div>
                    <div className="rounded-lg bg-red-50 p-2 text-red-700">失败：{taskLogModalTask.failedCount}</div>
                    <div className="rounded-lg bg-zinc-50 p-2">跳过：{taskLogModalTask.skippedCount}</div>
                  </div>
                  {taskLogModalTask.message ? (
                    <div className="mb-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
                      {taskLogModalTask.message}
                    </div>
                  ) : null}
                  <div className="space-y-2">
                    {taskLogModalTask.items.map((item) => (
                      <div key={item.id} className="rounded-lg border border-zinc-200 bg-white p-3 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="font-medium text-zinc-900">
                            {item.orderIndex + 1}. {item.accountLabel || item.accountId}
                          </div>
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 font-medium',
                              item.status === 'success'
                                ? 'bg-emerald-50 text-emerald-700'
                                : item.status === 'failed'
                                  ? 'bg-red-50 text-red-700'
                                  : item.status === 'running'
                                    ? 'bg-sky-50 text-sky-700'
                                    : 'bg-zinc-100 text-zinc-600',
                            )}>
                            {item.status}
                          </span>
                        </div>
                        {item.message ? (
                          <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-2 leading-5 text-zinc-700">
                            {item.message}
                          </pre>
                        ) : (
                          <div className="mt-2 text-zinc-400">暂无日志</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <section className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
          <div className="mb-2 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h2 className="shrink-0 text-sm font-semibold">
                账号列表
                <span className="ml-2 text-xs font-normal text-zinc-500">
                  有效 {accounts.filter((a) => a.hasCookie).length} / 共 {accounts.length}
                </span>
              </h2>
              <div className="inline-flex max-w-full overflow-x-auto rounded-full bg-zinc-100 p-1 text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => setRewardTab('all')}
                  className={cn(
                    'rounded-full px-2 py-1 transition',
                    rewardTab === 'all'
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-500',
                  )}>
                  全部({sortedAccounts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setRewardTab('unreceived')}
                  className={cn(
                    'rounded-full px-2 py-1 transition',
                    rewardTab === 'unreceived'
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-500',
                  )}>
                  未领取({unreceivedAccounts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setRewardTab('received')}
                  className={cn(
                    'rounded-full px-2 py-1 transition',
                    rewardTab === 'received'
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-500',
                  )}>
                  已领取({receivedAccounts.length})
                </button>
              </div>
              <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-zinc-100 p-1 text-[11px] font-medium text-zinc-600">
                <span className="px-2 py-1 text-[10px] uppercase tracking-wide text-zinc-400">
                  CK 状态
                </span>
                {[
                  { label: `全部(${accounts.length})`, value: 'all' },
                  { label: `有效(${ckValidityCounts.valid})`, value: 'valid' },
                  {
                    label: `无效(${ckValidityCounts.invalid + ckValidityCounts.unknown})`,
                    value: 'invalid',
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setCkFilter(option.value as 'all' | 'valid' | 'invalid')
                    }
                    className={cn(
                      'rounded-full px-2 py-1 transition text-[11px]',
                      ckFilter === option.value
                        ? 'bg-white text-zinc-900 shadow-sm'
                        : 'text-zinc-500',
                    )}>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <label className="flex h-8 min-w-[220px] items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200">
                <Search className="h-3.5 w-3.5 text-zinc-400" />
                <input
                  value={accountSearchInput}
                  onChange={(e) => {
                    setAccountSearchInput(e.target.value)
                    setSelectedAccountIds([])
                  }}
                  placeholder="手机号/备注/链接"
                  className="w-full min-w-0 bg-transparent text-xs text-zinc-700 outline-none"
                />
              </label>
              <button
                type="button"
                onClick={() => setShowFilterTools(true)}
                className="inline-flex h-8 items-center gap-1 rounded-md bg-zinc-100 px-3 font-medium text-zinc-700 hover:bg-zinc-200">
                <Search className="h-3.5 w-3.5" />
                筛选
              </button>
              <button
                type="button"
                onClick={() => setShowScheduleSettings(true)}
                className="inline-flex h-8 items-center gap-1 rounded-md bg-zinc-100 px-3 font-medium text-zinc-700 hover:bg-zinc-200">
                <RefreshCcw className="h-3.5 w-3.5" />
                定时
              </button>
              <div className="flex items-center gap-1 rounded-md bg-zinc-50 px-2 py-1">
                <span className="text-zinc-500">邀请码</span>
                <label className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={linkCountInput}
                    onChange={(e) => {
                      const next = Number(e.target.value)
                      if (Number.isNaN(next)) {
                        setLinkCountInput(1)
                        return
                      }
                      setLinkCountInput(
                        Math.max(1, Math.min(50, Math.floor(next))),
                      )
                    }}
                    className="h-7 w-14 rounded-md border border-zinc-200 bg-white px-1.5 text-xs text-zinc-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                  />
                </label>
                <button
                  type="button"
                  onClick={onCreatePublicLink}
                  className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-1 font-medium text-white hover:bg-zinc-800">
                  生成
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLinksModal(true)
                    void refreshPublicLinks()
                  }}
                  className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 font-medium text-zinc-700 hover:bg-zinc-200">
                  查看
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowGlobalToolbox(true)}
                className="inline-flex h-8 items-center gap-1 rounded-md bg-zinc-900 px-3 font-medium text-white hover:bg-zinc-800">
                <Wrench className="h-3.5 w-3.5" />
                工具箱
              </button>
            </div>
          </div>

          <div className="mb-2 flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs text-zinc-600">
              <span>当前 {accountsToRender.length} 个</span>
              <span>未关联 {unlinkedAccountsCount} 个</span>
              <span>已选 {selectedAccountIds.length} 个</span>
              {linkFilterId || linkFilterInput || showUnlinkedOnly ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">筛选中</span>
              ) : null}
              {activeAdminTasks.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    void loadActiveAdminTasks().then((tasks) => {
                      if (tasks[0]) openTaskLogModal(tasks[0])
                    }).catch(() => undefined)
                  }}
                  className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-1 font-medium text-sky-700 hover:bg-sky-100">
                  <FileText className="h-3.5 w-3.5" />
                  后台任务 {activeAdminTasks.length} 个
                </button>
              ) : null}
              {activeAdminTask ? (
                <button
                  type="button"
                  onClick={() => openTaskLogModal(activeAdminTask)}
                  className="rounded-md bg-sky-50 px-2 py-1 text-sky-800 hover:bg-sky-100">
                  当前任务 {activeAdminTask.completedCount}/{activeAdminTask.totalCount}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setShowGlobalToolbox(true)}
                disabled={selectedAccountIds.length === 0 || adminTaskRunning}
                className={cn(
                  'inline-flex h-8 items-center justify-center gap-1 rounded-md px-2 font-medium',
                  selectedAccountIds.length > 0 && !adminTaskRunning
                    ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                    : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                )}>
                <Wrench className="h-3.5 w-3.5" />
                选中工具箱
              </button>
              <button
                type="button"
                onClick={() => {
                  const visibleIds = accountsToRender.map((account) => account.id)
                  setSelectedAccountIds((prev) => {
                    if (allVisibleSelected) {
                      return prev.filter((id) => !visibleIds.includes(id))
                    }
                    return Array.from(new Set([...prev, ...visibleIds]))
                  })
                }}
                disabled={accountsToRender.length === 0}
                className={cn(
                  'h-8 rounded-md px-2 font-medium',
                  accountsToRender.length > 0
                    ? 'bg-white text-zinc-700 hover:bg-zinc-100'
                    : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                )}>
                {allVisibleSelected ? '取消当前筛选' : '全选当前筛选'}
              </button>
              <button
                type="button"
                onClick={() => void onDisableSelectedAccounts()}
                disabled={selectedAccountIds.length === 0 || batchDisablingAccounts}
                className={cn(
                  'inline-flex h-8 items-center justify-center gap-1 rounded-md px-2 font-medium',
                  selectedAccountIds.length > 0 && !batchDisablingAccounts
                    ? 'bg-red-50 text-red-700 hover:bg-red-100'
                    : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                )}>
                {batchDisablingAccounts ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : null}
                批量失效处理
              </button>
              <button
                type="button"
                onClick={() => void onDeleteSelectedAccounts()}
                disabled={selectedAccountIds.length === 0 || batchDeletingAccounts}
                className={cn(
                  'inline-flex h-8 items-center justify-center gap-1 rounded-md px-2 font-medium',
                  selectedAccountIds.length > 0 && !batchDeletingAccounts
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                )}>
                {batchDeletingAccounts ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : null}
                批量删除
              </button>
          </div>

          <div className="mb-2 rounded-lg border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] text-blue-700 md:hidden">
            表格可横向滑动；常用批量操作在上方工具区。
          </div>
          <div className="max-h-[78vh] overflow-x-auto overflow-y-auto rounded-lg border border-zinc-200">
            <table className="min-w-[960px] w-full table-fixed text-left text-[11px]">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="w-[4%] px-2 py-1.5 font-medium">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      disabled={accountsToRender.length === 0}
                      onChange={() => {
                        const visibleIds = accountsToRender.map((account) => account.id)
                        setSelectedAccountIds((prev) => {
                          if (allVisibleSelected) {
                            return prev.filter((id) => !visibleIds.includes(id))
                          }
                          return Array.from(new Set([...prev, ...visibleIds]))
                        })
                      }}
                      className="h-3.5 w-3.5 rounded border-zinc-300"
                    />
                  </th>
                  <th className="w-[16%] px-2 py-1.5 font-medium">
                    <button
                      type="button"
                      onClick={() => toggleSort('account')}
                      className="inline-flex items-center gap-1">
                      账号 {sortIndicator('account')}
                    </button>
                  </th>
                  <th className="w-[18%] px-2 py-1.5 font-medium">
                    <button
                      type="button"
                      onClick={() => toggleSort('cookieUpdatedAt')}
                      className="inline-flex items-center gap-1">
                      Cookie {sortIndicator('cookieUpdatedAt') || '⇅'}
                    </button>
                  </th>
                  <th className="w-[20%] px-2 py-1.5 font-medium">用户信息</th>
                  <th className="w-[16%] px-2 py-1.5 font-medium">
                    <button
                      type="button"
                      onClick={() => toggleSort('xdr')}
                      className="inline-flex items-center gap-1">
                      全球通信息 {sortIndicator('xdr') || '⇅'}
                    </button>
                  </th>
                  <th className="w-[14%] px-2 py-1.5 font-medium">
                    <button
                      type="button"
                      onClick={() => toggleSort('token')}
                      className="inline-flex items-center gap-1">
                      access_token {sortIndicator('token') || '⇅'}
                    </button>
                  </th>
                  <th className="w-[14%] px-2 py-1.5 font-medium">
                    <button
                      type="button"
                      onClick={() => toggleSort('signUpdatedAt')}
                      className="inline-flex items-center gap-1">
                      签到结果 {sortIndicator('signUpdatedAt') || '⇅'}
                    </button>
                  </th>
                  <th className="w-[10%] px-2 py-1.5 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {accountsToRender.length === 0 ? (
                  <tr>
                    <td className="px-2 py-4 text-center text-zinc-500" colSpan={8}>
                      {accounts.length === 0
                        ? '暂无账号，请先在上方输入手机号并完成登录。'
                        : '当前筛选条件下暂无账号。'}
                    </td>
                  </tr>
                ) : null}

                {accountsToRender.map((a) => {
                  const isExpanded = expandedAccountId === a.id
                  const activation = activationById[a.id] ?? { status: 'idle' }
                  const isRefreshing = Boolean(refreshingById[a.id])
                  const sessionBusy = sessionBusyById[a.id]
                  const sessionCapability = sessionCapabilitiesById[a.id]
                  const sessionCapabilityLoading = Boolean(sessionCapabilityLoadingById[a.id])
                  const qqtState = qqtById[a.id]
                  const signPayload =
                    qqtState?.signSource === 'info'
                      ? qqtState.signInfo
                      : (qqtState?.signResult ?? qqtState?.signInfo)
                  const qqtSignSummary = signPayload
                    ? parseQqtSignSummary(signPayload)
                    : null
                  const qqtLoading = qqtState?.loading
                  const qqtBusy = Boolean(qqtLoading)
                  const accessTokenValue =
                    qqtState?.accessToken || a.qqtAccessToken || ''
                  const tokenStatus =
                    qqtState?.tokenStatus ??
                    (accessTokenValue ? 'unknown' : 'none')
                  const tokenStatusText =
                    tokenStatus === 'valid'
                      ? '有效'
                      : tokenStatus === 'invalid'
                        ? '无效'
                        : tokenStatus === 'unknown'
                          ? '未验证'
                          : '无'
                  const tokenStatusColor =
                    tokenStatus === 'valid'
                      ? 'text-emerald-700'
                      : tokenStatus === 'invalid'
                        ? 'text-red-600'
                        : 'text-zinc-500'
                  const signUpdatedAt = qqtState?.signUpdatedAt
                  const cookieValid =
                    activation.status === 'ok'
                      ? activation.cookieValid
                      : activation.status === 'loading'
                        ? null
                        : null
                  const persistedInvalid =
                    Boolean(a.cookieInvalidAt) || cookieValid === false
                  const accountLogin = getAccountLoginState(a)
                  const cookieStatusText = accountLogin.yunpanOnly ? '云盘已登录' : activation.status === 'loading'
                      ? '检测中'
                      : persistedInvalid
                        ? '无效'
                        : !a.hasCookie
                          ? '未缓存'
                          : cookieValid === true
                        ? '有效'
                          : '未知'
                  const qqtSignText =
                    qqtSignSummary?.statusText &&
                    qqtSignSummary.statusText !== '未知'
                      ? qqtSignSummary.statusText
                      : signPayload
                        ? '已查询'
                        : qqtLoading === 'sign'
                          ? '签到中'
                          : qqtBusy
                            ? '处理中'
                            : '未签到'
                  const canQqtAction = Boolean(a.hasCookie || a.hasYunpanSession || accessTokenValue)
                  const canQqtTokenRefresh = Boolean(a.hasCookie || a.hasYunpanSession)
                  const qqtInfoRecord = a.qqtInfo
                  const qqtInfoData =
                    qqtInfoRecord && typeof qqtInfoRecord.data === 'object'
                      ? (qqtInfoRecord.data as Record<string, unknown>)
                      : undefined
                  const qqtDisplayLevel =
                    (qqtInfoData && typeof qqtInfoData.levelName === 'string'
                      ? qqtInfoData.levelName
                      : typeof qqtInfoRecord?.levelName === 'string'
                        ? qqtInfoRecord.levelName
                        : '—') ?? '—'
                  const qqtDisplayProvince =
                    (qqtInfoData && typeof qqtInfoData.province === 'string'
                      ? qqtInfoData.province
                      : typeof qqtInfoRecord?.province === 'string'
                        ? qqtInfoRecord.province
                        : '—') ?? '—'
                  const qqtDisplayUserLevel =
                    (qqtInfoData && typeof qqtInfoData.userLevel === 'string'
                      ? qqtInfoData.userLevel
                      : typeof qqtInfoRecord?.userLevel === 'string'
                        ? qqtInfoRecord.userLevel
                        : '—') ?? '—'
                  const qqtDisplayPhone =
                    (qqtInfoData && typeof qqtInfoData.phone === 'string'
                      ? qqtInfoData.phone
                      : typeof qqtInfoRecord?.phone === 'string'
                        ? qqtInfoRecord.phone
                        : a.displayPhone || a.phoneMasked || '—') ?? '—'
                  const qqtDisplayNetAge =
                    (qqtInfoData && qqtInfoData.netAge !== undefined
                      ? String(qqtInfoData.netAge)
                      : undefined) ??
                    (qqtInfoRecord?.netAge !== undefined
                      ? String(qqtInfoRecord.netAge)
                      : '—')
                  const xdr = xdrById[a.id]
                  const xdrPrizeNames = xdr
                    ? formatPrizeNames(xdr.prodList, xdrPrizeMap)
                    : '—'
                  const xdrPrizeText = xdr
                    ? xdr.prodList.length > 0
                      ? xdrPrizeNames
                      : '未领取'
                    : '—'
                  const wedTaskItem =
                    activeAdminTask?.type === 'wed_recharge'
                      ? activeAdminTask.items.find((item) => item.accountId === a.id)
                      : undefined
                  const wedStatusText = wedTaskItem
                    ? wedTaskItem.status === 'running'
                      ? '进行中'
                      : wedTaskItem.status === 'success'
                        ? '已完成'
                        : wedTaskItem.status === 'failed'
                          ? '失败'
                          : wedTaskItem.status === 'skipped'
                            ? '已跳过'
                            : '排队中'
                    : `未参与：当前次数 ${a.wedRechargeInfo?.drawTimes ?? '—'}`
                  return (
                    <tr
                      key={a.id}
                      className={cn(
                        activeAccountId === a.id ? 'bg-blue-50/40' : 'bg-white',
                      )}>
                      <td className="px-2 py-2 align-top">
                        <input
                          type="checkbox"
                          checked={selectedAccountIds.includes(a.id)}
                          onChange={() =>
                            setSelectedAccountIds((prev) =>
                              prev.includes(a.id)
                                ? prev.filter((id) => id !== a.id)
                                : [...prev, a.id],
                            )
                          }
                          className="h-3.5 w-3.5 rounded border-zinc-300"
                          aria-label={`选择账号 ${a.displayPhone || a.phoneMasked || a.id}`}
                        />
                      </td>
                      <td className="px-2 py-2 align-top">
                        <div className="text-zinc-900">
                          <span className="font-medium">{qqtDisplayPhone}</span>
                        </div>
                        <div className="mt-1 text-[11px] text-zinc-600">
                          全号: {a.phone || '未记录'}
                        </div>
                        <div className="mt-1 text-[11px] text-zinc-600">
                          邀请码:{' '}
                          {a.publicLinkIds && a.publicLinkIds.length > 0
                            ? a.publicLinkIds.join(', ')
                            : '未绑定'}
                        </div>
                      </td>
                      <td className="px-2 py-2 align-top">
                        <div
                          className={cn(
                            'font-medium',
                            a.hasCookie || accountLogin.hasYunpan ? 'text-emerald-700' : 'text-zinc-400',
                          )}>
                          {accountLogin.yunpanOnly ? '云盘已登录' : a.hasCookie ? '已缓存' : '未缓存'}
                        </div>
                        <div className="mt-1 text-zinc-500">
                          {a.cookieUpdatedAt
                            ? `更新: ${formatBeijingDateTime(a.cookieUpdatedAt)}`
                            : '—'}
                        </div>
                        <div className="mt-1 text-[11px] text-zinc-500">
                          方式: {formatLoginMethod(a.lastLoginMethod)}
                        </div>
                        {accountLogin.primaryExpireAt ? (
                          <div className="mt-1 text-[11px] text-zinc-500">
                            到期: {formatBeijingDateTime(accountLogin.primaryExpireAt)}（{formatExpiryRemain(accountLogin.primaryExpireAt)}）
                          </div>
                        ) : null}
                        <div
                          className={cn(
                            'mt-1 text-[11px] font-medium',
                            cookieStatusText === '有效' || accountLogin.hasYunpan
                              ? 'text-emerald-700'
                              : cookieStatusText === '无效'
                                ? 'text-red-600'
                                : 'text-zinc-500',
                          )}>
                          状态: {cookieStatusText}
                        </div>
                        {harHintById[a.id] ? (
                          <div className="mt-1 text-[11px] font-medium text-red-600">
                            {harHintById[a.id]}
                          </div>
                        ) : null}
                        {isExpanded ? (
                          <div className="mt-2 space-y-2">
                            <textarea
                              readOnly
                              value={expandedCookie}
                              placeholder={
                                a.hasCookie ? '加载中...' : '暂无 Cookie'
                              }
                              className="h-24 w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-[11px] leading-5 text-zinc-900 outline-none"
                            />

                            <div className="text-[11px] font-medium text-zinc-700">
                              会话能力
                            </div>
                            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-[11px] text-zinc-700">
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => inspectSessionCapability(a.id)}
                                  disabled={!a.hasCookie || sessionCapabilityLoading}
                                  className={cn(
                                    'inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium',
                                    a.hasCookie && !sessionCapabilityLoading
                                      ? 'bg-white text-zinc-700 hover:bg-zinc-100'
                                      : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                                  )}>
                                  {sessionCapabilityLoading ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : null}
                                  {sessionCapabilityLoading ? '检测中' : '检测会话'}
                                </button>
                                {sessionCapability ? (
                                  <span className="text-zinc-500">{sessionCapability.summary}</span>
                                ) : (
                                  <span className="text-zinc-400">未检测</span>
                                )}
                              </div>
                              {sessionCapability ? (
                                <div className="space-y-2">
                                  <div className="grid grid-cols-2 gap-1">
                                    {[
                                      ['基础10086', sessionCapability.groups.basic10086],
                                      ['活动页', sessionCapability.groups.activity],
                                      ['PC SSO', sessionCapability.groups.pcSso],
                                      ['CMCC App', sessionCapability.groups.cmccApp],
                                    ].map(([label, ok]) => (
                                      <div
                                        key={String(label)}
                                        className={cn(
                                          'rounded-md px-2 py-1 font-medium',
                                          ok
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-zinc-100 text-zinc-500',
                                        )}>
                                        {label}: {ok ? '具备' : '缺失'}
                                      </div>
                                    ))}
                                  </div>
                                  <div>
                                    <span className="text-zinc-500">已有字段:</span>{' '}
                                    {sessionCapability.availableFields.length > 0
                                      ? sessionCapability.availableFields.join(', ')
                                      : '—'}
                                  </div>
                                  <div>
                                    <span className="text-zinc-500">缺失字段:</span>{' '}
                                    {sessionCapability.missingFields.length > 0
                                      ? sessionCapability.missingFields.join(', ')
                                      : '—'}
                                  </div>
                                </div>
                              ) : null}
                            </div>

                            <div className="text-[11px] font-medium text-zinc-700">
                              用户信息
                            </div>
                            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-[11px] text-zinc-700">
                              {activation.status === 'ok' &&
                              activation.summary ? (
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <span className="text-zinc-500">套餐:</span>{' '}
                                    {activation.summary.tariffPackages ?? '—'}
                                  </div>
                                  <div>
                                    <span className="text-zinc-500">
                                      归属地:
                                    </span>{' '}
                                    {activation.summary.customerAssignment ??
                                      '—'}
                                  </div>
                                  <div>
                                    <span className="text-zinc-500">品牌:</span>{' '}
                                    {activation.summary.brandLevelName ?? '—'}
                                  </div>
                                  <div>
                                    <span className="text-zinc-500">
                                      号码星级:
                                    </span>{' '}
                                    {activation.summary.telNumStar ?? '—'}
                                  </div>
                                  <div>
                                    <span className="text-zinc-500">
                                      更新时间:
                                    </span>{' '}
                                    {activation.summary.oprTime ?? '—'}
                                  </div>
                                  <div>
                                    <span className="text-zinc-500">状态:</span>{' '}
                                    {cookieStatusText}
                                  </div>
                                </div>
                              ) : activation.status === 'loading' ? (
                                <div>激活中...</div>
                              ) : activation.status === 'error' ? (
                                <div className="text-red-600">
                                  {activation.message}
                                </div>
                              ) : (
                                <div>未激活</div>
                              )}
                            </div>

                            <div className="text-[11px] font-medium text-zinc-700">
                              激活原始数据（已解密）
                            </div>
                            <textarea
                              readOnly
                              value={
                                activation.status === 'ok'
                                  ? activation.decrypted
                                  : activation.status === 'loading'
                                    ? '激活中...'
                                    : activation.status === 'error'
                                      ? activation.message
                                      : ''
                              }
                              placeholder="未激活"
                              className="h-28 w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-[11px] leading-5 text-zinc-900 outline-none"
                            />
                          </div>
                        ) : null}
                      </td>
                      <td className="px-2 py-2 align-top">
                        <div className="space-y-1 text-[11px] text-zinc-700">
                          <div>
                            <span className="text-zinc-500">手机号:</span>{' '}
                            {qqtDisplayPhone}
                          </div>
                          {!accountLogin.yunpanOnly ? <>
                          <div>
                            <span className="text-zinc-500">品牌:</span>{' '}
                            {activation.status === 'ok'
                              ? (activation.summary?.brandLevelName ?? '—')
                              : '—'}
                          </div>
                          <div>
                            <span className="text-zinc-500">星级:</span>{' '}
                            {activation.status === 'ok'
                              ? (activation.summary?.telNumStar ?? '—')
                              : '—'}
                          </div>
                          <div>
                            <span className="text-zinc-500">主套餐:</span>{' '}
                            {activation.status === 'ok'
                              ? (activation.summary?.tariffPackages ?? '—')
                              : '—'}
                          </div>
                          <div>
                            <span className="text-zinc-500">归属地:</span>{' '}
                            {activation.status === 'ok'
                              ? (activation.summary?.customerAssignment ?? '—')
                              : '—'}
                          </div>
                          {activation.status !== 'ok' ? (
                            <div className="text-zinc-400">未激活</div>
                          ) : null}
                          </> : null}
                        </div>
                      </td>
                      <td className="px-2 py-2 align-top">
                        <div className="space-y-1 text-[11px] text-zinc-700">
                          <div>
                            <span className="text-zinc-500">全球通等级:</span>{' '}
                            {qqtDisplayLevel}
                          </div>
                          <div>
                            <span className="text-zinc-500">号码归属地:</span>{' '}
                            {qqtDisplayProvince}
                          </div>
                          <div>
                            <span className="text-zinc-500">等级码:</span>{' '}
                            {qqtDisplayUserLevel}
                          </div>
                          <div>
                            <span className="text-zinc-500">网龄:</span>{' '}
                            {qqtDisplayNetAge}
                          </div>
                          <div>
                            <span className="text-zinc-500">手机号:</span>{' '}
                            {qqtDisplayPhone}
                          </div>
                          <div>
                            <span className="text-zinc-500">星动日奖品:</span>{' '}
                            {xdrPrizeText}
                          </div>
                          <div>
                            <span className="text-zinc-500">可领取次数:</span>{' '}
                            {xdr?.enjoycollectabletimes ?? '—'}
                          </div>
                          <div>
                            <span className="text-zinc-500">奖品查询时间:</span>{' '}
                            {formatBeijingDateTime(xdr?.updatedAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2 align-top">
                        <div className="space-y-2 text-[11px] text-zinc-700">
                          <textarea
                            readOnly
                            value={accessTokenValue}
                            placeholder="暂无 token"
                            className="h-16 w-full resize-none rounded-md border border-zinc-200 bg-white p-2 text-[11px] text-zinc-700 outline-none"
                          />
                          <div className="flex items-center justify-between">
                            <span
                              className={cn('font-medium', tokenStatusColor)}>
                              状态: {tokenStatusText}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={!canQqtTokenRefresh || qqtBusy}
                                onClick={() => refreshQqtToken(a.id, { force: true })}
                                className={cn(
                                  'rounded-md px-2 py-1 font-medium',
                                  canQqtTokenRefresh && !qqtBusy
                                    ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                    : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                                )}>
                                {qqtLoading === 'token' ? '刷新中' : '重取'}
                              </button>
                              <button
                                type="button"
                                disabled={!canQqtAction || qqtBusy}
                                onClick={() => queryQqtSignInfo(a.id)}
                                className={cn(
                                  'rounded-md px-2 py-1 font-medium',
                                  canQqtAction && !qqtBusy
                                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                    : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                                )}>
                                {qqtLoading === 'info' ? '验证中' : '验证'}
                              </button>
                            </div>
                          </div>
                          {qqtState?.tokenCheckedAt ? (
                            <div className="text-[10px] text-zinc-500">
                              验证:{' '}
                              {formatBeijingDateTime(qqtState.tokenCheckedAt)}
                            </div>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-2 py-2 align-top">
                        <div className="space-y-1 text-[11px] text-zinc-700">
                          <div>
                            <span className="text-zinc-500">状态:</span>{' '}
                            {qqtSignText}
                          </div>
                          {qqtSignSummary?.prize ? (
                            <div>
                              <span className="text-zinc-500">奖励:</span>{' '}
                              {qqtSignSummary.prize}
                            </div>
                          ) : null}
                          {qqtSignSummary?.message ? (
                            <div>
                              <span className="text-zinc-500">信息:</span>{' '}
                              {qqtSignSummary.message}
                            </div>
                          ) : null}
                          {signUpdatedAt ? (
                            <div className="text-zinc-500">
                              时间: {formatBeijingDateTime(signUpdatedAt)}
                            </div>
                          ) : null}
                          {qqtState?.error ? (
                            <div className="text-red-600">
                              签到异常: {qqtState.error}
                            </div>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-2 py-2 align-top">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => onToggleRow(a.id)}
                            className="rounded-lg bg-zinc-100 px-2 py-1 font-medium text-zinc-700 hover:bg-zinc-200">
                            {isExpanded ? '收起' : '查看'}
                          </button>

                          <button
                            type="button"
                            disabled={!a.hasCookie || copying}
                            onClick={async () => {
                              try {
                                const cookie = await fetchCookieForAccount(a.id)
                                await onCopy(cookie)
                              } catch (e) {
                                const msg =
                                  e instanceof Error ? e.message : '复制失败'
                                setError(msg)
                              }
                            }}
                            className={cn(
                              'inline-flex items-center gap-1 rounded-lg px-2 py-1 font-medium',
                              a.hasCookie && !copying
                                ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                                : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                            )}>
                            {copying ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            复制
                          </button>

                          <button
                            type="button"
                            onClick={() => setAccountToolboxId(a.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 font-medium text-zinc-700 hover:bg-zinc-200">
                            <Wrench className="h-3.5 w-3.5" />
                            工具箱
                          </button>

                          <button
                            type="button"
                            onClick={() => onRemoveAccount(a.id)}
                            className="rounded-lg bg-red-50 px-2 py-1 font-medium text-red-700 hover:bg-red-100">
                            删除
                          </button>

                          <button
                            type="button"
                            onClick={() => activeAdminTask ? openTaskLogModal(activeAdminTask) : undefined}
                            disabled={!wedTaskItem || !activeAdminTask}
                            className={cn(
                              'inline-flex items-center gap-1 rounded-lg px-2 py-1 font-medium',
                              wedTaskItem?.status === 'running'
                                ? 'bg-sky-50 text-sky-700'
                                : wedTaskItem?.status === 'success'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : wedTaskItem?.status === 'failed'
                                    ? 'bg-red-50 text-red-700'
                                    : wedTaskItem
                                      ? 'bg-zinc-100 text-zinc-600'
                                      : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                            )}>
                            {wedTaskItem ? <FileText className="h-3.5 w-3.5" /> : null}
                            {wedStatusText}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  )
}

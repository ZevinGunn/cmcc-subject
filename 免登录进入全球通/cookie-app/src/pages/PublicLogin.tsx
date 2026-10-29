import BrandLogo from '@/components/BrandLogo'
import PhoneInput from '@/components/PhoneInput'
import AccountActionMenu, { type AccountMenuAction } from '@/components/AccountActionMenu'
import { getAccountLoginState, getYunpanCredentialStatus } from '@/lib/accountLoginState'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { createPortal, flushSync } from 'react-dom'
import { createAccountSortable } from '@/lib/accountSortable'
import {
  ChevronDown,
  ChevronRight,
  ArrowDown,
  ArrowUp,
  BarChart3,
  CalendarDays,
  Cloud,
  ExternalLink,
  CheckCircle2,
  FileText,
  Grid2X2,
  GripVertical,
  KeyRound,
  List,
  ListChecks,
  Loader2,
  LogIn,
  MoreHorizontal,
  PackagePlus,
  Phone,
  Pin,
  PinOff,
  Puzzle,
  QrCode,
  RefreshCcw,
  Save,
  Send,
  Shield,
  ShoppingBag,
  Trash2,
  Wrench,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import AccountLoginDialog from '@/components/AccountLoginDialog'
import PublicExperienceControls from '@/components/PublicExperienceControls'
import type { PublicAnnouncementData } from '@/components/PublicExperienceControls'
import SsoNavigationDialog from '@/components/SsoNavigationDialog'
import CallbackAppointmentDialog, { type CallbackAccount } from '@/components/CallbackAppointmentDialog'
import {
  extractXdrReceive,
  formatPrizeNames,
  loadXdrPrizeMap,
} from '@/lib/xdrPrize'
import { reorderAccountsForDrop } from '@/lib/accountOrder'
import { calculateViewportMenuPosition, type ViewportMenuPosition } from '@/lib/floatingMenu'

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

const ACCOUNT_IDS_KEY = 'public_login_account_ids'
const ACCOUNTS_CACHE_KEY = 'public_login_accounts'
const CACHE_VALID_MS = 50 * 60 * 1000
const SMS_EXPIRY_WARN_MS = 12 * 60 * 60 * 1000
const WED_APP_TOKEN_CONFIG_KEY = 'wed_recharge_app_token_config'
const ACCOUNT_VIEW_MODE_KEY = 'public_login_account_view_mode'

type AccountViewMode = 'grid' | 'list'

function AccountDragHandle({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <span
      data-account-drag-handle
      title="拖拽调整顺序"
      aria-hidden="true"
      className="account-drag-handle grid h-9 w-9 shrink-0 place-items-center text-zinc-400">
      <GripVertical className="h-4 w-4" />
    </span>
  )
}

type AccountSummary = {
  id: string
  label?: string
  phone?: string
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
  qqtAccessToken?: string
  qqtAccessTokenCheckedAt?: string
  qqtInfo?: Record<string, unknown>
  hasYunpanSession?: boolean
  disabledAt?: string
  yunpanSessionUpdatedAt?: string
  yunpanSessionCheckedAt?: string
  yunpanSessionInvalidAt?: string
  qqtSignInfo?: Record<string, unknown>
  qqtSignResult?: Record<string, unknown>
  qqtSignUpdatedAt?: string
  xdrReceive?: Record<string, unknown>
  xdrReceiveUpdatedAt?: string
  wedRechargeInfo?: WedRechargeInfo
  wedRechargeUpdatedAt?: string
  smsLoginAt?: string
  smsLoginExpireAt?: string
  publicPinnedAt?: string
  publicSortOrder?: number
  updatedAt: string
}

type WedRechargeInfo = {
  activeIndex?: number
  drawTimes?: string
  pictureList?: Record<string, Record<string, string>>
  updatedAt?: string
}

type SignState = {
  message: string
  updatedAt: string
}

type PublicPushConfig = {
  pushplusEnabled: boolean
  url?: string
  ipUrl?: string
  subscribeUrl?: string
  qrImageUrl?: string
  qrNote?: string
  redirectEnabled?: boolean
  redirectUrl?: string
  redirectNote?: string
}

type PublicUser = {
  id: string
  username: string
  displayName?: string
  permissions?: {
    businessQuery?: boolean
    shopQuery?: boolean
    businessOrder?: boolean
    benefitActivity?: boolean
  }
}

type YunpanSsoLinkResult = {
  ssoUrl: string
  ssoToken: string
}

type AigouSsoLinkResult = {
  ssoUrl: string
}

type CocPackageTarget = 'building_bricks' | 'diamond_package' | 'age_feed' | 'smart_life' | 'five_ga'

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
  type: 'refresh' | 'sign' | 'refresh_and_sign' | 'wed_recharge' | 'yunpan_activate' | 'ck_maintenance' | 'global_telecom_resign' | 'cmcc_auto_checkin'
  scopeType: 'admin_all' | 'public_link' | 'account' | 'user'
  scopeId?: string
  source: string
  scheduleId?: string
  status: 'pending' | 'running' | 'success' | 'failed' | 'partial_success'
  totalCount: number
  completedCount: number
  successCount: number
  failedCount: number
  skippedCount: number
  currentLabel?: string
  message?: string
  items: BatchTaskItem[]
  createdAt: string
  updatedAt: string
}

type DailyTaskState = {
  taskType: string
  status: string
  message?: string
  updatedAt?: string
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

type MessageNotice = {
  id: number
  type: 'success' | 'error'
  text: string
}

function onlyDigits(value: string): string {
  return value.replace(/\D+/g, '')
}

function appRoute(path: string): string {
  const pathname = window.location.pathname
  if (pathname.startsWith('/app/cmcc-public')) return `/app/cmcc-public${path}`
  if (pathname.startsWith('/app/cmcc-user')) return `/app/cmcc-user${path}`
  return path
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

function parseSignMessage(result: unknown): string {
  if (!result || typeof result !== 'object') return '签到完成'
  const obj = result as Record<string, unknown>
  const data = obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)
    ? obj.data as Record<string, unknown>
    : undefined
  if (Array.isArray(data?.signDates) && data.signDates.length > 0) {
    const statuses = data.signDates
      .map((item) => item && typeof item === 'object' && !Array.isArray(item)
        ? Number((item as Record<string, unknown>).signStatus)
        : Number.NaN)
      .filter((status) => Number.isFinite(status))
    if (statuses.length > 0) {
      return statuses.some((status) => status === 0) ? '今日未签到' : '今日已签到'
    }
  }
  if (typeof obj.msg === 'string' && obj.msg.trim()) return obj.msg.trim()
  if (typeof obj.message === 'string' && obj.message.trim()) return obj.message.trim()
  if (typeof obj.resultDesc === 'string' && obj.resultDesc.trim()) {
    return obj.resultDesc.trim()
  }
  const status = obj.status
  if (status === 1 || status === '1') return '签到成功'
  if (status === 0 || status === '0') return '今日已签到或签到失败'
  return '签到完成'
}

function parseSignStateFromAccount(account: AccountSummary): SignState | undefined {
  const updatedAt = account.qqtSignUpdatedAt
  if (!updatedAt) return undefined
  const fromInfo = parseSignMessage(account.qqtSignInfo)
  const fromResult = parseSignMessage(account.qqtSignResult)
  const message =
    fromResult && fromResult !== '签到完成'
      ? fromResult
      : fromInfo && fromInfo !== '签到完成'
        ? fromInfo
        : '已缓存签到记录'
  return { message, updatedAt }
}

function parseActivationFromRecord(
  raw?: Record<string, unknown>,
): ActivationSummary | undefined {
  if (!raw) return undefined
  return parseActivationSummary(JSON.stringify(raw))
}

function parseMs(iso?: string): number {
  if (!iso) return 0
  const ms = Date.parse(iso)
  return Number.isFinite(ms) ? ms : 0
}

function formatSmsExpiryStatus(expireAt?: string): string {
  const expireMs = parseMs(expireAt)
  if (!expireMs) return ''
  const diff = expireMs - Date.now()
  if (diff <= 0) return '（已过期）'
  const hours = Math.floor(diff / (60 * 60 * 1000))
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
  return `（剩余 ${hours} 小时 ${minutes} 分）`
}

function getSmsLoginWindowState(expireAt?: string): 'expired' | 'expiring' | 'healthy' | 'unknown' {
  const expireMs = parseMs(expireAt)
  if (!expireMs) return 'unknown'
  const diff = expireMs - Date.now()
  if (diff <= 0) return 'expired'
  if (diff <= SMS_EXPIRY_WARN_MS) return 'expiring'
  return 'healthy'
}

function getEffectiveLoginExpireAt(account: AccountSummary): string | undefined {
  return getAccountLoginState(account).primaryExpireAt
}

function getQqtListProfile(
  account: AccountSummary,
  activation?: ActivationSummary | null,
): { netAge: string; region: string; level: string } {
  const info = account.qqtInfo
  const yunpanOnly = getAccountLoginState(account).yunpanOnly
  const data = info?.data && typeof info.data === 'object' && !Array.isArray(info.data)
    ? info.data as Record<string, unknown>
    : undefined
  const cmccProfile = info?.cmccProfile && typeof info.cmccProfile === 'object' && !Array.isArray(info.cmccProfile)
    ? info.cmccProfile as Record<string, unknown>
    : undefined
  const value = (keys: string[]): string | undefined => {
    for (const source of [data, yunpanOnly ? undefined : cmccProfile, info]) {
      for (const key of keys) {
        const raw = source?.[key]
        if (raw === undefined || raw === null) continue
        const text = String(raw).trim()
        if (text) return text
      }
    }
    return undefined
  }
  return {
    netAge: value(['netAge', 'userAge', 'networkAge', 'inNetAge']) ?? '—',
    region: value(['province', 'provinceName']) ?? (yunpanOnly ? undefined : activation?.customerAssignment) ?? '—',
    level: value(['levelName', 'brandLevelName']) ?? (yunpanOnly ? undefined : activation?.brandLevelName) ?? '—',
  }
}

function formatLoginMethod(method?: AccountSummary['lastLoginMethod']): string {
  if (method === 'cmcc_qr') return 'App扫码'
  if (method === 'yunpan') return '云盘'
  if (method === 'manual_cookie') return '手动CK'
  return '验证码'
}

function isAccountCacheFresh(account: AccountSummary): boolean {
  const latestMs = Math.max(
    parseMs(account.cookieUpdatedAt),
    parseMs(account.activationCheckedAt),
    parseMs(account.qqtAccessTokenCheckedAt),
    parseMs(account.xdrReceiveUpdatedAt),
    parseMs(account.updatedAt),
  )
  if (!latestMs) return false
  return Date.now() - latestMs <= CACHE_VALID_MS
}

function buildQrPreviewUrl(subscribeUrl?: string): string | undefined {
  const value = String(subscribeUrl || '').trim()
  if (!value) return undefined
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(value)}`
}

function withInviteLink(urlText: string, linkId: string): string {
  const value = String(urlText || '').trim()
  if (!value) return ''
  try {
    const url = new URL(value, window.location.origin)
    if (linkId) url.searchParams.set('link', linkId)
    return url.toString()
  } catch {
    const joiner = value.includes('?') ? '&' : '?'
    return `${value}${joiner}link=${encodeURIComponent(linkId)}`
  }
}

function isSameCurrentPage(urlText: string): boolean {
  try {
    const url = new URL(urlText, window.location.origin)
    return url.origin === window.location.origin && url.pathname === window.location.pathname
  } catch {
    return false
  }
}

function fallbackRedirectUrlForCurrentHost(): string {
  if (typeof window === 'undefined') return ''
  return ''
}

async function postJson<T>(url: string, body: unknown): Promise<ApiResp<T>> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return readJsonResponse<T>(res)
}

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text)
    return
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  textarea.remove()
  if (!copied) throw new Error('复制失败，请检查浏览器剪切板权限')
}

async function getJson<T>(url: string): Promise<ApiResp<T>> {
  const res = await fetch(url, { method: 'GET' })
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
    if (!json.ok) console.warn('[public-api-error]', json)
    return json
  } catch {
    const snippet = text.replace(/\s+/g, ' ').trim().slice(0, 500)
    console.warn('[public-api-invalid-json]', {
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

function buildClientHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}
  if (typeof navigator !== 'undefined') {
    if (navigator.userAgent) {
      headers['User-Agent'] = navigator.userAgent
    }
    if (navigator.language) {
      headers['Accept-Language'] = navigator.language
    }
    const nav = navigator as unknown as {
      userAgentData?: {
        brands?: { brand: string; version: string }[]
        platform?: string
        mobile?: boolean
      }
    }
    if (nav.userAgentData?.brands?.length) {
      const value = nav.userAgentData.brands
        .map((b) => `"${b.brand}";v="${b.version}"`)
        .join(', ')
      headers['sec-ch-ua'] = value
    }
    if (nav.userAgentData?.platform) {
      headers['sec-ch-ua-platform'] = `"${nav.userAgentData.platform}"`
    }
    if (typeof nav.userAgentData?.mobile === 'boolean') {
      headers['sec-ch-ua-mobile'] = nav.userAgentData.mobile ? '?1' : '?0'
    }
  }
  return headers
}

export default function PublicLogin() {
  const linkId = useMemo(() => {
    if (typeof window === 'undefined') return ''
    const params = new URLSearchParams(window.location.search)
    return params.get('link')?.trim() || ''
  }, [])
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loginMode, setLoginMode] = useState<'cmcc' | 'qqt' | 'cookie' | 'qr' | 'yunpan'>('cmcc')
  const [loginExpanded, setLoginExpanded] = useState(false)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [loginDialogAccount, setLoginDialogAccount] = useState<AccountSummary | null>(null)
  const [cookieText, setCookieText] = useState('')
  const [qrFlow, setQrFlow] = useState<QrLoginFlowState | null>(null)
  const [cooldown, setCooldown] = useState(0)
  const [sending, setSending] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const [importingCookie, setImportingCookie] = useState(false)
  const [qrBusy, setQrBusy] = useState(false)
  const [qrSaving, setQrSaving] = useState(false)
  const [accountId, setAccountId] = useState<string | null>(null)
  const [accountIds, setAccountIds] = useState<string[]>([])
  const [accounts, setAccounts] = useState<AccountSummary[]>([])
  const [accountViewMode, setAccountViewModeState] = useState<AccountViewMode>('grid')
  const [expandedAccountIds, setExpandedAccountIds] = useState<Record<string, boolean>>({})
  const [openAccountMenuId, setOpenAccountMenuId] = useState<string | null>(null)
  const [accountMenuPosition, setAccountMenuPosition] = useState<ViewportMenuPosition>()
  const [refreshingById, setRefreshingById] = useState<Record<string, boolean>>(
    {},
  )
  const [listRefreshing, setListRefreshing] = useState(false)
  const [activationById, setActivationById] = useState<
    Record<string, ActivationSummary | null>
  >({})
  const [signingById, setSigningById] = useState<Record<string, boolean>>({})
  const [signStateById, setSignStateById] = useState<Record<string, SignState>>({})
  const [xdrById, setXdrById] = useState<
    Record<
      string,
      { prodList: number[]; enjoycollectabletimes?: number; updatedAt?: string }
    >
  >({})
  const [xdrPrizeMap, setXdrPrizeMap] = useState<Record<string, string>>({})
  const [messageNotice, setMessageNotice] = useState<MessageNotice | null>(null)
  const [pendingSso, setPendingSso] = useState<{ url: string; destination: string } | null>(null)
  const [yunpanActionBusy, setYunpanActionBusy] = useState('')
  const yunpanActionInFlight = useRef(false)
  useEffect(() => {
    if (!pendingSso) return
    const timer = window.setTimeout(() => {
      setPendingSso(null)
      setError('链接已放置较久，请重新生成')
    }, 120000)
    return () => window.clearTimeout(timer)
  }, [pendingSso])
  const [callbackAccount, setCallbackAccount] = useState<CallbackAccount | null>(null)
  const [qqtSspid, setQqtSspid] = useState<string>('75442')
  const [linkValidated, setLinkValidated] = useState(false)
  const [pushConfig, setPushConfig] = useState<PublicPushConfig | null>(null)
  const [publicUser, setPublicUser] = useState<PublicUser | null>(null)
  const [announcementBootstrap, setAnnouncementBootstrap] = useState<PublicAnnouncementData>()
  const [authUsername, setAuthUsername] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [linkAutoLoginLoading, setLinkAutoLoginLoading] = useState(false)
  const [activeLinkTask, setActiveLinkTask] = useState<BatchTaskSummary | null>(null)
  const [activeLinkTasks, setActiveLinkTasks] = useState<BatchTaskSummary[]>([])
  const [taskLogModalTask, setTaskLogModalTask] = useState<BatchTaskSummary | null>(null)
  const [dailyLogModal, setDailyLogModal] = useState<{ title: string; states: DailyTaskState[] } | null>(null)
  const [showWedRechargeRunConfig, setShowWedRechargeRunConfig] = useState(false)
  const [wedRechargeUseAppToken, setWedRechargeUseAppToken] = useState(false)
  const [appTokenInput, setAppTokenInput] = useState('')
  const [appTokenActivitySid, setAppTokenActivitySid] = useState('')
  const [appTokenUserCheckId, setAppTokenUserCheckId] = useState('')
  const [wedAppTokenConfigLoaded, setWedAppTokenConfigLoaded] = useState(false)
  const [publicWedUseGlobalConfig, setPublicWedUseGlobalConfig] = useState(true)
  const [publicWedAppTokenInput, setPublicWedAppTokenInput] = useState('')
  const [publicWedAppTokenActivitySid, setPublicWedAppTokenActivitySid] = useState('')
  const [publicWedAppTokenUserCheckId, setPublicWedAppTokenUserCheckId] = useState('')
  const [dailyTaskStates, setDailyTaskStates] = useState<Record<string, DailyTaskState[]>>({})
  const linkFetchInFlightRef = useRef(false)
  const accountsFetchInFlightRef = useRef(false)
  const initialLoadRef = useRef(false)
  const linkAutoLoginRef = useRef('')
  const loginPanelRef = useRef<HTMLDivElement | null>(null)
  const accountListRef = useRef<HTMLDivElement | null>(null)
  const accountCardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const accountSortAccountsRef = useRef<AccountSummary[]>([])
  const persistAccountLayoutRef = useRef<(accounts: AccountSummary[]) => void>(() => undefined)
  const layoutSaveQueueRef = useRef<Promise<void>>(Promise.resolve())
  const layoutSaveVersionRef = useRef(0)
  const layoutSavePendingRef = useRef(0)
  const confirmedLayoutRef = useRef<AccountSummary[]>([])
  const longPressTimerRef = useRef<number | null>(null)
  const longPressStartRef = useRef<{ x: number; y: number } | null>(null)
  const qrPollTimerRef = useRef<number | null>(null)
  const qrPollingRef = useRef(false)
  const qrAutoSavingFlowRef = useRef<string | null>(null)
  accountSortAccountsRef.current = accounts

  const showMessage = useCallback((type: MessageNotice['type'], text: string) => {
    setMessageNotice({ id: Date.now(), type, text })
  }, [])

  const setError = useCallback(
    (value: string | null) => {
      if (value) showMessage('error', value)
    },
    [showMessage],
  )

  const setSuccess = useCallback(
    (value: string | null) => {
      if (value) showMessage('success', value)
    },
    [showMessage],
  )

  useEffect(() => {
    if (!messageNotice) return undefined
    const timer = window.setTimeout(() => {
      setMessageNotice((current) =>
        current?.id === messageNotice.id ? null : current,
      )
    }, 3000)
    return () => window.clearTimeout(timer)
  }, [messageNotice])

  const publicModalOpen = Boolean(
    showWedRechargeRunConfig || taskLogModalTask || dailyLogModal,
  )

  useEffect(() => {
    if (!publicModalOpen) return undefined
    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setShowWedRechargeRunConfig(false)
      setTaskLogModalTask(null)
      setDailyLogModal(null)
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [publicModalOpen])

  useEffect(() => {
    if (!openAccountMenuId) return undefined
    const close = () => setOpenAccountMenuId(null)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [openAccountMenuId])

  const normalizedPhone = useMemo(() => onlyDigits(phone), [phone])
  const normalizedCode = useMemo(() => onlyDigits(code).slice(0, 6), [code])
  const phoneValid = /^1\d{10}$/.test(normalizedPhone)
  const hasPublicAccess = Boolean(publicUser || (linkId && linkValidated))
  const canSend =
    phoneValid &&
    cooldown === 0 &&
    !sending &&
    !loggingIn &&
    !importingCookie &&
    hasPublicAccess &&
    loginMode !== 'cookie' &&
    loginMode !== 'qr'
  const canLogin =
    phoneValid &&
    normalizedCode.length === 6 &&
    !loggingIn &&
    !importingCookie &&
    hasPublicAccess &&
    loginMode !== 'cookie' &&
    loginMode !== 'qr'
  const canImportCookie =
    hasPublicAccess &&
    !loggingIn &&
    !importingCookie &&
    cookieText.trim().length > 0 &&
    (phone.length === 0 || phoneValid)
  const canStartQrLogin = hasPublicAccess && !qrBusy && !qrSaving
  const canSaveQrLogin =
    Boolean(qrFlow?.flowId) &&
    qrFlow?.status === 'success' &&
    !qrSaving &&
    (phone.length === 0 || phoneValid)
  const invalidAccountCount = accounts.filter((acc) => {
    const login = getAccountLoginState(acc)
    if (login.hasYunpan) return false
    const summary = activationById[acc.id]
    const hasToken = Boolean(acc.qqtAccessToken)
    return Boolean(acc.cookieInvalidAt) || (!acc.hasCookie && !acc.hasYunpanSession && !hasToken) || (acc.hasCookie && summary === null)
  }).length
  const usableAccountCount = accounts.filter(acc => getAccountLoginState(acc).loggedIn).length
  const cmccAccountCount = accounts.filter(acc => getAccountLoginState(acc).hasCmcc).length
  const globalTelecomRunnableAccountCount = accounts.filter(
    (acc) => getAccountLoginState(acc).loggedIn,
  ).length
  const unloggedAccountCount = accounts.length - usableAccountCount
  const expiringSoonCount = accounts.filter(
    (acc) => getSmsLoginWindowState(getEffectiveLoginExpireAt(acc)) === 'expiring',
  ).length
  const expiredSessionCount = accounts.filter(
    (acc) => getSmsLoginWindowState(getEffectiveLoginExpireAt(acc)) === 'expired',
  ).length
  const linkTaskRunning =
    activeLinkTask?.status === 'pending' || activeLinkTask?.status === 'running'
  const taskScopeType: 'user' | 'public_link' = publicUser ? 'user' : 'public_link'
  const taskScopeId = publicUser?.id || linkId
  const hasTaskAccess = Boolean(publicUser || (linkId && linkValidated))
  const canOrderBusiness = Boolean(publicUser?.permissions?.businessOrder)
  const canUseBenefitActivity = Boolean(publicUser?.permissions?.benefitActivity)
  const redirectTarget = useMemo(() => {
    if (!linkId || !linkValidated) {
      return ''
    }
    const baseUrl =
      (pushConfig?.redirectEnabled && pushConfig.redirectUrl) ||
      fallbackRedirectUrlForCurrentHost()
    if (!baseUrl) return ''
    const target = withInviteLink(baseUrl, linkId)
    if (!target || isSameCurrentPage(target)) return ''
    return target
  }, [linkId, linkValidated, pushConfig?.redirectEnabled, pushConfig?.redirectUrl])

  useEffect(() => {
    if (cooldown <= 0) return undefined
    const t = window.setInterval(() => {
      setCooldown((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => window.clearInterval(t)
  }, [cooldown])

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
    if (!normalizedPhone) return
    setAccountId(null)
  }, [normalizedPhone])

  useEffect(() => {
    document.title = '中国移动用户管理'
  }, [])

  useEffect(() => {
    if (window.localStorage.getItem(ACCOUNT_VIEW_MODE_KEY) === 'list') {
      setAccountViewModeState('list')
    }
  }, [])

  function setAccountViewMode(mode: AccountViewMode) {
    setAccountViewModeState(mode)
    window.localStorage.setItem(ACCOUNT_VIEW_MODE_KEY, mode)
  }

  useEffect(() => {
    const stored = window.localStorage.getItem('cmcc_qqt_sspid')
    if (stored && stored.trim()) setQqtSspid(stored)
    else setQqtSspid('75442')
  }, [])

  useEffect(() => {
    if (qqtSspid) {
      window.localStorage.setItem('cmcc_qqt_sspid', qqtSspid)
    } else {
      window.localStorage.removeItem('cmcc_qqt_sspid')
    }
  }, [qqtSspid])

  const activateAccount = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/accounts/${id}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicLinkId: linkId }),
      })
      const r = (await res.json()) as ApiResp<{
        encrypted: string
        decrypted: string
        cookieUpdated: boolean
        phoneUpdated?: boolean
      }>
      if (!r.ok) {
        setActivationById((prev) => ({ ...prev, [id]: null }))
        return false
      }
      const summary = parseActivationSummary(r.data.decrypted)
      setActivationById((prev) => ({ ...prev, [id]: summary ?? null }))
      return true
    } catch {
      setActivationById((prev) => ({ ...prev, [id]: null }))
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === id
            ? {
                ...acc,
                hasCookie: false,
                cookieInvalidAt: new Date().toISOString(),
              }
            : acc,
        ),
      )
      return false
    }
  }, [linkId])

  async function fetchXdrReceive(id: string) {
    try {
      const tokenResp = await postJson<{ accessToken: string }>(
        `/api/accounts/${id}/qqt/token`,
        { publicLinkId: linkId, force: true },
      )
      if (!tokenResp.ok || !tokenResp.data?.accessToken) return
      const r = await postJson<{ receive: unknown }>(
        `/api/accounts/${id}/qqt/xdr/receive`,
        {
          publicLinkId: linkId,
          accessToken: tokenResp.data.accessToken,
        },
      )
      if (!r.ok) return
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
    } catch {
      // ignore
    }
  }

  function hydrateCachedRuntime(list: AccountSummary[]) {
    const nextActivation: Record<string, ActivationSummary | null> = {}
    const nextXdr: Record<
      string,
      { prodList: number[]; enjoycollectabletimes?: number; updatedAt?: string }
    > = {}
    for (const acc of list) {
      if (acc.activationInfo) {
        nextActivation[acc.id] = parseActivationFromRecord(acc.activationInfo) ?? null
      }
      if (acc.xdrReceive) {
        const parsed = extractXdrReceive(acc.xdrReceive)
        if (parsed) {
          nextXdr[acc.id] = {
            prodList: parsed.prodList,
            enjoycollectabletimes: parsed.enjoycollectabletimes,
            updatedAt: acc.xdrReceiveUpdatedAt,
          }
        }
      }
    }
    if (Object.keys(nextActivation).length > 0) {
      setActivationById((prev) => ({ ...prev, ...nextActivation }))
    }
    if (Object.keys(nextXdr).length > 0) {
      setXdrById((prev) => ({ ...prev, ...nextXdr }))
    }
  }

  async function refreshUserAccounts() {
    const r = await getJson<{ accounts: AccountSummary[] }>('/api/auth/accounts')
    if (!r.ok) return undefined
    hydrateCachedRuntime(r.data.accounts)
    setAccounts(r.data.accounts)
    setAccountIds(r.data.accounts.map((item) => item.id))
    void refreshDailyTaskStates()
    return r.data.accounts
  }

  async function refreshUserBootstrap() {
    const r = await getJson<{
      user: PublicUser
      accounts: AccountSummary[]
      states: Record<string, DailyTaskState[]>
      announcements: PublicAnnouncementData
    }>('/api/auth/bootstrap')
    if (!r.ok) return undefined
    hydrateCachedRuntime(r.data.accounts)
    setPublicUser(r.data.user)
    setAccounts(r.data.accounts)
    setAccountIds(r.data.accounts.map((item) => item.id))
    setDailyTaskStates(r.data.states)
    setAnnouncementBootstrap(r.data.announcements)
    return r.data.accounts
  }

  async function persistAccountLayout(nextAccounts: AccountSummary[]) {
    if (!publicUser) return
    if (layoutSavePendingRef.current === 0) confirmedLayoutRef.current = accountSortAccountsRef.current
    const version = ++layoutSaveVersionRef.current
    layoutSavePendingRef.current++
    accountSortAccountsRef.current = nextAccounts
    setAccounts(nextAccounts)
    const save = async () => {
      try {
        const response = await fetch('/api/auth/accounts/order', {
          method: 'PATCH',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accountIds: nextAccounts.map((item) => item.id),
            pinnedAccountIds: nextAccounts.filter((item) => item.publicPinnedAt).map((item) => item.id),
          }),
        })
        const result = (await response.json()) as ApiResp<{ accounts: AccountSummary[] }>
        if (!result.ok) throw new Error(result.message || '保存账号顺序失败')
        confirmedLayoutRef.current = result.data.accounts
        if (version === layoutSaveVersionRef.current) {
          setAccounts(result.data.accounts)
          setAccountIds(result.data.accounts.map((item) => item.id))
        }
      } catch (reason) {
        if (version === layoutSaveVersionRef.current) setAccounts(confirmedLayoutRef.current)
        setError(reason instanceof Error ? reason.message : '保存账号顺序失败')
      } finally {
        layoutSavePendingRef.current--
      }
    }
    layoutSaveQueueRef.current = layoutSaveQueueRef.current.then(save)
    await layoutSaveQueueRef.current
  }
  persistAccountLayoutRef.current = (nextAccounts) => {
    void persistAccountLayout(nextAccounts)
  }

  function toggleAccountPinned(id: string) {
    const now = new Date().toISOString()
    const updated = accounts.map((item) => item.id === id
      ? { ...item, publicPinnedAt: item.publicPinnedAt ? undefined : now }
      : item)
    const next = [
      ...updated.filter((item) => item.publicPinnedAt),
      ...updated.filter((item) => !item.publicPinnedAt),
    ]
    void persistAccountLayout(next)
  }

  function moveAccount(id: string, direction: -1 | 1) {
    const current = accounts.find((item) => item.id === id)
    if (!current) return
    const group = accounts.filter((item) => Boolean(item.publicPinnedAt) === Boolean(current.publicPinnedAt))
    const index = group.findIndex((item) => item.id === id)
    const other = group[index + direction]
    if (!other) return
    const next = [...accounts]
    const from = next.findIndex((item) => item.id === id)
    const to = next.findIndex((item) => item.id === other.id)
    ;[next[from], next[to]] = [next[to], next[from]]
    void persistAccountLayout(next)
  }

  function clearAccountLongPress() {
    if (longPressTimerRef.current !== null) window.clearTimeout(longPressTimerRef.current)
    longPressTimerRef.current = null
    longPressStartRef.current = null
  }

  function startAccountLongPress(id: string, event: ReactPointerEvent<HTMLDivElement>) {
    if (!publicUser || event.button !== 0) return
    const target = event.target
    if (target instanceof Element && target.closest('button, a, input, select, textarea, [role="button"]')) return
    clearAccountLongPress()
    longPressStartRef.current = { x: event.clientX, y: event.clientY }
    longPressTimerRef.current = window.setTimeout(() => {
      setOpenAccountMenuId(id)
      longPressTimerRef.current = null
    }, 550)
  }

  function moveAccountLongPress(event: ReactPointerEvent<HTMLDivElement>) {
    const start = longPressStartRef.current
    if (!start) return
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) clearAccountLongPress()
  }

  function accountGestureProps(id: string) {
    return {
      onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => startAccountLongPress(id, event),
      onPointerMove: moveAccountLongPress,
      onPointerUp: clearAccountLongPress,
      onPointerCancel: clearAccountLongPress,
      onPointerLeave: clearAccountLongPress,
      onContextMenu: (event: ReactMouseEvent<HTMLDivElement>) => {
        if (!publicUser) return
        const target = event.target
        if (target instanceof Element && target.closest('button, a, input, select, textarea, [role="button"]')) return
        event.preventDefault()
        clearAccountLongPress()
        setOpenAccountMenuId(id)
      },
    }
  }

  useEffect(() => () => {
    if (longPressTimerRef.current !== null) window.clearTimeout(longPressTimerRef.current)
  }, [])

  useEffect(() => {
    const container = accountListRef.current
    if (!container || !publicUser || accounts.length < 2) return undefined

    return createAccountSortable(container, {
      getIds: () => accountSortAccountsRef.current.map((item) => item.id),
      onStart: () => {
        clearAccountLongPress()
        setOpenAccountMenuId(null)
      },
      onDrop: (sourceId, targetIndex) => {
        clearAccountLongPress()
        const current = accountSortAccountsRef.current
        const sourceIndex = current.findIndex((item) => item.id === sourceId)
        const targetId = current[targetIndex]?.id || ''
        if (!sourceId || !targetId || sourceIndex < 0 || sourceId === targetId) return
        const placement = sourceIndex < targetIndex ? 'after' : 'before'
        flushSync(() => persistAccountLayoutRef.current(
          reorderAccountsForDrop(current, sourceId, targetId, placement),
        ))
      },
    })
  }, [accountViewMode, accounts.length, publicUser])

  async function refreshDailyTaskStates() {
    const r = await getJson<{ states: Record<string, DailyTaskState[]> }>('/api/auth/daily-tasks')
    if (r.ok) setDailyTaskStates(r.data.states)
  }

  async function autoLoginByLink(inviteCode: string) {
    if (!inviteCode || linkAutoLoginRef.current === inviteCode) return
    linkAutoLoginRef.current = inviteCode
    setLinkAutoLoginLoading(true)
    setError(null)
    try {
      const r = await postJson<{ user: PublicUser; registered: boolean }>('/api/auth/link-login', {
        link: inviteCode,
      })
      if (!r.ok) throw new Error(r.message || '邀请码自动登录失败')
      const nextAccounts = await refreshUserBootstrap()
      if (!nextAccounts) setPublicUser(r.data.user)
      setSuccess(r.data.registered ? '已通过邀请码自动登录并关联账号' : '已通过邀请码自动登录')
      if (redirectTarget) {
        window.location.href = redirectTarget
      }
    } catch (e) {
      linkAutoLoginRef.current = ''
      setError(e instanceof Error ? e.message : '邀请码自动登录失败，请使用用户名密码登录')
    } finally {
      setLinkAutoLoginLoading(false)
    }
  }

  async function onUserLogin() {
    setAuthLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const r = await postJson<{ user: PublicUser; registered: boolean }>('/api/auth/login', {
        username: authUsername,
        password: authPassword,
        inviteCode: linkId || undefined,
      })
      if (!r.ok) throw new Error(r.message || '登录失败')
      const nextAccounts = await refreshUserBootstrap()
      if (!nextAccounts) setPublicUser(r.data.user)
      setSuccess(r.data.registered ? '注册成功，已关联邀请码账号' : '登录成功')
      if (redirectTarget) {
        window.location.href = redirectTarget
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : '登录失败'
      setError(msg)
    } finally {
      setAuthLoading(false)
    }
  }

  async function onUserLogout() {
    await postJson('/api/auth/logout', {})
    setPublicUser(null)
    setAnnouncementBootstrap(undefined)
    setAccounts([])
    setAccountIds([])
  }

  async function deleteAccount(id: string, label: string) {
    if (!window.confirm(`确认删除账号 ${label} 吗？删除后该账号的登录态和任务记录会一并清理。`)) {
      return
    }
    setError(null)
    setSuccess(null)
    try {
      const query = linkId ? `?publicLinkId=${encodeURIComponent(linkId)}` : ''
      const res = await fetch(`/api/accounts/${id}${query}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      })
      const r = (await res.json()) as ApiResp<Record<string, never>>
      if (!r.ok) throw new Error(r.message || '删除账号失败')
      setAccounts((prev) => prev.filter((acc) => acc.id !== id))
      setAccountIds((prev) => prev.filter((accountId) => accountId !== id))
      setExpandedAccountIds((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      if (accountId === id) setAccountId(null)
      setSuccess('账号已删除')
      if (publicUser) {
        await refreshUserAccounts()
      } else if (linkId) {
        await refreshLinkAccounts(true, linkId, { refreshStale: false })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '删除账号失败')
    }
  }

  async function jumpTo10086(accountId: string) {
    setError(null)
    setSuccess(null)
    try {
      const query = linkId ? `?publicLinkId=${encodeURIComponent(linkId)}` : ''
      const r = await postJson<YunpanSsoLinkResult>(
        `/api/accounts/${accountId}/yunpan/sso-link${query}`,
        {},
      )
      if (!r.ok) throw new Error(r.message || '生成 86 优惠商城跳转链接失败')
      setPendingSso({ url: r.data.ssoUrl, destination: '86 优惠商城' })
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成 86 优惠商城跳转链接失败')
    }
  }

  async function jumpToAigou(accountId: string) {
    setError(null)
    setSuccess(null)
    try {
      const query = linkId ? `?publicLinkId=${encodeURIComponent(linkId)}` : ''
      const r = await postJson<AigouSsoLinkResult>(
        `/api/accounts/${accountId}/aigou/sso-link${query}`,
        {},
      )
      if (!r.ok) throw new Error(r.message || '生成爱购商城跳转链接失败')
      setPendingSso({ url: r.data.ssoUrl, destination: '爱购商城' })
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成爱购商城跳转链接失败')
    }
  }

  async function jumpToQqtZone(accountId: string) {
    setError(null)
    setSuccess(null)
    try {
      const query = linkId ? `?publicLinkId=${encodeURIComponent(linkId)}` : ''
      const r = await postJson<AigouSsoLinkResult>(
        `/api/accounts/${accountId}/qqt/sso-link${query}`,
        {},
      )
      if (!r.ok) throw new Error(r.message || '生成全球通专区跳转链接失败')
      setPendingSso({ url: r.data.ssoUrl, destination: '全球通专区' })
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成全球通专区跳转链接失败')
    }
  }

  async function jumpToCocPackage(
    accountId: string,
    target: CocPackageTarget,
    destination: string,
  ) {
    setError(null)
    setSuccess(null)
    try {
      const query = linkId ? `?publicLinkId=${encodeURIComponent(linkId)}` : ''
      const r = await postJson<AigouSsoLinkResult>(
        `/api/accounts/${accountId}/coc-package/${target}/sso-link${query}`,
        {},
      )
      if (!r.ok) throw new Error(r.message || `生成${destination}跳转链接失败`)
      setPendingSso({ url: r.data.ssoUrl, destination })
    } catch (e) {
      setError(e instanceof Error ? e.message : `生成${destination}跳转链接失败`)
    }
  }

  async function runYunpanAction(id: string, target: 'refresh' | 'cloudphone' | 'capp' | 'cmcc' | 'cmcc-link') {
    if (yunpanActionInFlight.current) return
    yunpanActionInFlight.current = true
    setYunpanActionBusy(target)
    setError(null)
    setSuccess(null)
    setPendingSso(null)
    try {
      const suffix = target === 'refresh' ? 'qqt/token' : target === 'cmcc' ? 'qqt/10086'
        : target === 'cmcc-link' ? 'qqt/10086-link' : 'yunpan/business-link'
      const query = linkId ? `?publicLinkId=${encodeURIComponent(linkId)}` : ''
      const result = await postJson<{ ssoUrl?: string; accessToken?: string }>(
        `/api/accounts/${encodeURIComponent(id)}/${suffix}${query}`,
        { target, force: target === 'refresh' },
      )
      if (!result.ok) throw new Error(result.message || '操作失败，请稍后重试')
      if (target === 'refresh' || target === 'cmcc') {
        if (publicUser) await refreshUserAccounts()
        else await refreshLinkAccounts(true, linkId, { refreshStale: false })
        setSuccess(target === 'cmcc' ? '10086 CK 已置换，身份及查询验证通过' : '全球通 Token 已更新')
      } else {
        const url = new URL(result.data.ssoUrl || '')
        const host = target === 'cmcc-link' ? 'wx.10086.cn' : target === 'capp' ? 'capp.139.com' : 'cloud.139.com'
        if (url.protocol !== 'https:' || url.hostname !== host || url.port || url.username || url.password) {
          throw new Error('跳转地址无效')
        }
        setPendingSso({ url: url.toString(), destination: target === 'cmcc-link' ? '10086' : target === 'capp' ? '云应用' : '云手机' })
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '操作失败，请稍后重试')
    } finally {
      yunpanActionInFlight.current = false
      setYunpanActionBusy('')
    }
  }

  function openPendingSsoUrl() {
    if (!pendingSso) return
    window.open(pendingSso.url, '_blank', 'noopener,noreferrer')
    setSuccess(`已在新标签页打开${pendingSso.destination}`)
    setPendingSso(null)
  }

  async function copyPendingSsoUrl() {
    if (!pendingSso) return
    try {
      await copyText(pendingSso.url)
      setSuccess(`${pendingSso.destination}跳转链接已复制`)
      setPendingSso(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : '复制链接失败')
    }
  }

  useEffect(() => {
    void (async () => {
      try {
        await refreshUserBootstrap()
      } catch {
        // ignore
      }
    })()
  }, [])

  useEffect(() => {
    if (!linkId) return
    void autoLoginByLink(linkId)
  }, [linkId])

  async function refreshAccountLifecycle(id: string, opts?: { silent?: boolean }) {
    const silent = opts?.silent ?? false
    if (!silent) {
      setError(null)
      setSuccess(null)
    }
    setRefreshingById((prev) => ({ ...prev, [id]: true }))
    try {
      const r = await postJson<{ cookie: string; cookieUpdated: boolean }>(
        `/api/accounts/${id}/refresh`,
        { publicLinkId: linkId, force: true },
      )
      if (!r.ok) {
        const err = r as ApiErr
        if (err.errorCode === 'COOKIE_INVALID_CLEARED') {
          setAccounts((prev) =>
            prev.map((acc) =>
              acc.id === id ? { ...acc, hasCookie: false, updatedAt: new Date().toISOString() } : acc,
            ),
          )
          setActivationById((prev) => ({ ...prev, [id]: null }))
        }
        if (!silent) setError(r.message || '刷新失败')
        return false
      }
      const activated = await activateAccount(id)
      if (!activated) {
        if (!silent) setError('Cookie 校验失败，可能已失效，请重新登录')
        return false
      }
      await fetchXdrReceive(id)
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === id
            ? { ...acc, hasCookie: true, cookieUpdatedAt: new Date().toISOString() }
            : acc,
        ),
      )
      if (!silent) {
        setSuccess(r.data.cookieUpdated ? 'Cookie 已刷新' : 'Cookie 有效，无需更新')
      }
      return true
    } catch (e) {
      if (!silent) {
        const msg = e instanceof Error ? e.message : '刷新失败'
        setError(msg)
      }
      return false
    } finally {
      setRefreshingById((prev) => ({ ...prev, [id]: false }))
    }
  }

  const refreshLinkAccounts = useCallback(
    async (
      silent = false,
      linkOverride?: string,
      opts?: { refreshStale?: boolean },
    ): Promise<AccountSummary[] | undefined> => {
      const effectiveLinkId = linkOverride ?? linkId
      if (!effectiveLinkId) return
      if (linkFetchInFlightRef.current) return
      const refreshStale = opts?.refreshStale ?? true
      linkFetchInFlightRef.current = true
      try {
        const res = await fetch(
          `/api/accounts/public/link/${effectiveLinkId}/accounts`,
          { method: 'GET' },
        )
        const json = (await res.json()) as ApiResp<{
          accounts: AccountSummary[]
        }>
      if (!json.ok) {
        setLinkValidated(false)
        setAccounts([])
        setAccountIds([])
        const err = json as ApiErr
        if (!silent || err.errorCode === 'NOT_FOUND') {
          setError(json.message || '加载账号失败')
        }
        return undefined
      }
      setLinkValidated(true)
      setAccounts(json.data.accounts)
      setAccountIds(json.data.accounts.map((a) => a.id))
      hydrateCachedRuntime(json.data.accounts)
      const nextSign: Record<string, SignState> = {}
      for (const acc of json.data.accounts) {
        const signState = parseSignStateFromAccount(acc)
        if (signState) nextSign[acc.id] = signState
      }
      if (Object.keys(nextSign).length > 0) {
        setSignStateById((prev) => ({ ...prev, ...nextSign }))
      }
      if (refreshStale) {
        const staleTargets = json.data.accounts.filter(
          (acc) => getAccountLoginState(acc).hasCmcc && !isAccountCacheFresh(acc),
        )
        for (const acc of staleTargets) {
          await refreshAccountLifecycle(acc.id, { silent: true })
        }
        if (!silent && staleTargets.length > 0) {
          setSuccess(`已自动刷新 ${staleTargets.length} 个超时账号缓存`)
        }
      }
      return json.data.accounts
      } catch {
        if (!silent) setError('网络异常，请重试')
        return undefined
      } finally {
        linkFetchInFlightRef.current = false
      }
    },
    [linkId],
  )

  const refreshAccounts = useCallback(
    async (silent = false) => {
      if (!linkId) return
      if (!linkValidated && silent) return
      if (accountsFetchInFlightRef.current) return
      accountsFetchInFlightRef.current = true
      try {
        await refreshLinkAccounts(silent, linkId, { refreshStale: true })
      } finally {
        accountsFetchInFlightRef.current = false
      }
    },
    [linkId, linkValidated, refreshLinkAccounts],
  )

  const loadActiveLinkTask = useCallback(async (): Promise<BatchTaskSummary | null> => {
    if (!taskScopeId) {
      setActiveLinkTask(null)
      return null
    }
    const params = new URLSearchParams({
      scopeType: taskScopeType,
      scopeId: taskScopeId,
    })
    if (taskScopeType === 'public_link') params.set('publicLinkId', taskScopeId)
    const r = await getJson<{ task: BatchTaskSummary | null }>(
      `/api/tasks/active?${params.toString()}`,
    )
    if (!r.ok) throw new Error(r.message || '加载任务失败')
    setActiveLinkTask(r.data.task ?? null)
    return r.data.task ?? null
  }, [taskScopeId, taskScopeType])

  const loadActiveLinkTasks = useCallback(async (): Promise<BatchTaskSummary[]> => {
    if (!taskScopeId) {
      setActiveLinkTasks([])
      return []
    }
    const params = new URLSearchParams({
      scopeType: taskScopeType,
      scopeId: taskScopeId,
    })
    if (taskScopeType === 'public_link') params.set('publicLinkId', taskScopeId)
    const r = await getJson<{ tasks: BatchTaskSummary[] }>(
      `/api/tasks/active-list?${params.toString()}`,
    )
    if (!r.ok) throw new Error(r.message || '加载任务失败')
    setActiveLinkTasks(r.data.tasks)
    setActiveLinkTask((current) => current ?? r.data.tasks[0] ?? null)
    return r.data.tasks
  }, [taskScopeId, taskScopeType])

  const loadLinkTaskById = useCallback(async (taskId: string): Promise<BatchTaskSummary | null> => {
    const query =
      taskScopeType === 'public_link' && taskScopeId
        ? `?publicLinkId=${encodeURIComponent(taskScopeId)}`
        : ''
    const r = await getJson<{ task: BatchTaskSummary }>(
      `/api/tasks/${taskId}${query}`,
    )
    if (!r.ok) throw new Error(r.message || '加载任务失败')
    setActiveLinkTask(r.data.task)
    setActiveLinkTasks((prev) => [r.data.task, ...prev.filter((task) => task.id !== r.data.task.id)])
    setTaskLogModalTask((current) => (current?.id === taskId ? r.data.task : current))
    return r.data.task
  }, [taskScopeId, taskScopeType])

  function formatTaskTypeName(type: BatchTaskSummary['type']): string {
    if (type === 'sign') return '一键签到'
    if (type === 'refresh_and_sign') return '刷新+签到+拼图'
    if (type === 'wed_recharge') return '周三拼图'
    if (type === 'yunpan_activate') return '置换云盘全球通 Token'
    if (type === 'ck_maintenance') return '一键维护'
    if (type === 'global_telecom_resign') return '一键补签+一键盲盒'
    if (type === 'cmcc_auto_checkin') return '移动活动自动化（查询）'
    return type
  }

  function openTaskLogModal(task: BatchTaskSummary) {
    setTaskLogModalTask(task)
    void loadLinkTaskById(task.id).catch(() => undefined)
  }

  function buildWedRechargeAppTokenLoginInput(
    rawValue = appTokenInput,
    sidValue = appTokenActivitySid,
    userCheckIdValue = appTokenUserCheckId,
  ): Record<string, unknown> | undefined {
    const raw = rawValue.trim()
    const sidInput = sidValue.trim()
    const userCheckId = userCheckIdValue.trim()
    let sid = sidInput
    let activityUrl = ''
    if (sidInput.includes('://')) {
      activityUrl = sidInput
      try {
        const parsed = new URL(sidInput)
        sid = parsed.searchParams.get('sid')?.trim() || parsed.searchParams.get('token')?.trim() || ''
      } catch {
        sid = ''
      }
    }
    if (!raw) return sid || activityUrl ? { sid, activityUrl, userCheckId } : undefined
    try {
      const parsed = JSON.parse(raw) as unknown
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const obj = parsed as Record<string, unknown>
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
          sid: typeof obj.sid === 'string' && obj.sid.trim() ? obj.sid.trim() : sid,
          loginUrl: typeof obj.loginUrl === 'string' && obj.loginUrl.trim() ? obj.loginUrl.trim() : undefined,
          activityUrl:
            typeof obj.activityUrl === 'string' && obj.activityUrl.trim()
              ? obj.activityUrl.trim()
              : activityUrl,
          userCheckId:
            typeof obj.userCheckId === 'string' && obj.userCheckId.trim()
              ? obj.userCheckId.trim()
              : userCheckId,
        }
      }
    } catch {
      // Plain token string.
    }
    return { token: raw, sid, activityUrl, userCheckId }
  }

  function buildWedRechargeRequestPayload(): Record<string, unknown> {
    return { useAppToken: false }
  }

  function buildPublicWedRechargeRunPayload(): Record<string, unknown> {
    return { useAppToken: false }
  }

  async function importWedRechargeHar(file: File): Promise<void> {
    try {
      const text = await file.text()
      const har = JSON.parse(text) as {
        log?: { entries?: Array<{ request?: { url?: string; postData?: { text?: string } } }> }
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
        setError('HAR 中未找到 appTokenLogin 请求')
        return
      }
      setWedRechargeUseAppToken(true)
      setSuccess('已从 HAR 导入周三 appToken 配置')
    } catch {
      setError('HAR 解析失败，请检查文件内容')
    }
  }

  async function importPublicWedRechargeHar(file: File): Promise<void> {
    try {
      const text = await file.text()
      const har = JSON.parse(text) as {
        log?: { entries?: Array<{ request?: { url?: string; postData?: { text?: string } } }> }
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
        setPublicWedAppTokenInput(JSON.stringify({ ...appTokenBody, sid, loginUrl, postBody: appTokenBody }, null, 2))
        if (typeof appTokenBody.userCheckId === 'string') {
          setPublicWedAppTokenUserCheckId(appTokenBody.userCheckId)
        }
      }
      if (sid) setPublicWedAppTokenActivitySid(sid)
      if (!sid && !appTokenBody) {
        setError('HAR 中未找到 appTokenLogin 请求')
        return
      }
      setPublicWedUseGlobalConfig(false)
      setSuccess('已导入本次拼图配置')
    } catch {
      setError('HAR 解析失败，请检查文件内容')
    }
  }

  async function cancelTask(taskId: string): Promise<void> {
    const query =
      taskScopeType === 'public_link' && taskScopeId
        ? `?publicLinkId=${encodeURIComponent(taskScopeId)}`
        : ''
    const r = await postJson<{ task: BatchTaskSummary | null }>(`/api/tasks/${taskId}/cancel${query}`, {})
    if (!r.ok || !r.data.task) {
      setError(r.message || '停止任务失败')
      return
    }
    setActiveLinkTask(r.data.task)
    setActiveLinkTasks((prev) => [r.data.task!, ...prev.filter((task) => task.id !== taskId)])
    setTaskLogModalTask((current) => (current?.id === taskId ? r.data.task : current))
    setSuccess('任务已停止')
  }

  const startLinkBatchTask = useCallback(
    async (
      type: 'sign' | 'refresh_and_sign' | 'wed_recharge' | 'yunpan_activate' | 'ck_maintenance' | 'global_telecom_resign' | 'cmcc_auto_checkin',
      wedRechargePayload?: Record<string, unknown>,
    ): Promise<void> => {
      if (!taskScopeId) return
      setError(null)
      setSuccess(null)
      if (type === 'global_telecom_resign' && !window.confirm(
        `将逐个处理 ${globalTelecomRunnableAccountCount} 个可用账号：先按日期完成需要补签的任务，再依次完成未完成的盲盒任务。补签次数为 0 时不会补签，一个账号完成后才会继续下一个，确认开始吗？`,
      )) return
      if ((type === 'sign' || type === 'refresh_and_sign') && !qqtSspid.trim()) {
        setError('请先填写 SSPID')
        return
      }
      const r = await postJson<{ task: BatchTaskSummary; reused: boolean }>(
        type === 'cmcc_auto_checkin'
          ? '/api/tasks/cmcc-auto-checkin'
          : type === 'wed_recharge'
          ? '/api/tasks/wed-recharge'
          : type === 'yunpan_activate'
            ? '/api/tasks/yunpan-activate'
            : type === 'ck_maintenance'
              ? '/api/tasks/ck-maintenance'
              : type === 'global_telecom_resign'
                ? '/api/tasks/global-telecom-resign'
              : type === 'sign'
                ? '/api/tasks/sign'
                : '/api/tasks/refresh-and-sign',
        {
          scopeType: taskScopeType,
          scopeId: taskScopeId,
          publicLinkId: taskScopeType === 'public_link' ? taskScopeId : undefined,
          sspid: type === 'cmcc_auto_checkin'
            ? JSON.stringify({ operations: ['sign', 'wed', 'seed', 'gold', 'rate', 'fee', 'seckill', 'liaoning'], dryRun: true, includeAllSignTasks: true })
            : type === 'sign' || type === 'refresh_and_sign' || type === 'global_telecom_resign' ? qqtSspid.trim() : undefined,
          autoTaskList: true,
          draw: false,
          forceDaily: true,
          ...(type === 'wed_recharge' || type === 'refresh_and_sign'
            ? wedRechargePayload ?? buildWedRechargeRequestPayload()
            : {}),
        },
      )
      if (!r.ok) {
        setError(r.message || '启动任务失败')
        return
      }
      setActiveLinkTask(r.data.task)
      setActiveLinkTasks((prev) => [r.data.task, ...prev.filter((task) => task.id !== r.data.task.id)])
      setSuccess(
        r.data.reused
          ? '已有同类任务正在执行，已恢复当前进度'
          : type === 'wed_recharge'
            ? '周三拼图任务已提交，后台会逐个账号执行'
            : type === 'yunpan_activate'
              ? '云盘账号 10086 CK 激活任务已提交'
              : type === 'ck_maintenance'
                ? '一键维护任务已提交'
                : type === 'global_telecom_resign'
                  ? '一键补签+一键盲盒任务已提交，后台会逐个账号串行执行'
                : type === 'sign'
                  ? '一键签到任务已提交'
                  : '任务已提交到服务端执行，只会消费当前已有的 CK/Token',
      )
    },
    [qqtSspid, taskScopeId, taskScopeType, globalTelecomRunnableAccountCount, wedRechargeUseAppToken, appTokenInput, appTokenActivitySid, appTokenUserCheckId],
  )

  async function startPublicWedRechargeFromConfig(): Promise<void> {
    await startLinkBatchTask('wed_recharge', buildPublicWedRechargeRunPayload())
    setShowWedRechargeRunConfig(false)
  }

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

  useEffect(() => {
    if (initialLoadRef.current) return
    initialLoadRef.current = true
    let cachedIds: string[] = []
    if (!linkId) {
      setAccounts([])
      setAccountIds([])
      setLinkValidated(false)
      return
    }
    const idsKey = `${ACCOUNT_IDS_KEY}_${linkId}`
    const cacheKey = `${ACCOUNTS_CACHE_KEY}_${linkId}`
    const idsRaw = window.localStorage.getItem(idsKey)
    if (idsRaw) {
      try {
        const parsed = JSON.parse(idsRaw) as string[]
        if (Array.isArray(parsed)) {
          cachedIds = parsed.filter((id) => typeof id === 'string')
        }
      } catch {
        // ignore invalid cache
      }
    }
    const cachedAccountsRaw = window.localStorage.getItem(cacheKey)
    if (cachedAccountsRaw) {
      try {
        const parsed = JSON.parse(cachedAccountsRaw) as AccountSummary[]
        if (Array.isArray(parsed)) {
          const idSet = new Set(
            cachedIds.length ? cachedIds : parsed.map((a) => a.id),
          )
          const filtered = parsed.filter((a) => idSet.has(a.id))
          setAccounts(filtered)
          if (cachedIds.length === 0 && filtered.length > 0) {
            cachedIds = filtered.map((a) => a.id)
          }
        }
      } catch {
        // ignore invalid cache
      }
    }
    setAccountIds(cachedIds)
  }, [linkId])

  useEffect(() => {
    if (!linkId) return
    void refreshLinkAccounts(true, linkId, { refreshStale: true })
  }, [linkId, refreshLinkAccounts])

  useEffect(() => {
    if (!taskScopeId) {
      setActiveLinkTask(null)
      setActiveLinkTasks([])
      return
    }
    void loadActiveLinkTask().catch(() => undefined)
    void loadActiveLinkTasks().catch(() => undefined)
  }, [loadActiveLinkTask, loadActiveLinkTasks, taskScopeId])

  useEffect(() => {
    if (!activeLinkTask) return
    if (
      activeLinkTask.status !== 'pending' &&
      activeLinkTask.status !== 'running'
    ) {
      if (publicUser) {
        void refreshUserAccounts().catch(() => undefined)
        void refreshDailyTaskStates().catch(() => undefined)
      } else {
        void refreshLinkAccounts(true, linkId, { refreshStale: false }).catch(() => undefined)
      }
      return
    }
    const t = window.setInterval(() => {
      void loadLinkTaskById(activeLinkTask.id).catch(() => undefined)
      void loadActiveLinkTasks().catch(() => undefined)
    }, 2000)
    return () => window.clearInterval(t)
  }, [activeLinkTask, linkId, loadActiveLinkTasks, loadLinkTaskById, publicUser, refreshLinkAccounts])

  useEffect(() => {
    if (!linkId) {
      setPushConfig(null)
      return
    }
    void (async () => {
      try {
        const res = await fetch(`/api/accounts/public/link/${linkId}/push-config`, {
          method: 'GET',
        })
        const json = (await res.json()) as ApiResp<PublicPushConfig & { linkId: string }>
        if (!json.ok) return
        setPushConfig({
          pushplusEnabled: json.data.pushplusEnabled,
          url: json.data.url,
          ipUrl: json.data.ipUrl,
          subscribeUrl: json.data.subscribeUrl,
          qrImageUrl: json.data.qrImageUrl,
          qrNote: json.data.qrNote,
          redirectEnabled: json.data.redirectEnabled,
          redirectUrl: json.data.redirectUrl,
          redirectNote: json.data.redirectNote,
        })
      } catch {
        // ignore
      }
    })()
  }, [linkId])

  useEffect(() => {
    void (async () => {
      const map = await loadXdrPrizeMap()
      setXdrPrizeMap(map)
    })()
  }, [])

  useEffect(() => {
    if (!linkId) return
    const cacheKey = `${ACCOUNTS_CACHE_KEY}_${linkId}`
    window.localStorage.setItem(cacheKey, JSON.stringify(accounts))
  }, [accounts, linkId])

  useEffect(() => {
    if (!linkId) return
    const idsKey = `${ACCOUNT_IDS_KEY}_${linkId}`
    window.localStorage.setItem(idsKey, JSON.stringify(accountIds))
  }, [accountIds, linkId])

  async function ensureAccountId(targetPhone: string): Promise<string> {
    if (!publicUser && !linkId) throw new Error('请先登录，或使用有效邀请码访问此页面')
    if (accountId) return accountId
    const r = await postJson<{ account: { id: string } }>('/api/accounts', {
      phone: targetPhone,
      label: 'public-login',
      publicLinkId: linkId || undefined,
    })
    if (!r.ok) throw new Error(r.message || '创建账号失败')
    setAccountId(r.data.account.id)
    return r.data.account.id
  }

  async function ensureCookieImportAccountId(): Promise<string> {
    if (!publicUser && !linkId) throw new Error('请先登录，或使用有效邀请码访问此页面')
    if (accountId) return accountId
    const body =
      phoneValid
        ? { phone: normalizedPhone, label: 'public-cookie-import', publicLinkId: linkId || undefined }
        : { phone: '', label: 'public-cookie-import', allowEmpty: true, publicLinkId: linkId || undefined }
    const r = await postJson<{ account: { id: string } }>('/api/accounts', body)
    if (!r.ok) throw new Error(r.message || '创建账号失败')
    setAccountId(r.data.account.id)
    return r.data.account.id
  }

  function scrollToAccountCard(targetId: string) {
    const el = accountCardRefs.current[targetId]
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function scrollToLoginPanel() {
    loginPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function findNextUnloggedAccountId(list: AccountSummary[], currentId: string): string | undefined {
    const currentIndex = list.findIndex((item) => item.id === currentId)
    if (currentIndex < 0) {
      return list.find((item) => !item.hasCookie && !item.hasYunpanSession && !item.qqtAccessToken)?.id
    }
    const tailHit = list
      .slice(currentIndex + 1)
      .find((item) => !item.hasCookie && !item.hasYunpanSession && !item.qqtAccessToken)
    if (tailHit) return tailHit.id
    return list
      .slice(0, currentIndex)
      .find((item) => !item.hasCookie && !item.hasYunpanSession && !item.qqtAccessToken)?.id
  }

  function toggleAccountDetails(id: string) {
    setExpandedAccountIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  async function onSendSms() {
    setError(null)
    setSuccess(null)
    setSending(true)
    try {
      const headers = buildClientHeaders()
      const r =
        loginMode === 'yunpan'
          ? await postJson<{ cooldownSeconds: number }>('/api/accounts/yunpan/sms/send', {
              phone: normalizedPhone,
              publicLinkId: linkId,
            })
          : await postJson<{ cooldownSeconds: number }>(
              loginMode === 'qqt'
                ? `/api/accounts/${await ensureAccountId(normalizedPhone)}/qqt/sms/send`
                : `/api/accounts/${await ensureAccountId(normalizedPhone)}/sms/send`,
              {
                phone: normalizedPhone,
                headers,
                publicLinkId: linkId,
              },
            )
      if (!r.ok) {
        setError(r.message || '发送验证码失败')
        return
      }
      setSuccess(
        loginMode === 'yunpan'
          ? '云盘验证码已发送，请查看短信'
          : loginMode === 'qqt'
          ? '全球通验证码已发送，请查看短信'
          : '验证码已发送，请查看短信',
      )
      setCooldown(Math.max(1, Math.min(120, r.data.cooldownSeconds || 60)))
    } catch (e) {
      const msg = e instanceof Error ? e.message : '网络异常，请重试'
      setError(msg)
    } finally {
      setSending(false)
    }
  }

  async function onLogin() {
    setError(null)
	    setSuccess(null)
	    setLoggingIn(true)
	    try {
	      const headers = buildClientHeaders()
	      let id = accountId
	      let successMessage = ''
	      if (loginMode === 'yunpan') {
	        const r = await postJson<{
	          account: AccountSummary
	          cookie?: string
	          cookieLength: number
	          warning?: string
	        }>(
          '/api/accounts/yunpan/login',
          {
            code: normalizedCode,
            phone: normalizedPhone,
            publicLinkId: linkId,
          },
        )
        if (!r.ok) {
          setError(r.message || '云盘登录失败')
          return
	        }
	        id = r.data.account.id
	        setAccountId(id)
	        successMessage =
	          r.data.cookieLength > 0
	            ? '云盘登录成功，10086 CK 已保存'
	            : r.data.warning || '云盘登录成功，云盘会话已保存'
	      } else if (loginMode === 'qqt') {
        id = await ensureAccountId(normalizedPhone)
        const r = await postJson<{ accessToken: string }>(`/api/accounts/${id}/qqt/login`, {
          code: normalizedCode,
          phone: normalizedPhone,
          publicLinkId: linkId,
        })
	        if (!r.ok) {
	          setError(r.message || '登录失败')
	          return
	        }
	        successMessage = '全球通登录成功，Token 已保存'
	      } else {
        id = await ensureAccountId(normalizedPhone)
        const r = await postJson<{ cookie: string }>(`/api/accounts/${id}/login`, {
          code: normalizedCode,
          phone: normalizedPhone,
          headers,
          publicLinkId: linkId,
        })
	        if (!r.ok) {
	          setError(r.message || '登录失败')
	          return
	        }
	        successMessage = '登录成功，账号信息已保存'
	      }
	      setSuccess(successMessage)
      setCode('')
      setPhone('')
      setCooldown(0)
      const nextIds = id && accountIds.includes(id) ? accountIds : id ? [...accountIds, id] : accountIds
      setAccountIds(nextIds)
      const latestAccounts = publicUser
        ? await refreshUserAccounts()
        : await refreshLinkAccounts(true, linkId)
      if (latestAccounts?.length) {
        const nextUnloggedId = id ? findNextUnloggedAccountId(latestAccounts, id) : undefined
        if (nextUnloggedId) {
          window.setTimeout(() => scrollToAccountCard(nextUnloggedId), 180)
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : '网络异常，请重试'
      setError(msg)
    } finally {
      setLoggingIn(false)
    }
  }

  async function onImportCookie() {
    setError(null)
    setSuccess(null)
    setImportingCookie(true)
    try {
      const id = await ensureCookieImportAccountId()
      const r = await postJson<{ cookie: string }>(`/api/accounts/${id}/cookie`, {
        cookie: cookieText,
        publicLinkId: linkId,
      })
      if (!r.ok) {
        setError(r.message || '导入 CK 失败')
        return
      }
      setSuccess('CK 已导入，正在刷新信息和 Token')
      const refreshed = await refreshAccountLifecycle(id, { silent: true })
      if (!refreshed) {
        setError('CK 已保存，但校验或刷新失败，请确认 CK 是否有效')
        await refreshLinkAccounts(true, linkId, { refreshStale: false })
        return
      }
      if (qqtSspid.trim()) {
        await signAccount(id)
      } else {
        setSuccess('CK 已导入，账号信息和 Token 已刷新')
      }
      setCookieText('')
      setPhone('')
      const latestAccounts = publicUser
        ? await refreshUserAccounts()
        : await refreshLinkAccounts(true, linkId, { refreshStale: false })
      const nextUnloggedId = latestAccounts?.length
        ? findNextUnloggedAccountId(latestAccounts, id)
        : undefined
      if (nextUnloggedId) {
        window.setTimeout(() => scrollToAccountCard(nextUnloggedId), 180)
      }
      setPhone('')
    } catch (e) {
      const msg = e instanceof Error ? e.message : '导入 CK 失败'
      setError(msg)
    } finally {
      setImportingCookie(false)
    }
  }

  async function pollQrLogin(targetFlowId?: string) {
    const flowId = targetFlowId || qrFlow?.flowId
    if (!flowId || qrPollingRef.current) return
    qrPollingRef.current = true
    try {
      const r = await postJson<Omit<QrLoginFlowState, 'qrImage'>>(
        '/api/accounts/qr-login/poll',
        {
          flowId,
          publicLinkId: linkId || undefined,
        },
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
        setSuccess('扫码确认成功，正在自动导入 CK')
        void onSaveQrLogin(flowId)
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
      }>('/api/accounts/qr-login/start', {
        publicLinkId: linkId || undefined,
      })
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

  async function onSaveQrLogin(targetFlowId?: string) {
    const flowId = targetFlowId || qrFlow?.flowId
    if (!flowId) return
    if (qrAutoSavingFlowRef.current === flowId) return
    qrAutoSavingFlowRef.current = flowId
    setError(null)
    setSuccess(null)
    setQrSaving(true)
    try {
      const r = await postJson<{
        account: AccountSummary
        cookie: string
        cookieNames: string[]
        cookieLength: number
      }>('/api/accounts/qr-login/save', {
        flowId,
        phone: phoneValid ? normalizedPhone : undefined,
        label: phoneValid ? undefined : 'public-app-qr-login',
        publicLinkId: linkId || undefined,
      })
      if (!r.ok) {
        setError(r.message || '保存扫码 CK 失败')
        return
      }
      const id = r.data.account.id
      setAccountId(id)
      setAccountIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
      setExpandedAccountIds((prev) => ({ ...prev, [id]: true }))
      setPhone('')
      setSuccess(`扫码 CK 已自动导入，Cookie 长度 ${r.data.cookieLength}`)
      setQrFlow(null)
      stopQrPolling()
      const latestAccounts = publicUser
        ? await refreshUserAccounts()
        : await refreshLinkAccounts(true, linkId, { refreshStale: false })
      const nextUnloggedId = latestAccounts?.length
        ? findNextUnloggedAccountId(latestAccounts, id)
        : undefined
      if (nextUnloggedId) {
        window.setTimeout(() => scrollToAccountCard(nextUnloggedId), 180)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存扫码 CK 失败')
    } finally {
      setQrSaving(false)
      if (qrAutoSavingFlowRef.current === flowId) qrAutoSavingFlowRef.current = null
    }
  }

  async function reloginAccount(acc: AccountSummary) {
    const fullPhone = String(acc.phone || '').trim()
    if (!/^1\d{10}$/.test(fullPhone)) {
      setError('该账号未记录完整手机号，请手动输入后选择登录方式')
      return
    }
    setLoginDialogAccount(acc)
    setLoginDialogOpen(true)
    setError(null)
    setSuccess(null)
  }

  async function onLoginDialogSuccess(args: { accountId: string; cookie?: string; method?: string; warning?: string }) {
    setAccountId(args.accountId)
    setAccountIds((prev) => (prev.includes(args.accountId) ? prev : [...prev, args.accountId]))
    const latestAccounts = publicUser
      ? await refreshUserAccounts()
      : await refreshLinkAccounts(true, linkId, { refreshStale: false })
    setSuccess(args.warning || (args.method === 'yunpan' ? args.cookie ? '云盘登录成功，全球通 Token 与 10086 CK 已更新' : '云盘登录成功，全球通 Token 已更新' : '登录成功，账号信息已更新'))
    if (latestAccounts?.length) {
      window.setTimeout(() => scrollToAccountCard(args.accountId), 180)
    }
  }

  async function refreshVisibleAccounts() {
    if (listRefreshing) return
    setListRefreshing(true)
    setError(null)
    try {
      if (publicUser) await refreshUserAccounts()
      else if (linkId) await refreshLinkAccounts(false, linkId, { refreshStale: true })
      else await refreshAccounts(false)
      setSuccess('列表已刷新')
    } catch (e) {
      setError(e instanceof Error ? e.message : '刷新列表失败')
    } finally {
      setListRefreshing(false)
    }
  }

  async function refreshCookie(id: string) {
    const ok = await refreshAccountLifecycle(id, { silent: false })
    if (ok) {
      await refreshLinkAccounts(true, linkId, { refreshStale: false })
    }
  }

  async function signAccount(id: string) {
    if (!qqtSspid.trim()) {
      setError('请先填写 SSPID')
      return
    }
    setError(null)
    setSuccess(null)
    setSigningById((prev) => ({ ...prev, [id]: true }))
    try {
      const tokenResp = await postJson<{ accessToken: string }>(
        `/api/accounts/${id}/qqt/token`,
        {
          publicLinkId: linkId,
          force: true,
        },
      )
      if (!tokenResp.ok || !tokenResp.data?.accessToken) {
        setError(tokenResp.message || '置换 token 失败，请先刷新 CK 后重试')
        return
      }

      const r = await postJson<{ result: unknown; accessToken: string }>(
        `/api/accounts/${id}/qqt/sign`,
        {
          publicLinkId: linkId,
          sspid: qqtSspid.trim(),
          accessToken: tokenResp.data.accessToken,
        },
      )
      if (!r.ok) {
        setError(r.message || '签到失败')
        return
      }
      const now = new Date().toISOString()
      const message = parseSignMessage(r.data.result)
      setSignStateById((prev) => ({
        ...prev,
        [id]: { message, updatedAt: now },
      }))
      await fetchXdrReceive(id)
      await refreshLinkAccounts(true, linkId, { refreshStale: false })
      setSuccess(`签到完成：${message}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '签到失败'
      setError(msg)
    } finally {
      setSigningById((prev) => ({ ...prev, [id]: false }))
    }
  }

  function closeAccountMenu() {
    setOpenAccountMenuId(null)
  }

  function toggleAccountMenu(accountId: string, trigger: HTMLButtonElement) {
    if (openAccountMenuId === accountId) {
      closeAccountMenu()
      return
    }
    const rect = trigger.getBoundingClientRect()
    setAccountMenuPosition(calculateViewportMenuPosition(rect, {
      width: window.innerWidth,
      height: window.innerHeight,
    }, { width: 304, maxHeight: 600, preferredHeight: 480 }))
    setOpenAccountMenuId(accountId)
  }

  function renderAccountMenu(args: {
    acc: AccountSummary
    displayPhone: string
    accountUsable: boolean
    isRefreshing: boolean
    isSigning: boolean
    orderIndex: number
    orderGroupLength: number
  }) {
    if (openAccountMenuId !== args.acc.id || !accountMenuPosition) return null
    const { acc } = args
    const login = getAccountLoginState(acc)
    const canSso = !acc.disabledAt && Boolean(login.hasYunpan || acc.qqtAccessToken)
    const select = (action: () => unknown) => () => { closeAccountMenu(); void action() }
    const navigate = (path: string) => select(() => { window.location.href = appRoute(path) })
    const globalParams = new URLSearchParams({ accountId: acc.id })
    if (linkId) globalParams.set('publicLinkId', linkId)
    const globalActions: AccountMenuAction[] = [
      { label: '全球通信息查询', icon: BarChart3, disabled: !args.accountUsable,
        onSelect: navigate(`/benefits/global-telecom?${globalParams.toString()}`) },
      { label: '全球通专区', icon: KeyRound, disabled: !login.loggedIn,
        onSelect: select(() => jumpToQqtZone(acc.id)) },
      { label: '全球通签到', icon: CheckCircle2, disabled: !args.accountUsable || args.isSigning || !qqtSspid.trim(),
        onSelect: select(() => signAccount(acc.id)) },
    ]
    if (publicUser) globalActions.push({
      label: '周三拼图互转', icon: Puzzle,
      onSelect: navigate(`/benefits/wed-puzzle?from=public${linkId ? `&link=${encodeURIComponent(linkId)}` : ''}`),
    })
    if (login.hasYunpan) globalActions.push({
      label: '置换全球通 Token', icon: RefreshCcw, disabled: Boolean(yunpanActionBusy),
      onSelect: select(() => runYunpanAction(acc.id, 'refresh')),
    })
    const cmccActions: AccountMenuAction[] = login.hasCmcc ? [
      { label: '刷新 CK', icon: RefreshCcw, disabled: args.isRefreshing, onSelect: select(() => refreshCookie(acc.id)) },
      ...(publicUser ? [
        { label: '已订业务', icon: FileText, onSelect: navigate(`/business-query?accountId=${encodeURIComponent(acc.id)}`) },
        { label: '旧版已订业务', icon: FileText, onSelect: navigate(`/legacy-business-query?accountId=${encodeURIComponent(acc.id)}&returnTo=${encodeURIComponent(window.location.pathname + window.location.search)}`) },
        { label: '查询和退订', icon: Wrench, onSelect: navigate(`/shop-query?accountId=${encodeURIComponent(acc.id)}`) },
      ] : []),
      { label: '10086 预约回访', icon: Phone, onSelect: select(() => setCallbackAccount(acc)) },
      ...(canOrderBusiness ? [{ label: '业务订购', icon: PackagePlus,
        onSelect: navigate(`/business-order?accountId=${encodeURIComponent(acc.id)}`) }] : []),
      ...(canUseBenefitActivity ? [{ label: '权益活动', icon: CalendarDays,
        onSelect: navigate(`/benefits/lucky-three-day?accountId=${encodeURIComponent(acc.id)}`) }] : []),
      { label: '爱购商城', icon: ShoppingBag, onSelect: select(() => jumpToAigou(acc.id)) },
      ...([
        ['building_bricks', '积木套餐'],
        ['diamond_package', '全球通卓越钻石'],
        ['age_feed', '全球通网龄直升'],
        ['smart_life', '智臻会员'],
        ['five_ga', '全球通 5GA'],
      ] as const).map(([target, label]) => ({ label, icon: PackagePlus,
        onSelect: select(() => jumpToCocPackage(acc.id, target, label)) })),
    ] : []
    if (publicUser && !login.hasCmcc && canSso) cmccActions.push({
      label: '旧版已订业务', icon: FileText,
      onSelect: navigate(`/legacy-business-query?accountId=${encodeURIComponent(acc.id)}&returnTo=${encodeURIComponent(window.location.pathname + window.location.search)}`),
    })
    if (canSso) cmccActions.unshift(
      { label: '置换 10086 CK', icon: RefreshCcw, disabled: Boolean(yunpanActionBusy),
        onSelect: select(() => runYunpanAction(acc.id, 'cmcc')) },
      { label: '跳转 10086', icon: ExternalLink, disabled: Boolean(yunpanActionBusy),
        onSelect: select(() => runYunpanAction(acc.id, 'cmcc-link')) },
    )
    return <AccountActionMenu phone={args.displayPhone} position={accountMenuPosition} onClose={closeAccountMenu}
      primary={{ label: '重新登录', icon: LogIn, disabled: sending,
        onSelect: select(() => reloginAccount(acc)) }}
      groups={[
        { label: '全球通', actions: globalActions },
        { label: '云服务', actions: canSso ? [
          { label: '跳转云手机', icon: Cloud, disabled: Boolean(yunpanActionBusy),
            onSelect: select(() => runYunpanAction(acc.id, 'cloudphone')) },
          { label: '跳转云应用', icon: Cloud, disabled: Boolean(yunpanActionBusy),
            onSelect: select(() => runYunpanAction(acc.id, 'capp')) },
        ] : [] },
        { label: '10086 服务', actions: cmccActions },
        { label: '账号管理', actions: [
          ...(publicUser ? [
            { label: acc.publicPinnedAt ? '取消置顶' : '置顶', icon: acc.publicPinnedAt ? PinOff : Pin,
              onSelect: select(() => toggleAccountPinned(acc.id)) },
            { label: '上移', icon: ArrowUp, disabled: args.orderIndex <= 0,
              onSelect: select(() => moveAccount(acc.id, -1)) },
            { label: '下移', icon: ArrowDown, disabled: args.orderIndex < 0 || args.orderIndex >= args.orderGroupLength - 1,
              onSelect: select(() => moveAccount(acc.id, 1)) },
          ] : []),
          { label: '删除账号', icon: Trash2, danger: true,
            onSelect: select(() => deleteAccount(acc.id, args.displayPhone)) },
        ] },
      ]} />
  }
  const qrImageUrl =
    (pushConfig?.qrImageUrl && pushConfig.qrImageUrl.trim()) ||
    buildQrPreviewUrl(pushConfig?.subscribeUrl)

  return (
    <div
      className="public-login-page brand-page min-h-screen text-zinc-900"
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}>
      <SsoNavigationDialog
        url={pendingSso?.url ?? null}
        destination={pendingSso?.destination}
        onOpen={openPendingSsoUrl}
        onCopy={() => void copyPendingSsoUrl()}
      />
      <CallbackAppointmentDialog account={callbackAccount} publicLinkId={linkId || undefined} onClose={() => setCallbackAccount(null)} />
      <AccountLoginDialog
        open={loginDialogOpen}
        title={loginDialogAccount ? '重新登录账号' : '登录账号'}
        account={loginDialogAccount ?? undefined}
        publicLinkId={linkId || undefined}
        defaultMethod={
          loginDialogAccount?.lastLoginMethod === 'cmcc_qr' ||
          loginDialogAccount?.lastLoginMethod === 'manual_cookie' || loginDialogAccount?.lastLoginMethod === 'yunpan'
            ? loginDialogAccount.lastLoginMethod
            : 'cmcc_sms'
        }
        onClose={() => {
          setLoginDialogOpen(false)
          setLoginDialogAccount(null)
        }}
        onSuccess={onLoginDialogSuccess}
      />
      {messageNotice ? (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
          <div
            role="status"
            className={cn(
              'pointer-events-auto flex max-w-[min(92vw,420px)] items-start gap-2 rounded-xl border bg-white px-3 py-2 text-sm shadow-lg',
              messageNotice.type === 'success'
                ? 'border-emerald-200 text-emerald-800'
                : 'border-red-200 text-red-700',
            )}>
            {messageNotice.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <Shield className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{messageNotice.text}</span>
          </div>
        </div>
      ) : null}
      {yunpanActionBusy ? <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <div role="status" className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          {yunpanActionBusy === 'refresh' ? '正在置换全球通 Token…' : yunpanActionBusy === 'cmcc' ? '正在置换并验证 10086 CK…' : '正在生成跳转链接…'}
        </div>
      </div> : null}
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col justify-center px-2 py-4 sm:px-4 lg:px-6 xl:py-8">
        <div className={cn(
          'grid min-w-0 grid-cols-1 gap-3 sm:gap-4',
          publicUser ? 'xl:grid-cols-[360px_minmax(0,1fr)] xl:items-start' : 'mx-auto w-full max-w-[520px]',
        )}>
          <header data-onboarding="page-header" className="min-w-0 space-y-1 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm sm:space-y-2 sm:p-4 xl:sticky xl:top-6">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <h1 className="brand-heading text-lg font-semibold tracking-tight sm:text-2xl">
                  <BrandLogo className="h-7 w-7 sm:h-9 sm:w-9" />
                  <span className="truncate">中国移动用户管理</span>
                </h1>
                <p className="mt-1 truncate text-xs text-zinc-600 sm:text-sm">
                  {publicUser
                    ? `当前用户：${publicUser.username}`
                    : linkId
                      ? `邀请码：${linkId}`
                      : '请登录后使用'}
                </p>
              </div>
              {publicUser ? (
                <PublicExperienceControls
                  userId={publicUser.id}
                  initialData={announcementBootstrap}
                  onNotify={showMessage}
                />
              ) : null}
            </div>
            {redirectTarget ? (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-2 text-[11px] text-blue-800">
                <div className="font-medium">服务地址已更新</div>
                <div className="mt-1">
                  {pushConfig?.redirectNote?.trim() || '当前地址建议迁移到新的服务地址。登录成功后将自动跳转。'}
                </div>
                <a
                  className="mt-1 block break-all font-medium underline"
                  href={redirectTarget}>
                  {redirectTarget}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = redirectTarget
                  }}
                  className="mt-2 rounded-lg bg-blue-600 px-2 py-1 text-white">
                  去新地址登录
                </button>
              </div>
            ) : null}
          </header>

          <div className="space-y-3 sm:space-y-4">

          {!publicUser && linkAutoLoginLoading ? (
            <div className="rounded-2xl border border-blue-200 bg-white p-3 shadow-sm sm:p-4">
              <div className="flex items-center gap-3 text-sm text-zinc-700">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span>正在通过邀请码自动登录...</span>
              </div>
            </div>
          ) : !publicUser ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm sm:p-4">
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-zinc-900">用户名密码登录</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  新用户需通过邀请码首次注册；已注册用户可直接登录。
                </p>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-700">用户名</label>
                  <input
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    autoComplete="username"
                    placeholder="4-20 位字母、数字、下划线"
                    className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-700">密码</label>
                  <input
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    type="password"
                    autoComplete="current-password"
                    placeholder="8-32 位，至少包含两类字符"
                    className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <button
                  type="button"
                  onClick={onUserLogin}
                  disabled={authLoading || !authUsername.trim() || !authPassword}
                  className={cn(
                    'inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition',
                    !authLoading && authUsername.trim() && authPassword
                      ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                      : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                  )}>
                  {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  登录 / 首次自动注册
                </button>
                {!linkId ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-2 text-xs text-amber-700">
                    缺少邀请码时不能注册新用户；已注册用户仍可直接登录。
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* {publicUser && (!linkId || !linkValidated) ? (
            <div classNsame="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              {!linkId
                ? '当前为通用登录入口。'
                : '当前邀请码已完成关联，后续可直接使用通用登录入口。'}
            </div>
          ) : null} */}

          {publicUser && linkValidated && pushConfig?.pushplusEnabled && (pushConfig?.subscribeUrl || qrImageUrl) ? (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-3 shadow-sm sm:p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-zinc-900">扫码订阅专属通知</h2>
                  <p className="text-xs text-zinc-600 sm:text-sm">
                    {pushConfig.qrNote?.trim() || '扫码后可接收当前用户关联账号的登录、失效与抢购结果通知。'}
                  </p>
                  {pushConfig.subscribeUrl ? (
                    <a
                      href={pushConfig.subscribeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex text-xs font-medium text-blue-700 hover:text-blue-800">
                      打开订阅链接
                    </a>
                  ) : null}
                </div>
                {qrImageUrl ? (
                  <div className="rounded-xl border border-white bg-white p-2 shadow-sm">
                    <img
                      src={qrImageUrl}
                      alt="PushPlus 订阅二维码"
                      className="h-28 w-28 rounded-lg object-cover sm:h-32 sm:w-32"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
          <div
            ref={loginPanelRef}
            data-onboarding="login-entry"
            className={cn(
              'rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm sm:p-4',
              !hasPublicAccess && 'hidden',
            )}>
            <button
              type="button"
              onClick={() => {
                setLoginDialogAccount(null)
                setLoginDialogOpen(true)
              }}
              className="flex w-full items-center justify-between gap-3 text-left">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-zinc-900">登录移动账号</div>
                <div className="mt-1 truncate text-xs text-zinc-500">
                  支持 10086 验证码、App 扫码、导入 CK 和云盘登录。
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500" />
            </button>

            {false && loginExpanded ? (
              <div className="mt-3 space-y-2 sm:space-y-3">
                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-1">
                  <button
                    type="button"
                    onClick={() => setLoginMode('cmcc')}
                    className={cn(
                      'h-8 rounded-lg px-3 text-xs font-medium transition',
                      loginMode === 'cmcc'
                        ? 'bg-white text-zinc-900 shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-800',
                    )}>
                    中国移动登录（CK）
                  </button>
                  {/* <button
                    type="button"
                    onClick={() => setLoginMode('qqt')}
                    className={cn(
                      'h-8 rounded-lg px-3 text-xs font-medium transition',
                      loginMode === 'qqt'
                        ? 'bg-white text-zinc-900 shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-800',
                    )}>
                    全球通登录（Token）
                  </button> */}
                  <button
                    type="button"
                    onClick={() => setLoginMode('qr')}
                    className={cn(
                      'h-8 rounded-lg px-3 text-xs font-medium transition',
                      loginMode === 'qr'
                        ? 'bg-white text-zinc-900 shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-800',
                    )}>
                    App扫码登录（CK）
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMode('yunpan')}
                    className={cn(
                      'h-8 rounded-lg px-3 text-xs font-medium transition',
                      loginMode === 'yunpan'
                        ? 'bg-white text-zinc-900 shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-800',
                    )}>
                    云盘登录（10086 CK）
                  </button>
                  {/* <button
                    type="button"
                    onClick={() => setLoginMode('cookie')}
                    className={cn(
                      'h-8 rounded-lg px-3 text-xs font-medium transition',
                      loginMode === 'cookie'
                        ? 'bg-white text-zinc-900 shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-800',
                    )}>
                    导入 CK
                  </button> */}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-700">
                    {loginMode === 'cookie' || loginMode === 'qr' ? '手机号（可选）' : '手机号'}
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                    <Phone className="h-4 w-4 text-zinc-500" />
                    <PhoneInput
                      value={phone}
                      onValueChange={setPhone}
                      name="tel"
                      placeholder="请输入 11 位手机号"
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                </div>

                {loginMode === 'cookie' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-700">
                        Cookie / CK
                      </label>
                      <textarea
                        value={cookieText}
                        onChange={(e) => setCookieText(e.target.value)}
                        placeholder="粘贴完整 Cookie，例如 key=value; key2=value2"
                        rows={4}
                        className="w-full resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={onImportCookie}
                      disabled={!canImportCookie}
                      className={cn(
                        'inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition',
                        canImportCookie
                          ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                          : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                      )}>
                      {importingCookie ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      导入 CK 并刷新签到
                    </button>
                  </>
                ) : loginMode === 'qr' ? (
                  <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="text-sm font-semibold text-zinc-900">
                        中国移动 App 扫码登录
                      </div>
                      <button
                        type="button"
                        onClick={onStartQrLogin}
                        disabled={!canStartQrLogin}
                        title="生成/刷新二维码"
                        aria-label="生成/刷新二维码"
                        className={cn(
                          'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition',
                          canStartQrLogin
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                        )}>
                        {qrBusy ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCcw className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => void pollQrLogin()}
                        disabled={!qrFlow?.flowId || qrBusy || qrSaving}
                        title="检查状态"
                        aria-label="检查状态"
                        className={cn(
                          'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition',
                          qrFlow?.flowId && !qrBusy && !qrSaving
                            ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                            : 'cursor-not-allowed bg-zinc-50 text-zinc-400',
                        )}>
                        {qrPollingRef.current ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => void onSaveQrLogin()}
                        disabled={!canSaveQrLogin}
                        title="手动补保存"
                        aria-label="手动补保存"
                        className={cn(
                          'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition',
                          canSaveQrLogin
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                        )}>
                        {qrSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="flex aspect-square h-44 w-44 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 p-2">
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
                      {qrFlow?.expiresInSeconds !== undefined ? (
                        <div className="text-xs text-zinc-500">
                          剩余约 {qrFlow.expiresInSeconds}s
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                <>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-700">
                    短信验证码
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-1 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                      <KeyRound className="h-4 w-4 text-zinc-500" />
                      <input
                        value={code}
                        onChange={(e) => setCode(onlyDigits(e.target.value).slice(0, 6))}
                        id="public_login_code"
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
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {cooldown > 0 ? `重新获取(${cooldown}s)` : '获取验证码'}
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
                  {loginMode === 'yunpan'
                    ? '云盘登录并获取 10086 CK'
                    : loginMode === 'qqt'
                      ? '确认全球通登录'
                      : '确认中国移动登录'}
                </button>
                </>
                )}
              </div>
            ) : null}

            {/* <div className="mt-3 space-y-2">
              {!linkId ? (
                <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-2 text-xs text-amber-700 sm:p-3 sm:text-sm">
                  <Shield className="mt-0.5 h-4 w-4" />
                  <span>已使用通用账号登录，可继续管理已关联账号。</span>
                </div>
              ) : null}
              {error ? (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-2 text-xs text-red-700 sm:p-3 sm:text-sm">
                  <Shield className="mt-0.5 h-4 w-4" />
                  <span>{error}</span>
                </div>
              ) : null}
              {success ? (
                <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-700 sm:p-3 sm:text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4" />
                  <span>{success}</span>
                </div>
              ) : null}
            </div> */}
          </div>

          <div
            data-onboarding="account-tools"
            className={cn(
              'rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm sm:p-4 xl:min-h-[620px]',
              !publicUser && 'hidden',
            )}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <h2 className="text-sm font-semibold">已关联账号</h2>
                <a href="/starbucks" className="whitespace-nowrap text-xs text-emerald-800 hover:underline">星巴克卡券</a>
                <button
                  type="button"
                  onClick={() => void onUserLogout()}
                  className="whitespace-nowrap text-[11px] text-zinc-500 hover:text-zinc-900">
                  退出登录
                </button>
              </div>
              <button
                type="button"
                aria-label={listRefreshing ? '刷新中' : '刷新列表'}
                title={listRefreshing ? '刷新中' : '刷新列表'}
                onClick={() => void refreshVisibleAccounts()}
                disabled={listRefreshing}
                className={cn(
                  'grid h-8 w-8 shrink-0 place-items-center rounded-md',
                  !listRefreshing
                    ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                    : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                )}>
                {listRefreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div data-onboarding="account-summary" className="mb-2 grid grid-cols-4 gap-1 text-center text-[10px]">
              <div className="flex h-8 items-center justify-center gap-1 rounded-md bg-zinc-50 px-1 text-zinc-600">
                <div className="font-semibold text-zinc-900">{accounts.length}</div>
                <div>总数</div>
              </div>
              <div className="flex h-8 items-center justify-center gap-1 rounded-md bg-emerald-50 px-1 text-emerald-700">
                <div className="font-semibold">{usableAccountCount}</div>
                <div>可用</div>
              </div>
              <div className="flex h-8 items-center justify-center gap-1 rounded-md bg-amber-50 px-1 text-amber-800">
                <div className="font-semibold">{expiringSoonCount}</div>
                <div>将到期</div>
              </div>
              <div className="flex h-8 items-center justify-center gap-1 rounded-md bg-red-50 px-1 text-red-700">
                <div className="font-semibold">{unloggedAccountCount}</div>
                <div>未登录</div>
              </div>
            </div>
            <div className="mb-2 flex items-center justify-end">
              <div className="inline-flex rounded-md border border-zinc-200 bg-zinc-50 p-0.5" aria-label="账号展示方式">
                <button
                  type="button"
                  aria-label="宫格展示"
                  title="宫格展示"
                  aria-pressed={accountViewMode === 'grid'}
                  onClick={() => setAccountViewMode('grid')}
                  className={cn(
                    'grid h-7 w-8 place-items-center rounded',
                    accountViewMode === 'grid'
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-700',
                  )}>
                  <Grid2X2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="列表展示"
                  title="列表展示"
                  aria-pressed={accountViewMode === 'list'}
                  onClick={() => setAccountViewMode('list')}
                  className={cn(
                    'grid h-7 w-8 place-items-center rounded',
                    accountViewMode === 'list'
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-700',
                  )}>
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {/* <div className="mb-3 flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2">
              <span className="text-xs text-zinc-600">SSPID</span>
              <input
                value={qqtSspid}
                onChange={(e) => setQqtSspid(e.target.value)}
                placeholder="例如 75442"
                className="h-8 w-28 rounded-lg border border-zinc-200 bg-white px-2 text-xs text-zinc-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <span className="text-[11px] text-zinc-500">
                用于公链页签到
              </span>
            </div> */}
            <div data-onboarding="batch-actions" className="mb-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {publicUser && <button type="button" onClick={() => { window.location.href = appRoute(`/benefits/wed-puzzle?from=public${linkId ? `&link=${encodeURIComponent(linkId)}` : ''}`) }} className="inline-flex h-8 min-w-0 items-center justify-center gap-1 rounded-md bg-blue-50 px-1 text-[11px] font-medium text-blue-700 hover:bg-blue-100"><Puzzle className="h-3.5 w-3.5" />拼图互转号码池</button>}
              <button
                type="button"
                onClick={() => void startLinkBatchTask('ck_maintenance')}
                disabled={!hasTaskAccess || usableAccountCount === 0 || linkTaskRunning}
                className={cn(
                  'inline-flex h-8 min-w-0 items-center justify-center gap-1 rounded-md px-1 text-[11px] font-medium',
                  hasTaskAccess && usableAccountCount > 0 && !linkTaskRunning
                    ? 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                    : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                )}>
                {linkTaskRunning && activeLinkTask?.type === 'ck_maintenance' ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : <Wrench className="h-3.5 w-3.5" />}
                一键维护
              </button>
              <button
                type="button"
                onClick={() => void startLinkBatchTask('cmcc_auto_checkin')}
                disabled={!hasTaskAccess || cmccAccountCount === 0 || linkTaskRunning}
                className={cn(
                  'inline-flex h-8 min-w-0 items-center justify-center gap-1 rounded-md px-1 text-[11px] font-medium',
                  hasTaskAccess && cmccAccountCount > 0 && !linkTaskRunning
                    ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                )}>
                {linkTaskRunning && activeLinkTask?.type === 'cmcc_auto_checkin' ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : <ListChecks className="h-3.5 w-3.5" />}
                移动活动查询
              </button>
              <button
                type="button"
                onClick={() => void startLinkBatchTask('sign')}
                disabled={!hasTaskAccess || usableAccountCount === 0 || !qqtSspid.trim() || linkTaskRunning}
                className={cn(
                  'inline-flex h-8 min-w-0 items-center justify-center gap-1 rounded-md px-1 text-[11px] font-medium',
                  hasTaskAccess && usableAccountCount > 0 && Boolean(qqtSspid.trim()) && !linkTaskRunning
                    ? 'bg-violet-50 text-violet-700 hover:bg-violet-100'
                    : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                )}>
                {linkTaskRunning && activeLinkTask?.type === 'sign' ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : <CheckCircle2 className="h-3.5 w-3.5" />}
                一键签到
              </button>
              <button
                type="button"
                onClick={() => void startLinkBatchTask('global_telecom_resign')}
                disabled={!hasTaskAccess || globalTelecomRunnableAccountCount === 0 || linkTaskRunning}
                className={cn(
                  'inline-flex h-8 min-w-0 items-center justify-center gap-1 rounded-md px-1 text-[11px] font-medium',
                  hasTaskAccess && globalTelecomRunnableAccountCount > 0 && !linkTaskRunning
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                )}>
                {linkTaskRunning && activeLinkTask?.type === 'global_telecom_resign' ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : <CalendarDays className="h-3.5 w-3.5" />}
                一键补签+一键盲盒
              </button>
              <button
                type="button"
                onClick={() => setShowWedRechargeRunConfig(true)}
                disabled={!hasTaskAccess || cmccAccountCount === 0 || linkTaskRunning}
                className={cn(
                  'inline-flex h-8 min-w-0 items-center justify-center gap-1 rounded-md px-1 text-[11px] font-medium',
                  hasTaskAccess && cmccAccountCount > 0 && !linkTaskRunning
                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                )}>
                {linkTaskRunning && activeLinkTask?.type === 'wed_recharge' ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : <Puzzle className="h-3.5 w-3.5" />}
                一键拼图
              </button>
            </div>
            {activeLinkTask ? (
              <button
                type="button"
                onClick={() => openTaskLogModal(activeLinkTask)}
                className="mb-3 flex w-full flex-wrap items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-2 py-2 text-left text-[11px] text-sky-800 hover:bg-sky-100">
                <FileText className="h-3.5 w-3.5" />
                <span className="font-medium">当前任务：{formatTaskTypeName(activeLinkTask.type)}</span>
                <span>状态：{activeLinkTask.status}</span>
                <span>进度：{activeLinkTask.completedCount}/{activeLinkTask.totalCount}</span>
                {activeLinkTasks.length > 1 ? <span>队列：{activeLinkTasks.length} 个</span> : null}
              </button>
            ) : null}
            {accounts.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-200 p-2 text-xs text-zinc-500 sm:p-3">
                暂无登录账号，请先完成登录。
              </div>
            ) : (
              <div className={cn(
                accountViewMode === 'grid'
                  ? 'grid gap-3 xl:grid-cols-2 2xl:grid-cols-3'
                  : 'overflow-hidden rounded-lg border border-zinc-200',
              )} ref={accountListRef}>
                {accountViewMode === 'list' ? (
                  <div className="hidden grid-cols-[minmax(130px,1.1fr)_minmax(80px,.7fr)_minmax(100px,.9fr)_minmax(110px,1fr)_minmax(170px,1.3fr)_56px] gap-3 border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-[11px] font-medium text-zinc-500 md:grid">
                    <div>手机号</div>
                    <div>网龄</div>
                    <div>归属地</div>
                    <div>全球通等级</div>
                    <div>登录有效期</div>
                    <div className="text-right">操作</div>
                  </div>
                ) : null}
                {expiringSoonCount > 0 ? (
                  <div className={cn(
                    'border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-800',
                    accountViewMode === 'grid' ? 'col-span-full rounded-lg border' : 'border-b',
                  )}>
                    有 {expiringSoonCount} 个账号将在 12 小时内到期，请尽快重新登录。
                  </div>
                ) : null}
                {expiredSessionCount > 0 ? (
                  <div className={cn(
                    'border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700',
                    accountViewMode === 'grid' ? 'col-span-full rounded-lg border' : 'border-b',
                  )}>
                    有 {expiredSessionCount} 个账号的登录窗口已过期，请重新登录后再操作。
                  </div>
                ) : null}
                {invalidAccountCount > 0 ? (
                  <div className={cn(
                    'border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700',
                    accountViewMode === 'grid' ? 'col-span-full rounded-lg border' : 'border-b',
                  )}>
                    检测到 {invalidAccountCount} 个账号缺少可用登录态，请重新登录后再操作。
                  </div>
                ) : null}
                {accounts.map((acc) => {
                  const displayPhone =
                    acc.displayPhone ||
                    acc.phoneMasked ||
                    acc.label ||
                    '未命名账号'
                  const isRefreshing = Boolean(refreshingById[acc.id])
                  const isSigning = Boolean(signingById[acc.id])
                  const summary = activationById[acc.id]
                  const login = getAccountLoginState(acc)
                  const signState = signStateById[acc.id]
                  const hasToken = Boolean(acc.qqtAccessToken)
                  const effectiveLoginExpireAt = getEffectiveLoginExpireAt(acc)
                  const smsWindowState = getSmsLoginWindowState(effectiveLoginExpireAt)
                  const detailsExpanded = Boolean(expandedAccountIds[acc.id])
                  const ckInvalid = !login.hasYunpan &&
                    (Boolean(acc.cookieInvalidAt) || (acc.hasCookie && summary === null))
                  const accountUsable = login.loggedIn
                  const phoneValue = acc.displayPhone || acc.phoneMasked || '—'
                  const brandValue = summary?.brandLevelName ?? '—'
                  const starValue = summary?.telNumStar ?? '—'
                  const packageValue = summary?.tariffPackages ?? '—'
                  const regionValue = summary?.customerAssignment ?? '—'
                  const listProfile = getQqtListProfile(acc, summary)
                  const orderGroup = accounts.filter((item) => Boolean(item.publicPinnedAt) === Boolean(acc.publicPinnedAt))
                  const orderIndex = orderGroup.findIndex((item) => item.id === acc.id)
                  if (accountViewMode === 'list') {
                    const expiryText = effectiveLoginExpireAt
                      ? formatBeijingDateTime(effectiveLoginExpireAt)
                      : login.hasYunpan ? '已登录 · 云盘' : '—'
                    const expiryStatus = effectiveLoginExpireAt
                      ? formatSmsExpiryStatus(effectiveLoginExpireAt)
                      : ''
                    return (
                      <div
                        key={acc.id}
                        data-onboarding="account-card"
                        data-account-id={acc.id}
                        data-account-sortable={publicUser && accounts.length > 1 ? 'true' : undefined}
                        {...accountGestureProps(acc.id)}
                        ref={(node) => {
                          accountCardRefs.current[acc.id] = node
                        }}
                        className={cn(
                          'account-sort-item relative grid grid-cols-2 gap-x-3 gap-y-2 border-b border-zinc-100 px-3 py-3 pr-16 text-xs last:border-b-0 md:grid-cols-[minmax(130px,1.1fr)_minmax(80px,.7fr)_minmax(100px,.9fr)_minmax(110px,1fr)_minmax(170px,1.3fr)_56px] md:items-center md:gap-3 md:py-2.5 md:pr-3',
                          publicUser && accounts.length > 1 && 'cursor-grab select-none active:cursor-grabbing',
                        )}>
                        <div className="col-span-2 min-w-0 md:col-span-1">
                          <div className="mb-0.5 text-[10px] text-zinc-400 md:hidden">手机号</div>
                          <div className="truncate font-medium text-zinc-900">{displayPhone}</div>
                        </div>
                        <div className="min-w-0">
                          <div className="mb-0.5 text-[10px] text-zinc-400 md:hidden">网龄</div>
                          <div className="break-words text-zinc-700">{listProfile.netAge}</div>
                        </div>
                        <div className="min-w-0">
                          <div className="mb-0.5 text-[10px] text-zinc-400 md:hidden">归属地</div>
                          <div className="break-words text-zinc-700">{listProfile.region}</div>
                        </div>
                        <div className="min-w-0">
                          <div className="mb-0.5 text-[10px] text-zinc-400 md:hidden">全球通等级</div>
                          <div className="break-words text-zinc-700">{listProfile.level}</div>
                        </div>
                        <div className="min-w-0">
                          <div className="mb-0.5 text-[10px] text-zinc-400 md:hidden">登录有效期</div>
                          <div className={cn(
                            'break-words leading-5',
                            smsWindowState === 'expired'
                              ? 'text-red-700'
                              : smsWindowState === 'expiring'
                                ? 'text-amber-700'
                                : 'text-zinc-700',
                          )}>
                            {expiryText}{expiryStatus ? ` ${expiryStatus}` : ''}
                          </div>
                        </div>
                        <div className="absolute right-2 top-2 flex items-center justify-end gap-1 md:relative md:right-auto md:top-auto">
                          <AccountDragHandle visible={Boolean(publicUser && accounts.length > 1)} />
                          <button
                            type="button"
                            data-onboarding="account-menu"
                            aria-label={`${displayPhone} 操作菜单`}
                            aria-expanded={openAccountMenuId === acc.id}
                            onClick={(event) => {
                              event.stopPropagation()
                              toggleAccountMenu(acc.id, event.currentTarget)
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200">
                            <MoreHorizontal className="h-4 w-4 rotate-90" />
                          </button>
                          {renderAccountMenu({
                            acc,
                            displayPhone,
                            accountUsable,
                            isRefreshing,
                            isSigning,
                            orderIndex,
                            orderGroupLength: orderGroup.length,
                          })}
                        </div>
                      </div>
                    )
                  }
                  const xdr = xdrById[acc.id]
                  const xdrPrizeNames = xdr
                    ? formatPrizeNames(xdr.prodList, xdrPrizeMap)
                    : '—'
                  const xdrPrizeText = xdr
                    ? xdr.prodList.length > 0
                      ? xdrPrizeNames
                      : '未领取'
                    : '—'
                  const wedTaskItem =
                    activeLinkTask?.type === 'wed_recharge'
                      ? activeLinkTask.items.find((item) => item.accountId === acc.id)
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
                    : `未参与：当前次数 ${acc.wedRechargeInfo?.drawTimes ?? '—'}`
                  const todayStates = dailyTaskStates[acc.id] ?? []
                  return (
                    <div
                      key={acc.id}
                      data-onboarding="account-card"
                      data-account-id={acc.id}
                      data-account-sortable={publicUser && accounts.length > 1 ? 'true' : undefined}
                      {...accountGestureProps(acc.id)}
                      ref={(node) => {
                        accountCardRefs.current[acc.id] = node
                      }}
                      className={cn(
                        'account-sort-item rounded-xl border p-2 shadow-sm sm:p-3',
                        publicUser && accounts.length > 1 && 'cursor-grab select-none active:cursor-grabbing',
                        ckInvalid
                          ? 'border-red-300 bg-red-50/40'
                          : 'border-zinc-200',
                      )}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-zinc-900">
                            {displayPhone}
                          </div>
                          <div
                            className={cn(
                              'text-xs',
                              ckInvalid ? 'text-red-700' : 'text-zinc-500',
                            )}>
                            云盘 CK: {getYunpanCredentialStatus(acc).label} | 10086 CK: {acc.hasCookie ? login.hasCmcc ? '已缓存' : '失效' : '未登录'} | 全球通 Token:{' '}
                            {hasToken ? '已缓存' : '未缓存'}
                            {ckInvalid ? '（已失效）' : ''}
                          </div>
                          {acc.cookieInvalidReason && !login.hasYunpan ? (
                            <div className="text-xs text-red-700">
                              原因: {acc.cookieInvalidReason}
                            </div>
                          ) : null}
                          <div className="text-xs text-zinc-500">
                            更新时间:{' '}
                            {formatBeijingDateTime(
                              login.yunpanOnly ? acc.yunpanSessionUpdatedAt || acc.updatedAt : acc.cookieUpdatedAt || acc.updatedAt,
                            )}
                          </div>
                          <div className="text-xs text-zinc-500">
                            登录方式: {login.hasYunpan && login.hasCmcc ? '10086 + 云盘' : login.yunpanOnly ? '云盘' : formatLoginMethod(acc.lastLoginMethod)}
                            {effectiveLoginExpireAt
                              ? ` | 到期: ${formatBeijingDateTime(effectiveLoginExpireAt)} ${formatSmsExpiryStatus(effectiveLoginExpireAt)}`
                              : ''}
                          </div>
                          {acc.cookieSource === 'qqt_sso' && acc.cookieExpireAt ? <div className="text-xs text-zinc-500">
                            10086 CK 有效期: {formatBeijingDateTime(acc.cookieExpireAt)}
                          </div> : null}
                          {!accountUsable ? (
                            <div className="text-xs font-medium text-red-700">
                              当前账号无可用 CK/Token，请重新登录
                            </div>
                          ) : null}
                        </div>
	                        <div className="relative flex shrink-0 items-center gap-1">
                              <AccountDragHandle visible={Boolean(publicUser && accounts.length > 1)} />
	                          <button
	                            type="button"
	                            data-onboarding="account-menu"
	                            aria-label={`${displayPhone} 操作菜单`}
	                            aria-expanded={openAccountMenuId === acc.id}
		                            onClick={(e) => {
		                              e.stopPropagation()
		                              toggleAccountMenu(acc.id, e.currentTarget)
		                            }}
		                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200">
		                            <MoreHorizontal className="h-4 w-4 rotate-90" />
		                          </button>
                          {renderAccountMenu({
                            acc, displayPhone, accountUsable, isRefreshing, isSigning,
                            orderIndex, orderGroupLength: orderGroup.length,
                          })}
	                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5',
                            accountUsable
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700',
                          )}>
                          {accountUsable ? '已登录' : '未登录'}
                        </span>
                        {effectiveLoginExpireAt ? <span
                          className={cn(
                            'rounded-full px-2 py-0.5',
                            smsWindowState === 'expired'
                              ? 'bg-red-50 text-red-700'
                              : smsWindowState === 'expiring'
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-zinc-100 text-zinc-600',
                          )}>
                          {smsWindowState === 'expired'
                            ? '登录窗口过期'
                            : smsWindowState === 'expiring'
                              ? '登录窗口将到期'
                              : `到期 ${formatBeijingDateTime(effectiveLoginExpireAt)}`}
                        </span> : null}
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">
                          签到 {signState?.message ?? '—'}
                        </span>
                        {login.hasCmcc ? <button
                          type="button"
                          onClick={() => activeLinkTask ? openTaskLogModal(activeLinkTask) : undefined}
                          disabled={!wedTaskItem || !activeLinkTask}
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5',
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
                          {wedTaskItem ? <FileText className="h-3 w-3" /> : null}
                          周三拼图 {wedStatusText}
                        </button> : null}
                        <button
                          type="button"
                          onClick={() => toggleAccountDetails(acc.id)}
                          className="ml-auto inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-700 hover:bg-zinc-200">
                          {detailsExpanded ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                          详情
                        </button>
                      </div>
                      {smsWindowState === 'expiring' ? (
                        <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-800">
                          当前登录窗口将在 12 小时内到期，建议尽快重新登录。
                        </div>
                      ) : null}
                      {smsWindowState === 'expired' ? (
                        <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">
                          当前登录窗口已过期，请重新登录后再继续使用。
                        </div>
                      ) : null}
                      {detailsExpanded ? (
                      <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-[11px] text-zinc-700">
                        <div className="mb-2 font-medium text-zinc-700">
                          {login.yunpanOnly ? '全球通信息' : '用户信息'}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-zinc-500">手机号:</span>{' '}
                            {phoneValue}
                          </div>
                          {login.yunpanOnly ? <>
                            <div><span className="text-zinc-500">全球通等级:</span> {listProfile.level}</div>
                            <div><span className="text-zinc-500">网龄:</span> {listProfile.netAge}</div>
                            <div><span className="text-zinc-500">号码归属地:</span> {listProfile.region}</div>
                          </> : <>
                          <div>
                            <span className="text-zinc-500">品牌:</span>{' '}
                            {brandValue}
                          </div>
                          <div>
                            <span className="text-zinc-500">星级:</span>{' '}
                            {starValue}
                          </div>
                          <div>
                            <span className="text-zinc-500">主套餐:</span>{' '}
                            {packageValue}
                          </div>
                          <div>
                            <span className="text-zinc-500">归属地:</span>{' '}
                            {regionValue}
                          </div>
                          <div>
                            <span className="text-zinc-500">更新时间:</span>{' '}
                            {formatBeijingDateTime(summary?.oprTime)}
                          </div>
                          </>}
                          <div className="col-span-2">
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
                          {!login.yunpanOnly ? <><div>
                            <span className="text-zinc-500">最近验证码登录:</span>{' '}
                            {formatBeijingDateTime(acc.smsLoginAt)}
                          </div>
                          <div>
                            <span className="text-zinc-500">登录有效期到期:</span>{' '}
                            {formatBeijingDateTime(effectiveLoginExpireAt)}
                            {formatSmsExpiryStatus(effectiveLoginExpireAt)}
                          </div></> : null}
                          <div className="col-span-2">
                            <span className="text-zinc-500">签到状态:</span>{' '}
                            {signState?.message ?? '—'}
                            {signState?.updatedAt
                              ? `（${formatBeijingDateTime(signState.updatedAt)}）`
                              : ''}
                          </div>
                          {todayStates.length > 0 ? (
                            <button
                              type="button"
                              onClick={() => setDailyLogModal({
                                title: acc.displayPhone || acc.phoneMasked || acc.id,
                                states: todayStates,
                              })}
                              className="col-span-2 inline-flex items-center justify-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50">
                              <FileText className="h-3.5 w-3.5" />
                              今日任务日志 {todayStates.length} 条
                            </button>
                          ) : null}
                        </div>
                      </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
      {showWedRechargeRunConfig ? createPortal(
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto p-4">
          <button
            type="button"
            aria-label="关闭一键拼图配置遮罩"
            onClick={() => setShowWedRechargeRunConfig(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="public-wed-config-title"
            className="relative z-10 w-full max-w-2xl rounded-lg border border-zinc-200 bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div id="public-wed-config-title" className="text-lg font-semibold text-zinc-900">一键拼图配置</div>
                <div className="mt-1 text-xs text-zinc-500">
                  使用账号当前 10086 CK，逐个账号串行处理。
                </div>
              </div>
              <button
                type="button"
                aria-label="关闭一键拼图配置"
                onClick={() => setShowWedRechargeRunConfig(false)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-zinc-50">
                <div className="flex items-center justify-between gap-3 px-3 py-2">
                  <span className="text-zinc-500">活动凭证</span>
                  <span className="font-medium text-zinc-900">10086 CK</span>
                </div>
                <div className="flex items-start justify-between gap-3 px-3 py-2">
                  <span className="text-zinc-500">自动处理</span>
                  <span className="text-right font-medium text-zinc-900">类型 1-6</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowWedRechargeRunConfig(false)}
                className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200">
                取消
              </button>
              <button
                type="button"
                onClick={() => void startPublicWedRechargeFromConfig()}
                disabled={linkTaskRunning || !hasTaskAccess || cmccAccountCount === 0}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium',
                  !linkTaskRunning && hasTaskAccess && cmccAccountCount > 0
                    ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                    : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                )}>
                {linkTaskRunning ? '任务执行中' : '开始拼图'}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      ) : null}
      {taskLogModalTask ? createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto p-4">
          <button
            type="button"
            aria-label="关闭任务日志遮罩"
            onClick={() => setTaskLogModalTask(null)}
            className="absolute inset-0 bg-black/40"
          />
          <div role="dialog" aria-modal="true" aria-labelledby="public-task-log-title" className="relative z-10 flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="shrink-0 flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-3 sm:px-5 sm:py-4">
              <div className="min-w-0">
                <div id="public-task-log-title" className="text-lg font-semibold text-zinc-900">任务日志</div>
                <div className="mt-1 text-xs text-zinc-500">
                  {formatTaskTypeName(taskLogModalTask.type)} · {taskLogModalTask.status} · {taskLogModalTask.completedCount}/{taskLogModalTask.totalCount}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={() => void loadLinkTaskById(taskLogModalTask.id).catch(() => undefined)}
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
                  aria-label="关闭任务日志"
                  onClick={() => setTaskLogModalTask(null)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[280px_1fr]">
              <div className="min-h-0 border-b border-zinc-200 bg-zinc-50 p-3 lg:border-b-0 lg:border-r">
                <div className="mb-2 text-xs font-medium text-zinc-500">任务队列</div>
                <div className="max-h-72 space-y-2 overflow-auto lg:h-[calc(88vh-130px)] lg:max-h-none">
                  {activeLinkTasks.length > 0 ? activeLinkTasks.map((task) => (
                    <div key={task.id} className="rounded-lg border border-zinc-200 bg-white p-2 text-xs">
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
              <div className="min-h-0 overflow-auto p-4">
                <div className="mb-3 grid gap-2 text-xs text-zinc-700 sm:grid-cols-4">
                  <div className="rounded-lg bg-zinc-50 p-2">总数：{taskLogModalTask.totalCount}</div>
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">成功：{taskLogModalTask.successCount}</div>
                  <div className="rounded-lg bg-red-50 p-2 text-red-700">失败：{taskLogModalTask.failedCount}</div>
                  <div className="rounded-lg bg-zinc-50 p-2">跳过：{taskLogModalTask.skippedCount}</div>
                </div>
                {taskLogModalTask.items.map((item) => (
                  <div key={item.id} className="mb-2 rounded-lg border border-zinc-200 bg-white p-3 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-zinc-900">{item.orderIndex + 1}. {item.accountLabel || item.accountId}</span>
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-600">{item.status}</span>
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
        </div>,
        document.body,
      ) : null}
      {dailyLogModal ? createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto p-4">
          <button
            type="button"
            aria-label="关闭今日任务日志遮罩"
            onClick={() => setDailyLogModal(null)}
            className="absolute inset-0 bg-black/40"
          />
          <div role="dialog" aria-modal="true" aria-labelledby="public-daily-log-title" className="relative z-10 flex max-h-[80vh] w-full max-w-xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="shrink-0 flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-3 sm:px-5 sm:py-4">
              <div className="min-w-0">
                <div id="public-daily-log-title" className="text-lg font-semibold text-zinc-900">今日任务日志</div>
                <div className="mt-1 text-xs text-zinc-500">{dailyLogModal.title}</div>
              </div>
              <button
                type="button"
                aria-label="关闭今日任务日志"
                onClick={() => setDailyLogModal(null)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 space-y-2 overflow-auto p-4">
              {dailyLogModal.states.map((state) => (
                <div key={`${state.taskType}-${state.updatedAt || ''}`} className="rounded-lg border border-zinc-200 bg-white p-3 text-xs text-zinc-700">
                  <div className="font-medium text-zinc-900">
                    {state.taskType === 'refresh_cookie'
                      ? '刷新 CK'
                      : state.taskType === 'qqt_token'
                        ? '全球通 Token'
                        : state.taskType === 'qqt_sign'
                          ? '全球通签到'
                          : state.taskType === 'wed_puzzle'
                            ? '拼图任务'
                            : state.taskType}
                    ：{state.status}
                  </div>
                  {state.message ? <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-zinc-50 p-2">{state.message}</pre> : null}
                  {state.updatedAt ? <div className="mt-2 text-zinc-500">{formatBeijingDateTime(state.updatedAt)}</div> : null}
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body,
      ) : null}
    </div>
  )
}

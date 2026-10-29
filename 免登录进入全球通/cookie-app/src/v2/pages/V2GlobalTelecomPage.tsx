import BrandLogo from '@/components/BrandLogo'
import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  CalendarCheck2,
  Check,
  ChevronRight,
  CircleAlert,
  Gift,
  ListChecks,
  Loader2,
  MessageCircle,
  PackageCheck,
  PhoneCall,
  RefreshCw,
  RotateCcw,
  Sparkles,
  UserRoundCheck,
  WalletCards,
  X,
} from 'lucide-react'
import { Component, useCallback, useEffect, useMemo, useRef, useState, type ErrorInfo, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link, useSearchParams } from 'react-router-dom'
import V2ConfirmDialog from '../components/V2ConfirmDialog'
import { ApiClientError } from '../lib/api'
import {
  acceptGlobalTelecomReward,
  canQueryGlobalTelecomAccount,
  formatGlobalTelecomAccountOption,
  getGlobalTelecomBackHref,
  getTodaySignAction,
  loadGlobalTelecomAccounts,
  loadGlobalTelecomCustomerServiceLink,
  loadGlobalTelecomOverview,
  resignGlobalTelecom,
  runGlobalTelecomBlindBoxAction,
  signGlobalTelecom,
  selectGlobalTelecomAccountId,
  type GlobalTelecomAccount,
  type GlobalTelecomDay,
  type GlobalTelecomOverview,
} from '../lib/globalTelecomApi'
import { loadXdrPrizeMap, resolveXdrPrizeName } from '@/lib/xdrPrize'
import { cn } from '@/lib/utils'

type Props = {
  publicMode?: boolean
  accounts?: GlobalTelecomAccount[]
}

class GlobalTelecomPageErrorBoundary extends Component<{ children: ReactNode }, { message: string }> {
  state = { message: '' }

  static getDerivedStateFromError(error: unknown): { message: string } {
    return { message: error instanceof Error ? error.message : '页面数据渲染失败' }
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    console.error('[global-telecom] render failed', error, info)
  }

  render(): ReactNode {
    if (!this.state.message) return this.props.children
    return (
      <div className="grid min-h-screen place-items-center bg-[#f3f6f6] p-4">
        <div className="w-full max-w-lg rounded-md border border-rose-200 bg-white p-6 text-center shadow-sm">
          <CircleAlert className="mx-auto h-7 w-7 text-rose-600" />
          <h1 className="mt-3 text-base font-semibold text-zinc-950">全球通数据暂时无法展示</h1>
          <p className="mt-2 break-words text-xs text-zinc-500">{this.state.message}</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-5 inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white"><RefreshCw className="h-4 w-4" />重新加载</button>
        </div>
      </div>
    )
  }
}

type PendingAction =
  | { kind: 'sign' }
  | { kind: 'resign'; dayNum: number; taskIds: number[] }
  | { kind: 'reward'; dayNum: number; prizeId: string; isVirtual: boolean; prizeName: string }
  | { kind: 'blind-draw' }
  | { kind: 'blind-receive'; prizeCode: string }
  | { kind: 'blind-task'; taskNumber: number }
  | { kind: 'blind-all' }

type DetailView =
  | { kind: 'claimed' }
  | { kind: 'growth' }
  | { kind: 'sign'; dayNum: number }
  | { kind: 'blind-box' }
  | { kind: 'manager' }

const ACTION_COPY: Record<PendingAction['kind'], { title: string; description: string; label: string }> = {
  sign: { title: '确认今日签到', description: '将使用当前账号参加本期星签好礼。', label: '确认签到' },
  resign: { title: '确认执行补签任务', description: '将依次提交该日所有未完成任务（最多 3 项）；最后一项完成后才会形成补签结果。', label: '确认补签' },
  reward: { title: '确认补领签到权益', description: '将收下已获得但尚未领取的签到奖品。', label: '确认补领' },
  'blind-draw': { title: '确认使用盲盒机会', description: '本次操作会消耗 1 次可用抽奖机会。确认即表示已阅读并同意官方星动盲盒活动规则。', label: '同意规则并抽奖' },
  'blind-receive': { title: '确认收下盲盒奖品', description: '奖品领取成功后将按活动规则发放。', label: '确认领取' },
  'blind-task': { title: '确认完成盲盒任务', description: '将向全球通上游提交当前任务的完成状态。', label: '确认完成' },
  'blind-all': { title: '确认完成可用盲盒任务', description: '逐一提交并核验当前账号已开放的未完成任务，不消耗抽奖机会。', label: '依次完成任务' },
}

type SavedBlindPrize = { prizeCode: string; prizeName?: string; received?: boolean; fulfillmentUrl?: string }
function blindPrizeKey(accountId: string, sspid: string): string {
  const month = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' }).format(new Date()).slice(0, 7)
  return `cmcc_blind_prize:${accountId}:${sspid}:${month}`
}
function readSavedBlindPrize(key: string): SavedBlindPrize | undefined {
  try {
    const prize = JSON.parse(window.localStorage.getItem(key) || 'null')
    if (!prize || !/^\d{1,10}$/.test(prize.prizeCode) || prize.prizeCode === '9999') return undefined
    const url = prize.fulfillmentUrl ? new URL(prize.fulfillmentUrl) : undefined
    return { prizeCode: prize.prizeCode, prizeName: typeof prize.prizeName === 'string' ? prize.prizeName : undefined,
      received: prize.received === true,
      fulfillmentUrl: url?.protocol === 'https:' && ['wj.qq.com', 'www.wjx.top', 'v.wjx.cn'].includes(url.hostname) ? url.href : undefined }
  } catch { return undefined }
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    const payload = error.payload && typeof error.payload === 'object'
      ? error.payload as Record<string, unknown>
      : undefined
    if (payload?.cloudflare_error === true && (error.status === 429 || error.status === 503)) {
      const retryAfter = Number(payload.retry_after)
      return `查询服务暂时繁忙，请${Number.isFinite(retryAfter) ? `等待 ${retryAfter} 秒后` : '稍后'}再试；已获取的数据会继续保留。`
    }
    return error.requestId ? `${error.message}（请求 ${error.requestId}）` : error.message
  }
  return error instanceof Error ? error.message : '请求失败'
}

const BROWSER_CACHE_FRESH_MS = 60_000
const BROWSER_CACHE_STALE_MS = 24 * 60 * 60_000

type BrowserOverviewCache = {
  savedAt: number
  overview: GlobalTelecomOverview
}

function browserOverviewCacheKey(accountId: string, sspid: string): string {
  return `cmcc_global_telecom_overview:${accountId}:${sspid}`
}

function readBrowserOverviewCache(accountId: string, sspid: string): BrowserOverviewCache | undefined {
  if (typeof window === 'undefined') return undefined
  try {
    const raw = window.localStorage.getItem(browserOverviewCacheKey(accountId, sspid))
    if (!raw) return undefined
    const cached = JSON.parse(raw) as BrowserOverviewCache
    if (!cached?.overview || !Number.isFinite(cached.savedAt) || Date.now() - cached.savedAt > BROWSER_CACHE_STALE_MS) {
      window.localStorage.removeItem(browserOverviewCacheKey(accountId, sspid))
      return undefined
    }
    return cached
  } catch {
    return undefined
  }
}

function writeBrowserOverviewCache(accountId: string, sspid: string, overview: GlobalTelecomOverview): void {
  if (typeof window === 'undefined') return
  try {
    const refreshedAt = Date.parse(overview.refreshedAt)
    window.localStorage.setItem(
      browserOverviewCacheKey(accountId, sspid),
      JSON.stringify({
        savedAt: Number.isFinite(refreshedAt) ? refreshedAt : Date.now(),
        overview,
      } satisfies BrowserOverviewCache),
    )
  } catch {
    // Local storage may be unavailable in private browsing modes.
  }
}

function clearBrowserOverviewCache(accountId: string, sspid: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(browserOverviewCacheKey(accountId, sspid))
}

function formatTime(value?: string): string {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

function formatJoinDate(value?: string): string {
  if (!value) return '--'
  const digits = value.replace(/\D/g, '')
  if (digits.length >= 8) return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`
  return value
}

function monthLabel(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length >= 6) return `${Number(digits.slice(-2))}月`
  return value
}

function money(value?: number): string {
  if (value === undefined || !Number.isFinite(value)) return '--'
  return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 }).format(value)
}

function signState(day: GlobalTelecomDay): { label: string; tone: string } {
  if (day.signStatus === 1) return { label: '已签到', tone: 'bg-emerald-50 text-emerald-700' }
  if (day.signStatus === 2) return { label: '可补签', tone: 'bg-amber-50 text-amber-700' }
  if (day.signStatus === 0) return { label: '未签到', tone: 'bg-rose-50 text-rose-700' }
  return { label: '待开放', tone: 'bg-zinc-100 text-zinc-600' }
}

const SIGN_TASK_NAMES: Record<number, string> = {
  1: '体验中国移动云手机',
  2: '浏览逐马计划',
  3: '升级新通话会员',
  4: '趣玩 AI 抽红包',
  5: '体验新通话积分活动',
  6: '浏览尊享云会员',
  7: '玩移动云手机',
  8: '点亮通话大屏',
  9: '云盘免费领红包',
}

function SectionHeader({ icon: Icon, title, meta, action, tone = 'default' }: {
  icon: typeof Gift
  title: string
  meta?: string
  action?: React.ReactNode
  tone?: 'default' | 'gold' | 'activity'
}) {
  return (
    <header className={cn(
      'flex min-h-12 items-center gap-2.5 border-b px-4 py-2.5',
      tone === 'gold' && 'border-[#ead8b9] bg-[#fbf5ea]',
      tone === 'activity' && 'flex-wrap border-[#49352e] bg-[#2a1d19] text-white min-[360px]:flex-nowrap',
      tone === 'default' && 'border-zinc-200',
    )}>
      <span className={cn(
        'grid h-8 w-8 shrink-0 place-items-center rounded-md',
        tone === 'gold' && 'bg-[#ead8b9] text-[#8b642d]',
        tone === 'activity' && 'bg-[#4a352d] text-[#f3cf91]',
        tone === 'default' && 'bg-zinc-100 text-zinc-700',
      )}><Icon className="h-4 w-4" /></span>
      <div className={cn('min-w-0 flex-1', tone === 'activity' && 'min-w-[140px] min-[360px]:min-w-0')}><h2 className={cn('text-sm font-semibold', tone === 'activity' ? 'text-white' : 'text-zinc-950')}>{title}</h2>{meta ? <p className={cn('mt-0.5 truncate text-xs', tone === 'activity' ? 'text-[#d8c1b7]' : 'text-zinc-500')}>{meta}</p> : null}</div>
      {action}
    </header>
  )
}

function DetailButton({ label = '查看详情', onClick, tone = 'default' }: { label?: string; onClick: () => void; tone?: 'default' | 'onDark' }) {
  return (
    <button type="button" onClick={onClick} className={cn('inline-flex h-8 shrink-0 items-center gap-1 rounded-md px-2 text-xs font-medium', tone === 'onDark' ? 'text-[#f3cf91] hover:bg-white/10 hover:text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950')}>
      {label}<ChevronRight className="h-3.5 w-3.5" />
    </button>
  )
}

function DetailDialog({ title, meta, onClose, children }: {
  title: string
  meta?: string
  onClose: () => void
  children: ReactNode
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  if (typeof document === 'undefined') return null
  return createPortal(
    <div className="fixed inset-0 z-[130] flex items-end justify-center sm:items-center sm:p-4">
      <button type="button" aria-label="关闭详情遮罩" onClick={onClose} className="absolute inset-0 bg-black/45" />
      <section role="dialog" aria-modal="true" aria-labelledby="global-telecom-detail-title" className="relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-md border border-zinc-200 bg-white shadow-2xl sm:max-w-2xl sm:rounded-md">
        <header data-dialog-drag-handle className="flex shrink-0 items-start gap-3 border-b border-zinc-200 px-4 py-3.5 sm:px-5">
          <div className="min-w-0 flex-1">
            <h2 id="global-telecom-detail-title" className="text-base font-semibold text-zinc-950">{title}</h2>
            {meta ? <p className="mt-1 text-xs text-zinc-500">{meta}</p> : null}
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="关闭详情" className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100"><X className="h-4 w-4" /></button>
        </header>
        <div className="min-h-0 overflow-y-auto px-4 py-4 sm:px-5">{children}</div>
      </section>
    </div>,
    document.body,
  )
}

function GlobalTelecomPageContent({ publicMode = false, accounts: suppliedAccounts }: Props) {
  const [searchParams] = useSearchParams()
  const publicLinkId = searchParams.get('publicLinkId') || searchParams.get('link') || ''
  const requestedAccountId = searchParams.get('accountId') || ''
  const [accounts, setAccounts] = useState<GlobalTelecomAccount[]>(suppliedAccounts ?? [])
  const [accountId, setAccountId] = useState('')
  const [sspid, setSspid] = useState(() =>
    typeof window === 'undefined' ? '75442' : window.localStorage.getItem('cmcc_qqt_sspid') || '75442',
  )
  const [overview, setOverview] = useState<GlobalTelecomOverview>()
  const [loadingAccounts, setLoadingAccounts] = useState(!suppliedAccounts)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [openingCustomerService, setOpeningCustomerService] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [pendingAction, setPendingAction] = useState<PendingAction>()
  const [detailView, setDetailView] = useState<DetailView>()
  const [drawnPrize, setDrawnPrize] = useState<SavedBlindPrize>()
  const [prizeMap, setPrizeMap] = useState<Record<string, string>>({})
  const activeQueryKeyRef = useRef('')
  const refreshInFlight = useRef(new Set<string>())
  const accountSelectionRoute = useRef('')
  activeQueryKeyRef.current = `${accountId}:${sspid}:${publicLinkId}`

  useEffect(() => {
    setDrawnPrize(accountId ? readSavedBlindPrize(blindPrizeKey(accountId, sspid)) : undefined)
    setPendingAction(undefined)
  }, [accountId, sspid, publicLinkId])

  function saveBlindPrize(prize?: SavedBlindPrize) {
    try {
      const key = blindPrizeKey(accountId, sspid)
      if (prize) window.localStorage.setItem(key, JSON.stringify(prize))
      else window.localStorage.removeItem(key)
    } catch { /* Storage restrictions must not discard the visible draw result. */ }
    if (activeQueryKeyRef.current === `${accountId}:${sspid}:${publicLinkId}`) setDrawnPrize(prize)
  }

  useEffect(() => {
    void loadXdrPrizeMap().then(setPrizeMap)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('cmcc_qqt_sspid', sspid)
  }, [sspid])

  useEffect(() => {
    const route = `${publicMode}:${publicLinkId}:${requestedAccountId}`
    const routeChanged = accountSelectionRoute.current !== route
    accountSelectionRoute.current = route
    if (routeChanged) {
      setAccountId('')
      setOverview(undefined)
      setLoading(false)
      setError('')
    }
    const applyAccounts = (items: GlobalTelecomAccount[]) => {
      const usable = items.filter(canQueryGlobalTelecomAccount)
      setAccounts(usable)
      setAccountId((current) => selectGlobalTelecomAccountId(usable, requestedAccountId, routeChanged ? '' : current))
      if (requestedAccountId && !usable.some((account) => account.id === requestedAccountId)) {
        setError('所选账号不在当前可查询列表中，请返回账号页面刷新或重新登录该账号')
      }
    }
    if (suppliedAccounts) {
      applyAccounts(suppliedAccounts)
      setLoadingAccounts(false)
      return
    }
    let alive = true
    setLoadingAccounts(true)
    void loadGlobalTelecomAccounts({ publicMode, publicLinkId: publicLinkId || undefined })
      .then((items) => {
        if (!alive) return
        applyAccounts(items)
      })
      .catch((reason) => alive && setError(errorMessage(reason)))
      .finally(() => alive && setLoadingAccounts(false))
    return () => { alive = false }
  }, [publicLinkId, publicMode, requestedAccountId, suppliedAccounts])

  const refresh = useCallback(async (silent = false) => {
    if (!accountId) return
    const queryKey = `${accountId}:${sspid}:${publicLinkId}`
    if (refreshInFlight.current.has(queryKey)) return
    refreshInFlight.current.add(queryKey)
    setLoading(true)
    if (!silent) setError('')
    try {
      const result = await loadGlobalTelecomOverview({
        accountId,
        publicLinkId: publicLinkId || undefined,
        sspid,
      })
      if (result.overview && activeQueryKeyRef.current === queryKey) {
        setAccounts((items) => items.map((account) => account.id === result.account.id ? { ...account, ...result.account } : account))
        setOverview(result.overview)
        writeBrowserOverviewCache(accountId, sspid, result.overview)
      }
    } catch (reason) {
      if (activeQueryKeyRef.current === queryKey) {
        setError(errorMessage(reason))
        // Authentication expiry can be recorded even when no overview is
        // returned. Refresh status without changing selection or account scope.
        try {
          const latest = await loadGlobalTelecomAccounts({ publicMode, publicLinkId: publicLinkId || undefined })
          if (activeQueryKeyRef.current === queryKey) {
            setAccounts((items) => items.map((account) => {
              const updated = latest.find((item) => item.id === account.id)
              return updated ? { ...account, ...updated } : account
            }))
          }
        } catch { /* Keep the loaded accounts and the original query error. */ }
      }
    } finally {
      refreshInFlight.current.delete(queryKey)
      if (activeQueryKeyRef.current === queryKey) setLoading(false)
    }
  }, [accountId, publicLinkId, publicMode, sspid])

  useEffect(() => {
    if (!accountId) return
    let alive = true
    const browserCached = readBrowserOverviewCache(accountId, sspid)
    setOverview(browserCached?.overview)
    setError('')
    if (!browserCached) setLoading(true)
    void (async () => {
      let newest = browserCached
      try {
        const result = await loadGlobalTelecomOverview({
          accountId,
          publicLinkId: publicLinkId || undefined,
          sspid,
          cacheOnly: true,
        })
        if (!alive) return
        setAccounts((items) => items.map((account) => account.id === result.account.id ? { ...account, ...result.account } : account))
        if (result.overview) {
          const persistedAt = Date.parse(result.overview.refreshedAt)
          if (!newest || !Number.isFinite(newest.savedAt) || persistedAt >= newest.savedAt) {
            newest = {
              savedAt: Number.isFinite(persistedAt) ? persistedAt : Date.now(),
              overview: result.overview,
            }
            setOverview(result.overview)
            writeBrowserOverviewCache(accountId, sspid, result.overview)
          }
        }
      } catch {
        // A missing backend snapshot must not block the live request.
      }
      if (!alive) return
      if (newest && Date.now() - newest.savedAt <= BROWSER_CACHE_FRESH_MS) {
        setLoading(false)
        return
      }
      await refresh()
    })()
    return () => { alive = false }
    // refresh is intentionally keyed by the selected account and channel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, sspid])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 3600)
    return () => window.clearTimeout(timer)
  }, [notice])

  const selectedAccount = accounts.find((account) => account.id === accountId)
  const maxMonthlyGrowth = Math.max(1, ...(overview?.growth?.monthlyGrowthValues.map((item) => item.value) ?? [1]))
  const claimedNames = overview?.xdr.claimedProductIds.map((id) => resolveXdrPrizeName(id, prizeMap)) ?? []
  const pendingRewards = overview?.sign.days.filter((day) => day.prize && day.prize.prizeId !== '9999' && day.prize.prizeStatus === 0) ?? []
  const completedSignDays = overview?.sign.days.filter((day) => day.signStatus === 1).length ?? 0
  const signAction = getTodaySignAction(overview?.sign.days ?? [], overview?.errors.sign)
  const selectedSignDay = detailView?.kind === 'sign'
    ? overview?.sign.days.find((day) => day.dayNum === detailView.dayNum)
    : undefined
  const selectedSignUnfinishedTasks = selectedSignDay?.tasks.filter((task) => task.taskStatus === 0) ?? []
  const selectedSignRewardPending = Boolean(
    selectedSignDay?.prize &&
    selectedSignDay.prize.prizeId !== '9999' &&
    selectedSignDay.prize.prizeStatus === 0,
  )
  const closeDetail = useCallback(() => setDetailView(undefined), [])
  const growthProgress = useMemo(() => {
    const total = overview?.growth?.annualGrowthValue
    const required = overview?.growth?.nextLevelGrowthValue
    if (total === undefined || required === undefined || required <= 0) return 0
    return Math.max(0, Math.min(100, total / required * 100))
  }, [overview?.growth?.annualGrowthValue, overview?.growth?.nextLevelGrowthValue])

  async function performAction() {
    if (!pendingAction || !accountId || busy) return
    const action = pendingAction
    setBusy(true)
    setError('')
    setNotice('')
    try {
      if (action.kind === 'sign') {
        await signGlobalTelecom({ accountId, publicLinkId: publicLinkId || undefined, sspid })
        setNotice('签到请求已完成')
      } else if (action.kind === 'resign') {
        await resignGlobalTelecom({ accountId, publicLinkId: publicLinkId || undefined, sspid, dayNum: action.dayNum, taskIds: action.taskIds })
        setNotice(`第 ${action.dayNum} 天 ${action.taskIds.length} 项补签任务已依次提交`)
      } else if (action.kind === 'reward') {
        await acceptGlobalTelecomReward({ accountId, publicLinkId: publicLinkId || undefined, sspid, dayNum: action.dayNum, prizeId: action.prizeId, isVirtual: action.isVirtual })
        setNotice(`${action.prizeName}已提交补领`)
      } else {
        const result = await runGlobalTelecomBlindBoxAction({
          accountId,
          publicLinkId: publicLinkId || undefined,
          sspid,
          action: action.kind === 'blind-draw' ? 'draw' : action.kind === 'blind-receive' ? 'receive' : action.kind === 'blind-all' ? 'complete-all' : 'complete-task',
          prizeCode: action.kind === 'blind-receive' ? action.prizeCode : undefined,
          taskNumber: action.kind === 'blind-task' ? action.taskNumber : undefined,
        })
        if (action.kind === 'blind-draw') {
          const payload = result.result && typeof result.result === 'object' ? result.result as Record<string, unknown> : {}
          const data = payload.data && typeof payload.data === 'object' ? payload.data as Record<string, unknown> : {}
          const code = result.blindBoxPrize?.prizeCode || String(data.prizeCode || '')
          if (!/^\d{1,10}$/.test(code)) throw new Error('抽奖结果未确认，请刷新查询，勿重复抽奖')
          const prizeName = result.blindBoxPrize?.prizeName || prizeMap[code] || `奖品 #${code}`
          saveBlindPrize(code !== '9999' ? { prizeCode: code, prizeName } : undefined)
          setNotice(code === '9999' ? '本次未抽中奖品' : `已抽中${prizeName}，请确认领取`)
        } else if (action.kind === 'blind-receive') {
          const fulfillmentUrl = result.blindBoxPrize?.fulfillmentUrl
          saveBlindPrize(fulfillmentUrl ? { prizeCode: action.prizeCode, prizeName: drawnPrize?.prizeName, received: true, fulfillmentUrl } : undefined)
          setNotice(fulfillmentUrl ? '奖品已领取，请前往官方页面填写领奖信息' : '盲盒奖品领取成功，按官方规则发放')
        } else {
          const payload = result.result as { data?: { completed?: number[]; failures?: string[] } }
          const failures = payload?.data?.failures || []
          if (failures.length) setError(`部分任务未完成：${failures.join('；')}`)
          else setNotice(action.kind === 'blind-all' ? `已核验完成 ${payload?.data?.completed?.length || 0} 项盲盒任务` : '盲盒任务已核验完成')
        }
      }
      setPendingAction(undefined)
      clearBrowserOverviewCache(accountId, sspid)
      await refresh(true)
    } catch (reason) {
      if (action.kind.startsWith('blind-')) {
        setPendingAction(undefined)
        clearBrowserOverviewCache(accountId, sspid)
        await refresh(true)
      }
      setError(errorMessage(reason))
    } finally {
      setBusy(false)
    }
  }

  async function openCustomerService() {
    if (!accountId || openingCustomerService) return
    const popup = window.open('about:blank', '_blank')
    if (!popup) {
      setError('浏览器阻止了新窗口，请允许本站打开弹窗后重试')
      return
    }
    popup.opener = null
    setOpeningCustomerService(true)
    setError('')
    try {
      const result = await loadGlobalTelecomCustomerServiceLink({
        accountId,
        publicLinkId: publicLinkId || undefined,
        province: overview?.identity.province,
      })
      popup.location.replace(result.ssoUrl)
    } catch (reason) {
      popup.close()
      setError(errorMessage(reason))
    } finally {
      setOpeningCustomerService(false)
    }
  }

  const backHref = getGlobalTelecomBackHref(
    publicMode,
    typeof window === 'undefined' ? '' : window.location.pathname,
    publicLinkId,
  )

  return (
    <div className={cn('min-h-full text-zinc-900', publicMode && 'brand-page min-h-screen px-3 py-3 sm:px-5 sm:py-4')}>
      <div className="mx-auto w-full max-w-[1480px] space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link to={backHref} aria-label="返回" className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"><ArrowLeft className="h-4 w-4" /></Link>
          <div className="min-w-[180px] flex-1">
            <h1 className="brand-heading text-xl font-semibold text-zinc-950">{publicMode ? <BrandLogo className="h-7 w-7" /> : null}全球通查询专区</h1>
            <p className="mt-1 text-xs text-zinc-500">{overview ? `${overview.identity.phoneMasked || (selectedAccount ? formatGlobalTelecomAccountOption(selectedAccount) : '当前账号')} · ${formatTime(overview.refreshedAt)} 更新 · ${overview.cache.status === 'live' ? '实时数据' : overview.cache.status === 'persistent-cache' ? '上次成功数据' : overview.cache.status === 'stale-cache' ? '最近成功数据' : '缓存保护'}` : '账号信息与当月权益'}</p>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <select
              aria-label="查询账号"
              value={accountId}
              disabled={busy || loadingAccounts || accounts.length === 0}
              onChange={(event) => setAccountId(event.target.value)}
              className="h-9 min-w-0 flex-1 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-600 sm:w-56">
              {!accountId ? <option value="">{accounts.length ? '请选择查询账号' : '暂无可查询账号'}</option> : null}
              {accounts.map((account) => <option key={account.id} value={account.id}>{formatGlobalTelecomAccountOption(account)}</option>)}
            </select>
            <label className="hidden items-center gap-2 rounded-md border border-zinc-300 bg-white px-2 sm:flex">
              <span className="text-[11px] text-zinc-500">渠道</span>
              <input aria-label="SSPID" disabled={busy} value={sspid} onChange={(event) => setSspid(event.target.value.replace(/\D/g, '').slice(0, 12))} className="h-8 w-16 text-sm outline-none" />
            </label>
            <button type="button" title="刷新全部" aria-label="刷新全部" disabled={!accountId || loading} onClick={() => void refresh()} className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-zinc-950 text-white hover:bg-zinc-800 disabled:opacity-50">
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </button>
          </div>
        </div>

        {error ? <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /><span className="min-w-0 flex-1 break-words">{error}</span><button type="button" onClick={() => setError('')} aria-label="关闭错误" className="text-rose-500">×</button></div> : null}
        {notice ? <div className="fixed bottom-5 left-1/2 z-[80] flex max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-2 rounded-md bg-zinc-950 px-4 py-3 text-sm text-white shadow-xl"><Check className="h-4 w-4 shrink-0 text-emerald-400" /><span className="break-words">{notice}</span></div> : null}

        {loading && !overview ? (
          <div className="grid min-h-[420px] place-items-center border-y border-zinc-200 bg-white"><div className="text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-700" /><p className="mt-3 text-sm text-zinc-500">正在同步全球通信息</p></div></div>
        ) : !accountId && !loadingAccounts ? (
          <div className="grid min-h-[320px] place-items-center border-y border-zinc-200 bg-white px-4 text-center text-sm text-zinc-500">{accounts.length ? '请选择要查询的账号' : '当前没有可查询的账号'}</div>
        ) : overview ? (
          <>
            <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
              <div className="grid lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,2.1fr)]">
                <div className="border-b border-[#c9d8e8] bg-[#e8f1fb] px-4 py-4 text-[#17324d] lg:border-b-0 lg:border-r">
                  <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#cddff2] text-[#315f91]"><BadgeCheck className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-[#607d9d]">当前全球通等级</p>
                      <strong className="mt-0.5 block break-words text-lg">{overview.identity.levelName || '待查询'}</strong>
                      <p className="mt-1 truncate text-xs text-[#607d9d]">{overview.identity.province || '--'} · {overview.identity.phoneMasked || selectedAccount?.phoneMasked || '--'}</p>
                    </div>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-[#c9d8e8] pt-3 text-xs">
                    <div><dt className="text-[#607d9d]">网龄</dt><dd className="mt-0.5 font-semibold">{overview.identity.netAge || '--'}</dd></div>
                    <div><dt className="text-[#607d9d]">入网日期</dt><dd className="mt-0.5 font-semibold">{formatJoinDate(overview.identity.joinedAt)}</dd></div>
                  </dl>
                </div>
                <div className="grid grid-cols-2 divide-x divide-y divide-zinc-200 sm:grid-cols-4 sm:divide-y-0">
                  {[
                    { label: '星动日可领', value: overview.xdr.availableCount, note: '当月剩余', icon: Gift, tone: 'text-rose-600' },
                    { label: '已领权益', value: overview.xdr.claimedProductIds.length, note: '当月累计', icon: PackageCheck, tone: 'text-blue-600' },
                    { label: '签到进度', value: `${completedSignDays}/${overview.sign.days.length || 7}`, note: `可补签 ${overview.sign.reSignRemaining} 次`, icon: CalendarCheck2, tone: 'text-emerald-600' },
                    { label: '盲盒机会', value: overview.blindBox.drawRemaining, note: `共 ${overview.blindBox.drawTotal} 次`, icon: Sparkles, tone: 'text-amber-600' },
                  ].map((item) => { const Icon = item.icon; return <div key={item.label} className="min-w-0 px-3 py-3.5 sm:px-4"><div className="flex items-center gap-2 text-xs text-zinc-500"><Icon className={cn('h-4 w-4 shrink-0', item.tone)} /><span className="truncate">{item.label}</span></div><strong className="mt-1.5 block text-xl text-zinc-950">{item.value}</strong><span className="mt-0.5 block truncate text-[11px] text-zinc-400">{item.note}</span></div> })}
                </div>
              </div>
              <div className="flex min-h-10 items-center gap-3 border-t border-zinc-200 bg-zinc-50/70 px-4 py-2">
                <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-zinc-600"><WalletCards className="h-3.5 w-3.5" />当月已领</span>
                <span className="min-w-0 flex-1 truncate text-xs text-zinc-700">{claimedNames.length > 0 ? claimedNames.slice(0, 2).join('、') : '暂无已领取奖品'}</span>
                {claimedNames.length > 0 ? <DetailButton label={`查看 ${claimedNames.length} 项`} onClick={() => setDetailView({ kind: 'claimed' })} /> : null}
              </div>
            </section>

            <div className="grid gap-3">
              <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
                <SectionHeader
                  icon={BarChart3}
                  title="成长与等级"
                  tone="gold"
                  meta={overview.growth?.nextLevel ? `${overview.growth.currentLevel || overview.identity.levelName || '--'} → ${overview.growth.nextLevel}` : '年度成长进度'}
                  action={overview.growth ? <DetailButton label="月度明细" onClick={() => setDetailView({ kind: 'growth' })} /> : undefined}
                />
                {overview.growth ? (
                  <div className="grid sm:grid-cols-[repeat(3,minmax(0,1fr))_minmax(220px,1.25fr)] sm:divide-x sm:divide-zinc-200">
                    <div className="px-4 py-3"><span className="text-xs text-zinc-500">本年成长值</span><strong className="mt-1 block text-lg text-zinc-950">{money(overview.growth.annualGrowthValue)}</strong></div>
                    <div className="border-t border-zinc-100 px-4 py-3 sm:border-t-0"><span className="text-xs text-zinc-500">下一等级门槛</span><strong className="mt-1 block text-lg text-zinc-950">{money(overview.growth.nextLevelGrowthValue)}</strong></div>
                    <div className="border-t border-zinc-100 px-4 py-3 sm:border-t-0"><span className="text-xs text-zinc-500">{(overview.growth.remainingGrowthValue ?? 0) <= 0 ? '已超过门槛' : '距下级还差'}</span><strong className="mt-1 block text-lg text-amber-700">{money(Math.abs(overview.growth.remainingGrowthValue ?? 0))}</strong></div>
                    <div className="border-t border-zinc-100 px-4 py-3 sm:border-t-0"><div className="flex justify-between text-xs text-zinc-500"><span>成长进度</span><span>{Math.round(growthProgress)}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#f0e5d2]"><div className="h-full rounded-full bg-[#b9863b]" style={{ width: `${growthProgress}%` }} /></div><p className="mt-2 truncate text-[11px] text-zinc-400">{overview.growth.monthlyGrowthValues.length} 个月有记录</p></div>
                  </div>
                ) : <div className="grid min-h-24 place-items-center px-4 text-sm text-zinc-500">成长值数据暂不可用</div>}
              </section>
            </div>

            <section className="overflow-hidden rounded-md border border-[#49352e] bg-[#2a1d19] text-white">
              <div className="px-4 py-4 sm:px-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-[#f5e4c8]"><Sparkles className="h-4 w-4 text-[#d9a85f]" /><h2 className="text-base font-semibold">签到赢惊喜</h2><Sparkles className="h-4 w-4 text-[#d9a85f]" /></div>
                  <p className="mt-1 text-sm text-[#d8c1b7]">补签剩余 <strong className="text-[#f3cf91]">{overview.sign.reSignRemaining}</strong> 次{pendingRewards.length > 0 ? ` · 待补领 ${pendingRewards.length} 项` : ''}</p>
                </div>
                <div className="mx-auto mt-4 grid max-w-4xl grid-cols-4 gap-2 sm:grid-cols-7 sm:gap-3">
                  {overview.sign.days.map((day) => {
                    const signed = day.signStatus === 1
                    const canResign = (day.signStatus === 2 || day.reSign) && day.tasks.some((task) => task.taskStatus === 0)
                    const rewardPending = Boolean(day.prize && day.prize.prizeId !== '9999' && day.prize.prizeStatus === 0)
                    const label = signed ? '已签' : rewardPending ? '待领取' : canResign ? '补签' : `第${day.dayNum}天`
                    const Icon = signed ? Check : rewardPending ? Gift : canResign ? RotateCcw : day.dayNum === 7 ? Gift : CalendarCheck2
                    return (
                      <button
                        key={day.dayNum}
                        type="button"
                        aria-label={`第 ${day.dayNum} 天，${signState(day).label}，查看详情`}
                        onClick={() => setDetailView({ kind: 'sign', dayNum: day.dayNum })}
                        className={cn(
                          'flex min-h-20 min-w-0 flex-col items-center justify-center rounded-md border px-1.5 py-2 text-center transition-colors',
                          signed && 'border-[#e7c58f] bg-[#38271f] text-[#f5dec0] hover:bg-[#413028]',
                          !signed && canResign && 'border-[#b98a55] bg-[#4a352d] text-[#f3cf91] hover:bg-[#553d33]',
                          !signed && !canResign && 'border-transparent bg-[#49352e] text-[#b8a298] hover:bg-[#523b32]',
                        )}>
                        <Icon className="h-6 w-6 shrink-0" />
                        <span className="mt-1.5 truncate text-xs font-medium">{label}</span>
                      </button>
                    )
                  })}
                </div>
                <p className="mt-4 text-center text-sm font-medium text-[#e6ad5f]">连续签到满 1 天、4 天、7 天，赢惊喜好礼</p>
                <button
                  type="button"
                  disabled={busy || !signAction.canSign}
                  onClick={() => setPendingAction({ kind: 'sign' })}
                  className="mx-auto mt-3 flex h-10 w-full max-w-xl items-center justify-center gap-2 rounded-md border border-[#c3a98a] bg-transparent text-sm font-semibold text-[#f5dec0] hover:bg-[#38271f] disabled:cursor-not-allowed disabled:border-[#69534a] disabled:text-[#9e887d]">
                  <CalendarCheck2 className="h-4 w-4" />{signAction.label}
                </button>
                <p className="mt-2 text-center text-[11px] text-[#a99186]">已签到 {completedSignDays}/{overview.sign.days.length || 7} 天</p>
              </div>
            </section>

            <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
              <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
                <SectionHeader
                  icon={Sparkles}
                  title="全球通星动盲盒"
                  tone="activity"
                  meta={`${overview.blindBox.tasks.filter((task) => task.completed).length}/${overview.blindBox.tasks.length} 项任务完成`}
                  action={<div className="ml-auto flex items-center gap-1"><DetailButton tone="onDark" label="奖池详情" onClick={() => setDetailView({ kind: 'blind-box' })} /><button type="button" disabled={Boolean(drawnPrize && !drawnPrize.received) || overview.blindBox.drawAllowed !== true || Boolean(overview.errors.blindBox) || busy} title={overview.blindBox.unavailableReason} onClick={() => setPendingAction({ kind: 'blind-draw' })} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#f3cf91] px-3 text-xs font-semibold text-[#38251d] hover:bg-[#f7dcae] disabled:opacity-40"><Sparkles className="h-3.5 w-3.5" />开盲盒</button></div>}
                />
                {drawnPrize ? <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 px-4 py-3"><Gift className="h-4 w-4 shrink-0 text-amber-700" /><span className="min-w-0 flex-1 break-words text-xs text-zinc-700">{drawnPrize.prizeName || prizeMap[drawnPrize.prizeCode] || `奖品 #${drawnPrize.prizeCode}`} · {drawnPrize.received ? '已领取，待填写信息' : '待领取'}</span>{drawnPrize.received && drawnPrize.fulfillmentUrl ? <a href={drawnPrize.fulfillmentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center rounded-md border border-zinc-200 px-3 text-xs font-medium">填写领奖信息</a> : <button type="button" disabled={busy} onClick={() => setPendingAction({ kind: 'blind-receive', prizeCode: drawnPrize.prizeCode })} className="min-h-9 rounded-md bg-amber-50 px-3 text-xs font-semibold text-amber-800 disabled:opacity-40">领取奖品</button>}</div> : null}
                <div className="grid md:grid-cols-[220px_minmax(0,1fr)]">
                  <dl className="grid grid-cols-3 border-b border-zinc-200 md:grid-cols-1 md:border-b-0 md:border-r">
                    <div className="px-4 py-3"><dt className="text-[11px] text-zinc-500">剩余机会</dt><dd className="mt-0.5 text-lg font-semibold text-zinc-950">{overview.blindBox.drawRemaining}</dd></div>
                    <div className="border-l border-zinc-100 px-4 py-3 md:border-l-0 md:border-t"><dt className="text-[11px] text-zinc-500">已使用</dt><dd className="mt-0.5 text-lg font-semibold text-zinc-950">{overview.blindBox.drawUsed}</dd></div>
                    <div className="border-l border-zinc-100 px-4 py-3 md:border-l-0 md:border-t"><dt className="text-[11px] text-zinc-500">奖池数量</dt><dd className="mt-0.5 text-lg font-semibold text-zinc-950">{overview.blindBox.prizes.length}</dd></div>
                  </dl>
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between gap-2"><h3 className="text-xs font-medium text-zinc-500">任务进度</h3><button type="button" disabled={busy || Boolean(overview.errors.blindBox) || !overview.blindBox.tasks.some((task) => !task.completed && task.available === true)} onClick={() => setPendingAction({ kind: 'blind-all' })} className="min-h-9 rounded-md border border-zinc-200 px-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40">一键完成任务</button></div>
                    <div className="mt-1.5 divide-y divide-zinc-100">{overview.blindBox.tasks.length > 0 ? overview.blindBox.tasks.map((task) => <div key={task.number} className="flex min-h-11 items-center gap-2 py-1">
                      <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-semibold', task.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-600')}>{task.completed ? <Check className="h-3 w-3" /> : task.number}</span>
                      <span className="min-w-0 flex-1 break-words text-xs text-zinc-700">{task.name || `活动任务 ${task.number}`}</span>
                      {task.completed ? <span className="shrink-0 text-[11px] text-emerald-700">已完成</span> : task.available !== true ? <span className="max-w-24 shrink-0 text-right text-[11px] text-zinc-500">{task.unavailableReason || '待更新'}</span> : <button type="button" disabled={busy || Boolean(overview.errors.blindBox)} onClick={() => setPendingAction({ kind: 'blind-task', taskNumber: task.number })} className="min-h-9 shrink-0 rounded-md border border-zinc-200 px-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40">完成任务</button>}
                    </div>) : <p className="py-5 text-center text-xs text-zinc-500">{overview.blindBox.unavailableReason || '暂无盲盒任务'}</p>}</div>
                    {overview.blindBox.unavailableReason ? <p className="mt-2 text-[11px] text-zinc-500">{overview.blindBox.unavailableReason}</p> : null}
                    <a href={`https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/xdrNormal.html?sspId=${encodeURIComponent(sspid)}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-9 items-center text-xs text-blue-700 hover:underline">官方活动与规则</a>
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
                <SectionHeader icon={UserRoundCheck} title="专属服务" meta={overview.manager?.available ? '已匹配客户经理' : '当前未匹配'} action={overview.manager?.available ? <DetailButton onClick={() => setDetailView({ kind: 'manager' })} /> : undefined} />
                {overview.manager?.available ? <div className="p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-blue-50 text-blue-700"><UserRoundCheck className="h-5 w-5" /></span><div className="min-w-0"><strong className="block truncate text-sm text-zinc-950">{overview.manager.name || overview.manager.nickname || '专属客户经理'}</strong><span className="mt-0.5 block truncate text-xs text-zinc-500">{overview.manager.staffLevel || '专属客户经理'} · {overview.manager.cityName || '--'}</span></div></div><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"><button type="button" disabled={openingCustomerService} onClick={() => void openCustomerService()} className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500"><MessageCircle className="h-3.5 w-3.5" />{openingCustomerService ? '正在连接' : '全球通专属客服'}</button>{overview.manager.serviceNumber && overview.manager.serviceNumber !== '0' ? <a href={`tel:${overview.manager.serviceNumber}`} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-700 hover:bg-blue-100"><PhoneCall className="h-3.5 w-3.5" />联系客户经理</a> : null}</div></div> : <div className="grid min-h-32 place-items-center px-4 text-center"><div><UserRoundCheck className="mx-auto h-5 w-5 text-zinc-300" /><p className="mt-2 text-sm text-zinc-500">暂无专属客户经理信息</p></div></div>}
              </section>
            </div>
          </>
        ) : null}
      </div>

      <V2ConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction ? ACTION_COPY[pendingAction.kind].title : ''}
        description={pendingAction ? ACTION_COPY[pendingAction.kind].description : ''}
        confirmLabel={pendingAction ? ACTION_COPY[pendingAction.kind].label : '确认'}
        loading={busy}
        onClose={() => setPendingAction(undefined)}
        onConfirm={() => void performAction()}
      />

      {detailView && overview ? (
        <DetailDialog
          title={detailView.kind === 'claimed' ? '当月已领权益' : detailView.kind === 'growth' ? '成长值明细' : detailView.kind === 'sign' ? `第 ${detailView.dayNum} 天详情` : detailView.kind === 'blind-box' ? '盲盒任务与奖池' : '客户经理详情'}
          meta={detailView.kind === 'growth' ? `${overview.growth?.year || '当年'} · ${overview.growth?.currentLevel || overview.identity.levelName || '--'}` : overview.identity.phoneMasked || selectedAccount?.phoneMasked}
          onClose={closeDetail}>
          {detailView.kind === 'claimed' ? (
            <div className="space-y-4">
              <dl className="grid grid-cols-3 divide-x divide-zinc-200 border-y border-zinc-200">
                <div className="px-3 py-3"><dt className="text-[11px] text-zinc-500">可领取</dt><dd className="mt-1 text-lg font-semibold text-zinc-950">{overview.xdr.availableCount}</dd></div>
                <div className="px-3 py-3"><dt className="text-[11px] text-zinc-500">免费次数</dt><dd className="mt-1 text-lg font-semibold text-zinc-950">{overview.xdr.freeCount}</dd></div>
                <div className="px-3 py-3"><dt className="text-[11px] text-zinc-500">付费次数</dt><dd className="mt-1 text-lg font-semibold text-zinc-950">{overview.xdr.paidCount}</dd></div>
              </dl>
              <div className="divide-y divide-zinc-100 border-y border-zinc-200">{claimedNames.map((name, index) => <div key={`${name}-${index}`} className="flex min-h-11 items-center gap-3 py-2.5"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Check className="h-3.5 w-3.5" /></span><strong className="min-w-0 flex-1 break-words text-sm font-medium text-zinc-900">{name}</strong><span className="shrink-0 text-xs text-zinc-400">#{overview.xdr.claimedProductIds[index]}</span></div>)}</div>
            </div>
          ) : null}

          {detailView.kind === 'growth' ? overview.growth ? (
            <div className="space-y-5">
              <section><h3 className="text-xs font-semibold text-zinc-800">月成长值</h3><div className="mt-2 divide-y divide-zinc-100 border-y border-zinc-200">{overview.growth.monthlyGrowthValues.length > 0 ? overview.growth.monthlyGrowthValues.map((item) => <div key={item.month} className="grid min-h-10 grid-cols-[42px_minmax(0,1fr)_72px] items-center gap-3 py-2"><span className="text-xs text-zinc-500">{monthLabel(item.month)}</span><div className="h-1.5 overflow-hidden rounded-full bg-zinc-100"><div className="h-full min-w-[2px] rounded-full bg-blue-500" style={{ width: `${Math.max(1, item.value / maxMonthlyGrowth * 100)}%` }} /></div><strong className="text-right text-xs text-zinc-900">{money(item.value)}</strong></div>) : <p className="py-8 text-center text-sm text-zinc-500">当年暂无月成长值明细</p>}</div></section>
              <section><h3 className="text-xs font-semibold text-zinc-800">等级门槛</h3><div className="mt-2 divide-y divide-zinc-100 border-y border-zinc-200">{overview.growth.levels.map((level) => <div key={level.name} className="flex min-h-10 items-center justify-between gap-3 py-2 text-sm"><span className="text-zinc-600">{level.name}</span><strong className="text-zinc-950">{level.label}</strong></div>)}</div></section>
            </div>
          ) : <p className="py-8 text-center text-sm text-zinc-500">成长值数据暂不可用</p> : null}

          {detailView.kind === 'sign' ? selectedSignDay ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 border-y border-zinc-200 py-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-blue-50 text-blue-700"><Gift className="h-4 w-4" /></span><div className="min-w-0"><p className="text-xs text-zinc-500">签到奖品</p><strong className="mt-1 block break-words text-sm text-zinc-950">{selectedSignDay.prize?.prizeName || '暂无奖品信息'}</strong>{selectedSignDay.prize ? <span className="mt-1 block text-xs text-zinc-400">权益 #{selectedSignDay.prize.prizeId}</span> : null}</div></div>
              <section><div className="flex items-center gap-2"><ListChecks className="h-4 w-4 text-amber-700" /><h3 className="text-xs font-semibold text-zinc-800">补签任务</h3></div><div className="mt-2 divide-y divide-zinc-100 border-y border-zinc-200">{selectedSignDay.tasks.length > 0 ? selectedSignDay.tasks.map((task, index) => <div key={task.taskId} className="flex min-h-11 items-center gap-3 py-2"><span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold', task.taskStatus === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-50 text-amber-800')}>{task.taskStatus === 1 ? <Check className="h-3.5 w-3.5" /> : index + 1}</span><span className="min-w-0 flex-1 break-words text-sm text-zinc-800">{SIGN_TASK_NAMES[task.taskId] || `活动任务 ${task.taskId}`}</span><span className={cn('shrink-0 text-xs', task.taskStatus === 1 ? 'text-emerald-700' : 'text-amber-700')}>{task.taskStatus === 1 ? '已完成' : '待完成'}</span></div>) : <p className="py-8 text-center text-sm text-zinc-500">该日没有补签任务</p>}</div></section>
              {selectedSignRewardPending && selectedSignDay.prize ? (
                <button type="button" onClick={() => { closeDetail(); setPendingAction({ kind: 'reward', dayNum: selectedSignDay.dayNum, prizeId: selectedSignDay.prize!.prizeId, isVirtual: Boolean(selectedSignDay.prize!.isVirtual), prizeName: selectedSignDay.prize!.prizeName }) }} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-3 text-sm font-semibold text-white hover:bg-blue-700"><Gift className="h-4 w-4" />补领奖品</button>
              ) : selectedSignUnfinishedTasks.length > 0 && overview.sign.reSignRemaining > 0 ? (
                <button type="button" onClick={() => { closeDetail(); setPendingAction({ kind: 'resign', dayNum: selectedSignDay.dayNum, taskIds: selectedSignUnfinishedTasks.map((task) => task.taskId) }) }} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[#9a6a32] px-3 text-sm font-semibold text-white hover:bg-[#825728]"><RotateCcw className="h-4 w-4" />完成剩余 {selectedSignUnfinishedTasks.length} 项</button>
              ) : null}
            </div>
          ) : <p className="py-8 text-center text-sm text-zinc-500">未找到该日详情</p> : null}

          {detailView.kind === 'blind-box' ? (
            <div className="space-y-5">
              <section><h3 className="text-xs font-semibold text-zinc-800">任务状态</h3><div className="mt-2 divide-y divide-zinc-100 border-y border-zinc-200">{overview.blindBox.tasks.map((task) => <div key={task.number} className="flex min-h-11 items-center gap-3 py-2"><span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-semibold', task.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-600')}>{task.completed ? <Check className="h-3.5 w-3.5" /> : task.number}</span><span className="min-w-0 flex-1 text-sm text-zinc-800">{task.name || `活动任务 ${task.number}`}</span><span className={cn('max-w-24 text-right text-xs', task.completed ? 'text-emerald-700' : 'text-zinc-500')}>{task.completed ? '已完成' : task.available ? '未完成' : task.unavailableReason || '待更新'}</span></div>)}</div></section>
              <section><div className="flex items-center justify-between gap-3"><h3 className="text-xs font-semibold text-zinc-800">本期奖池</h3><span className="text-[11px] text-zinc-400">{overview.blindBox.prizes.length} 项</span></div><div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">{overview.blindBox.prizes.map((prize) => <div key={prize.prizeCode} className="overflow-hidden rounded-md border border-zinc-200 bg-zinc-50"><div className="aspect-square">{prize.imageUrl ? <img src={prize.imageUrl} alt={`奖品 ${prize.prizeCode}`} className="h-full w-full object-contain p-1" /> : <span className="grid h-full place-items-center text-[10px] text-zinc-400">暂无图片</span>}</div><div className="truncate border-t border-zinc-200 px-1.5 py-1 text-center text-[10px] text-zinc-500">#{prize.prizeCode}</div></div>)}</div></section>
            </div>
          ) : null}

          {detailView.kind === 'manager' ? overview.manager ? (
            <div className="space-y-4"><div className="flex items-center gap-3 border-y border-zinc-200 py-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-blue-50 text-blue-700"><UserRoundCheck className="h-5 w-5" /></span><div className="min-w-0"><strong className="block truncate text-sm text-zinc-950">{overview.manager.name || overview.manager.nickname || '未返回姓名'}</strong><span className="mt-1 block text-xs text-zinc-500">{overview.manager.staffLevel || '专属客户经理'} · {overview.manager.cityName || '--'}</span></div></div><dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">{[
              ['服务团队', overview.manager.teamName || '--'],
              ['服务小组', overview.manager.groupName || '--'],
              ['客户经理工号', overview.manager.staffId || '--'],
              ['服务号码', overview.manager.serviceNumber && overview.manager.serviceNumber !== '0' ? overview.manager.serviceNumber : '未提供'],
            ].map(([label, value]) => <div key={label} className="border-b border-zinc-100 pb-3"><dt className="text-xs text-zinc-500">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-zinc-900">{value}</dd></div>)}</dl></div>
          ) : <p className="py-8 text-center text-sm text-zinc-500">暂无客户经理信息</p> : null}
        </DetailDialog>
      ) : null}
    </div>
  )
}

export default function V2GlobalTelecomPage(props: Props) {
  return <GlobalTelecomPageErrorBoundary><GlobalTelecomPageContent {...props} /></GlobalTelecomPageErrorBoundary>
}

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Link2,
  ListChecks,
  Plus,
  RefreshCw,
  Search,
  SearchCheck,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserRound,
  WifiOff,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { V2Account } from '../lib/types'

export type V2AccountTaskType = 'ck_maintenance' | 'refresh_and_sign' | 'query_info'

export type V2AccountsPageProps = {
  accounts: V2Account[]
  loading: boolean
  error?: string | null
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  onRefresh: () => void | Promise<void>
  onOpenAccount: (account: V2Account) => void
  onAddAccount: () => void
  onStartTask: (type: V2AccountTaskType, accountIds: string[]) => void | Promise<void>
  onDeleteSelected: (accountIds: string[]) => void
  deleting?: boolean
}

type HealthFilter = 'all' | 'healthy' | 'attention' | 'offline' | 'disabled'
type HealthState = Exclude<HealthFilter, 'all'> | 'disabled'

type AccountView = {
  account: V2Account
  id: string
  label: string
  phone: string
  health: HealthState
  healthLabel: string
  healthReason: string
  cookieLabel: string
  loginMethod: string
  expiryLabel: string
  linkCount: number
  ownerLabel: string
  activityLabels: string[]
  updatedLabel: string
  searchText: string
}

const FILTERS: Array<{ value: HealthFilter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'healthy', label: '健康' },
  { value: 'attention', label: '需处理' },
  { value: 'offline', label: '未登录' },
  { value: 'disabled', label: '已停用' },
]

const TASKS: Array<{
  type: V2AccountTaskType
  label: string
  icon: LucideIcon
}> = [
  { type: 'ck_maintenance', label: 'CK 维护', icon: ShieldCheck },
  { type: 'refresh_and_sign', label: '签到 + 拼图', icon: ListChecks },
  { type: 'query_info', label: '查询信息', icon: SearchCheck },
]

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined
}

function accountRecord(account: V2Account): Record<string, unknown> {
  return account as unknown as Record<string, unknown>
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function firstString(record: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = stringValue(record[key])
    if (value) return value
  }
  return ''
}

function firstBoolean(record: Record<string, unknown>, keys: string[]): boolean | undefined {
  for (const key of keys) {
    if (typeof record[key] === 'boolean') return record[key]
  }
  return undefined
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map(stringValue).filter(Boolean)
}

function maskPhone(value: string): string {
  const normalized = value.replace(/\s+/g, '')
  const digits = normalized.replace(/\D+/g, '')
  if (/^1\d{10}$/.test(digits)) {
    return `${digits.slice(0, 3)}****${digits.slice(-4)}`
  }
  return normalized || '未获取号码'
}

function redactSensitiveText(value: string): string {
  return value
    .replace(/1\d{10}/g, (phone) => maskPhone(phone))
    .replace(/\b(cookie|token|authorization)\s*[:=]\s*[^\s,，]+/gi, '$1=[已隐藏]')
    .replace(/\b[A-Za-z0-9_+/=-]{64,}\b/g, '[已隐藏]')
}

function formatDateTime(value: string): string {
  if (!value) return '未记录'
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

function formatExpiry(value: string): { label: string; attention: boolean; expired: boolean } {
  if (!value) return { label: '未记录到期时间', attention: false, expired: false }
  const expiry = new Date(value).getTime()
  if (!Number.isFinite(expiry)) return { label: value, attention: false, expired: false }
  const remaining = expiry - Date.now()
  if (remaining <= 0) return { label: '登录态已到期', attention: true, expired: true }
  const hours = Math.floor(remaining / (60 * 60 * 1000))
  if (hours < 12) return { label: `${Math.max(1, hours)} 小时内到期`, attention: true, expired: false }
  if (hours < 48) return { label: `${hours} 小时后到期`, attention: false, expired: false }
  return { label: `${Math.floor(hours / 24)} 天后到期`, attention: false, expired: false }
}

function mapLoginMethod(value: string): string {
  const normalized = value.toLowerCase()
  if (normalized.includes('qr')) return 'App 扫码'
  if (normalized.includes('yunpan')) return '云盘登录'
  if (normalized.includes('manual') || normalized.includes('cookie')) return '手动 CK'
  if (normalized.includes('sms')) return '短信登录'
  return value || '未记录'
}

function explicitHealth(record: Record<string, unknown>): {
  status: string
  label: string
  tone: string
} {
  const health = asRecord(record.health)
  return {
    status: firstString(health ?? {}, ['status']) || firstString(record, ['healthStatus']),
    label: firstString(health ?? {}, ['label']),
    tone: firstString(health ?? {}, ['tone']),
  }
}

function healthStateFromExplicit(status: string, tone: string): HealthState | undefined {
  const value = `${status} ${tone}`.toLowerCase()
  if (!value.trim()) return undefined
  if (/disabled|stopped|ban|停用|禁用/.test(value)) return 'disabled'
  if (/invalid|expired|error|danger|red|未登录|失效|离线/.test(value)) return 'offline'
  if (/expiring|maintenance|unknown|attention|warning|warn|amber|yellow|risk|待处理|注意|风险/.test(value)) {
    return 'attention'
  }
  if (/healthy|success|good|ok|green|健康|正常/.test(value)) return 'healthy'
  if (/offline/.test(value)) return 'offline'
  return undefined
}

function accountId(account: V2Account): string {
  return firstString(accountRecord(account), ['id', 'accountId'])
}

function buildAccountView(account: V2Account): AccountView {
  const record = accountRecord(account)
  const rawRecord = asRecord(record.raw) ?? {}
  const id = accountId(account)
  const label = redactSensitiveText(firstString(record, ['label', 'name', 'displayName'])) || '未命名账号'
  const rawPhone = firstString(record, ['displayPhone', 'phoneMasked', 'phone'])
  const phone = maskPhone(rawPhone)
  const hasCookie = firstBoolean(record, ['hasCookie']) === true
  const hasYunpanSession = firstBoolean(record, ['hasYunpanSession']) === true
  const hasCmccAppCookie = firstBoolean(record, ['hasCmccAppCookie']) === true
  const hasWedRechargeCookie = firstBoolean(record, ['hasWedRechargeCookie']) === true
  const invalidAt = firstString(rawRecord, ['cookieInvalidAt'])
  const disabledAt = firstString(rawRecord, ['disabledAt'])
  const expiry = formatExpiry(firstString(record, ['cookieExpireAt', 'smsLoginExpireAt']))
  const declaredHealth = explicitHealth(record)
  const declaredState = healthStateFromExplicit(declaredHealth.status, declaredHealth.tone)

  let health: HealthState
  if (disabledAt || declaredState === 'disabled') health = 'disabled'
  else if (invalidAt || expiry.expired) health = 'offline'
  else if (declaredState) health = declaredState
  else if (expiry.attention) health = 'attention'
  else if (hasCookie) health = 'healthy'
  else health = 'offline'

  const healthLabel =
    declaredHealth.label ||
    (health === 'healthy'
      ? '健康'
      : health === 'attention'
        ? '需处理'
        : health === 'disabled'
          ? '已停用'
          : '未登录')

  const healthReason =
    health === 'disabled'
      ? '账号已停用'
      : declaredHealth.status === 'invalid' || invalidAt
        ? 'CK 已失效'
        : declaredHealth.status === 'expired' || expiry.expired
          ? '登录态已到期'
          : declaredHealth.status === 'expiring' || expiry.attention
            ? expiry.label
            : declaredHealth.status === 'maintenance'
              ? '扩展登录态需要维护'
              : declaredHealth.status === 'unknown'
                ? '等待状态检测'
            : !hasCookie && hasYunpanSession
              ? '云盘会话可置换全球通 Token'
              : health === 'offline'
                ? '缺少可用 CK'
                : '登录态可用'

  const cookieLabel = hasCookie
    ? hasCmccAppCookie
      ? '10086 / CMCC 可用'
      : '10086 CK 可用'
    : hasYunpanSession
      ? '云盘已登录 / 无 10086 CK'
      : '无可用 CK'

  const publicLinkIds = stringArray(record.publicLinkIds)
  const singleLinkId = firstString(record, ['publicLinkId'])
  const linkCount = publicLinkIds.length || (singleLinkId ? 1 : 0)
  const ownerLabel =
    firstString(rawRecord, ['ownerDisplayName', 'ownerUsername']) ||
    (firstString(rawRecord, ['userId']) ? '已绑定用户' : '未绑定用户')
  const loginMethod = mapLoginMethod(firstString(rawRecord, ['lastLoginMethod', 'cookieSource']))

  const signText = firstString(rawRecord, ['signStatus', 'qqtSignStatus'])
  const signUpdatedAt = firstString(rawRecord, ['qqtSignUpdatedAt', 'signUpdatedAt'])
  const xdr = asRecord(rawRecord.xdrReceive)
  const xdrProducts = Array.isArray(xdr?.prodList) ? xdr.prodList : []
  const wedRecharge = asRecord(rawRecord.wedRechargeInfo)
  const wedUpdatedAt = firstString(rawRecord, ['wedRechargeUpdatedAt']) || firstString(wedRecharge ?? {}, ['updatedAt'])
  const activityLabels: string[] = []
  if (/已签到|成功|signed/i.test(signText)) activityLabels.push('今日已签到')
  else if (signUpdatedAt) activityLabels.push('签到已同步')
  else activityLabels.push('签到待查询')
  activityLabels.push(xdrProducts.length > 0 ? '权益已领取' : '权益待确认')
  if (hasWedRechargeCookie || wedUpdatedAt) activityLabels.push('拼图已同步')

  const updatedAt = firstString(record, ['updatedAt', 'cookieUpdatedAt'])
  const searchableValues = [
    id,
    label,
    rawPhone,
    phone,
    ownerLabel,
    ...publicLinkIds,
    singleLinkId,
    healthLabel,
  ]

  return {
    account,
    id,
    label,
    phone,
    health,
    healthLabel,
    healthReason,
    cookieLabel,
    loginMethod,
    expiryLabel: expiry.label,
    linkCount,
    ownerLabel,
    activityLabels,
    updatedLabel: formatDateTime(updatedAt),
    searchText: searchableValues.join(' ').toLowerCase(),
  }
}

function healthVisual(health: HealthState): {
  icon: LucideIcon
  badge: string
  dot: string
} {
  if (health === 'healthy') {
    return {
      icon: CheckCircle2,
      badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      dot: 'bg-emerald-500',
    }
  }
  if (health === 'attention') {
    return {
      icon: AlertTriangle,
      badge: 'border-amber-200 bg-amber-50 text-amber-800',
      dot: 'bg-amber-500',
    }
  }
  if (health === 'disabled') {
    return {
      icon: Ban,
      badge: 'border-zinc-200 bg-zinc-100 text-zinc-600',
      dot: 'bg-zinc-400',
    }
  }
  return {
    icon: WifiOff,
    badge: 'border-rose-200 bg-rose-50 text-rose-700',
    dot: 'bg-rose-500',
  }
}

function HealthBadge({ view }: { view: AccountView }) {
  const visual = healthVisual(view.health)
  const Icon = visual.icon
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1 rounded-full border px-2 text-[11px] font-semibold',
        visual.badge,
      )}>
      <Icon className="h-3.5 w-3.5" />
      {view.healthLabel}
    </span>
  )
}

function LoadingRows() {
  return (
    <div className="space-y-2" aria-label="正在加载账号">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="h-16 animate-pulse rounded-md bg-zinc-100" />
      ))}
    </div>
  )
}

export default function V2AccountsPage({
  accounts,
  loading,
  error,
  selectedIds,
  onSelectionChange,
  onRefresh,
  onOpenAccount,
  onAddAccount,
  onStartTask,
  onDeleteSelected,
  deleting = false,
}: V2AccountsPageProps) {
  const [searchParams] = useSearchParams()
  const [keyword, setKeyword] = useState('')
  const [healthFilter, setHealthFilter] = useState<HealthFilter>(() => {
    const requested = searchParams.get('status')
    return requested === 'attention' || requested === 'healthy' || requested === 'offline' || requested === 'disabled'
      ? requested
      : 'all'
  })

  useEffect(() => {
    const requested = searchParams.get('status')
    if (requested === 'attention' || requested === 'healthy' || requested === 'offline' || requested === 'disabled') {
      setHealthFilter(requested)
    }
  }, [searchParams])

  const views = useMemo(() => accounts.map(buildAccountView).filter((view) => view.id), [accounts])
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])
  const normalizedKeyword = keyword.trim().toLowerCase()

  const counts = useMemo(() => {
    const next = { all: views.length, healthy: 0, attention: 0, offline: 0, disabled: 0 }
    for (const view of views) {
      if (view.health === 'healthy') next.healthy += 1
      else if (view.health === 'attention') next.attention += 1
      else if (view.health === 'disabled') next.disabled += 1
      else next.offline += 1
    }
    return next
  }, [views])

  const filteredViews = useMemo(
    () =>
      views.filter((view) => {
        const matchesHealth =
          healthFilter === 'all' ||
          view.health === healthFilter
        const matchesKeyword = !normalizedKeyword || view.searchText.includes(normalizedKeyword)
        return matchesHealth && matchesKeyword
      }),
    [healthFilter, normalizedKeyword, views],
  )

  const visibleIds = useMemo(() => filteredViews.map((view) => view.id), [filteredViews])
  const visibleSelectedCount = visibleIds.filter((id) => selectedSet.has(id)).length
  const hiddenSelectedCount = Math.max(0, selectedIds.length - visibleSelectedCount)
  const allVisibleSelected = visibleIds.length > 0 && visibleSelectedCount === visibleIds.length
  const hasFilters = Boolean(normalizedKeyword || healthFilter !== 'all')

  function toggleAccount(id: string) {
    if (selectedSet.has(id)) onSelectionChange(selectedIds.filter((item) => item !== id))
    else onSelectionChange([...selectedIds, id])
  }

  function toggleVisible() {
    if (allVisibleSelected) {
      const visibleSet = new Set(visibleIds)
      onSelectionChange(selectedIds.filter((id) => !visibleSet.has(id)))
      return
    }
    onSelectionChange(Array.from(new Set([...selectedIds, ...visibleIds])))
  }

  function retainVisibleSelection() {
    onSelectionChange(visibleIds.filter((id) => selectedSet.has(id)))
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-950">账号中心</h1>
          <div className="mt-1 text-xs text-zinc-500">
            共 {counts.all} 个，{counts.attention + counts.offline} 个待处理
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void onRefresh()}
            disabled={loading}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-400">
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            刷新
          </button>
          <button
            type="button"
            onClick={onAddAccount}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800">
            <Plus className="h-4 w-4" />
            添加账号
          </button>
        </div>
      </div>

      <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
        <div className="grid grid-cols-2 gap-px bg-zinc-200 sm:grid-cols-5">
          {FILTERS.map((filter) => {
            const active = healthFilter === filter.value
            const count = counts[filter.value]
            const visual =
              filter.value === 'healthy'
                ? 'bg-emerald-500'
                : filter.value === 'attention'
                  ? 'bg-amber-500'
                  : filter.value === 'offline'
                    ? 'bg-rose-500'
                    : filter.value === 'disabled'
                      ? 'bg-zinc-500'
                    : 'bg-zinc-400'
            return (
              <button
                key={filter.value}
                type="button"
                aria-pressed={active}
                onClick={() => setHealthFilter(filter.value)}
                className={cn(
                  'flex min-h-16 items-center justify-between gap-3 bg-white px-4 text-left transition-colors',
                  filter.value === 'disabled' && 'col-span-2 sm:col-span-1',
                  active ? 'bg-zinc-50' : 'hover:bg-zinc-50/70',
                )}>
                <div>
                  <div className="text-xs font-medium text-zinc-500">{filter.label}</div>
                  <div className="mt-1 text-lg font-semibold text-zinc-950">{count}</div>
                </div>
                <span className={cn('h-2.5 w-2.5 rounded-full', visual)} />
              </button>
            )
          })}
        </div>
      </section>

      <section className="rounded-md border border-zinc-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-zinc-200 p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 sm:max-w-md">
              <Search className="h-4 w-4 shrink-0 text-zinc-400" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜索账号、备注、用户或专属链接"
                className="min-w-0 flex-1 bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
              />
              {keyword ? (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  aria-label="清空搜索"
                  className="grid h-6 w-6 shrink-0 place-items-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700">
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </label>
            <div className="text-xs text-zinc-500">
              当前 {filteredViews.length} 个，已选 {selectedIds.length} 个
            </div>
          </div>

          <div className="flex max-w-full items-center gap-1.5 overflow-x-auto pb-0.5 lg:pb-0">
            {TASKS.map((task) => {
              const Icon = task.icon
              return (
                <button
                  key={task.type}
                  type="button"
                  disabled={selectedIds.length === 0}
                  onClick={() => void onStartTask(task.type, selectedIds)}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-zinc-100 px-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:text-zinc-400">
                  <Icon className="h-3.5 w-3.5" />
                  {task.label}
                </button>
              )
            })}
            <button
              type="button"
              disabled={selectedIds.length === 0 || deleting}
              onClick={() => onDeleteSelected(selectedIds)}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-rose-50 px-2.5 text-xs font-medium text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400">
              <Trash2 className="h-3.5 w-3.5" />
              {deleting ? '删除中' : '批量删除'}
            </button>
          </div>
        </div>

        {hiddenSelectedCount > 0 ? (
          <div className="flex flex-col gap-2 border-b border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>
                已选 {selectedIds.length} 个账号，其中 {hiddenSelectedCount} 个不在当前筛选结果中。
              </span>
            </div>
            <div className="flex items-center gap-2 pl-6 sm:pl-0">
              <button
                type="button"
                onClick={retainVisibleSelection}
                className="font-medium text-amber-900 underline underline-offset-2">
                仅保留当前结果
              </button>
              <button
                type="button"
                onClick={() => onSelectionChange([])}
                className="font-medium text-amber-900 underline underline-offset-2">
                清空选择
              </button>
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="m-3 flex items-start gap-3 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">{redactSensitiveText(error)}</div>
            <button
              type="button"
              onClick={() => void onRefresh()}
              className="shrink-0 font-medium underline underline-offset-2">
              重试
            </button>
          </div>
        ) : null}

        {loading && views.length === 0 ? (
          <div className="p-3 sm:p-4">
            <LoadingRows />
          </div>
        ) : filteredViews.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center px-4 py-10 text-center">
            <Smartphone className="h-8 w-8 text-zinc-300" />
            <div className="mt-3 text-sm font-medium text-zinc-700">
              {accounts.length === 0 ? '暂无账号' : '没有匹配的账号'}
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              {accounts.length === 0 ? '添加账号后会显示在这里。' : '调整搜索或健康状态筛选。'}
            </div>
            {hasFilters ? (
              <button
                type="button"
                onClick={() => {
                  setKeyword('')
                  setHealthFilter('all')
                }}
                className="mt-4 h-8 rounded-md bg-zinc-100 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-200">
                清除筛选
              </button>
            ) : (
              <button
                type="button"
                onClick={onAddAccount}
                className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-md bg-zinc-950 px-3 text-xs font-medium text-white hover:bg-zinc-800">
                <Plus className="h-3.5 w-3.5" />
                添加账号
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1080px] table-fixed text-left text-xs">
                <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-500">
                  <tr>
                    <th className="w-10 px-3 py-2.5">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleVisible}
                        aria-label={allVisibleSelected ? '取消选择当前结果' : '选择当前结果'}
                        className="h-4 w-4 rounded border-zinc-300 text-emerald-700 focus:ring-emerald-500"
                      />
                    </th>
                    <th className="w-[19%] px-3 py-2.5 font-medium">账号</th>
                    <th className="w-[16%] px-3 py-2.5 font-medium">健康状态</th>
                    <th className="w-[18%] px-3 py-2.5 font-medium">登录态</th>
                    <th className="w-[14%] px-3 py-2.5 font-medium">归属</th>
                    <th className="w-[21%] px-3 py-2.5 font-medium">今日状态</th>
                    <th className="w-[12%] px-3 py-2.5 font-medium">更新</th>
                    <th className="w-14 px-3 py-2.5 text-right font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredViews.map((view) => (
                    <tr
                      key={view.id}
                      onClick={() => onOpenAccount(view.account)}
                      className={cn(
                        'cursor-pointer bg-white transition-colors hover:bg-zinc-50',
                        selectedSet.has(view.id) && 'bg-emerald-50/40 hover:bg-emerald-50/70',
                      )}>
                      <td className="px-3 py-3 align-top">
                        <input
                          type="checkbox"
                          checked={selectedSet.has(view.id)}
                          onClick={(event) => event.stopPropagation()}
                          onChange={() => toggleAccount(view.id)}
                          aria-label={`选择 ${view.label}`}
                          className="h-4 w-4 rounded border-zinc-300 text-emerald-700 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-3 py-3 align-top">
                        <div className="truncate text-sm font-semibold text-zinc-900">{view.label}</div>
                        <div className="mt-1 text-zinc-500">{view.phone}</div>
                      </td>
                      <td className="px-3 py-3 align-top">
                        <HealthBadge view={view} />
                        <div className="mt-1.5 line-clamp-2 text-[11px] leading-4 text-zinc-500">
                          {view.healthReason}
                        </div>
                      </td>
                      <td className="px-3 py-3 align-top">
                        <div className="font-medium text-zinc-800">{view.cookieLabel}</div>
                        <div className="mt-1 text-zinc-500">
                          {view.loginMethod} · {view.expiryLabel}
                        </div>
                      </td>
                      <td className="px-3 py-3 align-top">
                        <div className="flex items-center gap-1.5 text-zinc-700">
                          <UserRound className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                          <span className="truncate">{view.ownerLabel}</span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5 text-zinc-500">
                          <Link2 className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                          {view.linkCount ? `${view.linkCount} 个专属链接` : '未关联链接'}
                        </div>
                      </td>
                      <td className="px-3 py-3 align-top">
                        <div className="flex flex-wrap gap-1">
                          {view.activityLabels.map((label) => (
                            <span key={label} className="rounded bg-zinc-100 px-1.5 py-1 text-[11px] text-zinc-600">
                              {label}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-3 align-top text-zinc-500">
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5" />
                          {view.updatedLabel}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right align-top">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            onOpenAccount(view.account)
                          }}
                          aria-label={`打开 ${view.label}`}
                          className="inline-grid h-8 w-8 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-zinc-100 md:hidden">
              <div className="flex items-center justify-between gap-3 bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
                <label className="inline-flex items-center gap-2 font-medium">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleVisible}
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-700 focus:ring-emerald-500"
                  />
                  {allVisibleSelected ? '取消当前结果' : '选择当前结果'}
                </label>
                <span>{filteredViews.length} 个</span>
              </div>
              {filteredViews.map((view) => {
                const visual = healthVisual(view.health)
                return (
                  <div
                    key={view.id}
                    className={cn('relative px-3 py-3', selectedSet.has(view.id) && 'bg-emerald-50/50')}>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedSet.has(view.id)}
                        onChange={() => toggleAccount(view.id)}
                        aria-label={`选择 ${view.label}`}
                        className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-300 text-emerald-700 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => onOpenAccount(view.account)}
                        className="min-w-0 flex-1 text-left">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-zinc-900">{view.label}</div>
                            <div className="mt-1 text-xs text-zinc-500">{view.phone}</div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className={cn('h-2.5 w-2.5 rounded-full', visual.dot)} />
                            <ChevronRight className="h-4 w-4 text-zinc-400" />
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded-md bg-zinc-50 px-2 py-1.5">
                            <div className="text-[10px] text-zinc-400">健康状态</div>
                            <div className="mt-0.5 truncate font-medium text-zinc-700">{view.healthLabel}</div>
                          </div>
                          <div className="rounded-md bg-zinc-50 px-2 py-1.5">
                            <div className="text-[10px] text-zinc-400">登录态</div>
                            <div className="mt-0.5 truncate font-medium text-zinc-700">{view.cookieLabel}</div>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-500">
                          <span>{view.loginMethod}</span>
                          <span>{view.expiryLabel}</span>
                          <span>{view.linkCount ? `${view.linkCount} 个链接` : '未关联链接'}</span>
                          <span>更新 {view.updatedLabel}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

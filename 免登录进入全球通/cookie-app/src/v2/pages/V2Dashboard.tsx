import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Cloud,
  Cookie,
  Clock3,
  KeyRound,
  RefreshCw,
  SearchCheck,
  Settings,
  ShieldCheck,
  Smartphone,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import V2StatusBadge from '../components/V2StatusBadge'
import { getTaskStatusDisplay, getTaskTypeLabel } from '../lib/accountHealth'
import { formatPercent, formatRelativeTime } from '../lib/format'
import type { V2Account, V2BatchTask } from '../lib/types'

type Props = {
  accounts: V2Account[]
  tasks: V2BatchTask[]
  loading: boolean
  error?: string
  onRefresh: () => void
  onNavigate: (path: string) => void
  onOpenAccount: (account: V2Account) => void
  onOpenTask: (task: V2BatchTask) => void
}

const ATTENTION_STATUSES = new Set([
  'invalid',
  'expired',
  'expiring',
  'maintenance',
  'unknown',
])

type DashboardSummary = {
  activeAccounts: V2Account[]
  healthy: number
  attention: V2Account[]
  expiring: V2Account[]
  needsLogin: V2Account[]
  maintenance: V2Account[]
  healthRate: number
  runningTasks: V2BatchTask[]
  disabled: number
  coreReady: number
  qqtReady: number
  yunpanReady: number
  todayFinishedTasks: number
  todaySuccessfulItems: number
}

type DashboardMetric = {
  label: string
  value: number
  note: string
  icon: LucideIcon
  iconClass: string
  valueClass: string
}

function beijingDayKey(value: string | number | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function buildDashboardSummary(
  accounts: V2Account[],
  tasks: V2BatchTask[],
  now: string | number | Date = Date.now(),
): DashboardSummary {
  const activeAccounts = accounts.filter((account) => account.health.status !== 'disabled')
  const healthy = accounts.filter((account) => account.health.status === 'healthy').length
  const attention = accounts.filter((account) => ATTENTION_STATUSES.has(account.health.status))
  const expiring = accounts.filter((account) => account.health.status === 'expiring')
  const needsLogin = accounts.filter((account) =>
    account.health.status === 'invalid' || account.health.status === 'expired',
  )
  const maintenance = accounts.filter((account) => account.health.status === 'maintenance')
  const runningTasks = tasks.filter((task) => task.status === 'pending' || task.status === 'running')
  const todayKey = beijingDayKey(now)
  const todayFinished = tasks.filter((task) => {
    if (task.status === 'pending' || task.status === 'running') return false
    return beijingDayKey(task.finishedAt || task.updatedAt) === todayKey
  })

  return {
    activeAccounts,
    healthy,
    attention,
    expiring,
    needsLogin,
    maintenance,
    healthRate: activeAccounts.length > 0 ? (healthy / activeAccounts.length) * 100 : 0,
    runningTasks,
    disabled: accounts.length - activeAccounts.length,
    coreReady: activeAccounts.filter((account) => account.hasCookie).length,
    qqtReady: activeAccounts.filter((account) => account.credentialHealth.qqt === 'available').length,
    yunpanReady: activeAccounts.filter((account) => account.hasYunpanSession).length,
    todayFinishedTasks: todayFinished.length,
    todaySuccessfulItems: todayFinished.reduce((sum, task) => sum + task.successCount, 0),
  }
}

function coverageNote(count: number, total: number): string {
  return `${formatPercent(total > 0 ? count / total * 100 : 0)} 覆盖率`
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1500px] animate-pulse space-y-5" aria-label="正在加载运营数据">
      <div className="flex items-start justify-between gap-4">
        <div><div className="h-6 w-28 rounded bg-zinc-200" /><div className="mt-2 h-4 w-52 rounded bg-zinc-100" /></div>
        <div className="h-9 w-24 rounded-md bg-zinc-200" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, item) => <div key={item} className="h-[106px] rounded-lg border border-zinc-200 bg-white p-4"><div className="h-9 w-9 rounded-md bg-zinc-100" /><div className="mt-3 h-4 w-20 rounded bg-zinc-200" /><div className="mt-2 h-3 w-24 rounded bg-zinc-100" /></div>)}
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <div className="h-[260px] border-y border-zinc-200 bg-white" />
        <div className="h-[260px] border-y border-zinc-200 bg-white" />
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <div className="h-44 border-y border-zinc-200 bg-white" />
        <div className="h-44 border-y border-zinc-200 bg-white" />
        <div className="h-44 border-y border-zinc-200 bg-white" />
      </div>
    </div>
  )
}

export default function V2Dashboard({
  accounts,
  tasks,
  loading,
  error,
  onRefresh,
  onNavigate,
  onOpenAccount,
  onOpenTask,
}: Props) {
  const summary = buildDashboardSummary(accounts, tasks)
  const {
    activeAccounts,
    healthy,
    attention,
    expiring,
    needsLogin,
    maintenance,
    healthRate,
    runningTasks,
  } = summary
  const otherAttention = attention.length - expiring.length - maintenance.length
  const recentAccounts = [...accounts]
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, 5)
  const runningCompletedItems = runningTasks.reduce((sum, task) => sum + task.completedCount, 0)
  const metrics: DashboardMetric[] = [
    {
      label: '全部账号',
      value: accounts.length,
      note: `${activeAccounts.length} 个可执行 · ${summary.disabled} 个已失效`,
      icon: UsersRound,
      iconClass: 'border-sky-100 bg-sky-50 text-sky-700',
      valueClass: 'text-zinc-950',
    },
    {
      label: '健康账号',
      value: healthy,
      note: `健康率 ${formatPercent(healthRate)}`,
      icon: ShieldCheck,
      iconClass: 'border-emerald-100 bg-emerald-50 text-emerald-700',
      valueClass: 'text-emerald-700',
    },
    {
      label: '需要处理',
      value: attention.length,
      note: `${needsLogin.length} 个需重新登录`,
      icon: AlertTriangle,
      iconClass: 'border-amber-100 bg-amber-50 text-amber-700',
      valueClass: attention.length > 0 ? 'text-amber-700' : 'text-zinc-950',
    },
    {
      label: '运行中任务',
      value: runningTasks.length,
      note: `${runningCompletedItems} 个账号项已完成`,
      icon: RefreshCw,
      iconClass: 'border-violet-100 bg-violet-50 text-violet-700',
      valueClass: 'text-violet-700',
    },
    {
      label: '核心 CK 可用',
      value: summary.coreReady,
      note: coverageNote(summary.coreReady, activeAccounts.length),
      icon: Cookie,
      iconClass: 'border-cyan-100 bg-cyan-50 text-cyan-700',
      valueClass: 'text-cyan-700',
    },
    {
      label: '全球通授权',
      value: summary.qqtReady,
      note: coverageNote(summary.qqtReady, activeAccounts.length),
      icon: KeyRound,
      iconClass: 'border-indigo-100 bg-indigo-50 text-indigo-700',
      valueClass: 'text-indigo-700',
    },
    {
      label: '云盘会话',
      value: summary.yunpanReady,
      note: coverageNote(summary.yunpanReady, activeAccounts.length),
      icon: Cloud,
      iconClass: 'border-teal-100 bg-teal-50 text-teal-700',
      valueClass: 'text-teal-700',
    },
    {
      label: '今日成功账号项',
      value: summary.todaySuccessfulItems,
      note: `${summary.todayFinishedTasks} 个任务已结束`,
      icon: CheckCircle2,
      iconClass: 'border-rose-100 bg-rose-50 text-rose-700',
      valueClass: 'text-rose-700',
    },
  ]

  if (loading && accounts.length === 0) {
    return <DashboardSkeleton />
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-950">工作台</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {attention.length} 个账号需要处理 · {runningTasks.length} 个任务正在执行
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            <RefreshCw className="h-4 w-4" />
            刷新
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/v2/accounts?status=attention')}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800">
            处理待办
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error ? (
        <div className="flex items-start gap-2 border-l-4 border-rose-500 bg-rose-50 px-3 py-3 text-sm text-rose-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="运营概览">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <article
              key={metric.label}
              className="min-w-0 rounded-lg border border-zinc-200/90 bg-white p-3 shadow-[0_1px_2px_rgba(24,24,27,0.04)] sm:p-4">
              <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md border sm:h-9 sm:w-9 ${metric.iconClass}`}>
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="min-h-8 text-xs font-medium leading-4 text-zinc-500 sm:min-h-0">{metric.label}</div>
                  <div className={`mt-1 text-2xl font-semibold leading-none ${metric.valueClass}`}>{metric.value}</div>
                  <div className="mt-2 text-[11px] leading-4 text-zinc-500">{metric.note}</div>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <section className="min-w-0 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(24,24,27,0.03)]">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-zinc-950">今日待办</h2>
              <p className="mt-0.5 text-xs text-zinc-500">按风险和到期时间排序</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/v2/accounts?status=attention')}
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-900">
              全部账号 <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="divide-y divide-zinc-100">
            {[
              { label: '需重新登录', accounts: needsLogin, tone: 'danger' as const, note: '核心登录凭据不可用' },
              { label: '即将到期', accounts: expiring, tone: 'warning' as const, note: '登录窗口进入提醒期' },
              { label: '需维护', accounts: maintenance, tone: 'warning' as const, note: '扩展凭据需要恢复' },
            ].map((group) => (
              <div key={group.label} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <V2StatusBadge label={group.label} tone={group.tone} />
                    <strong className="text-sm text-zinc-900">{group.accounts.length} 个账号</strong>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">{group.note}</p>
                </div>
                {group.accounts[0] ? (
                  <button
                    type="button"
                    onClick={() => onOpenAccount(group.accounts[0])}
                    className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-200 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50">
                    查看首个账号
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 已清空
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(24,24,27,0.03)]">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-zinc-950">执行中的任务</h2>
              <p className="mt-0.5 text-xs text-zinc-500">离开页面后继续运行</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/v2/tasks')}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-900">
              任务中心
            </button>
          </div>
          <div className="divide-y divide-zinc-100">
            {runningTasks.length > 0 ? runningTasks.slice(0, 4).map((task) => {
              const status = getTaskStatusDisplay(task)
              const progress = task.totalCount > 0 ? (task.completedCount / task.totalCount) * 100 : 0
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onOpenTask(task)}
                  className="block w-full px-4 py-3 text-left hover:bg-zinc-50">
                  <div className="flex items-center justify-between gap-3">
                    <strong className="truncate text-sm text-zinc-900">{getTaskTypeLabel(task.type)}</strong>
                    <V2StatusBadge label={status.label} tone={status.tone} />
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                    <div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.max(2, progress)}%` }} />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-zinc-500">
                    <span>{task.completedCount} / {task.totalCount}</span>
                    <span>{task.currentLabel || '准备执行'}</span>
                  </div>
                </button>
              )
            }) : (
              <div className="px-4 py-8 text-center text-sm text-zinc-500">当前没有运行中的任务</div>
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_minmax(280px,0.75fr)]">
        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-[0_1px_2px_rgba(24,24,27,0.03)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-zinc-950">账号健康结构</h2>
              <p className="mt-0.5 text-xs text-zinc-500">不包含已失效账号</p>
            </div>
            <span className="text-sm font-semibold text-zinc-900">{formatPercent(healthRate)}</span>
          </div>
          <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-zinc-100" aria-label={`健康率 ${formatPercent(healthRate)}`}>
            <span className="bg-emerald-600" style={{ width: `${healthRate}%` }} />
            <span className="bg-amber-400" style={{ width: `${activeAccounts.length ? (expiring.length + maintenance.length) / activeAccounts.length * 100 : 0}%` }} />
            <span className="bg-rose-500" style={{ width: `${activeAccounts.length ? otherAttention / activeAccounts.length * 100 : 0}%` }} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div><span className="block text-zinc-500">健康</span><strong className="mt-1 block text-zinc-900">{healthy}</strong></div>
            <div><span className="block text-zinc-500">需关注</span><strong className="mt-1 block text-zinc-900">{expiring.length + maintenance.length}</strong></div>
            <div><span className="block text-zinc-500">其他待处理</span><strong className="mt-1 block text-zinc-900">{otherAttention}</strong></div>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(24,24,27,0.03)]">
          <div className="border-b border-zinc-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-zinc-950">最近更新</h2>
          </div>
          <div className="divide-y divide-zinc-100">
            {recentAccounts.length > 0 ? recentAccounts.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => onOpenAccount(account)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-50">
                <Clock3 className="h-4 w-4 shrink-0 text-zinc-400" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-zinc-900">{account.displayPhone || account.phoneMasked}</div>
                  <div className="truncate text-xs text-zinc-500">{account.label}</div>
                </div>
                <span className="shrink-0 text-xs text-zinc-500">{formatRelativeTime(account.updatedAt)}</span>
              </button>
            )) : (
              <div className="px-4 py-8 text-center text-sm text-zinc-500">暂无账号更新记录</div>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(24,24,27,0.03)]">
          <div className="border-b border-zinc-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-zinc-950">快捷操作</h2>
            <p className="mt-0.5 text-xs text-zinc-500">进入常用运营工作区</p>
          </div>
          <div className="divide-y divide-zinc-100">
            {[
              { label: '管理账号', note: '查看状态与凭据能力', path: '/v2/accounts', icon: Smartphone, iconClass: 'bg-emerald-50 text-emerald-700' },
              { label: '查看任务', note: '跟踪执行进度与结果', path: '/v2/tasks', icon: ClipboardList, iconClass: 'bg-sky-50 text-sky-700' },
              { label: '查询业务', note: '进入在网业务工作台', path: '/v2/business', icon: SearchCheck, iconClass: 'bg-violet-50 text-violet-700' },
              { label: '系统设置', note: '检查运行与安全配置', path: '/v2/settings', icon: Settings, iconClass: 'bg-zinc-100 text-zinc-700' },
            ].map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.path}
                  type="button"
                  onClick={() => onNavigate(action.path)}
                  className="group flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${action.iconClass}`}>
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate text-sm font-medium text-zinc-900">{action.label}</strong>
                    <small className="mt-0.5 block truncate text-xs text-zinc-500">{action.note}</small>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-zinc-300 group-hover:text-zinc-600" />
                </button>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

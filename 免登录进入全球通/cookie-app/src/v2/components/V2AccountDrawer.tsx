import { useEffect, useState } from 'react'
import YunpanJumpActions from '@/components/YunpanJumpActions'
import CallbackAppointmentDialog from '@/components/CallbackAppointmentDialog'
import {
  Activity,
  CalendarClock,
  Cloud,
  Cookie,
  KeyRound,
  Link2,
  LogIn,
  Play,
  SearchCheck,
  ShieldCheck,
  Smartphone,
  X,
} from 'lucide-react'
import V2StatusBadge from './V2StatusBadge'
import { getTaskStatusDisplay, getTaskTypeLabel } from '../lib/accountHealth'
import { formatBeijingDateTime, formatCountdown, formatRelativeTime } from '../lib/format'
import type { V2Account, V2BatchTask, V2TaskType } from '../lib/types'
import { getAccountLoginState, getYunpanCredentialStatus } from '@/lib/accountLoginState'

type Props = {
  account: V2Account | null
  tasks: V2BatchTask[]
  onClose: () => void
  onLogin: (account: V2Account) => void
  onStartTask: (type: V2TaskType, accountIds: string[]) => void
  onOpenBusiness: (account: V2Account) => void
}

function Capability({
  icon: Icon,
  label,
  available,
  updatedAt,
  status,
}: {
  icon: typeof Cookie
  label: string
  available: boolean
  updatedAt?: string
  status?: { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }
}) {
  return (
    <div className="flex items-center gap-3 border-b border-zinc-100 py-3 last:border-b-0">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-zinc-100 text-zinc-600">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-zinc-900">{label}</div>
        <div className="mt-0.5 text-xs text-zinc-500">
          {updatedAt ? `${formatRelativeTime(updatedAt)}更新` : '尚未记录更新时间'}
        </div>
      </div>
      <V2StatusBadge label={status?.label ?? (available ? '已保存' : '未保存')} tone={status?.tone ?? (available ? 'neutral' : 'warning')} />
    </div>
  )
}

export default function V2AccountDrawer({
  account,
  tasks,
  onClose,
  onLogin,
  onStartTask,
  onOpenBusiness,
}: Props) {
  const [callbackOpen, setCallbackOpen] = useState(false)
  useEffect(() => { setCallbackOpen(false) }, [account?.id])
  useEffect(() => {
    if (!account) return undefined
    const previous = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [account, onClose])

  if (!account) return null
  const raw = account.raw
  const yunpanStatus = getYunpanCredentialStatus(raw ?? account)
  const login = getAccountLoginState(raw ?? account)
  const accountTasks = tasks
    .filter((task) => task.items.some((item) => item.accountId === account.id))
    .slice(0, 5)

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50">
      <CallbackAppointmentDialog account={callbackOpen ? account : null} onClose={() => setCallbackOpen(false)} />
      <button
        type="button"
        aria-label="关闭账号详情"
        onClick={onClose}
        className="absolute bottom-0 left-0 right-0 top-0 bg-black/35"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="v2-account-drawer-title"
        className="absolute bottom-0 right-0 top-0 flex w-full flex-col border-l border-zinc-200 bg-white shadow-2xl sm:max-w-[480px]">
        <header className="flex shrink-0 items-start gap-3 border-b border-zinc-200 px-4 py-4 sm:px-5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="v2-account-drawer-title" className="text-lg font-semibold text-zinc-950">
                {account.displayPhone || account.phoneMasked || account.phone}
              </h2>
              <V2StatusBadge label={account.health.label} tone={account.health.tone} />
            </div>
            <p className="mt-1 truncate text-sm text-zinc-500">{account.label}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭账号详情"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-5">
          <section className="border-b border-zinc-200 py-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              <div>
                <span className="block text-xs text-zinc-500">{account.hasYunpanSession ? '云盘 CK' : '10086 登录有效期'}</span>
                <strong className="mt-1 block font-medium text-zinc-900">{account.hasYunpanSession ? yunpanStatus.label : formatCountdown(account.cookieExpireAt)}</strong>
              </div>
              <div>
                <span className="block text-xs text-zinc-500">最近登录</span>
                <strong className="mt-1 block font-medium text-zinc-900">{formatBeijingDateTime(raw?.lastLoginAt)}</strong>
              </div>
              <div>
                <span className="block text-xs text-zinc-500">专属链接</span>
                <strong className="mt-1 block truncate font-medium text-zinc-900">{account.publicLinkIds[0] || '未分配'}</strong>
              </div>
              <div>
                <span className="block text-xs text-zinc-500">最近更新</span>
                <strong className="mt-1 block font-medium text-zinc-900">{formatRelativeTime(account.updatedAt)}</strong>
              </div>
            </div>
            {account.health.reason ? (
              <div className={`mt-4 border-l-4 px-3 py-2 text-sm ${account.health.tone === 'success' ? 'border-emerald-400 bg-emerald-50 text-emerald-900' : 'border-amber-400 bg-amber-50 text-amber-900'}`}>
                {account.health.reason}
              </div>
            ) : null}
          </section>

          <section className="border-b border-zinc-200 py-4">
            <div className="mb-1 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-zinc-500" />
              <h3 className="text-sm font-semibold text-zinc-950">各渠道 CK 管理</h3>
            </div>
            <Capability icon={Cloud} label="云盘 CK（主凭据）" available={account.hasYunpanSession} updatedAt={raw?.yunpanSessionCheckedAt || raw?.yunpanSessionUpdatedAt} status={yunpanStatus} />
            <Capability icon={Cookie} label="10086 CK" available={account.hasCookie} updatedAt={raw?.cookieUpdatedAt} status={account.hasCookie ? { label: login.hasCmcc ? '已保存' : '失效', tone: login.hasCmcc ? 'neutral' : 'danger' } : undefined} />
            <Capability icon={KeyRound} label="全球通授权 Token" available={Boolean(raw?.qqtAccessToken)} updatedAt={raw?.qqtAccessTokenCheckedAt} />
            {account.hasYunpanSession || raw?.qqtAccessToken ? <div className="mt-3"><YunpanJumpActions key={account.id} accountId={account.id} includeGlobal canRefreshGlobal={Boolean(account.hasYunpanSession || account.hasCookie)} disabled={account.health.status === 'disabled'} /></div> : null}
            <Capability icon={Smartphone} label="移动 App 凭据" available={account.hasCmccAppCookie} updatedAt={raw?.cmccAppCookieUpdatedAt} />
            <Capability icon={Cookie} label="周三活动 CK" available={account.hasWedRechargeCookie} updatedAt={raw?.wedRechargeCookieUpdatedAt} />
          </section>

          <section className="border-b border-zinc-200 py-4">
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-zinc-500" />
              <h3 className="text-sm font-semibold text-zinc-950">最近任务</h3>
            </div>
            {accountTasks.length > 0 ? (
              <div className="divide-y divide-zinc-100">
                {accountTasks.map((task) => {
                  const status = getTaskStatusDisplay(task)
                  return (
                    <div key={task.id} className="flex items-center gap-3 py-2.5">
                      <CalendarClock className="h-4 w-4 shrink-0 text-zinc-400" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-zinc-900">{getTaskTypeLabel(task.type)}</div>
                        <div className="mt-0.5 text-xs text-zinc-500">{formatBeijingDateTime(task.updatedAt)}</div>
                      </div>
                      <V2StatusBadge label={status.label} tone={status.tone} />
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="py-3 text-sm text-zinc-500">近期任务中没有该账号记录</p>
            )}
          </section>

          <section className="py-4">
            <div className="mb-3 flex items-center gap-2">
              <Link2 className="h-4 w-4 text-zinc-500" />
              <h3 className="text-sm font-semibold text-zinc-950">账号关系</h3>
            </div>
            <div className="text-sm text-zinc-600">
              {account.publicLinkIds.length > 0
                ? `已关联 ${account.publicLinkIds.length} 个专属链接`
                : '当前未关联专属链接'}
            </div>
          </section>
        </div>

        <footer className="flex shrink-0 flex-wrap gap-2 border-t border-zinc-200 bg-white px-4 py-3 sm:px-5">
          <button type="button" disabled={!account.hasCookie || Boolean(raw?.disabledAt)} onClick={() => setCallbackOpen(true)} className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">10086 预约回访</button>
          <button
            type="button"
            onClick={() => onLogin(account)}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800">
            <LogIn className="h-4 w-4" />
            重新登录
          </button>
          <button
            type="button"
            onClick={() => onStartTask('ck_maintenance', [account.id])}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            <Play className="h-4 w-4" />
            CK 维护
          </button>
          <button
            type="button"
            onClick={() => onOpenBusiness(account)}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            <SearchCheck className="h-4 w-4" />
            业务查询
          </button>
        </footer>
      </aside>
    </div>
  )
}

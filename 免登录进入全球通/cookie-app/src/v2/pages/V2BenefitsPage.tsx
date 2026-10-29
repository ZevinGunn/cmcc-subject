import { ArrowRight, BadgeCheck, CalendarDays, Gift, KeyRound, ListChecks, Puzzle, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatRelativeTime } from '../lib/format'
import type { V2Account, V2TaskType } from '../lib/types'

function dayKey(value?: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export default function V2BenefitsPage({ accounts, onStartTask }: { accounts: V2Account[]; onStartTask: (type: V2TaskType, accountIds: string[]) => void }) {
  const usable = accounts.filter((account) => account.health.status !== 'disabled')
  const today = dayKey(new Date().toISOString())
  const signed = usable.filter((account) => dayKey(account.raw?.qqtSignUpdatedAt) === today)
  const xdrSynced = usable.filter((account) => dayKey(account.raw?.xdrReceiveUpdatedAt) === today)
  const weekAgo = Date.now() - 7 * 24 * 60 * 60_000
  const puzzleSynced = usable.filter((account) => {
    const timestamp = Date.parse(account.raw?.wedRechargeUpdatedAt || '')
    return Number.isFinite(timestamp) && timestamp >= weekAgo
  })
  const tokenReady = usable.filter((account) => Boolean(account.raw?.qqtAccessToken))
  const rows = [
    { title: '全球通签到', icon: ListChecks, complete: signed.length, total: usable.length, updatedAt: signed[0]?.raw?.qqtSignUpdatedAt, task: 'refresh_and_sign' as const, action: '执行签到' },
    { title: '星动日权益', icon: Gift, complete: xdrSynced.length, total: usable.length, updatedAt: xdrSynced[0]?.raw?.xdrReceiveUpdatedAt, task: 'query_info' as const, action: '同步权益' },
    { title: '周三拼图', icon: Puzzle, complete: puzzleSynced.length, total: usable.length, updatedAt: puzzleSynced[0]?.raw?.wedRechargeUpdatedAt, task: 'wed_recharge' as const, action: '执行拼图' },
    { title: '全球通 Token', icon: KeyRound, complete: tokenReady.length, total: usable.length, updatedAt: tokenReady[0]?.raw?.qqtAccessTokenCheckedAt, task: 'query_info' as const, action: '刷新授权' },
  ]
  const signedIds = new Set(signed.map((account) => account.id))
  const xdrSyncedIds = new Set(xdrSynced.map((account) => account.id))
  const puzzleSyncedIds = new Set(puzzleSynced.map((account) => account.id))
  const tokenReadyIds = new Set(tokenReady.map((account) => account.id))
  const overallComplete = usable.filter(
    (account) =>
      signedIds.has(account.id) &&
      xdrSyncedIds.has(account.id) &&
      puzzleSyncedIds.has(account.id) &&
      tokenReadyIds.has(account.id),
  ).length

  return <div className="mx-auto w-full max-w-[1500px] space-y-5"><div><h1 className="text-xl font-semibold text-zinc-950">权益活动</h1><p className="mt-1 text-sm text-zinc-500">{overallComplete} / {usable.length} 个账号完成全部今日项目</p></div><div className="grid gap-3 lg:grid-cols-2"><Link to="/v2/benefits/global-telecom" className="flex items-center gap-3 border-y border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-950 hover:bg-emerald-100"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white text-emerald-700 shadow-sm"><BadgeCheck className="h-5 w-5" /></span><span className="min-w-0 flex-1"><strong className="block text-sm">全球通查询专区</strong><span className="mt-1 block text-xs text-emerald-800/75">等级、网龄、星动日、成长值与年度消费</span></span><ArrowRight className="h-4 w-4 shrink-0" /></Link><Link to="/v2/benefits/lucky-three-day" className="flex items-center gap-3 border-y border-rose-200 bg-rose-50 px-4 py-4 text-rose-950 hover:bg-rose-100"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white text-rose-700 shadow-sm"><CalendarDays className="h-5 w-5" /></span><span className="min-w-0 flex-1"><strong className="block text-sm">幸运三日签</strong><span className="mt-1 block text-xs text-rose-800/75">每日累签与限量话费券领取</span></span><ArrowRight className="h-4 w-4 shrink-0" /></Link></div><section className="grid gap-3 sm:grid-cols-3"><div className="rounded-md border border-zinc-200 bg-white p-4"><span className="text-xs text-zinc-500">可执行账号</span><strong className="mt-2 block text-2xl text-zinc-950">{usable.length}</strong></div><div className="rounded-md border border-zinc-200 bg-white p-4"><span className="text-xs text-zinc-500">全部完成</span><strong className="mt-2 block text-2xl text-zinc-950">{overallComplete}</strong></div><div className="rounded-md border border-zinc-200 bg-white p-4"><span className="text-xs text-zinc-500">仍需处理</span><strong className="mt-2 block text-2xl text-amber-700">{Math.max(0, usable.length - overallComplete)}</strong></div></section><section className="overflow-hidden border-y border-zinc-200 bg-white"><div className="hidden grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_150px_120px] gap-4 border-b border-zinc-200 px-4 py-2.5 text-xs font-medium text-zinc-500 md:grid"><span>活动</span><span>完成进度</span><span>最近同步</span><span></span></div><div className="divide-y divide-zinc-100">{rows.map((row) => { const Icon = row.icon; const progress = row.total > 0 ? row.complete / row.total * 100 : 0; return <div key={row.title} className="grid gap-3 px-4 py-4 md:grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_150px_120px] md:items-center"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-md bg-emerald-50 text-emerald-700"><Icon className="h-4 w-4" /></span><strong className="text-sm text-zinc-950">{row.title}</strong></div><div><div className="h-1.5 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${progress}%` }} /></div><div className="mt-1.5 text-xs text-zinc-500">{row.complete} / {row.total}</div></div><span className="text-sm text-zinc-600">{formatRelativeTime(row.updatedAt)}</span><button type="button" onClick={() => onStartTask(row.task, [])} className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-zinc-200 px-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"><RefreshCw className="h-3.5 w-3.5" />{row.action}</button></div>})}</div></section></div>
}

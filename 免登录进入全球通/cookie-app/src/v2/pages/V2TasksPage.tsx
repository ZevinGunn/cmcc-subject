import { ArrowRight, Loader2, Play, RefreshCw } from 'lucide-react'
import V2StatusBadge from '../components/V2StatusBadge'
import { getTaskStatusDisplay, getTaskTypeLabel } from '../lib/accountHealth'
import { formatBeijingDateTime } from '../lib/format'
import type { V2BatchTask } from '../lib/types'

export default function V2TasksPage({ tasks, loading, error, onRefresh, onCreate, onOpen }: { tasks: V2BatchTask[]; loading: boolean; error?: string; onRefresh: () => void; onCreate: () => void; onOpen: (task: V2BatchTask) => void }) {
  const running = tasks.filter((task) => task.status === 'pending' || task.status === 'running')
  const completedItems = tasks.reduce((sum, task) => sum + task.completedCount, 0)
  const successItems = tasks.reduce((sum, task) => sum + task.successCount, 0)
  const successRate = completedItems > 0 ? Math.round(successItems / completedItems * 100) : 0

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-xl font-semibold text-zinc-950">任务中心</h1><p className="mt-1 text-sm text-zinc-500">{running.length} 个执行中 · {completedItems} 个账号项已完成</p></div><div className="flex gap-2"><button type="button" onClick={onRefresh} disabled={loading} className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"><RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />刷新</button><button type="button" onClick={onCreate} className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800"><Play className="h-4 w-4" />新建任务</button></div></div>
      {error ? <div className="border-l-4 border-rose-500 bg-rose-50 px-3 py-3 text-sm text-rose-800">{error}</div> : null}
      <section className="grid gap-3 sm:grid-cols-3"><div className="rounded-md border border-zinc-200 bg-white p-4"><span className="text-xs text-zinc-500">活动任务</span><strong className="mt-2 block text-2xl text-zinc-950">{tasks.length}</strong></div><div className="rounded-md border border-zinc-200 bg-white p-4"><span className="text-xs text-zinc-500">已完成账号项</span><strong className="mt-2 block text-2xl text-zinc-950">{completedItems}</strong></div><div className="rounded-md border border-zinc-200 bg-white p-4"><span className="text-xs text-zinc-500">当前成功率</span><strong className="mt-2 block text-2xl text-zinc-950">{successRate}%</strong></div></section>
      <section className="overflow-hidden border-y border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3"><h2 className="text-sm font-semibold text-zinc-950">执行队列</h2></div>
        {loading && tasks.length === 0 ? <div className="flex items-center justify-center py-16 text-sm text-zinc-500"><Loader2 className="mr-2 h-4 w-4 animate-spin" />正在加载任务</div> : tasks.length === 0 ? <div className="px-4 py-16 text-center text-sm text-zinc-500">当前没有活动任务</div> : <div className="divide-y divide-zinc-100">{tasks.map((task) => { const status = getTaskStatusDisplay(task); const progress = task.totalCount > 0 ? task.completedCount / task.totalCount * 100 : 0; return <button key={task.id} type="button" onClick={() => onOpen(task)} className="grid w-full gap-3 px-4 py-4 text-left hover:bg-zinc-50 md:grid-cols-[minmax(190px,1.1fr)_minmax(180px,1fr)_auto] md:items-center"><div><div className="flex flex-wrap items-center gap-2"><strong className="text-sm text-zinc-950">{getTaskTypeLabel(task.type)}</strong><V2StatusBadge label={status.label} tone={status.tone} /></div><span className="mt-1 block text-xs text-zinc-500">{formatBeijingDateTime(task.createdAt)} · {task.scopeType === 'selected_accounts' ? '选中账号' : '全部账号'}</span></div><div><div className="h-1.5 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.max(task.status === 'running' ? 2 : 0, progress)}%` }} /></div><div className="mt-1.5 flex justify-between text-xs text-zinc-500"><span>{task.completedCount} / {task.totalCount}</span><span>失败 {task.failedCount}</span></div></div><span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">查看详情 <ArrowRight className="h-3.5 w-3.5" /></span></button>})}</div>}
      </section>
    </div>
  )
}


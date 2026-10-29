import { useEffect } from 'react'
import { AlertTriangle, CalendarClock, CheckCircle2, Clock3, Copy, Loader2, Square, X } from 'lucide-react'
import V2StatusBadge from './V2StatusBadge'
import { getTaskItemStatusDisplay, getTaskStatusDisplay, getTaskTypeLabel } from '../lib/accountHealth'
import { formatBeijingDateTime } from '../lib/format'
import type { V2BatchTask } from '../lib/types'

export default function V2TaskDrawer({
  task,
  cancelling,
  onClose,
  onCancel,
  onCopyTokens,
  copyingTokens,
}: {
  task: V2BatchTask | null
  cancelling?: boolean
  onClose: () => void
  onCancel: (task: V2BatchTask) => void
  onCopyTokens: (task: V2BatchTask) => void
  copyingTokens?: boolean
}) {
  useEffect(() => {
    if (!task) return undefined
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
  }, [onClose, task])

  if (!task) return null
  const status = getTaskStatusDisplay(task)
  const progress = task.totalCount > 0 ? task.completedCount / task.totalCount * 100 : 0
  const running = task.status === 'pending' || task.status === 'running'
  const canCopyTokens =
    !running &&
    ['refresh', 'refresh_and_sign', 'ck_maintenance'].includes(task.type)

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50">
      <button type="button" aria-label="关闭任务详情" onClick={onClose} className="absolute bottom-0 left-0 right-0 top-0 bg-black/35" />
      <aside role="dialog" aria-modal="true" aria-labelledby="v2-task-title" className="absolute bottom-0 right-0 top-0 flex w-full flex-col border-l border-zinc-200 bg-white shadow-2xl sm:max-w-[540px]">
        <header className="flex shrink-0 items-start gap-3 border-b border-zinc-200 px-4 py-4 sm:px-5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="v2-task-title" className="text-lg font-semibold text-zinc-950">{getTaskTypeLabel(task.type)}</h2>
              <V2StatusBadge label={status.label} tone={status.tone} />
            </div>
            <p className="mt-1 truncate text-xs text-zinc-500">任务 {task.id}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭任务详情" className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100"><X className="h-4 w-4" /></button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-24 sm:px-5">
          <section className="border-b border-zinc-200 py-4">
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.max(running ? 2 : 0, progress)}%` }} /></div>
            <div className="mt-2 flex items-center justify-between text-xs text-zinc-500"><span>{task.completedCount} / {task.totalCount}</span><span>{Math.round(progress)}%</span></div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div><span className="block text-xs text-zinc-500">成功</span><strong className="mt-1 block text-emerald-700">{task.successCount}</strong></div>
              <div><span className="block text-xs text-zinc-500">失败</span><strong className="mt-1 block text-rose-700">{task.failedCount}</strong></div>
              <div><span className="block text-xs text-zinc-500">跳过</span><strong className="mt-1 block text-zinc-800">{task.skippedCount}</strong></div>
              <div><span className="block text-xs text-zinc-500">当前账号</span><strong className="mt-1 block truncate text-zinc-800">{task.currentLabel || '—'}</strong></div>
            </div>
          </section>

          <section className="border-b border-zinc-200 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="flex items-center gap-1 text-xs text-zinc-500"><CalendarClock className="h-3.5 w-3.5" />创建时间</span><strong className="mt-1 block font-medium text-zinc-900">{formatBeijingDateTime(task.createdAt)}</strong></div>
              <div><span className="flex items-center gap-1 text-xs text-zinc-500"><Clock3 className="h-3.5 w-3.5" />开始时间</span><strong className="mt-1 block font-medium text-zinc-900">{formatBeijingDateTime(task.startedAt)}</strong></div>
              <div><span className="block text-xs text-zinc-500">执行范围</span><strong className="mt-1 block font-medium text-zinc-900">{task.scopeType === 'selected_accounts' ? '选中账号' : task.scopeType === 'admin_all' ? '全部账号' : task.scopeType}</strong></div>
              <div><span className="block text-xs text-zinc-500">来源</span><strong className="mt-1 block font-medium text-zinc-900">{task.source === 'manual' ? '手动创建' : task.source}</strong></div>
            </div>
            {task.message ? <div className="mt-4 border-l-4 border-amber-400 bg-amber-50 px-3 py-2 text-sm text-amber-900">{task.message}</div> : null}
          </section>

          <section className="py-4">
            <h3 className="text-sm font-semibold text-zinc-950">账号明细</h3>
            {task.items.length > 0 ? (
              <div className="mt-3 divide-y divide-zinc-100 border-y border-zinc-200">
                {task.items.map((item) => {
                  const itemStatus = getTaskItemStatusDisplay(item.status, item.message)
                  return (
                    <div key={item.id} className="flex items-start gap-3 py-3">
                      {itemStatus.tone === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : itemStatus.tone === 'danger' ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" /> : <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />}
                      <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium text-zinc-900">{item.accountLabel || item.accountId}</div>{item.message ? <p className="mt-1 whitespace-pre-wrap text-xs text-zinc-500">{item.message}</p> : null}</div>
                      <V2StatusBadge label={itemStatus.label} tone={itemStatus.tone} />
                    </div>
                  )
                })}
              </div>
            ) : <p className="mt-3 text-sm text-zinc-500">账号明细将在任务开始后出现</p>}
          </section>
        </div>

        {running || canCopyTokens ? (
          <footer className="absolute bottom-0 left-0 right-0 border-t border-zinc-200 bg-white px-4 py-3 sm:px-5">
            {running ? (
              <button type="button" disabled={cancelling} onClick={() => onCancel(task)} className="inline-flex h-9 items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-50"><Square className="h-3.5 w-3.5" />{cancelling ? '停止中' : '停止任务'}</button>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-zinc-500">自动筛除过期、非全球通及已领取账号</span>
                <button type="button" disabled={copyingTokens} onClick={() => onCopyTokens(task)} className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50">
                  {copyingTokens ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
                  {copyingTokens ? '正在筛选' : '复制有效 Token'}
                </button>
              </div>
            )}
          </footer>
        ) : null}
      </aside>
    </div>
  )
}

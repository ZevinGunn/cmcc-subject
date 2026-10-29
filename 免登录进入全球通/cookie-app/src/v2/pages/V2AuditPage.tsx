import { useCallback, useEffect, useState } from 'react'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  RefreshCcw,
  Search,
  ShieldAlert,
  UserRound,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { loadAccessLogs } from '../lib/api'
import type { AccessActorType, AccessLog, V2BatchTask } from '../lib/types'
import { formatBeijingDateTime } from '../lib/format'
import { getTaskStatusDisplay, getTaskTypeLabel } from '../lib/accountHealth'
import V2StatusBadge from '../components/V2StatusBadge'

type AuditView = 'access' | 'tasks'

function actorLabel(log: AccessLog): string {
  if (log.actorName) return log.actorName
  if (log.actorType === 'admin') return '管理员'
  if (log.actorType === 'user') return '用户'
  return '未登录访客'
}

function actorTypeLabel(type: AccessActorType): string {
  if (type === 'admin') return '管理员'
  if (type === 'user') return '用户'
  return '访客'
}

function AccessLogRow({ log }: { log: AccessLog }) {
  return (
    <div className="grid gap-2 px-4 py-3 text-xs hover:bg-zinc-50 md:grid-cols-[170px_120px_minmax(150px,.8fr)_minmax(220px,1.4fr)_90px_90px] md:items-center md:gap-3">
      <div className="text-zinc-600">{formatBeijingDateTime(log.createdAt)}</div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 font-medium text-zinc-900">
          <UserRound className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          <span className="truncate">{actorLabel(log)}</span>
        </div>
        <div className="mt-0.5 text-[10px] text-zinc-400">{actorTypeLabel(log.actorType)}</div>
      </div>
      <div>
        <span className="inline-flex rounded bg-zinc-100 px-2 py-1 font-medium text-zinc-700">{log.feature}</span>
      </div>
      <div className="min-w-0">
        <div className="font-medium text-zinc-900">{log.action}</div>
        <div className="mt-0.5 truncate font-mono text-[10px] text-zinc-400" title={log.path}>
          {log.method} {log.path}
        </div>
        <div className="mt-0.5 truncate text-[10px] text-zinc-400">{log.ipAddress || '未记录 IP'}</div>
      </div>
      <div className={cn(
        'inline-flex w-fit items-center gap-1 font-medium',
        log.success ? 'text-emerald-700' : 'text-red-700',
      )}>
        {log.success ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
        {log.statusCode}
      </div>
      <div className="text-zinc-600">{Math.round(log.durationMs)} ms</div>
    </div>
  )
}

export default function V2AuditPage({
  tasks,
  onOpenTask,
}: {
  tasks: V2BatchTask[]
  onOpenTask: (task: V2BatchTask) => void
}) {
  const [view, setView] = useState<AuditView>('access')
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [actorType, setActorType] = useState<AccessActorType | ''>('')
  const [feature, setFeature] = useState('')
  const [result, setResult] = useState<'all' | 'success' | 'failed'>('all')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const limit = 50
  const pageCount = Math.max(1, Math.ceil(total / limit))

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(undefined)
    try {
      const data = await loadAccessLogs({
        page,
        limit,
        actorType: actorType || undefined,
        feature: feature || undefined,
        success: result === 'all' ? undefined : result === 'success',
        search: search || undefined,
      })
      setLogs(data.logs)
      setFeatures(data.features)
      setTotal(data.total)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '访问日志加载失败')
    } finally {
      setLoading(false)
    }
  }, [actorType, feature, page, result, search])

  useEffect(() => {
    if (view === 'access') void refresh()
  }, [refresh, view])

  function applySearch() {
    setPage(1)
    setSearch(searchInput.trim())
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-zinc-950">日志与审计</h1>
          <p className="mt-1 text-sm text-zinc-500">访问行为、功能请求和任务执行记录</p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading || view !== 'access'}
          aria-label="刷新访问日志"
          title="刷新"
          className="grid h-9 w-9 place-items-center rounded-md border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-300">
          <RefreshCcw className={cn('h-4 w-4', loading && 'animate-spin')} />
        </button>
      </div>

      <div className="inline-flex rounded-md border border-zinc-200 bg-white p-1">
        <button
          type="button"
          onClick={() => setView('access')}
          className={cn('rounded px-3 py-1.5 text-xs font-medium', view === 'access' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100')}>
          访问日志
        </button>
        <button
          type="button"
          onClick={() => setView('tasks')}
          className={cn('rounded px-3 py-1.5 text-xs font-medium', view === 'tasks' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100')}>
          任务事件
        </button>
      </div>

      {view === 'access' ? (
        <>
          <div className="grid gap-2 border-y border-zinc-200 bg-white p-3 md:grid-cols-[minmax(220px,1fr)_150px_180px_130px]">
            <div className="flex h-9 min-w-0 items-center rounded-md border border-zinc-200 bg-white px-2 focus-within:border-emerald-500">
              <Search className="h-4 w-4 shrink-0 text-zinc-400" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') applySearch()
                }}
                placeholder="用户、功能、路径或 IP"
                className="min-w-0 flex-1 bg-transparent px-2 text-xs outline-none"
              />
              <button type="button" onClick={applySearch} aria-label="搜索日志" className="grid h-7 w-7 place-items-center rounded text-zinc-500 hover:bg-zinc-100">
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>
            <select
              value={actorType}
              onChange={(event) => { setPage(1); setActorType(event.target.value as AccessActorType | '') }}
              className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700 outline-none focus:border-emerald-500">
              <option value="">全部访问者</option>
              <option value="admin">管理员</option>
              <option value="user">用户</option>
              <option value="anonymous">未登录访客</option>
            </select>
            <select
              value={feature}
              onChange={(event) => { setPage(1); setFeature(event.target.value) }}
              className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700 outline-none focus:border-emerald-500">
              <option value="">全部功能</option>
              {features.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select
              value={result}
              onChange={(event) => { setPage(1); setResult(event.target.value as typeof result) }}
              className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700 outline-none focus:border-emerald-500">
              <option value="all">全部结果</option>
              <option value="success">成功</option>
              <option value="failed">失败</option>
            </select>
          </div>

          <section className="overflow-hidden border-y border-zinc-200 bg-white">
            <div className="hidden grid-cols-[170px_120px_minmax(150px,.8fr)_minmax(220px,1.4fr)_90px_90px] gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-[11px] font-medium text-zinc-500 md:grid">
              <div>访问时间</div><div>访问者</div><div>功能</div><div>行为</div><div>结果</div><div>耗时</div>
            </div>
            {error ? (
              <div className="flex items-start gap-2 bg-red-50 px-4 py-3 text-sm text-red-700">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />{error}
              </div>
            ) : null}
            {loading && logs.length === 0 ? (
              <div className="px-4 py-16 text-center text-sm text-zinc-500">正在加载访问日志...</div>
            ) : logs.length === 0 ? (
              <div className="px-4 py-16 text-center text-sm text-zinc-500">暂无符合条件的访问日志</div>
            ) : (
              <div className="divide-y divide-zinc-100">{logs.map((log) => <AccessLogRow key={log.id} log={log} />)}</div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 px-4 py-3 text-xs text-zinc-500">
              <span>共 {total} 条，第 {page} / {pageCount} 页</span>
              <div className="flex items-center gap-1">
                <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))} aria-label="上一页" className="grid h-8 w-8 place-items-center rounded-md border border-zinc-200 disabled:cursor-not-allowed disabled:text-zinc-300"><ChevronLeft className="h-4 w-4" /></button>
                <button type="button" disabled={page >= pageCount || loading} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} aria-label="下一页" className="grid h-8 w-8 place-items-center rounded-md border border-zinc-200 disabled:cursor-not-allowed disabled:text-zinc-300"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="overflow-hidden border-y border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-4 py-3"><h2 className="text-sm font-semibold text-zinc-950">活动任务事件</h2></div>
          {tasks.length === 0 ? (
            <div className="px-4 py-16 text-center text-sm text-zinc-500">当前没有可读取的任务事件</div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {tasks.map((task) => {
                const status = getTaskStatusDisplay(task)
                return (
                  <button key={task.id} type="button" onClick={() => onOpenTask(task)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50">
                    <ClipboardList className="h-4 w-4 shrink-0 text-zinc-400" />
                    <div className="min-w-0 flex-1">
                      <strong className="block truncate text-sm text-zinc-900">{getTaskTypeLabel(task.type)}</strong>
                      <span className="mt-0.5 block text-xs text-zinc-500">{formatBeijingDateTime(task.updatedAt)} · {task.completedCount}/{task.totalCount}</span>
                    </div>
                    <V2StatusBadge label={status.label} tone={status.tone} />
                  </button>
                )
              })}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

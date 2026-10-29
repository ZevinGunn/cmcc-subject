import {
  AlertTriangle, Boxes, CalendarClock, CheckCircle2, ChevronDown, ChevronUp,
  FileJson, Loader2, Pause, Play, RefreshCw, Search, Trash2, Upload, X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ApiClientError } from '../lib/api'
import {
  cancelRetailProductTask, createRetailProductSchedule as createRetailProductScheduleApi, createRetailProductTask,
  deleteRetailProduct, deleteRetailProductSchedule, listRetailProductSchedules,
  getRetailProductTask, listRetailProducts, listRetailProductTasks, queryRetailProduct, toggleRetailProductSchedule,
  type RetailProduct, type RetailProductQuerySchedule, type RetailProductQueryTask,
} from '../lib/retailProductApi'
import { cn } from '@/lib/utils'
import type { V2Account } from '../lib/types'

type View = 'query' | 'tasks' | 'products' | 'schedules'

function errorText(error: unknown): string {
  if (error instanceof ApiClientError) return `${error.message}${error.errorCode ? ` [${error.errorCode}]` : ''}`
  return error instanceof Error ? error.message : '请求失败'
}

function dateText(value?: string): string {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isFinite(date.getTime()) ? date.toLocaleString('zh-CN', { hour12: false }) : '-'
}

function taskTone(status: RetailProductQueryTask['status']): string {
  if (status === 'success') return 'bg-emerald-50 text-emerald-700'
  if (status === 'running' || status === 'pending') return 'bg-sky-50 text-sky-700'
  if (status === 'partial_success') return 'bg-amber-50 text-amber-800'
  return 'bg-red-50 text-red-700'
}

function statusLabel(status: string): string {
  return ({ pending: '等待中', running: '查询中', success: '已完成', partial_success: '部分成功', failed: '失败', cancelled: '已停止', found: '已发现', not_found: '不存在' } as Record<string, string>)[status] || status
}

export default function V2RetailProductQueryPage({ accounts }: { accounts: V2Account[] }) {
  const [view, setView] = useState<View>('query')
  const [singleCode, setSingleCode] = useState('')
  const [singleResult, setSingleResult] = useState<{ productCode: string; status: string; message: string; product?: Record<string, unknown> }>()
  const [inputType, setInputType] = useState<'codes' | 'range'>('codes')
  const [codesText, setCodesText] = useState('')
  const [rangeStart, setRangeStart] = useState('')
  const [rangeEnd, setRangeEnd] = useState('')
  const [executionMode, setExecutionMode] = useState<'sequential' | 'concurrent'>('sequential')
  const [intervalMs, setIntervalMs] = useState(1000)
  const [concurrency, setConcurrency] = useState(4)
  const [tasks, setTasks] = useState<RetailProductQueryTask[]>([])
  const [expandedTaskId, setExpandedTaskId] = useState('')
  const [products, setProducts] = useState<RetailProduct[]>([])
  const [productTotal, setProductTotal] = useState(0)
  const [productSearch, setProductSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<RetailProduct>()
  const [schedules, setSchedules] = useState<RetailProductQuerySchedule[]>([])
  const [scheduleForm, setScheduleForm] = useState({ name: '', startCode: '', endCode: '', runIntervalMinutes: 60 })
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const usableAccounts = useMemo(() => accounts.filter((account) => account.health.status !== 'disabled' && account.hasCookie), [accounts])
  const [accountId, setAccountId] = useState('')

  useEffect(() => {
    if (!usableAccounts.some((account) => account.id === accountId)) setAccountId(usableAccounts[0]?.id || '')
  }, [accountId, usableAccounts])

  const loadTasks = useCallback(async () => {
    const data = await listRetailProductTasks()
    setTasks(data.tasks)
  }, [])
  const loadProducts = useCallback(async (query = '') => {
    const data = await listRetailProducts(query)
    setProducts(data.products)
    setProductTotal(data.total)
  }, [])
  const loadSchedules = useCallback(async () => {
    const data = await listRetailProductSchedules()
    setSchedules(data.schedules)
  }, [])

  useEffect(() => {
    void Promise.all([loadTasks(), loadProducts(''), loadSchedules()]).catch((reason) => setError(errorText(reason)))
  }, [loadProducts, loadSchedules, loadTasks])

  useEffect(() => {
    if (!tasks.some((task) => task.status === 'pending' || task.status === 'running')) return undefined
    const timer = window.setInterval(() => void loadTasks().catch(() => undefined), 2000)
    return () => window.clearInterval(timer)
  }, [loadTasks, tasks])

  const codeCount = useMemo(() => new Set(codesText.split(/[\s,;，；]+/).filter(Boolean)).size, [codesText])

  async function run(action: string, task: () => Promise<void>) {
    setBusy(action)
    setError('')
    try { await task() } catch (reason) { setError(errorText(reason)) } finally { setBusy('') }
  }

  async function createRetailProductSchedule(input: Omit<Parameters<typeof createRetailProductScheduleApi>[0], 'accountId'>) {
    if (!accountId) throw new Error('请选择查询账号')
    return createRetailProductScheduleApi({ ...input, accountId })
  }

  async function importCodes(file?: File) {
    if (!file) return
    const content = await file.text()
    const importedCodes = content.match(/(?<!\d)\d{1,20}(?!\d)/g) || []
    if (importedCodes.length === 0) {
      setError('导入文件中没有找到 1-20 位数字 productCode')
      return
    }
    setError('')
    setCodesText((current) => [current, ...importedCodes].filter(Boolean).join('\n'))
  }

  async function toggleTaskDetails(task: RetailProductQueryTask) {
    if (expandedTaskId === task.id) {
      setExpandedTaskId('')
      return
    }
    setExpandedTaskId(task.id)
    try {
      const data = await getRetailProductTask(task.id)
      setTasks((current) => current.map((item) => item.id === task.id ? data.task : item))
    } catch (reason) {
      setError(errorText(reason))
    }
  }

  const views: Array<{ id: View; label: string; count?: number }> = [
    { id: 'query', label: '发起查询' }, { id: 'tasks', label: '任务队列', count: tasks.length },
    { id: 'products', label: '商品库', count: productTotal }, { id: 'schedules', label: '轮询计划', count: schedules.length },
  ]

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="text-xl font-semibold text-zinc-950">移动商城产品查询</h1><p className="mt-1 text-sm text-zinc-500">按 productCode 查询商品、扫描范围并管理已发现商品</p></div>
        <button type="button" title="刷新" onClick={() => void run('refresh', async () => { await Promise.all([loadTasks(), loadProducts(productSearch), loadSchedules()]) })} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium hover:bg-zinc-100">{busy === 'refresh' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}刷新</button>
      </header>

      <section className="border-y border-zinc-200 bg-white px-4 py-4 sm:px-5">
        <label className="block max-w-xl space-y-1.5"><span className="text-xs font-medium text-zinc-700">查询账号</span><select value={accountId} onChange={(event) => setAccountId(event.target.value)} disabled={usableAccounts.length === 0} className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm disabled:bg-zinc-100"><option value="">请选择包含 10086 CK 的账号</option>{usableAccounts.map((account) => <option key={account.id} value={account.id}>{account.displayPhone || account.phoneMasked} · {account.label} · CK</option>)}</select></label>
        <p className="mt-2 text-xs text-zinc-500">查询前自动校验 CK；失效时尝试通过云盘会话恢复并重新获取商城授权。</p>
      </section>

      <div role="tablist" aria-label="产品查询视图" className="inline-flex max-w-full overflow-x-auto rounded-md border border-zinc-300 bg-white p-1">
        {views.map((item) => <button key={item.id} type="button" role="tab" aria-selected={view === item.id} onClick={() => setView(item.id)} className={cn('h-8 whitespace-nowrap rounded px-3 text-xs font-medium', view === item.id ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:bg-zinc-100')}>{item.label}{item.count !== undefined ? ` ${item.count}` : ''}</button>)}
      </div>

      {error ? <div role="alert" className="flex items-start gap-2 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span className="break-words">{error}</span></div> : null}

      {view === 'query' ? <div className="space-y-5">
        <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
          <div className="flex items-center gap-2"><Search className="h-5 w-5 text-emerald-700" /><h2 className="text-sm font-semibold">单个产品查询</h2></div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label className="min-w-0 flex-1 space-y-1.5"><span className="text-xs font-medium text-zinc-700">productCode</span><input value={singleCode} onChange={(event) => setSingleCode(event.target.value.replace(/\D/g, '').slice(0, 20))} inputMode="numeric" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" /></label>
            <button type="button" disabled={!accountId || !/^\d{1,20}$/.test(singleCode) || Boolean(busy)} onClick={() => void run('single', async () => { const data = await queryRetailProduct(singleCode, accountId); setSingleResult(data.result); await loadProducts('') })} className="mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white disabled:opacity-50">{busy === 'single' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}查询并保存</button>
          </div>
          {singleResult ? <div className={cn('mt-4 border px-4 py-3', singleResult.status === 'found' ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50')}><div className="flex items-start gap-2">{singleResult.status === 'found' ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-700" /> : <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-700" />}<div className="min-w-0"><strong className="text-sm">{singleResult.productCode} · {singleResult.status === 'found' ? '已保存' : '商品不存在'}</strong><p className="mt-1 text-xs text-zinc-600">{singleResult.message}</p>{singleResult.product ? <p className="mt-1 text-xs text-zinc-600">{String(singleResult.product.productName || singleResult.product.name || '未命名商品')} · {Array.isArray(singleResult.product.norms) ? singleResult.product.norms.length : 0} 个档位</p> : null}</div></div></div> : null}
        </section>

        <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
          <div className="flex items-center gap-2"><Boxes className="h-5 w-5 text-sky-700" /><h2 className="text-sm font-semibold">批量与范围查询</h2></div>
          <div className="mt-4 inline-flex rounded-md border border-zinc-300 p-1">{(['codes', 'range'] as const).map((type) => <button key={type} type="button" onClick={() => setInputType(type)} className={cn('h-8 rounded px-3 text-xs font-medium', inputType === type ? 'bg-zinc-900 text-white' : 'text-zinc-600')}>{type === 'codes' ? '批量 code' : 'code 范围'}</button>)}</div>
          {inputType === 'codes' ? <div className="mt-4"><div className="mb-1.5 flex items-center justify-between"><span className="text-xs font-medium text-zinc-700">productCode 列表 · {codeCount} 个</span><label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-zinc-300 px-2.5 text-xs font-medium hover:bg-zinc-100"><Upload className="h-3.5 w-3.5" />导入 TXT/CSV<input type="file" accept=".txt,.csv,text/plain,text/csv" className="sr-only" onChange={(event) => { void importCodes(event.target.files?.[0]); event.currentTarget.value = '' }} /></label></div><textarea value={codesText} onChange={(event) => setCodesText(event.target.value)} rows={7} placeholder="每行一个 productCode，也支持逗号或空格分隔" className="w-full resize-y rounded-md border border-zinc-300 px-3 py-2 font-mono text-xs outline-none focus:border-emerald-600" /></div> : <div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">开始 code</span><input value={rangeStart} onChange={(event) => setRangeStart(event.target.value.replace(/\D/g, '').slice(0, 20))} inputMode="numeric" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" /></label><label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">结束 code</span><input value={rangeEnd} onChange={(event) => setRangeEnd(event.target.value.replace(/\D/g, '').slice(0, 20))} inputMode="numeric" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" /></label></div>}
          <div className="mt-4 grid gap-3 border-t border-zinc-100 pt-4 sm:grid-cols-3">
            <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">执行模式</span><select value={executionMode} onChange={(event) => setExecutionMode(event.target.value as 'sequential' | 'concurrent')} className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm"><option value="sequential">串行队列</option><option value="concurrent">并发异步</option></select></label>
            <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">查询间隔（毫秒）</span><input type="number" min={100} max={60000} value={intervalMs} onChange={(event) => setIntervalMs(Number(event.target.value))} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" /></label>
            <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">并发数</span><input type="number" min={2} max={10} disabled={executionMode === 'sequential'} value={executionMode === 'sequential' ? 1 : concurrency} onChange={(event) => setConcurrency(Number(event.target.value))} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm disabled:bg-zinc-100" /></label>
          </div>
          <div className="mt-4 flex justify-end"><button type="button" disabled={!accountId || Boolean(busy) || (inputType === 'codes' ? codeCount === 0 : !rangeStart || !rangeEnd)} onClick={() => void run('batch', async () => { const data = await createRetailProductTask({ inputType, productCodes: codesText, startCode: rangeStart, endCode: rangeEnd, executionMode, concurrency, intervalMs, accountId }); setTasks((current) => [data.task, ...current]); setView('tasks') })} className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white disabled:opacity-50">{busy === 'batch' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}创建查询任务</button></div>
        </section>
      </div> : null}

      {view === 'tasks' ? <section className="border-y border-zinc-200 bg-white">
        <div className="flex items-center justify-between px-4 py-4 sm:px-5"><div><h2 className="text-sm font-semibold">任务队列</h2><p className="mt-1 text-xs text-zinc-500">运行中任务每 2 秒刷新</p></div><button type="button" title="刷新任务" onClick={() => void run('tasks', loadTasks)} className="grid h-9 w-9 place-items-center rounded-md border border-zinc-300"><RefreshCw className="h-4 w-4" /></button></div>
        <div className="divide-y divide-zinc-100 border-t border-zinc-200">{tasks.length ? tasks.map((task) => { const expanded = expandedTaskId === task.id; const progress = task.totalCount ? Math.round(task.completedCount / task.totalCount * 100) : 0; return <div key={task.id} className="px-4 py-4 sm:px-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><button type="button" onClick={() => void toggleTaskDetails(task)} className="min-w-0 flex-1 text-left"><div className="flex flex-wrap items-center gap-2"><span className={cn('rounded px-2 py-1 text-[11px] font-semibold', taskTone(task.status))}>{statusLabel(task.status)}</span><strong className="text-sm text-zinc-900">{task.source === 'scheduled' ? '计划任务' : '手动任务'} · {task.executionMode === 'concurrent' ? `${task.concurrency} 并发` : '串行'}</strong>{expanded ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}</div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100"><div className="h-full bg-emerald-600" style={{ width: `${progress}%` }} /></div><p className="mt-1.5 text-xs text-zinc-500">{task.completedCount}/{task.totalCount} · 发现 {task.foundCount} · 不存在 {task.notFoundCount} · 失败 {task.failedCount}{task.currentCode ? ` · 当前 ${task.currentCode}` : ''}</p></button>{['pending', 'running'].includes(task.status) ? <button type="button" onClick={() => void run(`cancel-${task.id}`, async () => { await cancelRetailProductTask(task.id); await loadTasks() })} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-red-200 px-3 text-xs font-medium text-red-700"><Pause className="h-3.5 w-3.5" />停止</button> : null}</div>{expanded ? <div className="mt-4 max-h-80 overflow-auto border-t border-zinc-100 pt-3"><table className="w-full min-w-[620px] text-left text-xs"><thead className="text-zinc-500"><tr><th className="pb-2">productCode</th><th className="pb-2">状态</th><th className="pb-2">结果</th><th className="pb-2">完成时间</th></tr></thead><tbody className="divide-y divide-zinc-100">{task.items.map((item) => <tr key={item.id}><td className="py-2 font-mono">{item.productCode}</td><td className="py-2">{statusLabel(item.status)}</td><td className="max-w-md break-words py-2 text-zinc-600">{item.message || '-'}</td><td className="py-2 text-zinc-500">{dateText(item.finishedAt)}</td></tr>)}</tbody></table>{task.totalCount > task.items.length ? <p className="mt-3 text-xs text-zinc-500">仅显示前 {task.items.length} 条明细</p> : null}</div> : null}</div> }) : <p className="px-5 py-10 text-center text-sm text-zinc-500">暂无查询任务</p>}</div>
      </section> : null}

      {view === 'products' ? <section className="border-y border-zinc-200 bg-white">
        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-5"><div><h2 className="text-sm font-semibold">已保存商品</h2><p className="mt-1 text-xs text-zinc-500">共 {productTotal} 个商品</p></div><div className="flex gap-2"><input value={productSearch} onChange={(event) => setProductSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void run('products', () => loadProducts(productSearch)) }} placeholder="productCode 或商品名称" className="h-9 min-w-0 rounded-md border border-zinc-300 px-3 text-sm sm:w-72" /><button type="button" title="搜索" onClick={() => void run('products', () => loadProducts(productSearch))} className="grid h-9 w-9 place-items-center rounded-md bg-zinc-950 text-white"><Search className="h-4 w-4" /></button></div></div>
        <div className="overflow-x-auto border-t border-zinc-200"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-zinc-50 text-xs text-zinc-500"><tr><th className="px-5 py-3">productCode</th><th className="px-4 py-3">商品</th><th className="px-4 py-3">档位</th><th className="px-4 py-3">最后发现</th><th className="px-5 py-3 text-right">操作</th></tr></thead><tbody className="divide-y divide-zinc-100">{products.map((product) => <tr key={product.productCode}><td className="px-5 py-3 font-mono text-xs">{product.productCode}</td><td className="px-4 py-3"><strong className="block text-sm">{product.productName || '未命名商品'}</strong><span className="text-xs text-zinc-500">ID {product.productId || '-'}</span></td><td className="px-4 py-3">{product.normCount}</td><td className="px-4 py-3 text-xs text-zinc-500">{dateText(product.lastFoundAt)}</td><td className="px-5 py-3"><div className="flex justify-end gap-2"><button type="button" title="查看完整内容" onClick={() => setSelectedProduct(product)} className="grid h-8 w-8 place-items-center rounded-md border border-zinc-300"><FileJson className="h-4 w-4" /></button><button type="button" title="删除商品" onClick={() => { if (window.confirm(`删除商品 ${product.productCode}？`)) void run(`delete-${product.productCode}`, async () => { await deleteRetailProduct(product.productCode); await loadProducts(productSearch) }) }} className="grid h-8 w-8 place-items-center rounded-md border border-red-200 text-red-700"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table>{products.length === 0 ? <p className="py-10 text-center text-sm text-zinc-500">暂无已保存商品</p> : null}</div>
      </section> : null}

      {view === 'schedules' ? <div className="space-y-5"><section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5"><div className="flex items-center gap-2"><CalendarClock className="h-5 w-5 text-violet-700" /><h2 className="text-sm font-semibold">新建范围轮询计划</h2></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><label className="space-y-1.5"><span className="text-xs font-medium">计划名称</span><input value={scheduleForm.name} onChange={(event) => setScheduleForm((current) => ({ ...current, name: event.target.value }))} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" /></label><label className="space-y-1.5"><span className="text-xs font-medium">开始 code</span><input value={scheduleForm.startCode} onChange={(event) => setScheduleForm((current) => ({ ...current, startCode: event.target.value.replace(/\D/g, '').slice(0, 20) }))} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" /></label><label className="space-y-1.5"><span className="text-xs font-medium">结束 code</span><input value={scheduleForm.endCode} onChange={(event) => setScheduleForm((current) => ({ ...current, endCode: event.target.value.replace(/\D/g, '').slice(0, 20) }))} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" /></label><label className="space-y-1.5"><span className="text-xs font-medium">运行周期（分钟）</span><input type="number" min={1} max={43200} value={scheduleForm.runIntervalMinutes} onChange={(event) => setScheduleForm((current) => ({ ...current, runIntervalMinutes: Number(event.target.value) }))} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" /></label></div><div className="mt-4 grid gap-3 border-t border-zinc-100 pt-4 sm:grid-cols-3"><label className="space-y-1.5"><span className="text-xs font-medium">执行模式</span><select value={executionMode} onChange={(event) => setExecutionMode(event.target.value as 'sequential' | 'concurrent')} className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm"><option value="sequential">串行队列</option><option value="concurrent">并发异步</option></select></label><label className="space-y-1.5"><span className="text-xs font-medium">查询间隔（毫秒）</span><input type="number" min={100} max={60000} value={intervalMs} onChange={(event) => setIntervalMs(Number(event.target.value))} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" /></label><label className="space-y-1.5"><span className="text-xs font-medium">并发数</span><input type="number" min={2} max={10} disabled={executionMode === 'sequential'} value={executionMode === 'sequential' ? 1 : concurrency} onChange={(event) => setConcurrency(Number(event.target.value))} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm disabled:bg-zinc-100" /></label></div><div className="mt-4 flex justify-end"><button type="button" disabled={Boolean(busy) || !scheduleForm.name || !scheduleForm.startCode || !scheduleForm.endCode} onClick={() => void run('schedule-create', async () => { await createRetailProductSchedule({ name: scheduleForm.name, startCode: scheduleForm.startCode, endCode: scheduleForm.endCode, executionMode, concurrency, queryIntervalMs: intervalMs, runIntervalSec: scheduleForm.runIntervalMinutes * 60 }); setScheduleForm({ name: '', startCode: '', endCode: '', runIntervalMinutes: 60 }); await loadSchedules() })} className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white disabled:opacity-50">{busy === 'schedule-create' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarClock className="h-4 w-4" />}创建计划</button></div></section><section className="border-y border-zinc-200 bg-white"><div className="divide-y divide-zinc-100">{schedules.length ? schedules.map((schedule) => <div key={schedule.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-5"><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><strong className="text-sm">{schedule.name}</strong><span className={cn('rounded px-2 py-0.5 text-[11px]', schedule.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600')}>{schedule.enabled ? '已启用' : '已暂停'}</span></div><p className="mt-1 text-xs text-zinc-500">{schedule.startCode} - {schedule.endCode} · {schedule.executionMode === 'concurrent' ? `${schedule.concurrency} 并发` : '串行'} · 间隔 {schedule.queryIntervalMs}ms · 每 {Math.round(schedule.runIntervalSec / 60)} 分钟 · 下次 {dateText(schedule.nextRunAt)}</p></div><div className="flex gap-2"><button type="button" title={schedule.enabled ? '暂停计划' : '启用计划'} onClick={() => void run(`toggle-${schedule.id}`, async () => { await toggleRetailProductSchedule(schedule.id, !schedule.enabled); await loadSchedules() })} className="grid h-9 w-9 place-items-center rounded-md border border-zinc-300">{schedule.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</button><button type="button" title="删除计划" onClick={() => { if (window.confirm(`删除轮询计划“${schedule.name}”？`)) void run(`schedule-delete-${schedule.id}`, async () => { await deleteRetailProductSchedule(schedule.id); await loadSchedules() }) }} className="grid h-9 w-9 place-items-center rounded-md border border-red-200 text-red-700"><Trash2 className="h-4 w-4" /></button></div></div>) : <p className="px-5 py-10 text-center text-sm text-zinc-500">暂无轮询计划</p>}</div></section></div> : null}

      {selectedProduct ? <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-label="商品完整内容"><div className="flex max-h-[88vh] w-full max-w-4xl flex-col rounded-md bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3"><div><h2 className="text-sm font-semibold">{selectedProduct.productName || '商品详情'}</h2><p className="mt-0.5 font-mono text-xs text-zinc-500">{selectedProduct.productCode}</p></div><button type="button" title="关闭" onClick={() => setSelectedProduct(undefined)} className="grid h-8 w-8 place-items-center rounded-md hover:bg-zinc-100"><X className="h-4 w-4" /></button></div><pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words p-4 text-xs leading-6 text-zinc-700">{JSON.stringify(selectedProduct.content, null, 2)}</pre></div></div> : null}
    </div>
  )
}

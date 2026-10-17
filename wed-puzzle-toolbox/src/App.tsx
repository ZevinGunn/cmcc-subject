import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowRightLeft, Check, CircleHelp, Clipboard, Download, ListChecks, Loader2, Pause, Play, Plus, RefreshCw, Star, Trash2, X } from 'lucide-react'
import { ROUNDS, config, count, canDraw, ordinaryReady, type AccountView, type Plan } from '../shared/puzzle.js'
import { RelayPanel, type RelaySelection } from './RelayPanel.js'
import type { RelayPreview } from '../shared/relay.js'

type JobView = { id: string; kind: string; status: string; donors: string[]; to: string; round: number; mode: string; autoDraw: boolean; logs: { at: string; message: string }[]; transfersDone: number; drawDone: boolean; drawCount?: number; relayTargets?: string[]; relayCompleted?: string[]; relayStart?: number; relayEnd?: number; completedRounds?: number[]; tasksCompleted?: number; tasksUnconfirmed?: number; tasksFailed?: number; pending?: string; createdAt: string }
type ImportJob = { id: string; status: 'running' | 'completed' | 'interrupted'; total: number; processed: number; imported: number; updated: number; skipped: number; failed: number; results: { phone: string; status: string; message: string }[]; message?: string }
type State = { accounts: AccountView[]; jobs: JobView[]; busy: boolean; identity?: { key: string; kind: string; name: string }; importJob?: ImportJob }
type Task = { taskId: string; title: string; taskType?: string; status?: number; buttonText?: string; requireTimes?: number; completedTimes?: number; description?: string }
const EMPTY: State = { accounts: [], jobs: [], busy: false }
const mask = (p: string) => p.slice(0, 3) + '****' + p.slice(-4)
const statusNames: Record<string, string> = { running: '执行中', paused: '已暂停', completed: '已完成', stopped: '已结束' }
const jobStatus = (j: JobView) => j.kind === 'daily' && j.status === 'completed' ? '处理结束' : statusNames[j.status]
async function api<T>(path: string, data?: unknown, method = 'POST'): Promise<T> {
  const r = await fetch(`${import.meta.env.BASE_URL}api${path}`, { method, headers: { 'Content-Type': 'application/json', 'X-Wed-Toolbox': '1' }, body: method === 'GET' || method === 'DELETE' ? undefined : JSON.stringify(data), signal: AbortSignal.timeout(90000) })
  let value
  try { value = await r.json() } catch { throw new Error('工具服务未就绪，请稍后重试') }
  if (r.status === 401 || r.status === 403) window.dispatchEvent(new CustomEvent('wed-access-denied', { detail: { status: r.status, message: value.message } }))
  if (!r.ok || !value.ok) throw new Error(value.message || '操作失败')
  return value as T
}
export function Modal({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null), callback = useRef(close); callback.current = close
  useEffect(() => { const trigger = document.activeElement as HTMLElement | null; ref.current?.showModal(); return () => { ref.current?.close(); trigger?.focus() } }, [])
  return <dialog ref={ref} onCancel={e => { e.preventDefault(); callback.current() }} onClick={e => { if (e.target === e.currentTarget) callback.current() }}><div className="dialog-head"><h2>{title}</h2><button className="icon" type="button" aria-label="关闭弹窗" onClick={close}><X size={19} /></button></div><div className="dialog-body">{children}</div></dialog>
}
export function Pieces({ account, round }: { account: AccountView; round: number }) {
  const c = config(round)
  if (!account.info) return <span className="muted">待查询</span>
  try {
    return <div className="pieces" aria-label={`${c.label}拼图库存`}>{Array.from({ length: c.size }, (_, i) => {
      const n = count(account.info, round, i)
      return <span className={n === 0 ? 'piece rare' : 'piece'} key={i} title={`${c.label} ${i + 1} 号${n === 0 ? '（缺失）' : ''}`}><small>{n === 0 && <Star size={9} />}{i + 1}</small><b>{n}</b></span>
    })}</div>
  } catch { return <span className="muted">库存格式异常</span> }
}
function MessageToast({ text, error, close }: { text: string; error: boolean; close: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    // A manual popover shares the browser's top layer with dialogs, keeping messages visible during login.
    if (el && 'showPopover' in el) { el.setAttribute('popover', 'manual'); el.showPopover(); return () => { if (el.matches(':popover-open')) el.hidePopover() } }
  }, [])
  return <div ref={ref} className={`toast ${error ? 'toast-error' : ''}`} role={error ? 'alert' : 'status'}><span>{text}</span><button className="icon" aria-label="关闭消息" onClick={close}><X size={16} /></button></div>
}
export function App() {
  const [access, setAccess] = useState<{ status: number; message: string } | null>(null)
  const blocked = useRef(false), owner = useRef('')
  const [state, setState] = useState<State>(EMPTY), [tab, setTab] = useState('pool'), [selected, setSelected] = useState<string[]>([])
  const [recipient, setRecipient] = useState(''), [round, setRound] = useState(1), [mode, setMode] = useState<'fill' | 'all'>('all'), [draw, setDraw] = useState(true)
  const [autoAdvance, setAutoAdvance] = useState(true), [fastTasks, setFastTasks] = useState(true)
  const taskRequest = useRef(0), lastTaskRefresh = useRef('')
  const [busy, setBusy] = useState(false), [loaded, setLoaded] = useState(false), [notice, setNotice] = useState<{ text: string; error: boolean } | null>(null)
  const [login, setLogin] = useState(false), [loginMode, setLoginMode] = useState('sms'), [phone, setPhone] = useState(''), [code, setCode] = useState(''), [input, setInput] = useState('')
  const [smsUntil, setSmsUntil] = useState<Record<string, number>>({}), [now, setNow] = useState(Date.now()), [sending, setSending] = useState(false)
  const [plan, setPlan] = useState<Plan | null>(null), [confirm, setConfirm] = useState<{ title: string; content: ReactNode; run: () => Promise<void> } | null>(null)
  const [receiveOpen, setReceiveOpen] = useState(false), [links, setLinks] = useState(''), [help, setHelp] = useState(false)
  const [importOpen, setImportOpen] = useState(false), importNotice = useRef('')
  const [taskAccount, setTaskAccount] = useState(''), [tasks, setTasks] = useState<Task[]>([]), [activeJob, setActiveJob] = useState('')
  const mounted = useRef(true), smsRef = useRef(false), actionRef = useRef(false), pendingRequest = useRef<{ signature: string; id: string } | null>(null)
  const toast = (text: string, error = false) => setNotice({ text, error })
  const absorb = (s: State) => {
    if (blocked.current) return
    if (owner.current && s.identity?.key && owner.current !== s.identity.key) { window.location.reload(); return }
    owner.current = s.identity?.key || owner.current
    setState(s); setLoaded(true); setSelected(ids => { const next = ids.filter(id => s.accounts.some(a => a.id === id)); return next.length === ids.length ? ids : next })
  }
  useEffect(() => {
    const deny = (event: Event) => {
      blocked.current = true; setAccess((event as CustomEvent).detail); setState(EMPTY); setSelected([]); setRecipient(''); setPlan(null); setTasks([]); setLogin(false); setReceiveOpen(false); setImportOpen(false); setConfirm(null); setCode(''); setInput(''); setLinks('')
    }
    window.addEventListener('wed-access-denied', deny)
    return () => window.removeEventListener('wed-access-denied', deny)
  }, [])
  useEffect(() => {
    mounted.current = true
    let running = false
    const refresh = async () => {
      if (running || blocked.current) return
      running = true
      try { const s = await api<State>('/state', undefined, 'GET'); if (mounted.current) absorb(s) } catch (e) { if (mounted.current) { setLoaded(true); setNotice({ text: (e as Error).message, error: true }) } } finally { running = false }
    }
    void refresh(); const id = window.setInterval(refresh, 2500)
    return () => { mounted.current = false; clearInterval(id) }
  }, [])
  useEffect(() => { if (!notice) return; const id = window.setTimeout(() => setNotice(null), notice.error ? 10000 : 4500); return () => clearTimeout(id) }, [notice])
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 500); return () => clearInterval(id) }, [])
  useEffect(() => { setPlan(null) }, [selected, recipient, round, mode, draw, autoAdvance])
  useEffect(() => { if (recipient && !state.accounts.some(a => a.id === recipient)) setRecipient('') }, [state.accounts, recipient])
  useEffect(() => {
    if (taskAccount && !state.accounts.some(a => a.id === taskAccount)) { ++taskRequest.current; setTaskAccount(''); setTasks([]) }
  }, [state.accounts, taskAccount])
  const working = busy || state.busy || !loaded, donors = selected.filter(id => id !== recipient), unfinished = state.jobs.find(j => ['running', 'paused'].includes(j.status))
  const seconds = Math.max(0, Math.ceil(((smsUntil[phone] || 0) - now) / 1000)), c = config(round)
  const job = state.jobs.find(j => j.id === activeJob) || state.jobs[0]
  const targetAccount = state.accounts.find(a => a.id === recipient)
  let targetCanDraw = false
  try { targetCanDraw = !!targetAccount?.info && !targetAccount.error && ordinaryReady(targetAccount.info, round) && canDraw(targetAccount.info, round) } catch { /* Invalid inventory disables mutations. */ }
  const operate = async (fn: () => Promise<void>) => {
    if (actionRef.current) return
    actionRef.current = true; setBusy(true)
    try { await fn() } catch (error) { toast(error instanceof Error ? error.message : '操作失败', true) } finally { actionRef.current = false; setBusy(false) }
  }
  const createJob = async (data: Record<string, unknown>) => {
    const signature = JSON.stringify(data)
    if (pendingRequest.current?.signature !== signature) pendingRequest.current = { signature, id: crypto.randomUUID() }
    let s: State
    try { s = await api<State>('/jobs', { requestId: pendingRequest.current!.id, donors: [], to: '', round: 1, ...data }) } catch (error) { if (String(error).includes('库存已变化')) setPlan(null); throw error }
    pendingRequest.current = null; absorb(s); setTab('queue'); setActiveJob(s.jobs[0]?.id || ''); toast('已加入串行队列')
  }
  const refreshAccounts = (ids: string[]) => operate(async () => { absorb(await api<State>('/accounts/refresh', { ids })); setPlan(null); toast('库存刷新完成；失败号码已保留上次结果') })
  const loadTasks = (id: string) => {
    if (actionRef.current || blocked.current) return Promise.resolve()
    const request = ++taskRequest.current
    return operate(async () => { const r = await api<{ tasks: Task[] }>(`/accounts/${id}/tasks`, undefined, 'GET'); if (request === taskRequest.current && !blocked.current) setTasks(r.tasks) })
  }
  const startDaily = (ids: string[], taskFilter?: string[]) => setConfirm({
    title: taskFilter ? '执行单项任务' : '完成号码任务',
    content: <><p>{ids.length === 1 ? mask(state.accounts.find(a => a.id === ids[0])!.phone) : `${ids.length} 个号码`}，{taskFilter ? '执行选定任务' : '依次完成全部可执行任务'}。</p><p>{fastTasks ? '快速上报：获取参数后立即尝试提交。' : '按接口倒计时上报。'}邀请、充值任务直接尝试上报；每次提交后核验，接口拒绝或未确认会单独记录。</p></>,
    run: () => createJob({ kind: 'daily', donors: ids, taskFilter, fastTasks }),
  })
  useEffect(() => {
    const latest = state.jobs[0]
    if (tab !== 'daily' || !taskAccount || state.busy || busy || actionRef.current || latest?.kind !== 'daily' || !['completed', 'stopped'].includes(latest.status)) return
    const key = `${latest.id}:${taskAccount}`
    if (lastTaskRefresh.current === key) return
    lastTaskRefresh.current = key; void loadTasks(taskAccount)
  }, [tab, taskAccount, state.jobs, state.busy, busy])
  const prepareTransfer = () => operate(async () => {
    const r = await api<State & { plan: Plan }>('/plan', { donors, to: recipient, round, mode, autoAdvance }); absorb(r); setPlan(r.plan)
    if (r.plan.reason) toast(r.plan.reason, true)
    else toast(`已核对 ${donors.length} 个赠送号码，计划转赠 ${r.plan.total} 张`)
  })
  const acceptTransfer = () => {
    if (!plan) return
    setConfirm({ title: '确认执行互赠', content: <><p>{donors.length} 个号码 → {mask(state.accounts.find(a => a.id === recipient)!.phone)}</p><p>从{c.label}开始，本档计划转赠 {plan.total} 张，每种保留 1 张。{draw ? '只缺一张且其他每种至少 11 张时，按官方资格抽取一次。' : '只转赠，不抽取。'}</p>{autoAdvance && <p>已完成的档位跳过。当前档完成后继续下一档，直至 8 折；必要时自动领取前一档券来解锁，下一档按实时库存重新计算可转余图。</p>}{!!plan.shortages.length && <p>库存不足：{plan.shortages.map(p => `${Number(p.piece.split('_')[1]) + 1} 号缺 ${p.need} 张`).join('、')}</p>}</>, run: async () => createJob({ kind: 'transfer', donors, to: recipient, round, mode, autoDraw: draw, autoAdvance, expectedTransfers: plan.transfers }) })
  }
  const confirmRelay = (selection: RelaySelection, result: RelayPreview) => setConfirm({
    title: '确认号池接力',
    content: <><p>本次固定 {selection.scope.length} 个号池号码，帮助 {selection.targets.length} 个目标完成{config(selection.start).label}至{config(selection.end).label}。</p><p>优先直接转赠补齐；否则将其他每种补至 11 张后按官方资格抽一次。每种留 1 张，完成号码的余图继续给下一个目标。</p><p>库存共享，逐号评估不代表所有目标都能完成。条件不足先等待，全部目标无可执行方案时暂停。需要跨档解锁时自动领取前一档券，最后一档券不自动领取。</p><p>未抽到缺图或结果不明立即暂停，不自动重抽。新号码不会自动加入本次队列。</p></>,
    run: () => createJob({ kind: 'relay', donors: selection.scope, relayTargets: selection.targets, round: selection.start, relayEnd: selection.end, expectedRevision: result.revision }),
  })
  const selectAll = () => setSelected(selected.length === state.accounts.length ? [] : state.accounts.map(a => a.id))
  const toggle = (id: string) => setSelected(ids => ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id])
  const sms = async () => {
    if (smsRef.current || seconds > 0) return
    smsRef.current = true; setSending(true)
    const sentPhone = phone
    try { const r = await api<{ cooldownSeconds: number }>('/auth/sms', { phone: sentPhone }); setSmsUntil(v => ({ ...v, [sentPhone]: Date.now() + r.cooldownSeconds * 1000 })); toast('验证码已发送') } catch (error) { toast((error as Error).message, true) } finally { smsRef.current = false; setSending(false) }
  }
  const loginSubmit = () => operate(async () => {
    const s = await api<State>(loginMode === 'sms' ? '/auth/login' : '/auth/import', loginMode === 'sms' ? { phone, code } : { phone, input }); absorb(s); setLogin(false); setCode(''); setInput(''); setPlan(null); const account = s.accounts.find(a => a.phone === phone); toast(account?.error ? `登录成功，库存查询失败：${account.error}` : '账号已加入，三档拼图库存已查询', !!account?.error)
  })
  const importAccounts = () => operate(async () => {
    const s = await api<State>('/accounts/import-cookieapp'); absorb(s); setPlan(null); setImportOpen(true); toast('已开始逐个导入有效账号')
  })
  useEffect(() => {
    const job = state.importJob
    if (!job || job.status === 'running' || importNotice.current === job.id || !importOpen) return
    importNotice.current = job.id
    toast(job.message || `导入完成：新增 ${job.imported}，更新 ${job.updated}，跳过 ${job.skipped}，失败 ${job.failed}`, job.status === 'interrupted' || job.failed > 0)
  }, [state.importJob, importOpen])
  if (access) return <div className="app-shell"><header className="app-head"><div className="brand"><img className="brand-logo" src={`${import.meta.env.BASE_URL}brand/cmcc/logo.png`} alt="中国移动" width={36} height={36} draggable={false} /><h1>周三拼图互助</h1></div></header><main className="empty"><h2>{access.status === 401 ? '登录后使用工具箱' : '需要权益活动权限'}</h2><div className="head-actions"><a href="/public">用户登录</a><a href="/admin-login">管理员登录</a><button onClick={() => window.location.reload()}>重新检查</button></div></main>{notice && <MessageToast text={notice.text} error={notice.error} close={() => setNotice(null)} />}</div>
  return <div className="app-shell">
    <header className="app-head"><div className="brand"><img className="brand-logo" src={`${import.meta.env.BASE_URL}brand/cmcc/logo.png`} alt="中国移动" width={36} height={36} draggable={false} /><div><h1>周三拼图互助</h1><span>互赠 · 接收 · 抽图 · 每日任务</span></div></div><div className="head-actions"><button className="icon" title="使用说明" aria-label="使用说明" onClick={() => setHelp(true)}><CircleHelp size={19} /></button><button onClick={() => void importAccounts()} disabled={working}>{state.importJob?.status === 'running' ? <Loader2 size={16} className="spinning" /> : <Download size={16} />}一键导入 cookie-app</button><button className="primary" onClick={() => setLogin(true)} disabled={working}><Plus size={16} /> 添加号码</button></div></header>
    <nav className="tabs" aria-label="工具导航">{[['pool', '号码池'], ['relay', '号池接力'], ['daily', '每日任务'], ['queue', '任务队列']].map(([key, name]) => <button key={key} aria-current={tab === key ? 'page' : undefined} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>{name}{key === 'pool' && <small>{state.accounts.length}</small>}{key === 'queue' && unfinished?.status === 'running' && <span className="dot" />}</button>)}</nav>
    <main>
    {state.importJob && <div className="import-status" aria-live="polite"><span>{state.importJob.status === 'running' ? `正在导入 ${state.importJob.processed} / ${state.importJob.total}` : state.importJob.status === 'interrupted' ? '导入已中断' : '账号导入完成'} · 新增 {state.importJob.imported} · 更新 {state.importJob.updated} · 跳过 {state.importJob.skipped} · 失败 {state.importJob.failed}</span><button className="text-button" onClick={() => setImportOpen(true)}>查看导入结果</button></div>}
    {tab === 'pool' && <div className="workspace"><section className="pool"><div className="section-head"><div><h2>号码与拼图库存</h2><span className="muted">已选 {selected.length} 个 · 缺失图 <Star size={11} /></span></div><button title="刷新全部库存" disabled={working || !state.accounts.length} onClick={() => refreshAccounts(state.accounts.map(a => a.id))}><RefreshCw size={15} className={working ? 'spinning' : ''} /> 刷新</button></div>
      {!loaded ? <div className="empty"><Loader2 size={24} className="spinning" /> 正在读取号码池</div> : !state.accounts.length ? <div className="empty"><ArrowRightLeft size={30} /><h3>添加参与活动的号码</h3><p>一键导入 cookie-app 有效账号，或使用验证码、App CK 添加号码。</p><button onClick={() => setLogin(true)}>添加号码</button></div> : <><div className="table-head"><label><input type="checkbox" aria-label="全选号码" checked={selected.length === state.accounts.length && selected.length > 0} onChange={selectAll} /> 全选</label><span>95 折 / 4 张</span><span>9 折 / 6 张</span><span>8 折 / 9 张</span></div><div className="account-list">{state.accounts.map(a => <article className={`account-row ${selected.includes(a.id) ? 'selected' : ''}`} key={a.id}><div className="identity"><label><input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggle(a.id)} aria-label={`选择${mask(a.phone)}`} /><b>{mask(a.phone)}</b></label><div className="account-meta"><span>{a.source === 'cookieapp' ? 'cookie-app' : a.source === 'sms' ? '短信登录' : 'App CK'}</span><span>{a.info?.drawTimes ?? '—'} 次抽图</span></div><div className="row-tools"><button className="icon" aria-label={`刷新${mask(a.phone)}`} title="刷新库存" disabled={working} onClick={() => refreshAccounts([a.id])}><RefreshCw size={13} /></button><button className="icon" title="移除此号码" aria-label={`移除${mask(a.phone)}`} disabled={working} onClick={() => setConfirm({ title: '移除号码', content: <p>移除 {mask(a.phone)} 的本地登录凭证和库存记录。</p>, run: async () => { absorb(await api<State>(`/accounts/${a.id}`, undefined, 'DELETE')); toast('号码已移除') } })}><Trash2 size={13} /></button><time title={a.updatedAt}>{new Date(a.updatedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</time></div>{a.error && <button className="error-label" onClick={() => toast(a.error!, true)}>查询失败 · 查看原因</button>}</div>{ROUNDS.map(r => <div className="tier" key={r.round}><span className="mobile-tier">{r.label}</span><Pieces account={a} round={r.round} /></div>)}</article>)}</div></>}
    </section><aside className="transfer-panel">
      <h2>批量互赠 + 抽图</h2>
      <label>接收号码<select aria-label="接收号码" value={recipient} disabled={working} onChange={e => { setRecipient(e.target.value); setSelected(e.target.value ? state.accounts.filter(a => a.id !== e.target.value).map(a => a.id) : []) }}><option value="">选择接收号码</option>{state.accounts.map(a => <option key={a.id} value={a.id}>{mask(a.phone)}</option>)}</select></label>
      <label>起始档位<select aria-label="转赠档位" value={round} disabled={working} onChange={e => setRound(Number(e.target.value))}>{ROUNDS.map(r => <option value={r.round} key={r.round}>{r.label}拼图</option>)}</select></label>
      <fieldset><legend>转赠范围</legend><label className="check-label"><input type="radio" name="mode" checked={mode === 'all'} onChange={() => setMode('all')} /> 全部余图</label><label className="check-label"><input type="radio" name="mode" checked={mode === 'fill'} onChange={() => setMode('fill')} /> 按缺口补齐到 11 张</label></fieldset>
      <label className="check-label"><input type="checkbox" checked={draw} onChange={e => setDraw(e.target.checked)} /> 达标后抽取缺失拼图</label>
      <label className="check-label"><input type="checkbox" checked={autoAdvance} onChange={e => setAutoAdvance(e.target.checked)} /> 自动完成后续档位</label>
      <div className="rule-line">只缺 1 张 · 其他每种 ≥ 11 张 · 赠送方各留 1 张</div>
      <div className="transfer-summary"><span>赠送号码</span><b>{donors.length} 个</b><span>处理档位</span><b>{autoAdvance ? `${c.label} → 8 折` : c.label}</b>{plan && <><span>本档计划转赠</span><b>{plan.total} 张</b><span>当前缺图</span><b>{plan.missing?.length ? plan.missing.map(i => i + 1).join('、') + ' 号' : '已集齐'}</b><span>抽图资格</span><b>{plan.ready && plan.canDraw ? '已达标' : '转赠后复查'}</b></>}</div>
      {!!plan?.shortages.length && <div className="shortage"><span>库存缺口</span>{plan.shortages.map(x => <div key={x.piece}><span>{Number(x.piece.split('_')[1]) + 1} 号</span><b>{x.need} 张</b></div>)}</div>}
      <button className="wide" disabled={working || !donors.length || !recipient || !!unfinished} onClick={prepareTransfer}><RefreshCw size={15} /> 核对库存与预览</button>
      <button className="primary wide" disabled={working || !plan || !!plan.reason || !!unfinished} onClick={acceptTransfer}><Play size={15} /> 执行互赠{draw ? '与抽图' : ''}</button>
      <div className="secondary-actions">
        <button disabled={working || !targetCanDraw || !!unfinished} onClick={() => setConfirm({ title: '达标抽取一次', content: <p>为 {targetAccount ? mask(targetAccount.phone) : ''} 抽取一次{c.label}拼图。提交前再次核对只缺一张、其他每种至少 11 张和官方资格。</p>, run: () => createJob({ kind: 'draw', to: recipient, round, autoDraw: true }) })}>达标抽一次</button>
        <button disabled={working || !recipient || !!unfinished} onClick={() => setReceiveOpen(true)}>接收外部链接</button>
        <button disabled={working || !recipient || !!unfinished} onClick={() => setConfirm({ title: `领取${c.label}券`, content: <p>为 {targetAccount ? mask(targetAccount.phone) : ''} 提交领券，仅在官方允许时执行。</p>, run: () => createJob({ kind: 'redeem', to: recipient, round }) })}>领券 / 解锁下一档</button>
      </div>{unfinished && <button className="text-button" onClick={() => setTab('queue')}>查看未结束的任务 <ArrowRightLeft size={13} /></button>}
    </aside></div>}
    {tab === 'queue' && job?.kind === 'relay' && <div className="relay-actions" aria-label="接力进度"><span>号池接力 · 已完成档位 {job.relayCompleted?.length || 0} / {(job.relayTargets?.length || 0) * ((job.relayEnd || 1) - (job.relayStart || 1) + 1)}</span>{job.to && <span>当前接收 {mask(state.accounts.find(a => a.id === job.to)?.phone || '')}</span>}</div>}
    {tab === 'relay' && <RelayPanel accounts={state.accounts} selected={selected} working={working} unfinished={!!unfinished} notify={toast} queue={() => setTab('queue')} confirm={confirmRelay} preview={async selection => { const s = await api<State & { relay: RelayPreview }>('/relay/preview', selection); absorb(s); return s.relay }} />}
    {tab === 'daily' && <section className="daily">
      <div className="section-head"><div><h2>每日拼图任务</h2><span className="muted">逐一上报 · 结果复核 · 不并发执行</span></div>
        <div className="daily-actions"><button disabled={working || !selected.length || !!unfinished} onClick={() => startDaily(selected)}>执行已选 {selected.length} 个号码</button>
        <button className="primary" disabled={working || !state.accounts.length || !!unfinished} onClick={() => startDaily(state.accounts.map(a => a.id))}><ListChecks size={16} /> 一键完成全部号码</button></div>
      </div>
      <div className="daily-pool"><label className="check-label"><input type="checkbox" aria-label="每日任务全选号码" checked={selected.length === state.accounts.length && selected.length > 0} disabled={working} onChange={selectAll} /> 全选号码</label>
        {state.accounts.map(a => <label className="check-label" key={a.id}><input type="checkbox" checked={selected.includes(a.id)} disabled={working} onChange={() => toggle(a.id)} aria-label={`任务选择${mask(a.phone)}`} />{mask(a.phone)}</label>)}
      </div>
      <label className="check-label"><input type="checkbox" checked={fastTasks} disabled={working} onChange={e => setFastTasks(e.target.checked)} /> 快速上报（不增加本地等待）</label>
      {unfinished && <button className="text-button" onClick={() => setTab('queue')}>查看未结束的任务 <ArrowRightLeft size={13} /></button>}
      <div className="daily-selector"><label>查询号码<select aria-label="查询号码" value={taskAccount} disabled={working} onChange={e => { if (e.target.value === taskAccount) return; ++taskRequest.current; setTaskAccount(e.target.value); setTasks([]); if (e.target.value) void loadTasks(e.target.value) }}><option value="">选择号码</option>{state.accounts.map(a => <option value={a.id} key={a.id}>{mask(a.phone)}</option>)}</select></label>
        <button disabled={working || !taskAccount} onClick={() => loadTasks(taskAccount)}><RefreshCw size={15} /> 查询任务</button>
        <button disabled={working || !taskAccount || !!unfinished} onClick={() => startDaily([taskAccount])}>完成当前号码任务</button>
      </div>
      {tasks.length ? <div className="task-list">{tasks.map(t => <article key={t.taskId}><div><h3>{t.title}</h3><p>{t.description || `任务 ${t.taskId}`}</p></div><span className="muted">类型 {t.taskType || '未知'}</span><span>{t.completedTimes !== undefined ? `${t.completedTimes}/${t.requireTimes ?? '—'}` : '—'}</span>
        {t.status === 0 && ['1','2','3','4','5','6'].includes(t.taskType || '') ? <button className="task-run" aria-label={`执行${t.title}`} title={t.buttonText} disabled={working || !!unfinished} onClick={() => startDaily([taskAccount], [t.taskId])}>执行任务</button> : <span className="muted">{t.buttonText || '当前不可执行'}</span>}
      </article>)}</div> : <div className="empty"><ListChecks size={27} /><p>{taskAccount ? '查询该号码的最新任务列表' : '选择号码查看任务，或一键处理全部号码'}</p></div>}
    </section>}
    {tab === 'queue' && <section className="queue"><div className="section-head"><div><h2>串行任务队列</h2><span className="muted">生成链接 → 接收 → 库存核验 → 下一个</span></div>{job && <select className="history-select" aria-label="选择历史任务" value={job.id} onChange={e => setActiveJob(e.target.value)}>{state.jobs.map(j => <option key={j.id} value={j.id}>{new Date(j.createdAt).toLocaleString('zh-CN')} · {jobStatus(j)}</option>)}</select>}</div>{!job ? <div className="empty"><Check size={27} /><p>还没有任务记录</p></div> : <><div className="job-summary"><span className={`job-status ${job.status}`}>{jobStatus(job)}</span><span>已转赠 / 接收 <b>{job.transfersDone}</b> 张</span><span>已抽图 <b>{job.drawCount ?? (job.drawDone ? 1 : 0)}</b> 次</span><span>当前档位 <b>{config(job.round).label}</b></span>{job.kind === 'daily' && <><span>已核验 <b>{job.tasksCompleted || 0}</b> 次</span><span>待确认 <b>{job.tasksUnconfirmed || 0}</b> 项</span><span>未通过 <b>{job.tasksFailed || 0}</b> 项</span></>}<div className="job-actions">{job.status === 'running' && <button onClick={() => operate(async () => { absorb(await api<State>(`/jobs/${job.id}/pause`)); toast('将在当前操作核验后暂停') })}><Pause size={15} /> 暂停</button>}{job.status === 'paused' && <><button className="primary" disabled={working} onClick={() => operate(async () => { absorb(await api<State>(`/jobs/${job.id}/resume`)); toast('已继续，先核对上次操作') })}><Play size={15} /> 继续 / 核验</button><button disabled={working} onClick={() => setConfirm({ title: '结束任务', content: <p>已完成操作不撤销。未确认的转赠、领取或抽图不会自动重试。确认核对官方记录后结束此任务。</p>, run: async () => { absorb(await api<State>(`/jobs/${job.id}/finish`)); toast('任务已结束') } })}>结束任务</button></>}{job.pending && <button disabled={busy} onClick={() => operate(async () => { const r = await api<{ link: string }>(`/jobs/${job.id}/pending-link`, undefined, 'GET'); await navigator.clipboard.writeText(r.link); toast('未确认转赠的原始链接已复制') })}><Clipboard size={15} /> 原转赠链接</button>}</div></div><ol className="logs" aria-live="polite">{job.logs.map((l, i) => <li key={i}><time>{new Date(l.at).toLocaleTimeString('zh-CN')}</time><span>{l.message}</span></li>)}</ol></>}</section>}
    </main><footer>独立账号库 · 本机加密保存 · 单任务串行执行</footer>
    {notice && <MessageToast text={notice.text} error={notice.error} close={() => setNotice(null)} />}
    {login && <Modal title="添加参与号码" close={() => { setLogin(false); setCode(''); setInput('') }}><div className="segmented">{[['sms', '验证码登录'], ['app', '导入 App CK']].map(([key, name]) => <button className={loginMode === key ? 'active' : ''} key={key} onClick={() => setLoginMode(key)}>{name}</button>)}</div><form onSubmit={e => { e.preventDefault(); void loginSubmit() }}><label>手机号<input type="tel" autoComplete="tel" inputMode="numeric" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="11 位手机号" required /></label>{loginMode === 'sms' ? <><label>短信验证码<div className="code-row"><input value={code} inputMode="numeric" autoComplete="one-time-code" onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6 位验证码" required /><button type="button" disabled={sending || seconds > 0 || working || phone.length !== 11} onClick={() => void sms()}>{sending ? '发送中…' : seconds > 0 ? `${seconds}s 后重发` : '发送验证码'}</button></div></label><p className="hint">使用 10086 网页短信登录，不生成原生 App 凭证。</p></> : <><label>App CK / 活动 Cookie / 登录 JSON<textarea rows={6} value={input} onChange={e => setInput(e.target.value)} placeholder="HLWHD_SESSION_TOKEN=…; 或包含 token、sid 的 App 登录 JSON" required spellCheck={false} autoComplete="off" /></label><p className="hint">原生 App 的 JSESSIONID 单独不能登录活动。支持活动页完整 Cookie，或包含 token + sid 的登录数据。</p></>}<div className="dialog-actions"><button type="button" onClick={() => { setLogin(false); setInput(''); setCode('') }}>取消</button><button className="primary" disabled={busy || state.busy || phone.length !== 11 || (loginMode === 'sms' ? code.length !== 6 : !input.trim())} type="submit">{busy ? <Loader2 size={15} className="spinning" /> : <Plus size={15} />}{loginMode === 'sms' ? '登录并查询拼图' : '导入并查询拼图'}</button></div></form></Modal>}
    {receiveOpen && <Modal title="批量接收转赠链接" close={() => setReceiveOpen(false)}><form onSubmit={e => { e.preventDefault(); setConfirm({ title: '确认逐一接收', content: <p>为 {mask(state.accounts.find(a => a.id === recipient)!.phone)} 接收 {links.split('\n').filter(l => l.trim()).length} 个转赠链接。重复链接自动去重，一张领取并核验后再处理下一张。</p>, run: async () => { await createJob({ kind: 'receive', to: recipient, links: links.split('\n').map(l => l.trim()).filter(Boolean) }); setReceiveOpen(false); setLinks('') } }) }}><label>转赠链接（每行一个）<textarea rows={8} value={links} onChange={e => setLinks(e.target.value)} placeholder="https://wx.10086.cn/…?giveCard=…" required /></label><div className="dialog-actions"><button type="button" onClick={() => setReceiveOpen(false)}>取消</button><button className="primary" disabled={!links.trim() || working}>逐一接收</button></div></form></Modal>}
    {help && <Modal title="使用说明" close={() => setHelp(false)}><div className="help">
      <p>“号池接力”可选择参与号池及多个目标、指定优先接收号码。先直接补缺图；无法直接补齐时再筹到只缺一张、其他每种 11 张后抽一次。已完成号码留每种 1 张，余图继续帮助下一个目标；每轮实时重算，条件不足暂停。</p>
      <p>选择接收号码后默认勾选其他号码，可调整赠送方。从起始档位逐一转赠，每种给赠送方保留最后一张。</p>
      <p>缺图以每个号码的实时库存为准，不再固定稀缺编号。只缺一张且其他每种至少 11 张、官方允许且次数足够时，抽取一次；未抽中缺图会暂停，不会连续重抽。</p>
      <p>“自动完成后续档位”按 95 折 → 9 折 → 8 折处理，跳过已完成档位。需要领券解锁时自动领取前一档券，下一档重新核对余图；库存不足或未开放时暂停。</p>
      <p>每日任务可一键执行全部号码、当前号码、勾选号码或单个任务。快速模式获取参数后立即尝试上报；关闭时遵循接口倒计时。邀请、充值与 App 浏览任务直接尝试上报，实际成功以任务进度或抽图次数复核为准。</p>
      <p>接口明确拒绝或接受后进度未更新会单独记录，继续其他任务；响应丢失则暂停，恢复时先核验，不盲目重复提交。</p>
      <p>账号和任务检查点加密存储。活动仅返回脱敏号码时，请准确填写完整手机号。经验规律不代表服务端保底保证。</p>
    </div></Modal>}
    {importOpen && state.importJob && <Modal title="cookie-app 账号导入" close={() => setImportOpen(false)}><p>{state.importJob.status === 'running' ? `正在逐个验证活动登录态：${state.importJob.processed} / ${state.importJob.total}` : state.importJob.status === 'interrupted' ? state.importJob.message : '导入完成'}。</p><p>新增 {state.importJob.imported} · 更新 {state.importJob.updated} · 跳过 {state.importJob.skipped} · 失败 {state.importJob.failed}</p><div className="import-results">{state.importJob.results.map((r, i) => <div key={i}><b>{r.phone}</b><span className={r.status === 'failed' ? 'import-failed' : ''}>{r.message}</span></div>)}</div>{state.importJob.status !== 'running' && !state.importJob.total && <p className="hint">没有可导入的有效账号，请先在 cookie-app 登录对应号码。</p>}<div className="dialog-actions"><button onClick={() => setImportOpen(false)}>{state.importJob.status === 'running' ? '后台继续导入' : '关闭'}</button></div></Modal>}
    {confirm && <Modal title={confirm.title} close={() => setConfirm(null)}>{confirm.content}<div className="dialog-actions"><button onClick={() => setConfirm(null)}>取消</button><button className="primary" disabled={busy} onClick={() => { const run = confirm.run; setConfirm(null); void operate(run) }}>确认执行</button></div></Modal>}
  </div>
}

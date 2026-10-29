import BrandLogo from '@/components/BrandLogo'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRightLeft, Loader2, Play, RefreshCw, Square } from 'lucide-react'
import MessageDialog, { type MessageDialogState } from '@/components/MessageDialog'
import V2ConfirmDialog from '@/v2/components/V2ConfirmDialog'
import { requestApiData } from '@/v2/lib/api'
import { PUZZLE_ROUNDS, planPuzzleTarget, puzzleCount, type PuzzleSnapshot } from '../../shared/wedPuzzlePlanner'
import type { PuzzleJobInput, publicPuzzleJob } from '../../api/services/wedPuzzleJobs'

type Account = {
  id: string
  label: string
  hasCookie: boolean
  canRecover?: boolean
}
type Job = NonNullable<ReturnType<typeof publicPuzzleJob>>
const button = 'inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40'
const field = 'h-10 min-w-0 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900'
const post = <T,>(path: string, body: unknown) => requestApiData<T>(`/api/wed-puzzle${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
export default function WedPuzzlePool() {
  const [params] = useSearchParams()
  const fromPage = params.get('from')
  const publicBack = `/public${params.get('link') ? `?link=${encodeURIComponent(params.get('link')!)}` : ''}`
  const back = fromPage === 'users' ? '/users' : fromPage === 'v2-users' ? '/v2/users' : fromPage === 'v2' ? '/v2/benefits' : fromPage === 'home' ? '/' : publicBack
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [targets, setTargets] = useState<string[]>([])
  const [pool, setPool] = useState<PuzzleSnapshot[]>([])
  const [job, setJob] = useState<Job | null>(null)
  const [busy, setBusy] = useState('loading')
  const [round, setRound] = useState(1)
  const [mode, setMode] = useState<PuzzleJobInput['mode']>('auto')
  const [redeem, setRedeem] = useState(false)
  const [sender, setSender] = useState('')
  const [receiver, setReceiver] = useState('')
  const [pieceIndex, setPieceIndex] = useState(0)
  const [count, setCount] = useState(1)
  const [token, setToken] = useState('')
  const [message, setMessage] = useState<MessageDialogState | null>(null)
  const [confirmation, setConfirmation] = useState<'start' | 'close' | 'resume' | null>(null)
  const [requestKey, setRequestKey] = useState(() => crypto.randomUUID())
  const alive = useRef(true)
  const pollError = useRef(false)
  const active = job?.status === 'running' || job?.status === 'queued'
  const unsettled = active || job?.status === 'paused'
  const errorMessage = (e: unknown) => setMessage({ type: 'error', title: '操作未完成', message: e instanceof Error ? e.message : '请求失败，请重试' })
  useEffect(() => {
    alive.current = true
    void requestApiData<{ accounts: Account[]; job: Job | null }>('/api/wed-puzzle/').then(data => {
      if (!alive.current) return
      setAccounts(data.accounts); setSelected(data.accounts.filter(row => row.hasCookie || row.canRecover).map(row => row.id)); setJob(data.job)
      if (data.job) {
        setPool(data.job.pool as PuzzleSnapshot[])
        const saved = data.job.input
        setSelected(saved.accountIds.filter(id => data.accounts.some(a => a.id === id)))
        setTargets(saved.targetIds.filter(id => data.accounts.some(a => a.id === id)))
        setRound(saved.maxRound); setMode(saved.mode); setRedeem(saved.redeem)
        setSender(saved.from || ''); setReceiver(saved.to || ''); setPieceIndex(Number(saved.piece?.split('_')[1] || 0)); setCount(saved.count || 1)
      }
    }).catch(e => { if (alive.current) errorMessage(e) }).finally(() => { if (alive.current) setBusy('') })
    return () => { alive.current = false }
  }, [])
  useEffect(() => {
    if (!active) return
    let stopped = false
    let timer: ReturnType<typeof setTimeout>
    const poll = async () => {
      try {
        const data = await requestApiData<{ job: Job | null }>('/api/wed-puzzle/jobs')
        if (!stopped) {
          setJob(data.job)
          if (data.job?.pool.length) setPool(data.job.pool as PuzzleSnapshot[])
          pollError.current = false
        }
      } catch (e) {
        if (!stopped && !pollError.current) { errorMessage(e); pollError.current = true }
      } finally { if (!stopped) timer = setTimeout(poll, 2500) }
    }
    timer = setTimeout(poll, 1200)
    return () => { stopped = true; clearTimeout(timer) }
  }, [active, job?.id])
  useEffect(() => { setRequestKey(crypto.randomUUID()) }, [selected, targets, round, mode, sender, receiver, pieceIndex, count, token, redeem])
  useEffect(() => {
    if (!confirmation && !message) return
    const previous = document.activeElement as HTMLElement | null
    const dialogs = document.querySelectorAll<HTMLElement>('[role="alertdialog"]')
    const dialog = dialogs[dialogs.length - 1]
    if (!dialog) return
    const controls = () => Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),[tabindex="0"]'))
    controls()[0]?.focus()
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const nodes = controls(), first = nodes[0], last = nodes[nodes.length - 1]
      if (e.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { e.preventDefault(); last?.focus() }
      else if (!e.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { e.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', trap)
    return () => { document.removeEventListener('keydown', trap); previous?.focus() }
  }, [confirmation, message])
  const currentPool = pool.filter(row => selected.includes(row.id))
  const ready = selected.length > 0 && selected.every(id => pool.some(row => row.id === id && row.info && !row.error))
  const config = PUZZLE_ROUNDS[round - 1]
  const plans = useMemo(() => targets.flatMap(id => PUZZLE_ROUNDS.filter(c => c.round <= round).map(c => planPuzzleTarget(pool.filter(row => selected.includes(row.id)), id, c.round))), [pool, selected, targets, round])
  const label = (id: string) => accounts.find(row => row.id === id)?.label || id.slice(0, 8)
  const roundTotals = PUZZLE_ROUNDS.map(config => ({
    ...config,
    total: currentPool.reduce((sum, row) => sum + Array.from({ length: config.size }, (_, i) => puzzleCount(row.info, config.round, i)).reduce((a, b) => a + b, 0), 0),
  }))
  const total = roundTotals.reduce((sum, row) => sum + row.total, 0)
  const totals = Array.from({ length: config.size }, (_, index) => ({ index,
    total: currentPool.reduce((sum, row) => sum + puzzleCount(row.info, round, index), 0),
    available: currentPool.reduce((sum, row) => sum + Math.max(0, puzzleCount(row.info, round, index) - 1), 0) }))
  async function refresh() {
    setBusy('scan')
    try {
      const ids = selected.slice()
      for (let index = 0; index < ids.length; index++) {
        if (!alive.current) return
        const id = ids[index]
        setBusy(`同步 ${index + 1}/${ids.length}`)
        const data = await post<{ rows: PuzzleSnapshot[] }>('/inventory', { accountId: id })
        const row = data.rows[0]
        if (!alive.current) return
        setPool(prev => [...prev.filter(item => item.id !== id), ...data.rows])
        if (row?.errorCode === 'COOKIE_INVALID' || row?.errorCode === 'RELOGIN_REQUIRED') {
          setSelected(prev => prev.filter(accountId => accountId !== id))
          setTargets(prev => prev.filter(accountId => accountId !== id))
          setMessage({ type: 'info', title: '账号已移出号码池', message: `${label(id)} 登录态已失效，请重新登录或导入有效 CK 后再加入。` })
        }
      }
    } catch (e) { if (alive.current) errorMessage(e) }
    finally { if (alive.current) setBusy('') }
  }
  async function control(action: 'stop' | 'resume' | 'close') {
    if (!job) return
    setBusy(action)
    try {
      const data = await post<{ job: Job }>(`/jobs/${job.id}/${action}`, {})
      setJob(data.job); setConfirmation(null)
      if (action === 'close') setRequestKey(crypto.randomUUID())
      if (action === 'stop') setMessage({ type: 'info', title: '已请求停止', message: '当前转赠会先完成接收和库存核对，再停止队列。' })
    } catch (e) { errorMessage(e) }
    finally { setBusy('') }
  }
  async function start() {
    setBusy('start')
    try {
      const input: PuzzleJobInput = { accountIds: selected, targetIds: targets, maxRound: round, redeem, mode,
        from: sender, to: receiver, piece: `dp${round}_${pieceIndex}`, count, token }
      const data = await post<{ job: Job }>('/jobs', { ...input, confirmed: true, idempotencyKey: requestKey })
      setJob(data.job); setConfirmation(null); setToken('')
    } catch (e) { errorMessage(e) }
    finally { setBusy('') }
  }
  const valid = mode === 'auto' ? targets.length > 0 && ready : mode === 'transfer' ? ready && sender && receiver && sender !== receiver && count >= 1 && count <= 100 : receiver && token.trim()
  const options = <><option value="">请选择号码</option>{accounts.filter(row => selected.includes(row.id)).map(row => <option key={row.id} value={row.id}>{row.label}</option>)}</>
  return <main className="brand-page min-h-screen px-3 py-4 text-zinc-900 sm:p-6">
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div><Link to={back} className="mb-2 inline-flex items-center gap-1 text-sm text-zinc-500"><ArrowLeft size={15} />返回{back.includes('users') ? '用户管理' : back.includes('benefits') ? '权益活动' : '账号列表'}</Link><h1 className="flex items-center gap-2 text-xl font-semibold"><BrandLogo className="h-7 w-7" />周三拼图号码池</h1></div>
        <button className={button} onClick={() => void refresh()} disabled={!!busy || !!unsettled || !selected.length}>{busy ? <Loader2 size={16} className="animate-spin motion-reduce:animate-none" /> : <RefreshCw size={16} />}{busy && busy.startsWith('同步') ? busy : '同步拼图库存'}</button>
      </header>
      <section className="flex flex-wrap gap-x-6 gap-y-2 border-y border-zinc-200 py-3 text-sm" aria-label="号码池汇总">
        <span>库存已同步 <strong>{currentPool.filter(row => row.info && !row.error).length}</strong> / {selected.length}</span>
        <span>已入池 <strong>{selected.length}</strong> / {accounts.length} 个号码</span><span>拼图总数 <strong>{total}</strong> 张</span>{roundTotals.map(row => <span key={row.round}>{row.label}券 <strong>{row.total}</strong> 张</span>)}<span>目标号码 <strong>{targets.length}</strong> 个</span>
        <button className="text-blue-700 disabled:text-zinc-400" disabled={!!busy || !!unsettled} onClick={() => { setSelected(selected.length ? [] : accounts.filter(a => a.hasCookie || a.canRecover).map(a => a.id)); setTargets([]) }}>{selected.length ? '清空号码池' : '全部入池'}</button>
      </section>
      <section className="space-y-3" aria-label="拼图库存">
        <div className="flex flex-wrap items-center justify-between gap-2"><div className="inline-flex rounded-md border border-zinc-300 p-0.5" role="group" aria-label="目标档位">{PUZZLE_ROUNDS.map(c => <button key={c.round} disabled={!!unsettled} aria-pressed={round === c.round} onClick={() => { setRound(c.round); setPieceIndex(0) }} className={`min-h-9 rounded px-4 text-sm ${round === c.round ? 'bg-zinc-900 text-white' : 'text-zinc-600'}`}>{c.label}券</button>)}</div><span className="text-xs text-zinc-500">稀有图：{config.rare + 1} 号 · 目标逐档推进至 {config.label}</span></div>
        <div className="flex flex-wrap gap-2 text-xs" aria-label="各编号统计">{totals.map(row => <span key={row.index} className={`rounded border px-2 py-1.5 ${row.index === config.rare ? 'border-amber-300 text-amber-800' : 'border-zinc-200 text-zinc-600'}`}>{row.index + 1} 号{row.index === config.rare ? ' ★' : ''}：{row.total} 张 / 可转 {row.available}</span>)}</div>
        <div className="divide-y divide-zinc-200 border-y border-zinc-200 bg-white">
          {!accounts.length && <p className="p-6 text-center text-sm text-zinc-500">{busy ? '正在加载号码池…' : '暂无可用账号'}</p>}
          {accounts.map(account => {
            const row = pool.find(r => r.id === account.id), included = selected.includes(account.id), targetIndex = targets.indexOf(account.id)
            return <div key={account.id} className={`grid gap-2 px-3 py-3 md:grid-cols-[200px_minmax(0,1fr)_140px] md:items-center ${!included ? 'opacity-60' : ''}`}>
              <label className="flex min-h-8 items-center gap-2 text-sm font-medium"><input type="checkbox" checked={included} disabled={!!busy || !!unsettled || (!account.hasCookie && !account.canRecover)} onChange={() => { setSelected(prev => included ? prev.filter(id => id !== account.id) : [...prev, account.id]); if (included) setTargets(prev => prev.filter(id => id !== account.id)) }} aria-label={`${account.label} 加入号码池`} />{account.label}{!account.hasCookie && account.canRecover ? <span className="text-xs text-blue-600">将自动置换 CK</span> : !account.hasCookie ? <span className="text-xs text-rose-600">需重新登录</span> : null}</label>
              <div className="min-w-0"><div className="flex flex-wrap gap-1.5">{Array.from({ length: config.size }, (_, i) => <span key={i} className={`min-w-[46px] rounded border px-1.5 py-1 text-center text-xs tabular-nums ${i === config.rare ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-zinc-200'}`} title={`${config.label} ${i + 1} 号${i === config.rare ? '稀有图' : ''}`}>{i + 1}号 · {row?.info ? puzzleCount(row.info, round, i) : '—'}</span>)}</div><div className="mt-1.5 text-xs text-zinc-500">{row?.error ? <button className="text-rose-700 underline" onClick={() => errorMessage(new Error(row.error))}>{row.errorCode === 'COOKIE_INVALID' || row.errorCode === 'RELOGIN_REQUIRED' ? '登录失效 · 重新登录' : '查询失败 · 查看原因'}</button> : row?.info ? `剩余 ${row.info.drawTimes ?? '—'} 次 · ${new Date(row.updatedAt).toLocaleTimeString('zh-CN', { hour12: false })} 同步` : '尚未同步'}</div></div>
              <label className="flex min-h-9 items-center gap-2 text-xs"><input type="checkbox" checked={targetIndex >= 0} disabled={!included || !!unsettled || !!busy} onChange={() => setTargets(prev => targetIndex >= 0 ? prev.filter(id => id !== account.id) : [...prev, account.id])} />{targetIndex >= 0 ? `目标顺序 ${targetIndex + 1}` : '设为目标号码'}</label>
            </div>
          })}
        </div>
      </section>
      <section className="space-y-4 border-b border-zinc-200 pb-5">
        <div className="flex flex-wrap gap-2" role="group" aria-label="拼图操作">{([['auto', '自动集图'], ['transfer', '指定互转'], ['receive', '接收分享']] as const).map(([key, name]) => <button key={key} className={`${button} ${mode === key ? '!border-blue-600 !text-blue-700' : ''}`} aria-pressed={mode === key} disabled={!!unsettled} onClick={() => setMode(key)}>{name}</button>)}</div>
        {mode === 'auto' ? <>
          <div className="space-y-2 text-sm"><h2 className="font-semibold">执行预览</h2>{!targets.length ? <p className="text-zinc-500">勾选目标号码后查看各档位缺口。</p> : plans.map(plan => <div key={`${plan.target}-${plan.round}`} className="border-l-2 border-zinc-200 pl-3"><span className="font-medium">{label(plan.target)} · {PUZZLE_ROUNDS[plan.round - 1].label}</span><span className="ml-2 text-zinc-600">{plan.complete ? '已集齐' : plan.reason || `转入 ${plan.transfers.reduce((s, r) => s + r.count, 0)} 张${plan.draw ? '，复查达标后抽图 1 次' : '，无需抽图'}`}</span>{plan.shortages.length > 0 && <p className="mt-1 text-xs text-rose-700">{plan.shortages.map(s => `${Number(s.piece.split('_')[1]) + 1} 号还需 ${s.need} 张，可转 ${s.available} 张`).join('；')}</p>}</div>)}</div>
          <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" disabled={!!unsettled} checked={redeem} onChange={e => setRedeem(e.target.checked)} />允许在下一档被锁定时领取已集齐档位的券（仅官方状态为可领取时）</label>
          <p className="text-xs leading-5 text-zinc-500">每个赠送方保留 1 张；普通图各满 10 张且官方允许才抽图。满 10 张必出稀有图尚无服务端保证，未抽中即暂停。预览为各目标独立估算，队列按顺序重新核算库存。</p>
        </> : <div className="grid gap-3 sm:grid-cols-2">
          {mode === 'transfer' && <label className="space-y-1 text-sm"><span>赠送号码</span><select className={field} value={sender} disabled={!!unsettled} onChange={e => setSender(e.target.value)}>{options}</select></label>}
          <label className="space-y-1 text-sm"><span>接收号码</span><select className={field} value={receiver} disabled={!!unsettled} onChange={e => setReceiver(e.target.value)}>{options}</select></label>
          {mode === 'transfer' ? <><label className="space-y-1 text-sm"><span>转赠拼图</span><select className={field} value={pieceIndex} disabled={!!unsettled} onChange={e => setPieceIndex(Number(e.target.value))}>{Array.from({ length: config.size }, (_, i) => <option key={i} value={i}>{config.label} {i + 1} 号{i === config.rare ? '（稀有）' : ''}</option>)}</select></label><label className="space-y-1 text-sm"><span>张数</span><input className={field} type="number" min={1} max={100} value={count} disabled={!!unsettled} onChange={e => setCount(Number(e.target.value))} /></label></> : <label className="space-y-1 text-sm"><span>官方赠送链接或 Token</span><input className={field} type="password" autoComplete="off" value={token} disabled={!!unsettled} onChange={e => setToken(e.target.value)} placeholder="含 giveCard 的链接" /></label>}
        </div>}
        <button className={`${button} !border-blue-700 !bg-blue-700 !text-white`} disabled={!!busy || !!unsettled || !valid} onClick={() => setConfirmation('start')}><Play size={15} />{mode === 'auto' ? '确认计划并启动队列' : mode === 'transfer' ? '转赠并自动接收' : '领取分享拼图'}</button>
      </section>
      {job && <section className="space-y-3" aria-label="执行队列"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold">队列 · {{ queued: '排队中', running: '执行中', paused: '已暂停，待核对', completed: '已结束', stopped: '已停止' }[job.status]}</h2><div className="flex flex-wrap gap-2">{active && <button className={button} disabled={!!busy} onClick={() => void control('stop')}><Square size={14} />停止队列</button>}{job.status === 'paused' && <><button className={button} disabled={!!busy} onClick={() => setConfirmation('resume')}><ArrowRightLeft size={14} />核对并恢复</button><button className={button} disabled={!!busy} onClick={() => setConfirmation('close')}>结束此任务</button></>}</div></div><p className="text-xs text-zinc-500">{job.input.mode === 'auto' ? `已达成 ${job.completedTargets.length}/${job.input.targetIds.length} 个目标 · ` : ''}关闭页面不会取消后台队列。{job.pendingOperation ? '有未确认操作，恢复时优先核对原操作。' : ''}</p><ol className="max-h-72 space-y-2 overflow-y-auto rounded-md border border-zinc-200 bg-white p-3 text-xs" aria-live="polite">{job.logs.length ? job.logs.map((line, i) => <li key={i} className="flex gap-2"><time className="shrink-0 text-zinc-400">{new Date(line.at).toLocaleTimeString('zh-CN', { hour12: false })}</time><span className="min-w-0 break-words">{line.message}</span></li>) : <li className="text-zinc-500">等待库存检查…</li>}</ol></section>}
    </div>
    <V2ConfirmDialog open={!!confirmation} title={confirmation === 'close' ? '结束未确认的任务？' : confirmation === 'resume' ? '核对并恢复队列？' : '确认执行拼图操作？'} description={confirmation === 'close' ? '已产生的转赠或抽图无法撤销。请先在官方记录核实未确认操作；结束任务仅解除本地队列，不会回收已赠拼图。' : confirmation === 'resume' ? '先核对上次操作的库存变化；存在原 Token 时只使用原 Token 接收。无法确认时继续暂停，不会重新抽图。' : mode === 'auto' ? `按选择顺序处理 ${targets.length} 个目标至 ${config.label}档。会真实转赠并消耗抽取次数；每张转赠保留赠送方最后一张。${redeem ? '已允许必要时领券。' : '不自动领券。'}` : mode === 'transfer' ? `将 ${label(sender)} 的 ${config.label} ${pieceIndex + 1} 号拼图 ${count} 张逐张转给 ${label(receiver)}。` : `使用 ${label(receiver)} 接收该分享拼图。`} confirmLabel={confirmation === 'close' ? '已核实，结束任务' : confirmation === 'resume' ? '核对并恢复' : '确认执行'} loading={!!busy} onClose={() => setConfirmation(null)} onConfirm={() => confirmation === 'start' ? void start() : void control(confirmation === 'resume' ? 'resume' : 'close')} />
    {message && <MessageDialog value={message} onClose={() => setMessage(null)} />}
  </main>
}

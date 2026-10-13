import { useEffect, useState } from 'react'
import { ArrowRightLeft, RefreshCw } from 'lucide-react'
import { ROUNDS, config, type AccountView } from '../shared/puzzle.js'
import type { RelayPreview } from '../shared/relay.js'

export type RelaySelection = { scope: string[]; targets: string[]; start: number; end: number }
const mask = (phone: string) => phone.slice(0, 3) + '****' + phone.slice(-4)
const strategyNames = { complete: '已完成', direct: '转赠直接补齐', draw: '筹图后抽一次', blocked: '等待条件' }

export function RelayPanel({ accounts, selected, working, unfinished, preview, confirm, notify, queue }: {
  accounts: AccountView[]; selected: string[]; working: boolean; unfinished: boolean
  preview: (selection: RelaySelection) => Promise<RelayPreview>
  confirm: (selection: RelaySelection, result: RelayPreview) => void
  notify: (message: string, error?: boolean) => void; queue: () => void
}) {
  const [scope, setScope] = useState(() => selected.length ? selected : accounts.map(a => a.id))
  const [targets, setTargets] = useState(() => selected.length ? selected : accounts.map(a => a.id))
  const [priority, setPriority] = useState(''), [start, setStart] = useState(2), [end, setEnd] = useState(3)
  const [result, setResult] = useState<RelayPreview | null>(null), [loading, setLoading] = useState(false)
  const busy = working || loading
  useEffect(() => { setResult(null) }, [scope, targets, priority, start, end])
  useEffect(() => {
    const valid = new Set(accounts.map(a => a.id))
    if (priority && !valid.has(priority)) setPriority('')
    setScope(ids => ids.some(id => !valid.has(id)) ? ids.filter(id => valid.has(id)) : ids)
    setTargets(ids => ids.some(id => !valid.has(id)) ? ids.filter(id => valid.has(id)) : ids)
  }, [accounts, priority])
  const selection = (): RelaySelection => ({ scope, targets: priority && targets.includes(priority) ? [priority, ...targets.filter(id => id !== priority)] : targets, start, end })
  const toggleScope = (id: string) => {
    if (scope.includes(id)) { setScope(ids => ids.filter(x => x !== id)); setTargets(ids => ids.filter(x => x !== id)); if (priority === id) setPriority('') }
    else setScope(ids => [...ids, id])
  }
  const toggleTarget = (id: string) => { if (!targets.includes(id)) setTargets(ids => [...ids, id]); else { setTargets(ids => ids.filter(x => x !== id)); if (priority === id) setPriority('') } }
  const prepare = async () => {
    if (busy) return
    setLoading(true); setResult(null)
    try { const r = await preview(selection()); setResult(r); notify(r.allComplete ? '所选目标均已完成，无需接力' : '接力库存已核对，请查看逐号缺口') } catch (e) { notify((e as Error).message, true) } finally { setLoading(false) }
  }
  return <section className="relay-panel">
    <div className="section-head"><div><h2>号池接力互助</h2><span className="muted">完成号码留一张 · 余图帮助下一个号码</span></div><button onClick={() => { const ids = accounts.map(a => a.id); setScope(ids); setTargets(ids) }} disabled={busy || !accounts.length}>全选号池与目标</button></div>
    <div className="relay-controls">
      <label>起始档位<select aria-label="起始档位" value={start} disabled={busy} onChange={e => { const r = Number(e.target.value); setStart(r); if (end < r) setEnd(r) }}>{ROUNDS.map(c => <option key={c.round} value={c.round}>{c.label}</option>)}</select></label>
      <label>目标档位<select aria-label="目标档位" value={end} disabled={busy} onChange={e => setEnd(Number(e.target.value))}>{ROUNDS.filter(c => c.round >= start).map(c => <option key={c.round} value={c.round}>{c.label}</option>)}</select></label>
      <label>优先接收号码<select aria-label="优先接收号码" value={priority} disabled={busy} onChange={e => setPriority(e.target.value)}><option value="">按选择顺序</option>{targets.map(id => { const a = accounts.find(a => a.id === id); return a && <option key={id} value={id}>{mask(a.phone)}</option> })}</select></label>
    </div>
    <div className="relay-pool" role="group" aria-label="接力号码选择">
      <div className="relay-pool-head"><span>手机号 / 抽图次数</span><span>参与号池</span><span>作为目标</span></div>
      {accounts.map(a => <div className="relay-pool-row" key={a.id}><div><b>{mask(a.phone)}</b><span className="muted">{a.error ? '查询失败' : `${a.info?.drawTimes ?? '—'} 次抽图`}</span></div><label><input type="checkbox" checked={scope.includes(a.id)} disabled={busy} onChange={() => toggleScope(a.id)} aria-label={`接力号池${mask(a.phone)}`} /></label><label><input type="checkbox" checked={targets.includes(a.id)} disabled={busy || !scope.includes(a.id)} onChange={() => toggleTarget(a.id)} aria-label={`接力目标${mask(a.phone)}`} /></label></div>)}
      {!accounts.length && <div className="empty"><p>先在号码池添加或导入参与号码</p></div>}
    </div>
    <div className="relay-actions"><span className="muted">号池 {scope.length} 个 · 目标 {targets.length} 个</span><button onClick={() => void prepare()} disabled={busy || !scope.length || !targets.length || unfinished}><RefreshCw size={15} className={loading ? 'spinning' : ''} />核对接力库存</button>{result && <button className="primary" onClick={() => confirm(selection(), result)} disabled={busy || unfinished || result.allComplete || !result.stages.some(s => ['direct', 'draw'].includes(s.strategy))}><ArrowRightLeft size={15} />开始号池接力</button>}</div>
    {unfinished && <button className="text-button" onClick={queue}>查看未结束的队列</button>}
    {!!result?.excluded.length && <p className="rule-line">本次未纳入可赠库存：{result.excluded.map(id => { const a = accounts.find(a => a.id === id); return a ? mask(a.phone) : '已移除号码' }).join('、')}，请刷新或重新登录。</p>}
    {result && <div className="relay-preview"><div className="section-head"><h3>当前逐号评估</h3><span className="muted">库存共享，每档完成后重新计算</span></div>{result.stages.map(s => <article key={s.to}><div><b>{accounts.some(a => a.id === s.to) ? mask(accounts.find(a => a.id === s.to)!.phone) : '已移除号码'}</b><span>{config(s.round).label} · {strategyNames[s.strategy]}</span></div><p>{s.strategy === 'complete' ? '所选档位均已完成，仍可贡献余图' : s.reason || `需转赠 ${s.total} 张${s.strategy === 'draw' ? '，随后尝试抽一次' : '，无需抽图'}`}</p>{!!s.missing.length && <p className="muted">缺 {s.missing.map(i => i + 1).join('、')} 号{s.shortages.length ? ` · 余量缺口：${s.shortages.map(p => `${Number(p.piece.split('_')[1]) + 1} 号 ×${p.need}`).join('、')}` : ''}</p>}</article>)}</div>}
  </section>
}

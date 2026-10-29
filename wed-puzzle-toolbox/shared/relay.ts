import { canDraw, complete, config, count, missingPieces, stageComplete, unlocked, type AccountView, type Transfer } from './puzzle.js'

export type RelayStage = { to: string; round: number; strategy: 'complete' | 'direct' | 'draw' | 'blocked'; transfers: Transfer[]; total: number; missing: number[]; shortages: { piece: string; need: number }[]; reason?: string; unlockPrevious?: boolean }
export type RelayPreview = { revision: string; stages: RelayStage[]; excluded: string[]; allComplete: boolean }
export const stageKey = (to: string, round: number) => `${to}:${round}`

// Trade eligibility is checked by the backend. Every donor retains one of each piece.
export function relayStage(pool: AccountView[], scope: string[], to: string, round: number, allowed?: Record<string, string[]>, drawn: string[] = []): RelayStage {
  const c = config(round), target = pool.find(a => a.id === to)
  const result: RelayStage = { to, round, strategy: 'blocked', transfers: [], total: 0, missing: [], shortages: [] }
  if (!target?.info || target.error) return { ...result, reason: '目标号码库存查询失败，请刷新或重新登录' }
  const info = target.info
  if (stageComplete(info, round)) return { ...result, strategy: 'complete' }
  result.missing = missingPieces(info, round)
  const mayUnlock = round > 1 && complete(info, round - 1) && info[config(round - 1).status] === 2
  if (!unlocked(info, round) && !mayUnlock) return { ...result, reason: '前一档尚未完成或官方未开放解锁' }
  result.unlockPrevious = !unlocked(info, round) && mayUnlock
  const sources = scope.filter(id => id !== to).map(id => pool.find(a => a.id === id)).filter((a): a is AccountView => !!a?.info && !a.error)
    .sort((a, b) => Number(stageComplete(b.info!, round)) - Number(stageComplete(a.info!, round)))
  const available = (a: AccountView, i: number) => allowed && !allowed[a.id]?.includes(`dp${round}_${i}`) ? 0 : Math.max(0, count(a.info, round, i) - 1)
  const supply = (i: number) => sources.reduce((n, a) => n + available(a, i), 0)
  const gaps = result.missing.filter(i => supply(i) === 0)
  let needs: number[]
  if (!gaps.length) {
    // Directly fill missing pieces first, avoiding unnecessary transfers and draws.
    result.strategy = 'direct'
    needs = Array.from({ length: c.size }, (_, i) => Math.max(0, 1 - count(info, round, i)))
  } else if (gaps.length === 1) {
    const gap = gaps[0]
    needs = Array.from({ length: c.size }, (_, i) => i === gap ? 0 : Math.max(0, 11 - count(info, round, i)))
    result.shortages = needs.flatMap((need, i) => need > supply(i) ? [{ piece: `dp${round}_${i}`, need: need - supply(i) }] : [])
    if (drawn.includes(stageKey(to, round))) return { ...result, reason: '本次队列该号码该档已抽过一次，缺图未补齐；禁止自动重抽' }
    if (result.shortages.length) return { ...result, reason: '普通拼图余量不足以让其他每种达到 11 张' }
    const afterUnlock = result.unlockPrevious && info[c.drawStatus] === 3 && Number(info.drawTimes) > 0
    if (!canDraw(info, round) && !afterUnlock) return { ...result, reason: Number(info.drawTimes) > 0 ? '官方尚未开放该档抽图' : '抽图次数不足，请先完成每日任务' }
    result.strategy = 'draw'
  } else {
    result.shortages = gaps.map(i => ({ piece: `dp${round}_${i}`, need: 1 }))
    return { ...result, reason: '有多个缺图没有可转余量，无法筹到仅缺一张' }
  }
  for (let i = 0; i < c.size; i++) {
    let need = needs[i]
    for (const a of sources) {
      const n = Math.min(need, available(a, i))
      if (n) result.transfers.push({ from: a.id, piece: `dp${round}_${i}`, count: n })
      need -= n; result.total += n
      if (!need) break
    }
  }
  return result
}

export function relayStages(pool: AccountView[], scope: string[], targets: string[], start: number, end: number, allowed?: Record<string, string[]>, completed: string[] = [], drawn: string[] = []): RelayStage[] {
  config(start); config(end)
  if (start > end || !targets.length || targets.some(id => !scope.includes(id))) throw new Error('接力目标必须在选定号池内，且档位范围有效')
  return targets.map(to => {
    for (let round = start; round <= end; round++) {
      if (completed.includes(stageKey(to, round))) continue
      const stage = relayStage(pool, scope, to, round, allowed, drawn)
      if (stage.strategy !== 'complete') return stage
    }
    return { to, round: end, strategy: 'complete', transfers: [], total: 0, missing: [], shortages: [] }
  })
}

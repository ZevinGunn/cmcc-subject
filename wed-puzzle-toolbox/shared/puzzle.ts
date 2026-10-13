export const ROUNDS = [
  { round: 1, label: '95 折', size: 4, status: 'r6Status', drawStatus: 'r6DrawStatus' },
  { round: 2, label: '9 折', size: 6, status: 'r5Status', drawStatus: 'r5DrawStatus' },
  { round: 3, label: '8 折', size: 9, status: 'r4Status', drawStatus: 'r4DrawStatus' },
] as const
export type Info = { pictureList?: Record<string, Record<string, string>>; drawTimes?: string; activeIndex?: number; r4Status?: number; r5Status?: number; r6Status?: number; r4DrawStatus?: number; r5DrawStatus?: number; r6DrawStatus?: number }
export type AccountView = { id: string; phone: string; source: string; info?: Info; error?: string; updatedAt: string }
export type Transfer = { from: string; piece: string; count: number }
export type Plan = { transfers: Transfer[]; shortages: { piece: string; need: number }[]; total: number; ready: boolean; canDraw: boolean; missing?: number[]; reason?: string }
export function count(info: Info | undefined, round: number, index: number): number {
  if (!info?.pictureList) throw new Error('拼图库存未查询成功')
  const n = Number(info.pictureList[String(round)]?.[`dp${round}_${index}`] ?? 0)
  if (!Number.isSafeInteger(n) || n < 0) throw new Error('拼图库存格式异常')
  return n
}
export function config(round: number) { const c = ROUNDS[round - 1]; if (!c) throw new Error('档位无效'); return c }
export function complete(info: Info, round: number) { return Array.from({ length: config(round).size }, (_, i) => count(info, round, i)).every(n => n > 0) }
export function stageComplete(info: Info, round: number) { return complete(info, round) || [3, 6, 7, 9].includes(info[config(round).status] ?? -1) }
export function missingPieces(info: Info, round: number) { return Array.from({ length: config(round).size }, (_, i) => i).filter(i => count(info, round, i) === 0) }
export function missingIndex(info: Info, round: number) { const missing = missingPieces(info, round); return missing.length === 1 ? missing[0] : undefined }
export function ordinaryReady(info: Info, round: number) {
  const missing = missingIndex(info, round)
  return missing !== undefined && Array.from({ length: config(round).size }, (_, i) => i === missing || count(info, round, i) > 10).every(Boolean)
}
export function unlocked(info: Info, round: number) { return round === 1 || info[config(round).drawStatus] !== 3 && (Number(info.activeIndex) >= round || complete(info, round - 1)) }
export function canDraw(info: Info, round: number) { return info[config(round).drawStatus] === 1 && Number(info.drawTimes) > 0 && unlocked(info, round) }
export function planTransfers(pool: AccountView[], donors: string[], to: string, round: number, mode: 'fill' | 'all', autoAdvance = false): Plan {
  const c = config(round), target = pool.find(a => a.id === to)
  if (!target?.info || target.error) throw new Error('接收号码库存查询失败，请刷新')
  const sources = [...new Set(donors)].filter(id => id !== to).map(id => pool.find(a => a.id === id))
  if (!sources.length || sources.some(a => !a?.info || a.error)) throw new Error('赠送号码库存查询失败，请刷新')
  const missing = missingPieces(target.info, round)
  const result: Plan = { transfers: [], shortages: [], total: 0, ready: ordinaryReady(target.info, round), canDraw: canDraw(target.info, round), missing }
  if (autoAdvance && stageComplete(target.info, round)) return result
  const mayUnlock = autoAdvance && round > 1 && complete(target.info, round - 1) && target.info[config(round - 1).status] === 2
  if (!unlocked(target.info, round) && !mayUnlock) { result.reason = '接收号码该档尚未解锁，请先完成前一档'; return result }
  // Choose the hardest current gap from live combined inventory, never a fixed piece number.
  const availability = (index: number) => sources.reduce((n, a) => n + Math.max(0, count(a!.info, round, index) - 1), 0)
  const candidate = missing.slice().sort((a, b) => availability(a) - availability(b) || a - b)[0]
  const indices = Array.from({ length: c.size }, (_, i) => i).sort((a, b) => Number(a === candidate) - Number(b === candidate))
  for (const index of indices) {
    let need = Math.max(0, (index === candidate ? 1 : 11) - count(target.info, round, index))
    for (const a of sources) {
      const available = Math.max(0, count(a!.info, round, index) - 1)
      const n = mode === 'all' ? available : Math.min(need, available)
      if (n > 0) result.transfers.push({ from: a!.id, piece: `dp${round}_${index}`, count: n })
      need = Math.max(0, need - n); result.total += n
    }
    if (index !== candidate && need) result.shortages.push({ piece: `dp${round}_${index}`, need })
  }
  return result
}

import type { WedRechargePictureInfo } from '../api/services/wedRecharge.js'

export const PUZZLE_ROUNDS = [
  { round: 1, label: '95 折', size: 4, rare: 1, status: 'r6Status', drawStatus: 'r6DrawStatus' },
  { round: 2, label: '9 折', size: 6, rare: 3, status: 'r5Status', drawStatus: 'r5DrawStatus' },
  { round: 3, label: '8 折', size: 9, rare: 0, status: 'r4Status', drawStatus: 'r4DrawStatus' },
] as const
export type PuzzleSnapshot = { id: string; label: string; info?: WedRechargePictureInfo; error?: string; errorCode?: 'COOKIE_INVALID' | 'RELOGIN_REQUIRED' | 'UPSTREAM_ERROR'; updatedAt: string }
export type PuzzleTransfer = { from: string; to: string; piece: string; count: number }
export type PuzzlePlan = { target: string; round: number; transfers: PuzzleTransfer[]; shortages: { piece: string; need: number; available: number }[]; draw: boolean; complete: boolean; reason?: string }

export function puzzleCount(info: WedRechargePictureInfo | undefined, round: number, index: number): number {
  const raw = info?.pictureList?.[String(round)]?.[`dp${round}_${index}`]
  if (raw === undefined) return 0 // official sparse lists omit zero-count pieces
  const n = Number(raw)
  if (!Number.isSafeInteger(n) || n < 0) throw new Error('拼图库存格式异常，已停止规划')
  return n
}
export function roundComplete(info: WedRechargePictureInfo | undefined, round: number): boolean {
  return !!info && Array.from({ length: PUZZLE_ROUNDS[round - 1].size }, (_, i) => puzzleCount(info, round, i)).every(n => n > 0)
}
export function canDrawPuzzle(info: WedRechargePictureInfo, round: number): boolean {
  const config = PUZZLE_ROUNDS[round - 1]
  return info[config.drawStatus] === 1 && Number(info.drawTimes) > 0 &&
    (round === 1 || Number(info.activeIndex) >= round || roundComplete(info, round - 1))
}
export function ordinaryReady(info: WedRechargePictureInfo, round: number): boolean {
  const config = PUZZLE_ROUNDS[round - 1]
  return Array.from({ length: config.size }, (_, i) => i === config.rare || puzzleCount(info, round, i) >= 10).every(Boolean)
}

export function planPuzzleTarget(pool: PuzzleSnapshot[], targetId: string, round: number): PuzzlePlan {
  const config = PUZZLE_ROUNDS[round - 1]
  if (!config) throw new Error('请选择有效档位')
  const target = pool.find(row => row.id === targetId)
  const result: PuzzlePlan = { target: targetId, round, transfers: [], shortages: [], draw: false, complete: false }
  if (!target?.info || target.error) return { ...result, reason: '目标账号库存查询失败' }
  if (roundComplete(target.info, round)) return { ...result, complete: true }
  if (round > 1 && Number(target.info.activeIndex) < round && !roundComplete(target.info, round - 1)) return { ...result, reason: '前一档拼图尚未集齐' }
  const donors = pool.filter(row => row.id !== targetId && row.info && !row.error)
  const rareMissing = puzzleCount(target.info, round, config.rare) === 0
  const rareDonor = donors.find(row => puzzleCount(row.info, round, config.rare) > 1)
  result.draw = rareMissing && !rareDonor
  if (result.draw && !canDrawPuzzle(target.info, round)) return { ...result, reason: '官方未开放该档抽图或抽取次数不足' }
  for (let index = 0; index < config.size; index++) {
    if (index === config.rare && result.draw) continue
    const goal = index === config.rare ? 1 : result.draw ? 10 : 1
    let need = Math.max(0, goal - puzzleCount(target.info, round, index))
    const originalNeed = need
    const piece = `dp${round}_${index}`
    for (const donor of donors) {
      const count = Math.min(need, Math.max(0, puzzleCount(donor.info, round, index) - 1))
      if (count) result.transfers.push({ from: donor.id, to: targetId, piece, count })
      need -= count
      if (!need) break
    }
    if (need) result.shortages.push({ piece, need: originalNeed, available: originalNeed - need })
  }
  if (result.shortages.length) result.reason = '部分编号的可转库存不足（每个赠送方保留 1 张）'
  return result
}

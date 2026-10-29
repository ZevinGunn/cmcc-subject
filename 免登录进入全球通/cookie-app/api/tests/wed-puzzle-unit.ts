import assert from 'node:assert/strict'
import { PUZZLE_ROUNDS, ordinaryReady, planPuzzleTarget, puzzleCount, type PuzzleSnapshot } from '../../shared/wedPuzzlePlanner.js'
import { parseWedGiftToken, parseWedReceiveToken, type WedRechargePictureInfo } from '../services/wedRecharge.js'
import { executePuzzleJob, publicPuzzleJob, type PuzzleJob, type PuzzleTransport } from '../services/wedPuzzleJobs.js'
import { validatePuzzleInput } from '../routes/wedPuzzle.js'

let cases = 0
async function test(name: string, run: () => unknown | Promise<unknown>) { await run(); cases++; console.log(`✓ ${name}`) }
const token = 'a'.repeat(96)
function info(round: number, ordinary: number, rare = 0): WedRechargePictureInfo {
  const config = PUZZLE_ROUNDS[round - 1]
  const pictureList: Record<string, Record<string, string>> = {}
  for (const c of PUZZLE_ROUNDS) pictureList[c.round] = Object.fromEntries(Array.from({ length: c.size }, (_, i) => [`dp${c.round}_${i}`, String(c.round < round ? 1 : c.round === round ? i === c.rare ? rare : ordinary : 0)]))
  return { activeIndex: round, drawTimes: '3', pictureList, r6DrawStatus: 1, r5DrawStatus: 1, r4DrawStatus: 1, r6Status: 1, r5Status: 1, r4Status: 1, raw: {} }
}
function row(id: string, value: WedRechargePictureInfo): PuzzleSnapshot { return { id, label: id, info: value, updatedAt: new Date().toISOString() } }
function job(round = 1): PuzzleJob { return { id: 'test', owner: 'admin', status: 'queued', createdAt: new Date().toISOString(), logs: [], pool: [], completedTargets: [], input: { mode: 'auto', accountIds: ['donor', 'target'], targetIds: ['target'], maxRound: round, redeem: false } } }
function simulator(values: Record<string, WedRechargePictureInfo>) {
  const calls: string[] = [], tokens = new Map<string, { from: string; piece: string; received: boolean }>()
  let serial = 0, failReceive = false, failGift = false, wrongDraw = false, postReceiveTimeout = false
  const change = (id: string, piece: string, amount: number) => { const round = Number(piece[2]); values[id].pictureList![round][piece] = String(Number(values[id].pictureList![round][piece] || 0) + amount) }
  const io: PuzzleTransport = {
    async query(id) { calls.push(`query:${id}`); return row(id, structuredClone(values[id])) },
    async tradeList(id) { return Object.values(values[id].pictureList!).flatMap(r => Object.entries(r).map(([prize, n]) => ({ prize, num: Number(n), btnStatus: Number(n) > 1 ? 2 : 1, name: prize }))) },
    async gift(id, piece) { calls.push(`gift:${piece}`); if (failGift) throw new Error('gift timeout'); const t = String(++serial).padStart(32, '0'); tokens.set(t, { from: id, piece, received: false }); return t },
    async receive(id, t) { calls.push('receive'); if (failReceive) throw new Error('receive timeout'); const entry = tokens.get(t)!; if (entry.received) throw new Error('already received'); entry.received = true; change(entry.from, entry.piece, -1); change(id, entry.piece, 1); if (postReceiveTimeout) throw new Error('response lost'); return entry.piece },
    async draw(id, round) { calls.push(`draw:${round}`); assert.ok(ordinaryReady(values[id], round)); const c = PUZZLE_ROUNDS[round - 1]; change(id, `dp${round}_${wrongDraw ? (c.rare + 1) % c.size : c.rare}`, 1); values[id].drawTimes = String(Number(values[id].drawTimes) - 1) },
    async redeem(id, round) { calls.push(`redeem:${round}`); const c = PUZZLE_ROUNDS[round - 1]; values[id][c.status] = 3; values[id][PUZZLE_ROUNDS[round].drawStatus] = 1; values[id].activeIndex = round + 1 },
  }
  return { io, calls, values, flags: (flags: { failReceive?: boolean; failGift?: boolean; wrongDraw?: boolean; postReceiveTimeout?: boolean }) => { failReceive = !!flags.failReceive; failGift = !!flags.failGift; wrongDraw = !!flags.wrongDraw; postReceiveTimeout = !!flags.postReceiveTimeout } }
}
const noop = async () => {}, noCancel = async () => false

await test('HAR 嵌套 Token 成功码与官方链接解析', () => {
  assert.equal(parseWedGiftToken({ code: '0', data: { code: '0', data: token } }), token)
  assert.throws(() => parseWedGiftToken({ code: '0', data: { code: '1', msg: '失败' } }))
  assert.equal(parseWedReceiveToken(`https://wx.10086.cn/hlwyxhdhub/act-wedrecharge/1024101716?giveCard=${token}`), token)
  assert.throws(() => parseWedReceiveToken(`https://evil.test/?giveCard=${token}`))
})
await test('档位和稀有图编号映射；每类逐一计算，不使用总库存替代', () => {
  assert.deepEqual(PUZZLE_ROUNDS.map(c => `dp${c.round}_${c.rare}`), ['dp1_1', 'dp2_3', 'dp3_0'])
  const d = info(1, 20); d.pictureList!['1'].dp1_2 = '1'
  const p = planPuzzleTarget([row('donor', d), row('target', info(1, 0))], 'target', 1)
  assert.deepEqual(p.shortages, [{ piece: 'dp1_2', need: 10, available: 0 }])
})
await test('赠送方保留一张；多号码分担缺口', () => {
  const p = planPuzzleTarget([row('a', info(1, 6)), row('b', info(1, 6)), row('t', info(1, 0))], 't', 1)
  assert.equal(p.shortages.length, 0)
  assert.equal(p.transfers.reduce((s, m) => s + m.count, 0), 30)
  assert.ok(p.transfers.every(m => m.count === 5))
})
await test('优先互转多余稀有图；已有最后一张不可赠送', () => {
  const p = planPuzzleTarget([row('d', info(1, 1, 2)), row('t', info(1, 1))], 't', 1)
  assert.equal(p.draw, false); assert.deepEqual(p.transfers, [{ from: 'd', to: 't', piece: 'dp1_1', count: 1 }])
  assert.equal(planPuzzleTarget([row('d', info(1, 1, 1)), row('t', info(1, 1))], 't', 1).draw, true)
})
await test('无次数／未解锁不得抽图；非法库存拒绝规划', () => {
  const t = info(2, 10); t.r5DrawStatus = 3
  assert.match(planPuzzleTarget([row('t', t)], 't', 2).reason!, /未开放/)
  t.r5DrawStatus = 1; t.drawTimes = '0'
  assert.match(planPuzzleTarget([row('t', t)], 't', 2).reason!, /次数/)
  t.pictureList!['2'].dp2_0 = 'oops'; assert.throws(() => puzzleCount(t, 2, 0))
})
await test('串行逐张赠送、领取、核验，普通图满十才抽', async () => {
  const s = simulator({ donor: info(1, 3), target: info(1, 8) }), j = job()
  let savedBeforeGift = false
  await executePuzzleJob(j, s.io, async () => { if (j.checkpoint?.kind === 'gift' && !j.checkpoint.token) savedBeforeGift = true }, noCancel)
  assert.equal(j.status, 'completed'); assert.equal(j.completedTargets.length, 1)
  assert.equal(s.calls.filter(c => c.startsWith('gift:')).length, 6)
  assert.equal(s.calls.filter(c => c === 'receive').length, 6)
  assert.equal(s.calls.filter(c => c.startsWith('draw:')).length, 1)
  assert.equal(puzzleCount(s.values.donor, 1, 0), 1); assert.ok(savedBeforeGift)
})
await test('某个编号不足时不先转走其他图，也不抽图', async () => {
  const s = simulator({ donor: info(1, 1), target: info(1, 9) }), j = job()
  await executePuzzleJob(j, s.io, noop, noCancel)
  assert.equal(j.completedTargets.length, 0); assert.ok(!s.calls.some(c => c.startsWith('gift:') || c.startsWith('draw:')))
})
await test('未抽中稀有图立即暂停；恢复不重复抽图', async () => {
  const s = simulator({ donor: info(1, 1), target: info(1, 10) }), j = job(); s.flags({ wrongDraw: true })
  await executePuzzleJob(j, s.io, noop, noCancel); assert.equal(j.status, 'paused')
  await executePuzzleJob(j, s.io, noop, noCancel)
  assert.equal(s.calls.filter(c => c.startsWith('draw:')).length, 1); assert.equal(j.status, 'paused')
})
await test('领取失败保留原 Token；恢复不重复生成转赠', async () => {
  const s = simulator({ donor: info(1, 1, 2), target: info(1, 1) }), j = job(); s.flags({ failReceive: true })
  await executePuzzleJob(j, s.io, noop, noCancel); assert.equal(j.status, 'paused'); assert.ok(j.checkpoint?.token)
  s.flags({}); await executePuzzleJob(j, s.io, noop, noCancel)
  assert.equal(j.status, 'completed'); assert.equal(s.calls.filter(c => c.startsWith('gift:')).length, 1)
})
await test('生成 Token 超时不盲重试', async () => {
  const s = simulator({ donor: info(1, 1, 2), target: info(1, 1) }), j = job(); s.flags({ failGift: true })
  await executePuzzleJob(j, s.io, noop, noCancel); s.flags({}); await executePuzzleJob(j, s.io, noop, noCancel)
  assert.equal(j.status, 'paused'); assert.equal(s.calls.filter(c => c.startsWith('gift:')).length, 1)
})
await test('领取实际成功但响应丢失，通过双边库存核对确认', async () => {
  const s = simulator({ donor: info(1, 1, 2), target: info(1, 1) }), j = job(); s.flags({ postReceiveTimeout: true })
  await executePuzzleJob(j, s.io, noop, noCancel)
  assert.equal(j.status, 'completed'); assert.equal(s.calls.filter(c => c === 'receive').length, 1)
})
await test('取消后不开始新动作', async () => {
  const s = simulator({ donor: info(1, 2), target: info(1, 9) }), j = job()
  await executePuzzleJob(j, s.io, noop, async () => true)
  assert.equal(j.status, 'stopped'); assert.equal(s.calls.length, 0)
})
await test('指定互转保持一张，逐张核验且不会越界消耗', async () => {
  const s = simulator({ donor: info(1, 3), target: info(1, 0) }), j = job()
  j.input = { ...j.input, mode: 'transfer', from: 'donor', to: 'target', piece: 'dp1_0', count: 3 }
  await executePuzzleJob(j, s.io, noop, noCancel)
  assert.equal(j.status, 'paused'); assert.equal(j.transfersDone, 2); assert.equal(puzzleCount(s.values.donor, 1, 0), 1)
})
await test('可配置领券推进；未勾选不调用领券接口', async () => {
  for (const redeem of [false, true]) {
    const target = info(2, 10); target.r6Status = 2; target.r5DrawStatus = 3
    const s = simulator({ donor: info(2, 1), target }), j = job(2); j.input.redeem = redeem
    await executePuzzleJob(j, s.io, noop, noCancel)
    assert.equal(s.calls.includes('redeem:1'), redeem)
    assert.equal(j.completedTargets.length, redeem ? 1 : 0)
  }
})
await test('输入范围、账号归属、单号自转和敏感字段过滤', () => {
  const j = job(); j.input.token = token
  assert.throws(() => validatePuzzleInput({ ...j.input, accountIds: ['other'] }, new Set(['target'])))
  assert.throws(() => validatePuzzleInput({ ...j.input, mode: 'transfer', from: 'target', to: 'target', piece: 'dp1_0', count: 1 }, new Set(j.input.accountIds)))
  assert.throws(() => validatePuzzleInput({ ...j.input, mode: 'transfer', from: 'donor', to: 'target', piece: 'dp1_8', count: 1 }, new Set(j.input.accountIds)))
  j.pool = [row('target', { ...info(1, 1), cardNo: 'secret', raw: { token } })]
  const out = JSON.stringify(publicPuzzleJob(j)); assert.ok(!out.includes(token)); assert.ok(!out.includes('secret'))
})
await test('接收外部分享，持久化后恢复不会重复领取', async () => {
  const s = simulator({ donor: info(1, 3), target: info(1, 0) }), j = job()
  const gift = await s.io.gift('donor', 'dp1_0')
  j.input = { ...j.input, mode: 'receive', to: 'target', token: gift }
  await executePuzzleJob(j, s.io, noop, noCancel)
  const restored = JSON.parse(JSON.stringify(j)) as PuzzleJob
  restored.status = 'paused'
  await executePuzzleJob(restored, s.io, noop, noCancel)
  assert.equal(restored.status, 'completed'); assert.equal(s.calls.filter(c => c === 'receive').length, 1)
})
await test('转赠途中取消：先完成当前接收，禁止开始下一张', async () => {
  const s = simulator({ donor: info(1, 3), target: info(1, 0) }), j = job()
  j.input = { ...j.input, mode: 'transfer', from: 'donor', to: 'target', piece: 'dp1_0', count: 2 }
  await executePuzzleJob(j, s.io, noop, async () => s.calls.some(c => c.startsWith('gift:')))
  assert.equal(j.status, 'stopped'); assert.equal(j.transfersDone, 1)
  assert.equal(puzzleCount(s.values.target, 1, 0), 1); assert.equal(s.calls.filter(c => c === 'receive').length, 1)
})
await test('多个目标串行流转普通图，不会把上个目标最后一张赠出', async () => {
  const s = simulator({ donor: info(1, 3), target: info(1, 9), second: info(1, 9) }), j = job()
  j.input.accountIds.push('second'); j.input.targetIds.push('second')
  await executePuzzleJob(j, s.io, noop, noCancel)
  assert.deepEqual(j.completedTargets, ['target', 'second'])
  assert.equal(puzzleCount(s.values.target, 1, 1), 1); assert.equal(puzzleCount(s.values.second, 1, 1), 1)
  assert.equal(s.calls.filter(c => c.startsWith('draw:')).length, 2)
})
await test('即使有次数，普通图未满十也不能抽；八折正确选择稀有一号', async () => {
  const s = simulator({ donor: info(3, 1), target: info(3, 10) }), j = job(3)
  await executePuzzleJob(j, s.io, noop, noCancel)
  assert.equal(j.status, 'completed'); assert.equal(puzzleCount(s.values.target, 3, 0), 1)
  assert.deepEqual(s.calls.filter(c => c.startsWith('draw:')), ['draw:3'])
})
console.log(`${cases} 周三拼图测试通过（全部使用模拟接口，无真实转赠／抽图）`)

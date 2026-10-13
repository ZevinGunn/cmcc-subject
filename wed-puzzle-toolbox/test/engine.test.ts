import test, { type TestContext } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import { Store, type Job } from '../api/store.js'
import { Engine, type Transport, type JobInput } from '../api/engine.js'
import { count, config, ordinaryReady, missingIndex, missingPieces, planTransfers, canDraw, type Info, ROUNDS } from '../shared/puzzle.js'
import { parseImport, profilePhone, decodePayload } from '../api/client.js'
import { parseWedGiftToken, parseWedReceiveToken, WedBusinessError, type WedRechargeTask } from '../api/protocol/wedRecharge.js'
import { aesEncrypt, aesDecrypt } from '../api/protocol/cmccCrypto.js'
import { relayStage, stageKey } from '../shared/relay.js'
import { AccessError } from '../api/access.js'

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))
function info(n = 10, rare = 0, round = 2, gap = [1, 3, 0][round - 1]): Info {
  const pictureList: NonNullable<Info['pictureList']> = {}
  for (const r of ROUNDS) pictureList[String(r.round)] = Object.fromEntries(Array.from({ length: r.size }, (_, i) => [`dp${r.round}_${i}`, String(r.round === round ? i === gap ? rare : n : 1)]))
  return { pictureList, drawTimes: '5', activeIndex: round, r6DrawStatus: 1, r5DrawStatus: 1, r4DrawStatus: 1, r6Status: 3, r5Status: 1, r4Status: 1 }
}
function setup(t: TestContext, donor = info(2, 1), recipient = info()) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wed-toolbox-test-')), store = new Store(dir)
  t.after(() => { store.close(); fs.rmSync(dir, { recursive: true, force: true }) })
  store.state.accounts = ['donor', 'target'].map((id, i) => ({ id, phone: i ? '13900000002' : '13900000001', identityKey: id, source: 'appck' as const, credential: { cookie: 'HLWHD_SESSION_TOKEN=test-secret' }, activityCookie: 'HLWHD_SESSION_TOKEN=test-secret', info: clone(i ? recipient : donor), updatedAt: new Date().toISOString() })); store.save()
  const calls: string[] = [], gifts = new Map<string, { from: string; piece: string; received: boolean }>(), options = { dropGift: false, dropReceive: false, dropDraw: false, wrongPrize: false, deductOnGift: false, unchangedTask: false }
  let active = 0, maxActive = 0
  const step = async <T>(name: string, work: () => T) => { calls.push(name); active++; maxActive = Math.max(active, maxActive); await new Promise(r => setTimeout(r, 1)); try { return work() } finally { active-- } }
  const change = (id: string, piece: string, delta: number) => { const round = Number(piece[2]), index = Number(piece.split('_')[1]); const i = store.account(id).info!; i.pictureList![String(round)][piece] = String(count(i, round, index) + delta) }
  const taskRows: WedRechargeTask[] = []
  const transport: Transport = {
    query: id => step(`query:${id}`, () => clone(store.account(id).info!)),
    trade: id => step(`trade:${id}`, () => ROUNDS.flatMap(c => Array.from({ length: c.size }, (_, i) => ({ prize: `dp${c.round}_${i}`, num: count(store.account(id).info, c.round, i), btnStatus: count(store.account(id).info, c.round, i) > 1 ? 2 : 1, name: '' })))),
    gift: (from, piece) => step(`gift:${piece}`, () => { const token = crypto.randomBytes(16).toString('hex'); gifts.set(token, { from, piece, received: false }); if (options.deductOnGift) change(from, piece, -1); if (options.dropGift) throw new Error('生成链接超时'); return token }),
    receive: (to, token) => step(`receive:${to}`, () => { const g = gifts.get(token); if (!g || g.received) throw new Error('已领取'); g.received = true; if (!options.deductOnGift) change(g.from, g.piece, -1); change(to, g.piece, 1); if (options.dropReceive) throw new Error('领取响应丢失'); return g.piece }),
    draw: (id, round) => step(`draw:${id}`, () => { const gap = missingIndex(store.account(id).info!, round)!; const piece = `dp${round}_${options.wrongPrize ? gap === 0 ? 1 : 0 : gap}`; change(id, piece, 1); store.account(id).info!.drawTimes = String(Number(store.account(id).info!.drawTimes) - 1); store.account(id).info![config(round).status] = 2; if (options.dropDraw) throw new Error('抽图响应丢失'); return { raw: {}, prize: { prizeId: piece, raw: {} } } }),
    redeem: (id, round) => step(`redeem:${id}`, () => { const i = store.account(id).info!; i[config(round).status] = 3; if (round < 3) { i[config(round + 1).drawStatus] = 1; i.activeIndex = round + 1 } }),
    tasks: id => step(`tasks:${id}`, () => clone(taskRows)),
    finish: (id, taskId) => step(`finish:${taskId}`, () => { if (!options.unchangedTask) { const t = taskRows.find(t => t.taskId === taskId)!; t.completedTimes = 1; t.status = 1; t.buttonText = '已完成'; store.account(id).info!.drawTimes = String(Number(store.account(id).info!.drawTimes) + 1) } return { message: '0', raw: {} } }),
    jt: (_id, taskId) => step(`jt:${taskId}`, () => 'jt-test'),
    open: () => step('open', () => ({ cToken: 'c-test', scanTimeSeconds: 0, raw: {} })),
    openFinish: (id) => step('openFinish', () => { const task = taskRows.find(t => t.taskType === '4')!; task.completedTimes = 1; task.status = 1; task.buttonText = '已完成'; store.account(id).info!.drawTimes = String(Number(store.account(id).info!.drawTimes) + 1); return { message: 'SUCCESS', raw: {} } }),
  }
  const engine = new Engine(store, transport)
  const input = (overrides: Partial<JobInput> = {}): JobInput => ({ requestId: crypto.randomUUID(), kind: 'transfer', donors: ['donor'], to: 'target', round: 2, mode: 'fill', autoDraw: true, ...overrides })
  return { dir, store, engine, transport, input, calls, options, gifts, taskRows, maxActive: () => maxActive }
}
async function run(engine: Engine, j: Job) { engine.start(j); const end = Date.now() + 6000; while (engine.busy) { if (Date.now() > end) throw new Error('测试队列超时'); await new Promise(r => setTimeout(r, 2)) } }

async function relayJob(f: ReturnType<typeof setup>, targets = ['target'], start = 2, end = start) {
  const scope = f.store.state.accounts.map(a => a.id), preview = await f.engine.previewRelay(scope, targets, start, end)
  return f.engine.create(f.input({ kind: 'relay', to: '', donors: scope, relayTargets: targets, round: start, relayEnd: end, expectedRevision: preview.revision }))
}
function addTarget(f: ReturnType<typeof setup>, id: string, data: Info) {
  f.store.state.accounts.push({ ...clone(f.store.account('target')), id, phone: '13900000003', identityKey: id, info: data }); f.store.save()
}

test('接力优先直接补缺图，不搬普通图、不消耗抽图次数', async t => {
  const f = setup(t, info(2, 2), info(1)), j = await relayJob(f)
  await run(f.engine, j)
  assert.equal(j.status, 'completed'); assert.equal(j.transfersDone, 1); assert.equal(j.relayDrawn!.length, 0)
  assert.ok(!f.calls.some(c => c.startsWith('draw')))
  assert.equal(count(f.store.account('donor').info, 2, 3), 1)
})
test('接力按号码+档位记录抽取，完成号码的余图帮助后续目标', async t => {
  const f = setup(t)
  addTarget(f, 'target2', info())
  const j = await relayJob(f, ['target', 'target2']); await run(f.engine, j)
  assert.equal(j.status, 'completed'); assert.equal(j.transfersDone, 10)
  assert.deepEqual(j.relayDrawn, ['target:2', 'target2:2'])
  assert.deepEqual(j.relayCompleted, ['target:2', 'target2:2'])
  assert.equal(f.store.view().jobs[0].drawCount, 2)
  assert.equal(f.maxActive(), 1)
  assert.ok(j.logs.some(l => l.message.includes('0002 →') && l.message.includes('0003')))
  for (const a of f.store.state.accounts) for (let i = 0; i < 6; i++) assert.ok(count(a.info, 2, i) >= 1)
})
test('不同目标缺图不同也可以直接互补；不固定稀有编号', async t => {
  const f = setup(t, info(1, 1), info(2, 0, 2, 0))
  addTarget(f, 'target2', info(2, 0, 2, 4))
  const j = await relayJob(f, ['target', 'target2']); await run(f.engine, j)
  assert.equal(j.status, 'completed'); assert.equal(j.transfersDone, 2); assert.equal(j.relayDrawn!.length, 0)
  assert.ok(j.logs.some(l => l.message.includes('1 号 ×1')))
  assert.ok(j.logs.some(l => l.message.includes('5 号 ×1')))
})
test('接力仅使用官方允许转赠的余量，多个不可补缺图不提前搬运', async t => {
  const f = setup(t, info(12, 1), info(1))
  const target = f.store.account('target').info!; target.pictureList!['2'].dp2_0 = '0'
  const original = f.transport.trade
  f.transport.trade = async id => (await original(id)).map(p => p.prize === 'dp2_0' ? { ...p, btnStatus: 1 } : p)
  const scope = ['donor', 'target'], p = await f.engine.previewRelay(scope, ['target'], 2, 2)
  assert.equal(p.stages[0].strategy, 'blocked'); assert.equal(p.stages[0].total, 0)
  assert.deepEqual(p.stages[0].shortages.map(p => p.piece), ['dp2_0', 'dp2_3'])
  await assert.rejects(f.engine.create(f.input({ kind: 'relay', donors: scope, to: '', relayTargets: ['target'], relayEnd: 2, expectedRevision: p.revision })), /没有可完成/)
  assert.ok(!f.calls.some(c => c.startsWith('gift')))
})
test('接力库存不足目标先等候，其他可行目标完成后仍不足则暂停', async t => {
  const f = setup(t)
  addTarget(f, 'blocked', info(0))
  const j = await relayJob(f, ['blocked', 'target']); await run(f.engine, j)
  assert.equal(j.status, 'paused'); assert.ok(j.relayCompleted!.includes('target:2'))
  assert.ok(!j.relayCompleted!.includes('blocked:2'))
  assert.equal(j.relayDrawn!.length, 1)
  const blocked = f.store.account('blocked').info!
  for (let i = 0; i < 6; i++) assert.equal(count(blocked, 2, i), 0)
})
test('接力凭证失效号码不贡献缓存；撤权错误不能被当作库存失败跳过', async t => {
  const f = setup(t); addTarget(f, 'invalid', info(100, 100))
  const query = f.transport.query
  f.transport.query = async id => { if (id === 'invalid') throw new Error('活动凭证失效'); return query(id) }
  const p = await f.engine.previewRelay(['donor', 'target', 'invalid'], ['target'], 2, 2)
  assert.deepEqual(p.excluded, ['invalid']); assert.equal(p.stages[0].strategy, 'draw')
  assert.ok(p.stages[0].transfers.every(x => x.from !== 'invalid'))
  f.transport.query = async () => { throw new AccessError(403, '站点权限撤销') }
  await assert.rejects(f.engine.previewRelay(['donor', 'target'], ['target'], 2, 2), /权限撤销/)
})
test('接力库存变化后拒绝旧预览；范围外目标不调用上游', async t => {
  const f = setup(t), p = await f.engine.previewRelay(['donor', 'target'], ['target'], 2, 2)
  f.store.account('donor').info!.drawTimes = '0'
  await assert.rejects(f.engine.create(f.input({ kind: 'relay', donors: ['donor', 'target'], to: '', relayTargets: ['target'], relayEnd: 2, expectedRevision: p.revision })), /库存已变化/)
  const before = f.calls.length
  await assert.rejects(f.engine.previewRelay(['donor'], ['target'], 2, 2), /目标号码/)
  await assert.rejects(f.engine.previewRelay(['other-owner'], ['other-owner'], 2, 2), /不在账号池/)
  assert.equal(f.calls.length, before)
})
test('接力抽图响应丢失，重启恢复只核验一次，然后继续其他目标', async t => {
  const f = setup(t); addTarget(f, 'target2', info())
  const j = await relayJob(f, ['target', 'target2']); f.options.dropDraw = true
  await run(f.engine, j); assert.equal(j.status, 'paused'); assert.equal(j.checkpoint?.kind, 'draw')
  f.store.close(); const restored = new Store(f.dir), engine = new Engine(restored, f.transport)
  t.after(() => restored.close())
  // The mock transport operates on the live simulated upstream, independent of the restored journal.
  engine.io.query = async id => { const latest = clone(f.store.account(id).info!); restored.account(id).info = latest; return clone(latest) }
  f.options.dropDraw = false
  const resumed = restored.state.jobs[0]; await run(engine, resumed)
  assert.equal(resumed.status, 'completed'); assert.deepEqual(resumed.relayDrawn, ['target:2', 'target2:2'])
  assert.equal(f.calls.filter(c => c.startsWith('draw')).length, 2)
})
test('接力未抽中缺图会持续暂停，继续不重抽、不切换目标', async t => {
  const f = setup(t); addTarget(f, 'target2', info())
  const j = await relayJob(f, ['target', 'target2']); f.options.wrongPrize = true
  await run(f.engine, j); assert.equal(j.status, 'paused'); assert.equal(j.to, 'target')
  await run(f.engine, j); assert.equal(j.status, 'paused'); assert.equal(j.relayDrawn!.length, 1)
  assert.equal(f.calls.filter(c => c.startsWith('draw')).length, 1)
})
test('接力没有次数或门槛差一张时不搬运、不抽图；目标自身已达标也可参与', async t => {
  const f = setup(t, info(1, 1), info(11))
  const zero = clone(f.store.account('target').info!); zero.drawTimes = '0'
  assert.equal(relayStage([{ ...f.store.view().accounts[1], info: zero }], ['target'], 'target', 2).strategy, 'blocked')
  assert.equal(relayStage([{ ...f.store.view().accounts[1], info: info(10) }], ['target'], 'target', 2).strategy, 'blocked')
  const p = await f.engine.previewRelay(['target'], ['target'], 2, 2)
  const j = await f.engine.create(f.input({ kind: 'relay', donors: ['target'], to: '', relayTargets: ['target'], relayEnd: 2, expectedRevision: p.revision }))
  await run(f.engine, j); assert.equal(j.status, 'completed'); assert.equal(j.transfersDone, 0); assert.deepEqual(j.relayDrawn, [stageKey('target', 2)])
})

test('每档任意编号都可能缺失；只缺一张且其他各 11 张才达标', () => {
  for (const r of ROUNDS) for (let gap = 0; gap < r.size; gap++) {
    assert.equal(ordinaryReady(info(10, 0, r.round, gap), r.round), false)
    assert.equal(ordinaryReady(info(11, 0, r.round, gap), r.round), true)
    assert.equal(missingIndex(info(11, 0, r.round, gap), r.round), gap)
    assert.equal(ordinaryReady(info(11, 1, r.round, gap), r.round), false)
  }
  const many = info(11); many.pictureList!['2'].dp2_0 = '0'; assert.equal(ordinaryReady(many, 2), false); assert.deepEqual(missingPieces(many, 2), [0, 3])
  const x = info(11); x.r5DrawStatus = 3; assert.equal(canDraw(x, 2), false)
})
test('可转数量扣除每种最后一张，并按拼图编号计算缺口', t => {
  const f = setup(t, info(2, 1), info(9))
  const p = planTransfers(f.store.view().accounts, ['donor', 'donor'], 'target', 2, 'fill')
  assert.equal(p.total, 5); assert.equal(p.shortages.length, 5); assert.ok(p.shortages.every(s => s.need === 1)); assert.ok(!p.transfers.some(x => x.piece === 'dp2_3'))
})
test('批量生成、领取、核验严格串行；达 11 后仅抽一次', async t => {
  const f = setup(t), j = await f.engine.create(f.input())
  await run(f.engine, j)
  assert.equal(j.status, 'completed'); assert.equal(j.transfersDone, 5); assert.equal(j.drawDone, true)
  assert.equal(f.maxActive(), 1); assert.equal(f.calls.filter(c => c.startsWith('draw')).length, 1)
  for (let i = 0; i < 6; i++) assert.equal(count(f.store.account('donor').info, 2, i), 1)
})
test('可转库存不足时不越过门槛抽图', async t => {
  const f = setup(t, info(1, 1)), j = await f.engine.create(f.input())
  await run(f.engine, j); assert.equal(j.drawDone, false); assert.equal(j.transfersDone, 0); assert.equal(f.calls.some(c => c.startsWith('draw')), false)
})
test('全部余图模式转出固定余量，不转最后一张', async t => {
  const f = setup(t, info(3, 2), info(0)), j = await f.engine.create(f.input({ mode: 'all', autoDraw: false }))
  await run(f.engine, j); assert.equal(j.status, 'completed'); assert.equal(j.transfersDone, 11)
  assert.equal(j.drawDone, false); assert.equal(j.remaining?.length, 0)
  for (let i = 0; i < 6; i++) assert.equal(count(f.store.account('donor').info, 2, i), 1)
})
test('赠送时扣库存的上游行为也能正确核验', async t => {
  const f = setup(t); f.options.deductOnGift = true
  const j = await f.engine.create(f.input()); await run(f.engine, j); assert.equal(j.transfersDone, 5); assert.equal(j.status, 'completed')
})
test('领取成功但响应丢失，通过库存确认，不再生成 Token', async t => {
  const f = setup(t); f.options.dropReceive = true
  const j = await f.engine.create(f.input()); await run(f.engine, j); assert.equal(j.status, 'completed'); assert.equal(j.transfersDone, 5); assert.equal(f.calls.filter(c => c.startsWith('gift')).length, 5)
})
test('生成 Token 结果不明，恢复时禁止重发', async t => {
  const f = setup(t); f.options.dropGift = true
  const j = await f.engine.create(f.input()); await run(f.engine, j); assert.equal(j.status, 'paused'); assert.equal(j.checkpoint?.kind, 'gift'); assert.equal(j.checkpoint?.token, undefined)
  f.options.dropGift = false; await run(f.engine, j); assert.equal(j.status, 'paused'); assert.equal(f.calls.filter(c => c.startsWith('gift')).length, 1)
})
test('抽图响应丢失，继续仅核验一次抽图，不重复抽', async t => {
  const f = setup(t); f.options.dropDraw = true
  const j = await f.engine.create(f.input()); await run(f.engine, j); assert.equal(j.status, 'paused'); assert.equal(j.checkpoint?.kind, 'draw')
  f.options.dropDraw = false; await run(f.engine, j); assert.equal(j.status, 'completed'); assert.equal(j.drawDone, true); assert.equal(f.calls.filter(c => c.startsWith('draw')).length, 1)
})
test('未抽中稀有图时暂停，后续继续也不会第二次抽', async t => {
  const f = setup(t); f.options.wrongPrize = true
  const j = await f.engine.create(f.input()); await run(f.engine, j); assert.equal(j.status, 'paused'); assert.equal(j.drawDone, true)
  await run(f.engine, j); assert.equal(f.calls.filter(c => c.startsWith('draw')).length, 1)
})
test('相同幂等 ID 只创建一个任务，队列期间拒绝并发操作', async t => {
  const f = setup(t), input = f.input(), j = await f.engine.create(input)
  assert.equal((await f.engine.create(input)).id, j.id); assert.equal(f.store.state.jobs.length, 1)
  f.engine.start(j); await assert.rejects(f.engine.exclusive(async () => 'bad'), /队列/)
  while (f.engine.busy) await new Promise(r => setTimeout(r, 2))
})
test('执行前库存与已确认预览不同，拒绝扩大转赠范围', async t => {
  const f = setup(t)
  const preview = planTransfers(f.store.view().accounts, ['donor'], 'target', 2, 'all')
  f.store.account('donor').info!.pictureList!['2'].dp2_0 = '3'
  await assert.rejects(f.engine.create(f.input({ mode: 'all', expectedTransfers: preview.transfers })), /库存已变化/)
  assert.equal(f.store.state.jobs.length, 0); assert.equal(f.calls.some(c => c.startsWith('gift')), false)
})
test('请求暂停保留进度，恢复只处理剩余转赠', async t => {
  const f = setup(t), j = await f.engine.create(f.input())
  const receive = f.transport.receive
  f.transport.receive = async (...args) => { const r = await receive(...args); f.engine.stop(j); return r }
  await run(f.engine, j); assert.equal(j.status, 'paused'); assert.equal(j.transfersDone, 1); assert.equal(j.checkpoint, undefined)
  f.transport.receive = receive; await run(f.engine, j); assert.equal(j.transfersDone, 5); assert.equal(j.status, 'completed')
})
test('每日任务类型 1/2/3/5/6 直接尝试，4 走插件；全部复查', async t => {
  const f = setup(t)
  f.taskRows.push(...['1', '2', '3', '4', '5', '6', '9'].map((type, i) => ({ taskId: `t${type}`, title: `任务${type}`, order: i, taskType: type, status: 0, completedTimes: 0, requireTimes: 1, raw: {}, jumpUrl: 'https://wx.10086.cn/example' })))
  const j = await f.engine.create(f.input({ kind: 'daily', donors: ['target'], to: '', autoDraw: false }))
  await run(f.engine, j); assert.equal(j.status, 'completed'); assert.equal(j.tasksDone.length, 6)
  assert.deepEqual(f.calls.filter(c => c.startsWith('finish')), ['finish:t1', 'finish:t2', 'finish:t3', 'finish:t5', 'finish:t6'])
  assert.ok(f.calls.indexOf('jt:t4') < f.calls.indexOf('open')); assert.ok(f.calls.indexOf('open') < f.calls.indexOf('openFinish')); assert.equal(f.maxActive(), 1)
})
test('接口接受但进度未确认时不虚报、不重复提交，并继续其他任务', async t => {
  const f = setup(t); f.options.unchangedTask = true; f.taskRows.push({ taskId: 't2', title: '邀请任务', taskType: '2', status: 0, completedTimes: 0, requireTimes: 1, order: 0, raw: {} })
  f.taskRows.push({ taskId: 'next', title: '后续任务', taskType: '1', status: 0, completedTimes: 0, requireTimes: 1, order: 1, raw: {} })
  const j = await f.engine.create(f.input({ kind: 'daily', donors: ['target'], to: '' })); await run(f.engine, j); assert.equal(j.status, 'completed'); assert.equal(j.tasksDone.length, 0)
  assert.equal(j.tasksUnconfirmed?.length, 2); assert.equal(f.calls.filter(c => c === 'finish:t2').length, 1); assert.ok(f.calls.includes('finish:next'))
})
test('每日任务明确拒绝时记录失败，继续后续任务', async t => {
  const f = setup(t)
  f.taskRows.push({ taskId: 'fail', title: '邀请任务', taskType: '2', status: 0, completedTimes: 0, requireTimes: 1, order: 0, raw: {} }, { taskId: 'next', title: '下一任务', taskType: '1', status: 0, completedTimes: 0, requireTimes: 1, order: 1, raw: {} })
  const finish = f.transport.finish
  f.transport.finish = async (id, taskId) => { if (taskId === 'fail') throw new WedBusinessError('NOT_ELIGIBLE', '不符合条件'); return finish(id, taskId) }
  const j = await f.engine.create(f.input({ kind: 'daily', donors: ['target'], to: '' })); await run(f.engine, j)
  assert.equal(j.status, 'completed'); assert.equal(j.tasksDone.length, 1); assert.ok(j.logs.some(l => l.message.includes('提交失败'))); assert.ok(f.calls.includes('finish:next'))
  assert.deepEqual(j.tasksFailed, ['target:fail']); assert.equal(f.store.view().jobs[0].tasksFailed, 1)
  assert.ok(j.logs.some(l => l.message.includes('1 项未通过')))
})
test('独立抽图入口也必须各普通图达到 11 张，并只抽一次', async t => {
  const f = setup(t)
  await assert.rejects(f.engine.create(f.input({ kind: 'draw', donors: [] })), /大于 10/)
  f.store.account('target').info = info(11)
  const j = await f.engine.create(f.input({ kind: 'draw', donors: [] })); await run(f.engine, j)
  assert.equal(j.status, 'completed'); assert.equal(j.drawDone, true); assert.equal(f.calls.filter(c => c.startsWith('draw')).length, 1)
})
test('活动身份校验、脱敏校验和导入格式拒绝混用', () => {
  assert.equal(profilePhone({ code: '0', data: { phone: '139****0001', mobileCode: 'encrypted-mobile' } }, '13912340001').phone, '13912340001')
  assert.throws(() => profilePhone({ code: '0', data: { phone: '138****9999', mobileCode: 'x' } }, '13912340001'), /不一致/)
  assert.throws(() => profilePhone({ code: 'GOTO_LOGIN' }, '13912340001'), /失效/)
  assert.equal(parseImport('Cookie: HLWHD_SESSION_TOKEN=fake').cookie, 'HLWHD_SESSION_TOKEN=fake')
  assert.throws(() => parseImport('{"token":"raw-app"}'), /sid/)
  assert.throws(() => parseImport('{"token":"raw-app","activityUrl":"https://attacker.invalid/path"}'), /官方/)
  assert.equal(decodePayload(Buffer.from('{"code":"0"}').toString('base64')).code, '0')
})
test('转赠两层业务码与 giveCard 解析正确', () => {
  const token = 'a'.repeat(32)
  assert.equal(parseWedGiftToken({ code: '0', data: { code: '0', data: token } }), token)
  assert.throws(() => parseWedGiftToken({ code: '0', data: { code: '500', data: token } }))
  assert.equal(parseWedReceiveToken(`https://wx.10086.cn/hlwyxhdhub/act-wedrecharge/1024101716?giveCard=${token}`), token)
  assert.throws(() => parseWedReceiveToken(`https://evil.invalid/?giveCard=${token}`))
})
test('账号库与 Token 加密，重启暂停检查点；同库多进程被拒绝', async t => {
  const f = setup(t), j = await f.engine.create(f.input())
  j.status = 'running'; j.checkpoint = { kind: 'gift', round: 2, from: 'donor', to: 'target', piece: 'dp2_0', token: 'fake-private-gift-token', before: info(), fromBefore: 2 }; f.store.save()
  const bytes = fs.readFileSync(path.join(f.dir, 'state.enc')).toString('utf8'); assert.ok(!bytes.includes('test-secret')); assert.ok(!bytes.includes('fake-private-gift-token')); assert.ok(!bytes.includes('13900000001'))
  assert.throws(() => new Store(f.dir), /另一个/)
  f.store.close(); const reopened = new Store(f.dir); t.after(() => reopened.close()); assert.equal(reopened.state.jobs[0].status, 'paused'); assert.equal(reopened.state.jobs[0].checkpoint?.token, 'fake-private-gift-token')
  assert.equal(reopened.view().jobs[0].pending, 'gift'); assert.ok(!JSON.stringify(reopened.view()).includes('fake-private-gift-token'))
})
test('独立包的官方 AES 资产能够完成网页加密往返', async () => { const source = '13900000001'; assert.equal(await aesDecrypt(await aesEncrypt(source)), source) })

test('任意缺图的实际抽取按该账号库存核验，不使用旧固定编号', async t => {
  const f = setup(t, info(1, 1, 2, 0), info(11, 0, 2, 0))
  const j = await f.engine.create(f.input({ kind: 'draw', donors: [] }))
  await run(f.engine, j)
  assert.equal(j.status, 'completed'); assert.equal(count(f.store.account('target').info, 2, 0), 1)
  assert.deepEqual(j.drawnRounds, [2]); assert.ok(j.logs.some(l => l.message.includes('1 号缺失拼图')))
})

test('转赠直接填补最后缺图时不消耗抽图次数；全部余图完整转出', async t => {
  const f = setup(t, info(3, 3, 2, 2), info(10, 0, 2, 2))
  const j = await f.engine.create(f.input({ mode: 'all' }))
  await run(f.engine, j)
  assert.equal(j.status, 'completed'); assert.equal(j.transfersDone, 12)
  assert.equal(f.calls.filter(c => c.startsWith('draw:')).length, 0)
})

function chain(t: TestContext) {
  const f = setup(t)
  for (const [id, n, missing] of [['donor', 2, 1], ['target', 10, 0]] as const) {
    const i = f.store.account(id).info!
    for (const r of ROUNDS) i.pictureList![String(r.round)] = info(n, missing, r.round, [3, 0, 7][r.round - 1]).pictureList![String(r.round)]
    Object.assign(i, { activeIndex: 1, r6Status: 1, r5Status: 4, r4Status: 4, r6DrawStatus: 1, r5DrawStatus: 3, r4DrawStatus: 3, drawTimes: '5' })
  }
  f.store.save(); return f
}
test('接力跨三档解锁并接力下一号码，每个号码每档独立抽取', async t => {
  const f = chain(t); addTarget(f, 'target2', clone(f.store.account('target').info!))
  const j = await relayJob(f, ['target', 'target2'], 1, 3); await run(f.engine, j)
  assert.equal(j.status, 'completed'); assert.equal(j.relayCompleted!.length, 6); assert.equal(j.relayDrawn!.length, 6)
  assert.deepEqual(j.relayDrawn, ['target:1', 'target:2', 'target:3', 'target2:1', 'target2:2', 'target2:3'])
  assert.equal(f.calls.filter(c => c.startsWith('redeem:')).length, 4)
  assert.equal(f.store.account('target2').info!.r4Status, 2, '最后一档不自动领券')
})
test('接力领券解锁响应丢失后核验原记录，不能重复领取', async t => {
  const f = chain(t), redeem = f.transport.redeem; let dropped = false
  f.transport.redeem = async (...args) => { await redeem(...args); if (!dropped) { dropped = true; throw new Error('领券响应丢失') } }
  const j = await relayJob(f, ['target'], 1, 3)
  await run(f.engine, j); assert.equal(j.status, 'paused'); assert.equal(j.checkpoint?.kind, 'redeem')
  await run(f.engine, j); assert.equal(j.status, 'completed'); assert.equal(j.relayDrawn!.length, 3)
  assert.equal(f.calls.filter(c => c.startsWith('redeem:')).length, 2)
})
test('95 折→9 折→8 折连续串行，必要时领券解锁，每档仅抽一次', async t => {
  const f = chain(t), j = await f.engine.create(f.input({ round: 1, mode: 'all', autoAdvance: true }))
  await run(f.engine, j)
  assert.equal(j.status, 'completed'); assert.equal(j.round, 3)
  assert.equal(j.transfersDone, 16); assert.deepEqual(j.drawnRounds, [1, 2, 3]); assert.deepEqual(j.completedRounds, [1, 2, 3])
  assert.equal(f.calls.filter(c => c.startsWith('redeem:')).length, 2); assert.equal(f.maxActive(), 1)
  assert.ok(f.calls.indexOf('draw:target') < f.calls.indexOf('redeem:target'))
})
test('自动跨档领券响应丢失后只核验，不重复领券或重复抽取前一档', async t => {
  const f = chain(t), redeem = f.transport.redeem
  let lost = true
  f.transport.redeem = async (...args) => { await redeem(...args); if (lost) { lost = false; throw new Error('领券响应丢失') } }
  const j = await f.engine.create(f.input({ round: 1, mode: 'all', autoAdvance: true }))
  await run(f.engine, j); assert.equal(j.status, 'paused'); assert.equal(j.checkpoint?.phase, 'advance')
  await run(f.engine, j); assert.equal(j.status, 'completed'); assert.deepEqual(j.drawnRounds, [1, 2, 3])
  assert.equal(f.calls.filter(c => c.startsWith('redeem:')).length, 2)
})
test('跨档不足时暂停在当前档，不越级、不额外抽图', async t => {
  const f = chain(t)
  f.store.account('donor').info!.pictureList!['2'].dp2_1 = '1'
  const j = await f.engine.create(f.input({ round: 1, mode: 'all', autoAdvance: true }))
  await run(f.engine, j); assert.equal(j.status, 'paused'); assert.equal(j.round, 2); assert.deepEqual(j.drawnRounds, [1])
})
test('单项任务过滤，插件快速上报不等待 60 秒，先取齐参数', async t => {
  const f = setup(t)
  f.taskRows.push(...['1', '4'].map((type, order) => ({ taskId: `t${type}`, title: type, taskType: type, status: 0, completedTimes: 0, requireTimes: 1, order, raw: {} })))
  f.transport.open = async () => { f.calls.push('open'); return { cToken: 'test-only', scanTimeSeconds: 60, raw: {} } }
  const j = await f.engine.create(f.input({ kind: 'daily', donors: ['target'], to: '', taskFilter: ['t4'], fastTasks: true }))
  await run(f.engine, j); assert.equal(j.status, 'completed'); assert.equal(j.tasksDone.length, 1)
  assert.equal(f.calls.includes('finish:t1'), false); assert.ok(f.calls.indexOf('jt:t4') < f.calls.indexOf('open')); assert.ok(f.calls.indexOf('open') < f.calls.indexOf('openFinish'))
})
test('邀请两次额度逐次查询、上报和复核，非零状态的任务不提交', async t => {
  const f = setup(t)
  const task = { taskId: 'invite', title: '邀请任务', taskType: '2', status: 0, completedTimes: 0, requireTimes: 2, order: 0, raw: {} }
  f.taskRows.push(task, { ...task, taskId: 'tomorrow', title: '明日任务', status: 1 })
  f.transport.finish = async (id, taskId) => { f.calls.push(`finish:${taskId}`); task.completedTimes++; task.status = task.completedTimes === 2 ? 1 : 0; f.store.account(id).info!.drawTimes = String(Number(f.store.account(id).info!.drawTimes) + 1); return { message: '0', raw: {} } }
  const j = await f.engine.create(f.input({ kind: 'daily', donors: ['target'], to: '' }))
  await run(f.engine, j); assert.equal(j.status, 'completed'); assert.equal(j.tasksDone.length, 2)
  assert.equal(f.calls.filter(c => c === 'finish:invite').length, 2); assert.equal(f.calls.includes('finish:tomorrow'), false)
})
test('每日任务响应不明时暂停，继续只核验不盲目重复上报', async t => {
  const f = setup(t)
  f.taskRows.push({ taskId: 'unknown', title: '上报超时', taskType: '3', status: 0, completedTimes: 0, requireTimes: 1, order: 0, raw: {} })
  f.transport.finish = async () => { f.calls.push('uncertainFinish'); throw new Error('提交连接中断') }
  const j = await f.engine.create(f.input({ kind: 'daily', donors: ['target'], to: '' }))
  await run(f.engine, j); assert.equal(j.status, 'paused'); assert.equal(j.checkpoint?.phase, undefined)
  await run(f.engine, j); assert.equal(j.status, 'paused'); assert.equal(f.calls.filter(c => c === 'uncertainFinish').length, 1)
})

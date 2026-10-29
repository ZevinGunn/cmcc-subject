import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isGlobalDailyAuthError, isGlobalDailyScheduleDue, runGlobalTelecomDaily, type GlobalDailyOperations } from '../services/globalTelecomDaily.js'
import type { GlobalTelecomOverview } from '../services/globalTelecom.js'

function fixture() {
  const calls: string[] = []
  const sign: GlobalTelecomOverview['sign'] = { reSignRemaining: 2, days: [
    { dayNum: 3, signStatus: 0, reSign: false, tasks: [] },
    { dayNum: 2, signStatus: 2, reSign: true, tasks: [{ taskId: 2, taskStatus: 0 }] },
    { dayNum: 1, signStatus: 2, reSign: true, tasks: [{ taskId: 1, taskStatus: 0 }, { taskId: 2, taskStatus: 0 }] },
  ] }
  const blind: GlobalTelecomOverview['blindBox'] = { drawTotal: 2, drawRemaining: 1, drawUsed: 0, drawLimit: 2,
    drawAllowed: true, prizes: [], tasks: [
      { number: 1, available: true, completed: false }, { number: 2, available: false, completed: false },
    ] }
  let inFlight = 0
  let maxInFlight = 0
  const serial = async <T>(name: string, fn: () => T) => {
    calls.push(name); inFlight += 1; maxInFlight = Math.max(maxInFlight, inFlight)
    await Promise.resolve()
    try { return fn() } finally { inFlight -= 1 }
  }
  const ops: GlobalDailyOperations = {
    querySign: () => serial('query-sign', () => structuredClone(sign)),
    sign: () => serial('sign', () => { sign.days[0].signStatus = 1 }),
    resign: (dayNum, taskIds) => serial(`resign:${dayNum}:${taskIds}`, () => {
      const day = sign.days.find(day => day.dayNum === dayNum)!
      for (const id of taskIds) day.tasks.find(task => task.taskId === id)!.taskStatus = 1
      if (day.tasks.every(task => task.taskStatus !== 0)) { day.signStatus = 1; sign.reSignRemaining -= 1 }
    }),
    queryBlindBox: () => serial('query-blind', () => structuredClone(blind)),
    completeTask: number => serial(`task:${number}`, () => {
      blind.tasks.find(task => task.number === number)!.completed = true
      blind.drawRemaining += 1
    }),
    draw: () => serial('draw', () => {
      blind.drawUsed += 1; blind.drawRemaining -= 1
      blind.drawAllowed = blind.drawRemaining > 0 && blind.drawUsed < blind.drawLimit!
      return { accessToken: 'mock-token', payload: {}, message: '已抽中测试奖品，请确认领取' }
    }),
    renew: () => serial('renew', () => {}),
    progress: async () => {}, isAuthError: isGlobalDailyAuthError,
  }
  return { ops, calls, sign, blind, maxInFlight: () => maxInFlight }
}

test('每日按签到、日期顺序补签、开放任务、官方机会串行抽奖', async () => {
  const f = fixture()
  const result = await runGlobalTelecomDaily(f.ops)
  assert.equal(result.status, 'success')
  assert.deepEqual(f.calls.filter(call => /^(sign$|resign:|task:|draw$)/.test(call)), [
    'sign', 'resign:1:1', 'resign:1:2', 'resign:2:2', 'task:1', 'draw', 'draw',
  ])
  assert.equal(f.maxInFlight(), 1)
  assert.equal(f.sign.reSignRemaining, 0)
})

test('零补签次数、已签到、无抽奖机会均不提交对应操作', async () => {
  const f = fixture()
  f.sign.days[0].signStatus = 1; f.sign.reSignRemaining = 0
  f.blind.tasks[0].completed = true; f.blind.drawRemaining = 0; f.blind.drawAllowed = false
  assert.equal((await runGlobalTelecomDaily(f.ops)).status, 'success')
  assert.equal(f.calls.some(call => /^(sign$|resign:|task:|draw$)/.test(call)), false)
})

test('只在明确认证失效时置换并回查，不以 403 或网络失败推断过期', async () => {
  for (const message of ['未登录', 'Token 已过期', 'HTTP 401', 'HTTP 403', '网络超时']) {
    const f = fixture(); const original = f.ops.querySign; let once = false
    f.ops.querySign = async () => { if (!once) { once = true; throw new Error(message) }; return original() }
    await runGlobalTelecomDaily(f.ops)
    assert.equal(f.calls.filter(call => call === 'renew').length, /未登录|过期|401/.test(message) ? 1 : 0)
  }
})

test('签到响应丢失但回查成功，不重复签到', async () => {
  const f = fixture(); const original = f.ops.sign
  f.ops.sign = async () => { await original(); throw new Error('网络超时') }
  assert.equal((await runGlobalTelecomDaily(f.ops)).status, 'success')
  assert.equal(f.calls.filter(call => call === 'sign').length, 1)
})

test('补签失败后重新读取剩余次数，不能继续消耗旧额度', async () => {
  const f = fixture()
  f.ops.resign = async () => { f.calls.push('resign-failure'); f.sign.reSignRemaining = 0; throw new Error('上游异常') }
  const result = await runGlobalTelecomDaily(f.ops)
  assert.equal(result.status, 'failed')
  assert.equal(f.calls.filter(call => call === 'resign-failure').length, 1)
  assert.ok(f.calls.includes('draw'), '补签失败不妨碍独立盲盒流程')
})

test('抽奖超时、认证拒绝、次数未变化均停止，绝不重复提交', async () => {
  for (const failure of ['timeout', 'auth', 'quota-stale']) {
    const f = fixture()
    f.ops.draw = async () => {
      f.calls.push('ambiguous-draw')
      if (failure === 'timeout') { f.blind.drawUsed += 1; f.blind.drawRemaining -= 1; throw new Error('网络超时') }
      if (failure === 'auth') throw new Error('未登录')
      return { accessToken: 'mock-token', payload: {}, message: '上游返回成功' }
    }
    const result = await runGlobalTelecomDaily(f.ops)
    assert.equal(result.status, 'failed')
    assert.equal(f.calls.filter(call => call === 'ambiguous-draw').length, 1)
    assert.equal(f.calls.filter(call => call === 'renew').length, failure === 'auth' ? 1 : 0)
  }
})

test('阶段限额和未知月份不尝试抽奖', async () => {
  const f = fixture()
  f.blind.drawUsed = 2; f.blind.drawAllowed = false
  await runGlobalTelecomDaily(f.ops)
  assert.equal(f.calls.includes('draw'), false)
  f.blind.tasks = []; f.blind.drawAllowed = false; f.blind.unavailableReason = '本期活动任务清单需更新'
  const result = await runGlobalTelecomDaily(f.ops)
  assert.equal(result.status, 'failed')
  assert.match(result.message, /任务清单需更新/)
})

test('每日计划支持北京时间到点及当日停机后补跑，不提前触发', () => {
  assert.equal(isGlobalDailyScheduleDue(479, 480), false)
  assert.equal(isGlobalDailyScheduleDue(480, 480), true)
  assert.equal(isGlobalDailyScheduleDue(1439, 480), true)
  assert.equal(isGlobalDailyScheduleDue(480, -1), false)
})

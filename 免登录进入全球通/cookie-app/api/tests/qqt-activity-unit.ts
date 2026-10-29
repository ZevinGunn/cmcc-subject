import assert from 'node:assert/strict'
import https from 'node:https'
import { EventEmitter } from 'node:events'
import { Readable } from 'node:stream'
import { mock } from 'node:test'
import { qqtSign } from '../services/qqtSign.js'
import { globalTelecomResign, queryGlobalTelecomSign, queryGlobalTelecomBlindBox, globalTelecomBlindBoxAction, __test__ as globalTest } from '../services/globalTelecom.js'
import { blindBoxCampaign, mergeBlindBoxTasks, readBlindBoxDraw, blindBoxFulfillmentUrl } from '../services/qqtBlindBox.js'
import { verifyQqtActivityState } from '../services/qqtActivityState.js'

const calls: Array<{ path: string; body: string }> = []
let respond: (path: string, body: string) => unknown = () => ({ status: '1', data: {} })
let inFlight = 0
let maxInFlight = 0
// Intercept the only upstream transport. No live account or activity requests are permitted.
const transport = mock.method(https, 'request', ((url: string, options: { headers?: object }, callback: (res: unknown) => void) => {
  const request = new EventEmitter() as EventEmitter & {
    getHeaders: () => object; setTimeout: () => void; write: (data: string) => void; end: () => void
  }
  let body = ''
  request.getHeaders = () => options.headers || {}
  request.setTimeout = () => undefined
  request.write = (data) => { body += data }
  request.end = () => {
    const path = new URL(url).pathname
    assert.equal(new URL(url).hostname, 'qqt.cmicrwx.cn')
    calls.push({ path, body })
    inFlight += 1
    maxInFlight = Math.max(maxInFlight, inFlight)
    queueMicrotask(() => {
      const payload = respond(path, body)
      const response = Object.assign(Readable.from([typeof payload === 'string' ? payload : JSON.stringify(payload)]), {
        statusCode: 200, headers: {},
      })
      response.on('end', () => { inFlight -= 1 })
      callback(response)
    })
  }
  return request
}) as unknown as typeof https.request)

const args = { cmccCookie: '', accessToken: 'mock-activity-token', sspid: 'mock-channel' }
const signInfo = (status: number) => ({ status: '1', data: { reSignNum: 2, signDates: [{ dayNum: 1, signStatus: status }] } })
try {
  const october = new Date('2026-10-14T04:00:00Z')
  const counts = { drawTotal: 3, drawUsed: 0, drawRemain: 2 }
  const empty = globalTest.normalizeBlindBox({ status: '1', data: { ...counts, tasks: [] } }, undefined, october)
  assert.deepEqual(empty.tasks.map((task) => [task.number, task.name, task.completed, task.available]), [
    [1, '浏览全球通商旅礼遇页面', false, true], [2, '浏览逐马计划页面', false, true], [3, '浏览尊享云页面', false, false],
  ])
  assert.equal(empty.drawAllowed, true)
  assert.equal(globalTest.normalizeBlindBox({ status: '1', data: { ...counts, drawUsed: 2, tasks: [] } }, undefined, october).drawAllowed, false)
  assert.equal(globalTest.normalizeBlindBox({ status: '1', data: { ...counts, drawRemain: -1, tasks: [] } }, undefined, october).drawRemaining, 0)
  assert.equal(mergeBlindBoxTasks([], new Date('2026-10-25T15:59:59Z'))[2].available, false)
  assert.equal(mergeBlindBoxTasks([], new Date('2026-10-25T16:00:00Z'))[2].available, true)
  assert.deepEqual(mergeBlindBoxTasks([{ number: 2, flag: true }], october).map((task) => task.completed), [false, true, false])
  assert.equal(mergeBlindBoxTasks([{ number: 9, flag: false }], october)[3].available, false)
  assert.throws(() => mergeBlindBoxTasks([{ number: 1, flag: null }], october))
  assert.throws(() => mergeBlindBoxTasks([{ number: 1, flag: true }, { number: 1, flag: false }], october))
  assert.equal(blindBoxCampaign(new Date('2026-09-14T00:00:00Z')).tasks[0].name, '浏览逐马计划页面')
  assert.equal(blindBoxCampaign(new Date('2026-11-01T00:00:00Z')).known, false)
  assert.equal(globalTest.normalizeBlindBox({ status: '1', data: { ...counts, tasks: [] } }, undefined, new Date('2026-11-01')).drawAllowed, false)
  assert.deepEqual(readBlindBoxDraw({ data: { prizeCode: 9999 } }), { prizeCode: '9999', prizeName: undefined })
  assert.throws(() => readBlindBoxDraw({ status: '1', data: {} }), /结果尚未确认/)
  assert.equal(blindBoxFulfillmentUrl('3994'), 'https://www.wjx.top/vm/QzzW800.aspx#')

  // Activity mutations use only mock transport and fixed campaign time.
  const realNow = Date
  const dateMock = mock.method(globalThis, 'Date', class extends realNow {
    constructor(value?: string | number) { super(value ?? october.getTime()) }
    static now() { return october.getTime() }
  } as DateConstructor)
  try {
    for (const scenario of ['success', 'not-applied', 'upstream-failure', 'partial', 'already-completed']) {
      calls.length = 0
      const done = new Set<number>(scenario === 'already-completed' ? [1, 2] : [])
      respond = (path, body) => {
        if (path.endsWith('/member/func/queryVipLevel.do')) return { status: '1', data: { userLevel: 4 } }
        if (path.endsWith('/luckBox/status')) return { status: '1', data: { ...counts, tasks: [...done].map((number) => ({ number, flag: true })) } }
        if (path.endsWith('/luckBox/completeTask')) {
          const number = JSON.parse(body).number
          if (scenario === 'upstream-failure' || scenario === 'partial' && number === 1) return { status: '0', msg: '活动火爆' }
          if (scenario !== 'not-applied') done.add(number)
        }
        return { status: '1', data: {} }
      }
      const completed = await globalTelecomBlindBoxAction({ ...args, action: 'complete-all' })
      const result = completed.payload as { data: { completed: number[]; failures: string[] } }
      assert.deepEqual(calls.filter((call) => call.path.endsWith('/luckBox/completeTask')).map((call) => JSON.parse(call.body).number), scenario === 'already-completed' ? [] : [1, 2])
      assert.equal(result.data.completed.length, scenario === 'success' ? 2 : scenario === 'partial' ? 1 : 0)
      assert.equal(result.data.failures.length, ['not-applied', 'upstream-failure'].includes(scenario) ? 2 : scenario === 'partial' ? 1 : 0)
    }
    calls.length = 0
    respond = (path) => path.endsWith('/member/func/queryVipLevel.do') ? { status: '1', data: { userLevel: 4 } } :
      { status: '1', data: { ...counts, tasks: [] } }
    await assert.rejects(globalTelecomBlindBoxAction({ ...args, action: 'complete-task', taskNumber: 3 }), /开放/)
    assert.equal(calls.some((call) => call.path.endsWith('/luckBox/completeTask')), false)

    for (const prizeCode of [9999, 4001, 3994, undefined]) {
      calls.length = 0
      respond = (path) => path.endsWith('/member/func/queryVipLevel.do') ? { status: '1', data: { userLevel: 4 } } :
        path.endsWith('/luckBox/status') ? { status: '1', data: { ...counts, tasks: [] } } : { status: '1', data: { prizeCode } }
      if (prizeCode === undefined) await assert.rejects(globalTelecomBlindBoxAction({ ...args, action: 'draw' }), /勿重复抽奖/)
      else assert.equal((await globalTelecomBlindBoxAction({ ...args, action: 'draw' })).blindBoxPrize?.prizeCode, String(prizeCode))
      assert.equal(calls.filter((call) => call.path.endsWith('/luckBox/draw')).length, 1, 'no retry of a draw')
      assert.deepEqual(JSON.parse(calls.find((call) => call.path.endsWith('/luckBox/draw'))!.body), { channelCode: args.sspid, type: 1 })
    }
    calls.length = 0
    respond = (path) => path.endsWith('/member/func/queryVipLevel.do') ? { status: '1', data: { userLevel: 4 } } : { status: '1', data: {} }
    const received = await globalTelecomBlindBoxAction({ ...args, action: 'receive', prizeCode: '3994' })
    assert.ok(received.blindBoxPrize?.fulfillmentUrl)
    assert.deepEqual(JSON.parse(calls.find((call) => call.path.endsWith('/luckBox/receive'))!.body), { prizeCode: 3994, channelCode: args.sspid })
    await assert.rejects(globalTelecomBlindBoxAction({ ...args, action: 'receive', prizeCode: '9999' }), /无有效/)
    await assert.rejects(globalTelecomBlindBoxAction({ ...args, action: 'receive', prizeCode: '09999' }), /无有效/)
    respond = (path) => path.endsWith('/member/func/queryVipLevel.do') ? { status: '1', data: { userLevel: 4 } } :
      path.endsWith('/luckBox/receive') ? { status: '0', msg: '领取失败' } : { status: '1', data: {} }
    await assert.rejects(globalTelecomBlindBoxAction({ ...args, action: 'receive', prizeCode: '4001' }), /领取失败/)
    for (const [drawUsed, drawRemain] of [[0, 0], [2, 1]]) {
      calls.length = 0
      respond = (path) => path.endsWith('/member/func/queryVipLevel.do') ? { status: '1', data: { userLevel: 4 } } :
        { status: '1', data: { ...counts, drawUsed, drawRemain, tasks: [] } }
      await assert.rejects(globalTelecomBlindBoxAction({ ...args, action: 'draw' }), /机会|上限/)
      assert.equal(calls.some((call) => call.path.endsWith('/luckBox/draw')), false)
    }
    respond = (path) => path.endsWith('/member/func/queryVipLevel.do') ? { status: '1', data: { userLevel: 6 } } : { status: '1', data: {} }
    calls.length = 0
    await assert.rejects(globalTelecomBlindBoxAction({ ...args, action: 'draw' }), /参与资格/)
    assert.equal(calls.some((call) => call.path.endsWith('/luckBox/draw')), false)
  } finally { dateMock.mock.restore() }
  for (const scenario of ['query-failure', 'business-failure', 'invalid-body', 'not-applied', 'success', 'already-signed', 'delayed']) {
    calls.length = 0
    let submitted = false
    let readsAfterSubmit = 0
    respond = (path) => {
      if (path.endsWith('/sign/info')) {
        if (scenario === 'query-failure') return { status: '0', msg: '活动火爆' }
        if (submitted) readsAfterSubmit += 1
        return signInfo(scenario === 'already-signed' || (submitted &&
          (scenario === 'success' || (scenario === 'delayed' && readsAfterSubmit > 1))) ? 1 : 0)
      }
      if (path.endsWith('/sign/sign')) {
        submitted = true
        if (scenario === 'business-failure') return { status: '0', msg: '签到失败' }
        if (scenario === 'invalid-body') return '<html>upstream unavailable</html>'
      }
      return { status: '1', data: {} }
    }
    const result = await qqtSign(args)
    assert.equal(result.ok, ['success', 'already-signed', 'delayed'].includes(scenario), scenario)
    assert.equal(calls.filter((call) => call.path.endsWith('/sign/sign')).length,
      ['query-failure', 'already-signed'].includes(scenario) ? 0 : 1, `${scenario}: no duplicate mutations`)
  }

  calls.length = 0
  respond = (path) => path.endsWith('/sign/info') ? signInfo(1) : { status: '1', data: {} }
  const result = await globalTelecomResign({ ...args, dayNum: 1, taskIds: [1, 2, 3, 4] })
  assert.ok(result.payload)
  assert.deepEqual(calls.filter((call) => call.path.endsWith('/sign/finshResignTask')).map((call) => JSON.parse(call.body).taskId), [1, 2, 3, 4])
  assert.equal(maxInFlight, 1, 'upstream requests remain serial')

  respond = (path) => path.endsWith('/sign/info') || path.endsWith('/luckBox/status') ? { status: '1', data: {} } : { status: '1' }
  await assert.rejects(queryGlobalTelecomSign(args), /签到日期数据缺失/)
  await assert.rejects(queryGlobalTelecomBlindBox(args), /盲盒任务数据缺失/)
  assert.ok(calls.some((call) => call.path.endsWith('/member/func/queryVipLevel.do')))

  let renewals = 0
  let ckRecoveries = 0
  respond = (path) => path.endsWith('/sign/info')
    ? renewals ? signInfo(1) : { status: '0', msg: '请先登录' }
    : { status: '1', data: {} }
  const renewed = await queryGlobalTelecomSign({ ...args, accessToken: 'expired-test-token',
    refreshAccessToken: async () => { renewals += 1; return 'renewed-test-token' },
    refreshCmccCookie: async () => { ckRecoveries += 1; throw new Error('10086 recovery must not be used') },
  })
  assert.equal(renewed.accessToken, 'renewed-test-token')
  assert.equal(renewals, 1)
  assert.equal(ckRecoveries, 0)
  respond = (path) => path.endsWith('/sign/info') ? { status: '0', msg: '请先登录' } : { status: '1', data: {} }
  renewals = 0
  await assert.rejects(queryGlobalTelecomSign({ ...args, accessToken: 'expired-again-test-token',
    refreshAccessToken: async () => { renewals += 1; return 'still-expired-test-token' },
  }), /请先登录/)
  assert.equal(renewals, 1, 'Read-only recovery must be bounded to one retry')

  let checks = 0
  assert.equal(await verifyQqtActivityState({
    query: async () => ++checks, completed: (count) => count === 2, message: '未完成',
  }), 2)
  await assert.rejects(verifyQqtActivityState({ query: async () => false, completed: (done) => done, message: '未完成' }), /未完成/)
  console.log('qqt-activity-unit: ok (mock transport only)')
} finally {
  transport.mock.restore()
}

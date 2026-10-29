import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseWedCouponStocks, formatWedCouponStocks, queryAccountWedCouponStocks,
  MonitorAccountChanged } from '../services/wedCouponStock.js'
import { WedAuthenticationExpired, type WedRechargePictureInfo } from '../services/wedRecharge.js'
import { YunpanAuthenticationExpired, isYunpanAuthenticationExpired } from '../services/yunpan10086.js'
import { executeWedStockMonitorCycle, isWedStockMonitorDue, sendWedStockPush,
  WED_STOCK_INTERVAL_MS, type WedStockMonitorState } from '../services/wedCouponStockMonitor.js'
import type { AccountRecord } from '../services/accountsStore.js'

const info = (eight?: number, nine?: number): WedRechargePictureInfo => ({ r4Status: eight, r5Status: nine, raw: {} })
const account: AccountRecord = { id: 'test-account', phone: '13800004812', userId: 'test-user',
  createdAt: '', updatedAt: '', cookie: 'old-wx', wedRechargeCookie: 'old-activity',
  yunpanSession: { authorization: 'test-only', account: '138****4812', completeAccount: '13800004812' } }
const config = { enabled: true, accountId: account.id, userId: account.userId!, phoneSuffix: '4812' }

test('八折、九折映射正确，只展示有无库存，不展示数量', () => {
  const stocks = parseWedCouponStocks(info(), [{ prizeId: 'fee_r5', stock: '4' }, { prizeId: 'fee_r4', stock: 0 }])
  assert.deepEqual(stocks, { eight: 'empty', nine: 'available' })
  assert.equal(formatWedCouponStocks(stocks), '8折券：无库存\n9折券：有库存')
})

test('库存为空时不能把个人锁定、已使用、已过期等状态当作缺货', () => {
  for (const status of [undefined, 0, 1, 3, 4, 6, 7, 9, 999]) {
    assert.deepEqual(parseWedCouponStocks(info(status, status), [{ prizeId: 'fee_r4', stock: null }]),
      { eight: 'unknown', nine: 'unknown' })
  }
  assert.deepEqual(parseWedCouponStocks(info(5, 2), []), { eight: 'empty', nine: 'available' })
})

test('缺失、不合法或负数库存不能误报为无库存', () => {
  for (const stock of [null, undefined, '', ' ', '-1', 'NaN', -1, 0.5, true, {}, Infinity, '999999999999999999999']) {
    assert.equal(parseWedCouponStocks(info(), [{ prizeId: 'fee_r4', stock }]).eight, 'unknown')
  }
})

function queryHarness() {
  const calls: string[] = []
  let queries = 0
  let expired = false
  let changed = false
  let temporaryFailure = false
  const deps = {
    query: async () => {
      calls.push('query')
      if (temporaryFailure) throw new Error('network test-only')
      if (expired && queries++ === 0) throw new WedAuthenticationExpired()
      return info(5, 2)
    },
    prizes: async () => { calls.push('prizes'); return [] },
    prepare: async ({ cookie, forceRefresh }: { cookie: string; forceRefresh?: boolean }) => {
      calls.push(forceRefresh ? 'prepare-fresh' : 'prepare'); return { cookie, updated: false }
    },
    exchange: async () => { calls.push('yunpan-global'); return 'new-global' },
    ticket: async () => { calls.push('global-wx-ticket'); return 'new-ticket' },
    wx: async () => { calls.push('wx'); return { cookie: 'new-wx', cookieExpireAt: new Date().toISOString(), activationInfo: {} } },
    get: async () => changed ? { ...account, cookie: 'user-new-login' } : account,
    saveWx: async () => { calls.push('save-wx'); return account },
    saveGlobal: async () => { calls.push('save-global'); return account },
    saveActivity: async () => { calls.push('save-activity'); return account },
  }
  return { deps, calls, expire: () => { expired = true }, change: () => { changed = true }, fail: () => { temporaryFailure = true } }
}

test('有效活动 CK 仅只读查询，不换票不执行业务操作', async () => {
  const h = queryHarness()
  assert.deepEqual(await queryAccountWedCouponStocks(account, h.deps), { eight: 'empty', nine: 'available' })
  assert.deepEqual(h.calls, ['prepare', 'query', 'prizes'])
})

test('活动明确过期后按云盘→全球通→WX→活动顺序恢复，确认查询成功才保存', async () => {
  const h = queryHarness(); h.expire()
  await queryAccountWedCouponStocks(account, h.deps)
  assert.deepEqual(h.calls, ['prepare', 'query', 'yunpan-global', 'global-wx-ticket', 'wx',
    'prepare-fresh', 'query', 'prizes', 'save-global', 'save-wx', 'save-activity'])
})

test('网络错误不启动凭据置换', async () => {
  const h = queryHarness(); h.fail()
  await assert.rejects(queryAccountWedCouponStocks(account, h.deps))
  assert.deepEqual(h.calls, ['prepare', 'query'])
})

test('置换期间人工登录更新，拒绝覆盖新凭据', async () => {
  const h = queryHarness(); h.expire(); h.change()
  await assert.rejects(queryAccountWedCouponStocks(account, h.deps), MonitorAccountChanged)
  assert.equal(h.calls.some(c => c.startsWith('save-')), false)
})

test('续期后的活动查询仍失败，不保存任何派生凭据或无限续期', async () => {
  const h = queryHarness(); h.expire()
  h.deps.prizes = async () => { throw new Error('risk rejection') }
  await assert.rejects(queryAccountWedCouponStocks(account, h.deps))
  assert.equal(h.calls.filter(c => c === 'yunpan-global').length, 1)
  assert.equal(h.calls.some(c => c.startsWith('save-')), false)
})

test('云盘明确鉴权码和 401 才确认过期，403/失败不误判', () => {
  assert.equal(isYunpanAuthenticationExpired(200, { code: '1010010015' }), true)
  assert.equal(isYunpanAuthenticationExpired(401, {}), true)
  assert.equal(isYunpanAuthenticationExpired(403, {}), false)
  assert.equal(isYunpanAuthenticationExpired(200, { success: false, code: 'other' }), false)
})

function cycleHarness() {
  let now = 1000000
  let failure: Error | undefined
  let pushes = 0
  let queries = 0
  const saved: WedStockMonitorState[] = []
  const messages: string[] = []
  const save = async (s: WedStockMonitorState) => { saved.push(structuredClone(s)) }
  const deps = {
    now: () => now,
    get: async () => account,
    query: async () => { queries++; if (failure) throw failure; return { eight: 'empty' as const, nine: 'available' as const } },
    pushConfig: async () => ({ token: 'test-only', channel: 'wechat' }),
    send: async (args: { content: string }) => { pushes++; messages.push(args.content) },
    lock: async <T>(_key: string, work: () => Promise<T>) => work(),
  }
  return { deps, save, saved, messages, advance: () => { now += WED_STOCK_INTERVAL_MS },
    fail: (e: Error) => { failure = e }, counts: () => ({ pushes, queries }) }
}

test('每 15 分钟同库存也推送，未到时间或重启读取持久状态不重复', async () => {
  const h = cycleHarness()
  const first = await executeWedStockMonitorCycle(config, {}, h.save, h.deps)
  await executeWedStockMonitorCycle(config, structuredClone(first), h.save, h.deps)
  assert.deepEqual(h.counts(), { queries: 1, pushes: 1 })
  assert.equal(h.saved[0].pushAccepted, false)
  h.advance()
  const second = await executeWedStockMonitorCycle(config, first, h.save, h.deps)
  assert.deepEqual(h.counts(), { queries: 2, pushes: 2 })
  assert.equal(second.pushAccepted, true)
})

test('云盘过期通知补登，查询异常不冒充云盘过期且不推送旧库存', async () => {
  for (const expired of [true, false]) {
    const h = cycleHarness()
    h.fail(expired ? new YunpanAuthenticationExpired() : new Error('timeout'))
    const state = await executeWedStockMonitorCycle(config, { stocks: { eight: 'available', nine: 'available' } }, h.save, h.deps)
    assert.equal(state.outcome, expired ? 'yunpan_expired' : 'query_failed')
    assert.equal(state.stocks, undefined)
    assert.ok(h.messages[0].includes('库存未知'))
    assert.equal(h.messages[0].includes('CK 已过期'), expired)
  }
})

test('账号所属用户或手机号不匹配时不调用活动接口', async () => {
  const h = cycleHarness()
  await executeWedStockMonitorCycle({ ...config, userId: 'other' }, {}, h.save, h.deps)
  assert.equal(h.counts().queries, 0)
})

test('PushPlus 拒绝后保留未受理状态，不记录成功时间', async () => {
  const h = cycleHarness()
  h.deps.send = async () => { throw new Error('PushPlus rejected') }
  await assert.rejects(executeWedStockMonitorCycle(config, {}, h.save, h.deps))
  assert.equal(h.saved.at(-1)?.pushAccepted, false)
  assert.equal(h.saved.at(-1)?.lastPushAt, undefined)
})

test('周期边界精确，异常时间拒绝执行，时钟回拨可恢复', () => {
  const lastAttemptAt = new Date(1000000).toISOString()
  assert.equal(isWedStockMonitorDue({ lastAttemptAt }, 1899999), false)
  assert.equal(isWedStockMonitorDue({ lastAttemptAt }, 1900000), true)
  assert.equal(isWedStockMonitorDue({ lastAttemptAt }, 1), true)
  assert.throws(() => isWedStockMonitorDue({ lastAttemptAt: 'broken' }, 1000000))
})

test('推送必须同时满足 HTTP 成功和业务受理，使用 HTTPS', async () => {
  const args = { token: 'test-only', channel: 'wechat', title: 'test', content: 'test' }
  let url: unknown
  const request = (response: Response) => (async (u: unknown) => { url = u; return response }) as typeof fetch
  await sendWedStockPush(args, request(Response.json({ code: 200 })))
  assert.equal(url, 'https://www.pushplus.plus/send')
  await assert.rejects(sendWedStockPush(args, request(Response.json({ code: 200 }, { status: 503 }))))
  await assert.rejects(sendWedStockPush(args, request(Response.json({ code: 600 }))))
  await assert.rejects(sendWedStockPush(args, request(Response.json({}))))
})

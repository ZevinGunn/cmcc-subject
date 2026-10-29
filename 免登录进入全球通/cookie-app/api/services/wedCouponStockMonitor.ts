import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import dotenv from 'dotenv'
import { getAccountById } from './accountsStore.js'
import { withKeyLock } from './taskGuards.js'
import { YunpanAuthenticationExpired } from './yunpan10086.js'
import { formatWedCouponStocks, queryAccountWedCouponStocks, type WedCouponStocks } from './wedCouponStock.js'

export const WED_STOCK_INTERVAL_MS = 15 * 60 * 1000
export type WedStockMonitorConfig = {
  enabled: boolean
  accountId: string
  userId: string
  phoneSuffix: string
  pushplusEnvFile?: string
}
export type WedStockMonitorState = {
  lastAttemptAt?: string
  lastQueryAt?: string
  lastPushAt?: string
  outcome?: 'stock' | 'yunpan_expired' | 'query_failed'
  stocks?: WedCouponStocks
  pushAccepted?: boolean
}

const configPath = () => path.resolve(process.env.WED_COUPON_STOCK_CONFIG || 'data/wed-coupon-stock-config.local.json')
const statePath = () => path.resolve(process.env.WED_COUPON_STOCK_STATE || 'data/wed-coupon-stock-state.local.json')

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try { return JSON.parse(await fs.readFile(file, 'utf8')) } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return fallback
    throw new Error('周三库存监控配置或状态文件不可读')
  }
}

export async function loadWedStockMonitorConfig(): Promise<WedStockMonitorConfig | null> {
  const config = await readJson<WedStockMonitorConfig | null>(configPath(), null)
  if (!config || config.enabled === false) return null
  if (config.enabled !== true || !/^[a-f0-9]{64}$/.test(config.accountId) ||
      typeof config.userId !== 'string' || !config.userId || !/^\d{4}$/.test(config.phoneSuffix) ||
      (config.pushplusEnvFile !== undefined && (typeof config.pushplusEnvFile !== 'string' || !config.pushplusEnvFile.trim()))) {
    throw new Error('周三库存监控配置不完整')
  }
  return config
}

async function writeState(state: WedStockMonitorState) {
  const file = statePath()
  await fs.mkdir(path.dirname(file), { recursive: true })
  const tmp = `${file}.${crypto.randomUUID()}.tmp`
  try {
    await fs.writeFile(tmp, JSON.stringify(state, null, 2) + '\n', { mode: 0o600 })
    await fs.rename(tmp, file)
  } finally { await fs.unlink(tmp).catch(() => {}) }
}

export function isWedStockMonitorDue(state: WedStockMonitorState, now: number): boolean {
  if (!state.lastAttemptAt) return true
  const previous = Date.parse(state.lastAttemptAt)
  if (!Number.isFinite(previous)) throw new Error('周三库存监控运行时间格式异常')
  // Clock rollback must not pause the monitor indefinitely.
  return now < previous || now - previous >= WED_STOCK_INTERVAL_MS
}

async function loadPushConfig(config: WedStockMonitorConfig) {
  // Reuse a file, not a copied token: token replacement takes effect next cycle.
  const env = config.pushplusEnvFile
    ? dotenv.parse(await fs.readFile(path.resolve(config.pushplusEnvFile), 'utf8'))
    : process.env
  const token = String(env.PUSHPLUS_TOKEN || '').trim()
  if (!token || ['0', 'false', 'off', 'no'].includes(String(env.PUSHPLUS_ENABLED || '1').trim().toLowerCase())) {
    throw new Error('周三库存监控 PushPlus 未配置或已关闭')
  }
  return { token, channel: env.PUSHPLUS_CHANNEL || 'wechat' }
}

export async function sendWedStockPush(args: { token: string; channel: string; title: string; content: string }, request = fetch) {
  const res = await request('https://www.pushplus.plus/send', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...args, template: 'txt' }), signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`PushPlus HTTP ${res.status}`)
  const payload = await res.json() as { code?: unknown }
  if (Number(payload.code) !== 200) throw new Error('PushPlus 未受理本轮通知')
}

const dependencies = {
  now: Date.now,
  get: getAccountById,
  query: queryAccountWedCouponStocks,
  pushConfig: loadPushConfig,
  send: sendWedStockPush,
  lock: withKeyLock,
}

export async function executeWedStockMonitorCycle(config: WedStockMonitorConfig, state: WedStockMonitorState,
  save: (state: WedStockMonitorState) => Promise<void>, deps = dependencies): Promise<WedStockMonitorState> {
  const now = deps.now()
  if (!isWedStockMonitorDue(state, now)) return state
  const next: WedStockMonitorState = { ...state, lastAttemptAt: new Date(now).toISOString(), pushAccepted: false }
  // Reserve before upstream calls: restarts and overlapping PM2 reloads cannot
  // cause duplicate queries/pushes within this fifteen-minute window.
  await save(next)
  const push = await deps.pushConfig(config)
  let content: string
  let title = '周三拼图话费券库存'
  try {
    const stocks = await deps.lock(`account:${config.accountId}`, async () => {
      const rec = await deps.get(config.accountId)
      if (!rec || rec.disabledAt || rec.userId !== config.userId || !rec.phone?.endsWith(config.phoneSuffix)) {
        throw new Error('监控账号不存在、被禁用或身份不匹配')
      }
      return deps.query(rec)
    })
    next.outcome = 'stock'
    next.lastQueryAt = new Date(deps.now()).toISOString()
    next.stocks = stocks
    content = formatWedCouponStocks(stocks)
  } catch (error) {
    next.stocks = undefined // Never resend stale stock as a fresh query.
    if (error instanceof YunpanAuthenticationExpired) {
      next.outcome = 'yunpan_expired'
      title = '周三库存监控：云盘 CK 过期'
      content = `尾号 ${config.phoneSuffix} 的云盘 CK 已过期，需要补登。\n8折券：库存未知\n9折券：库存未知\n补登后自动恢复查询。`
    } else {
      next.outcome = 'query_failed'
      title = '周三库存监控：查询未成功'
      content = `尾号 ${config.phoneSuffix} 的库存查询或登录恢复未成功。\n8折券：库存未知\n9折券：库存未知\n请检查账号登录状态或网络，下轮将继续尝试。`
    }
  }
  content += '\n查询时间：' + new Date(deps.now()).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false })
  await save(next)
  // No automatic retry of an ambiguous push response (it may have delivered).
  await deps.send({ ...push, title, content })
  next.pushAccepted = true
  next.lastPushAt = new Date(deps.now()).toISOString()
  await save(next)
  return next
}

let running: Promise<void> | undefined
let timer: ReturnType<typeof setInterval> | undefined
export async function runWedCouponStockMonitorOnce(): Promise<void> {
  if (running) return running
  running = (async () => {
    const config = await loadWedStockMonitorConfig()
    if (!config) return
    const lockDir = `${statePath()}.lock`
    await fs.mkdir(path.dirname(lockDir), { recursive: true })
    try { await fs.mkdir(lockDir) } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
      const stat = await fs.stat(lockDir)
      // Operations are bounded to < ten minutes by upstream timeouts. A stale
      // lock can remain after process termination; persisted reservation stays.
      if (Date.now() - stat.mtimeMs <= 10 * 60 * 1000) return
      await fs.rmdir(lockDir).catch(() => {})
      return
    }
    try {
      const state = await readJson<WedStockMonitorState>(statePath(), {})
      await executeWedStockMonitorCycle(config, state, writeState)
    } finally { await fs.rmdir(lockDir).catch(() => {}) }
  })().finally(() => { running = undefined })
  return running
}

export function startWedCouponStockMonitor(): void {
  if (timer) return
  const tick = () => { void runWedCouponStockMonitorOnce().catch(() => {
    // Neither upstream/browser exceptions nor environment contents enter logs.
    console.error('[wed-coupon-stock] 本轮执行失败，请检查监控状态与推送配置，下轮继续')
  }) }
  timer = setInterval(tick, 30000)
  timer.unref()
  tick()
}

export async function getWedCouponStockMonitorStatus() {
  const config = await loadWedStockMonitorConfig()
  const state = await readJson<WedStockMonitorState>(statePath(), {})
  return { enabled: !!config, phoneSuffix: config?.phoneSuffix, intervalSeconds: WED_STOCK_INTERVAL_MS / 1000,
    running: !!running, ...state,
    nextQueryAt: state.lastAttemptAt ? new Date(Date.parse(state.lastAttemptAt) + WED_STOCK_INTERVAL_MS).toISOString() : null }
}

import crypto from 'node:crypto'
import { getAccountById } from './accountsStore.js'
import { ensureUsable10086Cookie } from './cmccCookieRecovery.js'
import {
  BenefitOrderError,
  createRetailProductQuerySession,
  deleteRetailProductQuerySession,
  queryRetailProductInSession,
} from './cmccBenefitOrder.js'
import { getPrisma } from './prisma.js'
import { runPool } from './runPool.js'

const MAX_TASK_CODES = 10_000
const activeTasks = new Set<string>()
const cancelledTasks = new Set<string>()
let schedulerStarted = false
let schedulerTimer: NodeJS.Timeout | undefined

export type RetailProductQueryStatus = 'found' | 'not_found'
export type RetailProductQueryResult = {
  productCode: string
  status: RetailProductQueryStatus
  message: string
  product?: Record<string, unknown>
}

export class RetailProductQueryError extends Error {
  readonly code: string
  readonly status: number

  constructor(message: string, code = 'UPSTREAM_ERROR', status = 424) {
    super(message)
    this.name = 'RetailProductQueryError'
    this.code = code
    this.status = status
  }
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : undefined
}

function text(value: unknown): string {
  return value === null || value === undefined ? '' : String(value)
}

function parseJson(value: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(value) as unknown
    const record = asRecord(parsed)
    if (record) return record
  } catch {
    // Converted to a stable error below.
  }
  throw new RetailProductQueryError('上游返回格式异常', 'UPSTREAM_FORMAT')
}

export function normalizeProductCode(value: unknown): string {
  const code = String(value ?? '').trim()
  if (!/^\d{1,20}$/.test(code)) {
    throw new RetailProductQueryError('productCode 必须为 1-20 位数字', 'INVALID_PRODUCT_CODE', 400)
  }
  return code
}

export function normalizeProductCodes(values: unknown[]): string[] {
  const unique = new Set<string>()
  for (const value of values) unique.add(normalizeProductCode(value))
  const codes = Array.from(unique)
  if (codes.length === 0) throw new RetailProductQueryError('请至少提供一个 productCode', 'PRODUCT_CODES_REQUIRED', 400)
  if (codes.length > MAX_TASK_CODES) {
    throw new RetailProductQueryError(`单个任务最多查询 ${MAX_TASK_CODES} 个 productCode`, 'TOO_MANY_PRODUCT_CODES', 400)
  }
  return codes
}

export function expandProductCodeRange(startValue: unknown, endValue: unknown): string[] {
  const startCode = normalizeProductCode(startValue)
  const endCode = normalizeProductCode(endValue)
  const start = BigInt(startCode)
  const end = BigInt(endCode)
  if (end < start) throw new RetailProductQueryError('范围结束 code 不能小于开始 code', 'INVALID_CODE_RANGE', 400)
  const count = end - start + 1n
  if (count > BigInt(MAX_TASK_CODES)) {
    throw new RetailProductQueryError(`单个范围最多包含 ${MAX_TASK_CODES} 个 code`, 'CODE_RANGE_TOO_LARGE', 400)
  }
  const width = Math.max(startCode.length, endCode.length)
  return Array.from({ length: Number(count) }, (_, index) => (start + BigInt(index)).toString().padStart(width, '0'))
}

function boundedInteger(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(min, Math.min(max, Math.floor(parsed)))
}

async function requireAccountId(value: unknown): Promise<string> {
  const accountId = String(value || '').trim()
  if (!accountId) throw new RetailProductQueryError('请选择查询账号', 'ACCOUNT_REQUIRED', 400)
  const account = await getAccountById(accountId)
  if (!account || account.disabledAt) throw new RetailProductQueryError('所选账号不存在或已禁用', 'ACCOUNT_UNAVAILABLE', 404)
  return accountId
}

function isAuthError(error: unknown): boolean {
  if (error instanceof RetailProductQueryError) {
    return ['UPSTREAM_AUTH_REQUIRED', '401', 'PREMIUM_SSO_FAILED', 'PREMIUM_SSO_INVALID'].includes(error.code) || /token|登录|授权/i.test(error.message)
  }
  if (!(error instanceof BenefitOrderError)) return false
  return error.code === '401' || error.code === 'PREMIUM_SSO_FAILED' || error.code === 'PREMIUM_SSO_INVALID' || /token|登录|授权/i.test(error.message)
}

async function createAccountQuerySession(accountIdValue: unknown, productCode: string, forceRefresh: boolean): Promise<string> {
  const accountId = String(accountIdValue || '').trim()
  if (!accountId) throw new RetailProductQueryError('请选择查询账号', 'ACCOUNT_REQUIRED', 400)
  const account = await getAccountById(accountId)
  if (!account || account.disabledAt) throw new RetailProductQueryError('所选账号不存在或已禁用', 'ACCOUNT_UNAVAILABLE', 404)
  const usable = await ensureUsable10086Cookie({
    rec: account,
    allowRecentSkip: !forceRefresh,
    windowMin: 20,
    clearOnYunpanFailure: false,
    preferYunpan: Boolean(account.yunpanSession),
  })
  if (!usable.ok || !usable.cookie) {
    throw new RetailProductQueryError(usable.message || '账号 CK 已失效且自动保活失败', 'ACCOUNT_RECOVERY_FAILED', 410)
  }
  try {
    return await createRetailProductQuerySession({ accountId, cookie: usable.cookie, productCode })
  } catch (error) {
    if (error instanceof BenefitOrderError) {
      throw new RetailProductQueryError(error.message, error.code, error.status)
    }
    throw error
  }
}

async function fetchRetailProductWithSession(productCodeValue: unknown, sessionId: string): Promise<RetailProductQueryResult> {
  const productCode = normalizeProductCode(productCodeValue)
  const payload = await queryRetailProductInSession(sessionId, productCode)
  const returnCode = text(payload.returnCode || payload.code)
  const message = text(payload.returnMessage || payload.message)
  if (returnCode === '-9999' || /商品不存在/.test(message)) {
    return { productCode, status: 'not_found', message: message || '商品不存在' }
  }
  if (returnCode === '401' || /token\s*为空/i.test(message)) {
    throw new RetailProductQueryError('商城账号授权已失效', 'UPSTREAM_AUTH_REQUIRED', 424)
  }
  if (returnCode !== '0') {
    throw new RetailProductQueryError(message || '商品查询失败', returnCode || 'UPSTREAM_ERROR')
  }
  const product = asRecord(payload.data)
  if (!product) return { productCode, status: 'not_found', message: message || '上游未返回商品内容' }
  return { productCode, status: 'found', message: message || '查询成功', product }
}

async function createRetailProductClient(accountId: unknown, firstCode: string) {
  let sessionId: string
  try {
    sessionId = await createAccountQuerySession(accountId, firstCode, false)
  } catch (error) {
    if (!isAuthError(error)) throw error
    sessionId = await createAccountQuerySession(accountId, firstCode, true)
  }
  let refreshing: Promise<string> | undefined
  const refresh = () => {
    if (!refreshing) {
      const previous = sessionId
      refreshing = createAccountQuerySession(accountId, firstCode, true).then((next) => {
        sessionId = next
        deleteRetailProductQuerySession(previous)
        return next
      }).finally(() => { refreshing = undefined })
    }
    return refreshing
  }
  return {
    async query(productCode: unknown) {
      try {
        return await fetchRetailProductWithSession(productCode, sessionId)
      } catch (error) {
        if (!isAuthError(error)) throw error
        const next = await refresh()
        return fetchRetailProductWithSession(productCode, next)
      }
    },
    close() { deleteRetailProductQuerySession(sessionId) },
  }
}

function productFields(productCode: string, product: Record<string, unknown>) {
  return {
    productId: text(product.productId) || null,
    productName: text(product.productName || product.name) || null,
    normCount: Array.isArray(product.norms) ? product.norms.length : 0,
    contentJson: JSON.stringify(product),
    lastFoundAt: new Date(),
    lastQueriedAt: new Date(),
    productCode,
  }
}

async function saveRetailProductResult(result: RetailProductQueryResult): Promise<RetailProductQueryResult> {
  if (result.status === 'found' && result.product) {
    const fields = productFields(result.productCode, result.product)
    await getPrisma().retailProduct.upsert({
      where: { productCode: result.productCode },
      create: fields,
      update: {
        productId: fields.productId,
        productName: fields.productName,
        normCount: fields.normCount,
        contentJson: fields.contentJson,
        lastFoundAt: fields.lastFoundAt,
        lastQueriedAt: fields.lastQueriedAt,
      },
    })
  }
  return result
}

export async function queryAndSaveRetailProduct(productCodeValue: unknown, accountId: unknown): Promise<RetailProductQueryResult> {
  const productCode = normalizeProductCode(productCodeValue)
  const client = await createRetailProductClient(accountId, productCode)
  try {
    return saveRetailProductResult(await client.query(productCode))
  } finally {
    client.close()
  }
}

function executionSettings(input: { executionMode?: unknown; concurrency?: unknown; intervalMs?: unknown }) {
  const executionMode = input.executionMode === 'concurrent' ? 'concurrent' : 'sequential'
  return {
    executionMode,
    concurrency: executionMode === 'sequential' ? 1 : boundedInteger(input.concurrency, 4, 2, 10),
    intervalMs: boundedInteger(input.intervalMs, 1000, 100, 60_000),
  }
}

function taskInclude(take?: number) {
  return { items: { orderBy: { orderIndex: 'asc' as const }, ...(take ? { take } : {}) } }
}

export async function createRetailProductQueryTask(args: {
  productCodes: unknown[]
  source?: 'manual' | 'scheduled'
  scheduleId?: string
  accountId: unknown
  executionMode?: unknown
  concurrency?: unknown
  intervalMs?: unknown
}) {
  const productCodes = normalizeProductCodes(args.productCodes)
  const accountId = await requireAccountId(args.accountId)
  const settings = executionSettings(args)
  const id = crypto.randomUUID()
  const task = await getPrisma().retailProductQueryTask.create({
    data: {
      id,
      source: args.source || 'manual',
      scheduleId: args.scheduleId,
      accountId,
      ...settings,
      totalCount: productCodes.length,
      items: {
        create: productCodes.map((productCode, orderIndex) => ({
          id: crypto.randomUUID(), productCode, orderIndex,
        })),
      },
    },
    include: taskInclude(50),
  })
  setImmediate(() => void runRetailProductQueryTask(id))
  return task
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function runRetailProductQueryTask(taskId: string): Promise<void> {
  if (activeTasks.has(taskId)) return
  activeTasks.add(taskId)
  const prisma = getPrisma()
  try {
    const task = await prisma.retailProductQueryTask.findUnique({ where: { id: taskId }, include: taskInclude() })
    if (!task || ['success', 'partial_success', 'failed', 'cancelled'].includes(task.status)) return
    await prisma.retailProductQueryTask.update({
      where: { id: taskId },
      data: { status: 'running', startedAt: task.startedAt || new Date(), finishedAt: null, message: '查询任务执行中' },
    })
    const pendingItems = task.items.filter((item) => item.status === 'pending' || item.status === 'running')
    const firstCode = pendingItems[0]?.productCode || task.items[0]?.productCode || ''
    const clientPromise = createRetailProductClient(task.accountId, firstCode)
    await runPool(pendingItems, task.executionMode === 'concurrent' ? task.concurrency : 1, async (item) => {
      if (cancelledTasks.has(taskId)) return
      const startedAt = new Date()
      await prisma.retailProductQueryItem.update({ where: { id: item.id }, data: { status: 'running', startedAt, message: null, errorCode: null } })
      await prisma.retailProductQueryTask.update({ where: { id: taskId }, data: { currentCode: item.productCode } })
      try {
        const client = await clientPromise
        const result = await saveRetailProductResult(await client.query(item.productCode))
        const found = result.status === 'found'
        await prisma.$transaction([
          prisma.retailProductQueryItem.update({
            where: { id: item.id },
            data: { status: found ? 'found' : 'not_found', message: result.message, finishedAt: new Date() },
          }),
          prisma.retailProductQueryTask.update({
            where: { id: taskId },
            data: {
              completedCount: { increment: 1 },
              ...(found ? { foundCount: { increment: 1 } } : { notFoundCount: { increment: 1 } }),
            },
          }),
        ])
      } catch (error) {
        const message = error instanceof Error ? error.message : '查询失败'
        const errorCode = error instanceof RetailProductQueryError ? error.code : 'UPSTREAM_ERROR'
        await prisma.$transaction([
          prisma.retailProductQueryItem.update({ where: { id: item.id }, data: { status: 'failed', message, errorCode, finishedAt: new Date() } }),
          prisma.retailProductQueryTask.update({ where: { id: taskId }, data: { completedCount: { increment: 1 }, failedCount: { increment: 1 } } }),
        ])
      }
      if (!cancelledTasks.has(taskId)) await delay(task.intervalMs)
    })
    void clientPromise.then((client) => client.close()).catch(() => undefined)
    const current = await prisma.retailProductQueryTask.findUnique({ where: { id: taskId } })
    if (!current) return
    const cancelled = cancelledTasks.has(taskId) || current.status === 'cancelled'
    const status = cancelled
      ? 'cancelled'
      : current.failedCount === current.totalCount ? 'failed'
        : current.failedCount > 0 ? 'partial_success' : 'success'
    await prisma.retailProductQueryTask.update({
      where: { id: taskId },
      data: {
        status,
        currentCode: null,
        finishedAt: new Date(),
        message: cancelled ? '任务已停止' : `已查询 ${current.completedCount}/${current.totalCount}，发现 ${current.foundCount}，不存在 ${current.notFoundCount}，失败 ${current.failedCount}`,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '查询任务执行异常'
    await prisma.retailProductQueryTask.updateMany({
      where: { id: taskId, status: { in: ['pending', 'running'] } },
      data: { status: 'failed', currentCode: null, finishedAt: new Date(), message },
    }).catch(() => undefined)
  } finally {
    activeTasks.delete(taskId)
    cancelledTasks.delete(taskId)
  }
}

export async function cancelRetailProductQueryTask(taskId: string) {
  const task = await getPrisma().retailProductQueryTask.findUnique({ where: { id: taskId } })
  if (!task) throw new RetailProductQueryError('查询任务不存在', 'TASK_NOT_FOUND', 404)
  if (!['pending', 'running'].includes(task.status)) return getRetailProductQueryTask(taskId)
  cancelledTasks.add(taskId)
  await getPrisma().retailProductQueryTask.update({ where: { id: taskId }, data: { status: 'cancelled', message: '任务已请求停止' } })
  return getRetailProductQueryTask(taskId)
}

export async function getRetailProductQueryTask(taskId: string) {
  const task = await getPrisma().retailProductQueryTask.findUnique({ where: { id: taskId }, include: taskInclude(500) })
  if (!task) throw new RetailProductQueryError('查询任务不存在', 'TASK_NOT_FOUND', 404)
  return task
}

export async function listRetailProductQueryTasks(limitValue?: unknown) {
  const take = boundedInteger(limitValue, 30, 1, 100)
  return getPrisma().retailProductQueryTask.findMany({ orderBy: { createdAt: 'desc' }, take, include: taskInclude(30) })
}

export async function listRetailProducts(args: { query?: unknown; page?: unknown; pageSize?: unknown }) {
  const query = String(args.query || '').trim().slice(0, 80)
  const page = boundedInteger(args.page, 1, 1, 100_000)
  const pageSize = boundedInteger(args.pageSize, 30, 1, 100)
  const where = query ? { OR: [{ productCode: { contains: query } }, { productName: { contains: query, mode: 'insensitive' as const } }] } : {}
  const [total, products] = await getPrisma().$transaction([
    getPrisma().retailProduct.count({ where }),
    getPrisma().retailProduct.findMany({ where, orderBy: { lastFoundAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
  ])
  return { total, page, pageSize, products: products.map((product) => ({ ...product, content: parseJson(product.contentJson), contentJson: undefined })) }
}

export async function getRetailProduct(productCodeValue: unknown) {
  const productCode = normalizeProductCode(productCodeValue)
  const product = await getPrisma().retailProduct.findUnique({ where: { productCode } })
  if (!product) throw new RetailProductQueryError('商品库中不存在该 productCode', 'PRODUCT_NOT_SAVED', 404)
  return { ...product, content: parseJson(product.contentJson), contentJson: undefined }
}

export async function deleteRetailProduct(productCodeValue: unknown): Promise<void> {
  const productCode = normalizeProductCode(productCodeValue)
  await getPrisma().retailProduct.deleteMany({ where: { productCode } })
}

export async function createRetailProductQuerySchedule(args: {
  name?: unknown; startCode?: unknown; endCode?: unknown; executionMode?: unknown
  concurrency?: unknown; queryIntervalMs?: unknown; runIntervalSec?: unknown; accountId?: unknown
}) {
  const name = String(args.name || '').trim()
  if (!name || name.length > 80) throw new RetailProductQueryError('请填写 1-80 个字符的计划名称', 'INVALID_SCHEDULE_NAME', 400)
  const codes = expandProductCodeRange(args.startCode, args.endCode)
  const accountId = await requireAccountId(args.accountId)
  const settings = executionSettings({ executionMode: args.executionMode, concurrency: args.concurrency, intervalMs: args.queryIntervalMs })
  const runIntervalSec = boundedInteger(args.runIntervalSec, 3600, 60, 30 * 24 * 60 * 60)
  return getPrisma().retailProductQuerySchedule.create({
    data: {
      id: crypto.randomUUID(), name, startCode: codes[0], endCode: codes[codes.length - 1],
      executionMode: settings.executionMode, concurrency: settings.concurrency,
      queryIntervalMs: settings.intervalMs, runIntervalSec,
      accountId,
      nextRunAt: new Date(Date.now() + runIntervalSec * 1000),
    },
  })
}

export async function listRetailProductQuerySchedules() {
  return getPrisma().retailProductQuerySchedule.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function updateRetailProductQuerySchedule(id: string, enabled: boolean) {
  const existing = await getPrisma().retailProductQuerySchedule.findUnique({ where: { id } })
  if (!existing) throw new RetailProductQueryError('轮询计划不存在', 'SCHEDULE_NOT_FOUND', 404)
  return getPrisma().retailProductQuerySchedule.update({
    where: { id },
    data: { enabled, ...(enabled && !existing.enabled ? { nextRunAt: new Date(Date.now() + existing.runIntervalSec * 1000) } : {}) },
  })
}

export async function deleteRetailProductQuerySchedule(id: string): Promise<void> {
  await getPrisma().retailProductQuerySchedule.deleteMany({ where: { id } })
}

async function schedulerTick(): Promise<void> {
  const prisma = getPrisma()
  const due = await prisma.retailProductQuerySchedule.findMany({ where: { enabled: true, nextRunAt: { lte: new Date() } }, take: 10 })
  for (const schedule of due) {
    const claimed = await prisma.retailProductQuerySchedule.updateMany({
      where: { id: schedule.id, enabled: true, nextRunAt: schedule.nextRunAt },
      data: { lastRunAt: new Date(), nextRunAt: new Date(Date.now() + schedule.runIntervalSec * 1000) },
    })
    if (claimed.count !== 1) continue
    const existingTask = await prisma.retailProductQueryTask.findFirst({
      where: { scheduleId: schedule.id, status: { in: ['pending', 'running'] } },
      select: { id: true },
    })
    if (existingTask) continue
    await createRetailProductQueryTask({
      productCodes: expandProductCodeRange(schedule.startCode, schedule.endCode),
      source: 'scheduled', scheduleId: schedule.id,
      accountId: schedule.accountId,
      executionMode: schedule.executionMode, concurrency: schedule.concurrency, intervalMs: schedule.queryIntervalMs,
    })
  }
}

export function startRetailProductQueryScheduler(): void {
  if (schedulerStarted) return
  schedulerStarted = true
  void getPrisma().$transaction([
    getPrisma().retailProductQueryItem.updateMany({ where: { status: 'running' }, data: { status: 'pending', startedAt: null } }),
    getPrisma().retailProductQueryTask.updateMany({ where: { status: 'running' }, data: { status: 'pending', currentCode: null } }),
  ]).then(async () => {
    const pending = await getPrisma().retailProductQueryTask.findMany({ where: { status: 'pending' }, select: { id: true } })
    for (const task of pending) setImmediate(() => void runRetailProductQueryTask(task.id))
  }).catch(() => undefined)
  schedulerTimer = setInterval(() => void schedulerTick().catch(() => undefined), 15_000)
  schedulerTimer.unref?.()
  void schedulerTick().catch(() => undefined)
}

export const __test__ = { boundedInteger, executionSettings, productFields }

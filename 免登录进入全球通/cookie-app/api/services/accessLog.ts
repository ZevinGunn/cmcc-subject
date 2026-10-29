import crypto from 'node:crypto'
import type { Request } from 'express'
import { findCurrentAdmin } from './adminAuthStore.js'
import { getPrisma } from './prisma.js'
import { findCurrentUser } from './userAuthStore.js'

export type AccessActorType = 'admin' | 'user' | 'anonymous'

export type AccessActor = {
  type: AccessActorType
  id?: string
  name?: string
}

export type AccessLogRecord = {
  id: string
  createdAt: string
  actorType: AccessActorType
  actorId?: string
  actorName?: string
  feature: string
  action: string
  method: string
  path: string
  statusCode: number
  success: boolean
  durationMs: number
  ipAddress?: string
  userAgent?: string
  referer?: string
  requestId?: string
  meta?: Record<string, unknown>
}

export type AccessLogQuery = {
  page?: number
  limit?: number
  actorType?: AccessActorType
  feature?: string
  success?: boolean
  search?: string
}

const ANONYMOUS_ACTOR: AccessActor = { type: 'anonymous' }
const ACTOR_CACHE_TTL_MS = 5 * 60 * 1000
const actorCache = new Map<string, { actor: AccessActor; expiresAt: number }>()
let storageReady: Promise<void> | null = null

function bounded(value: unknown, max: number): string | undefined {
  const text = String(value || '').trim()
  return text ? text.slice(0, max) : undefined
}

function cookieValue(req: Request, name: string): string {
  const cookieHeader = String(req.header('cookie') || '')
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return match?.[1] ? decodeURIComponent(match[1]) : ''
}

function actorCacheKey(req: Request): string {
  const token = cookieValue(req, 'admin_session') || cookieValue(req, 'user_session')
  if (!token) return ''
  return crypto.createHash('sha256').update(token).digest('hex')
}

function trimActorCache(): void {
  if (actorCache.size <= 500) return
  const now = Date.now()
  for (const [key, entry] of actorCache) {
    if (entry.expiresAt <= now || actorCache.size > 400) actorCache.delete(key)
  }
}

export async function resolveAccessActor(req: Request): Promise<AccessActor> {
  const key = actorCacheKey(req)
  const cached = key ? actorCache.get(key) : undefined
  if (cached && cached.expiresAt > Date.now()) return cached.actor

  let actor = ANONYMOUS_ACTOR
  const hasAdminCredential = Boolean(
    cookieValue(req, 'admin_session') || req.header('x-portal-admin'),
  )
  if (hasAdminCredential) {
    const admin = await findCurrentAdmin(req).catch(() => null)
    if (admin) actor = { type: 'admin', id: admin.id, name: admin.username }
  }
  if (actor.type === 'anonymous' && cookieValue(req, 'user_session')) {
    const user = await findCurrentUser(req).catch(() => null)
    if (user) actor = { type: 'user', id: user.id, name: user.username }
  }
  if (key) {
    actorCache.set(key, { actor, expiresAt: Date.now() + ACTOR_CACHE_TTL_MS })
    trimActorCache()
  }
  return actor
}

export function sanitizeAccessPath(input: unknown): string {
  const raw = bounded(input, 500) || '/'
  const pathname = raw.split(/[?#]/, 1)[0] || '/'
  const parts = pathname.split('/').map((segment) => {
    if (/^1\d{10}$/.test(segment)) return ':phone'
    if (segment.length >= 16 && /^[a-zA-Z0-9_.-]+$/.test(segment) && /\d/.test(segment)) {
      return ':id'
    }
    return segment
  })
  const normalized = parts.join('/')
  return (normalized.startsWith('/') ? normalized : `/${normalized}`).slice(0, 300)
}

export function sanitizeAccessReferer(input: unknown): string | undefined {
  const raw = bounded(input, 1000)
  if (!raw) return undefined
  try {
    const url = new URL(raw)
    return `${url.origin}${sanitizeAccessPath(url.pathname)}`.slice(0, 500)
  } catch {
    return sanitizeAccessPath(raw)
  }
}

export function classifyAccessFeature(inputPath: unknown): string {
  const path = sanitizeAccessPath(inputPath).toLowerCase()
  if (path.startsWith('/api/callback-appointments')) return '10086 预约回访'
  if (path.startsWith('/api/wed-puzzle')) return '周三拼图互转'
  if (path.startsWith('/v2/accounts') || path.startsWith('/api/accounts') || path.includes('/auth/accounts')) return '账号管理'
  if (path.startsWith('/v2/tasks') || path.startsWith('/api/tasks')) return '任务中心'
  if (path.startsWith('/v2/automations') || path.startsWith('/api/worker')) return '自动化计划'
  if (path.startsWith('/v2/benefits') || path.startsWith('/api/benefit-orders')) return '权益活动'
  if (path.includes('business-order') || path.includes('/business/order')) return '业务订购'
  if (path.includes('business-query') || path.startsWith('/v2/business')) return '已订业务查询'
  if (path.includes('shop-query')) return '商城查询退订'
  if (path.includes('retail-products') || path.startsWith('/v2/product-query')) return '产品查询'
  if (path.startsWith('/v2/users') || path.startsWith('/users')) return '用户与权限'
  if (path.startsWith('/v2/links') || path.startsWith('/links')) return '专属链接'
  if (path.includes('announcements')) return '公告管理'
  if (path.startsWith('/v2/audit') || path.startsWith('/api/access-logs')) return '日志与审计'
  if (path.startsWith('/v2/settings') || path.includes('database-maintenance')) return '系统设置'
  if (path.startsWith('/api/auth') || path === '/public' || path.includes('cmcc-public')) return '用户访问'
  if (path.startsWith('/api/admin') || path === '/' || path.startsWith('/v2')) return '管理后台'
  if (path.startsWith('/api/10086')) return '10086 业务'
  return '其他'
}

export function describeAccessAction(method: string, path: string, feature?: string): string {
  const normalizedMethod = String(method || 'GET').toUpperCase()
  const normalizedPath = sanitizeAccessPath(path).toLowerCase()
  if (normalizedPath.includes('/login')) return '登录'
  if (normalizedPath.includes('/logout')) return '退出登录'
  if (normalizedPath.includes('/accounts/order')) return '调整账号顺序'
  if (normalizedPath.endsWith('/page-view')) return '访问页面'
  const verb = normalizedMethod === 'GET'
    ? '查看'
    : normalizedMethod === 'DELETE'
      ? '删除'
      : normalizedMethod === 'PATCH' || normalizedMethod === 'PUT'
        ? '修改'
        : '执行'
  return `${verb}${feature || classifyAccessFeature(normalizedPath)}`
}

export function getAccessIp(req: Request): string | undefined {
  const forwarded = req.header('cf-connecting-ip') || req.header('x-real-ip') || req.header('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress
  return bounded(ip, 80)
}

export async function ensureAccessLogStorage(): Promise<void> {
  if (!storageReady) {
    storageReady = (async () => {
      const prisma = getPrisma()
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "AccessLog" (
          "id" BIGSERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "actorType" TEXT NOT NULL DEFAULT 'anonymous',
          "actorId" TEXT,
          "actorName" TEXT,
          "feature" TEXT NOT NULL,
          "action" TEXT NOT NULL,
          "method" TEXT NOT NULL,
          "path" TEXT NOT NULL,
          "statusCode" INTEGER NOT NULL,
          "success" BOOLEAN NOT NULL,
          "durationMs" INTEGER NOT NULL,
          "ipAddress" TEXT,
          "userAgent" TEXT,
          "referer" TEXT,
          "requestId" TEXT,
          "metaJson" TEXT
        )
      `)
      await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "AccessLog_createdAt_idx" ON "AccessLog"("createdAt")')
      await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "AccessLog_actorType_actorId_createdAt_idx" ON "AccessLog"("actorType", "actorId", "createdAt")')
      await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "AccessLog_feature_createdAt_idx" ON "AccessLog"("feature", "createdAt")')
      await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "AccessLog_success_createdAt_idx" ON "AccessLog"("success", "createdAt")')
    })().catch((error) => {
      storageReady = null
      throw error
    })
  }
  await storageReady
}

export async function recordAccessLog(input: Omit<AccessLogRecord, 'id'>): Promise<void> {
  try {
    await ensureAccessLogStorage()
    const prisma = getPrisma()
    await prisma.$executeRawUnsafe(
      `INSERT INTO "AccessLog" (
        "createdAt", "actorType", "actorId", "actorName", "feature", "action",
        "method", "path", "statusCode", "success", "durationMs", "ipAddress",
        "userAgent", "referer", "requestId", "metaJson"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      new Date(input.createdAt),
      input.actorType,
      input.actorId ?? null,
      bounded(input.actorName, 160) ?? null,
      bounded(input.feature, 120) || '其他',
      bounded(input.action, 180) || '访问',
      bounded(input.method, 12) || 'GET',
      sanitizeAccessPath(input.path),
      input.statusCode,
      input.success,
      Math.max(0, Math.min(2_147_483_647, Math.round(input.durationMs))),
      bounded(input.ipAddress, 80) ?? null,
      bounded(input.userAgent, 500) ?? null,
      sanitizeAccessReferer(input.referer) ?? null,
      bounded(input.requestId, 100) ?? null,
      input.meta ? JSON.stringify(input.meta).slice(0, 4000) : null,
    )
  } catch (error) {
    console.error('[access-log]', error instanceof Error ? error.message : error)
  }
}

function mapAccessLog(row: Record<string, unknown>): AccessLogRecord {
  let meta: Record<string, unknown> | undefined
  if (typeof row.metaJson === 'string' && row.metaJson) {
    try {
      const parsed = JSON.parse(row.metaJson) as unknown
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) meta = parsed as Record<string, unknown>
    } catch {
      meta = undefined
    }
  }
  return {
    id: String(row.id),
    createdAt: new Date(String(row.createdAt)).toISOString(),
    actorType: String(row.actorType || 'anonymous') as AccessActorType,
    actorId: bounded(row.actorId, 160),
    actorName: bounded(row.actorName, 160),
    feature: String(row.feature || '其他'),
    action: String(row.action || '访问'),
    method: String(row.method || 'GET'),
    path: String(row.path || '/'),
    statusCode: Number(row.statusCode || 0),
    success: Boolean(row.success),
    durationMs: Number(row.durationMs || 0),
    ipAddress: bounded(row.ipAddress, 80),
    userAgent: bounded(row.userAgent, 500),
    referer: sanitizeAccessReferer(row.referer),
    requestId: bounded(row.requestId, 100),
    meta,
  }
}

export async function listAccessLogs(query: AccessLogQuery = {}): Promise<{
  logs: AccessLogRecord[]
  page: number
  limit: number
  total: number
  features: string[]
}> {
  await ensureAccessLogStorage()
  const page = Math.max(1, Math.floor(query.page || 1))
  const limit = Math.max(1, Math.min(200, Math.floor(query.limit || 50)))
  const where: string[] = []
  const params: unknown[] = []
  const add = (clause: string, value: unknown) => {
    params.push(value)
    where.push(clause.replace('?', `$${params.length}`))
  }
  if (query.actorType) add('"actorType" = ?', query.actorType)
  if (query.feature) add('"feature" = ?', query.feature)
  if (query.success !== undefined) add('"success" = ?', query.success)
  const search = bounded(query.search, 100)
  if (search) {
    params.push(`%${search}%`)
    const token = `$${params.length}`
    where.push(`("actorName" ILIKE ${token} OR "action" ILIKE ${token} OR "path" ILIKE ${token} OR "ipAddress" ILIKE ${token})`)
  }
  const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''
  const prisma = getPrisma()
  const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
    `SELECT * FROM "AccessLog" ${whereSql} ORDER BY "createdAt" DESC, "id" DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    ...params,
    limit,
    (page - 1) * limit,
  )
  const totals = await prisma.$queryRawUnsafe<Array<{ count: number }>>(
    `SELECT COUNT(*)::int AS count FROM "AccessLog" ${whereSql}`,
    ...params,
  )
  const featureRows = await prisma.$queryRawUnsafe<Array<{ feature: string }>>(
    'SELECT DISTINCT "feature" AS feature FROM "AccessLog" ORDER BY "feature" ASC',
  )
  return {
    logs: rows.map(mapAccessLog),
    page,
    limit,
    total: Number(totals[0]?.count || 0),
    features: featureRows.map((item) => item.feature).filter(Boolean),
  }
}

export async function pruneAccessLogs(before: Date): Promise<number> {
  await ensureAccessLogStorage()
  return getPrisma().$executeRawUnsafe('DELETE FROM "AccessLog" WHERE "createdAt" < $1', before)
}

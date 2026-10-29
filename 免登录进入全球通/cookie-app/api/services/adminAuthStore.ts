import crypto from 'node:crypto'
import type { Request } from 'express'
import { getPrisma } from './prisma.js'
import { ensureUserAuthStorage, verifyPassword } from './userAuthStore.js'

export type AdminUserRecord = {
  id: string
  username: string
  passwordHash: string
  role: string
  disabledAt?: string
  disabledReason?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export type AdminSessionPayload = {
  adminId: string
  username: string
  role: string
  exp: number
}

const ADMIN_SESSION_TTL_DAYS = 30
function adminSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.ADMIN_KEY?.trim() ||
    'cmcc-admin-session-local-secret'
  )
}

function normalizeUsername(value: string): string {
  return value.trim().toLowerCase()
}

async function rawQuery<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
  await ensureUserAuthStorage()
  const prisma = getPrisma()
  return prisma.$queryRawUnsafe(sql, ...params) as Promise<T[]>
}

async function rawExec(sql: string, params: unknown[] = []): Promise<number> {
  await ensureUserAuthStorage()
  const prisma = getPrisma()
  return prisma.$executeRawUnsafe(sql, ...params)
}

function mapAdmin(row: Record<string, unknown>): AdminUserRecord {
  return {
    id: String(row.id),
    username: String(row.username),
    passwordHash: String(row.passwordHash),
    role: String(row.role || 'super_admin'),
    disabledAt: row.disabledAt ? new Date(String(row.disabledAt)).toISOString() : undefined,
    disabledReason: row.disabledReason ? String(row.disabledReason) : undefined,
    lastLoginAt: row.lastLoginAt ? new Date(String(row.lastLoginAt)).toISOString() : undefined,
    createdAt: new Date(String(row.createdAt)).toISOString(),
    updatedAt: new Date(String(row.updatedAt)).toISOString(),
  }
}

function base64Url(input: string): string {
  return Buffer.from(input).toString('base64url')
}

function signPayload(payload: string): string {
  return crypto.createHmac('sha256', adminSessionSecret()).update(payload).digest('base64url')
}

function encodeSession(payload: AdminSessionPayload): string {
  const body = base64Url(JSON.stringify(payload))
  const sig = signPayload(body)
  return `${body}.${sig}`
}

function decodeSession(token: string): AdminSessionPayload | null {
  const [body, sig] = String(token || '').split('.')
  if (!body || !sig) return null
  const expected = signPayload(body)
  if (Buffer.byteLength(sig) !== Buffer.byteLength(expected)) return null
  if (
    !crypto.timingSafeEqual(
      Buffer.from(sig),
      Buffer.from(expected),
    )
  ) {
    return null
  }
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as AdminSessionPayload
    if (!payload.adminId || !payload.username || !payload.exp) return null
    if (payload.exp <= Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export function readAdminSessionToken(req: Request): string {
  const auth = req.header('authorization') || ''
  if (auth.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim()
  const cookieHeader = req.header('cookie') || ''
  const match = cookieHeader.match(/(?:^|;\s*)admin_session=([^;]+)/)
  return match?.[1] ? decodeURIComponent(match[1]) : ''
}

export function hasValidAdminSessionToken(req: Request): boolean {
  const token = readAdminSessionToken(req)
  return Boolean(token && decodeSession(token))
}

export async function getAdminByUsername(username: string): Promise<AdminUserRecord | null> {
  const normalized = normalizeUsername(username)
  if (!normalized) return null
  const rows = await rawQuery<Record<string, unknown>>(
    'select * from "AdminUser" where username = $1 limit 1',
    [normalized],
  )
  return rows[0] ? mapAdmin(rows[0]) : null
}

export async function getAdminById(id: string): Promise<AdminUserRecord | null> {
  const rows = await rawQuery<Record<string, unknown>>(
    'select * from "AdminUser" where id = $1 limit 1',
    [id],
  )
  return rows[0] ? mapAdmin(rows[0]) : null
}

export async function verifyAdminLogin(args: {
  username: string
  password: string
}): Promise<AdminUserRecord | null> {
  const admin = await getAdminByUsername(args.username)
  if (!admin || admin.disabledAt) return null
  if (!verifyPassword(args.password, admin.passwordHash)) return null
  await rawExec('update "AdminUser" set "lastLoginAt" = now(), "updatedAt" = now() where id = $1', [
    admin.id,
  ])
  return (await getAdminById(admin.id)) ?? admin
}

export function createAdminSession(admin: AdminUserRecord): string {
  return encodeSession({
    adminId: admin.id,
    username: admin.username,
    role: admin.role,
    exp: Date.now() + ADMIN_SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  })
}

export async function findCurrentAdmin(req: Request): Promise<AdminUserRecord | null> {
  const portalAdmin = req.header('x-portal-admin')?.trim().toLowerCase()
  const portalSecret = req.header('x-portal-admin-secret')?.trim()
  const expectedPortalSecret = process.env.ADMIN_KEY?.trim()
  if (portalAdmin && portalSecret && expectedPortalSecret && portalSecret === expectedPortalSecret) {
    const now = new Date().toISOString()
    return {
      id: `portal:${portalAdmin}`,
      username: portalAdmin,
      passwordHash: '',
      role: 'super_admin',
      createdAt: now,
      updatedAt: now,
    }
  }
  const token = readAdminSessionToken(req)
  if (!token) return null
  const payload = decodeSession(token)
  if (!payload) return null
  const admin = await getAdminById(payload.adminId)
  if (!admin || admin.disabledAt) return null
  return admin
}

export async function isAdminSessionRequest(req: Request): Promise<boolean> {
  return Boolean(await findCurrentAdmin(req))
}

export const __test__ = {
  adminSessionSecret,
  decodeSession,
}

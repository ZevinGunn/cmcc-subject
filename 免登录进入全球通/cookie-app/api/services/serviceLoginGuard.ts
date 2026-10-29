import type { Request } from 'express'
import { hasValidAdminSessionToken } from './adminAuthStore.js'

function parseCookieHeaderValue(header?: string): Record<string, string> {
  if (!header) return {}
  const out: Record<string, string> = {}
  const parts = header.split(';')
  for (const part of parts) {
    const idx = part.indexOf('=')
    if (idx <= 0) continue
    const key = part.slice(0, idx).trim()
    const value = part.slice(idx + 1).trim()
    if (!key) continue
    out[key] = value
  }
  return out
}

function readBoolEnv(name: string, fallback: boolean): boolean {
  const raw = String(process.env[name] ?? '').trim().toLowerCase()
  if (!raw) return fallback
  if (['1', 'true', 'yes', 'on'].includes(raw)) return true
  if (['0', 'false', 'no', 'off'].includes(raw)) return false
  return fallback
}

export function parseCookieHeader(header?: string): Record<string, string> {
  return parseCookieHeaderValue(header)
}

export function isLocalRequest(req: Request): boolean {
  const ip = req.ip || ''
  if (ip === '127.0.0.1' || ip === '::1') return true
  if (ip.startsWith('::ffff:127.0.0.1')) return true
  const host = String(req.hostname || '').toLowerCase()
  if (host === 'localhost') return true
  return false
}

export function isAdminRequest(req: Request): boolean {
  if (hasValidAdminSessionToken(req)) return true
  const adminKey = process.env.ADMIN_KEY?.trim()
  if (!adminKey) return isLocalRequest(req)
  const header = req.header('x-admin-key')
  if (header && header.trim() === adminKey) return true
  const cookies = parseCookieHeaderValue(req.header('cookie'))
  const cookieValue = cookies.admin_key
  if (cookieValue && cookieValue.trim() === adminKey) return true
  return false
}

export function resolveScopedPermission(args: {
  currentUserOwnsResource: boolean
  currentUserPermission: boolean
  isAdmin: boolean
}): boolean {
  return args.currentUserOwnsResource ? args.currentUserPermission : args.isAdmin
}

export function getServiceLoginAccess(req: Request): {
  ok: boolean
  isAdmin: boolean
  message?: string
} {
  const admin = isAdminRequest(req)
  if (admin) {
    const enabled = readBoolEnv('CMCC_ADMIN_SERVICE_LOGIN_ENABLED', true)
    if (enabled) return { ok: true, isAdmin: true }
    return {
      ok: false,
      isAdmin: true,
      message: '管理员服务端登录已关闭，请改用手动导入 CK 或临时开启管理员审核开关。',
    }
  }
  const enabled = readBoolEnv('CMCC_PUBLIC_SERVICE_LOGIN_ENABLED', true)
  if (enabled) return { ok: true, isAdmin: false }
  return {
    ok: false,
    isAdmin: false,
    message: '公共页服务端短信登录已关闭，请联系管理员处理。',
  }
}

import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { config } from '../config.js'

const sessions = new Map()
const cookieName = 'route_hub_admin'

function hash(value) {
  return createHash('sha256').update(value).digest()
}

function constantTimeEqual(left, right) {
  const a = hash(String(left || ''))
  const b = hash(String(right || ''))
  return timingSafeEqual(a, b)
}

function parseCookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || '').split(';').map((part) => part.trim()).filter(Boolean).map((part) => {
      const index = part.indexOf('=')
      return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))]
    }),
  )
}

function cleanup() {
  const now = Date.now()
  for (const [token, expiresAt] of sessions) if (expiresAt <= now) sessions.delete(token)
}

export function login(password) {
  if (!config.adminPassword) return null
  if (!constantTimeEqual(password, config.adminPassword)) return null
  cleanup()
  const token = randomBytes(32).toString('hex')
  sessions.set(token, Date.now() + config.sessionTtlMs)
  return token
}

export function isAdmin(req) {
  cleanup()
  const token = parseCookies(req)[cookieName]
  const expiresAt = sessions.get(token)
  if (!expiresAt) return false
  sessions.set(token, Date.now() + config.sessionTtlMs)
  return true
}

export function logout(req) {
  const token = parseCookies(req)[cookieName]
  if (token) sessions.delete(token)
}

export function sessionCookie(token) {
  const secure = config.isProduction ? '; Secure' : ''
  return `${cookieName}=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${Math.floor(config.sessionTtlMs / 1000)}${secure}`
}

export function expiredCookie() {
  const secure = config.isProduction ? '; Secure' : ''
  return `${cookieName}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`
}

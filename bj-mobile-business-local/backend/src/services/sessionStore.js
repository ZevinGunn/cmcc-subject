import { CookieJar } from 'tough-cookie'
import { randomUUID } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SESSION_TTL_MS = 60 * 60 * 1000
const __dirname = dirname(fileURLToPath(import.meta.url))
const sessionFile = resolve(__dirname, '../../data/sessions.json')
const sessions = new Map()

function now() {
  return Date.now()
}

function cleanup() {
  const cutoff = now() - SESSION_TTL_MS
  let changed = false
  for (const [id, session] of sessions) {
    if (session.updatedAt < cutoff) {
      sessions.delete(id)
      changed = true
    }
  }
  if (changed) saveSessions()
}

function createSessionObject(id = randomUUID(), saved = {}) {
  return {
    id,
    jar: saved.jar ? CookieJar.deserializeSync(saved.jar) : new CookieJar(),
    smsToken: saved.smsToken || '',
    artifact: saved.artifact || '',
    assertAcceptURL: saved.assertAcceptURL || '',
    accessToken: saved.accessToken || '',
    refreshToken: saved.refreshToken || '',
    accessTokenExpireAt: saved.accessTokenExpireAt || 0,
    userInfo: saved.userInfo || null,
    portalKey: saved.portalKey || '',
    dataToken: saved.dataToken || '',
    replayVersion: saved.replayVersion || 0,
    wafToken: saved.wafToken || '',
    portalBusinessPageWarmed: Boolean(saved.portalBusinessPageWarmed),
    portalBusinessPageStatus: saved.portalBusinessPageStatus || 0,
    createdAt: saved.createdAt || now(),
    updatedAt: saved.updatedAt || now(),
  }
}

function serializeSession(session) {
  return {
    id: session.id,
    jar: session.jar.serializeSync(),
    smsToken: session.smsToken,
    artifact: session.artifact,
    assertAcceptURL: session.assertAcceptURL,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    accessTokenExpireAt: session.accessTokenExpireAt,
    userInfo: session.userInfo,
    portalKey: session.portalKey,
    dataToken: session.dataToken,
    replayVersion: session.replayVersion,
    wafToken: session.wafToken,
    portalBusinessPageWarmed: session.portalBusinessPageWarmed,
    portalBusinessPageStatus: session.portalBusinessPageStatus,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  }
}

function loadSessions() {
  try {
    const raw = JSON.parse(readFileSync(sessionFile, 'utf8'))
    for (const saved of raw.sessions || []) {
      sessions.set(saved.id, createSessionObject(saved.id, saved))
    }
  } catch {
    // First run or unreadable cache; start with an empty in-memory store.
  }
}

export function saveSessions() {
  try {
    mkdirSync(dirname(sessionFile), { recursive: true })
    writeFileSync(
      sessionFile,
      JSON.stringify({ savedAt: now(), sessions: [...sessions.values()].map(serializeSession) }, null, 2),
      'utf8',
    )
  } catch {
    // Session persistence is best-effort; the API can continue with memory state.
  }
}

export function createSession() {
  cleanup()
  const id = randomUUID()
  const session = createSessionObject(id)
  sessions.set(id, session)
  saveSessions()
  return session
}

export function getSession(id) {
  cleanup()
  const session = sessions.get(String(id || ''))
  if (!session) return null
  session.updatedAt = now()
  saveSessions()
  return session
}

export function deleteSession(id) {
  sessions.delete(String(id || ''))
  saveSessions()
}

export function publicSession(session) {
  return {
    id: session.id,
    hasSmsToken: Boolean(session.smsToken),
    hasPortalToken: Boolean(session.accessToken),
    hasWafToken: Boolean(session.wafToken),
    userInfo: session.userInfo,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  }
}

loadSessions()
cleanup()

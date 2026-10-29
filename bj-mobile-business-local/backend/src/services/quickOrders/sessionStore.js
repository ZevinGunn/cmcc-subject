import { randomUUID } from 'node:crypto'

const SESSION_TTL_MS = 15 * 60 * 1000

export class QuickOrderSessionStore {
  constructor({ ttlMs = SESSION_TTL_MS } = {}) {
    this.ttlMs = ttlMs
    this.sessions = new Map()
  }

  cleanup() {
    const current = Date.now()
    for (const [id, session] of this.sessions) {
      if (session.expiresAt <= current) this.sessions.delete(id)
    }
  }

  create(platform, privateContext, publicContext = {}) {
    this.cleanup()
    const current = Date.now()
    const session = {
      id: randomUUID(),
      platform,
      businessId: publicContext.businessId || 'happy-traffic-doubling',
      stage: publicContext.initialStage || 'AUTHENTICATED',
      maskedPhone: publicContext.maskedPhone || '当前账号',
      authSummary: publicContext.authSummary || '',
      product: null,
      selection: null,
      privateContext,
      authSmsSentAt: 0,
      smsSentAt: 0,
      confirmationId: '',
      lastResult: null,
      createdAt: current,
      updatedAt: current,
      expiresAt: current + this.ttlMs,
    }
    this.sessions.set(session.id, session)
    return session
  }

  get(id) {
    this.cleanup()
    const session = this.sessions.get(String(id || ''))
    if (!session) return null
    this.touch(session)
    return session
  }

  touch(session) {
    session.updatedAt = Date.now()
    session.expiresAt = session.updatedAt + this.ttlMs
  }

  delete(id) {
    return this.sessions.delete(String(id || ''))
  }
}

export function publicQuickOrderSession(session) {
  return {
    id: session.id,
    platform: session.platform,
    businessId: session.businessId,
    stage: session.stage,
    maskedPhone: session.maskedPhone,
    authSummary: session.authSummary,
    product: session.product,
    selection: session.selection,
    authSmsCooldownSeconds: session.authSmsSentAt ? Math.max(0, Math.ceil((session.authSmsSentAt + 60_000 - Date.now()) / 1000)) : 0,
    smsCooldownSeconds: session.smsSentAt ? Math.max(0, Math.ceil((session.smsSentAt + 60_000 - Date.now()) / 1000)) : 0,
    lastResult: session.lastResult,
    createdAt: new Date(session.createdAt).toISOString(),
    updatedAt: new Date(session.updatedAt).toISOString(),
    expiresAt: new Date(session.expiresAt).toISOString(),
  }
}

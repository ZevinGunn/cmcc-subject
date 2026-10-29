import crypto from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'
import {
  classifyAccessFeature,
  describeAccessAction,
  getAccessIp,
  recordAccessLog,
  resolveAccessActor,
  sanitizeAccessPath,
} from './accessLog.js'

function shouldLog(req: Request): boolean {
  if (req.method === 'OPTIONS') return false
  if (!req.path.startsWith('/api/')) return false
  if (req.path === '/api/health') return false
  if (req.path === '/api/access-logs/page-view') return false
  return true
}

export function accessLogMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!shouldLog(req)) {
    next()
    return
  }

  const startedAt = new Date()
  const startedNs = process.hrtime.bigint()
  const requestId = boundedRequestId(req.header('x-request-id')) || crypto.randomUUID()
  res.setHeader('x-request-id', requestId)
  let recorded = false

  const record = (completed: boolean) => {
    if (recorded) return
    recorded = true
    const durationMs = Number(process.hrtime.bigint() - startedNs) / 1_000_000
    const statusCode = completed ? res.statusCode : 499
    const path = sanitizeAccessPath(req.path)
    const feature = classifyAccessFeature(path)
    const queryKeys = Object.keys(req.query || {}).slice(0, 30)
    void resolveAccessActor(req).then((actor) => recordAccessLog({
      createdAt: startedAt.toISOString(),
      actorType: actor.type,
      actorId: actor.id,
      actorName: actor.name,
      feature,
      action: describeAccessAction(req.method, path, feature),
      method: req.method.toUpperCase(),
      path,
      statusCode,
      success: completed && statusCode < 400,
      durationMs,
      ipAddress: getAccessIp(req),
      userAgent: req.header('user-agent'),
      referer: req.header('referer'),
      requestId,
      meta: queryKeys.length > 0 ? { queryKeys } : undefined,
    })).catch(() => undefined)
  }

  res.once('finish', () => record(true))
  res.once('close', () => record(res.writableEnded))
  next()
}

function boundedRequestId(value: unknown): string {
  const text = String(value || '').trim()
  return /^[a-zA-Z0-9_.:-]{1,100}$/.test(text) ? text : ''
}

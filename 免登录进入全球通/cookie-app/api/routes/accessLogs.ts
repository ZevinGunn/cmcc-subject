import crypto from 'node:crypto'
import { Router, type Request, type Response } from 'express'
import {
  classifyAccessFeature,
  describeAccessAction,
  getAccessIp,
  listAccessLogs,
  recordAccessLog,
  resolveAccessActor,
  sanitizeAccessPath,
  type AccessActorType,
} from '../services/accessLog.js'
import { findCurrentAdmin } from '../services/adminAuthStore.js'

const router = Router()

router.post('/page-view', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  const path = sanitizeAccessPath(req.body?.path)
  const feature = classifyAccessFeature(path)
  const actor = await resolveAccessActor(req)
  await recordAccessLog({
    createdAt: new Date().toISOString(),
    actorType: actor.type,
    actorId: actor.id,
    actorName: actor.name,
    feature,
    action: describeAccessAction('PAGE', '/api/access-logs/page-view', feature),
    method: 'PAGE',
    path,
    statusCode: 204,
    success: true,
    durationMs: 0,
    ipAddress: getAccessIp(req),
    userAgent: req.header('user-agent'),
    referer: req.header('referer'),
    requestId,
    meta: Array.isArray(req.body?.queryKeys)
      ? { queryKeys: req.body.queryKeys.map((item: unknown) => String(item).slice(0, 60)).slice(0, 30) }
      : undefined,
  })
  res.status(204).end()
})

router.get('/', async (req: Request, res: Response) => {
  const requestId = String(res.getHeader('x-request-id') || crypto.randomUUID())
  const admin = await findCurrentAdmin(req)
  if (!admin) {
    res.status(401).json({ ok: false, message: '未登录', errorCode: 'UNAUTHENTICATED', requestId })
    return
  }
  try {
    const actorTypeRaw = String(req.query.actorType || '')
    const actorType = ['admin', 'user', 'anonymous'].includes(actorTypeRaw)
      ? actorTypeRaw as AccessActorType
      : undefined
    const successRaw = String(req.query.success || '')
    const data = await listAccessLogs({
      page: Number(req.query.page || 1),
      limit: Number(req.query.limit || 50),
      actorType,
      feature: String(req.query.feature || '').trim() || undefined,
      success: successRaw === 'true' ? true : successRaw === 'false' ? false : undefined,
      search: String(req.query.search || '').trim() || undefined,
    })
    res.json({ ok: true, data, requestId })
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : '访问日志查询失败',
      errorCode: 'ACCESS_LOG_QUERY_FAILED',
      requestId,
    })
  }
})

export default router

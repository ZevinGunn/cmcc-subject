import crypto from 'node:crypto'
import { Router, type Request, type Response } from 'express'
import { findCurrentAdmin } from '../services/adminAuthStore.js'
import {
  AnnouncementValidationError,
  createAnnouncement,
  deleteAnnouncement,
  dismissAnnouncement,
  listAdminAnnouncements,
  listPublicAnnouncements,
  markAnnouncementRead,
  markAnnouncementShown,
  updateAnnouncement,
  type AnnouncementInput,
  type DismissScope,
} from '../services/announcementStore.js'
import { isAdminRequest } from '../services/serviceLoginGuard.js'
import { findCurrentUser } from '../services/userAuthStore.js'

const router = Router()

function fail(res: Response, status: number, message: string, errorCode: string, requestId: string) {
  res.status(status).json({ ok: false, message, errorCode, requestId })
}

function handleError(res: Response, error: unknown, requestId: string) {
  if (error instanceof AnnouncementValidationError) {
    fail(res, 400, error.message, error.code, requestId)
    return
  }
  const errorName = error instanceof Error ? error.name : 'UnknownError'
  console.error(`[announcements] request ${requestId} failed (${errorName})`, error)
  fail(res, 500, '公告服务异常，请稍后重试', 'SERVER_ERROR', requestId)
}

async function requireAdmin(req: Request, res: Response, requestId: string): Promise<string | null> {
  const admin = await findCurrentAdmin(req)
  if (admin) return admin.username
  if (isAdminRequest(req)) return 'admin'
  fail(res, 403, '需要管理员权限', 'FORBIDDEN', requestId)
  return null
}

async function requireUser(req: Request, res: Response, requestId: string) {
  const user = await findCurrentUser(req)
  if (!user) fail(res, 401, '请先登录', 'UNAUTHENTICATED', requestId)
  return user
}

function inputFromBody(body: Record<string, unknown> | undefined): AnnouncementInput {
  return {
    title: String(body?.title || ''),
    contentHtml: String(body?.contentHtml || ''),
    level: String(body?.level || '') as AnnouncementInput['level'],
    important: Boolean(body?.important),
    enabled: Boolean(body?.enabled),
    publishAt: String(body?.publishAt || new Date().toISOString()),
    expireAt: body?.expireAt ? String(body.expireAt) : undefined,
  }
}

router.get('/admin', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireAdmin(req, res, requestId))) return
    const announcements = await listAdminAnnouncements()
    res.json({ ok: true, data: { announcements }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/admin', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    const admin = await requireAdmin(req, res, requestId)
    if (!admin) return
    const announcement = await createAnnouncement(inputFromBody(req.body), admin)
    res.status(201).json({ ok: true, data: { announcement }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.put('/admin/:id', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireAdmin(req, res, requestId))) return
    const announcement = await updateAnnouncement(String(req.params.id || ''), inputFromBody(req.body))
    if (!announcement) return fail(res, 404, '公告不存在', 'ANNOUNCEMENT_NOT_FOUND', requestId)
    res.json({ ok: true, data: { announcement }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.delete('/admin/:id', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireAdmin(req, res, requestId))) return
    if (!(await deleteAnnouncement(String(req.params.id || '')))) {
      return fail(res, 404, '公告不存在', 'ANNOUNCEMENT_NOT_FOUND', requestId)
    }
    res.json({ ok: true, data: {}, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.get('/public', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    const user = await requireUser(req, res, requestId)
    if (!user) return
    res.json({ ok: true, data: await listPublicAnnouncements(user.id), requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/:id/read', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    const user = await requireUser(req, res, requestId)
    if (!user) return
    const receipt = await markAnnouncementRead(String(req.params.id || ''), user.id)
    if (!receipt) return fail(res, 404, '公告不存在或已失效', 'ANNOUNCEMENT_NOT_FOUND', requestId)
    const { unreadCount } = await listPublicAnnouncements(user.id)
    res.json({ ok: true, data: { receipt, unreadCount }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/:id/shown', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    const user = await requireUser(req, res, requestId)
    if (!user) return
    const receipt = await markAnnouncementShown(String(req.params.id || ''), user.id)
    if (!receipt) return fail(res, 404, '公告不存在或已失效', 'ANNOUNCEMENT_NOT_FOUND', requestId)
    res.json({ ok: true, data: { receipt }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/:id/dismiss', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    const user = await requireUser(req, res, requestId)
    if (!user) return
    const scope = String(req.body?.scope || '') as DismissScope
    if (!['today', 'forever'].includes(scope)) {
      return fail(res, 400, '提醒范围不正确', 'INVALID_INPUT', requestId)
    }
    const receipt = await dismissAnnouncement(String(req.params.id || ''), user.id, scope)
    if (!receipt) return fail(res, 404, '公告不存在或已失效', 'ANNOUNCEMENT_NOT_FOUND', requestId)
    res.json({ ok: true, data: { receipt }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

export default router

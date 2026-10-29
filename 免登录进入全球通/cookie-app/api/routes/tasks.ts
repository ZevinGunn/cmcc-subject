import crypto from 'node:crypto'
import { Router, type Request, type Response } from 'express'
import {
  cancelBatchTask,
  createOrReuseBatchTask,
  createSchedule,
  deleteSchedule,
  getActiveTask,
  getTaskById,
  listActiveTasks,
  listRecentTasks,
  listSchedules,
  updateSchedule,
  type BatchTaskScopeType,
  type BatchTaskType,
} from '../services/batchTasks.js'
import { getPublicLink } from '../services/publicLinksStore.js'
import { hasValidAdminSessionToken } from '../services/adminAuthStore.js'
import { findCurrentUser } from '../services/userAuthStore.js'
import { listCmccAutoCheckinCapabilities, parseCmccAutoCheckinParams } from '../services/cmccAutoCheckin.js'

const router = Router()

function parseCookieHeader(header?: string): Record<string, string> {
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

function isLocalRequest(req: Request): boolean {
  const ip = req.ip || ''
  if (ip === '127.0.0.1' || ip === '::1') return true
  if (ip.startsWith('::ffff:127.0.0.1')) return true
  const host = String(req.hostname || '').toLowerCase()
  if (host === 'localhost') return true
  return false
}

function isAdminRequest(req: Request): boolean {
  if (hasValidAdminSessionToken(req)) return true
  const adminKey = process.env.ADMIN_KEY?.trim()
  if (!adminKey) return isLocalRequest(req)
  const header = req.header('x-admin-key')
  if (header && header.trim() === adminKey) return true
  const cookies = parseCookieHeader(req.header('cookie'))
  const cookieValue = cookies.admin_key
  if (cookieValue && cookieValue.trim() === adminKey) return true
  return false
}

async function ensureScopeAccess(
  req: Request,
  res: Response,
  requestId: string,
  scopeType: BatchTaskScopeType,
  scopeId?: string,
): Promise<boolean> {
  if (scopeType === 'admin_all') {
    if (isAdminRequest(req)) return true
    res.status(403).json({
      ok: false,
      message: 'Forbidden',
      errorCode: 'FORBIDDEN',
      requestId,
    })
    return false
  }
  if (scopeType === 'user') {
    const currentUser = await findCurrentUser(req).catch(() => null)
    if (currentUser && (!scopeId || scopeId === currentUser.id)) return true
    if (isAdminRequest(req)) return true
    res.status(403).json({
      ok: false,
      message: 'Forbidden',
      errorCode: 'FORBIDDEN',
      requestId,
    })
    return false
  }
  if (scopeType === 'selected_accounts') {
    if (isAdminRequest(req)) return true
    res.status(403).json({
      ok: false,
      message: 'Forbidden',
      errorCode: 'FORBIDDEN',
      requestId,
    })
    return false
  }
  if (scopeType === 'account') {
    const accountId = String(scopeId || '').trim()
    if (!accountId) {
      res.status(400).json({
        ok: false,
        message: '缺少账号',
        errorCode: 'INVALID_ACCOUNT',
        requestId,
      })
      return false
    }
    if (isAdminRequest(req)) return true
    const linkId =
      (typeof req.body?.publicLinkId === 'string' ? req.body.publicLinkId.trim() : '') ||
      (typeof req.query?.publicLinkId === 'string' ? req.query.publicLinkId.trim() : '')
    if (!linkId) {
      res.status(403).json({
        ok: false,
        message: '缺少邀请码授权',
        errorCode: 'FORBIDDEN',
        requestId,
      })
      return false
    }
    const link = await getPublicLink(linkId)
    if (!link || !link.accountIds.includes(accountId)) {
      res.status(403).json({
        ok: false,
        message: '账号不属于当前邀请码',
        errorCode: 'FORBIDDEN',
        requestId,
      })
      return false
    }
    return true
  }
  const linkId =
    scopeId ||
    (typeof req.body?.publicLinkId === 'string' ? req.body.publicLinkId.trim() : '') ||
    (typeof req.query?.scopeId === 'string' ? req.query.scopeId.trim() : '') ||
    (typeof req.query?.publicLinkId === 'string' ? req.query.publicLinkId.trim() : '')
  if (!linkId) {
    res.status(400).json({
      ok: false,
      message: '缺少邀请码',
      errorCode: 'INVALID_LINK',
      requestId,
    })
    return false
  }
  const link = await getPublicLink(linkId)
  if (!link) {
    res.status(404).json({
      ok: false,
      message: '邀请码不存在',
      errorCode: 'NOT_FOUND',
      requestId,
    })
    return false
  }
  return true
}

async function normalizeScopeFromRequest(
  req: Request,
  scopeType: BatchTaskScopeType,
  scopeId?: string,
): Promise<string | undefined> {
  if (scopeType !== 'user') return scopeId
  const currentUser = await findCurrentUser(req).catch(() => null)
  return currentUser?.id || scopeId
}

async function startTask(
  req: Request,
  res: Response,
  type: BatchTaskType,
): Promise<void> {
  const requestId = crypto.randomUUID()
  const scopeType = (String(req.body?.scopeType || 'admin_all').trim() || 'admin_all') as BatchTaskScopeType
  const requestedScopeId = typeof req.body?.scopeId === 'string' ? req.body.scopeId.trim() : undefined
  try {
    const scopeId = await normalizeScopeFromRequest(req, scopeType, requestedScopeId)
    const allowed = await ensureScopeAccess(req, res, requestId, scopeType, scopeId)
    if (!allowed) return
    if (type === 'cmcc_auto_checkin') {
      const params = parseCmccAutoCheckinParams(typeof req.body?.sspid === 'string' ? req.body.sspid : undefined)
      if (params.dryRun === false && !isAdminRequest(req)) {
        res.status(403).json({ ok: false, message: '真实活动写操作仅允许管理员发起', errorCode: 'FORBIDDEN', requestId })
        return
      }
    }
    const task = await createOrReuseBatchTask({
      type,
      scopeType,
      scopeId,
      sspid: typeof req.body?.sspid === 'string' ? req.body.sspid.trim() : undefined,
      accountIds: Array.isArray(req.body?.accountIds)
        ? req.body.accountIds.map((item: unknown) => String(item || '').trim()).filter(Boolean)
        : undefined,
      timezone:
        typeof req.body?.timezone === 'string' && req.body.timezone.trim()
          ? req.body.timezone.trim()
          : 'Asia/Shanghai',
      forceDaily: req.body?.forceDaily === true,
      wedRecharge:
        type === 'wed_recharge' || type === 'refresh_and_sign'
          ? {
              count: Number(req.body?.count ?? 50),
              taskId: typeof req.body?.taskId === 'string' ? req.body.taskId.trim() : undefined,
              activityId:
                typeof req.body?.activityId === 'string'
                  ? req.body.activityId.trim()
                  : undefined,
              drawAfterRun: req.body?.draw !== false && req.body?.drawAfterRun !== false,
              autoTaskList: true,
              useAppToken: false,
            }
          : undefined,
    })
    res.json({
      ok: true,
      data: {
        task: task.task,
        reused: task.reused,
      },
      requestId,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({
      ok: false,
      message: msg,
      errorCode: 'SERVER_ERROR',
      requestId,
    })
  }
}

router.post('/refresh', async (req: Request, res: Response) => {
  await startTask(req, res, 'refresh')
})

router.post('/keepalive', async (req: Request, res: Response) => {
  await startTask(req, res, 'keepalive')
})

router.post('/global-telecom-daily', async (req: Request, res: Response) => {
  await startTask(req, res, 'global_telecom_daily')
})

router.post('/ck-maintenance', async (req: Request, res: Response) => {
  await startTask(req, res, 'ck_maintenance')
})

router.post('/sign', async (req: Request, res: Response) => {
  await startTask(req, res, 'sign')
})

router.post('/global-telecom-resign', async (req: Request, res: Response) => {
  await startTask(req, res, 'global_telecom_resign')
})

router.post('/refresh-and-sign', async (req: Request, res: Response) => {
  await startTask(req, res, 'refresh_and_sign')
})

router.post('/query-info', async (req: Request, res: Response) => {
  await startTask(req, res, 'query_info')
})

router.post('/yunpan-activate', async (req: Request, res: Response) => {
  await startTask(req, res, 'yunpan_activate')
})

router.post('/activity-session-refresh', async (req: Request, res: Response) => {
  await startTask(req, res, 'activity_session_refresh')
})

router.post('/cmcc-session-exchange', async (req: Request, res: Response) => {
  await startTask(req, res, 'cmcc_session_exchange')
})

router.post('/cmcc-auto-checkin', async (req: Request, res: Response) => {
  await startTask(req, res, 'cmcc_auto_checkin')
})

router.get('/cmcc-auto-checkin/capabilities', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  if (!isAdminRequest(req)) {
    res.status(403).json({ ok: false, message: 'Forbidden', errorCode: 'FORBIDDEN', requestId })
    return
  }
  res.json({ ok: true, data: { capabilities: listCmccAutoCheckinCapabilities() }, requestId })
})

router.post('/wed-recharge', async (req: Request, res: Response) => {
  await startTask(req, res, 'wed_recharge')
})

router.get('/active', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  const scopeType = (String(req.query?.scopeType || 'admin_all').trim() || 'admin_all') as BatchTaskScopeType
  const requestedScopeId = typeof req.query?.scopeId === 'string' ? req.query.scopeId.trim() : undefined
  const type =
    typeof req.query?.type === 'string' && req.query.type.trim()
      ? (req.query.type.trim() as BatchTaskType)
      : undefined
  try {
    const scopeId = await normalizeScopeFromRequest(req, scopeType, requestedScopeId)
    const allowed = await ensureScopeAccess(req, res, requestId, scopeType, scopeId)
    if (!allowed) return
    const task = await getActiveTask({ scopeType, scopeId, type })
    res.json({
      ok: true,
      data: { task },
      requestId,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({
      ok: false,
      message: msg,
      errorCode: 'SERVER_ERROR',
      requestId,
    })
  }
})

router.get('/active-list', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  const scopeType =
    typeof req.query?.scopeType === 'string' && req.query.scopeType.trim()
      ? (req.query.scopeType.trim() as BatchTaskScopeType)
      : undefined
  const scopeId = typeof req.query?.scopeId === 'string' ? req.query.scopeId.trim() : undefined
  const type =
    typeof req.query?.type === 'string' && req.query.type.trim()
      ? (req.query.type.trim() as BatchTaskType)
      : undefined
  try {
    const effectiveScopeId = scopeType
      ? await normalizeScopeFromRequest(req, scopeType, scopeId)
      : scopeId
    if (scopeType) {
      const allowed = await ensureScopeAccess(req, res, requestId, scopeType, effectiveScopeId)
      if (!allowed) return
    } else if (!isAdminRequest(req)) {
      res.status(403).json({
        ok: false,
        message: 'Forbidden',
        errorCode: 'FORBIDDEN',
        requestId,
      })
      return
    }
    const tasks = await listActiveTasks({ scopeType, scopeId: effectiveScopeId, type })
    res.json({
      ok: true,
      data: { tasks },
      requestId,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({
      ok: false,
      message: msg,
      errorCode: 'SERVER_ERROR',
      requestId,
    })
  }
})

router.post('/:id/cancel', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  const taskId = String(req.params.id || '').trim()
  try {
    const existing = await getTaskById(taskId)
    if (!existing) {
      res.status(404).json({
        ok: false,
        message: '任务不存在',
        errorCode: 'NOT_FOUND',
        requestId,
      })
      return
    }
    const allowed = await ensureScopeAccess(
      req,
      res,
      requestId,
      existing.scopeType,
      existing.scopeId,
    )
    if (!allowed) return
    const task = await cancelBatchTask(taskId)
    res.json({
      ok: true,
      data: { task },
      requestId,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({
      ok: false,
      message: msg,
      errorCode: 'SERVER_ERROR',
      requestId,
    })
  }
})

router.get('/schedules/list', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  try {
    if (!isAdminRequest(req)) {
      res.status(403).json({
        ok: false,
        message: 'Forbidden',
        errorCode: 'FORBIDDEN',
        requestId,
      })
      return
    }
    const schedules = await listSchedules()
    res.json({
      ok: true,
      data: { schedules },
      requestId,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({
      ok: false,
      message: msg,
      errorCode: 'SERVER_ERROR',
      requestId,
    })
  }
})

router.post('/schedules', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  try {
    if (!isAdminRequest(req)) {
      res.status(403).json({
        ok: false,
        message: 'Forbidden',
        errorCode: 'FORBIDDEN',
        requestId,
      })
      return
    }
    const schedule = await createSchedule({
      name: typeof req.body?.name === 'string' ? req.body.name : '',
      times: Array.isArray(req.body?.times) ? req.body.times : String(req.body?.times || ''),
      enabled: req.body?.enabled !== false,
      sspid: typeof req.body?.sspid === 'string' ? req.body.sspid : undefined,
      timezone:
        typeof req.body?.timezone === 'string' && req.body.timezone.trim()
          ? req.body.timezone.trim()
          : 'Asia/Shanghai',
      action:
        typeof req.body?.action === 'string' && req.body.action.trim()
          ? (req.body.action.trim() as BatchTaskType)
          : 'refresh_and_sign',
    })
    res.json({
      ok: true,
      data: { schedule },
      requestId,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : '保存计划失败'
    res.status(msg === 'INVALID_TIMES' || msg === 'INVALID_SSPID' ? 400 : 500).json({
      ok: false,
      message:
        msg === 'INVALID_TIMES'
          ? '请至少提供一个合法时间点'
          : msg === 'INVALID_SSPID'
            ? '请先填写 SSPID 再保存定时计划'
            : msg,
      errorCode:
        msg === 'INVALID_TIMES'
          ? 'INVALID_TIMES'
          : msg === 'INVALID_SSPID'
            ? 'INVALID_SSPID'
            : 'SERVER_ERROR',
      requestId,
    })
  }
})

router.put('/schedules/:id', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  const id = String(req.params.id || '').trim()
  try {
    if (!isAdminRequest(req)) {
      res.status(403).json({
        ok: false,
        message: 'Forbidden',
        errorCode: 'FORBIDDEN',
        requestId,
      })
      return
    }
    const schedule = await updateSchedule({
      id,
      name: typeof req.body?.name === 'string' ? req.body.name : undefined,
      times: Array.isArray(req.body?.times)
        ? req.body.times
        : req.body?.times !== undefined
          ? String(req.body.times)
          : undefined,
      enabled: typeof req.body?.enabled === 'boolean' ? req.body.enabled : undefined,
      sspid: typeof req.body?.sspid === 'string' ? req.body.sspid : undefined,
      timezone: typeof req.body?.timezone === 'string' ? req.body.timezone : undefined,
    })
    res.json({
      ok: true,
      data: { schedule },
      requestId,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : '更新计划失败'
    res.status(msg === 'INVALID_TIMES' || msg === 'INVALID_SSPID' ? 400 : 500).json({
      ok: false,
      message:
        msg === 'INVALID_TIMES'
          ? '请至少提供一个合法时间点'
          : msg === 'INVALID_SSPID'
            ? '请先填写 SSPID 再启用或更新定时计划'
            : msg,
      errorCode:
        msg === 'INVALID_TIMES'
          ? 'INVALID_TIMES'
          : msg === 'INVALID_SSPID'
            ? 'INVALID_SSPID'
            : 'SERVER_ERROR',
      requestId,
    })
  }
})

router.delete('/schedules/:id', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  const id = String(req.params.id || '').trim()
  try {
    if (!isAdminRequest(req)) {
      res.status(403).json({
        ok: false,
        message: 'Forbidden',
        errorCode: 'FORBIDDEN',
        requestId,
      })
      return
    }
    await deleteSchedule(id)
    res.json({
      ok: true,
      data: { id },
      requestId,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : '删除计划失败'
    res.status(500).json({
      ok: false,
      message: msg,
      errorCode: 'SERVER_ERROR',
      requestId,
    })
  }
})

router.get('/list', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  try {
    if (!isAdminRequest(req)) {
      res.status(403).json({
        ok: false,
        message: 'Forbidden',
        errorCode: 'FORBIDDEN',
        requestId,
      })
      return
    }
    const limit = Number(req.query?.limit)
    const tasks = await listRecentTasks(limit)
    res.json({
      ok: true,
      data: { tasks },
      requestId,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({
      ok: false,
      message: msg,
      errorCode: 'SERVER_ERROR',
      requestId,
    })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  const id = String(req.params.id || '').trim()
  try {
    const task = await getTaskById(id)
    if (!task) {
      res.status(404).json({
        ok: false,
        message: '任务不存在',
        errorCode: 'NOT_FOUND',
        requestId,
      })
      return
    }
    const allowed = await ensureScopeAccess(req, res, requestId, task.scopeType, task.scopeId)
    if (!allowed) return
    res.json({
      ok: true,
      data: { task },
      requestId,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({
      ok: false,
      message: msg,
      errorCode: 'SERVER_ERROR',
      requestId,
    })
  }
})

export default router

import crypto from 'node:crypto'
import { getWedCouponStockMonitorStatus } from '../services/wedCouponStockMonitor.js'
import { Router, type Request, type Response } from 'express'
import {
  createAdminSession,
  findCurrentAdmin,
  verifyAdminLogin,
  type AdminUserRecord,
} from '../services/adminAuthStore.js'
import {
  getDatabaseMaintenanceStatus,
  runDatabaseBackup,
  runDatabaseCleanup,
} from '../services/databaseMaintenance.js'

const router = Router()
const ADMIN_SESSION_COOKIE = 'admin_session'

function adminPayload(admin: AdminUserRecord) {
  return {
    id: admin.id,
    username: admin.username,
    role: admin.role,
    disabledAt: admin.disabledAt,
    disabledReason: admin.disabledReason,
    lastLoginAt: admin.lastLoginAt,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  }
}

function setAdminCookie(res: Response, token: string) {
  res.cookie(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })
}

function clearAdminCookie(res: Response) {
  res.clearCookie(ADMIN_SESSION_COOKIE, { path: '/' })
}

router.post('/login', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  const username = String(req.body?.username || '').trim().toLowerCase()
  const password = String(req.body?.password || '')
  if (!username || !password) {
    res.status(400).json({ ok: false, message: '请输入管理员用户名和密码', errorCode: 'BAD_REQUEST', requestId })
    return
  }
  try {
    const admin = await verifyAdminLogin({ username, password })
    if (!admin) {
      res.status(401).json({ ok: false, message: '管理员用户名或密码不正确', errorCode: 'BAD_CREDENTIALS', requestId })
      return
    }
    setAdminCookie(res, createAdminSession(admin))
    res.json({ ok: true, data: { admin: adminPayload(admin) }, requestId })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
  }
})

router.get('/me', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  try {
    const admin = await findCurrentAdmin(req)
    if (!admin) {
      res.status(401).json({ ok: false, message: '未登录', errorCode: 'UNAUTHENTICATED', requestId })
      return
    }
    res.json({ ok: true, data: { admin: adminPayload(admin) }, requestId })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
  }
})

router.post('/logout', (_req: Request, res: Response) => {
  clearAdminCookie(res)
  res.json({ ok: true, requestId: crypto.randomUUID() })
})

router.get('/wed-coupon-stock-monitor', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  if (!(await findCurrentAdmin(req))) {
    res.status(401).json({ ok: false, message: '未登录', errorCode: 'UNAUTHENTICATED', requestId })
    return
  }
  try {
    res.setHeader('Cache-Control', 'no-store')
    res.json({ ok: true, data: await getWedCouponStockMonitorStatus(), requestId })
  } catch {
    res.status(503).json({ ok: false, message: '监控配置或状态文件不可读', requestId })
  }
})

router.get('/database-maintenance', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  const admin = await findCurrentAdmin(req)
  if (!admin) {
    res.status(401).json({ ok: false, message: '未登录', errorCode: 'UNAUTHENTICATED', requestId })
    return
  }
  res.json({ ok: true, data: getDatabaseMaintenanceStatus(), requestId })
})

router.post('/database-maintenance/:action', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  const admin = await findCurrentAdmin(req)
  if (!admin) {
    res.status(401).json({ ok: false, message: '未登录', errorCode: 'UNAUTHENTICATED', requestId })
    return
  }
  try {
    const action = String(req.params.action || '')
    const result = action === 'backup'
      ? await runDatabaseBackup().then(() => undefined)
      : action === 'cleanup'
        ? await runDatabaseCleanup()
        : null
    if (result === null) {
      res.status(404).json({ ok: false, message: '不支持的维护操作', errorCode: 'NOT_FOUND', requestId })
      return
    }
    res.json({ ok: true, data: { result, status: getDatabaseMaintenanceStatus() }, requestId })
  } catch (error) {
    const message = error instanceof Error ? error.message : '数据库维护失败'
    res.status(message.endsWith('ALREADY_RUNNING') ? 409 : 500).json({
      ok: false,
      message,
      errorCode: message.endsWith('ALREADY_RUNNING') ? 'ALREADY_RUNNING' : 'MAINTENANCE_FAILED',
      requestId,
    })
  }
})

export default router

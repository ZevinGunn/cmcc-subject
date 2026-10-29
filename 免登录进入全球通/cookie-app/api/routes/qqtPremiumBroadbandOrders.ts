import crypto from 'node:crypto'
import { Router, type Request, type Response } from 'express'
import { getAccountById } from '../services/accountsStore.js'
import {
  assertQqtPremiumBroadbandSessionAccess,
  checkQqtPremiumBroadband,
  createQqtPremiumBroadbandSession,
  deleteQqtPremiumBroadbandSession,
  QqtPremiumBroadbandError,
  submitQqtPremiumBroadband,
} from '../services/qqtPremiumBroadbandOrder.js'
import { isAdminRequest } from '../services/serviceLoginGuard.js'
import { findCurrentUser, listUserAccountSummaries } from '../services/userAuthStore.js'

const router = Router()

type ApiResp<T> =
  | { ok: true; data: T; requestId: string }
  | { ok: false; message: string; errorCode: string; requestId: string; response?: unknown }

type Access = { ownerKey: string; isAdmin: boolean; userId?: string }

function fail(res: Response, status: number, message: string, requestId: string, errorCode: string, response?: unknown): void {
  res.status(status).json({ ok: false, message, errorCode, requestId, ...(response !== undefined ? { response } : {}) })
}

function handleError(res: Response, error: unknown, requestId: string): void {
  if (error instanceof QqtPremiumBroadbandError) {
    fail(res, error.status, error.message, requestId, error.code, error.response)
    return
  }
  fail(res, 500, '服务端异常', requestId, 'SERVER_ERROR')
}

async function resolveAccess(req: Request, res: Response, requestId: string): Promise<Access | null> {
  if (isAdminRequest(req)) return { ownerKey: 'admin', isAdmin: true }
  const user = await findCurrentUser(req)
  if (!user) {
    fail(res, 401, '请先登录账号中心', requestId, 'UNAUTHENTICATED')
    return null
  }
  if (!user.permissions.businessOrder) {
    fail(res, 403, '当前用户未开启业务订购权限', requestId, 'BUSINESS_ORDER_FORBIDDEN')
    return null
  }
  return { ownerKey: `user:${user.id}`, isAdmin: false, userId: user.id }
}

async function canUseAccount(access: Access, accountId: string): Promise<boolean> {
  if (access.isAdmin) return Boolean(await getAccountById(accountId))
  const accounts = await listUserAccountSummaries(String(access.userId))
  return accounts.some((account) => account.id === accountId)
}

async function requireSession(req: Request, res: Response, requestId: string): Promise<Access | null> {
  const access = await resolveAccess(req, res, requestId)
  if (!access) return null
  assertQqtPremiumBroadbandSessionAccess(String(req.params.id || ''), access.ownerKey)
  return access
}

router.post('/sessions', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const access = await resolveAccess(req, res, requestId)
    if (!access) return
    const accountId = String(req.body?.accountId || '').trim()
    const loginSessionId = String(req.body?.loginSessionId || '').trim()
    if (!accountId) return fail(res, 400, '请选择办理账号', requestId, 'ACCOUNT_REQUIRED')
    if (!loginSessionId) return fail(res, 401, '请先完成北京移动登录', requestId, 'BMCC_LOGIN_REQUIRED')
    if (!(await canUseAccount(access, accountId))) return fail(res, 403, '只能使用当前用户关联账号', requestId, 'ACCOUNT_FORBIDDEN')
    const session = await createQqtPremiumBroadbandSession({ ownerKey: access.ownerKey, accountId, loginSessionId })
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.delete('/sessions/:id', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireSession(req, res, requestId))) return
    res.json({ ok: true, data: { deleted: deleteQqtPremiumBroadbandSession(String(req.params.id)) }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/check', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireSession(req, res, requestId))) return
    const session = await checkQqtPremiumBroadband(String(req.params.id))
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/submit', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireSession(req, res, requestId))) return
    const session = await submitQqtPremiumBroadband(String(req.params.id), req.body || {})
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

export default router

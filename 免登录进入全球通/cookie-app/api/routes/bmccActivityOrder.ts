import crypto from 'node:crypto'
import { Router, type Request, type Response } from 'express'
import { getAccountById } from '../services/accountsStore.js'
import {
  assertBmccActivityOrderSessionAccess,
  BMCC_ACTIVITY_PRESETS,
  BmccActivityOrderError,
  cacheBmccActivityOrderLogin,
  confirmBmccActivityOrder,
  createOrRestoreBmccActivityOrderSession,
  deleteBmccActivityOrderSession,
  loadBmccActivityInfo,
  loginBmccActivityOrderSession,
  readBmccActivityOrderSession,
  refreshBmccActivityCaptcha,
  resolveBmccActivityConfig,
  restoreCachedBmccActivityOrderSession,
  sendBmccActivityLoginSms,
  sendBmccActivityOrderSms,
  submitBmccActivityOrder,
  updateBmccActivityOrderRequest,
  type BmccActivityConfig,
} from '../services/bmccActivityOrder.js'
import {
  createStoredBmccActivityConfig,
  getStoredBmccActivityConfig,
  listStoredBmccActivityConfigs,
  updateStoredBmccActivityConfig,
} from '../services/bmccActivityConfigs.js'
import { isAdminRequest } from '../services/serviceLoginGuard.js'
import { findCurrentUser, listUserAccountSummaries } from '../services/userAuthStore.js'

const router = Router()

type ApiResp<T> =
  | { ok: true; data: T; requestId: string }
  | { ok: false; message: string; errorCode: string; requestId: string }

type OrderAccess = { ownerKey: string; isAdmin: boolean; userId?: string }
type OrderTarget = { accountId?: string; phone: string }

const builtinConfigs = BMCC_ACTIVITY_PRESETS.map((config) => ({
  ...config,
  id: `builtin:${config.activityName}`,
  source: 'builtin' as const,
  editable: false,
}))

function fail(res: Response, status: number, message: string, requestId: string, errorCode: string): void {
  res.status(status).json({ ok: false, message, errorCode, requestId })
}

function handleError(res: Response, error: unknown, requestId: string): void {
  if (error instanceof BmccActivityOrderError) {
    fail(res, error.status, error.message, requestId, error.code)
    return
  }
  fail(res, 500, '服务端异常', requestId, 'SERVER_ERROR')
}

function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  if ('code' in error && error.code === '23505') return true
  if ('meta' in error && error.meta && typeof error.meta === 'object' && 'code' in error.meta) {
    return error.meta.code === '23505'
  }
  return false
}

async function resolveAccess(req: Request, res: Response, requestId: string): Promise<OrderAccess | null> {
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

async function requireSessionAccess(
  req: Request,
  res: Response,
  requestId: string,
  sessionId: string,
): Promise<OrderAccess | null> {
  const access = await resolveAccess(req, res, requestId)
  if (!access) return null
  assertBmccActivityOrderSessionAccess(sessionId, access.ownerKey)
  return access
}

async function resolveOrderTarget(
  req: Request,
  res: Response,
  requestId: string,
  access: OrderAccess,
  requireAccount = false,
): Promise<OrderTarget | null> {
  const accountId = String(req.body?.accountId || '').trim()
  let phone = String(req.body?.phone || '').trim()
  if (accountId) {
    if (!access.isAdmin) {
      const accounts = await listUserAccountSummaries(String(access.userId))
      if (!accounts.some((account) => account.id === accountId)) {
        fail(res, 403, '只能为当前用户关联账号办理业务', requestId, 'ACCOUNT_FORBIDDEN')
        return null
      }
    }
    const account = await getAccountById(accountId)
    if (!account || account.disabledAt) {
      fail(res, 404, '账号不存在或已停用', requestId, 'ACCOUNT_NOT_FOUND')
      return null
    }
    phone = String(account.phone || '').trim()
  } else if (!access.isAdmin || requireAccount) {
    fail(res, 400, '请从已关联账号进入业务订购', requestId, 'ACCOUNT_REQUIRED')
    return null
  }
  return { accountId: accountId || undefined, phone }
}

router.get('/presets', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const access = await resolveAccess(req, res, requestId)
    if (!access) return
    const stored = await listStoredBmccActivityConfigs()
    res.json({
      ok: true,
      data: {
        presets: [
          ...builtinConfigs,
          ...stored.map((config) => ({ ...config, source: 'custom' as const, editable: access.isAdmin })),
        ],
        canManage: access.isAdmin,
      },
      requestId,
    })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/configs', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const access = await resolveAccess(req, res, requestId)
    if (!access) return
    if (!access.isAdmin) return fail(res, 403, '仅管理员可以新增活动配置', requestId, 'ADMIN_REQUIRED')
    const config = resolveBmccActivityConfig(req.body && typeof req.body === 'object' ? req.body : {})
    if (BMCC_ACTIVITY_PRESETS.some((item) => item.activityName === config.activityName)) {
      return fail(res, 409, '内置活动标识不可重复创建', requestId, 'ACTIVITY_CONFIG_EXISTS')
    }
    const saved = await createStoredBmccActivityConfig(config)
    res.json({ ok: true, data: { config: { ...saved, source: 'custom', editable: true } }, requestId })
  } catch (error) {
    handleError(
      res,
      isUniqueViolation(error) ? new BmccActivityOrderError('活动标识已存在，请直接编辑原配置', 'ACTIVITY_CONFIG_EXISTS', 409) : error,
      requestId,
    )
  }
})

router.put('/configs/:id', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const access = await resolveAccess(req, res, requestId)
    if (!access) return
    if (!access.isAdmin) return fail(res, 403, '仅管理员可以编辑活动配置', requestId, 'ADMIN_REQUIRED')
    const id = String(req.params.id || '').trim()
    if (!id || id.startsWith('builtin:')) {
      return fail(res, 400, '内置活动配置不可编辑', requestId, 'BUILTIN_CONFIG_READ_ONLY')
    }
    const config = resolveBmccActivityConfig(req.body && typeof req.body === 'object' ? req.body : {})
    if (BMCC_ACTIVITY_PRESETS.some((item) => item.activityName === config.activityName)) {
      return fail(res, 409, '不能把自定义配置改为内置活动标识', requestId, 'ACTIVITY_CONFIG_EXISTS')
    }
    const saved = await updateStoredBmccActivityConfig(id, config)
    if (!saved) return fail(res, 404, '活动配置不存在', requestId, 'ACTIVITY_CONFIG_NOT_FOUND')
    res.json({ ok: true, data: { config: { ...saved, source: 'custom', editable: true } }, requestId })
  } catch (error) {
    handleError(
      res,
      isUniqueViolation(error) ? new BmccActivityOrderError('活动标识已存在，请使用其他标识', 'ACTIVITY_CONFIG_EXISTS', 409) : error,
      requestId,
    )
  }
})

router.post('/sessions', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const access = await resolveAccess(req, res, requestId)
    if (!access) return
    const target = await resolveOrderTarget(req, res, requestId, access)
    if (!target) return
    const session = await createOrRestoreBmccActivityOrderSession({
      ownerKey: access.ownerKey,
      ...target,
    })
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/restore', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const access = await resolveAccess(req, res, requestId)
    if (!access) return
    const target = await resolveOrderTarget(req, res, requestId, access, true)
    if (!target) return
    const restored = await restoreCachedBmccActivityOrderSession({
      ownerKey: access.ownerKey,
      ...target,
    })
    res.json({ ok: true, data: restored, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.get('/sessions/:id', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    res.json({ ok: true, data: { session: readBmccActivityOrderSession(id) }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/captcha', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    res.json({ ok: true, data: { session: await refreshBmccActivityCaptcha(id) }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/login-sms', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    const session = await sendBmccActivityLoginSms(id, String(req.body?.captcha || '').trim())
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/login', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    await loginBmccActivityOrderSession(id, String(req.body?.code || '').trim())
    const session = await cacheBmccActivityOrderLogin(id)
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.put('/sessions/:id/order-config', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    const config = resolveBmccActivityConfig(req.body && typeof req.body === 'object' ? req.body : {})
    const session = await updateBmccActivityOrderRequest(id, config)
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/activity', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    let config: BmccActivityConfig | undefined
    if (req.body?.config && typeof req.body.config === 'object') {
      config = resolveBmccActivityConfig(req.body.config)
    } else {
      const configId = String(req.body?.configId || '').trim()
      config = builtinConfigs.find((item) => item.id === configId)
      if (!config && configId && !configId.startsWith('builtin:')) {
        const stored = await getStoredBmccActivityConfig(configId)
        if (stored) config = stored
      }
    }
    if (!config) return fail(res, 404, '请选择有效的活动配置', requestId, 'ACTIVITY_CONFIG_NOT_FOUND')
    res.json({ ok: true, data: { session: await loadBmccActivityInfo(id, config) }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/submit', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    const session = await submitBmccActivityOrder({
      id,
      acceptedProtocol: req.body?.acceptedProtocol === true,
      confirmationText: String(req.body?.confirmationText || '').trim(),
    })
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/order-sms', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    res.json({ ok: true, data: { session: await sendBmccActivityOrderSms(id) }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/confirm', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    const session = await confirmBmccActivityOrder(id, String(req.body?.code || '').trim())
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.delete('/sessions/:id', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    res.json({ ok: true, data: { deleted: deleteBmccActivityOrderSession(id) }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

export default router

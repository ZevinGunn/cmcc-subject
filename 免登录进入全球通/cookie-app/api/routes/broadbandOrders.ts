import crypto from 'node:crypto'
import { Router, type Request, type Response } from 'express'
import { getAccountById } from '../services/accountsStore.js'
import {
  assertBroadbandOrderSessionAccess,
  BroadbandOrderError,
  commitBroadbandOrder,
  createBroadbandOrderSession,
  deleteBroadbandOrderSession,
  loadInstallCatalog,
  prepareBroadbandOrder,
  queryRenewalAccounts,
  readBroadbandOrderSession,
  refreshBroadbandCaptcha,
  selectBroadbandProduct,
  selectRenewalAccount,
  sendRenewalSms,
  verifyRenewalSms,
} from '../services/broadbandOrder.js'
import {
  createBroadbandProductConfig,
  listBroadbandProductConfigs,
  updateBroadbandProductConfig,
  validateBroadbandConfig,
} from '../services/broadbandOrderConfigs.js'
import { isAdminRequest } from '../services/serviceLoginGuard.js'
import { findCurrentUser, listUserAccountSummaries } from '../services/userAuthStore.js'

const router = Router()

type ApiResp<T> =
  | { ok: true; data: T; requestId: string }
  | { ok: false; message: string; errorCode: string; requestId: string }

type Access = { ownerKey: string; isAdmin: boolean; userId?: string }

function fail(res: Response, status: number, message: string, requestId: string, errorCode: string): void {
  res.status(status).json({ ok: false, message, errorCode, requestId })
}

function handleError(res: Response, error: unknown, requestId: string): void {
  if (error instanceof BroadbandOrderError) {
    fail(res, error.status, error.message, requestId, error.code)
    return
  }
  const message = error instanceof Error ? error.message : '服务端异常'
  const invalid = /配置|业务类型|提交模式|JSON|字段/.test(message)
  fail(res, invalid ? 400 : 500, invalid ? message : '服务端异常', requestId, invalid ? 'BROADBAND_CONFIG_INVALID' : 'SERVER_ERROR')
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

async function requireSession(req: Request, res: Response, requestId: string): Promise<Access | null> {
  const access = await resolveAccess(req, res, requestId)
  if (!access) return null
  assertBroadbandOrderSessionAccess(String(req.params.id || ''), access.ownerKey)
  return access
}

async function canUseAccount(access: Access, accountId: string): Promise<boolean> {
  if (access.isAdmin) return Boolean(await getAccountById(accountId))
  const accounts = await listUserAccountSummaries(String(access.userId))
  return accounts.some((account) => account.id === accountId)
}

router.get('/configs', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const access = await resolveAccess(req, res, requestId)
    if (!access) return
    res.json({ ok: true, data: { configs: await listBroadbandProductConfigs(), canManage: access.isAdmin }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/configs', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const access = await resolveAccess(req, res, requestId)
    if (!access) return
    if (!access.isAdmin) return fail(res, 403, '仅管理员可以新增宽带产品配置', requestId, 'ADMIN_REQUIRED')
    const config = await createBroadbandProductConfig(validateBroadbandConfig(req.body))
    res.json({ ok: true, data: { config }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.put('/configs/:configId', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const access = await resolveAccess(req, res, requestId)
    if (!access) return
    if (!access.isAdmin) return fail(res, 403, '仅管理员可以编辑宽带产品配置', requestId, 'ADMIN_REQUIRED')
    const id = String(req.params.configId || '')
    if (id.startsWith('builtin:')) return fail(res, 400, '内置配置不可直接修改，请新增自定义配置覆盖业务字段', requestId, 'BROADBAND_BUILTIN_READ_ONLY')
    const config = await updateBroadbandProductConfig(id, validateBroadbandConfig(req.body))
    if (!config) return fail(res, 404, '宽带产品配置不存在', requestId, 'BROADBAND_CONFIG_NOT_FOUND')
    res.json({ ok: true, data: { config }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const access = await resolveAccess(req, res, requestId)
    if (!access) return
    const accountId = String(req.body?.accountId || '').trim()
    const flowType = String(req.body?.flowType || '')
    if (!accountId) return fail(res, 400, '请选择办理账号', requestId, 'ACCOUNT_REQUIRED')
    if (!(await canUseAccount(access, accountId))) return fail(res, 403, '只能使用当前用户关联账号', requestId, 'ACCOUNT_FORBIDDEN')
    if (!['install', 'renewal'].includes(flowType)) return fail(res, 400, '宽带业务类型不正确', requestId, 'BROADBAND_FLOW_INVALID')
    const session = await createBroadbandOrderSession({
      ownerKey: access.ownerKey,
      accountId,
      flowType: flowType as 'install' | 'renewal',
    })
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.get('/sessions/:id', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireSession(req, res, requestId))) return
    res.json({ ok: true, data: { session: readBroadbandOrderSession(String(req.params.id)) }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.delete('/sessions/:id', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireSession(req, res, requestId))) return
    res.json({ ok: true, data: { deleted: deleteBroadbandOrderSession(String(req.params.id)) }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/captcha', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireSession(req, res, requestId))) return
    const purpose = String(req.body?.purpose || 'commit')
    if (!['lookup', 'sms', 'commit'].includes(purpose)) return fail(res, 400, '验证码用途不正确', requestId, 'BROADBAND_CAPTCHA_PURPOSE_INVALID')
    const session = await refreshBroadbandCaptcha(String(req.params.id), purpose as 'lookup' | 'sms' | 'commit')
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/install/catalog', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireSession(req, res, requestId))) return
    const session = await loadInstallCatalog(String(req.params.id), String(req.body?.configId || ''), req.body?.fields)
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/renewal/accounts', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireSession(req, res, requestId))) return
    const session = await queryRenewalAccounts(String(req.params.id), String(req.body?.billId || ''), String(req.body?.captcha || ''))
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/renewal/account', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireSession(req, res, requestId))) return
    const session = await selectRenewalAccount(String(req.params.id), String(req.body?.optionId || ''), req.body?.fields)
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/product', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireSession(req, res, requestId))) return
    const session = await selectBroadbandProduct(
      String(req.params.id),
      String(req.body?.configId || ''),
      req.body?.fields,
      req.body?.replaceFields === true,
    )
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/sms/send', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireSession(req, res, requestId))) return
    const session = await sendRenewalSms(String(req.params.id), String(req.body?.captcha || ''), String(req.body?.phoneNo || ''))
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/sms/verify', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireSession(req, res, requestId))) return
    const session = await verifyRenewalSms(String(req.params.id), String(req.body?.code || ''), String(req.body?.phoneNo || ''))
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/prepare', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireSession(req, res, requestId))) return
    const session = await prepareBroadbandOrder(String(req.params.id), {
      fields: req.body?.fields,
      acceptBalance: req.body?.acceptBalance === true,
    })
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/commit', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireSession(req, res, requestId))) return
    const session = await commitBroadbandOrder(String(req.params.id), {
      captcha: String(req.body?.captcha || ''),
      fields: req.body?.fields,
      acceptedProtocol: req.body?.acceptedProtocol === true,
      confirmationText: String(req.body?.confirmationText || ''),
    })
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

export default router

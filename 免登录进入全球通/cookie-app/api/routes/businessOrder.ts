import crypto from 'node:crypto'
import { Router, type Request, type Response } from 'express'
import { isAdminRequest } from '../services/serviceLoginGuard.js'
import { getAccountById, listAccountSummaries } from '../services/accountsStore.js'
import { findCurrentUser, listUserAccountSummaries } from '../services/userAuthStore.js'
import { prepareAccountCocPackageSession } from '../services/accountCocPackageSession.js'
import type { AccountRecord } from '../services/accountsStore.js'
import {
  assertBusinessOrderSessionAccess,
  BUSINESS_ORDER_DEFAULTS,
  BusinessOrderError,
  confirmBusinessOrder,
  createBusinessOrderSession,
  deleteBusinessOrderSession,
  loginBusinessOrderSession,
  prepareBusinessOrderProduct,
  readBusinessOrderSession,
  sendBusinessOrderConfirmSms,
  sendBusinessOrderLoginSms,
} from '../services/cmccBusinessOrder.js'

const router = Router()

type ApiResp<T> =
  | { ok: true; data: T; requestId: string }
  | { ok: false; message: string; errorCode: string; requestId: string }

function fail(
  res: Response,
  status: number,
  message: string,
  requestId: string,
  errorCode: string,
): void {
  res.status(status).json({ ok: false, message, errorCode, requestId })
}

type OrderAccess = {
  ownerKey: string
  isAdmin: boolean
  userId?: string
}

async function resolveAccess(
  req: Request,
  res: Response,
  requestId: string,
): Promise<OrderAccess | null> {
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
  assertBusinessOrderSessionAccess(sessionId, access.ownerKey)
  return access
}

function maskPhoneText(value: unknown): string {
  return String(value || '').replace(/1\d{10}/g, (phone) => `${phone.slice(0, 3)}****${phone.slice(-4)}`)
}

function safeAccount(account: {
  id: string
  label?: string
  phone?: string
  phoneMasked?: string
  displayPhone?: string
}) {
  return {
    id: account.id,
    label: maskPhoneText(account.label || account.phoneMasked || account.phone || '未命名账号'),
    phoneMasked: maskPhoneText(account.phoneMasked || account.phone || ''),
    displayPhone: maskPhoneText(account.displayPhone || account.phoneMasked || account.phone || ''),
  }
}

function isValidPhone(value: string): boolean {
  return /^1\d{10}$/.test(value)
}

function isValidCode(value: string): boolean {
  return /^\d{6}$/.test(value)
}

function readIdentifier(value: unknown, fallback: string, field: string): string {
  const text = String(value || fallback).trim()
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(text)) {
    throw new BusinessOrderError(`${field} 格式不正确`, 'INVALID_ACTIVITY_PARAMETER', 400)
  }
  return text
}

function readOverrides(body: unknown): { productCode?: string; pageId?: string; touchCode?: string } {
  if (!body || typeof body !== 'object') return {}
  const value = body as Record<string, unknown>
  return {
    productCode: value.productCode
      ? readIdentifier(value.productCode, '', 'productCode')
      : undefined,
    pageId: value.pageId ? readIdentifier(value.pageId, '', 'pageId') : undefined,
    touchCode: value.touchCode
      ? readIdentifier(value.touchCode, '', 'touchCode')
      : undefined,
  }
}

function handleError(res: Response, error: unknown, requestId: string): void {
  if (error instanceof BusinessOrderError) {
    fail(res, error.status, error.message, requestId, error.code)
    return
  }
  fail(res, 500, error instanceof Error ? error.message : '服务端异常', requestId, 'SERVER_ERROR')
}

router.get('/defaults', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await resolveAccess(req, res, requestId))) return
    res.json({ ok: true, data: BUSINESS_ORDER_DEFAULTS, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.get('/accounts', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const access = await resolveAccess(req, res, requestId)
    if (!access) return
    const accounts = access.isAdmin
      ? await listAccountSummaries({ includeDisabled: false })
      : await listUserAccountSummaries(String(access.userId))
    res.json({ ok: true, data: { accounts: accounts.map(safeAccount) }, requestId })
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
    let phone = String(req.body?.phone || '').trim()
    let accountRecord: AccountRecord | null = null
    if (accountId) {
      if (access.isAdmin) {
        const account = await getAccountById(accountId)
        if (!account || account.disabledAt) {
          return fail(res, 404, '账号不存在或已停用', requestId, 'ACCOUNT_NOT_FOUND')
        }
        accountRecord = account
        phone = String(account.phone || '').trim()
      } else {
        const accounts = await listUserAccountSummaries(String(access.userId))
        const account = accounts.find((item) => item.id === accountId)
        if (!account) return fail(res, 403, '只能为当前用户关联账号办理业务', requestId, 'ACCOUNT_FORBIDDEN')
        accountRecord = await getAccountById(accountId)
        if (!accountRecord || accountRecord.disabledAt) {
          return fail(res, 404, '账号不存在或已停用', requestId, 'ACCOUNT_NOT_FOUND')
        }
        phone = String(account.phone || '').trim()
      }
    } else if (!access.isAdmin) {
      return fail(res, 400, '请从已绑定账号进入业务订购', requestId, 'ACCOUNT_REQUIRED')
    }
    if (!isValidPhone(phone)) {
      return fail(res, 400, '账号缺少可用手机号，请先完善账号信息', requestId, 'INVALID_PHONE')
    }
    const overrides = readOverrides(req.body)
    const targetText = String(req.body?.target || 'diamond_package')
    if (targetText !== 'diamond_package' && targetText !== 'age_feed') {
      return fail(res, 400, '不支持的订购业务', requestId, 'INVALID_TARGET')
    }
    const target = targetText
    let authSession
    if (accountRecord) {
      const prepared = await prepareAccountCocPackageSession(accountRecord, target)
      if (!prepared.ok || !prepared.session) {
        throw new BusinessOrderError(
          prepared.message || 'COC 订购凭证置换失败',
          prepared.status === 410 ? 'COOKIE_INVALID' : 'COC_PACKAGE_EXCHANGE_FAILED',
          prepared.status === 410 ? 410 : 424,
        )
      }
      authSession = prepared.session
    }
    const session = await createBusinessOrderSession({
      phone,
      ownerKey: access.ownerKey,
      target,
      ...overrides,
      authSession,
    })
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.get('/sessions/:id', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    const session = readBusinessOrderSession(id)
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/login-sms', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    const session = await sendBusinessOrderLoginSms(id)
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
    const code = String(req.body?.code || '').trim()
    if (!isValidCode(code)) return fail(res, 400, '请输入 6 位数字验证码', requestId, 'INVALID_CODE')
    const session = await loginBusinessOrderSession(id, code)
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/product', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    const session = await prepareBusinessOrderProduct(
      id,
      readOverrides(req.body),
    )
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
    const session = await sendBusinessOrderConfirmSms(
      id,
      req.body?.acceptedProtocol === true,
    )
    res.json({ ok: true, data: { session }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/confirm', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    const code = String(req.body?.code || '').trim()
    if (!isValidCode(code)) return fail(res, 400, '请输入 6 位数字验证码', requestId, 'INVALID_CODE')
    const result = await confirmBusinessOrder({
      id,
      code,
      acceptedProtocol: req.body?.acceptedProtocol === true,
      confirmationText: String(req.body?.confirmationText || '').trim(),
    })
    res.json({ ok: true, data: result, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.delete('/sessions/:id', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    const deleted = deleteBusinessOrderSession(id)
    res.json({ ok: true, data: { deleted }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

export default router

import crypto from 'node:crypto'
import { Router, type Request, type Response } from 'express'
import { getAccountById, setAccountCmccAppCookie, toAccountSummary } from '../services/accountsStore.js'
import { ensureUsable10086Cookie } from '../services/cmccCookieRecovery.js'
import {
  createShopSession,
  deleteShopSession,
  getShopSession,
  queryShopBusinesses,
  sendShopUnsubscribeSms,
  unsubscribeShopBusiness,
  validateShopCookie,
} from '../services/cmccShopBusiness.js'
import { exchange10086CookieToShop } from '../services/cmccShopSession.js'
import { isAdminRequest, resolveScopedPermission } from '../services/serviceLoginGuard.js'
import { findCurrentUser, listUserAccountSummaries } from '../services/userAuthStore.js'

const router = Router()

type ApiResp<T> =
  | { ok: true; data: T; requestId?: string; message?: string }
  | { ok: false; message: string; errorCode?: string; requestId?: string }

function fail(
  res: Response,
  status: number,
  message: string,
  requestId: string,
  errorCode = 'ERROR',
): void {
  res.status(status).json({ ok: false, message, errorCode, requestId })
}

async function canUseAccount(req: Request, accountId: string): Promise<{
  ok: boolean
  message?: string
}> {
  const user = await findCurrentUser(req)
  if (user) {
    const accounts = await listUserAccountSummaries(user.id)
    if (accounts.some((account) => account.id === accountId)) return { ok: true }
  }
  if (isAdminRequest(req)) return { ok: true }
  return user
    ? { ok: false, message: '只能操作当前用户已关联账号' }
    : { ok: false, message: '请先登录专属账号' }
}

async function canUnsubscribeShopBusiness(req: Request, accountId: string): Promise<boolean> {
  const user = await findCurrentUser(req)
  let currentUserOwnsAccount = false
  if (user && accountId) {
    const accounts = await listUserAccountSummaries(user.id)
    currentUserOwnsAccount = accounts.some((account) => account.id === accountId)
  }
  return resolveScopedPermission({
    currentUserOwnsResource: currentUserOwnsAccount,
    currentUserPermission: Boolean(user?.permissions.shopQuery),
    isAdmin: isAdminRequest(req),
  })
}

async function requireShopUnsubscribePermission(
  req: Request,
  res: Response,
  requestId: string,
): Promise<boolean> {
  const accountId = String(req.body?.accountId || '').trim()
  if (await canUnsubscribeShopBusiness(req, accountId)) return true
  fail(res, 403, '当前用户未开启商城业务退订权限', requestId, 'SHOP_UNSUBSCRIBE_FORBIDDEN')
  return false
}

async function resolveSession(
  req: Request,
  res: Response,
  requestId: string,
): Promise<NonNullable<ReturnType<typeof getShopSession>> | null> {
  const sessionId = String(req.body?.sessionId || '').trim()
  const accountId = String(req.body?.accountId || '').trim()
  if (!sessionId || !accountId) {
    fail(res, 400, '缺少查询会话或账号参数', requestId, 'BAD_REQUEST')
    return null
  }
  const access = await canUseAccount(req, accountId)
  if (!access.ok) {
    fail(res, 403, access.message || '无权访问该账号', requestId, 'FORBIDDEN')
    return null
  }
  const session = getShopSession(sessionId)
  if (!session) {
    fail(res, 404, '查询会话不存在或已过期，请重新进入页面', requestId, 'SESSION_NOT_FOUND')
    return null
  }
  if (session.accountId !== accountId) {
    fail(res, 403, '查询会话与账号不匹配', requestId, 'ACCOUNT_MISMATCH')
    return null
  }
  return session
}

router.post('/accounts/:id/prepare', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const accountId = String(req.params.id || '').trim()
    const access = await canUseAccount(req, accountId)
    if (!access.ok) return fail(res, 403, access.message || '无权访问该账号', requestId, 'FORBIDDEN')
    const account = await getAccountById(accountId)
    if (!account) return fail(res, 404, '账号不存在', requestId, 'NOT_FOUND')
    if (!/^1\d{10}$/.test(account.phone)) {
      return fail(res, 400, '账号缺少可用于商城查询的 11 位手机号', requestId, 'PHONE_REQUIRED')
    }

    // Entering the business page always refreshes the upstream 10086 CK first.
    // A cached shop cookie must never bypass this chain because it may belong to
    // an older 10086 session and cause an opaque exchange failure later.
    const usable = await ensureUsable10086Cookie({
      rec: account,
      allowRecentSkip: false,
      clearOnYunpanFailure: false,
      preferYunpan: Boolean(account.yunpanSession),
    })
    if (!usable.ok || !usable.cookie) {
      return fail(
        res,
        410,
        usable.message || '账号 10086 Cookie 已失效，请重新登录',
        requestId,
        'COOKIE_INVALID',
      )
    }

    const exchanged = await exchange10086CookieToShop({ cookie: usable.cookie })
    if (!exchanged.ok || !exchanged.cookie) {
      return res.status(200).json({
        ok: false,
        message: exchanged.message || '10086 Cookie 未能置换为 touch/shop 登录态',
        errorCode: 'SHOP_SESSION_NOT_READY',
        requestId,
      })
    }
    const validated = await validateShopCookie({
      accountId,
      phone: account.phone,
      cookie: exchanged.cookie,
    })
    if (!validated.ok || !validated.cookie) {
      return fail(
        res,
        502,
        validated.message || '商城登录态置换后校验失败',
        requestId,
        'SHOP_SESSION_INVALID',
      )
    }
    await setAccountCmccAppCookie({ id: accountId, cookie: validated.cookie })
    const session = createShopSession({
      accountId,
      phone: account.phone,
      cookie: validated.cookie,
      label: account.label || account.displayPhone,
    })
    res.json({
      ok: true,
      data: {
        session,
        account: toAccountSummary(account),
        capabilities: {
          canUnsubscribe: await canUnsubscribeShopBusiness(req, accountId),
        },
        exchanged: {
          message: `${usable.message || '10086 CK 已刷新'}，${exchanged.message || '商城登录态已置换'}`,
          fields: exchanged.fields,
          steps: [
            { name: 'REFRESH_10086_COOKIE', status: 200, cookieUpdated: Boolean(usable.cookieUpdated) },
            ...exchanged.steps,
            { name: 'VALIDATE_SHOP_COOKIE', status: validated.status, cookieUpdated: validated.cookieUpdated },
          ],
        },
      },
      requestId,
    })
  } catch (error) {
    fail(
      res,
      500,
      error instanceof Error ? error.message : '准备商城查询会话失败',
      requestId,
      'SERVER_ERROR',
    )
  }
})

router.post('/query', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const session = await resolveSession(req, res, requestId)
    if (!session) return
    const result = await queryShopBusinesses(session)
    res.status(200).json({
      ok: result.ok,
      data: result.ok ? result.data : undefined,
      message: result.ok ? undefined : result.message || '查询业务失败',
      errorCode: result.ok ? undefined : String(result.status || 'UPSTREAM_ERROR'),
      requestId,
    } as ApiResp<unknown>)
  } catch (error) {
    fail(res, 500, error instanceof Error ? error.message : '查询业务失败', requestId, 'SERVER_ERROR')
  }
})

router.post('/unsubscribe/sms', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const session = await resolveSession(req, res, requestId)
    if (!session) return
    if (!(await requireShopUnsubscribePermission(req, res, requestId))) return
    const businessId = String(req.body?.businessId || '').trim()
    if (!businessId) return fail(res, 400, '缺少业务标识', requestId, 'BAD_REQUEST')
    const result = await sendShopUnsubscribeSms(session, businessId)
    res.status(200).json({
      ok: result.ok,
      data: result.ok ? result.data : undefined,
      message: result.ok ? '退订验证码已发送' : result.message || '发送退订验证码失败',
      errorCode: result.ok ? undefined : String(result.status || 'UPSTREAM_ERROR'),
      requestId,
    } as ApiResp<unknown>)
  } catch (error) {
    fail(
      res,
      500,
      error instanceof Error ? error.message : '发送退订验证码失败',
      requestId,
      'SERVER_ERROR',
    )
  }
})

router.post('/unsubscribe', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const session = await resolveSession(req, res, requestId)
    if (!session) return
    if (!(await requireShopUnsubscribePermission(req, res, requestId))) return
    const businessId = String(req.body?.businessId || '').trim()
    const smsCode = String(req.body?.smsCode || '').trim()
    if (!businessId) return fail(res, 400, '缺少业务标识', requestId, 'BAD_REQUEST')
    if (!/^\d{6}$/.test(smsCode)) {
      return fail(res, 400, '请输入 6 位退订验证码', requestId, 'INVALID_CODE')
    }
    const result = await unsubscribeShopBusiness(session, businessId, smsCode)
    res.status(200).json({
      ok: result.ok,
      data: result.ok ? result.data : undefined,
      message: result.ok ? result.data?.message || '退订请求已受理' : result.message || '退订失败',
      errorCode: result.ok ? undefined : String(result.status || 'UPSTREAM_ERROR'),
      requestId,
    } as ApiResp<unknown>)
  } catch (error) {
    fail(res, 500, error instanceof Error ? error.message : '退订失败', requestId, 'SERVER_ERROR')
  }
})

router.delete('/session/:id', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  const session = getShopSession(String(req.params.id || ''))
  if (session) {
    const access = await canUseAccount(req, session.accountId)
    if (!access.ok) return fail(res, 403, access.message || '无权访问该会话', requestId, 'FORBIDDEN')
    deleteShopSession(session.id)
  }
  res.json({ ok: true, data: { deleted: true }, requestId })
})

export default router

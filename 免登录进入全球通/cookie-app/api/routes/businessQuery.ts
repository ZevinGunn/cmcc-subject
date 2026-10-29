import { Router, type Request, type Response } from 'express'
import crypto from 'node:crypto'
import {
  createBusinessSession,
  deleteBusinessSession,
  getBusinessSession,
  publicSession,
  queryBroadbandPlans,
  queryBroadbandSubscribedBusiness,
  queryBalanceUserInformation,
  queryCustomerContractInfo,
  querySubscribedBusiness,
  queryUnsubscribeStatus,
  queryUserBalance,
  queryUserInformation,
  queryUserPlan,
  sendMainPlanWithdrawSms,
  sendUnsubscribeSms,
  unsubscribeBusiness,
  updateBusinessSession,
  withdrawMainPlan,
  type BusinessIdOverride,
} from '../services/cmccBusinessQuery.js'
import { cmccLoginBySms, cmccRefreshCookieByHome, cmccSendSms } from '../services/cmcc10086.js'
import {
  consumeCmccQrLoginCookie,
  createCmccQrLoginFlow,
  pollCmccQrLoginFlow,
} from '../services/cmccQrLogin.js'
import {
  getAccountById,
	  listAccountSummaries,
	  clearAccountCookie,
	  upsertAccount,
	  setAccountCookie,
	  setAccountCmccAppCookie,
	  touchAccountCookieCheckedAt,
  toAccountSummary,
} from '../services/accountsStore.js'
import {
  exchange10086CookieToCmccApp,
  hasCmccBusinessSessionCookie,
  inspectSessionCapabilities,
  type SessionBridgeResult,
} from '../services/cmccSessionBridge.js'
import { ensureUsable10086Cookie } from '../services/cmccCookieRecovery.js'
import { getServiceLoginAccess, isAdminRequest, resolveScopedPermission } from '../services/serviceLoginGuard.js'
import { bindAccountsToUser, findCurrentUser, listUserAccountSummaries } from '../services/userAuthStore.js'
import { persistCmccAccountProfile } from '../services/accountProfile.js'

const router = Router()

type ApiResp<T> =
  | { ok: true; data: T; requestId?: string; message?: string }
  | { ok: false; message: string; errorCode?: string; requestId?: string }

function fail(res: Response, status: number, message: string, requestId: string, errorCode = 'ERROR'): void {
  res.status(status).json({ ok: false, message, errorCode, requestId })
}

function upstreamFail(res: Response<ApiResp<unknown>>, message: string, requestId: string, errorCode = 'UPSTREAM_ERROR'): void {
  res.status(200).json({ ok: false, message, errorCode, requestId })
}

function requireAdmin(req: Request, res: Response, requestId: string): boolean {
  if (isAdminRequest(req)) return true
  fail(res, 403, 'Forbidden', requestId, 'FORBIDDEN')
  return false
}

async function canUseAccountForBusinessQuery(req: Request, accountId: string): Promise<{
  ok: boolean
  message?: string
}> {
  const user = await findCurrentUser(req)
  if (user) {
    const accounts = await listUserAccountSummaries(user.id)
    if (accounts.some((account) => account.id === accountId)) return { ok: true }
  }
  if (isAdminRequest(req)) return { ok: true }
  if (user) {
    return { ok: false, message: '只能查询当前用户已关联账号' }
  }
  return { ok: false, message: '请先登录专属账号' }
}

async function canUnsubscribeBusiness(req: Request, accountId: string): Promise<boolean> {
  const user = await findCurrentUser(req)
  let currentUserOwnsAccount = false
  if (user && accountId) {
    const accounts = await listUserAccountSummaries(user.id)
    currentUserOwnsAccount = accounts.some((account) => account.id === accountId)
  }
  return resolveScopedPermission({
    currentUserOwnsResource: currentUserOwnsAccount,
    currentUserPermission: Boolean(user?.permissions.businessQuery),
    isAdmin: isAdminRequest(req),
  })
}

async function requireBusinessUnsubscribePermission(
  req: Request,
  res: Response,
  requestId: string,
): Promise<boolean> {
  const accountId = String(req.body?.accountId || req.query?.accountId || '').trim()
  if (await canUnsubscribeBusiness(req, accountId)) return true
  fail(res, 403, '当前用户未开启业务退订或撤回权限', requestId, 'BUSINESS_UNSUBSCRIBE_FORBIDDEN')
  return false
}

function isValidPhone(phone: string): boolean {
  return /^1\d{10}$/.test(phone)
}

function isSixDigitCode(code: string): boolean {
  return /^\d{6}$/.test(code)
}

function readBusinessIdOverride(raw: unknown): BusinessIdOverride | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const obj = raw as Record<string, unknown>
  const override: BusinessIdOverride = {}
  for (const key of ['planId', 'productCode', 'offerId'] as const) {
    const value = String(obj[key] || '').trim()
    if (value) override[key] = value.slice(0, 80)
  }
  return override.planId || override.productCode || override.offerId ? override : undefined
}

async function requireBusinessIdOverridePermission(req: Request, override: BusinessIdOverride | undefined): Promise<{
  ok: boolean
  message?: string
}> {
  if (!override) return { ok: true }
  if (isAdminRequest(req)) return { ok: true }
  const user = await findCurrentUser(req)
  if (!user) return { ok: false, message: '请先登录专属账号' }
  if (!user.permissions.businessIdOverride) return { ok: false, message: '当前用户未开启自定义业务ID权限' }
  return { ok: true }
}

function formatAccountDisplay(rec?: { phone?: string; displayPhone?: string; label?: string }): string {
  if (!rec) return '该账号'
  if (rec.displayPhone && rec.displayPhone.trim()) return rec.displayPhone.trim()
  const phone = String(rec.phone || '')
  if (/^1\d{10}$/.test(phone)) return `${phone.slice(0, 3)}****${phone.slice(-4)}`
  if (rec.label && rec.label.trim()) return rec.label.trim()
  return '该账号'
}

async function refreshAccountCookieForBusiness(args: {
  id: string
  rec: Awaited<ReturnType<typeof getAccountById>>
  cookie: string
	}): Promise<{ ok: boolean; cookie?: string; message?: string; status?: number | string; cookieUpdated?: boolean }> {
	  if (hasCmccBusinessSessionCookie(args.cookie)) {
	    await touchAccountCookieCheckedAt({ id: args.id })
    return { ok: true, cookie: args.cookie, cookieUpdated: false }
  }
  const r = await cmccRefreshCookieByHome(args.cookie, args.rec?.requestHeaders, args.rec?.newHomeUrl)
  if (!r.ok || !r.cookie) {
    await clearAccountCookie({ id: args.id, reason: r.message || 'Cookie 已失效' })
    return {
      ok: false,
      message: `${formatAccountDisplay(args.rec ?? undefined)} Cookie 已失效，请重新登录`,
      status: r.status || 'COOKIE_INVALID_CLEARED',
    }
  }
  if (r.cookieUpdated) {
    await setAccountCookie({ id: args.id, cookie: r.cookie })
  } else {
    await touchAccountCookieCheckedAt({ id: args.id })
  }
  return { ok: true, cookie: r.cookie, cookieUpdated: Boolean(r.cookieUpdated) }
}

type PreparedCmccBusinessCookie = {
  ok: boolean
  cookie?: string
  message?: string
  exchanged?: SessionBridgeResult
  reused?: boolean
}

async function validateCmccBusinessCookie(args: {
  cookie: string
  accountId?: string
  phone?: string
}): Promise<{ ok: boolean; cookie?: string; message?: string }> {
  if (!hasCmccBusinessSessionCookie(args.cookie)) {
    return { ok: false, message: 'CMCC 业务 Cookie 字段不完整' }
  }
  let result = await queryUserInformation({ cookie: args.cookie, phone: args.phone })
  if (!result.ok && Number(result.status) !== 403) {
    const fallback = await queryBalanceUserInformation({ cookie: args.cookie, phone: args.phone })
    if (fallback.ok) result = fallback
  }
  if (!result.ok) {
    return {
      ok: false,
      message: result.retDesc || result.message || `CMCC 业务 Cookie 验活失败（${result.status || 'UPSTREAM_ERROR'}）`,
    }
  }
  const cookie = result.cookie || args.cookie
  if (args.accountId) {
    if (result.cookie && result.cookie !== args.cookie) {
      await setAccountCmccAppCookie({ id: args.accountId, cookie: result.cookie })
    }
    if (result.data) {
      await persistCmccAccountProfile({ accountId: args.accountId, payload: result.data }).catch(() => undefined)
    }
  }
  return { ok: true, cookie }
}

async function prepareCmccBusinessCookie(args: {
  baseCookie: string
  accountId?: string
  phone?: string
  cachedCookie?: string
}): Promise<PreparedCmccBusinessCookie> {
  const reused = await reuseCmccBusinessCookie({
    cookie: args.cachedCookie,
    accountId: args.accountId,
    phone: args.phone,
  })
  if (reused) return reused

  const exchanged = await exchange10086CookieToCmccApp({ cookie: args.baseCookie })
  const candidate = exchanged.cookie
  if (!candidate || !hasCmccBusinessSessionCookie(candidate)) {
    return {
      ok: false,
      message: exchanged.message || 'CMCC 置换未拿到完整业务登录态',
      exchanged,
    }
  }
  const validated = await validateCmccBusinessCookie({
    cookie: candidate,
    accountId: args.accountId,
    phone: args.phone,
  })
  if (!validated.ok || !validated.cookie) {
    return {
      ok: false,
      message: validated.message || exchanged.message || 'CMCC 业务登录态验活失败',
      exchanged,
    }
  }
  if (args.accountId) {
    await setAccountCmccAppCookie({ id: args.accountId, cookie: validated.cookie })
  }
  return { ok: true, cookie: validated.cookie, exchanged }
}

async function reuseCmccBusinessCookie(args: {
  cookie?: string
  accountId?: string
  phone?: string
}): Promise<PreparedCmccBusinessCookie | null> {
  if (!args.cookie) return null
  const cached = await validateCmccBusinessCookie({
    cookie: args.cookie,
    accountId: args.accountId,
    phone: args.phone,
  })
  if (!cached.ok || !cached.cookie) return null
  return {
    ok: true,
    cookie: cached.cookie,
    reused: true,
    exchanged: {
      ok: true,
      cookie: cached.cookie,
      cookieUpdated: cached.cookie !== args.cookie,
      fields: inspectSessionCapabilities(cached.cookie).availableFields,
      steps: [],
      message: '已复用并验证现有 CMCC 业务登录态',
    },
  }
}

async function createSessionFrom10086Cookie(args: {
  cookie: string
  phone?: string
  source: 'manual' | 'account'
  accountId?: string
  sx?: string
}): Promise<{
  ok: boolean
  message?: string
  session?: ReturnType<typeof createBusinessSession>
  exchanged?: Awaited<ReturnType<typeof exchange10086CookieToCmccApp>>
}> {
  if (hasCmccBusinessSessionCookie(args.cookie)) {
    const reused = await reuseCmccBusinessCookie({
      cookie: args.cookie,
      accountId: args.accountId,
      phone: args.phone,
    })
    if (reused?.cookie) {
      return {
        ok: true,
        session: createBusinessSession({
          source: args.source,
          accountId: args.accountId,
          phone: args.phone,
          cookie: reused.cookie,
          sx: args.sx,
        }),
        exchanged: reused.exchanged,
      }
    }
  }
  const rec = args.accountId ? await getAccountById(args.accountId) : null
  const prepared = await prepareCmccBusinessCookie({
    baseCookie: args.cookie,
    accountId: args.accountId,
    phone: args.phone,
    cachedCookie: rec?.cmccAppCookie,
  })
  if (!prepared.ok || !prepared.cookie) {
    return {
      ok: false,
      message: prepared.message || '10086 登录成功，但 CMCC 置换未拿到可用于业务查询的登录态',
      exchanged: prepared.exchanged,
    }
  }
  return {
    ok: true,
    session: createBusinessSession({
      source: args.source,
      accountId: args.accountId,
      phone: args.phone,
      cookie: prepared.cookie,
      sx: args.sx,
    }),
    exchanged: prepared.exchanged,
  }
}

async function resolveCookie(req: Request, res: Response, requestId: string): Promise<{
  cookie: string
  sessionId?: string
  accountId?: string
  phone?: string
} | null> {
  const sessionId = String(req.body?.sessionId || req.query?.sessionId || '').trim()
  const accountId = String(req.body?.accountId || req.query?.accountId || '').trim()
  if (!accountId) {
    fail(res, 403, '请从专属入口进入已订业务页面', requestId, 'ACCOUNT_REQUIRED')
    return null
  }
  const access = await canUseAccountForBusinessQuery(req, accountId)
  if (!access.ok) {
    fail(res, 403, access.message || '无权访问该账号', requestId, 'FORBIDDEN')
    return null
  }
  if (sessionId) {
    const session = getBusinessSession(sessionId)
    if (session) {
      if (session.accountId !== accountId) {
        fail(res, 403, '查询会话与账号不匹配，请从专属入口重新进入', requestId, 'ACCOUNT_MISMATCH')
        return null
      }
      return { cookie: session.cookie, sessionId, accountId: session.accountId, phone: session.phone }
    }
    fail(res, 404, '查询会话不存在或已过期，请重新进入已订业务页面', requestId, 'SESSION_NOT_FOUND')
    return null
  }
	  if (accountId) {
	    const rec = await getAccountById(accountId)
	    const refreshed = await refreshBusinessQuerySession({ accountId })
	    if (!rec || !refreshed.ok || !refreshed.cookie) {
      fail(res, refreshed.message === '账号暂无可用 CK' ? 404 : 410, refreshed.message || '账号暂无可用 CK', requestId, 'COOKIE_NOT_FOUND')
      return null
    }
    return { cookie: refreshed.cookie, accountId, phone: refreshed.phone || rec.phone }
  }
  fail(res, 403, '请从专属入口进入已订业务页面', requestId, 'ACCOUNT_REQUIRED')
  return null
}

async function refreshBusinessQuerySession(args: {
  accountId: string
  sessionId?: string
}): Promise<PreparedCmccBusinessCookie & { phone?: string }> {
  const rec = await getAccountById(args.accountId)
  if (!rec) return { ok: false, message: '账号不存在' }

  const reused = await reuseCmccBusinessCookie({
    cookie: rec.cmccAppCookie,
    accountId: args.accountId,
    phone: rec.phone,
  })
  if (reused?.cookie) {
    if (args.sessionId) {
      updateBusinessSession(args.sessionId, { cookie: reused.cookie, phone: rec.phone })
    }
    return { ...reused, phone: rec.phone }
  }

  const usable = await ensureUsable10086Cookie({
    rec,
    allowRecentSkip: false,
    clearOnYunpanFailure: false,
    preferYunpan: Boolean(rec.yunpanSession),
  })
  if (!usable.ok || !usable.cookie) return { ok: false, message: usable.message || '账号 CK 已过期，请重新登录' }
  const refreshed = await refreshAccountCookieForBusiness({ id: args.accountId, rec, cookie: usable.cookie })
  if (!refreshed.ok || !refreshed.cookie) return { ok: false, message: refreshed.message || '账号 CK 已过期，请重新登录' }
  const prepared = await prepareCmccBusinessCookie({
    baseCookie: refreshed.cookie,
    accountId: args.accountId,
    phone: rec.phone,
  })
  if (!prepared.ok || !prepared.cookie) {
    return { ok: false, message: prepared.message || 'CMCC 置换未拿到可用于业务查询的登录态' }
  }
  if (args.sessionId) {
    updateBusinessSession(args.sessionId, { cookie: prepared.cookie, phone: rec.phone })
  }
  return { ...prepared, phone: rec.phone }
}

router.get('/accounts', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!requireAdmin(req, res, requestId)) return
    const includeDisabled =
      req.query?.includeDisabled === '1' || req.query?.includeDisabled === 'true'
    const accounts = await listAccountSummaries({ includeDisabled })
    res.json({ ok: true, data: { accounts }, requestId })
  } catch (e) {
    fail(res, 500, e instanceof Error ? e.message : '加载账号失败', requestId, 'SERVER_ERROR')
  }
})

router.post('/accounts/:id/prepare', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id)
    const access = await canUseAccountForBusinessQuery(req, id)
    if (!access.ok) return fail(res, 403, access.message || '无权访问该账号', requestId, 'FORBIDDEN')
    const rec = await getAccountById(id)
    if (!rec) return fail(res, 404, '账号不存在', requestId, 'NOT_FOUND')
    const prepared = await refreshBusinessQuerySession({ accountId: id })
    if (!prepared.ok || !prepared.cookie) {
      return res.status(200).json({
        ok: false,
        message: prepared.message || 'CMCC 置换未拿到可用于业务查询的登录态，请重新置换或使用手机号验证码登录',
        errorCode: 'CMCC_SESSION_NOT_READY',
        requestId,
      })
    }
    const session = createBusinessSession({
      source: 'account',
      accountId: id,
      phone: rec.phone,
      cookie: prepared.cookie,
    })
    res.json({
      ok: true,
      data: {
        session,
        account: toAccountSummary(rec),
        capabilities: {
          canUnsubscribe: await canUnsubscribeBusiness(req, id),
        },
        exchanged: {
          ok: prepared.exchanged?.ok ?? true,
          message: prepared.exchanged?.message,
          fields: prepared.exchanged?.fields,
          steps: prepared.exchanged?.steps,
          reused: Boolean(prepared.reused),
        },
      },
      requestId,
    })
  } catch (e) {
    fail(res, 500, e instanceof Error ? e.message : '准备账号失败', requestId, 'SERVER_ERROR')
  }
})

router.post('/sms/send', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  const phone = String(req.body?.phone || '').trim()
  try {
    const access = getServiceLoginAccess(req)
    if (!access.ok) return fail(res, 403, access.message || '服务端登录已关闭', requestId, 'SERVICE_LOGIN_DISABLED')
    if (!isValidPhone(phone)) return fail(res, 400, '手机号格式不正确', requestId, 'INVALID_PHONE')
    const result = await cmccSendSms(phone)
    if (!result.ok) {
      return upstreamFail(res, result.message || '发送验证码失败', requestId, String(result.status || 'UPSTREAM_ERROR'))
    }
    res.json({ ok: true, data: { cooldownSeconds: 60 }, requestId })
  } catch (e) {
    fail(res, 500, e instanceof Error ? e.message : '发送验证码失败', requestId, 'SERVER_ERROR')
  }
})

router.post('/login', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  const phone = String(req.body?.phone || '').trim()
  const code = String(req.body?.code || '').trim()
  try {
    const access = getServiceLoginAccess(req)
    if (!access.ok) return fail(res, 403, access.message || '服务端登录已关闭', requestId, 'SERVICE_LOGIN_DISABLED')
    if (!isValidPhone(phone)) return fail(res, 400, '手机号格式不正确', requestId, 'INVALID_PHONE')
    if (!isSixDigitCode(code)) return fail(res, 400, '请输入 6 位数字验证码', requestId, 'INVALID_CODE')
    const login = await cmccLoginBySms(phone, code)
	    if (!login.ok || !login.cookie) {
	      return upstreamFail(res, login.message || '登录失败', requestId, String(login.status || 'UPSTREAM_ERROR'))
	    }
	    const account = await upsertAccount({ phone, label: '已订业务登录' })
	    const currentUser = await findCurrentUser(req).catch(() => null)
	    if (currentUser) {
	      await bindAccountsToUser({ userId: currentUser.id, accountIds: [account.id] })
	    }
	    await setAccountCookie({
	      id: account.id,
	      cookie: login.cookie,
	      loginMethod: 'cmcc_sms',
	      cookieSource: 'sms',
	      ttlHours: 72,
	    })
	    const prepared = await createSessionFrom10086Cookie({
	      cookie: login.cookie,
	      phone,
	      source: 'account',
	      accountId: account.id,
	    })
    if (!prepared.ok || !prepared.session) {
      return upstreamFail(res, prepared.message || 'CMCC 置换失败', requestId, 'CMCC_SESSION_NOT_READY')
    }
    res.json({
      ok: true,
	      data: {
	        session: prepared.session,
	        account: toAccountSummary(account),
        exchanged: prepared.exchanged
          ? {
              ok: prepared.exchanged.ok,
              message: prepared.exchanged.message,
              fields: prepared.exchanged.fields,
              steps: prepared.exchanged.steps,
            }
          : undefined,
      },
      requestId,
    })
  } catch (e) {
    fail(res, 500, e instanceof Error ? e.message : '登录失败', requestId, 'SERVER_ERROR')
  }
})

router.post('/qr/start', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const access = getServiceLoginAccess(req)
    if (!access.ok) return fail(res, 403, access.message || '服务端登录已关闭', requestId, 'SERVICE_LOGIN_DISABLED')
    const flow = await createCmccQrLoginFlow({
      channelId: typeof req.body?.channelId === 'string' ? req.body.channelId : undefined,
      backUrl: typeof req.body?.backUrl === 'string' ? req.body.backUrl : undefined,
    })
    res.json({ ok: true, data: flow, requestId })
  } catch (e) {
    fail(res, 500, e instanceof Error ? e.message : '生成二维码失败', requestId, 'SERVER_ERROR')
  }
})

router.post('/qr/poll', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  const flowId = String(req.body?.flowId || '').trim()
  try {
    const access = getServiceLoginAccess(req)
    if (!access.ok) return fail(res, 403, access.message || '服务端登录已关闭', requestId, 'SERVICE_LOGIN_DISABLED')
    if (!flowId) return fail(res, 400, '缺少扫码会话', requestId, 'BAD_REQUEST')
    const qr = await pollCmccQrLoginFlow(flowId)
    if (qr.status !== 'success') {
      return res.json({ ok: true, data: { qr }, requestId })
    }
    const qrCookie = consumeCmccQrLoginCookie(flowId)
    const prepared = await createSessionFrom10086Cookie({
      cookie: qrCookie.cookie,
      source: 'manual',
    })
    if (!prepared.ok || !prepared.session) {
      return upstreamFail(res, prepared.message || 'CMCC 置换失败', requestId, 'CMCC_SESSION_NOT_READY')
    }
    res.json({
      ok: true,
      data: {
        qr,
        session: prepared.session,
        exchanged: prepared.exchanged
          ? {
              ok: prepared.exchanged.ok,
              message: prepared.exchanged.message,
              fields: prepared.exchanged.fields,
              steps: prepared.exchanged.steps,
            }
          : undefined,
      },
      requestId,
    })
  } catch (e) {
    fail(res, 500, e instanceof Error ? e.message : '扫码登录失败', requestId, 'SERVER_ERROR')
  }
})

router.post('/user-info', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const resolved = await resolveCookie(req, res, requestId)
    if (!resolved) return
    const result = await queryUserInformation({ cookie: resolved.cookie, phone: resolved.phone })
    if (result.cookie && result.cookieUpdated && resolved.sessionId) {
      updateBusinessSession(resolved.sessionId, { cookie: result.cookie })
    }
    if (result.ok && result.data && resolved.accountId) {
      await persistCmccAccountProfile({
        accountId: resolved.accountId,
        payload: result.data,
      })
    }
    res.status(200).json({
      ok: result.ok,
      data: result.ok ? { result: result.raw, userInfo: result.data } : undefined,
      message: result.ok ? undefined : result.retDesc || result.message || '查询用户信息失败',
      errorCode: result.ok ? undefined : String(result.retCode || result.status || 'UPSTREAM_ERROR'),
      requestId,
    } as ApiResp<unknown>)
  } catch (e) {
    fail(res, 500, e instanceof Error ? e.message : '查询用户信息失败', requestId, 'SERVER_ERROR')
  }
})

router.post('/account-overview', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const resolved = await resolveCookie(req, res, requestId)
    if (!resolved) return
    const user = await queryBalanceUserInformation({ cookie: resolved.cookie, phone: resolved.phone })
    if (user.cookie && user.cookieUpdated && resolved.sessionId) {
      updateBusinessSession(resolved.sessionId, { cookie: user.cookie })
    }
    if (user.ok && user.data && resolved.accountId) {
      await persistCmccAccountProfile({
        accountId: resolved.accountId,
        payload: user.data,
      })
    }
    const balance = await queryUserBalance({
      cookie: user.cookie || resolved.cookie,
      phone: resolved.phone,
      beginMonth: typeof req.body?.beginMonth === 'string' ? req.body.beginMonth : undefined,
      endMonth: typeof req.body?.endMonth === 'string' ? req.body.endMonth : undefined,
    })
    if (balance.cookie && balance.cookieUpdated && resolved.sessionId) {
      updateBusinessSession(resolved.sessionId, { cookie: balance.cookie })
    }
    res.status(200).json({
      ok: user.ok || balance.ok,
      data: {
        userInfo: user.ok ? user.data : null,
        balance: balance.ok ? balance.data : null,
        userError: user.ok
          ? undefined
          : {
              message: user.retDesc || user.message || '查询用户信息失败',
              errorCode: String(user.retCode || user.status || 'UPSTREAM_ERROR'),
            },
        balanceError: balance.ok
          ? undefined
          : {
              message: balance.retDesc || balance.message || '查询余额失败',
              errorCode: String(balance.retCode || balance.status || 'UPSTREAM_ERROR'),
            },
        raw: {
          userInfo: user.raw,
          balance: balance.raw,
        },
      },
      message: user.ok || balance.ok ? undefined : '查询用户余额和信息失败',
      errorCode: user.ok || balance.ok ? undefined : 'UPSTREAM_ERROR',
      requestId,
    } as ApiResp<unknown>)
  } catch (e) {
    fail(res, 500, e instanceof Error ? e.message : '查询用户余额和信息失败', requestId, 'SERVER_ERROR')
  }
})

router.post('/query', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const resolved = await resolveCookie(req, res, requestId)
    if (!resolved) return
    const queryArgs = {
      cookie: resolved.cookie,
      bgnMonth: typeof req.body?.bgnMonth === 'string' ? req.body.bgnMonth : undefined,
      endMonth: typeof req.body?.endMonth === 'string' ? req.body.endMonth : undefined,
      planType: String(req.body?.planType || '0'),
      busiType: String(req.body?.busiType || '01'),
      phone: resolved.phone,
      broadband: req.body?.broadband && typeof req.body.broadband === 'object' ? (req.body.broadband as Record<string, unknown>) : undefined,
    }
    let result = await querySubscribedBusiness(queryArgs)
    if (!result.ok && String(result.retCode || result.status) === '223104' && resolved.accountId) {
      const refreshed = await refreshBusinessQuerySession({
        accountId: resolved.accountId,
        sessionId: resolved.sessionId,
      })
      if (refreshed.ok && refreshed.cookie) {
        result = await querySubscribedBusiness({
          ...queryArgs,
          cookie: refreshed.cookie,
          phone: refreshed.phone || queryArgs.phone,
        })
      }
    }
    if (result.cookie && result.cookieUpdated && resolved.sessionId) {
      updateBusinessSession(resolved.sessionId, { cookie: result.cookie })
    }
    res.status(200).json({
      ok: result.ok,
      data: result.ok ? { result: result.raw, business: result.data } : undefined,
      message: result.ok ? undefined : result.retDesc || result.message || '查询已订业务失败',
      errorCode: result.ok ? undefined : String(result.retCode || result.status || 'UPSTREAM_ERROR'),
      requestId,
    } as ApiResp<unknown>)
  } catch (e) {
    fail(res, 500, e instanceof Error ? e.message : '查询已订业务失败', requestId, 'SERVER_ERROR')
  }
})

router.post('/broadband/plans', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const resolved = await resolveCookie(req, res, requestId)
    if (!resolved) return
    const result = await queryBroadbandPlans({
      cookie: resolved.cookie,
      phone: resolved.phone,
      bgnMonth: typeof req.body?.bgnMonth === 'string' ? req.body.bgnMonth : undefined,
      endMonth: typeof req.body?.endMonth === 'string' ? req.body.endMonth : undefined,
    })
    if (result.cookie && result.cookieUpdated && resolved.sessionId) {
      updateBusinessSession(resolved.sessionId, { cookie: result.cookie })
    }
    res.status(200).json({
      ok: result.ok,
      data: result.ok ? { result: result.raw, broadband: result.data } : undefined,
      message: result.ok ? undefined : result.retDesc || result.message || '查询宽带号码失败',
      errorCode: result.ok ? undefined : String(result.retCode || result.status || 'UPSTREAM_ERROR'),
      requestId,
    } as ApiResp<unknown>)
  } catch (e) {
    fail(res, 500, e instanceof Error ? e.message : '查询宽带号码失败', requestId, 'SERVER_ERROR')
  }
})

router.post('/broadband/query', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const resolved = await resolveCookie(req, res, requestId)
    if (!resolved) return
    const broadband = req.body?.broadband
    if (!broadband || typeof broadband !== 'object') {
      return fail(res, 400, '缺少宽带号码信息', requestId, 'BROADBAND_REQUIRED')
    }
    const result = await queryBroadbandSubscribedBusiness({
      cookie: resolved.cookie,
      bgnMonth: typeof req.body?.bgnMonth === 'string' ? req.body.bgnMonth : undefined,
      endMonth: typeof req.body?.endMonth === 'string' ? req.body.endMonth : undefined,
        planType: String(req.body?.planType || '2'),
      busiType: String(req.body?.busiType || '01'),
      phone: resolved.phone,
      broadband: broadband as Record<string, unknown>,
    })
    if (result.cookie && result.cookieUpdated && resolved.sessionId) {
      updateBusinessSession(resolved.sessionId, { cookie: result.cookie })
    }
    res.status(200).json({
      ok: result.ok,
      data: result.ok ? { result: result.raw, business: result.data } : undefined,
      message: result.ok ? undefined : result.retDesc || result.message || '查询宽带业务失败',
      errorCode: result.ok ? undefined : String(result.retCode || result.status || 'UPSTREAM_ERROR'),
      requestId,
    } as ApiResp<unknown>)
  } catch (e) {
    fail(res, 500, e instanceof Error ? e.message : '查询宽带业务失败', requestId, 'SERVER_ERROR')
  }
})

router.post('/my-package', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const resolved = await resolveCookie(req, res, requestId)
    if (!resolved) return
    const plan = await queryUserPlan({
      cookie: resolved.cookie,
      phone: resolved.phone,
    })
    if (plan.cookie && plan.cookieUpdated && resolved.sessionId) {
      updateBusinessSession(resolved.sessionId, { cookie: plan.cookie })
    }
    if (!plan.ok) {
      return res.status(200).json({
        ok: false,
        message: plan.retDesc || plan.message || '查询用户套餐失败',
        errorCode: String(plan.retCode || plan.status || 'UPSTREAM_ERROR'),
        requestId,
      } as ApiResp<unknown>)
    }
    const contract = await queryCustomerContractInfo({
      cookie: plan.cookie || resolved.cookie,
      phone: resolved.phone,
      planType: String(req.body?.planType || '0'),
    })
    if (contract.cookie && contract.cookieUpdated && resolved.sessionId) {
      updateBusinessSession(resolved.sessionId, { cookie: contract.cookie })
    }
    res.status(200).json({
      ok: true,
      data: {
        plan: plan.data,
        contract: contract.ok ? contract.data : null,
        contractError: contract.ok
          ? undefined
          : {
              message: contract.retDesc || contract.message || '查询套餐合约失败',
              errorCode: String(contract.retCode || contract.status || 'UPSTREAM_ERROR'),
            },
        raw: {
          plan: plan.raw,
          contract: contract.raw,
        },
      },
      requestId,
    })
  } catch (e) {
    fail(res, 500, e instanceof Error ? e.message : '查询套餐与合约失败', requestId, 'SERVER_ERROR')
  }
})

router.post('/unsubscribe/status', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const resolved = await resolveCookie(req, res, requestId)
    if (!resolved) return
    const business = req.body?.business
    if (!business || typeof business !== 'object') return fail(res, 400, '缺少业务信息', requestId, 'BAD_REQUEST')
    const result = await queryUnsubscribeStatus({
      cookie: resolved.cookie,
      business: business as Record<string, unknown>,
      phone: resolved.phone,
    })
    if (result.cookie && result.cookieUpdated && resolved.sessionId) {
      updateBusinessSession(resolved.sessionId, { cookie: result.cookie })
    }
    res.status(200).json({
      ok: result.ok,
      data: result.ok ? { result: result.raw, status: result.data } : undefined,
      message: result.ok ? undefined : result.retDesc || result.message || '业务状态查询失败',
      errorCode: result.ok ? undefined : String(result.retCode || result.status || 'UPSTREAM_ERROR'),
      requestId,
    } as ApiResp<unknown>)
  } catch (e) {
    fail(res, 500, e instanceof Error ? e.message : '业务状态查询失败', requestId, 'SERVER_ERROR')
  }
})

router.post('/unsubscribe/sms/send', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireBusinessUnsubscribePermission(req, res, requestId))) return
    const resolved = await resolveCookie(req, res, requestId)
    if (!resolved) return
    const business = req.body?.business
    if (!business || typeof business !== 'object') return fail(res, 400, '缺少业务信息', requestId, 'BAD_REQUEST')
    const idOverride = readBusinessIdOverride(req.body?.businessIdOverride)
    const permission = await requireBusinessIdOverridePermission(req, idOverride)
    if (!permission.ok) return fail(res, 403, permission.message || '无权自定义业务ID', requestId, 'FORBIDDEN')
    const result = await sendUnsubscribeSms({
      cookie: resolved.cookie,
      business: business as Record<string, unknown>,
      phone: resolved.phone,
      effectiveTimeType: String(req.body?.effectiveTimeType || ''),
      idOverride,
    })
    if (result.cookie && result.cookieUpdated && resolved.sessionId) {
      updateBusinessSession(resolved.sessionId, { cookie: result.cookie })
    }
    res.status(200).json({
      ok: result.ok,
      data: result.ok ? { result: result.raw, cooldownSeconds: 60 } : undefined,
      message: result.ok ? undefined : result.retDesc || result.message || '发送退订验证码失败',
      errorCode: result.ok ? undefined : String(result.retCode || result.status || 'UPSTREAM_ERROR'),
      requestId,
    } as ApiResp<unknown>)
  } catch (e) {
    fail(res, 500, e instanceof Error ? e.message : '发送退订验证码失败', requestId, 'SERVER_ERROR')
  }
})

router.post('/unsubscribe', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireBusinessUnsubscribePermission(req, res, requestId))) return
    const resolved = await resolveCookie(req, res, requestId)
    if (!resolved) return
    const business = req.body?.business
    const smsCode = String(req.body?.smsCode || '').trim()
    if (!business || typeof business !== 'object') return fail(res, 400, '缺少业务信息', requestId, 'BAD_REQUEST')
    if (!isSixDigitCode(smsCode)) return fail(res, 400, '请输入 6 位退订验证码', requestId, 'INVALID_CODE')
    const idOverride = readBusinessIdOverride(req.body?.businessIdOverride)
    const permission = await requireBusinessIdOverridePermission(req, idOverride)
    if (!permission.ok) return fail(res, 403, permission.message || '无权自定义业务ID', requestId, 'FORBIDDEN')
    const result = await unsubscribeBusiness({
      cookie: resolved.cookie,
      business: business as Record<string, unknown>,
      smsCode,
      phone: resolved.phone,
      effectiveTimeType: String(req.body?.effectiveTimeType || ''),
      currentNum: req.body?.currentNum,
      planType: String(req.body?.planType || ''),
      idOverride,
    })
    if (result.cookie && result.cookieUpdated && resolved.sessionId) {
      updateBusinessSession(resolved.sessionId, { cookie: result.cookie })
    }
    res.status(200).json({
      ok: result.ok,
      data: result.ok ? { result: result.raw } : undefined,
      message: result.ok ? undefined : result.retDesc || result.message || '退订失败',
      errorCode: result.ok ? undefined : String(result.retCode || result.status || 'UPSTREAM_ERROR'),
      requestId,
    } as ApiResp<unknown>)
  } catch (e) {
    fail(res, 500, e instanceof Error ? e.message : '退订失败', requestId, 'SERVER_ERROR')
  }
})

router.post('/main-plan/withdraw/sms/send', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireBusinessUnsubscribePermission(req, res, requestId))) return
    const resolved = await resolveCookie(req, res, requestId)
    if (!resolved) return
    const business = req.body?.business
    if (!business || typeof business !== 'object') return fail(res, 400, '缺少主套餐信息', requestId, 'BAD_REQUEST')
    const idOverride = readBusinessIdOverride(req.body?.businessIdOverride)
    const permission = await requireBusinessIdOverridePermission(req, idOverride)
    if (!permission.ok) return fail(res, 403, permission.message || '无权自定义业务ID', requestId, 'FORBIDDEN')
    const flowKey = crypto.randomUUID()
    const result = await sendMainPlanWithdrawSms({
      cookie: resolved.cookie,
      business: business as Record<string, unknown>,
      phone: resolved.phone,
      flowKey,
      idOverride,
    })
    if (result.cookie && result.cookieUpdated && resolved.sessionId) {
      updateBusinessSession(resolved.sessionId, { cookie: result.cookie })
    }
    res.status(200).json({
      ok: result.ok,
      data: result.ok ? { result: result.raw, cooldownSeconds: 60, flowKey } : undefined,
      message: result.ok ? undefined : result.retDesc || result.message || '发送撤销验证码失败',
      errorCode: result.ok ? undefined : String(result.retCode || result.status || 'UPSTREAM_ERROR'),
      requestId,
    } as ApiResp<unknown>)
  } catch (e) {
    fail(res, 500, e instanceof Error ? e.message : '发送撤销验证码失败', requestId, 'SERVER_ERROR')
  }
})

router.post('/main-plan/withdraw', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await requireBusinessUnsubscribePermission(req, res, requestId))) return
    const resolved = await resolveCookie(req, res, requestId)
    if (!resolved) return
    const business = req.body?.business
    const smsCode = String(req.body?.smsCode || '').trim()
    if (!business || typeof business !== 'object') return fail(res, 400, '缺少主套餐信息', requestId, 'BAD_REQUEST')
    if (!isSixDigitCode(smsCode)) return fail(res, 400, '请输入 6 位撤销验证码', requestId, 'INVALID_CODE')
    const idOverride = readBusinessIdOverride(req.body?.businessIdOverride)
    const permission = await requireBusinessIdOverridePermission(req, idOverride)
    if (!permission.ok) return fail(res, 403, permission.message || '无权自定义业务ID', requestId, 'FORBIDDEN')
    const result = await withdrawMainPlan({
      cookie: resolved.cookie,
      business: business as Record<string, unknown>,
      smsCode,
      phone: resolved.phone,
      flowKey: typeof req.body?.flowKey === 'string' ? req.body.flowKey : undefined,
      idOverride,
    })
    if (result.cookie && result.cookieUpdated && resolved.sessionId) {
      updateBusinessSession(resolved.sessionId, { cookie: result.cookie })
    }
    res.status(200).json({
      ok: result.ok,
      data: result.ok ? { result: result.raw } : undefined,
      message: result.ok ? undefined : result.retDesc || result.message || '撤销失败',
      errorCode: result.ok ? undefined : String(result.retCode || result.status || 'UPSTREAM_ERROR'),
      requestId,
    } as ApiResp<unknown>)
  } catch (e) {
    fail(res, 500, e instanceof Error ? e.message : '撤销失败', requestId, 'SERVER_ERROR')
  }
})

router.delete('/session/:id', (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  deleteBusinessSession(String(req.params.id))
  res.json({ ok: true, data: { deleted: true }, requestId })
})

export default router

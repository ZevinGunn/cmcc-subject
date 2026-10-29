import crypto from 'node:crypto'
import { Router, type Request, type Response } from 'express'
import {
  getAccountById,
  listAccountSummaries,
  setAccountAigouSession,
  type AccountRecord,
} from '../services/accountsStore.js'
import { prepareAccountAigouSession } from '../services/accountAigouSession.js'
import { isAdminRequest } from '../services/serviceLoginGuard.js'
import { findCurrentUser, listUserAccountSummaries } from '../services/userAuthStore.js'
import {
  applyLuckyBenefitOverrides,
  listLuckyBenefitOverrides,
  saveLuckyBenefitOverride,
} from '../services/luckyThreeDayOverrides.js'
import {
  findActivityProduct,
  LUCKY_THREE_DAY,
  LuckyThreeDayClient,
  LuckyThreeDayError,
  type LuckyActionResult,
  type LuckyProduct,
} from '../services/luckyThreeDay.js'

const router = Router()

type ApiResp<T> =
  | { ok: true; data: T; requestId: string }
  | { ok: false; message: string; errorCode: string; requestId: string }

type ActivityAccess = { ownerKey: string; isAdmin: boolean; userId?: string }

const orderAttempts = new Map<string, { expiresAt: number; result: LuckyActionResult }>()
const orderInFlight = new Map<string, Promise<LuckyActionResult>>()

function fail(res: Response, status: number, message: string, requestId: string, errorCode: string): void {
  res.status(status).json({ ok: false, message, errorCode, requestId })
}

function handleError(res: Response, error: unknown, requestId: string): void {
  if (error instanceof LuckyThreeDayError) {
    fail(res, error.status, error.message, requestId, error.code)
    return
  }
  const message = error instanceof Error ? error.message : '服务端异常'
  fail(
    res,
    message === 'UPSTREAM_TIMEOUT' ? 504 : 500,
    message === 'UPSTREAM_TIMEOUT' ? '三日签上游超时，请重试' : message,
    requestId,
    message === 'UPSTREAM_TIMEOUT' ? 'UPSTREAM_TIMEOUT' : 'SERVER_ERROR',
  )
}

async function resolveAccess(req: Request, res: Response, requestId: string): Promise<ActivityAccess | null> {
  if (isAdminRequest(req)) return { ownerKey: 'admin', isAdmin: true }
  const user = await findCurrentUser(req)
  if (!user) {
    fail(res, 401, '请先登录账号中心', requestId, 'UNAUTHENTICATED')
    return null
  }
  if (!user.permissions.benefitActivity) {
    fail(res, 403, '当前用户未开启权益活动权限', requestId, 'BENEFIT_ACTIVITY_FORBIDDEN')
    return null
  }
  return { ownerKey: `user:${user.id}`, isAdmin: false, userId: user.id }
}

function maskPhone(value: string): string {
  return String(value || '').replace(/1\d{10}/g, (phone) => `${phone.slice(0, 3)}****${phone.slice(-4)}`)
}

function safeAccount(account: { id: string; label?: string; phone?: string; phoneMasked?: string; displayPhone?: string }) {
  return {
    id: account.id,
    label: maskPhone(account.label || account.phoneMasked || account.phone || '未命名账号'),
    phoneMasked: maskPhone(account.phoneMasked || account.phone || ''),
    displayPhone: maskPhone(account.displayPhone || account.phoneMasked || account.phone || ''),
  }
}

async function resolveAccount(access: ActivityAccess, accountId: string): Promise<AccountRecord> {
  if (!accountId) throw new LuckyThreeDayError('请选择活动账号', 'ACCOUNT_REQUIRED', 400)
  if (!access.isAdmin) {
    const accounts = await listUserAccountSummaries(String(access.userId))
    if (!accounts.some((account) => account.id === accountId)) {
      throw new LuckyThreeDayError('只能使用当前用户关联的账号', 'ACCOUNT_FORBIDDEN', 403)
    }
  }
  const account = await getAccountById(accountId)
  if (!account || account.disabledAt) {
    throw new LuckyThreeDayError('账号不存在或已停用', 'ACCOUNT_NOT_FOUND', 404)
  }
  return account
}

function positiveInteger(value: unknown, name: string): number {
  const number = Number(value)
  if (!Number.isSafeInteger(number) || number <= 0) {
    throw new LuckyThreeDayError(`${name} 格式不正确`, 'INVALID_PARAMETER', 400)
  }
  return number
}

function productInput(body: Record<string, unknown>): { batchId: number; skuId: number; mid?: number } {
  return {
    batchId: positiveInteger(body.batchId, 'batchId'),
    skuId: positiveInteger(body.skuId, 'skuId'),
    mid: body.mid === undefined || body.mid === '' ? undefined : positiveInteger(body.mid, 'mid'),
  }
}

async function runWithSession<T>(
  account: AccountRecord,
  operation: (client: LuckyThreeDayClient) => Promise<T>,
): Promise<{ value: T; reused: boolean }> {
  let current = account
  let lastExpiredMessage = ''
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const prepared = await prepareAccountAigouSession(current, { forceRefresh: attempt > 0 })
    if (!prepared.ok || !prepared.session) {
      throw new LuckyThreeDayError(
        prepared.message || '爱购商城凭证准备失败',
        prepared.status === 410 ? 'COOKIE_INVALID' : 'AIGOU_SESSION_FAILED',
        prepared.status === 410 ? 410 : 424,
      )
    }
    const client = new LuckyThreeDayClient(prepared.session)
    try {
      const value = await operation(client)
      if (client.cookieChanged) {
        await setAccountAigouSession({ id: account.id, session: client.session })
      }
      return { value, reused: prepared.reused }
    } catch (error) {
      if (error instanceof LuckyThreeDayError && error.code === 'SESSION_EXPIRED' && attempt === 0) {
        lastExpiredMessage = error.message
        current = prepared.account || current
        continue
      }
      throw error
    }
  }
  throw new LuckyThreeDayError(lastExpiredMessage || '爱购商城登录已失效，重新置换后仍无法使用', 'SESSION_EXPIRED', 401)
}

function assertProductActionable(product: LuckyProduct): void {
  if (product.attemptable) return
  throw new LuckyThreeDayError('管理员已暂停该权益的领取尝试', 'PRODUCT_ATTEMPT_DISABLED', 409)
}

async function freshProduct(client: LuckyThreeDayClient, body: Record<string, unknown>): Promise<LuckyProduct> {
  const rawActivity = await client.activity()
  const activity = applyLuckyBenefitOverrides(
    rawActivity,
    await listLuckyBenefitOverrides(rawActivity.id),
  )
  return findActivityProduct(activity, productInput(body))
}

function pruneAttempts(): void {
  const now = Date.now()
  for (const [key, value] of orderAttempts) {
    if (value.expiresAt <= now) orderAttempts.delete(key)
  }
}

router.get('/settings', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  if (!isAdminRequest(req)) {
    fail(res, 403, '仅管理员可查看权益覆盖配置', requestId, 'FORBIDDEN')
    return
  }
  try {
    const overrides = await listLuckyBenefitOverrides(LUCKY_THREE_DAY.activityId)
    res.json({ ok: true, data: { overrides }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.put('/settings/:batchId/:skuId', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  if (!isAdminRequest(req)) {
    fail(res, 403, '仅管理员可修改权益覆盖配置', requestId, 'FORBIDDEN')
    return
  }
  try {
    const inventoryRaw = req.body?.inventory
    const inventory = inventoryRaw === undefined || inventoryRaw === null || inventoryRaw === ''
      ? undefined
      : Number(inventoryRaw)
    if (inventory !== undefined && (!Number.isSafeInteger(inventory) || inventory < 0)) {
      throw new LuckyThreeDayError('自定义库存必须是大于或等于 0 的整数', 'INVALID_INVENTORY', 400)
    }
    if (typeof req.body?.attemptable !== 'boolean') {
      throw new LuckyThreeDayError('attemptable 必须是布尔值', 'INVALID_ATTEMPTABLE', 400)
    }
    const override = await saveLuckyBenefitOverride({
      activityId: LUCKY_THREE_DAY.activityId,
      batchId: positiveInteger(req.params.batchId, 'batchId'),
      skuId: positiveInteger(req.params.skuId, 'skuId'),
      attemptable: req.body.attemptable,
      inventory,
    })
    res.json({ ok: true, data: { override }, requestId })
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

router.post('/:accountId/status', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const access = await resolveAccess(req, res, requestId)
    if (!access) return
    const account = await resolveAccount(access, String(req.params.accountId || '').trim())
    const result = await runWithSession(account, async (client) => {
      const [sign, rawActivity] = await Promise.all([client.signStatus(), client.activity()])
      const activity = applyLuckyBenefitOverrides(
        rawActivity,
        await listLuckyBenefitOverrides(rawActivity.id),
      )
      return { sign, activity }
    })
    res.json({ ok: true, data: { ...result.value, sessionReused: result.reused }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/:accountId/sign', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const access = await resolveAccess(req, res, requestId)
    if (!access) return
    if (String(req.body?.confirmationText || '').trim() !== '确认签到') {
      throw new LuckyThreeDayError('请确认后再执行今日签到', 'SIGN_CONFIRMATION_REQUIRED', 400)
    }
    const account = await resolveAccount(access, String(req.params.accountId || '').trim())
    const result = await runWithSession(account, async (client) => {
      const current = await client.signStatus()
      if (current.signToday) throw new LuckyThreeDayError('今日已签到', 'ALREADY_SIGNED', 409)
      if (current.limitCount) throw new LuckyThreeDayError('当前账号已达到活动限制', 'SIGN_LIMIT_REACHED', 409)
      const reward = current.rewards[current.accumulateCount]
      if (reward && !reward.hasRemainCount) {
        throw new LuckyThreeDayError('本次签到奖励已领完', 'SIGN_REWARD_SOLD_OUT', 409)
      }
      const action = await client.sign()
      if (!action.success) {
        throw new LuckyThreeDayError(action.message || '签到失败', `UPSTREAM_${action.resultCode || 'SIGN_FAILED'}`, 424)
      }
      return { result: action, sign: await client.signStatus() }
    })
    res.json({ ok: true, data: result.value, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/:accountId/qualification', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const access = await resolveAccess(req, res, requestId)
    if (!access) return
    const account = await resolveAccount(access, String(req.params.accountId || '').trim())
    const result = await runWithSession(account, async (client) => {
      const product = await freshProduct(client, req.body || {})
      assertProductActionable(product)
      return { product, qualification: await client.qualification(product) }
    })
    res.json({ ok: true, data: result.value, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/:accountId/order-sms', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const access = await resolveAccess(req, res, requestId)
    if (!access) return
    const account = await resolveAccount(access, String(req.params.accountId || '').trim())
    const result = await runWithSession(account, async (client) => {
      const product = await freshProduct(client, req.body || {})
      assertProductActionable(product)
      const qualification = await client.qualification(product)
      if (!qualification.eligible) {
        return {
          product,
          qualification,
          sms: {
            success: false,
            resultCode: qualification.resultCode,
            message: qualification.message,
            data: qualification.data,
          },
          cooldownSeconds: 0,
        }
      }
      const sms = await client.sendOrderSms(product)
      return { product, qualification, sms, cooldownSeconds: sms.success ? 60 : 0 }
    })
    if (!result.value.qualification.eligible) {
      throw new LuckyThreeDayError(result.value.qualification.message, 'QUALIFICATION_REJECTED', 409)
    }
    if (!result.value.sms.success) {
      throw new LuckyThreeDayError(result.value.sms.message, `UPSTREAM_${result.value.sms.resultCode || 'SMS_FAILED'}`, 424)
    }
    res.json({ ok: true, data: result.value, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/:accountId/confirm', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const access = await resolveAccess(req, res, requestId)
    if (!access) return
    const smsCode = String(req.body?.smsCode || '').trim()
    if (!/^\d{4,8}$/.test(smsCode)) {
      throw new LuckyThreeDayError('请输入 4-8 位数字验证码', 'INVALID_SMS_CODE', 400)
    }
    if (String(req.body?.confirmationText || '').trim() !== '确认领取') {
      throw new LuckyThreeDayError('请输入“确认领取”完成二次确认', 'ORDER_CONFIRMATION_REQUIRED', 400)
    }
    const attemptId = String(req.body?.attemptId || '').trim()
    if (!/^[A-Za-z0-9_-]{8,80}$/.test(attemptId)) {
      throw new LuckyThreeDayError('领取请求缺少有效的 attemptId', 'INVALID_ATTEMPT_ID', 400)
    }
    const account = await resolveAccount(access, String(req.params.accountId || '').trim())
    const input = productInput(req.body || {})
    pruneAttempts()
    const attemptKey = `${access.ownerKey}:${account.id}:${input.batchId}:${input.skuId}:${attemptId}`
    const cached = orderAttempts.get(attemptKey)
    if (cached) {
      if (!cached.result.success) {
        throw new LuckyThreeDayError(
          cached.result.message,
          `UPSTREAM_${cached.result.resultCode || 'ORDER_FAILED'}`,
          424,
        )
      }
      res.json({ ok: true, data: { result: cached.result, replayed: true }, requestId })
      return
    }
    let pending = orderInFlight.get(attemptKey)
    if (!pending) {
      pending = runWithSession(account, async (client) => {
        const product = await freshProduct(client, req.body || {})
        assertProductActionable(product)
        const qualification = await client.qualification(product)
        if (!qualification.eligible) {
          throw new LuckyThreeDayError(qualification.message, 'QUALIFICATION_REJECTED', 409)
        }
        return client.confirmOrder(product, smsCode)
      }).then((value) => value.value)
      orderInFlight.set(attemptKey, pending)
    }
    let orderResult: LuckyActionResult
    try {
      orderResult = await pending
    } finally {
      orderInFlight.delete(attemptKey)
    }
    if (!orderResult.success) {
      throw new LuckyThreeDayError(orderResult.message, `UPSTREAM_${orderResult.resultCode || 'ORDER_FAILED'}`, 424)
    }
    orderAttempts.set(attemptKey, { expiresAt: Date.now() + 10 * 60_000, result: orderResult })
    res.json({ ok: true, data: { result: orderResult, replayed: false }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

export default router

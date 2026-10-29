import crypto from 'node:crypto'
import { Router, type Request, type Response } from 'express'
import { getAccountById, listAccountSummaries } from '../services/accountsStore.js'
import { ensureUsable10086Cookie } from '../services/cmccCookieRecovery.js'
import { prepareAccountCocPackageSession } from '../services/accountCocPackageSession.js'
import { isAdminRequest } from '../services/serviceLoginGuard.js'
import { findCurrentUser, listUserAccountSummaries } from '../services/userAuthStore.js'
import { LuckyBagError, LUCKY_BAG_PRESETS, readLuckyBagVariant } from '../services/luckyBagOrder.js'
import {
  assertBenefitOrderSessionAccess,
  BENEFIT_ORDER_DEFAULTS,
  COC_APP_PRODUCT_PRESETS,
  RETAIL_PRODUCT_PRESETS,
  BenefitOrderError,
  confirmBenefitOrder,
  createBuildingBricksSession,
  createLuckyBagSession,
  createCocAppSession,
  createPremiumMembershipSession,
  deleteBenefitOrderSession,
  loginBenefitSession,
  prepareBenefitProduct,
  readBenefitOrderSession,
  rewindBenefitOrderSession,
  selectBenefitProduct,
  sendBenefitLoginSms,
  sendBenefitOrderSms,
  type BenefitOrderWorkflow,
  type CocAppBusinessId,
  type CustomPremiumNormInput,
  type RetailBusinessId,
} from '../services/cmccBenefitOrder.js'

const router = Router()

type ApiResp<T> =
  | { ok: true; data: T; requestId: string }
  | { ok: false; message: string; errorCode: string; requestId: string }

type OrderAccess = { ownerKey: string; isAdmin: boolean; userId?: string }

function fail(res: Response, status: number, message: string, requestId: string, errorCode: string): void {
  res.status(status).json({ ok: false, message, errorCode, requestId })
}

function handleError(res: Response, error: unknown, requestId: string): void {
  if (error instanceof BenefitOrderError || error instanceof LuckyBagError) {
    fail(res, error.status, error.message, requestId, error.code)
    return
  }
  fail(res, 500, error instanceof Error ? error.message : '服务端异常', requestId, 'SERVER_ERROR')
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
  assertBenefitOrderSessionAccess(sessionId, access.ownerKey)
  return access
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

function identifier(value: unknown, fallback: string, field: string): string {
  const result = String(value || fallback).trim()
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(result)) {
    throw new BenefitOrderError(`${field} 格式不正确`, 'INVALID_PARAMETER', 400)
  }
  return result
}

function optionalIdentifier(value: unknown, fallback: string, field: string): string {
  const result = String(value ?? fallback).trim()
  if (!result) return ''
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(result)) {
    throw new BenefitOrderError(`${field} 格式不正确`, 'INVALID_PARAMETER', 400)
  }
  return result
}

function customSourceParams(body: Record<string, unknown>): Record<string, string> {
  const source: Record<string, string> = {}
  for (const key of ['fromRecommend', 'redCode', 'rcm_src', 'traceId', 'agentid', 'pageSource', 'pageid']) {
    const value = optionalIdentifier(body[key], '', key)
    if (value) source[key] = value
  }
  return source
}

function readCustomNorm(value: unknown): CustomPremiumNormInput | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  const input = value as Record<string, unknown>
  const id = String(input.id || '').trim()
  if (!/^\d{1,20}$/.test(id)) throw new BenefitOrderError('自定义 normId 必须为 1-20 位数字', 'INVALID_CUSTOM_NORM', 400)
  const priceValue = input.price === '' || input.price === undefined ? undefined : Number(input.price)
  if (priceValue !== undefined && (!Number.isFinite(priceValue) || priceValue < 0 || priceValue > 100000)) {
    throw new BenefitOrderError('自定义档位资费必须为 0-100000 之间的数字', 'INVALID_CUSTOM_NORM', 400)
  }
  const name = String(input.name || '').trim()
  if (name.length > 80) throw new BenefitOrderError('自定义档位名称不能超过 80 个字符', 'INVALID_CUSTOM_NORM', 400)
  return {
    id,
    packageId: optionalIdentifier(input.packageId, '', '权益码'),
    name: name || undefined,
    price: priceValue,
    bizIntfCode: optionalIdentifier(input.bizIntfCode, '001_JIYUN', 'bizIntfCode'),
  }
}

function readRetailBusinessId(value: unknown): RetailBusinessId {
  const id = String(value || 'premium_membership') as RetailBusinessId
  if (id in RETAIL_PRODUCT_PRESETS) return id
  throw new BenefitOrderError('不支持的移动商城业务', 'INVALID_RETAIL_BUSINESS', 400)
}

function readWorkflow(value: unknown): BenefitOrderWorkflow {
  if (value === 'building_bricks' || value === 'premium_membership' || value === 'coc_app' || value === 'lucky_bag') return value
  throw new BenefitOrderError('不支持的权益订购类型', 'INVALID_WORKFLOW', 400)
}

function readCocAppBusinessId(value: unknown): CocAppBusinessId {
  const id = String(value || 'smart_life') as CocAppBusinessId
  if (id in COC_APP_PRODUCT_PRESETS) return id
  throw new BenefitOrderError('不支持的 COC App 业务', 'INVALID_COC_APP_BUSINESS', 400)
}

async function resolveAccount(
  access: OrderAccess,
  accountId: string,
): Promise<Awaited<ReturnType<typeof getAccountById>>> {
  if (!accountId) throw new BenefitOrderError('请选择办理账号', 'ACCOUNT_REQUIRED', 400)
  if (!access.isAdmin) {
    const accounts = await listUserAccountSummaries(String(access.userId))
    if (!accounts.some((account) => account.id === accountId)) {
      throw new BenefitOrderError('只能为当前用户关联账号办理业务', 'ACCOUNT_FORBIDDEN', 403)
    }
  }
  const account = await getAccountById(accountId)
  if (!account || account.disabledAt) throw new BenefitOrderError('账号不存在或已停用', 'ACCOUNT_NOT_FOUND', 404)
  return account
}

router.get('/catalog', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!(await resolveAccess(req, res, requestId))) return
    res.json({
      ok: true,
      data: {
        workflows: [
          { id: 'building_bricks', name: '积木套餐', separateLogin: false, defaults: BENEFIT_ORDER_DEFAULTS.building_bricks },
          { id: 'lucky_bag', name: '标准/豪华福袋', separateLogin: true, presets: LUCKY_BAG_PRESETS },
          { id: 'premium_membership', name: '智臻会员', separateLogin: false, defaults: BENEFIT_ORDER_DEFAULTS.premium_membership },
          { id: 'coc_app', name: 'COC 专属套餐', separateLogin: false, defaults: BENEFIT_ORDER_DEFAULTS.coc_app },
        ],
        retailProducts: Object.values(RETAIL_PRODUCT_PRESETS),
        cocAppProducts: Object.values(COC_APP_PRODUCT_PRESETS),
      },
      requestId,
    })
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
    const workflow = readWorkflow(req.body?.workflow)
    const accountId = String(req.body?.accountId || '').trim()
    const account = accountId ? await resolveAccount(access, accountId) : null
    if ((workflow === 'premium_membership' || workflow === 'coc_app') && !account) {
      throw new BenefitOrderError('该业务必须选择已有登录账号', 'ACCOUNT_REQUIRED', 400)
    }
    if (!account && !access.isAdmin) {
      throw new BenefitOrderError('请从已关联账号进入业务订购', 'ACCOUNT_REQUIRED', 400)
    }
    const phone = account?.phone || String(req.body?.phone || '').trim()
    if (!/^1\d{10}$/.test(phone)) throw new BenefitOrderError('账号缺少正确的 11 位手机号', 'INVALID_PHONE', 400)

    if (workflow === 'lucky_bag') {
      const session = await createLuckyBagSession({
        ownerKey: access.ownerKey, phone, accountId: account?.id, bagVariant: readLuckyBagVariant(req.body?.bagVariant),
      })
      res.json({ ok: true, data: { session }, requestId })
      return
    }

    if (workflow === 'building_bricks') {
      let authSession
      if (account) {
        const prepared = await prepareAccountCocPackageSession(account, 'building_bricks')
        if (!prepared.ok || !prepared.session) {
          throw new BenefitOrderError(
            prepared.message || '积木套餐订购凭证置换失败',
            prepared.status === 410 ? 'COOKIE_INVALID' : 'COC_PACKAGE_EXCHANGE_FAILED',
            prepared.status === 410 ? 410 : 424,
          )
        }
        authSession = prepared.session
      }
      const session = await createBuildingBricksSession({
        ownerKey: access.ownerKey,
        phone,
        accountId: account?.id,
        pageId: identifier(req.body?.pageId, BENEFIT_ORDER_DEFAULTS.building_bricks.pageId, 'pageId'),
        touchCode: identifier(req.body?.touchCode, BENEFIT_ORDER_DEFAULTS.building_bricks.touchCode, 'touchCode'),
        mainProductCode: identifier(req.body?.mainProductCode, BENEFIT_ORDER_DEFAULTS.building_bricks.mainProductCode, 'mainProductCode'),
        orderProductCode: identifier(req.body?.orderProductCode, BENEFIT_ORDER_DEFAULTS.building_bricks.orderProductCode, 'orderProductCode'),
        authSession,
      })
      res.json({ ok: true, data: { session }, requestId })
      return
    }

    if (workflow === 'coc_app') {
      const appBusinessId = readCocAppBusinessId(req.body?.appBusinessId)
      const preset = COC_APP_PRODUCT_PRESETS[appBusinessId]
      const prepared = await prepareAccountCocPackageSession(account!, appBusinessId)
      if (!prepared.ok || !prepared.session) {
        throw new BenefitOrderError(
          prepared.message || `${preset.name}订购凭证置换失败`,
          prepared.status === 410 ? 'COOKIE_INVALID' : 'COC_PACKAGE_EXCHANGE_FAILED',
          prepared.status === 410 ? 410 : 424,
        )
      }
      const session = await createCocAppSession({
        ownerKey: access.ownerKey,
        phone,
        accountId: account!.id,
        authSession: prepared.session,
        appBusinessId,
        pageId: identifier(req.body?.pageId, preset.pageId, 'pageId'),
        touchCode: identifier(req.body?.touchCode, preset.touchCode, 'touchCode'),
        productCode: identifier(req.body?.productCode, preset.productCode, 'productCode'),
      })
      res.json({ ok: true, data: { session }, requestId })
      return
    }

    const usable = await ensureUsable10086Cookie({
      rec: account!,
      allowRecentSkip: true,
      windowMin: 20,
      clearOnYunpanFailure: false,
      preferYunpan: Boolean(account!.yunpanSession),
    })
    if (!usable.ok || !usable.cookie) {
      throw new BenefitOrderError(usable.message || '账号 10086 Cookie 已失效，请重新登录', 'COOKIE_INVALID', 410)
    }
    const businessId = readRetailBusinessId(req.body?.businessId)
    const preset = RETAIL_PRODUCT_PRESETS[businessId]
    const isCustom = businessId === 'custom'
    const isPersonalPage = preset.pageMode === 'personal_page'
    const productCode = String(req.body?.productCode ?? preset.productCode).trim()
    if (isCustom && !productCode) {
      throw new BenefitOrderError('自定义移动商城业务必须填写 productCode', 'PRODUCT_CODE_REQUIRED', 400)
    }
    const session = await createPremiumMembershipSession({
      ownerKey: access.ownerKey,
      accountId: account!.id,
      cookie: usable.cookie,
      businessId,
      productId: isPersonalPage ? '' : identifier(req.body?.productId, preset.productId, 'productId'),
      productCode: isPersonalPage ? '' : identifier(productCode, preset.productCode, 'productCode'),
      touchCode: optionalIdentifier(req.body?.touchCode, preset.touchCode, 'touchCode'),
      marketingCode: optionalIdentifier(req.body?.marketingCode, preset.marketingCode, 'marketingCode'),
      secondChannel: optionalIdentifier(req.body?.secondChannel, preset.secondChannel, 'secondChannel'),
      sourceParams: isCustom ? customSourceParams(req.body || {}) : { ...preset.sourceParams },
      productName: preset.name,
      effectType: isCustom ? optionalIdentifier(req.body?.effectType, preset.effectType, 'effectType') : preset.effectType,
      pageMode: preset.pageMode,
      personalPageId: preset.personalPageId,
      mergeCode: preset.mergeCode,
      warning: preset.warning,
    })
    if (session.maskedPhone !== maskPhone(phone)) {
      throw new BenefitOrderError('移动商城 SSO 登录号码与所选账号不一致', 'ACCOUNT_SESSION_MISMATCH', 409)
    }
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
    res.json({ ok: true, data: { session: readBenefitOrderSession(id) }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/login-sms', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    res.json({ ok: true, data: { session: await sendBenefitLoginSms(id) }, requestId })
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
    if (!/^\d{6}$/.test(code)) return fail(res, 400, '请输入 6 位登录验证码', requestId, 'INVALID_CODE')
    res.json({ ok: true, data: { session: await loginBenefitSession(id, code) }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/product', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    res.json({ ok: true, data: { session: await prepareBenefitProduct(id) }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/selection', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    const selectedIds = Array.isArray(req.body?.selectedIds)
      ? req.body.selectedIds.map((value: unknown) => String(value || '').trim()).filter(Boolean)
      : []
    const customNorm = readCustomNorm(req.body?.customNorm)
    res.json({ ok: true, data: { session: await selectBenefitProduct(id, selectedIds, customNorm) }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/back', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    res.json({ ok: true, data: { session: rewindBenefitOrderSession(id) }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/sessions/:id/order-sms', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    res.json({
      ok: true,
      data: {
        session: await sendBenefitOrderSms(id, req.body?.acceptedProtocol === true, req.body?.forceAttempt === true),
      },
      requestId,
    })
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
    if (!/^\d{6}$/.test(code)) return fail(res, 400, '请输入 6 位订购验证码', requestId, 'INVALID_CODE')
    const data = await confirmBenefitOrder({
      id,
      code,
      acceptedProtocol: req.body?.acceptedProtocol === true,
      confirmationText: String(req.body?.confirmationText || ''),
      forceAttempt: req.body?.forceAttempt === true,
    })
    res.json({ ok: true, data, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.delete('/sessions/:id', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '')
    if (!(await requireSessionAccess(req, res, requestId, id))) return
    res.json({ ok: true, data: { deleted: deleteBenefitOrderSession(id) }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

export default router

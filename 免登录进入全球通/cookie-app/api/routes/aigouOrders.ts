import crypto from 'node:crypto'
import { Router, type Request, type Response } from 'express'
import { getAccountById, setAccountAigouSession, setAccountCocPackageSession, toAccountSummary } from '../services/accountsStore.js'
import { prepareAccountAigouSession } from '../services/accountAigouSession.js'
import { prepareAccountCocPackageSession } from '../services/accountCocPackageSession.js'
import { AigouPackageOrderClient } from '../services/aigouPackageOrder.js'
import {
  AIGOU_PRODUCT_PRESETS,
  AigouBusinessOrderClient,
  AigouOrderError,
  normalizeProductInput,
  type AigouProductInput,
  type AigouRiskContext,
} from '../services/aigouBusinessOrder.js'
import {
  AIGOU_CART_CATALOG,
  AigouShoppingCartClient,
  type AigouCartCatalogItem,
  type AigouCartSelection,
} from '../services/aigouShoppingCart.js'
import { isAdminRequest } from '../services/serviceLoginGuard.js'
import { findCurrentUser, listUserAccountSummaries } from '../services/userAuthStore.js'

const router = Router()

type ApiResp<T> =
  | { ok: true; data: T; requestId: string }
  | { ok: false; message: string; errorCode: string; requestId: string }

function fail(res: Response, status: number, message: string, requestId: string, errorCode: string): void {
  res.status(status).json({ ok: false, message, errorCode, requestId })
}

function handleError(res: Response, error: unknown, requestId: string): void {
  if (error instanceof AigouOrderError) {
    res.status(error.status).json({ ok: false, message: error.message, errorCode: error.code, requestId, response: error.response })
    return
  }
  fail(res, 500, error instanceof Error ? error.message : '服务端异常', requestId, 'SERVER_ERROR')
}

async function resolveAccount(req: Request, accountId: string) {
  if (!accountId) throw new AigouOrderError('请选择办理账号', 'ACCOUNT_REQUIRED', 400)
  if (!isAdminRequest(req)) {
    const user = await findCurrentUser(req)
    if (!user) throw new AigouOrderError('请先登录账号中心', 'UNAUTHENTICATED', 401)
    if (!user.permissions.businessOrder) throw new AigouOrderError('当前用户未开启业务订购权限', 'BUSINESS_ORDER_FORBIDDEN', 403)
    const accounts = await listUserAccountSummaries(user.id)
    if (!accounts.some((account) => account.id === accountId)) {
      throw new AigouOrderError('只能为当前用户关联账号办理业务', 'ACCOUNT_FORBIDDEN', 403)
    }
  }
  const account = await getAccountById(accountId)
  if (!account || account.disabledAt) throw new AigouOrderError('账号不存在或已停用', 'ACCOUNT_NOT_FOUND', 404)
  if (!/^1\d{10}$/.test(account.phone)) throw new AigouOrderError('账号缺少有效手机号', 'PHONE_REQUIRED', 400)
  return account
}

function productInput(body: Record<string, unknown>): AigouProductInput {
  return normalizeProductInput({
    code: String(body.code || ''),
    skuId: String(body.skuId || ''),
    channelCode: String(body.channelCode || ''),
    selfChannelCode: String(body.selfChannelCode || ''),
    referer: String(body.referer || ''),
    activityId: String(body.activityId || ''),
    name: String(body.name || ''),
    orderMode: body.orderMode === 'package' ? 'package' : body.orderMode === 'rights' ? 'rights' : undefined,
    productCode: String(body.productCode || ''),
    pageId: String(body.pageId || ''),
    touchCode: String(body.touchCode || ''),
    protocolSequenceId: String(body.protocolSequenceId || ''),
    smsCodeTypeEnum: String(body.smsCodeTypeEnum || ''),
  })
}

function riskContext(value: unknown): AigouRiskContext {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const input = value as Record<string, unknown>
  const output: AigouRiskContext = {}
  const keys = ['grRiskP1', 'grRiskP2', 'grRiskP3', 'wasmParams', 'operDfp'] as const
  for (const key of keys) {
    const item = String(input[key] || '').trim()
    if (item.length > 12_000) throw new AigouOrderError(`${key} 长度超出限制`, 'INVALID_RISK_CONTEXT', 400)
    if (item) output[key] = item
  }
  return output
}

async function clientFor(req: Request, accountId: string, forceRefresh = false) {
  const account = await resolveAccount(req, accountId)
  const prepared = await prepareAccountAigouSession(account, { forceRefresh })
  if (!prepared.ok || !prepared.session) {
    throw new AigouOrderError(prepared.message || '爱购商城登录态准备失败', 'AIGOU_SESSION_NOT_READY', prepared.status === 401 ? 401 : 424)
  }
  return { account, client: new AigouBusinessOrderClient(prepared.session), reused: prepared.reused }
}

async function packageClientFor(req: Request, accountId: string) {
  const account = await resolveAccount(req, accountId)
  const prepared = await prepareAccountCocPackageSession(account, 'starbucks_membership')
  if (!prepared.ok || !prepared.session) {
    throw new AigouOrderError(prepared.message || 'COC 套餐登录态准备失败', 'COC_PACKAGE_SESSION_NOT_READY', prepared.status === 401 ? 401 : 424)
  }
  return { account, client: new AigouPackageOrderClient(prepared.session, account.phone), reused: prepared.reused }
}

async function cartClientFor(req: Request, accountId: string) {
  const account = await resolveAccount(req, accountId)
  const prepared = await prepareAccountAigouSession(account)
  if (!prepared.ok || !prepared.session) {
    throw new AigouOrderError(prepared.message || '爱购商城登录态准备失败', 'AIGOU_SESSION_NOT_READY', prepared.status === 401 ? 401 : 424)
  }
  return { account, client: new AigouShoppingCartClient(prepared.session), reused: prepared.reused }
}

async function saveSession(accountId: string, client: AigouBusinessOrderClient): Promise<void> {
  await setAccountAigouSession({ id: accountId, session: client.session })
}

async function savePackageSession(accountId: string, client: AigouPackageOrderClient): Promise<void> {
  await setAccountCocPackageSession({ id: accountId, target: 'starbucks_membership', session: client.session })
}

async function saveCartSession(accountId: string, client: AigouShoppingCartClient): Promise<void> {
  await setAccountAigouSession({ id: accountId, session: client.session })
}

function cartItems(value: unknown): Array<Partial<AigouCartSelection>> {
  if (!Array.isArray(value)) throw new AigouOrderError('请选择购物车商品', 'CART_SELECTION_REQUIRED', 400)
  if (value.length > 50) throw new AigouOrderError('购物车商品数量超出限制', 'CART_SELECTION_LIMIT', 400)
  return value.map((item) => item && typeof item === 'object' && !Array.isArray(item) ? item as Partial<AigouCartSelection> : {})
}

function customCartItem(body: Record<string, unknown>): AigouCartCatalogItem {
  const busiType = String(body.busiType || 'C3').trim()
  if (!['C3', 'N0', 'N1', 'N3'].includes(busiType)) throw new AigouOrderError('busiType 格式不正确', 'INVALID_PARAMETER', 400)
  const specId = String(body.specId || '').trim()
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(specId)) throw new AigouOrderError('specId 格式不正确', 'INVALID_PARAMETER', 400)
  return {
    id: `custom-${specId}`,
    name: String(body.name || `商品 ${specId}`).trim().slice(0, 120),
    specId,
    busiType: busiType as AigouCartCatalogItem['busiType'],
    selfChannelCode: String(body.selfChannelCode || 'P00000011939').trim(),
    referer: String(body.referer || 'detailA').trim(),
    source: 'cart-snapshot',
    cartable: true,
  }
}

router.get('/catalog', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!isAdminRequest(req)) {
      const user = await findCurrentUser(req)
      if (!user) return fail(res, 401, '请先登录账号中心', requestId, 'UNAUTHENTICATED')
      if (!user.permissions.businessOrder) return fail(res, 403, '当前用户未开启业务订购权限', requestId, 'BUSINESS_ORDER_FORBIDDEN')
    }
    res.json({ ok: true, data: { presets: AIGOU_PRODUCT_PRESETS }, requestId })
  } catch (error) { handleError(res, error, requestId) }
})

router.get('/cart/catalog', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!isAdminRequest(req)) {
      const user = await findCurrentUser(req)
      if (!user) return fail(res, 401, '请先登录账号中心', requestId, 'UNAUTHENTICATED')
      if (!user.permissions.businessOrder) return fail(res, 403, '当前用户未开启业务订购权限', requestId, 'BUSINESS_ORDER_FORBIDDEN')
    }
    const cartableCount = AIGOU_CART_CATALOG.filter((item) => item.cartable).length
    res.json({
      ok: true,
      data: {
        items: AIGOU_CART_CATALOG,
        cartableCount,
        pendingMappingCount: AIGOU_CART_CATALOG.length - cartableCount,
      },
      requestId,
    })
  } catch (error) { handleError(res, error, requestId) }
})

router.post('/cart/list', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const accountId = String(req.body?.accountId || '').trim()
    const { account, client, reused } = await cartClientFor(req, accountId)
    const result = await client.list()
    await saveCartSession(accountId, client)
    res.json({ ok: true, data: { ...result, account: toAccountSummary(account), sessionReused: reused }, requestId })
  } catch (error) { handleError(res, error, requestId) }
})

router.post('/cart/add', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const accountId = String(req.body?.accountId || '').trim()
    const itemId = String(req.body?.itemId || '').trim()
    const item = itemId ? AIGOU_CART_CATALOG.find((candidate) => candidate.id === itemId) : customCartItem(req.body || {})
    if (!item) throw new AigouOrderError('未找到加车商品', 'CART_ITEM_NOT_FOUND', 404)
    const { client } = await cartClientFor(req, accountId)
    const result = await client.add(item, Number(req.body?.number || 1))
    await saveCartSession(accountId, client)
    res.json({ ok: true, data: { ...result, item }, requestId })
  } catch (error) { handleError(res, error, requestId) }
})

router.post('/cart/add-all', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const accountId = String(req.body?.accountId || '').trim()
    const itemIds = Array.isArray(req.body?.itemIds)
      ? req.body.itemIds.map((item: unknown) => String(item || '').trim()).filter(Boolean)
      : undefined
    const { client } = await cartClientFor(req, accountId)
    const result = await client.addAll(itemIds)
    await saveCartSession(accountId, client)
    res.json({ ok: true, data: result, requestId })
  } catch (error) { handleError(res, error, requestId) }
})

router.post('/cart/edit', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const accountId = String(req.body?.accountId || '').trim()
    const { client } = await cartClientFor(req, accountId)
    const result = await client.edit(req.body?.item || {}, Number(req.body?.number))
    await saveCartSession(accountId, client)
    res.json({ ok: true, data: result, requestId })
  } catch (error) { handleError(res, error, requestId) }
})

router.post('/cart/calculate', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const accountId = String(req.body?.accountId || '').trim()
    const { client } = await cartClientFor(req, accountId)
    const result = await client.calculate(cartItems(req.body?.items))
    await saveCartSession(accountId, client)
    res.json({ ok: true, data: result, requestId })
  } catch (error) { handleError(res, error, requestId) }
})

router.post('/cart/sms', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const accountId = String(req.body?.accountId || '').trim()
    const { client } = await cartClientFor(req, accountId)
    const result = await client.sendSms(cartItems(req.body?.items))
    await saveCartSession(accountId, client)
    res.json({ ok: true, data: result, requestId })
  } catch (error) { handleError(res, error, requestId) }
})

router.post('/cart/confirm', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const accountId = String(req.body?.accountId || '').trim()
    const { client } = await cartClientFor(req, accountId)
    const result = await client.confirmOrder({
      items: cartItems(req.body?.items),
      payType: Number(req.body?.payType),
      smsCode: String(req.body?.smsCode || '').trim(),
      busiOpId: String(req.body?.busiOpId || '').trim(),
      risk: riskContext(req.body?.riskContext),
    })
    await saveCartSession(accountId, client)
    res.status(200).json({ ok: true, data: result, requestId })
  } catch (error) { handleError(res, error, requestId) }
})

router.post('/product', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const accountId = String(req.body?.accountId || '').trim()
    const input = productInput(req.body || {})
    if (input.orderMode === 'package') {
      const { account, client, reused } = await packageClientFor(req, accountId)
      const product = await client.resolveProduct(input)
      await savePackageSession(accountId, client)
      return res.json({ ok: true, data: { product, account: toAccountSummary(account), sessionReused: reused }, requestId })
    }
    const { account, client, reused } = await clientFor(req, accountId)
    const product = await client.resolveProduct(input)
    await saveSession(accountId, client)
    res.json({ ok: true, data: { product, account: toAccountSummary(account), sessionReused: reused }, requestId })
  } catch (error) { handleError(res, error, requestId) }
})

router.post('/sms', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const accountId = String(req.body?.accountId || '').trim()
    const input = productInput(req.body || {})
    if (input.orderMode === 'package') {
      const { client } = await packageClientFor(req, accountId)
      const result = await client.sendSms(input)
      await savePackageSession(accountId, client)
      return res.json({ ok: true, data: result, requestId })
    }
    const { client } = await clientFor(req, accountId)
    const result = await client.sendSms(input)
    await saveSession(accountId, client)
    res.json({ ok: true, data: result, requestId })
  } catch (error) { handleError(res, error, requestId) }
})

router.post('/confirm', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  try {
    const accountId = String(req.body?.accountId || '').trim()
    const smsCode = String(req.body?.smsCode || '').trim()
    const input = productInput(req.body || {})
    if (input.orderMode === 'package') {
      const { client } = await packageClientFor(req, accountId)
      const result = await client.confirmOrder(input, smsCode)
      await savePackageSession(accountId, client)
      return res.status(200).json({ ok: true, data: result, requestId })
    }
    const { client } = await clientFor(req, accountId)
    const result = await client.confirmOrder(input, smsCode, riskContext(req.body?.riskContext))
    await saveSession(accountId, client)
    res.status(200).json({ ok: true, data: result, requestId })
  } catch (error) { handleError(res, error, requestId) }
})

export default router

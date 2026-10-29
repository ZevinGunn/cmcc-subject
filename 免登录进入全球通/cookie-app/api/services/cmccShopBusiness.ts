import crypto from 'node:crypto'
import { httpsRequestText } from './cmccHttp.js'
import { mergeCookieWithSetCookie } from './cookieUtils.js'
import { shopWireDecrypt, shopWireEncrypt } from './cmccShopCrypto.js'

const SHOP_ORIGIN = 'https://shop.10086.cn'
const DEFAULT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'
const SESSION_TTL_MS = 24 * 60 * 60 * 1000

export const SHOP_CATEGORY_LABELS: Record<string, string> = {
  '01': '我的套餐',
  '02': '增值业务',
  '03': '基础功能',
  '04': '其他',
  '05': '代收费业务',
  '06': '已参加活动',
  '07': '政企业务',
}

export type ShopBusinessItem = {
  id: string
  prodType: string
  categoryLabel: string
  busiName: string
  busiCode: string
  busiType: string
  bizCode: string | null
  spid: string | null
  busiFee: string
  orderedTime: string
  effectTime: string
  extinctTime: string
  unsubscribeTime: string
  isOrdered: string
  isUnOrder: string
  canUnsubscribe: true
  raw: Record<string, unknown>
}

type ShopSession = {
  id: string
  accountId: string
  phone: string
  cookie: string
  label?: string
  createdAt: number
  updatedAt: number
  businesses: Map<string, ShopBusinessItem>
}

export type PublicShopSession = Omit<ShopSession, 'cookie' | 'businesses'>

export type ShopResult<T = unknown> = {
  ok: boolean
  status?: number
  message?: string
  data?: T
  raw?: unknown
  cookie?: string
  cookieUpdated?: boolean
}

const sessions = new Map<string, ShopSession>()

function cleanupSessions(): void {
  const now = Date.now()
  for (const [id, session] of sessions.entries()) {
    if (now - session.updatedAt > SESSION_TTL_MS) sessions.delete(id)
  }
}

function publicSession(session: ShopSession): PublicShopSession {
  return {
    id: session.id,
    accountId: session.accountId,
    phone: session.phone,
    label: session.label,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  }
}

export function createShopSession(args: {
  accountId: string
  phone: string
  cookie: string
  label?: string
}): PublicShopSession {
  cleanupSessions()
  const now = Date.now()
  const session: ShopSession = {
    id: crypto.randomUUID(),
    accountId: args.accountId,
    phone: args.phone,
    cookie: args.cookie,
    label: args.label,
    createdAt: now,
    updatedAt: now,
    businesses: new Map(),
  }
  sessions.set(session.id, session)
  return publicSession(session)
}

export function getShopSession(id: string): ShopSession | null {
  cleanupSessions()
  const session = sessions.get(id)
  if (!session) return null
  session.updatedAt = Date.now()
  return session
}

export function deleteShopSession(id: string): void {
  sessions.delete(id)
}

function parseJson(value: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(value) as unknown
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null
  } catch {
    return null
  }
}

function isSuccess(raw: Record<string, unknown>): boolean {
  return String(raw.retCode || '').padStart(6, '0') === '000000'
}

function required(value: unknown, name: string): string {
  const text = String(value ?? '').trim()
  if (!text) throw new Error(`业务缺少 ${name}`)
  return text
}

function encryptedPhone(phone: string): string {
  if (!/^1\d{10}$/.test(phone)) throw new Error('账号缺少正确的 11 位手机号')
  return shopWireEncrypt(phone)
}

function shopHeaders(session: ShopSession, contentType: string): Record<string, string> {
  const phoneCipher = encryptedPhone(session.phone)
  return {
    'User-Agent': DEFAULT_UA,
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Content-Type': contentType,
    'X-Requested-With': 'XMLHttpRequest',
    Origin: SHOP_ORIGIN,
    Referer: `${SHOP_ORIGIN}/i/`,
    provcode: '100',
    payPhoneNo: `${phoneCipher}${session.phone.slice(5, 7)}`,
    Cookie: session.cookie,
  }
}

async function shopRequest<T>(args: {
  session: ShopSession
  path: string
  method?: 'GET' | 'POST'
  body?: Record<string, unknown>
}): Promise<ShopResult<T>> {
  const method = args.method || 'GET'
  const response = await httpsRequestText({
    url: `${SHOP_ORIGIN}/i${args.path}`,
    method,
    headers: shopHeaders(args.session, method === 'POST' ? 'application/json' : '*/*'),
    body: args.body ? JSON.stringify(args.body) : undefined,
    timeoutMs: 30_000,
  })
  const merged = mergeCookieWithSetCookie({
    cookie: args.session.cookie,
    setCookie: response.headers['set-cookie'],
  })
  if (merged.changed) args.session.cookie = merged.cookie
  const raw = parseJson(response.bodyText)
  if (!raw) {
    return {
      ok: false,
      status: response.statusCode,
      message: `移动商城返回了非 JSON 响应（HTTP ${response.statusCode}）`,
      raw: response.bodyText.slice(0, 180),
      cookie: args.session.cookie,
      cookieUpdated: merged.changed,
    }
  }
  if (response.statusCode < 200 || response.statusCode >= 300 || !isSuccess(raw)) {
    return {
      ok: false,
      status: response.statusCode,
      message: String(raw.retMsg || `移动商城接口失败（${raw.retCode || response.statusCode}）`),
      raw,
      cookie: args.session.cookie,
      cookieUpdated: merged.changed,
    }
  }
  let data = raw.data as T
  const rawData = raw.data
  if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
    const outParam = (rawData as Record<string, unknown>).outParam
    if (typeof outParam === 'string' && outParam) {
      try {
        const plain = shopWireDecrypt(outParam)
        try {
          data = JSON.parse(plain) as T
        } catch {
          data = plain as T
        }
      } catch (error) {
        return {
          ok: false,
          status: response.statusCode,
          message: `移动商城响应解密失败：${error instanceof Error ? error.message : '格式错误'}`,
          raw,
          cookie: args.session.cookie,
          cookieUpdated: merged.changed,
        }
      }
    }
  }
  return {
    ok: true,
    status: response.statusCode,
    data,
    raw,
    message: String(raw.retMsg || ''),
    cookie: args.session.cookie,
    cookieUpdated: merged.changed,
  }
}

function nullableString(value: unknown): string {
  return value === null || value === undefined || value === '' ? 'null' : String(value)
}

export function normalizeShopBusiness(
  item: Record<string, unknown> = {},
  prodType = '',
  index = 0,
): ShopBusinessItem {
  return {
    id: `${prodType}-${index}-${String(item.busiCode || index)}`,
    prodType,
    categoryLabel: SHOP_CATEGORY_LABELS[prodType] || `分类 ${prodType || '-'}`,
    busiName: String(item.busiName || ''),
    busiCode: String(item.busiCode ?? ''),
    busiType: String(item.busiType ?? ''),
    bizCode: item.bizCode === null || item.bizCode === undefined ? null : String(item.bizCode),
    spid: item.spid === null || item.spid === undefined ? null : String(item.spid),
    busiFee: String(item.busiFee ?? ''),
    orderedTime: String(item.orderedTime ?? ''),
    effectTime: String(item.effectTime ?? ''),
    extinctTime: String(item.extinctTime ?? ''),
    unsubscribeTime: String(item.unsubscribeTime ?? ''),
    isOrdered: String(item.isOrdered ?? ''),
    isUnOrder: String(item.isUnOrder ?? ''),
    canUnsubscribe: true,
    raw: item,
  }
}

export async function queryShopBusinesses(session: ShopSession): Promise<
  ShopResult<{
    groups: Array<{ prodType: string; label: string; items: ShopBusinessItem[] }>
    queriedAt: string
  }>
> {
  const result = await shopRequest<unknown[]>({
    session,
    path: `/v1/busi/order/${encodeURIComponent(encryptedPhone(session.phone))}?_=${Date.now()}`,
  })
  if (!result.ok) return result as ShopResult<never>
  const groups = Array.isArray(result.data) ? result.data : []
  const normalized = groups.map((entry) => {
    const group = entry && typeof entry === 'object' ? (entry as Record<string, unknown>) : {}
    const prodType = String(group.prodType || '')
    const items = (Array.isArray(group.orderBusis) ? group.orderBusis : [])
      .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
      .map((item, index) => normalizeShopBusiness(item, prodType, index))
    return {
      prodType,
      label: SHOP_CATEGORY_LABELS[prodType] || `分类 ${prodType || '-'}`,
      items,
    }
  })
  session.businesses = new Map(normalized.flatMap((group) => group.items).map((item) => [item.id, item]))
  const raw = result.raw && typeof result.raw === 'object' ? (result.raw as Record<string, unknown>) : {}
  return { ...result, data: { groups: normalized, queriedAt: String(raw.sOperTime || '') } }
}

export async function validateShopCookie(args: {
  accountId: string
  phone: string
  cookie: string
}): Promise<ShopResult<{ valid: true }>> {
  const now = Date.now()
  const session: ShopSession = {
    id: 'validation',
    accountId: args.accountId,
    phone: args.phone,
    cookie: args.cookie,
    createdAt: now,
    updatedAt: now,
    businesses: new Map(),
  }
  const result = await shopRequest<Record<string, unknown>>({ session, path: '/v1/auth/loginfo' })
  return result.ok
    ? { ...result, data: { valid: true } }
    : (result as ShopResult<never>)
}

async function readSessionSeed(session: ShopSession): Promise<ShopResult<{ seed: string }>> {
  const result = await shopRequest<Record<string, unknown>>({ session, path: '/v1/auth/loginfo' })
  if (!result.ok) return result as ShopResult<never>
  const msgId = result.data && typeof result.data.msgId === 'string' ? result.data.msgId : ''
  if (!msgId) {
    return {
      ok: false,
      status: result.status,
      message: '当前登录态缺少 msgId，请重新进入页面',
      raw: result.raw,
      cookie: result.cookie,
      cookieUpdated: result.cookieUpdated,
    }
  }
  try {
    return { ...result, data: { seed: shopWireDecrypt(msgId) } }
  } catch {
    return {
      ok: false,
      status: result.status,
      message: '当前登录态的 msgId 无法解密，请重新进入页面',
      raw: result.raw,
      cookie: result.cookie,
      cookieUpdated: result.cookieUpdated,
    }
  }
}

function findBusiness(session: ShopSession, businessId: string): ShopBusinessItem {
  const business = session.businesses.get(businessId)
  if (!business) throw new Error('业务不存在或查询结果已过期，请重新查询')
  return business
}

function buildMsgId(seed: string): string {
  return shopWireEncrypt(`${Date.now()}${seed}`)
}

export async function sendShopUnsubscribeSms(
  session: ShopSession,
  businessId: string,
): Promise<ShopResult<{ sent: true; cooldownSeconds: 60 }>> {
  const business = findBusiness(session, businessId)
  const seed = await readSessionSeed(session)
  if (!seed.ok || !seed.data) return seed as ShopResult<never>
  const payload = {
    msgType: '02',
    busiCode: required(business.busiCode, 'busiCode'),
    busiName: business.prodType,
    phoneNo: session.phone,
  }
  const result = await shopRequest<unknown>({
    session,
    path: `/v1/cust/commonSms/${encodeURIComponent(encryptedPhone(session.phone))}`,
    method: 'POST',
    body: {
      inParam: shopWireEncrypt(JSON.stringify(payload)),
      msgId: buildMsgId(seed.data.seed),
    },
  })
  return result.ok
    ? { ...result, data: { sent: true, cooldownSeconds: 60 } }
    : (result as ShopResult<never>)
}

export async function unsubscribeShopBusiness(
  session: ShopSession,
  businessId: string,
  smsCode: string,
): Promise<ShopResult<{ success: true; message: string }>> {
  if (!/^\d{6}$/.test(smsCode)) throw new Error('请输入 6 位短信验证码')
  const business = findBusiness(session, businessId)
  const seed = await readSessionSeed(session)
  if (!seed.ok || !seed.data) return seed as ShopResult<never>
  const orderInfos = [
    {
      busiType: required(business.busiType, 'busiType'),
      bizCode: nullableString(business.bizCode),
      busiCode: required(business.busiCode, 'busiCode'),
      spid: nullableString(business.spid),
      oprCode: '01',
      smsCode,
    },
  ]
  const result = await shopRequest<unknown>({
    session,
    path: `/v1/busi/ordermodify/${encodeURIComponent(encryptedPhone(session.phone))}`,
    method: 'POST',
    body: {
      inParam: shopWireEncrypt(JSON.stringify({ orderInfos })),
      msgId: buildMsgId(seed.data.seed),
    },
  })
  return result.ok
    ? { ...result, data: { success: true, message: result.message || '退订请求已受理' } }
    : (result as ShopResult<never>)
}

export const __test__ = {
  normalizeShopBusiness,
}

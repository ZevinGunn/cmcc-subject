import crypto from 'node:crypto'
import { httpsRequestText, type HttpResponse } from './cmccHttp.js'
import { mergeCookieWithSetCookie, parseCookieHeader } from './cookieUtils.js'
import { extractUpstreamHtmlError, formatUpstreamErrorMessage } from '../../shared/upstreamErrorMessage.js'
import { prepareBusinessH5Request, type PreparedBusinessH5Request } from './cmccBusinessH5.js'
import { resolveBusinessUnsubscribeTime as resolveUnsubscribeEffectiveTime } from '../../shared/businessUnsubscribeTime.js'
import {
  decryptBusinessResponseBody,
  encryptBusinessCookieValue,
  encryptBusinessRequest,
  encryptBusinessText,
} from './cmccBusinessCrypto.js'

const DEFAULT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'

const BUSINESS_PAGE_URL = 'https://wx.10086.cn/cmcc-service/app-pages/main/businessQuery'
const MY_PACKAGE_PAGE_URL = 'https://wx.10086.cn/cmcc-service/app-pages/main/myPackage'
const BALANCE_PAGE_URL = 'https://wx.10086.cn/cmcc-service/app-pages/main/balanceQuery'
const BUSINESS_ORIGIN = 'https://wx.10086.cn'
const BUSINESS_LK = 'CKyscfssVfp4V80E61EBj8lbYbaTkhrZ'
const H_APP_ORIGIN = 'https://h.app.coc.10086.cn'
const APP_ORIGIN = 'https://app.10086.cn'
const CONTRACT_GATEWAY_ORIGIN = 'https://10086.online-cmcc.cn:20010'

export type BusinessSessionSource = 'account' | 'manual'

export type BusinessSession = {
  id: string
  source: BusinessSessionSource
  accountId?: string
  phone?: string
  cookie: string
  sx?: string
  createdAt: number
  updatedAt: number
}

export type CmccBusinessResult<T = unknown> = {
  ok: boolean
  status?: number | string
  message?: string
  retCode?: string
  retDesc?: string
  data?: T
  cookie?: string
  cookieUpdated?: boolean
  raw?: unknown
}

export type BroadbandAccount = Record<string, unknown> & {
  id: string
  broadbandNo: string
  address: string
  addressMasked: string
  displayName: string
}

const sessions = new Map<string, BusinessSession>()
const SESSION_TTL_MS = 24 * 60 * 60 * 1000

function cleanupSessions(): void {
  const now = Date.now()
  for (const [id, session] of sessions.entries()) {
    if (now - session.updatedAt > SESSION_TTL_MS) sessions.delete(id)
  }
}

export function createBusinessSession(args: {
  source: BusinessSessionSource
  accountId?: string
  phone?: string
  cookie: string
  sx?: string
}): BusinessSession {
  cleanupSessions()
  const now = Date.now()
  const session: BusinessSession = {
    id: crypto.randomUUID(),
    source: args.source,
    accountId: args.accountId,
    phone: args.phone,
    cookie: args.cookie,
    sx: args.sx,
    createdAt: now,
    updatedAt: now,
  }
  sessions.set(session.id, session)
  return publicSession(session)
}

export function getBusinessSession(id: string): BusinessSession | null {
  cleanupSessions()
  const session = sessions.get(id)
  if (!session) return null
  session.updatedAt = Date.now()
  return session
}

export function updateBusinessSession(id: string, patch: Partial<BusinessSession>): BusinessSession | null {
  const session = getBusinessSession(id)
  if (!session) return null
  Object.assign(session, patch, { updatedAt: Date.now() })
  return session
}

export function deleteBusinessSession(id: string): void {
  sessions.delete(id)
}

export function publicSession(session: BusinessSession): BusinessSession {
  return { ...session, cookie: session.cookie ? '已保存' : '' }
}

function normalizeBase64Json(text: string): unknown {
  const trimmed = text.trim()
  if (!trimmed) return {}
  try {
    return JSON.parse(trimmed)
  } catch {
    const decoded = Buffer.from(trimmed, 'base64').toString('utf8')
    return JSON.parse(decoded)
  }
}

function normalizeBusinessPayload(rawText: string): unknown {
  const outer = normalizeBase64Json(rawText)
  if (!outer || typeof outer !== 'object') return outer
  const body = (outer as Record<string, unknown>).body
  if (typeof body !== 'string') return outer
  const decrypted = decryptBusinessResponseBody(body)
  return JSON.parse(decrypted)
}

function isHtmlResponse(text: string): boolean {
  const trimmed = text.trim().replace(/^<!--[\s\S]*?-->\s*/, '')
  return /^<!doctype\b|^<(?:html|head|body|title|h[1-6]|div|p)\b/i.test(trimmed)
}

function bodySnippet(text: string): string {
  return text.replace(/\s+/g, ' ').trim().slice(0, 180)
}

function retResult<T>(parsed: unknown, statusCode: number, cookie?: string, cookieUpdated?: boolean): CmccBusinessResult<T> {
  const obj = parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {}
  const retCode = typeof obj.retCode === 'string' ? obj.retCode : undefined
  const ok = statusCode >= 200 && statusCode < 300 && (!retCode || retCode === '000000')
  const retDesc = typeof obj.retDesc === 'string' ? ok ? obj.retDesc : formatUpstreamErrorMessage(obj.retDesc, statusCode) : undefined
  const data = (obj.rspBody ?? obj) as T
  return {
    ok,
    status: statusCode,
    message: retDesc,
    retCode,
    retDesc,
    data,
    cookie,
    cookieUpdated,
    raw: parsed,
  }
}

function buildCommonRequestBody(args: {
  reqBody: Record<string, unknown>
  phone?: string
  prov?: string
  city?: string
  includePageMeta?: boolean
  pageURI?: string
  lk?: string
  xk?: string
}): Record<string, unknown> {
  const body: Record<string, unknown> = {
    ak: args.includePageMeta ? '' : undefined,
    cid: '0',
    en: '0',
    t: '0',
    sn: '0',
    cv: '0',
    st: '0',
    sv: '0',
    sp: '0',
    xk: args.xk || crypto.randomUUID(),
    xc: 'web',
    imei: '',
    nt: '',
    sb: '',
    prov: args.prov || '100',
    city: args.city || '0000',
    tel: args.phone || '99999999999',
    reqBody: args.reqBody,
  }
  if (args.includePageMeta) {
    body.pageURI = args.pageURI || BUSINESS_PAGE_URL
    body.lk = args.lk || BUSINESS_LK
  } else {
    delete body.ak
  }
  return body
}

function baseHeaders(args?: {
  cookie?: string
  referer?: string
  origin?: string
  contentType?: string
  accept?: string
}): Record<string, string> {
  return {
    'User-Agent': DEFAULT_UA,
    Accept: args?.accept || 'application/json, text/plain, */*',
    'Content-Type': args?.contentType || 'application/x-www-form-urlencoded',
    Origin: args?.origin || BUSINESS_ORIGIN,
    Referer: args?.referer || BUSINESS_PAGE_URL,
    ...(args?.cookie ? { Cookie: args.cookie } : {}),
  }
}

function randomDigits(length: number): string {
  let value = ''
  for (let i = 0; i < length; i += 1) value += Math.floor(Math.random() * 10)
  return value
}

function md5(text: string): string {
  return crypto.createHash('md5').update(text).digest('hex')
}

function buildLoginCookie(): string {
  return `cellNum=${encodeURIComponent(encryptBusinessCookieValue('99999999999'))}`
}

function currentBusinessMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function normalizeBusinessMonth(value?: string): string {
  const raw = String(value || '').trim()
  if (/^\d{4}-\d{2}$/.test(raw)) return raw
  if (/^\d{6}$/.test(raw)) return `${raw.slice(0, 4)}-${raw.slice(4)}`
  return currentBusinessMonth()
}

function signedHeaders(args: {
  url: string
  body: Record<string, unknown>
  bodyText: string
  cookie?: string
}): Record<string, string> {
  const timestamp = String(Date.now())
  const nonce = randomDigits(8)
  const pathname = new URL(args.url).pathname
  const xk = String(args.body.xk || '')
  const token = encryptBusinessText(`${xk}_${pathname}_${timestamp}_${nonce}`)
  const sessionId = parseCookieHeader(args.cookie || '').get('JSESSIONID') || 'null'
  return {
    xs: md5(`${args.url}_${args.bodyText}CMCCIT`),
    'x-time': timestamp,
    'x-nonce': nonce,
    'x-token': token,
    'x-sign': md5(`${token}_${timestamp}_${nonce}_${sessionId}`),
    TRACE: `${xk}_${pathname}_${timestamp}_${randomDigits(20)}`,
    'x-qen': '1',
  }
}

async function postBusinessApi<T>(args: {
  url: string
  body: Record<string, unknown>
  cookie?: string
  headerCookie?: string
  phone?: string
  prov?: string
  city?: string
  includePageMeta?: boolean
  pageURI?: string
  referer?: string
  origin?: string
  contentType?: string
  accept?: string
  timeoutMs?: number
  xk?: string
  h5Protocol?: boolean
}): Promise<CmccBusinessResult<T>> {
  const commonBody = buildCommonRequestBody({
    reqBody: args.body,
    phone: args.phone,
    prov: args.prov,
    city: args.city,
    includePageMeta: args.includePageMeta,
    pageURI: args.pageURI,
    xk: args.xk,
  })
  const bodyText = JSON.stringify(commonBody)
  let prepared: PreparedBusinessH5Request | undefined
  if (args.h5Protocol) {
    // The current official BasicService adds lk only when its script URL contains it.
    delete commonBody.lk
    try {
      prepared = prepareBusinessH5Request({ url: args.url, body: commonBody, cookie: args.cookie || '', pageUrl: args.pageURI || BUSINESS_PAGE_URL })
    } catch {
      return { ok: false, status: 'SECURITY_ERROR', message: 'CMCC H5 退订请求加密失败，未向移动侧提交，请联系管理员检查模块版本' }
    }
  }
  const encrypted = prepared ? prepared.body : encryptBusinessRequest(commonBody)
  const headers = baseHeaders({
    cookie: args.headerCookie ?? args.cookie,
    referer: args.referer,
    origin: args.origin,
    contentType: args.contentType,
    accept: args.accept,
  })
  let res
  try {
    res = await httpsRequestText({
      url: args.url,
      method: 'POST',
      headers: prepared
        ? { ...Object.fromEntries(Object.entries(headers).map(([name, value]) => [name.toLowerCase(), value])), ...prepared.headers }
        : { ...headers, ...signedHeaders({ url: args.url, body: commonBody, bodyText, cookie: args.cookie }) },
      body: encrypted,
      timeoutMs: args.timeoutMs ?? 15000,
      allowUnsafeLegacyRenegotiation: true,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return {
      ok: false,
      status: 'NETWORK_ERROR',
      message: message.includes('unsafe legacy renegotiation')
        ? '移动侧 HTTPS 握手失败：上游节点要求 legacy renegotiation'
        : `移动侧请求失败：${message}`,
    }
  }
  return parseBusinessResponse<T>(res, args.cookie, prepared?.decodeResponse)
}

function parseBusinessResponse<T>(res: Pick<HttpResponse, 'statusCode' | 'headers' | 'bodyText'>, cookie?: string, decoder?: PreparedBusinessH5Request['decodeResponse']): CmccBusinessResult<T> {
  const merged = mergeCookieWithSetCookie({ cookie: cookie || '', setCookie: res.headers['set-cookie'] })
  const htmlError = isHtmlResponse(res.bodyText) ? extractUpstreamHtmlError(res.bodyText, res.statusCode) : null
  if (res.statusCode < 200 || res.statusCode >= 300) {
    const snippet = bodySnippet(res.bodyText)
    return {
      ok: false,
      status: res.statusCode,
      message: htmlError || formatUpstreamErrorMessage(`移动侧上游 HTTP ${res.statusCode}${snippet ? `：${snippet}` : ''}`, res.statusCode),
      cookie: merged.cookie || undefined,
      cookieUpdated: merged.changed,
    }
  }
  let parsed: unknown
  try {
    parsed = decoder ? decoder(res) : normalizeBusinessPayload(res.bodyText)
  } catch (e) {
    const snippet = bodySnippet(res.bodyText)
    return {
      ok: false,
      status: res.statusCode,
      message: htmlError || (decoder
        ? '移动侧退订响应无法解密或缺少业务结果码，操作结果尚未确认，请先刷新已订业务核对状态'
        : formatUpstreamErrorMessage(`移动侧响应解密/解析失败：${e instanceof Error ? e.message : String(e)}${snippet ? `；响应片段：${snippet}` : ''}`, res.statusCode)),
      cookie: merged.cookie || cookie,
      cookieUpdated: merged.changed,
    }
  }
  return retResult<T>(parsed, res.statusCode, merged.cookie || cookie, merged.changed)
}

export const __test__ = { parseBusinessResponse, buildUnsubscribeBody, buildUnsubscribeSmsBody, resolveUnsubscribeEffectiveTime }

export async function businessSendLoginSms(phone: string): Promise<CmccBusinessResult<{ sx?: string }>> {
  return postBusinessApi<{ sx?: string }>({
    url: `${H_APP_ORIGIN}/biz-orange/LH/uamrandcodeH5/sendMsgLoginH5`,
    body: { cellNum: phone, channlCode: '2' },
    cookie: buildLoginCookie(),
    phone: '99999999999',
  })
}

export async function businessLogin(phone: string, code: string, sx: string): Promise<CmccBusinessResult> {
  const result = await postBusinessApi({
    url: `${H_APP_ORIGIN}/biz-orange/LH/uamrandcodeloginH5/loginH5`,
    body: { cellNum: phone, verifyCode: code, sendSmsFlag: 0, sx, channlCode: '2' },
    cookie: buildLoginCookie(),
    phone: '99999999999',
  })
  const rawCookie = result.cookie || buildLoginCookie()
  const map = parseCookieHeader(rawCookie)
  const cellNum = map.get('cellNum')
  const fallbackCookie = cellNum ? rawCookie : `${buildLoginCookie()}; ${rawCookie}`.trim()
  return { ...result, cookie: fallbackCookie }
}

export async function queryUserInformation(args: { cookie: string; phone?: string }): Promise<CmccBusinessResult> {
  const phone = String(args.phone || '').trim()
  return postBusinessApi({
    url: `${APP_ORIGIN}/biz-orange/BN/userInformationService/getUserInformation`,
    body: phone ? { cellNum: phone } : {},
    cookie: args.cookie,
    phone,
    includePageMeta: true,
  })
}

export async function queryBalanceUserInformation(args: { cookie: string; phone?: string }): Promise<CmccBusinessResult> {
  const phone = String(args.phone || '').trim()
  return postBusinessApi({
    url: `${APP_ORIGIN}/biz-orange/BN/userInformationService/getUserInformation`,
    body: phone ? { cellNum: phone } : {},
    cookie: args.cookie,
    phone,
    city: '010',
    includePageMeta: true,
    pageURI: BALANCE_PAGE_URL,
    referer: BALANCE_PAGE_URL,
  })
}

export async function queryUserBalance(args: {
  cookie: string
  phone?: string
  beginMonth?: string
  endMonth?: string
}): Promise<CmccBusinessResult> {
  const phone = String(args.phone || '').trim()
  const month = currentBusinessMonth()
  return postBusinessApi({
    url: `${APP_ORIGIN}/biz-orange/BH/accoutQry/getAccoutInfo`,
    body: {
      ...(phone ? { cellNum: phone } : {}),
      beginMonth: args.beginMonth || month,
      endMonth: args.endMonth || args.beginMonth || month,
    },
    cookie: args.cookie,
    phone,
    city: '010',
    includePageMeta: true,
    pageURI: BALANCE_PAGE_URL,
    referer: BALANCE_PAGE_URL,
  })
}

export async function queryUserPlan(args: { cookie: string; phone?: string }): Promise<CmccBusinessResult> {
  const phone = String(args.phone || '').trim()
  return postBusinessApi({
    url: `${APP_ORIGIN}/biz-orange/BN/userPlanQry/getUserPlanQryNew`,
    body: phone ? { cellNum: phone } : {},
    cookie: args.cookie,
    phone,
    city: '010',
    includePageMeta: true,
    pageURI: MY_PACKAGE_PAGE_URL,
    referer: MY_PACKAGE_PAGE_URL,
    accept: 'application/json',
  })
}

export async function queryCustomerContractInfo(args: {
  cookie: string
  phone?: string
  planType?: string
}): Promise<CmccBusinessResult> {
  const phone = String(args.phone || '').trim()
  const cookieMap = parseCookieHeader(args.cookie)
  const sessionId = cookieMap.get('JSESSIONID') || ''
  const uid = cookieMap.get('UID') || ''
  const ticketId = cookieMap.get('ticketID') || ''
  const query = sessionId
    ? `?JSESSIONID=${encodeURIComponent(sessionId)};%20UID=${encodeURIComponent(uid)};%20Comment=SessionServer-unity;%20Path=/;HTTPOnly;%20ticketID=${encodeURIComponent(ticketId || 'SuZhou')};%20Secure`
    : ''
  return postBusinessApi({
    url: `${CONTRACT_GATEWAY_ORIGIN}/cmcc-gateway/inline/app/iservice/direct/contract/customerContractInfoQry${query}`,
    body: {
      provinceCode: '100',
      cityCode: '010',
      cellNum: phone,
      planType: args.planType || '0',
      caller: 'appH5',
    },
    cookie: args.cookie,
    headerCookie: '',
    phone,
    city: '010',
    referer: MY_PACKAGE_PAGE_URL,
    contentType: 'application/json; charset=UTF-8',
    timeoutMs: 20000,
  })
}

export async function querySubscribedBusiness(args: {
  cookie: string
  phone?: string
  bgnMonth?: string
  endMonth?: string
  planType?: string
  busiType?: string
  broadband?: Record<string, unknown>
}): Promise<CmccBusinessResult> {
  const bgnMonth = normalizeBusinessMonth(args.bgnMonth)
  const endMonth = args.endMonth ? normalizeBusinessMonth(args.endMonth) : bgnMonth
  const phone = String(args.phone || '').trim()
  const broadbandPayload = buildBroadbandQueryPayload(args.broadband)
  return postBusinessApi({
    url: `${APP_ORIGIN}/biz-orange/BN/queryBuinessService/getNewQueryBusiness`,
    body: {
      ...(phone ? { cellNum: phone } : {}),
      ...broadbandPayload,
      bgnMonth,
      endMonth,
      planType: args.planType || '0',
      busiType: args.busiType || '01',
    },
    cookie: args.cookie,
    phone,
    prov: firstStringDeep(args.broadband, ['prov', 'province', 'provinceCode']),
    city: firstStringDeep(args.broadband, ['city', 'cityCode', 'areaCode']),
    includePageMeta: true,
  })
}

export async function queryBroadbandPlans(args: {
  cookie: string
  phone?: string
  bgnMonth?: string
  endMonth?: string
}): Promise<CmccBusinessResult<{ plans: BroadbandAccount[]; raw: unknown }>> {
  const phone = String(args.phone || '').trim()
  const bgnMonth = normalizeBusinessMonth(args.bgnMonth)
  const endMonth = args.endMonth ? normalizeBusinessMonth(args.endMonth) : bgnMonth
  const result = await postBusinessApi({
    url: `${APP_ORIGIN}/biz-orange/BN/userGhBroadbandInfo/getUserPlanType`,
    body: {
      ...(phone ? { cellNum: phone } : {}),
      bgnMonth,
      endMonth,
    },
    cookie: args.cookie,
    phone,
    includePageMeta: true,
    pageURI: BUSINESS_PAGE_URL,
    referer: BUSINESS_PAGE_URL,
  })
  if (!result.ok) return result as CmccBusinessResult<{ plans: BroadbandAccount[]; raw: unknown }>
  return {
    ...result,
    data: {
      plans: normalizeBroadbandAccounts(result.data),
      raw: result.data,
    },
  }
}

export async function queryBroadbandSubscribedBusiness(args: {
  cookie: string
  phone?: string
  bgnMonth?: string
  endMonth?: string
  planType?: string
  busiType?: string
  broadband?: Record<string, unknown>
}): Promise<CmccBusinessResult> {
  return querySubscribedBusiness({
    cookie: args.cookie,
    phone: args.phone,
    bgnMonth: args.bgnMonth,
    endMonth: args.endMonth,
    planType: args.planType || '2',
    busiType: args.busiType || '01',
    broadband: args.broadband,
  })
}

function buildBroadbandQueryPayload(broadband?: Record<string, unknown>): Record<string, unknown> {
  if (!broadband || typeof broadband !== 'object') return {}
  const broadbandNo = firstStringDeep(broadband, [
    'busiID',
    'broadbandNo',
    'broadbandNum',
    'broadBandNum',
    'bandNum',
    'kdNum',
    'account',
    'acctNo',
    'userNo',
    'serviceNum',
    'phoneNum',
  ])
  const address = firstStringDeep(broadband, ['busiValue', 'address', 'installAddr', 'installAddress', 'addr', 'userAddr'])
  const planType = firstStringDeep(broadband, ['planType', 'userPlanType', 'type'])
  return {
    ...broadband,
    ...(broadbandNo
      ? {
          broadbandNo,
          broadbandNum: broadbandNo,
          broadBandNum: broadbandNo,
          bandNum: broadbandNo,
          kdNum: broadbandNo,
        }
      : {}),
    ...(address ? { address, installAddr: address, installAddress: address } : {}),
    ...(planType ? { planType } : {}),
  }
}

function normalizeBroadbandAccounts(value: unknown): BroadbandAccount[] {
  const found: Record<string, unknown>[] = []
  const seen = new Set<unknown>()
  const walk = (node: unknown): void => {
    if (!node || seen.has(node) || typeof node !== 'object') return
    seen.add(node)
    if (Array.isArray(node)) {
      node.forEach((item) => {
        if (!item || typeof item !== 'object') return
        const obj = item as Record<string, unknown>
        const no = firstStringDeep(obj, [
          'busiID',
          'broadbandNo',
          'broadbandNum',
          'broadBandNum',
          'bandNum',
          'kdNum',
          'account',
          'acctNo',
          'userNo',
          'serviceNum',
        ])
        const address = firstStringDeep(obj, ['busiValue', 'address', 'installAddr', 'installAddress', 'addr', 'userAddr'])
        if (no || address) found.push(obj)
      })
      node.forEach(walk)
      return
    }
    Object.values(node).forEach(walk)
  }
  walk(value)
  const unique = new Map<string, BroadbandAccount>()
  found.forEach((item, index) => {
    const broadbandNo =
        firstStringDeep(item, [
        'busiID',
        'broadbandNo',
        'broadbandNum',
        'broadBandNum',
        'bandNum',
        'kdNum',
        'account',
        'acctNo',
        'userNo',
        'serviceNum',
      ]) || `宽带${index + 1}`
    const address = firstStringDeep(item, ['busiValue', 'address', 'installAddr', 'installAddress', 'addr', 'userAddr'])
    const id = firstStringDeep(item, ['id', 'broadbandId', 'userId', 'instanceId']) || broadbandNo
    unique.set(id, {
      ...item,
      id,
      broadbandNo,
      address,
      addressMasked: maskBroadbandAddress(address),
      displayName: broadbandNo,
    })
  })
  return Array.from(unique.values())
}

function firstStringDeep(value: unknown, keys: string[]): string {
  const seen = new Set<unknown>()
  const walk = (node: unknown): string => {
    if (!node || seen.has(node) || typeof node !== 'object') return ''
    seen.add(node)
    if (Array.isArray(node)) {
      for (const item of node) {
        const hit = walk(item)
        if (hit) return hit
      }
      return ''
    }
    const obj = node as Record<string, unknown>
    for (const key of keys) {
      const value = obj[key]
      if (value !== undefined && value !== null && String(value).trim()) return String(value).trim()
    }
    for (const child of Object.values(obj)) {
      const hit = walk(child)
      if (hit) return hit
    }
    return ''
  }
  return walk(value)
}

function maskBroadbandAddress(address: string): string {
  const raw = String(address || '').trim()
  if (!raw) return ''
  const suffix = raw.match(/(\d+\s*号?)$/)?.[1] || ''
  const visible = suffix ? suffix.replace(/\s+/g, '') : raw.slice(-1)
  return `${'*'.repeat(Math.max(18, Math.min(38, raw.length)))}${visible}`
}

function resolvePhone(args: { phone?: string; business?: Record<string, unknown> }): string {
  const fromBusiness = args.business
    ? args.business.cellNum || args.business.phone || args.business.tel || args.business.telNum
    : ''
  return String(args.phone || fromBusiness || '').trim()
}

function businessProductName(business: Record<string, unknown>): string {
  return [
    business.businessName || business.productName || business.busiName || business.bunessName,
    ...(Array.isArray(business.bindList)
      ? business.bindList.map((item) =>
          item && typeof item === 'object' ? (item as Record<string, unknown>).bindedBusiName || (item as Record<string, unknown>).bunessName : '',
        )
      : []),
  ]
    .filter(Boolean)
    .join(',')
}

function mainPlanId(business: Record<string, unknown>): string {
  return firstStringDeep(business, [
    'planId',
    'planCode',
    'mainPlanId',
    'mainPlanCode',
    'packagePlanId',
    'packagePlanCode',
    'productId',
    'productCode',
    'prodId',
    'prodCode',
  ])
}

export type BusinessIdOverride = {
  planId?: string
  productCode?: string
  offerId?: string
}

function cleanOverrideValue(value: unknown): string {
  return String(value || '').trim().slice(0, 80)
}

function effectiveBusinessIds(business: Record<string, unknown>, override?: BusinessIdOverride): BusinessIdOverride {
  const planId = cleanOverrideValue(override?.planId) || firstStringDeep(business, ['planId', 'planCode', 'mainPlanId', 'mainPlanCode'])
  const productCode =
    cleanOverrideValue(override?.productCode) ||
    firstStringDeep(business, ['productCode', 'bunessCode', 'productId', 'productID', 'prodCode', 'prodId'])
  const offerId =
    cleanOverrideValue(override?.offerId) ||
    firstStringDeep(business, ['offerId', 'offerCode', 'bizCode', 'busiCode', 'businessCode', 'ywCode'])
  return { planId, productCode, offerId }
}

function mainPlanIdForRequest(business: Record<string, unknown>, override?: BusinessIdOverride): string {
  const ids = effectiveBusinessIds(business, override)
  return cleanOverrideValue(ids.planId) || cleanOverrideValue(ids.productCode) || cleanOverrideValue(ids.offerId) || mainPlanId(business)
}

function unsubscribeEffectiveType(business: Record<string, unknown>, effectiveTimeType?: string): string {
  const effectiveMap: Record<string, string> = { '0': '2', '1': '1', '3': '5' }
  return effectiveMap[resolveUnsubscribeEffectiveTime(business, effectiveTimeType)] || '3'
}

function buildUnsubscribeBody(args: {
  business: Record<string, unknown>
  phone: string
  smsCode?: string
  effectiveTimeType?: string
  idOverride?: BusinessIdOverride
}): Record<string, unknown> {
  const business = args.business
  const ids = effectiveBusinessIds(business, args.idOverride)
  return {
    cellNum: args.phone,
    ...(business.businessName ? { businessName: business.businessName } : {}),
    productType: business.codeType || business.bunessType || '',
    productId: ids.productCode || '',
    spid: business.sPCode || business.spid || '',
    bizCode: cleanOverrideValue(args.idOverride?.offerId) || business.bizCode || ids.offerId || '',
    ...(ids.planId ? { planId: ids.planId } : {}),
    ...(business.offerId || args.idOverride?.offerId ? { offerId: ids.offerId } : {}),
    smsCode: args.smsCode || '',
    busiReturnEffTime: resolveUnsubscribeEffectiveTime(business, args.effectiveTimeType),
    instanceId: business.instanceId || '',
  }
}

function buildUnsubscribeSmsBody(args: Parameters<typeof buildUnsubscribeBody>[0]): Record<string, unknown> {
  const body = buildUnsubscribeBody(args)
  delete body.businessName
  delete body.smsCode
  delete body.busiReturnEffTime
  delete body.instanceId
  return { ...body, busType: '1', productName: businessProductName(args.business), effectiveType: unsubscribeEffectiveType(args.business, args.effectiveTimeType) }
}

function missingUnsubscribeParameters(body: Record<string, unknown>): string[] {
  const missing: string[] = []
  if (!String(body.cellNum || '').trim()) missing.push('cellNum（手机号）')
  const productType = String(body.productType || '')
  if (!productType) missing.push('productType（codeType/bunessType）')
  if (productType === '01' && !String(body.productId || '').trim()) missing.push('productId（productCode/bunessCode）')
  if (productType === '02') {
    if (!String(body.spid || '').trim()) missing.push('spid（sPCode/spid）')
    if (!String(body.bizCode || '').trim()) missing.push('bizCode（业务编码）')
  }
  return missing
}

export async function queryUnsubscribeStatus(args: {
  cookie: string
  business: Record<string, unknown>
  phone?: string
}): Promise<CmccBusinessResult> {
  const phone = resolvePhone({ phone: args.phone, business: args.business })
  return postBusinessApi({
    url: `${APP_ORIGIN}/biz-orange/BH/unifyQueryService/getUnifyQuery`,
    body: {
      cellNum: phone,
      bindedFlag: args.business.bindedFlag || '2',
      instanceId: args.business.instanceId || '',
    },
    cookie: args.cookie,
    phone,
    city: String(args.business.city || '010'),
    includePageMeta: true,
    // This endpoint accepts the existing Cookie session with x-qen: 1.
    // The BasicService 17 route table does not prove gateway compatibility.
  })
}

export async function sendUnsubscribeSms(args: {
  cookie: string
  business: Record<string, unknown>
  phone?: string
  effectiveTimeType?: string
  idOverride?: BusinessIdOverride
}): Promise<CmccBusinessResult> {
  const business = args.business
  const phone = resolvePhone({ phone: args.phone, business })
  const body = buildUnsubscribeSmsBody({ ...args, phone })
  const missing = missingUnsubscribeParameters(body)
  if (missing.length) return { ok: false, status: 'BAD_REQUEST', message: `缺少退订必要参数：${missing.join('、')}，未发送验证码` }
  return postBusinessApi({
    url: `${APP_ORIGIN}/biz-orange/BH/sms/getSmsCode`,
    body,
    cookie: args.cookie,
    phone,
    city: String(business.city || '010'),
    includePageMeta: true,
    // Keep SMS on the verified x-qen: 1 contract, independently of cancel submission.
  })
}

export async function sendMainPlanWithdrawSms(args: {
  cookie: string
  business: Record<string, unknown>
  phone?: string
  flowKey?: string
  idOverride?: BusinessIdOverride
}): Promise<CmccBusinessResult> {
  const business = args.business
  const phone = resolvePhone({ phone: args.phone, business })
  const flowKey = args.flowKey || crypto.randomUUID()
  const planId = mainPlanIdForRequest(business, args.idOverride)
  if (!planId) {
    return { ok: false, status: 'BAD_REQUEST', message: '缺少主套餐 planId，无法发送撤销验证码' }
  }
  return postBusinessApi({
    url: `${APP_ORIGIN}/biz-orange/BH/sms/getSmsCode`,
    body: {
      cellNum: phone,
      busType: '2',
      productName: businessProductName(business),
      effectiveType: '4',
      planId,
    },
    cookie: args.cookie,
    phone,
    prov: String(business.prov || business.province || '100'),
    city: String(business.city || business.cityCode || '010'),
    includePageMeta: true,
    xk: flowKey,
  })
}

export async function withdrawMainPlan(args: {
  cookie: string
  business: Record<string, unknown>
  smsCode: string
  phone?: string
  flowKey?: string
  idOverride?: BusinessIdOverride
}): Promise<CmccBusinessResult> {
  const business = args.business
  const phone = resolvePhone({ phone: args.phone, business })
  const planId = mainPlanIdForRequest(business, args.idOverride)
  if (!planId) {
    return { ok: false, status: 'BAD_REQUEST', message: '缺少主套餐 planId，无法撤销' }
  }
  return postBusinessApi({
    url: `${APP_ORIGIN}/biz-orange/BN/updatePlanService/updatePlan`,
    body: {
      cellNum: phone,
      planId,
      smsCode: args.smsCode,
      flag: '0',
    },
    cookie: args.cookie,
    phone,
    prov: String(business.prov || business.province || '100'),
    city: String(business.city || business.cityCode || '010'),
    includePageMeta: true,
    xk: args.flowKey,
  })
}

export async function unsubscribeBusiness(args: {
  cookie: string
  business: Record<string, unknown>
  smsCode: string
  phone?: string
  effectiveTimeType?: string
  currentNum?: Record<string, unknown>
  planType?: string
  idOverride?: BusinessIdOverride
}): Promise<CmccBusinessResult> {
  const business = args.business
  const phone = resolvePhone({ phone: args.phone, business })
  const body = buildUnsubscribeBody({ ...args, phone })
  const missing = missingUnsubscribeParameters(body)
  if (missing.length) return { ok: false, status: 'BAD_REQUEST', message: `缺少退订必要参数：${missing.join('、')}，未提交退订` }
  const numberPayload =
    args.currentNum && typeof args.currentNum === 'object'
      ? {
          busiID: args.currentNum.busiID || '',
          busiValue: args.currentNum.originBusiValue || args.currentNum.busiValue || '',
        }
      : {}
  return postBusinessApi({
    url: `${APP_ORIGIN}/biz-orange/BH/unifyCancelServiceh5/getUnifyCancel`,
    body: {
      ...body,
      ...numberPayload,
    },
    cookie: args.cookie,
    phone,
    city: String(business.city || '010'),
    includePageMeta: true,
    h5Protocol: true,
  })
}

import crypto from 'node:crypto'
import { aesDecrypt, aesEncrypt } from './cmccCrypto.js'
import { httpsRequestText, type HttpResponse } from './cmccHttp.js'
import { buildCookieHeader, mergeCookieWithSetCookie, parseCookieHeader } from './cookieUtils.js'
import { formatUpstreamErrorMessage } from '../../shared/upstreamErrorMessage.js'

const ORIGIN = 'https://wx.10086.cn'
const PAGE = `${ORIGIN}/website/spa/main/alreadyService/index`
const HOME = `${ORIGIN}/website/spa/main/newHome`
const TTL = 30 * 60_000
const UA = 'Mozilla/5.0 (iPad; CPU OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148/wkwebview leadeon/12.5.5/CMCCIT'
const WIRE_HEADER = 'ZS93dUFVa2kzaEpQSjM0SG55MUFDdz09'
export const LEGACY_CATEGORIES = [
  { type: '01', label: '我的套餐' }, { type: '02', label: '增值业务' },
  { type: '03', label: '基础服务' }, { type: '04', label: '活动' },
]
type Obj = Record<string, unknown>
const obj = (v: unknown): Obj => v && typeof v === 'object' && !Array.isArray(v) ? v as Obj : {}
const str = (v: unknown) => v == null ? '' : String(v)

export class LegacyBusinessError extends Error {
  constructor(message: string, public code = 'UPSTREAM_ERROR', public status = 502) { super(message) }
}
export type LegacyBusiness = {
  id: string; queryType: string; name: string; productCode: string; fee: string
  detail: string; orderedAt: string; startsAt: string; expiresAt: string
  canUnsubscribe: boolean; status: string; hasContract: boolean; isMain: boolean
}
type StoredBusiness = LegacyBusiness & { raw: Obj }
export type LegacyGroup = { type: string; label: string; items: LegacyBusiness[]; queriedAt: string; error?: string }
type Session = {
  id: string; accountId: string; phone: string; cookie: string; csrf: string; province: string
  updatedAt: number; businesses: Map<string, StoredBusiness>; groups: Map<string, LegacyGroup>
  queryMode: 'post' | 'get'; categories: { type: string; label: string }[]
}
const sessions = new Map<string, Session>()
const locks = new Set<string>()
// Account-scoped: opening another tab/session must not bypass the SMS cooldown.
const smsSentAt = new Map<string, number>()
function cleanup() {
  for (const [id, s] of sessions) if (Date.now() - s.updatedAt > TTL) sessions.delete(id)
  for (const [key, time] of smsSentAt) if (Date.now() - time > TTL) smsSentAt.delete(key)
}
export function getLegacySession(id: string) { cleanup(); return sessions.get(id) }
export function publicLegacySession(s: Session) {
  return { id: s.id, accountId: s.accountId, phoneMasked: s.phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2') }
}
export async function withLegacyAccountLock<T>(accountId: string, work: () => Promise<T>): Promise<T> {
  if (locks.has(accountId)) throw new LegacyBusinessError('该账号正在处理旧版业务请求，请稍后重试', 'REQUEST_BUSY', 409)
  locks.add(accountId)
  try { return await work() } finally { locks.delete(accountId) }
}

// Read only the JSON assigned to user; never evaluate upstream HTML or JavaScript.
export function parseLegacyPageUser(html: string): Obj {
  const start = /\bvar\s+user\s*=\s*/.exec(html)
  if (!start) throw new LegacyBusinessError('旧版页面未返回登录信息，请重新登录 10086', 'SESSION_EXPIRED', 410)
  const tail = html.slice(start.index + start[0].length)
  let depth = 0, quoted = false, escaped = false
  for (let i = 0; i < tail.length; i++) {
    const ch = tail[i]
    if (quoted) { if (escaped) escaped = false; else if (ch === '\\') escaped = true; else if (ch === '"') quoted = false }
    else if (ch === '"') quoted = true
    else if (ch === '{') depth++
    else if (ch === '}' && --depth === 0) {
      try { return obj(JSON.parse(tail.slice(0, i + 1))) } catch { break }
    }
  }
  throw new LegacyBusinessError('旧版页面登录信息格式异常', 'INVALID_PAGE')
}

export function legacyRequestId(): string {
  return Date.now().toString(36) + '-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, ch => {
    const n = crypto.randomInt(16)
    return (ch === 'x' ? n : (n & 3) | 8).toString(8)
  })
}
export async function decodeLegacyResponse(response: Pick<HttpResponse, 'bodyText' | 'headers' | 'statusCode'>, requestId?: string, allowUnwrapped = false): Promise<Obj> {
  if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 401) {
    throw new LegacyBusinessError('10086 登录态已失效，请重新准备登录态', 'SESSION_EXPIRED', 410)
  }
  if (response.statusCode < 200 || response.statusCode >= 300 || /^\s*</.test(response.bodyText)) {
    throw new LegacyBusinessError(formatUpstreamErrorMessage(response.bodyText, response.statusCode).slice(0, 400), `UPSTREAM_HTTP_${response.statusCode}`)
  }
  let payload: Obj
  try {
    let text = response.bodyText.trim()
    if (String(response.headers.lrsbhbg8).toLowerCase() === 'true' || /^[\da-f]+$/i.test(text)) text = await aesDecrypt(text)
    const value: unknown = JSON.parse(text)
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('invalid object')
    payload = obj(value)
  } catch { throw new LegacyBusinessError('旧版接口响应无法解密或解析，未取得有效业务结果', 'INVALID_RESPONSE') }
  if (requestId && payload.id && payload.id !== requestId) throw new LegacyBusinessError('旧版接口响应标识不匹配，请重新查询', 'RESPONSE_MISMATCH')
  if (!(allowUnwrapped && payload.status == null) && !['0', '0000'].includes(str(payload.status))) {
    const code = str(payload.status)
    throw new LegacyBusinessError(formatUpstreamErrorMessage(str(payload.message) || '旧版接口请求失败'), code || 'UPSTREAM_ERROR', code === '401' ? 410 : 502)
  }
  const result = obj(payload.resultStatus)
  if (result.resultCode != null && Number(result.resultCode) !== 0) throw new LegacyBusinessError(str(result.resultDesc) || '业务查询失败', str(result.resultCode))
  return payload
}

async function request(s: Session, endpoint: string, body?: Obj, params?: Record<string, string>): Promise<Obj> {
  const id = legacyRequestId()
  const legacyGet = endpoint === 'queryAllBusiTabCfg' || endpoint === 'queryAllBusi'
  const query = new URLSearchParams({ ...(endpoint === 'queryAllBusiTabCfg' ? { istype: '1' } : {}), ...params, t: String(Date.now()) })
  const response = await httpsRequestText({
    url: `${ORIGIN}/website/alreadyService/${endpoint}?${query}`,
    method: body ? 'POST' : 'GET',
    headers: { 'User-Agent': UA, Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json',
      Origin: ORIGIN, Referer: PAGE, Cookie: s.cookie, 'Cache-Control': 'no-cache',
      'csrf-token': s.csrf, ...(legacyGet ? {} : { e76ccba5165fa9b4966ad82a0088e520: id, Lrsbhbg8: WIRE_HEADER }) },
    body: body ? JSON.stringify(body) : undefined, timeoutMs: 20_000,
  })
  s.cookie = mergeCookieWithSetCookie({ cookie: s.cookie, setCookie: response.headers['set-cookie'] }).cookie
  s.updatedAt = Date.now()
  return decodeLegacyResponse(response, legacyGet ? undefined : id, legacyGet)
}

async function verifiedPageUser(html: string, expectedPhone: string): Promise<Obj> {
  const user = parseLegacyPageUser(html)
  if (str(user.status) !== '1') throw new LegacyBusinessError('10086 登录态已失效，请重新登录', 'SESSION_EXPIRED', 410)
  let phone = str(user.telephone)
  if (user.wmhId) {
    try { phone = await aesDecrypt(str(user.wmhId)) } catch { /* verify masked telephone below */ }
  }
  const masked = expectedPhone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
  if (!phone || ![expectedPhone, masked].includes(phone)) {
    throw new LegacyBusinessError('旧版页面登录号码与所选账号不一致或已失效，请重新登录', 'ACCOUNT_MISMATCH', 410)
  }
  if (!user.csrf) throw new LegacyBusinessError('旧版页面缺少 CSRF 参数，请重新准备登录态', 'CSRF_REQUIRED', 410)
  return user
}

function checkPageResponse(response: HttpResponse) {
  if (response.statusCode === 401) throw new LegacyBusinessError('10086 登录态已失效，请重新登录', 'SESSION_EXPIRED', 410)
  if (response.statusCode !== 200) throw new LegacyBusinessError(
    `旧版业务页面访问失败：${formatUpstreamErrorMessage(response.bodyText, response.statusCode).slice(0, 300)}`,
    `UPSTREAM_HTTP_${response.statusCode}`)
}

const appLoginRequired = () => new LegacyBusinessError(
  '当前登录态未建立旧版 App 业务会话。需要有效的旧版 CK、原生中国移动 App CK（JSESSIONID、UID）或 App 单点 Token（getYDRZToken，sourceId=017018）；网页置换的 CMCC CK 不能替代。',
  'LEGACY_APP_LOGIN_REQUIRED', 409)

async function readLegacyEntry(args: { cookie: string; phone: string }) {
  let url = PAGE, cookie = args.cookie
  const visited = new Set<string>()
  for (let hop = 0; hop < 5; hop++) {
    if (visited.has(url)) throw new LegacyBusinessError('旧版业务入口发生循环跳转，请稍后重试', 'REDIRECT_LOOP')
    visited.add(url)
    const response = await httpsRequestText({ url, method: 'GET',
      headers: { 'User-Agent': UA, Accept: 'text/html', Cookie: cookie }, timeoutMs: 20_000 })
    cookie = mergeCookieWithSetCookie({ cookie, setCookie: response.headers['set-cookie'] }).cookie
    if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
      let next: URL
      try { next = new URL(str(response.headers.location), url) } catch {
        throw new LegacyBusinessError('旧版业务入口跳转地址异常', 'INVALID_REDIRECT')
      }
      if (!response.headers.location || next.origin !== ORIGIN || next.username || next.password) {
        throw new LegacyBusinessError('旧版业务入口返回非预期跳转，未转发登录凭据', 'INVALID_REDIRECT')
      }
      if (next.pathname === '/cmcc-service/app-pages/main/businessQuery') {
        // Verify identity, but never borrow HOME CSRF or switch to the modern API.
        const home = await httpsRequestText({ url: HOME, method: 'GET',
          headers: { 'User-Agent': UA, Accept: 'text/html', Cookie: cookie }, timeoutMs: 20_000 })
        checkPageResponse(home)
        await verifiedPageUser(home.bodyText, args.phone)
        throw appLoginRequired()
      }
      if (next.pathname.startsWith('/website/bind/')) throw new LegacyBusinessError('10086 登录态已失效，请重新登录', 'SESSION_EXPIRED', 410)
      if (![new URL(PAGE).pathname, '/website/alreadyService/index/new'].includes(next.pathname) &&
          !/^\/website\/api\/jumpApp\/redirect\/(?:undefined|\d+)\/alreadyService$/.test(next.pathname)) {
        throw new LegacyBusinessError('旧版业务入口返回未支持的跳转，请使用官方渠道查询', 'UNSUPPORTED_REDIRECT')
      }
      url = next.toString()
      continue
    }
    checkPageResponse(response)
    if (response.bodyText.includes('/website/sso/sessionAPP') || response.bodyText.includes('/website/sso/netUniAPP')) throw appLoginRequired()
    return { user: await verifiedPageUser(response.bodyText, args.phone), cookie }
  }
  throw new LegacyBusinessError('旧版业务入口跳转次数过多，请稍后重试', 'REDIRECT_LIMIT')
}

type LoginArgs = { cookie: string; phone: string; appCookie?: string; appToken?: string }
async function openLegacyPage(args: LoginArgs) {
  try { return await readLegacyEntry(args) }
  catch (error) {
    if (!(error instanceof LegacyBusinessError) || !['LEGACY_APP_LOGIN_REQUIRED', 'SESSION_EXPIRED'].includes(error.code)) throw error
    // Follow the official login-sync page's native App handshake. A PC SSO
    // JSESSIONID is not assumed valid; only an explicit upstream acceptance counts.
    const native = parseCookieHeader(args.appCookie || args.cookie)
    const tokenStr = buildCookieHeader(new Map(['JSESSIONID', 'UID', 'ticketID'].filter(k => native.has(k)).map(k => [k, native.get(k)!])))
    const methods = [
      ...(native.has('JSESSIONID') && native.has('UID') ? [{ endpoint: 'sessionAPP', parameter: 'tokenStr', credential: tokenStr + ';' }] : []),
      ...(args.appToken ? [{ endpoint: 'netUniAPP', parameter: 'leadeonToken', credential: args.appToken }] : []),
    ]
    if (!methods.length) throw error
    let cookie = args.cookie
    for (const method of methods) {
      const query = new URLSearchParams({ [method.parameter]: method.credential, currentUrl: PAGE })
      const response = await httpsRequestText({ url: `${ORIGIN}/website/sso/${method.endpoint}?${query}`, method: 'GET',
        headers: { Cookie: cookie, 'User-Agent': UA, Accept: 'application/json', Referer: PAGE }, timeoutMs: 20_000 })
      checkPageResponse(response)
      let result: Obj
      try { result = obj(JSON.parse(response.bodyText)) } catch { throw new LegacyBusinessError('旧版 App 单点登录响应格式异常', 'INVALID_SSO_RESPONSE') }
      cookie = mergeCookieWithSetCookie({ cookie, setCookie: response.headers['set-cookie'] }).cookie
      if (result.status !== true) continue
      // Ignore returnUrl: reopen only the fixed same-origin legacy page and
      // verify the selected phone before retaining CSRF or enabling mutations.
      return readLegacyEntry({ ...args, cookie })
    }
    throw appLoginRequired()
  }
}

export async function createLegacySession(args: LoginArgs & { accountId: string }): Promise<Session> {
  cleanup()
  const { user, cookie } = await openLegacyPage(args)
  const s: Session = { accountId: args.accountId, phone: args.phone, id: crypto.randomUUID(), csrf: str(user.csrf), province: str(user.provinceCode),
    cookie, queryMode: 'post', categories: LEGACY_CATEGORIES.filter(c => str(user.provinceCode) !== '898' || c.type !== '04'),
    updatedAt: Date.now(), businesses: new Map(), groups: new Map() }
  const cfg = await request(s, 'queryAllBusiTabCfg')
  if (str(cfg.close) === '1') throw new LegacyBusinessError('移动侧已关闭当前账号的旧版已订业务入口', 'LEGACY_CLOSED')
  if (str(cfg.status) === '0000' && str(cfg.close) !== '0') throw new LegacyBusinessError('旧版接口未明确开放业务查询', 'INVALID_LEGACY_CONFIG', 409)
  if (str(cfg.status) !== '0000') {
    if (!Array.isArray(cfg.data) || !cfg.data.length) throw new LegacyBusinessError('旧版接口未返回有效分类配置，尚未建立可查询的旧版会话', 'INVALID_LEGACY_CONFIG', 409)
    s.queryMode = 'get'
    s.categories = cfg.data.map(value => {
      const tab = obj(value)
      return { type: str(tab.queryType), label: str(tab.tabName), tabCode: str(tab.tabCode) }
    }).filter(tab => s.province !== '898' || tab.tabCode !== '06')
    if (!s.categories.length || s.categories.some(tab => !tab.type || !tab.label)) throw new LegacyBusinessError('旧版业务分类配置不完整', 'INVALID_LEGACY_CONFIG')
  }
  if (sessions.size >= 200) sessions.delete(sessions.keys().next().value!)
  sessions.set(s.id, s)
  return s
}

export function normalizeLegacyBusiness(raw: Obj, queryType: string, index: number): StoredBusiness {
  const id = crypto.createHash('sha256').update(JSON.stringify([queryType, raw.prodCode, raw.bizCode, raw.spId, raw.prodInstId, raw.InstanceId, index])).digest('hex').slice(0, 32)
  const isMain = str(raw.isMain) === '1', hasContract = str(raw.contractExist) === '1'
  return { id, queryType, name: str(raw.prodName) || '未命名业务', productCode: str(raw.prodCode), fee: str(raw.feeRule),
    detail: str(raw.busiDetail), orderedAt: str(raw.orderTime), startsAt: str(raw.startTime), expiresAt: str(raw.expireTime),
    isMain, hasContract, status: str(raw.status),
    canUnsubscribe: str(raw.canUnsub) === '1' && !isMain && !hasContract && str(raw.status) !== 'jt0', raw }
}
function publicBusiness(item: StoredBusiness): LegacyBusiness {
  const { id, queryType, name, productCode, fee, detail, orderedAt, startsAt, expiresAt,
    canUnsubscribe, status, hasContract, isMain } = item
  return { id, queryType, name, productCode, fee, detail, orderedAt, startsAt, expiresAt,
    canUnsubscribe, status, hasContract, isMain }
}
export async function queryLegacyBusinesses(s: Session): Promise<{ groups: LegacyGroup[]; errors: string[] }> {
  const errors: string[] = []
  for (const category of s.categories) {
    try {
      const payload = s.queryMode === 'get'
        ? await request(s, 'queryAllBusi', undefined, { queryType: category.type })
        : await request(s, 'queryAllBusiZ', { queryType: category.type })
      const data = s.queryMode === 'get' ? payload : obj(payload.data)
      if (!Array.isArray(data.busiList)) throw new LegacyBusinessError('接口未返回业务列表', 'INVALID_BUSINESS_LIST')
      if (!data.busiList.length && !str(data.oprTime)) throw new LegacyBusinessError('旧版接口返回空列表且无查询时间，未确认查询成功，请重新建立旧版登录态', 'LEGACY_CONTEXT_UNCONFIRMED', 409)
      const items = data.busiList.map((item, i) => normalizeLegacyBusiness(obj(item), category.type, i))
      // Update only the successfully queried category; failed categories retain earlier results.
      for (const [id, item] of s.businesses) if (item.queryType === category.type) s.businesses.delete(id)
      for (const item of items) s.businesses.set(item.id, item)
      s.groups.set(category.type, { ...category, items: items.map(publicBusiness), queriedAt: str(data.oprTime) })
    } catch (error) {
      if (error instanceof LegacyBusinessError && error.status === 410) throw error
      const message = error instanceof Error ? error.message : '查询失败'
      errors.push(`${category.label}：${message}`)
      const previous = s.groups.get(category.type)
      s.groups.set(category.type, { ...category, items: previous?.items || [], queriedAt: previous?.queriedAt || '', error: message })
    }
  }
  return { groups: [...s.groups.values()], errors }
}
function getTarget(s: Session, id: string): StoredBusiness {
  const item = s.businesses.get(id)
  if (!item) throw new LegacyBusinessError('业务不存在，请刷新查询后重新选择', 'BUSINESS_NOT_FOUND', 400)
  if (!item.canUnsubscribe) throw new LegacyBusinessError('该业务未开放旧版短信退订，请在官方渠道办理', 'UNSUBSCRIBE_UNAVAILABLE', 400)
  const missing = ['codeType', 'interfaceName'].filter(key => !str(item.raw[key]))
  if (!item.productCode && (!str(item.raw.spId) || !str(item.raw.bizCode))) missing.push('prodCode 或 spId/bizCode')
  if (missing.length) throw new LegacyBusinessError(`查询结果缺少退订参数：${missing.join('、')}`, 'MISSING_BUSINESS_FIELDS', 400)
  return item
}
function smsKey(s: Session, item: StoredBusiness): string {
  const raw = item.raw
  return `${s.accountId}:${crypto.createHash('sha256').update(JSON.stringify([raw.prodCode, raw.spId, raw.bizCode, raw.prodInstId, raw.InstanceId])).digest('hex')}`
}
export function buildLegacyTarget(raw: Obj): Obj {
  // prodInstId is a distinct wire field. Do not substitute InstanceId from query results.
  const body: Obj = { prodCode: raw.prodCode, bizCode: raw.bizCode, spId: raw.spId, codeType: raw.codeType,
    interfaceName: raw.interfaceName, prodName: raw.prodName, prodType: raw.prodType ?? '' }
  for (const key of ['isSPBusi', 'prodInstId']) if (raw[key] !== undefined) body[key] = raw[key]
  return body
}
export function readLegacyMutationResult(payload: Obj, kind: 'sms' | 'unsubscribe') {
  const data = obj(payload.data), rest = obj(data.restStatus), result = obj(data.data)
  if (str(data.status) === '6005') throw new LegacyBusinessError('您输入的验证码有误，请重新输入', '6005', 400)
  if (str(data.status) === '6003') throw new LegacyBusinessError('获取验证码过多，请明天再来', '6003', 429)
  if (data.status == null || Number(data.status) !== 0 || (rest.status != null && Number(rest.status) !== 0)) {
    throw new LegacyBusinessError(formatUpstreamErrorMessage(str(data.message || rest.message) || '移动侧未受理请求'), str(data.status || rest.status) || 'UPSTREAM_REJECTED', 400)
  }
  if (kind === 'sms') return { message: '验证码已发送', cooldownSeconds: 60 }
  if (str(result.retCode) !== '0') throw new LegacyBusinessError(formatUpstreamErrorMessage(str(result.retMsg) || '退订未成功，移动侧未返回成功结果'), str(result.retCode) || 'UNSUBSCRIBE_FAILED', 400)
  return { message: str(result.retMsg) || '退订成功', cancelledAt: str(result.cancleTime) }
}
export async function sendLegacyUnsubscribeSms(s: Session, businessId: string) {
  const item = getTarget(s, businessId), key = smsKey(s, item)
  const remaining = Math.ceil(((smsSentAt.get(key) || 0) + 60_000 - Date.now()) / 1000)
  if (remaining > 0) throw new LegacyBusinessError(`请 ${remaining} 秒后再获取验证码`, 'SMS_COOLDOWN', 429)
  if (['871', '371', '891'].includes(s.province)) {
    const checked = await request(s, 'cancelPreCheck', buildLegacyTarget(item.raw))
    if (str(checked.checkResult ?? obj(checked.data).checkResult) !== 'Y') throw new LegacyBusinessError('移动侧预校验未通过，该业务需要联系客服办理退订', 'PRECHECK_REJECTED', 400)
  }
  const payload = await request(s, 'contractSendCode', { prodName: item.name, prodCode: item.productCode || str(item.raw.spId) + str(item.raw.bizCode) })
  const result = readLegacyMutationResult(payload, 'sms')
  smsSentAt.set(key, Date.now())
  return result
}
export async function unsubscribeLegacyBusiness(s: Session, businessId: string, smsCode: string) {
  const item = getTarget(s, businessId)
  if (!/^\d{6}$/.test(smsCode)) throw new LegacyBusinessError('请输入 6 位短信验证码', 'INVALID_SMS_CODE', 400)
  if (!smsSentAt.has(smsKey(s, item))) throw new LegacyBusinessError('请先发送该业务的退订验证码', 'SMS_REQUIRED', 400)
  const payload = await request(s, 'testToUnsubscribe', { ...buildLegacyTarget(item.raw), password: await aesEncrypt(smsCode), passWordType: '02' })
  const result = readLegacyMutationResult(payload, 'unsubscribe')
  item.canUnsubscribe = false
  item.status = 'jt0'
  const group = s.groups.get(item.queryType)
  const displayed = group?.items.find(b => b.id === item.id)
  if (displayed) { displayed.canUnsubscribe = false; displayed.status = 'jt0' }
  smsSentAt.delete(smsKey(s, item))
  return result
}

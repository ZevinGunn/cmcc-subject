import { httpsRequestText } from './cmccHttp.js'
import { mergeCookieWithSetCookie } from './cookieUtils.js'
import type { AigouSessionRecord } from './accountsStore.js'

const DEFAULT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'
const AIGOU_ORIGIN = 'https://dev.coc.10086.cn'
const AIGOU_PATH = '/coc3/canvas/rightsmarket-h5-canvas/online/wdqy'
const AIGOU_CHANNEL_CODE = 'P00000011455'
const AIGOU_LOGIN_URL = `${AIGOU_ORIGIN}/coc3/gr/login/ssoRights/userLoginV2`
const AIGOU_VALIDATE_URL = `${AIGOU_ORIGIN}/coc3/gr/login/specialRightsSso/codeEncryptPhone`

export type AigouStep = {
  name: string
  status: number
  cookieUpdated: boolean
}

export type AigouSsoLinkResult = {
  ok: boolean
  status?: number
  errorCode?: string
  message?: string
  ssoUrl?: string
  cookie?: string
  cookieUpdated?: boolean
  steps: AigouStep[]
}

export type AigouExchangeResult = AigouSsoLinkResult & {
  session?: AigouSessionRecord
  baseCookie?: string
  baseCookieUpdated?: boolean
}

type JsonRecord = Record<string, unknown>

function asRecord(value: unknown): JsonRecord | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as JsonRecord
    : undefined
}

function text(value: unknown): string {
  return value === undefined || value === null ? '' : String(value).trim()
}

function parseJson(textValue: string): JsonRecord | undefined {
  try {
    return asRecord(JSON.parse(textValue) as unknown)
  } catch {
    return undefined
  }
}

function safeAigouLoginUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:' || url.hostname !== 'dev.coc.10086.cn') return undefined
    if (url.pathname !== AIGOU_PATH) return undefined
    if (url.searchParams.get('channelCode') !== AIGOU_CHANNEL_CODE) return undefined
    if (!url.searchParams.get('token')) return undefined
    return url.toString()
  } catch {
    return undefined
  }
}

export function buildAigouSsoEntryUrl(): string {
  const backUrl = new URL(AIGOU_PATH, AIGOU_ORIGIN)
  backUrl.searchParams.set('channelCode', AIGOU_CHANNEL_CODE)
  const entry = new URL('https://wx.10086.cn/website/bind/bindAccount/new')
  entry.searchParams.set('tokenKey', 'token')
  entry.searchParams.set('netUniChannelId', '056002')
  entry.searchParams.set('netUniBackUrl', backUrl.toString())
  entry.searchParams.set('ys', '')
  entry.searchParams.set('yx', '')
  entry.searchParams.set('touch_id', '')
  return entry.toString()
}

export async function buildAigouSsoLinkFrom10086Cookie(cookie: string): Promise<AigouSsoLinkResult> {
  const entryUrl = buildAigouSsoEntryUrl()
  const response = await httpsRequestText({
    url: entryUrl,
    method: 'GET',
    headers: {
      Cookie: cookie,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      Referer: 'https://wx.10086.cn/',
      'User-Agent': DEFAULT_UA,
    },
    timeoutMs: 15000,
  })
  const merged = mergeCookieWithSetCookie({ cookie, setCookie: response.headers['set-cookie'] })
  const location = Array.isArray(response.headers.location)
    ? response.headers.location[0]
    : response.headers.location
  const ssoUrl = safeAigouLoginUrl(location)
  const ok = response.statusCode >= 300 && response.statusCode < 400 && Boolean(ssoUrl)
  const loginPage = response.statusCode === 200 && /<title>\s*(?:中国移动)?\s*登录\s*<\/title>/i.test(response.bodyText)
  let loginRedirect = false
  if (location) {
    try {
      const url = new URL(location, entryUrl)
      loginRedirect = url.hostname === 'wx.10086.cn' && url.pathname === '/website/bind/bindAccount/new'
    } catch { /* 非法跳转不作为登录态失效的证据 */ }
  }
  const errorCode = ok ? undefined : loginPage || loginRedirect ? 'COOKIE_INVALID'
    : response.statusCode >= 400 ? 'SSO_UPSTREAM_HTTP' : 'SSO_UNEXPECTED_RESPONSE'
  const message = ok ? undefined : errorCode === 'COOKIE_INVALID'
    ? '10086 登录态已失效或不完整，移动返回了登录页，请重新使用 10086 登录或导入 wx.10086.cn 的完整 CK'
    : `10086 跳转票据获取失败（HTTP ${response.statusCode}），未取得有效 Token，请稍后重试`
  return {
    ok,
    status: response.statusCode,
    errorCode,
    message,
    ssoUrl,
    cookie: merged.cookie,
    cookieUpdated: merged.changed,
    steps: [{ name: '10086_TO_AIGOU', status: response.statusCode, cookieUpdated: merged.changed }],
  }
}

export async function validateAigouSession(session: AigouSessionRecord): Promise<{
  ok: boolean
  status: number
  message?: string
  cookie?: string
}> {
  if (!session.cookie || !session.token || !session.refreshToken) {
    return { ok: false, status: 0, message: '爱购商城凭证字段不完整' }
  }
  const response = await httpsRequestText({
    url: `${AIGOU_VALIDATE_URL}?t=${Date.now()}`,
    method: 'GET',
    headers: {
      Cookie: session.cookie,
      phone: session.token,
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      Origin: AIGOU_ORIGIN,
      Referer: session.loginUrl,
      'User-Agent': DEFAULT_UA,
    },
    timeoutMs: 15000,
  })
  const payload = parseJson(response.bodyText)
  const merged = mergeCookieWithSetCookie({
    cookie: session.cookie,
    setCookie: response.headers['set-cookie'],
  })
  const ok = response.statusCode === 200 && text(payload?.code) === '0' && Boolean(text(payload?.data))
  return {
    ok,
    status: response.statusCode,
    message: ok ? undefined : text(payload?.message) || '爱购商城凭证验活失败',
    cookie: merged.cookie,
  }
}

export async function exchange10086CookieToAigou(cookie: string): Promise<AigouExchangeResult> {
  const link = await buildAigouSsoLinkFrom10086Cookie(cookie)
  if (!link.ok || !link.ssoUrl || !link.cookie) return { ...link }

  let aigouCookie = link.cookie
  const steps = [...link.steps]
  const pageResponse = await httpsRequestText({
    url: link.ssoUrl,
    method: 'GET',
    headers: {
      Cookie: aigouCookie,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      Referer: 'https://wx.10086.cn/',
      'User-Agent': DEFAULT_UA,
    },
    timeoutMs: 15000,
  })
  const pageMerged = mergeCookieWithSetCookie({
    cookie: aigouCookie,
    setCookie: pageResponse.headers['set-cookie'],
  })
  aigouCookie = pageMerged.cookie
  steps.push({ name: 'AIGOU_PAGE', status: pageResponse.statusCode, cookieUpdated: pageMerged.changed })

  const ticket = new URL(link.ssoUrl).searchParams.get('token') || ''
  const loginResponse = await httpsRequestText({
    url: AIGOU_LOGIN_URL,
    method: 'POST',
    headers: {
      Cookie: aigouCookie,
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
      Origin: AIGOU_ORIGIN,
      Referer: link.ssoUrl,
      'User-Agent': DEFAULT_UA,
    },
    body: JSON.stringify({
      ticket,
      ticketType: 8,
      businessType: 'RIGHTS_MARKET',
      wxoaType: '',
      m1: '',
      m2: '',
      s1: '',
      s2: '',
      from: '',
    }),
    timeoutMs: 15000,
  })
  const loginMerged = mergeCookieWithSetCookie({
    cookie: aigouCookie,
    setCookie: loginResponse.headers['set-cookie'],
  })
  aigouCookie = loginMerged.cookie
  steps.push({ name: 'AIGOU_USER_LOGIN', status: loginResponse.statusCode, cookieUpdated: loginMerged.changed })
  const payload = parseJson(loginResponse.bodyText)
  const data = asRecord(payload?.data)
  const token = text(data?.token)
  const refreshToken = text(data?.refreshToken)
  if (loginResponse.statusCode !== 200 || text(payload?.code) !== '0' || !token || !refreshToken) {
    return {
      ...link,
      ok: false,
      status: loginResponse.statusCode,
      message: text(payload?.message) || '10086 CK 未能置换为爱购商城 Token',
      steps,
      baseCookie: link.cookie,
      baseCookieUpdated: link.cookieUpdated,
    }
  }
  const session: AigouSessionRecord = {
    cookie: aigouCookie,
    token,
    refreshToken,
    loginUrl: link.ssoUrl,
    mobileMask: text(data?.mobileMask) || undefined,
    encryMobile: text(data?.encryMobile) || undefined,
    provinceCode: text(data?.provinceCode) || undefined,
    cityCode: text(data?.cityCode) || undefined,
    numberNet: text(data?.numberNet) || undefined,
  }
  const validated = await validateAigouSession(session)
  steps.push({
    name: 'AIGOU_VALIDATE',
    status: validated.status,
    cookieUpdated: Boolean(validated.cookie && validated.cookie !== session.cookie),
  })
  if (!validated.ok) {
    return {
      ...link,
      ok: false,
      status: validated.status,
      message: validated.message,
      steps,
      baseCookie: link.cookie,
      baseCookieUpdated: link.cookieUpdated,
    }
  }
  session.cookie = validated.cookie || session.cookie
  return {
    ...link,
    ok: true,
    status: validated.status,
    message: '已置换并验证爱购商城凭证',
    session,
    steps,
    baseCookie: link.cookie,
    baseCookieUpdated: link.cookieUpdated,
  }
}

export const __test__ = {
  safeAigouLoginUrl,
}

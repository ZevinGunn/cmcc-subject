import { httpsRequestText } from './cmccHttp.js'
import { assertQqtActivitySuccess, currentQqtActivitySignState, readQqtSignDays, verifyQqtActivityState } from './qqtActivityState.js'
import {
  mergeCookieWithSetCookie,
  parseSetCookieToPairs,
} from './cookieUtils.js'

const QQT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'

const QQT_INDEX_PAGE =
  'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/index2.html'
const QQT_INDEX_PAGE_WITH_SSPID = `${QQT_INDEX_PAGE}?sspId=66411`
const QQT_SSO_LOGIN =
  'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/new/ssoTokenLogin.action'
const QQT_XDR_NORMAL_PAGE =
  'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/xdrNormal.html'

const BIND_URL = `https://wx.10086.cn/website/bind/bindAccount/new?netUniChannelId=001191&tokenKey=token&netUniBackUrl=${encodeURIComponent(
  `${QQT_SSO_LOGIN}?backUrl=${encodeURIComponent(QQT_INDEX_PAGE_WITH_SSPID)}`,
)}&ys=&yx=&touch_id=`

const QQT_INFO_URL =
  'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/member/func/queryVipLevel.do'
const QQT_XDR_RECEIVE_URL =
  'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/member/func/queryIndexReceive.do'
const QQT_SIGN_INFO_URL = 'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/sign/info'
const QQT_SIGN_URL = 'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/sign/sign'
const QQT_SIGN_ACCEPT_URL =
  'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/sign/toaccept'
function sanitizeQqtUrl(raw: string): string {
  return raw.replace(/&amp;/g, '&').replace(/[).,;"'<>]+$/g, '')
}

function extractQqtUrl(html: string): string | undefined {
  const match = html.match(
    /https:\/\/qqt\.cmicrwx\.cn\/[^\s"'<>]+ssoTokenLogin\.action[^\s"'<>]+/,
  )
  if (!match) return undefined
  return sanitizeQqtUrl(match[0])
}

function safeQqtSsoUrl(raw: string): string | undefined {
  try {
    const url = new URL(sanitizeQqtUrl(raw))
    if (url.protocol !== 'https:' || url.hostname !== 'qqt.cmicrwx.cn') return undefined
    if (url.pathname !== '/2016tyjf/xhmqqthy/new/ssoTokenLogin.action') return undefined
    if (!url.searchParams.get('token')) return undefined
    return url.toString()
  } catch {
    return undefined
  }
}

function summarizeText(text: string): string {
  const trimmed = text.trim()
  if (!trimmed) return ''
  return trimmed.length > 240 ? `${trimmed.slice(0, 240)}...` : trimmed
}

function mergeHeaderOverrides(
  base: Record<string, string>,
  custom?: Record<string, string>,
  protectedKeys?: string[],
): Record<string, string> {
  if (!custom || Object.keys(custom).length === 0) return base
  const protectedSet = new Set(
    (protectedKeys ?? []).map((k) => k.toLowerCase()),
  )
  const out: Record<string, string> = { ...base }
  for (const [k, v] of Object.entries(custom)) {
    const key = k.trim()
    if (!key) continue
    const lower = key.toLowerCase()
    if (protectedSet.has(lower)) continue
    for (const existing of Object.keys(out)) {
      if (existing.toLowerCase() === lower) {
        delete out[existing]
      }
    }
    out[key] = v
  }
  return out
}

function safeJson(bodyText: string): unknown {
  try {
    return JSON.parse(bodyText)
  } catch {
    return { raw: bodyText }
  }
}

function extractMessage(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') return undefined
  const obj = payload as Record<string, unknown>
  const msg =
    typeof obj.msg === 'string'
      ? obj.msg
      : typeof obj.message === 'string'
        ? obj.message
        : undefined
  if (msg) return msg
  const data = obj.data
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const dataObj = data as Record<string, unknown>
    if (typeof dataObj.msg === 'string') return dataObj.msg
    if (typeof dataObj.message === 'string') return dataObj.message
  }
  return undefined
}

function isAuthInvalidMessage(message?: string): boolean {
  if (!message) return false
  if (message.includes('未登录')) return true
  if (message.includes('请先登录')) return true
  if (message.includes('登录失效')) return true
  if (message.includes('重新登录')) return true
  if (message.includes('授权')) return true
  if (message.includes('非法')) return true
  return false
}

function logQqtBody(tag: string, bodyText: string): void {
  const normalized = bodyText.trim()
  const preview =
    normalized.length > 1200 ? `${normalized.slice(0, 1200)}...` : normalized
  console.log(`[qqt] ${tag} body ${preview}`)
}

type QqtSignPrize = {
  dayNum: number
  prizeId: string
  prizeName?: string
}

function extractPendingSignPrizes(info: unknown): QqtSignPrize[] {
  if (!info || typeof info !== 'object') return []
  const obj = info as Record<string, unknown>
  const data = obj.data
  if (!data || typeof data !== 'object' || Array.isArray(data)) return []
  const dataObj = data as Record<string, unknown>
  const signDates = dataObj.signDates
  if (!Array.isArray(signDates)) return []
  const prizes: QqtSignPrize[] = []
  for (const item of signDates) {
    if (!item || typeof item !== 'object') continue
    const rec = item as Record<string, unknown>
    const signStatus = Number(rec.signStatus)
    if (signStatus !== 1) continue
    const dayNum = Number(rec.dayNum)
    if (!Number.isFinite(dayNum)) continue
    const newPrize = rec.newPrize
    if (!newPrize || typeof newPrize !== 'object') continue
    const prizeObj = newPrize as Record<string, unknown>
    const prizeStatus = Number(prizeObj.prizeStatus)
    if (prizeStatus !== 0) continue
    const prizeIdRaw = prizeObj.prizeId
    const prizeId = typeof prizeIdRaw === 'string' ? prizeIdRaw : ''
    if (!prizeId) continue
    const prizeName =
      typeof prizeObj.prizeName === 'string' ? prizeObj.prizeName : undefined
    prizes.push({ dayNum, prizeId, prizeName })
  }
  return prizes
}

async function prewarmQqtUserInfo(sessionCookie: string): Promise<void> {
  const body = new URLSearchParams({ sspId: '', tag: 'qqtindex' }).toString()
  try {
    const res = await httpsRequestText({
      url: QQT_INFO_URL,
      method: 'POST',
      headers: {
        Cookie: sessionCookie,
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        Origin: 'https://qqt.cmicrwx.cn',
        Referer: QQT_INDEX_PAGE,
        'User-Agent': QQT_UA,
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      body,
      timeoutMs: 10000,
    })
    logQqtBody('prewarm', res.bodyText)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'prewarm failed'
    console.log(`[qqt] prewarm error ${msg}`)
  }
}

async function fetchQqtSsoEntry(args: {
  cmccCookie: string
  requestHeaders?: Record<string, string>
}): Promise<{
  ok: boolean
  status?: number
  message?: string
  ssoUrl?: string
  ssoToken?: string
}> {
  const baseHeaders = {
    Cookie: args.cmccCookie,
    Referer: 'https://wx.10086.cn/website/bind/bindAccount/new',
    Origin: 'https://wx.10086.cn',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'User-Agent': QQT_UA,
  }
  const headers = mergeHeaderOverrides(baseHeaders, args.requestHeaders, [
    'cookie',
    'referer',
    'origin',
  ])
  const res = await httpsRequestText({
    url: BIND_URL,
    method: 'GET',
    headers,
    timeoutMs: 10000,
  })

  if (res.statusCode < 200 || res.statusCode >= 400) {
    return {
      ok: false,
      status: res.statusCode,
      message: `Upstream HTTP ${res.statusCode}: ${summarizeText(res.bodyText)}`,
    }
  }

  const headerLocation = res.headers.location
    ? resolveRedirectUrl(BIND_URL, String(res.headers.location))
    : undefined
  const qqtUrl = safeQqtSsoUrl(headerLocation || '') || safeQqtSsoUrl(extractQqtUrl(res.bodyText) || '')
  if (!qqtUrl) {
    return {
      ok: false,
      status: res.statusCode,
      message: '未解析到安全有效的全球通专区 SSO URL',
    }
  }

  let ssoToken: string | undefined
  try {
    const url = new URL(qqtUrl)
    const token = url.searchParams.get('token')
    if (token) ssoToken = token
  } catch {
    // ignore
  }

  return { ok: true, status: res.statusCode, ssoUrl: qqtUrl, ssoToken }
}

export async function buildQqtSsoLink(args: {
  cmccCookie: string
  requestHeaders?: Record<string, string>
}): Promise<{
  ok: boolean
  status?: number
  message?: string
  ssoUrl?: string
  ssoToken?: string
}> {
  return fetchQqtSsoEntry(args)
}

async function fetchQqtAccessToken(args: {
  cmccCookie: string
  requestHeaders?: Record<string, string>
}): Promise<{
  ok: boolean
  status?: number
  message?: string
  accessToken?: string
  ssoToken?: string
  ssoUrl?: string
}> {
  const entry = await fetchQqtSsoEntry(args)
  if (!entry.ok || !entry.ssoUrl) return entry

  let url = entry.ssoUrl
  let cookie = ''
  let lastStatus = 0
  for (let step = 0; step < 5; step += 1) {
    const tokenRes = await httpsRequestText({
      url,
      method: 'GET',
      headers: mergeHeaderOverrides({
        ...(cookie ? { Cookie: cookie } : {}),
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        Referer: entry.ssoUrl,
        'User-Agent': QQT_UA,
      }, args.requestHeaders, ['cookie', 'host']),
      timeoutMs: 10000,
    })
    lastStatus = tokenRes.statusCode
    const location = Array.isArray(tokenRes.headers.location)
      ? tokenRes.headers.location[0] || ''
      : String(tokenRes.headers.location || '')
    const accessToken = extractQqtAccessToken({
      setCookie: tokenRes.headers['set-cookie'],
      location,
      bodyText: tokenRes.bodyText,
    })
    if (accessToken) {
      return {
        ok: true,
        status: tokenRes.statusCode,
        accessToken,
        ssoToken: entry.ssoToken,
        ssoUrl: entry.ssoUrl,
      }
    }
    cookie = mergeCookieWithSetCookie({ cookie, setCookie: tokenRes.headers['set-cookie'] }).cookie
    if (tokenRes.statusCode < 300 || tokenRes.statusCode >= 400 || !location) break
    const nextUrl = resolveRedirectUrl(url, location)
    if (!nextUrl || !nextUrl.startsWith('https://qqt.cmicrwx.cn/')) break
    url = nextUrl
  }

  return {
    ok: false,
    status: lastStatus || undefined,
    message: '全球通登录未返回有效 Token',
  }
}

function resolveRedirectUrl(baseUrl: string, location: string): string {
  if (!location) return ''
  if (location.startsWith('http://') || location.startsWith('https://')) {
    return location
  }
  try {
    return new URL(location, baseUrl).toString()
  } catch {
    return ''
  }
}

function extractAccessTokenFromPayload(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') return undefined
  const obj = payload as Record<string, unknown>
  for (const key of ['access_token', 'accessToken']) {
    const value = obj[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  for (const value of Object.values(obj)) {
    const nested = extractAccessTokenFromPayload(value)
    if (nested) return nested
  }
  return undefined
}

function extractQqtAccessToken(args: {
  setCookie?: string | string[]
  location?: string
  bodyText?: string
}): string | undefined {
  const fromCookie = parseSetCookieToPairs(args.setCookie).get('access_token')
  if (fromCookie) return fromCookie
  if (args.location) {
    try {
      const fromLocation = new URL(args.location, QQT_SSO_LOGIN).searchParams.get('access_token')
      if (fromLocation?.trim()) return fromLocation.trim()
    } catch {
      // Ignore malformed redirect locations.
    }
  }
  const bodyText = String(args.bodyText || '').trim()
  if (!bodyText) return undefined
  try {
    const fromPayload = extractAccessTokenFromPayload(JSON.parse(bodyText) as unknown)
    if (fromPayload) return fromPayload
  } catch {
    // Some upstream responses embed the token in HTML or script text.
  }
  const match = bodyText.match(/(?:access_token|accessToken)["'\s]*[:=]["'\s]*([^"'&\s<>,;}]+)/i)
  return match?.[1]?.trim() || undefined
}

async function buildQqtSessionCookie(accessToken: string): Promise<{
  ok: boolean
  status?: number
  message?: string
  cookie: string
}> {
  const baseCookie = `access_token=${accessToken}`
  const headers = {
    Cookie: baseCookie,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'User-Agent': QQT_UA,
  }

  let cookie = baseCookie
  let lastStatus = 0
  let lastBody = ''
  let url = QQT_INDEX_PAGE_WITH_SSPID
  for (let step = 0; step < 2; step += 1) {
    const res = await httpsRequestText({
      url,
      method: 'GET',
      headers: {
        ...headers,
        Cookie: cookie,
      },
      timeoutMs: 10000,
    })

    lastStatus = res.statusCode
    lastBody = res.bodyText
    const merged = mergeCookieWithSetCookie({
      cookie,
      setCookie: res.headers['set-cookie'],
    })
    cookie = merged.cookie

    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      const nextUrl = resolveRedirectUrl(url, String(res.headers.location))
      if (!nextUrl) break
      url = nextUrl
      continue
    }
    break
  }

  const ok = lastStatus >= 200 && lastStatus < 400
  return {
    ok,
    status: lastStatus,
    message: ok
      ? undefined
      : `Upstream HTTP ${lastStatus}: ${summarizeText(lastBody)}`,
    cookie,
  }
}

async function prepareQqtSession(args: {
  cmccCookie: string
  requestHeaders?: Record<string, string>
  accessToken?: string
}): Promise<{
  ok: boolean
  status?: number
  message?: string
  accessToken?: string
  sessionCookie?: string
  ssoToken?: string
  ssoUrl?: string
}> {
  let accessToken = args.accessToken?.trim()
  let ssoToken: string | undefined = undefined
  let ssoUrl: string | undefined
  if (!accessToken) {
    const tokenRes = await fetchQqtAccessToken({
      cmccCookie: args.cmccCookie,
      requestHeaders: args.requestHeaders,
    })
    if (!tokenRes.ok || !tokenRes.accessToken) {
      return {
        ok: false,
        status: tokenRes.status,
        message: tokenRes.message || 'access_token 获取失败',
      }
    }
    accessToken = tokenRes.accessToken
    ssoToken = tokenRes.ssoToken
    ssoUrl = tokenRes.ssoUrl
  }

  const session = await buildQqtSessionCookie(accessToken)
  if (!session.ok) {
    return {
      ok: false,
      status: session.status,
      message: session.message || 'QQT 会话预热失败',
    }
  }

  return {
    ok: true,
    status: session.status,
    accessToken,
    sessionCookie: session.cookie,
    ssoToken,
    ssoUrl,
  }
}

export type QqtPreparedSession = {
  ok: boolean
  status?: number
  message?: string
  accessToken?: string
  sessionCookie?: string
  ssoToken?: string
  ssoUrl?: string
}

export async function prepareQqtApiSession(args: {
  cmccCookie: string
  requestHeaders?: Record<string, string>
  accessToken?: string
}): Promise<QqtPreparedSession> {
  return prepareQqtSession(args)
}

export type QqtTokenResult = {
  ok: boolean
  status?: number
  message?: string
  accessToken?: string
  ssoUrl?: string
  userInfo?: unknown
}

export type QqtSignResult = {
  ok: boolean
  status?: number
  message?: string
  accessToken?: string
  result?: unknown
  signInfo?: unknown
  acceptSummary?: {
    total: number
    success: number
    failed: number
    results: Array<{
      dayNum: number
      prizeId: string
      prizeName?: string
      ok: boolean
      message?: string
    }>
  }
}

export type QqtSignInfoResult = {
  ok: boolean
  status?: number
  message?: string
  accessToken?: string
  info?: unknown
}

export type QqtXdrReceiveResult = {
  ok: boolean
  status?: number
  message?: string
  accessToken?: string
  receive?: unknown
}

export async function qqtReplaceToken(args: {
  cmccCookie: string
  requestHeaders?: Record<string, string>
}): Promise<QqtTokenResult> {
  const session = await prepareQqtSession({
    cmccCookie: args.cmccCookie,
    requestHeaders: args.requestHeaders,
  })
  if (!session.ok || !session.accessToken || !session.sessionCookie) {
    return {
      ok: false,
      status: session.status,
      message: session.message || 'QQT 连接失败',
    }
  }

  const body = new URLSearchParams({ sspId: '', tag: 'qqtindex' }).toString()
  const res = await httpsRequestText({
    url: QQT_INFO_URL,
    method: 'POST',
    headers: {
      Cookie: session.sessionCookie,
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
      Origin: 'https://qqt.cmicrwx.cn',
      Referer: QQT_INDEX_PAGE,
      'User-Agent': QQT_UA,
    },
    body,
    timeoutMs: 10000,
  })

  if (res.statusCode < 200 || res.statusCode >= 300) {
    return {
      ok: false,
      status: res.statusCode,
      message: `Upstream HTTP ${res.statusCode}: ${summarizeText(res.bodyText)}`,
      accessToken: session.accessToken,
      ssoUrl: session.ssoUrl,
    }
  }

  return {
    ok: true,
    status: res.statusCode,
    accessToken: session.accessToken,
    ssoUrl: session.ssoUrl,
    userInfo: safeJson(res.bodyText),
  }
}

export async function qqtSign(args: {
  cmccCookie: string
  sspid: string
  accessToken?: string
  requestHeaders?: Record<string, string>
}): Promise<QqtSignResult> {
  const before = await qqtSignInfo(args)
  if (!before.ok) return { ok: false, status: before.status, message: before.message || '签到状态查询失败' }
  const beforeState = currentQqtActivitySignState(before.info)
  if (beforeState === 'unknown') return { ok: false, message: '签到状态不完整，无法确认今日进度' }
  if (beforeState === 'signed') {
    const accepted = await qqtSignInfoAndAccept({ ...args, accessToken: before.accessToken })
    return { ok: true, accessToken: before.accessToken, result: { status: '1', msg: '今日已签到（已查询确认）' },
      signInfo: before.info, acceptSummary: accepted.acceptSummary }
  }
  const session = await prepareQqtSession({
    cmccCookie: args.cmccCookie,
    requestHeaders: args.requestHeaders,
    accessToken: before.accessToken || args.accessToken,
  })
  if (!session.ok || !session.accessToken || !session.sessionCookie) {
    return {
      ok: false,
      status: session.status,
      message: session.message || 'QQT 连接失败',
    }
  }

  await prewarmQqtUserInfo(session.sessionCookie)

  const refererParams = new URLSearchParams({ sspId: args.sspid })
  if (session.ssoToken) {
    refererParams.set('token', session.ssoToken)
  }
  const referer = `${QQT_XDR_NORMAL_PAGE}?${refererParams.toString()}`
  const payload = JSON.stringify({ sspid: args.sspid })
  const res = await httpsRequestText({
    url: QQT_SIGN_URL,
    method: 'POST',
    headers: {
      Cookie: session.sessionCookie,
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Origin: 'https://qqt.cmicrwx.cn',
      Referer: referer,
      'User-Agent': QQT_UA,
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
    body: payload,
    timeoutMs: 10000,
  })
  logQqtBody('sign', res.bodyText)
  const parsed = safeJson(res.bodyText)
  const authMsg = extractMessage(parsed)
  if (isAuthInvalidMessage(authMsg)) {
    return {
      ok: false,
      status: res.statusCode,
      message: authMsg || '未登录',
      accessToken: session.accessToken,
    }
  }

  if (res.statusCode < 200 || res.statusCode >= 300) {
    return {
      ok: false,
      status: res.statusCode,
      message: `Upstream HTTP ${res.statusCode}: ${summarizeText(res.bodyText)}`,
      accessToken: session.accessToken,
    }
  }

  try {
    assertQqtActivitySuccess(parsed)
  } catch (error) {
    return { ok: false, status: res.statusCode, accessToken: session.accessToken,
      message: error instanceof Error ? error.message : '签到业务失败' }
  }

  const acceptResult = await qqtSignInfoAndAccept({
    cmccCookie: args.cmccCookie,
    sspid: args.sspid,
    accessToken: session.accessToken,
    requestHeaders: args.requestHeaders,
  })

  if (currentQqtActivitySignState(acceptResult?.signInfo) !== 'signed') {
    try {
      const verified = await verifyQqtActivityState({
        query: () => qqtSignInfo({ ...args, accessToken: session.accessToken }),
        completed: (state) => state.ok && currentQqtActivitySignState(state.info) === 'signed',
        message: '签到已提交，但查询未确认今日签到完成，请重试',
      })
      acceptResult.signInfo = verified.info
      const accepted = await qqtSignInfoAndAccept({ ...args, accessToken: session.accessToken })
      acceptResult.acceptSummary = accepted.acceptSummary
    } catch (error) {
      return { ok: false, accessToken: session.accessToken, result: parsed, signInfo: acceptResult?.signInfo,
        message: error instanceof Error ? error.message : '签到未确认完成' }
    }
  }

  return {
    ok: true,
    status: res.statusCode,
    accessToken: session.accessToken,
    result: parsed,
    signInfo: acceptResult?.signInfo,
    acceptSummary: acceptResult?.acceptSummary,
  }
}

async function qqtSignInfoAndAccept(args: {
  cmccCookie: string
  sspid: string
  accessToken?: string
  requestHeaders?: Record<string, string>
}): Promise<{
  signInfo?: unknown
  acceptSummary?: QqtSignResult['acceptSummary']
}> {
  const session = await prepareQqtSession({
    cmccCookie: args.cmccCookie,
    requestHeaders: args.requestHeaders,
    accessToken: args.accessToken,
  })
  if (!session.ok || !session.accessToken || !session.sessionCookie) {
    return {}
  }

  await prewarmQqtUserInfo(session.sessionCookie)

  const refererParams = new URLSearchParams({ sspId: args.sspid })
  if (session.ssoToken) {
    refererParams.set('token', session.ssoToken)
  }
  const referer = `${QQT_XDR_NORMAL_PAGE}?${refererParams.toString()}`
  const infoRes = await httpsRequestText({
    url: QQT_SIGN_INFO_URL,
    method: 'GET',
    headers: {
      Cookie: session.sessionCookie,
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest',
      Origin: 'https://qqt.cmicrwx.cn',
      Referer: referer,
      'User-Agent': QQT_UA,
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
    timeoutMs: 10000,
  })
  logQqtBody('sign-info', infoRes.bodyText)
  const infoParsed = safeJson(infoRes.bodyText)
  const authMsg = extractMessage(infoParsed)
  if (isAuthInvalidMessage(authMsg)) {
    return { signInfo: infoParsed }
  }
  if (infoRes.statusCode < 200 || infoRes.statusCode >= 300) {
    return { signInfo: infoParsed }
  }
  if (currentQqtActivitySignState(infoParsed) !== 'signed') return { signInfo: infoParsed }

  const pending = extractPendingSignPrizes(infoParsed)
  if (pending.length === 0) {
    return {
      signInfo: infoParsed,
      acceptSummary: {
        total: 0,
        success: 0,
        failed: 0,
        results: [],
      },
    }
  }

  const results: NonNullable<QqtSignResult['acceptSummary']>['results'] = []
  for (const prize of pending) {
    const payload = JSON.stringify({
      sspId: Number(args.sspid),
      mark: true,
      dayNum: prize.dayNum,
      prizeId: prize.prizeId,
      isVirtual: false,
    })
    const res = await httpsRequestText({
      url: QQT_SIGN_ACCEPT_URL,
      method: 'POST',
      headers: {
        Cookie: session.sessionCookie,
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Origin: 'https://qqt.cmicrwx.cn',
        Referer: referer,
        'User-Agent': QQT_UA,
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      body: payload,
      timeoutMs: 10000,
    })
    logQqtBody('sign-accept', res.bodyText)
    const parsed = safeJson(res.bodyText)
    let ok = res.statusCode >= 200 && res.statusCode < 300
    if (ok && parsed && typeof parsed === 'object') {
      const status =
        (parsed as Record<string, unknown>).status ??
        (parsed as Record<string, unknown>).code
      if (status !== undefined && String(status) !== '1') {
        ok = false
      }
    }
    const message = extractMessage(parsed)
    results.push({
      dayNum: prize.dayNum,
      prizeId: prize.prizeId,
      prizeName: prize.prizeName,
      ok,
      message,
    })
  }

  const success = results.filter((r) => r.ok).length
  return {
    signInfo: infoParsed,
    acceptSummary: {
      total: results.length,
      success,
      failed: results.length - success,
      results,
    },
  }
}

export async function qqtSignInfo(args: {
  cmccCookie: string
  sspid: string
  accessToken?: string
  requestHeaders?: Record<string, string>
}): Promise<QqtSignInfoResult> {
  const session = await prepareQqtSession({
    cmccCookie: args.cmccCookie,
    requestHeaders: args.requestHeaders,
    accessToken: args.accessToken,
  })
  if (!session.ok || !session.accessToken || !session.sessionCookie) {
    return {
      ok: false,
      status: session.status,
      message: session.message || 'QQT 连接失败',
    }
  }

  await prewarmQqtUserInfo(session.sessionCookie)

  const refererParams = new URLSearchParams({ sspId: args.sspid })
  if (session.ssoToken) {
    refererParams.set('token', session.ssoToken)
  }
  const referer = `${QQT_XDR_NORMAL_PAGE}?${refererParams.toString()}`
  const res = await httpsRequestText({
    url: QQT_SIGN_INFO_URL,
    method: 'GET',
    headers: {
      Cookie: session.sessionCookie,
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest',
      Origin: 'https://qqt.cmicrwx.cn',
      Referer: referer,
      'User-Agent': QQT_UA,
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
    timeoutMs: 10000,
  })
  logQqtBody('sign-info', res.bodyText)
  const parsed = safeJson(res.bodyText)
  const authMsg = extractMessage(parsed)
  if (isAuthInvalidMessage(authMsg)) {
    return {
      ok: false,
      status: res.statusCode,
      message: authMsg || '未登录',
      accessToken: session.accessToken,
    }
  }

  if (res.statusCode < 200 || res.statusCode >= 300) {
    return {
      ok: false,
      status: res.statusCode,
      message: `Upstream HTTP ${res.statusCode}: ${summarizeText(res.bodyText)}`,
      accessToken: session.accessToken,
    }
  }

  try {
    readQqtSignDays(parsed)
  } catch (error) {
    return { ok: false, status: res.statusCode, accessToken: session.accessToken,
      message: error instanceof Error ? error.message : '签到状态查询失败' }
  }
  return {
    ok: true,
    status: res.statusCode,
    accessToken: session.accessToken,
    info: parsed,
  }
}

export async function qqtQueryXdrReceive(args: {
  cmccCookie: string
  accessToken?: string
  requestHeaders?: Record<string, string>
}): Promise<QqtXdrReceiveResult> {
  const session = await prepareQqtSession({
    cmccCookie: args.cmccCookie,
    requestHeaders: args.requestHeaders,
    accessToken: args.accessToken,
  })
  if (!session.ok || !session.accessToken || !session.sessionCookie) {
    return {
      ok: false,
      status: session.status,
      message: session.message || 'QQT 连接失败',
    }
  }

  const res = await httpsRequestText({
    url: QQT_XDR_RECEIVE_URL,
    method: 'GET',
    headers: {
      Cookie: session.sessionCookie,
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest',
      Origin: 'https://qqt.cmicrwx.cn',
      Referer: QQT_XDR_NORMAL_PAGE,
      'User-Agent': QQT_UA,
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
    timeoutMs: 10000,
  })
  logQqtBody('xdr-receive', res.bodyText)
  const parsed = safeJson(res.bodyText)
  const authMsg = extractMessage(parsed)
  if (isAuthInvalidMessage(authMsg)) {
    return {
      ok: false,
      status: res.statusCode,
      message: authMsg || '未登录',
      accessToken: session.accessToken,
    }
  }
  if (res.statusCode < 200 || res.statusCode >= 300) {
    return {
      ok: false,
      status: res.statusCode,
      message: `Upstream HTTP ${res.statusCode}: ${summarizeText(res.bodyText)}`,
      accessToken: session.accessToken,
    }
  }

  return {
    ok: true,
    status: res.statusCode,
    accessToken: session.accessToken,
    receive: parsed,
  }
}

export const __test__ = {
  extractQqtAccessToken,
  extractQqtUrl,
  safeQqtSsoUrl,
}

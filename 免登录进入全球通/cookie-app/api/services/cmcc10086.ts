import { aesDecrypt, aesEncrypt } from './cmccCrypto.js'
import { httpsRequestText } from './cmccHttp.js'
import { fetchLoginParams } from './cmccLoginParams.js'
import { getRiskToken } from './cmccRiskToken.js'
import { mergeCookieWithSetCookie } from './cookieUtils.js'

type ParsedUpstreamBody =
  | { kind: 'json'; value: unknown }
  | { kind: 'encrypted_hex'; cipherHex: string }
  | { kind: 'text'; text: string }

function isLikelyHexCipher(text: string): boolean {
  const t = text.trim()
  if (t.length < 32) return false
  return /^[0-9a-fA-F]+$/.test(t)
}

function parseUpstreamBody(bodyText: string): ParsedUpstreamBody {
  const text = bodyText.trim()
  if (!text) return { kind: 'json', value: {} }

  if (text.startsWith('{') || text.startsWith('[')) {
    try {
      return { kind: 'json', value: JSON.parse(text) }
    } catch {
      return { kind: 'text', text }
    }
  }

  if (isLikelyHexCipher(text)) {
    return { kind: 'encrypted_hex', cipherHex: text }
  }

  return { kind: 'text', text }
}

function summarizeTextForError(text: string): string {
  const trimmed = text.trim()
  if (!trimmed) return ''
  const normalized = trimmed.replace(/\s+/g, ' ')
  return normalized.length > 240 ? `${normalized.slice(0, 240)}...` : normalized
}

function upstreamFormatMessage(text: string): string {
  const summary = summarizeTextForError(text)
  if (!summary) return '10086接口返回为空，请稍后重试'
  if (/^<!doctype|^<html|<body/i.test(summary)) {
    return '10086接口临时返回页面内容，请稍后重试'
  }
  return `10086接口返回格式异常：${summary}`
}

function pickStatusAndMessage(parsed: object): {
  status?: string | number
  message?: string
} {
  const obj = parsed as Record<string, unknown>
  const statusRaw = obj.status
  const messageRaw = obj.message

  const status =
    typeof statusRaw === 'string' || typeof statusRaw === 'number'
      ? statusRaw
      : undefined

  const message = typeof messageRaw === 'string' ? messageRaw : undefined

  return { status, message }
}

function normalizeSetCookieToCookieHeader(setCookie: string[] | string | undefined): string {
  const list = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : []
  return list
    .map((v) => v.split(';', 1)[0])
    .map((v) => v.trim())
    .filter(Boolean)
    .join('; ')
}

function mergeHeaderOverrides(
  base: Record<string, string>,
  custom?: Record<string, string>,
  protectedKeys?: string[],
): Record<string, string> {
  if (!custom || Object.keys(custom).length === 0) return base
  const protectedSet = new Set((protectedKeys ?? []).map((k) => k.toLowerCase()))
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

function extractCsrfFromNewHomeHtml(html: string): string | undefined {
  const match = html.match(/var\s+user\s*=\s*([\s\S]*?)\s*;\s*var\s+serverTime/)
  if (!match) return undefined
  try {
    const user = JSON.parse(match[1]) as { csrf?: unknown }
    return typeof user.csrf === 'string' ? user.csrf : undefined
  } catch {
    return undefined
  }
}

function buildRequestTraceId(): string {
  const stamp = Date.now().toString(36)
  const uuid = 'xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (ch) => {
    const n = (16 * Math.random()) | 0
    return (ch === 'x' ? n : (3 & n) | 8).toString(8)
  })
  return `${stamp}-${uuid}`
}

async function fetchNewHomeContext(
  cookie: string,
  requestHeaders?: Record<string, string>,
  newHomeUrl?: string,
): Promise<{
  statusCode: number
  bodyText: string
  cookie: string
  cookieUpdated: boolean
  csrf?: string
}> {
  return fetchNewHomeContextWithHeaders(cookie, requestHeaders, newHomeUrl)
}

async function fetchNewHomeContextWithHeaders(
  cookie: string,
  requestHeaders?: Record<string, string>,
  newHomeUrl?: string,
): Promise<{
  statusCode: number
  bodyText: string
  cookie: string
  cookieUpdated: boolean
  csrf?: string
}> {
  const url = newHomeUrl?.trim() || 'https://wx.10086.cn/website/spa/main/newHome'
  const baseHeaders = {
    Cookie: cookie,
    Referer: url,
    Origin: 'https://wx.10086.cn',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  }
  const headers = mergeHeaderOverrides(baseHeaders, requestHeaders, ['cookie'])
  const res = await httpsRequestText({
    url,
    method: 'GET',
    headers,
    timeoutMs: 10000,
  })

  const merged = mergeCookieWithSetCookie({
    cookie,
    setCookie: res.headers['set-cookie'],
  })

  return {
    statusCode: res.statusCode,
    bodyText: res.bodyText,
    cookie: merged.cookie,
    cookieUpdated: merged.changed,
    csrf: extractCsrfFromNewHomeHtml(res.bodyText),
  }
}

export type SendMsgResult = {
  ok: boolean
  status?: string | number
  message?: string
}

export type LoginResult = {
  ok: boolean
  status?: string | number
  message?: string
  cookie?: string
}

export type ActivateResult = {
  ok: boolean
  status?: string | number
  message?: string
  encrypted?: string
  decrypted?: string
  cookie?: string
  cookieUpdated?: boolean
}

export type RefreshResult = {
  ok: boolean
  status?: string | number
  message?: string
  cookie?: string
  cookieUpdated?: boolean
}

export async function cmccSendSms(
  phone: string,
  requestHeaders?: Record<string, string>,
): Promise<SendMsgResult> {
  const { csrf, reqTmp, cookieHeader } = await fetchLoginParams({
    requestHeaders,
  })
  const riskToken = await getRiskToken()
  const encPhone = await aesEncrypt(phone)

  const body = new URLSearchParams({
    telephone: encPhone,
    riskToken,
  }).toString()

  const baseHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'csrf-token': csrf,
    reqTmp,
    Referer: 'https://wx.10086.cn/website/bind/bindAccount/new',
    Origin: 'https://wx.10086.cn',
    'Accept-Encoding': 'gzip, deflate, br',
    ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  }
  const headers = mergeHeaderOverrides(baseHeaders, requestHeaders, [
    'cookie',
    'csrf-token',
    'reqtmp',
  ])

  const res = await httpsRequestText({
    url: 'https://wx.10086.cn/website/bind/sendMsg',
    method: 'POST',
    headers,
    body,
    timeoutMs: 10000,
  })

  if (res.statusCode < 200 || res.statusCode >= 300) {
    return {
      ok: false,
      status: res.statusCode,
      message: `Upstream HTTP ${res.statusCode}: ${summarizeTextForError(res.bodyText)}`,
    }
  }

  const parsed = parseUpstreamBody(res.bodyText)
  let obj: unknown = undefined

  if (parsed.kind === 'json') {
    obj = parsed.value
  } else if (parsed.kind === 'encrypted_hex') {
    try {
      const decrypted = await aesDecrypt(parsed.cipherHex)
      obj = JSON.parse(decrypted)
    } catch {
      return {
        ok: false,
        status: res.statusCode,
        message: '10086接口返回解密失败，请稍后重试',
      }
    }
  } else {
    return {
      ok: false,
      status: res.statusCode,
      message: upstreamFormatMessage(parsed.text),
    }
  }

  if (!obj || typeof obj !== 'object') {
    return { ok: false, status: res.statusCode, message: '10086接口返回格式异常，请稍后重试' }
  }

  const { status, message } = pickStatusAndMessage(obj as object)
  const ok = status === 0 || status === '0'
  return { ok, status, message }
}

export async function cmccLoginBySms(
  phone: string,
  code: string,
  requestHeaders?: Record<string, string>,
): Promise<LoginResult> {
  const { csrf, reqTmp, cookieHeader } = await fetchLoginParams({
    requestHeaders,
  })
  const riskToken = await getRiskToken()
  const encPhone = await aesEncrypt(phone)
  const encCode = await aesEncrypt(code)

  const payload = {
    telephone: encPhone,
    password: encCode,
    pwdType: '02',
    checkCtrol: 1,
    bindSource: '',
    sourcePage: 'WMH_登录',
    ys: '',
    ysTitle: '',
    constId: riskToken,
  }

  const baseHeaders = {
    'Content-Type': 'application/json; charset=UTF-8',
    'csrf-token': csrf,
    reqTmp,
    Referer: 'https://wx.10086.cn/website/bind/bindAccount/new',
    Origin: 'https://wx.10086.cn',
    'Accept-Encoding': 'gzip, deflate, br',
    ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  }
  const headers = mergeHeaderOverrides(baseHeaders, requestHeaders, [
    'cookie',
    'csrf-token',
    'reqtmp',
  ])

  const res = await httpsRequestText({
    url: 'https://wx.10086.cn/website/bind/bindAccount/new',
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    timeoutMs: 15000,
  })

  const setCookie = res.headers['set-cookie']
  const cookie = normalizeSetCookieToCookieHeader(setCookie)

  if (res.statusCode < 200 || res.statusCode >= 300) {
    return {
      ok: false,
      status: res.statusCode,
      message: `Upstream HTTP ${res.statusCode}: ${summarizeTextForError(res.bodyText)}`,
    }
  }

  const parsed = parseUpstreamBody(res.bodyText)
  let obj: unknown = undefined
  if (parsed.kind === 'json') {
    obj = parsed.value
  } else if (parsed.kind === 'encrypted_hex') {
    try {
      const decrypted = await aesDecrypt(parsed.cipherHex)
      obj = JSON.parse(decrypted)
    } catch {
      return { ok: false, status: res.statusCode, message: 'Upstream response decrypt/parse failed' }
    }
  } else {
    return {
      ok: false,
      status: res.statusCode,
      message: `Upstream non-JSON response: ${summarizeTextForError(parsed.text)}`,
    }
  }

  if (!obj || typeof obj !== 'object') {
    return { ok: false, status: res.statusCode, message: 'Upstream response invalid' }
  }

  const { status, message } = pickStatusAndMessage(obj as object)
  const ok = (status === 0 || status === '0') && Boolean(cookie)

  return {
    ok,
    status,
    message,
    cookie: ok ? cookie : undefined,
  }
}

export async function cmccRefreshCookieByHome(
  cookie: string,
  requestHeaders?: Record<string, string>,
  newHomeUrl?: string,
): Promise<RefreshResult> {
  const ctx = await fetchNewHomeContext(cookie, requestHeaders, newHomeUrl)
  if (ctx.statusCode >= 400) {
    return {
      ok: false,
      status: ctx.statusCode,
      message: `newHome 请求失败: HTTP ${ctx.statusCode}`,
      cookie: ctx.cookie,
      cookieUpdated: ctx.cookieUpdated,
    }
  }
  // 登录失效时首页会 302 到登录页，登录页也可能 200 并下发清理 Cookie。
  // HTTP 成功或 Cookie 发生变化均不能证明登录成功；后续查询需要首页用户上下文中的 csrf。
  const ok = ctx.statusCode === 200 && Boolean(ctx.csrf?.trim())
  const message = ok
    ? undefined
    : `10086 CK 未通过登录校验（首页 HTTP ${ctx.statusCode}，未取得用户登录上下文），请重新使用 10086 验证码或扫码登录，或导入 wx.10086.cn 的完整 CK`

  return {
    ok,
    status: ctx.statusCode,
    message,
    cookie: ctx.cookie,
    cookieUpdated: ctx.cookieUpdated,
  }
}

export async function cmccActivateFareBalance(
  cookie: string,
  requestHeaders?: Record<string, string>,
  newHomeUrl?: string,
): Promise<ActivateResult> {
  const ctx = await fetchNewHomeContext(cookie, requestHeaders, newHomeUrl)
  if (ctx.statusCode >= 400) {
    return {
      ok: false,
      status: ctx.statusCode,
      message: `newHome 请求失败: HTTP ${ctx.statusCode}`,
      cookie: ctx.cookie,
      cookieUpdated: ctx.cookieUpdated,
    }
  }
  const csrf = ctx.csrf ?? ''
  if (!csrf) {
    return {
      ok: false,
      status: ctx.statusCode,
      message: 'newHome 未返回 csrf-token，Cookie 可能已失效或请求头不匹配',
      cookie: ctx.cookie,
      cookieUpdated: ctx.cookieUpdated,
    }
  }
  const requestTraceId = buildRequestTraceId()
  const body = JSON.stringify({ operation: 'getCustomerKeyMessage' })
  const baseHeaders = {
    Cookie: ctx.cookie,
    Referer: 'https://wx.10086.cn/website/spa/main/newHome',
    Origin: 'https://wx.10086.cn',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json; charset=UTF-8',
    'csrf-token': csrf,
    lrsbhbg8: 'ZS93dUFVa2kzaEpQSjM0SG55MUFDdz09',
    e76ccba5165fa9b4966ad82a0088e520: requestTraceId,
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  }
  const headers = mergeHeaderOverrides(baseHeaders, requestHeaders, [
    'cookie',
    'csrf-token',
    'lrsbhbg8',
    'e76ccba5165fa9b4966ad82a0088e520',
  ])
  const res = await httpsRequestText({
    url: `https://wx.10086.cn/website/uniApi/getMarginQueryInfo?t=${Date.now()}`,
    method: 'POST',
    headers,
    body,
    timeoutMs: 10000,
  })

  const merged = mergeCookieWithSetCookie({
    cookie: ctx.cookie,
    setCookie: res.headers['set-cookie'],
  })
  const cookieUpdated = ctx.cookieUpdated || merged.changed

  if (res.statusCode < 200 || res.statusCode >= 300) {
    return {
      ok: false,
      status: res.statusCode,
      message: `Upstream HTTP ${res.statusCode}: ${summarizeTextForError(res.bodyText)}`,
      cookie: merged.cookie,
      cookieUpdated,
    }
  }

  const parsed = parseUpstreamBody(res.bodyText)
  if (parsed.kind === 'encrypted_hex') {
    try {
      const decrypted = await aesDecrypt(parsed.cipherHex)
      return {
        ok: true,
        status: res.statusCode,
        encrypted: parsed.cipherHex,
        decrypted,
        cookie: merged.cookie,
        cookieUpdated,
      }
    } catch {
      return {
        ok: false,
        status: res.statusCode,
        message: 'Upstream response decrypt failed',
        encrypted: parsed.cipherHex,
        cookie: merged.cookie,
        cookieUpdated,
      }
    }
  }

  if (parsed.kind === 'json') {
    return {
      ok: true,
      status: res.statusCode,
      encrypted: res.bodyText.trim(),
      decrypted: JSON.stringify(parsed.value),
      cookie: merged.cookie,
      cookieUpdated,
    }
  }

  return {
    ok: true,
    status: res.statusCode,
    encrypted: res.bodyText.trim(),
    decrypted: parsed.text,
    cookie: merged.cookie,
    cookieUpdated,
  }
}

export const __test__ = {
  isLikelyHexCipher,
  parseUpstreamBody,
}

import { httpsRequestText } from './cmccHttp.js'
import { buildCookieHeader, mergeCookieWithSetCookie, parseCookieHeader } from './cookieUtils.js'

const DEFAULT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'

const APP_RIGHTS_URL =
  'https://app.10086.cn/cmcc-app/myRights/myRights.html?pageId=1534419663405838336&channelId=P00000014023'

const SSO_BIND_URL =
  'https://wx.10086.cn/website/bind/bindAccount/new?netUniChannelId=12006&tokenKey=token&netUniBackUrl=' +
  encodeURIComponent(
    `https://login.10086.cn/html/login/sso_token.html?sourceid=017018&backUrl=${encodeURIComponent(
      APP_RIGHTS_URL,
    )}&transactionID=WMH123456&channelID=12006`,
  )

export type SessionBridgeResult = {
  ok: boolean
  status?: number
  message?: string
  cookie?: string
  cookieUpdated?: boolean
  sessionTokenUpdated?: boolean
  fields?: string[]
  finalUrl?: string
  steps?: Array<{
    name: string
    status: number
    cookieUpdated: boolean
    location?: string
  }>
}

export type AppTokenExchangeResult = SessionBridgeResult & {
  jwt?: string
  activityUrl?: string
}

export type SessionCapabilityResult = {
  hasCookie: boolean
  fields: Record<string, boolean>
  availableFields: string[]
  missingFields: string[]
  groups: {
    activity: boolean
    pcSso: boolean
    cmccApp: boolean
    basic10086: boolean
  }
  summary: string
}

function mergeCookie(cookie: string, setCookie: string | string[] | undefined): {
  cookie: string
  changed: boolean
} {
  return mergeCookieWithSetCookie({ cookie, setCookie })
}

function cookieFields(cookie: string): string[] {
  const map = parseCookieHeader(cookie)
  return [
    'HLWHD_SESSION_TOKEN',
    'd.sid',
    'cmccssotoken',
    'UID',
    'telNum',
    'ticketID',
    'JSESSIONID',
  ].filter((key) => map.has(key))
}

export function inspectSessionCapabilities(cookie: string): SessionCapabilityResult {
  const map = parseCookieHeader(cookie)
  const tracked = [
    'HLWHD_SESSION_TOKEN',
    'd.sid',
    'cmccssotoken',
    'sourceid',
    'UID',
    'telNum',
    'LC',
    'ticketID',
    'JSESSIONID',
  ]
  const fields = Object.fromEntries(tracked.map((key) => [key, map.has(key)])) as Record<
    string,
    boolean
  >
  const availableFields = tracked.filter((key) => fields[key])
  const missingFields = tracked.filter((key) => !fields[key])
  const groups = {
    activity: fields.HLWHD_SESSION_TOKEN,
    pcSso: fields['d.sid'] || fields.cmccssotoken,
    cmccApp: fields.UID || fields.telNum || fields.ticketID || fields.JSESSIONID,
    basic10086: map.size > 0,
  }
  const ready = Object.entries(groups)
    .filter(([, ok]) => ok)
    .map(([key]) => key)
  return {
    hasCookie: map.size > 0,
    fields,
    availableFields,
    missingFields,
    groups,
    summary: ready.length > 0 ? `已具备 ${ready.join(', ')} 能力` : '未识别到可用登录态字段',
  }
}

export function hasCmccBusinessSessionCookie(cookie: string): boolean {
  const map = parseCookieHeader(cookie)
  return Boolean(
    map.get('JSESSIONID') &&
    (map.get('cellNum') ||
      map.get('telNum') ||
      map.get('UID') ||
      map.get('ticketID') ||
      map.get('cmccssotoken')),
  )
}

function hasSessionToken(cookie: string): boolean {
  return parseCookieHeader(cookie).has('HLWHD_SESSION_TOKEN')
}

function resolveLocation(baseUrl: string, location: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(location) ? location[0] : location
  if (!raw) return undefined
  try {
    return new URL(raw, baseUrl).toString()
  } catch {
    return undefined
  }
}

function sanitizeLocation(location: string | undefined): string | undefined {
  if (!location) return undefined
  try {
    const url = new URL(location)
    for (const key of Array.from(url.searchParams.keys())) {
      const lower = key.toLowerCase()
      if (lower.includes('token') || lower.includes('ticket') || lower.includes('artifact')) {
        url.searchParams.set(key, '<redacted>')
      }
    }
    return url.toString()
  } catch {
    return location.replace(/([?&][^=]*(?:token|ticket|artifact)[^=]*=)[^&]+/gi, '$1<redacted>')
  }
}

function buildSsoActionUrl(ssoPageUrl: string): string {
  const parsed = new URL(ssoPageUrl)
  const token = parsed.searchParams.get('token') || ''
  const backUrl = parsed.searchParams.get('backUrl') || APP_RIGHTS_URL
  const sourceid = parsed.searchParams.get('sourceid') || '017018'
  const transactionID = parsed.searchParams.get('transactionID') || 'WMH123456'
  const channelID = parsed.searchParams.get('channelID') || '12006'
  const action = new URL('https://login.10086.cn/SSOToken.action')
  action.searchParams.set('token', token)
  action.searchParams.set('backUrl', backUrl)
  action.searchParams.set('sourceid', sourceid)
  action.searchParams.set('transactionID', transactionID)
  action.searchParams.set('channelID', channelID)
  return action.toString()
}

function decodeMaybeBase64Json(text: string): unknown {
  const trimmed = String(text || '').trim()
  if (!trimmed) return undefined
  try {
    return JSON.parse(trimmed) as unknown
  } catch {
    // qwhdsso/appTokenLogin returns base64 encoded JSON in captured app flows.
  }
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(trimmed)) return undefined
  try {
    return JSON.parse(Buffer.from(trimmed, 'base64').toString('utf8')) as unknown
  } catch {
    return undefined
  }
}

function getString(obj: unknown, key: string): string | undefined {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return undefined
  const value = (obj as Record<string, unknown>)[key]
  return typeof value === 'string' ? value : undefined
}

function getObject(obj: unknown, key: string): Record<string, unknown> | undefined {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return undefined
  const value = (obj as Record<string, unknown>)[key]
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  return value as Record<string, unknown>
}

function extractActivitySid(activityUrl: string): string {
  try {
    const parsed = new URL(activityUrl)
    return parsed.searchParams.get('sid')?.trim() || parsed.searchParams.get('token')?.trim() || ''
  } catch {
    return ''
  }
}

function hasActivitySessionToken(cookie: string): boolean {
  return parseCookieHeader(cookie).has('HLWHD_SESSION_TOKEN')
}

function stripActivitySessionToken(cookie: string): string {
  const map = parseCookieHeader(cookie)
  map.delete('HLWHD_SESSION_TOKEN')
  return buildCookieHeader(map)
}

export async function exchangeAppTokenToActivityCookie(args: {
  cookie?: string
  appToken?: string
  token?: string
  postBody?: Record<string, unknown>
  jwtToken?: string | null
  sid?: string
  loginUrl?: string
  activityUrl?: string
  provinceCode?: string
  cityCode?: string
  userCheckId?: string
  carrierOperator?: string
  appVersionCode?: string
  took?: number
}): Promise<AppTokenExchangeResult> {
  const harPostBody =
    args.postBody && typeof args.postBody === 'object' && !Array.isArray(args.postBody)
      ? args.postBody
      : undefined
  const appToken = String(args.appToken || args.token || getString(harPostBody, 'token') || '').trim()
  const seedActivityUrl = String(args.activityUrl || '').trim()
  const sid =
    String(args.sid || '').trim() ||
    extractActivitySid(String(args.loginUrl || '').trim()) ||
    extractActivitySid(seedActivityUrl)
  if (!appToken) {
    return { ok: false, message: '请填写 app token', cookie: args.cookie || '', cookieUpdated: false }
  }
  if (!sid) {
    return {
      ok: false,
      message: '请填写活动 sid/token，或粘贴带 sid/token 参数的活动 URL',
      cookie: args.cookie || '',
      cookieUpdated: false,
    }
  }

  let cookie = stripActivitySessionToken(args.cookie || '')
  let changed = false
  const hadSessionToken = hasActivitySessionToken(cookie)
  const steps: SessionBridgeResult['steps'] = []
  const bodyRecord =
    harPostBody ??
    {
      jwtToken: typeof args.jwtToken === 'string' && args.jwtToken.trim() ? args.jwtToken.trim() : null,
      token: appToken,
      provinceCode: args.provinceCode?.trim() || '100',
      cityCode: args.cityCode?.trim() || '010',
      userCheckId: args.userCheckId?.trim() || '',
      carrierOperator: args.carrierOperator?.trim() || '002',
      appVersionCode: args.appVersionCode?.trim() || '12.1.3',
      took:
        typeof args.took === 'number' && Number.isFinite(args.took)
          ? Math.max(0, Math.floor(args.took))
          : Math.floor(900 + Math.random() * 1800),
    }
  const body = JSON.stringify(bodyRecord)

  const loginUrl = `https://wx.10086.cn/qwhdsso/appTokenLogin?sid=${encodeURIComponent(sid)}`
  const appUserAgent =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148/wkwebview leadeon/12.1.3/CMCCIT'
  const loginRes = await httpsRequestText({
    url: loginUrl,
    method: 'POST',
    headers: {
      Host: 'wx.10086.cn',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Content-Type': 'application/json;charset=UTF-8',
      Origin: 'https://wx.10086.cn',
      Referer:
        seedActivityUrl ||
        'https://wx.10086.cn/qwhdsso/login?dlwmh=true&actUrl=https%3A%2F%2Fwx.10086.cn%2Fhlwyxhdhub%2Fact-wedrecharge%2F1024101716%3FpageId%3D1849008675699650560%26channelId%3DP00000111224&preloginUrl=https%3A%2F%2Fwx.10086.cn%2Fhlwyxhdhub%2Fact-wedrecharge%2Findex.html%23%2Fsignup',
      'User-Agent': appUserAgent,
      Cookie: cookie,
      'Content-Length': Buffer.byteLength(body).toString(),
    },
    body,
    timeoutMs: 15000,
  })
  steps.push({ name: 'app_token_login', status: loginRes.statusCode, cookieUpdated: false })

  if (loginRes.statusCode < 200 || loginRes.statusCode >= 300) {
    return {
      ok: false,
      status: loginRes.statusCode,
      message: `appTokenLogin HTTP ${loginRes.statusCode}`,
      cookie,
      cookieUpdated: changed,
      fields: cookieFields(cookie),
      steps,
    }
  }

  const payload = decodeMaybeBase64Json(loginRes.bodyText)
  const data = getObject(payload, 'data')
  const code = getString(payload, 'code')
  const msg = getString(payload, 'msg') || getString(payload, 'message')
  const success = Boolean(
    payload &&
      typeof payload === 'object' &&
      !Array.isArray(payload) &&
      (payload as Record<string, unknown>).success === true,
  )
  if (code !== 'SUCCESS' && !success) {
    return {
      ok: false,
      status: loginRes.statusCode,
      message: [code, msg].filter(Boolean).join(': ') || 'app token 登录失败',
      cookie,
      cookieUpdated: changed,
      fields: cookieFields(cookie),
      steps,
    }
  }

  const activityUrl = getString(data, 'url') || getString(payload, 'url') || seedActivityUrl
  const jwt = getString(data, 'jwt')
  if (!activityUrl) {
    return {
      ok: false,
      status: loginRes.statusCode,
      message: 'appTokenLogin 未返回活动 URL',
      cookie,
      cookieUpdated: changed,
      fields: cookieFields(cookie),
      steps,
    }
  }
  const pageRes = await httpsRequestText({
    url: activityUrl,
    method: 'GET',
    headers: {
      Cookie: cookie,
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'User-Agent': appUserAgent,
      Referer: 'https://wx.10086.cn/website/bind/bindAccount/new',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Dest': 'document',
    },
    timeoutMs: 15000,
  })
  const merged = mergeCookie(cookie, pageRes.headers['set-cookie'])
  cookie = merged.cookie
  changed ||= merged.changed
  steps.push({
    name: 'activity_page',
    status: pageRes.statusCode,
    cookieUpdated: merged.changed,
    location: sanitizeLocation(activityUrl),
  })

  const hasToken = hasActivitySessionToken(cookie)
  return {
    ok: pageRes.statusCode >= 200 && pageRes.statusCode < 400 && hasToken,
    status: pageRes.statusCode,
    message:
      pageRes.statusCode >= 200 && pageRes.statusCode < 400 && hasToken
        ? undefined
        : hasToken
          ? '活动页请求异常，但已拿到活动会话'
          : '未拿到 HLWHD_SESSION_TOKEN，请检查 app token 和活动 URL 是否有效',
    cookie,
    cookieUpdated: changed,
    sessionTokenUpdated: !hadSessionToken && hasToken ? true : changed && hasToken,
    fields: cookieFields(cookie),
    finalUrl: sanitizeLocation(activityUrl),
    activityUrl: sanitizeLocation(activityUrl),
    jwt: jwt ? '<redacted>' : undefined,
    steps,
  }
}

export async function refreshHlwhdActivitySession(args: {
  cookie: string
  activityId?: string
}): Promise<SessionBridgeResult> {
  const activityId = args.activityId?.trim() || '1025061922'
  let cookie = args.cookie
  let changed = false
  const hadSessionToken = hasSessionToken(cookie)
  const steps: SessionBridgeResult['steps'] = []

  const pageUrl = `https://wx.10086.cn/hlwyxhdhub/act-sunvideo/${encodeURIComponent(activityId)}`
  const pageRes = await httpsRequestText({
    url: pageUrl,
    method: 'GET',
    headers: {
      Cookie: cookie,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      Referer: 'https://wx.10086.cn/website/bind/bindAccount/new',
      'User-Agent': DEFAULT_UA,
    },
    timeoutMs: 15000,
  })
  const pageMerged = mergeCookie(cookie, pageRes.headers['set-cookie'])
  cookie = pageMerged.cookie
  changed ||= pageMerged.changed
  steps.push({ name: 'activity_page', status: pageRes.statusCode, cookieUpdated: pageMerged.changed })

  const token = (() => {
    try {
      return new URL(pageUrl).searchParams.get('token') || undefined
    } catch {
      return undefined
    }
  })()
  const referer = token ? `${pageUrl}?token=${encodeURIComponent(token)}` : pageUrl
  const apiRes = await httpsRequestText({
    url: 'https://wx.10086.cn/hlwyxhdhub/api/sunvideo/userInfo',
    method: 'POST',
    headers: {
      Cookie: cookie,
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
      Origin: 'https://wx.10086.cn',
      Referer: referer,
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'User-Agent': DEFAULT_UA,
      'login-check': '1',
    },
    body: '{}',
    timeoutMs: 15000,
  })
  const apiMerged = mergeCookie(cookie, apiRes.headers['set-cookie'])
  cookie = apiMerged.cookie
  changed ||= apiMerged.changed
  steps.push({ name: 'sunvideo_userInfo', status: apiRes.statusCode, cookieUpdated: apiMerged.changed })

  const statusOk =
    (pageRes.statusCode >= 200 && pageRes.statusCode < 400) ||
    (apiRes.statusCode >= 200 && apiRes.statusCode < 400)
  const hasToken = hasSessionToken(cookie)
  return {
    ok: statusOk && hasToken,
    status: apiRes.statusCode || pageRes.statusCode,
    message:
      statusOk && hasToken
        ? undefined
        : hasToken
          ? '活动接口请求异常，但已保留现有活动会话'
          : '未拿到 HLWHD_SESSION_TOKEN，当前 CK 可能不具备活动页登录态',
    cookie,
    cookieUpdated: changed,
    sessionTokenUpdated: !hadSessionToken && hasToken ? true : changed && hasToken,
    fields: cookieFields(cookie),
    steps,
  }
}

export async function exchange10086CookieToCmccApp(args: {
  cookie: string
}): Promise<SessionBridgeResult> {
  let cookie = args.cookie
  let changed = false
  const steps: SessionBridgeResult['steps'] = []

  const bindRes = await httpsRequestText({
    url: SSO_BIND_URL,
    method: 'GET',
    headers: {
      Cookie: cookie,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      Referer: 'https://wx.10086.cn/website/businessPlatform/shop?pageid=f3f4486601a4496bb461cc032a615d10&polymer=universal',
      'User-Agent': DEFAULT_UA,
    },
    timeoutMs: 15000,
  })
  const bindMerged = mergeCookie(cookie, bindRes.headers['set-cookie'])
  cookie = bindMerged.cookie
  changed ||= bindMerged.changed
  const ssoPageUrl = resolveLocation(SSO_BIND_URL, bindRes.headers.location)
  steps.push({
    name: 'wx_bind_to_pc_sso',
    status: bindRes.statusCode,
    cookieUpdated: bindMerged.changed,
    location: sanitizeLocation(ssoPageUrl),
  })

  if (!ssoPageUrl) {
    return {
      ok: false,
      status: bindRes.statusCode,
      message: '未获取到 PC SSO 跳转地址，10086 CK 可能已失效',
      cookie,
      cookieUpdated: changed,
      fields: cookieFields(cookie),
      steps,
    }
  }

  const ssoPageRes = await httpsRequestText({
    url: ssoPageUrl,
    method: 'GET',
    headers: {
      Cookie: cookie,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      Referer: 'https://wx.10086.cn/',
      'User-Agent': DEFAULT_UA,
    },
    timeoutMs: 15000,
  })
  const ssoPageMerged = mergeCookie(cookie, ssoPageRes.headers['set-cookie'])
  cookie = ssoPageMerged.cookie
  changed ||= ssoPageMerged.changed
  steps.push({ name: 'pc_sso_page', status: ssoPageRes.statusCode, cookieUpdated: ssoPageMerged.changed })

  const actionUrl = buildSsoActionUrl(ssoPageUrl)
  const actionRes = await httpsRequestText({
    url: actionUrl,
    method: 'GET',
    headers: {
      Cookie: cookie,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      Referer: ssoPageUrl,
      'User-Agent': DEFAULT_UA,
    },
    timeoutMs: 15000,
  })
  const actionMerged = mergeCookie(cookie, actionRes.headers['set-cookie'])
  cookie = actionMerged.cookie
  changed ||= actionMerged.changed
  const artifactUrl = resolveLocation(actionUrl, actionRes.headers.location)
  steps.push({
    name: 'pc_sso_action',
    status: actionRes.statusCode,
    cookieUpdated: actionMerged.changed,
    location: sanitizeLocation(artifactUrl),
  })

  if (artifactUrl) {
    try {
      const artifactRes = await httpsRequestText({
        url: artifactUrl,
        method: 'GET',
        headers: {
          Cookie: cookie,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          Referer: ssoPageUrl,
          'User-Agent': DEFAULT_UA,
        },
        timeoutMs: 15000,
        allowUnsafeLegacyRenegotiation: true,
      })
      const artifactMerged = mergeCookie(cookie, artifactRes.headers['set-cookie'])
      cookie = artifactMerged.cookie
      changed ||= artifactMerged.changed
      steps.push({
        name: 'cmcc_artifact',
        status: artifactRes.statusCode,
        cookieUpdated: artifactMerged.changed,
      })
    } catch (e) {
      steps.push({
        name: 'cmcc_artifact',
        status: 0,
        cookieUpdated: false,
      })
    }
  }

  const fields = cookieFields(cookie)
  const ok =
    actionRes.statusCode >= 300 &&
    actionRes.statusCode < 400 &&
    Boolean(artifactUrl)

  return {
    ok,
    status: actionRes.statusCode,
    message: ok ? undefined : 'CMCC 置换链路未完成，请检查当前 10086 CK 是否有效',
    cookie,
    cookieUpdated: changed,
    fields,
    finalUrl: sanitizeLocation(artifactUrl),
    steps,
  }
}

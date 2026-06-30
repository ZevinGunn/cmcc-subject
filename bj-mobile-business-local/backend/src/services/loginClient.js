import { config } from '../config.js'
import dns from 'node:dns/promises'
import net from 'node:net'
import { encodeForm, normalizeBase64Maybe, parseJsonMaybeBase64, requestWithJar } from '../utils/http.js'
import { logEvent } from '../utils/logger.js'
import { rsaEncryptLogin } from './cryptoService.js'

function loginReferer() {
  return `${config.loginOrigin}/html/bj/touch.html?channelID=${config.channelId}&backUrl=${encodeURIComponent(
    config.backUrl,
  )}`
}

function loginHeaders(extra = {}) {
  return {
    'User-Agent': config.userAgent,
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Origin: config.loginOrigin,
    Referer: loginReferer(),
    'X-Requested-With': 'XMLHttpRequest',
    ...extra,
  }
}

function portalPageHeaders(extra = {}) {
  return {
    'User-Agent': config.userAgent,
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    ...extra,
  }
}

function portalCheckLoginUrl(session) {
  const base = session.assertAcceptURL || `${config.portalOrigin}/nwt/portal/checkLogin`
  return `${base}?backUrl=${encodeURIComponent(config.backUrl)}&artifact=${encodeURIComponent(
    session.artifact,
  )}`
}

function portalTouchLoginUrl(session, strategy = 'harTouch') {
  const artifact = encodeURIComponent(session.artifact)
  const backUrl = encodeURIComponent(config.backUrl)
  if (strategy === 'ssoArtifact') {
    return `${config.portalOrigin}/nwt/sso/touchLogin?artifact=${artifact}&authType=ssoArtifact&backUrl=${backUrl}&touch=touch`
  }
  if (strategy === 'checkLoginRoute') {
    return `${config.portalOrigin}/nwt/sso/touchLogin?artifact=${artifact}&backUrl=${backUrl}&touch=&tklogin=`
  }
  return `${config.portalOrigin}/nwt/sso/touchLogin?artifact=${artifact}&backUrl=${backUrl}&touch=touch`
}

function portalTouchLoginHeaders(session) {
  return {
    'User-Agent': config.userAgent,
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    Origin: config.portalOrigin,
    Referer: `${config.portalOrigin}/nwt/portal/checkLogin?backUrl=${encodeURIComponent(
      config.backUrl,
    )}&artifact=${encodeURIComponent(session.artifact)}`,
  }
}

function parsePortalTouchLoginBody(data) {
  try {
    return typeof data === 'string' ? JSON.parse(data) : data
  } catch {
    return data
  }
}

function hasPortalAccessToken(raw) {
  return Boolean(raw && typeof raw === 'object' && raw.access_token)
}

function summarizePortalTouchLogin(raw) {
  if (raw && typeof raw === 'object') {
    return {
      hasAccessToken: Boolean(raw.access_token),
      hasRefreshToken: Boolean(raw.refresh_token),
      expires_in: raw.expires_in || '',
      name: raw.name || '',
      keys: Object.keys(raw).slice(0, 20),
    }
  }
  const text = String(raw || '')
  return text.length > 500 ? `${text.slice(0, 500)}...[TRUNCATED len=${text.length}]` : text
}

function portalHost() {
  return new URL(config.portalOrigin).hostname
}

function isReservedAddress(address = '') {
  if (net.isIP(address) !== 4) return false
  const parts = address.split('.').map(Number)
  const [a, b] = parts
  return (
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19))
  )
}

async function resolvePortalHost() {
  const host = portalHost()
  const system = await dns.lookup(host, { all: true, family: 4 }).catch((error) => ({
    error: error instanceof Error ? error.message : String(error),
  }))
  const resolver = new dns.Resolver()
  resolver.setServers(['223.5.5.5', '114.114.114.114'])
  const publicDns = await resolver.resolve4(host).catch((error) => ({
    error: error instanceof Error ? error.message : String(error),
  }))
  return {
    host,
    system: Array.isArray(system) ? system.map((item) => item.address) : [],
    systemError: Array.isArray(system) ? '' : system.error,
    publicDns: Array.isArray(publicDns) ? publicDns : [],
    publicDnsError: Array.isArray(publicDns) ? '' : publicDns.error,
  }
}

function portalNetworkMessage(diagnostics, errorMessage) {
  const reserved = diagnostics.system.filter(isReservedAddress)
  const dnsHint = reserved.length
    ? `当前 DNS 将 ${diagnostics.host} 解析到保留地址 ${reserved.join(', ')}，常见于代理/VPN 接管。`
    : ''
  const publicHint =
    diagnostics.publicDns.length && diagnostics.publicDns.some((address) => !diagnostics.system.includes(address))
      ? `公共 DNS 解析为 ${diagnostics.publicDns.join(', ')}。`
      : ''
  const actionHint =
    dnsHint || publicHint
      ? '请关闭或调整代理/VPN、切换网络后重试。'
      : 'DNS 已解析到公网地址，但门户连接超时；可能是当前出口网络到北京移动门户不稳定或被运营商侧限流，请稍后重试、切换网络，或提高 BMCC_PORTAL_REACHABILITY_TIMEOUT_MS。'
  return [
    `北京移动门户当前网络不可达：${errorMessage || 'TLS 握手失败'}`,
    dnsHint,
    publicHint,
    actionHint,
  ]
    .filter(Boolean)
    .join(' ')
}

function isTlsHandshakeDisconnect(error) {
  const message = error instanceof Error ? error.message : String(error || '')
  return message.includes('Client network socket disconnected before secure TLS connection was established')
}

function isPortalNetworkAttempt(attempt) {
  const text = JSON.stringify(attempt?.raw || {})
  return attempt?.status === 0 && (text.includes('ECONNRESET') || text.includes('TLS') || text.includes('network socket'))
}

export async function checkPortalReachability() {
  const diagnostics = await resolvePortalHost()
  const timeout = config.portalReachabilityTimeoutMs
  const maxAttempts = config.portalReachabilityAttempts
  await logEvent('login:portalReachability:start', { ...diagnostics, timeout, maxAttempts })
  try {
    const res = await requestWithJar({
      url: `${config.portalOrigin}/nwt/portal/checkLogin`,
      method: 'GET',
      headers: portalPageHeaders({
        Referer: loginReferer(),
      }),
      includeCookies: false,
      timeout,
      maxAttempts,
    })
    const ok = res.status >= 200 && res.status < 500
    const raw = { ...diagnostics, status: res.status, location: res.headers?.location || '' }
    await logEvent('login:portalReachability:done', raw)
    return {
      ok,
      raw,
      message: ok ? '' : `北京移动门户连通性检查失败 HTTP ${res.status}`,
      errorCode: ok ? '' : 'PORTAL_UNREACHABLE',
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    const raw = { ...diagnostics, status: 0, error: message, code: error?.code || '' }
    await logEvent('login:portalReachability:error', raw)
    return {
      ok: false,
      raw,
      message: portalNetworkMessage(diagnostics, message),
      errorCode: isTlsHandshakeDisconnect(error) ? 'PORTAL_TLS_UNREACHABLE' : 'PORTAL_UNREACHABLE',
    }
  }
}

async function tryPortalTouchLogin(session, { includeCookies, strategy }) {
  const url = portalTouchLoginUrl(session, strategy)
  await logEvent('login:portalTouchLogin:start', {
    sessionId: session.id,
    url,
    includeCookies,
    strategy,
  })
  try {
    const res = await requestWithJar({
      jar: session.jar,
      url,
      method: 'POST',
      headers: portalTouchLoginHeaders(session),
      data: '',
      includeCookies,
      timeout: config.portalTouchLoginTimeoutMs,
      maxAttempts: 2,
    })
    const raw = parsePortalTouchLoginBody(res.data)
    await logEvent('login:portalTouchLogin:done', {
      sessionId: session.id,
      includeCookies,
      strategy,
      status: res.status,
      location: res.headers?.location || '',
      raw: summarizePortalTouchLogin(raw),
    })
    return { ok: res.status >= 200 && res.status < 300 && hasPortalAccessToken(raw), res, raw }
  } catch (error) {
    await logEvent('login:portalTouchLogin:error', {
      sessionId: session.id,
      includeCookies,
      strategy,
      url,
      code: error?.code || '',
      message: error instanceof Error ? error.message : String(error),
    })
    return {
      ok: false,
      error,
      raw: { error: error instanceof Error ? error.message : String(error), code: error?.code || '' },
    }
  }
}

export async function prepareLoginPage(session) {
  const res = await requestWithJar({
    jar: session.jar,
    url: loginReferer(),
    method: 'GET',
    headers: {
      'User-Agent': config.userAgent,
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    },
  })
  session.loginPagePrepared = true
  await refreshSendFlag(session, 'loadSendflag')
  return {
    ok: res.status >= 200 && res.status < 400,
    data: { prepared: true },
    raw: { status: res.status },
    message: res.status >= 200 && res.status < 400 ? '' : '登录页初始化失败',
  }
}

async function ensureLoginPage(session) {
  if (session.loginPagePrepared) return
  await prepareLoginPage(session)
}

export async function checkBjNumber(session, phone) {
  await ensureLoginPage(session)
  const res = await requestWithJar({
    jar: session.jar,
    url: `${config.loginOrigin}/chkNumberBjAction.action`,
    method: 'POST',
    headers: loginHeaders(),
    data: encodeForm({ userName: rsaEncryptLogin(phone) }),
  })
  const text = normalizeBase64Maybe(res.data)
  const ok = text === 'true' || text === true
  return {
    ok: res.status >= 200 && res.status < 300 && ok,
    data: { isBjMobile: ok },
    raw: text,
    message: ok ? '' : '该号码未通过北京移动号码校验',
  }
}

export async function getCaptcha(session) {
  await ensureLoginPage(session)
  const timestamp = Date.now()
  const url = `${config.loginOrigin}/captchazh.htm?type=05&timestamp=${timestamp}`
  const res = await requestWithJar({
    jar: session.jar,
    url,
    method: 'GET',
    responseType: 'arraybuffer',
    headers: {
      'User-Agent': config.userAgent,
      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      Referer: loginReferer(),
    },
  })
  const type = res.headers['content-type'] || 'image/png'
  const base64 = Buffer.from(res.data).toString('base64')
  return {
    ok: res.status >= 200 && res.status < 300,
    data: { image: `data:${type};base64,${base64}`, timestamp },
    raw: { status: res.status, contentType: type },
  }
}

export async function refreshSendFlag(session, kind = 'sendflag') {
  const name = kind === 'loadSendflag' ? 'loadSendflag.htm' : 'sendflag.htm'
  const res = await requestWithJar({
    jar: session.jar,
    url: `${config.loginOrigin}/${name}?timestamp=${Date.now()}`,
    method: 'GET',
    responseType: 'arraybuffer',
    headers: {
      'User-Agent': config.userAgent,
      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      Referer: loginReferer(),
    },
  })
  return {
    ok: res.status >= 200 && res.status < 400,
    raw: { status: res.status, kind },
  }
}

export async function verifyCaptcha(session, inputCode) {
  const res = await requestWithJar({
    jar: session.jar,
    url: `${config.loginOrigin}/verifyCaptcha.htm`,
    method: 'POST',
    headers: loginHeaders(),
    data: encodeForm({ inputCode }),
  })
  const raw = parseJsonMaybeBase64(res.data)
  const ok = raw?.resultCode === '0'
  return {
    ok: res.status >= 200 && res.status < 300 && ok,
    data: { valid: ok },
    raw,
    message: ok ? '' : '图形验证码校验失败',
  }
}

export async function loadSmsToken(session, phone) {
  const res = await requestWithJar({
    jar: session.jar,
    url: `${config.loginOrigin}/loadToken.action`,
    method: 'POST',
    headers: loginHeaders(),
    data: encodeForm({ userName: rsaEncryptLogin(phone) }),
  })
  const raw = parseJsonMaybeBase64(res.data)
  const token = raw?.result || ''
  session.smsToken = token
  return {
    ok: res.status >= 200 && res.status < 300 && Boolean(token),
    data: { token },
    raw,
    message: token ? '' : '获取短信 token 失败',
  }
}

export async function sendLoginSms(session, { phone, captcha = '' }) {
  if (!session.smsToken) {
    const tokenResult = await loadSmsToken(session, phone)
    if (!tokenResult.ok) return tokenResult
  }
  await refreshSendFlag(session, 'loadSendflag')
  const res = await requestWithJar({
    jar: session.jar,
    url: `${config.loginOrigin}/sendRandomCodeActionbj.action`,
    method: 'POST',
    headers: loginHeaders({ 'Xa-before': session.smsToken }),
    data: encodeForm({
      userName: rsaEncryptLogin(phone),
      inputCode: rsaEncryptLogin(captcha),
      type: '01',
      channelID: config.channelId,
    }),
  })
  const text = normalizeBase64Maybe(res.data)
  const ok = String(text) === '0'
  const flag = await refreshSendFlag(session, 'sendflag')
  return {
    ok: res.status >= 200 && res.status < 300 && ok,
    data: { cooldownSeconds: 60 },
    raw: { code: text, sendflag: flag.raw },
    message: ok ? '' : smsSendMessage(text),
  }
}

function smsSendMessage(code) {
  const map = {
    4005: '手机号码有误',
    1: '短信随机码暂时不能发送，请一分钟后再试',
    2: '随机码获取达到上限',
    3: '短信发送次数过于频繁',
    4: '渠道 code 不能为空',
    5: '渠道 code 异常',
    6: '发送短信验证码失败',
  }
  return map[String(code)] || `发送登录短信失败：${code || '未知错误'}`
}

export async function touchLogin(session, { phone, code }) {
  const res = await requestWithJar({
    jar: session.jar,
    url: `${config.loginOrigin}/touchBjLogin.action`,
    method: 'POST',
    headers: loginHeaders({ Accept: '*/*' }),
    data: encodeForm({
      channelID: config.channelId,
      account: rsaEncryptLogin(phone),
      password: rsaEncryptLogin(code),
      pwdType: '02',
      accountType: '01',
      inputCode: '',
      smsPwd: '',
      backUrl: config.backUrl,
      isNew: '',
      rememberMe: '1',
      protocol: 'https:',
    }),
  })
  const raw = parseJsonMaybeBase64(res.data)
  const ok = raw?.result === '0' && raw?.artifact
  if (ok) {
    session.artifact = raw.artifact
    session.assertAcceptURL = raw.assertAcceptURL || ''
  }
  return {
    ok: res.status >= 200 && res.status < 300 && ok,
    data: {
      artifact: raw?.artifact,
      assertAcceptURL: raw?.assertAcceptURL,
      uid: raw?.uid,
    },
    raw,
    message: ok ? '' : raw?.desc || '登录失败',
  }
}

export async function visitPortalCheckLogin(session) {
  if (!session.artifact) {
    return { ok: false, message: '缺少 artifact，请先登录', errorCode: 'MISSING_ARTIFACT' }
  }
  const url = portalCheckLoginUrl(session)
  await logEvent('login:portalCheckLogin:start', {
    sessionId: session.id,
    url,
    hasArtifact: Boolean(session.artifact),
    hasAssertAcceptURL: Boolean(session.assertAcceptURL),
  })
  let res
  try {
    res = await requestWithJar({
      jar: session.jar,
      url,
      method: 'GET',
      headers: portalPageHeaders({
        Referer: loginReferer(),
      }),
      includeCookies: false,
      timeout: config.portalWarmTimeoutMs,
      maxAttempts: 2,
    })
  } catch (error) {
    await logEvent('login:portalCheckLogin:error', {
      sessionId: session.id,
      url,
      code: error?.code || '',
      message: error instanceof Error ? error.message : String(error),
    })
    return {
      ok: false,
      data: { visited: false, status: 0 },
      raw: { status: 0, location: '', error: error instanceof Error ? error.message : String(error) },
      message: '门户 checkLogin 访问失败，已跳过页面预热',
      skipped: true,
    }
  }
  session.portalCheckLoginVisited = true
  session.portalCheckLoginStatus = res.status
  await logEvent('login:portalCheckLogin:done', {
    sessionId: session.id,
    status: res.status,
    location: res.headers?.location || '',
  })
  return {
    ok: res.status >= 200 && res.status < 400,
    data: { visited: true, status: res.status },
    raw: { status: res.status, location: res.headers?.location || '' },
    message: res.status >= 200 && res.status < 400 ? '' : `门户 checkLogin HTTP ${res.status}`,
  }
}

export async function warmPortalBusinessPage(session) {
  await logEvent('login:businessPageWarm:start', {
    sessionId: session.id,
    url: config.backUrl,
    hasArtifact: Boolean(session.artifact),
  })
  let res
  try {
    res = await requestWithJar({
      jar: session.jar,
      url: config.backUrl,
      method: 'GET',
      headers: portalPageHeaders({
        Referer: portalCheckLoginUrl(session),
      }),
      timeout: config.portalWarmTimeoutMs,
      maxAttempts: 2,
    })
  } catch (error) {
    await logEvent('login:businessPageWarm:error', {
      sessionId: session.id,
      url: config.backUrl,
      code: error?.code || '',
      message: error instanceof Error ? error.message : String(error),
    })
    session.portalBusinessPageWarmed = false
    session.portalBusinessPageStatus = 0
    return {
      ok: false,
      data: { warmed: false, status: 0 },
      raw: { status: 0, location: '', error: error instanceof Error ? error.message : String(error) },
      message: '业务页预热失败，已跳过',
      skipped: true,
    }
  }
  session.portalBusinessPageWarmed = res.status >= 200 && res.status < 400
  session.portalBusinessPageStatus = res.status
  await logEvent('login:businessPageWarm:done', {
    sessionId: session.id,
    status: res.status,
    location: res.headers?.location || '',
  })
  return {
    ok: res.status >= 200 && res.status < 400,
    data: { warmed: res.status >= 200 && res.status < 400, status: res.status },
    raw: { status: res.status, location: res.headers?.location || '' },
    message: res.status >= 200 && res.status < 400 ? '' : `业务页预热 HTTP ${res.status}`,
  }
}

export async function exchangePortalToken(session) {
  if (!session.artifact) {
    return { ok: false, message: '缺少 artifact，请先登录', errorCode: 'MISSING_ARTIFACT' }
  }
  const checkLogin = await visitPortalCheckLogin(session)
  const attempts = []
  const strategies = ['ssoArtifact', 'harTouch', 'checkLoginRoute']
  let selected = null
  for (const strategy of strategies) {
    const withoutCookies = await tryPortalTouchLogin(session, { includeCookies: false, strategy })
    attempts.push({
      strategy,
      includeCookies: false,
      ok: withoutCookies.ok,
      status: withoutCookies.res?.status || 0,
      raw: summarizePortalTouchLogin(withoutCookies.raw),
    })
    if (withoutCookies.ok) {
      selected = withoutCookies
      break
    }
  }

  if (!selected) {
    for (const strategy of strategies) {
      const withCookies = await tryPortalTouchLogin(session, { includeCookies: true, strategy })
      attempts.push({
        strategy,
        includeCookies: true,
        ok: withCookies.ok,
        status: withCookies.res?.status || 0,
        raw: summarizePortalTouchLogin(withCookies.raw),
      })
      if (withCookies.ok) {
        selected = withCookies
        break
      }
    }
  }
  selected ||= { ok: false, raw: attempts.at(-1)?.raw || '', res: null }

  const raw = selected.raw
  const res = selected.res
  const ok = selected.ok
  if (ok) {
    session.accessToken = raw.access_token
    session.refreshToken = raw.refresh_token || ''
    session.accessTokenExpireAt = Date.now() + Number(raw.expires_in || 0) * 1000
    await warmPortalBusinessPage(session)
  }
  const networkAttempts = attempts.length > 0 && attempts.every(isPortalNetworkAttempt)
  const message = networkAttempts
    ? portalNetworkMessage(await resolvePortalHost(), attempts.at(-1)?.raw?.error || '')
    : '门户 token 换取失败：touchLogin 未返回 access_token'
  return {
    ok,
    data: { hasToken: ok, name: raw?.name || '' },
    raw: {
      checkLogin: checkLogin.raw,
      touchLogin: summarizePortalTouchLogin(raw),
      attempts,
      businessPage: session.portalBusinessPageStatus,
      status: res?.status || 0,
    },
    message: ok ? '' : message,
    errorCode: ok ? '' : networkAttempts ? 'PORTAL_TLS_UNREACHABLE' : 'PORTAL_TOKEN_FAILED',
  }
}

import { randomBytes, randomUUID } from 'node:crypto'
import { config } from '../config.js'
import { requestWithJar } from '../utils/http.js'
import { logEvent } from '../utils/logger.js'
import { warmPortalBusinessPage } from './loginClient.js'
import { ensureWafToken } from './wafClient.js'
import {
  decodePortalKeyPayload,
  decryptPortalBody,
  encryptPortalBody,
  encryptPortalKeyWithServerKey,
  encryptReplayVersion,
  randomPortalKey,
} from './cryptoService.js'

const MAX_WAF_REDIRECTS = 3

function portalHeaders(session, extra = {}) {
  const traceId = randomUUID().replaceAll('-', '')
  const traceContext = randomBytes(16).toString('hex')
  const spanId = randomBytes(8).toString('hex')
  return {
    'User-Agent': config.userAgent,
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Content-Type': 'application/json;charset=UTF-8',
    Origin: config.portalOrigin,
    Referer: `${config.portalOrigin}/nwt/portal/packageQuery?ssotouch2017=0`,
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    ...(session.accessToken ? { Authorization: `bearer ${session.accessToken}` } : {}),
    ...(session.wafToken ? { XEbtxIBt: session.wafToken } : {}),
    traceId,
    traceContext,
    traceparent: `00-${traceContext}-${spanId}-01`,
    ...extra,
  }
}

function withWaf(url, session) {
  if (!session.wafToken) return url
  const joiner = url.includes('?') ? '&' : '?'
  return `${url}${joiner}XEbtxIBt=${encodeURIComponent(session.wafToken)}`
}

function readWafTokenFromUrl(url) {
  try {
    const parsed = new URL(url)
    return parsed.searchParams.get('XEbtxIBt') || ''
  } catch {
    return ''
  }
}

export async function initPortalKey(session, options = {}) {
  await logEvent('portal:key:init:start', {
    sessionId: session.id,
    hasWafToken: Boolean(session.wafToken),
    wafRedirects: options.wafRedirects || 0,
  })
  if (!session.accessToken) {
    return { ok: false, message: '缺少门户 access_token，请先登录', errorCode: 'MISSING_ACCESS_TOKEN' }
  }
  if (!session.wafToken) {
    const waf = await ensureWafToken(session)
    if (!waf.ok) return waf
  }
  const url = withWaf(`${config.portalOrigin}/nwt/portal-bff/api/keys/v1.0/get`, session)
  const res = await requestWithJar({
    jar: session.jar,
    url,
    method: 'POST',
    headers: portalHeaders(session),
    data: '',
  })
  if (res.status >= 300 && res.status < 400) {
    const redirects = options.wafRedirects || 0
    if (redirects < MAX_WAF_REDIRECTS && isWafRedirectLocation(res.headers?.location)) {
      await logEvent('portal:key:init:wafRedirect', {
        sessionId: session.id,
        redirects,
        location: res.headers.location,
      })
      const handled = await handleWafRedirect(session, res.headers.location)
      if (!handled.ok) return handled
      return initPortalKey(session, { wafRedirects: redirects + 1 })
    }
    return {
      ok: false,
      message: redirectMessage(res, '门户密钥接口', session),
      errorCode: 'PORTAL_REDIRECT',
      raw: redirectRaw(res, session),
      status: res.status,
    }
  }
  let raw
  try {
    raw = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
  } catch {
    raw = res.data
  }

  const payload = decodePortalKeyPayload(raw?.data || raw?.result || raw)
  const serverKey = payload?.publicKey || payload?.pubKey || payload?.key || payload?.data || payload
  const portalKey = randomPortalKey()
  let dataToken = ''
  try {
    dataToken = encryptPortalKeyWithServerKey(portalKey, serverKey)
  } catch {
    // Some captured sessions already accept the bootstrap token returned by the page.
    dataToken = raw?.token || raw?.dataToken || ''
  }

  session.portalKey = portalKey
  session.dataToken = dataToken
  session.replayVersion = 0
  await logEvent('portal:key:init:done', {
    sessionId: session.id,
    status: res.status,
    hasPortalKey: Boolean(session.portalKey),
    hasDataToken: Boolean(session.dataToken),
    serverKeyType: typeof serverKey,
    serverKeyLength: typeof serverKey === 'string' ? serverKey.length : 0,
    dataTokenLength: session.dataToken ? session.dataToken.length : 0,
  })

  return {
    ok: res.status >= 200 && res.status < 300 && Boolean(session.portalKey),
    data: { ready: Boolean(session.portalKey), hasDataToken: Boolean(session.dataToken) },
    raw,
    message: session.portalKey ? '' : '初始化门户加密 key 失败',
  }
}

async function portalPost(session, path, data = {}) {
  await logEvent('portal:post:start', {
    sessionId: session.id,
    path,
    hasPortalKey: Boolean(session.portalKey),
    hasWafToken: Boolean(session.wafToken),
  })
  if (!session.portalBusinessPageWarmed && session.artifact) {
    await warmPortalBusinessPage(session)
  }
  if (!session.wafToken) {
    const waf = await ensureWafToken(session)
    if (!waf.ok) return waf
  }
  if (!session.portalKey) {
    const init = await initPortalKey(session)
    if (!init.ok) return init
  }
  let lastResult = null
  for (let redirects = 0; redirects <= MAX_WAF_REDIRECTS; redirects += 1) {
    lastResult = await encryptedPortalPost(session, path, data)
    if (!isRootRedirect(lastResult)) return lastResult

    await logEvent('portal:post:wafRedirect', {
      sessionId: session.id,
      path,
      redirects,
      location: lastResult.raw.location,
      wafTokenLength: session.wafToken ? session.wafToken.length : 0,
    })
    const handled = await handleWafRedirect(session, lastResult.raw.location)
    if (!handled.ok) return handled
    session.portalKey = ''
    const init = await initPortalKey(session)
    if (!init.ok) return init
  }
  return lastResult
}

async function encryptedPortalPost(session, path, data = {}) {
  const url = withWaf(`${config.portalOrigin}/nwt${path}`, session)
  const body = encryptPortalBody(data, session.portalKey)
  const replayVersion = encryptReplayVersion(session.replayVersion++, session.portalKey)
  const res = await requestWithJar({
    jar: session.jar,
    url,
    method: 'POST',
    headers: portalHeaders(session, {
      'X-DATA-TOKEN': session.dataToken,
      'X-REPLAY-VERSION': replayVersion,
    }),
    data: JSON.stringify(body),
  })
  if (res.status >= 300 && res.status < 400) {
    return {
      ok: false,
      data: null,
      raw: redirectRaw(res, session),
      status: res.status,
      message: redirectMessage(res, '门户接口', session),
      errorCode: 'PORTAL_REDIRECT',
    }
  }

  let raw = res.data
  let parsed = null
  try {
    parsed = decryptPortalBody(raw, session.portalKey)
  } catch {
    try {
      parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    } catch {
      parsed = raw
    }
  }
  const success = res.status >= 200 && res.status < 300
  return {
    ok: success,
    data: parsed?.data ?? parsed,
    raw: parsed,
    status: res.status,
    message: success ? '' : `门户接口 HTTP ${res.status}`,
  }
}

function isRootRedirect(result) {
  return result?.status === 302 && isWafRedirectLocation(result?.raw?.location)
}

function isWafRedirectLocation(location) {
  if (!location) return false
  try {
    const parsed = new URL(location)
    return parsed.origin === config.portalOrigin && parsed.pathname === '/'
  } catch {
    return false
  }
}

async function handleWafRedirect(session, location) {
  await logEvent('portal:wafRedirect:start', {
    sessionId: session.id,
    location,
    tokenInLocation: Boolean(readWafTokenFromUrl(location)),
  })
  let currentLocation = location
  let lastRaw = null
  for (let redirects = 0; redirects < MAX_WAF_REDIRECTS; redirects += 1) {
    const token = readWafTokenFromUrl(currentLocation)
    if (token) session.wafToken = token
    await logEvent('portal:wafRedirect:follow', {
      sessionId: session.id,
      redirects: redirects + 1,
      location: currentLocation,
      tokenFromLocation: Boolean(token),
      tokenLength: token ? token.length : 0,
    })
    const res = await requestWithJar({
      jar: session.jar,
      url: currentLocation,
      method: 'GET',
      headers: {
        'User-Agent': config.userAgent,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        Referer: `${config.portalOrigin}/nwt/portal/packageQuery?ssotouch2017=0`,
      },
    })
    lastRaw = {
      status: res.status,
      location: res.headers?.location || '',
      tokenFromLocation: Boolean(token),
      redirects: redirects + 1,
    }

    if (res.status >= 200 && res.status < 300) {
      await logEvent('portal:wafRedirect:done', { sessionId: session.id, ...lastRaw })
      return { ok: true, raw: lastRaw, message: '' }
    }

    if (res.status >= 300 && res.status < 400 && isWafRedirectLocation(res.headers?.location)) {
      currentLocation = res.headers.location
      continue
    }

    if (res.status >= 300 && res.status < 400) {
      await logEvent('portal:wafRedirect:done', { sessionId: session.id, ...lastRaw })
      return { ok: true, raw: lastRaw, message: '' }
    }

    return {
      ok: false,
      raw: lastRaw,
      message: `门户防护跳转落地失败 HTTP ${res.status}`,
      errorCode: 'WAF_REDIRECT_FAILED',
    }
  }
  if (!session.wafToken) {
    const waf = await ensureWafToken(session, { force: true })
    if (!waf.ok) return waf
  }
  return {
    ok: Boolean(session.wafToken),
    raw: lastRaw,
    message: session.wafToken ? '' : '门户防护跳转次数过多，未能落地 XEbtxIBt',
    errorCode: 'WAF_REDIRECT_FAILED',
  }
}

function redirectMessage(res, prefix, session) {
  const location = res.headers?.location
  if (res.status === 302 && isWafRedirectLocation(location)) {
    return session.wafToken
      ? `${prefix} 被门户防护重定向，当前 XEbtxIBt 可能已失效`
      : `${prefix} 被门户防护重定向，缺少 XEbtxIBt 防护 token`
  }
  return `${prefix} HTTP ${res.status}${location ? ` -> ${location}` : ''}`
}

function redirectRaw(res, session) {
  const body = typeof res.data === 'string' ? res.data : JSON.stringify(res.data)
  return {
    status: res.status,
    location: res.headers?.location || '',
    hasWafToken: Boolean(session.wafToken),
    wafTokenLength: session.wafToken ? session.wafToken.length : 0,
    tokenInLocation: Boolean(readWafTokenFromUrl(res.headers?.location || '')),
    body: body?.slice?.(0, 1000) || '',
  }
}

export async function getOnlineUserInfo(session) {
  const result = await portalPost(session, '/portal-bff/api/accountsj/v1.0/getOnlineUserInfo', {})
  if (result.ok) {
    const data = result.data || {}
    session.userInfo = {
      mobile: data.mobile || data.phoneNum || data.phone || data.tel || '',
      brand: data.brand || data.brandName || '',
      raw: data,
    }
  }
  return {
    ...result,
    data: session.userInfo,
  }
}

export async function queryPackage(session, options = '') {
  const pageVersion = typeof options === 'string' ? options : String(options?.pageVersion || '')
  const bgnMonth = normalizeMonthInput(typeof options === 'object' ? options?.bgnMonth : '')
  const endMonth = normalizeMonthInput(typeof options === 'object' ? options?.endMonth : '') || bgnMonth
  const payload = { pageVersion }
  if (bgnMonth) {
    payload.bgnMonth = bgnMonth
    payload.endMonth = endMonth
  }
  const result = await portalPost(session, '/portal-bff/api/packageQuery/v1.0/index', payload)
  if (!result.ok) return result
  return {
    ...result,
    data: normalizePackageData(result.data),
  }
}

export async function unsubscribePackage(session, business) {
  if (!session.userInfo) {
    const info = await getOnlineUserInfo(session)
    if (!info.ok) return info
  }
  const ywCode = firstString(business, ['ywCode', 'ywcode', 'offerId', 'offerid', 'code'])
  const index = firstString(business, ['field1', 'originalIndex', 'xh', 'index'])
  if (!ywCode) {
    return {
      ok: false,
      data: null,
      raw: { missing: 'ywCode' },
      status: 0,
      message: '当前业务缺少 ywCode/offerId，请输入 ywCode 后再退订',
      errorCode: 'MISSING_YWCODE',
    }
  }
  const payload = {
    phoneNum: firstString(business, ['phoneNum', 'mobile', 'phone']) || String(session.userInfo?.mobile || '').trim(),
    brand: firstString(business, ['brand', 'brandName']) || session.userInfo?.brand || '',
    field1: index,
    ywCode,
  }
  await logEvent('portal:unsubscribe:payload', {
    sessionId: session.id,
    category: business?.category || '',
    name: business?.name || business?.ywName || business?.offerName || business?.busiName || '',
    hasPhoneNum: Boolean(payload.phoneNum),
    hasBrand: Boolean(payload.brand),
    field1: payload.field1,
    ywCode: payload.ywCode,
  })
  const result = await portalPost(session, '/portal-bff/api/packageQuery/v1.0/unsubscribe', payload)
  const data = result.data || {}
  const resultText = firstString(data, ['resMsg', 'message', 'desc', 'resType', 'code'])
  const success =
    data.success === true ||
    data.resType === 'success' ||
    data.result === 'success' ||
    data.code === '0000' ||
    data.code === 'bizSuccess'
  return {
    ...result,
    data: {
      success,
      message: resultText || (success ? '退订成功' : '退订失败'),
      raw: data,
    },
  }
}

function normalizePackageData(data = {}) {
  const baseRaw = Array.isArray(data.ywztShowList) ? data.ywztShowList : []
  const packageRaw = Array.isArray(data.tcShowList) ? data.tcShowList : []
  const valueAddedRaw = Array.isArray(data.mwywList) ? data.mwywList : []
  return {
    raw: data,
    categories: {
      base: baseRaw.map((item, index) => normalizeBusinessItem(item, index, 'base')),
      package: packageRaw.map((item, index) => normalizeBusinessItem(item, index, 'package')),
      valueAdded: valueAddedRaw.map((item, index) => normalizeBusinessItem(item, index, 'valueAdded')),
    },
  }
}

function firstString(item, keys) {
  for (const key of keys) {
    const value = item?.[key]
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim()
  }
  return ''
}

function normalizeMonthInput(value) {
  const raw = String(value || '').trim()
  if (/^\d{4}-\d{2}$/.test(raw)) return raw
  if (/^\d{6}$/.test(raw)) return `${raw.slice(0, 4)}-${raw.slice(4, 6)}`
  return ''
}

function normalizeBusinessItem(item, index, category) {
  const isPackage = category === 'package'
  const isValueAdded = category === 'valueAdded'
  const name =
    firstString(
      item,
      isPackage
        ? ['offerName', 'ywName', 'productName', 'businessName', 'busiName', 'name', 'title', 'field0']
        : isValueAdded
        ? ['ywName', 'offerName', 'productName', 'businessName', 'busiName', 'name', 'title', 'field0']
        : ['busiName', 'ywName', 'offerName', 'productName', 'businessName', 'name', 'title', 'field0'],
    ) || `业务 ${index + 1}`
  const offerId = firstString(item, ['offerId', 'offerid'])
  const ywCode = firstString(item, ['ywCode', 'ywcode'])
  const effectiveDate = firstString(item, [
    'effectiveDate',
    'effectBeginTime',
    'dgDate',
    'validDate',
    'effTime',
    'startTime',
    'effectiveTime',
    'openTime',
    'field2',
  ])
  const expireDate = firstString(item, ['expireDate', 'effectEndTime', 'endTime', 'invalidDate'])
  const feeText = firstString(item, ['feeText', 'fee', 'price', 'charge', 'tariff', 'fy', 'ywms', 'offerRemark', 'field3'])
  return {
    id: `${category}-${index}`,
    category,
    originalIndex: index,
    field1: firstString(item, ['field1', 'xh']) || String(index),
    xh: firstString(item, ['xh']),
    name,
    effectiveDate: formatDate(effectiveDate),
    expireDate: formatDate(expireDate),
    feeText,
    statusText: firstString(item, ['busiState', 'state', 'status']),
    provider: firstString(item, ['tgs', 'provider', 'operator']),
    offerId,
    ywCode,
    code: ywCode || offerId,
    canUnsubscribe: true,
    raw: item,
  }
}

function formatDate(value) {
  if (!value) return ''
  const raw = String(value)
  if (/^\d{8}$/.test(raw)) return `${raw.slice(0, 4)}.${raw.slice(4, 6)}.${raw.slice(6, 8)}`
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10).replaceAll('-', '.')
  return raw.replaceAll('-', '.')
}

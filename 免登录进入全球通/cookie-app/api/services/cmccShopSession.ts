import { httpsRequestText } from './cmccHttp.js'
import { mergeCookieWithSetCookie, parseCookieHeader } from './cookieUtils.js'
import { buildShopLoginRequest } from './cmccShopCrypto.js'

const DEFAULT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'
const TOUCH_BACK_URL =
  'https://touch.10086.cn/i/mobile/mycoupons.html?vtAutoFlag=0&e=99&c=20&sign=ffffffe0'
const SHOP_BRIDGE_URL =
  'https://wx.10086.cn/website/bind/bindAccount/new?tokenKey=token&netUniChannelId=019020&netUniBackUrl=' +
  encodeURIComponent(TOUCH_BACK_URL)

export type ShopSessionExchangeResult = {
  ok: boolean
  status?: number
  message?: string
  cookie?: string
  cookieUpdated?: boolean
  fields?: string[]
  finalUrl?: string
  steps: Array<{ name: string; status: number; cookieUpdated: boolean }>
}

function headerValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function mergeCookie(cookie: string, setCookie: string | string[] | undefined): {
  cookie: string
  changed: boolean
} {
  return mergeCookieWithSetCookie({ cookie, setCookie })
}

function parseJson(text: string): Record<string, unknown> | null {
  try {
    const value = JSON.parse(text) as unknown
    return value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null
  } catch {
    return null
  }
}

function isSuccessPayload(payload: Record<string, unknown> | null): boolean {
  if (!payload) return false
  const code = String(payload.retCode ?? payload.code ?? '')
  return !code || code.padStart(6, '0') === '000000'
}

export function shopCookieFields(cookie: string): string[] {
  const fields = parseCookieHeader(cookie)
  return ['d.sid', 'channel', 'jsessionid-cmcc', 'is_login', 'mobiletoken'].filter((name) =>
    fields.has(name),
  )
}

export function hasShopSessionCookie(cookie: string): boolean {
  const fields = parseCookieHeader(cookie)
  return Boolean(fields.get('mobiletoken') || fields.get('jsessionid-cmcc'))
}

export async function exchange10086CookieToShop(args: {
  cookie: string
}): Promise<ShopSessionExchangeResult> {
  let cookie = String(args.cookie || '').trim().replace(/^cookie:\s*/i, '')
  const steps: ShopSessionExchangeResult['steps'] = []
  if (!cookie || /[\r\n]/.test(cookie) || cookie.length > 32 * 1024) {
    return { ok: false, message: '10086 Cookie 格式无效', cookie, steps }
  }

  try {
    const bridge = await httpsRequestText({
      url: SHOP_BRIDGE_URL,
      method: 'GET',
      headers: {
        'User-Agent': DEFAULT_UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        Referer: 'https://wx.10086.cn/website/spa/main/personCenter',
        Cookie: cookie,
      },
      timeoutMs: 20_000,
    })
    const bridgeMerge = mergeCookie(cookie, bridge.headers['set-cookie'])
    cookie = bridgeMerge.cookie
    steps.push({ name: '10086_TO_TOUCH', status: bridge.statusCode, cookieUpdated: bridgeMerge.changed })

    const location = headerValue(bridge.headers.location)
    if (bridge.statusCode < 300 || bridge.statusCode >= 400 || !location) {
      return {
        ok: false,
        status: bridge.statusCode,
        message: '10086 未返回 touch 登录跳转地址，Cookie 可能已失效',
        cookie,
        cookieUpdated: bridgeMerge.changed,
        fields: shopCookieFields(cookie),
        steps,
      }
    }

    const finalUrl = new URL(location, SHOP_BRIDGE_URL).toString()
    const token = new URL(finalUrl).searchParams.get('token')?.trim() || ''
    if (!token) {
      return {
        ok: false,
        status: bridge.statusCode,
        message: 'touch 跳转地址缺少登录 token',
        cookie,
        cookieUpdated: bridgeMerge.changed,
        fields: shopCookieFields(cookie),
        finalUrl,
        steps,
      }
    }

    const page = await httpsRequestText({
      url: finalUrl,
      method: 'GET',
      headers: {
        'User-Agent': DEFAULT_UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        Referer: 'https://wx.10086.cn/',
        Cookie: cookie,
      },
      timeoutMs: 20_000,
    })
    const pageMerge = mergeCookie(cookie, page.headers['set-cookie'])
    cookie = pageMerge.cookie
    steps.push({ name: 'TOUCH_PAGE', status: page.statusCode, cookieUpdated: pageMerge.changed })
    if (page.statusCode < 200 || page.statusCode >= 400) {
      return {
        ok: false,
        status: page.statusCode,
        message: `touch 登录页访问失败（HTTP ${page.statusCode}）`,
        cookie,
        cookieUpdated: bridgeMerge.changed || pageMerge.changed,
        fields: shopCookieFields(cookie),
        finalUrl,
        steps,
      }
    }

    const body = JSON.stringify(buildShopLoginRequest({ token, backUrl: finalUrl }))
    const initialized = await httpsRequestText({
      url: 'https://touch.10086.cn/i/v1/auth/initMobileMessage',
      method: 'POST',
      headers: {
        'User-Agent': DEFAULT_UA,
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Origin: 'https://touch.10086.cn',
        Referer: finalUrl,
        Cookie: cookie,
      },
      body,
      timeoutMs: 20_000,
    })
    const initMerge = mergeCookie(cookie, initialized.headers['set-cookie'])
    cookie = initMerge.cookie
    steps.push({ name: 'TOUCH_INIT', status: initialized.statusCode, cookieUpdated: initMerge.changed })
    const payload = parseJson(initialized.bodyText)
    const ok =
      initialized.statusCode >= 200 &&
      initialized.statusCode < 300 &&
      isSuccessPayload(payload) &&
      hasShopSessionCookie(cookie)
    const message = String(payload?.retMsg ?? payload?.message ?? '').trim()
    return {
      ok,
      status: initialized.statusCode,
      message: ok ? '已将 10086 Cookie 置换为 touch/shop 登录态' : message || 'touch 登录态初始化失败',
      cookie,
      cookieUpdated: bridgeMerge.changed || pageMerge.changed || initMerge.changed,
      fields: shopCookieFields(cookie),
      finalUrl,
      steps,
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'touch/shop 登录态置换失败',
      cookie,
      fields: shopCookieFields(cookie),
      steps,
    }
  }
}

export const __test__ = {
  hasShopSessionCookie,
  shopCookieFields,
  bridgeUrl: SHOP_BRIDGE_URL,
}

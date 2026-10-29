import { buildAigouSsoLinkFrom10086Cookie } from './aigouSession.js'
import { cocAuroraEncrypt, createCocAuroraContext } from './cmccBenefitOrderCrypto.js'
import { httpsRequestText } from './cmccHttp.js'
import { buildCookieHeader, mergeCookieWithSetCookie, parseCookieHeader } from './cookieUtils.js'
import { AGE_FEED_DEFAULTS } from '../../shared/ageFeed.js'

const COC_ORIGIN = 'https://dev.coc.10086.cn'
const COC_API_ORIGIN = `${COC_ORIGIN}/coc/`
const DEFAULT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'

export type CocPackageTarget = 'building_bricks' | 'diamond_package' | 'age_feed' | 'smart_life' | 'five_ga' | 'starbucks_membership'

export type CocPackageSessionRecord = {
  target: CocPackageTarget
  cookie: string
  token: string
  loginUrl: string
  userId: string
  maskedMobile?: string
  provinceCode: string
  cityCode?: string
}

export type CocPackageSessionMap = Partial<Record<CocPackageTarget, CocPackageSessionRecord>>

type TargetConfig = {
  name: string
  path: string
  pageId: string
  channelId: string
  productCode?: string
  encryptedLogin: boolean
  validatePath: string
  validateBody: (session: CocPackageSessionRecord) => Record<string, unknown>
}

export const COC_PACKAGE_TARGETS: Record<CocPackageTarget, TargetConfig> = {
  building_bricks: {
    name: '积木套餐',
    path: '/coc/web2/buildingBricksPak/',
    pageId: '1610185761689767936',
    channelId: 'P00000001555',
    encryptedLogin: true,
    validatePath: 'editor/common/proxy/toC/building/cost/info/query',
    validateBody: () => ({}),
  },
  diamond_package: {
    name: '卓越钻石',
    path: '/coc/web6/diamondPackage/',
    pageId: '1889216886548430848',
    channelId: 'P00000078835',
    productCode: '1000000100290',
    encryptedLogin: false,
    validatePath: 'personalization/page/getDefault',
    validateBody: () => ({
      pageId: '1889216886548430848',
      touchCode: 'P00000078835',
      handSingle: 0,
    }),
  },
  age_feed: {
    name: '全球通网龄直升',
    path: '/coc/web6/ageFeedPackage/',
    pageId: AGE_FEED_DEFAULTS.pageId,
    channelId: AGE_FEED_DEFAULTS.touchCode,
    encryptedLogin: false,
    validatePath: 'activities/common/queryUserInfoNew',
    validateBody: () => ({}),
  },
  smart_life: {
    name: '智臻会员 COC版',
    path: '/coc/web6/szhydg/',
    pageId: '1969953714210263040',
    channelId: 'P00000044852',
    productCode: '500000051649',
    encryptedLogin: true,
    validatePath: 'pkg/smart/life/queryTariff',
    validateBody: (session) => ({
      provinceCode: session.provinceCode,
      productCode: '500000051649',
    }),
  },
  five_ga: {
    name: '全球通 5GA',
    path: '/coc/web6/applet5gaH5/home',
    pageId: '1879370128044171264',
    channelId: 'P00000055499',
    productCode: '500000051295',
    encryptedLogin: true,
    validatePath: 'card/bundling/auxiliary/selectFiveGAProduct',
    validateBody: (session) => ({
      pageId: '1879370128044171264',
      touchCode: 'P00000055499',
      userId: session.userId,
    }),
  },
  starbucks_membership: {
    name: '星巴克联合会员',
    path: '/coc/canvas/package-h5-canvas/online/xbklhhy',
    pageId: '1878635095121567744',
    channelId: 'P00000132000',
    productCode: '100000098326',
    encryptedLogin: true,
    validatePath: 'personalization/page/getDefault',
    validateBody: () => ({
      pageId: '1878635095121567744',
      touchCode: 'P00000132000',
      handSingle: 0,
    }),
  },
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

function parseJson(value: string): JsonRecord | undefined {
  try {
    return asRecord(JSON.parse(value) as unknown)
  } catch {
    return undefined
  }
}

export function isCocPackageTarget(value: string): value is CocPackageTarget {
  return value === 'building_bricks'
    || value === 'diamond_package'
    || value === 'age_feed'
    || value === 'smart_life'
    || value === 'five_ga'
    || value === 'starbucks_membership'
}

export function buildCocPackageUrl(target: CocPackageTarget, ticket?: string): string {
  const config = COC_PACKAGE_TARGETS[target]
  const url = new URL(config.path, COC_ORIGIN)
  url.searchParams.set('pageId', config.pageId)
  url.searchParams.set('channelId', config.channelId)
  if (ticket) url.searchParams.set('token', ticket)
  return url.toString()
}

function ticketFromUrl(url: string): string {
  try {
    return new URL(url).searchParams.get('token') || ''
  } catch {
    return ''
  }
}

export async function buildCocPackageSsoLinkFrom10086Cookie(
  cookie: string,
  target: CocPackageTarget,
): Promise<{
  ok: boolean
  status?: number
  errorCode?: string
  message?: string
  ssoUrl?: string
  cookie?: string
  cookieUpdated?: boolean
}> {
  const issued = await buildAigouSsoLinkFrom10086Cookie(cookie)
  const ticket = issued.ssoUrl ? ticketFromUrl(issued.ssoUrl) : ''
  if (!issued.ok || !ticket) {
    return {
      ok: false,
      status: issued.status,
      errorCode: issued.errorCode,
      message: issued.message || `10086 CK 未能生成${COC_PACKAGE_TARGETS[target].name}登录票据`,
      cookie: issued.cookie,
      cookieUpdated: issued.cookieUpdated,
    }
  }
  return {
    ok: true,
    status: issued.status,
    ssoUrl: buildCocPackageUrl(target, ticket),
    cookie: issued.cookie,
    cookieUpdated: issued.cookieUpdated,
  }
}

async function cocRequest(args: {
  session: CocPackageSessionRecord
  path: string
  body: Record<string, unknown>
}): Promise<{ status: number; payload?: JsonRecord; cookie: string }> {
  const response = await httpsRequestText({
    url: new URL(args.path, COC_API_ORIGIN).toString(),
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Origin: COC_ORIGIN,
      Referer: args.session.loginUrl,
      'User-Agent': DEFAULT_UA,
      Cookie: args.session.cookie,
    },
    body: JSON.stringify(args.body),
    timeoutMs: 15_000,
  })
  const merged = mergeCookieWithSetCookie({
    cookie: args.session.cookie,
    setCookie: response.headers['set-cookie'],
  })
  return {
    status: response.statusCode,
    payload: parseJson(response.bodyText),
    cookie: merged.cookie,
  }
}

export async function validateCocPackageSession(session: CocPackageSessionRecord): Promise<{
  ok: boolean
  status: number
  message?: string
  cookie?: string
}> {
  if (!isCocPackageTarget(session.target) || !session.cookie || !session.token || !session.userId || !session.provinceCode) {
    return { ok: false, status: 0, message: 'COC 订购凭证字段不完整' }
  }
  const config = COC_PACKAGE_TARGETS[session.target]
  const response = await cocRequest({
    session,
    path: config.validatePath,
    body: config.validateBody(session),
  })
  const ok = response.status === 200 && text(response.payload?.code) === '0'
  return {
    ok,
    status: response.status,
    message: ok ? undefined : text(response.payload?.message) || `${config.name}凭证验活失败`,
    cookie: response.cookie,
  }
}

export async function exchange10086CookieToCocPackage(
  cookie: string,
  target: CocPackageTarget,
): Promise<{
  ok: boolean
  status?: number
  message?: string
  session?: CocPackageSessionRecord
  baseCookie?: string
  baseCookieUpdated?: boolean
}> {
  const link = await buildCocPackageSsoLinkFrom10086Cookie(cookie, target)
  if (!link.ok || !link.ssoUrl || !link.cookie) return { ...link }

  const config = COC_PACKAGE_TARGETS[target]
  const ticket = ticketFromUrl(link.ssoUrl)
  const loginBody: Record<string, unknown> = { verifyType: 18, ext: ticket }
  if (target === 'diamond_package' || target === 'age_feed') {
    loginBody.smsCodeTypeEnum = '502'
    if (config.productCode) loginBody.productCode = config.productCode
  }
  let requestBody: Record<string, unknown> = loginBody
  const encryptionHeaders: Record<string, string> = {}
  if (config.encryptedLogin) {
    const aurora = createCocAuroraContext()
    requestBody = { cocEnContent: cocAuroraEncrypt(loginBody, aurora.key) }
    encryptionHeaders['coc-en-version'] = '1486234121417629696'
    encryptionHeaders['coc-aurora'] = aurora.encryptedKey
    encryptionHeaders['coc-aurora-v'] = '2'
  }
  const loginResponse = await httpsRequestText({
    url: new URL('user/loginCheck', COC_API_ORIGIN).toString(),
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Origin: COC_ORIGIN,
      Referer: link.ssoUrl,
      'User-Agent': DEFAULT_UA,
      Cookie: link.cookie,
      ...encryptionHeaders,
    },
    body: JSON.stringify(requestBody),
    timeoutMs: 15_000,
  })
  const payload = parseJson(loginResponse.bodyText)
  const data = asRecord(payload?.data)
  const token = text(data?.token)
  const userId = text(data?.userId)
  const provinceCode = text(data?.provinceCode)
  if (loginResponse.statusCode !== 200 || text(payload?.code) !== '0' || !token || !userId || !provinceCode) {
    return {
      ok: false,
      status: loginResponse.statusCode,
      message: text(payload?.message) || `10086 CK 未能置换为${config.name} Token`,
      baseCookie: link.cookie,
      baseCookieUpdated: link.cookieUpdated,
    }
  }
  const merged = mergeCookieWithSetCookie({
    cookie: link.cookie,
    setCookie: loginResponse.headers['set-cookie'],
  })
  const cookies = parseCookieHeader(merged.cookie)
  cookies.set('User-Token', token)
  const session: CocPackageSessionRecord = {
    target,
    cookie: buildCookieHeader(cookies),
    token,
    loginUrl: link.ssoUrl,
    userId,
    maskedMobile: text(data?.maskedMobile) || undefined,
    provinceCode,
    cityCode: text(data?.cityCode) || undefined,
  }
  const validated = await validateCocPackageSession(session)
  if (!validated.ok) {
    return {
      ok: false,
      status: validated.status,
      message: validated.message,
      baseCookie: link.cookie,
      baseCookieUpdated: link.cookieUpdated,
    }
  }
  session.cookie = validated.cookie || session.cookie
  return {
    ok: true,
    status: validated.status,
    message: `已置换并验证${config.name}凭证`,
    session,
    baseCookie: link.cookie,
    baseCookieUpdated: link.cookieUpdated,
  }
}

export const __test__ = {
  ticketFromUrl,
}

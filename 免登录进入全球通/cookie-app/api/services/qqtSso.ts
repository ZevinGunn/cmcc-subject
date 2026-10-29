import { httpsRequestText, type HttpResponse } from './cmccHttp.js'
import { cmccActivateFareBalance } from './cmcc10086.js'
import { buildCookieHeader } from './cookieUtils.js'
import { ensureYunpanGlobalToken, buildCloudBusinessLink, buildAccountYunpanBusinessLink } from './yunpanSso.js'
import type { AccountRecord } from './accountsStore.js'

export const CMCC_HOME = 'https://wx.10086.cn/website/spa/main/newHome'
const QQT_BASE = 'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/'
const WX_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
type Target = '017018' | '001216'
type Transport = typeof httpsRequestText

class QqtTicketRejected extends Error {}
export class QqtTicketEmpty extends Error {
  constructor() { super('全球通暂未返回业务票据，请稍后重试；原登录凭据已保留'); this.name = 'QqtTicketEmpty' }
}

export async function issueQqtBusinessTicket(accessToken: string, target: Target, request: Transport = httpsRequestText) {
  if (!accessToken || /[\r\n;]/.test(accessToken)) throw new Error('全球通 Token 无效，请重新登录')
  if (target !== '017018' && target !== '001216') throw new Error('不支持的 SSO 目标')
  const response = await request({ url: QQT_BASE + 'getCmpSSOTokenNew.action', method: 'POST',
    headers: { Cookie: `access_token=${accessToken}`, Origin: 'https://qqt.cmicrwx.cn',
      Referer: QQT_BASE + 'res/wap/xdrNormal.html', 'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: new URLSearchParams({ targetid: target }).toString(), timeoutMs: 15000 })
  let payload: { status?: unknown; data?: unknown }
  try { payload = JSON.parse(response.bodyText) } catch { throw new Error('全球通换票响应格式异常') }
  console.info('[qqt-sso]', JSON.stringify({ target, httpStatus: response.statusCode, businessStatus: payload.status }))
  if (response.statusCode !== 200) throw new Error('全球通换票服务暂不可用，请稍后重试')
  if (payload.status !== '1') throw new QqtTicketRejected('全球通未授权业务票据，请重新登录或置换全球通 Token')
  if (typeof payload.data === 'string' && !payload.data.trim()) {
    // The official utils_index.js also reads getCmpSSOParam after ticket
    // initialization. Its default audience is WX; never use it for cloud apps.
    if (target !== '017018') throw new QqtTicketEmpty()
    const fallback = await request({ url: QQT_BASE + 'getCmpSSOParam.action', method: 'POST',
      headers: { Cookie: `access_token=${accessToken}`, Origin: 'https://qqt.cmicrwx.cn',
        Referer: QQT_BASE + 'res/wap/xdrNormal.html?sspId=66050', 'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: new URLSearchParams({ channelCode: '66050', levelPass: 'false' }).toString(), timeoutMs: 15000 })
    if (fallback.statusCode !== 200) throw new Error('全球通备用换票服务暂不可用，请稍后重试')
    let data: { status?: unknown; data?: { token?: unknown } }
    try { data = JSON.parse(fallback.bodyText) } catch { throw new Error('全球通备用换票响应格式异常') }
    if (data.status !== '1') throw new QqtTicketRejected('全球通备用换票未授权，请重新验证全球通登录')
    if (typeof data.data?.token !== 'string' || !data.data.token.trim()) throw new QqtTicketEmpty()
    if (/[\r\n;]/.test(data.data.token)) throw new Error('全球通未返回有效业务票据')
    console.info('[qqt-sso]', JSON.stringify({ target, phase: 'official_param_fallback', success: true }))
    return data.data.token
  }
  if (typeof payload.data !== 'string' || /[\r\n]/.test(payload.data)) throw new Error('全球通未返回有效业务票据')
  return payload.data
}

export async function isQqtTokenAuthenticated(accessToken: string, request: Transport = httpsRequestText): Promise<boolean> {
  const response = await request({ url: QQT_BASE + 'checkLoginStatus.action', method: 'GET',
    headers: { Cookie: `access_token=${accessToken}`, 'X-Requested-With': 'XMLHttpRequest',
      Referer: QQT_BASE + 'res/wap/xdrNormal.html' }, timeoutMs: 12000 })
  if (response.statusCode !== 200) throw new Error('全球通登录状态暂不可查询')
  let payload: { status?: unknown; msg?: string }
  try { payload = JSON.parse(response.bodyText) } catch { throw new Error('全球通登录状态响应异常') }
  if (payload.status === '1') return true
  if (payload.status === '0' && /未登录|登录失效|请先登录/.test(payload.msg || '')) return false
  throw new Error('全球通登录状态未确认')
}

// Only an explicit business rejection permits one Yunpan renewal. Transport errors
// must not start a browser or loop through authentication on every network failure.
export async function issueAccountQqtTicket(rec: AccountRecord, target: Target,
  dependencies: { issue: typeof issueQqtBusinessTicket; renew: typeof ensureYunpanGlobalToken;
    isAuthenticated?: typeof isQqtTokenAuthenticated } = {
    issue: issueQqtBusinessTicket, renew: ensureYunpanGlobalToken, isAuthenticated: isQqtTokenAuthenticated,
  }) {
  if (rec.disabledAt) throw new Error('账号已禁用，请先启用账号')
  let current = rec
  if (!current.qqtAccessToken && current.yunpanSession) current = await dependencies.renew(current)
  if (!current.qqtAccessToken) throw new Error('请先完成云盘或全球通登录')
  try { return await dependencies.issue(current.qqtAccessToken, target) }
  catch (error) {
    if (!current.yunpanSession) throw error
    if (error instanceof QqtTicketEmpty) {
      // Blank tickets can mean target rejection OR an expired access token.
      // Confirm the latter before renewing; never infer expiry from emptiness.
      if (!dependencies.isAuthenticated || await dependencies.isAuthenticated(current.qqtAccessToken)) throw error
    } else if (!(error instanceof QqtTicketRejected)) throw error
    current = await dependencies.renew(current, true)
    return dependencies.issue(current.qqtAccessToken!, target)
  }
}

export function buildQqt10086Url(ticket: string) {
  const url = new URL('https://wx.10086.cn/website/sso/netUni')
  url.search = new URLSearchParams({ netUniBackUrl: CMCC_HOME, net_token: ticket }).toString()
  return url.toString()
}

function assertWxUrl(value: string) {
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.hostname !== 'wx.10086.cn' || url.port || url.username || url.password) {
    throw new Error('10086 SSO 返回了非官方跳转地址')
  }
  return url.toString()
}

function matchesSsoPhone(actual: unknown, expected: string) {
  if (typeof actual !== 'string') return false
  // Official newHome masks telephone; compare its documented representation.
  // Expected masked values are also supported for read-only HAR verification.
  if (/^1\d{10}$/.test(expected)) return actual === expected || actual === expected.slice(0, 3) + '****' + expected.slice(-4)
  return /^1\d{2}\*{4}\d{4}$/.test(expected) && actual === expected
}

// A fresh, single-origin jar: never import old WX/QQT cookies. Only root-path WX
// cookies are retained, since this CK is later used by several WX business paths.
function collectWxCookies(response: HttpResponse, jar: Map<string, string>, expiries: Map<string, number>, now = Date.now()) {
  const raw = response.headers['set-cookie']
  for (const line of Array.isArray(raw) ? raw : raw ? [raw] : []) {
    const [pair, ...attributes] = line.split(';')
    const index = pair.indexOf('=')
    if (index < 1) continue
    const name = pair.slice(0, index).trim()
    const value = pair.slice(index + 1).trim()
    const attrs = new Map(attributes.map(item => {
      const split = item.indexOf('=')
      return split < 0 ? [item.trim().toLowerCase(), ''] : [item.slice(0, split).trim().toLowerCase(), item.slice(split + 1).trim()]
    }))
    const domain = attrs.get('domain')?.replace(/^\./, '').toLowerCase()
    if (domain && domain !== 'wx.10086.cn' && domain !== '10086.cn') continue
    if (attrs.get('path') !== '/') continue
    if (!/^[\w.-]+$/.test(name) || /[\r\n;]/.test(value)) continue
    let expires = attrs.has('expires') ? Date.parse(attrs.get('expires')!) : NaN
    if (attrs.has('max-age') && /^-?\d+$/.test(attrs.get('max-age')!)) expires = now + Number(attrs.get('max-age')) * 1000
    if (!value || (Number.isFinite(expires) && expires <= now)) { jar.delete(name); expiries.delete(name); continue }
    jar.set(name, value)
    if (Number.isFinite(expires)) expiries.set(name, expires)
    else expiries.delete(name)
  }
}

export async function collect10086CookieByQqtTicket(args: { ticket: string; phone: string },
  dependencies = { request: httpsRequestText, activate: cmccActivateFareBalance }) {
  const jar = new Map<string, string>()
  const expiries = new Map<string, number>()
  let url = buildQqt10086Url(args.ticket)
  for (let hop = 0; ; hop += 1) {
    assertWxUrl(url)
    const response = await dependencies.request({ url, method: 'GET', headers: {
      ...(jar.size ? { Cookie: buildCookieHeader(jar) } : {}),
      'User-Agent': WX_UA,
    }, timeoutMs: 15000 })
    collectWxCookies(response, jar, expiries)
    if (response.statusCode >= 300 && response.statusCode < 400) {
      const location = response.headers.location
      if (hop >= 3 || typeof location !== 'string') throw new Error('10086 SSO 跳转异常')
      url = assertWxUrl(new URL(location, url).toString())
      continue
    }
    if (response.statusCode !== 200) throw new Error('10086 SSO 服务暂不可用')
    break
  }
  if (!jar.get('shareToken') || !jar.get('d.sid')) throw new Error('10086 未下发新登录 Cookie，票据可能已失效')
  // Always verify the fixed home, irrespective of upstream redirect destinations.
  const home = await dependencies.request({ url: CMCC_HOME, method: 'GET', headers: { Cookie: buildCookieHeader(jar),
    'User-Agent': WX_UA, Referer: CMCC_HOME, Origin: 'https://wx.10086.cn' }, timeoutMs: 15000 })
  collectWxCookies(home, jar, expiries)
  const match = home.bodyText.match(/var\s+user\s*=\s*([\s\S]*?)\s*;\s*var\s+serverTime/)
  let user: { telephone?: unknown; csrf?: unknown } = {}
  try { user = match ? JSON.parse(match[1]) : {} } catch { /* reject below */ }
  console.info('[qqt-sso]', JSON.stringify({ target: '017018', phase: 'verify_home', httpStatus: home.statusCode,
    phoneMatches: matchesSsoPhone(user.telephone, args.phone), hasCsrf: typeof user.csrf === 'string' && !!user.csrf }))
  if (home.statusCode !== 200 || !matchesSsoPhone(user.telephone, args.phone) || typeof user.csrf !== 'string' || !user.csrf) {
    throw new Error('10086 登录身份未确认或与当前账号不一致，未保存 Cookie')
  }
  const cookie = buildCookieHeader(jar)
  const activation = await dependencies.activate(cookie, undefined, CMCC_HOME)
  let payload: { status?: unknown; data?: { resultCode?: unknown; resultData?: unknown } } = {}
  try { payload = JSON.parse(activation.decrypted || '{}') } catch { /* reject below */ }
  console.info('[qqt-sso]', JSON.stringify({ target: '017018', phase: 'verify_core_query', httpStatus: activation.status,
    transportOk: activation.ok, businessOk: (payload.status === 0 || payload.status === '0') && payload.data?.resultCode === '0000' }))
  if (!activation.ok || (payload.status !== 0 && payload.status !== '0') || payload.data?.resultCode !== '0000' || !payload.data.resultData) {
    throw new Error('10086 核心查询未确认登录成功，未保存 Cookie')
  }
  const expires = Math.min(expiries.get('shareToken') ?? NaN, expiries.get('d.sid') ?? NaN)
  if (!Number.isFinite(expires) || expires <= Date.now()) throw new Error('10086 未返回有效 Cookie 期限，未保存 Cookie')
  console.info('[qqt-sso]', JSON.stringify({ target: '017018', freshContext: true, identityVerified: true, coreQueryVerified: true, cookieNames: [...jar.keys()] }))
  return { cookie, cookieExpireAt: new Date(expires).toISOString(), activationInfo: payload as Record<string, unknown> }
}

export async function buildAccountCloudLink(rec: AccountRecord, target: 'cloudphone' | 'capp', dependencies = {
  buildYunpan: buildAccountYunpanBusinessLink, issueQqt: issueAccountQqtTicket, buildCloud: buildCloudBusinessLink,
}) {
  if (rec.disabledAt) throw new Error('账号已禁用，请先启用账号')
  // Cloud credentials can issue 001216 directly. Do not route them through a
  // cached QQT token: QQT can return status=1 with an empty business ticket.
  if (rec.yunpanSession) return dependencies.buildYunpan(rec, target)
  const ticket = await dependencies.issueQqt(rec, '001216')
  const data = await dependencies.buildCloud(ticket, target, '02190')
  return { ...data, source: 'fresh-qqt-sso' }
}

export const __test__ = { collectWxCookies, assertWxUrl, matchesSsoPhone, QqtTicketRejected }

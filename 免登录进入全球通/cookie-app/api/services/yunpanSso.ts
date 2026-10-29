import crypto from 'node:crypto'
import fs from 'node:fs'
import { chromium, devices } from 'playwright'
import { httpsRequestText } from './cmccHttp.js'
import { issueYunpanBusinessTicket, YunpanAuthenticationExpired } from './yunpan10086.js'
import { getAccountById, setAccountQqtToken, setAccountCookie, setAccountActivationInfo, touchAccountQqtTokenCheckedAt, recordAccountYunpanVerification } from './accountsStore.js'
import type { AccountRecord, YunpanSessionRecord } from './accountsStore.js'

export type YunpanDestination = 'global' | 'cloudphone' | 'capp'

export function buildYunpanGlobalUrl(ticket: string, campaign = '66050'): string {
  if (!/^\d{3,12}$/.test(campaign)) throw new Error('全球通活动编号无效')
  const url = new URL('https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/new/ssoTokenLogin.action')
  url.search = new URLSearchParams({ token: ticket, targetSourceId: '001191', enableShare: '1',
    backUrl: `https://qqt.cmicrwx.cn/2016tyjf/xdractivity?sspId=${campaign}` }).toString()
  return url.toString()
}

export function cloudPhoneRequestHeaders(token = '', now = Date.now()) {
  const date = new Date(now)
  const timestamp = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((v, i) => i ? String(v).padStart(2, '0') : String(v)).join('')
  const requestId = timestamp + crypto.randomBytes(4).toString('hex')
  const appId = '3099801'
  const sign = crypto.createHash('md5').update(requestId + appId + token + 'esdkabncgfsfkmlondn' + now).digest('hex')
  return { 'Content-Type': 'application/json; charset=utf-8', Accept: 'application/json',
    Origin: 'https://cloud.139.com', Referer: 'https://cloud.139.com/', appId, requestId, sign, token,
    timestamp: String(now), platform: 'h5', 'x-channelSrc': '02040',
    'x-kpcc-clientid': 'X3qUAu6hA1yO6CegzcMSrQJknuZ7aEs1',
    'x-kpcc-clientkey': 'AqXZ3iQtf713yN70ydXRZkCkxdeGo3jo' }
}

async function cloudPhoneRequest(path: string, body: unknown, token = '') {
  const res = await httpsRequestText({ url: `https://cloud.139.com/uniphone${path}`, method: 'POST',
    headers: cloudPhoneRequestHeaders(token), body: JSON.stringify(body), timeoutMs: 15000 })
  let data: { header?: { status?: string }; data?: { token?: string; tmpToken?: string } }
  try { data = JSON.parse(res.bodyText) } catch { throw new Error('云手机返回非 JSON 响应') }
  console.info('[yunpan-cloud]', JSON.stringify({ path, httpStatus: res.statusCode, businessStatus: data.header?.status }))
  if (res.statusCode !== 200 || String(data.header?.status) !== '200') throw new Error('云手机换票失败，请重新登录或稍后重试')
  return data.data || {}
}

export async function buildYunpanBusinessLink(session: YunpanSessionRecord, target: YunpanDestination, campaign?: string, onAuthenticated?: () => Promise<void>) {
  const ticket = await issueYunpanBusinessTicket(session, target === 'global' ? '001191' : '001216')
  await onAuthenticated?.()
  if (target !== 'global') return buildCloudBusinessLink(ticket, target)
  return { ssoUrl: buildYunpanGlobalUrl(ticket, campaign), source: 'fresh-yunpan-sso', generatedAt: new Date().toISOString(), target }
}

export async function buildAccountYunpanBusinessLink(rec: AccountRecord, target: YunpanDestination, campaign?: string) {
  if (rec.disabledAt || !rec.yunpanSession) throw new Error('请先完成云盘登录并启用账号')
  try {
    return await buildYunpanBusinessLink(rec.yunpanSession, target, campaign, () => recordAccountYunpanVerification(rec, true))
  } catch (error) {
    if (error instanceof YunpanAuthenticationExpired) await recordAccountYunpanVerification(rec, false)
    throw error
  }
}

export async function buildCloudBusinessLink(ticket: string, target: 'cloudphone' | 'capp', channelSrc = '02207') {
  let url: string
  if (target === 'cloudphone') {
    url = 'https://cloud.139.com/#/?' + new URLSearchParams({ token: ticket, targetSourceId: '001216', loginType: '0', channelSrc })
  } else {
    const login = await cloudPhoneRequest('/user/tokenValidate', { token: ticket, version: '1.2', pintype: 5 })
    if (!login.token) throw new Error('云手机未返回业务 Token')
    const next = await cloudPhoneRequest('/user/getRcsToken', { targetSourceId: '001304', token: login.token }, login.token)
    if (typeof next.tmpToken !== 'string' || !next.tmpToken) throw new Error('云应用未返回临时票据')
    url = 'https://capp.139.com/#/?' + new URLSearchParams({ i: 'DYFvhV8fncc=', token: next.tmpToken, targetSourceId: '001304' })
  }
  return { ssoUrl: url, source: 'fresh-yunpan-sso', generatedAt: new Date().toISOString(), target }
}

let activeBrowsers = 0
export class YunpanGlobalLoginUnconfirmed extends Error {
  constructor() { super('全球通未确认登录，票据可能已失效，请重新登录或重试'); this.name = 'YunpanGlobalLoginUnconfirmed' }
}
const browserQueue: Array<() => void> = []
async function acquireBrowserSlot() {
  if (activeBrowsers < 2) { activeBrowsers += 1; return }
  if (browserQueue.length >= 20) throw new Error('全球通置换队列已满，请稍后重试')
  await new Promise<void>((resolve) => browserQueue.push(resolve))
}
function releaseBrowserSlot() {
  const next = browserQueue.shift()
  if (next) next()
  else activeBrowsers -= 1
}
// Each exchange starts without historical cookies. The official H5 initialization
// and checkLoginStatus response, together with a newly issued cookie, prove login.
export async function exchangeYunpanGlobalToken(session: YunpanSessionRecord, onAuthenticated?: () => Promise<void>): Promise<string> {
  const executablePath = process.env.YUNPAN_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  if (!fs.existsSync(executablePath)) throw new Error('未找到用于全球通置换的 Chrome')
  await acquireBrowserSlot()
  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    // Ticket issuance proves the cloud credential, independently of the target
    // site's availability or whether its browser login subsequently succeeds.
    const { ssoUrl } = await buildYunpanBusinessLink(session, 'global', undefined, onAuthenticated)
    browser = await chromium.launch({ executablePath, headless: true, args: ['--no-proxy-server'] })
    const context = await browser.newContext({ ...devices['iPhone 13'], locale: 'zh-CN', acceptDownloads: false })
    const page = await context.newPage()
    await page.route('**/*', (route) => {
      const request = route.request()
      if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
        const url = new URL(request.url())
        if (url.protocol !== 'https:' || url.hostname !== 'qqt.cmicrwx.cn' || url.port || url.username || url.password) return route.abort()
      }
      return route.continue()
    })
    const result = new Promise<boolean>((resolve) => {
      page.on('response', async (response) => {
        const url = new URL(response.url())
        if (url.hostname !== 'qqt.cmicrwx.cn' || url.pathname !== '/2016tyjf/xhmqqthy/checkLoginStatus.action') return
        try { resolve(response.status() === 200 && (await response.json()).status === '1') } catch { resolve(false) }
      })
    })
    const timeout = new Promise<boolean>((resolve) => { timer = setTimeout(() => resolve(false), 40000) })
    const success = await Promise.race([page.goto(ssoUrl, { waitUntil: 'domcontentloaded', timeout: 20000 }).then(() => result), timeout])
    const cookies = await context.cookies('https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/checkLoginStatus.action')
    const token = cookies.find((cookie) => cookie.name === 'access_token')?.value
    console.info('[yunpan-global]', JSON.stringify({ success: success && !!token, freshContext: true, cookieNames: cookies.map(c => c.name) }))
    if (!success || !token) throw new YunpanGlobalLoginUnconfirmed()
    return token
  } catch (error) {
    // Browser exceptions may include the navigation URL containing credentials.
    if (error instanceof YunpanAuthenticationExpired) throw error
    if (error instanceof Error && error.message.startsWith('全球通未确认')) throw error
    throw new Error('全球通置换失败，请检查云盘会话、Chrome 与网络后重试')
  } finally {
    clearTimeout(timer)
    await browser?.close().catch(() => {})
    releaseBrowserSlot()
  }
}

const inFlight = new Map<string, Promise<AccountRecord>>()

// The direct QQT landing can reject a cloud ticket even after cloud accepted
// it. Use a separately issued WX-audience ticket, never reuse a consumed ticket.
export async function exchangeYunpanGlobalViaWx(session: YunpanSessionRecord, phone: string) {
  const ticket = await issueYunpanBusinessTicket(session, '017018')
  // Lazy loading avoids the QQT -> cloud renewal module cycle.
  const { collect10086CookieByQqtTicket, isQqtTokenAuthenticated } = await import('./qqtSso.js')
  const { qqtReplaceToken } = await import('./qqtSign.js')
  const wx = await collect10086CookieByQqtTicket({ ticket, phone })
  const global = await qqtReplaceToken({ cmccCookie: wx.cookie })
  if (!global.ok || !global.accessToken) throw new Error('云盘置换的 10086 登录有效，但全球通未返回有效 Token')
  // qqtReplaceToken alone does not prove the returned token is authenticated.
  if (!await isQqtTokenAuthenticated(global.accessToken)) throw new Error('全球通未确认新的登录状态')
  return { ...wx, accessToken: global.accessToken }
}

type GlobalTokenDependencies = {
  isAuthenticated?: (token: string) => Promise<boolean>
  exchangeYunpanGlobalToken: typeof exchangeYunpanGlobalToken
  recordAccountYunpanVerification: typeof recordAccountYunpanVerification
  setAccountQqtToken: typeof setAccountQqtToken
  touchAccountQqtTokenCheckedAt: typeof touchAccountQqtTokenCheckedAt
  getAccountById: typeof getAccountById
  exchangeViaWx?: typeof exchangeYunpanGlobalViaWx
  setAccountCookie?: typeof setAccountCookie
  setAccountActivationInfo?: typeof setAccountActivationInfo
}

export async function ensureYunpanGlobalToken(rec: AccountRecord, force = false, dependencies: GlobalTokenDependencies = {
  exchangeYunpanGlobalToken, recordAccountYunpanVerification, setAccountQqtToken,
  touchAccountQqtTokenCheckedAt, getAccountById, exchangeViaWx: exchangeYunpanGlobalViaWx,
  setAccountCookie, setAccountActivationInfo,
  isAuthenticated: async (token) => (await import('./qqtSso.js')).isQqtTokenAuthenticated(token),
}): Promise<AccountRecord> {
  if (rec.disabledAt) throw new Error('账号已禁用，请先启用账号')
  if (!rec.yunpanSession) return rec
  if (!force && rec.qqtAccessToken && rec.qqtAccessTokenCheckedAt &&
      Date.now() - new Date(rec.qqtAccessTokenCheckedAt).getTime() < 5 * 60 * 1000) return rec
  if (inFlight.has(rec.id)) return inFlight.get(rec.id)!
  const work = (async () => {
    // A verification window is not the token's lifetime. Keep independent
    // credentials even when cloud verification is stale or cloud has expired.
    if (!force && rec.qqtAccessToken && dependencies.isAuthenticated &&
        await dependencies.isAuthenticated(rec.qqtAccessToken)) {
      const current = await dependencies.getAccountById(rec.id)
      if (!current || current.disabledAt || current.qqtAccessToken !== rec.qqtAccessToken ||
          current.yunpanSession?.authorization !== rec.yunpanSession?.authorization ||
          current.yunpanSessionUpdatedAt !== rec.yunpanSessionUpdatedAt) {
        throw new Error('账号登录已变更，请重新操作')
      }
      return dependencies.touchAccountQqtTokenCheckedAt({ id: rec.id })
    }
    let token: string
    let wx: Awaited<ReturnType<typeof exchangeYunpanGlobalViaWx>> | undefined
    try {
      try {
        token = await dependencies.exchangeYunpanGlobalToken(rec.yunpanSession!, () => dependencies.recordAccountYunpanVerification(rec, true))
      } catch (error) {
        if (!(error instanceof YunpanGlobalLoginUnconfirmed) || !dependencies.exchangeViaWx) throw error
        wx = await dependencies.exchangeViaWx(rec.yunpanSession!, rec.phone)
        token = wx.accessToken
      }
    } catch (error) {
      if (error instanceof YunpanAuthenticationExpired) await dependencies.recordAccountYunpanVerification(rec, false)
      throw error
    }
    const current = await dependencies.getAccountById(rec.id)
    if (!current || current.disabledAt || current.yunpanSession?.authorization !== rec.yunpanSession?.authorization ||
        current.yunpanSessionUpdatedAt !== rec.yunpanSessionUpdatedAt) {
      throw new Error('云盘登录已变更，未覆盖新的凭据，请重新操作')
    }
    if (wx && current.cookie === rec.cookie && current.lastLoginAt === rec.lastLoginAt) {
      await dependencies.setAccountCookie?.({ id: rec.id, cookie: wx.cookie,
        ssoCookieExpireAt: wx.cookieExpireAt, newHomeUrl: 'https://wx.10086.cn/website/spa/main/newHome' })
      await dependencies.setAccountActivationInfo?.({ id: rec.id, activationInfo: wx.activationInfo }).catch(() => {
        console.warn('[yunpan-global]', JSON.stringify({ phase: 'save_query_cache', success: false }))
      })
    }
    await dependencies.setAccountQqtToken({ id: rec.id, qqtAccessToken: token })
    await dependencies.touchAccountQqtTokenCheckedAt({ id: rec.id })
    return (await dependencies.getAccountById(rec.id)) || { ...rec, qqtAccessToken: token }
  })()
  inFlight.set(rec.id, work)
  try { return await work } finally { inFlight.delete(rec.id) }
}

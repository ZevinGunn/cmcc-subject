import { cmccSendSms, cmccLoginBySms } from './protocol/cmcc10086.js'
import { prepareWedRechargeSession, wedRechargeQueryPictureInfo, wedRechargeTradeList, wedRechargeGift, wedRechargeReceive, wedRechargeDrawPicture, wedRechargeReceiveCoupon, wedRechargeTaskList, wedRechargeFinishTask, wedRechargeGetJtToken, wedRechargeGetOpenTaskInfo, wedRechargeOpenFinish } from './protocol/wedRecharge.js'
import { exchangeAppTokenToActivityCookie } from './protocol/cmccSessionBridge.js'
import { httpsRequestText } from './protocol/cmccHttp.js'
import crypto from 'node:crypto'
import type { Account, Store } from './store.js'
import type { Info } from '../shared/puzzle.js'

const PAGE = 'https://wx.10086.cn/hlwyxhdhub/act-wedrecharge/1024101716'
export function decodePayload(text: string): Record<string, unknown> {
  try { return JSON.parse(text) } catch { try { return JSON.parse(Buffer.from(text.trim(), 'base64').toString('utf8')) } catch { throw new Error('活动接口返回格式异常') } }
}
export function profilePhone(payload: Record<string, unknown>, expected?: string): { phone: string; identityKey: string } {
  if (String(payload.code) !== '0') throw new Error('登录凭证已失效或不能登录周三活动，请重新登录或导入完整活动 CK')
  const data = payload.data as Record<string, unknown> | undefined
  for (const key of ['phone', 'phoneNumber', 'telNum', 'telephone', 'mobile']) {
    const phone = String(data?.[key] || '').trim()
    if (/^1\d{10}$/.test(phone)) { if (expected && expected !== phone) throw new Error('凭证所属手机号与填写号码不一致'); return { phone, identityKey: crypto.createHash('sha256').update(String(data?.mobileCode || phone)).digest('hex') } }
    if (/^1\d{2}\*{4}\d{4}$/.test(phone)) {
      if (!expected || !/^1\d{10}$/.test(expected)) throw new Error('活动只返回脱敏号码，请填写此 CK 对应的完整手机号')
      if (expected.slice(0, 3) !== phone.slice(0, 3) || expected.slice(-4) !== phone.slice(-4)) throw new Error('凭证所属手机号与填写号码不一致')
      if (!data?.mobileCode) throw new Error('活动未返回可用于账号去重的身份标识')
      return { phone: expected, identityKey: crypto.createHash('sha256').update(String(data.mobileCode)).digest('hex') }
    }
  }
  throw new Error('活动登录接口未返回可核验的完整手机号，不能将此凭证加入号码池')
}
export function parseImport(input: string): Account['credential'] {
  const value = input.trim()
  if (!value || value.length > 32000 || /[\r\n]/.test(value) && !value.startsWith('{')) throw new Error('请粘贴完整 Cookie 或 App Token 登录 JSON')
  if (value.startsWith('{')) {
    let obj: Record<string, unknown>
    try { obj = JSON.parse(value) } catch { throw new Error('App 登录数据不是有效 JSON') }
    if (typeof obj.cookie === 'string' && !obj.token && !obj.appToken && !obj.postBody) return parseImport(obj.cookie)
    const body = obj.postBody as Record<string, unknown> | undefined
    if (!obj.token && !obj.appToken && !body?.token) throw new Error('App 登录 JSON 缺少 token/appToken')
    if (!obj.sid && !obj.loginUrl && !obj.activityUrl) throw new Error('App Token 需要同一次活动登录的 sid 或登录链接；不能把原生 JSESSIONID 当 Token')
    for (const key of ['loginUrl', 'activityUrl']) if (obj[key]) { const url = new URL(String(obj[key])); if (url.protocol !== 'https:' || url.hostname !== 'wx.10086.cn' || url.username || url.password) throw new Error('请使用官方 wx.10086.cn 活动登录地址') }
    const cookie = typeof obj.cookie === 'string' ? obj.cookie : ''
    if (/[\r\n]/.test(cookie)) throw new Error('Cookie 格式异常')
    return { cookie, app: obj }
  }
  const cookie = value.replace(/^Cookie:\s*/i, '')
  if (!cookie.split(';').some(s => /^\s*[\w.-]+=[^;]+/.test(s))) throw new Error('这不是 Cookie；原生 App Token 请按 JSON 格式导入')
  return { cookie }
}
export class Client {
  constructor(readonly store: Store) {}
  async sms(phone: string) { const r = await cmccSendSms(phone); if (!r.ok) throw new Error(r.message || '发送验证码失败') }
  async login(phone: string, code: string) { const r = await cmccLoginBySms(phone, code); if (!r.ok || !r.cookie) throw new Error(r.message || '短信登录失败'); return this.add({ cookie: r.cookie }, 'sms', phone) }
  async import(input: string, phone?: string) { return this.add(parseImport(input), 'appck', phone) }
  async importCookieApp(cookie: string, phone: string) { return this.add(parseImport(cookie), 'cookieapp', phone) }
  private async session(credential: Account['credential'], forceRefresh = false) {
    if (credential.app) {
      const r = await exchangeAppTokenToActivityCookie({ ...credential.app, cookie: credential.cookie })
      if (!r.ok || !r.cookie) throw new Error(r.message || 'App Token 置换活动会话失败')
      return r.cookie
    }
    const r = await prepareWedRechargeSession({ cookie: credential.cookie, forceRefresh })
    if (!/(?:^|;\s*)HLWHD_SESSION_TOKEN=/.test(r.cookie)) throw new Error('此 App CK 未取得周三活动会话。请导入活动页完整 Cookie，或包含 token + sid 的 App 登录 JSON')
    return r.cookie
  }
  private async identity(cookie: string, expected?: string) {
    const r = await httpsRequestText({ url: PAGE.replace('/act-wedrecharge/1024101716', '/api/wedrecharge/_pub/rec_login'), method: 'GET', headers: { Cookie: cookie, Referer: PAGE, 'login-check': '1', 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) Mobile/15E148/wkwebview leadeon/12.1.3/CMCCIT' } })
    if (r.statusCode !== 200) throw new Error(`登录查询 HTTP ${r.statusCode}`)
    return profilePhone(decodePayload(r.bodyText), expected)
  }
  private async add(credential: Account['credential'], source: Account['source'], expected?: string) {
    const activityCookie = await this.session(credential, source === 'cookieapp'), { phone, identityKey } = await this.identity(activityCookie, expected)
    let a = this.store.state.accounts.find(a => a.phone === phone || a.identityKey === identityKey)
    if (a && a.phone !== phone) throw new Error('此活动身份已绑定其他号码，请核对完整手机号')
    if (!a && this.store.state.accounts.length >= 100) throw new Error('号码池最多 100 个号码')
    if (a) Object.assign(a, { credential, source, identityKey, activityCookie, error: undefined })
    else { a = { id: crypto.randomUUID(), phone, identityKey, source, credential, activityCookie, updatedAt: new Date().toISOString() }; this.store.state.accounts.push(a) }
    this.store.save()
    try { await this.query(a.id) } catch { /* Keep authenticated credentials and partial inventory. */ }
    return a
  }
  async query(id: string): Promise<Info> {
    const a = this.store.account(id)
    try {
      let raw
      try { raw = await wedRechargeQueryPictureInfo({ cookie: a.activityCookie }) } catch (error) {
        if (!/GOTO_LOGIN|需要登录/.test(String(error))) throw error
        a.activityCookie = await this.session(a.credential, true)
        await this.identity(a.activityCookie, a.phone)
        this.store.save()
        raw = await wedRechargeQueryPictureInfo({ cookie: a.activityCookie })
      }
      const { raw: _raw, cardNo: _card, ...info } = raw
      if (!info.pictureList || typeof info.pictureList !== 'object') throw new Error('活动未返回拼图库存')
      a.info = info; a.error = undefined; a.updatedAt = new Date().toISOString(); this.store.save(); return info
    } catch (error) { a.error = error instanceof Error ? error.message : '库存查询失败'; this.store.save(); throw error }
  }
  private cookie(id: string) { return this.store.account(id).activityCookie }
  trade(id: string) { return wedRechargeTradeList(this.cookie(id)) }
  gift(id: string, piece: string) { return wedRechargeGift(this.cookie(id), piece) }
  receive(id: string, token: string) { return wedRechargeReceive(this.cookie(id), token) }
  draw(id: string, round: number) { return wedRechargeDrawPicture({ cookie: this.cookie(id), round: `dp${round}` }) }
  redeem(id: string, round: number) { return wedRechargeReceiveCoupon(this.cookie(id), round) }
  tasks(id: string) { return wedRechargeTaskList({ cookie: this.cookie(id) }) }
  finish(id: string, taskId: string) { return wedRechargeFinishTask({ cookie: this.cookie(id), taskId }) }
  jt(id: string, taskId: string) { return wedRechargeGetJtToken({ cookie: this.cookie(id), taskId }) }
  open(id: string, jtToken: string, referer: string) { return wedRechargeGetOpenTaskInfo({ cookie: this.cookie(id), jtToken, referer }) }
  openFinish(id: string, jtToken: string, cToken: string, referer: string) { return wedRechargeOpenFinish({ cookie: this.cookie(id), jtToken, cToken, referer }) }
}

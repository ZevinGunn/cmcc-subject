import { prepareWedRechargeSession, wedRechargeQueryPictureInfo, wedRechargeQueryCouponPrizes,
  WedAuthenticationExpired, type WedRechargePictureInfo } from './wedRecharge.js'
import { exchangeYunpanGlobalToken } from './yunpanSso.js'
import { issueQqtBusinessTicket, collect10086CookieByQqtTicket } from './qqtSso.js'
import { getAccountById, setAccountCookie, setAccountQqtToken, setAccountWedRechargeCookie,
  type AccountRecord } from './accountsStore.js'

export type CouponStock = 'available' | 'empty' | 'unknown'
export type WedCouponStocks = { eight: CouponStock; nine: CouponStock }

export function parseWedCouponStocks(info: WedRechargePictureInfo, prizes: unknown[]): WedCouponStocks {
  const stock = (prizeId: string, status: number | undefined): CouponStock => {
    const prize = prizes.find(p => p && typeof p === 'object' && (p as Record<string, unknown>).prizeId === prizeId) as Record<string, unknown> | undefined
    const value = prize?.stock
    if ((typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) ||
        (typeof value === 'string' && /^\d+$/.test(value) && Number.isSafeInteger(Number(value)))) {
      return Number(value) > 0 ? 'available' : 'empty'
    }
    // Official ImgInvite: 2 = goReceive; 5 = noStock. 4 is Lock, NOT noStock.
    // 1/3/4/6/7 are personal progress/claimed/used/expired states and cannot
    // establish current shared inventory when the prize stock field is null.
    if (status === 2) return 'available'
    if (status === 5) return 'empty'
    return 'unknown'
  }
  return { eight: stock('fee_r4', info.r4Status), nine: stock('fee_r5', info.r5Status) }
}

export function formatWedCouponStocks(stocks: WedCouponStocks): string {
  const labels = { available: '有库存', empty: '无库存', unknown: '库存未知' }
  const lines = [`8折券：${labels[stocks.eight]}`, `9折券：${labels[stocks.nine]}`]
  if (stocks.eight === 'unknown' || stocks.nine === 'unknown') {
    lines.push('官方未返回可判断的库存信息；已领取、已使用、已过期或未集齐不代表无库存。')
  }
  return lines.join('\n')
}

export class MonitorAccountChanged extends Error {
  constructor() { super('账号登录信息已更新，本轮稍后重试'); this.name = 'MonitorAccountChanged' }
}

export function sameMonitorCredentials(before: AccountRecord, after: AccountRecord | null): boolean {
  return !!after && !after.disabledAt && before.phone === after.phone && before.userId === after.userId &&
    before.cookie === after.cookie && before.wedRechargeCookie === after.wedRechargeCookie &&
    before.qqtAccessToken === after.qqtAccessToken &&
    before.yunpanSession?.authorization === after.yunpanSession?.authorization &&
    before.yunpanSessionUpdatedAt === after.yunpanSessionUpdatedAt
}

const dependencies = {
  query: wedRechargeQueryPictureInfo,
  prizes: wedRechargeQueryCouponPrizes,
  prepare: prepareWedRechargeSession,
  exchange: exchangeYunpanGlobalToken,
  ticket: issueQqtBusinessTicket,
  wx: collect10086CookieByQqtTicket,
  get: getAccountById,
  saveWx: setAccountCookie,
  saveGlobal: setAccountQqtToken,
  saveActivity: setAccountWedRechargeCookie,
}

export async function queryAccountWedCouponStocks(rec: AccountRecord, deps = dependencies): Promise<WedCouponStocks> {
  const read = async (cookie: string) => {
    const info = await deps.query({ cookie })
    const prizes = await deps.prizes(cookie)
    return parseWedCouponStocks(info, prizes)
  }
  if (rec.disabledAt) throw new Error('监控账号已禁用')
  if (rec.wedRechargeCookie || rec.cookie) {
    try {
      const session = await deps.prepare({ cookie: rec.wedRechargeCookie || rec.cookie! })
      const stocks = await read(session.cookie)
      if (!sameMonitorCredentials(rec, await deps.get(rec.id))) throw new MonitorAccountChanged()
      if (session.cookie !== rec.wedRechargeCookie) await deps.saveActivity({ id: rec.id, cookie: session.cookie })
      return stocks
    } catch (error) {
      // Network failures, channel restrictions and risk controls are not expiry.
      if (!(error instanceof WedAuthenticationExpired)) throw error
    }
  }
  if (!rec.yunpanSession?.authorization) throw new Error('监控账号缺少云盘 CK，需要补登')
  // Always issue a fresh Yunpan -> QQT -> WX -> activity chain after expiry.
  // Keep newly issued credentials local until identity and read-only queries succeed.
  const globalToken = await deps.exchange(rec.yunpanSession)
  const ticket = await deps.ticket(globalToken, '017018')
  const wx = await deps.wx({ ticket, phone: rec.phone! })
  const activity = await deps.prepare({ cookie: wx.cookie, forceRefresh: true })
  const stocks = await read(activity.cookie)
  if (!sameMonitorCredentials(rec, await deps.get(rec.id))) throw new MonitorAccountChanged()
  await deps.saveGlobal({ id: rec.id, qqtAccessToken: globalToken })
  await deps.saveWx({ id: rec.id, cookie: wx.cookie, ssoCookieExpireAt: wx.cookieExpireAt })
  await deps.saveActivity({ id: rec.id, cookie: activity.cookie })
  return stocks
}

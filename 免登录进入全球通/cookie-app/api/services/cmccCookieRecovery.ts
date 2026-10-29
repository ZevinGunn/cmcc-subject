import { cmccRefreshCookieByHome } from './cmcc10086.js'
import {
  getAccountById,
  setAccountCookie,
  setAccountActivationInfo,
  touchAccountCookieCheckedAt,
  type AccountRecord,
} from './accountsStore.js'
import { collect10086CookieByQqtTicket, issueAccountQqtTicket, CMCC_HOME } from './qqtSso.js'

export type CookieRecoveryResult = {
  ok: boolean
  cookie?: string
  cookieUpdated?: boolean
  recoveredByYunpan?: boolean
  yunpanFailed?: boolean
  message?: string
}

export function isYunpan10086ExchangeEnabled(): boolean {
  return /^(1|true|yes|on)$/i.test(String(process.env.YUNPAN_10086_EXCHANGE_ENABLED || '').trim())
}

export function shouldRecover10086CookieByYunpan(rec: AccountRecord): boolean {
  // Historical name retained for shared callers; the new route is QQT → WX.
  return !rec.disabledAt && Boolean(rec.yunpanSession || rec.qqtAccessToken)
}

const recoveryInFlight = new Map<string, Promise<CookieRecoveryResult>>()
export async function recover10086CookieByYunpan(args: {
  rec: AccountRecord
  reason?: string
  clearOnYunpanFailure?: boolean
}, dependencies = { getAccountById, issueAccountQqtTicket, collect10086CookieByQqtTicket,
  setAccountCookie, setAccountActivationInfo }): Promise<CookieRecoveryResult> {
  if (!shouldRecover10086CookieByYunpan(args.rec)) {
    return { ok: false, message: '请先完成云盘或全球通登录并启用账号' }
  }
  if (recoveryInFlight.has(args.rec.id)) return recoveryInFlight.get(args.rec.id)!
  const work = (async (): Promise<CookieRecoveryResult> => {
    let phase = 'load_account'
    try {
      const current = await dependencies.getAccountById(args.rec.id)
      if (!current || !shouldRecover10086CookieByYunpan(current)) return { ok: false, message: '登录来源已变更，请重新操作' }
      phase = 'issue_ticket'
      const ticket = await dependencies.issueAccountQqtTicket(current, '017018')
      const afterTicket = await dependencies.getAccountById(current.id)
      // Cloud -> WX -> QQT fallback may have already saved a fresh, identity-
      // verified WX cookie while renewing the QQT token. Reuse that result.
      if (afterTicket && !afterTicket.disabledAt && afterTicket.phone === current.phone &&
          afterTicket.lastLoginAt === current.lastLoginAt && afterTicket.lastLoginMethod === current.lastLoginMethod &&
          afterTicket.yunpanSession?.authorization === current.yunpanSession?.authorization &&
          afterTicket.cookie && afterTicket.cookie !== current.cookie && afterTicket.cookieSource === 'qqt_sso' &&
          !afterTicket.cookieInvalidAt && afterTicket.cookieExpireAt && Date.parse(afterTicket.cookieExpireAt) > Date.now()) {
        return { ok: true, cookie: afterTicket.cookie, cookieUpdated: true, recoveredByYunpan: true,
          message: '全球通续期时已取得并验证新的 10086 CK' }
      }
      phase = 'verify_cmcc'
      const exchanged = await dependencies.collect10086CookieByQqtTicket({ ticket, phone: current.phone })
      const latest = await dependencies.getAccountById(current.id)
      if (!latest || latest.disabledAt || latest.phone !== current.phone || latest.cookie !== current.cookie ||
          latest.lastLoginAt !== current.lastLoginAt || latest.lastLoginMethod !== current.lastLoginMethod ||
          latest.yunpanSession?.authorization !== current.yunpanSession?.authorization) {
        return { ok: false, message: '账号登录状态已变更，未覆盖新的登录凭据，请重新操作' }
      }
      phase = 'save_credentials'
      await dependencies.setAccountCookie({ id: current.id, cookie: exchanged.cookie, newHomeUrl: CMCC_HOME,
        requestHeaders: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
        ssoCookieExpireAt: exchanged.cookieExpireAt })
      await dependencies.setAccountActivationInfo({ id: current.id, activationInfo: exchanged.activationInfo }).catch(() => {
        console.warn('[qqt-sso]', JSON.stringify({ accountId: current.id, phase: 'save_query_cache', success: false }))
      })
      return { ok: true, cookie: exchanged.cookie, cookieUpdated: true, recoveredByYunpan: true,
        message: '已通过全球通 SSO 换取并验证 10086 CK' }
    } catch {
      // Keep independently valid Yunpan/QQT/old WX credentials on upstream failure.
      console.warn('[qqt-sso]', JSON.stringify({ accountId: args.rec.id, target: '017018', phase, success: false }))
      return { ok: false, message: '全球通置换 10086 CK 失败，原登录状态已保留，可稍后重试或使用 10086 登录' }
    }
  })()
  recoveryInFlight.set(args.rec.id, work)
  try { return await work } finally { recoveryInFlight.delete(args.rec.id) }
}

export async function ensureUsable10086Cookie(args: {
  rec: AccountRecord
  allowRecentSkip?: boolean
  windowMin?: number
  clearOnYunpanFailure?: boolean
  preferYunpan?: boolean
}): Promise<CookieRecoveryResult> {
  if (args.rec.disabledAt) return { ok: false, message: '账号已禁用，请先启用账号' }
  if (
    args.allowRecentSkip !== false &&
    args.rec.cookie &&
    !args.rec.disabledAt && !args.rec.cookieInvalidAt &&
    (!args.rec.cookieExpireAt || Date.parse(args.rec.cookieExpireAt) > Date.now()) &&
    args.rec.cookieCheckedAt &&
    args.windowMin &&
    Date.now() - Date.parse(args.rec.cookieCheckedAt) <= args.windowMin * 60_000
  ) {
      return { ok: true, cookie: args.rec.cookie, message: 'CK 仍在有效窗口，已跳过' }
  }

  if (shouldRecover10086CookieByYunpan(args.rec) &&
      (!args.rec.cookie || args.rec.cookieInvalidAt || (args.rec.cookieExpireAt && Date.parse(args.rec.cookieExpireAt) <= Date.now()))) {
    return recover10086CookieByYunpan({
      rec: args.rec,
      reason: '10086 CK 需要重新置换',
      clearOnYunpanFailure: args.clearOnYunpanFailure,
    })
  }

  if (args.rec.cookie) {
    const refreshed = await cmccRefreshCookieByHome(
      args.rec.cookie,
      args.rec.requestHeaders,
      args.rec.newHomeUrl,
    )
    if (refreshed.ok && refreshed.cookie) {
      if (refreshed.cookieUpdated) {
        await setAccountCookie({ id: args.rec.id, cookie: refreshed.cookie })
        return {
          ok: true,
          cookie: refreshed.cookie,
          cookieUpdated: true,
          message: 'CK 已刷新',
        }
      }
      await touchAccountCookieCheckedAt({ id: args.rec.id })
      return { ok: true, cookie: refreshed.cookie, message: 'CK 校验通过' }
    }
    if (shouldRecover10086CookieByYunpan(args.rec)) {
      return recover10086CookieByYunpan({
        rec: args.rec,
        reason: refreshed.message || 'Cookie 已失效',
        clearOnYunpanFailure: args.clearOnYunpanFailure,
      })
    }
    return { ok: false, message: refreshed.message || '10086 CK 校验失败，请重新登录' }
  }

  if (!shouldRecover10086CookieByYunpan(args.rec)) {
    return { ok: false, message: '暂无 10086 Cookie，请使用 10086 验证码登录' }
  }
  return recover10086CookieByYunpan({
    rec: args.rec,
    reason: '暂无 10086 Cookie',
    clearOnYunpanFailure: args.clearOnYunpanFailure,
  })
}

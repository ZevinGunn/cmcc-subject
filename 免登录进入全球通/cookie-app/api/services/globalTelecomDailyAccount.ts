import { getAccountById, recordAccountYunpanVerification, setAccountQqtToken, touchAccountQqtTokenCheckedAt } from './accountsStore.js'
import { ensureUsable10086Cookie } from './cmccCookieRecovery.js'
import { globalTelecomBlindBoxAction, globalTelecomResign, globalTelecomSign, invalidateGlobalTelecomOverview, queryGlobalTelecomBlindBox, queryGlobalTelecomSign } from './globalTelecom.js'
import { isGlobalDailyAuthError, runGlobalTelecomDaily } from './globalTelecomDaily.js'
import { qqtReplaceToken } from './qqtSign.js'
import { withKeyLock } from './taskGuards.js'
import { issueYunpanBusinessTicket, YunpanAuthenticationExpired } from './yunpan10086.js'
import { ensureYunpanGlobalToken } from './yunpanSso.js'

export async function executeGlobalTelecomDaily(accountId: string, sspid: string, progress: (message: string) => Promise<void>) {
  return withKeyLock('global-telecom-daily-queue', () => withKeyLock(`account:${accountId}`, async () => {
    const rec = await getAccountById(accountId)
    if (!rec) return { status: 'failed' as const, message: '账号不存在' }
    if (rec.disabledAt) return { status: 'skipped' as const, message: '账号已禁用，已跳过' }
    if (!rec.yunpanSession && !rec.qqtAccessToken && !rec.cookie) {
      return { status: 'skipped' as const, message: '无可用登录凭据，需要补登' }
    }
    let accessToken = rec.qqtAccessToken
    // Keep WX credentials separate. A bad WX session must not invalidate cloud/QQT.
    let cookie = ''
    const maintenance: string[] = []
    let maintenanceFailed = false
    if (rec.yunpanSession) {
      await progress('正在校验云盘主凭据')
      try {
        // Ticket issuance proves the cloud session without relying on QQT uptime.
        await issueYunpanBusinessTicket(rec.yunpanSession, '001216')
        await recordAccountYunpanVerification(rec, true)
        maintenance.push('云盘 CK 校验有效')
      } catch (error) {
        if (error instanceof YunpanAuthenticationExpired) await recordAccountYunpanVerification(rec, false)
        maintenanceFailed = true
        maintenance.push(error instanceof YunpanAuthenticationExpired ? '云盘 CK 已过期，需要补登' : '云盘校验失败，原会话已保留')
      }
    }
    const saveToken = async (token: string) => {
      accessToken = token
      await setAccountQqtToken({ id: accountId, qqtAccessToken: token })
      await touchAccountQqtTokenCheckedAt({ id: accountId })
    }
    const renew = async () => {
      await progress('全球通凭据失效，正在重新置换')
      const latest = (await getAccountById(accountId)) || rec
      let cloudError: unknown
      if (latest.yunpanSession) {
        try {
          const renewed = await ensureYunpanGlobalToken(latest, true)
          if (!renewed.qqtAccessToken) throw new Error('全球通未返回 Token')
          await saveToken(renewed.qqtAccessToken)
          cookie = ''
          return
        } catch (error) { cloudError = error }
      }
      // An independently logged-in WX session remains a valid fallback when
      // cloud is expired or the QQT cloud landing service is unavailable.
      if (latest.cookie) {
        const result = await qqtReplaceToken({ cmccCookie: latest.cookie, requestHeaders: latest.requestHeaders })
        if (result.ok && result.accessToken) {
          await saveToken(result.accessToken)
          cookie = latest.cookie
          return
        }
      }
      throw cloudError || new Error('全球通凭据无法续期，请补登云盘或 10086')
    }
    // Each read starts with the current token. Retry and renewal are bounded by
    // runGlobalTelecomDaily; actions never silently use a different session.
    const input = () => ({ cmccCookie: cookie, accessToken, requestHeaders: rec.requestHeaders, sspid })
    let renewalFailed: unknown
    const renewOnce = async () => {
      if (renewalFailed) throw renewalFailed
      try { await renew() } catch (error) { renewalFailed = error; throw error }
    }
    if (!accessToken) {
      try { await renewOnce() } catch { /* Each operation reports its actual failure below. */ }
    }
    const requireToken = () => {
      if (renewalFailed) throw renewalFailed
      if (!accessToken) throw new Error('全球通未登录，需要补登')
    }
    const result = await runGlobalTelecomDaily({
      progress, renew: renewOnce, isAuthError: isGlobalDailyAuthError,
      querySign: async () => {
        requireToken()
        const state = await queryGlobalTelecomSign(input())
        await saveToken(state.accessToken)
        return state.sign
      },
      sign: () => globalTelecomSign(input()),
      resign: (dayNum, taskIds) => globalTelecomResign({ ...input(), dayNum, taskIds }),
      queryBlindBox: async () => {
        requireToken()
        const state = await queryGlobalTelecomBlindBox(input())
        await saveToken(state.accessToken)
        return state.blindBox
      },
      completeTask: taskNumber => globalTelecomBlindBoxAction({ ...input(), action: 'complete-task', taskNumber }),
      draw: () => globalTelecomBlindBoxAction({ ...input(), action: 'draw' }),
    })
    await progress('正在维护 wx10086 CK')
    const latest = (await getAccountById(accountId)) || rec
    const wx = await ensureUsable10086Cookie({ rec: latest, allowRecentSkip: true, windowMin: 30,
      clearOnYunpanFailure: false }).catch(() => ({ ok: false, message: 'wx10086 CK 维护失败，原凭据已保留' }))
    maintenance.push(wx.ok ? 'wx10086 CK 已校验或重新置换' : wx.message || 'wx10086 CK 需要补登')
    invalidateGlobalTelecomOverview(accountId)
    return { status: maintenanceFailed || !wx.ok ? 'failed' as const : result.status,
      message: [...maintenance, result.message].join('；') }
  }))
}

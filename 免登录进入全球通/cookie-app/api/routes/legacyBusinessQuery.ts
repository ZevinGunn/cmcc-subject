import crypto from 'node:crypto'
import { Router, type Request } from 'express'
import { getAccountById } from '../services/accountsStore.js'
import { ensureUsable10086Cookie } from '../services/cmccCookieRecovery.js'
import { findCurrentUser, listUserAccountSummaries } from '../services/userAuthStore.js'
import { isAdminRequest, resolveScopedPermission } from '../services/serviceLoginGuard.js'
import { normalizeLegacyCookieInput } from '../../shared/legacyBusinessCredentials.js'
import { createLegacySession, getLegacySession, LegacyBusinessError, publicLegacySession,
  queryLegacyBusinesses, sendLegacyUnsubscribeSms, unsubscribeLegacyBusiness, withLegacyAccountLock } from '../services/legacyBusinessQuery.js'

const router = Router()
async function access(req: Request, accountId: string) {
  const user = await findCurrentUser(req)
  const owns = Boolean(user && (await listUserAccountSummaries(user.id)).some(a => a.id === accountId))
  const admin = isAdminRequest(req)
  if (!owns && !admin) throw new LegacyBusinessError(user ? '只能操作当前用户已关联账号' : '请先登录专属账号', 'FORBIDDEN', 403)
  const account = await getAccountById(accountId)
  if (!account) throw new LegacyBusinessError('账号不存在', 'NOT_FOUND', 404)
  if (account.disabledAt) throw new LegacyBusinessError('账号已禁用', 'ACCOUNT_DISABLED', 403)
  const canUnsubscribe = resolveScopedPermission({ currentUserOwnsResource: owns,
    currentUserPermission: Boolean(user?.permissions.businessQuery), isAdmin: admin })
  return { account, canUnsubscribe }
}

router.post('/accounts/:id/prepare', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    const id = String(req.params.id || '').trim(), permitted = await access(req, id)
    let legacyCookie: string
    try { legacyCookie = normalizeLegacyCookieInput(typeof req.body?.legacyCookie === 'string' ? req.body.legacyCookie : '') }
    catch (error) { throw new LegacyBusinessError(error instanceof Error ? error.message : 'CK 格式不正确', 'INVALID_CREDENTIAL', 400) }
    const appToken = typeof req.body?.appToken === 'string' ? req.body.appToken.trim() : ''
    if (appToken.length > 8192 || /[\r\n]/.test(appToken)) {
      throw new LegacyBusinessError('登录凭据格式不正确或长度超出限制', 'INVALID_CREDENTIAL', 400)
    }
    const data = await withLegacyAccountLock(id, async () => {
      // Imported native/legacy credentials stay within this isolated session;
      // maintenance must not overwrite them with a WX/QQT channel cookie.
      const usable = legacyCookie || appToken ? { ok: true, cookie: legacyCookie || permitted.account.cookie, message: '' }
        : await ensureUsable10086Cookie({ rec: permitted.account, allowRecentSkip: true, windowMin: 5, clearOnYunpanFailure: false })
      if (!usable.ok || (!usable.cookie && !appToken)) throw new LegacyBusinessError(usable.message || '10086 CK 已失效，请重新登录', 'COOKIE_INVALID', 410)
      const session = await createLegacySession({ accountId: id, phone: permitted.account.phone, cookie: usable.cookie || '',
        appCookie: legacyCookie || permitted.account.cmccAppCookie, appToken })
      return { session: publicLegacySession(session), label: permitted.account.label || '', canUnsubscribe: permitted.canUnsubscribe }
    })
    res.json({ ok: true, data, requestId })
  } catch (error) { respondError(res, error, requestId) }
})

for (const operation of ['query', 'unsubscribe/sms', 'unsubscribe'] as const) {
  router.post('/' + operation, async (req, res) => {
    const requestId = crypto.randomUUID()
    try {
      const accountId = String(req.body?.accountId || '').trim()
      const permitted = await access(req, accountId)
      if (operation !== 'query' && !permitted.canUnsubscribe) throw new LegacyBusinessError('当前用户未开启业务退订权限', 'BUSINESS_UNSUBSCRIBE_FORBIDDEN', 403)
      const session = getLegacySession(String(req.body?.sessionId || ''))
      if (!session) throw new LegacyBusinessError('旧版查询会话已过期，请重新准备登录态', 'SESSION_EXPIRED', 410)
      if (session.accountId !== accountId || session.phone !== permitted.account.phone) throw new LegacyBusinessError('查询会话与账号不匹配', 'ACCOUNT_MISMATCH', 403)
      const data = await withLegacyAccountLock(accountId, async () => {
        if (operation === 'query') return { ...await queryLegacyBusinesses(session), canUnsubscribe: permitted.canUnsubscribe }
        const businessId = String(req.body?.businessId || '')
        if (operation === 'unsubscribe/sms') return sendLegacyUnsubscribeSms(session, businessId)
        if (req.body?.confirmed !== true) throw new LegacyBusinessError('请先确认退订业务', 'CONFIRM_REQUIRED', 400)
        return unsubscribeLegacyBusiness(session, businessId, String(req.body?.smsCode || '').trim())
      })
      res.json({ ok: true, data, requestId })
    } catch (error) { respondError(res, error, requestId) }
  })
}
function respondError(res: import('express').Response, error: unknown, requestId: string) {
  const known = error instanceof LegacyBusinessError
  res.status(known ? error.status : 502).json({ ok: false,
    message: known ? error.message : '旧版业务请求失败或超时，请稍后重试',
    errorCode: known ? error.code : 'UPSTREAM_ERROR', requestId })
}
export default router

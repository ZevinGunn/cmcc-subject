import crypto from 'node:crypto'
import { Router } from 'express'
import { getAccountById } from '../services/accountsStore.js'
import { findCurrentUser, listUserAccountSummaries } from '../services/userAuthStore.js'
import { isAdminRequest } from '../services/serviceLoginGuard.js'
import { getPublicLink } from '../services/publicLinksStore.js'
import { ensureUsable10086Cookie } from '../services/cmccCookieRecovery.js'
import { BenefitOrderError } from '../services/cmccBenefitOrder.js'
import { callbackService } from '../services/cmccCallback.js'

const router = Router()
// Access is checked again at each step; a preview cannot confer account access.
for (const action of ['products', 'prepare', 'confirm'] as const) {
  router.post(`/:accountId/${action}`, async (req, res) => {
    const requestId = crypto.randomUUID()
    res.setHeader('Cache-Control', 'no-store')
    try {
      const accountId = String(req.params.accountId)
      let ownerKey = 'admin'
      if (!isAdminRequest(req)) {
        const user = await findCurrentUser(req)
        if (user) {
          const accounts = await listUserAccountSummaries(user.id)
          if (!accounts.some(row => row.id === accountId)) throw new BenefitOrderError('该账号不属于当前用户', 'ACCOUNT_FORBIDDEN', 403)
          ownerKey = `user:${user.id}`
        } else {
          const linkId = typeof req.body?.publicLinkId === 'string' ? req.body.publicLinkId : ''
          const link = linkId ? await getPublicLink(linkId) : null
          if (!link || link.usedByUserId || !link.accountIds.includes(accountId)) throw new BenefitOrderError('请先登录账号中心后预约回访', 'UNAUTHENTICATED', 401)
          ownerKey = `link:${link.id}`
        }
      }
      const account = await getAccountById(accountId)
      if (!account || account.disabledAt) throw new BenefitOrderError('账号不存在或已停用', 'ACCOUNT_DISABLED', 404)
      let data: unknown
      if (action === 'products') {
        const productCode = String(req.body?.productCode || '').trim()
        if (!/^\d{1,20}$/.test(productCode)) throw new BenefitOrderError('请输入有效的商品编码', 'INVALID_PRODUCT', 400)
        const cookie = await ensureUsable10086Cookie({ rec: account, allowRecentSkip: true, windowMin: 5, clearOnYunpanFailure: false, preferYunpan: false })
        if (!cookie.ok || !cookie.cookie) throw new BenefitOrderError(cookie.message || '请重新登录 10086', 'COOKIE_INVALID', 410)
        data = await callbackService.start({ accountId, ownerKey, cookie: cookie.cookie, productCode, expectedPhone: account.phone })
      } else {
        const sessionId = String(req.body?.sessionId || '')
        data = action === 'prepare'
          ? await callbackService.prepare(sessionId, ownerKey, accountId, String(req.body?.normId || ''))
          : await callbackService.confirm(sessionId, ownerKey, accountId, String(req.body?.preparationId || ''))
      }
      res.json({ ok: true, data, requestId })
    } catch (error) {
      const known = error instanceof BenefitOrderError
      res.status(known ? error.status : 500).json({ ok: false, message: known ? error.message : '预约服务暂不可用，请稍后重试', errorCode: known ? error.code : 'CALLBACK_ERROR', requestId })
    }
  })
}
export default router

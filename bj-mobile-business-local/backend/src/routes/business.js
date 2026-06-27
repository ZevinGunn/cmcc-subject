import { Router } from 'express'
import { getSession, publicSession, saveSessions } from '../services/sessionStore.js'
import { getOnlineUserInfo, initPortalKey, queryPackage, unsubscribePackage } from '../services/portalClient.js'
import { fail, ok } from '../utils/response.js'

const router = Router()

function requireSession(req, res) {
  const sessionId = req.body?.sessionId || req.query?.sessionId
  const session = getSession(sessionId)
  if (!session) {
    fail(res, 200, '登录会话不存在或已过期，请重新登录', 'SESSION_NOT_FOUND')
    return null
  }
  if (!session.accessToken) {
    fail(res, 200, '当前会话未完成门户登录，请重新登录', 'NOT_LOGGED_IN')
    return null
  }
  return session
}

router.post('/init', async (req, res, next) => {
  try {
    const session = requireSession(req, res)
    if (!session) return
    const result = await initPortalKey(session)
    saveSessions()
    if (!result.ok) return fail(res, 200, result.message, 'INIT_PORTAL_KEY_FAILED', { raw: result.raw })
    ok(res, { ...result.data, session: publicSession(session) }, { raw: result.raw })
  } catch (e) {
    next(e)
  }
})

router.post('/user-info', async (req, res, next) => {
  try {
    const session = requireSession(req, res)
    if (!session) return
    const result = await getOnlineUserInfo(session)
    saveSessions()
    if (!result.ok) return fail(res, 200, result.message, 'USER_INFO_FAILED', { raw: result.raw })
    ok(res, { userInfo: result.data, session: publicSession(session) }, { raw: result.raw })
  } catch (e) {
    next(e)
  }
})

router.post('/query', async (req, res, next) => {
  try {
    const session = requireSession(req, res)
    if (!session) return
    const result = await queryPackage(session, {
      pageVersion: String(req.body?.pageVersion || ''),
      bgnMonth: typeof req.body?.bgnMonth === 'string' ? req.body.bgnMonth : '',
      endMonth: typeof req.body?.endMonth === 'string' ? req.body.endMonth : '',
    })
    saveSessions()
    if (!result.ok) return fail(res, 200, result.message, 'QUERY_FAILED', { raw: result.raw })
    ok(res, { business: result.data, session: publicSession(session) }, { raw: result.raw })
  } catch (e) {
    next(e)
  }
})

router.post('/unsubscribe', async (req, res, next) => {
  try {
    const session = requireSession(req, res)
    if (!session) return
    const business = req.body?.business
    if (!business || typeof business !== 'object') return fail(res, 400, '缺少退订业务信息', 'MISSING_BUSINESS')
    const result = await unsubscribePackage(session, business)
    if (!result.ok) return fail(res, 200, result.message, 'UNSUBSCRIBE_FAILED', { raw: result.raw })
    saveSessions()
    ok(res, { result: result.data, session: publicSession(session) }, { raw: result.raw })
  } catch (e) {
    next(e)
  }
})

export default router

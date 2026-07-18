import { Router } from 'express'
import { getActivity, listActivities, publicActivity } from '../services/activityConfigService.js'
import { checkActivity, previewActivity, subscribeActivity } from '../services/activityService.js'
import { getSession, publicSession, saveSessions } from '../services/sessionStore.js'
import { fail, ok } from '../utils/response.js'

const router = Router()

function requireActivity(req, res) {
  const activity = getActivity(req.params.id)
  if (!activity) fail(res, 404, '活动配置不存在或未启用', 'ACTIVITY_NOT_FOUND')
  return activity
}

function requireSession(req, res) {
  const session = getSession(req.body?.sessionId || req.query?.sessionId)
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

router.get('/', (_req, res) => ok(res, { activities: listActivities().map(publicActivity) }))

router.get('/:id', (req, res) => {
  const activity = requireActivity(req, res)
  if (activity) ok(res, { activity: publicActivity(activity) })
})

router.post('/:id/check', async (req, res, next) => {
  try {
    const activity = requireActivity(req, res)
    const session = activity && requireSession(req, res)
    if (!activity || !session) return
    const result = await checkActivity(session, activity)
    saveSessions()
    if (!result.ok) return fail(res, 200, result.message, result.errorCode, { raw: result.raw })
    ok(res, { check: result.data, session: publicSession(session) })
  } catch (error) {
    next(error)
  }
})

router.post('/:id/preview', (req, res) => {
  const activity = requireActivity(req, res)
  const session = activity && requireSession(req, res)
  if (!activity || !session) return
  const result = previewActivity(session, activity, req.body?.input || {})
  if (!result.ok) return fail(res, 400, result.message, result.errorCode, { raw: result.raw })
  ok(res, { preview: result.data })
})

router.post('/:id/subscribe', async (req, res, next) => {
  try {
    const activity = requireActivity(req, res)
    const session = activity && requireSession(req, res)
    if (!activity || !session) return
    const result = await subscribeActivity(session, activity, req.body?.input || {}, {
      agreed: req.body?.agreed,
      confirmationId: req.body?.confirmationId,
    })
    saveSessions()
    if (!result.ok) return fail(res, 200, result.message, result.errorCode, { raw: result.raw })
    ok(res, { result: result.data, idempotent: Boolean(result.idempotent), session: publicSession(session) })
  } catch (error) {
    next(error)
  }
})

export default router

import { Router } from 'express'
import {
  discardCustomOrder,
  initializeCustomOrder,
  loadFlyCardUsage,
  previewCustomOrder,
  sendCustomOrderSms,
  submitCustomOrder,
  verifyCustomOrderSms,
} from '../services/customOrderService.js'
import {
  checkPremiumBroadband,
  initializePremiumBroadband,
  submitPremiumBroadband,
} from '../services/premiumBroadbandService.js'
import { getSession, publicSession, saveSessions } from '../services/sessionStore.js'
import { fail, ok } from '../utils/response.js'

const router = Router()

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

function sendResult(res, result, successKey, session = null) {
  if (!result.ok) return fail(res, 200, result.message, result.errorCode, { raw: result.raw })
  ok(res, { [successKey]: result.data, idempotent: Boolean(result.idempotent), ...(session ? { session: publicSession(session) } : {}) })
}

router.post('/initialize', async (req, res, next) => {
  try {
    const session = requireSession(req, res)
    if (!session) return
    const result = await initializeCustomOrder(session, req.body?.config || req.body || {})
    saveSessions()
    sendResult(res, result, 'initialization', session)
  } catch (error) {
    next(error)
  }
})

router.post('/preview', (req, res) => {
  const session = requireSession(req, res)
  if (!session) return
  sendResult(res, previewCustomOrder(req.body?.config || {}), 'preview')
})

router.post('/fly-card-usage', async (req, res, next) => {
  try {
    const session = requireSession(req, res)
    if (!session) return
    const result = await loadFlyCardUsage(session)
    saveSessions()
    sendResult(res, result, 'usage', session)
  } catch (error) {
    next(error)
  }
})

router.post('/premium-broadband/initialize', async (req, res, next) => {
  try {
    const session = requireSession(req, res)
    if (!session) return
    const result = await initializePremiumBroadband(session)
    saveSessions()
    sendResult(res, result, 'initialization', session)
  } catch (error) {
    next(error)
  }
})

router.post('/premium-broadband/check', async (req, res, next) => {
  try {
    const session = requireSession(req, res)
    if (!session) return
    const result = await checkPremiumBroadband(session, req.body || {})
    saveSessions()
    sendResult(res, result, 'check', session)
  } catch (error) {
    next(error)
  }
})

router.post('/premium-broadband/submit', async (req, res, next) => {
  try {
    const session = requireSession(req, res)
    if (!session) return
    const result = await submitPremiumBroadband(session, req.body || {})
    saveSessions()
    sendResult(res, result, 'submission', session)
  } catch (error) {
    next(error)
  }
})

router.post('/submit', async (req, res, next) => {
  try {
    const session = requireSession(req, res)
    if (!session) return
    const result = await submitCustomOrder(session, req.body?.config || {}, {
      agreed: req.body?.agreed,
      confirmationId: req.body?.confirmationId,
    })
    saveSessions()
    sendResult(res, result, 'order', session)
  } catch (error) {
    next(error)
  }
})

router.delete('/:orderId', (req, res, next) => {
  try {
    const session = requireSession(req, res)
    if (!session) return
    const result = discardCustomOrder(session, req.params.orderId)
    sendResult(res, result, 'order')
  } catch (error) {
    next(error)
  }
})

router.post('/:orderId/sms/send', async (req, res, next) => {
  try {
    const session = requireSession(req, res)
    if (!session) return
    const result = await sendCustomOrderSms(session, req.params.orderId)
    saveSessions()
    sendResult(res, result, 'sms', session)
  } catch (error) {
    next(error)
  }
})

router.post('/:orderId/sms/verify', async (req, res, next) => {
  try {
    const session = requireSession(req, res)
    if (!session) return
    const result = await verifyCustomOrderSms(session, req.params.orderId, req.body?.smsCode)
    saveSessions()
    sendResult(res, result, 'order', session)
  } catch (error) {
    next(error)
  }
})

export default router

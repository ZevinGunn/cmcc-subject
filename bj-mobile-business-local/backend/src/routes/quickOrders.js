import { Router } from 'express'
import { getSession } from '../services/sessionStore.js'
import { QuickOrderError } from '../services/quickOrders/errors.js'
import { quickOrderService } from '../services/quickOrders/service.js'
import { fail, ok } from '../utils/response.js'

const router = Router()

function handle(error, res, next) {
  if (error instanceof QuickOrderError) {
    return fail(res, error.status, error.message, error.code, { details: error.details })
  }
  return next(error)
}

router.get('/catalog', (_req, res) => ok(res, { catalog: quickOrderService.catalog() }))

router.post('/sessions', async (req, res, next) => {
  try {
    const platform = req.body?.platform
    const portalSession = platform === 'north' ? getSession(req.body?.auth?.portalSessionId) : null
    if (platform === 'north' && !portalSession) return fail(res, 401, '北京移动登录会话不存在或已过期', 'NORTH_SESSION_NOT_FOUND')
    const session = await quickOrderService.create(req.body || {}, { portalSession })
    ok(res, { session })
  } catch (error) {
    handle(error, res, next)
  }
})

router.get('/sessions/:id', (req, res, next) => {
  try {
    ok(res, { session: quickOrderService.read(req.params.id) })
  } catch (error) {
    handle(error, res, next)
  }
})

router.post('/sessions/:id/auth/sms/send', async (req, res, next) => {
  try {
    ok(res, { session: await quickOrderService.sendAuthSms(req.params.id) })
  } catch (error) {
    handle(error, res, next)
  }
})

router.post('/sessions/:id/auth/verify', async (req, res, next) => {
  try {
    ok(res, { session: await quickOrderService.verifyAuth(req.params.id, req.body || {}) })
  } catch (error) {
    handle(error, res, next)
  }
})

router.post('/sessions/:id/prepare', async (req, res, next) => {
  try {
    ok(res, { session: await quickOrderService.prepare(req.params.id) })
  } catch (error) {
    handle(error, res, next)
  }
})

router.post('/sessions/:id/select', async (req, res, next) => {
  try {
    ok(res, { session: await quickOrderService.select(req.params.id, req.body?.optionId) })
  } catch (error) {
    handle(error, res, next)
  }
})

router.post('/sessions/:id/sms/send', async (req, res, next) => {
  try {
    ok(res, { session: await quickOrderService.sendSms(req.params.id, req.body || {}) })
  } catch (error) {
    handle(error, res, next)
  }
})

router.post('/sessions/:id/confirm', async (req, res, next) => {
  try {
    ok(res, await quickOrderService.confirm(req.params.id, req.body || {}))
  } catch (error) {
    handle(error, res, next)
  }
})

router.delete('/sessions/:id', (req, res) => {
  quickOrderService.delete(req.params.id)
  ok(res, { deleted: true })
})

export default router

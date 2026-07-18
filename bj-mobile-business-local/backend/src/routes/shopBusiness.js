import { Router } from 'express'
import {
  queryShopBusiness,
  readShopSessionMeta,
  sendShopUnsubscribeSms,
  unsubscribeShopBusiness,
} from '../services/shopBusinessClient.js'
import { fail, ok } from '../utils/response.js'

const router = Router()

function credentials(req) {
  return { phone: req.body?.phone, cookie: req.body?.cookie }
}

async function handle(res, next, operation) {
  try {
    const result = await operation()
    if (!result.ok) return fail(res, 200, result.message, 'SHOP_BUSINESS_FAILED', { raw: result.raw })
    ok(res, result.data, { raw: result.raw })
  } catch (error) {
    if (error instanceof Error && /请输入|缺少|无效|不满足/.test(error.message)) {
      return fail(res, 400, error.message, 'SHOP_BUSINESS_INVALID_INPUT')
    }
    next(error)
  }
}

router.post('/session', (req, res, next) => {
  const { phone, cookie } = credentials(req)
  return handle(res, next, () => readShopSessionMeta(phone, cookie))
})

router.post('/query', (req, res, next) => {
  const { phone, cookie } = credentials(req)
  return handle(res, next, () => queryShopBusiness(phone, cookie))
})

router.post('/unsubscribe/sms', (req, res, next) => {
  const { phone, cookie } = credentials(req)
  return handle(res, next, () => sendShopUnsubscribeSms(phone, cookie, req.body?.business))
})

router.post('/unsubscribe', (req, res, next) => {
  const { phone, cookie } = credentials(req)
  return handle(res, next, () => unsubscribeShopBusiness(phone, cookie, req.body?.business, req.body?.smsCode))
})

export default router

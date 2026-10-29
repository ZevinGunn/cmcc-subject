import { Router, type Request } from 'express'
import crypto from 'node:crypto'
import { findCurrentUser } from '../services/userAuthStore.js'
import { findCurrentAdmin } from '../services/adminAuthStore.js'
import { isAdminRequest } from '../services/serviceLoginGuard.js'
import { StarbucksError } from '../services/starbucksProtocol.js'
import { starbucksService, type StarbucksService } from '../services/starbucks.js'

async function identity(req: Request) {
  const user = await findCurrentUser(req)
  if (user) return { key: `user:${user.id}`, name: user.displayName || user.username }
  const admin = await findCurrentAdmin(req)
  if (admin) return { key: `admin:${admin.id}`, name: admin.username }
  if (isAdminRequest(req)) return { key: 'admin:system', name: '管理员' }
  throw new StarbucksError('请先登录站点账号，再使用星巴克卡券工具', 401, 'SITE_LOGIN_REQUIRED')
}
export function createStarbucksRouter(service: StarbucksService = starbucksService, resolveIdentity = identity) {
  const router = Router()
  router.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    if (req.header('x-starbucks-client') !== '1' || req.header('sec-fetch-site') === 'cross-site') {
      res.status(403).json({ ok: false, message: '请从星巴克卡券页面操作' }); return
    }
    const origin = req.header('origin')
    if (origin) {
      try { if (new URL(origin).host !== req.header('host')) throw new Error() }
      catch { res.status(403).json({ ok: false, message: '不允许此访问来源' }); return }
    }
    void resolveIdentity(req).then(owner => { res.locals.owner = owner; next() }).catch(next)
  })
  const phoneOf = (value: unknown) => {
    if (typeof value !== 'string' || !/^1\d{10}$/.test(value)) throw new StarbucksError('请输入正确的 11 位手机号')
    return value
  }
  for (const action of ['state', 'sms', 'login', 'refresh', 'codes', 'remove'] as const) {
    const method = action === 'state' ? 'get' : action === 'remove' ? 'delete' : 'post'
    const route = action === 'state' ? '/state' : ['sms', 'login'].includes(action) ? `/auth/${action}` : `/accounts/:id/${action}`
    router[method](route, (req, res, next) => {
      const work = async () => {
        const owner = res.locals.owner, id = String(req.params.id || '')
        let result
        if (action === 'state') result = service.state(owner.key)
        else if (action === 'sms') result = await service.sms(owner.key, phoneOf(req.body?.phone))
        else if (action === 'login') {
          const pin = req.body?.pin
          if (typeof pin !== 'string' || !/^\d{4}$/.test(pin)) throw new StarbucksError('请输入短信中的 4 位验证码')
          result = await service.login(owner.key, phoneOf(req.body?.phone), pin)
        } else if (action === 'refresh') result = await service.refresh(owner.key, id)
        else if (action === 'remove') result = await service.remove(owner.key, id)
        else {
          const ids = req.body?.ids
          if (!Array.isArray(ids) || !ids.length || ids.length > 1000 || ids.some(id => typeof id !== 'string' || !/^[a-f0-9]{64}$/.test(id))) throw new StarbucksError('请选择 1–1000 张有效卡券')
          result = await service.codes(owner.key, id, [...new Set<string>(ids)], req.body?.activeOnly !== false)
        }
        res.json({ ok: true, data: { ...result, identity: owner.name } })
      }
      void work().catch(next)
    })
  }
  router.use((error: unknown, _req: Request, res: import('express').Response, _next: import('express').NextFunction) => {
    const known = error instanceof StarbucksError
    res.status(known ? error.status : 500).json({ ok: false, message: known ? error.message : '星巴克卡券服务暂不可用，请稍后重试',
      errorCode: known ? error.code : 'INTERNAL_ERROR', requestId: crypto.randomUUID() })
  })
  return router
}
export default createStarbucksRouter()

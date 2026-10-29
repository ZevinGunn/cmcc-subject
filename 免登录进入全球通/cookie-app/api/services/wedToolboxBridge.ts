import type { Request, Response } from 'express'
import type { AccountRecord, AccountSummary } from './accountsStore.js'

// Credentials are available only to the authenticated local companion service.
// Proxy headers and the ordinary local-admin shortcut are deliberately excluded.
export function isToolboxBridgeRequest(req: Request): boolean {
  const ip = req.socket.remoteAddress || ''
  return ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(ip)
    && /^(127\.0\.0\.1|localhost)(:\d+)?$/.test(req.headers.host || '')
    && !req.headers.origin && !req.headers['x-forwarded-for'] && !req.headers['forwarded']
    && req.headers['x-wed-toolbox'] === '1'
}

export function toolboxAccountEligible(row: AccountSummary | AccountRecord, now = Date.now()): boolean {
  const hasCookie = 'hasCookie' in row ? row.hasCookie : !!row.cookie
  return !row.disabledAt && hasCookie && !row.cookieInvalidAt
    && (!row.cookieExpireAt || Date.parse(row.cookieExpireAt) > now)
    && /^1\d{10}$/.test(row.phone || '')
}

export function toolboxBridgeHandler(deps: {
  admin(req: Request): Promise<{ id: string } | null>
  user(req: Request): Promise<{ id: string; permissions: { benefitActivity?: boolean } } | null>
  listAdmin(): Promise<AccountSummary[]>
  listUser(id: string): Promise<AccountSummary[]>
  account(id: string): Promise<AccountRecord | null>
}) {
  return async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store')
    if (!isToolboxBridgeRequest(req)) { res.status(403).json({ ok: false, message: '此接口仅供本机工具箱调用' }); return }
    try {
      const admin = await deps.admin(req), user = admin ? null : await deps.user(req)
      if (!admin && !user) { res.status(401).json({ ok: false, message: '请先登录 home 站点' }); return }
      const identity = admin ? `admin:${admin.id}` : `user:${user!.id}`
      if (req.headers['x-wed-identity'] !== identity) { res.status(403).json({ ok: false, message: '登录身份已变化，请重新导入' }); return }
      const rows = admin ? await deps.listAdmin() : await deps.listUser(user!.id)
      const eligible = rows.filter(row => toolboxAccountEligible(row))
      if (req.method === 'GET' && req.path === '/toolbox/accounts') {
        res.json({ ok: true, data: { accounts: eligible.map(row => ({ id: row.id, phone: row.phone })), skipped: rows.length - eligible.length } }); return
      }
      if (req.method !== 'POST' || !req.params.id) { res.status(405).json({ ok: false, message: '不支持的请求' }); return }
      const id = String(req.params.id)
      if (!eligible.some(row => row.id === id)) { res.status(403).json({ ok: false, message: '账号不属于当前用户或 CK 已失效' }); return }
      const rec = await deps.account(id)
      if (!rec || !toolboxAccountEligible(rec) || user && rec.userId !== user.id) { res.status(403).json({ ok: false, message: '账号归属或登录状态已变化' }); return }
      res.json({ ok: true, data: { phone: rec.phone, cookie: rec.cookie } })
    } catch { res.status(503).json({ ok: false, message: '账号导入服务暂不可用，请稍后重试' }) }
  }
}

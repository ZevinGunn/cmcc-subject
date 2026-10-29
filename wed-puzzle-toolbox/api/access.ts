import crypto from 'node:crypto'

export class AccessError extends Error {
  constructor(readonly status: number, message: string) { super(message) }
}
export type Identity = { key: string; name: string; kind: 'admin' | 'user' | 'local' }
export function sessionCookies(header = '') {
  return header.split(';').map(s => s.trim()).filter(s => /^(admin_session|user_session)=[^;\r\n]+$/.test(s)).join('; ')
}
export function ownerDirectory(key: string) { return crypto.createHash('sha256').update(key).digest('hex') }
export async function authenticate(cookie: string, origin = 'http://127.0.0.1:3101'): Promise<Identity> {
  cookie = sessionCookies(cookie)
  if (!cookie) throw new AccessError(401, '请先登录 home 站点')
  for (const kind of ['admin', 'user'] as const) {
    if (!cookie.split('; ').some(s => s.startsWith(`${kind}_session=`))) continue
    let response: Response, payload
    try {
      response = await fetch(`${origin}/api/${kind === 'admin' ? 'admin' : 'auth'}/me`, { headers: { cookie }, signal: AbortSignal.timeout(5000), redirect: 'error' })
      payload = await response.json()
    } catch { throw new AccessError(503, '站点登录服务暂不可用，请稍后重试') }
    if (response.status === 401) continue
    if (!response.ok || !payload.ok) throw new AccessError(503, '站点登录验证失败，请稍后重试')
    const principal = payload.data?.[kind]
    if (!principal || typeof principal.id !== 'string' || !principal.id || principal.disabledAt) throw new AccessError(401, '登录已失效，请重新登录 home 站点')
    if (kind === 'user' && principal.permissions?.benefitActivity !== true) throw new AccessError(403, '此账号尚未开通权益活动权限，请联系管理员配置')
    return { key: `${kind}:${principal.id}`, kind, name: String(principal.displayName || principal.username || kind) }
  }
  throw new AccessError(401, '登录已失效，请重新登录 home 站点')
}

export function checkSource(host: string, origin: string | undefined, port: number, publicOrigin?: string): boolean {
  const local = new Set([`127.0.0.1:${port}`, `localhost:${port}`, '127.0.0.1:4187', 'localhost:4187'])
  if (local.has(host)) return !origin || [...local].some(h => origin === `http://${h}`)
  return !!publicOrigin && host === new URL(publicOrigin).host && (!origin || origin === publicOrigin)
}

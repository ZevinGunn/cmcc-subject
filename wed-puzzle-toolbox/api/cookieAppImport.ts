import crypto from 'node:crypto'
import { authenticate, AccessError, sessionCookies, type Identity } from './access.js'
import type { Account, ImportJob } from './store.js'

type Candidate = { id: string; phone: string }
export class CookieAppBridge {
  private cookie: string
  constructor(private identity: Identity, cookie: string, private origin: string) {
    const url = new URL(origin)
    if (url.protocol !== 'http:' || !['127.0.0.1', 'localhost'].includes(url.hostname) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('cookie-app 导入服务必须是本机 HTTP origin')
    this.cookie = sessionCookies(cookie)
  }
  async verify() {
    const current = await authenticate(this.cookie, this.origin)
    if (current.key !== this.identity.key) throw new AccessError(401, '登录身份已变化，导入已停止')
  }
  private async request(path: string, method = 'GET') {
    await this.verify()
    let response: Response, payload
    try {
      response = await fetch(`${this.origin}/api/wed-puzzle/toolbox${path}`, { method, headers: { Cookie: this.cookie, 'X-Wed-Toolbox': '1', 'X-Wed-Identity': this.identity.key }, redirect: 'error', signal: AbortSignal.timeout(15000) })
      payload = await response.json()
    } catch { throw new AccessError(503, 'cookie-app 账号服务暂不可用，请稍后重试') }
    if (!response.ok || payload.ok !== true) {
      if ([401, 403].includes(response.status)) throw new AccessError(response.status, '登录权限或账号归属已变化，请重新登录后导入')
      throw new AccessError(503, 'cookie-app 账号导入服务暂不可用，请稍后重试')
    }
    return payload.data
  }
  async list(): Promise<{ accounts: Candidate[]; skipped: number }> {
    const data = await this.request('/accounts')
    if (!Array.isArray(data?.accounts) || data.accounts.some((a: Candidate) => typeof a.id !== 'string' || !a.id || !/^1\d{10}$/.test(a.phone))) throw new Error('cookie-app 账号列表格式异常')
    return { accounts: data.accounts, skipped: Number.isSafeInteger(data.skipped) ? data.skipped : 0 }
  }
  async credential(candidate: Candidate): Promise<string> {
    const data = await this.request(`/accounts/${encodeURIComponent(candidate.id)}/session`, 'POST')
    if (data?.phone !== candidate.phone || typeof data.cookie !== 'string' || !data.cookie) throw new Error('账号手机号或凭据已变化，请重新导入')
    return data.cookie
  }
}

export function newImportJob(): ImportJob {
  return { id: crypto.randomUUID(), status: 'running', total: 0, processed: 0, imported: 0, updated: 0, skipped: 0, failed: 0, results: [] }
}
function reason(error: unknown): string {
  const message = error instanceof Error ? error.message : ''
  if (/不一致|已绑定其他号码/.test(message)) return '凭据手机号核验不一致'
  if (/最多 100/.test(message)) return '号码池已满（最多 100 个）'
  if (/失效|登录|会话|CK/.test(message)) return '无法建立有效周三活动登录态，请在 cookie-app 重新登录'
  if (/超时|timeout/i.test(message)) return '活动接口超时，可重新尝试导入'
  return '活动验证失败，可重新尝试导入'
}
export async function runCookieAppImport(job: ImportJob, io: {
  list(): Promise<{ accounts: Candidate[]; skipped: number }>
  credential(candidate: Candidate): Promise<string>
  verify(): Promise<void>
  add(cookie: string, phone: string): Promise<Account>
  exists(phone: string): boolean
  save(): void
}) {
  try {
    const list = await io.list(); job.total = list.accounts.length; job.skipped = list.skipped; io.save()
    const seen = new Set<string>()
    for (const candidate of list.accounts) {
      await io.verify()
      const phone = candidate.phone.slice(0, 3) + '****' + candidate.phone.slice(-4)
      try {
        if (seen.has(candidate.phone)) {
          job.skipped++; job.results.push({ phone, status: 'skipped', message: '同手机号已导入，跳过重复登录记录' })
        } else {
          const cookie = await io.credential(candidate)
          await io.verify()
          const existed = io.exists(candidate.phone), account = await io.add(cookie, candidate.phone)
          const status = existed ? 'updated' : 'imported'
          job[status]++; seen.add(candidate.phone)
          job.results.push({ phone, status, message: account.error ? '活动登录已验证，拼图库存查询失败，可单独刷新' : existed ? '凭据和三档拼图已更新' : '已导入并查询三档拼图' })
        }
      } catch (error) {
        if (error instanceof AccessError) throw error
        job.failed++; job.results.push({ phone, status: 'failed', message: reason(error) })
      }
      job.processed++; io.save()
    }
    job.status = 'completed'
  } catch (error) {
    job.status = 'interrupted'
    job.message = error instanceof AccessError ? error.message : '导入服务异常，已导入号码保留，请稍后重试'
  } finally { io.save() }
}

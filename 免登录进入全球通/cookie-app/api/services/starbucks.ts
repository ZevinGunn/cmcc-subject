import crypto from 'node:crypto'
import fs from 'node:fs'
import { StarbucksStore, type StoredStarbucksAccount } from './starbucksStore.js'
import { StarbucksClient, StarbucksError, loadStarbucksProtocol, maskStarbucksValue, protocolFile } from './starbucksProtocol.js'
import { effectiveCouponStatus, type StarbucksCode } from '../../shared/starbucks.js'

type Client = Pick<StarbucksClient, 'sms' | 'login' | 'coupons'>
export class StarbucksService {
  private queues = new Map<string, Promise<unknown>>()
  private rates = new Map<string, { until: number; count: number }>()
  constructor(readonly store = new StarbucksStore(), readonly client: () => Client = () => new StarbucksClient(loadStarbucksProtocol())) {}
  state(owner: string) { return { accounts: this.store.view(owner), configured: fs.existsSync(protocolFile()) } }
  async exclusive<T>(owner: string, task: () => Promise<T> | T): Promise<T> {
    const previous = this.queues.get(owner) || Promise.resolve()
    const next = previous.catch(() => {}).then(task)
    this.queues.set(owner, next)
    try { return await next } finally { if (this.queues.get(owner) === next) this.queues.delete(owner) }
  }
  private throttle(key: string, limit: number, window: number) {
    const now = Date.now()
    for (const [key, value] of this.rates) if (value.until <= now) this.rates.delete(key)
    const rate = this.rates.get(key)
    if (rate && rate.count >= limit) throw new StarbucksError(`操作过于频繁，请 ${Math.ceil((rate.until - now) / 1000)} 秒后重试`, 429, 'RATE_LIMITED')
    if (!rate && this.rates.size >= 10000) throw new StarbucksError('当前请求较多，请稍后重试', 429)
    this.rates.set(key, { count: (rate?.count || 0) + 1, until: rate?.until || now + window })
  }
  async sms(owner: string, phone: string) {
    // Reserve before the upstream call, including on timeout, to avoid duplicate SMS.
    this.throttle(`sms:${phone}`, 1, 60000)
    this.throttle(`sms-owner:${owner}`, 10, 3600000)
    await this.client().sms(phone)
    return { cooldownSeconds: 60 }
  }
  async login(owner: string, phone: string, pin: string) {
    return this.exclusive(owner, async () => {
      this.throttle(`login:${owner}:${phone}`, 8, 600000)
      const accounts = this.store.read(owner)
      if (accounts.length >= 100 && !accounts.some(a => a.phone === phone)) throw new StarbucksError('每个用户最多保存 100 个星巴克账号')
      const client = this.client(), session = await client.login(phone, pin)
      const previous = accounts.find(a => a.phone === phone)
      const account: StoredStarbucksAccount = { id: previous?.id || crypto.randomUUID(), phone, session,
        updatedAt: new Date().toISOString(), coupons: previous?.coupons || [], queriedAt: previous?.queriedAt }
      this.store.write(owner, [...accounts.filter(a => a.phone !== phone), account])
      // Save the successful session before querying coupons: a list failure must
      // not lose the login or force another SMS.
      let warning: string | undefined
      try { await this.refreshUnlocked(owner, account.id, client) }
      catch (error) { warning = error instanceof StarbucksError ? error.message : '登录成功，卡券查询暂未成功，请点击刷新卡券重试' }
      return { ...this.state(owner), accountId: account.id, warning }
    })
  }
  private async refreshUnlocked(owner: string, id: string, client = this.client()) {
    const account = this.store.account(owner, id)
    try {
      const coupons = await client.coupons(account.session)
      const accounts = this.store.read(owner)
      this.store.write(owner, accounts.map(a => a.id === id ? { ...a, coupons, queriedAt: new Date().toISOString(), invalidAt: undefined } : a))
    } catch (error) {
      if (error instanceof StarbucksError && error.code === 'SESSION_EXPIRED') {
        this.store.write(owner, this.store.read(owner).map(a => a.id === id ? { ...a, invalidAt: new Date().toISOString() } : a))
      }
      throw error
    }
  }
  refresh(owner: string, id: string) {
    return this.exclusive(owner, async () => { await this.refreshUnlocked(owner, id); return this.state(owner) })
  }
  remove(owner: string, id: string) {
    return this.exclusive(owner, () => { this.store.account(owner, id); this.store.write(owner, this.store.read(owner).filter(a => a.id !== id)); return this.state(owner) })
  }
  codes(owner: string, id: string, ids: string[], activeOnly: boolean) {
    return this.exclusive(owner, async () => {
      let account = this.store.account(owner, id)
      if (account.invalidAt || !account.queriedAt || Date.now() - Date.parse(account.queriedAt) > 300000) {
        await this.refreshUnlocked(owner, id)
        account = this.store.account(owner, id)
      }
      const selected = ids.map(id => account.coupons.find(c => c.id === id))
      if (selected.some(c => !c?.code)) throw new StarbucksError('所选卡券已更新或没有可提取券码，请刷新后重新选择', 409)
      if (activeOnly && selected.some(c => effectiveCouponStatus(c!) !== 'active')) throw new StarbucksError('所选卡券包含已使用、过期或未知状态，请刷新后重新选择', 409)
      return { codes: selected.map(c => ({ id: c!.id, title: c!.title, code: c!.code, shortCode: c!.shortCode,
        expiryText: c!.expiryText, phoneMasked: maskStarbucksValue(account.phone, true) })) as StarbucksCode[] }
    })
  }
}
export const starbucksService = new StarbucksService()

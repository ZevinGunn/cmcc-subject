import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import type { StarbucksCoupon } from '../../shared/starbucks.js'

export class StarbucksError extends Error {
  constructor(message: string, readonly status = 400, readonly code = 'STARBUCKS_ERROR') { super(message) }
}
export type StarbucksProtocolConfig = {
  APP_VERSION: string; CHANNEL: string; APPID: string; UA: string
  AES_KEY_STR: string; AES_IV_STR: string
  RSA: Record<string, string>; DEVICE: Record<string, string>
}
export type StarbucksSession = { access_token: string; customer_id?: string }
export type StoredStarbucksCoupon = StarbucksCoupon & { code: string; shortCode: string }
type Json = Record<string, any>
export const protocolFile = () => process.env.STARBUCKS_PROTOCOL_FILE || path.resolve('data/starbucks/protocol.local')

// Parse only the known literal constants. Never execute the supplied userscript.
export function parseStarbucksProtocol(source: string): StarbucksProtocolConfig {
  const config = {} as StarbucksProtocolConfig
  for (const key of ['APP_VERSION', 'CHANNEL', 'APPID', 'UA', 'AES_KEY_STR', 'AES_IV_STR'] as const) {
    const value = source.match(new RegExp(`var\\s+${key}\\s*=\\s*['"]([^'"\\r\\n]+)['"]\\s*;`))?.[1]
    if (!value) throw new Error(`脚本缺少协议字段 ${key}`)
    config[key] = value
  }
  for (const key of ['RSA', 'DEVICE'] as const) {
    const literal = source.match(new RegExp(`var\\s+${key}\\s*=\\s*\\{([\\s\\S]*?)\\};`))?.[1]
    if (!literal) throw new Error(`脚本缺少 ${key}`)
    const values: Record<string, string> = {}
    for (const match of literal.matchAll(/\b(\w+)\s*:\s*(?:'([^'\r\n]*)'|"([^"\r\n]*)"|(APP_VERSION))\s*(?:,|$)/g)) {
      values[match[1]] = match[4] ? config.APP_VERSION : match[2] ?? match[3]
    }
    config[key] = values
  }
  validateProtocol(config)
  return config
}
function validateProtocol(config: StarbucksProtocolConfig) {
  if (Buffer.byteLength(config.AES_KEY_STR || '') !== 32 || Buffer.byteLength(config.AES_IV_STR || '') !== 16
    || !config.APPID || !config.CHANNEL || !config.DEVICE?.id
    || ['n', 'd', 'p', 'q', 'dp', 'dq', 'qinv'].some(key => !/^[0-9a-f]+$/i.test(config.RSA?.[key] || ''))) throw new Error('星巴克协议配置不完整')
}
export function loadStarbucksProtocol(): StarbucksProtocolConfig {
  try { const config = JSON.parse(fs.readFileSync(protocolFile(), 'utf8')); validateProtocol(config); return config }
  catch { throw new StarbucksError('星巴克协议尚未配置，请联系管理员导入参考脚本', 503, 'PROTOCOL_NOT_CONFIGURED') }
}
export function maskStarbucksValue(value: string, phone = false): string {
  if (phone) return value.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
  return value.length > 8 ? `${value.slice(0, 4)}****${value.slice(-4)}` : '****'
}

export function normalizeStarbucksCoupons(list: unknown, now = Date.now()): StoredStarbucksCoupon[] {
  const coupons = new Map<string, StoredStarbucksCoupon>()
  function walk(items: unknown, depth = 0, inherited: Json = {}) {
    if (!Array.isArray(items)) return
    if (depth > 20) throw new StarbucksError('卡券嵌套层级异常，请更新协议', 502)
    for (const item of items) {
      if (!item || typeof item !== 'object') continue
      const raw = item.couponEntity || {}, style = item.couponStyle || {}
      const entity = { ...inherited, ...raw }
      const code = String(raw.memberBenefitId || raw.shortCouponNo || '')
      const shortCode = String(raw.shortCouponNo || '')
      const id = String(raw.memberBenefitId || raw.shortCouponNo || raw.couponId || item.couponId
        || crypto.createHash('sha256').update(JSON.stringify(raw)).digest('hex'))
      const timestamp = Number(entity.expiredTimeStamp)
      const expiresAt = Number.isFinite(timestamp) && timestamp > 0 ? timestamp * (timestamp < 1e12 ? 1000 : 1) : null
      const rawStatus = String(entity.status || '').toUpperCase()
      const status = rawStatus === 'USED' ? 'used' : rawStatus === 'EXPIRED' ? 'expired'
        : rawStatus === 'AVAILABLE' ? expiresAt !== null && expiresAt <= now ? 'expired' : 'active' : 'unknown'
      if (item.couponEntity) coupons.set(id, {
        id: crypto.createHash('sha256').update(id).digest('hex'), title: String(entity.title || '未命名卡券'),
        status, expiresAt, expiryText: String(style.couponExpiryTimeStr || (entity.expiredDate ? `有效期至 ${entity.expiredDate}` : '')),
        code, shortCode, numberMasked: maskStarbucksValue(shortCode || code), codeAvailable: !!code,
        discountDesc: String(style.couponDiscountDesc || ''),
      })
      const { memberBenefitId: _code, shortCouponNo: _short, couponId: _id, ...metadata } = entity
      walk(item.couponSetList, depth + 1, metadata)
    }
  }
  walk(list)
  return [...coupons.values()]
}

export class StarbucksClient {
  private key: crypto.KeyObject
  constructor(readonly config: StarbucksProtocolConfig, readonly transport: typeof fetch = fetch) {
    validateProtocol(config)
    const b64 = (hex: string) => Buffer.from(hex.length % 2 ? `0${hex}` : hex, 'hex').toString('base64url')
    const r = config.RSA
    this.key = crypto.createPrivateKey({ format: 'jwk', key: {
      kty: 'RSA', n: b64(r.n), e: 'AQAB', d: b64(r.d), p: b64(r.p), q: b64(r.q), dp: b64(r.dp), dq: b64(r.dq), qi: b64(r.qinv),
    } })
  }
  encrypt(text: string) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.config.AES_KEY_STR), Buffer.from(this.config.AES_IV_STR))
    return Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]).toString('base64')
  }
  decrypt(text: string) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.config.AES_KEY_STR), Buffer.from(this.config.AES_IV_STR))
    return Buffer.concat([decipher.update(Buffer.from(text, 'base64')), decipher.final()]).toString('utf8')
  }
  sign(timestamp: number, endpoint: string, query: string, body: string) {
    return crypto.sign('sha256', Buffer.from(`2#${this.config.CHANNEL}#${timestamp}#${endpoint}#${query}#${body}`), this.key).toString('base64')
  }
  async request(endpoint: string, body: Json, session?: StarbucksSession, query = '', extra: Record<string, string> = {}) {
    const timestamp = Date.now(), plain = JSON.stringify(body)
    const signature = this.sign(timestamp, endpoint, query, plain)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json; charset=utf-8', lang: 'zh_CN', 'x-language-type': 'zh_CN',
      'x-phone-type': 'ANDROID', 'x-app-version': this.config.APP_VERSION, 'x-data-track': '2', 'User-Agent': this.config.UA,
      'x-signature': endpoint.startsWith('/bff2/') ? signature : `version=2,channel=${this.config.CHANNEL},nonce=${timestamp},sign=${signature}`, ...extra,
    }
    if (session) {
      headers.Authorization = `Bearer ${session.access_token}`
      if (session.customer_id) headers['x-customer-id'] = session.customer_id
    } else headers['No-Authentication'] = 'true'
    let response: Response
    try {
      response = await this.transport(`https://bff.starbucks.com.cn${endpoint}${query ? `?${query}` : ''}`, {
        method: 'POST', headers, body: JSON.stringify({ encrypted: this.encrypt(plain) }),
        signal: AbortSignal.timeout(25000), redirect: 'error',
      })
    } catch { throw new StarbucksError('星巴克接口连接失败或超时，请稍后重试', 502, 'UPSTREAM_NETWORK') }
    if (response.status === 401) throw new StarbucksError('星巴克登录已失效，请重新登录此账号', 401, 'SESSION_EXPIRED')
    const raw = (await response.text()).trim()
    let data: Json
    try { data = JSON.parse(raw) } catch {
      try { data = JSON.parse(this.decrypt(raw)) } catch {
        throw new StarbucksError(`星巴克接口返回了无法解析的响应（HTTP ${response.status}）`, 502, 'UPSTREAM_FORMAT')
      }
    }
    const code = String(data?.code ?? '')
    if (code === '10005') throw new StarbucksError('验证码错误或已过期，请使用最新验证码', 400, 'INVALID_PIN')
    if (code === '81005') throw new StarbucksError('星巴克登录参数已变更，需要更新协议', 502, 'PROTOCOL_CHANGED')
    if (!response.ok || (code && !['0', '200'].includes(code))) {
      // Do not reflect raw responses: they may contain tokens, HTML or phone numbers.
      throw new StarbucksError(`星巴克接口请求未成功（HTTP ${response.status}${/^[\w-]{1,24}$/.test(code) ? `，业务码 ${code}` : ''}），请稍后重试`, response.status === 429 ? 429 : 502, 'UPSTREAM_REJECTED')
    }
    return data
  }
  async sms(phone: string) {
    const data = await this.request('/app-bff-api/sms/send', { device: this.config.DEVICE, phoneNumber: phone, template: 'create-cn', token: '' })
    if (![0, 200, '0', '200'].includes(data.code)) throw new StarbucksError('短信接口未确认发送成功，请稍后重试', 502)
  }
  async login(phone: string, pin: string): Promise<StarbucksSession> {
    const result = await this.request('/app-bff-api/login', { cellPhone: phone, device: this.config.DEVICE, loginType: 'PIN_CODE', pin })
    const token = result.data?.token || result.token
    if (typeof token !== 'string' || !token) throw new StarbucksError('登录接口未返回有效登录凭证', 502)
    const exchanged = await this.request('/app-bff-lgc/default/login/access_token', { grant_type: 'authorization_code', code: token }, undefined,
      '', { 'X-API-Version': '2.0', 'x-msr-version': '2', Accept: 'application/json' })
    const accessToken = exchanged.access_token || exchanged.data?.access_token
    if (typeof accessToken !== 'string' || !accessToken) throw new StarbucksError('换取星巴克登录凭证失败，请重新登录', 502)
    const session: StarbucksSession = { access_token: accessToken }
    try {
      const member = await this.request('/app-bff-api/auth/v2/user/detail', {}, session)
      const customerId = JSON.stringify(member).match(/MEM_[A-Za-z0-9]+/)?.[0]
      if (customerId) session.customer_id = customerId
    } catch (error) {
      if (error instanceof StarbucksError && error.code === 'SESSION_EXPIRED') throw error
      // Member metadata is optional; retain the successfully exchanged token.
    }
    return session
  }
  async coupons(session: StarbucksSession): Promise<StoredStarbucksCoupon[]> {
    const all = new Map<string, StoredStarbucksCoupon>()
    for (let page = 1; page <= 100; page++) {
      const result = await this.request('/bff2/user/coupon/list', {
        base: { adCode: '', birthday: '', memberLevel: 'WELCOME' }, params: { channel: 'ALL', pageNum: page, scene: 'ME' },
      }, session, `appid=${this.config.APPID}&timestamp=${Date.now()}`)
      const data = result.data
      if (!data || !Array.isArray(data.couponList)) throw new StarbucksError('卡券列表响应结构已变更，请更新协议', 502)
      const coupons = normalizeStarbucksCoupons(data.couponList)
      const previous = all.size
      coupons.forEach(c => all.set(c.id, c))
      // Some versions ignore pageNum and return the same complete list again.
      if (!coupons.length || previous === all.size || data.hasNext === false || (Number(data.totalPages) > 0 && page >= Number(data.totalPages))) return [...all.values()]
    }
    throw new StarbucksError('卡券分页超过保护上限，未将不完整结果当作成功，请联系管理员', 502)
  }
}

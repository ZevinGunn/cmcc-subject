import crypto from 'node:crypto'
import { httpsRequestText } from './cmccHttp.js'
import { mergeCookieWithSetCookie } from './cookieUtils.js'
import type { AigouSessionRecord } from './accountsStore.js'

export const LUCKY_THREE_DAY = {
  origin: 'https://dev.coc.10086.cn',
  pagePath: '/coc3/canvas/rightsmarket-h5-canvas/online/26xysrqtybld',
  activityId: 17453,
  taskId: 2999,
  channelCode: 'P00000132544',
} as const

const DEFAULT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'
const SMS_SKU_KEY = '72fc912ce498430d'
const SMS_SKU_IV = '0123456789ABEDEF'

type JsonRecord = Record<string, unknown>

export type LuckySignReward = {
  signDays: number
  skuId: number
  awardName: string
  awardPicUrl?: string
  hasRemainCount: boolean
}

export type LuckySignStatus = {
  taskId: number
  accumulateCount: number
  pushStatus: number
  signToday: boolean
  limitCount: boolean
  rewards: LuckySignReward[]
}

export type LuckyProductState =
  | 'not_started'
  | 'available'
  | 'claimed'
  | 'no_chance'
  | 'sold_out'
  | 'ended'
  | 'unavailable'

export type LuckyProduct = {
  activityId: number
  batchId: number
  mid: number
  skuId: number
  name: string
  imageUrl?: string
  price: number
  total: number
  available: number
  upstreamAvailable: number
  inventoryOverride?: number
  salesVolume: number
  joinStatus: number
  jumpUrl?: string
  useUrl?: string
  maxLimit: number
  state: LuckyProductState
  actionLabel: string
  actionable: boolean
  upstreamActionable: boolean
  attemptable: boolean
}

export type LuckyBatch = {
  id: number
  activityStatus: number
  showStartTime?: string
  showEndTime?: string
  startTime?: string
  endTime?: string
  products: LuckyProduct[]
}

export type LuckyActivity = {
  id: number
  name: string
  startTime?: string
  endTime?: string
  type: number
  subType: number
  repeatable: boolean
  description: string
  batches: LuckyBatch[]
}

export type LuckyQualification = {
  eligible: boolean
  resultCode: string
  message: string
  data?: unknown
}

export type LuckyActionResult = {
  success: boolean
  resultCode: string
  message: string
  data?: unknown
}

export class LuckyThreeDayError extends Error {
  readonly code: string
  readonly status: number

  constructor(message: string, code = 'LUCKY_THREE_DAY_UPSTREAM_ERROR', status = 424) {
    super(message)
    this.name = 'LuckyThreeDayError'
    this.code = code
    this.status = status
  }
}

function asRecord(value: unknown): JsonRecord | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as JsonRecord
    : undefined
}

function text(value: unknown): string {
  return value === undefined || value === null ? '' : String(value).trim()
}

function numberValue(value: unknown, fallback = 0): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function boolValue(value: unknown): boolean {
  return value === true || value === 1 || value === '1'
}

function timestampIso(value: unknown): string | undefined {
  let timestamp = numberValue(value, NaN)
  if (!Number.isFinite(timestamp) || timestamp <= 0) return undefined
  if (timestamp < 10_000_000_000) timestamp *= 1000
  const date = new Date(timestamp)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

function resultCode(payload: JsonRecord | undefined): string {
  return text(payload?.resultCode ?? payload?.code)
}

function resultMessage(payload: JsonRecord | undefined, fallback: string): string {
  return text(payload?.msg ?? payload?.message ?? payload?.resultMsg) || fallback
}

function assertSessionActive(payload: JsonRecord): void {
  const code = resultCode(payload)
  const message = resultMessage(payload, '')
  if (code === '-516' || /\u767b\u5f55.*(?:\u5931\u6548|\u8fc7\u671f)|\u672a\u767b\u5f55/.test(message)) {
    throw new LuckyThreeDayError(message || '爱购商城登录已失效', 'SESSION_EXPIRED', 401)
  }
}

function safeUrl(value: unknown): string | undefined {
  const raw = text(value)
  if (!raw) return undefined
  try {
    const url = new URL(raw)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined
  } catch {
    return undefined
  }
}

function sanitizeResponseData(value: unknown, depth = 0): unknown {
  if (depth > 5 || value === null || value === undefined) return value
  if (typeof value === 'string') {
    return value.replace(/1\d{10}/g, (phone) => `${phone.slice(0, 3)}****${phone.slice(-4)}`)
  }
  if (typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map((item) => sanitizeResponseData(item, depth + 1))
  const output: JsonRecord = {}
  for (const [key, item] of Object.entries(value as JsonRecord)) {
    if (/(cookie|token|ticket|phone|mobile|receiver|smscode|dfp|wtac|fingerprint)/i.test(key)) continue
    output[key] = sanitizeResponseData(item, depth + 1)
  }
  return output
}

export function productUiState(
  activityStatus: number,
  available: number,
  joinStatus: number,
  jumpUrl?: string,
): Pick<LuckyProduct, 'state' | 'actionLabel' | 'actionable'> {
  if (activityStatus === 0) return { state: 'not_started', actionLabel: '即将开始', actionable: false }
  if (activityStatus === 2) return { state: 'ended', actionLabel: '已结束', actionable: false }
  if (joinStatus === 1 || joinStatus === 17) {
    return { state: 'claimed', actionLabel: jumpUrl ? '去使用' : '已领取', actionable: false }
  }
  if (joinStatus === 3 || available <= 0) return { state: 'sold_out', actionLabel: '已抢完', actionable: false }
  if ([2, 6, 7].includes(joinStatus)) return { state: 'no_chance', actionLabel: '暂无资格', actionable: false }
  if (activityStatus === 1 && joinStatus === 0 && available > 0) {
    return { state: 'available', actionLabel: '立即抢购', actionable: true }
  }
  return { state: 'unavailable', actionLabel: '暂不可领', actionable: false }
}

export function normalizeSignInfo(payload: unknown): LuckySignStatus {
  const root = asRecord(payload)
  if (resultCode(root) === '-516') {
    throw new LuckyThreeDayError(resultMessage(root, '爱购商城登录已失效'), 'SESSION_EXPIRED', 401)
  }
  if (resultCode(root) !== '0') {
    throw new LuckyThreeDayError(resultMessage(root, '签到状态查询失败'), 'SIGN_STATUS_FAILED')
  }
  const data = asRecord(root?.data)
  if (!data) throw new LuckyThreeDayError('签到状态缺少 data', 'INVALID_UPSTREAM_RESPONSE')
  const rewards = Array.isArray(data.skuList) ? data.skuList : []
  return {
    taskId: numberValue(data.taskId, LUCKY_THREE_DAY.taskId),
    accumulateCount: numberValue(data.accumulateCount),
    pushStatus: numberValue(data.pushStatus),
    signToday: boolValue(data.signToday),
    limitCount: boolValue(data.limitCount),
    rewards: rewards.map((item) => {
      const reward = asRecord(item) || {}
      const urls = Array.isArray(reward.awardPicUrls) ? reward.awardPicUrls : []
      return {
        signDays: numberValue(reward.signDays),
        skuId: numberValue(reward.skuId),
        awardName: text(reward.awardName) || '签到奖励',
        awardPicUrl: safeUrl(urls[0]),
        hasRemainCount: boolValue(reward.hasRemainCount),
      }
    }),
  }
}

export function normalizeActivity(payload: unknown): LuckyActivity {
  const root = asRecord(payload)
  if (resultCode(root) === '-516') {
    throw new LuckyThreeDayError(resultMessage(root, '爱购商城登录已失效'), 'SESSION_EXPIRED', 401)
  }
  if (resultCode(root) !== '0') {
    throw new LuckyThreeDayError(resultMessage(root, '活动商品查询失败'), 'ACTIVITY_QUERY_FAILED')
  }
  const data = asRecord(root?.data)
  if (!data) throw new LuckyThreeDayError('活动响应缺少 data', 'INVALID_UPSTREAM_RESPONSE')
  const rawBatches = Array.isArray(data.subActivityList) ? data.subActivityList : []
  const activityId = numberValue(data.id, LUCKY_THREE_DAY.activityId)
  const batches: LuckyBatch[] = rawBatches.map((item) => {
    const batch = asRecord(item) || {}
    const batchId = numberValue(batch.id)
    const activityStatus = numberValue(batch.activityStatus, -1)
    const rawGoods = Array.isArray(batch.goodsList) ? batch.goodsList : []
    const products = rawGoods.map((goodsItem): LuckyProduct => {
      const goods = asRecord(goodsItem) || {}
      const available = numberValue(goods.availableNum)
      const joinStatus = numberValue(goods.joinStatus, -1)
      const jumpUrl = safeUrl(goods.jumpUrl)
      const useUrl = safeUrl(goods.useUrl)
      const ui = productUiState(activityStatus, available, joinStatus, jumpUrl || useUrl)
      return {
        activityId: numberValue(goods.aid, activityId),
        batchId: numberValue(goods.abatchId, batchId),
        mid: numberValue(goods.mid),
        skuId: numberValue(goods.skuid ?? goods.skuId),
        name: text(goods.showName ?? goods.name ?? goods.midName) || '话费兑换券',
        imageUrl: safeUrl(goods.cdnUrl ?? goods.picUrl),
        price: numberValue(goods.price),
        total: numberValue(goods.num),
        available,
        upstreamAvailable: available,
        salesVolume: numberValue(goods.salesVolume),
        joinStatus,
        jumpUrl,
        useUrl,
        maxLimit: numberValue(goods.maxLimit, 1),
        state: ui.state,
        actionLabel: ui.actionLabel,
        actionable: true,
        upstreamActionable: ui.actionable,
        attemptable: true,
      }
    })
    return {
      id: batchId,
      activityStatus,
      showStartTime: timestampIso(batch.showStartTime),
      showEndTime: timestampIso(batch.showEndTime),
      startTime: timestampIso(batch.startTime),
      endTime: timestampIso(batch.endTime),
      products,
    }
  })
  return {
    id: activityId,
    name: text(data.name) || '幸运三日签',
    startTime: timestampIso(data.startTime),
    endTime: timestampIso(data.endTime),
    type: numberValue(data.type),
    subType: numberValue(data.subType),
    repeatable: boolValue(data.repeatable),
    description: text(data.description),
    batches,
  }
}

export function encryptSmsSkuId(skuId: number, timestamp = Date.now()): string {
  if (!Number.isInteger(skuId) || skuId <= 0) throw new LuckyThreeDayError('SKU 格式不正确', 'INVALID_SKU', 400)
  const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(SMS_SKU_KEY), Buffer.from(SMS_SKU_IV))
  return Buffer.concat([
    cipher.update(`${skuId}_${timestamp}`, 'utf8'),
    cipher.final(),
  ]).toString('base64')
}

export class LuckyThreeDayClient {
  private sessionValue: AigouSessionRecord
  private readonly initialCookie: string

  constructor(session: AigouSessionRecord) {
    this.sessionValue = { ...session }
    this.initialCookie = session.cookie
  }

  get session(): AigouSessionRecord {
    return { ...this.sessionValue }
  }

  get cookieChanged(): boolean {
    return this.sessionValue.cookie !== this.initialCookie
  }

  private referer(): string {
    const url = new URL(LUCKY_THREE_DAY.pagePath, LUCKY_THREE_DAY.origin)
    url.searchParams.set('channelCode', LUCKY_THREE_DAY.channelCode)
    return url.toString()
  }

  private async request(path: string, options: { method?: 'GET' | 'POST'; body?: unknown } = {}): Promise<JsonRecord> {
    const method = options.method || 'GET'
    const response = await httpsRequestText({
      url: new URL(path, LUCKY_THREE_DAY.origin).toString(),
      method,
      headers: {
        Cookie: this.sessionValue.cookie,
        phone: this.sessionValue.token,
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        ...(method === 'POST' ? { 'Content-Type': 'application/json;charset=UTF-8', Origin: LUCKY_THREE_DAY.origin } : {}),
        Referer: this.referer(),
        'User-Agent': DEFAULT_UA,
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      timeoutMs: 15000,
    })
    const merged = mergeCookieWithSetCookie({
      cookie: this.sessionValue.cookie,
      setCookie: response.headers['set-cookie'],
    })
    if (merged.changed) this.sessionValue = { ...this.sessionValue, cookie: merged.cookie }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new LuckyThreeDayError(`三日签上游返回 HTTP ${response.statusCode}`, 'UPSTREAM_HTTP_ERROR', 502)
    }
    try {
      const payload = JSON.parse(response.bodyText) as unknown
      const record = asRecord(payload)
      if (!record) throw new Error('NOT_OBJECT')
      return record
    } catch {
      throw new LuckyThreeDayError('三日签上游返回了无法解析的响应', 'INVALID_UPSTREAM_RESPONSE', 502)
    }
  }

  async signStatus(): Promise<LuckySignStatus> {
    return normalizeSignInfo(await this.request(
      '/coc3/coc3-market-activity/cmpp-manage/task/getTaskSignInfo',
      { method: 'POST', body: { taskId: LUCKY_THREE_DAY.taskId } },
    ))
  }

  async activity(): Promise<LuckyActivity> {
    const query = new URLSearchParams({
      activityId: String(LUCKY_THREE_DAY.activityId),
      selfChannelCode: LUCKY_THREE_DAY.channelCode,
      batchId: '0',
      showLimit: '3',
      seckillType: '1',
      from: 'page',
      t: String(Math.floor(Date.now() / 1000)),
    })
    return normalizeActivity(await this.request(`/coc3/coc3-market-activity/arrange/getProByActId?${query}`))
  }

  async sign(): Promise<LuckyActionResult> {
    const payload = await this.request(
      '/coc3/coc3-market-activity/cmpp-manage/task/accumulateSign',
      {
        method: 'POST',
        body: {
          taskId: LUCKY_THREE_DAY.taskId,
          channelCode: LUCKY_THREE_DAY.channelCode,
        },
      },
    )
    assertSessionActive(payload)
    return {
      success: resultCode(payload) === '0',
      resultCode: resultCode(payload),
      message: resultMessage(payload, '签到请求已完成'),
      data: sanitizeResponseData(payload.data),
    }
  }

  async qualification(product: Pick<LuckyProduct, 'skuId' | 'batchId'>): Promise<LuckyQualification> {
    const query = new URLSearchParams({
      activityId: String(LUCKY_THREE_DAY.activityId),
      skuId: String(product.skuId),
      businessType: '1',
      batchId: String(product.batchId),
      t: String(Math.floor(Date.now() / 1000)),
    })
    const payload = await this.request(`/coc3/coc3-market-activity/arrange/checkQualificByActivityId/v3?${query}`)
    assertSessionActive(payload)
    const code = resultCode(payload)
    return {
      eligible: code === '0',
      resultCode: code,
      message: resultMessage(payload, code === '0' ? '符合参与条件' : '暂不符合参与条件'),
      data: sanitizeResponseData(payload.data),
    }
  }

  async sendOrderSms(product: Pick<LuckyProduct, 'skuId'>): Promise<LuckyActionResult> {
    const payload = await this.request('/coc3/coc3-market/api/sms/qwSendSmsCode', {
      method: 'POST',
      body: {
        receivers: this.sessionValue.token,
        skuId: encryptSmsSkuId(product.skuId),
        member: false,
        businessChannelCode: LUCKY_THREE_DAY.channelCode,
        activityId: LUCKY_THREE_DAY.activityId,
      },
    })
    assertSessionActive(payload)
    return {
      success: resultCode(payload) === '0',
      resultCode: resultCode(payload),
      message: resultMessage(payload, '验证码请求已完成'),
      data: sanitizeResponseData(payload.data),
    }
  }

  async confirmOrder(product: Pick<LuckyProduct, 'skuId'>, smsCode: string): Promise<LuckyActionResult> {
    const payload = await this.request(
      '/coc3/coc3-market-order/api/external/order/activity/placeOrder',
      {
        method: 'POST',
        body: {
          skuId: product.skuId,
          channelCode: LUCKY_THREE_DAY.channelCode,
          selfChannelCode: LUCKY_THREE_DAY.channelCode,
          smsCode,
          dealType: 0,
          activityId: LUCKY_THREE_DAY.activityId,
          referer: this.referer(),
        },
      },
    )
    assertSessionActive(payload)
    return {
      success: resultCode(payload) === '0',
      resultCode: resultCode(payload),
      message: resultMessage(payload, '领取请求已提交'),
      data: sanitizeResponseData(payload.data),
    }
  }
}

export function isLoginExpiredResult(result: LuckyActionResult | LuckyQualification): boolean {
  return result.resultCode === '-516' || /\u767b\u5f55.*(?:\u5931\u6548|\u8fc7\u671f)|\u672a\u767b\u5f55/.test(result.message)
}

export function findActivityProduct(
  activity: LuckyActivity,
  input: { batchId: number; skuId: number; mid?: number },
): LuckyProduct {
  const batch = activity.batches.find((item) => item.id === input.batchId)
  const product = batch?.products.find((item) => item.skuId === input.skuId)
  if (!batch || !product || (input.mid && product.mid !== input.mid)) {
    throw new LuckyThreeDayError('当前活动中未找到该奖品', 'PRODUCT_NOT_FOUND', 404)
  }
  return product
}

export const __test__ = {
  normalizeActivity,
  normalizeSignInfo,
  productUiState,
  encryptSmsSkuId,
  sanitizeResponseData,
}

import type { BenefitOrderProduct, BenefitOrderResult } from './cmccBenefitOrder.js'

export type LuckyBagVariant = 'standard' | 'deluxe'
export type LuckyBagAction = 'main_order' | 'benefit_order' | 'benefit_change'
export const LUCKY_BAG_PRESETS = {
  standard: {
    name: '标准福袋', pageId: '1745340999727562752', mainProductCode: '100000096331', fee: 9.9,
    path: 'web2/numbericalBag/index',
    benefits: [
      { code: '100000096334', bundle: '789000000796', name: '移动云盘白银会员' },
      { code: '100000096337', bundle: '789000000805', name: '咪咕快游会员' },
      { code: '100000096338', bundle: '789000000806', name: '视频彩铃钻石会员' },
      { code: '100000096335', bundle: '789000000802', name: '新通话 AI精彩通话' },
      { code: '100000096336', bundle: '789000000804', name: '2C4G云电脑20小时月包' },
    ],
  },
  deluxe: {
    name: '豪华福袋', pageId: '1746789684727894016', mainProductCode: '100000096333', fee: 19.9,
    path: 'web2/numbericalBag_prime/index',
    benefits: [
      { code: '100000096339', bundle: '789000000807', name: '咪咕视频钻石会员' },
      { code: '100000096342', bundle: '789000000810', name: '移动云盘黄金会员' },
      { code: '100000096340', bundle: '789000000808', name: '8C16G云电脑20小时月包' },
      { code: '100000096341', bundle: '789000000809', name: '云手机专业版' },
    ],
  },
} as const

export class LuckyBagError extends Error {
  constructor(message: string, public readonly code: string, public readonly status = 409) {
    super(message)
    this.name = 'LuckyBagError'
  }
}

export type LuckyBagStatus = {
  variant: LuckyBagVariant
  mainOrdered: boolean
  currentBenefitCodes: string[]
  action: LuckyBagAction
  mainMonthlyFee: number
}

export type LuckyBagState = {
  bagVariant: LuckyBagVariant
  phone: string
  maskedPhone: string
  userId?: string
  provinceCode?: string
  product?: BenefitOrderProduct
  bagBaseRulesHtml?: string
}
type JsonRecord = Record<string, unknown>
export type LuckyBagRequest = (path: string, body: unknown, encryption?: 'meteor' | 'aurora') => Promise<JsonRecord>

function record(value: unknown): JsonRecord | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : undefined
}

export function readLuckyBagVariant(value: unknown): LuckyBagVariant {
  if (value === 'standard' || value === 'deluxe') return value
  throw new LuckyBagError('请选择标准福袋或豪华福袋', 'INVALID_BAG_VARIANT', 400)
}

export function luckyBagSourceUrl(variant: LuckyBagVariant): string {
  const config = LUCKY_BAG_PRESETS[variant]
  return `https://dev.coc.10086.cn/coc/${config.path}?pageId=${config.pageId}&channelId=P00000005603`
}

function ensureSuccess(payload: JsonRecord): void {
  if (String(payload.code) === '40') throw new LuckyBagError('福袋登录态已过期，请重新开始短信登录', 'COC_LOGIN_EXPIRED', 410)
  if (String(payload.code) !== '0') throw new LuckyBagError(String(payload.message || '福袋上游请求失败'), String(payload.code || 'UPSTREAM_FORMAT'), 424)
}

export function parseLuckyBagRelation(payload: JsonRecord, allowed: readonly string[]): string[] {
  ensureSuccess(payload)
  const data = record(payload.data)
  if (!data || ![true, false, 0, 1, '0', '1', 'true', 'false'].includes(data.isOrder as string | number | boolean)) {
    throw new LuckyBagError('上游未返回明确的福袋订购关系', 'BAG_RELATION_INVALID', 424)
  }
  const ordered = [true, 1, '1', 'true'].includes(data.isOrder as string | number | boolean)
  if (!ordered) {
    if (Array.isArray(data.respDTOList) && data.respDTOList.length) throw new LuckyBagError('福袋关系状态与产品列表不一致', 'BAG_RELATION_INVALID', 424)
    return []
  }
  if (!Array.isArray(data.respDTOList) || data.respDTOList.length === 0) {
    throw new LuckyBagError('已订购关系缺少产品列表', 'BAG_RELATION_INVALID', 424)
  }
  const codes = data.respDTOList.map((item) => String(record(item)?.productCode || ''))
  if (codes.some((code) => !allowed.includes(code))) throw new LuckyBagError('订购关系包含未识别产品，请通过官方页面核对', 'BAG_RELATION_UNKNOWN', 424)
  return [...new Set(codes)]
}

export async function queryLuckyBagStatus(state: LuckyBagState, request: LuckyBagRequest): Promise<LuckyBagStatus> {
  const config = LUCKY_BAG_PRESETS[state.bagVariant]
  if (!state.userId || !state.provinceCode) throw new LuckyBagError('缺少福袋独立登录凭证，请重新登录', 'BAG_LOGIN_REQUIRED', 410)
  const common = {
    type: 0, touchCode: 'P00000005603', pageId: config.pageId,
    userId: state.userId, sourceUrl: luckyBagSourceUrl(state.bagVariant),
  }
  const main = await request('pkg/contract/common/productRelation', {
    ...common, productCodes: [config.mainProductCode],
    ...(state.bagVariant === 'standard' ? { mobile: state.phone } : {}),
  })
  const mainOrdered = parseLuckyBagRelation(main, [config.mainProductCode]).length > 0
  const rights = await request('pkg/contract/common/productRelation', {
    ...common, productCodes: config.benefits.map((item) => item.code),
  })
  const currentBenefitCodes = parseLuckyBagRelation(rights, config.benefits.map((item) => item.code))
  if (!mainOrdered && currentBenefitCodes.length) throw new LuckyBagError('权益已存在但主资费尚未确认，请等待生效后刷新', 'BAG_RELATION_INCONSISTENT')
  if (currentBenefitCodes.length > 1) throw new LuckyBagError('账号存在多个福袋权益，请先通过官方渠道核对', 'BAG_MULTIPLE_BENEFITS')
  return {
    variant: state.bagVariant, mainOrdered, currentBenefitCodes,
    action: !mainOrdered ? 'main_order' : currentBenefitCodes.length ? 'benefit_change' : 'benefit_order',
    mainMonthlyFee: config.fee,
  }
}

function rulesHtml(payload: JsonRecord): string {
  ensureSuccess(payload)
  const list = record(payload.data)?.configList
  return Array.isArray(list) ? list.map((item) => String(record(item)?.subContent || '')).filter(Boolean).join('\n') : ''
}

// An accepted or uncertain submission survives UI restart within this process.
const pendingOrders = new Map<string, { target: string; expiresAt: number }>()
const orderLocks = new Set<string>()
type SmsKind = 'login' | 'order'
const smsLocks = new Set<string>()
const smsSentAt = new Map<string, number>()
function smsKey(state: Pick<LuckyBagState, 'phone'>, kind: SmsKind): string { return `${state.phone}:${kind}` }
export function luckyBagSmsSentAt(state: Pick<LuckyBagState, 'phone'>, kind: SmsKind): number | undefined {
  const key = smsKey(state, kind)
  const sentAt = smsSentAt.get(key)
  if (sentAt && Date.now() - sentAt >= 60_000) { smsSentAt.delete(key); return undefined }
  return sentAt
}
export function lockLuckyBagSms(state: LuckyBagState, kind: SmsKind): () => void {
  const key = smsKey(state, kind)
  if (smsLocks.has(key)) throw new LuckyBagError('该手机号正在发送验证码，请稍后重试', 'SMS_IN_FLIGHT')
  const sentAt = luckyBagSmsSentAt(state, kind)
  if (sentAt) throw new LuckyBagError(`验证码发送过于频繁，请 ${Math.ceil((60_000 - Date.now() + sentAt) / 1000)} 秒后重试`, 'SMS_COOLDOWN', 429)
  smsLocks.add(key)
  return () => { smsLocks.delete(key) }
}
export function recordLuckyBagSms(state: LuckyBagState, kind: SmsKind): void {
  // Bound expired entries even when a phone is never used again.
  for (const [key, timestamp] of smsSentAt) if (Date.now() - timestamp >= 60_000) smsSentAt.delete(key)
  smsSentAt.set(smsKey(state, kind), Date.now())
}
function orderKey(state: LuckyBagState): string { return `${state.phone}:${state.bagVariant}` }

function assertNoPendingOrder(state: LuckyBagState, status: LuckyBagStatus): void {
  const key = orderKey(state)
  const pending = pendingOrders.get(key)
  if (!pending) return
  if (pending.expiresAt <= Date.now() || (status.mainOrdered && status.currentBenefitCodes.includes(pending.target))) {
    pendingOrders.delete(key)
    return
  }
  throw new LuckyBagError('上次办理尚未确认生效，请先通过官方渠道核查或稍后刷新订购关系', 'BAG_ORDER_PENDING')
}

export async function prepareLuckyBagProduct(state: LuckyBagState, request: LuckyBagRequest): Promise<BenefitOrderProduct> {
  const config = LUCKY_BAG_PRESETS[state.bagVariant]
  const status = await queryLuckyBagStatus(state, request)
  assertNoPendingOrder(state, status)
  const rules = await request('grocer/copyWriting/page/query', {
    configType: '2', pageId: config.pageId, productCode: config.mainProductCode, provinceCode: state.provinceCode,
  }, 'meteor')
  const baseRulesHtml = rulesHtml(rules)
  state.bagBaseRulesHtml = baseRulesHtml
  return {
    name: config.name, productCode: config.mainProductCode, rulesHtml: baseRulesHtml, bagStatus: status,
    norms: config.benefits.filter((item) => !status.currentBenefitCodes.includes(item.code)).map((item) => ({
      id: item.code, packageId: item.bundle, name: item.name, price: status.mainOrdered ? 0 : config.fee,
      bizIntfCode: '', productTags: status.mainOrdered ? '套餐内权益' : '主资费含一项权益', candidateIds: [item.code], variantCount: 1,
    })),
    details: [{ label: '当前权益', value: config.benefits.filter((item) => status.currentBenefitCodes.includes(item.code)).map((item) => item.name).join('、') || '未选择' }],
    warnings: [status.mainOrdered ? '权益为多选一，更换将替代当前权益；额外费用及生效时间以实时协议为准' : `首订${config.name} ${config.fee} 元/月，同时选择一项权益；合约及续订规则以实时协议为准`],
  }
}

export function resolveLuckyBagSelection(state: LuckyBagState, ids: string[]) {
  const status = state.product?.bagStatus
  const benefit = ids.length === 1 ? LUCKY_BAG_PRESETS[state.bagVariant].benefits.find((item) => item.code === ids[0]) : undefined
  if (!status || !benefit) throw new LuckyBagError('请选择当前福袋的一项权益', 'INVALID_BAG_BENEFIT', 400)
  if (status.currentBenefitCodes.includes(benefit.code)) throw new LuckyBagError('该权益已订购，请选择其他权益', 'BAG_BENEFIT_ALREADY_ORDERED')
  return { status, benefit, orderCode: status.mainOrdered ? benefit.code : benefit.bundle }
}

export async function assertLuckyBagRelationUnchanged(state: LuckyBagState, request: LuckyBagRequest): Promise<void> {
  const expected = state.product?.bagStatus
  const current = await queryLuckyBagStatus(state, request)
  assertNoPendingOrder(state, current)
  if (!expected || current.mainOrdered !== expected.mainOrdered || current.currentBenefitCodes.join(',') !== expected.currentBenefitCodes.join(',')) {
    throw new LuckyBagError('订购关系已变化，请刷新产品后重新选择权益', 'BAG_RELATION_CHANGED')
  }
}

export async function selectLuckyBagProduct(state: LuckyBagState, ids: string[], request: LuckyBagRequest): Promise<BenefitOrderProduct> {
  const { status, benefit } = resolveLuckyBagSelection(state, ids)
  await assertLuckyBagRelationUnchanged(state, request)
  const config = LUCKY_BAG_PRESETS[state.bagVariant]
  const protocolPayload = await request('grocer/protocol/prov/queryProtocol', {
    pageId: config.pageId, productCode: benefit.bundle, provinceCode: state.provinceCode, userId: state.userId, verifyType: '0',
  }, 'meteor')
  ensureSuccess(protocolPayload)
  const protocols = Array.isArray(protocolPayload.data) ? protocolPayload.data.map(record) : []
  const first = protocols[0]
  const content = protocols.map((item) => String(item?.content || item?.protocolContent || '')).filter(Boolean).join('\n')
  if (!first?.protocolSequenceId || !content.trim()) throw new LuckyBagError('上游未返回完整业务协议，请稍后重试', 'PROTOCOL_MISSING', 424)
  const detail = await request('grocer/copyWriting/page/query', {
    configType: '3', pageId: config.pageId, productCode: benefit.code, provinceCode: state.provinceCode,
  }, 'meteor')
  return {
    ...state.product!, selectedIds: [benefit.code], selectedName: benefit.name, selectedPrice: status.mainOrdered ? 0 : config.fee,
    rulesHtml: [state.bagBaseRulesHtml ?? state.product!.rulesHtml, rulesHtml(detail)].filter(Boolean).join('\n'), eligible: true,
    eligibilityMessage: status.mainOrdered ? '主资费已订购，可选择或更换套餐内权益' : '主资费未订购，本次办理主资费及所选权益',
    protocol: { name: String(first.protocolName || '福袋业务受理协议'), content, sequenceId: String(first.protocolSequenceId) }, protocolRequired: true,
  }
}

export function buildLuckyBagSmsBody(state: LuckyBagState): JsonRecord {
  const { orderCode } = resolveLuckyBagSelection(state, state.product?.selectedIds || [])
  return {
    mobile: state.phone, userId: state.userId, productCode: orderCode, smsCodeTypeEnum: '505',
    pageId: LUCKY_BAG_PRESETS[state.bagVariant].pageId, touchCode: 'P00000005603', templateNo: '1871462953729064960',
  }
}

export function buildLuckyBagOrder(state: LuckyBagState, code: string): { path: string; body: JsonRecord } {
  const { status, orderCode } = resolveLuckyBagSelection(state, state.product?.selectedIds || [])
  if (!state.product?.protocol?.sequenceId) throw new LuckyBagError('请重新获取业务协议', 'PROTOCOL_MISSING')
  const config = LUCKY_BAG_PRESETS[state.bagVariant]
  return {
    path: status.mainOrdered ? 'pkg/order/combineProductChange' : 'pkg/order/combineBookProduct',
    body: {
      pageId: config.pageId, productCode: orderCode, touchCode: 'P00000005603', uid: '', sellerId: '', channelSeqId: '',
      sourceUrl: luckyBagSourceUrl(state.bagVariant), protocolSequenceId: state.product.protocol.sequenceId,
      smsCode: code, verifyType: 0, smsCodeTypeEnum: '505', userId: state.userId,
      ...(status.mainOrdered ? { pcardPasswd: config.mainProductCode, mobile: state.bagVariant === 'deluxe' ? state.maskedPhone : state.phone }
        : state.bagVariant === 'deluxe' ? { nProductCode: config.mainProductCode } : { mobile: state.phone }),
    },
  }
}

export function lockLuckyBagOrder(state: LuckyBagState): () => void {
  const key = orderKey(state)
  if (orderLocks.has(key)) throw new LuckyBagError('该账号福袋订购正在提交，请勿重复操作', 'ORDER_IN_FLIGHT')
  orderLocks.add(key)
  return () => { orderLocks.delete(key) }
}

export function recordLuckyBagResult(state: LuckyBagState, result: BenefitOrderResult): void {
  if (!result.accepted && !result.uncertain) return
  const target = state.product?.selectedIds?.[0]
  if (target) pendingOrders.set(orderKey(state), { target, expiresAt: Date.now() + 24 * 60 * 60_000 })
}

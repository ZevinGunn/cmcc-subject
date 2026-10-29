import crypto from 'node:crypto'
import { BenefitOrderError, createRetailCallbackClient } from './cmccBenefitOrder.js'

type RecordData = Record<string, unknown>
type Client = Awaited<ReturnType<typeof createRetailCallbackClient>>
export type CallbackResult = { status: 'success' | 'duplicate' | 'failed' | 'unknown'; message: string; bizOrderId?: string; upstreamCode?: string }
type Session = {
  id: string; ownerKey: string; accountId: string; expiresAt: number; client: Client
  productCode: string; product: RecordData; norms: RecordData[]; payload?: RecordData
  preparationId?: string; busy?: boolean; result?: CallbackResult
}
const object = (value: unknown): RecordData => value && typeof value === 'object' && !Array.isArray(value) ? value as RecordData : {}
const str = (value: unknown) => value == null ? '' : String(value)
function success(payload: RecordData, fallback: string) {
  if (str(payload.returnCode) !== '0') throw new BenefitOrderError(str(payload.returnMessage) || fallback, str(payload.returnCode) || 'UPSTREAM_ERROR')
}

// Duplicate appointments use returnCode=-9999 / ok=false in the captured official response.
export function parseCallbackResult(payload: RecordData): CallbackResult {
  const data = object(payload.data)
  const upstreamCode = str(payload.returnCode)
  if (str(data.flag) === '2') return { status: 'duplicate', upstreamCode, message: str(payload.returnMessage) || '您已经预约过了，请耐心等待客服回电。' }
  if (upstreamCode === '0' && str(data.flag) === '1') return {
    status: 'success', upstreamCode, bizOrderId: str(data.bizOrderId) || undefined,
    message: '预约成功，请保持手机畅通，留意客服人员来电。',
  }
  return { status: 'failed', upstreamCode, message: str(payload.returnMessage) || '预约未成功，请稍后重试。' }
}

export function callbackFlowAllowed(rule: RecordData, channel: string): boolean {
  if (str(rule.configType) === '2') return Array.isArray(rule.flowChannelList) && rule.flowChannelList.map(str).includes('1')
  const flow = str(rule.flowChannel)
  return flow === '1' || (flow === '3' && !['10001', '10008', '30011'].includes(channel) && str(rule.standardDecision) !== '2') || (flow === '5' && channel !== '30011')
}

function failedReason(payload: RecordData): string {
  success(payload, '资格查询失败')
  let value = payload.data
  for (let i = 0; i < 4; i++) {
    if (typeof value === 'string') {
      try { value = JSON.parse(value) } catch { throw new BenefitOrderError('资格响应格式异常', 'UPSTREAM_FORMAT') }
    }
    const row = object(value)
    if (str(row.status) === '0' || row.message === 'success' || (['-9999', '-200', '340804', '350812'].includes(str(row.status)) && object(row.result).orderId !== 'N')) return ''
    if (str(row.status) && str(row.message)) return str(row.message)
    if (row.data) { value = row.data; continue }
    throw new BenefitOrderError('资格响应未返回明确状态', 'UPSTREAM_FORMAT')
  }
  throw new BenefitOrderError('资格响应格式异常', 'UPSTREAM_FORMAT')
}

export function createCallbackService(factory = createRetailCallbackClient, now = Date.now) {
  const sessions = new Map<string, Session>()
  const submitting = new Set<string>()
  const completed = new Map<string, { result: CallbackResult; expiresAt: number }>()
  function prune() {
    for (const [id, item] of sessions) if (item.expiresAt <= now() && !item.busy) sessions.delete(id)
    for (const [id, item] of completed) if (item.expiresAt <= now()) completed.delete(id)
  }
  function get(id: string, ownerKey: string, accountId: string) {
    prune()
    const session = sessions.get(id)
    if (!session) throw new BenefitOrderError('预约会话已过期，请重新查询业务', 'CALLBACK_EXPIRED', 410)
    if (session.ownerKey !== ownerKey || session.accountId !== accountId) throw new BenefitOrderError('无权访问该预约会话', 'CALLBACK_FORBIDDEN', 403)
    if (session.busy) throw new BenefitOrderError('正在处理，请勿重复提交', 'CALLBACK_BUSY', 409)
    return session
  }
  return {
    async start(args: { accountId: string; ownerKey: string; cookie: string; productCode: string; expectedPhone?: string }) {
      prune()
      if (!/^\d{1,20}$/.test(args.productCode)) throw new BenefitOrderError('请输入有效的商品编码', 'INVALID_PRODUCT', 400)
      const client = await factory(args)
      if (args.expectedPhone && /^1\d{10}$/.test(args.expectedPhone) && client.phone !== args.expectedPhone) throw new BenefitOrderError('登录凭证与所选手机号不一致，请重新登录', 'PHONE_MISMATCH', 409)
      if (!client.channelCode) throw new BenefitOrderError('登录响应缺少用户渠道，请重新登录', 'CHANNEL_MISSING', 409)
      const response = await client.request('nrmix/product/prodWithNormList', { productCode: args.productCode })
      success(response, '商品查询失败')
      const product = object(response.data)
      const norms = Array.isArray(product.norms) ? product.norms.map(object).filter(row => /^\d+$/.test(str(row.normId))) : []
      if (!product.productName || !norms.length) throw new BenefitOrderError('商品不存在或没有可预约档位', 'PRODUCT_EMPTY', 404)
      const id = crypto.randomUUID(), expiresAt = now() + 10 * 60_000
      sessions.set(id, { id, ownerKey: args.ownerKey, accountId: args.accountId, productCode: args.productCode, client, product, norms, expiresAt })
      return { sessionId: id, maskedPhone: client.maskedPhone, productName: str(product.productName), productCode: args.productCode, expiresAt: new Date(expiresAt).toISOString(), norms: norms.map(row => ({ id: str(row.normId), name: str(row.name), price: str(row.discountPrice || row.price) })) }
    },
    async prepare(id: string, ownerKey: string, accountId: string, normId: string) {
      const s = get(id, ownerKey, accountId)
      if (s.result) throw new BenefitOrderError('该会话已提交预约，请查看提交结果', 'CALLBACK_FINISHED', 409)
      const candidate = s.norms.find(row => str(row.normId) === normId)
      if (!candidate) throw new BenefitOrderError('档位不属于当前商品', 'INVALID_NORM', 400)
      s.payload = undefined; s.preparationId = undefined; s.busy = true
      try {
        const detailResponse = await s.client.request('nrmix/product/norm', { normId: Number(normId) })
        success(detailResponse, '档位查询失败')
        const norm = object(detailResponse.data)
        if (str(norm.id || norm.normId) !== normId || !norm.productCode) throw new BenefitOrderError('档位信息不匹配', 'INVALID_NORM', 409)
        const price = norm.discountPrice || norm.price
        const common = { sessionId: crypto.randomUUID(), serviceFlag: str(norm.productTags).includes('1') ? '1' : '2', price, scene: '虚拟商详页', ...(['79', '129', '2100085'].includes(str(s.product.merchantId)) ? { serviceCode: '001' } : {}) }
        const rulesResponse = await s.client.request('nropportunity/atom/ruleNew', { productCode: s.productCode, productType: 1, ...common, doubleEntranceFlag: '1' })
        success(rulesResponse, '预约规则查询失败')
        const rules = Array.isArray(rulesResponse.data) ? rulesResponse.data.map(object).filter(rule => !Array.isArray(rule.normIds) || !rule.normIds.length || rule.normIds.map(str).includes(normId)) : []
        let rule = rules.find(row => str(row.ruleType) === '11' && str(row.secondRuleType) === '1101' && callbackFlowAllowed(row, s.client.channelCode))
        let type = 11, secondType = 1101
        if (!rule) {
          if (str(norm.preCheck) === '0') throw new BenefitOrderError('该业务当前未提供预约回访入口，可在官方商城咨询客服', 'CALLBACK_UNAVAILABLE', 409)
          const precheck = await s.client.request('nrmix/preCheck/productPreCheck', {
            packageId: norm.productCode, isMain: str(norm.commonCategoryCode || norm.commonCode).split('_')[1] === 'package' ? 1 : 0,
            shopProvinceCode: s.client.provinceCode, busiEffectType: str(norm.busiEffectType || 'Type_Default').split(',')[0],
            specialOfferType: Number(norm.specialOfferType) || 0, preCheckType: str(norm.preCheckTypes || norm.preCheckType) || '5',
            productCode: Number(s.productCode), normId: Number(normId), bizIntfCode: str(norm.bizIntfCode),
            touchCode: '', shopPageId: str(norm.pageId), productPersonalPageId: str(norm.personalPageUrl), sessionId: common.sessionId,
          })
          const reason = failedReason(precheck)
          if (!reason) throw new BenefitOrderError('该业务当前未提供预约回访入口，可在官方商城咨询客服', 'CALLBACK_UNAVAILABLE', 409)
          const checked = await s.client.request('nropportunity/atom/failedOrder/check', { normId: Number(normId), failedReason: reason, secondRuleType: 202, ...common })
          success(checked, '回访资格查询失败')
          rule = object(checked.data)
          if (str(rule.flag) !== '1' || !callbackFlowAllowed(rule, s.client.channelCode)) throw new BenefitOrderError('当前号码或业务不支持预约回访，请使用官方客服入口', 'CALLBACK_UNAVAILABLE', 409)
          // This optional price-retention branch needs personal package evaluation, not a guessed price.
          const conditions = Array.isArray(rule.ruleContentVos) ? rule.ruleContentVos.map(object) : []
          if (conditions.some(row => row.key === 'DOWN_SHIFT_AVERT' && str(row.value) === '1')) throw new BenefitOrderError('该业务需在官方页面核验套餐降档挽留条件', 'CALLBACK_RETENTION_REQUIRED', 409)
          type = 2; secondType = 202
        }
        if (!rule.ruleId) throw new BenefitOrderError('未返回有效预约规则', 'RULE_MISSING', 409)
        s.payload = {
          normNumber: norm.productCode, productCode: s.productCode, productName: s.product.productName,
          channelCode: s.client.channelCode, provinceCode: s.client.provinceCode, cityCode: s.client.cityCode,
          normId: Number(normId), normRemark: norm.name,
          productUrl: `https://wx.10086.cn/website/businessPlatform/shopDetail?productCode=${s.productCode}&productId=${encodeURIComponent(str(s.product.productId))}`,
          firstCategoryId: s.product.cagegoryId, secondCategoryId: s.product.secondCategoryId,
          sellProvinceCodes: s.product.provinceCode, sellCityCodes: s.product.cityCodes || '',
          productType: '1', type, secondType, ruleId: rule.ruleId, price,
          fChannelCode: 'ADSPZB-APP-XNYW-EBC', orderType: 2,
          ...(str(rule.standardDecision) === '2' ? { businessId: rule.businessId, businessType: rule.businessType, subBusinessType: rule.subBusinessType, requestId: rule.requestId || '' } : {}),
        }
        s.preparationId = crypto.randomUUID()
        return { preparationId: s.preparationId, maskedPhone: s.client.maskedPhone, productName: str(s.product.productName), normName: str(norm.name), expiresAt: new Date(s.expiresAt).toISOString() }
      } finally { s.busy = false }
    },
    async confirm(id: string, ownerKey: string, accountId: string, preparationId: string): Promise<CallbackResult> {
      const s = get(id, ownerKey, accountId)
      if (!s.payload || !preparationId || s.preparationId !== preparationId) throw new BenefitOrderError('请先查询并确认预约业务', 'PREPARE_REQUIRED', 409)
      if (s.result) return s.result
      const key = `${s.client.phone}:${s.productCode}`
      const previous = completed.get(key)
      if (previous) { s.result = previous.result; return previous.result }
      if (submitting.has(key)) throw new BenefitOrderError('该号码正在提交预约，请稍候', 'CALLBACK_BUSY', 409)
      s.busy = true; submitting.add(key)
      try {
        let result: CallbackResult
        try { result = parseCallbackResult(await s.client.request('nrmix/opportunity/create', s.payload)) }
        catch { result = { status: 'unknown', message: '未能确认预约结果，可能已提交成功。请先查看官方预约记录，勿连续重复提交。' } }
        if (result.status !== 'failed') {
          s.result = result
          completed.set(key, { result, expiresAt: now() + (result.status === 'unknown' ? 10 : 30) * 60_000 })
        }
        return result
      } finally { s.busy = false; submitting.delete(key) }
    },
  }
}
export const callbackService = createCallbackService()

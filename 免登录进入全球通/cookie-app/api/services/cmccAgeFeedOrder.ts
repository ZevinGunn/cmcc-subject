import { AGE_FEED_DEFAULTS, AGE_FEED_TIERS, findAgeFeedTier } from '../../shared/ageFeed.js'
import type { BusinessOrderProduct } from './cmccBusinessOrder.js'

type JsonRecord = Record<string, unknown>
type Request = (path: string, body: JsonRecord, encryption?: 'meteor') => Promise<JsonRecord>

function record(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : {}
}

function text(value: unknown): string {
  return value == null ? '' : String(value).trim()
}

export function ageFeedEligibility(age: string, level: string, tag: string) {
  const match = age.match(/^\s*(\d+)\s*年/)
  const years = match ? Number(match[1]) : /^\s*\d+\s*(个)?月/.test(age) ? 0 : undefined
  const tier = AGE_FEED_TIERS.find((item) => item.tag === tag)
  const levels: Record<string, string> = { '00': '普卡', '01': '银卡', '02': '金卡', '03': '白金卡', '04': '钻石卡', '08': '卓越钻石卡', '06': '非全球通', '07': '非全球通' }
  let reason = ''
  if (years === undefined) reason = '未取得可识别的网龄，无法确认办理资格'
  else if (years < 20) reason = '网龄未满 20 年，不符合本活动条件'
  else if (!levels[level]) reason = '未取得有效的全球通等级，无法确认办理资格'
  else if (!tier) reason = '官方未返回可办理的网龄直升档位'
  else if (['00', '06', '07'].includes(level)) reason = '当前全球通等级不符合本活动条件'
  else if (Number(level) > tier.level) reason = '当前全球通等级高于本次可直升档位'
  return { eligible: !reason, reason, tier, detail: `网龄：${age || '未知'} · 当前等级：${levels[level] || '未知'}${tier ? ` · 可直升：${tier.name}` : ''}` }
}

export async function prepareAgeFeedProduct(args: {
  request: Request
  phone: string
  userId?: string
  provinceCode?: string
  selectedProductCode?: string
}): Promise<BusinessOrderProduct> {
  const selectedTier = args.selectedProductCode ? findAgeFeedTier(args.selectedProductCode) : undefined
  if (args.selectedProductCode && !selectedTier) throw new Error('不支持的网龄直升档位')
  const query: Request = async (path, body, encryption) => {
    const response = await args.request(path, body, encryption)
    if (text(response.code) !== '0') throw new Error(text(response.message) || `网龄直升查询失败：${path}`)
    return response
  }
  const relation = record((await query('pkg/contract/common/newProductRelation', {
    productCodes: AGE_FEED_TIERS.map((item) => item.goodsId),
    type: 20, touchCode: '', pageId: '', userId: args.userId, mobile: '',
  })).data)
  if (![true, false, 'true', 'false', 0, 1, '0', '1'].includes(relation.isOrder as boolean | string | number)) {
    throw new Error('业务关系查询响应不完整，请稍后重试')
  }
  const ordered = relation.isOrder === true || relation.isOrder === 'true' || relation.isOrder === 1 || relation.isOrder === '1'
  const emptyProtocol = { name: '', content: '', sequenceId: '' }
  if (ordered && !selectedTier) {
    const first = record(Array.isArray(relation.respDTOList) ? relation.respDTOList[0] : undefined)
    const tier = AGE_FEED_TIERS.find((item) => item.goodsId === text(first.goodsId))
    // 官方 productRelation 的 isOrder 分支仍进入 goOrder 并获取协议，不能直接解释成禁止再次受理。
    if (!tier) throw new Error('业务关系中未取得可识别的网龄直升档位，请手动选择档位')
    return prepareProtocol({
      productCode: tier.productCode, productName: `全球通网龄直升 · ${tier.name}`,
      configured: true, available: true, relationOrdered: true, orderAllowed: true,
      eligibilitySummary: '已有业务关系', eligibilityDetail: `官方业务关系匹配：${tier.name}；实际能否受理以订购接口为准`,
      rulesHtml: '', protocol: emptyProtocol, warnings: ['已查询到业务关系，请核对协议及已订业务，避免重复办理'],
    })
  }
  const user = record((await query('activities/common/queryUserInfoNew', {})).data)
  const age = text(user.userChinaMobileage)
  // 与官方首页一致：不足 20 年时不再请求等级及定向标签。
  const years = age.match(/^\s*(\d+)\s*年/)
  let level = ''
  let tag = ''
  if (selectedTier || (years && Number(years[1]) >= 20)) {
    const gsm = record(record(record((await query('editor/common/proxy/toC/gsmLabelQuery', {})).data).entity).gbrandlevelInfo)
    level = text(gsm.gbrandLevel).padStart(2, '0')
    const labels = record((await query('pkg/common/queryMobileTagNew', {
      touchCode: AGE_FEED_DEFAULTS.touchCode,
      tagIds: '02519304000160', channelCode: '025193040002', eventCode: 'eventJE000000160',
    })).data)
    if (!['0000', '0001'].includes(text(labels.resultCode))) throw new Error('定向资格查询未返回有效结果，请稍后重试')
    if (text(labels.resultCode) === '0000') {
      tag = text(record(Array.isArray(labels.productInfos) ? labels.productInfos[0] : undefined).products)
    }
  }
  const eligibility = ageFeedEligibility(age, level, tag)
  const tier = selectedTier || eligibility.tier
  const productCode = tier?.productCode || AGE_FEED_DEFAULTS.productCode
  const product: BusinessOrderProduct = {
    productCode,
    productName: `全球通网龄直升${tier ? ` · ${tier.name}` : ''}`,
    pageTitle: '全球通20年网龄感恩回馈活动',
    configured: Boolean(tier), available: selectedTier ? true : eligibility.eligible,
    eligible: eligibility.eligible && (!selectedTier || selectedTier.productCode === eligibility.tier?.productCode),
    relationOrdered: ordered, orderAllowed: Boolean(selectedTier) || eligibility.eligible,
    eligibilitySummary: selectedTier ? '手动选择 · 待运营商受理' : eligibility.eligible ? '资格通过' : '暂不可办理',
    eligibilityDetail: `${eligibility.detail}${eligibility.reason ? `；${eligibility.reason}` : ''}`,
    rulesHtml: '', protocol: emptyProtocol, warnings: [],
  }
  if (selectedTier) {
    product.eligibilityDetail += `；手动选择：${selectedTier.name}`
    product.warnings.push('手动选择仅代表尝试办理，不代表资格通过或订购成功；最终以运营商返回为准')
    if (ordered) product.warnings.push('已查询到业务关系，请核对协议及已订业务，避免重复办理')
  }
  if (!product.orderAllowed) return product
  return prepareProtocol(product)

  async function prepareProtocol(product: BusinessOrderProduct): Promise<BusinessOrderProduct> {
    await query('personalization/page/getDefault', {
      pageId: AGE_FEED_DEFAULTS.pageId, touchCode: AGE_FEED_DEFAULTS.touchCode, handSingle: 0,
    })
    const rules = record((await query('grocer/copyWriting/page/query', {
      pageId: AGE_FEED_DEFAULTS.pageId, productCode: '100000096245', provinceCode: '100', configType: '2',
    }, 'meteor')).data)
    product.rulesHtml = (Array.isArray(rules.configList) ? rules.configList : [])
      .map((item) => text(record(item).subContent)).filter(Boolean).join('\n')
    const protocolResponse = await query('grocer/protocol/prov/queryProtocol', {
      mobile: args.phone, pageId: AGE_FEED_DEFAULTS.pageId, productCode: product.productCode,
      provinceCode: args.provinceCode, userId: args.userId, verifyType: '0',
    }, 'meteor')
    const protocol = record(Array.isArray(protocolResponse.data) ? protocolResponse.data[0] : undefined)
    if (!text(protocol.protocolSequenceId) || !text(protocol.content)) throw new Error('未取得完整的网龄直升受理协议，请稍后重试')
    product.protocol = {
      name: text(protocol.protocolName) || '网龄直升业务受理协议',
      content: text(protocol.content), sequenceId: text(protocol.protocolSequenceId),
    }
    return product
  }
}

import { httpsRequestText } from './cmccHttp.js'
import { mergeCookieWithSetCookie, parseCookieHeader } from './cookieUtils.js'
import type { AigouSessionRecord } from './accountsStore.js'
import { AigouOrderError, type AigouRiskContext, type AigouRiskPreparation } from './aigouBusinessOrder.js'

const AIGOU_ORIGIN = 'https://dev.coc.10086.cn'
const CART_CHANNEL_CODE = 'P00000011939'
const CART_PAGE_ID = 'P00000011939'
const DEFAULT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'
const RISK_DEVICE_TOKEN_URL = 'https://yxfk.market.chinamobile.com:8081/mgt/decision-engine/udid/c1?'

type JsonRecord = Record<string, unknown>

export type AigouCartCatalogItem = {
  id: string
  name: string
  specId?: string
  directSkuId?: string
  price?: number
  busiType: 'C3' | 'N0' | 'N1' | 'N3'
  selfChannelCode: string
  referer: string
  source: 'cart-snapshot' | 'rights-catalog'
  cartable: boolean
  unavailableReason?: string
}

export type AigouCartItem = {
  shoppingCartId: string
  preSubmitInstId: string
  specId: string
  offerName: string
  number: number
  busiType: string
  checkResult: string
  checkResultDesc?: string
  discountPrice?: number
  rowPrice?: number
  payMode: string[]
  skuNum?: string
  skuType?: string
  spuCode?: string
  offerThumbnail?: string
  addedCount?: number
}

export type AigouCartSelection = Pick<AigouCartItem,
  'shoppingCartId' | 'preSubmitInstId' | 'specId' | 'offerName' | 'number' | 'busiType' | 'spuCode'
>

export type AigouCartCallback<T = unknown> = {
  success: boolean
  resultCode: string
  message: string
  data?: T
  response: unknown
}

export type AigouCartListResult = AigouCartCallback<{
  shoppingCartId: string
  items: AigouCartItem[]
}>

export type AigouCartBatchResult = {
  success: boolean
  message: string
  total: number
  succeeded: number
  failed: number
  results: Array<AigouCartCallback & { item: AigouCartCatalogItem }>
}

export type AigouCartCalculateResult = AigouCartCallback<{
  totalPrice?: number
  discountsPrice?: number
  discountsHow?: number
  skuList: JsonRecord[]
}>

export type AigouCartSmsResult = AigouCartCallback<{
  busiOpId?: string
  cooldownSeconds: number
  calculation: AigouCartCalculateResult
}>

export type AigouCartOrderResult = AigouCartCallback & {
  attempted: boolean
  calculation: AigouCartCalculateResult
  riskPreparation: AigouRiskPreparation
}

const CART_SNAPSHOT_ITEMS: Array<[string, string, number, string, string]> = [
  ['和包50元无门槛电费券(爱购)', '2026071416173559901625472', 5100, 'P00000008211', 'mylist&detailA'],
  ['云闪付15元生活缴费权益包（水+电+燃气）', '2023110701324145501972521', 1500, 'P00000058871', 'detailA'],
  ['生活缴费权益包30元', '2026032315492599901435149', 3000, 'P00000058871', 'detailA'],
  ['云闪付62VIP尊享月卡', '2026062417301604401573326', 2600, 'P00000058871', 'detailA'],
  ['1元体验会员', '2023110701382848501976562', 100, 'P00000058871', 'detailA'],
  ['2元体验会员', '2023110701382857001976565', 200, 'P00000058871', 'detailA'],
  ['5元体验会员', '2023110701382965001976586', 500, 'P00000058871', 'detailA'],
  ['10元体验会员', '2023110701383039901976604', 1000, 'P00000058871', 'detailA'],
  ['15元体验会员', '2023121215212791601896451', 1500, 'P00000058871', 'detailA'],
  ['20元体验会员', '2023110701383113201976622', 2000, 'P00000058871', 'detailA'],
  ['支付宝电费20元券包', '2025101414201093701194447', 2100, 'P00000058871', 'detailA'],
  ['星巴克30元礼包', '2024100915574186201355124', 3000, 'P00000058871', 'detailA'],
  ['星巴克升杯会员礼包', '2025123011453691801333913', 300, 'P00000058871', 'detailA'],
  ['星巴克24元礼包', '2024100915574204101355127', 2400, 'P00000058871', 'detailA'],
  ['星巴克5元会员礼包', '2025121610361245901299102', 500, 'P00000058871', 'detailA'],
  ['星巴克8元礼包', '2024100915574111301355112', 800, 'P00000058871', 'detailA'],
  ['星巴克10元礼包', '2024100915574131801355115', 1000, 'P00000058871', 'detailA'],
  ['星巴克15元礼包', '2024100915574149201355118', 1500, 'P00000058871', 'detailA'],
  ['星巴克20元礼包', '2024100915574167401355121', 2000, 'P00000058871', 'detailA'],
  ['50元体验会员', '2023110701383232301976643', 5000, 'P00000058871', 'detailA'],
]

const RIGHTS_CATALOG_ITEMS: Array<[string, string, number]> = [
  ['星巴克30元会员礼包（全球通）', '46121', 3000],
  ['和包出行50元体验会员（全球通）', '29049', 5000],
  ['洪恩识字+子集绘本月卡（全球通）', '29041', 2190],
  ['喜马拉雅儿童VIP会员月卡（全球通）', '35360', 2100],
  ['作业帮VIP会员月卡（全球通）', '18331', 1400],
  ['迅雷白金会员月卡（全球通）', '28698', 1200],
  ['百度网盘超级会员月卡（全球通）', '29045', 2800],
  ['喜马拉雅会员月卡（全球通）', '29024', 1750],
  ['QQ音乐绿钻豪华版会员月卡（全球通）', '29030', 1450],
  ['酷狗音乐豪华VIP会员月卡（全球通）', '29031', 1350],
  ['网易云音乐黑胶VIP月会员（全球通）', '29032', 1450],
  ['爱奇艺黄金VIP会员月卡（全球通）', '29033', 2100],
  ['知乎盐选会员月卡（全球通）', '7692', 1750],
  ['腾讯视频VIP月卡（全球通）', '4869', 2100],
  ['keep会员月卡（全球通）', '29021', 2000],
  ['优酷视频VIP会员月卡（全球通）', '46118', 2100],
  ['JJ斗地主200元宝（全球通）', '29028', 2000],
  ['QQ阅读会员月卡（全球通）', '29025', 1750],
  ['美团外卖10元通用红包（全球通）', '29042', 900],
  ['天猫满30.01减30元满减券（全球通）', '46119', 3000],
  ['滴滴出行快车10元满减券（全球通）', '46124', 1000],
  ['王者荣耀皮肤豪华礼包（全球通）', '46125', 2650],
  ['快看漫画VIP月卡（全球通）', '46126', 1400],
  ['薄荷健康超级会员月卡（全球通）', '46127', 1450],
]

export const AIGOU_CART_CATALOG: AigouCartCatalogItem[] = [
  ...CART_SNAPSHOT_ITEMS.map(([name, specId, price, selfChannelCode, referer]) => ({
    id: `cart-${specId}`,
    name,
    specId,
    price,
    busiType: 'C3' as const,
    selfChannelCode,
    referer,
    source: 'cart-snapshot' as const,
    cartable: true,
  })),
  ...RIGHTS_CATALOG_ITEMS.map(([name, directSkuId, price]) => ({
    id: `rights-${directSkuId}`,
    name,
    directSkuId,
    price,
    busiType: 'C3' as const,
    selfChannelCode: '',
    referer: '',
    source: 'rights-catalog' as const,
    cartable: false,
    unavailableReason: '源数据只有直订 skuid，缺少加车接口必需的 specId 与渠道属性',
  })),
]

function asRecord(value: unknown): JsonRecord | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : undefined
}

function text(value: unknown): string {
  return value === null || value === undefined ? '' : String(value).trim()
}

function numberValue(value: unknown): number | undefined {
  const result = Number(value)
  return Number.isFinite(result) ? result : undefined
}

function resultCode(payload: JsonRecord): string {
  return text(payload.resultCode ?? payload.code)
}

function resultMessage(payload: JsonRecord, fallback: string): string {
  return text(payload.msg ?? payload.message ?? payload.resultMsg) || fallback
}

function parseJson(value: string): JsonRecord {
  try {
    const parsed = JSON.parse(value) as unknown
    const record = asRecord(parsed)
    if (record) return record
  } catch {
    // Normalized below.
  }
  throw new AigouOrderError('爱购商城返回了无法解析的响应', 'INVALID_UPSTREAM_RESPONSE', 502)
}

export function sanitizeAigouCartResponse(value: unknown, depth = 0): unknown {
  if (depth > 7) return undefined
  if (value === null || value === undefined) return value
  if (typeof value === 'string') return value.replace(/1\d{10}/g, (phone) => `${phone.slice(0, 3)}****${phone.slice(-4)}`)
  if (typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map((item) => sanitizeAigouCartResponse(item, depth + 1))
  const output: JsonRecord = {}
  for (const [key, item] of Object.entries(value as JsonRecord)) {
    if (/(cookie|token|ticket|phone|mobile|receiver|sms|pwd|password|dfp|fingerprint|wasm|risk|encrypted)/i.test(key)) continue
    output[key] = sanitizeAigouCartResponse(item, depth + 1)
  }
  return output
}

function identifier(value: unknown, field: string): string {
  const result = text(value)
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(result)) {
    throw new AigouOrderError(`${field} 格式不正确`, 'INVALID_PARAMETER', 400)
  }
  return result
}

function quantity(value: unknown): number {
  const result = Number(value)
  if (!Number.isInteger(result) || result < 1 || result > 10) {
    throw new AigouOrderError('商品数量必须是 1-10 的整数', 'INVALID_QUANTITY', 400)
  }
  return result
}

export function normalizeCartSelection(value: Partial<AigouCartSelection>): AigouCartSelection {
  return {
    shoppingCartId: identifier(value.shoppingCartId, 'shoppingCartId'),
    preSubmitInstId: identifier(value.preSubmitInstId, 'preSubmitInstId'),
    specId: identifier(value.specId, 'specId'),
    offerName: text(value.offerName) || `商品 ${text(value.specId)}`,
    number: quantity(value.number),
    busiType: text(value.busiType) || 'C3',
    spuCode: text(value.spuCode) || undefined,
  }
}

function normalizeSelections(values: Array<Partial<AigouCartSelection>>): AigouCartSelection[] {
  if (!Array.isArray(values) || values.length === 0) {
    throw new AigouOrderError('请选择购物车商品', 'CART_SELECTION_REQUIRED', 400)
  }
  const items = values.map(normalizeCartSelection)
  const total = items.reduce((sum, item) => sum + item.number, 0)
  if (total > 10) throw new AigouOrderError('结算商品总件数不能超过 10 件', 'CART_LIMIT_EXCEEDED', 400)
  if (new Set(items.map((item) => item.shoppingCartId)).size !== 1) {
    throw new AigouOrderError('所选商品必须来自同一个购物车', 'CART_ID_MISMATCH', 400)
  }
  return items
}

export function buildCartAddPayload(item: AigouCartCatalogItem, userMobile: string, requestedQuantity = 1): JsonRecord {
  if (!item.cartable || !item.specId) {
    throw new AigouOrderError(item.unavailableReason || '该商品缺少加车参数', 'CART_MAPPING_REQUIRED', 409)
  }
  return {
    userMobile,
    pageId: CART_PAGE_ID,
    orderBusiInfo: [{
      busiType: item.busiType,
      offerList: [{
        specId: item.specId,
        offerName: item.name,
        number: quantity(requestedQuantity),
        offerAttrList: [
          { attrKey: 'selfChannelCode', attrValue: item.selfChannelCode },
          { attrKey: 'rulecode' },
          { attrKey: 'referer', attrValue: item.referer },
        ],
      }],
    }],
  }
}

export function buildCartEditPayload(item: AigouCartSelection, userMobile: string, requestedQuantity: number): JsonRecord {
  const normalized = normalizeCartSelection(item)
  return {
    userMobile,
    shoppingCartId: normalized.shoppingCartId,
    offerList: [{
      preSubmitInstId: normalized.preSubmitInstId,
      specId: normalized.specId,
      number: quantity(requestedQuantity),
    }],
  }
}

export function buildCartCalculatePayload(values: Array<Partial<AigouCartSelection>>): JsonRecord {
  const items = normalizeSelections(values)
  const skuList: JsonRecord[] = []
  for (const item of items) {
    if (item.busiType === 'C3') {
      for (let index = 0; index < item.number; index += 1) skuList.push({ mcdsId: item.specId, skuCount: 1 })
    } else {
      skuList.push({ mcdsId: item.specId, skuCount: item.number })
    }
  }
  return { skuList, operationType: 0, source: 1 }
}

function productType(busiType: string): number | '' {
  if (busiType === 'C3') return 1
  if (busiType === 'N1') return 2
  if (busiType === 'N0') return 3
  if (busiType === 'N3') return 4
  return ''
}

function calculatedSkuList(calculation: AigouCartCalculateResult): JsonRecord[] {
  return calculation.data?.skuList || []
}

export function buildCartSmsPayload(
  values: Array<Partial<AigouCartSelection>>,
  calculation: AigouCartCalculateResult,
  channelCode = CART_CHANNEL_CODE,
): JsonRecord {
  const items = normalizeSelections(values)
  const skuList = calculatedSkuList(calculation)
  const shoppingCartSkuList = skuList.map((sku) => {
    const specId = identifier(sku.mcdsId, 'mcdsId')
    const item = items.find((candidate) => candidate.specId === specId)
    return {
      mcdsId: specId,
      count: quantity(sku.skuCount ?? item?.number ?? 1),
      ...(item?.spuCode ? { spuCode: item.spuCode } : {}),
    }
  })
  return { shoppingCartSkuList, digitalBean: 0, calculateFlag: '1', businessChannelCode: identifier(channelCode, 'businessChannelCode') }
}

export function buildCartOrderPayload(options: {
  items: Array<Partial<AigouCartSelection>>
  calculation: AigouCartCalculateResult
  payType: number
  smsCode: string
  busiOpId: string
  operDfp?: string
}): JsonRecord {
  const items = normalizeSelections(options.items)
  if (![1, 2, 3].includes(options.payType)) throw new AigouOrderError('支付方式不正确', 'INVALID_PAY_TYPE', 400)
  if (!/^(?:\d{4}|\d{6})$/.test(options.smsCode)) throw new AigouOrderError('请输入 4 位或 6 位数字验证码', 'INVALID_SMS_CODE', 400)
  const busiOpId = identifier(options.busiOpId, 'busiOpId')
  const shoppingCartSkuList = calculatedSkuList(options.calculation).map((sku) => {
    const specId = identifier(sku.mcdsId, 'mcdsId')
    const item = items.find((candidate) => candidate.specId === specId)
    if (!item) throw new AigouOrderError('实时试算结果与购物车商品不一致', 'CALCULATION_MISMATCH', 409)
    return {
      commodityId: specId,
      commodityCount: quantity(sku.skuCount ?? item.number),
      realPrice: numberValue(sku.discountPrice) ?? 0,
      preSubmitInstId: item.preSubmitInstId,
      productType: productType(item.busiType),
      spuCode: item.busiType === 'N0' ? item.spuCode || '' : '',
      commodityOfferInformationList: [],
    }
  })
  return {
    basePayType: options.payType,
    needChoosePayType: (options.calculation.data?.discountsPrice ?? 0) === 0,
    selfChannelCode: CART_CHANNEL_CODE,
    basePayAmount: options.calculation.data?.discountsPrice ?? 0,
    shoppingCartId: items[0].shoppingCartId,
    receivingInfoId: '',
    receivingInfoVersion: '',
    handleDirectly: false,
    shoppingOfferInformationList: [],
    shoppingCartSkuList,
    calculateFlag: '1',
    smsCode: options.smsCode,
    busiOpId,
    referer: 'mshyshoppingcart&mshysettlement',
    operDfp: options.operDfp || null,
  }
}

function callback<T>(payload: JsonRecord, fallback: string, data?: T): AigouCartCallback<T> {
  const code = resultCode(payload)
  return {
    success: code === '0',
    resultCode: code,
    message: resultMessage(payload, fallback),
    data,
    response: sanitizeAigouCartResponse(payload),
  }
}

function normalizeCartList(payload: JsonRecord): AigouCartListResult {
  const rootData = asRecord(payload.data)
  const shoppingCartId = text(rootData?.shoppingCartId)
  const groups = Array.isArray(rootData?.aggregationShoppingCartItemList) ? rootData.aggregationShoppingCartItemList : []
  const items: AigouCartItem[] = []
  for (const groupValue of groups) {
    const group = asRecord(groupValue)
    const offers = Array.isArray(group?.offerInfoList) ? group.offerInfoList : []
    for (const offerValue of offers) {
      const offer = asRecord(offerValue) || {}
      const specId = text(offer.specId)
      const preSubmitInstId = text(offer.preSubmitInstId)
      if (!specId || !preSubmitInstId) continue
      items.push({
        shoppingCartId,
        preSubmitInstId,
        specId,
        offerName: text(offer.offerName) || `商品 ${specId}`,
        number: Math.max(1, numberValue(offer.number) || 1),
        busiType: text(offer.busiType) || 'C3',
        checkResult: text(offer.checkResult),
        checkResultDesc: text(offer.checkResultDesc) || undefined,
        discountPrice: numberValue(offer.discountPrice),
        rowPrice: numberValue(offer.rowPrice),
        payMode: text(offer.payMode).split(',').map((item) => item.trim()).filter(Boolean),
        skuNum: text(offer.skuNum) || undefined,
        skuType: text(offer.skuType) || undefined,
        spuCode: text(offer.spuCode) || undefined,
        offerThumbnail: text(offer.offerThumbnail) || undefined,
        addedCount: numberValue(offer.addedCount),
      })
    }
  }
  return callback(payload, '购物车查询失败', { shoppingCartId, items })
}

function normalizeCalculation(payload: JsonRecord): AigouCartCalculateResult {
  const data = asRecord(payload.data)
  return callback(payload, '购物车试算失败', {
    totalPrice: numberValue(data?.totalPrice),
    discountsPrice: numberValue(data?.discountsPrice),
    discountsHow: numberValue(data?.discountsHow),
    skuList: Array.isArray(data?.skuList) ? data.skuList.map((item) => asRecord(item) || {}) : [],
  })
}

export class AigouShoppingCartClient {
  private sessionValue: AigouSessionRecord

  constructor(session: AigouSessionRecord) {
    this.sessionValue = { ...session }
  }

  get session(): AigouSessionRecord { return { ...this.sessionValue } }

  private referer(page: 'detail' | 'cart' | 'settlement'): string {
    const name = page === 'detail' ? 'detail' : page === 'cart' ? 'mshyshoppingcart' : 'mshysettlement'
    const url = new URL(`/coc3/canvas/rightsmarket-h5-canvas/online/${name}`, AIGOU_ORIGIN)
    url.searchParams.set('channelCode', CART_CHANNEL_CODE)
    return url.toString()
  }

  private async request(path: string, body: unknown, page: 'detail' | 'cart' | 'settlement', headers: Record<string, string> = {}): Promise<JsonRecord> {
    const response = await httpsRequestText({
      url: new URL(path, AIGOU_ORIGIN).toString(),
      method: 'POST',
      headers: {
        Cookie: this.sessionValue.cookie,
        phone: this.sessionValue.token,
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Content-Type': 'application/json;charset=UTF-8',
        Origin: AIGOU_ORIGIN,
        Referer: this.referer(page),
        'User-Agent': DEFAULT_UA,
        ...headers,
      },
      body: JSON.stringify(body),
      timeoutMs: 20_000,
    })
    const merged = mergeCookieWithSetCookie({ cookie: this.sessionValue.cookie, setCookie: response.headers['set-cookie'] })
    if (merged.changed) this.sessionValue = { ...this.sessionValue, cookie: merged.cookie }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      let upstream: unknown = response.bodyText
      try { upstream = sanitizeAigouCartResponse(parseJson(response.bodyText)) } catch { upstream = sanitizeAigouCartResponse(response.bodyText) }
      throw new AigouOrderError(`爱购商城上游返回 HTTP ${response.statusCode}`, 'UPSTREAM_HTTP_ERROR', 502, upstream)
    }
    return parseJson(response.bodyText)
  }

  private async fetchRiskDeviceToken(): Promise<{ token: string; resultCode: string; message: string }> {
    const response = await httpsRequestText({
      url: RISK_DEVICE_TOKEN_URL,
      method: 'GET',
      headers: { Accept: 'application/json, text/plain, */*', Origin: AIGOU_ORIGIN, Referer: this.referer('settlement'), 'User-Agent': DEFAULT_UA },
      timeoutMs: 10_000,
    })
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new AigouOrderError(`设备风险令牌接口返回 HTTP ${response.statusCode}`, 'RISK_TOKEN_HTTP_ERROR', 502)
    }
    const payload = parseJson(response.bodyText)
    const token = text(payload.data)
    if (!token) throw new AigouOrderError(resultMessage(payload, '设备风险令牌接口未返回令牌'), 'RISK_TOKEN_EMPTY', 424)
    return { token, resultCode: text(payload.status ?? payload.code), message: resultMessage(payload, '设备风险令牌已生成') }
  }

  async list(): Promise<AigouCartListResult> {
    return normalizeCartList(await this.request(
      '/coc3/coc3-market/api/market/external/shoppingCart/list',
      { userMobile: this.sessionValue.token },
      'cart',
    ))
  }

  async add(item: AigouCartCatalogItem, requestedQuantity = 1): Promise<AigouCartCallback> {
    const payload = await this.request(
      '/coc3/coc3-market/api/market/external/shoppingCart/add',
      buildCartAddPayload(item, this.sessionValue.token, requestedQuantity),
      'detail',
    )
    return callback(payload, '加入购物车失败')
  }

  async addAll(itemIds?: string[]): Promise<AigouCartBatchResult> {
    const requested = itemIds?.length
      ? itemIds.map((id) => AIGOU_CART_CATALOG.find((item) => item.id === id)).filter(Boolean) as AigouCartCatalogItem[]
      : AIGOU_CART_CATALOG.filter((item) => item.cartable)
    const unique = [...new Map(requested.map((item) => [item.id, item])).values()]
    if (!unique.length) throw new AigouOrderError('没有可加入购物车的权益', 'CART_CATALOG_EMPTY', 400)
    if (unique.length > 50) throw new AigouOrderError('单次批量加车不能超过 50 项', 'CART_BATCH_LIMIT', 400)
    const results: AigouCartBatchResult['results'] = []
    for (const item of unique) {
      if (!item.cartable) {
        results.push({ item, success: false, resultCode: 'CART_MAPPING_REQUIRED', message: item.unavailableReason || '缺少加车参数', response: { errorCode: 'CART_MAPPING_REQUIRED', message: item.unavailableReason } })
        continue
      }
      try {
        results.push({ item, ...await this.add(item) })
      } catch (error) {
        const orderError = error instanceof AigouOrderError ? error : undefined
        results.push({
          item,
          success: false,
          resultCode: orderError?.code || 'CART_ADD_REQUEST_FAILED',
          message: error instanceof Error ? error.message : '加入购物车请求失败',
          response: sanitizeAigouCartResponse(orderError?.response ?? { errorCode: orderError?.code || 'CART_ADD_REQUEST_FAILED', message: error instanceof Error ? error.message : '加入购物车请求失败' }),
        })
      }
    }
    const succeeded = results.filter((item) => item.success).length
    return {
      success: succeeded === results.length,
      message: succeeded === results.length ? `已提交 ${succeeded} 项加车请求` : `加车完成：${succeeded} 项成功，${results.length - succeeded} 项失败`,
      total: results.length,
      succeeded,
      failed: results.length - succeeded,
      results,
    }
  }

  async edit(item: AigouCartSelection, requestedQuantity: number): Promise<AigouCartCallback> {
    const payload = await this.request(
      '/coc3/coc3-market/api/market/external/shoppingCart/edit',
      buildCartEditPayload(item, this.sessionValue.token, requestedQuantity),
      'cart',
    )
    return callback(payload, '购物车数量修改失败')
  }

  async calculate(values: Array<Partial<AigouCartSelection>>): Promise<AigouCartCalculateResult> {
    return normalizeCalculation(await this.request(
      '/coc3/coc3-market/api/shoppingCart/shopCartCalculate',
      buildCartCalculatePayload(values),
      'cart',
    ))
  }

  async sendSms(values: Array<Partial<AigouCartSelection>>): Promise<AigouCartSmsResult> {
    const items = normalizeSelections(values)
    const calculation = await this.calculate(items)
    if (!calculation.success) {
      return { success: false, resultCode: calculation.resultCode, message: calculation.message, response: calculation.response, data: { cooldownSeconds: 0, calculation } }
    }
    const payload = await this.request(
      '/coc3/coc3-market-order/api/external/sendDimShopSmsCode',
      buildCartSmsPayload(items, calculation),
      'settlement',
    )
    const data = asRecord(payload.data)
    return callback(payload, '购物车验证码发送失败', {
      busiOpId: text(data?.busiOpId) || undefined,
      cooldownSeconds: resultCode(payload) === '0' ? 60 : 0,
      calculation,
    })
  }

  async confirmOrder(options: {
    items: Array<Partial<AigouCartSelection>>
    payType: number
    smsCode: string
    busiOpId: string
    risk?: AigouRiskContext
  }): Promise<AigouCartOrderResult> {
    const items = normalizeSelections(options.items)
    const calculation = await this.calculate(items)
    const effectiveRisk = { ...(options.risk || {}) }
    const cookieDfp = text(parseCookieHeader(this.sessionValue.cookie).get('BSFIT_DEVICEID'))
    const riskPreparation: AigouRiskPreparation = {
      deviceToken: effectiveRisk.grRiskP3 ? 'provided' : 'unavailable',
      wasmParams: effectiveRisk.wasmParams ? 'provided' : 'unavailable',
      operDfp: effectiveRisk.operDfp ? 'provided' : cookieDfp ? 'session-cookie' : 'unavailable',
    }
    if (!calculation.success) {
      return { ...calculation, attempted: false, calculation, riskPreparation }
    }
    if (!effectiveRisk.grRiskP3) {
      try {
        const generated = await this.fetchRiskDeviceToken()
        effectiveRisk.grRiskP3 = generated.token
        riskPreparation.deviceToken = 'generated'
        riskPreparation.tokenResultCode = generated.resultCode
        riskPreparation.tokenMessage = generated.message
      } catch (error) {
        riskPreparation.tokenMessage = error instanceof Error ? error.message : '设备风险令牌获取失败'
      }
    }
    if (!effectiveRisk.operDfp && cookieDfp) effectiveRisk.operDfp = cookieDfp
    const headers: Record<string, string> = {}
    if (effectiveRisk.grRiskP1) headers['gr-risk-p1'] = effectiveRisk.grRiskP1
    if (effectiveRisk.grRiskP2) headers['gr-risk-p2'] = effectiveRisk.grRiskP2
    if (effectiveRisk.grRiskP3) headers['gr-risk-p3'] = effectiveRisk.grRiskP3
    if (effectiveRisk.wasmParams) headers.wasmParams = effectiveRisk.wasmParams
    try {
      const payload = await this.request(
        '/coc3/coc3-market-order/api/external/dim/marketShoppingOrder',
        buildCartOrderPayload({
          items,
          calculation,
          payType: options.payType,
          smsCode: options.smsCode,
          busiOpId: options.busiOpId,
          operDfp: effectiveRisk.operDfp,
        }),
        'settlement',
        headers,
      )
      return { ...callback(payload, '购物车订单提交失败'), attempted: true, calculation, riskPreparation }
    } catch (error) {
      const orderError = error instanceof AigouOrderError ? error : undefined
      return {
        success: false,
        resultCode: orderError?.code || 'CART_ORDER_REQUEST_FAILED',
        message: error instanceof Error ? error.message : '购物车订单请求失败',
        response: sanitizeAigouCartResponse(orderError?.response ?? { errorCode: orderError?.code || 'CART_ORDER_REQUEST_FAILED', message: error instanceof Error ? error.message : '购物车订单请求失败' }),
        attempted: true,
        calculation,
        riskPreparation,
      }
    }
  }
}

export const __test__ = {
  normalizeCartList,
  normalizeCalculation,
  normalizeSelections,
}

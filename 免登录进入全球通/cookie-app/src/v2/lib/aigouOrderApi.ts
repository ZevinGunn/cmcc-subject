import { requestApiData, requestApiJson } from './api'

export type AigouProductInput = {
  code: string
  skuId: string
  name?: string
  orderMode: 'rights' | 'package'
  channelCode: string
  selfChannelCode: string
  referer: string
  activityId?: string
  productCode?: string
  pageId?: string
  touchCode?: string
  protocolSequenceId?: string
  smsCodeTypeEnum?: string
}

export type AigouProduct = AigouProductInput & {
  name: string
  pageId?: string
  pageTitle?: string
  price?: number
  originPrice?: number
  agreementName?: string
  agreementContent?: string
  skuType?: unknown
  genericContext: boolean
  source: 'layout' | 'input'
}

export type AigouOrderResult = {
  success: boolean
  resultCode: string
  message: string
  data?: unknown
  response: unknown
  precheck: { success: boolean; resultCode: string; message: string; isBlackList?: boolean; response?: unknown }
  riskPreparation?: {
    deviceToken: 'provided' | 'generated' | 'unavailable'
    wasmParams: 'provided' | 'unavailable'
    operDfp: 'provided' | 'session-cookie' | 'unavailable'
    tokenResultCode?: string
    tokenMessage?: string
  }
  attempted: boolean
}

export type AigouSmsResult = {
  success: boolean
  resultCode: string
  message: string
  response: unknown
  cooldownSeconds: number
}

export type AigouRiskContext = {
  grRiskP1?: string
  grRiskP2?: string
  grRiskP3?: string
  wasmParams?: string
  operDfp?: string
}

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
}> & { sessionReused?: boolean }

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
  skuList: Array<Record<string, unknown>>
}>

export type AigouCartSmsResult = AigouCartCallback<{
  busiOpId?: string
  cooldownSeconds: number
  calculation: AigouCartCalculateResult
}>

export type AigouCartOrderResult = AigouCartCallback & {
  attempted: boolean
  calculation: AigouCartCalculateResult
  riskPreparation: NonNullable<AigouOrderResult['riskPreparation']>
}

export async function loadAigouCatalog(): Promise<AigouProductInput[]> {
  const data = await requestApiData<{ presets: AigouProductInput[] }>('/api/aigou-orders/catalog')
  return data.presets
}

export async function loadAigouCartCatalog(): Promise<{
  items: AigouCartCatalogItem[]
  cartableCount: number
  pendingMappingCount: number
}> {
  return requestApiData('/api/aigou-orders/cart/catalog')
}

export function loadAigouCart(accountId: string): Promise<AigouCartListResult> {
  return requestApiJson('/api/aigou-orders/cart/list', 'POST', { accountId })
}

export function addAigouCartItem(accountId: string, input: {
  itemId?: string
  specId?: string
  name?: string
  number?: number
  busiType?: AigouCartCatalogItem['busiType']
  selfChannelCode?: string
  referer?: string
}): Promise<AigouCartCallback & { item: AigouCartCatalogItem }> {
  return requestApiJson('/api/aigou-orders/cart/add', 'POST', { accountId, ...input })
}

export function addAllAigouCartItems(accountId: string, itemIds?: string[]): Promise<AigouCartBatchResult> {
  return requestApiJson('/api/aigou-orders/cart/add-all', 'POST', { accountId, itemIds })
}

export function editAigouCartItem(accountId: string, item: AigouCartItem, number: number): Promise<AigouCartCallback> {
  return requestApiJson('/api/aigou-orders/cart/edit', 'POST', { accountId, item, number })
}

export function calculateAigouCart(accountId: string, items: AigouCartItem[]): Promise<AigouCartCalculateResult> {
  return requestApiJson('/api/aigou-orders/cart/calculate', 'POST', { accountId, items })
}

export function sendAigouCartSms(accountId: string, items: AigouCartItem[]): Promise<AigouCartSmsResult> {
  return requestApiJson('/api/aigou-orders/cart/sms', 'POST', { accountId, items })
}

export function submitAigouCartOrder(input: {
  accountId: string
  items: AigouCartItem[]
  payType: number
  smsCode: string
  busiOpId: string
  riskContext?: AigouRiskContext
}): Promise<AigouCartOrderResult> {
  return requestApiJson('/api/aigou-orders/cart/confirm', 'POST', input)
}

export function resolveAigouProduct(accountId: string, input: AigouProductInput): Promise<{ product: AigouProduct }> {
  return requestApiJson('/api/aigou-orders/product', 'POST', { accountId, ...input })
}

export function sendAigouOrderSms(accountId: string, product: AigouProductInput): Promise<AigouSmsResult> {
  return requestApiJson('/api/aigou-orders/sms', 'POST', { accountId, ...product })
}

export function submitAigouOrder(input: {
  accountId: string
  product: AigouProductInput
  smsCode: string
  riskContext?: AigouRiskContext
}): Promise<AigouOrderResult> {
  return requestApiJson('/api/aigou-orders/confirm', 'POST', {
    accountId: input.accountId,
    ...input.product,
    smsCode: input.smsCode,
    riskContext: input.riskContext,
  })
}

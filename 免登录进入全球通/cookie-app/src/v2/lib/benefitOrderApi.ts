import { requestApiJson } from './api'

export type BenefitWorkflow = 'building_bricks' | 'premium_membership' | 'coc_app' | 'lucky_bag'
export type LuckyBagVariant = 'standard' | 'deluxe'
export type RetailBusinessId = 'custom' | 'premium_membership' | 'five_g_enjoy' | 'fly_card_8' | 'excellent_device_offer' | 'traffic_member_20' | 'good_gifts_membership' | 'good_gifts_data'
export type CocAppBusinessId = 'smart_life' | 'five_ga'

export const RETAIL_BUSINESS_PRESETS = {
  custom: {
    productId: '0', productCode: '', touchCode: '', marketingCode: '', secondChannel: '',
    effectType: 'Type_Default', fromRecommend: '', redCode: '', rcm_src: '', traceId: '',
    agentid: '', pageSource: '', pageid: '',
  },
  premium_membership: { productId: '2171755', productCode: '15890747', touchCode: 'P00000102705', marketingCode: '1319080049', secondChannel: 'P00000116110' },
  five_g_enjoy: { productId: '2126865', productCode: '6784393', touchCode: '', marketingCode: '', secondChannel: '' },
  fly_card_8: { productId: '2165665', productCode: '11489145', touchCode: '', marketingCode: '', secondChannel: '' },
  excellent_device_offer: { productId: '2154200', productCode: '12193836', touchCode: '', marketingCode: '', secondChannel: 'WXQ' },
  traffic_member_20: { productId: '2126211', productCode: '4888051', touchCode: '', marketingCode: '', secondChannel: 'WXQ' },
  good_gifts_membership: {
    productId: '', productCode: '', touchCode: '', marketingCode: '', secondChannel: '',
    effectType: 'Type_Default', fromRecommend: '3', pageSource: '100', pageid: 'bff92c1764dc4fb18b5bf03c33d9a5c5',
    personalPageId: '2025100909463488702003179', mergeCode: '2394993',
  },
  good_gifts_data: {
    productId: '', productCode: '', touchCode: '', marketingCode: '', secondChannel: '',
    effectType: 'Type_Default', fromRecommend: '3', pageSource: '100', pageid: 'bff92c1764dc4fb18b5bf03c33d9a5c5',
    personalPageId: '2025101316480230602003289', mergeCode: '4892902',
  },
} as const

export const COC_APP_BUSINESS_PRESETS = {
  smart_life: {
    pageId: '1969953714210263040',
    touchCode: 'P00000044852',
    productCode: '500000051649',
    sourceUrl: 'https://dev.coc.10086.cn/coc/web6/szhydg/?pageId=1969953714210263040',
  },
  five_ga: {
    pageId: '1879370128044171264',
    touchCode: 'P00000055499',
    productCode: '500000051295',
    sourceUrl: 'https://dev.coc.10086.cn/coc/web6/applet5gaH5/home?pageId=1879370128044171264&channelId=P00000055499',
  },
} as const
export type BenefitStage =
  | 'initialized'
  | 'login_sms_sent'
  | 'authenticated'
  | 'product_ready'
  | 'selection_ready'
  | 'order_sms_sent'
  | 'ordering'
  | 'finished'

export type BenefitModule = {
  id: string
  productCode: string
  name: string
  fee: number
  display: string
  standards: string
  category: 'flow' | 'voice' | 'sms'
}

export type PremiumNorm = {
  id: string
  packageId: string
  name: string
  price: number
  bizIntfCode: string
  productTags: string
  candidateIds: string[]
  variantCount: number
}

export type CustomPremiumNormInput = {
  id: string
  packageId?: string
  name?: string
  price?: number
  bizIntfCode?: string
}

export type BenefitOrderResult = {
  success: boolean
  accepted: boolean
  uncertain: boolean
  code: string
  message: string
  orderId?: string
  orderStatus?: string
  completedAt: string
  response?: unknown
}

export type BenefitOrderSession = {
  id: string
  workflow: BenefitWorkflow
  stage: BenefitStage
  maskedPhone: string
  accountId?: string
  provinceCode?: string
  cityCode?: string
  loginMode?: 'sms' | 'app_cookie'
  sourceUrl?: string
  product?: {
    bagStatus?: {
      variant: LuckyBagVariant
      mainOrdered: boolean
      currentBenefitCodes: string[]
      action: 'main_order' | 'benefit_order' | 'benefit_change'
      mainMonthlyFee: number
    }
    name: string
    productCode: string
    rulesHtml: string
    modules?: BenefitModule[]
    norms?: PremiumNorm[]
    selectedIds?: string[]
    selectedName?: string
    selectedPrice?: number
    details?: Array<{ label: string; value: string }>
    eligible?: boolean
    eligibilityMessage?: string
    protocol?: { name: string; content: string; sequenceId?: string; protocolId?: string }
    protocolRequired?: boolean
    warnings: string[]
  }
  loginSmsCooldownSeconds: number
  orderSmsCooldownSeconds: number
  lastResult?: BenefitOrderResult
  createdAt: string
  updatedAt: string
  expiresAt: string
}

type SessionResponse = { session: BenefitOrderSession }

export async function createBenefitSession(input: Record<string, unknown>): Promise<BenefitOrderSession> {
  const data = await requestApiJson<SessionResponse>('/api/benefit-orders/sessions', 'POST', input)
  return data.session
}

export async function createCocAppSsoLink(
  accountId: string,
  target: CocAppBusinessId,
): Promise<string> {
  const data = await requestApiJson<{ ssoUrl: string }>(
    `/api/accounts/${encodeURIComponent(accountId)}/coc-package/${target}/sso-link`,
    'POST',
    {},
  )
  return data.ssoUrl
}

export async function sendBenefitLoginSms(sessionId: string): Promise<BenefitOrderSession> {
  const data = await requestApiJson<SessionResponse>(`/api/benefit-orders/sessions/${encodeURIComponent(sessionId)}/login-sms`, 'POST', {})
  return data.session
}

export async function loginBenefitSession(sessionId: string, code: string): Promise<BenefitOrderSession> {
  const data = await requestApiJson<SessionResponse>(`/api/benefit-orders/sessions/${encodeURIComponent(sessionId)}/login`, 'POST', { code })
  return data.session
}

export async function prepareBenefitProduct(sessionId: string): Promise<BenefitOrderSession> {
  const data = await requestApiJson<SessionResponse>(`/api/benefit-orders/sessions/${encodeURIComponent(sessionId)}/product`, 'POST', {})
  return data.session
}

export async function selectBenefitProduct(
  sessionId: string,
  selectedIds: string[],
  customNorm?: CustomPremiumNormInput,
): Promise<BenefitOrderSession> {
  const data = await requestApiJson<SessionResponse>(`/api/benefit-orders/sessions/${encodeURIComponent(sessionId)}/selection`, 'POST', { selectedIds, customNorm })
  return data.session
}

export async function rewindBenefitSession(sessionId: string): Promise<BenefitOrderSession> {
  const data = await requestApiJson<SessionResponse>(`/api/benefit-orders/sessions/${encodeURIComponent(sessionId)}/back`, 'POST', {})
  return data.session
}

export async function sendBenefitOrderSms(
  sessionId: string,
  input: { acceptedProtocol: boolean; forceAttempt: boolean },
): Promise<BenefitOrderSession> {
  const data = await requestApiJson<SessionResponse>(`/api/benefit-orders/sessions/${encodeURIComponent(sessionId)}/order-sms`, 'POST', input)
  return data.session
}

export async function confirmBenefitOrder(
  sessionId: string,
  input: { code: string; acceptedProtocol: boolean; confirmationText: string; forceAttempt: boolean },
): Promise<{ session: BenefitOrderSession; result: BenefitOrderResult }> {
  return requestApiJson<{ session: BenefitOrderSession; result: BenefitOrderResult }>(
    `/api/benefit-orders/sessions/${encodeURIComponent(sessionId)}/confirm`,
    'POST',
    input,
  )
}

export async function deleteBenefitSession(sessionId: string): Promise<void> {
  await requestApiJson(`/api/benefit-orders/sessions/${encodeURIComponent(sessionId)}`, 'DELETE')
}

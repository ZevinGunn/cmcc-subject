import { requestApiData, requestApiJson } from './api'

export type LuckyThreeDayAccount = {
  id: string
  label: string
  phoneMasked: string
  displayPhone: string
}

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

export type LuckyBenefitOverride = {
  activityId: number
  batchId: number
  skuId: number
  attemptable: boolean
  inventory?: number
  updatedAt: string
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

export type LuckyDashboard = {
  sign: LuckySignStatus
  activity: LuckyActivity
  sessionReused: boolean
}

export type LuckyActionResult = {
  success: boolean
  resultCode: string
  message: string
  data?: unknown
}

export type LuckyQualification = {
  eligible: boolean
  resultCode: string
  message: string
  data?: unknown
}

type ProductInput = Pick<LuckyProduct, 'batchId' | 'skuId' | 'mid'>

export async function loadLuckyThreeDayAccounts(): Promise<LuckyThreeDayAccount[]> {
  const data = await requestApiData<{ accounts: LuckyThreeDayAccount[] }>('/api/lucky-three-day/accounts')
  return data.accounts
}

export function loadLuckyThreeDayStatus(accountId: string): Promise<LuckyDashboard> {
  return requestApiJson<LuckyDashboard>(
    `/api/lucky-three-day/${encodeURIComponent(accountId)}/status`,
    'POST',
    {},
  )
}

export function signLuckyThreeDay(accountId: string): Promise<{ result: LuckyActionResult; sign: LuckySignStatus }> {
  return requestApiJson(
    `/api/lucky-three-day/${encodeURIComponent(accountId)}/sign`,
    'POST',
    { confirmationText: '确认签到' },
  )
}

export function checkLuckyQualification(
  accountId: string,
  product: ProductInput,
): Promise<{ product: LuckyProduct; qualification: LuckyQualification }> {
  return requestApiJson(
    `/api/lucky-three-day/${encodeURIComponent(accountId)}/qualification`,
    'POST',
    product,
  )
}

export function sendLuckyOrderSms(
  accountId: string,
  product: ProductInput,
): Promise<{
  product: LuckyProduct
  qualification: LuckyQualification
  sms: LuckyActionResult
  cooldownSeconds: number
}> {
  return requestApiJson(
    `/api/lucky-three-day/${encodeURIComponent(accountId)}/order-sms`,
    'POST',
    product,
  )
}

export function confirmLuckyOrder(
  accountId: string,
  product: ProductInput,
  input: { smsCode: string; confirmationText: string; attemptId: string },
): Promise<{ result: LuckyActionResult; replayed: boolean }> {
  return requestApiJson(
    `/api/lucky-three-day/${encodeURIComponent(accountId)}/confirm`,
    'POST',
    { ...product, ...input },
  )
}

export async function loadLuckyBenefitOverrides(): Promise<LuckyBenefitOverride[]> {
  const data = await requestApiData<{ overrides: LuckyBenefitOverride[] }>('/api/lucky-three-day/settings')
  return data.overrides
}

export function saveLuckyBenefitOverride(input: {
  batchId: number
  skuId: number
  attemptable: boolean
  inventory?: number
}): Promise<{ override: LuckyBenefitOverride }> {
  return requestApiJson(
    `/api/lucky-three-day/settings/${input.batchId}/${input.skuId}`,
    'PUT',
    { attemptable: input.attemptable, inventory: input.inventory },
  )
}

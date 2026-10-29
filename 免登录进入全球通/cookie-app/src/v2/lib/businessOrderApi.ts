import { requestApiData, requestApiJson } from './api'

export type BusinessOrderStage =
  | 'phone_verified'
  | 'login_sms_sent'
  | 'logged_in'
  | 'product_ready'
  | 'order_sms_sent'
  | 'ordering'
  | 'finished'

export type BusinessOrderProtocol = {
  name: string
  content: string
  sequenceId: string
}

export type BusinessOrderProduct = {
  productCode: string
  productName: string
  pageTitle?: string
  configured: boolean
  available: boolean
  eligible?: boolean
  relationOrdered?: boolean
  rulesHtml: string
  protocol: BusinessOrderProtocol
  warnings: string[]
  orderAllowed?: boolean
  eligibilitySummary?: string
  eligibilityDetail?: string
}

export type BusinessOrderResult = {
  success: boolean
  uncertain: boolean
  code: string
  message: string
  completedAt: string
  data?: unknown
  response?: unknown
}

export type BusinessOrderSession = {
  id: string
  target?: 'diamond_package' | 'age_feed'
  ageFeedTier?: string
  stage: BusinessOrderStage
  maskedPhone: string
  productCode: string
  pageId: string
  touchCode: string
  provinceCode?: string
  cityCode?: string
  cityName?: string
  areaName?: string
  product?: BusinessOrderProduct
  loginSmsCooldownSeconds: number
  orderSmsCooldownSeconds: number
  lastResult?: BusinessOrderResult
  createdAt: string
  updatedAt: string
  expiresAt: string
}

export type BusinessOrderDefaults = {
  productCode: string
  pageId: string
  touchCode: string
}

export type BusinessOrderAccount = {
  id: string
  label: string
  phone?: string
  phoneMasked: string
  displayPhone?: string
}

type SessionResponse = { session: BusinessOrderSession }

export function loadBusinessOrderDefaults(): Promise<BusinessOrderDefaults> {
  return requestApiData<BusinessOrderDefaults>('/api/business-order/defaults')
}

export async function loadBusinessOrderAccounts(): Promise<BusinessOrderAccount[]> {
  const data = await requestApiData<{ accounts: BusinessOrderAccount[] }>('/api/business-order/accounts')
  return data.accounts
}

export function scopeBusinessOrderAccounts(
  accounts: BusinessOrderAccount[],
  initialAccountId: string,
): BusinessOrderAccount[] {
  if (!initialAccountId) return accounts
  return accounts.some((account) => account.id === initialAccountId) ? accounts : []
}

export async function createBusinessOrder(input: {
  target?: 'diamond_package' | 'age_feed'
  phone?: string
  accountId?: string
  productCode: string
  pageId: string
  touchCode: string
}): Promise<BusinessOrderSession> {
  const data = await requestApiJson<SessionResponse>('/api/business-order/sessions', 'POST', input)
  return data.session
}

export async function sendBusinessOrderLoginSms(sessionId: string): Promise<BusinessOrderSession> {
  const data = await requestApiJson<SessionResponse>(
    `/api/business-order/sessions/${encodeURIComponent(sessionId)}/login-sms`,
    'POST',
    {},
  )
  return data.session
}

export async function loginBusinessOrder(sessionId: string, code: string): Promise<BusinessOrderSession> {
  const data = await requestApiJson<SessionResponse>(
    `/api/business-order/sessions/${encodeURIComponent(sessionId)}/login`,
    'POST',
    { code },
  )
  return data.session
}

export async function prepareBusinessOrderProduct(
  sessionId: string,
  input: { productCode: string; pageId: string; touchCode: string },
): Promise<BusinessOrderSession> {
  const data = await requestApiJson<SessionResponse>(
    `/api/business-order/sessions/${encodeURIComponent(sessionId)}/product`,
    'POST',
    input,
  )
  return data.session
}

export async function sendBusinessOrderSms(
  sessionId: string,
  acceptedProtocol: boolean,
): Promise<BusinessOrderSession> {
  const data = await requestApiJson<SessionResponse>(
    `/api/business-order/sessions/${encodeURIComponent(sessionId)}/order-sms`,
    'POST',
    { acceptedProtocol },
  )
  return data.session
}

export async function submitBusinessOrder(
  sessionId: string,
  input: { code: string; acceptedProtocol: boolean; confirmationText: string },
): Promise<{ session: BusinessOrderSession; result: BusinessOrderResult }> {
  return requestApiJson<{ session: BusinessOrderSession; result: BusinessOrderResult }>(
    `/api/business-order/sessions/${encodeURIComponent(sessionId)}/confirm`,
    'POST',
    input,
  )
}

export async function deleteBusinessOrder(sessionId: string): Promise<boolean> {
  const data = await requestApiJson<{ deleted: boolean }>(
    `/api/business-order/sessions/${encodeURIComponent(sessionId)}`,
    'DELETE',
  )
  return data.deleted
}

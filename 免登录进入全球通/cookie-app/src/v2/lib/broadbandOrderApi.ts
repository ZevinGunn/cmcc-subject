import { requestApiData, requestApiJson } from './api'

export type BroadbandFlowType = 'install' | 'renewal'
export type BroadbandOperationMode = 'install' | 'renewal_aj' | 'renewal_single'
export type BroadbandJsonValue = string | number | boolean | null | BroadbandJsonValue[] | BroadbandJsonObject
export type BroadbandJsonObject = { [key: string]: BroadbandJsonValue }

export type BroadbandProductConfig = {
  id: string
  configKey: string
  flowType: BroadbandFlowType
  operationMode: BroadbandOperationMode
  displayName: string
  description: string
  category: string
  fields: BroadbandJsonObject
  source: 'builtin' | 'custom' | 'runtime'
  editable: boolean
  attemptedFromFlow?: BroadbandFlowType
  createdAt?: string
  updatedAt?: string
}

export type BroadbandOrderResult = {
  success: boolean
  uncertain: boolean
  paymentRequired: boolean
  code: string
  message: string
  paymentUrl?: string
  completedAt: string
  details?: BroadbandJsonObject
}

export type BroadbandOrderSession = {
  id: string
  accountId: string
  maskedPhone: string
  flowType: BroadbandFlowType
  stage: 'created' | 'captcha_ready' | 'account_ready' | 'catalog_ready' | 'sms_sent' | 'verified' | 'prepared' | 'finished'
  captchaImage?: string
  captchaPurpose?: 'lookup' | 'sms' | 'commit'
  accounts: Array<{
    id: string
    maskedNumber: string
    itemName: string
    endTime: string
    isExpire?: string | boolean
  }>
  selectedBroadband?: {
    id: string
    maskedNumber: string
    itemName: string
    endTime: string
    isExpire?: string | boolean
  }
  products: BroadbandProductConfig[]
  selectedProduct?: BroadbandProductConfig
  context?: BroadbandJsonObject
  balanceWarning?: string
  smsCooldownSeconds: number
  lastResult?: BroadbandOrderResult
  createdAt: string
  updatedAt: string
  expiresAt: string
}

export type BroadbandOrderAccount = {
  id: string
  label?: string
  phoneMasked?: string
  displayPhone?: string
  hasCookie?: boolean
}

type SessionResponse = { session: BroadbandOrderSession }

export async function loadBroadbandConfigs(): Promise<{ configs: BroadbandProductConfig[]; canManage: boolean }> {
  return requestApiData('/api/broadband-orders/configs')
}

export async function saveBroadbandConfig(input: Omit<BroadbandProductConfig, 'id' | 'source' | 'editable' | 'createdAt' | 'updatedAt'>, id?: string): Promise<BroadbandProductConfig> {
  const data = await requestApiJson<{ config: BroadbandProductConfig }>(
    id ? `/api/broadband-orders/configs/${encodeURIComponent(id)}` : '/api/broadband-orders/configs',
    id ? 'PUT' : 'POST',
    input,
  )
  return data.config
}

export async function createBroadbandSession(accountId: string, flowType: BroadbandFlowType): Promise<BroadbandOrderSession> {
  const data = await requestApiJson<SessionResponse>('/api/broadband-orders/sessions', 'POST', { accountId, flowType })
  return data.session
}

async function action(sessionId: string, path: string, body: Record<string, unknown> = {}): Promise<BroadbandOrderSession> {
  const data = await requestApiJson<SessionResponse>(
    `/api/broadband-orders/sessions/${encodeURIComponent(sessionId)}/${path}`,
    'POST',
    body,
  )
  return data.session
}

export function refreshBroadbandCaptcha(sessionId: string, purpose: 'lookup' | 'sms' | 'commit'): Promise<BroadbandOrderSession> {
  return action(sessionId, 'captcha', { purpose })
}

export function loadInstallCatalog(sessionId: string, configId: string, fields?: BroadbandJsonObject): Promise<BroadbandOrderSession> {
  return action(sessionId, 'install/catalog', { configId, fields })
}

export function queryRenewalAccounts(sessionId: string, billId: string, captcha: string): Promise<BroadbandOrderSession> {
  return action(sessionId, 'renewal/accounts', { billId, captcha })
}

export function selectRenewalAccount(sessionId: string, optionId: string, fields?: BroadbandJsonObject): Promise<BroadbandOrderSession> {
  return action(sessionId, 'renewal/account', { optionId, fields })
}

export function selectBroadbandProduct(
  sessionId: string,
  configId: string,
  fields?: BroadbandJsonObject,
  replaceFields = false,
): Promise<BroadbandOrderSession> {
  return action(sessionId, 'product', { configId, fields, replaceFields })
}

export function sendBroadbandRenewalSms(sessionId: string, captcha: string, phoneNo?: string): Promise<BroadbandOrderSession> {
  return action(sessionId, 'sms/send', { captcha, phoneNo })
}

export function verifyBroadbandRenewalSms(sessionId: string, code: string, phoneNo?: string): Promise<BroadbandOrderSession> {
  return action(sessionId, 'sms/verify', { code, phoneNo })
}

export function prepareBroadbandOrder(sessionId: string, fields: BroadbandJsonObject, acceptBalance = false): Promise<BroadbandOrderSession> {
  return action(sessionId, 'prepare', { fields, acceptBalance })
}

export function commitBroadbandOrder(sessionId: string, input: {
  captcha: string
  fields: BroadbandJsonObject
  acceptedProtocol: boolean
  confirmationText: string
}): Promise<BroadbandOrderSession> {
  return action(sessionId, 'commit', input)
}

export async function deleteBroadbandSession(sessionId: string): Promise<boolean> {
  const data = await requestApiJson<{ deleted: boolean }>(
    `/api/broadband-orders/sessions/${encodeURIComponent(sessionId)}`,
    'DELETE',
  )
  return data.deleted
}

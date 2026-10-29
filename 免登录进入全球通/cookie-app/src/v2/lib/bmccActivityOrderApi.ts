import { requestApiData, requestApiJson } from './api'

export type BmccActivityConfig = {
  activityName: string
  displayName: string
  proType?: string
  packageId: string
  packageCode: string
  packageName?: string
  productShowCode?: string
  productShowName?: string
  productSendUrl?: string
  pitemShowCode: string
  pitemShowName?: string
  pitemSendUrl?: string
  mtOtherParams?: string
  prodValue?: string
  isQd2018?: boolean
  activityUrl?: string
}

export type BmccActivityConfigRecord = BmccActivityConfig & {
  id: string
  source: 'builtin' | 'custom'
  editable: boolean
  createdAt?: string
  updatedAt?: string
}

export type BmccJsonValue = string | number | boolean | null | BmccJsonValue[] | BmccJsonObject
export type BmccJsonObject = { [key: string]: BmccJsonValue }

export type BmccActivityInfo = {
  resultCode?: string
  eligible?: boolean
  alreadyOrdered?: boolean
  canAttempt: boolean
  message: string
  details: BmccJsonObject
}

export type BmccActivityOrderResult = {
  success: boolean
  uncertain: boolean
  code: string
  message: string
  completedAt: string
  details?: BmccJsonObject
}

export type BmccActivityOrderStage =
  | 'captcha_ready'
  | 'login_sms_sent'
  | 'logged_in'
  | 'activity_ready'
  | 'order_sms_required'
  | 'finished'

export type BmccActivityOrderSession = {
  id: string
  accountId?: string
  maskedPhone: string
  stage: BmccActivityOrderStage
  loginCacheStatus: 'missing' | 'expired' | 'reused' | 'saved'
  loginCachedAt?: string
  loginValidatedAt?: string
  config?: BmccActivityConfig
  configFingerprint?: string
  captchaImage?: string
  loginSmsCooldownSeconds: number
  orderSmsCooldownSeconds: number
  orderSms?: {
    smsType?: string
    productItemName?: string
    productItemDesc?: string
    busiTime?: string
  }
  activity?: BmccActivityInfo
  lastResult?: BmccActivityOrderResult
  createdAt: string
  updatedAt: string
  expiresAt: string
}

type SessionResponse = { session: BmccActivityOrderSession }

export function sanitizeBmccOrderCodeInput(value: string, allowEightDigits = false): string {
  return value.replace(/\D/g, '').slice(0, allowEightDigits ? 8 : 6)
}

export function isBmccOrderCodeReady(value: string, allowEightDigits = false): boolean {
  return /^\d{6}$/.test(value) || (allowEightDigits && /^\d{8}$/.test(value))
}

export async function loadBmccActivityPresets(): Promise<{
  presets: BmccActivityConfigRecord[]
  canManage: boolean
}> {
  return requestApiData('/api/bmcc-activity-order/presets')
}

export async function createBmccActivityOrder(input: {
  accountId?: string
  phone?: string
}): Promise<BmccActivityOrderSession> {
  const data = await requestApiJson<SessionResponse>('/api/bmcc-activity-order/sessions', 'POST', input)
  return data.session
}

export async function restoreBmccActivityOrder(accountId: string): Promise<{
  status: 'missing' | 'expired' | 'reused'
  session?: BmccActivityOrderSession
}> {
  return requestApiJson('/api/bmcc-activity-order/sessions/restore', 'POST', { accountId })
}

async function sessionAction(
  sessionId: string,
  action: string,
  body: Record<string, unknown> = {},
): Promise<BmccActivityOrderSession> {
  const data = await requestApiJson<SessionResponse>(
    `/api/bmcc-activity-order/sessions/${encodeURIComponent(sessionId)}/${action}`,
    'POST',
    body,
  )
  return data.session
}

export function refreshBmccActivityCaptcha(sessionId: string): Promise<BmccActivityOrderSession> {
  return sessionAction(sessionId, 'captcha')
}

export function sendBmccActivityLoginSms(
  sessionId: string,
  captcha: string,
): Promise<BmccActivityOrderSession> {
  return sessionAction(sessionId, 'login-sms', { captcha })
}

export function loginBmccActivityOrder(
  sessionId: string,
  code: string,
): Promise<BmccActivityOrderSession> {
  return sessionAction(sessionId, 'login', { code })
}

export function loadBmccActivityInfo(
  sessionId: string,
  configId: string,
  config?: BmccActivityConfig,
): Promise<BmccActivityOrderSession> {
  return sessionAction(sessionId, 'activity', { configId, ...(config ? { config } : {}) })
}

export async function createBmccActivityConfig(
  input: BmccActivityConfig,
): Promise<BmccActivityConfigRecord> {
  const data = await requestApiJson<{ config: BmccActivityConfigRecord }>(
    '/api/bmcc-activity-order/configs',
    'POST',
    input,
  )
  return data.config
}

export async function updateBmccActivityConfig(
  id: string,
  input: BmccActivityConfig,
): Promise<BmccActivityConfigRecord> {
  const data = await requestApiJson<{ config: BmccActivityConfigRecord }>(
    `/api/bmcc-activity-order/configs/${encodeURIComponent(id)}`,
    'PUT',
    input,
  )
  return data.config
}

export function submitBmccActivityOrder(
  sessionId: string,
  input: { acceptedProtocol: boolean; confirmationText: string },
): Promise<BmccActivityOrderSession> {
  return sessionAction(sessionId, 'submit', input)
}

export function sendBmccActivityOrderSms(sessionId: string): Promise<BmccActivityOrderSession> {
  return sessionAction(sessionId, 'order-sms')
}

export function confirmBmccActivityOrder(
  sessionId: string,
  code: string,
): Promise<BmccActivityOrderSession> {
  return sessionAction(sessionId, 'confirm', { code })
}

export async function updateBmccActivityOrderRequest(
  sessionId: string,
  config: BmccActivityConfig,
): Promise<BmccActivityOrderSession> {
  const data = await requestApiJson<SessionResponse>(
    `/api/bmcc-activity-order/sessions/${encodeURIComponent(sessionId)}/order-config`,
    'PUT',
    config,
  )
  return data.session
}

export async function deleteBmccActivityOrder(sessionId: string): Promise<boolean> {
  const data = await requestApiJson<{ deleted: boolean }>(
    `/api/bmcc-activity-order/sessions/${encodeURIComponent(sessionId)}`,
    'DELETE',
  )
  return data.deleted
}

import { requestApiJson } from './api'

export type QqtPremiumBroadbandGear = {
  itemCode: string
  name: string
}

export type QqtPremiumBroadbandCheck = {
  eligible: boolean
  needsRealName: boolean
  blocked: boolean
  code: string
  message: string
  response: unknown
}

export type QqtPremiumBroadbandResult = {
  attempted: boolean
  success: boolean
  uncertain: boolean
  code: string
  message: string
  completedAt: string
  response: unknown
}

export type QqtPremiumBroadbandSession = {
  id: string
  accountId: string
  maskedPhone: string
  maskedOwnerName?: string
  stage: 'ready' | 'checked' | 'finished'
  productName: string
  contractMonths: 24
  gears: QqtPremiumBroadbandGear[]
  itemCode: string
  initializationMessage?: string
  initializationResponse?: unknown
  precheck?: QqtPremiumBroadbandCheck
  lastResult?: QqtPremiumBroadbandResult
  createdAt: string
  updatedAt: string
  expiresAt: string
}

type SessionResponse = { session: QqtPremiumBroadbandSession }

export async function createQqtPremiumBroadbandSession(
  accountId: string,
  loginSessionId: string,
): Promise<QqtPremiumBroadbandSession> {
  const data = await requestApiJson<SessionResponse>('/api/qqt-premium-broadband-orders/sessions', 'POST', {
    accountId,
    loginSessionId,
  })
  return data.session
}

export async function checkQqtPremiumBroadband(sessionId: string): Promise<QqtPremiumBroadbandSession> {
  const data = await requestApiJson<SessionResponse>(
    `/api/qqt-premium-broadband-orders/sessions/${encodeURIComponent(sessionId)}/check`,
    'POST',
  )
  return data.session
}

export async function submitQqtPremiumBroadband(sessionId: string, input: {
  ownerName: string
  identityNumber: string
  district: string
  address: string
  contactPhone: string
  installDate: string
  timeSlot: string
  acceptedProtocol: boolean
  confirmationText: string
}): Promise<QqtPremiumBroadbandSession> {
  const data = await requestApiJson<SessionResponse>(
    `/api/qqt-premium-broadband-orders/sessions/${encodeURIComponent(sessionId)}/submit`,
    'POST',
    input,
  )
  return data.session
}

export async function deleteQqtPremiumBroadbandSession(sessionId: string): Promise<boolean> {
  const data = await requestApiJson<{ deleted: boolean }>(
    `/api/qqt-premium-broadband-orders/sessions/${encodeURIComponent(sessionId)}`,
    'DELETE',
  )
  return data.deleted
}

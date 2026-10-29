import { getAccountLoginState, getYunpanCredentialStatus } from '@/lib/accountLoginState'
import type {
  AccountSummary,
  BatchTask,
  BatchTaskItemStatus,
  BatchTaskStatus,
  BatchTaskType,
  V2Account,
  V2AccountHealth,
  V2AccountHealthStatus,
  V2CredentialHealth,
  V2StatusTone,
} from './types'

export type StatusTone = V2StatusTone
export type AccountHealthStatus = V2AccountHealthStatus

export type AccountHealth = V2AccountHealth & {
  description: string
  priority: number
}

export type AccountHealthOptions = {
  now?: Date | number
  expiryWarningMs?: number
}

const DEFAULT_EXPIRY_WARNING_MS = 12 * 60 * 60 * 1000

function timestamp(value?: string): number | null {
  if (!value) return null
  const parsed = Date.parse(value)
  return Number.isFinite(parsed) ? parsed : null
}

function hasKnownSecondaryCredentialFailure(account: AccountSummary): boolean {
  return Boolean(
    (account.hasCmccAppCookie === false && account.cmccAppCookieUpdatedAt) ||
      (account.hasWedRechargeCookie === false && account.wedRechargeCookieUpdatedAt) ||
      (!account.qqtAccessToken && account.qqtAccessTokenCheckedAt),
  )
}

export function deriveAccountHealth(
  account: AccountSummary,
  options: AccountHealthOptions = {},
): AccountHealth {
  const now = options.now instanceof Date ? options.now.getTime() : options.now ?? Date.now()
  const warningMs = Math.max(0, options.expiryWarningMs ?? DEFAULT_EXPIRY_WARNING_MS)
  const login = getAccountLoginState(account, now)
  const expiresAt = login.primaryExpireAt
  const expiresAtMs = timestamp(expiresAt)
  const remainingMs = expiresAtMs === null ? undefined : expiresAtMs - now

  if (account.disabledAt) {
    const reason = account.disabledReason || '账号已停用，需要重新接入'
    return {
      status: 'disabled',
      label: '已失效',
      reason,
      description: reason,
      tone: 'neutral',
      priority: 0,
      expiresAt,
      remainingMs,
    }
  }

  if (login.hasYunpan) {
    const verified = getYunpanCredentialStatus(account).label === '有效'
    const reason = verified ? '云盘 CK 已验证，其他渠道凭据独立维护' : '云盘 CK 已保存，待维护验证'
    return {
      status: verified ? 'healthy' : 'unknown', label: verified ? '云盘有效' : '云盘待验证', reason, description: reason,
      tone: verified ? 'success' : 'warning', priority: verified ? 4 : 3, expiresAt, remainingMs,
    }
  }

  if (account.yunpanSessionInvalidAt && account.hasYunpanSession && login.loggedIn) {
    return { status: 'maintenance', label: '云盘需补登', reason: '云盘 CK 已失效，其他渠道凭据独立保留',
      description: '云盘 CK 已失效，其他渠道凭据独立保留', actionLabel: '云盘补登',
      tone: 'warning', priority: 2, expiresAt, remainingMs }
  }

  if (account.yunpanSessionInvalidAt && account.hasYunpanSession) {
    return { status: 'invalid', label: '云盘需补登', reason: '云盘 CK 已失效，需要重新云盘登录',
      description: '云盘 CK 已失效，需要重新云盘登录', actionLabel: '云盘补登',
      tone: 'danger', priority: 1, expiresAt, remainingMs }
  }

  if (account.cookieInvalidAt) {
    const reason = account.cookieInvalidReason || '核心登录态已失效'
    return {
      status: 'invalid',
      label: '需重新登录',
      reason,
      description: reason,
      actionLabel: '重新登录',
      tone: 'danger',
      priority: 1,
      expiresAt,
      remainingMs,
    }
  }

  if (remainingMs !== undefined && remainingMs <= 0) {
    return {
      status: 'expired',
      label: '需重新登录',
      reason: '登录有效期已结束',
      description: '登录有效期已结束',
      actionLabel: '重新登录',
      tone: 'danger',
      priority: 1,
      expiresAt,
      remainingMs,
    }
  }

  if (!account.hasCookie) {
    return {
      status: 'invalid',
      label: '需重新登录',
      reason: '缺少可用的核心登录凭据',
      description: '缺少可用的核心登录凭据',
      actionLabel: '去登录',
      tone: 'danger',
      priority: 1,
      expiresAt,
      remainingMs,
    }
  }

  if (remainingMs !== undefined && remainingMs <= warningMs) {
    return {
      status: 'expiring',
      label: '即将到期',
      reason: '登录态已进入到期提醒窗口',
      description: '登录态已进入到期提醒窗口',
      actionLabel: '提前续期',
      tone: 'warning',
      priority: 2,
      expiresAt,
      remainingMs,
    }
  }

  if (hasKnownSecondaryCredentialFailure(account)) {
    const reason = '核心登录正常，但已使用的扩展凭据需要维护'
    return {
      status: 'maintenance',
      label: '需维护',
      reason,
      description: reason,
      actionLabel: '运行维护',
      tone: 'warning',
      priority: 3,
      expiresAt,
      remainingMs,
    }
  }

  if (account.hasCookie) {
    const hasValidationEvidence = Boolean(
      expiresAtMs !== null ||
        timestamp(account.activationCheckedAt) !== null ||
        timestamp(account.cookieUpdatedAt) !== null ||
        timestamp(account.lastLoginAt) !== null,
    )
    if (!hasValidationEvidence) {
      return {
        status: 'unknown',
        label: '未知',
        reason: '已保存登录凭据，但没有可用的校验时间',
        description: '已保存登录凭据，但没有可用的校验时间',
        actionLabel: '检测状态',
        tone: 'neutral',
        priority: 5,
        expiresAt,
        remainingMs,
      }
    }
    return {
      status: 'healthy',
      label: '健康',
      reason: '核心登录凭据可用',
      description: '核心登录凭据可用',
      tone: 'success',
      priority: 4,
      expiresAt,
      remainingMs,
    }
  }

  return {
    status: 'unknown',
    label: '未知',
    reason: '缺少足够数据，需要先运行状态检测',
    description: '缺少足够数据，需要先运行状态检测',
    actionLabel: '检测状态',
    tone: 'neutral',
    priority: 5,
    expiresAt,
    remainingMs,
  }
}

function credentialHealth(account: AccountSummary, health: AccountHealth): V2CredentialHealth {
  const core =
    health.status === 'disabled' || health.status === 'invalid' || health.status === 'expired'
      ? 'invalid'
      : account.hasCookie || account.hasYunpanSession
        ? 'available'
        : 'missing'
  return {
    core,
    yunpan: !account.hasYunpanSession ? 'missing' : account.yunpanSessionInvalidAt ? 'invalid'
      : account.yunpanSessionCheckedAt ? 'available' : 'unknown',
    cmccApp: account.hasCmccAppCookie ? 'available' : 'missing',
    wedRecharge: account.hasWedRechargeCookie ? 'available' : 'missing',
    qqt: account.qqtAccessToken ? 'available' : 'missing',
  }
}

export function toV2Account(
  account: AccountSummary,
  options: AccountHealthOptions = {},
): V2Account {
  const health = deriveAccountHealth(account, options)
  return {
    id: account.id,
    label:
      account.label || account.displayPhone || account.phoneMasked || account.phone || '未命名账号',
    displayPhone: account.displayPhone,
    phoneMasked: account.phoneMasked,
    phone: account.phone,
    publicLinkIds: account.publicLinkIds ?? [],
    health,
    credentialHealth: credentialHealth(account, health),
    hasCookie: account.hasCookie,
    hasYunpanSession: Boolean(account.hasYunpanSession),
    hasCmccAppCookie: Boolean(account.hasCmccAppCookie),
    hasWedRechargeCookie: Boolean(account.hasWedRechargeCookie),
    cookieExpireAt: health.expiresAt,
    updatedAt: account.updatedAt,
    raw: account,
  }
}

export type TaskDisplayStatus =
  | BatchTaskStatus
  | BatchTaskItemStatus
  | 'cancelled'

export type TaskStatusDisplay = {
  status: TaskDisplayStatus
  label: string
  tone: StatusTone
  isTerminal: boolean
}

export const TASK_STATUS_DISPLAY: Record<BatchTaskStatus, TaskStatusDisplay> = {
  pending: { status: 'pending', label: '等待中', tone: 'neutral', isTerminal: false },
  running: { status: 'running', label: '执行中', tone: 'info', isTerminal: false },
  success: { status: 'success', label: '已成功', tone: 'success', isTerminal: true },
  partial_success: {
    status: 'partial_success',
    label: '部分成功',
    tone: 'warning',
    isTerminal: true,
  },
  failed: { status: 'failed', label: '已失败', tone: 'danger', isTerminal: true },
}

export const TASK_ITEM_STATUS_DISPLAY: Record<BatchTaskItemStatus, TaskStatusDisplay> = {
  pending: TASK_STATUS_DISPLAY.pending,
  running: TASK_STATUS_DISPLAY.running,
  success: TASK_STATUS_DISPLAY.success,
  failed: TASK_STATUS_DISPLAY.failed,
  skipped: { status: 'skipped', label: '已跳过', tone: 'neutral', isTerminal: true },
}

const CANCELLED_DISPLAY: TaskStatusDisplay = {
  status: 'cancelled',
  label: '已停止',
  tone: 'neutral',
  isTerminal: true,
}

function isCancellationMessage(message?: string): boolean {
  return Boolean(message && /(?:任务)?(?:已)?(?:停止|取消)|cancel(?:led|ed)?/i.test(message))
}

export function getTaskStatusDisplay(
  taskOrStatus: BatchTask | BatchTaskStatus,
  message?: string,
): TaskStatusDisplay {
  const status = typeof taskOrStatus === 'string' ? taskOrStatus : taskOrStatus.status
  const taskMessage = typeof taskOrStatus === 'string' ? message : taskOrStatus.message
  if (
    (status === 'failed' || status === 'partial_success') &&
    isCancellationMessage(taskMessage)
  ) {
    return CANCELLED_DISPLAY
  }
  return TASK_STATUS_DISPLAY[status]
}

export function getTaskItemStatusDisplay(
  status: BatchTaskItemStatus,
  message?: string,
): TaskStatusDisplay {
  if ((status === 'failed' || status === 'skipped') && isCancellationMessage(message)) {
    return CANCELLED_DISPLAY
  }
  return TASK_ITEM_STATUS_DISPLAY[status]
}

export const TASK_TYPE_LABELS: Record<BatchTaskType, string> = {
  refresh: '刷新 CK',
  sign: '全球通签到',
  refresh_and_sign: '刷新并签到',
  wed_recharge: '周三充值活动',
  query_info: '查询账号信息',
  yunpan_activate: '置换云盘全球通 Token',
  ck_maintenance: 'CK 维护',
  global_telecom_resign: '一键补签+一键盲盒',
  global_telecom_daily: '全球通每日签到+补签+抽奖',
  activity_session_refresh: '活动会话续期',
  cmcc_session_exchange: 'CMCC 会话置换',
  keepalive: '登录态保活',
  cmcc_auto_checkin: '移动活动自动化',
}

export function getTaskTypeLabel(type: BatchTaskType): string {
  return TASK_TYPE_LABELS[type]
}

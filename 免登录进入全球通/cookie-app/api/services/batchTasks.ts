import { ensureYunpanGlobalToken } from './yunpanSso.js'
import { executeGlobalTelecomDaily } from './globalTelecomDailyAccount.js'
import { isGlobalDailyScheduleDue } from './globalTelecomDaily.js'
import { maintainCredentialChannels, type CredentialMaintenanceResult } from './credentialMaintenance.js'
import crypto from 'node:crypto'
import type { BatchTask, BatchTaskItem, TaskSchedule } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { cmccActivateFareBalance, cmccRefreshCookieByHome } from './cmcc10086.js'
import { runPool } from './runPool.js'
import {
  getAccountById,
  listAccounts,
  setAccountActivationInfo,
  setAccountCookie,
  setAccountCmccAppCookie,
  setAccountDisplayPhone,
  setAccountQqtInfo,
  setAccountQqtSignState,
  setAccountQqtToken,
  setAccountWedRechargeCookie,
  setAccountWedRechargeInfo,
  touchAccountCookieCheckedAt,
  touchAccountQqtTokenCheckedAt,
  toAccountSummary,
  type AccountRecord,
} from './accountsStore.js'
import { getPublicLink, listPublicLinks } from './publicLinksStore.js'
import { listPublicLinkPushConfigs } from './publicLinkPushStore.js'
import { listUserAccountSummaries } from './userAuthStore.js'
import { qqtReplaceToken, qqtSign, qqtSignInfo } from './qqtSign.js'
import { currentQqtActivitySignState, verifyQqtActivityState } from './qqtActivityState.js'
import { logEvent } from './logStore.js'
import { getPrisma } from './prisma.js'
import { pushPlusSend } from './pushplus.js'
import { withKeyLock } from './taskGuards.js'
import { withWedActivityLock } from './wedActivityLock.js'
import {
  beijingDayKey,
  setDailyTaskState,
  shouldSkipDailyTask,
} from './dailyTaskState.js'
import {
  prepareWedRechargeSession,
  planWedRechargeTasks,
  resolveWedRechargeTaskStrategy,
  wedRechargeFinishTask,
  wedRechargeGetJtToken,
  wedRechargeGetOpenTaskInfo,
  wedRechargeOpenFinish,
  wedRechargeQueryPictureInfo,
  wedRechargeTaskList,
  type WedRechargeTask,
  type WedRechargeTaskPlanItem,
  type WedRechargeTaskStrategy,
} from './wedRecharge.js'
import {
  exchange10086CookieToCmccApp,
  inspectSessionCapabilities,
  refreshHlwhdActivitySession,
} from './cmccSessionBridge.js'
import {
  ensureUsable10086Cookie,
  recover10086CookieByYunpan,
  shouldRecover10086CookieByYunpan,
} from './cmccCookieRecovery.js'
import { refreshCmccAccountProfile } from './accountProfile.js'
import {
  globalTelecomBlindBoxAction,
  globalTelecomResign,
  invalidateGlobalTelecomOverview,
  queryGlobalTelecomBlindBox,
  queryGlobalTelecomSign,
  type GlobalTelecomDay,
  type GlobalTelecomOverview,
} from './globalTelecom.js'
import {
  executeCmccAutoCheckin,
  parseCmccAutoCheckinParams,
  type CmccAutoCheckinParams,
} from './cmccAutoCheckin.js'

export type BatchTaskType =
  | 'refresh'
  | 'sign'
  | 'refresh_and_sign'
  | 'wed_recharge'
  | 'query_info'
  | 'yunpan_activate'
  | 'ck_maintenance'
  | 'global_telecom_resign'
  | 'global_telecom_daily'
  | 'activity_session_refresh'
  | 'cmcc_session_exchange'
  | 'keepalive'
  | 'cmcc_auto_checkin'
export type BatchTaskScopeType = 'admin_all' | 'public_link' | 'account' | 'selected_accounts' | 'user'
export type BatchTaskStatus = 'pending' | 'running' | 'success' | 'failed' | 'partial_success'
export type BatchTaskItemStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped'

export type BatchTaskSummary = {
  id: string
  type: BatchTaskType
  scopeType: BatchTaskScopeType
  scopeId?: string
  source: string
  scheduleId?: string
  status: BatchTaskStatus
  sspid?: string
  timezone?: string
  totalCount: number
  completedCount: number
  successCount: number
  failedCount: number
  skippedCount: number
  currentLabel?: string
  message?: string
  startedAt?: string
  finishedAt?: string
  createdAt: string
  updatedAt: string
  items: Array<{
    id: string
    accountId: string
    accountLabel?: string
    orderIndex: number
    status: BatchTaskItemStatus
    message?: string
    startedAt?: string
    finishedAt?: string
  }>
}

export type TaskScheduleSummary = {
  id: string
  name: string
  enabled: boolean
  scopeType: BatchTaskScopeType
  scopeId?: string
  action: BatchTaskType
  timezone: string
  sspid?: string
  times: string[]
  lastTriggeredAt?: string
  createdAt: string
  updatedAt: string
}

type CreateTaskArgs = {
  type: BatchTaskType
  scopeType: BatchTaskScopeType
  scopeId?: string
  source?: 'manual' | 'scheduled' | 'auto_login' | 'maintenance'
  scheduleId?: string
  sspid?: string
  timezone?: string
  dedupeKey?: string
  runKey?: string
  accountIds?: string[]
  wedRecharge?: {
    count?: number
    taskId?: string
    activityId?: string
    drawAfterRun?: boolean
    autoTaskList?: boolean
    useAppToken?: boolean
    appTokenLogin?: WedRechargeAppTokenLoginInput
  }
  forceDaily?: boolean
}

type WedRechargeAppTokenLoginInput = {
  jwtToken?: string | null
  token?: string
  appToken?: string
  postBody?: Record<string, unknown>
  sid?: string
  loginUrl?: string
  activityUrl?: string
  provinceCode?: string
  cityCode?: string
  userCheckId?: string
  carrierOperator?: string
  appVersionCode?: string
  took?: number
}

type ExecuteResult = {
  status: BatchTaskItemStatus
  message: string
}

const activeRunners = new Set<string>()
const cancelRequestedTasks = new Set<string>()
let schedulerStarted = false
let schedulerTimer: NodeJS.Timeout | null = null
const smsExpiryReminderAt = new Map<string, number>()
let lastAutoMaintenanceKey: string | null = null
const DEFAULT_RECENT_TASK_LIMIT = 50
const MAX_RECENT_TASK_LIMIT = 200

function normalizeRecentTaskLimit(limit?: number): number {
  const parsed = Number(limit)
  if (!Number.isFinite(parsed)) return DEFAULT_RECENT_TASK_LIMIT
  return Math.max(1, Math.min(MAX_RECENT_TASK_LIMIT, Math.floor(parsed)))
}

function getBatchTaskStaleSeconds(): number {
  const raw = Number(process.env.CMCC_BATCH_TASK_STALE_SECONDS ?? 45)
  if (!Number.isFinite(raw)) return 45
  return Math.max(10, Math.min(24 * 60 * 60, Math.floor(raw)))
}

function getValidityWindowMin(): number {
  const raw = Number(process.env.CMCC_VALIDITY_WINDOW_MIN ?? 90)
  if (!Number.isFinite(raw)) return 90
  return Math.max(1, Math.min(24 * 60, Math.floor(raw)))
}

function getMaintenanceWindowMin(): number {
  const raw = Number(process.env.CK_MAINTENANCE_WINDOW_MIN ?? 50)
  if (!Number.isFinite(raw)) return 50
  return Math.max(5, Math.min(24 * 60, Math.floor(raw)))
}

function getMaintenanceConcurrency(): number {
  const raw = Number(process.env.CK_MAINTENANCE_CONCURRENCY ?? 4)
  if (!Number.isFinite(raw)) return 4
  return Math.max(1, Math.min(10, Math.floor(raw)))
}

function isWithinWindow(iso: string | undefined, windowMin: number): boolean {
  if (!iso) return false
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return false
  return Date.now() - t <= windowMin * 60_000
}

function isAccountDueForCookieMaintenance(rec: AccountRecord): boolean {
  if (rec.disabledAt) return false
  if (!rec.cookie) return shouldRecover10086CookieByYunpan(rec)
  if (rec.cookieInvalidAt) return true
  return !isWithinWindow(rec.cookieCheckedAt, getMaintenanceWindowMin())
}

function normalizeTimes(input: unknown): string[] {
  const raw = Array.isArray(input)
    ? input.map((item) => String(item || '').trim())
    : typeof input === 'string'
      ? input
          .split(/[,\n]/)
          .map((item) => item.trim())
          .filter(Boolean)
      : []
  const set = new Set<string>()
  for (const item of raw) {
    const match = item.match(/^(\d{1,2}):(\d{1,2})$/)
    if (!match) continue
    const hour = Number(match[1])
    const minute = Number(match[2])
    if (!Number.isInteger(hour) || !Number.isInteger(minute)) continue
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) continue
    set.add(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
  }
  return Array.from(set).sort()
}

function parseTimesJson(text: string): string[] {
  try {
    const parsed = JSON.parse(text) as unknown
    return normalizeTimes(parsed)
  } catch {
    return []
  }
}

function toDayKey(date: Date, timezone = 'Asia/Shanghai'): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function toHm(date: Date, timezone = 'Asia/Shanghai'): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const map: Record<string, string> = {}
  for (const part of parts) {
    if (part.type !== 'literal') map[part.type] = part.value
  }
  return `${map.hour || '00'}:${map.minute || '00'}`
}

function hmToMinute(value: string): number {
  const match = value.match(/^(\d{2}):(\d{2})$/)
  if (!match) return -1
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return -1
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return -1
  return hour * 60 + minute
}

function hasSignedToday(iso: string | undefined, timezone = 'Asia/Shanghai'): boolean {
  if (!iso) return false
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return false
  return toDayKey(d, timezone) === toDayKey(new Date(), timezone)
}

function getSmsExpiryReminderHours(): number {
  const raw = Number(process.env.CMCC_SMS_LOGIN_REMINDER_HOURS ?? 12)
  if (!Number.isFinite(raw)) return 12
  return Math.max(1, Math.min(72, Math.floor(raw)))
}

function getSmsExpiryReminderCooldownMin(): number {
  const raw = Number(process.env.CMCC_SMS_LOGIN_REMINDER_COOLDOWN_MIN ?? 360)
  if (!Number.isFinite(raw)) return 360
  return Math.max(30, Math.min(7 * 24 * 60, Math.floor(raw)))
}

function formatRemainingWindow(expireAt: string, now = Date.now()): string {
  const expireMs = Date.parse(expireAt)
  if (!Number.isFinite(expireMs)) return '未知'
  const diff = Math.max(0, expireMs - now)
  const hours = Math.floor(diff / (60 * 60 * 1000))
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
  return `${hours} 小时 ${minutes} 分`
}

function formatAccountLabel(rec: Pick<AccountRecord, 'id' | 'displayPhone' | 'label' | 'phone'>): string {
  if (rec.displayPhone?.trim()) return rec.displayPhone.trim()
  if (rec.label?.trim()) return rec.label.trim()
  if (rec.phone?.trim()) return rec.phone.trim()
  return rec.id.slice(0, 8)
}

function parseSignMessage(result: unknown): string {
  if (!result || typeof result !== 'object') return '签到完成'
  const record = result as Record<string, unknown>
  const candidates = [
    record.msg,
    record.message,
    record.desc,
    record.resultMsg,
    record.resultDesc,
  ]
  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  const data =
    record.data && typeof record.data === 'object'
      ? (record.data as Record<string, unknown>)
      : undefined
  const prize = data?.prizeName
  if (typeof prize === 'string' && prize.trim()) {
    return `签到完成：${prize.trim()}`
  }
  return '签到完成'
}

type QqtMembershipState = 'global' | 'non_global' | 'unknown'
type QqtCurrentSignState = 'signed' | 'unsigned' | 'unknown'

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined
}

function classifyQqtMembership(payload: unknown): QqtMembershipState {
  const serialized = JSON.stringify(payload ?? {})
  if (/非全球通|不是全球通|未开通全球通/.test(serialized)) return 'non_global'
  const root = asRecord(payload)
  const data = asRecord(root?.data)
  const levelName = [data?.levelName, data?.brandLevelName, root?.levelName, root?.brandLevelName]
    .find((value) => typeof value === 'string' && value.trim())
  if (typeof levelName === 'string' && /全球通/.test(levelName)) return 'global'
  if (Array.isArray(data?.signDates)) return 'global'
  return 'unknown'
}

function currentQqtSignState(payload: unknown): QqtCurrentSignState {
  return currentQqtActivitySignState(payload)
}

function normalizeAccountIds(input: unknown): string[] {
  const raw = Array.isArray(input) ? input : []
  const ids = raw
    .map((item) => String(item || '').trim())
    .filter(Boolean)
  return Array.from(new Set(ids))
}

function selectedScopeId(accountIds?: string[]): string | undefined {
  const ids = normalizeAccountIds(accountIds)
  if (ids.length === 0) return undefined
  const hash = crypto
    .createHash('sha1')
    .update(ids.slice().sort().join(','))
    .digest('hex')
    .slice(0, 16)
  return `selected:${ids.length}:${hash}`
}

function encodeWedRechargeParams(args?: CreateTaskArgs['wedRecharge']): string | undefined {
  if (!args) return undefined
  return JSON.stringify({
    activityId: String(args.activityId || '').trim() || undefined,
    autoTaskList: true,
    useAppToken: false,
  })
}

function encodeRefreshAndSignParams(args: CreateTaskArgs): string | undefined {
  if (args.type !== 'refresh_and_sign') return args.sspid?.trim() || undefined
  return JSON.stringify({
    sspid: args.sspid?.trim() || undefined,
    forceDaily: args.forceDaily === true,
    wedRecharge: args.wedRecharge ? JSON.parse(encodeWedRechargeParams(args.wedRecharge) || '{}') : undefined,
  })
}

function parseRefreshAndSignParams(text?: string | null): {
  sspid?: string
  forceDaily: boolean
  wedRecharge: ReturnType<typeof parseWedRechargeParams>
} {
  const fallbackWed = parseWedRechargeParams(null)
  const trimmed = String(text || '').trim()
  if (!trimmed) return { forceDaily: false, wedRecharge: fallbackWed }
  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>
    return {
      sspid: typeof parsed.sspid === 'string' && parsed.sspid.trim() ? parsed.sspid.trim() : undefined,
      forceDaily: parsed.forceDaily === true,
      wedRecharge: parseWedRechargeParams(JSON.stringify(parsed.wedRecharge || {})),
    }
  } catch {
    return { sspid: trimmed, forceDaily: false, wedRecharge: fallbackWed }
  }
}

function parseWedRechargeParams(text?: string | null): {
  activityId?: string
  autoTaskList: boolean
} {
  if (!text) return { autoTaskList: true }
  try {
    const parsed = JSON.parse(text) as Record<string, unknown>
    return {
      activityId:
        typeof parsed.activityId === 'string' && parsed.activityId.trim()
          ? parsed.activityId.trim()
          : undefined,
      autoTaskList: true,
    }
  } catch {
    return { autoTaskList: true }
  }
}

function parseCmccAutoCheckinTaskParams(text?: string | null): CmccAutoCheckinParams {
  return parseCmccAutoCheckinParams(text)
}

function summarizeBatchTaskItems(items: BatchTaskItem[]): {
  completed: number
  success: number
  failed: number
  skipped: number
} {
  let completed = 0
  let success = 0
  let failed = 0
  let skipped = 0
  for (const item of items) {
    if (item.status === 'success') {
      completed += 1
      success += 1
    } else if (item.status === 'failed') {
      completed += 1
      failed += 1
    } else if (item.status === 'skipped') {
      completed += 1
      skipped += 1
    }
  }
  return { completed, success, failed, skipped }
}

function computeFinalTaskStatusFromCounts(args: {
  total: number
  success: number
  failed: number
  skipped: number
}): BatchTaskStatus {
  if (args.total <= 0) return 'success'
  if (args.success === args.total && args.failed === 0 && args.skipped === 0) {
    return 'success'
  }
  if (args.success === 0 && args.skipped === 0 && args.failed > 0) {
    return 'failed'
  }
  if (args.success === 0 && args.failed === 0 && args.skipped > 0) {
    return 'failed'
  }
  return 'partial_success'
}

async function finalizeStaleActiveTasks(): Promise<void> {
  const prisma = getPrisma()
  const staleBefore = new Date(Date.now() - getBatchTaskStaleSeconds() * 1000)
  const tasks = await prisma.batchTask.findMany({
    where: {
      status: { in: ['pending', 'running'] },
      updatedAt: { lt: staleBefore },
    },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
  for (const task of tasks) {
    if (activeRunners.has(task.id)) continue
    const unfinished = task.items.filter(
      (item) => item.status === 'pending' || item.status === 'running',
    )
    const reason =
      unfinished.length > 0
        ? '任务执行进程中断，未完成项已终止'
        : '任务状态未收尾，已自动校正'
    await prisma.$transaction(async (tx) => {
      if (unfinished.length > 0) {
        await tx.batchTaskItem.updateMany({
          where: {
            taskId: task.id,
            status: { in: ['pending', 'running'] },
          },
          data: {
            status: 'skipped',
            message: reason,
            finishedAt: new Date(),
          },
        })
      }
      const refreshed = await tx.batchTask.findUnique({
        where: { id: task.id },
        include: { items: true },
      })
      if (!refreshed) return
      const counts = summarizeBatchTaskItems(refreshed.items)
      const finalStatus = computeFinalTaskStatusFromCounts({
        total: refreshed.totalCount,
        success: counts.success,
        failed: counts.failed,
        skipped: counts.skipped,
      })
      await tx.batchTask.update({
        where: { id: task.id },
        data: {
          status: finalStatus,
          completedCount: counts.completed,
          successCount: counts.success,
          failedCount: counts.failed,
          skippedCount: counts.skipped,
          currentLabel: null,
          finishedAt: new Date(),
          message: reason,
        },
      })
    })
  }
}

function parseActivationPayload(text: string): Record<string, unknown> | undefined {
  if (!text) return undefined
  try {
    const parsed = JSON.parse(text) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return undefined
    return parsed as Record<string, unknown>
  } catch {
    return undefined
  }
}

function computeActivationCookieValidity(
  payload?: Record<string, unknown>,
): boolean | null {
  if (!payload) return null
  const status = payload.status
  const resultStatus =
    payload.resultStatus && typeof payload.resultStatus === 'object'
      ? (payload.resultStatus as Record<string, unknown>).resultCode
      : undefined
  const dataResult =
    payload.data && typeof payload.data === 'object'
      ? (payload.data as Record<string, unknown>).resultCode
      : undefined
  const statusOk = status === 0 || status === '0'
  const resultOk = resultStatus === 0 || resultStatus === '0'
  const dataOk = dataResult === '0000'
  if (statusOk || resultOk || dataOk) return true
  const statusKnown =
    status !== undefined || resultStatus !== undefined || dataResult !== undefined
  return statusKnown ? false : null
}

function shouldPersistInvalidFromActivateFailure(args: {
  status?: string | number
  message?: string
}): boolean {
  const statusNum =
    typeof args.status === 'number'
      ? args.status
      : Number.parseInt(String(args.status || ''), 10)
  if (Number.isFinite(statusNum) && [401, 403, 410].includes(statusNum)) {
    return true
  }
  const text = String(args.message || '').toLowerCase()
  if (!text) return false
  return (
    text.includes('csrf') ||
    text.includes('cookie') ||
    text.includes('失效') ||
    text.includes('未登录') ||
    text.includes('登录态') ||
    text.includes('鉴权') ||
    text.includes('newhome 未返回 csrf-token')
  )
}

type TaskSummaryItem = Pick<
  BatchTaskItem,
  'id' | 'accountId' | 'accountLabel' | 'orderIndex' | 'status' | 'startedAt' | 'finishedAt'
> & Partial<Pick<BatchTaskItem, 'message'>>

function toTaskSummary(
  task: BatchTask & { items: TaskSummaryItem[] },
): BatchTaskSummary {
  return {
    id: task.id,
    type: task.type as BatchTaskType,
    scopeType: task.scopeType as BatchTaskScopeType,
    scopeId: task.scopeId ?? undefined,
    source: task.source,
    scheduleId: task.scheduleId ?? undefined,
    status: task.status as BatchTaskStatus,
    sspid: task.sspid ?? undefined,
    timezone: task.timezone ?? undefined,
    totalCount: task.totalCount,
    completedCount: task.completedCount,
    successCount: task.successCount,
    failedCount: task.failedCount,
    skippedCount: task.skippedCount,
    currentLabel: task.currentLabel ?? undefined,
    message: task.message ?? undefined,
    startedAt: task.startedAt?.toISOString(),
    finishedAt: task.finishedAt?.toISOString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    items: [...task.items]
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((item) => ({
        id: item.id,
        accountId: item.accountId,
        accountLabel: item.accountLabel ?? undefined,
        orderIndex: item.orderIndex,
        status: item.status as BatchTaskItemStatus,
        message: item.message ?? undefined,
        startedAt: item.startedAt?.toISOString(),
        finishedAt: item.finishedAt?.toISOString(),
      })),
  }
}

function toScheduleSummary(schedule: TaskSchedule): TaskScheduleSummary {
  return {
    id: schedule.id,
    name: schedule.name,
    enabled: schedule.enabled,
    scopeType: schedule.scopeType as BatchTaskScopeType,
    scopeId: schedule.scopeId ?? undefined,
    action: schedule.action as BatchTaskType,
    timezone: schedule.timezone,
    sspid: schedule.sspid ?? undefined,
    times: parseTimesJson(schedule.timesJson),
    lastTriggeredAt: schedule.lastTriggeredAt?.toISOString(),
    createdAt: schedule.createdAt.toISOString(),
    updatedAt: schedule.updatedAt.toISOString(),
  }
}

async function resolveScopeAccounts(args: {
  type: BatchTaskType
  scopeType: BatchTaskScopeType
  scopeId?: string
  accountIds?: string[]
}): Promise<AccountRecord[]> {
  const accounts = await listAccounts()
  const filterRunnable = (items: AccountRecord[]): AccountRecord[] => {
    if (args.type === 'global_telecom_resign' || args.type === 'global_telecom_daily') {
      return items.filter((item) => !item.disabledAt && Boolean(item.cookie || item.qqtAccessToken || item.yunpanSession))
    }
    if (
      args.type === 'refresh' ||
      args.type === 'query_info' ||
      args.type === 'yunpan_activate' ||
      args.type === 'ck_maintenance' ||
      args.type === 'wed_recharge' ||
      args.type === 'activity_session_refresh' ||
      args.type === 'cmcc_session_exchange' ||
      args.type === 'keepalive'
    ) {
      return items.filter((item) => Boolean(item.cookie || item.yunpanSession))
    }
    if (args.type === 'sign' || args.type === 'refresh_and_sign') {
      return items.filter((item) => Boolean(item.cookie || item.qqtAccessToken || item.yunpanSession))
    }
    return items
  }
  if (args.scopeType === 'admin_all') {
    return filterRunnable(accounts)
  }
  if (args.scopeType === 'account') {
    const accountId = String(args.scopeId || '').trim()
    if (!accountId) return []
    return filterRunnable(accounts.filter((item) => item.id === accountId))
  }
  if (args.scopeType === 'selected_accounts') {
    const accountIds = normalizeAccountIds(args.accountIds)
    if (accountIds.length === 0) return []
    const accountSet = new Set(accountIds)
    return filterRunnable(accounts.filter((item) => accountSet.has(item.id)))
  }
  if (args.scopeType === 'user') {
    const userId = String(args.scopeId || '').trim()
    if (!userId) return []
    const summaries = await listUserAccountSummaries(userId)
    const records: AccountRecord[] = []
    for (const summary of summaries) {
      const rec = await getAccountById(summary.id)
      if (rec && !rec.disabledAt) records.push(rec)
    }
    return filterRunnable(records)
  }
  const linkId = String(args.scopeId || '').trim()
  if (!linkId) return []
  const link = await getPublicLink(linkId)
  if (!link) return []
  const accountSet = new Set(link.accountIds)
  return filterRunnable(accounts.filter((item) => accountSet.has(item.id)))
}

async function prepareWedRechargeCookieForRecord(rec: AccountRecord): Promise<string> {
  if (!rec.cookie) throw new Error('暂无 CK，无法执行周三拼图')
  const session = await prepareWedRechargeSession({
    cookie: rec.cookie,
    forceRefresh: true,
  })
  if (session.updated && session.cookie !== rec.cookie) {
    await setAccountWedRechargeCookie({ id: rec.id, cookie: session.cookie })
  }
  return session.cookie
}

async function ensureFreshCookie(args: {
  rec: AccountRecord
  allowRecentSkip?: boolean
}): Promise<{ ok: boolean; cookie?: string; message: string }> {
  const windowMin = getValidityWindowMin()
  const usable = await ensureUsable10086Cookie({
    rec: args.rec,
    allowRecentSkip: args.allowRecentSkip,
    windowMin,
    clearOnYunpanFailure: false,
    preferYunpan: shouldRecover10086CookieByYunpan(args.rec),
  })
  if (!usable.ok || !usable.cookie) {
    return {
      ok: false,
      message: shouldRecover10086CookieByYunpan(args.rec)
        ? usable.message || '云盘会话已失效，请重新登录'
        : usable.message || 'CK 已失效',
    }
  }
  return {
    ok: true,
    cookie: usable.cookie,
    message: usable.message || (usable.recoveredByYunpan ? '云盘已换取 10086 CK' : 'CK 校验通过'),
  }
}

async function ensureActivatedCookie(
  rec: AccountRecord,
): Promise<{ ok: boolean; cookie?: string; message: string }> {
  let activeRec = rec
  let cookie = rec.cookie
  if (!cookie) {
    if (!shouldRecover10086CookieByYunpan(rec)) {
      return { ok: false, message: '暂无 10086 CK，请使用 10086 验证码登录' }
    }
    const recovered = await recover10086CookieByYunpan({
      rec,
      reason: '暂无 CK',
      clearOnYunpanFailure: false,
    })
    if (!recovered.ok || !recovered.cookie) {
      return {
        ok: false,
        message: rec.yunpanSession
          ? recovered.message || '云盘会话已失效，请重新登录'
          : recovered.message || '暂无 CK',
      }
    }
    cookie = recovered.cookie
    activeRec = (await getAccountById(rec.id)) ?? rec
  }
  let activated = await cmccActivateFareBalance(
    cookie,
    rec.requestHeaders,
    rec.newHomeUrl,
  )
  if (!activated.ok || !activated.encrypted || typeof activated.decrypted !== 'string') {
    if (
      shouldRecover10086CookieByYunpan(activeRec) &&
      shouldPersistInvalidFromActivateFailure({
        status: activated.status,
        message: activated.message,
      })
    ) {
      const recovered = await recover10086CookieByYunpan({
        rec: activeRec,
        reason: activated.message || 'CK 已失效',
        clearOnYunpanFailure: false,
      })
      if (!recovered.ok || !recovered.cookie) {
        return {
          ok: false,
          message: rec.yunpanSession
            ? recovered.message || '云盘会话已失效，请重新登录'
            : recovered.message || activated.message || 'CK 已失效，请重新登录',
        }
      }
      activeRec = (await getAccountById(rec.id)) ?? activeRec
      cookie = recovered.cookie
      activated = await cmccActivateFareBalance(
        cookie,
        activeRec.requestHeaders,
        activeRec.newHomeUrl,
      )
      if (!activated.ok || !activated.encrypted || typeof activated.decrypted !== 'string') {
        return { ok: false, message: activated.message || '云盘已换取 10086 CK，但激活仍失败' }
      }
    } else {
      return { ok: false, message: activated.message || '激活 CK 失败' }
    }
  }
  if (activated.cookie && activated.cookieUpdated) {
    await setAccountCookie({ id: rec.id, cookie: activated.cookie })
    cookie = activated.cookie
  }
  const activationInfo = parseActivationPayload(activated.decrypted)
  if (activationInfo) {
    await setAccountActivationInfo({ id: rec.id, activationInfo })
    if (computeActivationCookieValidity(activationInfo) === false) {
      if (!shouldRecover10086CookieByYunpan((await getAccountById(rec.id)) ?? activeRec)) {
        return { ok: false, message: '激活结果显示 10086 CK 已失效，请重新登录' }
      }
      const recovered = await recover10086CookieByYunpan({
        rec: (await getAccountById(rec.id)) ?? activeRec,
        reason: '激活结果显示 CK 已失效',
        clearOnYunpanFailure: false,
      })
      if (!recovered.ok || !recovered.cookie) {
        return {
          ok: false,
          message: rec.yunpanSession
            ? recovered.message || '云盘会话已失效，请重新登录'
            : recovered.message || 'CK 已失效，请重新登录',
        }
      }
      activeRec = (await getAccountById(rec.id)) ?? activeRec
      const retry = await cmccActivateFareBalance(
        recovered.cookie,
        activeRec.requestHeaders,
        activeRec.newHomeUrl,
      )
      if (!retry.ok || !retry.encrypted || typeof retry.decrypted !== 'string') {
        return { ok: false, message: retry.message || '云盘已换取 10086 CK，但激活仍失败' }
      }
      const retryActivationInfo = parseActivationPayload(retry.decrypted)
      if (retryActivationInfo) {
        await setAccountActivationInfo({ id: rec.id, activationInfo: retryActivationInfo })
      }
      if (computeActivationCookieValidity(retryActivationInfo) === false) {
        return { ok: false, message: '云盘已换取 10086 CK，但激活仍显示 CK 失效' }
      }
      activated = retry
      cookie = retry.cookie || recovered.cookie
    }
  }
  return {
    ok: true,
    cookie: activated.cookie || cookie,
    message: activated.cookieUpdated ? 'CK 激活通过并已更新' : 'CK 激活通过',
  }
}

async function ensureQqtToken(args: {
  rec: AccountRecord
  sspid?: string
  allowRecentSkip?: boolean
  skipCookieRefresh?: boolean
  cookie?: string
}): Promise<{ ok: boolean; accessToken?: string; cookie?: string; message: string }> {
  const windowMin = getValidityWindowMin()
  let latest = args.rec
  if (latest.yunpanSession) {
    try {
      latest = await ensureYunpanGlobalToken(latest, args.allowRecentSkip === false)
      return { ok: true, accessToken: latest.qqtAccessToken, cookie: '', message: '全球通 Token 已就绪' }
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : '云盘全球通置换失败' }
    }
  }
  let cmccCookie = args.cookie || latest.cookie
  if (!cmccCookie && latest.yunpanSession) {
    const refreshed = await ensureFreshCookie({ rec: latest, allowRecentSkip: false })
    if (!refreshed.ok || !refreshed.cookie) {
      return { ok: false, message: refreshed.message }
    }
    cmccCookie = refreshed.cookie
    latest = (await getAccountById(latest.id)) ?? latest
  }
  if (!cmccCookie && latest.qqtAccessToken) {
    return {
      ok: true,
      accessToken: latest.qqtAccessToken,
      cookie: cmccCookie,
      message: '暂无 CK，沿用缓存 Token',
    }
  }
  if (!args.skipCookieRefresh && (cmccCookie || latest.yunpanSession)) {
    const refreshed = await ensureFreshCookie({ rec: latest, allowRecentSkip: args.allowRecentSkip })
    if (!refreshed.ok || !refreshed.cookie) {
      return { ok: false, message: refreshed.message }
    }
    cmccCookie = refreshed.cookie
    latest = (await getAccountById(latest.id)) ?? latest
  }
  if (
    args.allowRecentSkip !== false &&
    latest.qqtAccessToken &&
    isWithinWindow(latest.qqtAccessTokenCheckedAt, windowMin)
  ) {
    return {
      ok: true,
      accessToken: latest.qqtAccessToken,
      cookie: cmccCookie,
      message: 'Token 仍在有效窗口，已跳过',
    }
  }
  if (!cmccCookie) {
    return { ok: false, message: '暂无 CK，无法刷新 Token' }
  }
  const tokenResult = await qqtReplaceToken({
    cmccCookie,
    requestHeaders: latest.requestHeaders,
  })
  if (!tokenResult.ok || !tokenResult.accessToken) {
    return {
      ok: false,
      message: tokenResult.message || 'Token 刷新失败',
    }
  }
  await setAccountQqtToken({ id: latest.id, qqtAccessToken: tokenResult.accessToken })
  await touchAccountQqtTokenCheckedAt({ id: latest.id })
  const userInfo =
    tokenResult.userInfo && typeof tokenResult.userInfo === 'object'
      ? (tokenResult.userInfo as Record<string, unknown>)
      : undefined
  const userInfoData =
    userInfo && typeof userInfo.data === 'object'
      ? (userInfo.data as Record<string, unknown>)
      : undefined
  const displayPhone =
    userInfoData && typeof userInfoData.phone === 'string'
      ? userInfoData.phone.trim()
      : userInfo && typeof userInfo.phone === 'string'
        ? userInfo.phone.trim()
        : ''
  if (displayPhone) {
    try {
      await setAccountDisplayPhone({ id: latest.id, displayPhone })
    } catch {
      // ignore invalid display
    }
  }
  if (userInfo) {
    await setAccountQqtInfo({ id: latest.id, qqtInfo: userInfo })
  }
  return {
    ok: true,
    accessToken: tokenResult.accessToken,
    cookie: cmccCookie,
    message: 'Token 已刷新',
  }
}

async function executeRefresh(
  accountId: string,
  opts?: { skipQqtToken?: boolean; forceDaily?: boolean },
): Promise<ExecuteResult> {
  return await withKeyLock(`account:${accountId}`, async () => {
    const dailySkip = await skipIfDailyDone({
      accountId,
      taskType: opts?.skipQqtToken ? 'refresh_cookie' : 'qqt_token',
      force: opts?.forceDaily,
    })
    if (dailySkip) return { status: 'skipped', message: dailySkip }
    await markDaily({
      accountId,
      taskType: opts?.skipQqtToken ? 'refresh_cookie' : 'qqt_token',
      status: 'running',
      message: '刷新任务执行中',
    })
    const rec = await getAccountById(accountId)
    if (!rec) {
      return { status: 'failed', message: '账号不存在' }
    }
    if (rec.yunpanSession && !opts?.skipQqtToken) {
      const result = await ensureQqtToken({ rec, allowRecentSkip: false })
      await markDaily({ accountId, taskType: 'qqt_token', status: result.ok ? 'success' : 'failed', message: result.message })
      return { status: result.ok ? 'success' : 'failed', message: result.message }
    }
    if (!rec.cookie && !shouldRecover10086CookieByYunpan(rec)) {
      if (rec.qqtAccessToken) {
        return { status: 'skipped', message: '暂无 CK，沿用缓存 Token' }
      }
      return { status: 'failed', message: '暂无 CK' }
    }
    const activated = await ensureActivatedCookie(rec)
    if (!activated.ok || !activated.cookie) {
      return { status: 'failed', message: activated.message }
    }
    const recAfterActivate =
      (await getAccountById(accountId)) ??
      ({
        ...rec,
        cookie: activated.cookie,
      } as AccountRecord)
    const refreshed = await ensureFreshCookie({ rec: recAfterActivate })
    if (!refreshed.ok) {
      await markDaily({
        accountId,
        taskType: opts?.skipQqtToken ? 'refresh_cookie' : 'qqt_token',
        status: 'failed',
        message: refreshed.message,
      })
      return { status: 'failed', message: refreshed.message }
    }
    if (opts?.skipQqtToken) {
      await markDaily({
        accountId,
        taskType: 'refresh_cookie',
        status: 'success',
        message: refreshed.message,
      })
      return {
        status: 'success',
        message: `${refreshed.message}，非全球通用户跳过 Token 刷新`,
      }
    }
    // Refresh workflow must keep token aligned with the latest CK refresh.
    const token = await ensureQqtToken({
      rec: (await getAccountById(accountId)) ?? rec,
      allowRecentSkip: false,
      skipCookieRefresh: true,
      cookie: refreshed.cookie || activated.cookie,
    })
    if (!token.ok) {
      await markDaily({
        accountId,
        taskType: 'qqt_token',
        status: 'failed',
        message: `${refreshed.message}，${token.message}`,
      })
      return { status: 'failed', message: `${refreshed.message}，${token.message}` }
    }
    await markDaily({
      accountId,
      taskType: 'refresh_cookie',
      status: 'success',
      message: refreshed.message,
    })
    await markDaily({
      accountId,
      taskType: 'qqt_token',
      status: 'success',
      message: token.message,
    })
    return {
      status: 'success',
      message: `${refreshed.message}，${token.message}`,
    }
  })
}

async function executeSign(
  accountId: string,
  sspid: string,
  timezone = 'Asia/Shanghai',
  opts?: { forceTokenRefresh?: boolean; forceDaily?: boolean },
): Promise<ExecuteResult> {
  return await withKeyLock(`account:${accountId}`, async () => {
    const dailySkip = await skipIfDailyDone({
      accountId,
      taskType: 'qqt_sign',
      force: opts?.forceDaily,
    })
    if (dailySkip) return { status: 'skipped', message: dailySkip }
    const rec = await getAccountById(accountId)
    if (!rec) {
      return { status: 'failed', message: '账号不存在' }
    }
    void timezone
    await markDaily({
      accountId,
      taskType: 'qqt_sign',
      status: 'running',
      message: '全球通签到执行中',
    })
    const token = await ensureQqtToken({
      rec,
      sspid,
      allowRecentSkip: opts?.forceTokenRefresh === true ? false : true,
    })
    if (!token.ok || !token.accessToken) {
      await markDaily({
        accountId,
        taskType: 'qqt_sign',
        status: 'failed',
        message: token.message || '无法获取 Token',
      })
      return { status: 'failed', message: token.message || '无法获取 Token' }
    }
    const latest = (await getAccountById(accountId)) ?? rec
    const signResp = await qqtSign({
      cmccCookie: latest.yunpanSession ? '' : token.cookie || latest.cookie || '',
      requestHeaders: latest.requestHeaders,
      sspid,
      accessToken: token.accessToken,
    })
    if (!signResp.ok || !signResp.result || !signResp.accessToken) {
      await markDaily({
        accountId,
        taskType: 'qqt_sign',
        status: 'failed',
        message: signResp.message || '签到失败',
      })
      return {
        status: 'failed',
        message: signResp.message || '签到失败',
      }
    }
    await setAccountQqtToken({ id: accountId, qqtAccessToken: signResp.accessToken })
    const signInfo =
      signResp.signInfo && typeof signResp.signInfo === 'object'
        ? (signResp.signInfo as Record<string, unknown>)
        : undefined
    const signResult =
      signResp.result && typeof signResp.result === 'object'
        ? (signResp.result as Record<string, unknown>)
        : undefined
    if (signInfo || signResult) {
      await setAccountQqtSignState({
        id: accountId,
        signInfo,
        signResult,
      })
    }
    const message = parseSignMessage(signResp.result)
    invalidateGlobalTelecomOverview(accountId)
    await markDaily({
      accountId,
      taskType: 'qqt_sign',
      status: 'success',
      message,
    })
    return {
      status: 'success',
      message,
    }
  })
}

async function executeQueryInfo(accountId: string): Promise<ExecuteResult> {
  return await withKeyLock(`account:${accountId}`, async () => {
    const rec = await getAccountById(accountId)
    if (!rec) return { status: 'failed', message: '账号不存在' }
    if (!rec.cookie) return { status: 'failed', message: '暂无 CK，无法查询信息' }
    const activated = await ensureActivatedCookie(rec)
    if (!activated.ok || !activated.cookie) {
      return { status: 'failed', message: activated.message }
    }
    const latest =
      (await getAccountById(accountId)) ??
      ({
        ...rec,
        cookie: activated.cookie,
      } as AccountRecord)
    const token = await ensureQqtToken({
      rec: latest,
      allowRecentSkip: false,
      skipCookieRefresh: true,
      cookie: activated.cookie,
    })
    if (!token.ok) {
      return { status: 'failed', message: `${activated.message}，${token.message}` }
    }
    const profile = await refreshCmccAccountProfile({
      accountId,
      cookie: token.cookie || activated.cookie,
      phone: latest.phone,
    })
    return {
      status: 'success',
      message: `${activated.message}，${token.message}，${profile.message}`,
    }
  })
}

async function executeYunpanActivate(accountId: string): Promise<ExecuteResult> {
  return await withKeyLock(`account:${accountId}`, async () => {
    const rec = await getAccountById(accountId)
    if (!rec) return { status: 'failed', message: '账号不存在' }
    if (rec.disabledAt) return { status: 'skipped', message: '账号已禁用' }
    if (!rec.yunpanSession) return { status: 'skipped', message: '非云盘登录账号，已跳过' }
    const result = await ensureQqtToken({ rec, allowRecentSkip: false })
    return { status: result.ok ? 'success' : 'failed', message: result.message }
  })
}

async function executeCookieMaintenance(accountId: string): Promise<ExecuteResult> {
  return await withKeyLock(`account:${accountId}`, async () => {
    const rec = await getAccountById(accountId)
    if (!rec) return { status: 'failed', message: '账号不存在' }
    if (rec.disabledAt) return { status: 'skipped', message: '账号已禁用，已跳过' }
    return maintainCredentialChannels({
      hasYunpan: Boolean(rec.yunpanSession),
      maintainYunpan: async () => {
        const result = await ensureQqtToken({ rec, allowRecentSkip: false })
        if (result.ok) return { status: 'success', message: '云盘 CK 有效，全球通 Token 已维护' }
        const latest = await getAccountById(accountId)
        if (latest?.yunpanSession?.checkedAt && !latest.yunpanSession.invalidAt &&
            latest.yunpanSession.checkedAt !== rec.yunpanSession?.checkedAt) {
          return { status: 'success', message: `云盘 CK 有效，全球通渠道维护未完成：${result.message}` }
        }
        return { status: 'failed', message: `云盘 CK 维护失败：${result.message}` }
      },
      maintain10086: async () => maintain10086Channels((await getAccountById(accountId)) ?? rec),
    })
  })
}

async function maintain10086Channels(rec: AccountRecord): Promise<CredentialMaintenanceResult> {
    const accountId = rec.id
    if (!rec.cookie && !shouldRecover10086CookieByYunpan(rec)) {
      return { status: 'skipped', message: '10086 CK 未保存，已跳过该渠道' }
    }
    let latest = rec
    let activationMessage = ''
    const dueForCookieRefresh = isAccountDueForCookieMaintenance(rec)
    let cookie = latest.cookie || ''
    let cookieMessage = 'CK 最近已刷新，已跳过刷新'
    if (dueForCookieRefresh) {
      if (!activationMessage) {
        const activated = await ensureActivatedCookie(latest)
        if (!activated.ok || !activated.cookie) {
          return { status: 'failed', message: activated.message }
        }
        activationMessage = activated.message
        latest = (await getAccountById(accountId)) ?? latest
      }
      const refreshed = await ensureFreshCookie({
        rec: latest,
        allowRecentSkip: false,
      })
      if (!refreshed.ok || !refreshed.cookie) {
        return { status: 'failed', message: `${activationMessage}，${refreshed.message}` }
      }
      cookie = refreshed.cookie
      cookieMessage = refreshed.message
    }
    if (!cookie) return { status: 'failed', message: '暂无 CK，无法维护全球通状态' }

    const accountProfile = await refreshCmccAccountProfile({
      accountId,
      cookie,
      phone: latest.phone,
    })
    latest = (await getAccountById(accountId)) ?? latest
    const qqtState = await refreshMaintenanceQqtState({
      rec: latest,
      cookie,
      sspid: process.env.DEFAULT_QQT_SSPID || process.env.QQT_SSPID || '75442',
      profileLevelName: accountProfile.profile?.levelName,
    })
    return {
      status: qqtState.ok ? 'success' : 'failed',
      message: [activationMessage, cookieMessage, accountProfile.message, qqtState.message]
        .filter(Boolean)
        .join('，'),
    }
}

async function executeActivitySessionRefresh(accountId: string): Promise<ExecuteResult> {
  return await withKeyLock(`account:${accountId}`, async () => {
    const rec = await getAccountById(accountId)
    if (!rec) return { status: 'failed', message: '账号不存在' }
    const usable = await ensureFreshCookie({ rec, allowRecentSkip: false })
    if (!usable.ok || !usable.cookie) return { status: 'failed', message: usable.message || '暂无 CK，无法续期活动会话' }
      const refreshed = await refreshHlwhdActivitySession({ cookie: usable.cookie })
      if (!refreshed.ok || !refreshed.cookie) {
        return { status: 'failed', message: refreshed.message || '活动 CK 续期失败' }
      }
      if (refreshed.cookieUpdated) {
        await setAccountWedRechargeCookie({ id: rec.id, cookie: refreshed.cookie })
      }
      const fields = refreshed.fields?.length ? `，字段 ${refreshed.fields.join(', ')}` : ''
    return {
      status: 'success',
      message: refreshed.cookieUpdated ? `活动 CK 已临时续期${fields}` : `活动 CK 已确认${fields}`,
    }
  })
}

async function executeCmccSessionExchange(accountId: string): Promise<ExecuteResult> {
  return await withKeyLock(`account:${accountId}`, async () => {
    const rec = await getAccountById(accountId)
    if (!rec) return { status: 'failed', message: '账号不存在' }
    const usable = await ensureFreshCookie({ rec, allowRecentSkip: false })
    if (!usable.ok || !usable.cookie) return { status: 'failed', message: usable.message || '暂无 CK，无法置换 CMCC 会话' }
      const exchanged = await exchange10086CookieToCmccApp({ cookie: usable.cookie })
      if (!exchanged.ok || !exchanged.cookie) {
        return { status: 'failed', message: exchanged.message || 'CMCC CK 置换失败' }
      }
      if (exchanged.cookieUpdated) {
        await setAccountCmccAppCookie({ id: rec.id, cookie: exchanged.cookie })
      }
    const fields = exchanged.fields?.length ? `，字段 ${exchanged.fields.join(', ')}` : ''
    return {
      status: 'success',
      message: exchanged.cookieUpdated ? `CMCC CK 已置换${fields}` : `CMCC CK 已确认${fields}`,
    }
  })
}

async function executeKeepalive(accountId: string): Promise<ExecuteResult> {
  return await withKeyLock(`account:${accountId}`, async () => {
    let rec = await getAccountById(accountId)
    if (!rec) return { status: 'failed', message: '账号不存在' }
    if (!rec.cookie || shouldRecover10086CookieByYunpan(rec)) {
      const usable = await ensureFreshCookie({ rec, allowRecentSkip: false })
      if (!usable.ok || !usable.cookie) return { status: 'failed', message: usable.message || '暂无 CK，无法保活' }
      rec = (await getAccountById(accountId)) ?? { ...rec, cookie: usable.cookie }
    }

    const now = Date.now()
      const capability = inspectSessionCapabilities(rec.cookie)
    const cookieAgeMin = rec.cookieCheckedAt ? Math.floor((now - Date.parse(rec.cookieCheckedAt)) / 60_000) : Infinity
    const cookieNeedsRefresh = cookieAgeMin >= 24 * 60
    const activityMissing = !capability.groups.activity
    const activityNeedsRefresh = activityMissing || cookieAgeMin >= 36 * 60
    const cmccMissing = !capability.groups.pcSso || !capability.groups.cmccApp

    const details: string[] = [capability.summary]

    let cookie = rec.cookie
    if (cookieNeedsRefresh) {
      const refreshed = await cmccRefreshCookieByHome(cookie, rec.requestHeaders, rec.newHomeUrl)
      if (!refreshed.ok || !refreshed.cookie) {
        return { status: 'failed', message: refreshed.message || '基础 CK 刷新失败' }
      }
      cookie = refreshed.cookie
      if (refreshed.cookieUpdated) {
        await setAccountCookie({ id: rec.id, cookie })
        details.push('基础 CK 已刷新')
      } else {
        await touchAccountCookieCheckedAt({ id: rec.id })
        details.push('基础 CK 已确认')
      }
    } else {
      details.push('基础 CK 跳过')
    }

      if (activityNeedsRefresh) {
        const refreshed = await refreshHlwhdActivitySession({ cookie: rec.wedRechargeCookie || cookie })
        if (!refreshed.ok || !refreshed.cookie) {
          return { status: 'failed', message: refreshed.message || '活动 CK 续期失败' }
        }
        if (refreshed.cookieUpdated) {
          await setAccountWedRechargeCookie({ id: rec.id, cookie: refreshed.cookie })
        }
        details.push(refreshed.cookieUpdated ? '活动 CK 已临时续期' : '活动 CK 已确认')
    } else {
      details.push('活动 CK 跳过')
    }

      if (cmccMissing && cookieNeedsRefresh) {
        const exchanged = await exchange10086CookieToCmccApp({ cookie })
        if (exchanged.ok && exchanged.cookie) {
          if (exchanged.cookieUpdated) {
            await setAccountCmccAppCookie({ id: rec.id, cookie: exchanged.cookie })
          }
        details.push(exchanged.cookieUpdated ? 'CMCC CK 已置换' : 'CMCC CK 已确认')
      } else {
        details.push('CMCC CK 未置换')
      }
    } else {
      details.push('CMCC CK 跳过')
    }

    return {
      status: 'success',
      message: details.join('，'),
    }
  })
}

function formatCmccAutoCheckinMessage(result: Awaited<ReturnType<typeof executeCmccAutoCheckin>>): string {
  const detail = result.operationResults
    .map((item) => `${item.operation}:${item.status}（${item.message.split(/\r?\n/, 1)[0].slice(0, 180)}）`)
    .join('；')
  return detail ? `${result.message}\n${detail}` : result.message
}

async function executeCmccAutoCheckinTask(
  accountId: string,
  taskParams: CmccAutoCheckinParams,
  onProgress?: (message: string) => Promise<void> | void,
): Promise<ExecuteResult> {
  return await withKeyLock(`account:${accountId}`, async () => {
    const account = await getAccountById(accountId)
    if (!account) return { status: 'failed', message: '账号不存在' }
    if (!account.cmccAppCookie && !account.wedRechargeCookie) {
      return { status: 'failed', message: '缺少 CMCC App 或活动凭据，无法执行移动活动自动化' }
    }
    const result = await executeCmccAutoCheckin({
      account,
      params: taskParams,
      onProgress: (message) => {
        void onProgress?.(message)
      },
    })
    return {
      status: result.status,
      message: formatCmccAutoCheckinMessage(result),
    }
  })
}

async function updateTaskItemProgress(itemId: string, message: string): Promise<void> {
  const prisma = getPrisma()
  await prisma.batchTaskItem
    .update({
      where: { id: itemId },
      data: { message },
    })
    .catch(() => undefined)
}

function isNonQqtAccount(rec: AccountRecord): boolean {
  const membership = asRecord(rec.qqtInfo?.globalTelecomMembership)
  if (membership?.state === 'global') return false
  if (membership?.state === 'non_global') return true
  if (membership?.state === 'unknown') return false
  const currentInfo = rec.qqtInfo
  const source = currentInfo
    ? [currentInfo]
    : [rec.qqtSignInfo, rec.qqtSignResult].filter(Boolean)
  const text = JSON.stringify(source)
  return /非全球通|不是全球通|非全球通用户|未开通全球通/.test(text)
}

async function refreshMaintenanceQqtState(args: {
  rec: AccountRecord
  cookie: string
  sspid: string
  profileLevelName?: string
}): Promise<{ ok: boolean; message: string }> {
  const profileMembership = classifyQqtMembership({ levelName: args.profileLevelName })
  const persistUnconfirmedState = async (message: string): Promise<{ ok: false; message: string }> => {
    const state: QqtMembershipState = profileMembership === 'global' ? 'global' : 'unknown'
    await setAccountQqtInfo({
      id: args.rec.id,
      qqtInfo: {
        globalTelecomMembership: {
          state,
          signState: 'unknown',
          checkedAt: new Date().toISOString(),
          source: 'ck_maintenance_failed',
        },
      },
    })
    await setDailyTaskState({
      accountId: args.rec.id,
      taskType: 'qqt_sign',
      status: 'failed',
      source: 'ck_maintenance',
      message: state === 'global'
        ? '维护查询：已确认全球通，签到状态同步失败，下次任务将继续尝试'
        : '维护查询：全球通身份和签到状态未确认，下次任务将继续尝试',
    }).catch(() => undefined)
    invalidateGlobalTelecomOverview(args.rec.id)
    return { ok: false, message }
  }

  if (profileMembership === 'global') {
    await setAccountQqtInfo({
      id: args.rec.id,
      qqtInfo: {
        globalTelecomMembership: {
          state: 'global',
          signState: 'unknown',
          checkedAt: new Date().toISOString(),
          source: 'ck_maintenance_profile',
        },
      },
    })
    await setDailyTaskState({
      accountId: args.rec.id,
      taskType: 'qqt_sign',
      status: 'pending',
      source: 'ck_maintenance',
      message: '维护查询：基础资料已确认全球通，正在同步签到状态',
    }).catch(() => undefined)
  }

  let accessToken = args.rec.qqtAccessToken
  let tokenMessage = accessToken ? '已复用缓存 Token' : ''
  let sign = accessToken
    ? await qqtSignInfo({
        cmccCookie: args.cookie,
        requestHeaders: args.rec.requestHeaders,
        accessToken,
        sspid: args.sspid,
      }).catch(() => undefined)
    : undefined
  const cachedMembership = sign?.ok ? classifyQqtMembership(sign.info) : 'unknown'

  // A cached non-global result can belong to the pre-upgrade identity. Exchange
  // once from the latest CK before accepting it as the current membership state.
  if (!sign?.ok || !sign.info || cachedMembership === 'non_global') {
    const token = await ensureQqtToken({
      rec: (await getAccountById(args.rec.id)) ?? args.rec,
      allowRecentSkip: false,
      skipCookieRefresh: true,
      cookie: args.cookie,
    })
    if (!token.ok || !token.accessToken) {
      return persistUnconfirmedState(`全球通状态刷新失败：${token.message}`)
    }
    accessToken = token.accessToken
    tokenMessage = token.message
    sign = await qqtSignInfo({
      cmccCookie: token.cookie || args.cookie,
      requestHeaders: args.rec.requestHeaders,
      accessToken,
      sspid: args.sspid,
    }).catch(() => undefined)
  }

  if (!sign?.ok || !sign.info || !accessToken) {
    return persistUnconfirmedState(`全球通签到状态查询失败：${sign?.message || '上游请求失败'}`)
  }

  const signInfo = asRecord(sign.info)
  if (!signInfo) return persistUnconfirmedState('全球通签到状态格式异常')
  const responseMembership = classifyQqtMembership(signInfo)
  const membership: QqtMembershipState = profileMembership === 'global'
    ? 'global'
    : responseMembership
  const signState = membership === 'global' ? currentQqtSignState(signInfo) : 'unknown'
  const checkedAt = new Date().toISOString()

  await setAccountQqtToken({ id: args.rec.id, qqtAccessToken: accessToken })
  await touchAccountQqtTokenCheckedAt({ id: args.rec.id })
  await setAccountQqtSignState({ id: args.rec.id, signInfo })
  await setAccountQqtInfo({
    id: args.rec.id,
    qqtInfo: {
      globalTelecomMembership: {
        state: membership,
        signState,
        checkedAt,
        source: 'ck_maintenance',
      },
    },
  })
  invalidateGlobalTelecomOverview(args.rec.id)

  if (membership === 'global' && signState === 'signed') {
    await setDailyTaskState({
      accountId: args.rec.id,
      taskType: 'qqt_sign',
      status: 'success',
      source: 'ck_maintenance',
      message: '维护查询：今日已签到',
    }).catch(() => undefined)
  } else if (membership === 'global') {
    await setDailyTaskState({
      accountId: args.rec.id,
      taskType: 'qqt_sign',
      status: 'pending',
      source: 'ck_maintenance',
      message: signState === 'unsigned'
        ? '维护查询：今日未签到'
        : '维护查询：全球通已确认，签到状态待同步',
    }).catch(() => undefined)
  } else if (membership === 'non_global') {
    await setDailyTaskState({
      accountId: args.rec.id,
      taskType: 'qqt_sign',
      status: 'skipped',
      source: 'ck_maintenance',
      message: '维护查询：当前仍为非全球通用户',
    }).catch(() => undefined)
  } else {
    await setDailyTaskState({
      accountId: args.rec.id,
      taskType: 'qqt_sign',
      status: 'failed',
      source: 'ck_maintenance',
      message: '维护查询：全球通身份或签到状态未确认，下次任务将继续尝试',
    }).catch(() => undefined)
  }

  const membershipLabel = membership === 'global'
    ? '全球通'
    : membership === 'non_global'
      ? '非全球通'
      : '全球通状态未知'
  const signLabel = signState === 'signed'
    ? '今日已签到'
    : signState === 'unsigned'
      ? '今日未签到'
      : '签到状态待同步'
  return { ok: true, message: `${tokenMessage}，${membershipLabel}，${signLabel}` }
}

export type GlobalTelecomResignPlanItem = {
  dayNum: number
  taskIds: number[]
}

function planGlobalTelecomResignDays(
  days: GlobalTelecomDay[],
  reSignRemaining: number,
): GlobalTelecomResignPlanItem[] {
  const limit = Math.max(0, Math.floor(Number(reSignRemaining) || 0))
  if (limit === 0) return []
  return days
    .filter((day) => day.signStatus !== 1 && (day.signStatus === 2 || day.reSign === true))
    .map((day) => ({
      dayNum: day.dayNum,
      taskIds: Array.from(new Set(
        day.tasks
          .filter((task) => task.taskStatus === 0 && Number.isInteger(task.taskId) && task.taskId > 0)
          .map((task) => task.taskId),
      )),
    }))
    .filter((day) => Number.isInteger(day.dayNum) && day.dayNum > 0 && day.dayNum <= 31)
    .sort((left, right) => left.dayNum - right.dayNum)
    .slice(0, limit)
}

function planGlobalTelecomBlindBoxTasks(
  tasks: GlobalTelecomOverview['blindBox']['tasks'],
): number[] {
  return Array.from(new Set(
    tasks
      .filter((task) => !task.completed && task.available !== false && Number.isInteger(task.number) && task.number > 0)
      .map((task) => task.number),
  )).sort((left, right) => left - right)
}

async function executeGlobalTelecomResignAndBlindBox(
  accountId: string,
  itemId: string,
  sspid: string,
): Promise<ExecuteResult> {
  return await withKeyLock(`account:${accountId}`, async () => {
    const rec = await getAccountById(accountId)
    if (!rec) return { status: 'failed', message: '账号不存在' }
    if (rec.disabledAt) return { status: 'skipped', message: '账号已禁用，已跳过' }
    if (!rec.cookie && !rec.qqtAccessToken && !rec.yunpanSession) {
      return { status: 'skipped', message: '暂无可用 CK、Token 或云盘会话，已跳过' }
    }

    await updateTaskItemProgress(itemId, '正在查询星动日签到状态')
    let cookie = rec.cookie || ''
    let accessToken = rec.qqtAccessToken
    if (!accessToken || rec.yunpanSession) {
      const token = await ensureQqtToken({ rec, sspid, allowRecentSkip: false })
      if (!token.ok || !token.accessToken) {
        return { status: 'failed', message: token.message || '无法获取全球通 Token' }
      }
      cookie = rec.yunpanSession ? '' : token.cookie || cookie
      accessToken = token.accessToken
    }

    const refreshCmccCookie = async (): Promise<string> => {
      const latest = (await getAccountById(accountId)) ?? rec
      const usable = await ensureUsable10086Cookie({
        rec: latest,
        allowRecentSkip: false,
        windowMin: 30,
        clearOnYunpanFailure: false,
        preferYunpan: false,
      })
      if (!usable.ok || !usable.cookie) {
        throw new Error(usable.message || '10086 CK 恢复失败')
      }
      cookie = usable.cookie
      return usable.cookie
    }

    const completedResignDays: GlobalTelecomResignPlanItem[] = []
    const completedBlindTasks: number[] = []
    const failures: string[] = []
    let resignMessage = '补签状态未查询'
    let blindMessage = '盲盒任务状态未查询'

    try {
      const signResult = await queryGlobalTelecomSign({
        cmccCookie: cookie,
        requestHeaders: rec.requestHeaders,
        accessToken,
        sspid,
        refreshAccessToken: rec.yunpanSession ? async () => {
          const latest = await ensureYunpanGlobalToken((await getAccountById(accountId)) || rec, true)
          return latest.qqtAccessToken!
        } : undefined,
        refreshCmccCookie: !rec.yunpanSession && accessToken && (rec.cookie || shouldRecover10086CookieByYunpan(rec))
          ? refreshCmccCookie
          : undefined,
      })
      accessToken = signResult.accessToken
      await setAccountQqtToken({ id: accountId, qqtAccessToken: signResult.accessToken })

      let currentSign = signResult.sign
      const resignPlan = planGlobalTelecomResignDays(currentSign.days, currentSign.reSignRemaining)
      resignMessage = signResult.sign.reSignRemaining <= 0
        ? '补签次数为 0，未执行补签'
        : resignPlan.length === 0
          ? '无需补签'
          : `待补签 ${resignPlan.length} 天`
      const attemptedDays = new Set<number>()
      while (currentSign.reSignRemaining > 0) {
        const day = planGlobalTelecomResignDays(
          currentSign.days.filter((candidate) => !attemptedDays.has(candidate.dayNum)), currentSign.reSignRemaining,
        )[0]
        if (!day) break
        attemptedDays.add(day.dayNum)
        await updateTaskItemProgress(itemId, `正在补签第 ${day.dayNum} 天（${day.taskIds.length} 项任务）`)
        try {
          if (day.taskIds.length === 0) throw new Error('日期仍待补签，但未返回可提交的任务，不能视为无需补签')
          const result = await globalTelecomResign({
            cmccCookie: cookie,
            requestHeaders: rec.requestHeaders,
            accessToken,
            sspid,
            dayNum: day.dayNum,
            taskIds: day.taskIds,
          })
          accessToken = result.accessToken
          await setAccountQqtToken({ id: accountId, qqtAccessToken: result.accessToken })
          const payload = asRecord(result.payload)
          currentSign = payload?.sign as GlobalTelecomOverview['sign']
          if (!currentSign?.days) throw new Error('补签结果缺失，未确认完成')
          if (currentSign.days.find((item) => item.dayNum === day.dayNum)?.signStatus !== 1) {
            const verified = await verifyQqtActivityState({
              query: () => queryGlobalTelecomSign({ cmccCookie: cookie, requestHeaders: rec.requestHeaders, accessToken, sspid }),
              completed: (state) => state.sign.days.find((item) => item.dayNum === day.dayNum)?.signStatus === 1,
              message: '提交后日期仍未补签完成，可再次重试',
            })
            accessToken = verified.accessToken
            currentSign = verified.sign
          }
          completedResignDays.push(day)
        } catch (error) {
          failures.push(`第 ${day.dayNum} 天补签失败：${error instanceof Error ? error.message : '上游请求失败'}`)
          // A failed response may still have consumed a chance; never submit another day on stale quota.
          const refreshed = await queryGlobalTelecomSign({ cmccCookie: cookie, requestHeaders: rec.requestHeaders, accessToken, sspid })
          accessToken = refreshed.accessToken
          currentSign = refreshed.sign
        }
      }
      if (resignPlan.length > 0) {
        resignMessage = `补签完成 ${completedResignDays.length}/${resignPlan.length} 天`
      }
    } catch (error) {
      failures.push(`补签状态查询失败：${error instanceof Error ? error.message : '上游请求失败'}`)
    }

    await updateTaskItemProgress(itemId, '正在查询全球通盲盒任务')
    try {
      const blindResult = await queryGlobalTelecomBlindBox({
        cmccCookie: cookie,
        requestHeaders: rec.requestHeaders,
        accessToken,
        sspid,
        refreshAccessToken: rec.yunpanSession ? async () => {
          const latest = await ensureYunpanGlobalToken((await getAccountById(accountId)) || rec, true)
          return latest.qqtAccessToken!
        } : undefined,
        refreshCmccCookie: !rec.yunpanSession && accessToken && (rec.cookie || shouldRecover10086CookieByYunpan(rec))
          ? refreshCmccCookie
          : undefined,
      })
      accessToken = blindResult.accessToken
      await setAccountQqtToken({ id: accountId, qqtAccessToken: blindResult.accessToken })
      const blindPlan = planGlobalTelecomBlindBoxTasks(blindResult.blindBox.tasks)
      if (blindResult.blindBox.tasks.length === 0) throw new Error('本期盲盒任务清单未确认，需要更新活动规则')
      const unopened = blindResult.blindBox.tasks.filter((task) => !task.completed && task.available === false).length
      blindMessage = blindPlan.length === 0
        ? unopened ? `当前无可完成任务，${unopened} 项未开放或需更新` : '盲盒任务已全部完成'
        : `待完成 ${blindPlan.length} 项盲盒任务`
      for (const taskNumber of blindPlan) {
        await updateTaskItemProgress(itemId, `正在完成盲盒任务 ${taskNumber}`)
        try {
          const result = await globalTelecomBlindBoxAction({
            cmccCookie: cookie,
            requestHeaders: rec.requestHeaders,
            accessToken,
            sspid,
            action: 'complete-task',
            taskNumber,
          })
          accessToken = result.accessToken
          await setAccountQqtToken({ id: accountId, qqtAccessToken: result.accessToken })
          // globalTelecomBlindBoxAction already verifies the authoritative task state.
          completedBlindTasks.push(taskNumber)
        } catch (error) {
          failures.push(`盲盒任务 ${taskNumber} 失败：${error instanceof Error ? error.message : '上游请求失败'}`)
        }
      }
      if (blindPlan.length > 0) {
        blindMessage = `盲盒任务完成 ${completedBlindTasks.length}/${blindPlan.length} 项${unopened ? `，${unopened} 项未开放或需更新` : ''}`
      }
    } catch (error) {
      failures.push(`盲盒任务查询失败：${error instanceof Error ? error.message : '上游请求失败'}`)
    }

    invalidateGlobalTelecomOverview(accountId)
    const message = `${resignMessage}；${blindMessage}${failures.length > 0 ? `；${failures.join('；')}` : ''}`
    return { status: failures.length > 0 ? 'failed' : 'success', message }
  })
}

function combineRefreshSignWedResult(args: {
  refreshed: ExecuteResult
  signed: ExecuteResult
  wed: ExecuteResult
}): ExecuteResult {
  const messagePrefix = `${args.refreshed.message}，${args.signed.message}`
  const wedMessage = args.wed.message.replace(/^拼图任务[：:]\s*/, '')
  if (args.wed.status === 'failed') {
    return {
      status: 'skipped',
      message: `${messagePrefix}\n拼图任务失败：${wedMessage}`,
    }
  }
  return {
    status:
      args.wed.status === 'success' ||
      (args.signed.status === 'success' && args.wed.status === 'skipped')
        ? 'success'
        : 'skipped',
    message: `${messagePrefix}\n拼图任务：${wedMessage}`,
  }
}

function shouldUseDailySkip(taskType: 'refresh_cookie' | 'qqt_token' | 'qqt_sign' | 'wed_puzzle'): boolean {
  return taskType !== 'wed_puzzle' && taskType !== 'qqt_sign'
}

async function skipIfDailyDone(args: {
  accountId: string
  taskType: 'refresh_cookie' | 'qqt_token' | 'qqt_sign' | 'wed_puzzle'
  force?: boolean
}): Promise<string | null> {
  if (!shouldUseDailySkip(args.taskType)) return null
  const skip = await shouldSkipDailyTask({
    accountId: args.accountId,
    taskType: args.taskType,
    force: args.force,
  })
  return skip ? '今日已完成，已跳过' : null
}

async function markDaily(args: {
  accountId: string
  taskType: 'refresh_cookie' | 'qqt_token' | 'qqt_sign' | 'wed_puzzle'
  status: 'running' | 'success' | 'failed' | 'skipped'
  source?: string
  message?: string
  result?: Record<string, unknown>
}): Promise<void> {
  await setDailyTaskState({
    accountId: args.accountId,
    taskType: args.taskType,
    status: args.status,
    source: args.source ?? 'batch',
    message: args.message,
    result: args.result,
  }).catch(() => undefined)
}

function summarizeWedTask(task: WedRechargeTask): string {
  const progress =
    typeof task.completedTimes === 'number' && typeof task.requireTimes === 'number'
      ? ` ${task.completedTimes}/${task.requireTimes}`
      : ''
  const date = task.taskDate ? `${task.taskDate} ` : ''
  return `${date}${task.title}(${task.taskId})${progress}`
}

function buildWedRechargeTaskTargetUrl(task: WedRechargeTask, jtToken: string): string {
  const raw = task.jumpUrl?.trim()
  if (!raw) throw new Error('任务未配置 jumpUrl')
  try {
    const url = new URL(raw)
    url.searchParams.set('jtToken', jtToken)
    return url.toString()
  } catch {
    const joiner = raw.includes('?') ? '&' : '?'
    return `${raw}${joiner}jtToken=${encodeURIComponent(jtToken)}`
  }
}

function wedRechargeStrategyLabel(strategy: WedRechargeTaskStrategy): string {
  if (strategy === 'directFinish') return 'finishTask'
  if (strategy === 'openPlugin') return 'openFinish'
  return strategy
}

function isWedRechargePathUnsupported(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error || '')
  return msg.includes('插件中不包含此路径') || msg.includes('不包含此路径')
}

async function waitMs(ms: number): Promise<void> {
  if (ms <= 0) return
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function finishWedTask(args: {
  cookie: string
  planItem: WedRechargeTaskPlanItem
  activityId?: string
  itemId: string
  currentDrawTimes?: number
  accountId?: string
}): Promise<{
  success: number
  submitted: number
  failed: number
  skipped: number
  messages: string[]
  currentDrawTimes?: number
}> {
  const { task, runTimes } = args.planItem
  const messages: string[] = []
  let success = 0
  let submitted = 0
  let failed = 0
  let skipped = 0
  let drawTimes = args.currentDrawTimes

  for (let index = 1; index <= runTimes; index += 1) {
    try {
      await updateTaskItemProgress(
        args.itemId,
        `正在完成：${summarizeWedTask(task)} ${index}/${runTimes}`,
      )
      const strategy = resolveWedRechargeTaskStrategy(task)
      const mode = wedRechargeStrategyLabel(strategy)
      let finishMessage: string
      if (strategy === 'unsupported') {
        skipped += 1
        const line = `${task.title}：跳过，暂不支持的任务类型 ${task.taskType || 'unknown'}，执行后拼图次数 ${
          typeof drawTimes === 'number' ? drawTimes : '待最终查询'
        }`
        messages.push(line)
        await updateTaskItemProgress(args.itemId, line)
        continue
      }
      if (strategy === 'directFinish') {
        const finish = await wedRechargeFinishTask({
          cookie: args.cookie,
          taskId: task.taskId,
        })
        finishMessage = finish.message
      } else {
        await updateTaskItemProgress(args.itemId, `正在获取任务 Token：${summarizeWedTask(task)}`)
        const jtToken = await wedRechargeGetJtToken({
          cookie: args.cookie,
          taskId: task.taskId,
          activityId: args.activityId,
        })
        const targetUrl = buildWedRechargeTaskTargetUrl(task, jtToken)
        const openTask = await wedRechargeGetOpenTaskInfo({
          cookie: args.cookie,
          jtToken,
          referer: targetUrl,
        })
        const delayMs = openTask.scanTimeSeconds * 1000
        if (delayMs > 0) {
          await updateTaskItemProgress(
            args.itemId,
            `等待任务倒计时 ${openTask.scanTimeSeconds} 秒：${summarizeWedTask(task)}`,
          )
          await waitMs(delayMs)
        }
        const finish = await wedRechargeOpenFinish({
          cookie: args.cookie,
          jtToken,
          cToken: openTask.cToken,
          referer: targetUrl,
        })
        finishMessage = finish.message
      }
      let verified = false
      try {
        const [latestTasks, info] = await Promise.all([
          wedRechargeTaskList({ cookie: args.cookie }),
          wedRechargeQueryPictureInfo({ cookie: args.cookie }),
        ])
        const latestTask = latestTasks.find((item) => item.taskId === task.taskId)
        const refreshedTimes = Number(info.drawTimes)
        verified = Boolean(
          (latestTask && latestTask.status !== 0) ||
          (latestTask &&
            typeof latestTask.completedTimes === 'number' &&
            typeof task.completedTimes === 'number' &&
            latestTask.completedTimes > task.completedTimes) ||
          (Number.isFinite(refreshedTimes) &&
            typeof drawTimes === 'number' &&
            refreshedTimes > drawTimes),
        )
        if (Number.isFinite(refreshedTimes)) drawTimes = refreshedTimes
        if (args.accountId) {
          await setAccountWedRechargeInfo({
            id: args.accountId,
            info: info as unknown as Record<string, unknown>,
          })
        }
      } catch {
        verified = false
      }
      if (verified) success += 1
      else submitted += 1
      const line = `${task.title}：${mode} ${verified ? '完成并已复核' : '已提交但状态未确认'}，接口返回 ${finishMessage}，当前拼图次数 ${
        typeof drawTimes === 'number' ? drawTimes : '待最终查询'
      }`
      messages.push(line)
      await updateTaskItemProgress(
        args.itemId,
        line,
      )
    } catch (error) {
      if (isWedRechargePathUnsupported(error)) {
        skipped += 1
        const line = `${task.title}：跳过，插件路径不支持，执行后拼图次数 ${
          typeof drawTimes === 'number' ? drawTimes : '待最终查询'
        }`
        messages.push(line)
        await updateTaskItemProgress(args.itemId, line)
        continue
      }
      failed += 1
      const msg = error instanceof Error ? error.message : '未知错误'
      const line = `${task.title}：失败，接口返回 ${msg}，执行后拼图次数 ${
        typeof drawTimes === 'number' ? drawTimes : '待最终查询'
      }`
      messages.push(line)
      await updateTaskItemProgress(
        args.itemId,
        line,
      )
    }
  }

  return { success, submitted, failed, skipped, messages, currentDrawTimes: drawTimes }
}

async function executeWedRecharge(
  accountId: string,
  itemId: string,
  params: ReturnType<typeof parseWedRechargeParams>,
  opts?: { forceDaily?: boolean },
): Promise<ExecuteResult> {
  return await withWedActivityLock(() => withKeyLock(`account:${accountId}`, async () => {
    void opts?.forceDaily
    await markDaily({ accountId, taskType: 'wed_puzzle', status: 'running', message: '拼图任务执行中' })
    const rec = await getAccountById(accountId)
    if (!rec) {
      await markDaily({ accountId, taskType: 'wed_puzzle', status: 'failed', message: '账号不存在' })
      return { status: 'failed', message: '账号不存在' }
    }
    if (!rec.cookie && !shouldRecover10086CookieByYunpan(rec)) {
      await markDaily({ accountId, taskType: 'wed_puzzle', status: 'failed', message: '暂无 CK，无法执行周三拼图' })
      return { status: 'failed', message: '暂无 CK，无法执行周三拼图' }
    }

    await updateTaskItemProgress(itemId, '正在使用 10086 CK 准备周三活动会话')
    const usable = await ensureFreshCookie({ rec, allowRecentSkip: false })
    if (!usable.ok || !usable.cookie) {
      await markDaily({ accountId, taskType: 'wed_puzzle', status: 'failed', message: usable.message })
      return { status: 'failed', message: usable.message }
    }
    const cookie = await prepareWedRechargeCookieForRecord({
      ...rec,
      cookie: usable.cookie,
    })

    await updateTaskItemProgress(itemId, '正在查询碎片情况')
    const beforeInfo = await wedRechargeQueryPictureInfo({ cookie })
    const initialDrawTimes = beforeInfo.drawTimes ?? '—'
    let currentDrawTimes = Number(beforeInfo.drawTimes)
    if (!Number.isFinite(currentDrawTimes)) currentDrawTimes = Number.NaN

    let success = 0
    let submitted = 0
    let failed = 0
    let skipped = 0
    const taskMessages: string[] = []

    await updateTaskItemProgress(itemId, '正在查询当前账号实时任务列表')
    const tasks = await wedRechargeTaskList({ cookie })
    const taskPlan = planWedRechargeTasks({ tasks })
    const runnableTasks = taskPlan.runnable
    skipped = taskPlan.skipped.length
    taskMessages.push(
      ...taskPlan.skipped.map((item) => `${item.task.title}：跳过，${item.reason}`),
    )

    if (runnableTasks.length === 0) {
      const message = taskMessages.join('\n') || '任务列表为空'
      await updateTaskItemProgress(itemId, `无可自动完成任务\n${message}`)
    } else {
      await updateTaskItemProgress(
        itemId,
        [
          `任务列表：${runnableTasks.length} 个可自动执行`,
          ...runnableTasks.map((item, index) => `${index + 1}. [待执行] ${summarizeWedTask(item.task)} x${item.runTimes}`),
          ...taskPlan.skipped.map((item) => `- [跳过] ${item.task.title}：${item.reason}`),
        ].join('\n'),
      )
      for (let taskIndex = 0; taskIndex < runnableTasks.length; taskIndex += 1) {
        const item = runnableTasks[taskIndex]
        await updateTaskItemProgress(
          itemId,
          [
            `任务进度：${taskIndex + 1}/${runnableTasks.length}`,
            ...runnableTasks.map((plan, index) => {
              const state = index < taskIndex ? '已处理' : index === taskIndex ? '执行中' : '待执行'
              return `${index + 1}. [${state}] ${summarizeWedTask(plan.task)} x${plan.runTimes}`
            }),
            ...taskPlan.skipped.map((skipped) => `- [跳过] ${skipped.task.title}：${skipped.reason}`),
          ].join('\n'),
        )
        const result = await finishWedTask({
          cookie,
          planItem: item,
          activityId: params.activityId,
          itemId,
          accountId,
          currentDrawTimes: Number.isFinite(currentDrawTimes) ? currentDrawTimes : undefined,
        })
        if (typeof result.currentDrawTimes === 'number') {
          currentDrawTimes = result.currentDrawTimes
        }
        success += result.success
        submitted += result.submitted
        failed += result.failed
        skipped += result.skipped
        taskMessages.push(...result.messages)
      }
      await updateTaskItemProgress(
        itemId,
        [
          `任务进度：${runnableTasks.length}/${runnableTasks.length}`,
          ...runnableTasks.map((plan, index) => `${index + 1}. [已处理] ${summarizeWedTask(plan.task)} x${plan.runTimes}`),
          ...taskPlan.skipped.map((skipped) => `- [跳过] ${skipped.task.title}：${skipped.reason}`),
          ...taskMessages,
        ].join('\n'),
      )
    }

    await updateTaskItemProgress(itemId, '正在刷新最终碎片情况')
    const finalInfo = await wedRechargeQueryPictureInfo({ cookie })
    await setAccountWedRechargeInfo({
      id: accountId,
      info: finalInfo as unknown as Record<string, unknown>,
    })

    const currentTimes = finalInfo.drawTimes ?? '—'
    if (success === 0 && failed === 0) {
      const message = [`拼图初始次数：${initialDrawTimes}，最终次数：${currentTimes}`, ...taskMessages].join('\n')
      await markDaily({ accountId, taskType: 'wed_puzzle', status: 'skipped', message })
      return {
        status: 'skipped',
        message,
      }
    }
    if (success === 0 && submitted === 0 && failed > 0) {
      const message = [
        `任务完成失败 ${failed} 次，拼图初始次数：${initialDrawTimes}，最终次数：${currentTimes}`,
        ...taskMessages,
      ].join('\n')
      await markDaily({ accountId, taskType: 'wed_puzzle', status: 'failed', message })
      return {
        status: 'failed',
        message,
      }
    }
    const message = [
      `已复核完成 ${success} 个，已提交待确认 ${submitted} 个，失败 ${failed} 个，跳过 ${skipped} 个，拼图初始次数：${initialDrawTimes}，最终次数：${currentTimes}`,
      ...taskMessages,
    ].join('\n')
    const hasPartialResult = failed > 0 || submitted > 0
    await markDaily({
      accountId,
      taskType: 'wed_puzzle',
      status: hasPartialResult ? 'skipped' : 'success',
      message,
      result: { success, submitted, failed, finalDrawTimes: currentTimes },
    })
    return {
      status: hasPartialResult ? 'skipped' : 'success',
      message,
    }
  }))
}

async function executeTaskItem(task: BatchTask, item: BatchTaskItem): Promise<ExecuteResult> {
  if (task.type === 'activity_session_refresh') {
    return await executeActivitySessionRefresh(item.accountId)
  }
  if (task.type === 'cmcc_session_exchange') {
    return await executeCmccSessionExchange(item.accountId)
  }
  if (task.type === 'keepalive') {
    return await executeKeepalive(item.accountId)
  }
  if (task.type === 'cmcc_auto_checkin') {
    return await executeCmccAutoCheckinTask(
      item.accountId,
      parseCmccAutoCheckinTaskParams(task.sspid),
      (message) => updateTaskItemProgress(item.id, message),
    )
  }
  if (task.type === 'ck_maintenance') {
    return await executeCookieMaintenance(item.accountId)
  }
  if (task.type === 'global_telecom_resign') {
    const sspid = task.sspid?.trim() || process.env.DEFAULT_QQT_SSPID || process.env.QQT_SSPID || '75442'
    return await executeGlobalTelecomResignAndBlindBox(item.accountId, item.id, sspid)
  }
  if (task.type === 'global_telecom_daily') {
    return executeGlobalTelecomDaily(item.accountId, task.sspid?.trim() || '75442',
      message => updateTaskItemProgress(item.id, message))
  }
  if (task.type === 'wed_recharge') {
    return await executeWedRecharge(item.accountId, item.id, parseWedRechargeParams(task.sspid))
  }
  if (task.type === 'query_info') {
    return await executeQueryInfo(item.accountId)
  }
  if (task.type === 'yunpan_activate') {
    return await executeYunpanActivate(item.accountId)
  }
  if (task.type === 'refresh') {
    return await executeRefresh(item.accountId)
  }
  if (task.type === 'sign') {
    if (!task.sspid?.trim()) {
      return { status: 'failed', message: '缺少 SSPID' }
    }
    return await executeSign(
      item.accountId,
      task.sspid.trim(),
      task.timezone || 'Asia/Shanghai',
      { forceTokenRefresh: true },
    )
  }
  if (!task.sspid?.trim()) {
    return { status: 'failed', message: '缺少 SSPID' }
  }
  const combo = parseRefreshAndSignParams(task.sspid)
  if (!combo.sspid?.trim()) {
    return { status: 'failed', message: '缺少 SSPID' }
  }
  const refreshed = await executeRefresh(item.accountId, {
    forceDaily: combo.forceDaily,
  })
  if (refreshed.status === 'failed') return refreshed
  const latest = await getAccountById(item.accountId)
  const nonQqt = latest ? isNonQqtAccount(latest) : false
  const signed = nonQqt
    ? ({ status: 'skipped' as const, message: '非全球通用户，已跳过全球通签到' })
    : await executeSign(
        item.accountId,
        combo.sspid.trim(),
        task.timezone || 'Asia/Shanghai',
        { forceTokenRefresh: false, forceDaily: combo.forceDaily },
      )
  if (signed.status === 'failed') return signed
  if (signed.status === 'skipped') {
    const wed = await executeWedRecharge(item.accountId, item.id, {
      ...combo.wedRecharge,
      autoTaskList: true,
    }, { forceDaily: combo.forceDaily })
    if (nonQqt) {
      await markDaily({
        accountId: item.accountId,
        taskType: 'qqt_sign',
        status: 'skipped',
        message: signed.message,
      })
      await markDaily({
        accountId: item.accountId,
        taskType: 'qqt_token',
        status: 'skipped',
        message: '非全球通用户，已跳过 Token 刷新',
      })
    }
    return combineRefreshSignWedResult({ refreshed, signed, wed })
  }
  const wed = await executeWedRecharge(item.accountId, item.id, {
    ...combo.wedRecharge,
    autoTaskList: true,
  }, { forceDaily: combo.forceDaily })
  return combineRefreshSignWedResult({ refreshed, signed, wed })
}

function computeDedupeKey(args: {
  type: BatchTaskType
  scopeType: BatchTaskScopeType
  scopeId?: string
  timezone?: string
  accountIds?: string[]
}): string {
  const scopePart =
    args.scopeType === 'selected_accounts'
      ? `:${selectedScopeId(args.accountIds) || 'empty'}`
      : args.scopeId
        ? `:${args.scopeId}`
        : ''
  if (args.type === 'sign' || args.type === 'refresh_and_sign') {
    return `${args.type}:${args.scopeType}${scopePart}:${toDayKey(new Date(), args.timezone || 'Asia/Shanghai')}`
  }
  if (args.type === 'wed_recharge') {
    return `${args.type}:${args.scopeType}${scopePart}`
  }
  return `${args.type}:${args.scopeType}${scopePart}`
}

function wedRechargeParamsDedupeSuffix(params?: CreateTaskArgs['wedRecharge']): string {
  const encoded = encodeWedRechargeParams(params) || ''
  if (!encoded) return ''
  return `:${crypto.createHash('sha1').update(encoded).digest('hex').slice(0, 10)}`
}

export async function getTaskById(taskId: string): Promise<BatchTaskSummary | null> {
  await finalizeStaleActiveTasks()
  const prisma = getPrisma()
  const task = await prisma.batchTask.findUnique({
    where: { id: taskId },
    include: { items: true },
  })
  return task ? toTaskSummary(task) : null
}

export async function listRecentTasks(limit?: number): Promise<BatchTaskSummary[]> {
  await finalizeStaleActiveTasks()
  const prisma = getPrisma()
  const tasks = await prisma.batchTask.findMany({
    orderBy: { createdAt: 'desc' },
    take: normalizeRecentTaskLimit(limit),
  })
  return tasks.map((task) => toTaskSummary({ ...task, items: [] }))
}

export async function cancelBatchTask(taskId: string): Promise<BatchTaskSummary | null> {
  const prisma = getPrisma()
  const now = new Date()
  const existing = await prisma.batchTask.findUnique({
    where: { id: taskId },
    include: { items: true },
  })
  if (!existing) return null
  if (existing.status === 'success' || existing.status === 'failed' || existing.status === 'partial_success') {
    return toTaskSummary(existing)
  }
  cancelRequestedTasks.add(taskId)
  await prisma.batchTaskItem.updateMany({
    where: {
      taskId,
      status: { in: ['pending', 'running'] },
    },
    data: {
      status: 'skipped',
      message: '任务已停止',
      finishedAt: now,
    },
  })
  const counts = await prisma.batchTaskItem.groupBy({
    by: ['status'],
    where: { taskId },
    _count: { _all: true },
  })
  const countOf = (status: BatchTaskItemStatus): number =>
    counts.find((item) => item.status === status)?._count._all ?? 0
  const success = countOf('success')
  const failed = countOf('failed')
  const skipped = countOf('skipped')
  const completed = success + failed + skipped
  const task = await prisma.batchTask.update({
    where: { id: taskId },
    data: {
      status: success > 0 ? 'partial_success' : 'failed',
      completedCount: completed,
      successCount: success,
      failedCount: failed,
      skippedCount: skipped,
      currentLabel: null,
      message: '任务已停止',
      finishedAt: now,
    },
    include: { items: { orderBy: { orderIndex: 'asc' } } },
  })
  await logEvent({
    action: 'batch_task.cancel',
    message: '任务已停止',
    meta: { taskId, type: task.type, scopeType: task.scopeType, scopeId: task.scopeId },
  })
  return toTaskSummary(task)
}

export async function getActiveTask(args: {
  scopeType: BatchTaskScopeType
  scopeId?: string
  type?: BatchTaskType
}): Promise<BatchTaskSummary | null> {
  await finalizeStaleActiveTasks()
  const prisma = getPrisma()
  const task = await prisma.batchTask.findFirst({
    where: {
      scopeType: args.scopeType,
      scopeId: args.scopeId ?? null,
      ...(args.type ? { type: args.type } : {}),
      status: { in: ['pending', 'running'] },
    },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  })
  return task ? toTaskSummary(task) : null
}

export async function listActiveTasks(args: {
  scopeType?: BatchTaskScopeType
  scopeId?: string
  type?: BatchTaskType
} = {}): Promise<BatchTaskSummary[]> {
  await finalizeStaleActiveTasks()
  const prisma = getPrisma()
  const tasks = await prisma.batchTask.findMany({
    where: {
      ...(args.scopeType ? { scopeType: args.scopeType } : {}),
      ...(args.scopeId !== undefined ? { scopeId: args.scopeId || null } : {}),
      ...(args.type ? { type: args.type } : {}),
      status: { in: ['pending', 'running'] },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { items: true },
  })
  return tasks.map(toTaskSummary)
}

export async function createOrReuseBatchTask(args: CreateTaskArgs): Promise<{
  task: BatchTaskSummary
  reused: boolean
}> {
  await finalizeStaleActiveTasks()
  const prisma = getPrisma()
  const dedupeKey =
    args.dedupeKey ||
    `${computeDedupeKey(args)}${
      args.type === 'wed_recharge' ? wedRechargeParamsDedupeSuffix(args.wedRecharge) : ''
    }`
  const existing = await prisma.batchTask.findFirst({
    where: {
      dedupeKey,
      status: { in: ['pending', 'running'] },
    },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  })
  if (existing) {
    return { task: toTaskSummary(existing), reused: true }
  }
  const accounts = await resolveScopeAccounts({
    type: args.type,
    scopeType: args.scopeType,
    scopeId: args.scopeId,
    accountIds: args.accountIds,
  })
  const taskId = crypto.randomUUID()
  const now = new Date()
  const status: BatchTaskStatus = accounts.length === 0 ? 'success' : 'pending'
  const persistedScopeId =
    args.scopeType === 'selected_accounts'
      ? selectedScopeId(args.accountIds) ?? null
      : args.scopeId ?? null
  await prisma.$transaction(async (tx) => {
    await tx.batchTask.create({
      data: {
        id: taskId,
        type: args.type,
        scopeType: args.scopeType,
        scopeId: persistedScopeId,
        source: args.source ?? 'manual',
        scheduleId: args.scheduleId ?? null,
        status,
        dedupeKey,
        runKey: args.runKey ?? null,
        sspid:
          args.type === 'refresh_and_sign'
            ? encodeRefreshAndSignParams(args) ?? null
            : args.sspid?.trim() || null,
        ...(args.type === 'wed_recharge'
          ? { sspid: encodeWedRechargeParams(args.wedRecharge) ?? null }
          : {}),
        timezone: args.timezone || 'Asia/Shanghai',
        totalCount: accounts.length,
        completedCount: accounts.length === 0 ? 0 : 0,
        successCount: accounts.length === 0 ? 0 : 0,
        failedCount: 0,
        skippedCount: 0,
        message: accounts.length === 0 ? '暂无可执行账号' : '任务已创建',
        finishedAt: accounts.length === 0 ? now : null,
      },
    })
    if (accounts.length > 0) {
      await tx.batchTaskItem.createMany({
        data: accounts.map((account, index) => ({
          id: crypto.randomUUID(),
          taskId,
          accountId: account.id,
          accountLabel: formatAccountLabel(account),
          orderIndex: index,
          status: 'pending',
        })),
      })
    }
  })
  const task = await prisma.batchTask.findUnique({
    where: { id: taskId },
    include: { items: true },
  })
  if (!task) {
    throw new Error('TASK_CREATE_FAILED')
  }
  if (accounts.length > 0) {
    setImmediate(() => {
      void runBatchTask(taskId)
    })
  }
  return { task: toTaskSummary(task), reused: false }
}

export async function runBatchTask(taskId: string): Promise<void> {
  if (activeRunners.has(taskId)) return
  activeRunners.add(taskId)
  const prisma = getPrisma()
  try {

    // ---- safeUpdate: 容忍 P2025（记录已被删除）等并发情况，避免整个进程崩溃 ----
    type AnyModel = { update: (args: any) => Promise<any> }
    const safeUpdate = async (model: AnyModel, args: any, label: string): Promise<boolean> => {
      try {
        await model.update(args)
        return true
      } catch (err) {
        const code = (err as { code?: string })?.code
        const msg = err instanceof Error ? err.message : String(err)
        if (code === 'P2025') {
          console.warn(`[batchTasks][safeUpdate] ${label} skipped: record gone (P2025)`)
          return false
        }
        console.error(`[batchTasks][safeUpdate] ${label} failed:`, msg)
        return false
      }
    }

    const task = await prisma.batchTask.findUnique({
      where: { id: taskId },
      include: { items: { orderBy: { orderIndex: 'asc' } } },
    })
    if (!task) return
    if (task.status === 'success' || task.status === 'failed' || task.status === 'partial_success') {
      return
    }
    await safeUpdate(prisma.batchTask, {
      where: { id: taskId },
      data: {
        status: 'running',
        startedAt: task.startedAt ?? new Date(),
        message: '任务执行中',
      },
    }, `batchTask.update(running) id=${taskId}`)
    let completed = 0
    let success = 0
    let failed = 0
    let skipped = 0
    for (const item of task.items) {
      if (cancelRequestedTasks.has(taskId)) break
      const _itemAlive = await safeUpdate(prisma.batchTaskItem, {
        where: { id: item.id },
        data: {
          status: 'running',
          startedAt: new Date(),
        },
      }, `batchTaskItem.update(running) id=${item.id}`)
      if (!_itemAlive) continue
      await safeUpdate(prisma.batchTask, {
        where: { id: taskId },
        data: {
          currentLabel: item.accountLabel ?? null,
        },
      }, `batchTask.update(currentLabel) id=${taskId}`)
      const result = await executeTaskItem(task, item).catch((error: unknown) => ({
        status: 'failed' as const,
        message: error instanceof Error ? error.message : '执行失败',
      }))
      if (cancelRequestedTasks.has(taskId)) {
        await safeUpdate(prisma.batchTaskItem, {
          where: { id: item.id },
          data: {
            status: 'skipped',
            message: '任务已停止',
            finishedAt: new Date(),
          },
        }, `batchTaskItem.update(cancelled) id=${item.id}`)
        break
      }
      completed += 1
      if (result.status === 'success') success += 1
      if (result.status === 'failed') failed += 1
      if (result.status === 'skipped') skipped += 1
      await safeUpdate(prisma.batchTaskItem, {
        where: { id: item.id },
        data: {
          status: result.status,
          message: result.message,
          finishedAt: new Date(),
        },
      }, `batchTaskItem.update(finish) id=${item.id}`)
      await safeUpdate(prisma.batchTask, {
        where: { id: taskId },
        data: {
          completedCount: completed,
          successCount: success,
          failedCount: failed,
          skippedCount: skipped,
          currentLabel: item.accountLabel ?? null,
          message: result.message,
        },
      }, `batchTask.update(progress) id=${taskId}`)
    }
    if (cancelRequestedTasks.has(taskId)) {
      const latest = await prisma.batchTask.findUnique({
        where: { id: taskId },
        include: { items: { orderBy: { orderIndex: 'asc' } } },
      })
      if (latest) {
        const successNow = latest.items.filter((item) => item.status === 'success').length
        const failedNow = latest.items.filter((item) => item.status === 'failed').length
        const skippedNow = latest.items.filter((item) => item.status === 'skipped').length
        await safeUpdate(prisma.batchTask, {
          where: { id: taskId },
          data: {
            status: successNow > 0 ? 'partial_success' : 'failed',
            completedCount: successNow + failedNow + skippedNow,
            successCount: successNow,
            failedCount: failedNow,
            skippedCount: skippedNow,
            finishedAt: new Date(),
            currentLabel: null,
            message: '任务已停止',
          },
        }, `batchTask.update(cancelled-final) id=${taskId}`)
      }
      return
    }
    const finalStatus: BatchTaskStatus = computeFinalTaskStatusFromCounts({
      total: task.totalCount,
      success,
      failed,
      skipped,
    })
    await safeUpdate(prisma.batchTask, {
      where: { id: taskId },
      data: {
        status: finalStatus,
        finishedAt: new Date(),
        currentLabel: null,
        message:
          finalStatus === 'success'
            ? '任务执行完成'
            : finalStatus === 'partial_success'
              ? '任务执行完成，部分账号失败'
              : '任务执行失败',
      },
    }, `batchTask.update(final) id=${taskId}`)
    await logEvent({
      action: 'batch_task.finish',
      message: finalStatus,
      meta: { taskId, type: task.type, scopeType: task.scopeType, scopeId: task.scopeId },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[batchTasks][runBatchTask] unexpected error for taskId=${taskId}:`, msg)
    try {
      await getPrisma().batchTask.update({
        where: { id: taskId },
        data: { status: 'failed', finishedAt: new Date(), message: `任务异常终止：${msg}`, currentLabel: null },
      })
    } catch (e2) {
      console.error('[batchTasks][runBatchTask] also failed to mark task failed:', e2)
    }
  } finally {
    cancelRequestedTasks.delete(taskId)
    activeRunners.delete(taskId)
  }
}

export async function listSchedules(): Promise<TaskScheduleSummary[]> {
  const prisma = getPrisma()
  const schedules = await prisma.taskSchedule.findMany({
    orderBy: [{ enabled: 'desc' }, { updatedAt: 'desc' }],
  })
  return schedules.map(toScheduleSummary)
}

export async function createSchedule(args: {
  name: string
  times: string[]
  enabled?: boolean
  sspid?: string
  timezone?: string
  action?: BatchTaskType
}): Promise<TaskScheduleSummary> {
  const prisma = getPrisma()
  const times = normalizeTimes(args.times)
  if (times.length === 0) throw new Error('INVALID_TIMES')
  const action = args.action ?? 'refresh_and_sign'
  if (
    action !== 'refresh' &&
    action !== 'keepalive' &&
    action !== 'ck_maintenance' &&
    action !== 'activity_session_refresh' &&
    action !== 'cmcc_session_exchange' &&
    action !== 'global_telecom_daily' &&
    action !== 'cmcc_auto_checkin' &&
    !args.sspid?.trim()
  ) {
    throw new Error('INVALID_SSPID')
  }
  const schedule = await prisma.taskSchedule.create({
    data: {
      id: crypto.randomUUID(),
      name: args.name.trim() || `计划 ${times.join(', ')}`,
      enabled: args.enabled ?? true,
      scopeType: 'admin_all',
      action,
      timezone: args.timezone || 'Asia/Shanghai',
      sspid: args.sspid?.trim() || null,
      timesJson: JSON.stringify(times),
    },
  })
  return toScheduleSummary(schedule)
}

export async function updateSchedule(args: {
  id: string
  name?: string
  times?: string[]
  enabled?: boolean
  sspid?: string
  timezone?: string
}): Promise<TaskScheduleSummary> {
  const prisma = getPrisma()
  const current = await prisma.taskSchedule.findUnique({ where: { id: args.id } })
  if (!current) throw new Error('NOT_FOUND')
  const data: Prisma.TaskScheduleUpdateInput = {}
  if (args.name !== undefined) {
    data.name = args.name.trim() || '未命名计划'
  }
  if (args.times !== undefined) {
    const times = normalizeTimes(args.times)
    if (times.length === 0) throw new Error('INVALID_TIMES')
    data.timesJson = JSON.stringify(times)
  }
  if (args.enabled !== undefined) data.enabled = args.enabled
  if (args.sspid !== undefined) data.sspid = args.sspid.trim() || null
  if (args.timezone !== undefined) data.timezone = args.timezone || 'Asia/Shanghai'
  const nextAction = current.action as BatchTaskType
  const nextSspid =
    args.sspid !== undefined ? args.sspid.trim() : current.sspid?.trim() || ''
  if (
    nextAction !== 'refresh' &&
    nextAction !== 'keepalive' &&
    nextAction !== 'ck_maintenance' &&
    nextAction !== 'activity_session_refresh' &&
    nextAction !== 'cmcc_session_exchange' &&
    nextAction !== 'global_telecom_daily' &&
    !nextSspid
  ) {
    throw new Error('INVALID_SSPID')
  }
  const schedule = await prisma.taskSchedule.update({
    where: { id: args.id },
    data,
  })
  return toScheduleSummary(schedule)
}

export async function deleteSchedule(id: string): Promise<void> {
  const prisma = getPrisma()
  await prisma.taskSchedule.delete({ where: { id } })
}

async function triggerSchedule(schedule: TaskSchedule, fireKey: string): Promise<void> {
  const prisma = getPrisma()
  if (await prisma.taskScheduleFire.findUnique({ where: { fireKey } })) return
  const fire = await prisma.taskScheduleFire
    .create({
      data: {
        id: crypto.randomUUID(),
        scheduleId: schedule.id,
        fireKey,
      },
    })
    .catch((error: unknown) => {
      void error
      return null
    })
  if (!fire) return
  try {
    const { task } = await createOrReuseBatchTask({
      type: schedule.action as BatchTaskType,
      scopeType: schedule.scopeType as BatchTaskScopeType,
      scopeId: schedule.scopeId ?? undefined,
      source: 'scheduled',
      scheduleId: schedule.id,
      sspid: schedule.sspid ?? undefined,
      timezone: schedule.timezone,
      runKey: fireKey,
      dedupeKey: computeDedupeKey({
        type: schedule.action as BatchTaskType,
        scopeType: schedule.scopeType as BatchTaskScopeType,
        scopeId: schedule.scopeId ?? undefined,
        timezone: schedule.timezone,
      }),
    })
    await prisma.taskScheduleFire.update({
      where: { id: fire.id },
      data: { taskId: task.id },
    })
    await prisma.taskSchedule.update({
      where: { id: schedule.id },
      data: { lastTriggeredAt: new Date() },
    })
  } catch (error) {
    // Allow a later scan to retry creation after a transient database error,
    // but never delete a fire marker if the job might already be running.
    const task = await prisma.batchTask.findUnique({ where: { runKey: fireKey } })
    if (!task) await prisma.taskScheduleFire.delete({ where: { id: fire.id } })
    throw error
  }
}

async function scanSchedules(): Promise<void> {
  const prisma = getPrisma()
  const schedules = await prisma.taskSchedule.findMany({
    where: { enabled: true },
    orderBy: { updatedAt: 'desc' },
  })
  const now = new Date()
  for (const schedule of schedules) {
    const times = parseTimesJson(schedule.timesJson)
    if (times.length === 0) continue
    const hm = toHm(now, schedule.timezone)
    const nowMinute = hmToMinute(hm)
    const dayKey = toDayKey(now, schedule.timezone)
    for (const time of times) {
      const targetMinute = hmToMinute(time)
      if (targetMinute < 0 || nowMinute < 0) continue
      const diff = nowMinute - targetMinute
      // Daily QQT jobs catch up once on the same day after downtime. A unique
      // persisted fireKey prevents every 30-second scan from re-running it.
      if (schedule.action === 'global_telecom_daily'
        ? !isGlobalDailyScheduleDue(nowMinute, targetMinute)
        : diff < 0 || diff > 1) continue
      const fireKey = `${schedule.id}:${dayKey}:${time}`
      await triggerSchedule(schedule, fireKey)
    }
  }
}

async function scanSmsExpiryReminders(): Promise<void> {
  const reminderHours = getSmsExpiryReminderHours()
  const reminderWindowMs = reminderHours * 60 * 60 * 1000
  const cooldownMs = getSmsExpiryReminderCooldownMin() * 60 * 1000
  const now = Date.now()
  const accounts = await listAccounts()
  const candidates = accounts.filter((rec) => {
    if (!rec.smsLoginExpireAt) return false
    if (!rec.cookie && !rec.qqtAccessToken) return false
    const expireMs = Date.parse(rec.smsLoginExpireAt)
    if (!Number.isFinite(expireMs)) return false
    const diff = expireMs - now
    return diff > 0 && diff <= reminderWindowMs
  })
  if (candidates.length === 0) return

  const candidateMap = new Map(candidates.map((rec) => [rec.id, rec]))
  const links = await listPublicLinks()
  const configs = await listPublicLinkPushConfigs()

  for (const link of links) {
    const config = configs[link.id]
    if (!config?.pushplusEnabled || !config.pushplusToken || !config.notifyCookieInvalid) continue
    const dueAccounts = link.accountIds
      .map((accountId) => candidateMap.get(accountId))
      .filter((item): item is AccountRecord => Boolean(item))
      .filter((rec) => {
        const cacheKey = `${link.id}:${rec.id}`
        const last = smsExpiryReminderAt.get(cacheKey) ?? 0
        return now - last >= cooldownMs
      })
    if (dueAccounts.length === 0) continue

    await pushPlusSend({
      token: config.pushplusToken,
      title: `中国移动登录态即将到期: ${dueAccounts.length} 个账号`,
      content: [
        `### 中国移动登录态即将到期`,
        `- 专属链接: ${link.id}`,
        `- 提醒阈值: ${reminderHours} 小时内`,
        ...dueAccounts.map((rec) => {
          const display = formatAccountLabel(rec)
          const expireAt = rec.smsLoginExpireAt || ''
          return `- ${display}: 预计 ${expireAt} 到期（剩余 ${formatRemainingWindow(expireAt, now)}）`
        }),
        '',
        `请尽早通过人工方式补登或导入新的登录态。`,
      ].join('\n'),
    }).catch(() => undefined)

    for (const rec of dueAccounts) {
      smsExpiryReminderAt.set(`${link.id}:${rec.id}`, now)
    }
  }
}

function isAutoCookieMaintenanceEnabled(): boolean {
  const raw = String(process.env.CK_MAINTENANCE_AUTO_ENABLED ?? 'true').trim().toLowerCase()
  return !['0', 'false', 'off', 'no'].includes(raw)
}

async function scanAutoCookieMaintenance(): Promise<void> {
  if (!isAutoCookieMaintenanceEnabled()) return
  const now = new Date()
  const hourKey = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
  }).format(now)
  const runKey = `ck_maintenance:auto:${hourKey}`
  if (lastAutoMaintenanceKey === runKey) return
  lastAutoMaintenanceKey = runKey

  const prisma = getPrisma()
  const existing = await prisma.batchTask.findUnique({ where: { runKey } }).catch(() => null)
  if (existing) return
  await createOrReuseBatchTask({
    type: 'ck_maintenance',
    scopeType: 'admin_all',
    source: 'maintenance',
    runKey,
    dedupeKey: runKey,
  }).catch((error: unknown) => {
    const code = (error as { code?: string })?.code
    if (code !== 'P2002') {
      const msg = error instanceof Error ? error.message : String(error)
      console.warn(`[batchTasks][ck_maintenance] auto task create failed: ${msg}`)
    }
  })
}

export function startTaskScheduler(): void {
  if (schedulerStarted) return
  schedulerStarted = true
  const tick = () => {
    void finalizeStaleActiveTasks().catch(() => undefined)
    void scanSchedules().catch(() => undefined)
    void scanSmsExpiryReminders().catch(() => undefined)
    void scanAutoCookieMaintenance().catch(() => undefined)
  }
  tick()
  schedulerTimer = setInterval(tick, 30_000)
  if (schedulerTimer && typeof schedulerTimer.unref === 'function') {
    schedulerTimer.unref()
  }
}

export function stopTaskScheduler(): void {
  if (schedulerTimer) {
    clearInterval(schedulerTimer)
    schedulerTimer = null
  }
  schedulerStarted = false
}

export async function runCookieMaintenanceNow(args: {
  scopeType?: BatchTaskScopeType
  scopeId?: string
  accountIds?: string[]
  concurrency?: number
  source?: 'manual' | 'scheduled' | 'maintenance'
} = {}): Promise<{
  total: number
  success: number
  failed: number
  skipped: number
  results: Array<{ accountId: string; status: BatchTaskItemStatus; message: string }>
}> {
  const accounts = await resolveScopeAccounts({
    type: 'ck_maintenance',
    scopeType: args.scopeType ?? 'admin_all',
    scopeId: args.scopeId,
    accountIds: args.accountIds,
  })
  const runnable = accounts.filter(
    (rec) => !rec.disabledAt && Boolean(rec.cookie || shouldRecover10086CookieByYunpan(rec)),
  )
  const results = await runPool(
    runnable,
    args.concurrency ?? getMaintenanceConcurrency(),
    async (rec) => {
      const result = await executeCookieMaintenance(rec.id).catch((error: unknown) => ({
        status: 'failed' as const,
        message: error instanceof Error ? error.message : 'CK 维护失败',
      }))
      return { accountId: rec.id, status: result.status, message: result.message }
    },
  )
  const success = results.filter((item) => item.status === 'success').length
  const failed = results.filter((item) => item.status === 'failed').length
  const skipped = results.filter((item) => item.status === 'skipped').length
  await logEvent({
    action: 'ck_maintenance.run_now',
    message: `success=${success} failed=${failed} skipped=${skipped}`,
    meta: { source: args.source ?? 'maintenance', total: runnable.length },
  }).catch(() => undefined)
  return { total: runnable.length, success, failed, skipped, results }
}

export const __test__ = {
  formatCmccAutoCheckinMessage,
  classifyQqtMembership,
  combineRefreshSignWedResult,
  currentQqtSignState,
  isNonQqtAccount,
  normalizeRecentTaskLimit,
  planGlobalTelecomResignDays,
  planGlobalTelecomBlindBoxTasks,
  shouldPersistInvalidFromActivateFailure,
  shouldUseDailySkip,
}

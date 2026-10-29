export type ApiSuccess<T> = {
  ok: true
  data: T
  message?: string
  requestId?: string
}

export type ApiFailure = {
  ok: false
  message: string
  errorCode?: string
  requestId?: string
  phase?: string
  debug?: unknown
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure

export type AccessActorType = 'admin' | 'user' | 'anonymous'

export type AccessLog = {
  id: string
  createdAt: string
  actorType: AccessActorType
  actorId?: string
  actorName?: string
  feature: string
  action: string
  method: string
  path: string
  statusCode: number
  success: boolean
  durationMs: number
  ipAddress?: string
  userAgent?: string
  referer?: string
  requestId?: string
  meta?: Record<string, unknown>
}

export type AccessLogListData = {
  logs: AccessLog[]
  page: number
  limit: number
  total: number
  features: string[]
}

export type AccountLoginMethod = 'cmcc_sms' | 'cmcc_qr' | 'yunpan' | 'manual_cookie'
export type AccountCookieSource = 'sms' | 'qr' | 'yunpan' | 'manual' | 'qqt_sso'

/** The actual account shape returned by GET /api/accounts. */
export type AccountSummary = {
  id: string
  userId?: string
  ownerUsername?: string
  ownerDisplayName?: string
  label?: string
  phone?: string
  publicLinkIds?: string[]
  phoneMasked: string
  displayPhone?: string
  hasCookie: boolean
  cookieUpdatedAt?: string
  cookieInvalidAt?: string
  cookieInvalidReason?: string
  lastLoginMethod?: AccountLoginMethod
  lastLoginAt?: string
  cookieSource?: AccountCookieSource
  cookieExpireAt?: string
  cookieTtlSeconds?: number
  activationInfo?: Record<string, unknown>
  activationCheckedAt?: string
  updatedAt: string
  newHomeUrl?: string
  qqtAccessToken?: string
  qqtAccessTokenCheckedAt?: string
  hasYunpanSession?: boolean
  yunpanSessionUpdatedAt?: string
  yunpanSessionCheckedAt?: string
  yunpanSessionInvalidAt?: string
  hasCmccAppCookie?: boolean
  cmccAppCookieUpdatedAt?: string
  hasWedRechargeCookie?: boolean
  wedRechargeCookieUpdatedAt?: string
  qqtInfo?: Record<string, unknown>
  qqtSignInfo?: Record<string, unknown>
  qqtSignResult?: Record<string, unknown>
  qqtSignUpdatedAt?: string
  xdrReceive?: Record<string, unknown>
  xdrReceiveUpdatedAt?: string
  wedRechargeInfo?: Record<string, unknown>
  wedRechargeUpdatedAt?: string
  smsLoginAt?: string
  smsLoginExpireAt?: string
  disabledAt?: string
  disabledReason?: string
}

export type AccountsListData = {
  accounts: AccountSummary[]
}

export type AccountsListResponse = ApiResponse<AccountsListData>
export type AccountSummaryResponse = ApiResponse<{ account: AccountSummary }>

export type V2StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

export type V2AccountHealthStatus =
  | 'disabled'
  | 'invalid'
  | 'expired'
  | 'expiring'
  | 'maintenance'
  | 'healthy'
  | 'unknown'

export type V2AccountHealth = {
  status: V2AccountHealthStatus
  label: string
  tone: V2StatusTone
  reason?: string
  description?: string
  actionLabel?: string
  priority?: number
  expiresAt?: string
  remainingMs?: number
}

export type V2CredentialStatus =
  | 'available'
  | 'recoverable'
  | 'missing'
  | 'invalid'
  | 'unknown'

export type V2CredentialHealth = {
  core: V2CredentialStatus
  yunpan: V2CredentialStatus
  cmccApp: V2CredentialStatus
  wedRecharge: V2CredentialStatus
  qqt: V2CredentialStatus
}

export type V2Account = {
  id: string
  label: string
  displayPhone?: string
  phoneMasked: string
  phone?: string
  publicLinkIds: string[]
  health: V2AccountHealth
  credentialHealth: V2CredentialHealth
  hasCookie: boolean
  hasYunpanSession: boolean
  hasCmccAppCookie: boolean
  hasWedRechargeCookie: boolean
  cookieExpireAt?: string
  updatedAt: string
  raw?: AccountSummary
}

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

export type BatchTaskScopeType =
  | 'admin_all'
  | 'public_link'
  | 'account'
  | 'selected_accounts'
  | 'user'

export type BatchTaskStatus =
  | 'pending'
  | 'running'
  | 'success'
  | 'failed'
  | 'partial_success'

export type BatchTaskItemStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped'

export type BatchTaskItem = {
  id: string
  accountId: string
  accountLabel?: string
  orderIndex: number
  status: BatchTaskItemStatus
  message?: string
  startedAt?: string
  finishedAt?: string
}

/** The task summary returned by active, detail, start and cancel task endpoints. */
export type BatchTask = {
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
  items: BatchTaskItem[]
}

export type BatchTaskSummary = BatchTask
export type V2BatchTask = BatchTask
export type V2TaskType = BatchTaskType

export type V2QqtTokenExport = {
  exportedAt: string
  total: number
  skipped: number
  skipReasons: Record<string, number>
  tokens: Array<{
    accountId: string
    phoneMasked: string
    accessToken: string
    accessTokenExpiresAt?: string
  }>
}
export type BatchTaskResponse = ApiResponse<{ task: BatchTask | null }>
export type BatchTaskListResponse = ApiResponse<{ tasks: BatchTask[] }>
export type BatchTaskStartResponse = ApiResponse<{ task: BatchTask; reused: boolean }>

export type WedRechargeAppTokenLoginInput = {
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

export type StartBatchTaskInput = {
  scopeType?: BatchTaskScopeType
  scopeId?: string
  accountIds?: string[]
  sspid?: string
  timezone?: string
  forceDaily?: boolean
  count?: number
  taskId?: string
  activityId?: string
  draw?: boolean
  drawAfterRun?: boolean
  autoTaskList?: boolean
  useAppToken?: boolean
  appTokenLogin?: WedRechargeAppTokenLoginInput
}

export type BatchTaskQuery = {
  scopeType?: BatchTaskScopeType
  scopeId?: string
  type?: BatchTaskType
}

export type TaskSchedule = {
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

export type TaskScheduleSummary = TaskSchedule
export type V2Schedule = TaskSchedule
export type TaskScheduleListResponse = ApiResponse<{ schedules: TaskSchedule[] }>
export type TaskScheduleResponse = ApiResponse<{ schedule: TaskSchedule }>
export type TaskScheduleDeleteResponse = ApiResponse<{ id: string }>

export type CreateTaskScheduleInput = {
  name: string
  times: string[] | string
  enabled?: boolean
  action?: BatchTaskType
  timezone?: string
  sspid?: string
}

export type UpdateTaskScheduleInput = {
  name?: string
  times?: string[] | string
  enabled?: boolean
  timezone?: string
  sspid?: string
}

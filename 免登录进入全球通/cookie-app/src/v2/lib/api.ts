import type {
  AccountSummary,
  AccountsListData,
  ApiFailure,
  ApiResponse,
  BatchTask,
  BatchTaskQuery,
  BatchTaskType,
  CreateTaskScheduleInput,
  StartBatchTaskInput,
  TaskSchedule,
  UpdateTaskScheduleInput,
  V2Account,
  V2BatchTask,
  V2Schedule,
  V2QqtTokenExport,
  AccessActorType,
  AccessLogListData,
} from './types'
import { toV2Account } from './accountHealth'

export const TASK_TYPE_ENDPOINT: Record<BatchTaskType, string> = {
  refresh: 'refresh',
  sign: 'sign',
  refresh_and_sign: 'refresh-and-sign',
  wed_recharge: 'wed-recharge',
  query_info: 'query-info',
  yunpan_activate: 'yunpan-activate',
  ck_maintenance: 'ck-maintenance',
  global_telecom_resign: 'global-telecom-resign',
  global_telecom_daily: 'global-telecom-daily',
  activity_session_refresh: 'activity-session-refresh',
  cmcc_session_exchange: 'cmcc-session-exchange',
  keepalive: 'keepalive',
  cmcc_auto_checkin: 'cmcc-auto-checkin',
}

export class ApiClientError extends Error {
  readonly status: number
  readonly errorCode?: string
  readonly requestId?: string
  readonly payload?: unknown

  constructor(args: {
    message: string
    status: number
    errorCode?: string
    requestId?: string
    payload?: unknown
  }) {
    super(args.message)
    this.name = 'ApiClientError'
    this.status = args.status
    this.errorCode = args.errorCode
    this.requestId = args.requestId
    this.payload = args.payload
  }
}

function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  if (!value || typeof value !== 'object') return false
  return typeof (value as { ok?: unknown }).ok === 'boolean'
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new ApiClientError({
      message: '服务端返回了无法解析的响应',
      status: response.status,
      payload: text,
    })
  }
}

export async function requestApiData<T>(
  input: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers)
  if (!headers.has('accept')) headers.set('accept', 'application/json')

  let response: Response
  try {
    response = await fetch(input, {
      ...init,
      headers,
      credentials: 'same-origin',
    })
  } catch (error) {
    throw new ApiClientError({
      message: error instanceof Error ? error.message : '网络请求失败',
      status: 0,
      payload: error,
    })
  }

  const payload = await parseResponseBody(response)
  if (!isApiResponse<T>(payload)) {
    throw new ApiClientError({
      message: '服务端返回了非标准 API 响应',
      status: response.status,
      payload,
    })
  }

  if (!payload.ok) {
    const failure = payload as ApiFailure
    throw new ApiClientError({
      message: failure.message || `请求失败 (${response.status})`,
      status: response.status,
      errorCode: failure.errorCode,
      requestId: failure.requestId,
      payload,
    })
  }

  if (!response.ok) {
    throw new ApiClientError({
      message: payload.message || `请求失败 (${response.status})`,
      status: response.status,
      requestId: payload.requestId,
      payload,
    })
  }

  return payload.data
}

export async function requestApiJson<T>(
  input: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: unknown,
  init: Omit<RequestInit, 'method' | 'body'> = {},
): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('content-type', 'application/json')
  return requestApiData<T>(input, {
    ...init,
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

export async function loadAccessLogs(options: {
  page?: number
  limit?: number
  actorType?: AccessActorType
  feature?: string
  success?: boolean
  search?: string
} = {}): Promise<AccessLogListData> {
  return requestApiData<AccessLogListData>(appendQuery('/api/access-logs', options))
}

function appendQuery(
  path: string,
  values: Record<string, string | number | boolean | undefined>,
): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== '') query.set(key, String(value))
  }
  const suffix = query.toString()
  return suffix ? `${path}?${suffix}` : path
}

export async function listAccounts(options: { includeDisabled?: boolean } = {}): Promise<AccountSummary[]> {
  const path = appendQuery('/api/accounts', {
    includeDisabled: options.includeDisabled ? 1 : undefined,
    view: 'v2',
  })
  const data = await requestApiData<AccountsListData>(path)
  return data.accounts
}

export async function loadV2Accounts(
  options: { includeDisabled?: boolean } = {},
): Promise<V2Account[]> {
  const accounts = await listAccounts({
    includeDisabled: options.includeDisabled ?? true,
  })
  return accounts.map((account) => toV2Account(account))
}

export async function deleteAccounts(accountIds: string[]): Promise<string[]> {
  const data = await requestApiJson<{ deleted: string[] }>('/api/accounts/batch/delete', 'POST', {
    accountIds: Array.from(new Set(accountIds)).filter(Boolean),
  })
  return data.deleted
}

export async function exportValidQqtTokens(): Promise<V2QqtTokenExport> {
  return requestApiJson<V2QqtTokenExport>(
    '/api/accounts/qqt/tokens/export?refresh=0&strict=1',
    'POST',
    { refresh: false, strict: true },
  )
}

export async function getAccountSummary(accountId: string): Promise<AccountSummary> {
  const data = await requestApiData<{ account: AccountSummary }>(
    `/api/accounts/${encodeURIComponent(accountId)}/summary`,
  )
  return data.account
}

export async function getActiveTask(query: BatchTaskQuery = {}): Promise<BatchTask | null> {
  const path = appendQuery('/api/tasks/active', query)
  const data = await requestApiData<{ task: BatchTask | null }>(path)
  return data.task
}

export async function listActiveTasks(query: BatchTaskQuery = {}): Promise<BatchTask[]> {
  const path = appendQuery('/api/tasks/active-list', query)
  const data = await requestApiData<{ tasks: BatchTask[] }>(path)
  return data.tasks
}

export async function loadActiveTasks(query: BatchTaskQuery = {}): Promise<V2BatchTask[]> {
  return listActiveTasks(query)
}

export async function listRecentTasks(limit = 50): Promise<BatchTask[]> {
  const path = appendQuery('/api/tasks/list', { limit })
  const data = await requestApiData<{ tasks: BatchTask[] }>(path)
  return data.tasks
}

export async function loadRecentTasks(limit = 50): Promise<V2BatchTask[]> {
  return listRecentTasks(limit)
}

export async function getBatchTask(taskId: string): Promise<BatchTask | null> {
  const data = await requestApiData<{ task: BatchTask | null }>(
    `/api/tasks/${encodeURIComponent(taskId)}`,
  )
  return data.task
}

export async function getTask(taskId: string): Promise<V2BatchTask | null> {
  return getBatchTask(taskId)
}

export async function startBatchTask(
  type: BatchTaskType,
  input: StartBatchTaskInput = {},
): Promise<{ task: BatchTask; reused: boolean }> {
  return requestApiJson<{ task: BatchTask; reused: boolean }>(
    `/api/tasks/${TASK_TYPE_ENDPOINT[type]}`,
    'POST',
    input,
  )
}

export async function cancelBatchTask(taskId: string): Promise<BatchTask | null> {
  const data = await requestApiJson<{ task: BatchTask | null }>(
    `/api/tasks/${encodeURIComponent(taskId)}/cancel`,
    'POST',
    {},
  )
  return data.task
}

export async function cancelTask(taskId: string): Promise<V2BatchTask | null> {
  return cancelBatchTask(taskId)
}

export async function listTaskSchedules(): Promise<TaskSchedule[]> {
  const data = await requestApiData<{ schedules: TaskSchedule[] }>('/api/tasks/schedules/list')
  return data.schedules
}

export async function loadSchedules(): Promise<V2Schedule[]> {
  return listTaskSchedules()
}

export async function createTaskSchedule(
  input: CreateTaskScheduleInput,
): Promise<TaskSchedule> {
  const data = await requestApiJson<{ schedule: TaskSchedule }>(
    '/api/tasks/schedules',
    'POST',
    input,
  )
  return data.schedule
}

export async function updateTaskSchedule(
  scheduleId: string,
  input: UpdateTaskScheduleInput,
): Promise<TaskSchedule> {
  const data = await requestApiJson<{ schedule: TaskSchedule }>(
    `/api/tasks/schedules/${encodeURIComponent(scheduleId)}`,
    'PUT',
    input,
  )
  return data.schedule
}

export async function deleteTaskSchedule(scheduleId: string): Promise<string> {
  const data = await requestApiJson<{ id: string }>(
    `/api/tasks/schedules/${encodeURIComponent(scheduleId)}`,
    'DELETE',
  )
  return data.id
}

export const v2Api = {
  accounts: {
    list: loadV2Accounts,
    listRaw: listAccounts,
    getSummary: getAccountSummary,
  },
  tasks: {
    getActive: getActiveTask,
    listActive: loadActiveTasks,
    listRecent: loadRecentTasks,
    get: getTask,
    start: startBatchTask,
    cancel: cancelTask,
  },
  schedules: {
    list: loadSchedules,
    create: createTaskSchedule,
    update: updateTaskSchedule,
    delete: deleteTaskSchedule,
  },
} as const

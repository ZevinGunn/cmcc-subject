import type { AccountRecord } from './accountsStore.js'

export type QqtTokenExportOptions = {
  updatedWithinMinutes: number
  validForMinutes: number
  minValidUntil?: Date
  excludeNonQqt: boolean
  excludeXdrReceived: boolean
  excludeMonthlyReceived: boolean
  requireQqtInfo?: boolean
  requireXdrInfo?: boolean
  requireMonthlyInfo?: boolean
  now?: Date
}

export type QqtTokenExportToken = {
  accountId: string
  phone?: string
  phoneMasked: string
  displayPhone?: string
  accessToken: string
  accessTokenCheckedAt?: string
  accessTokenUpdatedAt?: string
  accessTokenExpiresAt?: string
  xdrReceiveUpdatedAt?: string
  qqtSignUpdatedAt?: string
  isQqtUser: boolean
  monthlyReceived: boolean
  xdrReceived: boolean
}

export type QqtTokenExportSkipReason =
  | 'disabled'
  | 'missingToken'
  | 'missingTokenTime'
  | 'tokenTooOld'
  | 'tokenExpired'
  | 'nonQqtUser'
  | 'unconfirmedQqtUser'
  | 'unconfirmedXdrStatus'
  | 'unconfirmedMonthlyStatus'
  | 'xdrReceived'
  | 'monthlyReceived'

export type QqtTokenExportResult = {
  exportedAt: string
  total: number
  skipped: number
  skipReasons: Record<QqtTokenExportSkipReason, number>
  tokens: QqtTokenExportToken[]
}

const SKIP_REASONS: QqtTokenExportSkipReason[] = [
  'disabled',
  'missingToken',
  'missingTokenTime',
  'tokenTooOld',
  'tokenExpired',
  'nonQqtUser',
  'unconfirmedQqtUser',
  'unconfirmedXdrStatus',
  'unconfirmedMonthlyStatus',
  'xdrReceived',
  'monthlyReceived',
]

export function normalizeExportOptions(
  input?: Partial<QqtTokenExportOptions>,
): QqtTokenExportOptions {
  return {
    updatedWithinMinutes: clampInt(input?.updatedWithinMinutes, 60, 1, 24 * 60),
    validForMinutes: clampInt(input?.validForMinutes, 120, 1, 24 * 60),
    minValidUntil: input?.minValidUntil,
    excludeNonQqt: input?.excludeNonQqt ?? true,
    excludeXdrReceived: input?.excludeXdrReceived ?? true,
    excludeMonthlyReceived: input?.excludeMonthlyReceived ?? true,
    requireQqtInfo: input?.requireQqtInfo ?? false,
    requireXdrInfo: input?.requireXdrInfo ?? false,
    requireMonthlyInfo: input?.requireMonthlyInfo ?? false,
    now: input?.now,
  }
}

export function buildQqtTokenExport(
  accounts: AccountRecord[],
  optionsInput?: Partial<QqtTokenExportOptions>,
): QqtTokenExportResult {
  const options = normalizeExportOptions(optionsInput)
  const now = options.now ?? new Date()
  const newestAllowedMs = now.getTime() - options.updatedWithinMinutes * 60_000
  const minValidUntilMs = Math.max(
    now.getTime(),
    options.minValidUntil?.getTime() ?? now.getTime(),
  )
  const skipReasons = emptySkipReasons()
  const tokens: QqtTokenExportToken[] = []

  for (const account of accounts) {
    const reason = getSkipReason(account, options, newestAllowedMs, minValidUntilMs)
    if (reason) {
      skipReasons[reason] += 1
      continue
    }

    const checkedAt = account.qqtAccessTokenCheckedAt
    const checkedAtMs = Date.parse(checkedAt || '')
    const expiresAt = new Date(checkedAtMs + options.validForMinutes * 60_000)
    tokens.push({
      accountId: account.id,
      phone: account.phone || undefined,
      phoneMasked: maskPhone(account.phone),
      displayPhone: account.displayPhone || undefined,
      accessToken: String(account.qqtAccessToken || '').trim(),
      accessTokenCheckedAt: checkedAt,
      accessTokenUpdatedAt: checkedAt,
      accessTokenExpiresAt: expiresAt.toISOString(),
      xdrReceiveUpdatedAt: account.xdrReceiveUpdatedAt,
      qqtSignUpdatedAt: account.qqtSignUpdatedAt,
      isQqtUser: isQqtUser(account.qqtInfo),
      monthlyReceived: hasMonthlyReceived(account.qqtSignInfo, account.qqtSignResult, now),
      xdrReceived: hasXdrReceived(account.xdrReceive),
    })
  }

  return {
    exportedAt: now.toISOString(),
    total: tokens.length,
    skipped: accounts.length - tokens.length,
    skipReasons,
    tokens,
  }
}

function getSkipReason(
  account: AccountRecord,
  options: QqtTokenExportOptions,
  newestAllowedMs: number,
  minValidUntilMs: number,
): QqtTokenExportSkipReason | undefined {
  if (account.disabledAt) return 'disabled'
  const token = String(account.qqtAccessToken || '').trim()
  if (!token) return 'missingToken'

  const checkedAtMs = Date.parse(account.qqtAccessTokenCheckedAt || '')
  if (!Number.isFinite(checkedAtMs)) return 'missingTokenTime'
  if (checkedAtMs < newestAllowedMs) return 'tokenTooOld'
  if (checkedAtMs + options.validForMinutes * 60_000 <= minValidUntilMs) {
    return 'tokenExpired'
  }

  if (options.requireQqtInfo && !account.qqtInfo) return 'unconfirmedQqtUser'
  if (options.excludeNonQqt && !isQqtUser(account.qqtInfo)) return 'nonQqtUser'
  if (options.requireXdrInfo && !account.xdrReceive) return 'unconfirmedXdrStatus'
  if (options.excludeXdrReceived && hasXdrReceived(account.xdrReceive)) return 'xdrReceived'
  if (options.requireMonthlyInfo && !account.qqtSignInfo && !account.qqtSignResult) {
    return 'unconfirmedMonthlyStatus'
  }
  if (
    options.excludeMonthlyReceived &&
    hasMonthlyReceived(account.qqtSignInfo, account.qqtSignResult, options.now ?? new Date())
  ) {
    return 'monthlyReceived'
  }
  return undefined
}

export function isQqtUser(info?: Record<string, unknown>): boolean {
  if (!info) return false
  const text = JSON.stringify(info).toLowerCase()
  if (/(非全球通|不是全球通|未开通全球通|not\s*qqt|not\s*global)/i.test(text)) {
    return false
  }
  const data = recordValue(info, 'data')
  const levelCandidates = [
    valueByKeys(info, ['vipLevel', 'level', 'userLevel', 'qqtLevel', 'custLevel']),
    data ? valueByKeys(data, ['vipLevel', 'level', 'userLevel', 'qqtLevel', 'custLevel']) : undefined,
  ]
  if (levelCandidates.some((value) => isMeaningfulQqtValue(value))) return true
  return /(全球通|global|qqt|vip|钻|金卡|银卡|白金|黑金|等级|星级)/i.test(text)
}

export function hasXdrReceived(receive?: Record<string, unknown>): boolean {
  return findPositiveNumbersByKey(receive, 'prodList').length > 0
}

export function hasMonthlyReceived(
  signInfo?: Record<string, unknown>,
  signResult?: Record<string, unknown>,
  now: Date = new Date(),
): boolean {
  const values = [signInfo, signResult]
  for (const value of values) {
    if (!value) continue
    if (hasCurrentMonthSuccess(value, now)) return true
    const text = JSON.stringify(value)
    if (/(本月.{0,12}(已领取|已兑换|已抢兑)|已领取.{0,12}本月|每月权益.{0,12}(已领取|已兑换))/i.test(text)) {
      return true
    }
  }
  return false
}

function hasCurrentMonthSuccess(value: unknown, now: Date): boolean {
  if (!value) return false
  if (Array.isArray(value)) return value.some((item) => hasCurrentMonthSuccess(item, now))
  if (typeof value !== 'object') return false
  const obj = value as Record<string, unknown>
  const dateValue = valueByKeys(obj, [
    'receiveTime',
    'receivedAt',
    'acceptTime',
    'createTime',
    'updateTime',
    'time',
    'date',
  ])
  const date = parseLooseDate(dateValue)
  const statusText = JSON.stringify(obj)
  const success =
    /(成功|已领取|已兑换|已抢兑|success|received|accepted)/i.test(statusText) ||
    Number(valueByKeys(obj, ['status', 'code', 'resultCode'])) === 0
  if (date && isSameMonth(date, now) && success) return true
  return Object.values(obj).some((nested) => hasCurrentMonthSuccess(nested, now))
}

function findPositiveNumbersByKey(value: unknown, key: string): number[] {
  if (!value) return []
  if (Array.isArray(value)) {
    const direct = value
      .map((item) => Number(item))
      .filter((item) => Number.isFinite(item) && item > 0)
    if (direct.length > 0) return direct
    return value.flatMap((item) => findPositiveNumbersByKey(item, key))
  }
  if (typeof value !== 'object') return []
  const obj = value as Record<string, unknown>
  if (key in obj) {
    const direct = findPositiveNumbersByKey(obj[key], key)
    if (direct.length > 0) return direct
  }
  return Object.values(obj).flatMap((item) => findPositiveNumbersByKey(item, key))
}

function isMeaningfulQqtValue(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'number') return Number.isFinite(value) && value > 0
  const text = String(value).trim()
  return Boolean(text && !['0', '-1', 'false', 'none', 'null', 'undefined'].includes(text.toLowerCase()))
}

function recordValue(value: Record<string, unknown>, key: string): Record<string, unknown> | undefined {
  const nested = value[key]
  return nested && typeof nested === 'object' && !Array.isArray(nested)
    ? (nested as Record<string, unknown>)
    : undefined
}

function valueByKeys(value: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (key in value) return value[key]
  }
  return undefined
}

function parseLooseDate(value: unknown): Date | undefined {
  if (value === null || value === undefined) return undefined
  if (typeof value === 'number') {
    const ms = value > 10_000_000_000 ? value : value * 1000
    const date = new Date(ms)
    return Number.isFinite(date.getTime()) ? date : undefined
  }
  const text = String(value).trim()
  if (!text) return undefined
  const normalized = text.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')
  const date = new Date(normalized)
  return Number.isFinite(date.getTime()) ? date : undefined
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function clampInt(value: unknown, fallback: number, min: number, max: number): number {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.max(min, Math.min(max, Math.floor(n)))
}

function maskPhone(phone?: string): string {
  if (!phone || !/^1\d{10}$/.test(phone)) return ''
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`
}

function emptySkipReasons(): Record<QqtTokenExportSkipReason, number> {
  return Object.fromEntries(SKIP_REASONS.map((key) => [key, 0])) as Record<
    QqtTokenExportSkipReason,
    number
  >
}

export const __test__ = {
  buildQqtTokenExport,
  normalizeExportOptions,
  isQqtUser,
  hasXdrReceived,
  hasMonthlyReceived,
}

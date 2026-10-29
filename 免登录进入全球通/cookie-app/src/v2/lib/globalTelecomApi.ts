import { ApiClientError, requestApiData, requestApiJson } from './api'
import { getYunpanCredentialStatus } from '@/lib/accountLoginState'

export type GlobalTelecomAccount = {
  id: string
  label?: string
  phoneMasked?: string
  displayPhone?: string
  hasCookie?: boolean
  qqtAccessToken?: string
  hasYunpanSession?: boolean
  yunpanSessionCheckedAt?: string
  yunpanSessionInvalidAt?: string
}

export function canQueryGlobalTelecomAccount(account: GlobalTelecomAccount): boolean {
  return account.hasCookie !== false || Boolean(account.qqtAccessToken) || Boolean(account.hasYunpanSession)
}

export function selectGlobalTelecomAccountId(accounts: GlobalTelecomAccount[], requestedId: string, currentId = ''): string {
  if (currentId && accounts.some((account) => account.id === currentId)) return currentId
  if (requestedId) return accounts.some((account) => account.id === requestedId) ? requestedId : ''
  return accounts[0]?.id || ''
}

function readableAccountPhone(value?: string): string | undefined {
  const phone = String(value || '').trim()
  if (/^1\d{10}$/.test(phone)) return `${phone.slice(0, 3)}****${phone.slice(-4)}`
  if (/^1\d{2}\*{4}\d{4}$/.test(phone)) return phone
  return undefined
}

export function formatGlobalTelecomAccountOption(account: GlobalTelecomAccount): string {
  const phone = readableAccountPhone(account.displayPhone) || readableAccountPhone(account.phoneMasked)
  const label = String(account.label || '').trim()
  const normalizedLabelPhone = readableAccountPhone(label)
  const identity = phone || normalizedLabelPhone || '未识别手机号'
  return `${identity} · 云盘 CK ${getYunpanCredentialStatus(account).label}`
}

export type GlobalTelecomDay = {
  dayNum: number
  signStatus: number
  reSign: boolean
  tasks: Array<{ taskId: number; taskStatus: number }>
  prize?: {
    prizeId: string
    prizeName: string
    kind?: number
    prizeStatus?: number
    isVirtual?: boolean
  }
}

export function getTodaySignAction(days: GlobalTelecomDay[], signError?: string): {
  canSign: boolean
  label: '签到不可用' | '今日签到' | '今日已签到'
} {
  const hasUsableData = days.length > 0 && !signError
  if (!hasUsableData) return { canSign: false, label: '签到不可用' }
  const canSign = days.some((day) => day.signStatus === 0)
  return { canSign, label: canSign ? '今日签到' : '今日已签到' }
}

export type GlobalTelecomOverview = {
  refreshedAt: string
  cache: {
    status: 'live' | 'fresh-cache' | 'stale-cache' | 'persistent-cache'
    expiresAt: string
    retryAfterSeconds: number
  }
  identity: {
    levelCode?: string
    levelName?: string
    phoneMasked?: string
    province?: string
    netAge?: string
    joinedAt?: string
    gsmState?: string
  }
  xdr: {
    availableCount: number
    freeCount: number
    paidCount: number
    claimedProductIds: number[]
  }
  sign: {
    reSignRemaining: number
    days: GlobalTelecomDay[]
  }
  blindBox: {
    drawTotal: number
    drawUsed: number
    drawRemaining: number
    tasks: Array<{ number: number; completed: boolean; name?: string; available?: boolean; unavailableReason?: string; opensAt?: string; url?: string; completedAt?: number }>
    campaignMonth?: string
    drawLimit?: number
    drawAllowed?: boolean
    unavailableReason?: string
    prizes: Array<{ prizeCode: string; imageUrl?: string }>
  }
  manager?: {
    name?: string
    nickname?: string
    serviceNumber?: string
    teamName?: string
    groupName?: string
    cityName?: string
    staffLevel?: string
    staffId?: string
    available: boolean
  }
  growth?: {
    year?: string
    month?: string
    currentLevel?: string
    nextLevel?: string
    annualGrowthValue?: number
    nextLevelGrowthValue?: number
    remainingGrowthValue?: number
    growthValueEnabled?: boolean
    shieldingPeriod?: boolean
    levels: Array<{ name: string; value?: number; label: string }>
    monthlyGrowthValues: Array<{ month: string; value: number; rawValue: string }>
  }
  errors: Partial<Record<'identity' | 'xdr' | 'sign' | 'blindBox' | 'manager' | 'growth' | 'system', string>>
}

type OverviewResponse = {
  account: GlobalTelecomAccount
  overview: GlobalTelecomOverview | null
}

type ActionResponse = { result: unknown; blindBoxPrize?: { prizeCode: string; prizeName?: string; fulfillmentUrl?: string } }

function accessBody(publicLinkId?: string, sspid?: string): Record<string, string> {
  return {
    ...(publicLinkId ? { publicLinkId } : {}),
    ...(sspid ? { sspid } : {}),
  }
}

export function getGlobalTelecomBackHref(publicMode: boolean, pathname: string, publicLinkId: string): string {
  if (!publicMode) return '/v2/benefits'
  const path = pathname.startsWith('/app/cmcc-public') ? '/' : '/public'
  return publicLinkId ? `${path}?link=${encodeURIComponent(publicLinkId)}` : path
}

export async function loadGlobalTelecomAccounts(args: {
  publicMode: boolean
  publicLinkId?: string
}): Promise<GlobalTelecomAccount[]> {
  if (args.publicMode) {
    try {
      // The signed-in user owns accounts beyond those originally bound to the invite link.
      const data = await requestApiData<{ accounts: GlobalTelecomAccount[] }>('/api/auth/accounts')
      return data.accounts
    } catch (error) {
      // Only a confirmed anonymous session may use the invite's narrower account scope.
      if (!args.publicLinkId || !(error instanceof ApiClientError) || error.status !== 401) throw error
    }
  }
  if (args.publicLinkId) {
    const data = await requestApiData<{ accounts: GlobalTelecomAccount[] }>(
      `/api/accounts/public/link/${encodeURIComponent(args.publicLinkId)}/accounts`,
    )
    return data.accounts
  }
  const data = await requestApiData<{ accounts: GlobalTelecomAccount[] }>('/api/accounts?view=v2')
  return data.accounts
}

export function normalizeGlobalTelecomOverviewResponse(result: OverviewResponse): OverviewResponse {
  if (!result.overview) return result
  const legacyGrowth = result.overview.growth as (GlobalTelecomOverview['growth'] & {
    total?: number
    required?: number
    remaining?: number
    monthlyConsumption?: Array<{ month: string; bill: number; rawBill: string }>
  }) | undefined
  return {
    ...result,
    overview: {
      ...result.overview,
      cache: result.overview.cache ?? {
        status: 'live',
        expiresAt: new Date(Date.now() + 60_000).toISOString(),
        retryAfterSeconds: 60,
      },
      growth: legacyGrowth ? {
        ...legacyGrowth,
        annualGrowthValue: legacyGrowth.annualGrowthValue ?? legacyGrowth.total,
        nextLevelGrowthValue: legacyGrowth.nextLevelGrowthValue ?? legacyGrowth.required,
        remainingGrowthValue: legacyGrowth.remainingGrowthValue ?? legacyGrowth.remaining,
        monthlyGrowthValues: legacyGrowth.monthlyGrowthValues ?? legacyGrowth.monthlyConsumption?.map((item) => ({
          month: item.month,
          value: item.bill,
          rawValue: item.rawBill,
        })) ?? [],
      } : undefined,
    },
  }
}

export function loadGlobalTelecomOverview(args: {
  accountId: string
  publicLinkId?: string
  sspid: string
  cacheOnly?: boolean
}): Promise<OverviewResponse> {
  return requestApiJson<OverviewResponse>(
    `/api/accounts/${encodeURIComponent(args.accountId)}/global-telecom/overview`,
    'POST',
    { ...accessBody(args.publicLinkId, args.sspid), ...(args.cacheOnly ? { cacheOnly: true } : {}) },
  ).then(normalizeGlobalTelecomOverviewResponse)
}

export function loadGlobalTelecomCustomerServiceLink(args: {
  accountId: string
  publicLinkId?: string
  province?: string
}): Promise<{ ssoUrl: string; province: string }> {
  return requestApiJson(
    `/api/accounts/${encodeURIComponent(args.accountId)}/global-telecom/customer-service-link`,
    'POST',
    {
      ...accessBody(args.publicLinkId),
      ...(args.province ? { province: args.province } : {}),
    },
  )
}

export function signGlobalTelecom(args: {
  accountId: string
  publicLinkId?: string
  sspid: string
}): Promise<ActionResponse> {
  return requestApiJson(
    `/api/accounts/${encodeURIComponent(args.accountId)}/global-telecom/sign`,
    'POST',
    { ...accessBody(args.publicLinkId, args.sspid), confirmationText: '确认签到' },
  )
}

export function resignGlobalTelecom(args: {
  accountId: string
  publicLinkId?: string
  sspid: string
  dayNum: number
  taskIds: number[]
}): Promise<ActionResponse> {
  return requestApiJson(
    `/api/accounts/${encodeURIComponent(args.accountId)}/global-telecom/resign`,
    'POST',
    { ...accessBody(args.publicLinkId, args.sspid), dayNum: args.dayNum, taskIds: args.taskIds, confirmationText: '确认补签' },
  )
}

export function acceptGlobalTelecomReward(args: {
  accountId: string
  publicLinkId?: string
  sspid: string
  dayNum: number
  prizeId: string
  isVirtual?: boolean
}): Promise<ActionResponse> {
  return requestApiJson(
    `/api/accounts/${encodeURIComponent(args.accountId)}/global-telecom/reward`,
    'POST',
    { ...accessBody(args.publicLinkId, args.sspid), dayNum: args.dayNum, prizeId: args.prizeId, isVirtual: Boolean(args.isVirtual), confirmationText: '确认补领' },
  )
}

export function runGlobalTelecomBlindBoxAction(args: {
  accountId: string
  publicLinkId?: string
  sspid: string
  action: 'draw' | 'receive' | 'complete-task' | 'complete-all'
  prizeCode?: string
  taskNumber?: number
}): Promise<ActionResponse> {
  const confirmationText = args.action === 'draw'
    ? '确认抽奖'
    : args.action === 'receive'
      ? '确认领取'
      : args.action === 'complete-all' ? '确认完成全部任务' : '确认完成任务'
  return requestApiJson(
    `/api/accounts/${encodeURIComponent(args.accountId)}/global-telecom/blind-box`,
    'POST',
    {
      ...accessBody(args.publicLinkId, args.sspid),
      action: args.action,
      prizeCode: args.prizeCode,
      taskNumber: args.taskNumber,
      confirmationText,
    },
  )
}

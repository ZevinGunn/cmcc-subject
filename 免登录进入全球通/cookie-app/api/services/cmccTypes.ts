export type ApiOk<T> = {
  ok: true
  data: T
  message?: string
  requestId?: string
}

export type ApiErr = {
  ok: false
  message: string
  errorCode?: string
  requestId?: string
  phase?: string
  debug?: unknown
}

export type ApiResp<T> = ApiOk<T> | ApiErr

export type SendSmsResp = ApiResp<{ cooldownSeconds: number }>

export type LoginResp = ApiResp<{ cookie: string }>
export type QqtSmsLoginResp = ApiResp<{ accessToken: string }>

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
  lastLoginMethod?: 'cmcc_sms' | 'cmcc_qr' | 'yunpan' | 'manual_cookie'
  lastLoginAt?: string
  cookieSource?: 'sms' | 'qr' | 'yunpan' | 'manual' | 'qqt_sso'
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
  hasAigouSession?: boolean
  aigouSessionUpdatedAt?: string
  hasBuildingBricksSession?: boolean
  hasDiamondPackageSession?: boolean
  hasSmartLifeSession?: boolean
  hasFiveGaSession?: boolean
  cocPackageSessionsUpdatedAt?: string
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
  publicPinnedAt?: string
  publicSortOrder?: number
}

export type AccountsListResp = ApiResp<{ accounts: AccountSummary[] }>

export type AccountUpsertResp = ApiResp<{ account: AccountSummary }>

export type AccountsCleanupResp = ApiResp<{
  deleted: number
  kept: number
  refreshed: number
  deletedIds: string[]
}>

export type AccountCookieResp = ApiResp<{ cookie: string }>

export type AccountCookieSetResp = ApiResp<{ cookie: string }>

export type AccountActivateResp = ApiResp<{
  encrypted: string
  decrypted: string
  cookieUpdated: boolean
  phoneUpdated?: boolean
}>

export type AccountRefreshResp = ApiResp<{
  cookie: string
  cookieUpdated: boolean
  accessToken?: string
  tokenUpdated?: boolean
}>

export type AccountSessionBridgeResp = ApiResp<{
  cookie: string
  cookieUpdated: boolean
  sessionTokenUpdated?: boolean
  fields?: string[]
  finalUrl?: string
  steps?: Array<{
    name: string
    status: number
    cookieUpdated: boolean
    location?: string
  }>
}>

export type AccountSessionCapabilitiesResp = ApiResp<{
  hasCookie: boolean
  fields: Record<string, boolean>
  availableFields: string[]
  missingFields: string[]
  groups: {
    activity: boolean
    pcSso: boolean
    cmccApp: boolean
    basic10086: boolean
  }
  summary: string
}>

export type QqtTokenResp = ApiResp<{
  accessToken: string
  userInfo?: unknown
}>

export type QqtSignResp = ApiResp<{
  accessToken: string
  result: unknown
  signInfo?: unknown
  acceptSummary?: {
    total: number
    success: number
    failed: number
    results: Array<{
      dayNum: number
      prizeId: string
      prizeName?: string
      ok: boolean
      message?: string
    }>
  }
}>

export type QqtSignInfoResp = ApiResp<{
  accessToken: string
  info: unknown
}>

export type QqtXdrReceiveResp = ApiResp<{
  accessToken: string
  receive: unknown
}>

export type QqtTokenExportResp = ApiResp<{
  exportedAt: string
  total: number
  skipped: number
  skipReasons: Record<string, number>
  tokens: Array<{
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
  }>
}>

export type HarParseResp = ApiResp<{
  cookie: string
  headers: Record<string, string>
  newHomeUrl: string
}>

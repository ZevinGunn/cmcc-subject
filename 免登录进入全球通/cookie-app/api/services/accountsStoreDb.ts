import crypto from 'node:crypto'
import type { Prisma } from '@prisma/client'
import { maybeDecryptString, maybeEncryptString, encryptJson } from './cryptoBox.js'
import { getPrisma } from './prisma.js'
import {
  deleteEncryptedCredentialsForAccounts,
  getEncryptedCredentialRow,
  getEncryptedCredentialRows,
  upsertEncryptedCredentialRow,
  compareAndSwapYunpanSession,
  type EncryptedCredentialRow,
  type EncryptedCredentialWrite,
} from './credentialsStore.js'
import type { CocPackageSessionMap, CocPackageSessionRecord, CocPackageTarget } from './cocPackageSession.js'

export type AccountRecord = {
  id: string
  userId?: string
  phone: string
  label?: string
  displayPhone?: string
  cookie?: string
  cookieUpdatedAt?: string
  cookieCheckedAt?: string
  cookieInvalidAt?: string
  cookieInvalidReason?: string
  lastLoginMethod?: AccountLoginMethod
  lastLoginAt?: string
  cookieSource?: AccountCookieSource
  cookieExpireAt?: string
  cookieTtlSeconds?: number
  activationInfo?: Record<string, unknown>
  activationCheckedAt?: string
  requestHeaders?: Record<string, string>
  newHomeUrl?: string
  qqtAccessToken?: string
  qqtAccessTokenCheckedAt?: string
  yunpanSession?: YunpanSessionRecord
  yunpanSessionUpdatedAt?: string
  cmccAppCookie?: string
  cmccAppCookieUpdatedAt?: string
  aigouSession?: AigouSessionRecord
  aigouSessionUpdatedAt?: string
  cocPackageSessions?: CocPackageSessionMap
  cocPackageSessionsUpdatedAt?: string
  wedRechargeCookie?: string
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
  createdAt: string
  updatedAt: string
}

export type AccountLoginMethod = 'cmcc_sms' | 'cmcc_qr' | 'yunpan' | 'manual_cookie'
export type AccountCookieSource = 'sms' | 'qr' | 'yunpan' | 'manual' | 'qqt_sso'

export type AccountLoginMeta = {
  lastLoginMethod?: AccountLoginMethod
  lastLoginAt?: string
  cookieSource?: AccountCookieSource
  cookieExpireAt?: string
  cookieTtlSeconds?: number
}

export type YunpanSessionRecord = {
  account: string
  completeAccount: string
  nationCode?: string
  rsaPublicKey?: string
  aesKey?: string
  secretKey?: string
  authToken?: string
  token?: string
  authorization?: string
  routerInfo?: Array<{
    modName?: string
    httpUrl?: string
    httpsUrl?: string
    hashName?: string
  }>
  cookieJar?: Record<string, string>
  lastSsoToken?: string
  lastSsoSourceId?: string
  lastWxAuthToken?: string
  checkedAt?: string
  invalidAt?: string
}

export type AigouSessionRecord = {
  cookie: string
  token: string
  refreshToken: string
  loginUrl: string
  mobileMask?: string
  encryMobile?: string
  provinceCode?: string
  cityCode?: string
  numberNet?: string
}

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
  publicPinnedAt?: string
  publicSortOrder?: number
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

function nowIso(): string {
  return new Date().toISOString()
}

function sha256Hex(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex')
}

function maskPhone(phone: string): string {
  if (!phone) return '未获取'
  if (!/^1\d{10}$/.test(phone)) return '未获取'
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`
}

function normalizeRequestHeaders(value: unknown): Record<string, string> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    const key = k.trim().toLowerCase()
    if (!key || key === 'cookie') continue
    if (v === null || v === undefined) continue
    out[key] = String(v)
  }
  return Object.keys(out).length ? out : undefined
}

function parseJsonRecord(text?: string): Record<string, unknown> | undefined {
  if (!text) return undefined
  try {
    const parsed = JSON.parse(text) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return undefined
    return parsed as Record<string, unknown>
  } catch {
    return undefined
  }
}

function mapDbToAccount(rec: {
  id: string
  userId?: string | null
  phone: string
  label: string | null
  displayPhone: string | null
  cookieEnc: string | null
  cookieUpdatedAt: Date | null
  cookieCheckedAt: Date | null
  cookieInvalidAt: Date | null
  cookieInvalidReason: string | null
  activationInfoEnc?: string | null
  activationCheckedAt?: Date | null
  requestHeadersEnc: string | null
  newHomeUrlEnc: string | null
  qqtAccessTokenEnc: string | null
  qqtAccessTokenCheckedAt: Date | null
  qqtInfoEnc: string | null
  qqtSignInfoEnc?: string | null
  qqtSignResultEnc?: string | null
  qqtSignUpdatedAt?: Date | null
  xdrReceiveEnc?: string | null
  xdrReceiveUpdatedAt?: Date | null
  wedRechargeInfoEnc?: string | null
  wedRechargeUpdatedAt?: Date | null
  smsLoginAt?: Date | null
  smsLoginExpireAt?: Date | null
  disabledAt?: Date | null
  disabledReason?: string | null
  publicPinnedAt?: Date | null
  publicSortOrder?: number
  createdAt: Date
  updatedAt: Date
}): AccountRecord {
  const activationInfoPlain = maybeDecryptString(rec.activationInfoEnc) ?? undefined
  const requestHeadersPlain = maybeDecryptString(rec.requestHeadersEnc) ?? undefined
  const qqtInfoPlain = maybeDecryptString(rec.qqtInfoEnc) ?? undefined
  const qqtSignInfoPlain = maybeDecryptString(rec.qqtSignInfoEnc) ?? undefined
  const qqtSignResultPlain = maybeDecryptString(rec.qqtSignResultEnc) ?? undefined
  const xdrReceivePlain = maybeDecryptString(rec.xdrReceiveEnc) ?? undefined
  const wedRechargeInfoPlain =
    maybeDecryptString(rec.wedRechargeInfoEnc) ?? undefined
  return {
    id: rec.id,
    userId: rec.userId ?? undefined,
    phone: rec.phone ?? '',
    label: rec.label ?? undefined,
    displayPhone: rec.displayPhone ?? undefined,
    cookie: maybeDecryptString(rec.cookieEnc),
    cookieUpdatedAt: rec.cookieUpdatedAt ? rec.cookieUpdatedAt.toISOString() : undefined,
    cookieCheckedAt: rec.cookieCheckedAt ? rec.cookieCheckedAt.toISOString() : undefined,
    cookieInvalidAt: rec.cookieInvalidAt ? rec.cookieInvalidAt.toISOString() : undefined,
    cookieInvalidReason: rec.cookieInvalidReason ?? undefined,
    activationInfo: parseJsonRecord(activationInfoPlain),
    activationCheckedAt: rec.activationCheckedAt
      ? rec.activationCheckedAt.toISOString()
      : undefined,
    requestHeaders: requestHeadersPlain ? (JSON.parse(requestHeadersPlain) as Record<string, string>) : undefined,
    newHomeUrl: maybeDecryptString(rec.newHomeUrlEnc),
    qqtAccessToken: maybeDecryptString(rec.qqtAccessTokenEnc),
    qqtAccessTokenCheckedAt: rec.qqtAccessTokenCheckedAt ? rec.qqtAccessTokenCheckedAt.toISOString() : undefined,
    qqtInfo: parseJsonRecord(qqtInfoPlain),
    qqtSignInfo: parseJsonRecord(qqtSignInfoPlain),
    qqtSignResult: parseJsonRecord(qqtSignResultPlain),
    qqtSignUpdatedAt: rec.qqtSignUpdatedAt
      ? rec.qqtSignUpdatedAt.toISOString()
      : undefined,
    xdrReceive: parseJsonRecord(xdrReceivePlain),
    xdrReceiveUpdatedAt: rec.xdrReceiveUpdatedAt
      ? rec.xdrReceiveUpdatedAt.toISOString()
      : undefined,
    wedRechargeInfo: parseJsonRecord(wedRechargeInfoPlain),
    wedRechargeUpdatedAt: rec.wedRechargeUpdatedAt
      ? rec.wedRechargeUpdatedAt.toISOString()
      : undefined,
    smsLoginAt: rec.smsLoginAt ? rec.smsLoginAt.toISOString() : undefined,
    smsLoginExpireAt: rec.smsLoginExpireAt
      ? rec.smsLoginExpireAt.toISOString()
      : undefined,
    disabledAt: rec.disabledAt ? rec.disabledAt.toISOString() : undefined,
    disabledReason: rec.disabledReason ?? undefined,
    publicPinnedAt: rec.publicPinnedAt ? rec.publicPinnedAt.toISOString() : undefined,
    publicSortOrder: rec.publicSortOrder ?? 0,
    createdAt: rec.createdAt.toISOString(),
    updatedAt: rec.updatedAt.toISOString(),
  }
}

function dateIso(value?: Date | null): string | undefined {
  return value ? value.toISOString() : undefined
}

function parseEncryptedHeaders(
  value?: string | null,
): Record<string, string> | undefined {
  const plain = maybeDecryptString(value) ?? undefined
  if (!plain) return undefined
  try {
    const parsed = JSON.parse(plain) as unknown
    return normalizeRequestHeaders(parsed)
  } catch {
    return undefined
  }
}

function parseEncryptedYunpanSession(
  value?: string | null,
): YunpanSessionRecord | undefined {
  const plain = maybeDecryptString(value) ?? undefined
  if (!plain) return undefined
  try {
    const parsed = JSON.parse(plain) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return undefined
    const obj = parsed as Record<string, unknown>
    const completeAccount =
      typeof obj.completeAccount === 'string' ? obj.completeAccount.trim() : ''
    const authorization =
      typeof obj.authorization === 'string' ? obj.authorization.trim() : ''
    if (!completeAccount || !authorization) return undefined
    const cookieJar =
      obj.cookieJar && typeof obj.cookieJar === 'object' && !Array.isArray(obj.cookieJar)
        ? Object.fromEntries(
            Object.entries(obj.cookieJar as Record<string, unknown>)
              .filter(([k, v]) => k && v !== undefined && v !== null)
              .map(([k, v]) => [k, String(v)]),
          )
        : undefined
    const routerInfo = Array.isArray(obj.routerInfo)
      ? obj.routerInfo
          .filter((item) => item && typeof item === 'object' && !Array.isArray(item))
          .map((item) => {
            const route = item as Record<string, unknown>
            return {
              modName: typeof route.modName === 'string' ? route.modName : undefined,
              httpUrl: typeof route.httpUrl === 'string' ? route.httpUrl : undefined,
              httpsUrl: typeof route.httpsUrl === 'string' ? route.httpsUrl : undefined,
              hashName: typeof route.hashName === 'string' ? route.hashName : undefined,
            }
          })
      : undefined
    return {
      account: typeof obj.account === 'string' ? obj.account : completeAccount,
      completeAccount,
      nationCode: typeof obj.nationCode === 'string' ? obj.nationCode : undefined,
      rsaPublicKey: typeof obj.rsaPublicKey === 'string' ? obj.rsaPublicKey : undefined,
      aesKey: typeof obj.aesKey === 'string' ? obj.aesKey : undefined,
      secretKey: typeof obj.secretKey === 'string' ? obj.secretKey : undefined,
      authToken: typeof obj.authToken === 'string' ? obj.authToken : undefined,
      token: typeof obj.token === 'string' ? obj.token : undefined,
      authorization,
      routerInfo,
      cookieJar,
      lastSsoToken: typeof obj.lastSsoToken === 'string' ? obj.lastSsoToken : undefined,
      lastSsoSourceId:
        typeof obj.lastSsoSourceId === 'string' ? obj.lastSsoSourceId : undefined,
      lastWxAuthToken: typeof obj.lastWxAuthToken === 'string' ? obj.lastWxAuthToken : undefined,
      checkedAt: typeof obj.checkedAt === 'string' ? obj.checkedAt : undefined,
      invalidAt: typeof obj.invalidAt === 'string' ? obj.invalidAt : undefined,
    }
  } catch {
    return undefined
  }
}

function parseEncryptedLoginMeta(value?: string | null): AccountLoginMeta | undefined {
  const plain = maybeDecryptString(value) ?? undefined
  if (!plain) return undefined
  try {
    const parsed = JSON.parse(plain) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return undefined
    const obj = parsed as Record<string, unknown>
    const method = typeof obj.lastLoginMethod === 'string' ? obj.lastLoginMethod : undefined
    const source = typeof obj.cookieSource === 'string' ? obj.cookieSource : undefined
    const lastLoginAt = typeof obj.lastLoginAt === 'string' ? obj.lastLoginAt : undefined
    const cookieExpireAt = typeof obj.cookieExpireAt === 'string' ? obj.cookieExpireAt : undefined
    const ttl =
      typeof obj.cookieTtlSeconds === 'number' && Number.isFinite(obj.cookieTtlSeconds)
        ? obj.cookieTtlSeconds
        : undefined
    return {
      lastLoginMethod:
        method === 'cmcc_sms' || method === 'cmcc_qr' || method === 'yunpan' || method === 'manual_cookie'
          ? method
          : undefined,
      lastLoginAt,
      cookieSource:
        source === 'sms' || source === 'qr' || source === 'yunpan' || source === 'manual' || source === 'qqt_sso'
          ? source
          : undefined,
      cookieExpireAt,
      cookieTtlSeconds: ttl,
    }
  } catch {
    return undefined
  }
}

function parseEncryptedAigouSession(value?: string | null): AigouSessionRecord | undefined {
  const plain = maybeDecryptString(value) ?? undefined
  if (!plain) return undefined
  try {
    const parsed = JSON.parse(plain) as AigouSessionRecord
    if (!parsed.cookie || !parsed.token || !parsed.refreshToken || !parsed.loginUrl) return undefined
    return parsed
  } catch {
    return undefined
  }
}

function parseEncryptedCocPackageSessions(value?: string | null): CocPackageSessionMap | undefined {
  const plain = maybeDecryptString(value) ?? undefined
  if (!plain) return undefined
  try {
    const parsed = JSON.parse(plain) as CocPackageSessionMap
    const valid = Object.values(parsed).every((session) => !session || (
      session.cookie && session.token && session.userId && session.provinceCode && session.loginUrl
    ))
    return valid ? parsed : undefined
  } catch {
    return undefined
  }
}

function applyCredentialRow(
  rec: AccountRecord,
  credential?: EncryptedCredentialRow | null,
): AccountRecord {
  if (!credential) return rec
  const loginMeta = parseEncryptedLoginMeta(credential.loginMetaEnc)
  return {
    ...rec,
    cookie: maybeDecryptString(credential.cookieEnc),
    cookieUpdatedAt: dateIso(credential.cookieUpdatedAt),
    cookieCheckedAt: dateIso(credential.cookieCheckedAt),
    cookieInvalidAt: dateIso(credential.cookieInvalidAt),
    cookieInvalidReason: credential.cookieInvalidReason ?? undefined,
    requestHeaders: parseEncryptedHeaders(credential.requestHeadersEnc),
    newHomeUrl: maybeDecryptString(credential.newHomeUrlEnc),
    qqtAccessToken: maybeDecryptString(credential.qqtAccessTokenEnc),
    qqtAccessTokenCheckedAt: dateIso(credential.qqtAccessTokenCheckedAt),
    yunpanSession: parseEncryptedYunpanSession(credential.yunpanSessionEnc),
    yunpanSessionUpdatedAt: dateIso(credential.yunpanSessionUpdatedAt),
    cmccAppCookie: maybeDecryptString(credential.cmccAppCookieEnc),
    cmccAppCookieUpdatedAt: dateIso(credential.cmccAppCookieUpdatedAt),
    aigouSession: parseEncryptedAigouSession(credential.aigouSessionEnc),
    aigouSessionUpdatedAt: dateIso(credential.aigouSessionUpdatedAt),
    cocPackageSessions: parseEncryptedCocPackageSessions(credential.cocPackageSessionsEnc),
    cocPackageSessionsUpdatedAt: dateIso(credential.cocPackageSessionsUpdatedAt),
    wedRechargeCookie: maybeDecryptString(credential.wedRechargeCookieEnc),
    wedRechargeCookieUpdatedAt: dateIso(credential.wedRechargeCookieUpdatedAt),
    lastLoginMethod: loginMeta?.lastLoginMethod,
    lastLoginAt: loginMeta?.lastLoginAt,
    cookieSource: loginMeta?.cookieSource,
    cookieExpireAt: loginMeta?.cookieExpireAt,
    cookieTtlSeconds: loginMeta?.cookieTtlSeconds,
  }
}

async function hydrateAccount(rec: AccountRecord): Promise<AccountRecord> {
  return applyCredentialRow(rec, await getEncryptedCredentialRow(rec.id))
}

async function hydrateAccounts(records: AccountRecord[]): Promise<AccountRecord[]> {
  const credentials = await getEncryptedCredentialRows(records.map((rec) => rec.id))
  return records.map((rec) => applyCredentialRow(rec, credentials.get(rec.id)))
}

type LegacyCredentialFields = {
  id: string
  cookieEnc: string | null
  cookieUpdatedAt: Date | null
  cookieCheckedAt: Date | null
  cookieInvalidAt: Date | null
  cookieInvalidReason: string | null
  requestHeadersEnc: string | null
  newHomeUrlEnc: string | null
  qqtAccessTokenEnc: string | null
  qqtAccessTokenCheckedAt: Date | null
}

function credentialWriteFromLegacy(
  row: LegacyCredentialFields,
): EncryptedCredentialWrite {
  return {
    accountId: row.id,
    cookieEnc: row.cookieEnc,
    cookieUpdatedAt: row.cookieUpdatedAt,
    cookieCheckedAt: row.cookieCheckedAt,
    cookieInvalidAt: row.cookieInvalidAt,
    cookieInvalidReason: row.cookieInvalidReason,
    requestHeadersEnc: row.requestHeadersEnc,
    newHomeUrlEnc: row.newHomeUrlEnc,
    qqtAccessTokenEnc: row.qqtAccessTokenEnc,
    qqtAccessTokenCheckedAt: row.qqtAccessTokenCheckedAt,
    yunpanSessionEnc: null,
    yunpanSessionUpdatedAt: null,
    cmccAppCookieEnc: null,
    cmccAppCookieUpdatedAt: null,
    aigouSessionEnc: null,
    aigouSessionUpdatedAt: null,
    cocPackageSessionsEnc: null,
    cocPackageSessionsUpdatedAt: null,
    wedRechargeCookieEnc: null,
    wedRechargeCookieUpdatedAt: null,
    loginMetaEnc: null,
  }
}

function credentialWriteFromRow(
  row: EncryptedCredentialRow,
): EncryptedCredentialWrite {
  return {
    accountId: row.accountId,
    cookieEnc: row.cookieEnc,
    cookieUpdatedAt: row.cookieUpdatedAt,
    cookieCheckedAt: row.cookieCheckedAt,
    cookieInvalidAt: row.cookieInvalidAt,
    cookieInvalidReason: row.cookieInvalidReason,
    requestHeadersEnc: row.requestHeadersEnc,
    newHomeUrlEnc: row.newHomeUrlEnc,
    qqtAccessTokenEnc: row.qqtAccessTokenEnc,
    qqtAccessTokenCheckedAt: row.qqtAccessTokenCheckedAt,
    yunpanSessionEnc: row.yunpanSessionEnc,
    yunpanSessionUpdatedAt: row.yunpanSessionUpdatedAt,
    cmccAppCookieEnc: row.cmccAppCookieEnc,
    cmccAppCookieUpdatedAt: row.cmccAppCookieUpdatedAt,
    aigouSessionEnc: row.aigouSessionEnc,
    aigouSessionUpdatedAt: row.aigouSessionUpdatedAt,
    cocPackageSessionsEnc: row.cocPackageSessionsEnc,
    cocPackageSessionsUpdatedAt: row.cocPackageSessionsUpdatedAt,
    wedRechargeCookieEnc: row.wedRechargeCookieEnc,
    wedRechargeCookieUpdatedAt: row.wedRechargeCookieUpdatedAt,
    loginMetaEnc: row.loginMetaEnc,
  }
}

async function getCredentialWriteBase(
  row: LegacyCredentialFields,
): Promise<EncryptedCredentialWrite> {
  const credential = await getEncryptedCredentialRow(row.id)
  return credential
    ? credentialWriteFromRow(credential)
    : credentialWriteFromLegacy(row)
}

export function toAccountSummary(rec: AccountRecord): AccountSummary {
  const inferredLoginMethod =
    rec.lastLoginMethod || (rec.yunpanSession?.authorization ? 'yunpan' : undefined)
  const inferredCookieSource =
    rec.cookieSource
  const inferredCookieExpireAt =
    rec.cookieExpireAt || rec.smsLoginExpireAt
  return {
    id: rec.id,
    userId: rec.userId,
    label: rec.label,
    phone: rec.phone || undefined,
    phoneMasked: maskPhone(rec.phone),
    displayPhone: rec.displayPhone,
    hasCookie: Boolean(rec.cookie),
    cookieUpdatedAt: rec.cookieUpdatedAt,
    cookieInvalidAt: rec.cookieInvalidAt,
    cookieInvalidReason: rec.cookieInvalidReason,
    lastLoginMethod: inferredLoginMethod,
    lastLoginAt: rec.lastLoginAt,
    cookieSource: inferredCookieSource,
    cookieExpireAt: inferredCookieExpireAt,
    cookieTtlSeconds:
      rec.cookieTtlSeconds,
    activationInfo: rec.activationInfo,
    activationCheckedAt: rec.activationCheckedAt,
    updatedAt: rec.updatedAt,
    newHomeUrl: rec.newHomeUrl,
    qqtAccessToken: rec.qqtAccessToken,
    qqtAccessTokenCheckedAt: rec.qqtAccessTokenCheckedAt,
    hasYunpanSession: Boolean(rec.yunpanSession?.authorization && rec.yunpanSession?.completeAccount),
    yunpanSessionUpdatedAt: rec.yunpanSessionUpdatedAt,
    yunpanSessionCheckedAt: rec.yunpanSession?.checkedAt,
    yunpanSessionInvalidAt: rec.yunpanSession?.invalidAt,
    hasCmccAppCookie: Boolean(rec.cmccAppCookie),
    cmccAppCookieUpdatedAt: rec.cmccAppCookieUpdatedAt,
    hasAigouSession: Boolean(rec.aigouSession),
    aigouSessionUpdatedAt: rec.aigouSessionUpdatedAt,
    hasBuildingBricksSession: Boolean(rec.cocPackageSessions?.building_bricks),
    hasDiamondPackageSession: Boolean(rec.cocPackageSessions?.diamond_package),
    hasSmartLifeSession: Boolean(rec.cocPackageSessions?.smart_life),
    hasFiveGaSession: Boolean(rec.cocPackageSessions?.five_ga),
    cocPackageSessionsUpdatedAt: rec.cocPackageSessionsUpdatedAt,
    hasWedRechargeCookie: Boolean(rec.wedRechargeCookie),
    wedRechargeCookieUpdatedAt: rec.wedRechargeCookieUpdatedAt,
    qqtInfo: rec.qqtInfo,
    qqtSignInfo: rec.qqtSignInfo,
    qqtSignResult: rec.qqtSignResult,
    qqtSignUpdatedAt: rec.qqtSignUpdatedAt,
    xdrReceive: rec.xdrReceive,
    xdrReceiveUpdatedAt: rec.xdrReceiveUpdatedAt,
    wedRechargeInfo: rec.wedRechargeInfo,
    wedRechargeUpdatedAt: rec.wedRechargeUpdatedAt,
    smsLoginAt: rec.smsLoginAt,
    smsLoginExpireAt: rec.smsLoginExpireAt,
    disabledAt: rec.disabledAt,
    disabledReason: rec.disabledReason,
    publicPinnedAt: rec.publicPinnedAt,
    publicSortOrder: rec.publicSortOrder,
  }
}

export async function listAccountSummaries(args?: {
  includeDisabled?: boolean
}): Promise<AccountSummary[]> {
  const prisma = getPrisma()
  const rows = await prisma.account.findMany({
    where: args?.includeDisabled ? undefined : { disabledAt: null },
    orderBy: { updatedAt: 'desc' },
  })
  const records = await hydrateAccounts(rows.map(mapDbToAccount))
  return records.map((r) => toAccountSummary(r))
}

export async function listAccountSummariesByUser(userId: string): Promise<AccountSummary[]> {
  const prisma = getPrisma()
  const rows = await prisma.account.findMany({
    where: { userId, disabledAt: null },
    orderBy: [
      { publicPinnedAt: { sort: 'asc', nulls: 'last' } },
      { publicSortOrder: 'asc' },
      { updatedAt: 'desc' },
    ],
  })
  const records = await hydrateAccounts(rows.map(mapDbToAccount))
  return records.map((record) => toAccountSummary(record))
}

export function validatePublicAccountOrder(args: {
  accountIds: string[]
  pinnedAccountIds: string[]
  ownedAccountIds: string[]
}): void {
  if (new Set(args.accountIds).size !== args.accountIds.length || new Set(args.pinnedAccountIds).size !== args.pinnedAccountIds.length) {
    throw new Error('DUPLICATE_ACCOUNT_ID')
  }
  const accountSet = new Set(args.accountIds)
  if (args.pinnedAccountIds.some((id) => !accountSet.has(id))) throw new Error('INVALID_PINNED_ACCOUNT')
  const ownedIds = new Set(args.ownedAccountIds)
  if (ownedIds.size !== args.accountIds.length || args.accountIds.some((id) => !ownedIds.has(id))) {
    throw new Error('ACCOUNT_SET_MISMATCH')
  }
}

export async function updatePublicAccountOrder(args: {
  userId: string
  accountIds: string[]
  pinnedAccountIds: string[]
}): Promise<AccountSummary[]> {
  const accountIds = args.accountIds.map((id) => id.trim()).filter(Boolean)
  const pinnedAccountIds = args.pinnedAccountIds.map((id) => id.trim()).filter(Boolean)
  const prisma = getPrisma()
  const owned = await prisma.account.findMany({
    where: { userId: args.userId, disabledAt: null },
    select: { id: true },
  })
  validatePublicAccountOrder({ accountIds, pinnedAccountIds, ownedAccountIds: owned.map((item) => item.id) })

  const pinnedSet = new Set(pinnedAccountIds)
  const pinnedAt = new Date()
  await prisma.$transaction(accountIds.map((id, index) => prisma.account.update({
    where: { id },
    data: {
      publicSortOrder: index,
      publicPinnedAt: pinnedSet.has(id) ? pinnedAt : null,
    },
  })))
  return listAccountSummariesByUser(args.userId)
}

export async function listAccounts(args?: {
  includeDisabled?: boolean
}): Promise<AccountRecord[]> {
  const prisma = getPrisma()
  const rows = await prisma.account.findMany({
    where: args?.includeDisabled ? undefined : { disabledAt: null },
  })
  return hydrateAccounts(rows.map(mapDbToAccount))
}

export async function upsertAccount(args: {
  phone: string
  label?: string
  allowEmpty?: boolean
}): Promise<AccountRecord> {
  const phone = args.phone.trim()
  const label = args.label?.trim() || undefined
  const isValidPhone = /^1\d{10}$/.test(phone)
  if (!isValidPhone && !(args.allowEmpty && !phone)) {
    throw new Error('INVALID_PHONE')
  }

  const id = isValidPhone ? sha256Hex(phone) : crypto.randomUUID()
  const prisma = getPrisma()
  const now = new Date()

  if (isValidPhone) {
    const existing = await prisma.account.findFirst({
      where: { phone },
      orderBy: { updatedAt: 'desc' },
    })
    if (existing) {
      const row = await prisma.account.update({
        where: { id: existing.id },
        data: {
          phone,
          label,
          disabledAt: null,
          disabledReason: null,
          updatedAt: now,
        },
      })
      return hydrateAccount(mapDbToAccount(row))
    }
  }

  const row = await prisma.account.upsert({
    where: { id },
    create: {
      id,
      phone: isValidPhone ? phone : '',
      label,
      displayPhone: null,
      createdAt: now,
      updatedAt: now,
    },
    update: {
      // keep existing phone if we don't have a valid one
      ...(isValidPhone ? { phone } : {}),
      label,
      disabledAt: null,
      disabledReason: null,
      updatedAt: now,
    },
  })

  return hydrateAccount(mapDbToAccount(row))
}

export async function setAccountPhone(args: { id: string; phone: string }): Promise<AccountRecord> {
  const phone = args.phone.trim()
  if (!/^1\d{10}$/.test(phone)) throw new Error('INVALID_PHONE')
  const prisma = getPrisma()
  const row = await prisma.account.update({
    where: { id: args.id },
    data: { phone },
  })
  return hydrateAccount(mapDbToAccount(row))
}

export async function setAccountDisplayPhone(args: { id: string; displayPhone: string }): Promise<AccountRecord> {
  const displayPhone = args.displayPhone.trim()
  if (!displayPhone) throw new Error('INVALID_DISPLAY_PHONE')
  const prisma = getPrisma()
  const row = await prisma.account.update({
    where: { id: args.id },
    data: { displayPhone },
  })
  return hydrateAccount(mapDbToAccount(row))
}

export async function setAccountQqtInfo(args: { id: string; qqtInfo: Record<string, unknown> }): Promise<AccountRecord> {
  const prisma = getPrisma()
  const existing = await prisma.account.findUnique({ where: { id: args.id } })
  if (!existing) throw new Error('NOT_FOUND')
  const prevPlain = maybeDecryptString(existing.qqtInfoEnc) ?? undefined
  const prev = prevPlain ? (JSON.parse(prevPlain) as Record<string, unknown>) : undefined
  const merged = { ...(prev ?? {}), ...(args.qqtInfo ?? {}) }
  const row = await prisma.account.update({
    where: { id: args.id },
    data: { qqtInfoEnc: encryptJson(merged) },
  })
  return hydrateAccount(mapDbToAccount(row))
}

export async function setAccountActivationInfo(args: {
  id: string
  activationInfo: Record<string, unknown>
}): Promise<AccountRecord> {
  const prisma = getPrisma()
  const data: Prisma.AccountUpdateInput = {
    activationInfoEnc: encryptJson(args.activationInfo),
    activationCheckedAt: new Date(),
  }
  const row = await prisma.account.update({
    where: { id: args.id },
    data,
  })
  return hydrateAccount(mapDbToAccount(row))
}

export async function setAccountQqtSignState(args: {
  id: string
  signInfo?: Record<string, unknown>
  signResult?: Record<string, unknown>
}): Promise<AccountRecord> {
  const prisma = getPrisma()
  const data: Prisma.AccountUpdateInput = {
    qqtSignInfoEnc: args.signInfo ? encryptJson(args.signInfo) : undefined,
    qqtSignResultEnc: args.signResult ? encryptJson(args.signResult) : undefined,
    qqtSignUpdatedAt: new Date(),
  }
  const row = await prisma.account.update({
    where: { id: args.id },
    data,
  })
  return hydrateAccount(mapDbToAccount(row))
}

export async function setAccountXdrReceive(args: {
  id: string
  receive: Record<string, unknown>
}): Promise<AccountRecord> {
  const prisma = getPrisma()
  const data: Prisma.AccountUpdateInput = {
    xdrReceiveEnc: encryptJson(args.receive),
    xdrReceiveUpdatedAt: new Date(),
  }
  const row = await prisma.account.update({
    where: { id: args.id },
    data,
  })
  return hydrateAccount(mapDbToAccount(row))
}

export async function setAccountWedRechargeInfo(args: {
  id: string
  info: Record<string, unknown>
}): Promise<AccountRecord> {
  const prisma = getPrisma()
  const data: Prisma.AccountUpdateInput = {
    wedRechargeInfoEnc: encryptJson(args.info),
    wedRechargeUpdatedAt: new Date(),
  }
  const row = await prisma.account.update({
    where: { id: args.id },
    data,
  })
  return hydrateAccount(mapDbToAccount(row))
}

export async function softDisableAccount(args: {
  id: string
  reason?: string
}): Promise<AccountRecord> {
  const prisma = getPrisma()
  const now = new Date()
  const reason = args.reason?.trim() || '账号已失效处理'
  await upsertEncryptedCredentialRow({
    accountId: args.id,
    cookieEnc: null,
    cookieUpdatedAt: null,
    cookieCheckedAt: null,
    cookieInvalidAt: now,
    cookieInvalidReason: reason,
    requestHeadersEnc: null,
    newHomeUrlEnc: null,
    qqtAccessTokenEnc: null,
    qqtAccessTokenCheckedAt: null,
    yunpanSessionEnc: null,
    yunpanSessionUpdatedAt: null,
    cmccAppCookieEnc: null,
    cmccAppCookieUpdatedAt: null,
    aigouSessionEnc: null,
    aigouSessionUpdatedAt: null,
    cocPackageSessionsEnc: null,
    cocPackageSessionsUpdatedAt: null,
    wedRechargeCookieEnc: null,
    wedRechargeCookieUpdatedAt: null,
    loginMetaEnc: null,
  })
  const row = await prisma.account.update({
    where: { id: args.id },
    data: {
      cookieEnc: null,
      cookieUpdatedAt: null,
      cookieCheckedAt: null,
      cookieInvalidAt: now,
      cookieInvalidReason: reason,
      requestHeadersEnc: null,
      newHomeUrlEnc: null,
      qqtAccessTokenEnc: null,
      qqtAccessTokenCheckedAt: null,
      disabledAt: now,
      disabledReason: reason,
    },
  })
  return hydrateAccount(mapDbToAccount(row))
}

export async function deleteAccount(id: string): Promise<void> {
  const prisma = getPrisma()
  await deleteEncryptedCredentialsForAccounts([id])
  await prisma.account.delete({ where: { id } })
}

export async function getAccountById(id: string): Promise<AccountRecord | null> {
  const prisma = getPrisma()
  const row = await prisma.account.findUnique({ where: { id } })
  return row ? hydrateAccount(mapDbToAccount(row)) : null
}

export async function setAccountCookie(args: {
  id: string
  cookie: string
  requestHeaders?: Record<string, string>
  newHomeUrl?: string
  loginMethod?: AccountLoginMethod
  cookieSource?: AccountCookieSource
  ttlHours?: number
  loginAt?: Date
  ssoCookieExpireAt?: string
}): Promise<AccountRecord> {
  const prisma = getPrisma()
  const existing = await prisma.account.findUnique({ where: { id: args.id } })
  if (!existing) throw new Error('NOT_FOUND')
  const credentialBase = await getCredentialWriteBase(existing)
  const prevHeaders = parseEncryptedHeaders(credentialBase.requestHeadersEnc)
  const requestHeaders = args.requestHeaders ?? prevHeaders
  const mergedHeaders = normalizeRequestHeaders(requestHeaders) ?? undefined
  const now = new Date()
  const ssoMeta = args.ssoCookieExpireAt ? createSsoCookieMeta(
    parseEncryptedLoginMeta(credentialBase.loginMetaEnc), args.ssoCookieExpireAt, now,
  ) : undefined
  const shouldUpdateLoginWindow = Boolean(
    args.loginMethod || args.cookieSource || args.ttlHours !== undefined || args.loginAt,
  )
  const loginAt = args.loginAt ?? now
  const ttlHours = Number.isFinite(args.ttlHours ?? 72)
    ? Math.max(1, Math.min(24 * 30, Math.floor(args.ttlHours ?? 72)))
    : 72
  const expireAt = new Date(loginAt.getTime() + ttlHours * 60 * 60 * 1000)
  const cookieEnc = maybeEncryptString(args.cookie)
  const loginMeta: AccountLoginMeta = {
    lastLoginMethod: args.loginMethod,
    lastLoginAt: loginAt.toISOString(),
    cookieSource: args.cookieSource,
    cookieExpireAt: expireAt.toISOString(),
    cookieTtlSeconds: ttlHours * 60 * 60,
  }
  const requestHeadersEnc = mergedHeaders
    ? encryptJson(mergedHeaders)
    : credentialBase.requestHeadersEnc
  const newHomeUrlEnc = args.newHomeUrl
    ? maybeEncryptString(args.newHomeUrl)
    : credentialBase.newHomeUrlEnc
  await upsertEncryptedCredentialRow({
    ...credentialBase,
    cookieEnc,
    cookieUpdatedAt: now,
    cookieCheckedAt: now,
    cookieInvalidAt: null,
    cookieInvalidReason: null,
    requestHeadersEnc,
    newHomeUrlEnc,
    loginMetaEnc: ssoMeta ? encryptJson(ssoMeta) : shouldUpdateLoginWindow
      ? encryptJson(loginMeta)
      : credentialBase.loginMetaEnc,
  })
  const data: Prisma.AccountUpdateInput = {
    cookieEnc,
    cookieUpdatedAt: now,
    cookieCheckedAt: now,
    cookieInvalidAt: null,
    cookieInvalidReason: null,
    requestHeadersEnc,
    newHomeUrlEnc,
  }
  if (shouldUpdateLoginWindow && !ssoMeta) {
    data.smsLoginAt = loginAt
    data.smsLoginExpireAt = expireAt
  }
  const row = await prisma.account.update({
    where: { id: args.id },
    data,
  })
  return hydrateAccount(mapDbToAccount(row))
}

export function createSsoCookieMeta(previous: AccountLoginMeta | undefined, expiresAt: string, now = new Date()): AccountLoginMeta {
  const expiry = Date.parse(expiresAt)
  if (!Number.isFinite(expiry) || expiry <= now.getTime()) throw new Error('SSO_COOKIE_EXPIRY_INVALID')
  return { ...previous, cookieSource: 'qqt_sso', cookieExpireAt: new Date(expiry).toISOString(),
    cookieTtlSeconds: Math.floor((expiry - now.getTime()) / 1000) }
}

export async function setAccountYunpanSession(args: {
  id: string
  session: YunpanSessionRecord
  recordLogin?: boolean
}): Promise<AccountRecord> {
  const prisma = getPrisma()
  const existing = await prisma.account.findUnique({ where: { id: args.id } })
  if (!existing) throw new Error('NOT_FOUND')
  const credentialBase = await getCredentialWriteBase(existing)
  const now = new Date()
  await upsertEncryptedCredentialRow({
    ...credentialBase,
    yunpanSessionEnc: encryptJson(args.recordLogin
      ? { ...args.session, checkedAt: now.toISOString(), invalidAt: undefined }
      : args.session),
    yunpanSessionUpdatedAt: now,
    ...(args.recordLogin ? { loginMetaEnc: encryptJson({
      ...parseEncryptedLoginMeta(credentialBase.loginMetaEnc),
      lastLoginMethod: 'yunpan', lastLoginAt: now.toISOString(),
    }) } : {}),
  })
  const row = await prisma.account.update({
    where: { id: args.id },
    data: { updatedAt: now },
  })
  return hydrateAccount(mapDbToAccount(row))
}

export async function recordAccountYunpanVerification(rec: AccountRecord, valid: boolean, dependencies = {
  getEncryptedCredentialRow, compareAndSwapYunpanSession,
}): Promise<void> {
  const credential = await dependencies.getEncryptedCredentialRow(rec.id)
  if (!credential?.yunpanSessionEnc || !rec.yunpanSession) return
  const session = parseEncryptedYunpanSession(credential.yunpanSessionEnc)
  if (!session || session.authorization !== rec.yunpanSession.authorization ||
      session.completeAccount !== rec.yunpanSession.completeAccount ||
      dateIso(credential.yunpanSessionUpdatedAt) !== rec.yunpanSessionUpdatedAt) return
  const checkedAt = nowIso()
  await dependencies.compareAndSwapYunpanSession(rec.id, credential.yunpanSessionEnc,
    encryptJson({ ...session, checkedAt, invalidAt: valid ? undefined : checkedAt }))
}

export async function setAccountCmccAppCookie(args: {
  id: string
  cookie: string
}): Promise<AccountRecord> {
  const prisma = getPrisma()
  const existing = await prisma.account.findUnique({ where: { id: args.id } })
  if (!existing) throw new Error('NOT_FOUND')
  const credentialBase = await getCredentialWriteBase(existing)
  const now = new Date()
  await upsertEncryptedCredentialRow({
    ...credentialBase,
    cmccAppCookieEnc: maybeEncryptString(args.cookie),
    cmccAppCookieUpdatedAt: now,
  })
  const row = await prisma.account.update({
    where: { id: args.id },
    data: { updatedAt: now },
  })
  return hydrateAccount(mapDbToAccount(row))
}

export async function setAccountAigouSession(args: {
  id: string
  session: AigouSessionRecord
}): Promise<AccountRecord> {
  const prisma = getPrisma()
  const existing = await prisma.account.findUnique({ where: { id: args.id } })
  if (!existing) throw new Error('NOT_FOUND')
  const credentialBase = await getCredentialWriteBase(existing)
  const now = new Date()
  await upsertEncryptedCredentialRow({
    ...credentialBase,
    aigouSessionEnc: encryptJson(args.session),
    aigouSessionUpdatedAt: now,
  })
  const row = await prisma.account.update({
    where: { id: args.id },
    data: { updatedAt: now },
  })
  return hydrateAccount(mapDbToAccount(row))
}

export async function setAccountCocPackageSession(args: {
  id: string
  target: CocPackageTarget
  session: CocPackageSessionRecord
}): Promise<AccountRecord> {
  const prisma = getPrisma()
  const existing = await prisma.account.findUnique({ where: { id: args.id } })
  if (!existing) throw new Error('NOT_FOUND')
  const hydrated = await hydrateAccount(mapDbToAccount(existing))
  const sessions: CocPackageSessionMap = {
    ...(hydrated.cocPackageSessions || {}),
    [args.target]: args.session,
  }
  const credentialBase = await getCredentialWriteBase(existing)
  const now = new Date()
  await upsertEncryptedCredentialRow({
    ...credentialBase,
    cocPackageSessionsEnc: encryptJson(sessions),
    cocPackageSessionsUpdatedAt: now,
  })
  const row = await prisma.account.update({
    where: { id: args.id },
    data: { updatedAt: now },
  })
  return hydrateAccount(mapDbToAccount(row))
}

export async function setAccountWedRechargeCookie(args: {
  id: string
  cookie: string
}): Promise<AccountRecord> {
  const prisma = getPrisma()
  const existing = await prisma.account.findUnique({ where: { id: args.id } })
  if (!existing) throw new Error('NOT_FOUND')
  const credentialBase = await getCredentialWriteBase(existing)
  const now = new Date()
  await upsertEncryptedCredentialRow({
    ...credentialBase,
    wedRechargeCookieEnc: maybeEncryptString(args.cookie),
    wedRechargeCookieUpdatedAt: now,
  })
  const row = await prisma.account.update({
    where: { id: args.id },
    data: { updatedAt: now },
  })
  return hydrateAccount(mapDbToAccount(row))
}

export async function touchAccountCookieCheckedAt(args: {
  id: string
}): Promise<AccountRecord> {
  const prisma = getPrisma()
  const existing = await prisma.account.findUnique({ where: { id: args.id } })
  if (!existing) throw new Error('NOT_FOUND')
  const credentialBase = await getCredentialWriteBase(existing)
  const now = new Date()
  await upsertEncryptedCredentialRow({
    ...credentialBase,
    cookieCheckedAt: now,
  })
  const row = await prisma.account.update({
    where: { id: args.id },
    data: { cookieCheckedAt: now },
  })
  return hydrateAccount(mapDbToAccount(row))
}

export async function clearAccountCookie(args: { id: string; reason?: string }): Promise<AccountRecord> {
  const prisma = getPrisma()
  const existing = await prisma.account.findUnique({ where: { id: args.id } })
  if (!existing) throw new Error('NOT_FOUND')
  const credentialBase = await getCredentialWriteBase(existing)
  const now = new Date()
  const reason = args.reason?.trim() || 'Cookie 已失效'
  await upsertEncryptedCredentialRow({
    ...credentialBase,
    cookieEnc: null,
    cookieUpdatedAt: null,
    cookieCheckedAt: null,
    cookieInvalidAt: now,
    cookieInvalidReason: reason,
    loginMetaEnc: null,
  })
  const row = await prisma.account.update({
    where: { id: args.id },
    data: {
      cookieEnc: null,
      cookieUpdatedAt: null,
      cookieCheckedAt: null,
      cookieInvalidAt: now,
      cookieInvalidReason: reason,
    },
  })
  return hydrateAccount(mapDbToAccount(row))
}

export async function setAccountQqtToken(args: { id: string; qqtAccessToken?: string }): Promise<AccountRecord> {
  const prisma = getPrisma()
  const existing = await prisma.account.findUnique({ where: { id: args.id } })
  if (!existing) throw new Error('NOT_FOUND')
  const credentialBase = await getCredentialWriteBase(existing)
  const now = new Date()
  const qqtAccessTokenEnc = args.qqtAccessToken
    ? maybeEncryptString(args.qqtAccessToken)
    : null
  const qqtAccessTokenCheckedAt = args.qqtAccessToken ? now : null
  await upsertEncryptedCredentialRow({
    ...credentialBase,
    qqtAccessTokenEnc,
    qqtAccessTokenCheckedAt,
  })
  const row = await prisma.account.update({
    where: { id: args.id },
    data: {
      qqtAccessTokenEnc,
      qqtAccessTokenCheckedAt,
    },
  })
  return hydrateAccount(mapDbToAccount(row))
}

export async function touchAccountQqtTokenCheckedAt(args: {
  id: string
}): Promise<AccountRecord> {
  const prisma = getPrisma()
  const existing = await prisma.account.findUnique({ where: { id: args.id } })
  if (!existing) throw new Error('NOT_FOUND')
  const credentialBase = await getCredentialWriteBase(existing)
  const now = new Date()
  await upsertEncryptedCredentialRow({
    ...credentialBase,
    qqtAccessTokenCheckedAt: now,
  })
  const row = await prisma.account.update({
    where: { id: args.id },
    data: { qqtAccessTokenCheckedAt: now },
  })
  return hydrateAccount(mapDbToAccount(row))
}

export async function setAccountSmsLoginWindow(args: {
  id: string
  loginAt?: Date
  ttlHours?: number
}): Promise<AccountRecord> {
  const prisma = getPrisma()
  const loginAt = args.loginAt ?? new Date()
  const ttlHours = Number.isFinite(args.ttlHours ?? 72)
    ? Math.max(1, Math.min(24 * 30, Math.floor(args.ttlHours ?? 72)))
    : 72
  const expireAt = new Date(loginAt.getTime() + ttlHours * 60 * 60 * 1000)
  const row = await prisma.account.update({
    where: { id: args.id },
    data: {
      smsLoginAt: loginAt,
      smsLoginExpireAt: expireAt,
    },
  })
  return hydrateAccount(mapDbToAccount(row))
}

export async function getAccountCookie(id: string): Promise<string | null> {
  const credential = await getEncryptedCredentialRow(id)
  if (credential) return maybeDecryptString(credential.cookieEnc) ?? null
  const prisma = getPrisma()
  const row = await prisma.account.findUnique({ where: { id }, select: { cookieEnc: true } })
  if (!row?.cookieEnc) return null
  return maybeDecryptString(row.cookieEnc) ?? null
}

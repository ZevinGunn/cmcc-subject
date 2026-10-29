import {
  getAccountById,
  setAccountCmccAppCookie,
  setAccountQqtInfo,
} from './accountsStore.js'
import {
  queryBalanceUserInformation,
  queryUserInformation,
} from './cmccBusinessQuery.js'
import { exchange10086CookieToCmccApp } from './cmccSessionBridge.js'

export type CmccAccountProfile = {
  netAge?: string
  userBegin?: string
  province?: string
  levelName?: string
}

function record(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined
}

function text(source: Record<string, unknown> | undefined, keys: string[]): string | undefined {
  for (const key of keys) {
    const raw = source?.[key]
    if (raw === undefined || raw === null) continue
    const value = String(raw).trim()
    if (value) return value
  }
  return undefined
}

function userInfoRecord(payload: unknown): Record<string, unknown> | undefined {
  const root = record(payload)
  const rspBody = record(root?.rspBody)
  const data = record(root?.data)
  return record(root?.userInfo) || record(rspBody?.userInfo) || record(data?.userInfo) || root
}

export function extractCmccAccountProfile(payload: unknown): CmccAccountProfile {
  const info = userInfoRecord(payload)
  return {
    netAge: text(info, ['netAge', 'userAge', 'networkAge', 'inNetAge']),
    userBegin: text(info, ['userBegin', 'networkStartDate', 'inNetDate']),
    province: text(info, ['province', 'provinceName', 'provName', 'userProvince']),
    levelName: text(info, [
      'levelName',
      'brandLevelName',
      'custLevelName',
      'userLevelName',
      'globalLevelName',
    ]),
  }
}

export async function persistCmccAccountProfile(args: {
  accountId: string
  payload: unknown
}): Promise<CmccAccountProfile> {
  const profile = extractCmccAccountProfile(args.payload)
  const rec = await getAccountById(args.accountId)
  if (!rec) throw new Error('NOT_FOUND')
  const currentInfo = rec.qqtInfo ?? {}
  const currentData = record(currentInfo.data) ?? {}
  const currentProfile = record(currentInfo.cmccProfile) ?? {}
  const hasValue = (value: unknown): boolean =>
    value !== undefined && value !== null && String(value).trim() !== ''
  const nextData: Record<string, unknown> = { ...currentData }
  if (profile.netAge) nextData.netAge = profile.netAge
  if (profile.userBegin) nextData.userBegin = profile.userBegin
  if (profile.province && !hasValue(nextData.province)) nextData.province = profile.province
  if (profile.levelName) nextData.levelName = profile.levelName
  await setAccountQqtInfo({
    id: args.accountId,
    qqtInfo: {
      data: nextData,
      cmccProfile: { ...currentProfile, ...profile },
      cmccProfileCheckedAt: new Date().toISOString(),
    },
  })
  return profile
}

export async function refreshCmccAccountProfile(args: {
  accountId: string
  cookie: string
  phone?: string
}): Promise<{ ok: boolean; profile?: CmccAccountProfile; message: string }> {
  const rec = await getAccountById(args.accountId)
  if (!rec) return { ok: false, message: '账号不存在' }
  const queryProfile = async (cookie: string) => {
    let result = await queryUserInformation({ cookie, phone: args.phone })
    if (!result.ok && Number(result.status) !== 403) {
      const fallback = await queryBalanceUserInformation({ cookie, phone: args.phone })
      if (fallback.ok) result = fallback
    }
    return result
  }
  let businessCookie = rec.cmccAppCookie
  let result = businessCookie ? await queryProfile(businessCookie) : undefined
  if (!result?.ok) {
    const exchanged = await exchange10086CookieToCmccApp({ cookie: args.cookie })
    if (!exchanged.ok || !exchanged.cookie) {
      return {
        ok: false,
        message: exchanged.message || result?.message || 'CMCC 业务会话置换失败',
      }
    }
    businessCookie = exchanged.cookie
    await setAccountCmccAppCookie({ id: args.accountId, cookie: businessCookie })
    result = await queryProfile(businessCookie)
  }
  if (!result.ok || !result.data) {
    return {
      ok: false,
      message: result.retDesc || result.message || `用户资料查询失败（${result.status || 'UPSTREAM_ERROR'}）`,
    }
  }
  if (result.cookie && result.cookieUpdated) {
    await setAccountCmccAppCookie({ id: args.accountId, cookie: result.cookie })
  }
  const profile = await persistCmccAccountProfile({
    accountId: args.accountId,
    payload: result.data,
  })
  return {
    ok: true,
    profile,
    message: profile.netAge ? `账号信息已刷新，网龄 ${profile.netAge}` : '账号信息已刷新，未返回网龄',
  }
}

export const __test__ = {
  extractCmccAccountProfile,
}

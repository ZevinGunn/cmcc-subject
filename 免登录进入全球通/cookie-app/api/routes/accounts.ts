import { ensureYunpanGlobalToken } from '../services/yunpanSso.js'
import { parseCookieHeader } from '../services/cookieUtils.js'
import { buildAccountCloudLink, issueAccountQqtTicket, buildQqt10086Url, QqtTicketEmpty } from '../services/qqtSso.js'
import { Router, type Request, type Response } from 'express'
import crypto from 'node:crypto'
import os from 'node:os'
import type {
  ApiResp,
  AccountCookieResp,
  AccountCookieSetResp,
  AccountActivateResp,
  AccountRefreshResp,
  AccountSessionCapabilitiesResp,
  AccountSessionBridgeResp,
  AccountUpsertResp,
  AccountSummary,
  AccountsListResp,
  AccountsCleanupResp,
  HarParseResp,
  LoginResp,
  QqtSmsLoginResp,
  QqtSignInfoResp,
  QqtSignResp,
  QqtTokenResp,
  QqtTokenExportResp,
  QqtXdrReceiveResp,
  SendSmsResp,
} from '../services/cmccTypes.js'
import {
  cmccActivateFareBalance,
  cmccLoginBySms,
  cmccRefreshCookieByHome,
  cmccSendSms,
} from '../services/cmcc10086.js'
import { runPool } from '../services/runPool.js'
import { withKeyLock } from '../services/taskGuards.js'
import { withWedActivityLock } from '../services/wedActivityLock.js'
import {
  buildQqtSsoLink,
  qqtQueryXdrReceive,
  qqtReplaceToken,
  qqtSign,
  qqtSignInfo,
} from '../services/qqtSign.js'
import {
  classifyGlobalTelecomFailure,
  createGlobalTelecomOverviewSnapshot,
  globalTelecomAcceptReward,
  globalTelecomBlindBoxAction,
  globalTelecomResign,
  globalTelecomSign,
  invalidateGlobalTelecomOverview,
  mergeGlobalTelecomOverview,
  queryGlobalTelecomOverview,
  readGlobalTelecomOverviewSnapshot,
} from '../services/globalTelecom.js'
import { qqtLoginBySms, qqtSendSms } from '../services/qqtSmsAuth.js'
import {
  clearAccountCookie,
  deleteAccount,
  getAccountById,
  getAccountCookie,
  listAccounts,
  listAccountSummaries,
  setAccountCookie,
  setAccountAigouSession,
  setAccountCmccAppCookie,
  setAccountWedRechargeCookie,
  setAccountYunpanSession,
  setAccountDisplayPhone,
  setAccountPhone,
  setAccountActivationInfo,
  setAccountQqtInfo,
  setAccountQqtSignState,
  setAccountXdrReceive,
  setAccountQqtToken,
  setAccountSmsLoginWindow,
  setAccountWedRechargeInfo,
  softDisableAccount,
  touchAccountCookieCheckedAt,
  touchAccountQqtTokenCheckedAt,
  toAccountSummary,
  type AccountRecord,
  upsertAccount,
} from '../services/accountsStore.js'
import {
  buildQqtTokenExport,
  hasMonthlyReceived,
  hasXdrReceived,
  isQqtUser,
} from '../services/qqtTokenExport.js'
import {
  addLinkAccount,
  createPublicLink,
  deletePublicLink,
  getPublicLink,
  listPublicLinks,
  removeMissingAccounts,
} from '../services/publicLinksStore.js'
import {
  getPublicLinkPushConfig,
  listPublicLinkPushConfigs,
  setPublicLinkPushConfig,
} from '../services/publicLinkPushStore.js'
import {
  createOrReuseBatchTask,
  getActiveTask,
  getTaskById,
  type BatchTaskSummary,
} from '../services/batchTasks.js'
import {
  prepareWedRechargeSession,
  resolveWedRechargeRound,
  wedRechargeDrawPicture,
  wedRechargeQueryPictureInfo,
} from '../services/wedRecharge.js'
import {
  exchangeAppTokenToActivityCookie,
  exchange10086CookieToCmccApp,
  inspectSessionCapabilities,
  refreshHlwhdActivitySession,
} from '../services/cmccSessionBridge.js'
import {
  consumeCmccQrLoginCookie,
  createCmccQrLoginFlow,
  pollCmccQrLoginFlow,
} from '../services/cmccQrLogin.js'
import {
  yunpanLoginWithSmsOnly,
  yunpanSendSmsCode,
  YunpanAuthenticationExpired,
} from '../services/yunpan10086.js'
import {
  ensureUsable10086Cookie,
  recover10086CookieByYunpan,
} from '../services/cmccCookieRecovery.js'
import {
  buildAigouSsoLinkFrom10086Cookie,
  exchange10086CookieToAigou,
  validateAigouSession,
} from '../services/aigouSession.js'
import {
  buildCocPackageSsoLinkFrom10086Cookie,
  COC_PACKAGE_TARGETS,
  isCocPackageTarget,
} from '../services/cocPackageSession.js'
import {
  buildGlobalTelecomCustomerServiceLink,
  normalizeGlobalTelecomProvince,
  resolveGlobalTelecomCustomerServiceEntryUrl,
} from '../services/globalTelecomCustomerService.js'
import { prepareAccountCocPackageSession } from '../services/accountCocPackageSession.js'
import { parseHarForCmccNewHome } from '../services/harParser.js'
import { logEvent } from '../services/logStore.js'
import { getPrisma } from '../services/prisma.js'
import { pushPlusSend } from '../services/pushplus.js'
import {
  bindAccountsToUser,
  findCurrentUser,
  listUsers,
  syncInviteAccountOwnership,
} from '../services/userAuthStore.js'
import {
  getServiceLoginAccess,
  isAdminRequest,
  isLocalRequest,
} from '../services/serviceLoginGuard.js'

const router = Router()

const DEFAULT_QQT_TOKEN_EXPORT_UPDATED_WITHIN_MINUTES = 60
const DEFAULT_QQT_TOKEN_EXPORT_VALID_FOR_MINUTES = 120

function toV2AccountSummary(account: AccountSummary): AccountSummary {
  return {
    id: account.id,
    userId: account.userId,
    ownerUsername: account.ownerUsername,
    ownerDisplayName: account.ownerDisplayName,
    label: account.label,
    phone: account.phone,
    publicLinkIds: account.publicLinkIds,
    phoneMasked: account.phoneMasked,
    displayPhone: account.displayPhone,
    hasCookie: account.hasCookie,
    cookieUpdatedAt: account.cookieUpdatedAt,
    cookieInvalidAt: account.cookieInvalidAt,
    cookieInvalidReason: account.cookieInvalidReason,
    lastLoginMethod: account.lastLoginMethod,
    lastLoginAt: account.lastLoginAt,
    cookieSource: account.cookieSource,
    cookieExpireAt: account.cookieExpireAt,
    cookieTtlSeconds: account.cookieTtlSeconds,
    activationCheckedAt: account.activationCheckedAt,
    updatedAt: account.updatedAt,
    qqtAccessToken: account.qqtAccessToken ? 'available' : undefined,
    qqtAccessTokenCheckedAt: account.qqtAccessTokenCheckedAt,
    hasYunpanSession: account.hasYunpanSession,
    yunpanSessionUpdatedAt: account.yunpanSessionUpdatedAt,
    yunpanSessionCheckedAt: account.yunpanSessionCheckedAt,
    yunpanSessionInvalidAt: account.yunpanSessionInvalidAt,
    hasCmccAppCookie: account.hasCmccAppCookie,
    cmccAppCookieUpdatedAt: account.cmccAppCookieUpdatedAt,
    hasWedRechargeCookie: account.hasWedRechargeCookie,
    wedRechargeCookieUpdatedAt: account.wedRechargeCookieUpdatedAt,
    qqtSignUpdatedAt: account.qqtSignUpdatedAt,
    xdrReceiveUpdatedAt: account.xdrReceiveUpdatedAt,
    wedRechargeUpdatedAt: account.wedRechargeUpdatedAt,
    smsLoginAt: account.smsLoginAt,
    smsLoginExpireAt: account.smsLoginExpireAt,
    disabledAt: account.disabledAt,
    disabledReason: account.disabledReason,
  }
}

function pickMessageForErrorCode(code: string): string {
  if (code === 'INVALID_PHONE') return '手机号格式不正确'
  if (code === 'NOT_FOUND') return '账号不存在'
  return '服务端异常'
}

function maskPhone(phone?: string): string {
  if (!phone) return ''
  if (!/^1\d{10}$/.test(phone)) return ''
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`
}

type LoginStepStatus = 'start' | 'success' | 'warning' | 'failure'

function loginStepMeta(extra?: Record<string, unknown>): Record<string, unknown> {
  return {
    ...extra,
    host: os.hostname(),
  }
}

function traceYunpanLogin(args: {
  requestId: string
  phase: string
  status: LoginStepStatus
  phone?: string
  accountId?: string
  linkId?: string
  message?: string
  meta?: Record<string, unknown>
}): void {
  const payload = loginStepMeta({
    phoneMasked: maskPhone(args.phone),
    phase: args.phase,
    status: args.status,
    accountId: args.accountId,
    linkId: args.linkId,
    message: args.message,
    ...args.meta,
  })
  const line = `[yunpan-login] requestId=${args.requestId} ${JSON.stringify(payload)}`
  if (args.status === 'failure') console.error(line)
  else if (args.status === 'warning') console.warn(line)
  else console.log(line)
}

async function logLoginStep(args: {
  requestId: string
  phase: string
  status: LoginStepStatus
  phone?: string
  accountId?: string
  linkId?: string
  message?: string
  meta?: Record<string, unknown>
}): Promise<void> {
  traceYunpanLogin(args)
  try {
    await logEvent({
      level:
        args.status === 'failure' ? 'error' : args.status === 'warning' ? 'warn' : 'info',
      action: `account.yunpan.login.${args.phase}.${args.status}`,
      requestId: args.requestId,
      accountId: args.accountId,
      linkId: args.linkId,
      message: args.message,
      meta: loginStepMeta({
        phoneMasked: maskPhone(args.phone),
        phase: args.phase,
        status: args.status,
        ...args.meta,
      }),
    })
  } catch (e) {
    console.warn(
      `[yunpan-login] requestId=${args.requestId} logEvent failed ${
        e instanceof Error ? e.message : String(e)
      }`,
    )
  }
}

function debugFromResult(result: {
  status?: number
  message?: string
  ssoUrl?: string
  ssoToken?: string
  wxCookie?: string
  wxCookieNames?: string[]
  upstreamResponse?: unknown
  rawTextSnippet?: string
}): Record<string, unknown> {
  return {
    upstreamStatus: result.status,
    upstreamMessage: result.message,
    upstreamResponse: result.upstreamResponse,
    rawTextSnippet: result.rawTextSnippet,
    hasSsoUrl: Boolean(result.ssoUrl),
    hasSsoToken: Boolean(result.ssoToken),
    hasWxCookie: Boolean(result.wxCookie),
    wxCookieNames: result.wxCookieNames,
  }
}

async function withStepTimeout<T>(promise: Promise<T>, timeoutMs: number, phase: string): Promise<T> {
  let timer: NodeJS.Timeout | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${phase}_TIMEOUT`)), timeoutMs)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

function messageForYunpanLoginError(message: string): string {
  if (message === 'YUNPAN_SMS_LOGIN_TIMEOUT') return '云盘登录上游超时，请重试'
  if (message === 'YUNPAN_COLLECT_10086_COOKIE_TIMEOUT') {
    return '云盘登录成功，但自动换取 10086 CK 超时，已保存云盘会话，可稍后刷新 CK'
  }
  if (message === 'YUNPAN_BUILD_10086_SSO_LINK_TIMEOUT') {
    return '云盘登录成功，但生成 10086 SSO 链接超时，已保存云盘会话'
  }
  if (message === 'UPSTREAM_TIMEOUT') return '上游超时，请重试'
  return message
}

function formatAccountDisplay(rec?: { phone?: string; displayPhone?: string; label?: string }): string {
  if (!rec) return '该账号'
  if (rec.displayPhone && rec.displayPhone.trim()) return rec.displayPhone.trim()
  const masked = maskPhone(rec.phone)
  if (masked) return masked
  if (rec.label && rec.label.trim()) return rec.label.trim()
  return '该账号'
}

async function prepareWedRechargeCookieForAccount(args: {
  id: string
  cookie: string
  requestHeaders?: Record<string, string>
  newHomeUrl?: string
  useAppToken?: boolean
  appTokenLogin?: Record<string, unknown>
}): Promise<string> {
  if (args.useAppToken) {
    const app = args.appTokenLogin ?? {}
    const token =
      (typeof app.token === 'string' && app.token.trim()) ||
      (typeof app.appToken === 'string' && app.appToken.trim()) ||
      (app.postBody &&
      typeof app.postBody === 'object' &&
      !Array.isArray(app.postBody) &&
      typeof (app.postBody as Record<string, unknown>).token === 'string'
        ? ((app.postBody as Record<string, unknown>).token as string).trim()
        : '') ||
      ''
    const sid = typeof app.sid === 'string' ? app.sid.trim() : ''
    const loginUrl = typeof app.loginUrl === 'string' ? app.loginUrl.trim() : ''
    const activityUrl = typeof app.activityUrl === 'string' ? app.activityUrl.trim() : ''
    if (!token || (!sid && !loginUrl && !activityUrl)) {
      throw new Error('已勾选置换 appck，但缺少 appTokenLogin.token 或活动 sid/token')
    }
    const exchanged = await exchangeAppTokenToActivityCookie({
      cookie: args.cookie,
      token,
      postBody:
        app.postBody && typeof app.postBody === 'object' && !Array.isArray(app.postBody)
          ? (app.postBody as Record<string, unknown>)
          : undefined,
      jwtToken:
        typeof app.jwtToken === 'string' && app.jwtToken.trim()
          ? app.jwtToken.trim()
          : app.jwtToken === null
            ? null
            : undefined,
      sid,
      loginUrl,
      activityUrl,
      provinceCode: typeof app.provinceCode === 'string' ? app.provinceCode.trim() : undefined,
      cityCode: typeof app.cityCode === 'string' ? app.cityCode.trim() : undefined,
      userCheckId: typeof app.userCheckId === 'string' ? app.userCheckId.trim() : undefined,
      carrierOperator: typeof app.carrierOperator === 'string' ? app.carrierOperator.trim() : undefined,
      appVersionCode: typeof app.appVersionCode === 'string' ? app.appVersionCode.trim() : undefined,
      took: typeof app.took === 'number' && Number.isFinite(app.took) ? app.took : undefined,
    })
    if (!exchanged.ok || !exchanged.cookie) {
      throw new Error(exchanged.message || '周三 appck 置换失败')
    }
    await setAccountWedRechargeCookie({ id: args.id, cookie: exchanged.cookie })
    return exchanged.cookie
  }
  const session = await prepareWedRechargeSession({
    cookie: args.cookie,
    forceRefresh: true,
  })
  if (session.updated && session.cookie !== args.cookie) {
    await setAccountWedRechargeCookie({ id: args.id, cookie: session.cookie })
  }
  return session.cookie
}

async function notifyCookieInvalid(args: {
  rec?: { phone?: string; displayPhone?: string; label?: string; id?: string }
  reason?: string
  source: string
}): Promise<void> {
  const display = formatAccountDisplay(args.rec)
  const accountId = args.rec?.id || 'unknown'
  const reason = args.reason || 'Cookie 已失效'
  const targets = accountId !== 'unknown' ? await resolvePushTargetsForAccount(accountId, 'notifyCookieInvalid') : []
  if (targets.length === 0) {
    await pushPlusSend({
      title: `中国移动账号失效提醒: ${display}`,
      content: [
        `### 中国移动账号状态提醒`,
        `- 账号: ${display}`,
        `- 账号ID: ${accountId}`,
        `- 来源: ${args.source}`,
        `- 原因: ${reason}`,
        `- 时间: ${new Date().toLocaleString('zh-CN', { hour12: false })}`,
        ``,
        `请及时重新登录并刷新账号状态。`,
      ].join('\n'),
    })
    return
  }
  for (const target of targets) {
    await pushPlusSend({
      token: target.pushplusToken,
      title: `中国移动账号失效提醒: ${display}`,
      content: [
        `### 中国移动账号状态提醒`,
        `- 邀请码: ${target.linkId}`,
        `- 账号: ${display}`,
        `- 账号ID: ${accountId}`,
        `- 来源: ${args.source}`,
        `- 原因: ${reason}`,
        `- 时间: ${new Date().toLocaleString('zh-CN', { hour12: false })}`,
      ].join('\n'),
    })
  }
}

type LinkPushNotifyKey = 'notifyLogin' | 'notifyCookieInvalid' | 'notifyRushResult'

async function resolvePushTargetsForAccount(accountId: string, key: LinkPushNotifyKey) {
  const links = await listPublicLinks()
  const configs = await listPublicLinkPushConfigs()
  const targets: Array<{ linkId: string; pushplusToken: string }> = []
  for (const link of links) {
    if (!link.accountIds.includes(accountId)) continue
    const config = configs[link.id]
    if (!config?.pushplusEnabled || !config.pushplusToken) continue
    if (!config[key]) continue
    targets.push({ linkId: link.id, pushplusToken: config.pushplusToken })
  }
  return targets
}

async function notifyLoginByLink(args: {
  linkId: string
  accountId: string
  display: string
}): Promise<void> {
  const config = await getPublicLinkPushConfig(args.linkId)
  if (!config.pushplusEnabled || !config.pushplusToken || !config.notifyLogin) return
  await pushPlusSend({
    token: config.pushplusToken,
    title: `中国移动账号登录成功: ${args.display}`,
    content: [
      `### 中国移动账号登录通知`,
      `- 邀请码: ${args.linkId}`,
      `- 账号: ${args.display}`,
      `- 账号ID: ${args.accountId}`,
      `- 时间: ${new Date().toLocaleString('zh-CN', { hour12: false })}`,
    ].join('\n'),
  })
}

function getValidityWindowMin(): number {
  const raw = Number(process.env.CMCC_VALIDITY_WINDOW_MIN ?? 90)
  if (!Number.isFinite(raw)) return 90
  return Math.max(1, Math.min(24 * 60, Math.floor(raw)))
}

function isWithinWindow(iso: string | undefined, windowMin: number): boolean {
  if (!iso) return false
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return false
  return Date.now() - t <= windowMin * 60_000
}

function normalizePhoneCandidate(value: string): string | undefined {
  const digits = value.replace(/\D+/g, '')
  if (/^1\d{10}$/.test(digits)) return digits
  return undefined
}

function isSixDigitCode(value: string): boolean {
  return /^\d{6}$/.test(value)
}

function extractPhoneFromObject(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') {
    return normalizePhoneCandidate(value)
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const hit = extractPhoneFromObject(item)
      if (hit) return hit
    }
    return undefined
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    for (const [k, v] of Object.entries(obj)) {
      const key = k.toLowerCase()
      if (
        key.includes('phone') ||
        key.includes('tel') ||
        key.includes('mobile') ||
        key.includes('msisdn') ||
        key.includes('number')
      ) {
        if (typeof v === 'string') {
          const hit = normalizePhoneCandidate(v)
          if (hit) return hit
        }
      }
      const nested = extractPhoneFromObject(v)
      if (nested) return nested
    }
  }
  return undefined
}

function extractPhoneFromDecrypted(text: string): string | undefined {
  if (!text) return undefined
  try {
    const parsed = JSON.parse(text) as unknown
    const hit = extractPhoneFromObject(parsed)
    if (hit) return hit
  } catch {
    // ignore
  }
  const match = text.match(/\b1\d{10}\b/)
  return match ? match[0] : undefined
}

function parseActivationPayload(text: string): Record<string, unknown> | undefined {
  if (!text) return undefined
  try {
    const parsed = JSON.parse(text) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return undefined
    }
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


function buildMaskedPhoneCandidate(value?: string): string | undefined {
  const text = String(value || '').trim()
  if (!text) return undefined
  const full = normalizePhoneCandidate(text)
  if (full) return `${full.slice(0, 3)}****${full.slice(-4)}`
  const m = text.match(/(1\d{2})\D*(\d{4})$/)
  if (!m) return undefined
  return `${m[1]}****${m[2]}`
}

function dedupeKeyForAccount(rec: {
  phone?: string
  displayPhone?: string
  qqtInfo?: Record<string, unknown>
}): string | undefined {
  const fullPhone =
    normalizePhoneCandidate(rec.phone || '') ||
    normalizePhoneCandidate(rec.displayPhone || '') ||
    extractPhoneFromObject(rec.qqtInfo)
  if (fullPhone) return `full:${fullPhone}`
  const masked =
    buildMaskedPhoneCandidate(rec.phone) ||
    buildMaskedPhoneCandidate(rec.displayPhone)
  if (masked) return `mask:${masked}`
  return undefined
}

function scoreAccountForDedup(rec: {
  cookie?: string
  qqtAccessToken?: string
  activationInfo?: Record<string, unknown>
  qqtInfo?: Record<string, unknown>
  qqtSignInfo?: Record<string, unknown>
  qqtSignResult?: Record<string, unknown>
  xdrReceive?: Record<string, unknown>
  updatedAt?: string
}): number {
  let score = 0
  if (rec.cookie) score += 100
  if (rec.qqtAccessToken) score += 50
  if (rec.activationInfo) score += 20
  if (rec.qqtInfo) score += 15
  if (rec.qqtSignInfo || rec.qqtSignResult) score += 10
  if (rec.xdrReceive) score += 10
  const updatedMs = Date.parse(rec.updatedAt || '')
  if (Number.isFinite(updatedMs)) score += updatedMs / 1e13
  return score
}

function resolvePublicLinkBase(): string {
  const configured = String(process.env.PUBLIC_LINK_BASE_URL || '').trim()
  if (configured) return configured.replace(/\/+$/, '')
  return 'http://home.1008086.xyz'
}

function buildPublicLinkUrl(linkId: string): string {
  const base = resolvePublicLinkBase()
  const encoded = encodeURIComponent(linkId)
  return base ? `${base}/public?link=${encoded}` : `/public?link=${encoded}`
}

function appendLinkToUrl(urlText: string, linkId: string): string {
  const trimmed = String(urlText || '').trim()
  if (!trimmed) return buildPublicLinkUrl(linkId)
  try {
    const url = new URL(trimmed)
    if (linkId) url.searchParams.set('link', linkId)
    return url.toString()
  } catch {
    const joiner = trimmed.includes('?') ? '&' : '?'
    return `${trimmed}${joiner}link=${encodeURIComponent(linkId)}`
  }
}

function buildDisplayedPublicLinkUrl(linkId: string, redirectEnabled: boolean, redirectUrl?: string): string {
  if (redirectEnabled && redirectUrl) return appendLinkToUrl(redirectUrl, linkId)
  return buildPublicLinkUrl(linkId)
}

function resolvePublicLinkIpBase(req: Request): string {
  const configured = String(process.env.PUBLIC_LINK_IP_BASE_URL || '').trim()
  if (configured) return configured.replace(/\/+$/, '')
  const hostHeader = String(req.headers.host || '').trim()
  const port = hostHeader.includes(':') ? hostHeader.split(':').pop() : ''
  let ip = ''
  const nets = os.networkInterfaces()
  for (const list of Object.values(nets)) {
    for (const item of list || []) {
      if (item.family === 'IPv4' && !item.internal) {
        ip = item.address
        break
      }
    }
    if (ip) break
  }
  if (!ip) ip = '127.0.0.1'
  return `http://${ip}${port ? `:${port}` : ''}`
}

function buildPublicLinkIpUrl(req: Request, linkId: string): string {
  const encoded = encodeURIComponent(linkId)
  return `${resolvePublicLinkIpBase(req)}/public?link=${encoded}`
}

async function ensureFreshCookie(args: {
  id: string
  cookie: string
  requestHeaders?: Record<string, string>
  newHomeUrl?: string
}): Promise<{ ok: boolean; cookie?: string; message?: string }> {
  const rec = await getAccountById(args.id)
  if (rec) {
    const usable = await ensureUsable10086Cookie({
      rec,
      allowRecentSkip: false,
      windowMin: getValidityWindowMin(),
      clearOnYunpanFailure: true,
      preferYunpan: Boolean(rec.yunpanSession),
    })
    if (!usable.ok || !usable.cookie) {
      return { ok: false, message: usable.message || '刷新失败' }
    }
    return { ok: true, cookie: usable.cookie, message: usable.message }
  }

  const r = await cmccRefreshCookieByHome(args.cookie, args.requestHeaders, args.newHomeUrl)
  if (!r.ok || !r.cookie) {
    return { ok: false, message: r.message || '刷新失败' }
  }
  if (r.cookieUpdated) {
    await setAccountCookie({ id: args.id, cookie: r.cookie })
  } else {
    await touchAccountCookieCheckedAt({ id: args.id })
  }
  return { ok: true, cookie: r.cookie }
}

function normalizeRequestHeaders(
  input: unknown,
): Record<string, string> | undefined {
  if (input === undefined || input === null) return undefined
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('INVALID_HEADERS')
  }
  const raw = input as Record<string, unknown>
  const headersObj =
    raw.headers &&
    typeof raw.headers === 'object' &&
    !Array.isArray(raw.headers)
      ? (raw.headers as Record<string, unknown>)
      : raw
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(headersObj)) {
    const key = k.trim().toLowerCase()
    if (!key || key === 'cookie') continue
    if (v === null || v === undefined) continue
    out[key] = String(v)
  }
  return out
}

function normalizeCookieInput(raw: string): string {
  return String(raw || '')
    .replace(/^cookie\s*:\s*/i, '')
    .trim()
}

function readPublicLinkId(req: Request): string | undefined {
  const bodyValue =
    typeof req.body?.publicLinkId === 'string' ? req.body.publicLinkId : ''
  const queryValue =
    typeof req.query?.publicLinkId === 'string' ? req.query.publicLinkId : ''
  const value = String(bodyValue || queryValue || '').trim()
  return value || undefined
}

function stringifyPretty(value: unknown): string {
  try {
    return JSON.stringify(value ?? null, null, 2)
  } catch {
    return String(value ?? '')
  }
}

async function buildPublicLinkExport(args: {
  linkId: string
}): Promise<{
  linkId: string
  accountCount: number
  text: string
}> {
  const link = await getPublicLink(args.linkId)
  if (!link) throw new Error('NOT_FOUND')
  const blocks: string[] = []
  let accountCount = 0
  for (const accountId of link.accountIds) {
    const rec = await getAccountById(accountId)
    if (!rec || rec.disabledAt) continue
    accountCount += 1
    blocks.push(
      [
        `链接ID: ${args.linkId}`,
        `账号ID: ${rec.id}`,
        `手机号: ${rec.phone || '未获取'}`,
        `显示手机号: ${rec.displayPhone || '未获取'}`,
        `标签: ${rec.label || '未设置'}`,
        `Cookie更新时间: ${rec.cookieUpdatedAt || '未获取'}`,
        `激活时间: ${rec.activationCheckedAt || '未获取'}`,
        `Token校验时间: ${rec.qqtAccessTokenCheckedAt || '未获取'}`,
        `签到时间: ${rec.qqtSignUpdatedAt || '未获取'}`,
        `星动日更新时间: ${rec.xdrReceiveUpdatedAt || '未获取'}`,
        `激活信息: ${stringifyPretty(rec.activationInfo)}`,
        `全球通信息: ${stringifyPretty(rec.qqtInfo)}`,
        `签到信息: ${stringifyPretty(rec.qqtSignInfo)}`,
        `签到结果: ${stringifyPretty(rec.qqtSignResult)}`,
        `星动日信息: ${stringifyPretty(rec.xdrReceive)}`,
      ].join('\n'),
    )
  }
  return {
    linkId: args.linkId,
    accountCount,
    text: blocks.join('\n\n====================\n\n'),
  }
}

async function ensurePublicLinkAccess(args: {
  req: Request
  res: Response
  requestId: string
  accountId?: string
}): Promise<{ ok: true; linkId?: string } | { ok: false }> {
  if (isAdminRequest(args.req)) {
    return { ok: true }
  }
  const currentUser = await findCurrentUser(args.req).catch(() => null)
  if (currentUser) {
    let linkId: string | undefined
    const requestedLinkId = readPublicLinkId(args.req)
    if (requestedLinkId) {
      const link = await getPublicLink(requestedLinkId).catch(() => null)
      if (link?.usedByUserId === currentUser.id) {
        linkId = requestedLinkId
      }
    }
    if (args.accountId) {
      const rec = await getAccountById(args.accountId)
      if (!rec || rec.disabledAt) {
        args.res.status(404).json({
          ok: false,
          message: '账号已失效',
          errorCode: 'ACCOUNT_DISABLED',
          requestId: args.requestId,
        })
        return { ok: false }
      }
      if (rec.userId && rec.userId !== currentUser.id) {
        args.res.status(403).json({
          ok: false,
          message: '该账号不属于当前用户',
          errorCode: 'USER_ACCOUNT_FORBIDDEN',
          requestId: args.requestId,
        })
        return { ok: false }
      }
    }
    return { ok: true, linkId }
  }
  const linkId = readPublicLinkId(args.req)
  if (!linkId) {
    args.res.status(403).json({
      ok: false,
      message: '请使用有效的邀请码访问此页面',
      errorCode: 'PUBLIC_LINK_REQUIRED',
      requestId: args.requestId,
    })
    return { ok: false }
  }
  const link = await getPublicLink(linkId)
  if (!link) {
    args.res.status(404).json({
      ok: false,
      message: '链接不存在',
      errorCode: 'NOT_FOUND',
      requestId: args.requestId,
    })
    return { ok: false }
  }
  if (args.accountId && !link.accountIds.includes(args.accountId)) {
    args.res.status(403).json({
      ok: false,
      message: '该账号不属于当前邀请码',
      errorCode: 'LINK_ACCOUNT_FORBIDDEN',
      requestId: args.requestId,
    })
    return { ok: false }
  }
  if (args.accountId) {
    const rec = await getAccountById(args.accountId)
    if (!rec || rec.disabledAt) {
      args.res.status(404).json({
        ok: false,
        message: '账号已失效',
        errorCode: 'ACCOUNT_DISABLED',
        requestId: args.requestId,
      })
      return { ok: false }
    }
  }
  return { ok: true, linkId }
}

function denyServiceLogin(args: {
  req: Request
  res: Response
  requestId: string
}): boolean {
  const access = getServiceLoginAccess(args.req)
  if (!access.ok) {
    args.res.status(403).json({
      ok: false,
      message: access.message || '服务端登录已关闭',
      errorCode: 'SERVICE_LOGIN_DISABLED',
      requestId: args.requestId,
    })
    return true
  }
  return false
}

router.get('/', async (req: Request, res: Response<AccountsListResp>) => {
  const requestId = crypto.randomUUID()
  try {
    if (!isAdminRequest(req)) {
      res.status(403).json({
        ok: false,
        message: 'Forbidden',
        errorCode: 'FORBIDDEN',
        requestId,
      })
      return
    }
    const includeDisabled =
      req.query?.includeDisabled === '1' || req.query?.includeDisabled === 'true'
    await syncInviteAccountOwnership()
    const accounts = await listAccountSummaries({ includeDisabled })
    const links = await listPublicLinks()
    const users = await listUsers()
    const usersById = new Map(users.map((user) => [user.id, user]))
    const linkIdsByAccountId: Record<string, string[]> = {}
    for (const link of links) {
      for (const accountId of link.accountIds) {
        const prev = linkIdsByAccountId[accountId] ?? []
        if (!prev.includes(link.id)) {
          linkIdsByAccountId[accountId] = [...prev, link.id]
        }
      }
    }
    const withLinks = accounts.map((account) => ({
      ...account,
      ownerUsername: account.userId ? usersById.get(account.userId)?.username : undefined,
      ownerDisplayName: account.userId ? usersById.get(account.userId)?.displayName : undefined,
      publicLinkIds: linkIdsByAccountId[account.id] ?? [],
    }))
    const responseAccounts = req.query?.view === 'v2'
      ? withLinks.map(toV2AccountSummary)
      : withLinks
    res.json({ ok: true, data: { accounts: responseAccounts }, requestId })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res
      .status(500)
      .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
  }
})

type GlobalTelecomAccountContext = {
  rec: AccountRecord
  cookie: string
  sspid: string
}

function readGlobalTelecomSspid(req: Request): string {
  return String(
    req.body?.sspid || process.env.DEFAULT_QQT_SSPID || process.env.QQT_SSPID || '75442',
  ).trim()
}

async function resolveGlobalTelecomAccount(args: {
  req: Request
  res: Response
  requestId: string
  accountId: string
  cacheOnly?: boolean
  preferCachedToken?: boolean
}): Promise<GlobalTelecomAccountContext | undefined> {
  const access = await ensurePublicLinkAccess({
    req: args.req,
    res: args.res,
    requestId: args.requestId,
    accountId: args.accountId,
  })
  if (!access.ok) return undefined
  const rec = await getAccountById(args.accountId)
  if (!rec) {
    args.res.status(404).json({
      ok: false,
      message: '账号不存在',
      errorCode: 'NOT_FOUND',
      requestId: args.requestId,
    })
    return undefined
  }
  const sspid = readGlobalTelecomSspid(args.req)
  if (!/^\d{3,12}$/.test(sspid)) {
    args.res.status(400).json({
      ok: false,
      message: 'SSPID 格式不正确',
      errorCode: 'INVALID_SSPID',
      requestId: args.requestId,
    })
    return undefined
  }
  if (args.cacheOnly) return { rec, cookie: rec.cookie || '', sspid }
  if (rec.yunpanSession) {
    const latest = await ensureYunpanGlobalToken(rec)
    return { rec: latest, cookie: '', sspid }
  }
  let cookie = rec.cookie || ''
  if ((cookie || rec.yunpanSession) && !(args.preferCachedToken && rec.qqtAccessToken)) {
    const usable = await ensureUsable10086Cookie({
      rec,
      allowRecentSkip: true,
      windowMin: 30,
      clearOnYunpanFailure: false,
      preferYunpan: false,
    })
    if (usable.ok && usable.cookie) cookie = usable.cookie
  }
  if (!cookie && !rec.qqtAccessToken) {
    args.res.status(410).json({
      ok: false,
      message: '账号暂无可用的 10086 CK 或全球通 Token',
      errorCode: 'GLOBAL_TELECOM_SESSION_REQUIRED',
      requestId: args.requestId,
    })
    return undefined
  }
  return { rec, cookie, sspid }
}

function globalTelecomFailure(res: Response, error: unknown, requestId: string): void {
  const failure = classifyGlobalTelecomFailure(error)
  if (failure.retryAfterSeconds) {
    res.setHeader('Retry-After', String(failure.retryAfterSeconds))
  }
  res.status(failure.status).json({
    ok: false,
    message: failure.message,
    errorCode: failure.errorCode,
    ...(failure.retryAfterSeconds ? {
      cloudflare_error: true,
      retry_after: failure.retryAfterSeconds,
    } : {}),
    requestId,
  })
}

function readAccountGlobalTelecomProvince(rec: AccountRecord, requestedProvince: unknown): string {
  const snapshot = readGlobalTelecomOverviewSnapshot(rec.qqtInfo, {
    maxAgeMs: Number.MAX_SAFE_INTEGER,
  })
  const infoData = rec.qqtInfo?.data && typeof rec.qqtInfo.data === 'object'
    ? rec.qqtInfo.data as Record<string, unknown>
    : undefined
  const candidate =
    snapshot?.identity.province ||
    (typeof infoData?.province === 'string' ? infoData.province : '') ||
    (typeof requestedProvince === 'string' ? requestedProvince : '')
  return normalizeGlobalTelecomProvince(candidate)
}

router.post(
  '/:id/global-telecom/overview',
  async (req: Request, res: Response<ApiResp<unknown>>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id || '').trim()
    try {
      const cacheOnly = req.body?.cacheOnly === true
      const context = await resolveGlobalTelecomAccount({
        req,
        res,
        requestId,
        accountId: id,
        cacheOnly,
        preferCachedToken: true,
      })
      if (!context) return
      const account = {
        id: context.rec.id,
        label: maskPhone(context.rec.label || context.rec.displayPhone || context.rec.phone),
        phoneMasked: maskPhone(context.rec.displayPhone || context.rec.phone),
        hasYunpanSession: Boolean(context.rec.yunpanSession),
        yunpanSessionCheckedAt: context.rec.yunpanSession?.checkedAt,
        yunpanSessionInvalidAt: context.rec.yunpanSession?.invalidAt,
      }
      const persistedOverview = readGlobalTelecomOverviewSnapshot(context.rec.qqtInfo)
      if (cacheOnly) {
        res.json({ ok: true, data: { account, overview: persistedOverview ?? null }, requestId })
        return
      }

      let overview
      try {
        const liveOverview = await queryGlobalTelecomOverview({
          cmccCookie: context.cookie,
          requestHeaders: context.rec.requestHeaders,
          accessToken: context.rec.qqtAccessToken,
          sspid: context.sspid,
          cachedProfile: context.rec.qqtInfo,
          cacheKey: `${id}:${context.sspid}`,
          refreshAccessToken: context.rec.yunpanSession ? async () => {
            const latest = await ensureYunpanGlobalToken((await getAccountById(id)) || context.rec, true)
            return latest.qqtAccessToken!
          } : undefined,
          refreshCmccCookie: !context.rec.yunpanSession && context.rec.qqtAccessToken && context.rec.cookie
            ? async () => {
              const latest = (await getAccountById(id)) ?? context.rec
              const usable = await ensureUsable10086Cookie({
                rec: latest,
                allowRecentSkip: false,
                windowMin: 30,
                clearOnYunpanFailure: false,
                preferYunpan: false,
              })
              if (!usable.ok || !usable.cookie) {
                throw new Error(`缓存 Token 已失效，${usable.message || '10086 CK 恢复失败'}`)
              }
              return usable.cookie
            }
            : undefined,
        })
        overview = mergeGlobalTelecomOverview(persistedOverview, liveOverview)
      } catch (error) {
        const message = error instanceof Error ? error.message : '上游查询失败'
        overview = readGlobalTelecomOverviewSnapshot(context.rec.qqtInfo, {
          systemError: `全球通上游暂不可用，当前展示最近成功数据：${message}`,
        })
        if (!overview) throw error
      }

      if (overview.accessToken) {
        await setAccountQqtToken({ id, qqtAccessToken: overview.accessToken })
      }
      const previousInfo = context.rec.qqtInfo ?? {}
      const latestSession = (await getAccountById(id))?.yunpanSession
      account.hasYunpanSession = Boolean(latestSession)
      account.yunpanSessionCheckedAt = latestSession?.checkedAt
      account.yunpanSessionInvalidAt = latestSession?.invalidAt
      const previousData = previousInfo.data && typeof previousInfo.data === 'object'
        ? previousInfo.data as Record<string, unknown>
        : {}
      if (overview.cache.status === 'live' || overview.cache.status === 'fresh-cache') {
        await setAccountQqtInfo({
          id,
          qqtInfo: {
            ...previousInfo,
            data: {
              ...previousData,
              levelName: overview.identity.levelName,
              userLevel: overview.identity.levelCode,
              province: overview.identity.province,
              netAge: overview.identity.netAge,
              userBegin: overview.identity.joinedAt,
            },
            globalTelecomOverview: createGlobalTelecomOverviewSnapshot(overview),
            globalTelecomCheckedAt: overview.refreshedAt,
          },
        })
      }
      await logEvent({
        action: 'global_telecom.overview',
        requestId,
        accountId: id,
        message: Object.keys(overview.errors).length > 0 ? 'partial_success' : 'ok',
        meta: { modulesWithErrors: Object.keys(overview.errors) },
      })
      res.json({
        ok: true,
        data: {
          account,
          overview: { ...overview, accessToken: undefined },
        },
        requestId,
      })
    } catch (error) {
      await logEvent({
        level: 'error',
        action: 'global_telecom.overview',
        requestId,
        accountId: id,
        message: error instanceof Error ? error.message : '查询失败',
      })
      globalTelecomFailure(res, error, requestId)
    }
  },
)

router.post(
  '/:id/global-telecom/customer-service-link',
  async (req: Request, res: Response<ApiResp<unknown>>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id || '').trim()
    try {
      const access = await ensurePublicLinkAccess({ req, res, requestId, accountId: id })
      if (!access.ok) return
      const rec = await getAccountById(id)
      if (!rec) {
        res.status(404).json({
          ok: false,
          message: '账号不存在',
          errorCode: 'NOT_FOUND',
          requestId,
        })
        return
      }
      const province = readAccountGlobalTelecomProvince(rec, req.body?.province)
      if (!province || !resolveGlobalTelecomCustomerServiceEntryUrl(province)) {
        res.status(422).json({
          ok: false,
          message: province
            ? `全球通源码未提供${province}的网页专属客服入口`
            : '未查询到账号归属省份，暂时无法打开专属客服',
          errorCode: 'CUSTOMER_SERVICE_UNAVAILABLE',
          requestId,
        })
        return
      }
      const result = await buildGlobalTelecomCustomerServiceLink({ province })
      if (!result.ok || !result.ssoUrl) {
        res.status(422).json({
          ok: false,
          message: result.message || '生成全球通专属客服入口失败',
          errorCode: 'CUSTOMER_SERVICE_UNAVAILABLE',
          requestId,
        })
        return
      }
      await logEvent({
        action: 'global_telecom.customer_service_link.generate',
        requestId,
        accountId: id,
        message: 'ok',
        meta: { province },
      })
      res.json({
        ok: true,
        data: { ssoUrl: result.ssoUrl, province },
        requestId,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : '生成全球通专属客服入口失败'
      await logEvent({
        level: 'error',
        action: 'global_telecom.customer_service_link.generate',
        requestId,
        accountId: id,
        message,
      })
      res.status(message === 'UPSTREAM_TIMEOUT' ? 504 : 500).json({
        ok: false,
        message: message === 'UPSTREAM_TIMEOUT' ? '专属客服上游超时，请重试' : message,
        errorCode: message === 'UPSTREAM_TIMEOUT' ? 'UPSTREAM_TIMEOUT' : 'SERVER_ERROR',
        requestId,
      })
    }
  },
)

router.post(
  '/:id/global-telecom/sign',
  async (req: Request, res: Response<ApiResp<unknown>>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id || '').trim()
    if (String(req.body?.confirmationText || '').trim() !== '确认签到') {
      res.status(400).json({ ok: false, message: '请确认签到操作', errorCode: 'CONFIRMATION_REQUIRED', requestId })
      return
    }
    try {
      const context = await resolveGlobalTelecomAccount({ req, res, requestId, accountId: id })
      if (!context) return
      const result = await globalTelecomSign({
        cmccCookie: context.cookie,
        requestHeaders: context.rec.requestHeaders,
        accessToken: context.cookie ? undefined : context.rec.qqtAccessToken,
        sspid: context.sspid,
      })
      invalidateGlobalTelecomOverview(id)
      await setAccountQqtToken({ id, qqtAccessToken: result.accessToken })
      await logEvent({ action: 'global_telecom.sign', requestId, accountId: id, message: result.message })
      res.json({ ok: true, data: { result: result.payload }, message: result.message, requestId })
    } catch (error) {
      globalTelecomFailure(res, error, requestId)
    }
  },
)

router.post(
  '/:id/global-telecom/resign',
  async (req: Request, res: Response<ApiResp<unknown>>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id || '').trim()
    const dayNum = Number(req.body?.dayNum)
    const requestedTaskIds: number[] = Array.isArray(req.body?.taskIds)
      ? (req.body.taskIds as unknown[]).map((value) => Number(value))
      : [Number(req.body?.taskId)]
    const taskIds: number[] = Array.from(new Set<number>(requestedTaskIds))
    if (String(req.body?.confirmationText || '').trim() !== '确认补签' ||
        !Number.isInteger(dayNum) || dayNum < 1 || dayNum > 31 ||
        taskIds.length < 1 || taskIds.length > 3 ||
        taskIds.some((taskId) => !Number.isInteger(taskId) || taskId <= 0)) {
      res.status(400).json({ ok: false, message: '补签参数或确认信息不完整', errorCode: 'INVALID_RESIGN_REQUEST', requestId })
      return
    }
    try {
      const context = await resolveGlobalTelecomAccount({ req, res, requestId, accountId: id })
      if (!context) return
      const result = await globalTelecomResign({
        cmccCookie: context.cookie,
        requestHeaders: context.rec.requestHeaders,
        accessToken: context.cookie ? undefined : context.rec.qqtAccessToken,
        sspid: context.sspid,
        dayNum,
        taskIds,
      })
      invalidateGlobalTelecomOverview(id)
      await setAccountQqtToken({ id, qqtAccessToken: result.accessToken })
      await logEvent({ action: 'global_telecom.resign', requestId, accountId: id, message: result.message, meta: { dayNum, taskIds } })
      res.json({ ok: true, data: { result: result.payload }, message: result.message, requestId })
    } catch (error) {
      globalTelecomFailure(res, error, requestId)
    }
  },
)

router.post(
  '/:id/global-telecom/reward',
  async (req: Request, res: Response<ApiResp<unknown>>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id || '').trim()
    const dayNum = Number(req.body?.dayNum)
    const prizeId = String(req.body?.prizeId || '').trim()
    if (String(req.body?.confirmationText || '').trim() !== '确认补领' ||
        !Number.isInteger(dayNum) || dayNum < 1 || dayNum > 31 || !prizeId) {
      res.status(400).json({ ok: false, message: '奖品补领参数或确认信息不完整', errorCode: 'INVALID_REWARD_REQUEST', requestId })
      return
    }
    try {
      const context = await resolveGlobalTelecomAccount({ req, res, requestId, accountId: id })
      if (!context) return
      const result = await globalTelecomAcceptReward({
        cmccCookie: context.cookie,
        requestHeaders: context.rec.requestHeaders,
        accessToken: context.cookie ? undefined : context.rec.qqtAccessToken,
        sspid: context.sspid,
        dayNum,
        prizeId,
        mark: true,
        isVirtual: req.body?.isVirtual === true,
      })
      invalidateGlobalTelecomOverview(id)
      await setAccountQqtToken({ id, qqtAccessToken: result.accessToken })
      await logEvent({ action: 'global_telecom.reward.accept', requestId, accountId: id, message: result.message, meta: { dayNum, prizeId } })
      res.json({ ok: true, data: { result: result.payload }, message: result.message, requestId })
    } catch (error) {
      globalTelecomFailure(res, error, requestId)
    }
  },
)

router.post(
  '/:id/global-telecom/blind-box',
  async (req: Request, res: Response<ApiResp<unknown>>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id || '').trim()
    const action = String(req.body?.action || '').trim() as 'draw' | 'receive' | 'complete-task' | 'complete-all'
    const confirmations = { draw: '确认抽奖', receive: '确认领取', 'complete-task': '确认完成任务', 'complete-all': '确认完成全部任务' } as const
    const prizeCode = String(req.body?.prizeCode || '').trim()
    const taskNumber = Number(req.body?.taskNumber)
    if (!Object.prototype.hasOwnProperty.call(confirmations, action) ||
        String(req.body?.confirmationText || '').trim() !== confirmations[action] ||
        (action === 'receive' && !prizeCode) ||
        (action === 'complete-task' && (!Number.isInteger(taskNumber) || taskNumber <= 0))) {
      res.status(400).json({ ok: false, message: '盲盒操作参数或确认信息不完整', errorCode: 'INVALID_BLIND_BOX_REQUEST', requestId })
      return
    }
    try {
      await withKeyLock(`account:${id}`, async () => {
        const context = await resolveGlobalTelecomAccount({ req, res, requestId, accountId: id })
        if (!context) return
        const result = await globalTelecomBlindBoxAction({
          cmccCookie: context.cookie,
          requestHeaders: context.rec.requestHeaders,
          accessToken: context.cookie ? undefined : context.rec.qqtAccessToken,
          sspid: context.sspid,
          action,
          prizeCode,
          taskNumber,
        })
        invalidateGlobalTelecomOverview(id)
        await setAccountQqtToken({ id, qqtAccessToken: result.accessToken })
        await logEvent({ action: `global_telecom.blind_box.${action}`, requestId, accountId: id, message: result.message })
        res.json({ ok: true, data: { result: result.payload, blindBoxPrize: result.blindBoxPrize }, message: result.message, requestId })
      })
    } catch (error) {
      invalidateGlobalTelecomOverview(id)
      globalTelecomFailure(res, error, requestId)
    }
  },
)

router.post(
  '/qqt/tokens/export',
  async (req: Request, res: Response<QqtTokenExportResp>) => {
    const requestId = crypto.randomUUID()
    try {
      if (!isAdminRequest(req) && !isLocalRequest(req)) {
        res.status(403).json({
          ok: false,
          message: 'Forbidden',
          errorCode: 'FORBIDDEN',
          requestId,
        })
        return
      }

      const refresh = req.query?.refresh === '1' || req.body?.refresh === true
      const strict = req.query?.strict === '1' || req.body?.strict !== false
      const concurrencyRaw = Number(req.query?.concurrency ?? req.body?.concurrency ?? 4)
      const concurrency = Number.isFinite(concurrencyRaw)
        ? Math.max(1, Math.min(10, Math.floor(concurrencyRaw)))
        : 4
      const updatedWithinRaw = Number(
        req.query?.updatedWithinMinutes ??
          req.query?.updated_within_minutes ??
          req.body?.updatedWithinMinutes ??
          req.body?.updated_within_minutes ??
          DEFAULT_QQT_TOKEN_EXPORT_UPDATED_WITHIN_MINUTES,
      )
      const validForRaw = Number(
        req.query?.validForMinutes ??
          req.query?.valid_for_minutes ??
          req.body?.validForMinutes ??
          req.body?.valid_for_minutes ??
          DEFAULT_QQT_TOKEN_EXPORT_VALID_FOR_MINUTES,
      )
      const minValidUntilRaw = String(req.query?.minValidUntil ?? req.body?.minValidUntil ?? '').trim()
      const updatedWithinMinutes = Number.isFinite(updatedWithinRaw)
        ? Math.max(1, Math.min(24 * 60, Math.floor(updatedWithinRaw)))
        : DEFAULT_QQT_TOKEN_EXPORT_UPDATED_WITHIN_MINUTES
      const validForMinutes = Number.isFinite(validForRaw)
        ? Math.max(1, Math.min(24 * 60, Math.floor(validForRaw)))
        : DEFAULT_QQT_TOKEN_EXPORT_VALID_FOR_MINUTES
      const minValidUntil =
        minValidUntilRaw && !Number.isNaN(Date.parse(minValidUntilRaw))
          ? new Date(minValidUntilRaw)
          : undefined
      const reuseTokenAfterMs = Date.now() - updatedWithinMinutes * 60_000
      const accounts = await listAccounts()
      const candidates = accounts.filter((rec) =>
        !rec.disabledAt && Boolean(rec.cookie || rec.yunpanSession || (!strict && rec.qqtAccessToken)),
      )

      await runPool(candidates, concurrency, async (rec) => {
        try {
          const cachedToken = rec.qqtAccessToken
          const cachedTokenCheckedAt = rec.qqtAccessTokenCheckedAt

          let token = cachedToken
          let tokenCheckedAt = cachedTokenCheckedAt
          const cachedTokenCheckedAtMs = Date.parse(cachedTokenCheckedAt || '')
          const hasReusableToken =
            Boolean(String(cachedToken || '').trim()) &&
            Number.isFinite(cachedTokenCheckedAtMs) &&
            cachedTokenCheckedAtMs >= reuseTokenAfterMs

          if (refresh && !hasReusableToken && rec.yunpanSession) {
            const latest = await ensureYunpanGlobalToken(rec, true)
            token = latest.qqtAccessToken
            tokenCheckedAt = latest.qqtAccessTokenCheckedAt
          }
          if (refresh && !hasReusableToken && rec.cookie && !rec.yunpanSession) {
            const refreshed = await ensureFreshCookie({
              id: rec.id,
              cookie: rec.cookie || '',
              requestHeaders: rec.requestHeaders,
              newHomeUrl: rec.newHomeUrl,
            })
            if (refreshed.ok && refreshed.cookie) {
              const latest = (await getAccountById(rec.id)) ?? rec
              const tokenResult = await qqtReplaceToken({
                cmccCookie: refreshed.cookie,
                requestHeaders: latest.requestHeaders,
              })
              if (tokenResult.ok && tokenResult.accessToken) {
                await setAccountQqtToken({ id: rec.id, qqtAccessToken: tokenResult.accessToken })
                await touchAccountQqtTokenCheckedAt({ id: rec.id })
                token = tokenResult.accessToken
                tokenCheckedAt = new Date().toISOString()

                if (tokenResult.userInfo && typeof tokenResult.userInfo === 'object') {
                  await setAccountQqtInfo({
                    id: rec.id,
                    qqtInfo: tokenResult.userInfo as Record<string, unknown>,
                  })
                }
                const signSspid =
                  typeof req.body?.sspid === 'string' && req.body.sspid.trim()
                    ? req.body.sspid.trim()
                    : String(process.env.DEFAULT_QQT_SSPID || process.env.QQT_SSPID || '75442').trim()
                const [xdr, sign] = await Promise.all([
                  qqtQueryXdrReceive({
                    cmccCookie: refreshed.cookie,
                    accessToken: tokenResult.accessToken,
                    requestHeaders: latest.requestHeaders,
                  }).catch(() => null),
                  signSspid
                    ? qqtSignInfo({
                        cmccCookie: refreshed.cookie,
                        sspid: signSspid,
                        accessToken: tokenResult.accessToken,
                        requestHeaders: latest.requestHeaders,
                      }).catch(() => null)
                    : Promise.resolve(null),
                ])
                if (xdr?.ok && xdr.receive && typeof xdr.receive === 'object') {
                  await setAccountXdrReceive({
                    id: rec.id,
                    receive: xdr.receive as Record<string, unknown>,
                  })
                }
                if (sign?.ok && sign.info && typeof sign.info === 'object') {
                  await setAccountQqtSignState({
                    id: rec.id,
                    signInfo: sign.info as Record<string, unknown>,
                  })
                }
              }
            }
          }

          void tokenCheckedAt

          if (!token) {
            return { ok: false as const }
          }

          return { ok: true as const }
        } catch {
          return { ok: false as const }
        }
      })

      const refreshedAccounts = await listAccounts()
      const exportResult = buildQqtTokenExport(refreshedAccounts, {
        now: new Date(),
        updatedWithinMinutes,
        validForMinutes,
        minValidUntil,
        excludeNonQqt: true,
        excludeXdrReceived: true,
        excludeMonthlyReceived: true,
        requireQqtInfo: strict,
        requireXdrInfo: strict,
        requireMonthlyInfo: strict,
      })

      res.json({
        ok: true,
        data: {
          exportedAt: exportResult.exportedAt,
          total: exportResult.total,
          skipped: exportResult.skipped,
          skipReasons: exportResult.skipReasons,
          tokens: exportResult.tokens,
        },
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res.status(500).json({
        ok: false,
        message: msg,
        errorCode: 'SERVER_ERROR',
        requestId,
      })
    }
  },
)

router.post(
  '/wed-recharge/cookies/export',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: {
        exportedAt: string
        total: number
        skipped: number
        skipReasons: Record<string, number>
        accounts: Array<{
          accountId: string
          phone: string
          phoneMasked: string
          displayPhone: string
          cookie: string
          wedRechargeInfo?: Record<string, unknown>
          wedRechargeUpdatedAt?: string
        }>
      }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    try {
      if (!isAdminRequest(req) && !isLocalRequest(req)) {
        res.status(403).json({
          ok: false,
          message: 'Forbidden',
          errorCode: 'FORBIDDEN',
          requestId,
        })
        return
      }

      const refresh = req.query?.refresh === '1' || req.body?.refresh !== false
      const queryInfo = req.query?.queryInfo === '1' || req.body?.queryInfo === true
      const concurrencyRaw = Number(req.query?.concurrency ?? req.body?.concurrency ?? 2)
      const concurrency = Number.isFinite(concurrencyRaw)
        ? Math.max(1, Math.min(3, Math.floor(concurrencyRaw)))
        : 2
      const accounts = (await listAccounts()).filter((rec) => !rec.disabledAt && Boolean(rec.cookie))
      const skipReasons: Record<string, number> = {}
      const addSkip = (reason: string) => {
        skipReasons[reason] = (skipReasons[reason] ?? 0) + 1
      }
      const exported: Array<{
        accountId: string
        phone: string
        phoneMasked: string
        displayPhone: string
        cookie: string
        wedRechargeInfo?: Record<string, unknown>
        wedRechargeUpdatedAt?: string
      }> = []

      await runPool(accounts, concurrency, async (rec) => {
        try {
          if (!rec.cookie) {
            addSkip('NO_COOKIE')
            return
          }
          const session = await prepareWedRechargeSession({
            cookie: rec.cookie,
            forceRefresh: refresh,
          })
          const cookie = session.cookie
          if (!cookie.includes('HLWHD_SESSION_TOKEN=')) {
            addSkip('NO_HLWHD_SESSION_TOKEN')
            return
          }
            if (session.updated && cookie !== rec.cookie) {
              await setAccountWedRechargeCookie({ id: rec.id, cookie })
            }

          let info = rec.wedRechargeInfo as Record<string, unknown> | undefined
          let infoUpdatedAt = rec.wedRechargeUpdatedAt
          if (queryInfo) {
            try {
              const queried = await wedRechargeQueryPictureInfo({ cookie })
              const saved = await setAccountWedRechargeInfo({
                id: rec.id,
                info: queried as unknown as Record<string, unknown>,
              })
              info = queried as unknown as Record<string, unknown>
              infoUpdatedAt = saved.wedRechargeUpdatedAt
            } catch {
              addSkip('QUERY_INFO_FAILED')
            }
          }

          exported.push({
            accountId: rec.id,
            phone: rec.phone || '',
            phoneMasked: maskPhone(rec.phone),
            displayPhone: rec.displayPhone || maskPhone(rec.phone) || rec.label || rec.id,
            cookie,
            wedRechargeInfo: info,
            wedRechargeUpdatedAt: infoUpdatedAt,
          })
        } catch (e) {
          const msg = e instanceof Error ? e.message : ''
          addSkip(msg.includes('需要登录') ? 'LOGIN_REQUIRED' : 'PREPARE_FAILED')
        }
      })

      exported.sort((a, b) => a.displayPhone.localeCompare(b.displayPhone, 'zh-Hans-CN'))
      const skipped = accounts.length - exported.length
      res.json({
        ok: true,
        data: {
          exportedAt: new Date().toISOString(),
          total: exported.length,
          skipped,
          skipReasons,
          accounts: exported,
        },
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res.status(500).json({
        ok: false,
        message: msg,
        errorCode: 'SERVER_ERROR',
        requestId,
      })
    }
  },
)

router.post(
  '/notify/summary',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      requestId?: string
      message?: string
      errorCode?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    try {
      if (!isAdminRequest(req) && !isLocalRequest(req)) {
        res.status(403).json({
          ok: false,
          message: 'Forbidden',
          errorCode: 'FORBIDDEN',
          requestId,
        })
        return
      }
      const action = String(req.body?.action || '状态汇总').trim() || '状态汇总'
      const lines = Array.isArray(req.body?.lines)
        ? req.body.lines.map((item: unknown) => String(item || '').trim()).filter(Boolean)
        : []
      if (lines.length === 0) {
        res.status(400).json({
          ok: false,
          message: '内容为空',
          errorCode: 'EMPTY_CONTENT',
          requestId,
        })
        return
      }
      await pushPlusSend({
        title: `中国移动用户管理${action}`,
        content: [`### 中国移动用户管理${action}`, ...lines].join('\n'),
      })
      res.json({ ok: true, requestId })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res.status(500).json({
        ok: false,
        message: msg,
        errorCode: 'SERVER_ERROR',
        requestId,
      })
    }
  },
)

router.post(
  '/notify/rush-result',
  async (
    req: Request,
    res: Response<{ ok: boolean; requestId?: string; message?: string; errorCode?: string }>,
  ) => {
    const requestId = crypto.randomUUID()
    try {
      if (!isAdminRequest(req) && !isLocalRequest(req)) {
        res.status(403).json({ ok: false, message: 'Forbidden', errorCode: 'FORBIDDEN', requestId })
        return
      }
      const successAccounts = Array.isArray(req.body?.successAccounts)
        ? req.body.successAccounts.map((item: unknown) => String(item || '').trim()).filter(Boolean)
        : []
      const jobId = String(req.body?.jobId || '').trim() || 'unknown'
      const total = Number(req.body?.total ?? 0) || 0
      const success = Number(req.body?.success ?? successAccounts.length) || 0
      const successRate = Number(req.body?.successRate ?? 0) || 0
      const successTimeStart = String(req.body?.successTimeStart || '').trim()
      const successTimeEnd = String(req.body?.successTimeEnd || '').trim()

      if (successAccounts.length === 0) {
        res.json({ ok: true, requestId })
        return
      }

      const links = await listPublicLinks()
      const configs = await listPublicLinkPushConfigs()
      const accountMap = new Map<string, { id: string; label: string }>()
      for (const link of links) {
        for (const accountId of link.accountIds) {
          if (accountMap.has(accountId)) continue
          const rec = await getAccountById(accountId)
          if (!rec) continue
          const masked = maskPhone(rec.phone)
          const display = formatAccountDisplay(rec)
          accountMap.set(accountId, { id: accountId, label: display })
          if (rec.phone) accountMap.set(`full:${rec.phone}`, { id: accountId, label: display })
          if (masked) accountMap.set(`mask:${masked}`, { id: accountId, label: display })
          if (display) accountMap.set(`display:${display}`, { id: accountId, label: display })
        }
      }

      const matchedAccountIds = new Set<string>()
      for (const item of successAccounts) {
        const normalized = normalizePhoneCandidate(item)
        if (normalized && accountMap.has(`full:${normalized}`)) {
          matchedAccountIds.add(accountMap.get(`full:${normalized}`)!.id)
          continue
        }
        const masked = buildMaskedPhoneCandidate(item)
        if (masked && accountMap.has(`mask:${masked}`)) {
          matchedAccountIds.add(accountMap.get(`mask:${masked}`)!.id)
          continue
        }
        if (accountMap.has(`display:${item}`)) {
          matchedAccountIds.add(accountMap.get(`display:${item}`)!.id)
        }
      }

      for (const link of links) {
        const config = configs[link.id]
        if (!config?.pushplusEnabled || !config.pushplusToken || !config.notifyRushResult) continue
        const linkMatched = link.accountIds.filter((accountId) => matchedAccountIds.has(accountId))
        if (linkMatched.length === 0) continue
        const labels = linkMatched
          .map((accountId) => accountMap.get(accountId)?.label || accountId)
          .filter(Boolean)
        await pushPlusSend({
          token: config.pushplusToken,
          title: `全球通权益抢购结果: ${labels.length} 个账号成功`,
          content: [
            `### 全球通权益抢购结果`,
            `- 邀请码: ${link.id}`,
            `- 任务ID: ${jobId}`,
            `- 总账号: ${total}`,
            `- 成功账号: ${success}`,
            `- 成功率: ${successRate}%`,
            `- 当前链接成功账号: ${labels.join('、')}`,
            successTimeStart && successTimeEnd
              ? `- 成功时间范围: ${successTimeStart} ~ ${successTimeEnd}`
              : `- 成功时间范围: 无`,
          ].join('\n'),
        })
      }
      res.json({ ok: true, requestId })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/public/link/new',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: { links: { linkId: string; url: string }[] }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    try {
      if (!isAdminRequest(req)) {
        res.status(403).json({
          ok: false,
          message: 'Forbidden',
          errorCode: 'FORBIDDEN',
          requestId,
        })
        return
      }
      const rawCount = Number(req.body?.count ?? 1)
      const count = Number.isFinite(rawCount)
        ? Math.max(1, Math.min(50, Math.floor(rawCount)))
        : 1
      const links: { linkId: string; url: string }[] = []
      for (let i = 0; i < count; i += 1) {
        const rec = await createPublicLink()
        const url = buildPublicLinkUrl(rec.id)
        links.push({ linkId: rec.id, url })
      }
      await logEvent({
        action: 'public_link.create',
        requestId,
        message: `create ${count} link(s)`,
        meta: { count, linkIds: links.map((x) => x.linkId) },
      })
      res.json({ ok: true, data: { links }, requestId })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.get(
  '/public/links',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: { links: {
        linkId: string
        createdAt: string
        updatedAt: string
        accountCount: number
        url: string
        ipUrl: string
        pushplusEnabled: boolean
        pushplusBound: boolean
        notifyLogin: boolean
        notifyCookieInvalid: boolean
        notifyRushResult: boolean
        pushplusSubscribeUrl?: string
        pushplusQrImageUrl?: string
        pushplusQrNote?: string
        redirectEnabled: boolean
        redirectUrl?: string
        redirectNote?: string
      }[] }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    try {
      if (!isAdminRequest(req)) {
        res.status(403).json({
          ok: false,
          message: 'Forbidden',
          errorCode: 'FORBIDDEN',
          requestId,
        })
        return
      }
      const links = await listPublicLinks()
      const configs = await listPublicLinkPushConfigs()
      res.json({
        ok: true,
        data: {
          links: links.map((item) => {
            const config = configs[item.id]
            return {
              pushplusEnabled: Boolean(config?.pushplusEnabled),
              pushplusBound: Boolean(config?.pushplusToken),
              notifyLogin: config?.notifyLogin ?? true,
              notifyCookieInvalid: config?.notifyCookieInvalid ?? true,
              notifyRushResult: config?.notifyRushResult ?? true,
              pushplusSubscribeUrl: config?.pushplusSubscribeUrl,
              pushplusQrImageUrl: config?.pushplusQrImageUrl,
              pushplusQrNote: config?.pushplusQrNote,
              redirectEnabled: config?.redirectEnabled ?? false,
              redirectUrl: config?.redirectUrl,
              redirectNote: config?.redirectNote,
            linkId: item.id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            accountCount: item.accountIds.length,
            url: buildDisplayedPublicLinkUrl(
              item.id,
              Boolean(config?.redirectEnabled),
              config?.redirectUrl,
            ),
            ipUrl: buildPublicLinkIpUrl(req, item.id),
            }
          }),
        },
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/public/link/:linkId/push-config',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: {
        linkId: string
        url: string
        ipUrl: string
        pushplusEnabled: boolean
        pushplusBound: boolean
        notifyLogin: boolean
        notifyCookieInvalid: boolean
        notifyRushResult: boolean
        pushplusSubscribeUrl?: string
        pushplusQrImageUrl?: string
        pushplusQrNote?: string
        redirectEnabled: boolean
        redirectUrl?: string
        redirectNote?: string
      }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    const linkId = String(req.params.linkId || '').trim()
    try {
      if (!isAdminRequest(req)) {
        res.status(403).json({ ok: false, message: 'Forbidden', errorCode: 'FORBIDDEN', requestId })
        return
      }
      const link = await getPublicLink(linkId)
      if (!link) {
        res.status(404).json({ ok: false, message: '链接不存在', errorCode: 'NOT_FOUND', requestId })
        return
      }
      const config = await setPublicLinkPushConfig({
        linkId,
        pushplusToken:
          typeof req.body?.pushplusToken === 'string' && req.body.pushplusToken.trim()
            ? req.body.pushplusToken.trim()
            : undefined,
        pushplusEnabled:
          typeof req.body?.pushplusEnabled === 'boolean' ? req.body.pushplusEnabled : undefined,
        notifyLogin:
          typeof req.body?.notifyLogin === 'boolean' ? req.body.notifyLogin : undefined,
        notifyCookieInvalid:
          typeof req.body?.notifyCookieInvalid === 'boolean' ? req.body.notifyCookieInvalid : undefined,
        notifyRushResult:
          typeof req.body?.notifyRushResult === 'boolean' ? req.body.notifyRushResult : undefined,
        pushplusSubscribeUrl:
          typeof req.body?.pushplusSubscribeUrl === 'string'
            ? req.body.pushplusSubscribeUrl.trim()
            : undefined,
        pushplusQrImageUrl:
          typeof req.body?.pushplusQrImageUrl === 'string'
            ? req.body.pushplusQrImageUrl.trim()
            : undefined,
        pushplusQrNote:
          typeof req.body?.pushplusQrNote === 'string'
            ? req.body.pushplusQrNote.trim()
            : undefined,
        redirectEnabled:
          typeof req.body?.redirectEnabled === 'boolean' ? req.body.redirectEnabled : undefined,
        redirectUrl:
          typeof req.body?.redirectUrl === 'string' ? req.body.redirectUrl.trim() : undefined,
        redirectNote:
          typeof req.body?.redirectNote === 'string' ? req.body.redirectNote.trim() : undefined,
      })
      res.json({
        ok: true,
        data: {
          linkId,
          url: buildDisplayedPublicLinkUrl(
            linkId,
            config.redirectEnabled,
            config.redirectUrl,
          ),
          ipUrl: buildPublicLinkIpUrl(req, linkId),
          pushplusEnabled: config.pushplusEnabled,
          pushplusBound: Boolean(config.pushplusToken),
          notifyLogin: config.notifyLogin,
          notifyCookieInvalid: config.notifyCookieInvalid,
          notifyRushResult: config.notifyRushResult,
          pushplusSubscribeUrl: config.pushplusSubscribeUrl,
          pushplusQrImageUrl: config.pushplusQrImageUrl,
          pushplusQrNote: config.pushplusQrNote,
          redirectEnabled: config.redirectEnabled,
          redirectUrl: config.redirectUrl,
          redirectNote: config.redirectNote,
        },
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.get(
  '/public/link/:linkId/push-config',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: {
        linkId: string
        url: string
        ipUrl: string
        pushplusEnabled: boolean
        subscribeUrl?: string
        qrImageUrl?: string
        qrNote?: string
        redirectEnabled: boolean
        redirectUrl?: string
        redirectNote?: string
      }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    const linkId = String(req.params.linkId || '').trim()
    try {
      const link = await getPublicLink(linkId)
      if (!link) {
        res.status(404).json({
          ok: false,
          message: '链接不存在',
          errorCode: 'NOT_FOUND',
          requestId,
        })
        return
      }
      const config = await getPublicLinkPushConfig(linkId)
      res.json({
        ok: true,
        data: {
          linkId,
          url: buildDisplayedPublicLinkUrl(
            linkId,
            config.redirectEnabled,
            config.redirectUrl,
          ),
          ipUrl: buildPublicLinkIpUrl(req, linkId),
          pushplusEnabled: Boolean(config.pushplusEnabled),
          subscribeUrl: config.pushplusSubscribeUrl,
          qrImageUrl: config.pushplusQrImageUrl,
          qrNote: config.pushplusQrNote,
          redirectEnabled: config.redirectEnabled,
          redirectUrl: config.redirectUrl,
          redirectNote: config.redirectNote,
        },
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/public/link/:linkId/account',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: { linkId: string; accountId: string }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    const linkId = String(req.params.linkId || '').trim()
    const accountId = String(req.body?.accountId || '').trim()
    if (!linkId || !accountId) {
      res.status(400).json({
        ok: false,
        message: '参数不完整',
        errorCode: 'INVALID_ARGS',
        requestId,
      })
      return
    }
    try {
      if (!isAdminRequest(req)) {
        res.status(403).json({
          ok: false,
          message: 'Forbidden',
          errorCode: 'FORBIDDEN',
          requestId,
        })
        return
      }
      const link = await getPublicLink(linkId)
      if (!link) {
        res.status(404).json({
          ok: false,
          message: '链接不存在',
          errorCode: 'NOT_FOUND',
          requestId,
        })
        return
      }
      await addLinkAccount({ linkId, accountId })
      await logEvent({
        action: 'public_link.assign_account',
        requestId,
        accountId,
        linkId,
      })
      res.json({ ok: true, data: { linkId, accountId }, requestId })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.delete(
  '/public/link/:linkId',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: { linkId: string }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    const linkId = String(req.params.linkId || '').trim()
    if (!linkId) {
      res.status(400).json({
        ok: false,
        message: 'linkId 不能为空',
        errorCode: 'INVALID_ARGS',
        requestId,
      })
      return
    }
    try {
      if (!isAdminRequest(req)) {
        res.status(403).json({
          ok: false,
          message: 'Forbidden',
          errorCode: 'FORBIDDEN',
          requestId,
        })
        return
      }
      const link = await getPublicLink(linkId)
      if (!link) {
        res.status(404).json({
          ok: false,
          message: '链接不存在',
          errorCode: 'NOT_FOUND',
          requestId,
        })
        return
      }
      await deletePublicLink(linkId)
      await logEvent({
        action: 'public_link.delete',
        requestId,
        linkId,
      })
      res.json({ ok: true, data: { linkId }, requestId })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/public/links/delete',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: { deleted: string[] }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    try {
      if (!isAdminRequest(req)) {
        res.status(403).json({
          ok: false,
          message: 'Forbidden',
          errorCode: 'FORBIDDEN',
          requestId,
        })
        return
      }
      const linkIds: string[] = Array.isArray(req.body?.linkIds)
        ? req.body.linkIds.map((item) => String(item || '').trim()).filter(Boolean)
        : []
      if (linkIds.length === 0) {
        res.status(400).json({
          ok: false,
          message: '请选择要失效处理的链接',
          errorCode: 'INVALID_ARGS',
          requestId,
        })
        return
      }
      const deleted: string[] = []
      for (const linkId of Array.from(new Set(linkIds))) {
        const link = await getPublicLink(linkId)
        if (!link) continue
        await deletePublicLink(linkId)
        deleted.push(linkId)
      }
      await logEvent({
        action: 'public_link.delete.batch',
        requestId,
        message: `disable ${deleted.length} link(s)`,
        meta: { linkIds: deleted },
      })
      res.json({ ok: true, data: { deleted }, requestId })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/public/links/export',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: {
        text: string
        items: { linkId: string; accountCount: number }[]
      }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    try {
      if (!isAdminRequest(req)) {
        res.status(403).json({
          ok: false,
          message: 'Forbidden',
          errorCode: 'FORBIDDEN',
          requestId,
        })
        return
      }
      const linkIds: string[] = Array.isArray(req.body?.linkIds)
        ? req.body.linkIds.map((item) => String(item || '').trim()).filter(Boolean)
        : []
      if (linkIds.length === 0) {
        res.status(400).json({
          ok: false,
          message: '请选择要导出的链接',
          errorCode: 'INVALID_ARGS',
          requestId,
        })
        return
      }
      const items: { linkId: string; accountCount: number }[] = []
      const texts: string[] = []
      for (const linkId of Array.from(new Set(linkIds))) {
        const exported = await buildPublicLinkExport({ linkId }).catch(() => undefined)
        if (!exported) continue
        items.push({
          linkId: exported.linkId,
          accountCount: exported.accountCount,
        })
        texts.push(exported.text)
      }
      res.json({
        ok: true,
        data: {
          text: texts.join('\n\n########################################\n\n'),
          items,
        },
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.get(
  '/public/link/:linkId/accounts',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: { accounts: AccountSummary[] }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    const linkId = String(req.params.linkId || '').trim()
    if (!linkId) {
      res.status(400).json({
        ok: false,
        message: 'linkId 不能为空',
        errorCode: 'INVALID_ARGS',
        requestId,
      })
      return
    }
    try {
      const link = await getPublicLink(linkId)
      if (!link) {
        res.status(404).json({
          ok: false,
          message: '链接不存在',
          errorCode: 'NOT_FOUND',
          requestId,
        })
        return
      }
      const summaries: AccountSummary[] = []
      const remaining: string[] = []
      for (const accountId of link.accountIds) {
        const rec = await getAccountById(accountId)
        if (!rec) continue
        if (rec.disabledAt) continue
        remaining.push(accountId)
        summaries.push(toAccountSummary(rec))
      }
      if (remaining.length !== link.accountIds.length) {
        await removeMissingAccounts({ linkId, remainingIds: remaining })
      }
      summaries.sort((left, right) => {
        const pinOrder = Number(Boolean(right.publicPinnedAt)) - Number(Boolean(left.publicPinnedAt))
        if (pinOrder !== 0) return pinOrder
        const sortOrder = (left.publicSortOrder ?? 0) - (right.publicSortOrder ?? 0)
        if (sortOrder !== 0) return sortOrder
        return Date.parse(right.updatedAt) - Date.parse(left.updatedAt)
      })
      res.json({ ok: true, data: { accounts: summaries }, requestId })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/batch/disable',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: { disabled: string[] }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    try {
      if (!isAdminRequest(req)) {
        res.status(403).json({
          ok: false,
          message: 'Forbidden',
          errorCode: 'FORBIDDEN',
          requestId,
        })
        return
      }
      const accountIds: string[] = Array.isArray(req.body?.accountIds)
        ? req.body.accountIds.map((item) => String(item || '').trim()).filter(Boolean)
        : []
      if (accountIds.length === 0) {
        res.status(400).json({
          ok: false,
          message: '请选择要失效处理的账号',
          errorCode: 'INVALID_ARGS',
          requestId,
        })
        return
      }
      const reason =
        String(req.body?.reason || '').trim() || '账号批量失效处理'
      const disabled: string[] = []
      for (const accountId of Array.from(new Set(accountIds))) {
        await softDisableAccount({ id: accountId, reason }).then(
          () => disabled.push(accountId),
          () => undefined,
        )
      }
      await logEvent({
        action: 'account.disable.batch',
        requestId,
        message: `disable ${disabled.length} account(s)`,
        meta: { accountIds: disabled },
      })
      res.json({ ok: true, data: { disabled }, requestId })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/batch/delete',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: { deleted: string[] }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    try {
      if (!isAdminRequest(req)) {
        res.status(403).json({
          ok: false,
          message: 'Forbidden',
          errorCode: 'FORBIDDEN',
          requestId,
        })
        return
      }
      const accountIds: string[] = Array.isArray(req.body?.accountIds)
        ? req.body.accountIds.map((item) => String(item || '').trim()).filter(Boolean)
        : []
      const uniqueIds = Array.from(new Set(accountIds))
      if (uniqueIds.length === 0) {
        res.status(400).json({
          ok: false,
          message: '请选择要删除的账号',
          errorCode: 'INVALID_ARGS',
          requestId,
        })
        return
      }
      const deleted: string[] = []
      for (const accountId of uniqueIds) {
        await deleteAccount(accountId).then(
          () => deleted.push(accountId),
          () => undefined,
        )
      }
      await logEvent({
        action: 'account.delete.batch',
        requestId,
        message: `delete ${deleted.length} account(s)`,
        meta: { accountIds: deleted },
      })
      res.json({ ok: true, data: { deleted }, requestId })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.get(
  '/:id/summary',
  async (
    req: Request,
    res: Response<{ ok: boolean; data?: { account: AccountSummary }; message?: string; errorCode?: string; requestId?: string }>,
  ) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      const rec = await getAccountById(id)
      if (!rec) {
        res.status(404).json({
          ok: false,
          message: '账号不存在',
          errorCode: 'NOT_FOUND',
          requestId,
        })
        return
      }
      res.json({ ok: true, data: { account: toAccountSummary(rec) }, requestId })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post('/', async (req: Request, res: Response<AccountUpsertResp>) => {
  const requestId = crypto.randomUUID()
  const phone = String(req.body?.phone ?? '').trim()
  const label = String(req.body?.label ?? '').trim() || undefined
  const allowEmpty = Boolean(req.body?.allowEmpty)

  try {
    const publicAccess = await ensurePublicLinkAccess({
      req,
      res,
      requestId,
    })
    if (!publicAccess.ok) return
    const record = await upsertAccount({ phone, label, allowEmpty })
    const currentUser = await findCurrentUser(req).catch(() => null)
    if (currentUser) {
      await bindAccountsToUser({ userId: currentUser.id, accountIds: [record.id] })
    }
    if (publicAccess.linkId) {
      await addLinkAccount({ linkId: publicAccess.linkId, accountId: record.id })
    }
    res.json({
      ok: true,
      data: { account: toAccountSummary(record) },
      requestId,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    const status = msg === 'INVALID_PHONE' ? 400 : 500
    res.status(status).json({
      ok: false,
      message: pickMessageForErrorCode(msg),
      errorCode: msg,
      requestId,
    })
  }
})

router.post(
  '/yunpan/sms/send',
  async (req: Request, res: Response<SendSmsResp>) => {
    const requestId = crypto.randomUUID()
    const phone = normalizePhoneCandidate(String(req.body?.phone ?? ''))
    if (!phone) {
      res.status(400).json({
        ok: false,
        message: '手机号格式不正确',
        errorCode: 'INVALID_PHONE',
        requestId,
      })
      return
    }
    try {
      const publicAccess = await ensurePublicLinkAccess({ req, res, requestId })
      if (!publicAccess.ok) return
      if (denyServiceLogin({ req, res, requestId })) return
      const r = await yunpanSendSmsCode({
        phone,
        nationCode: typeof req.body?.nationCode === 'string' ? req.body.nationCode : undefined,
        puzzleVerifyCode:
          typeof req.body?.puzzleVerifyCode === 'string' ? req.body.puzzleVerifyCode : undefined,
      })
      if (!r.ok) {
        res.status(200).json({
          ok: false,
          message: r.message || '云盘验证码发送失败',
          errorCode: String(r.status ?? 'UPSTREAM_ERROR'),
          phase: 'yunpan_sms_send',
          debug: {
            upstreamStatus: r.status,
            upstreamMessage: r.message,
            upstreamResponse: r.upstreamResponse,
            rawTextSnippet: r.rawTextSnippet,
          },
          requestId,
        })
        return
      }
      res.json({
        ok: true,
        data: { cooldownSeconds: r.cooldownSeconds || 60 },
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res.status(500).json({
        ok: false,
        message: msg === 'UPSTREAM_TIMEOUT' ? '上游超时，请重试' : msg,
        errorCode: msg === 'UPSTREAM_TIMEOUT' ? 'UPSTREAM_TIMEOUT' : 'SERVER_ERROR',
        requestId,
      })
    }
  },
)

router.post(
  '/yunpan/login',
  async (
    req: Request,
    res: Response<
        ApiResp<{
          account: AccountSummary
          cookie?: string
          cookieLength: number
          cookieNames: string[]
          ssoUrl: string
          ssoToken: string
          yunpanLoginOnly?: boolean
          warning?: string
        }>
    >,
  ) => {
    const requestId = crypto.randomUUID()
    const phone = normalizePhoneCandidate(String(req.body?.phone ?? ''))
    const code = String(req.body?.code ?? req.body?.smsCode ?? '').trim()
    const label = String(req.body?.label ?? '').trim() || undefined
    if (!phone) {
      res.status(400).json({
        ok: false,
        message: '手机号格式不正确',
        errorCode: 'INVALID_PHONE',
        requestId,
      })
      return
    }
    if (!isSixDigitCode(code)) {
      res.status(400).json({
        ok: false,
        message: '请输入 6 位数字验证码',
        errorCode: 'INVALID_CODE',
        requestId,
      })
      return
    }
    try {
      await logLoginStep({
        requestId,
        phase: 'request',
        status: 'start',
        phone,
        linkId: typeof req.body?.publicLinkId === 'string' ? req.body.publicLinkId : undefined,
        meta: { hasPublicLinkId: typeof req.body?.publicLinkId === 'string' },
      })
      const publicAccess = await ensurePublicLinkAccess({ req, res, requestId })
      if (!publicAccess.ok) {
        await logLoginStep({
          requestId,
          phase: 'public_access',
          status: 'failure',
          phone,
          message: 'public link access denied',
        })
        return
      }
      if (denyServiceLogin({ req, res, requestId })) return
      await logLoginStep({
        requestId,
        phase: 'yunpan_sms_login',
        status: 'start',
        phone,
        linkId: publicAccess.linkId,
      })
        const login = await withStepTimeout(yunpanLoginWithSmsOnly({
          phone,
          smsCode: code,
          nationCode: typeof req.body?.nationCode === 'string' ? req.body.nationCode : undefined,
        }), 13000, 'YUNPAN_SMS_LOGIN')
        if (!login.ok || !login.session) {
          await logLoginStep({
            requestId,
            phase: 'yunpan_sms_login',
            status: 'failure',
            phone,
            linkId: publicAccess.linkId,
            message: login.message || '云盘登录失败',
            meta: debugFromResult(login),
          })
          res.status(200).json({
            ok: false,
            message: login.message || '云盘登录失败',
            errorCode: String(login.status ?? 'UPSTREAM_ERROR'),
            phase: 'yunpan_sms_login',
            debug: debugFromResult(login),
            requestId,
          })
          return
        }
        await logLoginStep({
          requestId,
          phase: 'yunpan_sms_login',
          status: 'success',
          phone,
          linkId: publicAccess.linkId,
          meta: { upstreamStatus: login.status },
        })
        const record = await upsertAccount({ phone, label })
      const currentUser = await findCurrentUser(req).catch(() => null)
      if (currentUser) {
        await bindAccountsToUser({ userId: currentUser.id, accountIds: [record.id] })
      }
        if (publicAccess.linkId) {
          await addLinkAccount({ linkId: publicAccess.linkId, accountId: record.id })
        }
        await setAccountYunpanSession({ id: record.id, session: login.session, recordLogin: true })
        await logLoginStep({
          requestId,
          phase: 'account_saved',
          status: 'success',
          phone,
          accountId: record.id,
          linkId: publicAccess.linkId,
          meta: { boundToCurrentUser: Boolean(currentUser) },
        })
        let warning = ''
        let cmccRecovered = false
        try {
          const globalAccount = await ensureYunpanGlobalToken(
            (await getAccountById(record.id)) || { ...record, yunpanSession: login.session }, true)
          const recovered = await recover10086CookieByYunpan({ rec: globalAccount, clearOnYunpanFailure: false })
          if (!recovered.ok) {
            warning = recovered.message || '云盘和全球通登录成功，10086 置换失败，可稍后重试'
            await logLoginStep({ requestId, phase: 'collect_cmcc_cookie', status: 'warning', phone, accountId: record.id, message: warning })
          } else {
            cmccRecovered = true
            await logLoginStep({ requestId, phase: 'collect_cmcc_cookie', status: 'success', phone, accountId: record.id })
          }
        } catch (error) {
          warning = error instanceof Error ? error.message : '云盘登录成功，全球通置换失败，可稍后重试'
          await logLoginStep({ requestId, phase: 'collect_global_token', status: 'warning',
            phone, accountId: record.id, message: warning })
        }
        const saved = await getAccountById(record.id)
      if (publicAccess.linkId) {
        await notifyLoginByLink({
          linkId: publicAccess.linkId,
          accountId: record.id,
          display: formatAccountDisplay(saved ?? record),
        })
      }
      res.json({
        ok: true,
        data: {
            account: toAccountSummary(saved ?? record),
            cookie: cmccRecovered ? saved?.cookie : undefined,
            cookieLength: cmccRecovered ? saved?.cookie?.length || 0 : 0,
            cookieNames: cmccRecovered && saved?.cookie ? Array.from(parseCookieHeader(saved.cookie).keys()) : [],
            ssoUrl: '',
            ssoToken: '',
            yunpanLoginOnly: !cmccRecovered,
            warning: warning || undefined,
          },
          message: warning || undefined,
          requestId,
        })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      const phase = msg.endsWith('_TIMEOUT') ? msg.replace(/_TIMEOUT$/, '').toLowerCase() : 'server'
      await logLoginStep({
        requestId,
        phase,
        status: 'failure',
        phone,
        message: msg,
        meta: { errorName: e instanceof Error ? e.name : undefined },
      })
      res.status(500).json({
        ok: false,
        message: messageForYunpanLoginError(msg),
        errorCode: msg.endsWith('_TIMEOUT') || msg === 'UPSTREAM_TIMEOUT' ? 'UPSTREAM_TIMEOUT' : 'SERVER_ERROR',
        phase,
        debug: { errorMessage: msg },
        requestId,
      })
    }
  },
)

router.post('/:id/yunpan/business-link', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  const id = String(req.params.id)
  const target = req.body?.target
  if (target !== 'cloudphone' && target !== 'capp') {
    res.status(400).json({ ok: false, message: '请选择云手机或云应用', errorCode: 'INVALID_TARGET', requestId })
    return
  }
  try {
    const access = await ensurePublicLinkAccess({ req, res, requestId, accountId: id })
    if (!access.ok) return
    const rec = await getAccountById(id)
    if (!rec || (!rec.yunpanSession && !rec.qqtAccessToken) || rec.disabledAt) {
      res.status(410).json({ ok: false, message: '请先完成云盘或全球通登录并启用账号', errorCode: 'SSO_SESSION_REQUIRED', requestId })
      return
    }
    const data = await withKeyLock(`yunpan-link:${id}`, () => buildAccountCloudLink(rec, target))
    res.setHeader('Cache-Control', 'no-store')
    await logEvent({ action: 'yunpan.sso_link.generate', requestId, accountId: id, message: target })
    res.json({ ok: true, data, requestId })
  } catch (error) {
    const message = error instanceof Error ? error.message : '生成跳转链接失败'
    await logEvent({ level: 'warn', action: 'yunpan.sso_link.generate', requestId, accountId: id, message })
    // Credential/business failures are not gateway errors. Keep their JSON
    // message visible instead of triggering a proxy/CDN's generic 502 page.
    const expired = error instanceof YunpanAuthenticationExpired
    const emptyTicket = error instanceof QqtTicketEmpty
    res.status(expired ? 409 : emptyTicket ? 424 : 502).json({ ok: false, message,
      errorCode: expired ? 'YUNPAN_SESSION_EXPIRED' : emptyTicket ? 'SSO_TICKET_EMPTY' : 'YUNPAN_SSO_FAILED', requestId })
  }
})

router.post(
  ['/:id/qqt/10086', '/:id/yunpan/refresh'],
  async (
    req: Request,
    res: Response<
      ApiResp<{
        cookie: string
        cookieUpdated: boolean
        cookieLength: number
        cookieNames: string[]
        ssoUrl: string
        ssoToken: string
      }>
    >,
  ) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      const rec = await getAccountById(id)
      if (!rec) {
        res.status(404).json({
          ok: false,
          message: '账号不存在',
          errorCode: 'NOT_FOUND',
          requestId,
        })
        return
      }
      if (!rec.yunpanSession && !rec.qqtAccessToken) {
        res.status(409).json({
          ok: false,
          message: '请先完成云盘或全球通登录',
          errorCode: 'NO_YUNPAN_SESSION',
          requestId,
        })
        return
      }
      const r = req.body?.force === true
        ? await recover10086CookieByYunpan({ rec, clearOnYunpanFailure: false })
        : await ensureUsable10086Cookie({ rec, allowRecentSkip: true, windowMin: 5, clearOnYunpanFailure: false })
      if (!r.ok || !r.cookie) {
        res.status(502).json({
          ok: false,
          message: r.message || '全球通置换 10086 CK 失败',
          errorCode: 'QQT_CMCC_EXCHANGE_FAILED',
          requestId,
        })
        return
      }
      res.setHeader('Cache-Control', 'no-store')
      await logEvent({ action: 'qqt.cmcc_cookie.exchange', requestId, accountId: id, message: '10086 身份及核心查询验证通过' })
      res.json({
        ok: true,
        data: {
          cookie: r.cookie,
          cookieUpdated: Boolean(r.cookieUpdated),
          cookieLength: r.cookie.length,
          cookieNames: Array.from(parseCookieHeader(r.cookie).keys()),
          ssoUrl: '',
          ssoToken: '',
        },
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res.status(500).json({
        ok: false,
        message: msg === 'UPSTREAM_TIMEOUT' ? '上游超时，请重试' : msg,
        errorCode: msg === 'UPSTREAM_TIMEOUT' ? 'UPSTREAM_TIMEOUT' : 'SERVER_ERROR',
        requestId,
      })
    }
  },
)

router.post(
  ['/:id/qqt/10086-link', '/:id/yunpan/sso-link'],
  async (
    req: Request,
    res: Response<
      ApiResp<{
        ssoUrl: string
        ssoToken: string
        account: AccountSummary
      }>
    >,
  ) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    if (!isLocalRequest(req)) {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) {
        return
      }
    }
    if (!isAdminRequest(req) && !isLocalRequest(req)) {
      const currentUser = await findCurrentUser(req).catch(() => null)
      if (currentUser) {
        const owned = await getAccountById(id)
        if (!owned || owned.userId !== currentUser.id) {
          res.status(403).json({
            ok: false,
            message: '该账号不属于当前用户',
            errorCode: 'USER_ACCOUNT_FORBIDDEN',
            requestId,
          })
          return
        }
      }
    }
    try {
      const rec = await getAccountById(id)
      if (!rec) {
        res.status(404).json({
          ok: false,
          message: '账号不存在',
          errorCode: 'NOT_FOUND',
          requestId,
        })
        return
      }
      if (!rec.yunpanSession && !rec.qqtAccessToken) {
        res.status(409).json({
          ok: false,
          message: '请先完成云盘或全球通登录',
          errorCode: 'NO_YUNPAN_SESSION',
          requestId,
        })
        return
      }
      const ticket = await issueAccountQqtTicket(rec, '017018')
      const saved = await getAccountById(id)
      res.setHeader('Cache-Control', 'no-store')
      res.json({
        ok: true,
        data: {
          ssoUrl: buildQqt10086Url(ticket),
          ssoToken: ticket,
          account: toAccountSummary(saved ?? rec),
        },
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res.status(500).json({
        ok: false,
        message: msg === 'UPSTREAM_TIMEOUT' ? '上游超时，请重试' : msg,
        errorCode: msg === 'UPSTREAM_TIMEOUT' ? 'UPSTREAM_TIMEOUT' : 'SERVER_ERROR',
        requestId,
      })
    }
  },
)

router.post('/:id/aigou/sso-link', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  const id = String(req.params.id)
  try {
    if (!isLocalRequest(req)) {
      const access = await ensurePublicLinkAccess({ req, res, requestId, accountId: id })
      if (!access.ok) return
    }
    const rec = await getAccountById(id)
    if (!rec) {
      res.status(404).json({ ok: false, message: '账号不存在', errorCode: 'NOT_FOUND', requestId })
      return
    }
    const usable = await ensureUsable10086Cookie({
      rec,
      allowRecentSkip: true,
      clearOnYunpanFailure: false,
      preferYunpan: false,
    })
    if (!usable.ok || !usable.cookie) {
      res.status(410).json({
        ok: false,
        message: usable.message || '账号暂无可用的 10086 CK',
        errorCode: 'COOKIE_INVALID',
        requestId,
      })
      return
    }
    const result = await buildAigouSsoLinkFrom10086Cookie(usable.cookie)
    if (!result.ok || !result.ssoUrl) {
      // Cloudflare 会将本站 502 替换为 HTML；业务依赖失败使用 424 保留具体 JSON 错误。
      res.status(result.errorCode === 'COOKIE_INVALID' ? 410 : 424).json({
        ok: false,
        message: result.message || '生成爱购商城跳转链接失败',
        errorCode: result.errorCode || 'AIGOU_SSO_FAILED',
        requestId,
      })
      return
    }
    if (result.cookieUpdated && result.cookie) {
      await setAccountCookie({ id, cookie: result.cookie })
    }
    const saved = await getAccountById(id)
    res.json({
      ok: true,
      data: {
        ssoUrl: result.ssoUrl,
        account: toAccountSummary(saved ?? rec),
      },
      requestId,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : '生成爱购商城跳转链接失败'
    res.status(message === 'UPSTREAM_TIMEOUT' ? 504 : 500).json({
      ok: false,
      message: message === 'UPSTREAM_TIMEOUT' ? '爱购商城上游超时，请重试' : message,
      errorCode: message === 'UPSTREAM_TIMEOUT' ? 'UPSTREAM_TIMEOUT' : 'SERVER_ERROR',
      requestId,
    })
  }
})

router.post('/:id/aigou/session/prepare', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  const id = String(req.params.id)
  try {
    if (!isLocalRequest(req)) {
      const access = await ensurePublicLinkAccess({ req, res, requestId, accountId: id })
      if (!access.ok) return
    }
    const rec = await getAccountById(id)
    if (!rec) {
      res.status(404).json({ ok: false, message: '账号不存在', errorCode: 'NOT_FOUND', requestId })
      return
    }
    if (rec.aigouSession) {
      const cached = await validateAigouSession(rec.aigouSession)
      if (cached.ok) {
        if (cached.cookie && cached.cookie !== rec.aigouSession.cookie) {
          await setAccountAigouSession({
            id,
            session: { ...rec.aigouSession, cookie: cached.cookie },
          })
        }
        res.json({
          ok: true,
          data: {
            reused: true,
            hasCookie: true,
            hasToken: true,
            hasRefreshToken: true,
            account: toAccountSummary((await getAccountById(id)) ?? rec),
          },
          requestId,
        })
        return
      }
    }
    const usable = await ensureUsable10086Cookie({
      rec,
      allowRecentSkip: false,
      clearOnYunpanFailure: false,
      preferYunpan: Boolean(rec.yunpanSession),
    })
    if (!usable.ok || !usable.cookie) {
      res.status(410).json({
        ok: false,
        message: usable.message || '账号暂无可用于置换的 10086 CK',
        errorCode: 'COOKIE_INVALID',
        requestId,
      })
      return
    }
    const exchanged = await exchange10086CookieToAigou(usable.cookie)
    if (!exchanged.ok || !exchanged.session) {
      res.status(exchanged.errorCode === 'COOKIE_INVALID' ? 410 : 424).json({
        ok: false,
        message: exchanged.message || '10086 CK 置换爱购商城凭证失败',
        errorCode: exchanged.errorCode || 'AIGOU_EXCHANGE_FAILED',
        requestId,
      })
      return
    }
    if (exchanged.baseCookieUpdated && exchanged.baseCookie) {
      await setAccountCookie({ id, cookie: exchanged.baseCookie })
    }
    await setAccountAigouSession({ id, session: exchanged.session })
    const saved = await getAccountById(id)
    res.json({
      ok: true,
      data: {
        reused: false,
        hasCookie: true,
        hasToken: true,
        hasRefreshToken: true,
        steps: exchanged.steps,
        account: toAccountSummary(saved ?? rec),
      },
      requestId,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : '置换爱购商城凭证失败'
    res.status(message === 'UPSTREAM_TIMEOUT' ? 504 : 500).json({
      ok: false,
      message: message === 'UPSTREAM_TIMEOUT' ? '爱购商城上游超时，请重试' : message,
      errorCode: message === 'UPSTREAM_TIMEOUT' ? 'UPSTREAM_TIMEOUT' : 'SERVER_ERROR',
      requestId,
    })
  }
})

router.post('/:id/coc-package/:target/sso-link', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  const id = String(req.params.id)
  const targetText = String(req.params.target || '')
  try {
    if (!isCocPackageTarget(targetText)) {
      res.status(400).json({ ok: false, message: '不支持的 COC 套餐目标', errorCode: 'INVALID_TARGET', requestId })
      return
    }
    if (!isLocalRequest(req)) {
      const access = await ensurePublicLinkAccess({ req, res, requestId, accountId: id })
      if (!access.ok) return
    }
    const rec = await getAccountById(id)
    if (!rec) {
      res.status(404).json({ ok: false, message: '账号不存在', errorCode: 'NOT_FOUND', requestId })
      return
    }
    const usable = await ensureUsable10086Cookie({
      rec,
      allowRecentSkip: true,
      clearOnYunpanFailure: false,
      preferYunpan: false,
    })
    if (!usable.ok || !usable.cookie) {
      res.status(410).json({
        ok: false,
        message: usable.message || '账号暂无可用的 10086 CK',
        errorCode: 'COOKIE_INVALID',
        requestId,
      })
      return
    }
    const result = await buildCocPackageSsoLinkFrom10086Cookie(usable.cookie, targetText)
    if (!result.ok || !result.ssoUrl) {
      res.status(result.errorCode === 'COOKIE_INVALID' ? 410 : 424).json({
        ok: false,
        message: result.message || `生成${COC_PACKAGE_TARGETS[targetText].name}跳转链接失败`,
        errorCode: result.errorCode || 'COC_PACKAGE_SSO_FAILED',
        requestId,
      })
      return
    }
    if (result.cookieUpdated && result.cookie) {
      await setAccountCookie({ id, cookie: result.cookie })
    }
    res.json({
      ok: true,
      data: {
        target: targetText,
        destination: COC_PACKAGE_TARGETS[targetText].name,
        ssoUrl: result.ssoUrl,
        account: toAccountSummary((await getAccountById(id)) ?? rec),
      },
      requestId,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : '生成 COC 套餐跳转链接失败'
    res.status(message === 'UPSTREAM_TIMEOUT' ? 504 : 500).json({
      ok: false,
      message: message === 'UPSTREAM_TIMEOUT' ? 'COC 上游超时，请重试' : message,
      errorCode: message === 'UPSTREAM_TIMEOUT' ? 'UPSTREAM_TIMEOUT' : 'SERVER_ERROR',
      requestId,
    })
  }
})

router.post('/:id/coc-package/:target/session/prepare', async (req: Request, res: Response<ApiResp<unknown>>) => {
  const requestId = crypto.randomUUID()
  const id = String(req.params.id)
  const targetText = String(req.params.target || '')
  try {
    if (!isCocPackageTarget(targetText)) {
      res.status(400).json({ ok: false, message: '不支持的 COC 套餐目标', errorCode: 'INVALID_TARGET', requestId })
      return
    }
    if (!isLocalRequest(req)) {
      const access = await ensurePublicLinkAccess({ req, res, requestId, accountId: id })
      if (!access.ok) return
    }
    const rec = await getAccountById(id)
    if (!rec) {
      res.status(404).json({ ok: false, message: '账号不存在', errorCode: 'NOT_FOUND', requestId })
      return
    }
    const prepared = await prepareAccountCocPackageSession(rec, targetText)
    if (!prepared.ok || !prepared.session) {
      const status = prepared.status === 410 ? 410 : 424
      res.status(status).json({
        ok: false,
        message: prepared.message || `${COC_PACKAGE_TARGETS[targetText].name}凭证置换失败`,
        errorCode: status === 410 ? 'COOKIE_INVALID' : 'COC_PACKAGE_EXCHANGE_FAILED',
        requestId,
      })
      return
    }
    res.json({
      ok: true,
      data: {
        target: targetText,
        reused: prepared.reused,
        hasCookie: true,
        hasToken: true,
        account: toAccountSummary(prepared.account ?? rec),
      },
      requestId,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : '置换 COC 套餐凭证失败'
    res.status(message === 'UPSTREAM_TIMEOUT' ? 504 : 500).json({
      ok: false,
      message: message === 'UPSTREAM_TIMEOUT' ? 'COC 上游超时，请重试' : message,
      errorCode: message === 'UPSTREAM_TIMEOUT' ? 'UPSTREAM_TIMEOUT' : 'SERVER_ERROR',
      requestId,
    })
  }
})

router.post(
  '/qr-login/start',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: {
        flowId: string
        expiresInSeconds: number
        qrImage: string
        cookieNames: string[]
        backUrl: string
      }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    try {
      const publicAccess = await ensurePublicLinkAccess({ req, res, requestId })
      if (!publicAccess.ok) return
      const channelId = typeof req.body?.channelId === 'string' ? req.body.channelId : undefined
      const backUrl = typeof req.body?.backUrl === 'string' ? req.body.backUrl : undefined
      const data = await createCmccQrLoginFlow({ channelId, backUrl })
      res.json({ ok: true, data, requestId })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/qr-login/poll',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: Awaited<ReturnType<typeof pollCmccQrLoginFlow>>
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    const flowId = String(req.body?.flowId || '').trim()
    if (!flowId) {
      res.status(400).json({ ok: false, message: '缺少扫码会话 ID', errorCode: 'INVALID_FLOW', requestId })
      return
    }
    try {
      const publicAccess = await ensurePublicLinkAccess({ req, res, requestId })
      if (!publicAccess.ok) return
      const data = await pollCmccQrLoginFlow(flowId)
      res.json({ ok: true, data, requestId })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/qr-login/save',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: {
        account: AccountSummary
        cookie: string
        cookieNames: string[]
        cookieLength: number
      }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    const flowId = String(req.body?.flowId || '').trim()
    const phone = typeof req.body?.phone === 'string' ? normalizePhoneCandidate(req.body.phone) || '' : ''
    const label = String(req.body?.label || '').trim() || undefined
    if (!flowId) {
      res.status(400).json({ ok: false, message: '缺少扫码会话 ID', errorCode: 'INVALID_FLOW', requestId })
      return
    }
    if (!phone) {
      res.status(400).json({
        ok: false,
        message: '扫码登录必须填写 11 位手机号',
        errorCode: 'INVALID_PHONE',
        requestId,
      })
      return
    }
    try {
      const publicAccess = await ensurePublicLinkAccess({ req, res, requestId })
      if (!publicAccess.ok) return
      const qrCookie = consumeCmccQrLoginCookie(flowId)
      const record = await upsertAccount({ phone, label })
      const currentUser = await findCurrentUser(req).catch(() => null)
      if (currentUser) {
        await bindAccountsToUser({ userId: currentUser.id, accountIds: [record.id] })
      }
      if (publicAccess.linkId) {
        await addLinkAccount({ linkId: publicAccess.linkId, accountId: record.id })
      }
      const saved = await setAccountCookie({
        id: record.id,
        cookie: qrCookie.cookie,
        loginMethod: 'cmcc_qr',
        cookieSource: 'qr',
        ttlHours: 1,
      })
      if (publicAccess.linkId) {
        await notifyLoginByLink({
          linkId: publicAccess.linkId,
          accountId: record.id,
          display: formatAccountDisplay(saved),
        })
      }
      res.json({
        ok: true,
        data: {
          account: toAccountSummary(saved),
          cookie: qrCookie.cookie,
          cookieNames: qrCookie.cookieNames,
          cookieLength: qrCookie.cookieLength,
        },
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      const status = msg === 'INVALID_PHONE' ? 400 : msg.includes('扫码') ? 400 : 500
      res.status(status).json({
        ok: false,
        message: msg === 'INVALID_PHONE' ? '手机号格式不正确' : msg,
        errorCode: msg === 'INVALID_PHONE' ? 'INVALID_PHONE' : 'SERVER_ERROR',
        requestId,
      })
    }
  },
)

router.post(
  '/tokens/import',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: { imported: number }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    const raw = req.body?.tokens
    const tokensText = Array.isArray(raw)
      ? raw.join('\n')
      : typeof raw === 'string'
        ? raw
        : ''
    const lines = tokensText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
    if (lines.length === 0) {
      res.status(400).json({
        ok: false,
        message: 'Token 为空',
        errorCode: 'EMPTY_TOKENS',
        requestId,
      })
      return
    }

    const tokens = lines
      .map((line) => {
        const cleaned = line.replace(/^access_token\s*=\s*/i, '').trim()
        return cleaned
      })
      .filter(Boolean)

    const unique = Array.from(new Set(tokens))
    let imported = 0
    for (const token of unique) {
      const hash = crypto.createHash('sha256').update(token).digest('hex')
      const digits = hash.replace(/[a-f]/g, (ch) =>
        String(parseInt(ch, 16) % 10),
      )
      const phone = `1${digits.slice(0, 10)}`.padEnd(11, '0')
      const label = `token-${token.slice(0, 6)}`
      try {
        const rec = await upsertAccount({ phone, label })
        await setAccountQqtToken({ id: rec.id, qqtAccessToken: token })
        imported += 1
      } catch {
        // ignore single token failure
      }
    }

    res.json({ ok: true, data: { imported }, requestId })
  },
)

router.post('/har/parse', async (req: Request, res: Response<HarParseResp>) => {
  const requestId = crypto.randomUUID()
  const harText = typeof req.body?.harText === 'string' ? req.body.harText : ''
  try {
    const publicAccess = await ensurePublicLinkAccess({
      req,
      res,
      requestId,
    })
    if (!publicAccess.ok) return
    if (!harText.trim()) {
      res.status(400).json({
        ok: false,
        message: 'HAR 内容为空',
        errorCode: 'EMPTY_HAR',
        requestId,
      })
      return
    }
    const parsed = parseHarForCmccNewHome({ harText })
    res.json({ ok: true, data: parsed, requestId })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'INVALID_HAR'
    const errorMap: Record<string, string> = {
      INVALID_HAR: 'HAR 格式不正确',
      NO_MATCH: '未找到 newHome 请求',
      NO_URL: 'HAR 中未找到 newHome URL',
      NO_HEADERS: 'HAR 中未包含请求头',
      NO_COOKIE: 'HAR 中未找到 Cookie',
      EMPTY_HAR: 'HAR 内容为空',
    }
    const message = errorMap[msg] ?? 'HAR 解析失败'
    res.status(400).json({ ok: false, message, errorCode: msg, requestId })
  }
})

router.post(
  '/cleanup/invalid',
  async (req: Request, res: Response<AccountsCleanupResp>) => {
    const requestId = crypto.randomUUID()
    try {
      if (!isAdminRequest(req)) {
        res.status(403).json({
          ok: false,
          message: 'Forbidden',
          errorCode: 'FORBIDDEN',
          requestId,
        })
        return
      }
      const accounts = await listAccounts()
      const targets = accounts.filter((a) => a.cookie)
      const raw = Number(process.env.WORKER_CONCURRENCY ?? 4)
      const concurrency = Number.isFinite(raw)
        ? Math.max(1, Math.min(20, Math.floor(raw)))
        : 4

      const results = await runPool(targets, concurrency, async (rec) => {
        return await withKeyLock(`account:${rec.id}`, async () => {
          const r = await cmccActivateFareBalance(
            rec.cookie || '',
            rec.requestHeaders,
            rec.newHomeUrl,
          )
          if (!r.ok || !r.cookie) {
            await clearAccountCookie({
              id: rec.id,
              reason: r.message || 'Cookie 已失效',
            })
            await notifyCookieInvalid({
              rec,
              reason: r.message || 'Cookie 已失效',
              source: 'cleanup.invalid',
            })
            return { id: rec.id, ok: false, cookieUpdated: false }
          }
          if (r.cookieUpdated) {
            await setAccountCookie({ id: rec.id, cookie: r.cookie })
          }
          return { id: rec.id, ok: true, cookieUpdated: Boolean(r.cookieUpdated) }
        })
      })

      const deletedIds = results.filter((r) => !r.ok).map((r) => r.id)
      const deleted = deletedIds.length
      const kept = results.length - deleted
      const refreshed = results.filter((r) => r.ok && r.cookieUpdated).length
      if (deleted > 0 || refreshed > 0) {
        await pushPlusSend({
          title: '中国移动账号批量校验结果',
          content: [
            `### 中国移动账号批量校验结果`,
            `- 总数: ${results.length}`,
            `- 失效: ${deleted}`,
            `- 保留: ${kept}`,
            `- 刷新成功: ${refreshed}`,
            `- 时间: ${new Date().toLocaleString('zh-CN', { hour12: false })}`,
            deletedIds.length
              ? `- 失效账号ID: ${deletedIds.join(', ')}`
              : `- 失效账号ID: 无`,
          ].join('\n'),
        })
      }
      res.json({
        ok: true,
        data: { deleted, kept, refreshed, deletedIds },
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/cleanup/duplicates',
  async (
    req: Request,
    res: Response<
      {
        ok: boolean
        message?: string
        errorCode?: string
        requestId?: string
        data?: {
          groups: number
          deleted: number
          deletedIds: string[]
        }
      }
    >,
  ) => {
    const requestId = crypto.randomUUID()
    try {
      if (!isAdminRequest(req)) {
        res.status(403).json({
          ok: false,
          message: 'Forbidden',
          errorCode: 'FORBIDDEN',
          requestId,
        })
        return
      }
      const accounts = await listAccounts()
      const grouped = new Map<string, typeof accounts>()
      for (const rec of accounts) {
        const key = dedupeKeyForAccount(rec)
        if (!key) continue
        const list = grouped.get(key) ?? []
        list.push(rec)
        grouped.set(key, list)
      }

      let groups = 0
      const deletedIds: string[] = []
      for (const list of grouped.values()) {
        if (list.length <= 1) continue
        groups += 1
        const sorted = [...list].sort(
          (a, b) => scoreAccountForDedup(b) - scoreAccountForDedup(a),
        )
        const keeper = sorted[0]
        for (const rec of sorted.slice(1)) {
          if (rec.id === keeper.id) continue
          await deleteAccount(rec.id)
          deletedIds.push(rec.id)
        }
      }

      res.json({
        ok: true,
        data: {
          groups,
          deleted: deletedIds.length,
          deletedIds,
        },
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res.status(500).json({
        ok: false,
        message: msg,
        errorCode: 'SERVER_ERROR',
        requestId,
      })
    }
  },
)

router.delete(
  '/:id',
  async (
    req: Request,
    res: Response<{ ok: boolean; message?: string; errorCode?: string; requestId?: string }>,
  ) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      if (!isAdminRequest(req)) {
        const currentUser = await findCurrentUser(req).catch(() => null)
        if (currentUser) {
          const rec = await getAccountById(id)
          if (!rec || rec.disabledAt) {
            res.status(404).json({
              ok: false,
              message: '账号已失效',
              errorCode: 'ACCOUNT_DISABLED',
              requestId,
            })
            return
          }
          if (rec.userId !== currentUser.id) {
            res.status(403).json({
              ok: false,
              message: '该账号不属于当前用户',
              errorCode: 'USER_ACCOUNT_FORBIDDEN',
              requestId,
            })
            return
          }
        }
      }
      await deleteAccount(id)
      await logEvent({
        action: 'account.delete',
        requestId,
        accountId: id,
        linkId: publicAccess.linkId,
        message: `delete account ${id}`,
      })
      res.json({ ok: true, requestId })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.get(
  '/:id/cookie',
  async (req: Request, res: Response<AccountCookieResp>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    try {
      if (!isAdminRequest(req)) {
        res.status(403).json({
          ok: false,
          message: 'Forbidden',
          errorCode: 'FORBIDDEN',
          requestId,
        })
        return
      }
      const cookie = await getAccountCookie(id)
      if (!cookie) {
        res.status(404).json({
          ok: false,
          message: '暂无 Cookie',
          errorCode: 'NO_COOKIE',
          requestId,
        })
        return
      }
      res.json({ ok: true, data: { cookie }, requestId })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/:id/cookie',
  async (req: Request, res: Response<AccountCookieSetResp>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    const cookie = normalizeCookieInput(String(req.body?.cookie ?? ''))
    if (!cookie) {
      res.status(400).json({
        ok: false,
        message: 'Cookie 不能为空',
        errorCode: 'INVALID_COOKIE',
        requestId,
      })
      return
    }

    let requestHeaders: Record<string, string> | undefined = undefined
    try {
      requestHeaders = normalizeRequestHeaders(
        req.body?.headers ?? req.body?.requestHeaders ?? undefined,
      )
    } catch {
      res.status(400).json({
        ok: false,
        message: '请求头格式不正确',
        errorCode: 'INVALID_HEADERS',
        requestId,
      })
      return
    }

    const newHomeUrlRaw =
      typeof req.body?.newHomeUrl === 'string' ? req.body.newHomeUrl.trim() : ''
    const newHomeUrl = newHomeUrlRaw.length > 0 ? newHomeUrlRaw : undefined

    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      await setAccountCookie({
        id,
        cookie,
        requestHeaders,
        newHomeUrl,
        loginMethod: 'manual_cookie',
        cookieSource: 'manual',
      })
      await setAccountSmsLoginWindow({ id, ttlHours: 72 })
      if (publicAccess.linkId) {
        const rec = await getAccountById(id)
        await notifyLoginByLink({
          linkId: publicAccess.linkId,
          accountId: id,
          display: formatAccountDisplay(rec ?? undefined),
        })
      }
      res.json({ ok: true, data: { cookie }, requestId })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      const status = msg === 'NOT_FOUND' ? 404 : 500
      res.status(status).json({
        ok: false,
        message: msg === 'NOT_FOUND' ? '账号不存在' : msg,
        errorCode: msg === 'NOT_FOUND' ? 'NOT_FOUND' : 'SERVER_ERROR',
        requestId,
      })
    }
  },
)

router.post(
  '/:id/activate',
  async (req: Request, res: Response<AccountActivateResp>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      await withKeyLock(`account:${id}`, async () => {
        const rec = await getAccountById(id)
        if (!rec) {
          res.status(404).json({
            ok: false,
            message: '账号不存在',
            errorCode: 'NOT_FOUND',
            requestId,
          })
          return
        }
        const suppressInvalidPush = req.body?.suppressInvalidPush === true
        let cookie = rec.cookie || ''
        let activeRec = rec
        if (!cookie) {
          const recovered = await recover10086CookieByYunpan({
            rec,
            reason: '暂无 10086 Cookie',
          })
          if (!recovered.ok || !recovered.cookie) {
            if (!suppressInvalidPush && rec.yunpanSession) {
              await notifyCookieInvalid({
                rec,
                reason: recovered.message || '云盘会话已失效',
                source: 'activate',
              })
            }
            res.status(rec.yunpanSession || rec.qqtAccessToken ? 502 : 404).json({
              ok: false,
              message: recovered.message || '暂无可用 10086 Cookie',
              errorCode: rec.yunpanSession || rec.qqtAccessToken ? 'SSO_EXCHANGE_FAILED' : 'NO_COOKIE',
              requestId,
            })
            return
          }
          cookie = recovered.cookie
          activeRec = (await getAccountById(id)) ?? rec
        }

        let r = await cmccActivateFareBalance(
          cookie,
          activeRec.requestHeaders,
          activeRec.newHomeUrl,
        )
        if (!r.ok || !r.encrypted || typeof r.decrypted !== 'string') {
          if (
            shouldPersistInvalidFromActivateFailure({
              status: r.status,
              message: r.message,
            })
          ) {
            const recovered = await recover10086CookieByYunpan({
              rec: activeRec,
              reason: r.message || 'Cookie 已失效',
            })
            if (recovered.ok && recovered.cookie) {
              cookie = recovered.cookie
              activeRec = (await getAccountById(id)) ?? activeRec
              r = await cmccActivateFareBalance(
                cookie,
                activeRec.requestHeaders,
                activeRec.newHomeUrl,
              )
              if (r.ok && r.encrypted && typeof r.decrypted === 'string') {
                // continue with the successfully recovered activation below
              } else if (!suppressInvalidPush) {
                await notifyCookieInvalid({
                  rec,
                  reason: r.message || recovered.message || '云盘会话已失效',
                  source: 'activate',
                })
              }
            } else if (!suppressInvalidPush) {
              await notifyCookieInvalid({
                rec,
                reason: recovered.message || r.message || 'Cookie 已失效',
                source: 'activate',
              })
            }
          }
          if (!r.ok || !r.encrypted || typeof r.decrypted !== 'string') {
            if (!suppressInvalidPush) {
              // notifyCookieInvalid may already have been sent above; duplicate sends are
              // avoided by suppressInvalidPush on callers that batch-refresh lists.
            }
            res.status(502).json({
              ok: false,
              message: activeRec.yunpanSession
                ? r.message || '云盘会话已失效，请重新登录'
                : r.message || '激活失败',
              errorCode: String(r.status ?? 'UPSTREAM_ERROR'),
              requestId,
            })
            return
          }
        }

        if (r.cookie && r.cookieUpdated) {
          await setAccountCookie({ id, cookie: r.cookie })
          cookie = r.cookie
        }

        let phoneUpdated = false
        const phone = extractPhoneFromDecrypted(r.decrypted)
        if (phone) {
          try {
            await setAccountPhone({ id, phone })
            phoneUpdated = true
          } catch {
            // ignore phone update failure
          }
        }

        const activationInfo = parseActivationPayload(r.decrypted)
        if (activationInfo) {
          await setAccountActivationInfo({ id, activationInfo })
          if (computeActivationCookieValidity(activationInfo) === false) {
            const recovered = await recover10086CookieByYunpan({
              rec: (await getAccountById(id)) ?? activeRec,
              reason: '激活返回结果显示 Cookie 已失效',
            })
            let recoveredAndActivated = false
            if (recovered.ok && recovered.cookie) {
              const retryRec = (await getAccountById(id)) ?? activeRec
              const retry = await cmccActivateFareBalance(
                recovered.cookie,
                retryRec.requestHeaders,
                retryRec.newHomeUrl,
              )
              if (retry.ok && retry.encrypted && typeof retry.decrypted === 'string') {
                r = retry
                const retryActivationInfo = parseActivationPayload(retry.decrypted)
                if (retryActivationInfo) {
                  await setAccountActivationInfo({ id, activationInfo: retryActivationInfo })
                }
                recoveredAndActivated =
                  computeActivationCookieValidity(retryActivationInfo) !== false
              } else if (!suppressInvalidPush) {
                await notifyCookieInvalid({
                  rec,
                  reason: retry.message || '云盘会话已失效',
                  source: 'activate',
                })
              }
            } else if (!suppressInvalidPush) {
              await notifyCookieInvalid({
                rec,
                reason: recovered.message || '激活返回结果显示 Cookie 已失效',
                source: 'activate',
              })
            }
            if (!recoveredAndActivated) {
              res.status(410).json({
                ok: false,
                message: recovered.ok
                  ? '云盘已换取 10086 CK，但激活仍显示 CK 失效'
                  : recovered.message || '激活返回结果显示 Cookie 已失效',
                errorCode: 'COOKIE_INVALID_CLEARED',
                requestId,
              })
              return
            }
          }
        }

        res.json({
          ok: true,
          data: {
            encrypted: r.encrypted,
            decrypted: r.decrypted,
            cookieUpdated: Boolean(r.cookieUpdated),
            phoneUpdated,
          },
          requestId,
        })
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/:id/refresh',
  async (req: Request, res: Response<AccountRefreshResp>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      await withKeyLock(`account:${id}`, async () => {
        const rec = await getAccountById(id)
        if (!rec) {
          res.status(404).json({
            ok: false,
            message: '账号不存在',
            errorCode: 'NOT_FOUND',
            requestId,
          })
          return
        }

        const windowMin = getValidityWindowMin()
        const force = req.query?.force === '1' || req.body?.force === true
        const suppressInvalidPush = req.body?.suppressInvalidPush === true
        let cookie = rec.cookie || ''
        let cookieUpdated = false

        if (!cookie) {
          const recovered = await recover10086CookieByYunpan({
            rec,
            reason: '暂无 10086 Cookie',
          })
          if (!recovered.ok || !recovered.cookie) {
            const display = formatAccountDisplay(rec)
            const hasYunpanSession = Boolean(rec.yunpanSession)
            if (!suppressInvalidPush && hasYunpanSession) {
              await notifyCookieInvalid({
                rec,
                reason: recovered.message || '云盘会话已失效',
                source: 'refresh',
              })
            }
            res.status(rec.yunpanSession || rec.qqtAccessToken ? 502 : 404).json({
              ok: false,
              message: recovered.message || '暂无可用 10086 Cookie',
              errorCode: rec.yunpanSession || rec.qqtAccessToken ? 'SSO_EXCHANGE_FAILED' : 'NO_COOKIE',
              requestId,
            })
            return
          }
          cookie = recovered.cookie
          cookieUpdated = true
        }

        if (!force && !rec.cookieInvalidAt && (!rec.cookieExpireAt || Date.parse(rec.cookieExpireAt) > Date.now()) && isWithinWindow(rec.cookieCheckedAt, windowMin)) {
          cookieUpdated = false
        } else {
          const usable = await ensureUsable10086Cookie({
            rec: { ...rec, cookie },
            allowRecentSkip: false,
            clearOnYunpanFailure: true,
          })
          if (!usable.ok || !usable.cookie) {
            if (!suppressInvalidPush) {
              await notifyCookieInvalid({
                rec,
                reason: usable.message || 'Cookie 已失效',
                source: 'refresh',
              })
            }
            const display = formatAccountDisplay(rec)
            res.status(410).json({
              ok: false,
              message: usable.message || `${display} 10086 Cookie 校验失败`,
              errorCode: 'COOKIE_VALIDATION_FAILED',
              requestId,
            })
            return
          }
          cookie = usable.cookie
          cookieUpdated = Boolean(usable.cookieUpdated || usable.recoveredByYunpan)
        }

        const tokenResult = await qqtReplaceToken({
          cmccCookie: cookie,
          requestHeaders: rec.requestHeaders,
        })
        if (!tokenResult.ok || !tokenResult.accessToken) {
          res.status(502).json({
            ok: false,
            message: tokenResult.message || '刷新 CK 成功，但 Token 刷新失败',
            errorCode: 'TOKEN_REFRESH_FAILED',
            requestId,
          })
          return
        }
        const tokenUpdated = tokenResult.accessToken !== rec.qqtAccessToken
        await setAccountQqtToken({ id: rec.id, qqtAccessToken: tokenResult.accessToken })
        await touchAccountQqtTokenCheckedAt({ id: rec.id })
        const userInfo = tokenResult.userInfo
        const userInfoRecord =
          userInfo && typeof userInfo === 'object'
            ? (userInfo as Record<string, unknown>)
            : undefined
        const userInfoData =
          userInfoRecord && typeof userInfoRecord.data === 'object'
            ? (userInfoRecord.data as Record<string, unknown>)
            : undefined
        const displayPhone =
          userInfoData && typeof userInfoData.phone === 'string'
            ? userInfoData.phone.trim()
            : userInfoRecord && typeof userInfoRecord.phone === 'string'
              ? userInfoRecord.phone.trim()
              : ''
        if (displayPhone) {
          try {
            await setAccountDisplayPhone({ id: rec.id, displayPhone })
          } catch {
            // ignore invalid display
          }
        }
        if (userInfoRecord) {
          await setAccountQqtInfo({ id: rec.id, qqtInfo: userInfoRecord })
        }

        res.json({
          ok: true,
          data: {
            cookie,
            cookieUpdated,
            accessToken: tokenResult.accessToken,
            tokenUpdated,
          },
          requestId,
        })
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/:id/session/refresh-activity',
  async (req: Request, res: Response<AccountSessionBridgeResp>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      await withKeyLock(`account:${id}`, async () => {
        const rec = await getAccountById(id)
        if (!rec?.cookie && !rec?.wedRechargeCookie) {
          res.status(404).json({
            ok: false,
            message: '暂无 Cookie',
            errorCode: 'NO_COOKIE',
            requestId,
          })
          return
        }
        const r = await refreshHlwhdActivitySession({
          cookie: rec.wedRechargeCookie || rec.cookie || '',
          activityId:
            typeof req.body?.activityId === 'string' ? req.body.activityId : undefined,
        })
        if (!r.ok || !r.cookie) {
          res.status(502).json({
            ok: false,
            message: r.message || '活动 CK 续期失败',
            errorCode: 'ACTIVITY_SESSION_REFRESH_FAILED',
            requestId,
          })
          return
        }
        if (r.cookieUpdated) {
          await setAccountWedRechargeCookie({ id: rec.id, cookie: r.cookie })
        }
        res.json({
          ok: true,
          data: {
            cookie: r.cookie,
            cookieUpdated: Boolean(r.cookieUpdated),
            sessionTokenUpdated: Boolean(r.sessionTokenUpdated),
            fields: r.fields,
            steps: r.steps,
          },
          requestId,
        })
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/:id/session/exchange-cmcc',
  async (req: Request, res: Response<AccountSessionBridgeResp>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      await withKeyLock(`account:${id}`, async () => {
        const rec = await getAccountById(id)
        if (!rec?.cookie && !rec?.yunpanSession) {
          res.status(404).json({
            ok: false,
            message: '暂无可用于置换的 10086 CK',
            errorCode: 'NO_COOKIE',
            requestId,
          })
          return
        }
        const usable = await ensureUsable10086Cookie({
          rec,
          allowRecentSkip: false,
          clearOnYunpanFailure: false,
          preferYunpan: Boolean(rec.yunpanSession),
        })
        if (!usable.ok || !usable.cookie) {
          res.status(410).json({
            ok: false,
            message: usable.message || '10086 CK 已失效，请重新登录后再置换 CMCC CK',
            errorCode: 'COOKIE_INVALID',
            requestId,
          })
          return
        }
        const r = await exchange10086CookieToCmccApp({ cookie: usable.cookie })
        if (!r.ok || !r.cookie) {
          res.status(502).json({
            ok: false,
            message: r.message || 'CMCC CK 置换失败',
            errorCode: 'CMCC_SESSION_EXCHANGE_FAILED',
            requestId,
          })
          return
        }
        if (r.cookieUpdated) {
          await setAccountCmccAppCookie({ id: rec.id, cookie: r.cookie })
        }
        res.json({
          ok: true,
          data: {
            cookie: r.cookie,
            cookieUpdated: Boolean(r.cookieUpdated),
            fields: r.fields,
            finalUrl: r.finalUrl,
            steps: r.steps,
          },
          requestId,
        })
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/:id/session/exchange-app-token',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: {
        cookie: string
        cookieUpdated: boolean
        sessionTokenUpdated?: boolean
        fields?: string[]
        finalUrl?: string
        activityUrl?: string
        steps?: Array<{
          name: string
          status: number
          cookieUpdated: boolean
          location?: string
        }>
        verify?: Record<string, unknown>
      }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    try {
      if (!isAdminRequest(req) && !isLocalRequest(req)) {
        res.status(403).json({
          ok: false,
          message: 'Forbidden',
          errorCode: 'FORBIDDEN',
          requestId,
        })
        return
      }
      await withKeyLock(`account:${id}`, async () => {
        const rec = await getAccountById(id)
        if (!rec) {
          res.status(404).json({
            ok: false,
            message: '账号不存在',
            errorCode: 'NOT_FOUND',
            requestId,
          })
          return
        }
        if (!rec.cookie) {
          res.status(404).json({
            ok: false,
            message: '暂无账号正常 CK，无法置换周三 appck',
            errorCode: 'NO_COOKIE',
            requestId,
          })
          return
        }
        const r = await exchangeAppTokenToActivityCookie({
          cookie: rec.cookie,
          appToken:
            typeof req.body?.appToken === 'string'
              ? req.body.appToken
              : typeof req.body?.token === 'string'
                ? req.body.token
                : '',
          postBody:
            req.body?.postBody && typeof req.body.postBody === 'object' && !Array.isArray(req.body.postBody)
              ? (req.body.postBody as Record<string, unknown>)
              : undefined,
          jwtToken:
            typeof req.body?.jwtToken === 'string'
              ? req.body.jwtToken
              : req.body?.jwtToken === null
                ? null
                : undefined,
          sid: typeof req.body?.sid === 'string' ? req.body.sid : undefined,
          loginUrl: typeof req.body?.loginUrl === 'string' ? req.body.loginUrl : undefined,
          activityUrl: typeof req.body?.activityUrl === 'string' ? req.body.activityUrl : undefined,
          provinceCode: typeof req.body?.provinceCode === 'string' ? req.body.provinceCode : undefined,
          cityCode: typeof req.body?.cityCode === 'string' ? req.body.cityCode : undefined,
          userCheckId: typeof req.body?.userCheckId === 'string' ? req.body.userCheckId : undefined,
          carrierOperator: typeof req.body?.carrierOperator === 'string' ? req.body.carrierOperator : undefined,
          appVersionCode: typeof req.body?.appVersionCode === 'string' ? req.body.appVersionCode : undefined,
          took: typeof req.body?.took === 'number' && Number.isFinite(req.body.took) ? req.body.took : undefined,
        })
        if (!r.ok || !r.cookie) {
          res.status(502).json({
            ok: false,
            message: r.message || 'App token 置换失败',
            errorCode: 'APP_TOKEN_EXCHANGE_FAILED',
            requestId,
          })
          return
        }
        if (r.cookieUpdated) {
          await setAccountWedRechargeCookie({ id: rec.id, cookie: r.cookie })
        }
        let verify: Record<string, unknown> | undefined
        if (req.body?.verifyWedRecharge === true) {
          try {
            const info = await wedRechargeQueryPictureInfo({ cookie: r.cookie })
            const saved = await setAccountWedRechargeInfo({
              id: rec.id,
              info: info as unknown as Record<string, unknown>,
            })
            verify = {
              wedRecharge: true,
              drawTimes: info.drawTimes,
              activeIndex: info.activeIndex,
              updatedAt: saved.wedRechargeUpdatedAt,
            }
          } catch (e) {
            verify = {
              wedRecharge: false,
              message: e instanceof Error ? e.message : '周三拼图验证失败',
            }
          }
        }

        res.json({
          ok: true,
          data: {
            cookie: r.cookie,
            cookieUpdated: Boolean(r.cookieUpdated),
            sessionTokenUpdated: Boolean(r.sessionTokenUpdated),
            fields: r.fields,
            finalUrl: r.finalUrl,
            activityUrl: r.activityUrl,
            steps: r.steps,
            verify,
          },
          requestId,
        })
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.get(
  '/:id/session/capabilities',
  async (req: Request, res: Response<AccountSessionCapabilitiesResp>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      const rec = await getAccountById(id)
      if (!rec?.cookie) {
        res.status(404).json({
          ok: false,
          message: '暂无 Cookie',
          errorCode: 'NO_COOKIE',
          requestId,
        })
        return
      }
      const capability = inspectSessionCapabilities(rec.cookie)
      res.json({
        ok: true,
        data: capability,
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/:id/sms/send',
  async (req: Request, res: Response<SendSmsResp>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      const rec = await getAccountById(id)
      if (!rec) {
        res.status(404).json({
          ok: false,
          message: '账号不存在',
          errorCode: 'NOT_FOUND',
          requestId,
        })
        return
      }
      if (
        denyServiceLogin({
          req,
          res,
          requestId,
        })
      ) {
        return
      }

      let requestHeaders: Record<string, string> | undefined = undefined
      try {
        requestHeaders = normalizeRequestHeaders(
          req.body?.headers ?? req.body?.requestHeaders ?? undefined,
        )
      } catch {
        res.status(400).json({
          ok: false,
          message: '请求头格式不正确',
          errorCode: 'INVALID_HEADERS',
          requestId,
        })
        return
      }

      const r = await cmccSendSms(rec.phone, requestHeaders)
      if (!r.ok) {
        res.status(502).json({
          ok: false,
          message: r.message || '发送验证码失败',
          errorCode: String(r.status ?? 'UPSTREAM_ERROR'),
          requestId,
        })
        return
      }

      res.json({ ok: true, data: { cooldownSeconds: 60 }, requestId })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res.status(500).json({
        ok: false,
        message:
          msg === 'UPSTREAM_TIMEOUT' ? '上游超时，请重试' : '上游接口异常',
        errorCode:
          msg === 'UPSTREAM_TIMEOUT' ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_ERROR',
        requestId,
      })
    }
  },
)

router.post('/:id/login', async (req: Request, res: Response<LoginResp>) => {
  const requestId = crypto.randomUUID()
  const id = String(req.params.id)
  const code = String(req.body?.code ?? '').trim()
  const phoneCandidate =
    typeof req.body?.phone === 'string' ? normalizePhoneCandidate(req.body.phone) : undefined

  if (!isSixDigitCode(code)) {
    res.status(400).json({
      ok: false,
      message: '请输入 6 位数字验证码',
      errorCode: 'INVALID_CODE',
      requestId,
    })
    return
  }

  try {
    const publicAccess = await ensurePublicLinkAccess({
      req,
      res,
      requestId,
      accountId: id,
    })
    if (!publicAccess.ok) return
    const rec = await getAccountById(id)
    if (!rec) {
      res.status(404).json({
        ok: false,
        message: '账号不存在',
        errorCode: 'NOT_FOUND',
        requestId,
      })
      return
    }
    if (
      denyServiceLogin({
        req,
        res,
        requestId,
      })
    ) {
      return
    }

    let requestHeaders: Record<string, string> | undefined = undefined
    try {
      requestHeaders = normalizeRequestHeaders(
        req.body?.headers ?? req.body?.requestHeaders ?? undefined,
      )
    } catch {
      res.status(400).json({
        ok: false,
        message: '请求头格式不正确',
        errorCode: 'INVALID_HEADERS',
        requestId,
      })
      return
    }

    const r = await cmccLoginBySms(rec.phone, code, requestHeaders)
    if (!r.ok || !r.cookie) {
      res.status(502).json({
        ok: false,
        message: r.message || '登录失败',
        errorCode: String(r.status ?? 'UPSTREAM_ERROR'),
        requestId,
      })
      return
    }

    await setAccountCookie({
      id,
      cookie: r.cookie,
      requestHeaders,
      loginMethod: 'cmcc_sms',
      cookieSource: 'sms',
      ttlHours: 72,
    })
    const nextPhone = phoneCandidate || rec.phone
    if (nextPhone && /^1\d{10}$/.test(nextPhone)) {
      try {
        await setAccountPhone({ id, phone: nextPhone })
      } catch {
        // ignore invalid phone update
      }
    }
    if (publicAccess.linkId) {
      await notifyLoginByLink({
        linkId: publicAccess.linkId,
        accountId: id,
        display: formatAccountDisplay({
          phone: nextPhone || rec.phone,
          displayPhone: rec.displayPhone,
          label: rec.label,
        }),
      })
    }
    res.json({ ok: true, data: { cookie: r.cookie }, requestId })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({
      ok: false,
      message: msg === 'UPSTREAM_TIMEOUT' ? '上游超时，请重试' : '上游接口异常',
      errorCode:
        msg === 'UPSTREAM_TIMEOUT' ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_ERROR',
      requestId,
    })
  }
})

router.post(
  '/:id/qqt/sms/send',
  async (req: Request, res: Response<SendSmsResp>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    const phoneCandidate =
      typeof req.body?.phone === 'string'
        ? normalizePhoneCandidate(req.body.phone)
        : undefined
    const sspid = String(req.body?.sspid ?? '').trim()

    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      const rec = await getAccountById(id)
      if (!rec) {
        res.status(404).json({
          ok: false,
          message: '账号不存在',
          errorCode: 'NOT_FOUND',
          requestId,
        })
        return
      }
      const phone = phoneCandidate || normalizePhoneCandidate(rec.phone || '')
      if (!phone) {
        res.status(400).json({
          ok: false,
          message: '请输入有效手机号',
          errorCode: 'INVALID_PHONE',
          requestId,
        })
        return
      }
      if (
        denyServiceLogin({
          req,
          res,
          requestId,
        })
      ) {
        return
      }

      const r = await qqtSendSms({ phone, sspid: sspid || undefined })
      if (!r.ok) {
        res.status(502).json({
          ok: false,
          message: r.message || '发送验证码失败',
          errorCode: String(r.status ?? 'UPSTREAM_ERROR'),
          requestId,
        })
        return
      }

      if (phoneCandidate && phoneCandidate !== rec.phone) {
        try {
          await setAccountPhone({ id, phone: phoneCandidate })
        } catch {
          // ignore invalid phone update
        }
      }

      res.json({
        ok: true,
        data: { cooldownSeconds: 60 },
        message: r.message || '验证码已发送',
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res.status(500).json({
        ok: false,
        message:
          msg === 'UPSTREAM_TIMEOUT' ? '上游超时，请重试' : '上游接口异常',
        errorCode:
          msg === 'UPSTREAM_TIMEOUT' ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_ERROR',
        requestId,
      })
    }
  },
)

router.post(
  '/:id/qqt/login',
  async (req: Request, res: Response<QqtSmsLoginResp>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    const code = String(req.body?.code ?? req.body?.smsCode ?? '').trim()
    const phoneCandidate =
      typeof req.body?.phone === 'string'
        ? normalizePhoneCandidate(req.body.phone)
        : undefined

    if (!isSixDigitCode(code)) {
      res.status(400).json({
        ok: false,
        message: '请输入 6 位数字验证码',
        errorCode: 'INVALID_CODE',
        requestId,
      })
      return
    }

    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      const rec = await getAccountById(id)
      if (!rec) {
        res.status(404).json({
          ok: false,
          message: '账号不存在',
          errorCode: 'NOT_FOUND',
          requestId,
        })
        return
      }
      const phone = phoneCandidate || normalizePhoneCandidate(rec.phone || '')
      if (!phone) {
        res.status(400).json({
          ok: false,
          message: '请输入有效手机号',
          errorCode: 'INVALID_PHONE',
          requestId,
        })
        return
      }
      if (
        denyServiceLogin({
          req,
          res,
          requestId,
        })
      ) {
        return
      }

      const r = await qqtLoginBySms({ phone, smsCode: code })
      if (!r.ok || !r.accessToken) {
        res.status(502).json({
          ok: false,
          message: r.message || '全球通登录失败',
          errorCode: String(r.status ?? 'UPSTREAM_ERROR'),
          requestId,
        })
        return
      }

      await setAccountQqtToken({ id, qqtAccessToken: r.accessToken })
      await setAccountSmsLoginWindow({ id, ttlHours: 72 })
      if (phoneCandidate && phoneCandidate !== rec.phone) {
        try {
          await setAccountPhone({ id, phone: phoneCandidate })
        } catch {
          // ignore invalid phone update
        }
      }

      res.json({
        ok: true,
        data: { accessToken: r.accessToken },
        message: r.message || '全球通登录成功',
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res.status(500).json({
        ok: false,
        message:
          msg === 'UPSTREAM_TIMEOUT' ? '上游超时，请重试' : '上游接口异常',
        errorCode:
          msg === 'UPSTREAM_TIMEOUT' ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_ERROR',
        requestId,
      })
    }
  },
)

router.post(
  '/:id/qqt/sso-link',
  async (req: Request, res: Response<ApiResp<unknown>>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    try {
      const access = await ensurePublicLinkAccess({ req, res, requestId, accountId: id })
      if (!access.ok) return
      const rec = await getAccountById(id)
      if (!rec) {
        res.status(404).json({
          ok: false,
          message: '账号不存在',
          errorCode: 'NOT_FOUND',
          requestId,
        })
        return
      }
      if (rec.yunpanSession) {
        if (rec.disabledAt) throw new Error('账号已禁用，请先启用账号')
        // Persist/reuse QQT first; the official WX bind entry creates a fresh
        // browser SSO ticket rather than exposing a cloud ticket to the browser.
        await ensureYunpanGlobalToken(rec)
      }
      res.setHeader('Cache-Control', 'no-store')
      const usable = await ensureUsable10086Cookie({
        rec: (await getAccountById(id)) || rec,
        allowRecentSkip: true,
        windowMin: 5,
        clearOnYunpanFailure: false,
        preferYunpan: false,
      })
      if (!usable.ok || !usable.cookie) {
        res.status(410).json({
          ok: false,
          message: usable.message || '账号暂无可用的 10086 CK',
          errorCode: 'COOKIE_INVALID',
          requestId,
        })
        return
      }
      const result = await buildQqtSsoLink({
        cmccCookie: usable.cookie,
        requestHeaders: rec.requestHeaders,
      })
      if (!result.ok || !result.ssoUrl) {
        res.status(502).json({
          ok: false,
          message: result.message || '生成全球通专区跳转链接失败',
          errorCode: String(result.status || 'QQT_SSO_FAILED'),
          requestId,
        })
        return
      }
      await logEvent({
        action: 'qqt.sso_link.generate',
        requestId,
        accountId: rec.id,
        message: 'ok',
      })
      res.json({
        ok: true,
        data: { ssoUrl: result.ssoUrl, source: 'fresh-sso' },
        requestId,
      })
    } catch (e) {
      const message = e instanceof Error ? e.message : '生成全球通专区跳转链接失败'
      await logEvent({
        level: 'error',
        action: 'qqt.sso_link.generate',
        requestId,
        accountId: id,
        message,
      })
      res.status(message === 'UPSTREAM_TIMEOUT' ? 504 : 500).json({
        ok: false,
        message: message === 'UPSTREAM_TIMEOUT' ? '全球通专区上游超时，请重试' : message,
        errorCode: message === 'UPSTREAM_TIMEOUT' ? 'UPSTREAM_TIMEOUT' : 'SERVER_ERROR',
        requestId,
      })
    }
  },
)

router.post(
  '/:id/qqt/token',
  async (req: Request, res: Response<QqtTokenResp>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    try {
      const access = await ensurePublicLinkAccess({ req, res, requestId, accountId: id })
      if (!access.ok) return
      await withKeyLock(`account:${id}`, async () => {
        const rec = await getAccountById(id)
        if (rec?.yunpanSession) {
          const latest = await ensureYunpanGlobalToken(rec, req.query?.force === '1' || req.body?.force === true)
          res.json({ ok: true, data: { accessToken: latest.qqtAccessToken!, userInfo: latest.qqtInfo }, requestId })
          return
        }
        if (!rec?.cookie) {
          res.status(404).json({
            ok: false,
            message: '暂无 Cookie',
            errorCode: 'NO_COOKIE',
            requestId,
          })
          return
        }

        const windowMin = getValidityWindowMin()
        const force = req.query?.force === '1' || req.body?.force === true
        if (!force && rec.qqtAccessToken && isWithinWindow(rec.qqtAccessTokenCheckedAt, windowMin)) {
          res.json({
            ok: true,
            data: { accessToken: rec.qqtAccessToken, userInfo: rec.qqtInfo },
            requestId,
          })
          return
        }

        const skipEnsure =
          req.query?.skipEnsure === '1' || req.body?.skipEnsure === true

        let cmccCookie = rec.cookie
        if (!skipEnsure) {
          // If we've validated the cookie very recently, skip upstream refresh.
          if (isWithinWindow(rec.cookieCheckedAt, windowMin)) {
            cmccCookie = rec.cookie
          } else {
          const refreshed = await ensureFreshCookie({
            id: rec.id,
            cookie: rec.cookie,
            requestHeaders: rec.requestHeaders,
            newHomeUrl: rec.newHomeUrl,
          })
          if (!refreshed.ok || !refreshed.cookie) {
            res.status(502).json({
              ok: false,
              message: refreshed.message || 'Cookie 无效',
              errorCode: 'COOKIE_INVALID',
              requestId,
            })
            return
          }
          cmccCookie = refreshed.cookie
          }
        }

        const r = await qqtReplaceToken({
          cmccCookie,
          requestHeaders: rec.requestHeaders,
        })
        if (!r.ok || !r.accessToken) {
          res.status(502).json({
            ok: false,
            message: r.message || '获取 token 失败',
            errorCode: String(r.status ?? 'UPSTREAM_ERROR'),
            requestId,
          })
          return
        }

        await setAccountQqtToken({ id: rec.id, qqtAccessToken: r.accessToken })
        await touchAccountQqtTokenCheckedAt({ id: rec.id })
      const userInfo = r.userInfo
      const userInfoRecord =
        userInfo && typeof userInfo === 'object'
          ? (userInfo as Record<string, unknown>)
          : undefined
      const userInfoData =
        userInfoRecord && typeof userInfoRecord.data === 'object'
          ? (userInfoRecord.data as Record<string, unknown>)
          : undefined
      const displayPhone =
        userInfoData && typeof userInfoData.phone === 'string'
          ? userInfoData.phone.trim()
          : userInfoRecord && typeof userInfoRecord.phone === 'string'
            ? userInfoRecord.phone.trim()
            : ''
      if (displayPhone) {
        try {
          await setAccountDisplayPhone({ id: rec.id, displayPhone })
        } catch {
          // ignore invalid display
        }
      }
      if (userInfoRecord) {
        await setAccountQqtInfo({ id: rec.id, qqtInfo: userInfoRecord })
      }

      await logEvent({
        action: 'qqt.token.refresh',
        requestId,
        accountId: rec.id,
        message: 'ok',
      })
      res.json({
        ok: true,
        data: { accessToken: r.accessToken, userInfo: r.userInfo },
        requestId,
      })
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      await logEvent({
        level: 'error',
        action: 'qqt.token.refresh',
        requestId,
        accountId: id,
        message: msg,
      })
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/:id/qqt/sign',
  async (req: Request, res: Response<QqtSignResp>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    const sspid = String(req.body?.sspid ?? '').trim()
    const accessToken =
      typeof req.body?.accessToken === 'string' && req.body.accessToken.trim()
        ? String(req.body.accessToken).trim()
        : undefined

    if (!sspid) {
      res.status(400).json({
        ok: false,
        message: 'SSPID 不能为空',
        errorCode: 'INVALID_SSPID',
        requestId,
      })
      return
    }

    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      let rec = await getAccountById(id)
      if (rec?.yunpanSession) rec = await ensureYunpanGlobalToken(rec)
      const accessTokenCandidate = rec?.yunpanSession ? rec.qqtAccessToken : accessToken || rec?.qqtAccessToken
      if (!rec?.cookie && !accessTokenCandidate) {
        res.status(404).json({
          ok: false,
          message: '暂无 Cookie 或 Token',
          errorCode: 'NO_COOKIE',
          requestId,
        })
        return
      }

      let cmccCookie = rec?.yunpanSession ? '' : rec?.cookie ?? ''
      if (cmccCookie) {
        const refreshed = await ensureFreshCookie({
          id: rec.id,
          cookie: cmccCookie,
          requestHeaders: rec.requestHeaders,
          newHomeUrl: rec.newHomeUrl,
        })
        if (!refreshed.ok || !refreshed.cookie) {
          res.status(502).json({
            ok: false,
            message: refreshed.message || 'Cookie 无效',
            errorCode: 'COOKIE_INVALID',
            requestId,
          })
          return
        }
        cmccCookie = refreshed.cookie
      }

      const r = await qqtSign({
        cmccCookie: cmccCookie,
        requestHeaders: rec.requestHeaders,
        sspid,
        accessToken: accessTokenCandidate,
      })
      if (!r.ok || !r.result || !r.accessToken) {
        res.status(502).json({
          ok: false,
          message: r.message || '签到失败',
          errorCode: String(r.status ?? 'UPSTREAM_ERROR'),
          requestId,
        })
        return
      }

      if (r.accessToken) {
        await setAccountQqtToken({ id, qqtAccessToken: r.accessToken })
      }
      const resultRecord =
        r.result && typeof r.result === 'object'
          ? (r.result as Record<string, unknown>)
          : undefined
      const signInfoRecord =
        r.signInfo && typeof r.signInfo === 'object'
          ? (r.signInfo as Record<string, unknown>)
          : undefined
      if (resultRecord || signInfoRecord) {
        await setAccountQqtSignState({
          id,
          signInfo: signInfoRecord,
          signResult: resultRecord,
        })
      }
      await logEvent({
        action: 'qqt.sign',
        requestId,
        accountId: id,
        message: 'ok',
        meta: { sspid },
      })
      res.json({
        ok: true,
        data: {
          accessToken: r.accessToken,
          result: r.result,
          signInfo: r.signInfo,
          acceptSummary: r.acceptSummary,
        },
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      await logEvent({
        level: 'error',
        action: 'qqt.sign',
        requestId,
        accountId: id,
        message: msg,
        meta: { sspid },
      })
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/:id/qqt/info',
  async (req: Request, res: Response<QqtSignInfoResp>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    const sspid = String(req.body?.sspid ?? '').trim()
    const accessToken =
      typeof req.body?.accessToken === 'string' && req.body.accessToken.trim()
        ? String(req.body.accessToken).trim()
        : undefined

    if (!sspid) {
      res.status(400).json({
        ok: false,
        message: 'SSPID 不能为空',
        errorCode: 'INVALID_SSPID',
        requestId,
      })
      return
    }

    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      let rec = await getAccountById(id)
      if (rec?.yunpanSession) rec = await ensureYunpanGlobalToken(rec)
      const accessTokenCandidate = rec?.yunpanSession ? rec.qqtAccessToken : accessToken || rec?.qqtAccessToken
      if (!rec?.cookie && !accessTokenCandidate) {
        res.status(404).json({
          ok: false,
          message: '暂无 Cookie 或 Token',
          errorCode: 'NO_COOKIE',
          requestId,
        })
        return
      }

      let cmccCookie = rec?.yunpanSession ? '' : rec?.cookie ?? ''
      if (cmccCookie) {
        const refreshed = await ensureFreshCookie({
          id: rec.id,
          cookie: cmccCookie,
          requestHeaders: rec.requestHeaders,
          newHomeUrl: rec.newHomeUrl,
        })
        if (!refreshed.ok || !refreshed.cookie) {
          res.status(502).json({
            ok: false,
            message: refreshed.message || 'Cookie 无效',
            errorCode: 'COOKIE_INVALID',
            requestId,
          })
          return
        }
        cmccCookie = refreshed.cookie
      }

      const r = await qqtSignInfo({
        cmccCookie: cmccCookie,
        requestHeaders: rec.requestHeaders,
        sspid,
        accessToken: accessTokenCandidate,
      })
      if (!r.ok || !r.info || !r.accessToken) {
        res.status(502).json({
          ok: false,
          message: r.message || '查询签到结果失败',
          errorCode: String(r.status ?? 'UPSTREAM_ERROR'),
          requestId,
        })
        return
      }

      if (r.accessToken) {
        await setAccountQqtToken({ id, qqtAccessToken: r.accessToken })
      }
      const infoPhone = extractPhoneFromObject(r.info)
      if (infoPhone) {
        try {
          await setAccountPhone({ id, phone: infoPhone })
        } catch {
          // ignore invalid phone
        }
      }
      const infoRecord =
        r.info && typeof r.info === 'object'
          ? (r.info as Record<string, unknown>)
          : undefined
      const infoData =
        infoRecord && typeof infoRecord.data === 'object'
          ? (infoRecord.data as Record<string, unknown>)
          : undefined
      const displayPhone =
        infoData && typeof infoData.phone === 'string'
          ? infoData.phone.trim()
          : infoRecord && typeof infoRecord.phone === 'string'
            ? infoRecord.phone.trim()
            : ''
      if (displayPhone) {
        try {
          await setAccountDisplayPhone({ id, displayPhone })
        } catch {
          // ignore invalid display
        }
      }
      if (infoRecord) {
        await setAccountQqtInfo({ id, qqtInfo: infoRecord })
        await setAccountQqtSignState({ id, signInfo: infoRecord })
      }
      res.json({
        ok: true,
        data: { accessToken: r.accessToken, info: r.info },
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/:id/qqt/xdr/receive',
  async (req: Request, res: Response<QqtXdrReceiveResp>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    const accessToken =
      typeof req.body?.accessToken === 'string' && req.body.accessToken.trim()
        ? String(req.body.accessToken).trim()
        : undefined

    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      let rec = await getAccountById(id)
      if (rec?.yunpanSession) rec = await ensureYunpanGlobalToken(rec)
      const accessTokenCandidate = rec?.yunpanSession ? rec.qqtAccessToken : accessToken || rec?.qqtAccessToken
      if (!rec?.cookie && !accessTokenCandidate) {
        res.status(404).json({
          ok: false,
          message: '暂无 Cookie 或 Token',
          errorCode: 'NO_COOKIE',
          requestId,
        })
        return
      }

      let cmccCookie = rec?.yunpanSession ? '' : rec?.cookie ?? ''
      if (cmccCookie) {
        const refreshed = await ensureFreshCookie({
          id: rec.id,
          cookie: cmccCookie,
          requestHeaders: rec.requestHeaders,
          newHomeUrl: rec.newHomeUrl,
        })
        if (!refreshed.ok || !refreshed.cookie) {
          res.status(502).json({
            ok: false,
            message: refreshed.message || 'Cookie 无效',
            errorCode: 'COOKIE_INVALID',
            requestId,
          })
          return
        }
        cmccCookie = refreshed.cookie
      }

      const r = await qqtQueryXdrReceive({
        cmccCookie: cmccCookie,
        requestHeaders: rec?.requestHeaders,
        accessToken: accessTokenCandidate,
      })
      if (!r.ok || !r.receive || !r.accessToken) {
        res.status(502).json({
          ok: false,
          message: r.message || '查询星动日失败',
          errorCode: String(r.status ?? 'UPSTREAM_ERROR'),
          requestId,
        })
        return
      }

      if (r.accessToken) {
        await setAccountQqtToken({ id, qqtAccessToken: r.accessToken })
      }
      const receiveRecord =
        r.receive && typeof r.receive === 'object'
          ? (r.receive as Record<string, unknown>)
          : undefined
      if (receiveRecord) {
        await setAccountXdrReceive({ id, receive: receiveRecord })
      }

      res.json({
        ok: true,
        data: { accessToken: r.accessToken, receive: r.receive },
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/:id/wed-recharge/start',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: { task: BatchTaskSummary; reused: boolean }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      const rec = await getAccountById(id)
      if (!rec?.cookie) {
        res.status(404).json({
          ok: false,
          message: '暂无 Cookie',
          errorCode: 'NO_COOKIE',
          requestId,
        })
        return
      }
      const countRaw = Number(req.body?.count ?? 50)
      const count = Number.isFinite(countRaw)
        ? Math.max(1, Math.min(300, Math.floor(countRaw)))
        : 50
      const useAppToken = false
      const { task, reused } = await createOrReuseBatchTask({
        type: 'wed_recharge',
        scopeType: 'account',
        scopeId: id,
        timezone:
          typeof req.body?.timezone === 'string' && req.body.timezone.trim()
            ? req.body.timezone.trim()
            : 'Asia/Shanghai',
        dedupeKey: `wed_recharge:account:${id}:${useAppToken ? 'appck' : 'base'}`,
        wedRecharge: {
          count,
          taskId: typeof req.body?.taskId === 'string' ? req.body.taskId.trim() : undefined,
          activityId:
            typeof req.body?.activityId === 'string'
              ? req.body.activityId.trim()
              : undefined,
          drawAfterRun: req.body?.draw !== false && req.body?.drawAfterRun !== false,
          autoTaskList: true,
          useAppToken,
        },
        forceDaily: req.body?.forceDaily === true,
      })
      res.json({ ok: true, data: { task, reused }, requestId })
    } catch (e) {
      const msg = e instanceof Error ? e.message : '启动周三拼图任务失败'
      res.status(500).json({
        ok: false,
        message: msg,
        errorCode: 'SERVER_ERROR',
        requestId,
      })
    }
  },
)

router.get(
  '/:id/wed-recharge/status',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: { task: BatchTaskSummary | null; info?: Record<string, unknown> }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      const rec = await getAccountById(id)
      const active = await getActiveTask({
        type: 'wed_recharge',
        scopeType: 'account',
        scopeId: id,
      })
      let task = active
      if (!task) {
        const prisma = getPrisma()
        const item = await prisma.batchTaskItem.findFirst({
          where: { accountId: id, task: { type: 'wed_recharge' } },
          orderBy: { updatedAt: 'desc' },
          include: { task: { include: { items: true } } },
        })
        task = item ? (await getTaskById(item.taskId)) : null
      }
      res.json({
        ok: true,
        data: {
          task,
          info: rec?.wedRechargeInfo
            ? ({
                ...rec.wedRechargeInfo,
                updatedAt: rec.wedRechargeUpdatedAt,
              } as Record<string, unknown>)
            : undefined,
        },
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : '查询周三拼图任务失败'
      res.status(500).json({
        ok: false,
        message: msg,
        errorCode: 'SERVER_ERROR',
        requestId,
      })
    }
  },
)

router.post(
  '/:id/wed-recharge/query',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: { info: Record<string, unknown> }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      const rec = await getAccountById(id)
      if (!rec?.cookie) {
        res.status(404).json({
          ok: false,
          message: '暂无 Cookie',
          errorCode: 'NO_COOKIE',
          requestId,
        })
        return
      }
      const { info, saved } = await withWedActivityLock(() => withKeyLock(`account:${id}`, async () => {
        const current = await getAccountById(id)
        if (!current?.cookie || current.disabledAt) throw new Error('账号已停用或缺少 CK')
        const wedCookie = await prepareWedRechargeCookieForAccount({
          id, cookie: current.cookie, requestHeaders: current.requestHeaders,
          newHomeUrl: current.newHomeUrl, useAppToken: false,
        })
        const info = await wedRechargeQueryPictureInfo({ cookie: wedCookie })
        const saved = await setAccountWedRechargeInfo({ id, info: info as unknown as Record<string, unknown> })
        return { info, saved }
      }))
      res.json({
        ok: true,
        data: { info: { ...info, updatedAt: saved.wedRechargeUpdatedAt } as Record<string, unknown> },
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : '周三拼图查询失败'
      res.status(502).json({
        ok: false,
        message: msg,
        errorCode: msg.includes('需要登录') ? 'WED_RECHARGE_LOGIN_REQUIRED' : 'UPSTREAM_ERROR',
        requestId,
      })
    }
  },
)

router.post(
  '/:id/wed-recharge/add-chances',
  async (req: Request, res: Response<ApiResp<never>>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    const publicAccess = await ensurePublicLinkAccess({ req, res, requestId, accountId: id })
    if (!publicAccess.ok) return
    res.status(410).json({
      ok: false,
      message: '批量重复上报已停用，请使用一键拼图按实时任务列表逐项完成',
      errorCode: 'WED_RECHARGE_LEGACY_FLOW_DISABLED',
      requestId,
    })
  },
)

router.post(
  '/:id/wed-recharge/draw',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: { draw: Record<string, unknown>; info?: Record<string, unknown> }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    try {
      const publicAccess = await ensurePublicLinkAccess({
        req,
        res,
        requestId,
        accountId: id,
      })
      if (!publicAccess.ok) return
      const rec = await getAccountById(id)
      if (!rec?.cookie) {
        res.status(404).json({
          ok: false,
          message: '暂无 Cookie',
          errorCode: 'NO_COOKIE',
          requestId,
        })
        return
      }
      await withWedActivityLock(() => withKeyLock(`account:${id}`, async () => {
      const rec = await getAccountById(id)
      if (!rec?.cookie || rec.disabledAt) throw new Error('账号已停用或缺少 CK')
      let infoBefore
      try {
        const wedCookieForInfo = await prepareWedRechargeCookieForAccount({
          id,
          cookie: rec.cookie,
          requestHeaders: rec.requestHeaders,
          newHomeUrl: rec.newHomeUrl,
        })
        infoBefore = await wedRechargeQueryPictureInfo({ cookie: wedCookieForInfo })
      } catch {
        infoBefore = undefined
      }
      const round =
        String(req.body?.round || '').trim() || resolveWedRechargeRound(infoBefore)
      const wedCookie = await prepareWedRechargeCookieForAccount({
        id,
        cookie: rec.cookie,
        requestHeaders: rec.requestHeaders,
        newHomeUrl: rec.newHomeUrl,
        useAppToken: false,
      })
      const draw = await wedRechargeDrawPicture({ cookie: wedCookie, round })
      const queried = await wedRechargeQueryPictureInfo({ cookie: wedCookie })
      const saved = await setAccountWedRechargeInfo({
        id,
        info: queried as unknown as Record<string, unknown>,
      })
      res.json({
        ok: true,
        data: {
          draw: draw as unknown as Record<string, unknown>,
          info: { ...queried, updatedAt: saved.wedRechargeUpdatedAt } as Record<string, unknown>,
        },
        requestId,
      })
      }))
    } catch (e) {
      const msg = e instanceof Error ? e.message : '周三拼图获取碎片失败'
      res.status(502).json({
        ok: false,
        message: msg,
        errorCode: msg.includes('需要登录') ? 'WED_RECHARGE_LOGIN_REQUIRED' : 'UPSTREAM_ERROR',
        requestId,
      })
    }
  },
)

router.post(
  '/:id/wed-recharge/run',
  async (req: Request, res: Response<ApiResp<never>>) => {
    const requestId = crypto.randomUUID()
    const id = String(req.params.id)
    const publicAccess = await ensurePublicLinkAccess({ req, res, requestId, accountId: id })
    if (!publicAccess.ok) return
    res.status(410).json({
      ok: false,
      message: '旧版一键重复上报已停用，请调用 wed-recharge/start 执行实时任务流程',
      errorCode: 'WED_RECHARGE_LEGACY_FLOW_DISABLED',
      requestId,
    })
  },
)

export default router

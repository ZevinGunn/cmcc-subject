import crypto from 'node:crypto'
import { httpsRequestText } from './cmccHttp.js'
import { parseSetCookieToPairs, buildCookieHeader } from './cookieUtils.js'
import type { YunpanSessionRecord } from './accountsStore.js'

const USER_DOMAIN_AES_KEY = 'UqEZkrjCKfa02pP6jntzFmkzOz86zHUC'
const SMS_AES_KEY = 'h7DLzCTAjn+altjy2a9E9FSt7AC6pmx1'
const WX_AES_KEY = '1234123412ABCDEF'
const WX_AES_IV = 'ABCDEF1234123412'
const DEFAULT_SOURCE_ID = '017018'
const DEFAULT_USER_DOMAIN_URL = 'https://user-njs.yun.139.com/user'
const DEFAULT_FLOW_SHOP_URL =
  'https://wx.10086.cn/website/businessPlatform/flowShop?secondChannel=P00000116110&netToken=#ssoToken&targetSourceId=017018'

const CLIENT = {
  appVersion: '7.17.10',
  mcloudClient: '10701',
  appChannel: '10000034',
  cmsClient: '0010102',
  device: 'Chrome',
  os: 'macOS 10.15.7',
  screen: '1440X900',
  deviceId: 'jofSYuWzz1JXMEisuSJfHHZeB5kP54bk',
}

type PendingYunpanSession = Partial<YunpanSessionRecord> & {
  lastSmsRandom?: string
}

type SpecTokenMode = 'v1' | 'v2'

type YunpanRouterInfo = {
  modName?: string
  httpUrl?: string
  httpsUrl?: string
  hashName?: string
}

type SpecTokenDiagnostic = {
  protocol: SpecTokenMode
  sourceId: string
  httpStatus: number
  success?: boolean
  code?: string
  resultCode?: string
}

type SpecTokenQueryResult = {
  ok: boolean
  status?: number
  message?: string
  ssoToken?: string
  diagnostic?: SpecTokenDiagnostic
  session: YunpanSessionRecord
}

type SendYunpanSmsResult = {
  ok: boolean
  status?: number
  message?: string
  cooldownSeconds?: number
  upstreamResponse?: unknown
  rawTextSnippet?: string
}

type YunpanLoginResult = {
  ok: boolean
  status?: number
  message?: string
  session?: YunpanSessionRecord
  ssoToken?: string
  ssoUrl?: string
  wxCookie?: string
  wxCookieNames?: string[]
  wxAuthToken?: string
  upstreamResponse?: unknown
  rawTextSnippet?: string
}

function randomString(length = 16): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let out = ''
  for (let i = 0; i < length; i += 1) {
    out += alphabet[crypto.randomInt(alphabet.length)]
  }
  return out
}

function md5(value: string): string {
  return crypto.createHash('md5').update(value).digest('hex')
}

function base64Encode(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64')
}

function base64Decode(value: string): string {
  return Buffer.from(value, 'base64').toString('utf8')
}

function normalizeNationCode(nationCode = '+86'): string {
  const text = String(nationCode || '+86').trim()
  if (text === '86') return '+86'
  return text.startsWith('+') ? text : `+${text}`
}

function deviceInfo(full = false): string {
  const tail = full
    ? `|||${Buffer.from(CLIENT.device).toString('base64')}|`
    : '|||'
  return `||9|${CLIENT.appVersion}|${CLIENT.device}|${CLIENT.device}|${CLIENT.deviceId}||${CLIENT.os}|${CLIENT.screen}|${tail}`
}

function requireSourceId(value: string): string {
  const sourceId = String(value || '').trim()
  if (!sourceId) throw new Error('SOURCE_ID_REQUIRED')
  return sourceId
}

function buildQuerySpecTokenV1Payload(account: string, toSourceId: string) {
  return {
    account: account.trim(),
    toSourceId: requireSourceId(toSourceId),
  }
}

function buildQuerySpecTokenV2Payload(account: string, toSourceId: string) {
  const normalizedAccount = account.trim()
  return {
    phoneNumber: normalizedAccount,
    toSourceId: requireSourceId(toSourceId),
    commonAccountInfo: {
      account: normalizedAccount,
      accountType: 1,
    },
  }
}

function resolveUserDomainUrl(routerInfo?: YunpanRouterInfo[]): string {
  const candidate = routerInfo?.find((item) => item?.modName === 'user')?.httpsUrl
  if (!candidate) return DEFAULT_USER_DOMAIN_URL
  try {
    const parsed = new URL(candidate)
    if (
      parsed.protocol !== 'https:' ||
      (parsed.hostname !== 'yun.139.com' && !parsed.hostname.endsWith('.yun.139.com'))
    ) {
      return DEFAULT_USER_DOMAIN_URL
    }
    return parsed.toString().replace(/\/$/, '')
  } catch {
    return DEFAULT_USER_DOMAIN_URL
  }
}

function resolveSpecTokenMode(): SpecTokenMode {
  return String(process.env.YUNPAN_SPEC_TOKEN_MODE || '').trim().toLowerCase() === 'v2'
    ? 'v2'
    : 'v1'
}

function buildSpecTokenDiagnostic(
  response: unknown,
  httpStatus: number,
  protocol: SpecTokenMode,
): SpecTokenDiagnostic {
  const obj = response && typeof response === 'object' && !Array.isArray(response)
    ? (response as Record<string, unknown>)
    : {}
  const data = obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)
    ? (obj.data as Record<string, unknown>)
    : {}
  const asText = (value: unknown) =>
    typeof value === 'string' || typeof value === 'number' ? String(value) : undefined
  return {
    protocol,
    sourceId: DEFAULT_SOURCE_ID,
    httpStatus,
    success: typeof obj.success === 'boolean' ? obj.success : undefined,
    code: asText(obj.code),
    resultCode: asText(data.resultCode ?? obj.resultCode),
  }
}

function formatMcloudTimestamp(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('')
}

function getNewSign(data: unknown, timestamp: string, nonce: string): string {
  const normalized =
    data === undefined || data === null
      ? ''
      : encodeURIComponent(JSON.stringify(data)).split('').sort().join('')
  const c = md5(base64Encode(normalized))
  const u = md5(`${timestamp}:${nonce}`)
  return md5(c + u).toUpperCase()
}

function aesEcbEncrypt(plainText: string, key: string): string {
  const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(key, 'utf8'), null)
  cipher.setAutoPadding(true)
  return Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]).toString('base64')
}

function aesEcbDecrypt(cipherText: string, key: string): string {
  const decipher = crypto.createDecipheriv('aes-128-ecb', Buffer.from(key, 'utf8'), null)
  decipher.setAutoPadding(true)
  return Buffer.concat([
    decipher.update(Buffer.from(cipherText, 'base64')),
    decipher.final(),
  ]).toString('utf8')
}

function aesCbcEncryptWithIvPrefix(value: unknown, key = USER_DOMAIN_AES_KEY): string {
  const iv = crypto.randomBytes(16)
  const plainText = typeof value === 'string' ? value : JSON.stringify(value)
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'utf8'),
    iv,
  )
  cipher.setAutoPadding(true)
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()])
  return Buffer.concat([iv, encrypted]).toString('base64')
}

function aesCbcDecryptWithIvPrefix(cipherText: string, key = USER_DOMAIN_AES_KEY): string {
  const raw = Buffer.from(cipherText, 'base64')
  const iv = raw.subarray(0, 16)
  const encrypted = raw.subarray(16)
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'utf8'),
    iv,
  )
  decipher.setAutoPadding(true)
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
}

function rsaEncryptWithPublicKey(value: string, publicKey: string): string {
  const pem = publicKey.includes('BEGIN PUBLIC KEY')
    ? publicKey
    : `-----BEGIN PUBLIC KEY-----\n${publicKey.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`
  return crypto.publicEncrypt(
    { key: pem, padding: crypto.constants.RSA_PKCS1_PADDING },
    Buffer.from(value, 'utf8'),
  ).toString('base64')
}

function wxAesEncryptHex(plainText: string): string {
  const cipher = crypto.createCipheriv(
    'aes-128-cbc',
    Buffer.from(WX_AES_KEY, 'utf8'),
    Buffer.from(WX_AES_IV, 'utf8'),
  )
  cipher.setAutoPadding(true)
  return Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()])
    .toString('hex')
    .toUpperCase()
}

function wxAesDecryptHex(cipherHex: string): string {
  const decipher = crypto.createDecipheriv(
    'aes-128-cbc',
    Buffer.from(WX_AES_KEY, 'utf8'),
    Buffer.from(WX_AES_IV, 'utf8'),
  )
  decipher.setAutoPadding(true)
  return Buffer.concat([
    decipher.update(Buffer.from(cipherHex, 'hex')),
    decipher.final(),
  ]).toString('utf8')
}

function safeJson(value: string): unknown {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function looksLikeHtml(value: unknown): boolean {
  if (typeof value !== 'string') return false
  return /<!doctype html|<html[\s>]|cloudflare|bad gateway/i.test(value.slice(0, 2000))
}

function upstreamGatewayMessage(statusCode: number, data: unknown, fallback: string): string | undefined {
  if (statusCode === 502 || statusCode === 503 || statusCode === 504 || looksLikeHtml(data)) {
    return `云盘登录接口返回 ${statusCode || '网关错误'}，上游网关临时异常，请稍后重试`
  }
  return undefined
}

function rawSnippet(value: string): string {
  return value.replace(/\s+/g, ' ').trim().slice(0, 800)
}

function mergeCookieJar(
  cookieJar: Record<string, string> | undefined,
  setCookie: string | string[] | undefined,
): Record<string, string> {
  const next = { ...(cookieJar ?? {}) }
  const pairs = parseSetCookieToPairs(setCookie)
  for (const [key, value] of pairs.entries()) next[key] = value
  return next
}

function serializeCookieJar(cookieJar?: Record<string, string>): string {
  return buildCookieHeader(
    new Map(
      Object.entries(cookieJar ?? {}).filter(([, value]) => value !== undefined && value !== ''),
    ),
  )
}

function makeAuthorization(account: string, authToken: string): string {
  return `Basic ${base64Encode(`pc:${account}:${authToken}`)}`
}

function commonHeaders(args: {
  data: unknown
  session?: PendingYunpanSession
  nationCode?: string
  includeAuthorization?: boolean
}): Record<string, string> {
  const timestamp = formatMcloudTimestamp()
  const nonce = randomString(8)
  const nationCode = normalizeNationCode(args.nationCode || args.session?.nationCode || '+86')
  const headers: Record<string, string> = {
    'CMS-CLIENT': CLIENT.cmsClient,
    'CMS-DEVICE': 'default',
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN',
    'x-DeviceInfo': deviceInfo(false),
    'x-yun-client-info': deviceInfo(true),
    'x-yun-app-channel': CLIENT.appChannel,
    'x-yun-api-version': 'v1',
    'x-yun-svc-type': '1',
    'x-SvcType': '1',
    'x-inner-ntwk': '2',
    'x-m4c-caller': 'PC',
    'x-m4c-src': '10002',
    'x-huawei-channelSrc': CLIENT.appChannel,
    'mcloud-route': '001',
    'mcloud-version': CLIENT.appVersion,
    'mcloud-channel': '1000101',
    'mcloud-client': CLIENT.mcloudClient,
    'x-Nationcode': nationCode,
    'Access-Control-Allow-Credentials': 'true',
    'INNER-HCY-ROUTER-HTTPS': '1',
    'mcloud-sign': `${timestamp},${nonce},${getNewSign(args.data, timestamp, nonce)}`,
    Origin: 'https://yun.139.com',
    Referer: 'https://yun.139.com/w/',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
  }
  if (args.includeAuthorization !== false && args.session?.authorization) {
    headers.Authorization = args.session.authorization
  }
  if (args.session?.secretKey) headers['mcloud-skey'] = args.session.secretKey
  const cookie = serializeCookieJar(args.session?.cookieJar)
  if (cookie) headers.Cookie = cookie
  return headers
}

async function requestJson(args: {
  url: string
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: unknown
  raw?: boolean
}): Promise<{
  statusCode: number
  headers: Record<string, string | string[] | undefined>
  data: unknown
  rawText: string
}> {
  const body =
    args.body === undefined
      ? undefined
      : typeof args.body === 'string'
        ? args.body
        : JSON.stringify(args.body)
  const res = await httpsRequestText({
    url: args.url,
    method: args.method ?? 'POST',
    headers: args.headers,
    body,
    timeoutMs: 12000,
  })
  return {
    statusCode: res.statusCode,
    headers: res.headers,
    data: args.raw ? res.bodyText : safeJson(res.bodyText),
    rawText: res.bodyText,
  }
}

async function ensureRsaAndAes(seed?: PendingYunpanSession): Promise<PendingYunpanSession> {
  let session: PendingYunpanSession = seed ? { ...seed } : {}
  if (!session.rsaPublicKey) {
    const body = { clientCode: CLIENT.mcloudClient, type: 1 }
    const headers = commonHeaders({ data: body, session, includeAuthorization: false })
    const res = await requestJson({
      url: 'https://yun.139.com/orchestration/auth-rebuild/key/v1.0/getRsaPublicKey',
      headers,
      body,
    })
    const obj = res.data as Record<string, unknown>
    const data = obj?.data as Record<string, unknown> | string | undefined
    const publicKey =
      typeof data === 'string'
        ? data
        : data && typeof data.publicKey === 'string'
          ? data.publicKey
          : ''
    if (!publicKey) throw new Error('获取云盘 RSA 公钥失败')
    session = {
      ...session,
      rsaPublicKey: publicKey,
      cookieJar: mergeCookieJar(session.cookieJar, res.headers['set-cookie']),
    }
  }
  const aesKey = session.aesKey || randomString(16)
  const secretKey =
    session.secretKey || rsaEncryptWithPublicKey(aesKey, session.rsaPublicKey || '')
  return { ...session, aesKey, secretKey } as PendingYunpanSession
}

function pickUpstreamMessage(data: unknown, fallback: string): string {
  if (looksLikeHtml(data)) return fallback
  if (!data || typeof data !== 'object') return fallback
  const obj = data as Record<string, unknown>
  return (
    (typeof obj.message === 'string' && obj.message) ||
    (typeof obj.msg === 'string' && obj.msg) ||
    fallback
  )
}

export function decodeYunpanSmsResponse(rawText: string): { response: Record<string, unknown>; encoding: string } {
  const parsed = safeJson(rawText)
  if (parsed && typeof parsed === 'object') return { response: parsed as Record<string, unknown>, encoding: 'json' }
  for (const [encoding, key] of [['sms-cbc', SMS_AES_KEY], ['legacy-cbc', USER_DOMAIN_AES_KEY]]) {
    try {
      const response = JSON.parse(aesCbcDecryptWithIvPrefix(typeof parsed === 'string' ? parsed : rawText, key))
      if (response && typeof response === 'object') return { response, encoding }
    } catch { /* Only accepted CBC/JSON responses can prove delivery. */ }
  }
  return { response: { success: false, code: 'SMS_RESPONSE_INVALID' }, encoding: 'unrecognized' }
}

export function buildYunpanSmsPayload(phone: string, nationCode: string, proof: string) {
  return { random: String(Date.now()) + crypto.randomInt(100000), additionalSpaceSelected: 1,
    clientType: '412', reqType: '3', nationCode, phoneNumber: phone,
    captchaType: 2, puzzleVerfycode: proof }
}

export async function yunpanSendSmsCode(args: {
  phone: string
  nationCode?: string
  puzzleVerifyCode?: string
}): Promise<SendYunpanSmsResult> {
  const phone = args.phone.trim()
  const nationCode = normalizeNationCode(args.nationCode || '+86')
  if (!args.puzzleVerifyCode || args.puzzleVerifyCode.length > 16384) {
    return { ok: false, message: '请先完成官方滑块验证' }
  }
  const payload = buildYunpanSmsPayload(phone, nationCode, args.puzzleVerifyCode)
  const headers = { 'Content-Type': 'application/json;charset=UTF-8', Accept: 'application/json, text/plain, */*',
    'hcy-cool-flag': '1', 'x-Nationcode': nationCode,
    'x-deviceinfo': deviceInfo(true), 'x-yun-client-info': deviceInfo(true),
    'x-yun-app-channel': CLIENT.appChannel, Origin: 'https://yun.139.com', Referer: 'https://yun.139.com/',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36' }
  const send = (key: string) => requestJson({
    url: 'https://user-njs.yun.139.com/user/sms/getSmsCode', headers,
    body: JSON.stringify(aesCbcEncryptWithIvPrefix(payload, key)), raw: true,
  })
  let res = await send(SMS_AES_KEY)
  let decoded = decodeYunpanSmsResponse(res.rawText)
  if (res.statusCode === 200 && decoded.encoding === 'legacy-cbc' &&
      decoded.response.success === false && String(decoded.response.code) === '01000019') {
    console.info('[yunpan-sms] crypto compatibility retry code=01000019')
    res = await send(USER_DOMAIN_AES_KEY)
    decoded = decodeYunpanSmsResponse(res.rawText)
  }
  const obj = decoded.response
  const success = res.statusCode === 200 && obj.success === true && ['0000', '0'].includes(String(obj.code))
  console.info('[yunpan-sms]', JSON.stringify({ httpStatus: res.statusCode, success, code: obj.code, encoding: decoded.encoding }))
  return { ok: success, status: res.statusCode,
    message: success ? undefined : pickUpstreamMessage(obj, '云盘验证码发送失败，请重新验证滑块'),
    cooldownSeconds: success ? 60 : undefined }
}

export async function yunpanLoginWithSmsOnly(args: {
  phone: string
  smsCode: string
  nationCode?: string
}): Promise<YunpanLoginResult> {
  const phone = args.phone.trim()
  const nationCode = normalizeNationCode(args.nationCode || '+86')
  const session = await ensureRsaAndAes()
  const loginPayload = {
    account: phone,
    dycPwd: args.smsCode.trim(),
    loginStyle: 'passSMS',
    ifOpenAccount: 1,
    verType: 2,
    clientEnv: '3',
    setCookie: 0,
  }
  const body = {
    encryptMsg: aesEcbEncrypt(JSON.stringify(loginPayload), session.aesKey || ''),
    returnToken: true,
    autoLogin: true,
  }
  const headers = commonHeaders({ data: body, session, nationCode, includeAuthorization: false })
  headers['mcloud-skey'] = session.secretKey || ''
  const res = await requestJson({
    url: 'https://yun.139.com/orchestration/auth-rebuild/permission/v1.0/login',
    headers,
    body,
  })
  const gatewayMessage = upstreamGatewayMessage(res.statusCode, res.data, '云盘登录失败')
  if (gatewayMessage) {
    return {
      ok: false,
      status: res.statusCode,
      message: gatewayMessage,
      upstreamResponse: res.data,
      rawTextSnippet: rawSnippet(res.rawText),
    }
  }
  const obj =
    res.data && typeof res.data === 'object' && !Array.isArray(res.data)
      ? (res.data as Record<string, unknown>)
      : {}
  const data = (obj?.data || {}) as Record<string, unknown>
  const encryptedAccount =
    typeof data.encryptAccount === 'string' ? data.encryptAccount : undefined
  const completeAccount = encryptedAccount ? base64Decode(encryptedAccount) : phone
  const account =
    typeof data.simplifyAccount === 'string' && data.simplifyAccount
      ? data.simplifyAccount
      : phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
  const token = typeof data.token === 'string' ? data.token : ''
  let authToken = typeof data.authToken === 'string' ? data.authToken : ''
  if (!authToken && token && session.aesKey) {
    try {
      authToken = aesEcbDecrypt(token, session.aesKey)
    } catch {
      authToken = ''
    }
  }
  const authorization = authToken ? makeAuthorization(completeAccount, authToken) : ''
  if (res.statusCode !== 200 || obj?.success !== true || !authToken || !authorization) {
    return {
      ok: false,
      status: res.statusCode,
      message: pickUpstreamMessage(res.data, '云盘登录失败'),
      upstreamResponse: res.data,
      rawTextSnippet: rawSnippet(res.rawText),
    }
  }
  const nextSession: YunpanSessionRecord = {
    account,
    completeAccount,
    nationCode,
    rsaPublicKey: session.rsaPublicKey,
    aesKey: session.aesKey,
    secretKey: session.secretKey,
    authToken,
    token,
    authorization,
    routerInfo: Array.isArray(data.routerInfo) ? (data.routerInfo as YunpanRouterInfo[]) : [],
    cookieJar: {
      ...mergeCookieJar(session.cookieJar, res.headers['set-cookie']),
      auth_token: authToken,
      token,
      authorization,
      NATION_CODE: nationCode.replace('+', ''),
    },
  }
  return { ok: true, status: res.statusCode, session: nextSession }
}

async function querySpecTokenV1(session: YunpanSessionRecord): Promise<SpecTokenQueryResult> {
  if (!session.authorization || !session.completeAccount) {
    return { ok: false, message: '缺少云盘授权信息，请重新云盘登录', session }
  }
  const payload = buildQuerySpecTokenV1Payload(session.completeAccount, DEFAULT_SOURCE_ID)
  const headers = commonHeaders({ data: payload, session, includeAuthorization: true })
  const res = await requestJson({
    url: 'https://yun.139.com/orchestration/auth-rebuild/token/v1.0/querySpecToken',
    headers,
    body: payload,
  })
  const obj = res.data as Record<string, unknown>
  const data = obj?.data as Record<string, unknown> | undefined
  const ssoToken =
    (data && typeof data.token === 'string' ? data.token : '') ||
    (typeof obj?.token === 'string' ? obj.token : '')
  const nextSession = {
    ...session,
    lastSsoToken: ssoToken || session.lastSsoToken,
    lastSsoSourceId: DEFAULT_SOURCE_ID,
    cookieJar: mergeCookieJar(session.cookieJar, res.headers['set-cookie']),
  }
  return {
    ok: Boolean(res.statusCode >= 200 && res.statusCode < 300 && ssoToken),
    status: res.statusCode,
    message: ssoToken ? undefined : pickUpstreamMessage(res.data, '获取 10086 ssoToken 失败'),
    ssoToken,
    diagnostic: buildSpecTokenDiagnostic(res.data, res.statusCode, 'v1'),
    session: nextSession,
  }
}

async function querySpecTokenV2(session: YunpanSessionRecord): Promise<SpecTokenQueryResult> {
  if (!session.authorization || !session.completeAccount) {
    return { ok: false, message: '缺少云盘授权信息，请重新云盘登录', session }
  }
  const payload = buildQuerySpecTokenV2Payload(session.completeAccount, DEFAULT_SOURCE_ID)
  const headers = commonHeaders({ data: payload, session, includeAuthorization: true })
  headers['hcy-cool-flag'] = '1'
  const encryptedBody = aesCbcEncryptWithIvPrefix(payload)
  const res = await requestJson({
    url: `${resolveUserDomainUrl(session.routerInfo)}/querySpecTokenV2`,
    headers,
    body: JSON.stringify(encryptedBody),
    raw: true,
  })
  let response: unknown = safeJson(res.rawText)
  try {
    response = safeJson(aesCbcDecryptWithIvPrefix(res.rawText))
  } catch {
    // Business and gateway errors may still be plaintext JSON.
  }
  const obj = response as Record<string, unknown>
  const data = obj?.data as Record<string, unknown> | undefined
  const ssoToken =
    (data && typeof data.token === 'string' ? data.token : '') ||
    (typeof obj?.token === 'string' ? obj.token : '')
  const nextSession = {
    ...session,
    lastSsoToken: ssoToken || session.lastSsoToken,
    lastSsoSourceId: DEFAULT_SOURCE_ID,
    cookieJar: mergeCookieJar(session.cookieJar, res.headers['set-cookie']),
  }
  return {
    ok: Boolean(res.statusCode >= 200 && res.statusCode < 300 && ssoToken),
    status: res.statusCode,
    message: ssoToken ? undefined : pickUpstreamMessage(response, '获取 10086 ssoToken 失败'),
    ssoToken,
    diagnostic: buildSpecTokenDiagnostic(response, res.statusCode, 'v2'),
    session: nextSession,
  }
}

async function querySpecToken(session: YunpanSessionRecord) {
  return resolveSpecTokenMode() === 'v2'
    ? querySpecTokenV2(session)
    : querySpecTokenV1(session)
}

export class YunpanAuthenticationExpired extends Error {
  constructor() { super('云盘 CK 已过期，需要补登'); this.name = 'YunpanAuthenticationExpired' }
}

export function isYunpanAuthenticationExpired(status: number, payload: unknown): boolean {
  // 1010010015 is the observed querySpecTokenV2 authentication-expired code.
  // HTTP 403 can also mean a target permission/risk rejection; do not label it expiry.
  return status === 401 || String((payload as { code?: unknown })?.code) === '1010010015'
}

export async function issueYunpanBusinessTicket(session: YunpanSessionRecord, sourceId: '001191' | '001216' | '017018') {
  if (!session.authorization) throw new Error('缺少云盘会话，请重新云盘登录')
  const headers = {
    'Content-Type': 'application/json; charset=utf-8', Accept: 'application/json',
    Origin: 'https://yun.139.com', Referer: 'https://yun.139.com/',
    'x-mm-source': '001', 'x-nettype': 'WIFI', Authorization: session.authorization,
  }
  const res = await requestJson({ url: `${resolveUserDomainUrl(session.routerInfo)}/querySpecTokenV2`,
    headers, body: { toSourceId: sourceId } })
  const obj = res.data as { success?: boolean; code?: string; data?: { token?: string; resultCode?: string }; token?: string }
  if (isYunpanAuthenticationExpired(res.statusCode, obj)) throw new YunpanAuthenticationExpired()
  const token = obj?.data?.token || obj?.token
  const accepted = res.statusCode === 200 && obj?.success === true &&
    (obj.code === undefined || ['0000', '0'].includes(String(obj.code))) &&
    (obj.data?.resultCode === undefined || String(obj.data.resultCode) === '104000')
  console.info('[yunpan-sso]', JSON.stringify({ sourceId, httpStatus: res.statusCode,
    success: accepted && !!token, code: obj?.code }))
  if (!accepted || typeof token !== 'string' || !token.trim() || token.length > 4096) {
    throw new Error('云盘未签发目标票据，请重新登录或检查目标权限')
  }
  return token
}

function buildSsoUrl(ssoToken: string): string {
  return DEFAULT_FLOW_SHOP_URL.replace(/#ssoToken#?/g, encodeURIComponent(ssoToken))
}

function makeWxCookieSeed(targetUrl: string): Record<string, string> {
  const clientId = crypto.randomUUID()
  const compactId = crypto.randomUUID().replace(/-/g, '')
  const gdpUserId = `gioenc-${compactId.slice(0, 8)}%2C${compactId.slice(8, 16)}`
  const sessionId = crypto.randomUUID()
  const now = Date.now()
  let lastUrl = '/website/spa/main/newHome'
  try {
    const url = new URL(targetUrl)
    lastUrl = encodeURIComponent(`${url.pathname}${url.search}`)
  } catch {
    // Keep the stable default when the URL is unexpectedly malformed.
  }
  const sensors = encodeURIComponent(
    JSON.stringify({
      distinct_id: clientId,
      first_id: '',
      props: {},
      identities: { $identity_cookie_id: clientId },
      history_login_id: { name: '', value: '' },
      $device_id: clientId,
    }),
  )
  return {
    _zw_kvani5r: crypto.randomBytes(36).toString('hex'),
    clientId,
    gdp_user_id: gdpUserId,
    CmLocation: '100|100',
    CmProvid: 'bj',
    '9e4e5fa7244c6b6e_gdp_user_key': '',
    verifyCode: crypto.randomBytes(20).toString('hex'),
    WT_FPC: `id=${compactId}:lv=${now}:ss=${now}`,
    '9e4e5fa7244c6b6e_gdp_cs1': gdpUserId,
    '9e4e5fa7244c6b6e_gdp_gio_id': gdpUserId,
    '9e4e5fa7244c6b6e_gdp_session_id_sent': sessionId,
    '9e4e5fa7244c6b6e_gdp_sequence_ids': encodeURIComponent(
      JSON.stringify({ globalKey: 1, VISIT: 1, PAGE: 1 }),
    ),
    sensorsdata2015jssdkcross: sensors,
    lastUrl,
  }
}

function is10086Host(hostname: string): boolean {
  return /(\.|^)10086\.cn$/i.test(hostname)
}

function decryptWxResponse(parsed: unknown): Record<string, unknown> | undefined {
  if (!parsed) return undefined
  const body =
    typeof parsed === 'string'
      ? parsed
      : typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>).body
        : undefined
  if (typeof body !== 'string') return undefined
  try {
    const decrypted = safeJson(wxAesDecryptHex(body))
    if (!decrypted || typeof decrypted !== 'object' || Array.isArray(decrypted)) return undefined
    return decrypted as Record<string, unknown>
  } catch {
    return undefined
  }
}

async function requestWxUserAuth(targetUrl: string, cookieJar: Record<string, string>): Promise<{
  ok: boolean
  status?: number
  token?: string
  cookieJar: Record<string, string>
  message?: string
}> {
  const target = new URL(targetUrl)
  const backUrl = `${target.pathname}${target.search}`
  const secondChannel = target.searchParams.get('secondChannel') || 'P00000116110'
  const encryptedBody = wxAesEncryptHex(JSON.stringify({ backUrl }))
  const headers: Record<string, string> = {
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    'Content-Type': 'application/json; charset=UTF-8',
    Origin: 'https://wx.10086.cn',
    Referer: targetUrl,
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
    channelid: 'BUSINESS_H5',
    'chop-real-host': 'wx.10086.cn',
    pageType: 'xds17',
    'x-app-version': '1.0.1',
    'Chop-Second-Channel': secondChannel,
  }
  const cookie = serializeCookieJar(cookieJar)
  if (cookie) headers.Cookie = cookie
  const res = await requestJson({
    url: 'https://wx.10086.cn/website/nrapigate/nrauth/auth/encryt/userAuth',
    headers,
    body: encryptedBody,
  })
  const nextCookieJar = mergeCookieJar(cookieJar, res.headers['set-cookie'])
  const decrypted = decryptWxResponse(res.data)
  const data = decrypted?.data as Record<string, unknown> | undefined
  const token = data && typeof data.token === 'string' ? data.token : ''
  return {
    ok: res.statusCode >= 200 && res.statusCode < 300 && Boolean(token),
    status: res.statusCode,
    token,
    cookieJar: nextCookieJar,
    message: token ? undefined : pickUpstreamMessage(decrypted || res.data, '10086 授权失败'),
  }
}

export async function collect10086CookieByYunpanSession(
  seedSession: YunpanSessionRecord,
): Promise<YunpanLoginResult> {
  const tokenResult = await querySpecToken(seedSession)
  if (!tokenResult.ok || !tokenResult.ssoToken) {
    return {
      ok: false,
      status: tokenResult.status,
      message: tokenResult.message || '获取 10086 ssoToken 失败',
      upstreamResponse: tokenResult.diagnostic,
      session: tokenResult.session,
    }
  }
  const ssoUrl = buildSsoUrl(tokenResult.ssoToken)
  const parsed = new URL(ssoUrl)
  if (!is10086Host(parsed.hostname)) {
    return { ok: false, message: '10086 跳转地址不合法', session: tokenResult.session }
  }

  let cookieJar: Record<string, string> = makeWxCookieSeed(ssoUrl)
  const firstHeaders: Record<string, string> = {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent':
      'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36',
    Cookie: serializeCookieJar(cookieJar),
  }
  const first = await requestJson({
    url: ssoUrl,
    method: 'GET',
    headers: firstHeaders,
    raw: true,
  })
  cookieJar = mergeCookieJar(cookieJar, first.headers['set-cookie'])
  const userAuth = await requestWxUserAuth(ssoUrl, cookieJar)
  cookieJar = userAuth.cookieJar
  const wxCookie = serializeCookieJar(cookieJar)
  const hasShareToken = Boolean(cookieJar.shareToken)
  const session: YunpanSessionRecord = {
    ...tokenResult.session,
    lastSsoToken: tokenResult.ssoToken,
    lastWxAuthToken: userAuth.token || tokenResult.session.lastWxAuthToken,
  }
  return {
    ok: Boolean(userAuth.ok && hasShareToken),
    status: userAuth.status,
    message: userAuth.ok && !hasShareToken ? '10086 授权成功但未下发 shareToken' : userAuth.message,
    session,
    ssoToken: tokenResult.ssoToken,
    ssoUrl,
    wxCookie,
    wxCookieNames: Object.keys(cookieJar),
    wxAuthToken: userAuth.token,
  }
}

export async function build10086SsoLinkByYunpanSession(
  seedSession: YunpanSessionRecord,
): Promise<YunpanLoginResult> {
  const tokenResult = await querySpecToken(seedSession)
  if (!tokenResult.ok || !tokenResult.ssoToken) {
    return {
      ok: false,
      status: tokenResult.status,
      message: tokenResult.message || '获取 10086 ssoToken 失败',
      upstreamResponse: tokenResult.diagnostic,
      session: tokenResult.session,
    }
  }
  const ssoUrl = buildSsoUrl(tokenResult.ssoToken)
  const parsed = new URL(ssoUrl)
  if (!is10086Host(parsed.hostname)) {
    return { ok: false, message: '10086 跳转地址不合法', session: tokenResult.session }
  }
  return {
    ok: true,
    status: tokenResult.status,
    session: {
      ...tokenResult.session,
      lastSsoToken: tokenResult.ssoToken,
    },
    ssoToken: tokenResult.ssoToken,
    ssoUrl,
  }
}

export async function yunpanLoginAndCollect10086Cookie(args: {
  phone: string
  smsCode: string
  nationCode?: string
}): Promise<YunpanLoginResult> {
  const login = await yunpanLoginWithSmsOnly(args)
  if (!login.ok || !login.session) return login
  return collect10086CookieByYunpanSession(login.session)
}

export const YUNPAN_10086_FLOW_SHOP_URL = DEFAULT_FLOW_SHOP_URL

export const __test__ = {
  buildSpecTokenDiagnostic,
  buildQuerySpecTokenV1Payload,
  buildQuerySpecTokenV2Payload,
  requireSourceId,
  resolveSpecTokenMode,
  resolveUserDomainUrl,
}

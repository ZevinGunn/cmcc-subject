import crypto from 'node:crypto'
import { httpsRequestText, type HttpResponse } from './cmccHttp.js'
import { buildCookieHeader, mergeCookieWithSetCookie, parseCookieHeader } from './cookieUtils.js'

const PORTAL_ORIGIN = 'https://service.bj.10086.cn'
const DEFAULT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'
const MAX_WAF_REDIRECTS = 4
const BOOTSTRAP_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2N7RVdbGQZqR/f74gz3m7SIRwJB3VsqWUT2VoGfCabPTAO7/D5YyYvxWr6OisJCoy3EM0xksFaTfMWyre0X/BURj7eC6DNJNRKmNyw2rx3O1N3HMcKYE3tPtEtZhpZLveigUPHmKpaRVvL51wAGmMGwP85Sh+h+NWl95+GgcslhoZ4wYIG+JVJ0DbGKtprXeRWmEQ+aLd8lT06zQ+R+6KstkTdn8MSotx3/zt827i5gUYUaZ4pUd9I8q/r6miLR1baNfEVA7F1nNAXoc+a/RpkFscT/+myCqDtk9dbc96Xgxm+MDP9kClOuECCDt62NA7+9HHzWL0+NWIuCkZFHXCwIDAQAB
-----END PUBLIC KEY-----`

export type BroadbandPortalSession = {
  cookie: string
  accessToken?: string
  portalKey?: string
  dataToken?: string
  replayVersion: number
  wafToken?: string
  referer: string
}

export type BroadbandPortalResult = {
  ok: boolean
  status: number
  data?: unknown
  raw?: unknown
  message?: string
  contentType?: string
  bodyBuffer?: Buffer
}

function randomPortalKey(): string {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const bytes = crypto.randomBytes(16)
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')
}

function aesEcbEncrypt(text: string, key: string): string {
  const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(key, 'utf8'), null)
  return Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]).toString('base64')
}

function aesEcbDecrypt(cipherText: string, key: string): string {
  const decipher = crypto.createDecipheriv('aes-128-ecb', Buffer.from(key, 'utf8'), null)
  return Buffer.concat([decipher.update(cipherText, 'base64'), decipher.final()]).toString('utf8')
}

function encryptPortalBody(value: unknown, key: string): string {
  return encodeURIComponent(aesEcbEncrypt(JSON.stringify(value), key))
}

function decryptPortalBody(value: unknown, key: string): unknown {
  const raw = typeof value === 'string' ? value : JSON.stringify(value)
  const decoded = decodeURIComponent(raw.replace(/^"|"$/g, ''))
  return JSON.parse(aesEcbDecrypt(decoded, key)) as unknown
}

function publicKeyPem(value: string): string {
  const compact = value.replace(/\s+/g, '')
  const lines = compact.match(/.{1,64}/g)?.join('\n') || compact
  return `-----BEGIN PUBLIC KEY-----\n${lines}\n-----END PUBLIC KEY-----`
}

function decodeBootstrapPayload(value: unknown): unknown {
  const text = String(value || '').trim()
  if (!text) return undefined
  try {
    const plain = crypto.publicDecrypt(
      { key: BOOTSTRAP_PUBLIC_KEY, padding: crypto.constants.RSA_PKCS1_PADDING },
      Buffer.from(text, 'base64'),
    ).toString('utf8')
    try {
      return JSON.parse(plain) as unknown
    } catch {
      return plain
    }
  } catch {
    try {
      return JSON.parse(text) as unknown
    } catch {
      return undefined
    }
  }
}

function record(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined
}

function valueAt(value: unknown, keys: string[]): unknown {
  const source = record(value)
  for (const key of keys) {
    const candidate = source?.[key]
    if (candidate !== undefined && candidate !== null && candidate !== '') return candidate
  }
  return undefined
}

function readWafToken(value: string | undefined): string {
  if (!value) return ''
  try {
    return new URL(value, PORTAL_ORIGIN).searchParams.get('XEbtxIBt') || ''
  } catch {
    return value.match(/[?&]XEbtxIBt=([^&"'\s]+)/)?.[1] || ''
  }
}

function mergeResponseCookie(session: BroadbandPortalSession, response: HttpResponse): void {
  session.cookie = mergeCookieWithSetCookie({
    cookie: session.cookie,
    setCookie: response.headers['set-cookie'],
  }).cookie
}

function portalHeaders(session: BroadbandPortalSession, extra: Record<string, string> = {}): Record<string, string> {
  const traceContext = crypto.randomBytes(16).toString('hex')
  const spanId = crypto.randomBytes(8).toString('hex')
  return {
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Content-Type': 'application/json;charset=UTF-8',
    Origin: PORTAL_ORIGIN,
    Referer: session.referer,
    'User-Agent': DEFAULT_UA,
    Cookie: session.cookie,
    ...(session.accessToken ? { Authorization: `bearer ${session.accessToken}` } : {}),
    traceId: crypto.randomUUID().replace(/-/g, ''),
    traceContext,
    traceparent: `00-${traceContext}-${spanId}-01`,
    ...(session.wafToken ? { XEbtxIBt: session.wafToken } : {}),
    ...extra,
  }
}

async function rawRequest(session: BroadbandPortalSession, args: {
  method: 'GET' | 'POST'
  pathOrUrl: string
  body?: string
  headers?: Record<string, string>
}): Promise<HttpResponse> {
  const url = args.pathOrUrl.startsWith('http')
    ? args.pathOrUrl
    : new URL(args.pathOrUrl, PORTAL_ORIGIN).toString()
  const response = await httpsRequestText({
    url,
    method: args.method,
    headers: { ...portalHeaders(session), ...args.headers },
    body: args.body,
    timeoutMs: 20_000,
  })
  mergeResponseCookie(session, response)
  return response
}

export function createBroadbandPortalSession(
  cookie: string,
  flow: 'install' | 'renewal',
  accessToken?: string,
  refererPath?: string,
): BroadbandPortalSession {
  return {
    cookie: buildCookieHeader(parseCookieHeader(cookie)),
    accessToken: accessToken?.trim() || undefined,
    replayVersion: 0,
    referer: new URL(
      refererPath || `/nwt/portal/${flow === 'install' ? 'kdzq' : 'bbRenewValidate?isReslt=1'}`,
      PORTAL_ORIGIN,
    ).toString(),
  }
}

export async function ensureBroadbandWaf(session: BroadbandPortalSession): Promise<void> {
  if (session.wafToken) return
  let url = session.referer
  for (let index = 0; index < MAX_WAF_REDIRECTS; index += 1) {
    const response = await rawRequest(session, {
      method: 'GET',
      pathOrUrl: url,
      headers: { Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
    })
    const location = Array.isArray(response.headers.location)
      ? response.headers.location[0]
      : response.headers.location
    const token = readWafToken(location) || readWafToken(response.bodyText)
    if (token) {
      try {
        session.wafToken = decodeURIComponent(token)
      } catch {
        session.wafToken = token
      }
    }
    if (!(response.statusCode >= 300 && response.statusCode < 400) || !location) break
    url = new URL(location, url).toString()
  }
}

export async function initBroadbandPortalKey(session: BroadbandPortalSession): Promise<void> {
  await ensureBroadbandWaf(session)
  const url = new URL('/nwt/portal-bff/api/keys/v1.0/get', PORTAL_ORIGIN)
  if (session.wafToken) url.searchParams.set('XEbtxIBt', session.wafToken)
  const response = await rawRequest(session, { method: 'POST', pathOrUrl: url.toString(), body: '' })
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`PORTAL_KEY_HTTP_${response.statusCode}`)
  }
  let payload: unknown
  try {
    payload = JSON.parse(response.bodyText) as unknown
  } catch {
    payload = response.bodyText
  }
  const root = record(payload)
  const decoded = decodeBootstrapPayload(valueAt(root, ['data', 'result']) ?? payload)
  const serverKey = valueAt(decoded, ['publicKey', 'pubKey', 'key', 'data']) ?? decoded
  const portalKey = randomPortalKey()
  let dataToken = String(valueAt(root, ['token', 'dataToken']) || '')
  if (serverKey) {
    dataToken = crypto.publicEncrypt(
      { key: String(serverKey).includes('BEGIN PUBLIC KEY') ? String(serverKey) : publicKeyPem(String(serverKey)), padding: crypto.constants.RSA_PKCS1_PADDING },
      Buffer.from(portalKey, 'utf8'),
    ).toString('base64')
  }
  session.portalKey = portalKey
  session.dataToken = dataToken
  session.replayVersion = 0
}

function appendWaf(path: string, token?: string): string {
  if (!token) return path
  return `${path}${path.includes('?') ? '&' : '?'}XEbtxIBt=${encodeURIComponent(token)}`
}

function queryString(values: Record<string, unknown>): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== null && String(value) !== '') query.set(key, String(value))
  }
  return query.toString()
}

export async function broadbandPortalRequest(session: BroadbandPortalSession, args: {
  method: 'GET' | 'POST'
  path: string
  data?: Record<string, unknown>
  params?: Record<string, unknown>
  clearQuery?: Record<string, unknown>
  binary?: boolean
}): Promise<BroadbandPortalResult> {
  if (!session.portalKey || !session.dataToken) await initBroadbandPortalKey(session)
  const key = session.portalKey as string
  let path = args.path
  const clear = queryString(args.clearQuery || {})
  if (clear) path += `${path.includes('?') ? '&' : '?'}${clear}`
  if (args.params && Object.keys(args.params).length) {
    const encrypted = encodeURIComponent(aesEcbEncrypt(queryString(args.params), key))
    path += `${path.includes('?') ? '&' : '?'}p=${encrypted}`
  }
  path = appendWaf(path, session.wafToken)
  const response = await rawRequest(session, {
    method: args.method,
    pathOrUrl: `/nwt${path}`,
    body: args.method === 'POST' ? JSON.stringify(encryptPortalBody(args.data || {}, key)) : undefined,
    headers: {
      'X-DATA-TOKEN': session.dataToken || '',
      'X-REPLAY-VERSION': aesEcbEncrypt(String(session.replayVersion++), key),
    },
  })
  if (args.binary) {
    return {
      ok: response.statusCode >= 200 && response.statusCode < 300,
      status: response.statusCode,
      contentType: String(response.headers['content-type'] || 'application/octet-stream'),
      bodyBuffer: response.bodyBuffer,
    }
  }
  let raw: unknown = response.bodyText
  try {
    raw = JSON.parse(response.bodyText) as unknown
  } catch {
    // Encrypted bodies are JSON strings and are handled below.
  }
  let parsed: unknown = raw
  try {
    parsed = decryptPortalBody(raw, key)
  } catch {
    // Some public endpoints return plain JSON.
  }
  const parsedRecord = record(parsed)
  return {
    ok: response.statusCode >= 200 && response.statusCode < 300,
    status: response.statusCode,
    data: parsedRecord && Object.prototype.hasOwnProperty.call(parsedRecord, 'data') ? parsedRecord.data : parsed,
    raw: parsed,
    message: typeof parsedRecord?.message === 'string' ? parsedRecord.message : undefined,
  }
}

export const __test__ = {
  aesEcbDecrypt,
  aesEcbEncrypt,
  createBroadbandPortalSession,
  decodeBootstrapPayload,
  queryString,
  readWafToken,
}

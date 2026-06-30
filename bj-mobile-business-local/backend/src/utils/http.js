import axios from 'axios'
import http from 'node:http'
import https from 'node:https'
import { setDefaultResultOrder } from 'node:dns'
import { getCookieHeader, setCookiesFromResponse } from './cookieJar.js'
import { createRequestId, logEvent, sanitize } from './logger.js'

try {
  setDefaultResultOrder('ipv4first')
} catch {
  // Older Node builds may not support this; requests still work without it.
}

const httpAgent = new http.Agent({ keepAlive: false })
const httpsAgent = new https.Agent({ keepAlive: false, maxCachedSessions: 0 })
const RETRYABLE_CODES = new Set(['ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN', 'ENOTFOUND', 'ECONNABORTED'])
const RETRYABLE_MESSAGES = ['Client network socket disconnected before secure TLS connection was established']

export async function requestWithJar({
  jar,
  url,
  method = 'GET',
  headers = {},
  data,
  responseType = 'text',
  includeCookies = true,
  timeout = 30000,
  maxAttempts = 3,
}) {
  const cookie = includeCookies && jar ? await getCookieHeader(jar, url) : ''
  const requestId = createRequestId()
  const startedAt = Date.now()
  await logEvent('external:request', {
    requestId,
    method,
    url,
    headers: {
      ...headers,
      Cookie: cookie ? `[COOKIE len=${cookie.length}]` : '',
    },
    data: summarizePayload(data),
    responseType,
    includeCookies,
    timeout,
    maxAttempts,
  })
  const res = await requestWithRetry({
    requestId,
    startedAt,
    maxAttempts,
    axiosConfig: {
      url,
      method,
      headers: {
        Connection: 'close',
        ...headers,
        ...(cookie ? { Cookie: cookie } : {}),
      },
      data,
      responseType,
      timeout,
      httpAgent,
      httpsAgent,
      proxy: false,
      maxRedirects: 0,
      validateStatus: () => true,
      transformResponse: [(value) => value],
    },
  })
  if (jar) await setCookiesFromResponse(jar, url, res.headers)
  await logEvent('external:response', {
    requestId,
    method,
    url,
    status: res.status,
    durationMs: Date.now() - startedAt,
    headers: {
      location: res.headers?.location || '',
      contentType: res.headers?.['content-type'] || '',
      setCookieCount: Array.isArray(res.headers?.['set-cookie']) ? res.headers['set-cookie'].length : res.headers?.['set-cookie'] ? 1 : 0,
    },
    data: summarizePayload(res.data),
  })
  return res
}

async function requestWithRetry({ requestId, startedAt, axiosConfig, maxAttempts }) {
  let lastError
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      if (attempt > 1) await sleep(400 * attempt)
      return await axios.request(axiosConfig)
    } catch (error) {
      lastError = error
      await logEvent('external:error', {
        requestId,
        attempt,
        maxAttempts,
        method: axiosConfig.method,
        url: axiosConfig.url,
        durationMs: Date.now() - startedAt,
        code: error?.code || '',
        message: error instanceof Error ? error.message : String(error),
      })
      if (attempt >= maxAttempts || !isRetryableNetworkError(error)) break
    }
  }
  throw lastError
}

function isRetryableNetworkError(error) {
  const message = error instanceof Error ? error.message : String(error || '')
  return RETRYABLE_CODES.has(error?.code) || RETRYABLE_MESSAGES.some((item) => message.includes(item))
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function summarizePayload(value) {
  if (Buffer.isBuffer(value)) return `[Buffer len=${value.length}]`
  if (value instanceof ArrayBuffer) return `[ArrayBuffer len=${value.byteLength}]`
  if (typeof value === 'string') return value.length > 1000 ? `${value.slice(0, 1000)}...[TRUNCATED len=${value.length}]` : sanitize(value)
  if (value === undefined) return undefined
  return sanitize(value)
}

export function normalizeBase64Maybe(text) {
  const raw = String(text || '').trim()
  if (!raw) return ''
  if (raw === 'true' || raw === 'false' || /^-?\d+$/.test(raw)) return raw
  if (raw.startsWith('{') || raw.startsWith('[') || raw.startsWith('"')) return raw
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(raw) || raw.length % 4 !== 0) return raw
  try {
    const decoded = Buffer.from(raw, 'base64').toString('utf8')
    return decoded.includes('\uFFFD') ? raw : decoded
  } catch {
    return raw
  }
}

export function parseJsonMaybeBase64(text) {
  const raw = String(text || '').trim()
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    const decoded = normalizeBase64Maybe(raw)
    return JSON.parse(decoded)
  }
}

export function encodeForm(data) {
  return new URLSearchParams(data).toString()
}

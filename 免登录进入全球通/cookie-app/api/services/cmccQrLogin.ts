import crypto from 'node:crypto'

const LOGIN_ORIGIN = 'https://login.10086.cn'
const WX_ORIGIN = 'https://wx.10086.cn'
const DEFAULT_CHANNEL_ID = '12028'
const DEFAULT_BACK_URL = 'https://wx.10086.cn/website/spa/main/newHome'
const FLOW_TTL_MS = 5 * 60 * 1000
const MAX_REDIRECTS = 8

type FlowStatus = 'pending' | 'success' | 'expired'

type QrFlow = {
  flowId: string
  channelId: string
  backUrl: string
  lgToken: string
  cookieMap: Map<string, string>
  createdAt: number
  expiresAt: number
  status: FlowStatus
  message: string
  finalUrl?: string
  newHome?: {
    status: number
    ok: boolean
    cookieNames: string[]
  }
}

const flows = new Map<string, QrFlow>()

function cleanupFlows(): void {
  const t = Date.now()
  for (const [id, flow] of flows.entries()) {
    if (flow.expiresAt <= t) flows.delete(id)
  }
}

function splitSetCookieHeader(headerValue: string | null): string[] {
  if (!headerValue) return []
  return String(headerValue)
    .split(/,(?=\s*[^;,=\s]+=[^;,]+)/g)
    .map((item) => item.trim())
    .filter(Boolean)
}

function getSetCookieList(headers: Headers): string[] {
  const maybe = headers as Headers & { getSetCookie?: () => string[] }
  if (typeof maybe.getSetCookie === 'function') return maybe.getSetCookie()
  return splitSetCookieHeader(headers.get('set-cookie'))
}

function mergeSetCookie(cookieMap: Map<string, string>, setCookieHeaders: string[]): void {
  for (const item of setCookieHeaders) {
    const pair = String(item || '').split(';', 1)[0]?.trim() ?? ''
    const idx = pair.indexOf('=')
    if (idx <= 0) continue
    cookieMap.set(pair.slice(0, idx), pair.slice(idx + 1))
  }
}

function cookieHeader(cookieMap: Map<string, string>): string {
  return [...cookieMap.entries()].map(([k, v]) => `${k}=${v}`).join('; ')
}

function cookieNames(cookieMap: Map<string, string>): string[] {
  return [...cookieMap.keys()].sort()
}

function redactUrl(raw?: string): string {
  if (!raw) return ''
  try {
    const url = new URL(raw)
    for (const key of Array.from(url.searchParams.keys())) {
      url.searchParams.set(key, '<redacted>')
    }
    return url.toString()
  } catch {
    return ''
  }
}

function decodePossiblyEncodedUrl(value: string): string {
  let out = value
  for (let i = 0; i < 3; i += 1) {
    try {
      const next = decodeURIComponent(out)
      if (next === out) break
      out = next
    } catch {
      break
    }
  }
  return out
}

function normalizeBackUrl(backUrl?: string): string {
  const candidate = decodePossiblyEncodedUrl(String(backUrl || DEFAULT_BACK_URL))
  try {
    const url = new URL(candidate)
    if (!['https:', 'http:'].includes(url.protocol)) return DEFAULT_BACK_URL
    if (!url.hostname.endsWith('10086.cn')) return DEFAULT_BACK_URL
    return url.toString()
  } catch {
    return DEFAULT_BACK_URL
  }
}

function getFlow(flowId: string): QrFlow {
  cleanupFlows()
  const flow = flows.get(flowId)
  if (!flow) throw new Error('扫码会话不存在或已过期，请重新生成二维码')
  return flow
}

function baseHeaders(): Record<string, string> {
  return {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  }
}

async function fetchTextWithCookies(
  url: string,
  options: RequestInit,
  cookieMap: Map<string, string>,
): Promise<{ response: Response; text: string }> {
  const headers = new Headers(options.headers)
  for (const [k, v] of Object.entries(baseHeaders())) {
    if (!headers.has(k)) headers.set(k, v)
  }
  const cookies = cookieHeader(cookieMap)
  if (cookies) headers.set('Cookie', cookies)
  const response = await fetch(url, {
    ...options,
    headers,
    redirect: 'manual',
  })
  mergeSetCookie(cookieMap, getSetCookieList(response.headers))
  return { response, text: await response.text().catch(() => '') }
}

async function followRedirects(startUrl: string, cookieMap: Map<string, string>): Promise<{ finalUrl: string; status: number }> {
  let current = startUrl
  for (let i = 0; i < MAX_REDIRECTS; i += 1) {
    const { response } = await fetchTextWithCookies(
      current,
      {
        method: 'GET',
        headers: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          Referer: current,
        },
      },
      cookieMap,
    )
    const location = response.headers.get('location')
    if (response.status < 300 || response.status >= 400 || !location) {
      return { finalUrl: current, status: response.status }
    }
    current = new URL(location, current).toString()
  }
  return { finalUrl: current, status: 0 }
}

function buildAssertUrl(data: Record<string, unknown>, flow: QrFlow): string {
  const assertUrl =
    typeof data.assertUrl === 'string' && data.assertUrl
      ? data.assertUrl
      : 'https://wx.10086.cn/website/spa/complaint/list'
  const url = new URL(assertUrl, WX_ORIGIN)
  url.searchParams.set('backUrl', flow.backUrl)
  url.searchParams.set('artifact', typeof data.artifact === 'string' ? data.artifact : '')
  return url.toString()
}

async function refreshNewHome(cookieMap: Map<string, string>): Promise<QrFlow['newHome']> {
  const { response } = await fetchTextWithCookies(
    DEFAULT_BACK_URL,
    {
      method: 'GET',
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        Referer: DEFAULT_BACK_URL,
      },
    },
    cookieMap,
  )
  return {
    status: response.status,
    ok: response.status >= 200 && response.status < 400,
    cookieNames: cookieNames(cookieMap),
  }
}

export async function createCmccQrLoginFlow(options?: {
  channelId?: string
  backUrl?: string
}): Promise<{
  flowId: string
  expiresInSeconds: number
  qrImage: string
  cookieNames: string[]
  backUrl: string
}> {
  cleanupFlows()
  const channelId = String(options?.channelId || DEFAULT_CHANNEL_ID).trim() || DEFAULT_CHANNEL_ID
  const backUrl = normalizeBackUrl(options?.backUrl)
  const flowId = crypto.randomUUID()
  const cookieMap = new Map<string, string>()
  const qrUrl = `${LOGIN_ORIGIN}/genqr.htm?timestamp=${Date.now()}`
  const response = await fetch(qrUrl, {
    headers: {
      ...baseHeaders(),
      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      Referer: `${LOGIN_ORIGIN}/?channelID=${encodeURIComponent(channelId)}&backUrl=${encodeURIComponent(backUrl)}`,
    },
  })
  mergeSetCookie(cookieMap, getSetCookieList(response.headers))
  const imageBuffer = Buffer.from(await response.arrayBuffer())
  const lgToken = cookieMap.get('lgToken') || ''
  if (!response.ok || !imageBuffer.length || !lgToken) {
    throw new Error('二维码生成失败，未获取到 lgToken')
  }
  flows.set(flowId, {
    flowId,
    channelId,
    backUrl,
    lgToken,
    cookieMap,
    createdAt: Date.now(),
    expiresAt: Date.now() + FLOW_TTL_MS,
    status: 'pending',
    message: '等待扫码',
  })
  return {
    flowId,
    expiresInSeconds: Math.floor(FLOW_TTL_MS / 1000),
    qrImage: `data:image/png;base64,${imageBuffer.toString('base64')}`,
    cookieNames: cookieNames(cookieMap),
    backUrl: redactUrl(backUrl),
  }
}

export async function pollCmccQrLoginFlow(flowId: string): Promise<{
  flowId: string
  status: FlowStatus
  message: string
  cookieNames: string[]
  cookieLength: number
  finalUrl?: string
  expiresInSeconds: number
}> {
  const flow = getFlow(flowId)
  if (flow.status === 'success' || flow.status === 'expired') return summarizeFlow(flow)
  const body = new URLSearchParams({
    lgToken: flow.lgToken,
    targetChannelID: flow.channelId,
    backUrl: encodeURIComponent(flow.backUrl),
  }).toString()
  const { response, text } = await fetchTextWithCookies(
    `${LOGIN_ORIGIN}/chkqr.htm`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Accept: 'application/json, text/javascript, */*; q=0.01',
        Origin: LOGIN_ORIGIN,
        Referer: `${LOGIN_ORIGIN}/?channelID=${encodeURIComponent(flow.channelId)}&backUrl=${encodeURIComponent(flow.backUrl)}`,
        'X-Requested-With': 'XMLHttpRequest',
      },
      body,
    },
    flow.cookieMap,
  )
  const trimmed = text.trim()
  if (!trimmed) {
    flow.message = response.status === 200 ? '等待 App 扫码确认' : `轮询状态异常(${response.status})`
    return summarizeFlow(flow)
  }
  let data: Record<string, unknown>
  try {
    data = JSON.parse(trimmed) as Record<string, unknown>
  } catch {
    flow.message = '轮询返回不是 JSON'
    return summarizeFlow(flow)
  }
  if (data.resultCode === '0000') {
    const redirect = await followRedirects(buildAssertUrl(data, flow), flow.cookieMap)
    flow.newHome = await refreshNewHome(flow.cookieMap)
    flow.status = 'success'
    flow.message = '扫码确认成功，已换取 Cookie'
    flow.finalUrl = redirect.finalUrl
    return summarizeFlow(flow)
  }
  if (data.resultCode === '8020') {
    flow.status = 'expired'
    flow.message = '二维码已失效，请刷新二维码'
    return summarizeFlow(flow)
  }
  flow.message =
    (typeof data.resultMsg === 'string' && data.resultMsg) ||
    (typeof data.message === 'string' && data.message) ||
    `等待扫码确认(${String(data.resultCode || 'pending')})`
  return summarizeFlow(flow)
}

export function consumeCmccQrLoginCookie(flowId: string): {
  cookie: string
  cookieNames: string[]
  cookieLength: number
} {
  const flow = getFlow(flowId)
  if (flow.status !== 'success') throw new Error('扫码尚未成功，暂无可用 Cookie')
  return {
    cookie: cookieHeader(flow.cookieMap),
    cookieNames: cookieNames(flow.cookieMap),
    cookieLength: cookieHeader(flow.cookieMap).length,
  }
}

function summarizeFlow(flow: QrFlow): {
  flowId: string
  status: FlowStatus
  message: string
  cookieNames: string[]
  cookieLength: number
  finalUrl?: string
  expiresInSeconds: number
} {
  return {
    flowId: flow.flowId,
    status: flow.status,
    message: flow.message,
    cookieNames: cookieNames(flow.cookieMap),
    cookieLength: cookieHeader(flow.cookieMap).length,
    finalUrl: redactUrl(flow.finalUrl),
    expiresInSeconds: Math.max(0, Math.floor((flow.expiresAt - Date.now()) / 1000)),
  }
}

import { mergeCookieWithSetCookie } from './cookieUtils.js'

type HarHeader = {
  name?: string
  value?: string
}

type HarCookie = {
  name?: string
  value?: string
}

type HarEntry = {
  request?: {
    url?: string
    headers?: HarHeader[]
    cookies?: HarCookie[]
  }
  response?: {
    headers?: HarHeader[]
  }
}

const TARGET_PATH = '/website/spa/main/newHome'

const SKIP_HEADERS = new Set([
  'cookie',
  'host',
  'content-length',
  ':authority',
  ':method',
  ':path',
  ':scheme',
  'connection',
])

function normalizeHarText(raw: string): string {
  const text = raw.trim()
  return text.replace(/^\uFEFF/, '')
}

function buildCookieFromList(list: HarCookie[] | undefined): string {
  if (!Array.isArray(list)) return ''
  const parts: string[] = []
  for (const item of list) {
    const name = typeof item?.name === 'string' ? item.name.trim() : ''
    const value = typeof item?.value === 'string' ? item.value.trim() : ''
    if (!name || !value) continue
    parts.push(`${name}=${value}`)
  }
  return parts.join('; ')
}

function parseSetCookieHeaders(list: HarHeader[] | undefined): string[] {
  if (!Array.isArray(list)) return []
  return list
    .filter((item) => item && typeof item.name === 'string' && item.name.toLowerCase() === 'set-cookie')
    .map((item) => (typeof item.value === 'string' ? item.value : ''))
    .filter(Boolean)
}

export function parseHarForCmccNewHome(args: {
  harText: string
}): {
  cookie: string
  headers: Record<string, string>
  newHomeUrl: string
} {
  if (!args.harText || typeof args.harText !== 'string') {
    throw new Error('EMPTY_HAR')
  }

  const normalized = normalizeHarText(args.harText)
  let parsed: unknown
  try {
    parsed = JSON.parse(normalized)
  } catch {
    throw new Error('INVALID_HAR')
  }

  const entries = (parsed as { log?: { entries?: HarEntry[] } })?.log?.entries
  if (!Array.isArray(entries)) {
    throw new Error('INVALID_HAR')
  }

  const matches = entries.filter((entry) => {
    const url = entry?.request?.url
    return typeof url === 'string' && url.includes(TARGET_PATH)
  })
  if (matches.length === 0) {
    throw new Error('NO_MATCH')
  }

  const entry = matches[matches.length - 1]
  const newHomeUrl = entry?.request?.url
  if (!newHomeUrl || typeof newHomeUrl !== 'string') {
    throw new Error('NO_URL')
  }
  const headersList = entry?.request?.headers
  if (!Array.isArray(headersList)) {
    throw new Error('NO_HEADERS')
  }

  let cookieHeader = ''
  const headers: Record<string, string> = {}
  for (const item of headersList) {
    if (!item || typeof item !== 'object') continue
    const name = typeof item.name === 'string' ? item.name.trim() : ''
    const value = typeof item.value === 'string' ? item.value.trim() : ''
    if (!name || !value) continue
    const lower = name.toLowerCase()
    if (lower === 'cookie') {
      cookieHeader = value
      continue
    }
    if (SKIP_HEADERS.has(lower)) continue
    headers[lower] = value
  }

  if (!cookieHeader) {
    cookieHeader = buildCookieFromList(entry?.request?.cookies)
  }

  if (!cookieHeader) {
    throw new Error('NO_COOKIE')
  }

  const setCookie = parseSetCookieHeaders(entry?.response?.headers)
  const merged = setCookie.length
    ? mergeCookieWithSetCookie({ cookie: cookieHeader, setCookie })
    : { cookie: cookieHeader, changed: false }

  return { cookie: merged.cookie, headers, newHomeUrl }
}

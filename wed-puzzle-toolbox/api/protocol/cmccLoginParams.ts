import { httpsRequestText } from './cmccHttp.js'

export type CmccLoginParams = {
  csrf: string
  reqTmp: string
  cookieHeader?: string
}

function normalizeSetCookieToCookieHeader(setCookie: string[] | string | undefined): string {
  const list = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : []
  return list
    .map((v) => v.split(';', 1)[0])
    .map((v) => v.trim())
    .filter(Boolean)
    .join('; ')
}

function mergeHeaderOverrides(
  base: Record<string, string>,
  custom?: Record<string, string>,
  protectedKeys?: string[],
): Record<string, string> {
  if (!custom || Object.keys(custom).length === 0) return base
  const protectedSet = new Set((protectedKeys ?? []).map((k) => k.toLowerCase()))
  const out: Record<string, string> = { ...base }
  for (const [k, v] of Object.entries(custom)) {
    const key = k.trim()
    if (!key) continue
    const lower = key.toLowerCase()
    if (protectedSet.has(lower)) continue
    for (const existing of Object.keys(out)) {
      if (existing.toLowerCase() === lower) {
        delete out[existing]
      }
    }
    out[key] = v
  }
  return out
}

export function extractLoginParamsFromHtml(html: string): CmccLoginParams {
  const csrfMatch =
    html.match(/\bcsrf\s*[=:]\s*"([^"]+)"/) ??
    html.match(/\bcsrf\s*[=:]\s*'([^']+)'/)
  const reqTmpMatch =
    html.match(/\breqTmp\s*[=:]\s*"([^"]+)"/) ??
    html.match(/\breqTmp\s*[=:]\s*'([^']+)'/)

  const csrf = csrfMatch?.[1]
  const reqTmp = reqTmpMatch?.[1]
  if (!csrf || !reqTmp) {
    throw new Error('Failed to extract csrf/reqTmp from login HTML')
  }

  return { csrf, reqTmp }
}

export async function fetchLoginParams(args?: {
  requestHeaders?: Record<string, string>
}): Promise<CmccLoginParams> {
  const baseHeaders = {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    Referer: 'https://wx.10086.cn/website/bind/bindAccount/new',
    Origin: 'https://wx.10086.cn',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-User': '?1',
    'Sec-Fetch-Dest': 'document',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  }
  const headers = mergeHeaderOverrides(baseHeaders, args?.requestHeaders, ['cookie'])
  const res = await httpsRequestText({
    url: 'https://wx.10086.cn/website/bind/bindAccount/new',
    method: 'GET',
    headers,
    timeoutMs: 10000,
  })
  if (res.statusCode < 200 || res.statusCode >= 300) {
    throw new Error(`Failed to fetch login HTML: ${res.statusCode}`)
  }

  const { csrf, reqTmp } = extractLoginParamsFromHtml(res.bodyText)
  const cookieHeader = normalizeSetCookieToCookieHeader(res.headers['set-cookie'])
  return { csrf, reqTmp, cookieHeader: cookieHeader || undefined }
}


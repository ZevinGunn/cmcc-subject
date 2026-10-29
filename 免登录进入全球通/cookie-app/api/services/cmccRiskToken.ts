import { httpsRequestText } from './cmccHttp.js'

type CachedToken = {
  token: string
  expiresAtMs: number
}

let cached: CachedToken | null = null

function extractTokenFromJsonp(text: string): string | null {
  const m = text.match(/"data"\s*:\s*"([^"]+)"/)
  return m?.[1] ?? null
}

export async function getRiskToken(args?: { forceRefresh?: boolean }): Promise<string> {
  const forceRefresh = args?.forceRefresh ?? false
  const now = Date.now()
  if (!forceRefresh && cached && cached.expiresAtMs > now) {
    return cached.token
  }

  const res = await httpsRequestText({
    url: 'https://yxfk.market.chinamobile.com:8081/mgt/decision-engine/udid/c1',
    method: 'GET',
    headers: {
      appId: 'ad4755304a7a8694d3e52474c0247d4f',
      Origin: 'https://wx.10086.cn',
      Referer: 'https://wx.10086.cn/website/bind/bindAccount/new',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    timeoutMs: 10000,
    allowUnsafeLegacyRenegotiation: true,
  })

  if (res.statusCode < 200 || res.statusCode >= 300) {
    throw new Error(`Failed to fetch risk token: ${res.statusCode}`)
  }

  const token =
    (typeof res.headers.etag === 'string' ? res.headers.etag : null) ??
    extractTokenFromJsonp(res.bodyText)

  if (!token) {
    throw new Error('Failed to parse risk token')
  }

  cached = {
    token,
    expiresAtMs: now + 23 * 60 * 60 * 1000,
  }
  return token
}


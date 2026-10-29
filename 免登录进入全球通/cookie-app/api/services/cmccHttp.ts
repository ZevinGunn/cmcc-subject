import https from 'node:https'
import crypto from 'node:crypto'
import zlib from 'node:zlib'
import { promisify } from 'node:util'

const gunzip = promisify(zlib.gunzip)
const inflate = promisify(zlib.inflate)
const brotliDecompress = promisify(zlib.brotliDecompress)

type HttpMethod = 'GET' | 'POST'

function debugLogRequest(args: {
  url: string
  method: HttpMethod
  headers?: Record<string, string | number | string[] | undefined>
}): void {
  console.log(`[cmcc-http] --> ${args.method} ${redactUrl(args.url)}`)
  console.log(`[cmcc-http] --> headers ${JSON.stringify(redactHeaders(args.headers ?? {}))}`)
}

function debugLogResponse(args: {
  url: string
  statusCode: number
  headers: Record<string, string | string[] | undefined>
  bodyText: string
}): void {
  console.log(`[cmcc-http] <-- ${args.statusCode} ${redactUrl(args.url)}`)
  console.log(`[cmcc-http] <-- headers ${JSON.stringify(redactHeaders(args.headers ?? {}))}`)
}

function debugLogError(args: {
  url: string
  method: HttpMethod
  error: unknown
}): void {
  const raw = args.error instanceof Error ? args.error.stack || args.error.message : String(args.error)
  const message = raw.replace(/https?:\/\/[^\s"'<>]+/g, (url) => redactUrl(url))
  console.error(`[cmcc-http] xx ${args.method} ${redactUrl(args.url)} ${message}`)
}

function redactUrl(url: string): string {
  try {
    const parsed = new URL(url)
    for (const key of Array.from(parsed.searchParams.keys())) {
      const lower = key.toLowerCase()
      if (lower.includes('token') || lower.includes('ticket') || lower.includes('code')) {
        parsed.searchParams.set(key, `[redacted:${parsed.searchParams.get(key)?.length ?? 0}]`)
      }
    }
    return parsed.toString()
  } catch {
    return url.replace(/([?&][^=]*(?:token|ticket|code)[^=]*=)[^&]+/gi, '$1[redacted]')
  }
}

function redactHeaders(
  headers: Record<string, string | number | string[] | undefined>,
): Record<string, string | number | string[] | undefined> {
  const out: Record<string, string | number | string[] | undefined> = {}
  for (const [key, value] of Object.entries(headers)) {
    const lower = key.toLowerCase()
    if (
      lower === 'cookie' ||
      lower === 'set-cookie' ||
      lower === 'phone' ||
      lower === 'coc-aurora' ||
      lower === 'coc-meteor' ||
      lower.includes('authorization') ||
      lower.includes('token')
    ) {
      out[key] = Array.isArray(value)
        ? value.map((item) => `[redacted:${String(item).length}]`)
        : `[redacted:${String(value ?? '').length}]`
      continue
    }
    if (lower === 'location' || lower === 'referer' || lower === 'referrer') {
      out[key] = Array.isArray(value)
        ? value.map((item) => redactUrl(String(item)))
        : redactUrl(String(value ?? ''))
      continue
    }
    out[key] = value
  }
  return out
}

export type HttpResponse = {
  statusCode: number
  headers: Record<string, string | string[] | undefined>
  bodyText: string
  bodyBuffer: Buffer
}

export async function httpsRequestText(args: {
  url: string
  method: HttpMethod
  headers?: Record<string, string>
  body?: string
  timeoutMs?: number
  allowUnsafeLegacyRenegotiation?: boolean
}): Promise<HttpResponse> {
  const timeoutMs = args.timeoutMs ?? 10000

  const agent = new https.Agent({
    secureOptions: args.allowUnsafeLegacyRenegotiation
      ? crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION |
        crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
      : undefined,
  })

  return await new Promise<HttpResponse>((resolve, reject) => {
    const req = https.request(
      args.url,
      {
        method: args.method,
        headers: args.headers,
        agent,
      },
      async (res) => {
        try {
          const chunks: Buffer[] = []
          res.on('data', (d) => chunks.push(Buffer.isBuffer(d) ? d : Buffer.from(d)))
          res.on('error', reject)
          res.on('end', async () => {
            try {
              const raw = Buffer.concat(chunks)
              const encoding = String(res.headers['content-encoding'] ?? '')
                .split(',')[0]
                .trim()
                .toLowerCase()

              let decoded = raw
              if (encoding === 'gzip') decoded = await gunzip(raw)
              else if (encoding === 'deflate') decoded = await inflate(raw)
              else if (encoding === 'br') decoded = await brotliDecompress(raw)

              const result: HttpResponse = {
                statusCode: res.statusCode ?? 0,
                headers: res.headers as Record<string, string | string[] | undefined>,
                bodyText: decoded.toString('utf8'),
                bodyBuffer: decoded,
              }

              debugLogResponse({
                url: args.url,
                statusCode: result.statusCode,
                headers: result.headers,
                bodyText: result.bodyText,
              })

              resolve(result)
            } catch (e) {
              debugLogError({ url: args.url, method: args.method, error: e })
              reject(e)
            }
          })
        } catch (e) {
          debugLogError({ url: args.url, method: args.method, error: e })
          reject(e)
        }
      },
    )

    debugLogRequest({
      url: args.url,
      method: args.method,
      headers: req.getHeaders(),
    })

    req.setTimeout(timeoutMs, () => {
      const error = new Error('UPSTREAM_TIMEOUT')
      debugLogError({ url: args.url, method: args.method, error })
      req.destroy(error)
    })

    req.on('error', (error) => {
      debugLogError({ url: args.url, method: args.method, error })
      reject(error)
    })
    if (args.body) req.write(args.body)
    req.end()
  })
}

export const __test__ = {
  redactHeaders,
  redactUrl,
}

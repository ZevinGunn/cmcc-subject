import https from 'node:https'
import crypto from 'node:crypto'
import zlib from 'node:zlib'
import { promisify } from 'node:util'

export type HttpResponse = { statusCode: number; headers: Record<string, string | string[] | undefined>; bodyText: string; bodyBuffer: Buffer }
// No credential-bearing URL, headers or bodies are logged by the standalone tool.
export async function httpsRequestText(args: { url: string; method: 'GET' | 'POST'; headers?: Record<string, string>; body?: string; timeoutMs?: number; allowUnsafeLegacyRenegotiation?: boolean }): Promise<HttpResponse> {
  const url = new URL(args.url)
  if (url.protocol !== 'https:' || url.username || url.password || !['wx.10086.cn', 'login.10086.cn', 'app.10086.cn', 'yxfk.market.chinamobile.com'].includes(url.hostname) || !['', '443', '8081'].includes(url.port)) throw new Error('不允许访问此接口地址')
  const agent = new https.Agent({ secureOptions: args.allowUnsafeLegacyRenegotiation ? crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION | crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT : undefined })
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: args.method, headers: args.headers, agent }, res => {
      const chunks: Buffer[] = []; let size = 0
      res.on('data', chunk => { size += chunk.length; if (size > 4e6) res.destroy(new Error('接口响应过大')); else chunks.push(Buffer.from(chunk)) })
      res.on('error', reject)
      res.on('end', async () => {
        try {
          let bodyBuffer = Buffer.concat(chunks)
          const encoding = String(res.headers['content-encoding'] || '').toLowerCase()
          if (encoding === 'gzip') bodyBuffer = await promisify(zlib.gunzip)(bodyBuffer, { maxOutputLength: 8e6 })
          if (encoding === 'br') bodyBuffer = await promisify(zlib.brotliDecompress)(bodyBuffer, { maxOutputLength: 8e6 })
          if (encoding === 'deflate') bodyBuffer = await promisify(zlib.inflate)(bodyBuffer, { maxOutputLength: 8e6 })
          resolve({ statusCode: res.statusCode || 0, headers: res.headers as HttpResponse['headers'], bodyBuffer, bodyText: bodyBuffer.toString('utf8') })
        } catch (error) { reject(error) } finally { agent.destroy() }
      })
    })
    const deadline = setTimeout(() => req.destroy(new Error('接口超时，结果可能未确认')), args.timeoutMs || 15000)
    req.on('close', () => { clearTimeout(deadline); agent.destroy() })
    req.on('error', reject)
    if (args.body) req.write(args.body)
    req.end()
  })
}

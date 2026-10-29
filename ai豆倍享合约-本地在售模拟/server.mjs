import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('./service.bj.10086.cn/', import.meta.url)))
const port = Number(process.env.PORT || 8896)

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': mimeTypes['.json'], 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(data))
}

const server = createServer(async (req, res) => {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || '127.0.0.1'}`)
  let pathname = decodeURIComponent(requestUrl.pathname)

  if (pathname.startsWith('/nwt/portal-bff/') || pathname.startsWith('/nwt/sso/')) {
    sendJson(res, 409, {
      ok: false,
      code: 'LOCAL_SIMULATION_BLOCKED',
      message: '本地模拟环境已阻止真实登录、短信和订购请求。',
    })
    return
  }

  if (pathname === '/' || pathname === '/nwt/portal/bounsPoints') {
    pathname = '/nwt/portal/bounsPoints.html'
  }

  const relativePath = pathname.replace(/^[/\\]+/, '')
  const filePath = resolve(root, relativePath)
  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
    sendJson(res, 403, { ok: false, code: 'PATH_FORBIDDEN' })
    return
  }

  try {
    const fileStat = await stat(filePath)
    if (!fileStat.isFile()) throw new Error('not a file')
    res.writeHead(200, {
      'Content-Type': mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Content-Security-Policy': [
        "default-src 'self' data:",
        "connect-src 'self'",
        "font-src 'self' data:",
        "img-src 'self' data:",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
      ].join('; '),
    })
    createReadStream(filePath).pipe(res)
  } catch {
    sendJson(res, 404, { ok: false, code: 'LOCAL_FILE_NOT_FOUND', path: pathname })
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`AI bean local in-sale simulation: http://127.0.0.1:${port}/nwt/portal/bounsPoints`)
})

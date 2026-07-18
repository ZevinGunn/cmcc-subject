import { createReadStream, existsSync } from 'node:fs'
import path from 'node:path'
import express from 'express'
import { config } from './config.js'
import { expiredCookie, isAdmin, login, logout, sessionCookie } from './services/adminSession.js'
import { applyPending, discardPending, importHistory, normalizeCatalogType, publicCatalog, rollbackCatalog } from './services/catalogStore.js'
import { createImport, syncOfficialBundle } from './services/importService.js'

const app = express()

app.disable('x-powered-by')
app.use((_req, res, next) => {
  res.set({
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'permissions-policy': 'camera=(), microphone=(), geolocation=()',
    'content-security-policy': "default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
  })
  next()
})

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res)).catch(next)
}

function requireAdmin(req, res, next) {
  if (isAdmin(req)) return next()
  res.status(401).json({ ok: false, error: 'UNAUTHORIZED', message: '请先验证管理口令' })
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, data: { service: 'bjcmcc-route-hub', port: config.port } })
})

app.get('/api/catalog', asyncRoute(async (req, res) => {
  res.set('cache-control', 'public, max-age=30')
  res.json({ ok: true, data: await publicCatalog(normalizeCatalogType(req.query?.type)) })
}))

app.get('/api/admin/session', (req, res) => {
  res.json({ ok: true, data: { authenticated: isAdmin(req) } })
})

app.post('/api/admin/login', express.json({ limit: '16kb' }), (req, res) => {
  const token = login(req.body?.password)
  if (!token) return res.status(403).json({ ok: false, error: 'BAD_PASSWORD', message: '管理口令不正确' })
  res.setHeader('set-cookie', sessionCookie(token))
  res.json({ ok: true, data: { authenticated: true } })
})

app.post('/api/admin/logout', (req, res) => {
  logout(req)
  res.setHeader('set-cookie', expiredCookie())
  res.status(204).end()
})

app.get('/api/admin/imports', requireAdmin, asyncRoute(async (req, res) => {
  res.json({ ok: true, data: await importHistory(normalizeCatalogType(req.query?.type)) })
}))

app.post(
  '/api/admin/imports/upload',
  requireAdmin,
  express.text({ type: ['application/javascript', 'text/javascript', 'text/plain'], limit: config.maxBundleBytes }),
  asyncRoute(async (req, res) => {
    if (!req.body) return res.status(400).json({ ok: false, error: 'EMPTY_FILE', message: '请选择 JS 文件' })
    const name = String(req.headers['x-source-name'] || 'uploaded.js').slice(0, 160)
    const result = await createImport(req.body, { type: 'upload', name }, normalizeCatalogType(req.query?.type))
    res.json({ ok: true, data: result })
  }),
)

app.post('/api/admin/imports/sync', requireAdmin, asyncRoute(async (req, res) => {
  res.json({ ok: true, data: await syncOfficialBundle(normalizeCatalogType(req.query?.type)) })
}))

app.post('/api/admin/imports/:id/apply', requireAdmin, asyncRoute(async (req, res) => {
  const catalog = await applyPending(req.params.id)
  res.json({ ok: true, data: { activeImportId: catalog.activeImportId, updatedAt: catalog.updatedAt } })
}))

app.delete('/api/admin/imports/:id', requireAdmin, asyncRoute(async (req, res) => {
  await discardPending(req.params.id)
  res.status(204).end()
}))

app.post('/api/admin/imports/rollback', requireAdmin, asyncRoute(async (req, res) => {
  const catalog = await rollbackCatalog(normalizeCatalogType(req.query?.type))
  res.json({ ok: true, data: { activeImportId: catalog.activeImportId, updatedAt: catalog.updatedAt } })
}))

if (existsSync(config.frontendDist)) {
  app.use(express.static(config.frontendDist, { index: false, maxAge: config.isProduction ? '1h' : 0 }))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    createReadStream(path.join(config.frontendDist, 'index.html')).pipe(res.type('html'))
  })
}

app.use((error, _req, res, _next) => {
  console.error(error)
  const status = error.type === 'entity.too.large' ? 413 : 500
  res.status(status).json({
    ok: false,
    error: error.code || (status === 413 ? 'FILE_TOO_LARGE' : 'SERVER_ERROR'),
    message: status === 413 ? '文件超过 5 MB 限制' : error.message || '服务异常',
  })
})

app.listen(config.port, config.host, () => {
  console.log(`Route hub listening on http://${config.host}:${config.port}`)
})

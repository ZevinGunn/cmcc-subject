import express from 'express'
import cors from 'cors'
import { readFile } from 'node:fs/promises'
import { config } from './config.js'
import authRouter from './routes/auth.js'
import businessRouter from './routes/business.js'
import { createRequestId, logEvent, logFile } from './utils/logger.js'

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
  const requestId = createRequestId()
  const startedAt = Date.now()
  req.requestId = requestId
  logEvent('backend:request', {
    requestId,
    method: req.method,
    path: req.originalUrl,
    sessionId: req.body?.sessionId || req.query?.sessionId || '',
    body: req.body,
    query: req.query,
  })
  const originalJson = res.json.bind(res)
  res.json = (body) => {
    logEvent('backend:response', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
      body,
    })
    return originalJson(body)
  }
  next()
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, data: { service: 'bj-mobile-business-local' } })
})

app.post('/api/logs/frontend', (req, res) => {
  logEvent('frontend:event', req.body || {})
  res.json({ ok: true })
})

app.get('/api/logs/recent', async (req, res) => {
  const limit = Math.min(Number(req.query?.limit || 300), 1000)
  const text = await readFile(logFile, 'utf8').catch(() => '')
  const lines = text.trim().split('\n').filter(Boolean).slice(-limit)
  res.json({ ok: true, data: { logFile, lines } })
})

app.use('/api/auth', authRouter)
app.use('/api/business', businessRouter)

app.use((err, _req, res, _next) => {
  console.error(err)
  logEvent('backend:error', {
    requestId: _req?.requestId || '',
    method: _req?.method,
    path: _req?.originalUrl,
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : '',
  })
  res.status(500).json({
    ok: false,
    message: err instanceof Error ? err.message : '服务异常',
    errorCode: 'SERVER_ERROR',
  })
})

app.listen(config.port, () => {
  console.log(`BJ Mobile business local API listening on http://127.0.0.1:${config.port}`)
})

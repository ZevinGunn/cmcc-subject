import express from 'express'
import cors from 'cors'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from './config.js'
import authRouter from './routes/auth.js'
import businessRouter from './routes/business.js'
import debugRouter from './routes/debug.js'
import activitiesRouter from './routes/activities.js'
import customOrdersRouter from './routes/customOrders.js'
import shopBusinessRouter from './routes/shopBusiness.js'
import quickOrdersRouter from './routes/quickOrders.js'
import { createRequestId, logEvent, logFile } from './utils/logger.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const frontendDist = path.resolve(__dirname, '../../frontend/dist')
const frontendIndex = path.join(frontendDist, 'index.html')
const app = express()

function requestBodyForLog(req) {
  if (req.originalUrl.startsWith('/api/debug/crypto')) {
    return {
      mode: req.body?.mode || '',
      operation: req.body?.operation || '',
      algorithm: req.body?.algorithm || '',
      hasInput: Boolean(req.body?.input),
      hasSessionId: Boolean(req.body?.sessionId),
      omitted: '[CRYPTO_INPUT_AND_KEYS_OMITTED]',
    }
  }
  if (req.originalUrl.startsWith('/api/custom-orders')) {
    return {
      sessionId: req.body?.sessionId || '',
      hasConfig: Boolean(req.body?.config),
      hasOtp: Boolean(req.body?.smsCode),
      agreed: req.body?.agreed === true,
      omitted: '[CUSTOM_ORDER_CONFIG_AND_SMS_OMITTED]',
    }
  }
  if (req.originalUrl.startsWith('/api/shop-business')) {
    return {
      phone: String(req.body?.phone || '').replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2'),
      hasCookie: Boolean(req.body?.cookie),
      hasBusiness: Boolean(req.body?.business),
      hasSmsCode: Boolean(req.body?.smsCode),
      omitted: '[SHOP_COOKIE_AND_SMS_OMITTED]',
    }
  }
  if (req.originalUrl.startsWith('/api/quick-orders')) {
    return {
      platform: req.body?.platform || '',
      hasAuth: Boolean(req.body?.auth),
      hasOption: Boolean(req.body?.optionId),
      hasSmsCode: Boolean(req.body?.smsCode),
      agreed: req.body?.agreed === true,
      realOrderConfirmed: req.body?.realOrderConfirmed === true,
      omitted: '[QUICK_ORDER_CREDENTIALS_AND_CODES_OMITTED]',
    }
  }
  return req.body
}

function responseBodyForLog(req, body) {
  if (req.originalUrl.startsWith('/api/debug/crypto')) return '[CRYPTO_OUTPUT_OMITTED]'
  if (req.originalUrl.startsWith('/api/custom-orders')) return '[CUSTOM_ORDER_OUTPUT_OMITTED]'
  if (req.originalUrl.startsWith('/api/shop-business')) return '[SHOP_BUSINESS_OUTPUT_OMITTED]'
  if (req.originalUrl.startsWith('/api/quick-orders')) return '[QUICK_ORDER_OUTPUT_OMITTED]'
  return body
}

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
    body: requestBodyForLog(req),
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
      body: responseBodyForLog(req, body),
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
app.use('/api/debug', debugRouter)
app.use('/api/activities', activitiesRouter)
app.use('/api/custom-orders', customOrdersRouter)
app.use('/api/shop-business', shopBusinessRouter)
app.use('/api/quick-orders', quickOrdersRouter)

if (existsSync(frontendIndex)) {
  app.use(express.static(frontendDist, { index: false }))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    res.sendFile(frontendIndex)
  })
}

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

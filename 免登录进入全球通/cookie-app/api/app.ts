/**
 * This is a API server
 */

import fs from 'node:fs'
import path from 'node:path'
import express, { type NextFunction, type Request, type Response } from 'express'
import cors from 'cors'
import compression from 'compression'
import cmcc10086Routes from './routes/cmcc10086.js'
import accountsRoutes from './routes/accounts.js'
import businessQueryRoutes from './routes/businessQuery.js'
import businessOrderRoutes from './routes/businessOrder.js'
import bmccActivityOrderRoutes from './routes/bmccActivityOrder.js'
import benefitOrderRoutes from './routes/benefitOrders.js'
import shopQueryRoutes from './routes/shopQuery.js'
import legacyBusinessQueryRoutes from './routes/legacyBusinessQuery.js'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import debugCryptoRoutes, { debugCryptoPageHandler } from './routes/debugCrypto.js'
import taskRoutes from './routes/tasks.js'
import workerRoutes from './routes/worker.js'
import announcementRoutes from './routes/announcements.js'
import retailProductRoutes from './routes/retailProducts.js'
import accessLogRoutes from './routes/accessLogs.js'
import luckyThreeDayRoutes from './routes/luckyThreeDay.js'
import broadbandOrderRoutes from './routes/broadbandOrders.js'
import qqtPremiumBroadbandOrderRoutes from './routes/qqtPremiumBroadbandOrders.js'
import aigouOrderRoutes from './routes/aigouOrders.js'
import callbackAppointmentRoutes from './routes/callbackAppointments.js'
import wedPuzzleRoutes from './routes/wedPuzzle.js'
import starbucksRoutes from './routes/starbucks.js'
import { startTaskScheduler } from './services/batchTasks.js'
import { startRetailProductQueryScheduler } from './services/retailProductQuery.js'
import { loadRuntimeConfig, validateRuntimeConfig } from './services/runtimeConfig.js'
import { installProcessErrorGuards } from './services/processErrorGuards.js'
import { startDatabaseMaintenanceScheduler } from './services/databaseMaintenance.js'
import { hasValidAdminSessionToken } from './services/adminAuthStore.js'
import { accessLogMiddleware } from './services/accessLogMiddleware.js'
import { currentRelease, serverStartedAt } from './services/releaseInfo.js'

installProcessErrorGuards()
loadRuntimeConfig()
validateRuntimeConfig()

const app: express.Application = express()
startTaskScheduler()
startRetailProductQueryScheduler()
startDatabaseMaintenanceScheduler()

app.use(cors())
app.use(compression({ threshold: 1024 }))
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))
app.use(accessLogMiddleware)

function parseCookieHeader(header?: string): Record<string, string> {
  if (!header) return {}
  const out: Record<string, string> = {}
  const parts = header.split(';')
  for (const part of parts) {
    const idx = part.indexOf('=')
    if (idx <= 0) continue
    const key = part.slice(0, idx).trim()
    const value = part.slice(idx + 1).trim()
    if (!key) continue
    out[key] = value
  }
  return out
}

function getAdminKeyFromRequest(req: Request): string | undefined {
  const header = req.header('x-admin-key')
  if (header && header.trim()) return header.trim()
  const cookies = parseCookieHeader(req.header('cookie'))
  const cookieValue = cookies.admin_key
  if (cookieValue && cookieValue.trim()) return cookieValue.trim()
  return undefined
}

function isPortalAdminRequest(req: Request): boolean {
  const secret = req.header('x-portal-admin-secret')?.trim()
  const expected = process.env.ADMIN_KEY?.trim()
  return Boolean(secret && expected && secret === expected && req.header('x-portal-admin')?.trim())
}

function isLocalRequest(req: Request): boolean {
  const ip = req.ip || ''
  if (ip === '127.0.0.1' || ip === '::1') return true
  if (ip.startsWith('::ffff:127.0.0.1')) return true
  const host = String(req.hostname || '').toLowerCase()
  if (host === 'localhost') return true
  return false
}

/**
 * API Routes
 */
app.use('/api/10086', cmcc10086Routes)
app.use('/api/admin', adminRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/accounts', accountsRoutes)
app.use('/api/business-query', businessQueryRoutes)
app.use('/api/business-order', businessOrderRoutes)
app.use('/api/bmcc-activity-order', bmccActivityOrderRoutes)
app.use('/api/benefit-orders', benefitOrderRoutes)
app.use('/api/shop-query', shopQueryRoutes)
app.use('/api/legacy-business-query', legacyBusinessQueryRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/worker', workerRoutes)
app.use('/api/announcements', announcementRoutes)
app.use('/api/retail-products', retailProductRoutes)
app.use('/api/access-logs', accessLogRoutes)
app.use('/api/lucky-three-day', luckyThreeDayRoutes)
app.use('/api/broadband-orders', broadbandOrderRoutes)
app.use('/api/qqt-premium-broadband-orders', qqtPremiumBroadbandOrderRoutes)
app.use('/api/aigou-orders', aigouOrderRoutes)
app.use('/api/callback-appointments', callbackAppointmentRoutes)
app.use('/api/wed-puzzle', wedPuzzleRoutes)
app.use('/api/starbucks', starbucksRoutes)
app.use('/api/debug/crypto', debugCryptoRoutes)
app.get('/debug/crypto', debugCryptoPageHandler)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response): void => {
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json({
      ok: true,
      data: {
        status: 'ok',
        release: currentRelease,
        serverStartedAt,
      },
    })
  },
)

/**
 * Serve built frontend when available.
 */
const distDir = path.resolve(process.cwd(), 'dist')
if (fs.existsSync(distDir)) {
  app.use((req: Request, res: Response, next: express.NextFunction) => {
    const adminKey = process.env.ADMIN_KEY?.trim()
    const pathLower = req.path.toLowerCase()
    const adminPathRaw = process.env.ADMIN_PATH?.trim()
    const adminPath =
      adminPathRaw && adminPathRaw.startsWith('/')
        ? adminPathRaw
        : adminPathRaw
          ? `/${adminPathRaw}`
          : '/admin'
    const allowList = [
      '/public',
      '/starbucks',
      '/app/cmcc-public',
      '/app/cmcc-user',
      '/admin-login',
      '/users',
      '/links',
      '/v2',
      '/business-query',
      '/shop-query',
      '/business-order',
      adminPath.toLowerCase(),
      '/api',
      '/assets',
      '/favicon',
      '/vite.svg',
      '/robots.txt',
    ]
    const allowed = allowList.some((prefix) => pathLower.startsWith(prefix))
    if (allowed) {
      next()
      return
    }
    if (!adminKey) {
      if (isLocalRequest(req)) {
        next()
        return
      }
      res.status(403).send('Forbidden')
      return
    }
    const incoming = getAdminKeyFromRequest(req)
    if (hasValidAdminSessionToken(req)) {
      next()
      return
    }
    if (incoming && incoming === adminKey) {
      next()
      return
    }
    if (isPortalAdminRequest(req)) {
      next()
      return
    }
    res.status(403).send('Forbidden')
  })

  app.use(express.static(distDir, {
    setHeaders(res, filePath) {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      } else if (path.basename(filePath) === 'index.html') {
        res.setHeader('Cache-Control', 'no-cache')
      }
    },
  }))
  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/')) {
      next()
      return
    }
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

/**
 * error handler middleware
 */
app.use((error: unknown, req: Request, res: Response, _next: express.NextFunction) => {
  void _next
  if (
    error instanceof SyntaxError &&
    'message' in error &&
    String((error as SyntaxError).message).toLowerCase().includes('json')
  ) {
    res.status(400).json({
      ok: false,
      message: '请求体不是合法JSON',
      errorCode: 'BAD_JSON',
    })
    return
  }

  res.status(500).json({
    ok: false,
    message: 'Server internal error',
  })

  return
})

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    message: 'API not found',
  })
})

export default app

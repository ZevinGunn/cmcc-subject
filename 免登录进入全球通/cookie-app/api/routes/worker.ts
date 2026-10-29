import crypto from 'node:crypto'
import { Router, type Request, type Response } from 'express'
import {
  cmccRefreshCookieByHome,
} from '../services/cmcc10086.js'
import { qqtReplaceToken } from '../services/qqtSign.js'
import {
  clearAccountCookie,
  getAccountById,
  listAccounts,
  setAccountCookie,
  setAccountDisplayPhone,
  setAccountQqtInfo,
  setAccountQqtToken,
  touchAccountCookieCheckedAt,
  touchAccountQqtTokenCheckedAt,
} from '../services/accountsStore.js'
import { dedupeInFlight, withKeyLock } from '../services/taskGuards.js'
import { runPool as runPoolUtil } from '../services/runPool.js'
import { hasValidAdminSessionToken } from '../services/adminAuthStore.js'

type WorkerTaskResult = {
  id: string
  ok: boolean
  message?: string
  errorCode?: string
  status?: string | number
}

type WorkerBatchResp = {
  ok: boolean
  data?: {
    total: number
    success: number
    failed: number
    results: WorkerTaskResult[]
  }
  message?: string
  errorCode?: string
  requestId?: string
}

const router = Router()

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

function isLocalRequest(req: Request): boolean {
  const ip = req.ip || ''
  if (ip === '127.0.0.1' || ip === '::1') return true
  if (ip.startsWith('::ffff:127.0.0.1')) return true
  const host = String(req.hostname || '').toLowerCase()
  if (host === 'localhost') return true
  return false
}

function isAdminRequest(req: Request): boolean {
  if (hasValidAdminSessionToken(req)) return true
  const adminKey = process.env.ADMIN_KEY?.trim()
  if (!adminKey) return isLocalRequest(req)
  const header = req.header('x-admin-key')
  if (header && header.trim() === adminKey) return true
  const cookies = parseCookieHeader(req.header('cookie'))
  const cookieValue = cookies.admin_key
  if (cookieValue && cookieValue.trim() === adminKey) return true
  return false
}

function parseIds(input: unknown): string[] | undefined {
  if (!Array.isArray(input)) return undefined
  return input
    .map((item) => String(item || '').trim())
    .filter((item) => item.length > 0)
}

function getConcurrency(): number {
  const raw = Number(process.env.WORKER_CONCURRENCY ?? 4)
  if (!Number.isFinite(raw)) return 4
  return Math.max(1, Math.min(20, Math.floor(raw)))
}

function getValidityWindowMin(): number {
  const raw = Number(process.env.CMCC_VALIDITY_WINDOW_MIN ?? 90)
  if (!Number.isFinite(raw)) return 90
  return Math.max(1, Math.min(24 * 60, Math.floor(raw)))
}

function isWithinWindow(iso: string | undefined, windowMin: number): boolean {
  if (!iso) return false
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return false
  return Date.now() - t <= windowMin * 60_000
}

function normalizeWorkerResponse(results: WorkerTaskResult[]): WorkerBatchResp['data'] {
  const success = results.filter((r) => r.ok).length
  const failed = results.length - success
  return {
    total: results.length,
    success,
    failed,
    results,
  }
}

async function runPool<T>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<WorkerTaskResult>,
): Promise<WorkerTaskResult[]> {
  return await runPoolUtil(items, limit, async (item) => await worker(item))
}

async function ensureFreshCookie(args: {
  id: string
  cookie: string
  requestHeaders?: Record<string, string>
  newHomeUrl?: string
}): Promise<{ ok: boolean; cookie?: string; message?: string }> {
  const r = await cmccRefreshCookieByHome(
    args.cookie,
    args.requestHeaders,
    args.newHomeUrl,
  )
  if (!r.ok || !r.cookie) {
    return { ok: false, message: r.message || '刷新失败' }
  }
  if (r.cookieUpdated) {
    await setAccountCookie({ id: args.id, cookie: r.cookie })
  } else {
    await touchAccountCookieCheckedAt({ id: args.id })
  }
  return { ok: true, cookie: r.cookie }
}

async function forwardToGoWorker(
  req: Request,
  res: Response<WorkerBatchResp>,
  path: string,
) {
  const base = process.env.GO_WORKER_URL?.trim()
  if (!base) return false
  const driver = (process.env.WORKER_DRIVER || '').trim().toLowerCase()
  if (driver !== 'go') return false
  const target = `${base.replace(/\/$/, '')}${path}`
  const workerKey = process.env.GO_WORKER_KEY?.trim()
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  }
  if (workerKey) headers['x-worker-key'] = workerKey
  const payload = JSON.stringify(req.body ?? {})
  const resp = await fetch(target, {
    method: 'POST',
    headers,
    body: payload,
  })
  const text = await resp.text()
  const contentType = resp.headers.get('content-type')
  if (contentType) res.setHeader('content-type', contentType)
  // This endpoint is a transparent proxy; payload may not match WorkerBatchResp.
  res.status(resp.status).send(text as unknown as WorkerBatchResp)
  return true
}

router.post(
  '/refresh-cookies',
  async (req: Request, res: Response<WorkerBatchResp>) => {
    const requestId = crypto.randomUUID()
    if (!isAdminRequest(req)) {
      res.status(403).json({
        ok: false,
        message: 'Forbidden',
        errorCode: 'FORBIDDEN',
        requestId,
      })
      return
    }
    try {
      if (await forwardToGoWorker(req, res, '/worker/refresh-cookies')) return
      const idList = parseIds(req.body?.accountIds)
      const accounts = await listAccounts()
      let targets = accounts.filter((a) => a.cookie)
      if (idList && idList.length > 0) {
        const set = new Set(idList)
        targets = targets.filter((a) => set.has(a.id))
      }
      const windowMin = getValidityWindowMin()
      const results = await runPool(targets, getConcurrency(), async (rec) => {
        try {
          if (isWithinWindow(rec.cookieCheckedAt, windowMin)) {
            return { id: rec.id, ok: true, message: 'Cookie 90 分钟内有效，跳过刷新' }
          }
          const r = await cmccRefreshCookieByHome(
            rec.cookie || '',
            rec.requestHeaders,
            rec.newHomeUrl,
          )
          if (!r.ok || !r.cookie) {
            await clearAccountCookie({
              id: rec.id,
              reason: r.message || 'Cookie 已失效',
            })
            return {
              id: rec.id,
              ok: false,
              message: r.message || 'Cookie 已失效',
              errorCode: 'COOKIE_INVALID_CLEARED',
              status: r.status,
            }
          }
          if (r.cookieUpdated) {
            await setAccountCookie({ id: rec.id, cookie: r.cookie })
          } else {
            await touchAccountCookieCheckedAt({ id: rec.id })
          }
          return {
            id: rec.id,
            ok: true,
            message: r.cookieUpdated ? 'Cookie 已更新' : 'Cookie 无需更新',
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : '刷新失败'
          return { id: rec.id, ok: false, message: msg }
        }
      })
      res.json({
        ok: true,
        data: normalizeWorkerResponse(results),
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/refresh-tokens',
  async (req: Request, res: Response<WorkerBatchResp>) => {
    const requestId = crypto.randomUUID()
    if (!isAdminRequest(req)) {
      res.status(403).json({
        ok: false,
        message: 'Forbidden',
        errorCode: 'FORBIDDEN',
        requestId,
      })
      return
    }
    try {
      if (await forwardToGoWorker(req, res, '/worker/refresh-tokens')) return
      const idList = parseIds(req.body?.accountIds)
      const accounts = await listAccounts()
      let targets = accounts.filter((a) => a.cookie)
      if (idList && idList.length > 0) {
        const set = new Set(idList)
        targets = targets.filter((a) => set.has(a.id))
      }
      const results = await runPool(targets, getConcurrency(), async (rec) => {
        try {
          if (!rec.cookie) {
            return { id: rec.id, ok: false, message: '暂无 Cookie' }
          }
          const refreshed = await withKeyLock(`account:${rec.id}`, async () => {
            // Avoid repeated upstream refresh for the same account when users click multiple times.
            return await dedupeInFlight(`ensureFreshCookie:${rec.id}`, async () =>
              await ensureFreshCookie({
                id: rec.id,
                cookie: rec.cookie || '',
                requestHeaders: rec.requestHeaders,
                newHomeUrl: rec.newHomeUrl,
              }),
            )
          })
          if (!refreshed.ok || !refreshed.cookie) {
            return {
              id: rec.id,
              ok: false,
              message: refreshed.message || 'Cookie 无效',
              errorCode: 'COOKIE_INVALID',
            }
          }
          const r = await qqtReplaceToken({
            cmccCookie: refreshed.cookie,
            requestHeaders: rec.requestHeaders,
          })
          if (!r.ok || !r.accessToken) {
            return {
              id: rec.id,
              ok: false,
              message: r.message || '获取 token 失败',
              errorCode: String(r.status ?? 'UPSTREAM_ERROR'),
            }
          }
          await setAccountQqtToken({ id: rec.id, qqtAccessToken: r.accessToken })
          await touchAccountQqtTokenCheckedAt({ id: rec.id })
          const userInfo = r.userInfo
          const userInfoRecord =
            userInfo && typeof userInfo === 'object'
              ? (userInfo as Record<string, unknown>)
              : undefined
          const userInfoData =
            userInfoRecord && typeof userInfoRecord.data === 'object'
              ? (userInfoRecord.data as Record<string, unknown>)
              : undefined
          const displayPhone =
            userInfoData && typeof userInfoData.phone === 'string'
              ? userInfoData.phone.trim()
              : userInfoRecord && typeof userInfoRecord.phone === 'string'
                ? userInfoRecord.phone.trim()
                : ''
          if (displayPhone) {
            try {
              await setAccountDisplayPhone({ id: rec.id, displayPhone })
            } catch {
              // ignore invalid display
            }
          }
          if (userInfoRecord) {
            await setAccountQqtInfo({ id: rec.id, qqtInfo: userInfoRecord })
          }
          return { id: rec.id, ok: true, message: 'Token 已更新' }
        } catch (e) {
          const msg = e instanceof Error ? e.message : '获取 token 失败'
          return { id: rec.id, ok: false, message: msg }
        }
      })
      res.json({
        ok: true,
        data: normalizeWorkerResponse(results),
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

router.post(
  '/refresh-cookies-then-tokens',
  async (req: Request, res: Response<WorkerBatchResp>) => {
    const requestId = crypto.randomUUID()
    if (!isAdminRequest(req)) {
      res.status(403).json({
        ok: false,
        message: 'Forbidden',
        errorCode: 'FORBIDDEN',
        requestId,
      })
      return
    }
    try {
      if (await forwardToGoWorker(req, res, '/worker/refresh-cookies-then-tokens')) return
      const idList = parseIds(req.body?.accountIds)
      const accounts = await listAccounts()
      let targets = accounts.filter((a) => a.cookie)
      if (idList && idList.length > 0) {
        const set = new Set(idList)
        targets = targets.filter((a) => set.has(a.id))
      }
      // Single pass: refresh cookie and fetch token in one chain.
      // Avoids redundant upstream calls (previous implementation refreshed twice).
      const results = await runPool(targets, getConcurrency(), async (rec) => {
        return await withKeyLock(`account:${rec.id}`, async () => {
          try {
            if (!rec.cookie) return { id: rec.id, ok: false, message: '暂无 Cookie' }

            let cmccCookie = rec.cookie || ''
            const refreshed = await dedupeInFlight(`refreshCookie:${rec.id}`, async () =>
              await cmccRefreshCookieByHome(
                rec.cookie || '',
                rec.requestHeaders,
                rec.newHomeUrl,
              ),
            )
            if (!refreshed.ok || !refreshed.cookie) {
              await clearAccountCookie({
                id: rec.id,
                reason: refreshed.message || 'Cookie 已失效',
              })
              return {
                id: rec.id,
                ok: false,
                message: refreshed.message || 'Cookie 已失效',
                errorCode: 'COOKIE_INVALID_CLEARED',
                status: refreshed.status,
              }
            }
            cmccCookie = refreshed.cookie
            if (refreshed.cookieUpdated) {
              await setAccountCookie({ id: rec.id, cookie: cmccCookie })
            } else {
              await touchAccountCookieCheckedAt({ id: rec.id })
            }

            const r = await qqtReplaceToken({
              cmccCookie,
              requestHeaders: rec.requestHeaders,
            })
            if (!r.ok || !r.accessToken) {
              return {
                id: rec.id,
                ok: false,
                message: r.message || '获取 token 失败',
                errorCode: String(r.status ?? 'UPSTREAM_ERROR'),
              }
            }
            await setAccountQqtToken({ id: rec.id, qqtAccessToken: r.accessToken })
            await touchAccountQqtTokenCheckedAt({ id: rec.id })

            const userInfo = r.userInfo
            const userInfoRecord =
              userInfo && typeof userInfo === 'object'
                ? (userInfo as Record<string, unknown>)
                : undefined
            const userInfoData =
              userInfoRecord && typeof userInfoRecord.data === 'object'
                ? (userInfoRecord.data as Record<string, unknown>)
                : undefined
            const displayPhone =
              userInfoData && typeof userInfoData.phone === 'string'
                ? userInfoData.phone.trim()
                : userInfoRecord && typeof userInfoRecord.phone === 'string'
                  ? userInfoRecord.phone.trim()
                  : ''
            if (displayPhone) {
              try {
                await setAccountDisplayPhone({ id: rec.id, displayPhone })
              } catch {
                // ignore invalid display
              }
            }
            if (userInfoRecord) {
              await setAccountQqtInfo({ id: rec.id, qqtInfo: userInfoRecord })
            }

            return { id: rec.id, ok: true, message: 'Cookie 已刷新，Token 已更新' }
          } catch (e) {
            const msg = e instanceof Error ? e.message : '操作失败'
            return { id: rec.id, ok: false, message: msg }
          }
        })
      })
      res.json({
        ok: true,
        data: normalizeWorkerResponse(results),
        requestId,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      res
        .status(500)
        .json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
    }
  },
)

export default router

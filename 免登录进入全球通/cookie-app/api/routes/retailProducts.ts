import crypto from 'node:crypto'
import { Router, type Request, type Response } from 'express'
import { isAdminRequest } from '../services/serviceLoginGuard.js'
import {
  RetailProductQueryError,
  cancelRetailProductQueryTask,
  createRetailProductQuerySchedule,
  createRetailProductQueryTask,
  deleteRetailProduct,
  deleteRetailProductQuerySchedule,
  expandProductCodeRange,
  getRetailProduct,
  getRetailProductQueryTask,
  listRetailProductQuerySchedules,
  listRetailProductQueryTasks,
  listRetailProducts,
  normalizeProductCodes,
  queryAndSaveRetailProduct,
  updateRetailProductQuerySchedule,
} from '../services/retailProductQuery.js'

const router = Router()

function requireAdmin(req: Request, res: Response, requestId: string): boolean {
  if (isAdminRequest(req)) return true
  res.status(401).json({ ok: false, message: '请先登录管理员账号', errorCode: 'UNAUTHENTICATED', requestId })
  return false
}

function handleError(res: Response, error: unknown, requestId: string): void {
  if (error instanceof RetailProductQueryError) {
    res.status(error.status).json({ ok: false, message: error.message, errorCode: error.code, requestId })
    return
  }
  res.status(500).json({ ok: false, message: error instanceof Error ? error.message : '服务端异常', errorCode: 'SERVER_ERROR', requestId })
}

function valuesFromInput(value: unknown): unknown[] {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') return value.split(/[\s,;，；]+/).filter(Boolean)
  return []
}

router.post('/query', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    if (!requireAdmin(req, res, requestId)) return
    const result = await queryAndSaveRetailProduct(req.body?.productCode, req.body?.accountId)
    res.json({ ok: true, data: { result }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/tasks', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    if (!requireAdmin(req, res, requestId)) return
    const productCodes = req.body?.inputType === 'range'
      ? expandProductCodeRange(req.body?.startCode, req.body?.endCode)
      : normalizeProductCodes(valuesFromInput(req.body?.productCodes))
    const task = await createRetailProductQueryTask({
      productCodes,
      executionMode: req.body?.executionMode,
      concurrency: req.body?.concurrency,
      intervalMs: req.body?.intervalMs,
      accountId: req.body?.accountId,
    })
    res.status(201).json({ ok: true, data: { task }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.get('/tasks', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    if (!requireAdmin(req, res, requestId)) return
    res.json({ ok: true, data: { tasks: await listRetailProductQueryTasks(req.query.limit) }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.get('/tasks/:id', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    if (!requireAdmin(req, res, requestId)) return
    res.json({ ok: true, data: { task: await getRetailProductQueryTask(String(req.params.id)) }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/tasks/:id/cancel', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    if (!requireAdmin(req, res, requestId)) return
    res.json({ ok: true, data: { task: await cancelRetailProductQueryTask(String(req.params.id)) }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.get('/products', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    if (!requireAdmin(req, res, requestId)) return
    res.json({ ok: true, data: await listRetailProducts(req.query), requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.get('/products/:productCode', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    if (!requireAdmin(req, res, requestId)) return
    res.json({ ok: true, data: { product: await getRetailProduct(req.params.productCode) }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.delete('/products/:productCode', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    if (!requireAdmin(req, res, requestId)) return
    await deleteRetailProduct(req.params.productCode)
    res.json({ ok: true, data: { deleted: true }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.get('/schedules', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    if (!requireAdmin(req, res, requestId)) return
    res.json({ ok: true, data: { schedules: await listRetailProductQuerySchedules() }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.post('/schedules', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    if (!requireAdmin(req, res, requestId)) return
    const schedule = await createRetailProductQuerySchedule(req.body || {})
    res.status(201).json({ ok: true, data: { schedule }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.patch('/schedules/:id', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    if (!requireAdmin(req, res, requestId)) return
    const schedule = await updateRetailProductQuerySchedule(String(req.params.id), req.body?.enabled === true)
    res.json({ ok: true, data: { schedule }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

router.delete('/schedules/:id', async (req, res) => {
  const requestId = crypto.randomUUID()
  try {
    if (!requireAdmin(req, res, requestId)) return
    await deleteRetailProductQuerySchedule(String(req.params.id))
    res.json({ ok: true, data: { deleted: true }, requestId })
  } catch (error) {
    handleError(res, error, requestId)
  }
})

export default router

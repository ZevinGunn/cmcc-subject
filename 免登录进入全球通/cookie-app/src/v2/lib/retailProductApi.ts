import { requestApiData, requestApiJson } from './api'

export type RetailProduct = {
  productCode: string
  productId?: string
  productName?: string
  normCount: number
  content: Record<string, unknown>
  firstFoundAt: string
  lastFoundAt: string
  lastQueriedAt: string
  createdAt: string
  updatedAt: string
}

export type RetailProductQueryItem = {
  id: string
  productCode: string
  orderIndex: number
  status: 'pending' | 'running' | 'found' | 'not_found' | 'failed'
  message?: string
  errorCode?: string
  startedAt?: string
  finishedAt?: string
}

export type RetailProductQueryTask = {
  id: string
  source: 'manual' | 'scheduled'
  executionMode: 'sequential' | 'concurrent'
  status: 'pending' | 'running' | 'success' | 'partial_success' | 'failed' | 'cancelled'
  intervalMs: number
  concurrency: number
  totalCount: number
  completedCount: number
  foundCount: number
  notFoundCount: number
  failedCount: number
  currentCode?: string
  message?: string
  scheduleId?: string
  accountId?: string
  startedAt?: string
  finishedAt?: string
  createdAt: string
  updatedAt: string
  items: RetailProductQueryItem[]
}

export type RetailProductQuerySchedule = {
  id: string
  name: string
  enabled: boolean
  startCode: string
  endCode: string
  executionMode: 'sequential' | 'concurrent'
  queryIntervalMs: number
  concurrency: number
  runIntervalSec: number
  nextRunAt: string
  lastRunAt?: string
  createdAt: string
  updatedAt: string
  accountId?: string
}

export async function queryRetailProduct(productCode: string, accountId: string) {
  return requestApiJson<{ result: { productCode: string; status: 'found' | 'not_found'; message: string; product?: Record<string, unknown> } }>(
    '/api/retail-products/query', 'POST', { productCode, accountId },
  )
}

export async function createRetailProductTask(input: {
  inputType: 'codes' | 'range'
  productCodes?: string
  startCode?: string
  endCode?: string
  executionMode: 'sequential' | 'concurrent'
  concurrency: number
  intervalMs: number
  accountId: string
}) {
  return requestApiJson<{ task: RetailProductQueryTask }>('/api/retail-products/tasks', 'POST', input)
}

export async function listRetailProductTasks() {
  return requestApiData<{ tasks: RetailProductQueryTask[] }>('/api/retail-products/tasks?limit=50')
}

export async function getRetailProductTask(id: string) {
  return requestApiData<{ task: RetailProductQueryTask }>(`/api/retail-products/tasks/${encodeURIComponent(id)}`)
}

export async function cancelRetailProductTask(id: string) {
  return requestApiJson<{ task: RetailProductQueryTask }>(`/api/retail-products/tasks/${encodeURIComponent(id)}/cancel`, 'POST', {})
}

export async function listRetailProducts(query = '', page = 1) {
  const params = new URLSearchParams({ query, page: String(page), pageSize: '50' })
  return requestApiData<{ products: RetailProduct[]; total: number; page: number; pageSize: number }>(`/api/retail-products/products?${params}`)
}

export async function deleteRetailProduct(productCode: string) {
  return requestApiJson<{ deleted: boolean }>(`/api/retail-products/products/${encodeURIComponent(productCode)}`, 'DELETE')
}

export async function listRetailProductSchedules() {
  return requestApiData<{ schedules: RetailProductQuerySchedule[] }>('/api/retail-products/schedules')
}

export async function createRetailProductSchedule(input: {
  name: string
  startCode: string
  endCode: string
  executionMode: 'sequential' | 'concurrent'
  concurrency: number
  queryIntervalMs: number
  runIntervalSec: number
  accountId: string
}) {
  return requestApiJson<{ schedule: RetailProductQuerySchedule }>('/api/retail-products/schedules', 'POST', input)
}

export async function toggleRetailProductSchedule(id: string, enabled: boolean) {
  return requestApiJson<{ schedule: RetailProductQuerySchedule }>(`/api/retail-products/schedules/${encodeURIComponent(id)}`, 'PATCH', { enabled })
}

export async function deleteRetailProductSchedule(id: string) {
  return requestApiJson<{ deleted: boolean }>(`/api/retail-products/schedules/${encodeURIComponent(id)}`, 'DELETE')
}

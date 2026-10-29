export class QuickOrderError extends Error {
  constructor(message, code = 'QUICK_ORDER_ERROR', status = 400, details = {}) {
    super(message)
    this.name = 'QuickOrderError'
    this.code = code
    this.status = status
    this.details = details
  }
}

export function assertQuickOrder(condition, message, code, status = 400, details = {}) {
  if (!condition) throw new QuickOrderError(message, code, status, details)
}

export function isUncertainNetworkError(error) {
  const code = String(error?.code || '')
  const message = error instanceof Error ? error.message : String(error || '')
  return /ECONNRESET|ETIMEDOUT|ECONNABORTED|EPIPE|UND_ERR|socket|timed out|timeout|connection/i.test(`${code} ${message}`)
}

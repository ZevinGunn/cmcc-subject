import { mkdir, appendFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const logFile = resolve(__dirname, '../../logs/app.log')

function redactValue(key, value) {
  const name = String(key || '').toLowerCase()
  if (value === undefined) return undefined
  if (value === null) return null
  if (
    name.includes('password') ||
    name.includes('token') ||
    name.includes('authorization') ||
    name.includes('cookie') ||
    name.includes('key') ||
    name.includes('secret') ||
    name.includes('captcha') ||
    name.includes('encipherparam') ||
    (name !== 'errorcode' &&
      (name === 'code' || name === 'inputcode' || name === 'randomcode' || name.includes('smscode') || name.includes('verifycode') || name.includes('verificationcode'))) ||
    name.includes('identity') ||
    name.includes('idcard') ||
    name === 'id' ||
    name.includes('name') ||
    name.includes('address')
  ) {
    const text = String(value)
    return text ? `[REDACTED len=${text.length}]` : ''
  }
  if (name.includes('phone') || name.includes('mobile') || name.includes('account')) {
    const text = String(value)
    return text.length >= 7 ? `${text.slice(0, 3)}****${text.slice(-4)}` : '[REDACTED]'
  }
  if (typeof value === 'string' && value.length > 1000) return `${value.slice(0, 1000)}...[TRUNCATED len=${value.length}]`
  return value
}

export function sanitize(input, depth = 0) {
  if (depth > 4) return '[MAX_DEPTH]'
  if (Array.isArray(input)) return input.slice(0, 30).map((item) => sanitize(item, depth + 1))
  if (!input || typeof input !== 'object') return input
  const out = {}
  for (const [key, value] of Object.entries(input)) {
    const redacted = redactValue(key, value)
    out[key] = redacted === value ? sanitize(value, depth + 1) : redacted
  }
  return out
}

export async function logEvent(type, payload = {}) {
  const entry = {
    ts: new Date().toISOString(),
    type,
    ...sanitize(payload),
  }
  try {
    await mkdir(dirname(logFile), { recursive: true })
    await appendFile(logFile, `${JSON.stringify(entry)}\n`, 'utf8')
  } catch (error) {
    console.error('write log failed', error)
  }
}

export function createRequestId() {
  return randomUUID().replaceAll('-', '')
}

export { logFile }

import { QuickOrderError } from '../errors.js'

export function text(value, maxLength = 3000) {
  return String(value ?? '').trim().slice(0, maxLength)
}

export function record(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

export function array(value) {
  return Array.isArray(value) ? value : []
}

export function maskPhone(phone) {
  const value = text(phone, 20)
  return /^1\d{10}$/.test(value) ? `${value.slice(0, 3)}****${value.slice(-4)}` : '当前账号'
}

export function parseNestedJson(value, maxDepth = 3) {
  let current = value
  for (let index = 0; index < maxDepth && typeof current === 'string'; index += 1) {
    try {
      current = JSON.parse(current)
    } catch {
      break
    }
  }
  return current
}

export function requireUpstream(condition, message, code = 'UPSTREAM_REJECTED', details = {}) {
  if (!condition) throw new QuickOrderError(message, code, 424, details)
}

export function beijingTime(date = new Date()) {
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}:${values.second}`
}

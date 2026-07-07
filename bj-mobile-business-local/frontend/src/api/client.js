function redactBody(body = {}) {
  const out = { ...body }
  for (const key of Object.keys(out)) {
    const lower = key.toLowerCase()
    if (lower.includes('code') || lower.includes('captcha') || lower.includes('token')) out[key] = '[REDACTED]'
    if (lower.includes('phone')) out[key] = String(out[key]).replace(/^(\d{3})\d{4}(\d+)/, '$1****$2')
  }
  return out
}

function logFrontend(type, payload = {}) {
  const body = JSON.stringify({
    ts: new Date().toISOString(),
    type,
    ...payload,
  })
  fetch('/api/logs/frontend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon('/api/logs/frontend', blob)
    }
  })
}

async function request(path, options = {}) {
  const startedAt = Date.now()
  logFrontend('frontend:request', {
    path,
    method: options.method || 'GET',
    body: redactBody(options.body),
  })
  const res = await fetch(`/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  logFrontend('frontend:response', {
    path,
    method: options.method || 'GET',
    status: res.status,
    durationMs: Date.now() - startedAt,
    ok: data.ok,
    errorCode: data.errorCode || '',
    message: data.message || '',
    sessionId: data.data?.session?.id || data.session?.id || options.body?.sessionId || '',
  })
  if (!data.ok) {
    const error = new Error(data.message || '请求失败')
    error.payload = data
    logFrontend('frontend:error', {
      path,
      method: options.method || 'GET',
      message: error.message,
      errorCode: data.errorCode || '',
      raw: data.raw,
    })
    throw error
  }
  return data.data
}

export const api = {
  createSession() {
    return request('/auth/session', { method: 'POST' })
  },
  prepare(body) {
    return request('/auth/prepare', { method: 'POST', body })
  },
  getSession(sessionId) {
    return request(`/auth/session?sessionId=${encodeURIComponent(sessionId)}`)
  },
  getCaptcha(sessionId) {
    return request(`/auth/captcha?sessionId=${encodeURIComponent(sessionId)}`)
  },
  sendSms(body) {
    return request('/auth/send-sms', { method: 'POST', body })
  },
  login(body) {
    return request('/auth/login', { method: 'POST', body })
  },
  setWafToken(body) {
    return request('/auth/waf-token', { method: 'POST', body })
  },
  queryBusiness(body) {
    return request('/business/query', { method: 'POST', body })
  },
  unsubscribe(body) {
    return request('/business/unsubscribe', { method: 'POST', body })
  },
  logout(sessionId) {
    return fetch(`/api/auth/session/${encodeURIComponent(sessionId)}`, { method: 'DELETE' })
  },
  cryptoDebug(body) {
    return request('/debug/crypto', { method: 'POST', body })
  },
  getCryptoDebugSession(sessionId) {
    return request(`/debug/crypto/session/${encodeURIComponent(sessionId)}`)
  },
}

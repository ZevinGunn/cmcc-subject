function redactBody(body = {}) {
  const out = { ...body }
  for (const key of Object.keys(out)) {
    const lower = key.toLowerCase()
    if (lower.includes('code') || lower.includes('captcha') || lower.includes('token') || lower.includes('cookie')) out[key] = '[REDACTED]'
    if (lower.includes('phone')) out[key] = String(out[key]).replace(/^(\d{3})\d{4}(\d+)/, '$1****$2')
  }
  return out
}

function requestBodyForLog(path, body = {}) {
  if (path.startsWith('/debug/crypto')) {
    return {
      mode: body.mode || '',
      operation: body.operation || '',
      hasInput: Boolean(body.input),
      hasSessionId: Boolean(body.sessionId),
      omitted: '[CRYPTO_INPUT_AND_KEYS_OMITTED]',
    }
  }
  if (path.startsWith('/custom-orders')) {
    return {
      sessionId: body.sessionId || '',
      hasConfig: Boolean(body.config),
      hasOtp: Boolean(body.smsCode),
      agreed: body.agreed === true,
      omitted: '[CUSTOM_ORDER_CONFIG_AND_SMS_OMITTED]',
    }
  }
  if (path.startsWith('/quick-orders')) {
    return {
      platform: body.platform || '',
      hasAuth: Boolean(body.auth),
      hasOption: Boolean(body.optionId),
      hasSmsCode: Boolean(body.smsCode),
      agreed: body.agreed === true,
      realOrderConfirmed: body.realOrderConfirmed === true,
      omitted: '[QUICK_ORDER_CREDENTIALS_AND_CODES_OMITTED]',
    }
  }
  return redactBody(body)
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
    body: requestBodyForLog(path, options.body),
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
  cryptoTransform(body) {
    return request('/debug/crypto/transform', { method: 'POST', body })
  },
  queryShopBusiness(body) {
    return request('/shop-business/query', { method: 'POST', body })
  },
  sendShopUnsubscribeSms(body) {
    return request('/shop-business/unsubscribe/sms', { method: 'POST', body })
  },
  unsubscribeShopBusiness(body) {
    return request('/shop-business/unsubscribe', { method: 'POST', body })
  },
  listActivities() {
    return request('/activities')
  },
  checkActivity(id, body) {
    return request(`/activities/${encodeURIComponent(id)}/check`, { method: 'POST', body })
  },
  previewActivity(id, body) {
    return request(`/activities/${encodeURIComponent(id)}/preview`, { method: 'POST', body })
  },
  subscribeActivity(id, body) {
    return request(`/activities/${encodeURIComponent(id)}/subscribe`, { method: 'POST', body })
  },
  initializeCustomOrder(body) {
    return request('/custom-orders/initialize', { method: 'POST', body })
  },
  previewCustomOrder(body) {
    return request('/custom-orders/preview', { method: 'POST', body })
  },
  submitCustomOrder(body) {
    return request('/custom-orders/submit', { method: 'POST', body })
  },
  sendCustomOrderSms(orderId, body) {
    return request(`/custom-orders/${encodeURIComponent(orderId)}/sms/send`, { method: 'POST', body })
  },
  verifyCustomOrderSms(orderId, body) {
    return request(`/custom-orders/${encodeURIComponent(orderId)}/sms/verify`, { method: 'POST', body })
  },
  getQuickOrderCatalog() {
    return request('/quick-orders/catalog')
  },
  createQuickOrderSession(body) {
    return request('/quick-orders/sessions', { method: 'POST', body })
  },
  getQuickOrderSession(id) {
    return request(`/quick-orders/sessions/${encodeURIComponent(id)}`)
  },
  sendQuickOrderAuthSms(id) {
    return request(`/quick-orders/sessions/${encodeURIComponent(id)}/auth/sms/send`, { method: 'POST' })
  },
  verifyQuickOrderAuth(id, body) {
    return request(`/quick-orders/sessions/${encodeURIComponent(id)}/auth/verify`, { method: 'POST', body })
  },
  prepareQuickOrder(id) {
    return request(`/quick-orders/sessions/${encodeURIComponent(id)}/prepare`, { method: 'POST' })
  },
  selectQuickOrder(id, body) {
    return request(`/quick-orders/sessions/${encodeURIComponent(id)}/select`, { method: 'POST', body })
  },
  sendQuickOrderSms(id, body) {
    return request(`/quick-orders/sessions/${encodeURIComponent(id)}/sms/send`, { method: 'POST', body })
  },
  confirmQuickOrder(id, body) {
    return request(`/quick-orders/sessions/${encodeURIComponent(id)}/confirm`, { method: 'POST', body })
  },
  deleteQuickOrderSession(id) {
    return fetch(`/api/quick-orders/sessions/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
}

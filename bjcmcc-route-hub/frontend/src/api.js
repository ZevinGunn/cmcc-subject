async function request(path, options = {}) {
  const response = await fetch(path, { credentials: 'same-origin', ...options })
  if (response.status === 204) return null
  const body = await response.json().catch(() => ({}))
  if (!response.ok || body.ok === false) {
    const error = new Error(body.message || `请求失败：HTTP ${response.status}`)
    error.status = response.status
    error.code = body.error
    throw error
  }
  return body.data
}

export const api = {
  catalog: (type = 'business') => request(`/api/catalog?type=${encodeURIComponent(type)}`),
  adminSession: () => request('/api/admin/session'),
  login: (password) => request('/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password }),
  }),
  logout: () => request('/api/admin/logout', { method: 'POST' }),
  imports: (type = 'business') => request(`/api/admin/imports?type=${encodeURIComponent(type)}`),
  upload: (file, type = 'business') => file.text().then((text) => request(`/api/admin/imports/upload?type=${encodeURIComponent(type)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/javascript', 'x-source-name': file.name },
    body: text,
  })),
  sync: (type = 'business') => request(`/api/admin/imports/sync?type=${encodeURIComponent(type)}`, { method: 'POST' }),
  apply: (id) => request(`/api/admin/imports/${encodeURIComponent(id)}/apply`, { method: 'POST' }),
  discard: (id) => request(`/api/admin/imports/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  rollback: (type = 'business') => request(`/api/admin/imports/rollback?type=${encodeURIComponent(type)}`, { method: 'POST' }),
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || `请求失败：HTTP ${response.status}`);
  }
  return data;
}

export function getProducts() {
  return request('/api/products');
}

export function resolveLayout(input) {
  return request(`/api/layout/resolve?code=${encodeURIComponent(input)}`);
}

export function getSkuType(payload) {
  return request('/api/sku/type', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function sendSms(payload) {
  return request('/api/sms/send', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getC1(params) {
  const search = new URLSearchParams(params);
  return request(`/api/risk/c1?${search.toString()}`);
}

export function packageLoginCheck(payload) {
  return request('/api/package/login-check', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function directOrder(payload) {
  return request('/api/order/direct', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

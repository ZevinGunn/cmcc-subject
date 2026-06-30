import { buildPageReferer, config } from './config.js';

function buildHeaders({ referer, channelCode, contentType = 'application/json;charset=UTF-8' } = {}) {
  const pageReferer = buildPageReferer(referer, channelCode);
  return {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': contentType,
    Origin: config.cocBaseUrl,
    Referer: pageReferer,
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
  };
}

function buildPackageReferer({ referer, pageId, channelCode }) {
  const page = referer || 'xbklhhy';
  const params = new URLSearchParams();
  if (pageId) params.set('pageId', pageId);
  if (channelCode) params.set('channelId', channelCode);
  const suffix = params.toString() ? `?${params.toString()}` : '';
  return `${config.cocBaseUrl}/coc/canvas/package-h5-canvas/online/${encodeURIComponent(page)}${suffix}`;
}

function buildPackageHeaders({ referer, pageId, channelCode, contentType = 'application/json;charset=UTF-8' } = {}) {
  return {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': contentType,
    Origin: config.cocBaseUrl,
    Referer: buildPackageReferer({ referer, pageId, channelCode }),
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
  };
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    try {
      return JSON.parse(Buffer.from(text, 'base64').toString('utf8'));
    } catch {
      return { raw: text };
    }
  }
}

async function requestJson(pathOrUrl, { method = 'GET', body, referer, channelCode, headers } = {}) {
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${config.cocBaseUrl}${pathOrUrl}`;
  const response = await fetch(url, {
    method,
    headers: {
      ...buildHeaders({ referer, channelCode }),
      ...headers
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const data = await parseResponse(response);
  if (!response.ok) {
    const error = Object.assign(new Error(`COC 请求失败：HTTP ${response.status}`), {
      status: 502,
      upstreamStatus: response.status,
      data
    });
    throw error;
  }
  return data;
}

async function requestPackageJson(path, { method = 'POST', body, referer, pageId, channelCode, headers } = {}) {
  const response = await fetch(`${config.cocBaseUrl}/coc${path}`, {
    method,
    headers: {
      ...buildPackageHeaders({ referer, pageId, channelCode }),
      ...headers
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const data = await parseResponse(response);
  if (!response.ok) {
    throw Object.assign(new Error(`COC package 请求失败：HTTP ${response.status}`), {
      status: 502,
      upstreamStatus: response.status,
      data
    });
  }
  return data;
}

export function getSkuType(skuId, options = {}) {
  return requestJson('/coc3/coc3-market-member/api/member/getSkuType', {
    method: 'POST',
    body: { skuId: String(skuId) },
    ...options
  });
}

export function sendSms(payload, options = {}) {
  return requestJson('/coc3/coc3-market/api/sms/qwSendSmsCode', {
    method: 'POST',
    body: payload,
    ...options
  });
}

export function directOrder(payload, options = {}) {
  return requestJson('/coc3/coc3-market-order/api/external/order/directOrder', {
    method: 'POST',
    body: payload,
    ...options
  });
}

export async function getC1Token({ referer, channelCode } = {}) {
  const response = await fetch(config.c1Url, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      Origin: config.cocBaseUrl,
      Referer: buildPageReferer(referer, channelCode),
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    }
  });
  const data = await parseResponse(response);
  if (!response.ok) {
    throw Object.assign(new Error(`c1 请求失败：HTTP ${response.status}`), {
      status: 502,
      data
    });
  }
  return data;
}

export function packageSmsCode(body, options = {}) {
  return requestPackageJson('/user/smsCode', {
    body,
    ...options
  });
}

export function packageLoginCheck(body, options = {}) {
  return requestPackageJson('/user/loginCheck', {
    body,
    ...options
  });
}

export function packageBookProduct(body, options = {}) {
  return requestPackageJson('/pkg/order/bookProduct', {
    body,
    ...options
  });
}

export { buildPackageReferer };

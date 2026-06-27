export function ok(res, data, extra = {}) {
  res.json({ ok: true, data, ...extra })
}

export function fail(res, status, message, errorCode = 'ERROR', extra = {}) {
  res.status(status).json({ ok: false, message, errorCode, ...extra })
}

export function upstream(res, result, fallbackMessage = '移动侧接口调用失败') {
  if (result?.ok) return ok(res, result.data, { raw: result.raw })
  return fail(res, 200, result?.message || fallbackMessage, result?.errorCode || 'UPSTREAM_ERROR', {
    raw: result?.raw,
  })
}

export function parseCookieHeader(cookie: string): Map<string, string> {
  const map = new Map<string, string>()
  const parts = String(cookie || '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
  for (const p of parts) {
    const idx = p.indexOf('=')
    if (idx <= 0) continue
    const k = p.slice(0, idx).trim()
    const v = p.slice(idx + 1).trim()
    if (!k) continue
    map.set(k, v)
  }
  return map
}

export function parseSetCookieToPairs(setCookie: string | string[] | undefined): Map<string, string> {
  const map = new Map<string, string>()
  const list = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : []
  for (const line of list) {
    const firstPart = String(line).split(';', 1)[0] ?? ''
    const idx = firstPart.indexOf('=')
    if (idx <= 0) continue
    const k = firstPart.slice(0, idx).trim()
    const v = firstPart.slice(idx + 1).trim()
    if (!k) continue
    map.set(k, v)
  }
  return map
}

export function buildCookieHeader(pairs: Map<string, string>): string {
  const list: string[] = []
  for (const [k, v] of pairs.entries()) {
    list.push(`${k}=${v}`)
  }
  return list.join('; ')
}

export function mergeCookieWithSetCookie(args: {
  cookie: string
  setCookie: string | string[] | undefined
}): {
  cookie: string
  changed: boolean
} {
  const base = parseCookieHeader(args.cookie)
  const patch = parseSetCookieToPairs(args.setCookie)
  let changed = false
  for (const [k, v] of patch.entries()) {
    const prev = base.get(k)
    if (prev !== v) {
      base.set(k, v)
      changed = true
    }
  }
  return { cookie: buildCookieHeader(base), changed }
}

export const __test__ = {
  parseCookieHeader,
  parseSetCookieToPairs,
  buildCookieHeader,
  mergeCookieWithSetCookie,
}



export async function getCookieHeader(jar, url) {
  return jar.getCookieString(url)
}

export async function getCookies(jar, url) {
  return jar.getCookies(url)
}

export async function setCookiesFromResponse(jar, url, headers) {
  const setCookie = headers?.['set-cookie']
  if (!setCookie) return
  const values = Array.isArray(setCookie) ? setCookie : [setCookie]
  await Promise.all(values.map((cookie) => jar.setCookie(cookie, url)))
}

export async function setBrowserCookies(jar, cookies = []) {
  await Promise.all(
    cookies.map((cookie) => {
      const domain = String(cookie.domain || '').replace(/^\./, '')
      const origin = `${cookie.secure === false ? 'http' : 'https'}://${domain || 'service.bj.10086.cn'}`
      const parts = [
        `${cookie.name}=${cookie.value}`,
        `Path=${cookie.path || '/'}`,
        cookie.domain ? `Domain=${cookie.domain}` : '',
        cookie.expires && cookie.expires > 0 ? `Expires=${new Date(cookie.expires * 1000).toUTCString()}` : '',
        cookie.httpOnly ? 'HttpOnly' : '',
        cookie.secure ? 'Secure' : '',
        normalizeSameSite(cookie.sameSite) ? `SameSite=${normalizeSameSite(cookie.sameSite)}` : '',
      ].filter(Boolean)
      return jar.setCookie(parts.join('; '), origin)
    }),
  )
}

function normalizeSameSite(value) {
  const raw = String(value || '').trim().toLowerCase()
  if (!raw) return ''
  if (raw === 'strict') return 'Strict'
  if (raw === 'lax') return 'Lax'
  if (raw === 'none' || raw === 'no_restriction') return 'None'
  return ''
}

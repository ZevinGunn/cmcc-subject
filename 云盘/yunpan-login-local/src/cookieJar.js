export function getSetCookieLines(headers) {
  if (typeof headers?.getSetCookie === 'function') {
    return headers.getSetCookie();
  }
  const combined = headers?.get?.('set-cookie');
  return combined ? splitSetCookieHeader(combined) : [];
}

export function splitSetCookieHeader(value) {
  return String(value)
    .split(/,(?=\s*[^;,=\s]+=[^;,]*)/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseSetCookie(line) {
  const [pair] = String(line).split(';');
  const index = pair.indexOf('=');
  if (index <= 0) return null;
  return {
    name: pair.slice(0, index).trim(),
    value: pair.slice(index + 1).trim()
  };
}

export function absorbSetCookieLines(cookieJar, lines, upstreamCookieNames = new Set()) {
  for (const line of lines) {
    const cookie = parseSetCookie(line);
    if (!cookie) continue;
    upstreamCookieNames.add(cookie.name);
    if (isExpiredSetCookie(line, cookie.value)) {
      cookieJar.delete(cookie.name);
    } else {
      cookieJar.set(cookie.name, cookie.value);
    }
  }
  return cookieJar;
}

export function selectCookieJar(cookieJar, cookieNames) {
  const selected = new Map();
  for (const name of cookieNames) {
    if (cookieJar.has(name)) selected.set(name, cookieJar.get(name));
  }
  return selected;
}

export function serializeCookieJar(cookieJar) {
  return Array.from(cookieJar.entries())
    .filter(([name]) => Boolean(name))
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
}

function isExpiredSetCookie(line, value) {
  if (/;\s*max-age\s*=\s*0(?:;|$)/i.test(String(line))) return true;
  const expires = String(line).match(/;\s*expires\s*=\s*([^;]+)/i)?.[1];
  return !value && (!expires || Number.isFinite(Date.parse(expires)) && Date.parse(expires) <= Date.now());
}

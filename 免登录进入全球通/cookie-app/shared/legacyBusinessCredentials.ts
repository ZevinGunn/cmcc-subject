// Accept copied request Cookie headers and one-pair-per-line CK without allowing
// unrelated HTTP headers to become cookie names. Never include credentials in errors.
export function normalizeLegacyCookieInput(input: string): string {
  if (input.length > 16_384) throw new Error('CK 长度超出限制，请只复制 Cookie 请求头内容')
  const text = input.trim().replace(/^cookie\s*:\s*/i, '')
  if (!text) return ''
  const pairs = new Map<string, string>()
  for (const part of text.split(/[;\r\n]+/).map(value => value.trim()).filter(Boolean)) {
    if (/^(?:httponly|secure)$/i.test(part)) continue
    const index = part.indexOf('=')
    const name = part.slice(0, index).trim()
    const value = part.slice(index + 1).trim()
    if (index < 1 || !/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/.test(name) || /[^\x20-\x7e]/.test(value)) {
      throw new Error('CK 格式不正确，请粘贴 Cookie 请求头或 key=value 格式的 CK')
    }
    pairs.set(name, value)
  }
  if (!pairs.size) throw new Error('CK 内容为空，请重新复制')
  const cookie = [...pairs].map(([name, value]) => `${name}=${value}`).join('; ')
  if (cookie.length > 16_384) throw new Error('CK 长度超出限制，请只复制 Cookie 请求头内容')
  return cookie
}

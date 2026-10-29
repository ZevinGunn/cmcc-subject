const HTML_MARKUP = /<!doctype\b|<\/?(?:html|head|body|title|h[1-6]|div|p|span|center|br|hr|script|style)\b[^>]*>/i

function decodeEntities(text: string): string {
  const named: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
  return text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, key: string) => {
    if (!key.startsWith('#')) return named[key.toLowerCase()] ?? entity
    const n = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : Number(key.slice(1))
    return n > 0 && n <= 0x10ffff && !(n >= 0xd800 && n <= 0xdfff) ? String.fromCodePoint(n) : ''
  })
}

function plainText(html: string): string {
  // This produces display text only; it must never be inserted as HTML.
  return decodeEntities(html.replace(/<[^>]*(?:>|$)/g, ' '))
    .replace(/<[^>]*(?:>|$)/g, ' ')
    .replace(/[\u0000-\u001f\u007f\s]+/g, ' ').trim()
}

export function extractUpstreamHtmlError(message: string, status?: number | string): string | null {
  const source = decodeEntities(decodeEntities(String(message || '').slice(0, 65536)))
  if (!HTML_MARKUP.test(source)) return null
  const html = source
    .replace(/<!--[\s\S]*?(?:-->|$)/g, '')
    .replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?(?:<\/\1\s*>|$)/gi, '')
  const heading = plainText(html.match(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]\s*>/i)?.[1] || '')
  const title = plainText(html.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i)?.[1] || '')
  const paragraphs = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p\s*>/gi)].map(m => plainText(m[1])).filter(Boolean)
  const body = plainText((html.match(/<body\b[^>]*>([\s\S]*?)(?:<\/body\s*>|$)/i)?.[1] || html)
    .replace(/<head\b[^>]*>[\s\S]*?(?:<\/head\s*>|$)/gi, '')
    .replace(/<title\b[^>]*>[\s\S]*?<\/title\s*>/gi, ''))
  const details = [...new Set([heading || title, ...paragraphs])].filter(Boolean)
  const detail = (details.length ? details.join('；') : body)
    .replace(/\b(?:openresty|nginx|apache)(?:\/[\d.]+)?\b/gi, '').trim().slice(0, 240)
  const suppliedCode = Number(status)
  const embeddedCode = Number(source.match(/HTTP\s*[（(:]?\s*([45]\d{2})/i)?.[1] || `${heading} ${title}`.match(/\b([45]\d{2})\b/)?.[1])
  const code = suppliedCode >= 100 && suppliedCode <= 599 ? suppliedCode : embeddedCode >= 400 && embeddedCode <= 599 ? embeddedCode : undefined
  const descriptions: Record<number, string> = {
    401: '移动侧登录验证未通过', 403: '移动侧拒绝了请求', 404: '移动侧接口未找到',
    405: '移动侧不支持此请求方式', 408: '移动侧请求超时', 429: '移动侧请求过于频繁',
    500: '移动侧服务发生错误', 502: '移动侧网关响应异常', 503: '移动侧服务暂不可用', 504: '移动侧网关请求超时',
  }
  const summary = (code && descriptions[code]) || '移动侧返回了异常页面，未取得有效接口结果'
  return `${summary}${code ? `（HTTP ${code}）` : ''}${detail ? `：${detail}` : ''}`
}

export function formatUpstreamErrorMessage(message: string, status?: number | string): string {
  return extractUpstreamHtmlError(message, status) ?? message
}

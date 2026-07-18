const exactTemplatePattern = /^\{\{\s*([^}]+?)\s*\}\}$/
const templatePattern = /\{\{\s*([^}]+?)\s*\}\}/g

function readPath(context, path) {
  return String(path || '')
    .split('.')
    .reduce((value, key) => (value == null ? undefined : value[key]), context)
}

function renderString(template, context) {
  const exact = template.match(exactTemplatePattern)
  if (exact) return readPath(context, exact[1]) ?? ''
  return template.replace(templatePattern, (_match, path) => String(readPath(context, path) ?? ''))
}

export function renderTemplate(value, context) {
  if (typeof value === 'string') return renderString(value, context)
  if (Array.isArray(value)) return value.map((item) => renderTemplate(item, context))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, renderTemplate(item, context)]))
  }
  return value
}

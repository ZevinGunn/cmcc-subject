import { createHash } from 'node:crypto'
import { parse } from 'acorn'

function propertyName(property) {
  if (!property || property.type !== 'Property') return ''
  if (!property.computed && property.key?.type === 'Identifier') return property.key.name
  if (property.key?.type === 'Literal') return String(property.key.value)
  return ''
}

function propertyOf(object, name) {
  if (object?.type !== 'ObjectExpression') return null
  return object.properties.find((property) => propertyName(property) === name) || null
}

function staticValue(node) {
  if (!node) return undefined
  if (node.type === 'Literal') return node.value
  if (node.type === 'UnaryExpression') {
    const value = staticValue(node.argument)
    if (node.operator === '!') return !value
    if (node.operator === '+' && typeof value === 'number') return value
    if (node.operator === '-' && typeof value === 'number') return -value
  }
  return undefined
}

function findImport(node) {
  let result = ''
  walk(node, (child) => {
    if (result || child.type !== 'ImportExpression') return
    const value = staticValue(child.source)
    if (typeof value === 'string') result = value
  })
  return result
}

function walk(node, visitor) {
  if (!node || typeof node !== 'object') return
  if (typeof node.type === 'string') visitor(node)
  for (const [key, value] of Object.entries(node)) {
    if (key === 'start' || key === 'end' || key === 'loc') continue
    if (Array.isArray(value)) {
      for (const child of value) walk(child, visitor)
    } else if (value && typeof value === 'object') {
      walk(value, visitor)
    }
  }
}

function pageType(route) {
  const value = `${route.path} ${route.name}`.toLowerCase()
  const patterns = [
    ['success', /(success|succeed|succ(?:ess)?|succe|result)$/],
    ['failure', /(fail(?:ure)?|error|erro)$/],
    ['detail', /(detail|info|agreement|protocol|rule|explain|hint)$/],
    ['list', /(list|query|search|select)$/],
  ]
  return patterns.find(([, pattern]) => pattern.test(value))?.[0] || 'main'
}

function hash(value) {
  return createHash('sha256').update(value).digest('hex')
}

function normalizeRoute(candidate, baseUrl) {
  const path = candidate.path.startsWith('/') ? candidate.path : `/${candidate.path}`
  const normalized = {
    path,
    name: candidate.name.trim(),
    title: candidate.title.trim(),
    requireAuth: Boolean(candidate.requireAuth),
    component: candidate.component,
  }
  const signature = JSON.stringify(normalized)
  return {
    id: hash(signature).slice(0, 20),
    routeKey: hash(`${path}\0${normalized.name}`).slice(0, 20),
    ...normalized,
    displayName: normalized.title || normalized.name || path,
    pageType: pageType(normalized),
    url: `${baseUrl}${path}`,
    sourceOccurrences: [candidate.sourceOffset],
  }
}

function normalizeRightsPath(value) {
  if (value === '/') return '/'
  return `/${String(value).replace(/^\/+|\/+$/g, '')}`
}

function rightsCategory(path) {
  const first = path.replace(/^\//, '').split('/')[0].toLowerCase()
  if (['activity', 'act', 'spring-days'].includes(first)) return 'activity'
  if (/(plus|member|vip)/i.test(first)) return 'member'
  if (['myvoucher', 'redeem', 'orderlist'].includes(first)) return 'voucher'
  if (['lifezone', 'phonezone', 'sportzone', 'mzone', 'specialclassify'].includes(first)) return 'zone'
  return 'other'
}

function readableRightsName(path, id) {
  const value = path === '/' ? '首页' : path.replace(/^\//, '').split('/').at(-1)
  return value || id.replace(/\/index$/, '').split('/').at(-1) || path
}

function rightsInternal(path, hasMappedTitle) {
  if (hasMappedTitle) return false
  return /(^|\/)(common|components?|commponents|hooks?|stores?|types?|utils?|constants?|services?|models?)(\/|$)/i.test(path)
}

export function parseRightsRoutes(source, { baseUrl }) {
  let ast
  try {
    ast = parse(source, { ecmaVersion: 'latest', sourceType: 'script', allowHashBang: true })
  } catch (error) {
    const wrapped = new Error(`JavaScript 解析失败：${error.message}`)
    wrapped.code = 'INVALID_JAVASCRIPT'
    throw wrapped
  }

  const rawRoutes = []
  const titleMappings = new Map()
  walk(ast, (node) => {
    if (node.type !== 'ObjectExpression') return
    const routePath = staticValue(propertyOf(node, 'path')?.value)
    const routeId = staticValue(propertyOf(node, 'id')?.value)
    const parentId = staticValue(propertyOf(node, 'parentId')?.value)
    if (typeof routePath === 'string' && typeof routeId === 'string' && parentId === '@@/global-layout') {
      rawRoutes.push({ path: routePath, id: routeId, sourceOffset: node.start })
    }

    const pageName = staticValue(propertyOf(node, 'pageName')?.value)
    const pathName = staticValue(propertyOf(node, 'pathName')?.value)
    if (typeof pageName === 'string' && typeof pathName === 'string') {
      const key = normalizeRightsPath(pathName)
      const values = titleMappings.get(key) || []
      if (!values.includes(pageName.trim())) values.push(pageName.trim())
      titleMappings.set(key, values)
    }
  })

  if (!rawRoutes.length) {
    const error = new Error('未找到符合 path/id/parentId 结构的 Umi 页面路由')
    error.code = 'NO_ROUTES_FOUND'
    throw error
  }

  const unique = new Map()
  for (const candidate of rawRoutes.filter((route) => route.path !== '*')) {
    const path = normalizeRightsPath(candidate.path)
    const titles = titleMappings.get(path) || []
    const title = titles[0] || ''
    const internal = rightsInternal(path, Boolean(title))
    const normalized = {
      path,
      name: candidate.id.replace(/\/index$/, ''),
      title,
      aliases: titles.slice(1),
      requireAuth: false,
      component: candidate.id,
      internal,
      category: rightsCategory(path),
    }
    const signature = JSON.stringify(normalized)
    const id = hash(`rights:${signature}`).slice(0, 20)
    const existing = unique.get(id)
    if (existing) {
      existing.sourceOccurrences.push(candidate.sourceOffset)
      continue
    }
    unique.set(id, {
      id,
      routeKey: hash(`rights:${path}\0${normalized.name}`).slice(0, 20),
      ...normalized,
      displayName: title || readableRightsName(path, candidate.id),
      pageType: internal ? 'internal' : 'main',
      url: `${baseUrl}${path}`,
      sourceOccurrences: [candidate.sourceOffset],
    })
  }

  const routes = [...unique.values()].sort((a, b) =>
    Number(a.internal) - Number(b.internal)
      || a.displayName.localeCompare(b.displayName, 'zh-CN')
      || a.path.localeCompare(b.path),
  )
  const byPath = new Map()
  for (const route of routes) {
    const values = byPath.get(route.path) || []
    values.push(route)
    byPath.set(route.path, values)
  }
  const conflicts = [...byPath.entries()]
    .filter(([, values]) => values.length > 1)
    .map(([path, values]) => ({ path, routeIds: values.map((route) => route.id) }))

  return {
    routes,
    conflicts,
    stats: {
      rawRoutes: rawRoutes.length,
      logicalRoutes: routes.length,
      uniquePaths: byPath.size,
      exactDuplicates: rawRoutes.filter((route) => route.path !== '*').length - routes.length,
      pathConflicts: conflicts.length,
      authRequired: 0,
      publicRoutes: routes.filter((route) => !route.internal).length,
      internalRoutes: routes.filter((route) => route.internal).length,
      namedRoutes: routes.filter((route) => route.title).length,
      emptyTitles: routes.filter((route) => !route.title).length,
      excludedWildcards: rawRoutes.filter((route) => route.path === '*').length,
    },
  }
}

export function parseRoutes(source, { baseUrl }) {
  let ast
  try {
    ast = parse(source, { ecmaVersion: 'latest', sourceType: 'module', allowHashBang: true })
  } catch (error) {
    const wrapped = new Error(`JavaScript 解析失败：${error.message}`)
    wrapped.code = 'INVALID_JAVASCRIPT'
    throw wrapped
  }

  const candidates = []
  walk(ast, (node) => {
    if (node.type !== 'ObjectExpression') return
    const pathValue = staticValue(propertyOf(node, 'path')?.value)
    const nameValue = staticValue(propertyOf(node, 'name')?.value)
    const metaNode = propertyOf(node, 'meta')?.value
    if (typeof pathValue !== 'string' || !pathValue.startsWith('/')) return
    if (typeof nameValue !== 'string' || metaNode?.type !== 'ObjectExpression') return
    const titleValue = staticValue(propertyOf(metaNode, 'title')?.value)
    const authValue = staticValue(propertyOf(metaNode, 'requireAuth')?.value)
    candidates.push({
      path: pathValue,
      name: nameValue,
      title: typeof titleValue === 'string' ? titleValue : '',
      requireAuth: authValue === true,
      component: findImport(propertyOf(node, 'component')?.value),
      sourceOffset: node.start,
    })
  })

  if (!candidates.length) {
    const error = new Error('未找到符合 path/name/meta 结构的页面路由')
    error.code = 'NO_ROUTES_FOUND'
    throw error
  }

  const unique = new Map()
  for (const candidate of candidates) {
    const route = normalizeRoute(candidate, baseUrl)
    const existing = unique.get(route.id)
    if (existing) existing.sourceOccurrences.push(candidate.sourceOffset)
    else unique.set(route.id, route)
  }

  const routes = [...unique.values()].sort((a, b) =>
    a.displayName.localeCompare(b.displayName, 'zh-CN') || a.path.localeCompare(b.path),
  )
  const byPath = new Map()
  for (const route of routes) {
    const values = byPath.get(route.path) || []
    values.push(route)
    byPath.set(route.path, values)
  }
  const conflicts = [...byPath.entries()]
    .filter(([, values]) => values.length > 1)
    .map(([path, values]) => ({ path, routeIds: values.map((route) => route.id) }))

  return {
    routes,
    conflicts,
    stats: {
      rawRoutes: candidates.length,
      logicalRoutes: routes.length,
      uniquePaths: byPath.size,
      exactDuplicates: candidates.length - routes.length,
      pathConflicts: conflicts.length,
      authRequired: routes.filter((route) => route.requireAuth).length,
      publicRoutes: routes.filter((route) => !route.requireAuth).length,
      emptyTitles: routes.filter((route) => !route.title).length,
    },
  }
}

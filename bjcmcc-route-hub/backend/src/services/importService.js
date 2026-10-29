import { createHash, randomUUID } from 'node:crypto'
import { config } from '../config.js'
import { normalizeCatalogType, readCatalog, savePending } from './catalogStore.js'
import { parseRightsRoutes, parseRoutes } from './routeParser.js'

function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

function buildDiff(currentRoutes, nextRoutes) {
  const currentById = new Map(currentRoutes.map((route) => [route.id, route]))
  const nextById = new Map(nextRoutes.map((route) => [route.id, route]))
  const currentByKey = new Map()
  const nextByKey = new Map()
  for (const route of currentRoutes) (currentByKey.get(route.routeKey) || currentByKey.set(route.routeKey, []).get(route.routeKey)).push(route)
  for (const route of nextRoutes) (nextByKey.get(route.routeKey) || nextByKey.set(route.routeKey, []).get(route.routeKey)).push(route)

  const unchanged = nextRoutes.filter((route) => currentById.has(route.id)).map((route) => route.id)
  const added = nextRoutes
    .filter((route) => !currentById.has(route.id) && !currentByKey.has(route.routeKey))
    .map((route) => route.id)
  const updated = nextRoutes
    .filter((route) => !currentById.has(route.id) && currentByKey.has(route.routeKey))
    .map((route) => route.id)
  const removed = currentRoutes
    .filter((route) => !nextById.has(route.id) && !nextByKey.has(route.routeKey))
    .map((route) => route.id)
  return { added, updated, removed, unchanged }
}

export async function createImport(sourceText, source, catalogType = 'business') {
  const type = normalizeCatalogType(catalogType)
  if (Buffer.byteLength(sourceText) > config.maxBundleBytes) {
    const error = new Error('文件超过 5 MB 限制')
    error.code = 'FILE_TOO_LARGE'
    throw error
  }
  const parsed = type === 'rights'
    ? parseRightsRoutes(sourceText, { baseUrl: config.rightsBaseUrl })
    : parseRoutes(sourceText, { baseUrl: config.businessBaseUrl })
  const catalog = await readCatalog(type)
  const sourceHash = sha256(sourceText)
  const existing = catalog.imports.find((item) => item.sourceHash === sourceHash)
  const snapshot = {
    id: randomUUID(),
    catalogType: type,
    source,
    sourceHash,
    createdAt: new Date().toISOString(),
    routes: parsed.routes,
    conflicts: parsed.conflicts,
    stats: parsed.stats,
    diff: buildDiff(catalog.routes, parsed.routes),
    duplicateOfImportId: existing?.id || '',
  }
  await savePending(snapshot)
  return snapshot
}

function allowedBundleUrl(value, catalogType) {
  const type = normalizeCatalogType(catalogType)
  const origin = type === 'rights' ? config.rightsOrigin : config.portalOrigin
  const url = new URL(value, origin)
  if (url.origin !== origin) throw new Error('只允许同步北京移动官方资源')
  const validPath = type === 'rights'
    ? url.pathname === '/rights-front/dist/umi.js'
    : /^\/nwt\/portal\/assets\/js\/index-[\w-]+\.js$/.test(url.pathname)
  if (!validPath) {
    throw new Error('官方主包地址格式不符合预期')
  }
  return url
}

async function fetchText(url, timeoutMs = 20000) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(timeoutMs),
    headers: { 'user-agent': 'Mozilla/5.0 RouteHubUpdater/1.0' },
  })
  if (!response.ok) throw new Error(`官方资源请求失败：HTTP ${response.status}`)
  const declaredSize = Number(response.headers.get('content-length') || 0)
  if (declaredSize > config.maxBundleBytes) throw new Error('官方资源超过 5 MB 限制')
  const text = await response.text()
  if (Buffer.byteLength(text) > config.maxBundleBytes) throw new Error('官方资源超过 5 MB 限制')
  return text
}

export async function syncOfficialBundle(catalogType = 'business') {
  const type = normalizeCatalogType(catalogType)
  if (type === 'rights') {
    const url = allowedBundleUrl(config.rightsBundleUrl, type)
    const sourceText = await fetchText(url)
    return createImport(
      sourceText,
      { type: 'official', name: 'umi.js', url: url.href },
      type,
    )
  }

  let bundleUrl = config.fallbackBundleUrl
  try {
    const html = await fetchText(config.portalHomeUrl)
    const matches = [...html.matchAll(/(?:\.\/)?assets\/js\/(index-(?!legacy-)[\w-]+\.js)/g)]
    if (matches.length) bundleUrl = new URL(`assets/js/${matches.at(-1)[1]}`, config.portalHomeUrl).href
  } catch {
    // The fixed source remains a safe fallback when the protected portal shell is unavailable.
  }
  const url = allowedBundleUrl(bundleUrl, type)
  const sourceText = await fetchText(url)
  return createImport(sourceText, { type: 'official', name: url.pathname.split('/').at(-1), url: url.href }, type)
}

import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { config } from '../config.js'

const pendingDir = path.join(config.dataDir, 'pending')
const backupDir = path.join(config.dataDir, 'backups')

export function normalizeCatalogType(value) {
  return value === 'rights' ? 'rights' : 'business'
}

function catalogFiles(catalogType) {
  const type = normalizeCatalogType(catalogType)
  return type === 'rights'
    ? { catalogFile: path.join(config.dataDir, 'rights-catalog.json'), seedCatalogFile: path.join(config.dataDir, 'seed-rights-catalog.json') }
    : { catalogFile: path.join(config.dataDir, 'catalog.json'), seedCatalogFile: path.join(config.dataDir, 'seed-catalog.json') }
}

const emptyCatalog = (catalogType) => ({
  schemaVersion: 1,
  catalogType: normalizeCatalogType(catalogType),
  baseUrl: normalizeCatalogType(catalogType) === 'rights' ? config.rightsBaseUrl : config.businessBaseUrl,
  activeImportId: '',
  updatedAt: '',
  routes: [],
  archivedRoutes: [],
  imports: [],
})

async function ensureDataDirs() {
  await Promise.all([
    mkdir(config.dataDir, { recursive: true }),
    mkdir(pendingDir, { recursive: true }),
    mkdir(backupDir, { recursive: true }),
  ])
}

async function atomicWrite(filePath, value) {
  await ensureDataDirs()
  const tempFile = `${filePath}.${process.pid}.${randomUUID()}.tmp`
  await writeFile(tempFile, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
  await rename(tempFile, filePath)
}

export async function readCatalog(catalogType = 'business') {
  await ensureDataDirs()
  const { catalogFile, seedCatalogFile } = catalogFiles(catalogType)
  try {
    return JSON.parse(await readFile(catalogFile, 'utf8'))
  } catch {
    try {
      return JSON.parse(await readFile(seedCatalogFile, 'utf8'))
    } catch {
      return emptyCatalog(catalogType)
    }
  }
}

export async function publicCatalog(catalogType = 'business') {
  const catalog = await readCatalog(catalogType)
  return {
    catalogType: normalizeCatalogType(catalogType),
    baseUrl: catalog.baseUrl,
    activeImportId: catalog.activeImportId,
    updatedAt: catalog.updatedAt,
    routes: catalog.routes,
    summary: catalog.imports.find((item) => item.id === catalog.activeImportId)?.stats || null,
  }
}

export async function savePending(snapshot) {
  await atomicWrite(path.join(pendingDir, `${snapshot.id}.json`), snapshot)
}

export async function readPending(id) {
  return JSON.parse(await readFile(path.join(pendingDir, `${id}.json`), 'utf8'))
}

export async function discardPending(id) {
  await rm(path.join(pendingDir, `${id}.json`), { force: true })
}

export async function applyPending(id) {
  const pending = await readPending(id)
  const catalogType = normalizeCatalogType(pending.catalogType)
  const catalog = await readCatalog(catalogType)
  const { catalogFile } = catalogFiles(catalogType)
  if (catalog.activeImportId) {
    await atomicWrite(path.join(backupDir, `${catalogType}-${catalog.activeImportId}.json`), catalog)
  }
  const nextIds = new Set(pending.routes.map((route) => route.id))
  const archivedAt = new Date().toISOString()
  const newlyArchived = catalog.routes
    .filter((route) => !nextIds.has(route.id))
    .map((route) => ({ ...route, archivedAt, archivedByImportId: pending.id }))
  const historyEntry = {
    id: pending.id,
    source: pending.source,
    sourceHash: pending.sourceHash,
    createdAt: pending.createdAt,
    appliedAt: archivedAt,
    stats: pending.stats,
    diff: pending.diff,
  }
  const next = {
    ...catalog,
    catalogType,
    activeImportId: pending.id,
    updatedAt: archivedAt,
    routes: pending.routes,
    archivedRoutes: [...newlyArchived, ...catalog.archivedRoutes].slice(0, 5000),
    imports: [historyEntry, ...catalog.imports.filter((item) => item.id !== pending.id)].slice(0, 50),
  }
  await atomicWrite(catalogFile, next)
  await rm(path.join(pendingDir, `${id}.json`), { force: true })
  return next
}

export async function rollbackCatalog(catalogType = 'business') {
  const type = normalizeCatalogType(catalogType)
  const catalog = await readCatalog(type)
  const { catalogFile } = catalogFiles(type)
  if (!catalog.imports[1]) throw new Error('没有可回滚的上一版本')
  const targetId = catalog.imports[1].id
  const backupFile = path.join(backupDir, `${type}-${targetId}.json`)
  const previous = JSON.parse(await readFile(backupFile, 'utf8'))
  await atomicWrite(path.join(backupDir, `${type}-${catalog.activeImportId}.json`), catalog)
  await atomicWrite(catalogFile, previous)
  return previous
}

export async function importHistory(catalogType = 'business') {
  const catalog = await readCatalog(catalogType)
  return catalog.imports
}

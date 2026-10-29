import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

export type PublicLinkRecord = {
  id: string
  accountIds: string[]
  createdAt: string
  updatedAt: string
}

type StoreFileV1 = {
  version: 1
  updatedAt: string
  links: Record<string, PublicLinkRecord>
}

const DEFAULT_STORE_RELATIVE_PATH = path.join('data', 'public-links.json')

function nowIso(): string {
  return new Date().toISOString()
}

function resolveStorePath(): string {
  const configured = process.env.PUBLIC_LINKS_STORE_PATH
  if (configured && configured.trim()) {
    return path.isAbsolute(configured)
      ? configured
      : path.resolve(process.cwd(), configured)
  }
  return path.resolve(process.cwd(), DEFAULT_STORE_RELATIVE_PATH)
}

async function safeReadJson(filePath: string): Promise<unknown | null> {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return JSON.parse(content) as unknown
  } catch (e) {
    if (e && typeof e === 'object' && 'code' in e) {
      const code = (e as { code?: unknown }).code
      if (code === 'ENOENT') return null
    }
    throw e
  }
}

async function atomicWriteJson(filePath: string, data: unknown): Promise<void> {
  const dir = path.dirname(filePath)
  await fs.mkdir(dir, { recursive: true })
  const tmpPath = `${filePath}.tmp-${crypto.randomUUID()}`
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf8')
  await fs.rename(tmpPath, filePath)
}

function ensureStoreShape(value: unknown): StoreFileV1 {
  const empty: StoreFileV1 = { version: 1, updatedAt: nowIso(), links: {} }
  if (!value || typeof value !== 'object') return empty
  const obj = value as Record<string, unknown>
  if (obj.version !== 1) return empty
  const linksRaw = obj.links
  if (!linksRaw || typeof linksRaw !== 'object') return empty
  const links: Record<string, PublicLinkRecord> = {}
  for (const [id, rec] of Object.entries(linksRaw as Record<string, unknown>)) {
    if (!rec || typeof rec !== 'object') continue
    const r = rec as Record<string, unknown>
    const accountIds = Array.isArray(r.accountIds)
      ? r.accountIds.map((v) => String(v)).filter(Boolean)
      : []
    const createdAt = typeof r.createdAt === 'string' ? r.createdAt : nowIso()
    const updatedAt = typeof r.updatedAt === 'string' ? r.updatedAt : createdAt
    links[id] = { id, accountIds, createdAt, updatedAt }
  }
  const updatedAt = typeof obj.updatedAt === 'string' ? obj.updatedAt : nowIso()
  return { version: 1, updatedAt, links }
}

let cache:
  | {
      path: string
      loadedAtMs: number
      store: StoreFileV1
    }
  | undefined

export async function loadPublicLinksStore(): Promise<StoreFileV1> {
  const storePath = resolveStorePath()
  const now = Date.now()
  if (cache && cache.path === storePath && now - cache.loadedAtMs < 1500) {
    return cache.store
  }
  const raw = await safeReadJson(storePath)
  const store = ensureStoreShape(raw)
  cache = { path: storePath, loadedAtMs: now, store }
  return store
}

export async function savePublicLinksStore(store: StoreFileV1): Promise<void> {
  const storePath = resolveStorePath()
  const next: StoreFileV1 = {
    version: 1,
    updatedAt: nowIso(),
    links: store.links,
  }
  await atomicWriteJson(storePath, next)
  cache = { path: storePath, loadedAtMs: Date.now(), store: next }
}

export async function createPublicLink(): Promise<PublicLinkRecord> {
  const store = await loadPublicLinksStore()
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 12)
  const now = nowIso()
  const rec: PublicLinkRecord = { id, accountIds: [], createdAt: now, updatedAt: now }
  store.links[id] = rec
  await savePublicLinksStore(store)
  return rec
}

export async function getPublicLink(id: string): Promise<PublicLinkRecord | null> {
  const store = await loadPublicLinksStore()
  return store.links[id] ?? null
}

export async function addLinkAccount(args: {
  linkId: string
  accountId: string
}): Promise<PublicLinkRecord> {
  const store = await loadPublicLinksStore()
  const now = nowIso()
  const existing = store.links[args.linkId]
  const accountIds = existing?.accountIds ?? []
  const nextIds = accountIds.includes(args.accountId)
    ? accountIds
    : [...accountIds, args.accountId]
  const next: PublicLinkRecord = existing
    ? { ...existing, accountIds: nextIds, updatedAt: now }
    : { id: args.linkId, accountIds: nextIds, createdAt: now, updatedAt: now }
  store.links[args.linkId] = next
  await savePublicLinksStore(store)
  return next
}

export async function removeMissingAccounts(args: {
  linkId: string
  remainingIds: string[]
}): Promise<PublicLinkRecord | null> {
  const store = await loadPublicLinksStore()
  const existing = store.links[args.linkId]
  if (!existing) return null
  const next: PublicLinkRecord = {
    ...existing,
    accountIds: args.remainingIds,
    updatedAt: nowIso(),
  }
  store.links[args.linkId] = next
  await savePublicLinksStore(store)
  return next
}

export async function listPublicLinks(): Promise<PublicLinkRecord[]> {
  const store = await loadPublicLinksStore()
  return Object.values(store.links).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  )
}

export const __test__ = {
  resolveStorePath,
  ensureStoreShape,
}


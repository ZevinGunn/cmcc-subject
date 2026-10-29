import fs from 'node:fs/promises'
import path from 'node:path'

export type PublicLinkPushConfig = {
  linkId: string
  pushplusToken?: string
  pushplusEnabled: boolean
  notifyLogin: boolean
  notifyCookieInvalid: boolean
  notifyRushResult: boolean
  pushplusSubscribeUrl?: string
  pushplusQrImageUrl?: string
  pushplusQrNote?: string
  redirectEnabled: boolean
  redirectUrl?: string
  redirectNote?: string
  updatedAt: string
}

type StoreFileV1 = {
  version: 1
  updatedAt: string
  items: Record<string, PublicLinkPushConfig>
}

const DEFAULT_STORE_RELATIVE_PATH = path.join('data', 'public-link-push-config.json')

function nowIso(): string {
  return new Date().toISOString()
}

function resolveStorePath(): string {
  const configured = process.env.PUBLIC_LINK_PUSH_STORE_PATH
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

import crypto from 'node:crypto'

function normalizeConfig(linkId: string, raw?: Partial<PublicLinkPushConfig>): PublicLinkPushConfig {
  return {
    linkId,
    pushplusToken: raw?.pushplusToken?.trim() || undefined,
    pushplusEnabled: raw?.pushplusEnabled ?? false,
    notifyLogin: raw?.notifyLogin ?? true,
    notifyCookieInvalid: raw?.notifyCookieInvalid ?? true,
    notifyRushResult: raw?.notifyRushResult ?? true,
    pushplusSubscribeUrl: raw?.pushplusSubscribeUrl?.trim() || undefined,
    pushplusQrImageUrl: raw?.pushplusQrImageUrl?.trim() || undefined,
    pushplusQrNote: raw?.pushplusQrNote?.trim() || undefined,
    redirectEnabled: raw?.redirectEnabled ?? false,
    redirectUrl: raw?.redirectUrl?.trim() || undefined,
    redirectNote: raw?.redirectNote?.trim() || undefined,
    updatedAt: raw?.updatedAt || nowIso(),
  }
}

function ensureStoreShape(value: unknown): StoreFileV1 {
  const empty: StoreFileV1 = { version: 1, updatedAt: nowIso(), items: {} }
  if (!value || typeof value !== 'object') return empty
  const obj = value as Record<string, unknown>
  if (obj.version !== 1) return empty
  const itemsRaw = obj.items
  if (!itemsRaw || typeof itemsRaw !== 'object') return empty
  const items: Record<string, PublicLinkPushConfig> = {}
  for (const [linkId, rec] of Object.entries(itemsRaw as Record<string, unknown>)) {
    if (!rec || typeof rec !== 'object') continue
    items[linkId] = normalizeConfig(linkId, rec as Partial<PublicLinkPushConfig>)
  }
  return {
    version: 1,
    updatedAt: typeof obj.updatedAt === 'string' ? obj.updatedAt : nowIso(),
    items,
  }
}

let cache:
  | {
      path: string
      loadedAtMs: number
      store: StoreFileV1
    }
  | undefined

async function loadStore(): Promise<StoreFileV1> {
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

async function saveStore(store: StoreFileV1): Promise<void> {
  const storePath = resolveStorePath()
  const next: StoreFileV1 = {
    version: 1,
    updatedAt: nowIso(),
    items: store.items,
  }
  await atomicWriteJson(storePath, next)
  cache = { path: storePath, loadedAtMs: Date.now(), store: next }
}

export async function getPublicLinkPushConfig(linkId: string): Promise<PublicLinkPushConfig> {
  const store = await loadStore()
  return normalizeConfig(linkId, store.items[linkId])
}

export async function setPublicLinkPushConfig(args: {
  linkId: string
  pushplusToken?: string
  pushplusEnabled?: boolean
  notifyLogin?: boolean
  notifyCookieInvalid?: boolean
  notifyRushResult?: boolean
  pushplusSubscribeUrl?: string
  pushplusQrImageUrl?: string
  pushplusQrNote?: string
  redirectEnabled?: boolean
  redirectUrl?: string
  redirectNote?: string
}): Promise<PublicLinkPushConfig> {
  const store = await loadStore()
  const prev = normalizeConfig(args.linkId, store.items[args.linkId])
  const next = normalizeConfig(args.linkId, {
    ...prev,
    pushplusToken: args.pushplusToken ?? prev.pushplusToken,
    pushplusEnabled: args.pushplusEnabled ?? prev.pushplusEnabled,
    notifyLogin: args.notifyLogin ?? prev.notifyLogin,
    notifyCookieInvalid: args.notifyCookieInvalid ?? prev.notifyCookieInvalid,
    notifyRushResult: args.notifyRushResult ?? prev.notifyRushResult,
    pushplusSubscribeUrl: args.pushplusSubscribeUrl ?? prev.pushplusSubscribeUrl,
    pushplusQrImageUrl: args.pushplusQrImageUrl ?? prev.pushplusQrImageUrl,
    pushplusQrNote: args.pushplusQrNote ?? prev.pushplusQrNote,
    redirectEnabled: args.redirectEnabled ?? prev.redirectEnabled,
    redirectUrl: args.redirectUrl ?? prev.redirectUrl,
    redirectNote: args.redirectNote ?? prev.redirectNote,
    updatedAt: nowIso(),
  })
  store.items[args.linkId] = next
  await saveStore(store)
  return next
}

export async function listPublicLinkPushConfigs(): Promise<Record<string, PublicLinkPushConfig>> {
  const store = await loadStore()
  const out: Record<string, PublicLinkPushConfig> = {}
  for (const [linkId, rec] of Object.entries(store.items)) {
    out[linkId] = normalizeConfig(linkId, rec)
  }
  return out
}

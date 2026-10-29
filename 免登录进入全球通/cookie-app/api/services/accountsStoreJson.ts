import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

export type AccountRecord = {
  id: string
  phone: string
  label?: string
  displayPhone?: string
  cookie?: string
  cookieUpdatedAt?: string
  cookieCheckedAt?: string
  cookieInvalidAt?: string
  cookieInvalidReason?: string
  requestHeaders?: Record<string, string>
  newHomeUrl?: string
  qqtAccessToken?: string
  qqtAccessTokenCheckedAt?: string
  qqtInfo?: Record<string, unknown>
  smsLoginAt?: string
  smsLoginExpireAt?: string
  createdAt: string
  updatedAt: string
}

type StoreFileV1 = {
  version: 1
  updatedAt: string
  accounts: Record<string, AccountRecord>
}

const DEFAULT_STORE_RELATIVE_PATH = path.join('data', 'cmcc-accounts.json')

function nowIso(): string {
  return new Date().toISOString()
}

function sha256Hex(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex')
}

function normalizeRequestHeaders(value: unknown): Record<string, string> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    const key = k.trim().toLowerCase()
    if (!key || key === 'cookie') continue
    if (v === null || v === undefined) continue
    out[key] = String(v)
  }
  return Object.keys(out).length ? out : undefined
}

function maskPhone(phone: string): string {
  if (!phone) return '未获取'
  if (!/^1\d{10}$/.test(phone)) return '未获取'
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`
}

function resolveStorePath(): string {
  const configured = process.env.ACCOUNTS_STORE_PATH
  if (configured && configured.trim()) {
    return path.isAbsolute(configured) ? configured : path.resolve(process.cwd(), configured)
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
  const empty: StoreFileV1 = { version: 1, updatedAt: nowIso(), accounts: {} }
  if (!value || typeof value !== 'object') return empty
  const obj = value as Record<string, unknown>
  if (obj.version !== 1) return empty
  const accountsRaw = obj.accounts
  if (!accountsRaw || typeof accountsRaw !== 'object') return empty
  const accounts: Record<string, AccountRecord> = {}
  for (const [id, rec] of Object.entries(accountsRaw as Record<string, unknown>)) {
    if (!rec || typeof rec !== 'object') continue
    const r = rec as Record<string, unknown>
    const phoneRaw = typeof r.phone === 'string' ? r.phone : ''
    const phone = /^1\d{10}$/.test(phoneRaw) ? phoneRaw : ''
    if (!phone && phoneRaw) continue
    const createdAt = typeof r.createdAt === 'string' ? r.createdAt : nowIso()
    const updatedAt = typeof r.updatedAt === 'string' ? r.updatedAt : createdAt
    const label = typeof r.label === 'string' ? r.label : undefined
    const cookie = typeof r.cookie === 'string' ? r.cookie : undefined
    const cookieUpdatedAt = typeof r.cookieUpdatedAt === 'string' ? r.cookieUpdatedAt : undefined
    const cookieCheckedAt = typeof r.cookieCheckedAt === 'string' ? r.cookieCheckedAt : undefined
    const requestHeaders = normalizeRequestHeaders(r.requestHeaders)
    const newHomeUrl = typeof r.newHomeUrl === 'string' ? r.newHomeUrl : undefined
    const qqtAccessToken = typeof r.qqtAccessToken === 'string' ? r.qqtAccessToken : undefined
    const qqtAccessTokenCheckedAt = typeof r.qqtAccessTokenCheckedAt === 'string' ? r.qqtAccessTokenCheckedAt : undefined
    const displayPhone = typeof r.displayPhone === 'string' ? r.displayPhone : undefined
    const qqtInfo = typeof r.qqtInfo === 'object' && r.qqtInfo !== null ? (r.qqtInfo as Record<string, unknown>) : undefined
    const cookieInvalidAt = typeof r.cookieInvalidAt === 'string' ? r.cookieInvalidAt : undefined
    const cookieInvalidReason = typeof r.cookieInvalidReason === 'string' ? r.cookieInvalidReason : undefined
    accounts[id] = {
      id,
      phone,
      label,
      cookie,
      cookieUpdatedAt,
      cookieCheckedAt,
      cookieInvalidAt,
      cookieInvalidReason,
      requestHeaders,
      newHomeUrl,
      qqtAccessToken,
      qqtAccessTokenCheckedAt,
      qqtInfo,
      displayPhone,
      createdAt,
      updatedAt,
    }
  }
  const updatedAt = typeof obj.updatedAt === 'string' ? obj.updatedAt : nowIso()
  return { version: 1, updatedAt, accounts }
}

let cache:
  | {
      path: string
      loadedAtMs: number
      store: StoreFileV1
    }
  | undefined

export type AccountSummary = {
  id: string
  label?: string
  phone?: string
  publicLinkIds?: string[]
  phoneMasked: string
  displayPhone?: string
  hasCookie: boolean
  cookieUpdatedAt?: string
  cookieInvalidAt?: string
  cookieInvalidReason?: string
  updatedAt: string
  newHomeUrl?: string
  qqtAccessToken?: string
  qqtAccessTokenCheckedAt?: string
  qqtInfo?: Record<string, unknown>
  smsLoginAt?: string
  smsLoginExpireAt?: string
}

export async function loadAccountsStore(): Promise<StoreFileV1> {
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

export async function saveAccountsStore(store: StoreFileV1): Promise<void> {
  const storePath = resolveStorePath()
  const next: StoreFileV1 = {
    version: 1,
    updatedAt: nowIso(),
    accounts: store.accounts,
  }
  await atomicWriteJson(storePath, next)
  cache = { path: storePath, loadedAtMs: Date.now(), store: next }
}

export function toAccountSummary(rec: AccountRecord): AccountSummary {
  return {
    id: rec.id,
    label: rec.label,
    phone: rec.phone || undefined,
    phoneMasked: maskPhone(rec.phone),
    displayPhone: rec.displayPhone,
    hasCookie: Boolean(rec.cookie),
    cookieUpdatedAt: rec.cookieUpdatedAt,
    cookieInvalidAt: rec.cookieInvalidAt,
    cookieInvalidReason: rec.cookieInvalidReason,
    updatedAt: rec.updatedAt,
    newHomeUrl: rec.newHomeUrl,
    qqtAccessToken: rec.qqtAccessToken,
    qqtAccessTokenCheckedAt: rec.qqtAccessTokenCheckedAt,
    qqtInfo: rec.qqtInfo,
    smsLoginAt: rec.smsLoginAt,
    smsLoginExpireAt: rec.smsLoginExpireAt,
  }
}

export async function listAccountSummaries(): Promise<AccountSummary[]> {
  const store = await loadAccountsStore()
  return Object.values(store.accounts)
    .map(toAccountSummary)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function listAccounts(): Promise<AccountRecord[]> {
  const store = await loadAccountsStore()
  return Object.values(store.accounts)
}

export async function upsertAccount(args: {
  phone: string
  label?: string
  allowEmpty?: boolean
}): Promise<AccountRecord> {
  const phone = args.phone.trim()
  const label = args.label?.trim() || undefined
  const isValidPhone = /^1\d{10}$/.test(phone)
  if (!isValidPhone && !(args.allowEmpty && !phone)) {
    throw new Error('INVALID_PHONE')
  }

  const id = isValidPhone ? sha256Hex(phone) : crypto.randomUUID()
  const store = await loadAccountsStore()
  const now = nowIso()
  const prev = store.accounts[id]
  const next: AccountRecord = prev
    ? {
        ...prev,
        phone: isValidPhone ? phone : prev.phone,
        label,
        requestHeaders: prev.requestHeaders,
        displayPhone: prev.displayPhone,
        qqtInfo: prev.qqtInfo,
        updatedAt: now,
      }
    : {
        id,
        phone: isValidPhone ? phone : '',
        label,
        displayPhone: undefined,
        createdAt: now,
        updatedAt: now,
        qqtInfo: undefined,
      }

  store.accounts[id] = next
  await saveAccountsStore(store)
  return next
}

export async function setAccountPhone(args: {
  id: string
  phone: string
}): Promise<AccountRecord> {
  const phone = args.phone.trim()
  if (!/^1\d{10}$/.test(phone)) {
    throw new Error('INVALID_PHONE')
  }
  const store = await loadAccountsStore()
  const rec = store.accounts[args.id]
  if (!rec) throw new Error('NOT_FOUND')
  const now = nowIso()
  const next: AccountRecord = {
    ...rec,
    phone,
    updatedAt: now,
  }
  store.accounts[args.id] = next
  await saveAccountsStore(store)
  return next
}

export async function setAccountDisplayPhone(args: {
  id: string
  displayPhone: string
}): Promise<AccountRecord> {
  const displayPhone = args.displayPhone.trim()
  if (!displayPhone) {
    throw new Error('INVALID_DISPLAY_PHONE')
  }
  const store = await loadAccountsStore()
  const rec = store.accounts[args.id]
  if (!rec) throw new Error('NOT_FOUND')
  const now = nowIso()
  const next: AccountRecord = {
    ...rec,
    displayPhone,
    updatedAt: now,
  }
  store.accounts[args.id] = next
  await saveAccountsStore(store)
  return next
}

export async function setAccountQqtInfo(args: {
  id: string
  qqtInfo: Record<string, unknown>
}): Promise<AccountRecord> {
  const store = await loadAccountsStore()
  const rec = store.accounts[args.id]
  if (!rec) throw new Error('NOT_FOUND')
  const now = nowIso()
  const next: AccountRecord = {
    ...rec,
    qqtInfo: { ...rec.qqtInfo, ...args.qqtInfo },
    updatedAt: now,
  }
  store.accounts[args.id] = next
  await saveAccountsStore(store)
  return next
}

export async function deleteAccount(id: string): Promise<void> {
  const store = await loadAccountsStore()
  if (store.accounts[id]) {
    delete store.accounts[id]
    await saveAccountsStore(store)
  }
}

export async function getAccountById(id: string): Promise<AccountRecord | null> {
  const store = await loadAccountsStore()
  return store.accounts[id] ?? null
}

export async function setAccountCookie(args: {
  id: string
  cookie: string
  requestHeaders?: Record<string, string>
  newHomeUrl?: string
  loginMethod?: unknown
  cookieSource?: unknown
  ttlHours?: number
  loginAt?: Date
}): Promise<AccountRecord> {
  const store = await loadAccountsStore()
  const rec = store.accounts[args.id]
  if (!rec) throw new Error('NOT_FOUND')
  const now = nowIso()
  const shouldUpdateLoginWindow = Boolean(
    args.loginMethod || args.cookieSource || args.ttlHours !== undefined || args.loginAt,
  )
  const loginAt = args.loginAt ? args.loginAt.toISOString() : now
  const ttlHours = Number.isFinite(args.ttlHours ?? 72)
    ? Math.max(1, Math.min(24 * 30, Math.floor(args.ttlHours ?? 72)))
    : 72
  const expireAt = new Date(Date.parse(loginAt) + ttlHours * 60 * 60 * 1000).toISOString()
  const requestHeaders = args.requestHeaders ?? rec.requestHeaders
  const newHomeUrl = args.newHomeUrl ?? rec.newHomeUrl
  const next: AccountRecord = {
    ...rec,
    cookie: args.cookie,
    cookieUpdatedAt: now,
    cookieCheckedAt: now,
    cookieInvalidAt: undefined,
    cookieInvalidReason: undefined,
    smsLoginAt: shouldUpdateLoginWindow ? loginAt : rec.smsLoginAt,
    smsLoginExpireAt: shouldUpdateLoginWindow ? expireAt : rec.smsLoginExpireAt,
    requestHeaders,
    newHomeUrl,
    updatedAt: now,
  }
  store.accounts[args.id] = next
  await saveAccountsStore(store)
  return next
}

export async function touchAccountCookieCheckedAt(args: {
  id: string
}): Promise<AccountRecord> {
  const store = await loadAccountsStore()
  const rec = store.accounts[args.id]
  if (!rec) throw new Error('NOT_FOUND')
  const now = nowIso()
  const next: AccountRecord = { ...rec, cookieCheckedAt: now, updatedAt: now }
  store.accounts[args.id] = next
  await saveAccountsStore(store)
  return next
}

export async function clearAccountCookie(args: {
  id: string
  reason?: string
}): Promise<AccountRecord> {
  const store = await loadAccountsStore()
  const rec = store.accounts[args.id]
  if (!rec) throw new Error('NOT_FOUND')
  const now = nowIso()
  const next: AccountRecord = {
    ...rec,
    cookie: undefined,
    cookieUpdatedAt: undefined,
    cookieCheckedAt: undefined,
    cookieInvalidAt: now,
    cookieInvalidReason: args.reason?.trim() || 'Cookie 已失效',
    updatedAt: now,
  }
  store.accounts[args.id] = next
  await saveAccountsStore(store)
  return next
}

export async function setAccountQqtToken(args: {
  id: string
  qqtAccessToken?: string
}): Promise<AccountRecord> {
  const store = await loadAccountsStore()
  const rec = store.accounts[args.id]
  if (!rec) throw new Error('NOT_FOUND')
  const now = nowIso()
  const next: AccountRecord = {
    ...rec,
    qqtAccessToken: args.qqtAccessToken,
    qqtAccessTokenCheckedAt: args.qqtAccessToken ? now : undefined,
    updatedAt: now,
  }
  store.accounts[args.id] = next
  await saveAccountsStore(store)
  return next
}

export async function touchAccountQqtTokenCheckedAt(args: {
  id: string
}): Promise<AccountRecord> {
  const store = await loadAccountsStore()
  const rec = store.accounts[args.id]
  if (!rec) throw new Error('NOT_FOUND')
  const now = nowIso()
  const next: AccountRecord = { ...rec, qqtAccessTokenCheckedAt: now, updatedAt: now }
  store.accounts[args.id] = next
  await saveAccountsStore(store)
  return next
}

export async function getAccountCookie(id: string): Promise<string | null> {
  const rec = await getAccountById(id)
  return rec?.cookie ?? null
}

export const __test__ = {
  resolveStorePath,
  maskPhone,
  sha256Hex,
  ensureStoreShape,
}

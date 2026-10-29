import crypto from 'node:crypto'
import { Prisma } from '@prisma/client'
import { decryptString, encryptString } from './cryptoBox.js'
import { getCredentialsPrisma } from './credentialsDb.js'

type CacheRow = {
  cacheKey: string
  accountId: string | null
  phoneHash: string
  remoteSessionIdEnc: string
  loggedInAt: Date
  checkedAt: Date
  updatedAt: Date
}

export type BmccActivityLoginCache = {
  remoteSessionId: string
  loggedInAt: string
  checkedAt: string
}

let storageReady: Promise<void> | null = null

async function ensureStorage(): Promise<void> {
  if (!storageReady) {
    storageReady = getCredentialsPrisma().$executeRawUnsafe(`
      create table if not exists "BmccActivityLoginCache" (
        "cacheKey" text primary key,
        "accountId" text,
        "phoneHash" text not null,
        "remoteSessionIdEnc" text not null,
        "loggedInAt" timestamptz not null,
        "checkedAt" timestamptz not null,
        "updatedAt" timestamptz not null default now()
      )
    `).then(() => undefined).catch((error) => {
      storageReady = null
      throw error
    })
  }
  await storageReady
}

function phoneHash(phone: string): string {
  return crypto.createHash('sha256').update(phone.trim()).digest('hex')
}

function cacheKey(accountId: string | undefined, phone: string): string {
  return accountId ? `account:${accountId}` : `manual:${phoneHash(phone)}`
}

export async function readBmccActivityLoginCache(args: {
  accountId?: string
  phone: string
}): Promise<BmccActivityLoginCache | undefined> {
  await ensureStorage()
  const key = cacheKey(args.accountId, args.phone)
  const rows = await getCredentialsPrisma().$queryRaw<CacheRow[]>(Prisma.sql`
    select "cacheKey", "accountId", "phoneHash", "remoteSessionIdEnc", "loggedInAt", "checkedAt", "updatedAt"
    from "BmccActivityLoginCache"
    where "cacheKey" = ${key}
    limit 1
  `)
  const row = rows[0]
  if (!row) return undefined
  if (row.phoneHash !== phoneHash(args.phone)) {
    await clearBmccActivityLoginCache(args)
    return undefined
  }
  try {
    const remoteSessionId = decryptString(row.remoteSessionIdEnc)
    if (!/^[A-Za-z0-9-]{8,100}$/.test(remoteSessionId)) throw new Error('INVALID_REMOTE_SESSION_ID')
    return {
      remoteSessionId,
      loggedInAt: row.loggedInAt.toISOString(),
      checkedAt: row.checkedAt.toISOString(),
    }
  } catch {
    await clearBmccActivityLoginCache(args)
    return undefined
  }
}

export async function saveBmccActivityLoginCache(args: {
  accountId?: string
  phone: string
  remoteSessionId: string
  loggedInAt?: Date
}): Promise<BmccActivityLoginCache> {
  await ensureStorage()
  const now = new Date()
  const loggedInAt = args.loggedInAt || now
  await getCredentialsPrisma().$executeRaw(Prisma.sql`
    insert into "BmccActivityLoginCache" (
      "cacheKey", "accountId", "phoneHash", "remoteSessionIdEnc", "loggedInAt", "checkedAt", "updatedAt"
    ) values (
      ${cacheKey(args.accountId, args.phone)}, ${args.accountId || null}, ${phoneHash(args.phone)},
      ${encryptString(args.remoteSessionId)}, ${loggedInAt}, ${now}, ${now}
    )
    on conflict ("cacheKey") do update set
      "accountId" = excluded."accountId",
      "phoneHash" = excluded."phoneHash",
      "remoteSessionIdEnc" = excluded."remoteSessionIdEnc",
      "loggedInAt" = excluded."loggedInAt",
      "checkedAt" = excluded."checkedAt",
      "updatedAt" = excluded."updatedAt"
  `)
  return {
    remoteSessionId: args.remoteSessionId,
    loggedInAt: loggedInAt.toISOString(),
    checkedAt: now.toISOString(),
  }
}

export async function touchBmccActivityLoginCache(args: {
  accountId?: string
  phone: string
}): Promise<void> {
  await ensureStorage()
  await getCredentialsPrisma().$executeRaw(Prisma.sql`
    update "BmccActivityLoginCache"
    set "checkedAt" = now(), "updatedAt" = now()
    where "cacheKey" = ${cacheKey(args.accountId, args.phone)}
  `)
}

export async function clearBmccActivityLoginCache(args: {
  accountId?: string
  phone: string
}): Promise<void> {
  await ensureStorage()
  await getCredentialsPrisma().$executeRaw(Prisma.sql`
    delete from "BmccActivityLoginCache"
    where "cacheKey" = ${cacheKey(args.accountId, args.phone)}
  `)
}

export const __test__ = {
  cacheKey,
  phoneHash,
}

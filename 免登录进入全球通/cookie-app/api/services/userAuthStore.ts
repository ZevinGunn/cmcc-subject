import crypto from 'node:crypto'
import type { Request } from 'express'
import { getPrisma } from './prisma.js'
import { getPublicLink } from './publicLinksStore.js'
import { listAccountSummariesByUser } from './accountsStore.js'

export type UserRecord = {
  id: string
  username: string
  passwordHash: string
  displayName?: string
  permissions: UserPermissions
  disabledAt?: string
  disabledReason?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export type ManagedUserRecord = UserRecord & {
  accountCount: number
  inviteCount: number
  usedInviteCodes: string[]
}

export type UserSessionRecord = {
  token: string
  userId: string
  sourceLinkId?: string
  createdAt: string
  expiresAt: string
  revokedAt?: string
  lastSeenAt?: string
}

export type AuthPolicyRecord = {
  id: string
  usernameAllowlist: string[]
  usernameBlocklist: string[]
  defaultResetPassword: string
  updatedAt: string
}

export type UserPermissions = {
  businessQuery?: boolean
  shopQuery?: boolean
  businessOrder?: boolean
  businessIdOverride?: boolean
  benefitActivity?: boolean
}

const INITIAL_ADMIN_PASSWORD =
  process.env.CMCC_INITIAL_ADMIN_PASSWORD?.trim() ||
  process.env.ADMIN_KEY?.trim() ||
  crypto.randomBytes(18).toString('base64url')
const INITIAL_RESET_PASSWORD =
  process.env.CMCC_DEFAULT_RESET_PASSWORD?.trim() || INITIAL_ADMIN_PASSWORD

function nowIso(): string {
  return new Date().toISOString()
}

function normalizeUsername(input: string): string {
  return input.trim().toLowerCase()
}

function normalizeRuleList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => String(item || '').trim().toLowerCase())
    .filter(Boolean)
}

function normalizePermissions(raw: unknown): UserPermissions {
  let parsed: unknown = raw
  if (typeof raw === 'string' && raw.trim()) {
    try {
      parsed = JSON.parse(raw)
    } catch {
      parsed = {}
    }
  }
  const obj = parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {}
  return {
    businessQuery: Boolean(obj.businessQuery),
    shopQuery: Boolean(obj.shopQuery),
    businessOrder: Boolean(obj.businessOrder),
    businessIdOverride: Boolean(obj.businessIdOverride),
    benefitActivity: Boolean(obj.benefitActivity),
  }
}

export const __test__ = {
  normalizePermissions,
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('base64')
  const derived = crypto.scryptSync(password, salt, 64).toString('base64')
  return `scrypt$${salt}$${derived}`
}

export function verifyPassword(password: string, hash: string): boolean {
  const parts = String(hash || '').split('$')
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false
  const salt = parts[1]
  const expected = parts[2]
  const derived = crypto.scryptSync(password, salt, 64).toString('base64')
  return crypto.timingSafeEqual(Buffer.from(derived), Buffer.from(expected))
}

let authStorageReady: Promise<void> | null = null

async function execUnsafe(sql: string, params: unknown[] = []): Promise<number> {
  const prisma = getPrisma()
  return prisma.$executeRawUnsafe(sql, ...params)
}

export async function ensureUserAuthStorage(): Promise<void> {
  if (!authStorageReady) {
    authStorageReady = (async () => {
      await execUnsafe('alter table "Account" add column if not exists "userId" text')
      await execUnsafe(
        'alter table "PublicLink" add column if not exists "usedAt" timestamp(3), add column if not exists "usedByUserId" text',
      )
      await execUnsafe(`
        create table if not exists "User" (
          "id" text not null,
          "username" text not null,
          "passwordHash" text not null,
          "displayName" text,
          "permissionsJson" text not null default '{}',
          "disabledAt" timestamp(3),
          "disabledReason" text,
          "lastLoginAt" timestamp(3),
          "createdAt" timestamp(3) not null default current_timestamp,
          "updatedAt" timestamp(3) not null,
          constraint "User_pkey" primary key ("id")
        )
      `)
      await execUnsafe('alter table "User" add column if not exists "permissionsJson" text not null default \'{}\'')
      await execUnsafe(`
        update "User"
        set "permissionsJson" = (
          "permissionsJson"::jsonb || jsonb_build_object(
            'shopQuery',
            false
          )
        )::text
        where not ("permissionsJson"::jsonb ? 'shopQuery')
      `)
      await execUnsafe(`
        update "User"
        set "permissionsJson" = (
          "permissionsJson"::jsonb || jsonb_build_object(
            'businessOrder',
            false
          )
        )::text
        where not ("permissionsJson"::jsonb ? 'businessOrder')
      `)
      await execUnsafe(`
        update "User"
        set "permissionsJson" = (
          "permissionsJson"::jsonb || jsonb_build_object(
            'benefitActivity',
            false
          )
        )::text
        where not ("permissionsJson"::jsonb ? 'benefitActivity')
      `)
      await execUnsafe(`
        create table if not exists "UserSession" (
          "token" text not null,
          "userId" text not null,
          "sourceLinkId" text,
          "createdAt" timestamp(3) not null default current_timestamp,
          "expiresAt" timestamp(3) not null,
          "revokedAt" timestamp(3),
          "lastSeenAt" timestamp(3),
          constraint "UserSession_pkey" primary key ("token")
        )
      `)
      await execUnsafe(`
        create table if not exists "AuthPolicy" (
          "id" text not null default 'default',
          "usernameAllowlistJson" text not null default '[]',
          "usernameBlocklistJson" text not null default '[]',
          "defaultResetPassword" text not null default '',
          "updatedAt" timestamp(3) not null,
          constraint "AuthPolicy_pkey" primary key ("id")
        )
      `)
      await execUnsafe(`
        create table if not exists "AdminUser" (
          "id" text not null,
          "username" text not null,
          "passwordHash" text not null,
          "role" text not null default 'super_admin',
          "disabledAt" timestamp(3),
          "disabledReason" text,
          "lastLoginAt" timestamp(3),
          "createdAt" timestamp(3) not null default current_timestamp,
          "updatedAt" timestamp(3) not null,
          constraint "AdminUser_pkey" primary key ("id")
        )
      `)
      await execUnsafe('create unique index if not exists "User_username_key" on "User"("username")')
      await execUnsafe('create index if not exists "User_disabledAt_idx" on "User"("disabledAt")')
      await execUnsafe('create index if not exists "UserSession_userId_idx" on "UserSession"("userId")')
      await execUnsafe('create index if not exists "UserSession_expiresAt_idx" on "UserSession"("expiresAt")')
      await execUnsafe('create index if not exists "UserSession_revokedAt_idx" on "UserSession"("revokedAt")')
      await execUnsafe('create index if not exists "Account_userId_idx" on "Account"("userId")')
      await execUnsafe('create index if not exists "PublicLink_usedByUserId_idx" on "PublicLink"("usedByUserId")')
      await execUnsafe('create unique index if not exists "AdminUser_username_key" on "AdminUser"("username")')
      await execUnsafe('create index if not exists "AdminUser_disabledAt_idx" on "AdminUser"("disabledAt")')
      await execUnsafe(`
        do $$
        begin
          if not exists (
            select 1 from information_schema.table_constraints
            where constraint_name = 'Account_userId_fkey'
          ) then
            alter table "Account"
            add constraint "Account_userId_fkey"
            foreign key ("userId") references "User"("id")
            on delete set null on update cascade;
          end if;
          if not exists (
            select 1 from information_schema.table_constraints
            where constraint_name = 'PublicLink_usedByUserId_fkey'
          ) then
            alter table "PublicLink"
            add constraint "PublicLink_usedByUserId_fkey"
            foreign key ("usedByUserId") references "User"("id")
            on delete set null on update cascade;
          end if;
          if not exists (
            select 1 from information_schema.table_constraints
            where constraint_name = 'UserSession_userId_fkey'
          ) then
            alter table "UserSession"
            add constraint "UserSession_userId_fkey"
            foreign key ("userId") references "User"("id")
            on delete cascade on update cascade;
          end if;
        end $$
      `)
      await execUnsafe(`
        insert into "AuthPolicy" ("id", "usernameAllowlistJson", "usernameBlocklistJson", "defaultResetPassword", "updatedAt")
        values ($1, $2, $3, $4, current_timestamp)
        on conflict ("id") do nothing
      `, ['default', '[]', '[]', INITIAL_RESET_PASSWORD])
      await execUnsafe(
        `insert into "AdminUser" ("id", "username", "passwordHash", "role", "createdAt", "updatedAt")
         values ($1, $2, $3, 'super_admin', now(), now())
         on conflict ("username") do nothing`,
        [crypto.randomUUID(), 'admin', hashPassword(INITIAL_ADMIN_PASSWORD)],
      )
    })()
  }
  return authStorageReady
}

async function rawQuery<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
  await ensureUserAuthStorage()
  const prisma = getPrisma()
  return prisma.$queryRawUnsafe(sql, ...params) as Promise<T[]>
}

async function rawExec(sql: string, params: unknown[] = []): Promise<number> {
  await ensureUserAuthStorage()
  return execUnsafe(sql, params)
}

function mapUser(row: Record<string, unknown>): UserRecord {
  return {
    id: String(row.id),
    username: String(row.username),
    passwordHash: String(row.passwordHash),
    displayName: row.displayName ? String(row.displayName) : undefined,
    permissions: normalizePermissions(row.permissionsJson),
    disabledAt: row.disabledAt ? new Date(String(row.disabledAt)).toISOString() : undefined,
    disabledReason: row.disabledReason ? String(row.disabledReason) : undefined,
    lastLoginAt: row.lastLoginAt ? new Date(String(row.lastLoginAt)).toISOString() : undefined,
    createdAt: new Date(String(row.createdAt)).toISOString(),
    updatedAt: new Date(String(row.updatedAt)).toISOString(),
  }
}

function mapSession(row: Record<string, unknown>): UserSessionRecord {
  return {
    token: String(row.token),
    userId: String(row.userId),
    sourceLinkId: row.sourceLinkId ? String(row.sourceLinkId) : undefined,
    createdAt: new Date(String(row.createdAt)).toISOString(),
    expiresAt: new Date(String(row.expiresAt)).toISOString(),
    revokedAt: row.revokedAt ? new Date(String(row.revokedAt)).toISOString() : undefined,
    lastSeenAt: row.lastSeenAt ? new Date(String(row.lastSeenAt)).toISOString() : undefined,
  }
}

export async function getAuthPolicy(): Promise<AuthPolicyRecord> {
  const rows = await rawQuery<Record<string, unknown>>(
    'select * from "AuthPolicy" where id = $1 limit 1',
    ['default'],
  )
  const row = rows[0]
  if (!row) {
    return {
      id: 'default',
      usernameAllowlist: [],
      usernameBlocklist: [],
      defaultResetPassword: INITIAL_RESET_PASSWORD,
      updatedAt: nowIso(),
    }
  }
  return {
    id: String(row.id),
    usernameAllowlist: normalizeRuleList(row.usernameAllowlistJson ? JSON.parse(String(row.usernameAllowlistJson)) : []),
    usernameBlocklist: normalizeRuleList(row.usernameBlocklistJson ? JSON.parse(String(row.usernameBlocklistJson)) : []),
    defaultResetPassword: String(row.defaultResetPassword || INITIAL_RESET_PASSWORD),
    updatedAt: new Date(String(row.updatedAt)).toISOString(),
  }
}

export async function setAuthPolicy(args: {
  usernameAllowlist?: string[]
  usernameBlocklist?: string[]
  defaultResetPassword?: string
}): Promise<AuthPolicyRecord> {
  const current = await getAuthPolicy()
  const allow = normalizeRuleList(args.usernameAllowlist ?? current.usernameAllowlist)
  const block = normalizeRuleList(args.usernameBlocklist ?? current.usernameBlocklist)
  const password = String(args.defaultResetPassword || current.defaultResetPassword || INITIAL_RESET_PASSWORD).trim()
  await rawExec(
    `insert into "AuthPolicy" (id, "usernameAllowlistJson", "usernameBlocklistJson", "defaultResetPassword", "updatedAt")
     values ($1, $2, $3, $4, now())
     on conflict (id) do update set
       "usernameAllowlistJson" = excluded."usernameAllowlistJson",
       "usernameBlocklistJson" = excluded."usernameBlocklistJson",
       "defaultResetPassword" = excluded."defaultResetPassword",
       "updatedAt" = now()`,
    ['default', JSON.stringify(allow), JSON.stringify(block), password],
  )
  return getAuthPolicy()
}

export async function getUserByUsername(username: string): Promise<UserRecord | null> {
  const normalized = normalizeUsername(username)
  if (!normalized) return null
  const rows = await rawQuery<Record<string, unknown>>(
    'select * from "User" where username = $1 limit 1',
    [normalized],
  )
  return rows[0] ? mapUser(rows[0]) : null
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const rows = await rawQuery<Record<string, unknown>>(
    'select * from "User" where id = $1 limit 1',
    [id],
  )
  return rows[0] ? mapUser(rows[0]) : null
}

export async function listUsers(): Promise<UserRecord[]> {
  const rows = await rawQuery<Record<string, unknown>>(
    'select * from "User" order by "updatedAt" desc',
  )
  return rows.map(mapUser)
}

export async function syncInviteAccountOwnership(): Promise<number> {
  return rawExec(
    `update "Account" a
     set "userId" = ownership."userId", "updatedAt" = now()
     from (
       select pla."accountId", min(pl."usedByUserId") as "userId"
       from "PublicLinkAccount" pla
       join "PublicLink" pl on pl.id = pla."linkId"
       where pl."usedByUserId" is not null
       group by pla."accountId"
       having count(distinct pl."usedByUserId") = 1
     ) ownership
     where a.id = ownership."accountId"
       and a."disabledAt" is null
       and (a."userId" is distinct from ownership."userId")`,
  )
}

export async function listManagedUsers(): Promise<ManagedUserRecord[]> {
  await syncInviteAccountOwnership().catch(() => 0)
  const rows = await rawQuery<Record<string, unknown>>(
    `select
       u.*,
       coalesce(a."accountCount", 0)::int as "accountCount",
       coalesce(pl."inviteCount", 0)::int as "inviteCount",
       coalesce(pl."usedInviteCodes", '') as "usedInviteCodes"
     from "User" u
     left join (
       select "userId", count(*) as "accountCount"
       from "Account"
       where "userId" is not null
       group by "userId"
     ) a on a."userId" = u.id
     left join (
       select "usedByUserId", count(*) as "inviteCount", string_agg(id, ',') as "usedInviteCodes"
       from "PublicLink"
       where "usedByUserId" is not null
       group by "usedByUserId"
     ) pl on pl."usedByUserId" = u.id
     order by u."updatedAt" desc`,
  )
  return rows.map((row) => ({
    ...mapUser(row),
    accountCount: Number(row.accountCount || 0),
    inviteCount: Number(row.inviteCount || 0),
    usedInviteCodes: String(row.usedInviteCodes || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  }))
}

export async function createUser(args: {
  username: string
  password: string
  displayName?: string
}): Promise<UserRecord> {
  const username = normalizeUsername(args.username)
  if (!username) throw new Error('INVALID_USERNAME')
  const policy = await getAuthPolicy()
  if (policy.usernameBlocklist.includes(username)) throw new Error('USERNAME_BLOCKED')
  if (policy.usernameAllowlist.length > 0 && !policy.usernameAllowlist.includes(username)) {
    throw new Error('USERNAME_NOT_ALLOWED')
  }
  const existing = await getUserByUsername(username)
  if (existing) throw new Error('USERNAME_EXISTS')
  const id = crypto.randomUUID()
  const passwordHash = hashPassword(args.password)
  const displayName = args.displayName?.trim() || undefined
  await rawExec(
    'insert into "User" (id, username, "passwordHash", "displayName", "permissionsJson", "createdAt", "updatedAt") values ($1, $2, $3, $4, $5, now(), now())',
    [id, username, passwordHash, displayName ?? null, JSON.stringify(normalizePermissions({}))],
  )
  const created = await getUserById(id)
  if (!created) throw new Error('CREATE_USER_FAILED')
  return created
}

export async function createAutoLinkUser(linkId: string): Promise<UserRecord> {
  const normalizedLinkId = String(linkId || '').trim()
  if (!normalizedLinkId) throw new Error('INVALID_INVITE')
  const suffix = crypto
    .createHash('sha256')
    .update(normalizedLinkId)
    .digest('hex')
    .slice(0, 14)
  const username = `link_${suffix}`
  const existing = await getUserByUsername(username)
  if (existing) return existing
  const id = crypto.randomUUID()
  await rawExec(
    'insert into "User" (id, username, "passwordHash", "displayName", "permissionsJson", "createdAt", "updatedAt") values ($1, $2, $3, $4, $5, now(), now())',
    [
      id,
      username,
      hashPassword(crypto.randomBytes(24).toString('base64url')),
      `邀请码 ${normalizedLinkId}`,
      JSON.stringify(normalizePermissions({})),
    ],
  )
  const created = await getUserById(id)
  if (!created) throw new Error('CREATE_USER_FAILED')
  return created
}

export async function verifyUserPassword(user: UserRecord, password: string): Promise<boolean> {
  return verifyPassword(password, user.passwordHash)
}

export async function updateUserPassword(args: {
  userId: string
  password: string
}): Promise<UserRecord> {
  const passwordHash = hashPassword(args.password)
  await rawExec(
    'update "User" set "passwordHash" = $2, "updatedAt" = now() where id = $1',
    [args.userId, passwordHash],
  )
  const user = await getUserById(args.userId)
  if (!user) throw new Error('NOT_FOUND')
  return user
}

export async function updateUserUsername(args: {
  userId: string
  username: string
}): Promise<UserRecord> {
  const username = normalizeUsername(args.username)
  if (!username) throw new Error('INVALID_USERNAME')
  const policy = await getAuthPolicy()
  if (policy.usernameBlocklist.includes(username)) throw new Error('USERNAME_BLOCKED')
  if (policy.usernameAllowlist.length > 0 && !policy.usernameAllowlist.includes(username)) {
    throw new Error('USERNAME_NOT_ALLOWED')
  }
  const existing = await getUserByUsername(username)
  if (existing && existing.id !== args.userId) throw new Error('USERNAME_EXISTS')
  await rawExec(
    'update "User" set username = $2, "updatedAt" = now() where id = $1',
    [args.userId, username],
  )
  const user = await getUserById(args.userId)
  if (!user) throw new Error('NOT_FOUND')
  return user
}

export async function setUserDisabled(args: {
  userId: string
  disabled: boolean
  reason?: string
}): Promise<UserRecord> {
  await rawExec(
    'update "User" set "disabledAt" = $2, "disabledReason" = $3, "updatedAt" = now() where id = $1',
    [args.userId, args.disabled ? new Date() : null, args.disabled ? args.reason || null : null],
  )
  const user = await getUserById(args.userId)
  if (!user) throw new Error('NOT_FOUND')
  return user
}

export async function updateUserPermissions(args: {
  userId: string
  permissions: UserPermissions
}): Promise<UserRecord> {
  const user = await getUserById(args.userId)
  if (!user) throw new Error('NOT_FOUND')
  const permissions = normalizePermissions(args.permissions)
  await rawExec(
    'update "User" set "permissionsJson" = $2, "updatedAt" = now() where id = $1',
    [args.userId, JSON.stringify(permissions)],
  )
  const updated = await getUserById(args.userId)
  if (!updated) throw new Error('NOT_FOUND')
  return updated
}

export async function createSession(args: {
  userId: string
  sourceLinkId?: string
  ttlDays?: number
}): Promise<UserSessionRecord> {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + (args.ttlDays ?? 30) * 24 * 60 * 60 * 1000)
  await rawExec(
    'insert into "UserSession" (token, "userId", "sourceLinkId", "createdAt", "expiresAt") values ($1, $2, $3, now(), $4)',
    [token, args.userId, args.sourceLinkId ?? null, expiresAt],
  )
  await rawExec('update "User" set "lastLoginAt" = now(), "updatedAt" = now() where id = $1', [
    args.userId,
  ])
  const row = await getSession(token)
  if (!row) throw new Error('CREATE_SESSION_FAILED')
  return row
}

export async function getSession(token: string): Promise<UserSessionRecord | null> {
  const rows = await rawQuery<Record<string, unknown>>(
    'select * from "UserSession" where token = $1 limit 1',
    [token],
  )
  return rows[0] ? mapSession(rows[0]) : null
}

export async function revokeSession(token: string): Promise<void> {
  await rawExec('update "UserSession" set "revokedAt" = now() where token = $1', [token])
}

export async function refreshSessionSeen(token: string): Promise<void> {
  await rawExec(
    `update "UserSession" set "lastSeenAt" = now()
     where token = $1 and ("lastSeenAt" is null or "lastSeenAt" < now() - interval '5 minutes')`,
    [token],
  )
}

export async function findCurrentUser(req: Request): Promise<UserRecord | null> {
  const cookieHeader = String(req.header('cookie') || '')
  const match = cookieHeader.match(/(?:^|;\s*)user_session=([^;]+)/)
  const token = match?.[1] ? decodeURIComponent(match[1]) : ''
  if (!token) return null
  const session = await getSession(token)
  if (!session || session.revokedAt) return null
  if (Date.parse(session.expiresAt) <= Date.now()) return null
  const user = await getUserById(session.userId)
  if (!user || user.disabledAt) return null
  await refreshSessionSeen(token).catch(() => undefined)
  return user
}

export async function listUserAccounts(userId: string) {
  const rows = await rawQuery<Record<string, unknown>>(
    'select * from "Account" where "userId" = $1 and "disabledAt" is null order by "updatedAt" desc',
    [userId],
  )
  return rows
}

export async function listUserAccountSummaries(userId: string) {
  return listAccountSummariesByUser(userId)
}

export async function bindAccountsToUser(args: {
  userId: string
  accountIds: string[]
}): Promise<void> {
  const ids = Array.from(new Set(args.accountIds)).filter(Boolean)
  if (ids.length === 0) return
  await rawExec(
    `update "Account" set "userId" = $1, "updatedAt" = now() where id = any($2::text[])`,
    [args.userId, ids],
  )
}

export async function bindInviteAccountsToUser(userId: string): Promise<number> {
  const rows = await rawQuery<{ accountId: string }>(
    `select distinct pla."accountId" as "accountId"
     from "PublicLinkAccount" pla
     join "PublicLink" pl on pl.id = pla."linkId"
     join "Account" a on a.id = pla."accountId"
     where pl."usedByUserId" = $1 and a."disabledAt" is null`,
    [userId],
  )
  const accountIds = rows.map((row) => String(row.accountId || '')).filter(Boolean)
  await bindAccountsToUser({ userId, accountIds })
  return accountIds.length
}

export async function consumeInviteLink(args: {
  linkId: string
  userId: string
}): Promise<void> {
  const link = await getPublicLink(args.linkId)
  if (!link) throw new Error('NOT_FOUND')
  if ((link as { usedAt?: string }).usedAt || (link as { usedByUserId?: string }).usedByUserId) {
    const usedByUserId = String((link as { usedByUserId?: string }).usedByUserId || '')
    if (usedByUserId && usedByUserId !== args.userId) {
      throw new Error('INVITE_ALREADY_USED')
    }
    await bindAccountsToUser({ userId: args.userId, accountIds: link.accountIds })
    return
  }
  const accountIds = link.accountIds
  await bindAccountsToUser({ userId: args.userId, accountIds })
  await rawExec(
    'update "PublicLink" set "usedAt" = now(), "usedByUserId" = $2, "updatedAt" = now() where id = $1',
    [args.linkId, args.userId],
  )
}

export async function getUserContext(userId: string) {
  const user = await getUserById(userId)
  if (!user) throw new Error('NOT_FOUND')
  const accounts = await listUserAccounts(userId)
  return { user, accounts }
}

export async function validateUsernamePolicy(username: string): Promise<void> {
  const normalized = normalizeUsername(username)
  if (!normalized) throw new Error('INVALID_USERNAME')
  const policy = await getAuthPolicy()
  if (policy.usernameBlocklist.includes(normalized)) throw new Error('USERNAME_BLOCKED')
  if (policy.usernameAllowlist.length > 0 && !policy.usernameAllowlist.includes(normalized)) {
    throw new Error('USERNAME_NOT_ALLOWED')
  }
}

import { Prisma } from '@prisma/client'
import { ensureCredentialsSchema, getCredentialsPrisma } from './credentialsDb.js'

export type EncryptedCredentialRow = {
  accountId: string
  cookieEnc: string | null
  cookieUpdatedAt: Date | null
  cookieCheckedAt: Date | null
  cookieInvalidAt: Date | null
  cookieInvalidReason: string | null
  requestHeadersEnc: string | null
  newHomeUrlEnc: string | null
  qqtAccessTokenEnc: string | null
  qqtAccessTokenCheckedAt: Date | null
  yunpanSessionEnc: string | null
  yunpanSessionUpdatedAt: Date | null
  cmccAppCookieEnc: string | null
  cmccAppCookieUpdatedAt: Date | null
  aigouSessionEnc: string | null
  aigouSessionUpdatedAt: Date | null
  cocPackageSessionsEnc: string | null
  cocPackageSessionsUpdatedAt: Date | null
  wedRechargeCookieEnc: string | null
  wedRechargeCookieUpdatedAt: Date | null
  loginMetaEnc: string | null
  createdAt: Date
  updatedAt: Date
}

export type EncryptedCredentialWrite = Omit<
  EncryptedCredentialRow,
  'createdAt' | 'updatedAt'
>

const credentialColumns = Prisma.sql`
  "accountId",
  "cookieEnc",
  "cookieUpdatedAt",
  "cookieCheckedAt",
  "cookieInvalidAt",
  "cookieInvalidReason",
  "requestHeadersEnc",
  "newHomeUrlEnc",
  "qqtAccessTokenEnc",
  "qqtAccessTokenCheckedAt",
  "yunpanSessionEnc",
  "yunpanSessionUpdatedAt",
  "cmccAppCookieEnc",
  "cmccAppCookieUpdatedAt",
  "aigouSessionEnc",
  "aigouSessionUpdatedAt",
  "cocPackageSessionsEnc",
  "cocPackageSessionsUpdatedAt",
  "wedRechargeCookieEnc",
  "wedRechargeCookieUpdatedAt",
  "loginMetaEnc",
  "createdAt",
  "updatedAt"
`

export async function getEncryptedCredentialRow(
  accountId: string,
): Promise<EncryptedCredentialRow | null> {
  await ensureCredentialsSchema()
  const prisma = getCredentialsPrisma()
  const rows = await prisma.$queryRaw<EncryptedCredentialRow[]>(
    Prisma.sql`
      SELECT ${credentialColumns}
      FROM "UserCredential"
      WHERE "accountId" = ${accountId}
      LIMIT 1
    `,
  )
  return rows[0] ?? null
}

export async function getEncryptedCredentialRows(
  accountIds: string[],
): Promise<Map<string, EncryptedCredentialRow>> {
  const uniqueIds = Array.from(new Set(accountIds.filter(Boolean)))
  const out = new Map<string, EncryptedCredentialRow>()
  if (uniqueIds.length === 0) return out

  await ensureCredentialsSchema()
  const prisma = getCredentialsPrisma()
  const rows = await prisma.$queryRaw<EncryptedCredentialRow[]>(
    Prisma.sql`
      SELECT ${credentialColumns}
      FROM "UserCredential"
      WHERE "accountId" IN (${Prisma.join(uniqueIds)})
    `,
  )
  for (const row of rows) {
    out.set(row.accountId, row)
  }
  return out
}

export async function upsertEncryptedCredentialRow(
  row: EncryptedCredentialWrite,
): Promise<void> {
  await ensureCredentialsSchema()
  const prisma = getCredentialsPrisma()
  await prisma.$executeRaw(
    Prisma.sql`
      INSERT INTO "UserCredential" (
        "accountId",
        "cookieEnc",
        "cookieUpdatedAt",
        "cookieCheckedAt",
        "cookieInvalidAt",
        "cookieInvalidReason",
        "requestHeadersEnc",
        "newHomeUrlEnc",
        "qqtAccessTokenEnc",
        "qqtAccessTokenCheckedAt",
        "yunpanSessionEnc",
        "yunpanSessionUpdatedAt",
        "cmccAppCookieEnc",
        "cmccAppCookieUpdatedAt",
        "aigouSessionEnc",
        "aigouSessionUpdatedAt",
        "cocPackageSessionsEnc",
        "cocPackageSessionsUpdatedAt",
        "wedRechargeCookieEnc",
        "wedRechargeCookieUpdatedAt",
        "loginMetaEnc",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${row.accountId},
        ${row.cookieEnc},
        ${row.cookieUpdatedAt},
        ${row.cookieCheckedAt},
        ${row.cookieInvalidAt},
        ${row.cookieInvalidReason},
        ${row.requestHeadersEnc},
        ${row.newHomeUrlEnc},
        ${row.qqtAccessTokenEnc},
        ${row.qqtAccessTokenCheckedAt},
        ${row.yunpanSessionEnc},
        ${row.yunpanSessionUpdatedAt},
        ${row.cmccAppCookieEnc},
        ${row.cmccAppCookieUpdatedAt},
        ${row.aigouSessionEnc},
        ${row.aigouSessionUpdatedAt},
        ${row.cocPackageSessionsEnc},
        ${row.cocPackageSessionsUpdatedAt},
        ${row.wedRechargeCookieEnc},
        ${row.wedRechargeCookieUpdatedAt},
        ${row.loginMetaEnc},
        now(),
        now()
      )
      ON CONFLICT ("accountId") DO UPDATE SET
        "cookieEnc" = EXCLUDED."cookieEnc",
        "cookieUpdatedAt" = EXCLUDED."cookieUpdatedAt",
        "cookieCheckedAt" = EXCLUDED."cookieCheckedAt",
        "cookieInvalidAt" = EXCLUDED."cookieInvalidAt",
        "cookieInvalidReason" = EXCLUDED."cookieInvalidReason",
        "requestHeadersEnc" = EXCLUDED."requestHeadersEnc",
        "newHomeUrlEnc" = EXCLUDED."newHomeUrlEnc",
        "qqtAccessTokenEnc" = EXCLUDED."qqtAccessTokenEnc",
        "qqtAccessTokenCheckedAt" = EXCLUDED."qqtAccessTokenCheckedAt",
        "yunpanSessionEnc" = EXCLUDED."yunpanSessionEnc",
        "yunpanSessionUpdatedAt" = EXCLUDED."yunpanSessionUpdatedAt",
        "cmccAppCookieEnc" = EXCLUDED."cmccAppCookieEnc",
        "cmccAppCookieUpdatedAt" = EXCLUDED."cmccAppCookieUpdatedAt",
        "aigouSessionEnc" = EXCLUDED."aigouSessionEnc",
        "aigouSessionUpdatedAt" = EXCLUDED."aigouSessionUpdatedAt",
        "cocPackageSessionsEnc" = EXCLUDED."cocPackageSessionsEnc",
        "cocPackageSessionsUpdatedAt" = EXCLUDED."cocPackageSessionsUpdatedAt",
        "wedRechargeCookieEnc" = EXCLUDED."wedRechargeCookieEnc",
        "wedRechargeCookieUpdatedAt" = EXCLUDED."wedRechargeCookieUpdatedAt",
        "loginMetaEnc" = EXCLUDED."loginMetaEnc",
        "updatedAt" = now()
    `,
  )
}

export async function clearEncryptedCredentialsForAccounts(
  accountIds: string[],
  args?: { invalidAt?: Date; reason?: string },
): Promise<void> {
  const uniqueIds = Array.from(new Set(accountIds.filter(Boolean)))
  if (uniqueIds.length === 0) return
  const invalidAt = args?.invalidAt ?? new Date()
  const reason = args?.reason ?? '账号已失效处理'
  for (const accountId of uniqueIds) {
    await upsertEncryptedCredentialRow({
      accountId,
      cookieEnc: null,
      cookieUpdatedAt: null,
      cookieCheckedAt: null,
      cookieInvalidAt: invalidAt,
      cookieInvalidReason: reason,
      requestHeadersEnc: null,
      newHomeUrlEnc: null,
      qqtAccessTokenEnc: null,
      qqtAccessTokenCheckedAt: null,
      yunpanSessionEnc: null,
      yunpanSessionUpdatedAt: null,
      cmccAppCookieEnc: null,
      cmccAppCookieUpdatedAt: null,
      aigouSessionEnc: null,
      aigouSessionUpdatedAt: null,
      cocPackageSessionsEnc: null,
      cocPackageSessionsUpdatedAt: null,
      wedRechargeCookieEnc: null,
      wedRechargeCookieUpdatedAt: null,
      loginMetaEnc: null,
    })
  }
}

export async function deleteEncryptedCredentialsForAccounts(accountIds: string[]): Promise<void> {
  const uniqueIds = Array.from(new Set(accountIds.filter(Boolean)))
  if (uniqueIds.length === 0) return
  await ensureCredentialsSchema()
  const prisma = getCredentialsPrisma()
  await prisma.$executeRaw(
    Prisma.sql`
      DELETE FROM "UserCredential"
      WHERE "accountId" IN (${Prisma.join(uniqueIds)})
    `,
  )
}

// Compare-and-swap only the cloud session: an older check must never overwrite
// a concurrent login or changes to another channel's credentials.
export async function compareAndSwapYunpanSession(accountId: string, previous: string, next: string): Promise<boolean> {
  await ensureCredentialsSchema()
  const changed = await getCredentialsPrisma().$executeRaw(Prisma.sql`
    UPDATE "UserCredential" SET "yunpanSessionEnc" = ${next}, "updatedAt" = NOW()
    WHERE "accountId" = ${accountId} AND "yunpanSessionEnc" = ${previous}
  `)
  return changed === 1
}

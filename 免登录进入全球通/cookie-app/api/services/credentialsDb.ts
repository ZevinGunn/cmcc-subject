import { PrismaClient } from '@prisma/client'
import { getCredentialsDatabaseUrl } from './runtimeConfig.js'

let credentialsPrisma: PrismaClient | null = null
let schemaReady: Promise<void> | null = null

export function getCredentialsPrisma(): PrismaClient {
  if (!credentialsPrisma) {
    credentialsPrisma = new PrismaClient({
      datasourceUrl: getCredentialsDatabaseUrl(),
      log:
        process.env.PRISMA_LOG?.trim() === '1'
          ? ['query', 'warn', 'error']
          : ['warn', 'error'],
    })
  }
  return credentialsPrisma
}

async function createCredentialsSchema(): Promise<void> {
  const prisma = getCredentialsPrisma()
  await prisma.$executeRawUnsafe(`
CREATE TABLE IF NOT EXISTS "UserCredential" (
  "accountId" TEXT PRIMARY KEY,
  "cookieEnc" TEXT,
  "cookieUpdatedAt" TIMESTAMPTZ,
  "cookieCheckedAt" TIMESTAMPTZ,
  "cookieInvalidAt" TIMESTAMPTZ,
  "cookieInvalidReason" TEXT,
  "requestHeadersEnc" TEXT,
  "newHomeUrlEnc" TEXT,
  "qqtAccessTokenEnc" TEXT,
  "qqtAccessTokenCheckedAt" TIMESTAMPTZ,
  "yunpanSessionEnc" TEXT,
  "yunpanSessionUpdatedAt" TIMESTAMPTZ,
  "cmccAppCookieEnc" TEXT,
  "cmccAppCookieUpdatedAt" TIMESTAMPTZ,
  "aigouSessionEnc" TEXT,
  "aigouSessionUpdatedAt" TIMESTAMPTZ,
  "cocPackageSessionsEnc" TEXT,
  "cocPackageSessionsUpdatedAt" TIMESTAMPTZ,
  "wedRechargeCookieEnc" TEXT,
  "wedRechargeCookieUpdatedAt" TIMESTAMPTZ,
  "loginMetaEnc" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
)`)
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "UserCredential" ADD COLUMN IF NOT EXISTS "yunpanSessionEnc" TEXT`,
  )
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "UserCredential" ADD COLUMN IF NOT EXISTS "yunpanSessionUpdatedAt" TIMESTAMPTZ`,
  )
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "UserCredential" ADD COLUMN IF NOT EXISTS "cmccAppCookieEnc" TEXT`,
  )
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "UserCredential" ADD COLUMN IF NOT EXISTS "cmccAppCookieUpdatedAt" TIMESTAMPTZ`,
  )
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "UserCredential" ADD COLUMN IF NOT EXISTS "aigouSessionEnc" TEXT`,
  )
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "UserCredential" ADD COLUMN IF NOT EXISTS "aigouSessionUpdatedAt" TIMESTAMPTZ`,
  )
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "UserCredential" ADD COLUMN IF NOT EXISTS "cocPackageSessionsEnc" TEXT`,
  )
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "UserCredential" ADD COLUMN IF NOT EXISTS "cocPackageSessionsUpdatedAt" TIMESTAMPTZ`,
  )
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "UserCredential" ADD COLUMN IF NOT EXISTS "wedRechargeCookieEnc" TEXT`,
  )
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "UserCredential" ADD COLUMN IF NOT EXISTS "wedRechargeCookieUpdatedAt" TIMESTAMPTZ`,
  )
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "UserCredential" ADD COLUMN IF NOT EXISTS "loginMetaEnc" TEXT`,
  )
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "UserCredential_updatedAt_idx" ON "UserCredential" ("updatedAt")`,
  )
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "UserCredential_cookieInvalidAt_idx" ON "UserCredential" ("cookieInvalidAt")`,
  )
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "UserCredential_qqtAccessTokenCheckedAt_idx" ON "UserCredential" ("qqtAccessTokenCheckedAt")`,
  )
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "UserCredential_cmccAppCookieUpdatedAt_idx" ON "UserCredential" ("cmccAppCookieUpdatedAt")`,
  )
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "UserCredential_aigouSessionUpdatedAt_idx" ON "UserCredential" ("aigouSessionUpdatedAt")`,
  )
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "UserCredential_cocPackageSessionsUpdatedAt_idx" ON "UserCredential" ("cocPackageSessionsUpdatedAt")`,
  )
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "UserCredential_wedRechargeCookieUpdatedAt_idx" ON "UserCredential" ("wedRechargeCookieUpdatedAt")`,
  )
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "UserCredential_yunpanSessionUpdatedAt_idx" ON "UserCredential" ("yunpanSessionUpdatedAt")`,
  )
}

export async function ensureCredentialsSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = createCredentialsSchema()
  }
  return schemaReady
}

import { loadRuntimeConfig } from '../services/runtimeConfig.js'
import { getPrisma } from '../services/prisma.js'
import { upsertEncryptedCredentialRow } from '../services/credentialsStore.js'

export async function main() {
  loadRuntimeConfig()
  const prisma = getPrisma()
  const rows = await prisma.account.findMany({
    where: {
      OR: [
        { cookieEnc: { not: null } },
        { requestHeadersEnc: { not: null } },
        { newHomeUrlEnc: { not: null } },
        { qqtAccessTokenEnc: { not: null } },
      ],
    },
    select: {
      id: true,
      cookieEnc: true,
      cookieUpdatedAt: true,
      cookieCheckedAt: true,
      cookieInvalidAt: true,
      cookieInvalidReason: true,
      requestHeadersEnc: true,
      newHomeUrlEnc: true,
      qqtAccessTokenEnc: true,
      qqtAccessTokenCheckedAt: true,
    },
  })

  let migrated = 0
  for (const row of rows) {
    await upsertEncryptedCredentialRow({
      accountId: row.id,
      cookieEnc: row.cookieEnc,
      cookieUpdatedAt: row.cookieUpdatedAt,
      cookieCheckedAt: row.cookieCheckedAt,
      cookieInvalidAt: row.cookieInvalidAt,
      cookieInvalidReason: row.cookieInvalidReason,
      requestHeadersEnc: row.requestHeadersEnc,
      newHomeUrlEnc: row.newHomeUrlEnc,
      qqtAccessTokenEnc: row.qqtAccessTokenEnc,
      qqtAccessTokenCheckedAt: row.qqtAccessTokenCheckedAt,
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
    migrated += 1
  }

  process.stdout.write(`credentials migrated: ${migrated}\n`)
}

const shouldRunDirectly =
  process.argv[1]?.endsWith('migrate-credentials-from-account.ts') ||
  process.argv[1]?.endsWith('migrate-credentials-from-account.js')

if (shouldRunDirectly) {
  main().catch((e) => {
    process.stderr.write(
      `credentials migration failed: ${e instanceof Error ? e.message : String(e)}\n`,
    )
    process.exit(1)
  })
}

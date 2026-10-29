import { Prisma } from '@prisma/client'
import { loadRuntimeConfig } from '../services/runtimeConfig.js'
import { getPrisma } from '../services/prisma.js'
import {
  ensureCredentialsSchema,
  getCredentialsPrisma,
} from '../services/credentialsDb.js'

function shouldForce(): boolean {
  return process.argv.includes('--force')
}

export async function main() {
  loadRuntimeConfig()
  await ensureCredentialsSchema()

  const prisma = getPrisma()
  const credentialsPrisma = getCredentialsPrisma()

  const legacyCount = await prisma.account.count({
    where: {
      OR: [
        { cookieEnc: { not: null } },
        { requestHeadersEnc: { not: null } },
        { newHomeUrlEnc: { not: null } },
        { qqtAccessTokenEnc: { not: null } },
      ],
    },
  })

  const credentialRows = await credentialsPrisma.$queryRaw<
    Array<{ count: bigint }>
  >(Prisma.sql`SELECT COUNT(*)::bigint AS count FROM "UserCredential"`)
  const credentialCount = Number(credentialRows[0]?.count ?? 0)

  if (legacyCount > 0 && credentialCount < legacyCount && !shouldForce()) {
    throw new Error(
      `CREDENTIALS_MIGRATION_INCOMPLETE: credentials=${credentialCount}, legacy=${legacyCount}`,
    )
  }

  const result = await prisma.account.updateMany({
    where: {
      OR: [
        { cookieEnc: { not: null } },
        { requestHeadersEnc: { not: null } },
        { newHomeUrlEnc: { not: null } },
        { qqtAccessTokenEnc: { not: null } },
      ],
    },
    data: {
      cookieEnc: null,
      cookieUpdatedAt: null,
      cookieCheckedAt: null,
      cookieInvalidAt: null,
      cookieInvalidReason: null,
      requestHeadersEnc: null,
      newHomeUrlEnc: null,
      qqtAccessTokenEnc: null,
      qqtAccessTokenCheckedAt: null,
    },
  })

  process.stdout.write(
    `legacy account credentials cleared: ${result.count}; credentials rows available: ${credentialCount}\n`,
  )
}

const shouldRunDirectly =
  process.argv[1]?.endsWith('clear-legacy-account-credentials.ts') ||
  process.argv[1]?.endsWith('clear-legacy-account-credentials.js')

if (shouldRunDirectly) {
  main().catch((e) => {
    process.stderr.write(
      `legacy credential clear failed: ${e instanceof Error ? e.message : String(e)}\n`,
    )
    process.exit(1)
  })
}

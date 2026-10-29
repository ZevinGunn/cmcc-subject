import 'dotenv/config'

import fs from 'node:fs/promises'
import path from 'node:path'

import { getPrisma } from '../services/prisma.js'
import { encryptJson, maybeEncryptString } from '../services/cryptoBox.js'
import { upsertEncryptedCredentialRow } from '../services/credentialsStore.js'

type AccountRecordJson = {
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
  createdAt: string
  updatedAt: string
}

type AccountsStoreFileV1 = {
  version: 1
  updatedAt: string
  accounts: Record<string, AccountRecordJson>
}

type PublicLinksStoreFileV1 = {
  version: 1
  updatedAt: string
  links: Record<
    string,
    { id: string; accountIds: string[]; createdAt: string; updatedAt: string }
  >
}

function resolvePathFromEnv(envKey: string, fallbackRel: string): string {
  const v = process.env[envKey]
  if (v && v.trim()) {
    return path.isAbsolute(v) ? v : path.resolve(process.cwd(), v)
  }
  return path.resolve(process.cwd(), fallbackRel)
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  const text = await fs.readFile(filePath, 'utf8')
  return JSON.parse(text) as T
}

function parseIsoDate(value?: string): Date | null {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d
}

export async function main() {
  const prisma = getPrisma()

  const accountsPath = resolvePathFromEnv(
    'ACCOUNTS_STORE_PATH',
    path.join('data', 'cmcc-accounts.json'),
  )
  const linksPath = resolvePathFromEnv(
    'PUBLIC_LINKS_STORE_PATH',
    path.join('data', 'public-links.json'),
  )

  const accountsRaw = await readJsonFile<AccountsStoreFileV1>(accountsPath)
  if (!accountsRaw || accountsRaw.version !== 1 || !accountsRaw.accounts) {
    throw new Error(`Invalid accounts store: ${accountsPath}`)
  }

  const linksRaw = await readJsonFile<PublicLinksStoreFileV1>(linksPath).catch(
    () => null,
  )

  const accounts = Object.values(accountsRaw.accounts)

  let upserted = 0
  for (const rec of accounts) {
    const cookieEnc = rec.cookie ? maybeEncryptString(rec.cookie) : null
    const cookieUpdatedAt = parseIsoDate(rec.cookieUpdatedAt)
    const cookieCheckedAt = parseIsoDate(rec.cookieCheckedAt)
    const cookieInvalidAt = parseIsoDate(rec.cookieInvalidAt)
    const requestHeadersEnc = rec.requestHeaders
      ? encryptJson(rec.requestHeaders)
      : null
    const newHomeUrlEnc = rec.newHomeUrl
      ? maybeEncryptString(rec.newHomeUrl)
      : null
    const qqtAccessTokenEnc = rec.qqtAccessToken
      ? maybeEncryptString(rec.qqtAccessToken)
      : null
    const qqtAccessTokenCheckedAt = parseIsoDate(rec.qqtAccessTokenCheckedAt)
    await prisma.account.upsert({
      where: { id: rec.id },
      create: {
        id: rec.id,
        phone: rec.phone ?? '',
        label: rec.label ?? null,
        displayPhone: rec.displayPhone ?? null,
        cookieEnc,
        cookieUpdatedAt,
        cookieCheckedAt,
        cookieInvalidAt,
        cookieInvalidReason: rec.cookieInvalidReason ?? null,
        requestHeadersEnc,
        newHomeUrlEnc,
        qqtAccessTokenEnc,
        qqtAccessTokenCheckedAt,
        qqtInfoEnc: rec.qqtInfo ? encryptJson(rec.qqtInfo) : null,
        createdAt: parseIsoDate(rec.createdAt) ?? new Date(),
        updatedAt: parseIsoDate(rec.updatedAt) ?? new Date(),
      },
      update: {
        phone: rec.phone ?? '',
        label: rec.label ?? null,
        displayPhone: rec.displayPhone ?? null,
        cookieEnc,
        cookieUpdatedAt,
        cookieCheckedAt,
        cookieInvalidAt,
        cookieInvalidReason: rec.cookieInvalidReason ?? null,
        requestHeadersEnc,
        newHomeUrlEnc,
        qqtAccessTokenEnc,
        qqtAccessTokenCheckedAt,
        qqtInfoEnc: rec.qqtInfo ? encryptJson(rec.qqtInfo) : null,
        updatedAt: parseIsoDate(rec.updatedAt) ?? new Date(),
      },
    })
    if (cookieEnc || requestHeadersEnc || newHomeUrlEnc || qqtAccessTokenEnc) {
      await upsertEncryptedCredentialRow({
        accountId: rec.id,
        cookieEnc,
        cookieUpdatedAt,
        cookieCheckedAt,
        cookieInvalidAt,
        cookieInvalidReason: rec.cookieInvalidReason ?? null,
        requestHeadersEnc,
        newHomeUrlEnc,
        qqtAccessTokenEnc,
	        qqtAccessTokenCheckedAt,
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
    upserted += 1
  }

  let linkCount = 0
  let linkEdges = 0

  if (linksRaw && (linksRaw as PublicLinksStoreFileV1).version === 1 && (linksRaw as PublicLinksStoreFileV1).links) {
    const links = Object.values((linksRaw as PublicLinksStoreFileV1).links)
    for (const link of links) {
      await prisma.publicLink.upsert({
        where: { id: link.id },
        create: {
          id: link.id,
          createdAt: parseIsoDate(link.createdAt) ?? new Date(),
          updatedAt: parseIsoDate(link.updatedAt) ?? new Date(),
        },
        update: {
          updatedAt: parseIsoDate(link.updatedAt) ?? new Date(),
        },
      })
      linkCount += 1

      const validAccountIds = (link.accountIds ?? []).filter(Boolean)
      for (const accountId of validAccountIds) {
        const exists = await prisma.account.findUnique({
          where: { id: accountId },
          select: { id: true },
        })
        if (!exists) continue
        await prisma.publicLinkAccount
          .upsert({
            where: { linkId_accountId: { linkId: link.id, accountId } },
            create: { linkId: link.id, accountId },
            update: {},
          })
          .catch(() => undefined)
        linkEdges += 1
      }
    }
  }

  process.stdout.write(
    `import ok: accounts=${upserted}, links=${linkCount}, link_accounts=${linkEdges}\n`,
  )
}

const shouldRunDirectly = process.argv[1]?.endsWith('import-json-to-db.ts') ||
  process.argv[1]?.endsWith('import-json-to-db.js')

if (shouldRunDirectly) {
  main().catch((e) => {
    process.stderr.write(
      `import failed: ${e instanceof Error ? e.message : String(e)}\n`,
    )
    process.exit(1)
  })
}

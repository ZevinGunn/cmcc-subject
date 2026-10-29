import crypto from 'node:crypto'
import { getPrisma } from './prisma.js'
import { clearEncryptedCredentialsForAccounts } from './credentialsStore.js'

export type PublicLinkRecord = {
  id: string
  accountIds: string[]
  disabledAt?: string
  disabledReason?: string
  usedAt?: string
  usedByUserId?: string
  createdAt: string
  updatedAt: string
}

function nowIso(): string {
  return new Date().toISOString()
}

function mapDbToLink(row: {
  id: string
  disabledAt?: Date | null
  disabledReason?: string | null
  usedAt?: Date | null
  usedByUserId?: string | null
  createdAt: Date
  updatedAt: Date
  accounts?: { accountId: string }[]
}): PublicLinkRecord {
  return {
    id: row.id,
    accountIds: (row.accounts ?? []).map((a) => a.accountId),
    disabledAt: row.disabledAt ? row.disabledAt.toISOString() : undefined,
    disabledReason: row.disabledReason ?? undefined,
    usedAt: row.usedAt ? row.usedAt.toISOString() : undefined,
    usedByUserId: row.usedByUserId ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function createPublicLink(): Promise<PublicLinkRecord> {
  const prisma = getPrisma()
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 12)
  const row = await prisma.publicLink.create({ data: { id } })
  return mapDbToLink({ ...row, accounts: [] })
}

export async function getPublicLink(
  id: string,
  args?: { includeDisabled?: boolean },
): Promise<PublicLinkRecord | null> {
  const prisma = getPrisma()
  const row = await prisma.publicLink.findUnique({
    where: { id },
    include: { accounts: { select: { accountId: true } } },
  })
  if (row?.disabledAt && !args?.includeDisabled) return null
  return row ? mapDbToLink(row) : null
}

export async function addLinkAccount(args: {
  linkId: string
  accountId: string
}): Promise<PublicLinkRecord> {
  const prisma = getPrisma()
  const now = new Date()
  const existingLink = await prisma.publicLink.findUnique({
    where: { id: args.linkId },
    select: { id: true, disabledAt: true },
  })
  if (!existingLink || existingLink.disabledAt) {
    throw new Error('NOT_FOUND')
  }
  await prisma.publicLink.update({
    where: { id: args.linkId },
    data: { updatedAt: now },
  })
  await prisma.publicLinkAccount.upsert({
    where: { linkId_accountId: { linkId: args.linkId, accountId: args.accountId } },
    create: { linkId: args.linkId, accountId: args.accountId },
    update: {},
  })
  const row = await prisma.publicLink.findUnique({
    where: { id: args.linkId },
    include: { accounts: { select: { accountId: true } } },
  })
  if (!row) {
    // should not happen because upsert above
    return { id: args.linkId, accountIds: [args.accountId], createdAt: nowIso(), updatedAt: nowIso() }
  }
  return mapDbToLink(row)
}

export async function deletePublicLink(linkId: string): Promise<void> {
  const prisma = getPrisma()
  const now = new Date()
  const reason = '专属链接已失效处理'
  let disabledAccountIds: string[] = []
  await prisma.$transaction(async (tx) => {
    const link = await tx.publicLink.findUnique({
      where: { id: linkId },
      include: { accounts: { select: { accountId: true } } },
    })
    if (!link) return
    await tx.publicLink.update({
      where: { id: linkId },
      data: {
        disabledAt: now,
        disabledReason: reason,
        updatedAt: now,
      },
    })
    const accountIds = link.accounts.map((item) => item.accountId)
    disabledAccountIds = accountIds
    if (accountIds.length) {
      await tx.account.updateMany({
        where: { id: { in: accountIds }, disabledAt: null },
        data: {
          cookieEnc: null,
          cookieUpdatedAt: null,
          cookieCheckedAt: null,
          cookieInvalidAt: now,
          cookieInvalidReason: reason,
          requestHeadersEnc: null,
          newHomeUrlEnc: null,
          qqtAccessTokenEnc: null,
          qqtAccessTokenCheckedAt: null,
          disabledAt: now,
          disabledReason: reason,
        },
      })
    }
  })
  await clearEncryptedCredentialsForAccounts(disabledAccountIds, {
    invalidAt: now,
    reason,
  })
}

export async function removeMissingAccounts(args: {
  linkId: string
  remainingIds: string[]
}): Promise<PublicLinkRecord | null> {
  const prisma = getPrisma()
  const existing = await prisma.publicLink.findUnique({
    where: { id: args.linkId },
    select: { id: true, disabledAt: true },
  })
  if (!existing || existing.disabledAt) return null
  await prisma.$transaction(async (tx) => {
    await tx.publicLinkAccount.deleteMany({
      where: { linkId: args.linkId, accountId: { notIn: args.remainingIds } },
    })
    await tx.publicLink.update({
      where: { id: args.linkId },
      data: { updatedAt: new Date() },
    })
  })
  const row = await prisma.publicLink.findUnique({
    where: { id: args.linkId },
    include: { accounts: { select: { accountId: true } } },
  })
  return row ? mapDbToLink(row) : null
}

export async function listPublicLinks(args?: {
  includeDisabled?: boolean
}): Promise<PublicLinkRecord[]> {
  const prisma = getPrisma()
  const rows = await prisma.publicLink.findMany({
    where: args?.includeDisabled ? undefined : { disabledAt: null },
    orderBy: { updatedAt: 'desc' },
    include: { accounts: { select: { accountId: true } } },
  })
  return rows.map(mapDbToLink)
}

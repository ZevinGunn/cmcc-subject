import crypto from 'node:crypto'
import { getPrisma } from './prisma.js'
import type { BmccActivityConfig } from './bmccActivityOrder.js'

export type StoredBmccActivityConfig = BmccActivityConfig & {
  id: string
  createdAt: string
  updatedAt: string
}

type ActivityConfigRow = {
  id: string
  activityName: string
  displayName: string
  proType: string | null
  packageId: string
  packageCode: string
  packageName: string | null
  productShowCode: string | null
  productShowName: string | null
  productSendUrl: string | null
  pitemShowCode: string
  pitemShowName: string | null
  pitemSendUrl: string | null
  mtOtherParams: string | null
  prodValue: string | null
  isQd2018: boolean | null
  activityUrl: string | null
  createdAt: Date
  updatedAt: Date
}

let storageReady: Promise<void> | null = null

async function ensureStorage(): Promise<void> {
  if (!storageReady) {
    storageReady = getPrisma().$executeRawUnsafe(`
      create table if not exists "BmccActivityOrderConfig" (
        "id" text primary key,
        "activityName" text not null unique,
        "displayName" text not null,
        "proType" text,
        "packageId" text not null,
        "packageCode" text not null,
        "packageName" text,
        "productShowCode" text,
        "productShowName" text,
        "productSendUrl" text,
        "pitemShowCode" text not null,
        "pitemShowName" text,
        "pitemSendUrl" text,
        "mtOtherParams" text,
        "prodValue" text,
        "isQd2018" boolean,
        "activityUrl" text,
        "createdAt" timestamp(3) not null default current_timestamp,
        "updatedAt" timestamp(3) not null default current_timestamp
      )
    `).then(() => getPrisma().$executeRawUnsafe(`
      alter table "BmccActivityOrderConfig" alter column "proType" drop not null
    `)).then(() => undefined).catch((error) => {
      storageReady = null
      throw error
    })
  }
  await storageReady
}

function optional(value: string | null): string | undefined {
  return value || undefined
}

function toStored(row: ActivityConfigRow): StoredBmccActivityConfig {
  return {
    id: row.id,
    activityName: row.activityName,
    displayName: row.displayName,
    ...(row.proType ? { proType: row.proType } : {}),
    packageId: row.packageId,
    packageCode: row.packageCode,
    packageName: optional(row.packageName),
    productShowCode: optional(row.productShowCode),
    productShowName: optional(row.productShowName),
    productSendUrl: optional(row.productSendUrl),
    pitemShowCode: row.pitemShowCode,
    pitemShowName: optional(row.pitemShowName),
    pitemSendUrl: optional(row.pitemSendUrl),
    mtOtherParams: optional(row.mtOtherParams),
    prodValue: optional(row.prodValue),
    isQd2018: row.isQd2018 === null ? undefined : row.isQd2018,
    activityUrl: optional(row.activityUrl),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

const selectFields = `"id", "activityName", "displayName", "proType", "packageId", "packageCode",
  "packageName", "productShowCode", "productShowName", "productSendUrl", "pitemShowCode",
  "pitemShowName", "pitemSendUrl", "mtOtherParams", "prodValue", "isQd2018", "activityUrl",
  "createdAt", "updatedAt"`

export async function listStoredBmccActivityConfigs(): Promise<StoredBmccActivityConfig[]> {
  await ensureStorage()
  const rows = await getPrisma().$queryRawUnsafe<ActivityConfigRow[]>(
    `select ${selectFields} from "BmccActivityOrderConfig" order by "displayName", "activityName"`,
  )
  return rows.map(toStored)
}

export async function getStoredBmccActivityConfig(id: string): Promise<StoredBmccActivityConfig | undefined> {
  await ensureStorage()
  const rows = await getPrisma().$queryRawUnsafe<ActivityConfigRow[]>(
    `select ${selectFields} from "BmccActivityOrderConfig" where "id" = $1 limit 1`,
    id,
  )
  return rows[0] ? toStored(rows[0]) : undefined
}

function values(config: BmccActivityConfig): unknown[] {
  return [
    config.activityName,
    config.displayName,
    config.proType || null,
    config.packageId,
    config.packageCode,
    config.packageName || null,
    config.productShowCode || null,
    config.productShowName || null,
    config.productSendUrl || null,
    config.pitemShowCode,
    config.pitemShowName || null,
    config.pitemSendUrl || null,
    config.mtOtherParams || null,
    config.prodValue || null,
    config.isQd2018 ?? null,
    config.activityUrl || null,
  ]
}

export async function createStoredBmccActivityConfig(config: BmccActivityConfig): Promise<StoredBmccActivityConfig> {
  await ensureStorage()
  const id = crypto.randomUUID()
  const rows = await getPrisma().$queryRawUnsafe<ActivityConfigRow[]>(
    `insert into "BmccActivityOrderConfig" (
       "id", "activityName", "displayName", "proType", "packageId", "packageCode", "packageName",
       "productShowCode", "productShowName", "productSendUrl", "pitemShowCode", "pitemShowName",
       "pitemSendUrl", "mtOtherParams", "prodValue", "isQd2018", "activityUrl", "createdAt", "updatedAt"
     ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, now(), now())
     returning ${selectFields}`,
    id,
    ...values(config),
  )
  if (!rows[0]) throw new Error('CREATE_BMCC_ACTIVITY_CONFIG_FAILED')
  return toStored(rows[0])
}

export async function updateStoredBmccActivityConfig(
  id: string,
  config: BmccActivityConfig,
): Promise<StoredBmccActivityConfig | undefined> {
  await ensureStorage()
  const rows = await getPrisma().$queryRawUnsafe<ActivityConfigRow[]>(
    `update "BmccActivityOrderConfig" set
       "activityName" = $2, "displayName" = $3, "proType" = $4, "packageId" = $5,
       "packageCode" = $6, "packageName" = $7, "productShowCode" = $8,
       "productShowName" = $9, "productSendUrl" = $10, "pitemShowCode" = $11,
       "pitemShowName" = $12, "pitemSendUrl" = $13, "mtOtherParams" = $14,
       "prodValue" = $15, "isQd2018" = $16, "activityUrl" = $17, "updatedAt" = now()
     where "id" = $1 returning ${selectFields}`,
    id,
    ...values(config),
  )
  return rows[0] ? toStored(rows[0]) : undefined
}

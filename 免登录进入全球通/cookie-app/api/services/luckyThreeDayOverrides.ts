import { getPrisma } from './prisma.js'
import type { LuckyActivity, LuckyProduct } from './luckyThreeDay.js'

export type LuckyBenefitOverride = {
  activityId: number
  batchId: number
  skuId: number
  attemptable: boolean
  inventory?: number
  updatedAt: string
}

type OverrideRow = {
  activityId: string
  batchId: string
  skuId: string
  attemptable: boolean
  inventory: number | null
  updatedAt: Date
}

let storageReady: Promise<void> | null = null

async function ensureStorage(): Promise<void> {
  if (!storageReady) {
    storageReady = getPrisma().$executeRawUnsafe(`
      create table if not exists "LuckyThreeDayBenefitOverride" (
        "activityId" text not null,
        "batchId" text not null,
        "skuId" text not null,
        "attemptable" boolean not null default true,
        "inventory" integer,
        "updatedAt" timestamp(3) not null default current_timestamp,
        constraint "LuckyThreeDayBenefitOverride_pkey" primary key ("activityId", "batchId", "skuId"),
        constraint "LuckyThreeDayBenefitOverride_inventory_check" check ("inventory" is null or "inventory" >= 0)
      )
    `).then(() => undefined).catch((error) => {
      storageReady = null
      throw error
    })
  }
  await storageReady
}

function key(input: Pick<LuckyBenefitOverride, 'activityId' | 'batchId' | 'skuId'>): string {
  return `${input.activityId}:${input.batchId}:${input.skuId}`
}

function toOverride(row: OverrideRow): LuckyBenefitOverride {
  return {
    activityId: Number(row.activityId),
    batchId: Number(row.batchId),
    skuId: Number(row.skuId),
    attemptable: row.attemptable,
    inventory: row.inventory === null ? undefined : row.inventory,
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function listLuckyBenefitOverrides(activityId: number): Promise<LuckyBenefitOverride[]> {
  await ensureStorage()
  const rows = await getPrisma().$queryRawUnsafe<OverrideRow[]>(
    `select "activityId", "batchId", "skuId", "attemptable", "inventory", "updatedAt"
     from "LuckyThreeDayBenefitOverride"
     where "activityId" = $1
     order by "batchId", "skuId"`,
    String(activityId),
  )
  return rows.map(toOverride)
}

export async function saveLuckyBenefitOverride(input: {
  activityId: number
  batchId: number
  skuId: number
  attemptable: boolean
  inventory?: number
}): Promise<LuckyBenefitOverride> {
  await ensureStorage()
  const rows = await getPrisma().$queryRawUnsafe<OverrideRow[]>(
    `insert into "LuckyThreeDayBenefitOverride"
       ("activityId", "batchId", "skuId", "attemptable", "inventory", "updatedAt")
     values ($1, $2, $3, $4, $5, now())
     on conflict ("activityId", "batchId", "skuId") do update set
       "attemptable" = excluded."attemptable",
       "inventory" = excluded."inventory",
       "updatedAt" = now()
     returning "activityId", "batchId", "skuId", "attemptable", "inventory", "updatedAt"`,
    String(input.activityId),
    String(input.batchId),
    String(input.skuId),
    input.attemptable,
    input.inventory ?? null,
  )
  if (!rows[0]) throw new Error('SAVE_LUCKY_BENEFIT_OVERRIDE_FAILED')
  return toOverride(rows[0])
}

export function applyLuckyBenefitOverrides(
  activity: LuckyActivity,
  overrides: LuckyBenefitOverride[],
): LuckyActivity {
  const overrideMap = new Map(overrides.map((item) => [key(item), item]))
  return {
    ...activity,
    batches: activity.batches.map((batch) => ({
      ...batch,
      products: batch.products.map((product): LuckyProduct => {
        const override = overrideMap.get(key(product))
        const attemptable = override?.attemptable ?? true
        return {
          ...product,
          available: override?.inventory ?? product.upstreamAvailable,
          inventoryOverride: override?.inventory,
          attemptable,
          actionable: attemptable,
        }
      }),
    })),
  }
}

export const __test__ = {
  applyLuckyBenefitOverrides,
}

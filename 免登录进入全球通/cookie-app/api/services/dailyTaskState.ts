import crypto from 'node:crypto'
import { Prisma } from '@prisma/client'
import { getPrisma } from './prisma.js'

export type DailyTaskType =
  | 'refresh_cookie'
  | 'qqt_token'
  | 'qqt_sign'
  | 'wed_puzzle'

export type DailyTaskStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped'

export type DailyTaskStateRecord = {
  id: string
  accountId: string
  taskDate: string
  taskType: DailyTaskType
  status: DailyTaskStatus
  source: string
  message?: string
  result?: Record<string, unknown>
  startedAt?: string
  finishedAt?: string
  createdAt: string
  updatedAt: string
}

const DONE_STATUSES = new Set<DailyTaskStatus>(['success', 'skipped'])
let tableMissingWarned = false

function isMissingTableError(error: unknown): boolean {
  const rec = error as { code?: string; meta?: { code?: string }; message?: string }
  return (
    rec?.code === 'P2010' && rec.meta?.code === '42P01'
  ) || String(rec?.message || '').includes('relation "DailyTaskState" does not exist')
}

function warnMissingTable(): void {
  if (tableMissingWarned) return
  tableMissingWarned = true
  console.warn('[daily-task-state] DailyTaskState table is missing; daily task state is disabled until migrations run')
}

export function beijingDayKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const year = parts.find((item) => item.type === 'year')?.value ?? '1970'
  const month = parts.find((item) => item.type === 'month')?.value ?? '01'
  const day = parts.find((item) => item.type === 'day')?.value ?? '01'
  return `${year}-${month}-${day}`
}

function parseResultJson(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined
  try {
    const parsed = JSON.parse(value) as unknown
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : undefined
  } catch {
    return undefined
  }
}

function toRecord(row: Record<string, unknown>): DailyTaskStateRecord {
  return {
    id: String(row.id),
    accountId: String(row.accountId),
    taskDate: String(row.taskDate),
    taskType: String(row.taskType) as DailyTaskType,
    status: String(row.status) as DailyTaskStatus,
    source: String(row.source || 'manual'),
    message: typeof row.message === 'string' ? row.message : undefined,
    result: parseResultJson(row.resultJson),
    startedAt: row.startedAt instanceof Date ? row.startedAt.toISOString() : undefined,
    finishedAt: row.finishedAt instanceof Date ? row.finishedAt.toISOString() : undefined,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : new Date().toISOString(),
  }
}

export async function getDailyTaskState(args: {
  accountId: string
  taskType: DailyTaskType
  taskDate?: string
}): Promise<DailyTaskStateRecord | null> {
  const prisma = getPrisma()
  try {
    const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
      SELECT * FROM "DailyTaskState"
      WHERE "accountId" = ${args.accountId}
        AND "taskDate" = ${args.taskDate ?? beijingDayKey()}
        AND "taskType" = ${args.taskType}
      LIMIT 1
    `
    return rows[0] ? toRecord(rows[0]) : null
  } catch (error) {
    if (isMissingTableError(error)) {
      warnMissingTable()
      return null
    }
    throw error
  }
}

export async function shouldSkipDailyTask(args: {
  accountId: string
  taskType: DailyTaskType
  taskDate?: string
  force?: boolean
}): Promise<boolean> {
  if (args.force) return false
  const current = await getDailyTaskState(args)
  return current ? DONE_STATUSES.has(current.status) : false
}

export async function setDailyTaskState(args: {
  accountId: string
  taskType: DailyTaskType
  status: DailyTaskStatus
  source?: string
  message?: string
  result?: Record<string, unknown>
  taskDate?: string
}): Promise<DailyTaskStateRecord> {
  const prisma = getPrisma()
  const now = new Date()
  const taskDate = args.taskDate ?? beijingDayKey(now)
  const resultJson = args.result ? JSON.stringify(args.result) : null
  const startedAt = args.status === 'running' ? now : null
  const finishedAt = args.status === 'success' || args.status === 'failed' || args.status === 'skipped' ? now : null
  try {
    const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
      INSERT INTO "DailyTaskState" (
        "id", "accountId", "taskDate", "taskType", "status", "source",
        "message", "resultJson", "startedAt", "finishedAt", "createdAt", "updatedAt"
      )
      VALUES (
        ${crypto.randomUUID()}, ${args.accountId}, ${taskDate}, ${args.taskType}, ${args.status},
        ${args.source ?? 'manual'}, ${args.message ?? null}, ${resultJson}, ${startedAt},
        ${finishedAt}, ${now}, ${now}
      )
      ON CONFLICT ("accountId", "taskDate", "taskType")
      DO UPDATE SET
        "status" = EXCLUDED."status",
        "source" = EXCLUDED."source",
        "message" = EXCLUDED."message",
        "resultJson" = EXCLUDED."resultJson",
        "startedAt" = COALESCE(EXCLUDED."startedAt", "DailyTaskState"."startedAt"),
        "finishedAt" = EXCLUDED."finishedAt",
        "updatedAt" = EXCLUDED."updatedAt"
      RETURNING *
    `
    return toRecord(rows[0])
  } catch (error) {
    if (isMissingTableError(error)) {
      warnMissingTable()
      return {
        id: '',
        accountId: args.accountId,
        taskDate,
        taskType: args.taskType,
        status: args.status,
        source: args.source ?? 'manual',
        message: args.message,
        result: args.result,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      }
    }
    throw error
  }
}

export async function listDailyTaskStates(args: {
  accountIds: string[]
  taskDate?: string
}): Promise<Record<string, DailyTaskStateRecord[]>> {
  const ids = Array.from(new Set(args.accountIds.map((item) => item.trim()).filter(Boolean)))
  if (ids.length === 0) return {}
  const prisma = getPrisma()
  let rows: Array<Record<string, unknown>>
  try {
    rows = await prisma.$queryRaw<Array<Record<string, unknown>>>(
      Prisma.sql`
        SELECT * FROM "DailyTaskState"
        WHERE "taskDate" = ${args.taskDate ?? beijingDayKey()}
          AND "accountId" IN (${Prisma.join(ids)})
        ORDER BY "accountId" ASC, "taskType" ASC
      `,
    )
  } catch (error) {
    if (isMissingTableError(error)) {
      warnMissingTable()
      return {}
    }
    throw error
  }
  const out: Record<string, DailyTaskStateRecord[]> = {}
  for (const row of rows) {
    const rec = toRecord(row)
    out[rec.accountId] = [...(out[rec.accountId] ?? []), rec]
  }
  return out
}

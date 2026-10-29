import crypto from 'node:crypto'
import sanitizeHtml from 'sanitize-html'
import { getPrisma } from './prisma.js'
import { ensureUserAuthStorage } from './userAuthStore.js'

export type AnnouncementLevel = 'strong' | 'medium' | 'weak'
export type AnnouncementStatus = 'draft' | 'scheduled' | 'active' | 'expired'
export type DismissScope = 'today' | 'forever'

export type AnnouncementRecord = {
  id: string
  title: string
  contentHtml: string
  level: AnnouncementLevel
  important: boolean
  enabled: boolean
  publishAt: string
  expireAt?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
  status: AnnouncementStatus
}

export type AnnouncementReceipt = {
  announcementId: string
  userId: string
  readAt?: string
  firstShownAt?: string
  lastShownDay?: string
  dismissedAt?: string
  updatedAt: string
}

export type PublicAnnouncement = Omit<
  AnnouncementRecord,
  'enabled' | 'createdBy' | 'createdAt' | 'updatedAt' | 'status'
> & {
  readAt?: string
  dismissedAt?: string
}

export type AnnouncementInput = {
  title: string
  contentHtml: string
  level: AnnouncementLevel
  important: boolean
  enabled: boolean
  publishAt: string
  expireAt?: string
}

export class AnnouncementValidationError extends Error {
  code: string

  constructor(message: string, code = 'INVALID_INPUT') {
    super(message)
    this.name = 'AnnouncementValidationError'
    this.code = code
  }
}

const ALLOWED_TAGS = [
  'p', 'br', 'h1', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'table', 'thead', 'tbody',
  'tr', 'th', 'td', 'img', 'hr', 'span', 'div',
]

export function sanitizeAnnouncementHtml(input: string): string {
  return sanitizeHtml(String(input || ''), {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    allowProtocolRelative: false,
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: 'a',
        attribs: {
          ...attribs,
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
    },
  }).trim()
}

function stripTags(input: string): string {
  return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} }).trim()
}

function parseDate(value: string, field: string): Date {
  const date = new Date(value)
  if (!value || Number.isNaN(date.getTime())) {
    throw new AnnouncementValidationError(`${field}格式不正确`, 'INVALID_SCHEDULE')
  }
  return date
}

export function validateAnnouncementInput(raw: Partial<AnnouncementInput>): AnnouncementInput {
  const title = stripTags(String(raw.title || '')).replace(/\s+/g, ' ').trim()
  if (!title || title.length > 120) {
    throw new AnnouncementValidationError('公告标题需为 1-120 个字符')
  }
  const contentRaw = String(raw.contentHtml || '')
  if (Buffer.byteLength(contentRaw, 'utf8') > 200 * 1024) {
    throw new AnnouncementValidationError('公告正文不能超过 200KB', 'CONTENT_TOO_LARGE')
  }
  const contentHtml = sanitizeAnnouncementHtml(contentRaw)
  if (!stripTags(contentHtml) && !/<img\b/i.test(contentHtml)) {
    throw new AnnouncementValidationError('公告正文不能为空')
  }
  const level = String(raw.level || '') as AnnouncementLevel
  if (!['strong', 'medium', 'weak'].includes(level)) {
    throw new AnnouncementValidationError('公告等级不正确', 'INVALID_LEVEL')
  }
  const publishAtDate = parseDate(String(raw.publishAt || new Date().toISOString()), '发布时间')
  const expireAtDate = raw.expireAt ? parseDate(String(raw.expireAt), '失效时间') : undefined
  if (expireAtDate && expireAtDate.getTime() <= publishAtDate.getTime()) {
    throw new AnnouncementValidationError('失效时间必须晚于发布时间', 'INVALID_SCHEDULE')
  }
  return {
    title,
    contentHtml,
    level,
    important: Boolean(raw.important),
    enabled: Boolean(raw.enabled),
    publishAt: publishAtDate.toISOString(),
    expireAt: expireAtDate?.toISOString(),
  }
}

export function getAnnouncementStatus(
  value: Pick<AnnouncementInput, 'enabled' | 'publishAt' | 'expireAt'>,
  now = new Date(),
): AnnouncementStatus {
  if (!value.enabled) return 'draft'
  if (Date.parse(value.publishAt) > now.getTime()) return 'scheduled'
  if (value.expireAt && Date.parse(value.expireAt) <= now.getTime()) return 'expired'
  return 'active'
}

export function beijingAnnouncementDay(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

export function selectPopupAnnouncement<T extends {
  important: boolean
  level: AnnouncementLevel
  publishAt: string
  firstShownAt?: string
  lastShownDay?: string
  dismissedAt?: string
}>(items: T[], serverDay: string): T | null {
  return items
    .filter((item) => {
      if (item.dismissedAt) return false
      if (item.important) return true
      if (item.level === 'strong') return item.lastShownDay !== serverDay
      if (item.level === 'medium') return !item.firstShownAt
      return false
    })
    .sort((a, b) => {
      const rank = (item: T) => item.important ? 3 : item.level === 'strong' ? 2 : 1
      return rank(b) - rank(a) || Date.parse(b.publishAt) - Date.parse(a.publishAt)
    })[0] ?? null
}

let storageReady: Promise<void> | null = null

async function exec(sql: string, params: unknown[] = []): Promise<number> {
  const prisma = getPrisma()
  return prisma.$executeRawUnsafe(sql, ...params)
}

async function query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  await ensureAnnouncementStorage()
  const prisma = getPrisma()
  return prisma.$queryRawUnsafe(sql, ...params) as Promise<T[]>
}

export async function ensureAnnouncementStorage(): Promise<void> {
  if (!storageReady) {
    storageReady = (async () => {
      await ensureUserAuthStorage()
      await exec(`
        create table if not exists "Announcement" (
          "id" text not null,
          "title" text not null,
          "contentHtml" text not null,
          "level" text not null,
          "important" boolean not null default false,
          "enabled" boolean not null default false,
          "publishAt" timestamp(3) not null,
          "expireAt" timestamp(3),
          "createdBy" text,
          "createdAt" timestamp(3) not null default current_timestamp,
          "updatedAt" timestamp(3) not null,
          constraint "Announcement_pkey" primary key ("id"),
          constraint "Announcement_level_check" check ("level" in ('strong', 'medium', 'weak')),
          constraint "Announcement_schedule_check" check ("expireAt" is null or "expireAt" > "publishAt")
        )
      `)
      await exec(`
        create table if not exists "AnnouncementReceipt" (
          "announcementId" text not null,
          "userId" text not null,
          "readAt" timestamp(3),
          "firstShownAt" timestamp(3),
          "lastShownDay" text,
          "dismissedAt" timestamp(3),
          "updatedAt" timestamp(3) not null,
          constraint "AnnouncementReceipt_pkey" primary key ("announcementId", "userId"),
          constraint "AnnouncementReceipt_announcementId_fkey" foreign key ("announcementId") references "Announcement"("id") on delete cascade on update cascade,
          constraint "AnnouncementReceipt_userId_fkey" foreign key ("userId") references "User"("id") on delete cascade on update cascade
        )
      `)
      await exec('create index if not exists "Announcement_active_idx" on "Announcement"("enabled", "publishAt", "expireAt")')
      await exec('create index if not exists "Announcement_updatedAt_idx" on "Announcement"("updatedAt")')
      await exec('create index if not exists "AnnouncementReceipt_user_read_idx" on "AnnouncementReceipt"("userId", "readAt")')
    })()
  }
  return storageReady
}

function iso(value: unknown): string {
  return new Date(String(value)).toISOString()
}

function optionalIso(value: unknown): string | undefined {
  return value ? iso(value) : undefined
}

function mapAnnouncement(row: Record<string, unknown>, now = new Date()): AnnouncementRecord {
  const value = {
    id: String(row.id),
    title: String(row.title),
    contentHtml: String(row.contentHtml),
    level: String(row.level) as AnnouncementLevel,
    important: Boolean(row.important),
    enabled: Boolean(row.enabled),
    publishAt: iso(row.publishAt),
    expireAt: optionalIso(row.expireAt),
    createdBy: row.createdBy ? String(row.createdBy) : undefined,
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  }
  return { ...value, status: getAnnouncementStatus(value, now) }
}

function mapReceipt(row: Record<string, unknown>): AnnouncementReceipt {
  return {
    announcementId: String(row.announcementId),
    userId: String(row.userId),
    readAt: optionalIso(row.readAt),
    firstShownAt: optionalIso(row.firstShownAt),
    lastShownDay: row.lastShownDay ? String(row.lastShownDay) : undefined,
    dismissedAt: optionalIso(row.dismissedAt),
    updatedAt: iso(row.updatedAt),
  }
}

export async function listAdminAnnouncements(): Promise<AnnouncementRecord[]> {
  const rows = await query<Record<string, unknown>>('select * from "Announcement" order by "updatedAt" desc')
  const now = new Date()
  return rows.map((row) => mapAnnouncement(row, now))
}

export async function createAnnouncement(input: AnnouncementInput, createdBy?: string): Promise<AnnouncementRecord> {
  const value = validateAnnouncementInput(input)
  const id = crypto.randomUUID()
  await ensureAnnouncementStorage()
  await exec(
    `insert into "Announcement" ("id", "title", "contentHtml", "level", "important", "enabled", "publishAt", "expireAt", "createdBy", "createdAt", "updatedAt")
     values ($1, $2, $3, $4, $5, $6, $7::timestamptz at time zone 'UTC', $8::timestamptz at time zone 'UTC', $9, now(), now())`,
    [id, value.title, value.contentHtml, value.level, value.important, value.enabled, value.publishAt, value.expireAt ?? null, createdBy ?? null],
  )
  const rows = await query<Record<string, unknown>>('select * from "Announcement" where id = $1 limit 1', [id])
  return mapAnnouncement(rows[0])
}

export async function updateAnnouncement(id: string, input: AnnouncementInput): Promise<AnnouncementRecord | null> {
  const value = validateAnnouncementInput(input)
  await ensureAnnouncementStorage()
  const changed = await exec(
    `update "Announcement" set "title" = $2, "contentHtml" = $3, "level" = $4, "important" = $5,
       "enabled" = $6, "publishAt" = $7::timestamptz at time zone 'UTC',
       "expireAt" = $8::timestamptz at time zone 'UTC', "updatedAt" = now() where id = $1`,
    [id, value.title, value.contentHtml, value.level, value.important, value.enabled, value.publishAt, value.expireAt ?? null],
  )
  if (!changed) return null
  const rows = await query<Record<string, unknown>>('select * from "Announcement" where id = $1 limit 1', [id])
  return rows[0] ? mapAnnouncement(rows[0]) : null
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  await ensureAnnouncementStorage()
  return (await exec('delete from "Announcement" where id = $1', [id])) > 0
}

export async function listPublicAnnouncements(userId: string): Promise<{
  announcements: PublicAnnouncement[]
  unreadCount: number
  popupAnnouncement: PublicAnnouncement | null
  serverDay: string
}> {
  const rows = await query<Record<string, unknown>>(
    `select a.*, r."readAt", r."firstShownAt", r."lastShownDay", r."dismissedAt"
     from "Announcement" a
     left join "AnnouncementReceipt" r on r."announcementId" = a.id and r."userId" = $1
     where a."enabled" = true and a."publishAt" <= now() and (a."expireAt" is null or a."expireAt" > now())
     order by a."important" desc, a."publishAt" desc`,
    [userId],
  )
  const internal = rows.map((row) => ({
    ...mapAnnouncement(row),
    readAt: optionalIso(row.readAt),
    firstShownAt: optionalIso(row.firstShownAt),
    lastShownDay: row.lastShownDay ? String(row.lastShownDay) : undefined,
    dismissedAt: optionalIso(row.dismissedAt),
  }))
  const announcements: PublicAnnouncement[] = internal.map((item) => ({
    id: item.id,
    title: item.title,
    contentHtml: item.contentHtml,
    level: item.level,
    important: item.important,
    publishAt: item.publishAt,
    expireAt: item.expireAt,
    readAt: item.readAt,
    dismissedAt: item.dismissedAt,
  }))
  const serverDay = beijingAnnouncementDay()
  const popup = selectPopupAnnouncement(internal, serverDay)
  const popupAnnouncement = popup
    ? announcements.find((item) => item.id === popup.id) ?? null
    : null
  return {
    announcements,
    unreadCount: internal.filter((item) => !item.readAt).length,
    popupAnnouncement,
    serverDay,
  }
}

async function getActiveAnnouncement(id: string): Promise<AnnouncementRecord | null> {
  const rows = await query<Record<string, unknown>>(
    `select * from "Announcement" where id = $1 and "enabled" = true and "publishAt" <= now()
       and ("expireAt" is null or "expireAt" > now()) limit 1`,
    [id],
  )
  return rows[0] ? mapAnnouncement(rows[0]) : null
}

export async function markAnnouncementRead(id: string, userId: string): Promise<AnnouncementReceipt | null> {
  if (!(await getActiveAnnouncement(id))) return null
  await exec(
    `insert into "AnnouncementReceipt" ("announcementId", "userId", "readAt", "updatedAt") values ($1, $2, now(), now())
     on conflict ("announcementId", "userId") do update set "readAt" = coalesce("AnnouncementReceipt"."readAt", now()), "updatedAt" = now()`,
    [id, userId],
  )
  const rows = await query<Record<string, unknown>>('select * from "AnnouncementReceipt" where "announcementId" = $1 and "userId" = $2', [id, userId])
  return mapReceipt(rows[0])
}

export async function markAnnouncementShown(id: string, userId: string): Promise<AnnouncementReceipt | null> {
  if (!(await getActiveAnnouncement(id))) return null
  const day = beijingAnnouncementDay()
  await exec(
    `insert into "AnnouncementReceipt" ("announcementId", "userId", "readAt", "firstShownAt", "lastShownDay", "updatedAt")
     values ($1, $2, now(), now(), $3, now())
     on conflict ("announcementId", "userId") do update set
       "readAt" = coalesce("AnnouncementReceipt"."readAt", now()),
       "firstShownAt" = coalesce("AnnouncementReceipt"."firstShownAt", now()),
       "lastShownDay" = $3, "updatedAt" = now()`,
    [id, userId, day],
  )
  const rows = await query<Record<string, unknown>>('select * from "AnnouncementReceipt" where "announcementId" = $1 and "userId" = $2', [id, userId])
  return mapReceipt(rows[0])
}

export function canDismissAnnouncement(
  announcement: Pick<AnnouncementRecord, 'important' | 'level'>,
  scope: DismissScope,
): boolean {
  if (scope === 'today') return !announcement.important && announcement.level === 'strong'
  return announcement.important || announcement.level === 'medium'
}

export async function dismissAnnouncement(
  id: string,
  userId: string,
  scope: DismissScope,
): Promise<AnnouncementReceipt | null> {
  const announcement = await getActiveAnnouncement(id)
  if (!announcement) return null
  if (!canDismissAnnouncement(announcement, scope)) {
    throw new AnnouncementValidationError('当前公告不支持该提醒设置')
  }
  await markAnnouncementShown(id, userId)
  if (scope === 'forever') {
    await exec(
      'update "AnnouncementReceipt" set "dismissedAt" = coalesce("dismissedAt", now()), "updatedAt" = now() where "announcementId" = $1 and "userId" = $2',
      [id, userId],
    )
  }
  const rows = await query<Record<string, unknown>>('select * from "AnnouncementReceipt" where "announcementId" = $1 and "userId" = $2', [id, userId])
  return mapReceipt(rows[0])
}

export const __test__ = {
  sanitizeAnnouncementHtml,
  validateAnnouncementInput,
  getAnnouncementStatus,
  beijingAnnouncementDay,
  selectPopupAnnouncement,
  canDismissAnnouncement,
}

import { encryptJson } from './cryptoBox.js'
import { getPrisma } from './prisma.js'
import type { LogLevel } from './logStore.js'

export async function logEvent(args: {
  level?: LogLevel
  action: string
  requestId?: string
  accountId?: string
  linkId?: string
  message?: string
  meta?: unknown
}): Promise<void> {
  const prisma = getPrisma()
  const level = args.level ?? 'info'
  const metaEnc = args.meta === undefined ? null : encryptJson(args.meta)
  await prisma.logEntry
    .create({
      data: {
        level,
        action: args.action,
        requestId: args.requestId ?? null,
        accountId: args.accountId ?? null,
        linkId: args.linkId ?? null,
        message: args.message ?? null,
        metaEnc,
      },
    })
    .catch(() => undefined)
}


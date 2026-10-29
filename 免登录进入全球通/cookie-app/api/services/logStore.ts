export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export async function logEvent(args: {
  level?: LogLevel
  action: string
  requestId?: string
  accountId?: string
  linkId?: string
  message?: string
  meta?: unknown
}): Promise<void> {
  const m = await import('./logStoreDb.js')
  await m.logEvent(args)
}

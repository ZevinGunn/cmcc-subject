export type CredentialMaintenanceResult = { status: 'success' | 'failed' | 'skipped'; message: string }

// Run in order, keeping the primary cloud credential independent of secondary
// channel failures. No check-in, draw or other activity actions belong here.
export async function maintainCredentialChannels(args: {
  hasYunpan: boolean
  maintainYunpan: () => Promise<CredentialMaintenanceResult>
  maintain10086: () => Promise<CredentialMaintenanceResult>
}): Promise<CredentialMaintenanceResult> {
  const run = async (task: () => Promise<CredentialMaintenanceResult>, channel: string) => {
    try { return await task() } catch {
      return { status: 'failed' as const, message: `${channel}维护异常，请稍后重试` }
    }
  }
  const primary = args.hasYunpan ? await run(args.maintainYunpan, '云盘 CK') : undefined
  const secondary = await run(args.maintain10086, '10086 CK')
  if (!primary) return secondary
  return {
    status: primary.status,
    message: [primary.message, secondary.message].filter(Boolean).join('；'),
  }
}

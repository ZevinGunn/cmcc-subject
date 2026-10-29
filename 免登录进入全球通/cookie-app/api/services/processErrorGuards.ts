let installed = false

function stringifyReason(reason: unknown): string {
  if (reason instanceof Error) return reason.stack || reason.message
  try {
    return JSON.stringify(reason)
  } catch {
    return String(reason)
  }
}

export function installProcessErrorGuards(): void {
  if (installed) return
  installed = true

  process.on('unhandledRejection', (reason: unknown) => {
    console.error('[process:unhandledRejection]', stringifyReason(reason))
  })

  process.on('uncaughtException', (error: Error) => {
    console.error('[process:uncaughtException]', stringifyReason(error))
  })
}

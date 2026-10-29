import 'dotenv/config'

import { runCookieMaintenanceNow } from '../services/batchTasks.js'

function readConcurrency(): number | undefined {
  const raw = Number(process.env.CK_MAINTENANCE_CONCURRENCY ?? process.argv[2] ?? '')
  if (!Number.isFinite(raw)) return undefined
  return Math.max(1, Math.min(10, Math.floor(raw)))
}

async function main() {
  const startedAt = new Date()
  const result = await runCookieMaintenanceNow({
    source: 'maintenance',
    concurrency: readConcurrency(),
  })
  const finishedAt = new Date()
  process.stdout.write(
    [
      `CK maintenance finished at ${finishedAt.toISOString()}`,
      `startedAt=${startedAt.toISOString()}`,
      `total=${result.total}`,
      `success=${result.success}`,
      `failed=${result.failed}`,
      `skipped=${result.skipped}`,
    ].join(' ') + '\n',
  )
  for (const item of result.results) {
    process.stdout.write(`${item.status}\t${item.accountId}\t${item.message}\n`)
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  process.stderr.write(`CK maintenance failed: ${message}\n`)
  process.exit(1)
})

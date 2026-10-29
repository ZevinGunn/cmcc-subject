import { loadRuntimeConfig } from '../services/runtimeConfig.js'
import { ensureCredentialsSchema } from '../services/credentialsDb.js'

export async function main() {
  loadRuntimeConfig()
  await ensureCredentialsSchema()
  process.stdout.write('credentials schema ready\n')
}

const shouldRunDirectly =
  process.argv[1]?.endsWith('init-credentials-db.ts') ||
  process.argv[1]?.endsWith('init-credentials-db.js')

if (shouldRunDirectly) {
  main().catch((e) => {
    process.stderr.write(
      `credentials schema init failed: ${e instanceof Error ? e.message : String(e)}\n`,
    )
    process.exit(1)
  })
}

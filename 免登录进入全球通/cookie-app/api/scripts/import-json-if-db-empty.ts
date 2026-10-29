import 'dotenv/config'

import fs from 'node:fs'
import path from 'node:path'

import { getPrisma } from '../services/prisma.js'

function resolvePathFromEnv(envKey: string, fallbackRel: string): string {
  const value = process.env[envKey]?.trim()
  if (value) {
    return path.isAbsolute(value) ? value : path.resolve(process.cwd(), value)
  }
  return path.resolve(process.cwd(), fallbackRel)
}

async function main() {
  const prisma = getPrisma()
  const accountCount = await prisma.account.count()
  if (accountCount > 0) {
    process.stdout.write(`skip import: database already has accounts=${accountCount}\n`)
    return
  }

  const accountsPath = resolvePathFromEnv(
    'ACCOUNTS_STORE_PATH',
    path.join('data', 'cmcc-accounts.json'),
  )
  const linksPath = resolvePathFromEnv(
    'PUBLIC_LINKS_STORE_PATH',
    path.join('data', 'public-links.json'),
  )

  if (!fs.existsSync(accountsPath) && !fs.existsSync(linksPath)) {
    process.stdout.write('skip import: no legacy json files found\n')
    return
  }

  const module = await import('./import-json-to-db.js')
  if (typeof module.main !== 'function') {
    throw new Error('import-json-to-db main() not found')
  }
  await module.main()
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  process.stderr.write(`import-if-empty failed: ${message}\n`)
  process.exit(1)
})

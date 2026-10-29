import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'

let loaded = false
let validated = false

function resolveEnvFiles(): string[] {
  const cwd = process.cwd()
  const appEnv = (process.env.APP_ENV || process.env.NODE_ENV || 'development').trim()
  const explicit = process.env.ENV_FILE?.trim()

  if (explicit) {
    const abs = path.isAbsolute(explicit) ? explicit : path.resolve(cwd, explicit)
    return [abs]
  }

  return [
    path.resolve(cwd, '.env'),
    path.resolve(cwd, `.env.${appEnv}`),
    path.resolve(cwd, '.env.local'),
    path.resolve(cwd, `.env.${appEnv}.local`),
  ]
}

export function loadRuntimeConfig(): void {
  if (loaded) return
  for (const file of resolveEnvFiles()) {
    if (!fs.existsSync(file)) continue
    dotenv.config({ path: file, override: true })
  }
  loaded = true
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`MISSING_ENV:${name}`)
  }
  return value
}

function assertPostgresUrl(databaseUrl: string): void {
  const lower = databaseUrl.toLowerCase()
  if (!lower.startsWith('postgresql://') && !lower.startsWith('postgres://')) {
    throw new Error('INVALID_DATABASE_URL:only_postgresql_supported')
  }
}

function assertDatabaseName(databaseName: string): void {
  if (!/^[A-Za-z0-9_-]+$/.test(databaseName)) {
    throw new Error('INVALID_CREDENTIALS_DATABASE_NAME')
  }
}

export function deriveCredentialsDatabaseUrl(databaseUrl: string): string {
  assertPostgresUrl(databaseUrl)
  const databaseName =
    process.env.CREDENTIALS_DATABASE_NAME?.trim() || 'cmcc_credentials'
  assertDatabaseName(databaseName)
  try {
    const url = new URL(databaseUrl)
    url.pathname = `/${databaseName}`
    return url.toString()
  } catch {
    throw new Error('INVALID_DATABASE_URL:parse_failed')
  }
}

export function getCredentialsDatabaseUrl(): string {
  loadRuntimeConfig()
  const databaseUrl = getRequiredEnv('DATABASE_URL')
  const credentialsDatabaseUrl =
    process.env.CREDENTIALS_DATABASE_URL?.trim() ||
    deriveCredentialsDatabaseUrl(databaseUrl)
  assertPostgresUrl(credentialsDatabaseUrl)
  return credentialsDatabaseUrl
}

function assertEncryptionKey(key: string): void {
  let buf: Buffer
  try {
    buf = Buffer.from(key, 'base64')
  } catch {
    throw new Error('INVALID_ENCRYPTION_KEY')
  }
  if (buf.length !== 32) {
    throw new Error('INVALID_ENCRYPTION_KEY')
  }
}

export function validateRuntimeConfig(): void {
  if (validated) return
  loadRuntimeConfig()

  const databaseUrl = getRequiredEnv('DATABASE_URL')
  const credentialsDatabaseUrl = getCredentialsDatabaseUrl()
  const encryptionKey = getRequiredEnv('CMCC_DB_ENCRYPTION_KEY')
  const adminKey = getRequiredEnv('ADMIN_KEY')

  assertPostgresUrl(databaseUrl)
  assertPostgresUrl(credentialsDatabaseUrl)
  assertEncryptionKey(encryptionKey)

  if (adminKey === 'change-me') {
    throw new Error('INVALID_ADMIN_KEY:replace_change_me')
  }

  validated = true
}

export function getAppEnv(): string {
  loadRuntimeConfig()
  return (process.env.APP_ENV || process.env.NODE_ENV || 'development').trim()
}

export const __test__ = {
  resolveEnvFiles,
  assertPostgresUrl,
  deriveCredentialsDatabaseUrl,
  assertEncryptionKey,
}

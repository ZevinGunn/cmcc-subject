import crypto from 'node:crypto'

function getKey(): Buffer {
  const raw = process.env.CMCC_DB_ENCRYPTION_KEY?.trim()
  if (!raw) {
    throw new Error('MISSING_ENCRYPTION_KEY')
  }
  let buf: Buffer
  try {
    buf = Buffer.from(raw, 'base64')
  } catch {
    throw new Error('INVALID_ENCRYPTION_KEY')
  }
  if (buf.length !== 32) {
    throw new Error('INVALID_ENCRYPTION_KEY')
  }
  return buf
}

// AES-256-GCM with random IV. Output format:
//   v1:<iv_b64>:<ct_b64>:<tag_b64>
export function encryptString(plain: string): string {
  const key = getKey()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const ct = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `v1:${iv.toString('base64')}:${ct.toString('base64')}:${tag.toString('base64')}`
}

export function decryptString(enc: string): string {
  const key = getKey()
  const parts = enc.split(':')
  if (parts.length !== 4 || parts[0] !== 'v1') {
    throw new Error('INVALID_ENCRYPTED_VALUE')
  }
  const iv = Buffer.from(parts[1], 'base64')
  const ct = Buffer.from(parts[2], 'base64')
  const tag = Buffer.from(parts[3], 'base64')
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)
  const pt = Buffer.concat([decipher.update(ct), decipher.final()])
  return pt.toString('utf8')
}

export function encryptJson(value: unknown): string {
  return encryptString(JSON.stringify(value ?? null))
}

export function decryptJson<T>(enc: string): T {
  const text = decryptString(enc)
  return JSON.parse(text) as T
}

export function maybeEncryptString(value: string | undefined | null): string | null {
  if (!value) return null
  return encryptString(value)
}

export function maybeDecryptString(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  return decryptString(value)
}


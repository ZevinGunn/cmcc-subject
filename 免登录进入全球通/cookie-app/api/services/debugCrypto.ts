import { aesDecrypt, aesEncrypt } from './cmccCrypto.js'
import {
  CMCC_BUSINESS_CRYPTO,
  decryptBusinessRequestBody,
  decryptBusinessResponseBody,
  encryptBusinessResponseBody,
  encryptBusinessText,
} from './cmccBusinessCrypto.js'

export type CryptoFormatResult =
  | { kind: 'json'; output: string }
  | { kind: 'text'; output: string }

export type DebugCryptoMode = 'legacy' | 'business-request' | 'business-response'

function normalizeJsonText(input: string): string {
  const raw = String(input ?? '')
  const t = raw.trim()
  if (!t) return ''
  try {
    return JSON.stringify(JSON.parse(t))
  } catch {
    return raw
  }
}

function unwrapResponseBody(input: string): string {
  const raw = String(input ?? '').trim()
  if (!raw) return ''
  if (!raw.startsWith('{')) return raw
  try {
    const parsed = JSON.parse(raw) as { body?: unknown }
    return typeof parsed.body === 'string' ? parsed.body : raw
  } catch {
    return raw
  }
}

export async function debugEncrypt(input: string, mode: DebugCryptoMode = 'legacy'): Promise<string> {
  if (mode === 'business-request') return encryptBusinessText(normalizeJsonText(input))
  if (mode === 'business-response') return encryptBusinessResponseBody(normalizeJsonText(input))
  return await aesEncrypt(input)
}

export async function debugDecrypt(input: string, mode: DebugCryptoMode = 'legacy'): Promise<string> {
  if (mode === 'business-request') return decryptBusinessRequestBody(String(input ?? '').trim())
  if (mode === 'business-response') return decryptBusinessResponseBody(unwrapResponseBody(input))
  return await aesDecrypt(input)
}

export function debugFormat(text: string): CryptoFormatResult {
  const raw = String(text ?? '')
  const t = raw.trim()
  if (!t) return { kind: 'text', output: '' }

  if (t.startsWith('{') || t.startsWith('[')) {
    try {
      const obj = JSON.parse(t) as unknown
      return { kind: 'json', output: JSON.stringify(obj, null, 2) }
    } catch {
      return { kind: 'text', output: raw }
    }
  }

  return { kind: 'text', output: raw }
}

export const __test__ = {
  CMCC_BUSINESS_CRYPTO,
  debugFormat,
  normalizeJsonText,
  unwrapResponseBody,
}

export { CMCC_BUSINESS_CRYPTO }

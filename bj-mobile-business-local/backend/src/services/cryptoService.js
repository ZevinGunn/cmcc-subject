import crypto from 'node:crypto'
import CryptoJS from 'crypto-js'
import NodeRSA from 'node-rsa'

export const SHOP_BUSINESS_KEY = '043AOQGK6ykklyZA'

const LOGIN_PUBLIC_KEY =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsgDq4OqxuEisnk2F0EJFmw4xKa5IrcqEYHvqxPs2CHEg2kolhfWA2SjNuGAHxyDDE5MLtOvzuXjBx/5YJtc9zj2xR/0moesS+Vi/xtG1tkVaTCba+TV+Y5C61iyr3FGqr+KOD4/XECu0Xky1W9ZmmaFADmZi7+6gO9wjgVpU9aLcBcw/loHOeJrCqjp7pA98hRJRY+MML8MK15mnC4ebooOva+mJlstW6t/1lghR8WNV8cocxgcHHuXBxgns2MlACQbSdJ8c6Z3RQeRZBzyjfey6JCCfbEKouVrWIUuPphBL3OANfgp0B+QG31bapvePTfXU48TYK0M5kE+8LgbbWQIDAQAB'

const PORTAL_BOOTSTRAP_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2N7RVdbGQZqR/f74gz3m7SIRwJB3VsqWUT2VoGfCabPTAO7/D5YyYvxWr6OisJCoy3EM0xksFaTfMWyre0X/BURj7eC6DNJNRKmNyw2rx3O1N3HMcKYE3tPtEtZhpZLveigUPHmKpaRVvL51wAGmMGwP85Sh+h+NWl95+GgcslhoZ4wYIG+JVJ0DbGKtprXeRWmEQ+aLd8lT06zQ+R+6KstkTdn8MSotx3/zt827i5gUYUaZ4pUd9I8q/r6miLR1baNfEVA7F1nNAXoc+a/RpkFscT/+myCqDtk9dbc96Xgxm+MDP9kClOuECCDt62NA7+9HHzWL0+NWIuCkZFHXCwIDAQAB
-----END PUBLIC KEY-----`

function publicKeyPemFromBase64(key) {
  return `-----BEGIN PUBLIC KEY-----\n${key.match(/.{1,64}/g).join('\n')}\n-----END PUBLIC KEY-----`
}

export function rsaEncryptLogin(text) {
  return crypto.publicEncrypt(
    {
      key: publicKeyPemFromBase64(LOGIN_PUBLIC_KEY),
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(String(text), 'utf8'),
  ).toString('base64')
}

export function aesEcbEncrypt(text, key) {
  const encrypted = CryptoJS.AES.encrypt(String(text), CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}

export function aesEcbDecrypt(cipherText, key) {
  const decrypted = CryptoJS.AES.decrypt(String(cipherText), CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

export function shopWireEncrypt(value, key = SHOP_BUSINESS_KEY) {
  const keyBytes = Buffer.from(String(key), 'utf8')
  if (keyBytes.length !== 16) throw new Error('商城 AES key 必须是 16 字节')
  const cipher = crypto.createCipheriv('aes-128-cbc', keyBytes, keyBytes)
  const encrypted = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]).toString('base64')
  return Buffer.from(encrypted, 'utf8').toString('base64')
}

export function shopWireDecrypt(value, key = SHOP_BUSINESS_KEY) {
  const keyBytes = Buffer.from(String(key), 'utf8')
  if (keyBytes.length !== 16) throw new Error('商城 AES key 必须是 16 字节')
  const outer = Buffer.from(String(value).replace(/\s+/g, ''), 'base64').toString('utf8').replace(/\s+/g, '')
  const decipher = crypto.createDecipheriv('aes-128-cbc', keyBytes, keyBytes)
  return Buffer.concat([decipher.update(outer, 'base64'), decipher.final()]).toString('utf8')
}

export function extractShopWireValue(input) {
  const raw = String(input ?? '').trim()
  if (!raw) return ''
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    parsed = null
  }
  const nested =
    parsed?.inParam ||
    parsed?.msgId ||
    parsed?.data?.outParam ||
    parsed?.outParam ||
    parsed?.request?.postData?.text ||
    ''
  if (nested) {
    if (typeof nested === 'string' && nested.trim().startsWith('{')) return extractShopWireValue(nested)
    return String(nested)
  }
  try {
    const url = new URL(raw)
    const segment = url.pathname.split('/').filter(Boolean).at(-1)
    if (segment) return decodeURIComponent(segment)
  } catch {
    // Input is a raw transport value rather than a URL.
  }
  return raw
}

export function decryptShopWireInput(input, key = SHOP_BUSINESS_KEY) {
  const decrypted = shopWireDecrypt(extractShopWireValue(input), key)
  try {
    return JSON.parse(decrypted)
  } catch {
    return decrypted
  }
}

export function randomPortalKey() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let out = ''
  for (let i = 0; i < 16; i += 1) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

export function encryptPortalBody(value, key) {
  return encodeURIComponent(aesEcbEncrypt(JSON.stringify(value), key))
}

export function decryptPortalBody(value, key) {
  const raw = typeof value === 'string' ? value : JSON.stringify(value)
  const decoded = decodeURIComponent(raw.replace(/^"|"$/g, ''))
  return JSON.parse(aesEcbDecrypt(decoded, key))
}

export function encryptReplayVersion(version, key) {
  return aesEcbEncrypt(String(version), key)
}

export function decodePortalKeyPayload(data) {
  if (!data) return null
  try {
    const key = new NodeRSA(PORTAL_BOOTSTRAP_PUBLIC_KEY)
    key.setOptions({ encryptionScheme: 'pkcs1' })
    const text = key.decryptPublic(String(data), 'utf8')
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  } catch {
    try {
      return JSON.parse(String(data))
    } catch {
      return null
    }
  }
}

export function encryptPortalKeyWithServerKey(portalKey, serverPublicKey) {
  const keyText = String(serverPublicKey || '').includes('BEGIN PUBLIC KEY')
    ? String(serverPublicKey)
    : publicKeyPemFromBase64(String(serverPublicKey || '').replace(/\\s+/g, ''))
  const key = new NodeRSA(keyText)
  key.setOptions({ encryptionScheme: 'pkcs1' })
  return key.encrypt(String(portalKey), 'base64')
}

function decodeBytes(value, encoding, label) {
  const input = String(value ?? '')
  if (encoding === 'utf8') return Buffer.from(input, 'utf8')
  if (encoding === 'hex') {
    if (!/^(?:[0-9a-fA-F]{2})*$/.test(input)) throw new Error(`${label} 不是有效的 Hex`)
    return Buffer.from(input, 'hex')
  }
  if (encoding === 'base64') {
    const normalized = input.replace(/\s+/g, '')
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized) || normalized.length % 4 !== 0) {
      throw new Error(`${label} 不是有效的 Base64`)
    }
    return Buffer.from(normalized, 'base64')
  }
  throw new Error(`${label} 编码不受支持`)
}

function encodeBytes(value, encoding) {
  if (encoding === 'utf8') return value.toString('utf8')
  if (encoding === 'hex') return value.toString('hex')
  if (encoding === 'base64') return value.toString('base64')
  throw new Error('输出编码不受支持')
}

export function symmetricTransform(options = {}) {
  const operation = String(options.operation || '').toLowerCase()
  const algorithm = String(options.algorithm || 'aes').toLowerCase()
  const mode = String(options.mode || 'ecb').toLowerCase()
  const padding = String(options.padding || 'pkcs7').toLowerCase()
  const keyEncoding = String(options.keyEncoding || 'utf8').toLowerCase()
  const ivEncoding = String(options.ivEncoding || 'utf8').toLowerCase()
  const inputEncoding = String(options.inputEncoding || (operation === 'decrypt' ? 'base64' : 'utf8')).toLowerCase()
  const outputEncoding = String(options.outputEncoding || (operation === 'decrypt' ? 'utf8' : 'base64')).toLowerCase()
  if (!['encrypt', 'decrypt'].includes(operation)) throw new Error('operation 必须是 encrypt 或 decrypt')
  if (algorithm !== 'aes') throw new Error('当前仅支持 AES')
  if (!['ecb', 'cbc'].includes(mode)) throw new Error('AES mode 仅支持 ECB 或 CBC')
  if (padding !== 'pkcs7') throw new Error('当前仅支持 PKCS7 padding')

  const key = decodeBytes(options.key, keyEncoding, 'key')
  if (![16, 24, 32].includes(key.length)) throw new Error('AES key 必须是 16、24 或 32 字节')
  let iv = null
  if (mode === 'cbc') {
    iv = decodeBytes(options.iv, ivEncoding, 'iv')
    if (iv.length !== 16) throw new Error('AES-CBC iv 必须是 16 字节')
  }
  let input = String(options.input ?? '')
  if (options.uriComponent === true && operation === 'decrypt') input = decodeURIComponent(input)
  const inputBytes = decodeBytes(input, inputEncoding, 'input')
  if (inputBytes.length > 1024 * 1024) throw new Error('输入不能超过 1MB')
  const cipherName = `aes-${key.length * 8}-${mode}`
  const transform = operation === 'encrypt' ? crypto.createCipheriv(cipherName, key, iv) : crypto.createDecipheriv(cipherName, key, iv)
  transform.setAutoPadding(true)
  const outputBytes = Buffer.concat([transform.update(inputBytes), transform.final()])
  let output = encodeBytes(outputBytes, outputEncoding)
  if (options.uriComponent === true && operation === 'encrypt') output = encodeURIComponent(output)
  return {
    output,
    details: {
      operation,
      algorithm,
      mode,
      padding,
      keyBytes: key.length,
      inputEncoding,
      outputEncoding,
      uriComponent: options.uriComponent === true,
    },
  }
}

import crypto from 'node:crypto'

const REQUEST_KEY = Buffer.from('foorettD7vcBawt3', 'utf8')
const RESPONSE_KEY = Buffer.from('UVic06tpXgMNiApm', 'utf8')
const IV = Buffer.from('9791027341711819', 'utf8')
const COOKIE_KEY = Buffer.from('V56cmsKxu0dBJLJ7', 'utf8')
const COOKIE_IV = Buffer.from('2585610587278530', 'utf8')

export const CMCC_BUSINESS_CRYPTO = {
  algorithm: 'AES-128-CBC',
  encoding: 'Base64',
  padding: 'PKCS#7',
  request: {
    key: 'foorettD7vcBawt3',
    iv: '9791027341711819',
  },
  response: {
    key: 'UVic06tpXgMNiApm',
    iv: '9791027341711819',
  },
  cookie: {
    key: 'V56cmsKxu0dBJLJ7',
    iv: '2585610587278530',
  },
} as const

function encryptAesCbc(text: string, key: Buffer): string {
  const cipher = crypto.createCipheriv('aes-128-cbc', key, IV)
  return cipher.update(text, 'utf8', 'base64') + cipher.final('base64')
}

function decryptAesCbc(text: string, key: Buffer): string {
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, IV)
  return decipher.update(text, 'base64', 'utf8') + decipher.final('utf8')
}

export function encryptBusinessRequest(value: unknown): string {
  return encryptAesCbc(JSON.stringify(value), REQUEST_KEY)
}

export function encryptBusinessText(text: string): string {
  return encryptAesCbc(text, REQUEST_KEY)
}

export function decryptBusinessRequestBody(body: string): string {
  return decryptAesCbc(body, REQUEST_KEY)
}

export function decryptBusinessResponseBody(body: string): string {
  return decryptAesCbc(body, RESPONSE_KEY)
}

export function encryptBusinessResponseBody(text: string): string {
  return encryptAesCbc(text, RESPONSE_KEY)
}

export function encryptBusinessCookieValue(text: string): string {
  const cipher = crypto.createCipheriv('aes-128-cbc', COOKIE_KEY, COOKIE_IV)
  return cipher.update(text, 'utf8', 'base64') + cipher.final('base64')
}

export function decryptBusinessCookieValue(text: string): string {
  const decipher = crypto.createDecipheriv('aes-128-cbc', COOKIE_KEY, COOKIE_IV)
  return decipher.update(text, 'base64', 'utf8') + decipher.final('utf8')
}

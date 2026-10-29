import crypto from 'node:crypto'

const COC_PUBLIC_KEY_BODY =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0a66eNBd/ioaGnEM2AV+ctQX8VYt6dszzI8zOv26Kc1A7ex/cu/txmbB6WrU5ARoTeS0gk3KS21e/xP1BR1FUqL/+YJ4v8gpFY21/2gWuEPVBoHEd34FMpDRuiQkpmrvuuRF+QJQIg5ASEBpwz4n15ltl7Fd4E+NLp/JRJxzNR55ZeVLLFaucWYe8FIvX5BKx8i+sJWZYDoxTbjrBTy2CZDZObT+PxhOBXsCkolsG8Ux+tIAoU+UAVSQ0qT62z/sHPVPngHAqmLP/sF3IM6Mrub7BqhwJe3rvddqrw+Q2Jg8upZ/oUlZvXtQZCxJXtg0eJVdKTmnE6hD+/M99ukEoQIDAQAB'
const COC_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----\n${COC_PUBLIC_KEY_BODY.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`

const AUTH_KEY = Buffer.from('1234123412ABCDEF', 'utf8')
const AUTH_IV = Buffer.from('ABCDEF1234123412', 'utf8')
const RETAIL_KEY = Buffer.from('03054BD8937F62FA8FE72F00012B9658', 'utf8')
const RETAIL_IV = Buffer.from('82787D91132E6AE5', 'utf8')

export type CocAuroraContext = {
  key: string
  encryptedKey: string
}

export function createCocAuroraContext(): CocAuroraContext {
  const key = crypto.randomBytes(8).toString('hex')
  const encryptedKey = crypto.publicEncrypt(
    { key: COC_PUBLIC_KEY, padding: crypto.constants.RSA_PKCS1_PADDING },
    Buffer.from(key, 'utf8'),
  ).toString('base64')
  return { key, encryptedKey }
}

export function cocAuroraEncrypt(value: unknown, key: string): string {
  if (!/^[a-f0-9]{16}$/i.test(key)) throw new Error('COC Aurora key 格式错误')
  const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(key, 'utf8'), null)
  return Buffer.concat([
    cipher.update(JSON.stringify(value), 'utf8'),
    cipher.final(),
  ]).toString('base64')
}

export function cocAuroraDecrypt(cipherText: string, key: string): string {
  const decipher = crypto.createDecipheriv('aes-128-ecb', Buffer.from(key, 'utf8'), null)
  return Buffer.concat([
    decipher.update(cipherText, 'base64'),
    decipher.final(),
  ]).toString('utf8')
}

export function createCocMeteorContext(): CocAuroraContext {
  const key = crypto.randomBytes(8).toString('hex')
  const encryptedKey = crypto.publicEncrypt(
    { key: COC_PUBLIC_KEY, padding: crypto.constants.RSA_PKCS1_PADDING },
    Buffer.from(Buffer.from(key, 'utf8').toString('base64'), 'utf8'),
  ).toString('base64')
  return { key, encryptedKey }
}

export function cocMeteorEncrypt(value: unknown, key: string): string {
  return Buffer.from(cocAuroraEncrypt(value, key), 'utf8').toString('base64')
}

export function premiumAuthEncrypt(value: unknown): string {
  const cipher = crypto.createCipheriv('aes-128-cbc', AUTH_KEY, AUTH_IV)
  return Buffer.concat([
    cipher.update(JSON.stringify(value), 'utf8'),
    cipher.final(),
  ]).toString('hex').toUpperCase()
}

export function premiumAuthDecrypt(cipherHex: string): string {
  const decipher = crypto.createDecipheriv('aes-128-cbc', AUTH_KEY, AUTH_IV)
  return Buffer.concat([
    decipher.update(cipherHex, 'hex'),
    decipher.final(),
  ]).toString('utf8')
}

function normalizeBase64(value: string): string {
  const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/')
  return normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
}

export function premiumWireEncrypt(value: unknown): string {
  const cipher = crypto.createCipheriv('aes-256-cbc', RETAIL_KEY, RETAIL_IV)
  return Buffer.concat([
    cipher.update(JSON.stringify(value), 'utf8'),
    cipher.final(),
  ]).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
}

export function premiumWireDecrypt(cipherText: string): string {
  const decipher = crypto.createDecipheriv('aes-256-cbc', RETAIL_KEY, RETAIL_IV)
  return Buffer.concat([
    decipher.update(normalizeBase64(cipherText), 'base64'),
    decipher.final(),
  ]).toString('utf8')
}


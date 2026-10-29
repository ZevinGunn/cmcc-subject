import crypto from 'node:crypto'

const AUTH_KEY = Buffer.from('1234123412ABCDEF', 'utf8')
const AUTH_IV = Buffer.from('ABCDEF1234123412', 'utf8')
const WIRE_KEY = Buffer.from('03054BD8937F62FA8FE72F00012B9658', 'utf8')
const WIRE_IV = Buffer.from('82787D91132E6AE5', 'utf8')

export function retailAuthEncrypt(value) {
  const cipher = crypto.createCipheriv('aes-128-cbc', AUTH_KEY, AUTH_IV)
  return Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]).toString('hex').toUpperCase()
}

export function retailAuthDecrypt(value) {
  const decipher = crypto.createDecipheriv('aes-128-cbc', AUTH_KEY, AUTH_IV)
  return Buffer.concat([decipher.update(String(value || ''), 'hex'), decipher.final()]).toString('utf8')
}

export function retailWireEncrypt(value) {
  const cipher = crypto.createCipheriv('aes-256-cbc', WIRE_KEY, WIRE_IV)
  return Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
}

export function retailWireDecrypt(value) {
  const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  const decipher = crypto.createDecipheriv('aes-256-cbc', WIRE_KEY, WIRE_IV)
  return Buffer.concat([decipher.update(padded, 'base64'), decipher.final()]).toString('utf8')
}

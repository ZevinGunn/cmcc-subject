import crypto from 'node:crypto'
import CryptoJS from 'crypto-js'
import NodeRSA from 'node-rsa'

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

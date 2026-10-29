import crypto from 'node:crypto'

export const SHOP_BUSINESS_KEY = '043AOQGK6ykklyZA'
const SHOP_LOGIN_SIGN_SALT = 'B3A128FA'

function keyBytes(key: string): Buffer {
  const bytes = Buffer.from(key, 'utf8')
  if (bytes.length !== 16) throw new Error('商城 AES key 必须是 16 字节')
  return bytes
}

export function shopAesEncrypt(value: string, key = SHOP_BUSINESS_KEY): string {
  const bytes = keyBytes(key)
  const cipher = crypto.createCipheriv('aes-128-cbc', bytes, bytes)
  return Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]).toString('base64')
}

export function shopAesDecrypt(value: string, key = SHOP_BUSINESS_KEY): string {
  const bytes = keyBytes(key)
  const decipher = crypto.createDecipheriv('aes-128-cbc', bytes, bytes)
  return Buffer.concat([
    decipher.update(String(value).replace(/\s+/g, ''), 'base64'),
    decipher.final(),
  ]).toString('utf8')
}

export function shopWireEncrypt(value: string, key = SHOP_BUSINESS_KEY): string {
  return Buffer.from(shopAesEncrypt(value, key), 'utf8').toString('base64')
}

export function shopWireDecrypt(value: string, key = SHOP_BUSINESS_KEY): string {
  const inner = Buffer.from(String(value).replace(/\s+/g, ''), 'base64')
    .toString('utf8')
    .replace(/\s+/g, '')
  return shopAesDecrypt(inner, key)
}

export function buildShopLoginSign(token: string): string {
  return crypto
    .createHmac('md5', '')
    .update(`${SHOP_LOGIN_SIGN_SALT}${token}${SHOP_LOGIN_SIGN_SALT}`, 'utf8')
    .digest('hex')
}

export function buildShopLoginRequest(args: { token: string; backUrl: string }): {
  data: string
  channel: '12'
} {
  const plain = JSON.stringify({
    token: args.token,
    backUrl: args.backUrl,
    sysId: '001',
    sign: buildShopLoginSign(args.token),
  })
  return { data: shopAesEncrypt(plain), channel: '12' }
}

export const __test__ = {
  buildShopLoginSign,
  buildShopLoginRequest,
}

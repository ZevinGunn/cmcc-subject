import crypto from 'node:crypto';

const USER_DOMAIN_AES_KEY = 'UqEZkrjCKfa02pP6jntzFmkzOz86zHUC';
// 云盘 2026-10 captcha.js 使用的短信密钥；旧 Web V2 密钥仍独立保留。
export const SMS_AES_KEY = 'h7DLzCTAjn+altjy2a9E9FSt7AC6pmx1';
const UPLOAD_BROWSE_AES_KEY = 'bgo3OUIS7eQgVewk';

export function randomString(length = 16) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += alphabet[crypto.randomInt(alphabet.length)];
  }
  return out;
}

export function md5(value) {
  return crypto.createHash('md5').update(String(value)).digest('hex');
}

export function base64Encode(value) {
  return Buffer.from(String(value), 'utf8').toString('base64');
}

export function base64Decode(value) {
  return Buffer.from(String(value), 'base64').toString('utf8');
}

export function aesEcbEncrypt(plainText, key) {
  const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(key, 'utf8'), null);
  cipher.setAutoPadding(true);
  return Buffer.concat([cipher.update(String(plainText), 'utf8'), cipher.final()]).toString('base64');
}

export function aesEcbDecrypt(cipherText, key) {
  const decipher = crypto.createDecipheriv('aes-128-ecb', Buffer.from(key, 'utf8'), null);
  decipher.setAutoPadding(true);
  return Buffer.concat([
    decipher.update(Buffer.from(String(cipherText), 'base64')),
    decipher.final()
  ]).toString('utf8');
}

export function aesCbcEncryptWithIvPrefix(value, key = USER_DOMAIN_AES_KEY) {
  const iv = crypto.randomBytes(16);
  const plainText = typeof value === 'string' ? value : JSON.stringify(value);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'utf8'), iv);
  cipher.setAutoPadding(true);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, encrypted]).toString('base64');
}

export function aesCbcDecryptWithIvPrefix(cipherText, key = USER_DOMAIN_AES_KEY) {
  const raw = Buffer.from(String(cipherText), 'base64');
  const iv = raw.subarray(0, 16);
  const encrypted = raw.subarray(16);
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'utf8'), iv);
  decipher.setAutoPadding(true);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}

export function encryptUploadBrowseData(value, key = UPLOAD_BROWSE_AES_KEY) {
  const iv = randomString(16);
  const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key, 'utf8'), Buffer.from(iv, 'utf8'));
  cipher.setAutoPadding(true);
  return Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]).toString('base64');
}

export function rsaEncryptWithPublicKey(value, publicKey) {
  const pem = publicKey.includes('BEGIN PUBLIC KEY')
    ? publicKey
    : `-----BEGIN PUBLIC KEY-----\n${publicKey.match(/.{1,64}/g).join('\n')}\n-----END PUBLIC KEY-----`;

  return crypto.publicEncrypt(
    {
      key: pem,
      padding: crypto.constants.RSA_PKCS1_PADDING
    },
    Buffer.from(String(value), 'utf8')
  ).toString('base64');
}

export function formatMcloudTimestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds())
  ].join('');
}

export function getNewSign(params, data, timestamp, nonce) {
  let normalized = '';
  if (data !== undefined && data !== null) {
    normalized = encodeURIComponent(JSON.stringify(data)).split('').sort().join('');
  }
  const c = md5(base64Encode(normalized));
  const u = md5(`${timestamp}:${nonce}`);
  return md5(c + u).toUpperCase();
}

export function makeAuthorization(account, authToken, prefix = 'pc') {
  if (!account || !authToken) return '';
  return `Basic ${base64Encode(`${prefix}:${account}:${authToken}`)}`;
}

export function maskSecret(value, keepStart = 8, keepEnd = 6) {
  if (!value) return '';
  const text = String(value);
  if (text.length <= keepStart + keepEnd + 3) return `${text.slice(0, 3)}***`;
  return `${text.slice(0, keepStart)}...${text.slice(-keepEnd)}`;
}

export function safeJsonParse(value) {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

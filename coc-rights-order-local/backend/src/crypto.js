import CryptoJS from 'crypto-js';
import crypto from 'node:crypto';

const DEFAULT_AES_KEY = '1de23e756aaf3cc2';
const SMS_SKU_KEY = '72fc912ce498430d';
const ORDER_FIELD_KEY = 'a4jdiq597p3gls0r';
const PROOF_SALTS = {
  1: 'AizkkwOAWRVihbCs',
  2: '74yrUGGCWjvggMjtgSzQN0qVOJtwJUFt'
};

export function aesZeroEncrypt(plain, key = DEFAULT_AES_KEY, iv = key) {
  const text = String(plain ?? '');
  const keyWords = CryptoJS.enc.Latin1.parse(String(key));
  const ivWords = CryptoJS.enc.Latin1.parse(String(iv));
  return CryptoJS.AES.encrypt(text, keyWords, {
    iv: ivWords,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  }).toString();
}

export function aesPkcs7Encrypt(plain, key, iv = '0123456789ABEDEF') {
  const keyWords = CryptoJS.enc.Utf8.parse(String(key));
  const ivWords = CryptoJS.enc.Utf8.parse(iv);
  const encrypted = CryptoJS.AES.encrypt(String(plain ?? ''), keyWords, {
    iv: ivWords,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

export function reverseBase64(value) {
  return Buffer.from(String(value ?? ''), 'utf8')
    .toString('base64')
    .split('')
    .reverse()
    .join('');
}

export function md5Proof(value, reversedBase64, saltType = 1) {
  const salt = PROOF_SALTS[saltType];
  if (!salt) {
    throw new Error(`Unsupported proof salt type: ${saltType}`);
  }
  return CryptoJS.MD5(`${String(value ?? '')}${salt}${String(reversedBase64 ?? '')}`).toString();
}

export function md5Hex(value) {
  return CryptoJS.MD5(String(value ?? '')).toString();
}

export function buildSmsPayload({ phone, skuId, timestamp = Date.now() }) {
  return {
    receivers: aesZeroEncrypt(phone, ORDER_FIELD_KEY),
    skuId: aesZeroEncrypt(`${skuId}_${timestamp}`, SMS_SKU_KEY),
    member: false,
    visitor: true
  };
}

export function buildOrderProof(phone, smsCode) {
  const m1 = reverseBase64(phone);
  const s1 = reverseBase64(smsCode);
  return {
    m1,
    m2: md5Proof(phone, m1, 1),
    s1,
    s2: md5Proof(smsCode, s1, 1)
  };
}

export function encryptOrderPhone(phone) {
  return aesZeroEncrypt(phone, ORDER_FIELD_KEY);
}

export function encryptOrderSmsCode(smsCode) {
  return aesZeroEncrypt(smsCode, ORDER_FIELD_KEY);
}

export function aesEcbPkcs7EncryptJson(value, key) {
  return CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(JSON.stringify(value)),
    CryptoJS.enc.Utf8.parse(String(key)),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  ).toString();
}

export function randomAuroraKey() {
  return crypto.randomBytes(8).toString('hex');
}

export const cryptoKeys = {
  DEFAULT_AES_KEY,
  SMS_SKU_KEY,
  ORDER_FIELD_KEY
};

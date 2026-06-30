import crypto from 'node:crypto';
import { aesEcbPkcs7EncryptJson, randomAuroraKey } from './crypto.js';

const AURORA_VERSION = '2';
const COC_EN_VERSION = '1486234121417629696';
const PUBLIC_KEY_V2 = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0a66eNBd/ioaGnEM2AV+ctQX8VYt6dszzI8zOv26Kc1A7ex/cu/txmbB6WrU5ARoTeS0gk3KS21e/xP1BR1FUqL/+YJ4v8gpFY21/2gWuEPVBoHEd34FMpDRuiQkpmrvuuRF+QJQIg5ASEBpwz4n15ltl7Fd4E+NLp/JRJxzNR55ZeVLLFaucWYe8FIvX5BKx8i+sJWZYDoxTbjrBTy2CZDZObT+PxhOBXsCkolsG8Ux+tIAoU+UAVSQ0qT62z/sHPVPngHAqmLP/sF3IM6Mrub7BqhwJe3rvddqrw+Q2Jg8upZ/oUlZvXtQZCxJXtg0eJVdKTmnE6hD+/M99ukEoQIDAQAB
-----END PUBLIC KEY-----`;

export function rsaEncryptAuroraKey(key) {
  return crypto
    .publicEncrypt(
      {
        key: PUBLIC_KEY_V2,
        padding: crypto.constants.RSA_PKCS1_PADDING
      },
      Buffer.from(String(key), 'utf8')
    )
    .toString('base64');
}

export function buildEncryptedPackageBody(payload) {
  const key = randomAuroraKey();
  return {
    body: {
      cocEnContent: aesEcbPkcs7EncryptJson(payload, key)
    },
    headers: {
      'coc-en-version': COC_EN_VERSION,
      'coc-aurora': rsaEncryptAuroraKey(key),
      'coc-aurora-v': AURORA_VERSION,
      'Content-Type': 'application/json'
    }
  };
}

export const packageCryptoConstants = {
  AURORA_VERSION,
  COC_EN_VERSION
};

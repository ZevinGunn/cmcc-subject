import CryptoJS from "crypto-js";
import { AES_KEY, SM2_PUBLIC_KEY } from "./config.js";
import { legacySm2Encrypt } from "./sm2Legacy.js";

export function encryptPhone(phone) {
  const payload = `${phone}:${Date.now()}`;
  return legacySm2Encrypt(payload, SM2_PUBLIC_KEY);
}

export function encryptWithAes(value) {
  const key = CryptoJS.enc.Utf8.parse(AES_KEY);
  const src = CryptoJS.enc.Utf8.parse(value);
  return CryptoJS.AES.encrypt(src, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
}


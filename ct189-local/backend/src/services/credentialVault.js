import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { config } from "../config.js";

// Separate local key; neither key nor sealed credentials are exposed by account APIs.
export function createCredentialVault(directory) {
  const keyPath = path.join(directory, "credential.key");
  function key(create = false) {
    fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
    if (create && !fs.existsSync(keyPath)) {
      try {
        fs.writeFileSync(keyPath, crypto.randomBytes(32), {
          flag: "wx",
          mode: 0o600,
        });
      } catch (error) {
        if (error.code !== "EEXIST") throw error;
      }
    }
    const value = fs.readFileSync(keyPath);
    if (value.length !== 32) throw new Error("本地凭据密钥不可用");
    fs.chmodSync(keyPath, 0o600);
    return value;
  }
  return {
    seal(accountId, password) {
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv("aes-256-gcm", key(true), iv);
      cipher.setAAD(Buffer.from(accountId));
      const ciphertext = Buffer.concat([
        cipher.update(password, "utf8"),
        cipher.final(),
      ]);
      return {
        version: 1,
        iv: iv.toString("base64"),
        tag: cipher.getAuthTag().toString("base64"),
        ciphertext: ciphertext.toString("base64"),
      };
    },
    open(accountId, sealed) {
      if (sealed?.version !== 1) throw new Error("本地凭据格式不可用");
      const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        key(),
        Buffer.from(sealed.iv, "base64"),
      );
      decipher.setAAD(Buffer.from(accountId));
      decipher.setAuthTag(Buffer.from(sealed.tag, "base64"));
      return Buffer.concat([
        decipher.update(Buffer.from(sealed.ciphertext, "base64")),
        decipher.final(),
      ]).toString("utf8");
    },
  };
}
export const credentialVault = createCredentialVault(config.dataDir);

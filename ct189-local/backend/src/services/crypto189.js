import crypto from "node:crypto";

const SERVICE_PASSWORD_KEY = "askgakjgidign399ew3593er";
const SERVICE_PASSWORD_IV = "2156ghrb";

export function encryptServicePassword(password) {
  const cipher = crypto.createCipheriv(
    "des-ede3-cbc",
    Buffer.from(SERVICE_PASSWORD_KEY, "utf8"),
    Buffer.from(SERVICE_PASSWORD_IV, "utf8")
  );
  cipher.setAutoPadding(true);
  return Buffer.concat([cipher.update(String(password), "utf8"), cipher.final()]).toString("base64");
}

export function decodeTelecomPayload(payload) {
  if (payload == null) return payload;
  if (typeof payload !== "string") return payload;
  const text = payload.trim();
  if (!text) return payload;
  try {
    const decoded = Buffer.from(text, "base64").toString("utf8");
    return JSON.parse(decoded);
  } catch {
    try {
      return JSON.parse(text);
    } catch {
      return payload;
    }
  }
}

export function maskPhone(phone) {
  return String(phone || "").replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
}

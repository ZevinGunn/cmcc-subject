import crypto from "node:crypto";

export function timestamp14(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds())
  ].join("");
}

export function randomString(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length).padEnd(length, "0");
}

export function sortedTruthyPayload(payload, includeTimestamp = true) {
  const source = { ...payload };
  if (includeTimestamp) {
    source.timestamp = timestamp14();
    source.randomstr = randomString();
  }

  const sorted = Object.keys(source)
    .sort()
    .reduce((acc, key) => {
      if (source[key]) acc[key] = source[key];
      return acc;
    }, {});

  const signText = Object.keys(sorted)
    .map((key) => `${key}=${sorted[key]}`)
    .join("&");

  sorted.sign = crypto.createHash("sha256").update(signText).digest("hex");
  return sorted;
}

export function aesCbcEncryptJson(payload, key, iv) {
  const cipher = crypto.createCipheriv("aes-128-cbc", Buffer.from(key, "utf8"), Buffer.from(iv, "utf8"));
  cipher.setAutoPadding(true);
  return Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]).toString("base64");
}

export function tryJson(value) {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function tryBase64Json(value) {
  if (typeof value !== "string") return value;
  const text = value.trim();
  if (!text || text.startsWith("{") || text.startsWith("[")) return value;
  try {
    return JSON.parse(Buffer.from(text, "base64").toString("utf8"));
  } catch {
    return value;
  }
}

export const CMCC_PREFIX =
  "https://h.app.coc.10086.cn/activity/transit/transferDownload.html?targetURL=";
export const CMCC_SUFFIX =
  "https://wx.10086.cn/cmcc-service/app-pages/extra/businessHandlingRecords";

export function buildLink({ prefix = "", suffix = "", encode = false }) {
  return `${prefix}${encode ? encodeURIComponent(suffix) : suffix}`;
}

export async function encryptAes(text, key) {
  if (!key) throw new Error("请输入密钥");
  if (!text) throw new Error("请输入需要加密的文本");
  const { default: CryptoJS } = await import("crypto-js");
  return CryptoJS.AES.encrypt(text, key).toString();
}

export async function decryptAes(ciphertext, key) {
  if (!key) throw new Error("请输入密钥");
  if (!ciphertext) throw new Error("请输入需要解密的文本");
  const { default: CryptoJS } = await import("crypto-js");
  const result = CryptoJS.AES.decrypt(ciphertext.trim(), key).toString(CryptoJS.enc.Utf8);
  if (!result) throw new Error("解密失败，请检查密钥和密文");
  return result;
}

export function qxRegexFromUrl(input) {
  const url = new URL(input.trim());
  const escapeRegex = (value) => value.replace(/[.*+?^\${}()|[\]\\]/g, "\\$&");
  const host = escapeRegex(url.hostname);
  const path = url.pathname
    .split("/")
    .filter(Boolean)
    .map(escapeRegex)
    .join("\\/");
  return `^https?:\\/\\/${host}${path ? `\\/${path}` : ""}(?:\\?.*)?$`;
}

export function formatJson(input, mode = "format") {
  const parsed = JSON.parse(input);
  return mode === "minify" ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
}

export function unescapeAndFormatJson(input) {
  let value = input.trim();
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "string") value = parsed;
    else return JSON.stringify(parsed, null, 2);
  } catch {
    value = value.replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\t/g, "\t");
  }
  return JSON.stringify(JSON.parse(value), null, 2);
}

export function defaultRecordName(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `扫码记录 ${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function downloadText(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob(["\ufeff", content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function safeFilename(value) {
  return value.replace(/[\\/:*?"<>|]/g, "-").trim() || "导出";
}

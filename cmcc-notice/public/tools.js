const toolInputEl = document.getElementById("tool-input");
const toolOutputEl = document.getElementById("tool-output");
const toolReqEncryptEl = document.getElementById("tool-req-encrypt");
const toolReqDecryptEl = document.getElementById("tool-req-decrypt");
const toolRespEncryptEl = document.getElementById("tool-resp-encrypt");
const toolRespDecryptEl = document.getElementById("tool-resp-decrypt");
const toolFormatEl = document.getElementById("tool-format");

let RESP_KEY = "UVic06tpXgMNiApm";
let RESP_IV = "9791027341711819";
let REQ_KEY = "foorettD7vcBawt3";
let REQ_IV = "9791027341711819";

const GRAY_KEYS = {
  reqKey: "BHtQRepXEBWle7CJ",
  respKey: "t6MoEZ94s0bDOaws",
  iv: "1234567890123456",
};

function normalizeBase64(value) {
  const trimmed = String(value || "").trim();
  const noSpace = trimmed.replace(/\s+/g, "");
  if (!noSpace) return "";
  if (/^[A-Za-z0-9+/=]+$/.test(noSpace)) {
    return noSpace;
  }
  const urlSafe = noSpace.replace(/-/g, "+").replace(/_/g, "/");
  if (!/^[A-Za-z0-9+/=]+$/.test(urlSafe)) {
    return noSpace;
  }
  const padding = urlSafe.length % 4;
  if (padding === 2) return `${urlSafe}==`;
  if (padding === 3) return `${urlSafe}=`;
  if (padding === 1) return `${urlSafe}===`;
  return urlSafe;
}

function isBase64Like(value) {
  const normalized = normalizeBase64(value);
  return Boolean(normalized && /^[A-Za-z0-9+/=]+$/.test(normalized));
}

function base64ToBytes(base64) {
  const normalized = normalizeBase64(base64);
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function bytesToBase64(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function pkcs7Pad(bytes) {
  const pad = 16 - (bytes.length % 16 || 16);
  const padded = new Uint8Array(bytes.length + pad);
  padded.set(bytes);
  padded.fill(pad, bytes.length);
  return padded;
}

function pkcs7Unpad(bytes) {
  if (!bytes.length) return bytes;
  const pad = bytes[bytes.length - 1];
  if (pad < 1 || pad > 16) return bytes;
  return bytes.slice(0, bytes.length - pad);
}

async function decryptAES(base64Cipher, key, iv) {
  const cipherBytes = base64ToBytes(base64Cipher);
  const keyBytes = new TextEncoder().encode(key);
  const ivBytes = new TextEncoder().encode(iv);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: ivBytes },
    cryptoKey,
    cipherBytes
  );
  const plainBytes = pkcs7Unpad(new Uint8Array(decrypted));
  return new TextDecoder().decode(plainBytes);
}

async function encryptAES(plaintext, key, iv) {
  const keyBytes = new TextEncoder().encode(key);
  const ivBytes = new TextEncoder().encode(iv);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-CBC" },
    false,
    ["encrypt"]
  );
  const inputBytes = new TextEncoder().encode(plaintext);
  const padded = pkcs7Pad(inputBytes);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv: ivBytes },
    cryptoKey,
    padded
  );
  return bytesToBase64(new Uint8Array(encrypted));
}

function formatJson(text) {
  const parsed = JSON.parse(text);
  return JSON.stringify(parsed, null, 2);
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "请求失败");
  }
  return res.json();
}

async function updateEnv() {
  try {
    const data = await fetchJson("/api/health");
    if (data.env && data.env.toLowerCase() === "gray") {
      RESP_KEY = GRAY_KEYS.respKey;
      RESP_IV = GRAY_KEYS.iv;
      REQ_KEY = GRAY_KEYS.reqKey;
      REQ_IV = GRAY_KEYS.iv;
    }
  } catch (err) {
    // ignore
  }
}

toolReqEncryptEl.addEventListener("click", async () => {
  try {
    const input = toolInputEl.value.trim();
    const output = await encryptAES(input, REQ_KEY, REQ_IV);
    toolOutputEl.value = output;
  } catch (err) {
    toolOutputEl.value = `加密失败：${err.message}`;
  }
});

toolReqDecryptEl.addEventListener("click", async () => {
  try {
    const input = toolInputEl.value.trim();
    if (!isBase64Like(input)) throw new Error("请输入有效 base64 密文");
    const output = await decryptAES(input, REQ_KEY, REQ_IV);
    try {
      toolOutputEl.value = formatJson(output);
    } catch (err) {
      toolOutputEl.value = output;
    }
  } catch (err) {
    toolOutputEl.value = `解密失败：${err.message}`;
  }
});

toolRespEncryptEl.addEventListener("click", async () => {
  try {
    const input = toolInputEl.value.trim();
    const output = await encryptAES(input, RESP_KEY, RESP_IV);
    toolOutputEl.value = output;
  } catch (err) {
    toolOutputEl.value = `加密失败：${err.message}`;
  }
});

toolRespDecryptEl.addEventListener("click", async () => {
  try {
    const input = toolInputEl.value.trim();
    if (!isBase64Like(input)) throw new Error("请输入有效 base64 密文");
    const output = await decryptAES(input, RESP_KEY, RESP_IV);
    try {
      toolOutputEl.value = formatJson(output);
    } catch (err) {
      toolOutputEl.value = output;
    }
  } catch (err) {
    toolOutputEl.value = `解密失败：${err.message}`;
  }
});

toolFormatEl.addEventListener("click", () => {
  try {
    const input = toolInputEl.value.trim() || toolOutputEl.value.trim();
    if (!input) return;
    toolOutputEl.value = formatJson(input);
  } catch (err) {
    toolOutputEl.value = `格式化失败：${err.message}`;
  }
});

updateEnv();

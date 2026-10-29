import { AsyncLocalStorage } from 'node:async_hooks';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR = path.resolve(process.env.YUNPAN_LOG_DIR || path.join(__dirname, '..', 'logs'));
const logContext = new AsyncLocalStorage();
const sensitiveKeyPattern = /^(account|completeaccount|encryptedaccount|phone|phonenumber|mobile|authorization|cookie|set-cookie|.*(?:auth|access|sso|net)?token.*|.*skey.*|.*secret.*|.*password.*|.*pwd.*|smscode|dycpwd|puzzle.*|encryptmsg|encryptedbody|aeskey|rsapublickey)$/i;
const sensitiveQueryPattern = /^(account|phone|phonenumber|mobile|authorization|cookie|.*token.*|code|smscode|dycpwd|puzzle.*)$/i;
let writeQueue = Promise.resolve();

export function withLogContext(context, callback) {
  return logContext.run(context, callback);
}

export function sanitizeUrl(rawUrl) {
  if (!rawUrl) return '';
  try {
    const url = new URL(String(rawUrl));
    for (const [key, value] of url.searchParams.entries()) {
      if (sensitiveQueryPattern.test(key)) {
        url.searchParams.set(key, '[REDACTED]');
      } else if (/^https?:\/\//i.test(value)) {
        url.searchParams.set(key, sanitizeUrl(value));
      }
    }
    if (url.hash && /token|account|phone/i.test(url.hash)) url.hash = '#[REDACTED]';
    return url.toString();
  } catch {
    return String(rawUrl).slice(0, 500);
  }
}

export function sanitizeLogData(value, key = '', depth = 0) {
  if (sensitiveKeyPattern.test(key)) return value ? '[REDACTED]' : value;
  if (value === null || value === undefined || typeof value === 'boolean' || typeof value === 'number') return value;
  if (typeof value === 'string') {
    const normalized = /url|location|referer/i.test(key) ? sanitizeUrl(value) : value;
    const redacted = normalized
      .replace(/\b1[3-9]\d{9}\b/g, '[REDACTED_PHONE]')
      .replace(/((?:authorization|cookie|token)\s*[=:]\s*)[^\s,;]+/gi, '$1[REDACTED]');
    return redacted.length > 500 ? `${redacted.slice(0, 500)}...[truncated]` : redacted;
  }
  if (depth >= 5) return '[MAX_DEPTH]';
  if (Array.isArray(value)) {
    const items = value.slice(0, 20).map((item) => sanitizeLogData(item, key, depth + 1));
    if (value.length > items.length) items.push(`[${value.length - items.length} more items]`);
    return items;
  }
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [childKey, sanitizeLogData(childValue, childKey, depth + 1)])
    );
  }
  return String(value);
}

export function summarizeResponse(payload) {
  if (!payload || typeof payload !== 'object') {
    return { type: payload === null ? 'null' : typeof payload };
  }
  const data = payload.data && typeof payload.data === 'object' ? payload.data : null;
  return sanitizeLogData({
    success: payload.success,
    code: payload.code,
    resultCode: payload.resultCode,
    status: payload.status,
    message: payload.message || payload.msg,
    dataCode: data?.code,
    dataResultCode: data?.resultCode,
    dataMessage: data?.message || data?.msg,
    businessStatus: payload.header?.status,
    businessMessage: payload.header?.errMsg,
    keys: Object.keys(payload).slice(0, 30),
    dataKeys: data ? Object.keys(data).slice(0, 30) : []
  });
}

export function logEvent(level, event, details = {}) {
  const now = new Date();
  const context = logContext.getStore() || {};
  const entry = sanitizeLogData({
    timestamp: now.toISOString(),
    level,
    event,
    ...context,
    ...details
  });
  const fileName = `yunpan-${now.toISOString().slice(0, 10)}.jsonl`;
  const filePath = path.join(LOG_DIR, fileName);

  writeQueue = writeQueue
    .then(async () => {
      await fs.mkdir(LOG_DIR, { recursive: true });
      await fs.appendFile(filePath, `${JSON.stringify(entry)}\n`, 'utf8');
    })
    .catch((error) => {
      console.error(`[diagnostic-log] ${error.message}`);
    });
  return writeQueue;
}

export function getLogLocation() {
  return LOG_DIR;
}

export const __test__ = {
  sensitiveKeyPattern,
  sensitiveQueryPattern
};

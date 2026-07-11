import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_FLOW_SHOP_SOURCE_ID,
  DEFAULT_FLOW_SHOP_URL,
  buildSsoUrl,
  getRsaPublicKey,
  loginWithSms,
  querySpecToken,
  sendSmsCode
} from './yunpanClient.js';
import { clearSession, loadSession, patchSession, sessionSummary } from './sessionStore.js';
import { maskSecret } from './cryptoBox.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
const PORT = Number(process.env.PORT || 7399);
const HOST = process.env.HOST || '127.0.0.1';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith('/api/')) {
      await handleApi(req, res);
      return;
    }
    await serveStatic(req, res);
  } catch (error) {
    sendJson(res, 500, {
      success: false,
      message: error.message || '服务异常',
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Yunpan login local running at http://${HOST}:${PORT}`);
});

async function handleApi(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, { success: true, now: new Date().toISOString() });
    return;
  }
  if (req.method === 'GET' && pathname === '/api/session') {
    const session = await loadSession();
    sendJson(res, 200, {
      success: true,
      session: sessionSummary(session),
      secrets: {
        authToken: maskSecret(session.authToken),
        token: maskSecret(session.token),
        authorization: maskSecret(session.authorization),
        ssoToken: maskSecret(session.lastSsoToken),
        wxCookie: maskCookie(session.lastWxCookie),
        wxCookieValue: session.lastWxCookie,
        wxAuthToken: maskSecret(session.lastWxAuthToken)
      }
    });
    return;
  }
  if (req.method === 'POST' && pathname === '/api/session/clear') {
    const session = await clearSession();
    sendJson(res, 200, { success: true, session: sessionSummary(session) });
    return;
  }
  if (req.method === 'POST' && pathname === '/api/auth/public-key') {
    sendJson(res, 200, await getRsaPublicKey());
    return;
  }
  if (req.method === 'POST' && pathname === '/api/auth/send-sms') {
    const body = await readJson(req);
    sendJson(res, 200, await sendSmsCode(body));
    return;
  }
  if (req.method === 'POST' && pathname === '/api/auth/login') {
    const body = await readJson(req);
    const loginResult = await loginWithSms(body);
    if (loginResult.success) {
      try {
        const jumpResult = await buildDefaultJumpUrl({ mode: body.ssoMode || 'v1' });
        sendJson(res, 200, { ...loginResult, defaultJump: jumpResult });
      } catch (error) {
        sendJson(res, 200, { ...loginResult, defaultJump: { success: false, message: error.message } });
      }
      return;
    }
    sendJson(res, 200, loginResult);
    return;
  }
  if (req.method === 'POST' && pathname === '/api/auth/sso-token') {
    const body = await readJson(req);
    sendJson(res, 200, await querySpecToken(body));
    return;
  }
  if (req.method === 'POST' && pathname === '/api/tools/build-url') {
    const body = await readJson(req);
    const session = await loadSession();
    const template = body.url || DEFAULT_FLOW_SHOP_URL;
    const url = buildSsoUrl(template, {
      ssoToken: body.ssoToken || session.lastSsoToken,
      account: body.account || session.completeAccount,
      appendAccount: body.appendAccount !== false
    });
    if (url) {
      await patchSession({ lastBuiltUrl: url, lastJumpTemplate: template });
    }
    sendJson(res, 200, { success: Boolean(url), url });
    return;
  }
  if (req.method === 'POST' && pathname === '/api/tools/default-jump') {
    const body = await readJson(req);
    sendJson(res, 200, await buildDefaultJumpUrl(body));
    return;
  }
  if (req.method === 'POST' && pathname === '/api/tools/wx-cookie') {
    const body = await readJson(req);
    sendJson(res, 200, await collectWxCookie(body));
    return;
  }
  sendJson(res, 404, { success: false, message: 'API 不存在' });
}

async function buildDefaultJumpUrl({ mode = 'v1' } = {}) {
  const tokenResult = await querySpecToken({ toSourceId: DEFAULT_FLOW_SHOP_SOURCE_ID, mode });
  const session = await loadSession();
  const url = buildSsoUrl(DEFAULT_FLOW_SHOP_URL, {
    ssoToken: tokenResult.ssoToken || session.lastSsoToken,
    account: session.completeAccount,
    appendAccount: false
  });
  await patchSession({
    lastBuiltUrl: url,
    lastJumpTemplate: DEFAULT_FLOW_SHOP_URL
  });
  return {
    success: Boolean(tokenResult.success && url),
    sourceId: DEFAULT_FLOW_SHOP_SOURCE_ID,
    template: DEFAULT_FLOW_SHOP_URL,
    url,
    token: tokenResult.ssoToken ? maskSecret(tokenResult.ssoToken) : '',
    response: tokenResult.response
  };
}

async function collectWxCookie({ url = '', maxRedirects = 10, runUserAuth = true } = {}) {
  const session = await loadSession();
  const targetUrl = url || session.lastBuiltUrl;
  if (!targetUrl) {
    throw new Error('缺少 10086 跳转链接，请先生成 10086 跳转');
  }
  const parsed = new URL(targetUrl);
  if (!is10086Host(parsed.hostname)) {
    throw new Error('只允许获取 10086.cn 域名的 Cookie');
  }

  const cookieJar = new Map();
  const visited = [];
  let currentUrl = targetUrl;
  let status = 0;

  for (let index = 0; index <= Number(maxRedirects || 10); index += 1) {
    const headers = {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36'
    };
    const cookieHeader = serializeCookieJar(cookieJar);
    if (cookieHeader) headers.Cookie = cookieHeader;
    if (visited.length > 0) headers.Referer = visited[visited.length - 1].url;

    const response = await fetch(currentUrl, {
      method: 'GET',
      redirect: 'manual',
      headers
    });
    status = response.status;
    const setCookies = getSetCookieLines(response.headers);
    for (const line of setCookies) {
      const cookie = parseSetCookie(line);
      if (cookie) cookieJar.set(cookie.name, cookie.value);
    }

    visited.push({
      url: currentUrl,
      status,
      setCookieCount: setCookies.length,
      location: response.headers.get('location') || ''
    });

    const location = response.headers.get('location');
    if (!location || status < 300 || status >= 400) break;
    const nextUrl = new URL(location, currentUrl);
    if (!is10086Host(nextUrl.hostname)) break;
    currentUrl = nextUrl.toString();
  }

  let userAuth = null;
  if (runUserAuth) {
    userAuth = await requestWxUserAuth(targetUrl, cookieJar);
  }

  const cookie = serializeCookieJar(cookieJar);
  await patchSession({
    lastWxCookie: cookie,
    lastWxCookieUrl: targetUrl,
    lastWxCookieAt: new Date().toISOString(),
    lastWxAuthToken: userAuth?.token || session.lastWxAuthToken || ''
  });

  return {
    success: Boolean(cookie),
    url: targetUrl,
    cookie,
    cookiePreview: maskCookie(cookie),
    cookieCount: cookieJar.size,
    authToken: userAuth?.token ? maskSecret(userAuth.token) : '',
    auth: userAuth,
    visited
  };
}

async function requestWxUserAuth(targetUrl, cookieJar) {
  const target = new URL(targetUrl);
  const backUrl = `${target.pathname}${target.search}`;
  const secondChannel = target.searchParams.get('secondChannel') || 'P00000116110';
  const bodyPlain = { backUrl };
  const encryptedBody = wxAesEncryptHex(JSON.stringify(bodyPlain));
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    'Content-Type': 'application/json; charset=UTF-8',
    Origin: 'https://wx.10086.cn',
    Referer: targetUrl,
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
    channelid: 'BUSINESS_H5',
    'chop-real-host': 'wx.10086.cn',
    pageType: 'xds17',
    'x-app-version': '1.0.1',
    'Chop-Second-Channel': secondChannel
  };
  const cookieHeader = serializeCookieJar(cookieJar);
  if (cookieHeader) headers.Cookie = cookieHeader;

  const response = await fetch('https://wx.10086.cn/website/nrapigate/nrauth/auth/encryt/userAuth', {
    method: 'POST',
    redirect: 'manual',
    headers,
    body: encryptedBody
  });
  const setCookies = getSetCookieLines(response.headers);
  for (const line of setCookies) {
    const cookie = parseSetCookie(line);
    if (cookie) cookieJar.set(cookie.name, cookie.value);
  }
  const rawText = await response.text();
  const parsed = safeJson(rawText);
  const decrypted = decryptWxResponse(parsed);
  return {
    success: response.ok,
    status: response.status,
    url: 'https://wx.10086.cn/website/nrapigate/nrauth/auth/encryt/userAuth',
    plainPayload: bodyPlain,
    encryptedPreview: maskSecret(encryptedBody, 16, 12),
    setCookieCount: setCookies.length,
    token: decrypted?.data?.token || '',
    response: decrypted || parsed || rawText || ''
  };
}

function wxAesEncryptHex(plainText) {
  const cipher = crypto.createCipheriv(
    'aes-128-cbc',
    Buffer.from('1234123412ABCDEF', 'utf8'),
    Buffer.from('ABCDEF1234123412', 'utf8')
  );
  cipher.setAutoPadding(true);
  return Buffer.concat([cipher.update(String(plainText), 'utf8'), cipher.final()]).toString('hex').toUpperCase();
}

function wxAesDecryptHex(cipherHex) {
  const decipher = crypto.createDecipheriv(
    'aes-128-cbc',
    Buffer.from('1234123412ABCDEF', 'utf8'),
    Buffer.from('ABCDEF1234123412', 'utf8')
  );
  decipher.setAutoPadding(true);
  return Buffer.concat([decipher.update(Buffer.from(String(cipherHex), 'hex')), decipher.final()]).toString('utf8');
}

function decryptWxResponse(parsed) {
  if (!parsed || typeof parsed !== 'object' || !parsed.body) return null;
  try {
    return safeJson(wxAesDecryptHex(parsed.body));
  } catch {
    return null;
  }
}

function safeJson(value) {
  if (!value || typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function getSetCookieLines(headers) {
  if (typeof headers.getSetCookie === 'function') {
    return headers.getSetCookie();
  }
  const combined = headers.get('set-cookie');
  return combined ? splitSetCookieHeader(combined) : [];
}

function splitSetCookieHeader(value) {
  return String(value)
    .split(/,(?=\s*[^;,=\s]+=[^;,]*)/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSetCookie(line) {
  const [pair] = String(line).split(';');
  const index = pair.indexOf('=');
  if (index <= 0) return null;
  return {
    name: pair.slice(0, index).trim(),
    value: pair.slice(index + 1).trim()
  };
}

function serializeCookieJar(cookieJar) {
  return Array.from(cookieJar.entries())
    .filter(([name]) => Boolean(name))
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
}

function maskCookie(cookie) {
  if (!cookie) return '';
  const parts = String(cookie).split(';').map((item) => item.trim()).filter(Boolean);
  if (parts.length === 0) return '';
  return parts
    .map((part) => {
      const index = part.indexOf('=');
      if (index <= 0) return maskSecret(part);
      const name = part.slice(0, index);
      const value = part.slice(index + 1);
      return `${name}=${maskSecret(value, 4, 4)}`;
    })
    .join('; ');
}

function is10086Host(hostname) {
  return /(\.|^)10086\.cn$/i.test(hostname);
}

async function serveStatic(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const safePath = pathname === '/' ? '/index.html' : decodeURIComponent(pathname);
  const filePath = path.resolve(PUBLIC_DIR, `.${safePath}`);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendText(res, 403, 'Forbidden');
    return;
  }
  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(file);
  } catch {
    sendText(res, 404, 'Not found');
  }
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw);
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload, null, 2));
}

function sendText(res, status, text) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(text);
}

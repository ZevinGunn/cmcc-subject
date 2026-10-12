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
  importAuthorization,
  querySpecToken,
  sendSmsCode
} from './yunpanClient.js';
import { getLogLocation, logEvent, summarizeResponse, withLogContext } from './diagnosticLogger.js';
import { generateBusinessJump, collectGlobalAccessToken } from './businessJumps.js';
import { clearSession, loadSession, patchSession, sessionSummary } from './sessionStore.js';
import { maskSecret } from './cryptoBox.js';
import {
  absorbSetCookieLines,
  getSetCookieLines,
  parseSetCookie,
  selectCookieJar,
  serializeCookieJar
} from './cookieJar.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
const PORT = Number(process.env.PORT || 7399);
const HOST = process.env.HOST || '127.0.0.1';
const responseSummaryKey = Symbol('responseSummary');
const requestIdKey = Symbol('requestId');
let mutationInFlight = false;
const BUILD_ID = 'yunpan-sso-20261013-v3';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  const requestUrl = req.url || '/';
  const isApi = requestUrl.startsWith('/api/');
  res[requestIdKey] = requestId;
  res.setHeader('X-Request-Id', requestId);

  void withLogContext({ requestId }, async () => {
    let ownsMutation = false;
    if (isApi) {
      await logEvent('info', 'api.request.start', {
        method: req.method,
        url: requestUrl
      });
    }
    try {
      if (isApi) {
        if (req.method === 'POST') {
          if (mutationInFlight) { sendJson(res, 409, { success: false, message: '已有操作进行中，请稍后重试' }); return; }
          const origin = req.headers.origin;
          if (origin && new URL(origin).host !== req.headers.host) { sendJson(res, 403, { success: false, message: '不允许跨站操作会话' }); return; }
          if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) { sendJson(res, 415, { success: false, message: '请求必须使用 JSON' }); return; }
          mutationInFlight = true;
          ownsMutation = true;
        }
        await handleApi(req, res);
        return;
      }
      await serveStatic(req, res);
    } catch (error) {
      if (isApi) {
        await logEvent('error', 'api.request.error', {
          method: req.method,
          url: requestUrl,
          error: error.message
        });
      }
      sendJson(res, 500, {
        success: false,
        message: error.message || '服务异常',
        stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
      });
    } finally {
      if (ownsMutation) mutationInFlight = false;
      if (isApi) {
        await logEvent(res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info', 'api.request.complete', {
          method: req.method,
          url: requestUrl,
          httpStatus: res.statusCode,
          durationMs: Date.now() - startedAt,
          response: res[responseSummaryKey]
        });
      }
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Yunpan login local running at http://${HOST}:${PORT}`);
  console.log(`Diagnostic logs: ${getLogLocation()}`);
  void logEvent('info', 'server.started', { host: HOST, port: PORT, logDirectory: getLogLocation() });
});

async function handleApi(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, { success: true, buildId: BUILD_ID, now: new Date().toISOString() });
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
        wxAuthToken: maskSecret(session.lastWxAuthToken),
        globalAccessToken: maskSecret(session.lastGlobalAccessToken)
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
    // 登录成功仅保存会话；各目标使用独立票据，避免自动消耗登录后的短票。
    sendJson(res, 200, loginResult);
    return;
  }
  if (req.method === 'POST' && pathname === '/api/auth/import') {
    sendJson(res, 200, await importAuthorization(await readJson(req)));
    return;
  }
  if (req.method === 'POST' && pathname === '/api/auth/sso-token') {
    const body = await readJson(req);
    sendJson(res, 200, await querySpecToken(body));
    return;
  }
  if (req.method === 'POST' && pathname === '/api/tools/build-url') {
    const body = await readJson(req);
    const template = body.url || DEFAULT_FLOW_SHOP_URL;
    sendJson(res, 200, await buildFreshJumpUrl({
      template,
      toSourceId: body.toSourceId || findTargetSourceId(template),
      mode: body.mode,
      protocol: body.protocol,
      account: body.account,
      appendAccount: body.appendAccount !== false
    }));
    return;
  }
  if (req.method === 'POST' && pathname === '/api/tools/default-jump') {
    const body = await readJson(req);
    sendJson(res, 200, await buildDefaultJumpUrl(body));
    return;
  }
  if (req.method === 'POST' && pathname === '/api/tools/wx-cookie') {
    const body = await readJson(req);
    let jump = null;
    if (body.refreshJump !== false) {
      jump = await buildDefaultJumpUrl({ mode: body.mode });
      if (!jump.success || !jump.url) {
        sendJson(res, 200, {
          success: false,
          message: '现场换取 10086 跳转票据失败，未继续获取 CK',
          jump
        });
        return;
      }
    }
    const result = await collectWxCookie({ ...body, url: jump?.url || body.url });
    sendJson(res, 200, {
      ...result,
      jump: jump ? {
        url: jump.url,
        sourceId: jump.sourceId,
        generatedAt: jump.generatedAt,
        freshness: jump.freshness,
        upstreamReusedTicket: jump.upstreamReusedTicket
      } : null
    });
    return;
  }
  if (req.method === 'POST' && pathname === '/api/tools/global-jump') {
    const body = await readJson(req);
    sendJson(res, 200, await generateBusinessJump('global', body));
    return;
  }
  if (req.method === 'POST' && pathname === '/api/tools/global-access-token') {
    sendJson(res, 200, await collectGlobalAccessToken(await readJson(req)));
    return;
  }
  if (req.method === 'POST' && ['/api/tools/cloudphone-jump', '/api/tools/capp-jump', '/api/tools/ai-phone-jump'].includes(pathname)) {
    const kind = { '/api/tools/cloudphone-jump': 'cloudphone', '/api/tools/capp-jump': 'capp', '/api/tools/ai-phone-jump': 'ai' }[pathname];
    sendJson(res, 200, await generateBusinessJump(kind, await readJson(req)));
    return;
  }
  sendJson(res, 404, { success: false, message: 'API 不存在' });
}

async function buildDefaultJumpUrl({ mode = 'v1', protocol = 'web' } = {}) {
  return buildFreshJumpUrl({
    template: DEFAULT_FLOW_SHOP_URL,
    toSourceId: DEFAULT_FLOW_SHOP_SOURCE_ID,
    mode,
    protocol,
    appendAccount: false
  });
}

async function buildFreshJumpUrl({
  template = DEFAULT_FLOW_SHOP_URL,
  toSourceId = DEFAULT_FLOW_SHOP_SOURCE_ID,
  mode = 'v1',
  protocol = 'web',
  account = '',
  appendAccount = true
} = {}) {
  const previousSession = await loadSession();
  const sourceId = String(toSourceId || '').trim();
  if (!sourceId) throw new Error('toSourceId 不能为空，无法现场换取跳转票据');
  const tokenResult = await querySpecToken({ toSourceId: sourceId, mode, protocol });
  const session = await loadSession();
  if (!tokenResult.success || !tokenResult.ssoToken) {
    return {
      success: false,
      sourceId,
      template,
      url: '',
      token: '',
      generatedAt: tokenResult.generatedAt || '',
      freshness: 'live',
      response: tokenResult.response
    };
  }
  const url = buildSsoUrl(template, {
    ssoToken: tokenResult.ssoToken,
    account: account || session.completeAccount,
    appendAccount
  });
  const generatedAt = tokenResult.generatedAt || new Date().toISOString();
  await patchSession({
    lastBuiltUrl: url,
    lastJumpTemplate: template,
    lastBuiltAt: generatedAt
  });
  const output = {
    success: Boolean(tokenResult.success && url),
    sourceId,
    template,
    url,
    token: tokenResult.ssoToken ? maskSecret(tokenResult.ssoToken) : '',
    generatedAt,
    freshness: 'live',
    upstreamReusedTicket: Boolean(
      previousSession.lastSsoSourceId === sourceId &&
      previousSession.lastSsoToken &&
      previousSession.lastSsoToken === tokenResult.ssoToken
    ),
    response: tokenResult.response
  };
  await logEvent(output.success ? 'info' : 'warn', 'jump.generated', {
    kind: template === DEFAULT_FLOW_SHOP_URL ? '10086-default' : 'custom',
    mode: mode === 'v2' ? 'v2' : 'v1',
    sourceId,
    generatedAt,
    upstreamReusedTicket: output.upstreamReusedTicket,
    success: output.success
  });
  return output;
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

  const cookieJar = new Map(Object.entries(makeWxCookieSeed(targetUrl)));
  const seedCookieNames = new Set(cookieJar.keys());
  const upstreamCookieNames = new Set();
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

    const redirectStartedAt = Date.now();
    const response = await fetch(currentUrl, {
      method: 'GET',
      redirect: 'manual',
      headers
    });
    status = response.status;
    const setCookies = getSetCookieLines(response.headers);
    absorbSetCookieLines(cookieJar, setCookies, upstreamCookieNames);
    const location = response.headers.get('location') || '';
    await logEvent(response.ok || (status >= 300 && status < 400) ? 'info' : 'warn', 'wx.redirect.response', {
      step: index,
      method: 'GET',
      url: currentUrl,
      httpStatus: status,
      durationMs: Date.now() - redirectStartedAt,
      setCookieNames: setCookies.map((line) => parseSetCookie(line)?.name).filter(Boolean),
      location
    });

    visited.push({
      url: currentUrl,
      status,
      setCookieCount: setCookies.length,
      location
    });

    if (!location || status < 300 || status >= 400) break;
    const nextUrl = new URL(location, currentUrl);
    if (!is10086Host(nextUrl.hostname)) break;
    currentUrl = nextUrl.toString();
  }

  let userAuth = null;
  if (runUserAuth) {
    userAuth = await requestWxUserAuth(targetUrl, cookieJar, upstreamCookieNames);
  }

  const realCookieJar = selectCookieJar(cookieJar, upstreamCookieNames);
  const cookie = serializeCookieJar(realCookieJar);
  const generatedAt = new Date().toISOString();
  await patchSession({
    lastWxCookie: cookie,
    lastWxCookieUrl: targetUrl,
    lastWxCookieAt: generatedAt,
    lastWxCookieSource: 'upstream-set-cookie',
    lastWxUpstreamCookieNames: Array.from(realCookieJar.keys()),
    lastWxSeedCookieNames: Array.from(seedCookieNames),
    lastWxAuthToken: userAuth?.token || session.lastWxAuthToken || ''
  });

  const output = {
    success: Boolean(userAuth?.success && userAuth.token && cookieJar.get('shareToken')),
    url: targetUrl,
    cookie,
    cookiePreview: maskCookie(cookie),
    cookieCount: realCookieJar.size,
    cookieSource: 'upstream-set-cookie',
    upstreamCookieNames: Array.from(realCookieJar.keys()),
    seedCookieNames: Array.from(seedCookieNames),
    generatedAt,
    freshness: 'live',
    authToken: userAuth?.token ? maskSecret(userAuth.token) : '',
    auth: userAuth,
    visited
  };
  await logEvent(output.success ? 'info' : 'warn', 'wx.cookie.complete', {
    success: output.success,
    redirectCount: visited.length,
    finalHttpStatus: status,
    cookieNames: Array.from(realCookieJar.keys()),
    seedCookieNames: Array.from(seedCookieNames),
    hasShareToken: Boolean(cookieJar.get('shareToken')),
    hasBusinessToken: Boolean(userAuth?.token)
  });
  return output;
}

function makeWxCookieSeed(targetUrl) {
  const clientId = crypto.randomUUID();
  const compactId = crypto.randomUUID().replace(/-/g, '');
  const gdpUserId = `gioenc-${compactId.slice(0, 8)}%2C${compactId.slice(8, 16)}`;
  const sessionId = crypto.randomUUID();
  const now = Date.now();
  let lastUrl = '/website/spa/main/newHome';
  try {
    const url = new URL(targetUrl);
    lastUrl = encodeURIComponent(`${url.pathname}${url.search}`);
  } catch {
    // Keep the stable 10086 landing page when the target URL is malformed.
  }
  const sensors = encodeURIComponent(
    JSON.stringify({
      distinct_id: clientId,
      first_id: '',
      props: {},
      identities: { $identity_cookie_id: clientId },
      history_login_id: { name: '', value: '' },
      $device_id: clientId
    })
  );
  return {
    _zw_kvani5r: crypto.randomBytes(36).toString('hex'),
    clientId,
    gdp_user_id: gdpUserId,
    CmLocation: '100|100',
    CmProvid: 'bj',
    '9e4e5fa7244c6b6e_gdp_user_key': '',
    verifyCode: crypto.randomBytes(20).toString('hex'),
    WT_FPC: `id=${compactId}:lv=${now}:ss=${now}`,
    '9e4e5fa7244c6b6e_gdp_cs1': gdpUserId,
    '9e4e5fa7244c6b6e_gdp_gio_id': gdpUserId,
    '9e4e5fa7244c6b6e_gdp_session_id_sent': sessionId,
    '9e4e5fa7244c6b6e_gdp_sequence_ids': encodeURIComponent(
      JSON.stringify({ globalKey: 1, VISIT: 1, PAGE: 1 })
    ),
    sensorsdata2015jssdkcross: sensors,
    lastUrl
  };
}

async function requestWxUserAuth(targetUrl, cookieJar, upstreamCookieNames) {
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

  const startedAt = Date.now();
  const response = await fetch('https://wx.10086.cn/website/nrapigate/nrauth/auth/encryt/userAuth', {
    method: 'POST',
    redirect: 'manual',
    headers,
    body: encryptedBody
  });
  const setCookies = getSetCookieLines(response.headers);
  absorbSetCookieLines(cookieJar, setCookies, upstreamCookieNames);
  const rawText = await response.text();
  const parsed = safeJson(rawText);
  const decrypted = decryptWxResponse(parsed);
  const output = {
    success: Boolean(response.ok && decrypted?.data?.token && cookieJar.get('shareToken')),
    status: response.status,
    url: 'https://wx.10086.cn/website/nrapigate/nrauth/auth/encryt/userAuth',
    plainPayload: bodyPlain,
    encryptedPreview: maskSecret(encryptedBody, 16, 12),
    setCookieCount: setCookies.length,
    token: decrypted?.data?.token || '',
    response: decrypted || parsed || rawText || ''
  };
  await logEvent(output.success ? 'info' : 'warn', 'wx.user-auth.complete', {
    method: 'POST',
    url: output.url,
    httpStatus: output.status,
    durationMs: Date.now() - startedAt,
    requestBytes: Buffer.byteLength(encryptedBody),
    responseBytes: Buffer.byteLength(rawText),
    setCookieNames: setCookies.map((line) => parseSetCookie(line)?.name).filter(Boolean),
    hasShareToken: Boolean(cookieJar.get('shareToken')),
    hasBusinessToken: Boolean(decrypted?.data?.token),
    success: output.success,
    response: summarizeResponse(decrypted || parsed)
  });
  return output;
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

function findTargetSourceId(template) {
  const value = String(template || '').match(/[?&#]targetSourceId=([^&#]+)/i)?.[1] || '';
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
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
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 16384) throw new Error('请求体超过 16KB');
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw);
}

function sendJson(res, status, payload) {
  const responsePayload =
    payload && typeof payload === 'object' && !Array.isArray(payload)
      ? { ...payload, requestId: payload.requestId || res[requestIdKey] }
      : payload;
  res[responseSummaryKey] = summarizeResponse(responsePayload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, max-age=0'
  });
  res.end(JSON.stringify(responsePayload, null, 2));
}

function sendText(res, status, text) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(text);
}

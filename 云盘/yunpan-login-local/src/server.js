import http from 'node:http';
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

server.listen(PORT, () => {
  console.log(`Yunpan login local running at http://localhost:${PORT}`);
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
        ssoToken: maskSecret(session.lastSsoToken)
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

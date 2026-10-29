import { chromium, devices } from 'playwright';
import { existsSync } from 'node:fs';
import { validateGlobalTelecomUrl } from './globalTelecom.js';
import { logEvent } from './diagnosticLogger.js';

export function validateBrowserSsoUrl(kind, rawUrl) {
  if (kind === 'global') return validateGlobalTelecomUrl(rawUrl);
  if (kind !== 'cloudphone') return '';
  try {
    const url = new URL(rawUrl);
    const params = new URLSearchParams(url.hash.replace(/^#\/\?/, ''));
    return url.protocol === 'https:' && url.hostname === 'cloud.139.com' && url.pathname === '/' &&
      !url.port && !url.username && !url.password && !url.search && url.hash.startsWith('#/?') &&
      params.get('targetSourceId') === '001216' && params.get('token') ? url.toString() : '';
  } catch { return ''; }
}

export function browserLoginResult(kind, httpStatus, payload) {
  return httpStatus === 200 && (kind === 'global' ? payload?.status === '1' :
    kind === 'cloudphone' && payload?.header?.status === '200' && typeof payload?.data?.token === 'string' && !!payload.data.token);
}

// Run the official page in a fresh context. Its redirects, cookies and scripts
// are part of the SSO initialization; plain HTTP 302 is not a login verdict.
export async function verifyBrowserSso({ kind = 'global', url, timeoutMs = 40000 } = {}) {
  const safeUrl = validateBrowserSsoUrl(kind, url);
  if (!safeUrl) throw new Error('业务 SSO 链接无效');
  const host = kind === 'global' ? 'qqt.cmicrwx.cn' : 'cloud.139.com';
  const executablePath = process.env.YUNPAN_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (!existsSync(executablePath)) throw new Error('未找到 Chrome，请配置 YUNPAN_CHROME_PATH 后重试浏览器登录验证');
  let browser;
  let timer;
  try {
    browser = await chromium.launch({ executablePath, headless: true, args: ['--no-proxy-server'] });
    const context = await browser.newContext({ ...devices['iPhone 13'], locale: 'zh-CN', acceptDownloads: false });
    const page = await context.newPage();
    await page.route('**/*', route => {
      const request = route.request();
      if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
        const target = new URL(request.url());
        if (target.protocol !== 'https:' || target.hostname !== host || target.port || target.username || target.password) return route.abort();
      }
      return route.continue();
    });
    const observed = new Promise(resolve => {
      page.on('response', async response => {
        const target = new URL(response.url());
        const expectedPath = kind === 'global' ? '/2016tyjf/xhmqqthy/checkLoginStatus.action' : '/uniphone/user/tokenValidate';
        if (target.hostname !== host || target.pathname !== expectedPath) return;
        try {
          const payload = await response.json();
          resolve({ success: browserLoginResult(kind, response.status(), payload), httpStatus: response.status(),
            loginStatus: kind === 'global' ? payload.status : payload.header?.status });
        } catch { resolve({ success: false, httpStatus: response.status(), reason: 'invalid-response' }); }
      });
    });
    const timeout = new Promise(resolve => { timer = setTimeout(() => resolve({ success: false, reason: 'timeout' }), timeoutMs); });
    // Install observation before navigation so fast SSO responses are not lost.
    const outcome = await Promise.race([
      page.goto(safeUrl, { waitUntil: 'domcontentloaded', timeout: 20000 }).then(() => observed), timeout
    ]);
    clearTimeout(timer);
    const cookies = await context.cookies(kind === 'global' ?
      `https://${host}/2016tyjf/xhmqqthy/checkLoginStatus.action` : `https://${host}/`);
    const accessToken = kind === 'global' ? cookies.find(item => item.name === 'access_token')?.value || '' : '';
    const success = !!outcome.success && (kind !== 'global' || !!accessToken);
    await logEvent(success ? 'info' : 'warn', 'business.browser-sso.complete', { kind, success,
      httpStatus: outcome.httpStatus, loginStatus: outcome.loginStatus, reason: outcome.reason,
      freshBrowserSession: true, cookieNames: cookies.map(item => item.name) });
    return { success, kind, validationState: success ? 'authenticated' : 'failed', freshBrowserSession: true,
      httpStatus: outcome.httpStatus, loginStatus: outcome.loginStatus,
      accessToken: success ? accessToken : '', cookie: success && kind === 'global' ? cookies.map(item => `${item.name}=${item.value}`).join('; ') : '',
      generatedAt: new Date().toISOString(), freshness: 'live',
      message: success ? '官方页面已在全新浏览器会话中确认登录；短票已用于验证' :
        outcome.reason === 'timeout' ? '官方页面登录检查超时，请重新生成短票后重试' : '官方页面未确认业务登录，请检查会话或重新签发目标票据' };
  } catch {
    await logEvent('error', 'business.browser-sso.error', { kind, reason: 'browser-navigation-failed' });
    throw new Error('官方页面浏览器验证失败，请检查 Chrome、网络和目标短票；短票可能已消费');
  } finally {
    clearTimeout(timer);
    if (browser) await browser.close().catch(() => {});
  }
}

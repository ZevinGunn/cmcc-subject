import { logEvent } from './diagnosticLogger.js';
import { getSetCookieLines, parseSetCookie } from './cookieJar.js';

const GLOBAL_TELECOM_BACK_URL =
  'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/new/ssoTokenLogin.action?backUrl=' +
  encodeURIComponent('https://qqt.cmicrwx.cn/2016tyjf/xdractivity?sspId=66050');
const GLOBAL_TELECOM_TARGET_SOURCE_ID = '001191';

export const GLOBAL_TELECOM_BIND_URL =
  'https://wx.10086.cn/website/bind/bindAccount/new?netUniChannelId=001191&tokenKey=token&netUniBackUrl=' +
  `${encodeURIComponent(GLOBAL_TELECOM_BACK_URL)}&ys=&yx=&touch_id=`;

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36';

export async function buildGlobalTelecomJump({ ssoToken, sourceId = '001191', campaign = '66050', cookie, fetchImpl = fetch } = {}) {
  if (!/^\d{1,10}$/.test(String(campaign))) throw new Error('全球通活动编号必须为数字');
  const ticket = String(ssoToken || '').trim();
  if (ticket) {
    if (sourceId !== GLOBAL_TELECOM_TARGET_SOURCE_ID) throw new Error('全球通必须使用 001191 专用票据，不能复用 001003 邮箱/10086 票据');
    const url = new URL(GLOBAL_TELECOM_BACK_URL);
    url.searchParams.set('backUrl', `https://qqt.cmicrwx.cn/2016tyjf/xdractivity?sspId=${campaign}`);
    url.searchParams.set('token', ticket);
    url.searchParams.set('targetSourceId', GLOBAL_TELECOM_TARGET_SOURCE_ID);
    url.searchParams.set('enableShare', '1');
    const safeUrl = validateGlobalTelecomUrl(url.toString());
    if (!safeUrl) throw new Error('生成的全球通跳转链接不合法');
    await logEvent('info', 'global-telecom.direct.complete', {
      url: safeUrl,
      yunpanSourceId: sourceId,
      sourceId: GLOBAL_TELECOM_TARGET_SOURCE_ID,
      success: true
    });
    return {
      success: true,
      url: safeUrl,
      source: `目标 001191 专用票据`,
      validationState: 'issued',
      message: '票据已签发；目标登录结果请使用“置换全球通 access_token”验证'
    };
  }

  if (!String(cookie || '').trim()) {
    throw new Error('缺少云盘临时票据和 wx.10086 CK');
  }

  const startedAt = Date.now();
  try {
    const response = await fetchImpl(GLOBAL_TELECOM_BIND_URL, {
      method: 'GET',
      redirect: 'manual',
      signal: AbortSignal.timeout(20000),
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        Cookie: cookie,
        Referer: 'https://wx.10086.cn/website/bind/bindAccount/new',
        'User-Agent': USER_AGENT
      }
    });
    const bodyText = await response.text();
    const location = response.headers.get('location') || extractGlobalTelecomUrl(bodyText);
    const url = validateGlobalTelecomUrl(location);
    const success = response.status >= 200 && response.status < 400 && Boolean(url);

    await logEvent(success ? 'info' : 'warn', 'global-telecom.bind.response', {
      method: 'GET',
      url: GLOBAL_TELECOM_BIND_URL,
      httpStatus: response.status,
      durationMs: Date.now() - startedAt,
      hasLocation: Boolean(location),
      location,
      bodyBytes: Buffer.byteLength(bodyText),
      success
    });

    if (!success) {
      throw new Error(`未获取到安全有效的全球通跳转链接（HTTP ${response.status}）`);
    }

    return {
      success,
      status: response.status,
      url,
      source: 'wx.10086.cn netUniChannelId=001191'
    };
  } catch (error) {
    await logEvent('error', 'global-telecom.bind.error', {
      method: 'GET',
      url: GLOBAL_TELECOM_BIND_URL,
      durationMs: Date.now() - startedAt,
      error: error.message
    });
    throw error;
  }
}

export function validateGlobalTelecomUrl(rawUrl) {
  if (!rawUrl) return '';
  try {
    const url = new URL(String(rawUrl).replace(/&amp;/g, '&'));
    if (url.protocol !== 'https:' || url.hostname !== 'qqt.cmicrwx.cn') return '';
    if (url.pathname !== '/2016tyjf/xhmqqthy/new/ssoTokenLogin.action') return '';
    if (!url.searchParams.get('token')) return '';
    if (url.searchParams.get('targetSourceId') && url.searchParams.get('targetSourceId') !== GLOBAL_TELECOM_TARGET_SOURCE_ID) return '';
    const backUrl = new URL(url.searchParams.get('backUrl') || '');
    if (backUrl.protocol !== 'https:' || backUrl.hostname !== 'qqt.cmicrwx.cn' || backUrl.port || backUrl.username || backUrl.password) return '';
    if (url.port || url.username || url.password) return '';
    return url.toString();
  } catch {
    return '';
  }
}

export async function exchangeGlobalTelecomAccessToken({ url, fetchImpl = fetch } = {}) {
  const jumpUrl = validateGlobalTelecomUrl(url);
  if (!jumpUrl) throw new Error('请提供 HTTPS 全球通 SSO 链接，且 backUrl 必须属于全球通域名');
  const jar = new Map();
  let currentUrl = jumpUrl;
  const visited = [];
  let newAccessToken = '';
  for (let step = 0; step < 5; step += 1) {
    const response = await fetchImpl(currentUrl, {
      method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(20000),
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,*/*',
        ...(jar.size ? { Cookie: Array.from(jar, ([k,v]) => `${k}=${v}`).join('; ') } : {}) }
    });
    const lines = getSetCookieLines(response.headers);
    for (const line of lines) {
      const item = parseSetCookie(line);
      if (!item || /;\s*max-age=0(?:;|$)/i.test(line)) continue;
      jar.set(item.name, item.value);
      if (item.name === 'access_token') newAccessToken = item.value;
    }
    const location = response.headers.get('location');
    await response.arrayBuffer();
    visited.push({ step, status: response.status, path: new URL(currentUrl).pathname });
    await logEvent('info', 'global-telecom.exchange.redirect', { step, url: currentUrl,
      httpStatus: response.status, setCookieNames: lines.map(x => parseSetCookie(x)?.name).filter(Boolean) });
    if (response.status >= 400) return { success: false, message: `全球通响应 HTTP ${response.status}`, visited };
    if (!location || response.status < 300 || response.status >= 400) break;
    const next = new URL(location, currentUrl);
    if (next.protocol !== 'https:' || next.hostname !== 'qqt.cmicrwx.cn' || next.port || next.username || next.password) {
      return { success: false, message: '全球通返回了非本站跳转，已停止置换', visited };
    }
    currentUrl = next.toString();
    if (step === 4) return { success: false, message: '全球通重定向次数超限', visited };
  }
  if (!newAccessToken) return { success: false, message: '全球通未下发新的 access_token，票据可能不匹配、过期或已消费', visited };
  const cookie = Array.from(jar, ([k,v]) => `${k}=${v}`).join('; ');
  const response = await fetchImpl('https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/checkLoginStatus.action', {
    method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(20000),
    headers: { Cookie: cookie, Referer: currentUrl, 'User-Agent': USER_AGENT, Accept: 'application/json' }
  });
  let login = null;
  try { login = await response.json(); } catch { /* HTML/login pages do not prove authentication. */ }
  const success = response.ok && String(login?.status) === '1';
  await logEvent(success ? 'info' : 'warn', 'global-telecom.exchange.complete', {
    success, httpStatus: response.status, loginStatus: login?.status, cookieNames: [...jar.keys()]
  });
  return { success, validationState: success ? 'authenticated' : 'failed',
    message: success ? '全球通已下发新 access_token，登录状态已确认；跳转短票可能已消费' : '全球通已下发 Cookie，但登录校验未通过',
    accessToken: success ? newAccessToken : '', cookie: success ? cookie : '',
    generatedAt: new Date().toISOString(), freshness: 'live', visited, login };
}

function extractGlobalTelecomUrl(html) {
  const match = String(html || '').match(
    /https:\/\/qqt\.cmicrwx\.cn\/[^\s"'<>]+ssoTokenLogin\.action[^\s"'<>]+/i
  );
  return match ? match[0].replace(/[).,;"'<>]+$/g, '') : '';
}

export const __test__ = {
  extractGlobalTelecomUrl
};

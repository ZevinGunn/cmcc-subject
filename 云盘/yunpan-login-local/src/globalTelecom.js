import { logEvent } from './diagnosticLogger.js';

const GLOBAL_TELECOM_BACK_URL =
  'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/new/ssoTokenLogin.action?backUrl=' +
  encodeURIComponent('https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/index2.html?sspId=66411');
const GLOBAL_TELECOM_TARGET_SOURCE_ID = '001191';

export const GLOBAL_TELECOM_BIND_URL =
  'https://wx.10086.cn/website/bind/bindAccount/new?netUniChannelId=001191&tokenKey=token&netUniBackUrl=' +
  `${encodeURIComponent(GLOBAL_TELECOM_BACK_URL)}&ys=&yx=&touch_id=`;

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36';

export async function buildGlobalTelecomJump({ ssoToken, sourceId = '001003', cookie, fetchImpl = fetch } = {}) {
  const ticket = String(ssoToken || '').trim();
  if (ticket) {
    const url = new URL(GLOBAL_TELECOM_BACK_URL);
    url.searchParams.set('token', ticket);
    url.searchParams.set('targetSourceId', GLOBAL_TELECOM_TARGET_SOURCE_ID);
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
      source: `yunpan querySpecToken ${sourceId} -> qqt targetSourceId=001191`
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
    return url.toString();
  } catch {
    return '';
  }
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

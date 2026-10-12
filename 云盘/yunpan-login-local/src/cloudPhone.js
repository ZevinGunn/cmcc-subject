import crypto from 'node:crypto';
import { logEvent, summarizeResponse } from './diagnosticLogger.js';
import { formatMcloudTimestamp, randomString } from './cryptoBox.js';

export const CLOUD_PHONE_SOURCE_ID = '001216';
export const CAPP_SOURCE_ID = '001304';
export const CLOUD_PHONE_TEMPLATE = 'https://cloud.139.com/#/?token=#ssoToken#&targetSourceId=001216&loginType=0&channelSrc=02207';
export const CAPP_TEMPLATE = 'https://capp.139.com/#/?i=DYFvhV8fncc%3D&token=#ssoToken#&targetSourceId=001304';
const API = 'https://cloud.139.com/uniphone';
// These constants are the public H5 protocol configuration in app.02d2bfc2.js.
const CLIENT_ID = 'X3qUAu6hA1yO6CegzcMSrQJknuZ7aEs1';
const CLIENT_KEY = 'AqXZ3iQtf713yN70ydXRZkCkxdeGo3jo';

export function cloudPhoneHeaders(token = '', now = Date.now()) {
  const requestId = formatMcloudTimestamp(new Date(now)) + randomString(8);
  const appId = '3099801';
  const sign = crypto.createHash('md5').update(requestId + appId + token + 'esdkabncgfsfkmlondn' + now).digest('hex');
  return {
    'Content-Type': 'application/json; charset=utf-8', Accept: 'application/json',
    Origin: 'https://cloud.139.com', Referer: 'https://cloud.139.com/',
    appId, requestId, sign, token, timestamp: String(now), platform: 'h5',
    'x-kpcc-clientid': CLIENT_ID, 'x-kpcc-clientkey': CLIENT_KEY, 'x-channelSrc': '02040'
  };
}

async function request(path, body, token, fetchImpl) {
  const headers = cloudPhoneHeaders(token);
  const response = await fetchImpl(API + path, {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(20000), headers, body: JSON.stringify(body)
  });
  let data;
  try { data = await response.json(); } catch { throw new Error('云手机返回了非 JSON 响应'); }
  await logEvent('info', 'cloud-phone.http.response', { url: API + path,
    httpStatus: response.status, upstreamRequestId: headers.requestId,
    businessStatus: data?.header?.status, response: summarizeResponse(data) });
  if (!response.ok || String(data?.header?.status) !== '200') {
    throw new Error(data?.header?.errMsg || `云手机换票失败 HTTP ${response.status}`);
  }
  return data.data || {};
}

export async function exchangeCloudPhoneTicket({ ticket, targetSourceId = CAPP_SOURCE_ID, fetchImpl = fetch } = {}) {
  if (!String(ticket || '').trim()) throw new Error('缺少 001216 云手机短票');
  if (![CAPP_SOURCE_ID, '001005'].includes(targetSourceId)) throw new Error('云手机目标仅支持 CAPP 或 AI 助手');
  const session = await request('/user/tokenValidate', { token: ticket, version: '1.2', pintype: 5 }, '', fetchImpl);
  if (!session.token) throw new Error('云手机未返回业务 Token');
  const result = await request('/user/getRcsToken', { targetSourceId, token: session.token }, session.token, fetchImpl);
  if (typeof result.tmpToken !== 'string' || !result.tmpToken) throw new Error('云手机未返回 tmpToken');
  return { tmpToken: result.tmpToken, session: { token: session.token, hwToken: session.hwToken,
    refreshToken: session.refreshToken, expireTime: session.expireTime } };
}

export function buildCappUrl(ticket, template = CAPP_TEMPLATE) {
  const url = new URL(template);
  if (url.protocol !== 'https:' || url.hostname !== 'capp.139.com' || url.port || url.username || url.password || url.search) {
    throw new Error('CAPP 模板必须是 capp.139.com 的 HTTPS hash 路由');
  }
  const fragment = url.hash.slice(1);
  const index = fragment.indexOf('?');
  if (index < 0) throw new Error('CAPP 模板缺少应用参数');
  // #ssoToken# must be replaced before treating the remaining fragment as query data.
  const params = new URLSearchParams(fragment.slice(index + 1).replace(/#ssoToken#?/g, ''));
  if (!params.get('i')) throw new Error('CAPP 模板缺少应用 i 参数');
  params.set('token', String(ticket));
  params.set('targetSourceId', CAPP_SOURCE_ID);
  url.hash = fragment.slice(0, index) + '?' + params.toString();
  return url.toString();
}

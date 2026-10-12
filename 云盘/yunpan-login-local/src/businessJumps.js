import crypto from 'node:crypto';
import { buildSsoUrl, querySpecToken } from './yunpanClient.js';
import { buildGlobalTelecomJump, validateGlobalTelecomUrl } from './globalTelecom.js';
import { verifyBrowserSso } from './ssoBrowser.js';
import { CLOUD_PHONE_SOURCE_ID, CLOUD_PHONE_TEMPLATE, CAPP_SOURCE_ID, CAPP_TEMPLATE,
  exchangeCloudPhoneTicket, buildCappUrl } from './cloudPhone.js';
import { patchSession } from './sessionStore.js';
import { logEvent } from './diagnosticLogger.js';

// Logs keep provenance without retaining the bearer value.
function fingerprint(value) {
  return { length: value.length, sha256: crypto.createHash('sha256').update(value).digest('hex').slice(0, 12) };
}

export async function generateBusinessJump(kind, options = {}, deps = {}) {
  const query = deps.query || querySpecToken;
  const persist = deps.persist || patchSession;
  const sourceId = kind === 'global' ? '001191' : CLOUD_PHONE_SOURCE_ID;
  if (!['global', 'cloudphone', 'capp', 'ai'].includes(kind)) throw new Error('未知跳转业务');
  if (kind === 'capp') buildCappUrl('validation-only', options.template || CAPP_TEMPLATE);
  // The supplied current-session client verified these targets with plaintext App V2.
  if (kind === 'global' && !/^\d{1,10}$/.test(String(options.campaign || '66050'))) throw new Error('全球通活动编号必须为数字');
  const automatic = (!options.mode || options.mode === 'auto') && (!options.protocol || options.protocol === 'auto');
  const result = await query({ toSourceId: sourceId,
    mode: automatic ? 'v2' : options.mode || 'auto',
    protocol: automatic ? 'app' : options.protocol || 'auto' });
  if (!result.success || !result.ssoToken) {
    return { success: false, sourceId, validationState: 'failed', freshness: 'live',
      message: result.response?.message || '目标换票失败，请重新登录或检查目标授权；不会回退复用 001003 票据',
      response: result.response, generatedAt: result.generatedAt };
  }
  let url;
  let sessionPatch = {};
  if (kind === 'global') {
    url = (await buildGlobalTelecomJump({ ssoToken: result.ssoToken, sourceId, campaign: options.campaign || '66050' })).url;
  } else if (kind === 'cloudphone') {
    url = buildSsoUrl(CLOUD_PHONE_TEMPLATE, { ssoToken: result.ssoToken, appendAccount: false });
  } else {
    const targetSourceId = kind === 'capp' ? CAPP_SOURCE_ID : '001005';
    const exchanged = await (deps.exchange || exchangeCloudPhoneTicket)({ ticket: result.ssoToken, targetSourceId });
    url = kind === 'capp' ? buildCappUrl(exchanged.tmpToken, options.template || CAPP_TEMPLATE) :
      `https://yun.139.com/ai-helper-phone/?clientId=900213&token=${encodeURIComponent(exchanged.tmpToken)}&targetSourceId=001005&h5Version=4.7.1`;
    sessionPatch.cloudPhoneSession = exchanged.session;
  }
  const generatedAt = new Date().toISOString();
  const key = { global: 'lastGlobalTelecom', cloudphone: 'lastCloudPhone', capp: 'lastCapp', ai: 'lastAiPhone' }[kind];
  await persist({ ...sessionPatch, [key + 'Url']: url, [key + 'At']: generatedAt });
  await logEvent('info', 'business.jump.issued', { kind, sourceId, protocol: result.protocol,
    ticketFingerprint: fingerprint(result.ssoToken), generatedAt, url, validationState: 'issued' });
  return { success: true, kind, sourceId, url, generatedAt, freshness: 'live', validationState: 'issued',
    message: '已实时换票生成链接，目标页面登录尚未验证',
    source: kind === 'capp' || kind === 'ai' ? `001216 -> tokenValidate -> getRcsToken(${kind === 'capp' ? CAPP_SOURCE_ID : '001005'})` :
      `${result.protocol || options.mode || 'v2'}(${sourceId})`,
    ticketFingerprint: fingerprint(result.ssoToken) };
}

export async function collectGlobalAccessToken(options = {}, deps = {}) {
  // Generate a fresh ticket by default; a pasted native URL uses its own ticket.
  let url = options.url;
  if (!url) {
    const jump = await generateBusinessJump('global', options, deps);
    if (!jump.success) return jump;
    url = jump.url;
  }
  if (!validateGlobalTelecomUrl(url)) throw new Error('全球通链接无效');
  const persist = deps.persist || patchSession;
  // Even a rejected/timeout exchange may have consumed the short ticket.
  await persist({ lastGlobalTelecomUrl: '', lastGlobalTelecomAt: '',
    lastGlobalAccessToken: '', lastGlobalCookie: '', lastGlobalAccessAt: '' });
  const result = await (deps.exchangeGlobal || verifyBrowserSso)({ kind: 'global', url });
  if (result.success) await persist({ lastGlobalAccessToken: result.accessToken,
    lastGlobalCookie: result.cookie, lastGlobalAccessAt: result.generatedAt,
    lastGlobalTelecomUrl: '', lastGlobalTelecomAt: '' });
  return result;
}

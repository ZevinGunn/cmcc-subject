import {
  aesCbcDecryptWithIvPrefix,
  aesCbcEncryptWithIvPrefix,
  aesEcbDecrypt,
  aesEcbEncrypt,
  base64Decode,
  encryptUploadBrowseData,
  formatMcloudTimestamp,
  getNewSign,
  makeAuthorization,
  maskSecret,
  randomString,
  rsaEncryptWithPublicKey,
  safeJsonParse
} from './cryptoBox.js';
import { logEvent, summarizeResponse } from './diagnosticLogger.js';
import { loadSession, patchSession } from './sessionStore.js';

const ENDPOINTS = {
  yun: 'https://yun.139.com',
  user: 'https://user-njs.yun.139.com/user'
};

export const DEFAULT_FLOW_SHOP_SOURCE_ID = process.env.FLOW_SHOP_SOURCE_ID || '001003';
export const DEFAULT_FLOW_SHOP_URL =
  `https://wx.10086.cn/website/businessPlatform/flowShop?secondChannel=P00000116110&netToken=#ssoToken&targetSourceId=${encodeURIComponent(DEFAULT_FLOW_SHOP_SOURCE_ID)}`;

const CLIENT = {
  appVersion: '7.17.10',
  mcloudClient: '10701',
  appChannel: '10000034',
  cmsClient: '0010102',
  device: 'Chrome',
  os: 'macOS 10.15.7',
  screen: '1440X900',
  deviceId: 'jofSYuWzz1JXMEisuSJfHHZeB5kP54bk'
};

function deviceInfo(full = false) {
  const tail = full ? `|||${Buffer.from(CLIENT.device).toString('base64')}|` : '|||';
  return `||9|${CLIENT.appVersion}|${CLIENT.device}|${CLIENT.device}|${CLIENT.deviceId}||${CLIENT.os}|${CLIENT.screen}|${tail}`;
}

function requireSourceId(value) {
  const sourceId = String(value || '').trim();
  if (!sourceId) throw new Error('toSourceId 不能为空');
  return sourceId;
}

function buildQuerySpecTokenV1Payload(account, toSourceId) {
  return {
    account: String(account || '').trim(),
    toSourceId: requireSourceId(toSourceId)
  };
}

function buildQuerySpecTokenV2Payload(account, toSourceId) {
  return {
    phoneNumber: String(account || '').trim(),
    toSourceId: requireSourceId(toSourceId)
  };
}

function buildSmsLoginPayload(phone, smsCode, nationCode = '+86') {
  const isHongKong = normalizeNationCode(nationCode) === '+852';
  return {
    account: phone,
    dycPwd: smsCode,
    loginStyle: isHongKong ? 'passSMSHK' : 'passSMS',
    ifOpenAccount: isHongKong ? '0' : '1',
    verType: 2,
    clientEnv: '3',
    setCookie: 0
  };
}

function buildSmsLoginRequest(loginPayload, aesKey, { returnToken = true, autoLogin = true } = {}) {
  return {
    encryptMsg: aesEcbEncrypt(JSON.stringify(loginPayload), aesKey),
    clientId: CLIENT.mcloudClient,
    autoLogin: Boolean(autoLogin),
    returnToken: Boolean(returnToken)
  };
}

function resolveUserDomainUrl(routerInfo = []) {
  const candidate = routerInfo.find((item) => item?.modName === 'user')?.httpsUrl;
  if (!candidate) return ENDPOINTS.user;
  try {
    const parsed = new URL(candidate);
    if (
      parsed.protocol !== 'https:' ||
      (parsed.hostname !== 'yun.139.com' && !parsed.hostname.endsWith('.yun.139.com'))
    ) {
      return ENDPOINTS.user;
    }
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return ENDPOINTS.user;
  }
}

function normalizeNationCode(nationCode = '+86') {
  if (!nationCode) return '+86';
  const text = String(nationCode).trim();
  if (text === '86') return '+86';
  if (text === '852') return '+852';
  if (text === '92' || text === '+92') return '92';
  return text.startsWith('+') ? text : `+${text}`;
}

function cookieHeader(cookieJar = {}) {
  return Object.entries(cookieJar)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
}

function absorbSetCookie(cookieJar, headers) {
  const next = { ...cookieJar };
  const setCookie = headers.getSetCookie ? headers.getSetCookie() : [];
  for (const line of setCookie) {
    const [pair] = line.split(';');
    const index = pair.indexOf('=');
    if (index > 0) next[pair.slice(0, index)] = pair.slice(index + 1);
  }
  return next;
}

function commonHeaders({
  data,
  session,
  nationCode,
  contentType = 'application/json;charset=UTF-8',
  includeAuthorization = true,
  includeSecretKey = true
} = {}) {
  const timestamp = formatMcloudTimestamp();
  const nonce = randomString(8);
  const headers = {
    'CMS-CLIENT': CLIENT.cmsClient,
    'CMS-DEVICE': 'default',
    'Content-Type': contentType,
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN',
    'x-DeviceInfo': deviceInfo(false),
    'x-yun-client-info': deviceInfo(true),
    'x-yun-app-channel': CLIENT.appChannel,
    'x-yun-api-version': 'v1',
    'x-yun-svc-type': '1',
    'x-SvcType': '1',
    'x-inner-ntwk': '2',
    'x-m4c-caller': 'PC',
    'x-m4c-src': '10002',
    'x-huawei-channelSrc': CLIENT.appChannel,
    'mcloud-route': '001',
    'mcloud-version': CLIENT.appVersion,
    'mcloud-channel': '1000101',
    'mcloud-client': CLIENT.mcloudClient,
    'x-Nationcode': normalizeNationCode(nationCode || session?.nationCode),
    'Access-Control-Allow-Credentials': 'true',
    'INNER-HCY-ROUTER-HTTPS': '1',
    'mcloud-sign': `${timestamp},${nonce},${getNewSign(undefined, data, timestamp, nonce)}`,
    Origin: 'https://yun.139.com',
    Referer: 'https://yun.139.com/w/',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'
  };

  if (includeAuthorization && session?.authorization) {
    headers.Authorization = session.authorization;
  }
  if (includeSecretKey && session?.secretKey) headers['mcloud-skey'] = session.secretKey;

  const cookies = cookieHeader(session?.cookieJar);
  if (cookies) headers.Cookie = cookies;
  return headers;
}

async function requestJson(url, { method = 'POST', headers = {}, body, raw = false } = {}) {
  const startedAt = Date.now();
  const requestBody = body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body);
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: requestBody
    });
    const text = await res.text();
    const parsed = raw ? text : safeJsonParse(text);
    await logEvent(res.ok ? 'info' : 'warn', 'upstream.http.response', {
      service: 'yunpan',
      method,
      url,
      httpStatus: res.status,
      statusText: res.statusText,
      durationMs: Date.now() - startedAt,
      requestBytes: requestBody ? Buffer.byteLength(requestBody) : 0,
      responseBytes: Buffer.byteLength(text),
      response: raw ? { encrypted: true } : summarizeResponse(parsed)
    });
    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      data: parsed,
      rawText: text
    };
  } catch (error) {
    await logEvent('error', 'upstream.http.error', {
      service: 'yunpan',
      method,
      url,
      durationMs: Date.now() - startedAt,
      requestBytes: requestBody ? Buffer.byteLength(requestBody) : 0,
      error: error.message
    });
    throw error;
  }
}

export async function getRsaPublicKey() {
  const session = await loadSession();
  const body = { clientCode: CLIENT.mcloudClient, type: 1 };
  const headers = commonHeaders({
    data: body,
    session,
    includeAuthorization: false,
    includeSecretKey: false
  });
  const result = await requestJson(`${ENDPOINTS.yun}/orchestration/auth-rebuild/key/v1.0/getRsaPublicKey`, {
    method: 'POST',
    headers,
    body
  });
  const publicKey = result.data?.data?.publicKey || result.data?.data;
  const cookieJar = absorbSetCookie(session.cookieJar, result.headers);
  if (publicKey) {
    await patchSession({ rsaPublicKey: publicKey, cookieJar });
  } else {
    await patchSession({ cookieJar });
  }
  const output = {
    success: Boolean(result.ok && publicKey),
    status: result.status,
    publicKey,
    request: { url: `${ENDPOINTS.yun}/orchestration/auth-rebuild/key/v1.0/getRsaPublicKey`, body, headers: redactHeaders(headers) },
    response: result.data
  };
  await logEvent(output.success ? 'info' : 'warn', 'yunpan.public-key.complete', {
    httpStatus: output.status,
    success: output.success,
    response: summarizeResponse(output.response)
  });
  return output;
}

async function prepareFreshLoginCrypto() {
  const keyResult = await getRsaPublicKey();
  if (!keyResult.publicKey) throw new Error('获取 RSA 公钥失败');
  const aesKey = randomString(16);
  const rsaPublicKey = keyResult.publicKey;
  const secretKey = rsaEncryptWithPublicKey(aesKey, rsaPublicKey);
  const cryptoPreparedAt = new Date().toISOString();
  await patchSession({ aesKey, rsaPublicKey, secretKey, cryptoPreparedAt });
  await logEvent('info', 'yunpan.login-crypto.prepared', {
    clientId: CLIENT.mcloudClient,
    cryptoPreparedAt,
    hasRsaPublicKey: true,
    hasAesKey: true,
    hasSecretKey: true
  });
  return { ...(await loadSession()), rsaPublicKey, aesKey, secretKey, cryptoPreparedAt };
}

export async function sendSmsCode({ phone, nationCode = '+86', puzzleVerifyCode = '' }) {
  const session = await loadSession();
  const normalizedNation = normalizeNationCode(nationCode);
  const smsRandom = randomString(16);
  let plainPayload;
  if (normalizedNation === '+852' || normalizedNation === '92') {
    plainPayload = {
      phoneNumber: phone,
      reqType: 3,
      random: smsRandom,
      nationCode: normalizedNation,
      clientType: CLIENT.mcloudClient
    };
    if (puzzleVerifyCode) {
      plainPayload.puzzleVerfycode = encryptUploadBrowseData(puzzleVerifyCode, 'CREATPUZZLE03F9A');
    }
  } else {
    plainPayload = { account: phone, reqType: 3, random: smsRandom };
    if (puzzleVerifyCode) plainPayload.puzzleVerfyCode = puzzleVerifyCode;
  }

  const encryptedBody = aesCbcEncryptWithIvPrefix(plainPayload);
  const headers = commonHeaders({
    data: plainPayload,
    session,
    nationCode: normalizedNation,
    includeAuthorization: false,
    includeSecretKey: false
  });
  headers['hcy-cool-flag'] = '1';

  const result = await requestJson(`${ENDPOINTS.user}/sms/getSmsCode`, {
    method: 'POST',
    headers,
    body: JSON.stringify(encryptedBody),
    raw: true
  });

  let response = result.rawText;
  try {
    response = safeJsonParse(aesCbcDecryptWithIvPrefix(result.rawText));
  } catch {
    response = safeJsonParse(result.rawText);
  }

  await patchSession({
    cookieJar: absorbSetCookie(session.cookieJar, result.headers),
    nationCode: normalizedNation,
    lastSmsRandom: smsRandom
  });

  const diagnosticPayload = {
    ...plainPayload,
    ...(plainPayload.account ? { account: maskPhone(plainPayload.account) } : {}),
    ...(plainPayload.phoneNumber ? { phoneNumber: maskPhone(plainPayload.phoneNumber) } : {}),
    ...(plainPayload.puzzleVerfyCode ? { puzzleVerfyCode: '[REDACTED]' } : {}),
    ...(plainPayload.puzzleVerfycode ? { puzzleVerfycode: '[REDACTED]' } : {})
  };
  const output = {
    success: result.ok && (response?.success || response?.code === '0' || response?.resultCode === '0' || response?.status === '200'),
    status: result.status,
    plainPayload: diagnosticPayload,
    encryptedPreview: maskSecret(encryptedBody, 14, 12),
    request: { url: `${ENDPOINTS.user}/sms/getSmsCode`, headers: redactHeaders(headers), bodyType: 'AES-CBC(iv+ciphertext base64 JSON string)' },
    response
  };
  await logEvent(output.success ? 'info' : 'warn', 'yunpan.sms.complete', {
    httpStatus: output.status,
    success: Boolean(output.success),
    nationCode: normalizedNation,
    response: summarizeResponse(output.response)
  });
  return output;
}

export async function loginWithSms({ phone, smsCode, nationCode = '+86', returnToken = true, autoLogin = true }) {
  const loginAttemptAt = new Date().toISOString();
  await patchSession({
    lastLoginStatus: 'pending',
    lastLoginAttemptAt: loginAttemptAt,
    lastLoginErrorCode: '',
    lastLoginErrorMessage: ''
  });
  const session = await prepareFreshLoginCrypto();
  const normalizedNation = normalizeNationCode(nationCode);
  const loginPayload = buildSmsLoginPayload(phone, smsCode, normalizedNation);
  const body = buildSmsLoginRequest(loginPayload, session.aesKey, { returnToken, autoLogin });
  const headers = commonHeaders({
    data: body,
    session,
    nationCode: normalizedNation,
    includeAuthorization: false,
    includeSecretKey: false
  });
  headers['mcloud-skey'] = session.secretKey;

  const result = await requestJson(`${ENDPOINTS.yun}/orchestration/auth-rebuild/permission/v1.0/login`, {
    method: 'POST',
    headers,
    body
  });

  const data = result.data?.data || {};
  const encryptedAccount = data.encryptAccount || session.encryptedAccount;
  const completeAccount = encryptedAccount ? base64Decode(encryptedAccount) : phone;
  const account = data.simplifyAccount || maskPhone(completeAccount);
  const authToken = data.authToken || (data.token ? tryDecryptToken(data.token, session.aesKey) : '');
  const encryptedToken = data.token || (authToken ? aesEcbEncrypt(authToken, session.aesKey) : '');
  const authorization = makeAuthorization(completeAccount, authToken, 'pc');
  const cookieJar = {
    ...absorbSetCookie(session.cookieJar, result.headers),
    platform: data.belongsPlatform,
    cutover_status: data.cutoverStatus,
    ud_id: data.userDomainId,
    'ORCHES-I-ACCOUNT-SIMPLIFY': account,
    'ORCHES-I-ACCOUNT-ENCRYPT': encryptedAccount || Buffer.from(completeAccount).toString('base64'),
    auth_token: authToken,
    token: encryptedToken,
    authorization,
    NATION_CODE: normalizedNation.replace('+', ''),
    'ORCHES-USER-ID': data.userId || data.userid
  };

  if (result.ok && result.data?.success && authToken) {
    await patchSession({
      account,
      completeAccount,
      encryptedAccount,
      authToken,
      token: encryptedToken,
      authorization,
      belongsPlatform: data.belongsPlatform,
      cutoverStatus: data.cutoverStatus,
      userDomainId: data.userDomainId,
      userId: data.userId || data.userid,
      nationCode: data.nationCode || normalizedNation,
      routerInfo: data.routerInfo || [],
      cookieJar,
      lastSsoToken: '',
      lastSsoSourceId: '',
      lastSsoRequestedAt: '',
      lastSsoReceivedAt: '',
      lastBuiltUrl: '',
      lastJumpTemplate: '',
      lastBuiltAt: '',
      lastWxCookie: '',
      lastWxCookieUrl: '',
      lastWxCookieAt: '',
      lastWxCookieSource: '',
      lastWxUpstreamCookieNames: [],
      lastWxSeedCookieNames: [],
      lastWxAuthToken: '',
      lastGlobalTelecomUrl: '',
      lastGlobalTelecomAt: '',
      lastLoginStatus: 'success',
      lastLoginSucceededAt: new Date().toISOString(),
      lastLoginErrorCode: '',
      lastLoginErrorMessage: ''
    });
  } else {
    await patchSession({
      authToken: '',
      token: '',
      authorization: '',
      belongsPlatform: '',
      cutoverStatus: '',
      userDomainId: '',
      userId: '',
      routerInfo: [],
      lastSsoToken: '',
      lastSsoSourceId: '',
      lastSsoRequestedAt: '',
      lastSsoReceivedAt: '',
      lastBuiltUrl: '',
      lastJumpTemplate: '',
      lastBuiltAt: '',
      lastWxCookie: '',
      lastWxCookieUrl: '',
      lastWxCookieAt: '',
      lastWxCookieSource: '',
      lastWxUpstreamCookieNames: [],
      lastWxSeedCookieNames: [],
      lastWxAuthToken: '',
      lastGlobalTelecomUrl: '',
      lastGlobalTelecomAt: '',
      cookieJar: absorbSetCookie({}, result.headers),
      lastLoginStatus: 'failed',
      lastLoginErrorCode: String(result.data?.code || result.status || ''),
      lastLoginErrorMessage: result.data?.message || '登录失败'
    });
  }

  const output = {
    success: Boolean(result.ok && result.data?.success && authToken),
    status: result.status,
    loginPayload: {
      ...loginPayload,
      account: maskPhone(loginPayload.account),
      dycPwd: '[REDACTED]'
    },
    encryptedPreview: maskSecret(body.encryptMsg, 14, 12),
    request: { url: `${ENDPOINTS.yun}/orchestration/auth-rebuild/permission/v1.0/login`, headers: redactHeaders(headers), body: { ...body, encryptMsg: maskSecret(body.encryptMsg) } },
    response: result.data,
    session: {
      account,
      completeAccount,
      hasAuthToken: Boolean(authToken),
      hasAuthorization: Boolean(authorization),
      userDomainId: data.userDomainId,
      routerModules: (data.routerInfo || []).map((item) => item.modName)
    }
  };
  await logEvent(output.success ? 'info' : 'warn', 'yunpan.login.complete', {
    httpStatus: output.status,
    success: output.success,
    nationCode: normalizedNation,
    hasAuthToken: Boolean(authToken),
    hasAuthorization: Boolean(authorization),
    routerModules: output.session.routerModules,
    response: summarizeResponse(output.response)
  });
  return output;
}

export async function querySpecToken({ toSourceId, account = '', phoneNumber = '', mode = 'v1' } = {}) {
  const session = await loadSession();
  if (!session.authorization || !session.completeAccount) {
    throw new Error('请先完成登录，当前没有 Authorization 或完整账号');
  }

  const useV2 = mode === 'v2';
  const requestedAt = new Date().toISOString();
  const completeAccount = account || phoneNumber || session.completeAccount;
  const payload = useV2
    ? buildQuerySpecTokenV2Payload(completeAccount, toSourceId)
    : buildQuerySpecTokenV1Payload(completeAccount, toSourceId);
  const url = useV2
    ? `${resolveUserDomainUrl(session.routerInfo)}/querySpecTokenV2`
    : `${ENDPOINTS.yun}/orchestration/auth-rebuild/token/v1.0/querySpecToken`;

  let body = payload;
  const headers = commonHeaders({ data: payload, session, includeAuthorization: true });
  if (useV2) {
    headers['hcy-cool-flag'] = '1';
    body = JSON.stringify(aesCbcEncryptWithIvPrefix(payload));
  }

  const result = await requestJson(url, {
    method: 'POST',
    headers,
    body,
    raw: useV2
  });

  let response = result.data;
  if (useV2) {
    try {
      response = safeJsonParse(aesCbcDecryptWithIvPrefix(result.rawText));
    } catch {
      response = safeJsonParse(result.rawText);
    }
  }

  const ssoToken = response?.data?.token || response?.token || '';
  const receivedAt = new Date().toISOString();
  if (ssoToken) {
    await patchSession({
      lastSsoToken: ssoToken,
      lastSsoSourceId: payload.toSourceId,
      lastSsoRequestedAt: requestedAt,
      lastSsoReceivedAt: receivedAt,
      cookieJar: absorbSetCookie(session.cookieJar, result.headers)
    });
  }

  const output = {
    success: Boolean(result.ok && ssoToken),
    status: result.status,
    ssoToken,
    requestedAt,
    generatedAt: receivedAt,
    freshness: 'live',
    request: { url, headers: redactHeaders(headers), body: useV2 ? { encrypted: true, payload } : payload },
    response
  };
  await logEvent(output.success ? 'info' : 'warn', 'yunpan.sso-token.complete', {
    protocol: useV2 ? 'querySpecTokenV2-web' : 'querySpecToken-v1',
    sourceId: payload.toSourceId,
    requestedAt,
    receivedAt,
    httpStatus: output.status,
    success: output.success,
    hasSsoToken: Boolean(ssoToken),
    response: summarizeResponse(output.response)
  });
  return output;
}

export function buildSsoUrl(rawUrl, { ssoToken, account, appendAccount = true } = {}) {
  if (!rawUrl) return '';
  let url = rawUrl;
  const token = ssoToken || '';
  const phone = account || '';
  if (/#ssoToken#?/.test(url) || /#rcsToken#?/.test(url)) {
    url = url.replace(/#ssoToken#?/g, encodeURIComponent(token)).replace(/#rcsToken#?/g, encodeURIComponent(token));
  } else {
    url = appendQuery(url, 'ssoToken', token);
  }
  if (/#account#/.test(url)) {
    url = url.replace(/#account#/g, encodeURIComponent(phone));
  } else if (appendAccount) {
    url = appendQuery(url, 'account', phone);
  }
  return url;
}

export const __test__ = {
  buildSmsLoginPayload,
  buildSmsLoginRequest,
  buildQuerySpecTokenV1Payload,
  buildQuerySpecTokenV2Payload,
  requireSourceId,
  resolveUserDomainUrl
};

function appendQuery(url, key, value) {
  const hashIndex = url.indexOf('#');
  const beforeHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : '';
  const glue = beforeHash.includes('?') ? '&' : '?';
  return `${beforeHash}${glue}${encodeURIComponent(key)}=${encodeURIComponent(value)}${hash}`;
}

function tryDecryptToken(token, aesKey) {
  try {
    return aesEcbDecrypt(token, aesKey);
  } catch {
    return '';
  }
}

function maskPhone(phone) {
  const text = String(phone || '');
  if (text.length < 7) return text;
  return `${text.slice(0, 3)}****${text.slice(-4)}`;
}

function redactHeaders(headers) {
  const redacted = { ...headers };
  for (const key of Object.keys(redacted)) {
    if (/authorization|cookie|skey|token/i.test(key)) {
      redacted[key] = maskSecret(redacted[key]);
    }
  }
  return redacted;
}

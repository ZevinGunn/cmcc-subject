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
import { loadSession, patchSession } from './sessionStore.js';

const ENDPOINTS = {
  yun: 'https://yun.139.com',
  user: 'https://user-njs.yun.139.com/user'
};

export const DEFAULT_FLOW_SHOP_SOURCE_ID = '017018';
export const DEFAULT_FLOW_SHOP_URL =
  'https://wx.10086.cn/website/businessPlatform/flowShop?secondChannel=P00000116110&netToken=#ssoToken&targetSourceId=017018';

const CLIENT = {
  appVersion: '7.17.4',
  mcloudClient: '10601',
  appChannel: '10000035',
  cmsClient: '0010102',
  device: 'Pixel 9',
  os: 'Android 15',
  screen: '476X881',
  deviceId: 'jofSYuWzz1JXMEisuSJfHHZeB5kP54bk'
};

function deviceInfo(full = false) {
  const tail = full ? `|||${Buffer.from(CLIENT.device).toString('base64')}|` : '|||';
  return `||3|${CLIENT.appVersion}|${CLIENT.device}|${CLIENT.device}|${CLIENT.deviceId}||${CLIENT.os}|${CLIENT.screen}|${tail}`;
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

function commonHeaders({ data, session, nationCode, contentType = 'application/json;charset=UTF-8', includeAuthorization = true } = {}) {
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
    'x-m4c-caller': 'h5',
    'x-m4c-src': '10001',
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
    Referer: 'https://yun.139.com/m/',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36'
  };

  if (includeAuthorization && session?.authorization) {
    headers.Authorization = session.authorization;
  }

  const cookies = cookieHeader(session?.cookieJar);
  if (cookies) headers.Cookie = cookies;
  return headers;
}

async function requestJson(url, { method = 'POST', headers = {}, body, raw = false } = {}) {
  const res = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body)
  });
  const text = await res.text();
  const parsed = raw ? text : safeJsonParse(text);
  return {
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
    data: parsed,
    rawText: text
  };
}

export async function getRsaPublicKey() {
  const session = await loadSession();
  const body = { clientCode: CLIENT.mcloudClient, type: 1 };
  const headers = commonHeaders({ data: body, session, includeAuthorization: false });
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
  return {
    success: Boolean(result.ok && publicKey),
    status: result.status,
    publicKey,
    request: { url: `${ENDPOINTS.yun}/orchestration/auth-rebuild/key/v1.0/getRsaPublicKey`, body, headers: redactHeaders(headers) },
    response: result.data
  };
}

async function ensureRsaAndAes() {
  let session = await loadSession();
  let rsaPublicKey = session.rsaPublicKey;
  if (!rsaPublicKey) {
    const keyResult = await getRsaPublicKey();
    if (!keyResult.publicKey) throw new Error('获取 RSA 公钥失败');
    session = await loadSession();
    rsaPublicKey = keyResult.publicKey;
  }
  const aesKey = session.aesKey || randomString(16);
  const secretKey = rsaEncryptWithPublicKey(aesKey, rsaPublicKey);
  await patchSession({ aesKey, secretKey });
  return { ...(await loadSession()), rsaPublicKey, aesKey, secretKey };
}

export async function sendSmsCode({ phone, nationCode = '+86', puzzleVerifyCode = '' }) {
  const session = await ensureRsaAndAes();
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
  const headers = commonHeaders({ data: plainPayload, session, nationCode: normalizedNation, includeAuthorization: false });
  headers['hcy-cool-flag'] = '1';
  headers['mcloud-cool-skey'] = session.secretKey;

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

  return {
    success: result.ok && (response?.success || response?.code === '0' || response?.resultCode === '0' || response?.status === '200'),
    status: result.status,
    plainPayload,
    encryptedPreview: maskSecret(encryptedBody, 14, 12),
    request: { url: `${ENDPOINTS.user}/sms/getSmsCode`, headers: redactHeaders(headers), bodyType: 'AES-CBC(iv+ciphertext base64 JSON string)' },
    response
  };
}

export async function loginWithSms({ phone, smsCode, nationCode = '+86', returnToken = true, autoLogin = true }) {
  const session = await ensureRsaAndAes();
  const normalizedNation = normalizeNationCode(nationCode);
  const loginPayload = {
    account: phone,
    dycPwd: smsCode,
    loginStyle: normalizedNation === '+852' ? 'passSMSHK' : 'passSMS',
    ifOpenAccount: normalizedNation === '+852' ? 0 : 1,
    setCookie: 0
  };

  const body = {
    encryptMsg: aesEcbEncrypt(JSON.stringify(loginPayload), session.aesKey),
    returnToken: Boolean(returnToken),
    autoLogin: Boolean(autoLogin)
  };
  const headers = commonHeaders({ data: body, session, nationCode: normalizedNation, includeAuthorization: false });
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
      cookieJar
    });
  } else {
    await patchSession({ cookieJar: absorbSetCookie(session.cookieJar, result.headers) });
  }

  return {
    success: Boolean(result.ok && result.data?.success && authToken),
    status: result.status,
    loginPayload,
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
}

export async function querySpecToken({ toSourceId = '001005', phoneNumber = '', mode = 'v1' } = {}) {
  const session = await loadSession();
  if (!session.authorization || !session.completeAccount) {
    throw new Error('请先完成登录，当前没有 Authorization 或完整账号');
  }

  const payload = {
    phoneNumber: phoneNumber || session.completeAccount,
    toSourceId: String(toSourceId || '001005').trim()
  };

  const useV2 = mode === 'v2';
  const url = useV2
    ? `${ENDPOINTS.user}/querySpecTokenV2`
    : `${ENDPOINTS.yun}/orchestration/auth-rebuild/token/v1.0/querySpecToken`;

  let body = payload;
  const headers = commonHeaders({ data: payload, session, includeAuthorization: true });
  if (useV2) {
    headers['hcy-cool-flag'] = '1';
    headers['mcloud-cool-skey'] = session.secretKey || rsaEncryptWithPublicKey(session.aesKey, session.rsaPublicKey);
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
  if (ssoToken) {
    await patchSession({
      lastSsoToken: ssoToken,
      lastSsoSourceId: payload.toSourceId,
      cookieJar: absorbSetCookie(session.cookieJar, result.headers)
    });
  }

  return {
    success: Boolean(result.ok && ssoToken),
    status: result.status,
    ssoToken,
    request: { url, headers: redactHeaders(headers), body: useV2 ? { encrypted: true, payload } : payload },
    response
  };
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

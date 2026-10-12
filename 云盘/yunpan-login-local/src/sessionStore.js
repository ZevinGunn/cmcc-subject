import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(process.env.YUNPAN_DATA_DIR || path.join(__dirname, '..', 'data'));
const SESSION_FILE = path.join(DATA_DIR, 'session.json');
let writeQueue = Promise.resolve();

const defaultSession = {
  account: '',
  completeAccount: '',
  authToken: '',
  token: '',
  authorization: '',
  nativeClientInfo: '',
  nativeChannel: '',
  ssoReplayHeaders: {},
  aesKey: '',
  rsaPublicKey: '',
  secretKey: '',
  cryptoPreparedAt: '',
  belongsPlatform: '',
  cutoverStatus: '',
  userDomainId: '',
  userId: '',
  nationCode: '+86',
  routerInfo: [],
  cookieJar: {},
  lastSmsRandom: '',
  lastLoginStatus: '',
  lastLoginAttemptAt: '',
  lastLoginSucceededAt: '',
  lastLoginErrorCode: '',
  lastLoginErrorMessage: '',
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
  lastGlobalAccessToken: '',
  lastGlobalCookie: '',
  lastGlobalAccessAt: '',
  lastCloudPhoneUrl: '',
  lastCloudPhoneAt: '',
  lastCappUrl: '',
  lastCappAt: '',
  lastAiPhoneUrl: '',
  lastAiPhoneAt: '',
  cloudPhoneSession: null,
  updatedAt: ''
};

export async function loadSession() {
  try {
    const raw = await fs.readFile(SESSION_FILE, 'utf8');
    return { ...defaultSession, ...JSON.parse(raw) };
  } catch (error) {
    if (error.code === 'ENOENT') return { ...defaultSession };
    throw new Error('会话文件读取失败，请保留文件并检查权限或 JSON 格式');
  }
}

async function writeSession(nextSession) {
  await fs.mkdir(DATA_DIR, { recursive: true, mode: 0o700 });
  const session = {
    ...defaultSession,
    ...nextSession,
    updatedAt: new Date().toISOString()
  };
  const tempFile = SESSION_FILE + '.' + crypto.randomUUID() + '.tmp';
  try {
    await fs.writeFile(tempFile, `${JSON.stringify(session, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
    await fs.rename(tempFile, SESSION_FILE);
  } finally {
    await fs.unlink(tempFile).catch(() => {});
  }
  return session;
}

function enqueueWrite(callback) {
  const pending = writeQueue.then(callback);
  writeQueue = pending.catch(() => {});
  return pending;
}

export function saveSession(nextSession) {
  return enqueueWrite(() => writeSession(nextSession));
}

export async function patchSession(patch) {
  return enqueueWrite(async () => writeSession({ ...await loadSession(), ...patch }));
}

export async function clearSession() {
  await saveSession({ ...defaultSession, updatedAt: new Date().toISOString() });
  return loadSession();
}

export function sessionSummary(session) {
  const authState = session.lastLoginStatus === 'expired' ? 'expired' : !session.authorization
    ? session.lastLoginStatus === 'failed' ? 'failed' : 'signed-out'
    : ['success', 'verified'].includes(session.lastLoginStatus) ? 'active' : 'cached';
  return {
    account: session.account,
    completeAccount: session.completeAccount,
    hasAuthToken: Boolean(session.authToken),
    hasEncryptedToken: Boolean(session.token),
    hasAuthorization: Boolean(session.authorization),
    hasRsaPublicKey: Boolean(session.rsaPublicKey),
    hasAesKey: Boolean(session.aesKey),
    cryptoPreparedAt: session.cryptoPreparedAt,
    authState,
    lastLoginStatus: session.lastLoginStatus,
    lastLoginAttemptAt: session.lastLoginAttemptAt,
    lastLoginSucceededAt: session.lastLoginSucceededAt,
    lastLoginErrorCode: session.lastLoginErrorCode,
    lastLoginErrorMessage: session.lastLoginErrorMessage,
    belongsPlatform: session.belongsPlatform,
    cutoverStatus: session.cutoverStatus,
    userDomainId: session.userDomainId,
    userId: session.userId,
    nationCode: session.nationCode,
    routerModules: (session.routerInfo || []).map((item) => item.modName).filter(Boolean),
    lastSsoSourceId: session.lastSsoSourceId,
    hasLastSsoToken: Boolean(session.lastSsoToken),
    lastSsoRequestedAt: session.lastSsoRequestedAt,
    lastSsoReceivedAt: session.lastSsoReceivedAt,
    lastBuiltUrl: session.lastBuiltUrl,
    lastJumpTemplate: session.lastJumpTemplate,
    lastBuiltAt: session.lastBuiltAt,
    hasLastWxCookie: Boolean(session.lastWxCookie),
    lastWxCookieUrl: session.lastWxCookieUrl,
    lastWxCookieAt: session.lastWxCookieAt,
    lastWxCookieSource: session.lastWxCookieSource,
    lastWxUpstreamCookieNames: session.lastWxUpstreamCookieNames,
    lastWxSeedCookieNames: session.lastWxSeedCookieNames,
    hasLastWxAuthToken: Boolean(session.lastWxAuthToken),
    lastGlobalTelecomUrl: session.lastGlobalTelecomUrl,
    lastGlobalTelecomAt: session.lastGlobalTelecomAt,
    hasGlobalAccessToken: Boolean(session.lastGlobalAccessToken),
    lastGlobalAccessAt: session.lastGlobalAccessAt,
    lastCloudPhoneUrl: session.lastCloudPhoneUrl,
    lastCloudPhoneAt: session.lastCloudPhoneAt,
    lastCappUrl: session.lastCappUrl,
    lastCappAt: session.lastCappAt,
    lastSmsRandom: session.lastSmsRandom ? '已生成' : '',
    updatedAt: session.updatedAt
  };
}

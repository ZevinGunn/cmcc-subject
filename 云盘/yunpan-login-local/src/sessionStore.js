import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const SESSION_FILE = path.join(DATA_DIR, 'session.json');

const defaultSession = {
  account: '',
  completeAccount: '',
  authToken: '',
  token: '',
  authorization: '',
  aesKey: '',
  rsaPublicKey: '',
  secretKey: '',
  belongsPlatform: '',
  cutoverStatus: '',
  userDomainId: '',
  userId: '',
  nationCode: '+86',
  routerInfo: [],
  cookieJar: {},
  lastSmsRandom: '',
  lastSsoToken: '',
  lastSsoSourceId: '',
  lastBuiltUrl: '',
  lastJumpTemplate: '',
  updatedAt: ''
};

export async function loadSession() {
  try {
    const raw = await fs.readFile(SESSION_FILE, 'utf8');
    return { ...defaultSession, ...JSON.parse(raw) };
  } catch {
    return { ...defaultSession };
  }
}

export async function saveSession(nextSession) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const session = {
    ...defaultSession,
    ...nextSession,
    updatedAt: new Date().toISOString()
  };
  await fs.writeFile(SESSION_FILE, `${JSON.stringify(session, null, 2)}\n`, 'utf8');
  return session;
}

export async function patchSession(patch) {
  const current = await loadSession();
  return saveSession({ ...current, ...patch });
}

export async function clearSession() {
  await saveSession({ ...defaultSession, updatedAt: new Date().toISOString() });
  return loadSession();
}

export function sessionSummary(session) {
  return {
    account: session.account,
    completeAccount: session.completeAccount,
    hasAuthToken: Boolean(session.authToken),
    hasEncryptedToken: Boolean(session.token),
    hasAuthorization: Boolean(session.authorization),
    hasRsaPublicKey: Boolean(session.rsaPublicKey),
    hasAesKey: Boolean(session.aesKey),
    belongsPlatform: session.belongsPlatform,
    cutoverStatus: session.cutoverStatus,
    userDomainId: session.userDomainId,
    userId: session.userId,
    nationCode: session.nationCode,
    routerModules: (session.routerInfo || []).map((item) => item.modName).filter(Boolean),
    lastSsoSourceId: session.lastSsoSourceId,
    hasLastSsoToken: Boolean(session.lastSsoToken),
    lastBuiltUrl: session.lastBuiltUrl,
    lastJumpTemplate: session.lastJumpTemplate,
    lastSmsRandom: session.lastSmsRandom ? '已生成' : '',
    updatedAt: session.updatedAt
  };
}

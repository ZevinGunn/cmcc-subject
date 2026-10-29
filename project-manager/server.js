import { execFile, spawn } from "node:child_process";
import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdir, open, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import http from "node:http";
import {redirectShanxi,publicPrefix as shanxiPrefix} from "./shanxi-gateway.js";
import { isIP } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
await loadEnv(path.join(__dirname, ".env"));

const rootDir = path.resolve(__dirname, "..");
const deployDir = path.join(rootDir, "_部署方案");
const publicDir = path.join(__dirname, "public");
const legacyOperationLogFile = path.join(__dirname, "logs", "operations.jsonl");
const configuredRuntimeDir = process.env.MANAGER_RUNTIME_DIR || "runtime";
const runtimeDir = path.isAbsolute(configuredRuntimeDir)
  ? configuredRuntimeDir
  : path.resolve(__dirname, configuredRuntimeDir);
const operationLogFile = path.join(runtimeDir, "operations.jsonl");
const operationLockFile = path.join(runtimeDir, ".operation.lock");
const operationRecoveryLockFile = path.join(runtimeDir, ".operation.lock.recovery");
const adminsFile = path.join(runtimeDir, "admins.json");

const port = Number(process.env.PORT || 7800);
const host = process.env.HOST || "127.0.0.1";
const pm2 = process.env.PM2_BIN || path.join(process.env.HOME || "", ".nvm/versions/node/v18.20.8/bin/pm2");
const sessionSecret = process.env.MANAGER_SESSION_SECRET;
const managerPassword = process.env.MANAGER_PASSWORD;
if (!sessionSecret || !managerPassword || managerPassword.length < 12 || sessionSecret.length < 32) {
  throw new Error("MANAGER_PASSWORD (12+ chars) and MANAGER_SESSION_SECRET (32+ chars) are required");
}
const sessionCookie = "cmcc_manager_session";
const sessionTtlMs = 8 * 60 * 60 * 1000;
const commandTimeoutMs = 120000;
const restartTimeoutMs = 1000 * 60 * 20;
const retentionDays = 30;
const jobs = [];
const sessions = new Map();
const loginAttempts = new Map();
const activeBuildBackups = new Set();
let activeOperation = null;
let serviceStatusRefreshPromise = null;
let activeProbeCount = 0;
let adminStore = { admins: [] };
const probeWaiters = [];

const maxRequestBytes = 64 * 1024;
const loginWindowMs = 15 * 60 * 1000;
const loginMaxFailures = 5;
const adminPasswordMinLength = 12;
const adminPasswordMaxLength = 256;
const sensitivePatterns = [
  /(["']?authorization["']?\s*[:=]\s*["']?)(?:(?:bearer|basic)\s+)?([^"',;\s}]+)/gi,
  /(["']?[a-z0-9_.-]*(?:password|passwd|secret|token|key|cookie|database[_-]?url)["']?\s*[:=]\s*["']?)([^"',;\s}]+)/gi,
  /(bearer\s+)([a-z0-9._~+/=-]+)/gi,
  /(basic\s+)([a-z0-9+/=]+)/gi,
];

const serviceManifest = JSON.parse(await readFile(path.join(__dirname, "services.json"), "utf8"));
const services = serviceManifest.services || [];
const infrastructure = serviceManifest.infrastructure || [];
const serviceById = new Map(services.map((service) => [service.id, service]));
const legacyServices = services.filter((service) =>
  service.kind === "application" && service.group === "business" && service.legacyHome !== false,
);
const legacyProjects = legacyServices.map((service) => ({
  id: service.id,
  name: service.name,
  domain: service.domains?.[0] || (service.publicUrl ? new URL(service.publicUrl).host + new URL(service.publicUrl).pathname : ""),
  publicUrl: service.publicUrl,
  backend: { pm2Name: service.pm2Name, port: service.port },
  frontend: service.build?.artifact ? {
    cwd: service.build.cwd,
    dist: path.dirname(service.build.artifact),
    build: service.build.command,
  } : null,
  rebuildTarget: service.id,
}));
const config = {
  groups: [{
    id: "cmcc-public",
    name: "公网项目",
    projects: legacyProjects,
  }],
};
const projects = config.groups.flatMap((group) =>
  group.projects.map((project) => ({ ...project, groupId: group.id, groupName: group.name })),
);
const projectById = new Map(projects.map((project) => [project.id, project]));
const ecosystemFile = path.join(deployDir, "ecosystem.config.cjs");
let serviceStatusCache = { createdAt: 0, services: [] };

validateServiceManifest();

await mkdir(runtimeDir, { recursive: true, mode: 0o700 });
await ensureAdminStore();

async function loadEnv(filePath) {
  if (!existsSync(filePath)) return;
  const text = await readFile(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function hashAdminPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(String(password), salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

function verifyAdminPassword(password, encoded = "") {
  const [algorithm, salt, expectedHex] = String(encoded).split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return false;
  const actual = scryptSync(String(password), salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function adminPasswordPolicyError(password) {
  const length = String(password || "").length;
  if (length < adminPasswordMinLength) return "password_too_short";
  if (length > adminPasswordMaxLength) return "password_too_long";
  return "";
}

function adminPasswordMatches(admin, password) {
  const candidate = String(password || "");
  if (!admin) return false;
  return verifyAdminPassword(candidate, admin.passwordHash)
    || (admin.id === "bootstrap-admin" && safePasswordEqual(candidate));
}

function publicAdmin(admin) {
  if (!admin) return null;
  const { passwordHash: _passwordHash, ...safe } = admin;
  return safe;
}

async function saveAdminStore() {
  const temp = `${adminsFile}.tmp-${process.pid}`;
  await writeFile(temp, `${JSON.stringify(adminStore, null, 2)}\n`, { mode: 0o600 });
  await rename(temp, adminsFile);
}

async function ensureAdminStore() {
  if (existsSync(adminsFile)) {
    try {
      const parsed = JSON.parse(await readFile(adminsFile, "utf8"));
      if (Array.isArray(parsed.admins)) adminStore = parsed;
    } catch {
      throw new Error("runtime/admins.json is invalid");
    }
  }
  if (adminStore.admins.length) return;
  const now = new Date().toISOString();
  adminStore.admins = [{
    id: "bootstrap-admin",
    username: String(process.env.MANAGER_USERNAME || "admin").trim().toLowerCase(),
    displayName: "系统管理员",
    role: "owner",
    serviceIds: ["*"],
    disabled: false,
    passwordHash: hashAdminPassword(managerPassword),
    createdAt: now,
    updatedAt: now,
    lastLoginAt: null,
  }];
  await saveAdminStore();
}

function adminByUsername(username) {
  const normalized = String(username || "admin").trim().toLowerCase();
  return adminStore.admins.find((admin) => admin.username === normalized) || null;
}

function adminById(id) {
  return adminStore.admins.find((admin) => admin.id === id) || null;
}

async function authenticateAdmin(username, password) {
  const admin = adminByUsername(username);
  if (!admin || admin.disabled) return null;
  if (!adminPasswordMatches(admin, password)) return null;
  admin.lastLoginAt = new Date().toISOString();
  admin.updatedAt = admin.updatedAt || admin.lastLoginAt;
  await saveAdminStore();
  return admin;
}

function revokeSessionsForAdmin(sessionStore, adminId, exceptSessionId = "") {
  let revoked = 0;
  for (const [id, session] of sessionStore) {
    if (session?.adminId === adminId && id !== exceptSessionId) {
      sessionStore.delete(id);
      revoked += 1;
    }
  }
  return revoked;
}

function revokeAdminSessions(adminId, exceptSessionId = "") {
  return revokeSessionsForAdmin(sessions, adminId, exceptSessionId);
}

function canAccessService(admin, serviceId) {
  if (!admin || admin.disabled) return false;
  if (admin.role === "owner" || admin.serviceIds?.includes("*")) return true;
  return Array.isArray(admin.serviceIds) && admin.serviceIds.includes(serviceId);
}

function canOperate(admin) {
  return admin?.role === "owner" || admin?.role === "operator";
}

function pathWithinRoot(relativePathValue) {
  const resolved = path.resolve(rootDir, relativePathValue || ".");
  const relative = path.relative(rootDir, resolved);
  return !relative.startsWith("..") && !path.isAbsolute(relative);
}

function validateServiceManifest() {
  const ids = new Set();
  const pm2Names = new Set();
  const ports = new Set();
  const domains = new Set();
  for (const resource of [...services, ...infrastructure]) {
    if (!resource.id || ids.has(resource.id)) throw new Error(`invalid or duplicate service id: ${resource.id || "missing"}`);
    ids.add(resource.id);
    if (!pathWithinRoot(resource.directory)) throw new Error(`service directory escapes workspace: ${resource.id}`);
    if (resource.automaticOperations !== undefined && typeof resource.automaticOperations !== "boolean") {
      throw new Error(`automaticOperations must be boolean: ${resource.id}`);
    }
    if (resource.exposure === "restricted-pending-auth" && resource.automaticOperations !== false) {
      throw new Error(`restricted service must opt out of automatic operations: ${resource.id}`);
    }
    if (resource.accessRedirectHosts !== undefined
      && (!Array.isArray(resource.accessRedirectHosts)
        || resource.accessRedirectHosts.some((domain) => !/^[a-z0-9.-]+$/i.test(domain)))) {
      throw new Error(`invalid access redirect hosts: ${resource.id}`);
    }
    if (resource.kind === "application") {
      if (!resource.pm2Name || pm2Names.has(resource.pm2Name)) throw new Error(`invalid or duplicate PM2 name: ${resource.id}`);
      if (!Number.isInteger(resource.port) || resource.port < 1 || resource.port > 65535 || ports.has(resource.port)) {
        throw new Error(`invalid or duplicate service port: ${resource.id}`);
      }
      pm2Names.add(resource.pm2Name);
      ports.add(resource.port);
    }
    for (const domain of resource.domains || []) {
      if (!/^[a-z0-9.-]+$/i.test(domain)) throw new Error(`invalid domain in service manifest: ${resource.id}`);
      if (resource.kind === "application" && domains.has(domain)) throw new Error(`duplicate application domain: ${domain}`);
      if (resource.kind === "application") domains.add(domain);
    }
    for (const operation of [resource.build, resource.test].filter(Boolean)) {
      if (!pathWithinRoot(operation.cwd) || !Array.isArray(operation.command) || !operation.command.length) {
        throw new Error(`invalid operation configuration: ${resource.id}`);
      }
      if (operation.artifact && !pathWithinRoot(operation.artifact)) throw new Error(`invalid artifact path: ${resource.id}`);
    }
  }
  for (const resource of [...services, ...infrastructure]) {
    for (const dependency of resource.dependencies || []) {
      if (!ids.has(dependency)) throw new Error(`unknown dependency ${dependency} for ${resource.id}`);
    }
  }
}

function securityHeaders(res, options = {}) {
  res.setHeader("x-content-type-options", "nosniff");
  res.setHeader("x-frame-options", "DENY");
  res.setHeader("referrer-policy", "no-referrer");
  res.setHeader("permissions-policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("content-security-policy", "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  if (options.secure) res.setHeader("strict-transport-security", "max-age=31536000; includeSubDomains");
}

function json(res, status, body) {
  const text = JSON.stringify(body);
  securityHeaders(res);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(text),
    "cache-control": "no-store",
  });
  res.end(text);
}

function parseCookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        if (index < 1) return [part, ""];
        try {
          return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
        } catch {
          return [part.slice(0, index), ""];
        }
      }),
  );
}

function hashSession(value) {
  return createHmac("sha256", sessionSecret).update(value).digest("hex");
}

function makeSession(admin) {
  const now = Date.now();
  if (sessions.size > 1000) {
    for (const [id, session] of sessions) {
      if (session.expiresAt <= now) sessions.delete(id);
    }
    while (sessions.size > 5000) sessions.delete(sessions.keys().next().value);
  }
  const value = randomBytes(24).toString("hex");
  const token = `${value}.${hashSession(value)}`;
  sessions.set(value, { expiresAt: now + sessionTtlMs, adminId: admin.id });
  return token;
}

function sessionAdmin(token = "") {
  const [value, hash] = token.split(".");
  if (!value || !hash) return null;
  const expected = hashSession(value);
  if (hash.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(hash), Buffer.from(expected))) return null;
  const session = sessions.get(value);
  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(value);
    return null;
  }
  const admin = adminById(session.adminId);
  if (!admin || admin.disabled) {
    sessions.delete(value);
    return null;
  }
  return admin;
}

function validSession(token = "") {
  return Boolean(sessionAdmin(token));
}

function requestAdmin(req) {
  return sessionAdmin(parseCookies(req)[sessionCookie]);
}

function requestSessionId(req) {
  return String(parseCookies(req)[sessionCookie] || "").split(".")[0] || "";
}

async function readJson(req) {
  const contentLength = Number(req.headers["content-length"] || 0);
  if (Number.isFinite(contentLength) && contentLength > maxRequestBytes) {
    const error = new Error("request_too_large");
    error.statusCode = 413;
    throw error;
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxRequestBytes) {
      const error = new Error("request_too_large");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    const error = new Error("invalid_json");
    error.statusCode = 400;
    throw error;
  }
}

function redact(value = "") {
  let output = String(value);
  output = output.replace(
    /("[a-z0-9_.-]*(?:password|passwd|secret|token|key|cookie|database[_-]?url)"\s*:\s*)"(?:\\.|[^"\\])*"/gi,
    '$1"[REDACTED]"',
  );
  output = output.replace(
    /('[a-z0-9_.-]*(?:password|passwd|secret|token|key|cookie|database[_-]?url)'\s*:\s*)'(?:\\.|[^'\\])*'/gi,
    "$1'[REDACTED]'",
  );
  output = output.replace(
    /(["'](?:cookie|set-cookie)["']\s*:\s*["'])[^"']*(["'])/gi,
    "$1[REDACTED]$2",
  );
  output = output.replace(
    /(^|\r?\n)(\s*(?:authorization|cookie|set-cookie)\s*:\s*)[^\r\n]*/gi,
    "$1$2[REDACTED]",
  );
  for (const pattern of sensitivePatterns) {
    output = output.replace(pattern, (_match, prefix = "") => `${prefix}[REDACTED]`);
  }
  output = output.replace(/postgres(?:ql)?:\/\/[^\s'"`]+/gi, "[REDACTED_DATABASE_URL]");
  if (managerPassword) output = output.replaceAll(managerPassword, "[REDACTED]");
  if (sessionSecret) output = output.replaceAll(sessionSecret, "[REDACTED]");
  return output;
}

function normalizedIp(value) {
  const normalized = String(value || "").trim().replace(/^::ffff:/, "");
  return isIP(normalized) ? normalized : "unknown";
}

function socketIp(req) {
  return normalizedIp(req.socket.remoteAddress);
}

function clientIp(req) {
  const remoteIp = socketIp(req);
  if (!["127.0.0.1", "::1"].includes(remoteIp)) return remoteIp;

  const candidates = [
    req.headers["x-manager-client-ip"],
    req.headers["cf-connecting-ip"],
    String(req.headers["x-forwarded-for"] || "").split(",")[0],
    remoteIp,
  ];
  for (const candidate of candidates) {
    const normalized = normalizedIp(candidate);
    if (isIP(normalized)) return normalized;
  }
  return "unknown";
}

function loginRateStates(req) {
  const buckets = [{ key: `client:${clientIp(req)}`, limit: loginMaxFailures }];
  return {
    buckets: buckets.map((bucket) => ({ ...bucket, state: loginState(bucket.key) })),
  };
}

function clearLoginAttempts() {
  loginAttempts.clear();
}

function cloudflareVisitorScheme(req) {
  try {
    return JSON.parse(String(req.headers["cf-visitor"] || "{}")).scheme || null;
  } catch {
    return null;
  }
}

function secureRequest(req) {
  return req.socket.encrypted
    || cloudflareVisitorScheme(req) === "https"
    || String(req.headers["x-forwarded-proto"] || "").toLowerCase() === "https";
}

function cookieHeader(req, token, maxAgeSeconds) {
  const attributes = [
    `${sessionCookie}=${encodeURIComponent(token)}`,
    "HttpOnly",
    "SameSite=Strict",
    "Path=/",
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (secureRequest(req) || process.env.NODE_ENV === "production") attributes.push("Secure");
  return attributes.join("; ");
}

function safePasswordEqual(value) {
  const actual = Buffer.from(String(value || ""));
  const expected = Buffer.from(managerPassword);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

function loginState(ip) {
  const now = Date.now();
  if (loginAttempts.size > 1000) {
    for (const [key, value] of loginAttempts) {
      if (value.resetAt <= now) loginAttempts.delete(key);
    }
    while (loginAttempts.size > 5000) loginAttempts.delete(loginAttempts.keys().next().value);
  }
  const current = loginAttempts.get(ip);
  if (!current || current.resetAt <= now) {
    const next = { failures: 0, resetAt: now + loginWindowMs };
    loginAttempts.set(ip, next);
    return next;
  }
  return current;
}

async function withProbeSlot(runner) {
  if (activeProbeCount >= 8) {
    await new Promise((resolve) => probeWaiters.push(resolve));
  } else {
    activeProbeCount += 1;
  }
  try {
    return await runner();
  } finally {
    const next = probeWaiters.shift();
    if (next) next();
    else activeProbeCount -= 1;
  }
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  try {
    const parsed = new URL(origin);
    const forwardedHost = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
    const scheme = cloudflareVisitorScheme(req)
      || String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim()
      || (req.socket.encrypted ? "https" : "http");
    return parsed.host === forwardedHost && parsed.protocol === `${scheme}:`;
  } catch {
    return false;
  }
}

function commandEnvironment() {
  const childEnv = { ...process.env };
  delete childEnv.PORT;
  delete childEnv.HOST;
  delete childEnv.MANAGER_PASSWORD;
  delete childEnv.MANAGER_SESSION_SECRET;
  return {
    ...childEnv,
    PATH: [
      path.dirname(pm2),
      "/opt/homebrew/bin",
      "/usr/local/bin",
      "/usr/bin",
      "/bin",
      "/usr/sbin",
      "/sbin",
    ].join(":"),
  };
}

function runFile(command, args, options = {}) {
  return new Promise((resolve) => {
    execFile(command, args, {
      cwd: rootDir,
      timeout: commandTimeoutMs,
      maxBuffer: 1024 * 1024 * 4,
      env: commandEnvironment(),
      ...options,
    }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        code: error?.code ?? 0,
        signal: error?.signal ?? null,
        command: [command, ...args].join(" "),
        stdout: redact(stdout),
        stderr: redact(stderr),
      });
    });
  });
}

function relativePath(filePath) {
  return path.relative(rootDir, filePath) || ".";
}

function storageId(filePath) {
  return createHash("sha1").update(path.resolve(filePath)).digest("hex").slice(0, 16);
}

function isInsideRoot(filePath) {
  const resolved = path.resolve(filePath);
  return resolved === rootDir || resolved.startsWith(`${rootDir}${path.sep}`);
}

async function pathStat(filePath) {
  try {
    return await stat(filePath);
  } catch {
    return null;
  }
}

async function pathSize(filePath) {
  const info = await pathStat(filePath);
  if (!info) return 0;
  if (info.isFile()) return info.size;
  if (!info.isDirectory()) return 0;
  const du = await runFile("/usr/bin/du", ["-sk", filePath], { timeout: 30000 });
  const blocks = Number(du.stdout.trim().split(/\s+/)[0]);
  if (du.ok && Number.isFinite(blocks)) return blocks * 1024;
  let total = 0;
  const entries = await readdir(filePath, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    total += await pathSize(path.join(filePath, entry.name));
  }
  return total;
}

async function addStorageItem(items, filePath, type, label, options = {}) {
  if (!isInsideRoot(filePath) || !existsSync(filePath)) return;
  const info = await pathStat(filePath);
  if (!info) return;
  const ageDays = Math.floor((Date.now() - info.mtimeMs) / 86400000);
  items.push({
    id: storageId(filePath),
    type,
    label,
    path: relativePath(filePath),
    absolutePath: filePath,
    size: await pathSize(filePath),
    modifiedAt: info.mtime.toISOString(),
    ageDays,
    recommended: Boolean(options.recommended),
    removable: options.removable !== false,
    reason: options.reason || "",
  });
}

async function walkForStorage(startDir, visitor, depth = 0) {
  if (depth > 5 || !existsSync(startDir)) return;
  const entries = await readdir(startDir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    const filePath = path.join(startDir, entry.name);
    if (entry.isDirectory()) {
      await visitor(filePath, entry);
      if ([".git", "node_modules", "dist", "build"].includes(entry.name)) continue;
      await walkForStorage(filePath, visitor, depth + 1);
    } else {
      await visitor(filePath, entry);
    }
  }
}

async function storageItems() {
  const items = [];
  const knownLogDirs = [
    "project-manager/logs",
    ...(isInsideRoot(runtimeDir) ? [relativePath(runtimeDir)] : []),
    "bj-mobile-business-local/backend/logs",
    "qqt/backend/logs",
    "qqtlocal-rights/logs",
    "好礼多多本地版查询/logs",
  ];
  const knownDistDirs = projects
    .filter((project) => project.frontend?.dist)
    .map((project) => project.frontend.dist);
  const manualArtifacts = [
    "99plus权益领取.zip",
    "权益兑换页面.zip",
    "qqt/Scripts.zip",
    "cmcc-notice/查询实例.har",
    "咪咕视频年包合约/xyw.bj.10086.cn_06-10-2026-15-36-39.har",
    "咪咕视频年包合约/咪咕视频会员年报合约业务存档.zip",
  ];
  const dependencyDirs = [
    "免登录进入全球通/cookie-app/node_modules",
    "qqt/node_modules",
    "qqt/qqt-cmicrwx/node_modules",
    "bj-mobile-business-local/frontend/node_modules",
    "bj-mobile-business-local/backend/node_modules",
    "bj-mobile-business-local/node_modules",
    "bjcmcc-route-hub/backend/node_modules",
    "bjcmcc-route-hub/frontend/node_modules",
    "bjcmcc-route-hub/node_modules",
    "bj-cmcc-qy/frontend/node_modules",
    "bj-cmcc-qy/backend/node_modules",
    "cmcc-notice/node_modules",
  ];

  const rootEntries = await readdir(rootDir, { withFileTypes: true }).catch(() => []);
  for (const entry of rootEntries) {
    if (entry.isDirectory() && /\.local-backup-\d{8}-\d{6}$/.test(entry.name)) {
      const filePath = path.join(rootDir, entry.name);
      const info = await pathStat(filePath);
      const expired = info ? Date.now() - info.mtimeMs > retentionDays * 86400000 : false;
      await addStorageItem(items, filePath, "backup", "项目完整备份", {
        recommended: expired,
        reason: expired ? `超过 ${retentionDays} 天的项目备份` : "完整项目备份，建议确认后删除",
      });
    }
  }

  const nginxBackupDir = path.join(deployDir, "nginx-backups");
  if (existsSync(nginxBackupDir)) {
    const backups = await readdir(nginxBackupDir).catch(() => []);
    for (const name of backups) {
      const filePath = path.join(nginxBackupDir, name);
      const info = await pathStat(filePath);
      const expired = info ? Date.now() - info.mtimeMs > retentionDays * 86400000 : false;
      await addStorageItem(items, filePath, "backup", "Nginx 配置备份", {
        recommended: expired,
        reason: expired ? `超过 ${retentionDays} 天的配置备份` : "配置备份，建议确认后删除",
      });
    }
  }

  for (const logDirPath of knownLogDirs) {
    await addStorageItem(items, path.join(rootDir, logDirPath), "log", "日志目录", {
      recommended: false,
      removable: false,
      reason: "可进入列表按过期策略清理",
    });
  }

  await walkForStorage(rootDir, async (filePath, entry) => {
    const name = entry.name;
    if (name === ".DS_Store") {
      await addStorageItem(items, filePath, "cache", "macOS 元数据缓存", {
        recommended: true,
        reason: "系统自动生成，可安全清理",
      });
    } else if (entry.isDirectory() && ["__pycache__", ".pytest_cache", ".vite", ".cache"].includes(name)) {
      await addStorageItem(items, filePath, "cache", "开发缓存", {
        recommended: true,
        reason: "构建或测试缓存，可重新生成",
      });
    } else if (entry.isDirectory() && /\.bak-\d+$/.test(name)) {
      const locked = activeBuildBackups.has(path.resolve(filePath));
      const info = await pathStat(filePath);
      const ageDays = info ? Math.floor((Date.now() - info.mtimeMs) / 86400000) : 0;
      await addStorageItem(items, filePath, "backup", "构建临时备份", {
        recommended: !locked && ageDays >= retentionDays,
        removable: !locked,
        reason: locked
          ? "正在用于部署回滚，暂不可清理"
          : ageDays >= retentionDays
            ? `超过 ${retentionDays} 天的构建回滚备份`
            : "构建回滚备份，保留期内不建议删除",
      });
    }
  });

  for (const distDir of knownDistDirs) {
    await addStorageItem(items, path.join(rootDir, distDir), "artifact", "前端构建产物", {
      recommended: false,
      removable: false,
      reason: "线上静态资源可能正在使用，不纳入一键清理",
    });
  }

  for (const artifact of manualArtifacts) {
    await addStorageItem(items, path.join(rootDir, artifact), "artifact", "抓包/压缩归档", {
      recommended: false,
      reason: "可能是开发依据，建议人工确认",
    });
  }

  for (const dependencyDir of dependencyDirs) {
    await addStorageItem(items, path.join(rootDir, dependencyDir), "dependency", "依赖目录", {
      recommended: false,
      reason: "删除可释放空间，但下次运行或构建前需要重新安装依赖",
    });
  }

  return items.sort((a, b) => b.size - a.size);
}

async function deleteStorageItems(ids, filter = () => true) {
  const allItems = await storageItems();
  const idSet = new Set(ids);
  const selected = allItems.filter((item) => idSet.has(item.id) && item.removable && filter(item));
  const deleted = [];
  const failed = [];
  for (const item of selected) {
    const filePath = path.join(rootDir, item.path);
    if (!isInsideRoot(filePath)) {
      failed.push({ ...item, error: "unsafe_path" });
      continue;
    }
    try {
      await rm(filePath, { recursive: true, force: true });
      deleted.push(item);
    } catch (error) {
      failed.push({ ...item, error: error.message });
    }
  }
  return { deleted, failed, skipped: ids.length - selected.length };
}

async function clearRecommendedCache() {
  const allItems = await storageItems();
  const ids = allItems
    .filter((item) => item.type === "cache" && item.recommended && item.removable)
    .map((item) => item.id);
  return deleteStorageItems(ids, (item) => item.type === "cache" && item.recommended);
}

async function cleanupExpired() {
  const allItems = await storageItems();
  const expiredLogs = [];
  for (const item of allItems.filter((entry) => entry.type === "log")) {
    const dir = path.join(rootDir, item.path);
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const filePath = path.join(dir, entry.name);
      const info = await pathStat(filePath);
      if (info && Date.now() - info.mtimeMs > retentionDays * 86400000) {
        await addStorageItem(expiredLogs, filePath, "log", "过期日志文件", {
          recommended: true,
          reason: `超过 ${retentionDays} 天的日志文件`,
        });
      }
    }
  }
  const expiredIds = [
    ...allItems.filter((item) => item.type === "backup" && item.recommended).map((item) => item.id),
    ...expiredLogs.map((item) => item.id),
  ];
  const backupResult = await deleteStorageItems(expiredIds);
  const logDeleted = [];
  const logFailed = [];
  for (const item of expiredLogs) {
    try {
      await rm(item.absolutePath, { force: true });
      logDeleted.push(item);
    } catch (error) {
      logFailed.push({ ...item, error: error.message });
    }
  }
  return {
    deleted: [...backupResult.deleted, ...logDeleted],
    failed: [...backupResult.failed, ...logFailed],
    skipped: backupResult.skipped,
  };
}

function summarizeSteps(steps = []) {
  return steps.map((step, index) => {
    const result = step.result;
    const detailSource = result
      ? `${result.stderr || ""}${result.stderr && result.stdout ? "\n" : ""}${result.stdout || ""}`
      : step.detail || "";
    const detail = redact(detailSource)
      .trim()
      .slice(-1000);
    return {
      id: String(step.id || index + 1),
      name: String(step.name || step.title || `阶段 ${index + 1}`),
      status: result ? (result.ok ? "completed" : "failed") : String(step.status || "unknown"),
      detail,
      command: redact(result?.command || step.command || ""),
      startedAt: step.startedAt || null,
      finishedAt: step.finishedAt || null,
    };
  });
}

function operationResultSteps(action, result, startedAt, finishedAt) {
  const steps = summarizeSteps(result.steps || []);
  if (steps.length) return steps;
  return summarizeSteps([{
    id: "1",
    name: action || "执行命令",
    startedAt,
    finishedAt,
    result,
  }]);
}

function aggregateResult(command, steps) {
  const output = steps.map((step) => {
    const text = `${step.result.stdout || ""}${step.result.stderr ? `\n${step.result.stderr}` : ""}`.trim();
    return `===== ${step.title} =====\n${step.result.ok ? "OK" : "FAILED"}\n${step.result.command || ""}${text ? `\n${text}` : ""}`;
  }).join("\n\n");
  const failed = steps.find((step) => !step.result.ok);
  return {
    ok: !failed,
    code: failed?.result.code ?? 0,
    signal: failed?.result.signal ?? null,
    command,
    stdout: output,
    stderr: "",
    steps: summarizeSteps(steps),
  };
}

async function stopAllServices() {
  return runFile("/bin/bash", [path.join(deployDir, "stop-services.sh")], { timeout: restartTimeoutMs });
}

async function startAllServices() {
  return runFile("/bin/bash", [path.join(deployDir, "start-services.sh")], { timeout: restartTimeoutMs });
}

async function restartAllServices() {
  const steps = [];
  steps.push({ title: "停止业务服务", result: await stopAllServices() });
  steps.push({ title: "启动服务", result: await startAllServices() });
  return aggregateResult("restart-all: stop business services -> start business services", steps);
}

async function rotateOperationLog() {
  const info = await pathStat(operationLogFile);
  if (!info || info.size < 5 * 1024 * 1024) return;
  const suffix = new Date().toISOString().replaceAll(":", "-");
  await rename(operationLogFile, path.join(runtimeDir, `operations-${suffix}.jsonl`));
  const rotated = (await readdir(runtimeDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /^operations-.*\.jsonl$/.test(entry.name))
    .map((entry) => entry.name)
    .sort()
    .reverse();
  for (const name of rotated.slice(5)) await rm(path.join(runtimeDir, name), { force: true });
}

async function recordJob(action, target, result, startedAt, meta = {}) {
  const id = meta.operationId || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const finishedAt = new Date().toISOString();
  const entry = {
    id,
    action,
    target,
    ok: result.ok,
    code: result.code,
    startedAt,
    finishedAt,
    durationMs: Date.now() - new Date(startedAt).getTime(),
    command: redact(result.command || ""),
    steps: operationResultSteps(action, result, startedAt, finishedAt),
    meta: { ...meta, operationId: undefined },
    output: redact(`${result.stdout || ""}${result.stderr ? `\n${result.stderr}` : ""}`).trim().slice(-12000),
  };
  jobs.unshift(entry);
  jobs.splice(30);
  try {
    await rotateOperationLog();
    await writeFile(operationLogFile, `${JSON.stringify(entry)}\n`, { flag: "a", mode: 0o600 });
  } catch (error) {
    console.error(`operation audit write failed: ${redact(error.message)}`);
  }
  return entry;
}

function operationBusyError(operation = activeOperation) {
  const error = new Error("operation_busy");
  error.statusCode = 409;
  error.operation = operationView(operation);
  return error;
}

async function readOperationLock() {
  try {
    return JSON.parse(await readFile(operationLockFile, "utf8"));
  } catch {
    return null;
  }
}

async function currentOperationState() {
  return activeOperation || await readOperationLock();
}

function processIsRunning(pid) {
  if (!Number.isInteger(pid) || pid < 1) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code !== "ESRCH";
  }
}

function operationLockPayload(operation, extra = {}) {
  return {
    id: operation.id,
    action: operation.action,
    target: operation.target,
    status: operation.status || "running",
    stage: operation.stage,
    startedAt: operation.startedAt,
    progress: operation.progress || 0,
    steps: summarizeSteps(operation.steps || []),
    pid: process.pid,
    managerPort: port,
    ...extra,
  };
}

async function persistOperationLockSnapshot(snapshot) {
  const current = await readOperationLock();
  if (current?.id !== snapshot.id) return false;
  const updateFile = `${operationLockFile}.update-${process.pid}-${randomBytes(4).toString("hex")}`;
  try {
    await writeFile(updateFile, JSON.stringify(snapshot), { mode: 0o600 });
    const latest = await readOperationLock();
    if (latest?.id !== snapshot.id) return false;
    await rename(updateFile, operationLockFile);
    return true;
  } finally {
    await rm(updateFile, { force: true });
  }
}

async function removeStaleRecoveryLock() {
  const info = await pathStat(operationRecoveryLockFile);
  if (!info) return true;
  let recovery = null;
  try {
    recovery = JSON.parse(await readFile(operationRecoveryLockFile, "utf8"));
  } catch {
    // A newly-created recovery lock may still be receiving its owner metadata.
  }
  const ownerRunning = processIsRunning(Number(recovery?.pid));
  const createdAt = new Date(recovery?.createdAt || info.mtime).getTime();
  const ageMs = Number.isFinite(createdAt) ? Date.now() - createdAt : Number.POSITIVE_INFINITY;
  if (ownerRunning && ageMs <= 60_000) return false;
  const quarantine = `${operationRecoveryLockFile}.stale-${process.pid}-${randomBytes(4).toString("hex")}`;
  try {
    await rename(operationRecoveryLockFile, quarantine);
    await rm(quarantine, { force: true });
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return true;
    throw error;
  }
}

async function acquireOperationLock(operation) {
  if (activeOperation) throw operationBusyError();
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const handle = await open(operationLockFile, "wx", 0o600);
      try {
        await handle.writeFile(JSON.stringify(operationLockPayload(operation)));
      } finally {
        await handle.close();
      }
      return;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      let recoveryHandle;
      try {
        recoveryHandle = await open(operationRecoveryLockFile, "wx", 0o600);
      } catch (recoveryLockError) {
        if (recoveryLockError.code !== "EEXIST") throw recoveryLockError;
        await removeStaleRecoveryLock();
        await new Promise((resolve) => setTimeout(resolve, 25));
        continue;
      }
      try {
        await recoveryHandle.writeFile(JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() }));
        const current = await readOperationLock();
        const lockInfo = current ? null : await pathStat(operationLockFile);
        const incompleteLockIsStale = !current && (!lockInfo || Date.now() - lockInfo.mtimeMs > 5000);
        const ownerPid = Number(current?.workerPid || current?.pid);
        const stale = incompleteLockIsStale
          || Boolean(current && !processIsRunning(ownerPid));
        if (!stale) throw operationBusyError(current);
        const quarantine = `${operationLockFile}.stale-${process.pid}-${randomBytes(4).toString("hex")}`;
        try {
          await rename(operationLockFile, quarantine);
          await rm(quarantine, { force: true });
        } catch (recoveryError) {
          if (recoveryError.code !== "ENOENT") throw recoveryError;
        }
      } finally {
        try {
          await recoveryHandle.close();
        } finally {
          await rm(operationRecoveryLockFile, { force: true });
        }
      }
    }
  }
  throw operationBusyError(await readOperationLock());
}

async function releaseOperationLock(operationId) {
  const current = await readOperationLock();
  if (current?.id === operationId) await rm(operationLockFile, { force: true });
}

async function runAction(action, target, runner, meta = {}, options = {}) {
  const lock = options.lock !== false;
  const startedAt = new Date().toISOString();
  const operationId = `${Date.now()}-${randomBytes(5).toString("hex")}`;
  const operation = {
    id: operationId,
    action,
    target,
    status: "running",
    stage: "executing",
    startedAt,
  };
  if (lock) {
    await acquireOperationLock(operation);
    activeOperation = operation;
  }
  try {
    let result;
    try {
      result = await runner();
    } catch (error) {
      result = {
        ok: false,
        code: 1,
        signal: null,
        command: action,
        stdout: "",
        stderr: redact(error.message),
      };
    }
    await recordJob(action, target, result, startedAt, { ...meta, operationId });
    return result;
  } finally {
    if (lock) {
      if (activeOperation?.id === operationId) activeOperation = null;
      await releaseOperationLock(operationId);
    }
  }
}

async function readOperationLogFile(filePath, limit) {
  if (!existsSync(filePath)) return [];
  const handle = await open(filePath, "r");
  let text = "";
  try {
    const info = await handle.stat();
    const length = Math.min(info.size, 512 * 1024);
    const buffer = Buffer.alloc(length);
    await handle.read(buffer, 0, length, Math.max(0, info.size - length));
    text = buffer.toString("utf8");
    if (length < info.size) text = text.slice(text.indexOf("\n") + 1);
  } finally {
    await handle.close();
  }
  return text
    .trim()
    .split("\n")
    .filter(Boolean)
    .slice(-limit)
    .reverse()
    .map((line) => {
      try {
        const entry = JSON.parse(line);
        return { ...entry, command: redact(entry.command || ""), output: redact(entry.output || "") };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

async function readOperationLogs(limit = 80) {
  const [runtimeEntries, legacyEntries] = await Promise.all([
    readOperationLogFile(operationLogFile, limit),
    operationLogFile === legacyOperationLogFile ? [] : readOperationLogFile(legacyOperationLogFile, limit),
  ]);
  const seen = new Set();
  return [...jobs, ...runtimeEntries, ...legacyEntries]
    .filter((entry) => entry?.id && !seen.has(entry.id) && seen.add(entry.id))
    .sort((a, b) => new Date(b.startedAt || b.finishedAt || 0) - new Date(a.startedAt || a.finishedAt || 0))
    .slice(0, limit);
}

function publicStorageItem(item) {
  const { absolutePath, ...publicItem } = item;
  return publicItem;
}

function storageSummary(items) {
  return items.reduce((summary, item) => {
    summary.totalSize += item.size;
    summary.count += 1;
    summary.byType[item.type] = summary.byType[item.type] || { count: 0, size: 0 };
    summary.byType[item.type].count += 1;
    summary.byType[item.type].size += item.size;
    if (item.recommended && item.removable) {
      summary.recommended.count += 1;
      summary.recommended.size += item.size;
    }
    return summary;
  }, { count: 0, totalSize: 0, recommended: { count: 0, size: 0 }, byType: {} });
}

function cleanupResult(command, result) {
  const deletedSize = result.deleted.reduce((sum, item) => sum + item.size, 0);
  return {
    ok: result.failed.length === 0,
    code: result.failed.length ? 1 : 0,
    signal: null,
    command,
    stdout: [
      `deleted: ${result.deleted.length}`,
      `freed: ${deletedSize} bytes`,
      `skipped: ${result.skipped}`,
      ...result.deleted.map((item) => `- ${item.path}`),
    ].join("\n"),
    stderr: result.failed.map((item) => `${item.path}: ${item.error}`).join("\n"),
    data: {
      deleted: result.deleted.map(publicStorageItem),
      failed: result.failed.map(publicStorageItem),
      skipped: result.skipped,
      freedBytes: deletedSize,
    },
  };
}

async function pm2Jlist() {
  const result = await runFile(pm2, ["jlist"]);
  if (!result.ok) return [];
  try {
    return JSON.parse(result.stdout);
  } catch {
    return [];
  }
}

async function portDetails(targetPort) {
  const result = await runFile("/usr/sbin/lsof", ["-nP", `-iTCP:${targetPort}`, "-sTCP:LISTEN", "-Fpc"]);
  const pids = [];
  const commands = [];
  for (const line of result.stdout.split(/\r?\n/)) {
    if (line.startsWith("p") && /^p\d+$/.test(line)) pids.push(Number(line.slice(1)));
    if (line.startsWith("c") && line.length > 1) commands.push(line.slice(1));
  }
  return {
    open: result.ok && pids.length > 0,
    pids: [...new Set(pids)],
    commands: [...new Set(commands)],
  };
}

async function portOpen(targetPort) {
  return (await portDetails(targetPort)).open;
}

async function processBelongsTo(listenerPid, pm2Pid) {
  if (!Number.isInteger(listenerPid) || !Number.isInteger(pm2Pid)) return false;
  let current = listenerPid;
  for (let depth = 0; depth < 16 && current > 1; depth += 1) {
    if (current === pm2Pid) return true;
    const parent = await runFile("/bin/ps", ["-o", "ppid=", "-p", String(current)], { timeout: 3000 });
    if (!parent.ok) return false;
    const next = Number(parent.stdout.trim());
    if (!Number.isInteger(next) || next < 1 || next === current) return false;
    current = next;
  }
  return false;
}

function parseHttpProbe(result) {
  const [codeText = "000", redirectLocation = ""] = String(result.stdout || "").trim().split("\t", 2);
  return {
    code: Number(codeText) || 0,
    redirectLocation: String(redirectLocation || "").trim(),
  };
}

async function httpProbe(domain, healthPath = "/") {
  return withProbeSlot(async () => {
    const normalizedPath = healthPath.startsWith("/") ? healthPath : `/${healthPath}`;
    const args = [
      "-s",
      "-o",
      "/dev/null",
      "-w",
      "%{http_code}\t%{redirect_url}",
      "--max-time",
      "5",
      `https://${domain}${normalizedPath}`,
    ];
    let result = await runFile("/usr/bin/curl", args);
    if (result.ok) return parseHttpProbe(result);

    const lookup = await runFile("/usr/bin/dig", ["+short", "@1.1.1.1", "A", domain], { timeout: 8000 });
    const address = lookup.stdout.split(/\s+/).find((value) => isIP(value) === 4);
    if (!address) return { code: 0, redirectLocation: "" };
    result = await runFile("/usr/bin/curl", [
      ...args.slice(0, -1),
      "--resolve",
      `${domain}:443:${address}`,
      args.at(-1),
    ]);
    return result.ok ? parseHttpProbe(result) : { code: 0, redirectLocation: "" };
  });
}

async function httpCode(domain, healthPath = "/") {
  return String((await httpProbe(domain, healthPath)).code || 0).padStart(3, "0");
}

function trustedAuthRedirect(location, allowedHosts = []) {
  try {
    const target = new URL(location);
    if (target.protocol !== "https:") return false;
    return allowedHosts.includes(target.hostname)
      && target.pathname.startsWith("/cdn-cgi/access/");
  } catch {
    return false;
  }
}

function restrictedAccessState(probes, allowedHosts = []) {
  if (probes.some((probe) => probe.code >= 200 && probe.code < 300)) return "exposed";
  const strongBlocks = probes.filter((probe) => [401, 403].includes(probe.code)
    || ((probe.code >= 300 && probe.code < 400) && trustedAuthRedirect(probe.redirectLocation, allowedHosts)));
  const weakClosed = probes.filter((probe) => [0, 404].includes(probe.code));
  if (strongBlocks.length && strongBlocks.length + weakClosed.length === probes.length) return "protected";
  if (weakClosed.length === probes.length) return "closed";
  return "unknown";
}

async function probeUrl(url, allowedStatus = [200]) {
  return withProbeSlot(async () => {
    const startedAt = Date.now();
    const result = await runFile("/usr/bin/curl", [
      "-sS",
      "-o",
      "/dev/null",
      "-w",
      "%{http_code}",
      "--max-time",
      "5",
      url,
    ], { timeout: 8000 });
    const code = result.ok ? Number(result.stdout.trim()) : 0;
    return {
      ok: result.ok && allowedStatus.includes(code),
      code,
      latencyMs: Date.now() - startedAt,
      error: result.ok ? null : redact(result.stderr || "request_failed").slice(-500),
    };
  });
}

function healthResult(service, processInfo, port, application, publicChecks, artifact) {
  const errors = [];
  const warnings = [];
  if (processInfo.status !== "online") errors.push({ layer: "process", message: `PM2 ${processInfo.status}` });
  if (!port.open) errors.push({ layer: "port", message: `端口 ${service.port} 未监听` });
  if (port.open && processInfo.pid && port.pids.length === 1 && !port.ownerMatches) {
    errors.push({ layer: "port", message: "监听进程不属于 PM2 进程树" });
  }
  if (port.pids.length > 1) errors.push({ layer: "port", message: `端口存在 ${port.pids.length} 个监听进程` });
  if (!application.ok) errors.push({ layer: "application", message: `本机健康检查返回 ${application.code || "无响应"}` });
  for (const check of publicChecks) {
    if (service.exposure === "restricted-pending-auth") {
      if (check.accessState === "exposed") {
        errors.push({ layer: "security", message: `${check.domain} 未经访问控制即返回 200` });
      } else if (check.accessState === "unknown") {
        errors.push({ layer: "security", message: `${check.domain} 的访问控制状态无法确认` });
      } else if (check.accessState === "protected") {
        warnings.push({ layer: "security", message: `${check.domain} 已由可信鉴权入口阻断` });
      } else {
        warnings.push({ layer: "security", message: `${check.domain} 公网路由关闭，尚未完成鉴权验收` });
      }
      continue;
    }
    if (!check.ok) errors.push({ layer: "public", message: `${check.domain} 返回 ${check.code || "无响应"}` });
  }
  if (artifact && !artifact.exists) warnings.push({ layer: "artifact", message: "构建产物缺失" });
  return {
    status: errors.length ? "unavailable" : warnings.length ? "degraded" : "healthy",
    errors,
    warnings,
  };
}

async function serviceStatus(service, pm2ByName) {
  const pm = pm2ByName.get(service.pm2Name);
  const allowedStatus = service.allowedStatus?.length ? service.allowedStatus : [200];
  const [port, application, publicChecks] = await Promise.all([
    portDetails(service.port),
    probeUrl(`http://127.0.0.1:${service.port}${service.healthPath || "/"}`, allowedStatus),
    Promise.all((service.domains || []).map(async (domain) => {
      const startedAt = Date.now();
      const restricted = service.exposure === "restricted-pending-auth";
      const paths = restricted
        ? [...new Set(["/", service.healthPath || "/"])]
        : [service.healthPath || "/"];
      const probes = await Promise.all(paths.map(async (probePath) => {
        const result = await httpProbe(domain, probePath);
        return {
          path: probePath,
          code: result.code,
          redirectTrusted: trustedAuthRedirect(result.redirectLocation, service.accessRedirectHosts || []),
          redirectLocation: result.redirectLocation,
        };
      }));
      const accessState = restricted ? restrictedAccessState(probes, service.accessRedirectHosts || []) : null;
      const primary = probes.find((probe) => probe.path === (service.healthPath || "/")) || probes[0];
      const ok = restricted
        ? ["protected", "closed"].includes(accessState)
        : allowedStatus.includes(primary.code);
      return {
        domain,
        code: primary.code,
        ok,
        state: restricted ? (ok ? "warn" : "fail") : (ok ? "ok" : "fail"),
        accessState,
        probes: probes.map(({ redirectLocation, ...probe }) => probe),
        latencyMs: Date.now() - startedAt,
      };
    })),
  ]);
  const processInfo = {
    status: pm?.pm2_env?.status || "unknown",
    pid: Number(pm?.pid) || null,
    uptime: pm?.pm2_env?.pm_uptime ?? null,
    restarts: pm?.pm2_env?.restart_time ?? 0,
    cpu: pm?.monit?.cpu ?? 0,
    memory: pm?.monit?.memory ?? 0,
  };
  const ownerMatches = port.pids.length === 1 && processInfo.pid
    ? await processBelongsTo(port.pids[0], processInfo.pid)
    : false;
  const ownedPort = { ...port, ownerMatches };
  let artifact = null;
  if (service.build?.artifact) {
    const artifactPath = path.join(rootDir, service.build.artifact);
    const info = await pathStat(artifactPath);
    artifact = {
      path: service.build.artifact,
      exists: Boolean(info),
      modifiedAt: info?.mtime?.toISOString() || null,
    };
  }
  const health = healthResult(service, processInfo, ownedPort, application, publicChecks, artifact);
  return {
    ...service,
    domain: service.domains?.[0] || (service.publicUrl ? new URL(service.publicUrl).host + new URL(service.publicUrl).pathname : null),
    url: service.publicUrl || (service.domains?.[0] ? `https://${service.domains[0]}/` : null),
    status: health.status,
    issues: [...health.errors, ...health.warnings],
    process: processInfo,
    port: { number: service.port, ...ownedPort },
    application,
    public: publicChecks,
    artifact,
    operation: activeOperation?.target === service.id ? activeOperation : null,
  };
}

async function serviceStatuses(force = false) {
  if (!force && Date.now() - serviceStatusCache.createdAt < 5000 && serviceStatusCache.services.length) {
    const currentOperation = await currentOperationState();
    return serviceStatusCache.services.map((service) => ({
      ...service,
      operation: currentOperation?.target === service.id ? operationView(currentOperation) : null,
    }));
  }
  if (!serviceStatusRefreshPromise) {
    serviceStatusRefreshPromise = (async () => {
      const pm2List = await pm2Jlist();
      const byName = new Map(pm2List.map((item) => [item.name, item]));
      const refreshed = await Promise.all(services.map((service) => serviceStatus(service, byName)));
      serviceStatusCache = { createdAt: Date.now(), services: refreshed };
      return refreshed;
    })().finally(() => {
      serviceStatusRefreshPromise = null;
    });
  }
  const statuses = await serviceStatusRefreshPromise;
  const currentOperation = await currentOperationState();
  return statuses.map((service) => ({
    ...service,
    operation: currentOperation?.target === service.id ? operationView(currentOperation) : null,
  }));
}

async function projectCheck(project) {
  const service = serviceById.get(project.id);
  let open = false;
  let code = "000";
  for (let attempt = 0; attempt < 5; attempt += 1) {
    [open, code] = await Promise.all([
      portOpen(project.backend.port),
      httpCode(project.domain, service?.healthPath || "/"),
    ]);
    if (open && (service?.allowedStatus || [200]).includes(Number(code))) break;
    await new Promise((resolve) => setTimeout(resolve, 750));
  }
  const ok = open && (service?.allowedStatus || [200]).includes(Number(code));
  return {
    ok,
    code: ok ? 0 : 1,
    signal: null,
    stdout: `port:${open ? "open" : "closed"}\nhttps:${code}`,
    stderr: "",
  };
}

async function statusPayload() {
  const pm2List = await pm2Jlist();
  const byName = new Map(pm2List.map((item) => [item.name, item]));
  const statuses = await Promise.all(projects.map(async (project) => {
    const pm = byName.get(project.backend.pm2Name);
    const portListening = await portOpen(project.backend.port);
    return {
      ...project,
      status: pm?.pm2_env?.status || "unknown",
      restarts: pm?.pm2_env?.restart_time ?? 0,
      uptime: pm?.pm2_env?.pm_uptime ?? null,
      cpu: pm?.monit?.cpu ?? 0,
      memory: pm?.monit?.memory ?? 0,
      portListening,
      frontendConfigured: Boolean(project.frontend),
      distExists: project.frontend ? existsSync(path.join(rootDir, project.frontend.dist)) : null,
      url: project.publicUrl || `https://${project.domain}/`,
    };
  }));
  return { groups: config.groups, projects: statuses, jobs: await readOperationLogs(30), manager: { port, host } };
}

function operationView(operation) {
  if (!operation) return null;
  return {
    id: operation.id,
    action: operation.action,
    target: operation.target,
    status: operation.status || (operation.ok === true ? "completed" : operation.ok === false ? "failed" : "unknown"),
    stage: operation.stage || (operation.ok === true ? "completed" : operation.ok === false ? "failed" : "unknown"),
    startedAt: operation.startedAt,
    finishedAt: operation.finishedAt || null,
    durationMs: operation.durationMs ?? (Date.now() - new Date(operation.startedAt).getTime()),
    progress: operation.progress ?? (operation.status === "completed" ? 100 : 0),
    ok: operation.ok ?? null,
    command: redact(operation.command || ""),
    output: redact(operation.output || ""),
    steps: (operation.steps || []).map((step) => ({
      id: String(step.id || ""),
      name: String(step.name || "执行阶段"),
      status: String(step.status || "unknown"),
      detail: redact(step.detail || ""),
      command: redact(step.command || ""),
      startedAt: step.startedAt || null,
      finishedAt: step.finishedAt || null,
    })),
    meta: operation.meta || {},
  };
}

async function overviewPayload(admin = null) {
  const [allStatuses, allRecentOperations, currentOperation] = await Promise.all([
    serviceStatuses(),
    readOperationLogs(12),
    currentOperationState(),
  ]);
  const statuses = admin ? allStatuses.filter((service) => canAccessService(admin, service.id)) : allStatuses;
  const recentOperations = admin && admin.role !== "owner"
    ? allRecentOperations.filter((operation) => {
        const ids = Array.isArray(operation.serviceIds) && operation.serviceIds.length
          ? operation.serviceIds
          : String(operation.target || "").split(",").filter(Boolean);
        return ids.length > 0 && ids.every((id) => canAccessService(admin, id));
      })
    : allRecentOperations;
  const visibleCurrentOperation = !admin || admin.role === "owner" || !currentOperation
    ? currentOperation
    : recentOperations.find((operation) => operation.id === currentOperation.id) || null;
  const counts = statuses.reduce((summary, service) => {
    summary.total += 1;
    summary[service.status] = (summary[service.status] || 0) + 1;
    return summary;
  }, { total: 0, healthy: 0, degraded: 0, unavailable: 0, unknown: 0 });
  const events = statuses
    .flatMap((service) => service.issues.map((issue) => ({
      id: `${service.id}-${issue.layer}`,
      serviceId: service.id,
      serviceName: service.name,
      status: service.status,
      layer: issue.layer,
      message: issue.message,
      priority: service.status === "unavailable" ? 1 : 2,
    })))
    .sort((a, b) => a.priority - b.priority || a.serviceName.localeCompare(b.serviceName, "zh-CN"));
  return {
    generatedAt: new Date().toISOString(),
    counts,
    activeOperation: operationView(visibleCurrentOperation),
    events,
    services: statuses,
    recentOperations: recentOperations.map(operationView),
  };
}

async function infrastructureStatuses() {
  const [pm2List, nginx, postgres, cloudflared, postgresReady, nginxRoute] = await Promise.all([
    pm2Jlist(),
    portDetails(80),
    portDetails(55432),
    runFile("/bin/launchctl", ["print", "system/com.cloudflare.cloudflared"], { timeout: 5000 }),
    runFile("/usr/local/bin/docker", ["exec", "cmcc-cookie-app-postgres", "pg_isready", "-U", "cmcc_user"], { timeout: 5000 }),
    runFile("/usr/bin/curl", ["-s", "-o", "/dev/null", "-w", "%{http_code}", "--max-time", "3", "-H", "Host: project.1008086.xyz", "http://127.0.0.1/api/health"], { timeout: 5000 }),
  ]);
  const pm2ByName = new Map(pm2List.map((item) => [item.name, item]));
  return infrastructure.map((resource) => {
    let status = "unknown";
    let detail = "尚未配置检查器";
    if (resource.id === "pm2") {
      status = pm2List.length ? "healthy" : "unavailable";
      detail = `${pm2List.length} 个进程已登记`;
    } else if (resource.id === "nginx") {
      const routeCode = Number(nginxRoute.stdout.trim()) || 0;
      status = routeCode === 200 ? "healthy" : "unavailable";
      detail = routeCode === 200
        ? `Project Ops 本机路由 HTTP 200${nginx.open ? "；80 端口监听" : ""}`
        : `Project Ops 本机路由 HTTP ${routeCode || "000"}`;
    } else if (resource.id === "postgres") {
      status = postgres.open && postgresReady.ok ? "healthy" : "unavailable";
      detail = postgresReady.ok ? "pg_isready 通过；55432 端口监听" : "PostgreSQL pg_isready 未通过";
    } else if (resource.pm2Name) {
      const pm = pm2ByName.get(resource.pm2Name);
      status = pm?.pm2_env?.status === "online" ? "healthy" : "unavailable";
      detail = pm ? `PM2 ${pm.pm2_env?.status || "unknown"}` : "PM2 未登记";
    } else if (resource.runtime === "launchd") {
      status = cloudflared.ok ? "healthy" : "unavailable";
      detail = status === "healthy" ? "launchd 服务已加载" : "launchd 服务未加载";
    }
    return { ...resource, status, detail };
  });
}

async function inventoryPayload() {
  const [statuses, platform, pm2List] = await Promise.all([
    serviceStatuses(),
    infrastructureStatuses(),
    pm2Jlist(),
  ]);
  const drift = [];
  const managedPm2 = new Set([...services, ...infrastructure].map((item) => item.pm2Name).filter(Boolean));
  for (const service of statuses) {
    if (!existsSync(path.join(rootDir, service.directory))) {
      drift.push({ type: "directory_missing", severity: "error", serviceId: service.id, message: `目录不存在：${service.directory}` });
    }
    if (service.process.status === "unknown") {
      drift.push({ type: "pm2_missing", severity: "error", serviceId: service.id, message: `PM2 未登记 ${service.pm2Name}` });
    }
    if (service.port.pids.length > 1) {
      drift.push({ type: "duplicate_listener", severity: "warning", serviceId: service.id, message: `${service.port.number} 端口存在多个监听进程` });
    }
    if (service.exposure === "restricted-pending-auth") {
      drift.push({ type: "public_access_blocked", severity: "warning", serviceId: service.id, message: "待补访问控制，暂不应开放公网路由" });
    }
  }
  for (const item of pm2List) {
    if (!managedPm2.has(item.name)) {
      drift.push({ type: "unmanaged_pm2", severity: "info", serviceId: null, message: `PM2 进程未纳入清单：${item.name}` });
    }
  }
  const envInfo = await pathStat(path.join(__dirname, ".env"));
  return {
    schemaVersion: serviceManifest.schemaVersion,
    generatedAt: new Date().toISOString(),
    services: statuses,
    infrastructure: platform,
    drift,
    security: {
      defaultPasswordDisabled: true,
      sessionsExpire: true,
      loginRateLimit: true,
      sameSite: "Strict",
      envMode: envInfo ? (envInfo.mode & 0o777).toString(8).padStart(3, "0") : null,
      runningAsRoot: typeof process.getuid === "function" ? process.getuid() === 0 : null,
      credentialRotationRequired: !Number.isFinite(Date.parse(process.env.MANAGER_CREDENTIALS_ROTATED_AT || "")),
    },
  };
}

function commandResult(command, ok, stdout = "", stderr = "") {
  return {
    ok,
    code: ok ? 0 : 1,
    signal: null,
    command,
    stdout: redact(stdout),
    stderr: redact(stderr),
  };
}

async function startService(service) {
  const pm2List = await pm2Jlist();
  const existing = pm2List.find((item) => item.name === service.pm2Name);
  if (existing?.pm2_env?.status === "online") {
    return commandResult(`pm2 start ${service.pm2Name}`, true, `${service.name} 已在线，无需重复启动`);
  }
  if (existing) return runFile(pm2, ["start", service.pm2Name, "--update-env"]);
  return runFile(pm2, ["startOrRestart", ecosystemFile, "--only", service.pm2Name, "--update-env"]);
}

async function restartService(service) {
  if (service.id === "project") {
    setTimeout(() => {
      execFile(pm2, ["restart", service.pm2Name, "--update-env"], { env: process.env }, () => {});
    }, 750);
    return commandResult(`pm2 restart ${service.pm2Name} --update-env`, true, "管理台将在响应完成后安全重启");
  }
  const pm2List = await pm2Jlist();
  if (!pm2List.some((item) => item.name === service.pm2Name)) return startService(service);
  return runFile(pm2, ["restart", service.pm2Name, "--update-env"]);
}

async function runConfiguredOperation(operation, label) {
  if (!operation) return commandResult(label, false, "", "该服务未配置此能力");
  const cwd = path.join(rootDir, operation.cwd);
  if (!pathWithinRoot(operation.cwd) || !existsSync(cwd)) {
    return commandResult(label, false, "", `工作目录不存在：${operation.cwd}`);
  }
  const [command, ...args] = operation.command;
  return runFile(command, args, { cwd, timeout: 1000 * 60 * 12 });
}

async function buildService(service) {
  if (!service.build?.artifact) return commandResult("build", false, "", "该服务未配置构建产物");
  const artifactDir = path.dirname(service.build.artifact);
  const staged = await stageFrontend({
    id: service.id,
    name: service.name,
    frontend: {
      cwd: service.build.cwd,
      dist: artifactDir,
      build: service.build.command,
    },
  });
  if (staged.result.ok && staged.context) {
    staged.result.stdout = `${staged.result.stdout}\nvalidated only: 线上产物未切换`;
    await rm(staged.context.staging, { recursive: true, force: true });
  }
  return staged.result;
}

async function checkService(service) {
  const pm2List = await pm2Jlist();
  const status = await serviceStatus(service, new Map(pm2List.map((item) => [item.name, item])));
  const output = [
    `status:${status.status}`,
    `pm2:${status.process.status}`,
    `port:${status.port.open ? "open" : "closed"} pids=${status.port.pids.join(",") || "none"}`,
    `application:${status.application.code || "000"}`,
    ...status.public.map((item) => `https://${item.domain}${service.healthPath || "/"}:${item.code || "000"}`),
    ...status.issues.map((item) => `${item.layer}:${item.message}`),
  ].join("\n");
  return { ...commandResult(`check ${service.id}`, status.status !== "unavailable", output), data: status };
}

async function waitForServiceCheck(service, attempts = 6) {
  let result = await checkService(service);
  for (let attempt = 1; !result.ok && attempt < attempts; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = await checkService(service);
  }
  return result;
}

async function verifyServiceStopped(service) {
  const pm2List = await pm2Jlist();
  const pm = pm2List.find((item) => item.name === service.pm2Name);
  const port = await portDetails(service.port);
  const ok = pm?.pm2_env?.status !== "online" && !port.open;
  return commandResult(
    `verify stopped ${service.id}`,
    ok,
    `pm2:${pm?.pm2_env?.status || "missing"}\nport:${port.open ? "open" : "closed"}`,
    ok ? "" : "目标 PM2 已停止，但服务端口仍在监听",
  );
}

async function recoverDeployment(service, context, steps, setStage) {
  setStage("rolling-back");
  const rollback = await rollbackFrontend(context);
  steps.push({ title: `回滚 ${service.name}`, result: rollback });
  if (!rollback.ok) return;

  setStage("restoring-process");
  const restoreRestart = await restartService(service);
  steps.push({ title: `恢复 ${service.name} 进程`, result: restoreRestart });
  if (!restoreRestart.ok || service.id === "project") return;

  setStage("verifying-recovery");
  const recoveryCheck = await waitForServiceCheck(service, 30);
  steps.push({ title: `验证 ${service.name} 恢复状态`, result: recoveryCheck });
  if (!recoveryCheck.ok || !context.backupCreated) return;

  const validation = await validateFrontendArtifact(context.dist);
  const restoredArtifact = commandResult(
    `validate restored frontend ${service.id}`,
    validation.ok,
    validation.ok ? `restored: ${relativePath(context.dist)}` : "",
    validation.errors.join("\n"),
  );
  steps.push({ title: `校验 ${service.name} 旧产物`, result: restoredArtifact });
  if (!restoredArtifact.ok) return;

  const restoredDelivery = await checkFrontendDelivery(service, { assetPaths: validation.assetPaths });
  steps.push({ title: `验证 ${service.name} 恢复入口与资源`, result: restoredDelivery });
}

async function deployService(service, setStage) {
  const steps = [];
  if (service.test?.requiredForDeploy) {
    setStage("testing");
    const test = await runConfiguredOperation(service.test, `test ${service.id}`);
    steps.push({ title: `测试 ${service.name}`, result: test });
    if (!test.ok) return aggregateResult(`deploy ${service.id}`, steps);
  }
  setStage("building");
  const artifactDir = path.dirname(service.build.artifact);
  const staged = await stageFrontend({
    id: service.id,
    name: service.name,
    frontend: { cwd: service.build.cwd, dist: artifactDir, build: service.build.command },
  });
  steps.push({ title: `隔离构建 ${service.name}`, result: staged.result });
  if (!staged.result.ok) return aggregateResult(`deploy ${service.id}`, steps);
  setStage("activating");
  const activation = await activateStagedFrontend(staged.context);
  steps.push({ title: `切换 ${service.name} 产物`, result: activation });
  if (!activation.ok) {
    await rm(staged.context.staging, { recursive: true, force: true });
    return aggregateResult(`deploy ${service.id}`, steps);
  }
  setStage("restarting");
  const restart = await restartService(service);
  steps.push({ title: `重启 ${service.name}`, result: restart });
  if (!restart.ok) {
    await recoverDeployment(service, staged.context, steps, setStage);
    return aggregateResult(`deploy ${service.id}`, steps);
  }
  setStage("verifying");
  let check = await waitForServiceCheck(service);
  steps.push({ title: `验证 ${service.name}`, result: check });
  if (check.ok) {
    setStage("verifying-frontend");
    const frontendCheck = await checkFrontendDelivery(service, staged.context);
    steps.push({ title: `验证 ${service.name} 前端入口与资源`, result: frontendCheck });
    if (!frontendCheck.ok) check = frontendCheck;
  }
  if (!check.ok) {
    await recoverDeployment(service, staged.context, steps, setStage);
    return aggregateResult(`deploy ${service.id}`, steps);
  }
  await finalizeFrontend(staged.context);
  return aggregateResult(`deploy ${service.id}`, steps);
}

async function rebuildService(service, setStage = () => {}) {
  if (service.build?.artifact && service.capabilities.includes("deploy")) {
    return deployService(service, setStage);
  }
  const steps = [];
  if (service.test?.requiredForDeploy) {
    setStage("testing");
    const test = await runConfiguredOperation(service.test, `test ${service.id}`);
    steps.push({ title: `测试 ${service.name}`, result: test });
    if (!test.ok) return aggregateResult(`rebuild ${service.id}`, steps);
  }
  setStage("restarting");
  const restart = await restartService(service);
  steps.push({ title: `重启 ${service.name}`, result: restart });
  if (!restart.ok || (service.id === "project" && process.env.PROJECT_MANAGER_NO_LISTEN !== "1")) {
    return aggregateResult(`rebuild ${service.id}`, steps);
  }
  setStage("verifying");
  const check = await waitForServiceCheck(service, 30);
  steps.push({ title: `验证 ${service.name}`, result: check });
  return aggregateResult(`rebuild ${service.id}`, steps);
}

async function executeServiceAction(service, action, setStage = () => {}) {
  if (!service.capabilities.includes(action)) return commandResult(action, false, "", "service_capability_denied");
  if (service.protected && action === "stop") return commandResult(action, false, "", "protected_service");
  if (action === "start") {
    setStage("starting");
    const start = await startService(service);
    if (!start.ok) return start;
    setStage("verifying");
    const check = await waitForServiceCheck(service);
    return aggregateResult(`start ${service.id}`, [
      { title: `启动 ${service.name}`, result: start },
      { title: `验证 ${service.name}`, result: check },
    ]);
  }
  if (action === "stop") {
    setStage("stopping");
    const stop = await runFile(pm2, ["stop", service.pm2Name]);
    if (!stop.ok) return stop;
    setStage("verifying");
    await new Promise((resolve) => setTimeout(resolve, 500));
    const verify = await verifyServiceStopped(service);
    return aggregateResult(`stop ${service.id}`, [
      { title: `停止 ${service.name}`, result: stop },
      { title: `验证 ${service.name}`, result: verify },
    ]);
  }
  if (action === "restart") {
    setStage("restarting");
    const restart = await restartService(service);
    if (!restart.ok || service.id === "project") return restart;
    setStage("verifying");
    const check = await waitForServiceCheck(service);
    return aggregateResult(`restart ${service.id}`, [
      { title: `重启 ${service.name}`, result: restart },
      { title: `验证 ${service.name}`, result: check },
    ]);
  }
  if (action === "build") {
    setStage("building");
    return buildService(service);
  }
  if (action === "test") {
    setStage("testing");
    return runConfiguredOperation(service.test, `test ${service.id}`);
  }
  if (action === "deploy") return deployService(service, setStage);
  if (action === "check") {
    setStage("checking");
    return checkService(service);
  }
  return commandResult(action, false, "", "unknown_action");
}

const operationStageLabels = {
  queued: "等待执行",
  executing: "开始执行",
  testing: "运行测试",
  building: "隔离构建",
  activating: "切换产物",
  restarting: "重启进程",
  starting: "启动进程",
  stopping: "停止进程",
  checking: "运行检测",
  verifying: "应用与公网后检",
  "verifying-frontend": "入口与静态资源后检",
  "rolling-back": "回滚旧产物",
  "restoring-process": "恢复旧版本进程",
  "verifying-recovery": "验证旧版本恢复状态",
};

function advanceOperationStage(operation, stage) {
  const now = new Date().toISOString();
  const current = operation.steps?.at(-1);
  if (current?.status === "running") {
    current.status = "completed";
    current.finishedAt = now;
  }
  operation.stage = stage;
  operation.steps ||= [];
  operation.steps.push({
    id: `${operation.id}-${operation.steps.length + 1}`,
    name: operationStageLabels[stage] || stage,
    status: "running",
    detail: "",
    command: "",
    startedAt: now,
    finishedAt: null,
  });
  operation.progress = Math.min(90, 10 + operation.steps.length * 12);
}

function createOperationStageUpdater(operation, persist = persistOperationLockSnapshot) {
  let pending = Promise.resolve();
  const sync = () => {
    const snapshot = operationLockPayload(operation);
    pending = pending
      .then(() => persist(snapshot))
      .catch((error) => {
        console.error(`operation stage sync failed: ${redact(error.message)}`);
      });
    return pending;
  };
  const setStage = (stage) => {
    advanceOperationStage(operation, stage);
    return sync();
  };
  setStage.sync = sync;
  setStage.flush = () => pending;
  return setStage;
}

function finishOperationStages(operation, result) {
  const finishedAt = new Date().toISOString();
  if (result.steps?.length) {
    operation.steps = summarizeSteps(result.steps);
  } else {
    const current = operation.steps?.at(-1);
    if (current) {
      current.status = result.ok ? "completed" : "failed";
      current.finishedAt = finishedAt;
      current.command = redact(result.command || "");
      current.detail = redact(`${result.stdout || ""}${result.stderr ? `\n${result.stderr}` : ""}`).trim().slice(-1000);
    } else {
      operation.steps = summarizeSteps([{ title: operationStageLabels[operation.stage] || operation.action, result }]);
    }
    result.steps = summarizeSteps(operation.steps);
  }
  operation.progress = 100;
}

async function startAsyncOperation(action, target, runner, meta = {}) {
  const operation = {
    id: `${Date.now()}-${randomBytes(5).toString("hex")}`,
    action,
    target,
    status: "running",
    stage: "queued",
    startedAt: new Date().toISOString(),
    meta,
    output: "",
    progress: 0,
    steps: [],
  };
  await acquireOperationLock(operation);
  activeOperation = operation;
  const setStage = createOperationStageUpdater(operation);
  setImmediate(async () => {
    let result;
    try {
      await setStage("executing");
      result = await runner(setStage);
    } catch (error) {
      result = commandResult(action, false, "", error.message);
    }
    await setStage.flush();
    finishOperationStages(operation, result);
    operation.status = result.ok ? "completed" : "failed";
    operation.stage = result.ok ? "completed" : "failed";
    operation.finishedAt = new Date().toISOString();
    operation.durationMs = Date.now() - new Date(operation.startedAt).getTime();
    operation.ok = result.ok;
    operation.command = result.command;
    operation.output = `${result.stdout || ""}${result.stderr ? `\n${result.stderr}` : ""}`.trim().slice(-12000);
    operation.steps = result.steps || [];
    await setStage.sync();
    try {
      await recordJob(action, target, result, operation.startedAt, { ...meta, operationId: operation.id });
    } catch (error) {
      console.error(`operation completion failed: ${redact(error.message)}`);
    } finally {
      serviceStatusCache = { createdAt: 0, services: [] };
      if (activeOperation?.id === operation.id) activeOperation = null;
      await releaseOperationLock(operation.id).catch((error) => {
        console.error(`operation lock release failed: ${redact(error.message)}`);
      });
    }
  });
  return operationView(operation);
}

async function startManagerRestartOperation(service, meta = {}) {
  const operation = {
    id: `${Date.now()}-${randomBytes(5).toString("hex")}`,
    action: "restart",
    target: service.id,
    status: "running",
    stage: "testing",
    startedAt: new Date().toISOString(),
    meta,
    output: "",
    progress: 0,
    steps: [],
  };
  advanceOperationStage(operation, "testing");
  await acquireOperationLock(operation);
  activeOperation = operation;

  if (service.test?.requiredForDeploy) {
    const test = await runConfiguredOperation(service.test, `test ${service.id}`);
    if (!test.ok) {
      finishOperationStages(operation, test);
      operation.status = "failed";
      operation.stage = "failed";
      operation.finishedAt = new Date().toISOString();
      operation.durationMs = Date.now() - new Date(operation.startedAt).getTime();
      operation.ok = false;
      operation.command = test.command;
      operation.output = `${test.stdout || ""}${test.stderr ? `\n${test.stderr}` : ""}`.trim().slice(-12000);
      await recordJob("restart", service.id, test, operation.startedAt, { ...meta, operationId: operation.id });
      activeOperation = null;
      await releaseOperationLock(operation.id);
      return operationView(operation);
    }
  }

  advanceOperationStage(operation, "restarting");
  const workerPayload = {
    operationId: operation.id,
    startedAt: operation.startedAt,
    pm2,
    pm2Name: service.pm2Name,
    port: service.port,
    lockFile: operationLockFile,
    logFile: operationLogFile,
  };
  let child;
  try {
    child = spawn(process.execPath, [path.join(__dirname, "self-restart-worker.js"), JSON.stringify(workerPayload)], {
      detached: true,
      stdio: "ignore",
      env: commandEnvironment(),
    });
    await new Promise((resolve, reject) => {
      child.once("spawn", resolve);
      child.once("error", reject);
    });
    child.unref();
    operation.workerPid = child.pid;
    await writeFile(operationLockFile, JSON.stringify(operationLockPayload(operation, { workerPid: child.pid })), { mode: 0o600 });
  } catch (error) {
    const result = commandResult("restart project-manager", false, "", error.message);
    finishOperationStages(operation, result);
    await recordJob("restart", service.id, result, operation.startedAt, { ...meta, operationId: operation.id });
    activeOperation = null;
    await releaseOperationLock(operation.id);
    throw error;
  }

  const monitor = setInterval(async () => {
    const current = await readOperationLock();
    if (current?.id === operation.id) return;
    if (activeOperation?.id === operation.id) activeOperation = null;
    clearInterval(monitor);
  }, 1000);
  monitor.unref();
  return operationView(operation);
}

function requireAuth(req, res) {
  if (validSession(parseCookies(req)[sessionCookie])) return true;
  json(res, 401, { error: "unauthorized" });
  return false;
}

function serveStatic(req, res) {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    json(res, 400, { error: "malformed_url" });
    return;
  }
  let requestPath = urlPath;
  if (["/", "/login"].includes(urlPath)) requestPath = "/v2.html";
  if (urlPath === "/home") requestPath = "/index.html";
  if (urlPath === "/v2" || urlPath.startsWith("/v2/")) requestPath = "/v2.html";
  const filePath = path.resolve(publicDir, requestPath.replace(/^\/+/, ""));
  const relative = path.relative(publicDir, filePath);
  if (relative.startsWith("..") || path.isAbsolute(relative) || !existsSync(filePath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  const ext = path.extname(filePath);
  const type = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".svg": "image/svg+xml",
  }[ext] || "application/octet-stream";
  res.writeHead(200, { "content-type": type, "cache-control": "no-store" });
  createReadStream(filePath)
    .on("error", () => res.destroy())
    .pipe(res);
}

async function handleApi(req, res) {
  let requestUrl;
  let pathname;
  try {
    requestUrl = new URL(req.url, "http://localhost");
    pathname = requestUrl.pathname;
  } catch {
    return json(res, 400, { error: "malformed_url" });
  }

  if (req.method === "GET" && pathname === "/api/health") {
    return json(res, 200, { ok: true, service: "project-manager", version: "2.0.0", uptimeSeconds: Math.floor(process.uptime()) });
  }

  if (req.method === "POST" && pathname === "/api/login") {
    if (!sameOrigin(req)) return json(res, 403, { error: "origin_not_allowed" });
    const rateLimit = loginRateStates(req);
    const blocked = rateLimit.buckets.filter((bucket) => bucket.state.failures >= bucket.limit);
    if (blocked.length) {
      const retryAfter = Math.max(1, ...blocked.map((bucket) => Math.ceil((bucket.state.resetAt - Date.now()) / 1000)));
      res.setHeader("retry-after", String(retryAfter));
      return json(res, 429, { error: "login_rate_limited", retryAfter });
    }
    const body = await readJson(req);
    const admin = await authenticateAdmin(body.username || "admin", body.password);
    if (!admin) {
      for (const bucket of rateLimit.buckets) bucket.state.failures += 1;
      const clientBucket = rateLimit.buckets.find((bucket) => bucket.key.startsWith("client:"));
      return json(res, 403, {
        error: "bad_password",
        attemptsRemaining: Math.max(0, clientBucket.limit - clientBucket.state.failures),
      });
    }
    for (const bucket of rateLimit.buckets) loginAttempts.delete(bucket.key);
    res.writeHead(204, {
      "set-cookie": cookieHeader(req, makeSession(admin), Math.floor(sessionTtlMs / 1000)),
      "cache-control": "no-store",
    });
    return res.end();
  }

  if (!requireAuth(req, res)) return;
  const currentAdmin = requestAdmin(req);
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && !sameOrigin(req)) {
    return json(res, 403, { error: "origin_not_allowed" });
  }

  if (req.method === "GET" && pathname === "/api/v2/session") {
    return json(res, 200, { admin: publicAdmin(currentAdmin) });
  }

  if (req.method === "POST" && pathname === "/api/v2/account/password") {
    const body = await readJson(req);
    const currentPassword = String(body.currentPassword || "");
    const nextPassword = String(body.newPassword || "");
    const policyError = adminPasswordPolicyError(nextPassword);
    if (policyError) return json(res, 400, { error: policyError });

    const rateKey = `password-change:${currentAdmin.id}:${clientIp(req)}`;
    const rateState = loginState(rateKey);
    if (rateState.failures >= loginMaxFailures) {
      const retryAfter = Math.max(1, Math.ceil((rateState.resetAt - Date.now()) / 1000));
      res.setHeader("retry-after", String(retryAfter));
      return json(res, 429, { error: "password_change_rate_limited", retryAfter });
    }
    if (!adminPasswordMatches(currentAdmin, currentPassword)) {
      rateState.failures += 1;
      return json(res, 403, {
        error: "current_password_incorrect",
        attemptsRemaining: Math.max(0, loginMaxFailures - rateState.failures),
      });
    }
    if (adminPasswordMatches(currentAdmin, nextPassword)) {
      return json(res, 409, { error: "password_unchanged" });
    }

    currentAdmin.passwordHash = hashAdminPassword(nextPassword);
    currentAdmin.passwordChangedAt = new Date().toISOString();
    currentAdmin.updatedAt = currentAdmin.passwordChangedAt;
    await saveAdminStore();
    const revokedSessions = revokeAdminSessions(currentAdmin.id, requestSessionId(req));
    loginAttempts.delete(rateKey);
    return json(res, 200, {
      admin: publicAdmin(currentAdmin),
      revokedSessions,
    });
  }

  if (req.method === "GET" && pathname === "/api/v2/admins") {
    if (currentAdmin.role !== "owner") return json(res, 403, { error: "owner_required" });
    return json(res, 200, {
      admins: adminStore.admins.map(publicAdmin),
      services: services.map((service) => ({ id: service.id, name: service.name })),
    });
  }

  if (req.method === "POST" && pathname === "/api/v2/admins") {
    if (currentAdmin.role !== "owner") return json(res, 403, { error: "owner_required" });
    const body = await readJson(req);
    const username = String(body.username || "").trim().toLowerCase();
    const password = String(body.password || "");
    const role = String(body.role || "viewer");
    if (!/^[a-z0-9][a-z0-9._-]{2,31}$/.test(username)) return json(res, 400, { error: "invalid_username" });
    if (adminByUsername(username)) return json(res, 409, { error: "username_exists" });
    const passwordError = adminPasswordPolicyError(password);
    if (passwordError) return json(res, 400, { error: passwordError });
    if (!["owner", "operator", "viewer"].includes(role)) return json(res, 400, { error: "invalid_role" });
    const requestedIds = Array.isArray(body.serviceIds) ? [...new Set(body.serviceIds.map(String))] : [];
    if (requestedIds.some((id) => !serviceById.has(id))) return json(res, 400, { error: "invalid_service_scope" });
    const now = new Date().toISOString();
    const admin = {
      id: randomBytes(12).toString("hex"),
      username,
      displayName: String(body.displayName || username).trim().slice(0, 60),
      role,
      serviceIds: role === "owner" ? ["*"] : requestedIds,
      disabled: false,
      passwordHash: hashAdminPassword(password),
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
    };
    adminStore.admins.push(admin);
    await saveAdminStore();
    return json(res, 201, { admin: publicAdmin(admin) });
  }

  const adminMatch = pathname.match(/^\/api\/v2\/admins\/([^/]+)$/);
  if (req.method === "PATCH" && adminMatch) {
    if (currentAdmin.role !== "owner") return json(res, 403, { error: "owner_required" });
    const admin = adminById(adminMatch[1]);
    if (!admin) return json(res, 404, { error: "admin_not_found" });
    const body = await readJson(req);
    if (body.password !== undefined) {
      if (admin.id === currentAdmin.id) return json(res, 400, { error: "use_password_change_endpoint" });
      const password = String(body.password);
      const passwordError = adminPasswordPolicyError(password);
      if (passwordError) return json(res, 400, { error: passwordError });
      admin.passwordHash = hashAdminPassword(password);
      admin.passwordChangedAt = new Date().toISOString();
      revokeAdminSessions(admin.id);
    }
    if (body.displayName !== undefined) admin.displayName = String(body.displayName).trim().slice(0, 60) || admin.username;
    if (body.role !== undefined) {
      if (!["owner", "operator", "viewer"].includes(body.role)) return json(res, 400, { error: "invalid_role" });
      const enabledOwners = adminStore.admins.filter((item) => item.role === "owner" && !item.disabled);
      if (admin.role === "owner" && body.role !== "owner" && enabledOwners.length <= 1) return json(res, 409, { error: "last_owner_required" });
      admin.role = body.role;
    }
    if (body.serviceIds !== undefined) {
      const requestedIds = Array.isArray(body.serviceIds) ? [...new Set(body.serviceIds.map(String))] : [];
      if (requestedIds.some((id) => !serviceById.has(id))) return json(res, 400, { error: "invalid_service_scope" });
      admin.serviceIds = admin.role === "owner" ? ["*"] : requestedIds;
    }
    if (body.disabled !== undefined) {
      if (admin.id === currentAdmin.id && body.disabled) return json(res, 409, { error: "cannot_disable_self" });
      const enabledOwners = adminStore.admins.filter((item) => item.role === "owner" && !item.disabled);
      if (admin.role === "owner" && body.disabled && enabledOwners.length <= 1) return json(res, 409, { error: "last_owner_required" });
      admin.disabled = Boolean(body.disabled);
      if (admin.disabled) revokeAdminSessions(admin.id);
    }
    admin.updatedAt = new Date().toISOString();
    await saveAdminStore();
    return json(res, 200, { admin: publicAdmin(admin) });
  }

  if (req.method === "DELETE" && adminMatch) {
    if (currentAdmin.role !== "owner") return json(res, 403, { error: "owner_required" });
    const admin = adminById(adminMatch[1]);
    if (!admin) return json(res, 404, { error: "admin_not_found" });
    if (admin.id === currentAdmin.id) return json(res, 409, { error: "cannot_delete_self" });
    const enabledOwners = adminStore.admins.filter((item) => item.role === "owner" && !item.disabled);
    if (admin.role === "owner" && enabledOwners.length <= 1) return json(res, 409, { error: "last_owner_required" });
    adminStore.admins = adminStore.admins.filter((item) => item.id !== admin.id);
    revokeAdminSessions(admin.id);
    await saveAdminStore();
    return json(res, 200, { deleted: admin.id });
  }

  if (req.method === "GET" && pathname === "/api/v2/overview") {
    return json(res, 200, await overviewPayload(currentAdmin));
  }

  if (req.method === "GET" && pathname === "/api/v2/services") {
    const visible = (await serviceStatuses()).filter((service) => canAccessService(currentAdmin, service.id));
    return json(res, 200, { generatedAt: new Date().toISOString(), services: visible });
  }

  const v2ServiceLogsMatch = pathname.match(/^\/api\/v2\/services\/([^/]+)\/logs$/);
  if (req.method === "GET" && v2ServiceLogsMatch) {
    const service = serviceById.get(v2ServiceLogsMatch[1]);
    if (!service) return json(res, 404, { error: "unknown_service" });
    if (!canAccessService(currentAdmin, service.id)) return json(res, 403, { error: "service_scope_denied" });
    const result = await runFile(pm2, ["logs", service.pm2Name, "--lines", "120", "--nostream", "--raw"]);
    return json(res, result.ok ? 200 : 500, { serviceId: service.id, source: "pm2", output: redact(`${result.stdout || ""}${result.stderr ? `\n${result.stderr}` : ""}`) });
  }

  const v2ServiceMatch = pathname.match(/^\/api\/v2\/services\/([^/]+)$/);
  if (req.method === "GET" && v2ServiceMatch) {
    const service = serviceById.get(v2ServiceMatch[1]);
    if (!service) return json(res, 404, { error: "unknown_service" });
    if (!canAccessService(currentAdmin, service.id)) return json(res, 403, { error: "service_scope_denied" });
    const status = (await serviceStatuses()).find((item) => item.id === service.id);
    const operations = (await readOperationLogs(40)).filter((item) => item.target === service.id).slice(0, 12);
    return json(res, 200, { service: status, operations });
  }

  const v2ServiceActionMatch = pathname.match(/^\/api\/v2\/services\/([^/]+)\/actions$/);
  if (req.method === "POST" && v2ServiceActionMatch) {
    const service = serviceById.get(v2ServiceActionMatch[1]);
    if (!service) return json(res, 404, { error: "unknown_service" });
    if (!canOperate(currentAdmin)) return json(res, 403, { error: "operator_required" });
    if (!canAccessService(currentAdmin, service.id)) return json(res, 403, { error: "service_scope_denied" });
    const body = await readJson(req);
    const action = String(body.action || "");
    if (!["start", "stop", "restart", "build", "test", "deploy", "check"].includes(action)) {
      return json(res, 400, { error: "unknown_action" });
    }
    if (!service.capabilities.includes(action)) return json(res, 403, { error: "service_capability_denied" });
    const operationMeta = {
      serviceName: service.name,
      ip: clientIp(req),
    };
    const operation = service.id === "project" && action === "restart"
      ? await startManagerRestartOperation(service, operationMeta)
      : await startAsyncOperation(action, service.id, (setStage) => executeServiceAction(service, action, setStage), operationMeta);
    return json(res, 202, { operation });
  }

  if (req.method === "POST" && pathname === "/api/v2/actions") {
    const body = await readJson(req);
    const action = String(body.action || "");
    if (["storage-clear-cache", "storage-cleanup-expired", "storage-delete"].includes(action)) {
      if (currentAdmin.role !== "owner") return json(res, 403, { error: "owner_required" });
      const ids = Array.isArray(body.ids) ? body.ids.map(String) : [];
      if (action === "storage-delete" && !ids.length) return json(res, 400, { error: "storage_selection_required" });
      const operation = await startAsyncOperation(action, "storage", async (setStage) => {
        setStage("cleaning");
        if (action === "storage-clear-cache") return cleanupResult("clear-cache", await clearRecommendedCache());
        if (action === "storage-cleanup-expired") return cleanupResult("cleanup-expired", await cleanupExpired());
        return cleanupResult("storage-delete", await deleteStorageItems(ids));
      }, { ip: clientIp(req), ids });
      return json(res, 202, { operation });
    }
    const globalRunners = {
      "start-all": startAllServices,
      "stop-all": stopAllServices,
      "restart-all": restartAllServices,
    };
    if (globalRunners[action]) {
      if (currentAdmin.role !== "owner") return json(res, 403, { error: "owner_required" });
      const operation = await startAsyncOperation(action, "business-services", async (setStage) => {
        setStage(action.replace("-all", "ing"));
        return globalRunners[action]();
      }, { ip: clientIp(req), scope: "business-only" });
      return json(res, 202, { operation });
    }
    const serviceIds = Array.isArray(body.serviceIds) ? [...new Set(body.serviceIds.map(String))] : [];
    if (!["start", "stop", "restart", "check"].includes(action) || !serviceIds.length) {
      return json(res, 400, { error: "invalid_bulk_action" });
    }
    const selected = serviceIds.map((id) => serviceById.get(id));
    if (selected.some((service) => !service)) return json(res, 404, { error: "unknown_service" });
    if (!canOperate(currentAdmin)) return json(res, 403, { error: "operator_required" });
    if (selected.some((service) => !canAccessService(currentAdmin, service.id))) return json(res, 403, { error: "service_scope_denied" });
    if (action !== "check" && selected.some((service) => service.protected)) {
      return json(res, 403, { error: "protected_service_requires_individual_action" });
    }
    if (action !== "check" && selected.some((service) => service.automaticOperations === false)) {
      return json(res, 403, { error: "manual_service_requires_individual_action" });
    }
    if (selected.some((service) => !service.capabilities.includes(action))) {
      return json(res, 403, { error: "service_capability_denied" });
    }
    const operation = await startAsyncOperation(action, serviceIds.join(","), async (setStage) => {
      const steps = [];
      for (const service of selected) {
        setStage(`${action}:${service.id}`);
        const result = await executeServiceAction(service, action, setStage);
        steps.push({ title: `${action} ${service.name}`, result });
        if (!result.ok && action !== "check") break;
      }
      return aggregateResult(`${action} ${serviceIds.join(",")}`, steps);
    }, { ip: clientIp(req), serviceIds });
    return json(res, 202, { operation });
  }

  if (req.method === "GET" && pathname === "/api/v2/operations") {
    const [history, currentOperation] = await Promise.all([
      readOperationLogs(100),
      currentOperationState(),
    ]);
    return json(res, 200, { active: operationView(currentOperation), operations: history.map(operationView) });
  }

  const v2OperationMatch = pathname.match(/^\/api\/v2\/operations\/([^/]+)$/);
  if (req.method === "GET" && v2OperationMatch) {
    const currentOperation = await currentOperationState();
    if (currentOperation?.id === v2OperationMatch[1]) return json(res, 200, { operation: operationView(currentOperation) });
    const operation = (await readOperationLogs(200)).find((item) => item.id === v2OperationMatch[1]);
    if (!operation) return json(res, 404, { error: "unknown_operation" });
    return json(res, 200, { operation: operationView(operation) });
  }

  if (req.method === "GET" && pathname === "/api/v2/inventory") {
    return json(res, 200, await inventoryPayload());
  }

  if (req.method === "GET" && pathname === "/api/v2/logs") {
    const serviceId = requestUrl.searchParams.get("serviceId");
    const service = serviceId ? serviceById.get(serviceId) : null;
    if (serviceId && !service) return json(res, 404, { error: "unknown_service" });
    const history = await readOperationLogs(120);
    const relatedHistory = serviceId
      ? history.filter((entry) => entry.target === serviceId
        || entry.meta?.serviceId === serviceId
        || entry.meta?.serviceIds?.includes?.(serviceId))
      : history;
    const operationEntries = relatedHistory.slice(0, serviceId ? 20 : 120).map((entry) => ({
      id: `operation-${entry.id}`,
      timestamp: entry.finishedAt || entry.startedAt,
      source: "operations",
      serviceId: serviceById.has(entry.target) ? entry.target : (entry.meta?.serviceIds?.[0] || ""),
      level: entry.ok === false ? "error" : "info",
      message: `${entry.action} · ${entry.ok === false ? "失败" : "完成"}${entry.output ? `\n${entry.output.split(/\r?\n/).slice(-4).join("\n")}` : ""}`,
    }));
    if (!service) return json(res, 200, { updatedAt: new Date().toISOString(), entries: operationEntries });
    const result = await runFile(pm2, ["logs", service.pm2Name, "--lines", "120", "--nostream", "--raw"]);
    const pm2Entry = {
      id: `pm2-${service.id}`,
      timestamp: new Date().toISOString(),
      source: "pm2",
      serviceId: service.id,
      level: result.ok ? "info" : "error",
      message: redact(`${result.stdout || ""}${result.stderr ? `\n${result.stderr}` : ""}`),
    };
    return json(res, 200, {
      updatedAt: new Date().toISOString(),
      entries: [...operationEntries, pm2Entry],
      pm2Ok: result.ok,
    });
  }

  if (req.method === "GET" && pathname === "/api/v2/storage") {
    const [items, currentOperation] = await Promise.all([storageItems(), currentOperationState()]);
    return json(res, 200, {
      retentionDays,
      summary: storageSummary(items),
      items: items.map(publicStorageItem),
      operationLocked: Boolean(currentOperation),
    });
  }

  if (req.method === "GET" && pathname === "/api/status") {
    return json(res, 200, await statusPayload());
  }

  if (req.method === "GET" && pathname === "/api/logs") {
    return json(res, 200, { logs: await readOperationLogs(120) });
  }

  if (req.method === "GET" && pathname === "/api/storage") {
    const items = await storageItems();
    return json(res, 200, {
      retentionDays,
      summary: storageSummary(items),
      items: items.map(publicStorageItem),
    });
  }

  if (req.method === "POST" && pathname === "/api/storage/delete") {
    const body = await readJson(req);
    const ids = Array.isArray(body.ids) ? body.ids : [];
    const result = await runAction("storage-delete", "selected", async () =>
      cleanupResult("storage-delete", await deleteStorageItems(ids)), { ids });
    return json(res, result.ok ? 200 : 500, result);
  }

  if (req.method === "POST" && pathname === "/api/storage/clear-cache") {
    const result = await runAction("clear-cache", "recommended-cache", async () =>
      cleanupResult("clear-cache", await clearRecommendedCache()));
    return json(res, result.ok ? 200 : 500, result);
  }

  if (req.method === "POST" && pathname === "/api/storage/cleanup-expired") {
    const result = await runAction("cleanup-expired", `older-than-${retentionDays}-days`, async () =>
      cleanupResult("cleanup-expired", await cleanupExpired()));
    return json(res, result.ok ? 200 : 500, result);
  }

  if (req.method === "POST" && pathname === "/api/logout") {
    const [sessionId] = (parseCookies(req)[sessionCookie] || "").split(".");
    if (sessionId) sessions.delete(sessionId);
    res.writeHead(204, {
      "set-cookie": cookieHeader(req, "", 0),
      "cache-control": "no-store",
    });
    return res.end();
  }

  const logsMatch = pathname.match(/^\/api\/projects\/([^/]+)\/logs$/);
  if (req.method === "GET" && logsMatch) {
    const project = projectById.get(logsMatch[1]);
    if (!project) return json(res, 404, { error: "unknown_project" });
    if (!canAccessService(currentAdmin, project.id)) return json(res, 403, { error: "service_scope_denied" });
    const result = await runFile(pm2, ["logs", project.backend.pm2Name, "--lines", "120", "--nostream", "--raw"]);
    return json(res, result.ok ? 200 : 500, result);
  }

  const match = pathname.match(/^\/api\/projects\/([^/]+)\/(start|stop|restart|rebuild|check|backend-start|backend-stop|backend-restart|frontend-update)$/);
  if (req.method === "POST" && match) {
    const [, projectId, action] = match;
    const project = projectById.get(projectId);
    if (!project) return json(res, 404, { error: "unknown_project" });
    if (!canOperate(currentAdmin)) return json(res, 403, { error: "operator_required" });
    if (!canAccessService(currentAdmin, project.id)) return json(res, 403, { error: "service_scope_denied" });
    const result = await runAction(action, project.id, () => {
      const service = serviceById.get(project.id);
      if (action === "rebuild") {
        return service ? rebuildService(service) : commandResult(action, false, "", "unknown_service");
      }
      if (action === "frontend-update") {
        return service?.build?.artifact
          ? deployService(service, () => {})
          : commandResult(action, false, "", "该服务没有独立前端产物");
      }
      if (action === "check") {
        return service ? checkService(service) : projectCheck(project);
      }
      const pm2Action = action.replace("backend-", "");
      if (service && ["start", "stop", "restart"].includes(pm2Action)) return executeServiceAction(service, pm2Action);
      return runFile(pm2, [pm2Action, project.backend.pm2Name]);
    }, { project: project.name, domain: project.domain });
    return json(res, result.ok ? 200 : 500, result);
  }

  if (req.method === "POST" && pathname === "/api/actions/start-all") {
    if (currentAdmin.role !== "owner") return json(res, 403, { error: "owner_required" });
    const result = await runAction("start-all", "all", startAllServices);
    return json(res, result.ok ? 200 : 500, result);
  }

  if (req.method === "POST" && pathname === "/api/actions/stop-all") {
    if (currentAdmin.role !== "owner") return json(res, 403, { error: "owner_required" });
    const result = await runAction("stop-all", "all", stopAllServices);
    return json(res, result.ok ? 200 : 500, result);
  }

  if (req.method === "POST" && pathname === "/api/actions/restart-all") {
    if (currentAdmin.role !== "owner") return json(res, 403, { error: "owner_required" });
    const result = await runAction("restart-all", "all", restartAllServices);
    return json(res, result.ok ? 200 : 500, result);
  }

  json(res, 404, { error: "not_found" });
}

async function validateFrontendArtifact(staging) {
  const indexPath = path.join(staging, "index.html");
  const errors = [];
  const assetPaths = [];
  const indexInfo = await pathStat(indexPath);
  if (!indexInfo || !indexInfo.isFile()) {
    return { ok: false, errors: ["隔离构建未生成 index.html"], assetPaths };
  }
  const html = await readFile(indexPath, "utf8");
  if (!html.trim()) errors.push("index.html 为空");
  const attributePattern = /<(?:script|link)\b[^>]*?\b(?:src|href)\s*=\s*["']([^"']+)["'][^>]*>/gi;
  for (const match of html.matchAll(attributePattern)) {
    const reference = match[1].trim();
    if (!reference || /^(?:[a-z]+:|\/\/|#)/i.test(reference)) continue;
    const cleanReference = reference.split(/[?#]/, 1)[0];
    let decoded;
    try {
      decoded = decodeURIComponent(cleanReference);
    } catch {
      errors.push(`资源路径编码无效：${reference}`);
      continue;
    }
    const relativeAsset = decoded.replace(/^\/+/, "");
    const assetPath = path.resolve(staging, relativeAsset);
    const relative = path.relative(staging, assetPath);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      errors.push(`资源路径越界：${reference}`);
      continue;
    }
    const info = await pathStat(assetPath);
    if (!info || !info.isFile() || info.size === 0) {
      errors.push(`资源不存在或为空：${reference}`);
      continue;
    }
    assetPaths.push(`/${relativeAsset}`);
  }
  return { ok: errors.length === 0, errors, assetPaths: [...new Set(assetPaths)] };
}

async function recoverInterruptedFrontendActivation(input) {
  const dist = path.resolve(input.dist);
  if (existsSync(dist)) return { recovered: false, reason: "live-artifact-present" };
  const parent = path.dirname(dist);
  const base = path.basename(dist);
  let entries;
  try {
    entries = await readdir(parent, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return { recovered: false, reason: "parent-missing" };
    throw error;
  }
  const backups = entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(`${base}.bak-`))
    .map((entry) => path.join(parent, entry.name))
    .sort()
    .reverse();
  if (!backups.length) return { recovered: false, reason: "backup-missing" };
  const backup = backups[0];
  const validation = await validateFrontendArtifact(backup);
  if (!validation.ok) return { recovered: false, reason: validation.errors.join("；") };
  await rename(backup, dist);
  return { recovered: true, dist, backup, assetPaths: validation.assetPaths };
}

async function recoverInterruptedFrontendActivations() {
  const seen = new Set();
  for (const service of services) {
    if (!service.build?.artifact) continue;
    const dist = path.join(rootDir, path.dirname(service.build.artifact));
    if (seen.has(dist)) continue;
    seen.add(dist);
    const result = await recoverInterruptedFrontendActivation({ dist });
    if (result.recovered) console.warn(`recovered interrupted frontend activation: ${relativePath(dist)}`);
  }
}

async function checkFrontendDelivery(service, context) {
  const domains = service.domains || [];
  if (!domains.length) return commandResult(`verify frontend ${service.id}`, true, "未配置公网域名，跳过公网产物验证");
  const paths = ["/", ...context.assetPaths.slice(0, 4)];
  const checks = [];
  for (const domain of domains) {
    for (const assetPath of paths) {
      const code = Number(await httpCode(domain, assetPath));
      checks.push({ domain, path: assetPath, code, ok: code === 200 });
    }
  }
  const failed = checks.filter((check) => !check.ok);
  return commandResult(
    `verify frontend ${service.id}`,
    failed.length === 0,
    checks.map((check) => `https://${check.domain}${check.path}:${check.code || "000"}`).join("\n"),
    failed.length ? "前端入口或静态资源未通过公网验证" : "",
  );
}

async function stageFrontend(project) {
  if (!project.frontend) {
    return { result: commandResult("frontend-build", false, "", "该项目没有配置前端构建步骤"), context: null };
  }
  const cwd = path.join(rootDir, project.frontend.cwd);
  const dist = path.join(rootDir, project.frontend.dist);
  const staging = path.join(rootDir, `${project.frontend.dist}.next-${Date.now()}`);
  const backup = path.join(rootDir, `${project.frontend.dist}.bak-${Date.now()}`);
  const [command, ...args] = project.frontend.build;
  if (command !== "npm" || args[0] !== "run" || args[1] !== "build") {
    return { result: commandResult("frontend-build", false, "", "仅允许清单中的 npm run build 隔离构建"), context: null };
  }
  await rm(staging, { recursive: true, force: true });
  const buildArgs = [...args, "--", "--outDir", staging, "--emptyOutDir"];
  const result = await runFile(command, buildArgs, { cwd, timeout: 1000 * 60 * 12 });
  result.command = `${[command, ...args].join(" ")} -> ${relativePath(staging)}`;
  const validation = result.ok
    ? await validateFrontendArtifact(staging)
    : { ok: false, errors: ["构建命令失败"], assetPaths: [] };
  const artifactValid = result.ok && validation.ok;
  if (result.ok && !validation.ok) {
    result.ok = false;
    result.code = 1;
    result.stderr = `${result.stderr || ""}\n${validation.errors.join("\n")}`.trim();
  }
  if (!result.ok) await rm(staging, { recursive: true, force: true });
  result.stdout = `${result.stdout || ""}\ncandidate: ${artifactValid ? relativePath(staging) : "invalid"}`.trim();
  return {
    result,
    context: result.ok ? { project, dist, staging, backup, backupCreated: false, assetPaths: validation.assetPaths } : null,
  };
}

async function activateStagedFrontend(context) {
  activeBuildBackups.add(path.resolve(context.backup));
  try {
    await rm(context.backup, { recursive: true, force: true });
    if (existsSync(context.dist)) {
      await rename(context.dist, context.backup);
      context.backupCreated = true;
    }
    await rename(context.staging, context.dist);
    return commandResult(
      `activate ${relativePath(context.staging)} -> ${relativePath(context.dist)}`,
      true,
      `activated: ${relativePath(context.dist)}\nrollback: ${context.backupCreated ? relativePath(context.backup) : "none"}`,
    );
  } catch (error) {
    if (!existsSync(context.dist) && context.backupCreated && existsSync(context.backup)) {
      await rename(context.backup, context.dist).catch(() => {});
    }
    activeBuildBackups.delete(path.resolve(context.backup));
    return commandResult("activate frontend", false, "", error.message);
  }
}

async function rollbackFrontend(context) {
  const failed = `${context.dist}.failed-${Date.now()}`;
  try {
    if (existsSync(context.dist)) await rename(context.dist, failed);
    if (context.backupCreated && existsSync(context.backup)) {
      try {
        await rename(context.backup, context.dist);
      } catch (error) {
        if (existsSync(failed) && !existsSync(context.dist)) await rename(failed, context.dist).catch(() => {});
        throw error;
      }
    }
    await rm(failed, { recursive: true, force: true });
    return commandResult("rollback frontend", true, context.backupCreated ? `restored: ${relativePath(context.dist)}` : "removed newly deployed artifact");
  } catch (error) {
    return commandResult("rollback frontend", false, "", error.message);
  } finally {
    activeBuildBackups.delete(path.resolve(context.backup));
  }
}

async function finalizeFrontend(context) {
  try {
    await rm(context.backup, { recursive: true, force: true });
    await rm(context.staging, { recursive: true, force: true });
  } finally {
    activeBuildBackups.delete(path.resolve(context.backup));
  }
}

async function buildAllCandidates() {
  const steps = [];
  for (const service of services) {
    if (service.test?.requiredForDeploy) {
      const test = await runConfiguredOperation(service.test, `test ${service.id}`);
      steps.push({ title: `测试 ${service.name}`, result: test });
      if (!test.ok) continue;
    }
    if (service.build?.artifact) {
      steps.push({ title: `隔离构建 ${service.name}`, result: await buildService(service) });
    }
  }
  return aggregateResult("build-all: manifest validation builds", steps);
}

async function rebuildTargets(target) {
  const selected = target === "all"
    ? services.filter((service) => service.kind === "application" && !service.protected && service.automaticOperations !== false)
    : [serviceById.get(target)].filter(Boolean);
  if (!selected.length) return commandResult(`rebuild ${target}`, false, "", "未知项目或没有可自动操作的服务");
  const steps = [];
  for (const service of selected) {
    const result = await rebuildService(service);
    steps.push({ title: `重建 ${service.name}`, result });
    if (!result.ok && target !== "all") break;
  }
  return aggregateResult(`rebuild ${target}`, steps);
}

async function runCliCommand(command, target = "") {
  await recoverInterruptedFrontendActivations();
  if (command === "build-all") {
    return runAction("build-all", "manifest", buildAllCandidates, { source: "cli" });
  }
  if (command === "rebuild") {
    return runAction("rebuild", target, () => rebuildTargets(target), { source: "cli" });
  }
  return commandResult(command, false, "", "unknown_cli_command");
}

if (process.env.PROJECT_MANAGER_NO_LISTEN !== "1") {
  await recoverInterruptedFrontendActivations();
}

const server = http.createServer((req, res) => {
  securityHeaders(res, { secure: secureRequest(req) || process.env.NODE_ENV === "production" });
  if (!req.url) return json(res, 400, { error: "missing_url" });
  const requestHost = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
  if (cloudflareVisitorScheme(req) === "http" && requestHost === "project.1008086.xyz") {
    res.writeHead(308, { location: `https://${requestHost}${req.url}`, "cache-control": "no-store" });
    return res.end();
  }
  if (req.url === shanxiPrefix || req.url.startsWith(shanxiPrefix + "/")) return redirectShanxi(req,res);
  if (req.url.startsWith("/api/")) {
    handleApi(req, res).catch((error) => {
      if (res.headersSent) return res.destroy();
      const status = Number(error.statusCode) || 500;
      return json(res, status, {
        error: status >= 500 ? "internal_error" : error.message,
        ...(error.operation ? { operation: error.operation } : {}),
      });
    });
  } else {
    try {
      serveStatic(req, res);
    } catch {
      json(res, 400, { error: "malformed_url" });
    }
  }
});

server.requestTimeout = 10 * 60 * 1000;
server.headersTimeout = 15 * 1000;
server.keepAliveTimeout = 10 * 1000;

if (process.env.PROJECT_MANAGER_NO_LISTEN !== "1") {
  server.listen(port, host, () => {
    console.log(`project-manager listening on http://${host}:${port}`);
  });

  process.on("SIGTERM", () => server.close(() => process.exit(0)));
  process.on("SIGINT", () => server.close(() => process.exit(0)));
}

export const testHelpers = {
  activateStagedFrontend,
  advanceOperationStage,
  aggregateResult,
  adminPasswordMatches,
  adminPasswordPolicyError,
  commandResult,
  createOperationStageUpdater,
  clearLoginAttempts,
  clientIp,
  finalizeFrontend,
  finishOperationStages,
  loginRateStates,
  legacyProjectIds: () => legacyProjects.map((project) => project.id),
  operationResultSteps,
  redact,
  recoverInterruptedFrontendActivation,
  restrictedAccessState,
  rollbackFrontend,
  stageFrontend,
  trustedAuthRedirect,
  hashAdminPassword,
  validateFrontendArtifact,
  revokeSessionsForAdmin,
};

export { runCliCommand };

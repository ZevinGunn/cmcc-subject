import { execFile } from "node:child_process";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import http from "node:http";
import { isIP } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const deployDir = path.join(rootDir, "_部署方案");
const publicDir = path.join(__dirname, "public");
const logDir = path.join(__dirname, "logs");
const operationLogFile = path.join(logDir, "operations.jsonl");

await loadEnv(path.join(__dirname, ".env"));

const port = Number(process.env.PORT || 7800);
const host = process.env.HOST || "127.0.0.1";
const pm2 = process.env.PM2_BIN || path.join(process.env.HOME || "", ".nvm/versions/node/v18.20.8/bin/pm2");
const sessionSecret = process.env.MANAGER_SESSION_SECRET || randomBytes(32).toString("hex");
const managerPassword = process.env.MANAGER_PASSWORD || "cmcc-admin";
const sessionCookie = "cmcc_manager_session";
const commandTimeoutMs = 120000;
const restartTimeoutMs = 1000 * 60 * 20;
const retentionDays = 30;
const jobs = [];

const config = JSON.parse(await readFile(path.join(__dirname, "projects.json"), "utf8"));
const projects = config.groups.flatMap((group) =>
  group.projects.map((project) => ({ ...project, groupId: group.id, groupName: group.name })),
);
const projectById = new Map(projects.map((project) => [project.id, project]));

await mkdir(logDir, { recursive: true });

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

function json(res, status, body) {
  const text = JSON.stringify(body);
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
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

function hashSession(value) {
  return createHash("sha256").update(`${value}:${sessionSecret}`).digest("hex");
}

function makeSession() {
  const value = randomBytes(24).toString("hex");
  return `${value}.${hashSession(value)}`;
}

function validSession(token = "") {
  const [value, hash] = token.split(".");
  if (!value || !hash) return false;
  const expected = hashSession(value);
  if (hash.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(hash), Buffer.from(expected));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function runFile(command, args, options = {}) {
  return new Promise((resolve) => {
    const childEnv = { ...process.env };
    delete childEnv.PORT;
    delete childEnv.HOST;
    delete childEnv.MANAGER_PASSWORD;
    delete childEnv.MANAGER_SESSION_SECRET;
    execFile(command, args, {
      cwd: rootDir,
      timeout: commandTimeoutMs,
      maxBuffer: 1024 * 1024 * 4,
      env: {
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
      },
      ...options,
    }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        code: error?.code ?? 0,
        signal: error?.signal ?? null,
        command: [command, ...args].join(" "),
        stdout,
        stderr,
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
      await addStorageItem(items, filePath, "backup", "构建临时备份", {
        recommended: true,
        reason: "前端构建失败/中断可能留下的临时 dist 备份",
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
  };
}

async function stopAllServices() {
  return runFile("/bin/bash", [path.join(deployDir, "stop-all.sh")], { timeout: restartTimeoutMs });
}

async function startAllServices() {
  return runFile("/bin/bash", [path.join(deployDir, "start-services.sh")], { timeout: restartTimeoutMs });
}

async function restartAllServices() {
  const steps = [];
  steps.push({ title: "停止服务", result: await stopAllServices() });
  for (const project of projects.filter((item) => item.frontend)) {
    steps.push({ title: `重新打包 ${project.name}`, result: await updateFrontend(project) });
  }
  steps.push({ title: "启动服务", result: await startAllServices() });
  return aggregateResult("restart-all: stop -> rebuild frontends -> start", steps);
}

async function recordJob(action, target, result, startedAt, meta = {}) {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    action,
    target,
    ok: result.ok,
    code: result.code,
    startedAt,
    finishedAt: new Date().toISOString(),
    durationMs: Date.now() - new Date(startedAt).getTime(),
    command: result.command || "",
    meta,
    output: `${result.stdout || ""}${result.stderr ? `\n${result.stderr}` : ""}`.trim().slice(-12000),
  };
  jobs.unshift(entry);
  jobs.splice(30);
  await writeFile(operationLogFile, `${JSON.stringify(entry)}\n`, { flag: "a" });
}

async function runAction(action, target, runner, meta = {}) {
  const startedAt = new Date().toISOString();
  const result = await runner();
  await recordJob(action, target, result, startedAt, meta);
  return result;
}

async function readOperationLogs(limit = 80) {
  if (!existsSync(operationLogFile)) return jobs;
  const text = await readFile(operationLogFile, "utf8");
  return text
    .trim()
    .split("\n")
    .filter(Boolean)
    .slice(-limit)
    .reverse()
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
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

async function portOpen(targetPort) {
  const result = await runFile("/usr/sbin/lsof", ["-nP", `-iTCP:${targetPort}`, "-sTCP:LISTEN"]);
  return result.ok && result.stdout.trim().length > 0;
}

async function httpCode(domain) {
  const args = [
    "-s",
    "-o",
    "/dev/null",
    "-w",
    "%{http_code}",
    "--max-time",
    "5",
    `https://${domain}/`,
  ];
  let result = await runFile("/usr/bin/curl", args);
  if (result.ok) return result.stdout.trim();

  const lookup = await runFile("/usr/bin/dig", ["+short", "@1.1.1.1", "A", domain], { timeout: 8000 });
  const address = lookup.stdout.split(/\s+/).find((value) => isIP(value) === 4);
  if (!address) return "000";
  result = await runFile("/usr/bin/curl", [
    ...args.slice(0, -1),
    "--resolve",
    `${domain}:443:${address}`,
    args.at(-1),
  ]);
  return result.ok ? result.stdout.trim() : "000";
}

async function projectCheck(project) {
  let open = false;
  let code = "000";
  for (let attempt = 0; attempt < 5; attempt += 1) {
    [open, code] = await Promise.all([portOpen(project.backend.port), httpCode(project.domain)]);
    if (open && Number(code) < 500 && code !== "000") break;
    await new Promise((resolve) => setTimeout(resolve, 750));
  }
  return {
    ok: open && Number(code) < 500 && code !== "000",
    code: 0,
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
      url: `https://${project.domain}/`,
    };
  }));
  return { groups: config.groups, projects: statuses, jobs: await readOperationLogs(30), manager: { port, host } };
}

function requireAuth(req, res) {
  if (validSession(parseCookies(req)[sessionCookie])) return true;
  json(res, 401, { error: "unauthorized" });
  return false;
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const requestPath = ["/", "/login", "/home"].includes(urlPath) ? "/index.html" : urlPath;
  const filePath = path.normalize(path.join(publicDir, requestPath));
  if (!filePath.startsWith(publicDir) || !existsSync(filePath)) {
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
  createReadStream(filePath).pipe(res);
}

async function handleApi(req, res) {
  if (req.method === "POST" && req.url === "/api/login") {
    const body = await readJson(req).catch(() => ({}));
    if (body.password !== managerPassword) return json(res, 403, { error: "bad_password" });
    res.writeHead(204, {
      "set-cookie": `${sessionCookie}=${encodeURIComponent(makeSession())}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400`,
      "cache-control": "no-store",
    });
    return res.end();
  }

  if (!requireAuth(req, res)) return;

  if (req.method === "GET" && req.url === "/api/status") {
    return json(res, 200, await statusPayload());
  }

  if (req.method === "GET" && req.url.startsWith("/api/logs")) {
    return json(res, 200, { logs: await readOperationLogs(120) });
  }

  if (req.method === "GET" && req.url === "/api/storage") {
    const items = await storageItems();
    return json(res, 200, {
      retentionDays,
      summary: storageSummary(items),
      items: items.map(publicStorageItem),
    });
  }

  if (req.method === "POST" && req.url === "/api/storage/delete") {
    const body = await readJson(req).catch(() => ({}));
    const ids = Array.isArray(body.ids) ? body.ids : [];
    const result = await runAction("storage-delete", "selected", async () =>
      cleanupResult("storage-delete", await deleteStorageItems(ids)), { ids });
    return json(res, result.ok ? 200 : 500, result);
  }

  if (req.method === "POST" && req.url === "/api/storage/clear-cache") {
    const result = await runAction("clear-cache", "recommended-cache", async () =>
      cleanupResult("clear-cache", await clearRecommendedCache()));
    return json(res, result.ok ? 200 : 500, result);
  }

  if (req.method === "POST" && req.url === "/api/storage/cleanup-expired") {
    const result = await runAction("cleanup-expired", `older-than-${retentionDays}-days`, async () =>
      cleanupResult("cleanup-expired", await cleanupExpired()));
    return json(res, result.ok ? 200 : 500, result);
  }

  if (req.method === "POST" && req.url === "/api/logout") {
    res.writeHead(204, {
      "set-cookie": `${sessionCookie}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`,
      "cache-control": "no-store",
    });
    return res.end();
  }

  const logsMatch = req.url.match(/^\/api\/projects\/([^/]+)\/logs$/);
  if (req.method === "GET" && logsMatch) {
    const project = projectById.get(logsMatch[1]);
    if (!project) return json(res, 404, { error: "unknown_project" });
    const result = await runFile(pm2, ["logs", project.backend.pm2Name, "--lines", "120", "--nostream", "--raw"]);
    return json(res, result.ok ? 200 : 500, result);
  }

  const match = req.url.match(/^\/api\/projects\/([^/]+)\/(start|stop|restart|rebuild|check|backend-start|backend-stop|backend-restart|frontend-update)$/);
  if (req.method === "POST" && match) {
    const [, projectId, action] = match;
    const project = projectById.get(projectId);
    if (!project) return json(res, 404, { error: "unknown_project" });
    const result = await runAction(action, project.id, () => {
      if (action === "rebuild") {
        return runFile("/bin/bash", [path.join(deployDir, "rebuild.sh"), project.rebuildTarget]);
      }
      if (action === "frontend-update") {
        return updateFrontend(project);
      }
      if (action === "check") {
        return projectCheck(project);
      }
      const pm2Action = action.replace("backend-", "");
      return runFile(pm2, [pm2Action, project.backend.pm2Name]);
    }, { project: project.name, domain: project.domain });
    return json(res, result.ok ? 200 : 500, result);
  }

  if (req.method === "POST" && req.url === "/api/actions/start-all") {
    const result = await runAction("start-all", "all", startAllServices);
    return json(res, result.ok ? 200 : 500, result);
  }

  if (req.method === "POST" && req.url === "/api/actions/stop-all") {
    const result = await runAction("stop-all", "all", stopAllServices);
    return json(res, result.ok ? 200 : 500, result);
  }

  if (req.method === "POST" && req.url === "/api/actions/restart-all") {
    const result = await runAction("restart-all", "all", restartAllServices);
    return json(res, result.ok ? 200 : 500, result);
  }

  json(res, 404, { error: "not_found" });
}

async function updateFrontend(project) {
  if (!project.frontend) {
    return {
      ok: false,
      code: 1,
      signal: null,
      command: "frontend-update",
      stdout: "",
      stderr: "该项目没有配置前端构建步骤",
    };
  }

  const cwd = path.join(rootDir, project.frontend.cwd);
  const dist = path.join(rootDir, project.frontend.dist);
  const backup = path.join(rootDir, `${project.frontend.dist}.bak-${Date.now()}`);
  const [command, ...args] = project.frontend.build;
  const removeStarted = new Date().toISOString();
  if (existsSync(dist)) {
    await rm(backup, { recursive: true, force: true });
    await runFile("/bin/mv", [dist, backup]);
  }
  const build = await runFile(command, args, { cwd, timeout: 1000 * 60 * 8 });
  build.command = `mv ${project.frontend.dist} ${path.basename(backup)} && ${[command, ...args].join(" ")}`;
  build.stdout = `backup: ${existsSync(backup) ? backup : "none"}\n${build.stdout || ""}`;
  if (!build.ok) {
    await rm(dist, { recursive: true, force: true });
    if (existsSync(backup)) await runFile("/bin/mv", [backup, dist]);
    build.stderr = `${build.stderr || ""}\nfrontend update started at ${removeStarted}`.trim();
    build.stdout = `${build.stdout}\nrestored: ${project.frontend.dist}`;
  } else if (existsSync(backup)) {
    await rm(backup, { recursive: true, force: true });
  }
  return build;
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) {
    handleApi(req, res).catch((error) => json(res, 500, { error: error.message }));
  } else {
    serveStatic(req, res);
  }
});

server.listen(port, host, () => {
  console.log(`project-manager listening on http://${host}:${port}`);
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));

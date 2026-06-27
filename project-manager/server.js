import { execFile } from "node:child_process";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import http from "node:http";
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
  const result = await runFile("/usr/bin/curl", [
    "-s",
    "-o",
    "/dev/null",
    "-w",
    "%{http_code}",
    "--max-time",
    "5",
    `https://${domain}/`,
  ]);
  return result.ok ? result.stdout.trim() : "000";
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
        return Promise.all([portOpen(project.backend.port), httpCode(project.domain)]).then(([open, code]) => ({
          ok: open && Number(code) < 500 && code !== "000",
          code: 0,
          signal: null,
          stdout: `port:${open ? "open" : "closed"}\nhttps:${code}`,
          stderr: "",
        }));
      }
      const pm2Action = action.replace("backend-", "");
      return runFile(pm2, [pm2Action, project.backend.pm2Name]);
    }, { project: project.name, domain: project.domain });
    return json(res, result.ok ? 200 : 500, result);
  }

  if (req.method === "POST" && req.url === "/api/actions/start-all") {
    const result = await runAction("start-all", "all", () => runFile("/bin/bash", [path.join(deployDir, "start-services.sh")]));
    return json(res, result.ok ? 200 : 500, result);
  }

  if (req.method === "POST" && req.url === "/api/actions/stop-all") {
    const names = projects.map((project) => project.backend.pm2Name);
    const result = await runAction("stop-all", "all", () => runFile(pm2, ["stop", ...names]));
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

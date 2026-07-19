import { execFile } from "node:child_process";
import { appendFile, readFile, rm } from "node:fs/promises";
import http from "node:http";

const payload = JSON.parse(process.argv[2] || "{}");
const startedAt = new Date(payload.startedAt || Date.now());

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function run(command, args) {
  return new Promise((resolve) => {
    execFile(command, args, { timeout: 60_000 }, (error, stdout = "", stderr = "") => {
      resolve({
        ok: !error,
        code: error?.code ?? 0,
        stdout: String(stdout),
        stderr: String(stderr || error?.message || ""),
      });
    });
  });
}

function healthCheck() {
  return new Promise((resolve) => {
    const request = http.get({ hostname: "127.0.0.1", port: payload.port, path: "/api/health", timeout: 1500 }, (response) => {
      response.resume();
      resolve(response.statusCode === 200);
    });
    request.on("timeout", () => request.destroy());
    request.on("error", () => resolve(false));
  });
}

function redact(value = "") {
  let output = String(value)
    .replace(/("[a-z0-9_.-]*(?:password|passwd|secret|token|key|cookie|database[_-]?url)"\s*:\s*)"(?:\\.|[^"\\])*"/gi, '$1"[REDACTED]"')
    .replace(/(^|\r?\n)(\s*(?:authorization|cookie|set-cookie)\s*:\s*)[^\r\n]*/gi, "$1$2[REDACTED]")
    .replace(/((?:password|passwd|secret|token|key|cookie|database[_-]?url)\s*[=:]\s*)[^,;\s]+/gi, "$1[REDACTED]")
    .replace(/postgres(?:ql)?:\/\/[^\s'"`]+/gi, "[REDACTED_DATABASE_URL]");
  return output.slice(-6000);
}

async function releaseLock() {
  try {
    const current = JSON.parse(await readFile(payload.lockFile, "utf8"));
    if (current?.id === payload.operationId) await rm(payload.lockFile, { force: true });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

let result = { ok: false, code: 1, stdout: "", stderr: "restart worker did not run" };
try {
  await delay(750);
  result = await run(payload.pm2, ["restart", payload.pm2Name, "--update-env"]);
  if (result.ok) {
    let healthy = false;
    for (let attempt = 0; attempt < 30; attempt += 1) {
      if (await healthCheck()) {
        healthy = true;
        break;
      }
      await delay(1000);
    }
    if (!healthy) {
      result.ok = false;
      result.code = 1;
      result.stderr = `${result.stderr}\n管理台重启后健康检查超时`.trim();
    }
  }
} catch (error) {
  result = { ok: false, code: 1, stdout: "", stderr: error.message };
}

const finishedAt = new Date();
const entry = {
  id: payload.operationId,
  action: "restart",
  target: "project",
  ok: result.ok,
  code: Number(result.code) || (result.ok ? 0 : 1),
  startedAt: startedAt.toISOString(),
  finishedAt: finishedAt.toISOString(),
  durationMs: finishedAt.getTime() - startedAt.getTime(),
  command: `pm2 restart ${payload.pm2Name} --update-env`,
  progress: 100,
  steps: [{
    id: "restart-and-health",
    name: "重启并验证管理台",
    status: result.ok ? "completed" : "failed",
    detail: redact(`${result.stdout || ""}${result.stderr ? `\n${result.stderr}` : ""}`).trim(),
    command: `pm2 restart ${payload.pm2Name} --update-env`,
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
  }],
  meta: { serviceName: "Project Ops", supervisedRestart: true },
  output: redact(`${result.stdout || ""}${result.stderr ? `\n${result.stderr}` : ""}`).trim(),
};

try {
  await appendFile(payload.logFile, `${JSON.stringify(entry)}\n`, { mode: 0o600 });
} finally {
  await releaseLock();
}

process.exit(result.ok ? 0 : 1);

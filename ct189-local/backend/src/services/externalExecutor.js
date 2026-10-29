import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "../config.js";
import { claimClassicRight } from "./telecomClient.js";

export const SUPPORTED_EXECUTORS = ["native", "python", "javascript", "go", "java"];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../scripts/executors");
const specs = {
  python: { label: "Python", command: process.env.CT189_PYTHON_BIN || "python3", args: [path.join(root, "python-worker.py")] },
  javascript: { label: "JavaScript", command: process.env.CT189_NODE_BIN || process.execPath, args: [path.join(root, "javascript-worker.mjs")] },
  go: { label: "Go", command: process.env.CT189_GO_BIN || "go", args: ["run", path.join(root, "go-worker", "main.go")] },
  java: { label: "Java", command: process.env.CT189_JAVA_BIN || "java", args: [path.join(root, "JavaWorker.java")] },
};

const pending = new Map();
const WORKER_TTL_MS = 2 * 60_000;
const MAX_OUTPUT = 64 * 1024;
let executorCache;
let executorCacheAt = 0;

function runtimeAvailable(id, command) {
  const args = id === "go" ? ["version"] : ["--version"];
  const result = spawnSync(command, args, { stdio: "ignore", timeout: 2_000 });
  return result.status === 0;
}

function cleanup() {
  const now = Date.now();
  for (const [token, item] of pending) if (item.expiresAt <= now) pending.delete(token);
}

export function listExecutors() {
  cleanup();
  if (executorCache && Date.now() - executorCacheAt < 30_000)
    return executorCache.map((item) => ({ ...item }));
  executorCache = [
    { id: "native", label: "Node 内置", available: true, description: "服务端内置执行，默认方式" },
    ...Object.entries(specs).map(([id, spec]) => {
      const available = runtimeAvailable(id, spec.command);
      return {
        id,
        label: spec.label,
        available,
        description: available
          ? "本机脚本适配器；不会接收服务密码或 Cookie"
          : `未检测到可用的${spec.label}运行时`,
      };
    }),
  ];
  executorCacheAt = Date.now();
  return executorCache.map((item) => ({ ...item }));
}

export function normalizeExecutor(value) {
  const executor = String(value || "native").trim().toLowerCase();
  if (!SUPPORTED_EXECUTORS.includes(executor))
    throw Object.assign(new Error(`执行器必须是 ${SUPPORTED_EXECUTORS.join("、")}`), { status: 400 });
  return executor;
}

export function registerWorker({ action, accountId, taskId }) {
  cleanup();
  const token = randomBytes(32).toString("base64url");
  pending.set(token, { action, accountId, taskId, expiresAt: Date.now() + WORKER_TTL_MS });
  return token;
}

export async function consumeWorker({ token, action, accountId, taskId }) {
  cleanup();
  const item = pending.get(String(token || ""));
  if (!item || item.action !== action || item.accountId !== accountId || item.taskId !== taskId)
    throw Object.assign(new Error("本地执行令牌无效或已过期"), { status: 401 });
  pending.delete(token);
  if (action !== "friday_wdmei" && action !== "rights_bag_cash")
    throw Object.assign(new Error("外部执行器仅支持权益领取任务"), { status: 400 });
  const result = await claimClassicRight(accountId, action);
  return {
    ok: true,
    message: result.message,
    details: {
      activityId: result.activityId,
      offerCode: result.offerCode,
      offerName: result.offerName,
      ...(result.responses ? { responses: result.responses } : {}),
    },
  };
}

function parseWorkerResponse(output) {
  const lines = String(output || "").trim().split(/\r?\n/).filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      const result = JSON.parse(lines[i]);
      if (result && typeof result === "object" && typeof result.ok === "boolean") return result;
    } catch {
      // Worker diagnostics are allowed on stdout; only the final JSON result is consumed.
    }
  }
  throw new Error("外部执行器未返回有效结果");
}

export function runExternalExecutor({ executor, action, accountId, taskId }) {
  const spec = specs[executor];
  if (!spec) throw Object.assign(new Error("当前任务不支持该外部执行器"), { status: 400 });
  const token = registerWorker({ action, accountId, taskId });
  const payload = JSON.stringify({
    callbackUrl: `http://127.0.0.1:${config.port}/api/internal/executor`,
    token,
    action,
    accountId,
    taskId,
  });
  return new Promise((resolve, reject) => {
    const child = spawn(spec.command, spec.args, {
      cwd: root,
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, CT189_EXTERNAL_EXECUTOR: executor },
    });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) reject(error);
      else resolve(result);
    };
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      finish(new Error(`外部${spec.label}执行器超时`));
    }, 120_000);
    child.stdout.on("data", (chunk) => {
      stdout = (stdout + chunk.toString()).slice(-MAX_OUTPUT);
    });
    child.stderr.on("data", (chunk) => {
      stderr = (stderr + chunk.toString()).slice(-MAX_OUTPUT);
    });
    child.once("error", (error) => finish(new Error(`外部${spec.label}执行器启动失败：${error.code || "不可用"}`)));
    child.once("close", (code) => {
      if (code !== 0) {
        finish(new Error(`外部${spec.label}执行器退出（${code ?? "未知"}）：${stderr.trim().slice(-180) || "请检查本机运行时"}`));
        return;
      }
      try {
        finish(null, parseWorkerResponse(stdout));
      } catch (error) {
        finish(error);
      }
    });
    child.stdin.end(payload);
  });
}

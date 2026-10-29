import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { accountsRouter } from "./routes/accounts.js";
import { ct189Router } from "./routes/ct189.js";
import { tasksRouter } from "./routes/tasks.js";
import { startSessionMonitor } from "./services/accountSession.js";
import { closeClient } from "./services/telecomClient.js";
import { listAccounts } from "./services/accountStore.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createSiteAccess } from "./services/siteAccess.js";
import { schedulesRouter } from "./routes/schedules.js";
import { createScheduler } from "./services/scheduler.js";
import { internalExecutorRouter } from "./routes/internalExecutor.js";
import { listExecutors } from "./services/externalExecutor.js";

const app = express();
const dist = fileURLToPath(new URL("../../frontend/dist/", import.meta.url));
if (
  config.publicMode &&
  (!/^https:\/\/[a-z0-9.-]+$/.test(config.publicOrigin) ||
    config.host !== "127.0.0.1")
)
  throw new Error("公网服务必须配置 HTTPS 域名并仅监听 127.0.0.1");
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  });
  if (config.publicMode)
    res.set("Strict-Transport-Security", "max-age=31536000");
  next();
});
const localOrigins = [
  "http://127.0.0.1:5711",
  "http://localhost:5711",
  "http://127.0.0.1:5712",
  "http://localhost:5712",
  ...(config.publicOrigin ? [config.publicOrigin] : []),
];
const access = createSiteAccess({
  required: config.publicMode,
  credentialsFile: path.join(config.dataDir, "site-access.json"),
  origins: localOrigins,
});

app.use((req, res, next) => {
  const origin = req.get("Origin");
  if (origin && !localOrigins.includes(origin)) {
    return res.status(403).json({ ok: false, message: "访问来源不受信任" });
  }
  next();
});
app.use(cors({ origin: localOrigins }));
app.use(express.json({ limit: "2mb" }));
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.use("/api/internal/executor", internalExecutorRouter);

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    name: "ct189-local",
    displayName: "北京电信快捷服务",
    accessRequired: access.required,
    version: (() => {
      try {
        return JSON.parse(
          fs.readFileSync(path.join(dist, "version.json"), "utf8"),
        ).revision;
      } catch {
        return "development";
      }
    })(),
    uptime: process.uptime(),
    headless: config.headless,
  });
});

app.use("/api", (req, res, next) =>
  Promise.resolve(access.handle(req, res, next)).catch(next),
);
app.use("/api/accounts", accountsRouter);
app.use("/api/ct189", ct189Router);
app.use("/api/tasks", tasksRouter);
app.use("/api/schedules", schedulesRouter);
app.get("/api/executors", (req, res) => res.json({ ok: true, executors: listExecutors() }));

app.use("/api", (req, res) => {
  res.status(404).json({
    ok: false,
    message: `接口不存在：${req.method} ${req.originalUrl}`,
  });
});

app.use(
  express.static(dist, {
    index: false,
    dotfiles: "deny",
    setHeaders(res, file) {
      res.set(
        "Cache-Control",
        file.includes(`${path.sep}assets${path.sep}`)
          ? "public, max-age=31536000, immutable"
          : "no-store",
      );
    },
  }),
);
app.get(["/", "/login"], (req, res) => {
  res.set("Cache-Control", "no-store");
  res.sendFile(path.join(dist, "index.html"));
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  console.error("CT189 request failed", { method: req.method, path: req.path });
  const status = Number(error?.status || error?.statusCode || 500);
  res.status(status >= 400 && status < 600 ? status : 500).json({
    ok: false,
    message: error?.message || "服务端异常",
  });
});

const server = app.listen(config.port, config.host, () => {
  console.log(
    `北京电信快捷服务 running at http://${config.host}:${config.port}`,
  );
});
const stopMonitor = startSessionMonitor();
const scheduler = createScheduler();
scheduler.start();
let stopping = false;
async function shutdown() {
  if (stopping) return;
  stopping = true;
  stopMonitor();
  scheduler.stop();
  server.close();
  const deadline = setTimeout(() => process.exit(0), 10000);
  deadline.unref();
  await Promise.allSettled(
    listAccounts().map((account) => closeClient(account.id)),
  );
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

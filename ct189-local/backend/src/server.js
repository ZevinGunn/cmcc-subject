import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { accountsRouter } from "./routes/accounts.js";
import { ct189Router } from "./routes/ct189.js";
import { tasksRouter } from "./routes/tasks.js";

const app = express();
const localOrigins = ["http://127.0.0.1:5711", "http://localhost:5711", "http://127.0.0.1:5712", "http://localhost:5712"];

app.use((req, res, next) => {
  const origin = req.get("Origin");
  if (origin && !localOrigins.includes(origin)) {
    return res.status(403).json({ ok: false, message: "仅允许本地应用访问" });
  }
  next();
});
app.use(cors({ origin: localOrigins }));
app.use(express.json({ limit: "2mb" }));
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, name: "ct189-local", uptime: process.uptime(), headless: config.headless });
});

app.use("/api/accounts", accountsRouter);
app.use("/api/ct189", ct189Router);
app.use("/api/tasks", tasksRouter);

app.use("/api", (req, res) => {
  res.status(404).json({ ok: false, message: `接口不存在：${req.method} ${req.originalUrl}` });
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
    message: error?.message || "服务端异常"
  });
});

app.listen(config.port, config.host, () => {
  console.log(`CT189 local backend running at http://${config.host}:${config.port}`);
});

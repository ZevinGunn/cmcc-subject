import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { accountsRouter } from "./routes/accounts.js";
import { ct189Router } from "./routes/ct189.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, name: "ct189-local", uptime: process.uptime(), headless: config.headless });
});

app.use("/api/accounts", accountsRouter);
app.use("/api/ct189", ct189Router);

app.use("/api", (req, res) => {
  res.status(404).json({ ok: false, message: `接口不存在：${req.method} ${req.originalUrl}` });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  console.error(error);
  const status = Number(error?.status || error?.statusCode || 500);
  res.status(status >= 400 && status < 600 ? status : 500).json({
    ok: false,
    message: error?.message || "服务端异常"
  });
});

app.listen(config.port, config.host, () => {
  console.log(`CT189 local backend running at http://${config.host}:${config.port}`);
});

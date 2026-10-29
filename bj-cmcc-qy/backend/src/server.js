import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { authRouter } from "./routes/auth.js";
import { couponsRouter } from "./routes/coupons.js";
import { rightsRouter } from "./routes/rights.js";
import { exchangeRouter } from "./routes/exchange.js";
import { ordersRouter } from "./routes/orders.js";
import { debugRouter } from "./routes/debug.js";
import { fortuneRouter } from "./routes/fortune.js";
import { plus99NewRouter } from "./routes/plus99New.js";
import { offerOrderRouter } from "./routes/offerOrder.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime(), requestMode: config.requestMode });
});

app.use("/api/auth", authRouter);
app.use("/api/coupons", couponsRouter);
app.use("/api/rights", rightsRouter);
app.use("/api/exchange", exchangeRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/fortune", fortuneRouter);
app.use("/api/plus99-new", plus99NewRouter);
app.use("/api/offer-order", offerOrderRouter);
app.use("/api/debug", debugRouter);

app.use("/api", (req, res) => {
  res.status(404).json({
    ok: false,
    message: `接口不存在：${req.method} ${req.originalUrl}`
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  const status = Number(error?.status || error?.statusCode || 500);
  const message =
    error?.type === "entity.parse.failed"
      ? "请求体不是合法 JSON"
      : error?.message || "服务端异常";
  res.status(status >= 400 && status < 600 ? status : 500).json({
    ok: false,
    message
  });
});

app.listen(config.port, () => {
  console.log(`BMCC rights backend running at http://localhost:${config.port}`);
});

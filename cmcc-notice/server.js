const path = require("path");
const express = require("express");
const fetch = require("node-fetch");
const https = require("https");
const crypto = require("crypto");
const { decryptAES } = require("./src/crypto");
const { fetchAnnouncements } = require("./src/apiClient");
const { normalizeUserInfo, buildReqBody } = require("./src/utils");
const { baseHost, apiPath, env, keys } = require("./src/config");

const legacyRenegotiation =
  crypto.constants && crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT;
const httpsAgent = legacyRenegotiation
  ? new https.Agent({
      keepAlive: true,
      secureOptions: legacyRenegotiation,
    })
  : new https.Agent({ keepAlive: true });

const app = express();
const port = process.env.PORT || 3111;
const host = process.env.HOST || "0.0.0.0";

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    env,
    baseHost,
    apiPath,
    time: new Date().toISOString(),
  });
});

app.get("/api/announcements", async (req, res) => {
  const userInfo = normalizeUserInfo(req.query);
  const reqBody = buildReqBody(req.query, userInfo);

  try {
    const result = await fetchAnnouncements({ userInfo, reqBody });
    let parsedBody = null;
    if (result.body) {
      try {
        parsedBody = JSON.parse(decryptAES(result.body, keys.respKey, keys.iv));
      } catch (err) {
        parsedBody = null;
      }
    }
    res.json({
      status: result.status,
      body: result.body,
      parsedBody,
      raw: result.raw && result.raw.retCode ? result.raw : undefined,
      xPen: result.xPen || undefined,
      request: {
        userInfo,
        reqBody,
        payload: result.requestPayload,
      },
    });
  } catch (err) {
    res.status(500).json({
      retCode: "999999",
      retDesc: "请求失败",
      error: err.message,
    });
  }
});

app.get("/api/detail", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    res.status(400).json({ error: "missing url" });
    return;
  }
  let target = String(url);
  if (target.startsWith("/")) {
    target = `${baseHost}${target}`;
  } else if (!/^https?:\/\//i.test(target)) {
    target = `${baseHost}/${target}`;
  }
  let parsed;
  try {
    parsed = new URL(target);
  } catch (err) {
    res.status(400).json({ error: "invalid url" });
    return;
  }
  if (!/^https?:$/.test(parsed.protocol)) {
    res.status(400).json({ error: "invalid protocol" });
    return;
  }
  const host = parsed.hostname;
  const allowed =
    host.endsWith(".10086.cn") || host.endsWith(".cmcc-cs.cn");
  if (!allowed) {
    res.status(403).json({ error: "host not allowed" });
    return;
  }
  try {
    const response = await fetch(parsed.toString(), {
      method: "GET",
      agent: parsed.protocol === "https:" ? httpsAgent : undefined,
      headers: { Accept: "text/html,application/xhtml+xml" },
    });
    const text = await response.text();
    res.status(response.status);
    res.set("Content-Type", "text/html; charset=utf-8");
    res.set("Content-Disposition", "inline");
    res.send(text);
  } catch (err) {
    res.status(500).send("detail fetch failed");
  }
});

app.listen(port, host, () => {
  const displayHost = host === "0.0.0.0" ? "localhost" : host;
  console.log(`Server listening on http://${displayHost}:${port}`);
  if (host === "0.0.0.0") {
    console.log("LAN access enabled. Visit this machine's IP address on the same port.");
  }
});

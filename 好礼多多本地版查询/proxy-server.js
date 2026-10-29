const http = require("http");
const https = require("https");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { URL } = require("url");

const ROOT_DIR = __dirname;
const PORT = 3000;
const TARGET_ORIGIN = "http://ysmapp.bj.10086.cn";
const TARGET_HOST = "ysmapp.bj.10086.cn";
const TARGET_HOSTNAME = process.env.CMCC_TARGET_HOSTNAME || TARGET_HOST;
const TARGET_TIMEOUT_MS = Number(process.env.CMCC_TARGET_TIMEOUT_MS || 10000);
const TARGET_LOCAL_ADDRESS = resolveTargetLocalAddress();
const LOG_DIR = path.join(ROOT_DIR, "logs");
const PHONE_LOG_PATH = path.join(LOG_DIR, "phone-log.txt");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".ico": "image/x-icon",
  ".map": "application/json; charset=utf-8",
};

function send404(res) {
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not Found");
}

function sendHealth(res) {
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(
    JSON.stringify({
      ok: true,
      service: "arpu-proxy",
      uptimeSeconds: Math.floor(process.uptime()),
    })
  );
}

function sendProxyError(res, err) {
  res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Proxy Error: " + (err && err.message ? err.message : "unknown"));
}

function sendConsumptionError(res, errorCode, errorMsg) {
  if (res.headersSent) {
    return;
  }
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify({ errorCode, errorMsg }));
}

function resolveTargetLocalAddress() {
  if (process.env.CMCC_LOCAL_ADDRESS) {
    return process.env.CMCC_LOCAL_ADDRESS;
  }
  if (process.env.CMCC_LOCAL_INTERFACE) {
    return getInterfaceAddress(process.env.CMCC_LOCAL_INTERFACE);
  }
  return "";
}

function getInterfaceAddress(name) {
  const interfaces = os.networkInterfaces();
  const entries = interfaces[name] || [];
  const match = entries.find((item) => item && item.family === "IPv4" && !item.internal);
  return match ? match.address : "";
}

function safePathname(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  return normalized;
}

function serveStatic(req, res) {
  const pathname = safePathname(req.url);
  if (pathname === "/favicon.ico") {
    res.writeHead(204, { "Content-Type": "image/x-icon" });
    res.end();
    return;
  }
  const filePath = path.join(ROOT_DIR, pathname === "/" ? "/arpu.html" : pathname);

  if (!filePath.startsWith(ROOT_DIR)) {
    return send404(res);
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      return proxyRequest(req, res, { prefixAppChannelForRes: true });
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  });
}

function proxyRequest(req, res, options) {
  const opts = options || {};
  let targetPath = req.url;
  if (opts.stripProxyPrefix) {
    targetPath = targetPath.replace(/^\/proxy/, "");
  }
  if (opts.prefixAppChannelForRes && targetPath.startsWith("/res/")) {
    targetPath = "/app/channel-web" + targetPath;
  }
  const targetUrl = new URL(TARGET_ORIGIN + targetPath);

  if (/customerValidateAndConsumption\.action/i.test(targetPath)) {
    return proxyConsumptionRequest(req, res, targetUrl);
  }

  const headers = Object.assign({}, req.headers, {
    host: targetUrl.host,
    origin: TARGET_ORIGIN,
    referer: TARGET_ORIGIN + (opts.refererPath || "/"),
  });
  delete headers["content-length"];

  const requestOptions = {
    protocol: targetUrl.protocol,
    hostname: targetUrl.hostname,
    port: targetUrl.port || (targetUrl.protocol === "https:" ? 443 : 80),
    path: targetUrl.pathname + targetUrl.search,
    method: req.method,
    headers,
  };

  const client = targetUrl.protocol === "https:" ? https : http;
  const proxyReq = client.request(requestOptions, (proxyRes) => {
    const resHeaders = Object.assign({}, proxyRes.headers);
    res.writeHead(proxyRes.statusCode || 502, resHeaders);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => sendProxyError(res, err));

  req.pipe(proxyReq);
}

function proxyConsumptionRequest(req, res, targetUrl) {
  const isGet = req.method === "GET";
  if (isGet) {
    return sendConsumptionRequest(req, res, targetUrl, targetUrl.searchParams.toString(), "GET");
  }

  const chunks = [];
  req.on("data", (chunk) => {
    chunks.push(chunk);
  });
  req.on("end", () => {
    sendConsumptionRequest(req, res, targetUrl, Buffer.concat(chunks).toString("utf8") || targetUrl.searchParams.toString(), "POST");
  });
}

function sendConsumptionRequest(req, res, targetUrl, body, method) {
  const phone = extractPhoneFromBody(body);
  if (phone) {
    appendPhoneLog(phone);
  }

  const requestMethod = method === "POST" ? "POST" : "GET";
  const headers = {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": req.headers["accept-language"] || "zh-CN,zh;q=0.9",
    host: TARGET_HOST,
    origin: TARGET_ORIGIN,
    referer: TARGET_ORIGIN + "/app/channel-web/",
    "user-agent": req.headers["user-agent"] || "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
    "x-requested-with": "XMLHttpRequest",
    connection: "close",
  };
  if (requestMethod === "POST") {
    headers["content-type"] = "application/x-www-form-urlencoded; charset=UTF-8";
    headers["content-length"] = Buffer.byteLength(body);
  }

  const requestOptions = {
    protocol: targetUrl.protocol,
    hostname: TARGET_HOSTNAME,
    port: targetUrl.port || (targetUrl.protocol === "https:" ? 443 : 80),
    path: targetUrl.pathname + (requestMethod === "GET" && body ? "?" + body : ""),
    method: requestMethod,
    headers,
  };
  if (TARGET_LOCAL_ADDRESS) {
    requestOptions.localAddress = TARGET_LOCAL_ADDRESS;
  }

  const client = targetUrl.protocol === "https:" ? https : http;
  const startedAt = Date.now();
  let finished = false;
  const proxyReq = client.request(requestOptions, (proxyRes) => {
    finished = true;
    logConsumptionProxy(phone, proxyRes.statusCode || 0, Date.now() - startedAt);
    const resHeaders = Object.assign({}, proxyRes.headers);
    res.writeHead(proxyRes.statusCode || 502, resHeaders);
    proxyRes.pipe(res);
  });

  proxyReq.setTimeout(TARGET_TIMEOUT_MS, () => {
    if (finished) {
      return;
    }
    finished = true;
    proxyReq.destroy(new Error("upstream timeout"));
    logConsumptionProxy(phone, "timeout", Date.now() - startedAt);
    sendConsumptionError(res, "proxy_timeout", "北京移动上游接口响应超时，请稍后重试");
  });

  proxyReq.on("error", (err) => {
    if (finished) {
      return;
    }
    finished = true;
    logConsumptionProxy(phone, err.code || "error", Date.now() - startedAt);
    sendConsumptionError(res, "proxy_error", "北京移动上游接口连接失败，请稍后重试");
  });
  proxyReq.end(requestMethod === "POST" ? body : undefined);
}

function extractPhoneFromParams(params) {
  return params.get("submitPhoneNO") || params.get("phoneNO") || "";
}

function extractPhoneFromBody(body) {
  try {
    const params = new URLSearchParams(body);
    return extractPhoneFromParams(params);
  } catch (_) {
    return "";
  }
}

function appendPhoneLog(phone) {
  const line = `${new Date().toISOString()} ${phone}\n`;
  fs.mkdir(LOG_DIR, { recursive: true }, (dirErr) => {
    if (dirErr) {
      return;
    }
    fs.appendFile(PHONE_LOG_PATH, line, () => {});
  });
}

function maskPhone(phone) {
  return phone ? phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2") : "-";
}

function logConsumptionProxy(phone, status, elapsedMs) {
  console.log(
    `[consumption] phone=${maskPhone(phone)} status=${status} elapsed=${elapsedMs}ms target=${TARGET_HOSTNAME} localAddress=${TARGET_LOCAL_ADDRESS || "auto"}`
  );
}

const server = http.createServer((req, res) => {
  const pathname = req.url.split("?", 1)[0];
  if (pathname === "/api/health") {
    if (req.method !== "GET") {
      res.writeHead(405, { Allow: "GET" });
      return res.end();
    }
    return sendHealth(res);
  }
  if (req.url.startsWith("/proxy/")) {
    return proxyRequest(req, res, { stripProxyPrefix: true, refererPath: "/app/channel-web/" });
  }
  return serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Proxy server running: http://127.0.0.1:${PORT}`);
});

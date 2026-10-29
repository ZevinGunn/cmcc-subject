const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 3002);
const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DATA_DIR = path.join(ROOT_DIR, "data");

const STATIC_FILES = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/app.js", ["app.js", "application/javascript; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
]);

function loadJson(fileName) {
  const parsed = JSON.parse(fs.readFileSync(path.join(DATA_DIR, fileName), "utf8"));
  if (!parsed || !parsed.meta || !Array.isArray(parsed.contracts)) {
    throw new Error(`invalid data file: ${fileName}`);
  }
  return parsed;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((left, right) => String(left).localeCompare(String(right), "zh-CN"));
}

function searchable(item, fields) {
  return fields.map((field) => item[field] ?? "").join(" ").toLocaleLowerCase("zh-CN");
}

function buildDatasets() {
  const type2Source = loadJson("type2.json");
  const type3Source = loadJson("contracts.json");
  const lowSource = loadJson("low-consumption.json");

  const type2Items = type2Source.contracts.map((contract, index) => {
    const item = {
      row: Number(contract.idx) || index + 1,
      id: String(contract.code),
      prefix: contract.prefix || String(contract.code).slice(0, 6),
      name: contract.name,
      category: contract.category || "",
      amount: contract.amount || "",
      duration: contract.duration || "",
      start: contract.start || "",
      end: contract.end || "",
      long: contract.long || "",
      status: contract.status || "",
    };
    return { ...item, searchText: searchable(item, Object.keys(item)) };
  });

  const type3Items = type3Source.contracts.map((contract, index) => {
    const item = {
      row: index + 1,
      id: contract.id,
      prefix: contract.id.slice(0, 6),
      name: contract.name,
    };
    return { ...item, searchText: searchable(item, Object.keys(item)) };
  });

  const lowItems = lowSource.contracts.map((contract, index) => {
    const item = {
      row: index + 1,
      name: contract.name,
      grade: contract.grade,
      rule: contract.rule || "",
    };
    return { ...item, searchText: searchable(item, Object.keys(item)) };
  });

  const definitions = {
    "2": {
      key: "2",
      label: "二类合约",
      meta: type2Source.meta,
      items: type2Items,
      filters: {
        prefixes: unique(type2Items.map((item) => item.prefix)),
        categories: unique(type2Items.map((item) => item.category)),
      },
    },
    "3": {
      key: "3",
      label: "三类合约",
      meta: type3Source.meta,
      items: type3Items,
      filters: {
        prefixes: unique(type3Items.map((item) => item.prefix)),
      },
    },
    low: {
      key: "low",
      label: "低消方案等级",
      meta: lowSource.meta,
      items: lowItems,
      filters: {
        grades: ["银卡", "金卡", "白金卡", "钻石卡", "多档规则", "未标注"],
      },
    },
  };

  for (const dataset of Object.values(definitions)) {
    dataset.meta = { ...dataset.meta, total: dataset.items.length };
  }
  return definitions;
}

const datasets = buildDatasets();

function securityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  );
}

function send(res, status, body, contentType, method = "GET", cacheControl = "no-store") {
  const payload = Buffer.isBuffer(body) ? body : Buffer.from(String(body));
  securityHeaders(res);
  res.writeHead(status, {
    "Content-Type": contentType,
    "Content-Length": payload.length,
    "Cache-Control": cacheControl,
  });
  res.end(method === "HEAD" ? undefined : payload);
}

function sendJson(res, status, body, method) {
  send(res, status, JSON.stringify(body), "application/json; charset=utf-8", method);
}

function positiveInteger(value, fallback, maximum) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, maximum);
}

function catalogSummary() {
  return Object.fromEntries(Object.values(datasets).map((dataset) => [dataset.key, {
    key: dataset.key,
    label: dataset.label,
    total: dataset.items.length,
    meta: dataset.meta,
  }]));
}

function resolveDataset(searchParams) {
  return datasets[searchParams.get("type") || "3"] || datasets["3"];
}

function queryDataset(searchParams) {
  const dataset = resolveDataset(searchParams);
  const query = (searchParams.get("q") || "").trim();
  const terms = query.toLocaleLowerCase("zh-CN").split(/\s+/).filter(Boolean);
  const filters = {
    prefix: dataset.key === "2" || dataset.key === "3" ? (searchParams.get("prefix") || "").trim() : "",
    category: dataset.key === "2" ? (searchParams.get("category") || "").trim() : "",
    grade: dataset.key === "low" ? (searchParams.get("grade") || "").trim() : "",
  };
  const filtered = dataset.items.filter((item) => {
    if (filters.prefix && item.prefix !== filters.prefix) return false;
    if (filters.category && item.category !== filters.category) return false;
    if (filters.grade && item.grade !== filters.grade) return false;
    return terms.every((term) => item.searchText.includes(term));
  });
  return { dataset, query, filters, filtered };
}

function publicItem(item) {
  const { searchText, ...result } = item;
  return result;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function csvDefinition(type) {
  if (type === "2") {
    return {
      fileName: "北京移动二类合约查询结果.csv",
      headers: ["序号", "合约编码", "前缀", "合约名称", "分类", "金额", "合约期(月)", "生效时间", "失效时间", "长期", "状态"],
      row: (item) => [item.row, item.id, item.prefix, item.name, item.category, item.amount, item.duration, item.start, item.end, item.long, item.status],
    };
  }
  if (type === "low") {
    return {
      fileName: "北京移动低消合约方案对应等级查询结果.csv",
      headers: ["序号", "低消合约方案", "生效全球通等级", "多档规则"],
      row: (item) => [item.row, item.name, item.grade, item.rule],
    };
  }
  return {
    fileName: "北京移动三类合约查询结果.csv",
    headers: ["序号", "策划ID", "前缀", "策划名称"],
    row: (item) => [item.row, item.id, item.prefix, item.name],
  };
}

function sendContracts(res, searchParams, method) {
  const page = positiveInteger(searchParams.get("page"), 1, 100000);
  const pageSize = positiveInteger(searchParams.get("pageSize"), 50, 200);
  const { dataset, query, filters, filtered } = queryDataset(searchParams);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;

  sendJson(res, 200, {
    type: dataset.key,
    label: dataset.label,
    meta: dataset.meta,
    catalogs: catalogSummary(),
    filters: dataset.filters,
    activeFilters: filters,
    query,
    page: currentPage,
    pageSize,
    total: filtered.length,
    totalPages,
    items: filtered.slice(start, start + pageSize).map(publicItem),
  }, method);
}

function sendCsv(res, searchParams, method) {
  const { dataset, filtered } = queryDataset(searchParams);
  const definition = csvDefinition(dataset.key);
  const rows = [definition.headers, ...filtered.map(definition.row)];
  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}\r\n`;
  const fileName = encodeURIComponent(definition.fileName);
  securityHeaders(res);
  res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${fileName}`);
  send(res, 200, csv, "text/csv; charset=utf-8", method);
}

function serveStatic(res, pathname, method) {
  const target = STATIC_FILES.get(pathname);
  if (!target) return false;
  const [fileName, contentType] = target;
  try {
    const body = fs.readFileSync(path.join(PUBLIC_DIR, fileName));
    send(res, 200, body, contentType, method, "public, max-age=300");
  } catch {
    sendJson(res, 500, { error: "static_asset_unavailable" }, method);
  }
  return true;
}

function createApp() {
  return http.createServer((req, res) => {
    const method = req.method || "GET";
    if (method !== "GET" && method !== "HEAD") {
      res.setHeader("Allow", "GET, HEAD");
      return sendJson(res, 405, { error: "method_not_allowed" }, method);
    }

    let requestUrl;
    try {
      requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    } catch {
      return sendJson(res, 400, { error: "invalid_url" }, method);
    }

    if (requestUrl.pathname === "/api/health") {
      return sendJson(res, 200, {
        ok: true,
        service: "contract-query",
        records: Object.fromEntries(Object.values(datasets).map((dataset) => [dataset.key, dataset.items.length])),
        uptimeSeconds: Math.floor(process.uptime()),
      }, method);
    }
    if (requestUrl.pathname === "/api/catalogs") {
      return sendJson(res, 200, { catalogs: catalogSummary() }, method);
    }
    if (requestUrl.pathname === "/api/contracts") {
      return sendContracts(res, requestUrl.searchParams, method);
    }
    if (requestUrl.pathname === "/api/contracts.csv") {
      return sendCsv(res, requestUrl.searchParams, method);
    }
    if (requestUrl.pathname.startsWith("/api/")) {
      return sendJson(res, 404, { error: "not_found" }, method);
    }
    if (serveStatic(res, requestUrl.pathname, method)) return;
    return sendJson(res, 404, { error: "not_found" }, method);
  });
}

if (require.main === module) {
  createApp().listen(PORT, HOST, () => {
    const counts = Object.values(datasets).map((dataset) => `${dataset.label}:${dataset.items.length}`).join(" ");
    console.log(`contract-query listening on http://${HOST}:${PORT} (${counts})`);
  });
}

module.exports = { createApp, datasets, queryDataset };

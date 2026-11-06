const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");
const { createGridCatalog } = require("./grid-catalog");
const { createTariffStore, statusFor } = require("./tariff-store");
const { createTariffMonitor } = require("./tariff-sync");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 3002);
const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DATA_DIR = path.join(ROOT_DIR, "data");
const gridCatalog = createGridCatalog();
const tariffStore = createTariffStore({ dataDir: DATA_DIR });

const STATIC_FILES = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/app.js", ["app.js", "application/javascript; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/cmcc-logo.png", ["cmcc-logo.png", "image/png"]],
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
  return fields.map((field) => typeof item[field] === "object" ? JSON.stringify(item[field]) : item[field] ?? "").join(" ").toLocaleLowerCase("zh-CN");
}

function contractPrice(item, type) {
  if (type === "grid") return null;
  const amounts = type === "low" ? (item.variants || []).map((variant) => variant.amount) : [item.amount];
  const supplied = amounts.map((value) => String(value ?? "").trim()).filter((value) => value && !/^[—–-]+$/.test(value));
  if (supplied.length) {
    const values = supplied.map((value) => /^(\d+(?:\.\d+)?)\s*(?:元|档)?$/.exec(value));
    if (values.some((value) => !value)) return null;
    const prices = [...new Set(values.map((value) => Number(value[1])))];
    return prices.length === 1 ? prices[0] : null;
  }
  const name = String(item.name || "");
  const discounted = /折后\s*(\d+(?:\.\d+)?)\s*元/.exec(name);
  if (discounted) return Number(discounted[1]);
  const prices = [...new Set([...name.matchAll(/(?:^|[^\d.])(\d+(?:\.\d+)?)\s*(?:元|档)/g)].map((match) => Number(match[1])))];
  return prices.length === 1 ? prices[0] : null;
}

function priceBound(value) {
  if (value === null || value.trim() === "") return null;
  if (!/^\d+(?:\.\d{1,2})?$/.test(value.trim()) || !Number.isFinite(Number(value))) {
    throw new RangeError("价格须为非负数，最多保留两位小数");
  }
  return Number(value);
}

const CATEGORY_RULES = [
  ["吉祥号码", /吉祥号码|靓号/],
  ["政企合约", /政企|企业/],
  ["信用购机", /信用购|购机套餐折扣/],
  ["金币/AI豆", /金币|AI豆/i],
  ["宽带/家庭融合", /宽带|爱家|全家|家庭|融合/],
  ["会员/权益", /会员|权益|特权|PLUS|速通|礼券/i],
  ["终端/设备", /终端|购机|云PAD|CPE|云电脑|算力主机|一体机/i],
  ["套餐/资费", /套餐|畅享|智享|5GA/i],
  ["流量包", /流量|\d+\s*GB/i],
  ["直降/折扣", /直降|折扣|优惠/],
  ["礼包/福袋", /礼包|福袋|好礼/],
  ["全球通专享", /全球通|钻石卡合约/],
  ["承诺消费/保底", /承诺|低消|保底|预存/],
];

function contractCategory(name) {
  return CATEGORY_RULES.find(([, pattern]) => pattern.test(String(name || "")))?.[0] || "其他";
}

const VIEW_LABELS = { current: "当前清单", added: "更新区（新增）", removed: "删减区", changed: "内容变更" };
const FIELD_LABELS = { name: "名称", grade: "全球通等级", rule: "多档规则", start: "生效时间", end: "失效时间" };

function comparable(value) {
  return String(value ?? "").replace(/[\s；;]/g, "").replace(/[（【]/g, "(").replace(/[）】]/g, ")");
}

function compareRecords(key, current, previous) {
  const identity = (item) => key === "low" ? item.key : item.id;
  const oldMap = new Map(previous.map((item) => [identity(item), item]));
  const newKeys = new Set(current.map(identity));
  const added = [], changed = [];
  const fields = key === "low" ? ["grade", "rule"] : key === "2" ? ["name", "start", "end"] : ["name"];
  const items = current.map((item) => {
    const old = oldMap.get(identity(item));
    if (!old) {
      const addedItem = { ...item, changeStatus: "added" };
      added.push(addedItem);
      return addedItem;
    }
    const changes = fields.filter((field) => comparable(item[field]) !== comparable(old[field])).map((field) => ({
      field, label: FIELD_LABELS[field], before: old[field] || "", after: item[field] || "",
    }));
    if (changes.length) {
      const changedItem = { ...item, changeStatus: "changed", changes };
      changed.push(changedItem);
      return changedItem;
    }
    return { ...item, changeStatus: "unchanged" };
  });
  return { current: items, added, changed, removed: previous.filter((item) => !newKeys.has(identity(item))).map((item) => ({ ...item, changeStatus: "removed" })) };
}

function buildDatasets() {
  const definitions = {};
  for (const [key, file, label] of [["2", "type2.json", "二类合约"], ["3", "contracts.json", "三类合约"], ["low", "low-consumption.json", "低消方案等级"], ["grid", "grid-businesses.json", "业务大全"]]) {
    const source = loadJson(file);
    let comparison = null;
    let views;
    if (key !== "grid") {
      const baselinePath = path.resolve(DATA_DIR, source.meta.baselineFile);
      if (!baselinePath.startsWith(DATA_DIR + path.sep)) throw new Error("Invalid baseline path");
      const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"))[key];
      views = compareRecords(key, source.contracts, baseline.contracts);
      comparison = {
        baseline: { ...baseline.meta, rawTotal: baseline.meta.total, total: baseline.contracts.length },
        matching: key === "low" ? "按规范化方案名称比对；同名策划 ID 合并为一项，新增 ID 不单独算新增方案。" : "按合约编码比对；同编码改名归入内容变更。",
        counts: Object.fromEntries(Object.entries(views).map(([view, items]) => [view, items.length])),
      };
    } else {
      views = { current: source.contracts };
    }
    for (const [view, items] of Object.entries(views)) {
      views[view] = items.map((item) => {
        const record = ["3", "low"].includes(key) ? { ...item, category: contractCategory(item.name) } : item;
        return { ...record, price: contractPrice(item, key), searchText: searchable(record, Object.keys(record)) };
      });
    }
    const all = [...views.current, ...(views.removed || [])];
    definitions[key] = {
      key, label, meta: source.meta, items: views.current, views, comparison,
      filters: {
        prefixes: unique(all.map((item) => item.prefix)),
        categories: unique(all.map((item) => item.category)),
        grades: unique(all.map((item) => item.grade)),
      },
    };
  }
  return definitions;
}

const datasets = buildDatasets();

function validateGridLinks(links) {
  const result = new Map();
  if (!links || typeof links !== "object" || Array.isArray(links)) throw new Error("Invalid grid link file");
  const identifiers = new Set(datasets.grid.items.map((item) => item.id));
  for (const [identifier, original] of Object.entries(links)) {
    let parsed;
    try {
      parsed = new URL(original);
    } catch {
      throw new Error(`Invalid original grid link: ${identifier}`);
    }
    if (!identifiers.has(identifier) || typeof original !== "string" || /[\r\n]/.test(original)
        || parsed.origin !== "https://ysmapp.bj.10086.cn" || parsed.username || parsed.password
        || !/^\/+app\/+channel-web\/+busiCore\/+showIndexCommon\.action$/.test(parsed.pathname)
        || parsed.searchParams.getAll("submitWarePackageId").length !== 1
        || parsed.searchParams.get("submitWarePackageId") !== identifier) {
      throw new Error(`Invalid original grid link: ${identifier}`);
    }
    result.set(identifier, original);
  }
  return result;
}

function loadGridLinks() {
  const file = path.join(DATA_DIR, "grid-links.local.json");
  try {
    return validateGridLinks(JSON.parse(fs.readFileSync(file, "utf8")));
  } catch (error) {
    if (error.code === "ENOENT") return new Map();
    throw error;
  }
}

const originalGridLinks = loadGridLinks();

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
  const catalogs = Object.fromEntries(Object.values(datasets).map((dataset) => [dataset.key, {
    key: dataset.key,
    label: dataset.label,
    total: dataset.items.length,
    meta: dataset.meta,
    comparison: dataset.comparison,
  }]));
  const tariffs = tariffData();
  catalogs.tariff = { key: "tariff", label: "资费快捷查询", total: tariffs.items.length, meta: tariffs.meta };
  return catalogs;
}

function resolveDataset(searchParams) {
  const type = searchParams.get("type") || "3";
  return Object.hasOwn(datasets, type) ? datasets[type] : datasets["3"];
}

function queryDataset(searchParams) {
  const dataset = resolveDataset(searchParams);
  const requestedView = searchParams.get("view") || "current";
  const view = Object.hasOwn(dataset.views, requestedView) ? requestedView : "current";
  const query = (searchParams.get("q") || "").trim();
  const terms = query.toLocaleLowerCase("zh-CN").split(/\s+/).filter(Boolean);
  const filters = {
    prefix: dataset.key === "2" || dataset.key === "3" ? (searchParams.get("prefix") || "").trim() : "",
    category: dataset.key !== "grid" ? (searchParams.get("category") || "").trim() : "",
    grade: dataset.key === "low" ? (searchParams.get("grade") || "").trim() : "",
    minPrice: dataset.key === "grid" ? null : priceBound(searchParams.get("minPrice")),
    maxPrice: dataset.key === "grid" ? null : priceBound(searchParams.get("maxPrice")),
  };
  if (filters.minPrice !== null && filters.maxPrice !== null && filters.minPrice > filters.maxPrice) {
    throw new RangeError("最高价格不能低于最低价格");
  }
  const sort = dataset.key !== "grid" && ["price-asc", "price-desc"].includes(searchParams.get("sort")) ? searchParams.get("sort") : "";
  const filtered = dataset.views[view].filter((item) => {
    if (filters.prefix && item.prefix !== filters.prefix) return false;
    if (filters.category && item.category !== filters.category) return false;
    if (filters.grade && item.grade !== filters.grade) return false;
    if (filters.minPrice !== null && (item.price === null || item.price < filters.minPrice)) return false;
    if (filters.maxPrice !== null && (item.price === null || item.price > filters.maxPrice)) return false;
    return terms.every((term) => item.searchText.includes(term));
  });
  if (sort) {
    filtered.sort((left, right) => {
      if (left.price === null) return right.price === null ? 0 : 1;
      if (right.price === null) return -1;
      return sort === "price-asc" ? left.price - right.price : right.price - left.price;
    });
  }
  return { dataset, view, query, filters, sort, filtered };
}

function publicItem(item) {
  const { searchText, ...result } = item;
  return result;
}

function csvCell(value) {
  const raw = String(value ?? "");
  const text = /^[=+@-]/.test(raw) ? `'${raw}` : raw;
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
      headers: ["序号", "低消合约方案", "分类", "生效全球通等级", "多档规则", "策划ID", "编码生效详情"],
      row: (item) => [item.row, item.name, item.category, item.grade, item.rule, (item.ids || []).join(" / "), (item.variants || []).map((v) => `${v.id} | ${v.kind} | 承诺金额:${v.amount || "未标注"} | 合约期:${v.duration || "未标注"} | 是否立即生效:${v.immediate || "未标注"} | ${v.note}`).join("\n")],
    };
  }
  if (type === "grid") {
    return {
      fileName: "北京移动网格通业务查询结果.csv",
      headers: ["序号", "业务ID", "业务名称", "档位数", "档位及子业务", "业务入口", "源表备注"],
      row: (item) => [item.row, item.id, item.name, item.optionCount, item.details, `https://contracts.1008086.xyz${item.url}`, item.note],
    };
  }
  return {
    fileName: "北京移动三类合约查询结果.csv",
    headers: ["序号", "策划ID", "前缀", "策划名称", "分类", "生效时间", "失效时间"],
    row: (item) => [item.row, item.id, item.prefix, item.name, item.category, item.start, item.end],
  };
}

function sendContracts(res, searchParams, method) {
  const page = positiveInteger(searchParams.get("page"), 1, 100000);
  const pageSize = positiveInteger(searchParams.get("pageSize"), 50, 200);
  const { dataset, view, query, filters, sort, filtered } = queryDataset(searchParams);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;

  sendJson(res, 200, {
    type: dataset.key,
    label: dataset.label,
    view,
    viewLabel: VIEW_LABELS[view],
    comparison: dataset.comparison,
    meta: dataset.meta,
    catalogs: catalogSummary(),
    filters: dataset.filters,
    activeFilters: filters,
    sort,
    query,
    page: currentPage,
    pageSize,
    total: filtered.length,
    totalPages,
    items: filtered.slice(start, start + pageSize).map(publicItem),
  }, method);
}

function sendCsv(res, searchParams, method) {
  const { dataset, view, filtered } = queryDataset(searchParams);
  const definition = csvDefinition(dataset.key);
  const priceHeaders = dataset.key === "grid" ? [] : ["价格（元）"];
  const rows = [[...definition.headers, ...priceHeaders, "对比状态", "变更前后"], ...filtered.map((item) => [...definition.row(item), ...(dataset.key === "grid" ? [] : [item.price]),
    ({ added: "新增", removed: "旧版移除", changed: "内容变更", unchanged: "未变更" })[item.changeStatus] || "",
    (item.changes || []).map((change) => `${change.label}: ${change.before || "未标注"} → ${change.after || "未标注"}`).join("\n")])];
  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}\r\n`;
  const fileName = encodeURIComponent(`${VIEW_LABELS[view]}-${definition.fileName}`);
  securityHeaders(res);
  res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${fileName}`);
  send(res, 200, csv, "text/csv; charset=utf-8", method);
}

function tariffData() {
  const stored = tariffStore.load();
  const all = (stored.current || []).map((item) => ({ ...item, status: statusFor(item) }));
  return {
    items: all,
    changes: stored.changes || [],
    meta: stored.meta || { province: process.env.TARIFF_PROVINCE || "北京市", updatedAt: "", count: all.length, baseline: true },
  };
}

function tariffQuery(searchParams) {
  const data = tariffData();
  const query = (searchParams.get("q") || "").trim().toLocaleLowerCase("zh-CN");
  const terms = query.split(/\s+/).filter(Boolean);
  const status = searchParams.get("status") || "";
  const category = searchParams.get("category") || "";
  const range = searchParams.get("range") || "";
  const tariffType = searchParams.get("tariffType") || "";
  const view = ["current", "added", "removed", "changed"].includes(searchParams.get("view")) ? searchParams.get("view") : "current";
  const source = view === "current" ? data.items : data.changes.filter((item) => item.changeStatus === (view === "added" ? "added" : view === "removed" ? "removed" : "changed"));
  const filtered = source.filter((item) => {
    if (status && item.status !== status) return false;
    if (category && !(item.categories || []).includes(category)) return false;
    if (range && !(item.rangeTabs || []).includes(range)) return false;
    if (tariffType && !(item.tariffTypes || []).includes(tariffType)) return false;
    const text = JSON.stringify(item).toLocaleLowerCase("zh-CN");
    return terms.every((term) => text.includes(term));
  });
  const pageSize = positiveInteger(searchParams.get("pageSize"), 50, 200);
  const page = positiveInteger(searchParams.get("page"), 1, 100000);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  return {
    data, view, query, status, category, range, tariffType, filtered, page: currentPage, pageSize, totalPages,
    items: filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
  };
}

function tariffCatalog(data) {
  const collect = (field) => [...new Set(data.items.flatMap((item) => Array.isArray(item[field]) ? item[field] : []))]
    .sort((a, b) => String(a).localeCompare(String(b), "zh-CN"));
  return { categories: collect("categories"), ranges: collect("rangeTabs"), tariffTypes: collect("tariffTypes"), statuses: ["online", "pending", "offline"] };
}

function sendTariffs(res, searchParams, method) {
  const result = tariffQuery(searchParams);
  return sendJson(res, 200, {
    type: "tariff", label: "中国移动资费公示专区", view: result.view,
    viewLabel: ({ current: "当前资费", added: "新增资费", removed: "消失/下架资费", changed: "内容或日期变更" })[result.view],
    meta: result.data.meta, catalogs: { ...catalogSummary(), tariff: { key: "tariff", label: "资费快捷查询", total: result.data.items.length, meta: result.data.meta } }, catalog: tariffCatalog(result.data), filters: { categories: tariffCatalog(result.data).categories, ranges: tariffCatalog(result.data).ranges, tariffTypes: tariffCatalog(result.data).tariffTypes }, changes: {
      added: result.data.changes.filter((item) => item.changeStatus === "added").length,
      removed: result.data.changes.filter((item) => item.changeStatus === "removed").length,
      changed: result.data.changes.filter((item) => item.changeStatus === "changed").length,
    },
    activeFilters: { status: result.status, category: result.category, range: result.range, tariffType: result.tariffType },
    query: result.query, page: result.page, pageSize: result.pageSize, total: result.filtered.length, totalPages: result.totalPages,
    items: result.items, lastChanges: result.data.changes.slice(0, 20),
  }, method);
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

function createApp({ gridLinks = originalGridLinks, gridCatalogHandler = gridCatalog, tariffMonitor = null } = {}) {
  return http.createServer(async (req, res) => {
    const method = req.method || "GET";

    let requestUrl;
    try {
      requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    } catch {
      return sendJson(res, 400, { error: "invalid_url" }, method);
    }

    // 网格通知识库包含受保护的 POST 管理接口；其他服务接口仍只允许读请求。
    if (requestUrl.pathname.startsWith("/api/grid-catalog")) {
      if (!["GET", "HEAD", "POST"].includes(method)) {
        res.setHeader("Allow", "GET, HEAD, POST");
        return sendJson(res, 405, { error: "method_not_allowed" }, method);
      }
      if (await gridCatalogHandler.handle(req, res, requestUrl, sendJson, send)) return;
    } else if (method !== "GET" && method !== "HEAD") {
      res.setHeader("Allow", "GET, HEAD");
      return sendJson(res, 405, { error: "method_not_allowed" }, method);
    }

    if (requestUrl.pathname === "/api/health") {
      const tariffs = tariffData();
      return sendJson(res, 200, {
        ok: true,
        service: "contract-query",
        version: "20261106-tariff-query-1",
        records: Object.fromEntries(Object.values(datasets).map((dataset) => [dataset.key, dataset.items.length])),
        tariff: { province: tariffs.meta.province, updatedAt: tariffs.meta.updatedAt, count: tariffs.items.length, changes: tariffs.changes.length },
        gridLinks: { available: gridLinks.size, total: datasets.grid.items.length },
        uptimeSeconds: Math.floor(process.uptime()),
      }, method);
    }
    if (requestUrl.pathname === "/api/catalogs") {
      return sendJson(res, 200, { catalogs: catalogSummary() }, method);
    }
    if (requestUrl.pathname === "/api/tariffs") {
      return sendTariffs(res, requestUrl.searchParams, method);
    }
    if (requestUrl.pathname === "/api/tariffs/status") {
      const data = tariffData();
      return sendJson(res, 200, { meta: data.meta, changes: data.changes.slice(0, 20), catalog: tariffCatalog(data) }, method);
    }
    if (["/api/contracts", "/api/contracts.csv"].includes(requestUrl.pathname)) {
      try {
        return requestUrl.pathname.endsWith(".csv")
          ? sendCsv(res, requestUrl.searchParams, method)
          : sendContracts(res, requestUrl.searchParams, method);
      } catch (error) {
        if (error instanceof RangeError) return sendJson(res, 400, { error: "invalid_price_range", message: error.message }, method);
        throw error;
      }
    }
    if (requestUrl.pathname === "/api/grid/open") {
      const identifier = requestUrl.searchParams.get("businessId") || "";
      if (!datasets.grid.items.some((item) => item.id === identifier)) {
        return sendJson(res, 404, { error: "grid_business_not_found" }, method);
      }
      const original = gridLinks.get(identifier);
      if (!original) return sendJson(res, 503, { error: "grid_original_link_unavailable" }, method);
      // Preserve the imported path, but send only the business identifier.
      const target = new URL(original);
      target.search = new URLSearchParams({ submitWarePackageId: identifier }).toString();
      target.hash = "";
      securityHeaders(res);
      res.writeHead(302, { Location: target.href, "Cache-Control": "no-store", "Content-Length": 0 });
      return res.end();
    }
    if (requestUrl.pathname.startsWith("/api/")) {
      return sendJson(res, 404, { error: "not_found" }, method);
    }
    if (serveStatic(res, requestUrl.pathname, method)) return;
    return sendJson(res, 404, { error: "not_found" }, method);
  });
}

if (require.main === module) {
  const monitor = createTariffMonitor({ store: tariffStore });
  monitor.start();
  createApp({ tariffMonitor: monitor }).listen(PORT, HOST, () => {
    const counts = Object.values(datasets).map((dataset) => `${dataset.label}:${dataset.items.length}`).join(" ");
    console.log(`contract-query listening on http://${HOST}:${PORT} (${counts})`);
  });
}

module.exports = { createApp, datasets, queryDataset, validateGridLinks, contractPrice, contractCategory, tariffData, tariffQuery, tariffStore };

"use strict";

const app = document.querySelector("#app");
const toastRegion = document.querySelector("#toast-region");

const ROUTES = [
  { id: "overview", path: "/v2", label: "总览", title: "运行总览", subtitle: "服务健康、当前事件与运行任务", icon: "dashboard", group: "workspace" },
  { id: "services", path: "/v2/services", label: "服务", title: "服务中心", subtitle: "按运行链路与服务能力管理", icon: "server", group: "workspace" },
  { id: "releases", path: "/v2/releases", label: "发布", title: "发布中心", subtitle: "构建、部署、验证与回滚记录", icon: "package", group: "workspace" },
  { id: "operations", path: "/v2/operations", label: "操作", title: "操作中心", subtitle: "互斥任务、执行阶段与操作输出", icon: "operations", group: "workspace" },
  { id: "logs", path: "/v2/logs", label: "日志", title: "日志", subtitle: "服务与操作日志", icon: "logs", group: "system" },
  { id: "storage", path: "/v2/storage", label: "存储", title: "存储", subtitle: "日志、备份、缓存与构建产物", icon: "storage", group: "system" },
  { id: "settings", path: "/v2/settings", label: "系统", title: "系统", subtitle: "基础设施、服务清单与配置漂移", icon: "settings", group: "system" },
];

const ACTIONS = {
  start: {
    label: "启动",
    icon: "play",
    tone: "primary",
    description: "启动服务进程并执行端口与公网后检。",
    impacts: ["启动目标 PM2 进程", "等待端口进入监听", "执行应用与公网检测"],
  },
  restart: {
    label: "重启",
    icon: "restart",
    tone: "primary",
    description: "重新加载服务进程，期间可能出现短暂连接中断。",
    impacts: ["重启目标 PM2 进程", "现有连接可能短暂中断", "等待端口与公网恢复"],
  },
  stop: {
    label: "停止",
    icon: "stop",
    tone: "danger",
    description: "只停止目标业务进程，管理台与基础设施保持运行。",
    impacts: ["目标服务将停止响应", "Nginx、Tunnel、数据库与管理台不会停止", "需要再次启动才能恢复服务"],
    typed: true,
  },
  build: {
    label: "构建",
    icon: "build",
    tone: "primary",
    description: "在隔离候选目录生成并校验新产物，不切换线上产物或服务进程。",
    impacts: ["在当前本地代码上执行构建", "校验入口及本地脚本和样式引用", "校验结束后清理候选目录"],
  },
  test: {
    label: "测试",
    icon: "scan",
    tone: "default",
    description: "执行服务清单中固定的测试或校验命令。",
    impacts: ["只执行服务清单中的白名单测试命令", "不会切换线上产物", "测试结果进入操作记录"],
  },
  deploy: {
    label: "部署",
    icon: "rocket",
    tone: "danger",
    description: "执行预检、构建、产物切换、必要重启与公网验证。",
    impacts: ["基于当前本地代码生成产物", "可能重启目标后端进程", "失败时执行恢复并记录结果"],
    typed: true,
  },
  check: {
    label: "检测",
    icon: "scan",
    tone: "default",
    description: "检查进程、端口、应用与公网链路。",
  },
  logs: {
    label: "日志",
    icon: "terminal",
    tone: "default",
    description: "查看目标服务最近日志。",
  },
};

const ACTION_LABELS = {
  ...Object.fromEntries(Object.entries(ACTIONS).map(([key, value]) => [key, value.label])),
  "check-all": "检测全部",
  "start-all": "启动所选服务",
  "restart-all": "重启所选服务",
  "stop-all": "停止所选服务",
  "storage-clear-cache": "清理推荐缓存",
  "storage-cleanup-expired": "清理过期项",
  "storage-delete": "删除存储项",
  "admin-delete": "删除管理员",
  rollback: "回滚",
};

const STATUS_LABELS = {
  healthy: "健康",
  degraded: "降级",
  unavailable: "不可用",
  operating: "操作中",
  unmanaged: "未纳管",
  unknown: "未知",
  online: "在线",
  stopped: "已停止",
  queued: "等待执行",
  running: "执行中",
  completed: "成功",
  success: "成功",
  failed: "失败",
  warning: "警告",
  error: "错误",
  locked: "已锁定",
};

const LAYER_LABELS = {
  process: "进程",
  port: "端口",
  app: "应用",
  nginx: "Nginx",
  tunnel: "Tunnel",
  public: "公网",
  artifact: "产物",
};

const STORAGE_TYPE_LABELS = {
  backup: "备份",
  log: "日志",
  cache: "缓存",
  artifact: "产物",
  dependency: "依赖",
  other: "其他",
};

const DEFAULT_SETTINGS = {
  theme: localStorage.getItem("project-ops-theme") || "light",
  refreshSeconds: Number(localStorage.getItem("project-ops-refresh") || 30),
};

const state = {
  route: "overview",
  drawerServiceId: null,
  drawerReturnPath: null,
  operationDrawerId: null,
  navOpen: false,
  initialized: false,
  loading: new Set(),
  errors: {},
  overview: null,
  services: [],
  operations: [],
  inventory: null,
  logs: null,
  storage: null,
  session: null,
  adminsData: null,
  lastUpdated: null,
  actionBusy: null,
  credentialBusy: false,
  confirm: null,
  serviceFilters: { search: "", status: "all", capability: "all" },
  operationFilters: { status: "all", action: "all", search: "" },
  logFilters: { serviceId: "all", source: "all", level: "all" },
  storageFilters: { type: "all" },
  selectedServices: new Set(),
  selectedStorage: new Set(),
  settings: DEFAULT_SETTINGS,
  pollTimer: null,
  operationPollTimer: null,
  focusReturnStack: [],
  pendingFocusSelector: "",
};

function icon(name, className = "") {
  return `<svg class="icon ${className}" aria-hidden="true"><use href="#icon-${escapeHtml(name)}"></use></svg>`;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return Object.values(value);
  return [];
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  return new Intl.NumberFormat("zh-CN").format(Number(value));
}

function formatBytes(value) {
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

function formatDuration(value) {
  if (value === null || value === undefined || value === "") return "—";
  const milliseconds = Number(value);
  if (!Number.isFinite(milliseconds) || milliseconds < 0) return "—";
  const seconds = Math.floor(milliseconds / 1000);
  if (seconds < 60) return `${seconds} 秒`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} 分 ${seconds % 60} 秒`;
  const hours = Math.floor(minutes / 60);
  return `${hours} 小时 ${minutes % 60} 分`;
}

function formatUptime(value) {
  if (!value) return "—";
  const numeric = Number(value);
  const timestamp = Number.isFinite(numeric) ? numeric : new Date(value).getTime();
  const milliseconds = timestamp > 10_000_000_000 ? Date.now() - timestamp : timestamp;
  if (!Number.isFinite(milliseconds) || milliseconds < 0) return "—";
  const seconds = Math.floor(milliseconds / 1000);
  if (seconds < 60) return `${seconds} 秒`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小时`;
  return `${Math.floor(seconds / 86400)} 天`;
}

function formatDate(value, options = {}) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  if (options.dateOnly) return date.toLocaleDateString("zh-CN");
  return date.toLocaleString("zh-CN", { hour12: false });
}

function relativeTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const difference = Date.now() - date.getTime();
  if (difference < 0) return formatDate(value);
  const seconds = Math.floor(difference / 1000);
  if (seconds < 10) return "刚刚";
  if (seconds < 60) return `${seconds} 秒前`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} 天前`;
  return formatDate(value, { dateOnly: true });
}

function redactText(value = "") {
  return String(value)
    .replace(/(authorization\s*[:=]\s*(?:bearer\s+)?)[^\s,;]+/gi, "$1[REDACTED]")
    .replace(/((?:cookie|set-cookie)\s*[:=]\s*)[^\r\n]+/gi, "$1[REDACTED]")
    .replace(/\b(postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^\s]+/gi, "$1://[REDACTED]")
    .replace(/((?:password|passwd|secret|session_secret|access_token|refresh_token|api_key)\s*[:=]\s*)[^\s,;]+/gi, "$1[REDACTED]");
}

function statusLabel(status) {
  return STATUS_LABELS[status] || status || "未知";
}

function actionLabel(action) {
  return ACTION_LABELS[action] || action || "操作";
}

function roleLabel(role) {
  return { owner: "所有者", operator: "运维员", viewer: "只读成员" }[role] || role || "成员";
}

function canOperateCurrentUser() {
  return ["owner", "operator"].includes(state.session?.admin?.role);
}

function isCurrentUserOwner() {
  return state.session?.admin?.role === "owner";
}

function disabledReason(action = "write") {
  if (action === "owner" && !isCurrentUserOwner()) return "仅所有者可执行";
  if (!canOperateCurrentUser()) return "当前账号为只读成员";
  if (isOperationBusy()) return "已有运维任务正在执行";
  return "";
}

function rememberFocus(selector) {
  if (selector) state.focusReturnStack.push(selector);
}

function restoreFocus(selector = state.focusReturnStack.pop() || "") {
  if (!selector) return;
  queueMicrotask(() => document.querySelector(selector)?.focus());
}

function normalizeStateValue(input) {
  if (input === true) return "ok";
  if (input === false) return "fail";
  if (input === null || input === undefined || input === "") return "unknown";
  if (typeof input === "number") {
    if (input >= 200 && input < 400) return "ok";
    if (input >= 400 && input < 500) return "warn";
    if (input >= 500 || input === 0) return "fail";
  }
  const text = String(input).trim().toLowerCase();
  if (/^\d{3}$/.test(text)) return normalizeStateValue(Number(text));
  if (["ok", "healthy", "online", "up", "open", "listening", "ready", "passed", "success", "available", "active", "true"].includes(text)) return "ok";
  if (["warn", "warning", "degraded", "duplicate", "partial", "stale", "4xx", "blocked", "protected", "pending-auth"].includes(text)) return "warn";
  if (["fail", "failed", "error", "offline", "down", "closed", "stopped", "unavailable", "unhealthy", "missing", "false", "5xx"].includes(text)) return "fail";
  if (["busy", "running", "operating", "building", "deploying", "checking", "pending", "queued"].includes(text)) return "busy";
  if (["na", "n/a", "none", "not_applicable", "not-applicable"].includes(text)) return "na";
  return "unknown";
}

function normalizeLayer(input, fallbackDetail = "") {
  if (input && typeof input === "object" && !Array.isArray(input)) {
    const rawState = firstDefined(input.state, input.status, input.ok, input.open, input.exists, input.healthy, input.available, input.code);
    return {
      state: normalizeStateValue(rawState),
      detail: String(firstDefined(input.detail, input.message, input.reason, input.label, input.code, fallbackDetail) || ""),
      checkedAt: firstDefined(input.checkedAt, input.updatedAt, input.timestamp),
    };
  }
  return {
    state: normalizeStateValue(input),
    detail: String(firstDefined(input, fallbackDetail) || ""),
    checkedAt: null,
  };
}

function explicitHealthStatus(rawStatus) {
  const status = String(rawStatus || "").toLowerCase();
  if (["healthy", "ok", "available"].includes(status)) return "healthy";
  if (["degraded", "warning", "warn"].includes(status)) return "degraded";
  if (["unavailable", "down", "failed", "error", "offline", "stopped"].includes(status)) return "unavailable";
  if (["operating", "running", "building", "deploying", "restarting", "checking"].includes(status)) return "operating";
  if (["unmanaged", "drift", "unconfigured"].includes(status)) return "unmanaged";
  return null;
}

function normalizeService(raw = {}) {
  const backend = raw.backend || {};
  const build = raw.build || null;
  const frontend = raw.frontend || (build ? { cwd: build.cwd, dist: build.artifact, build: build.command, distExists: raw.artifact?.exists } : null);
  const health = raw.health || {};
  const layersSource = raw.layers || raw.checks || health.layers || {};
  const processInput = firstDefined(layersSource.process, layersSource.pm2, health.process, raw.process, raw.processStatus, raw.pm2Status, backend.status, raw.status);
  const portInput = firstDefined(layersSource.port, health.port, raw.port, raw.portStatus, raw.portListening, backend.portListening);
  const appInput = firstDefined(layersSource.app, layersSource.application, health.app, health.application, raw.application, raw.appHealth, raw.appHealthy);
  const nginxInput = firstDefined(layersSource.nginx, health.nginx, raw.nginx);
  const tunnelInput = firstDefined(layersSource.tunnel, layersSource.cloudflare, health.tunnel, raw.tunnel);
  const publicInput = firstDefined(layersSource.public, layersSource.https, health.public, health.https, raw.public, raw.publicHealth, raw.httpsStatus, raw.publicCode, raw.httpCode);
  const processDetail = firstDefined(backend.pm2Name, raw.pm2Name, "未返回进程状态");
  const portNumber = firstDefined(backend.port, raw.port?.number, raw.portNumber, raw.listenPort, typeof raw.port === "number" ? raw.port : null);
  const publicLayer = Array.isArray(publicInput)
    ? {
        state: publicInput.length ? (publicInput.every((item) => normalizeStateValue(firstDefined(item?.state, item?.ok, item?.code)) === "ok") ? "ok" : publicInput.some((item) => normalizeStateValue(firstDefined(item?.state, item?.ok, item?.code)) === "fail") ? "fail" : "warn") : "unknown",
        detail: publicInput.map((item) => `${item?.domain || "HTTPS"} ${item?.code || "000"}`).join(" · "),
        checkedAt: null,
      }
    : normalizeLayer(publicInput, firstDefined(raw.domain, raw.domains?.[0], "未返回公网状态"));
  const layers = {
    process: normalizeLayer(processInput, processDetail),
    port: normalizeLayer(portInput, portNumber ? `${portNumber}` : "未配置端口"),
    app: normalizeLayer(appInput, firstDefined(raw.healthPath, health.path, "未返回应用检测")),
    nginx: normalizeLayer(nginxInput, "未返回 Nginx 状态"),
    tunnel: normalizeLayer(tunnelInput, "未返回 Tunnel 状态"),
    public: publicLayer,
    artifact: frontend
      ? normalizeLayer(firstDefined(layersSource.artifact, raw.artifact, raw.distExists, frontend.distExists), firstDefined(frontend.dist, raw.dist, "构建产物"))
      : { state: "na", detail: "无独立前端产物", checkedAt: null },
  };

  const requiredLayerStates = [layers.process.state, layers.port.state, layers.app.state, layers.public.state];
  const explicit = explicitHealthStatus(firstDefined(health.status, raw.healthStatus, raw.overallStatus, raw.availability, raw.status));
  let overallStatus = explicit || "unknown";
  if (raw.operating || raw.operation?.status === "running") overallStatus = "operating";
  else if (requiredLayerStates.includes("fail")) overallStatus = "unavailable";
  else if (requiredLayerStates.includes("warn") || [layers.nginx.state, layers.tunnel.state, layers.artifact.state].includes("warn")) overallStatus = "degraded";
  else if (requiredLayerStates.includes("busy")) overallStatus = "operating";
  else if (!explicit && requiredLayerStates.filter((value) => value === "ok").length >= 3) overallStatus = "healthy";

  let capabilities = Array.isArray(raw.capabilities) ? raw.capabilities : Array.isArray(raw.actions) ? raw.actions : [];
  capabilities = capabilities.map((item) => typeof item === "string" ? item : item?.id).filter(Boolean);
  if (!capabilities.length) {
    capabilities = ["start", "stop", "restart", "check", "logs"];
    if (frontend) capabilities.push("build", "deploy");
  }

  const domain = String(firstDefined(raw.domain, raw.domains?.[0], raw.host, "") || "");
  return {
    ...raw,
    id: String(firstDefined(raw.id, raw.key, backend.pm2Name, domain, "unknown")),
    name: String(firstDefined(raw.name, raw.label, backend.pm2Name, domain, "未命名服务")),
    domain,
    url: String(firstDefined(raw.url, domain ? `https://${domain}/` : "") || ""),
    aliases: toArray(firstDefined(raw.aliases, raw.domains)).filter((item) => item !== domain),
    directory: String(firstDefined(raw.directory, raw.cwd, frontend?.cwd, "") || ""),
    runtime: String(firstDefined(raw.runtime, backend.runtime, "Node.js") || ""),
    backend: {
      ...backend,
      pm2Name: String(firstDefined(backend.pm2Name, raw.pm2Name, raw.process?.name, raw.processName, "") || ""),
      port: portNumber ?? null,
    },
    frontend,
    capabilities: [...new Set(capabilities)],
    layers,
    overallStatus,
    statusMessage: String(firstDefined(health.message, raw.statusMessage, raw.message, raw.issues?.[0]?.message, raw.description, "") || ""),
    cpu: Number(firstDefined(raw.cpu, raw.process?.cpu, backend.cpu, 0)) || 0,
    memory: Number(firstDefined(raw.memory, raw.process?.memory, backend.memory, 0)) || 0,
    uptime: firstDefined(raw.uptime, raw.process?.uptime, backend.uptime, raw.startedAt),
    restarts: Number(firstDefined(raw.restarts, raw.process?.restarts, backend.restarts, 0)) || 0,
    artifactUpdatedAt: firstDefined(raw.artifactUpdatedAt, raw.artifact?.modifiedAt, raw.buildAt, frontend?.updatedAt, raw.distModifiedAt),
    lastOperation: raw.lastOperation || null,
  };
}

function normalizeServices(payload) {
  const list = Array.isArray(payload)
    ? payload
    : firstDefined(payload?.services, payload?.projects, payload?.items, payload?.data?.services, payload?.data, []);
  return toArray(list).map(normalizeService).filter((service) => service.id !== "unknown");
}

function normalizeOperation(raw = {}) {
  let status = String(firstDefined(raw.status, raw.state, "") || "").toLowerCase();
  if (!status && raw.ok === true) status = "completed";
  if (!status && raw.ok === false) status = "failed";
  if (!status && raw.finishedAt) status = "completed";
  if (!status && raw.startedAt) status = "running";
  if (["done", "succeeded", "success", "ok"].includes(status)) status = "completed";
  if (["error", "failure"].includes(status)) status = "failed";
  if (["pending", "waiting"].includes(status)) status = "queued";
  const startedAt = firstDefined(raw.startedAt, raw.createdAt, raw.timestamp);
  const finishedAt = firstDefined(raw.finishedAt, raw.completedAt, raw.endedAt);
  const durationMs = firstDefined(raw.durationMs, raw.duration, startedAt && finishedAt ? new Date(finishedAt) - new Date(startedAt) : null);
  const explicitServiceIds = firstDefined(raw.serviceIds, raw.meta?.serviceIds);
  const serviceIds = Array.isArray(explicitServiceIds)
    ? explicitServiceIds
    : [firstDefined(raw.serviceId, raw.projectId, raw.target)].filter(Boolean).flatMap((value) => String(value).split(",").filter(Boolean));
  const stages = toArray(firstDefined(raw.stages, raw.steps)).map((stage, index) => ({
    id: String(firstDefined(stage.id, stage.name, index)),
    name: String(firstDefined(stage.name, stage.label, stage.title, `阶段 ${index + 1}`)),
    status: String(firstDefined(stage.status, stage.state, stage.ok === true ? "completed" : stage.ok === false ? "failed" : "queued")),
    detail: String(firstDefined(stage.detail, stage.message, stage.command, "") || ""),
    startedAt: firstDefined(stage.startedAt, stage.createdAt),
    finishedAt: firstDefined(stage.finishedAt, stage.completedAt),
  }));
  return {
    ...raw,
    id: String(firstDefined(raw.id, raw.operationId, `${startedAt || Date.now()}-${raw.action || "operation"}`)),
    action: String(firstDefined(raw.action, raw.type, raw.commandName, "operation")),
    target: String(firstDefined(raw.targetName, raw.target, raw.serviceName, serviceIds.join(", "), "系统")),
    serviceIds: serviceIds.map(String),
    status: status || "unknown",
    stage: String(firstDefined(raw.stage, raw.currentStage, stages.find((item) => item.status === "running")?.name, "") || ""),
    progress: clamp(firstDefined(raw.progress, raw.percent, status === "completed" ? 100 : 0), 0, 100),
    startedAt,
    finishedAt,
    durationMs,
    operator: String(firstDefined(raw.operator, raw.actor, "管理员")),
    command: redactText(firstDefined(raw.command, raw.commandSummary, "") || ""),
    output: redactText(firstDefined(raw.output, raw.stdout, "") || ""),
    error: redactText(firstDefined(raw.error, raw.stderr, "") || ""),
    stages,
  };
}

function normalizeOperations(payload) {
  const list = Array.isArray(payload)
    ? payload
    : firstDefined(payload?.operations, payload?.jobs, payload?.items, payload?.history, payload?.data?.operations, payload?.data, []);
  const withActive = firstDefined(payload?.active, payload?.activeOperation, payload?.currentOperation)
    ? [firstDefined(payload.active, payload.activeOperation, payload.currentOperation), ...toArray(list)]
    : toArray(list);
  const seen = new Set();
  return withActive
    .map(normalizeOperation)
    .filter((operation) => !seen.has(operation.id) && seen.add(operation.id))
    .sort((a, b) => new Date(b.startedAt || b.finishedAt || 0) - new Date(a.startedAt || a.finishedAt || 0));
}

function normalizeOverview(payload) {
  const overview = payload && typeof payload === "object" ? payload : {};
  const events = toArray(firstDefined(overview.events, overview.incidents, overview.alerts)).map((event, index) => ({
    id: String(firstDefined(event.id, `${event.serviceId || "system"}-${event.type || index}`)),
    serviceId: String(firstDefined(event.serviceId, event.projectId, "") || ""),
    title: String(firstDefined(event.title, event.name, event.serviceName ? `${event.serviceName} · ${statusLabel(event.status)}` : null, event.message, "运行事件")),
    detail: String(firstDefined(event.detail, event.description, event.reason, event.serviceName ? event.message : null, "") || ""),
    severity: String(firstDefined(event.severity, event.level, event.status === "unavailable" ? "critical" : event.status === "healthy" ? "info" : "warning")).toLowerCase(),
    layer: String(firstDefined(event.layer, event.type, "") || ""),
    createdAt: firstDefined(event.createdAt, event.detectedAt, event.timestamp),
  }));
  return {
    ...overview,
    summary: overview.summary || overview.metrics || overview.counts || {},
    events,
    currentOperation: firstDefined(overview.currentOperation, overview.activeOperation, overview.active) ? normalizeOperation(firstDefined(overview.currentOperation, overview.activeOperation, overview.active)) : null,
    updatedAt: firstDefined(overview.updatedAt, overview.generatedAt, overview.checkedAt, overview.timestamp),
  };
}

function normalizeInventory(payload) {
  const inventory = payload && typeof payload === "object" ? payload : {};
  const rawInfrastructure = firstDefined(inventory.infrastructure, inventory.dependencies, inventory.systems, []);
  const infrastructure = Array.isArray(rawInfrastructure)
    ? rawInfrastructure
    : Object.entries(rawInfrastructure || {}).map(([id, value]) => typeof value === "object" ? { id, ...value } : { id, status: value });
  const drifts = toArray(firstDefined(inventory.drifts, inventory.drift, inventory.mismatches, inventory.warnings)).map((item, index) => ({
    id: String(firstDefined(item.id, `${item.type || "drift"}-${index}`)),
    type: String(firstDefined(item.type, item.layer, "configuration")),
    title: String(firstDefined(item.title, item.name, item.message, "配置差异")),
    detail: String(firstDefined(item.detail, item.description, item.reason, "") || ""),
    severity: ["error", "failed", "critical"].includes(String(firstDefined(item.severity, item.level, "warning")).toLowerCase()) ? "critical" : String(firstDefined(item.severity, item.level, "warning")).toLowerCase(),
    serviceId: String(firstDefined(item.serviceId, item.projectId, "") || ""),
  }));
  return {
    ...inventory,
    infrastructure: infrastructure.map((item, index) => ({
      ...item,
      id: String(firstDefined(item.id, item.key, item.name, index)),
      name: String(firstDefined(item.name, item.label, item.id, "基础设施")),
      status: String(firstDefined(item.status, item.state, item.ok === true ? "healthy" : item.ok === false ? "unavailable" : "unknown")).toLowerCase(),
      detail: String(firstDefined(item.detail, item.message, item.version, item.endpoint, "") || ""),
    })),
    drifts,
    security: inventory.security || {},
    manifest: inventory.manifest || inventory.catalog || {},
    version: String(firstDefined(inventory.version, inventory.schemaVersion, inventory.manifestVersion, inventory.catalog?.version, "—")),
  };
}

function normalizeStorage(payload) {
  const storage = payload && typeof payload === "object" ? payload : {};
  const items = toArray(firstDefined(storage.items, storage.entries, storage.data)).map((item, index) => ({
    ...item,
    id: String(firstDefined(item.id, item.path, index)),
    type: String(firstDefined(item.type, item.kind, "other")),
    label: String(firstDefined(item.label, item.name, item.path, "存储项")),
    path: String(firstDefined(item.path, "") || ""),
    size: Number(firstDefined(item.size, item.bytes, 0)) || 0,
    modifiedAt: firstDefined(item.modifiedAt, item.updatedAt, item.createdAt),
    recommended: Boolean(firstDefined(item.recommended, item.suggested, false)),
    removable: firstDefined(item.removable, item.locked === true ? false : undefined, true) !== false,
    locked: Boolean(firstDefined(item.locked, item.inUse, false)) || item.removable === false,
    reason: String(firstDefined(item.reason, item.detail, "") || ""),
  }));
  const computedSummary = items.reduce((summary, item) => {
    summary.count += 1;
    summary.totalSize += item.size;
    summary.byType[item.type] ||= { count: 0, size: 0 };
    summary.byType[item.type].count += 1;
    summary.byType[item.type].size += item.size;
    if (item.recommended && item.removable) {
      summary.recommended.count += 1;
      summary.recommended.size += item.size;
    }
    return summary;
  }, { count: 0, totalSize: 0, byType: {}, recommended: { count: 0, size: 0 } });
  return {
    ...storage,
    items,
    summary: { ...computedSummary, ...(storage.summary || {}) },
    retentionDays: Number(firstDefined(storage.retentionDays, storage.retention, 30)) || 30,
  };
}

function normalizeLogs(payload) {
  const entries = [];
  const rawLogs = Array.isArray(payload)
    ? payload
    : firstDefined(payload?.logs, payload?.entries, payload?.items, payload?.data, payload?.output ? [{ message: payload.output, source: payload.source, serviceId: payload.serviceId }] : payload?.stdout ? [{ message: payload.stdout }] : []);
  for (const [index, item] of toArray(rawLogs).entries()) {
    if (typeof item === "string") {
      for (const [lineIndex, line] of item.split(/\r?\n/).entries()) {
        if (line) entries.push({ id: `${index}-${lineIndex}`, timestamp: null, source: "service", level: "info", message: redactText(line) });
      }
      continue;
    }
    const text = redactText(firstDefined(item.message, item.line, item.output, item.stdout, item.error, "") || "");
    const lines = text.split(/\r?\n/).filter(Boolean);
    for (const [lineIndex, line] of lines.entries()) {
      entries.push({
        id: String(firstDefined(item.id, `${index}-${lineIndex}`)),
        timestamp: firstDefined(item.timestamp, item.createdAt, item.startedAt, item.finishedAt),
        source: String(firstDefined(item.source, item.serviceId, item.target, item.action, "service")),
        serviceId: String(firstDefined(item.serviceId, item.projectId, "") || ""),
        level: String(firstDefined(item.level, item.ok === false ? "error" : "info")).toLowerCase(),
        message: line,
      });
    }
  }
  const newestFirst = Array.isArray(payload?.logs) && payload?.source === "operations";
  return { entries: newestFirst ? entries.slice(0, 300) : entries.slice(-300), updatedAt: firstDefined(payload?.updatedAt, new Date().toISOString()) };
}

function humanError(error) {
  const code = String(error?.code || error?.message || "");
  const labels = {
    unauthorized: "登录状态已失效",
    bad_password: "管理口令不正确",
    rate_limited: "登录尝试过多，请稍后再试",
    login_rate_limited: "登录尝试过多，请稍后再试",
    operation_busy: "已有运维任务正在执行",
    unknown_project: "未找到目标服务",
    unknown_service: "未找到目标服务",
    unsupported_action: "该服务不支持此操作",
    service_capability_denied: "该服务未配置此操作能力",
    protected_service: "受保护服务不允许停止",
    protected_service_requires_individual_action: "受保护服务只能单独操作",
    manual_service_requires_individual_action: "待鉴权服务只能在详情中单独操作",
    invalid_action: "操作参数无效",
    invalid_bulk_action: "批量操作参数无效",
    storage_selection_required: "请先选择可删除的存储项",
    invalid_username: "用户名需为 3-32 位字母、数字、点、横线或下划线",
    username_exists: "该管理员用户名已存在",
    password_too_short: "密码至少需要 12 位",
    password_too_long: "密码不能超过 256 位",
    current_password_incorrect: "当前密码不正确",
    password_unchanged: "新密码不能与当前密码相同",
    password_change_rate_limited: "当前密码连续输错，请稍后再试",
    use_password_change_endpoint: "请使用“修改密码”并验证当前密码",
    owner_required: "只有 Owner 可以执行此操作",
    operator_required: "当前账号只有查看权限",
    service_scope_denied: "当前账号没有该项目权限",
    cannot_disable_self: "不能停用当前登录账号",
    cannot_delete_self: "不能删除当前登录账号",
    last_owner_required: "系统必须保留至少一个可用 Owner",
    origin_not_allowed: "请求来源未通过安全校验",
    not_found: "接口尚未提供",
  };
  return labels[code] || redactText(error?.detail || error?.message || "请求失败");
}

async function api(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout || 30_000);
  const headers = { accept: "application/json", ...(options.headers || {}) };
  if (options.body && !headers["content-type"]) headers["content-type"] = "application/json";
  let response;
  try {
    response = await fetch(path, {
      credentials: "same-origin",
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeout);
    const requestError = new Error(error.name === "AbortError" ? "请求超时" : "无法连接管理服务");
    requestError.code = error.name === "AbortError" ? "timeout" : "network_error";
    throw requestError;
  }
  clearTimeout(timeout);
  if (response.status === 204) return null;
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text ? { message: text } : null;
  }
  if (!response.ok) {
    const error = new Error(firstDefined(data?.error, data?.message, data?.stderr, `HTTP ${response.status}`));
    error.status = response.status;
    error.code = firstDefined(data?.code, data?.error, response.status === 409 ? "operation_busy" : null);
    error.detail = firstDefined(data?.detail, data?.message, data?.stderr);
    error.data = data;
    throw error;
  }
  return data;
}

function routeStateFromLocation() {
  const path = location.pathname.replace(/\/+$/, "") || "/";
  if (["/login", "/v2/login"].includes(path)) return { route: "login", drawerServiceId: null };
  const serviceMatch = path.match(/^\/v2\/services\/([^/]+)$/);
  if (serviceMatch) return { route: "services", drawerServiceId: decodeURIComponent(serviceMatch[1]) };
  const matched = ROUTES.find((route) => route.path === path || (route.id === "overview" && ["/v2.html", "/v2/"].includes(location.pathname)));
  return { route: matched?.id || "overview", drawerServiceId: null };
}

function routeInfo(routeId = state.route) {
  return ROUTES.find((route) => route.id === routeId) || ROUTES[0];
}

function navigate(path, options = {}) {
  if (options.replace) history.replaceState({}, "", path);
  else history.pushState({}, "", path);
  const next = routeStateFromLocation();
  state.route = next.route;
  state.drawerServiceId = next.drawerServiceId;
  state.drawerReturnPath = null;
  state.operationDrawerId = null;
  state.navOpen = false;
  render();
  if (state.route !== "login") loadRouteData(false);
}

function applyTheme(theme) {
  const next = theme === "dark" ? "dark" : "light";
  state.settings.theme = next;
  document.documentElement.dataset.theme = next;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "dark" ? "#111617" : "#f3f5f6");
  localStorage.setItem("project-ops-theme", next);
}

function currentOperation() {
  if (state.actionBusy) {
    return {
      id: "local-pending-operation",
      action: state.actionBusy.action,
      target: state.actionBusy.target,
      serviceIds: state.actionBusy.serviceIds || [],
      status: "running",
      stage: "正在提交并执行操作",
      progress: 12,
      startedAt: state.actionBusy.startedAt,
      local: true,
    };
  }
  if (state.overview?.currentOperation && ["running", "queued"].includes(state.overview.currentOperation.status)) return state.overview.currentOperation;
  return state.operations.find((operation) => ["running", "queued"].includes(operation.status)) || null;
}

function isOperationBusy() {
  return Boolean(state.actionBusy || currentOperation());
}

function serviceById(serviceId) {
  return state.services.find((service) => service.id === serviceId) || null;
}

function operationById(operationId) {
  return state.operations.find((operation) => operation.id === operationId) || null;
}

function serviceName(serviceId) {
  return serviceById(serviceId)?.name || serviceId || "系统";
}

function operationForService(serviceId) {
  return state.operations.find((operation) => operation.serviceIds.includes(serviceId) && ["running", "queued"].includes(operation.status)) || null;
}

function latestOperationForService(serviceId) {
  return state.operations.find((operation) => operation.serviceIds.includes(serviceId)) || null;
}

function showToast(title, message = "", tone = "info", timeout = 4500) {
  const id = `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const iconName = tone === "success" ? "check" : tone === "error" ? "error" : tone === "warning" ? "alert" : "info";
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.dataset.tone = tone;
  toast.dataset.toastId = id;
  toast.innerHTML = `
    ${icon(iconName)}
    <div class="toast-copy"><strong>${escapeHtml(title)}</strong>${message ? `<span>${escapeHtml(message)}</span>` : ""}</div>
    <button type="button" class="icon-button button-ghost" data-dismiss-toast="${id}" aria-label="关闭通知">${icon("close")}</button>
  `;
  toastRegion.append(toast);
  if (timeout) setTimeout(() => document.querySelector(`[data-toast-id="${CSS.escape(id)}"]`)?.remove(), timeout);
}

function setLoading(key, value) {
  if (value) state.loading.add(key);
  else state.loading.delete(key);
}

function setError(key, error) {
  if (error) state.errors[key] = humanError(error);
  else delete state.errors[key];
}

function handleUnauthorized(error) {
  if (error?.status !== 401) return false;
  clearTimeout(state.operationPollTimer);
  if (state.route === "login" || location.pathname.replace(/\/+$/, "") === "/v2/login") {
    state.route = "login";
    state.initialized = false;
    render();
    return true;
  }
  const target = `${location.pathname}${location.search}`;
  history.replaceState({}, "", `/v2/login?next=${encodeURIComponent(target.startsWith("/v2") ? target : "/v2")}`);
  state.route = "login";
  state.drawerServiceId = null;
  state.operationDrawerId = null;
  state.initialized = false;
  render();
  return true;
}

async function bootstrap(options = {}) {
  if (state.loading.has("bootstrap")) return;
  setLoading("bootstrap", true);
  if (!options.silent) render();
  const overviewResult = await Promise.allSettled([api("/api/v2/overview")]).then(([result]) => result);
  if (overviewResult.status === "rejected" && overviewResult.reason?.status === 401) {
    setLoading("bootstrap", false);
    handleUnauthorized(overviewResult.reason);
    return;
  }
  let embeddedServices = [];
  if (overviewResult.status === "fulfilled") {
    state.overview = normalizeOverview(overviewResult.value);
    embeddedServices = normalizeServices(firstDefined(state.overview.services, state.overview.projects, []));
    if (embeddedServices.length) {
      state.services = embeddedServices;
      setError("services", null);
    }
    setError("overview", null);
  } else {
    setError("overview", overviewResult.reason);
  }

  const requests = [
    ["session", "/api/v2/session", (value) => value],
    ["operations", "/api/v2/operations", normalizeOperations],
    ["inventory", "/api/v2/inventory", normalizeInventory],
    ...(!embeddedServices.length ? [["services", "/api/v2/services", normalizeServices]] : []),
  ];
  const results = await Promise.allSettled(requests.map(([, path]) => api(path)));
  const unauthorized = results.find((result) => result.status === "rejected" && result.reason?.status === 401);
  if (unauthorized) {
    setLoading("bootstrap", false);
    handleUnauthorized(unauthorized.reason);
    return;
  }
  results.forEach((result, index) => {
    const [key, , normalizer] = requests[index];
    if (result.status === "fulfilled") {
      state[key] = normalizer(result.value);
      setError(key, null);
    } else {
      setError(key, result.reason);
    }
  });
  if (!state.operations.length && state.overview) {
    const embedded = normalizeOperations(firstDefined(state.overview.operations, state.overview.recentOperations, state.overview.jobs, []));
    if (embedded.length) state.operations = embedded;
  }
  const selectableServiceIds = new Set(state.services
    .filter((service) => !service.protected && service.automaticOperations !== false)
    .map((service) => service.id));
  state.selectedServices = new Set([...state.selectedServices].filter((id) => selectableServiceIds.has(id)));
  state.initialized = true;
  state.lastUpdated = new Date();
  setLoading("bootstrap", false);
  const active = currentOperation();
  if (active && !active.local) scheduleOperationPoll(active.id);
  render();
  schedulePolling();
  await loadRouteData(Boolean(options.force));
}

async function loadLogs(force = false) {
  if (state.loading.has("logs") || (state.logs && !force)) return;
  setLoading("logs", true);
  setError("logs", null);
  render();
  const params = new URLSearchParams();
  if (state.logFilters.serviceId !== "all") params.set("serviceId", state.logFilters.serviceId);
  if (state.logFilters.source !== "all") params.set("source", state.logFilters.source);
  if (state.logFilters.level !== "all") params.set("level", state.logFilters.level);
  try {
    const query = params.toString();
    state.logs = normalizeLogs(await api(`/api/v2/logs${query ? `?${query}` : ""}`));
  } catch (error) {
    if (handleUnauthorized(error)) return;
    setError("logs", error);
  } finally {
    setLoading("logs", false);
    render();
  }
}

async function loadStorage(force = false) {
  if (state.loading.has("storage") || (state.storage && !force)) return;
  setLoading("storage", true);
  setError("storage", null);
  render();
  try {
    state.storage = normalizeStorage(await api("/api/v2/storage"));
    const validIds = new Set(state.storage.items.filter((item) => item.removable).map((item) => item.id));
    state.selectedStorage = new Set([...state.selectedStorage].filter((id) => validIds.has(id)));
  } catch (error) {
    if (handleUnauthorized(error)) return;
    setError("storage", error);
  } finally {
    setLoading("storage", false);
    render();
  }
}

async function loadRouteData(force = false) {
  if (state.route === "logs") return loadLogs(force);
  if (state.route === "storage") return loadStorage(force);
  if (state.route === "settings" && state.session?.admin?.role === "owner") return loadAdmins(force);
}

async function loadAdmins(force = false) {
  if (state.loading.has("admins") || (state.adminsData && !force)) return;
  setLoading("admins", true);
  try {
    state.adminsData = await api("/api/v2/admins");
    setError("admins", null);
  } catch (error) {
    if (handleUnauthorized(error)) return;
    setError("admins", error);
  } finally {
    setLoading("admins", false);
    render();
  }
}

async function refreshCurrent() {
  if (state.loading.has("bootstrap")) return;
  await bootstrap({ force: true, silent: true });
  showToast("状态已刷新", `更新时间 ${new Date().toLocaleTimeString("zh-CN", { hour12: false })}`, "success", 2600);
}

function schedulePolling() {
  clearInterval(state.pollTimer);
  const seconds = Number(state.settings.refreshSeconds);
  if (!Number.isFinite(seconds) || seconds <= 0) return;
  state.pollTimer = setInterval(() => {
    if (document.visibilityState !== "visible" || state.actionBusy || state.confirm) return;
    bootstrap({ silent: true });
  }, seconds * 1000);
}

function renderStatusBadge(status, customLabel = "") {
  const normalized = String(status || "unknown").toLowerCase();
  return `<span class="status-badge" data-status="${escapeHtml(normalized)}"><span class="status-dot" aria-hidden="true"></span>${escapeHtml(customLabel || statusLabel(normalized))}</span>`;
}

function renderLayerState(layer, label = "") {
  const stateValue = layer?.state || "unknown";
  const iconName = stateValue === "ok" ? "check" : stateValue === "fail" ? "error" : stateValue === "warn" ? "alert" : stateValue === "busy" ? "refresh" : "info";
  const accessible = `${label || "状态"}：${stateValue === "ok" ? "正常" : stateValue === "fail" ? "失败" : stateValue === "warn" ? "警告" : stateValue === "busy" ? "操作中" : stateValue === "na" ? "不适用" : "未知"}${layer?.detail ? `，${layer.detail}` : ""}`;
  return `<span class="layer-state" data-state="${escapeHtml(stateValue)}" aria-label="${escapeHtml(accessible)}">${stateValue === "na" ? "—" : icon(iconName)}</span>`;
}

function renderLoadingState(label = "正在加载...") {
  return `<div class="loading-state"><span class="spinner" aria-hidden="true"></span><p>${escapeHtml(label)}</p></div>`;
}

function renderErrorState(message, retryTarget = "refresh") {
  return `
    <div class="error-state">
      ${icon("error")}
      <p>${escapeHtml(message || "数据加载失败")}</p>
      <button type="button" class="button button-sm" data-action="${escapeHtml(retryTarget)}">${icon("refresh")}重试</button>
    </div>
  `;
}

function renderEmptyState(title, detail = "") {
  return `
    <div class="empty-state">
      ${icon("info")}
      <p>${escapeHtml(title)}</p>
      ${detail ? `<small>${escapeHtml(detail)}</small>` : ""}
    </div>
  `;
}

function skeletonBlock(className = "") {
  return `<span class="skeleton-block ${className}" aria-hidden="true"></span>`;
}

function renderMetricSkeletons() {
  return `<section class="metric-grid skeleton-metric-grid" aria-label="正在加载运行指标" aria-busy="true">${Array.from({ length: 4 }, (_, index) => `
    <article class="metric-card skeleton-metric-card">
      <div class="metric-copy">
        ${skeletonBlock(`skeleton-text skeleton-label skeleton-width-${index % 2 ? "md" : "sm"}`)}
        ${skeletonBlock(`skeleton-value skeleton-width-${index === 1 ? "lg" : "sm"}`)}
        ${skeletonBlock(`skeleton-text skeleton-note skeleton-width-${index % 2 ? "lg" : "md"}`)}
      </div>
      ${skeletonBlock("skeleton-icon")}
    </article>
  `).join("")}</section>`;
}

function renderEventSkeleton(rows = 2) {
  return `<div class="event-list skeleton-event-list" aria-label="正在加载当前事件" aria-busy="true">${Array.from({ length: rows }, (_, index) => `
    <div class="event-row skeleton-event-row">
      ${skeletonBlock("skeleton-event-icon")}
      <div class="event-copy">
        ${skeletonBlock(`skeleton-text skeleton-title skeleton-width-${index % 2 ? "md" : "lg"}`)}
        ${skeletonBlock(`skeleton-text skeleton-note skeleton-width-${index % 2 ? "lg" : "xl"}`)}
      </div>
      ${skeletonBlock("skeleton-action")}
    </div>
  `).join("")}</div>`;
}

function renderServiceTableSkeleton(rows = 7) {
  const desktopRows = Array.from({ length: rows }, (_, rowIndex) => `
    <tr class="skeleton-service-row">
      <td><span class="skeleton-service-cell">${skeletonBlock("skeleton-service-icon")}<span class="skeleton-service-copy">${skeletonBlock(`skeleton-text skeleton-title skeleton-width-${rowIndex % 3 === 0 ? "lg" : "md"}`)}${skeletonBlock("skeleton-text skeleton-note skeleton-width-lg")}</span></span></td>
      <td>${skeletonBlock("skeleton-pill")}</td>
      ${Array.from({ length: 5 }, () => `<td class="cell-center">${skeletonBlock("skeleton-layer")}</td>`).join("")}
      <td>${skeletonBlock(`skeleton-text skeleton-width-${rowIndex % 2 ? "md" : "lg"}`)}</td>
      <td class="cell-end"><span class="skeleton-row-actions">${skeletonBlock("skeleton-button")}${skeletonBlock("skeleton-more")}</span></td>
    </tr>
  `).join("");
  const mobileRows = Array.from({ length: rows }, (_, rowIndex) => `
    <article class="service-mobile-row skeleton-mobile-service-row">
      <div class="service-mobile-main">
        <div class="service-mobile-header">
          <span class="skeleton-mobile-copy">${skeletonBlock(`skeleton-text skeleton-title skeleton-width-${rowIndex % 2 ? "md" : "lg"}`)}${skeletonBlock("skeleton-text skeleton-note skeleton-width-lg")}</span>
          ${skeletonBlock("skeleton-pill")}
        </div>
        <div class="service-mobile-layers">${Array.from({ length: 4 }, () => skeletonBlock("skeleton-mini-layer")).join("")}</div>
      </div>
      <span class="skeleton-row-actions">${skeletonBlock("skeleton-more")}</span>
    </article>
  `).join("");
  return `
    <div class="skeleton-service-table" aria-label="正在加载服务健康状态" aria-busy="true">
      <div class="desktop-service-table table-scroll">
        <table class="data-table">
          <thead><tr><th>服务</th><th>状态</th><th class="cell-center">进程</th><th class="cell-center">端口</th><th class="cell-center">应用</th><th class="cell-center">公网</th><th class="cell-center">产物</th><th>最近操作</th><th class="cell-end">操作</th></tr></thead>
          <tbody>${desktopRows}</tbody>
        </table>
      </div>
      <div class="mobile-service-list">${mobileRows}</div>
    </div>
  `;
}

function renderOperationSkeleton(rows = 5) {
  return `<div class="operation-list skeleton-operation-list" aria-label="正在加载操作记录" aria-busy="true">${Array.from({ length: rows }, (_, index) => `
    <div class="operation-row skeleton-operation-row">
      ${skeletonBlock("skeleton-operation-indicator")}
      <div class="operation-copy">${skeletonBlock(`skeleton-text skeleton-title skeleton-width-${index % 2 ? "md" : "lg"}`)}${skeletonBlock("skeleton-text skeleton-note skeleton-width-xl")}</div>
      <div class="operation-meta">${skeletonBlock("skeleton-pill")}${skeletonBlock("skeleton-text skeleton-meta")}</div>
    </div>
  `).join("")}</div>`;
}

function renderReleaseSkeleton(rows = 5) {
  return `<div class="release-list skeleton-release-list" aria-label="正在加载发布记录" aria-busy="true">${Array.from({ length: rows }, (_, index) => `
    <div class="release-row skeleton-release-row">
      <div class="release-copy">${skeletonBlock(`skeleton-text skeleton-title skeleton-width-${index % 2 ? "md" : "lg"}`)}${skeletonBlock("skeleton-text skeleton-note skeleton-width-md")}</div>
      ${skeletonBlock("skeleton-pill")}
      <div class="release-meta">${skeletonBlock("skeleton-text skeleton-meta")}${skeletonBlock("skeleton-text skeleton-meta-short")}</div>
    </div>
  `).join("")}</div>`;
}

function renderInfraSkeleton(rows = 4) {
  return `<div class="infra-list skeleton-infra-list" aria-label="正在加载基础设施状态" aria-busy="true">${Array.from({ length: rows }, (_, index) => `
    <div class="infra-row skeleton-infra-row">
      ${skeletonBlock("skeleton-event-icon")}
      <div class="infra-copy">${skeletonBlock(`skeleton-text skeleton-title skeleton-width-${index % 2 ? "md" : "sm"}`)}${skeletonBlock("skeleton-text skeleton-note skeleton-width-lg")}</div>
      ${skeletonBlock("skeleton-pill")}
    </div>
  `).join("")}</div>`;
}

function renderOverviewSkeleton() {
  return `
    <div class="page skeleton-page" aria-busy="true">
      ${renderPageHeader("运行总览", "正在读取服务与基础设施状态", skeletonBlock("skeleton-header-action"))}
      ${renderMetricSkeletons()}
      <section class="section">
        <div class="section-header"><div class="section-heading"><h2>当前事件</h2><p>按公网、端口、进程与配置优先级排序</p></div></div>
        <div class="surface">${renderEventSkeleton(2)}</div>
      </section>
      <section class="section">
        <div class="section-header"><div class="section-heading"><h2>服务健康矩阵</h2><p>进程、端口、应用、公网与构建产物</p></div>${skeletonBlock("skeleton-section-action")}</div>
        <div class="surface">${renderServiceTableSkeleton(7)}</div>
      </section>
      <div class="split-grid">
        <section class="section">
          <div class="section-header"><div class="section-heading"><h2>最近操作</h2><p>服务控制与系统任务</p></div>${skeletonBlock("skeleton-section-action")}</div>
          <div class="surface">${renderOperationSkeleton()}</div>
        </section>
        <section class="section">
          <div class="section-header"><div class="section-heading"><h2>最近发布</h2><p>构建、部署与回滚结果</p></div>${skeletonBlock("skeleton-section-action")}</div>
          <div class="surface">${renderReleaseSkeleton()}</div>
        </section>
      </div>
    </div>
  `;
}

function renderPageHeader(title, subtitle, actions = "") {
  return `
    <header class="page-header">
      <div class="page-heading">
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(subtitle)}</p>
      </div>
      ${actions ? `<div class="page-actions">${actions}</div>` : ""}
    </header>
  `;
}

function renderCurrentOperationBanner(operation = currentOperation()) {
  if (!operation) return "";
  const progress = operation.progress || (operation.status === "running" ? 42 : 0);
  const target = operation.serviceIds.length ? operation.serviceIds.map(serviceName).join("、") : operation.target;
  return `
    <section class="operation-banner" aria-label="当前操作">
      <span class="operation-banner-icon">${state.actionBusy ? '<span class="spinner" aria-hidden="true"></span>' : icon("operations", "icon-lg")}</span>
      <div class="operation-banner-copy">
        <strong>${escapeHtml(actionLabel(operation.action))} · ${escapeHtml(target)}</strong>
        <span>${escapeHtml(operation.stage || statusLabel(operation.status))}${operation.startedAt ? ` · ${escapeHtml(relativeTime(operation.startedAt))}` : ""}</span>
        <span class="progress-track" aria-label="进度 ${progress}%"><span class="progress-bar" style="width:${clamp(progress, 0, 100)}%"></span></span>
      </div>
      ${operation.local ? `<span class="status-badge" data-status="running"><span class="status-dot" aria-hidden="true"></span>提交中</span>` : `<button type="button" class="button button-sm" data-operation-id="${escapeHtml(operation.id)}">${icon("operations")}查看任务</button>`}
    </section>
  `;
}

function navigationCount(routeId) {
  if (routeId === "services") return state.services.length || "";
  if (routeId === "operations") return state.operations.filter((operation) => ["running", "queued"].includes(operation.status)).length || "";
  if (routeId === "settings") return state.inventory?.drifts?.length || "";
  return "";
}

function renderSidebar() {
  const workspaceRoutes = ROUTES.filter((route) => route.group === "workspace");
  const systemRoutes = ROUTES.filter((route) => route.group === "system");
  const renderLinks = (routes) => routes.map((route) => {
    const count = navigationCount(route.id);
    return `
      <a class="nav-link" href="${route.path}" data-route="${route.path}" ${state.route === route.id ? 'aria-current="page"' : ""}>
        ${icon(route.icon)}<span>${escapeHtml(route.label)}</span>${count !== "" ? `<span class="nav-count">${escapeHtml(count)}</span>` : ""}
      </a>
    `;
  }).join("");
  return `
    <aside class="sidebar" aria-label="Project Ops 导航">
      <a class="sidebar-brand" href="/v2" data-route="/v2">
        <span class="brand-mark">${icon("logo", "icon-lg")}</span>
        <span class="brand-copy"><strong>项目运行工作台</strong><span>Project Ops</span></span>
      </a>
      <nav class="sidebar-nav">
        <p class="nav-label">工作台</p>
        ${renderLinks(workspaceRoutes)}
        <p class="nav-label">系统管理</p>
        ${renderLinks(systemRoutes)}
      </nav>
      <footer class="sidebar-footer">
        <div class="sidebar-meta"><span class="environment-state"><span class="environment-dot"></span>管理节点</span><span>${state.lastUpdated ? relativeTime(state.lastUpdated) : "未同步"}</span></div>
      </footer>
    </aside>
  `;
}

function renderTopbar() {
  const route = routeInfo();
  const dark = state.settings.theme === "dark";
  const admin = state.session?.admin;
  const adminName = admin?.displayName || admin?.username || "管理员";
  const adminInitial = adminName.trim().slice(0, 1).toUpperCase() || "管";
  return `
    <header class="topbar">
      <div class="topbar-title">
        <button type="button" class="icon-button button-ghost mobile-menu-button" data-action="toggle-nav" aria-label="打开导航">${icon("menu", "icon-lg")}</button>
        <div class="topbar-title-copy"><strong>${escapeHtml(route.title)}</strong><span>${escapeHtml(route.subtitle)}</span></div>
      </div>
      <div class="topbar-actions">
        <button type="button" class="button button-sm" data-action="refresh" ${state.loading.has("bootstrap") ? "disabled" : ""} aria-label="刷新状态">
          ${state.loading.has("bootstrap") ? '<span class="spinner" aria-hidden="true"></span>' : icon("refresh")}<span class="refresh-label">刷新</span>
        </button>
        <button type="button" class="icon-button button-ghost" data-action="toggle-theme" aria-label="切换为${dark ? "浅色" : "深色"}模式">${icon(dark ? "sun" : "moon")}</button>
        <details class="menu account-menu">
          <summary class="account-trigger" data-focus-id="account-password" aria-label="当前账号：${escapeHtml(adminName)}">
            <span class="account-avatar" aria-hidden="true">${escapeHtml(adminInitial)}</span>
            <span class="account-copy"><strong>${escapeHtml(adminName)}</strong><span>${escapeHtml(roleLabel(admin?.role))}</span></span>
            ${icon("chevron-down")}
          </summary>
          <div class="menu-popover account-popover">
            <div class="account-popover-meta"><strong>${escapeHtml(adminName)}</strong><span>${escapeHtml(admin?.username || "admin")} · ${escapeHtml(roleLabel(admin?.role))}</span></div>
            <button type="button" data-action="change-password">${icon("lock")}修改密码</button>
            <a href="/v2/settings" data-route="/v2/settings">${icon("settings")}账号与系统</a>
            <button type="button" data-action="logout">${icon("logout")}退出登录</button>
          </div>
        </details>
      </div>
    </header>
  `;
}

function renderLogin() {
  document.title = "登录 · CMCC 项目运行工作台";
  app.innerHTML = `
    <section class="login-page">
      <div class="login-shell">
        <header class="login-brand">
          <span class="brand-mark">${icon("logo", "icon-lg")}</span>
          <span class="login-brand-copy"><strong>项目运行工作台</strong><span>Project Ops</span></span>
          <span class="login-environment"><span class="environment-dot"></span>内部管理</span>
        </header>
        <form class="login-form" id="login-form">
          <div class="login-form-header"><h1>登录工作台</h1><p>使用已授权的管理员账号继续。</p></div>
          <div class="form-group">
            <label for="manager-username">用户名</label>
            <div class="input-shell">${icon("user")}<input class="field" id="manager-username" name="username" type="text" value="admin" autocomplete="username" autocapitalize="none" spellcheck="false" required autofocus></div>
          </div>
          <div class="form-group">
            <label for="manager-password">密码</label>
            <div class="input-shell">${icon("lock")}<input class="field" id="manager-password" name="password" type="password" autocomplete="current-password" required aria-describedby="caps-lock-message login-error"><button type="button" class="password-toggle" data-action="toggle-password" aria-label="显示密码">${icon("eye")}</button></div>
            <p class="caps-lock-message" id="caps-lock-message" hidden>${icon("alert")}大写锁定已开启</p>
          </div>
          <button class="button button-primary" type="submit" data-login-submit>${icon("lock")}登录</button>
          <p class="form-error" id="login-error" role="alert" hidden></p>
        </form>
        <footer class="login-footer"><span>${icon("shield")}安全会话最长 8 小时</span><a href="/home">进入旧版工作台</a></footer>
      </div>
    </section>
  `;
}

function deriveEvents() {
  if (state.overview?.events?.length) return state.overview.events;
  const priority = { unavailable: 0, degraded: 1, unmanaged: 2, unknown: 3 };
  return state.services
    .filter((service) => service.overallStatus !== "healthy")
    .map((service) => {
      const failedLayer = Object.entries(service.layers).find(([, layer]) => layer.state === "fail")
        || Object.entries(service.layers).find(([, layer]) => layer.state === "warn")
        || Object.entries(service.layers).find(([, layer]) => layer.state === "unknown");
      const [layerKey, layer] = failedLayer || ["process", { detail: service.statusMessage }];
      return {
        id: `${service.id}-${layerKey}`,
        serviceId: service.id,
        title: `${service.name} · ${statusLabel(service.overallStatus)}`,
        detail: layer.detail || `${LAYER_LABELS[layerKey] || layerKey}状态异常`,
        severity: service.overallStatus === "unavailable" ? "critical" : service.overallStatus === "operating" ? "info" : "warning",
        layer: layerKey,
        priority: priority[service.overallStatus] ?? 4,
      };
    })
    .sort((a, b) => a.priority - b.priority);
}

function overviewMetrics() {
  const summary = state.overview?.summary || {};
  const total = firstDefined(summary.total, summary.services, summary.serviceCount, state.services.length);
  const healthy = firstDefined(summary.healthy, summary.healthyServices, state.services.filter((service) => service.overallStatus === "healthy").length);
  const issues = firstDefined(summary.issues, summary.unhealthy, summary.degradedOrUnavailable, state.services.filter((service) => ["degraded", "unavailable", "unmanaged"].includes(service.overallStatus)).length);
  const running = firstDefined(summary.runningOperations, summary.operations, state.operations.filter((operation) => ["running", "queued"].includes(operation.status)).length);
  return { total, healthy, issues, running };
}

function renderMetricCard(label, value, note, iconName, tone = "default") {
  return `
    <article class="metric-card" data-tone="${escapeHtml(tone)}">
      <div class="metric-copy"><span class="metric-label">${escapeHtml(label)}</span><strong class="metric-value">${escapeHtml(value)}</strong><span class="metric-note">${escapeHtml(note)}</span></div>
      <span class="metric-icon">${icon(iconName)}</span>
    </article>
  `;
}

function renderEvents(events, limit = 6) {
  const shown = events.slice(0, limit);
  if (!shown.length) return renderEmptyState("当前没有运行事件", "服务健康与配置状态未发现异常");
  return `<div class="event-list">${shown.map((event) => `
    <div class="event-row" data-severity="${escapeHtml(event.severity)}">
      <span class="event-icon">${icon(event.severity === "critical" ? "error" : event.severity === "info" ? "info" : "alert")}</span>
      <div class="event-copy"><strong>${escapeHtml(event.title)}</strong><span>${escapeHtml(event.detail || (event.layer ? `${LAYER_LABELS[event.layer] || event.layer}异常` : "待处理"))}</span></div>
      ${event.serviceId ? `<button type="button" class="button button-sm" data-service-id="${escapeHtml(event.serviceId)}" data-open-service>查看</button>` : renderStatusBadge(event.severity === "critical" ? "failed" : "warning")}
    </div>
  `).join("")}</div>`;
}

function servicePrimaryAction(service) {
  const operating = operationForService(service.id);
  if (operating) return { operation: operating };
  if (!canOperateCurrentUser()) return null;
  if (service.overallStatus === "unavailable"
    && service.layers.process.state === "fail"
    && service.capabilities.includes("start")) return { action: "start" };
  if (service.capabilities.includes("check")) return { action: "check" };
  if (service.capabilities.includes("restart")) return { action: "restart" };
  return null;
}

function renderServiceMenu(service, primaryAction = "") {
  const ordered = ["start", "restart", "stop", "test", "build", "deploy", "check", "logs"];
  const actions = ordered.filter((action) => service.capabilities.includes(action) && action !== primaryAction);
  const busy = isOperationBusy();
  return `
    <details class="menu">
      <summary aria-label="${escapeHtml(service.name)}更多操作">${icon("more")}</summary>
      <div class="menu-popover">
        <button type="button" data-open-service data-service-id="${escapeHtml(service.id)}">${icon("server")}服务详情</button>
        ${service.url ? `<a href="${escapeHtml(service.url)}" target="_blank" rel="noreferrer">${icon("external")}打开公网地址</a>` : ""}
        ${actions.map((action) => {
          const config = ACTIONS[action];
          const dangerClass = config.tone === "danger" ? "danger-item" : "";
          const disabled = action !== "logs" && (!canOperateCurrentUser() || busy);
          const reason = disabled ? disabledReason() : "";
          return `<button type="button" class="${dangerClass}" data-service-action="${action}" data-service-id="${escapeHtml(service.id)}" ${disabled ? "disabled" : ""} ${reason ? `title="${escapeHtml(reason)}"` : ""}>${icon(config.icon)}${escapeHtml(config.label)}</button>`;
        }).join("")}
      </div>
    </details>
  `;
}

function renderServiceRow(service) {
  const primary = servicePrimaryAction(service);
  const latest = latestOperationForService(service.id) || service.lastOperation;
  const primaryMarkup = primary?.operation
    ? `<button type="button" class="button button-sm" data-operation-id="${escapeHtml(primary.operation.id)}">${icon("operations")}查看任务</button>`
    : primary?.action
      ? `<button type="button" class="button button-sm ${primary.action === "start" ? "button-primary" : ""}" data-service-action="${primary.action}" data-service-id="${escapeHtml(service.id)}" ${isOperationBusy() ? "disabled" : ""} ${isOperationBusy() ? `title="${escapeHtml(disabledReason())}"` : ""}>${icon(ACTIONS[primary.action].icon)}${escapeHtml(ACTIONS[primary.action].label)}</button>`
      : "";
  return `
    <tr>
      <td class="service-cell">
        <button type="button" class="service-link-button" data-open-service data-service-id="${escapeHtml(service.id)}">
          <span class="service-avatar">${icon("server")}</span>
          <span class="service-copy"><span class="service-name">${escapeHtml(service.name)}</span><span class="service-domain">${escapeHtml(service.domain || service.backend.pm2Name || service.id)}</span></span>
        </button>
      </td>
      <td>${renderStatusBadge(service.overallStatus)}</td>
      <td class="cell-center">${renderLayerState(service.layers.process, "进程")}</td>
      <td class="cell-center">${renderLayerState(service.layers.port, "端口")}</td>
      <td class="cell-center">${renderLayerState(service.layers.app, "应用")}</td>
      <td class="cell-center">${renderLayerState(service.layers.public, "公网")}</td>
      <td class="cell-center">${renderLayerState(service.layers.artifact, "产物")}</td>
      <td><span class="muted nowrap">${latest ? `${escapeHtml(actionLabel(latest.action))} · ${escapeHtml(relativeTime(firstDefined(latest.finishedAt, latest.startedAt)))}` : "暂无记录"}</span></td>
      <td class="cell-end"><span class="row-actions">${primaryMarkup}${renderServiceMenu(service, primary?.action)}</span></td>
    </tr>
  `;
}

function renderMobileServiceRow(service) {
  const primary = servicePrimaryAction(service);
  const primaryMarkup = primary?.operation
    ? `<button type="button" class="icon-button" data-operation-id="${escapeHtml(primary.operation.id)}" aria-label="查看任务">${icon("operations")}</button>`
    : primary?.action
      ? `<button type="button" class="icon-button ${primary.action === "start" ? "button-primary" : ""}" data-service-action="${primary.action}" data-service-id="${escapeHtml(service.id)}" ${isOperationBusy() ? "disabled" : ""} aria-label="${escapeHtml(ACTIONS[primary.action].label)}">${icon(ACTIONS[primary.action].icon)}</button>`
      : "";
  return `
    <article class="service-mobile-row">
      <button type="button" class="service-link-button service-mobile-main" data-open-service data-service-id="${escapeHtml(service.id)}">
        <span class="service-mobile-header"><span class="service-copy"><span class="service-name">${escapeHtml(service.name)}</span><span class="service-domain">${escapeHtml(service.domain || service.backend.pm2Name || service.id)}</span></span>${renderStatusBadge(service.overallStatus)}</span>
        <span class="service-mobile-layers">
          <span class="mini-layer" data-state="${service.layers.process.state}">进程</span>
          <span class="mini-layer" data-state="${service.layers.port.state}">端口</span>
          <span class="mini-layer" data-state="${service.layers.app.state}">应用</span>
          <span class="mini-layer" data-state="${service.layers.public.state}">公网</span>
        </span>
      </button>
      <span class="row-actions">${primaryMarkup}${renderServiceMenu(service, primary?.action)}</span>
    </article>
  `;
}

function renderServiceTable(services) {
  if (!services.length) return renderEmptyState("没有符合条件的服务", "调整状态、能力或名称筛选");
  return `
    <div class="desktop-service-table table-scroll">
      <table class="data-table">
        <thead><tr><th>服务</th><th>状态</th><th class="cell-center">进程</th><th class="cell-center">端口</th><th class="cell-center">应用</th><th class="cell-center">公网</th><th class="cell-center">产物</th><th>最近操作</th><th class="cell-end">操作</th></tr></thead>
        <tbody>${services.map(renderServiceRow).join("")}</tbody>
      </table>
    </div>
    <div class="mobile-service-list">${services.map(renderMobileServiceRow).join("")}</div>
  `;
}

function renderOperationRows(operations, limit = null) {
  const shown = limit ? operations.slice(0, limit) : operations;
  if (!shown.length) return renderEmptyState("暂无操作记录", "服务操作将在这里保留执行状态与输出");
  return `<div class="operation-list">${shown.map((operation) => {
    const target = operation.serviceIds.length ? operation.serviceIds.map(serviceName).join("、") : operation.target;
    const time = firstDefined(operation.finishedAt, operation.startedAt);
    return `
      <button type="button" class="operation-row" data-status="${escapeHtml(operation.status)}" data-operation-id="${escapeHtml(operation.id)}" aria-label="查看 ${escapeHtml(actionLabel(operation.action))} 操作">
        <span class="operation-indicator" aria-hidden="true"></span>
        <div class="operation-copy"><strong>${escapeHtml(actionLabel(operation.action))} · ${escapeHtml(target)}</strong><span>${escapeHtml(operation.stage || statusLabel(operation.status))}${operation.command ? ` · ${escapeHtml(operation.command)}` : ""}</span></div>
        <div class="operation-meta">${renderStatusBadge(operation.status)}<span>${escapeHtml(relativeTime(time))}${operation.durationMs !== null && operation.durationMs !== undefined ? ` · ${escapeHtml(formatDuration(operation.durationMs))}` : ""}</span></div>
      </button>
    `;
  }).join("")}</div>`;
}

function renderReleaseRows(operations, limit = null) {
  const releases = operations.filter((operation) => ["build", "deploy", "rollback", "release"].includes(operation.action));
  const shown = limit ? releases.slice(0, limit) : releases;
  if (!shown.length) return renderEmptyState("暂无发布记录", "构建与部署任务将显示在这里");
  return `<div class="release-list">${shown.map((operation) => {
    const target = operation.serviceIds.length ? operation.serviceIds.map(serviceName).join("、") : operation.target;
    return `
      <button type="button" class="release-row" data-operation-id="${escapeHtml(operation.id)}" aria-label="查看发布记录">
        <div class="release-copy"><strong>${escapeHtml(target)}</strong><span>${escapeHtml(actionLabel(operation.action))}${operation.stage ? ` · ${escapeHtml(operation.stage)}` : ""}</span></div>
        ${renderStatusBadge(operation.status)}
        <div class="release-meta"><span>${escapeHtml(formatDate(firstDefined(operation.finishedAt, operation.startedAt)))}</span><span>${escapeHtml(formatDuration(operation.durationMs))}</span></div>
      </button>
    `;
  }).join("")}</div>`;
}

function renderOverviewPage() {
  if (!state.initialized && state.loading.has("bootstrap")) {
    return renderOverviewSkeleton();
  }
  const metrics = overviewMetrics();
  const events = deriveEvents();
  const issueTone = Number(metrics.issues) > 0 ? "warning" : "success";
  return `
    <div class="page">
      ${renderPageHeader("运行总览", `${formatNumber(metrics.total)} 个应用服务 · ${state.inventory?.infrastructure?.length ? `${formatNumber(state.inventory.infrastructure.length)} 类基础设施` : "运行链路巡检"}`, `
        <button type="button" class="button button-primary" data-global-action="check-all" ${!canOperateCurrentUser() || isOperationBusy() ? "disabled" : ""} title="${escapeHtml(disabledReason())}">${icon("scan")}检测全部</button>
      `)}
      ${state.errors.services ? `<div class="surface">${renderErrorState(state.errors.services)}</div>` : ""}
      ${renderCurrentOperationBanner()}
      <section class="metric-grid" aria-label="运行指标">
        ${renderMetricCard("应用服务", formatNumber(metrics.total), "服务清单总数", "server", "info")}
        ${renderMetricCard("健康服务", `${formatNumber(metrics.healthy)} / ${formatNumber(metrics.total)}`, "核心链路均正常", "check", "success")}
        ${renderMetricCard("当前事件", formatNumber(events.length), Number(metrics.issues) ? `${formatNumber(metrics.issues)} 个服务需处理` : "没有待处理异常", "alert", issueTone)}
        ${renderMetricCard("进行中操作", formatNumber(metrics.running), metrics.running ? "服务端操作锁已占用" : "全局操作锁空闲", "operations", metrics.running ? "info" : "default")}
      </section>

      <section class="section">
        <div class="section-header"><div class="section-heading"><h2>当前事件</h2><p>按公网、端口、进程与配置优先级排序</p></div>${events.length > 6 ? `<button type="button" class="button button-sm" data-route="/v2/services">查看全部</button>` : ""}</div>
        <div class="surface">${renderEvents(events)}</div>
      </section>

      <section class="section">
        <div class="section-header"><div class="section-heading"><h2>服务健康矩阵</h2><p>进程、端口、应用、公网与构建产物</p></div><a class="button button-sm" href="/v2/services" data-route="/v2/services">${icon("server")}服务中心</a></div>
        <div class="surface">${state.services.length ? renderServiceTable(state.services) : state.errors.services ? renderErrorState(state.errors.services) : renderEmptyState("服务清单为空")}</div>
      </section>

      <div class="split-grid">
        <section class="section">
          <div class="section-header"><div class="section-heading"><h2>最近操作</h2><p>服务控制与系统任务</p></div><a class="button button-sm" href="/v2/operations" data-route="/v2/operations">全部记录</a></div>
          <div class="surface">${state.errors.operations ? renderErrorState(state.errors.operations) : renderOperationRows(state.operations, 5)}</div>
        </section>
        <section class="section">
          <div class="section-header"><div class="section-heading"><h2>最近发布</h2><p>构建、部署与回滚结果</p></div><a class="button button-sm" href="/v2/releases" data-route="/v2/releases">发布中心</a></div>
          <div class="surface">${state.errors.operations ? renderErrorState(state.errors.operations) : renderReleaseRows(state.operations, 5)}</div>
        </section>
      </div>
    </div>
  `;
}

function filteredServices() {
  const query = state.serviceFilters.search.trim().toLowerCase();
  return state.services.filter((service) => {
    const matchesSearch = !query || [service.name, service.id, service.domain, service.backend.pm2Name].some((value) => String(value || "").toLowerCase().includes(query));
    const matchesStatus = state.serviceFilters.status === "all" || service.overallStatus === state.serviceFilters.status;
    const matchesCapability = state.serviceFilters.capability === "all" || service.capabilities.includes(state.serviceFilters.capability);
    return matchesSearch && matchesStatus && matchesCapability;
  });
}

function renderServicesPage() {
  const services = filteredServices();
  const statusCounts = state.services.reduce((counts, service) => {
    counts[service.overallStatus] = (counts[service.overallStatus] || 0) + 1;
    return counts;
  }, {});
  return `
    <div class="page">
      ${renderPageHeader("服务中心", `${formatNumber(state.services.length)} 个服务 · ${formatNumber(statusCounts.healthy || 0)} 个健康 · ${formatNumber((statusCounts.degraded || 0) + (statusCounts.unavailable || 0))} 个需处理`, `
        <button type="button" class="button button-primary" data-global-action="check-all" ${!canOperateCurrentUser() || isOperationBusy() ? "disabled" : ""} title="${escapeHtml(disabledReason())}">${icon("scan")}检测全部</button>
      `)}
      ${renderCurrentOperationBanner()}
      <div class="toolbar" aria-label="服务筛选">
        <div class="toolbar-group">
          <label class="search-field" for="service-search">${icon("search")}<input id="service-search" type="search" placeholder="搜索服务、域名或 PM2" value="${escapeHtml(state.serviceFilters.search)}"></label>
          <label class="sr-only" for="service-status-filter">健康状态</label>
          <select class="select-field" id="service-status-filter">
            <option value="all" ${state.serviceFilters.status === "all" ? "selected" : ""}>全部状态</option>
            ${["healthy", "degraded", "unavailable", "operating", "unmanaged", "unknown"].map((status) => `<option value="${status}" ${state.serviceFilters.status === status ? "selected" : ""}>${statusLabel(status)}</option>`).join("")}
          </select>
          <label class="sr-only" for="service-capability-filter">服务能力</label>
          <select class="select-field" id="service-capability-filter">
            <option value="all" ${state.serviceFilters.capability === "all" ? "selected" : ""}>全部能力</option>
            ${["start", "restart", "stop", "test", "build", "deploy", "check", "logs"].map((action) => `<option value="${action}" ${state.serviceFilters.capability === action ? "selected" : ""}>${actionLabel(action)}</option>`).join("")}
          </select>
        </div>
        <span class="result-count">显示 ${formatNumber(services.length)} / ${formatNumber(state.services.length)}</span>
      </div>
      <section class="surface">
        ${state.loading.has("bootstrap") && !state.initialized ? renderServiceTableSkeleton(7) : state.errors.services ? renderErrorState(state.errors.services) : renderServiceTable(services)}
      </section>
    </div>
  `;
}

function renderReleasesPage() {
  const releaseServices = state.services.filter((service) => service.capabilities.includes("build") || service.capabilities.includes("deploy"));
  const releaseOperations = state.operations.filter((operation) => ["build", "deploy", "rollback", "release"].includes(operation.action));
  const successful = releaseOperations.filter((operation) => operation.status === "completed").length;
  const failed = releaseOperations.filter((operation) => operation.status === "failed").length;
  return `
    <div class="page">
      ${renderPageHeader("发布中心", `${formatNumber(releaseServices.length)} 个服务具备构建或部署能力`)}
      ${renderCurrentOperationBanner()}
      <section class="metric-grid" aria-label="发布指标">
        ${renderMetricCard("可发布服务", formatNumber(releaseServices.length), "由服务能力清单决定", "package", "info")}
        ${renderMetricCard("发布记录", formatNumber(releaseOperations.length), "构建、部署与回滚", "operations")}
        ${renderMetricCard("成功", formatNumber(successful), "已通过构建或公网后检", "check", "success")}
        ${renderMetricCard("失败", formatNumber(failed), failed ? "查看失败阶段与恢复结果" : "近期没有失败记录", "error", failed ? "danger" : "default")}
      </section>

      <section class="section">
        <div class="section-header"><div class="section-heading"><h2>服务发布</h2><p>构建使用当前本地代码，不自动拉取远程变更</p></div></div>
        ${state.errors.services ? `<div class="surface">${renderErrorState(state.errors.services)}</div>` : releaseServices.length ? `
          <div class="release-service-grid">
            ${releaseServices.map((service) => {
              const latest = releaseOperations.find((operation) => operation.serviceIds.includes(service.id));
              const artifact = service.layers.artifact;
              return `
                <article class="release-service">
                  <button type="button" class="service-link-button" data-open-service data-service-id="${escapeHtml(service.id)}">
                    <span class="service-avatar">${icon("package")}</span>
                    <span class="release-service-copy"><strong>${escapeHtml(service.name)}</strong><span>${escapeHtml(service.frontend?.dist || service.domain || service.id)}</span><span>${artifact.state === "ok" ? `产物可用${service.artifactUpdatedAt ? ` · ${relativeTime(service.artifactUpdatedAt)}` : ""}` : artifact.state === "fail" ? "产物异常" : "产物状态未知"}${latest ? ` · 最近${actionLabel(latest.action)}${statusLabel(latest.status)}` : ""}</span></span>
                  </button>
                  <div class="button-row">
                    ${service.capabilities.includes("build") ? `<button type="button" class="button button-sm" data-service-action="build" data-service-id="${escapeHtml(service.id)}" ${!canOperateCurrentUser() || isOperationBusy() ? "disabled" : ""} title="${escapeHtml(disabledReason())}">${icon("build")}构建</button>` : ""}
                    ${service.capabilities.includes("deploy") ? `<button type="button" class="button button-sm button-danger" data-service-action="deploy" data-service-id="${escapeHtml(service.id)}" ${!canOperateCurrentUser() || isOperationBusy() ? "disabled" : ""} title="${escapeHtml(disabledReason())}">${icon("rocket")}部署</button>` : ""}
                  </div>
                </article>
              `;
            }).join("")}
          </div>
        ` : `<div class="surface">${renderEmptyState("没有配置构建或部署能力的服务", "请先在服务清单中补齐 capabilities")}</div>`}
      </section>

      <section class="section">
        <div class="section-header"><div class="section-heading"><h2>发布历史</h2><p>构建、部署、验证与回滚结果</p></div></div>
        <div class="surface">${state.errors.operations ? renderErrorState(state.errors.operations) : renderReleaseRows(state.operations)}</div>
      </section>
    </div>
  `;
}

function filteredOperations() {
  const query = state.operationFilters.search.trim().toLowerCase();
  return state.operations.filter((operation) => {
    const matchesStatus = state.operationFilters.status === "all" || operation.status === state.operationFilters.status;
    const matchesAction = state.operationFilters.action === "all" || operation.action === state.operationFilters.action;
    const haystack = [operation.action, actionLabel(operation.action), operation.target, ...operation.serviceIds.map(serviceName)].join(" ").toLowerCase();
    return matchesStatus && matchesAction && (!query || haystack.includes(query));
  });
}

function renderOperationsPage() {
  const operations = filteredOperations();
  const actions = [...new Set(state.operations.map((operation) => operation.action))].sort();
  const running = currentOperation();
  const bulkServices = state.services.filter((service) => !service.protected && service.automaticOperations !== false);
  const selectedCount = bulkServices.filter((service) => state.selectedServices.has(service.id)).length;
  const allSelected = bulkServices.length > 0 && selectedCount === bulkServices.length;
  return `
    <div class="page">
      ${renderPageHeader("操作中心", `${formatNumber(state.operations.length)} 条记录 · ${running ? "当前操作锁已占用" : "全局操作锁空闲"}`, `
        <button type="button" class="button" data-global-action="check-all" ${!canOperateCurrentUser() || isOperationBusy() ? "disabled" : ""} title="${escapeHtml(disabledReason())}">${icon("scan")}检测全部</button>
      `)}
      ${renderCurrentOperationBanner(running)}
      <section class="section">
        <div class="section-header"><div class="section-heading"><h2>批量服务控制</h2><p>仅包含允许自动操作的业务服务；任务按所选顺序执行</p></div><span class="result-count">已选 ${formatNumber(selectedCount)} / ${formatNumber(bulkServices.length)}</span></div>
        ${canOperateCurrentUser() ? `<div class="surface batch-control">
          <label class="batch-select-all"><input type="checkbox" id="bulk-select-all" ${allSelected ? "checked" : ""} ${bulkServices.length ? "" : "disabled"}>选择全部可自动操作服务</label>
          <div class="batch-service-list">
            ${bulkServices.map((service) => `<label class="batch-service-row"><input type="checkbox" data-bulk-service="${escapeHtml(service.id)}" ${state.selectedServices.has(service.id) ? "checked" : ""}><span><strong>${escapeHtml(service.name)}</strong><small>${escapeHtml(service.backend.pm2Name || service.id)}</small></span>${renderStatusBadge(service.overallStatus)}</label>`).join("")}
          </div>
          <div class="button-row">
            <button type="button" class="button" data-global-action="start" ${selectedCount && !isOperationBusy() ? "" : "disabled"}>${icon("play")}启动</button>
            <button type="button" class="button" data-global-action="restart" ${selectedCount && !isOperationBusy() ? "" : "disabled"}>${icon("restart")}重启</button>
            <button type="button" class="button button-danger" data-global-action="stop" ${selectedCount && !isOperationBusy() ? "" : "disabled"}>${icon("stop")}停止</button>
          </div>
        </div>` : `<div class="surface permission-state">${icon("shield", "icon-lg")}<div><strong>当前账号为只读成员</strong><span>可以查看操作状态、阶段和脱敏输出，无法发起服务控制。</span></div></div>`}
      </section>
      <div class="toolbar" aria-label="操作筛选">
        <div class="toolbar-group">
          <label class="search-field" for="operation-search">${icon("search")}<input id="operation-search" type="search" placeholder="搜索动作或服务" value="${escapeHtml(state.operationFilters.search)}"></label>
          <label class="sr-only" for="operation-status-filter">操作状态</label>
          <select class="select-field" id="operation-status-filter">
            <option value="all">全部状态</option>
            ${["running", "completed", "failed"].map((status) => `<option value="${status}" ${state.operationFilters.status === status ? "selected" : ""}>${statusLabel(status)}</option>`).join("")}
          </select>
          <label class="sr-only" for="operation-action-filter">操作类型</label>
          <select class="select-field" id="operation-action-filter">
            <option value="all">全部操作</option>
            ${actions.map((action) => `<option value="${escapeHtml(action)}" ${state.operationFilters.action === action ? "selected" : ""}>${escapeHtml(actionLabel(action))}</option>`).join("")}
          </select>
        </div>
        <span class="result-count">显示 ${formatNumber(operations.length)} / ${formatNumber(state.operations.length)}</span>
      </div>
      <section class="section">
        <div class="section-header"><div class="section-heading"><h2>操作历史</h2><p>点击记录查看阶段、命令摘要和脱敏输出</p></div></div>
        <div class="surface">${state.loading.has("bootstrap") && !state.initialized ? renderOperationSkeleton(6) : state.errors.operations ? renderErrorState(state.errors.operations) : renderOperationRows(operations)}</div>
      </section>
    </div>
  `;
}

function filteredLogs() {
  if (!state.logs) return [];
  return state.logs.entries.filter((entry) => {
    const matchesService = state.logFilters.serviceId === "all" || entry.serviceId === state.logFilters.serviceId || entry.source === state.logFilters.serviceId;
    const matchesSource = state.logFilters.source === "all" || entry.source === state.logFilters.source;
    const matchesLevel = state.logFilters.level === "all" || entry.level === state.logFilters.level;
    return matchesService && matchesSource && matchesLevel;
  });
}

function renderLogsPage() {
  const logs = filteredLogs();
  const sources = [...new Set((state.logs?.entries || []).map((entry) => entry.source).filter(Boolean))].sort();
  const serviceId = state.logFilters.serviceId;
  return `
    <div class="page">
      ${renderPageHeader("日志", serviceId === "all"
        ? `${formatNumber(logs.length)} 条操作日志`
        : `${formatNumber(logs.length)} 条 · 包含 PM2 与最近关联操作`, `
        <button type="button" class="button" data-action="refresh-logs" ${state.loading.has("logs") ? "disabled" : ""}>${state.loading.has("logs") ? '<span class="spinner" aria-hidden="true"></span>' : icon("refresh")}刷新日志</button>
      `)}
      <section class="section">
        <div class="toolbar log-toolbar" aria-label="日志筛选">
          <div class="toolbar-group">
            <label class="sr-only" for="log-service-filter">服务</label>
            <select class="select-field" id="log-service-filter">
              <option value="all">全部服务</option>
              ${state.services.map((service) => `<option value="${escapeHtml(service.id)}" ${serviceId === service.id ? "selected" : ""}>${escapeHtml(service.name)}</option>`).join("")}
            </select>
            <label class="sr-only" for="log-source-filter">来源</label>
            <select class="select-field" id="log-source-filter">
              <option value="all">全部来源</option>
              ${sources.map((source) => `<option value="${escapeHtml(source)}" ${state.logFilters.source === source ? "selected" : ""}>${escapeHtml(source)}</option>`).join("")}
            </select>
            <label class="sr-only" for="log-level-filter">级别</label>
            <select class="select-field" id="log-level-filter">
              <option value="all">全部级别</option>
              ${["info", "warn", "error"].map((level) => `<option value="${level}" ${state.logFilters.level === level ? "selected" : ""}>${level.toUpperCase()}</option>`).join("")}
            </select>
          </div>
          <span class="result-count">敏感字段已脱敏</span>
        </div>
        ${state.loading.has("logs") ? `<div class="surface">${renderLoadingState("正在读取日志...")}</div>` : state.errors.logs ? `<div class="surface">${renderErrorState(state.errors.logs, "refresh-logs")}</div>` : `
          <div class="terminal" role="log" aria-label="日志输出">
            <div class="log-meta"><span>${escapeHtml(serviceId === "all" ? "全部服务" : serviceName(serviceId))}</span><span>${state.logs?.updatedAt ? escapeHtml(formatDate(state.logs.updatedAt)) : "—"}</span></div>
            ${logs.length ? logs.map((entry) => `
              <div class="log-entry"><span class="log-time">${escapeHtml(entry.timestamp ? formatDate(entry.timestamp) : "—")}</span><span class="log-source">${escapeHtml(entry.source)}</span><span><span class="log-level" data-level="${escapeHtml(entry.level)}">${escapeHtml(entry.level.toUpperCase())}</span> ${escapeHtml(entry.message)}</span></div>
            `).join("") : `<div class="empty-state"><p>当前筛选条件下没有日志</p></div>`}
          </div>
        `}
      </section>
    </div>
  `;
}

function selectedStorageSize() {
  if (!state.storage) return 0;
  return state.storage.items.filter((item) => state.selectedStorage.has(item.id)).reduce((sum, item) => sum + item.size, 0);
}

function filteredStorageItems() {
  if (!state.storage) return [];
  return state.storage.items.filter((item) => state.storageFilters.type === "all" || item.type === state.storageFilters.type);
}

function renderStoragePage() {
  const storage = state.storage;
  const items = filteredStorageItems();
  const selectedCount = state.selectedStorage.size;
  const selectedSize = selectedStorageSize();
  const byType = storage?.summary?.byType || {};
  return `
    <div class="page">
      ${renderPageHeader("存储", storage ? `${formatNumber(storage.summary.count)} 项 · ${formatBytes(storage.summary.totalSize)} · 保留周期 ${formatNumber(storage.retentionDays)} 天` : "正在扫描存储项", `
        <button type="button" class="button" data-action="refresh-storage" ${state.loading.has("storage") ? "disabled" : ""}>${state.loading.has("storage") ? '<span class="spinner" aria-hidden="true"></span>' : icon("refresh")}重新扫描</button>
      `)}
      ${storage ? `
        <section class="storage-summary" aria-label="存储分类">
          ${["backup", "log", "cache", "artifact", "dependency"].map((type) => `<article class="storage-stat"><span>${STORAGE_TYPE_LABELS[type]}</span><strong>${formatBytes(byType[type]?.size || 0)}</strong><span>${formatNumber(byType[type]?.count || 0)} 项</span></article>`).join("")}
        </section>
        <div class="toolbar" aria-label="存储筛选和清理">
          <div class="toolbar-group">
            <label class="sr-only" for="storage-type-filter">存储类型</label>
            <select class="select-field" id="storage-type-filter">
              <option value="all">全部类型</option>
              ${Object.entries(STORAGE_TYPE_LABELS).map(([type, label]) => `<option value="${type}" ${state.storageFilters.type === type ? "selected" : ""}>${label}</option>`).join("")}
            </select>
            <span class="result-count">显示 ${formatNumber(items.length)} / ${formatNumber(storage.items.length)}</span>
          </div>
          <div class="toolbar-actions">
            <button type="button" class="button button-sm" data-storage-action="storage-clear-cache" ${!isCurrentUserOwner() || isOperationBusy() ? "disabled" : ""} title="${escapeHtml(disabledReason("owner"))}">${icon("trash")}清理推荐缓存</button>
            <button type="button" class="button button-sm" data-storage-action="storage-cleanup-expired" ${!isCurrentUserOwner() || isOperationBusy() ? "disabled" : ""} title="${escapeHtml(disabledReason("owner"))}">${icon("clock")}清理过期项</button>
            <button type="button" class="button button-sm button-danger" data-storage-action="storage-delete" ${!isCurrentUserOwner() || !selectedCount || isOperationBusy() ? "disabled" : ""} title="${escapeHtml(!isCurrentUserOwner() ? disabledReason("owner") : "")}">${icon("trash")}删除已选${selectedCount ? ` (${formatBytes(selectedSize)})` : ""}</button>
          </div>
        </div>
        <section class="surface">
          ${items.length ? `<div class="storage-list">${items.map((item) => `
            <label class="storage-row">
              <input class="storage-checkbox" type="checkbox" data-storage-id="${escapeHtml(item.id)}" ${state.selectedStorage.has(item.id) ? "checked" : ""} ${item.removable && isCurrentUserOwner() ? "" : "disabled"} aria-label="选择 ${escapeHtml(item.label)}">
              <span class="storage-kind">${escapeHtml(STORAGE_TYPE_LABELS[item.type] || item.type)}</span>
              <span class="storage-copy"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.path)}</span>${item.reason ? `<span>${escapeHtml(item.reason)}</span>` : ""}</span>
              <span class="storage-size">${formatBytes(item.size)}</span>
              <span class="storage-date">${escapeHtml(formatDate(item.modifiedAt))}</span>
              <span class="locked-note">${item.locked || !item.removable ? `${icon("lock")}保留` : item.recommended ? `${icon("alert")}建议清理` : "手动确认"}</span>
            </label>
          `).join("")}</div>` : renderEmptyState("当前分类没有存储项")}
        </section>
      ` : state.loading.has("storage") ? `<div class="surface">${renderLoadingState("正在扫描日志、备份、缓存与构建产物...")}</div>` : `<div class="surface">${renderErrorState(state.errors.storage || "存储数据不可用", "refresh-storage")}</div>`}
    </div>
  `;
}

function infrastructureIcon(item) {
  const id = `${item.id} ${item.name}`.toLowerCase();
  if (id.includes("database") || id.includes("postgres")) return "storage";
  if (id.includes("tunnel") || id.includes("cloudflare")) return "globe";
  if (id.includes("nginx")) return "server";
  if (id.includes("pm2")) return "cpu";
  return "settings";
}

function normalizeInfrastructureStatus(status) {
  const explicit = explicitHealthStatus(status);
  if (explicit) return explicit;
  const layer = normalizeStateValue(status);
  if (layer === "ok") return "healthy";
  if (layer === "warn") return "degraded";
  if (layer === "fail") return "unavailable";
  if (layer === "busy") return "operating";
  return "unknown";
}

function securityRows() {
  const security = state.inventory?.security || {};
  if (Array.isArray(security)) return security;
  const labels = {
    defaultPasswordDisabled: "默认口令已禁用",
    sessionsExpire: "会话过期策略",
    loginRateLimit: "登录速率限制",
    sameSite: "Cookie SameSite",
    envMode: ".env 文件权限",
    runningAsRoot: "非 root 运行",
    credentialRotationRequired: "历史凭据轮换",
  };
  return Object.entries(security).map(([key, value]) => {
    if (typeof value === "object" && value !== null) return { id: key, name: labels[key] || key, ...value };
    let status = value;
    let detail = typeof value === "string" ? value : "";
    if (key === "sameSite") status = String(value).toLowerCase() === "strict" ? "healthy" : "degraded";
    else if (key === "envMode") {
      status = String(value) === "600" ? "healthy" : "degraded";
      detail = value ? `当前权限 ${value}` : "未检测到 .env";
    } else if (key === "runningAsRoot") {
      status = value === false ? "healthy" : value === true ? "unavailable" : "unknown";
      detail = value === false ? "管理进程未以 root 运行" : value === true ? "管理进程正在以 root 运行" : "无法判断运行用户";
    } else if (key === "credentialRotationRequired") {
      status = value ? "degraded" : "healthy";
      detail = value ? "历史凭据仍需人工轮换" : "无需轮换";
    } else if (typeof value === "boolean") {
      status = value ? "healthy" : "unavailable";
    }
    return { id: key, name: labels[key] || key, status, detail };
  });
}

function renderAdminsSection() {
  const current = state.session?.admin;
  if (!current) return "";
  if (current.role !== "owner") {
    return `<section class="section"><div class="section-header"><div class="section-heading"><h2>当前管理员</h2><p>${escapeHtml(current.displayName || current.username)} · ${escapeHtml(roleLabel(current.role))}</p></div><button type="button" class="button button-sm" data-action="change-password" data-focus-id="settings-password">${icon("lock")}修改密码</button></div><div class="surface"><div class="manifest-facts"><div class="manifest-fact"><span>用户名</span><strong>${escapeHtml(current.username)}</strong></div><div class="manifest-fact"><span>项目范围</span><strong>${current.serviceIds?.includes("*") ? "全部" : formatNumber(current.serviceIds?.length || 0)}</strong></div></div></div></section>`;
  }
  const data = state.adminsData;
  if (state.loading.has("admins") && !data) return `<section class="section"><div class="section-header"><div class="section-heading"><h2>管理员账号</h2></div></div><div class="surface">${renderLoadingState("正在读取管理员...")}</div></section>`;
  if (state.errors.admins) return `<section class="section"><div class="section-header"><div class="section-heading"><h2>管理员账号</h2></div></div><div class="surface">${renderErrorState(state.errors.admins, "refresh-admins")}</div></section>`;
  const admins = data?.admins || [];
  const servicesOptions = (data?.services || []).map((service) => `<option value="${escapeHtml(service.id)}">${escapeHtml(service.name)}</option>`).join("");
  return `<section class="section admin-section">
    <div class="section-header"><div class="section-heading"><h2>管理员账号</h2><p>角色、项目范围与登录密码</p></div><button type="button" class="button button-sm" data-action="refresh-admins">${icon("refresh")}刷新</button></div>
    <div class="surface">
      <form id="admin-create-form" class="admin-create-form">
        <label><span>用户名</span><input class="field" name="username" required minlength="3" maxlength="32" autocomplete="off"></label>
        <label><span>显示名称</span><input class="field" name="displayName" maxlength="60" autocomplete="off"></label>
        <label><span>初始密码</span><input class="field" name="password" type="password" required minlength="12" maxlength="256" autocomplete="new-password"></label>
        <label><span>角色</span><select class="select-field" name="role"><option value="operator">Operator</option><option value="viewer">Viewer</option><option value="owner">Owner</option></select></label>
        <label class="admin-scope-field"><span>项目范围</span><select class="select-field" name="serviceIds" multiple size="5">${servicesOptions}</select></label>
        <button class="button button-primary" type="submit">${icon("lock")}新增管理员</button>
      </form>
      <div class="admin-list">${admins.map((admin) => {
        const isCurrent = admin.id === current.id;
        const passwordAction = isCurrent
          ? `<button type="button" class="button button-sm" data-action="change-password" data-focus-id="admin-row-password">${icon("lock")}修改密码</button>`
          : `<input class="field" type="password" data-admin-new-password minlength="12" maxlength="256" placeholder="新密码（12–256 位）" autocomplete="new-password"><button type="button" class="button button-sm" data-admin-reset="${escapeHtml(admin.id)}">重置密码</button>`;
        const accountActions = isCurrent
          ? `<span class="faint">当前账号</span>`
          : `<button type="button" class="button button-sm" data-admin-toggle="${escapeHtml(admin.id)}" data-disabled="${admin.disabled ? "false" : "true"}">${admin.disabled ? "启用" : "停用"}</button><button type="button" class="icon-button button-ghost" data-admin-delete="${escapeHtml(admin.id)}" aria-label="删除 ${escapeHtml(admin.username)}">${icon("trash")}</button>`;
        return `<div class="admin-row" data-admin-row="${escapeHtml(admin.id)}"><div class="admin-identity"><strong>${escapeHtml(admin.displayName || admin.username)}</strong><span>${escapeHtml(admin.username)} · ${escapeHtml(roleLabel(admin.role))} · ${admin.serviceIds?.includes("*") ? "全部项目" : `${admin.serviceIds?.length || 0} 个项目`}</span></div><span>${admin.disabled ? renderStatusBadge("stopped", "已停用") : renderStatusBadge("healthy", "可登录")}</span><span class="faint">${admin.lastLoginAt ? relativeTime(admin.lastLoginAt) : "从未登录"}</span><div class="admin-actions">${passwordAction}${accountActions}</div></div>`;
      }).join("")}</div>
    </div>
  </section>`;
}

function renderSettingsPage() {
  const inventory = state.inventory;
  const manifest = inventory?.manifest || {};
  const serviceCount = firstDefined(manifest.serviceCount, manifest.count, inventory?.services?.length, state.services.length);
  const security = securityRows();
  return `
    <div class="page">
      ${renderPageHeader("系统", inventory ? `服务清单 ${inventory.version} · ${formatNumber(inventory.drifts.length)} 项配置差异` : "正在读取系统清单", `
        <button type="button" class="button" data-action="refresh" ${state.loading.has("bootstrap") ? "disabled" : ""}>${icon("refresh")}重新检测</button>
      `)}
      ${state.errors.inventory ? `<div class="surface">${renderErrorState(state.errors.inventory)}</div>` : ""}
      <div class="settings-grid">
        <div class="settings-stack">
          ${renderAdminsSection()}
          <section class="section">
            <div class="section-header"><div class="section-heading"><h2>基础设施</h2><p>Nginx、Tunnel、PM2 与数据库只读状态</p></div></div>
            <div class="surface">${inventory?.infrastructure?.length ? `<div class="infra-list">${inventory.infrastructure.map((item) => {
              const status = normalizeInfrastructureStatus(item.status);
              return `<div class="infra-row"><span class="infra-icon">${icon(infrastructureIcon(item))}</span><span class="infra-copy"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.detail || item.id)}</span></span>${renderStatusBadge(status)}</div>`;
            }).join("")}</div>` : state.loading.has("bootstrap") ? renderInfraSkeleton(4) : renderEmptyState("暂无基础设施状态", "后端尚未返回基础设施清单")}</div>
          </section>

          <section class="section">
            <div class="section-header"><div class="section-heading"><h2>配置漂移</h2><p>服务清单、PM2、Nginx 与 Tunnel 差异</p></div></div>
            <div class="surface">${inventory?.drifts?.length ? `<div class="drift-list">${inventory.drifts.map((drift) => `
              <div class="drift-row"><span class="event-icon">${icon(drift.severity === "critical" ? "error" : "alert")}</span><span class="drift-copy"><strong>${escapeHtml(drift.title)}</strong><span>${escapeHtml(drift.detail || drift.type)}</span></span>${drift.serviceId ? `<button type="button" class="button button-sm" data-open-service data-service-id="${escapeHtml(drift.serviceId)}">查看服务</button>` : renderStatusBadge(drift.severity === "critical" ? "failed" : "warning")}</div>
            `).join("")}</div>` : renderEmptyState("没有发现配置漂移", "服务清单与运行配置保持一致")}</div>
          </section>

          ${security.length ? `<section class="section"><div class="section-header"><div class="section-heading"><h2>安全状态</h2><p>认证、会话与输出保护</p></div></div><div class="surface"><div class="infra-list">${security.map((item) => {
            const status = normalizeInfrastructureStatus(firstDefined(item.status, item.state, item.ok));
            return `<div class="infra-row"><span class="infra-icon">${icon("shield")}</span><span class="infra-copy"><strong>${escapeHtml(firstDefined(item.name, item.label, item.id, "安全检查"))}</strong><span>${escapeHtml(firstDefined(item.detail, item.message, ""))}</span></span>${renderStatusBadge(status)}</div>`;
          }).join("")}</div></div></section>` : ""}
        </div>

        <div class="settings-stack">
          <section class="section">
            <div class="section-header"><div class="section-heading"><h2>服务清单</h2><p>当前运行配置摘要</p></div></div>
            <div class="surface"><div class="manifest-facts">
              <div class="manifest-fact"><span>清单版本</span><strong>${escapeHtml(inventory?.version || "—")}</strong></div>
              <div class="manifest-fact"><span>应用服务</span><strong>${formatNumber(serviceCount)}</strong></div>
              <div class="manifest-fact"><span>公网域名</span><strong>${formatNumber(firstDefined(manifest.domainCount, inventory?.domainCount, state.services.filter((service) => service.domain).length))}</strong></div>
              <div class="manifest-fact"><span>配置差异</span><strong>${formatNumber(inventory?.drifts?.length || 0)}</strong></div>
            </div></div>
          </section>

          <section class="section">
            <div class="section-header"><div class="section-heading"><h2>工作台设置</h2><p>仅保存于当前浏览器</p></div></div>
            <div class="surface settings-list">
              <div class="setting-row"><span class="setting-copy"><strong>深色模式</strong><span>切换工作台显示主题</span></span><label class="switch"><span class="sr-only">深色模式</span><input id="theme-setting" type="checkbox" ${state.settings.theme === "dark" ? "checked" : ""}><span aria-hidden="true"></span></label></div>
              <div class="setting-row"><label class="setting-copy" for="refresh-setting"><strong>自动刷新</strong><span>后台状态轮询间隔</span></label><select class="select-field" id="refresh-setting">${[[0, "关闭"], [15, "15 秒"], [30, "30 秒"], [60, "1 分钟"], [300, "5 分钟"]].map(([value, label]) => `<option value="${value}" ${Number(state.settings.refreshSeconds) === value ? "selected" : ""}>${label}</option>`).join("")}</select></div>
              <div class="setting-row"><span class="setting-copy"><strong>版本切换</strong><span>V1 保留原有项目管理页面</span></span><a class="button button-sm" href="/home">${icon("arrow-left")}进入 V1</a></div>
              <div class="setting-row"><span class="setting-copy"><strong>登录会话</strong><span>退出当前管理会话</span></span><button type="button" class="button button-sm" data-action="logout">${icon("logout")}退出</button></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `;
}

function renderServiceDrawer(service) {
  if (!service) return "";
  const latest = latestOperationForService(service.id) || service.lastOperation;
  const layerOrder = ["process", "port", "app", "nginx", "tunnel", "public", "artifact"];
  const footerActions = ["check", "restart", "deploy"].filter((action) => service.capabilities.includes(action));
  return `
    <button type="button" class="drawer-backdrop" data-close-drawer aria-label="关闭服务详情"></button>
    <aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="service-drawer-title">
      <header class="drawer-header">
        <div class="drawer-title"><h2 id="service-drawer-title">${escapeHtml(service.name)}</h2><p>${escapeHtml(service.backend.pm2Name || service.id)}${service.backend.port ? ` · ${escapeHtml(service.backend.port)}` : ""}</p></div>
        <button type="button" class="icon-button button-ghost" data-close-drawer aria-label="关闭服务详情">${icon("close")}</button>
      </header>
      <div class="drawer-body">
        <section class="detail-hero">
          <div class="detail-status-line">${renderStatusBadge(service.overallStatus)}${operationForService(service.id) ? renderStatusBadge("running", actionLabel(operationForService(service.id).action)) : ""}</div>
          ${service.statusMessage ? `<p class="muted">${escapeHtml(service.statusMessage)}</p>` : ""}
          ${service.url ? `<a class="detail-domain" href="${escapeHtml(service.url)}" target="_blank" rel="noreferrer">${icon("globe")}${escapeHtml(service.domain)}${icon("external")}</a>` : `<span class="muted">未配置公网域名</span>`}
          <div class="fact-grid">
            <div class="fact"><span>PM2 进程</span><strong>${escapeHtml(service.backend.pm2Name || "—")}</strong></div>
            <div class="fact"><span>监听端口</span><strong>${escapeHtml(service.backend.port ?? "—")}</strong></div>
            <div class="fact"><span>运行时间</span><strong>${escapeHtml(formatUptime(service.uptime))}</strong></div>
            <div class="fact"><span>重启次数</span><strong>${formatNumber(service.restarts)}</strong></div>
            <div class="fact"><span>CPU</span><strong>${formatNumber(service.cpu)}%</strong></div>
            <div class="fact"><span>内存</span><strong>${formatBytes(service.memory)}</strong></div>
          </div>
        </section>

        <section class="detail-section">
          <h3>运行链路</h3>
          <div class="layer-list">${layerOrder.map((key) => {
            const layer = service.layers[key];
            const stateText = layer.state === "ok" ? "正常" : layer.state === "warn" ? "警告" : layer.state === "fail" ? "失败" : layer.state === "busy" ? "操作中" : layer.state === "na" ? "不适用" : "未知";
            return `<div class="layer-row">${renderLayerState(layer, LAYER_LABELS[key])}<span class="layer-copy"><strong>${LAYER_LABELS[key]}</strong><span>${escapeHtml(layer.detail || "暂无检测详情")}</span></span><span class="faint nowrap">${stateText}</span></div>`;
          }).join("")}</div>
        </section>

        <section class="detail-section">
          <h3>发布配置</h3>
          <div class="fact-grid">
            <div class="fact"><span>运行时</span><strong>${escapeHtml(service.runtime || "—")}</strong></div>
            <div class="fact"><span>项目目录</span><strong class="fact-path" title="${escapeHtml(service.directory || "—")}">${escapeHtml(service.directory || "—")}</strong></div>
            <div class="fact"><span>产物路径</span><strong class="fact-path" title="${escapeHtml(service.frontend?.dist || "内置 / 无")}">${escapeHtml(service.frontend?.dist || "内置 / 无")}</strong></div>
            <div class="fact"><span>产物时间</span><strong>${escapeHtml(formatDate(service.artifactUpdatedAt))}</strong></div>
            <div class="fact"><span>构建命令</span><strong title="${escapeHtml(service.build?.command?.join(" ") || "未配置")}">${escapeHtml(service.build?.command?.join(" ") || "未配置")}</strong></div>
            <div class="fact"><span>健康路径</span><strong>${escapeHtml(service.healthPath || "未配置")}</strong></div>
            <div class="fact"><span>公网策略</span><strong>${escapeHtml(service.exposure === "restricted-pending-auth" ? "待鉴权 / 默认阻断" : "公开服务")}</strong></div>
            <div class="fact"><span>批量操作</span><strong>${service.automaticOperations === false ? "仅允许单独操作" : "允许"}</strong></div>
          </div>
          <div class="capability-list" aria-label="服务能力">${service.capabilities.map((capability) => `<span class="capability">${escapeHtml(actionLabel(capability))}</span>`).join("")}</div>
        </section>

        <section class="detail-section">
          <div class="section-header"><h3>最近操作</h3>${latest?.id ? `<button type="button" class="button button-sm" data-operation-id="${escapeHtml(latest.id)}">查看记录</button>` : ""}</div>
          ${latest ? `<button type="button" class="operation-row" data-status="${escapeHtml(latest.status || "unknown")}" ${latest.id ? `data-operation-id="${escapeHtml(latest.id)}"` : "disabled"}><span class="operation-indicator"></span><span class="operation-copy"><strong>${escapeHtml(actionLabel(latest.action))}</strong><span>${escapeHtml(latest.stage || statusLabel(latest.status))}</span></span><span class="operation-meta">${renderStatusBadge(latest.status || "unknown")}<span>${escapeHtml(relativeTime(firstDefined(latest.finishedAt, latest.startedAt)))}</span></span></button>` : renderEmptyState("暂无操作记录")}
        </section>
      </div>
      <footer class="drawer-footer">
        ${footerActions.map((action, index) => `<button type="button" class="button ${ACTIONS[action].tone === "danger" ? "button-danger" : (index === 0 && footerActions.length === 1) ? "button-primary" : ""}" data-service-action="${action}" data-service-id="${escapeHtml(service.id)}" ${!canOperateCurrentUser() || isOperationBusy() ? "disabled" : ""} title="${escapeHtml(disabledReason())}">${icon(ACTIONS[action].icon)}${escapeHtml(ACTIONS[action].label)}</button>`).join("")}
        ${renderServiceMenu(service)}
      </footer>
    </aside>
  `;
}

function syntheticStages(operation) {
  if (operation.stages.length) return operation.stages;
  const status = operation.status === "completed"
    ? "completed"
    : operation.status === "failed"
      ? "failed"
      : "running";
  const genericStages = ["queued", "executing", "completed", "failed", "running"];
  const name = operation.stage && !genericStages.includes(operation.stage)
    ? operation.stage
    : actionLabel(operation.action);
  return [{
    id: `${operation.id}-current`,
    name,
    status,
    detail: ["running", "queued"].includes(operation.status)
      ? "任务正在执行，等待服务端返回下一阶段"
      : "服务端未返回分步数据",
    startedAt: operation.startedAt,
    finishedAt: operation.finishedAt,
  }];
}

function renderOperationDrawer(operation) {
  if (!operation) return "";
  const target = operation.serviceIds.length ? operation.serviceIds.map(serviceName).join("、") : operation.target;
  const output = [operation.command ? `$ ${operation.command}` : "", operation.output, operation.error].filter(Boolean).join("\n\n") || "暂无输出";
  const stages = syntheticStages(operation);
  return `
    <button type="button" class="drawer-backdrop" data-close-operation aria-label="关闭操作详情"></button>
    <aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="operation-drawer-title">
      <header class="drawer-header">
        <div class="drawer-title"><h2 id="operation-drawer-title">${escapeHtml(actionLabel(operation.action))}</h2><p>${escapeHtml(target)} · ${escapeHtml(operation.id)}</p></div>
        <button type="button" class="icon-button button-ghost" data-close-operation aria-label="关闭操作详情">${icon("close")}</button>
      </header>
      <div class="drawer-body">
        <section class="detail-hero">
          <div class="detail-status-line">${renderStatusBadge(operation.status)}${operation.stage ? `<span class="muted">${escapeHtml(operation.stage)}</span>` : ""}</div>
          ${["running", "queued"].includes(operation.status) ? `<span class="progress-track" aria-label="进度 ${operation.progress}%"><span class="progress-bar" style="width:${clamp(operation.progress, 0, 100)}%"></span></span>` : ""}
          <div class="fact-grid">
            <div class="fact"><span>发起时间</span><strong>${escapeHtml(formatDate(operation.startedAt))}</strong></div>
            <div class="fact"><span>结束时间</span><strong>${escapeHtml(formatDate(operation.finishedAt))}</strong></div>
            <div class="fact"><span>持续时间</span><strong>${escapeHtml(formatDuration(operation.durationMs))}</strong></div>
            <div class="fact"><span>操作者</span><strong>${escapeHtml(operation.operator)}</strong></div>
          </div>
        </section>
        <section class="detail-section">
          <h3>执行阶段</h3>
          <div class="stage-list">${stages.map((stage) => `
            <div class="stage-row" data-state="${escapeHtml(stage.status)}">
              <span class="stage-marker">${stage.status === "completed" ? icon("check") : stage.status === "failed" ? icon("error") : stage.status === "running" ? '<span class="spinner" aria-hidden="true"></span>' : ""}</span>
              <span class="stage-copy"><strong>${escapeHtml(stage.name)}</strong>${stage.detail ? `<span>${escapeHtml(stage.detail)}</span>` : ""}</span>
              <span class="stage-time">${stage.finishedAt ? escapeHtml(relativeTime(stage.finishedAt)) : stage.status === "running" ? "进行中" : ""}</span>
            </div>
          `).join("")}</div>
        </section>
        <section class="detail-section"><h3>脱敏输出</h3><pre class="operation-output">${escapeHtml(output)}</pre></section>
      </div>
      <footer class="drawer-footer"><button type="button" class="button" data-close-operation>关闭</button></footer>
    </aside>
  `;
}

function renderConfirmModal() {
  if (!state.confirm) return "";
  const confirm = state.confirm;
  if (confirm.kind === "password-change") {
    return `
      <div class="modal-backdrop" data-close-modal>
        <form class="modal password-change-modal" id="password-change-form" role="dialog" aria-modal="true" aria-labelledby="password-change-title" data-modal-panel>
          <header class="modal-header"><div class="modal-title"><h2 id="password-change-title">修改密码</h2><p>保存后，其他设备上的登录会话将退出。</p></div><button type="button" class="icon-button button-ghost" data-close-modal aria-label="关闭修改密码">${icon("close")}</button></header>
          <div class="modal-body password-change-fields">
            <div class="form-group">
              <label for="current-password">当前密码</label>
              <div class="input-shell">${icon("lock")}<input class="field" id="current-password" name="currentPassword" type="password" autocomplete="current-password" required aria-describedby="password-change-error"><button type="button" class="password-toggle" data-action="toggle-password" data-password-target="current-password" aria-controls="current-password" aria-label="显示当前密码">${icon("eye")}</button></div>
            </div>
            <div class="form-group">
              <label for="new-password">新密码</label>
              <div class="input-shell">${icon("lock")}<input class="field" id="new-password" name="newPassword" type="password" autocomplete="new-password" required minlength="12" maxlength="256" aria-describedby="password-change-help password-change-error"><button type="button" class="password-toggle" data-action="toggle-password" data-password-target="new-password" aria-controls="new-password" aria-label="显示新密码">${icon("eye")}</button></div>
              <p class="field-help" id="password-change-help">12–256 位，建议使用容易记忆的长密码。</p>
            </div>
            <div class="form-group">
              <label for="confirm-new-password">确认新密码</label>
              <div class="input-shell">${icon("check")}<input class="field" id="confirm-new-password" name="confirmNewPassword" type="password" autocomplete="new-password" required minlength="12" maxlength="256" aria-describedby="password-change-error"><button type="button" class="password-toggle" data-action="toggle-password" data-password-target="confirm-new-password" aria-controls="confirm-new-password" aria-label="显示确认密码">${icon("eye")}</button></div>
            </div>
            <p class="form-error" id="password-change-error" role="alert" hidden></p>
          </div>
          <footer class="modal-footer"><button type="button" class="button" data-close-modal>取消</button><button type="submit" class="button button-primary" data-password-change-submit>${icon("lock")}保存新密码</button></footer>
        </form>
      </div>
    `;
  }
  const service = confirm.serviceIds?.length === 1 ? serviceById(confirm.serviceIds[0]) : null;
  const action = ACTIONS[confirm.action];
  const title = confirm.title || `${action?.label || actionLabel(confirm.action)}${service ? ` · ${service.name}` : ""}`;
  const description = confirm.description || action?.description || "确认执行此操作。";
  const impacts = confirm.impacts || action?.impacts || [];
  const expected = confirm.expected || (action?.typed && service ? service.name : "");
  const danger = confirm.tone === "danger" || action?.tone === "danger";
  return `
    <div class="modal-backdrop" data-close-modal>
      <form class="modal" id="confirm-form" role="dialog" aria-modal="true" aria-labelledby="confirm-title" data-modal-panel>
        <header class="modal-header"><div class="modal-title"><h2 id="confirm-title">${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p></div><button type="button" class="icon-button button-ghost" data-close-modal aria-label="取消操作">${icon("close")}</button></header>
        <div class="modal-body">
          <div class="${danger ? "warning-box" : "impact-box"}">
            <div class="impact-title">${icon(danger ? "alert" : "info")}${danger ? "高风险操作" : "影响范围"}</div>
            ${impacts.length ? `<ul class="impact-list">${impacts.map((impact) => `<li>${escapeHtml(impact)}</li>`).join("")}</ul>` : ""}
          </div>
          ${confirm.serviceIds?.length ? `<div class="info-box"><div class="impact-title">${icon("server")}目标服务</div><span class="muted">${confirm.serviceIds.map(serviceName).map(escapeHtml).join("、")}</span></div>` : ""}
          ${confirm.itemCount ? `<div class="info-box"><div class="impact-title">${icon("storage")}存储项</div><span class="muted">${formatNumber(confirm.itemCount)} 项 · ${formatBytes(confirm.itemSize || 0)}</span></div>` : ""}
          ${expected ? `<div class="form-group"><label for="confirm-input">输入 <strong>${escapeHtml(expected)}</strong> 确认</label><input class="field" id="confirm-input" type="text" autocomplete="off" data-confirm-expected="${escapeHtml(expected)}" autofocus><p class="field-help">名称必须完全一致。</p></div>` : ""}
        </div>
        <footer class="modal-footer"><button type="button" class="button" data-close-modal>取消</button><button type="submit" class="button ${danger ? "button-danger" : "button-primary"}" data-confirm-submit ${expected ? "disabled" : ""}>${icon(action?.icon || (danger ? "trash" : "check"))}确认${escapeHtml(action?.label || actionLabel(confirm.action))}</button></footer>
      </form>
    </div>
  `;
}

function renderView() {
  if (state.route === "services") return renderServicesPage();
  if (state.route === "releases") return renderReleasesPage();
  if (state.route === "operations") return renderOperationsPage();
  if (state.route === "logs") return renderLogsPage();
  if (state.route === "storage") return renderStoragePage();
  if (state.route === "settings") return renderSettingsPage();
  return renderOverviewPage();
}

function render() {
  if (state.route === "login") {
    document.body.style.overflow = "";
    renderLogin();
    return;
  }
  const route = routeInfo();
  document.title = `${route.title} · CMCC 项目运行工作台`;
  const drawerService = state.drawerServiceId ? serviceById(state.drawerServiceId) : null;
  const operation = state.operationDrawerId ? operationById(state.operationDrawerId) : null;
  app.innerHTML = `
    <div class="app-shell ${state.navOpen ? "nav-open" : ""}">
      ${renderSidebar()}
      <button type="button" class="nav-backdrop" data-action="close-nav" aria-label="关闭导航"></button>
      <div class="app-frame">${renderTopbar()}<div class="content">${renderView()}</div></div>
      ${drawerService ? renderServiceDrawer(drawerService) : ""}
      ${operation ? renderOperationDrawer(operation) : ""}
      ${renderConfirmModal()}
      ${state.actionBusy ? '<span class="busy-strip" aria-hidden="true"></span>' : ""}
    </div>
  `;
  document.body.style.overflow = state.confirm || drawerService || operation || state.navOpen ? "hidden" : "";
}

function openService(serviceId) {
  const service = serviceById(serviceId);
  if (!service) {
    showToast("未找到服务", serviceId, "error");
    return;
  }
  state.drawerReturnPath = `${location.pathname}${location.search}`;
  state.route = "services";
  state.drawerServiceId = serviceId;
  state.operationDrawerId = null;
  history.pushState({}, "", `/v2/services/${encodeURIComponent(serviceId)}`);
  render();
  queueMicrotask(() => document.querySelector("[data-close-drawer]")?.focus());
}

function closeServiceDrawer() {
  const selector = state.focusReturnStack.pop() || "";
  const returnPath = state.drawerReturnPath;
  state.drawerReturnPath = null;
  state.drawerServiceId = null;
  if (returnPath && returnPath !== location.pathname) {
    state.pendingFocusSelector = selector;
    history.back();
    return;
  }
  if (/^\/v2\/services\/[^/]+/.test(location.pathname)) history.replaceState({}, "", "/v2/services");
  render();
  restoreFocus(selector);
}

function openOperation(operationId) {
  if (operationId === "local-pending-operation") return;
  const operation = operationById(operationId);
  if (!operation) {
    showToast("未找到操作记录", operationId, "error");
    return;
  }
  if (state.drawerServiceId) state.focusReturnStack.pop();
  state.operationDrawerId = operationId;
  state.drawerServiceId = null;
  render();
  queueMicrotask(() => document.querySelector("[data-close-operation]")?.focus());
}

function closeOperationDrawer() {
  const selector = state.focusReturnStack.pop() || "";
  state.operationDrawerId = null;
  render();
  restoreFocus(selector);
}

function openServiceAction(serviceId, action) {
  const service = serviceById(serviceId);
  if (!service || !ACTIONS[action]) {
    showToast("操作不可用", "服务或动作不存在", "error");
    return;
  }
  if (!service.capabilities.includes(action)) {
    showToast("服务不支持此操作", `${service.name} 未配置${actionLabel(action)}能力`, "warning");
    return;
  }
  if (action === "logs") {
    state.logFilters.serviceId = service.id;
    state.logs = null;
    navigate("/v2/logs");
    return;
  }
  if (!canOperateCurrentUser()) {
    showToast("当前账号为只读成员", "可以查看服务状态与日志，无法执行运维操作", "warning");
    return;
  }
  if (isOperationBusy()) {
    showToast("操作锁已占用", "请等待当前任务完成后重试", "warning");
    return;
  }
  if (action === "check") {
    runServiceAction(service.id, action);
    return;
  }
  state.confirm = { kind: "service", action, serviceIds: [service.id] };
  render();
  queueMicrotask(() => document.querySelector("#confirm-input, [data-confirm-submit]")?.focus());
}

function openGlobalAction(action) {
  if (!canOperateCurrentUser()) {
    showToast("当前账号为只读成员", "可以查看运行状态，无法发起批量操作", "warning");
    return;
  }
  if (isOperationBusy()) {
    showToast("操作锁已占用", "请等待当前任务完成后重试", "warning");
    return;
  }
  const serviceIds = action === "check-all"
    ? state.services.map((service) => service.id)
    : [...state.selectedServices].filter((id) => {
        const service = serviceById(id);
        return service && !service.protected && service.automaticOperations !== false;
      });
  if (action === "check-all") {
    runGlobalAction(action, { serviceIds });
    return;
  }
  if (!serviceIds.length) {
    showToast("尚未选择服务", "请先选择至少一个允许自动操作的业务服务", "warning");
    return;
  }
  const actionConfig = ACTIONS[action];
  if (!actionConfig) return;
  state.confirm = {
    kind: "global",
    action,
    serviceIds,
    tone: action === "stop" ? "danger" : "default",
    expected: action === "stop" ? "停止服务" : "",
    title: actionLabel(action),
    description: actionConfig.description,
    impacts: ["操作只覆盖服务清单中的业务进程", "管理台、Nginx、Tunnel 与数据库保持运行", "所有步骤进入统一操作记录"],
  };
  render();
}

function openStorageAction(action) {
  if (!isCurrentUserOwner()) {
    showToast("需要所有者权限", "存储清理和删除仅允许所有者执行", "warning");
    return;
  }
  if (!state.storage || isOperationBusy()) return;
  const selected = state.storage.items.filter((item) => state.selectedStorage.has(item.id));
  const configurations = {
    "storage-clear-cache": {
      title: "清理推荐缓存",
      description: "删除可重新生成且标记为建议清理的缓存。",
      impacts: ["只处理可删除的推荐缓存", "依赖目录与线上构建产物不会删除", "清理结果写入操作记录"],
    },
    "storage-cleanup-expired": {
      title: "清理过期项",
      description: `按 ${state.storage.retentionDays} 天保留策略清理过期备份与日志。`,
      impacts: ["只处理超过保留周期的可删除项", "正在使用的产物与回滚备份保持锁定", "已删除内容不可恢复"],
    },
    "storage-delete": {
      title: "删除已选存储项",
      description: "永久删除当前选择的存储项。",
      impacts: ["只删除当前已选且允许删除的项目", "锁定项会被服务端拒绝", "删除后无法恢复"],
      tone: "danger",
      expected: "删除",
      itemCount: selected.length,
      itemSize: selected.reduce((sum, item) => sum + item.size, 0),
      ids: selected.map((item) => item.id),
    },
  };
  const config = configurations[action];
  if (!config || (action === "storage-delete" && !selected.length)) return;
  state.confirm = { kind: "storage", action, ...config };
  render();
  queueMicrotask(() => document.querySelector("#confirm-input, [data-confirm-submit]")?.focus());
}

function openPasswordChange(trigger) {
  const focusId = trigger?.dataset.focusId || "account-password";
  rememberFocus(`[data-focus-id="${CSS.escape(focusId)}"]`);
  state.confirm = { kind: "password-change" };
  document.querySelectorAll(".menu[open]").forEach((menu) => menu.removeAttribute("open"));
  render();
  queueMicrotask(() => document.querySelector("#current-password")?.focus());
}

function closeConfirm() {
  if (state.actionBusy || state.credentialBusy) return;
  const selector = state.focusReturnStack.pop() || "";
  state.confirm = null;
  render();
  restoreFocus(selector);
}

function ingestOperationResult(result, action, serviceIds) {
  const rawOperation = result?.operation || result?.data?.operation || (result?.id && result?.status ? result : null) || (result?.operationId ? { ...result, id: result.operationId } : null);
  if (!rawOperation) return null;
  const operation = normalizeOperation({ action, serviceIds, ...rawOperation });
  state.operations = [operation, ...state.operations.filter((item) => item.id !== operation.id)];
  if (["running", "queued"].includes(operation.status)) {
    state.overview = { ...(state.overview || {}), currentOperation: operation };
    scheduleOperationPoll(operation.id);
  }
  return operation;
}

function scheduleOperationPoll(operationId, attempt = 0) {
  clearTimeout(state.operationPollTimer);
  if (!operationId || attempt >= 360 || state.route === "login") return;
  state.operationPollTimer = setTimeout(async () => {
    try {
      const result = await api(`/api/v2/operations/${encodeURIComponent(operationId)}`);
      const operation = normalizeOperation(result?.operation || result);
      state.operations = [operation, ...state.operations.filter((item) => item.id !== operation.id)];
      if (["running", "queued"].includes(operation.status)) {
        state.overview = { ...(state.overview || {}), currentOperation: operation };
        render();
        scheduleOperationPoll(operationId, attempt + 1);
        return;
      }
      if (state.overview?.currentOperation?.id === operation.id) state.overview.currentOperation = null;
      render();
      showToast(`${actionLabel(operation.action)}${operation.status === "completed" ? "成功" : "失败"}`, operation.serviceIds.map(serviceName).join("、") || operation.target, operation.status === "completed" ? "success" : "error", 6500);
      await bootstrap({ silent: true });
      if (state.route === "storage") await loadStorage(true);
      if (state.route === "logs") await loadLogs(true);
    } catch (error) {
      if (handleUnauthorized(error)) return;
      if (error.status === 404 && attempt < 6) scheduleOperationPoll(operationId, attempt + 1);
      else if (error.code === "network_error" && attempt < 20) scheduleOperationPoll(operationId, attempt + 1);
    }
  }, attempt < 3 ? 1200 : 2200);
}

async function runServiceAction(serviceId, action) {
  const service = serviceById(serviceId);
  if (!service || state.actionBusy) return;
  state.confirm = null;
  state.actionBusy = { action, target: service.name, serviceIds: [serviceId], startedAt: new Date().toISOString() };
  render();
  try {
    const result = await api(`/api/v2/services/${encodeURIComponent(serviceId)}/actions`, {
      method: "POST",
      body: JSON.stringify({ action }),
      timeout: ["build", "deploy"].includes(action) ? 12 * 60_000 : 3 * 60_000,
    });
    const operation = ingestOperationResult(result, action, [serviceId]);
    if (operation?.status === "failed") showToast(`${actionLabel(action)}失败`, service.name, "error", 7000);
    else showToast(operation && ["running", "queued"].includes(operation.status) ? "任务已提交" : `${actionLabel(action)}完成`, service.name, "success");
    if (action === "logs") state.logs = null;
  } catch (error) {
    if (handleUnauthorized(error)) return;
    if (error.status === 409) {
      showToast("操作锁已占用", humanError(error), "warning");
    } else if (["project", "project-manager"].includes(serviceId) && ["restart", "deploy"].includes(action) && error.code === "network_error") {
      showToast("管理台连接已中断", "自重启可能仍在执行，页面将自动重新连接", "warning", 7000);
    } else {
      showToast(`${actionLabel(action)}失败`, humanError(error), "error", 7000);
    }
  } finally {
    state.actionBusy = null;
    render();
    await bootstrap({ silent: true });
  }
}

async function runGlobalAction(action, payload = {}) {
  if (state.actionBusy) return;
  state.confirm = null;
  state.actionBusy = { action, target: "业务服务", serviceIds: payload.serviceIds || [], startedAt: new Date().toISOString() };
  render();
  try {
    const wireAction = action === "check-all" ? "check" : action;
    const result = await api("/api/v2/actions", {
      method: "POST",
      body: JSON.stringify({ action: wireAction, ...(payload.serviceIds ? { serviceIds: payload.serviceIds } : {}), ...(payload.ids ? { ids: payload.ids } : {}) }),
      timeout: action.includes("storage") ? 5 * 60_000 : 12 * 60_000,
    });
    const operation = ingestOperationResult(result, action, payload.serviceIds || []);
    showToast(operation && ["running", "queued"].includes(operation.status) ? "任务已提交" : `${actionLabel(action)}完成`, operation?.id || "操作记录已更新", "success");
    if (action.startsWith("storage")) {
      state.storage = null;
      state.selectedStorage.clear();
    }
  } catch (error) {
    if (handleUnauthorized(error)) return;
    showToast(error.status === 409 ? "操作锁已占用" : `${actionLabel(action)}失败`, humanError(error), error.status === 409 ? "warning" : "error", 7000);
  } finally {
    state.actionBusy = null;
    render();
    await bootstrap({ silent: true });
    if (state.route === "storage") await loadStorage(true);
  }
}

function executeConfirm() {
  const confirm = state.confirm;
  if (!confirm) return;
  state.focusReturnStack.pop();
  if (confirm.kind === "service") return runServiceAction(confirm.serviceIds[0], confirm.action);
  if (confirm.kind === "storage") return runGlobalAction(confirm.action, { ids: confirm.ids || [] });
  if (confirm.kind === "admin-delete") return deleteAdmin(confirm.adminId);
  return runGlobalAction(confirm.action, { serviceIds: confirm.serviceIds || [] });
}

async function deleteAdmin(adminId) {
  state.confirm = null;
  try {
    await api(`/api/v2/admins/${encodeURIComponent(adminId)}`, { method: "DELETE" });
    await loadAdmins(true);
    showToast("管理员已删除", "该账号的登录会话已撤销", "success");
  } catch (error) {
    showToast("删除失败", humanError(error), "error");
    render();
  }
}

async function logout() {
  clearTimeout(state.operationPollTimer);
  try {
    await api("/api/logout", { method: "POST" });
  } catch (error) {
    if (error.status !== 401) showToast("退出失败", humanError(error), "error");
  }
  state.initialized = false;
  state.overview = null;
  state.services = [];
  state.operations = [];
  state.inventory = null;
  state.logs = null;
  state.storage = null;
  navigate("/v2/login", { replace: true });
}

function rerenderWithFocus(inputId, caret = null) {
  render();
  queueMicrotask(() => {
    const input = document.querySelector(`#${CSS.escape(inputId)}`);
    if (!input) return;
    input.focus();
    if (caret !== null && input.setSelectionRange) input.setSelectionRange(caret, caret);
  });
}

document.addEventListener("click", async (event) => {
  const menuSummary = event.target.closest(".menu > summary");
  if (menuSummary) {
    const menu = menuSummary.closest(".menu");
    document.querySelectorAll(".menu[open]").forEach((item) => {
      if (item !== menu) item.removeAttribute("open");
    });
    requestAnimationFrame(() => {
      if (!menu.open) return;
      menu.classList.remove("menu-open-up");
      const popover = menu.querySelector(".menu-popover");
      if (!popover) return;
      const rect = popover.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 12 && menu.getBoundingClientRect().top > rect.height + 12) {
        menu.classList.add("menu-open-up");
      }
    });
    return;
  }

  const routeTrigger = event.target.closest("[data-route]");
  if (routeTrigger && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) {
    event.preventDefault();
    navigate(routeTrigger.dataset.route);
    return;
  }

  const dismissToast = event.target.closest("[data-dismiss-toast]");
  if (dismissToast) {
    document.querySelector(`[data-toast-id="${CSS.escape(dismissToast.dataset.dismissToast)}"]`)?.remove();
    return;
  }

  if (event.target.matches("[data-close-modal]") && !event.target.closest("[data-modal-panel]")) {
    closeConfirm();
    return;
  }

  const closeModal = event.target.closest("[data-close-modal]");
  if (closeModal) {
    closeConfirm();
    return;
  }

  if (event.target.closest("[data-close-drawer]")) {
    closeServiceDrawer();
    return;
  }

  if (event.target.closest("[data-close-operation]")) {
    closeOperationDrawer();
    return;
  }

  const serviceTrigger = event.target.closest("[data-open-service]");
  if (serviceTrigger) {
    rememberFocus(`[data-open-service][data-service-id="${CSS.escape(serviceTrigger.dataset.serviceId)}"]`);
    openService(serviceTrigger.dataset.serviceId);
    return;
  }

  const serviceAction = event.target.closest("[data-service-action]");
  if (serviceAction && !serviceAction.disabled) {
    rememberFocus(`[data-service-action="${CSS.escape(serviceAction.dataset.serviceAction)}"][data-service-id="${CSS.escape(serviceAction.dataset.serviceId)}"]`);
    openServiceAction(serviceAction.dataset.serviceId, serviceAction.dataset.serviceAction);
    return;
  }

  const globalAction = event.target.closest("[data-global-action]");
  if (globalAction && !globalAction.disabled) {
    openGlobalAction(globalAction.dataset.globalAction);
    return;
  }

  const storageAction = event.target.closest("[data-storage-action]");
  if (storageAction && !storageAction.disabled) {
    openStorageAction(storageAction.dataset.storageAction);
    return;
  }

  const operationTrigger = event.target.closest("[data-operation-id]");
  if (operationTrigger) {
    rememberFocus(`[data-operation-id="${CSS.escape(operationTrigger.dataset.operationId)}"]`);
    openOperation(operationTrigger.dataset.operationId);
    return;
  }

  const adminToggle = event.target.closest("[data-admin-toggle]");
  if (adminToggle) {
    try {
      await api(`/api/v2/admins/${encodeURIComponent(adminToggle.dataset.adminToggle)}`, { method: "PATCH", body: JSON.stringify({ disabled: adminToggle.dataset.disabled === "true" }) });
      await loadAdmins(true);
      showToast("管理员状态已更新", "", "success");
    } catch (error) { showToast("更新失败", humanError(error), "error"); }
    return;
  }

  const adminReset = event.target.closest("[data-admin-reset]");
  if (adminReset) {
    const row = adminReset.closest("[data-admin-row]");
    const password = row?.querySelector("[data-admin-new-password]")?.value || "";
    if (password.length < 12) { showToast("密码不符合要求", "至少输入 12 位新密码", "warning"); return; }
    if (password.length > 256) { showToast("密码不符合要求", "新密码不能超过 256 位", "warning"); return; }
    try {
      await api(`/api/v2/admins/${encodeURIComponent(adminReset.dataset.adminReset)}`, { method: "PATCH", body: JSON.stringify({ password }) });
      row.querySelector("[data-admin-new-password]").value = "";
      showToast("密码已重置", "该管理员的旧会话已撤销", "success");
    } catch (error) { showToast("重置失败", humanError(error), "error"); }
    return;
  }

  const adminDelete = event.target.closest("[data-admin-delete]");
  if (adminDelete) {
    const adminId = adminDelete.dataset.adminDelete;
    const admin = state.adminsData?.admins?.find((item) => item.id === adminId);
    rememberFocus(`[data-admin-delete="${CSS.escape(adminId)}"]`);
    state.confirm = {
      kind: "admin-delete",
      action: "admin-delete",
      adminId,
      title: `删除管理员 · ${admin?.displayName || admin?.username || "未命名账号"}`,
      description: "删除后该账号将立即失去访问权限。",
      impacts: ["立即撤销该管理员的全部登录会话", "保留该账号曾执行的操作审计记录", "删除后无法恢复"],
      tone: "danger",
      expected: admin?.username || "删除管理员",
    };
    render();
    queueMicrotask(() => document.querySelector("#confirm-input")?.focus());
    return;
  }

  const actionTrigger = event.target.closest("[data-action]");
  if (actionTrigger) {
    const action = actionTrigger.dataset.action;
    if (action === "refresh") refreshCurrent();
    else if (action === "refresh-admins") loadAdmins(true);
    else if (action === "refresh-logs") loadLogs(true);
    else if (action === "refresh-storage") loadStorage(true);
    else if (action === "change-password") openPasswordChange(actionTrigger);
    else if (action === "toggle-password") {
      const targetId = actionTrigger.dataset.passwordTarget || "manager-password";
      const password = document.querySelector(`#${CSS.escape(targetId)}`);
      if (!password) return;
      const reveal = password.type === "password";
      password.type = reveal ? "text" : "password";
      const fieldName = actionTrigger.closest(".form-group")?.querySelector("label")?.textContent?.trim() || "密码";
      actionTrigger.setAttribute("aria-label", `${reveal ? "隐藏" : "显示"}${fieldName}`);
      actionTrigger.innerHTML = icon(reveal ? "eye-off" : "eye");
      password.focus();
    }
    else if (action === "toggle-theme") {
      applyTheme(state.settings.theme === "dark" ? "light" : "dark");
      render();
    } else if (action === "toggle-nav") {
      state.navOpen = !state.navOpen;
      render();
    } else if (action === "close-nav") {
      state.navOpen = false;
      render();
    } else if (action === "logout") logout();
    return;
  }

  if (!event.target.closest(".menu")) document.querySelectorAll(".menu[open]").forEach((menu) => menu.removeAttribute("open"));
});

function showPasswordChangeError(form, message, fieldIds = []) {
  const error = form.querySelector("#password-change-error");
  if (error) {
    error.textContent = message;
    error.hidden = false;
  }
  for (const id of fieldIds) form.querySelector(`#${CSS.escape(id)}`)?.setAttribute("aria-invalid", "true");
  const firstField = fieldIds.length ? form.querySelector(`#${CSS.escape(fieldIds[0])}`) : null;
  firstField?.focus();
  firstField?.select();
}

document.addEventListener("submit", async (event) => {
  if (event.target.id === "password-change-form") {
    event.preventDefault();
    if (state.credentialBusy) return;
    const form = event.target;
    const currentPassword = form.elements.currentPassword.value;
    const newPassword = form.elements.newPassword.value;
    const confirmNewPassword = form.elements.confirmNewPassword.value;
    if (newPassword.length < 12) {
      showPasswordChangeError(form, "新密码至少需要 12 位", ["new-password"]);
      return;
    }
    if (newPassword.length > 256) {
      showPasswordChangeError(form, "新密码不能超过 256 位", ["new-password"]);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showPasswordChangeError(form, "两次输入的新密码不一致", ["confirm-new-password"]);
      return;
    }

    const button = form.querySelector("[data-password-change-submit]");
    state.credentialBusy = true;
    button.disabled = true;
    button.innerHTML = '<span class="spinner" aria-hidden="true"></span>保存中';
    try {
      const result = await api("/api/v2/account/password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const selector = state.focusReturnStack.pop() || "";
      state.session = { ...(state.session || {}), admin: result.admin || state.session?.admin };
      state.confirm = null;
      state.credentialBusy = false;
      render();
      restoreFocus(selector);
      const revoked = Number(result.revokedSessions || 0);
      showToast("密码已修改", revoked ? `已撤销其他设备上的 ${formatNumber(revoked)} 个会话` : "当前设备保持登录", "success");
    } catch (error) {
      state.credentialBusy = false;
      button.disabled = false;
      button.innerHTML = `${icon("lock")}保存新密码`;
      const attemptsRemaining = Number(error.data?.attemptsRemaining);
      const retryAfter = Number(error.data?.retryAfter);
      const detail = Number.isFinite(attemptsRemaining)
        ? `${humanError(error)}，还可尝试 ${attemptsRemaining} 次`
        : Number.isFinite(retryAfter)
          ? `${humanError(error)}（约 ${Math.ceil(retryAfter / 60)} 分钟后重试）`
          : humanError(error);
      const currentPasswordError = ["current_password_incorrect", "password_change_rate_limited"].includes(error.code);
      showPasswordChangeError(form, detail, [currentPasswordError ? "current-password" : "new-password"]);
    }
    return;
  }
  if (event.target.id === "confirm-form") {
    event.preventDefault();
    const input = event.target.querySelector("#confirm-input");
    if (input && input.value !== input.dataset.confirmExpected) return;
    executeConfirm();
    return;
  }
  if (event.target.id === "admin-create-form") {
    event.preventDefault();
    const data = new FormData(event.target);
    const role = data.get("role");
    try {
      await api("/api/v2/admins", { method: "POST", body: JSON.stringify({ username: data.get("username"), displayName: data.get("displayName"), password: data.get("password"), role, serviceIds: role === "owner" ? [] : data.getAll("serviceIds") }) });
      event.target.reset();
      await loadAdmins(true);
      showToast("管理员已创建", "", "success");
    } catch (error) { showToast("创建失败", humanError(error), "error"); }
    return;
  }
  if (event.target.id !== "login-form") return;
  event.preventDefault();
  const button = event.target.querySelector("[data-login-submit]");
  const errorMessage = event.target.querySelector("#login-error");
  const username = event.target.elements.username.value;
  const password = event.target.elements.password.value;
  button.disabled = true;
  button.innerHTML = '<span class="spinner" aria-hidden="true"></span>登录中';
  errorMessage.textContent = "";
  errorMessage.hidden = true;
  event.target.elements.password.removeAttribute("aria-invalid");
  try {
    await api("/api/login", { method: "POST", body: JSON.stringify({ username, password }) });
    const next = new URLSearchParams(location.search).get("next");
    const target = next?.startsWith("/v2") && !next.startsWith("/v2/login") ? next : "/v2";
    history.replaceState({}, "", target);
    const routeState = routeStateFromLocation();
    state.route = routeState.route;
    state.drawerServiceId = routeState.drawerServiceId;
    render();
    await bootstrap({ force: true });
  } catch (error) {
    const attemptsRemaining = Number(error.data?.attemptsRemaining);
    const retryAfter = Number(error.data?.retryAfter);
    errorMessage.textContent = Number.isFinite(attemptsRemaining)
      ? `${humanError(error)}，还可尝试 ${attemptsRemaining} 次`
      : Number.isFinite(retryAfter)
        ? `${humanError(error)}（约 ${Math.ceil(retryAfter / 60)} 分钟）`
        : humanError(error);
    errorMessage.hidden = false;
    event.target.elements.password.setAttribute("aria-invalid", "true");
    event.target.elements.password.focus();
    event.target.elements.password.select();
    button.disabled = false;
    button.innerHTML = `${icon("lock")}登录`;
  }
});

document.addEventListener("input", (event) => {
  if (["current-password", "new-password", "confirm-new-password"].includes(event.target.id)) {
    event.target.removeAttribute("aria-invalid");
    const error = document.querySelector("#password-change-error");
    if (error) {
      error.hidden = true;
      error.textContent = "";
    }
  }
  if (["manager-username", "manager-password"].includes(event.target.id)) {
    event.target.removeAttribute("aria-invalid");
    const error = document.querySelector("#login-error");
    if (error) {
      error.hidden = true;
      error.textContent = "";
    }
  }
  if (event.target.id === "confirm-input") {
    const submit = document.querySelector("[data-confirm-submit]");
    if (submit) submit.disabled = event.target.value !== event.target.dataset.confirmExpected;
    return;
  }
  if (event.target.id === "service-search") {
    state.serviceFilters.search = event.target.value;
    rerenderWithFocus("service-search", event.target.selectionStart);
    return;
  }
  if (event.target.id === "operation-search") {
    state.operationFilters.search = event.target.value;
    rerenderWithFocus("operation-search", event.target.selectionStart);
  }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "bulk-select-all") {
    const eligible = state.services.filter((service) => !service.protected && service.automaticOperations !== false);
    state.selectedServices = event.target.checked ? new Set(eligible.map((service) => service.id)) : new Set();
    render();
  } else if (event.target.matches("[data-bulk-service]")) {
    if (event.target.checked) state.selectedServices.add(event.target.dataset.bulkService);
    else state.selectedServices.delete(event.target.dataset.bulkService);
    render();
  } else if (event.target.id === "service-status-filter") {
    state.serviceFilters.status = event.target.value;
    render();
  } else if (event.target.id === "service-capability-filter") {
    state.serviceFilters.capability = event.target.value;
    render();
  } else if (event.target.id === "operation-status-filter") {
    state.operationFilters.status = event.target.value;
    render();
  } else if (event.target.id === "operation-action-filter") {
    state.operationFilters.action = event.target.value;
    render();
  } else if (event.target.id === "log-service-filter") {
    state.logFilters.serviceId = event.target.value;
    state.logFilters.source = "all";
    state.logs = null;
    loadLogs(true);
  } else if (event.target.id === "log-source-filter") {
    state.logFilters.source = event.target.value;
    render();
  } else if (event.target.id === "log-level-filter") {
    state.logFilters.level = event.target.value;
    render();
  } else if (event.target.id === "storage-type-filter") {
    state.storageFilters.type = event.target.value;
    render();
  } else if (event.target.matches("[data-storage-id]")) {
    if (event.target.checked) state.selectedStorage.add(event.target.dataset.storageId);
    else state.selectedStorage.delete(event.target.dataset.storageId);
    render();
  } else if (event.target.id === "theme-setting") {
    applyTheme(event.target.checked ? "dark" : "light");
    render();
  } else if (event.target.id === "refresh-setting") {
    state.settings.refreshSeconds = Number(event.target.value);
    localStorage.setItem("project-ops-refresh", String(state.settings.refreshSeconds));
    schedulePolling();
    render();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.target.id === "manager-password") {
    const message = document.querySelector("#caps-lock-message");
    if (message) message.hidden = !event.getModifierState?.("CapsLock");
  }
  if (event.key !== "Escape") return;
  if (state.confirm) closeConfirm();
  else if (state.operationDrawerId) closeOperationDrawer();
  else if (state.drawerServiceId) closeServiceDrawer();
  else if (state.navOpen) {
    state.navOpen = false;
    render();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.target.id !== "manager-password") return;
  const message = document.querySelector("#caps-lock-message");
  if (message) message.hidden = !event.getModifierState?.("CapsLock");
});

window.addEventListener("popstate", () => {
  const next = routeStateFromLocation();
  state.route = next.route;
  state.drawerServiceId = next.drawerServiceId;
  state.drawerReturnPath = null;
  state.operationDrawerId = null;
  state.confirm = null;
  state.navOpen = false;
  render();
  const pendingFocus = state.pendingFocusSelector;
  state.pendingFocusSelector = "";
  restoreFocus(pendingFocus);
  if (state.route !== "login") loadRouteData(false);
});

applyTheme(state.settings.theme);
const initialRoute = routeStateFromLocation();
state.route = initialRoute.route;
state.drawerServiceId = initialRoute.drawerServiceId;
render();
if (state.route !== "login") bootstrap({ force: true });

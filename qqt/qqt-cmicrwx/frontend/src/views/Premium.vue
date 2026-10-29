<template>
  <div class="premium-page">
    <header class="page-header">
      <div>
        <p class="eyebrow">高速抢购页面 · Premium</p>
        <h1>毫秒级轮询与时间校准</h1>
        <p class="lead">
          设计用于高并发抢购的前端架构示例：毫秒级轮询、不等待返回继续调度、并发请求安全落盘日志。
        </p>
      </div>
      <div class="header-actions">
        <button class="ghost-button" type="button" @click="syncTime" :disabled="syncingTime">
          {{ syncingTime ? "校准中..." : "立即校准标准北京时间" }}
        </button>
        <div class="time-chip">
          <span>当前标准时间</span>
          <strong>{{ beijingTime }}</strong>
          <small>偏移 {{ timeOffsetMs }} ms · {{ lastSyncLabel }}</small>
        </div>
      </div>
    </header>

    <section class="controls">
      <div class="control-card">
        <h2>轮询设置中心</h2>
        <label>
          每轮间隔 (ms)
          <input v-model.number="config.intervalMs" type="number" min="5" step="5" />
        </label>
        <label>
          最大轮询次数
          <input v-model.number="config.maxRounds" type="number" min="1" />
        </label>
        <label>
          每轮并发请求数
          <input v-model.number="config.batchSize" type="number" min="1" />
        </label>
        <p class="hint">
          配置后，“一键抢购”“立即领取”都会遵循当前的间隔与轮次数。调度器不等待接口返回即可进入下一轮。
        </p>
      </div>

      <div class="control-card actions">
        <h2>操作面板</h2>
        <div class="action-row">
          <button type="button" class="primary" @click="fireOnce" :disabled="state.running">
            立即领取（单次）
          </button>
          <button type="button" class="accent" @click="startBurst" :disabled="state.running">
            一键抢购（轮询）
          </button>
          <button type="button" class="ghost" @click="stopBurst" :disabled="!state.running">
            停止调度
          </button>
        </div>
        <div class="status-grid">
          <div><span>运行状态</span><strong>{{ state.running ? "进行中" : "待机" }}</strong></div>
          <div><span>已轮询</span><strong>{{ state.round }}/{{ config.maxRounds }}</strong></div>
          <div><span>已发起</span><strong>{{ state.sent }}</strong></div>
          <div><span>进行中</span><strong>{{ state.inFlight }}</strong></div>
          <div><span>成功</span><strong class="success">{{ state.succeeded }}</strong></div>
          <div><span>失败</span><strong class="danger">{{ state.failed }}</strong></div>
        </div>
      </div>

      <div class="control-card">
        <h2>高并发设计要点</h2>
        <ul class="pill-list">
          <li>调度与请求解耦：setInterval 固定节奏，Promise 链独立收尾</li>
          <li>日志写入异步化：前端只负责内存追加，后端落库</li>
          <li>时间同步：客户端维护 serverTimeOffset，日志展示统一时间源</li>
          <li>批次与并发可调：batchSize 控制单轮并发，maxRounds 控制总量</li>
        </ul>
      </div>
    </section>

    <section class="diagram-grid">
      <div class="diagram-card">
        <h3>Home.vue / Premium 页面结构图</h3>
        <pre class="diagram">
┌─────────────────────────────── PremiumView ────────────────────────────────┐
│ Header (时间校准 / 描述)                                                   │
│ Controls                                                                   │
│   ├─ SettingsCenter (间隔+轮次+并发)                                       │
│   ├─ ActionPanel (单次 / 轮询 / 停止)                                      │
│   └─ StatusStrip (统计 / 运行态)                                           │
│ Timeline                                                                   │
│   └─ Logger (ms 级时间戳，非阻塞渲染)                                      │
│ Architecture                                                               │
│   ├─ Polling Controller 状态流转图                                         │
│   ├─ Scheduler ↔ Logger 数据流                                             │
│   └─ TimeSync 时钟同步流程                                                 │
└────────────────────────────────────────────────────────────────────────────┘
        </pre>
      </div>
      <div class="diagram-card">
        <h3>轮询控制器状态流转</h3>
        <pre class="diagram">
┌─────────────┐   startBurst    ┌───────────────┐   interval tick   ┌───────────┐
│   Idle       │ ─────────────▶ │  Scheduling    │ ────────────────▶ │ Dispatch  │
└─────────────┘                  │(round++)      │                   │ (batch)   │
        ▲                        └─────┬─────────┘                   └────┬──────┘
        │ stopBurst / done              │ responses (async)               │ logs append
        └───────────────────────────────┴──────────────────────────────────┘
        </pre>
      </div>
      <div class="diagram-card">
        <h3>请求调度器与日志模块</h3>
        <pre class="diagram">
Scheduler:setInterval ─┬─► Dispatch N requests (fire & forget)
                        │
                        └─► Logger.append({id, requestAt, ms})
                                 │
                          responses settle
                                 │
                        Logger.update({statusCode?, latency})
                        UI: 非阻塞渲染，仅展示最新 200 条
        </pre>
      </div>
      <div class="diagram-card">
        <h3>TimeSync 工作流程</h3>
        <pre class="diagram">
按需 / 每分钟触发 syncTime()
    ▼
GET https://worldtimeapi.org/api/timezone/Asia/Shanghai
    ▼
serverNowMs - clientNowMs = offset
    ▼
前端显示时间 = Date.now() + offset (ms 精度)
    ▼
日志与倒计时统一采用校准后的时间基准
        </pre>
      </div>
    </section>

    <section class="log-panel">
      <div class="log-header">
        <div>
          <h3>抢购日志（非阻塞）</h3>
          <p>毫秒级记录发起时间，响应时补充状态码；仅保留最近 {{ logLimit }} 条。</p>
        </div>
        <button type="button" class="ghost" @click="clearLogs">清空日志</button>
      </div>
      <div class="log-list">
        <div v-for="log in mappedLogs" :key="log.id" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-id">#{{ log.id }}</span>
          <span class="log-status" :class="log.statusClass">
            {{ log.statusLabel }}
          </span>
          <span class="log-meta">
            {{ log.statusCode ? `状态 ${log.statusCode}` : "等待响应" }} ·
            {{ log.latency ? `${log.latency}ms` : "处理中" }}
          </span>
        </div>
      </div>
    </section>

    <section class="server-notes">
      <h3>Node 服务端配合策略（建议）</h3>
      <ul>
        <li>使用 Node 18+ + Worker Threads/cluster，避免单线程被密集 I/O 阻塞；每个 worker 维护自己的连接池。</li>
        <li>调度使用消息队列（BullMQ/RabbitMQ），前端推送任务仅写入队列，worker 拉取执行，保证可追踪的 requestId。</li>
        <li>HTTP keep-alive + HTTP/2 复用，减少握手开销；必要时结合 TCP Fast Open。</li>
        <li>限速与熔断：在 worker 层对同一账号/商品做令牌桶控制，避免被服务端封禁。</li>
        <li>日志异步落库（例如 ClickHouse 或 Kafka + OLAP），前端仅做展示，不阻塞抢购线程。</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import dayjs from "dayjs";

type LogEntry = {
  id: number;
  issuedAt: number;
  latency?: number;
  statusCode?: number;
  status?: "pending" | "success" | "fail";
  time: string;
};

const config = reactive({
  intervalMs: 50,
  maxRounds: 50,
  batchSize: 3,
});

const state = reactive({
  running: false,
  round: 0,
  sent: 0,
  succeeded: 0,
  failed: 0,
  inFlight: 0,
});

const logs = ref<LogEntry[]>([]);
const logLimit = 200;

const now = ref(Date.now());
const timeOffset = ref(0);
const lastSyncAt = ref<number | null>(null);
const syncingTime = ref(false);

let loopTimer: number | null = null;
let nowTimer: number | null = null;
let requestId = 0;

const timeOffsetMs = computed(() => Math.round(timeOffset.value));
const beijingTime = computed(() =>
  dayjs(now.value + timeOffset.value).format("YYYY-MM-DD HH:mm:ss.SSS")
);
const lastSyncLabel = computed(() => {
  if (!lastSyncAt.value) return "尚未校准";
  return `最近校准 ${dayjs(lastSyncAt.value).format("HH:mm:ss")}`;
});

function tickNow() {
  now.value = Date.now();
}

function appendLog(entry: LogEntry) {
  logs.value = [entry, ...logs.value].slice(0, logLimit);
}

function updateLog(id: number, updates: Partial<LogEntry>) {
  logs.value = logs.value.map((item) =>
    item.id === id ? { ...item, ...updates } : item
  );
}

async function mockHighSpeedRequest() {
  const randomLatency = Math.floor(8 + Math.random() * 40);
  await new Promise((resolve) => setTimeout(resolve, randomLatency));
  const ok = Math.random() > 0.05;
  return {
    ok,
    status: ok ? 200 : 429,
    latency: randomLatency,
  };
}

async function dispatchRequest() {
  const id = ++requestId;
  state.sent += 1;
  state.inFlight += 1;
  const issuedAt = now.value + timeOffset.value;
  appendLog({
    id,
    issuedAt,
    time: dayjs(issuedAt).format("HH:mm:ss.SSS"),
    status: "pending",
  });

  try {
    const resp = await mockHighSpeedRequest();
    if (resp.ok) {
      state.succeeded += 1;
      updateLog(id, {
        status: "success",
        statusCode: resp.status,
        latency: resp.latency,
      });
    } else {
      state.failed += 1;
      updateLog(id, {
        status: "fail",
        statusCode: resp.status,
        latency: resp.latency,
      });
    }
  } catch (error) {
    state.failed += 1;
    updateLog(id, { status: "fail", statusCode: 500 });
  } finally {
    state.inFlight = Math.max(0, state.inFlight - 1);
  }
}

function fireOnce() {
  if (state.running) return;
  dispatchRequest();
}

function dispatchBatch() {
  const batchSize = Math.max(1, Math.floor(config.batchSize));
  for (let i = 0; i < batchSize; i += 1) {
    dispatchRequest();
  }
}

function startBurst() {
  stopBurst();
  state.running = true;
  state.round = 0;
  state.sent = 0;
  state.succeeded = 0;
  state.failed = 0;
  state.inFlight = 0;
  const interval = Math.max(5, Math.floor(config.intervalMs));
  loopTimer = window.setInterval(() => {
    if (state.round >= config.maxRounds) {
      stopBurst();
      return;
    }
    state.round += 1;
    dispatchBatch();
  }, interval);
}

function stopBurst() {
  if (loopTimer) {
    clearInterval(loopTimer);
    loopTimer = null;
  }
  state.running = false;
}

function clearLogs() {
  logs.value = [];
}

async function syncTime() {
  try {
    syncingTime.value = true;
    const start = Date.now();
    const resp = await fetch("https://worldtimeapi.org/api/timezone/Asia/Shanghai", {
      cache: "no-store",
    });
    const end = Date.now();
    const data = await resp.json();
    const serverMs = new Date(data.datetime).getTime();
    const latency = (end - start) / 2;
    const clientMid = start + latency;
    timeOffset.value = serverMs - clientMid;
    lastSyncAt.value = Date.now();
  } catch (error) {
    console.warn("[time-sync] failed", error);
  } finally {
    syncingTime.value = false;
  }
}

onMounted(() => {
  nowTimer = window.setInterval(tickNow, 50);
  syncTime();
});

onBeforeUnmount(() => {
  if (loopTimer) clearInterval(loopTimer);
  if (nowTimer) clearInterval(nowTimer);
});

const logStatusMap: Record<
  NonNullable<LogEntry["status"]>,
  { label: string; className: string }
> = {
  pending: { label: "进行中", className: "pending" },
  success: { label: "成功", className: "success" },
  fail: { label: "失败", className: "danger" },
};

const mappedLogs = computed(() =>
  logs.value.map((log) => {
    const map = log.status ? logStatusMap[log.status] : logStatusMap.pending;
    return {
      ...log,
      statusLabel: map.label,
      statusClass: map.className,
    };
  })
);
</script>

<style scoped>
.premium-page {
  padding: 32px 20px 64px;
  color: #0f172a;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%);
}
.page-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  padding: 16px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6366f1;
  font-weight: 700;
  margin: 0 0 4px;
}
.page-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
}
.lead {
  margin: 6px 0 0;
  color: #334155;
}
.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
button {
  border: none;
  background: #e2e8f0;
  color: #0f172a;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(79, 70, 229, 0.12);
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
  transform: none;
}
button.primary {
  background: #4f46e5;
  color: #fff;
}
button.accent {
  background: #0ea5e9;
  color: #fff;
}
button.ghost {
  background: #fff;
  border: 1px solid #cbd5e1;
}
.ghost-button {
  background: linear-gradient(90deg, #fbe7a1 0%, #f1cd60 100%);
  color: #000;
  padding: 10px 14px;
  border-radius: 12px;
  min-width: 220px;
  color: #000;
}
.time-chip {
  width: 300px;
  color: #e2e8f0;
  padding: 10px 14px;
  border-radius: 12px;
  min-width: 220px;
  color: #000;
}
.time-chip strong {
  display: block;
  font-size: 16px;
  margin-top: 4px;
  color: #000;
}
.time-chip small {
  color: #000;
}
.controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin: 18px 0 12px;
}
.control-card {
  background: #fff;
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}
.control-card h2 {
  margin: 0 0 12px;
}
.control-card label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
  font-weight: 600;
  color: #334155;
}
.control-card input {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
}
.control-card .hint {
  color: #475569;
  margin: 6px 0 0;
  font-size: 13px;
}
.action-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}
.status-grid div {
  background: #f8fafc;
  padding: 10px;
  border-radius: 10px;
}
.status-grid span {
  display: block;
  color: #475569;
  font-size: 12px;
}
.status-grid strong {
  font-size: 18px;
}
.status-grid .success {
  color: #10b981;
}
.status-grid .danger {
  color: #ef4444;
}
.pill-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pill-list li {
  background: #f1f5f9;
  padding: 10px 12px;
  border-radius: 12px;
  color: #0f172a;
  border: 1px solid #e2e8f0;
}
.diagram-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
  margin-top: 12px;
}
.diagram-card {
  background: #0f172a;
  color: #e2e8f0;
  padding: 14px;
  border-radius: 14px;
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.2);
}
.diagram-card h3 {
  margin: 0 0 8px;
}
.diagram {
  background: #0b1120;
  color: #e2e8f0;
  padding: 12px;
  border-radius: 10px;
  font-family: "SFMono-Regular", Consolas, Monaco, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
  overflow: auto;
}
.log-panel {
  margin-top: 16px;
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}
.log-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}
.log-list {
  max-height: 360px;
  overflow: auto;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
}
.log-item {
  display: flex;
  gap: 12px;
  padding: 8px 12px;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}
.log-item:last-child {
  border-bottom: none;
}
.log-time {
  font-family: "SFMono-Regular", Consolas, monospace;
  color: #0f172a;
}
.log-id {
  color: #475569;
}
.log-status {
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 700;
}
.log-status.success {
  background: #dcfce7;
  color: #15803d;
}
.log-status.pending {
  background: #e0f2fe;
  color: #0369a1;
}
.log-status.danger {
  background: #fee2e2;
  color: #b91c1c;
}
.log-meta {
  color: #475569;
  font-size: 12px;
}
.server-notes {
  margin-top: 18px;
  background: #fff;
  padding: 14px;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}
.server-notes ul {
  padding-left: 18px;
  margin: 8px 0 0;
  display: grid;
  gap: 6px;
}
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }
  .diagram {
    font-size: 11px;
  }
}
</style>

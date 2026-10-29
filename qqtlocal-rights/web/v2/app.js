"use strict";

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const state = {
  key: localStorage.getItem("qqt_auth_key") || "",
  route: "overview",
  runtime: null,
  jobs: [],
  accounts: [],
  loading: false,
  error: "",
  modal: null,
  log: { jobId: "", files: [], file: "", content: "" },
};

const esc = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
const fmt = (value) => value ? new Date(value).toLocaleString("zh-CN", { hour12: false }) : "—";
const node = () => state.runtime?.execution_node || {};

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

async function api(path, init = {}) {
  const headers = new Headers(init.headers || {});
  if (state.key) headers.set("Authorization", `Bearer ${state.key}`);
  if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
  const response = await fetch(path, { ...init, headers });
  const payload = await response.json().catch(() => ({}));
  if (response.status === 401) {
    localStorage.removeItem("qqt_auth_key");
    state.key = "";
    render();
    throw new Error("密钥无效或已过期");
  }
  if (!response.ok) throw new Error(payload.detail || payload.message || `请求失败 (${response.status})`);
  return payload;
}

function loginView() {
  return `<section class="login">
    <aside class="login-side">
      <div class="brand"><span class="brand-mark">Q</span><span>QQT Rights V2</span></div>
      <h1>全球通权益任务工作台</h1>
      <span class="node-note">qqtlocal.1008086.xyz</span>
    </aside>
    <div class="login-main">
      <form class="login-form" id="login-form">
        <h2>授权登录</h2>
        <p class="muted">使用当前有效密钥进入。</p>
        <label class="field"><span>授权密钥</span><input name="key" type="password" autocomplete="current-password" required placeholder="请输入密钥"></label>
        <p class="error">${esc(state.error)}</p>
        <button class="button primary block" type="submit">进入工作台</button>
      </form>
    </div>
  </section>`;
}

function navButton(route, label) {
  return `<button type="button" data-route="${route}" class="${state.route === route ? "active" : ""}">${label}</button>`;
}

function shell(content) {
  const n = node();
  return `<div class="shell">
    <aside class="sidebar">
      <div class="brand"><span class="brand-mark">Q</span><span>QQT Rights V2</span></div>
      <nav class="nav">${navButton("overview", "总览")}${navButton("tasks", "任务")}${navButton("accounts", "账号")}${navButton("logs", "日志")}${navButton("system", "系统")}</nav>
      <div class="sidebar-foot"><a class="button" href="/">返回 V1</a><button class="button" type="button" data-action="logout">退出</button></div>
    </aside>
    <header class="topbar"><strong>${({ overview: "运行总览", tasks: "任务中心", accounts: "账号同步", logs: "执行日志", system: "运行节点" })[state.route]}</strong><span class="node-pill"><strong>服务器本地</strong> · ${esc(n.hostname || "连接中")} · PID ${esc(n.service_pid || "—")}</span></header>
    <main class="content">${content}</main>
    ${state.modal === "create" ? createDialog() : ""}
  </div>`;
}

function pageHead(title, subtitle, actions = "") {
  return `<div class="page-head"><div><h1>${title}</h1><p class="muted">${subtitle}</p></div><div class="actions">${actions}</div></div>`;
}

function jobState(job) {
  if (job.state === "scheduled") return ["待执行", "warn"];
  if (job.state === "completed") return ["已完成", "ok"];
  return ["已保存", ""];
}

function jobRows(limit) {
  const jobs = typeof limit === "number" ? state.jobs.slice(0, limit) : state.jobs;
  if (!jobs.length) return `<div class="empty">暂无任务</div>`;
  return `<div class="rows">${jobs.map((job) => {
    const status = jobState(job);
    return `<div class="row"><div><strong>${esc(job.name || job.job_id)}</strong><div class="muted">${esc(job.activity_type || "normal")} · ${esc(job.executor || "python")}</div></div><span>${job.account_count || 0} 个账号</span><span>${fmt(job.next_run_time || job.last_started_at || job.created_at)}</span><div class="actions"><span class="tag ${status[1]}">${status[0]}</span><button class="button" data-run-job="${esc(job.job_id)}">运行</button></div></div>`;
  }).join("")}</div>`;
}

function overviewPage() {
  const scheduled = state.jobs.filter((job) => job.state === "scheduled").length;
  const completed = state.jobs.filter((job) => job.state === "completed").length;
  const n = node();
  return `<div class="page">
    ${pageHead("运行总览", "任务、账号与执行节点", `<button class="button" data-action="refresh">刷新</button><button class="button primary" data-action="open-create">新建任务</button>`)}
    <div class="notice">任务执行节点：${esc(n.hostname || "—")} · 服务 PID ${esc(n.service_pid || "—")} · 目录 ${esc(n.base_dir || "—")}</div>
    <section class="stats"><div class="stat"><span>任务总数</span><strong>${state.jobs.length}</strong></div><div class="stat"><span>待执行</span><strong>${scheduled}</strong></div><div class="stat"><span>已完成</span><strong>${completed}</strong></div><div class="stat"><span>已同步账号</span><strong>${state.accounts.length}</strong></div></section>
    <div class="grid-two"><section class="section"><div class="section-head"><h2>最近任务</h2><button class="button" data-route="tasks">查看全部</button></div>${jobRows(5)}</section><section class="section"><div class="section-head"><h2>运行节点</h2><span class="tag ok">本地执行</span></div>${runtimeList(true)}</section></div>
  </div>`;
}

function tasksPage() {
  return `<div class="page">${pageHead("任务中心", `${state.jobs.length} 个任务`, `<button class="button" data-action="refresh">刷新</button><button class="button primary" data-action="open-create">新建任务</button>`)}<section class="section"><div class="section-head"><h2>执行队列与历史</h2></div>${jobRows()}</section></div>`;
}

function accountsPage() {
  return `<div class="page">${pageHead("账号同步", `${state.accounts.length} 个当前有效账号`, `<button class="button primary" data-action="sync-accounts">同步 Cookie Ops Token</button>`)}
    <section class="section"><div class="section-head"><h2>有效 Token 账号</h2><span class="muted">仅显示脱敏信息</span></div>${state.accounts.length ? `<div class="table-wrap"><table><thead><tr><th>账号</th><th>Token 检查时间</th><th>到期时间</th><th>全球通</th><th>领取状态</th></tr></thead><tbody>${state.accounts.map((item) => `<tr><td>${esc(item.phone_masked || item.display_phone || "—")}</td><td>${fmt(item.accessTokenCheckedAt)}</td><td>${fmt(item.accessTokenExpiresAt)}</td><td><span class="tag ${item.isQqtUser ? "ok" : "warn"}">${item.isQqtUser ? "已确认" : "待确认"}</span></td><td>${item.monthlyReceived || item.xdrReceived ? "已领取" : "未领取"}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty">尚未同步账号</div>`}</section>
  </div>`;
}

function logsPage() {
  return `<div class="page">${pageHead("执行日志", state.log.jobId ? `任务 ${esc(state.log.jobId)}` : "选择任务查看服务器本地日志", `<button class="button" data-action="refresh-logs">刷新</button>`)}
    <div class="grid-two"><section class="section"><div class="section-head"><h2>日志文件</h2></div><div style="padding:14px"><label class="field"><span>任务</span><select id="log-job"><option value="">请选择</option>${state.jobs.map((job) => `<option value="${esc(job.job_id)}" ${job.job_id === state.log.jobId ? "selected" : ""}>${esc(job.name || job.job_id)}</option>`).join("")}</select></label>${state.log.files.map((file) => `<button class="button block" style="margin-bottom:8px" data-log-file="${esc(file)}">${esc(file)}</button>`).join("")}</div></section><section class="section"><div class="section-head"><h2>${esc(state.log.file || "日志输出")}</h2></div><pre class="terminal">${esc(state.log.content || "选择日志文件")}</pre></section></div>
  </div>`;
}

function runtimeList(compact = false) {
  const n = node();
  const rows = compact ? [["节点", n.hostname], ["服务 PID", n.service_pid], ["模式", n.execution_mode], ["启动时间", fmt(n.started_at)]] : [["实例 ID", n.instance_id], ["主机", n.hostname], ["服务 PID", n.service_pid], ["执行模式", n.execution_mode], ["绑定地址", `${n.bind_host || "—"}:${n.bind_port || "—"}`], ["Python", n.python], ["项目目录", n.base_dir], ["启动时间", fmt(n.started_at)]];
  return `<dl class="runtime">${rows.map(([label, value]) => `<dt>${label}</dt><dd>${esc(value ?? "—")}</dd>`).join("")}</dl>`;
}

function systemPage() {
  return `<div class="page">${pageHead("运行节点", "任务执行位置与 worker 路径", `<button class="button" data-action="refresh">运行自检</button><a class="button" href="/">V1</a>`)}<div class="notice">浏览器只提交任务配置；Python、Go 和 Java worker 均由下方服务器进程启动。</div><section class="section"><div class="section-head"><h2>服务实例</h2><span class="tag ok">服务器本地</span></div>${runtimeList(false)}</section><section class="section" style="margin-top:16px"><div class="section-head"><h2>Worker 路径</h2></div><dl class="runtime">${Object.entries(state.runtime?.worker_paths || {}).map(([key, value]) => `<dt>${esc(key)}</dt><dd>${esc(value)}</dd>`).join("")}</dl></section></div>`;
}
function createDialog() {
  return `<div class="modal"><form class="dialog" id="create-job-form"><div class="dialog-head"><h2>新建抢购任务</h2><button class="button" type="button" data-action="close-modal">关闭</button></div><div class="dialog-body"><div class="form-grid"><label class="field"><span>任务名称</span><input name="name" required value="全球通任务-${new Date().toLocaleDateString("zh-CN")}"></label><label class="field"><span>活动</span><select name="activity_type"><option value="normal">常态权益</option><option value="xingdong">星动日</option><option value="wed_recharge">周三充值</option></select></label><label class="field"><span>执行器</span><select name="executor"><option value="python">Python</option><option value="go">Go</option><option value="java">Java</option></select></label><label class="field"><span>执行时间</span><select name="schedule_type"><option value="immediate">立即执行</option><option value="date">指定时间</option></select></label><label class="field"><span>最大并发</span><input name="max_workers" type="number" min="1" max="30" value="10"></label><label class="field"><span>轮询次数</span><input name="poll_times" type="number" min="1" max="100" value="10"></label><label class="field"><span>产品 ID</span><input name="product_id" value="3442"></label><label class="field"><span>指定时间</span><input name="run_at" type="datetime-local"></label></div><label class="field"><span>账号来源</span><select name="account_source"><option value="sync">同步 Cookie Ops 有效 Token</option><option value="current">使用本页已同步账号</option></select></label><p class="error">${esc(state.error)}</p></div><div class="dialog-foot"><span class="muted">执行节点：${esc(node().hostname || "—")}</span><button class="button primary" type="submit">创建并执行</button></div></form></div>`;
}

function render() {
  if (!state.key) { app.innerHTML = loginView(); return; }
  const view = ({ overview: overviewPage, tasks: tasksPage, accounts: accountsPage, logs: logsPage, system: systemPage })[state.route] || overviewPage;
  app.innerHTML = shell(view());
}

async function refresh() {
  state.loading = true;
  try {
    const [runtime, jobs] = await Promise.all([api("/api/runtime"), api("/api/jobs")]);
    state.runtime = runtime;
    state.jobs = [...jobs].sort((a, b) => String(b.created_at || b.last_started_at || "").localeCompare(String(a.created_at || a.last_started_at || "")));
    state.error = "";
  } catch (error) { state.error = error.message; notify(error.message); }
  finally { state.loading = false; render(); }
}

async function syncAccounts() {
  notify("正在同步有效 Token...");
  const result = await api("/api/integrations/cmcc/sync-tokens", { method: "POST", body: JSON.stringify({ refresh: true }) });
  state.accounts = result.users || [];
  render();
  notify(`已同步 ${state.accounts.length} 个有效账号`);
  return state.accounts;
}

document.addEventListener("submit", async (event) => {
  if (event.target.id === "login-form") {
    event.preventDefault();
    const key = new FormData(event.target).get("key").trim();
    try { await fetch("/api/auth/key/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ key }) }).then(async (response) => { if (!response.ok) throw new Error("密钥不正确或已过期"); }); state.key = key; localStorage.setItem("qqt_auth_key", key); await refresh(); } catch (error) { state.error = error.message; render(); }
  }
  if (event.target.id === "create-job-form") {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.target));
    try {
      const accounts = form.account_source === "sync" ? await syncAccounts() : state.accounts;
      if (!accounts.length) throw new Error("没有可用于执行的有效账号");
      const payload = { name: form.name, activity_type: form.activity_type, executor: form.executor, schedule_type: form.schedule_type, run_at: form.schedule_type === "date" && form.run_at ? new Date(form.run_at).toISOString() : null, accounts: accounts.map((item) => ({ cookie: item.cookie, phone: item.phone || "", display_phone: item.display_phone || item.phone_masked || "", receive_phone: "" })), run_mode: "concurrent", max_workers: Number(form.max_workers), poll_times: Number(form.poll_times), poll_interval_ms: 0, product_id: form.product_id, use_server_time: true };
      const result = await api("/api/jobs", { method: "POST", body: JSON.stringify(payload) });
      state.modal = null; await refresh(); notify(`任务 ${result.job_id} 已创建`);
    } catch (error) { state.error = error.message; render(); }
  }
});

document.addEventListener("change", async (event) => {
  if (event.target.id === "log-job") { state.log = { jobId: event.target.value, files: [], file: "", content: "" }; if (state.log.jobId) { const result = await api(`/api/logs/${encodeURIComponent(state.log.jobId)}`); state.log.files = result.files || []; } render(); }
});

document.addEventListener("click", async (event) => {
  const route = event.target.closest("[data-route]")?.dataset.route;
  if (route) { state.route = route; render(); return; }
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "logout") { state.key = ""; localStorage.removeItem("qqt_auth_key"); render(); }
  if (action === "refresh") await refresh();
  if (action === "open-create") { state.modal = "create"; state.error = ""; render(); }
  if (action === "close-modal") { state.modal = null; render(); }
  if (action === "sync-accounts") { try { await syncAccounts(); } catch (error) { notify(error.message); } }
  if (action === "refresh-logs" && state.log.jobId) { const result = await api(`/api/logs/${encodeURIComponent(state.log.jobId)}`); state.log.files = result.files || []; render(); }
  const jobId = event.target.closest("[data-run-job]")?.dataset.runJob;
  if (jobId) { try { await api(`/api/jobs/${encodeURIComponent(jobId)}/run`, { method: "POST" }); notify("任务已加入服务器本地执行队列"); await refresh(); } catch (error) { notify(error.message); } }
  const file = event.target.closest("[data-log-file]")?.dataset.logFile;
  if (file && state.log.jobId) { const result = await api(`/api/logs/${encodeURIComponent(state.log.jobId)}/${encodeURIComponent(file)}`); state.log.file = file; state.log.content = result.content || ""; render(); }
});

render();
if (state.key) refresh();

const app = document.querySelector("#app");
let state = { busy: false, data: null, storage: null, selectedLog: null, selectedStorage: new Set() };

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "content-type": "application/json" },
    ...options,
  });
  if (response.status === 401) {
    route("/login");
    throw new Error("unauthorized");
  }
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || data.stderr || "request failed");
  return data;
}

function route(path) {
  history.pushState({}, "", path);
  renderRoute();
}

function formatBytes(value) {
  if (!value) return "0 B";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  if (value < 1024 * 1024 * 1024) return `${(value / 1024 / 1024).toFixed(1)} MB`;
  return `${(value / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function formatUptime(value) {
  if (!value) return "-";
  const seconds = Math.max(0, Math.floor((Date.now() - value) / 1000));
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function storageTypeLabel(type) {
  return {
    backup: "备份",
    log: "日志",
    cache: "缓存",
    artifact: "产物",
    dependency: "依赖",
  }[type] || type;
}

function loginView() {
  app.innerHTML = `
    <section class="login-page">
      <form id="loginForm" class="login-panel">
        <div>
          <p class="eyebrow">Project Manager</p>
          <h1>CMCC 项目管理</h1>
          <p class="subtle">统一管理公网项目的启动、停止、重启、构建和日志排查。</p>
        </div>
        <label>
          管理口令
          <input id="password" type="password" autocomplete="current-password" autofocus>
        </label>
        <button type="submit">登录</button>
        <p class="message" id="loginMessage"></p>
      </form>
    </section>
  `;
}

function shellView() {
  const data = state.data;
  if (!data) {
    app.innerHTML = `<section class="loading">正在加载...</section>`;
    return;
  }
  const online = data.projects.filter((project) => project.status === "online").length;
  const ports = data.projects.filter((project) => project.portListening).length;
  const frontendCount = data.projects.filter((project) => project.frontendConfigured).length;
  app.innerHTML = `
    <section class="workspace">
      <header class="topbar">
        <div>
          <p class="eyebrow">1008086.xyz</p>
          <h1>项目运行工作台</h1>
        </div>
        <div class="top-actions">
          <button class="secondary" data-action="v2">V2 工作台</button>
          <button class="secondary" data-action="refresh">刷新</button>
          <button class="secondary" data-action="start-all">一键启动服务</button>
          <button class="secondary" data-action="restart-all">一键重启服务</button>
          <button class="danger" data-action="stop-all">一键停止服务</button>
          <button class="ghost" data-action="logout">退出</button>
        </div>
      </header>

      <section class="summary">
        <div class="metric"><span>项目</span><b>${data.projects.length}</b></div>
        <div class="metric"><span>PM2 在线</span><b>${online}</b></div>
        <div class="metric"><span>端口监听</span><b>${ports}</b></div>
        <div class="metric"><span>前端构建</span><b>${frontendCount}</b></div>
      </section>

      <section class="project-list">
        ${data.projects.map(projectCard).join("")}
      </section>

      ${storagePanel()}

      <section class="log-layout">
        <article class="panel">
          <div class="section-title">
            <h2>操作记录</h2>
            <span>${new Date().toLocaleTimeString()}</span>
          </div>
          <div class="timeline">
            ${data.jobs.length ? data.jobs.map(jobItem).join("") : '<p class="empty">暂无操作记录</p>'}
          </div>
        </article>
        <article class="panel">
          <div class="section-title">
            <h2>日志输出</h2>
            <span>${state.selectedLog?.title || "最近一次操作"}</span>
          </div>
          <pre>${escapeHtml(state.selectedLog?.output || data.jobs[0]?.output || "暂无日志")}</pre>
        </article>
      </section>
    </section>
  `;
}

function storagePanel() {
  const storage = state.storage;
  if (!storage) {
    return `
      <section class="panel storage-panel">
        <div class="section-title">
          <h2>存储清理</h2>
          <span>正在扫描...</span>
        </div>
      </section>
    `;
  }
  const selectedSize = storage.items
    .filter((item) => state.selectedStorage.has(item.id))
    .reduce((sum, item) => sum + item.size, 0);
  const selectedCount = state.selectedStorage.size;
  const rows = storage.items.length
    ? storage.items.map(storageRow).join("")
    : '<p class="empty">暂无可展示的备份、日志或缓存记录</p>';
  return `
    <section class="panel storage-panel">
      <div class="section-title storage-title">
        <div>
          <h2>存储清理</h2>
          <span>共 ${storage.summary.count} 项 · ${formatBytes(storage.summary.totalSize)}，推荐清理 ${storage.summary.recommended.count} 项 · ${formatBytes(storage.summary.recommended.size)}</span>
        </div>
        <div class="storage-actions">
          <button class="secondary" data-action="clear-cache">一键清缓存</button>
          <button class="secondary" data-action="cleanup-expired">清理过期备份和日志</button>
          <button class="danger" data-action="storage-delete" ${selectedCount ? "" : "disabled"}>删除已选 ${selectedCount ? `(${formatBytes(selectedSize)})` : ""}</button>
        </div>
      </div>
      <div class="storage-table">
        ${rows}
      </div>
    </section>
  `;
}

function storageRow(item) {
  const checked = state.selectedStorage.has(item.id) ? "checked" : "";
  const disabled = item.removable ? "" : "disabled";
  return `
    <label class="storage-row ${item.recommended ? "recommended" : ""} ${item.removable ? "" : "locked"}">
      <input type="checkbox" data-storage="${item.id}" ${checked} ${disabled}>
      <span class="storage-kind">${storageTypeLabel(item.type)}</span>
      <span class="storage-info">
        <strong>${escapeHtml(item.label)}</strong>
        <small title="${escapeHtml(item.path)}">${escapeHtml(item.path)}</small>
        <em>${escapeHtml(item.reason || "")}</em>
      </span>
      <span class="storage-meta">
        <b>${formatBytes(item.size)}</b>
        <small>${formatDate(item.modifiedAt)}</small>
      </span>
      <span class="storage-badge">${item.recommended ? "建议清理" : item.removable ? "手动确认" : "保留"}</span>
    </label>
  `;
}

function projectCard(project) {
  return `
    <article class="project-card">
      <div class="project-main">
        <div>
          <div class="title-row">
            <h2>${project.name}</h2>
            <span class="pill ${project.status}">${project.status}</span>
          </div>
          <a class="domain" href="${project.url}" target="_blank" rel="noreferrer">${project.domain}</a>
        </div>
        <div class="facts">
          <span>后端 <strong>${project.backend.pm2Name}</strong></span>
          <span>端口 <strong>${project.backend.port}</strong></span>
          <span>监听 <strong>${project.portListening ? "正常" : "未监听"}</strong></span>
          <span>前端 <strong>${project.frontendConfigured ? project.distExists ? "已打包" : "无 dist" : "内置/无"}</strong></span>
          <span>运行 <strong>${formatUptime(project.uptime)}</strong></span>
          <span>内存 <strong>${formatBytes(project.memory)}</strong></span>
        </div>
      </div>
      <div class="action-groups">
        <div>
          <span>后端</span>
          <button class="secondary" data-project="${project.id}" data-action="backend-start">启动</button>
          <button class="secondary" data-project="${project.id}" data-action="backend-restart">重启</button>
          <button class="danger" data-project="${project.id}" data-action="backend-stop">停止</button>
        </div>
        <div>
          <span>前端</span>
          <button class="secondary" data-project="${project.id}" data-action="frontend-update" ${project.frontendConfigured ? "" : "disabled"}>更新打包</button>
        </div>
        <div>
          <span>排查</span>
          <button class="secondary" data-project="${project.id}" data-action="check">检测</button>
          <button class="secondary" data-project="${project.id}" data-action="logs">日志</button>
        </div>
      </div>
    </article>
  `;
}

function jobItem(job) {
  return `
    <button class="job ${job.ok ? "ok" : "fail"}" data-job="${job.id}">
      <span>${job.action} / ${job.target}</span>
      <small>${new Date(job.finishedAt).toLocaleString()} · ${job.durationMs}ms</small>
    </button>
  `;
}

async function refresh() {
  const [data, storage] = await Promise.all([api("/api/status"), api("/api/storage")]);
  state.data = data;
  state.storage = storage;
  const validStorageIds = new Set(storage.items.map((item) => item.id));
  state.selectedStorage = new Set([...state.selectedStorage].filter((id) => validStorageIds.has(id)));
  if (location.pathname !== "/home") history.replaceState({}, "", "/home");
  shellView();
}

async function runAction(path, title, body = null) {
  if (state.busy) return;
  state.busy = true;
  document.querySelectorAll("button").forEach((button) => { button.disabled = true; });
  try {
    const result = await api(path, {
      method: "POST",
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    state.selectedLog = {
      title,
      output: `${result.ok ? "OK" : "FAILED"}\n${result.command ? `${result.command}\n` : ""}\n${result.stdout || ""}${result.stderr ? `\n${result.stderr}` : ""}`,
    };
    state.selectedStorage.clear();
    await refresh();
  } catch (error) {
    if (error.message !== "unauthorized") state.selectedLog = { title: "错误", output: error.message };
    shellView();
  } finally {
    state.busy = false;
  }
}

async function showProjectLogs(projectId) {
  const result = await api(`/api/projects/${projectId}/logs`);
  state.selectedLog = {
    title: `${projectId} PM2 日志`,
    output: `${result.stdout || ""}${result.stderr ? `\n${result.stderr}` : ""}`,
  };
  shellView();
}

function renderRoute() {
  if (location.pathname === "/login") {
    loginView();
    return;
  }
  refresh().catch(() => loginView());
}

document.addEventListener("submit", async (event) => {
  if (event.target.id !== "loginForm") return;
  event.preventDefault();
  const message = document.querySelector("#loginMessage");
  message.textContent = "";
  try {
    await api("/api/login", {
      method: "POST",
      body: JSON.stringify({ password: document.querySelector("#password").value }),
    });
    route("/home");
  } catch {
    message.textContent = "口令不正确";
  }
});

document.addEventListener("change", (event) => {
  const input = event.target.closest("input[data-storage]");
  if (!input) return;
  if (input.checked) state.selectedStorage.add(input.dataset.storage);
  else state.selectedStorage.delete(input.dataset.storage);
  shellView();
});

document.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button || state.busy) return;
  const { action, project, job } = button.dataset;
  if (job) {
    const record = state.data.jobs.find((item) => item.id === job);
    state.selectedLog = { title: `${record.action} / ${record.target}`, output: record.output || "无输出" };
    shellView();
    return;
  }
  if (project && action === "logs") return showProjectLogs(project);
  if (project) {
    const target = state.data?.projects?.find((item) => item.id === project);
    const targetName = target?.name || project;
    const confirmations = {
      "backend-stop": `确认停止“${targetName}”？服务将停止响应，需再次启动才能恢复。`,
      "backend-restart": `确认重启“${targetName}”？现有连接可能短暂中断。`,
      "frontend-update": `确认部署“${targetName}”当前本地代码？将构建、切换产物、重启并执行公网后检。`,
    };
    if (confirmations[action] && !confirm(confirmations[action])) return null;
    return runAction(`/api/projects/${project}/${action}`, `${project} ${action}`);
  }
  if (action === "refresh") return refresh();
  if (action === "v2") {
    location.href = "/v2";
    return null;
  }
  if (action === "start-all") return runAction("/api/actions/start-all", "一键启动服务");
  if (action === "restart-all" && confirm("确认一键重启业务服务？不会重新打包前端，也不会停止管理台、Nginx、Tunnel 或数据库。")) {
    return runAction("/api/actions/restart-all", "一键重启服务");
  }
  if (action === "stop-all" && confirm("确认一键停止服务？管理页面会继续运行。")) {
    return runAction("/api/actions/stop-all", "一键停止服务");
  }
  if (action === "clear-cache" && confirm("确认清理推荐的系统和开发缓存？")) {
    return runAction("/api/storage/clear-cache", "一键清缓存");
  }
  if (action === "cleanup-expired" && confirm("确认清理超过保留期的备份和日志？")) {
    return runAction("/api/storage/cleanup-expired", "清理过期备份和日志");
  }
  if (action === "storage-delete") {
    const ids = [...state.selectedStorage];
    if (!ids.length) return null;
    if (confirm(`确认删除已选 ${ids.length} 项？此操作不可恢复。`)) {
      return runAction("/api/storage/delete", "删除已选存储项", { ids });
    }
  }
  if (action === "logout") {
    await api("/api/logout", { method: "POST" });
    route("/login");
  }
});

window.addEventListener("popstate", renderRoute);
if (location.pathname === "/") history.replaceState({}, "", "/home");
renderRoute();

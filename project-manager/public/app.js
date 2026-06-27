const app = document.querySelector("#app");
let state = { busy: false, data: null, selectedLog: null };

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
  if (!value) return "0 MB";
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
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
          <button class="secondary" data-action="refresh">刷新</button>
          <button class="secondary" data-action="start-all">全部启动</button>
          <button class="danger" data-action="stop-all">全部停止业务</button>
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
  state.data = await api("/api/status");
  if (location.pathname !== "/home") history.replaceState({}, "", "/home");
  shellView();
}

async function runAction(path, title) {
  if (state.busy) return;
  state.busy = true;
  document.querySelectorAll("button").forEach((button) => { button.disabled = true; });
  try {
    const result = await api(path, { method: "POST" });
    state.selectedLog = {
      title,
      output: `${result.ok ? "OK" : "FAILED"}\n${result.command ? `${result.command}\n` : ""}\n${result.stdout || ""}${result.stderr ? `\n${result.stderr}` : ""}`,
    };
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
  if (project) return runAction(`/api/projects/${project}/${action}`, `${project} ${action}`);
  if (action === "refresh") return refresh();
  if (action === "start-all") return runAction("/api/actions/start-all", "全部启动");
  if (action === "stop-all" && confirm("确认停止全部业务项目？管理页面会继续运行。")) {
    return runAction("/api/actions/stop-all", "全部停止业务");
  }
  if (action === "logout") {
    await api("/api/logout", { method: "POST" });
    route("/login");
  }
});

window.addEventListener("popstate", renderRoute);
if (location.pathname === "/") history.replaceState({}, "", "/home");
renderRoute();

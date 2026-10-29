let csrfToken = "";
async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error("服务连接中断，请刷新页面后重试");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    const error = new Error(data.message || `请求失败：${response.status}`);
    error.account = data.account;
    error.status = response.status;
    if (data.accessRequired)
      window.dispatchEvent(new Event("ct189-access-expired"));
    throw error;
  }
  return data;
}

export const api = {
  health: () => request("/api/health"),
  executors: () => request("/api/executors"),
  accessSession: async () => {
    const data = await request("/api/access/session");
    csrfToken = data.csrfToken || "";
    return data;
  },
  accessLogin: async (username, password, remember = false) => {
    const data = await request("/api/access/login", {
      method: "POST",
      body: JSON.stringify({ username, password, remember }),
    });
    csrfToken = data.csrfToken || "";
    return data;
  },
  accessLogout: async () => {
    await request("/api/access/logout", { method: "POST", body: "{}" });
    csrfToken = "";
  },
  accounts: () => request("/api/accounts"),
  schedules: () => request("/api/schedules"),
  createSchedule: (payload) => request("/api/schedules", { method: "POST", body: JSON.stringify(payload) }),
  patchSchedule: (id, payload) => request(`/api/schedules/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteSchedule: (id) => request(`/api/schedules/${id}`, { method: "DELETE" }),
  task: (id) => request(`/api/tasks/${id}`),
  startTask: (action, accountIds, concurrency = 1, executor = "native") =>
    request("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ action, accountIds, concurrency, executor }),
    }),
  patchAccount: (id, payload) =>
    request(`/api/accounts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  importAccounts: (accounts) =>
    request("/api/accounts/import", {
      method: "POST",
      body: JSON.stringify({ accounts }),
    }),
  saveAccount: (payload) =>
    request("/api/accounts", { method: "POST", body: JSON.stringify(payload) }),
  deleteAccount: (id) => request(`/api/accounts/${id}`, { method: "DELETE" }),
  logs: (id) => request(`/api/accounts/${id}/logs`),
  loginPassword: (id, password, rememberPassword = true) =>
    request(`/api/ct189/${id}/login/password`, {
      method: "POST",
      body: JSON.stringify({ password, rememberPassword }),
    }),
  checkLogin: (id) =>
    request(`/api/ct189/${id}/check-login`, { method: "POST", body: "{}" }),
  reloginSaved: (id) =>
    request(`/api/ct189/${id}/relogin-saved`, { method: "POST", body: "{}" }),
  refresh: (id) =>
    request(`/api/ct189/${id}/refresh`, { method: "POST", body: "{}" }),
  drawRights: (id) =>
    request(`/api/ct189/${id}/rights/draw`, { method: "POST", body: "{}" }),
  bill: (id, payload) =>
    request(`/api/ct189/${id}/bill`, {
      method: "POST",
      body: JSON.stringify(payload || {}),
    }),
  token: (id, payload) =>
    request(`/api/ct189/${id}/open-access-token`, {
      method: "POST",
      body: JSON.stringify(payload || {}),
    }),
  closeSession: (id) =>
    request(`/api/ct189/${id}/close-session`, { method: "POST", body: "{}" }),
};

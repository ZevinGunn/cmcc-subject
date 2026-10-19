async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    const error = new Error(data.message || `请求失败：${response.status}`);
    error.account = data.account;
    throw error;
  }
  return data;
}

export const api = {
  health: () => request("/api/health"),
  accounts: () => request("/api/accounts"),
  saveAccount: (payload) => request("/api/accounts", { method: "POST", body: JSON.stringify(payload) }),
  deleteAccount: (id) => request(`/api/accounts/${id}`, { method: "DELETE" }),
  logs: (id) => request(`/api/accounts/${id}/logs`),
  loginPassword: (id, password) =>
    request(`/api/ct189/${id}/login/password`, { method: "POST", body: JSON.stringify({ password }) }),
  checkLogin: (id) => request(`/api/ct189/${id}/check-login`, { method: "POST", body: "{}" }),
  refresh: (id) => request(`/api/ct189/${id}/refresh`, { method: "POST", body: "{}" }),
  drawRights: (id) => request(`/api/ct189/${id}/rights/draw`, { method: "POST", body: "{}" }),
  bill: (id, payload) => request(`/api/ct189/${id}/bill`, { method: "POST", body: JSON.stringify(payload || {}) }),
  token: (id, payload) =>
    request(`/api/ct189/${id}/open-access-token`, { method: "POST", body: JSON.stringify(payload || {}) }),
  closeSession: (id) => request(`/api/ct189/${id}/close-session`, { method: "POST", body: "{}" })
};

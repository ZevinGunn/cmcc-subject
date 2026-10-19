import express from "express";
import { isTelecomSuccess, loginSummary, loginErrorDiagnostic } from "../services/passwordLogin.js";
import { appendLog, getAccount, patchAccount } from "../services/accountStore.js";
import {
  closeClient,
  drawRights,
  getOpenAccessToken,
  loginByServicePassword,
  queryActivity,
  queryBalance,
  queryBill,
  queryLoginAccount
} from "../services/telecomClient.js";

export const ct189Router = express.Router();

function requireAccount(req, res) {
  const account = getAccount(req.params.id);
  if (!account) {
    res.status(404).json({ ok: false, message: "账号不存在" });
    return null;
  }
  return account;
}

ct189Router.post("/:id/login/password", async (req, res, next) => {
  try {
    const account = requireAccount(req, res);
    if (!account) return;
    const password = String(req.body?.password || "");
    if (!/^\d{1,32}$/.test(password)) {
      res.status(400).json({ ok: false, message: "请输入数字服务密码（最多 32 位）" });
      return;
    }
    // Remove stale success immediately; a transport failure must not preserve it.
    patchAccount(account.id, { loginStatus: "invalid", loginNumber: "", lastError: "登录尚未完成" });
    const result = await loginByServicePassword(account.id, account.phone, password);
    const { ok, message } = result;
    const updated = patchAccount(account.id, {
      loginStatus: ok ? "valid" : "invalid",
      loginNumber: ok ? account.phone : "",
      ...(ok ? { lastLoginAt: new Date().toISOString() } : {}),
      lastError: ok ? "" : message
    });
    appendLog(account.id, "password_login", {
      ok,
      initialization: loginSummary(result.initialization),
      initializationAttempts: result.initializationAttempts,
      login: loginSummary(result.login),
      loginAccount: loginSummary(result.loginAccount)
    });
    res.set("Cache-Control", "no-store").json({ ok, message, account: updated });
  } catch (error) {
    const message = "电信登录连接失败，请稍后重试";
    let account = null;
    if (getAccount(req.params.id)) {
      account = patchAccount(req.params.id, { loginStatus: "invalid", loginNumber: "", lastError: message });
      appendLog(req.params.id, "password_login", { ok: false, error: loginErrorDiagnostic(error) });
    }
    res.status(502).json({ ok: false, message, account });
  }
});

ct189Router.post("/:id/check-login", async (req, res, next) => {
  try {
    const account = requireAccount(req, res);
    if (!account) return;
    const result = await queryLoginAccount(account.id);
    const valid = isTelecomSuccess(result) && result.data.object === account.phone;
    const loginNumber = valid ? account.phone : "";
    const updated = patchAccount(account.id, {
      loginStatus: loginNumber ? "valid" : "invalid",
      loginNumber,
      lastError: loginNumber ? "" : result.data?.retMsg || "未登录"
    });
    appendLog(account.id, "check_login", { result: result.data });
    res.json({ ok: Boolean(loginNumber), account: updated, result: result.data });
  } catch (error) {
    next(error);
  }
});

ct189Router.post("/:id/refresh", async (req, res, next) => {
  try {
    const account = requireAccount(req, res);
    if (!account) return;
    const [activity, balance] = await Promise.all([queryActivity(account.id), queryBalance(account.id)]);
    const updated = patchAccount(account.id, {
      activityInfo: activity.info,
      rights: activity.chance,
      balance,
      lastRefreshAt: new Date().toISOString(),
      lastError: ""
    });
    appendLog(account.id, "refresh", { activity, balance });
    res.json({ ok: true, account: updated, activity, balance });
  } catch (error) {
    next(error);
  }
});

ct189Router.post("/:id/rights/draw", async (req, res, next) => {
  try {
    const account = requireAccount(req, res);
    if (!account) return;
    const result = await drawRights(account.id);
    appendLog(account.id, "rights_draw", { result: result.data });
    res.json({ ok: result.data?.retCode === "000000" || result.data?.result === 0, result: result.data });
  } catch (error) {
    next(error);
  }
});

ct189Router.post("/:id/bill", async (req, res, next) => {
  try {
    const account = requireAccount(req, res);
    if (!account) return;
    const result = await queryBill(account.id, req.body || {});
    appendLog(account.id, "query_bill", { result: result.data });
    res.json({ ok: true, result: result.data });
  } catch (error) {
    next(error);
  }
});

ct189Router.post("/:id/open-access-token", async (req, res, next) => {
  try {
    const account = requireAccount(req, res);
    if (!account) return;
    const result = await getOpenAccessToken(account.id, req.body || {});
    appendLog(account.id, "open_access_token", { result: result.data });
    res.json({ ok: true, result: result.data });
  } catch (error) {
    next(error);
  }
});

ct189Router.post("/:id/close-session", async (req, res, next) => {
  try {
    const account = requireAccount(req, res);
    if (!account) return;
    await closeClient(account.id);
    patchAccount(account.id, { loginStatus: "closed" });
    appendLog(account.id, "close_session");
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

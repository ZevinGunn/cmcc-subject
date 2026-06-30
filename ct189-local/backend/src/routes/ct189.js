import express from "express";
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
    if (!/^\d+$/.test(password)) {
      res.status(400).json({ ok: false, message: "服务密码必须是数字" });
      return;
    }
    const login = await loginByServicePassword(account.id, account.phone, password);
    const loginAccount = await queryLoginAccount(account.id);
    const ok = login.data?.result === 0 || login.data?.retCode === "000000";
    const loginNumber = loginAccount.data?.object || "";
    const emptyLogin = typeof login.data === "string" && !login.data.trim();
    const updated = patchAccount(account.id, {
      loginStatus: ok ? "valid" : "invalid",
      loginNumber,
      lastLoginAt: new Date().toISOString(),
      lastError: ok
        ? ""
        : emptyLogin
          ? `电信接口返回空响应，可能未通过 WAP/WAF 初始化，HTTP ${login.diagnostic?.status || 0}`
          : login.data?.retMsg || "登录失败"
    });
    appendLog(account.id, "password_login", {
      login: login.data,
      loginDiagnostic: login.diagnostic,
      loginAccount: loginAccount.data,
      loginAccountDiagnostic: loginAccount.diagnostic
    });
    res.json({
      ok,
      account: updated,
      login: login.data,
      loginDiagnostic: login.diagnostic,
      loginAccount: loginAccount.data,
      loginAccountDiagnostic: loginAccount.diagnostic
    });
  } catch (error) {
    next(error);
  }
});

ct189Router.post("/:id/check-login", async (req, res, next) => {
  try {
    const account = requireAccount(req, res);
    if (!account) return;
    const result = await queryLoginAccount(account.id);
    const loginNumber = result.data?.object || "";
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

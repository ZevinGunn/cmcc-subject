import { accountSessions } from "../services/accountSession.js";
import express from "express";
import {
  appendLog,
  getAccount,
  patchAccount,
} from "../services/accountStore.js";
import {
  drawRights,
  getOpenAccessToken,
  queryActivity,
  queryBalance,
  queryBill,
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
    if (!requireAccount(req, res)) return;
    const password = String(req.body?.password || "");
    if (!/^\d{1,32}$/.test(password))
      return res
        .status(400)
        .json({ ok: false, message: "请输入数字服务密码（最多 32 位）" });
    const result = await accountSessions.manualLogin(
      req.params.id,
      password,
      req.body?.rememberPassword !== false,
    );
    res.status(result.connectionFailed ? 502 : 200).json(result);
  } catch (error) {
    next(error);
  }
});

ct189Router.post("/:id/check-login", async (req, res, next) => {
  try {
    if (!requireAccount(req, res)) return;
    res.json(await accountSessions.ensureSession(req.params.id));
  } catch (error) {
    next(error);
  }
});

ct189Router.post("/:id/relogin-saved", async (req, res, next) => {
  try {
    if (!requireAccount(req, res)) return;
    res.json(await accountSessions.reloginSaved(req.params.id));
  } catch (error) {
    next(error);
  }
});

ct189Router.post("/:id/refresh", async (req, res, next) => {
  try {
    const account = requireAccount(req, res);
    if (!account) return;
    const [activity, balance] = await Promise.all([
      queryActivity(account.id),
      queryBalance(account.id),
    ]);
    const updated = patchAccount(account.id, {
      activityInfo: activity.info,
      rights: activity.chance,
      balance,
      lastRefreshAt: new Date().toISOString(),
      lastError: "",
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
    res.json({
      ok: result.data?.retCode === "000000" || result.data?.result === 0,
      result: result.data,
    });
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
    await accountSessions.closeSession(account.id);
    appendLog(account.id, "close_session");
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

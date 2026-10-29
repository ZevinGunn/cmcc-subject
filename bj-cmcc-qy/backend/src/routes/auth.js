import { Router } from "express";
import { fail, ok, requireSession } from "../utils/http.js";
import { loginWithGroupToken, loginWithSms, logout, refreshUser, sendLoginSms } from "../services/authService.js";
import { createQrLoginFlow, getQrLoginCookie, pollQrLoginFlow } from "../services/cmccQrLoginService.js";
import { publicUser } from "../sessionStore.js";

export const authRouter = Router();

authRouter.post("/sms/send", async (req, res) => {
  try {
    const { phone } = req.body || {};
    if (!/^\d{11}$/.test(String(phone || ""))) return fail(res, "请输入 11 位手机号");
    const result = await sendLoginSms(phone);
    ok(res, result);
  } catch (error) {
    fail(res, error.message, 500);
  }
});

authRouter.post("/sms/login", async (req, res) => {
  try {
    const { phone, code, retailerCode, sonRetailerCode } = req.body || {};
    if (!/^\d{11}$/.test(String(phone || ""))) return fail(res, "请输入 11 位手机号");
    if (!/^\d{6}$/.test(String(code || ""))) return fail(res, "请输入 6 位验证码");
    const data = await loginWithSms(phone, code, { retailerCode, sonRetailerCode });
    ok(res, data);
  } catch (error) {
    fail(res, error.message, 500);
  }
});

authRouter.post("/group-token/login", async (req, res) => {
  try {
    const { token, phone, retailerCode, sonRetailerCode, phoneNetCheckMethod } = req.body || {};
    const cleanToken = String(token || "").trim();
    const cleanPhone = String(phone || "").trim();
    if (!cleanToken) return fail(res, "请输入集团 token");
    if (cleanPhone && !/^\d{11}$/.test(cleanPhone)) return fail(res, "手机号需为 11 位数字");
    const data = await loginWithGroupToken(cleanToken, {
      phone: cleanPhone,
      retailerCode,
      sonRetailerCode,
      phoneNetCheckMethod
    });
    ok(res, data);
  } catch (error) {
    fail(res, error.message, 500);
  }
});

authRouter.post("/app-qr/start", async (req, res) => {
  try {
    const { channelId, backUrl } = req.body || {};
    ok(res, await createQrLoginFlow({ channelId, backUrl }));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

authRouter.post("/app-qr/poll", async (req, res) => {
  try {
    const { flowId } = req.body || {};
    if (!flowId) return fail(res, "缺少扫码会话 ID");
    ok(res, await pollQrLoginFlow(flowId));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

authRouter.post("/app-qr/cookie", async (req, res) => {
  try {
    const { flowId } = req.body || {};
    if (!flowId) return fail(res, "缺少扫码会话 ID");
    ok(res, getQrLoginCookie(flowId));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

authRouter.get("/me", requireSession, (req, res) => {
  ok(res, { user: publicUser(req.session) });
});

authRouter.post("/refresh", requireSession, async (req, res) => {
  try {
    ok(res, await refreshUser(req.localToken, req.session));
  } catch (error) {
    fail(res, error.message, 500);
  }
});

authRouter.post("/logout", (req, res) => {
  logout(req.headers["x-local-token"] || req.body?.localToken);
  ok(res, { loggedOut: true });
});

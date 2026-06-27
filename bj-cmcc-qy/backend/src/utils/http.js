import { getSession } from "../sessionStore.js";

export function ok(res, data = {}, message = "ok") {
  return res.json({ ok: true, message, data });
}

export function fail(res, message, status = 400, details = undefined) {
  return res.status(status).json({ ok: false, message, details });
}

export function requireSession(req, res, next) {
  const token = req.headers["x-local-token"] || req.body?.localToken || req.query?.localToken;
  const session = getSession(token);
  if (!session) return fail(res, "请先登录或导入会话", 401);
  req.localToken = token;
  req.session = session;
  next();
}


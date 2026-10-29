import crypto from "node:crypto";
import fs from "node:fs";
import { promisify } from "node:util";
import { isIP } from "node:net";

const scrypt = promisify(crypto.scrypt);
export async function passwordRecord(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return { salt, hash: hash.toString("hex") };
}

export function createSiteAccess({
  required,
  credentialsFile,
  origins,
  now = Date.now,
  ttlMs = 8 * 60 * 60_000,
  rememberTtlMs = 30 * 24 * 60 * 60_000,
}) {
  let credentials;
  if (required) {
    credentials = JSON.parse(fs.readFileSync(credentialsFile, "utf8"));
    if (
      !credentials.username ||
      !/^[a-f0-9]{32}$/.test(credentials.salt) ||
      !/^[a-f0-9]{128}$/.test(credentials.hash)
    )
      throw new Error("公网访问凭据无效，请先初始化站点访问账号");
  }
  const cookieName = "__Host-ct189_access";
  const sessions = new Map(),
    attempts = new Map();
  let verifying = 0;
  const cookie = (value, age) =>
    `${cookieName}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;
  const sessionKey = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");
  function session(req) {
    const token = String(req.headers.cookie || "")
      .split(";")
      .map((v) => v.trim())
      .find((v) => v.startsWith(`${cookieName}=`))
      ?.slice(cookieName.length + 1);
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
    const key = sessionKey(token),
      found = sessions.get(key);
    if (!found || found.expires <= now()) {
      sessions.delete(key);
      return null;
    }
    return { ...found, key };
  }
  function trustedOrigin(req) {
    return origins.includes(req.get("Origin"));
  }
  function clientIp(req) {
    const remote = req.socket.remoteAddress;
    const forwarded = req.get("CF-Connecting-IP");
    return ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(remote) &&
      isIP(forwarded || "")
      ? forwarded
      : remote;
  }
  return {
    required,
    async handle(req, res, next) {
      res.set("Cache-Control", "no-store");
      const current = required ? session(req) : null;
      if (req.path === "/access/session" && req.method === "GET")
        return res.json({
          ok: true,
          required,
          authenticated: !required || Boolean(current),
          csrfToken: current?.csrf || "",
        });
      if (!required) return next();
      if (
        ["POST", "PUT", "PATCH", "DELETE"].includes(req.method) &&
        (!trustedOrigin(req) ||
          req.get("Content-Type")?.split(";")[0].trim().toLowerCase() !==
            "application/json")
      )
        return res
          .status(403)
          .json({ ok: false, message: "请从本站页面提交操作" });
      if (req.path === "/access/login" && req.method === "POST") {
        const at = now(),
          ip = clientIp(req);
        for (const [key, value] of attempts)
          if (value.reset <= at) attempts.delete(key);
        if (attempts.size >= 5000 && !attempts.has(ip))
          return res
            .status(429)
            .json({ ok: false, message: "请求较多，请稍后重试" });
        const rate = attempts.get(ip) || { count: 0, reset: at + 15 * 60_000 };
        attempts.set(ip, rate);
        if (rate.count >= 5 || verifying >= 4) {
          res.set(
            "Retry-After",
            String(Math.max(1, Math.ceil((rate.reset - at) / 1000))),
          );
          return res
            .status(429)
            .json({ ok: false, message: "登录尝试过多，请稍后重试" });
        }
        rate.count++;
        const password = req.body?.password,
          username = req.body?.username;
        if (
          typeof password !== "string" ||
          password.length > 256 ||
          typeof username !== "string" ||
          username.length > 80
        )
          return res
            .status(400)
            .json({ ok: false, message: "请输入有效访问账号和密码" });
        verifying++;
        let hash;
        try {
          hash = await scrypt(password, credentials.salt, 64);
        } finally {
          verifying--;
        }
        if (
          username !== credentials.username ||
          !crypto.timingSafeEqual(hash, Buffer.from(credentials.hash, "hex"))
        )
          return res
            .status(401)
            .json({ ok: false, message: "访问账号或密码错误" });
        attempts.delete(ip);
        for (const [key, value] of sessions)
          if (value.expires <= at) sessions.delete(key);
        if (current) sessions.delete(current.key);
        while (sessions.size >= 256)
          sessions.delete(sessions.keys().next().value);
        const remember = req.body?.remember === true;
        const sessionTtl = remember ? rememberTtlMs : ttlMs;
        const token = crypto.randomBytes(32).toString("hex"),
          csrf = crypto.randomBytes(24).toString("hex");
        sessions.set(sessionKey(token), { csrf, expires: at + sessionTtl });
        res.set("Set-Cookie", cookie(token, Math.floor(sessionTtl / 1000)));
        return res.json({ ok: true, csrfToken: csrf, remember, expiresAt: new Date(at + sessionTtl).toISOString() });
      }
      if (!current)
        return res.status(401).json({
          ok: false,
          message: "请先登录北京电信快捷服务",
          accessRequired: true,
        });
      if (
        ["POST", "PUT", "PATCH", "DELETE"].includes(req.method) &&
        req.get("X-CSRF-Token") !== current.csrf
      )
        return res
          .status(403)
          .json({ ok: false, message: "访问会话已更新，请刷新页面重试" });
      if (req.path === "/access/logout" && req.method === "POST") {
        sessions.delete(current.key);
        res.set("Set-Cookie", cookie("", 0));
        return res.json({ ok: true });
      }
      next();
    },
  };
}

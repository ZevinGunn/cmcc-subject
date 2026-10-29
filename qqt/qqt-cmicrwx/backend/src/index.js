import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookie from "cookie";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { encryptPhone, encryptWithAes } from "./crypto.js";
import { proxyRequest } from "./httpClient.js";
import { DEFAULT_SSP_ID, TARGET_REFERER } from "./config.js";
import { logLogin } from "./logger.js";

const app = express();
const STAR_DAY_SSP_ID = "75442";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../../frontend/dist");
const hasDist = fs.existsSync(distDir);

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(morgan("combined"));
if (hasDist) {
  app.use(express.static(distDir));
}

function relayCookies(res, cookies = []) {
  cookies.forEach((c) => res.append("Set-Cookie", c));
  return cookies.map((item) => cookie.parse(item));
}

function resolveCookieHeader(req) {
  const tokenHeader = req.headers["x-access-token"];
  const token =
    Array.isArray(tokenHeader) && tokenHeader.length
      ? tokenHeader[0]
      : typeof tokenHeader === "string"
      ? tokenHeader
      : "";
  if (token) {
    return `access_token=${token}`;
  }
  return req.headers.cookie || "";
}

app.post("/api/sms/send", async (req, res) => {
  try {
    const { phone, sspId = DEFAULT_SSP_ID } = req.body;
    if (!phone) {
      res.status(400).json({ status: -1, msg: "手机号不能为空" });
      return;
    }
    const form = new URLSearchParams();
    form.append("phone", encryptPhone(phone));
    form.append("sspId", sspId);
    console.info("[proxy][sms/send] outgoing body", {
      phone: form.get("phone")?.slice(0, 24) + "...",
      sspId,
    });
    const result = await proxyRequest("/new/cmpSmsSend.action", {
      method: "POST",
      body: form.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Cookie: resolveCookieHeader(req),
      },
    });
    const parsedCookies =
      result.data.status === 1 ? relayCookies(res, result.cookies) : [];
    res.json({
      ...result.data,
      cookies: parsedCookies,
    });
  } catch (error) {
    console.error("[sms/send]", error);
    res.status(502).json({
      status: -1,
      msg: "验证码发送失败，请稍后重试",
    });
  }
});

app.post("/api/login", async (req, res) => {
  const { phone, smsCode, whiteList = false } = req.body || {};
  const requestMeta = {
    phone,
    smsCode,
    whiteList,
    ip: req.ip,
    userAgent: req.headers["user-agent"] || "",
    referer: req.headers.referer || "",
    forwardedFor: req.headers["x-forwarded-for"] || "",
  };
  try {
    if (!phone || !smsCode) {
      logLogin({
        ...requestMeta,
        response: { status: -1, msg: "手机号或验证码缺失" },
        validationFailed: true,
      });
      res.status(400).json({ status: -1, msg: "手机号或验证码缺失" });
      return;
    }
    const path = whiteList ? "/loginW.action" : "/login.action";
    const form = new URLSearchParams();
    form.append("phone", encryptWithAes(phone));
    form.append("smsCode", encryptWithAes(smsCode));
    console.info("[proxy][login] outgoing body", {
      phone: form.get("phone")?.slice(0, 24) + "...",
    });
    const result = await proxyRequest(path, {
      method: "POST",
      body: form.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    });
    const parsedCookies = relayCookies(res, result.cookies);
    logLogin({
      ...requestMeta,
      response: result.data,
      cookies: parsedCookies,
    });
    res.json({
      ...result.data,
      cookies: parsedCookies,
    });
  } catch (error) {
    logLogin({
      ...requestMeta,
      error: error instanceof Error ? error.message : String(error),
    });
    console.error("[login]", error);
    res.status(502).json({
      status: -1,
      msg: "登录失败，请稍后重试",
    });
  }
});

app.post("/api/manual/token", (req, res) => {
  const { accessToken, maxAge = 7200 } = req.body || {};
  const requestMeta = {
    accessToken,
    maxAge,
    ip: req.ip,
    userAgent: req.headers["user-agent"] || "",
    referer: req.headers.referer || "",
    forwardedFor: req.headers["x-forwarded-for"] || "",
  };

  if (!accessToken || typeof accessToken !== "string") {
    const response = { status: -1, msg: "accessToken 缺失" };
    logLogin({
      ...requestMeta,
      response,
      validationFailed: true,
      manual: true,
    });
    res.status(400).json(response);
    return;
  }

  try {
    const numericMaxAge = Number(maxAge) || 7200;
    const serialized = cookie.serialize("access_token", accessToken, {
      path: "/",
      maxAge: numericMaxAge,
    });
    res.append("Set-Cookie", serialized);
    const response = {
      status: 1,
      msg: "登录凭证已设置",
      cookies: [cookie.parse(serialized)],
    };
    logLogin({
      ...requestMeta,
      response,
      manual: true,
    });
    res.json(response);
  } catch (error) {
    logLogin({
      ...requestMeta,
      error: error instanceof Error ? error.message : String(error),
      manual: true,
    });
    console.error("[manual-token]", error);
    res.status(500).json({
      status: -1,
      msg: "凭证设置失败，请稍后再试",
    });
  }
});

app.get("/api/user/profile", async (req, res) => {
  try {
    const result = await proxyRequest("/member/func/queryVipLevel.do", {
      method: "POST",
      headers: {
        Cookie: resolveCookieHeader(req),
      },
    });
    res.json(result.data);
  } catch (error) {
    console.error("[user/profile]", error);
    res.status(502).json({
      status: -1,
      msg: "获取用户信息失败，请稍后重试",
    });
  }
});

app.post("/api/logout", async (req, res) => {
  try {
    await proxyRequest("/logout.action", {
      method: "POST",
      headers: {
        Cookie: resolveCookieHeader(req),
      },
    });
    res.status(204).end();
  } catch (error) {
    console.error("[logout]", error);
    res.status(502).json({
      status: -1,
      msg: "退出失败，请稍后再试",
    });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const phase = req.query.phase || "2";
    const params = new URLSearchParams();
    params.append("phase", String(phase));
    const result = await proxyRequest(
      `/normal/normalNewProdList?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Cookie: resolveCookieHeader(req),
        },
      }
    );
    res.json(result.data);
  } catch (error) {
    console.error("[products:list]", error);
    res.status(502).json({
      status: -1,
      msg: "权益列表获取失败",
    });
  }
});

app.post("/api/products/redeem", async (req, res) => {
  try {
    const {
      productId,
      receivePhone,
      isRandom = 0,
      sourece = 1,
    } = req.body;
    if (!productId) {
      res.status(400).json({ status: -1, msg: "缺少领取参数" });
      return;
    }
    const form = new URLSearchParams();
    form.append("productId", String(productId));
    if (receivePhone) {
      form.append("receivePhone", receivePhone);
    }
    form.append("isRandom", String(isRandom));
    form.append("sourece", String(sourece));

    const result = await proxyRequest("/normal/initNormalNewQy", {
      method: "POST",
      body: form.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Cookie: resolveCookieHeader(req),
      },
    });
    res.json(result.data);
  } catch (error) {
    console.error("[products:redeem]", error);
    res.status(502).json({
      status: -1,
      msg: "权益领取失败",
    });
  }
});

app.post("/api/star-day/redeem", async (req, res) => {
  try {
    const { productId } = req.body || {};
    const numericProductId = Number(productId);
    if (!Number.isInteger(numericProductId) || numericProductId <= 0) {
      res.status(400).json({ status: -1, msg: "缺少星动日权益ID" });
      return;
    }

    const form = new URLSearchParams();
    form.append("productId", String(numericProductId));
    form.append("receivePhone", "");
    form.append("channelCode", STAR_DAY_SSP_ID);
    form.append("isRandom", "0");
    form.append("sourece", "1");
    const starDayReferer = `${TARGET_REFERER}?sspId=${STAR_DAY_SSP_ID}`;

    console.info("[proxy][star-day/redeem] outgoing body", {
      productId: numericProductId,
      productIdType: typeof numericProductId,
      receivePhone: form.get("receivePhone"),
      channelCode: form.get("channelCode"),
      isRandom: form.get("isRandom"),
      sourece: form.get("sourece"),
      upstreamPath: "/normal/initNormalNewQy",
    });

    const result = await proxyRequest("/normal/initNormalNewQy", {
      method: "POST",
      body: form.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Cookie: resolveCookieHeader(req),
        Referer: starDayReferer,
      },
    });
    res.json(result.data);
  } catch (error) {
    console.error("[star-day:redeem]", error);
    res.status(502).json({
      status: -1,
      msg: "星动日权益领取失败",
    });
  }
});

app.get("/api/family", async (req, res) => {
  try {
    const result = await proxyRequest("/paidpurchase/familyCircle.action", {
      method: "POST",
      headers: {
        Cookie: resolveCookieHeader(req),
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: "",
    });
    res.json(result.data);
  } catch (error) {
    console.error("[family:list]", error);
    res.status(502).json({
      status: -1,
      msg: "家庭圈成员获取失败",
    });
  }
});

if (hasDist) {
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(distDir, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

const PORT = process.env.PORT || 7607;

app.listen(PORT, () => {
  console.log(`Proxy service listening on http://localhost:${PORT}`);
});

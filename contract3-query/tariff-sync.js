"use strict";
const https = require("node:https");
const fs = require("node:fs");
const path = require("node:path");
const { fetchProvince } = require("./tariff-api/fetch");
const { createTariffStore } = require("./tariff-store");
const PUSH_URL = "https://www.pushplus.plus/send";
const DEFAULT_INTERVAL_MS = 2 * 60 * 60 * 1000;
function parseEnvFile(file) {
  try {
    return Object.fromEntries(fs.readFileSync(file, "utf8").split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#") && line.includes("=")).map((line) => {
      const [key, ...rest] = line.replace(/^export\s+/, "").split("=");
      return [key.trim(), rest.join("=").trim().replace(/^['"]|['"]$/g, "")];
    }));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}
function pushToken({ env = process.env, envFile = path.resolve(__dirname, "../qqtlocal-rights/.env") } = {}) {
  const values = { ...parseEnvFile(envFile), ...env };
  if (["0", "false", "off", "no"].includes(String(values.PUSHPLUS_ENABLED || "1").toLowerCase())) return "";
  return String(values.PUSHPLUS_TOKEN || "").trim();
}
function postJson(url, body, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const payload = JSON.stringify(body);
    const req = https.request({ hostname: target.hostname, path: target.pathname + target.search, method: "POST", headers: { "content-type": "application/json", "content-length": Buffer.byteLength(payload) } }, (res) => {
      let text = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { text += chunk; });
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(text) }); }
        catch { reject(new Error("PushPlus 返回非 JSON（HTTP " + res.statusCode + "）")); }
      });
    });
    req.setTimeout(timeoutMs, () => req.destroy(new Error("PushPlus 请求超时")));
    req.on("error", reject);
    req.end(payload);
  });
}
function buildSummary(diff, province) {
  const parts = [];
  if (diff.added.length) parts.push("新增 " + diff.added.length);
  if (diff.removed.length) parts.push("消失/下架 " + diff.removed.length);
  if (diff.changed.length) parts.push("内容或日期变更 " + diff.changed.length);
  return "中国移动资费变化提醒（" + province + "）\n" + parts.join("，") + "。\n详细变化请打开合约查询页面查看。";
}
async function notifyDiff(diff, { province, token = pushToken(), post = postJson } = {}) {
  if (!diff.total || !token) return { sent: false, skipped: !diff.total ? "no-change" : "no-token" };
  const result = await post(PUSH_URL, { token, title: "资费变化提醒：" + diff.total + " 项", content: buildSummary(diff, province), template: "markdown", channel: "wechat" });
  if (result.body?.code !== 200) throw new Error("PushPlus 拒绝请求，业务码 " + (result.body?.code ?? "未知"));
  return { sent: true };
}
function createTariffMonitor({
  province = process.env.TARIFF_PROVINCE || "北京市",
  intervalMs = Number(process.env.TARIFF_SYNC_INTERVAL_MS || DEFAULT_INTERVAL_MS),
  fetcher = fetchProvince,
  store = createTariffStore(),
  notify = notifyDiff,
  logger = console,
  now = () => new Date(),
} = {}) {
  let timer = null;
  let running = false;
  async function runOnce() {
    if (running) return { skipped: "running" };
    running = true;
    try {
      const result = await fetcher(province);
      if (!result || !Array.isArray(result.items) || !Array.isArray(result.combos) || result.combos.some((combo) => combo.error)) throw new Error("资费接口返回不完整，保留上一份快照");
      const saved = store.saveSuccess({ province, items: result.items, coverage: result.combos, syncedAt: now().toISOString() });
      const notification = saved.firstRun ? { sent: false, skipped: "baseline" } : await notify(saved.diff, { province });
      return { ...saved, notification };
    } catch (error) {
      logger.error?.("[tariff] 同步失败：" + error.message);
      return { error };
    } finally {
      running = false;
    }
  }
  function start({ immediate = true } = {}) {
    if (timer) return;
    if (immediate) void runOnce();
    timer = setInterval(() => void runOnce(), intervalMs);
    timer.unref?.();
  }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  return { runOnce, start, stop, get running() { return running; }, intervalMs, province };
}
module.exports = { createTariffMonitor, notifyDiff, buildSummary, pushToken, postJson, DEFAULT_INTERVAL_MS };

"use strict";
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const DEFAULT_DATA_DIR = path.join(__dirname, "data");
const FIELD_LABELS = {
  name: "资费名称", price: "资费标准", scope: "适用对象", region: "适用区域",
  channel: "销售渠道", onlineRaw: "上架日期", offlineRaw: "下架日期",
  liability: "违约责任", overage: "超出资费", extraService: "其他服务",
  extraNote: "补充说明", resources: "资源内容", categories: "资费分类",
  rangeTabs: "资费范围", tariffTypes: "资费类型",
};
const CONTENT_FIELDS = Object.keys(FIELD_LABELS);
function stableJson(value) {
  if (Array.isArray(value)) return value.map(stableJson);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableJson(value[key])]));
  return value ?? "";
}
function comparable(value) { return JSON.stringify(stableJson(value)); }
function normalizeDate(value) {
  const text = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const compact = text.match(/^(\d{4})(\d{2})(\d{2})$/);
  return compact ? compact[1] + "-" + compact[2] + "-" + compact[3] : text;
}
function statusFor(item, today = new Date()) {
  const day = new Date(today); day.setHours(0, 0, 0, 0);
  const toTime = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) ? Date.parse(value + "T00:00:00+08:00") : NaN;
  const onlineTime = toTime(normalizeDate(item.onlineRaw));
  const offlineTime = toTime(normalizeDate(item.offlineRaw));
  if (Number.isFinite(onlineTime) && onlineTime > day.getTime()) return "pending";
  if (Number.isFinite(offlineTime) && offlineTime < day.getTime()) return "offline";
  return "online";
}
function itemKey(item) {
  const raw = String(item.code || "").trim();
  if (raw) return raw;
  const fallback = String(item.name || "") + "|" + String(item.price || "") + "|" + String(item.onlineRaw || "") + "|" + String(item.offlineRaw || "");
  return "name:" + crypto.createHash("sha256").update(fallback).digest("hex").slice(0, 24);
}
function mergeUnique(left, right) {
  return [...new Set([...(Array.isArray(left) ? left : []), ...(Array.isArray(right) ? right : [])].filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b), "zh-CN"));
}
function normalizeItem(raw) {
  const item = { ...raw };
  item.code = String(item.code || "").trim();
  item.name = String(item.name || "").trim();
  item.onlineRaw = normalizeDate(item.onlineRaw);
  item.offlineRaw = normalizeDate(item.offlineRaw);
  item.categories = mergeUnique(item.categories, item.category);
  item.rangeTabs = mergeUnique(item.rangeTabs, item.rangeTab);
  item.tariffTypes = mergeUnique(item.tariffTypes, item.tariffType);
  delete item.category; delete item.rangeTab; delete item.tariffType;
  item.key = itemKey(item);
  item.status = statusFor(item);
  return item;
}
function mergeItems(items) {
  const result = new Map();
  for (const raw of items || []) {
    const item = normalizeItem(raw);
    const existing = result.get(item.key);
    if (!existing) { result.set(item.key, item); continue; }
    for (const field of ["categories", "rangeTabs", "tariffTypes"]) existing[field] = mergeUnique(existing[field], item[field]);
    if (!existing.resources?.length && item.resources?.length) existing.resources = item.resources;
  }
  const rank = { online: 0, offline: 1, pending: 2 };
  return [...result.values()].sort((a, b) => (rank[a.status] ?? 3) - (rank[b.status] ?? 3)
    || String(b.onlineRaw || "").localeCompare(String(a.onlineRaw || ""))
    || String(a.name).localeCompare(String(b.name), "zh-CN"));
}
function diffTariffs(current, previous) {
  const oldMap = new Map((previous || []).map((item) => [item.key, item]));
  const currentMap = new Map((current || []).map((item) => [item.key, item]));
  const added = [], changed = [], removed = [];
  for (const item of current || []) {
    const old = oldMap.get(item.key);
    if (!old) { added.push({ ...item, changeStatus: "added" }); continue; }
    const changes = CONTENT_FIELDS.filter((field) => comparable(item[field]) !== comparable(old[field])).map((field) => ({
      field, label: FIELD_LABELS[field], before: old[field] ?? "", after: item[field] ?? "",
    }));
    if (changes.length) changed.push({ ...item, changeStatus: "changed", changes });
  }
  for (const item of previous || []) if (!currentMap.has(item.key)) removed.push({ ...item, changeStatus: "removed" });
  return { added, changed, removed, total: added.length + changed.length + removed.length };
}
function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (error) { if (error.code === "ENOENT") return fallback; throw error; }
}
function writeJsonAtomic(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = file + "." + process.pid + "." + Date.now() + ".tmp";
  fs.writeFileSync(temp, JSON.stringify(value, null, 2) + "\n", { mode: 0o600 });
  fs.renameSync(temp, file);
}
function createTariffStore({ dataDir = DEFAULT_DATA_DIR } = {}) {
  const files = {
    current: path.join(dataDir, "tariffs-current.json"),
    previous: path.join(dataDir, "tariffs-previous.json"),
    yesterday: path.join(dataDir, "tariffs-yesterday.json"),
    changes: path.join(dataDir, "tariffs-change-log.json"),
  };
  function load() {
    const record = readJson(files.current, null);
    const current = Array.isArray(record?.items) ? record.items : [];
    const meta = record?.meta || { province: process.env.TARIFF_PROVINCE || "北京市", updatedAt: "", count: current.length, baseline: !current.length };
    const changes = readJson(files.changes, { items: [], meta: {} });
    return { current, meta, changes: changes.items || [], files };
  }
  function saveSuccess({ province, items, coverage, syncedAt = new Date().toISOString() }) {
    const current = mergeItems(items);
    const before = readJson(files.current, null);
    const previous = Array.isArray(before?.items) ? before.items : [];
    const firstRun = previous.length === 0;
    const diff = firstRun ? { added: [], changed: [], removed: [], total: 0 } : diffTariffs(current, previous);
    if (previous.length) writeJsonAtomic(files.previous, { meta: before.meta || {}, items: previous });
    const oldDay = String(before?.meta?.updatedAt || "").slice(0, 10);
    const newDay = String(syncedAt).slice(0, 10);
    if (previous.length && oldDay && oldDay !== newDay) writeJsonAtomic(files.yesterday, { meta: before.meta || {}, items: previous });
    writeJsonAtomic(files.current, { meta: { province, updatedAt: syncedAt, count: current.length, baseline: !previous.length, coverage }, items: current });
    writeJsonAtomic(files.changes, { meta: { province, updatedAt: syncedAt, count: diff.total }, items: [...diff.added, ...diff.changed, ...diff.removed] });
    return { current, previous, diff, firstRun, meta: { province, updatedAt: syncedAt, count: current.length, coverage } };
  }
  return { files, load, saveSuccess, diffTariffs, mergeItems };
}
module.exports = { createTariffStore, diffTariffs, mergeItems, itemKey, statusFor, FIELD_LABELS };

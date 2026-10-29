import fs from "node:fs";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config.js";
import { maskPhone } from "./crypto189.js";

const filePath = path.join(config.dataDir, "accounts.json");
export function sanitizeLogValue(value, key = "", depth = 0) {
  const normalizedKey = String(key).toLowerCase();
  if (
    /password|passwd|pwd|token|cookie|authorization|secret|credential|ciphertext/.test(normalizedKey) ||
    normalizedKey === "iv" ||
    normalizedKey === "tag"
  ) return "[已隐藏]";
  if (value == null || typeof value === "number" || typeof value === "boolean") return value;
  if (depth > 8) return "[嵌套过深]";
  if (typeof value === "string") {
    return value
      .replace(/1\d{10}/g, "手机号")
      .slice(0, 4000);
  }
  if (Array.isArray(value)) return value.slice(0, 100).map((item) => sanitizeLogValue(item, key, depth + 1));
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).slice(0, 200).map(([entryKey, entryValue]) => [
        entryKey,
        sanitizeLogValue(entryValue, entryKey, depth + 1),
      ]),
    );
  }
  return String(value).slice(0, 4000);
}
function readJson() {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!Array.isArray(data.accounts) || !Array.isArray(data.logs))
      throw new Error("账号存储格式错误");
    return { ...data, tasks: data.tasks || [], schedules: data.schedules || [] };
  } catch (error) {
    if (error.code === "ENOENT") return { accounts: [], logs: [], tasks: [], schedules: [] };
    throw error; // Corrupt data must never be silently replaced by an empty store.
  }
}
function writeJson() {
  fs.mkdirSync(config.dataDir, { recursive: true, mode: 0o700 });
  const temporary = `${filePath}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(store, null, 2), { mode: 0o600 });
  fs.renameSync(temporary, filePath);
  fs.chmodSync(filePath, 0o600);
}
const store = readJson();
// Numeric remarks could contain service passwords; display the masked phone instead.
const safeLabel = (value) =>
  /^\d{1,32}$/.test(String(value || "").trim()) ? "" : value;
let migrated = false;
for (const account of store.accounts) {
  if (account.label && !safeLabel(account.label)) {
    account.label = "";
    migrated = true;
  }
  if (account.autoLoginStatus === "running") {
    Object.assign(account, {
      autoLoginStatus: "manual_required",
      loginStatus: "invalid",
      loginNumber: "",
      lastError: "上次自动补登未完成，请手动重新登录",
    });
    migrated = true;
  }
}
if (migrated) writeJson();
function publicAccount(account) {
  return {
    id: account.id,
    phone: account.phone,
    maskedPhone: maskPhone(account.phone),
    label: safeLabel(account.label) || maskPhone(account.phone),
    hasSavedPassword: Boolean(account.savedPassword),
    autoLoginStatus:
      account.autoLoginStatus ||
      (account.savedPassword ? "enabled" : "not_saved"),
    autoLoginRetryAt: account.autoLoginRetryAt || "",
    lastSessionCheckAt: account.lastSessionCheckAt || "",
    lastAutoLoginAt: account.lastAutoLoginAt || "",
    group: account.group || "未分组",
    enabled: account.enabled !== false,
    createdAt: account.createdAt || "",
    updatedAt: account.updatedAt || "",
    loginStatus: account.loginStatus || "new",
    loginNumber: account.loginNumber || "",
    lastLoginAt: account.lastLoginAt || "",
    lastRefreshAt: account.lastRefreshAt || "",
    lastError: account.lastError || "",
    balance: account.balance || null,
    rights: account.rights || null,
    activityInfo: account.activityInfo || null,
  };
}
export function listAccounts() {
  return store.accounts.map(publicAccount);
}
export function getAccount(id) {
  return store.accounts.find((item) => item.id === id) || null;
}
export function upsertAccount({ id, phone, label, group, enabled }) {
  let account = id ? getAccount(id) : null;
  const now = new Date().toISOString();
  if (!account) {
    account = {
      id: uuidv4(),
      phone,
      label: safeLabel(label) || "",
      group: group || "未分组",
      enabled: enabled !== false,
      loginStatus: "new",
      createdAt: now,
      updatedAt: now,
    };
    store.accounts.unshift(account);
  } else {
    Object.assign(account, {
      label: safeLabel(label ?? account.label),
      group: group ?? account.group,
      enabled: enabled ?? account.enabled,
      updatedAt: now,
    });
  }
  writeJson();
  return publicAccount(account);
}
export function patchAccount(id, patch) {
  const account = getAccount(id);
  if (!account) return null;
  Object.assign(
    account,
    patch,
    ...(Object.hasOwn(patch, "label")
      ? [{ label: safeLabel(patch.label) }]
      : []),
    { updatedAt: new Date().toISOString() },
  );
  writeJson();
  return publicAccount(account);
}
export function deleteAccount(id) {
  const before = store.accounts.length;
  store.accounts = store.accounts.filter((item) => item.id !== id);
  store.logs = store.logs.filter((item) => item.accountId !== id);
  writeJson();
  return store.accounts.length !== before;
}
export function appendLog(accountId, action, payload = {}) {
  store.logs.unshift({
    id: uuidv4(),
    accountId,
    action,
    payload: sanitizeLogValue(payload),
    createdAt: new Date().toISOString(),
  });
  store.logs = store.logs.slice(0, 2000);
  writeJson();
}
export function listLogs(accountId) {
  return store.logs
    .filter((item) => !accountId || item.accountId === accountId)
    .slice(0, 200);
}
export function listTasks() {
  return structuredClone(store.tasks);
}
export function saveTask(task) {
  const index = store.tasks.findIndex((item) => item.id === task.id);
  if (index >= 0) store.tasks[index] = structuredClone(task);
  else store.tasks.unshift(structuredClone(task));
  store.tasks = store.tasks.slice(0, 100);
  writeJson();
}
export function listSchedules() {
  return structuredClone(store.schedules || []);
}
export function saveSchedule(schedule) {
  const index = (store.schedules || []).findIndex((item) => item.id === schedule.id);
  if (index >= 0) store.schedules[index] = structuredClone(schedule);
  else store.schedules.unshift(structuredClone(schedule));
  store.schedules = store.schedules.slice(0, 100);
  writeJson();
  return structuredClone(schedule);
}
export function deleteSchedule(id) {
  const before = (store.schedules || []).length;
  store.schedules = (store.schedules || []).filter((item) => item.id !== id);
  writeJson();
  return store.schedules.length !== before;
}

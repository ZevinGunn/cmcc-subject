import fs from "node:fs";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config.js";
import { maskPhone } from "./crypto189.js";

const filePath = path.join(config.dataDir, "accounts.json");
function readJson() {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!Array.isArray(data.accounts) || !Array.isArray(data.logs))
      throw new Error("账号存储格式错误");
    return { ...data, tasks: data.tasks || [] };
  } catch (error) {
    if (error.code === "ENOENT") return { accounts: [], logs: [], tasks: [] };
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
function publicAccount(account) {
  return {
    id: account.id,
    phone: account.phone,
    maskedPhone: maskPhone(account.phone),
    label: account.label || maskPhone(account.phone),
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
      label: label || "",
      group: group || "未分组",
      enabled: enabled !== false,
      loginStatus: "new",
      createdAt: now,
      updatedAt: now,
    };
    store.accounts.unshift(account);
  } else {
    Object.assign(account, {
      label: label ?? account.label,
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
  Object.assign(account, patch, { updatedAt: new Date().toISOString() });
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
    payload,
    createdAt: new Date().toISOString(),
  });
  store.logs = store.logs.slice(0, 300);
  writeJson();
}
export function listLogs(accountId) {
  return store.logs
    .filter((item) => !accountId || item.accountId === accountId)
    .slice(0, 80);
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

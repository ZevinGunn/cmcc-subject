import fs from "node:fs";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config.js";
import { maskPhone } from "./crypto189.js";

const filePath = path.join(config.dataDir, "accounts.json");

function readJson() {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return { accounts: [], logs: [] };
  }
}

function writeJson(data) {
  fs.mkdirSync(config.dataDir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

let store = readJson();

function publicAccount(account) {
  return {
    id: account.id,
    phone: account.phone,
    maskedPhone: maskPhone(account.phone),
    label: account.label || maskPhone(account.phone),
    loginStatus: account.loginStatus || "new",
    loginNumber: account.loginNumber || "",
    lastLoginAt: account.lastLoginAt || "",
    lastRefreshAt: account.lastRefreshAt || "",
    lastError: account.lastError || "",
    balance: account.balance || null,
    rights: account.rights || null,
    activityInfo: account.activityInfo || null
  };
}

export function listAccounts() {
  return store.accounts.map(publicAccount);
}

export function getAccount(id) {
  return store.accounts.find((item) => item.id === id) || null;
}

export function upsertAccount({ id, phone, label }) {
  const now = new Date().toISOString();
  let account = id ? getAccount(id) : null;
  if (!account) {
    account = {
      id: uuidv4(),
      phone: String(phone || "").trim(),
      label: label || "",
      loginStatus: "new",
      createdAt: now,
      updatedAt: now
    };
    store.accounts.unshift(account);
  } else {
    account.phone = String(phone || account.phone || "").trim();
    account.label = label ?? account.label;
    account.updatedAt = now;
  }
  writeJson(store);
  return publicAccount(account);
}

export function patchAccount(id, patch) {
  const account = getAccount(id);
  if (!account) return null;
  Object.assign(account, patch, { updatedAt: new Date().toISOString() });
  writeJson(store);
  return publicAccount(account);
}

export function deleteAccount(id) {
  const before = store.accounts.length;
  store.accounts = store.accounts.filter((item) => item.id !== id);
  writeJson(store);
  return store.accounts.length !== before;
}

export function appendLog(accountId, action, payload = {}) {
  store.logs.unshift({
    id: uuidv4(),
    accountId,
    action,
    payload,
    createdAt: new Date().toISOString()
  });
  store.logs = store.logs.slice(0, 300);
  writeJson(store);
}

export function listLogs(accountId) {
  return store.logs.filter((item) => !accountId || item.accountId === accountId).slice(0, 80);
}

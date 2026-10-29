import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v4 as uuidv4 } from "uuid";
import { config } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../data");
const filePath = path.join(dataDir, config.sessionFile);

function readStore() {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
}

function writeStore(store) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(store, null, 2));
}

let sessions = readStore();

export function createSession(userInfo) {
  const localToken = uuidv4();
  sessions[localToken] = {
    userInfo,
    sessKey: userInfo?.sessKey || "",
    sessType: userInfo?.sessType || "",
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  writeStore(sessions);
  return localToken;
}

export function getSession(localToken) {
  if (!localToken) return null;
  return sessions[localToken] || null;
}

export function updateSession(localToken, patch) {
  if (!sessions[localToken]) return null;
  sessions[localToken] = { ...sessions[localToken], ...patch, updatedAt: Date.now() };
  writeStore(sessions);
  return sessions[localToken];
}

export function deleteSession(localToken) {
  delete sessions[localToken];
  writeStore(sessions);
}

export function publicUser(session) {
  const user = session?.userInfo || {};
  return {
    phoneNo: user.phoneNo || "",
    desensitizedPhoneNumber: maskPhone(user.phoneNo),
    sessKey: session?.sessKey ? "已保存" : "",
    memberInfo: user.memberInfo || null,
    loginType: user.loginType || ""
  };
}

export function maskPhone(phone) {
  return String(phone || "").replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
}


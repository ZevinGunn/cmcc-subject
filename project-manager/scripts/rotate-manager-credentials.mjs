#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { chmod, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const envFile = path.resolve(scriptDir, "../.env");
const service = "project.1008086.xyz";
const account = process.env.USER || "project-ops-admin";

if (!process.argv.includes("--apply")) {
  process.stdout.write("Usage: node scripts/rotate-manager-credentials.mjs --apply\n");
  process.exit(2);
}

function updateEnv(text, values) {
  const seen = new Set();
  const lines = text.split(/\r?\n/).map((line) => {
    const index = line.indexOf("=");
    if (index < 1) return line;
    const key = line.slice(0, index).trim();
    if (!(key in values)) return line;
    seen.add(key);
    return `${key}=${values[key]}`;
  });
  for (const [key, value] of Object.entries(values)) {
    if (!seen.has(key)) lines.push(`${key}=${value}`);
  }
  return `${lines.join("\n").replace(/\n+$/, "")}\n`;
}

const original = await readFile(envFile, "utf8");
const originalPasswordLine = original.split(/\r?\n/).find((line) => line.startsWith("MANAGER_PASSWORD="));
const originalPassword = originalPasswordLine?.slice(originalPasswordLine.indexOf("=") + 1) || "";
const password = randomBytes(24).toString("base64url");
const sessionSecret = randomBytes(48).toString("base64url");
const updated = updateEnv(original, {
  MANAGER_PASSWORD: password,
  MANAGER_SESSION_SECRET: sessionSecret,
  MANAGER_CREDENTIALS_ROTATED_AT: new Date().toISOString(),
});
const candidate = `${envFile}.next-${process.pid}`;

try {
  await writeFile(candidate, updated, { mode: 0o600, flag: "wx" });
  await chmod(candidate, 0o600);
  await rename(candidate, envFile);
  execFileSync("/usr/bin/security", [
    "add-generic-password",
    "-U",
    "-a", account,
    "-s", service,
    "-l", "Project Ops Manager Password",
    "-w", password,
  ], { stdio: "pipe" });
} catch {
  await rm(candidate, { force: true });
  await writeFile(envFile, original, { mode: 0o600 });
  await chmod(envFile, 0o600);
  if (originalPassword) {
    try {
      execFileSync("/usr/bin/security", [
        "add-generic-password",
        "-U",
        "-a", account,
        "-s", service,
        "-l", "Project Ops Manager Password",
        "-w", originalPassword,
      ], { stdio: "pipe" });
    } catch {
      // Preserve the original .env even if Keychain restoration is unavailable.
    }
  }
  throw new Error("credential rotation failed; original .env restored");
}

process.stdout.write(`Project Ops credentials rotated; password stored in Keychain service ${service}.\n`);

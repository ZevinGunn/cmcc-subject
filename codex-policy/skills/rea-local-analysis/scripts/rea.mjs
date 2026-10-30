#!/usr/bin/env node
import { readFileSync, accessSync, constants } from 'node:fs';
import { spawnSync } from 'node:child_process';

// Share the same non-secret local toolchain profile with the Codex MCP entry.
const profile = JSON.parse(readFileSync(new URL('../../../rea/profile.json', import.meta.url), 'utf8'));
for (const file of [profile.runtime, profile.entrypoint]) accessSync(file, constants.R_OK);
const result = spawnSync(profile.runtime, [profile.entrypoint, ...process.argv.slice(2)], {
  env: { ...process.env, ...profile.environment },
  stdio: 'inherit',
});
if (result.error) {
  console.error(`REA 启动失败：${result.error.message}`);
  process.exit(1);
}
if (result.signal) process.kill(process.pid, result.signal);
else process.exit(result.status ?? 1);

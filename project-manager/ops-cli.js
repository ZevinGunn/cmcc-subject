#!/usr/bin/env node

process.env.PROJECT_MANAGER_NO_LISTEN = "1";

const command = process.argv[2] || "";
const target = process.argv[3] || "";

function usage() {
  process.stdout.write([
    "Project Ops CLI",
    "",
    "用法：",
    "  node project-manager/ops-cli.js build-all",
    "  node project-manager/ops-cli.js rebuild <service-id|all>",
    "",
    "build-all 只做测试与隔离构建校验，不切换线上产物。",
    "rebuild 使用与 V2 相同的测试、隔离构建、受保护切换、重启、后检和失败回滚链路。",
    "",
  ].join("\n"));
}

if (["", "help", "--help", "-h"].includes(command)) {
  usage();
  process.exit(0);
}

if (command === "rebuild" && !target) {
  usage();
  process.exit(2);
}

try {
  const { runCliCommand } = await import("./server.js");
  const result = await runCliCommand(command, target);
  const output = `${result.stdout || ""}${result.stderr ? `\n${result.stderr}` : ""}`.trim();
  if (output) process.stdout.write(`${output}\n`);
  process.exit(result.ok ? 0 : 1);
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}

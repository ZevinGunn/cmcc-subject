#!/usr/bin/env bash
# 只停止清单允许自动操作的业务 PM2 进程；不停止管理台或任何基础设施。
set -uo pipefail

sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*" >&2; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$ROOT/project-manager/services.json"
NODE="${NODE_BIN:-$(command -v node || true)}"
PM2="${PM2_BIN:-$HOME/.nvm/versions/node/v18.20.8/bin/pm2}"
[ -x "$PM2" ] || PM2="$(command -v pm2 || true)"

if [[ "${1:-}" =~ ^(-h|--help|help)$ ]]; then
  printf '%s\n' \
    "用法：bash _部署方案/stop-services.sh" \
    "只停止 services.json 中允许自动操作的业务 PM2；保留 Project Ops、基础设施和人工服务。"
  exit 0
fi
if [ "$#" -gt 0 ]; then
  bad "未知参数：$1"
  exit 2
fi

if [ -z "$NODE" ] || [ ! -x "$NODE" ]; then
  bad "找不到 node，无法读取服务清单"
  exit 1
fi
if [ -z "$PM2" ] || [ ! -x "$PM2" ]; then
  bad "找不到 pm2；请设置 PM2_BIN 或安装 PM2"
  exit 1
fi
if [ ! -f "$MANIFEST" ]; then
  bad "服务清单不存在：$MANIFEST"
  exit 1
fi

sep "停止统一清单中的业务 PM2 进程"
failures=0
while IFS=$'\t' read -r id name pm2_name; do
  [ -n "$id" ] || continue
  if ! "$PM2" describe "$pm2_name" >/dev/null 2>&1; then
    ok "$name ($id) 未登记，视为已停止"
    continue
  fi
  if "$PM2" stop "$pm2_name" >/dev/null; then
    ok "$name ($id) 已停止"
  else
    bad "$name ($id) 停止失败"
    failures=$((failures + 1))
  fi
done < <("$NODE" -e '
  const fs = require("fs");
  const manifest = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  for (const service of manifest.services.filter((item) =>
    item.kind === "application"
    && !item.protected
    && item.automaticOperations !== false
  )) {
    console.log([service.id, service.name, service.pm2Name].join("\t"));
  }
' "$MANIFEST")

sep "验证业务端口已释放"
while IFS=$'\t' read -r id name port; do
  [ -n "$id" ] || continue
  released=0
  for _ in $(seq 1 5); do
    if ! lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
      released=1
      break
    fi
    sleep 1
  done
  if [ "$released" -eq 1 ]; then
    ok "$name ($id) :$port 已释放"
  else
    bad "$name ($id) :$port 仍在监听，可能存在未纳管进程"
    failures=$((failures + 1))
  fi
done < <("$NODE" -e '
  const fs = require("fs");
  const manifest = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  for (const service of manifest.services.filter((item) =>
    item.kind === "application"
    && !item.protected
    && item.automaticOperations !== false
  )) {
    console.log([service.id, service.name, service.port].join("\t"));
  }
' "$MANIFEST")

if ! "$PM2" save >/dev/null; then
  bad "PM2 状态保存失败"
  failures=$((failures + 1))
fi

sep "受保护组件保持运行"
ok "受保护服务、automaticOperations=false 的服务及全部基础设施均未操作"

if [ "$failures" -gt 0 ]; then
  bad "$failures 个停止步骤失败"
  exit 1
fi

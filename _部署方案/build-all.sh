#!/usr/bin/env bash
# 通过统一运维 CLI 隔离构建清单中的全部应用；不清理或直接覆写生产 dist。
set -euo pipefail

bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*" >&2; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OPS_CLI="$ROOT/project-manager/ops-cli.js"
NODE="${NODE_BIN:-$(command -v node || true)}"
PM2="${PM2_BIN:-$HOME/.nvm/versions/node/v18.20.8/bin/pm2}"
[ -x "$PM2" ] || PM2="$(command -v pm2 || true)"

usage() {
  cat <<'EOF'
用法：bash _部署方案/build-all.sh

按 services.json 的能力白名单逐项执行隔离构建与测试。
候选产物只做校验，不清理、不替换线上 dist，也不重启任何服务。
EOF
}

if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
  usage
  exit 0
fi
if [ "$#" -ne 0 ]; then
  bad "build-all 不接受参数"
  usage >&2
  exit 2
fi
if [ -z "$NODE" ] || [ ! -x "$NODE" ]; then
  bad "找不到 node；请设置 NODE_BIN 或安装 Node.js"
  exit 1
fi
if [ -z "$PM2" ] || [ ! -x "$PM2" ]; then
  bad "找不到 pm2；请设置 PM2_BIN 或安装 PM2"
  exit 1
fi
if [ ! -f "$OPS_CLI" ]; then
  bad "统一运维 CLI 不存在：$OPS_CLI"
  exit 1
fi

export NODE_BIN="$NODE"
export PM2_BIN="$PM2"
export PATH="$(dirname "$NODE"):$(dirname "$PM2"):/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

exec "$NODE" "$OPS_CLI" build-all

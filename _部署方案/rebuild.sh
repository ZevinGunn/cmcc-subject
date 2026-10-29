#!/usr/bin/env bash
# 通过统一运维 CLI 安全重建服务；构建、切换、后检与回滚均由 CLI 实现。
set -euo pipefail

bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*" >&2; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OPS_CLI="$ROOT/project-manager/ops-cli.js"
NODE="${NODE_BIN:-$(command -v node || true)}"
PM2="${PM2_BIN:-$HOME/.nvm/versions/node/v18.20.8/bin/pm2}"
[ -x "$PM2" ] || PM2="$(command -v pm2 || true)"
TARGET="${1:-}"

usage() {
  cat <<'EOF'
用法：bash _部署方案/rebuild.sh <name>

常用 name：
  home       cookie-app
  rights     北京移动权益
  qqt        QQT 公共版
  bmcc       北京移动业务查询退订
  bjcmcc     北京移动业务快捷入口
  arpu       好礼多多 ARPU
  contract3  北京移动合约查询
  qqtlocal   QQT 本地极速抢购
  notice     公告查询
  wangka     王卡会员便捷订购
  yunpan     云盘登录工作台
  project    Project Ops 管理台
  all        清单允许自动操作的全部业务应用（不重建管理台）

服务白名单、测试、隔离构建、受保护切换、后检和失败回滚均由
project-manager/ops-cli.js 根据 services.json 统一执行。
EOF
}

if [ "$TARGET" = "-h" ] || [ "$TARGET" = "--help" ]; then
  usage
  exit 0
fi
if [ "$#" -ne 1 ] || [ -z "$TARGET" ]; then
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

exec "$NODE" "$OPS_CLI" rebuild "$TARGET"

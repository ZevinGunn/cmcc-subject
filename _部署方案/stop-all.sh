#!/usr/bin/env bash
# CLI 完整关机：停止业务、专用 Tunnel、Nginx 和 PostgreSQL；默认保留管理台与主 Tunnel。
set -uo pipefail

sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32mOK\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31mFAILED\033[0m %s\n" "$*" >&2; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PM2="${PM2_BIN:-$HOME/.nvm/versions/node/v18.20.8/bin/pm2}"
[ -x "$PM2" ] || PM2="$(command -v pm2 || true)"
WITH_TUNNEL="${1:-}"
NGINX_PLIST="/Library/LaunchDaemons/homebrew.mxcl.nginx.plist"
CF_PLIST="/Library/LaunchDaemons/com.cloudflare.cloudflared.plist"
failures=0

if [[ "$WITH_TUNNEL" =~ ^(-h|--help|help)$ ]]; then
  printf '%s\n' \
    "用法：bash _部署方案/stop-all.sh [--with-tunnel]" \
    "默认停止可自动操作的业务服务、专用 Tunnel、system Nginx 和 PostgreSQL；保留 Project Ops 与主 Tunnel。" \
    "--with-tunnel 额外停止主 Cloudflare Tunnel。"
  exit 0
fi
if [ -n "$WITH_TUNNEL" ] && [ "$WITH_TUNNEL" != "--with-tunnel" ]; then
  bad "未知参数：$WITH_TUNNEL"
  exit 2
fi
if [ "$#" -gt 1 ]; then
  bad "参数过多"
  exit 2
fi

nginx_listening() {
  nc -z 127.0.0.1 80 >/dev/null 2>&1
}

sep "1. 停止业务 PM2 进程"
if ! bash "$ROOT/_部署方案/stop-services.sh"; then
  bad "部分业务进程停止失败"
  failures=$((failures + 1))
fi

sep "2. 停止专用 BMCC Tunnel"
if [ -n "$PM2" ] && "$PM2" describe bmcc-tunnel >/dev/null 2>&1; then
  if "$PM2" stop bmcc-tunnel >/dev/null && "$PM2" save >/dev/null; then
    ok "bmcc-tunnel 已停止"
  else
    bad "bmcc-tunnel 停止失败"
    failures=$((failures + 1))
  fi
else
  ok "bmcc-tunnel 未登记，视为已停止"
fi

sep "3. 停止 Nginx"
if launchctl print system/homebrew.mxcl.nginx >/dev/null 2>&1; then
  if sudo launchctl bootout system "$NGINX_PLIST"; then
    ok "system Nginx 已停止"
  else
    bad "system Nginx 停止失败；请检查管理员权限"
    failures=$((failures + 1))
  fi
elif nginx_listening; then
  if brew services stop nginx >/dev/null; then
    ok "Nginx 已停止"
  else
    bad "Nginx 停止失败；未识别可管理的 system 或用户级服务"
    failures=$((failures + 1))
  fi
else
  ok "Nginx 已停止"
fi
for _ in $(seq 1 10); do
  nginx_listening || break
  sleep 1
done
if nginx_listening; then
  bad "Nginx 停止命令完成后 80 端口仍可连接"
  failures=$((failures + 1))
fi

sep "4. 停止 PostgreSQL 容器"
if docker compose -f "$ROOT/免登录进入全球通/cookie-app/docker-compose.yml" stop; then
  ok "PostgreSQL 容器已停止"
else
  bad "PostgreSQL 容器停止失败"
  failures=$((failures + 1))
fi

sep "5. 主 Cloudflare Tunnel"
if [ "$WITH_TUNNEL" = "--with-tunnel" ]; then
  if ! launchctl print system/com.cloudflare.cloudflared >/dev/null 2>&1; then
    ok "主 Cloudflare Tunnel 已停止"
  elif sudo launchctl bootout system "$CF_PLIST"; then
    ok "主 Cloudflare Tunnel 已停止"
  else
    bad "主 Cloudflare Tunnel 停止失败"
    failures=$((failures + 1))
  fi
else
  ok "默认保留；完整停止请使用 --with-tunnel"
fi

if [ "$failures" -gt 0 ]; then
  bad "完整关机有 $failures 个失败步骤"
  exit 1
fi
ok "完整关机完成；project-manager 保持运行"

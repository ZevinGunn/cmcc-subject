#!/usr/bin/env bash
# 启动完整运行链路；已在线的组件不会被重复重启。
set -euo pipefail

sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32mOK\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31mFAILED\033[0m %s\n" "$*" >&2; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NODE="${NODE_BIN:-$(command -v node || true)}"
PM2="${PM2_BIN:-$HOME/.nvm/versions/node/v18.20.8/bin/pm2}"
[ -x "$PM2" ] || PM2="$(command -v pm2 || true)"
COMPOSE_FILE="$ROOT/免登录进入全球通/cookie-app/docker-compose.yml"
NGINX_PLIST="/Library/LaunchDaemons/homebrew.mxcl.nginx.plist"
CF_PLIST="/Library/LaunchDaemons/com.cloudflare.cloudflared.plist"
CF_CONFIG="/etc/cloudflared/config.yml"

if [[ "${1:-}" =~ ^(-h|--help|help)$ ]]; then
  printf '%s\n' \
    "用法：bash _部署方案/start-all.sh" \
    "恢复 PostgreSQL、system Nginx、主 Tunnel、受管业务 PM2、专用 Tunnel 和 Project Ops，并执行全链路检查。"
  exit 0
fi
if [ "$#" -gt 0 ]; then
  bad "未知参数：$1"
  exit 2
fi

nginx_ready() {
  local code
  nc -z 127.0.0.1 80 >/dev/null 2>&1 || return 1
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 3 -H 'Host: home.1008086.xyz' http://127.0.0.1/ 2>/dev/null)" || return 1
  [ "$code" = "200" ]
}

if [ -z "$NODE" ] || [ ! -x "$NODE" ] || [ -z "$PM2" ] || [ ! -x "$PM2" ]; then
  bad "找不到 node/pm2；请设置 NODE_BIN、PM2_BIN 或安装依赖"
  exit 1
fi
export PATH="$(dirname "$NODE"):$(dirname "$PM2"):/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

sep "1. 确认 Docker 可用"
if ! docker info >/dev/null 2>&1; then
  open -a Docker
  for _ in $(seq 1 30); do
    docker info >/dev/null 2>&1 && break
    sleep 2
  done
fi
if ! docker info >/dev/null 2>&1; then
  bad "Docker 在 60 秒内未就绪"
  exit 1
fi
ok "Docker ready"

sep "2. 启动 PostgreSQL"
if ! docker compose -f "$COMPOSE_FILE" up -d postgres; then
  bad "PostgreSQL 容器启动失败"
  exit 1
fi
for _ in $(seq 1 30); do
  docker exec cmcc-cookie-app-postgres pg_isready -U cmcc_user >/dev/null 2>&1 && break
  sleep 1
done
if ! docker exec cmcc-cookie-app-postgres pg_isready -U cmcc_user >/dev/null 2>&1; then
  bad "PostgreSQL 在 30 秒内未就绪"
  exit 1
fi
ok "PostgreSQL ready"

sep "3. 确认 system Nginx 可用"
if ! nginx_ready; then
  if [ -f "$NGINX_PLIST" ]; then
    if launchctl print system/homebrew.mxcl.nginx >/dev/null 2>&1; then
      if ! sudo launchctl kickstart -k system/homebrew.mxcl.nginx; then
        bad "system Nginx kickstart 失败"
        exit 1
      fi
    elif ! sudo launchctl bootstrap system "$NGINX_PLIST"; then
      bad "system Nginx bootstrap 失败"
      exit 1
    fi
  elif ! brew services start nginx; then
    bad "Nginx 启动失败；未找到 system plist，用户级 brew service 也未能启动"
    exit 1
  fi
fi
for _ in $(seq 1 10); do
  nginx_ready && break
  sleep 1
done
if ! nginx_ready; then
  bad "Nginx 80 端口或 home 静态入口未就绪"
  exit 1
fi
ok "Nginx :80 与 home 静态入口 ready"

sep "4. 确认主 Cloudflare Tunnel 可用"
if [ ! -r "$CF_CONFIG" ]; then
  bad "主 Tunnel 正式配置不存在或不可读：$CF_CONFIG"
  exit 1
fi
if ! cloudflared tunnel --config "$CF_CONFIG" ingress validate; then
  bad "主 Tunnel 正式配置校验失败：$CF_CONFIG"
  exit 1
fi
if ! launchctl print system/com.cloudflare.cloudflared >/dev/null 2>&1; then
  if [ ! -f "$CF_PLIST" ]; then
    bad "主 Tunnel plist 不存在：$CF_PLIST"
    exit 1
  fi
  if ! sudo launchctl bootstrap system "$CF_PLIST"; then
    bad "主 Cloudflare Tunnel bootstrap 失败"
    exit 1
  fi
fi
for _ in $(seq 1 10); do
  launchctl print system/com.cloudflare.cloudflared >/dev/null 2>&1 && break
  sleep 1
done
if ! launchctl print system/com.cloudflare.cloudflared >/dev/null 2>&1; then
  bad "主 Cloudflare Tunnel 未加载"
  exit 1
fi
ok "主 Cloudflare Tunnel ready（${CF_CONFIG}）"

sep "5. 启动业务服务和受管 Tunnel"
bash "$ROOT/_部署方案/start-services.sh"

sep "6. 确认项目管理台在线"
manager_status="$("$PM2" jlist | "$NODE" -e '
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { input += chunk; });
  process.stdin.on("end", () => {
    const manager = JSON.parse(input || "[]").find((item) => item.name === "project-manager");
    process.stdout.write(manager?.pm2_env?.status || "missing");
  });
')"
if [ "$manager_status" = "online" ]; then
  ok "project-manager 已在线，跳过"
elif [ "$manager_status" = "missing" ]; then
  "$PM2" startOrRestart "$ROOT/_部署方案/ecosystem.config.cjs" --only project-manager --update-env
else
  "$PM2" start project-manager --update-env
fi
"$PM2" save

sep "7. 执行全链路检查"
bash "$ROOT/_部署方案/healthcheck.sh"

ok "全部启动步骤完成"

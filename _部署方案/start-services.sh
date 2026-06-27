#!/usr/bin/env bash
# 启动 6 个业务后端，保留 project-manager 本身不重启
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix 2>/dev/null)/bin/pm2
export PATH="$(dirname "$PM2"):/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

sep "1. 启动 cookie-app 的 PostgreSQL 容器"
cd "$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app" || exit 1
docker compose up -d 2>&1 | tail -5
for i in $(seq 1 10); do
  if docker exec cmcc-cookie-app-postgres pg_isready -U cmcc_user >/dev/null 2>&1; then ok "PG ready"; break; fi
  sleep 1
done

sep "2. 启动 6 个业务后端（PM2）"
"$PM2" startOrRestart "$HOME/CMCC-PROJECT/_部署方案/ecosystem.config.cjs" \
  --only rights-backend,arpu-proxy,cmcc-notice,qqt-backend,qqtlocal,cookie-app \
  --update-env
"$PM2" save

sleep 3

sep "3. 自检端口"
for p in 3010:rights 3101:home 3000:arpu 8899:qqtlocal 3111:notice 7607:qqt; do
  port=${p%%:*}; name=${p##*:}
  if lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null 2>&1; then ok "$name :$port"
  else bad "$name :$port 未起"; fi
done

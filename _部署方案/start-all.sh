#!/usr/bin/env bash
# 一键启动：所有依赖 + 业务后端 + 管理后台 + nginx
# 用法：bash ~/CMCC-PROJECT/_部署方案/start-all.sh
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix 2>/dev/null)/bin/pm2
export PATH="$(dirname "$PM2"):/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

sep "1. 启动 Docker Desktop（若未运行）"
if ! docker info >/dev/null 2>&1; then
  open -a Docker
  echo "  等待 docker 启动（最多 60s）..."
  for i in $(seq 1 30); do
    if docker info >/dev/null 2>&1; then ok "docker ready"; break; fi
    sleep 2
  done
else
  ok "docker 已运行"
fi

sep "2. 启动 cookie-app 的 PostgreSQL 容器"
cd "$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
docker compose up -d 2>&1 | tail -5
# 等 PG 就绪
for i in $(seq 1 10); do
  if docker exec cmcc-cookie-app-postgres pg_isready -U cmcc_user >/dev/null 2>&1; then ok "PG ready"; break; fi
  sleep 1
done

sep "3. 启动本地 brew postgresql@16（cookie-app 不需要，但有就一起拉起）"
brew services start postgresql@16 2>&1 | tail -3

sep "4. 启动 nginx"
if lsof -nP -iTCP:80 -sTCP:LISTEN >/dev/null 2>&1; then
  ok "nginx 已运行"
else
  sudo brew services start nginx 2>&1 | tail -3
fi

sep "5. 拉起业务后端 + 管理后台（PM2）"
"$PM2" startOrRestart "$HOME/CMCC-PROJECT/_部署方案/ecosystem.config.cjs" --update-env
"$PM2" save

sleep 5

sep "6. 自检：业务后端端口 + 管理后台"
for p in 3010:rights 3101:home 3000:arpu 8899:qqtlocal 3111:notic 7607:qqt 8788:bmcc 8790:bjcmcc 7800:project; do
  port=${p%%:*}; name=${p##*:}
  if lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null 2>&1; then ok "$name :$port"
  else bad "$name :$port 未起"; fi
done

sep "7. 自检：域名本机直连"
for d in home rights arpu qqtlocal notice qqt bmcc bjcmcc project; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 -H "Host: $d.1008086.xyz" http://127.0.0.1/)
  printf "  %-25s -> %s\n" "$d.1008086.xyz" "$code"
done

sep "全部启动完毕"
echo "  浏览器访问任意域名验证。如果有 ✗，看 pm2 logs <名字>"

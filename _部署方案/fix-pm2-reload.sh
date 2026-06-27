#!/usr/bin/env bash
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

# 用绝对路径找 pm2
PM2=$(which pm2 2>/dev/null)
[ -z "$PM2" ] && PM2="$(npm config get prefix 2>/dev/null)/bin/pm2"
[ -z "$PM2" ] || [ ! -x "$PM2" ] && for cand in /opt/homebrew/bin/pm2 /usr/local/bin/pm2 "$HOME/.npm-global/bin/pm2" "$HOME/.nvm/versions/node/$(node -v)/bin/pm2"; do
  [ -x "$cand" ] && PM2="$cand" && break
done
if [ ! -x "$PM2" ]; then bad "找不到 pm2，请用 'which pm2' 看一下"; exit 1; fi
ok "pm2 = $PM2"

sep "1. 彻底销毁 cookie-app 进程"
"$PM2" delete cookie-app 2>&1 | tail -5

sep "2. 用 ecosystem.config.cjs 重新拉起 cookie-app（只起这一个）"
"$PM2" start "$HOME/CMCC-PROJECT/_部署方案/ecosystem.config.cjs" --only cookie-app
"$PM2" save
sleep 6

sep "3. pm2 status"
"$PM2" status

sep "4. cookie-app 最近 30 行日志（看是否还有 P1000）"
"$PM2" logs cookie-app --lines 30 --nostream 2>/dev/null | tail -40

sep "5. /api/health"
curl -s -H "Host: home.1008086.xyz" http://127.0.0.1/api/health | head -c 200; echo

sep "6. 真实登录端点（替换成你前端实际调用的路径）"
echo "  下面这几个常见路径都试一遍："
for ep in /api/auth/login /api/admin/login /api/auth/admin/login /api/login; do
  printf "  %-30s -> " "$ep"
  curl -s -o /dev/null -w "HTTP %{http_code}\n" -X POST -H "Host: home.1008086.xyz" \
    -H "Content-Type: application/json" -d '{}' http://127.0.0.1$ep
done

#!/usr/bin/env bash
# 整链路自检
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix 2>/dev/null)/bin/pm2

sep "1. PM2 6 个后端 + 管理后台状态"
"$PM2" status

sep "2. 6 个端口监听 + 管理后台"
for p in 3010:rights 3101:home 3000:arpu 8899:qqtlocal 3111:notic 7607:qqt 7800:project; do
  port=${p%%:*}; name=${p##*:}
  if lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null 2>&1; then ok "$name :$port"
  else bad "$name :$port 未起"; fi
done

sep "3. nginx 监听 80"
sudo lsof -nP -iTCP:80 -sTCP:LISTEN | head -3 || bad "nginx 没起"

sep "4. cloudflared"
ps aux | grep -E "[c]loudflared" | head -1

sep "5. docker PG"
docker exec cmcc-cookie-app-postgres pg_isready -U cmcc_user 2>&1 || bad "PG 不可用"

sep "6. 本机 7 个域名"
for d in home rights arpu qqtlocal notice qqt project; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 -H "Host: $d.1008086.xyz" http://127.0.0.1/)
  printf "  本机 %-22s -> %s\n" "$d.1008086.xyz" "$code"
done

sep "7. 公网 HTTPS"
for d in home rights arpu qqtlocal notice qqt project; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 8 https://$d.1008086.xyz/)
  printf "  公网 https://%-22s -> %s\n" "$d.1008086.xyz" "$code"
done

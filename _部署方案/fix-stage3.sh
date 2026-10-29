#!/usr/bin/env bash
set +e
ROOT="$HOME/CMCC-PROJECT"
PLAN="$ROOT/_部署方案"
NGX_ETC=/opt/homebrew/etc/nginx
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

# 1. 删掉我们加的 include servers/*.conf;（保留默认的 include servers/*;）
sep "1. 修复 nginx.conf 双 include"
sudo cp -n "$NGX_ETC/nginx.conf" "$NGX_ETC/nginx.conf.bak.$(date +%s)"
sudo awk '!/include[[:space:]]+servers\/\*\.conf;/' "$NGX_ETC/nginx.conf" > /tmp/nginx.conf.new
sudo mv /tmp/nginx.conf.new "$NGX_ETC/nginx.conf"
ok "已删除我们新加的 include servers/*.conf; (保留默认 include servers/*;)"
grep -n "include" "$NGX_ETC/nginx.conf" | sed 's/^/    /'

sep "2. nginx -t / reload"
sudo nginx -t && sudo nginx -s reload && ok "nginx reload OK"

# 2. 改名为 ecosystem.config.cjs（pm2 7.x 必须含 .config.）
sep "3. 修正 PM2 配置文件名"
cp "$PLAN/ecosystem.local.cjs" "$PLAN/ecosystem.config.cjs"
ok "已生成 $PLAN/ecosystem.config.cjs"

# 3. 清掉错误的 pm2 实例并重新启动
sep "4. 重启 PM2"
pm2 delete all 2>/dev/null
pm2 start "$PLAN/ecosystem.config.cjs"
pm2 save
sleep 5
pm2 status

sep "5. 端口自检"
for p in 3010:rights 3101:home 3000:arpu 8899:qqtlocal 3111:notic 7607:qqt; do
  port=${p%%:*}; name=${p##*:}
  if lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null 2>&1; then ok "$name :$port"
  else bad "$name :$port 未起"; fi
done

sep "6. 本机域名直连"
for d in home rights arpu qqtlocal notic qqt; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 -H "Host: $d.1008086.xyz" http://127.0.0.1/)
  printf "  %-25s -> %s\n" "$d.1008086.xyz" "$code"
done

sep "7. 失败的 pm2 进程最近 20 行日志（如有）"
for n in cookie-app rights-backend arpu-proxy cmcc-notice qqt-backend qqtlocal; do
  status=$(pm2 jlist 2>/dev/null | python3 -c "
import sys,json
for x in json.load(sys.stdin):
    if x['name']=='$n': print(x['pm2_env']['status'])" 2>/dev/null)
  if [ -n "$status" ] && [ "$status" != "online" ]; then
    printf "\n--- %s (%s) ---\n" "$n" "$status"
    pm2 logs "$n" --lines 20 --nostream 2>/dev/null
  fi
done

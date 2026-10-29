#!/usr/bin/env bash
set +e
ROOT="$HOME/CMCC-PROJECT"
PLAN="$ROOT/_部署方案"
NGX_ETC=/opt/homebrew/etc/nginx
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

# 1. 备份 nginx.conf；删除多余的 include servers/*.conf;（只保留一行）
sep "1. 修复重复的 include"
sudo cp -n "$NGX_ETC/nginx.conf" "$NGX_ETC/nginx.conf.bak.$(date +%s)"
# 用 awk：遇到 include servers/*.conf; 时只保留第一次出现
sudo awk '
  /include[[:space:]]+servers\/\*\.conf;/ {
    if (seen++ == 0) print; else next; next
  }
  { print }
' "$NGX_ETC/nginx.conf" > /tmp/nginx.conf.new
sudo mv /tmp/nginx.conf.new "$NGX_ETC/nginx.conf"
ok "已去重 include servers/*.conf;"
grep -n "include" "$NGX_ETC/nginx.conf" | sed 's/^/    /'

sep "2. nginx -t"
sudo nginx -t

sep "3. nginx reload"
sudo nginx -s reload && ok "reload OK"

# 2. 装 pm2
sep "4. 安装 pm2"
if command -v pm2 >/dev/null 2>&1; then
  ok "pm2 已安装：$(pm2 -v)"
else
  npm i -g pm2 2>&1 | tail -8
  if command -v pm2 >/dev/null 2>&1; then ok "pm2 装好了：$(pm2 -v)"
  else bad "pm2 装失败：可能要 sudo npm i -g pm2"; fi
fi

# 3. 启动 PM2
sep "5. 启动 PM2 服务"
pm2 delete all 2>/dev/null
pm2 start "$PLAN/ecosystem.local.cjs"
pm2 save
sleep 4
pm2 status

sep "6. 端口自检"
for p in 3010:rights 3101:home 3000:arpu 8899:qqtlocal 3111:notic 7607:qqt; do
  port=${p%%:*}; name=${p##*:}
  if lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null 2>&1; then ok "$name :$port"
  else bad "$name :$port 未起；查 pm2 logs $name --lines 30"; fi
done

sep "7. 本机直连"
for d in home rights arpu qqtlocal notic qqt; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 -H "Host: $d.1008086.xyz" http://127.0.0.1/)
  printf "  %-25s -> %s\n" "$d.1008086.xyz" "$code"
done

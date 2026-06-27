#!/usr/bin/env bash
set +e
NGX_ETC=/opt/homebrew/etc/nginx
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }

sep "1. 找还有谁也声明了 home.1008086.xyz"
sudo grep -rn "home.1008086.xyz\|home\\.1008086" "$NGX_ETC" 2>/dev/null | sed 's/^/    /'
echo "    -- servers 目录列表 --"
sudo ls -la "$NGX_ETC/servers/" | sed 's/^/    /'

sep "2. cookie-app 最近 40 行日志"
pm2 logs cookie-app --lines 40 --nostream 2>/dev/null | tail -60

sep "3. qqtlocal 最近 40 行日志"
pm2 logs qqtlocal --lines 40 --nostream 2>/dev/null | tail -60

sep "4. cookie-app .env.production 检查（不打印密钥值，只看 key）"
grep -E "^(DATABASE_URL|ADMIN_KEY|CMCC_DB_ENCRYPTION_KEY|PORT|APP_ENV)=" \
  "$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app/.env.production" | sed 's/=.*$/=<REDACTED>/'

sep "5. PostgreSQL（docker / 5432）"
if command -v docker >/dev/null 2>&1; then
  docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' 2>/dev/null | grep -i postgres
fi
lsof -nP -iTCP:5432 -sTCP:LISTEN 2>/dev/null | head -3 || echo "    5432 没监听"

sep "6. qqtlocal 启动方式确认"
grep -A4 'name: "qqtlocal"' "$HOME/CMCC-PROJECT/_部署方案/ecosystem.config.cjs"
ls "$HOME/CMCC-PROJECT/qqtlocal-rights/venv/bin/python" 2>&1 | sed 's/^/    /'
ls "$HOME/CMCC-PROJECT/qqtlocal-rights/backend/app.py" 2>&1 | sed 's/^/    /'

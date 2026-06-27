#!/usr/bin/env bash
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }

PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix)/bin/pm2

sep "1. cookie-app 最近 50 行日志（混合 out/err）"
"$PM2" logs cookie-app --lines 50 --nostream 2>/dev/null | tail -80

sep "2. cookie-app 最近 30 行 *仅错误* 日志"
"$PM2" logs cookie-app --lines 30 --nostream --err 2>/dev/null | tail -50

sep "3. 直接调一次 /api/accounts 触发新错误，再立刻拉日志"
# 拿 cookie
CJ=$(mktemp)
curl -s -c "$CJ" -H "Host: home.1008086.xyz" -H "Content-Type: application/json" \
  -X POST -d '{"username":"admin","password":"'"${ADMIN_PWD:-Cmcc2026!}"'"}' \
  http://127.0.0.1/api/admin/login > /dev/null

echo "  curl /api/accounts ..."
curl -s -b "$CJ" -H "Host: home.1008086.xyz" \
  -o /tmp/acc.json -w "  HTTP %{http_code}\n" \
  http://127.0.0.1/api/accounts
echo "  body:"
head -c 500 /tmp/acc.json; echo

rm -f "$CJ"
sleep 1

sep "4. 触发后立刻看 cookie-app 错误日志"
"$PM2" logs cookie-app --lines 25 --nostream --err 2>/dev/null | tail -40

#!/usr/bin/env bash
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }

sep "1. 解除 cmcc_cookie_app 的 read-only 标志"
psql -U "$USER" -d postgres -c "ALTER DATABASE cmcc_cookie_app RESET default_transaction_read_only;" 2>&1

sep "2. 顺手确认 cmcc_credentials 没有同样标志"
psql -U "$USER" -d postgres -c "
SELECT d.datname, s.setconfig
FROM pg_db_role_setting s
JOIN pg_database d ON d.oid = s.setdatabase
WHERE d.datname IN ('cmcc_cookie_app','cmcc_credentials');"

sep "3. cmcc_user 走 TCP 在 cmcc_cookie_app 上验证 CREATE/DROP（应该通）"
PW=$(grep -E "^DATABASE_URL=" "$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app/.env" | sed -E 's|^DATABASE_URL=.*://cmcc_user:([^@]+)@.*$|\1|' | tr -d '"')
PGPASSWORD="$PW" psql -h 127.0.0.1 -p 5432 -U cmcc_user -d cmcc_cookie_app -c "
CREATE TABLE _diag_unlock_test (id int);
DROP TABLE _diag_unlock_test;
SELECT 'ok' as result;
"

sep "4. 重启 cookie-app（彻底删 + 重建）"
PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix)/bin/pm2
"$PM2" delete cookie-app 2>&1 | tail -3
"$PM2" start "$HOME/CMCC-PROJECT/_部署方案/ecosystem.config.cjs" --only cookie-app
"$PM2" save
sleep 6

sep "5. /api/health"
curl -s -H "Host: home.1008086.xyz" http://127.0.0.1/api/health | head -c 300; echo

sep "6. /api/admin/login 用 admin + 上次设的密码 'Cmcc2026!' 试一下"
curl -s -X POST -H "Host: home.1008086.xyz" -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Cmcc2026!"}' \
  http://127.0.0.1/api/admin/login | head -c 400
echo
echo
ok "完成。浏览器去 home.1008086.xyz 登录，55 个账号应该都回来"

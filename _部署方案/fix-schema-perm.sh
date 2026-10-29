#!/usr/bin/env bash
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }

sep "1. docker PG 里 cmcc_user 当前属性 / 库 owner / schema owner"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d postgres -c "\du cmcc_user"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app -c "
SELECT current_database(), current_user;
SELECT pg_catalog.pg_get_userbyid(d.datdba) AS db_owner
FROM pg_database d WHERE d.datname='cmcc_cookie_app';
SELECT n.nspname, pg_catalog.pg_get_userbyid(n.nspowner) AS schema_owner, n.nspacl
FROM pg_namespace n WHERE n.nspname='public';"

sep "2. 在 cmcc_cookie_app 上一次性给足 cmcc_user 权限（owner+ALL）"
docker exec cmcc-cookie-app-postgres psql -U postgres -d cmcc_cookie_app 2>/dev/null <<'SQL' || \
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app <<'SQL'
ALTER DATABASE cmcc_cookie_app OWNER TO cmcc_user;
ALTER SCHEMA public OWNER TO cmcc_user;
GRANT ALL PRIVILEGES ON DATABASE cmcc_cookie_app TO cmcc_user;
GRANT ALL ON SCHEMA public TO cmcc_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO cmcc_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO cmcc_user;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO cmcc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cmcc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cmcc_user;
SQL

sep "3. 同样修复 cmcc_credentials 库"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_credentials <<'SQL'
ALTER SCHEMA public OWNER TO cmcc_user;
GRANT ALL ON SCHEMA public TO cmcc_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO cmcc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cmcc_user;
SQL

sep "4. TCP+密码自测：能否 SELECT Account"
PW=$(grep -E "^DATABASE_URL=" "$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app/.env" | sed -E 's|^DATABASE_URL=.*://cmcc_user:([^@]+)@.*$|\1|' | tr -d '"')
PGPASSWORD="$PW" psql -h 127.0.0.1 -p 55432 -U cmcc_user -d cmcc_cookie_app -c "
SELECT COUNT(*) AS account_rows FROM \"Account\";"

sep "5. 重启 cookie-app"
PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix)/bin/pm2
"$PM2" delete cookie-app 2>&1 | tail -3
"$PM2" start "$HOME/CMCC-PROJECT/_部署方案/ecosystem.config.cjs" --only cookie-app
"$PM2" save
sleep 7

sep "6. cookie-app 启动后 15 行日志（应该无 permission denied）"
"$PM2" logs cookie-app --lines 20 --nostream 2>/dev/null | tail -25

sep "7. 登录 + /api/accounts"
CJ=$(mktemp)
curl -s -c "$CJ" -H "Host: home.1008086.xyz" -H "Content-Type: application/json" \
  -X POST -d '{"username":"admin","password":"'"${ADMIN_PWD:-Cmcc2026!}"'"}' \
  http://127.0.0.1/api/admin/login | head -c 200; echo
echo
echo "  -- /api/accounts --"
curl -s -b "$CJ" -H "Host: home.1008086.xyz" \
  -o /tmp/r.json -w "  HTTP %{http_code}\n" http://127.0.0.1/api/accounts
head -c 400 /tmp/r.json; echo
echo
echo "  -- /api/auth/me（看你身份） --"
curl -s -b "$CJ" -H "Host: home.1008086.xyz" http://127.0.0.1/api/auth/me | head -c 300; echo
rm -f "$CJ"

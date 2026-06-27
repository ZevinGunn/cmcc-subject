#!/usr/bin/env bash
set +e
ROOT="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

cd "$ROOT" || exit 1

# 取当前 .env 里的密码（不打印）
PASS=$(grep -E "^DATABASE_URL=" .env | sed -E 's|^DATABASE_URL=.*://cmcc_user:([^@]+)@.*$|\1|' | tr -d '"')
if [ -z "$PASS" ]; then bad "解析不到 DATABASE_URL 里的密码"; exit 1; fi
ok "已从 .env 取出 cmcc_user 密码（长度 ${#PASS}）"

sep "1. 主库 TCP 连接"
PGPASSWORD="$PASS" psql -h 127.0.0.1 -p 55432 -U cmcc_user -d cmcc_cookie_app -c "select 'main', current_user;" 2>&1 | tail -5

sep "2. 凭证库 TCP 连接（同样密码、同样用户、不同库名）"
PGPASSWORD="$PASS" psql -h 127.0.0.1 -p 55432 -U cmcc_user -d cmcc_credentials -c "select 'creds', current_user;" 2>&1 | tail -5

sep "3. 看 cmcc_credentials 的所有权 / 权限"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d postgres -c "
SELECT d.datname, pg_catalog.pg_get_userbyid(d.datdba) AS owner, d.datacl
FROM pg_catalog.pg_database d
WHERE d.datname IN ('cmcc_cookie_app','cmcc_credentials');" 2>&1 | head -15

sep "4. 给 cmcc_user 在 cmcc_credentials 上充足权限（幂等）"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_credentials -c "
GRANT ALL PRIVILEGES ON DATABASE cmcc_credentials TO cmcc_user;
GRANT ALL ON SCHEMA public TO cmcc_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO cmcc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cmcc_user;" 2>&1 | tail -5

sep "5. 完全销毁旧 cookie-app 进程（清掉 env 缓存），用 ecosystem 重新拉起"
pm2 delete cookie-app 2>/dev/null
pm2 start "$ROOT/../../_部署方案/ecosystem.config.cjs" --only cookie-app
pm2 save
sleep 6

sep "6. 看 cookie-app 启动日志"
pm2 logs cookie-app --lines 20 --nostream 2>/dev/null | tail -30

sep "7. /api/health 验证"
curl -s -H "Host: home.1008086.xyz" http://127.0.0.1/api/health | head -c 200; echo

sep "8. 试一次登录端点（应该不再报 P1000）"
# 看 admin login 路由路径
curl -s -X POST -H "Host: home.1008086.xyz" -H "Content-Type: application/json" \
  -d '{"username":"diag","password":"diag"}' \
  http://127.0.0.1/api/auth/admin/login 2>&1 | head -c 300
echo
echo "  ↑ 如果不再是 P1000，只是用户密码错，说明凭证库连接已 OK"

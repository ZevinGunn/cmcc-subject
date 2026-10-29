#!/usr/bin/env bash
set +e
ROOT="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
cd "$ROOT" || exit 1

sep "1. 当前 .env 的 DATABASE_URL（脱敏端口）"
grep "^DATABASE_URL" .env .env.production | sed 's|:[^:@]*@|:<PWD>@|'

sep "2. cookie-app 进程当前实际连的库（看启动日志 'Datasource' 或 'Server ready' 后下一行）"
PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix)/bin/pm2
"$PM2" logs cookie-app --lines 60 --nostream 2>/dev/null | grep -iE "Datasource|database|port 3101|Server ready|prisma" | tail -20

sep "3. docker PG Account 表内容采样（看真假数据）"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app -c "
SELECT id, phone, \"displayPhone\", \"userId\", \"cookieUpdatedAt\", \"createdAt\"
FROM \"Account\" ORDER BY \"createdAt\" DESC LIMIT 6;" 2>&1

sep "4. docker PG Account 按 userId 分组"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app -c "
SELECT COALESCE(\"userId\",'<null>') AS uid, COUNT(*) FROM \"Account\" GROUP BY \"userId\" ORDER BY 2 DESC;" 2>&1

sep "5. docker PG AdminUser 列表"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app -c "
SELECT id, username, role, \"disabledAt\", \"updatedAt\" FROM \"AdminUser\";" 2>&1

sep "6. docker PG User 列表（注意普通 User 表）"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app -c "
SELECT id, username, \"displayName\", \"createdAt\" FROM \"User\" LIMIT 10;" 2>&1

sep "7. 浏览器 admin 登录拿 cookie → 调列账号接口"
# 7.1 登录拿 cookie
COOKIE_JAR=$(mktemp)
LOGIN=$(curl -s -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
  -H "Host: home.1008086.xyz" -H "Content-Type: application/json" \
  -X POST -d '{"username":"admin","password":"'"${ADMIN_PWD:-Cmcc2026!}"'"}' \
  http://127.0.0.1/api/admin/login)
echo "  login resp: $(echo "$LOGIN" | head -c 200)"

# 7.2 看可能的"列账号"端点
for ep in \
  /api/accounts /api/accounts?limit=5 \
  /api/admin/accounts \
  /api/admin/accounts?limit=5 \
  /api/accounts/list ; do
  printf "  %-40s -> " "$ep"
  curl -s -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
    -H "Host: home.1008086.xyz" "http://127.0.0.1$ep" \
    -o /tmp/resp.json -w "HTTP %{http_code}"
  echo
  head -c 250 /tmp/resp.json; echo
  echo "  ---"
done
rm -f "$COOKIE_JAR"

sep "8. 找"账号列表"前端真正请求的接口路径"
grep -rn "accounts/" "$ROOT/src" 2>/dev/null | grep -iE "fetch|axios|get|post|request" | head -10

#!/usr/bin/env bash
set +e
ROOT="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

cd "$ROOT" || exit 1

# 1. 生成一个新的随机密码
sep "1. 生成新密码并 ALTER PG 用户"
NEW_PASS=$(openssl rand -hex 16)

# 用 superuser (postgres) 重置 cmcc_user 密码（这条不需要旧密码）
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app \
  -c "ALTER USER cmcc_user WITH PASSWORD '${NEW_PASS}';" 2>&1 | tail -5

# 2. 确保权限
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app -c "
GRANT ALL PRIVILEGES ON DATABASE cmcc_cookie_app TO cmcc_user;
GRANT ALL ON SCHEMA public TO cmcc_user;
" 2>&1 | tail -5
ok "密码已重置，权限已授"

# 3. 写回 .env / .env.production
sep "2. 用新密码更新 DATABASE_URL"
NEW_URL="postgresql://cmcc_user:${NEW_PASS}@127.0.0.1:5432/cmcc_cookie_app?schema=public"
for f in .env .env.production; do
  [ -f "$f" ] || continue
  python3 - "$f" "$NEW_URL" <<'PY'
import sys, re
p, url = sys.argv[1], sys.argv[2]
s = open(p).read()
if re.search(r'^DATABASE_URL=', s, re.M):
    s = re.sub(r'^DATABASE_URL=.*$', f'DATABASE_URL="{url}"', s, flags=re.M)
else:
    s = s.rstrip() + f'\nDATABASE_URL="{url}"\n'
open(p, 'w').write(s)
print(f'  {p} OK')
PY
done

# 4. 用 TCP+密码自测
sep "3. TCP+密码连接测试"
PGPASSWORD="$NEW_PASS" psql -h 127.0.0.1 -p 5432 -U cmcc_user -d cmcc_cookie_app -c "select current_user, current_database();" 2>&1 | tail -8

# 5. prisma migrate deploy
sep "4. prisma migrate deploy"
DATABASE_URL="$NEW_URL" npx prisma migrate deploy 2>&1 | tail -20

# 6. 重启
sep "5. 重启 cookie-app"
pm2 restart cookie-app --update-env
sleep 6
pm2 status | grep -E "cookie-app|name|---" | head -6

sep "6. 端口自检"
for p in 3010:rights 3101:home 3000:arpu 8899:qqtlocal 3111:notic 7607:qqt; do
  port=${p%%:*}; name=${p##*:}
  if lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null 2>&1; then ok "$name :$port"
  else bad "$name :$port 未起"; fi
done

sep "7. 本机域名直连"
for d in home rights arpu qqtlocal notic qqt; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 -H "Host: $d.1008086.xyz" http://127.0.0.1/)
  printf "  %-25s -> %s\n" "$d.1008086.xyz" "$code"
done

sep "8. /api/health"
curl -s -H "Host: home.1008086.xyz" http://127.0.0.1/api/health | head -c 300
echo
curl -s -H "Host: rights.1008086.xyz" http://127.0.0.1/api/health | head -c 300
echo

sep "9. 失败时的日志"
if ! lsof -nP -iTCP:3101 -sTCP:LISTEN >/dev/null 2>&1; then
  pm2 logs cookie-app --lines 20 --nostream --err 2>/dev/null | tail -30
fi

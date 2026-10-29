#!/usr/bin/env bash
set +e
ROOT="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

cd "$ROOT" || exit 1

# 1. 把 POSTGRES_PORT 写进 .env，docker compose 读到后绑 55432
sep "1. 设置 docker PG 监听端口为 55432"
python3 - .env <<'PY'
import re,sys
p = sys.argv[1]
s = open(p).read() if __import__('os').path.exists(p) else ''
def setkv(s,k,v):
    if re.search(rf'^{k}=', s, re.M): return re.sub(rf'^{k}=.*$', f'{k}={v}', s, flags=re.M)
    return s.rstrip() + f'\n{k}={v}\n'
s = setkv(s, 'POSTGRES_PORT', '55432')
# 同时确保 POSTGRES_USER/DB 一致（避免 compose 用默认值）
if 'POSTGRES_USER' not in s: s = setkv(s, 'POSTGRES_USER', 'cmcc_user')
if 'POSTGRES_DB'  not in s: s = setkv(s, 'POSTGRES_DB',  'cmcc_cookie_app')
open(p,'w').write(s)
print('  .env 已写 POSTGRES_PORT=55432')
PY

# 2. 重启 docker，让端口生效
sep "2. 重启 docker postgres"
docker compose down 2>&1 | tail -3
docker compose up -d 2>&1 | tail -5
sleep 6
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | grep postgres

# 3. 更新 DATABASE_URL 到 55432
sep "3. 更新 .env / .env.production 中的 DATABASE_URL 端口"
# 用容器里实际的密码（如果之前已经 ALTER 过，这次重启会重新读初始密码 — 所以重新 ALTER 一次）
NEW_PASS=$(openssl rand -hex 16)
# 等 PG 真正 ready
for i in 1 2 3 4 5 6 7 8 9 10; do
  if docker exec cmcc-cookie-app-postgres pg_isready -U cmcc_user >/dev/null 2>&1; then break; fi
  sleep 1
done
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app \
  -c "ALTER USER cmcc_user WITH PASSWORD '${NEW_PASS}';" 2>&1 | tail -3

NEW_URL="postgresql://cmcc_user:${NEW_PASS}@127.0.0.1:55432/cmcc_cookie_app?schema=public"
for f in .env .env.production; do
  python3 - "$f" "$NEW_URL" <<'PY'
import sys, re, os
p, url = sys.argv[1], sys.argv[2]
if not os.path.exists(p): sys.exit()
s = open(p).read()
if re.search(r'^DATABASE_URL=', s, re.M):
    s = re.sub(r'^DATABASE_URL=.*$', f'DATABASE_URL="{url}"', s, flags=re.M)
else:
    s = s.rstrip() + f'\nDATABASE_URL="{url}"\n'
open(p, 'w').write(s)
print(f'  {p}: DATABASE_URL 端口已改为 55432')
PY
done

# 4. TCP 连接测试
sep "4. TCP+密码连接测试（5432=brew, 55432=docker）"
PGPASSWORD="$NEW_PASS" psql -h 127.0.0.1 -p 55432 -U cmcc_user -d cmcc_cookie_app -c "select current_user, current_database();" 2>&1 | tail -8

# 5. prisma migrate
sep "5. prisma migrate deploy"
DATABASE_URL="$NEW_URL" npx prisma migrate deploy 2>&1 | tail -20

# 6. 重启
sep "6. pm2 restart cookie-app --update-env"
pm2 restart cookie-app --update-env
sleep 7
pm2 status | grep -E "name|cookie-app|---" | head -6

sep "7. 端口自检"
for p in 3010:rights 3101:home 3000:arpu 8899:qqtlocal 3111:notic 7607:qqt; do
  port=${p%%:*}; name=${p##*:}
  if lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null 2>&1; then ok "$name :$port"
  else bad "$name :$port 未起"; fi
done

sep "8. 本机域名直连"
for d in home rights arpu qqtlocal notic qqt; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 -H "Host: $d.1008086.xyz" http://127.0.0.1/)
  printf "  %-25s -> %s\n" "$d.1008086.xyz" "$code"
done

sep "9. cookie-app api/health"
curl -s -H "Host: home.1008086.xyz" http://127.0.0.1/api/health | head -c 300; echo

sep "10. 失败时日志"
if ! lsof -nP -iTCP:3101 -sTCP:LISTEN >/dev/null 2>&1; then
  pm2 logs cookie-app --lines 20 --nostream --err 2>/dev/null | tail -25
fi

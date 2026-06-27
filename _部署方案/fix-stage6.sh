#!/usr/bin/env bash
set +e
ROOT="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

cd "$ROOT" || exit 1

sep "1. .env 当前 DATABASE_URL（不打印密码）"
grep "^DATABASE_URL" .env 2>/dev/null | sed 's/:[^:@]*@/:<PWD>@/'
grep "^DATABASE_URL" .env.production | sed 's/:[^:@]*@/:<PWD>@/'

sep "2. 从 docker 取真实密码并构造 DATABASE_URL"
PG_PASS=$(docker exec cmcc-cookie-app-postgres bash -c 'echo "$POSTGRES_PASSWORD"' 2>/dev/null)
if [ -z "$PG_PASS" ]; then bad "拿不到 PG 密码"; exit 1; fi
NEW_URL="postgresql://cmcc_user:${PG_PASS}@127.0.0.1:5432/cmcc_cookie_app?schema=public"
ok "新 DATABASE_URL 已构造 (host=127.0.0.1 port=5432 db=cmcc_cookie_app)"

# 3. 写回 .env 和 .env.production（保证两边都对，dotenv 怎么 merge 都不会错）
sep "3. 同步 DATABASE_URL 到 .env / .env.production"
for f in .env .env.production; do
  [ -f "$f" ] || continue
  cp "$f" "$f.bak.$(date +%s)"
  python3 - "$f" "$NEW_URL" <<'PY'
import sys, re
p, url = sys.argv[1], sys.argv[2]
s = open(p).read()
if re.search(r'^DATABASE_URL=', s, re.M):
    s = re.sub(r'^DATABASE_URL=.*$', f'DATABASE_URL="{url}"', s, flags=re.M)
else:
    s = s.rstrip() + f'\nDATABASE_URL="{url}"\n'
# 同时清理 CREDENTIALS_DATABASE_URL 若指向旧 host
s = re.sub(r'^CREDENTIALS_DATABASE_URL=.*10\.0\.0\.20.*$', '', s, flags=re.M)
open(p, 'w').write(s)
print(f'  {p}: DATABASE_URL 已更新')
PY
done

sep "4. 测试 PG 连通性"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app -c "select 1;" 2>&1 | tail -5

sep "5. prisma migrate deploy"
npx prisma migrate deploy 2>&1 | tail -15

sep "6. 重启 cookie-app（带 --update-env 让 PM2 重读 env）"
pm2 restart cookie-app --update-env
sleep 6

sep "7. 端口自检"
for p in 3010:rights 3101:home 3000:arpu 8899:qqtlocal 3111:notic 7607:qqt; do
  port=${p%%:*}; name=${p##*:}
  if lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null 2>&1; then ok "$name :$port"
  else bad "$name :$port 未起"; fi
done
pm2 status

sep "8. 本机域名直连"
for d in home rights arpu qqtlocal notic qqt; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 -H "Host: $d.1008086.xyz" http://127.0.0.1/)
  printf "  %-25s -> %s\n" "$d.1008086.xyz" "$code"
done

sep "9. 如果 home 仍未起，看最后 15 行错误日志"
if ! lsof -nP -iTCP:3101 -sTCP:LISTEN >/dev/null 2>&1; then
  pm2 logs cookie-app --lines 15 --nostream --err 2>/dev/null | tail -25
fi

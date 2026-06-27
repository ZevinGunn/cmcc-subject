#!/usr/bin/env bash
set +e
ROOT="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
cd "$ROOT" || exit 1

sep "0. 当前 .env DATABASE_URL（脱敏）"
grep "^DATABASE_URL" .env | sed 's|:[^:@]*@|:<PWD>@|'

sep "1. docker PG 重置 cmcc_user 密码"
NEW_PASS=$(openssl rand -hex 16)
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app -c "
ALTER USER cmcc_user WITH PASSWORD '${NEW_PASS}';" 2>&1 | tail -3
ok "docker PG 内 cmcc_user 密码已重置"

sep "2. 把 .env / .env.production 切回 docker PG (55432) 并写新密码"
NEW_URL="postgresql://cmcc_user:${NEW_PASS}@127.0.0.1:55432/cmcc_cookie_app?schema=public"
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
open(p, 'w').write(s)
print(f'  {p} 已切回 127.0.0.1:55432')
PY
done

sep "3. TCP 连 docker PG 验证 + 看 Account 行数"
PGPASSWORD="$NEW_PASS" psql -h 127.0.0.1 -p 55432 -U cmcc_user -d cmcc_cookie_app -c "
SELECT COUNT(*) AS rows,
       MAX(\"createdAt\") AS latest_created,
       MAX(\"updatedAt\") AS latest_updated
FROM \"Account\";"

sep "4. 重启 cookie-app（彻底删 + 重建）"
PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix)/bin/pm2
"$PM2" delete cookie-app 2>&1 | tail -3
"$PM2" start "$HOME/CMCC-PROJECT/_部署方案/ecosystem.config.cjs" --only cookie-app
"$PM2" save
sleep 7

sep "5. cookie-app 最近 20 行日志"
"$PM2" logs cookie-app --lines 20 --nostream 2>/dev/null | tail -25

sep "6. /api/health"
curl -s -H "Host: home.1008086.xyz" http://127.0.0.1/api/health | head -c 300; echo

sep "7. 登录端点 + 列账号端点（不带 token 会返回 401，能看到接口存在即可）"
curl -s -X POST -H "Host: home.1008086.xyz" -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Cmcc2026!"}' \
  http://127.0.0.1/api/admin/login | head -c 300; echo

ok "完成。浏览器去 home.1008086.xyz 登录（用户 admin / 你之前设的密码），应能看到 211 个账号"

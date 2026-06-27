#!/usr/bin/env bash
set +e
ROOT="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }
cd "$ROOT" || exit 1

sep "0. 安全先备份当前 docker 55432 数据（以防万一）"
TS=$(date +%Y%m%d-%H%M%S)
mkdir -p backups/before-rollback
docker exec cmcc-cookie-app-postgres pg_dump -U cmcc_user cmcc_cookie_app | gzip > "backups/before-rollback/docker-$TS.sql.gz"
ok "docker PG 已备份到 backups/before-rollback/docker-$TS.sql.gz"

sep "1. 在 brew PG 上创建专用账号 cmcc_user（如不存在）+ 授权"
NEW_PASS=$(openssl rand -hex 16)
# brew PG superuser 是 ZevinGunn，可以无密码 socket 登录
psql -U "$USER" -d postgres <<SQL
DO
\$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='cmcc_user') THEN
    CREATE ROLE cmcc_user LOGIN PASSWORD '$NEW_PASS';
  ELSE
    ALTER ROLE cmcc_user WITH LOGIN PASSWORD '$NEW_PASS';
  END IF;
END
\$\$;
GRANT ALL PRIVILEGES ON DATABASE cmcc_cookie_app TO cmcc_user;
SQL

# 进库再授 schema/表的权限
psql -U "$USER" -d cmcc_cookie_app <<SQL
GRANT ALL ON SCHEMA public TO cmcc_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO cmcc_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO cmcc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cmcc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cmcc_user;
SQL

# 同时也创建 cmcc_credentials 库（项目要用到，存登录凭据）
psql -U "$USER" -d postgres -c "CREATE DATABASE cmcc_credentials OWNER cmcc_user;" 2>&1 | tail -3
psql -U "$USER" -d cmcc_credentials <<SQL
GRANT ALL ON SCHEMA public TO cmcc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cmcc_user;
SQL
ok "cmcc_user 已建/重置；cmcc_credentials 库已建"

sep "2. TCP+密码连通性自测（5432）"
PGPASSWORD="$NEW_PASS" psql -h 127.0.0.1 -p 5432 -U cmcc_user -d cmcc_cookie_app \
  -c "select 'Account 行数', COUNT(*) FROM \"Account\";" 2>&1 | tail -6

sep "3. 改 .env / .env.production 的 DATABASE_URL 回 5432"
NEW_URL="postgresql://cmcc_user:${NEW_PASS}@127.0.0.1:5432/cmcc_cookie_app?schema=public"
for f in .env .env.production; do
  [ -f "$f" ] || continue
  cp "$f" "$f.bak-rollback.$TS"
  python3 - "$f" "$NEW_URL" <<'PY'
import sys, re
p, url = sys.argv[1], sys.argv[2]
s = open(p).read()
if re.search(r'^DATABASE_URL=', s, re.M):
    s = re.sub(r'^DATABASE_URL=.*$', f'DATABASE_URL="{url}"', s, flags=re.M)
else:
    s = s.rstrip() + f'\nDATABASE_URL="{url}"\n'
open(p, 'w').write(s)
print(f'  {p} 已切回 5432')
PY
done

sep "4. 看缺哪些 prisma 迁移（brew 库可能没新迁移）"
DATABASE_URL="$NEW_URL" npx prisma migrate status 2>&1 | tail -25

sep "5. 应用 prisma migrate deploy（只补缺失迁移，不丢数据）"
DATABASE_URL="$NEW_URL" npx prisma migrate deploy 2>&1 | tail -15

sep "6. 重启 cookie-app（彻底删 + 重建进程）"
PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix)/bin/pm2
"$PM2" delete cookie-app 2>&1 | tail -3
"$PM2" start "$HOME/CMCC-PROJECT/_部署方案/ecosystem.config.cjs" --only cookie-app
"$PM2" save
sleep 7

sep "7. cookie-app 日志（确认无 Authentication failed）"
"$PM2" logs cookie-app --lines 25 --nostream 2>/dev/null | tail -30

sep "8. /api/health"
curl -s -H "Host: home.1008086.xyz" http://127.0.0.1/api/health | head -c 300; echo

echo
ok "完成。浏览器刷新 home.1008086.xyz，55 个账号应该都回来"
echo "  如要登录，用刚才你设的密码（或重新跑 reset-admin-pwd.sh）"

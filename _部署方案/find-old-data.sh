#!/usr/bin/env bash
set +e
ROOT="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

sep "1. Brew PG (5432) 上有哪些数据库"
psql -h 127.0.0.1 -p 5432 -U "$USER" -d postgres -c "\l" 2>&1 | head -20
echo
echo "  -- 用 cmcc_app 用户试连 cmcc_cookie_app --"
psql -h 127.0.0.1 -p 5432 -U cmcc_app -d cmcc_cookie_app -c "\dt" 2>&1 | head -25

sep "2. Brew PG 上若有 Account 表，统计一下条数"
for DB in cmcc_cookie_app cmcc_cookie_app_prod cookie_app cookie-app; do
  echo "  尝试 DB=$DB ..."
  for U in "$USER" cmcc_user cmcc_app; do
    n=$(psql -h 127.0.0.1 -p 5432 -U "$U" -d "$DB" -tA -c "SELECT COUNT(*) FROM \"Account\"" 2>/dev/null)
    if [ -n "$n" ]; then
      echo "    DB=$DB user=$U Account 行数 = $n"
    fi
  done
done

sep "3. Docker volumes"
docker volume ls 2>/dev/null | grep -i -E "postgres|cookie|cmcc"

sep "4. Docker PG (55432) 现状"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app -c "SELECT COUNT(*) FROM \"Account\"" 2>&1 | tail -5

sep "5. 项目 backups 目录"
ls -lh "$ROOT/backups" 2>/dev/null
find "$ROOT/backups" -type f 2>/dev/null | head -10

sep "6. 项目 data 目录（早期可能有 SQLite）"
ls -lh "$ROOT/data" 2>/dev/null
find "$ROOT/data" -type f -name "*.db" -o -name "*.sqlite*" -o -name "*.json" 2>/dev/null | head -10

sep "7. 全盘扫 .sql 备份"
find "$ROOT" -type f \( -name "*.sql" -o -name "*.sql.gz" -o -name "*.dump" \) 2>/dev/null | head -20

sep "8. 历史 cookie-app PM2 日志看启动时连的什么库"
"$HOME/.nvm/versions/node/v18.20.8/bin/pm2" logs cookie-app --lines 50 --nostream 2>/dev/null | grep -iE "Server ready|database|prisma" | tail -10

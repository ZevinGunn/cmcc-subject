#!/usr/bin/env bash
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }

sep "1. brew PG cmcc_cookie_app 里所有 schema 和表"
psql -U "$USER" -d cmcc_cookie_app -c "
SELECT n.nspname AS schema, c.relname AS table, c.reltuples::bigint AS approx_rows
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind='r' AND n.nspname NOT IN ('pg_catalog','information_schema')
ORDER BY n.nspname, c.relname;"

sep "2. brew PG cmcc_cookie_app 各表精确 COUNT（仅 Account/AdminUser）"
psql -U "$USER" -d cmcc_cookie_app -c "
DO \$\$
DECLARE
  r RECORD;
  cnt BIGINT;
BEGIN
  FOR r IN
    SELECT n.nspname AS schema, c.relname AS tab
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind='r' AND c.relname IN ('Account','AdminUser','User','UserSession')
  LOOP
    EXECUTE format('SELECT COUNT(*) FROM %I.%I', r.schema, r.tab) INTO cnt;
    RAISE NOTICE '%.%  = % rows', r.schema, r.tab, cnt;
  END LOOP;
END\$\$;
" 2>&1 | tail -20

sep "3. brew PG 另一个库 'cmcc' 里有什么"
psql -U "$USER" -d cmcc -c "
SELECT n.nspname AS schema, c.relname AS table
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind='r' AND n.nspname NOT IN ('pg_catalog','information_schema')
ORDER BY n.nspname, c.relname;" 2>&1 | head -30

sep "4. 'cmcc' 库 Account 行数"
psql -U "$USER" -d cmcc -c "SELECT COUNT(*) AS account_rows FROM \"Account\";" 2>&1
psql -U "$USER" -d cmcc -c "SELECT COUNT(*) AS account_rows FROM \"public\".\"Account\";" 2>&1

sep "5. docker PG cmcc_cookie_app Account 行数 + 最新记录时间"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app -c "
SELECT COUNT(*) AS rows,
       MAX(\"createdAt\") AS latest_created,
       MAX(\"updatedAt\") AS latest_updated
FROM \"Account\";" 2>&1 | tail -8

sep "6. brew PG cmcc_cookie_app Account 最新记录时间"
psql -U "$USER" -d cmcc_cookie_app -c "
SELECT COUNT(*) AS rows,
       MAX(\"createdAt\") AS latest_created,
       MAX(\"updatedAt\") AS latest_updated
FROM \"Account\";" 2>&1

sep "7. brew PG cmcc 里 Account 最新记录（如果有）"
psql -U "$USER" -d cmcc -c "
SELECT COUNT(*) AS rows,
       MAX(\"createdAt\") AS latest_created,
       MAX(\"updatedAt\") AS latest_updated
FROM \"Account\";" 2>&1

sep "8. data/cmcc-accounts.json 条数"
python3 -c "
import json
d = json.load(open('$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app/data/cmcc-accounts.json'))
print('  type:', type(d).__name__)
if isinstance(d, list): print('  list len =', len(d))
elif isinstance(d, dict):
    for k,v in d.items():
        if isinstance(v, list): print(f'  {k}: list of {len(v)}')
        else: print(f'  {k}: {type(v).__name__}')
" 2>&1

sep "9. 备份里最大的那个 SQL.gz 里有多少 Account（解压抽取统计）"
for f in "$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app/backups/development/legacy"/*.sql.gz \
         "$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app/backups/development"/*.sql.gz; do
  [ -f "$f" ] || continue
  echo "  -- $(basename "$f") --"
  printf "    Account INSERT 行数: "
  gzcat "$f" 2>/dev/null | grep -E "^(INSERT INTO )?\"?(public\.)?Account\"?" | wc -l | tr -d ' '
  echo
done

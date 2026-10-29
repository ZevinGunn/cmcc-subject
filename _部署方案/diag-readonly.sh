#!/usr/bin/env bash
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ROOT="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"

sep "1. brew PG 全局状态（是否 standby、recovery）"
psql -U "$USER" -d postgres -c "SHOW transaction_read_only; SELECT pg_is_in_recovery();" 2>&1

sep "2. 集群级 / 数据库级 / 角色级 default_transaction_read_only 设置"
psql -U "$USER" -d postgres -c "
SELECT name, setting, source FROM pg_settings WHERE name LIKE '%read_only%';
" 2>&1
echo
psql -U "$USER" -d postgres -c "
SELECT d.datname, s.setconfig
FROM pg_db_role_setting s
JOIN pg_database d ON d.oid = s.setdatabase
WHERE 'default_transaction_read_only=on' = ANY(s.setconfig);" 2>&1
echo
psql -U "$USER" -d postgres -c "
SELECT r.rolname, s.setconfig
FROM pg_db_role_setting s
JOIN pg_roles r ON r.oid = s.setrole
WHERE r.rolname='cmcc_user';" 2>&1

sep "3. cmcc_user 当前角色属性"
psql -U "$USER" -d postgres -c "\du cmcc_user" 2>&1

sep "4. cmcc_credentials 库 owner、属性"
psql -U "$USER" -d postgres -c "\l cmcc_credentials" 2>&1
psql -U "$USER" -d cmcc_credentials -c "\dt" 2>&1 | head -20

sep "5. 用 cmcc_user 走 TCP 在 cmcc_credentials 上试一次 CREATE / DROP"
PW=$(grep -E "^DATABASE_URL=" "$ROOT/.env" | sed -E 's|^DATABASE_URL=.*://cmcc_user:([^@]+)@.*$|\1|' | tr -d '"')
PGPASSWORD="$PW" psql -h 127.0.0.1 -p 5432 -U cmcc_user -d cmcc_credentials -c "
CREATE TABLE _diag_readonly_test (id int);
DROP TABLE _diag_readonly_test;
" 2>&1

sep "6. 同样在 cmcc_cookie_app 上"
PGPASSWORD="$PW" psql -h 127.0.0.1 -p 5432 -U cmcc_user -d cmcc_cookie_app -c "
CREATE TABLE _diag_readonly_test (id int);
DROP TABLE _diag_readonly_test;
" 2>&1

sep "7. 当前 .env DATABASE_URL（脱敏）+ derive 出的 credentials"
grep "^DATABASE_URL=" "$ROOT/.env" | sed 's|:[^:@]*@|:<PWD>@|'

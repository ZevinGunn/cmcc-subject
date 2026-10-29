#!/usr/bin/env bash
set +e
ROOT="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

cd "$ROOT" || exit 1

sep "1. 看 .env / .env.production 里现有 DATABASE_URL 相关配置"
grep -nE "^(DATABASE_URL|CREDENTIALS_DATABASE_URL|POSTGRES_)" .env .env.production 2>/dev/null \
  | sed 's|:[^:@]*@|:<PWD>@|g'

sep "2. 看 derive credentials db 的逻辑"
grep -n "deriveCredentialsDatabaseUrl\|CREDENTIALS_DATABASE_URL\|credentials_db" api/services/runtimeConfig.ts 2>/dev/null | head -20

# 找 derive 函数定义
sep "3. derive 函数定义"
grep -rn "function deriveCredentialsDatabaseUrl\|deriveCredentialsDatabaseUrl =" api/ 2>/dev/null | head -5

sep "4. docker PG 里有哪些库"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -l 2>&1 | head -20

sep "5. 看 schema 是否有 credentials 相关表"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app -c "\dt" 2>&1 | head -30

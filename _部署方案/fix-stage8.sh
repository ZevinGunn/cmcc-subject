#!/usr/bin/env bash
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

sep "1. 谁在监听 5432"
lsof -nP -iTCP:5432 -sTCP:LISTEN
echo
ps aux | grep -E "[p]ostgres" | head -10

sep "2. 看 docker 里 PG 端口映射真实端口（容器侧 5432 实际绑到 Mac 哪个口）"
docker port cmcc-cookie-app-postgres 2>/dev/null
docker ps --format '{{.Names}} | {{.Ports}}' | grep -i postgres

sep "3. 看 brew 装的 PG 服务"
brew services list 2>/dev/null | grep -i postgres
which postgres pg_ctl 2>/dev/null

sep "4. 两个 PG 各自的用户列表"
echo "-- docker PG --"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app -c "\du" 2>&1 | head -10
echo "-- 127.0.0.1:5432 PG --"
psql -h 127.0.0.1 -p 5432 -U "$USER" -d postgres -c "\du" 2>&1 | head -10

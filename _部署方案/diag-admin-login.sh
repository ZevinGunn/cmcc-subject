#!/usr/bin/env bash
ROOT="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }

sep "1. 管理员登录路由文件"
grep -rn "admin/login\|adminLogin\|管理员" "$ROOT/api/routes" "$ROOT/api/services" 2>/dev/null | head -20

sep "2. AdminUser 表结构"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app -c "\d \"AdminUser\"" 2>&1 | head -30

sep "3. 现有 AdminUser 数据（不打印密码 hash 完整内容）"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app -c "
SELECT id, username, left(\"passwordHash\", 20) as hash_prefix, \"createdAt\"
FROM \"AdminUser\";" 2>&1

sep "4. 找哈希算法（bcrypt / argon2 / scrypt / sha-…）"
grep -rn "bcrypt\|argon2\|scrypt\|passwordHash\|hashPassword\|verifyPassword" "$ROOT/api" 2>/dev/null | grep -v "node_modules" | head -25

sep "5. 找种子 / seed 脚本"
grep -rn "AdminUser\.create\|createAdmin\|seedAdmin" "$ROOT/api" "$ROOT/prisma" 2>/dev/null | head -10

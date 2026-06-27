#!/usr/bin/env bash
# 用法：bash reset-admin-pwd.sh <新密码>
set +e
NEW_PWD="$1"
if [ -z "$NEW_PWD" ]; then
  echo "用法: bash $0 <新密码>"; exit 1
fi
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }

sep "1. 用项目自带的 scrypt 算法生成新 hash"
HASH=$(node --input-type=module -e "
import crypto from 'node:crypto';
const password = process.argv[1];
const salt = crypto.randomBytes(16).toString('base64');
const derived = crypto.scryptSync(password, salt, 64).toString('base64');
console.log('scrypt\$' + salt + '\$' + derived);
" "$NEW_PWD")

case "$HASH" in
  scrypt\$*) ok "新 hash 前缀：$(printf '%s' "$HASH" | cut -c1-18)..." ;;
  *) echo "hash 生成失败：$HASH"; exit 1 ;;
esac

sep "2. UPDATE AdminUser 表"
# 用 stdin 把 SQL 喂给 psql，避免特殊字符转义
docker exec -i cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app <<SQL
UPDATE "AdminUser"
SET "passwordHash" = '${HASH}',
    "updatedAt" = NOW(),
    "disabledAt" = NULL
WHERE username = 'admin';
SQL

sep "3. 验证"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app -c "
SELECT username, left(\"passwordHash\", 20) AS hash_prefix, \"updatedAt\", \"disabledAt\"
FROM \"AdminUser\" WHERE username='admin';"

sep "4. /api/admin/login 调一次"
curl -s -X POST -H "Host: home.1008086.xyz" -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"${NEW_PWD}\"}" \
  http://127.0.0.1/api/admin/login | head -c 400
echo
echo
echo "  ↑ 返回 {\"ok\":true,...} 即成功；如果 404，告诉我，我换端点"

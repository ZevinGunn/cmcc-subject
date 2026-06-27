#!/usr/bin/env bash
set +e
ROOT="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

cd "$ROOT" || exit 1

sep "1. 列出所有 .env*.bak* 备份（按时间倒序）"
ls -lt .env*.bak* 2>/dev/null | head -20

sep "2. 各备份里出现过的 CMCC_DB_ENCRYPTION_KEY 值（去重）"
for f in .env*.bak* .env.production .env; do
  [ -f "$f" ] || continue
  KEY=$(grep -E "^CMCC_DB_ENCRYPTION_KEY=" "$f" | sed -E 's/^CMCC_DB_ENCRYPTION_KEY=//' | tr -d '"' | tr -d "'" )
  if [ -n "$KEY" ]; then
    HASH=$(echo -n "$KEY" | md5)
    LEN=$(echo -n "$KEY" | wc -c | tr -d ' ')
    MTIME=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" "$f" 2>/dev/null)
    printf "  %s  len=%s  md5=%s  在 %s\n" "$MTIME" "$LEN" "${HASH:0:10}" "$f"
  fi
done

sep "3. 在 docker PG 里看 Account.cookieEnc 一条样本（截前 30 字符）"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app -c "
SELECT id, left(\"cookieEnc\", 30) AS cookie_prefix
FROM \"Account\" WHERE \"cookieEnc\" IS NOT NULL LIMIT 3;" 2>&1

echo
echo "============================================"
echo "  接下来要做：从上面 #2 里挑「最早出现的那个 md5」"
echo "  那是你的原始密钥。我会自动选最早 mtime 的那个还原。"
echo "============================================"

sep "4. 自动还原：用最早 .env.production.bak* 里的 CMCC_DB_ENCRYPTION_KEY"
OLDEST_BAK=$(ls -tr .env.production.bak* 2>/dev/null | head -1)
if [ -z "$OLDEST_BAK" ]; then
  bad "没找到 .env.production.bak* 备份"; exit 1
fi
OLD_KEY=$(grep -E "^CMCC_DB_ENCRYPTION_KEY=" "$OLDEST_BAK" | sed -E 's/^CMCC_DB_ENCRYPTION_KEY=//' | tr -d '"' | tr -d "'")
echo "  选用备份：$OLDEST_BAK"
echo "  旧 KEY md5：$(echo -n "$OLD_KEY" | md5 | cut -c1-10)"

if [ "$OLD_KEY" = "base64-32-bytes" ]; then
  bad "最早备份里 KEY 还是占位符，需要查更早历史。退出。"
  exit 1
fi

# 写回 .env / .env.production
for f in .env .env.production; do
  [ -f "$f" ] || continue
  cp "$f" "$f.bak.beforerestore.$(date +%s)"
  python3 - "$f" "$OLD_KEY" <<'PY'
import sys, re
p, k = sys.argv[1], sys.argv[2]
s = open(p).read()
if re.search(r'^CMCC_DB_ENCRYPTION_KEY=', s, re.M):
    s = re.sub(r'^CMCC_DB_ENCRYPTION_KEY=.*$', f'CMCC_DB_ENCRYPTION_KEY="{k}"', s, flags=re.M)
else:
    s = s.rstrip() + f'\nCMCC_DB_ENCRYPTION_KEY="{k}"\n'
open(p, 'w').write(s)
print(f'  {p} 已恢复旧 KEY')
PY
done

sep "5. 重启 cookie-app（--update-env）"
PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix)/bin/pm2
"$PM2" delete cookie-app 2>&1 | tail -3
"$PM2" start "$HOME/CMCC-PROJECT/_部署方案/ecosystem.config.cjs" --only cookie-app
"$PM2" save
sleep 7

sep "6. /api/health"
curl -s -H "Host: home.1008086.xyz" http://127.0.0.1/api/health | head -c 200; echo

sep "7. 触发 /api/accounts（带 admin cookie）"
CJ=$(mktemp)
curl -s -c "$CJ" -H "Host: home.1008086.xyz" -H "Content-Type: application/json" \
  -X POST -d '{"username":"admin","password":"'"${ADMIN_PWD:-Cmcc2026!}"'"}' \
  http://127.0.0.1/api/admin/login > /dev/null
curl -s -b "$CJ" -H "Host: home.1008086.xyz" \
  -o /tmp/r.json -w "  HTTP %{http_code}\n" http://127.0.0.1/api/accounts
head -c 500 /tmp/r.json; echo
rm -f "$CJ"

ok "完成。如返回 200/正确 json，浏览器刷新就能看到 211 个账号"

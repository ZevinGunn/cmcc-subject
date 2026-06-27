#!/usr/bin/env bash
# 用法：bash try-key.sh         # 把 .env.production 改成 .env 里的 KEY（默认）
#       bash try-key.sh <key>   # 显式指定一个 KEY（base64 字串）
set +e
ROOT="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
cd "$ROOT" || exit 1

CAND_KEY="$1"
if [ -z "$CAND_KEY" ]; then
  CAND_KEY=$(grep -E "^CMCC_DB_ENCRYPTION_KEY=" .env | sed -E 's/^CMCC_DB_ENCRYPTION_KEY=//' | tr -d '"' | tr -d "'")
fi
if [ -z "$CAND_KEY" ]; then
  echo "无 KEY"; exit 1
fi
echo "  本次尝试 KEY md5: $(echo -n "$CAND_KEY" | md5 | cut -c1-10)  len=${#CAND_KEY}"

sep "1. 备份并把两个 .env 都设成同一 KEY"
for f in .env .env.production; do
  [ -f "$f" ] || continue
  cp "$f" "$f.bak.trykey.$(date +%s)"
  python3 - "$f" "$CAND_KEY" <<'PY'
import sys, re
p, k = sys.argv[1], sys.argv[2]
s = open(p).read()
if re.search(r'^CMCC_DB_ENCRYPTION_KEY=', s, re.M):
    s = re.sub(r'^CMCC_DB_ENCRYPTION_KEY=.*$', f'CMCC_DB_ENCRYPTION_KEY="{k}"', s, flags=re.M)
else:
    s = s.rstrip() + f'\nCMCC_DB_ENCRYPTION_KEY="{k}"\n'
open(p, 'w').write(s)
print(f'  {p} 已写入')
PY
done

sep "2. 重启 cookie-app"
PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix)/bin/pm2
"$PM2" delete cookie-app 2>&1 | tail -3
"$PM2" start "$HOME/CMCC-PROJECT/_部署方案/ecosystem.config.cjs" --only cookie-app
"$PM2" save
sleep 7

sep "3. 触发 /api/accounts"
CJ=$(mktemp)
curl -s -c "$CJ" -H "Host: home.1008086.xyz" -H "Content-Type: application/json" \
  -X POST -d '{"username":"admin","password":"'"${ADMIN_PWD:-Cmcc2026!}"'"}' \
  http://127.0.0.1/api/admin/login > /dev/null
curl -s -b "$CJ" -H "Host: home.1008086.xyz" \
  -o /tmp/r.json -w "  HTTP %{http_code}\n" http://127.0.0.1/api/accounts
echo "  body 前 600 字符："
head -c 600 /tmp/r.json
echo
echo
ERR=$(cat /tmp/r.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('message',''))" 2>/dev/null)
case "$ERR" in
  *Unsupported*|*authenticate*) echo "  ✗ 密钥还是错的"; exit 2 ;;
  "") echo "  ✓ 解析正常，看 body 是否有数据" ;;
  *) echo "  其他错误：$ERR" ;;
esac
rm -f "$CJ"

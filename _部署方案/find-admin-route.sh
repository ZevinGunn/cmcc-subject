#!/usr/bin/env bash
set +e
ROOT="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }

sep "1. accounts 路由所有定义"
grep -rn "router\.\(get\|post\|put\|delete\)\|\.use(" "$ROOT/api/routes" 2>/dev/null | grep -iE "account" | head -30

sep "2. app.ts 注册路由（看 prefix）"
grep -n "use\(.*routes\|admin\|account\)" "$ROOT/api/app.ts" 2>/dev/null | head -20

sep "3. accounts 路由文件第一屏"
head -100 "$ROOT/api/routes/accounts.ts" 2>/dev/null

sep "4. 看 Home.tsx 加载账号列表那段（不是 delete/refresh）"
grep -nE "apiFetch|fetchAccounts|loadAccounts|setAccounts|/api/accounts" "$ROOT/src/pages/Home.tsx" 2>/dev/null | head -20

sep "5. 看 admin 路由有哪些"
ls "$ROOT/api/routes/"
grep -nE "router\.\(get\|post\)" "$ROOT/api/routes/admin.ts" 2>/dev/null | head -30

sep "6. cookie-app 当前最新 15 行（仅这次重启之后）"
PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix)/bin/pm2
"$PM2" logs cookie-app --lines 15 --nostream 2>/dev/null | grep -v "out\.log\|error\.log\|TAILING" | tail -20

sep "7. 浏览器 DevTools Network 里到底打的什么 URL（你看一下并告诉我）"
echo "  打开 home.1008086.xyz，F12 → Network 标签，刷新页面"
echo "  找列账号那个请求，看 Request URL 是不是真的 /api/accounts"
echo "  如果是 /api/admin/xxx 之类，告诉我端点名"

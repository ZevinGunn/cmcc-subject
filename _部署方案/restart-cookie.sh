#!/usr/bin/env bash
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix 2>/dev/null)/bin/pm2

sep "1. 重启 cookie-app（tsx 直接运行 ts，不需要 build）"
"$PM2" restart cookie-app --update-env
sleep 6
"$PM2" status | grep -E "name|cookie-app|---" | head -5

sep "2. 看启动后日志（确认没启动错误，新代码生效）"
"$PM2" logs cookie-app --lines 25 --nostream 2>/dev/null | tail -30

sep "3. /api/health"
curl -s -H "Host: home.1008086.xyz" http://127.0.0.1/api/health | head -c 200; echo

sep "4. 检查 unhandledRejection / safeUpdate 是否在新代码中生效"
echo "  现在重启后，如果再次发生 P2025（batchTaskItem.update on deleted record），"
echo "  你会在日志看到 '[batchTasks][safeUpdate] xxx skipped: record gone (P2025)'"
echo "  而进程不会再崩，接口不会再 502。"

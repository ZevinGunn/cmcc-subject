#!/usr/bin/env bash
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }

PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix 2>/dev/null)/bin/pm2

sep "1. cookie-app 详细状态（看 restart 次数 + 最近一次 exit 原因）"
"$PM2" describe cookie-app 2>/dev/null | head -50

sep "2. cookie-app 最近 200 行 error 日志（找崩溃堆栈）"
"$PM2" logs cookie-app --lines 200 --nostream --err 2>/dev/null | tail -120

sep "3. cookie-app 重启时间点（从 pm2 日志推断）"
echo "  -- 看 out.log 里 'Server ready' / 'SIGTERM' 出现时间 --"
grep -nE "Server ready|SIGTERM|SIGKILL|signal received|uncaughtException|UnhandledPromise" \
  $HOME/.pm2/logs/cookie-app-out.log $HOME/.pm2/logs/cookie-app-error.log 2>/dev/null | tail -40

sep "4. cloudflared 最近 100 行 错误日志（找 502 / origin error 时间点）"
sudo tail -300 /Library/Logs/com.cloudflare.cloudflared.err.log 2>/dev/null | \
  grep -E "Unable to reach|connection refused|origin|502|error" | tail -30

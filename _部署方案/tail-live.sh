#!/usr/bin/env bash
# 实时跟踪 cookie-app 错误日志 30 秒；这期间你刷新浏览器 home.1008086.xyz
PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix)/bin/pm2

# 用文件而不是 pm2 logs，避免 buffer 干扰
OUT=/Users/ZevinGunn/.pm2/logs/cookie-app-out.log
ERR=/Users/ZevinGunn/.pm2/logs/cookie-app-error.log

echo "============================================"
echo "  现在开始 30 秒实时日志，请在浏览器刷新 home.1008086.xyz"
echo "============================================"
echo
tail -n 0 -F "$OUT" "$ERR" &
TPID=$!
sleep 30
kill $TPID 2>/dev/null
echo
echo "============================================"
echo "  日志结束。如果上面有 prisma:error 或 SERVER_ERROR，告诉我"
echo "============================================"

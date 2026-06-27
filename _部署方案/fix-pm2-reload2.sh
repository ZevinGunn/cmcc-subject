#!/usr/bin/env bash
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

# 1. 把 nvm 路径 + Homebrew bin 都加进 PATH，确保 npm/pm2 都能找到
export PATH="$HOME/.nvm/versions/node/v18.20.8/bin:/opt/homebrew/bin:$PATH"

sep "1. node/npm 路径与版本"
which node npm
node -v
npm -v
NPM_PREFIX=$(npm config get prefix)
echo "  npm 全局前缀: $NPM_PREFIX"

sep "2. 装/补 pm2 到当前 node"
npm i -g pm2 2>&1 | tail -5
PM2="$NPM_PREFIX/bin/pm2"
ls -la "$PM2" 2>&1
"$PM2" -v

sep "3. pm2 update（让 daemon 用同步版本）"
"$PM2" update 2>&1 | tail -10

sep "4. 销毁 cookie-app 旧进程"
"$PM2" delete cookie-app 2>&1 | tail -3

sep "5. 重新拉起 cookie-app（fresh process，拿最新 .env）"
"$PM2" start "$HOME/CMCC-PROJECT/_部署方案/ecosystem.config.cjs" --only cookie-app
"$PM2" save
sleep 7

sep "6. pm2 status"
"$PM2" status

sep "7. cookie-app 最近 30 行日志（看是否还有 P1000）"
"$PM2" logs cookie-app --lines 30 --nostream 2>/dev/null | tail -40

sep "8. /api/health"
curl -s -H "Host: home.1008086.xyz" http://127.0.0.1/api/health | head -c 200; echo

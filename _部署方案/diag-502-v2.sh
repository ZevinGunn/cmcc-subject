#!/usr/bin/env bash
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix 2>/dev/null)/bin/pm2

sep "1. nginx 80 端口监听？"
sudo lsof -nP -iTCP:80 -sTCP:LISTEN | head -5
ps aux | grep -E "[n]ginx" | head -3

sep "2. cookie-app pm2 状态 + 3101 端口"
"$PM2" status | grep -E "cookie-app|name" | head -3
lsof -nP -iTCP:3101 -sTCP:LISTEN | head -3

sep "3. 本机直连 nginx → cookie-app 路径"
curl -s -o /dev/null -w "本机 Host->nginx -> %{http_code}\n" --max-time 3 \
  -H "Host: home.1008086.xyz" http://127.0.0.1/api/health
curl -s -o /dev/null -w "本机直连 cookie-app  -> %{http_code}\n" --max-time 3 \
  http://127.0.0.1:3101/api/health
curl -s -o /dev/null -w "本机 cookie-app sms -> %{http_code}\n" --max-time 3 \
  -X POST http://127.0.0.1:3101/api/accounts/4999cfb588423f135acffa1e480eb9ad28340ad6246958279f40be677f411eb2/sms/send \
  -H "Content-Type: application/json" -d '{"phone":"13800138000"}'

sep "4. 实时跟踪 cookie-app + cloudflared 错误日志 30 秒"
echo "  >>>>>> 你现在去浏览器，再点一次发送验证码 <<<<<<"
echo

(tail -F -n 0 \
  "$HOME/.pm2/logs/cookie-app-out.log" \
  "$HOME/.pm2/logs/cookie-app-error.log" 2>/dev/null) &
P1=$!
(sudo tail -F -n 0 \
  /Library/Logs/com.cloudflare.cloudflared.err.log \
  /Library/Logs/com.cloudflare.cloudflared.out.log 2>/dev/null) &
P2=$!
(sudo tail -F -n 0 /opt/homebrew/var/log/nginx/error.log 2>/dev/null) &
P3=$!

sleep 30
kill $P1 $P2 $P3 2>/dev/null

sep "5. 触发后再看 nginx error.log 最近 20 行"
sudo tail -20 /opt/homebrew/var/log/nginx/error.log

sep "6. cookie-app 最近 20 行 error 日志"
"$PM2" logs cookie-app --lines 20 --nostream --err 2>/dev/null | tail -25

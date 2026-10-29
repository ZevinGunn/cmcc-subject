#!/usr/bin/env bash
set +e
ROOT="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }

sep "1. 实时跟踪 cookie-app + cloudflared 日志 50s"
echo "  你在浏览器触发那个 10086 send 验证码接口"
PM2_LOG="$HOME/.pm2/logs/cookie-app-out.log"
PM2_ERR="$HOME/.pm2/logs/cookie-app-error.log"
CF_OUT="/Library/Logs/com.cloudflare.cloudflared.out.log"
CF_ERR="/Library/Logs/com.cloudflare.cloudflared.err.log"

(tail -F -n 0 "$PM2_LOG" "$PM2_ERR" 2>/dev/null) &
P1=$!
(sudo tail -F -n 0 "$CF_OUT" "$CF_ERR" 2>/dev/null) &
P2=$!
sleep 50
kill $P1 $P2 2>/dev/null

sep "2. nginx 错误日志最近 50 行"
sudo tail -n 80 /opt/homebrew/var/log/nginx/error.log 2>/dev/null | tail -40

sep "3. 看 cookie-app 10086 send 接口源码（端点路径 + 调用上游超时）"
grep -rn "send-code\|sendCode\|send-sms\|10086.*send\|/login/sms\|sms/send" "$ROOT/api/routes" 2>/dev/null | head -10
grep -rn "smsLogin\|cmcc.*send\|smsService" "$ROOT/api/services" 2>/dev/null | head -10

sep "4. 看 fetch / axios 超时设置"
grep -rn "timeout\|AbortController\|fetch(" "$ROOT/api/services" 2>/dev/null | grep -iE "timeout|abort" | head -20

sep "5. 当前 nginx 转发超时配置"
sudo nginx -T 2>/dev/null | grep -E "proxy_(read|send|connect)_timeout|client_max_body_size|server_name home" | head -20

sep "6. cloudflared 当前 config（超时相关）"
sudo cat /etc/cloudflared/config.yml | head -30
echo
echo "  cloudflared 默认 connectTimeout=30s, tlsTimeout=10s, tcpKeepAlive=30s, http2Origin=false"

sep "7. 试试本机直接走 nginx → cookie-app（绕过 cloudflared）测同一个接口"
echo "  你直接 curl 试试，比如："
echo "  curl -i -H 'Host: home.1008086.xyz' http://127.0.0.1/api/auth/sms/send -X POST -d 'phone=...'"
echo "  如果本机直连不报错 → 问题在 cloudflared 链路超时"
echo "  如果本机直连也报错 → 问题在 cookie-app 上游"

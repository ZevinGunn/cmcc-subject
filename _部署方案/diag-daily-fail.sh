#!/usr/bin/env bash
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix 2>/dev/null)/bin/pm2

sep "1. Mac 睡眠 / 唤醒事件最近 24 小时（关键证据）"
log show --predicate 'eventMessage CONTAINS "Wake reason" or eventMessage CONTAINS "Sleep" or subsystem == "com.apple.kernel" AND eventMessage CONTAINS "PMSetSleep"' \
  --info --last 24h 2>/dev/null | grep -iE "sleep|wake reason" | head -25

sep "2. pmset 当前睡眠配置（是否会自动睡）"
pmset -g | grep -iE "sleep|displaysleep|disksleep|hibernatemode|powernap|ttyskeepawake|standby"

sep "3. cookie-app 最近 50 行错误日志（找 fetch failed / invalid JSON）"
"$PM2" logs cookie-app --lines 100 --nostream 2>/dev/null | grep -iE "fetch failed|ECONNRESET|ETIMEDOUT|EAI_AGAIN|ENOTFOUND|ECONNREFUSED|ssl|TLS|invalid json|JSON.parse|SyntaxError|unexpected token|unexpected end" | tail -20

sep "4. rights-backend 最近 50 行错误日志"
"$PM2" logs rights-backend --lines 100 --nostream 2>/dev/null | grep -iE "fetch failed|ECONNRESET|ETIMEDOUT|EAI_AGAIN|ENOTFOUND|ECONNREFUSED|ssl|TLS|invalid json|JSON.parse|SyntaxError|unexpected token" | tail -20

sep "5. 两个进程的内存 + uptime + restart"
"$PM2" jlist 2>/dev/null | python3 -c "
import sys, json, time
for x in json.load(sys.stdin):
    n = x['name']
    if n not in ('cookie-app','rights-backend'): continue
    e = x['pm2_env']
    up_ms = time.time()*1000 - e.get('pm_uptime',0)
    print(f\"  {n:<15} uptime={up_ms/1000/3600:.1f}h  restarts={e.get('restart_time',0)}  mem={x['monit']['memory']/1024/1024:.1f}MB  status={e['status']}\")
"

sep "6. 系统 DNS resolver 状态 & 路由可达性"
echo "  -- 解析上游 --"
for h in xcxp.bj.10086.cn wx.10086.cn qqt.cmicrwx.cn; do
  printf "  %s -> " "$h"
  dig +short +time=2 +tries=1 $h | tail -1
done
echo "  -- TCP 443 是否可达 --"
for h in xcxp.bj.10086.cn wx.10086.cn qqt.cmicrwx.cn; do
  if nc -z -w 3 $h 443 >/dev/null 2>&1; then ok "$h:443"; else bad "$h:443 不可达"; fi
done

sep "7. cookie-app 上游 HTTPS 请求是否走系统 DNS"
echo "  Node v18 fetch 默认走系统 DNS。Mac 睡眠唤醒后偶尔 mDNSResponder 还没就绪 5-15s。"
echo "  这就是 fetch failed 的常见来源。"

sep "8. fetch 调用是否带超时 / 重试（看 cookie-app cmccHttp.ts）"
ROOT="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
echo "  cmccHttp.ts 头 60 行："
head -80 "$ROOT/api/services/cmccHttp.ts" 2>/dev/null

sep "9. bj-cmcc-qy 上游调用是否带超时（bmccClient.js fetch 调用）"
ROOT2="$HOME/CMCC-PROJECT/bj-cmcc-qy"
grep -n "fetch\|timeout\|signal" "$ROOT2/backend/src/bmccClient.js" 2>/dev/null | head -10

sep "10. 最近 7 天 pm2 重启历史（找规律）"
"$PM2" logs cookie-app --lines 500 --nostream 2>/dev/null | grep -E "Server ready on port|signal received|uncaughtException|unhandledRejection" | tail -20

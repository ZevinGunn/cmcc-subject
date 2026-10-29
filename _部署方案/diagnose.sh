#!/usr/bin/env bash
# 诊断公网访问问题。在 Mac 上跑：
#   bash ~/CMCC-PROJECT/_部署方案/diagnose.sh

sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }
inf() { printf "    %s\n" "$*"; }

sep "1. nginx 进程"
PIDS=$(pgrep -x nginx)
if [ -n "$PIDS" ]; then ok "nginx 在跑：PID=$(echo $PIDS | tr '\n' ' ')"
else bad "nginx 没起来"; fi

sep "2. 80 端口监听"
L=$(sudo -n lsof -nP -iTCP:80 -sTCP:LISTEN 2>/dev/null)
if [ -z "$L" ]; then
  L=$(lsof -nP -iTCP:80 -sTCP:LISTEN 2>/dev/null)
fi
if [ -n "$L" ]; then
  echo "$L"
  if echo "$L" | awk '{print $9}' | grep -qE '\*:80|0\.0\.0\.0:80|\[::\]:80'; then
    ok "监听在所有网卡 (0.0.0.0)"
  else
    bad "只监听在 127.0.0.1，外部访问不了；nginx 配置要改 listen 80;"
  fi
else
  bad "没人监听 80"
fi

sep "3. 6 个后端端口"
for p in 3010:rights 3101:home 3000:arpu 8899:qqtlocal 3111:notic 7607:qqt; do
  port=${p%%:*}; name=${p##*:}
  if lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null 2>&1; then
    ok "$name :$port 已监听"
  else
    bad "$name :$port 未监听 — 检查 pm2 status"
  fi
done
echo "    pm2 status:"
pm2 jlist 2>/dev/null | python3 -c "import sys,json; [print('     ',x['name'],x['pm2_env']['status']) for x in json.load(sys.stdin)]" 2>/dev/null \
  || pm2 status 2>/dev/null | tail -15

sep "4. nginx 配置语法"
sudo nginx -t 2>&1 | sed 's/^/    /'

sep "5. nginx 中已加载的 server"
sudo nginx -T 2>/dev/null | awk '
  /server *{/ { in_s=1; sv=""; ls="" }
  in_s && /server_name/ { gsub(";|server_name",""); sv = sv $0 }
  in_s && /listen / { gsub(";",""); ls = ls $0 }
  in_s && /^}/ { printf "    listen:%s  name:%s\n", ls, sv; in_s=0 }
'

sep "6. 本机直连 nginx（按 Host）"
for d in home rights arpu qqtlocal notic qqt; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 -H "Host: $d.1008086.xyz" http://127.0.0.1/)
  if [ "$code" = "200" ] || [ "$code" = "304" ]; then
    ok "$d.1008086.xyz -> $code"
  else
    bad "$d.1008086.xyz -> $code"
  fi
done

sep "7. 内网 IP"
for i in en0 en1 en2 en3; do
  ip=$(ipconfig getifaddr $i 2>/dev/null)
  [ -n "$ip" ] && inf "$i = $ip"
done

sep "8. 公网 IP"
PUB=$(curl -s --max-time 5 https://api.ipify.org)
if [ -n "$PUB" ]; then ok "公网 IP = $PUB"
else bad "拿不到公网 IP（没网？）"; fi

sep "9. DNS 解析"
for d in home rights arpu qqtlocal notic qqt; do
  r=$(dig +short +time=2 +tries=1 $d.1008086.xyz | tail -1)
  if [ -n "$r" ]; then
    if [ "$r" = "$PUB" ]; then ok "$d -> $r （与公网 IP 一致）"
    else inf "$d -> $r"; fi
  else bad "$d -> 没解析记录！需要去 DNS 后台加 A/CNAME"
  fi
done

sep "10. 公网 IP 直连（绕过域名）"
if [ -n "$PUB" ]; then
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 6 http://$PUB/ || echo "TIMEOUT")
  if [ "$code" = "200" ] || [ "$code" = "304" ] || [ "$code" = "404" ]; then
    ok "公网 80 能进来：$code"
  else
    bad "公网 80 不通：$code（极可能 ISP 封 80 或路由器没转）"
  fi
fi

sep "11. 公网域名访问"
for d in home rights arpu qqtlocal notic qqt; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 6 http://$d.1008086.xyz/ || echo "TIMEOUT")
  inf "$d.1008086.xyz -> $code"
done

sep "诊断完成"
echo "把上面所有输出复制给 Claude 看。"

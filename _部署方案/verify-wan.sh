#!/usr/bin/env bash
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

sep "1. 公网 DNS 解析（阿里 + 谷歌）"
for d in home rights arpu qqtlocal notice qqt; do
  r1=$(dig +short +time=2 +tries=1 @223.5.5.5 $d.1008086.xyz | tail -1)
  r2=$(dig +short +time=2 +tries=1 @8.8.8.8   $d.1008086.xyz | tail -1)
  printf "  %-25s  阿里 -> %-16s  谷歌 -> %s\n" "$d.1008086.xyz" "$r1" "$r2"
done

sep "2. 真实公网走一遍六个域名"
for d in home rights arpu qqtlocal notice qqt; do
  code=$(curl -4 -s --noproxy '*' -o /dev/null -w '%{http_code}' --max-time 8 http://$d.1008086.xyz/)
  if [ "$code" = "200" ] || [ "$code" = "304" ]; then ok "$d.1008086.xyz -> $code"
  else bad "$d.1008086.xyz -> $code"; fi
done

sep "3. /api/health 走一遍"
for d in home rights notice; do
  printf "  %-25s -> " "$d.1008086.xyz/api/health"
  curl -4 -s --noproxy '*' --max-time 6 -o /dev/stdout -w "\n    HTTP %{http_code}\n" \
    http://$d.1008086.xyz/api/health | head -c 200
  echo
done

sep "4. PM2 / nginx 持久化状态"
pm2 jlist 2>/dev/null | python3 -c "
import sys,json
for x in json.load(sys.stdin):
    print(f\"  {x['name']:<18} {x['pm2_env']['status']:<10} pid={x['pid']}  uptime={x['pm2_env'].get('pm_uptime',0)}\")
" 2>/dev/null
brew services list 2>/dev/null | grep -E "nginx|postgres" | sed 's/^/  /'

sep "5. 开机自启提示"
echo "  pm2 startup    # 设置 pm2 开机自启（按提示运行 sudo 命令）"
echo "  brew services start nginx  # 已经 started 就不用了"

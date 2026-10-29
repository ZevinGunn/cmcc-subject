#!/usr/bin/env bash
# 强制 IPv4 测公网入站
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

sep "1. 强制 IPv4 拿公网 IP（多源对比）"
P1=$(curl -4 -s --noproxy '*' --max-time 5 https://ipv4.icanhazip.com | tr -d ' \r\n')
P2=$(curl -4 -s --noproxy '*' --max-time 5 https://api.ipify.org)
P3=$(curl -4 -s --noproxy '*' --max-time 5 https://ifconfig.me/ip)
P4=$(curl -4 -s --noproxy '*' --max-time 5 https://4.ipw.cn)
echo "    icanhazip   -> $P1"
echo "    ipify       -> $P2"
echo "    ifconfig.me -> $P3"
echo "    ipw.cn      -> $P4"
PUB=$P1; [ -z "$PUB" ] && PUB=$P2; [ -z "$PUB" ] && PUB=$P3; [ -z "$PUB" ] && PUB=$P4
if [ -n "$PUB" ]; then ok "公网 IPv4 = $PUB"
else bad "拿不到 IPv4 公网"; exit 1; fi

sep "2. 公网 IPv4 自连 80 / 443 / 8080（关键判定 ISP 是否封）"
for port in 80 443 8080; do
  code=$(curl -4 -s --noproxy '*' -o /dev/null -w '%{http_code}' --max-time 6 "http://$PUB:$port/")
  printf "    http://%s:%s/  ->  %s\n" "$PUB" "$port" "$code"
done

sep "3. 同样 IPv4 + --resolve 测 6 个域名"
for d in home rights arpu qqtlocal notic qqt; do
  code=$(curl -4 -s --noproxy '*' -o /dev/null -w '%{http_code}' --max-time 6 \
    --resolve "$d.1008086.xyz:80:$PUB" "http://$d.1008086.xyz/")
  printf "    %-25s -> %s\n" "$d.1008086.xyz" "$code"
done

sep "4. DNS 解析查缺补漏（@阿里 DNS）"
for d in home rights arpu qqtlocal notic qqt; do
  r=$(dig +short +time=2 +tries=1 @223.5.5.5 $d.1008086.xyz | tail -1)
  if [ -z "$r" ]; then bad "$d.1008086.xyz 没有 A 记录，去 DNS 后台加"
  elif [ "$r" = "$PUB" ]; then ok "$d -> $r （正确）"
  else
    printf "    %-25s -> %s （与公网IP %s 不一致，可能 DDNS 还没更新）\n" "$d" "$r" "$PUB"
  fi
done

sep "5. 路由器后台端口转发提示"
echo "    路由器： 192.168.1.1（你刚才默认网关）"
echo "    路由器需要：外网 80 → 192.168.1.2:80 (你 Mac en0 的 IP)"
echo "    Mac 内网 IP 是 192.168.1.2（建议路由器里给 Mac 做 DHCP 静态绑定）"

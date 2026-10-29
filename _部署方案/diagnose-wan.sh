#!/usr/bin/env bash
# 公网入口诊断 —— 绕开 Mac 上的代理（Clash/Surge）
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

sep "1. 当前系统代理（环境变量）"
env | grep -iE "^(http|https|all|no)_proxy" | sed 's/^/    /'
[ -z "$(env | grep -iE '^(http|https|all)_proxy')" ] && ok "没有代理环境变量"

sep "2. 用公共 DNS（不走 Clash fake-ip）查解析"
for d in home rights arpu qqtlocal notic qqt; do
  r1=$(dig +short +time=2 +tries=1 @8.8.8.8 $d.1008086.xyz | tail -1)
  r2=$(dig +short +time=2 +tries=1 @223.5.5.5 $d.1008086.xyz | tail -1)
  printf "  %-25s 8.8.8.8 -> %-18s  阿里 -> %s\n" "$d.1008086.xyz" "$r1" "$r2"
done

sep "3. 拿真实公网 IP（绕代理，多源对比）"
# --noproxy 让 curl 不走 *_proxy
P1=$(curl -s --noproxy '*' --max-time 5 https://api.ipify.org)
P2=$(curl -s --noproxy '*' --max-time 5 https://ifconfig.me/ip)
P3=$(curl -s --noproxy '*' --max-time 5 https://ipv4.icanhazip.com)
P4=$(curl -s --noproxy '*' --max-time 5 https://myip.ipip.net)
echo "    ipify        -> $P1"
echo "    ifconfig.me  -> $P2"
echo "    icanhazip    -> $P3"
echo "    ipip.net     -> $P4"

PUB=$P1; [ -z "$PUB" ] && PUB=$P2; [ -z "$PUB" ] && PUB=$P3
if [ -n "$PUB" ]; then ok "公网 IP = $PUB"
else bad "拿不到公网 IP；可能代理彻底接管了出站"; fi

sep "4. 本机 traceroute 第一跳（看默认网关）"
netstat -nr | awk '$1=="default"{print "    默认网关:",$2; exit}'

sep "5. 公网 80 自连（绕代理）"
if [ -n "$PUB" ]; then
  code=$(curl -s --noproxy '*' -o /dev/null -w '%{http_code}' --max-time 6 http://$PUB/)
  printf "    curl --noproxy http://%s/  ->  %s\n" "$PUB" "$code"
fi

sep "6. 公网域名访问（绕代理，强制带 Host）"
if [ -n "$PUB" ]; then
  for d in home rights arpu qqtlocal notic qqt; do
    code=$(curl -s --noproxy '*' -o /dev/null -w '%{http_code}' --max-time 6 \
      --resolve $d.1008086.xyz:80:$PUB http://$d.1008086.xyz/)
    printf "    %-25s -> %s\n" "$d.1008086.xyz" "$code"
  done
else
  bad "跳过：拿不到公网 IP"
fi

sep "7. 路由器+ISP 80 是否封锁判定"
# 用第三方扫端口服务（绕代理）
if [ -n "$PUB" ]; then
  # canyouseeme.org 已老旧，用 portchecker.io / yougetsignal API 等不稳；直接告诉用户怎么手动测
  echo "    用手机 4G/5G 流量浏览器访问： http://$PUB/"
  echo "    如果手机能打开，说明公网入口OK，问题在 DNS"
  echo "    如果手机也打不开，说明：①路由器没转发 80  或  ②ISP 封了 80（国内宽带最常见）"
fi

sep "8. DNS 是否被本机代理劫持（关键）"
SYS_DNS=$(scutil --dns 2>/dev/null | awk '/nameserver/{print $3; exit}')
echo "    系统当前 DNS: $SYS_DNS"
DEFAULT=$(dig +short +time=2 home.1008086.xyz | tail -1)
echo "    系统 DNS 解析 home.1008086.xyz: $DEFAULT"
if echo "$DEFAULT" | grep -qE '^198\.18\.'; then
  bad "确认本机 DNS 被代理软件劫持成 fake-ip ($DEFAULT)"
  echo "    Mac 浏览器访问这些域名时，会先被代理接管而不是直连本地 nginx"
  echo "    手机/外部设备不会受影响"
fi

echo
sep "诊断完成。把以上输出贴给 Claude。"

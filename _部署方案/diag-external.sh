#!/usr/bin/env bash
# 用外部网络服务测试你的公网入口是否真的对外暴露
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }

sep "1. 当前 DNS 解析（A 和 AAAA 分别看）"
for d in home rights arpu qqtlocal notice qqt; do
  A=$(dig +short @223.5.5.5 -t A    $d.1008086.xyz | tr '\n' ' ')
  AAAA=$(dig +short @223.5.5.5 -t AAAA $d.1008086.xyz | tr '\n' ' ')
  printf "  %-25s  A=%-18s  AAAA=%s\n" "$d.1008086.xyz" "${A:-<none>}" "${AAAA:-<none>}"
done

sep "2. 公网 IPv4"
PUB4=$(curl -4 -s --noproxy '*' --max-time 5 https://ipv4.icanhazip.com | tr -d ' \r\n')
echo "  IPv4 = $PUB4"
PUB6=$(curl -6 -s --noproxy '*' --max-time 5 https://ipv6.icanhazip.com 2>/dev/null | tr -d ' \r\n')
echo "  IPv6 = ${PUB6:-<none>}"

sep "3. 用第三方端口扫服务测 80 (外部视角)"
# portchecker.io 风格的 API（可能受墙限制，多试几个）
echo "  -- check-host.net （多节点检查，结果在网页） --"
echo "  打开浏览器：https://check-host.net/check-http?host=home.1008086.xyz"
echo "  看是否多个海外+国内节点都能拿 200"
echo
echo "  -- 在线 telnet 端口测试 --"
echo "  https://www.yougetsignal.com/tools/open-ports/  输入 $PUB4 端口 80"

sep "4. 用 IPv4 强制 curl 6 个域名（再次确认非 NAT loopback）"
for d in home rights arpu qqtlocal notice qqt; do
  code=$(curl -4 -s --noproxy '*' -o /dev/null -w '%{http_code}' --max-time 6 http://$d.1008086.xyz/)
  printf "  IPv4-only http://%s -> %s\n" "$d.1008086.xyz" "$code"
done

sep "5. 用 IPv6 强制 curl（如果你有 AAAA 记录）"
for d in home rights arpu qqtlocal notice qqt; do
  code=$(curl -6 -s --noproxy '*' -o /dev/null -w '%{http_code}' --max-time 6 http://$d.1008086.xyz/ 2>/dev/null)
  printf "  IPv6-only http://%s -> %s\n" "$d.1008086.xyz" "$code"
done

sep "6. 路由器 NAT 转发表（看 80 是否真的转到了 Mac）"
echo "  这一步要登录路由器后台 192.168.1.1，看：端口转发/虚拟服务器规则"
echo "  应该有一条：WAN TCP 80 -> 192.168.1.2:80 (你 Mac 的内网 IP)"

sep "7. 检查 ddns-go 配置（看是否同步了 AAAA / 同步频率）"
ps aux | grep -i [d]dns
echo "  ddns-go 默认 http://127.0.0.1:9876"
echo "  打开浏览器：http://127.0.0.1:9876 看域名同步状态"

#!/usr/bin/env bash
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

sep "1. 找 fake-ip 来源（哪个代理软件）"
ps aux | grep -iE "[c]lash|[s]urge|[s]tash|[m]ihomo|[s]ing-box|[s]haowanli|[q]uantumult|[v]2ray|[t]rojan|[L]oonClient" | head -10
echo
echo "  GUI app 进程："
ps aux | grep -iE "[C]lashX|[S]urge|[S]tash|[M]ihomo|[V]erge|[F]lClash" | head -10

sep "2. 系统网络代理设置（每个网卡 dns / 自动配置）"
networksetup -listallnetworkservices | grep -v "^An asterisk"
echo
for svc in Wi-Fi Ethernet "USB 10/100/1000 LAN"; do
  echo "  ---- $svc ----"
  networksetup -getdnsservers "$svc" 2>/dev/null | head -3
  networksetup -getwebproxy "$svc" 2>/dev/null
  networksetup -getsecurewebproxy "$svc" 2>/dev/null
  networksetup -getproxyautodiscovery "$svc" 2>/dev/null
done

sep "3. /etc/resolver/ (Surge / Clash 写入的子域名转发)"
ls -la /etc/resolver/ 2>/dev/null

sep "4. 系统 DNS 状态（看是否被代理劫持）"
scutil --dns 2>/dev/null | head -30

sep "5. 用公共 DNS 直接查（绕系统）确认真实 IP"
echo "  -- @8.8.8.8 --"
for h in xcxp.bj.10086.cn wx.10086.cn qqt.cmicrwx.cn; do
  printf "  %-25s -> " "$h"
  dig +short +time=2 +tries=1 @8.8.8.8 $h | tail -1
done
echo "  -- @223.5.5.5 (阿里) --"
for h in xcxp.bj.10086.cn wx.10086.cn qqt.cmicrwx.cn; do
  printf "  %-25s -> " "$h"
  dig +short +time=2 +tries=1 @223.5.5.5 $h | tail -1
done

sep "6. 当前系统默认 DNS 查到的（应该跟 8.8.8.8 / 223.5.5.5 一致才正常）"
for h in xcxp.bj.10086.cn wx.10086.cn qqt.cmicrwx.cn; do
  printf "  %-25s -> " "$h"
  dig +short +time=2 +tries=1 $h | tail -1
done

sep "7. 如何关闭代理 fake-ip"
echo "  如果你确认要让 cookie-app / rights 不走代理："
echo "    Option A. 在 Clash/Surge 里开启「绕过 LAN」+「直连大陆」+「关闭 fake-ip」"
echo "    Option B. 直接停掉代理 GUI 进程，看是否立刻恢复"
echo "    Option C. 在代理规则里加：xcxp.bj.10086.cn / wx.10086.cn / qqt.cmicrwx.cn → DIRECT"
echo
echo "  最稳的根治：DIRECT 规则覆盖（你的项目不出墙，没必要走代理）"

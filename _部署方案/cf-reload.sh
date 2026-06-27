#!/usr/bin/env bash
# 让 cloudflared 重载最新 config.yml
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }

CONFIG="$HOME/.cloudflared/config.yml"
SYS_CONFIG="/etc/cloudflared/config.yml"

sep "1. 检查 cloudflared service 用的是哪个 config"
sudo cat /Library/LaunchDaemons/com.cloudflare.cloudflared.plist 2>/dev/null | grep -A1 -i "config" | head -10

sep "2. 把用户 config 同步到系统目录（service 默认读这里）"
sudo mkdir -p /etc/cloudflared
sudo cp "$CONFIG" "$SYS_CONFIG"
sudo cp "$HOME/.cloudflared/"*.json /etc/cloudflared/
ok "config 和 credentials 已复制到 /etc/cloudflared/"

sep "3. 重启 cloudflared 服务"
sudo launchctl unload /Library/LaunchDaemons/com.cloudflare.cloudflared.plist 2>&1
sleep 2
sudo launchctl load /Library/LaunchDaemons/com.cloudflare.cloudflared.plist 2>&1
sleep 5
ok "cloudflared 已重启"

sep "4. cloudflared 进程"
ps aux | grep -E "[c]loudflared" | head -3

sep "5. 看启动日志（确认连接 Cloudflare 边缘成功）"
tail -30 /Library/Logs/com.cloudflare.cloudflared.out.log 2>/dev/null | tail -20
echo
tail -10 /Library/Logs/com.cloudflare.cloudflared.err.log 2>/dev/null | tail -10

sep "6. 等 30 秒让 DNS 生效并跑外部测试"
sleep 30
for d in home rights arpu qqtlocal notice notic qqt; do
  code=$(curl -4 -s --noproxy '*' -o /dev/null -w '%{http_code}' --max-time 10 http://$d.1008086.xyz/)
  printf "  %-25s -> %s\n" "$d.1008086.xyz" "$code"
done

sep "7. check-host.net 真外部多节点测试 home"
REQ=$(curl -s "https://check-host.net/check-http?host=home.1008086.xyz&max_nodes=6" -H "Accept: application/json")
ID=$(echo "$REQ" | python3 -c "import json,sys;print(json.load(sys.stdin)['request_id'])" 2>/dev/null)
sleep 8
curl -s "https://check-host.net/check-result/$ID" -H "Accept: application/json" | \
python3 -c "
import json,sys
d=json.load(sys.stdin)
for node, arr in d.items():
    if arr and arr[0]:
        x = arr[0]
        if isinstance(x, list) and len(x) > 2:
            print(f'  {node:<24}  HTTP {x[2]}  via {x[4] if len(x)>4 else \"?\"}')
        else: print(f'  {node:<24}  {x}')
    else: print(f'  {node:<24}  Timeout/Failed')
" 2>&1

#!/usr/bin/env bash
# 干净重装 cloudflared 服务
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

CONFIG="$HOME/.cloudflared/config.yml"
TUN_ID="de8aad74-e0df-49f2-84aa-f3dbc100c6a2"

sep "1. 检查 config.yml 内容（确认有 ingress 7 条）"
echo "  -- $CONFIG --"
cat "$CONFIG" | head -40
echo
echo "  -- /etc/cloudflared/config.yml --"
sudo cat /etc/cloudflared/config.yml 2>/dev/null | head -10

sep "2. 卸载已存在的 cloudflared 服务"
sudo cloudflared service uninstall 2>&1 | tail -5
sudo rm -f /Library/LaunchDaemons/com.cloudflare.cloudflared.plist
sudo launchctl remove com.cloudflare.cloudflared 2>/dev/null
sleep 2
ps aux | grep -E "[c]loudflared" | head -3
ok "旧服务清理完毕"

sep "3. 确保系统目录的 config 是最新的"
sudo mkdir -p /etc/cloudflared
sudo cp "$CONFIG" /etc/cloudflared/config.yml
sudo cp "$HOME/.cloudflared/${TUN_ID}.json" /etc/cloudflared/
sudo cp "$HOME/.cloudflared/cert.pem" /etc/cloudflared/ 2>/dev/null
sudo chown -R root:wheel /etc/cloudflared
ls -la /etc/cloudflared/

sep "4. 重新装服务（这次它会读 /etc/cloudflared/config.yml）"
sudo cloudflared --config /etc/cloudflared/config.yml service install 2>&1 | tail -10
sleep 4

sep "5. 启动确认"
sudo launchctl list | grep cloudflare
ps aux | grep -E "[c]loudflared" | head -3

sep "6. 看启动日志（应该有 'Registered tunnel connection'）"
sudo tail -40 /Library/Logs/com.cloudflare.cloudflared.out.log 2>/dev/null | tail -25
echo
echo "  ---- 错误日志 ----"
sudo tail -15 /Library/Logs/com.cloudflare.cloudflared.err.log 2>/dev/null | tail -15

sep "7. 等 20s 测域名"
sleep 20
for d in home rights arpu qqtlocal notice notic qqt; do
  code=$(curl -4 -s --noproxy '*' -o /dev/null -w '%{http_code}' --max-time 10 http://$d.1008086.xyz/)
  printf "  %-25s -> %s\n" "$d.1008086.xyz" "$code"
done

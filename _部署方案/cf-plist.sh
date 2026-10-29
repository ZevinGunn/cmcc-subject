#!/usr/bin/env bash
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

TUN_ID="de8aad74-e0df-49f2-84aa-f3dbc100c6a2"
CLOUDFLARED=$(which cloudflared)
[ -z "$CLOUDFLARED" ] && CLOUDFLARED=/opt/homebrew/bin/cloudflared
PLIST=/Library/LaunchDaemons/com.cloudflare.cloudflared.plist

sep "1. 先用前台跑一次，确认 config 没问题（10 秒）"
"$CLOUDFLARED" --config /etc/cloudflared/config.yml tunnel run "$TUN_ID" 2>&1 &
CPID=$!
sleep 10
echo
echo "  -- kill 前台进程 --"
kill $CPID 2>/dev/null
sleep 1
echo "  如果上面看到 'Registered tunnel connection' 4 次，说明 tunnel 正常"

sep "2. 卸载旧服务"
sudo launchctl bootout system "$PLIST" 2>/dev/null
sudo "$CLOUDFLARED" service uninstall 2>/dev/null | tail -3
sudo rm -f "$PLIST"

sep "3. 手写 plist（明确 tunnel run <id>）"
sudo tee "$PLIST" >/dev/null <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.cloudflare.cloudflared</string>
    <key>ProgramArguments</key>
    <array>
        <string>$CLOUDFLARED</string>
        <string>--no-autoupdate</string>
        <string>--config</string>
        <string>/etc/cloudflared/config.yml</string>
        <string>tunnel</string>
        <string>run</string>
        <string>$TUN_ID</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Library/Logs/com.cloudflare.cloudflared.out.log</string>
    <key>StandardErrorPath</key>
    <string>/Library/Logs/com.cloudflare.cloudflared.err.log</string>
</dict>
</plist>
PLIST
sudo chown root:wheel "$PLIST"
sudo chmod 644 "$PLIST"
ok "plist 已写入 $PLIST"

# 清空旧日志便于观察
sudo : > /Library/Logs/com.cloudflare.cloudflared.out.log
sudo : > /Library/Logs/com.cloudflare.cloudflared.err.log

sep "4. 加载服务"
sudo launchctl load -w "$PLIST" 2>&1
sleep 6

sep "5. 进程 + 日志"
ps aux | grep -E "[c]loudflared" | head -3
echo
echo "  -- out.log --"
sudo tail -30 /Library/Logs/com.cloudflare.cloudflared.out.log | tail -25
echo
echo "  -- err.log --"
sudo tail -15 /Library/Logs/com.cloudflare.cloudflared.err.log | tail -10

sep "6. 等 15 秒后测 7 个域名"
sleep 15
for d in home rights arpu qqtlocal notice notic qqt; do
  code=$(curl -4 -s --noproxy '*' -o /dev/null -w '%{http_code}' --max-time 10 http://$d.1008086.xyz/)
  printf "  %-25s -> %s\n" "$d.1008086.xyz" "$code"
done

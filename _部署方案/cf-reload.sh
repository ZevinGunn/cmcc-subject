#!/usr/bin/env bash
# 校验用户配置后同步到 /etc 正式配置源，并安全重载主 Tunnel。
set -euo pipefail
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*" >&2; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$ROOT/project-manager/services.json"
CONFIG="$HOME/.cloudflared/config.yml"
SYS_CONFIG="/etc/cloudflared/config.yml"
PLIST="/Library/LaunchDaemons/com.cloudflare.cloudflared.plist"
NODE="${NODE_BIN:-$(command -v node || true)}"

if [[ "${1:-}" =~ ^(-h|--help|help)$ ]]; then
  printf '%s\n' \
    "用法：bash _部署方案/cf-reload.sh" \
    "仅在 ~/.cloudflared/config.yml 与 services.json 完全一致时，备份并同步到 /etc 正式配置后重载主 Tunnel。"
  exit 0
fi
if [ "$#" -gt 0 ]; then
  bad "未知参数：$1"
  exit 2
fi

config_domains() {
  awk '/^[[:space:]]*- hostname:/ { print $3 }' "$1" | LC_ALL=C sort
}

manifest_domains() {
  "$NODE" -e '
    const manifest = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
    const tunnel = manifest.infrastructure.find((item) => item.id === "cloudflare-main");
    if (!tunnel) process.exit(1);
    process.stdout.write([...tunnel.domains].sort().join("\n"));
  ' "$MANIFEST"
}

sep "1. 检查 cloudflared service 用的是哪个 config"
if [ -z "$NODE" ] || [ ! -x "$NODE" ] || [ ! -f "$MANIFEST" ] || [ ! -f "$CONFIG" ]; then
  bad "缺少 node、services.json 或用户 Tunnel 配置"
  exit 1
fi
if ! plutil -p "$PLIST" 2>/dev/null | grep -Fq "$SYS_CONFIG"; then
  bad "launchd 未指向正式配置：$SYS_CONFIG"
  exit 1
fi
ok "launchd 使用 $SYS_CONFIG"

sep "2. 校验用户配置与统一清单"
cloudflared tunnel --config "$CONFIG" ingress validate
if [ "$(config_domains "$CONFIG")" != "$(manifest_domains)" ]; then
  bad "拒绝重载：$CONFIG 与 services.json 的 cloudflare-main 域名不一致"
  printf '  manifest:\n%s\n  config:\n%s\n' "$(manifest_domains)" "$(config_domains "$CONFIG")" >&2
  exit 1
fi
ok "用户配置与 services.json 一致"

sep "3. 同步到系统正式配置"
sudo install -d -m 755 /etc/cloudflared
if [ -f "$SYS_CONFIG" ]; then
  sudo cp "$SYS_CONFIG" "$SYS_CONFIG.bak-$(date +%Y%m%d-%H%M%S)"
fi
sudo install -o root -g wheel -m 644 "$CONFIG" "$SYS_CONFIG"
sudo cloudflared tunnel --config "$SYS_CONFIG" ingress validate
ok "正式配置已同步到 $SYS_CONFIG"

sep "4. 重启 cloudflared 服务"
if launchctl print system/com.cloudflare.cloudflared >/dev/null 2>&1; then
  sudo launchctl kickstart -k system/com.cloudflare.cloudflared
else
  sudo launchctl bootstrap system "$PLIST"
fi
sleep 5
ok "cloudflared 已重启"

sep "5. cloudflared 进程"
ps aux | grep -E "[c]loudflared" | sed -n '1,3p'

sep "6. 看启动日志（确认连接 Cloudflare 边缘成功）"
tail -30 /Library/Logs/com.cloudflare.cloudflared.out.log 2>/dev/null | tail -20
echo
tail -10 /Library/Logs/com.cloudflare.cloudflared.err.log 2>/dev/null | tail -10

sep "7. 等 30 秒让 DNS 生效并跑外部测试"
sleep 30
for d in home rights arpu qqtlocal notice notic qqt project; do
  code=$(curl -4 -s --noproxy '*' -o /dev/null -w '%{http_code}' --max-time 10 http://$d.1008086.xyz/) || code="000"
  printf "  %-25s -> %s\n" "$d.1008086.xyz" "$code"
done

sep "8. check-host.net 真外部多节点测试 home"
REQ=$(curl -sS "https://check-host.net/check-http?host=home.1008086.xyz&max_nodes=6" -H "Accept: application/json" || true)
ID=$(echo "$REQ" | python3 -c "import json,sys;print(json.load(sys.stdin).get('request_id',''))" 2>/dev/null || true)
if [ -z "$ID" ]; then
  bad "check-host.net 未返回 request_id"
  exit 1
fi
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
" 2>&1 || true

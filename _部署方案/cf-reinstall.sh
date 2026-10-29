#!/usr/bin/env bash
# 干净重装 cloudflared 服务；只接受与 services.json 一致的主 Tunnel 配置。
set -euo pipefail
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

CONFIG="$HOME/.cloudflared/config.yml"
SYS_CONFIG="/etc/cloudflared/config.yml"
TUN_ID="de8aad74-e0df-49f2-84aa-f3dbc100c6a2"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$ROOT/project-manager/services.json"
NODE="${NODE_BIN:-$(command -v node || true)}"

if [[ "${1:-}" =~ ^(-h|--help|help)$ ]]; then
  printf '%s\n' \
    "用法：bash _部署方案/cf-reinstall.sh" \
    "高风险恢复命令：校验 services.json 后重装使用 /etc/cloudflared/config.yml 的主 Tunnel launchd 服务。"
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

sep "1. 检查主 Tunnel 配置与 services.json 一致"
if [ -z "$NODE" ] || [ ! -x "$NODE" ] || [ ! -f "$MANIFEST" ] || [ ! -f "$CONFIG" ]; then
  bad "缺少 node、services.json 或用户 Tunnel 配置"
  exit 1
fi
cloudflared tunnel --config "$CONFIG" ingress validate
if [ "$(config_domains "$CONFIG")" != "$(manifest_domains)" ]; then
  bad "拒绝重装：$CONFIG 与 services.json 的 cloudflare-main 域名不一致"
  printf '  manifest:\n%s\n  config:\n%s\n' "$(manifest_domains)" "$(config_domains "$CONFIG")" >&2
  exit 1
fi
echo "  -- $CONFIG --"
sed -n '1,40p' "$CONFIG"
echo
echo "  -- /etc/cloudflared/config.yml --"
sudo sed -n '1,10p' /etc/cloudflared/config.yml 2>/dev/null

sep "2. 卸载已存在的 cloudflared 服务"
sudo cloudflared service uninstall 2>&1 | tail -5 || true
sudo rm -f /Library/LaunchDaemons/com.cloudflare.cloudflared.plist
sudo launchctl remove com.cloudflare.cloudflared 2>/dev/null || true
sleep 2
ps aux | grep -E "[c]loudflared" | sed -n '1,3p'
ok "旧服务清理完毕"

sep "3. 确保系统目录的 config 是最新的"
sudo mkdir -p /etc/cloudflared
sudo install -o root -g wheel -m 644 "$CONFIG" "$SYS_CONFIG"
sudo cp "$HOME/.cloudflared/${TUN_ID}.json" /etc/cloudflared/
sudo cp "$HOME/.cloudflared/cert.pem" /etc/cloudflared/ 2>/dev/null || true
sudo chown -R root:wheel /etc/cloudflared
ls -la /etc/cloudflared/

sudo cloudflared tunnel --config "$SYS_CONFIG" ingress validate

sep "4. 重新装服务（固定读取 ${SYS_CONFIG}）"
sudo cloudflared --config "$SYS_CONFIG" service install 2>&1 | tail -10
sleep 4

sep "5. 启动确认"
launchctl print system/com.cloudflare.cloudflared >/dev/null
ps aux | grep -E "[c]loudflared" | sed -n '1,3p'

sep "6. 看启动日志（应该有 'Registered tunnel connection'）"
sudo tail -40 /Library/Logs/com.cloudflare.cloudflared.out.log 2>/dev/null | tail -25
echo
echo "  ---- 错误日志 ----"
sudo tail -15 /Library/Logs/com.cloudflare.cloudflared.err.log 2>/dev/null | tail -15

sep "7. 等 20s 测域名"
sleep 20
for d in home rights arpu qqtlocal notice notic qqt project; do
  code=$(curl -4 -s --noproxy '*' -o /dev/null -w '%{http_code}' --max-time 10 http://$d.1008086.xyz/) || code="000"
  printf "  %-25s -> %s\n" "$d.1008086.xyz" "$code"
done

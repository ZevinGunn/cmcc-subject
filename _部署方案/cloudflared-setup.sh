#!/usr/bin/env bash
# Cloudflare Tunnel 半自动安装：你只需点一次浏览器授权
# 用法：bash cloudflared-setup.sh
set -euo pipefail
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
warn(){ printf "  \033[1;33m!\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

TUN_NAME="${TUN_NAME:-cmcc-home}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$ROOT/project-manager/services.json"
USER_CONFIG="$HOME/.cloudflared/config.yml"
SYS_CONFIG="/etc/cloudflared/config.yml"
CF_PLIST="/Library/LaunchDaemons/com.cloudflare.cloudflared.plist"
NODE="${NODE_BIN:-$(command -v node || true)}"

if [[ "${1:-}" =~ ^(-h|--help|help)$ ]]; then
  printf '%s\n' \
    "用法：bash _部署方案/cloudflared-setup.sh" \
    "创建或更新主 Tunnel，将与 services.json 一致的配置同步到 /etc/cloudflared/config.yml，并安装或重载 launchd 服务。"
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

# 1. 装 cloudflared
sep "1. 安装 cloudflared"
if command -v cloudflared >/dev/null; then
  ok "已装：$(cloudflared --version | head -1)"
else
  brew install cloudflared
fi

# 2. 登录（会弹浏览器）
sep "2. cloudflared login（浏览器会自动打开，登录 Cloudflare 后选 1008086.xyz → Authorize）"
if [ -f "$HOME/.cloudflared/cert.pem" ]; then
  ok "已登录（cert.pem 已存在）"
else
  cloudflared tunnel login
fi

# 3. 创建 tunnel
sep "3. 创建 tunnel: $TUN_NAME"
TUN_ID=$(cloudflared tunnel list 2>/dev/null | awk -v n="$TUN_NAME" '$2==n {print $1}')
if [ -z "$TUN_ID" ]; then
  cloudflared tunnel create "$TUN_NAME"
  TUN_ID=$(cloudflared tunnel list 2>/dev/null | awk -v n="$TUN_NAME" '$2==n {print $1}')
fi
ok "tunnel id = $TUN_ID"

# 4. 写 config.yml
sep "4. 写 ~/.cloudflared/config.yml"
CRED="$HOME/.cloudflared/${TUN_ID}.json"
[ -f "$CRED" ] || { bad "找不到 $CRED"; exit 1; }
cat > "$USER_CONFIG" <<YAML
tunnel: $TUN_ID
credentials-file: $CRED

# UDP/QUIC has shown degraded reachability on this China Mobile connection.
protocol: http2

originRequest:
  connectTimeout: 3s
  tcpKeepAlive: 30s
  keepAliveConnections: 100
  keepAliveTimeout: 90s

ingress:
  - hostname: home.1008086.xyz
    service: http://127.0.0.1:80
    originRequest:
      httpHostHeader: home.1008086.xyz
  - hostname: rights.1008086.xyz
    service: http://127.0.0.1:80
    originRequest:
      httpHostHeader: rights.1008086.xyz
  - hostname: arpu.1008086.xyz
    service: http://127.0.0.1:80
    originRequest:
      httpHostHeader: arpu.1008086.xyz
  - hostname: qqtlocal.1008086.xyz
    service: http://127.0.0.1:80
    originRequest:
      httpHostHeader: qqtlocal.1008086.xyz
  - hostname: notice.1008086.xyz
    service: http://127.0.0.1:80
    originRequest:
      httpHostHeader: notice.1008086.xyz
  - hostname: notic.1008086.xyz
    service: http://127.0.0.1:80
    originRequest:
      httpHostHeader: notic.1008086.xyz
  - hostname: qqt.1008086.xyz
    service: http://127.0.0.1:80
    originRequest:
      httpHostHeader: qqt.1008086.xyz
  - hostname: project.1008086.xyz
    service: http://127.0.0.1:80
    originRequest:
      httpHostHeader: project.1008086.xyz
  - service: http_status:404
YAML
ok "config.yml 已写入"

# 5. 同步到 launchd 唯一正式配置源
sep "5. 同步正式配置到 $SYS_CONFIG"
if [ -z "$NODE" ] || [ ! -x "$NODE" ] || [ ! -f "$MANIFEST" ]; then
  bad "无法读取统一服务清单：$MANIFEST"
  exit 1
fi
if [ "$(config_domains "$USER_CONFIG")" != "$(manifest_domains)" ]; then
  bad "用户 Tunnel 配置域名与 services.json 的 cloudflare-main 不一致"
  printf '  manifest:\n%s\n  config:\n%s\n' "$(manifest_domains)" "$(config_domains "$USER_CONFIG")" >&2
  exit 1
fi
cloudflared tunnel --config "$USER_CONFIG" ingress validate
sudo install -d -m 755 /etc/cloudflared
sudo install -o root -g wheel -m 644 "$USER_CONFIG" "$SYS_CONFIG"
sudo cloudflared tunnel --config "$SYS_CONFIG" ingress validate
ok "正式配置已写入 $SYS_CONFIG"

# 6. 路由 DNS（在 Cloudflare 加 CNAME）
sep "6. 在 Cloudflare DNS 加 CNAME"
for d in home rights arpu qqtlocal notice notic qqt project; do
  cloudflared tunnel route dns --overwrite-dns "$TUN_NAME" "$d.1008086.xyz" 2>&1 | tail -3
done
warn "wangka、yunpan 尚未接入访问控制，不创建 Tunnel ingress 或 DNS 路由"

# 7. 装成服务（开机自启）
sep "7. 安装或重载系统服务"
if launchctl print system/com.cloudflare.cloudflared >/dev/null 2>&1; then
  sudo launchctl kickstart -k system/com.cloudflare.cloudflared
  ok "已按正式配置重载"
else
  sudo cloudflared --config "$SYS_CONFIG" service install
fi
if ! plutil -p "$CF_PLIST" 2>/dev/null | grep -Fq "$SYS_CONFIG"; then
  bad "launchd 未指向正式配置：$SYS_CONFIG"
  exit 1
fi
ok "全部完成"

sep "8. 验证（cloudflared 在跑）"
sleep 5
sudo launchctl print system/com.cloudflare.cloudflared 2>/dev/null | grep -E "state|path" | sed -n '1,5p'
ps aux | grep -E "[c]loudflared" | sed -n '1,3p'

echo
echo "============================================"
echo "  部署完成。约 1 分钟后用手机 4G 测试："
echo "  http://home.1008086.xyz/"
echo "  外部多节点测试：https://check-host.net/check-http?host=home.1008086.xyz"
echo "============================================"

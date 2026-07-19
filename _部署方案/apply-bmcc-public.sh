#!/usr/bin/env bash
# Apply public access for bmcc and bjcmcc without exposing pending-auth services.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TUNNEL_ID="22aeed61-cece-43a0-b810-7080da91cfb7"
TUNNEL_CONFIG="$HOME/.cloudflared/cmcc-bmcc.yml"
PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix 2>/dev/null)/bin/pm2
export PATH="$(dirname "$PM2"):/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*" >&2; }

if [[ "${1:-}" =~ ^(-h|--help|help)$ ]]; then
  printf '%s\n' \
    "用法：bash _部署方案/apply-bmcc-public.sh" \
    "构建 BMCC 前端，将 bmcc/bjcmcc DNS 显式绑定到专用 Tunnel，并重启对应服务。"
  exit 0
fi
if [ "$#" -gt 0 ]; then
  bad "未知参数：$1"
  exit 2
fi

sep "1. Build bmcc frontend"
cd "$ROOT/bj-mobile-business-local"
npm run build
ok "frontend built"

sep "2. Ensure dedicated Cloudflare tunnel config"
mkdir -p "$HOME/.cloudflared"
cat > "$TUNNEL_CONFIG" <<YAML
tunnel: $TUNNEL_ID
credentials-file: $HOME/.cloudflared/$TUNNEL_ID.json

ingress:
  - hostname: bmcc.1008086.xyz
    service: http://127.0.0.1:8788
  - hostname: bjcmcc.1008086.xyz
    service: http://127.0.0.1:8790
  - service: http_status:404
YAML
cloudflared tunnel --config "$TUNNEL_CONFIG" ingress validate
ok "tunnel config valid"

sep "3. Route DNS to dedicated tunnel"
cloudflared tunnel route dns --overwrite-dns "$TUNNEL_ID" bmcc.1008086.xyz
cloudflared tunnel route dns --overwrite-dns "$TUNNEL_ID" bjcmcc.1008086.xyz

sep "4. Start PM2 processes"
"$PM2" startOrRestart "$ROOT/_部署方案/ecosystem.config.cjs" --only bmcc-backend,bjcmcc-route-hub,bmcc-tunnel --update-env
"$PM2" save
ok "pm2 ready"

sep "5. Verify"
sleep 8
for target in \
  "bmcc-local http://127.0.0.1:8788/api/health" \
  "bjcmcc-local http://127.0.0.1:8790/api/health" \
  "bmcc-public https://bmcc.1008086.xyz/api/health" \
  "bjcmcc-public https://bjcmcc.1008086.xyz/api/health"
do
  set -- $target
  name=$1
  url=$2
  code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "$url")
  printf "  %-10s -> %s\n" "$name" "$code"
  if [ "$code" != "200" ]; then
    bad "$name 健康检查失败"
    exit 1
  fi
done

echo
echo "Done: https://bmcc.1008086.xyz/ / https://bjcmcc.1008086.xyz/"

#!/usr/bin/env bash
# Apply public access for bmcc, bjcmcc and the unified contract query without exposing pending-auth services.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TUNNEL_ID="22aeed61-cece-43a0-b810-7080da91cfb7"
TUNNEL_CONFIG="$HOME/.cloudflared/cmcc-bmcc.yml"
TUNNEL_TEMPLATE="$ROOT/_部署方案/cmcc-bmcc.cloudflared.yml"
PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix 2>/dev/null)/bin/pm2
export PATH="$(dirname "$PM2"):/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*" >&2; }

check_gateway_route() {
  local hostname="$1"
  local expected="$2"
  local body
  body=$(curl -fsS --max-time 5 -H "Host: $hostname" http://127.0.0.1/api/health) || return 1
  printf '%s' "$body" | grep -Fq "$expected"
}

if [[ "${1:-}" =~ ^(-h|--help|help)$ ]]; then
  printf '%s\n' \
    "用法：bash _部署方案/apply-bmcc-public.sh" \
    "构建 BMCC 前端，将 bmcc/bjcmcc/contracts DNS 显式绑定到专用 Tunnel，并重启对应服务。"
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

sep "2. Verify Nginx gateway routes"
check_gateway_route bmcc.1008086.xyz bj-mobile-business-local || { bad "bmcc gateway route is not active"; exit 1; }
check_gateway_route bjcmcc.1008086.xyz bjcmcc-route-hub || { bad "bjcmcc gateway route is not active"; exit 1; }
check_gateway_route contracts.1008086.xyz contract3-query || { bad "contracts gateway route is not active"; exit 1; }
check_gateway_route contract3.1008086.xyz contract3-query || { bad "contract3 gateway route is not active"; exit 1; }
check_gateway_route tools.1008086.xyz tools-workbench || { bad "tools gateway route is not active"; exit 1; }
ok "all dedicated domains resolve through Nginx"

sep "3. Install validated Cloudflare tunnel config"
[ -f "$TUNNEL_TEMPLATE" ] || { bad "missing tunnel template: $TUNNEL_TEMPLATE"; exit 1; }
mkdir -p "$HOME/.cloudflared"
candidate=$(mktemp "$HOME/.cloudflared/cmcc-bmcc.yml.next.XXXXXX")
trap 'rm -f "$candidate"' EXIT
sed "s|__HOME__|$HOME|g" "$TUNNEL_TEMPLATE" > "$candidate"
cloudflared tunnel --config "$candidate" ingress validate
if [ -f "$TUNNEL_CONFIG" ]; then
  cp "$TUNNEL_CONFIG" "$TUNNEL_CONFIG.bak-$(date +%Y%m%d-%H%M%S)"
fi
chmod 600 "$candidate"
mv "$candidate" "$TUNNEL_CONFIG"
trap - EXIT
ok "tunnel config installed atomically"

sep "4. Route DNS to dedicated tunnel"
cloudflared tunnel route dns --overwrite-dns "$TUNNEL_ID" bmcc.1008086.xyz
cloudflared tunnel route dns --overwrite-dns "$TUNNEL_ID" bjcmcc.1008086.xyz
cloudflared tunnel route dns --overwrite-dns "$TUNNEL_ID" contracts.1008086.xyz
cloudflared tunnel route dns --overwrite-dns "$TUNNEL_ID" contract3.1008086.xyz
cloudflared tunnel route dns --overwrite-dns "$TUNNEL_ID" tools.1008086.xyz

sep "5. Start PM2 processes"
"$PM2" startOrRestart "$ROOT/_部署方案/ecosystem.config.cjs" --only bmcc-backend,bjcmcc-route-hub,contract3-query,tools-workbench,bmcc-tunnel --update-env
"$PM2" save
ok "pm2 ready"

sep "6. Verify"
sleep 8
for target in \
  "bmcc-local http://127.0.0.1:8788/api/health" \
  "bjcmcc-local http://127.0.0.1:8790/api/health" \
  "contract3-local http://127.0.0.1:3002/api/health" \
  "bmcc-public https://bmcc.1008086.xyz/api/health" \
  "bjcmcc-public https://bjcmcc.1008086.xyz/api/health" \
  "contracts-public https://contracts.1008086.xyz/api/health" \
  "contract3-public https://contract3.1008086.xyz/api/health"
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
echo "Done: https://bmcc.1008086.xyz/ / https://bjcmcc.1008086.xyz/ / https://contracts.1008086.xyz/"

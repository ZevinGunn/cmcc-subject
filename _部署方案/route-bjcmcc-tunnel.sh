#!/usr/bin/env bash
# 将北京移动业务快捷入口接入现有 cmcc-bmcc 直连 Tunnel。
set -euo pipefail

CLOUDFLARED="${CLOUDFLARED:-/opt/homebrew/bin/cloudflared}"
PM2="${PM2_BIN:-$HOME/.nvm/versions/node/v18.20.8/bin/pm2}"
CONFIG="$HOME/.cloudflared/cmcc-bmcc.yml"
TEMPLATE="$(cd "$(dirname "$0")" && pwd)/cmcc-bmcc.cloudflared.yml"
TUNNEL_ID="22aeed61-cece-43a0-b810-7080da91cfb7"

for route in \
  "bjcmcc.1008086.xyz bjcmcc-route-hub" \
  "contracts.1008086.xyz contract3-query" \
  "contract3.1008086.xyz contract3-query" \
  "tools.1008086.xyz tools-workbench"
do
  set -- $route
  body=$(curl -fsS --max-time 5 -H "Host: $1" http://127.0.0.1/api/health) || {
    printf 'Nginx route is not active: %s\n' "$1" >&2
    exit 1
  }
  printf '%s' "$body" | grep -Fq "$2" || {
    printf 'Nginx route points to the wrong service: %s\n' "$1" >&2
    exit 1
  }
done

candidate=$(mktemp "$HOME/.cloudflared/cmcc-bmcc.yml.next.XXXXXX")
trap 'rm -f "$candidate"' EXIT
sed "s|__HOME__|$HOME|g" "$TEMPLATE" > "$candidate"
"$CLOUDFLARED" tunnel --config "$candidate" ingress validate
[ ! -f "$CONFIG" ] || cp "$CONFIG" "$CONFIG.bak-$(date +%Y%m%d-%H%M%S)"
chmod 600 "$candidate"
mv "$candidate" "$CONFIG"
trap - EXIT

"$CLOUDFLARED" tunnel route dns --overwrite-dns "$TUNNEL_ID" bjcmcc.1008086.xyz
"$CLOUDFLARED" tunnel route dns --overwrite-dns "$TUNNEL_ID" contracts.1008086.xyz
"$CLOUDFLARED" tunnel route dns --overwrite-dns "$TUNNEL_ID" contract3.1008086.xyz
"$CLOUDFLARED" tunnel route dns --overwrite-dns "$TUNNEL_ID" tools.1008086.xyz
"$PM2" restart bmcc-tunnel --update-env
"$PM2" save

echo "bjcmcc.1008086.xyz、contracts.1008086.xyz、contract3.1008086.xyz 与 tools.1008086.xyz 已接入 cmcc-bmcc Tunnel"

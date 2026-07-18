#!/usr/bin/env bash
# 将北京移动业务快捷入口接入现有 cmcc-bmcc 直连 Tunnel。
set -euo pipefail

CLOUDFLARED="${CLOUDFLARED:-/opt/homebrew/bin/cloudflared}"
PM2="${PM2_BIN:-$HOME/.nvm/versions/node/v18.20.8/bin/pm2}"
CONFIG="$HOME/.cloudflared/cmcc-bmcc.yml"
TUNNEL_ID="22aeed61-cece-43a0-b810-7080da91cfb7"

"$CLOUDFLARED" tunnel --config "$CONFIG" ingress validate
"$CLOUDFLARED" tunnel route dns --overwrite-dns "$TUNNEL_ID" bjcmcc.1008086.xyz
"$PM2" restart bmcc-tunnel --update-env
"$PM2" save

echo "bjcmcc.1008086.xyz 已接入 cmcc-bmcc Tunnel"

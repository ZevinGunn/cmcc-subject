#!/usr/bin/env bash
# Apply public access for bmcc.1008086.xyz without touching system nginx/cloudflared.
set -e

ROOT="$HOME/CMCC-PROJECT"
TUNNEL_ID="22aeed61-cece-43a0-b810-7080da91cfb7"
TUNNEL_NAME="cmcc-bmcc"
TUNNEL_CONFIG="$HOME/.cloudflared/cmcc-bmcc.yml"
PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix 2>/dev/null)/bin/pm2
export PATH="$(dirname "$PM2"):/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }

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
  - service: http_status:404
YAML
cloudflared tunnel --config "$TUNNEL_CONFIG" ingress validate
ok "tunnel config valid"

sep "3. Route DNS to dedicated tunnel"
TUNNEL_FORCE_PROVISIONING_DNS=true cloudflared tunnel route dns "$TUNNEL_NAME" bmcc.1008086.xyz || true

sep "4. Start PM2 processes"
"$PM2" startOrRestart "$ROOT/_部署方案/ecosystem.config.cjs" --only bmcc-backend,bmcc-tunnel,project-manager --update-env
"$PM2" save
ok "pm2 ready"

sep "5. Verify"
sleep 8
for target in \
  "local-api http://127.0.0.1:8788/api/health" \
  "local-app http://127.0.0.1:8788/" \
  "public http://bmcc.1008086.xyz/"
do
  set -- $target
  name=$1
  url=$2
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$url")
  printf "  %-10s -> %s\n" "$name" "$code"
done

echo
echo "Done: http://bmcc.1008086.xyz/"

#!/usr/bin/env bash
# 关闭所有 CMCC 业务项目服务，默认保留管理后台
# 用法：bash ~/CMCC-PROJECT/_部署方案/stop-all.sh
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }

PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix 2>/dev/null)/bin/pm2

sep "1. 停止 PM2 业务后端（保留 project-manager）"
"$PM2" stop cookie-app rights-backend arpu-proxy qqtlocal cmcc-notice qqt-backend bmcc-backend bmcc-tunnel 2>&1 | tail -10
"$PM2" status

sep "2. 停止 nginx"
sudo brew services stop nginx 2>&1 | tail -3

sep "3. 停止 docker 里的 PostgreSQL（cookie-app 用）"
cd "$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app" && docker compose stop 2>&1 | tail -3

sep "4. 是否也停 Cloudflare Tunnel？（外网访问会断）"
echo "  默认保留。如要停："
echo "  sudo launchctl bootout system /Library/LaunchDaemons/com.cloudflare.cloudflared.plist"
echo "  或：bash $0 --with-tunnel"

if [ "$1" = "--with-tunnel" ]; then
  sudo launchctl bootout system /Library/LaunchDaemons/com.cloudflare.cloudflared.plist 2>&1 | tail -3
  ok "cloudflared 已停"
fi

sep "全部关闭完成"
echo "  下次启动：bash ~/CMCC-PROJECT/_部署方案/start-all.sh"
echo "  如要连管理后台也停：pm2 stop project-manager"

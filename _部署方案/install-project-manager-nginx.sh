#!/usr/bin/env bash
# 安装 project.1008086.xyz 的 nginx 入口
set -e

CONF="${CONF:-/opt/homebrew/etc/nginx/servers/cmcc.conf}"
BACKUP_DIR="$HOME/CMCC-PROJECT/_部署方案/nginx-backups"

mkdir -p "$BACKUP_DIR"
cp "$CONF" "$BACKUP_DIR/cmcc.conf.bak.$(date +%s)"

if grep -q "server_name project.1008086.xyz" "$CONF"; then
  echo "project.1008086.xyz 已存在，跳过追加"
else
  cat >> "$CONF" <<'NGINX'

# ============== 7. project.1008086.xyz （项目管理后台） ==============
server {
    listen 80;
    server_name project.1008086.xyz;

    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_http_version 1.1;

    location / {
        proxy_pass http://127.0.0.1:7800;
    }
}
NGINX
fi

nginx -t
nginx -s reload
echo "nginx 已加载 project.1008086.xyz"

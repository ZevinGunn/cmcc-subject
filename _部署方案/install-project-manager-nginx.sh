#!/usr/bin/env bash
# 安装 project.1008086.xyz 的 nginx 入口
set -e

CONF="${CONF:-/opt/homebrew/etc/nginx/servers/cmcc.conf}"
BACKUP_DIR="$HOME/CMCC-PROJECT/_部署方案/nginx-backups"

if [[ "${1:-}" =~ ^(-h|--help|help)$ ]]; then
  printf '%s\n' \
    "用法：bash _部署方案/install-project-manager-nginx.sh" \
    "备份现有 Nginx 配置，补充 Project Ops 本机 Tunnel 入口并以管理员权限重载。"
  exit 0
fi
if [ "$#" -gt 0 ]; then
  printf '未知参数：%s\n' "$1" >&2
  exit 2
fi

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

    allow 127.0.0.1;
    allow ::1;
    deny all;

    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $http_cf_connecting_ip;
    proxy_set_header X-Manager-Client-IP $http_cf_connecting_ip;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_http_version 1.1;

    location / {
        proxy_pass http://127.0.0.1:7800;
    }
}
NGINX
fi

sudo /opt/homebrew/bin/nginx -t
sudo /opt/homebrew/bin/nginx -s reload
echo "nginx 已加载 project.1008086.xyz"

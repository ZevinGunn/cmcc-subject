#!/usr/bin/env bash
# Cloudflare Tunnel 半自动安装：你只需点一次浏览器授权
# 用法：bash cloudflared-setup.sh
set -e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

TUN_NAME="${TUN_NAME:-cmcc-home}"

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
cat > "$HOME/.cloudflared/config.yml" <<YAML
tunnel: $TUN_ID
credentials-file: $CRED

ingress:
  - hostname: home.1008086.xyz
    service: http://localhost:80
    originRequest:
      httpHostHeader: home.1008086.xyz
  - hostname: rights.1008086.xyz
    service: http://localhost:80
    originRequest:
      httpHostHeader: rights.1008086.xyz
  - hostname: arpu.1008086.xyz
    service: http://localhost:80
    originRequest:
      httpHostHeader: arpu.1008086.xyz
  - hostname: qqtlocal.1008086.xyz
    service: http://localhost:80
    originRequest:
      httpHostHeader: qqtlocal.1008086.xyz
  - hostname: notice.1008086.xyz
    service: http://localhost:80
    originRequest:
      httpHostHeader: notice.1008086.xyz
  - hostname: notic.1008086.xyz
    service: http://localhost:80
    originRequest:
      httpHostHeader: notic.1008086.xyz
  - hostname: qqt.1008086.xyz
    service: http://localhost:80
    originRequest:
      httpHostHeader: qqt.1008086.xyz
  - hostname: project.1008086.xyz
    service: http://localhost:80
    originRequest:
      httpHostHeader: project.1008086.xyz
  - hostname: wangka.1008086.xyz
    service: http://localhost:80
    originRequest:
      httpHostHeader: wangka.1008086.xyz
  - hostname: yunpan.1008086.xyz
    service: http://localhost:80
    originRequest:
      httpHostHeader: yunpan.1008086.xyz
  - service: http_status:404
YAML
ok "config.yml 已写入"

# 5. 路由 DNS（在 Cloudflare 加 CNAME）
sep "5. 在 Cloudflare DNS 加 CNAME"
for d in home rights arpu qqtlocal notice notic qqt project wangka yunpan; do
  cloudflared tunnel route dns "$TUN_NAME" "$d.1008086.xyz" 2>&1 | tail -3
done

# 6. 装成服务（开机自启）
sep "6. 安装为系统服务"
if launchctl list | grep -q com.cloudflare.cloudflared; then
  ok "已装"
else
  sudo cloudflared service install
fi
ok "全部完成"

sep "7. 验证（cloudflared 在跑）"
sleep 5
sudo launchctl print system/com.cloudflare.cloudflared 2>/dev/null | grep -E "state|path" | head -5
ps aux | grep -E "[c]loudflared" | head -3

echo
echo "============================================"
echo "  部署完成。约 1 分钟后用手机 4G 测试："
echo "  http://home.1008086.xyz/"
echo "  外部多节点测试：https://check-host.net/check-http?host=home.1008086.xyz"
echo "============================================"

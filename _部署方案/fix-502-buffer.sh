#!/usr/bin/env bash
set +e
NGX_ETC=/opt/homebrew/etc/nginx
NGX_TMP=/opt/homebrew/var/run/nginx
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

sep "1. 查 nginx worker 跑在哪个用户"
ps aux | grep -E "[n]ginx" | head -5

sep "2. 看 proxy_temp 目录权限"
ls -la "$NGX_TMP" 2>/dev/null
ls -la "$NGX_TMP/proxy_temp" 2>/dev/null | head -5

sep "3. 修目录所有权 + 权限（让 nobody 可写）"
sudo mkdir -p "$NGX_TMP/proxy_temp" "$NGX_TMP/client_body_temp" "$NGX_TMP/fastcgi_temp" "$NGX_TMP/uwsgi_temp" "$NGX_TMP/scgi_temp"
sudo chown -R nobody:wheel "$NGX_TMP"
sudo chmod -R 755 "$NGX_TMP"
ls -la "$NGX_TMP" | head -10
ok "目录权限已修"

sep "4. 同时在 cmcc.conf 里给每个 server 开启更宽松的 buffer / 关掉 buffering"
CONF="$NGX_ETC/servers/cmcc.conf"
# 备份
sudo cp "$CONF" "$CONF.bak.$(date +%s)"

# 在 cmcc.conf 顶部加 buffer 设置（如果还没有）
if ! sudo grep -q "proxy_request_buffering" "$CONF"; then
  sudo python3 - "$CONF" <<'PY'
import sys
p = sys.argv[1]
s = open(p).read()
header = '''# === 全局 proxy buffer 调优（修复 502 / proxy_temp 权限问题）===
proxy_buffering off;
proxy_request_buffering off;
proxy_busy_buffers_size 64k;
proxy_buffers 8 64k;
proxy_buffer_size 64k;
proxy_temp_file_write_size 64k;
proxy_max_temp_file_size 0;
# 上游接口可能慢（10086 验证码、二维码登录）
proxy_connect_timeout 30s;
proxy_read_timeout 180s;
proxy_send_timeout 180s;

'''
open(p,'w').write(header + s)
print('  已注入 buffer 配置到 cmcc.conf 顶部')
PY
else
  ok "cmcc.conf 已有 proxy_request_buffering 设置，跳过"
fi

sep "5. nginx -t 验证"
sudo nginx -t

sep "6. 重启 nginx"
sudo brew services restart nginx
sleep 3
sudo lsof -nP -iTCP:80 -sTCP:LISTEN | head -3

sep "7. 等 5 秒，本机测一遍"
sleep 5
for d in home rights arpu qqtlocal notice qqt; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 -H "Host: $d.1008086.xyz" http://127.0.0.1/)
  printf "  %-22s -> %s\n" "$d.1008086.xyz" "$code"
done

sep "8. 现在你去浏览器再触发一次 10086 send 验证码，看是否还 502"
echo "  如果还报错，发一次：bash diag-502.sh 看新日志"

#!/usr/bin/env bash
set +e
NGX_ETC=/opt/homebrew/etc/nginx
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

sep "1. servers/ 下的所有文件"
sudo ls -la "$NGX_ETC/servers/"

sep "2. 把所有 .bak* 文件移出 servers 目录"
BAKDIR="$NGX_ETC/servers-backups"
sudo mkdir -p "$BAKDIR"
sudo bash -c "mv $NGX_ETC/servers/*.bak* '$BAKDIR/' 2>/dev/null"
sudo ls -la "$NGX_ETC/servers/"
echo
echo "  备份移到了：$BAKDIR"
ls -la "$BAKDIR" 2>/dev/null

sep "3. nginx -t 验证"
sudo nginx -t

sep "4. 看 cmcc.conf 顶部 buffer 配置是否在"
sudo head -15 "$NGX_ETC/servers/cmcc.conf"

sep "5. 重启 nginx"
sudo brew services restart nginx
sleep 4
echo
echo "  80 端口监听："
sudo lsof -nP -iTCP:80 -sTCP:LISTEN | head -5

sep "6. 本机六个域名测试"
for d in home rights arpu qqtlocal notice qqt; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 -H "Host: $d.1008086.xyz" http://127.0.0.1/)
  printf "  %-22s -> %s\n" "$d.1008086.xyz" "$code"
done

sep "7. 公网 HTTPS"
for d in home rights arpu qqtlocal notice qqt; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 6 https://$d.1008086.xyz/)
  printf "  %-22s -> %s\n" "$d.1008086.xyz" "$code"
done

ok "完成。浏览器再去触发 10086 send 验证码，应该不再 502"

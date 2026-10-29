#!/usr/bin/env bash
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

sep "1. 验证 HTTPS 直接生效"
for d in home rights arpu qqtlocal notice notic qqt; do
  CODE=$(curl -sI --max-time 8 "https://$d.1008086.xyz/" -o /dev/null -w '%{http_code}')
  if [ "$CODE" = "200" ] || [ "$CODE" = "301" ] || [ "$CODE" = "302" ]; then
    ok "https://$d.1008086.xyz -> $CODE"
  else
    bad "https://$d.1008086.xyz -> $CODE"
  fi
done

sep "2. 证书信息"
echo | openssl s_client -servername home.1008086.xyz -connect home.1008086.xyz:443 2>/dev/null \
  | openssl x509 -noout -issuer -subject -dates 2>&1

sep "3. http -> https 是否自动跳转"
for d in home qqt; do
  HEADER=$(curl -sI --max-time 8 "http://$d.1008086.xyz/" -o /dev/null -w '%{http_code} %{redirect_url}')
  printf "  http://%s -> %s\n" "$d.1008086.xyz" "$HEADER"
done
echo "  -> 如果上面看到 301/302 跳 https 就代表 Cloudflare 'Always Use HTTPS' 已开"
echo "  -> 如果是 200 表示还没开，需去 Cloudflare 后台手动打开"

sep "4. 提示"
echo "  Cloudflare 后台必做："
echo "    ① SSL/TLS → Overview → Encryption mode = Full"
echo "    ② SSL/TLS → Edge Certificates → 打开 'Always Use HTTPS'"
echo "    ③ SSL/TLS → Edge Certificates → 打开 'Automatic HTTPS Rewrites'"

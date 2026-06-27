#!/usr/bin/env bash
set +e
NGX_ETC=/opt/homebrew/etc/nginx
CONF="$NGX_ETC/servers/cmcc.conf"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }

sep "1. 在 notic 那个 server 块同时绑 notice"
sudo python3 - "$CONF" <<'PY'
import sys, re
p = sys.argv[1]
s = open(p).read()
# 替换 "server_name notic.1008086.xyz;" -> "server_name notic.1008086.xyz notice.1008086.xyz;"
new = re.sub(
    r'server_name\s+notic\.1008086\.xyz\s*;',
    'server_name notic.1008086.xyz notice.1008086.xyz;',
    s
)
if new != s:
    open(p,'w').write(new)
    print('  已添加 notice.1008086.xyz 别名')
else:
    print('  未匹配到 notic server_name 行（可能已加过）')
PY

sep "2. nginx -t / reload"
sudo nginx -t && sudo nginx -s reload

sep "3. 自检"
for d in notic notice; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 -H "Host: $d.1008086.xyz" http://127.0.0.1/)
  printf "  %-25s -> %s\n" "$d.1008086.xyz" "$code"
done

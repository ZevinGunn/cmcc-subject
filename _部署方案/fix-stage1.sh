#!/usr/bin/env bash
# 一键启动：把 cmcc.nginx.conf 放进 nginx servers/、起 nginx、起 pm2
set +e
ROOT="$HOME/CMCC-PROJECT"
PLAN="$ROOT/_部署方案"

sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

# 1. 找 nginx 安装路径
sep "1. 探测 nginx 安装路径"
if [ -d /opt/homebrew/etc/nginx ]; then NGX_ETC=/opt/homebrew/etc/nginx
elif [ -d /usr/local/etc/nginx ];   then NGX_ETC=/usr/local/etc/nginx
else bad "找不到 nginx 配置目录"; exit 1; fi
ok "nginx 配置目录：$NGX_ETC"

# 2. 把 cmcc.nginx.conf 替换 CHANGE_ME 成真实 $HOME 后放进 servers/
sep "2. 部署 cmcc.nginx.conf"
mkdir -p "$NGX_ETC/servers"
sed "s|/Users/CHANGE_ME|$HOME|g" "$PLAN/cmcc.nginx.conf" | sudo tee "$NGX_ETC/servers/cmcc.conf" >/dev/null
ok "已写入 $NGX_ETC/servers/cmcc.conf （$HOME 已替换）"

# 确认 nginx.conf 里有 include servers/*.conf;
if ! grep -q 'include servers/\*\.conf' "$NGX_ETC/nginx.conf"; then
  bad "nginx.conf 缺少 include servers/*.conf;，加进去……"
  sudo sed -i '' '/^http {/a\
    include servers/*.conf;
' "$NGX_ETC/nginx.conf"
fi

# 3. 关闭与新配置冲突的旧 server（zevingunn.dns.army:5702）
sep "3. 校验 nginx -t"
sudo nginx -t

# 4. 启动 nginx
sep "4. 启动 nginx"
if pgrep -x nginx >/dev/null; then
  sudo nginx -s reload && ok "nginx 已 reload"
else
  sudo brew services start nginx 2>/dev/null
  if pgrep -x nginx >/dev/null; then ok "nginx 启动成功"
  else
    sudo nginx && ok "nginx 直接启动成功" || bad "nginx 启动失败，看上面 nginx -t 报错"
  fi
fi
sleep 1
sudo lsof -nP -iTCP:80 -sTCP:LISTEN | head -5

# 5. 替换 ecosystem.config.cjs 中的 CHANGE_ME
sep "5. 生成可执行的 PM2 配置"
sed "s|/Users/CHANGE_ME|$HOME|g" "$PLAN/ecosystem.config.cjs" > "$PLAN/ecosystem.local.cjs"
ok "已生成 $PLAN/ecosystem.local.cjs"

# 6. 用 PM2 启动六个服务
sep "6. 启动 PM2 服务"
if ! command -v pm2 >/dev/null 2>&1; then
  bad "pm2 没装：npm i -g pm2"; exit 1
fi
pm2 delete all 2>/dev/null
pm2 start "$PLAN/ecosystem.local.cjs"
pm2 save

sleep 3

# 7. 自检
sep "7. 端口自检"
for p in 3010:rights 3101:home 3000:arpu 8899:qqtlocal 3111:notic 7607:qqt; do
  port=${p%%:*}; name=${p##*:}
  if lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null 2>&1; then
    ok "$name :$port"
  else
    bad "$name :$port 还没起来，看 pm2 logs $name"
  fi
done

sep "8. 本机 nginx 转发"
for d in home rights arpu qqtlocal notic qqt; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 -H "Host: $d.1008086.xyz" http://127.0.0.1/)
  printf "  %s.1008086.xyz -> %s\n" "$d" "$code"
done

echo
echo "如有 pm2 起不来的，单独看：pm2 logs <名字> --lines 40"

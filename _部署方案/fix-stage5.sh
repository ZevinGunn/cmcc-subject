#!/usr/bin/env bash
set +e
NGX_ETC=/opt/homebrew/etc/nginx
ENV_FILE="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app/.env.production"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

# 1. 用 python 智能删除 nginx.conf 里的 home.1008086.xyz server 块（包含上面紧邻的注释）
sep "1. 删除 nginx.conf 里冲突的 home server 块"
sudo cp -n "$NGX_ETC/nginx.conf" "$NGX_ETC/nginx.conf.bak.$(date +%s)"
sudo python3 - "$NGX_ETC/nginx.conf" <<'PY'
import re, sys
path = sys.argv[1]
with open(path) as f: lines = f.readlines()
target = None
for i, line in enumerate(lines):
    if 'server_name' in line and 'home.1008086.xyz' in line:
        target = i; break
if target is None:
    print('  没找到 home.1008086.xyz，跳过'); sys.exit()
# walk back to find 'server' line with '{'
start = target
while start >= 0 and not re.search(r'server\s*\{', lines[start]):
    start -= 1
if start < 0:
    print('  找不到 server { 起点'); sys.exit()
# include comments immediately above
sb = start
while sb > 0 and lines[sb-1].strip().startswith('#'):
    sb -= 1
# walk forward counting braces
depth = 0
end = None
for j in range(start, len(lines)):
    for c in lines[j]:
        if c == '{': depth += 1
        elif c == '}': depth -= 1
    if depth == 0:
        end = j; break
if end is None:
    print('  找不到 } 结尾'); sys.exit()
new = lines[:sb] + lines[end+1:]
with open(path, 'w') as f: f.writelines(new)
print(f'  已删除第 {sb+1} - {end+1} 行（共 {end+1-sb} 行）')
PY

sep "2. nginx -t / reload"
sudo nginx -t && sudo nginx -s reload && ok "nginx 已 reload"

# 2. 给 cookie-app 生成真实密钥
sep "3. 生成 CMCC_DB_ENCRYPTION_KEY 和 ADMIN_KEY 并写入 .env.production"
KEY=$(openssl rand -base64 32)
ADMIN=$(openssl rand -hex 24)
ok "已生成新密钥（不打印内容）"

# 替换 .env.production 中的占位符
cp "$ENV_FILE" "$ENV_FILE.bak.$(date +%s)"
# 用 python 安全地写入（处理特殊字符）
python3 - "$ENV_FILE" "$KEY" "$ADMIN" <<'PY'
import sys, re
path, key, admin = sys.argv[1], sys.argv[2], sys.argv[3]
with open(path) as f: txt = f.read()
def setkv(txt, k, v):
    if re.search(rf'^{k}=', txt, re.M):
        return re.sub(rf'^{k}=.*$', f'{k}="{v}"', txt, flags=re.M)
    return txt + f'\n{k}="{v}"\n'
txt = setkv(txt, 'CMCC_DB_ENCRYPTION_KEY', key)
txt = setkv(txt, 'ADMIN_KEY', admin)
with open(path, 'w') as f: f.write(txt)
print('  .env.production 已更新 CMCC_DB_ENCRYPTION_KEY / ADMIN_KEY')
PY

# 3. cookie-app 还需要数据库迁移（首次）。先看看用户密码 DB 名跟 docker-compose 是否一致
sep "4. 确认 DATABASE_URL 端口、用户、库名"
grep "^DATABASE_URL" "$ENV_FILE" | sed 's/=.*$/=<REDACTED>/'
# 看 docker 里 PG 的实际配置
docker exec cmcc-cookie-app-postgres env 2>/dev/null | grep -E "POSTGRES_(USER|DB|PASSWORD)" | sed 's/PASSWORD=.*/PASSWORD=<REDACTED>/'

# 4. 跑 prisma migrate（如果之前没跑）
sep "5. prisma migrate deploy"
cd "$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
npx prisma migrate deploy 2>&1 | tail -20

sep "6. 重启 cookie-app"
pm2 restart cookie-app
sleep 5
pm2 status | grep -E "name|cookie-app|---"
echo
pm2 logs cookie-app --lines 15 --nostream 2>/dev/null | tail -20

sep "7. 端口自检"
for p in 3010:rights 3101:home 3000:arpu 8899:qqtlocal 3111:notic 7607:qqt; do
  port=${p%%:*}; name=${p##*:}
  if lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null 2>&1; then ok "$name :$port"
  else bad "$name :$port 未起"; fi
done

sep "8. 本机域名直连"
for d in home rights arpu qqtlocal notic qqt; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 -H "Host: $d.1008086.xyz" http://127.0.0.1/)
  printf "  %-25s -> %s\n" "$d.1008086.xyz" "$code"
done

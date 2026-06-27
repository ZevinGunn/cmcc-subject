#!/usr/bin/env bash
set +e
COOKIE="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
RIGHTS="$HOME/CMCC-PROJECT/bj-cmcc-qy"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }

###################### A. cookie-app ######################

sep "1. accounts.ts POST /  完整定义（增加账号那段）"
awk '
  /router\.post\(\s*['"'"'"][\/]['"'"'"]/ || /router\.post\(\s*['"'"'"]\/['"'"'"]/ { capture=1 }
' "$COOKIE/api/routes/accounts.ts" >/dev/null
# 找 router.post 的位置直接看
grep -n "router\.post\|router\.put\|router\.delete" "$COOKIE/api/routes/accounts.ts" | head -20

sep "2. accounts.ts POST '/' 完整代码（前 80 行 + post '/' 上下文）"
# 锁定 POST / 那一段
python3 << 'PY'
import re
with open("$COOKIE/api/routes/accounts.ts".replace("$COOKIE","/Users/ZevinGunn/CMCC-PROJECT/免登录进入全球通/cookie-app")) as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if re.search(r"router\.post\(\s*['\"]/['\"]", line):
        # 打印 100 行
        end = min(len(lines), i + 120)
        for j in range(i, end):
            print(f"{j+1:4} | {lines[j].rstrip()}")
        break
PY

sep "3. publicLinksStore.ts: 关键导出函数"
grep -n "^export " "$COOKIE/api/services/publicLinksStore.ts" 2>/dev/null
grep -n "^export " "$COOKIE/api/services/publicLinksStoreDb.ts" 2>/dev/null

sep "4. accountsStoreDb.ts: createAccount / 是否接受 userId"
grep -n "createAccount\|userId" "$COOKIE/api/services/accountsStoreDb.ts" | head -15

sep "5. PublicLogin.tsx 提交 /api/accounts 的请求 body 长什么样"
python3 << 'PY'
with open("/Users/ZevinGunn/CMCC-PROJECT/免登录进入全球通/cookie-app/src/pages/PublicLogin.tsx") as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if "/api/accounts" in line and "postJson" in line:
        a = max(0, i-15); b = min(len(lines), i+15)
        print(f"\n--- line {i+1} ---")
        for j in range(a,b):
            print(f"{j+1:5} | {lines[j].rstrip()}")
PY

sep "6. auth.ts: 注册 + login 流程概貌"
grep -n "router\." "$COOKIE/api/routes/auth.ts" | head -20

sep "7. user session 中间件（如何识别普通用户身份）"
grep -rn "requireUser\|currentUser\|getUserFromReq\|getSession\|userSessionCookie" "$COOKIE/api" 2>/dev/null | head -20

###################### B. bj-cmcc-qy ######################

sep "8. bmccClient.js（上游 HTTP 调用主入口）"
head -100 "$RIGHTS/backend/src/bmccClient.js" 2>/dev/null

sep "9. 找前端 axios/fetch 主入口（JSON 解析在哪）"
ls "$RIGHTS/frontend/src/"
head -60 "$RIGHTS/frontend/src/api.js" 2>/dev/null

sep "10. App.vue 里 fetch / axios 调用样本（看如何拿响应）"
grep -n "await fetch\|await axios\|\.json()\|response.json" "$RIGHTS/frontend/src/App.vue" 2>/dev/null | head -20

sep "11. utils/http.js（看 fail/ok 返回格式）"
cat "$RIGHTS/backend/src/utils/http.js" 2>/dev/null | head -40

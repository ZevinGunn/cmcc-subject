#!/usr/bin/env bash
# 只读探查：理解 cookie-app 和 rights 的 bug 范围
set +e
COOKIE="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
RIGHTS="$HOME/CMCC-PROJECT/bj-cmcc-qy"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }

###################### 一、cookie-app 数据模型 + public 登录 ######################

sep "1. Prisma 模型: Account / User / PublicLink / PublicLinkAccount"
awk '/^model (Account|User|PublicLink|PublicLinkAccount|UserSession)/,/^}/' \
  "$COOKIE/prisma/schema.prisma"

sep "2. 数据库实样: PublicLink + PublicLinkAccount + User 关联状态"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app -c "
SELECT pl.id AS link_id, pl.code, pl.\"createdAt\",
       COUNT(pla.\"accountId\") AS acc_count
FROM \"PublicLink\" pl
LEFT JOIN \"PublicLinkAccount\" pla ON pla.\"publicLinkId\" = pl.id
GROUP BY pl.id ORDER BY pl.\"createdAt\" DESC LIMIT 8;" 2>&1

echo
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_cookie_app -c "
-- 统计：有多少 Account 既挂在 PublicLink 上又有 userId？没有 userId 的 PublicLink 账号占比
SELECT
  COUNT(*) AS total_via_link,
  COUNT(a.\"userId\") AS has_user,
  COUNT(*) - COUNT(a.\"userId\") AS missing_user
FROM \"PublicLinkAccount\" pla
JOIN \"Account\" a ON a.id = pla.\"accountId\";" 2>&1

sep "3. PublicLink 路由文件 / 公共登录路由"
ls "$COOKIE/api/routes/" | grep -iE "public|invite|link|signup"
echo
grep -rln "PublicLink\|publicLink\|/api/auth/public\|/api/accounts/public\|registerAccount\|attachAccount" \
  "$COOKIE/api" 2>/dev/null | grep -v node_modules | head -20

sep "4. public 页面登录添加手机号的实现入口（在 routes 里找）"
grep -rn "publicLink\|public-link\|invite" "$COOKIE/api/routes" 2>/dev/null | head -25

sep "5. 看 src/pages/Public.tsx 或类似前端入口"
ls "$COOKIE/src/pages" 2>/dev/null
grep -rln "/api/accounts/public\|/api/public" "$COOKIE/src" 2>/dev/null | head -10

sep "6. 找『添加手机号』提交的 API 路径（在前端 src 里）"
grep -rn "/api/accounts" "$COOKIE/src" 2>/dev/null | grep -v node_modules | grep -iE "post|put|new|register|添加|绑定|attach" | head -20

sep "7. 管理员邀请码相关页面+路由"
grep -rln "PublicLink\|邀请码\|invite" "$COOKIE/src/pages" 2>/dev/null | head -5
grep -rn "router\.\(get\|post\|put\)" "$COOKIE/api/routes/admin.ts" 2>/dev/null | head -30

###################### 二、bj-cmcc-qy 间歇 JSON 错误 ######################

sep "8. rights backend src 结构"
ls "$RIGHTS/backend/src/" 2>/dev/null
ls "$RIGHTS/backend/src/routes" 2>/dev/null

sep "9. 后端如何向外部上游发请求 / 是否有 try-catch JSON 解析"
grep -rln "axios\|fetch\|JSON.parse\|response.json" "$RIGHTS/backend/src" 2>/dev/null | head -10

sep "10. 前端 axios / fetch 拦截器（看是否对响应做了 JSON.parse 而没做 content-type 判断）"
grep -rn "response\.\(json\|data\)\|JSON.parse\|axios.interceptors" "$RIGHTS/frontend/src" 2>/dev/null | head -20

sep "11. rights pm2 最近 50 行日志（看是否有偶发的非 200 / 上游错误）"
PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix 2>/dev/null)/bin/pm2
"$PM2" logs rights-backend --lines 50 --nostream 2>/dev/null | tail -50

sep "12. 截一个 routes/rights.js 的样本（看上游调用方式）"
ls "$RIGHTS/backend/src/routes/"
head -120 "$RIGHTS/backend/src/routes/rights.js" 2>/dev/null

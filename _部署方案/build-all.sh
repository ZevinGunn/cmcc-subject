#!/usr/bin/env bash
# 一键安装依赖 + 构建六个项目的前端
# 在 ~/CMCC-PROJECT 下：bash _部署方案/build-all.sh
# 选项：
#   FRESH=1            清掉 node_modules、venv、dist 后重新构建（强烈推荐换机器后用）
#   SKIP_QQTLOCAL=1    跳过 python venv 步骤
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "ROOT=$ROOT"
FRESH="${FRESH:-0}"

log() { printf "\n\033[1;36m==> %s\033[0m\n" "$*"; }
err() { printf "\033[1;31m!! %s\033[0m\n" "$*" >&2; }

# ---------- 1. cookie-app（home）----------
log "1) cookie-app (home)"
cd "$ROOT/免登录进入全球通/cookie-app"
[ -f .env ]            || ([ -f .env.development.example ] && cp .env.development.example .env || true)
[ -f .env.production ] || cp .env.production.example .env.production
if [ "$FRESH" = "1" ]; then rm -rf node_modules dist; fi
npm install --no-audit --no-fund
# Prisma client（依 schema.prisma 的 binaryTargets，跨平台都能用）
npx prisma generate
npm run build

# ---------- 2. bj-cmcc-qy（rights）----------
log "2) bj-cmcc-qy (rights)"
cd "$ROOT/bj-cmcc-qy"
[ -f .env ] || cp .env.example .env
if [ "$FRESH" = "1" ]; then rm -rf node_modules frontend/node_modules backend/node_modules frontend/dist; fi
npm run install:all
npm run build

# ---------- 3. 好礼多多本地版查询（arpu）----------
log "3) arpu 无构建步骤（纯 HTML + node 内置模块）"

# ---------- 4. qqtlocal-rights ----------
if [ "${SKIP_QQTLOCAL:-0}" != "1" ]; then
  log "4) qqtlocal-rights (qqtlocal)"
  cd "$ROOT/qqtlocal-rights"
  if [ "$FRESH" = "1" ]; then rm -rf venv go-worker/worker; fi
  [ -d venv ] || python3 -m venv venv
  ./venv/bin/pip install -q --upgrade pip
  ./venv/bin/pip install -q -r backend/requirements.txt aiohttp
  if command -v go >/dev/null 2>&1; then
    [ -f go-worker/worker ] || (cd go-worker && go build -o worker main.go) || err "go-worker build failed"
  else
    err "go 未安装，跳过 go-worker 编译；可只用 Python 执行器"
  fi
fi

# ---------- 5. cmcc-notice（notic）----------
log "5) cmcc-notice (notic)"
cd "$ROOT/cmcc-notice"
if [ "$FRESH" = "1" ]; then rm -rf node_modules; fi
npm install --no-audit --no-fund

# ---------- 6. qqt（qqt 公共版）----------
log "6) qqt"
cd "$ROOT/qqt"
if [ "$FRESH" = "1" ]; then rm -rf node_modules frontend/node_modules backend/node_modules frontend/dist; fi
npm install --no-audit --no-fund
npm run build

log "ALL DONE"

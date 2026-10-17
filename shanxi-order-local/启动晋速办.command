#!/bin/bash
set -e
cd "$(dirname "$0")"
export PATH="$HOME/.volta/bin:$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
if ! command -v node >/dev/null 2>&1; then
  echo '需要 Node.js 20 或更新版本，请从 https://nodejs.org 安装。'
  read -r -p '按回车退出' ignored
  exit 1
fi
if [ ! -d node_modules ]; then npm ci --no-audit --no-fund; fi
if [ ! -f dist/index.html ]; then npm run build; fi
node scripts/start.mjs

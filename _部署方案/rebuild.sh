#!/usr/bin/env bash
# 重新构建并重启某个项目
# 用法：bash rebuild.sh <项目名>
#   home / rights / arpu / qqtlocal / notice / qqt / bmcc
#   或 all 全部重构
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix 2>/dev/null)/bin/pm2

TARGET="${1:-}"
if [ -z "$TARGET" ]; then
  cat <<EOF
用法：bash rebuild.sh <name>

可选 name：
  home       - 重构 cookie-app（vite build + pm2 restart）
  rights     - 重构 bj-cmcc-qy（vite build + pm2 restart）
  qqt        - 重构 qqt（vite build + pm2 restart）
  bmcc       - 重构北京移动业务查询退订（vite build + pm2 restart）
  arpu       - 只重启 arpu-proxy（无构建步骤）
  qqtlocal   - 只重启 qqtlocal（无构建步骤）
  notice     - 只重启 cmcc-notice（无构建步骤）
  all        - 全部重新构建 + 重启
EOF
  exit 0
fi

rebuild_home() {
  sep "重构 cookie-app (home)"
  cd "$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app" || return 1
  npm run build && ok "前端已构建"
  "$PM2" restart cookie-app --update-env
  ok "cookie-app 已重启"
}

rebuild_rights() {
  sep "重构 bj-cmcc-qy (rights)"
  cd "$HOME/CMCC-PROJECT/bj-cmcc-qy" || return 1
  npm run build && ok "前端已构建"
  "$PM2" restart rights-backend --update-env
  ok "rights-backend 已重启"
}

rebuild_qqt() {
  sep "重构 qqt"
  cd "$HOME/CMCC-PROJECT/qqt" || return 1
  npm run build && ok "前端已构建"
  "$PM2" restart qqt-backend --update-env
  ok "qqt-backend 已重启"
}

rebuild_bmcc() {
  sep "重构北京移动业务查询退订 (bmcc)"
  cd "$HOME/CMCC-PROJECT/bj-mobile-business-local" || return 1
  npm run build && ok "前端已构建"
  "$PM2" restart bmcc-backend --update-env
  ok "bmcc-backend 已重启"
}

restart_arpu() {
  sep "重启 arpu-proxy"
  "$PM2" restart arpu-proxy --update-env
}
restart_qqtlocal() {
  sep "重启 qqtlocal"
  "$PM2" restart qqtlocal --update-env
}
restart_notice() {
  sep "重启 cmcc-notice"
  "$PM2" restart cmcc-notice --update-env
}

case "$TARGET" in
  home) rebuild_home ;;
  rights) rebuild_rights ;;
  qqt) rebuild_qqt ;;
  bmcc) rebuild_bmcc ;;
  arpu) restart_arpu ;;
  qqtlocal) restart_qqtlocal ;;
  notice) restart_notice ;;
  all)
    rebuild_home
    rebuild_rights
    rebuild_qqt
    rebuild_bmcc
    restart_arpu
    restart_qqtlocal
    restart_notice
    ;;
  *) bad "未知项目：$TARGET"; exit 1 ;;
esac

sep "完成。当前状态："
"$PM2" status

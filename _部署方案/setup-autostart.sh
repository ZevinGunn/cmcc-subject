#!/usr/bin/env bash
# 设置 PM2 + nginx + docker 开机自启
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

PM2="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
[ ! -x "$PM2" ] && PM2=$(npm config get prefix 2>/dev/null)/bin/pm2

sep "1. 当前 pm2 状态"
"$PM2" status

sep "2. 保存当前 pm2 进程清单（开机后会 resurrect）"
"$PM2" save

sep "3. 写 PM2 LaunchAgent（必要时按提示输 sudo 密码）"
echo "  -- pm2 startup launchd 命令输出：--"
"$PM2" startup launchd 2>&1 | tee /tmp/pm2-startup.out

# 自动找出输出里的 sudo 命令并执行
SUDO_CMD=$(grep -E "^sudo " /tmp/pm2-startup.out | head -1)
if [ -n "$SUDO_CMD" ]; then
  echo "  -- 执行：$SUDO_CMD --"
  eval "$SUDO_CMD"
  ok "LaunchAgent 已安装"
else
  ok "pm2 已经设置过自启（或不需要 sudo）"
fi

sep "4. 确认 nginx LaunchAgent"
brew services list | grep -E "nginx|postgres"

sep "5. 提示 Docker 自启（必须 GUI 设置一次）"
echo "  Docker Desktop → Settings → General → 勾选 'Start Docker Desktop when you sign in to your computer'"
echo "  cookie-app 依赖的 PG 在 Docker 容器里，Docker 不起 PG 就不在"

sep "完成"
echo "  以后重启 Mac 不用手动启动任何东西，全部自动拉起。"
echo "  如果需要手动一键启动：bash ~/CMCC-PROJECT/_部署方案/start-all.sh"

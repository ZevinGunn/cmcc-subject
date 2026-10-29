// PM2 进程清单
// 使用：cd ~/CMCC-PROJECT && pm2 start ecosystem.config.cjs && pm2 save
// 把 /Users/ZevinGunn 改成真实家目录

const apps = [
    ...require("../ct189-local/ecosystem.public.config.cjs").apps,
    {
      name: "cookie-app",
      cwd: "/Users/ZevinGunn/CMCC-PROJECT/免登录进入全球通/cookie-app",
      script: "/Users/ZevinGunn/CMCC-PROJECT/免登录进入全球通/cookie-app/node_modules/tsx/dist/cli.mjs",
      args: "api/server.ts",
      env: { NODE_ENV: "production", PORT: "3101" },
      max_memory_restart: "1G",
    },
    {
      name: "rights-backend",
      cwd: "/Users/ZevinGunn/CMCC-PROJECT/bj-cmcc-qy/backend",
      script: "src/server.js",
      env: { NODE_ENV: "production", PORT: "3010" },
    },
    {
      name: "arpu-proxy",
      cwd: "/Users/ZevinGunn/CMCC-PROJECT/好礼多多本地版查询",
      script: "proxy-server.js",
      env: { NODE_ENV: "production", PORT: "3000" },
    },
    {
      name: "contract3-query",
      cwd: "/Users/ZevinGunn/CMCC-PROJECT/contract3-query",
      script: "server.js",
      env: { NODE_ENV: "production", HOST: "127.0.0.1", PORT: "3002" },
    },
    {
      name: "cmcc-notice",
      cwd: "/Users/ZevinGunn/CMCC-PROJECT/cmcc-notice",
      script: "server.js",
      env: { NODE_ENV: "production", PORT: "3111" },
    },
    {
      name: "qqt-backend",
      cwd: "/Users/ZevinGunn/CMCC-PROJECT/qqt/backend",
      script: "src/index.js",
      env: { NODE_ENV: "production", PORT: "7607" },
    },
    {
      name: "qqtlocal",
      cwd: "/Users/ZevinGunn/CMCC-PROJECT/qqtlocal-rights",
      script: "venv/bin/python",
      args: "-m uvicorn backend.app:app --host 127.0.0.1 --port 8899",
      interpreter: "none",
      env: { NODE_ENV: "production", PORT: "8899", QQT_HOST: "127.0.0.1", QQT_PORT: "8899" },
    },
    {
      name: "bmcc-backend",
      cwd: "/Users/ZevinGunn/CMCC-PROJECT/bj-mobile-business-local/backend",
      script: "src/server.js",
      env: { NODE_ENV: "production", PORT: "8788" },
    },
    {
      name: "bjcmcc-route-hub",
      cwd: "/Users/ZevinGunn/CMCC-PROJECT/bjcmcc-route-hub/backend",
      script: "src/server.js",
      env: { NODE_ENV: "production", HOST: "127.0.0.1", PORT: "8790" },
    },
    {
      name: "bmcc-tunnel",
      cwd: "/Users/ZevinGunn/CMCC-PROJECT",
      script: "/opt/homebrew/bin/cloudflared",
      args: "tunnel --config /Users/ZevinGunn/.cloudflared/cmcc-bmcc.yml run 22aeed61-cece-43a0-b810-7080da91cfb7",
      env: { NODE_ENV: "production" },
      kill_timeout: 35000,
    },
    {
      name: "wangka-order",
      cwd: "/Users/ZevinGunn/CMCC-PROJECT/wangka-order-local",
      script: "python3",
      args: "server.py --port 8787",
      interpreter: "none",
      env: { NODE_ENV: "production", PORT: "8787" },
    },
    {
      name: "yunpan-login",
      cwd: "/Users/ZevinGunn/CMCC-PROJECT/云盘/yunpan-login-local",
      script: "src/server.js",
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: "7399",
      },
    },
    {
      name: "tools-workbench",
      cwd: "/Users/ZevinGunn/CMCC-PROJECT/tools-workbench",
      script: "server.mjs",
      env: { NODE_ENV: "production", PORT: "4177" },
    },
    {
      name: "project-manager",
      cwd: "/Users/ZevinGunn/CMCC-PROJECT/project-manager",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: "7800",
        PATH: "/Users/ZevinGunn/.nvm/versions/node/v18.20.8/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin",
      },
    },
];

const resilientDefaults = {
  autorestart: true,
  min_uptime: "10s",
  exp_backoff_restart_delay: 200,
  kill_timeout: 10000,
  time: true,
};

module.exports = {
  // Project Ops loads its own .env at process start; no app inherits manager credentials from PM2.
  apps: apps.map((app) => ({ ...resilientDefaults, ...app, filter_env: ["MANAGER_"] })),
};

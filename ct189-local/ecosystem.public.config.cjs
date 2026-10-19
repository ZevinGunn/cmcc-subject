const path = require("node:path");
const os = require("node:os");
const root = __dirname;
module.exports = {
  apps: [
    {
      name: "ct189-service",
      cwd: path.join(root, "backend"),
      script: "src/server.js",
      interpreter: path.join(
        os.homedir(),
        ".nvm/versions/node/v22.22.3/bin/node",
      ),
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: "5710",
        CT189_PUBLIC_ORIGIN: "https://ct189.1008086.xyz",
      },
      autorestart: true,
      kill_timeout: 12000,
      min_uptime: "10s",
      exp_backoff_restart_delay: 200,
      max_memory_restart: "1G",
      time: true,
      filter_env: ["MANAGER_"],
    },
    {
      name: "ct189-tunnel",
      cwd: root,
      script: "/opt/homebrew/bin/cloudflared",
      interpreter: "none",
      args: [
        "tunnel",
        "--config",
        path.join(root, ".public/tunnel.yml"),
        "run",
      ],
      autorestart: true,
      kill_timeout: 35000,
      min_uptime: "10s",
      exp_backoff_restart_delay: 200,
      time: true,
      filter_env: ["MANAGER_"],
    },
  ],
};

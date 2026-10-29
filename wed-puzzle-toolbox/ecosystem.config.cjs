const path = require('node:path')
module.exports = { apps: [{
  name: 'wed-puzzle-toolbox',
  cwd: __dirname,
  script: 'api/server.ts',
  interpreter: process.env.WED_NODE || '/Users/ZevinGunn/.volta/tools/image/node/20.20.2/bin/node',
  node_args: '--import tsx',
  env: { NODE_ENV: 'production', PORT: '4186', WED_PUBLIC_ORIGIN: 'https://home.1008086.xyz', WED_AUTH_ORIGIN: 'http://127.0.0.1:3101', WED_DATA_DIR: path.join(__dirname, 'data') },
  instances: 1, exec_mode: 'fork', watch: false, kill_timeout: 25000,
  min_uptime: '15s', max_restarts: 10, exp_backoff_restart_delay: 1500, max_memory_restart: '512M',
}] }

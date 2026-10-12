const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// A long-running PM2 daemon may retain Node 18 in PATH. Use this project's
// Volta version, or an explicit runtime, without changing other applications.
const voltaNode = path.join(os.homedir(), '.volta', 'bin', 'node');
const interpreter = process.env.YUNPAN_NODE_PATH || (fs.existsSync(voltaNode) ? voltaNode : process.execPath);
const version = spawnSync(interpreter, ['-p', 'process.versions.node.split(".")[0]'], { cwd: __dirname, encoding: 'utf8', timeout: 5000 });
if (version.status !== 0 || Number(version.stdout.trim()) < 20) {
  throw new Error('yunpan-login 需要 Node 20 或更新版本，请设置 YUNPAN_NODE_PATH');
}

module.exports = {
  apps: [{
    name: 'yunpan-login', cwd: __dirname, script: 'src/server.js', interpreter,
    instances: 1, exec_mode: 'fork', log_date_format: 'YYYY-MM-DDTHH:mm:ss',
    env: { HOST: '127.0.0.1', PORT: '7399', NODE_ENV: 'production' }
  }]
};

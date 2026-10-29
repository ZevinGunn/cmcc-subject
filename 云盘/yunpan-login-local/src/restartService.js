import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const appDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nvmDirectory = path.join(process.env.NVM_DIR || path.join(os.homedir(), '.nvm'), 'versions', 'node');
// PM2 can be installed under an older nvm version while this application uses
// Node 20. Locate its existing CLI without installing another daemon or package.
let nvmCandidates = [];
if (fs.existsSync(nvmDirectory)) {
  nvmCandidates = fs.readdirSync(nvmDirectory).filter(name => /^v\d+\.\d+\.\d+$/.test(name))
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
    .map(name => path.join(nvmDirectory, name, 'bin', 'pm2'));
}
const candidates = process.env.YUNPAN_PM2_PATH ? [process.env.YUNPAN_PM2_PATH] : [
  ...String(process.env.PATH || '').split(path.delimiter).map(directory => path.join(directory, 'pm2')),
  path.join(os.homedir(), '.volta', 'bin', 'pm2'), ...nvmCandidates
];
const executable = candidates.find(candidate => {
  try { fs.accessSync(candidate, fs.constants.X_OK); return fs.statSync(candidate).isFile(); }
  catch { return false; }
});
if (!executable) {
  console.error('未找到现有 PM2，请设置 YUNPAN_PM2_PATH');
  process.exit(1);
}
const result = spawnSync(executable, ['startOrReload', path.join(appDirectory, 'ecosystem.config.cjs'),
  '--only', 'yunpan-login', '--update-env', '--silent'], { cwd: appDirectory, stdio: 'inherit' });
if (result.error) console.error('无法执行现有 PM2 服务管理命令');
process.exit(result.status ?? 1);

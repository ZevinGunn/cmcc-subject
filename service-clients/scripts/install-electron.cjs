// 官方下载失败时使用镜像，但始终按 Electron npm 包自带 SHA-256 校验。
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
(async () => {
  const moduleRoot = path.dirname(require.resolve('electron/package.json'));
  const { version } = require(path.join(moduleRoot, 'package.json'));
  const filename = `electron-v${version}-${process.platform}-${process.arch}.zip`;
  const expected = require(path.join(moduleRoot, 'checksums.json'))[filename];
  if (!expected) throw new Error('找不到此平台的官方校验值');
  const cache = path.join(require('node:os').homedir(), '.cache/cmcc-clients/toolchain');
  fs.mkdirSync(cache, { recursive: true });
  const archive = process.env.CLIENT_ELECTRON_ARCHIVE || path.join(cache, filename);
  const valid = () => fs.existsSync(archive) && crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex') === expected;
  if (!valid()) {
    let verified = false;
    for (const url of [`https://github.com/electron/electron/releases/download/v${version}/${filename}`, `https://npmmirror.com/mirrors/electron/${version}/${filename}`]) {
      try { execFileSync('curl', ['-fsSL', '--connect-timeout', '15', '--max-time', '180', url, '-o', archive], { stdio: 'inherit' }); } catch { continue; }
      if (valid()) { verified = true; break; }
    }
    if (!verified) throw new Error('Electron 下载或校验失败');
  }
  const { extract } = require('@electron-internal/extract-zip');
  await extract(archive, { dir: path.join(moduleRoot, 'dist') });
  fs.writeFileSync(path.join(moduleRoot, 'path.txt'), process.platform === 'darwin' ? 'Electron.app/Contents/MacOS/Electron' : process.platform === 'win32' ? 'electron.exe' : 'electron');
  console.log(`Electron ${version} ${process.platform}/${process.arch} 官方校验通过`);
})().catch(error => { console.error(error.message); process.exitCode = 1; });

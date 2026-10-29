const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { getCacheDirectory } = require('app-builder-lib/out/util/electronGet');
const { nsisChecksums } = require('app-builder-lib/out/toolsets/windows');
const cache = getCacheDirectory({ allowEnvVarOverride: true });
const platform = os.platform(), arch = os.arch();
const zipName = platform === 'darwin' ? `7zip-darwin-${arch === 'arm64' ? 'arm64' : 'x86_64'}.tar.gz`
  : platform === 'win32' ? `7zip-win-${arch}.tar.gz` : `7zip-linux-${arch}.tar.gz`;
const zipHashes = {
  '7zip-darwin-arm64.tar.gz': '496a341abe210aae1a25bc202ee97f6de6c76a3dc80f91d96616be05502d72c1',
  '7zip-darwin-x86_64.tar.gz': '496a341abe210aae1a25bc202ee97f6de6c76a3dc80f91d96616be05502d72c1',
  '7zip-win-x64.tar.gz': 'be071f15bd6da2f78fe81c6ddef2009b0c4d8a51f36b780cb806c7e6df95e1b3',
  '7zip-win-arm64.tar.gz': 'ac3f38f96ce7498096a123bb0862dd6db863a7353c9e9e1c15f73c183adf6620',
  '7zip-linux-x64.tar.gz': 'd151bb44b2a9d9bfc52813ce4cac042916394a0ab8a56bd5d221a5dc9ef8d5d7',
  '7zip-linux-arm64.tar.gz': '5aff5034206b78f8261249ceb922b5c7e04c9bdb733784d8f5b6df9732cf1f79'
};
const tools = [
  ['nsis@1.2.1', 'nsis-bundle-3.12.tar.gz', nsisChecksums['1.2.1']['nsis-bundle-3.12.tar.gz']],
  ['7zip@1.0.0', zipName, zipHashes[zipName]],
  ...(platform === 'darwin' ? [['dmg-builder@1.2.5', `dmgbuild-bundle-${arch === 'arm64' ? 'arm64' : 'x86_64'}-75c8a6c.tar.gz`, arch === 'arm64' ? '793404d0c96687e27d5ee40a668d498c92e36a64d6c2906df511031adb33cbeb' : '1664972f9cc2d6e8fce3b63e42cd30078aff602669c5856939c4519921200433']] : [])
];
for (const [release, name, expected] of tools) {
  if (!expected) throw new Error(`尚未配置 ${name} 的校验值`);
  const directory = path.join(cache, release); fs.mkdirSync(directory, { recursive: true });
  const archive = path.join(directory, name);
  const valid = () => fs.existsSync(archive) && crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex') === expected;
  if (!valid()) {
    console.log(`准备构建工具：${name}`);
    for (const base of ['https://npmmirror.com/mirrors/electron-builder-binaries/', 'https://github.com/electron-userland/electron-builder-binaries/releases/download/']) {
      try { execFileSync('curl', ['-fsSL', '--connect-timeout', '15', '--max-time', '120', `${base}${release}/${name}`, '-o', archive], { stdio: 'inherit' }); } catch { continue; }
      if (valid()) break;
    }
  }
  if (!valid()) throw new Error(`${name} 下载或 SHA-256 校验失败`);
  console.log(`${name} SHA-256 校验通过`);
}

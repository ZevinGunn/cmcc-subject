const fs = require('node:fs/promises');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const sharp = require('sharp');
(async () => {
  const root = path.resolve(__dirname, '..');
  const source = path.join(root, 'assets/icon.svg');
  await sharp(source).resize(1024).png().toFile(path.join(root, 'assets/icon.png'));
  const { default: pngToIco } = await import('png-to-ico');
  await fs.writeFile(path.join(root, 'assets/icon.ico'), await pngToIco(path.join(root, 'assets/icon.png')));
  if (process.platform === 'darwin') {
    const dir = path.join(root, 'artifacts/icon.iconset');
    await fs.mkdir(dir, { recursive: true });
    for (const size of [16, 32, 128, 256, 512]) {
      for (const scale of [1, 2]) {
        await sharp(source).resize(size * scale).png().toFile(path.join(dir, `icon_${size}x${size}${scale === 2 ? '@2x' : ''}.png`));
      }
    }
    execFileSync('/usr/bin/iconutil', ['-c', 'icns', dir, '-o', path.join(root, 'assets/icon.icns')]);
  }
  console.log('应用图标已生成');
})().catch(error => { console.error(error.message); process.exitCode = 1; });

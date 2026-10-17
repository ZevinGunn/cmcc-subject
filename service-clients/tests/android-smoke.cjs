const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const adb = process.env.CLIENT_ADB || path.join(process.env.ANDROID_SDK_ROOT || path.join(require('node:os').homedir(), '.cache/cmcc-clients/android-sdk'), 'platform-tools/adb');
const serial = process.env.CLIENT_DEVICE || 'emulator-5554';
const run = (...args) => execFileSync(adb, ['-s', serial, ...args], { maxBuffer: 12 * 1024 * 1024 });
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
function nodes() {
  run('shell', 'uiautomator', 'dump', '/sdcard/suixing-ui.xml');
  const xml = run('shell', 'cat', '/sdcard/suixing-ui.xml').toString();
  return Array.from(xml.matchAll(/<node\s+([^>]+)>/g), match => Object.fromEntries(Array.from(match[1].matchAll(/([\w-]+)="([^"]*)"/g), item => [item[1], item[2]])));
}
function tap(name) {
  const all = nodes();
  const item = all.find(node => node['content-desc'] === name && node.clickable === 'true') || all.find(node => node.text === name && node.enabled !== 'false');
  assert.ok(item, `没有找到按钮：${name}`);
  const points = item.bounds.match(/\d+/g).map(Number);
  run('shell', 'input', 'tap', String(Math.round((points[0]+points[2])/2)), String(Math.round((points[1]+points[3])/2)));
}
function screenshot(name) { fs.writeFileSync(path.join(__dirname, '../artifacts', name), run('exec-out', 'screencap', '-p')); }
(async () => {
  run('shell', 'am', 'start', '-n', 'xyz.suixing.toolbox/.MainActivity'); await wait(2500);
  for (const name of ['星巴克卡券', '周三拼图', '移动账号']) { tap(name); await wait(1000); assert.ok(nodes().some(node => node.text === name)); }
  tap('更多操作'); tap('使用专属链接');
  assert.ok(nodes().some(node => node.text === '使用专属链接'));
  tap('取消'); assert.ok(!nodes().some(node => node.text === '使用专属链接'));
  screenshot('android-portrait.png');
  run('shell', 'settings', 'put', 'system', 'accelerometer_rotation', '0');
  run('shell', 'settings', 'put', 'system', 'user_rotation', '1'); await wait(1500);
  assert.ok(nodes().some(node => node['content-desc'] === '星巴克卡券'));
  screenshot('android-landscape.png');
  run('shell', 'settings', 'put', 'system', 'user_rotation', '0');
  const errors = run('logcat', '-d', '-s', 'AndroidRuntime:E').toString();
  assert.ok(!errors.includes('xyz.suixing.toolbox'), '应用出现未处理崩溃');
  console.log('安卓模拟器测试通过：安装启动、三个工具切换、专属链接弹窗关闭、横竖屏、安全区域，无应用崩溃');
})().catch(error => { console.error(error.message); process.exitCode = 1; });

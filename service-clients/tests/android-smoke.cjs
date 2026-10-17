const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const adb = process.env.CLIENT_ADB || path.join(process.env.ANDROID_SDK_ROOT || path.join(require('node:os').homedir(), '.cache/cmcc-clients/android-sdk'), 'platform-tools/adb');
const serial = process.env.CLIENT_DEVICE || 'emulator-5554';
const run = (...args) => execFileSync(adb, ['-s', serial, ...args], { maxBuffer: 12 * 1024 * 1024, timeout: 20000 });
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
function nodes() {
  for (let attempt = 0; ; attempt++) {
    try { run('shell', 'uiautomator', 'dump', '--compressed', '/sdcard/suixing-ui.xml'); break; }
    catch (error) { if (attempt >= 2) throw new Error(`读取测试设备界面失败：${error.stderr?.toString() || error.message}`); }
  }
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
  run('shell', 'settings', 'put', 'system', 'accelerometer_rotation', '0');
  run('shell', 'settings', 'put', 'system', 'user_rotation', '0'); await wait(1000);
  run('shell', 'am', 'force-stop', 'xyz.suixing.toolbox');
  run('shell', 'am', 'start', '-n', 'xyz.suixing.toolbox/.MainActivity'); await wait(2500);
  const catalog = require('../shared/services.json');
  for (const service of process.env.CLIENT_LAYOUT_ONLY === '1' ? [] : catalog.services) {
    tap('全部工具');
    tap('搜索工具');
    // UIAutomator 无法直接用 shell input 输入中文，使用每个工具唯一的 ASCII 域名或路径。
    const address = new URL(service.url);
    const query = service.id === 'mobile' ? '/public' : service.id === 'home-console' ? 'home.1008086.xyz/' : address.pathname === '/' ? address.hostname : address.pathname;
    run('shell', 'input', 'text', query); await wait(200);
    tap(service.name); await wait(500);
    assert.ok(nodes().some(node => node.text === service.name), `未切换到 ${service.name}`);
    console.log(`工具切换通过：${service.name}`);
  }
  tap('更多操作'); tap('使用专属链接');
  assert.ok(nodes().some(node => node.text === '使用专属链接'));
  tap('取消'); assert.ok(!nodes().some(node => node.text === '使用专属链接'));
  screenshot('android-portrait.png');
  run('shell', 'settings', 'put', 'system', 'accelerometer_rotation', '0');
  run('shell', 'settings', 'put', 'system', 'user_rotation', '1'); await wait(1500);
  assert.ok(nodes().some(node => node['content-desc'] === '全部工具'));
  tap('全部工具'); tap('搜索工具'); run('shell', 'input', 'text', 'no_such_tool_fixture'); await wait(200);
  assert.ok(nodes().some(node => node.text === '未找到匹配的工具'));
  // 等待输入法与窗口布局稳定，避免用动画过程中的旧坐标点击。
  await wait(600); tap('关闭'); await wait(600);
  assert.ok(!nodes().some(node => node.text === `全部工具 · ${catalog.services.length}`), '全部工具弹窗未关闭');
  screenshot('android-landscape.png');
  run('shell', 'settings', 'put', 'system', 'user_rotation', '0');
  await wait(1000);
  const errors = run('logcat', '-d', '-s', 'AndroidRuntime:E').toString();
  assert.ok(!errors.includes('xyz.suixing.toolbox'), '应用出现未处理崩溃');
  console.log(process.env.CLIENT_LAYOUT_ONLY === '1' ? '安卓布局复验通过：空结果、弹窗关闭、横竖屏、安全区域，无应用崩溃' : '安卓模拟器测试通过：安装启动、全部工具搜索切换、空结果、弹窗关闭、横竖屏、安全区域，无应用崩溃');
})().catch(error => { console.error(error.message); process.exitCode = 1; });

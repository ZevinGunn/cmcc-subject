import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import crypto from 'node:crypto'
import { execFileSync, spawnSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export function frontendAssets(html) {
  return [...new Set([...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)(?:[?#][^"]*)?"/g)].map((match) => match[1]))]
}

export async function verifyRelease(base, manifest, dist, request = fetch) {
  const health = await request(new URL(`/api/health?release=${manifest.id}`, base), { signal: AbortSignal.timeout(8000), cache: 'no-store' })
  if (!health.ok) throw new Error(`健康检查 HTTP ${health.status}`)
  const data = await health.json()
  if (data?.data?.status !== 'ok' || data?.data?.release?.id !== manifest.id || data?.data?.release?.revision !== manifest.revision) throw new Error('API 尚未运行目标发布版本')
  const page = await request(new URL(`/public?release=${manifest.id}`, base), { signal: AbortSignal.timeout(8000), cache: 'no-store' })
  if (!page.ok) throw new Error(`页面检查 HTTP ${page.status}`)
  const assets = frontendAssets(await page.text())
  const expected = frontendAssets(fs.readFileSync(path.join(dist, 'index.html'), 'utf8'))
  if (!expected.length || JSON.stringify(assets) !== JSON.stringify(expected)) throw new Error('页面仍引用旧版构建资源')
  for (const asset of expected) {
    const response = await request(new URL(asset, base), { signal: AbortSignal.timeout(8000) })
    if (!response.ok) throw new Error(`构建资源不可用：${asset} HTTP ${response.status}`)
    const local = crypto.createHash('sha256').update(fs.readFileSync(path.join(dist, asset.slice(1)))).digest('hex')
    const remote = crypto.createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex')
    if (remote !== local) throw new Error(`构建资源内容不一致：${asset}`)
  }
}

function resolveGit() {
  const candidates = [process.env.GIT_BIN, '/Library/Developer/CommandLineTools/usr/bin/git', 'git'].filter(Boolean)
  for (const candidate of candidates) {
    try { execFileSync(candidate, ['--version'], { stdio: 'ignore' }); return candidate } catch { /* next */ }
  }
  throw new Error('找不到可用 Git')
}

function resolvePm2() {
  if (process.env.PM2_CLI && fs.existsSync(process.env.PM2_CLI)) return process.env.PM2_CLI
  try { return execFileSync('/usr/bin/which', ['pm2'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() } catch { /* NVM install */ }
  const versions = path.join(os.homedir(), '.nvm/versions/node')
  if (fs.existsSync(versions)) {
    for (const version of fs.readdirSync(versions).sort().reverse()) {
      const candidate = path.join(versions, version, 'lib/node_modules/pm2/bin/pm2')
      if (fs.existsSync(candidate)) return candidate
    }
  }
  throw new Error('找不到 PM2 CLI，请设置 PM2_CLI')
}

function readManifest(directory) {
  try { return JSON.parse(fs.readFileSync(path.join(directory, 'version.json'), 'utf8')) } catch { return null }
}

function assetFiles(directory) {
  const files = []
  function walk(relative) {
    const absolute = path.join(directory, relative)
    if (!fs.existsSync(absolute)) return
    for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
      const child = path.join(relative, entry.name)
      if (entry.isDirectory()) walk(child)
      else if (entry.isFile()) files.push(child)
    }
  }
  walk('assets')
  return files.sort()
}

async function waitForRelease(base, manifest, dist) {
  let reason
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try { await verifyRelease(base, manifest, dist); return } catch (error) { reason = error }
    if (attempt < 7) await new Promise((resolve) => setTimeout(resolve, 1500))
  }
  throw new Error(`${new URL(base).host} 发布验证失败：${reason.message}`)
}

export async function release() {
  const git = resolveGit()
  const pm2 = resolvePm2()
  const revision = execFileSync(git, ['rev-parse', '--short=12', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
  execFileSync(git, ['diff', '--quiet', 'HEAD', '--'], { cwd: root, stdio: 'ignore' })
  const untracked = execFileSync(git, ['ls-files', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8' }).split('\n')
  if (untracked.some((file) => /^(api|src|scripts|shared)\//.test(file) && !file.includes('.bak'))) throw new Error('请先提交新增源码，再发布')
  const processes = JSON.parse(execFileSync(process.execPath, [pm2, 'jlist'], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }))
  const service = processes.find((item) => item.name === (process.env.COOKIE_APP_PM2_NAME || 'cookie-app'))
  if (!service || path.resolve(service.pm2_env.pm_cwd) !== root || service.pm2_env.status !== 'online') throw new Error('未找到当前仓库对应的在线 PM2 服务')
  const port = Number(service.pm2_env.PORT || service.pm2_env.API_PORT || 3101)
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PM2 服务端口无效')
  const publicBase = process.env.PUBLIC_BASE_URL || 'https://home.1008086.xyz'
  if (!['https:', 'http:'].includes(new URL(publicBase).protocol)) throw new Error('PUBLIC_BASE_URL 无效')
  const manifest = { id: `${new Date().toISOString().replace(/[:.]/g, '-')}-${revision}`, revision, builtAt: new Date().toISOString() }
  const deploy = path.join(root, '.deploy')
  const lock = path.join(deploy, 'release.lock')
  fs.mkdirSync(deploy, { recursive: true })
  try { fs.mkdirSync(lock) } catch { throw new Error('已有发布锁，请确认其他发布已结束后再处理 .deploy/release.lock') }
  const staging = path.join(deploy, `staging-${manifest.id}`)
  const releases = path.join(deploy, 'releases')
  const target = path.join(releases, manifest.id)
  const dist = path.join(root, 'dist')
  const temporaryLink = path.join(deploy, `dist-link-${manifest.id}`)
  const logPath = path.join(deploy, `${manifest.id}.log`)
  const log = fs.openSync(logPath, 'a')
  let previous
  let switched = false
  function run(command, args, step) {
    console.log(`[release] ${step}`)
    const result = spawnSync(command, args, { cwd: root, stdio: ['ignore', log, log], env: process.env })
    if (result.error || result.status !== 0) throw new Error(`${step}失败，日志：${logPath}`)
  }
  function switchTo(directory) {
    if (fs.existsSync(temporaryLink)) fs.unlinkSync(temporaryLink)
    fs.symlinkSync(directory, temporaryLink, 'dir')
    fs.renameSync(temporaryLink, dist)
  }
  try {
    run('npm', ['run', 'check'], '类型检查')
    run('npm', ['test'], 'API 与 UI 测试')
    run('npm', ['run', 'test:release'], '发布流程测试')
    run('npm', ['run', 'build', '--', '--outDir', staging], '构建新 dist')
    const builtRevision = execFileSync(git, ['rev-parse', '--short=12', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
    if (builtRevision !== revision) throw new Error('验证期间 Git 版本发生变化，请重新发布')
    execFileSync(git, ['diff', '--quiet', 'HEAD', '--'], { cwd: root, stdio: 'ignore' })
    manifest.assets = assetFiles(staging)
    fs.writeFileSync(path.join(staging, 'version.json'), JSON.stringify(manifest, null, 2) + '\n')
    run('tar', ['-czf', path.join(deploy, `dist-${manifest.id}.tar.gz`), '-C', staging, '.'], '生成 dist 压缩包')
    fs.mkdirSync(releases, { recursive: true })
    const retained = fs.readdirSync(releases).sort().reverse().slice(0, 2).map((name) => path.join(releases, name))
    if (fs.existsSync(dist)) {
      previous = fs.realpathSync(dist)
      if (!retained.includes(previous)) retained.unshift(previous)
    }
    // Keep previous content-hashed assets so already-open pages can finish lazy loading.
    for (const directory of retained) {
      const assets = readManifest(directory)?.assets || assetFiles(directory)
      for (const asset of assets) {
        if (typeof asset !== 'string' || !asset.startsWith('assets/') || asset.split('/').includes('..')) continue
        const destination = path.join(staging, asset)
        if (fs.existsSync(destination) || !fs.existsSync(path.join(directory, asset))) continue
        fs.mkdirSync(path.dirname(destination), { recursive: true })
        fs.copyFileSync(path.join(directory, asset), destination)
      }
    }
    fs.renameSync(staging, target)
    if (fs.existsSync(dist) && !fs.lstatSync(dist).isSymbolicLink()) {
      previous = path.join(deploy, `baseline-${manifest.id}`)
      fs.renameSync(dist, previous)
    }
    switchTo(target)
    switched = true
    run(process.execPath, [pm2, 'reload', service.name], '重载 cookie-app 服务')
    await waitForRelease(`http://127.0.0.1:${port}`, manifest, dist)
    await waitForRelease(publicBase, manifest, dist)
    console.log(`[release] 发布成功：${manifest.id}`)
    console.log(`[release] 公网版本已验证：${new URL(publicBase).origin}`)
    console.log(`[release] 压缩包：${path.join(deploy, `dist-${manifest.id}.tar.gz`)}`)
  } catch (error) {
    if (previous && switched) {
      switchTo(previous)
      try { run(process.execPath, [pm2, 'reload', service.name], '恢复上一版 dist 并重载服务') } catch { /* report original failure */ }
      console.error('[release] 已恢复上一版前端产物；后端源码回滚需另行处理')
    } else if (previous && !fs.existsSync(dist)) switchTo(previous)
    throw error
  } finally {
    fs.closeSync(log)
    if (fs.existsSync(temporaryLink)) fs.unlinkSync(temporaryLink)
    fs.rmSync(lock, { recursive: true, force: true })
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  release().catch((error) => { console.error(`[release] ${error.message}`); process.exitCode = 1 })
}

import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { authenticate, checkSource, sessionCookies, AccessError } from '../api/access.js'
import { Contexts } from '../api/contexts.js'

test('来源严格区分公网和本机，不能把公网请求伪装成本机 origin', () => {
  const check = (host: string, origin?: string) => checkSource(host, origin, 4186, 'https://home.1008086.xyz')
  assert.equal(check('home.1008086.xyz', 'https://home.1008086.xyz'), true)
  assert.equal(check('home.1008086.xyz', 'http://127.0.0.1:4186'), false)
  assert.equal(check('127.0.0.1:4186', 'https://home.1008086.xyz'), false)
  assert.equal(check('home.1008086.xyz', 'https://evil.example'), false)
  assert.equal(check('evil.example'), false)
  assert.equal(check('localhost:4186', 'http://localhost:4187'), true)
  assert.equal(checkSource('home.1008086.xyz', undefined, 4186), false)
  assert.equal(sessionCookies('phone=secret; user_session=test; admin_session=other; arbitrary=1'), 'user_session=test; admin_session=other')
})

test('身份隔离、加密持久化、跨身份串行锁和任务会话复核', async t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wed-owner-test-')), contexts = new Contexts(dir)
  t.after(() => { contexts.close(); fs.rmSync(dir, { recursive: true, force: true }) })
  const a = contexts.get({ key: 'user:a', kind: 'user', name: 'A' }), b = contexts.get({ key: 'user:b', kind: 'user', name: 'B' }), local = contexts.get({ key: 'local', kind: 'local', name: '本机' })
  a.store.state.accounts.push({ id: 'a-only', phone: '13900000001', source: 'appck', identityKey: 'one', credential: { cookie: 'secret-test' }, activityCookie: 'secret-test', updatedAt: new Date().toISOString() }); a.store.save()
  assert.equal(b.store.view().accounts.length, 0)
  assert.equal(local.store.view().accounts.length, 0)
  assert.throws(() => b.store.account('a-only'))
  assert.equal(fs.readFileSync(path.join(a.store.dir, 'state.enc')).includes('secret-test'), false)
  let release!: () => void
  const running = a.engine.exclusive(() => new Promise<void>(resolve => { release = resolve }))
  await assert.rejects(b.engine.exclusive(async () => {}), /串行队列/)
  release(); await running
  await b.engine.exclusive(async () => {})
  a.verifyJob = async () => { throw new AccessError(403, '权限已撤销') }
  await assert.rejects(a.engine.io.query('a-only'), /权限已撤销/)
})

test('公网 API 登录、权限、撤权、上游故障、非法来源及子路径资源', async t => {
  let revoked = false, authDown = false, calls = 0
  const mock = http.createServer((req, res) => {
    calls++; res.setHeader('Content-Type', 'application/json')
    assert.equal(req.headers['x-portal-admin'], undefined)
    assert.equal(req.headers['x-portal-admin-secret'], undefined)
    assert.equal(req.headers.cookie?.includes('foreign='), false)
    if (authDown) { res.writeHead(503).end('{}'); return }
    if (req.url === '/api/wed-puzzle/toolbox/accounts') {
      assert.equal(req.headers['x-wed-toolbox'], '1')
      assert.equal(req.headers['x-wed-identity'], 'user:user-1')
      res.end(JSON.stringify({ ok: true, data: { accounts: [], skipped: 2 } })); return
    }
    const admin = req.url === '/api/admin/me', cookie = req.headers.cookie || ''
    if (admin && cookie.includes('admin_session=good')) { res.end(JSON.stringify({ ok: true, data: { admin: { id: 'admin-1', username: 'admin' } } })); return }
    if (!admin && /user_session=(good|limited|second)/.test(cookie)) {
      const limited = cookie.includes('user_session=limited') || revoked, second = cookie.includes('user_session=second')
      res.end(JSON.stringify({ ok: true, data: { user: { id: second ? 'user-2' : 'user-1', username: 'user', permissions: { benefitActivity: !limited } } } })); return
    }
    res.writeHead(401).end(JSON.stringify({ ok: false }))
  })
  await new Promise<void>(resolve => mock.listen(0, '127.0.0.1', resolve))
  const authOrigin = `http://127.0.0.1:${(mock.address() as import('node:net').AddressInfo).port}`
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wed-public-test-'))
  const server = spawn(process.execPath, ['--import', 'tsx', 'api/server.ts'], { cwd: path.resolve(import.meta.dirname, '..'), env: { ...process.env, PORT: '4196', WED_DATA_DIR: dir, WED_PUBLIC_ORIGIN: 'https://home.1008086.xyz', WED_AUTH_ORIGIN: authOrigin }, stdio: ['ignore', 'pipe', 'pipe'] })
  t.after(async () => { server.kill('SIGTERM'); if (server.exitCode === null) await once(server, 'exit'); await new Promise<void>(resolve => mock.close(() => resolve())); fs.rmSync(dir, { recursive: true, force: true }) })
  await new Promise<void>((resolve, reject) => { server.stdout.once('data', () => resolve()); server.once('exit', code => reject(new Error(`服务启动失败 ${code}`))); server.stderr.once('data', chunk => reject(new Error(String(chunk)))) })
  // Node's built-in fetch can replace Host with the URL host; exercise a real proxy Host using http.request.
  const request = (url = '/wed-puzzle/api/state', cookie = '', extra = {}, method = 'GET', body?: string) => new Promise<Response>((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:4196${url}`, { method, headers: { Host: 'home.1008086.xyz', 'X-Wed-Toolbox': '1', Cookie: cookie, ...extra } }, res => {
      const chunks: Buffer[] = []; res.on('data', chunk => chunks.push(chunk)); res.on('end', () => resolve(new Response(Buffer.concat(chunks), { status: res.statusCode, headers: res.headers as Record<string, string> })))
    }); req.on('error', reject); req.end(body)
  })
  const absent = await request(); assert.equal(absent.status, 401); assert.equal(calls, 0)
  assert.deepEqual((await (await request('/wed-puzzle/api/health')).json()).features, ['pool-relay'])
  assert.equal((await request('/wed-puzzle/api/relay/preview', '', { 'Content-Type': 'application/json' }, 'POST', JSON.stringify({ scope: [], targets: [], start: 2, end: 3 }))).status, 401)
  assert.equal((await request('/wed-puzzle/api/relay/preview', 'user_session=limited', { 'Content-Type': 'application/json' }, 'POST', JSON.stringify({ scope: [], targets: [], start: 2, end: 3 }))).status, 403)
  assert.equal((await request(undefined, 'user_session=limited')).status, 403)
  const user = await request(undefined, 'foreign=do-not-forward; user_session=good', { 'x-portal-admin': 'true', 'x-portal-admin-secret': 'untrusted' })
  assert.equal(user.status, 200); assert.equal((await user.json()).identity.key, 'user:user-1')
  assert.equal((await request(undefined, 'user_session=second')).status, 200)
  assert.equal((await request(undefined, 'admin_session=good')).status, 200)
  const imported = await request('/wed-puzzle/api/accounts/import-cookieapp', 'user_session=good', {}, 'POST')
  assert.equal(imported.status, 200)
  let snapshot = await imported.json()
  assert.ok(snapshot.importJob?.id)
  for (let attempt = 0; attempt < 20 && snapshot.importJob.status === 'running'; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 10))
    snapshot = await (await request(undefined, 'user_session=good')).json()
  }
  assert.equal(snapshot.importJob.status, 'completed'); assert.equal(snapshot.importJob.skipped, 2)
  assert.equal((await (await request(undefined, 'user_session=second')).json()).importJob, undefined)
  assert.equal((await request('/wed-puzzle/api/accounts/import-cookieapp', 'user_session=limited', {}, 'POST')).status, 403)
  assert.equal(fs.readdirSync(path.join(dir, 'owners')).length, 3)
  revoked = true; assert.equal((await request(undefined, 'user_session=good')).status, 403); revoked = false
  authDown = true; assert.equal((await request(undefined, 'user_session=good')).status, 503); authDown = false
  assert.equal((await request(undefined, 'user_session=good', { Origin: 'https://evil.example' })).status, 403)
  assert.equal((await request(undefined, '', { 'X-Wed-Toolbox': '' })).status, 403)
  assert.equal((await request('/api/state')).status, 401, '旧 API 地址不能绕过鉴权')
  const post = await request('/wed-puzzle/api/auth/sms', '', { 'Content-Type': 'application/json' }, 'POST', JSON.stringify({ phone: '13900000001' })); assert.equal(post.status, 401)
  const local = await fetch('http://127.0.0.1:4196/wed-puzzle/api/state', { headers: { 'X-Wed-Toolbox': '1' } }); assert.equal((await local.json()).identity.kind, 'local')
  const page = await request('/wed-puzzle/'); assert.equal(page.status, 200); const html = await page.text()
  const asset = html.match(/src="([^"]+\.js)"/)?.[1]; assert.ok(asset?.startsWith('/wed-puzzle/assets/')); assert.equal((await request(asset)).status, 200)
  const redirect = await fetch('http://127.0.0.1:4196/', { redirect: 'manual' }); assert.equal(redirect.headers.get('location'), '/wed-puzzle/')
  await assert.rejects(authenticate('user_session=invalid', authOrigin), (e: unknown) => e instanceof AccessError && e.status === 401)
})

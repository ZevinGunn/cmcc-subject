import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { CookieAppBridge, newImportJob, runCookieAppImport } from '../api/cookieAppImport.js'
import { AccessError } from '../api/access.js'
import { Store, type Account } from '../api/store.js'
import { Client } from '../api/client.js'

const account = (phone: string, error?: string): Account => ({ id: phone, phone, source: 'cookieapp', identityKey: phone, credential: { cookie: 'test-secret' }, activityCookie: 'test-secret', updatedAt: '', error })
test('顺序导入、同手机号去重、更新旧账号、部分失败和错误脱敏', async () => {
  const job = newImportJob(), events: string[] = []
  const rows = ['13900000001', '13900000002', '13900000001', '13900000003', '13900000004'].map((phone, i) => ({ id: String(i), phone }))
  let active = false, saved = 0
  await runCookieAppImport(job, {
    list: async () => ({ accounts: rows, skipped: 2 }), verify: async () => {},
    credential: async row => { assert.equal(active, false); active = true; events.push(`credential:${row.phone}`); return 'test-secret' },
    exists: phone => phone.endsWith('2'), save: () => { saved++ },
    add: async (_cookie, phone) => { events.push(`add:${phone}`); active = false; if (phone.endsWith('3')) throw new Error('HTTP error Cookie=test-secret phone=13900000003'); return account(phone, phone.endsWith('4') ? '查询失败' : undefined) },
  })
  assert.equal(job.status, 'completed'); assert.equal(job.processed, 5)
  assert.equal(job.imported, 2); assert.equal(job.updated, 1); assert.equal(job.skipped, 3); assert.equal(job.failed, 1)
  assert.equal(events.length, 8); assert.ok(saved >= 7)
  assert.equal(JSON.stringify(job).includes('test-secret'), false)
  assert.equal(JSON.stringify(job).includes('13900000003'), false)
  assert.match(job.results.at(-1)!.message, /库存查询失败/)
})
test('撤销权限后立即中断，不读取或导入下一个号码', async () => {
  const job = newImportJob(); let count = 0
  await runCookieAppImport(job, {
    list: async () => ({ accounts: [1, 2].map(i => ({ id: String(i), phone: `1390000000${i}` })), skipped: 0 }),
    verify: async () => { if (count) throw new AccessError(403, '权限已撤销') }, credential: async () => 'test-secret',
    add: async (_ck, phone) => { count++; return account(phone) }, exists: () => false, save: () => {},
  })
  assert.equal(job.status, 'interrupted'); assert.equal(job.imported, 1); assert.equal(count, 1); assert.equal(job.message, '权限已撤销')
})
test('桥接只转发站点会话和已核验身份，禁止远程 origin 与账号手机号变更', async t => {
  let changed = false, revoked = false
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json')
    assert.equal(req.headers.cookie, 'user_session=good')
    if (req.url === '/api/auth/me') { res.end(JSON.stringify({ ok: true, data: { user: { id: 'one', permissions: { benefitActivity: !revoked } } } })); return }
    assert.equal(req.headers['x-wed-identity'], 'user:one')
    assert.equal(req.headers['x-wed-toolbox'], '1')
    if (req.url === '/api/wed-puzzle/toolbox/accounts') res.end(JSON.stringify({ ok: true, data: { accounts: [{ id: 'mine', phone: '13900000001' }], skipped: 1 } }))
    else { assert.equal(req.url, '/api/wed-puzzle/toolbox/accounts/mine/session'); assert.equal(req.method, 'POST'); res.end(JSON.stringify({ ok: true, data: { phone: changed ? '13900000002' : '13900000001', cookie: 'test-secret' } })) }
  })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise<void>(resolve => server.close(() => resolve())))
  const origin = `http://127.0.0.1:${(server.address() as import('node:net').AddressInfo).port}`
  const identity = { key: 'user:one', kind: 'user' as const, name: 'one' }
  for (const origin of ['https://example.com', 'http://remote.example', 'http://127.0.0.1/path']) assert.throws(() => new CookieAppBridge(identity, '', origin))
  const bridge = new CookieAppBridge(identity, 'foreign=secret; user_session=good', origin)
  const list = await bridge.list(); assert.equal(list.accounts.length, 1); assert.equal(list.skipped, 1)
  assert.equal(await bridge.credential(list.accounts[0]), 'test-secret')
  changed = true; await assert.rejects(bridge.credential(list.accounts[0]), /手机号/)
  revoked = true; await assert.rejects(bridge.list(), (e: unknown) => e instanceof AccessError && e.status === 403)
})
test('重复导入更新同一号码记录，身份不匹配时保留旧凭据；重启中断导入', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wed-import-test-')), store = new Store(dir), client = new Client(store)
  try {
    const internal = client as unknown as { session: (credential: Account['credential'], force: boolean) => Promise<string>; identity: (cookie: string, phone?: string) => Promise<{ phone: string; identityKey: string }> }
    internal.session = async (credential, force) => { assert.equal(force, true); return credential.cookie }
    internal.identity = async (cookie, phone) => { if (cookie === 'ck=wrong') throw new Error('凭据所属手机号与填写号码不一致'); return { phone: phone!, identityKey: 'same' } }
    client.query = async id => { const a = store.account(id); a.info = { drawTimes: '1', pictureList: {} }; return a.info }
    const first = await client.importCookieApp('ck=first', '13900000001'), second = await client.importCookieApp('ck=second', '13900000001')
    assert.equal(first.id, second.id); assert.equal(store.state.accounts.length, 1); assert.equal(second.credential.cookie, 'ck=second')
    await assert.rejects(client.importCookieApp('ck=wrong', '13900000001'), /不一致/)
    assert.equal(second.credential.cookie, 'ck=second')
    assert.equal(JSON.stringify(store.view()).includes('ck=second'), false)
    store.state.importJob = newImportJob(); store.save(); store.close()
    const reopened = new Store(dir); try { assert.equal(reopened.state.importJob?.status, 'interrupted'); assert.equal(reopened.state.accounts.length, 1) } finally { reopened.close() }
  } finally { store.close(); fs.rmSync(dir, { recursive: true, force: true }) }
})

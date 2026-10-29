import test from 'node:test'
import assert from 'node:assert/strict'
import type { Request } from 'express'
import express from 'express'
import http from 'node:http'
import { isToolboxBridgeRequest, toolboxAccountEligible, toolboxBridgeHandler } from '../services/wedToolboxBridge.js'

test('凭据桥接必须为直接本机请求，公网和伪造代理头均拒绝', () => {
  const request = (headers = {}, remoteAddress = '127.0.0.1') => ({ socket: { remoteAddress }, headers: { host: '127.0.0.1:3101', 'x-wed-toolbox': '1', ...headers } }) as unknown as Request
  assert.equal(isToolboxBridgeRequest(request()), true)
  for (const headers of [{ host: 'home.1008086.xyz' }, { origin: 'https://home.1008086.xyz' }, { 'x-forwarded-for': '127.0.0.1' }, { forwarded: 'for=127.0.0.1' }, { 'x-wed-toolbox': '' }]) assert.equal(isToolboxBridgeRequest(request(headers)), false)
  assert.equal(isToolboxBridgeRequest(request({}, '192.0.2.1')), false)
})
test('仅选有效 CK、未停用、未过期且具有完整手机号的账号', () => {
  const row = { id: 'test', phone: '13900000001', phoneMasked: '139****0001', hasCookie: true, updatedAt: '' }
  assert.equal(toolboxAccountEligible(row), true)
  for (const patch of [{ hasCookie: false }, { disabledAt: 'disabled' }, { cookieInvalidAt: 'invalid' }, { cookieExpireAt: '2020-01-01' }, { cookieExpireAt: 'bad' }, { phone: '139****0001' }]) assert.equal(toolboxAccountEligible({ ...row, ...patch }), false)
})

test('实际路由拒绝越权、匿名本机管理员捷径和归属变更，并导出已登录用户账号', async t => {
  const row = { id: 'mine', userId: 'one', phone: '13900000001', phoneMasked: '139****0001', hasCookie: true, updatedAt: '' }
  let credentialReads = 0, owner = 'one'
  const app = express()
  app.all(['/toolbox/accounts', '/toolbox/accounts/:id/session'], toolboxBridgeHandler({
    admin: async req => req.headers.cookie === 'admin_session=good' ? { id: 'admin' } : null,
    user: async req => req.headers.cookie === 'user_session=good' ? { id: 'one', permissions: {} } : null,
    listAdmin: async () => [row, { ...row, id: 'other', userId: 'two' }],
    listUser: async id => { assert.equal(id, 'one'); return [row, { ...row, id: 'expired', cookieInvalidAt: 'invalid' }] },
    account: async id => { credentialReads++; return { id, userId: owner, phone: row.phone, cookie: 'test-secret', createdAt: '', updatedAt: '' } },
  }))
  const server = app.listen(0, '127.0.0.1')
  await new Promise<void>(resolve => server.once('listening', resolve))
  t.after(() => new Promise<void>(resolve => server.close(() => resolve())))
  const port = (server.address() as import('node:net').AddressInfo).port
  const request = (path = '/toolbox/accounts', cookie = 'user_session=good', identity = 'user:one', host = `127.0.0.1:${port}`) => new Promise<{ status: number; data: any }>((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:${port}${path}`, { method: path.endsWith('/session') ? 'POST' : 'GET', headers: { Host: host, Cookie: cookie, 'X-Wed-Toolbox': '1', 'X-Wed-Identity': identity } }, res => {
      let data = ''; res.on('data', chunk => { data += chunk }); res.on('end', () => resolve({ status: res.statusCode!, data: JSON.parse(data) }))
    }); req.on('error', reject); req.end()
  })
  assert.equal((await request(undefined, '')).status, 401)
  assert.equal((await request(undefined, undefined, undefined, 'home.1008086.xyz')).status, 403)
  assert.equal((await request(undefined, undefined, 'user:two')).status, 403)
  const list = await request(); assert.deepEqual(list.data.data.accounts, [{ id: 'mine', phone: row.phone }]); assert.equal(JSON.stringify(list.data).includes('test-secret'), false)
  assert.equal((await request('/toolbox/accounts/other/session')).status, 403); assert.equal(credentialReads, 0)
  assert.equal((await request('/toolbox/accounts/expired/session')).status, 403)
  assert.equal((await request('/toolbox/accounts/mine/session')).data.data.cookie, 'test-secret')
  owner = 'two'; assert.equal((await request('/toolbox/accounts/mine/session')).status, 403)
  assert.equal((await request()).status, 200)
  const admin = await request(undefined, 'admin_session=good', 'admin:admin'); assert.equal(admin.data.data.accounts.length, 2)
})

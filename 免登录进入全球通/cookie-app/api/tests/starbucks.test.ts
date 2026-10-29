import assert from 'node:assert/strict'
import { test } from 'node:test'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import vm from 'node:vm'
import express from 'express'
import { StarbucksClient, StarbucksError, normalizeStarbucksCoupons, parseStarbucksProtocol, type StarbucksProtocolConfig } from '../services/starbucksProtocol.js'
import { StarbucksStore } from '../services/starbucksStore.js'
import { StarbucksService } from '../services/starbucks.js'
import { createStarbucksRouter } from '../routes/starbucks.js'
import { collectStarbucksCoupons, effectiveCouponStatus, formatStarbucksCodes, matchesStarbucksExpiry } from '../../shared/starbucks.js'

function protocol() {
  const jwk = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ format: 'jwk' })
  const hex = (key: string) => Buffer.from(String(jwk[key]), 'base64url').toString('hex')
  return { APP_VERSION: 'test', CHANNEL: 'test-channel', APPID: 'test-app', UA: 'test', AES_KEY_STR: '0123456789abcdef0123456789abcdef', AES_IV_STR: '0123456789abcdef',
    RSA: Object.fromEntries(['n', 'd', 'p', 'q', 'dp', 'dq', 'qinv'].map(k => [k, hex(k === 'qinv' ? 'qi' : k)])), DEVICE: { id: 'test-device', app_version: 'test' } } as StarbucksProtocolConfig
}
const rawCoupon = (code = 'fixture-coupon-code', status = 'AVAILABLE', expiry = 2000000000) => ({
  couponEntity: { title: '测试好礼券', status, expiredTimeStamp: expiry, memberBenefitId: code, shortCouponNo: `short-${code}` },
  couponStyle: { couponExpiryTimeStr: '测试有效期', couponDiscountDesc: '测试说明' },
})
function fixture() {
  process.env.CMCC_DB_ENCRYPTION_KEY ||= crypto.randomBytes(32).toString('base64')
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'starbucks-test-'))
  const store = new StarbucksStore(directory)
  let mode = '', calls = 0
  const client = {
    sms: async () => { calls++; if (mode === 'network') throw new StarbucksError('模拟网络失败', 502) },
    login: async () => ({ access_token: 'fixture-only-access-token', customer_id: 'MEM_TEST_ACCOUNT' }),
    coupons: async () => {
      if (mode === 'expired') throw new StarbucksError('模拟登录过期', 401, 'SESSION_EXPIRED')
      if (mode === 'network') throw new StarbucksError('模拟网络失败', 502)
      return normalizeStarbucksCoupons([rawCoupon(), { ...rawCoupon('main'), couponSetList: [rawCoupon('child-1'), rawCoupon('child-2')] }])
    },
  }
  const service = new StarbucksService(store, () => client)
  return { directory, store, service, setMode: (value: string) => { mode = value }, smsCalls: () => calls, close: () => fs.rmSync(directory, { recursive: true, force: true }) }
}

test('coupon trees retain parent and children, deduplicate by actual code, and use seconds or milliseconds correctly', () => {
  const main = { ...rawCoupon('main'), couponSetList: [rawCoupon('child-1'), rawCoupon('child-2'), rawCoupon('child-1')] }
  const coupons = normalizeStarbucksCoupons([main], 1900000000000)
  assert.equal(coupons.length, 3)
  assert.deepEqual(coupons.map(c => c.code), ['main', 'child-1', 'child-2'])
  assert.equal(coupons[0].expiresAt, 2000000000000)
  assert.equal(coupons[0].status, 'active')
  assert.equal(normalizeStarbucksCoupons([rawCoupon('milliseconds', 'AVAILABLE', 2000000000000)], 1900000000000)[0].status, 'active')
  assert.equal(normalizeStarbucksCoupons([rawCoupon('expired', 'AVAILABLE', 1)])[0].status, 'expired')
  assert.equal(normalizeStarbucksCoupons([rawCoupon('used', 'USED')])[0].status, 'used')
  assert.equal(normalizeStarbucksCoupons([rawCoupon('unknown', 'NEW_STATE')])[0].status, 'unknown')
  assert.equal(effectiveCouponStatus({ ...coupons[0], expiresAt: 1 }), 'expired')
  assert.equal(new Set(coupons.map(c => c.id)).size, 3)
  assert.ok(!coupons.some(c => c.numberMasked.includes('short-main')))
})

test('protocol parser reads literal values without executing userscript code', () => {
  const config = protocol()
  const source = Object.entries(config).map(([key, value]) => `var ${key} = ${JSON.stringify(value)};`).join('\n') + '\nthrow new Error("must never run");'
  // The parser accepts the source script's unquoted object keys and quoted RSA keys.
  const parseable = source.replace(/"(n|d|p|q|dp|dq|qinv|id|app_version)":/g, '$1:')
  assert.deepEqual(parseStarbucksProtocol(parseable), config)
  assert.throws(() => parseStarbucksProtocol('throw new Error("no constants")'), /缺少协议字段/)
})

test('encryption/signature parity against the provided script, without running its UI', { skip: !process.env.STARBUCKS_REFERENCE_SCRIPT }, () => {
  const source = fs.readFileSync(process.env.STARBUCKS_REFERENCE_SCRIPT!, 'utf8')
  const config = parseStarbucksProtocol(source)
  const block = source.split('// [CRYPTO-BEGIN]')[1]?.split('// [CRYPTO-END]')[0]
  assert.ok(block)
  let reference: any
  vm.runInNewContext(block!, { TextEncoder, TextDecoder, __SBUX_TEST_HOOK__: (hook: unknown) => { reference = hook } }, { timeout: 5000 })
  const client = new StarbucksClient(config)
  const body = JSON.stringify({ test: '协议一致性', phone: 'fixture-only' })
  assert.equal(client.encrypt(body), reference.aesB64(body))
  assert.equal(client.decrypt(reference.aesB64(body)), body)
  assert.equal(client.sign(1700000000000, '/bff2/user/coupon/list', 'appid=test&timestamp=1', body), reference.makeSign(config.CHANNEL, 1700000000000, '/bff2/user/coupon/list', 'appid=test&timestamp=1', body))
})

test('login body, token exchange HTTP 201, encrypted response, headers and coupon pagination follow the reference protocol', async () => {
  const config = protocol(), requests: any[] = []
  let client: StarbucksClient
  client = new StarbucksClient(config, async (url, init) => {
    const endpoint = new URL(String(url)).pathname, headers = init!.headers as Record<string, string>
    const body = JSON.parse(client.decrypt(JSON.parse(String(init!.body)).encrypted))
    requests.push({ endpoint, headers, body })
    let data: any = {}, status = 200
    if (endpoint === '/app-bff-api/login') {
      assert.deepEqual(Object.keys(body), ['cellPhone', 'device', 'loginType', 'pin'])
      assert.equal(body.loginType, 'PIN_CODE'); assert.equal(body.phoneNumber, undefined)
      data = { code: 200, data: { token: 'fixture-login-token' } }
    } else if (endpoint.includes('/access_token')) {
      assert.deepEqual(body, { grant_type: 'authorization_code', code: 'fixture-login-token' })
      assert.equal(headers['X-API-Version'], '2.0'); status = 201; data = { access_token: 'fixture-access-token' }
    } else if (endpoint.includes('/detail')) data = { code: 200, data: { customerId: 'MEM_TEST' } }
    else if (endpoint.includes('/coupon/list')) {
      assert.ok(!headers['x-signature'].startsWith('version=')); assert.equal(headers['x-customer-id'], 'MEM_TEST')
      assert.ok(new URL(String(url)).searchParams.has('appid'))
      const page = body.params.pageNum
      data = { code: 200, data: { couponList: page === 1 ? [rawCoupon('first')] : page === 2 ? [rawCoupon('second')] : [] } }
    }
    if (!endpoint.startsWith('/bff2/')) assert.match(headers['x-signature'], /^version=2,channel=/)
    return new Response(client.encrypt(JSON.stringify(data)), { status })
  })
  const session = await client.login('13800000000', '0000')
  assert.equal(session.customer_id, 'MEM_TEST')
  assert.equal((await client.coupons(session)).length, 2)
  assert.equal(requests.filter(r => r.endpoint.includes('/coupon/list')).length, 3)
  assert.equal(requests[0].headers['No-Authentication'], 'true')
  assert.equal(requests[2].headers.Authorization, 'Bearer fixture-access-token')
})

test('HTML errors are not reflected, 403 does not imply expired login, 401 does', async () => {
  const config = protocol()
  for (const status of [403, 502, 401]) {
    const client = new StarbucksClient(config, async () => new Response('<html>private upstream token</html>', { status }))
    await assert.rejects(client.request('/test', {}), (error: any) => {
      assert.equal(error.message.includes('<html>'), false)
      assert.equal(error.message.includes('private upstream token'), false)
      assert.equal(error.code === 'SESSION_EXPIRED', status === 401)
      return true
    })
  }
})

test('optional member lookup failures retain an exchanged session, but confirmed expiry does not', async () => {
  for (const status of [502, 401]) {
    const client = new StarbucksClient(protocol(), async url => {
      const endpoint = new URL(String(url)).pathname
      if (endpoint.endsWith('/login')) return Response.json({ code: 200, data: { token: 'fixture-login-token' } })
      if (endpoint.endsWith('/access_token')) return Response.json({ access_token: 'fixture-access-token' }, { status: 201 })
      return new Response('upstream failure', { status })
    })
    if (status === 401) await assert.rejects(client.login('13800000000', '0000'), (e: any) => e.code === 'SESSION_EXPIRED')
    else assert.deepEqual(await client.login('13800000000', '0000'), { access_token: 'fixture-access-token' })
  }
})

test('corrupt encrypted account data cannot be silently overwritten by a new login', async () => {
  const f = fixture()
  try {
    await f.service.login('alice', '13800000000', '0000')
    const file = path.join(f.directory, fs.readdirSync(f.directory)[0])
    fs.writeFileSync(file, 'fixture-corrupt-content')
    await assert.rejects(f.service.login('alice', '13800000001', '0000'))
    assert.equal(fs.readFileSync(file, 'utf8'), 'fixture-corrupt-content')
  } finally { f.close() }
})

test('account storage encrypts tokens/codes, isolates users, preserves login on list failure and invalidates only on confirmed expiry', async () => {
  const f = fixture()
  try {
    f.setMode('network')
    const result = await f.service.login('alice', '13800000000', '0000')
    assert.ok(result.warning)
    const id = result.accountId
    assert.equal(f.store.read('alice').length, 1)
    assert.deepEqual(f.service.state('bob').accounts, [])
    await assert.rejects(f.service.refresh('bob', id), /不属于当前用户/)
    f.setMode('')
    await f.service.refresh('alice', id)
    const view = f.service.state('alice').accounts[0]
    assert.equal(view.coupons.length, 4)
    const exported = await f.service.codes('alice', id, view.coupons.map(c => c.id), true)
    assert.equal(exported.codes.length, 4)
    assert.equal(new Set(exported.codes.map(c => c.code)).size, 4)
    assert.ok(!JSON.stringify(view).includes('fixture-only-access-token'))
    assert.ok(!JSON.stringify(view).includes('fixture-coupon-code'))
    assert.ok(!JSON.stringify(view).includes('13800000000'))
    const file = path.join(f.directory, fs.readdirSync(f.directory)[0]), content = fs.readFileSync(file, 'utf8')
    assert.ok(!content.includes('fixture-only-access-token') && !content.includes('fixture-coupon-code'))
    assert.equal(fs.statSync(file).mode & 0o777, 0o600)
    assert.equal(new StarbucksStore(f.directory).read('alice')[0].id, id)
    f.setMode('network')
    await assert.rejects(f.service.refresh('alice', id))
    assert.equal(f.service.state('alice').accounts[0].coupons.length, 4)
    assert.equal(f.service.state('alice').accounts[0].invalidAt, undefined)
    f.setMode('expired')
    await assert.rejects(f.service.refresh('alice', id))
    assert.ok(f.service.state('alice').accounts[0].invalidAt)
    await assert.rejects(f.service.codes('alice', id, [view.coupons[0].id], true))
    f.setMode('')
    await f.service.login('alice', '13800000000', '0000')
    assert.equal(f.service.state('alice').accounts.length, 1)
    assert.equal(f.service.state('alice').accounts[0].id, id)
    await f.service.remove('alice', id)
    assert.deepEqual(f.service.state('alice').accounts, [])
  } finally { f.close() }
})

test('SMS rate reservation prevents simultaneous duplicates including after a timeout', async () => {
  const f = fixture()
  try {
    f.setMode('network')
    await assert.rejects(f.service.sms('alice', '13800000000'))
    await assert.rejects(f.service.sms('bob', '13800000000'), (e: any) => e.status === 429)
    assert.equal(f.smsCalls(), 1)
  } finally { f.close() }
})

test('API enforces authentication, same-origin custom header, ownership and input validation', async () => {
  const f = fixture(), app = express()
  app.use(express.json())
  app.use('/api/starbucks', createStarbucksRouter(f.service, async req => {
    const name = req.header('x-test-user')
    if (!name) throw new StarbucksError('需要站点登录', 401, 'SITE_LOGIN_REQUIRED')
    return { key: name, name }
  }))
  const server = app.listen(0, '127.0.0.1')
  await new Promise<void>(resolve => server.once('listening', resolve))
  const port = (server.address() as { port: number }).port
  const call = (endpoint: string, method = 'GET', body?: object, user = 'alice', extra: Record<string, string> = {}) => fetch(`http://127.0.0.1:${port}/api/starbucks${endpoint}`, {
    method, headers: { 'x-starbucks-client': '1', 'x-test-user': user, 'Content-Type': 'application/json', ...extra }, ...(body ? { body: JSON.stringify(body) } : {}),
  })
  try {
    assert.equal((await call('/state', 'GET', undefined, '')).status, 401)
    assert.equal((await call('/state', 'GET', undefined, 'alice', { 'x-starbucks-client': '' })).status, 403)
    assert.equal((await call('/state', 'GET', undefined, 'alice', { Origin: 'https://evil.example' })).status, 403)
    assert.equal((await call('/auth/login', 'POST', { phone: '13800000000', pin: '123456' })).status, 400)
    const response = await call('/auth/login', 'POST', { phone: '13800000000', pin: '0000' })
    assert.equal(response.headers.get('cache-control'), 'no-store')
    const login = await response.json()
    assert.ok(login.ok)
    const id = login.data.accountId
    assert.equal((await call(`/accounts/${id}/refresh`, 'POST', {}, 'bob')).status, 404)
    assert.equal((await call(`/accounts/${id}/codes`, 'POST', { ids: ['bad'] })).status, 400)
    const ids = login.data.accounts[0].coupons.map((c: any) => c.id)
    assert.equal((await call(`/accounts/${id}/codes`, 'POST', { ids })).status, 200)
    assert.equal((await call(`/accounts/${id}/remove`, 'DELETE', undefined, 'bob')).status, 404)
    assert.equal((await call(`/accounts/${id}/remove`, 'DELETE')).status, 200)
  } finally { await new Promise<void>(resolve => server.close(() => resolve())); f.close() }
})

test('自定义复制字段的全部组合保留跨账号分类，纯券码不混入号码或有效期', () => {
  const codes = [
    { id: 'a', title: '15 元券', phoneMasked: '138****0001', code: 'CODE-A', shortCode: '', expiryText: '期限甲' },
    { id: 'b', title: '5 元券', phoneMasked: '139****0002', code: 'CODE-B', shortCode: '', expiryText: '期限乙' },
    { id: 'c', title: '5 元券', phoneMasked: '137****0003', code: 'CODE-C', shortCode: '', expiryText: '期限丙' },
  ]
  assert.equal(formatStarbucksCodes(codes), '5 元券 × 2\n139****0002｜CODE-B｜期限乙\n137****0003｜CODE-C｜期限丙\n\n15 元券 × 1\n138****0001｜CODE-A｜期限甲')
  for (let combination = 0; combination < 8; combination++) {
    const fields = { phone: Boolean(combination & 1), code: Boolean(combination & 2), expiry: Boolean(combination & 4) }
    const text = formatStarbucksCodes(codes, fields)
    if (!combination) { assert.equal(text, ''); continue }
    assert.ok(text.startsWith('5 元券 × 2\n'))
    assert.equal(text.split('5 元券 × 2').length, 2)
    assert.equal(text.split('15 元券 × 1').length, 2)
    for (const coupon of codes) {
      assert.equal(text.includes(coupon.phoneMasked), fields.phone)
      assert.equal(text.includes(coupon.code), fields.code)
      assert.equal(text.includes(coupon.expiryText), fields.expiry)
    }
    assert.equal(text.includes('｜'), [fields.phone, fields.code, fields.expiry].filter(Boolean).length > 1)
  }
  assert.equal(formatStarbucksCodes(codes, { phone: false, code: true, expiry: false }), '5 元券 × 2\nCODE-B\nCODE-C\n\n15 元券 × 1\nCODE-A')
  assert.equal(formatStarbucksCodes([], { phone: true, code: true, expiry: true }), '')
  assert.match(formatStarbucksCodes([{ ...codes[0], expiryText: '' }], { phone: false, code: false, expiry: true }), /有效期未知$/)
})

test('cross-account aggregation retains equal coupon ids and expiry filters include the selected Shanghai end day', () => {
  const now = Date.parse('2026-10-17T12:00:00+08:00')
  const coupon = normalizeStarbucksCoupons([rawCoupon('same-code')], now)[0]
  const account = { id: 'one', phoneMasked: '138****0001', customerMasked: '', updatedAt: '', coupons: [coupon] }
  const all = collectStarbucksCoupons([account, { ...account, id: 'two', phoneMasked: '138****0002', invalidAt: 'expired' }], 'all', now)
  assert.equal(all.length, 2)
  assert.notEqual(all[0].key, all[1].key)
  assert.equal(all[1].invalidAt, 'expired')
  assert.equal(collectStarbucksCoupons([account], 'missing', now).length, 0)
  const expiring = { ...coupon, expiresAt: Date.parse('2026-10-19T23:59:59.999+08:00') }
  assert.equal(matchesStarbucksExpiry(expiring, '7', '', '', now), true)
  assert.equal(matchesStarbucksExpiry(expiring, 'all', '2026-10-19', '2026-10-19', now), true)
  assert.equal(matchesStarbucksExpiry({ ...expiring, expiresAt: expiring.expiresAt + 1 }, 'all', '', '2026-10-19', now), false)
  assert.equal(matchesStarbucksExpiry({ ...coupon, expiresAt: null }, 'unknown', '', '', now), true)
  assert.equal(matchesStarbucksExpiry({ ...coupon, expiresAt: null }, 'all', '2026-10-19', '', now), false)
  assert.equal(matchesStarbucksExpiry({ ...coupon, expiresAt: now - 1 }, 'expired', '', '', now), true)
  assert.equal(matchesStarbucksExpiry({ ...coupon, expiresAt: now - 1 }, '7', '', '', now), false)
})

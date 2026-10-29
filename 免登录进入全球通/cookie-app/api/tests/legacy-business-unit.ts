import assert from 'node:assert/strict'
import https from 'node:https'
import { EventEmitter } from 'node:events'
import express from 'express'
import legacyRoutes from '../routes/legacyBusinessQuery.js'
import { aesEncrypt, aesDecrypt } from '../services/cmccCrypto.js'
import { normalizeLegacyCookieInput } from '../../shared/legacyBusinessCredentials.js'
import { buildLegacyTarget, createLegacySession, decodeLegacyResponse, getLegacySession,
  normalizeLegacyBusiness, parseLegacyPageUser, publicLegacySession, queryLegacyBusinesses,
  readLegacyMutationResult, sendLegacyUnsubscribeSms, unsubscribeLegacyBusiness, withLegacyAccountLock } from '../services/legacyBusinessQuery.js'

const pageUser = { status: '1', nested: { x: '}; " {' } }
assert.equal(normalizeLegacyCookieInput(' Cookie: d.sid=fixture; shareToken=abc==; '), 'd.sid=fixture; shareToken=abc==')
assert.equal(normalizeLegacyCookieInput('d.sid=fixture\nshareToken=abc=='), 'd.sid=fixture; shareToken=abc==')
assert.equal(normalizeLegacyCookieInput('Cookie: d.sid=fixture;\r\n shareToken=abc==; HttpOnly; Secure'), 'd.sid=fixture; shareToken=abc==')
assert.equal(normalizeLegacyCookieInput('d.sid=old; d.sid=new'), 'd.sid=new')
assert.equal(normalizeLegacyCookieInput(''), '')
for (const input of ['d.sid=fixture\r\nHost: example.com', 'Cookie: invalid', 'Set-Cookie: d.sid=fixture', 'd.sid=bad\u0000', 'x='.padEnd(16_385, 'x')]) {
  assert.throws(() => normalizeLegacyCookieInput(input), /CK/)
}
assert.deepEqual(parseLegacyPageUser(`<script>var user = ${JSON.stringify(pageUser)};var other = 1;</script>`), pageUser)
assert.throws(() => parseLegacyPageUser('<script>var user = alert("never execute");</script>'), /格式异常/)
assert.equal(await aesEncrypt('000000'), 'ED7C25E71DC9A7D9304C566DC872C5A1', 'Frozen official SPA AES-CBC vector')
// Capture contains no account data: queryAllBusiTabCfg public response.
const capturedConfig = '84514B02BF7E84FC47D96CEF38001F64502D76D3DB38D3080A6BCAB1D6D2234CEAAD933583ABBA649B9AC1AEAAECE6344E4D065D945231C08DC17CD61A05573B'
assert.deepEqual(await decodeLegacyResponse({ bodyText: capturedConfig, headers: { lrsbhbg8: 'true' }, statusCode: 200 }), { status: '0000', close: '0', message: 'Get new data' })
await assert.rejects(decodeLegacyResponse({ bodyText: '<html><h1>403 Forbidden</h1><script>secret</script></html>', headers: {}, statusCode: 403 }), e => e instanceof Error && /403/.test(e.message) && !/[<>]|secret/.test(e.message))
await assert.rejects(decodeLegacyResponse({ bodyText: JSON.stringify({ status: 0, id: 'wrong' }), headers: {}, statusCode: 200 }, 'expected'), /标识不匹配/)
await assert.rejects(decodeLegacyResponse({ bodyText: '{}', headers: {}, statusCode: 200 }), /请求失败/)
const raw = { prodName: '测试业务', prodCode: 'TEST', bizCode: '', spId: '', codeType: '01', interfaceName: 'ZT', InstanceId: 'query-only-id', canUnsub: '1', isMain: '0', contractExist: '0' }
const body = buildLegacyTarget(raw)
assert.equal(body.prodInstId, undefined, 'InstanceId is not silently remapped to prodInstId')
assert.deepEqual(buildLegacyTarget({ ...raw, prodInstId: 'wire-instance', isSPBusi: '1' }), { ...body, prodInstId: 'wire-instance', isSPBusi: '1' })
assert.equal(normalizeLegacyBusiness(raw, '02', 0).canUnsubscribe, true)
for (const changed of [{ canUnsub: '0' }, { isMain: '1' }, { contractExist: '1' }, { status: 'jt0' }]) assert.equal(normalizeLegacyBusiness({ ...raw, ...changed }, '02', 0).canUnsubscribe, false)
assert.throws(() => readLegacyMutationResult({ data: { status: 6005 } }, 'unsubscribe'), /验证码有误/)
assert.throws(() => readLegacyMutationResult({ data: { status: 6003 } }, 'sms'), /获取验证码过多/)
assert.throws(() => readLegacyMutationResult({ data: { status: 0, message: '成功', data: { retCode: '340804', retMsg: '业务互斥' } } }, 'unsubscribe'), /业务互斥/)
assert.throws(() => readLegacyMutationResult({ data: { status: 0 } }, 'unsubscribe'), /未返回成功结果/)
assert.throws(() => readLegacyMutationResult({}, 'sms'), /未受理/)
assert.equal(readLegacyMutationResult({ data: { status: 0, data: { retCode: '0', retMsg: '交易完成', cancleTime: '2026-10-18' } } }, 'unsubscribe').message, '交易完成')

const original = https.request, originalLog = console.log
const calls: { path: string; url: string; headers: Record<string, string>; body: string }[] = []
let smsFails = true, queryFails = false, submitSucceeds = false, wrongIdentity = false
let ssoAccepted = false, getConfig = false, emptyConfig = false, emptyQuery = false
let pageMode = 'direct'
const phone = '13800000000'
https.request = ((url: string, options: { headers: Record<string, string> }, callback: (response: unknown) => void) => {
  const call = { path: new URL(url).pathname, url, headers: options.headers, body: '' }; calls.push(call)
  return Object.assign(new EventEmitter(), {
    getHeaders: () => options.headers, setTimeout() {}, write(value: string) { call.body += value },
    end() {
      let statusCode = 200, value: unknown, headers = {}
      if (call.path.includes('/sso/')) {
        value = { status: ssoAccepted, returnUrl: 'https://example.com/never-follow' }
        if (ssoAccepted) { pageMode = 'direct'; headers = { 'set-cookie': ['d.sid=native-session; Path=/'] } }
      }
      else if (call.path.endsWith('/index') || call.path.endsWith('/newHome') || call.path.includes('/jumpApp/')) {
        value = `<script>var user = ${JSON.stringify({ status: '1', telephone: wrongIdentity ? '139****0001' : '138****0000', csrf: 'fixture-csrf', provinceCode: '351' })};var serverTime=1;</script>`
        if (call.path.endsWith('/newHome')) {
          if (pageMode === 'migration-expired') value = '<html>请登录</html>'
        } else if (pageMode === 'native-sync') value = '<script>sendAjax("/website/sso/sessionAPP");</script>'
        else if (pageMode === 'forbidden') { statusCode = 403; value = '<html><h1>403 Forbidden</h1><script>secret</script></html>' }
        else if (pageMode !== 'direct' && !(pageMode === 'redirect' && new URL(url).searchParams.has('ready'))) {
          statusCode = 302
          const location = pageMode.startsWith('migration')
            ? call.path.includes('/jumpApp/') ? '/cmcc-service/app-pages/main/businessQuery' : '/website/api/jumpApp/redirect/undefined/alreadyService'
            : pageMode === 'external' ? 'https://example.com/steal'
            : pageMode === 'login' ? '/website/bind/bindAccount/new'
            : pageMode === 'loop' ? '/website/spa/main/alreadyService/index'
            : pageMode === 'limit' ? '?hop=' + calls.length : '?ready=1'
          headers = { location, 'set-cookie': ['d.sid=fixture-new; Path=/'] }
          value = 'Redirecting'
        }
      }
      else {
        headers = { 'content-type': 'application/json' }
        if (call.path.endsWith('queryAllBusiTabCfg')) value = emptyConfig ? {} : getConfig ? { data: [{ tabCode: '00', tabName: '全部业务', queryType: '00' }] } : { status: '0000', close: '0' }
        else if (call.path.endsWith('queryAllBusi')) value = { busiList: [raw], oprTime: '2026-10-18 08:00' }
        else if (call.path.endsWith('queryAllBusiZ')) {
          const type = JSON.parse(call.body).queryType
          if (queryFails && type === '02') { statusCode = 403; value = '<html><h1>403 Forbidden</h1></html>' }
          else value = { status: 0, data: emptyQuery ? { busiList: [] } : { busiList: [raw], oprTime: '2026-10-18 08:00' } }
        } else if (call.path.endsWith('contractSendCode')) value = { status: 0, data: { status: smsFails ? 6003 : 0 } }
        else if (call.path.endsWith('testToUnsubscribe')) value = { status: 0, data: submitSucceeds ? { status: 0, data: { retCode: '0', retMsg: '交易完成' } } : { status: 6005 } }
        else throw new Error('Unexpected endpoint ' + call.path)
        if (typeof value === 'object' && value !== null) value = { ...value, id: options.headers.e76ccba5165fa9b4966ad82a0088e520 }
      }
      const incoming = Object.assign(new EventEmitter(), { statusCode, headers })
      callback(incoming); incoming.emit('data', Buffer.from(typeof value === 'string' ? value : JSON.stringify(value))); incoming.emit('end')
    },
  })
}) as unknown as typeof https.request
console.log = () => {}
try {
  const fixture = { accountId: 'redirect-fixture', phone, cookie: 'd.sid=fixture-old' }
  pageMode = 'redirect'
  await createLegacySession(fixture)
  assert.match(calls.at(-1)!.headers.Cookie, /d.sid=fixture-new/, 'Carry redirect cookies into the legacy API')
  for (const [mode, code] of [['migration', 'LEGACY_APP_LOGIN_REQUIRED'], ['migration-expired', 'SESSION_EXPIRED'],
    ['native-sync', 'LEGACY_APP_LOGIN_REQUIRED'],
    ['external', 'INVALID_REDIRECT'], ['login', 'SESSION_EXPIRED'], ['loop', 'REDIRECT_LOOP'],
    ['limit', 'REDIRECT_LIMIT'], ['forbidden', 'UPSTREAM_HTTP_403']]) {
    pageMode = mode
    const start = calls.length
    await assert.rejects(createLegacySession(fixture), error => {
      const e = error as Error & { code: string; status: number }
      assert.equal(e.code, code, mode)
      assert.ok(!/[<>]|secret/.test(e.message))
      if (code === 'LEGACY_APP_LOGIN_REQUIRED') assert.equal(e.status, 409)
      if (code === 'UPSTREAM_HTTP_403') assert.equal(e.status, 502, 'Forbidden is not an expired login')
      return true
    })
    assert.ok(!calls.slice(start).some(c => c.path.includes('queryAllBusi')), 'Do not fabricate a legacy session from newHome')
    if (mode === 'external') assert.equal(calls.length, start + 1, 'Never forward CK to a redirected external host')
  }
  pageMode = 'migration'; wrongIdentity = true
  await assert.rejects(createLegacySession(fixture), /号码与所选账号不一致/)
  wrongIdentity = false; pageMode = 'native-sync'
  const nativeFixture = { ...fixture, appCookie: 'JSESSIONID=fixture-native; UID=fixture-uid; ticketID=test', appToken: 'fixture-sso-token' }
  let begin = calls.length
  await assert.rejects(createLegacySession(nativeFixture), error => (error as { code: string }).code === 'LEGACY_APP_LOGIN_REQUIRED')
  assert.deepEqual(calls.slice(begin).filter(c => c.path.includes('/sso/')).map(c => c.path.split('/').at(-1)), ['sessionAPP', 'netUniAPP'])
  assert.ok(!calls.slice(begin).some(c => c.path.includes('queryAllBusi')), 'Rejected SSO never creates a query session')
  ssoAccepted = true; begin = calls.length
  const nativeSession = await createLegacySession(nativeFixture)
  assert.equal('appCookie' in nativeSession, false, 'Do not retain imported native credentials')
  assert.equal('appToken' in nativeSession, false)
  assert.ok(calls.slice(begin).every(c => new URL(c.url).hostname === 'wx.10086.cn'), 'Ignore upstream SSO returnUrl')
  assert.match(calls.at(-1)!.headers.Cookie, /d.sid=native-session/)
  assert.equal(calls.at(-1)!.headers.Lrsbhbg8, undefined, 'Config GET uses the original request wrapper')
  assert.equal(calls.at(-1)!.headers.e76ccba5165fa9b4966ad82a0088e520, undefined)
  pageMode = 'migration'; begin = calls.length
  await createLegacySession({ ...fixture, appToken: 'fixture-app-token' })
  assert.ok(calls.slice(begin).some(c => c.path.endsWith('/netUniAPP')), 'Native SSO can recover a migrated WX session')
  pageMode = 'native-sync'; wrongIdentity = true; begin = calls.length
  await assert.rejects(createLegacySession(nativeFixture), /号码与所选账号不一致/)
  assert.ok(!calls.slice(begin).some(c => c.path.includes('queryAllBusi')), 'Accepted SSO still needs a matching account identity')
  wrongIdentity = false
  emptyConfig = true
  await assert.rejects(createLegacySession(fixture), error => (error as { code: string }).code === 'INVALID_LEGACY_CONFIG')
  emptyConfig = false; getConfig = true
  const getSession = await createLegacySession(fixture)
  const getGroups = await queryLegacyBusinesses(getSession)
  assert.equal(getGroups.groups.length, 1)
  assert.equal(getGroups.groups[0].label, '全部业务')
  assert.equal(getGroups.groups[0].items.length, 1)
  assert.equal(calls.at(-1)!.path, '/website/alreadyService/queryAllBusi')
  assert.equal(new URL(calls.at(-1)!.url).searchParams.get('queryType'), '00')
  getConfig = false; pageMode = 'direct'
  const s = await createLegacySession({ accountId: 'fixture-account', phone, cookie: 'fixture-cookie=value' })
  assert.equal(getLegacySession(s.id), s)
  assert.equal('cookie' in publicLegacySession(s), false)
  const q = await queryLegacyBusinesses(s)
  assert.equal(q.groups.length, 4)
  assert.equal(q.errors.length, 0)
  const target = q.groups.find(g => g.type === '02')!.items[0]
  assert.equal('raw' in target, false)
  emptyQuery = true
  const unconfirmed = await queryLegacyBusinesses(s)
  assert.equal(unconfirmed.errors.length, 4, 'Empty lists without operation time are not a successful query')
  assert.equal(unconfirmed.groups[0].items.length, 1, 'Keep confirmed results')
  emptyQuery = false
  queryFails = true
  const partial = await queryLegacyBusinesses(s)
  assert.equal(partial.errors.length, 1)
  assert.equal(partial.groups.find(g => g.type === '02')!.items.length, 1, 'Retain prior data on a category failure')
  assert.ok(!partial.errors[0].includes('<'))
  await assert.rejects(unsubscribeLegacyBusiness(s, target.id, '000000'), /请先发送/)
  await assert.rejects(sendLegacyUnsubscribeSms(s, 'forged-business-id'), /业务不存在/)
  await assert.rejects(sendLegacyUnsubscribeSms(s, target.id), /获取验证码过多/)
  smsFails = false
  assert.equal((await sendLegacyUnsubscribeSms(s, target.id)).cooldownSeconds, 60, 'Failed sending must remain retryable')
  await assert.rejects(sendLegacyUnsubscribeSms(s, target.id), /秒后/)
  const count = calls.length
  await assert.rejects(unsubscribeLegacyBusiness(s, target.id, '000000'), /验证码有误/)
  assert.equal(calls.length, count + 1, 'Never automatically retry a mutation')
  const submitted = calls.at(-1)!, parsed = JSON.parse(submitted.body)
  assert.equal(parsed.password, 'ED7C25E71DC9A7D9304C566DC872C5A1')
  assert.equal(await aesDecrypt(parsed.password), '000000')
  assert.equal(parsed.passWordType, '02')
  assert.equal(parsed.interfaceName, 'ZT')
  assert.equal(parsed.prodInstId, undefined)
  assert.equal(submitted.headers['csrf-token'], 'fixture-csrf')
  assert.equal(submitted.headers.Cookie, 'fixture-cookie=value', 'Unsubscribe uses the same imported session cookie')
  assert.ok(calls.filter(c => c.path.endsWith('contractSendCode')).every(c => c.headers.Cookie === 'fixture-cookie=value'), 'SMS uses the imported session cookie')
  assert.equal(submitted.headers.Lrsbhbg8, 'ZS93dUFVa2kzaEpQSjM0SG55MUFDdz09')
  assert.equal(submitted.headers.Referer, 'https://wx.10086.cn/website/spa/main/alreadyService/index')
  submitSucceeds = true
  await unsubscribeLegacyBusiness(s, target.id, '000000')
  await assert.rejects(unsubscribeLegacyBusiness(s, target.id, '000000'), /未开放/)
  wrongIdentity = true
  await assert.rejects(createLegacySession({ accountId: 'wrong', phone, cookie: 'fixture' }), /号码与所选账号不一致/)
  await withLegacyAccountLock('lock-test', async () => {
    await assert.rejects(withLegacyAccountLock('lock-test', async () => {}), /正在处理/)
  })
  await withLegacyAccountLock('lock-test', async () => {})
} finally { https.request = original; console.log = originalLog }
// All routes must reject before upstream access when the caller has no site session.
const priorAdminKey = process.env.ADMIN_KEY
process.env.ADMIN_KEY = 'offline-test-key'
const app = express()
app.use(express.json())
app.use('/api/legacy-business-query', legacyRoutes)
const server = await new Promise<import('node:http').Server>(resolve => {
  const listener = app.listen(0, '127.0.0.1', () => resolve(listener))
})
try {
  const port = (server.address() as import('node:net').AddressInfo).port
  for (const path of ['accounts/fixture/prepare', 'query', 'unsubscribe/sms', 'unsubscribe']) {
    const response = await fetch(`http://127.0.0.1:${port}/api/legacy-business-query/${path}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId: 'fixture-account', sessionId: 'forged', businessId: 'forged', smsCode: '000000', confirmed: true }),
    })
    assert.equal(response.status, 403, path)
    const json = await response.json()
    assert.equal(json.ok, false)
    assert.equal(json.errorCode, 'FORBIDDEN')
  }
} finally {
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
  if (priorAdminKey === undefined) delete process.env.ADMIN_KEY
  else process.env.ADMIN_KEY = priorAdminKey
}
console.log('legacy-business-unit: OK (offline only)')

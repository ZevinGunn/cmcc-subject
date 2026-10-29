import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import https from 'node:https'
import fs from 'node:fs'
import { EventEmitter } from 'node:events'
import { Readable } from 'node:stream'
import { mock } from 'node:test'
import { chromium } from 'playwright'
import { issueYunpanBusinessTicket, yunpanSendSmsCode, decodeYunpanSmsResponse, YunpanAuthenticationExpired } from '../services/yunpan10086.js'
import { buildYunpanBusinessLink, buildYunpanGlobalUrl, exchangeYunpanGlobalToken, ensureYunpanGlobalToken, YunpanGlobalLoginUnconfirmed } from '../services/yunpanSso.js'
import { toAccountSummary, recordAccountYunpanVerification, type AccountRecord, type YunpanSessionRecord } from '../services/accountsStore.js'
import { maintainCredentialChannels } from '../services/credentialMaintenance.js'
import { encryptJson, decryptJson } from '../services/cryptoBox.js'
import type { EncryptedCredentialRow } from '../services/credentialsStore.js'

const SMS_KEY = 'h7DLzCTAjn+altjy2a9E9FSt7AC6pmx1'
const LEGACY_KEY = 'UqEZkrjCKfa02pP6jntzFmkzOz86zHUC'
function encrypt(value: unknown, key: string) {
  const iv = Buffer.alloc(16, 1)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv)
  return JSON.stringify(Buffer.concat([iv, cipher.update(JSON.stringify(value)), cipher.final()]).toString('base64'))
}
function decrypt(raw: string, key: string) {
  const buffer = Buffer.from(JSON.parse(raw), 'base64')
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), buffer.subarray(0, 16))
  return JSON.parse(Buffer.concat([decipher.update(buffer.subarray(16)), decipher.final()]).toString())
}
type Call = { url: URL; headers: Record<string, string>; body: string }
const calls: Call[] = []
let responses: Array<{ status?: number; body: unknown }> = []
const transport = mock.method(https, 'request', ((url: string, options: { headers: Record<string, string> }, callback: (res: unknown) => void) => {
  const request = new EventEmitter() as EventEmitter & { getHeaders: () => object; setTimeout: () => void; write: (data: string) => void; end: () => void }
  let body = ''
  request.getHeaders = () => options.headers
  request.setTimeout = () => undefined
  request.write = (data) => { body += data }
  request.end = () => {
    calls.push({ url: new URL(url), headers: options.headers, body })
    const response = responses.shift()
    assert.ok(response, 'Unexpected upstream request; tests must never use live network')
    queueMicrotask(() => callback(Object.assign(Readable.from([typeof response.body === 'string' ? response.body : JSON.stringify(response.body)]), {
      statusCode: response.status || 200, headers: {},
    })))
  }
  return request
}) as unknown as typeof https.request)
const session = { account: '138****0000', completeAccount: '13800000000', authorization: 'Basic ' + Buffer.from('pc:13800000000:test-only-session').toString('base64'),
  secretKey: 'must-not-send', routerInfo: [{ modName: 'user', httpsUrl: 'https://yun.139.com.evil.example/user' }] }
const success = { success: true, code: '0000', data: { token: 'fresh-test-ticket' } }
try {
  const stamp = new Date().toISOString()
  const rec: AccountRecord = { id: 'verification-only-test', phone: session.completeAccount,
    createdAt: stamp, updatedAt: stamp, yunpanSession: session, yunpanSessionUpdatedAt: stamp }
  const previousKey = process.env.CMCC_DB_ENCRYPTION_KEY
  process.env.CMCC_DB_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString('base64')
  try {
    let stored = encryptJson(session)
    let writes = 0
    const store = {
      getEncryptedCredentialRow: async () => ({ yunpanSessionEnc: stored,
        yunpanSessionUpdatedAt: new Date(stamp) } as EncryptedCredentialRow),
      compareAndSwapYunpanSession: async (_id: string, previous: string, next: string) => {
        assert.equal(previous, stored)
        stored = next; writes += 1; return true
      },
    }
    await recordAccountYunpanVerification(rec, false, store)
    let restored = decryptJson<YunpanSessionRecord>(stored)
    assert.ok(restored.invalidAt)
    assert.equal(restored.authorization, session.authorization)
    assert.equal(toAccountSummary({ ...rec, yunpanSession: restored }).yunpanSessionInvalidAt, restored.invalidAt)
    await recordAccountYunpanVerification(rec, true, store)
    restored = decryptJson<YunpanSessionRecord>(stored)
    assert.ok(restored.checkedAt)
    assert.equal(restored.invalidAt, undefined, 'A successful check clears only cloud expiry')
    assert.equal(writes, 2)
    stored = encryptJson({ ...session, authorization: 'new-login' })
    await recordAccountYunpanVerification(rec, false, store)
    assert.equal(writes, 2, 'An older result cannot mark a newly logged-in session invalid')
    stored = encryptJson(session)
    await recordAccountYunpanVerification({ ...rec, yunpanSessionUpdatedAt: '2000-01-01T00:00:00Z' }, false, store)
    assert.equal(writes, 2, 'Same authorization with a different login generation is also protected')
  } finally {
    if (previousKey === undefined) delete process.env.CMCC_DB_ENCRYPTION_KEY
    else process.env.CMCC_DB_ENCRYPTION_KEY = previousKey
  }
  for (const scenario of ['success', 'expired', 'network', 'target-error']) {
    const checks: boolean[] = []
    let tokenSaves = 0
    const dependencies = {
      exchangeYunpanGlobalToken: async (_session: YunpanSessionRecord, onAuthenticated?: () => Promise<void>) => {
        if (scenario === 'expired') throw new YunpanAuthenticationExpired()
        if (scenario === 'network') throw new Error('upstream 403')
        await onAuthenticated?.()
        if (scenario === 'target-error') throw new Error('target unavailable')
        return 'mock-token'
      },
      recordAccountYunpanVerification: async (_rec: AccountRecord, valid: boolean) => { checks.push(valid) },
      setAccountQqtToken: async () => { tokenSaves += 1; return rec },
      touchAccountQqtTokenCheckedAt: async () => rec,
      getAccountById: async () => ({ ...rec, qqtAccessToken: 'mock-token' }),
    }
    if (scenario === 'success') await ensureYunpanGlobalToken(rec, true, dependencies)
    else await assert.rejects(ensureYunpanGlobalToken(rec, true, dependencies))
    assert.deepEqual(checks, scenario === 'expired' ? [false] : scenario === 'network' ? [] : [true])
    assert.equal(tokenSaves, scenario === 'success' ? 1 : 0)
    if (scenario === 'success') {
      checks.length = 0
      await ensureYunpanGlobalToken({ ...rec, yunpanSession: { ...session, checkedAt: stamp, invalidAt: stamp },
        qqtAccessToken: 'old-token', qqtAccessTokenCheckedAt: stamp }, false, dependencies)
      assert.deepEqual(checks, [], 'Valid cached QQT credentials remain independent of cloud expiry')
    }
  }
  for (const scenario of ['valid', 'expired', 'network', 'new-login']) {
    const order: string[] = []
    const cached = { ...rec, qqtAccessToken: 'cached-token', qqtAccessTokenCheckedAt: '2020-01-01T00:00:00.000Z' }
    const deps = {
      isAuthenticated: async () => {
        order.push('validate')
        if (scenario === 'network') throw new Error('upstream unavailable')
        return scenario !== 'expired'
      },
      exchangeYunpanGlobalToken: async () => { order.push('exchange'); return 'new-token' },
      recordAccountYunpanVerification: async () => {},
      getAccountById: async () => scenario === 'new-login' ? { ...cached, qqtAccessToken: 'new-interactive-token' } : cached,
      setAccountQqtToken: async () => { order.push('save'); return cached },
      touchAccountQqtTokenCheckedAt: async () => { order.push('touch'); return cached },
    }
    if (scenario === 'network' || scenario === 'new-login') await assert.rejects(ensureYunpanGlobalToken(cached, false, deps))
    else await Promise.all(Array.from({ length: 4 }, () => ensureYunpanGlobalToken(cached, false, deps)))
    assert.deepEqual(order, scenario === 'valid' ? ['validate', 'touch'] :
      scenario === 'expired' ? ['validate', 'exchange', 'save', 'touch'] : ['validate'])
  }
  for (const scenario of ['fallback', 'network', 'expired', 'new-login']) {
    const order: string[] = []
    const deps = {
      exchangeYunpanGlobalToken: async () => {
        order.push('direct')
        if (scenario === 'network') throw new Error('network failed')
        if (scenario === 'expired') throw new YunpanAuthenticationExpired()
        throw new YunpanGlobalLoginUnconfirmed()
      },
      exchangeViaWx: async () => {
        order.push('wx-fallback')
        return { accessToken: 'mock-new-global', cookie: 'mock-verified-wx',
          cookieExpireAt: new Date(Date.now() + 1800000).toISOString(), activationInfo: { valid: true } }
      },
      recordAccountYunpanVerification: async () => {},
      setAccountQqtToken: async () => { order.push('save-token'); return rec },
      touchAccountQqtTokenCheckedAt: async () => rec,
      getAccountById: async () => scenario === 'new-login'
        ? { ...rec, yunpanSession: { ...session, authorization: 'new-login' } } : rec,
      setAccountCookie: async (input: { ssoCookieExpireAt?: string }) => {
        assert.ok(input.ssoCookieExpireAt); order.push('save-wx'); return rec
      },
      setAccountActivationInfo: async () => rec,
    }
    if (scenario === 'fallback') await ensureYunpanGlobalToken(rec, true, deps)
    else await assert.rejects(ensureYunpanGlobalToken(rec, true, deps))
    assert.deepEqual(order, scenario === 'fallback' ? ['direct', 'wx-fallback', 'save-wx', 'save-token'] :
      scenario === 'new-login' ? ['direct', 'wx-fallback'] : ['direct'])
  }
  for (const cloudOk of [true, false]) {
    for (const cmccOk of [true, false]) {
      const order: string[] = []
      const result = await maintainCredentialChannels({ hasYunpan: true,
        maintainYunpan: async () => { order.push('cloud'); return { status: cloudOk ? 'success' : 'failed', message: 'cloud' } },
        maintain10086: async () => { order.push('10086'); return { status: cmccOk ? 'success' : 'failed', message: '10086' } },
      })
      assert.deepEqual(order, ['cloud', '10086'])
      assert.equal(result.status, cloudOk ? 'success' : 'failed', 'Secondary failures do not invalidate the primary cloud credential')
      assert.equal(result.message, 'cloud；10086')
    }
  }
  assert.equal((await maintainCredentialChannels({ hasYunpan: false,
    maintainYunpan: async () => { throw new Error('Should not run') },
    maintain10086: async () => ({ status: 'success', message: '10086-only' }),
  })).message, '10086-only')
  const summary = toAccountSummary({ id: 'test-account', phone: session.completeAccount,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    yunpanSession: session, lastLoginMethod: 'yunpan', lastLoginAt: new Date().toISOString() })
  assert.equal(summary.hasCookie, false)
  assert.equal(summary.hasYunpanSession, true)
  assert.equal(summary.cookieExpireAt, undefined, 'Yunpan login must not fabricate CK expiry')
  assert.equal(summary.cookieTtlSeconds, undefined)
  responses = [{ body: success }]
  await issueYunpanBusinessTicket(session, '001191')
  assert.deepEqual(JSON.parse(calls.at(-1)!.body), { toSourceId: '001191' })
  assert.equal(calls.at(-1)!.url.hostname, 'user-njs.yun.139.com')
  assert.equal(calls.at(-1)!.headers.Authorization, session.authorization)
  responses = [{ body: success }]
  await issueYunpanBusinessTicket(session, '017018')
  assert.deepEqual(JSON.parse(calls.at(-1)!.body), { toSourceId: '017018' })
  responses = [{ body: { success: false, code: '1010010015' } }]
  await assert.rejects(issueYunpanBusinessTicket(session, '001191'), YunpanAuthenticationExpired)
  for (const header of ['mcloud-skey', 'mcloud-sign', 'hcy-cool-flag']) assert.equal(calls.at(-1)!.headers[header], undefined)
  for (const body of [{ success: false, data: { token: 'untrusted' } }, { ...success, code: 'error' }, { ...success, data: { token: 'untrusted', resultCode: 'error' } }]) {
    responses = [{ body }]
    await assert.rejects(issueYunpanBusinessTicket(session, '001216'))
  }
  assert.throws(() => buildYunpanGlobalUrl('test', 'https://evil.example'))
  const global = new URL(buildYunpanGlobalUrl('special+a/b=='))
  assert.equal(global.searchParams.get('token'), 'special+a/b==')
  assert.equal(global.searchParams.get('targetSourceId'), '001191')
  assert.equal(global.searchParams.get('backUrl'), 'https://qqt.cmicrwx.cn/2016tyjf/xdractivity?sspId=66050')

  responses = [{ body: success }, { body: { header: { status: '200' }, data: { token: 'cloud-business-token' } } },
    { body: { header: { status: '200' }, data: { tmpToken: 'capp-only-temp-ticket' } } }]
  calls.length = 0
  const capp = await buildYunpanBusinessLink(session, 'capp')
  assert.deepEqual(calls.map(c => c.url.pathname), ['/user/querySpecTokenV2', '/uniphone/user/tokenValidate', '/uniphone/user/getRcsToken'])
  assert.deepEqual(JSON.parse(calls[0].body), { toSourceId: '001216' })
  assert.deepEqual(JSON.parse(calls[1].body), { token: 'fresh-test-ticket', version: '1.2', pintype: 5 })
  assert.deepEqual(JSON.parse(calls[2].body), { targetSourceId: '001304', token: 'cloud-business-token' })
  const cappParams = new URLSearchParams(new URL(capp.ssoUrl).hash.slice(3))
  assert.equal(cappParams.get('token'), 'capp-only-temp-ticket')
  assert.equal(cappParams.get('targetSourceId'), '001304')
  responses = [{ body: success }]
  const phone = await buildYunpanBusinessLink(session, 'cloudphone')
  assert.equal(new URLSearchParams(new URL(phone.ssoUrl).hash.slice(3)).get('channelSrc'), '02207')
  responses = [{ body: success }, { body: { header: { status: '403' }, data: { token: 'not-valid' } } }]
  await assert.rejects(buildYunpanBusinessLink(session, 'capp'))
  assert.equal(responses.length, 0)

  calls.length = 0
  assert.equal((await yunpanSendSmsCode({ phone: session.completeAccount })).ok, false)
  assert.equal(calls.length, 0, 'No proof must not send SMS')
  responses = [{ body: encrypt({ success: false, code: '01000019' }, LEGACY_KEY) }, { body: encrypt({ success: true, code: '0000' }, LEGACY_KEY) }]
  assert.equal((await yunpanSendSmsCode({ phone: session.completeAccount, puzzleVerifyCode: 'test-only-proof' })).ok, true)
  assert.equal(calls.length, 2)
  const original = decrypt(calls[0].body, SMS_KEY)
  assert.deepEqual(decrypt(calls[1].body, LEGACY_KEY), original, 'Compatibility uses the same proof and random')
  assert.equal(original.puzzleVerfycode, 'test-only-proof')
  assert.equal(original.reqType, '3')
  assert.equal(calls[0].headers['mcloud-skey'], undefined)
  for (const rejection of [{ body: encrypt({ success: false, code: '200059552' }, LEGACY_KEY) },
    { body: { success: false, code: '01000019' } }, { status: 503, body: encrypt({ success: false, code: '01000019' }, LEGACY_KEY) }]) {
    calls.length = 0; responses = [rejection]
    assert.equal((await yunpanSendSmsCode({ phone: session.completeAccount, puzzleVerifyCode: 'test-only-proof' })).ok, false)
    assert.equal(calls.length, 1, 'Business errors and HTTP errors must not resend SMS')
  }
  assert.equal(decodeYunpanSmsResponse('<html>error</html>').encoding, 'unrecognized')

  let loginStatus = '1'
  let cookiePresent = true
  let closed = 0
  let openBrowsers = 0
  let maxBrowsers = 0
  const exists = mock.method(fs, 'existsSync', () => true)
  const launch = mock.method(chromium, 'launch', (async () => {
    openBrowsers += 1; maxBrowsers = Math.max(maxBrowsers, openBrowsers)
    return ({
    newContext: async () => ({
      newPage: async () => {
        const page = new EventEmitter() as EventEmitter & { mainFrame: () => object; route: () => Promise<void>; goto: (url: string) => Promise<void> }
        page.mainFrame = () => ({})
        page.route = async () => {}
        page.goto = async (url) => {
          await new Promise(resolve => setTimeout(resolve, 5))
          assert.equal(new URL(url).searchParams.get('targetSourceId'), '001191')
          page.emit('response', { url: () => 'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/checkLoginStatus.action', status: () => 200, json: async () => ({ status: loginStatus }) })
        }
        return page
      },
      cookies: async () => cookiePresent ? [{ name: 'access_token', value: 'fresh-global-token' }] : [],
    }), close: async () => { closed += 1; openBrowsers -= 1 },
  }) }) as never)
  try {
    responses = [{ body: { success: false, code: '1010010015' } }]
    await assert.rejects(exchangeYunpanGlobalToken(session), YunpanAuthenticationExpired,
      'SSO must preserve explicit Yunpan expiry instead of swallowing it as a browser failure')
    responses = [{ body: success }]
    assert.equal(await exchangeYunpanGlobalToken(session), 'fresh-global-token')
    loginStatus = '0'; responses = [{ body: success }]
    let cloudVerified = false
    await assert.rejects(exchangeYunpanGlobalToken(session, async () => { cloudVerified = true }), /未确认登录/)
    assert.equal(cloudVerified, true, 'Target login failure does not invalidate a verified cloud credential')
    loginStatus = '1'; cookiePresent = false; responses = [{ body: success }]
    await assert.rejects(exchangeYunpanGlobalToken(session), /未确认登录/)
    assert.equal(closed, 3, 'Every browser context is closed even on authentication failure')
    cookiePresent = true
    responses = Array.from({ length: 4 }, () => ({ body: success }))
    assert.deepEqual(await Promise.all(Array.from({ length: 4 }, () => exchangeYunpanGlobalToken(session))),
      Array(4).fill('fresh-global-token'))
    assert.equal(maxBrowsers, 2, 'Batch exchanges queue instead of failing or launching unlimited Chrome processes')
    assert.equal(openBrowsers, 0)
  } finally { launch.mock.restore(); exists.mock.restore() }
  console.log('yunpan-sso-unit: ok (mock transport and browser only)')
} finally { transport.mock.restore() }

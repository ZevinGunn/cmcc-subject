import assert from 'node:assert/strict'
import { issueQqtBusinessTicket, issueAccountQqtTicket, isQqtTokenAuthenticated, collect10086CookieByQqtTicket, buildQqt10086Url, buildAccountCloudLink, QqtTicketEmpty, __test__ } from '../services/qqtSso.js'
import { YunpanAuthenticationExpired } from '../services/yunpan10086.js'
import { recover10086CookieByYunpan, shouldRecover10086CookieByYunpan } from '../services/cmccCookieRecovery.js'
import { createSsoCookieMeta, type AccountRecord } from '../services/accountsStoreDb.js'
import type { HttpResponse, httpsRequestText } from '../services/cmccHttp.js'

const phone = '13800000000'
const expiry = new Date(Date.now() + 90 * 60_000).toUTCString()
const response = (bodyText = '', statusCode = 200, headers: HttpResponse['headers'] = {}): HttpResponse =>
  ({ bodyText, statusCode, headers, bodyBuffer: Buffer.from(bodyText) })
const record: AccountRecord = { id: 'sso-mock-only', phone, qqtAccessToken: 'mock-global', cookie: 'old-cookie',
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  yunpanSession: { account: phone, completeAccount: phone, authorization: 'mock-only-authorization' },
  lastLoginMethod: 'yunpan' }

let calls: Parameters<typeof httpsRequestText>[0][] = []
let queue: HttpResponse[] = []
const request: typeof httpsRequestText = async args => {
  calls.push(args)
  const next = queue.shift()
  assert.ok(next, 'Unexpected upstream call; no live network is allowed')
  return next
}
queue = [response(JSON.stringify({ status: '1', data: 'mock-new-ticket' }))]
assert.equal(await issueQqtBusinessTicket('mock-global', '017018', request), 'mock-new-ticket')
assert.equal(calls[0].body, 'targetid=017018')
assert.equal(calls[0].headers?.Cookie, 'access_token=mock-global')
assert.match(calls[0].headers?.['Content-Type'] || '', /form-urlencoded/)
for (const payload of [{ status: 1, data: 'wrong' }, { status: '0', data: 'wrong' }, { status: '1', data: {} }, { status: '1', data: '' }]) {
  queue = [response(JSON.stringify(payload))]
  await assert.rejects(issueQqtBusinessTicket('mock-global', '001216', request))
}
queue = [response(JSON.stringify({ status: '1', data: '' }))]
await assert.rejects(issueQqtBusinessTicket('mock-global', '001216', request), QqtTicketEmpty)
calls = []
queue = [response('{"status":"1","data":""}'), response('{"status":"1","data":{"token":"fallback-wx-ticket"}}')]
assert.equal(await issueQqtBusinessTicket('mock-global', '017018', request), 'fallback-wx-ticket')
assert.equal(calls.length, 2)
assert.ok(calls[1].url.endsWith('/getCmpSSOParam.action'))
assert.equal(calls[1].body, 'channelCode=66050&levelPass=false')
assert.ok(calls[1].headers?.Referer?.includes('sspId=66050'))
for (const fallback of [response('{"status":"1","data":{"token":""}}'),
  response('{"status":"0"}'), response('<html>upstream unavailable</html>', 502),
  response('{"status":"1","data":{"token":"bad;ticket"}}')]) {
  queue = [response('{"status":"1","data":""}'), fallback]
  await assert.rejects(issueQqtBusinessTicket('mock-global', '017018', request))
  assert.equal(queue.length, 0, 'Fallback must be bounded to one request')
}
for (const target of ['cloudphone', 'capp'] as const) {
  const order: string[] = []
  const deps = {
    buildYunpan: async (_rec: AccountRecord, destination: 'cloudphone' | 'capp' | 'global') => {
      order.push(`yunpan:${destination}`)
      return { ssoUrl: 'https://cloud.139.com/#/?token=mock', source: 'fresh-yunpan-sso', generatedAt: '', target: destination }
    },
    issueQqt: async () => { order.push('qqt'); return 'qqt-ticket' },
    buildCloud: async (_ticket: string, destination: 'cloudphone' | 'capp', channel?: string) => {
      order.push(`${destination}:${channel}`)
      return { ssoUrl: 'https://cloud.139.com/#/?token=mock', source: 'fresh-yunpan-sso', generatedAt: '', target: destination }
    },
  }
  assert.equal((await buildAccountCloudLink(record, target, deps)).source, 'fresh-yunpan-sso')
  assert.deepEqual(order, [`yunpan:${target}`], 'Cloud accounts must never depend on their cached QQT token')
  order.length = 0
  assert.equal((await buildAccountCloudLink({ ...record, yunpanSession: undefined }, target, deps)).source, 'fresh-qqt-sso')
  assert.deepEqual(order, ['qqt', `${target}:02190`], 'QQT-only accounts retain their existing supported route')
  order.length = 0
  await assert.rejects(buildAccountCloudLink(record, target, { ...deps, buildYunpan: async () => {
    throw new YunpanAuthenticationExpired()
  } }), YunpanAuthenticationExpired)
  assert.deepEqual(order, [], 'Expired cloud credentials must not silently fall back to unrelated cached tokens')
  await assert.rejects(buildAccountCloudLink({ ...record, disabledAt: 'now' }, target, deps), /禁用/)
  assert.deepEqual(order, [])
}
await assert.rejects(issueQqtBusinessTicket('mock;other=bad', '017018', request))
await assert.rejects(issueQqtBusinessTicket('mock', '001191' as '017018', request))
const link = new URL(buildQqt10086Url('a+b/=='))
assert.equal(link.searchParams.get('net_token'), 'a+b/==')
assert.equal(link.searchParams.get('netUniBackUrl'), 'https://wx.10086.cn/website/spa/main/newHome')

let issued = 0
let renewed = 0
const renewing = { issue: async () => { issued++; throw new __test__.QqtTicketRejected('mock rejection') },
  renew: async (rec: AccountRecord) => { renewed++; return { ...rec, qqtAccessToken: 'mock-renewed' } } }
await assert.rejects(issueAccountQqtTicket(record, '017018', renewing))
assert.equal(issued, 2, 'Authentication recovery must be bounded to one renewal')
assert.equal(renewed, 1)
renewed = 0
await assert.rejects(issueAccountQqtTicket(record, '017018', { ...renewing, issue: async () => { throw new Error('network failed') } }))
assert.equal(renewed, 0, 'Network failures must not renew credentials')
await assert.rejects(issueAccountQqtTicket({ ...record, disabledAt: 'now' }, '017018', renewing))
for (const authenticated of [true, false]) {
  renewed = 0; let attempts = 0
  const deps = { ...renewing, isAuthenticated: async () => authenticated,
    issue: async () => { attempts++; if (attempts === 1) throw new QqtTicketEmpty(); return 'fresh-ticket' } }
  if (authenticated) await assert.rejects(issueAccountQqtTicket(record, '017018', deps), QqtTicketEmpty)
  else assert.equal(await issueAccountQqtTicket(record, '017018', deps), 'fresh-ticket')
  assert.equal(renewed, authenticated ? 0 : 1)
}
for (const payload of [{ status: '1', msg: '已登录' }, { status: '0', msg: '未登录' }, { status: '0', msg: '活动繁忙' }]) {
  queue = [response(JSON.stringify(payload))]
  if (payload.msg === '活动繁忙') await assert.rejects(isQqtTokenAuthenticated('mock-global', request))
  else assert.equal(await isQqtTokenAuthenticated('mock-global', request), payload.status === '1')
}

const home = (identity = phone) => response(`var user = ${JSON.stringify({ telephone: identity, csrf: 'mock-csrf' })}; var serverTime = 1;`)
const issuedCookies = response('', 302, { location: '/website/spa/main/newHome', 'set-cookie': [
  `shareToken=mock-share; path=/; expires=${expiry}; httponly`, `d.sid=mock-sid; path=/; expires=${expiry}; httponly`,
  'access_token=foreign; Domain=evil.example; Path=/', 'narrow=value; Path=/activity',
] })
const activate = async () => ({ ok: true, decrypted: JSON.stringify({ status: 0, data: { resultCode: '0000', resultData: { tariffPackages: '模拟套餐' } } }) })
function setup(homeResponse = home()) { calls = []; queue = [issuedCookies, homeResponse, homeResponse] }
setup()
const collected = await collect10086CookieByQqtTicket({ ticket: 'mock-new-ticket', phone }, { request, activate })
assert.equal(collected.cookie, 'shareToken=mock-share; d.sid=mock-sid')
assert.equal(collected.cookieExpireAt, new Date(expiry).toISOString())
assert.equal(calls[0].headers?.Cookie, undefined, 'SSO must not reuse any old cookie')
assert.equal(calls[1].headers?.Cookie?.includes('access_token'), false, 'QQT cookie must not leak into WX requests')
assert.ok(calls.every(call => new URL(call.url).hostname === 'wx.10086.cn'))
setup(home('13900000000'))
await assert.rejects(collect10086CookieByQqtTicket({ ticket: 'mock', phone }, { request, activate }), /身份/)
setup(home('138****0000'))
assert.ok((await collect10086CookieByQqtTicket({ ticket: 'mock', phone }, { request, activate })).cookie)
assert.equal(__test__.matchesSsoPhone('138****9999', phone), false)
assert.equal(__test__.matchesSsoPhone('***********', phone), false)
assert.equal(__test__.matchesSsoPhone(undefined, phone), false)
assert.equal(__test__.matchesSsoPhone('', ''), false)
setup()
await assert.rejects(collect10086CookieByQqtTicket({ ticket: 'mock', phone }, { request, activate: async () => ({ ok: true, decrypted: '{"status":0,"data":{"resultCode":"FAIL"}}' }) }), /核心查询/)
queue = [response('', 302, { location: 'https://evil.example/?token=mock' })]
await assert.rejects(collect10086CookieByQqtTicket({ ticket: 'mock', phone }, { request, activate }), /非官方/)
for (const url of ['http://wx.10086.cn/', 'https://wx.10086.cn.evil.example/', 'https://user:password@wx.10086.cn/', 'https://wx.10086.cn:444/']) assert.throws(() => __test__.assertWxUrl(url))
queue = Array.from({ length: 4 }, () => issuedCookies)
await assert.rejects(collect10086CookieByQqtTicket({ ticket: 'mock', phone }, { request, activate }), /跳转异常/)
queue = [home(), home()]
await assert.rejects(collect10086CookieByQqtTicket({ ticket: 'mock', phone }, { request, activate }), /未下发/)
const jar = new Map<string, string>(), expiries = new Map<string, number>()
__test__.collectWxCookies(response('', 200, { 'set-cookie': ['shareToken=value; Path=/; Max-Age=90'] }), jar, expiries, 1000)
assert.equal(expiries.get('shareToken'), 91000)
__test__.collectWxCookies(response('', 200, { 'set-cookie': ['shareToken=value; Path=/; Max-Age=0'] }), jar, expiries, 1000)
assert.equal(jar.has('shareToken'), false)

const now = new Date('2026-10-13T00:00:00Z')
const previous = { lastLoginMethod: 'yunpan' as const, lastLoginAt: '2026-10-12T00:00:00Z', cookieSource: 'sms' as const }
const meta = createSsoCookieMeta(previous, '2026-10-13T01:30:00Z', now)
assert.equal(meta.lastLoginMethod, 'yunpan')
assert.equal(meta.lastLoginAt, previous.lastLoginAt, 'CK renewal is not a new login')
assert.equal(meta.cookieSource, 'qqt_sso')
assert.equal(meta.cookieTtlSeconds, 5400, 'Expiry comes from WX, never a fabricated 72-hour window')
assert.throws(() => createSsoCookieMeta(previous, 'invalid', now))
assert.throws(() => createSsoCookieMeta(previous, '2026-10-12T00:00:00Z', now))
assert.equal(shouldRecover10086CookieByYunpan({ ...record, yunpanSession: undefined }), true)
assert.equal(shouldRecover10086CookieByYunpan({ ...record, disabledAt: 'now' }), false)

let saved = 0, exchanges = 0
const dependencies = {
  getAccountById: async () => record,
  issueAccountQqtTicket: async () => 'mock-ticket',
  collect10086CookieByQqtTicket: async () => { exchanges++; await new Promise(resolve => setTimeout(resolve, 10)); return collected },
  setAccountCookie: async (args: Parameters<typeof import('../services/accountsStore.js').setAccountCookie>[0]) => {
    saved++; assert.equal(args.ssoCookieExpireAt, collected.cookieExpireAt); return record
  },
  setAccountActivationInfo: async () => record,
}
const simultaneous = await Promise.all(Array.from({ length: 5 }, () => recover10086CookieByYunpan({ rec: record }, dependencies)))
assert.ok(simultaneous.every(result => result.ok))
assert.equal(exchanges, 1)
assert.equal(saved, 1)
saved = 0
const failed = await recover10086CookieByYunpan({ rec: record, clearOnYunpanFailure: true }, { ...dependencies,
  collect10086CookieByQqtTicket: async () => { throw new Error('mock upstream failure') } })
assert.equal(failed.ok, false)
assert.equal(saved, 0, 'Do not save an unverified CK or clear independently valid credentials')
assert.equal(record.yunpanSession?.authorization, 'mock-only-authorization')
assert.equal(record.qqtAccessToken, 'mock-global')
let reads = 0
const raced = await recover10086CookieByYunpan({ rec: record }, { ...dependencies,
  getAccountById: async () => ++reads === 1 ? record : { ...record, cookie: 'new-SMS-login' } })
assert.equal(raced.ok, false)
assert.equal(saved, 0, 'An exchange must not overwrite a newer interactive login')
reads = 0
const recoveredDuringRenewal = await recover10086CookieByYunpan({ rec: record }, { ...dependencies,
  getAccountById: async () => ++reads === 1 ? record : { ...record, cookie: 'verified-by-cloud-fallback',
    cookieSource: 'qqt_sso', cookieExpireAt: new Date(Date.now() + 1800000).toISOString() },
  collect10086CookieByQqtTicket: async () => { throw new Error('Must reuse WX cookie already verified during renewal') },
})
assert.equal(recoveredDuringRenewal.ok, true)
assert.equal(recoveredDuringRenewal.cookie, 'verified-by-cloud-fallback')
assert.equal(saved, 0)
console.log('qqt-sso-unit: ok; all upstream requests mocked')

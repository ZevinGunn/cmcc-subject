import assert from 'node:assert/strict'
import https from 'node:https'
import { EventEmitter } from 'node:events'
import { Readable } from 'node:stream'
import { cmccRefreshCookieByHome } from '../services/cmcc10086.js'
import { buildAigouSsoLinkFrom10086Cookie } from '../services/aigouSession.js'
import { buildCocPackageSsoLinkFrom10086Cookie } from '../services/cocPackageSession.js'

type MockResponse = { status: number; body?: string; headers?: Record<string, string | string[]> }
const responses: MockResponse[] = []
const calls: string[] = []
const original = https.request
https.request = ((url: string, options: { headers: Record<string, string> }, callback: (response: unknown) => void) => {
  const request = Object.assign(new EventEmitter(), {
    getHeaders: () => options.headers,
    setTimeout() {},
    write() {},
    end() {
      calls.push(url)
      const next = responses.shift()
      assert.ok(next, '测试不允许访问真实上游')
      queueMicrotask(() => callback(Object.assign(Readable.from([next.body || '']), {
        statusCode: next.status, headers: next.headers || {},
      })))
    },
  })
  return request
}) as unknown as typeof https.request

const cookie = 'd.sid=test-only; shareToken=test-only'
const loginPage = '<!doctype html><html><head><title>登录</title></head><body>短信验证码登录</body></html>'
const loginRedirect: MockResponse = { status: 302, headers: {
  location: '/website/bind/bindAccount/new', 'set-cookie': ['d.sid=; Max-Age=0; Path=/'],
} }
const validHome = 'var user = {"csrf":"test-csrf","telephone":"13800138000"}; var serverTime = 1;'
const validTicket: MockResponse = { status: 302, headers: {
  location: 'https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/wdqy?channelCode=P00000011455&token=test-ticket',
} }
try {
  // 首页 302、200 登录页以及清理 Cookie 都不能验活成功。
  for (const scenario of [loginRedirect,
    { status: 200, body: loginPage, headers: { 'set-cookie': ['d.sid=cleared; Path=/'] } },
    { status: 200, body: '<html><title>服务繁忙</title></html>' },
    { status: 200, body: 'var user = {"csrf":"  "}; var serverTime = 1;' },
  ]) {
    responses.push(scenario)
    const result = await cmccRefreshCookieByHome(cookie)
    assert.equal(result.ok, false)
    assert.match(result.message!, /未通过登录校验/)
    assert.equal(result.message!.includes('<html>'), false)
  }
  responses.push({ status: 200, body: validHome, headers: { 'set-cookie': ['shareToken=refreshed; Path=/'] } })
  const refreshed = await cmccRefreshCookieByHome(cookie)
  assert.equal(refreshed.ok, true)
  assert.equal(refreshed.cookieUpdated, true)
  assert.match(refreshed.cookie!, /shareToken=refreshed/)
  responses.push({ status: 503, body: '<html>unavailable</html>' })
  assert.equal((await cmccRefreshCookieByHome(cookie)).ok, false)

  for (const response of [{ status: 200, body: loginPage }, loginRedirect]) {
    responses.push(response)
    const result = await buildAigouSsoLinkFrom10086Cookie(cookie)
    assert.equal(result.ok, false)
    assert.equal(result.errorCode, 'COOKIE_INVALID')
    assert.match(result.message!, /重新使用 10086 登录/)
  }
  for (const response of [{ status: 403, body: '<html>Forbidden</html>' }, { status: 200, body: '<html><title>维护中</title></html>' }]) {
    responses.push(response)
    const result = await buildAigouSsoLinkFrom10086Cookie(cookie)
    assert.equal(result.ok, false)
    assert.notEqual(result.errorCode, 'COOKIE_INVALID', '临时错误不能误判为 CK 失效')
    assert.equal(result.message!.includes('<html>'), false)
    assert.match(result.message!, new RegExp(`HTTP ${response.status}`))
  }
  for (const target of ['age_feed', 'diamond_package'] as const) {
    responses.push({ status: 200, body: loginPage })
    const failed = await buildCocPackageSsoLinkFrom10086Cookie(cookie, target)
    assert.equal(failed.errorCode, 'COOKIE_INVALID')
    assert.equal(failed.ssoUrl, undefined)
    responses.push(validTicket)
    const result = await buildCocPackageSsoLinkFrom10086Cookie(cookie, target)
    assert.equal(result.ok, true)
    const url = new URL(result.ssoUrl!)
    assert.equal(url.searchParams.get('token'), 'test-ticket')
    assert.match(url.pathname, target === 'age_feed' ? /ageFeedPackage/ : /diamondPackage/)
  }
  assert.equal(calls.length, 14, '所有场景单次请求，无无限重试')
  assert.equal(responses.length, 0)
} finally {
  https.request = original
}
console.log('coc-sso-unit: OK（登录重定向、登录页、有效票据及临时错误均离线验证）')

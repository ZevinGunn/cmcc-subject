import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

// Set PLAYWRIGHT_MODULE to a bundled installation when Playwright is not installed locally.
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const base = process.env.QR_TEST_BASE_URL || 'http://127.0.0.1:5705'
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || undefined })
const page = await browser.newPage()
const calls = { start: 0, poll: 0, save: 0 }
let status = 'pending'
let failPoll = false
let failSave = false
let holdPoll = false
let releasePoll
let concurrentPolls = 0
let maxConcurrentPolls = 0
const errors = []
page.on('pageerror', (error) => errors.push(error.message))

try {
  await page.route('**/api/**', async (route) => {
    const path = new URL(route.request().url()).pathname.split('/').at(-1)
    assert.ok(['start', 'poll', 'save'].includes(path), 'No unrelated API requests')
    calls[path] += 1
    const input = route.request().postDataJSON()
    let data
    if (path === 'start') data = {
      flowId: `mock-flow-${calls.start}`, expiresInSeconds: 120, cookieNames: [],
      // Static QR encoding the inert text "mock-login", never a real login credential.
      qrImage: 'data:image/gif;base64,R0lGODdhFQAVAIAAAAAAAP///ywAAAAAFQAVAAACUoQPEbh4CtOaNKYnpbqmtftln4dNJaZtkQltTgdyTksztGuBVady4Vhh2XysYEs0G8EomtQtFDO9dJ6eMcZ4SKnWpoz5TYVV5AxvpS27ZsvVpAAAOw==',
    }
    if (path === 'poll') {
      concurrentPolls += 1
      maxConcurrentPolls = Math.max(maxConcurrentPolls, concurrentPolls)
      if (holdPoll) await new Promise((resolve) => { releasePoll = resolve })
      concurrentPolls -= 1
      if (failPoll) {
        failPoll = false
        await route.fulfill({ status: 503, json: { ok: false, message: '模拟临时查询失败' } })
        return
      }
      data = { flowId: input.flowId, status, cookieNames: [], expiresInSeconds: 118, message: status === 'pending' ? '等待扫码确认' : '扫码成功' }
    }
    if (path === 'save') {
      assert.match(input.phone, /^1\d{10}$/)
      if (failSave) {
        failSave = false
        await route.fulfill({ status: 500, json: { ok: false, message: '模拟保存失败' } })
        return
      }
      data = { account: { id: 'mock-saved', phone: input.phone }, cookie: 'mock-only' }
    }
    await route.fulfill({ json: { ok: true, data } })
  })
  await page.route('**/__qr-login-test', (route) => route.fulfill({ contentType: 'text/html', body: `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div><script type="module">
    import RefreshRuntime from '/@react-refresh'; RefreshRuntime.injectIntoGlobalHook(window);
    window.$RefreshReg$ = () => {}; window.$RefreshSig$ = () => type => type; window.__vite_plugin_react_preamble_installed__ = true;
    </script><script type="module" src="/src/tests/qr-login-harness.tsx"></script></body></html>` }))
  await page.goto(`${base}/__qr-login-test`)
  await page.getByRole('button', { name: 'App扫码登录', exact: true }).click()
  await page.getByAltText('中国移动 App 扫码登录二维码').waitFor()
  assert.equal(calls.start, 1, 'StrictMode generates exactly one QR')

  for (const [width, height] of [[1280, 800], [390, 844]]) {
    await page.setViewportSize({ width, height })
    await page.screenshot({ path: `/tmp/cookie-app-qr-${width}.png`, fullPage: true })
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
    assert.equal(overflow, false, `No horizontal overflow at ${width}`)
    const close = await page.getByRole('button', { name: '关闭', exact: true }).boundingBox()
    assert.ok(close && close.x >= 0 && close.y >= 0 && close.y + close.height <= height)
  }

  failPoll = true
  await page.waitForFunction(() => document.body.textContent.includes('模拟临时查询失败'))
  status = 'success'
  await page.waitForFunction(() => document.querySelector('[data-testid="saved"]').textContent === '1')
  assert.equal(calls.save, 1, 'Scan success automatically saves exactly once')
  assert.ok(calls.poll >= 2, 'Polling recovers after a transient error')

  status = 'pending'
  await page.getByRole('button', { name: 'Open', exact: true }).click()
  await page.getByRole('button', { name: 'App扫码登录', exact: true }).click()
  await page.getByAltText('中国移动 App 扫码登录二维码').waitFor()
  const pollBeforeClose = calls.poll
  await page.getByRole('button', { name: '关闭', exact: true }).click()
  await page.waitForTimeout(2200)
  assert.equal(calls.poll, pollBeforeClose, 'Closing cancels polling')

  await page.getByRole('button', { name: 'Open', exact: true }).click()
  await page.getByRole('button', { name: 'App扫码登录', exact: true }).click()
  await page.getByAltText('中国移动 App 扫码登录二维码').waitFor()
  holdPoll = true
  await page.getByRole('button', { name: '检查状态', exact: true }).click()
  await page.waitForTimeout(100)
  await page.getByRole('button', { name: '验证码登录', exact: true }).click()
  status = 'success'
  holdPoll = false
  releasePoll()
  await page.waitForTimeout(100)
  assert.equal(calls.save, 1, 'A stale poll cannot save after switching methods')

  status = 'success'
  failSave = true
  await page.getByRole('button', { name: 'App扫码登录', exact: true }).click()
  await page.waitForFunction(() => document.body.textContent.includes('模拟保存失败'))
  assert.equal(calls.save, 2)
  await page.getByRole('button', { name: '保存 CK', exact: true }).click()
  await page.waitForFunction(() => document.querySelector('[data-testid="saved"]').textContent === '2')
  assert.equal(calls.save, 3, 'Failed saves remain manually retryable')

  status = 'pending'
  await page.getByRole('button', { name: 'Open', exact: true }).click()
  await page.getByRole('button', { name: 'App扫码登录', exact: true }).click()
  await page.getByAltText('中国移动 App 扫码登录二维码').waitFor()
  holdPoll = true
  await page.getByRole('button', { name: '检查状态', exact: true }).click()
  await page.waitForTimeout(100)
  await page.getByRole('button', { name: 'Switch Account', exact: true }).evaluate((element) => element.click())
  await page.getByPlaceholder('请输入 11 位手机号').fill('13900000000')
  status = 'success'
  holdPoll = false
  releasePoll()
  await page.waitForTimeout(100)
  assert.equal(calls.save, 3, 'The previous account cannot be saved after an account switch')

  status = 'expired'
  await page.getByRole('button', { name: 'App扫码登录', exact: true }).click()
  await page.getByAltText('中国移动 App 扫码登录二维码').waitFor()
  await page.getByRole('button', { name: '检查状态', exact: true }).click()
  await page.waitForTimeout(100)
  assert.equal(await page.getByRole('button', { name: '检查状态', exact: true }).isDisabled(), true)
  const pollsAtExpiry = calls.poll
  await page.waitForTimeout(2200)
  assert.equal(calls.poll, pollsAtExpiry, 'Expired QR sessions stop polling')
  assert.equal(maxConcurrentPolls, 1)
  assert.deepEqual(errors, [])
  console.log('qr-login-browser: ok (automatic QR, serial polling, auto-save, cancellation, retry, desktop/mobile)')
} finally {
  releasePoll?.()
  await browser.close()
}

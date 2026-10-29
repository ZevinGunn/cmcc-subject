import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import fs from 'node:fs/promises'
import { exercisePhoneInput } from './phone-input-browser-helpers.mjs'
const base = process.env.YUNPAN_TEST_BASE || 'http://127.0.0.1:17402'
const output = process.env.YUNPAN_SCREENSHOTS || '/tmp/cookie-yunpan-ui-20261013'
await fs.mkdir(output, { recursive: true })
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
const errors = []
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 920 } })
    const calls = []
    let smsOk = false
    page.on('pageerror', e => errors.push(e.message))
    await page.context().route('**/*', route => {
      const url = new URL(route.request().url())
      return url.origin === base || url.hostname === 'o.alicdn.com' ? route.continue() : route.abort()
    })
    await page.route('**/*', async route => {
      const url = new URL(route.request().url())
      if (url.hostname === 'o.alicdn.com') {
        await route.fulfill({ contentType: 'text/javascript', body: `window.__captchaRefresh=0;window.initAliyunCaptcha=(options)=>{window.__testCaptcha=options;options.getInstance({refresh(){window.__captchaRefresh++},destroy(){}});document.querySelector(options.button).onclick=()=>options.success('mock-only-proof')}` })
        return
      }
      if (url.origin !== base) { await route.abort(); return }
      if (url.pathname === '/__yunpan-test') {
        await route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div><script type="module">import RefreshRuntime from "/@react-refresh";RefreshRuntime.injectIntoGlobalHook(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>type=>type;window.__vite_plugin_react_preamble_installed__=true;</script><script type="module" src="/src/tests/yunpan-harness.tsx"></script></body></html>' })
        return
      }
      if (!url.pathname.startsWith('/api/')) { await route.continue(); return }
      const body = route.request().postDataJSON() || {}
      calls.push({ path: url.pathname, body })
      assert.equal(body.publicLinkId || url.searchParams.get('publicLinkId'), 'mock-link')
      if (url.pathname === '/api/accounts/yunpan/sms/send') {
        assert.equal(body.puzzleVerifyCode, 'mock-only-proof')
        await route.fulfill({ json: smsOk ? { ok: true, data: { cooldownSeconds: 60 } } : { ok: false, message: '模拟风控失败' } })
      } else if (url.pathname === '/api/accounts/yunpan/login') {
        assert.equal(body.code, '123456')
        await route.fulfill({ json: { ok: true, data: { account: { id: 'mock-account' }, cookieLength: 0, yunpanLoginOnly: true } } })
      } else if (url.pathname.endsWith('/qqt/token')) {
        assert.equal(body.force, true)
        await route.fulfill({ json: { ok: true, data: { accessToken: 'mock-only-token' } } })
      } else if (url.pathname.endsWith('/qqt/sso-link')) {
        await route.fulfill({ json: { ok: true, data: { ssoUrl: 'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/new/ssoTokenLogin.action?token=mock-only-ticket' } } })
      } else if (url.pathname.endsWith('/yunpan/business-link')) {
        assert.ok(['cloudphone', 'capp'].includes(body.target))
        const host = body.target === 'capp' ? 'capp.139.com' : 'cloud.139.com'
        await route.fulfill({ json: { ok: true, data: { ssoUrl: `https://${host}/#/?token=mock-only-ticket` } } })
      } else throw new Error('Unexpected API: ' + url.pathname)
    })
    for (const state of ['valid', 'invalid', 'unchecked']) {
      await page.goto(base + '/__yunpan-test?credentials=' + state)
      const dialog = page.getByRole('dialog', { name: '138****0000' })
      await dialog.waitFor()
      const channels = dialog.locator('section').filter({ hasText: '各渠道 CK 管理' })
      const text = await channels.innerText()
      assert.ok(text.indexOf('云盘 CK（主凭据）') < text.indexOf('10086 CK'))
      assert.ok(text.includes(state === 'valid' ? '有效' : state === 'invalid' ? '失效' : '待验证'))
      assert.ok(text.includes('周三活动 CK'))
      await page.screenshot({ path: `${output}/${width}-credentials-${state}.png`, fullPage: true })
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      await dialog.getByRole('button', { name: 'CK 维护', exact: true }).click()
      assert.equal(await page.getByRole('status').innerText(), 'ck_maintenance:mock-account')
      await dialog.getByRole('button', { name: '关闭账号详情', exact: true }).click()
      assert.equal(await page.getByRole('dialog').count(), 0)
    }
    await page.goto(base + '/__yunpan-test')
    const send = page.getByRole('button', { name: '滑块验证并发送云盘验证码' })
    await send.waitFor()
    assert.equal(await send.isDisabled(), true)
    await exercisePhoneInput(page.getByPlaceholder('请输入 11 位手机号'))
    await send.click()
    await page.getByText('模拟风控失败').waitFor()
    assert.equal(calls.filter(c => c.path.endsWith('/sms/send')).length, 1)
    assert.ok(await page.evaluate(() => window.__captchaRefresh > 0))
    smsOk = true
    await send.click()
    await page.getByRole('button', { name: /重新获取\(/ }).waitFor()
    await page.evaluate(() => window.__testCaptcha.success('mock-only-proof'))
    assert.equal(calls.filter(c => c.path.endsWith('/sms/send')).length, 2, 'Duplicate success must not resend SMS')
    await page.screenshot({ path: `${output}/${width}-login.png`, fullPage: true })
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    await page.getByPlaceholder('请输入 6 位验证码').fill('123456')
    await page.getByRole('button', { name: '登录云盘并置换全球通 Token' }).click()
    await page.getByText('yunpan:no-ck', { exact: true }).waitFor()
    for (const label of ['全球通专区', '跳转云手机', '跳转云应用']) {
      await page.getByRole('button', { name: label, exact: true }).click()
      await page.getByRole('alertdialog').waitFor()
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      await page.screenshot({ path: `${output}/${width}-${label === '全球通专区' ? 'global' : label === '跳转云手机' ? 'cloudphone' : 'capp'}.png`, fullPage: true })
      // Close by opening in a new page: all external URLs are blocked by the test.
      const popupPromise = page.waitForEvent('popup')
      await page.getByRole('button', { name: '新标签页打开' }).click()
      const popup = await popupPromise
      await popup.close()
    }
    await page.getByRole('button', { name: '置换全球通 Token', exact: true }).click()
    await page.getByText('全球通 Token 已更新', { exact: true }).waitFor()
    assert.equal(calls.some(c => c.path.includes('/activate') || c.path.includes('/yunpan/refresh')), false)
    await page.close()
  }
  assert.deepEqual(errors, [])
  console.log('yunpan-browser: ok; 1440/390px, captcha/SMS/login/jump controls; all upstream calls mocked')
} finally { await browser.close() }

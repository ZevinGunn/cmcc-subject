import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import fs from 'node:fs/promises'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const base = process.env.QQT_BROADBAND_TEST_BASE_URL || 'http://127.0.0.1:4178'
const output = process.env.QQT_BROADBAND_SCREENSHOTS || '/tmp/cookie-app-qqt-broadband-qa'
await fs.mkdir(output, { recursive: true })

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
})
const pageErrors = []
const calls = []

try {
  for (const [width, height] of [[1440, 1000], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } })
    page.on('pageerror', (error) => pageErrors.push(error.message))
    let stage = 'ready'
    let loginStage = width > 400 ? 'captcha_ready' : 'logged_in'
    let loginComplete = loginStage === 'logged_in'
    const loginSession = () => ({
      id: `mock-login-${width}`,
      accountId: 'account-1',
      maskedPhone: '138****8000',
      stage: loginStage,
      loginCacheStatus: width > 400 ? (loginComplete ? 'saved' : 'missing') : 'reused',
      captchaImage: loginStage === 'captcha_ready' || loginStage === 'login_sms_sent'
        ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
        : undefined,
      loginSmsCooldownSeconds: loginStage === 'login_sms_sent' ? 60 : 0,
      orderSmsCooldownSeconds: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1_800_000).toISOString(),
    })
    const session = () => ({
      id: `mock-session-${width}`,
      accountId: 'account-1',
      maskedPhone: '138****8000',
      maskedOwnerName: '测**',
      stage,
      productName: '全球通等级尊享宽带（两年）套餐',
      contractMonths: 24,
      gears: [{ itemCode: 'UPSTREAM-IGNORED', name: '上游初始化档位' }],
      itemCode: '111602058352',
      initializationResponse: { code: 'success', data: { gears: [{ itemCode: 'UPSTREAM-IGNORED' }] } },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1_800_000).toISOString(),
    })

    await page.route('**/*', async (route) => {
      const url = new URL(route.request().url())
      if (url.origin !== base) {
        await route.abort()
        return
      }
      if (!url.pathname.startsWith('/api/')) {
        await route.continue()
        return
      }
      if (url.pathname === '/api/admin/me') {
        await route.fulfill({ json: { ok: true, data: { admin: { username: 'browser-test' } } } })
        return
      }
      if (url.pathname === '/api/accounts') {
        await route.fulfill({ json: { ok: true, data: { accounts: [{ id: 'account-1', phone: '13800138000', displayPhone: '138****8000', label: '测试账号', hasCookie: true }] } } })
        return
      }
      if (url.pathname === '/api/business-order/defaults') {
        await route.fulfill({ json: { ok: true, data: { productCode: 'mock', pageId: 'mock', touchCode: 'mock' } } })
        return
      }
      if (url.pathname === '/api/access-logs/page-view') {
        await route.fulfill({ json: { ok: true, data: { recorded: true } } })
        return
      }
      if (url.pathname.startsWith('/api/bmcc-activity-order/sessions')) {
        const body = route.request().postDataJSON?.() || {}
        calls.push({ method: route.request().method(), path: url.pathname, body })
        if (route.request().method() === 'DELETE') {
          await route.fulfill({ json: { ok: true, data: { deleted: true } } })
          return
        }
        if (url.pathname.endsWith('/captcha')) {
          loginStage = 'captcha_ready'
        } else if (url.pathname.endsWith('/login-sms')) {
          loginStage = 'login_sms_sent'
        } else if (url.pathname.endsWith('/login')) {
          loginStage = 'logged_in'
          loginComplete = true
        }
        await route.fulfill({ json: { ok: true, data: { session: loginSession() } } })
        return
      }
      assert.ok(url.pathname.startsWith('/api/qqt-premium-broadband-orders/sessions'), `unexpected API ${url.pathname}`)
      const body = route.request().postDataJSON?.() || {}
      calls.push({ method: route.request().method(), path: url.pathname, body })
      if (route.request().method() === 'DELETE') {
        await route.fulfill({ json: { ok: true, data: { deleted: true } } })
        return
      }
      if (route.request().method() === 'POST' && /\/sessions$/.test(url.pathname)) {
        assert.equal(loginComplete, true, 'product initialization requires a completed Beijing Mobile login')
        assert.equal(body.loginSessionId, `mock-login-${width}`)
      }
      if (url.pathname.endsWith('/check')) {
        stage = 'checked'
        await route.fulfill({ json: { ok: true, data: { session: { ...session(), precheck: { eligible: false, needsRealName: false, blocked: false, code: 'success', message: '活动资格不匹配', response: { code: 'success', data: { message: '活动资格不匹配' } } } } } } })
        return
      }
      if (url.pathname.endsWith('/submit')) {
        stage = 'finished'
        await route.fulfill({ json: { ok: true, data: { session: { ...session(), lastResult: { attempted: true, success: false, uncertain: false, code: 'failed', message: '活动资格不匹配', completedAt: new Date().toISOString(), response: { stage: 'commitQQTZX', commit: { code: 'failed', message: '活动资格不匹配', data: { reason: 'NOT_ELIGIBLE' } } } } } } } })
        return
      }
      await route.fulfill({ json: { ok: true, data: { session: session() } } })
    })

    await page.goto(`${base}/v2/business/order`)
    await page.getByRole('button', { name: /展开全部/ }).click()
    await page.getByRole('tab', { name: /尊享宽带/ }).click()
    await page.getByRole('combobox', { name: '办理账号' }).click()
    await page.getByRole('option', { name: /138\*\*\*\*8000/ }).click()
    await page.getByRole('button', { name: '登录北京移动' }).click()
    if (width > 400) {
      assert.equal(calls.some((call) => /qqt-premium-broadband-orders/.test(call.path)), false)
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'login has no horizontal overflow')
      await page.screenshot({ path: `${output}/${width}-login.png`, fullPage: true })
      await page.getByRole('textbox', { name: '图形验证码' }).fill('ABCD')
      await page.getByRole('button', { name: '发送登录验证码' }).click()
      await page.getByRole('alertdialog').waitFor()
      await page.getByRole('button', { name: '我知道了' }).click()
      await page.getByLabel('登录短信验证码').fill('123456')
      await page.getByRole('button', { name: '验证并进入办理' }).click()
    }
    await page.getByText('全球通等级尊享宽带（两年）套餐', { exact: true }).first().waitFor()
    await page.getByText('111602058352', { exact: true }).waitFor()
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'entry has no horizontal overflow')
    await page.screenshot({ path: `${output}/${width}-form.png`, fullPage: true })

    await page.getByRole('button', { name: '核验资格' }).click()
    await page.getByLabel('城区 *').selectOption('海淀区')
    await page.getByLabel('详细地址 *').fill('测试路1号')
    await page.getByLabel('安装联系电话 *').fill('13900000000')
    await page.getByLabel('期望安装日期 *').fill(new Date(Date.now() + 86_400_000).toISOString().slice(0, 10))
    await page.getByRole('checkbox').check()
    await page.getByLabel('输入“确认订购”').fill('确认订购')
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'filled form has no horizontal overflow')
    await page.getByRole('button', { name: '提交订购' }).click()
    await page.getByRole('alertdialog').waitFor()
    assert.match(await page.getByRole('alertdialog').innerText(), /活动资格不匹配/)
    await page.getByRole('button', { name: '我知道了' }).click()
    await page.getByText('NOT_ELIGIBLE', { exact: false }).waitFor()
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'result has no horizontal overflow')
    await page.screenshot({ path: `${output}/${width}-result.png`, fullPage: true })
    await page.getByRole('button', { name: '重新开始', exact: true }).last().click()
    await page.getByRole('button', { name: '登录北京移动' }).waitFor()
    await page.close()
  }
  assert.equal(pageErrors.length, 0, pageErrors.join('\n'))
  assert.ok(calls.some((call) => call.path.endsWith('/check')))
  assert.ok(calls.some((call) => call.path.endsWith('/check') && call.body.itemCode === undefined))
  assert.ok(calls.some((call) => call.path.endsWith('/submit') && call.body.confirmationText === '确认订购' && call.body.itemCode === undefined))
  assert.ok(calls.some((call) => call.path.endsWith('/login-sms')))
  assert.ok(calls.some((call) => call.path.endsWith('/login')))
  process.stdout.write(`qqt-premium-broadband-browser: ok (${output})\n`)
} finally {
  await browser.close()
}

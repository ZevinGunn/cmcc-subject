import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { chromium } from 'playwright'

const base = process.env.LEGACY_BUSINESS_TEST_BASE || 'http://127.0.0.1:4193'
const output = '/tmp/cmcc-legacy-business-ui'
await fs.mkdir(output, { recursive: true })
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
const errors = []
try {
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 860 } })
    page.on('pageerror', e => errors.push(e.message))
    let canUnsubscribe = true, smsAttempts = 0, submissions = 0, failQuery = false, needsAppLogin = false
    let credentialImports = 0
    let prepareCalls = 0, expireQuery = false, sessionId = 'fixture-session'
    const item = { id: 'test-business', queryType: '02', name: '测试增值业务（用于验证长名称折行与退订弹窗）', productCode: 'TEST-CODE', fee: '0.00元/月',
      orderedAt: '20261001', startsAt: '20261001', expiresAt: '20991231', detail: '业务详情测试文本。'.repeat(20), canUnsubscribe: true, status: '', isMain: false, hasContract: false }
    await page.route('**/*', async route => {
      const url = new URL(route.request().url())
      if (url.origin !== base) return route.abort()
      if (!url.pathname.startsWith('/api/')) return route.continue()
      const path = url.pathname
      if (path === '/api/access-logs/page-view') return route.fulfill({ json: { ok: true, data: {} } })
      if (path === '/api/auth/session') return route.fulfill({ json: { ok: true, data: { authenticated: false } } })
      if (path === '/api/auth/accounts') return route.fulfill({ json: { ok: true, data: { accounts: [{ id: 'fixture-account', phone: '13800000000', label: '界面验证账号' }] } } })
      if (path.startsWith('/api/business-query/')) {
        throw new Error('Legacy entry must never switch to the modern protocol: ' + path)
      }
      assert.ok(path.startsWith('/api/legacy-business-query/'), path)
      const body = route.request().postDataJSON()
      if (path.endsWith('/prepare')) {
        prepareCalls++
        if (body.legacyCookie || body.appToken) {
          assert.equal(body.legacyCookie, 'd.sid=fixture-legacy; shareToken=fixture-token==')
          assert.equal(body.appToken, '')
          credentialImports++; needsAppLogin = false; expireQuery = false; sessionId = 'import-session'
          item.id = 'import-business'
        } else if (needsAppLogin) return route.fulfill({ status: 409, json: { ok: false, errorCode: 'LEGACY_APP_LOGIN_REQUIRED', message: '当前登录态未建立旧版 App 业务会话，需要有效的旧版 CK 或 App 单点 Token' } })
        return route.fulfill({ json: { ok: true, data: { session: { id: sessionId, accountId: 'fixture-account', phoneMasked: '138****0000' }, label: '界面验证账号', canUnsubscribe } } })
      }
      assert.equal(body.accountId, 'fixture-account')
      assert.equal(body.sessionId, sessionId)
      if (path.endsWith('/query')) {
        if (expireQuery) return route.fulfill({ status: 410, json: { ok: false, errorCode: 'SESSION_EXPIRED', message: '旧版查询会话已过期' } })
        if (failQuery) return route.fulfill({ status: 502, json: { ok: false, message: '模拟查询失败' } })
        return route.fulfill({ json: { ok: true, data: { canUnsubscribe, errors: [], groups: [
          { type: '01', label: '我的套餐', items: [{ ...item, id: 'main', queryType: '01', name: '测试主套餐', isMain: true, canUnsubscribe: false }], queriedAt: '2026-10-18 08:00' },
          { type: '02', label: '增值业务', items: [item], queriedAt: '2026-10-18 08:00' },
          { type: '03', label: '基础服务', items: [], queriedAt: '2026-10-18 08:00' },
          { type: '04', label: '活动', items: [], queriedAt: '2026-10-18 08:00' },
        ] } } })
      }
      assert.equal(body.businessId, item.id)
      if (path.endsWith('/unsubscribe/sms')) {
        smsAttempts++
        return smsAttempts === 1 ? route.fulfill({ status: 502, json: { ok: false, message: '模拟发送失败，请重试' } })
          : route.fulfill({ json: { ok: true, data: { cooldownSeconds: 60, message: '验证码已发送' } } })
      }
      if (path.endsWith('/unsubscribe')) {
        assert.equal(body.smsCode, '000000'); assert.equal(body.confirmed, true); submissions++
        return route.fulfill({ status: 400, json: { ok: false, message: '您输入的验证码有误，请重新输入', errorCode: '6005' } })
      }
      throw new Error('Unexpected route ' + path)
    })
    const prefix = width === 390 ? '/app/cmcc-public' : ''
    await page.goto(`${base}${prefix}/legacy-business-query?accountId=fixture-account&returnTo=${encodeURIComponent('/public?link=fixture')}`)
    await page.getByRole('heading', { name: item.name }).waitFor()
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    assert.equal(await page.locator('header a').first().getAttribute('href'), '/public?link=fixture')
    await page.screenshot({ path: `${output}/${width}-list.png`, fullPage: true })
    await page.getByRole('textbox', { name: '搜索业务' }).fill('不存在的业务')
    await page.getByText('没有匹配的业务', { exact: true }).waitFor()
    await page.getByRole('textbox', { name: '搜索业务' }).fill('')
    await page.getByRole('button', { name: '退订', exact: true }).click()
    let modal = page.getByRole('dialog', { name: '确认退订业务' })
    await modal.waitFor()
    assert.equal(await modal.getByRole('button', { name: '发送验证码' }).isDisabled(), true)
    await modal.getByRole('checkbox').check()
    await modal.getByRole('button', { name: '发送验证码' }).click()
    await page.getByRole('alertdialog').getByText('模拟发送失败，请重试').waitFor()
    await page.getByRole('button', { name: '关闭消息', exact: true }).click()
    assert.equal(await modal.getByRole('button', { name: '发送验证码' }).isEnabled(), true)
    await modal.getByRole('button', { name: '发送验证码' }).click()
    await page.getByRole('button', { name: '关闭消息', exact: true }).click()
    assert.equal(await modal.getByRole('button', { name: /\d+s 后重发/ }).isDisabled(), true)
    await modal.getByRole('textbox', { name: '退订短信验证码' }).fill('000000')
    await modal.getByRole('button', { name: '确认退订', exact: true }).click()
    await page.getByRole('alertdialog').getByText('您输入的验证码有误，请重新输入').waitFor()
    await page.getByRole('button', { name: '关闭消息', exact: true }).click()
    assert.equal(await modal.getByRole('button', { name: '确认退订', exact: true }).isEnabled(), true)
    assert.equal(submissions, 1)
    const bounds = await modal.boundingBox()
    assert.ok(bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= width && bounds.y + bounds.height <= 860)
    await page.screenshot({ path: `${output}/${width}-unsubscribe.png` })
    await modal.getByRole('button', { name: '关闭退订弹窗' }).click()
    await page.getByRole('button', { name: '退订', exact: true }).click()
    modal = page.getByRole('dialog', { name: '确认退订业务' })
    assert.equal(await modal.getByRole('button', { name: /\d+s 后重发/ }).isDisabled(), true, 'Closing and reopening keeps SMS cooldown')
    await page.keyboard.press('Escape')
    assert.equal(await modal.count(), 0)
    failQuery = true
    await page.getByRole('button', { name: '刷新业务' }).click()
    await page.getByRole('alertdialog').waitFor()
    await page.getByRole('button', { name: '关闭消息', exact: true }).click()
    assert.equal(await page.getByRole('heading', { name: item.name }).count(), 1, 'Refresh failure retains prior results')
    failQuery = false; canUnsubscribe = false
    await page.getByRole('button', { name: '刷新业务' }).click()
    await page.waitForFunction(() => !document.querySelector('[aria-busy="true"]'))
    assert.equal(await page.getByRole('button', { name: '退订', exact: true }).count(), 0, 'No unsubscribe buttons without permission')
    needsAppLogin = true
    await page.reload()
    const notice = page.getByRole('alertdialog')
    await notice.getByRole('heading', { name: '旧版业务查询失败' }).waitFor()
    assert.equal(new URL(page.url()).pathname, `${prefix}/legacy-business-query`, 'Stay on the legacy page when native authentication is missing')
    assert.equal(new URL(page.url()).searchParams.get('returnTo'), '/public?link=fixture')
    await page.screenshot({ path: `${output}/${width}-native-required.png` })
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    await notice.getByRole('button', { name: '关闭消息', exact: true }).click()
    assert.equal(await notice.count(), 0)
    assert.equal(await page.locator('details').first().getAttribute('open'), '', 'Expand CK import automatically after WX login fails')
    const pasteCookie = async () => {
      await page.getByLabel('旧版或原生 App CK', { exact: true }).evaluate(element => {
        const clipboardData = new DataTransfer()
        clipboardData.setData('text/plain', 'Cookie: d.sid=fixture-legacy;\r\n shareToken=fixture-token==')
        element.dispatchEvent(new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true }))
      })
    }
    await pasteCookie()
    await page.screenshot({ path: `${output}/${width}-native-login.png` })
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    await page.getByRole('button', { name: '导入 CK 并查询', exact: true }).click()
    await page.getByRole('heading', { name: item.name }).waitFor()
    assert.equal(credentialImports, 1)
    assert.equal(await page.getByLabel('旧版或原生 App CK', { exact: true }).inputValue(), '')
    assert.equal(await page.getByLabel('App 单点 Token', { exact: true }).inputValue(), '')
    assert.ok((await page.locator('header').first().textContent()).includes('导入 CK'))
    const beforeRefresh = prepareCalls
    await page.getByRole('button', { name: '刷新业务' }).click()
    await page.waitForFunction(() => !document.querySelector('[aria-busy="true"]'))
    assert.equal(prepareCalls, beforeRefresh, 'Refreshing keeps the imported session')
    expireQuery = true
    await page.getByRole('button', { name: '刷新业务' }).click()
    await page.getByRole('alertdialog').waitFor()
    await page.getByRole('button', { name: '关闭消息', exact: true }).click()
    await page.getByText('导入 CK 查询', { exact: true }).click()
    await page.getByRole('button', { name: '重新导入 CK', exact: true }).click()
    await page.getByLabel('旧版或原生 App CK', { exact: true }).waitFor({ state: 'visible' })
    assert.equal(prepareCalls, beforeRefresh, 'Expired imported sessions do not silently prepare account credentials')
    canUnsubscribe = true
    await pasteCookie()
    await page.getByRole('button', { name: '导入 CK 并查询', exact: true }).click()
    await page.getByRole('button', { name: '退订', exact: true }).waitFor()
    await page.getByRole('button', { name: '退订', exact: true }).click()
    modal = page.getByRole('dialog', { name: '确认退订业务' })
    await modal.getByRole('checkbox').check()
    await modal.getByRole('button', { name: '发送验证码', exact: true }).click()
    await page.getByRole('button', { name: '关闭消息', exact: true }).click()
    assert.equal(smsAttempts, 3, 'Imported sessions can send unsubscribe SMS')
    await modal.getByRole('textbox', { name: '退订短信验证码' }).fill('000000')
    await modal.getByRole('button', { name: '确认退订', exact: true }).click()
    await page.getByRole('alertdialog').getByText('您输入的验证码有误，请重新输入').waitFor()
    assert.equal(submissions, 2)
    assert.equal(credentialImports, 2)
    await page.close()
  }
  assert.deepEqual(errors, [])
  console.log(`legacy-business-browser: OK (desktop, mobile, narrow viewport; ${output})`)
} finally { await browser.close() }

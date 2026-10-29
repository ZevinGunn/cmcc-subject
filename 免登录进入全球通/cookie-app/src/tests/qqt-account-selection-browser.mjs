import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { chromium } from 'playwright'

const base = process.env.QQT_ACCOUNT_TEST_BASE_URL || 'http://127.0.0.1:4179'
const output = '/tmp/cookie-app-qqt-account-selection'
await fs.mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true,
  executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const errors = []
const accounts = [
  { id: 'first', label: 'public-cookie-import', phoneMasked: '138****8001', hasCookie: true },
  { id: 'clicked', label: '已订业务登录', phoneMasked: '138****9702', hasCookie: false, hasYunpanSession: true, yunpanSessionCheckedAt: new Date().toISOString(), qqtAccessToken: 'available' },
  { id: 'token-only', phoneMasked: '138****8003', hasCookie: false, hasYunpanSession: true, yunpanSessionInvalidAt: new Date().toISOString(), qqtAccessToken: 'available' },
  { id: 'unchecked', phoneMasked: '138****8004', hasCookie: false, hasYunpanSession: true },
]
try {
  for (const width of [1440, 390]) {
    for (const scenario of ['signed-in', 'anonymous', 'missing', 'expired']) {
      const page = await browser.newPage({ viewport: { width, height: 900 } })
      page.on('pageerror', (error) => errors.push(error.message))
      const calls = []
      const overviewIds = []
      await page.route('**/*', async (route) => {
        const url = new URL(route.request().url())
        if (url.origin !== base) { await route.abort(); return }
        if (!url.pathname.startsWith('/api/')) { await route.continue(); return }
        calls.push(url.pathname)
        if (url.pathname === '/api/auth/accounts') {
          const updated = scenario === 'expired' && calls.filter((path) => path === url.pathname).length > 1
            ? accounts.map((account) => account.id === 'clicked' ? { ...account, yunpanSessionInvalidAt: new Date().toISOString() } : account)
            : accounts
          await route.fulfill(scenario === 'anonymous'
            ? { status: 401, json: { ok: false, message: '未登录' } }
            : { json: { ok: true, data: { accounts: updated } } }); return
        }
        if (url.pathname === '/api/accounts/public/link/invite/accounts') {
          await route.fulfill({ json: { ok: true, data: { accounts: [accounts[0]] } } }); return
        }
        if (url.pathname.endsWith('/global-telecom/overview')) {
          const id = url.pathname.split('/')[3]
          overviewIds.push(id)
          const account = accounts.find((item) => item.id === id)
          assert.ok(account)
          if (scenario === 'expired') {
            await route.fulfill(route.request().postDataJSON()?.cacheOnly
              ? { json: { ok: true, data: { account, overview: null } } }
              : { status: 401, json: { ok: false, message: '云盘 CK 已过期，需要补登' } }); return
          }
          await route.fulfill({ json: { ok: true, data: { account: { id }, overview: {
            refreshedAt: new Date().toISOString(),
            cache: { status: 'live', expiresAt: new Date(Date.now() + 60000).toISOString(), retryAfterSeconds: 60 },
            identity: { levelName: '全球通钻石卡', phoneMasked: account.phoneMasked },
            xdr: { availableCount: 0, freeCount: 0, paidCount: 0, claimedProductIds: [] },
            sign: { reSignRemaining: 0, days: [] },
            blindBox: { drawTotal: 0, drawUsed: 0, drawRemaining: 0, tasks: [], prizes: [] }, errors: {},
          } } } }); return
        }
        if (/global-telecom\/(blind-box|sign|resign|reward)$/.test(url.pathname)) throw new Error('Unexpected business mutation')
        await route.fulfill({ json: { ok: true, data: {} } })
      })
      const requested = scenario === 'missing' ? 'unavailable' : scenario === 'anonymous' ? 'first' : 'clicked'
      await page.goto(`${base}/app/cmcc-user/benefits/global-telecom?publicLinkId=invite&accountId=${requested}`)
      const select = page.getByRole('combobox', { name: '查询账号' })
      await select.waitFor()
      if (scenario === 'expired') {
        await page.getByText('云盘 CK 已过期，需要补登', { exact: true }).waitFor()
        await page.waitForFunction(() => Array.from(document.querySelectorAll('select option')).some((option) => option.textContent === '138****9702 · 云盘 CK 失效'))
        assert.equal(await select.inputValue(), 'clicked', 'Expiry changes cloud status without selecting another account')
        assert.equal(await select.locator('option').count(), 4)
        await page.screenshot({ path: `${output}/${scenario}-${width}.png`, fullPage: true })
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
        await page.close()
        continue
      }
      if (scenario === 'missing') {
        await page.getByText('所选账号不在当前可查询列表中，请返回账号页面刷新或重新登录该账号').waitFor()
        assert.equal(await select.inputValue(), '')
        assert.deepEqual(overviewIds, [], 'Missing account must never query the first/other account')
        await select.selectOption('clicked')
      }
      await page.getByText('全球通钻石卡', { exact: true }).waitFor()
      assert.equal(await select.inputValue(), scenario === 'anonymous' ? 'first' : 'clicked')
      assert.ok(overviewIds.every((id) => id === (scenario === 'anonymous' ? 'first' : 'clicked')))
      if (scenario === 'signed-in') {
        assert.deepEqual(await select.locator('option').allTextContents(), [
          '138****8001 · 云盘 CK 未登录', '138****9702 · 云盘 CK 有效',
          '138****8003 · 云盘 CK 失效', '138****8004 · 云盘 CK 待验证',
        ])
        assert.equal(calls.includes('/api/accounts/public/link/invite/accounts'), false)
        await select.selectOption('token-only')
        await page.locator('p').filter({ hasText: '138****8003 ·' }).waitFor()
        assert.equal(await select.inputValue(), 'token-only')
        await page.reload()
        await page.locator('p').filter({ hasText: '138****9702 ·' }).waitFor()
        assert.equal(await select.inputValue(), 'clicked', 'Reload respects the clicked account in the URL')
      } else if (scenario === 'anonymous') {
        assert.equal(await select.locator('option').count(), 1)
        assert.ok(calls.includes('/api/accounts/public/link/invite/accounts'))
        overviewIds.length = 0
        await page.goto(`${base}/app/cmcc-user/benefits/global-telecom?publicLinkId=invite&accountId=clicked`)
        await page.getByText('所选账号不在当前可查询列表中，请返回账号页面刷新或重新登录该账号').waitFor()
        assert.equal(await select.inputValue(), '')
        assert.deepEqual(overviewIds, [], 'Anonymous visitors cannot select an account outside the invite')
      }
      await page.screenshot({ path: `${output}/${scenario}-${width}.png`, fullPage: true })
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
      const back = page.getByRole('link', { name: '返回', exact: true })
      assert.equal(await back.getAttribute('href'), '/app/cmcc-user/public?link=invite')
      await page.close()
    }
  }
  assert.deepEqual(errors, [])
  console.log('qqt-account-selection-browser: ok (user/invite scope, requested account, reload, mobile/desktop)')
} finally { await browser.close() }

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { chromium } from 'playwright'

const base = process.env.BRAND_TEST_BASE || 'http://127.0.0.1:4179'
const output = '/tmp/cookie-brand-ui'
await fs.mkdir(output, { recursive: true })
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
const errors = []
try {
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    page.on('pageerror', error => errors.push(error.message))
    // 所有业务请求均由本地模拟响应，不触发登录、任务或其他真实操作。
    await page.route('**/*', async route => {
      const url = new URL(route.request().url())
      if (url.origin !== new URL(base).origin) return route.abort()
      if (!url.pathname.startsWith('/api/')) return route.continue()
      let data = {}
      if (url.pathname === '/api/auth/bootstrap') data = {
        user: { id: 'brand-test', username: '品牌界面测试', permissions: {} },
        accounts: [], states: {}, announcements: { announcements: [], unreadCount: 0, popupAnnouncement: null },
      }
      else if (url.pathname.startsWith('/api/starbucks/')) data = { accounts: [], configured: true, identity: '品牌界面测试' }
      else if (url.pathname.endsWith('/active-list')) data = { tasks: [] }
      else if (url.pathname.endsWith('/active')) data = { task: null }
      await route.fulfill({ json: { ok: true, data } })
    })
    async function verify(brand) {
      await page.waitForFunction(expected => document.documentElement.dataset.brand === expected, brand)
      const logo = page.locator('img.brand-logo:visible').first()
      await logo.waitFor()
      await logo.evaluate(image => image.decode())
      assert.equal(await logo.getAttribute('alt'), brand === 'cmcc' ? '中国移动' : '星巴克')
      assert.ok(await logo.evaluate(image => image.naturalWidth > 0))
      assert.match(await page.locator('link[rel="icon"]').getAttribute('href'), new RegExp('/brand/' + brand + '/favicon-32.png$'))
      assert.match(await page.locator('link[rel="apple-touch-icon"]').getAttribute('href'), new RegExp('/brand/' + brand + '/apple-touch-icon.png$'))
      assert.equal(await page.locator('meta[name="theme-color"]').getAttribute('content'), brand === 'cmcc' ? '#0085ce' : '#00754a')
      assert.match(await page.locator('.brand-page').first().evaluate(element => getComputedStyle(element).backgroundImage), /linear-gradient/)
      const overflow = await page.evaluate(() => ({
        width: innerWidth, scroll: document.documentElement.scrollWidth,
        elements: [...document.querySelectorAll('body *')].filter(element => element.getBoundingClientRect().right > innerWidth + 1).slice(0, 5).map(element => ({ tag: element.tagName, class: element.className, text: element.textContent.slice(0, 40) })),
      }))
      if (overflow.scroll > overflow.width) await page.screenshot({ path: output + '/' + width + '-overflow.png' })
      assert.ok(overflow.scroll <= overflow.width, JSON.stringify(overflow))
      await page.evaluate(async () => {
        const icon = new Image()
        icon.src = document.querySelector('link[rel="icon"]').href
        await icon.decode()
        if (icon.naturalWidth !== 32) throw new Error('favicon 未正确加载')
      })
    }
    await page.goto(base + '/starbucks')
    await page.getByRole('heading', { name: '星巴克卡券', exact: true }).waitFor()
    await verify('starbucks')
    await page.screenshot({ path: output + '/' + width + '-starbucks.png' })
    // 不刷新文档，验证 React Router 内的品牌切换。
    await page.evaluate(() => { history.pushState({}, '', '/public'); dispatchEvent(new PopStateEvent('popstate')) })
    await page.getByRole('heading', { name: '中国移动用户管理', exact: true }).waitFor()
    await verify('cmcc')
    await page.screenshot({ path: output + '/' + width + '-cmcc.png' })
    await page.evaluate(() => { history.pushState({}, '', '/starbucks'); dispatchEvent(new PopStateEvent('popstate')) })
    await page.getByRole('heading', { name: '星巴克卡券', exact: true }).waitFor()
    await verify('starbucks')
    await page.goto(base + '/admin-login')
    await page.getByRole('heading', { name: '管理员登录', exact: true }).waitFor()
    await verify('cmcc')
    await page.goto(base + '/app/cmcc-public')
    await page.getByRole('heading', { name: '中国移动用户管理', exact: true }).waitFor()
    await verify('cmcc')
    await page.close()
  }
  assert.deepEqual(errors, [])
  console.log('品牌图标、渐变、窄屏及 SPA 切换验证通过；截图：' + output)
} finally {
  await browser.close()
}

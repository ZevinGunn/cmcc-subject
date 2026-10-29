import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { chromium } from 'playwright'

const base = process.env.ACCOUNT_SORT_TEST_BASE || 'http://127.0.0.1:4179'
const output = '/tmp/cookie-account-sort-ui'
await fs.mkdir(output, { recursive: true })
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
const errors = []
try {
  for (const profile of [
    { width: 1440, height: 1000, mode: 'grid' },
    { width: 1920, height: 1000, mode: 'grid' },
    { width: 1440, height: 1000, mode: 'list' },
    { width: 390, height: 844, mode: 'grid', touch: true },
    { width: 390, height: 844, mode: 'list', touch: true },
    { width: 390, height: 844, mode: 'grid', touch: true, reduced: true },
  ]) {
    const tag = `${profile.width}-${profile.mode}${profile.reduced ? '-reduced' : ''}`
    const page = await browser.newPage({ viewport: profile, hasTouch: !!profile.touch, isMobile: !!profile.touch, reducedMotion: profile.reduced ? 'reduce' : 'no-preference' })
    page.on('pageerror', error => errors.push(error.message))
    let accounts = Array.from({ length: 14 }, (_, i) => ({
      id: `mock-${i}`, phoneMasked: `138****${String(i).padStart(4, '0')}`,
      hasCookie: true, hasYunpanSession: true, updatedAt: new Date().toISOString(),
    }))
    const writes = []
    let failSave = false
    let saveDelay = 0
    let inFlight = 0
    let maxInFlight = 0
    await page.addInitScript(mode => {
      localStorage.setItem('cmcc_public_onboarding_v2_mock-user', 'done')
      localStorage.setItem('public_login_account_view_mode', mode)
    }, profile.mode)
    await page.route('**/*', async route => {
      const url = new URL(route.request().url())
      if (url.origin !== new URL(base).origin) return route.abort()
      if (!url.pathname.startsWith('/api/')) return route.continue()
      let data = {}
      if (url.pathname === '/api/auth/bootstrap') data = {
        user: { id: 'mock-user', username: '拖拽回归测试', permissions: {} }, accounts, states: {},
        announcements: { announcements: [], unreadCount: 0, popupAnnouncement: null },
      }
      else if (url.pathname === '/api/auth/accounts/order') {
        const body = route.request().postDataJSON()
        writes.push(body)
        inFlight++
        maxInFlight = Math.max(maxInFlight, inFlight)
        if (saveDelay) await new Promise(resolve => setTimeout(resolve, saveDelay))
        inFlight--
        if (failSave) return route.fulfill({ json: { ok: false, message: '模拟保存失败' } })
        accounts = body.accountIds.map(id => ({ ...accounts.find(a => a.id === id), publicPinnedAt: body.pinnedAccountIds.includes(id) ? '2026-10-01T00:00:00Z' : undefined }))
        data = { accounts }
      }
      else if (url.pathname === '/api/auth/accounts') data = { accounts }
      else if (url.pathname === '/api/tasks/active') data = { task: null }
      else if (url.pathname === '/api/tasks/active-list') data = { tasks: [] }
      else if (url.pathname === '/api/auth/daily-tasks') data = { states: {} }
      else if (url.pathname === '/api/announcements/public') data = { announcements: [], unreadCount: 0 }
      else assert.equal(url.pathname, '/api/access-logs/page-view', `Unexpected API ${url.pathname}`)
      return route.fulfill({ json: { ok: true, data } })
    })
    await page.goto(base + '/public')
    await page.locator('[data-account-id="mock-0"]').waitFor()
    const ids = () => page.locator('[data-account-sortable="true"]').evaluateAll(nodes => nodes.map(n => n.dataset.accountId))
    const cdp = profile.touch ? await page.context().newCDPSession(page) : null
    const touchPoint = (x, y) => [{ x, y, id: 1, radiusX: 3, radiusY: 3 }]
    async function move(x, y) {
      if (cdp) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: touchPoint(x, y) })
      else await page.mouse.move(x, y)
    }
    async function start(id) {
      const card = page.locator(`[data-account-id="${id}"]`)
      await card.scrollIntoViewIfNeeded()
      await page.waitForTimeout(200)
      const rect = await card.locator('[data-account-drag-handle]').boundingBox()
      const x = rect.x + rect.width / 2, y = rect.y + rect.height / 2
      if (cdp) await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: touchPoint(x, y) })
      else { await page.mouse.move(x, y); await page.mouse.down() }
      await move(x + 8, y + 8)
      await page.locator('.account-sort-fallback').waitFor()
      return { x: x + 8, y: y + 8 }
    }
    async function release(alreadyCancelled = false) {
      if (cdp && !alreadyCancelled) await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      else if (!cdp) await page.mouse.up()
      await page.waitForTimeout(250)
      assert.equal(await page.locator('.account-sort-fallback, .account-sort-overlay, .account-sort-settling').count(), 0)
      assert.equal(await page.locator('[data-account-id]').count(), 14)
    }
    async function target(id) {
      const rect = await page.locator(`[data-account-id="${id}"]`).boundingBox()
      await move(rect.x + rect.width / 2, rect.y + rect.height / 2)
      await page.waitForTimeout(220)
    }
    const before = await ids()
    const pointer = await start('mock-0')
    const ghost = page.locator('.account-sort-fallback')
    const style = await ghost.evaluate(node => ({ transition: getComputedStyle(node).transitionDuration, bg: getComputedStyle(node).backgroundColor, opacity: getComputedStyle(node).opacity }))
    assert.equal(style.transition, '0s', `${tag}: pointer tracking must not interpolate`)
    assert.equal(style.bg, 'rgb(255, 255, 255)')
    assert.equal(style.opacity, '1')
    assert.equal(await page.locator('.account-sort-ghost > *').first().evaluate(node => getComputedStyle(node).visibility), 'hidden')
    const initial = await ghost.boundingBox()
    for (const dx of [80, 150, 50, 120]) {
      await move(pointer.x - dx, pointer.y + 15)
      await page.evaluate(() => new Promise(requestAnimationFrame))
      const rect = await ghost.boundingBox()
      assert.ok(Math.abs(rect.x - (initial.x + 8 - dx)) < 2, `${tag}: ghost must follow pointer including reversal (${rect.x}, expected ${initial.x + 8 - dx})`)
    }
    await target('mock-1')
    await page.screenshot({ path: `${output}/${tag}-drag.png` })
    await release()
    assert.notDeepEqual(await ids(), before, `${tag}: drop must change order`)
    assert.deepEqual(await ids(), accounts.map(a => a.id), `${tag}: React and saved DOM must agree`)

    // Escape and native touch cancellation restore order without a save.
    const stable = await ids(), count = writes.length
    await start(stable[0])
    await target(stable[1])
    if (cdp) await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] })
    else await page.keyboard.press('Escape')
    await release(!!cdp)
    assert.deepEqual(await ids(), stable)
    assert.equal(writes.length, count)

    // Server errors must restore the last confirmed order, with a toast.
    failSave = true
    await start(stable[0]); await target(stable[1]); await release()
    await page.getByRole('status').filter({ hasText: '模拟保存失败' }).waitFor()
    assert.deepEqual(await ids(), stable)
    failSave = false

    // Rapid repeat drags must not race slow persistence responses.
    saveDelay = 1300
    await start(stable[0]); await target(stable[1]); await release()
    const intermediate = await ids()
    await start(intermediate[0]); await target(intermediate[1]); await release()
    const latest = await ids()
    await page.waitForTimeout(2700)
    assert.deepEqual(await ids(), latest)
    assert.deepEqual(accounts.map(a => a.id), latest)
    assert.equal(maxInFlight, 1)
    saveDelay = 0

    // Hold near the bottom edge: scroll should continue without pointer moves.
    await start(latest[0])
    await move(200, profile.height - 8)
    await page.waitForTimeout(200)
    const scrollBefore = await page.evaluate(() => scrollY)
    await page.waitForTimeout(350)
    assert.ok(await page.evaluate(() => scrollY) > scrollBefore + 20, `${tag}: edge auto-scroll`)
    await page.keyboard.press('Escape')
    await release()
    await page.reload()
    await page.locator('[data-account-id]').first().waitFor()
    assert.deepEqual(await ids(), accounts.map(a => a.id), `${tag}: refresh retains order`)
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    await page.screenshot({ path: `${output}/${tag}-after.png` })
    if (cdp) {
      // A vertical swipe on the card body scrolls the page instead of sorting.
      await page.locator('[data-account-id]').first().scrollIntoViewIfNeeded()
      const rect = await page.locator('[data-account-id]').first().boundingBox()
      const x = rect.x + 40, y = rect.y + 85
      const countBefore = writes.length
      const scrollStart = await page.evaluate(() => scrollY)
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: touchPoint(x, y) })
      for (let i = 1; i <= 6; i++) await move(x, y - i * 20)
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await page.waitForTimeout(250)
      assert.equal(await page.locator('.account-sort-fallback').count(), 0)
      assert.equal(writes.length, countBefore)
      assert.ok(await page.evaluate(() => scrollY) > scrollStart, `${tag}: body swipe scrolls naturally`)
    }
    await page.close()
    console.log(`account-sort: ${tag} ok (all APIs mocked)`)
  }
  assert.deepEqual(errors, [])
} finally { await browser.close() }

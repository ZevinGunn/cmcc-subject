import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { chromium } from 'playwright'
import { exercisePhoneInput } from './phone-input-browser-helpers.mjs'

const base = process.env.ACCOUNT_MENU_TEST_BASE || 'http://127.0.0.1:17402'
const output = process.env.ACCOUNT_MENU_SCREENSHOTS || '/tmp/cookie-account-menu-ui-20261013'
await fs.mkdir(output, { recursive: true })
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
const pageErrors = []
const now = new Date().toISOString()
const old = '2026-01-01T00:00:00.000Z'
const future = new Date(Date.now() + 86400000 * 3).toISOString()
const accounts = [
  { id: 'cloud', displayPhone: '138****0001', hasCookie: true, hasYunpanSession: true,
    cookieInvalidAt: old, cookieInvalidReason: '旧10086 CK已失效', cookieExpireAt: old,
    smsLoginExpireAt: old, lastLoginMethod: 'yunpan', yunpanSessionUpdatedAt: now,
    activationInfo: { data: { resultData: { tariffPackages: '不应显示的旧套餐' } } } },
  { id: 'cmcc', displayPhone: '138****0002', hasCookie: true, cookieExpireAt: future,
    lastLoginMethod: 'cmcc_sms', cookieUpdatedAt: now },
  { id: 'dual', displayPhone: '138****0003', hasCookie: true, hasYunpanSession: true,
    cookieExpireAt: future, lastLoginMethod: 'cmcc_sms', cookieUpdatedAt: now },
  { id: 'global', displayPhone: '138****0004', hasCookie: false, hasYunpanSession: false },
].map(account => ({ ...account, phoneMasked: account.displayPhone, phone: '13800000000',
  qqtAccessToken: account.id === 'cmcc' ? undefined : 'mock-only-token', updatedAt: now,
  qqtInfo: { data: { levelName: '金卡', province: '北京', netAge: '10年' } } }))
const announcements = { announcements: [], unreadCount: 0, popupAnnouncement: null, serverDay: '2026-10-13' }
try {
  for (const [width, height] of [[1440, 1000], [390, 844], [390, 568]]) {
    const page = await browser.newPage({ viewport: { width, height } })
    const calls = []
    const runtimeAccounts = structuredClone(accounts)
    let failCapp = false
    let failCmcc = true
    page.on('pageerror', error => pageErrors.push(error.message))
    await page.addInitScript(() => localStorage.setItem('cmcc_public_onboarding_v2_mock-user', 'done'))
    await page.route('**/*', async route => {
      const url = new URL(route.request().url())
      if (url.origin !== base) { await route.abort(); return }
      if (!url.pathname.startsWith('/api/')) { await route.continue(); return }
      const path = url.pathname
      calls.push({ path, method: route.request().method(), body: route.request().postDataJSON() })
      let data = {}
      if (path === '/api/auth/bootstrap') data = { user: { id: 'mock-user', username: '界面测试', permissions: { businessOrder: true, benefitActivity: true } }, accounts: runtimeAccounts, states: {}, announcements }
      else if (path === '/api/auth/accounts') data = { accounts: runtimeAccounts }
      else if (path === '/api/auth/daily-tasks') data = { states: {} }
      else if (path === '/api/announcements/public') data = announcements
      else if (path === '/api/tasks/active') data = { task: null }
      else if (path === '/api/tasks/active-list') data = { tasks: [] }
      else if (path.endsWith('/qqt/token')) data = { accessToken: 'mock-only-new-token' }
      else if (path.endsWith('/qqt/sso-link')) data = { ssoUrl: 'https://qqt.cmicrwx.cn/?token=mock-only-ticket' }
      else if (path.endsWith('/qqt/10086-link')) data = { ssoUrl: 'https://wx.10086.cn/website/sso/netUni?net_token=mock-only-ticket' }
      else if (path.endsWith('/qqt/10086')) {
        if (failCmcc) { await route.fulfill({ status: 502, json: { ok: false, message: '模拟10086置换失败，原登录状态已保留' } }); return }
        const account = runtimeAccounts.find(account => path.includes(`/${account.id}/`))
        Object.assign(account, { hasCookie: true, cookieInvalidAt: undefined, cookieInvalidReason: undefined,
          cookieSource: 'qqt_sso', cookieExpireAt: future, cookieUpdatedAt: now })
        data = { cookieLength: 100 }
      }
      else if (path.endsWith('/yunpan/business-link')) {
        const target = route.request().postDataJSON().target
        assert.ok(['capp', 'cloudphone'].includes(target))
        if (failCapp && target === 'capp') {
          await route.fulfill({ status: 502, json: { ok: false, message: '模拟云应用换票失败' } }); return
        }
        data = { ssoUrl: `https://${target === 'capp' ? 'capp.139.com' : 'cloud.139.com'}/#/?token=mock-only-ticket` }
      } else {
        assert.ok(['/api/access-logs/page-view'].includes(path), `unexpected API: ${path}`)
      }
      await route.fulfill({ json: { ok: true, data } })
    })
    await page.goto(base + '/public')
    const cloud = page.locator('[data-account-id="cloud"]')
    await cloud.waitFor()
    assert.ok((await cloud.innerText()).includes('已登录'))
    assert.equal((await cloud.innerText()).includes('过期'), false)
    assert.equal((await cloud.innerText()).includes('旧10086'), false)
    assert.equal(await cloud.getByRole('button', { name: '跳转云手机' }).count(), 0)
    await cloud.getByRole('button', { name: '详情', exact: true }).click()
    assert.equal((await cloud.innerText()).includes('主套餐'), false)
    assert.ok((await cloud.innerText()).includes('金卡'))
    assert.equal((await page.locator('body').innerText()).includes('登录窗口已过期'), false)
    async function open(id = 'cloud') {
      const trigger = page.locator(`[data-account-id="${id}"]`).getByRole('button', { name: /操作菜单/ })
      await trigger.scrollIntoViewIfNeeded()
      // 模拟用户在已可见的按钮上操作，先让自动滚动事件完成，再打开浮层。
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      await trigger.click()
      const menu = page.getByRole('menu')
      await menu.waitFor()
      assert.equal(await menu.getByRole('menuitem').first().innerText(), '重新登录')
      const box = await menu.boundingBox()
      assert.ok(box.x >= 0 && box.y >= 0 && box.x + box.width <= width && box.y + box.height <= height + 1)
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      return menu
    }
    let menu = await open()
    assert.equal(await menu.getByRole('group', { name: '10086 服务' }).count(), 1)
    assert.equal(await menu.getByRole('menuitem', { name: '已订业务', exact: true }).count(), 0)
    assert.equal(await menu.getByRole('menuitem', { name: '置换 10086 CK', exact: true }).count(), 1)
    await page.screenshot({ path: `${output}/${width}-${height}-cloud-menu.png` })
    assert.equal(await menu.isVisible(), true)
    await page.keyboard.press('ArrowDown')
    assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), '全球通信息查询')
    await page.keyboard.press('Escape')
    assert.equal(await page.getByRole('menu').count(), 0)
    assert.match(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), /操作菜单/)
    menu = await open()
    await menu.getByRole('menuitem', { name: '重新登录', exact: true }).click()
    await page.getByText('重新登录账号', { exact: true }).waitFor()
    assert.ok(await page.getByRole('button', { name: '云盘登录', exact: true }).count())
    assert.ok(await page.getByRole('button', { name: '验证码登录', exact: true }).count())
    await exercisePhoneInput(page.getByPlaceholder('请输入 11 位手机号'))
    await page.getByRole('button', { name: '验证码登录', exact: true }).click()
    await exercisePhoneInput(page.getByPlaceholder('请输入 11 位手机号'))
    await page.getByRole('button', { name: '关闭', exact: true }).click()
    for (const label of ['跳转云手机', '跳转云应用', '全球通专区', '跳转 10086']) {
      menu = await open()
      await menu.getByRole('menuitem', { name: label, exact: true }).click()
      await page.getByRole('alertdialog').waitFor()
      const popupPromise = page.waitForEvent('popup')
      await page.getByRole('button', { name: '新标签页打开' }).click()
      const popup = await popupPromise
      await popup.close()
    }
    menu = await open()
    await menu.getByRole('menuitem', { name: '置换全球通 Token', exact: true }).click()
    await page.getByRole('status').filter({ hasText: '全球通 Token 已更新' }).waitFor()
    failCapp = true
    menu = await open()
    await menu.getByRole('menuitem', { name: '跳转云应用', exact: true }).click()
    await page.getByRole('status').filter({ hasText: '模拟云应用换票失败' }).waitFor()
    assert.equal(await page.getByRole('alertdialog').count(), 0)
    menu = await open('global')
    assert.equal(await menu.getByRole('group', { name: '云服务' }).count(), 1, 'QQT-only accounts can generate cloud links')
    assert.equal(await menu.getByRole('menuitem', { name: '置换 10086 CK', exact: true }).count(), 1)
    await page.keyboard.press('Escape')
    menu = await open()
    await menu.getByRole('menuitem', { name: '置换 10086 CK', exact: true }).click()
    await page.getByRole('status').filter({ hasText: '模拟10086置换失败' }).waitFor()
    assert.ok((await cloud.innerText()).includes('已登录'), 'WX failure must preserve Yunpan login')
    failCmcc = false
    menu = await open()
    await menu.getByRole('menuitem', { name: '置换 10086 CK', exact: true }).click()
    await page.getByRole('status').filter({ hasText: '10086 CK 已置换' }).waitFor()
    menu = await open()
    assert.equal(await menu.getByRole('menuitem', { name: '已订业务', exact: true }).count(), 1, 'Verified CK enables original WX services')
    await page.keyboard.press('Escape')
    menu = await open('cmcc')
    assert.ok(await menu.getByRole('group', { name: '10086 服务' }).count())
    assert.equal(await menu.getByRole('group', { name: '云服务' }).count(), 0)
    await page.screenshot({ path: `${output}/${width}-${height}-cmcc-menu.png` })
    assert.equal(await menu.isVisible(), true)
    await page.keyboard.press('End')
    assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), '删除账号')
    const deleteBox = await menu.getByRole('menuitem', { name: '删除账号' }).boundingBox()
    const menuBox = await menu.boundingBox()
    assert.ok(deleteBox.y >= menuBox.y && deleteBox.y + deleteBox.height <= menuBox.y + menuBox.height + 1)
    await page.keyboard.press('Home')
    assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), '重新登录')
    await page.keyboard.press('Escape')
    menu = await open('dual')
    assert.ok(await menu.getByRole('group', { name: '10086 服务' }).count())
    assert.ok(await menu.getByRole('group', { name: '云服务' }).count())
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: '列表展示' }).click()
    menu = await open()
    assert.ok(await menu.getByRole('menuitem', { name: '跳转云手机' }).count())
    await page.keyboard.press('Escape')
    assert.equal(calls.some(call => /\/(activate|refresh|sms\/send|sign)$/.test(call.path)), false)
    await page.close()
  }
  assert.deepEqual(pageErrors, [])
  console.log(`public-account-menu-browser: ok; cloud/10086/dual, grid/list, keyboard, viewport edges (${output}); all APIs mocked`)
} finally { await browser.close() }

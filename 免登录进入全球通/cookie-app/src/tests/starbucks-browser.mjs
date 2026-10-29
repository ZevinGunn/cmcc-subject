import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { chromium } from 'playwright'
import { exercisePhoneInput } from './phone-input-browser-helpers.mjs'

const base = process.env.STARBUCKS_TEST_BASE || 'http://127.0.0.1:4179'
const output = '/tmp/starbucks-coupons-ui'
await fs.mkdir(output, { recursive: true })
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
const errors = []
try {
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    page.on('pageerror', error => errors.push(error.message))
    await page.addInitScript(() => {
      window.__copied = ''
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: async text => { window.__copied = text } } })
    })
    const coupon = (i, title, status = 'active') => ({
      id: i.toString(16).padStart(64, '0'), title, status, expiresAt: Date.now() + 86400000 * 30,
      expiryText: '测试有效期 · 剩余 30 天', numberMasked: `TEST****${String(i).padStart(4, '0')}`, codeAvailable: true, discountDesc: '好礼券使用规则示例',
    })
    let accounts = [{ id: 'one', phoneMasked: '138****0001', customerMasked: 'MEM_****0001', updatedAt: new Date().toISOString(), queriedAt: new Date().toISOString(),
      coupons: [coupon(1, '8 元饮品券'), coupon(2, '8 元饮品券'), coupon(3, '8 元饮品券'), coupon(4, '15 元饮品券'), coupon(5, '15 元饮品券', 'used'), coupon(6, '早餐组合券', 'expired'), coupon(7, '测试未知券', 'unknown')] },
    { id: 'two', phoneMasked: '138****0002', customerMasked: 'MEM_****0002', updatedAt: new Date().toISOString(), queriedAt: new Date().toISOString(),
      coupons: [{ ...coupon(1, '8 元饮品券'), expiresAt: Date.now() + 2 * 86400000 }, { ...coupon(8, '15 元饮品券'), expiresAt: null }] },
    { id: 'three', phoneMasked: '138****0003', customerMasked: 'MEM_****0003', updatedAt: new Date().toISOString(), queriedAt: new Date().toISOString(), coupons: [] }]
    const calls = []
    let failRefresh = false, expire = false, unauthorized = false, failCodesId = ''
    await page.route('**/*', async route => {
      const url = new URL(route.request().url())
      if (url.origin !== base) return route.abort()
      if (!url.pathname.startsWith('/api/')) return route.continue()
      if (url.pathname === '/api/access-logs/page-view') return route.fulfill({ json: { ok: true, data: {} } })
      assert.ok(url.pathname.startsWith('/api/starbucks/'), `unexpected API ${url.pathname}`)
      assert.equal(route.request().headers()['x-starbucks-client'], '1')
      const body = route.request().postDataJSON()
      calls.push({ path: url.pathname, body })
      if (unauthorized) return route.fulfill({ status: 401, json: { ok: false, message: '请先登录站点账号', errorCode: 'SITE_LOGIN_REQUIRED' } })
      let data = { accounts, configured: true, identity: '界面验证' }
      if (url.pathname.endsWith('/sms')) data = { cooldownSeconds: 60 }
      if (url.pathname.endsWith('/login')) {
        assert.match(body.phone, /^1\d{10}$/); assert.match(body.pin, /^\d{4}$/)
        data = { ...data, accountId: 'one' }
      }
      if (url.pathname.endsWith('/codes')) {
        const current = accounts.find(a => url.pathname.includes(`/${a.id}/`))
        if (current.id === failCodesId) return route.fulfill({ status: 502, json: { ok: false, message: '模拟账号券码读取失败', errorCode: 'UPSTREAM_REJECTED' } })
        data = { codes: body.ids.map(id => { const c = current.coupons.find(c => c.id === id); assert.ok(c); return { id, title: c.title, code: `FIXTURE-${current.id === 'two' ? 'TWO-' : ''}CODE-${parseInt(id, 16)}`, shortCode: 'fixture-short', phoneMasked: current.phoneMasked, expiryText: c.expiryText } }) }
      }
      if (url.pathname.endsWith('/refresh') && (failRefresh || expire)) {
        if (expire) accounts[0].invalidAt = new Date().toISOString()
        return route.fulfill({ status: expire ? 401 : 502, json: { ok: false, message: expire ? '星巴克登录已失效，请重新登录' : '模拟星巴克接口失败', errorCode: expire ? 'SESSION_EXPIRED' : 'UPSTREAM_REJECTED' } })
      }
      if (url.pathname.endsWith('/remove')) { accounts = accounts.filter(a => !url.pathname.includes(`/${a.id}/`)); data.accounts = accounts }
      await route.fulfill({ json: { ok: true, data } })
    })
    async function closeMessage() {
      const dialog = page.getByRole('alertdialog')
      await dialog.waitFor()
      await dialog.getByRole('button', { name: '关闭消息', exact: true }).click()
      await dialog.waitFor({ state: 'detached' })
    }
    async function filterScope() {
      if (width < 1024) {
        await page.getByRole('button', { name: '高级查询', exact: true }).click()
        return page.getByRole('dialog', { name: '高级查询', exact: true })
      }
      return page.getByRole('search', { name: '卡券筛选', exact: true })
    }
    async function filterWith(change) {
      const scope = await filterScope()
      await change(scope)
      if (width < 1024) {
        await scope.getByRole('button', { name: '确认筛选', exact: true }).click()
        await scope.waitFor({ state: 'detached' })
      }
    }
    const selectFilter = (label, value) => filterWith(scope => scope.getByLabel(label, { exact: true }).selectOption(value))
    const selectAccount = id => selectFilter('选择星巴克账号', id)
    async function clearFilters() {
      await filterWith(scope => scope.getByRole('button', { name: width < 1024 ? '重置' : '清除筛选', exact: true }).click())
    }
    await page.goto(base + '/starbucks')
    await page.getByRole('heading', { name: '星巴克卡券', exact: true }).waitFor()
    await page.getByLabel('全选当前筛选卡券', { exact: true }).waitFor()
    await page.getByRole('heading', { name: '全部号码的卡券', exact: true }).waitFor()
    assert.equal(await page.getByRole('button', { name: /查看券码/ }).count(), 6, 'all accounts including duplicate coupon ids must be listed')
    if (width < 1024) {
      assert.equal(await page.getByRole('search', { name: '卡券筛选' }).isVisible(), false)
      await page.getByLabel('全选当前筛选卡券', { exact: true }).check()
      let query = await filterScope()
      for (const label of ['选择星巴克账号', '卡券分类', '卡券状态', '有效期筛选', '搜索卡券', '到期日期起始', '到期日期结束']) {
        assert.equal(await query.getByLabel(label, { exact: true }).isVisible(), true, label + '应在弹窗中')
      }
      await query.getByLabel('选择星巴克账号', { exact: true }).selectOption('two')
      await query.getByLabel('卡券分类', { exact: true }).selectOption('15 元饮品券')
      assert.equal(await page.getByRole('button', { name: /查看券码/ }).count(), 6, '草稿不能提前改变列表')
      assert.equal(await page.getByLabel('全选当前筛选卡券', { exact: true }).isChecked(), true)
      await query.getByRole('button', { name: '取消', exact: true }).click()
      query = await filterScope()
      assert.equal(await query.getByLabel('选择星巴克账号', { exact: true }).inputValue(), 'all')
      assert.equal(await query.getByLabel('卡券分类', { exact: true }).inputValue(), '')
      await query.getByLabel('选择星巴克账号', { exact: true }).selectOption('two')
      await query.getByRole('button', { name: '确认筛选', exact: true }).click()
      await page.getByRole('heading', { name: '138****0002', exact: true }).waitFor()
      assert.equal(await page.getByRole('button', { name: /查看券码/ }).count(), 2)
      await clearFilters()
      assert.equal(await page.getByRole('button', { name: /查看券码/ }).count(), 6)
      query = await filterScope()
      await query.getByLabel('搜索卡券', { exact: true }).fill('不存在的卡券')
      await query.getByRole('button', { name: '重置', exact: true }).click()
      assert.equal(await query.getByLabel('搜索卡券', { exact: true }).inputValue(), '')
      await query.getByLabel('搜索卡券', { exact: true }).fill('仍然不应该生效')
      await page.keyboard.press('Escape')
      assert.equal(await page.getByRole('button', { name: '高级查询', exact: true }).evaluate(element => element === document.activeElement), true)
      assert.equal(await page.getByRole('button', { name: /查看券码/ }).count(), 6)
      query = await filterScope()
      await query.getByLabel('搜索卡券', { exact: true }).fill('关闭遮罩时丢弃草稿')
      await page.getByRole('button', { name: '关闭高级查询遮罩', exact: true }).click({ position: { x: 2, y: 2 } })
      query = await filterScope()
      assert.equal(await query.getByLabel('搜索卡券', { exact: true }).inputValue(), '')
      await query.getByLabel('到期日期起始', { exact: true }).fill('2030-01-03')
      await query.getByLabel('到期日期结束', { exact: true }).fill('2030-01-01')
      await query.getByRole('button', { name: '确认筛选', exact: true }).click()
      assert.equal(await query.isVisible(), true, '日期倒置不能提交筛选')
      await query.getByRole('button', { name: '取消', exact: true }).click()
      await page.setViewportSize({ width, height: 568 })
      query = await filterScope()
      await query.getByLabel('到期日期起始', { exact: true }).fill('2030-01-03')
      await query.getByLabel('到期日期结束', { exact: true }).fill('2030-01-09')
      await query.getByLabel('到期日期结束', { exact: true }).scrollIntoViewIfNeeded()
      const applyBounds = await query.getByRole('button', { name: '确认筛选', exact: true }).boundingBox()
      assert.ok(applyBounds.y >= 0 && applyBounds.y + applyBounds.height <= 568, '小屏确认按钮必须留在可视区域')
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      await page.screenshot({ path: output + '/' + width + '-advanced-query.png' })
      await query.getByRole('button', { name: '取消', exact: true }).click()
      await page.setViewportSize({ width, height: 900 })
    } else {
      assert.equal(await page.getByRole('button', { name: '高级查询', exact: true }).isVisible(), false)
      assert.equal(await page.getByRole('search', { name: '卡券筛选' }).getByLabel('选择星巴克账号', { exact: true }).isVisible(), true)
    }
    assert.equal(calls.some(c => c.path.endsWith('/codes')), false)
    assert.equal((await page.locator('body').innerText()).includes('FIXTURE-CODE'), false)
    await page.getByRole('button', { name: '刷新卡券', exact: true }).click()
    await page.getByRole('button', { name: '刷新卡券', exact: true }).waitFor({ state: 'visible' })
    await page.waitForFunction(() => ![...document.querySelectorAll('button')].find(b => b.textContent.trim() === '刷新卡券')?.disabled)
    assert.deepEqual(calls.filter(c => c.path.endsWith('/refresh')).map(c => c.path.split('/')[4]), ['one', 'two', 'three'])
    await selectFilter('卡券分类', '8 元饮品券')
    await page.getByLabel('全选当前筛选卡券', { exact: true }).check()
    await page.getByRole('button', { name: '批量复制（4）', exact: true }).click()
    const exportDialog = page.getByRole('dialog', { name: '批量复制 · 4 张卡券', exact: true })
    await exportDialog.waitFor()
    const text = await exportDialog.getByLabel('复制预览', { exact: true }).inputValue()
    for (const code of [1, 2, 3]) assert.ok(text.includes(`FIXTURE-CODE-${code}`))
    assert.ok(text.includes('FIXTURE-TWO-CODE-1') && text.includes('138****0001') && text.includes('138****0002'))
    assert.equal(text.split('8 元饮品券 × 4').length, 2, 'same type is grouped once across accounts')
    const copyPhone = exportDialog.getByRole('checkbox', { name: '号码', exact: true })
    const copyCode = exportDialog.getByRole('checkbox', { name: '卡券券码', exact: true })
    const copyExpiry = exportDialog.getByRole('checkbox', { name: '有效期', exact: true })
    const preview = () => exportDialog.getByLabel('复制预览', { exact: true }).inputValue()
    assert.ok(await copyPhone.isChecked() && await copyCode.isChecked() && await copyExpiry.isChecked())
    await copyPhone.uncheck()
    await copyExpiry.uncheck()
    const onlyCodesText = '8 元饮品券 × 4\nFIXTURE-TWO-CODE-1\nFIXTURE-CODE-1\nFIXTURE-CODE-2\nFIXTURE-CODE-3'
    assert.equal(await preview(), onlyCodesText)
    await copyCode.uncheck()
    assert.equal(await preview(), '')
    assert.equal(await exportDialog.getByRole('button', { name: '复制 4 张卡券', exact: true }).isDisabled(), true)
    await copyPhone.check()
    assert.ok((await preview()).includes('138****0001') && !(await preview()).includes('FIXTURE-'))
    await copyExpiry.check()
    assert.ok((await preview()).includes('测试有效期') && !(await preview()).includes('FIXTURE-'))
    await copyPhone.uncheck()
    assert.ok(!(await preview()).includes('138****') && (await preview()).includes('测试有效期'))
    await copyCode.check()
    assert.ok((await preview()).includes('FIXTURE-') && (await preview()).includes('测试有效期') && !(await preview()).includes('138****'))
    await copyPhone.check()
    assert.equal(await preview(), text)
    await copyExpiry.uncheck()
    assert.ok((await preview()).includes('138****') && (await preview()).includes('FIXTURE-') && !(await preview()).includes('测试有效期'))
    await copyPhone.uncheck()
    await exportDialog.getByRole('button', { name: '复制 4 张卡券', exact: true }).click()
    assert.equal(await page.evaluate(() => window.__copied), onlyCodesText)
    await closeMessage()
    await selectFilter('有效期筛选', '7')
    assert.equal(await page.getByRole('button', { name: /查看券码/ }).count(), 1)
    await selectFilter('有效期筛选', 'all')
    await selectAccount('two')
    assert.equal(await page.getByLabel('卡券分类', { exact: true }).inputValue(), '8 元饮品券')
    assert.equal(await page.getByRole('button', { name: /查看券码/ }).count(), 1)
    await selectAccount('all')
    const shanghaiDay = offset => new Date(Date.now() + offset * 86400000 + 8 * 3600000).toISOString().slice(0, 10)
    await filterWith(async scope => {
      await scope.getByLabel('到期日期起始', { exact: true }).fill(shanghaiDay(1))
      await scope.getByLabel('到期日期结束', { exact: true }).fill(shanghaiDay(3))
    })
    assert.equal(await page.getByRole('button', { name: /查看券码/ }).count(), 1)
    await clearFilters()
    await selectFilter('有效期筛选', 'unknown')
    assert.equal(await page.getByRole('button', { name: /查看券码/ }).count(), 1)
    await selectFilter('有效期筛选', 'all')
    await page.getByRole('button', { name: '复制全部15 元饮品券', exact: true }).click()
    await page.getByRole('dialog', { name: '批量复制 · 2 张卡券', exact: true }).waitFor()
    await page.keyboard.press('Escape')
    failCodesId = 'two'
    await page.getByRole('button', { name: '复制全部8 元饮品券', exact: true }).click()
    await page.getByRole('alertdialog').getByText('部分卡券读取失败', { exact: true }).waitFor()
    await closeMessage()
    await page.getByRole('dialog', { name: '批量复制 · 3 张卡券', exact: true }).waitFor()
    await page.keyboard.press('Escape')
    failCodesId = ''
    await page.getByRole('button', { name: '复制当前筛选（6）', exact: true }).click()
    const allCopy = page.getByRole('dialog', { name: '批量复制 · 6 张卡券', exact: true })
    await allCopy.waitFor()
    const allText = await allCopy.getByLabel('复制预览', { exact: true }).inputValue()
    assert.ok(allText.includes('8 元饮品券 × 4') && allText.includes('15 元饮品券 × 2'))
    assert.ok(!(await allCopy.getByRole('checkbox', { name: '号码', exact: true }).isChecked()))
    assert.ok(!(await allCopy.getByRole('checkbox', { name: '有效期', exact: true }).isChecked()))
    assert.ok(!allText.includes('138****') && !allText.includes('测试有效期'))
    assert.ok(allText.includes('FIXTURE-CODE-4') && allText.includes('FIXTURE-TWO-CODE-8'))
    const formatBounds = await allCopy.boundingBox()
    assert.ok(formatBounds.x >= 0 && formatBounds.x + formatBounds.width <= width, '格式弹窗不应横向溢出')
    await page.screenshot({ path: output + '/' + width + '-copy-format.png' })
    await allCopy.getByRole('button', { name: '复制 6 张卡券', exact: true }).click()
    assert.equal(await page.evaluate(() => window.__copied), allText)
    await closeMessage()
    await selectFilter('卡券状态', 'all')
    await page.getByRole('button', { name: '复制当前筛选（9）', exact: true }).click()
    const allStatesCopy = page.getByRole('dialog', { name: '批量复制 · 9 张卡券', exact: true })
    await allStatesCopy.waitFor()
    assert.ok((await allStatesCopy.getByLabel('复制预览', { exact: true }).inputValue()).includes('15 元饮品券 × 3'))
    assert.equal(calls.filter(c => c.path.endsWith('/codes')).at(-1).body.activeOnly, false)
    await page.keyboard.press('Escape')
    await selectFilter('卡券分类', '')
    await selectFilter('卡券状态', 'used')
    assert.equal(await page.getByRole('checkbox', { name: /选择卡券/ }).isDisabled(), false)
    await page.getByRole('button', { name: /查看券码/ }).click()
    await page.getByRole('dialog', { name: '卡券券码', exact: true }).waitFor()
    await page.keyboard.press('Escape')
    assert.equal(await page.getByRole('dialog').count(), 0)
    await selectAccount('three')
    await page.getByText('当前账号暂无好礼券', { exact: true }).waitFor()
    await selectAccount('one')
    await selectFilter('卡券状态', 'active')
    assert.equal(await page.getByRole('button', { name: '批量复制', exact: true }).isDisabled(), true)
    failRefresh = true
    await page.getByRole('button', { name: '刷新卡券', exact: true }).click()
    await closeMessage()
    assert.equal(await page.getByRole('button', { name: /查看券码/ }).count(), 4, 'failed refresh keeps prior coupons')
    failRefresh = false
    await page.getByRole('button', { name: '添加星巴克账号', exact: true }).click()
    const loginDialog = page.getByRole('dialog', { name: '登录星巴克', exact: true })
    await exercisePhoneInput(loginDialog.getByLabel('手机号', { exact: true }))
    await loginDialog.getByRole('button', { name: '发送验证码', exact: true }).click()
    await closeMessage()
    const sms = loginDialog.getByRole('button', { name: /s 后重发/ })
    assert.equal(await sms.isDisabled(), true)
    await loginDialog.getByLabel('短信验证码', { exact: true }).fill('0000')
    await loginDialog.getByRole('button', { name: '登录并查询卡券', exact: true }).click()
    await loginDialog.waitFor({ state: 'detached' })
    await page.evaluate(() => window.scrollTo(0, 0))
    if (width >= 1024) {
      const categoryBox = await page.getByRole('search', { name: '卡券筛选' }).getByLabel('卡券分类', { exact: true }).boundingBox()
      assert.ok(categoryBox.width >= 100, '桌面筛选项应保持可读')
    } else {
      assert.equal(await page.getByRole('search', { name: '卡券筛选' }).isVisible(), false)
      assert.equal(await page.getByRole('button', { name: '高级查询', exact: true }).isVisible(), true)
    }
    await page.screenshot({ path: `${output}/${width}-coupons.png` })
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    await selectAccount('one')
    expire = true
    await page.getByRole('button', { name: '刷新卡券', exact: true }).click()
    await closeMessage()
    await page.getByText('登录已失效，请重新登录', { exact: true }).waitFor()
    assert.equal(await page.getByRole('button', { name: /查看券码/ }).first().isDisabled(), true)
    expire = false
    await page.getByRole('button', { name: '移除星巴克账号', exact: true }).click()
    await page.getByRole('button', { name: '取消', exact: true }).click()
    assert.equal(accounts.length, 3)
    await page.getByRole('button', { name: '移除星巴克账号', exact: true }).click()
    await page.getByRole('button', { name: '确认移除', exact: true }).click()
    await selectAccount('three')
    await page.getByText('当前账号暂无好礼券', { exact: true }).waitFor()
    assert.equal(accounts.length, 2)
    unauthorized = true
    await page.reload()
    await page.getByRole('link', { name: '登录账号中心', exact: true }).waitFor()
    assert.equal(await page.getByRole('button', { name: /查看券码/ }).count(), 0)
    assert.equal(calls.filter(c => c.path.endsWith('/sms')).length, 1)
    await page.close()
    console.log(`starbucks-browser: ${width}px ok, all APIs mocked`)
  }
  assert.deepEqual(errors, [])
} finally { await browser.close() }

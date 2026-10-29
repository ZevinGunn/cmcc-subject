import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { chromium } from 'playwright'

const base = process.env.AGE_FEED_TEST_BASE_URL || 'http://127.0.0.1:4188'
const output = '/tmp/cookie-app-age-feed-qa'
await fs.mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const errors = []
try {
  for (const [width, height] of [[1440, 1000], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } })
    page.on('pageerror', (error) => errors.push(error.message))
    let session
    let eligible = false
    let failProduct = true
    let orderSmsCount = 0
    let confirmCount = 0
    const tiers = { '100000099780': '银卡', '100000099781': '金卡', '100000099779': '白金卡' }
    await page.route('**/*', async (route) => {
      const url = new URL(route.request().url())
      if (url.origin !== base) { await route.abort(); return }
      if (!url.pathname.startsWith('/api/')) { await route.continue(); return }
      const body = route.request().postDataJSON() || {}
      if (url.pathname === '/api/business-order/defaults') {
        await route.fulfill({ json: { ok: true, data: { productCode: '1000000100290', pageId: '1889216886548430848', touchCode: 'P00000078835' } } }); return
      }
      assert.ok(url.pathname.startsWith('/api/business-order/sessions'), `意外接口：${url.pathname}`)
      const action = url.pathname.split('/').at(-1)
      if (route.request().method() === 'DELETE') {
        await route.fulfill({ json: { ok: true, data: { deleted: true } } }); return
      }
      if (action === 'sessions') {
        assert.equal(body.target, 'age_feed')
        assert.equal(body.accountId, 'mock-account')
        session = { id: 'mock-age-feed', target: 'age_feed', ageFeedTier: body.productCode, stage: 'logged_in', maskedPhone: '139****0000', pageId: '1889487239237201920', touchCode: 'P00000115802', productCode: body.productCode === 'auto' ? '100000099780' : body.productCode, loginSmsCooldownSeconds: 0, orderSmsCooldownSeconds: 0 }
      } else if (action === 'product') {
        if (failProduct) {
          failProduct = false
          await route.fulfill({ status: 502, json: { ok: false, message: '资格查询暂时失败，请重试', errorCode: 'UPSTREAM_HTTP' } }); return
        }
        const manual = body.productCode !== 'auto'
        if (manual) assert.ok(tiers[body.productCode])
        const productCode = manual ? body.productCode : eligible ? '100000099781' : '100000099780'
        const allowed = manual || eligible
        session = { ...session, lastResult: undefined, ageFeedTier: body.productCode, stage: 'product_ready', productCode, product: {
          productCode, productName: allowed ? `全球通网龄直升 · ${tiers[productCode]}` : '全球通网龄直升',
          configured: allowed, available: allowed, eligible, relationOrdered: false, orderAllowed: allowed,
          eligibilitySummary: manual ? '手动选择 · 待运营商受理' : eligible ? '资格通过' : '暂不可办理',
          eligibilityDetail: eligible ? '网龄：25年6个月 · 当前等级：银卡 · 可直升：金卡' : '网龄：19年11个月；网龄未满 20 年，不符合本活动条件',
          rulesHtml: '<p>模拟官方活动规则</p>', warnings: manual ? ['手动选择不代表资格通过或订购成功'] : [],
          protocol: allowed ? { name: '网龄直升业务受理协议', sequenceId: `test-protocol-${productCode}`, content: `<p>${tiers[productCode]}测试协议内容</p>` } : { name: '', sequenceId: '', content: '' },
        } }
      } else if (action === 'order-sms') {
        assert.equal(body.acceptedProtocol, true)
        orderSmsCount++
        session = { ...session, stage: 'order_sms_sent', orderSmsCooldownSeconds: 60 }
      } else if (action === 'confirm') {
        assert.equal(body.confirmationText, '确认订购')
        assert.equal(body.code, '123456')
        confirmCount++
        session = { ...session, stage: 'finished', lastResult: { success: true, uncertain: false, code: '0', message: '模拟订购成功', completedAt: new Date().toISOString() } }
        await route.fulfill({ json: { ok: true, data: { session, result: session.lastResult } } }); return
      } else { throw new Error(`意外订购操作：${action}`) }
      await route.fulfill({ json: { ok: true, data: { session } } })
    })
    // 复用现有统一订购测试宿主；全部 API 由上述拦截器接管。
    await page.route('**/__age-feed-test', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div><script type="module">import RefreshRuntime from "/@react-refresh";RefreshRuntime.injectIntoGlobalHook(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>type=>type;window.__vite_plugin_react_preamble_installed__=true;</script><script type="module" src="/src/tests/lucky-bag-harness.tsx"></script></body></html>' }))
    const checkOverflow = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px 不应横向溢出`)
    await page.goto(`${base}/__age-feed-test`)
    assert.equal(await page.getByRole('link', { name: '返回public' }).getAttribute('href'), '/public')
    await page.getByRole('tab', { name: /全球通网龄直升/ }).click()
    await page.getByRole('button', { name: '校验并开始', exact: true }).click()
    await page.getByRole('button', { name: '获取产品信息', exact: true }).click()
    await page.getByRole('alertdialog').waitFor()
    await checkOverflow()
    await page.screenshot({ path: `${output}/${width}-error.png`, fullPage: true })
    await page.getByRole('button', { name: '关闭消息', exact: true }).click()
    assert.equal(await page.getByRole('alertdialog').count(), 0)
    await page.getByRole('button', { name: '获取产品信息', exact: true }).click()
    await page.getByText('暂不可办理', { exact: true }).waitFor()
    assert.equal(await page.getByRole('button', { name: '发送订购验证码', exact: true }).count(), 0)
    await checkOverflow()
    await page.screenshot({ path: `${output}/${width}-ineligible.png`, fullPage: true })
    for (const [productCode, tierName] of Object.entries(tiers)) {
      await page.getByLabel('直升档位', { exact: true }).selectOption(productCode)
      assert.equal(await page.getByRole('button', { name: '发送订购验证码', exact: true }).count(), 0, '换档位后隐藏旧协议和验证码操作')
      await page.getByRole('button', { name: '重新获取产品信息', exact: true }).click()
      await page.getByText(`全球通网龄直升 · ${tierName}`, { exact: true }).waitFor()
      await page.getByText(`${tierName}测试协议内容`, { exact: true }).waitFor()
      assert.equal(await page.getByRole('button', { name: '发送订购验证码', exact: true }).isDisabled(), true)
      await checkOverflow()
    }
    await page.screenshot({ path: `${output}/${width}-manual.png`, fullPage: true })
    await page.getByLabel('直升档位', { exact: true }).selectOption('auto')
    eligible = true
    await page.getByRole('button', { name: '重新获取产品信息', exact: true }).click()
    await page.getByText('全球通网龄直升 · 金卡', { exact: true }).waitFor()
    assert.equal(await page.getByLabel('直升档位', { exact: true }).inputValue(), 'auto')
    assert.equal(await page.getByRole('button', { name: '发送订购验证码', exact: true }).isDisabled(), true)
    await page.getByRole('checkbox').check()
    await checkOverflow()
    await page.screenshot({ path: `${output}/${width}-ready.png`, fullPage: true })
    await page.getByRole('button', { name: '发送订购验证码', exact: true }).click()
    assert.equal(await page.getByRole('button', { name: /s 后重发/ }).isDisabled(), true)
    await page.getByLabel('订购验证码', { exact: true }).fill('123456')
    await page.getByLabel('输入“确认订购”').fill('确认订购')
    await page.getByRole('button', { name: '确认订购', exact: true }).click()
    await page.getByText('模拟订购成功', { exact: true }).waitFor()
    assert.equal(orderSmsCount, 1)
    assert.equal(confirmCount, 1)
    await page.getByLabel('直升档位', { exact: true }).selectOption('100000099779')
    await page.getByRole('button', { name: '重新获取产品信息', exact: true }).click()
    await page.getByText('全球通网龄直升 · 白金卡', { exact: true }).waitFor()
    assert.equal(await page.getByRole('checkbox').isChecked(), false, '换档位必须重新同意协议')
    assert.equal(await page.getByLabel('订购验证码', { exact: true }).inputValue(), '')
    await checkOverflow()
    await page.getByRole('button', { name: '切换账号', exact: true }).click()
    await page.getByRole('button', { name: '校验并开始', exact: true }).waitFor()
    await page.getByRole('tab', { name: /卓越钻石卡/ }).click()
    await page.getByRole('tab', { name: /全球通网龄直升/ }).click()
    await checkOverflow()
    await page.close()
  }
  assert.deepEqual(errors, [])
  console.log(`age-feed-browser: OK（桌面和移动端，全 API 模拟；截图 ${output}）`)
} finally {
  await browser.close()
}

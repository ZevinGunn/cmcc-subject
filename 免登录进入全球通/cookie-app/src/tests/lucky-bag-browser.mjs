import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import fs from 'node:fs/promises'
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const base = process.env.LUCKY_BAG_TEST_BASE_URL || 'http://127.0.0.1:5706'
const output = process.env.LUCKY_BAG_SCREENSHOTS || '/tmp/cookie-app-lucky-bag-qa'
await fs.mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || undefined })
const errors = []
const calls = []
const benefits = {
  standard: [['100000096334', '移动云盘白银会员'], ['100000096337', '咪咕快游会员'], ['100000096338', '视频彩铃钻石会员'], ['100000096335', '新通话 AI精彩通话'], ['100000096336', '2C4G云电脑20小时月包']],
  deluxe: [['100000096339', '咪咕视频钻石会员'], ['100000096342', '移动云盘黄金会员'], ['100000096340', '8C16G云电脑20小时月包'], ['100000096341', '云手机专业版']],
}
try {
  for (const [width, height] of [[1440, 1000], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } })
    page.on('pageerror', (error) => errors.push(error.message))
    let variant = 'standard', mainOrdered = false, currentBenefit = '', session, sequence = 0, failProduct = false
    const product = () => ({
      name: variant === 'standard' ? '标准福袋' : '豪华福袋', productCode: variant === 'standard' ? '100000096331' : '100000096333',
      rulesHtml: '<p>模拟规则：每次选择一项权益。</p>', warnings: ['多选一，更换将替代当前权益；费用以协议为准'],
      norms: benefits[variant].filter(([id]) => id !== currentBenefit).map(([id, name]) => ({ id, packageId: `mock-bundle-${id}`, name, price: mainOrdered ? 0 : variant === 'standard' ? 9.9 : 19.9, candidateIds: [id], variantCount: 1 })),
      bagStatus: { variant, mainOrdered, currentBenefitCodes: currentBenefit ? [currentBenefit] : [], action: !mainOrdered ? 'main_order' : currentBenefit ? 'benefit_change' : 'benefit_order', mainMonthlyFee: variant === 'standard' ? 9.9 : 19.9 },
      details: [{ label: '当前权益', value: benefits[variant].find(([id]) => id === currentBenefit)?.[1] || '未选择' }],
    })
    await page.route('**/*', async (route) => {
      const url = new URL(route.request().url())
      if (url.origin !== base) { await route.abort(); return }
      if (!url.pathname.startsWith('/api/')) { await route.continue(); return }
      if (url.pathname === '/api/business-order/defaults') {
        assert.equal(route.request().method(), 'GET')
        await route.fulfill({ json: { ok: true, data: { productCode: 'mock-default', pageId: 'mock-page', touchCode: 'mock-channel' } } })
        return
      }
      assert.ok(url.pathname.startsWith('/api/benefit-orders/sessions'), 'only mocked order API is allowed')
      const body = route.request().postDataJSON() || {}
      calls.push({ path: url.pathname, body })
      if (route.request().method() === 'DELETE') { await route.fulfill({ json: { ok: true, data: {} } }); return }
      const action = url.pathname.split('/').at(-1)
      if (action === 'sessions') {
        variant = body.bagVariant
        session = { id: `mock-${++sequence}`, workflow: 'lucky_bag', stage: 'initialized', maskedPhone: '139****0000', loginSmsCooldownSeconds: 0, orderSmsCooldownSeconds: 0 }
      } else if (action === 'login-sms') session.stage = 'login_sms_sent'
      else if (action === 'login') { assert.equal(body.code, '123456'); session.stage = 'authenticated' }
      else if (action === 'product') {
        if (failProduct) { failProduct = false; await route.fulfill({ status: 424, json: { ok: false, message: '模拟关系查询失败', errorCode: 'BAG_RELATION_INVALID', requestId: 'mock-request' } }); return }
        session = { ...session, stage: 'product_ready', product: product(), lastResult: undefined }
      } else if (action === 'selection') {
        const id = body.selectedIds[0], name = benefits[variant].find(([code]) => code === id)?.[1]
        assert.ok(name)
        session = { ...session, stage: 'selection_ready', product: { ...session.product, selectedIds: [id], selectedName: name, eligible: true, protocolRequired: true, protocol: { name: '模拟业务受理协议', content: '<p>仅模拟：套餐内权益替换。</p><script>window.__unsafe=true</script>', sequenceId: 'mock-sequence' } } }
      } else if (action === 'back') { session = { ...session, stage: 'product_ready', product: product() } }
      else if (action === 'order-sms') { assert.equal(body.acceptedProtocol, true); session.stage = 'order_sms_sent' }
      else if (action === 'confirm') {
        assert.equal(body.code, '654321'); assert.equal(body.confirmationText, '确认订购'); assert.equal(body.acceptedProtocol, true)
        mainOrdered = true; currentBenefit = session.product.selectedIds[0]
        session.stage = 'finished'
        session.lastResult = { success: true, accepted: true, uncertain: false, code: '0', message: '模拟已受理', orderStatus: '待确认生效', completedAt: new Date().toISOString() }
        await route.fulfill({ json: { ok: true, data: { session, result: session.lastResult } } }); return
      } else throw new Error(`Unexpected mock action ${action}`)
      await route.fulfill({ json: { ok: true, data: { session } } })
    })
    await page.route('**/__lucky-bag-test', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div><script type="module">import RefreshRuntime from "/@react-refresh";RefreshRuntime.injectIntoGlobalHook(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>type=>type;window.__vite_plugin_react_preamble_installed__=true;</script><script type="module" src="/src/tests/lucky-bag-harness.tsx"></script></body></html>' }))
    const overflow = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal overflow')
    await page.goto(`${base}/__lucky-bag-test`)
    assert.equal(await page.getByRole('link', { name: '返回public' }).getAttribute('href'), '/public')
    await page.getByRole('button', { name: /展开全部/ }).click()
    await page.getByRole('tab', { name: /标准福袋/ }).click()
    await overflow()
    await page.screenshot({ path: `${output}/${width}-entries.png`, fullPage: true })
    for (const selectedVariant of ['standard', 'deluxe']) {
      mainOrdered = selectedVariant === 'deluxe'; currentBenefit = selectedVariant === 'deluxe' ? '100000096339' : ''
      if (selectedVariant === 'deluxe') await page.getByRole('tab', { name: /豪华福袋/ }).click()
      await page.getByRole('button', { name: '校验并开始', exact: true }).click()
      await page.getByRole('button', { name: '发送验证码', exact: true }).click()
      await page.getByText('登录验证码', { exact: true }).locator('..').getByRole('textbox').fill('123456')
      await page.getByRole('button', { name: '验证并登录' }).click()
      await page.getByRole('button', { name: '获取产品信息' }).click()
      await page.getByLabel('福袋订购状态').waitFor()
      assert.equal(await page.getByRole('radio').count(), benefits[selectedVariant].length - (currentBenefit ? 1 : 0))
      assert.match(await page.getByLabel('福袋订购状态').innerText(), selectedVariant === 'standard' ? /9.9 元\/月/ : /更换套餐内权益/)
      await overflow()
      await page.screenshot({ path: `${output}/${width}-${selectedVariant}-benefits.png`, fullPage: true })
      failProduct = true
      await page.getByRole('button', { name: '刷新订购关系', exact: true }).click()
      await page.getByRole('alert').waitFor()
      assert.ok(await page.getByRole('radio').count() > 0, 'partial error preserves loaded benefits')
      await page.getByRole('button', { name: '校验选择并获取协议' }).click()
      await page.getByRole('button', { name: '发送订购验证码', exact: true }).waitFor()
      assert.equal(await page.getByRole('button', { name: '发送订购验证码', exact: true }).isDisabled(), true)
      await page.getByRole('button', { name: '返回上一步', exact: true }).click()
      await page.getByRole('radio').last().check()
      await page.getByRole('button', { name: '校验选择并获取协议' }).click()
      await page.getByRole('checkbox').check()
      await page.getByRole('button', { name: '发送订购验证码', exact: true }).click()
      await page.getByText('订购验证码', { exact: true }).locator('..').getByRole('textbox').fill('654321')
      await page.getByText('输入“确认订购”', { exact: true }).locator('..').getByRole('textbox').fill('确认订购')
      await overflow()
      assert.equal(await page.evaluate(() => window.__unsafe), undefined, 'protocol scripts removed')
      await page.screenshot({ path: `${output}/${width}-${selectedVariant}-confirmation.png`, fullPage: true })
      await page.getByRole('button', { name: '确认订购', exact: true }).click()
      await page.getByText('模拟已受理', { exact: true }).waitFor()
      await page.getByRole('button', { name: '刷新订购关系', exact: true }).click()
      await page.getByRole('radio').first().waitFor()
      assert.match(await page.getByLabel('福袋订购状态').innerText(), /已订购/)
      await page.getByRole('button', { name: '重新开始', exact: true }).click()
      await page.getByRole('button', { name: '校验并开始', exact: true }).waitFor()
    }
    await page.close()
  }
  assert.deepEqual(errors, [])
  assert.equal(calls.filter((call) => call.path.endsWith('/confirm')).length, 4)
  console.log(`lucky-bag-browser: desktop/mobile main ordering, rights replacement, back/restart, error retention, protocol and origin navigation passed; screenshots ${output}`)
} finally { await browser.close() }

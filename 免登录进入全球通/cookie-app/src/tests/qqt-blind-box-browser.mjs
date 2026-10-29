import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { chromium } from 'playwright'

const base = process.env.QQT_BLIND_TEST_BASE_URL || 'http://127.0.0.1:4179'
const output = '/tmp/cookie-app-blind-box-qa'
await fs.mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true,
  executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const errors = []
try {
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } })
    page.on('pageerror', (error) => errors.push(error.message))
    const done = new Set()
    let draws = 0
    let receives = 0
    const calls = []
    const accounts = [1, 2].map((number) => ({ id: `account-${number}`, hasCookie: true, phoneMasked: `138****800${number}` }))
    const overview = (id) => ({
      refreshedAt: new Date().toISOString(), cache: { status: 'live', expiresAt: new Date(Date.now() + 60000).toISOString(), retryAfterSeconds: 60 },
      identity: { levelCode: '4', phoneMasked: id === 'account-1' ? '138****8001' : '138****8002' },
      xdr: { availableCount: 0, freeCount: 0, paidCount: 0, claimedProductIds: [] },
      sign: { reSignRemaining: 0, days: [] }, errors: {},
      blindBox: { drawTotal: 2, drawRemaining: 2 - draws, drawUsed: draws, drawAllowed: draws < 2, drawLimit: 2, campaignMonth: '2026-10',
        tasks: ['浏览全球通商旅礼遇页面', '浏览逐马计划页面', '浏览尊享云页面'].map((name, index) => ({ number: index + 1, name,
          completed: id === 'account-1' && done.has(index + 1), available: index < 2, unavailableReason: index === 2 ? '10月26日开放' : undefined })),
        prizes: [{ prizeCode: '4001' }, { prizeCode: '3994' }] },
    })
    await page.route('**/*', async (route) => {
      const url = new URL(route.request().url())
      if (url.origin !== base) { await route.abort(); return }
      if (!url.pathname.startsWith('/api/')) { await route.continue(); return }
      if (url.pathname.includes('/global-telecom/overview')) {
        await route.fulfill({ json: { ok: true, data: { account: { id: url.pathname.split('/')[3] }, overview: overview(url.pathname.split('/')[3]) } } }); return
      }
      if (url.pathname.endsWith('/global-telecom/blind-box')) {
        const body = route.request().postDataJSON()
        calls.push(body)
        if (body.action === 'complete-all') {
          assert.equal(body.confirmationText, '确认完成全部任务')
          done.add(1); done.add(2)
          await route.fulfill({ json: { ok: true, data: { result: { status: '1', data: { completed: [1, 2], failures: [] } } } } }); return
        }
        if (body.action === 'draw') {
          assert.equal(body.confirmationText, '确认抽奖')
          draws += 1
          const prizeCode = draws === 1 ? '9999' : '3994'
          await route.fulfill({ json: { ok: true, data: { result: { status: '1', data: { prizeCode } }, blindBoxPrize: { prizeCode, prizeName: '测试实物奖品' } } } }); return
        }
        if (body.action === 'receive') {
          receives += 1
          if (receives === 1) await route.fulfill({ status: 502, json: { ok: false, message: '模拟领取失败，请重试' } })
          else await route.fulfill({ json: { ok: true, data: { result: { status: '1' }, blindBoxPrize: { prizeCode: '3994', fulfillmentUrl: 'https://www.wjx.top/vm/QzzW800.aspx#' } } } })
          return
        }
        throw new Error(`Unexpected mutation: ${body.action}`)
      }
      if (url.pathname.includes('/accounts') || url.pathname === '/api/auth/accounts') {
        await route.fulfill({ json: { ok: true, data: { accounts } } }); return
      }
      if (url.pathname === '/api/admin/me') {
        await route.fulfill({ json: { ok: true, data: { admin: { username: 'mock-admin' } } } }); return
      }
      await route.fulfill({ json: { ok: true, data: {} } })
    })
    await page.goto(`${base}/benefits/global-telecom?accountId=account-1&link=mock-link`)
    await page.getByRole('button', { name: '一键完成任务' }).waitFor()
    await page.getByText('10月26日开放').first().waitFor()
    assert.equal(await page.getByRole('button', { name: '完成任务', exact: true }).count(), 2)
    await page.screenshot({ path: `${output}/tasks-${width}.png`, fullPage: true })
    await page.getByRole('button', { name: '一键完成任务' }).click()
    await page.getByRole('button', { name: '依次完成任务', exact: true }).click()
    await page.waitForFunction(() => [...document.querySelectorAll('button')].some((button) => button.textContent === '一键完成任务' && button.disabled))
    for (let index = 0; index < 2; index += 1) {
      await page.getByRole('button', { name: '开盲盒', exact: true }).click()
      await page.getByRole('alertdialog').waitFor()
      await page.screenshot({ path: `${output}/confirm-${width}.png` })
      await page.getByRole('button', { name: '同意规则并抽奖' }).click()
      if (index === 0) { await page.getByText('本次未抽中奖品', { exact: true }).waitFor(); assert.equal(await page.getByRole('button', { name: '领取奖品', exact: true }).count(), 0) }
      else await page.getByRole('button', { name: '领取奖品', exact: true }).waitFor()
    }
    await page.reload()
    await page.getByRole('button', { name: '领取奖品', exact: true }).waitFor()
    await page.getByRole('combobox', { name: '查询账号' }).selectOption('account-2')
    await page.getByText('138****8002 ·', { exact: false }).waitFor()
    assert.equal(await page.getByRole('button', { name: '领取奖品', exact: true }).count(), 0)
    await page.getByRole('combobox', { name: '查询账号' }).selectOption('account-1')
    await page.getByRole('button', { name: '领取奖品', exact: true }).click()
    await page.getByRole('button', { name: '确认领取', exact: true }).click()
    await page.getByText('模拟领取失败，请重试', { exact: true }).waitFor()
    assert.equal(await page.getByRole('button', { name: '领取奖品', exact: true }).count(), 1)
    await page.getByRole('button', { name: '领取奖品', exact: true }).click()
    await page.getByRole('button', { name: '确认领取', exact: true }).click()
    await page.getByRole('link', { name: '填写领奖信息' }).waitFor()
    await page.reload()
    const form = page.getByRole('link', { name: '填写领奖信息' })
    await form.waitFor()
    assert.equal(await form.getAttribute('target'), '_blank')
    await page.screenshot({ path: `${output}/received-${width}.png`, fullPage: true })
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, `overflow at ${width}`)
    assert.deepEqual(calls.map((call) => call.action), ['complete-all', 'draw', 'draw', 'receive', 'receive'])
    await page.close()
  }
  assert.deepEqual(errors, [])
  console.log('qqt-blind-box-browser: ok (mock API, desktop/mobile, no real mutations)')
} finally { await browser.close() }

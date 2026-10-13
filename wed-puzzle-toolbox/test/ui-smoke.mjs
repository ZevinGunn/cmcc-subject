import { createRequire } from 'node:module'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

// Optional browser QA uses the desktop's bundled Playwright, with all business requests mocked.
const require = createRequire(process.env.WED_PLAYWRIGHT_PACKAGE || '/Users/ZevinGunn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json')
const { chromium } = require('playwright')
const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const out = await fs.mkdtemp(path.join(os.tmpdir(), 'wed-toolbox-ui-'))
console.log(`Browser QA screenshots: ${out}`)
const state = { accounts: [], jobs: [], busy: false }
let smsRequests = 0, loginRequests = 0, giftRequests = 0
function inventory(n = 10, gap = 0) {
  return { activeIndex: 2, drawTimes: '5', r5DrawStatus: 1, pictureList: Object.fromEntries([4, 6, 9].map((size, r) => [String(r + 1), Object.fromEntries(Array.from({ length: size }, (_, i) => [`dp${r + 1}_${i}`, String(i === gap % size ? 0 : n + i)]))])) }
}
const accounts = [1, 2, 3].map(i => ({ id: `account-${i}`, phone: `1390000000${i}`, source: i === 2 ? 'appck' : 'sms', updatedAt: new Date().toISOString(), info: inventory(10, i) }))
try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    state.accounts = []; state.jobs = []; smsRequests = 0
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' }), errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.route('https://**/*', route => route.abort())
    await page.route('**/api/**', async route => {
      const request = route.request(), url = new URL(request.url()), data = request.postDataJSON() || {}
      url.pathname = url.pathname.replace(/^\/wed-puzzle/, '')
      let response = { ok: true, ...state }, status = 200
      if (url.pathname === '/api/auth/sms') {
        smsRequests++
        if (smsRequests === 1) { response = { ok: false, message: '上游火爆，请重试' }; status = 400 }
        else response = { ok: true, cooldownSeconds: 60 }
      } else if (url.pathname === '/api/auth/login' || url.pathname === '/api/auth/import') {
        loginRequests++; state.accounts = accounts; response = { ok: true, ...state }
      } else if (url.pathname === '/api/plan') response = { ok: true, ...state, plan: { transfers: [{ from: accounts[0].id, piece: 'dp2_0', count: 3 }], shortages: [], total: 3, ready: false, canDraw: true } }
      else if (url.pathname === '/api/jobs') {
        giftRequests++
        state.jobs = [{ id: 'mock-job', kind: data.kind, status: 'running', donors: data.donors, to: data.to, round: data.round, mode: data.mode, autoDraw: data.autoDraw, logs: [{ at: new Date().toISOString(), message: '任务已进入串行队列' }], transfersDone: 0, drawDone: false, createdAt: new Date().toISOString() }]
        state.busy = true; response = { ok: true, ...state }
      } else if (url.pathname.endsWith('/pause')) { state.jobs[0].status = 'paused'; state.busy = false; response = { ok: true, ...state } }
      else if (url.pathname.endsWith('/resume')) { state.jobs[0].status = 'running'; state.busy = true; response = { ok: true, ...state } }
      else if (url.pathname.endsWith('/finish')) { state.jobs[0].status = 'stopped'; response = { ok: true, ...state } }
      else if (url.pathname.endsWith('/tasks')) response = { ok: true, tasks: [{ taskId: 'daily1', title: '浏览活动', taskType: '4', status: 0, buttonText: '去完成', requireTimes: 1, completedTimes: 0 }] }
      await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(response) })
    })
    await page.goto('http://127.0.0.1:4186')
    await page.getByRole('heading', { name: '添加参与活动的号码' }).waitFor()
    await page.screenshot({ path: path.join(out, `empty-${viewport.width}.png`), fullPage: true })
    await page.getByRole('button', { name: '添加号码', exact: true }).first().click()
    await page.getByRole('button', { name: '关闭弹窗', exact: true }).click()
    await assert.equal(await page.locator('dialog').count(), 0)
    await page.getByRole('button', { name: '添加号码', exact: true }).first().click()
    await page.getByLabel('手机号', { exact: true }).fill('13900000001')
    await page.getByRole('button', { name: '发送验证码', exact: true }).click()
    await page.getByRole('alert').filter({ hasText: '上游火爆' }).waitFor()
    assert.equal(await page.getByRole('alert').evaluate(el => el.matches(':popover-open')), true)
    assert.equal(await page.getByRole('button', { name: '发送验证码', exact: true }).isEnabled(), true)
    await page.getByRole('button', { name: '发送验证码', exact: true }).click()
    await page.getByRole('button', { name: /s 后重发/ }).waitFor()
    assert.equal(await page.getByRole('button', { name: /s 后重发/ }).isDisabled(), true)
    await page.locator('.code-row input').fill('123456')
    await page.getByRole('button', { name: '登录并查询拼图' }).click()
    await page.locator('.account-row').first().waitFor()
    assert.equal(await page.locator('.account-row').count(), 3)
    assert.equal(await page.locator('.piece').count(), 57)
    assert.equal(await page.locator('.piece.rare').count(), 9, '只标记实际为零的缺图')
    await page.screenshot({ path: path.join(out, `pool-${viewport.width}.png`), fullPage: true })
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '号码池不可横向溢出')
    await page.getByLabel('选择139****0001', { exact: true }).check()
    await page.getByLabel('选择139****0002', { exact: true }).check()
    await page.getByLabel('接收号码', { exact: true }).selectOption('account-3')
    assert.equal(await page.getByLabel('选择139****0001', { exact: true }).isChecked(), true)
    assert.equal(await page.getByLabel('选择139****0002', { exact: true }).isChecked(), true)
    assert.equal(await page.getByLabel('自动完成后续档位', { exact: true }).isChecked(), true)
    await page.getByRole('button', { name: '核对库存与预览' }).click()
    await page.getByRole('button', { name: '执行互赠与抽图' }).waitFor()
    await page.waitForResponse(r => new URL(r.url()).pathname === '/wed-puzzle/api/state')
    assert.equal(await page.getByRole('button', { name: '执行互赠与抽图' }).isEnabled(), true, '自动刷新不能清空转赠预览')
    await page.getByRole('button', { name: '执行互赠与抽图' }).click()
    await page.getByRole('dialog').filter({ hasText: '确认执行互赠' }).waitFor()
    await page.getByRole('button', { name: '确认执行', exact: true }).click()
    await page.getByText('执行中', { exact: true }).waitFor()
    await page.getByRole('button', { name: '暂停', exact: true }).click()
    await page.getByRole('button', { name: '继续 / 核验', exact: true }).waitFor()
    await page.screenshot({ path: path.join(out, `queue-${viewport.width}.png`), fullPage: true })
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '队列不可横向溢出')
    await page.getByRole('button', { name: '结束任务', exact: true }).click()
    await page.getByRole('button', { name: '确认执行', exact: true }).click()
    await page.getByText('已结束', { exact: true }).waitFor()
    await page.getByRole('button', { name: '每日任务', exact: true }).click()
    await page.getByLabel('查询号码', { exact: true }).selectOption('account-1')
    await page.getByRole('heading', { name: '浏览活动', exact: true }).waitFor()
    await page.getByRole('button', { name: '号码池', exact: false }).first().click()
    await page.getByRole('button', { name: '添加号码', exact: true }).first().click()
    await page.getByRole('button', { name: '导入 App CK', exact: true }).click()
    await page.getByLabel('App CK / 活动 Cookie / 登录 JSON', { exact: true }).fill('HLWHD_SESSION_TOKEN=fake-test-only')
    await page.screenshot({ path: path.join(out, `import-${viewport.width}.png`), fullPage: true })
    await page.keyboard.press('Escape')
    assert.equal(await page.locator('dialog').count(), 0)
    await page.getByRole('button', { name: '使用说明', exact: true }).click()
    assert.ok(await page.locator('dialog').evaluate(el => el.getBoundingClientRect().bottom <= innerHeight))
    await page.getByRole('button', { name: '关闭弹窗', exact: true }).click()
    await page.reload(); await page.locator('.account-row').first().waitFor()
    assert.equal(await page.locator('.account-row').count(), 3)
    assert.deepEqual(errors, [])
    await page.close()
  }
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
    const submissions = []
    const data = { ok: true, accounts, jobs: [], busy: false }
    await page.route('**/wed-puzzle/api/**', async route => {
      let response = data
      const url = new URL(route.request().url())
      if (url.pathname.endsWith('/tasks')) response = { ok: true, tasks: [
        { taskId: 'invite', title: '邀请助力', taskType: '2', status: 0, completedTimes: 0, requireTimes: 2, buttonText: '去邀请' },
        { taskId: 'recharge', title: '充值满十元', taskType: '3', status: 0, completedTimes: 0, requireTimes: 1, buttonText: '去充值' },
        { taskId: 'closed', title: '未开放任务', taskType: '5', status: 1, buttonText: '周日开放' },
      ] }
      if (url.pathname.endsWith('/jobs')) {
        const input = route.request().postDataJSON(); submissions.push(input)
        data.jobs = [{ id: input.requestId, kind: 'daily', status: 'completed', donors: input.donors, to: '', round: 1, mode: 'fill', autoDraw: false, drawCount: 0, drawDone: false, transfersDone: 0, logs: [], createdAt: new Date().toISOString() }]
      }
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify(response) })
    })
    await page.goto('http://127.0.0.1:4186/wed-puzzle/')
    await page.locator('.account-row').first().waitFor()
    for (const name of ['执行邀请助力', '完成当前号码任务', '一键完成全部号码']) {
      await page.getByRole('button', { name: '每日任务', exact: true }).click()
      await page.getByLabel('查询号码', { exact: true }).selectOption('account-1')
      await page.getByRole('button', { name: '执行邀请助力' }).waitFor()
      assert.equal(await page.getByRole('button', { name: name }).isEnabled(), true, '无需勾选即可执行当前号码、单项或全部号码')
      assert.equal(await page.getByLabel('快速上报（不增加本地等待）').isChecked(), true)
      if (name === '执行邀请助力') await page.screenshot({ path: path.join(out, `daily-${width}.png`), fullPage: true })
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      await page.getByRole('button', { name: name }).click()
      await page.getByRole('button', { name: '确认执行', exact: true }).click()
      await page.getByText('处理结束', { exact: true }).waitFor()
    }
    assert.deepEqual(submissions[0].taskFilter, ['invite']); assert.deepEqual(submissions[0].donors, ['account-1'])
    assert.deepEqual(submissions[1].donors, ['account-1']); assert.deepEqual(submissions[2].donors, accounts.map(a => a.id))
    assert.ok(submissions.every(s => s.fastTasks === true))
    await page.close()
  }
  for (const status of [401, 403]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
    let stateCalls = 0
    await page.route('**/wed-puzzle/api/**', async route => {
      stateCalls++
      await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ ok: false, message: status === 401 ? '请先登录 home 站点' : '此账号尚未开通权益活动权限' }) })
    })
    await page.goto('http://127.0.0.1:4186/wed-puzzle/')
    await page.getByRole('heading', { name: status === 401 ? '登录后使用工具箱' : '需要权益活动权限' }).waitFor()
    assert.equal(await page.getByRole('button', { name: '添加号码', exact: true }).count(), 0)
    assert.equal(await page.getByRole('link', { name: '管理员登录' }).getAttribute('href'), '/admin-login')
    await page.waitForTimeout(2800)
    assert.equal(stateCalls, 1, '访问被拒绝后应停止轮询')
    await page.screenshot({ path: path.join(out, `access-${status}.png`), fullPage: true })
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    await page.close()
  }
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    let revoked = false
    await page.route('**/wed-puzzle/api/**', async route => route.fulfill({ status: revoked ? 403 : 200, contentType: 'application/json', body: JSON.stringify(revoked ? { ok: false, message: '权限已撤销' } : { ok: true, accounts, jobs: [], busy: false }) }))
    await page.goto('http://127.0.0.1:4186/wed-puzzle/')
    await page.locator('.account-row').first().waitFor()
    await page.getByRole('button', { name: '添加号码', exact: true }).first().click()
    revoked = true
    await page.getByRole('heading', { name: '需要权益活动权限' }).waitFor()
    assert.equal(await page.locator('.account-row').count(), 0)
    assert.equal(await page.locator('dialog').count(), 0, '撤权后关闭账号操作弹窗')
    await page.close()
  }
  console.log(JSON.stringify({ ok: true, viewports: [1440, 390], mockLoginCalls: loginRequests, mockQueueCalls: giftRequests, screenshots: out, realBusinessRequests: 0 }))
} finally { await browser.close() }

import assert from 'node:assert/strict'
import { renderToString } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import ShopQueryPage from '../pages/ShopQueryPage'
import BusinessOrderPage from '../pages/BusinessOrderPage'
import MessageDialog from '../components/MessageDialog'
import AccountLoginDialog from '../components/AccountLoginDialog'
import SsoNavigationDialog from '../components/SsoNavigationDialog'
import BusinessSearchDialog, { HighlightText } from '../components/BusinessSearchDialog'
import { shouldStartDialogDrag } from '../components/GlobalDialogDrag'
import { clampDialogOffset } from '../lib/dialogDrag'
import { calculateViewportMenuPosition } from '../lib/floatingMenu'
import { getAccountLoginState, getYunpanCredentialStatus } from '../lib/accountLoginState'
import { parseXdrPrizeMap, resolveXdrPrizeName } from '../lib/xdrPrize'
import V2App from '../v2/V2App'
import V2BusinessOrderPage from '../v2/pages/V2BusinessOrderPage'
import V2UnifiedBusinessOrderPage from '../v2/pages/V2UnifiedBusinessOrderPage'
import V2BmccActivityOrderPage, { captchaSource } from '../v2/pages/V2BmccActivityOrderPage'
import V2BroadbandOrderPage from '../v2/pages/V2BroadbandOrderPage'
import V2QqtPremiumBroadbandPage from '../v2/pages/V2QqtPremiumBroadbandPage'
import V2AigouOrderPage from '../v2/pages/V2AigouOrderPage'
import V2AiBeanContractOrderPage from '../v2/pages/V2AiBeanContractOrderPage'
import V2AiBeanContractExperience, { aiBeanConfirmationTerms } from '../v2/components/V2AiBeanContractExperience'
import V2OriginalOrderConfirmation, { sanitizeOrderDescriptionHtml } from '../v2/components/V2OriginalOrderConfirmation'
import V2FlyCardOrderPage from '../v2/pages/V2FlyCardOrderPage'
import V2FlyCardExperience from '../v2/components/V2FlyCardExperience'
import V2OrderResponseDetails, { orderFailureResponse } from '../v2/components/V2OrderResponseDetails'
import { ApiClientError } from '../v2/lib/api'
import PhoneInput, { normalizePhoneInput } from '../components/PhoneInput'
import V2BusinessPage from '../v2/pages/V2BusinessPage'
import V2RetailProductQueryPage from '../v2/pages/V2RetailProductQueryPage'
import V2LuckyThreeDayPage from '../v2/pages/V2LuckyThreeDayPage'
import V2GlobalTelecomPage from '../v2/pages/V2GlobalTelecomPage'
import {
  canQueryGlobalTelecomAccount,
  formatGlobalTelecomAccountOption,
  getGlobalTelecomBackHref,
  getTodaySignAction,
  normalizeGlobalTelecomOverviewResponse,
  loadGlobalTelecomAccounts,
  selectGlobalTelecomAccountId,
  type GlobalTelecomOverview,
} from '../v2/lib/globalTelecomApi'
import V2AccountsPage from '../v2/pages/V2AccountsPage'
import V2TaskDrawer from '../v2/components/V2TaskDrawer'
import V2Dashboard, { buildDashboardSummary } from '../v2/pages/V2Dashboard'
import { deriveAccountHealth, getTaskStatusDisplay, toV2Account } from '../v2/lib/accountHealth'
import { reorderAccountsForDrop } from '../lib/accountOrder'
import type { AccountSummary, V2BatchTask } from '../v2/lib/types'
import { scopeBusinessOrderAccounts } from '../v2/lib/businessOrderApi'
import { isBmccOrderCodeReady, sanitizeBmccOrderCodeInput } from '../v2/lib/bmccActivityOrderApi'
import { mergeBusinessTiers, upsertCustomBusinessTier } from '../v2/lib/customBusinessTiers'

assert.equal(normalizePhoneInput('+86 138 0000 0000'), '13800000000')
assert.equal(normalizePhoneInput('0086-138-0000-0000'), '13800000000')
assert.equal(normalizePhoneInput('１３８００００００００'), '13800000000')
assert.equal(normalizePhoneInput('138000000001'), '138000000001')
assert.equal(normalizePhoneInput('1380000000013900000000'), '1380000000013900000000')
assert.equal(normalizePhoneInput('备用账号', true), '备用账号')
const phoneHtml = renderToString(<PhoneInput value="" onValueChange={() => undefined} />)
assert.ok(phoneHtml.includes('type="tel"') && phoneHtml.includes('autoComplete="tel-national"'))
assert.ok(!phoneHtml.includes('maxLength'))

assert.equal(sanitizeBmccOrderCodeInput('12a3456789'), '123456')
assert.equal(sanitizeBmccOrderCodeInput('12a3456789', true), '12345678')
assert.equal(isBmccOrderCodeReady('123456'), true)
assert.equal(isBmccOrderCodeReady('12345678'), false)
assert.equal(isBmccOrderCodeReady('12345678', true), true)
assert.equal(isBmccOrderCodeReady('1234567', true), false)
assert.equal(captchaSource('data:image/jpeg; charset=utf-8;base64,YWJj\nZA=='), 'data:image/jpeg;base64,YWJjZA==')
assert.equal(captchaSource('data:image/jpg;base64,YWJjZA=='), 'data:image/jpeg;base64,YWJjZA==')
assert.equal(captchaSource('data:text/plain;base64,YWJjZA=='), '')

const scopedOrderAccounts = scopeBusinessOrderAccounts([
  { id: 'account-1', label: '账号一', phoneMasked: '138****8000' },
  { id: 'account-2', label: '账号二', phoneMasked: '139****9000' },
], 'account-2')
assert.deepEqual(scopedOrderAccounts.map((account) => account.id), ['account-1', 'account-2'])
assert.deepEqual(scopeBusinessOrderAccounts(scopedOrderAccounts, 'missing-account'), [])
assert.equal(scopeBusinessOrderAccounts(scopedOrderAccounts, ''), scopedOrderAccounts)

const defaultBusinessTier = {
  id: '500000051659', packageId: '500000051659', name: '智臻会员199档（A版）', price: 199,
  bizIntfCode: '', productTags: '', candidateIds: ['500000051659'], variantCount: 1,
}
assert.deepEqual(
  mergeBusinessTiers([defaultBusinessTier], [{ id: '500000051659', name: '自定义名称', price: 209 }]).map((tier) => [tier.id, tier.name, tier.price]),
  [['500000051659', '自定义名称', 209]],
)
assert.deepEqual(
  upsertCustomBusinessTier([{ id: '500000051659', name: '旧档位', price: 199 }], { id: '500000059999', name: '新档位', price: 299 }, '500000051659'),
  [{ id: '500000059999', name: '新档位', price: 299 }],
)

const safeOrderDescription = sanitizeOrderDescriptionHtml('<div onclick="bad()"><span class="yd"></span>资费标准：<span class="txt">8元/月。</span></div><script>bad()</script>')
assert.ok(safeOrderDescription.includes('&lt;div onclick=&quot;bad()&quot;&gt;'))
assert.equal(safeOrderDescription.includes('<script'), false)

const originalOrderConfirmationHtml = renderToString(
  <V2OriginalOrderConfirmation
    maskedPhone="138****8000"
    productName="8元4G飞享卡"
    description="<div>资费标准：<span>8元/月。</span></div>"
    orderCode=""
    orderCooldown={0}
    busy=""
    headerImage="/header.png"
    confirmImage="/confirm.png"
    onOrderCodeChange={() => undefined}
    onSendOrderSms={() => undefined}
    onConfirmOrder={() => undefined}
    onOpenParams={() => undefined}
  />,
)
assert.ok(originalOrderConfirmationHtml.includes('&lt;div&gt;资费标准'))

const html = renderToString(
  <MemoryRouter>
    <Home />
  </MemoryRouter>,
)
assert.ok(html.includes('中国移动用户管理'))

const shopHtml = renderToString(
  <MemoryRouter initialEntries={['/shop-query']}>
    <ShopQueryPage />
  </MemoryRouter>,
)
assert.ok(shopHtml.includes('查询和退订'))
assert.ok(shopHtml.includes('所有查询结果均可提交退订尝试') === false)
assert.ok(shopHtml.includes('尝试退订') === false)
assert.ok(shopHtml.includes('title="搜索业务"'))

const businessSearchHtml = renderToString(
  <BusinessSearchDialog
    open
    items={[{ id: 'business-1', title: '欢畅流量包', subtitle: '增值业务 · P001' }]}
    onClose={() => undefined}
    onSelect={() => undefined}
  />,
)
assert.ok(businessSearchHtml.includes('搜索业务'))
assert.ok(businessSearchHtml.includes('欢畅流量包'))
const highlightedHtml = renderToString(<HighlightText text="欢畅流量包" keyword="流量" />)
assert.ok(highlightedHtml.includes('<mark'))
assert.ok(highlightedHtml.includes('流量'))

const messageHtml = renderToString(
  <MessageDialog
    value={{
      type: 'error',
      title: '退订失败',
      message: '该业务不可被退订，请核对业务信息！',
      errorCode: '200',
    }}
    onClose={() => undefined}
  />,
)
assert.ok(messageHtml.includes('退订失败'))
assert.ok(messageHtml.includes('该业务不可被退订，请核对业务信息！'))
assert.ok(messageHtml.includes('错误码：'))
assert.ok(messageHtml.includes('200'))
const htmlErrorDialog = renderToString(
  <MessageDialog
    value={{ type: 'error', title: '退订失败', message: '移动侧上游返回 HTML 错误页（HTTP 403）：<html><head><title>403 Forbidden</title></head><body><h1>403 Forbidden</h1><center>openresty</center><script>secret()</script></body></html>', errorCode: '403' }}
    onClose={() => undefined}
  />,
)
assert.ok(htmlErrorDialog.includes('移动侧拒绝了请求（HTTP 403）：403 Forbidden'))
assert.ok(htmlErrorDialog.includes('错误码：'))
assert.equal(/&lt;html|&lt;head|openresty|secret\(\)/.test(htmlErrorDialog), false)
const messageActionHtml = renderToString(
  <MessageDialog
    value={{ type: 'success', title: '订购成功', message: '业务已受理' }}
    onClose={() => undefined}
    secondaryAction={{ label: '返回业务订购', onClick: () => undefined }}
  />,
)
assert.ok(messageActionHtml.includes('返回业务订购'))
assert.ok(messageActionHtml.includes('我知道了'))
const orderResponseHtml = renderToString(<V2OrderResponseDetails response={{ code: '0', message: '订购成功' }} />)
assert.ok(orderResponseHtml.includes('订购接口具体响应'))
assert.ok(orderResponseHtml.includes('&quot;code&quot;'))
const smsResponseHtml = renderToString(<V2OrderResponseDetails response={{ resultCode: -9, msg: '短信失败' }} title="验证码接口具体响应" />)
assert.ok(smsResponseHtml.includes('验证码接口具体响应'))
assert.ok(smsResponseHtml.includes('短信失败'))
assert.deepEqual(
  orderFailureResponse(new ApiClientError({ message: '业务拒绝', status: 424, errorCode: 'ORDER_REJECTED', requestId: 'request-1', payload: { ok: false, message: '业务拒绝' } })),
  { code: 'ORDER_REJECTED', message: '业务拒绝', response: { ok: false, message: '业务拒绝' } },
)
assert.deepEqual(
  orderFailureResponse(new ApiClientError({ message: '上游 HTTP 错误', status: 502, errorCode: 'UPSTREAM_HTTP_ERROR', payload: { ok: false, response: { resultCode: -307, msg: '业务冲突' } } })),
  { code: 'UPSTREAM_HTTP_ERROR', message: '上游 HTTP 错误', response: { resultCode: -307, msg: '业务冲突' } },
)
assert.equal(shouldStartDialogDrag({ button: 0, explicitHandle: true, inHeader: true, interactive: true }), false)
assert.equal(shouldStartDialogDrag({ button: 0, explicitHandle: true, inHeader: true, interactive: false }), true)
assert.equal(shouldStartDialogDrag({ button: 0, explicitHandle: false, inHeader: true, interactive: false }), true)
assert.equal(shouldStartDialogDrag({ button: 1, explicitHandle: true, inHeader: true, interactive: false }), false)

const ssoNavigationHtml = renderToString(
  <SsoNavigationDialog
    url="https://wx.10086.cn/example"
    destination="爱购商城"
    onOpen={() => undefined}
    onCopy={() => undefined}
  />,
)
assert.ok(ssoNavigationHtml.includes('跳转到'))
assert.ok(ssoNavigationHtml.includes('爱购商城'))
assert.ok(ssoNavigationHtml.includes('新标签页打开'))
assert.ok(ssoNavigationHtml.includes('复制链接'))
assert.deepEqual(
  clampDialogOffset({
    rect: { left: 100, top: 100, right: 500, bottom: 500 },
    deltaX: 900,
    deltaY: -900,
    viewportWidth: 1000,
    viewportHeight: 800,
  }),
  { x: 836, y: -452 },
)
const bottomEdgeMenu = calculateViewportMenuPosition(
  { left: 1180, right: 1212, top: 700, bottom: 732 },
  { width: 1280, height: 800 },
)
assert.equal(bottomEdgeMenu.placement, 'top')
assert.ok((bottomEdgeMenu.bottom ?? 0) >= 8)
assert.ok(bottomEdgeMenu.left >= 8)
assert.ok(bottomEdgeMenu.left + 160 <= 1272)
assert.ok(bottomEdgeMenu.maxHeight <= 480)
const topEdgeMenu = calculateViewportMenuPosition(
  { left: 2, right: 34, top: 8, bottom: 40 },
  { width: 390, height: 844 },
)
assert.equal(topEdgeMenu.placement, 'bottom')
assert.equal(topEdgeMenu.left, 8)
assert.ok((topEdgeMenu.top ?? 0) >= 46)

const loginDialogHtml = renderToString(
  <AccountLoginDialog
    open
    defaultMethod="manual_cookie"
    onClose={() => undefined}
    onSuccess={() => undefined}
  />,
)
assert.ok(loginDialogHtml.includes('验证码登录'))
assert.ok(loginDialogHtml.includes('App扫码登录'))
assert.ok(loginDialogHtml.includes('导入 CK'))
assert.ok(loginDialogHtml.includes('Cookie / CK'))
assert.ok(loginDialogHtml.includes('云盘登录'))

const globalTelecomHtml = renderToString(
  <MemoryRouter initialEntries={['/v2/benefits/global-telecom?accountId=global-account-1']}>
    <V2GlobalTelecomPage accounts={[{
    id: 'global-account-1',
      label: 'public-login',
      displayPhone: '13800138896',
      phoneMasked: '138****8896',
      hasCookie: true,
    }]} />
  </MemoryRouter>,
)
assert.ok(globalTelecomHtml.includes('全球通查询专区'))
assert.ok(globalTelecomHtml.includes('账号信息与当月权益'))
assert.ok(globalTelecomHtml.includes('138****8896'))
assert.equal(globalTelecomHtml.includes('>public-login</option>'), false)
assert.equal(formatGlobalTelecomAccountOption({ id: '1', label: 'public-cookie-import', phoneMasked: '139****5678' }), '139****5678 · 云盘 CK 未登录')
assert.equal(formatGlobalTelecomAccountOption({ id: '2', label: '已订业务登录', displayPhone: '13912345678', hasYunpanSession: true }), '139****5678 · 云盘 CK 待验证')
assert.equal(formatGlobalTelecomAccountOption({ id: '3', label: '主卡', phoneMasked: '139****5678', hasYunpanSession: true, yunpanSessionCheckedAt: '2026-10-14T10:00:00Z' }), '139****5678 · 云盘 CK 有效')
assert.equal(formatGlobalTelecomAccountOption({ id: '4', phoneMasked: '139****5678', hasYunpanSession: true, yunpanSessionInvalidAt: '2026-10-14T10:00:00Z' }), '139****5678 · 云盘 CK 失效')
assert.equal(canQueryGlobalTelecomAccount({ id: 'cookie', hasCookie: true }), true)
assert.equal(canQueryGlobalTelecomAccount({ id: 'token', hasCookie: false, qqtAccessToken: 'available' }), true)
assert.equal(canQueryGlobalTelecomAccount({ id: 'yunpan', hasCookie: false, hasYunpanSession: true }), true)
assert.equal(canQueryGlobalTelecomAccount({ id: 'missing', hasCookie: false }), false)
assert.equal(selectGlobalTelecomAccountId([{ id: 'first' }, { id: 'clicked' }], 'clicked'), 'clicked')
assert.equal(selectGlobalTelecomAccountId([{ id: 'first' }], 'missing'), '')
assert.equal(selectGlobalTelecomAccountId([{ id: 'first' }, { id: 'selected' }], 'first', 'selected'), 'selected')
assert.equal(selectGlobalTelecomAccountId([{ id: 'first' }], ''), 'first')
const originalFetch = globalThis.fetch
try {
  const paths: string[] = []
  globalThis.fetch = async (input) => {
    paths.push(String(input))
    return new Response(JSON.stringify({ ok: true, data: { accounts: [{ id: 'clicked', hasYunpanSession: true, hasCookie: false }] } }), { status: 200 })
  }
  assert.equal((await loadGlobalTelecomAccounts({ publicMode: true, publicLinkId: 'invite' }))[0].id, 'clicked')
  assert.deepEqual(paths, ['/api/auth/accounts'], 'Signed-in users load all their accounts, beyond the invite list')
  paths.length = 0
  globalThis.fetch = async (input) => {
    paths.push(String(input))
    return String(input) === '/api/auth/accounts'
      ? new Response(JSON.stringify({ ok: false, message: '未登录' }), { status: 401 })
      : new Response(JSON.stringify({ ok: true, data: { accounts: [{ id: 'invite-account' }] } }), { status: 200 })
  }
  assert.equal((await loadGlobalTelecomAccounts({ publicMode: true, publicLinkId: 'invite' }))[0].id, 'invite-account')
  assert.deepEqual(paths, ['/api/auth/accounts', '/api/accounts/public/link/invite/accounts'])
  for (const status of [403, 500]) {
    paths.length = 0
    globalThis.fetch = async (input) => {
      paths.push(String(input))
      return new Response(JSON.stringify({ ok: false, message: '账号列表查询失败' }), { status })
    }
    await assert.rejects(loadGlobalTelecomAccounts({ publicMode: true, publicLinkId: 'invite' }))
    assert.deepEqual(paths, ['/api/auth/accounts'], 'Do not change account scope after permission/server errors')
  }
} finally { globalThis.fetch = originalFetch }
assert.equal(resolveXdrPrizeName(3913, {}), '咪咕悦读白金会员月卡')
assert.equal(resolveXdrPrizeName(999999, {}), '权益 #999999')
assert.deepEqual(parseXdrPrizeMap(`
  { id: 2, panel: { items: [
    { id: 3559, transferable: 1, qyName: "书亦烧仙草20元立减券" },
    { id: 3560, transferable: 1, qyName: "奈雪的茶20元满减券" }
  ] } }
`), {
  '3559': '书亦烧仙草20元立减券',
  '3560': '奈雪的茶20元满减券',
})
assert.deepEqual(
  getTodaySignAction([{ dayNum: 1, signStatus: 1, reSign: false, tasks: [] }]),
  { canSign: false, label: '今日已签到' },
)
assert.deepEqual(
  getTodaySignAction([{ dayNum: 2, signStatus: 0, reSign: false, tasks: [] }]),
  { canSign: true, label: '今日签到' },
)
assert.deepEqual(
  getTodaySignAction([{ dayNum: 2, signStatus: 0, reSign: false, tasks: [] }], '接口暂不可用'),
  { canSign: false, label: '签到不可用' },
)
assert.equal(getGlobalTelecomBackHref(true, '/app/cmcc-public/benefits/global-telecom', 'invite-1'), '/?link=invite-1')
assert.equal(getGlobalTelecomBackHref(true, '/app/cmcc-user/benefits/global-telecom', ''), '/public')
assert.equal(getGlobalTelecomBackHref(true, '/benefits/global-telecom', 'invite-1'), '/public?link=invite-1')
assert.equal(getGlobalTelecomBackHref(false, '/v2/benefits/global-telecom', ''), '/v2/benefits')
const normalizedPersistentOverview = normalizeGlobalTelecomOverviewResponse({
  account: { id: 'global-account-1' },
  overview: {
    refreshedAt: '2026-08-07T06:00:00.000Z',
    cache: {
      status: 'persistent-cache',
      expiresAt: '2026-08-07T06:01:00.000Z',
      retryAfterSeconds: 60,
    },
    identity: { levelName: '钻石卡' },
    xdr: { availableCount: 0, freeCount: 0, paidCount: 0, claimedProductIds: [] },
    sign: { reSignRemaining: 0, days: [] },
    blindBox: { drawTotal: 0, drawUsed: 0, drawRemaining: 0, tasks: [], prizes: [] },
    growth: {
      total: 3636,
      required: 3720,
      remaining: 84,
      levels: [],
      monthlyConsumption: [{ month: '202601', bill: 87, rawBill: '87' }],
    } as unknown as NonNullable<GlobalTelecomOverview['growth']>,
    errors: {},
  },
})
assert.equal(normalizedPersistentOverview.overview?.cache.status, 'persistent-cache')
assert.equal(normalizedPersistentOverview.overview?.growth?.annualGrowthValue, 3636)
assert.deepEqual(normalizedPersistentOverview.overview?.growth?.monthlyGrowthValues, [
  { month: '202601', value: 87, rawValue: '87' },
])

const baseAccount: AccountSummary = {
  id: 'v2-account-1',
  phoneMasked: '138****8896',
  hasCookie: true,
  cookieUpdatedAt: '2026-07-18T10:00:00.000Z',
  updatedAt: '2026-07-18T10:00:00.000Z',
}
assert.equal(deriveAccountHealth(baseAccount, { now: Date.parse('2026-07-18T12:00:00.000Z') }).status, 'healthy')
const loginNow = Date.parse('2026-07-18T12:00:00.000Z')
const cloudWithOldCmcc = { ...baseAccount, hasYunpanSession: true, lastLoginMethod: 'yunpan' as const,
  cookieInvalidAt: '2026-07-17T10:00:00Z', cookieExpireAt: '2026-07-17T12:00:00Z' }
assert.equal(getAccountLoginState(cloudWithOldCmcc, loginNow).loggedIn, true)
assert.equal(getAccountLoginState(cloudWithOldCmcc, loginNow).yunpanOnly, true)
assert.equal(getAccountLoginState(cloudWithOldCmcc, loginNow).primaryExpireAt, undefined)
assert.equal(deriveAccountHealth(cloudWithOldCmcc, { now: loginNow }).label, '云盘待验证')
assert.equal(deriveAccountHealth({ ...cloudWithOldCmcc, yunpanSessionCheckedAt: '2026-07-18T11:00:00Z' }, { now: loginNow }).label, '云盘有效')
assert.equal(getYunpanCredentialStatus({ hasYunpanSession: true, yunpanSessionCheckedAt: 'invalid-date' }).label, '待验证')
assert.equal(getAccountLoginState({ ...cloudWithOldCmcc, yunpanSessionInvalidAt: '2026-07-18T11:00:00Z', qqtAccessToken: undefined }, loginNow).loggedIn, false)
assert.equal(toV2Account(cloudWithOldCmcc, { now: loginNow }).credentialHealth.core, 'available')
assert.equal(toV2Account(cloudWithOldCmcc, { now: loginNow }).cookieExpireAt, undefined)
assert.equal(getAccountLoginState({ ...cloudWithOldCmcc, disabledAt: '2026-07-18T11:00:00Z' }, loginNow).loggedIn, false)
assert.equal(deriveAccountHealth({ ...cloudWithOldCmcc, disabledAt: '2026-07-18T11:00:00Z' }, { now: loginNow }).status, 'disabled')
assert.equal(getAccountLoginState({ ...cloudWithOldCmcc, hasYunpanSession: false }, loginNow).loggedIn, false)
const dualLogin = { ...baseAccount, hasYunpanSession: true, lastLoginMethod: 'cmcc_sms' as const,
  cookieExpireAt: '2026-07-19T12:00:00Z' }
assert.equal(getAccountLoginState(dualLogin, loginNow).hasCmcc, true)
assert.equal(getAccountLoginState(dualLogin, loginNow).hasYunpan, true)
assert.equal(getAccountLoginState(dualLogin, loginNow).yunpanOnly, false)
assert.equal(getAccountLoginState(dualLogin, loginNow).primaryExpireAt, dualLogin.cookieExpireAt)
assert.equal(getAccountLoginState({ ...dualLogin, yunpanSessionInvalidAt: '2026-07-18T11:00:00Z' }, loginNow).hasCmcc, true)
assert.equal(deriveAccountHealth({ ...dualLogin, yunpanSessionInvalidAt: '2026-07-18T11:00:00Z' }, { now: loginNow }).label, '云盘需补登')
assert.equal(
  deriveAccountHealth(
    { ...baseAccount, disabledAt: '2026-07-18T11:00:00.000Z', cookieInvalidAt: '2026-07-18T10:30:00.000Z' },
    { now: Date.parse('2026-07-18T12:00:00.000Z') },
  ).status,
  'disabled',
)
assert.equal(
  deriveAccountHealth(
    { ...baseAccount, cookieExpireAt: '2026-07-18T13:00:00.000Z' },
    { now: Date.parse('2026-07-18T12:00:00.000Z') },
  ).status,
  'expiring',
)

const stoppedTask: V2BatchTask = {
  id: 'v2-task-1',
  type: 'ck_maintenance',
  scopeType: 'admin_all',
  source: 'manual',
  status: 'partial_success',
  totalCount: 3,
  completedCount: 2,
  successCount: 2,
  failedCount: 0,
  skippedCount: 0,
  message: '任务已停止',
  createdAt: '2026-07-18T10:00:00.000Z',
  updatedAt: '2026-07-18T10:01:00.000Z',
  items: [],
}
assert.equal(getTaskStatusDisplay(stoppedTask).label, '已停止')

const dashboardAccounts = [
  toV2Account({
    ...baseAccount,
    id: 'dashboard-account-1',
    qqtAccessToken: 'token-1',
    hasYunpanSession: true,
  }, { now: Date.parse('2026-07-31T04:00:00.000Z') }),
  toV2Account({
    ...baseAccount,
    id: 'dashboard-account-2',
  }, { now: Date.parse('2026-07-31T04:00:00.000Z') }),
]
const dashboardTasks: V2BatchTask[] = [{
  ...stoppedTask,
  id: 'dashboard-task-1',
  status: 'success',
  totalCount: 3,
  completedCount: 3,
  successCount: 3,
  message: '任务完成',
  finishedAt: '2026-07-31T02:00:00.000Z',
  updatedAt: '2026-07-31T02:00:00.000Z',
}]
const dashboardSummary = buildDashboardSummary(
  dashboardAccounts,
  dashboardTasks,
  '2026-07-31T04:00:00.000Z',
)
assert.equal(dashboardSummary.coreReady, 2)
assert.equal(dashboardSummary.qqtReady, 1)
assert.equal(dashboardSummary.yunpanReady, 1)
assert.equal(dashboardSummary.todayFinishedTasks, 1)
assert.equal(dashboardSummary.todaySuccessfulItems, 3)

const dashboardHtml = renderToString(
  <V2Dashboard
    accounts={dashboardAccounts}
    tasks={dashboardTasks}
    loading={false}
    onRefresh={() => undefined}
    onNavigate={() => undefined}
    onOpenAccount={() => undefined}
    onOpenTask={() => undefined}
  />,
)
assert.ok(dashboardHtml.includes('核心 CK 可用'))
assert.ok(dashboardHtml.includes('全球通授权'))
assert.ok(dashboardHtml.includes('今日成功账号项'))
assert.ok(dashboardHtml.includes('快捷操作'))

const orderedAccounts = [
  { id: 'pinned-1', publicPinnedAt: '2026-07-01T00:00:00.000Z' },
  { id: 'normal-1' },
  { id: 'normal-2' },
]
assert.deepEqual(
  reorderAccountsForDrop(orderedAccounts, 'normal-2', 'normal-1', 'before').map((item) => item.id),
  ['pinned-1', 'normal-2', 'normal-1'],
)
const movedIntoPinned = reorderAccountsForDrop(
  orderedAccounts,
  'normal-1',
  'pinned-1',
  'after',
  '2026-07-31T00:00:00.000Z',
)
assert.deepEqual(movedIntoPinned.map((item) => item.id), ['pinned-1', 'normal-1', 'normal-2'])
assert.equal(movedIntoPinned[1].publicPinnedAt, '2026-07-31T00:00:00.000Z')
assert.equal(reorderAccountsForDrop(orderedAccounts, 'missing', 'normal-1', 'before'), orderedAccounts)

const tokenTaskHtml = renderToString(
  <V2TaskDrawer
    task={{ ...stoppedTask, status: 'success', completedCount: 3, successCount: 3, message: '任务完成' }}
    onClose={() => undefined}
    onCancel={() => undefined}
    onCopyTokens={() => undefined}
  />,
)
assert.ok(tokenTaskHtml.includes('复制有效 Token'))
assert.ok(tokenTaskHtml.includes('自动筛除过期、非全球通及已领取账号'))

const v2Html = renderToString(
  <MemoryRouter initialEntries={['/v2']}>
    <Routes>
      <Route path="/v2/*" element={<V2App />} />
    </Routes>
  </MemoryRouter>,
)
assert.ok(v2Html.includes('移动运营台'))
assert.ok(v2Html.includes('正在加载运营数据'))
assert.ok(v2Html.includes('V1'))
assert.ok(v2Html.includes('V2'))

const accountsPageHtml = renderToString(
  <MemoryRouter>
    <V2AccountsPage
      accounts={[
        toV2Account({
          ...baseAccount,
          userId: 'user-1',
          ownerUsername: 'linked-user',
        }),
      ]}
      loading={false}
      selectedIds={[]}
      onSelectionChange={() => undefined}
      onRefresh={() => undefined}
      onOpenAccount={() => undefined}
      onAddAccount={() => undefined}
      onStartTask={() => undefined}
      onDeleteSelected={() => undefined}
    />
  </MemoryRouter>,
)
assert.ok(accountsPageHtml.includes('linked-user'))
assert.ok(accountsPageHtml.includes('批量删除'))

const businessHubHtml = renderToString(
  <MemoryRouter>
    <V2BusinessPage accounts={[]} />
  </MemoryRouter>,
)
assert.ok(businessHubHtml.includes('业务订购'))
assert.ok(businessHubHtml.includes('/v2/business/order'))
assert.ok(businessHubHtml.includes('产品查询'))
assert.ok(businessHubHtml.includes('/v2/product-query'))

const productQueryHtml = renderToString(<V2RetailProductQueryPage accounts={[]} />)
assert.ok(productQueryHtml.includes('移动商城产品查询'))
assert.ok(productQueryHtml.includes('查询账号'))
assert.ok(productQueryHtml.includes('自动校验 CK'))
assert.ok(productQueryHtml.includes('批量与范围查询'))
assert.ok(productQueryHtml.includes('任务队列'))
assert.ok(productQueryHtml.includes('商品库'))

const luckyThreeDayHtml = renderToString(
  <MemoryRouter>
    <V2LuckyThreeDayPage />
  </MemoryRouter>,
)
assert.ok(luckyThreeDayHtml.includes('幸运三日签'))
assert.ok(luckyThreeDayHtml.includes('每日累签奖励与限量话费券领取'))
assert.ok(luckyThreeDayHtml.includes('/v2/benefits'))
assert.ok(productQueryHtml.includes('轮询计划'))

const businessOrderHtml = renderToString(
  <MemoryRouter>
    <V2BusinessOrderPage
      accounts={[
        toV2Account({
          ...baseAccount,
          phone: '13800138000',
          label: '13800138000',
        }),
      ]}
    />
  </MemoryRouter>,
)
assert.ok(businessOrderHtml.includes('验证码登录、产品核验与二次确认订购'))
assert.ok(businessOrderHtml.includes('1000000100290'))
assert.ok(businessOrderHtml.includes('确认结果'))
assert.ok(businessOrderHtml.includes('已有账号（可选）'))
assert.ok(businessOrderHtml.includes('13800138000') === false)

const unifiedBusinessOrderHtml = renderToString(
  <MemoryRouter>
    <V2UnifiedBusinessOrderPage accounts={[]} />
  </MemoryRouter>,
)
assert.ok(unifiedBusinessOrderHtml.includes('卓越钻石卡'))
assert.ok(unifiedBusinessOrderHtml.includes('全球通网龄直升'))
assert.ok(unifiedBusinessOrderHtml.includes('积木套餐'))
assert.ok(unifiedBusinessOrderHtml.includes('智臻会员'))
assert.ok(unifiedBusinessOrderHtml.includes('钻石卡 App版'))
assert.ok(unifiedBusinessOrderHtml.includes('App 专属套餐'))
assert.ok(unifiedBusinessOrderHtml.includes('移动商城'))
assert.ok(unifiedBusinessOrderHtml.includes('爱购商城'))
assert.ok(unifiedBusinessOrderHtml.includes('宽带办理'))
assert.ok(unifiedBusinessOrderHtml.includes('尊享宽带'))
assert.ok(unifiedBusinessOrderHtml.includes('5GA 加速'))
assert.ok(unifiedBusinessOrderHtml.includes('北京移动活动订购'))
assert.ok(unifiedBusinessOrderHtml.includes('AI豆倍享合约'))
assert.ok(unifiedBusinessOrderHtml.includes('标准福袋'))
assert.ok(unifiedBusinessOrderHtml.includes('豪华福袋'))
assert.ok(unifiedBusinessOrderHtml.includes('展开全部（11）'))
assert.ok(unifiedBusinessOrderHtml.includes('/business-order/ai-bean-contract'))
assert.ok(unifiedBusinessOrderHtml.includes('/business-order/fly-card-8'))
assert.ok(unifiedBusinessOrderHtml.includes('选择业务后完成登录'))

const aigouOrderHtml = renderToString(
  <V2AigouOrderPage
    accounts={[{ id: 'account-1', label: '测试账号', phoneMasked: '138****8000' }]}
    initialAccountId="account-1"
  />,
)
assert.ok(aigouOrderHtml.includes('选择账号与业务'))
assert.ok(aigouOrderHtml.includes('核对实时商品'))
assert.ok(aigouOrderHtml.includes('权益直订'))
assert.ok(aigouOrderHtml.includes('购物车订购'))
assert.ok(aigouOrderHtml.includes('mzonebojindg'))
assert.ok(aigouOrderHtml.includes('13800138000') === false)
const aigouOrderSource = await import('node:fs/promises').then((fs) =>
  fs.readFile(new URL('../v2/pages/V2AigouOrderPage.tsx', import.meta.url), 'utf8'),
)
assert.ok(aigouOrderSource.includes('客户端不拦截资格或库存状态'))
assert.ok(aigouOrderSource.includes('验证码接口具体响应'))
assert.ok(aigouOrderSource.includes('设备风险令牌'))
assert.ok(aigouOrderSource.includes('重新开始'))
const aigouCartSource = await import('node:fs/promises').then((fs) =>
  fs.readFile(new URL('../v2/components/V2AigouShoppingCart.tsx', import.meta.url), 'utf8'),
)
assert.ok(aigouCartSource.includes('全部加入购物车'))
assert.ok(aigouCartSource.includes('购物车查询接口具体响应'))
assert.ok(aigouCartSource.includes('验证码接口具体响应'))
assert.ok(aigouCartSource.includes('订购接口具体响应'))
assert.ok(aigouCartSource.includes('重新开始'))
assert.ok(aigouCartSource.includes('selectedCount > 10'))

const broadbandOrderHtml = renderToString(
  <V2BroadbandOrderPage accounts={[{ id: 'account-1', label: '测试账号', phoneMasked: '138****8000' }]} initialAccountId="account-1" />,
)
assert.ok(broadbandOrderHtml.includes('宽带新装'))
assert.ok(broadbandOrderHtml.includes('宽带续约'))
assert.ok(broadbandOrderHtml.includes('查询全部宽带产品'))

const qqtPremiumBroadbandHtml = renderToString(
  <V2QqtPremiumBroadbandPage
    accounts={[{ id: 'account-1', label: '测试账号', phoneMasked: '138****8000' }]}
    initialAccountId="account-1"
  />,
)
assert.ok(qqtPremiumBroadbandHtml.includes('全球通尊享宽带'))
assert.ok(qqtPremiumBroadbandHtml.includes('两年合约'))
assert.ok(qqtPremiumBroadbandHtml.includes('北京移动登录'))
assert.ok(qqtPremiumBroadbandHtml.includes('登录北京移动'))
assert.equal(qqtPremiumBroadbandHtml.includes('13800138000'), false)
const qqtPremiumBroadbandSource = await import('node:fs/promises').then((fs) =>
  fs.readFile(new URL('../v2/pages/V2QqtPremiumBroadbandPage.tsx', import.meta.url), 'utf8'),
)
assert.ok(qqtPremiumBroadbandSource.includes('家庭宽带业务服务协议'))
assert.ok(qqtPremiumBroadbandSource.includes('订购接口具体响应'))
assert.ok(qqtPremiumBroadbandSource.includes('重新开始'))
assert.ok(qqtPremiumBroadbandSource.includes("confirmationText !== '确认订购'"))
assert.ok(qqtPremiumBroadbandSource.includes('内置 itemCode'))
assert.equal(qqtPremiumBroadbandSource.includes('setItemCode'), false)

const bmccActivityOrderHtml = renderToString(
  <V2BmccActivityOrderPage
    accounts={[{ id: 'account-1', label: '13800138000', phoneMasked: '138****8000' }]}
    initialAccountId="account-1"
    allowManualPhone={false}
  />,
)
assert.ok(bmccActivityOrderHtml.includes('先登录北京移动账号'))
assert.equal(bmccActivityOrderHtml.includes('VPzD4o4vvy'), false)
assert.ok(bmccActivityOrderHtml.includes('图形验证码登录'))
assert.ok(bmccActivityOrderHtml.includes('查询活动'))
assert.ok(bmccActivityOrderHtml.includes('确认订购'))
assert.equal(bmccActivityOrderHtml.includes('13800138000'), false)

const standaloneAiBeanLoginHtml = renderToString(
  <MemoryRouter>
    <V2AiBeanContractOrderPage
      accounts={[{ id: 'account-1', label: '13800138000', phoneMasked: '138****8000' }]}
      initialAccountId="account-1"
      allowManualPhone={false}
      standalone
    />
  </MemoryRouter>,
)
assert.ok(standaloneAiBeanLoginHtml.includes('min-h-screen'))
assert.ok(standaloneAiBeanLoginHtml.includes('先登录北京移动账号'))
assert.equal(standaloneAiBeanLoginHtml.includes('AI豆倍享合约订购'), false)
assert.equal(standaloneAiBeanLoginHtml.includes('阅读合约内容'), false)

const aiBeanContractHtml = renderToString(
  <V2AiBeanContractExperience
    session={{
      id: 'ai-session',
      accountId: 'account-1',
      maskedPhone: '138****8000',
      stage: 'activity_ready',
      loginCacheStatus: 'reused',
      loginSmsCooldownSeconds: 0,
      orderSmsCooldownSeconds: 0,
      config: {
        activityName: 'bounsPoints_BXY',
        displayName: 'AI豆倍享合约（到期自动取消）',
        packageId: '2840305334',
        packageCode: 'JFBXHY',
        productShowCode: 'G_JFBXHY',
        pitemShowCode: 'BXY',
      },
      activity: {
        resultCode: 'JSP_SOURCE',
        canAttempt: true,
        message: '固定业务信息已加载',
        details: {},
      },
      createdAt: '2026-08-09T00:00:00.000Z',
      updatedAt: '2026-08-09T00:00:00.000Z',
      expiresAt: '2026-08-09T01:00:00.000Z',
    }}
    activityLoadFailed={false}
    renewal={false}
    acceptedProtocol={false}
    orderCode=""
    orderCooldown={0}
    busy=""
    onReloadActivity={() => undefined}
    onRenewalChange={() => undefined}
    onAcceptedProtocolChange={() => undefined}
    onSubmit={() => undefined}
    onOrderCodeChange={() => undefined}
    onSendOrderSms={() => undefined}
    onConfirmOrder={() => undefined}
    onOpenParams={() => undefined}
    onReset={() => undefined}
    standalone
  />,
)
assert.ok(aiBeanContractHtml.includes('min-h-screen w-full'))
assert.equal(aiBeanContractHtml.includes('当前号码'), false)
assert.ok(aiBeanContractHtml.includes('138****8000'))
assert.ok(aiBeanContractHtml.includes('承诺持续36个月使用移动网络'))
assert.ok(aiBeanContractHtml.includes('合约到期后自动续约'))
assert.ok(aiBeanContractHtml.includes('同意开通合约'))
assert.ok(aiBeanContractHtml.includes('rowspan="2"'))
assert.ok(aiBeanContractHtml.includes('本次开通的AI豆倍享合约到期后,可按上述规则自动续约一次。'))
assert.equal(aiBeanContractHtml.includes('按网龄逐档增加'), false)
assert.equal(aiBeanContractHtml.includes('disabled=""'), false)
assert.equal(aiBeanContractHtml.includes('重新登录'), false)
assert.equal(aiBeanContractHtml.includes('官方页面源码已标记业务下线'), false)
assert.equal(aiBeanContractHtml.includes('13800138000'), false)
assert.deepEqual(aiBeanConfirmationTerms(true).map((term) => term.slice(0, 2)), ['1.', '2.', '3.', '4.'])
assert.ok(aiBeanConfirmationTerms(true)[3].includes('自动续约一次'))
assert.equal(aiBeanConfirmationTerms(false).length, 3)
assert.ok(aiBeanConfirmationTerms(false)[0].includes('合约到期后自动失效'))

const aiBeanOrderConfirmationHtml = renderToString(
  <V2AiBeanContractExperience
    session={{
      id: 'ai-order-session',
      accountId: 'account-1',
      maskedPhone: '138****8000',
      stage: 'order_sms_required',
      loginCacheStatus: 'reused',
      loginSmsCooldownSeconds: 0,
      orderSmsCooldownSeconds: 0,
      config: {
        activityName: 'bounsPoints_XY',
        displayName: 'AI豆倍享合约（自动续订一次）',
        packageId: '2840305334',
        packageCode: 'JFBXHY',
        productShowCode: 'G_JFBXHY',
        productShowName: '积分倍享合约',
        pitemShowCode: 'XY',
      },
      orderSms: {
        productItemName: '积分倍享合约',
        productItemDesc: '原版接口返回的业务说明',
      },
      createdAt: '2026-08-09T00:00:00.000Z',
      updatedAt: '2026-08-09T00:00:00.000Z',
      expiresAt: '2026-08-09T01:00:00.000Z',
    }}
    activityLoadFailed={false}
    renewal
    acceptedProtocol
    orderCode=""
    orderCooldown={0}
    busy=""
    onReloadActivity={() => undefined}
    onRenewalChange={() => undefined}
    onAcceptedProtocolChange={() => undefined}
    onSubmit={() => undefined}
    onOrderCodeChange={() => undefined}
    onSendOrderSms={() => undefined}
    onConfirmOrder={() => undefined}
    onOpenParams={() => undefined}
    onReset={() => undefined}
    standalone
  />,
)
assert.ok(aiBeanOrderConfirmationHtml.includes('订购业务确认'))
assert.ok(aiBeanOrderConfirmationHtml.includes('138****8000'))
assert.ok(aiBeanOrderConfirmationHtml.includes('积分倍享合约'))
assert.ok(aiBeanOrderConfirmationHtml.includes('原版接口返回的业务说明'))
assert.ok(aiBeanOrderConfirmationHtml.includes('获取验证码'))
assert.ok(aiBeanOrderConfirmationHtml.includes('请输入验证码'))
assert.ok(aiBeanOrderConfirmationHtml.includes('/ai-bean-contract/order-header.png'))
assert.ok(aiBeanOrderConfirmationHtml.includes('/ai-bean-contract/order-confirm-button.png'))
assert.equal(aiBeanOrderConfirmationHtml.includes('订购短信确认'), false)

const standaloneFlyCardLoginHtml = renderToString(
  <MemoryRouter>
    <V2FlyCardOrderPage
      accounts={[{ id: 'account-1', label: '13800138000', phoneMasked: '138****8000' }]}
      initialAccountId="account-1"
      allowManualPhone={false}
    />
  </MemoryRouter>,
)
assert.ok(standaloneFlyCardLoginHtml.includes('先登录北京移动账号'))
assert.ok(standaloneFlyCardLoginHtml.includes('8元4G飞享卡原版订购页面'))
assert.equal(standaloneFlyCardLoginHtml.includes('13800138000'), false)

const flyCardProductHtml = renderToString(
  <V2FlyCardExperience
    session={{
      id: 'fly-session',
      accountId: 'account-1',
      maskedPhone: '138****8000',
      stage: 'activity_ready',
      loginCacheStatus: 'reused',
      loginSmsCooldownSeconds: 0,
      orderSmsCooldownSeconds: 0,
      config: {
        activityName: 'flyCard8_8TC',
        displayName: '8元4G飞享卡',
        packageId: '529',
        packageCode: '4GFXTC',
        productShowCode: 'fxtcsb',
        pitemShowCode: '8TC',
      },
      activity: {
        resultCode: 'JSP_FIXED_CONFIG',
        canAttempt: true,
        message: '已读取上月语音和流量用量',
        details: { previousMonthVoiceMinutes: 12, previousMonthDataMb: 345 },
      },
      createdAt: '2026-08-09T00:00:00.000Z',
      updatedAt: '2026-08-09T00:00:00.000Z',
      expiresAt: '2026-08-09T01:00:00.000Z',
    }}
    activityLoadFailed={false}
    orderCode=""
    orderCooldown={0}
    busy=""
    onReloadActivity={() => undefined}
    onSubmit={() => undefined}
    onOrderCodeChange={() => undefined}
    onSendOrderSms={() => undefined}
    onConfirmOrder={() => undefined}
    onOpenParams={() => undefined}
    onReset={() => undefined}
    standalone
  />,
)
assert.ok(flyCardProductHtml.includes('/fly-card-8/background.png'))
assert.ok(flyCardProductHtml.includes('/fly-card-8/card.png'))
assert.ok(flyCardProductHtml.includes('8元4G飞享卡'))
assert.ok(flyCardProductHtml.includes('30分钟/月'))
assert.ok(flyCardProductHtml.includes('10MB/月'))
assert.ok(flyCardProductHtml.includes('立即办理'))
assert.ok(flyCardProductHtml.includes('变更套餐下月生效'))
assert.equal(flyCardProductHtml.includes('13800138000'), false)

const flyCardOrderConfirmationHtml = renderToString(
  <V2FlyCardExperience
    session={{
      id: 'fly-order-session',
      accountId: 'account-1',
      maskedPhone: '138****8000',
      stage: 'order_sms_required',
      loginCacheStatus: 'reused',
      loginSmsCooldownSeconds: 0,
      orderSmsCooldownSeconds: 0,
      config: {
        activityName: 'flyCard8_8TC',
        displayName: '8元4G飞享卡',
        packageId: '529',
        packageCode: '4GFXTC',
        productShowCode: 'fxtcsb',
        pitemShowCode: '8TC',
      },
      orderSms: { productItemName: '8元4G飞享卡', productItemDesc: '原版飞享卡订购说明' },
      createdAt: '2026-08-09T00:00:00.000Z',
      updatedAt: '2026-08-09T00:00:00.000Z',
      expiresAt: '2026-08-09T01:00:00.000Z',
    }}
    activityLoadFailed={false}
    orderCode=""
    orderCooldown={0}
    busy=""
    onReloadActivity={() => undefined}
    onSubmit={() => undefined}
    onOrderCodeChange={() => undefined}
    onSendOrderSms={() => undefined}
    onConfirmOrder={() => undefined}
    onOpenParams={() => undefined}
    onReset={() => undefined}
  />,
)
assert.ok(flyCardOrderConfirmationHtml.includes('订购业务确认'))
assert.ok(flyCardOrderConfirmationHtml.includes('原版飞享卡订购说明'))
assert.ok(flyCardOrderConfirmationHtml.includes('/fly-card-8/pophd.png'))
assert.ok(flyCardOrderConfirmationHtml.includes('/fly-card-8/popqr.png'))

const publicBusinessOrderHtml = renderToString(
  <MemoryRouter initialEntries={['/business-order?accountId=account-1']}>
    <BusinessOrderPage />
  </MemoryRouter>,
)
assert.ok(publicBusinessOrderHtml.includes('正在加载订购账号'))

const publicLoginSource = await import('node:fs/promises').then((fs) =>
  fs.readFile(new URL('../pages/PublicLogin.tsx', import.meta.url), 'utf8'),
)
const usersAdminSource = await import('node:fs/promises').then((fs) =>
  fs.readFile(new URL('../pages/UsersAdmin.tsx', import.meta.url), 'utf8'),
)
assert.ok(publicLoginSource.includes('业务订购'))
assert.ok(publicLoginSource.includes('/business-order?accountId='))
assert.ok(publicLoginSource.includes("loginDialogAccount?.lastLoginMethod === 'manual_cookie'"))
assert.ok(publicLoginSource.includes("defaultMethod="))
assert.ok(publicLoginSource.includes('aria-label="宫格展示"'))
assert.ok(publicLoginSource.includes('aria-label="列表展示"'))
assert.ok(publicLoginSource.includes("startLinkBatchTask('global_telecom_resign')"))
assert.ok(publicLoginSource.includes('一键补签+一键盲盒'))
assert.ok(publicLoginSource.includes('/api/tasks/global-telecom-resign'))
assert.ok(publicLoginSource.includes("accountViewMode === 'list'"))
assert.ok(publicLoginSource.includes('<div>网龄</div>'))
assert.ok(publicLoginSource.includes('<div>归属地</div>'))
assert.ok(publicLoginSource.includes('<div>全球通等级</div>'))
assert.ok(publicLoginSource.includes('<div>登录有效期</div>'))
assert.ok(publicLoginSource.includes('md:grid-cols-[minmax(130px,1.1fr)'))
assert.ok(publicLoginSource.includes('toggleAccountPinned'))
assert.ok(publicLoginSource.includes('moveAccount'))
assert.ok(publicLoginSource.includes('accountGestureProps'))
assert.ok(publicLoginSource.includes('长按') === false)
assert.ok(publicLoginSource.includes('拖拽调整顺序'))
assert.ok(publicLoginSource.includes('操作</div>'))
assert.ok(publicLoginSource.includes('async function jumpToAigou'))
assert.ok(publicLoginSource.includes('async function jumpToQqtZone'))
assert.ok(publicLoginSource.includes('/qqt/sso-link${query}'))
assert.ok(publicLoginSource.includes("label: '全球通专区'"))
assert.ok(publicLoginSource.includes('/aigou/sso-link${query}'))
assert.equal(publicLoginSource.match(/>\s*86 优惠商城\s*</g)?.length ?? 0, 0)
assert.ok(publicLoginSource.includes("label: '爱购商城'"))
assert.ok(publicLoginSource.includes('async function jumpToCocPackage'))
assert.ok(publicLoginSource.includes('/coc-package/${target}/sso-link${query}'))
assert.ok(publicLoginSource.includes("'building_bricks', '积木套餐'"))
assert.ok(publicLoginSource.includes("'diamond_package', '全球通卓越钻石'"))
assert.ok(publicLoginSource.includes("'age_feed', '全球通网龄直升'"))
assert.ok(publicLoginSource.includes("'smart_life', '智臻会员'"))
assert.ok(publicLoginSource.includes("'five_ga', '全球通 5GA'"))
assert.ok(usersAdminSource.includes('async function generateAigouSsoLink'))
assert.ok(usersAdminSource.includes('async function generateQqtSsoLink'))
assert.ok(usersAdminSource.includes('/qqt/sso-link'))
assert.ok(usersAdminSource.includes('全球通专区'))
assert.ok(usersAdminSource.includes('/aigou/sso-link'))
assert.ok(usersAdminSource.includes('爱购商城'))
assert.ok(usersAdminSource.includes('async function generateCocPackageSsoLink'))
assert.ok(usersAdminSource.includes("'building_bricks', '积木套餐'"))
assert.ok(usersAdminSource.includes("'diamond_package', '全球通卓越钻石'"))
assert.ok(usersAdminSource.includes("'age_feed', '全球通网龄直升'"))
assert.ok(usersAdminSource.includes("'smart_life', '智臻会员'"))
assert.ok(usersAdminSource.includes("'five_ga', '全球通 5GA'"))
assert.ok(usersAdminSource.includes('专属页业务订购入口'))
assert.ok(usersAdminSource.includes('已订业务退订/撤回权限'))
assert.ok(usersAdminSource.includes('商城业务退订权限'))
assert.ok(usersAdminSource.includes('关联专属链接与邀请码'))
assert.ok(usersAdminSource.includes('detail.linkedInvites.map'))
assert.ok(publicLoginSource.includes('canViewBusinessQuery') === false)
assert.ok(publicLoginSource.includes('canViewShopQuery') === false)
assert.ok(publicLoginSource.includes('const canOrderBusiness = Boolean(publicUser?.permissions?.businessOrder)'))
assert.ok(publicLoginSource.includes('const canUseBenefitActivity = Boolean(publicUser?.permissions?.benefitActivity)'))
assert.ok(publicLoginSource.includes('/benefits/lucky-three-day?accountId='))
assert.ok(publicLoginSource.includes('/benefits/global-telecom?'))
assert.ok(publicLoginSource.includes('全球通信息查询'))
assert.ok(publicLoginSource.includes("label: '全球通信息查询'"))
assert.ok(publicLoginSource.includes('const accountUsable = login.loggedIn'))
assert.ok(publicLoginSource.includes("...(canOrderBusiness ? [{ label: '业务订购'"))
assert.ok(usersAdminSource.includes('/business-order?accountId='))
assert.ok(usersAdminSource.includes('{ businessQuery: enabled }'))
assert.ok(usersAdminSource.includes('{ shopQuery: enabled }'))
assert.ok(usersAdminSource.includes('{ businessOrder: enabled }'))
assert.ok(usersAdminSource.includes('{ businessIdOverride: enabled }'))
assert.ok(usersAdminSource.includes('{ benefitActivity: enabled }'))
assert.ok(usersAdminSource.includes('专属页权益活动入口'))
const accountsRouteSource = await import('node:fs/promises').then((fs) =>
  fs.readFile(new URL('../../api/routes/accounts.ts', import.meta.url), 'utf8'),
)
assert.ok(accountsRouteSource.includes('userId: account.userId'))
assert.ok(accountsRouteSource.includes('await syncInviteAccountOwnership()'))
assert.ok(accountsRouteSource.includes("router.post('/:id/aigou/sso-link'"))
assert.ok(accountsRouteSource.includes("'/:id/qqt/sso-link'"))
assert.ok(accountsRouteSource.includes("'/:id/global-telecom/customer-service-link'"))
assert.equal(accountsRouteSource.includes('readCachedQqtSsoUrl'), false)
assert.ok(accountsRouteSource.includes("source: 'fresh-sso'"))
assert.ok(accountsRouteSource.includes('resolveGlobalTelecomCustomerServiceEntryUrl'))
assert.ok(accountsRouteSource.includes("router.post('/:id/aigou/session/prepare'"))
assert.ok(accountsRouteSource.includes("router.post('/:id/coc-package/:target/sso-link'"))
assert.ok(accountsRouteSource.includes("router.post('/:id/coc-package/:target/session/prepare'"))
assert.ok(accountsRouteSource.includes('preferCachedToken: true'))
assert.ok(accountsRouteSource.includes('refreshAccessToken: context.rec.yunpanSession'))
assert.ok(accountsRouteSource.includes('if ((cookie || rec.yunpanSession) &&'))
const globalTelecomPageSource = await import('node:fs/promises').then((fs) =>
  fs.readFile(new URL('../v2/pages/V2GlobalTelecomPage.tsx', import.meta.url), 'utf8'),
)
assert.ok(globalTelecomPageSource.includes('全球通专属客服'))
assert.ok(globalTelecomPageSource.includes('签到赢惊喜'))
assert.ok(globalTelecomPageSource.includes('连续签到满 1 天、4 天、7 天'))
assert.ok(globalTelecomPageSource.includes("window.open('about:blank', '_blank')"))
assert.ok(globalTelecomPageSource.includes('loadGlobalTelecomCustomerServiceLink'))
assert.ok(globalTelecomPageSource.includes(
  "payload?.cloudflare_error === true && (error.status === 429 || error.status === 503)",
))
const taskDialogSource = await import('node:fs/promises').then((fs) =>
  fs.readFile(new URL('../v2/components/V2TaskDialog.tsx', import.meta.url), 'utf8'),
)
assert.ok(taskDialogSource.includes("{ value: 'global_telecom_resign', label: '一键补签+一键盲盒' }"))
const businessOrderSource = await import('node:fs/promises').then((fs) =>
  fs.readFile(new URL('../v2/pages/V2BusinessOrderPage.tsx', import.meta.url), 'utf8'),
)
assert.ok(businessOrderSource.includes('可继续发送验证码并尝试订购'))
assert.ok(businessOrderSource.includes('10086 CK 免验证码登录'))
const benefitOrderSource = await import('node:fs/promises').then((fs) =>
  fs.readFile(new URL('../v2/pages/V2BenefitOrderWorkflowPage.tsx', import.meta.url), 'utf8'),
)
const unifiedBusinessOrderSource = await import('node:fs/promises').then((fs) =>
  fs.readFile(new URL('../v2/pages/V2UnifiedBusinessOrderPage.tsx', import.meta.url), 'utf8'),
)
const broadbandOrderSource = await import('node:fs/promises').then((fs) =>
  fs.readFile(new URL('../v2/pages/V2BroadbandOrderPage.tsx', import.meta.url), 'utf8'),
)
const bmccActivityOrderSource = await import('node:fs/promises').then((fs) =>
  fs.readFile(new URL('../v2/pages/V2BmccActivityOrderPage.tsx', import.meta.url), 'utf8'),
)
const bmccOrderParamsDialogSource = await import('node:fs/promises').then((fs) =>
  fs.readFile(new URL('../v2/components/V2BmccOrderParamsDialog.tsx', import.meta.url), 'utf8'),
)
const businessTierDialogSource = await import('node:fs/promises').then((fs) =>
  fs.readFile(new URL('../v2/components/V2BusinessTierDialog.tsx', import.meta.url), 'utf8'),
)
const luckyThreeDaySource = await import('node:fs/promises').then((fs) =>
  fs.readFile(new URL('../v2/pages/V2LuckyThreeDayPage.tsx', import.meta.url), 'utf8'),
)
assert.ok(luckyThreeDaySource.includes('sendLuckyOrderSms'))
assert.ok(luckyThreeDaySource.includes("confirmationText !== '确认领取'"))
assert.ok(luckyThreeDaySource.includes('查看详情'))
assert.ok(luckyThreeDaySource.includes('距离开始'))
assert.ok(luckyThreeDaySource.includes('权益领取配置'))
assert.ok(luckyThreeDaySource.includes('<MessageDialog'))
assert.ok(luckyThreeDaySource.includes('sm:grid-cols-2 lg:grid-cols-3') === false)
assert.ok(benefitOrderSource.includes('积木套餐独立登录'))
assert.ok(benefitOrderSource.includes('10086 CK 自动置换积木套餐订购凭证'))
assert.ok(benefitOrderSource.includes('使用所选账号的 10086 CK 自动置换 COC 订购凭证'))
assert.ok(benefitOrderSource.includes('生成并打开资费页'))
assert.ok(benefitOrderSource.includes('createCocAppSsoLink'))
assert.ok(benefitOrderSource.includes('资格预校验未通过，我已了解风险并仍要尝试提交'))
assert.ok(benefitOrderSource.includes('返回上一步'))
assert.ok(unifiedBusinessOrderSource.includes("mode === 'broadband'"))
assert.ok(broadbandOrderSource.includes('新增产品配置'))
assert.ok(broadbandOrderSource.includes('grid-cols-[minmax(96px,1fr)_112px_40px]'))
assert.ok(broadbandOrderSource.includes('完整安装地址'))
assert.ok(broadbandOrderSource.includes('已登录手机号'))
assert.ok(broadbandOrderSource.includes('输入宽带账号查询可续约产品'))
assert.ok(broadbandOrderSource.includes('查询全部宽带产品'))
assert.ok(broadbandOrderSource.includes('跨流程尝试'))
assert.ok(broadbandOrderSource.includes('配置 ${product.displayName}'))
assert.ok(broadbandOrderSource.includes('宽带参数与业务配置'))
assert.ok(broadbandOrderSource.includes('恢复原始参数'))
assert.ok(broadbandOrderSource.includes('应用到本次办理'))
assert.ok(benefitOrderSource.includes('重新开始'))
assert.ok(benefitOrderSource.includes('使用自定义业务档位'))
assert.ok(benefitOrderSource.includes('新增档位'))
assert.ok(benefitOrderSource.includes('saveCustomBusinessTiers'))
assert.ok(businessTierDialogSource.includes('保存并选中'))
assert.ok(businessTierDialogSource.includes('onDelete'))
assert.ok(benefitOrderSource.includes('decodeRichText'))
assert.ok(unifiedBusinessOrderSource.includes("id: 'five_g_enjoy'"))
assert.ok(unifiedBusinessOrderSource.includes("id: 'bmcc_activity'"))
assert.ok(unifiedBusinessOrderSource.includes("id: 'ai_bean_contract'"))
assert.ok(unifiedBusinessOrderSource.includes('aiBeanContractHref'))
assert.ok(bmccActivityOrderSource.includes('<MessageDialog'))
assert.ok(bmccActivityOrderSource.includes("confirmationText !== '确认订购'"))
assert.ok(bmccActivityOrderSource.includes('createBmccActivityConfig'))
assert.ok(bmccActivityOrderSource.includes('查看完整脱敏响应'))
assert.ok(bmccActivityOrderSource.includes('V2SearchableAccountSelect'))
assert.ok(bmccActivityOrderSource.includes("effectiveConfig.proType || '固定参数直订'"))
assert.ok(bmccActivityOrderSource.includes('requestConfigOverride'))
assert.equal(bmccActivityOrderSource.includes('官方页面源码已标记业务下线'), false)
assert.ok(bmccActivityOrderSource.includes('V2FlyCardExperience'))
assert.ok(unifiedBusinessOrderSource.includes('flyCardHref'))
assert.ok(bmccActivityOrderSource.includes('restoreBmccActivityOrder'))
assert.ok(bmccActivityOrderSource.includes('缓存登录已验证'))
assert.ok(bmccActivityOrderSource.includes('查看验证码与参数'))
assert.ok(bmccActivityOrderSource.includes('参数已更新，旧验证码上下文已失效'))
assert.equal(bmccActivityOrderSource.includes('sessionIdRef.current'), false)
assert.ok(bmccOrderParamsDialogSource.includes('订购验证码与请求参数'))
assert.ok(bmccOrderParamsDialogSource.includes('显示验证码'))
assert.ok(bmccOrderParamsDialogSource.includes('8 位原码将自动取前 5 位和最后 1 位提交'))
assert.ok(businessOrderSource.includes('V2SearchableAccountSelect'))
assert.ok(benefitOrderSource.includes('V2SearchableAccountSelect'))
assert.ok(benefitOrderSource.includes("retailBusinessId === 'good_gifts_membership'"))
assert.ok(benefitOrderSource.includes("retailBusinessId === 'good_gifts_data'"))
assert.ok(unifiedBusinessOrderSource.includes("id: 'fly_card_8'"))
assert.ok(unifiedBusinessOrderSource.includes("id: 'excellent_device_offer'"))
assert.ok(unifiedBusinessOrderSource.includes("id: 'traffic_member_20'"))
assert.ok(unifiedBusinessOrderSource.includes("id: 'good_gifts_membership'"))
assert.ok(unifiedBusinessOrderSource.includes("id: 'good_gifts_data'"))
assert.ok(unifiedBusinessOrderSource.includes('好礼多多会员版'))
assert.ok(unifiedBusinessOrderSource.includes('好礼多多流量版'))
assert.ok(unifiedBusinessOrderSource.includes("id: 'custom'"))
assert.ok(unifiedBusinessOrderSource.includes("id: 'smart_life'"))
assert.ok(unifiedBusinessOrderSource.includes("id: 'five_ga'"))
process.stdout.write('ui-unit: ok\n')

import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import { aesDecrypt, aesEncrypt } from '../services/cmccCrypto.js'
import { __test__ as batchTaskTest } from '../services/batchTasks.js'
import { extractLoginParamsFromHtml } from '../services/cmccLoginParams.js'
import { __test__ as cmccTest } from '../services/cmcc10086.js'
import { __test__ as businessQueryTest } from '../services/cmccBusinessQuery.js'
import { extractUpstreamHtmlError, formatUpstreamErrorMessage } from '../../shared/upstreamErrorMessage.js'
import {
  __test__ as businessOrderTest,
  BusinessOrderError,
  createBusinessOrderSession,
  deleteBusinessOrderSession,
} from '../services/cmccBusinessOrder.js'
import { __test__ as adminAuthTest, createAdminSession } from '../services/adminAuthStore.js'
import { __test__ as cookieTest } from '../services/cookieUtils.js'
import { __test__ as debugCryptoTest } from '../services/debugCrypto.js'
import { __test__ as tokenExportTest } from '../services/qqtTokenExport.js'
import {
  buildShopLoginRequest,
  buildShopLoginSign,
  shopWireDecrypt,
  shopWireEncrypt,
} from '../services/cmccShopCrypto.js'
import { __test__ as shopBusinessTest } from '../services/cmccShopBusiness.js'
import { __test__ as shopSessionTest } from '../services/cmccShopSession.js'
import { __test__ as userAuthTest } from '../services/userAuthStore.js'
import { __test__ as accountProfileTest } from '../services/accountProfile.js'
import { hasCmccBusinessSessionCookie } from '../services/cmccSessionBridge.js'
import { __test__ as aigouTest, buildAigouSsoEntryUrl } from '../services/aigouSession.js'
import { __test__ as luckyThreeDayTest } from '../services/luckyThreeDay.js'
import { __test__ as luckyOverrideTest } from '../services/luckyThreeDayOverrides.js'
import { __test__ as qqtTest } from '../services/qqtSign.js'
import { __test__ as globalTelecomTest } from '../services/globalTelecom.js'
import {
  resolveGlobalTelecomCustomerServiceChatUrl,
  resolveGlobalTelecomCustomerServiceEntryUrl,
  safeGlobalTelecomCustomerServiceEntryUrl,
} from '../services/globalTelecomCustomerService.js'
import {
  __test__ as cocPackageTest,
  buildCocPackageUrl,
  COC_PACKAGE_TARGETS,
} from '../services/cocPackageSession.js'
import { __test__ as cmccHttpTest } from '../services/cmccHttp.js'
import { __test__ as announcementTest } from '../services/announcementStore.js'
import { resolveScopedPermission } from '../services/serviceLoginGuard.js'
import {
  cocAuroraDecrypt,
  cocAuroraEncrypt,
  createCocAuroraContext,
  premiumAuthDecrypt,
  premiumAuthEncrypt,
  premiumWireDecrypt,
  premiumWireEncrypt,
} from '../services/cmccBenefitOrderCrypto.js'
import {
  __test__ as benefitOrderTest,
  createBuildingBricksSession,
  createCocAppSession,
  deleteBenefitOrderSession,
  RETAIL_PRODUCT_PRESETS,
} from '../services/cmccBenefitOrder.js'
import { __test__ as bmccActivityOrderTest } from '../services/bmccActivityOrder.js'
import { __test__ as bmccActivityLoginCacheTest } from '../services/bmccActivityLoginCache.js'
import { __test__ as broadbandPortalTest } from '../services/broadbandPortalClient.js'
import { __test__ as broadbandConfigTest } from '../services/broadbandOrderConfigs.js'
import { __test__ as broadbandOrderTest } from '../services/broadbandOrder.js'
import { __test__ as qqtPremiumBroadbandTest } from '../services/qqtPremiumBroadbandOrder.js'
import {
  __test__ as aigouOrderTest,
  AIGOU_PRODUCT_PRESETS,
  AigouBusinessOrderClient,
  encryptAigouOrderCode,
  encryptAigouSmsSku,
  normalizeProductInput as normalizeAigouProductInput,
} from '../services/aigouBusinessOrder.js'
import { __test__ as aigouPackageOrderTest } from '../services/aigouPackageOrder.js'
import {
  __test__ as aigouCartTest,
  AIGOU_CART_CATALOG,
  AigouShoppingCartClient,
  buildCartAddPayload,
  buildCartCalculatePayload,
  buildCartEditPayload,
  buildCartOrderPayload,
  buildCartSmsPayload,
  sanitizeAigouCartResponse,
  type AigouCartCalculateResult,
  type AigouCartSelection,
} from '../services/aigouShoppingCart.js'
import {
  __test__ as retailProductTest,
  expandProductCodeRange,
  normalizeProductCode,
  normalizeProductCodes,
} from '../services/retailProductQuery.js'
import {
  __test__ as wedRechargeTest,
  planWedRechargeTasks,
  resolveWedRechargeRound,
  selectWedRechargeRunnableTasks,
  type WedRechargeTask,
} from '../services/wedRecharge.js'
import { __test__ as yunpan10086Test } from '../services/yunpan10086.js'
import {
  isYunpan10086ExchangeEnabled,
  shouldRecover10086CookieByYunpan,
} from '../services/cmccCookieRecovery.js'

async function run() {
  const forbiddenHtml = '<html><head><title>403 Forbidden</title><style>body { color: red }</style></head><body><center><h1>403 Forbidden</h1></center><hr><center>openresty</center><script>privateToken = "secret"</script></body></html><!-- a padding to disable MSIE and Chrome friendly error page -->'
  const forbidden = businessQueryTest.parseBusinessResponse({ statusCode: 403, headers: {}, bodyText: forbiddenHtml }, 'session=test')
  assert.equal(forbidden.ok, false)
  assert.equal(forbidden.status, 403)
  assert.equal(forbidden.message, '移动侧拒绝了请求（HTTP 403）：403 Forbidden')
  assert.equal(forbidden.cookie, 'session=test')
  assert.equal(forbidden.cookieUpdated, false)
  assert.equal(/<|>|openresty|privateToken|padding|color:/.test(forbidden.message!), false)
  const htmlWithOkStatus = businessQueryTest.parseBusinessResponse({ statusCode: 200, headers: { 'set-cookie': ['session=new; Path=/'] }, bodyText: forbiddenHtml }, 'session=old')
  assert.equal(htmlWithOkStatus.ok, false)
  assert.equal(htmlWithOkStatus.status, 200)
  assert.equal(htmlWithOkStatus.cookie, 'session=new')
  assert.equal(htmlWithOkStatus.cookieUpdated, true)
  assert.ok(htmlWithOkStatus.message!.includes('HTTP 200'))
  assert.ok(htmlWithOkStatus.message!.includes('403 Forbidden'))
  const jsonFailure = businessQueryTest.parseBusinessResponse({ statusCode: 200, headers: {}, bodyText: JSON.stringify({ retCode: '123456', retDesc: '该业务不可退订', rspBody: {} }) })
  assert.equal(jsonFailure.ok, false)
  assert.equal(jsonFailure.retCode, '123456')
  assert.equal(jsonFailure.retDesc, '该业务不可退订')
  const jsonSuccess = businessQueryTest.parseBusinessResponse({ statusCode: 200, headers: {}, bodyText: JSON.stringify({ retCode: '000000', retDesc: '受理成功', rspBody: { accepted: true } }) })
  assert.equal(jsonSuccess.ok, true)
  assert.deepEqual(jsonSuccess.data, { accepted: true })
  assert.equal(formatUpstreamErrorMessage('验证码错误，请重新输入', '200'), '验证码错误，请重新输入')
  assert.equal(extractUpstreamHtmlError('<html><head><title>错误</title></head><body><h1>办理受限</h1><p>当前业务不支持退订，请拨打 10086。</p></body></html>', 403), '移动侧拒绝了请求（HTTP 403）：办理受限；当前业务不支持退订，请拨打 10086。')
  assert.equal(extractUpstreamHtmlError('&lt;html&gt;&lt;h1&gt;403 Forbidden&lt;/h1&gt;&lt;/html&gt;', 403), forbidden.message)
  assert.equal(extractUpstreamHtmlError('<div><p>系统维护&#xFF0C;请稍后重试&amp;确认。</p></div>', 503), '移动侧服务暂不可用（HTTP 503）：系统维护，请稍后重试&确认。')
  assert.equal(extractUpstreamHtmlError('<html><style>secret</style><script>secret', 502), '移动侧网关响应异常（HTTP 502）')
  assert.equal(extractUpstreamHtmlError('<html><body><script>secret</script></body></html>', 500), '移动侧服务发生错误（HTTP 500）')
  assert.equal(extractUpstreamHtmlError('移动侧上游返回 HTML 错误页（HTTP 403）：' + forbiddenHtml.slice(0, 180)), forbidden.message)

  const previousYunpanExchangeFlag = process.env.YUNPAN_10086_EXCHANGE_ENABLED
  delete process.env.YUNPAN_10086_EXCHANGE_ENABLED
  assert.equal(isYunpan10086ExchangeEnabled(), false)
  process.env.YUNPAN_10086_EXCHANGE_ENABLED = 'true'
  const yunpanSession = {
    account: '13800000000',
    completeAccount: '13800000000',
    authorization: 'test',
  }
  assert.equal(
    shouldRecover10086CookieByYunpan({
      lastLoginMethod: 'cmcc_sms',
      cookieSource: 'sms',
      yunpanSession,
    } as Parameters<typeof shouldRecover10086CookieByYunpan>[0]),
    true,
  )
  assert.equal(
    shouldRecover10086CookieByYunpan({
      lastLoginMethod: 'yunpan',
      cookieSource: 'yunpan',
      yunpanSession,
    } as Parameters<typeof shouldRecover10086CookieByYunpan>[0]),
    true,
  )
  if (previousYunpanExchangeFlag === undefined) delete process.env.YUNPAN_10086_EXCHANGE_ENABLED
  else process.env.YUNPAN_10086_EXCHANGE_ENABLED = previousYunpanExchangeFlag

  assert.deepEqual(yunpan10086Test.buildQuerySpecTokenV1Payload('13800000000', '017018'), {
    account: '13800000000',
    toSourceId: '017018',
  })
  assert.deepEqual(yunpan10086Test.buildQuerySpecTokenV2Payload('13800000000', '017018'), {
    phoneNumber: '13800000000',
    toSourceId: '017018',
    commonAccountInfo: { account: '13800000000', accountType: 1 },
  })
  assert.throws(() => yunpan10086Test.requireSourceId(''), /SOURCE_ID_REQUIRED/)
  assert.equal(
    yunpan10086Test.resolveUserDomainUrl([
      { modName: 'user', httpsUrl: 'https://user-gz.yun.139.com/user/' },
    ]),
    'https://user-gz.yun.139.com/user',
  )
  assert.equal(
    yunpan10086Test.resolveUserDomainUrl([
      { modName: 'user', httpsUrl: 'https://example.com/collect' },
    ]),
    'https://user-njs.yun.139.com/user',
  )
  assert.deepEqual(
    yunpan10086Test.buildSpecTokenDiagnostic(
      { success: false, code: 'NO_PERMISSION', data: { resultCode: '104403', token: 'hidden' } },
      200,
      'v1',
    ),
    {
      protocol: 'v1',
      sourceId: '017018',
      httpStatus: 200,
      success: false,
      code: 'NO_PERMISSION',
      resultCode: '104403',
    },
  )

  assert.equal(
    encryptAigouSmsSku('26804', 1786543768057),
    '1yq99U275DgJ42cGSJ4oU5ID3TpbmLvVeezKSikX9rM=',
  )
  assert.equal(encryptAigouOrderCode('123456').length, 24)
  assert.deepEqual(
    normalizeAigouProductInput({
      code: 'mzonebojindg', skuId: '26804', channelCode: 'P00000151769',
      referer: 'mzonebojindg', selfChannelCode: '', activityId: '17466',
    }),
    {
      code: 'mzonebojindg', skuId: '26804', name: '铂金会员校园版', orderMode: 'rights',
      channelCode: 'P00000151769', selfChannelCode: 'P00000151769',
      referer: 'mzonebojindg', activityId: '17466',
      productCode: undefined, pageId: undefined, touchCode: undefined,
      protocolSequenceId: undefined, smsCodeTypeEnum: undefined,
    },
  )
  assert.deepEqual(
    normalizeAigouProductInput({ skuId: '999999' }),
    {
      code: '', skuId: '999999', orderMode: 'rights', channelCode: 'P00000139704',
      selfChannelCode: 'P00000139704', referer: 'bojinyear',
      name: undefined, activityId: undefined, productCode: undefined, pageId: undefined,
      touchCode: undefined, protocolSequenceId: undefined, smsCodeTypeEnum: undefined,
    },
  )
  const knownPackage = normalizeAigouProductInput({ skuId: '100000098326' })
  assert.equal(knownPackage.code, 'xbklhhy')
  assert.equal(knownPackage.orderMode, 'package')
  assert.equal(knownPackage.pageId, '1878635095121567744')
  assert.deepEqual(
    AIGOU_PRODUCT_PRESETS.map((item) => item.code),
    ['mzonebojindg', 'bojinbyhb', 'bojinbnbyhb', 'bojinyearyhb', 'bojinyear', 'sxxshzgb', 'xbklhhy'],
  )
  assert.deepEqual(
    aigouOrderTest.extractLayoutProduct('sample', {
      id: 5028,
      name: '测试订购页',
      title: '测试业务',
      touchCode: 'P00000104637',
      instanceList: [{ specify: JSON.stringify({ name: 'Rights-PictureMemberOrderComp', vipSkuId: '26804' }) }],
    }),
    {
      code: 'sample', skuId: '26804', channelCode: 'P00000104637',
      selfChannelCode: 'P00000104637', referer: 'sample', name: '测试订购页',
      pageTitle: '测试业务', pageId: '5028', orderMode: 'rights', source: 'layout',
    },
  )
  assert.equal(
    aigouOrderTest.extractLayoutProduct('nested', {
      pageInstanceList: [{ instance: { specify: JSON.stringify({ name: 'CustomOrder', skuID: '77626' }) } }],
    }).skuId,
    '77626',
  )
  assert.deepEqual(aigouOrderTest.sanitize({ phone: '13800138000', nested: { token: 'secret', value: 'ok' } }), { nested: { value: 'ok' } })
  assert.deepEqual(aigouOrderTest.sanitize({ a: { b: { c: { d: { e: { f: { value: 'too deep' } } } } } } }), { a: { b: { c: { d: { e: { f: undefined } } } } } })

  const campus = normalizeAigouProductInput({ skuId: '26804' })
  const smsClient = new AigouBusinessOrderClient({
    cookie: 'session=value', token: 'login-token', refreshToken: 'refresh-token', loginUrl: 'https://dev.coc.10086.cn/coc3/example',
  })
  ;(smsClient as unknown as { request: () => Promise<Record<string, unknown>> }).request = async () => ({
    resultCode: -9, msg: '短信发送被上游拒绝', data: { reason: 'RATE_LIMIT' },
  })
  assert.deepEqual(await smsClient.sendSms(campus), {
    success: false,
    resultCode: '-9',
    message: '短信发送被上游拒绝',
    response: { resultCode: -9, msg: '短信发送被上游拒绝', data: { reason: 'RATE_LIMIT' } },
    cooldownSeconds: 60,
  })

  const orderClient = new AigouBusinessOrderClient({
    cookie: 'session=value; BSFIT_DEVICEID=current-browser-dfp', token: 'login-token', refreshToken: 'refresh-token', loginUrl: 'https://dev.coc.10086.cn/coc3/example',
  })
  let directRequest: { headers?: Record<string, string>; body?: Record<string, unknown> } | undefined
  ;(orderClient as unknown as { fetchRiskDeviceToken: () => Promise<Record<string, string>> }).fetchRiskDeviceToken = async () => ({
    token: 'fresh-risk-device-token', resultCode: '2', message: 'The token has been generated successfully.',
  })
  ;(orderClient as unknown as { request: (path: string, options: { headers?: Record<string, string>; body?: Record<string, unknown> }) => Promise<Record<string, unknown>> }).request = async (requestPath, options) => {
    if (requestPath.includes('checkBlacklist')) return { resultCode: 0, msg: 'success', data: { isBlackList: 0 } }
    directRequest = options
    return { resultCode: -307, msg: '订购异常，与已有业务冲突。（code:3004）', data: null }
  }
  const campusResult = await orderClient.confirmOrder(campus, '123456')
  assert.equal(campusResult.success, false)
  assert.equal(campusResult.resultCode, '-307')
  assert.equal(campusResult.message, '订购异常，与已有业务冲突。（code:3004）')
  assert.deepEqual(campusResult.response, { resultCode: -307, msg: '订购异常，与已有业务冲突。（code:3004）', data: null })
  assert.deepEqual(campusResult.riskPreparation, {
    deviceToken: 'generated', wasmParams: 'unavailable', operDfp: 'session-cookie',
    tokenResultCode: '2', tokenMessage: 'The token has been generated successfully.',
  })
  assert.equal(directRequest?.headers?.['gr-risk-p3'], 'fresh-risk-device-token')
  assert.equal(directRequest?.headers?.['gr-risk-p1'], undefined)
  assert.equal(directRequest?.headers?.['gr-risk-p2'], undefined)
  assert.equal(directRequest?.headers?.wasmParams, undefined)
  assert.equal(directRequest?.body?.operDfp, 'current-browser-dfp')
  assert.deepEqual(Object.keys(directRequest?.body || {}).sort(), [
    'channelCode', 'dealType', 'operDfp', 'receipt', 'receiptModule', 'referer', 'selfChannelCode', 'skuId', 'smsCode',
  ])
  assert.equal(JSON.stringify(campusResult).includes('fresh-risk-device-token'), false)
  assert.equal(JSON.stringify(campusResult).includes('current-browser-dfp'), false)

  const cartableCatalog = AIGOU_CART_CATALOG.filter((item) => item.cartable)
  const pendingCartMapping = AIGOU_CART_CATALOG.filter((item) => !item.cartable)
  assert.equal(cartableCatalog.length, 20)
  assert.equal(pendingCartMapping.length, 24)
  assert.equal(new Set(cartableCatalog.map((item) => item.specId)).size, 20)
  assert.equal(pendingCartMapping.every((item) => Boolean(item.directSkuId) && !item.specId), true)
  const cartAddPayload = buildCartAddPayload(cartableCatalog[0], 'encrypted-mobile', 1)
  assert.deepEqual(Object.keys(cartAddPayload), ['userMobile', 'pageId', 'orderBusiInfo'])
  assert.equal(cartAddPayload.userMobile, 'encrypted-mobile')
  assert.equal(JSON.stringify(cartAddPayload).includes('2026071416173559901625472'), true)
  assert.throws(() => buildCartAddPayload(pendingCartMapping[0], 'encrypted-mobile', 1), /缺少加车接口必需/)

  const cartSelection: AigouCartSelection = {
    shoppingCartId: 'cart-1', preSubmitInstId: 'pre-1', specId: 'spec-1', offerName: '测试权益', number: 2, busiType: 'C3',
  }
  assert.deepEqual(buildCartEditPayload(cartSelection, 'encrypted-mobile', 3), {
    userMobile: 'encrypted-mobile', shoppingCartId: 'cart-1',
    offerList: [{ preSubmitInstId: 'pre-1', specId: 'spec-1', number: 3 }],
  })
  assert.deepEqual(buildCartCalculatePayload([cartSelection]), {
    skuList: [{ mcdsId: 'spec-1', skuCount: 1 }, { mcdsId: 'spec-1', skuCount: 1 }], operationType: 0, source: 1,
  })
  assert.throws(() => buildCartCalculatePayload([{ ...cartSelection, number: 10 }, { ...cartSelection, specId: 'spec-2', preSubmitInstId: 'pre-2', number: 1 }]), /不能超过 10 件/)
  const cartCalculation: AigouCartCalculateResult = {
    success: true,
    resultCode: '0',
    message: 'success',
    response: { resultCode: 0, msg: 'success' },
    data: { totalPrice: 2000, discountsPrice: 1800, discountsHow: 200, skuList: [{ mcdsId: 'spec-1', skuCount: 2, discountPrice: 1800 }] },
  }
  assert.deepEqual(buildCartSmsPayload([cartSelection], cartCalculation), {
    shoppingCartSkuList: [{ mcdsId: 'spec-1', count: 2 }], digitalBean: 0, calculateFlag: '1', businessChannelCode: 'P00000011939',
  })
  const cartOrderPayload = buildCartOrderPayload({ items: [cartSelection], calculation: cartCalculation, payType: 1, smsCode: '123456', busiOpId: 'M0001', operDfp: 'browser-dfp' })
  assert.equal(cartOrderPayload.basePayAmount, 1800)
  assert.equal(cartOrderPayload.shoppingCartId, 'cart-1')
  assert.equal((cartOrderPayload.shoppingCartSkuList as Array<Record<string, unknown>>)[0].preSubmitInstId, 'pre-1')
  assert.deepEqual(sanitizeAigouCartResponse({ phone: '13800138000', randomPwd: 'secret', resultCode: -490, data: { risk: true, explain: 'SCORE_REFUSE' } }), {
    resultCode: -490, data: { explain: 'SCORE_REFUSE' },
  })
  const normalizedCart = aigouCartTest.normalizeCartList({
    resultCode: 0,
    msg: 'success',
    data: { shoppingCartId: 'cart-1', aggregationShoppingCartItemList: [{ offerInfoList: [{ preSubmitInstId: 'pre-1', specId: 'spec-1', offerName: '测试权益', number: '2', busiType: 'C3', checkResult: '0', discountPrice: '1800', payMode: '1,2' }] }] },
  })
  assert.equal(normalizedCart.success, true)
  assert.deepEqual(normalizedCart.data?.items[0].payMode, ['1', '2'])
  assert.equal(normalizedCart.data?.items[0].number, 2)
  const batchCartClient = new AigouShoppingCartClient({
    cookie: 'session=value', token: 'encrypted-mobile', refreshToken: 'refresh-token', loginUrl: 'https://dev.coc.10086.cn/coc3/example',
  })
  let batchAddIndex = 0
  ;(batchCartClient as unknown as { request: () => Promise<Record<string, unknown>> }).request = async () => {
    batchAddIndex += 1
    return batchAddIndex === 1
      ? { resultCode: 0, msg: 'success', data: null }
      : { resultCode: -9, msg: '加车被上游拒绝', data: { reason: 'LIMIT' } }
  }
  const partialBatch = await batchCartClient.addAll(cartableCatalog.slice(0, 2).map((item) => item.id))
  assert.equal(partialBatch.success, false)
  assert.equal(partialBatch.succeeded, 1)
  assert.equal(partialBatch.failed, 1)
  assert.equal(partialBatch.results[1].message, '加车被上游拒绝')
  assert.deepEqual(partialBatch.results[1].response, { resultCode: -9, msg: '加车被上游拒绝', data: { reason: 'LIMIT' } })

  const starbucks = normalizeAigouProductInput({ skuId: '100000098326' })
  assert.equal(aigouPackageOrderTest.packageReferer(starbucks), 'https://dev.coc.10086.cn/coc/canvas/package-h5-canvas/online/xbklhhy?pageId=1878635095121567744&channelId=P00000132000')
  assert.equal(aigouPackageOrderTest.reverseBase64('13800138000'), '=ADMwgzMxADM4MTM')
  const packagePayload = aigouPackageOrderTest.packageBookProductPayload(starbucks, '13800138000', '123456', 'user-1')
  assert.equal(packagePayload.productCode, '100000098326')
  assert.equal(packagePayload.protocolSequenceId, '2071296758389432320')
  assert.equal(packagePayload.userId, 'user-1')
  assert.equal(packagePayload.digest, crypto.createHash('md5').update(`13800138000coc${packagePayload.mobile}`).digest('hex'))

  const broadbandKey = '0123456789abcdef'
  const broadbandPlaintext = JSON.stringify({ PACKAGECODE: 'AJ', count: 2 })
  assert.equal(
    broadbandPortalTest.aesEcbDecrypt(broadbandPortalTest.aesEcbEncrypt(broadbandPlaintext, broadbandKey), broadbandKey),
    broadbandPlaintext,
  )
  assert.equal(broadbandPortalTest.readWafToken('https://service.bj.10086.cn/nwt/portal/kdzq?XEbtxIBt=abc%2B123'), 'abc+123')
  assert.deepEqual(broadbandPortalTest.queryString({ bandwidth: 300, couponCode: '', enabled: true }), 'bandwidth=300&enabled=true')
  const broadbandPortalSession = broadbandPortalTest.createBroadbandPortalSession('sid=test', 'install', 'token-for-test')
  assert.equal(broadbandPortalSession.accessToken, 'token-for-test')
  assert.equal(broadbandPortalSession.referer.endsWith('/nwt/portal/kdzq'), true)
  const qqtBroadbandPortalSession = broadbandPortalTest.createBroadbandPortalSession(
    'sid=test',
    'install',
    'token-for-test',
    '/nwt/portal/qqtzxBroadbandOrder',
  )
  assert.equal(qqtBroadbandPortalSession.referer.endsWith('/nwt/portal/qqtzxBroadbandOrder'), true)
  assert.deepEqual(qqtPremiumBroadbandTest.extractQqtBroadbandGears({
    data: {
      products: [
        { gearId: 'QQT-24', gearName: '全球通等级尊享宽带（两年）套餐' },
        { itemCode: 'QQT-24', name: '重复档位' },
      ],
    },
  }), [{ itemCode: 'QQT-24', name: '全球通等级尊享宽带（两年）套餐' }])
  assert.equal(qqtPremiumBroadbandTest.interpretQqtBroadbandCheck({
    ok: true,
    status: 200,
    raw: { code: 'success', data: { message: 'Y', isRealName: 'Y', isBlack: 'N' } },
  }).eligible, true)
  assert.equal(qqtPremiumBroadbandTest.interpretQqtBroadbandCheck({
    ok: true,
    status: 200,
    raw: { code: 'success', data: { message: '活动资格不匹配', isRealName: 'Y', isBlack: 'N' } },
  }).eligible, false)
  assert.deepEqual(qqtPremiumBroadbandTest.sanitizeQqtBroadbandResponse({
    code: 'failed',
    message: '联系电话13800138000',
    token: 'secret',
    address: '测试地址',
    name: '测试姓名',
  }), { code: 'failed', message: '联系电话138****8000' })
  const qqtBroadbandSubmission = qqtPremiumBroadbandTest.validateSubmission({
    itemCode: 'browser-tampered-code',
    ownerName: '测试用户',
    identityNumber: '',
    district: '海淀区',
    address: '测试路1号',
    contactPhone: '13800138000',
    installDate: '2099-01-01',
    timeSlot: '4',
  })
  assert.equal(qqtBroadbandSubmission.timeSlot, '4')
  assert.equal(qqtBroadbandSubmission.district, '海淀区')
  assert.equal(qqtPremiumBroadbandTest.PREMIUM_BROADBAND_ITEM_CODE, '111602058352')
  assert.equal(qqtBroadbandSubmission.itemCode, '111602058352')
  const qqtBroadbandSource = await fs.readFile(new URL('../services/qqtPremiumBroadbandOrder.ts', import.meta.url), 'utf8')
  assert.equal(qqtBroadbandSource.includes('getAccountCookie'), false)
  assert.ok(qqtBroadbandSource.includes('readAuthenticatedBmccActivityOrderContext'))
  assert.ok(qqtBroadbandSource.includes("requestBmccPremiumBroadband"))
  const qqtBroadbandRouteSource = await fs.readFile(new URL('../routes/qqtPremiumBroadbandOrders.ts', import.meta.url), 'utf8')
  assert.ok(qqtBroadbandRouteSource.includes('loginSessionId'))
  assert.equal(qqtBroadbandRouteSource.includes('req.body?.itemCode'), false)
  assert.ok(qqtBroadbandRouteSource.includes('BMCC_LOGIN_REQUIRED'))
  const broadbandRouteSource = await fs.readFile(new URL('../routes/broadbandOrders.ts', import.meta.url), 'utf8')
  assert.ok(broadbandRouteSource.includes('req.body?.replaceFields === true'))

  assert.deepEqual(
    broadbandConfigTest.validateBroadbandConfig({
      configKey: 'custom-install-1',
      flowType: 'install',
      operationMode: 'install',
      displayName: '自定义新装产品',
      category: 'CUSTOM',
      fields: { query: { PACKAGECODE: 'AJ' }, selection: {}, commit: {} },
    }),
    {
      configKey: 'custom-install-1',
      flowType: 'install',
      operationMode: 'install',
      displayName: '自定义新装产品',
      description: '',
      category: 'CUSTOM',
      fields: { query: { PACKAGECODE: 'AJ' }, selection: {}, commit: {} },
    },
  )
  assert.throws(() => broadbandConfigTest.validateBroadbandConfig({
    configKey: 'bad',
    flowType: 'install',
    operationMode: 'renewal_aj',
    displayName: '错误配置',
    fields: {},
  }), /业务类型与提交模式不匹配/)
  const projectedInstall = broadbandConfigTest.projectBroadbandConfig({
    id: 'builtin:renewal-test',
    configKey: 'renewal-test',
    flowType: 'renewal',
    operationMode: 'renewal_aj',
    displayName: '云宽带测试档',
    description: '测试',
    category: 'YUNKD',
    fields: { businessInfo: { busiSelect: 'ykd-test' } },
    source: 'builtin',
    editable: false,
  }, 'install')
  assert.equal(projectedInstall.flowType, 'install')
  assert.equal(projectedInstall.attemptedFromFlow, 'renewal')
  assert.equal((projectedInstall.fields.selection as Record<string, unknown>).OFFER_ID, 'ykd-test')
  const projectedRenewal = broadbandConfigTest.projectBroadbandConfig({
    id: 'runtime:install:test',
    configKey: 'install-test',
    flowType: 'install',
    operationMode: 'install',
    displayName: '爱家新装测试档',
    description: '测试',
    category: 'AJ',
    fields: { selection: { OFFER_ID: 'aj-test', PITEMSHOWCODE: 'item-test' } },
    source: 'runtime',
    editable: false,
  }, 'renewal')
  assert.equal(projectedRenewal.operationMode, 'renewal_aj')
  assert.equal(projectedRenewal.attemptedFromFlow, 'install')
  assert.equal((projectedRenewal.fields.businessInfo as Record<string, unknown>).busiSelect, 'aj-test')

  assert.deepEqual(
    broadbandOrderTest.deepMerge({ businessInfo: { offerId: 'A', keep: '1' } }, { businessInfo: { offerId: 'B' } }),
    { businessInfo: { offerId: 'B', keep: '1' } },
  )
  assert.equal(broadbandOrderTest.maskAccount('1234567890'), '******7890')
  assert.equal(broadbandOrderTest.detectImageMime(Buffer.from([0xff, 0xd8, 0xff, 0x00])), 'image/jpeg')
  assert.equal(broadbandOrderTest.detectImageMime(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), 'image/png')
  assert.equal(broadbandOrderTest.detectImageMime(Buffer.from('GIF89a', 'ascii')), 'image/gif')
  assert.equal(broadbandOrderTest.detectImageMime(Buffer.from('RIFF0000WEBP', 'ascii')), 'image/webp')
  assert.equal(broadbandOrderTest.detectImageMime(Buffer.from('<html>error</html>')), undefined)
  assert.equal(broadbandOrderTest.eligibilityResponse({ ok: true, status: 200, data: null }), '')
  assert.equal(broadbandOrderTest.eligibilityResponse({ ok: true, status: 200, data: 'BALANCE,100,200' }), 'BALANCE,100,200')
  assert.equal(broadbandOrderTest.eligibilityResponse({ ok: true, status: 200, data: { message: 'login' } }), 'login')
  assert.deepEqual(
    broadbandOrderTest.installCommitFields({
      query: { PACKAGECODE: 'AJ' },
      selection: { PITEMSHOWCODE: 'ITEM' },
      runtimeProduct: { privateContext: 'ignored' },
      commit: { userName: '测试用户' },
      customTopLevel: 'kept',
    }),
    { userName: '测试用户', customTopLevel: 'kept' },
  )
  assert.deepEqual(
    broadbandOrderTest.installPreparedFields({ resType: 'success', message: 'ok', OFFER_ID: 'offer-1', PACKAGECODE: 'AJ' }),
    { OFFER_ID: 'offer-1', PACKAGECODE: 'AJ' },
  )
  assert.deepEqual(
    broadbandOrderTest.renewalOrderFields({ businessInfo: { offerId: 'offer-1' }, runtimeProduct: { identity: 'ignored' } }),
    { businessInfo: { offerId: 'offer-1' } },
  )
  const runtimeBroadband = broadbandOrderTest.runtimeRenewalProduct({ offerId: 'offer-1', offerName: '300M 单宽带', payFee: '12000' }, 'DKKD')
  assert.equal(runtimeBroadband.operationMode, 'renewal_single')
  assert.equal(runtimeBroadband.displayName, '300M 单宽带')
  assert.equal(broadbandOrderTest.normalizeInstallResult({ resType: 'successOld' }).success, true)
  assert.equal(broadbandOrderTest.normalizeInstallResult({ resType: 'showbljg' }).uncertain, true)
  assert.equal(broadbandOrderTest.normalizeRenewalResult({ resType: 'REDIRECT_URL', redirectPage: 'https://service.bj.10086.cn/pay' }, 'renewal_aj').paymentRequired, true)

  const cachedPhone = '13800138000'
  const manualCacheKey = bmccActivityLoginCacheTest.cacheKey(undefined, cachedPhone)
  const accountCacheKey = bmccActivityLoginCacheTest.cacheKey('account-1', cachedPhone)
  assert.match(manualCacheKey, /^manual:[a-f0-9]{64}$/)
  assert.equal(manualCacheKey.includes(cachedPhone), false)
  assert.equal(accountCacheKey, 'account:account-1')
  assert.equal(bmccActivityLoginCacheTest.phoneHash(cachedPhone).includes(cachedPhone), false)
  assert.equal(bmccActivityOrderTest.normalizeBmccOrderSmsCode('123456', 'OTHER'), '123456')
  assert.equal(bmccActivityOrderTest.normalizeBmccOrderSmsCode('12345678', 'JFBXHY'), '123458')
  assert.throws(() => bmccActivityOrderTest.normalizeBmccOrderSmsCode('12345678', 'OTHER'), /6 位短信验证码/)
  assert.throws(() => bmccActivityOrderTest.normalizeBmccOrderSmsCode('1234567', 'JFBXHY'), /8 位验证密码/)

  const bmccRouteSource = await fs.readFile(new URL('../routes/bmccActivityOrder.ts', import.meta.url), 'utf8')
  assert.ok(bmccRouteSource.includes("router.post('/sessions/restore'"))
  assert.ok(bmccRouteSource.includes("router.put('/sessions/:id/order-config'"))
  assert.ok(bmccRouteSource.includes('createOrRestoreBmccActivityOrderSession'))
  assert.ok(bmccRouteSource.includes('cacheBmccActivityOrderLogin(id)'))
  assert.ok(bmccRouteSource.includes('updateBmccActivityOrderRequest(id, config)'))

  assert.deepEqual(
    bmccActivityOrderTest.resolveBmccActivityConfig({ activityName: 'VPzD4o4vvy' }),
    {
      activityName: 'VPzD4o4vvy',
      displayName: '5GA 加速服务',
      proType: 'QQTJSFF',
      packageId: '55412',
      packageCode: 'QQTJSFF',
      productShowCode: 'G_QQTJSFF_0_0',
      pitemShowCode: 'KT',
    },
  )
  assert.throws(
    () => bmccActivityOrderTest.resolveBmccActivityConfig({ activityName: 'UNKNOWN_ACTIVITY' }),
    /packageId格式不正确/,
  )
  const aiBeanRenew = bmccActivityOrderTest.activityPresets.find((item) => item.activityName === 'bounsPoints_XY')
  const aiBeanCancel = bmccActivityOrderTest.activityPresets.find((item) => item.activityName === 'bounsPoints_BXY')
  const flyCard8 = bmccActivityOrderTest.activityPresets.find((item) => item.activityName === 'flyCard8_8TC')
  assert.deepEqual(
    aiBeanRenew,
    {
      activityName: 'bounsPoints_XY',
      displayName: 'AI豆倍享合约（到期自动续约）',
      packageName: 'AI豆倍享合约',
      packageId: '2840305334',
      packageCode: 'JFBXHY',
      productShowCode: 'G_JFBXHY',
      productShowName: '积分倍享合约',
      productSendUrl: '',
      pitemShowCode: 'XY',
      pitemShowName: '合约',
      pitemSendUrl: '',
      activityUrl: 'https://service.bj.10086.cn/nwt/portal/bounsPoints',
    },
  )
  assert.deepEqual(
    aiBeanCancel,
    {
      activityName: 'bounsPoints_BXY',
      displayName: 'AI豆倍享合约（到期自动取消）',
      packageName: 'AI豆倍享合约',
      packageId: '2840305334',
      packageCode: 'JFBXHY',
      productShowCode: 'G_JFBXHY',
      productShowName: '积分倍享合约',
      productSendUrl: '',
      pitemShowCode: 'BXY',
      pitemShowName: '合约',
      pitemSendUrl: '',
      activityUrl: 'https://service.bj.10086.cn/nwt/portal/bounsPoints',
    },
  )
  assert.deepEqual(
    flyCard8,
    {
      activityName: 'flyCard8_8TC',
      displayName: '8元4G飞享卡',
      packageName: '8元4G飞享卡',
      packageId: '529',
      packageCode: '4GFXTC',
      productShowCode: 'fxtcsb',
      productShowName: '4G飞享套餐升级版',
      pitemShowCode: '8TC',
      pitemShowName: '套餐',
      activityUrl: 'https://service.bj.10086.cn/m/jsp/2025Mobile/8y4g/index.jsp',
    },
  )
  const resolvedAiBeanRenew = bmccActivityOrderTest.resolveBmccActivityConfig({ activityName: 'bounsPoints_XY' })
  const resolvedAiBeanCancel = bmccActivityOrderTest.resolveBmccActivityConfig({ activityName: 'bounsPoints_BXY' })
  const resolvedFlyCard8 = bmccActivityOrderTest.resolveBmccActivityConfig({ activityName: 'flyCard8_8TC' })
  assert.equal(resolvedAiBeanRenew.proType, undefined)
  assert.equal(resolvedAiBeanRenew.productShowCode, 'G_JFBXHY')
  assert.equal(resolvedAiBeanRenew.pitemShowCode, 'XY')
  assert.equal(resolvedAiBeanCancel.proType, undefined)
  assert.equal(bmccActivityOrderTest.remoteOrderConfig(resolvedAiBeanCancel).pitemShowCode, 'BXY')
  assert.deepEqual(
    bmccActivityOrderTest.remoteOrderConfig(resolvedFlyCard8),
    {
      activityName: '8元4G飞享卡 (flyCard8_8TC)',
      packageId: '529',
      packageCode: '4GFXTC',
      packageName: '8元4G飞享卡',
      productShowCode: 'fxtcsb',
      productShowName: '4G飞享套餐升级版',
      productSendUrl: '',
      pitemShowCode: '8TC',
      pitemShowName: '套餐',
      pitemSendUrl: '',
      mtOtherParams: '',
      prodValue: '',
    },
  )
  assert.throws(
    () => bmccActivityOrderTest.resolveBmccActivityConfig({
      activityName: 'FIXED_WITHOUT_PRODUCT',
      displayName: '缺少资源编码',
      packageId: '1',
      packageCode: 'A',
      pitemShowCode: 'KT',
    }),
    /proType 或 productShowCode 至少填写一项/,
  )
  assert.deepEqual(
    bmccActivityOrderTest.remoteOrderConfig(resolvedAiBeanRenew),
    {
      activityName: 'AI豆倍享合约（到期自动续约） (bounsPoints_XY)',
      packageId: '2840305334',
      packageCode: 'JFBXHY',
      packageName: 'AI豆倍享合约',
      productShowCode: 'G_JFBXHY',
      productShowName: '积分倍享合约',
      productSendUrl: '',
      pitemShowCode: 'XY',
      pitemShowName: '合约',
      pitemSendUrl: '',
      mtOtherParams: '',
      prodValue: '',
    },
  )
  const aiBeanInfo = bmccActivityOrderTest.fixedBmccActivityInfo(resolvedAiBeanRenew)
  assert.equal(aiBeanInfo.resultCode, 'JSP_SOURCE')
  assert.equal(aiBeanInfo.canAttempt, true)
  assert.equal(aiBeanInfo.details.renewalPolicy, '合约到期后按相同规则自动续约一次')
  assert.match(aiBeanInfo.message, /最终是否受理由运营商接口实时决定/)
  const flyCardInfo = bmccActivityOrderTest.fixedBmccActivityInfo(resolvedFlyCard8)
  assert.equal(flyCardInfo.resultCode, 'JSP_FIXED_CONFIG')
  assert.equal(flyCardInfo.canAttempt, true)
  assert.equal(flyCardInfo.details.planCode, '24BJ201078')
  assert.equal(flyCardInfo.details.monthlyFee, '8元/月')
  assert.throws(
    () => bmccActivityOrderTest.resolveBmccActivityConfig({
      activityName: 'A', proType: 'A', packageId: '1', packageCode: 'A', activityUrl: 'https://example.com/a',
    }),
    /仅支持北京移动官方 HTTPS 地址/,
  )
  assert.deepEqual(
    bmccActivityOrderTest.sanitizeBmccActivityInfo({
      eligible: true,
      alreadyOrdered: false,
      message: '活动信息读取成功',
      activityInfo: {
        resultCode: '00',
        productName: '5GA 加速服务',
        mobile: '13800138000',
        accessToken: 'secret-token',
        typeKey: 'secret-key',
        raw: {
          productCode: 'G_QQTJSFF_0_0',
          cookie: 'secret-cookie',
          offers: [{ name: '加速包', fee: 0, accessToken: 'nested-secret' }],
        },
      },
    }),
    {
      resultCode: '00',
      eligible: true,
      alreadyOrdered: false,
      canAttempt: true,
      message: '活动信息读取成功',
      details: {
        productCode: 'G_QQTJSFF_0_0',
        offers: [{ name: '加速包', fee: 0 }],
        resultCode: '00',
        productName: '5GA 加速服务',
      },
    },
  )
  assert.equal(bmccActivityOrderTest.canAccessBmccActivityOrderSession('user:1', 'user:1'), true)
  assert.equal(bmccActivityOrderTest.canAccessBmccActivityOrderSession('user:1', 'user:2'), false)
  assert.equal(bmccActivityOrderTest.canAccessBmccActivityOrderSession('user:1', 'admin'), true)

  const tasksRouteSource = await fs.readFile(new URL('../routes/tasks.ts', import.meta.url), 'utf8')
  assert.ok(tasksRouteSource.includes("router.post('/global-telecom-resign'"))
  assert.ok(tasksRouteSource.includes("startTask(req, res, 'global_telecom_resign')"))
  assert.deepEqual(
    globalTelecomTest.parseJson('"{\\"status\\":\\"1\\",\\"data\\":{\\"userLevel\\":\\"4\\"}}"'),
    { status: '1', data: { userLevel: '4' } },
  )
  assert.deepEqual(
    globalTelecomTest.normalizeXdr({
      status: '1',
      data: { enjoycollectabletimes: '2', freeEnjoy: 1, enjoy: 3, prodList: [3913, '3458', 0] },
    }),
    { availableCount: 2, freeCount: 1, paidCount: 3, claimedProductIds: [3913, 3458] },
  )
  const normalizedSign = globalTelecomTest.normalizeSign({
    status: '1',
    data: {
      reSignNum: 3,
      signDates: [{
        dayNum: 4,
        signStatus: 2,
        task: [
          { taskId: 1, taskStatus: 0 },
          { taskId: 2, taskStatus: 1 },
          { taskId: 3, taskStatus: 0 },
        ],
        newPrize: { prizeId: '3908', prizeName: '家庭意外保障', prizeStatus: 0 },
      }],
    },
  })
  assert.equal(normalizedSign.reSignRemaining, 3)
  assert.deepEqual(normalizedSign.days[0]?.tasks, [
    { taskId: 1, taskStatus: 0 },
    { taskId: 2, taskStatus: 1 },
    { taskId: 3, taskStatus: 0 },
  ])
  assert.equal(normalizedSign.days[0]?.prize?.prizeName, '家庭意外保障')
  assert.deepEqual(globalTelecomTest.normalizeSign({ status: '1', data: {
    reSignNum: '1', signDates: [{ dayNum: '2', signStatus: '2', reSign: 'false', task: { taskId: '3', taskStatus: '0' } }],
  } }).days[0], { dayNum: 2, signStatus: 2, reSign: false, tasks: [{ taskId: 3, taskStatus: 0 }] })
  for (const badSign of [
    { status: '0', msg: '活动火爆' },
    { status: '1', data: {} },
    { status: '1', data: { reSignNum: 1, signDates: [] } },
    { status: '1', data: { signDates: [{ dayNum: 1, signStatus: 2 }] } },
    { status: '1', data: { reSignNum: 1, signDates: [{ dayNum: 1, signStatus: null }] } },
    { status: '1', data: { reSignNum: 1, signDates: [{ dayNum: 1, signStatus: 2, task: { taskId: 1 } }] } },
  ]) assert.throws(() => globalTelecomTest.normalizeSign(badSign))
  assert.throws(() => globalTelecomTest.normalizeBlindBox({ status: '0', msg: '失败' }, undefined))
  assert.throws(() => globalTelecomTest.normalizeBlindBox({ status: '1', data: {} }, undefined))
  assert.throws(() => globalTelecomTest.normalizeBlindBox({ status: '1', data: { tasks: [{ number: 1 }] } }, undefined))
  assert.deepEqual(globalTelecomTest.normalizeBlindBox({ status: '1', data: { drawTotal: 0, drawUsed: 0, drawRemain: 0, tasks: [
    { number: 1, flag: false }, { number: 2, flag: 'false' }, { number: 3, flag: 'true' },
  ] } }, undefined).tasks.map((task) => task.completed), [false, false, true])
  const normalizedGrowth = globalTelecomTest.normalizeGrowth(
    { gsmState: '4', userChinaMobileage: '2年4月' },
    {
      year: '2026',
      gsmNext: '钻石卡',
      consumptionTotal: '4163',
      consumptionRequired: '3720',
      consumptionRe: '-443',
      growthValueSwitch: '1',
      transactionDetails: [{ month: '202601', bill: '3227' }],
      gsmList: [{ name: '普卡', value: '1080' }, { name: '卓越钻石卡', value: '特邀升级' }],
    },
  )
  assert.equal(normalizedGrowth.annualGrowthValue, 4163)
  assert.equal(normalizedGrowth.nextLevelGrowthValue, 3720)
  assert.equal(normalizedGrowth.remainingGrowthValue, -443)
  assert.deepEqual(normalizedGrowth.monthlyGrowthValues[0], { month: '202601', value: 3227, rawValue: '3227' })
  assert.equal(normalizedGrowth.levels[1]?.value, undefined)
  const overviewForSnapshot = {
    refreshedAt: '2026-08-07T06:00:00.000Z',
    accessToken: 'must-not-be-persisted',
    ...({ sessionCookie: 'must-not-be-persisted' } as Record<string, unknown>),
    cache: {
      status: 'live' as const,
      expiresAt: '2026-08-07T06:01:00.000Z',
      retryAfterSeconds: 60,
    },
    identity: { levelCode: '4', levelName: '钻石卡', netAge: '11年3个月' },
    xdr: { availableCount: 0, freeCount: 1, paidCount: 0, claimedProductIds: [3913] },
    sign: { reSignRemaining: 2, days: normalizedSign.days },
    blindBox: { drawTotal: 1, drawUsed: 0, drawRemaining: 1, tasks: [], prizes: [] },
    growth: normalizedGrowth,
    errors: {},
  }
  const overviewSnapshot = globalTelecomTest.createGlobalTelecomOverviewSnapshot(overviewForSnapshot)
  const serializedSnapshot = JSON.stringify(overviewSnapshot)
  assert.equal(serializedSnapshot.includes('must-not-be-persisted'), false)
  assert.equal(serializedSnapshot.includes('accessToken'), false)
  assert.equal(serializedSnapshot.includes('sessionCookie'), false)
  const restoredOverview = globalTelecomTest.readGlobalTelecomOverviewSnapshot(
    { globalTelecomOverview: overviewSnapshot },
    { now: Date.parse('2026-08-07T07:00:00.000Z') },
  )
  assert.equal(restoredOverview?.cache.status, 'persistent-cache')
  assert.equal(restoredOverview?.growth?.annualGrowthValue, 4163)
  assert.equal(
    globalTelecomTest.readGlobalTelecomOverviewSnapshot(
      { globalTelecomOverview: overviewSnapshot },
      { now: Date.parse('2026-08-09T07:00:00.000Z') },
    ),
    undefined,
  )
  const mergedOverview = globalTelecomTest.mergeGlobalTelecomOverview(restoredOverview, {
    ...overviewForSnapshot,
    refreshedAt: '2026-08-07T07:05:00.000Z',
    growth: undefined,
    errors: { growth: '无用户信息' },
  })
  assert.equal(mergedOverview.growth?.annualGrowthValue, 4163)
  assert.match(mergedOverview.errors.growth || '', /当前展示最近成功数据/)
  assert.equal(globalTelecomTest.shouldRetryGrowth(new Error('无用户信息')), true)
  assert.equal(globalTelecomTest.shouldRetryGrowth(new Error('GSM 网关 HTTP 502')), false)
  assert.throws(
    () => globalTelecomTest.assertQqtSuccess({ status: '0', msg: '请先登录' }),
    /请先登录/,
  )
  assert.doesNotThrow(() => globalTelecomTest.assertQqtSuccess({ status: '0', data: {} }))
  assert.equal(globalTelecomTest.shouldRetryPreparedSession(new Error('access_token 已失效')), true)
  assert.equal(globalTelecomTest.shouldRetryPreparedSession(new Error('请先登录后重试')), true)
  assert.equal(globalTelecomTest.shouldRetryPreparedSession(new Error('上游 HTTP 502')), false)
  assert.equal(
    qqtTest.extractQqtAccessToken({ setCookie: ['access_token=cached-token; Path=/; HttpOnly'] }),
    'cached-token',
  )
  assert.equal(
    qqtTest.extractQqtAccessToken({ location: '/index?access_token=redirect-token' }),
    'redirect-token',
  )
  assert.equal(
    qqtTest.extractQqtAccessToken({ bodyText: '{"data":{"accessToken":"body-token"}}' }),
    'body-token',
  )

  assert.equal(
    qqtTest.safeQqtSsoUrl(
      'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/new/ssoTokenLogin.action?token=sso-ticket&backUrl=https%3A%2F%2Fqqt.cmicrwx.cn%2Findex.html',
    ),
    'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/new/ssoTokenLogin.action?token=sso-ticket&backUrl=https%3A%2F%2Fqqt.cmicrwx.cn%2Findex.html',
  )
  assert.equal(
    qqtTest.safeQqtSsoUrl(
      'https://qqt.cmicrwx.cn.evil.example/2016tyjf/xhmqqthy/new/ssoTokenLogin.action?token=sso-ticket',
    ),
    undefined,
  )
  assert.equal(
    qqtTest.safeQqtSsoUrl(
      'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/new/ssoTokenLogin.action',
    ),
    undefined,
  )
  assert.deepEqual(globalTelecomTest.classifyGlobalTelecomFailure(new Error('access_token 已失效')), {
    status: 401,
    message: 'access_token 已失效',
    errorCode: 'GLOBAL_TELECOM_AUTH_INVALID',
  })
  assert.deepEqual(globalTelecomTest.classifyGlobalTelecomFailure(new Error('全球通上游 HTTP 502')), {
    status: 502,
    message: '全球通上游 HTTP 502',
    errorCode: 'GLOBAL_TELECOM_UPSTREAM_ERROR',
  })
  assert.deepEqual(globalTelecomTest.classifyGlobalTelecomFailure(new Error('请求过于频繁，请稍后再试')), {
    status: 429,
    message: '请求过于频繁，请稍后再试',
    errorCode: 'GLOBAL_TELECOM_RATE_LIMIT',
    retryAfterSeconds: 60,
  })

  const beijingChatUrl = resolveGlobalTelecomCustomerServiceChatUrl('北京市')
  assert.ok(beijingChatUrl)
  const parsedBeijingChat = new URL(beijingChatUrl)
  assert.equal(parsedBeijingChat.hostname, 'wx.10086.cn')
  assert.equal(parsedBeijingChat.pathname, '/website/zxkf/h5new/index.html')
  assert.equal(parsedBeijingChat.searchParams.get('zxkfCode'), '100')
  assert.equal(resolveGlobalTelecomCustomerServiceChatUrl('河北'), undefined)
  const customerServiceEntry = resolveGlobalTelecomCustomerServiceEntryUrl('北京市')
  assert.equal(
    customerServiceEntry,
    'https://dx.10086.cn/A/0eNjy26j',
  )
  assert.equal(safeGlobalTelecomCustomerServiceEntryUrl(customerServiceEntry || ''), customerServiceEntry)
  assert.equal(safeGlobalTelecomCustomerServiceEntryUrl('https://dx.10086.cn.evil.example/A/0eNjy26j'), undefined)
  assert.equal(resolveGlobalTelecomCustomerServiceEntryUrl('河北'), undefined)
  const aigouEntryUrl = new URL(buildAigouSsoEntryUrl())
  assert.equal(aigouEntryUrl.hostname, 'wx.10086.cn')
  assert.equal(aigouEntryUrl.searchParams.get('netUniChannelId'), '056002')
  const aigouBackUrl = new URL(aigouEntryUrl.searchParams.get('netUniBackUrl') || '')
  assert.equal(aigouBackUrl.hostname, 'dev.coc.10086.cn')
  assert.equal(aigouBackUrl.searchParams.get('channelCode'), 'P00000011455')
  assert.equal(
    aigouTest.safeAigouLoginUrl(
      'https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/wdqy?channelCode=P00000011455&token=ticket',
    ),
    'https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/wdqy?channelCode=P00000011455&token=ticket',
  )
  assert.equal(
    aigouTest.safeAigouLoginUrl(
      'https://dev.coc.10086.cn.evil.example/coc3/canvas/rightsmarket-h5-canvas/online/wdqy?channelCode=P00000011455&token=ticket',
    ),
    undefined,
  )
  assert.equal(
    aigouTest.safeAigouLoginUrl(
      'https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/wdqy?channelCode=P00000011455',
    ),
    undefined,
  )
  assert.equal(
    cmccHttpTest.redactHeaders({ phone: 'aigou-token-value' }).phone,
    '[redacted:17]',
  )
  assert.deepEqual(luckyThreeDayTest.productUiState(0, 5, 0), {
    state: 'not_started',
    actionLabel: '即将开始',
    actionable: false,
  })
  assert.deepEqual(luckyThreeDayTest.productUiState(1, 5, 0), {
    state: 'available',
    actionLabel: '立即抢购',
    actionable: true,
  })
  assert.equal(luckyThreeDayTest.productUiState(1, 0, 0).state, 'sold_out')
  assert.equal(luckyThreeDayTest.productUiState(1, 5, 17, 'https://10086.cn/use').state, 'claimed')
  assert.equal(
    luckyThreeDayTest.encryptSmsSkuId(84633, 1785844638000),
    'WSWOU1HWidlovhUb3BSrrQwjkZdoQwnYNzBcZ2kCghc=',
  )
  const luckySign = luckyThreeDayTest.normalizeSignInfo({
    resultCode: 0,
    data: {
      taskId: 2999,
      accumulateCount: 1,
      pushStatus: 0,
      signToday: false,
      limitCount: false,
      skuList: [{ signDays: 2, skuId: 88207, awardName: '第二日奖励', awardPicUrls: ['https://res.coc.10086.cn/reward.png'], hasRemainCount: 1 }],
    },
  })
  assert.equal(luckySign.accumulateCount, 1)
  assert.equal(luckySign.rewards[0].hasRemainCount, true)
  const luckyActivity = luckyThreeDayTest.normalizeActivity({
    code: '0',
    data: {
      id: 17453,
      name: '幸运三日签',
      startTime: 1784649600,
      endTime: 1790783999,
      repeatable: 0,
      subActivityList: [{
        id: 37747,
        activityStatus: 1,
        startTime: 1785808800000,
        goodsList: [{ aid: 17453, abatchId: 37747, mid: 1916, skuid: 84633, showName: '100元话费兑换券', availableNum: 5, num: 5, joinStatus: 0 }],
      }],
    },
  })
  assert.equal(luckyActivity.batches[0].products[0].actionable, true)
  assert.equal(luckyActivity.batches[0].products[0].upstreamActionable, true)
  assert.equal(luckyActivity.batches[0].products[0].attemptable, true)
  assert.equal(luckyActivity.batches[0].products[0].batchId, 37747)
  const overriddenLuckyActivity = luckyOverrideTest.applyLuckyBenefitOverrides(luckyActivity, [{
    activityId: 17453,
    batchId: 37747,
    skuId: 84633,
    attemptable: false,
    inventory: 99,
    updatedAt: '2026-08-04T00:00:00.000Z',
  }])
  assert.equal(overriddenLuckyActivity.batches[0].products[0].available, 99)
  assert.equal(overriddenLuckyActivity.batches[0].products[0].upstreamAvailable, 5)
  assert.equal(overriddenLuckyActivity.batches[0].products[0].attemptable, false)
  assert.equal(overriddenLuckyActivity.batches[0].products[0].actionable, false)
  assert.deepEqual(
    luckyThreeDayTest.sanitizeResponseData({ token: 'secret', mobile: '13800138000', orderId: 'order-1', nested: { smsCode: '123456', status: 'ok' } }),
    { orderId: 'order-1', nested: { status: 'ok' } },
  )
  const buildingUrl = new URL(buildCocPackageUrl('building_bricks', 'ticket'))
  assert.equal(buildingUrl.pathname, '/coc/web2/buildingBricksPak/')
  assert.equal(buildingUrl.searchParams.get('pageId'), '1610185761689767936')
  assert.equal(buildingUrl.searchParams.get('channelId'), 'P00000001555')
  assert.equal(buildingUrl.searchParams.get('token'), 'ticket')
  const diamondUrl = new URL(buildCocPackageUrl('diamond_package', 'ticket'))
  assert.equal(diamondUrl.pathname, '/coc/web6/diamondPackage/')
  assert.equal(diamondUrl.searchParams.get('pageId'), '1889216886548430848')
  assert.equal(diamondUrl.searchParams.get('channelId'), 'P00000078835')
  assert.equal(COC_PACKAGE_TARGETS.diamond_package.productCode, '1000000100290')
  assert.equal(cocPackageTest.ticketFromUrl(diamondUrl.toString()), 'ticket')
  const smartLifeUrl = new URL(buildCocPackageUrl('smart_life', 'ticket'))
  assert.equal(smartLifeUrl.pathname, '/coc/web6/szhydg/')
  assert.equal(smartLifeUrl.searchParams.get('pageId'), '1969953714210263040')
  assert.equal(smartLifeUrl.searchParams.get('channelId'), 'P00000044852')
  const fiveGaUrl = new URL(buildCocPackageUrl('five_ga', 'ticket'))
  assert.equal(fiveGaUrl.pathname, '/coc/web6/applet5gaH5/home')
  assert.equal(fiveGaUrl.searchParams.get('pageId'), '1879370128044171264')
  assert.equal(fiveGaUrl.searchParams.get('channelId'), 'P00000055499')
  const starbucksUrl = new URL(buildCocPackageUrl('starbucks_membership', 'ticket'))
  assert.equal(starbucksUrl.pathname, '/coc/canvas/package-h5-canvas/online/xbklhhy')
  assert.equal(starbucksUrl.searchParams.get('channelId'), 'P00000132000')

  assert.equal(hasCmccBusinessSessionCookie('JSESSIONID=session-only'), false)
  assert.equal(hasCmccBusinessSessionCookie('JSESSIONID=session; telNum=13800138000'), true)
  assert.equal(hasCmccBusinessSessionCookie('UID=user-id; JSESSIONID=session'), true)
  assert.equal(hasCmccBusinessSessionCookie('cmccssotoken=sso; JSESSIONID=session'), true)

  assert.equal(normalizeProductCode(' 001234 '), '001234')
  assert.deepEqual(normalizeProductCodes(['100', '100', '101']), ['100', '101'])
  assert.deepEqual(expandProductCodeRange('0098', '0101'), ['0098', '0099', '0100', '0101'])
  assert.throws(() => normalizeProductCode('12A'), /1-20 位数字/)
  assert.throws(() => expandProductCodeRange('10', '9'), /不能小于/)
  assert.throws(() => expandProductCodeRange('1', '10001'), /最多包含 10000/)
  const retailFields = retailProductTest.productFields('4888051', {
    productId: 2126865,
    productName: '测试商品',
    norms: [{ id: 'n1' }, { id: 'n2' }],
    extra: { enabled: true },
  })
  assert.equal(retailFields.productCode, '4888051')
  assert.equal(retailFields.productId, '2126865')
  assert.equal(retailFields.productName, '测试商品')
  assert.equal(retailFields.normCount, 2)
  assert.deepEqual(JSON.parse(retailFields.contentJson), {
    productId: 2126865,
    productName: '测试商品',
    norms: [{ id: 'n1' }, { id: 'n2' }],
    extra: { enabled: true },
  })
  const aurora = createCocAuroraContext()
  assert.match(aurora.key, /^[a-f0-9]{16}$/)
  assert.ok(aurora.encryptedKey.length > 300)
  const auroraCipher = cocAuroraEncrypt({ mobile: '13800138000' }, aurora.key)
  assert.deepEqual(JSON.parse(cocAuroraDecrypt(auroraCipher, aurora.key)), { mobile: '13800138000' })

  const premiumAuthPlain = {
    backUrl: '/website/businessPlatform/shopDetail?productId=2171755&productCode=15890747',
  }
  const premiumAuthCipher = premiumAuthEncrypt(premiumAuthPlain)
  assert.equal(
    premiumAuthCipher,
    'BC90D07452A32BC670559FA98CC542ADF3E945D695B92757146F58CC660057FC00F4CE71A96B283B89DC1C4DD6907CE4CEF4F9A5FEE79C5AF909507B3EA32832C23473927995F8C44D22DFDB8A31EE7CA7622F240B3535CB56A114F2389498D4',
  )
  assert.deepEqual(JSON.parse(premiumAuthDecrypt(premiumAuthCipher)), premiumAuthPlain)
  assert.equal(
    benefitOrderTest.resolvePremiumPhone(premiumAuthEncrypt('13800138000')),
    '13800138000',
  )
  assert.equal(benefitOrderTest.resolvePremiumPhone('13800138000'), '13800138000')
  assert.equal(benefitOrderTest.resolvePremiumPhone('invalid'), '')
  const premiumWirePlain = { productCode: '15890747' }
  const premiumWireCipher = premiumWireEncrypt(premiumWirePlain)
  assert.equal(premiumWireCipher, '4M7uZY8ZX6oY5XIb0jbYjw7vhpHAUXBOXbVs7RisoOE=')
  assert.deepEqual(JSON.parse(premiumWireDecrypt(premiumWireCipher)), premiumWirePlain)
  assert.deepEqual(
    benefitOrderTest.normalizeModules({
      flow: [{ goodsId: 'flow-1', productCode: 'flow-code', goodsName: '1GB', fee: '10' }],
      calls: [{ goodsId: 'voice-1', productCode: 'voice-code', goodsName: '100分钟', fee: '18' }],
    }).map((item) => [item.id, item.category, item.fee]),
    [['flow-1', 'flow', 10], ['voice-1', 'voice', 18]],
  )
  assert.equal(
    benefitOrderTest.resolveBuildingMainProductCode('500000050360', '500000050354'),
    '789000000750',
  )
  assert.equal(
    benefitOrderTest.resolveBuildingMainProductCode('500000050365', '500000050358'),
    '789000000784',
  )
  assert.deepEqual(
    benefitOrderTest.normalizeNorms({
      norms: [
        { normId: 2263288, productCode: '500000051645', name: '智臻会员999档（A版）', price: '99900' },
        { normId: 2263289, productCode: '500000051646', name: '智臻会员999档（A版）', price: '99900' },
      ],
    })[0],
    {
      id: '2263288',
      packageId: '500000051645',
      name: '智臻会员999档（A版）',
      price: 999,
      bizIntfCode: '001_JIYUN',
      productTags: '',
      candidateIds: ['2263288', '2263289'],
      variantCount: 2,
    },
  )
  assert.equal(
    benefitOrderTest.extractCocAppCookie('cmccssotoken=secret-a; User-Token=short-lived; JSESSIONID=secret-b'),
    'User-Token=short-lived',
  )
  assert.equal(benefitOrderTest.extractCocAppCookie('cmccssotoken=secret-a'), '')
  assert.deepEqual(
    benefitOrderTest.normalizeCocTariffs([
      { productCode: '500000051659', productName: '智臻会员199档（A版）', productPrice: '199' },
      { productCode: '500000051649', productName: '智臻会员399档（C版）', productPrice: '399' },
    ]).map((item) => [item.id, item.price]),
    [['500000051659', 199], ['500000051649', 399]],
  )
  assert.deepEqual(
    benefitOrderTest.resolveCocSelectedNorm([], [], {
      id: '500000059999',
      packageId: '500000059999',
      name: '自定义测试档',
      price: 299,
    }),
    {
      id: '500000059999',
      packageId: '500000059999',
      name: '自定义测试档',
      price: 299,
      bizIntfCode: '',
      productTags: '',
      candidateIds: ['500000059999'],
      variantCount: 1,
    },
  )
  assert.throws(
    () => benefitOrderTest.resolveCocSelectedNorm([], [], { id: 'invalid-code' }),
    /自定义产品编码必须为/,
  )
  assert.deepEqual(
    benefitOrderTest.normalizeFiveGaProducts({
      mainRecommend: { productCode: '500000051295', productName: '5GA 399档', productPrice: 399 },
      recommendList: [
        { productCode: '500000051294', productName: '5GA 599档', productPrice: 599 },
        { productCode: '500000051297', productName: '5GA 199档', productPrice: 199 },
      ],
    }).map((item) => item.id),
    ['500000051297', '500000051295', '500000051294'],
  )
  assert.equal(benefitOrderTest.parseRetailProtocol(null), undefined)
  assert.deepEqual(
    benefitOrderTest.parseRetailProtocol({
      backstopProtocolList: [{ protocolId: '200100574', protocolName: '办理须知', protocolContent: '<p>规则</p>' }],
    }),
    { name: '办理须知', content: '<p>规则</p>', sequenceId: undefined, protocolId: '200100574' },
  )
  assert.equal(RETAIL_PRODUCT_PRESETS.custom.productCode, '')
  assert.equal(RETAIL_PRODUCT_PRESETS.custom.effectType, 'Type_Default')
  assert.deepEqual(
    {
      mergeCode: RETAIL_PRODUCT_PRESETS.good_gifts_membership.mergeCode,
      personalPageId: RETAIL_PRODUCT_PRESETS.good_gifts_membership.personalPageId,
      pageId: RETAIL_PRODUCT_PRESETS.good_gifts_membership.sourceParams.pageid,
      pageMode: RETAIL_PRODUCT_PRESETS.good_gifts_membership.pageMode,
    },
    {
      mergeCode: '2394993',
      personalPageId: '2025100909463488702003179',
      pageId: 'bff92c1764dc4fb18b5bf03c33d9a5c5',
      pageMode: 'personal_page',
    },
  )
  assert.equal(RETAIL_PRODUCT_PRESETS.good_gifts_data.mergeCode, '4892902')
  assert.equal(RETAIL_PRODUCT_PRESETS.good_gifts_data.personalPageId, '2025101316480230602003289')
  assert.deepEqual(
    benefitOrderTest.normalizeNorms({
      norms: [{
        normId: 2237369,
        productCode: '111603016375',
        name: '好礼多多（新）20GB会员',
        price: '0',
        bizIntfCode: '100_COM',
      }],
    })[0],
    {
      id: '2237369',
      packageId: '111603016375',
      name: '好礼多多（新）20GB会员',
      price: 0,
      bizIntfCode: '100_COM',
      productTags: '',
      candidateIds: ['2237369'],
      variantCount: 1,
    },
  )
  assert.match(
    benefitOrderTest.personalPageRulesHtml({
      components: [{ popup: { keyValuePairs: [{ leftvalue: '合约期', rightvalue: '24个月' }] } }],
    }, {
      norms: [{ freedomSegments: [{ title: '温馨提示', content: '<p>立即生效</p>' }] }],
    }),
    /合约期.*24个月.*温馨提示.*立即生效/s,
  )
  assert.equal(benefitOrderTest.retailProductSaleMessage({ status: 1 }), '当前业务未处于在售状态')
  assert.equal(benefitOrderTest.retailProductSaleMessage({ status: 2, startsendTimeSpan: 2000, startSendTime: '未来' }, 1000), '商品将于 未来 开售')
  assert.equal(benefitOrderTest.retailProductSaleMessage({ status: 2, expiretimeSpan: 1000 }, 2000), '商品活动已结束')
  assert.equal(benefitOrderTest.retailProductSaleMessage({ status: 2, startsendTimeSpan: 1000, expiretimeSpan: 3000 }, 2000), '')
  assert.deepEqual(
    benefitOrderTest.parseRetailProtocol({ id: 200100574, protocolName: '业务受理协议', protocolContent: '<p>规则</p>' }),
    { name: '业务受理协议', content: '<p>规则</p>', sequenceId: undefined, protocolId: '200100574' },
  )
  assert.equal(
    benefitOrderTest.richText({ content: { html: '&lt;p&gt;分层协议&lt;/p&gt;' } }),
    '&lt;p&gt;分层协议&lt;/p&gt;',
  )
  assert.deepEqual(benefitOrderTest.optionalContractOperation(''), {})
  assert.deepEqual(benefitOrderTest.optionalContractOperation('1319080049'), { contractOperation: '&1319080049&&' })
  assert.deepEqual(benefitOrderTest.retailOrderSourceFields({
    fromRecommend: '3',
    redCode: 'red-1',
    rcm_src: 'recommend',
    agentid: 'agent-1',
    traceId: 'trace-1',
  }), {
    redCode: 'red-1',
    rcmSrc: 'recommend',
    fromRecommend: '3',
    agentid: 'agent-1',
    recommendTraceId: 'trace-1',
  })
  assert.deepEqual(
    {
      ...benefitOrderTest.resultFromRetailOrder({
        returnCode: '0',
        returnMessage: '',
        data: { orderNumber: 'order-1', bean: { orderStatusName: '办理中' } },
      }),
      completedAt: '<time>',
    },
    {
      success: true,
      accepted: true,
      uncertain: false,
      code: '0',
      message: '办理申请已提交',
      orderId: 'order-1',
      orderStatus: '办理中',
      completedAt: '<time>',
      response: {
        returnCode: '0',
        returnMessage: '',
        data: { orderNumber: 'order-1', bean: { orderStatusName: '办理中' } },
      },
    },
  )
  assert.deepEqual(
    benefitOrderTest.sanitizeOrderResponse({
      code: '0',
      mobile: '13800138000',
      smsCode: '123456',
      token: 'secret',
      data: { orderId: 'order-1', message: '号码 13800138000 已受理' },
    }),
    { code: '0', data: { orderId: 'order-1', message: '号码 138****8000 已受理' } },
  )
  const uncertainRetailOrder = benefitOrderTest.resultFromRetailOrder({ returnCode: 'A00012', data: { orderNumber: 'order-2' } })
  assert.equal(uncertainRetailOrder.accepted, true)
  assert.equal(uncertainRetailOrder.uncertain, true)
  assert.equal(uncertainRetailOrder.orderId, 'order-2')
  assert.deepEqual(
    benefitOrderTest.parseNestedEligibility('{"status":"0","message":"success","data":"{\\"status\\":\\"0\\",\\"message\\":\\"success\\"}"}'),
    { eligible: true, message: 'success' },
  )
  assert.equal(benefitOrderTest.canAccess('user:a', 'user:a'), true)
  assert.equal(benefitOrderTest.canAccess('user:a', 'user:b'), false)
  assert.equal(benefitOrderTest.canAccess('user:a', 'admin'), true)

  assert.equal(
    resolveScopedPermission({
      currentUserOwnsResource: true,
      currentUserPermission: false,
      isAdmin: true,
    }),
    false,
  )
  assert.equal(
    resolveScopedPermission({
      currentUserOwnsResource: false,
      currentUserPermission: false,
      isAdmin: true,
    }),
    true,
  )
  const plain = '13800138000'
  const enc = await aesEncrypt(plain)
  assert.equal(typeof enc, 'string')
  assert.ok(/^[0-9A-F]+$/.test(enc))

  const dec = await aesDecrypt(enc)
  assert.equal(dec, plain)

  const capturedBusinessOrderCipher =
    'YLFuJgzU7wz3s12ZRQNlSidjr5qCvTg8eiTaH8OGVmA='
  assert.equal(
    businessOrderTest.decryptLoginPayload(capturedBusinessOrderCipher),
    '{"mobile":"18234870679"}',
  )
  assert.equal(
    businessOrderTest.encryptLoginPayload({ mobile: '18234870679' }),
    capturedBusinessOrderCipher,
  )
  assert.deepEqual(
    businessOrderTest.parseUpstreamPayload(
      Buffer.from('{"code":"0","message":"成功","data":null}', 'utf8').toString('base64'),
    ),
    { code: '0', message: '成功', data: null },
  )
  assert.deepEqual(
    businessOrderTest.sanitizeResultData({
      no: 'order-1',
      token: 'secret',
      nested: { mobile: '13800138000', canCancel: true },
    }),
    { no: 'order-1', nested: { canCancel: true } },
  )
  assert.equal(businessOrderTest.isSuccess({ code: '0' }), true)
  assert.equal(businessOrderTest.isSuccess({ code: '10', success: false }), false)
  assert.equal(businessOrderTest.canAccessBusinessOrderSession('user:a', 'user:a'), true)
  assert.equal(businessOrderTest.canAccessBusinessOrderSession('user:a', 'user:b'), false)
  assert.equal(businessOrderTest.canAccessBusinessOrderSession('user:a', 'admin'), true)
  const orderSession = {
    phone: '13800138000',
    productCode: '1000000100290',
    pageId: '1889216886548430848',
    provinceCode: '100',
    userId: 'upstream-user',
  }
  assert.equal(businessOrderTest.buildProtocolQueryPayload(orderSession).mobile, orderSession.phone)
  assert.equal(businessOrderTest.buildOrderSmsPayload(orderSession).mobile, orderSession.phone)
  assert.equal(
    businessOrderTest.buildOrderVerificationPayload(orderSession, '123456').mobile,
    orderSession.phone,
  )
  assert.equal(new BusinessOrderError('上游失败').status, 424)
  const cocAuth = {
    target: 'diamond_package' as const,
    cookie: 'User-Token=order-token',
    token: 'order-token',
    loginUrl: diamondUrl.toString(),
    userId: 'upstream-user',
    maskedMobile: '138****8000',
    provinceCode: '100',
    cityCode: '100',
  }
  const ssoBusinessSession = await createBusinessOrderSession({
    phone: '13800138000',
    ownerKey: 'user:test',
    authSession: cocAuth,
  })
  assert.equal(ssoBusinessSession.stage, 'logged_in')
  assert.equal(ssoBusinessSession.provinceCode, '100')
  assert.equal(deleteBusinessOrderSession(ssoBusinessSession.id), true)
  const ssoBuildingSession = await createBuildingBricksSession({
    phone: '13800138000',
    ownerKey: 'user:test',
    authSession: {
      ...cocAuth,
      target: 'building_bricks',
      loginUrl: buildingUrl.toString(),
    },
  })
  assert.equal(ssoBuildingSession.stage, 'authenticated')
  assert.equal(ssoBuildingSession.provinceCode, '100')
  assert.equal(deleteBenefitOrderSession(ssoBuildingSession.id), true)
  const ssoCocAppSession = await createCocAppSession({
    phone: '13800138000',
    accountId: 'account-test',
    ownerKey: 'user:test',
    appBusinessId: 'smart_life',
    authSession: {
      ...cocAuth,
      target: 'smart_life',
      loginUrl: smartLifeUrl.toString(),
    },
  })
  assert.equal(ssoCocAppSession.stage, 'authenticated')
  assert.equal(ssoCocAppSession.loginMode, 'app_cookie')
  assert.equal(deleteBenefitOrderSession(ssoCocAppSession.id), true)
  await assert.rejects(
    createCocAppSession({
      phone: '13800138000',
      accountId: 'account-test',
      ownerKey: 'user:test',
      appBusinessId: 'five_ga',
      authSession: { ...cocAuth, target: 'smart_life' },
    }),
    /凭证与目标业务不匹配/,
  )

  const previousAdminSessionSecret = process.env.ADMIN_SESSION_SECRET
  process.env.ADMIN_SESSION_SECRET = 'admin-session-secret-a'
  const adminSession = createAdminSession({
    id: 'admin-test',
    username: 'admin',
    passwordHash: '',
    role: 'super_admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  assert.equal(adminAuthTest.decodeSession(adminSession)?.adminId, 'admin-test')
  process.env.ADMIN_SESSION_SECRET = 'admin-session-secret-b'
  assert.equal(adminAuthTest.decodeSession(adminSession), null)
  if (previousAdminSessionSecret === undefined) delete process.env.ADMIN_SESSION_SECRET
  else process.env.ADMIN_SESSION_SECRET = previousAdminSessionSecret

  const shopCipher = shopWireEncrypt(plain)
  assert.equal(shopCipher, 'c244Qmdac3M1c1Q3LzEyRFBtZ1dYUT09')
  assert.equal(shopWireDecrypt(shopCipher), plain)
  assert.equal(buildShopLoginSign('test-token'), '99d8e84369d4374be1460734a6747483')
  const shopLogin = buildShopLoginRequest({
    token: 'test-token',
    backUrl: 'https://touch.10086.cn/i/',
  })
  assert.equal(shopLogin.channel, '12')
  assert.deepEqual(JSON.parse(shopWireDecrypt(Buffer.from(shopLogin.data).toString('base64'))), {
    token: 'test-token',
    backUrl: 'https://touch.10086.cn/i/',
    sysId: '001',
    sign: '99d8e84369d4374be1460734a6747483',
  })
  assert.ok(shopSessionTest.bridgeUrl.includes('netUniChannelId=019020'))
  assert.equal(shopSessionTest.hasShopSessionCookie('a=1; mobiletoken=token'), true)
  assert.equal(shopSessionTest.hasShopSessionCookie('a=1'), false)
  const normalizedShop = shopBusinessTest.normalizeShopBusiness(
    { busiCode: 'B001', isOrdered: '01', isUnOrder: '00' },
    '02',
    0,
  )
  assert.equal(normalizedShop.canUnsubscribe, true)
  assert.equal(normalizedShop.isOrdered, '01')
  assert.equal(normalizedShop.isUnOrder, '00')
  assert.deepEqual(userAuthTest.normalizePermissions({ businessQuery: true }), {
    businessQuery: true,
    shopQuery: false,
    businessOrder: false,
    businessIdOverride: false,
    benefitActivity: false,
  })
  assert.equal(
    userAuthTest.normalizePermissions({ businessOrder: true }).businessOrder,
    true,
  )
  assert.equal(
    userAuthTest.normalizePermissions({ businessQuery: true, shopQuery: false }).shopQuery,
    false,
  )
  assert.equal(
    userAuthTest.normalizePermissions({ businessQuery: false }).businessQuery,
    false,
  )
  assert.deepEqual(userAuthTest.normalizePermissions({ businessOrder: true }), {
    businessQuery: false,
    shopQuery: false,
    businessOrder: true,
    businessIdOverride: false,
    benefitActivity: false,
  })
  assert.deepEqual(
    accountProfileTest.extractCmccAccountProfile({
      userInfo: {
        userAge: '18年6个月',
        userBegin: '2008-01-01',
        provinceName: '北京',
        brandLevelName: '全球通金卡',
      },
    }),
    {
      netAge: '18年6个月',
      userBegin: '2008-01-01',
      province: '北京',
      levelName: '全球通金卡',
    },
  )
  assert.equal(
    accountProfileTest.extractCmccAccountProfile({
      rspBody: { userInfo: { netAge: null, userAge: 12 } },
    }).netAge,
    '12',
  )

  const sanitizedAnnouncement = announcementTest.sanitizeAnnouncementHtml(
    '<p onclick="alert(1)">通知<script>alert(2)</script><a href="javascript:alert(3)">链接</a></p>',
  )
  assert.equal(sanitizedAnnouncement.includes('script'), false)
  assert.equal(sanitizedAnnouncement.includes('onclick'), false)
  assert.equal(sanitizedAnnouncement.includes('javascript:'), false)
  assert.equal(sanitizedAnnouncement.includes('noopener noreferrer'), true)
  assert.equal(
    announcementTest.getAnnouncementStatus({
      enabled: true,
      publishAt: '2026-07-20T00:00:00.000Z',
      expireAt: '2026-07-21T00:00:00.000Z',
    }, new Date('2026-07-20T08:00:00.000Z')),
    'active',
  )
  assert.equal(
    announcementTest.beijingAnnouncementDay(new Date('2026-07-19T16:30:00.000Z')),
    '2026-07-20',
  )
  const popupItems = [
    { id: 'weak', important: false, level: 'weak' as const, publishAt: '2026-07-20T03:00:00.000Z' },
    { id: 'medium', important: false, level: 'medium' as const, publishAt: '2026-07-20T02:00:00.000Z' },
    { id: 'strong-seen', important: false, level: 'strong' as const, publishAt: '2026-07-20T04:00:00.000Z', lastShownDay: '2026-07-20' },
    { id: 'important', important: true, level: 'weak' as const, publishAt: '2026-07-20T01:00:00.000Z' },
  ]
  assert.equal(announcementTest.selectPopupAnnouncement(popupItems, '2026-07-20')?.id, 'important')
  assert.equal(announcementTest.canDismissAnnouncement({ important: false, level: 'strong' }, 'today'), true)
  assert.equal(announcementTest.canDismissAnnouncement({ important: false, level: 'strong' }, 'forever'), false)
  assert.equal(announcementTest.canDismissAnnouncement({ important: true, level: 'weak' }, 'forever'), true)

  const htmlPath = path.resolve(
    process.cwd(),
    '../10086登录页/wx.10086.cn/website/bind/bindAccount/new.html',
  )
  const html = await fs.readFile(htmlPath, 'utf8')
  const { csrf, reqTmp } = extractLoginParamsFromHtml(html)
  assert.ok(csrf.length > 10)
  assert.ok(/^\d{6,}$/.test(reqTmp))
  assert.equal(csrf, 'NVPIpldX-W6y6M8wa_fU_d-n6mNpDWalaLMQ')
  assert.equal(reqTmp, '2025080702')

  assert.equal(cmccTest.isLikelyHexCipher(''), false)
  assert.equal(cmccTest.isLikelyHexCipher('abcd'), false)
  assert.equal(cmccTest.isLikelyHexCipher(enc), true)

  const parsedJson = cmccTest.parseUpstreamBody('{"status":0,"message":"ok"}')
  assert.equal(parsedJson.kind, 'json')

  const parsedEncrypted = cmccTest.parseUpstreamBody(enc)
  assert.equal(parsedEncrypted.kind, 'encrypted_hex')

  const parsedHtml = cmccTest.parseUpstreamBody('<html><body>blocked</body></html>')
  assert.equal(parsedHtml.kind, 'text')

  const merged1 = cookieTest.mergeCookieWithSetCookie({
    cookie: 'a=1; b=2',
    setCookie: ['b=3; Path=/; HttpOnly', 'c=4; Path=/'],
  })
  assert.equal(merged1.changed, true)
  assert.ok(merged1.cookie.includes('a=1'))
  assert.ok(merged1.cookie.includes('b=3'))
  assert.ok(merged1.cookie.includes('c=4'))

  const fmt1 = debugCryptoTest.debugFormat('{"a":1}')
  assert.equal(fmt1.kind, 'json')
  assert.ok(fmt1.output.includes('\n'))

  const fmt2 = debugCryptoTest.debugFormat('not-json')
  assert.equal(fmt2.kind, 'text')

  const now = new Date('2026-05-16T09:30:00+08:00')
  const fresh = new Date(now.getTime() - 20 * 60_000).toISOString()
  const stale = new Date(now.getTime() - 80 * 60_000).toISOString()
  const exportResult = tokenExportTest.buildQqtTokenExport(
    [
      {
        id: 'ok',
        phone: '13800138000',
        qqtAccessToken: 'token-ok',
        qqtAccessTokenCheckedAt: fresh,
        qqtInfo: { data: { levelName: '全球通金卡' } },
        createdAt: fresh,
        updatedAt: fresh,
      },
      {
        id: 'non-qqt',
        phone: '13800138001',
        qqtAccessToken: 'token-non',
        qqtAccessTokenCheckedAt: fresh,
        qqtInfo: { msg: '非全球通用户' },
        createdAt: fresh,
        updatedAt: fresh,
      },
      {
        id: 'xdr',
        phone: '13800138002',
        qqtAccessToken: 'token-xdr',
        qqtAccessTokenCheckedAt: fresh,
        qqtInfo: { data: { vipLevel: 1 } },
        xdrReceive: { data: { prodList: [3537] } },
        createdAt: fresh,
        updatedAt: fresh,
      },
      {
        id: 'monthly',
        phone: '13800138003',
        qqtAccessToken: 'token-month',
        qqtAccessTokenCheckedAt: fresh,
        qqtInfo: { data: { vipLevel: 1 } },
        qqtSignResult: { records: [{ receiveTime: '2026-05-08', msg: '领取成功' }] },
        createdAt: fresh,
        updatedAt: fresh,
      },
      {
        id: 'stale',
        phone: '13800138004',
        qqtAccessToken: 'token-stale',
        qqtAccessTokenCheckedAt: stale,
        qqtInfo: { data: { vipLevel: 1 } },
        createdAt: stale,
        updatedAt: stale,
      },
    ],
    {
      now,
      updatedWithinMinutes: 60,
      validForMinutes: 120,
      minValidUntil: new Date('2026-05-16T10:00:00+08:00'),
      excludeNonQqt: true,
      excludeXdrReceived: true,
      excludeMonthlyReceived: true,
    },
  )
  assert.equal(exportResult.total, 1)
  assert.equal(exportResult.tokens[0].accountId, 'ok')
  assert.equal(exportResult.skipReasons.nonQqtUser, 1)
  assert.equal(exportResult.skipReasons.xdrReceived, 1)
  assert.equal(exportResult.skipReasons.monthlyReceived, 1)
  assert.equal(exportResult.skipReasons.tokenTooOld, 1)

  const nonQqtCombo = batchTaskTest.combineRefreshSignWedResult({
    refreshed: {
      status: 'success',
      message: 'CK 已刷新，非全球通用户跳过 Token 刷新',
    },
    signed: {
      status: 'skipped',
      message: '非全球通用户，已跳过全球通签到',
    },
    wed: {
      status: 'success',
      message: '已完成 2 次，失败 0 次',
    },
  })
  assert.equal(nonQqtCombo.status, 'success')
  assert.ok(nonQqtCombo.message.includes('非全球通用户，已跳过全球通签到'))
  assert.ok(nonQqtCombo.message.includes('拼图任务：已完成 2 次，失败 0 次'))
  assert.equal(
    batchTaskTest.isNonQqtAccount({
      qqtInfo: { data: { levelName: '全球通金卡' } },
      qqtSignInfo: { message: '非全球通用户' },
    } as never),
    false,
  )
  assert.equal(
    batchTaskTest.isNonQqtAccount({
      qqtInfo: { message: '非全球通用户' },
      qqtSignInfo: { data: { levelName: '全球通金卡' } },
    } as never),
    true,
  )
  assert.equal(
    batchTaskTest.isNonQqtAccount({
      qqtInfo: {
        message: '非全球通用户',
        globalTelecomMembership: { state: 'global', checkedAt: '2026-08-07T12:00:00.000Z' },
      },
    } as never),
    false,
  )
  assert.equal(
    batchTaskTest.isNonQqtAccount({
      qqtInfo: {
        message: '非全球通用户',
        globalTelecomMembership: { state: 'unknown', checkedAt: '2026-08-07T12:00:00.000Z' },
      },
    } as never),
    false,
  )
  assert.equal(
    batchTaskTest.classifyQqtMembership({ data: { levelName: '全球通金卡' } }),
    'global',
  )
  assert.equal(
    batchTaskTest.classifyQqtMembership({ message: '非全球通用户' }),
    'non_global',
  )
  assert.equal(
    batchTaskTest.currentQqtSignState({ status: '1', data: { signDates: [{ dayNum: 1, signStatus: 1 }, { dayNum: 2, signStatus: 2 }] } }),
    'signed',
  )
  assert.equal(
    batchTaskTest.currentQqtSignState({ status: '1', data: { signDates: [{ dayNum: 1, signStatus: 1 }, { dayNum: 2, signStatus: 0 }] } }),
    'unsigned',
  )
  assert.equal(batchTaskTest.currentQqtSignState({ status: '0', data: { signDates: [{ dayNum: 1, signStatus: 1 }] } }), 'unknown')
  assert.equal(batchTaskTest.currentQqtSignState({ status: '1', data: { signDates: [{ dayNum: 1, signStatus: -1 }] } }), 'unknown')
  assert.equal(batchTaskTest.currentQqtSignState({ status: '1', data: { signDates: [{ dayNum: 1 }] } }), 'unknown')

  const wedSkippedCombo = batchTaskTest.combineRefreshSignWedResult({
    refreshed: { status: 'success', message: 'CK 已刷新，Token 已刷新' },
    signed: { status: 'success', message: '签到完成' },
    wed: { status: 'skipped', message: '拼图任务：今日已完成，已跳过' },
  })
  assert.equal(wedSkippedCombo.status, 'success')
  assert.ok(wedSkippedCombo.message.includes('拼图任务：今日已完成，已跳过'))
  assert.equal(wedSkippedCombo.message.includes('拼图任务：拼图任务：'), false)
  assert.equal(batchTaskTest.shouldUseDailySkip('refresh_cookie'), true)
  assert.equal(batchTaskTest.shouldUseDailySkip('qqt_token'), true)
  assert.equal(batchTaskTest.shouldUseDailySkip('qqt_sign'), false)
  assert.equal(batchTaskTest.shouldUseDailySkip('wed_puzzle'), false)
  assert.equal(
    batchTaskTest.shouldPersistInvalidFromActivateFailure({ status: 408, message: '请求超时' }),
    false,
  )
  assert.equal(
    batchTaskTest.shouldPersistInvalidFromActivateFailure({ status: 401, message: '未登录' }),
    true,
  )
  assert.equal(batchTaskTest.normalizeRecentTaskLimit(undefined), 50)
  assert.equal(batchTaskTest.normalizeRecentTaskLimit(Number.NaN), 50)
  assert.equal(batchTaskTest.normalizeRecentTaskLimit(0), 1)
  assert.equal(batchTaskTest.normalizeRecentTaskLimit(25.9), 25)
  assert.equal(batchTaskTest.normalizeRecentTaskLimit(500), 200)
  assert.deepEqual(
    batchTaskTest.planGlobalTelecomResignDays([
      { dayNum: 5, signStatus: 2, reSign: false, tasks: [{ taskId: 3, taskStatus: 0 }, { taskId: 2, taskStatus: 1 }] },
      { dayNum: 2, signStatus: 0, reSign: true, tasks: [{ taskId: 1, taskStatus: 0 }, { taskId: 1, taskStatus: 0 }] },
      { dayNum: 4, signStatus: 1, reSign: false, tasks: [{ taskId: 9, taskStatus: 0 }] },
      { dayNum: 3, signStatus: 2, reSign: false, tasks: [{ taskId: 4, taskStatus: 1 }] },
    ], 3),
    [
      { dayNum: 2, taskIds: [1] },
      { dayNum: 3, taskIds: [] },
      { dayNum: 5, taskIds: [3] },
    ],
  )
  assert.deepEqual(batchTaskTest.planGlobalTelecomResignDays([
    { dayNum: 1, signStatus: 2, reSign: true, tasks: [{ taskId: 1, taskStatus: 0 }] },
  ], 0), [])
  assert.deepEqual(batchTaskTest.planGlobalTelecomBlindBoxTasks([
    { number: 2, completed: false },
    { number: 1, completed: true },
    { number: 3, completed: false },
    { number: 2, completed: false },
    { number: 0, completed: false },
    { number: 4, completed: false, available: false },
  ]), [2, 3])
  assert.deepEqual(batchTaskTest.planGlobalTelecomBlindBoxTasks([
    { number: 1, completed: true },
    { number: 2, completed: true },
  ]), [])

  const wedTasks: WedRechargeTask[] = [
    {
      order: 1,
      taskId: 'daily',
      title: '每日登录活动页面',
      taskDate: '每日任务',
      taskType: '1',
      status: 0,
      requireTimes: 1,
      completedTimes: 0,
      raw: {},
    },
    {
      order: 2,
      taskId: 'done',
      title: '已满任务',
      taskDate: '每日任务',
      taskType: '5',
      status: 2,
      requireTimes: 1,
      completedTimes: 1,
      raw: {},
    },
    {
      order: 3,
      taskId: 'invite',
      title: '邀请本月未登录APP用户助力',
      taskDate: '每日任务',
      taskType: '2',
      status: 0,
      requireTimes: 2,
      completedTimes: 0,
      raw: {},
    },
    {
      order: 4,
      taskId: 'recharge',
      title: '单笔充值话费满10元',
      taskDate: '每日任务',
      taskType: '3',
      status: 0,
      requireTimes: 1,
      completedTimes: 0,
      raw: {},
    },
    {
      order: 5,
      taskId: 'sat',
      title: '浏览游戏日活动',
      taskDate: '周六任务',
      taskType: '5',
      description: '每月可完成1/3，每周六可完成0/1',
      status: 0,
      requireTimes: 3,
      completedTimes: 1,
      raw: {},
    },
    {
      order: 6,
      taskId: 'sun',
      title: '浏览视频日活动',
      taskDate: '周日任务',
      taskType: '4',
      description: '每月可完成0/3，每周日可完成0/1',
      status: 0,
      requireTimes: 3,
      completedTimes: 0,
      raw: {},
    },
    {
      order: 7,
      taskId: 'closed',
      title: '未开放任务',
      taskDate: '每日任务',
      taskType: '1',
      status: 2,
      requireTimes: 1,
      completedTimes: 0,
      raw: {},
    },
  ]
  assert.deepEqual(
    selectWedRechargeRunnableTasks({
      tasks: wedTasks,
      now: new Date('2026-05-25T09:00:00+08:00'),
    }).map((task) => task.taskId),
    ['daily', 'invite', 'recharge', 'sat', 'sun'],
  )
  const saturdayPlan = planWedRechargeTasks({
    tasks: wedTasks,
    now: new Date('2026-05-23T09:00:00+08:00'),
  })
  assert.deepEqual(
    saturdayPlan.runnable.map((item) => [item.task.taskId, item.runTimes]),
    [
      ['daily', 1],
      ['invite', 1],
      ['recharge', 1],
      ['sat', 1],
      ['sun', 1],
    ],
  )
  assert.deepEqual(saturdayPlan.skipped.map((item) => item.task.taskId), ['done', 'closed'])
  assert.equal(
    wedRechargeTest.stripWedRechargeSessionToken('a=1; HLWHD_SESSION_TOKEN=old; b=2'),
    'a=1; b=2',
  )
  assert.equal(wedRechargeTest.resolveWedRechargeTaskStrategy({ taskType: '1' }), 'directFinish')
  assert.equal(wedRechargeTest.resolveWedRechargeTaskStrategy({ taskType: '2' }), 'directFinish')
  assert.equal(wedRechargeTest.resolveWedRechargeTaskStrategy({ taskType: '3' }), 'directFinish')
  assert.equal(wedRechargeTest.resolveWedRechargeTaskStrategy({ taskType: '4' }), 'openPlugin')
  assert.equal(wedRechargeTest.resolveWedRechargeTaskStrategy({ taskType: '5' }), 'directFinish')
  assert.equal(wedRechargeTest.resolveWedRechargeTaskStrategy({ taskType: '6' }), 'directFinish')
  assert.equal(wedRechargeTest.resolveWedRechargeTaskStrategy({ taskType: undefined }), 'unsupported')

  const normalizedWedTask = wedRechargeTest.normalizeTask({
    order: '8',
    taskId: 1024,
    title: 2026,
    taskType: 6,
    status: '0',
    requireTimes: '2',
    completedTimes: '1',
  })
  assert.equal(normalizedWedTask?.taskId, '1024')
  assert.equal(normalizedWedTask?.title, '2026')
  assert.equal(normalizedWedTask?.taskType, '6')
  assert.equal(normalizedWedTask?.status, 0)
  assert.equal(normalizedWedTask?.requireTimes, 2)

  const normalizedPictureInfo = wedRechargeTest.normalizePictureInfoData({
    activeIndex: '3',
    drawTimes: 2,
    r4Status: '1',
    r5DrawStatus: '0',
    cardNo: 13800138000,
  }, { code: '0' })
  assert.equal(normalizedPictureInfo.activeIndex, 3)
  assert.equal(normalizedPictureInfo.drawTimes, '2')
  assert.equal(normalizedPictureInfo.r4Status, 1)
  assert.equal(normalizedPictureInfo.r5DrawStatus, 0)
  assert.equal(normalizedPictureInfo.cardNo, '13800138000')
  assert.equal(resolveWedRechargeRound(normalizedPictureInfo), 'dp3')
  assert.throws(() => resolveWedRechargeRound({ activeIndex: 0, raw: {} }), /有效的当前拼图档位/)
  assert.throws(() => resolveWedRechargeRound({ activeIndex: 4, raw: {} }), /有效的当前拼图档位/)
}

run().then(
  () => {
    process.stdout.write('api-unit: ok\n')
  },
  (e) => {
    process.stderr.write(`api-unit: failed: ${e instanceof Error ? e.message : String(e)}\n`)
    process.exit(1)
  },
)

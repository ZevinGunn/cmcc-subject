import { randomUUID } from 'node:crypto'
import { executePortalActivityStep } from './portalClient.js'
import { config } from '../config.js'
import { requestWithJar } from '../utils/http.js'
import { logEvent, sanitize } from '../utils/logger.js'

const PENDING_TTL_MS = 15 * 60 * 1000
const COMPLETED_TTL_MS = 10 * 60 * 1000
const pendingOrders = new Map()
const completedOrders = new Map()
const running = new Set()

const codePattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/
const optionalContentFields = [
  'packageName',
  'productShowName',
  'pitemShowName',
  'productSendUrl',
  'pitemSendUrl',
  'prodValue',
  'isQd2018',
]
const blockedExtraKeys = new Set([
  '__proto__',
  'prototype',
  'constructor',
  'packageId',
  'packageCode',
  'productShowCode',
  'pitemShowCode',
])

function failure(message, errorCode, raw = null) {
  return { ok: false, message, errorCode, raw }
}

function cleanText(value, maxLength = 200) {
  return String(value ?? '').trim().slice(0, maxLength)
}

function requireCode(value, label) {
  const text = cleanText(value, 128)
  if (!text) return failure(`请输入${label}`, 'CUSTOM_ORDER_CONFIG_REQUIRED', { field: label })
  if (!codePattern.test(text)) return failure(`${label}格式不正确`, 'CUSTOM_ORDER_CONFIG_INVALID', { field: label })
  return { ok: true, data: text }
}

function normalizeExtraContent(value) {
  if (value == null || value === '') return { ok: true, data: {} }
  let input = value
  if (typeof value === 'string') {
    try {
      input = JSON.parse(value)
    } catch {
      return failure('高级字段不是有效 JSON', 'CUSTOM_ORDER_EXTRA_INVALID')
    }
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return failure('高级字段必须是 JSON 对象', 'CUSTOM_ORDER_EXTRA_INVALID')
  }
  const entries = Object.entries(input)
  if (entries.length > 30) return failure('高级字段不能超过30项', 'CUSTOM_ORDER_EXTRA_INVALID')
  const output = {}
  for (const [key, item] of entries) {
    if (!/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(key) || blockedExtraKeys.has(key)) {
      return failure(`高级字段 ${key} 不允许使用`, 'CUSTOM_ORDER_EXTRA_INVALID')
    }
    if (!['string', 'number', 'boolean'].includes(typeof item) && item !== null) {
      return failure(`高级字段 ${key} 仅支持简单值`, 'CUSTOM_ORDER_EXTRA_INVALID')
    }
    output[key] = typeof item === 'string' ? item.slice(0, 1000) : item
  }
  return { ok: true, data: output }
}

export function normalizeCustomOrderConfig(input = {}, options = {}) {
  const packageId = requireCode(input.packageId, '活动策划ID')
  if (!packageId.ok) return packageId
  const packageCode = requireCode(input.packageCode, '活动编码')
  if (!packageCode.ok) return packageCode
  const pitemShowCode = requireCode(input.pitemShowCode || 'KT', '资源动作编码')
  if (!pitemShowCode.ok) return pitemShowCode
  const productShowCodeText = cleanText(input.productShowCode, 128)
  if (productShowCodeText && !codePattern.test(productShowCodeText)) {
    return failure('资源编码格式不正确', 'CUSTOM_ORDER_CONFIG_INVALID', { field: 'productShowCode' })
  }
  const proType = cleanText(input.proType, 128)
  if (proType && !codePattern.test(proType)) return failure('初始化类型格式不正确', 'CUSTOM_ORDER_CONFIG_INVALID', { field: 'proType' })
  if (!productShowCodeText && !proType && options.requireProduct !== false) {
    return failure('请输入资源编码，或提供初始化类型自动获取', 'CUSTOM_ORDER_PRODUCT_REQUIRED')
  }
  const extra = normalizeExtraContent(input.extraContent)
  if (!extra.ok) return extra
  const normalized = {
    activityName: cleanText(input.activityName, 100) || packageCode.data,
    proType,
    operType: 'commitProductNew',
    packageId: packageId.data,
    packageCode: packageCode.data,
    productShowCode: productShowCodeText,
    pitemShowCode: pitemShowCode.data,
    mtOtherParams: cleanText(input.mtOtherParams, 1000),
    extraContent: extra.data,
  }
  for (const key of optionalContentFields) {
    if (input[key] !== undefined && input[key] !== null && String(input[key]) !== '') {
      normalized[key] = typeof input[key] === 'boolean' ? input[key] : cleanText(input[key], 1000)
    }
  }
  return { ok: true, data: normalized }
}

export function buildCompositePayload(config) {
  const content = {
    packageId: config.packageId,
    packageCode: config.packageCode,
    productShowCode: config.productShowCode,
    pitemShowCode: config.pitemShowCode || 'KT',
  }
  if (config.mtOtherParams) content.mtOtherParams = config.mtOtherParams
  for (const key of optionalContentFields) {
    if (config[key] !== undefined && config[key] !== '') content[key] = config[key]
  }
  Object.assign(content, config.extraContent || {})
  return { common: { operType: config.operType || 'commitProductNew' }, body: { content } }
}

function unwrapData(value) {
  let current = value
  for (let depth = 0; depth < 3; depth += 1) {
    if (!current || typeof current !== 'object' || Array.isArray(current)) break
    if ('resultCode' in current || 'result' in current || 'resType' in current || 'smsType' in current) break
    if (!current.data || current.data === current) break
    current = current.data
  }
  return current
}

function portalBusinessCode(result) {
  return result?.raw?.code || result?.data?.code || ''
}

function portalMessage(result, fallback) {
  return cleanText(result?.raw?.message || result?.data?.message || result?.message || fallback, 500)
}

const blockedActivityField = /(?:mobile|phone|account|token|authorization|cookie|key|secret|password|captcha|identity|idcard|cert|artifact)/i

function sanitizeActivityValue(value, depth = 0) {
  if (depth > 6) return undefined
  if (value === null || ['number', 'boolean'].includes(typeof value)) return value
  if (typeof value === 'string') return value.slice(0, 5000)
  if (Array.isArray(value)) {
    return value.slice(0, 100)
      .map((item) => sanitizeActivityValue(item, depth + 1))
      .filter((item) => item !== undefined)
  }
  if (!value || typeof value !== 'object') return undefined
  const output = {}
  for (const [key, item] of Object.entries(value).slice(0, 200)) {
    if (blockedActivityField.test(key)) continue
    const safe = sanitizeActivityValue(item, depth + 1)
    if (safe !== undefined) output[key.slice(0, 128)] = safe
  }
  return output
}

function publicActivityInfo(data) {
  const source = unwrapData(data) || {}
  const fields = ['resultCode', 'feeRange', 'planFee', 'LL', 'voice', 'WY', 'productCode', 'productName', 'productDesc', 'productCrtDate']
  const info = {}
  for (const key of fields) {
    if (source[key] !== undefined && source[key] !== null) info[key] = source[key]
  }
  return { ...info, raw: sanitizeActivityValue(source) || {} }
}

export async function initializeCustomOrder(session, input = {}) {
  const proType = requireCode(input.proType, '初始化类型')
  if (!proType.ok) return proType
  const result = await executePortalActivityStep(session, {
    method: 'POST',
    path: '/portal-bff/api/initMobilePro/v1.0/initMProductCommonData',
    query: { proType: proType.data },
    body: { proType: proType.data },
  })
  if (!result.ok) return failure(result.message || '活动信息初始化失败', result.errorCode || 'CUSTOM_ORDER_INIT_FAILED')
  const activityInfo = publicActivityInfo(result.data)
  return {
    ok: true,
    data: {
      activityInfo,
      eligible: activityInfo.resultCode === '00',
      alreadyOrdered: activityInfo.resultCode === '33',
      message:
        activityInfo.resultCode === '00'
          ? '活动信息读取成功，可使用返回的资源编码进行订购。'
          : activityInfo.resultCode === '33'
            ? '当前号码已办理该活动。'
            : '当前号码未返回可办理资源，仍可手动填写资源编码尝试提交。',
    },
  }
}

export function previewCustomOrder(input = {}) {
  const normalized = normalizeCustomOrderConfig(input)
  if (!normalized.ok) return normalized
  return {
    ok: true,
    data: {
      activityName: normalized.data.activityName,
      payload: buildCompositePayload(normalized.data),
    },
  }
}

export async function loadFlyCardUsage(session) {
  const url = new URL('/m/jztj/sytc5GQQTLevel.action', config.portalOrigin)
  if (session.wafToken) url.searchParams.set('XEbtxIBt', session.wafToken)
  const startedAt = Date.now()
  try {
    const response = await requestWithJar({
      jar: session.jar,
      url: url.toString(),
      method: 'POST',
      headers: {
        'User-Agent': config.userAgent,
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Origin: config.portalOrigin,
        Referer: `${config.portalOrigin}/m/jsp/2025Mobile/8y4g/index.jsp`,
        'X-Requested-With': 'XMLHttpRequest',
      },
      data: '',
    })
    let payload = response.data
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload)
      } catch {
        payload = null
      }
    }
    const valid = response.status >= 200 && response.status < 300 && payload && typeof payload === 'object'
    const voiceMinutes = Number.parseInt(String(payload?.ATTR_VALUE ?? ''), 10)
    const dataMb = Number.parseInt(String(payload?.ATTR_VALUE1 ?? ''), 10)
    const available = valid && Number.isFinite(voiceMinutes) && Number.isFinite(dataMb)
    await logEvent('customOrder:fly-card-usage', {
      sessionId: session.id,
      status: response.status,
      available,
      durationMs: Date.now() - startedAt,
    })
    return {
      ok: true,
      data: {
        available,
        ...(available ? {
          previousMonthVoiceMinutes: voiceMinutes,
          previousMonthDataMb: dataMb,
          previousMonthDataDisplay: cleanText(payload.ATTR_VALUE2, 80),
          eligibilityFlag: cleanText(payload.boo, 20),
        } : {}),
        message: available ? '已读取上月语音和流量用量。' : '未读取到上月用量，仍可核对套餐后尝试办理。',
      },
    }
  } catch (error) {
    await logEvent('customOrder:fly-card-usage', {
      sessionId: session.id,
      status: 0,
      available: false,
      durationMs: Date.now() - startedAt,
      errorCode: cleanText(error?.code, 80) || 'FLY_CARD_USAGE_REQUEST_FAILED',
    })
    return {
      ok: true,
      data: {
        available: false,
        message: '上月用量查询暂不可用，仍可核对套餐后尝试办理。',
      },
    }
  }
}

function cleanupStores() {
  const now = Date.now()
  for (const [id, value] of pendingOrders) if (now - value.createdAt > PENDING_TTL_MS) pendingOrders.delete(id)
  for (const [id, value] of completedOrders) if (now - value.completedAt > COMPLETED_TTL_MS) completedOrders.delete(id)
}

async function runPortalStep(session, name, step, executionId) {
  const startedAt = Date.now()
  const result = await executePortalActivityStep(session, step)
  await logEvent('customOrder:step', {
    executionId,
    sessionId: session.id,
    step: name,
    method: step.method,
    path: step.path,
    ok: result.ok,
    status: result.status || 0,
    businessCode: portalBusinessCode(result),
    durationMs: Date.now() - startedAt,
  })
  return result
}

function isSmsRequired(result) {
  return ['need_sms_check', 'smsVerification'].includes(portalBusinessCode(result)) || Boolean(unwrapData(result?.data)?.smsType)
}

function smsContextFrom(result, config) {
  const data = unwrapData(result.data) || {}
  const responseSmsType = cleanText(data.smsType, 80)
  return {
    smsType: responseSmsType || 'need_sms_check_v1',
    smsTypeSource: responseSmsType ? 'compositeCommit_response' : 'backend_fallback',
    typeKey: cleanText(data.typeKey, 500),
    productItemName: cleanText(data.productItemName, 300) || config.activityName,
    productItemDesc: cleanText(data.productItemDesc, 3000),
    busiTime: cleanText(data.busiTime, 300),
  }
}

function smsTransportForType(smsType) {
  const useV2 = smsType === 'need_sms_check_v2'
  return {
    path: useV2 ? '/portal-bff/api/mtsms/v1.0/sendDXSMSV2' : '/portal-bff/api/mtsms/v1.0/sendDXSMS',
    queryMode: useV2 ? 'clear' : 'encrypted',
  }
}

function knownSmsInputRule(packageCode) {
  return packageCode === 'JFBXHY' ? 'first5_last1_from_8_or_direct_6' : 'direct_6_only'
}

function buildSmsContextAudit(config, sms, result, context = {}) {
  const transport = smsTransportForType(sms.smsType)
  return {
    executionId: context.executionId,
    orderId: context.orderId,
    source: 'compositeCommit',
    phase: context.allowSms === false ? 'after_sms_verification' : 'initial_commit',
    packageId: config.packageId,
    packageCode: config.packageCode,
    productShowCode: config.productShowCode,
    pitemShowCode: config.pitemShowCode,
    mtOtherParamsPresent: Boolean(config.mtOtherParams),
    portalBusinessCode: portalBusinessCode(result),
    smsType: sms.smsType,
    smsTypeSource: sms.smsTypeSource,
    smsSendPath: transport.path,
    smsQueryMode: transport.queryMode,
    smsContextHandlePresent: Boolean(sms.typeKey),
    smsContextHandleLength: sms.typeKey.length,
    productItemDescLength: sms.productItemDesc.length,
    businessTimePresent: Boolean(sms.busiTime),
    knownInputRule: knownSmsInputRule(config.packageCode),
  }
}

function publicSmsContext(context) {
  return {
    smsType: context.smsType,
    productItemName: context.productItemName,
    productItemDesc: context.productItemDesc,
    busiTime: context.busiTime,
    hasProductKey: Boolean(context.typeKey),
  }
}

async function queryOrderResult(session, executionId) {
  const result = await runPortalStep(
    session,
    'result',
    { method: 'POST', path: '/portal-bff/api/pcConsole/v1.0/showBLJG', body: {} },
    executionId,
  )
  if (!result.ok) return null
  return sanitize(unwrapData(result.data) || result.data)
}

async function normalizeCommitResult(session, result, context) {
  if (!result.ok) return failure(result.message || '统一订购接口调用失败', result.errorCode || 'CUSTOM_ORDER_COMMIT_FAILED')
  if (isSmsRequired(result)) {
    const sms = smsContextFrom(result, context.config)
    const orderId = context.orderId || randomUUID()
    await logEvent('customOrder:sms-context', buildSmsContextAudit(context.config, sms, result, { ...context, orderId }))
    if (context.allowSms === false) {
      return failure(
        '短信校验后运营商仍要求再次确认，本次办理未完成，请重新发起并核对活动参数。',
        'CUSTOM_ORDER_SMS_STILL_REQUIRED',
      )
    }
    if (!sms.typeKey) return failure('短信确认响应缺少产品校验 key', 'CUSTOM_ORDER_SMS_CONTEXT_INVALID')
    pendingOrders.set(orderId, {
      orderId,
      sessionId: session.id,
      executionId: context.executionId,
      confirmationId: context.confirmationId,
      config: context.config,
      payload: context.payload,
      sms,
      createdAt: Date.now(),
      smsSentAt: 0,
    })
    return {
      ok: true,
      data: {
        status: 'sms_required',
        orderId,
        sms: publicSmsContext(sms),
        message: '该业务需要短信验证码确认。',
      },
    }
  }
  const data = unwrapData(result.data) || {}
  const rawCode = portalBusinessCode(result)
  if (result.raw?.success === false || (rawCode && !['bizSuccess'].includes(rawCode))) {
    return failure(portalMessage(result, '统一订购未被受理'), 'CUSTOM_ORDER_COMMIT_REJECTED', { code: rawCode })
  }
  const resType = cleanText(data.resType, 80)
  const finalResult = resType === 'showbljg' ? await queryOrderResult(session, context.executionId) : sanitize(data)
  return {
    ok: true,
    data: {
      status: 'accepted',
      accepted: true,
      executionId: context.executionId,
      resType: finalResult?.resType || resType,
      result: finalResult,
      message: '业务订购请求已受理，最终结果以北京移动返回和实际生效情况为准。',
    },
  }
}

export async function submitCustomOrder(session, input = {}, options = {}) {
  cleanupStores()
  if (options.agreed !== true) return failure('请确认已核对活动策划和资源信息', 'CUSTOM_ORDER_AGREEMENT_REQUIRED')
  const confirmationId = cleanText(options.confirmationId, 80)
  if (!/^[A-Za-z0-9_-]{8,80}$/.test(confirmationId)) return failure('订购确认标识无效', 'CUSTOM_ORDER_CONFIRMATION_INVALID')
  const completedKey = `${session.id}:${confirmationId}`
  const previous = completedOrders.get(completedKey)
  if (previous) return { ...previous.result, idempotent: true }
  const lockKey = `${session.id}:custom-order`
  if (running.has(lockKey)) return failure('当前账号有一笔自定义订购正在处理', 'CUSTOM_ORDER_ALREADY_RUNNING')

  const normalized = normalizeCustomOrderConfig(input)
  if (!normalized.ok) return normalized
  running.add(lockKey)
  const executionId = randomUUID()
  try {
    let config = normalized.data
    if (!config.productShowCode && config.proType) {
      const initialized = await initializeCustomOrder(session, { proType: config.proType })
      if (!initialized.ok) return initialized
      const productCode = cleanText(initialized.data.activityInfo.productCode, 128)
      if (!productCode) return failure('初始化未返回可订资源编码，请手动填写 productShowCode', 'CUSTOM_ORDER_PRODUCT_NOT_FOUND')
      config = { ...config, productShowCode: productCode }
    }
    const payload = buildCompositePayload(config)
    await logEvent('customOrder:submit:start', {
      executionId,
      sessionId: session.id,
      activityName: config.activityName,
      packageId: config.packageId,
      packageCode: config.packageCode,
      productShowCode: config.productShowCode,
    })
    const commit = await runPortalStep(
      session,
      'commit',
      { method: 'POST', path: '/portal-bff/api/sjyw/biz/core/v1.0/compositeCommit', body: payload },
      executionId,
    )
    const result = await normalizeCommitResult(session, commit, { executionId, confirmationId, config, payload })
    if (result.ok && result.data.status === 'accepted') completedOrders.set(completedKey, { completedAt: Date.now(), result })
    return result
  } finally {
    running.delete(lockKey)
  }
}

function requirePendingOrder(session, orderId) {
  cleanupStores()
  const pending = pendingOrders.get(cleanText(orderId, 80))
  if (!pending || pending.sessionId !== session.id) return failure('短信确认订单不存在或已过期', 'CUSTOM_ORDER_PENDING_NOT_FOUND')
  return { ok: true, data: pending }
}

export function discardCustomOrder(session, orderId) {
  const found = requirePendingOrder(session, orderId)
  if (!found.ok) return found
  const pending = found.data
  if (running.has(`${session.id}:custom-order-sms`)) {
    return failure('订购验证码正在处理中，暂不能修改参数', 'CUSTOM_ORDER_ALREADY_RUNNING')
  }
  pendingOrders.delete(pending.orderId)
  return { ok: true, data: { discarded: true } }
}

export async function sendCustomOrderSms(session, orderId) {
  const found = requirePendingOrder(session, orderId)
  if (!found.ok) return found
  const pending = found.data
  if (pending.smsSentAt && Date.now() - pending.smsSentAt < 55 * 1000) {
    return failure('短信发送过于频繁，请稍后再试', 'CUSTOM_ORDER_SMS_TOO_FREQUENT')
  }
  const transport = smsTransportForType(pending.sms.smsType)
  const step = {
    method: 'GET',
    path: transport.path,
    queryMode: transport.queryMode,
    query: { productKey: pending.sms.typeKey, mtOtherParams: pending.config.mtOtherParams },
  }
  const result = await runPortalStep(session, 'sms-send', step, pending.executionId)
  const success = result.ok && result.raw?.success !== false
  await logEvent('customOrder:sms-send', {
    executionId: pending.executionId,
    orderId: pending.orderId,
    packageCode: pending.config.packageCode,
    smsType: pending.sms.smsType,
    smsSendPath: transport.path,
    smsQueryMode: transport.queryMode,
    success,
    businessCode: portalBusinessCode(result),
  })
  if (!success) {
    return failure(portalMessage(result, '短信验证码发送失败'), result.errorCode || 'CUSTOM_ORDER_SMS_SEND_FAILED')
  }
  pending.smsSentAt = Date.now()
  return { ok: true, data: { sent: true, message: '短信验证码已发送。' } }
}

function normalizeSmsVerificationCode(value, packageCode) {
  const code = cleanText(value, 10)
  if (/^\d{6}$/.test(code)) return code
  if (packageCode === 'JFBXHY' && /^\d{8}$/.test(code)) return `${code.slice(0, 5)}${code.slice(-1)}`
  return ''
}

function buildSmsVerificationAudit(value, packageCode) {
  const input = cleanText(value, 10)
  const normalized = normalizeSmsVerificationCode(input, packageCode)
  return {
    inputLength: input.length,
    normalizedLength: normalized.length,
    transformRule: normalized ? (input.length === 8 ? 'first5_last1' : 'direct_6') : 'rejected',
  }
}

export async function verifyCustomOrderSms(session, orderId, smsCode) {
  const found = requirePendingOrder(session, orderId)
  if (!found.ok) return found
  const pending = found.data
  const code = normalizeSmsVerificationCode(smsCode, pending.config.packageCode)
  await logEvent('customOrder:sms-verify-input', {
    executionId: pending.executionId,
    orderId: pending.orderId,
    packageCode: pending.config.packageCode,
    smsType: pending.sms.smsType,
    knownInputRule: knownSmsInputRule(pending.config.packageCode),
    ...buildSmsVerificationAudit(smsCode, pending.config.packageCode),
  })
  if (!code) {
    return failure('请输入短信中的8位验证密码，或截取后的6位验证码', 'CUSTOM_ORDER_SMS_CODE_INVALID')
  }
  const lockKey = `${session.id}:custom-order-sms`
  if (running.has(lockKey)) return failure('短信确认正在处理中，请勿重复提交', 'CUSTOM_ORDER_ALREADY_RUNNING')
  running.add(lockKey)
  try {
    const checked = await runPortalStep(
      session,
      'sms-check',
      {
        method: 'GET',
        path: '/portal-bff/api/mtsms/v1.0/checkDxCodeForMT',
        query: {
          smsCode: code,
          productKey: pending.sms.typeKey,
          mtOtherParams: pending.config.mtOtherParams,
        },
      },
      pending.executionId,
    )
    const checkedData = unwrapData(checked.data) || {}
    const portalResult = cleanText(checkedData.result || checkedData.data?.result, 80)
    const success = checked.ok && portalResult === '00000'
    await logEvent('customOrder:sms-verify-result', {
      executionId: pending.executionId,
      orderId: pending.orderId,
      packageCode: pending.config.packageCode,
      smsType: pending.sms.smsType,
      success,
      requestOk: checked.ok,
      portalResult,
      businessCode: portalBusinessCode(checked),
    })
    if (!checked.ok) return failure(checked.message || '短信验证码校验失败', checked.errorCode || 'CUSTOM_ORDER_SMS_CHECK_FAILED')
    if (!success) {
      return failure('短信验证码不正确，请重新输入', 'CUSTOM_ORDER_SMS_MISMATCH')
    }
    const commit = await runPortalStep(
      session,
      'commit-after-sms',
      { method: 'POST', path: '/portal-bff/api/sjyw/biz/core/v1.0/compositeCommit', body: pending.payload },
      pending.executionId,
    )
    const result = await normalizeCommitResult(session, commit, { ...pending, allowSms: false })
    if (result.ok && result.data.status === 'accepted') {
      pendingOrders.delete(pending.orderId)
      completedOrders.set(`${session.id}:${pending.confirmationId}`, { completedAt: Date.now(), result })
    }
    return result
  } finally {
    running.delete(lockKey)
  }
}

export const customOrderInternals = {
  unwrapData,
  publicActivityInfo,
  isSmsRequired,
  normalizeExtraContent,
  normalizeSmsVerificationCode,
  buildSmsContextAudit,
  buildSmsVerificationAudit,
  knownSmsInputRule,
  smsTransportForType,
  sanitizeActivityValue,
}

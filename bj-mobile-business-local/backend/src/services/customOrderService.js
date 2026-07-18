import { randomUUID } from 'node:crypto'
import { executePortalActivityStep } from './portalClient.js'
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

function publicActivityInfo(data) {
  const source = unwrapData(data) || {}
  const fields = ['resultCode', 'feeRange', 'planFee', 'LL', 'voice', 'WY', 'productCode', 'productName', 'productDesc', 'productCrtDate']
  const info = {}
  for (const key of fields) {
    if (source[key] !== undefined && source[key] !== null) info[key] = source[key]
  }
  return { ...info, raw: sanitize(source) }
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
  return {
    smsType: cleanText(data.smsType, 80) || 'need_sms_check_v1',
    typeKey: cleanText(data.typeKey, 500),
    productItemName: cleanText(data.productItemName, 300) || config.activityName,
    productItemDesc: cleanText(data.productItemDesc, 3000),
    busiTime: cleanText(data.busiTime, 300),
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
    if (context.allowSms === false) {
      return failure(
        '短信校验后运营商仍要求再次确认，本次办理未完成，请重新发起并核对活动参数。',
        'CUSTOM_ORDER_SMS_STILL_REQUIRED',
      )
    }
    const sms = smsContextFrom(result, context.config)
    if (!sms.typeKey) return failure('短信确认响应缺少产品校验 key', 'CUSTOM_ORDER_SMS_CONTEXT_INVALID')
    const orderId = randomUUID()
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

export async function sendCustomOrderSms(session, orderId) {
  const found = requirePendingOrder(session, orderId)
  if (!found.ok) return found
  const pending = found.data
  if (pending.smsSentAt && Date.now() - pending.smsSentAt < 55 * 1000) {
    return failure('短信发送过于频繁，请稍后再试', 'CUSTOM_ORDER_SMS_TOO_FREQUENT')
  }
  const step = {
    method: 'GET',
    path:
      pending.sms.smsType === 'need_sms_check_v2'
        ? '/portal-bff/api/mtsms/v1.0/sendDXSMSV2'
        : '/portal-bff/api/mtsms/v1.0/sendDXSMS',
    queryMode: pending.sms.smsType === 'need_sms_check_v2' ? 'clear' : 'encrypted',
    query: { productKey: pending.sms.typeKey, mtOtherParams: pending.config.mtOtherParams },
  }
  const result = await runPortalStep(session, 'sms-send', step, pending.executionId)
  if (!result.ok || result.raw?.success === false) {
    return failure(portalMessage(result, '短信验证码发送失败'), result.errorCode || 'CUSTOM_ORDER_SMS_SEND_FAILED')
  }
  pending.smsSentAt = Date.now()
  return { ok: true, data: { sent: true, message: '短信验证码已发送。' } }
}

export async function verifyCustomOrderSms(session, orderId, smsCode) {
  const found = requirePendingOrder(session, orderId)
  if (!found.ok) return found
  const code = cleanText(smsCode, 10)
  if (!/^\d{6}$/.test(code)) return failure('请输入6位短信验证码', 'CUSTOM_ORDER_SMS_CODE_INVALID')
  const pending = found.data
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
    if (!checked.ok) return failure(checked.message || '短信验证码校验失败', checked.errorCode || 'CUSTOM_ORDER_SMS_CHECK_FAILED')
    const checkedData = unwrapData(checked.data) || {}
    if (String(checkedData.result || checkedData.data?.result || '') !== '00000') {
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

export const customOrderInternals = { unwrapData, publicActivityInfo, isSmsRequired, normalizeExtraContent }

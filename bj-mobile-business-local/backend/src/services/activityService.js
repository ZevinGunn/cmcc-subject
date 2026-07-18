import { randomUUID } from 'node:crypto'
import { executePortalActivityStep } from './portalClient.js'
import { renderTemplate } from './templateService.js'
import { logEvent, sanitize } from '../utils/logger.js'

const running = new Set()
const completedConfirmations = new Map()
const IDEMPOTENCY_TTL_MS = 10 * 60 * 1000

function failure(message, errorCode, raw = null) {
  return { ok: false, message, errorCode, raw }
}

function valueAt(value, path) {
  return String(path || '')
    .split('.')
    .filter(Boolean)
    .reduce((current, key) => (current == null ? undefined : current[key]), value)
}

function nestedBusinessResult(value) {
  let current = value
  for (let depth = 0; depth < 3; depth += 1) {
    if (!current || typeof current !== 'object') break
    if ('code' in current || 'isRealName' in current || 'message' in current) return current
    if (!current.data || current.data === current) break
    current = current.data
  }
  return current
}

function isEligible(value) {
  if (value === true) return true
  if (value?.data === true) return true
  if (value?.data?.data === true) return true
  return false
}

function hasExistingBroadband(value) {
  return value === 'Y' || value?.data === 'Y' || value?.data?.data === 'Y'
}

function normalizeDate(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw.replaceAll('-', '')
  if (/^\d{8}$/.test(raw)) return raw
  return raw
}

function validateIdentityNo(value) {
  const id = String(value || '').trim().toUpperCase()
  if (/^\d{15}$/.test(id)) return true
  if (!/^\d{17}[\dX]$/.test(id)) return false
  const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const checks = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  const sum = factors.reduce((total, factor, index) => total + Number(id[index]) * factor, 0)
  return checks[sum % 11] === id[17]
}

function validateInput(activity, input = {}, session) {
  const normalized = { ...input }
  normalized.ownerName = String(input.ownerName || session.userInfo?.raw?.name || session.userInfo?.name || '').trim()
  normalized.appointmentDate = normalizeDate(input.appointmentDate)
  for (const field of activity.form) {
    const value = String(normalized[field.name] || '').trim()
    if (field.required && !value) return failure(`请填写${field.label}`, 'ACTIVITY_INPUT_REQUIRED', { field: field.name })
    if (!value) continue
    if (field.minLength && value.length < field.minLength) return failure(`${field.label}内容过短`, 'ACTIVITY_INPUT_INVALID', { field: field.name })
    if (field.maxLength && value.length > field.maxLength) return failure(`${field.label}内容过长`, 'ACTIVITY_INPUT_INVALID', { field: field.name })
    if (field.pattern && !new RegExp(field.pattern).test(value)) return failure(`${field.label}格式不正确`, 'ACTIVITY_INPUT_INVALID', { field: field.name })
    if (field.options) {
      const values = field.options.map((item) => String(typeof item === 'object' ? item.value : item))
      if (!values.includes(value)) return failure(`${field.label}选项无效`, 'ACTIVITY_INPUT_INVALID', { field: field.name })
    }
    normalized[field.name] = value
  }
  if (!normalized.ownerName) return failure('当前登录会话缺少机主姓名', 'ACTIVITY_OWNER_NAME_MISSING')
  if (normalized.identityNo && !validateIdentityNo(normalized.identityNo)) {
    return failure('身份证号码格式或校验位不正确', 'ACTIVITY_IDENTITY_INVALID')
  }
  if (normalized.appointmentDate && !/^\d{8}$/.test(normalized.appointmentDate)) {
    return failure('预约日期格式不正确', 'ACTIVITY_APPOINTMENT_INVALID')
  }
  if (normalized.appointmentSlot && !normalized.appointmentDate) {
    return failure('选择预约时间段时必须同时选择日期', 'ACTIVITY_APPOINTMENT_INVALID')
  }
  return { ok: true, data: normalized }
}

function renderStep(activity, name, input, session) {
  const definition = activity.steps[name]
  if (!definition) return null
  return renderTemplate(definition, {
    activity,
    input,
    session: { userInfo: session.userInfo || null },
  })
}

async function runStep(session, activity, name, input = {}) {
  const step = renderStep(activity, name, input, session)
  if (!step) return { ok: true, data: null, skipped: true }
  const startedAt = Date.now()
  const result = await executePortalActivityStep(session, step)
  await logEvent('activity:step', {
    sessionId: session.id,
    activityId: activity.id,
    step: name,
    status: result.status || 0,
    ok: result.ok,
    errorCode: result.errorCode || '',
    durationMs: Date.now() - startedAt,
  })
  return result
}

export async function checkActivity(session, activity) {
  const eligibility = await runStep(session, activity, 'eligibility')
  if (!eligibility.ok) return failure(eligibility.message || '活动资格检查失败', eligibility.errorCode || 'ACTIVITY_CHECK_FAILED')
  const eligible = isEligible(eligibility.data)
  let existingBroadband = false
  if (eligible && activity.steps.existingBroadband) {
    const existing = await runStep(session, activity, 'existingBroadband')
    if (existing.ok) existingBroadband = hasExistingBroadband(existing.data)
  }
  return {
    ok: true,
    data: {
      eligible,
      existingBroadband,
      message: eligible
        ? existingBroadband
          ? '当前号码具备活动资格，但已存在一条融合宽带。'
          : '当前号码具备活动资格。'
        : '当前号码不满足活动资格，仍可尝试提交，以北京移动最终受理结果为准。',
    },
  }
}

export function previewActivity(session, activity, input) {
  const validation = validateInput(activity, input, session)
  if (!validation.ok) return validation
  const step = renderStep(activity, 'commit', validation.data, session)
  return {
    ok: true,
    data: {
      activityId: activity.id,
      product: activity.product,
      owner: validation.data.ownerName,
      request: sanitize({ path: step.path, body: step.body }),
    },
  }
}

function cleanupConfirmations() {
  const cutoff = Date.now() - IDEMPOTENCY_TTL_MS
  for (const [key, value] of completedConfirmations) {
    if (value.completedAt < cutoff) completedConfirmations.delete(key)
  }
}

export async function subscribeActivity(session, activity, input, options = {}) {
  cleanupConfirmations()
  if (options.agreed !== true) return failure('请先阅读并同意活动规则与家庭宽带业务协议', 'ACTIVITY_AGREEMENT_REQUIRED')
  const confirmationId = String(options.confirmationId || '').trim()
  if (!/^[A-Za-z0-9_-]{8,80}$/.test(confirmationId)) return failure('订阅确认标识无效', 'ACTIVITY_CONFIRMATION_INVALID')
  const lockKey = `${session.id}:${activity.id}`
  const idempotencyKey = `${lockKey}:${confirmationId}`
  const previous = completedConfirmations.get(idempotencyKey)
  if (previous) return { ...previous.result, idempotent: true }
  if (running.has(lockKey)) return failure('该账号的活动订阅正在处理中，请勿重复提交', 'ACTIVITY_ALREADY_RUNNING')

  const validation = validateInput(activity, input, session)
  if (!validation.ok) return validation
  const normalized = validation.data
  running.add(lockKey)
  const executionId = randomUUID()
  try {
    await logEvent('activity:subscribe:start', { executionId, sessionId: session.id, activityId: activity.id })
    const check = await checkActivity(session, activity)
    if (!check.ok) return check
    if (!check.data.eligible) {
      await logEvent('activity:eligibility:override', {
        executionId,
        sessionId: session.id,
        activityId: activity.id,
        eligible: false,
      })
    }
    if (check.data.existingBroadband) return failure(check.data.message, 'ACTIVITY_EXISTING_BROADBAND')

    const precheck = await runStep(session, activity, 'precheck', normalized)
    if (!precheck.ok) return failure(precheck.message || '产品办理条件检查失败', precheck.errorCode || 'ACTIVITY_PRECHECK_FAILED')
    const precheckData = nestedBusinessResult(precheck.data) || {}
    if (precheckData.code && precheckData.code !== 'success') return failure('产品办理条件检查失败', 'ACTIVITY_PRECHECK_FAILED')
    const conditions = precheckData.data || precheckData
    if (conditions.message && conditions.message !== 'Y') return failure(String(conditions.message), 'ACTIVITY_PRECHECK_REJECTED')
    if (conditions.isBlack === 'Y') return failure('当前号码无法办理本活动，请联系10086或营业厅咨询', 'ACTIVITY_BLACKLISTED')

    if (conditions.isRealName !== 'Y') {
      if (!normalized.identityNo) return failure('当前号码需要补充身份证号码完成实名匹配', 'ACTIVITY_IDENTITY_REQUIRED')
      const realName = await runStep(session, activity, 'realName', normalized)
      if (!realName.ok) return failure(realName.message || '实名匹配失败', realName.errorCode || 'ACTIVITY_REAL_NAME_FAILED')
      const realNameData = nestedBusinessResult(realName.data) || {}
      if (realNameData.code !== 'success' || String(valueAt(realNameData, 'data.message') ?? realNameData.message) !== 'true') {
        return failure('报装姓名和身份证号不匹配，请核对并修改', 'ACTIVITY_REAL_NAME_MISMATCH')
      }
    }

    const commit = await runStep(session, activity, 'commit', normalized)
    if (!commit.ok) return failure(commit.message || '活动订阅提交失败', commit.errorCode || 'ACTIVITY_COMMIT_FAILED')
    const commitData = nestedBusinessResult(commit.data) || {}
    if (commitData.code !== 'success') {
      return failure(String(commitData.message || '活动订阅未被受理'), 'ACTIVITY_COMMIT_REJECTED', { code: commitData.code || '' })
    }
    const result = {
      ok: true,
      data: {
        executionId,
        accepted: true,
        code: commitData.code,
        message: '活动报装已受理，最终以地址覆盖核实和工作人员装机确认为准。',
      },
    }
    completedConfirmations.set(idempotencyKey, { completedAt: Date.now(), result })
    await logEvent('activity:subscribe:done', { executionId, sessionId: session.id, activityId: activity.id, accepted: true })
    return result
  } finally {
    running.delete(lockKey)
  }
}

export const activityInternals = { isEligible, hasExistingBroadband, nestedBusinessResult, validateIdentityNo, validateInput }

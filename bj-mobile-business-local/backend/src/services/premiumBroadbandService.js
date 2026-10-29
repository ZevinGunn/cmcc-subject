import { executePortalActivityStep } from './portalClient.js'

const API_BASE = '/portal-bff/api/ajybz/v1.0'
const RESULT_PATH = '/portal-bff/api/pcConsole/v1.0/showBLJG'
const REFERER_PATH = '/nwt/portal/qqtzxBroadbandOrder'

function failure(message, errorCode) {
  return { ok: false, message, errorCode }
}

function cleanText(value, maxLength = 500) {
  return String(value ?? '').trim().slice(0, maxLength)
}

function object(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : null
}

function responseValue(result) {
  return result?.raw ?? result?.data ?? null
}

function nestedBusinessData(value) {
  let current = value
  for (let depth = 0; depth < 4; depth += 1) {
    const record = object(current)
    if (!record) break
    if ('code' in record || 'isRealName' in record || 'isBlack' in record || 'message' in record) return record
    if (!('data' in record) || record.data === current) break
    current = record.data
  }
  return object(current) || {}
}

function businessCode(result) {
  const raw = object(responseValue(result)) || {}
  const data = nestedBusinessData(raw)
  return cleanText(raw.code ?? data.code ?? (result?.ok ? 'HTTP_2XX' : `HTTP_${result?.status || 0}`), 80)
}

function publicStep(result) {
  const envelope = nestedBusinessData(responseValue(result))
  const data = object(envelope.data) || envelope
  return {
    transportOk: Boolean(result?.ok),
    status: Number(result?.status || 0),
    code: businessCode(result),
    message: cleanText(envelope.message ?? data.message ?? result?.message),
    response: responseValue(result),
  }
}

function itemCode(value) {
  const normalized = cleanText(value, 80)
  return /^[A-Za-z0-9._:-]{1,80}$/.test(normalized) ? normalized : ''
}

async function runPortal(session, path, body, run = executePortalActivityStep) {
  return run(session, {
    method: 'POST',
    path,
    body,
    refererPath: REFERER_PATH,
  })
}

export async function initializePremiumBroadband(session, run = executePortalActivityStep) {
  const result = await runPortal(session, `${API_BASE}/indexQQTZX`, {}, run)
  return { ok: true, data: publicStep(result) }
}

export async function checkPremiumBroadband(session, input = {}, run = executePortalActivityStep) {
  const normalizedItemCode = itemCode(input.itemCode)
  if (!normalizedItemCode) return failure('产品 itemCode 格式不正确', 'PREMIUM_BROADBAND_ITEM_CODE_INVALID')
  const result = await runPortal(session, `${API_BASE}/checkMobile`, { itemCode: normalizedItemCode }, run)
  return { ok: true, data: publicStep(result) }
}

export async function submitPremiumBroadband(session, input = {}, run = executePortalActivityStep) {
  const normalizedItemCode = itemCode(input.itemCode)
  if (!normalizedItemCode) return failure('产品 itemCode 格式不正确', 'PREMIUM_BROADBAND_ITEM_CODE_INVALID')

  const ownerName = cleanText(input.ownerName, 50)
  const identityNumber = cleanText(input.identityNumber, 20).toUpperCase()
  const address = cleanText(input.address, 320)
  const contactPhone = cleanText(input.contactPhone, 20)
  const installDate = cleanText(input.installDate, 8)
  const timeSlot = cleanText(input.timeSlot, 2)
  if (!address || !/^1\d{10}$/.test(contactPhone) || !/^\d{8}$/.test(installDate) || !['1', '2', '3', '4'].includes(timeSlot)) {
    return failure('尊享宽带提交参数不完整', 'PREMIUM_BROADBAND_INPUT_INVALID')
  }

  const precheckResult = await runPortal(
    session,
    `${API_BASE}/checkMobile`,
    { itemCode: normalizedItemCode },
    run,
  )
  const precheck = publicStep(precheckResult)
  const precheckEnvelope = nestedBusinessData(responseValue(precheckResult))
  const precheckData = object(precheckEnvelope.data) || precheckEnvelope

  let realName
  if (cleanText(precheckData.isRealName).toUpperCase() !== 'Y' && ownerName && identityNumber) {
    realName = publicStep(await runPortal(
      session,
      `${API_BASE}/checkRealName`,
      { ID: identityNumber, NAME: ownerName },
      run,
    ))
  }

  const commitResult = await runPortal(session, `${API_BASE}/commitQQTZX`, {
    item_code: normalizedItemCode,
    address,
    lx_phoneNo: contactPhone,
    lx_name: ownerName,
    pre_date: installDate,
    pre_date_quantum: timeSlot,
  }, run)
  const commit = publicStep(commitResult)

  let resultQuery
  if (commit.transportOk && commit.code === 'success') {
    resultQuery = publicStep(await runPortal(session, RESULT_PATH, {}, run))
  }

  return {
    ok: true,
    data: {
      precheck,
      ...(realName ? { realName } : {}),
      commit,
      ...(resultQuery ? { resultQuery } : {}),
    },
  }
}

export const premiumBroadbandInternals = {
  businessCode,
  nestedBusinessData,
  publicStep,
}

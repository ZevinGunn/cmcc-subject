import { executePortalActivityStep } from '../../portalClient.js'
import { isUncertainNetworkError, QuickOrderError } from '../errors.js'
import { maskPhone, record, requireUpstream, text } from './common.js'

const INIT_PATH = '/portal-bff/api/mPersonBusi/v1.0/HCLLFFInitData'
const COMMIT_PATH = '/portal-bff/api/sjyw/biz/core/v1.0/compositeCommit'

function unwrap(value) {
  let current = value
  for (let index = 0; index < 3; index += 1) {
    const item = record(current)
    if (!item.data || item.resultCode || item.result || item.smsType || item.resType) break
    current = item.data
  }
  return record(current)
}

function businessCode(result) {
  return text(result?.raw?.code || result?.data?.code, 80)
}

function message(result, fallback) {
  return text(result?.raw?.message || result?.data?.message || result?.message || fallback, 500)
}

async function step(context, request) {
  const result = await executePortalActivityStep(context.portalSession, request)
  requireUpstream(result.ok, result.message || '北京移动门户接口调用失败', result.errorCode || 'NORTH_UPSTREAM_FAILED')
  return result
}

export const northAdapter = {
  async create({ portalSession }) {
    if (!portalSession?.accessToken) throw new QuickOrderError('当前北京移动会话未完成登录', 'NORTH_NOT_LOGGED_IN', 401)
    const phone = portalSession.userInfo?.mobile || portalSession.userInfo?.phone || ''
    return {
      privateContext: { portalSession, optionIds: new Set(), payload: null, sms: null },
      publicContext: { maskedPhone: maskPhone(phone), authSummary: '已连接当前北京移动门户会话' },
    }
  },

  async prepare(context) {
    const result = await step(context, { method: 'POST', path: INIT_PATH, body: {} })
    const data = unwrap(result.data)
    const eligibilityCode = text(data.resultCode, 30)
    const eligible = eligibilityCode === '00'
    const alreadyOrdered = ['11', '33'].includes(eligibilityCode)
    const productCode = text(data.productCode, 128)
    const planFee = text(data.plan_fee ?? data.planFee, 80)
    const description = text(data.productDesc || data.productName || '欢畅流量翻番', 2000)
    context.optionIds = new Set(productCode ? [productCode] : [])
    context.initData = data
    return {
      name: text(data.productName, 200) || '欢畅流量翻番',
      code: 'HCLLFF26',
      description,
      eligible,
      eligibilityMessage: eligible ? '当前号码符合办理条件' : alreadyOrdered ? '当前号码已办理该活动' : message(result, `当前号码不可办理（${eligibilityCode || '无资格码'}）`),
      options: productCode ? [{ id: productCode, name: text(data.LL, 80) ? `欢畅流量翻番-${data.LL}` : '实时可办档位', feeText: planFee ? `承诺消费 ${planFee} 元` : '以实时规则为准' }] : [],
      protocol: { name: '欢畅流量翻番业务规则', content: description || '以北京移动实时返回的业务规则为准。' },
      warnings: ['可能涉及承诺消费、合约期和提前退订费用，请核对实时规则。'],
    }
  },

  async select(context, option) {
    if (!context.optionIds.has(option.id)) throw new QuickOrderError('所选北移资源已失效，请重新读取产品', 'NORTH_OPTION_STALE', 409)
    const planFee = text(context.initData?.plan_fee ?? context.initData?.planFee, 80)
    context.payload = {
      common: { operType: 'commitProductNew' },
      body: { content: { packageId: '55412', packageCode: 'HCLLFF26', productShowCode: option.id, pitemShowCode: 'KT', mtOtherParams: `1-${planFee}` } },
    }
    return { id: option.id, name: option.name, feeText: option.feeText, effectText: '以北京移动实时规则为准' }
  },

  async sendSms(context) {
    if (!context.payload) throw new QuickOrderError('请先选择实时可办资源', 'NORTH_SELECTION_REQUIRED', 409)
    let first
    try {
      first = await step(context, { method: 'POST', path: COMMIT_PATH, body: context.payload })
    } catch (error) {
      if (isUncertainNetworkError(error)) throw new QuickOrderError('北移首次提交响应未确认', 'NORTH_FIRST_COMMIT_UNKNOWN', 424, { uncertain: true })
      throw error
    }
    const data = unwrap(first.data)
    const code = businessCode(first)
    const smsRequired = ['need_sms_check', 'smsVerification'].includes(code) || Boolean(data.smsType)
    if (!smsRequired) {
      if (first.raw?.success === false || (code && code !== 'bizSuccess')) {
        return { finalResult: { accepted: false, uncertain: false, code: code || 'NORTH_REJECTED', message: message(first, '北移业务未受理') } }
      }
      if (code !== 'bizSuccess') {
        return { finalResult: { accepted: true, uncertain: true, code: code || 'NORTH_RESULT_UNCONFIRMED', message: '北移首次提交返回了未识别结果，请通过官方渠道核验，不要重复提交。' } }
      }
      return { finalResult: { accepted: true, uncertain: false, code, message: '北京移动已受理业务订购请求。' } }
    }
    const typeKey = text(data.typeKey, 500)
    if (!typeKey) throw new QuickOrderError('短信确认响应缺少产品校验标识', 'NORTH_SMS_CONTEXT_INVALID', 424)
    context.sms = { typeKey, smsType: text(data.smsType, 80) || 'need_sms_check_v1' }
    const v2 = context.sms.smsType === 'need_sms_check_v2'
    const sent = await step(context, {
      method: 'GET',
      path: v2 ? '/portal-bff/api/mtsms/v1.0/sendDXSMSV2' : '/portal-bff/api/mtsms/v1.0/sendDXSMS',
      queryMode: v2 ? 'clear' : 'encrypted',
      query: { productKey: typeKey, mtOtherParams: context.payload.body.content.mtOtherParams },
    })
    if (sent.raw?.success === false) throw new QuickOrderError(message(sent, '北移短信发送失败'), 'NORTH_SMS_SEND_FAILED', 424)
    return { message: '北京移动确认短信已发送。' }
  },

  async confirm(context, smsCode) {
    if (!context.sms || !context.payload) throw new QuickOrderError('短信确认上下文不存在或已过期', 'NORTH_SMS_CONTEXT_MISSING', 409)
    const checked = await step(context, {
      method: 'GET', path: '/portal-bff/api/mtsms/v1.0/checkDxCodeForMT',
      query: { smsCode, productKey: context.sms.typeKey, mtOtherParams: context.payload.body.content.mtOtherParams },
    })
    const checkedData = unwrap(checked.data)
    if (text(checkedData.result || checkedData.data?.result, 40) !== '00000') {
      throw new QuickOrderError('短信验证码不正确，请重新输入', 'SMS_CODE_MISMATCH', 400, { recoverable: true })
    }
    const result = await step(context, { method: 'POST', path: COMMIT_PATH, body: context.payload })
    const code = businessCode(result)
    if (result.raw?.success === false || (code && code !== 'bizSuccess')) {
      return { accepted: false, uncertain: false, code: code || 'NORTH_REJECTED', message: message(result, '北移业务未受理') }
    }
    if (code !== 'bizSuccess') return { accepted: true, uncertain: true, code: code || 'NORTH_RESULT_UNCONFIRMED', message: '北移最终响应语义未确认，请通过官方渠道核验，不要重复提交。' }
    return { accepted: true, uncertain: false, code, message: '北京移动已受理业务订购请求。' }
  },
}

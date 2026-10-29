import { CookieJar } from 'tough-cookie'
import { encodeForm, requestWithJar } from '../../../utils/http.js'
import { QuickOrderError } from '../errors.js'
import { array, maskPhone, parseNestedJson, record, text } from './common.js'

const ORIGIN = 'https://ysmapp.bj.10086.cn'
const ENTRY_PATH = '/app/channel-web/busiCore/showCustomIndex.action'
const WARE_PACKAGE_ID = 'A1000770'
const WARE_TYPE_ID = 'B1001605'

function validateEntry(value) {
  let url
  try {
    url = new URL(String(value || ''))
  } catch {
    throw new QuickOrderError('请输入完整有效的网格通入口 URL', 'GRID_ENTRY_INVALID', 400)
  }
  if (url.origin !== ORIGIN || url.pathname !== ENTRY_PATH || url.username || url.password || url.port || url.hash) {
    throw new QuickOrderError('网格通入口域名或路径不在允许范围内', 'GRID_ENTRY_NOT_ALLOWED', 400)
  }
  if (url.searchParams.get('submitWarePackageId') !== WARE_PACKAGE_ID || url.searchParams.get('channel') !== 'app_share') {
    throw new QuickOrderError('入口不是欢畅流量翻番网格通链接', 'GRID_ENTRY_MISMATCH', 400)
  }
  for (const key of ['code', 'empCode', 'nbc']) {
    if (!url.searchParams.get(key)) throw new QuickOrderError(`网格通入口缺少 ${key} 参数`, 'GRID_ENTRY_CONTEXT_MISSING', 400)
  }
  return url
}

function xhrHeaders(context, final = false) {
  return {
    Accept: final ? 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' : 'application/json, text/javascript, */*; q=0.01',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Origin: ORIGIN,
    Referer: context.entryUrl.toString(),
    'User-Agent': context.userAgent,
    ...(final ? {} : { 'X-Requested-With': 'XMLHttpRequest' }),
  }
}

function parseResponse(value, label) {
  try {
    return typeof value === 'string' ? JSON.parse(value) : value
  } catch {
    throw new QuickOrderError(`${label}响应格式无法解析`, 'GRID_RESPONSE_FORMAT', 424)
  }
}

async function post(context, path, form, { final = false } = {}) {
  const res = await requestWithJar({
    jar: context.jar, url: new URL(path, ORIGIN).toString(), method: 'POST', headers: xhrHeaders(context, final),
    data: encodeForm(form), maxAttempts: final ? 1 : 2, timeout: final ? 30_000 : 20_000,
  })
  if (res.status < 200 || res.status >= 400) throw new QuickOrderError(`网格通接口 HTTP ${res.status}`, 'GRID_UPSTREAM_HTTP', 424, final ? { uncertain: true } : {})
  return final ? res : parseResponse(res.data, '网格通接口')
}

function ensureSuccess(payload, fallback) {
  if (text(payload?.errorCode, 80) !== 'success') throw new QuickOrderError(text(payload?.errorMsg, 500) || fallback, 'GRID_REJECTED', 424)
}

function baseForm(context) {
  return {
    submitPhoneNO: context.phone,
    submitWareTypeId: context.selectedPlan ? WARE_TYPE_ID : '',
    submitWarePlanId: context.selectedPlan?.id || '',
    submitWarePackageId: WARE_PACKAGE_ID,
    nbc: context.entryUrl.searchParams.get('nbc') || '',
    submitCheckCode: '',
    submitSelectedInfo: context.selectedPlan ? `欢畅流量翻番活动+${context.selectedPlan.name}` : '',
    submitCheckCodeId: context.challengeId || '',
    submitChannel: 'app_share',
    submitCode: context.entryUrl.searchParams.get('code') || '',
    submitEmpCode: context.entryUrl.searchParams.get('empCode') || '',
    token: context.commitToken || '',
  }
}

export const gridAdapter = {
  async create({ auth, userAgent }) {
    const phone = text(auth?.phone, 20).replace(/\s+/g, '')
    if (!/^1\d{10}$/.test(phone)) throw new QuickOrderError('请输入正确的 11 位手机号', 'INVALID_PHONE', 400)
    const entryUrl = validateEntry(auth?.entryUrl)
    const context = { jar: new CookieJar(), entryUrl, phone, userAgent, plans: new Map(), selectedPlan: null, challengeId: '', commitToken: '' }
    const entry = await requestWithJar({ jar: context.jar, url: entryUrl.toString(), method: 'GET', headers: { 'User-Agent': userAgent, Accept: 'text/html,application/xhtml+xml' }, maxAttempts: 2 })
    if (entry.status < 200 || entry.status >= 400) throw new QuickOrderError(`网格通入口 HTTP ${entry.status}`, 'GRID_ENTRY_HTTP', 424)
    return { privateContext: context, publicContext: { maskedPhone: maskPhone(phone), authSummary: '可信入口已加载，渠道上下文已锁定' } }
  },

  async prepare(context) {
    const form = baseForm(context)
    const validated = await post(context, '/app/channel-web/busiCore/customerValidateAndIsHaveOrderedForHCLLFFHD.action', form)
    ensureSuccess(validated, '网格通客户资格校验失败')
    const plansPayload = await post(context, '/app/channel-web/busiCoreCommon/queryWarePlansGetPlanFeeFormBIAndTERMBUNDCheck001.action', { ...form, submitWareTypeId: WARE_TYPE_ID })
    ensureSuccess(plansPayload, '网格通可办档位查询失败')
    const entity = record(parseNestedJson(plansPayload.entity))
    const plans = array(entity.warePlans).map(record).map((item) => ({
      id: text(item.WARE_PLAN_ID, 100), name: text(item.WARE_PLAN_NAME, 200), feeText: text(item.PLAN_FEE, 100) || '以实时规则为准',
    })).filter((item) => item.id && item.name)
    if (!plans.length) throw new QuickOrderError('当前号码没有网格通可办档位', 'GRID_PLANS_EMPTY', 409)
    context.plans = new Map(plans.map((item) => [item.id, item]))
    context.arpuAvg = text(entity.arpuAvg, 100)
    return {
      name: '欢畅流量翻番', code: WARE_TYPE_ID,
      description: '网格通渠道实时返回的欢畅流量翻番活动档位。', eligible: true, eligibilityMessage: '客户资格校验通过',
      options: plans, protocol: { name: '网格通业务办理规则', content: '档位、承诺消费和退订规则以网格通实时页面及短信确认内容为准。' },
      warnings: [context.arpuAvg ? `近六个月平均消费：${context.arpuAvg}` : '未返回近六个月平均消费', '入口渠道参数和本次手机号已绑定，不可在流程中替换。'],
    }
  },

  async select(context, option) {
    const plan = context.plans.get(option.id)
    if (!plan) throw new QuickOrderError('所选网格通档位已失效，请重新读取产品', 'GRID_PLAN_STALE', 409)
    context.selectedPlan = plan
    context.challengeId = ''
    context.commitToken = ''
    return { ...plan, effectText: '以网格通结果页和实际生效情况为准' }
  },

  async sendSms(context) {
    if (!context.selectedPlan) throw new QuickOrderError('请先选择网格通档位', 'GRID_SELECTION_REQUIRED', 409)
    const payload = await post(context, '/app/channel-web/SmsSend/sendMessageWithDxFromRedisByWareTypeId.action', baseForm(context))
    ensureSuccess(payload, '网格通订购短信发送失败')
    const challengeId = text(payload.errorMsg, 1000)
    if (!challengeId) throw new QuickOrderError('网格通短信响应缺少挑战号', 'GRID_CHALLENGE_MISSING', 424)
    context.challengeId = challengeId
    context.commitToken = ''
    return { message: '网格通订购验证码已发送。' }
  },

  async confirm(context, smsCode) {
    if (!context.challengeId) throw new QuickOrderError('网格通短信挑战已过期，请重新发送', 'GRID_CHALLENGE_MISSING', 409, { recoverable: true })
    const checked = await post(context, '/app/channel-web/busiCore/checkSmsCode.action', { ...baseForm(context), submitCheckCode: smsCode })
    if (text(checked.errorCode, 80) === 'error') throw new QuickOrderError(text(checked.errorMsg, 500) || '短信验证码不正确', 'SMS_CODE_MISMATCH', 400, { recoverable: true })
    context.commitToken = text(checked.entity, 5000)
    if (!context.commitToken) throw new QuickOrderError('验证码通过但未取得一次性提交令牌', 'GRID_COMMIT_TOKEN_MISSING', 424)
    const res = await post(context, '/app/channel-web/busiCore/commitCYDS.action', { ...baseForm(context), submitCheckCode: smsCode }, { final: true })
    context.commitToken = ''
    const html = text(res.data, 200000)
    if (/(办理|订购|受理)(已)?成功/.test(html) && !/(失败|错误|未成功)/.test(html)) {
      return { accepted: true, uncertain: false, code: 'GRID_ACCEPTED', message: '网格通结果页显示业务办理成功。' }
    }
    if (/(办理失败|订购失败|受理失败|不符合办理|已办理)/.test(html)) {
      return { accepted: false, uncertain: false, code: 'GRID_REJECTED', message: html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 300) || '网格通未受理业务订购请求。' }
    }
    return { accepted: true, uncertain: true, code: 'GRID_RESULT_UNCONFIRMED', message: '网格通已返回结果页，但缺少已验证的成功标志。请通过官方渠道核验，不要重复提交。' }
  },
}

export const gridInternals = { validateEntry, baseForm }

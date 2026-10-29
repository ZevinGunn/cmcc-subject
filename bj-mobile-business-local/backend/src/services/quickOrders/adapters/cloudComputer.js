import { CookieJar } from 'tough-cookie'
import { parseJsonMaybeBase64, requestWithJar } from '../../../utils/http.js'
import { QuickOrderError } from '../errors.js'
import { maskPhone, record, text } from './common.js'

const ORIGIN = 'https://mop.bmcc.com.cn'
const BASE = `${ORIGIN}/mkt_web/`
const CHANNEL_CODE = '173'
const MKT_CODE = '98fd4c5440394f42b012112e8ccb7076'
const PAGE_CODE = '94d4682c390e4a8b876d22a2d46505b9'
const APP_USER_AGENT = 'Mozilla/5.0 (iPad; CPU OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148/wkwebview leadeon/12.1.3/CMCCIT'
const PRODUCT_CONFIG = [
  { id: '78870ece2bdf42bc8a278e9e9bc595ea', name: '家庭云电脑畅享版月包', feeText: '19.9 元/月', hardware: '4 核 CPU / 8 GB 内存 / 80 GB 磁盘' },
  { id: '78289f7840634282b781f28576bbace5', name: '家庭云电脑高级版月包', feeText: '29.9 元/月', hardware: '8 核 CPU / 16 GB 内存 / 80 GB 磁盘' },
]

function headers(context) {
  return {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json;charset=utf-8',
    Origin: ORIGIN,
    Referer: `${ORIGIN}/statics/page/mkt/`,
    'User-Agent': APP_USER_AGENT,
    ...(context.sessionToken && context.headerName ? { [context.headerName]: context.sessionToken } : {}),
  }
}

function htmlToText(value) {
  return text(value, 30000)
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/p>|<\/div>|<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function normalizePayload(value, label, { uncertain = false } = {}) {
  try {
    const root = record(parseJsonMaybeBase64(value))
    const data = record(root.data)
    return {
      success: root.success !== false,
      code: text(data.code ?? root.code, 80),
      message: text(data.msg ?? root.msg ?? root.message, 1000),
      object: data.obj !== undefined ? data.obj : root.obj,
    }
  } catch {
    throw new QuickOrderError(`${label}响应格式无法解析`, 'CLOUD_RESPONSE_FORMAT', 424, uncertain ? { uncertain: true } : {})
  }
}

export function createCloudComputerAdapter({ request = requestWithJar } = {}) {
  async function call(context, path, body, { final = false, singleAttempt = false, uncertainOnFailure = false } = {}) {
    let res
    try {
      res = await request({
        jar: context.jar,
        url: new URL(path, BASE).toString(),
        method: 'POST',
        headers: headers(context),
        data: JSON.stringify(body),
        timeout: final ? 30_000 : 20_000,
        maxAttempts: final || singleAttempt ? 1 : 2,
        allowLegacyRenegotiation: true,
      })
    } catch (error) {
      if (final) throw new QuickOrderError('云电脑最终请求响应未确认', 'CLOUD_FINAL_NETWORK_UNKNOWN', 424, { uncertain: true })
      if (uncertainOnFailure) throw new QuickOrderError('云电脑短信请求响应未确认', 'CLOUD_SMS_NETWORK_UNKNOWN', 424, { uncertain: true })
      if (singleAttempt) throw new QuickOrderError('中国移动 App Token 认证请求失败，请获取新 Token 后重试', 'CLOUD_AUTH_NETWORK_FAILED', 424)
      throw error
    }
    if (res.status < 200 || res.status >= 300) {
      throw new QuickOrderError(`云电脑接口 HTTP ${res.status}`, 'CLOUD_UPSTREAM_HTTP', 424, final || uncertainOnFailure ? { uncertain: true } : {})
    }
    return normalizePayload(res.data, '云电脑接口', { uncertain: final })
  }

  function ensureCode(payload, fallback) {
    if (!payload.success || payload.code !== '200') {
      throw new QuickOrderError(payload.message || fallback, payload.code || 'CLOUD_REJECTED', 424)
    }
  }

  return {
    async create({ auth }) {
      const appToken = text(auth?.appToken, 5000)
      if (appToken.length < 16) throw new QuickOrderError('请输入新鲜的中国移动 App 一键登录 Token', 'CLOUD_APP_TOKEN_REQUIRED', 400)
      const context = {
        jar: new CookieJar(),
        appToken,
        sessionToken: '',
        headerName: '',
        phone: '',
        products: new Map(),
        selected: null,
      }
      const login = await call(context, 's/login/decryptPhoneByTokenJt', {
        token: appToken,
        channelCode: CHANNEL_CODE,
        mktCode: MKT_CODE,
      }, { singleAttempt: true })
      ensureCode(login, '中国移动 App Token 认证失败')
      const account = record(login.object)
      context.phone = text(account.phone, 20)
      context.sessionToken = text(account.token, 5000)
      context.headerName = text(account.headerName, 100)
      context.appToken = ''
      if (!/^1\d{10}$/.test(context.phone) || !context.sessionToken || !/^[A-Za-z0-9_-]{1,80}$/.test(context.headerName)) {
        throw new QuickOrderError('云电脑登录接口未返回有效会话', 'CLOUD_LOGIN_CONTEXT_INVALID', 424)
      }
      return {
        privateContext: context,
        publicContext: { maskedPhone: maskPhone(context.phone), authSummary: '中国移动 App 一键登录已认证' },
      }
    },

    async prepare(context) {
      const status = await call(context, 's/marketInfo/getMarketStatus', { mktCode: MKT_CODE, channelCode: CHANNEL_CODE })
      ensureCode(status, '云电脑活动状态查询失败')
      const market = record(status.object)
      if (Number(market.status) !== 1) throw new QuickOrderError('云电脑活动当前未开放', 'CLOUD_MARKET_CLOSED', 409)

      const options = []
      context.products.clear()
      for (const configured of PRODUCT_CONFIG) {
        const payload = await call(context, 's/productInfo/getProductInfo', { channelCode: CHANNEL_CODE, productCode: configured.id })
        ensureCode(payload, '云电脑产品查询失败')
        const item = Array.isArray(payload.object) ? record(payload.object[0]) : record(payload.object)
        if (text(item.productCode, 80) !== configured.id) throw new QuickOrderError('云电脑产品编码与实时响应不一致', 'CLOUD_PRODUCT_MISMATCH', 424)
        const option = {
          id: configured.id,
          name: text(item.productName, 200) || configured.name,
          feeText: configured.feeText,
          hardware: configured.hardware,
          description: htmlToText(item.descr),
        }
        context.products.set(option.id, option)
        options.push({ id: option.id, name: option.name, feeText: `${option.feeText} · ${option.hardware}` })
      }
      return {
        name: '家庭云电脑',
        code: '25BJ200210/25BJ200211',
        description: '北京移动营销平台实时返回的家庭云电脑连续包月产品。',
        eligible: true,
        eligibilityMessage: '活动开放，选择档位后读取当前号码的订购确认信息',
        options,
        protocol: null,
        warnings: ['产品立即生效并立即计费，次月自动续订。', '不同档位可同时订购；同一档位有效期内不可重复订购。', '退订后月底失效，资源到期保留 15 天后将被回收。'],
      }
    },

    async select(context, option) {
      const product = context.products.get(option.id)
      if (!product) throw new QuickOrderError('所选云电脑产品已失效，请重新读取产品', 'CLOUD_PRODUCT_STALE', 409)
      const payload = await call(context, 's/orderConfirm/getMarketProInfo', { productCode: product.id, mktCode: MKT_CODE })
      ensureCode(payload, '云电脑订购确认信息查询失败')
      const info = record(payload.object)
      const responsePhone = text(info.phone, 20)
      if (responsePhone && responsePhone !== context.phone) throw new QuickOrderError('订购确认号码与登录号码不一致', 'CLOUD_PHONE_MISMATCH', 409)
      const protocol = htmlToText(info.fullDescr || info.smsTemplate || product.description)
      if (!protocol) throw new QuickOrderError('云电脑订购确认接口未返回业务规则', 'CLOUD_PROTOCOL_MISSING', 424)
      context.selected = { ...product, protocol }
      return {
        id: product.id,
        name: text(info.productName, 200) || product.name,
        feeText: product.feeText,
        effectText: '立即生效、立即计费、连续包月',
        eligible: true,
        eligibilityMessage: '订购确认信息读取成功',
        protocol: { name: '家庭云电脑订购确认及业务规则', content: protocol },
      }
    },

    async sendSms(context) {
      if (!context.selected) throw new QuickOrderError('请先选择云电脑产品', 'CLOUD_SELECTION_REQUIRED', 409)
      const payload = await call(context, 's/orderConfirm/sendOrderConfirmVerifyCode', {
        productCode: context.selected.id,
        mktCode: MKT_CODE,
        pageCode: PAGE_CODE,
      }, { singleAttempt: true, uncertainOnFailure: true })
      ensureCode(payload, '云电脑订购验证码发送失败')
      return { message: '云电脑订购验证码已发送，有效期以短信内容为准。' }
    },

    async confirm(context, smsCode) {
      if (!context.selected) throw new QuickOrderError('云电脑产品选择上下文不存在', 'CLOUD_SELECTION_REQUIRED', 409)
      const payload = await call(context, 's/orderConfirm/marketOrder', {
        mktCode: MKT_CODE,
        productCode: context.selected.id,
        verifyCode: smsCode,
        pageCode: PAGE_CODE,
        channelCode: CHANNEL_CODE,
      }, { final: true })
      if (payload.code === '99904') {
        throw new QuickOrderError(payload.message || '验证码错误', 'SMS_CODE_MISMATCH', 400, { recoverable: true })
      }
      if (payload.code !== '200' || !payload.success) {
        return { accepted: false, uncertain: false, code: payload.code || 'CLOUD_REJECTED', message: payload.message || '云电脑订购未受理' }
      }
      const result = record(payload.object)
      if (!Object.hasOwn(result, 'result')) {
        return { accepted: true, uncertain: true, code: 'CLOUD_RESULT_UNCONFIRMED', message: '云电脑接口返回业务码 200，但缺少可验证的订购结果，请通过官方渠道核验。' }
      }
      const accepted = result.result !== false && String(result.result).toLowerCase() !== 'false'
      return {
        accepted,
        uncertain: false,
        code: accepted ? '200' : 'CLOUD_REJECTED',
        message: text(result.descr, 1000) || (accepted ? '北京移动已受理家庭云电脑订购请求。' : '北京移动未受理家庭云电脑订购请求。'),
      }
    },
  }
}

export const cloudComputerAdapter = createCloudComputerAdapter()

export const cloudComputerInternals = {
  ORIGIN,
  CHANNEL_CODE,
  MKT_CODE,
  PAGE_CODE,
  PRODUCT_CONFIG,
  htmlToText,
}

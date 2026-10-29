import { constants, publicEncrypt } from 'node:crypto'
import { CookieJar } from 'tough-cookie'
import { setBrowserCookies } from '../../../utils/cookieJar.js'
import { parseJsonMaybeBase64, requestWithJar } from '../../../utils/http.js'
import { QuickOrderError } from '../errors.js'
import { maskPhone, record, text } from './common.js'
import { xywBrowserFlow } from './xywBrowser.js'

const ORIGIN = 'https://xyw.bj.10086.cn'
const BASE = `${ORIGIN}/mkt_web/`
const CHANNEL_CODE = '173'
const MKT_CODE = '17a230e954bd28443c5dcdbaacaa8158'
const PAGE_CODE = '40037504236102b839b417e30cd9891e'
const PRODUCT_CODE = 'f98e0730ee990b2b32553e8c571286f9'
const PUBLIC_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxAGiZYJFbbV6fTpYWe/F3dZIRik7UJUAfhWESuKSsM/88yE7MiKxJRRWN6ndkTEiO45KbeyJv6NBUx1W8DEP4nm+TsfeMp+EhQKVpsD3qL2q7iBlNtfSUFd2C8isOXawfuYSRrw0WBRcaMxGdSr53fUPBXX4X/crt4UnntePOSu0A2iLgkqWTBQkZMn/BugUsFu9E6JjzX7su2VBnJ1wQ8fpgSTHIV2Klq2x5/z8CnN1MP6OFRr7yF1HJHu9o2jOxf4OZzasMdKJy10rm0dWn5WXtQ9nnGpJslpTnpSD2nkf8SLCy/KRChNGLRMoZ5/B4rPN0nc9k3mv6PrXF9urbwIDAQAB'

function headers(context) {
  return {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json;charset=UTF-8',
    Origin: ORIGIN,
    Referer: `${ORIGIN}/static/pages/vgop/mkt/`,
    'User-Agent': context.userAgent,
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

function encryptLoginPayload(value) {
  const key = `-----BEGIN PUBLIC KEY-----\n${PUBLIC_KEY.match(/.{1,64}/g).join('\n')}\n-----END PUBLIC KEY-----`
  return publicEncrypt({ key, padding: constants.RSA_PKCS1_PADDING }, Buffer.from(JSON.stringify(value), 'utf8')).toString('base64')
}

function normalizePayload(value, { uncertain = false } = {}) {
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
    throw new QuickOrderError('新业务平台响应格式无法解析', 'XYW_RESPONSE_FORMAT', 424, uncertain ? { uncertain: true } : {})
  }
}

export function createXywAdapter({ request = requestWithJar, browserFlow = xywBrowserFlow } = {}) {
  async function call(context, path, body, { final = false, sms = false, singleAttempt = false } = {}) {
    let response
    try {
      response = await request({
        jar: context.jar,
        url: new URL(path, BASE).toString(),
        method: 'POST',
        headers: headers(context),
        data: JSON.stringify(body),
        timeout: final ? 30_000 : 20_000,
        maxAttempts: final || sms || singleAttempt ? 1 : 2,
        allowLegacyRenegotiation: true,
      })
    } catch (error) {
      if (final) throw new QuickOrderError('最终订购响应未确认', 'XYW_FINAL_NETWORK_UNKNOWN', 424, { uncertain: true })
      if (sms) throw new QuickOrderError('短信发送响应未确认，请等待 60 秒并留意手机短信', 'XYW_SMS_NETWORK_UNKNOWN', 424, { smsMayHaveSent: true })
      throw new QuickOrderError('新业务平台暂时无法连接，请稍后重试', 'XYW_UPSTREAM_NETWORK', 424)
    }
    if (response.status < 200 || response.status >= 300) {
      if (final) throw new QuickOrderError(`最终订购接口 HTTP ${response.status}`, 'XYW_FINAL_HTTP_UNKNOWN', 424, { uncertain: true })
      if (sms) throw new QuickOrderError(`短信接口 HTTP ${response.status}，请等待 60 秒并留意手机短信`, 'XYW_SMS_HTTP_UNKNOWN', 424, { smsMayHaveSent: true })
      throw new QuickOrderError(`新业务平台接口 HTTP ${response.status}`, 'XYW_UPSTREAM_HTTP', 424)
    }
    return normalizePayload(response.data, { uncertain: final })
  }

  function ensureCode(payload, fallback, details = {}) {
    if (!payload.success || payload.code !== '200') {
      throw new QuickOrderError(payload.message || fallback, payload.code || 'XYW_REJECTED', 424, details)
    }
  }

  return {
    async create({ auth, userAgent }) {
      const phone = text(auth?.phone, 20)
      if (!/^1\d{10}$/.test(phone)) throw new QuickOrderError('请输入正确的 11 位手机号', 'XYW_PHONE_INVALID', 400)
      return {
        privateContext: {
          jar: new CookieJar(),
          phone,
          browserStorageState: null,
          sessionToken: '',
          headerName: '',
          userAgent,
          product: null,
          selected: null,
        },
        publicContext: {
          initialStage: 'LOGIN_REQUIRED',
          maskedPhone: maskPhone(phone),
          authSummary: '手机号已就绪，请先完成登录短信验证',
        },
      }
    },

    async sendLoginSms(context) {
      try {
        const output = await browserFlow.sendLoginSms({
          phone: context.phone,
          userAgent: context.userAgent,
          storageState: context.browserStorageState,
        })
        context.browserStorageState = output.storageState
        await setBrowserCookies(context.jar, output.cookies)
        const payload = normalizePayload(output.response)
        ensureCode(payload, '登录验证码发送失败')
        return { message: '登录验证码已发送，请查收短信。' }
      } catch (error) {
        if (error instanceof QuickOrderError && error.details?.smsMayHaveSent) return { message: error.message, uncertain: true }
        if (error instanceof QuickOrderError) throw error
        throw new QuickOrderError('短信发送响应未确认，请等待 60 秒并留意手机短信', 'XYW_SMS_NETWORK_UNKNOWN', 424, { smsMayHaveSent: true })
      }
    },

    async verifyLogin(context, smsCode) {
      let output
      try {
        output = await browserFlow.verifyLogin({
          phone: context.phone,
          smsCode,
          userAgent: context.userAgent,
          storageState: context.browserStorageState,
        })
      } catch {
        throw new QuickOrderError('登录验证响应未确认，请重新输入最新验证码', 'XYW_LOGIN_NETWORK', 424, { recoverable: true })
      }
      context.browserStorageState = output.storageState
      await setBrowserCookies(context.jar, output.cookies)
      const payload = normalizePayload(output.response)
      ensureCode(payload, '登录短信验证失败', { recoverable: true })
      const account = record(payload.object)
      const responsePhone = text(account.phone, 20)
      const headerName = text(account.headerName, 100)
      const sessionToken = text(account.token, 5000)
      if (!sessionToken || !/^[A-Za-z0-9_-]{1,80}$/.test(headerName)) {
        throw new QuickOrderError('登录接口未返回有效会话', 'XYW_LOGIN_CONTEXT_INVALID', 424)
      }
      context.sessionToken = sessionToken
      context.headerName = headerName
      context.loginResponsePhoneMatched = responsePhone === context.phone
      context.browserStorageState = null
      return { maskedPhone: maskPhone(context.phone), authSummary: 'xyw.bj 短信登录已认证' }
    },

    async prepare(context) {
      const status = await call(context, 's/marketInfo/getMarketStatus', { mktCode: MKT_CODE, channelCode: CHANNEL_CODE })
      ensureCode(status, '活动状态查询失败')
      const market = record(status.object)
      if (Number(market.status) !== 1) throw new QuickOrderError('咪咕视频会员年包活动当前未开放', 'XYW_MARKET_CLOSED', 409)

      const [productPayload, rulePayload] = await Promise.all([
        call(context, 's/productInfo/getProductInfo', { channelCode: CHANNEL_CODE, productCode: PRODUCT_CODE }),
        call(context, 's/marketRule/getMarketRule', { channelCode: CHANNEL_CODE, mktCode: MKT_CODE }),
      ])
      ensureCode(productPayload, '产品信息查询失败')
      ensureCode(rulePayload, '办理资格查询失败')
      const item = Array.isArray(productPayload.object) ? record(productPayload.object[0]) : record(productPayload.object)
      if (text(item.productCode, 80) !== PRODUCT_CODE) throw new QuickOrderError('实时产品编码与活动配置不一致', 'XYW_PRODUCT_MISMATCH', 424)
      const eligible = record(rulePayload.object).result === true || String(record(rulePayload.object).result).toLowerCase() === 'true'
      const product = {
        id: PRODUCT_CODE,
        name: text(item.productName, 200) || '咪咕视频会员年包合约',
        description: htmlToText(item.descr),
      }
      context.product = product
      return {
        name: product.name,
        code: text(item.offerId, 80) || PRODUCT_CODE,
        description: '北京移动新业务平台实时返回的咪咕视频钻石会员权益。',
        eligible,
        eligibilityMessage: eligible ? '活动开放，当前号码通过活动规则校验' : '当前号码未通过活动规则校验',
        options: [{ id: PRODUCT_CODE, name: product.name, feeText: '0 元/年 · 有效期 12 个月' }],
        protocol: null,
        warnings: ['立即订购、立即生效，有效期 12 个月。', '12 个月内只能订购一次；退订后权益可使用到月底。', '活动仅限中国移动北京用户，活动时间以实时规则为准。'],
      }
    },

    async select(context, option) {
      if (!context.product || option.id !== context.product.id) throw new QuickOrderError('产品信息已失效，请重新读取', 'XYW_PRODUCT_STALE', 409)
      const payload = await call(context, 's/orderConfirm/getMarketProInfo', { productCode: PRODUCT_CODE, mktCode: MKT_CODE })
      ensureCode(payload, '订购确认信息查询失败')
      const info = record(payload.object)
      const responsePhone = text(info.phone, 20)
      if (responsePhone !== context.phone) {
        throw new QuickOrderError('运营商订购确认号码与办理号码不一致，已阻止发送订购验证码', 'XYW_ORDER_PHONE_MISMATCH', 409)
      }
      const protocol = htmlToText(info.full_descr || info.short_descr || context.product.description)
      if (!protocol) throw new QuickOrderError('订购确认接口未返回业务规则', 'XYW_PROTOCOL_MISSING', 424)
      context.selected = { id: PRODUCT_CODE, protocol }
      return {
        id: PRODUCT_CODE,
        name: text(info.product_name, 200) || context.product.name,
        feeText: '0 元/年',
        effectText: '立即生效，有效期 12 个月',
        eligible: true,
        eligibilityMessage: '办理号码与登录号码一致，订购规则读取成功',
        protocol: { name: '咪咕视频会员年包办理确认', content: protocol },
      }
    },

    async sendSms(context) {
      if (!context.selected) throw new QuickOrderError('请先选择并确认业务', 'XYW_SELECTION_REQUIRED', 409)
      try {
        const payload = await call(context, 's/orderConfirm/sendOrderConfirmVerifyCode', {
          productCode: PRODUCT_CODE,
          mktCode: MKT_CODE,
          channelCode: CHANNEL_CODE,
        }, { sms: true })
        ensureCode(payload, '订购验证码发送失败')
        return { message: '订购验证码已发送，请查收短信。' }
      } catch (error) {
        if (error instanceof QuickOrderError && error.details?.smsMayHaveSent) return { message: error.message, uncertain: true }
        throw error
      }
    },

    async confirm(context, smsCode) {
      if (!context.selected) throw new QuickOrderError('业务选择上下文不存在', 'XYW_SELECTION_REQUIRED', 409)
      const payload = await call(context, 's/marketInfo/marketOrder', {
        mktCode: MKT_CODE,
        productCode: PRODUCT_CODE,
        verifyCode: smsCode,
        channelCode: CHANNEL_CODE,
      }, { final: true })
      if (payload.code === '210') throw new QuickOrderError(payload.message || '订购验证码错误', 'SMS_CODE_MISMATCH', 400, { recoverable: true })
      if (payload.code !== '200' || !payload.success) {
        return { accepted: false, uncertain: false, code: payload.code || 'XYW_REJECTED', message: payload.message || '业务订购未受理' }
      }
      const result = record(payload.object)
      if (!Object.hasOwn(result, 'result')) {
        return { accepted: true, uncertain: true, code: 'XYW_RESULT_UNCONFIRMED', message: '接口返回业务码 200，但缺少可验证的订购结果，请通过官方渠道核验。' }
      }
      const accepted = result.result === true || String(result.result).toLowerCase() === 'true'
      return {
        accepted,
        uncertain: false,
        code: accepted ? '200' : 'XYW_REJECTED',
        message: text(result.descr, 1000) || (accepted ? '北京移动已受理咪咕视频会员年包订购请求。' : '北京移动未受理本次订购请求。'),
      }
    },
  }
}

export const xywAdapter = createXywAdapter()

export const xywInternals = { ORIGIN, CHANNEL_CODE, MKT_CODE, PAGE_CODE, PRODUCT_CODE, PUBLIC_KEY, encryptLoginPayload, htmlToText }

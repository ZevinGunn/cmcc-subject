import { config } from '../config.js'
import { requestWithJar } from '../utils/http.js'
import { logEvent } from '../utils/logger.js'
import { SHOP_BUSINESS_KEY, shopWireDecrypt, shopWireEncrypt } from './cryptoService.js'

const SHOP_ORIGIN = 'https://shop.10086.cn'
const CATEGORY_LABELS = {
  '01': '我的套餐',
  '02': '增值业务',
  '03': '基础功能',
  '04': '其他',
  '05': '代收费业务',
  '06': '已参加活动',
  '07': '政企业务',
}

function parseJson(value) {
  if (value && typeof value === 'object') return value
  try {
    return JSON.parse(String(value || ''))
  } catch {
    return null
  }
}

function isSuccess(response) {
  return String(response?.retCode || '').padStart(6, '0') === '000000'
}

function validateCookie(cookie) {
  const value = String(cookie || '').trim().replace(/^cookie:\s*/i, '')
  if (!value) throw new Error('请输入 shop.10086.cn 登录 Cookie')
  if (value.length > 32 * 1024 || /[\r\n]/.test(value)) throw new Error('Cookie 格式无效')
  return value
}

function validatePhone(phone) {
  const value = String(phone || '').trim()
  if (!/^1\d{10}$/.test(value)) throw new Error('请输入正确的 11 位手机号')
  return value
}

function encryptedPhone(phone) {
  return shopWireEncrypt(validatePhone(phone))
}

function shopHeaders(phone, cookie, contentType = '*') {
  const encrypted = encryptedPhone(phone)
  return {
    'User-Agent': config.userAgent,
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Content-Type': contentType,
    'X-Requested-With': 'XMLHttpRequest',
    Origin: SHOP_ORIGIN,
    Referer: `${SHOP_ORIGIN}/i/`,
    provcode: '100',
    payPhoneNo: `${encrypted}${phone.slice(5, 7)}`,
    Cookie: validateCookie(cookie),
  }
}

async function shopRequest({ phone, cookie, path, method = 'GET', body }) {
  const response = await requestWithJar({
    url: `${SHOP_ORIGIN}/i${path}`,
    method,
    headers: shopHeaders(phone, cookie, method === 'POST' ? 'application/json' : '*'),
    data: body === undefined ? undefined : JSON.stringify(body),
    includeCookies: false,
    timeout: 30000,
    maxAttempts: 2,
  })
  const raw = parseJson(response.data)
  if (!raw) {
    return { ok: false, status: response.status, message: `移动商城返回了非 JSON 响应（HTTP ${response.status}）`, raw: response.data }
  }
  if (response.status < 200 || response.status >= 300 || !isSuccess(raw)) {
    return {
      ok: false,
      status: response.status,
      message: raw.retMsg || `移动商城接口失败（${raw.retCode || response.status}）`,
      raw,
    }
  }
  let data = raw.data
  if (raw.data?.outParam) {
    try {
      const decrypted = shopWireDecrypt(raw.data.outParam)
      data = parseJson(decrypted) ?? decrypted
    } catch (error) {
      return { ok: false, status: response.status, message: `移动商城响应解密失败：${error.message}`, raw }
    }
  }
  return { ok: true, status: response.status, data, raw, message: raw.retMsg || '' }
}

export async function readShopSessionMeta(phone, cookie) {
  const result = await shopRequest({ phone, cookie, path: '/v1/auth/loginfo', method: 'GET' })
  if (!result.ok) return result
  let msgIdSeed = ''
  if (result.data?.msgId) {
    try {
      msgIdSeed = shopWireDecrypt(result.data.msgId)
    } catch {
      msgIdSeed = ''
    }
  }
  return {
    ...result,
    data: {
      maskedPhone: result.data?.loginValue || '',
      provinceCode: result.data?.provice || '100',
      brand: result.data?.brand || '',
      channel: result.data?.channel || '',
      msgIdSeed,
    },
  }
}

function buildMsgId(seed) {
  if (!seed) throw new Error('当前登录态缺少 msgId，Cookie 可能已失效，请刷新 Cookie 后重试')
  return shopWireEncrypt(`${Date.now()}${seed}`)
}

export async function queryShopBusiness(phoneInput, cookie) {
  const phone = validatePhone(phoneInput)
  const result = await shopRequest({
    phone,
    cookie,
    path: `/v1/busi/order/${encodeURIComponent(encryptedPhone(phone))}?_=${Date.now()}`,
  })
  if (!result.ok) return result
  const groups = Array.isArray(result.data) ? result.data : []
  return {
    ...result,
    data: {
      groups: groups.map((group) => ({
        prodType: String(group?.prodType || ''),
        label: CATEGORY_LABELS[group?.prodType] || `分类 ${group?.prodType || '-'}`,
        items: (Array.isArray(group?.orderBusis) ? group.orderBusis : []).map((item, index) =>
          normalizeShopBusiness(item, group?.prodType, index),
        ),
      })),
      queriedAt: result.raw?.sOperTime || '',
    },
  }
}

export async function sendShopUnsubscribeSms(phoneInput, cookie, business) {
  const phone = validatePhone(phoneInput)
  const meta = await readShopSessionMeta(phone, cookie)
  if (!meta.ok) return meta
  const payload = {
    msgType: '02',
    busiCode: requiredBusinessField(business, 'busiCode'),
    busiName: String(business?.prodType || ''),
    phoneNo: phone,
  }
  const result = await shopRequest({
    phone,
    cookie,
    path: `/v1/cust/commonSms/${encodeURIComponent(encryptedPhone(phone))}`,
    method: 'POST',
    body: { inParam: shopWireEncrypt(JSON.stringify(payload)), msgId: buildMsgId(meta.data.msgIdSeed) },
  })
  await logEvent('shop-business:sms', { phone: maskPhone(phone), busiCode: payload.busiCode, ok: result.ok })
  return result.ok ? { ...result, data: { sent: true } } : result
}

export async function unsubscribeShopBusiness(phoneInput, cookie, business, smsCodeInput) {
  const phone = validatePhone(phoneInput)
  const smsCode = String(smsCodeInput || '').trim()
  if (!/^\d{6}$/.test(smsCode)) throw new Error('请输入 6 位短信验证码')
  const meta = await readShopSessionMeta(phone, cookie)
  if (!meta.ok) return meta
  const nullableString = (value) => (value === null || value === undefined || value === '' ? 'null' : String(value))
  const orderInfos = [
    {
      busiType: requiredBusinessField(business, 'busiType'),
      bizCode: nullableString(business?.bizCode),
      busiCode: requiredBusinessField(business, 'busiCode'),
      spid: nullableString(business?.spid),
      oprCode: '01',
      smsCode,
    },
  ]
  const result = await shopRequest({
    phone,
    cookie,
    path: `/v1/busi/ordermodify/${encodeURIComponent(encryptedPhone(phone))}`,
    method: 'POST',
    body: { inParam: shopWireEncrypt(JSON.stringify({ orderInfos })), msgId: buildMsgId(meta.data.msgIdSeed) },
  })
  await logEvent('shop-business:unsubscribe', {
    phone: maskPhone(phone),
    busiCode: orderInfos[0].busiCode,
    ok: result.ok,
    retCode: result.raw?.retCode || '',
  })
  return result.ok ? { ...result, data: { success: true, message: result.message || '退订成功' } } : result
}

function requiredBusinessField(business, key) {
  const value = business?.[key]
  if (value === null || value === undefined || String(value).trim() === '') throw new Error(`业务缺少 ${key}`)
  return String(value)
}

function maskPhone(phone) {
  return String(phone).replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
}

export function normalizeShopBusiness(item = {}, prodType = '', index = 0) {
  return {
    id: `${prodType}-${index}-${item.busiCode || index}`,
    prodType: String(prodType || ''),
    categoryLabel: CATEGORY_LABELS[prodType] || `分类 ${prodType || '-'}`,
    busiName: String(item.busiName || ''),
    busiCode: item.busiCode ?? '',
    busiType: item.busiType ?? '',
    bizCode: item.bizCode ?? null,
    spid: item.spid ?? null,
    busiFee: item.busiFee ?? '',
    orderedTime: item.orderedTime ?? '',
    effectTime: item.effectTime ?? '',
    extinctTime: item.extinctTime ?? '',
    unsubscribeTime: item.unsubscribeTime ?? '',
    isOrdered: item.isOrdered ?? '',
    isUnOrder: item.isUnOrder ?? '',
    canUnsubscribe: true,
    raw: item,
  }
}

export { CATEGORY_LABELS }

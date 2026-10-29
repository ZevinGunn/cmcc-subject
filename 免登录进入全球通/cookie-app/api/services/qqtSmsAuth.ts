import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { httpsRequestText } from './cmccHttp.js'
import { parseSetCookieToPairs } from './cookieUtils.js'

const QQT_SMS_SEND_URL =
  'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/new/cmpSmsSend.action'
const QQT_LOGIN_URL = 'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/login.action'
const QQT_REFERER =
  'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/xdrNormal.html'
const QQT_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
const QQT_AES_KEY = 'WX812FB36C5901D3'
const DEFAULT_SSPID = '66013'

const execFileAsync = promisify(execFile)

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

function extractMessage(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') return undefined
  const obj = payload as Record<string, unknown>
  if (typeof obj.msg === 'string' && obj.msg.trim()) return obj.msg.trim()
  if (typeof obj.message === 'string' && obj.message.trim()) return obj.message.trim()
  if (typeof obj.resultDesc === 'string' && obj.resultDesc.trim()) return obj.resultDesc.trim()
  return undefined
}

function extractAccessToken(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') return undefined
  const obj = payload as Record<string, unknown>
  const direct =
    typeof obj.access_token === 'string'
      ? obj.access_token
      : typeof obj.accessToken === 'string'
        ? obj.accessToken
        : undefined
  if (direct && direct.trim()) return direct.trim()
  for (const value of Object.values(obj)) {
    if (!value) continue
    if (typeof value === 'object') {
      const nested = extractAccessToken(value)
      if (nested) return nested
    }
  }
  return undefined
}

function encryptAesEcbPkcs7(value: string): string {
  const key = Buffer.from(QQT_AES_KEY, 'utf8')
  const cipher = crypto.createCipheriv('aes-128-ecb', key, null)
  cipher.setAutoPadding(true)
  const encrypted = Buffer.concat([
    cipher.update(value, 'utf8'),
    cipher.final(),
  ])
  return encrypted.toString('base64')
}

function resolveEncryptScriptPath(): string | undefined {
  const envPath = String(process.env.QQT_ENCRYPT_SCRIPT_PATH || '').trim()
  const candidates = [
    envPath,
    path.resolve(process.cwd(), '../../qqtlocal-rights/backend/js_utils/encrypt.js'),
    path.resolve(process.cwd(), '../qqtlocal-rights/backend/js_utils/encrypt.js'),
  ].filter(Boolean)
  for (const p of candidates) {
    if (fs.existsSync(p)) return p
  }
  return undefined
}

async function encryptPhoneBySm2(phone: string): Promise<string> {
  const scriptPath = resolveEncryptScriptPath()
  if (!scriptPath) {
    throw new Error(
      'QQT_ENCRYPT_SCRIPT_NOT_FOUND: 请配置 QQT_ENCRYPT_SCRIPT_PATH 或确保 qqtlocal-rights/backend/js_utils/encrypt.js 存在',
    )
  }
  const { stdout } = await execFileAsync('node', [scriptPath, 'sm2', phone], {
    timeout: 8000,
  })
  const value = String(stdout || '').trim()
  if (!value) throw new Error('QQT_SM2_ENCRYPT_EMPTY')
  return value
}

export async function qqtSendSms(args: {
  phone: string
  sspid?: string
}): Promise<{
  ok: boolean
  status?: number
  message?: string
  payload?: unknown
}> {
  const encryptedPhone = await encryptPhoneBySm2(args.phone)
  const body = new URLSearchParams({
    phone: encryptedPhone,
    sspId: String(args.sspid || DEFAULT_SSPID).trim() || DEFAULT_SSPID,
  }).toString()
  const res = await httpsRequestText({
    url: QQT_SMS_SEND_URL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Referer: QQT_REFERER,
      'User-Agent': QQT_UA,
      Accept: 'application/json, text/javascript, */*; q=0.01',
      Origin: 'https://qqt.cmicrwx.cn',
    },
    body,
    timeoutMs: 10000,
  })
  const payload = safeJson(res.bodyText)
  const message = extractMessage(payload) ?? res.bodyText.slice(0, 240)
  const ok =
    res.statusCode >= 200 &&
    res.statusCode < 400 &&
    !String(message || '').includes('失败') &&
    !String(message || '').includes('错误')
  return { ok, status: res.statusCode, message, payload }
}

export async function qqtLoginBySms(args: {
  phone: string
  smsCode: string
}): Promise<{
  ok: boolean
  status?: number
  message?: string
  payload?: unknown
  accessToken?: string
}> {
  const encPhone = encryptAesEcbPkcs7(args.phone)
  const encCode = encryptAesEcbPkcs7(args.smsCode)
  const body = new URLSearchParams({
    phone: encPhone,
    smsCode: encCode,
  }).toString()
  const res = await httpsRequestText({
    url: QQT_LOGIN_URL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Referer: QQT_REFERER,
      'User-Agent': QQT_UA,
      Accept: 'application/json, text/javascript, */*; q=0.01',
      Origin: 'https://qqt.cmicrwx.cn',
    },
    body,
    timeoutMs: 10000,
  })
  const payload = safeJson(res.bodyText)
  const message = extractMessage(payload) ?? res.bodyText.slice(0, 240)
  const tokenPairs = parseSetCookieToPairs(res.headers['set-cookie'])
  const accessToken =
    tokenPairs.get('access_token') || extractAccessToken(payload) || undefined
  const ok =
    res.statusCode >= 200 &&
    res.statusCode < 400 &&
    Boolean(accessToken) &&
    !String(message || '').includes('失败') &&
    !String(message || '').includes('错误')
  return { ok, status: res.statusCode, message, payload, accessToken }
}

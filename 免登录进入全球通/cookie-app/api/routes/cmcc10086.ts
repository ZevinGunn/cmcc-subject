import { Router, type Request, type Response } from 'express'
import crypto from 'node:crypto'
import type { LoginResp, SendSmsResp } from '../services/cmccTypes.js'
import { cmccLoginBySms, cmccSendSms } from '../services/cmcc10086.js'
import { getServiceLoginAccess } from '../services/serviceLoginGuard.js'

const router = Router()

function isValidPhone(phone: string): boolean {
  return /^1\d{10}$/.test(phone)
}

function isSixDigitCode(code: string): boolean {
  return /^\d{6}$/.test(code)
}

router.post('/sms/send', async (req: Request, res: Response<SendSmsResp>) => {
  const requestId = crypto.randomUUID()
  const phone = String((req.body?.phone ?? '')).trim()

  if (!isValidPhone(phone)) {
    res.status(400).json({
      ok: false,
      message: '手机号格式不正确',
      errorCode: 'INVALID_PHONE',
      requestId,
    })
    return
  }
  const access = getServiceLoginAccess(req)
  if (!access.ok) {
    res.status(403).json({
      ok: false,
      message: access.message || '服务端登录已关闭',
      errorCode: 'SERVICE_LOGIN_DISABLED',
      requestId,
    })
    return
  }
  let requestHeaders: Record<string, string> | undefined = undefined
  try {
    requestHeaders =
      req.body?.headers && typeof req.body?.headers === 'object'
        ? (req.body.headers as Record<string, string>)
        : undefined
  } catch {
    requestHeaders = undefined
  }
  try {
    const r = await cmccSendSms(phone, requestHeaders)
    if (!r.ok) {
      res.status(502).json({
        ok: false,
        message: r.message || '发送验证码失败',
        errorCode: String(r.status ?? 'UPSTREAM_ERROR'),
        requestId,
      })
      return
    }

    res.json({
      ok: true,
      data: {
        cooldownSeconds: 60,
      },
      requestId,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    if (process.env.CMCC_DEBUG_HTTP === '1') {
      console.error(`[api] /sms/send failed requestId=${requestId} error=${msg}`)
    }
    res.status(500).json({
      ok: false,
      message:
        msg === 'UPSTREAM_TIMEOUT'
          ? '上游超时，请重试'
          : process.env.CMCC_DEBUG_HTTP === '1'
            ? msg
            : '上游接口异常',
      errorCode:
        msg === 'UPSTREAM_TIMEOUT'
          ? 'UPSTREAM_TIMEOUT'
          : process.env.CMCC_DEBUG_HTTP === '1'
            ? 'UPSTREAM_EXCEPTION'
            : 'UPSTREAM_ERROR',
      requestId,
    })
  }
})

router.post('/login', async (req: Request, res: Response<LoginResp>) => {
  const requestId = crypto.randomUUID()
  const phone = String((req.body?.phone ?? '')).trim()
  const code = String((req.body?.code ?? '')).trim()

  if (!isValidPhone(phone)) {
    res.status(400).json({
      ok: false,
      message: '手机号格式不正确',
      errorCode: 'INVALID_PHONE',
      requestId,
    })
    return
  }
  if (!isSixDigitCode(code)) {
    res.status(400).json({
      ok: false,
      message: '请输入 6 位数字验证码',
      errorCode: 'INVALID_CODE',
      requestId,
    })
    return
  }
  const access = getServiceLoginAccess(req)
  if (!access.ok) {
    res.status(403).json({
      ok: false,
      message: access.message || '服务端登录已关闭',
      errorCode: 'SERVICE_LOGIN_DISABLED',
      requestId,
    })
    return
  }
  let requestHeaders: Record<string, string> | undefined = undefined
  try {
    requestHeaders =
      req.body?.headers && typeof req.body?.headers === 'object'
        ? (req.body.headers as Record<string, string>)
        : undefined
  } catch {
    requestHeaders = undefined
  }
  try {
    const r = await cmccLoginBySms(phone, code, requestHeaders)
    if (!r.ok || !r.cookie) {
      res.status(502).json({
        ok: false,
        message: r.message || '登录失败',
        errorCode: String(r.status ?? 'UPSTREAM_ERROR'),
        requestId,
      })
      return
    }

    res.json({
      ok: true,
      data: {
        cookie: r.cookie,
      },
      requestId,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    if (process.env.CMCC_DEBUG_HTTP === '1') {
      console.error(`[api] /login failed requestId=${requestId} error=${msg}`)
    }
    res.status(500).json({
      ok: false,
      message:
        msg === 'UPSTREAM_TIMEOUT'
          ? '上游超时，请重试'
          : process.env.CMCC_DEBUG_HTTP === '1'
            ? msg
            : '上游接口异常',
      errorCode:
        msg === 'UPSTREAM_TIMEOUT'
          ? 'UPSTREAM_TIMEOUT'
          : process.env.CMCC_DEBUG_HTTP === '1'
            ? 'UPSTREAM_EXCEPTION'
            : 'UPSTREAM_ERROR',
      requestId,
    })
  }
})

export default router

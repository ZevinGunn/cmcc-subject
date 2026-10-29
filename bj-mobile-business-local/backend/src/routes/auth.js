import { Router } from 'express'
import { createSession, deleteSession, getSession, publicSession, saveSessions } from '../services/sessionStore.js'
import {
  checkBjNumber,
  exchangePortalToken,
  getCaptcha,
  loadSmsToken,
  prepareLoginPage,
  sendLoginSms,
  touchLogin,
  verifyCaptcha,
} from '../services/loginClient.js'
import { getOnlineUserInfo, initPortalKey } from '../services/portalClient.js'
import { ensureWafToken } from '../services/wafClient.js'
import { fail, ok } from '../utils/response.js'

const router = Router()

function resolveSession(req, res) {
  const sessionId = req.body?.sessionId || req.query?.sessionId
  if (!sessionId) return createSession()
  const session = getSession(sessionId)
  if (!session) {
    fail(res, 404, '登录会话不存在或已过期', 'SESSION_NOT_FOUND')
    return null
  }
  return session
}

function validPhone(phone) {
  return /^1\d{10}$/.test(String(phone || '').trim())
}

router.post('/session', (_req, res) => {
  const session = createSession()
  ok(res, { session: publicSession(session) })
})

router.post('/prepare', async (req, res, next) => {
  try {
    const session = resolveSession(req, res)
    if (!session) return
    const result = await prepareLoginPage(session)
    saveSessions()
    if (!result.ok) return fail(res, 200, result.message, 'PREPARE_FAILED', { raw: result.raw })
    ok(res, { ...result.data, session: publicSession(session) }, { raw: result.raw })
  } catch (e) {
    next(e)
  }
})

router.get('/session', (req, res) => {
  const session = getSession(req.query?.sessionId)
  if (!session) return fail(res, 404, '登录会话不存在或已过期', 'SESSION_NOT_FOUND')
  ok(res, { session: publicSession(session) })
})

router.post('/session/validate', async (req, res, next) => {
  try {
    const session = getSession(req.body?.sessionId)
    if (!session) return fail(res, 404, '登录缓存不存在或已过期', 'SESSION_NOT_FOUND')
    const expectedPhone = String(req.body?.phone || '').replace(/\D/g, '')
    const loginMaterialReady = Boolean(
      session.artifact && session.accessToken && session.wafToken && session.portalKey,
    )
    const tokenExpired = Boolean(
      session.accessTokenExpireAt && session.accessTokenExpireAt <= Date.now(),
    )
    if (!loginMaterialReady || tokenExpired) {
      return fail(res, 401, '北京移动登录缓存已过期，请重新登录', 'LOGIN_SESSION_EXPIRED')
    }
    const userInfo = await getOnlineUserInfo(session)
    if (!userInfo.ok) {
      return fail(res, 401, '北京移动登录缓存已失效，请重新登录', 'LOGIN_SESSION_EXPIRED')
    }
    const actualPhone = String(userInfo.data?.mobile || '').replace(/\D/g, '')
    if (expectedPhone && actualPhone && expectedPhone !== actualPhone) {
      return fail(res, 403, '登录缓存与当前办理号码不一致，请重新登录', 'LOGIN_SESSION_PHONE_MISMATCH')
    }
    saveSessions()
    ok(res, {
      valid: true,
      validatedAt: new Date().toISOString(),
      session: publicSession(session),
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/session/:id', (req, res) => {
  deleteSession(req.params.id)
  ok(res, { deleted: true })
})

router.post('/check-number', async (req, res, next) => {
  try {
    const phone = String(req.body?.phone || '').trim()
    if (!validPhone(phone)) return fail(res, 400, '手机号格式不正确', 'INVALID_PHONE')
    const session = resolveSession(req, res)
    if (!session) return
    const result = await checkBjNumber(session, phone)
    saveSessions()
    if (!result.ok) return fail(res, 200, result.message, 'NOT_BJ_MOBILE', { raw: result.raw })
    ok(res, { ...result.data, session: publicSession(session) }, { raw: result.raw })
  } catch (e) {
    next(e)
  }
})

router.get('/captcha', async (req, res, next) => {
  try {
    const session = resolveSession(req, res)
    if (!session) return
    const result = await getCaptcha(session)
    saveSessions()
    if (!result.ok) return fail(res, 200, '获取图形验证码失败', 'CAPTCHA_ERROR', { raw: result.raw })
    ok(res, { ...result.data, session: publicSession(session) })
  } catch (e) {
    next(e)
  }
})

router.post('/verify-captcha', async (req, res, next) => {
  try {
    const session = resolveSession(req, res)
    if (!session) return
    const inputCode = String(req.body?.captcha || req.body?.inputCode || '').trim()
    if (!inputCode) return fail(res, 400, '请输入图形验证码', 'MISSING_CAPTCHA')
    const result = await verifyCaptcha(session, inputCode)
    saveSessions()
    if (!result.ok) return fail(res, 200, result.message, 'CAPTCHA_INVALID', { raw: result.raw })
    ok(res, { ...result.data, session: publicSession(session) }, { raw: result.raw })
  } catch (e) {
    next(e)
  }
})

router.post('/send-sms', async (req, res, next) => {
  try {
    const phone = String(req.body?.phone || '').trim()
    const captcha = String(req.body?.captcha || '').trim()
    if (!validPhone(phone)) return fail(res, 400, '手机号格式不正确', 'INVALID_PHONE')
    if (!captcha) return fail(res, 400, '请输入图形验证码', 'MISSING_CAPTCHA')
    const session = resolveSession(req, res)
    if (!session) return

    const check = await checkBjNumber(session, phone)
    const steps = { checkNumber: check.raw }
    if (!check.ok) return fail(res, 200, check.message, 'NOT_BJ_MOBILE', { raw: steps })
    const captchaCheck = await verifyCaptcha(session, captcha)
    steps.verifyCaptcha = captchaCheck.raw
    if (!captchaCheck.ok) {
      return fail(res, 200, captchaCheck.message, 'CAPTCHA_INVALID', { raw: steps })
    }
    const token = await loadSmsToken(session, phone)
    steps.loadToken = token.raw
    if (!token.ok) return fail(res, 200, token.message, 'LOAD_TOKEN_FAILED', { raw: steps })
    const result = await sendLoginSms(session, { phone, captcha })
    steps.sendSms = result.raw
    if (!result.ok) return fail(res, 200, result.message, 'SEND_SMS_FAILED', { raw: steps })
    saveSessions()
    ok(res, { ...result.data, session: publicSession(session) }, { raw: steps })
  } catch (e) {
    next(e)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const phone = String(req.body?.phone || '').trim()
    const code = String(req.body?.code || '').trim()
    if (!validPhone(phone)) return fail(res, 400, '手机号格式不正确', 'INVALID_PHONE')
    if (!/^\d{6}$/.test(code)) return fail(res, 400, '请输入 6 位短信验证码', 'INVALID_CODE')
    const session = resolveSession(req, res)
    if (!session) return

    const login = await touchLogin(session, { phone, code })
    if (!login.ok) return fail(res, 200, login.message, 'LOGIN_FAILED', { raw: login.raw })
    const token = await exchangePortalToken(session)
    if (!token.ok) {
      return fail(res, 200, token.message, token.errorCode || 'PORTAL_TOKEN_FAILED', {
        raw: token.raw,
        session: publicSession(session),
      })
    }
    const waf = await ensureWafToken(session)
    if (!waf.ok) {
      return fail(res, 200, waf.message, waf.errorCode || 'WAF_TOKEN_FAILED', {
        raw: waf.raw,
        session: publicSession(session),
      })
    }
    const portalKey = await initPortalKey(session)
    if (!portalKey.ok) {
      return fail(res, 200, portalKey.message, portalKey.errorCode || 'PORTAL_KEY_FAILED', {
        raw: portalKey.raw,
        session: publicSession(session),
      })
    }
    const userInfo = await getOnlineUserInfo(session)
    if (!userInfo.ok) {
      return fail(res, 200, userInfo.message, userInfo.errorCode || 'USER_INFO_FAILED', {
        raw: userInfo.raw,
        session: publicSession(session),
      })
    }
    saveSessions()
    ok(res, {
      session: publicSession(session),
      login: login.data,
      portal: token.data,
      userInfo: userInfo.data,
    })
  } catch (e) {
    next(e)
  }
})

router.post('/waf-token', (req, res) => {
  const session = resolveSession(req, res)
  if (!session) return
  session.wafToken = String(req.body?.wafToken || '').trim()
  saveSessions()
  ok(res, { session: publicSession(session), hasWafToken: Boolean(session.wafToken) })
})

export default router

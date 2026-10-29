import { chromium } from 'playwright'
import { config } from '../config.js'
import { getCookies, setBrowserCookies } from '../utils/cookieJar.js'
import { logEvent } from '../utils/logger.js'

const TOKEN_RE = /[?&]XEbtxIBt=([^&]+)/
const CHROME_CANDIDATES = [
  process.env.PLAYWRIGHT_CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
].filter(Boolean)

function browserHeaders() {
  return {
    'User-Agent': config.userAgent,
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  }
}

async function seedCookies(context, session) {
  const cookies = await getCookies(session.jar, config.portalOrigin)
  if (!cookies.length) return
  const browserCookies = cookies.map((cookie) => ({
      name: cookie.key,
      value: cookie.value,
      domain: cookie.domain?.startsWith('.') ? cookie.domain : cookie.domain || 'service.bj.10086.cn',
      path: cookie.path || '/',
      expires: cookie.expires instanceof Date ? Math.floor(cookie.expires.getTime() / 1000) : -1,
      httpOnly: Boolean(cookie.httpOnly),
      secure: cookie.secure !== false,
      sameSite: normalizeSameSite(cookie.sameSite),
    }))
    .map((cookie) => {
      if (!cookie.sameSite) {
        const { sameSite, ...rest } = cookie
        return rest
      }
      return cookie
    })
  await context.addCookies(browserCookies)
}

function normalizeSameSite(value) {
  const raw = String(value || '').trim().toLowerCase()
  if (!raw) return ''
  if (raw === 'strict') return 'Strict'
  if (raw === 'lax') return 'Lax'
  if (raw === 'none' || raw === 'no_restriction') return 'None'
  return ''
}

async function seedStorage(page, session) {
  await page.addInitScript(
    ({ accessToken, refreshToken, userPhone, expiresAt }) => {
      if (accessToken) localStorage.setItem('access_token', accessToken)
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken)
      if (userPhone) localStorage.setItem('userPhone', userPhone)
      if (expiresAt) localStorage.setItem('access_token_expire', String(expiresAt))
      localStorage.removeItem('version-portal')
    },
    {
      accessToken: session.accessToken || '',
      refreshToken: session.refreshToken || '',
      userPhone: session.userInfo?.mobile || '',
      expiresAt: session.accessTokenExpireAt || '',
    },
  )
}

function readTokenFromUrl(url) {
  const match = String(url || '').match(TOKEN_RE)
  return match ? decodeURIComponent(match[1]) : ''
}

async function existingChromePath() {
  const { access } = await import('node:fs/promises')
  for (const path of CHROME_CANDIDATES) {
    try {
      await access(path)
      return path
    } catch {
      // Try the next locally installed browser.
    }
  }
  return ''
}

async function launchBrowser() {
  const executablePath = await existingChromePath()
  const attempts = executablePath
    ? [
        { executablePath, headless: true, args: ['--disable-blink-features=AutomationControlled'] },
        { executablePath, headless: true, args: ['--headless=new', '--disable-blink-features=AutomationControlled'] },
        { executablePath, headless: false, args: ['--disable-blink-features=AutomationControlled'] },
      ]
    : [{ headless: true, args: ['--disable-blink-features=AutomationControlled'] }]

  const errors = []
  for (const options of attempts) {
    try {
      return await chromium.launch(options)
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error))
    }
  }

  const missingBundled = errors.some((message) => message.includes("Executable doesn't exist"))
  const friendly = new Error(
    missingBundled && !executablePath
      ? '本机未找到可用 Chromium/Chrome。请安装 Google Chrome，或在 backend 目录执行 npm exec playwright install chromium。'
      : `无法启动本机 Chrome：${errors.at(-1) || '未知错误'}`,
  )
  friendly.code = missingBundled && !executablePath ? 'BROWSER_NOT_FOUND' : 'BROWSER_LAUNCH_FAILED'
  friendly.details = errors
  throw friendly
}

export async function ensureWafToken(session, { force = false } = {}) {
  if (session.wafToken && !force) {
    logEvent('waf:reuse', { sessionId: session.id, wafTokenLength: session.wafToken.length })
    return { ok: true, data: { wafToken: session.wafToken, reused: true }, raw: { reused: true } }
  }
  if (!session.accessToken) {
    return { ok: false, message: '缺少门户 access_token，无法生成防护 token', errorCode: 'MISSING_ACCESS_TOKEN' }
  }

  let browser
  const captured = []
  let token = ''

  try {
    await logEvent('waf:start', { sessionId: session.id, force, hasAccessToken: Boolean(session.accessToken) })
    browser = await launchBrowser()
    const context = await browser.newContext({
      extraHTTPHeaders: browserHeaders(),
      userAgent: config.userAgent,
      ignoreHTTPSErrors: true,
      viewport: { width: 390, height: 844 },
    })
    await seedCookies(context, session)
    const page = await context.newPage()
    await seedStorage(page, session)

    page.on('request', (request) => {
      const url = request.url()
      const next = readTokenFromUrl(url) || request.headers().xebtxibt || ''
      if (next) {
        token = next
        captured.push({ url, hasHeader: Boolean(request.headers().xebtxibt) })
        logEvent('waf:capture', { sessionId: session.id, url, hasHeader: Boolean(request.headers().xebtxibt), tokenLength: next.length })
      }
    })

    await page.goto(config.backUrl, { waitUntil: 'domcontentloaded', timeout: 45000 })
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => null)

    if (!token) {
      await page.evaluate(async () => {
        await fetch('/nwt/portal-bff/api/keys/v1.0/get', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          body: '',
        }).catch(() => null)
      })
      await page.waitForTimeout(1500)
    }

    const browserCookies = await context.cookies(config.portalOrigin)
    await setBrowserCookies(session.jar, browserCookies)
  } catch (error) {
    await logEvent('waf:error', {
      sessionId: session.id,
      message: error instanceof Error ? error.message : String(error),
      code: error?.code || '',
      details: error?.details || [],
      captured,
    })
    return {
      ok: false,
      message:
        error?.code === 'BROWSER_NOT_FOUND' || error?.code === 'BROWSER_LAUNCH_FAILED'
          ? error.message
          : `自动生成 XEbtxIBt 失败：${error instanceof Error ? error.message : '浏览器执行异常'}`,
      errorCode:
        error?.code === 'BROWSER_NOT_FOUND' || error?.code === 'BROWSER_LAUNCH_FAILED'
          ? error.code
          : 'WAF_BROWSER_FAILED',
      raw: { captured, details: error?.details || [] },
    }
  } finally {
    if (browser) await browser.close()
  }

  if (token) {
    session.wafToken = token
    await logEvent('waf:success', { sessionId: session.id, tokenLength: token.length, captured: captured.length })
    return { ok: true, data: { wafToken: token, reused: false }, raw: { captured: captured.length } }
  }

  await logEvent('waf:failed', { sessionId: session.id, captured })
  return {
    ok: false,
    message: '自动生成 XEbtxIBt 失败，门户防护脚本未产生有效 token',
    errorCode: 'WAF_TOKEN_FAILED',
    raw: { captured },
  }
}

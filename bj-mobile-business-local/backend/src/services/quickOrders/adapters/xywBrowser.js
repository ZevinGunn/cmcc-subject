import { chromium } from 'playwright'

const PAGE_URL = 'https://xyw.bj.10086.cn/static/pages/vgop/mkt/#/miguVideoYear?c=173'
const LOGIN_SMS_PATH = '/mkt_web/s/smsUnifyAuthLogin/sendSmsVerifyCodeEncipher'
const LOGIN_VERIFY_PATH = '/mkt_web/s/smsUnifyAuthLogin/commonSmsVerifyLoginEncipher'

async function runOfficialLoginStep({ userAgent, storageState }, action) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  try {
    const browserContext = await browser.newContext({
      locale: 'zh-CN',
      ...(userAgent ? { userAgent } : {}),
      ...(storageState ? { storageState } : {}),
    })
    try {
      const page = await browserContext.newPage()
      await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded', timeout: 25_000 })
      const orderButton = page.locator('.once-order')
      await orderButton.waitFor({ state: 'visible', timeout: 20_000 })
      await orderButton.click()
      const result = await action(page)
      return {
        ...result,
        storageState: await browserContext.storageState(),
        cookies: await browserContext.cookies(),
      }
    } finally {
      await browserContext.close()
    }
  } finally {
    await browser.close()
  }
}

async function responsePayload(response) {
  const body = await response.text()
  if (response.status() < 200 || response.status() >= 300) {
    throw new Error(`xyw browser login HTTP ${response.status()}`)
  }
  return body
}

export const xywBrowserFlow = {
  async sendLoginSms({ phone, userAgent, storageState }) {
    return runOfficialLoginStep({ userAgent, storageState }, async (page) => {
      await page.getByPlaceholder('请输入手机号码', { exact: true }).fill(phone)
      const responsePromise = page.waitForResponse(
        (response) => response.url().endsWith(LOGIN_SMS_PATH) && response.request().method() === 'POST',
        { timeout: 20_000 },
      )
      await page.getByText('获取验证码', { exact: true }).click()
      return { response: await responsePayload(await responsePromise) }
    })
  },

  async verifyLogin({ phone, smsCode, userAgent, storageState }) {
    return runOfficialLoginStep({ userAgent, storageState }, async (page) => {
      await page.getByPlaceholder('请输入手机号码', { exact: true }).fill(phone)
      await page.getByPlaceholder('请输入验证码', { exact: true }).fill(smsCode)
      const responsePromise = page.waitForResponse(
        (response) => response.url().endsWith(LOGIN_VERIFY_PATH) && response.request().method() === 'POST',
        { timeout: 20_000 },
      )
      await page.getByText('登录', { exact: true }).click()
      return { response: await responsePayload(await responsePromise) }
    })
  },
}

export const xywBrowserInternals = { PAGE_URL, LOGIN_SMS_PATH, LOGIN_VERIFY_PATH }

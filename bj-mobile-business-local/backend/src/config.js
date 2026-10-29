export const config = {
  port: Number(process.env.PORT || 8788),
  loginOrigin: 'https://login.10086.cn',
  portalOrigin: 'https://service.bj.10086.cn',
  portalReachabilityTimeoutMs: Number(process.env.BMCC_PORTAL_REACHABILITY_TIMEOUT_MS || 15000),
  portalReachabilityAttempts: Number(process.env.BMCC_PORTAL_REACHABILITY_ATTEMPTS || 2),
  portalWarmTimeoutMs: Number(process.env.BMCC_PORTAL_WARM_TIMEOUT_MS || 12000),
  portalTouchLoginTimeoutMs: Number(process.env.BMCC_PORTAL_TOUCH_TIMEOUT_MS || 15000),
  channelId: process.env.BMCC_CHANNEL_ID || '21100',
  userAgent:
    process.env.BMCC_UA ||
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
  backUrl:
    process.env.BMCC_BACK_URL ||
    'https://service.bj.10086.cn/nwt/portal/packageQuery?ssotouch2017=0',
}

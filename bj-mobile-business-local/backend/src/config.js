export const config = {
  port: Number(process.env.PORT || 8788),
  loginOrigin: 'https://login.10086.cn',
  portalOrigin: 'https://service.bj.10086.cn',
  channelId: process.env.BMCC_CHANNEL_ID || '21100',
  userAgent:
    process.env.BMCC_UA ||
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
  backUrl:
    process.env.BMCC_BACK_URL ||
    'https://service.bj.10086.cn/nwt/portal/packageQuery?ssotouch2017=0',
}

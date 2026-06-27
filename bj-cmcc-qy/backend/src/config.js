export const config = {
  port: Number(process.env.PORT || 3010),
  bmccBaseUrl: process.env.BMCC_BASE_URL || "https://xcxp.bj.10086.cn/rights-intf",
  source: process.env.BMCC_SOURCE || "Local",
  requestMode: process.env.BMCC_REQUEST_MODE || "encrypted-string",
  accessToken: process.env.BMCC_ACCESS_TOKEN || "1924d545b02f4de6b26e017253a5dd2d",
  tokenKey: process.env.BMCC_TOKEN_KEY || "123ABC",
  aesKey: process.env.BMCC_AES_KEY || "A9B6C6D8E4F3G2H1",
  aesIv: process.env.BMCC_AES_IV || "3468546098617985",
  defaultRetailerCode: process.env.BMCC_RETAILER_CODE || "BJYDJTAPP001",
  defaultSonRetailerCode: process.env.BMCC_SON_RETAILER_CODE || "A004",
  sessionFile: process.env.BMCC_SESSION_FILE || "sessions.json",
  plus99NewAccessCode: process.env.PLUS99_NEW_ACCESS_CODE || ""
};

# 官方公共 SDK 来源

`kjjssdk.min.js` 原样提取自用户提供的 `山西移动登录页.zip`，归档路径为 `wap.sx.10086.cn/h/cms200/comm/MobileAbility/jssdk/kjjssdk.min.js`，2026-10-17。

SHA-256：`f4a4b023fdabbe34df3037390e2c4aead3cafed3d1b560af05cce57ed3ddd05d`。

仅在官方同源临时浏览器中、页面未提供 `YWKJ.getHeader` 时加载公共 SDK，由原 SDK 计算当前浏览器的 `Content-M-CODE` 和 `Content-M-URL`。不导入 HAR 中的身份、Cookie、请求头值或验证码，不伪造设备标识。SDK 不向本地页面开放，诊断仅保留环境头可用性。

`restParams` 仅复用官方页面可用的 `$fchama.httpReady()` 结果；页面空白时不伪造该数据。补齐环境头不等于证明短信送达。

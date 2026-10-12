# 云盘登录本地工作台

本项目按中国移动云盘 Web `7.17.10` 封装登录链路：获取 RSA 公钥、发送短信验证码、短信登录保存 `authToken/token/Authorization`、获取 `ssoToken`、生成带认证参数的跳转 URL。

## 启动

```bash
cd /Users/ZevinGunn/CMCC-PROJECT/云盘/yunpan-login-local
npm start
```

访问：

```text
http://localhost:7399
```

## 推荐流程

1. 输入手机号并发送验证码。短信请求使用用户域固定 AES-CBC，不复用登录 AESKey。
2. 如果短信接口提示需要人机验证，点击“打开官方滑块验证”，完成后页面会自动填入 `puzzleToken`。
3. 再次点击“发送验证码”，等待云盘短信验证码。
4. 输入短信验证码，点击“登录并保存 Token”。系统会在此时重新获取 RSA 公钥并生成本轮专用 AESKey/`mcloud-skey`。
5. 登录成功后系统会尝试自动获取 `toSourceId=001003` 的 `ssoToken`，并生成 10086 flowShop 跳转链接。
6. 如需手动刷新，点击“生成 10086 跳转”；如需其他业务地址，输入自定义跳转链接后点击“现场换票并生成认证链接”。这两个入口都会重新调用 `querySpecToken/querySpecTokenV2`，不会使用本地缓存票据。
7. 点击“获取 wx.10086 CK”会先现场换取 10086 票据，再访问新链接、跟随重定向并收集 `Set-Cookie`。页面只返回上游服务器实际下发的 CK。
8. 点击“生成全球通跳转”，系统使用 `toSourceId=001003` 获取新短票，直接生成 `targetSourceId=001191` 的全球通 SSO 链接。10086 链接和全球通链接分别保存、分别复制。

“公钥”按钮保留为调试入口；正常使用时不需要手动点。

## 本地文件

- `src/cryptoBox.js`：AES/RSA/mcloud-sign/Authorization。
- `src/yunpanClient.js`：云盘远端接口封装。
- `src/sessionStore.js`：本地会话持久化。
- `src/server.js`：本地 API 和静态文件服务。
- `src/diagnosticLogger.js`：请求链路日志、请求 ID 和统一脱敏。
- `src/globalTelecom.js`：全球通绑定入口及安全跳转地址校验。
- `public/`：前端工作台。
- `data/session.json`：运行后生成的本地会话文件，包含 token，注意不要提交或外传。
- `logs/yunpan-YYYY-MM-DD.jsonl`：按天生成的脱敏诊断日志，已被 Git 忽略。

登录成功后，项目会把账号、`authToken`、加密 `token`、`Authorization`、最近一次 `ssoToken`、10086/全球通跳转链接、最近一次 wx.10086 CK 写入 `data/session.json`。刷新页面或重启服务后会恢复这些内容并标记为“缓存”，缓存链接和 CK 不可直接复制；重新生成后才会标记为“实时请求”并开放复制。

## 注意

短信接口和 Web `querySpecTokenV2` 使用 7.17.10 用户域 AES-CBC 加密，登录接口使用 AES-ECB 加密业务体并通过 RSA 加密本轮 AESKey。登录内层字段为 `account/dycPwd/loginStyle/ifOpenAccount/verType/clientEnv/setCookie`，外层还包含 `encryptMsg/clientId/autoLogin/returnToken`。V1 请求体为 `account + toSourceId`；V2 请求体为 `phoneNumber + toSourceId`。登录和换 token 请求携带匹配当前加密材料的 `mcloud-skey`，短信和公钥请求不携带旧 `mcloud-skey`，V2 不再发送旧的 `mcloud-cool-skey`。`toSourceId` 不允许为空，10086 默认使用新版 HAR 已验证成功的 `001003`；如需联调其他目标系统，可通过 `FLOW_SHOP_SOURCE_ID` 覆盖。

`querySpecTokenV2` 会优先使用登录响应 `routerInfo` 中 `modName=user` 的 HTTPS 地址；缺失或不可信时才回退到南京用户域。原生 App 抓包中只传 `toSourceId` 的 V2 是 App 注入认证上下文的另一套协议，本工作台不会模拟该模式。

10086 CK 获取不是单纯访问 flowShop 链接。根据 `用户认证.har` 和 `10086ssoToken访问` 源码，浏览器流程是：

1. 访问 `https://wx.10086.cn/website/businessPlatform/flowShop?...netToken=<ssoToken>&targetSourceId=001003`，拿到页面初始化 cookie。
2. 前端调用 `POST /website/nrapigate/nrauth/auth/encryt/userAuth`，请求明文为 `{ "backUrl": "/website/businessPlatform/flowShop?...netToken=...&targetSourceId=001003" }`。
3. `userAuth` 请求体使用 10086 前端固定 AES-CBC/PKCS7 加密，Key 为 `1234123412ABCDEF`，IV 为 `ABCDEF1234123412`，输出大写 hex。
4. `userAuth` 响应通过 `Set-Cookie` 下发 `shareToken`，这是完整 CK 的关键增量。后续页面接口还会使用响应体中的 10086 `token` 作为 `Authorization`。

本地“获取 wx.10086 CK”会按这个顺序执行：先重新换票，再访问页面链接收集初始 `Set-Cookie`，然后调用 `userAuth` 收集 `shareToken`。为了模拟浏览器而在本地生成的 `clientId/WT_FPC/GDP` 等种子 Cookie 只用于内部请求，不会再对外标记为真实 CK。

链接响应中的 `generatedAt` 表示本次上游换票响应时间。如果页面显示“实时请求 · 上游复用票据”，表示本地已经重新发起请求，但云盘在票据有效期内返回了与上次相同的值；这与本地直接使用缓存是两种情况。

全球通使用 `001191` 专用票据，云手机使用 `001216`，CAPP 使用 `001304`，AI 助手使用 `001005`。不会将 `001003` 的票据直接当作全球通票据。生成链接与全球通 `access_token` 置换分开；只有新 `Set-Cookie` 与登录状态检查均通过才报告全球通认证成功。原生目标签发请求的缺失证据与实测要求见 [2026-10-12 HAR 说明](docs/20261012-HAR登录与业务换票说明.md)。

## 诊断日志

每个本地 API 响应都包含 `requestId`，也会通过 `X-Request-Id` 响应头返回。可使用该值在当天的 `logs/yunpan-YYYY-MM-DD.jsonl` 中关联以下事件：

- 本地 API 开始、完成和异常。
- 云盘 HTTP 状态、耗时、请求/响应字节数和脱密后的业务码。
- 10086 每次重定向状态、Cookie 名称、`userAuth` 结果。
- 全球通绑定入口状态和安全跳转地址校验结果。

日志不会记录手机号、短信验证码、Cookie 值、Authorization、token、AES/RSA 密钥、加密业务体或完整的含 token URL。可通过 `YUNPAN_LOG_DIR` 修改日志目录。

短信验证码接口当前必须在加密业务体里携带 `random` 随机串；如果只发送 `{ account, reqType }`，服务端会返回 `01000001 随机字符串不能为空`。本项目会在发送短信时生成 16 位随机串并保存到本地 session，方便排查同一轮验证码请求。

注意不要把短信接口的 `random` 带进登录接口。7.17.10 Web 登录的加密业务体必须包含 `verType: 2`、`clientEnv: "3"`，短信登录的 `ifOpenAccount` 为字符串 `"1"`；外层必须包含 `clientId: "10701"`。缺少这些字段、字段类型不符，或让 `mcloud-skey` 与 `encryptMsg` 使用不同轮次的 AESKey，都可能触发 `1010010001 参数错误`。

前端接入官方 AliyunCaptcha。官方滑块成功后，以 `captchaType=2`、`puzzleVerfycode` 向短信服务提交证明；后端采用本次 HAR 的新 AES-CBC 协议。短信服务端确认成功后才提示已发送，证明使用后清除。若网络环境拦截了 `o.alicdn.com`，页面会提示滑块脚本未加载。

新增云手机、CAPP 链接操作和“置换全球通 access_token 并验证登录”。自动协议根据保存的 pc/mobile 会话选择 Web V1 或 App V2，也可手动选择协议。Web 登录和原生 App 会话不能假定具有相同目标授权；可通过“导入自己的 App 登录会话”保存当前真实 Authorization，或用当前 App 的全球通 SSO 链接验证消费链路。缓存结果刷新后禁止复制，须重新生成；已消费的全球通短票从输出中移除。

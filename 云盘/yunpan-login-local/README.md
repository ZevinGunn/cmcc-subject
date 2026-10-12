# 云盘登录本地工作台

本项目按中国移动云盘 Web `7.17.10` 封装登录链路：获取 RSA 公钥、发送短信验证码、短信登录保存 `authToken/token/Authorization`、获取 `ssoToken`、生成带认证参数的跳转 URL。

## 启动

```bash
cd /Users/ZevinGunn/CMCC-PROJECT/云盘/yunpan-login-local
npm start
```

正式 PM2 服务使用 `npm run restart`，配置只更新 `yunpan-login`。项目固定 Volta Node 20.20.2；其他环境可用 `YUNPAN_NODE_PATH` 指定 Node 20+，避免 PM2 守护进程沿用旧 Node 18。

重载入口使用现有 PM2 CLI；当 CLI 安装在旧 nvm 版本目录时自动定位该安装，不安装或启动另一套进程管理器。需要指定安装位置时设置 `YUNPAN_PM2_PATH`。

访问：

```text
http://localhost:7399
```

## 推荐流程

1. 输入手机号，点击“发送验证码”或“打开官方滑块验证”。
2. 完成官方滑块后，页面自动提交 `captchaType=2` 和 `puzzleVerfycode`，无需再次点击发送。
3. 短信服务确认成功后开始 60 秒重发冷却；失败显示实际业务错误并刷新滑块实例。
4. 输入短信验证码，点击“登录并保存 Token”。系统会在此时重新获取 RSA 公钥并生成本轮专用 AESKey/`mcloud-skey`。
5. 登录成功后仅保存主会话，不自动消费业务短票。
6. 如需手动刷新，点击“生成 10086 跳转”；如需其他业务地址，输入自定义跳转链接后点击“现场换票并生成认证链接”。这两个入口都会重新调用 `querySpecToken/querySpecTokenV2`，不会使用本地缓存票据。
7. 点击“获取 wx.10086 CK”会先现场换取 10086 票据，再访问新链接、跟随重定向并收集 `Set-Cookie`。页面只返回上游服务器实际下发的 CK。
8. 点击“生成全球通跳转”，独立申请 `001191` 票据，生成带活动回跳与 `enableShare=1` 的 HTTPS 链接。活动编号可修改，默认 `66050`。
9. 点击“生成云手机跳转”，独立申请 `001216` 票据，生成 `cloud.139.com` hash 路由链接，渠道使用本次实测的 `02207`。
10. 业务跳转的自动模式使用明文 V2，保持原 Authorization，不将 `pc` 改写成 `mobile`。手动协议选择仍保留。
11. “置换全球通 access_token 并验证登录”在全新 Chrome 会话中执行官方页面；只有 HTTP 200、业务 `status="1"` 和新 Cookie 均成立才输出认证结果。它会消费短票，之后应重新生成跳转链接。

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

短信与旧 Web V2 使用各自的 AES-CBC 协议，不复用登录 AESKey。短信只在收到旧网关明确解密拒绝 `01000019` 后兼容旧密钥重试一次；超时或普通业务失败不自动重发。登录使用 AES-ECB 加密业务体及 RSA 包装 AESKey。V1 正文为 `account + toSourceId`；旧 Web V2 为 `phoneNumber + toSourceId`；明文 V2 仅传 `toSourceId`。明文 V2 不套用 `hcy-cool-flag`、`mcloud-skey` 或旧网关协议头。10086 功能保留独立协议，默认来源 `001003` 可通过 `FLOW_SHOP_SOURCE_ID` 覆盖；本轮未重新验收 10086 业务登录。

`querySpecTokenV2` 优先使用登录响应的可信用户域 HTTPS 路由；缺失时回退南京用户域。明文 V2 已用真实 Web 登录产生的 `pc` Authorization 完成全球通与云手机 SSO 验证。导入 App 会话时可同时导入白名单环境头 JSON；仅保存不会冒充已验证登录。

10086 CK 获取不是单纯访问 flowShop 链接。根据 `用户认证.har` 和 `10086ssoToken访问` 源码，浏览器流程是：

1. 访问 `https://wx.10086.cn/website/businessPlatform/flowShop?...netToken=<ssoToken>&targetSourceId=001003`，拿到页面初始化 cookie。
2. 前端调用 `POST /website/nrapigate/nrauth/auth/encryt/userAuth`，请求明文为 `{ "backUrl": "/website/businessPlatform/flowShop?...netToken=...&targetSourceId=001003" }`。
3. `userAuth` 请求体使用 10086 前端固定 AES-CBC/PKCS7 加密，Key 为 `1234123412ABCDEF`，IV 为 `ABCDEF1234123412`，输出大写 hex。
4. `userAuth` 响应通过 `Set-Cookie` 下发 `shareToken`，这是完整 CK 的关键增量。后续页面接口还会使用响应体中的 10086 `token` 作为 `Authorization`。

本地“获取 wx.10086 CK”会按这个顺序执行：先重新换票，再访问页面链接收集初始 `Set-Cookie`，然后调用 `userAuth` 收集 `shareToken`。为了模拟浏览器而在本地生成的 `clientId/WT_FPC/GDP` 等种子 Cookie 只用于内部请求，不会再对外标记为真实 CK。

链接响应中的 `generatedAt` 表示本次上游换票响应时间。如果页面显示“实时请求 · 上游复用票据”，表示本地已经重新发起请求，但云盘在票据有效期内返回了与上次相同的值；这与本地直接使用缓存是两种情况。

全球通使用 `001191`，云手机使用 `001216`，CAPP 使用 `001304`，AI 助手使用 `001005`。不同业务票据不混用；CAPP 内部登录仍待实测。最新证据和故障修复见 [2026-10-13 实测说明](docs/20261013-短信修复与SSO实测.md)，此前 HAR 分析作为历史记录保留。

## 诊断日志

每个本地 API 响应都包含 `requestId`，也会通过 `X-Request-Id` 响应头返回。可使用该值在当天的 `logs/yunpan-YYYY-MM-DD.jsonl` 中关联以下事件：

- 本地 API 开始、完成和异常。
- 云盘 HTTP 状态、耗时、请求/响应字节数和脱密后的业务码。
- 10086 每次重定向状态、Cookie 名称、`userAuth` 结果。
- 全球通绑定入口状态和安全跳转地址校验结果。

日志不会记录手机号、短信验证码、Cookie 值、Authorization、token、AES/RSA 密钥、加密业务体或完整的含 token URL。可通过 `YUNPAN_LOG_DIR` 修改日志目录。

短信业务体必须携带 `random` 随机串。当前生成时间戳加随机数字并保存到会话；兼容重试复用本次随机串与滑块证明，不把它带入登录正文。

注意不要把短信接口的 `random` 带进登录接口。7.17.10 Web 登录的加密业务体必须包含 `verType: 2`、`clientEnv: "3"`，短信登录的 `ifOpenAccount` 为字符串 `"1"`；外层必须包含 `clientId: "10701"`。缺少这些字段、字段类型不符，或让 `mcloud-skey` 与 `encryptMsg` 使用不同轮次的 AESKey，都可能触发 `1010010001 参数错误`。

前端接入官方 AliyunCaptcha，业务短信结果决定成功反馈。证明使用后清除，短信失败刷新验证实例；缺少证明时发送按钮先打开滑块。若网络拦截 `o.alicdn.com`，页面提示脚本未加载。

浏览器验证使用 Playwright 和本机 Chrome。首次安装执行 `npm install`；Chrome 默认路径为 macOS 安装路径，其他环境设置 `YUNPAN_CHROME_PATH`。使用新的隔离浏览器会话并保留 HTTPS 校验；生成链接不启动浏览器，只有执行认证置换时消费票据。缓存结果刷新后禁止直接复制，已消费的全球通短票从输出中移除。

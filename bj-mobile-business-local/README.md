# 北移业务查询与退订本地工具

独立新项目，技术栈为 Vue + Vite + JavaScript + 本地 Node.js/Express 代理服务。

## 功能范围

- 北京移动手机号短信登录。
- 查询门户已订业务。
- 按“基础功能 / 套餐 / 增值业务”分类展示。
- 对增值业务发起退订。
- 从本地 JSON 配置读取活动，完成资格检查、办理预览和订阅受理。
- 按策划 ID、活动编码、资源编码等参数预览并办理自定义业务，支持短信确认流程。
- 按密钥、AES 模式、IV 和输入输出编码执行本地加解密。
- 本地导入 HAR、JSON 或 TXT 中的请求参数和响应值进行解密。
- 使用 `shop.10086.cn` 登录 Cookie 查询商城已订业务，并按短信验证码确认退订。
- 按商城固定 AES-CBC 双层 Base64 协议加密或解密 `inParam`、`msgId`、`outParam` 和手机号路径。
- 在统一快捷订购工作台办理 xyw.bj 新业务、北移、中移商城、网格通和家庭云电脑业务。
- 通过两段式短信流程办理“咪咕视频会员年包合约”：先验证登录号码，再独立确认真实订购。

## 启动

```bash
npm run install:all
npm run dev
```

默认地址：

```text
前端: http://127.0.0.1:5178
后端: http://127.0.0.1:8788
```

如果当前 shell 没有 `npm`，可以使用 Codex bundled pnpm：

```bash
/Users/ZevinGunn/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm install
/Users/ZevinGunn/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm --dir backend install
/Users/ZevinGunn/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm --dir frontend install
```

构建前端可直接运行：

```bash
/Users/ZevinGunn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node frontend/node_modules/vite/bin/vite.js build
```

## 本地 API

```text
POST /api/auth/session
GET  /api/auth/captcha?sessionId=
POST /api/auth/check-number
POST /api/auth/send-sms
POST /api/auth/login
POST /api/business/query
POST /api/business/unsubscribe
POST /api/shop-business/session
POST /api/shop-business/query
POST /api/shop-business/unsubscribe/sms
POST /api/shop-business/unsubscribe
GET  /api/activities
POST /api/activities/:id/check
POST /api/activities/:id/preview
POST /api/activities/:id/subscribe
POST /api/custom-orders/initialize
POST /api/custom-orders/preview
POST /api/custom-orders/submit
POST /api/custom-orders/:orderId/sms/send
POST /api/custom-orders/:orderId/sms/verify
POST /api/debug/crypto/transform
GET  /api/quick-orders/catalog
POST /api/quick-orders/sessions
POST /api/quick-orders/sessions/:id/auth/sms/send
POST /api/quick-orders/sessions/:id/auth/verify
POST /api/quick-orders/sessions/:id/prepare
POST /api/quick-orders/sessions/:id/select
POST /api/quick-orders/sessions/:id/sms/send
POST /api/quick-orders/sessions/:id/confirm
```

商城查询、退订接口、字段、密钥、加解密协议和页面设计见 `docs/SHOP_BUSINESS_QUERY_DESIGN.md`。

活动配置位于 `backend/activities/`。1000M 优享活动的接口、字段、业务规则、加密协议和扩展配置说明见 `docs/ACTIVITY_SUBSCRIPTION_DESIGN.md`。

承诺低消权益回馈版示例、统一订购字段、短信确认状态机、自定义办理 API 和 HAR 解密边界见 `docs/CUSTOM_PRODUCT_ORDER_DESIGN.md`。

家庭云电脑两档产品、App Token 认证、营销平台接口、字段、业务码、订购状态机和本地联调说明见 `docs/云电脑订购流程及接口说明.md`。

xyw.bj 咪咕视频会员年包的短信登录、活动资格、产品确认、订购短信和最终受理协议见 `docs/xyw新业务订购流程及接口说明.md`。

## 移动侧接口链路

登录：

```text
chkNumberBjAction.action
verifyCaptcha.htm
loadToken.action
sendRandomCodeActionbj.action
touchBjLogin.action
```

门户：

```text
/nwt/sso/touchLogin
/nwt/portal-bff/api/keys/v1.0/get
/nwt/portal-bff/api/accountsj/v1.0/getOnlineUserInfo
/nwt/portal-bff/api/packageQuery/v1.0/index
/nwt/portal-bff/api/packageQuery/v1.0/unsubscribe
```

## 注意事项

- 本项目不复用 `免登录进入全球通/cookie-app`。
- 如果登录时报 `PORTAL_UNREACHABLE`，表示本机后端已经能解析 `service.bj.10086.cn`，但当前出口网络连接北京移动门户超时。可先切换网络/关闭 VPN 或 TUN 后重试；网络较慢时可启动前设置 `BMCC_PORTAL_REACHABILITY_TIMEOUT_MS=30000 BMCC_PORTAL_REACHABILITY_ATTEMPTS=3`。
- 登录 RSA 与门户 AES 逻辑来自 `北京移动登录/` 和 `北移业务查询与退订/` 源码。
- 门户接口存在 `XEbtxIBt` 防护参数，直接 HTTP 调用可能被网关拦截。当前项目已预留 `/api/auth/waf-token`，后续可接入 Playwright 预热获取动态 token；如果移动侧强制校验该字段，查询/退订会在门户 BFF 阶段失败。
- 当前会话存储在后端内存中，重启即清空。
- 退订接口的 `field1` 是增值业务列表下标，不是产品编码。

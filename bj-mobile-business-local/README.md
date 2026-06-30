# 北移业务查询与退订本地工具

独立新项目，技术栈为 Vue + Vite + JavaScript + 本地 Node.js/Express 代理服务。

## 功能范围

- 北京移动手机号短信登录。
- 查询门户已订业务。
- 按“基础功能 / 套餐 / 增值业务”分类展示。
- 对增值业务发起退订。

## 启动
w
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
```

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

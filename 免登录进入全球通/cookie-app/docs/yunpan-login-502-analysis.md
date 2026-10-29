# 云盘登录接口 502 问题说明与修复方案

更新时间：2026-07-13

## 问题现象

前端调用 `POST /api/accounts/yunpan/login` 时，浏览器网络面板看到 Cloudflare 返回 `502 Bad Gateway` HTML 页面。请求体示例：

```json
{
  "phone": "15210334812",
  "code": "909786",
  "publicLinkId": "9da856cb57ff"
}
```

同一环境下，普通 10086 登录接口、以及已有云盘会话置换 10086 CK 的接口可以正常工作。

## 原因分析

`/api/accounts/yunpan/login` 原先不是单纯的“云盘短信登录”。它在一次 HTTP 请求内串行完成了这些步骤：

1. 校验 public link 权限。
2. 调用云盘短信登录接口，拿到云盘授权会话。
3. 创建或更新账号，并保存云盘会话。
4. 立即调用云盘 `querySpecToken` 获取 10086 SSO token。
5. 访问 `wx.10086.cn` 跳转页并调用 10086 授权接口，收集 10086 CK。
6. 如果换 CK 失败，再尝试生成 SSO 链接作为降级结果。

底层每个上游请求有 12 秒超时，但整个登录路由包含多个上游请求，最坏耗时可能超过 30-40 秒。反向代理或 Cloudflare 在等待期间可能先返回 HTML 502，导致浏览器看到的不是后端 JSON 错误。

因此，这个问题更像是“登录接口承担了过长的同步置换流程”，不是云盘短信登录本身一定失败。

## 已实施修复

1. 将 `/api/accounts/yunpan/login` 改为“先保证云盘登录成功并保存会话”。
2. 10086 CK 置换仍会自动尝试，但增加短超时：
   - 云盘短信登录：最多 13 秒。
   - 云盘会话置换 10086 CK：最多 9 秒。
   - 降级生成 10086 SSO 链接：最多 3 秒。
3. 如果置换 10086 CK 超时或失败，不再让整个登录接口失败；接口返回成功，并带 `warning`，页面显示云盘会话已保存。
4. 登录链路增加阶段化日志，记录：
   - `request`
   - `public_access`
   - `yunpan_sms_login`
   - `account_saved`
   - `collect_10086_cookie`
   - `build_10086_sso_link`
5. 错误响应增加 `phase` 和 `debug` 字段，便于判断具体失败阶段。
6. 前端请求解析增加控制台调试输出：
   - 后端 JSON 错误会打印完整错误对象。
   - Cloudflare/HTML 非 JSON 响应会打印 HTTP 状态和响应片段。

## 2026-07-13 追加排查结论

用户反馈“提交验证码后约 2 秒内直接返回 Cloudflare 502”。重新线上验证后得到这些结果：

1. `GET /api/health` 正常返回 JSON。
2. `POST /api/accounts/yunpan/sms/send` 正常返回 JSON。
3. `POST /api/accounts/yunpan/login` 在手机号或验证码格式错误时正常返回 JSON。
4. `POST /api/accounts/yunpan/login` 在手机号、验证码、邀请码格式都合法，且邀请码存在时，进入云盘短信登录阶段后返回 Cloudflare 502。
5. 本地同样请求不会返回 Cloudflare HTML，而是后端 JSON：`phase=yunpan_sms_login`，说明 Express 路由逻辑可以正常捕获上游登录失败。

因此，新的判断是：当前 502 不是接口总超时，也不是 public link 校验问题，而是生产运行环境在执行云盘短信登录上游调用时发生了 origin 级异常或连接中断。由于 Cloudflare 返回的是非 JSON 502，后端路由可能没有机会完成 `res.json()`。

本次追加修复：

1. 将全局 `unhandledRejection` / `uncaughtException` 兜底从本地 `api/server.ts` 移到 `api/app.ts`，让 Vercel/serverless 入口 `api/index.ts` 也生效。
2. `/api/accounts/yunpan/login` 每个阶段都输出 `[yunpan-login] requestId=...` 控制台日志。
3. 数据库登录日志写入失败不会再影响业务响应。
4. 底层 `httpsRequestText` 对上游连接错误、超时、响应解压异常增加 `[cmcc-http] xx ...` 控制台日志。

## 2026-07-13 二次对比结论

对比独立项目 `yunpan-login-local` 后确认：两个项目的表现差异不只是上游链路问题，还包括 HTTP 状态码策略不同。

独立项目 `/api/auth/login` 的行为：

- 云盘登录失败时仍返回 `HTTP 200`。
- 响应体里用 `success:false`、`status`、`response` 展示真实上游结果。
- 所以前端一定能看到真实上游 JSON。

cookie-app 原来的 `/api/accounts/yunpan/login` 行为：

- 云盘登录上游返回 `HTTP 200` 但 `success:false` 时，cookie-app 会转换成 `HTTP 502`。
- Cloudflare 看到 origin 返回 502 后，可能用自己的 502 页面覆盖响应体。
- 结果就是浏览器只能看到 Cloudflare 的 `Bad Gateway / error code: 502`，看不到 cookie-app 已经准备好的 `phase/debug/requestId`。

这也是为什么独立项目亲测正常，而 cookie-app 看起来像“云盘登录接口 502”：独立项目把业务失败保留在 JSON 里，cookie-app 把业务失败提升成了 HTTP 502。

本次修复：

- `/api/accounts/yunpan/login` 的云盘业务失败不再返回 HTTP 502，改为 `HTTP 200 + ok:false + phase/debug`。
- `/api/accounts/yunpan/sms/send` 的云盘业务失败也不再返回 HTTP 502，改为 `HTTP 200 + ok:false + phase/debug`。
- 登录失败时 `debug` 里增加 `upstreamResponse` 和 `rawTextSnippet`，控制台可以看到真实上游返回。

后续原则：经过 Cloudflare 的业务接口尽量不要用 HTTP 502 承载“上游业务失败”。502/504 只适合真正的网关或服务不可达，否则 Cloudflare 会干扰调试。

## 2026-07-13 HAR 对比结论：1010010001 参数错误

对比新提供的 `云盘登录.har` 后，定位到 `permission/v1.0/login` 的关键差异：

成功 HAR 的云盘登录请求：

- URL：`https://yun.139.com/orchestration/auth-rebuild/permission/v1.0/login`
- Body：仅包含 `encryptMsg`、`returnToken`、`autoLogin`
- 加密前登录业务体：`account`、`dycPwd`、`loginStyle`、`ifOpenAccount`、`setCookie`
- Header：有 `mcloud-skey`
- Header：没有 `hcy-cool-flag`

cookie-app 原实现：

- 登录接口同时带了 `mcloud-skey` 和 `hcy-cool-flag: 1`

独立项目 `yunpan-login-local` 也是只在短信接口加 `hcy-cool-flag`，登录接口不加。`hcy-cool-flag` 属于短信/Cool 加密链路相关头，带到登录接口会让云盘将请求判定为参数不匹配，返回：

```json
{
  "success": false,
  "code": "1010010001",
  "message": "参数错误"
}
```

已修复：移除 cookie-app 云盘登录接口上的 `hcy-cool-flag`，登录接口只保留 `mcloud-skey`。

下一次线上复现时，需要在部署平台日志里按以下关键词搜索：

```text
[yunpan-login]
[cmcc-http] xx
[process:uncaughtException]
[process:unhandledRejection]
requestId=
```

如果最后一条日志停在 `phase:"yunpan_sms_login","status":"start"`，随后出现 `[cmcc-http] xx`，就是生产环境访问云盘登录上游失败。如果出现 `[process:uncaughtException]`，则以该异常栈为准继续修复。

## 后续排查方式

当再次出现登录失败时：

1. 浏览器控制台查看 `[public-api-error]`、`[account-login-api]` 或 `[api-error]`。
2. 如果看到 `phase`：
   - `yunpan_sms_login`：云盘短信登录阶段失败。
   - `collect_10086_cookie`：云盘登录成功，但置换 10086 CK 失败或超时。
   - `build_10086_sso_link`：降级生成 SSO 链接失败或超时。
3. 如果看到 `[public-api-invalid-json]` 且 body 是 Cloudflare HTML，说明请求没有拿到后端 JSON，优先查反代、Cloudflare、Node 服务健康和超时。
4. 后端日志表 `LogEntry` 中按 `requestId` 查询同一次登录链路，确认最后停在哪个阶段。

## 建议的后续优化

后续可以进一步把“云盘登录”和“置换 10086 CK”拆成后台任务：登录接口只保存云盘会话并立即返回，后台任务继续异步激活 10086 CK。这样 public 页面登录体验更稳，也能避免任何上游慢响应拖垮登录请求。

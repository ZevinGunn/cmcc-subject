# 爱购商城业务订购分析文档

版本：1.2｜日期：2026-08-24｜范围：`dev.coc.10086.cn` 权益直订与 COC 套餐订购

## 1. 结论摘要

爱购商城权益直订不是 `shop.10086.cn` 已订业务查询/退订链路。它以 10086 登录态换取爱购 SSO ticket，再经 `userLoginV2` 生成 `token + refreshToken + Cookie`，后续商品、短信、资格预检和订单请求均在 `dev.coc.10086.cn/coc3/` 下完成。

完整直订链路为：10086 CK 恢复与 SSO → 爱购凭证验活 → 页面布局/活动商品解析 → 商品详情核对 → 发送订单短信 → 黑名单预检 → 动态风控上下文 → `directOrder` → 业务码归一化。

“无视业务限制尝试提交”在系统中的含义是：客户端不因活动时间、资格、库存、黑名单或页面按钮状态阻断提交；系统仍请求上游预检，并无论预检结果如何继续调用订单接口。最终是否受理由爱购服务端决定，系统不伪造资格、不篡改服务端规则、不把 HTTP 200 误报为订购成功。

通用权益入口支持只提供 `skuId`。已知 SKU 优先合并本地业务配置；未知 SKU 使用通用上下文 `P00000139704 + bojinyear` 尝试查询和订购。这只是客户端的协议默认值，不代表任意 SKU 都与该渠道兼容。

## 2. 证据来源与可信度

### 2.1 已分析材料

- `铂金会员校园版订购.har`：包含页面加载、C1 设备令牌、商品查询、短信、黑名单预检、WASM 风控和最终订单提交。
- `铂金会员校园版.har`：用于与旧请求及风险拒绝响应对比。
- `铂金会员校园版.zip`：包含完整布局 JSON、商品详情 JSON、短信响应与上游接口响应。
- `铂金会员校园版不符合.zip`：证明页面资格不符合时仍能进入预检与提交链路。
- 优惠版、半年包优惠版、年包优惠版页面包：用于识别页面 code 和组件结构。
- cookie-app 源码：`aigouSession.ts`、`accountAigouSession.ts`、`luckyThreeDay.ts`。

### 2.2 事实边界

HAR 可确认校园版参数：`skuId=26804`、`referer=mzonebojindg`、`channelCode/selfChannelCode=P00000151769`、`activityId=17466`。页面布局缓存中的 `touchCode=P00000104637` 与实际订购请求渠道不同，订购应以业务页面运行时请求为准。

四个 ZIP 共享同一份校园版布局缓存，因此不能据此断言优惠版、半年包、年包拥有不同 SKU。系统把这些 code 标记为“运行时解析”，查询实时布局和商品详情后才能提交。

HAR 中 Cookie、手机号、短信码、SSO token、风控密文均为一次性敏感数据，不属于稳定接口参数，禁止写入配置或日志。

## 3. 参与系统

- 10086 统一认证：签发面向爱购页面的短期 ticket。
- 爱购登录服务：`userLoginV2` 将 ticket 置换为爱购 token、refreshToken 与 Cookie。
- 页面与活动服务：返回页面布局、活动、批次和 SKU。
- 商品服务：返回商品名称、价格、协议、销售类型和业务属性。
- 短信服务：向当前登录手机号发送订单验证码。
- 订单服务：执行黑名单检查和直接订购。
- 风控服务：浏览器设备指纹、WASM 计算和动态风险令牌。
- cookie-app：账号授权、会话持久化、业务编排、脱敏展示和审计请求 ID。

## 4. 端到端业务流程

1. 根据账号查找有效 10086 CK；失效时按既有云盘/10086 恢复链刷新。
2. 请求 10086 bindAccount，得到只允许指向爱购域名和指定路径的 SSO URL。
3. 访问爱购页面并调用 `userLoginV2`，保存加密后的爱购 Cookie、token、refreshToken。
4. 调用 `codeEncryptPhone` 验活；缓存可用则复用，不可用则强制刷新一次。
5. 输入页面 code 时读取 CDN 布局，提取订单组件中的 `vipSkuId/skuId/skuid` 和页面元数据。
6. 调用商品详情接口，以实时返回的商品名、价格和协议作为提交前事实来源。
7. 调用短信接口。`receivers` 使用爱购登录 token；`skuId` 是 `skuId_timestamp` 的 AES-128-CBC ZeroPadding 密文。
8. 用户输入 4-8 位验证码并键入“确认订购”。验证码仅在当前请求内使用。
9. 调用黑名单预检。预检结果展示但不阻断后续提交。
10. 获取 C1 设备令牌并作为 `gr-risk-p3`；从当前会话读取 `BSFIT_DEVICEID` 作为 `operDfp`。如官方页面已产生 WASM 上下文，则同时携带 `wasmParams`。
11. 调用 `directOrder`。验证码用订单字段密钥加密；提交包含 SKU、渠道、来源和收据标志。
12. 读取业务 `code/resultCode`。仅等于 `0` 才视为上游受理；HTTP 200 + `code=-1` 是业务失败。

## 5. 订购所需参数

### 5.1 业务必须参数

- `accountId`：cookie-app 内已有账号，且当前用户拥有该账号或为管理员。
- `skuId`：商品 SKU。可直接输入，也可由页面 code 实时解析。
- `channelCode`：业务渠道码。
- `selfChannelCode`：自渠道码，通常等于 channelCode。
- `referer`：页面 code，用于生成合法页面 Referer。
- `smsCode`：4-8 位订单短信验证码。

### 5.2 会话必须参数

- 爱购 Cookie。
- `token`：同时用于 `phone` 请求头和短信 receivers。
- `refreshToken`：爱购会话完整性校验字段。
- `loginUrl`：登录与验活 Referer。

### 5.3 条件参数

- `activityId`：活动查询所需，普通直订不一定进入最终订单体。
- `code`：页面布局解析输入；已有 skuId 时可不填。
- 动态风控参数：服务端要求时必须来自当前浏览器会话，不能复用 HAR 历史值。

## 6. 加密与风控规范

- 短信 SKU：AES-128-CBC，key/IV 均为协议固定 16 字节值，ZeroPadding，明文为 `skuId_timestamp`，Base64 输出。
- 订单验证码：AES-128-CBC，key/IV 均为订单字段固定 16 字节值，ZeroPadding，Base64 输出。
- 爱购 token 与 Cookie：由既有 SSO 服务签发并加密落库，前端不可见。
- 风控：C1 `/udid/c1` 可实时签发 40 字符 `gr-risk-p3`；`getDfpOuterCode` 生成的 `BSFIT_DEVICEID` 作为 `operDfp`；`wasm/gettoken + Wheel.roto_simple()` 依赖当前浏览器、WASM 和设备环境，生成 `wasmParams`。这些值均为短期、设备绑定数据。

## 7. 响应语义

- HTTP 状态表示传输/网关结果，不等于业务成功。
- 爱购常见成功码为字符串或数字 `0`。
- 新订购 HAR 的 `directOrder` 返回 `resultCode=-307, msg=订购异常，与已有业务冲突。（code:3004）`。这证明该请求已穿过动态风控并到达业务冲突校验，不是风险拒绝。
- 黑名单响应包含 `isBlackList/blackList/resultMsg`；系统展示结果但在强制尝试模式下继续提交。
- 登录失效、上游非 JSON、超时和 5xx 必须分别返回稳定错误码，不能统一显示“繁忙”。

## 8. 安全、审计与限制

- 所有操作需通过现有 `businessOrder` 权限和账号归属校验。
- 短信码、手机号明文、Cookie、token、ticket、风控字段不得进入响应、日志或文档。
- 同一按钮提交中禁用重复请求；上游是否幂等未知，失败后重试应由用户重新确认。
- 页面缓存可能陈旧，必须在发送短信前完成实时商品核对。
- 没有动态风控上下文时仍可尝试提交，但可能被风控拒绝；系统必须原样展示业务码。

## 9. 已实现范围

cookie-app 已将两个项目的能力合并为统一目录和双协议编排：权益商品使用 `directOrder`，套餐商品使用 `loginCheck + bookProduct`。两条链路共享账号权限、10086 CK 恢复、会话加密存储、响应脱敏和重新开始交互，但不混用订单协议。

### 9.1 默认业务目录

- `mzonebojindg / 26804`：铂金会员校园版，权益直订。
- `bojinbyhb`：铂金会员优惠版，运行时解析 SKU。
- `bojinbnbyhb`：铂金会员半年包优惠版，运行时解析 SKU。
- `bojinyearyhb`：铂金会员年包优惠版，运行时解析 SKU。
- `bojinyear / 77626`：铂金会员年包，权益直订。
- `sxxshzgb / 34622`：随心选生活折扣包，权益直订。
- `xbklhhy / 100000098326`：星巴克联合会员，COC 套餐协议。
- 自定义 SKU：未命中目录时按通用权益上下文尝试。

## 10. SCORE_REFUSE 说明

`code=-1` 且 `data.explain=SCORE_REFUSE` 表示请求已进入服务端风险评分，并被服务端拒绝。`level=5`、风险验证 URL 以及“访问过于频繁”共同说明这不是 SKU 解析或本地参数校验失败。常见触发因素包括短时间重复提交、设备指纹/网络/会话上下文不一致、风控参数缺失或过期。系统应原样展示脱敏响应，不自动重试，也不能在客户端绕过该风控。

新 HAR 没有出现 `SCORE_REFUSE`，而是返回业务冲突 `-307/3004`。因此不能把所有失败都归因于风控；必须以最终 `directOrder` 的原始 `resultCode/msg/data` 判断阶段和原因。

## 11. 新 HAR 验证的校园版时序

1. `getSkuType`
2. `getProductDetailById`
3. `qwSendSmsCode` → `{ resultCode: 0, msg: "success", data: null }`
4. `checkBlacklist` → `isBlackList=0`
5. `wasm/gettoken` → `code=0`，返回当前设备短期令牌
6. `directOrder` → `{ resultCode: -307, msg: "订购异常，与已有业务冲突。（code:3004）", data: null }`

最终请求体包含 `skuId/channelCode/selfChannelCode/smsCode/dealType/receipt/receiptModule/referer/operDfp`；请求头包含 `gr-risk-p3` 与 `wasmParams`，没有 `gr-risk-p1/p2`。历史 HAR 中的具体令牌、密文、短信码和指纹不得复用。

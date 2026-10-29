# 爱购商城订购接口设计文档

版本：1.2｜基础路径：`/api/aigou-orders`｜鉴权：同源会话 + 账号归属 + `businessOrder` 权限

## 1. 设计目标

向 cookie-app 前端提供稳定、脱敏、可审计的爱购订单编排接口。前端不接触爱购 Cookie/token，不自行构造加密字段，不根据页面资格提前宣告成功或失败。

## 2. 统一响应

成功：`{ ok: true, data: T, requestId: string }`

失败：`{ ok: false, message: string, errorCode: string, requestId: string }`

`requestId` 用于日志关联。上游 HTTP 200 但业务失败的订购结果由 confirm 接口以 HTTP 200 返回，`data.success=false`，确保“已尝试提交”与“受理成功”可同时表达。

## 3. 数据模型

### 3.1 AigouProductInput

- `code: string`：页面 code；与 skuId 至少一个非空。
- `skuId: string`：1-80 位字母、数字、下划线或连字符。
- `orderMode: "rights" | "package"`：已知 SKU 由服务端目录决定，不允许把套餐 SKU 强制发往 `directOrder`。
- `channelCode: string`：权益 SKU 可空，未命中目录时默认 `P00000139704`。
- `selfChannelCode: string`：可空输入，服务端默认使用 channelCode。
- `referer: string`：页面来源 code；可空输入时默认 code。
- `activityId?: string`：可选活动标识。
- 套餐条件字段：`productCode`、`pageId`、`touchCode`、`protocolSequenceId`、`smsCodeTypeEnum`。

### 3.2 AigouProduct

在输入字段基础上增加：`name`、`pageId`、`pageTitle`、`price`、`originPrice`、`agreementName`、`agreementContent`、`source`。价格单位沿用上游分值，前端负责除以 100 展示。

### 3.3 AigouRiskContext

可选字段：`grRiskP1`、`grRiskP2`、`grRiskP3`、`wasmParams`、`operDfp`。每个字段最大 12000 字符，仅在当前 confirm 请求内使用，不持久化。

## 4. 本地 API

### 4.1 GET `/catalog`

返回内置页面参数模板。需要管理员会话或用户 `businessOrder` 权限。

响应 data：`{ presets: AigouProductInput[] }`。

### 4.2 POST `/product`

用途：准备/验活爱购或 COC 套餐会话，合并已知 SKU 配置，解析页面布局并获取实时商品与协议。权益模式额外调用 `getSkuType`，其失败不阻断商品核对。

请求：`accountId + AigouProductInput`。

响应 data：`{ product: AigouProduct, account: AccountSummary, sessionReused: boolean }`。

关键错误：`ACCOUNT_REQUIRED`、`ACCOUNT_FORBIDDEN`、`AIGOU_SESSION_NOT_READY`、`PRODUCT_QUERY_FAILED`、`INVALID_UPSTREAM_RESPONSE`。

### 4.3 POST `/sms`

用途：发送订单验证码。

请求：`accountId + AigouProductInput`。

响应 data：`{ success, resultCode, message, response, cooldownSeconds: 60 }`。只要上游短信接口返回了可解析业务响应，本地 API 就使用 HTTP 200 返回；`success=false` 不会改写成通用 424，`response` 保留脱敏后的上游原始 JSON。

服务端构造：`receivers=session.token`；`skuId=AES_ZERO(skuId_timestamp)`；`member=true`；`businessChannelCode=channelCode`。

### 4.4 POST `/confirm`

用途：按 `orderMode` 分流。权益模式先执行黑名单预检，即使预检请求失败也继续尝试 `directOrder`；套餐模式执行 `loginCheck`，校验成功后调用 `bookProduct`。

请求：`accountId + AigouProductInput + smsCode + riskContext?`。

响应 data：

```json
{
  "success": false,
  "resultCode": "-1",
  "message": "访问过于频繁,请稍后再试",
  "data": { "level": "..." },
  "precheck": {
    "success": true,
    "resultCode": "0",
    "message": "success",
    "isBlackList": false
  },
  "attempted": true
}
```

`attempted=true` 仅表示已发起最终 `directOrder` 或 `bookProduct`请求。套餐 `loginCheck` 失败时为 `false`。`response` 保留订购接口具体响应或上游 HTTP 错误正文，但已递归删除 Cookie、token、手机号、短信、风控与指纹字段。权益结果额外返回 `riskPreparation`，只表示 C1 令牌、WASM 参数和设备指纹的来源/可用状态，不返回实际敏感值。

## 5. 上游接口规范

### 5.1 10086 → 爱购 SSO

- GET `wx.10086.cn/website/bind/bindAccount/new`
- 必须参数：`tokenKey=token`、`netUniChannelId=056002`、爱购 backUrl。
- 成功：3xx Location 指向允许的爱购页面且含 ticket。

### 5.2 爱购登录

- POST `/coc3/gr/login/ssoRights/userLoginV2`
- 请求：ticket、ticketType=8、businessType=RIGHTS_MARKET 及兼容空字段。
- 成功：`code=0` 且 data 含 token、refreshToken。

### 5.3 会话验活

- GET `/coc3/gr/login/specialRightsSso/codeEncryptPhone`
- 请求头：Cookie、`phone=session.token`。
- 成功：`code=0` 且 data 非空。

### 5.4 页面布局

- GET `res.coc.10086.cn/.../production.rightsmarket-h5-canvas.online.layout.{code}.json`
- 解析订单组件 `specify` JSON；SKU 字段优先级 `vipSkuId → skuId → skuid`。

### 5.5 活动商品

- GET `/coc3/coc3-market-activity/arrange/getProByActId`
- 常用参数：activityId、selfChannelCode、batchId、showLimit、seckillType、from、t。
- 响应 data：活动信息、subActivityList、goodsList。

### 5.6 商品详情

- GET `/coc3/coc3-market/arrange/getProductDetailById`
- 参数：id=skuId、isNeedDesc、t。
- 响应：名称、价格、协议、销售类型、支付方式和业务类字段。

### 5.7 订单短信

- POST `/coc3/coc3-market/api/sms/qwSendSmsCode`
- 请求体：receivers、加密 skuId、member、businessChannelCode。
- 成功：resultCode=0。

### 5.8 黑名单预检

- POST `/coc3/coc3-market-order/api/external/black/checkBlacklist`
- 请求体：`{ skuId }`。
- 响应 data：blackList、isBlackList、resultMsg。

### 5.9 动态风控

- GET `https://yxfk.market.chinamobile.com:8081/mgt/decision-engine/udid/c1?`
- POST `/coc3/gr/risk-ability/dfpRisk/getDfpOuterCode`
- POST `/coc3/gr/risk-ability/wasm/gettoken`
- C1 返回的 `data` 用作 `gr-risk-p3`，服务端在确认订购前实时获取。
- `BSFIT_DEVICEID` 存在于当前爱购会话 Cookie 时自动用作 `operDfp`。
- `wasmParams` 由官方 `Wheel` WASM 在当前浏览器执行 `g_dt_with_custom_url + roto_simple` 后生成；后端不能仅凭 SKU/CK 合成，当前通过一次性 `riskContext.wasmParams` 接收。
- 不得使用历史 HAR 值作为默认值，不得持久化动态风控字段。

### 5.10 直接订购

- POST `/coc3/coc3-market-order/api/external/order/directOrder`
- 请求体：skuId、channelCode、selfChannelCode、加密 smsCode、dealType=0、receipt=true、receiptModule=true、referer、operDfp。
- 条件请求头：gr-risk-p1/p2/p3、wasmParams。
- 成功判定：业务 code 严格等于 0。

### 5.11 COC 套餐订购

- POST `/coc/user/smsCode`：Aurora 加密体，包含 mobile、pageId、productCode、touchCode、smsCodeTypeEnum。
- POST `/coc/user/loginCheck`：Aurora 加密校验订购短信，可刷新 User-Token/userId。
- POST `/coc/pkg/order/bookProduct`：包含 productCode、pageId、touchCode、实时或已验证协议序列号、反转 Base64 手机证明与 MD5 digest。
- 星巴克联合会员默认值：`productCode=100000098326`、`pageId=1878635095121567744`、`touchCode=P00000132000`、`smsCodeTypeEnum=505`。

## 6. 状态码与错误映射

- 400：参数或验证码格式错误。
- 401：未登录、爱购会话失效。
- 403：缺少业务订购权限或账号归属不符。
- 404：账号不存在。
- 424：商品查询或风险令牌等前置业务失败；已获得的短信/订单业务拒绝通过 HTTP 200 的 `success=false` 返回。
- 502：上游 HTTP 异常或响应不可解析。
- 500：未分类服务端错误。

## 7. 非功能要求

- 超时：登录/布局 15 秒，业务请求 20 秒。
- 重试：会话准备允许一次强制刷新；订单提交不自动重试。
- 幂等：上游未提供幂等键，前端必须禁用并发重复提交。
- 日志：记录本地 requestId、接口名、耗时、HTTP 状态和业务码；禁止记录请求体敏感字段。
- 兼容：code/resultCode 支持数字与字符串；消息字段兼容 msg/message/resultMsg。

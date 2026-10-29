# xyw.bj 新业务订购流程及接口说明

版本：V1.0  
分析日期：2026-08-05  
证据：`新业务.zip`、`新业务订购.har`（敏感值不进入源码、测试与本文）

## 1. 业务结论

本次业务为北京移动 `xyw.bj.10086.cn` 营销平台的“咪咕视频会员年包合约”。当前样本对应：

| 项目 | 值 |
| --- | --- |
| 资费 | 0 元/年 |
| 生效 | 立即订购、立即生效 |
| 有效期 | 12 个月 |
| 权益 | 咪咕视频钻石会员 |
| 方案编号 | `24BJ200850` |
| 活动限制 | 仅限中国移动北京用户；12 个月内只能订购一次 |
| 活动时间 | 样本显示截至 2026-09-30，运行时以实时规则为准 |

HAR 的最终 `marketOrder` 返回 `code=200`、`obj.result=true`，证明样本中的订购请求已被受理。

## 2. 完整流程

```text
输入手机号
  -> 发送登录验证码（RSA 加密参数）
  -> 校验登录验证码，取得动态 Token 头与 Cookie
  -> 查询活动状态、业务详情和号码资格
  -> 选择咪咕视频会员年包
  -> 查询当前号码的实时订购确认规则
  -> 用户阅读规则并二次确认真实操作
  -> 发送订购验证码
  -> 提交订购验证码
  -> FINISHED | FAILED | UNKNOWN
```

登录验证码只建立平台会话，不会办理业务；订购验证码只在用户阅读实时规则并确认真实操作后发送。页面必须用不同标题和说明区分两类验证码。

## 3. 固定上下文

| 字段 | 值 |
| --- | --- |
| `origin` | `https://xyw.bj.10086.cn` |
| API 前缀 | `/mkt_web` |
| `channelCode` | `173` |
| `mktCode` | `17a230e954bd28443c5dcdbaacaa8158` |
| `pageCode` | `40037504236102b839b417e30cd9891e` |
| `productCode` | `f98e0730ee990b2b32553e8c571286f9` |
| `offerId` | `111603010506` |
| 官方路由 | `/static/pages/vgop/mkt/#/miguVideoYear` |

登录响应返回 `headerName` 和 `token`。后续请求按响应值动态增加认证头，不信任浏览器传入的头名；Cookie 仅保存在该订购会话的服务端 `CookieJar` 中。

## 4. 接口顺序

### 4.1 登录短信

```text
POST /s/smsUnifyAuthLogin/sendSmsVerifyCodeEncipher
POST /s/smsUnifyAuthLogin/commonSmsVerifyLoginEncipher
```

两接口外层请求均为：

```json
{ "encipherParam": "<RSA-PKCS1-v1_5 Base64>" }
```

发送短信的加密明文包含 `phone`、`mktCode`、`channelCode`、`authAccessType=2`；登录校验的加密明文包含 `mobile`、`verifyCode`、`channelCode`、`mktCode`、`pageCode`、`authAccessType=2`。公钥取自同版本页面源码，使用 RSA PKCS#1 v1.5 加密。

登录成功必须同时满足：业务码 `200`、返回号码等于输入号码、Token 非空、动态头名符合安全字符规则。

### 4.2 活动、产品与资格

```text
POST /s/marketInfo/getMarketStatus
POST /s/productInfo/getProductInfo
POST /s/marketRule/getMarketRule
```

继续办理条件：活动 `status=1`，产品响应编码等于固定 `productCode`，活动规则 `obj.result=true`。产品名称、说明和 `offerId` 使用当次实时响应，不由浏览器提交。

### 4.3 订购确认

```text
POST /s/orderConfirm/getMarketProInfo
```

请求包含 `productCode` 和 `mktCode`。返回的完整手机号必须与登录手机号一致；`full_descr` 转为纯文本后展示给用户。号码不一致或缺少规则时禁止发订购短信。

### 4.4 订购短信

```text
POST /s/orderConfirm/sendOrderConfirmVerifyCode
```

请求字段为 `productCode`、`mktCode`、`channelCode`。服务端要求协议勾选、真实操作二次确认和稳定的 `confirmationId`，短信请求只发送一次且冷却 60 秒。

### 4.5 最终订购

```text
POST /s/marketInfo/marketOrder
```

请求字段为 `mktCode`、`productCode`、`verifyCode`、`channelCode`。最终请求只尝试一次：

| 响应 | 状态 | 行为 |
| --- | --- | --- |
| `code=210` | `SMS_SENT` | 验证码错误，可在当前会话重新输入 |
| `code=200` 且 `obj.result=true` | `FINISHED` | 明确受理 |
| `code=200` 且 `obj.result=false` | `FAILED` | 明确拒绝 |
| 其他明确业务码 | `FAILED` | 展示上游说明 |
| `code=200` 但无 `obj.result` | `UNKNOWN` | 禁止重复提交，要求官方渠道核验 |
| 超时、断连、HTTP 异常或响应无法解析 | `UNKNOWN` | 禁止重复提交，要求官方渠道核验 |

相同 `confirmationId` 对最终状态返回同一结果；不同标识不能对已完成会话再次提交。

## 5. 安全边界

- 手机号、两类验证码、Token、Cookie、`encipherParam` 不写入浏览器存储、日志、文档或 API 响应。
- 服务端内存会话有效期 15 分钟，销毁或重启后凭据不可恢复。
- 日志先解析 JSON 再按字段脱敏，避免把字符串化请求体绕过结构化脱敏。
- 所有产品、资格和协议均使用当次上游响应；浏览器不能注入产品编码或办理档位。
- 自动测试只使用脱敏 mock，不调用真实短信和最终订购接口。

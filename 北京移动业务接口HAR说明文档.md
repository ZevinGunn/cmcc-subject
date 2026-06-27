# 北京移动登录与已订业务接口说明文档

本文档根据以下 HAR 与本地源码整理：

- `北京移动登录.har`
- `北京移动已订业务相关接口.har`
- `退订接口.har`
- `北京移动登录/login.10086.cn/bj/touchbj/js/login.js`
- `北京移动登录/service.bj.10086.cn/nwt/portal/assets/js/index-ad9a8e48.js`
- `北京移动登录/service.bj.10086.cn/nwt/portal/assets/js/index-c870102b.js`

说明：

- HAR 中的手机号、Cookie、Bearer token、WAF token 均已脱敏。
- 登录 HAR 的响应体在 HAR 中以 base64 保存，本文档写的是解码后的响应。
- 门户 BFF 接口请求/响应经过动态 AES 加密，HAR 中看到的是密文；本文档同时给出“密文传输格式”和源码还原出的“明文入参/解密后响应格式”。
- `北京移动已订业务相关接口.har` 中存在一段 Cookie/埋点内容转义异常，标准 JSON 解析会失败；接口 URL、headers、body 已通过 HAR 原文提取。

## 1. 接口总览

### 1.1 登录链路接口

| 顺序 | 接口 | 方法 | 作用 |
| --- | --- | --- | --- |
| 1 | `https://login.10086.cn/chkNumberBjAction.action` | POST | 校验是否北京移动号码 |
| 2 | `https://login.10086.cn/verifyCaptcha.htm` | POST | 校验图形验证码 |
| 3 | `https://login.10086.cn/loadToken.action` | POST | 获取发送短信验证码所需 token |
| 4 | `https://login.10086.cn/sendRandomCodeActionbj.action` | POST | 发送登录短信随机码 |
| 5 | `https://login.10086.cn/sendflag.htm?timestamp=<ts>` | GET | 刷新短信发送标记图片 |
| 6 | `https://login.10086.cn/touchBjLogin.action` | POST | 北京移动触屏登录 |

### 1.2 门户 SSO 与业务链路接口

| 顺序 | 接口 | 方法 | 作用 |
| --- | --- | --- | --- |
| 1 | `https://service.bj.10086.cn/nwt/sso/touchLogin` | POST | 使用登录返回的 artifact 换取门户 token |
| 2 | `https://service.bj.10086.cn/nwt/portal-bff/api/keys/v1.0/get` | POST | 初始化门户 BFF 动态加密 key |
| 3 | `https://service.bj.10086.cn/nwt/portal-bff/api/accountsj/v1.0/getOnlineUserInfo` | POST | 查询当前登录用户信息 |
| 4 | `https://service.bj.10086.cn/nwt/portal-bff/api/filter/v1.0/doLoginUrlParam` | POST | 登录回跳 URL 参数处理 |
| 5 | `https://service.bj.10086.cn/nwt/portal-bff/api/packageQuery/v1.0/index` | POST | 查询已订业务 |
| 6 | `https://service.bj.10086.cn/nwt/portal-bff/api/packageQuery/v1.0/unsubscribe` | POST | 退订业务 |

### 1.3 埋点/静态资源接口

HAR 中还包含以下非核心接口：

| 接口 | 说明 |
| --- | --- |
| `/nwt/events` | RUM/前端埋点上报，不参与业务逻辑 |
| `/nwt/rum/`、`/nwt/rumFornwt/rumFornwt.js` | 监控脚本，不参与业务逻辑 |
| `/nwt/config/agentConfig` | 前端监控配置 |
| `/nwt/portal/assets/*` | 静态资源 |

## 2. 登录接口通用规则

### 2.1 登录域名

```text
https://login.10086.cn
```

### 2.2 登录接口公共请求头

HAR 中登录 AJAX 接口基本一致：

```http
Host: login.10086.cn
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
X-Requested-With: XMLHttpRequest
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
Accept: application/json, text/javascript, */*; q=0.01
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Origin: https://login.10086.cn
Referer: https://login.10086.cn/html/bj/touch.html?channelID=21100&backUrl=<urlencoded backUrl>
Cookie: <浏览器登录页 Cookie>
```

`touchBjLogin.action` 的 `Accept` 在 HAR 中为：

```http
Accept: */*
```

### 2.3 登录参数加密

登录页使用 `JSEncrypt` 对关键字段做 RSA 公钥加密。

公钥：

```text
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsgDq4OqxuEisnk2F0EJFmw4xKa5IrcqEYHvqxPs2CHEg2kolhfWA2SjNuGAHxyDDE5MLtOvzuXjBx/5YJtc9zj2xR/0moesS+Vi/xtG1tkVaTCba+TV+Y5C61iyr3FGqr+KOD4/XECu0Xky1W9ZmmaFADmZi7+6gO9wjgVpU9aLcBcw/loHOeJrCqjp7pA98hRJRY+MML8MK15mnC4ebooOva+mJlstW6t/1lghR8WNV8cocxgcHHuXBxgns2MlACQbSdJ8c6Z3RQeRZBzyjfey6JCCfbEKouVrWIUuPphBL3OANfgp0B+QG31bapvePTfXU48TYK0M5kE+8LgbbWQIDAQAB
```

加密字段：

| 字段 | 明文 |
| --- | --- |
| `userName` | 手机号 |
| `account` | 手机号 |
| `password` | 登录短信验证码或服务密码 |
| `sendRandomCodeActionbj.action.inputCode` | 图形验证码 |

## 3. 登录接口详情

### 3.1 北京移动号码校验

```http
POST /chkNumberBjAction.action
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
```

请求参数：

| 参数 | 必填 | 加密 | 说明 |
| --- | --- | --- | --- |
| `userName` | 是 | RSA | 手机号 |

请求示例：

```text
userName=<RSA(phone)>
```

响应格式：

```json
true
```

说明：

- HAR 中响应体为 base64 `dHJ1ZQ==`，解码后为 `true`。
- 返回 `true` 表示北京移动号码校验通过。

### 3.2 图形验证码校验

```http
POST /verifyCaptcha.htm
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
```

请求参数：

| 参数 | 必填 | 加密 | 说明 |
| --- | --- | --- | --- |
| `inputCode` | 是 | 否 | 用户输入的图形验证码 |

请求示例：

```text
inputCode=52
```

响应格式：

```json
{
  "resultCode": "0"
}
```

说明：

- `resultCode = "0"` 表示验证码通过。
- 图形验证码图片地址通常为 `/captchazh.htm?type=05&timestamp=<ts>`。

### 3.3 获取短信发送 token

```http
POST /loadToken.action
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
```

请求参数：

| 参数 | 必填 | 加密 | 说明 |
| --- | --- | --- | --- |
| `userName` | 是 | RSA | 手机号 |

请求示例：

```text
userName=<RSA(phone)>
```

响应格式：

```json
{
  "rspType": "0",
  "rspCode": "0000",
  "rspDesc": "成功",
  "result": "<sms-token>"
}
```

说明：

- `result` 必须作为发送短信验证码接口的 `Xa-before` 请求头。

### 3.4 发送登录短信随机码

```http
POST /sendRandomCodeActionbj.action
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Xa-before: <loadToken.action 返回的 result>
```

请求参数：

| 参数 | 必填 | 加密 | 说明 |
| --- | --- | --- | --- |
| `userName` | 是 | RSA | 手机号 |
| `inputCode` | 是 | RSA | 图形验证码，可为空字符串的 RSA 密文 |
| `type` | 是 | 否 | 固定 `01` |
| `channelID` | 是 | 否 | HAR 中为 `21100` |

请求示例：

```text
userName=<RSA(phone)>&inputCode=<RSA(captcha)>&type=01&channelID=21100
```

响应格式：

```json
0
```

响应码：

| 响应 | 含义 |
| --- | --- |
| `0` | 短信发送成功 |
| `4005` | 手机号码有误 |
| `1` | 短信随机码暂时不能发送，请一分钟后再试 |
| `2` | 随机码获取达到上限 |
| `3` | 短信发送次数过于频繁 |
| `4` | 渠道 code 不能为空 |
| `5` | 渠道 code 异常 |
| `6` | 发送短信验证码失败 |

### 3.5 刷新短信发送标记图片

```http
GET /sendflag.htm?timestamp=<毫秒时间戳>
```

请求头：

```http
Accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8
Referer: https://login.10086.cn/html/bj/touch.html?channelID=21100&backUrl=<urlencoded backUrl>
Cookie: <浏览器登录页 Cookie>
```

说明：

- 该接口是页面行为，短信发送后前端刷新图片。
- 不参与登录业务参数计算。

### 3.6 北京移动触屏登录

```http
POST /touchBjLogin.action
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
```

请求参数：

| 参数 | 必填 | 加密 | HAR 示例 | 说明 |
| --- | --- | --- | --- | --- |
| `channelID` | 是 | 否 | `21100` | 渠道号 |
| `account` | 是 | RSA | `<RSA(phone)>` | 手机号 |
| `password` | 是 | RSA | `<RSA(smsCode)>` | 短信随机码或服务密码 |
| `pwdType` | 是 | 否 | `02` | `02` 表示短信随机码登录，`04` 表示网站密码登录 |
| `accountType` | 是 | 否 | `01` | 账号类型 |
| `inputCode` | 否 | 否 | 空 | 密码登录图形验证码 |
| `smsPwd` | 否 | 否 | 空 | 页面隐藏字段，源码实际使用 `password` |
| `backUrl` | 是 | 否 | `https://service.bj.10086.cn/nwt/portal/packageQuery?ssotouch2017=0` | 登录成功回跳地址 |
| `isNew` | 否 | 否 | 空 | 是否使用新账号 |
| `rememberMe` | 否 | 否 | `1` | 是否记住登录名 |
| `protocol` | 是 | 否 | `https:` | 当前页面协议 |

请求示例：

```text
channelID=21100
&account=<RSA(phone)>
&password=<RSA(smsCode)>
&pwdType=02
&accountType=01
&inputCode=
&smsPwd=
&backUrl=https%3A%2F%2Fservice.bj.10086.cn%2Fnwt%2Fportal%2FpackageQuery%3Fssotouch2017%3D0
&isNew=
&rememberMe=1
&protocol=https%3A
```

响应格式：

```json
{
  "artifact": "<sso-artifact>",
  "assertAcceptURL": "https://service.bj.10086.cn/nwt/portal/checkLogin",
  "code": "0000",
  "desc": "认证成功",
  "islocal": false,
  "result": "0",
  "type": "00",
  "uid": "<uid>"
}
```

成功判断：

```text
result == "0" && code == "0000"
```

登录成功后的跳转：

```text
<assertAcceptURL>?backUrl=<urlencoded backUrl>&artifact=<artifact>
```

## 4. 门户 BFF 通用调用规则

### 4.1 门户域名

```text
https://service.bj.10086.cn
```

BFF 基础路径：

```text
/nwt
```

### 4.2 WAF 参数 `XEbtxIBt`

HAR 中门户接口 URL 都带有 `XEbtxIBt` 查询参数，部分请求头中也出现同名字段：

```http
POST /nwt/portal-bff/api/packageQuery/v1.0/index?XEbtxIBt=<waf-token>
XEbtxIBt: <waf-token>
```

说明：

- `XEbtxIBt` 不是业务入参，是站点防护/浏览器环境脚本注入的动态 token。
- 源码业务 axios 没有显式写死该字段，HAR 说明请求在浏览器运行时被防护脚本改写。
- 脱离浏览器直接调用时，需要能执行页面防护脚本或复现该 token，否则可能被网关拦截。

### 4.3 门户 BFF 公共请求头

已登录 BFF 接口公共头：

```http
Accept: application/json, text/plain, */*
Content-Type: application/json;charset=UTF-8
Origin: https://service.bj.10086.cn
Referer: https://service.bj.10086.cn/nwt/portal/packageQuery?ssotouch2017=0
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
Cookie: <service.bj.10086.cn Cookie>
Authorization: bearer <access_token>
traceId: <uuid 去横线>
traceContext: <trace id>
traceparent: 00-<traceContext>-<spanId>-01
X-DATA-TOKEN: <RSA 加密后的动态 AES key>
X-REPLAY-VERSION: <AES 加密后的递增版本号>
XEbtxIBt: <waf-token>
```

注意：

- `Authorization` 在源码拦截器中自动从 `localStorage.access_token` 读取。
- `traceContext/traceparent` 在 HAR 中存在，通常由监控链路生成；核心业务校验更依赖 `Authorization`、`X-DATA-TOKEN`、`X-REPLAY-VERSION`、`XEbtxIBt`。

### 4.4 门户 BFF 加密方式

源码还原：

```text
算法: AES ECB
Padding: PKCS7
Key: 前端运行时生成的 16 位随机字符串
```

请求体加密：

```text
明文 JSON -> AES_ECB_PKCS7 -> base64 -> encodeURIComponent -> 作为 POST body
```

HAR 中 body 形态：

```json
"3alQ9ri6F9yeRudsYvso5CxYQ9kj6YcxItGrhCfIEcQ%3D"
```

也就是 JSON 字符串包裹的 URL 编码密文。

响应体：

```text
response.data 是 AES 密文，前端用同一个动态 AES key 解密，再 JSON.parse。
```

### 4.5 动态 key 初始化

源码流程：

1. 调用 `/nwt/portal-bff/api/keys/v1.0/get`。
2. 前端生成 16 位随机 AES key。
3. 用服务端公钥加密 AES key，生成 `X-DATA-TOKEN`。
4. 后续 BFF 请求携带 `X-DATA-TOKEN`，请求/响应使用该 AES key。

源码中硬编码 RSA 公钥：

```text
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2N7RVdbGQZqR/f74gz3m7SIRwJB3VsqWUT2VoGfCabPTAO7/D5YyYvxWr6OisJCoy3EM0xksFaTfMWyre0X/BURj7eC6DNJNRKmNyw2rx3O1N3HMcKYE3tPtEtZhpZLveigUPHmKpaRVvL51wAGmMGwP85Sh+h+NWl95+GgcslhoZ4wYIG+JVJ0DbGKtprXeRWmEQ+aLd8lT06zQ+R+6KstkTdn8MSotx3/zt827i5gUYUaZ4pUd9I8q/r6miLR1baNfEVA7F1nNAXoc+a/RpkFscT/+myCqDtk9kClOuECCDt62NA7+9HHzWL0+NWIuCkZFHXCwIDAQAB
-----END PUBLIC KEY-----
```

## 5. 门户 SSO 与用户信息接口

### 5.1 SSO touchLogin

```http
POST /nwt/sso/touchLogin?artifact=<artifact>&backUrl=<urlencoded currentUrl>&touch=touch
Content-Type: application/x-www-form-urlencoded;charset=utf-8
```

HAR 中还会追加：

```text
?XEbtxIBt=<waf-token>
```

请求头：

```http
Accept: application/json, text/plain, */*
Origin: https://service.bj.10086.cn
Referer: https://service.bj.10086.cn/nwt/portal/checkLogin?backUrl=<...>&artifact=<...>
Cookie: <service Cookie>
XEbtxIBt: <waf-token>
```

请求体：

```text
空
```

响应格式：

成功时：

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<refresh_token>",
  "name": "手机号",
  "expires_in": 7200
}
```

未登录或失败时：

```text
响应可能是一个登录页 URL 字符串，前端直接跳转。
```

前端存储：

| key | 来源 |
| --- | --- |
| `localStorage.access_token` | `access_token` |
| `localStorage.refresh_token` | `refresh_token` |
| `localStorage.userPhone` | `name` |
| `localStorage.access_token_expire` | `Date.now() + expires_in * 1000` |

### 5.2 初始化加密 key

```http
POST /nwt/portal-bff/api/keys/v1.0/get?XEbtxIBt=<waf-token>
Authorization: bearer <access_token>
```

请求头：

```http
Accept: application/json, text/plain, */*
Origin: https://service.bj.10086.cn
Referer: https://service.bj.10086.cn/nwt/portal/packageQuery?ssotouch2017=0
Authorization: bearer <access_token>
Cookie: <service Cookie>
XEbtxIBt: <waf-token>
```

请求体：

```text
空
```

响应：

```json
{
  "data": "<加密后的服务端 key 信息>"
}
```

说明：

- 该接口是后续 BFF AES 通信的前置接口。
- 业务调用必须在该接口之后进行。

### 5.3 查询在线用户信息

```http
POST /nwt/portal-bff/api/accountsj/v1.0/getOnlineUserInfo?XEbtxIBt=<waf-token>
Authorization: bearer <access_token>
X-DATA-TOKEN: <data-token>
X-REPLAY-VERSION: <version-token>
```

明文请求体：

```json
{}
```

实际 HAR body：

```text
<AES 密文或空 body，取决于源码是否传 data>
```

解密后响应格式：

```json
{
  "code": "0000",
  "message": "成功",
  "data": {
    "mobile": "手机号",
    "brand": "品牌",
    "userName": "用户名称"
  }
}
```

说明：

- 页面会把响应 `data` 存入 `localStorage.userInfo`。
- 退订接口使用其中的 `mobile` 和 `brand`。

### 5.4 登录 URL 参数处理

```http
POST /nwt/portal-bff/api/filter/v1.0/doLoginUrlParam?XEbtxIBt=<waf-token>
```

明文请求体：

```json
{
  "artifact": "<artifact>",
  "backUrl": "<backUrl>",
  "touch": "touch",
  "tklogin": ""
}
```

说明：

- 该接口用于门户登录回跳后的 URL 参数处理。
- 与“查询已订业务/退订”不是直接业务接口，但在 HAR 中出现在登录进入门户过程。

## 6. 查询已订业务接口

### 6.1 接口信息

```http
POST /nwt/portal-bff/api/packageQuery/v1.0/index?XEbtxIBt=<waf-token>
Authorization: bearer <access_token>
X-DATA-TOKEN: <data-token>
X-REPLAY-VERSION: <version-token>
Content-Type: application/json;charset=UTF-8
```

完整 URL：

```text
https://service.bj.10086.cn/nwt/portal-bff/api/packageQuery/v1.0/index?XEbtxIBt=<waf-token>
```

### 6.2 HAR 实测请求头

```http
Accept: application/json, text/plain, */*
Content-Type: application/json;charset=UTF-8
Origin: https://service.bj.10086.cn
Referer: https://service.bj.10086.cn/nwt/portal/packageQuery?ssotouch2017=0
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
Authorization: bearer <access_token>
traceId: <traceId>
traceContext: <traceContext>
traceparent: 00-<traceContext>-<spanId>-01
X-DATA-TOKEN: <data-token>
X-REPLAY-VERSION: <encrypted-version>
XEbtxIBt: <waf-token>
Cookie: <service Cookie>
```

### 6.3 明文入参

源码调用：

```js
PackageQuery.packageQueryIndex({
  pageVersion: route.query.pageVersion || ""
})
```

明文请求体：

```json
{
  "pageVersion": ""
}
```

### 6.4 HAR 密文 body

HAR 中 body 示例：

```json
"3alQ9ri6F9yeRudsYvso5CxYQ9kj6YcxItGrhCfIEcQ%3D"
```

解码逻辑：

```text
cipher = decodeURIComponent(body 去掉 JSON 字符串引号)
plain = AES_ECB_PKCS7_DECRYPT(cipher, dynamicAesKey)
```

### 6.5 解密后响应格式

页面源码使用：

```json
{
  "code": "0000",
  "message": "成功",
  "data": {
    "ywztShowList": [],
    "tcShowList": [],
    "mwywList": []
  }
}
```

字段说明：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `ywztShowList` | array | 基础功能列表 |
| `tcShowList` | array | 套餐列表 |
| `mwywList` | array | 增值业务列表，页面退订主要使用这个列表 |

业务项常见字段根据页面使用方式包括：

| 字段 | 说明 |
| --- | --- |
| `name` / `productName` | 业务名称 |
| `fee` / `price` | 资费信息 |
| `effTime` / `startTime` | 生效时间 |
| `expTime` / `endTime` | 到期时间 |
| `unsubscribeFlag` / 页面状态字段 | 是否可退订，具体字段以解密响应为准 |

## 7. 退订接口

### 7.1 接口信息

```http
POST /nwt/portal-bff/api/packageQuery/v1.0/unsubscribe?XEbtxIBt=<waf-token>
Authorization: bearer <access_token>
X-DATA-TOKEN: <data-token>
X-REPLAY-VERSION: <version-token>
Content-Type: application/json;charset=UTF-8
```

完整 URL：

```text
https://service.bj.10086.cn/nwt/portal-bff/api/packageQuery/v1.0/unsubscribe?XEbtxIBt=<waf-token>
```

### 7.2 HAR 实测请求头

```http
Accept: application/json, text/plain, */*
Content-Type: application/json;charset=UTF-8
Origin: https://service.bj.10086.cn
Referer: https://service.bj.10086.cn/nwt/portal/packageQuery?ssotouch2017=0
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
Authorization: bearer <access_token>
traceId: <traceId>
traceContext: <traceContext>
traceparent: 00-<traceContext>-<spanId>-01
X-DATA-TOKEN: <data-token>
X-REPLAY-VERSION: <encrypted-version>
XEbtxIBt: <waf-token>
Cookie: <service Cookie>
```

### 7.3 明文入参

源码调用：

```js
PackageQuery.packageQueryUnsubscribe({
  phoneNum: userInfo.mobile.trim(),
  brand: userInfo.brand,
  field1: selectedIndex
})
```

明文请求体：

```json
{
  "phoneNum": "手机号",
  "brand": "用户品牌",
  "field1": "选中的增值业务下标"
}
```

参数说明：

| 参数 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `phoneNum` | 是 | string | 当前登录用户手机号，来自 `userInfo.mobile` |
| `brand` | 是 | string | 用户品牌，来自 `userInfo.brand` |
| `field1` | 是 | string/number | 页面选中的增值业务序号 |

重要注意：

- `field1` 是页面选中的业务下标，不是产品编码。
- 门户退订 HAR 中没有单独的“发送退订验证码/确认退订验证码”接口，退订动作直接调用该接口。

### 7.4 HAR 密文 body

HAR 中 body 示例：

```json
"RHth2K4vtnppn7q0XVglZBmAGC%2B73wtKytmrbFYSFfjnXkkKqoOgYqpDSdMp2RlzRpQ5VqurI9GfqBi2wsyUNATjKHI3AtP3IIB0xXZ%2FlvA%3D"
```

明文结构对应：

```json
{
  "phoneNum": "手机号",
  "brand": "用户品牌",
  "field1": "业务下标"
}
```

### 7.5 解密后响应格式

页面源码成功判断：

```js
response.data.resType === "success"
```

响应示例：

```json
{
  "code": "0000",
  "message": "成功",
  "data": {
    "resType": "success",
    "resMsg": "退订成功"
  }
}
```

或部分接口会直接把业务结果放在 `data`：

```json
{
  "resType": "success",
  "resMsg": "退订成功"
}
```

失败示例：

```json
{
  "resType": "fail",
  "resMsg": "失败原因"
}
```

## 8. 完整调用流程

### 8.1 登录到门户

1. 打开登录页：

```text
https://login.10086.cn/html/bj/touch.html?channelID=21100&backUrl=https%3A%2F%2Fservice.bj.10086.cn%2Fnwt%2Fportal%2FpackageQuery%3Fssotouch2017%3D0
```

2. 调用 `chkNumberBjAction.action` 校验号码。
3. 如页面要求图形验证码，调用 `verifyCaptcha.htm`。
4. 调用 `loadToken.action` 获取 `sms-token`。
5. 调用 `sendRandomCodeActionbj.action` 发送短信随机码。
6. 调用 `touchBjLogin.action` 登录，拿到 `artifact` 和 `assertAcceptURL`。
7. 跳转：

```text
https://service.bj.10086.cn/nwt/portal/checkLogin?backUrl=<业务页>&artifact=<artifact>
```

8. 门户调用 `touchLogin`，拿到 `access_token`。

### 8.2 查询已订业务

1. 调用 `/portal-bff/api/keys/v1.0/get` 初始化动态 AES key。
2. 调用 `/portal-bff/api/accountsj/v1.0/getOnlineUserInfo` 获取 `mobile/brand`。
3. 调用 `/portal-bff/api/packageQuery/v1.0/index`，明文参数为 `{ "pageVersion": "" }`。
4. 解密响应，读取：

```text
data.ywztShowList
data.tcShowList
data.mwywList
```

### 8.3 退订业务

1. 用户从 `mwywList` 选择一个可退订业务。
2. 页面记录该业务在列表中的下标。
3. 调用 `/portal-bff/api/packageQuery/v1.0/unsubscribe`。
4. 明文参数：

```json
{
  "phoneNum": "userInfo.mobile",
  "brand": "userInfo.brand",
  "field1": "selectedIndex"
}
```

5. 解密响应，判断：

```text
data.resType == "success"
```

6. 退订后重新调用查询接口刷新列表。

## 9. 调用实现注意事项

1. 登录接口 RSA 加密必须和页面 `JSEncrypt` 一致。
2. `sendRandomCodeActionbj.action` 必须带 `Xa-before`，值来自 `loadToken.action.result`。
3. `touchBjLogin.action` 的 `password` 是 RSA 后的短信验证码，不要把验证码放到 `smsPwd`。
4. 登录成功后必须使用 `artifact` 进入 `service.bj.10086.cn/nwt/portal/checkLogin`。
5. 门户 BFF 必须携带 `Authorization: bearer <access_token>`。
6. 门户 BFF 请求必须先初始化 `/keys/v1.0/get`，拿到动态 AES 通信上下文。
7. `X-DATA-TOKEN`、`X-REPLAY-VERSION`、请求 body、响应 body 都和动态 AES key 绑定。
8. `X-REPLAY-VERSION` 是递增版本号加密值，不能固定复用。
9. `XEbtxIBt` 是浏览器环境/防护脚本生成的动态字段，直接 HTTP 客户端调用时不能忽略。
10. 门户退订的 `field1` 是列表下标，不是业务编码。
11. 门户 HAR 中没有退订短信验证码接口；如果需要短信确认式退订，应使用 APP H5 那套 `getSmsCode/getUnifyCancel` 接口，而不是本门户 `packageQueryUnsubscribe`。

## 10. 脱敏 curl 示例

### 10.1 发送登录短信验证码

```bash
curl 'https://login.10086.cn/sendRandomCodeActionbj.action' \
  -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'Origin: https://login.10086.cn' \
  -H 'Referer: https://login.10086.cn/html/bj/touch.html?channelID=21100&backUrl=<backUrl>' \
  -H 'Xa-before: <sms-token>' \
  -H 'Cookie: <login-cookie>' \
  --data 'userName=<RSA(phone)>&inputCode=<RSA(captcha)>&type=01&channelID=21100'
```

### 10.2 登录

```bash
curl 'https://login.10086.cn/touchBjLogin.action' \
  -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'Origin: https://login.10086.cn' \
  -H 'Referer: https://login.10086.cn/html/bj/touch.html?channelID=21100&backUrl=<backUrl>' \
  -H 'Cookie: <login-cookie>' \
  --data 'channelID=21100&account=<RSA(phone)>&password=<RSA(smsCode)>&pwdType=02&accountType=01&inputCode=&smsPwd=&backUrl=<urlencoded-backUrl>&isNew=&rememberMe=1&protocol=https%3A'
```

### 10.3 查询已订业务

```bash
curl 'https://service.bj.10086.cn/nwt/portal-bff/api/packageQuery/v1.0/index?XEbtxIBt=<waf-token>' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  -H 'Origin: https://service.bj.10086.cn' \
  -H 'Referer: https://service.bj.10086.cn/nwt/portal/packageQuery?ssotouch2017=0' \
  -H 'Authorization: bearer <access_token>' \
  -H 'X-DATA-TOKEN: <data-token>' \
  -H 'X-REPLAY-VERSION: <encrypted-version>' \
  -H 'XEbtxIBt: <waf-token>' \
  -H 'Cookie: <service-cookie>' \
  --data '"<urlencoded AES ciphertext of {\"pageVersion\":\"\"}>"'
```

### 10.4 退订业务

```bash
curl 'https://service.bj.10086.cn/nwt/portal-bff/api/packageQuery/v1.0/unsubscribe?XEbtxIBt=<waf-token>' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  -H 'Origin: https://service.bj.10086.cn' \
  -H 'Referer: https://service.bj.10086.cn/nwt/portal/packageQuery?ssotouch2017=0' \
  -H 'Authorization: bearer <access_token>' \
  -H 'X-DATA-TOKEN: <data-token>' \
  -H 'X-REPLAY-VERSION: <encrypted-version>' \
  -H 'XEbtxIBt: <waf-token>' \
  -H 'Cookie: <service-cookie>' \
  --data '"<urlencoded AES ciphertext of {\"phoneNum\":\"手机号\",\"brand\":\"品牌\",\"field1\":\"下标\"}>"'
```

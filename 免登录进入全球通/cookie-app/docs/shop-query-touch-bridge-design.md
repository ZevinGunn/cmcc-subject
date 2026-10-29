# 查询和退订：10086 Cookie 置换 touch/shop 登录态及业务接口设计

## 1. 文档范围

本文是 cookie-app 新功能“查询和退订”的接口分析、产品设计和开发说明。功能与现有“已订业务”并行存在，不替换原页面和 `/api/business-query` 接口。

分析依据：

- `10086到touch.har`：10086 个人中心跳转 touch 的完整请求示例。
- `业务查询和退订.har` 及保存的 shop 页面源码：商城业务查询、短信和退订请求示例。
- cookie-app 现有账号、public 用户、管理员用户和“已订业务”实现。

## 2. 产品结论

### 2.1 入口与权限

- 页面名称：`查询和退订`。
- 页面路由：`/shop-query?accountId=<账号ID>`。
- public 用户账号菜单与管理员用户详情的关联账号表均提供入口。
- 管理员首页的账号工具箱同步提供入口。
- 使用独立的 `shopQuery` 权限，控制 public 用户的“查询和退订”入口及全部 shop-query API；原“已订业务”继续使用 `businessQuery`。
- 历史用户没有 `shopQuery` 字段时，在认证存储初始化阶段按原 `businessQuery` 值回填到 `permissionsJson`，确保展示值与数据库实际权限一致；回填后两项权限可独立开关。
- 页面只接受已存储账号，不提供手工输入手机号或 Cookie；手机号和 10086 Cookie 均复用账号信息。

### 2.2 本项目的可退订标准

原 shop 页面显示退订按钮的条件是：

```text
isOrdered == "02" && isUnOrder == "01"
```

这个条件只能证明原商城前端何时显示按钮，不能证明移动服务端对产品、合约、账户状态的完整受理规则。

本项目按产品要求采用以下标准：

1. 只要业务由当前账号的查询接口返回，就设置 `canUnsubscribe: true`。
2. 每一项查询结果都显示可点击的“尝试退订”按钮。
3. 前端不按 `isOrdered`、`isUnOrder` 禁用按钮。
4. 后端不按 `isOrdered`、`isUnOrder` 拒绝短信或退订请求。
5. `isOrdered`、`isUnOrder` 只作为移动侧原始状态展示。
6. 是否实际可退订、是否退订成功，以移动侧 `/v1/busi/ordermodify` 的 `retCode` 和 `retMsg` 为准。

因此，本项目中的“可以退订”准确含义是“可以发起一次真实的退订尝试”，不是对移动侧最终受理结果的承诺。

## 3. 10086 Cookie 到 touch/shop Cookie

### 3.1 入口请求

HAR 中的核心请求：

```http
GET https://wx.10086.cn/website/bind/bindAccount/new
  ?tokenKey=token
  &netUniChannelId=019020
  &netUniBackUrl=<touch backUrl>
Cookie: <10086 Cookie>
```

当前实现使用：

```text
https://touch.10086.cn/i/mobile/mycoupons.html
  ?vtAutoFlag=0&e=99&c=20&sign=ffffffe0
```

10086 返回 `302`，`Location` 中包含 42 位 `token`，响应还可能写入 `d.sid`。服务端必须合并每一步 `Set-Cookie`，不能只保存最后一步。

### 3.2 touch 初始化签名

touch 源码组合：

```js
wrapped = "B3A128FA" + token + "B3A128FA"
sign = hex_hmac_md5("", wrapped)
```

Node.js 等价实现：

```ts
createHmac('md5', '').update(wrapped, 'utf8').digest('hex')
```

### 3.3 touch 初始化加密

初始化明文：

```json
{
  "token": "<Location token>",
  "backUrl": "<完整 touch Location>",
  "sysId": "001",
  "sign": "<HMAC-MD5>"
}
```

加密参数：

| 项目 | 值 |
| --- | --- |
| 算法 | AES-128-CBC |
| Padding | PKCS#7 |
| 字符集 | UTF-8 |
| Key | `043AOQGK6ykklyZA` |
| IV | `043AOQGK6ykklyZA` |
| 输出 | AES 密文 Base64，一层 Base64 |

请求：

```http
POST https://touch.10086.cn/i/v1/auth/initMobileMessage
Content-Type: application/json
Cookie: <已合并的 Cookie>

{
  "data": "<AES Base64>",
  "channel": "12"
}
```

注意：`initMobileMessage` 属于 `/v1/auth/`，touch 公共请求封装不会再把整个请求包装成 `inParam`。它与后续 shop 业务接口的双层 Base64 格式不同。

### 3.4 登录态判定

初始化后合并 `Set-Cookie`，至少识别以下字段：

- `d.sid`
- `channel`
- `jsessionid-cmcc`
- `is_login`
- `mobiletoken`

当前实现以存在 `mobiletoken` 或 `jsessionid-cmcc` 作为获得 touch/shop 会话的必要条件。touch 与 shop 请求均由本地服务端显式发送这份 Cookie，因此不依赖浏览器域 Cookie 行为。

## 4. shop 传输加密

业务接口继续使用同一 AES key/IV，但传输格式多一层 Base64：

```text
明文 UTF-8
  -> AES-128-CBC / PKCS#7
  -> 密文 Base64 文本
  -> Base64(上一层 Base64 文本的 UTF-8 字节)
  -> wire value
```

响应 `data.outParam`、请求 `inParam`、手机号路径参数和 `msgId` 都使用该格式。

## 5. 上游接口作用和必要字段

### 5.1 登录态信息

```http
GET https://shop.10086.cn/i/v1/auth/loginfo
```

作用：校验 shop 登录态，并取得加密的 `msgId` 会话 seed。短信和退订前均重新读取，不长期缓存 seed。

### 5.2 查询业务

```http
GET https://shop.10086.cn/i/v1/busi/order/{encryptedPhone}?_=<毫秒时间戳>
provcode: 100
payPhoneNo: <encryptedPhone><手机号第6、7位>
Cookie: <shop Cookie>
```

必要输入：

- 账号手机号：11 位中国移动号码。
- 由 10086 Cookie 置换出的 shop Cookie。
- `encryptedPhone`：手机号按 shop 双层 Base64 协议加密。

查询结果按 `prodType` 分组。当前已知分类：

| 编码 | 含义 |
| --- | --- |
| `01` | 我的套餐 |
| `02` | 增值业务 |
| `03` | 基础功能 |
| `04` | 其他 |
| `05` | 代收费业务 |
| `06` | 已参加活动 |
| `07` | 政企业务 |

### 5.3 发送退订验证码

```http
POST https://shop.10086.cn/i/v1/cust/commonSms/{encryptedPhone}
```

必要明文入参：

```json
{
  "msgType": "02",
  "busiCode": "业务编码",
  "busiName": "prodType 分类编码",
  "phoneNo": "手机号"
}
```

线上请求体：

```json
{
  "inParam": "<加密的上述 JSON>",
  "msgId": "<加密的 Date.now() + sessionSeed>"
}
```

这里的字段名虽然叫 `busiName`，但抓包和源码都表明实际值为 `prodType`，不是中文业务名称。

### 5.4 确认退订

```http
POST https://shop.10086.cn/i/v1/busi/ordermodify/{encryptedPhone}
```

退订所需的必要入参：

| 字段 | 来源 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| `phone` | 账号 | 是 | 用于 URL、请求头和移动侧校验 |
| `cookie` | 置换会话 | 是 | touch/shop 登录态 |
| `busiType` | 查询结果 | 是 | 业务类型 |
| `busiCode` | 查询结果 | 是 | 业务编码 |
| `bizCode` | 查询结果 | 条件字段 | 缺失时按原源码发送字符串 `"null"` |
| `spid` | 查询结果 | 条件字段 | 缺失时按原源码发送字符串 `"null"` |
| `oprCode` | 固定值 | 是 | 退订固定为 `"01"` |
| `smsCode` | 用户短信 | 是 | 6 位数字验证码 |
| `msgId` | `loginfo` | 是 | `Date.now() + seed` 加密结果 |

明文业务体：

```json
{
  "orderInfos": [
    {
      "busiType": "01",
      "bizCode": "null",
      "busiCode": "业务编码",
      "spid": "null",
      "oprCode": "01",
      "smsCode": "123456"
    }
  ]
}
```

本地 API 不接受客户端直接提交上述上游字段。客户端只提交本次查询返回的 `businessId`，后端从当前会话保存的查询结果中读取必要字段，以减少参数篡改和误操作。

## 6. 本地 API

| 本地接口 | 方法 | 功能 |
| --- | --- | --- |
| `/api/shop-query/accounts/:id/prepare` | POST | 校验账号权限，恢复 10086 Cookie，置换 shop Cookie，建立短期会话 |
| `/api/shop-query/query` | POST | 查询业务、解密并归一化，同时把完整业务字段写入服务端会话 |
| `/api/shop-query/unsubscribe/sms` | POST | 按 `businessId` 发送退订短信 |
| `/api/shop-query/unsubscribe` | POST | 按 `businessId` 和 6 位短信码提交退订 |
| `/api/shop-query/session/:id` | DELETE | 删除本地短期会话 |

查询、短信和退订公共本地入参：

```json
{
  "accountId": "账号ID",
  "sessionId": "短期会话ID"
}
```

短信额外传 `businessId`；退订额外传 `businessId`、`smsCode`。

## 7. 页面和交互设计

- 首次进入自动准备登录态并查询，不要求重复输入账号信息。
- 顶部显示账号、查询数量和移动侧查询时间。
- 分类标签、业务名称/编码搜索、桌面双列与移动单列布局。
- 每项展示分类、业务编码、资费、订购/生效/失效时间和原始状态。
- 所有项目均显示“尝试退订”。
- 退订弹窗先发送验证码，输入 6 位短信码并明确勾选确认后才能提交。
- 提交成功后自动刷新列表；上游拒绝时原样展示 `retMsg`。
- 不提供批量退订，降低不可逆误操作风险。

## 8. 会话、数据与安全

- 原始 10086 Cookie 和 shop Cookie 均不下发到浏览器。
- shop Cookie 使用账号现有加密凭据字段 `cmccAppCookie` 持久化；进入页面时先用 `loginfo` 验证并复用，失效后才重新执行 10086 置换，避免短时间重复初始化被移动侧拒绝。页面实际操作使用 24 小时内存会话。
- 页面只得到脱敏手机号、账号摘要和不含 Cookie 的会话元数据。
- 每次请求重新校验管理员身份或 public 用户、`shopQuery` 权限和账号关联关系，隐藏前端按钮不能绕过后端授权。
- 业务操作只允许引用当前会话最后一次查询中的 `businessId`。
- 短信码不写日志、不持久化。
- 上游 HTTP 日志会对 Cookie、token 和 Location 敏感参数脱敏。
- 本功能不会绕过短信验证、风控、合约或移动侧权限判定。

## 9. 错误与边界

| 场景 | 行为 |
| --- | --- |
| 账号无 11 位手机号 | 阻止准备会话 |
| 10086 Cookie 过期 | 尝试现有恢复链路，失败后提示重新登录 |
| 302 未返回 token | 判定置换失败 |
| touch 初始化未写入会话 Cookie | 判定置换失败 |
| shop 返回 HTML 或非 JSON | 返回明确的上游格式错误 |
| `outParam` 解密失败 | 返回解密失败，不展示伪造空列表 |
| 会话过期或账号不匹配 | 拒绝请求并要求重新进入 |
| 业务 ID 不在最后查询结果中 | 拒绝短信/退订并要求重新查询 |
| 短信码不是 6 位数字 | 前后端同时阻止 |
| 移动侧不允许退订 | 展示移动侧 `retCode/retMsg`，不改写为成功 |

## 10. 代码结构

```text
api/
├── routes/shopQuery.ts              # 本地受权 REST API
├── services/cmccShopCrypto.ts       # touch 单层 AES、shop 双层 Base64、登录签名
├── services/cmccShopSession.ts      # 10086 -> touch/shop Cookie 置换
└── services/cmccShopBusiness.ts     # 查询、会话业务快照、短信与退订

src/
├── pages/ShopQueryPage.tsx          # 查询和退订页面
├── pages/PublicLogin.tsx            # public 账号入口
├── pages/UsersAdmin.tsx             # 管理员用户关联账号入口
├── pages/Home.tsx                   # 管理员账号工具箱入口
└── App.tsx                          # `/shop-query` 页面路由
```

## 11. 验收标准

1. 原“已订业务”入口和页面保持可用。
2. public 和管理员用户详情均能从有 Cookie 的账号进入“查询和退订”。
3. 10086 Cookie 能完成 touch/shop 登录态置换；置换失败有明确错误。
4. 查询结果正确解密、分类和搜索。
5. 每一项查询结果均可点击“尝试退订”，不受 `isOrdered/isUnOrder` 限制。
6. 缺少必要字段、会话、权限或 6 位验证码时后端拒绝请求。
7. 短信和退订请求的 `inParam/msgId` 使用正确加密协议。
8. 移动侧真实成功/失败信息能传递到页面。
9. 桌面和移动视口无内容重叠或横向溢出。

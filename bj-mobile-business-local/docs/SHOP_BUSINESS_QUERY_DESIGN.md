# 中国移动商城业务查询与退订接口分析及本地实现设计

## 1. 文档范围

本文基于以下材料完成分析和实现：

- `业务查询和退订.har`
- `业务查询和退订/shop.10086.cn/i/index.html`
- `业务查询和退订/shop.10086.cn/i/pkg/requirepkg_254c111.js`
- `业务查询和退订/shop.10086.cn/i/service/model/busi_318e33b.js`
- `业务查询和退订/shop.10086.cn/i/service/model/fee_7871fe8.js`
- `业务查询和退订/shop.10086.cn/i/apps/serviceapps/busideal/index.html`
- `业务查询和退订/shop.10086.cn/i/apps/serviceapps/busideal/busi_1a14169.js`

目标是还原 `shop.10086.cn/i` 商城链路的传输协议，完成本地加解密工具、已订业务查询和短信验证退订。该链路与项目已有的北京移动门户 BFF 链路不同，二者在项目中并行保留。

## 2. 核心结论

### 2.1 加密参数

| 项目 | 值 |
| --- | --- |
| 算法 | AES-128-CBC |
| 填充 | PKCS#7 |
| 字符编码 | UTF-8 |
| 密钥 | `043AOQGK6ykklyZA` |
| IV | 与密钥相同，即 `043AOQGK6ykklyZA` |
| AES 输出 | Base64 |
| 传输输出 | 再对 AES Base64 文本做一次 Base64 |

源码没有直接写出完整密钥，而是在 `commonutil` 中定义：

```js
var b = ["043A", "lyZA", "OQGK", "043A", "6ykk", "OQGK", "lyZA", "6ykk"]
var k = b.filter(function (_, i) { return i % 2 == 0 }).join("")
```

取偶数下标后得到：

```text
043A + OQGK + 6ykk + lyZA = 043AOQGK6ykklyZA
```

`stcutil.getAesString` 与 `getDAesString` 的实现使用 `CryptoJS.AES`、CBC 和 PKCS7，传入的 key 与 IV 都是 `k`。

### 2.2 `encryptToken` 不是本链路业务密钥

`/v1/auth/loginfo` 响应里存在动态 `encryptToken`，页面也会写入 `sessionStorage.encryptToken`。但本次查询、短信和退订请求实际都经过 `commonutil`，其中固定使用上述 `k`。HAR 样本使用固定密钥可以完整解开手机号路径、`inParam`、`msgId` 和 `outParam`，因此 `encryptToken` 不是这条传输封装的实际密钥。

### 2.3 传输封装

加密：

```text
plain UTF-8
  -> AES-128-CBC(key=k, iv=k, PKCS7)
  -> AES ciphertext Base64 text
  -> Base64(UTF-8 bytes of previous Base64 text)
  -> wire value
```

解密：

```text
wire value
  -> Base64 decode to AES Base64 text
  -> AES-128-CBC decrypt(key=k, iv=k, PKCS7)
  -> plain UTF-8
  -> JSON.parse when applicable
```

这里是“双层 Base64 形式”，不是对二进制密文连续做两次相同操作。外层 Base64 的输入是 CryptoJS 输出的 Base64 字符串。

## 3. HAR 验证结果

对 HAR 的核心记录进行了解密验证：

| HAR 条目 | 验证结果 |
| --- | --- |
| `GET /v1/busi/order/{encryptedPhone}` | 路径末段解密为抓包手机号，文档中记为 `152****4812` |
| 查询响应 `data.outParam` | 解密为 4 个业务分类、共 136 条业务 |
| `POST /v1/cust/commonSms/{encryptedPhone}` | `inParam` 解密为退订短信请求 JSON |
| 短信响应 `data.outParam` | 解密为短信流水/结果文本 |
| `POST /v1/busi/ordermodify/{encryptedPhone}` | `inParam` 解密为 `orderInfos` 数组和 6 位验证码 |
| 退订响应 `data.outParam` | 解密为空数组，外层 `retCode=000000`、`retMsg=退订成功` |
| 请求 `msgId` | 解密为 13 位毫秒时间戳拼接会话随机后缀 |

查询样本分类统计：

| `prodType` | 页面含义 | HAR 数量 |
| --- | --- | --- |
| `01` | 我的套餐 | 23 |
| `02` | 增值业务 | 90 |
| `03` | 基础功能 | 20 |
| `04` | 其他 | 3 |

页面源码还定义了 `05` 代收费业务、`06` 已参加活动和 `07` 政企业务。本次普通业务查询响应没有返回后三类；本地实现仍保留未知/扩展分类的兼容展示。

## 4. 原始接口说明

### 4.1 登录态信息

```http
GET https://shop.10086.cn/i/v1/auth/loginfo
Cookie: <shop.10086.cn 登录 Cookie>
```

用途：

- 判断商城 Cookie 是否仍有效。
- 获取掩码手机号、品牌、省份、渠道。
- 获取加密的 `msgId` 会话后缀。

解密后的关键字段：

| 字段 | 作用 |
| --- | --- |
| `loginValue` | 掩码登录号码 |
| `provice` | 省份编码，北京为 `100` |
| `brand` | 品牌编码 |
| `channel` | 当前渠道 |
| `msgId` | 再次使用商城协议解密后得到会话后缀 |

### 4.2 查询已订业务

```http
GET https://shop.10086.cn/i/v1/busi/order/{encryptedPhone}?_=<timestamp>
provcode: 100
payPhoneNo: <encryptedPhone><phone[5:7]>
Cookie: <shop Cookie>
```

`encryptedPhone` 为手机号经过商城传输加密后的值。`payPhoneNo` 在加密手机号后拼接原手机号第 6、7 位，行为来自公共请求头封装源码。

成功响应：

```json
{
  "data": {
    "outParam": "<encrypted groups>"
  },
  "retCode": "000000",
  "retMsg": null,
  "sOperTime": "yyyyMMddHHmmss"
}
```

`outParam` 解密后：

```json
[
  {
    "prodType": "02",
    "orderBusis": [
      {
        "busiName": "业务名称",
        "busiCode": "业务编码",
        "busiType": "01",
        "bizCode": null,
        "spid": null,
        "busiFee": null,
        "orderedTime": "yyyyMMdd",
        "effectTime": "yyyyMMdd",
        "extinctTime": "yyyyMMdd 或状态文本",
        "unsubscribeTime": null,
        "isOrdered": "02",
        "isUnOrder": "01"
      }
    ]
  }
]
```

原商城页面的退订按钮显示条件来自模板源码：

```text
isOrdered == "02" && isUnOrder == "01"
```

`isOrdered == "01"` 时原页面显示“已退订”。这是商城前端的展示规则，不是已证明的服务端受理规则。

本地项目按产品要求不使用该条件限制操作。查询返回的每一项业务均显示“尝试退订”按钮，后端也不根据 `isOrdered/isUnOrder` 拦截请求。原始字段继续展示，用于说明商城原页面状态和定位服务端拒绝原因。最终能否退订仍由移动侧接口根据产品、合约、账户和业务规则判定。

### 4.3 发送退订验证码

```http
POST https://shop.10086.cn/i/v1/cust/commonSms/{encryptedPhone}
Content-Type: application/json
```

明文业务入参：

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
  "inParam": "encrypt(JSON.stringify(payload))",
  "msgId": "encrypt(Date.now() + sessionSeed)"
}
```

注意：源码变量名为 `busiName`，但页面实际把点击元素参数的第 5 项传入；该项是分类 `i`，HAR 也验证为 `02` 一类的分类编码，而非中文业务名称。本地实现保持这一行为。

### 4.4 确认退订

```http
POST https://shop.10086.cn/i/v1/busi/ordermodify/{encryptedPhone}
Content-Type: application/json
```

明文业务入参：

```json
{
  "orderInfos": [
    {
      "busiType": "01",
      "bizCode": "null",
      "busiCode": "业务编码",
      "spid": "null",
      "oprCode": "01",
      "smsCode": "6 位短信验证码"
    }
  ]
}
```

线上请求体同样由 `inParam` 和 `msgId` 组成。源码通过字符串拼接生成退订参数，因此缺失的 `bizCode`、`spid` 在 HAR 中是字符串 `"null"`，不是 JSON `null`；本地实现按该格式发送。

### 4.5 `msgId` 生成

页面初始化时把 `loginfo.msgId` 写入 `sessionStorage.aqjg_cmcc_month`。每次 POST 前执行：

```text
seed = decrypt(base64decode(loginfo.msgId))
plainMsgId = Date.now() + seed
msgId = encrypt(plainMsgId)
```

本地后端在每次短信或退订请求前重新调用 `loginfo` 获取当前 seed，不缓存、不落盘，避免会话后缀过期。

## 5. 本地产品设计

### 5.1 页面入口

| 路由 | 页面 |
| --- | --- |
| `#/shop` | 商城 Cookie 查询与退订工作台 |
| `#/debug` | 加解密调试页 |
| `#/login` | 原北京移动门户短信登录 |
| `#/business` | 原门户已订业务页 |

商城页不依赖门户登录会话。用户输入手机号和商城 Cookie 后可直接查询。Cookie 默认只保存在组件内；勾选“本次标签页记住 Cookie”时才写入 `sessionStorage`，关闭标签页后由浏览器清理。

### 5.2 商城工作台功能

- 手机号和商城 Cookie 输入。
- 查询总数、可尝试退订数量、查询时间汇总。
- 按商城原始分类切换。
- 按业务名称或业务编码搜索。
- 展示业务编码、订购、生效、失效、资费和状态。
- 所有查询项目均启用“尝试退订”按钮，不按商城前端状态预先限制。
- 发送退订短信验证码，60 秒倒计时。
- 6 位验证码和明确确认后提交退订。
- 退订成功后自动重新查询列表。
- 桌面表格和移动端纵向信息布局。

### 5.3 加解密调试功能

调试页新增两个专用模式：

| 模式 | 行为 |
| --- | --- |
| 移动商城传输值加密 | 明文 -> AES-CBC Base64 -> 外层 Base64 |
| 移动商城传输值解密 | 自动提取容器值 -> 外层 Base64 解码 -> AES-CBC 解密 -> 尝试 JSON 格式化 |

解密输入支持：

- 原始 `inParam`、`msgId` 或 `outParam` 字符串。
- `{"inParam":"..."}` 请求体。
- `{"data":{"outParam":"..."}}` 响应体。
- 完整 URL，自动取路径最后一段。
- HAR 导入后选中的请求或响应内容。

默认 key 已填写为源码还原值，也允许临时覆盖以便测试其他环境。

## 6. 本地 API 设计

| 本地接口 | 方法 | 作用 |
| --- | --- | --- |
| `/api/shop-business/session` | POST | 验证商城登录态并读取元数据 |
| `/api/shop-business/query` | POST | 查询并解密已订业务 |
| `/api/shop-business/unsubscribe/sms` | POST | 发送退订验证码 |
| `/api/shop-business/unsubscribe` | POST | 验证短信码并退订 |
| `/api/debug/crypto` | POST | 专用及门户加解密调试 |

商城接口公共本地入参：

```json
{
  "phone": "11 位手机号",
  "cookie": "shop.10086.cn Cookie"
}
```

退订接口额外包含查询结果中的 `business` 对象和 `smsCode`。

## 7. 代码结构

```text
backend/src/
├── routes/shopBusiness.js            # 本地商城 REST API
├── services/shopBusinessClient.js    # 上游调用、字段归一化、退订流程
├── services/cryptoService.js         # 商城及原门户加解密
└── routes/debug.js                    # 本地加解密调试 API

frontend/src/
├── pages/ShopBusinessPage.vue         # 商城查询与退订工作台
├── pages/CryptoDebugPage.vue          # 加解密调试页
├── pages/LoginPage.vue                # 增加商城与调试入口
├── api/client.js                      # 商城本地 API 客户端
└── styles/app.css                     # 桌面与移动布局
```

## 8. 安全与边界

- 工具只应在可信本机或受控内网运行。
- 后端不会持久化商城 Cookie，也不会把 Cookie、短信码写入请求日志。
- 商城查询和退订响应在后端日志中整体省略，避免记录用户业务清单。
- 前端日志会对 `cookie`、`code`、`token`、`phone` 字段脱敏。
- 调试 API 默认仅允许 `localhost`、`127.0.0.1` 或 `::1` 访问。
- Cookie、`cmccssotoken`、`jsessionid-cmcc` 和 `msgId` seed 都有时效；失效后应从已登录商城重新获取 Cookie。
- 真实退订是不可逆的外部业务操作，页面要求短信验证和显式确认，不提供批量退订。
- 页面不绕过图形验证码、短信验证码、WAF 或账号权限校验。

## 9. 错误处理

| 场景 | 本地行为 |
| --- | --- |
| 手机号格式错误 | 请求前阻止并提示 |
| Cookie 为空或含换行 | 后端拒绝请求 |
| 登录态过期 | 展示移动侧 `retMsg`，要求更新 Cookie |
| `outParam` 解密失败 | 返回“移动商城响应解密失败”，保留脱敏错误信息 |
| 缺少 `msgId` seed | 阻止短信/退订并提示刷新 Cookie |
| 移动侧不允许退订 | 保留移动侧 `retCode/retMsg` 并提示失败，不在本地预判 |
| 短信码不是 6 位数字 | 前后端共同拒绝 |
| 上游超时或网络失败 | 本地 API 返回服务错误，不自动重放退订 |

## 10. 验证

后端测试覆盖：

- 匿名手机号固定密文解密。
- 匿名退订 `inParam` 字段解密。
- 中文 JSON 加解密往返。
- `inParam`、`data.outParam` 容器自动提取。
- 业务分类映射以及所有查询项目均可尝试退订的产品规则。
- 项目原有门户 AES、活动和自定义办理测试。

构建与测试命令：

```bash
npm --prefix backend test
npm --prefix frontend run build
```

实现不自动使用 HAR 中的真实 Cookie 发起线上请求。最终联调需要用户在本地页面填入当前有效 Cookie，并使用本人号码进行只读查询；退订需再经过本人短信验证和页面确认。

# 活动配置订阅与加解密能力分析设计

## 1. 文档目标

本文基于以下三类材料完成分析，并作为后续开发与验收依据：

- `请求示例.har`：2026-07-16 抓取的 29 条网络请求。
- `1000M优享/`：活动 HTML、入口脚本、样式、图片和已保存的接口响应。
- `bj-mobile-business-local/`：现有 Vue + Express 本地业务查询/退订工具。

目标是在现有短信登录、门户会话和加解密能力上增加：

1. 通过本地活动配置描述活动、表单、接口步骤和成功条件。
2. 登录后快速完成资格检查、必要的实名检查和活动订阅。
3. 通过可配置的密钥、算法、模式、填充、编码方式对任意入参与响应做加解密。
4. 对敏感字段、真实订购动作和历史抓包限制给出明确边界。

## 2. 结论摘要

### 2.1 接口结论

HAR 中唯一的活动业务接口是：

```text
POST /nwt/portal-bff/api/ajybz/v1.0/index1000MYXTC
```

它用于判断当前登录号码是否具有活动资格。前端不传业务字段，逻辑上的明文请求体是空对象 `{}`。抓包中 `postData` 为空，是因为该请求的调用函数没有显式参数；门户拦截器仍会附加加密会话头。

前端脚本还确认了后续三条业务接口：

```text
POST /nwt/portal-bff/api/ajybz/v1.0/index
POST /nwt/portal-bff/api/ajybz/v1.0/checkMobile?itemCode=111602057454
POST /nwt/portal-bff/api/ajybz/v1.0/checkRealName
POST /nwt/portal-bff/api/ajybz/v1.0/commit1000MYXTC
```

`index` 用于判断当前号码是否已有一条生效或即将生效的融合宽带；`checkMobile` 检查产品是否可办、实名状态和黑名单状态；`checkRealName` 做姓名与身份证匹配；`commit1000MYXTC` 提交报装订单。

### 2.2 活动结论

活动产品固定为：

```json
{
  "itemCode": "111602057454",
  "name": "融合宽带1000M优享套餐（三年）",
  "contractMonths": 36,
  "downlink": "1000M",
  "uplink": "50M",
  "monthlyCommittedCommunicationFee": 100,
  "earlyTerminationFee": 200
}
```

核心限制如下：

- 仅限“福利狂欢奖上加奖”活动中奖客户新装办理。
- 合约期 36 个月。
- 每月手机实付通信费需达到 100 元，未达到时按承诺金额收取补差款。
- 安装成功当月不收费，套餐次月生效。
- 合约期内取消需交纳 200 元违约款。
- 期满未提出终止或变更时自动延续 36 个月，延期次数不限。
- 副卡号码、非 FTTH 小区不能办理。
- 手机停机时宽带不停机且继续正常计费。
- 取消时需要归还光猫、机顶盒、路由器等设备；不能归还时按公示价格赔偿。
- 报装结果取决于地址覆盖、施工条件和工作人员最终确认。

### 2.3 加密结论

门户使用“RSA 交换临时 AES 密钥 + AES 加密业务报文”的混合协议：

1. 调用 `/api/keys/v1.0/get` 获取服务端 RSA 公钥。返回值不是保密密文，而是服务端用固定 RSA 私钥签出的数据；页面使用内置公钥的 `decryptPublic` 还原公钥文本。
2. 浏览器生成 16 字符随机 `portalKey`。
3. 使用服务端 RSA 公钥和 PKCS#1 v1.5 加密 `portalKey`，结果放入 `X-DATA-TOKEN`。
4. 请求明文先序列化，再使用 AES-ECB/PKCS7 加密为 Base64，最后执行 URI 编码。
5. 自增序号使用同一个 AES key 加密后放入 `X-REPLAY-VERSION`。
6. 响应使用同一个 AES-ECB/PKCS7 key 解密，再解析 JSON。

历史 HAR 不能独立解开活动响应：HAR 保存了 RSA 加密后的 `X-DATA-TOKEN`，没有保存浏览器当次生成的 `portalKey`，RSA 私钥只在服务端。该限制是密码协议的预期性质，不应通过猜测响应内容绕过。实时请求由本地工具创建并持有 `portalKey` 时，可以正常解密响应。

## 3. 现有项目分析

### 3.1 可直接复用的能力

- 北京移动手机号、图形验证码和短信验证码登录。
- SSO artifact 换取门户 access token。
- CookieJar 会话隔离与本地持久化。
- `XEbtxIBt` 门户防护 token 获取与重定向恢复。
- 门户 RSA 公钥解析、临时 AES key 生成、`X-DATA-TOKEN` 生成。
- AES-ECB/PKCS7 请求加密和响应解密。
- `X-REPLAY-VERSION` 自增与加密。
- 本地限定的加解密调试页。
- 多登录账号切换和业务查询/退订。

### 3.2 当前缺口

- 业务接口路径和 payload 直接写在 `portalClient.js`，没有活动配置模型。
- 只支持查询/退订，不支持资格检查、预检查和订阅流程。
- 调试页的 AES key 被固定解释为 UTF-8，算法、模式、IV、输入输出编码不可配置。
- 现有请求日志会记录本地 API body，身份证、姓名、详细地址等字段需要统一脱敏。
- 没有活动配置校验、模板渲染、订购确认和执行结果审计模型。
- 没有自动化测试覆盖加密管道和活动配置。

## 4. HAR 请求与响应分析

### 4.1 请求顺序

与活动相关的关键顺序为：

```text
活动页面加载
  -> POST /keys/v1.0/get
  -> POST /index1000MYXTC
  -> 页面根据布尔结果进入活动、无资格页或异常页
```

HAR 中共出现三次 `keys/v1.0/get`。它们返回相同的服务端 RSA 公钥，属于页面/拦截器重复初始化，不是三个不同的业务请求。

### 4.2 资格接口

请求：

```text
Method: POST
Path: /nwt/portal-bff/api/ajybz/v1.0/index1000MYXTC
Logical body: {}
Authentication: Authorization: bearer <access_token>
Session: Cookie
Encryption: X-DATA-TOKEN + X-REPLAY-VERSION
WAF: XEbtxIBt query parameter/header
```

抓包响应是一个 Base64 外观的 AES 密文字符串。入口脚本对解密结果使用严格布尔判断：

```js
if (response.data === true) {
  // 可继续活动
} else {
  // 跳转“不满足活动条件”页面
}
```

因此业务数据类型是布尔值，不是字符串 `"true"`。结合门户统一响应拦截器，预期解密后的外层协议为：

```json
{
  "success": true,
  "code": "bizSuccess",
  "message": "",
  "data": true
}
```

其中外层字段来自门户统一协议；本次历史 HAR 无临时 key，无法逐字验证 `message`，实现不依赖该字段。

### 4.3 已有宽带判断

当资格结果为 `true` 时，入口脚本继续调用：

```text
POST /nwt/portal-bff/api/ajybz/v1.0/index
Logical body: {}
```

前端仅关注 `response.data.data === "Y"`。值为 `Y` 表示号码当前已有一条融合宽带（已生效或即将生效），页面会提示用户转到第二条宽带办理入口。该接口不决定中奖资格。

### 4.4 产品预检查

请求：

```text
POST /nwt/portal-bff/api/ajybz/v1.0/checkMobile?itemCode=111602057454
```

逻辑请求体：

```json
{
  "itemCode": "111602057454"
}
```

页面读取的响应字段：

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `code` | string | `success` 表示检查调用成功 |
| `data.message` | string | `Y` 或空表示可继续；其他文本直接展示为不可办原因 |
| `data.isRealName` | string | `Y` 表示号码已完成实名 |
| `data.isBlack` | string | `Y` 表示命中不可办/黑名单条件 |

逻辑分支：

- `message` 存在且不为 `Y`：停止并展示具体原因。
- `isRealName !== "Y"`：要求输入身份证并调用实名匹配接口。
- `isRealName === "Y" && isBlack === "Y"`：停止办理。
- `isRealName === "Y" && isBlack !== "Y"`：允许提交。

### 4.5 实名匹配

请求：

```text
POST /nwt/portal-bff/api/ajybz/v1.0/checkRealName
```

逻辑请求体：

```json
{
  "ID": "<身份证号码>",
  "NAME": "<机主姓名>"
}
```

页面先在本地校验 15/18 位身份证格式、出生日期、省份代码和校验位，再发起请求。响应判断为：

```text
code == "success" AND data.message == "true"
```

注意这里的 `"true"` 是字符串，与资格接口的布尔 `true` 不同。

### 4.6 最终订阅/报装

请求：

```text
POST /nwt/portal-bff/api/ajybz/v1.0/commit1000MYXTC
```

逻辑请求体：

```json
{
  "item_code": "111602057454",
  "address": "朝阳区-示例详细地址",
  "lx_phoneNo": "13800138000",
  "lx_name": "示例姓名",
  "pre_date": "20260720",
  "pre_date_quantum": "3"
}
```

字段定义：

| 字段 | 必填 | 含义 |
| --- | --- | --- |
| `item_code` | 是 | 固定产品档位编码 `111602057454` |
| `address` | 是 | `城区-详细地址`，城区来自北京市 16 区枚举 |
| `lx_phoneNo` | 是 | 联系电话，11 位手机号 |
| `lx_name` | 是 | 联系人/机主姓名 |
| `pre_date` | 否 | 预约日期，格式 `YYYYMMDD` |
| `pre_date_quantum` | 否 | 时间段：`1` 9-11、`2` 11-13、`3` 13-17、`4` 17-20 |

机主姓名和机主手机号来自已登录用户信息，并在原页面中禁用编辑；提交 payload 不重复发送机主手机号，服务端从登录会话获取。

成功条件为返回数据中的 `code === "success"`。提交成功后原页面还会调用公共结果查询接口 `showBLJG` 决定最终结果页；本地工具应将“受理成功”和“最终装机成功”分开表达，不能把接口受理等同于宽带已安装。

## 5. 活动业务说明

### 5.1 办理输入

- 登录号码对应的机主姓名和手机号。
- 北京市城区。
- 详细安装地址。
- 联系电话。
- 可选预约日期和时间段。
- 未实名时需要身份证号码。
- 必须明确同意家庭宽带业务服务协议及活动规则。

### 5.2 地址与预约枚举

城区包括：东城、西城、朝阳、丰台、石景山、海淀、门头沟、房山、通州、顺义、昌平、大兴、怀柔、平谷、密云、延庆。

预约时间段：

| code | 时间 |
| --- | --- |
| `1` | 09:00-11:00 |
| `2` | 11:00-13:00 |
| `3` | 13:00-17:00 |
| `4` | 17:00-20:00 |

### 5.3 风险提示

- 这是会产生真实运营商订单和持续费用义务的操作，UI 必须在最终请求前展示产品、合约期、低消、违约金、地址和联系人摘要并要求确认。
- “接口受理成功”不等于地址覆盖确认或装机成功。
- 身份证、姓名、手机号、地址不得写入普通日志或返回给无关页面。
- 不提供绕过资格、实名、黑名单、短信校验、WAF 或重放保护的能力。

## 6. 配置驱动设计

### 6.1 配置边界

活动配置负责：

- 展示信息和风险提示。
- 产品常量。
- 表单字段和校验规则。
- API 路径、方法、query/body 模板。
- 步骤顺序、条件分支和成功条件。
- 使用哪个传输加密方案。

代码负责：

- 登录会话、Cookie、WAF 和 token 生命周期。
- 白名单域名与路径限制。
- 模板安全渲染和类型保持。
- 加解密算法实现。
- 敏感信息脱敏。
- 最终订阅二次确认、并发控制和审计摘要。

### 6.2 配置示例

```json
{
  "id": "integrated-broadband-1000m",
  "name": "融合宽带1000M优享套餐（三年）",
  "enabled": true,
  "transport": "bmcc-portal-v1",
  "product": {
    "itemCode": "111602057454",
    "contractMonths": 36,
    "monthlyCommitmentYuan": 100,
    "terminationFeeYuan": 200
  },
  "steps": {
    "eligibility": {
      "path": "/portal-bff/api/ajybz/v1.0/index1000MYXTC",
      "body": {},
      "success": { "path": "$", "equals": true }
    },
    "precheck": {
      "path": "/portal-bff/api/ajybz/v1.0/checkMobile",
      "query": { "itemCode": "{{activity.product.itemCode}}" },
      "body": { "itemCode": "{{activity.product.itemCode}}" }
    },
    "realName": {
      "path": "/portal-bff/api/ajybz/v1.0/checkRealName",
      "body": { "ID": "{{input.identityNo}}", "NAME": "{{input.ownerName}}" }
    },
    "commit": {
      "path": "/portal-bff/api/ajybz/v1.0/commit1000MYXTC",
      "body": {
        "item_code": "{{activity.product.itemCode}}",
        "address": "{{input.district}}-{{input.address}}",
        "lx_phoneNo": "{{input.contactPhone}}",
        "lx_name": "{{input.ownerName}}",
        "pre_date": "{{input.appointmentDate}}",
        "pre_date_quantum": "{{input.appointmentSlot}}"
      }
    }
  }
}
```

模板只允许访问 `activity.product`、`input` 和经过脱敏的 `session.userInfo`，不执行 JavaScript 表达式。

### 6.3 本地 API

新增 API：

```text
GET  /api/activities
GET  /api/activities/:id
POST /api/activities/:id/check
POST /api/activities/:id/preview
POST /api/activities/:id/subscribe
POST /api/debug/crypto/transform
```

- `check`：只做资格检查，不产生订单。
- `preview`：校验并返回脱敏后的最终请求摘要，不调用运营商订购接口。
- `subscribe`：再次检查资格和产品状态，必要时实名匹配，最后提交真实订单。
- `crypto/transform`：按显式算法配置做本地加密或解密。

资格检查为提示性检查：结果为不符合资格时，页面仍允许用户主动尝试提交，后端记录本次继续尝试并执行后续产品预检查，由北京移动最终接口决定是否受理。已有融合宽带、黑名单、实名不匹配等明确冲突仍会阻断提交。

### 6.4 幂等与并发

- 同一 session + activity 在订阅执行期间加本地互斥锁，防止双击重复提交。
- 每次订阅要求客户端生成 `confirmationId`；短时间内重复使用相同 ID 返回原结果，不再次提交。
- 后端只记录活动 ID、请求 ID、步骤、耗时和结果码，不记录身份证、姓名、电话、地址和密钥。

## 7. 通用加解密设计

### 7.1 支持范围

第一版支持：

- AES-ECB-PKCS7。
- AES-CBC-PKCS7（必须提供 IV）。
- key/IV 编码：UTF-8、Hex、Base64。
- 明文输入/输出：UTF-8、Hex、Base64。
- 密文输入/输出：Base64、Hex。
- 可选 JSON 序列化/解析和 URI 编码/解码。
- 北京移动 `bmcc-portal-v1` 组合方案。

RSA 在门户方案中仅用于 key exchange；登录 RSA 只支持公钥加密。没有私钥时不提供伪“RSA 解密”。

### 7.2 通用转换请求

```json
{
  "operation": "encrypt",
  "algorithm": "aes",
  "mode": "cbc",
  "padding": "pkcs7",
  "key": "00112233445566778899aabbccddeeff",
  "keyEncoding": "hex",
  "iv": "00000000000000000000000000000000",
  "ivEncoding": "hex",
  "input": "{\"hello\":\"world\"}",
  "inputEncoding": "utf8",
  "outputEncoding": "base64",
  "json": false,
  "uriComponent": false
}
```

后端必须校验 AES key 为 16/24/32 字节、CBC IV 为 16 字节，并限制输入大小。响应不回显 key/IV。

## 8. 安全与日志要求

- 活动接口仅允许配置 `service.bj.10086.cn` 下的相对路径，禁止任意 URL，避免 SSRF。
- 活动配置文件不允许存储 access token、Cookie、身份证、手机号、地址、AES 临时 key 或 RSA 私钥。
- 日志递归脱敏字段：`token`、`cookie`、`authorization`、`key`、`secret`、`code`、`captcha`、`phone`、`mobile`、`idCard`、`identityNo`、`name`、`address`。
- 调试接口默认只允许 localhost；生产环境需要显式环境变量才能开启。
- `portalKey`、`dataToken` 和 CookieJar 只保存在后端会话中，不返回活动页面。
- 配置加载失败时拒绝执行，不使用部分配置或猜测默认值。

## 9. 验收标准

### 9.1 分析与配置

- 可在 UI 查看活动名称、产品编码、合约期、低消、违约金和规则摘要。
- 可读取本地 JSON 活动配置，并对非法路径、缺失步骤和非法模板报错。
- 1000M 活动配置与源页面固定产品编码一致。

### 9.2 业务流程

- 未登录时不能检查或订阅。
- 资格检查不会产生订单。
- 预览不会调用运营商接口。
- 最终订阅必须勾选协议并确认关键业务摘要。
- 实名不匹配、黑名单或已有融合宽带时不会调用 commit；单纯活动资格失败允许继续尝试。
- 成功结果明确显示“受理成功，最终以覆盖核实和装机结果为准”。

### 9.3 加解密

- AES-ECB 和 AES-CBC 有固定向量往返测试。
- 门户 body 加密后可由相同 key 解密为原 JSON。
- key 长度、IV 长度、编码和非法密文均返回明确错误。
- 响应和日志不包含 key。

## 10. 实施顺序

1. 建立活动配置、校验器、模板渲染器和 1000M 活动配置。
2. 将现有门户加密 POST 能力暴露给受控的活动执行器。
3. 实现 check、preview、subscribe 和执行锁。
4. 扩展通用 AES 加解密 API 与调试页面。
5. 增加活动操作页面、二次确认和结果状态。
6. 增加单元测试、构建验证和本地端到端验证。

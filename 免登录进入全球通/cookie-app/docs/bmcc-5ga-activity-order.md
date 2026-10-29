# 北京移动活动订购分析与开发设计

## 1. 目标与范围

本功能把北京移动活动业务的完整办理链路接入 cookie-app 的统一“业务订购”页面：

1. 建立北京移动独立登录会话。
2. 获取图形验证码，发送并校验登录短信验证码。
3. 登录成功后选择服务端活动配置；管理员可新增或编辑配置。
4. 实时查询型配置按 `proType` 查询活动信息；固定参数型配置加载已核验的源码业务信息。
5. 用户核对业务、资费和生效信息后提交真实订购。
6. 如果运营商要求二次短信确认，发送订购验证码、校验验证码并完成二次提交。
7. 展示明确的成功、失败或结果待确认消息。

内置活动包括 `activityName=VPzD4o4vvy` 的 5GA 加速服务，以及 AI豆倍享合约的“到期自动续约”和“到期自动取消”两个档位。执行器同时支持后续活动，但未知活动必须显式提供完整产品参数，不能只根据活动名称猜测资源编码。

## 2. 输入材料与结论

分析材料：

- `5ga加速订购.har`：登录、初始化、订购短信、统一订购和结果查询的真实网络序列。
- `5ga加速订购.zip`：活动页面构建产物，用于恢复明文业务参数和前端分支条件。
- 北京移动 `/nwt/portal/bounsPoints` 页面构建产物：用于确认 AI豆倍享合约的完整业务说明、固定订购参数和两个到期动作码。
- `bj-mobile-business-local`：已经实现的北京移动登录、WAF、防重放、混合加密和统一订购服务。

从活动构建产物恢复的 5GA 配置为：

```json
{
  "activityName": "VPzD4o4vvy",
  "displayName": "5GA 加速服务",
  "proType": "QQTJSFF",
  "packageId": "55412",
  "packageCode": "QQTJSFF",
  "productShowCode": "G_QQTJSFF_0_0",
  "pitemShowCode": "KT"
}
```

其中：

- `activityName` 是活动页面/本地预设的路由标识。
- `proType` 决定活动初始化请求。
- `packageId + packageCode + productShowCode + pitemShowCode` 共同决定真实订购内容。
- `packageId=55412` 会被多个活动复用，不能单独代表 5GA。
- `mtOtherParams` 是活动级扩展参数，5GA 当前为空，其他活动可能必填。

从 AI豆倍享合约源码恢复的共同订购参数为：

```json
{
  "packageId": "2840305334",
  "packageCode": "JFBXHY",
  "productShowCode": "G_JFBXHY",
  "productShowName": "积分倍享合约",
  "productSendUrl": "",
  "pitemShowName": "合约",
  "pitemSendUrl": ""
}
```

“到期自动续约”的 `pitemShowCode` 为 `XY`，“到期自动取消”的 `pitemShowCode` 为 `BXY`。该源码没有调用活动初始化接口，因此两个档位不配置推测性的 `proType`，直接使用已确认的 `productShowCode` 进入统一订购。

## 3. 运营商接口链路

### 3.1 登录

cookie-app 不直接实现北京移动登录协议，而是调用本机 `bj-mobile-business-local`：

```text
POST /api/auth/session
POST /api/auth/prepare
GET  /api/auth/captcha
POST /api/auth/send-sms
POST /api/auth/login
```

图形验证码用于发送登录短信；登录短信验证码为 6 位。登录成功后，BMCC 服务端会话持有门户 Cookie、access token、WAF token 和临时加密上下文。

### 3.2 查询或加载活动

活动配置分为两类：

- 实时查询型：配置 `proType`，调用活动初始化接口并展示完整脱敏响应。
- 固定参数型：不配置 `proType`，但必须配置 `productShowCode`；服务端加载经源码核验的业务内容，提交时直接使用固定参数。

BMCC 本地接口：

```text
POST /api/custom-orders/initialize
```

对应运营商接口：

```text
POST /nwt/portal-bff/api/initMobilePro/v1.0/initMProductCommonData?proType=<proType>
```

页面优先展示 `resultCode`、`productName`、`productCode`、资费和生效信息等常用字段，并提供完整脱敏 JSON。嵌套对象和数组会保留；手机号、Cookie、Token、密钥、身份证明和短信校验 key 在所有层级递归移除。服务端同时限制递归深度、数组长度、字段数和字符串长度，避免超大响应影响页面。固定参数型配置不调用上述初始化接口。

活动初始化是预校验，不是最终订购标准。即使返回“不符合资格”或“已办理”，页面仍允许人工核对后尝试提交，最终是否受理由运营商订购接口决定。

### 3.3 首次提交

BMCC 本地接口：

```text
POST /api/custom-orders/submit
```

运营商统一订购接口：

```text
POST /nwt/portal-bff/api/sjyw/biz/core/v1.0/compositeCommit
```

5GA 请求载荷：

```json
{
  "common": { "operType": "commitProductNew" },
  "body": {
    "content": {
      "packageId": "55412",
      "packageCode": "QQTJSFF",
      "productShowCode": "G_QQTJSFF_0_0",
      "pitemShowCode": "KT"
    }
  }
}
```

首次提交有两种合法结果：

- `accepted`：运营商已受理，不需要额外短信。
- `sms_required`：保存本次 payload 和短信上下文，进入订购短信确认。

### 3.4 订购短信与二次提交

BMCC 本地接口：

```text
POST /api/custom-orders/:orderId/sms/send
POST /api/custom-orders/:orderId/sms/verify
```

对应运营商接口：

```text
GET  /nwt/portal-bff/api/mtsms/v1.0/sendDXSMS
GET  /nwt/portal-bff/api/mtsms/v1.0/sendDXSMSV2
GET  /nwt/portal-bff/api/mtsms/v1.0/checkDxCodeForMT
POST /nwt/portal-bff/api/sjyw/biz/core/v1.0/compositeCommit
POST /nwt/portal-bff/api/pcConsole/v1.0/showBLJG
```

`smsType` 决定 v1 或 v2 发送接口，但当前接口模型没有返回明确的 `codeLength` 字段，不能把 `smsType` 直接等同于 6 位或 8 位。验证码校验成功条件为 `result=00000`。积分倍享合约 `packageCode=JFBXHY` 兼容运营商短信中的 8 位原始验证密码，以及已经按短信要求截取的 6 位校验值。收到 8 位输入时，cookie-app 和 BMCC 执行器都会在提交前按“前 5 位 + 最后 1 位”转换为 6 位校验值。该规则不扩展到其他活动；其他活动及登录验证码仍保持原有 6 位规则。BMCC 服务必须复用首次提交前保存的原 payload 进行第二次 `compositeCommit`，浏览器不能在短信阶段替换产品参数。

当统一订购返回 `resType=showbljg` 时，BMCC 服务继续查询 `showBLJG`。页面把“请求已受理”和“业务已经生效”分开表达，最终生效状态仍以运营商返回和实际业务为准。

### 3.5 验证码长度审计

BMCC 将验证码链路写入 `backend/logs/app.log`，同一次订购使用同一个 `executionId` 串联。日志只记录业务与协议元数据，不记录验证码、归一化后的验证码、产品校验 key、Cookie 或 Token 原文。

| 事件 | 对比字段 | 用途 |
| --- | --- | --- |
| `customOrder:sms-context` | 活动/商品编码、`smsType`、`smsTypeSource`、发送接口、已知输入规则 | 确认短信要求来自哪次 `compositeCommit` 响应及选用了哪个发送分支 |
| `customOrder:sms-send` | `smsType`、接口路径、查询加密模式、业务码、成功状态 | 确认实际调用 `sendDXSMS` 还是 `sendDXSMSV2` |
| `customOrder:sms-verify-input` | 输入长度、归一化长度、转换规则 | 区分直接 6 位、8 位按“前 5 位 + 最后 1 位”转换及不支持的输入 |
| `customOrder:sms-verify-result` | 校验请求状态、门户结果码、业务码 | 确认运营商是否接受转换后的校验值 |

完成两种业务各一次订购后，先按 `executionId` 分组，再对比 `packageCode`、`productShowCode`、`pitemShowCode`、`smsType`、`smsSendPath` 和 `transformRule`。只有对照数据能够证明稳定关联时，才能把新的 8 位规则扩展到其他活动。

## 4. 加密与密钥边界

北京移动门户使用动态 WAF 参数与混合加密：

1. 浏览器防护脚本生成 `XEbtxIBt`。
2. 登录会话生成 16 字节随机 AES key。
3. AES key 使用运营商 RSA 公钥加密后放入 `X-DATA-TOKEN`。
4. 请求体、GET 参数、响应及 `X-REPLAY-VERSION` 使用 AES-ECB/PKCS7 加解密。
5. 每个实时会话的 AES key 只保存在 BMCC 本地服务端会话中。

HAR 可以保存 AES 密文、RSA 加密后的 `X-DATA-TOKEN` 和防重放值，但不包含 RSA 私钥，也不包含浏览器生成的 AES 明文 key。因此不能从历史 HAR 单独恢复随机 AES key。正确方式是复用实时 BMCC 会话完成密钥交换和加解密，cookie-app 不复制密钥，也不把密钥暴露给前端。

## 5. cookie-app 架构

```text
React 业务订购页
  -> cookie-app /api/bmcc-activity-order
      -> 权限、账号归属、会话所有权、冷却和二次确认
      -> bj-mobile-business-local http://127.0.0.1:8788/api
          -> 北京移动登录/WAF/AES/RSA/统一订购
              -> service.bj.10086.cn
```

本地服务地址：

```bash
BMCC_LOCAL_API_URL=http://127.0.0.1:8788/api/
```

该变量可省略，以上地址是默认值。部署时必须先启动 `bj-mobile-business-local`，并保证 cookie-app 后端能访问它；浏览器不应直接访问 8788 服务。

## 6. cookie-app API

```text
GET    /api/bmcc-activity-order/presets
POST   /api/bmcc-activity-order/configs
PUT    /api/bmcc-activity-order/configs/:id
POST   /api/bmcc-activity-order/sessions
POST   /api/bmcc-activity-order/sessions/restore
GET    /api/bmcc-activity-order/sessions/:id
POST   /api/bmcc-activity-order/sessions/:id/captcha
POST   /api/bmcc-activity-order/sessions/:id/login-sms
POST   /api/bmcc-activity-order/sessions/:id/login
PUT    /api/bmcc-activity-order/sessions/:id/order-config
POST   /api/bmcc-activity-order/sessions/:id/activity
POST   /api/bmcc-activity-order/sessions/:id/submit
POST   /api/bmcc-activity-order/sessions/:id/order-sms
POST   /api/bmcc-activity-order/sessions/:id/confirm
DELETE /api/bmcc-activity-order/sessions/:id
```

创建登录会话时不绑定活动：

```json
{
  "accountId": "<cookie-app account id>"
}
```

登录成功后选择配置并查询：

```json
{
  "configId": "builtin:VPzD4o4vvy"
}
```

管理员新增未知活动配置时必须提供：

```json
{
  "activityName": "<activity route name>",
  "displayName": "<display name>",
  "proType": "<实时查询型填写；固定参数型留空>",
  "packageId": "<campaign id>",
  "packageCode": "<campaign code>",
  "productShowCode": "<固定参数型必填；实时查询可返回时允许省略>",
  "productShowName": "<resource name, optional>",
  "productSendUrl": "<upstream payload field, optional>",
  "pitemShowCode": "KT",
  "pitemShowName": "<action name, optional>",
  "pitemSendUrl": "<upstream payload field, optional>",
  "mtOtherParams": "<activity extension, optional>"
}
```

活动配置保存在 PostgreSQL 的 `BmccActivityOrderConfig` 表中。表由服务端按需创建，不依赖修改现有 Prisma schema；`proType` 可空以支持固定参数型活动，旧表会在首次读取配置时自动放宽该字段。内置配置使用 `builtin:` ID 且只读；自定义配置使用 UUID，可由管理员编辑。

不支持由客户端传入目标域名、接口路径、Cookie、Token、AES key、RSA key 或跳过短信校验的参数。

## 7. 状态机与交互

```text
选择账号
  -> captcha_ready
  -> login_sms_sent
  -> logged_in
  -> 选择活动配置并查询
  -> activity_ready
      -> finished
      -> order_sms_required
          -> finished
```

- 本地会话有效期 30 分钟，每次有效操作续期。
- 登录成功后，cookie-app 会按账号保存加密登录缓存；再次从同一账号进入时先在线验证缓存，有效则直接进入活动配置，无缓存时不提示，失效时才提示重新登录。
- 登录短信和订购短信分别有 60 秒页面/服务端冷却。
- 提交前必须勾选真实订购确认并输入“确认订购”。
- 同一会话的订购提交使用互斥标记，避免重复点击。
- 提交后发生本地连接超时或中断时返回 `RESULT_UNCERTAIN`，页面要求先通过官方渠道查询，不允许在原会话中直接重试。
- 成功、失败、验证码发送和结果待确认均使用统一 `MessageDialog` 展示。
- 页面保留已经加载的活动信息；普通错误不会清空当前会话。
- 进入订购短信阶段后可以查看并编辑订购验证码和完整请求配置。请求配置发生变化时，服务端先丢弃旧订单及短信上下文；实时查询型活动回到重新查询，固定参数型活动回到重新核对，均需再次提交订购。

## 8. 权限与数据安全

- 复用现有 `businessOrder` 权限，不新增旁路权限；预设读取、会话创建和每一步操作都执行相同权限校验。
- 公共用户必须登录，且只能为自己关联的账号创建和操作会话。
- public 页面携带 `accountId` 进入时，前端账号列表严格收敛为该账号；账号不存在或无权访问时直接阻止进入，不会回退显示其他号码。
- 管理员可以选择已有账号，也可手动输入手机号。
- 每个 cookie-app 会话绑定 owner；普通用户不能读取或推进其他用户的会话。
- 普通用户可以查看和选择活动配置，但不能新增或编辑全局配置；只有管理员可以管理配置。
- 前端只得到脱敏手机号和完整递归脱敏后的活动信息。
- BMCC remote session ID、Cookie、access token、WAF token、AES key、短信产品 key 和完整运营商响应均留在后端。
- BMCC 本地服务把完整登录材料持久化到自己的会话存储中，有效期为 1 小时。cookie-app 的独立凭证库只保存加密后的远端 session ID 映射和手机号 SHA-256 摘要，不保存明文手机号、Cookie、Token 或门户密钥。
- 每次复用缓存前都调用 BMCC 在线校验接口，并核对当前办理手机号；缓存失效、账号手机号变化或缓存解密失败时立即清除映射。离开页面和重新开始只释放 cookie-app 的本地流程会话，不删除仍可复用的远端登录态。

## 9. 后续活动接入标准

新增活动前必须从该活动的可信请求示例或源码确认以下字段：

| 字段 | 必需 | 用途 |
| --- | --- | --- |
| `activityName` | 是 | 活动路由和本地预设标识 |
| `displayName` | 是 | 页面核对名称 |
| `proType` | 视活动 | 实时查询型必填；固定参数型留空 |
| `packageId` | 是 | 活动策划 ID |
| `packageCode` | 是 | 活动策划编码 |
| `packageName` | 否 | 活动策划名称 |
| `productShowCode` | 视活动 | 固定参数型必填；实时初始化可返回时允许省略 |
| `productShowName` | 否 | 资源显示名称 |
| `productSendUrl` | 否 | 运营商订购 payload 原字段；本系统不会请求该地址 |
| `pitemShowCode` | 是 | 办理动作，常见为 `KT` |
| `pitemShowName` | 否 | 办理动作显示名称 |
| `pitemSendUrl` | 否 | 运营商订购 payload 原字段；本系统不会请求该地址 |
| `mtOtherParams` | 视活动 | 档位、资费或其他活动扩展参数 |
| `activityUrl` | 否 | 仅用于追溯来源；只接受 `service.bj.10086.cn` HTTPS 地址且不会被后端主动访问 |

确认参数后，管理员可直接在页面新增并保存，无需发版。若要设为不可编辑的系统内置配置，再将可信固定配置加入 `BMCC_ACTIVITY_PRESETS`。

AI豆倍享合约已内置以下两个只读配置：

```json
{
  "activityName": "bounsPoints_XY",
  "displayName": "AI豆倍享合约（到期自动续约）",
  "packageId": "2840305334",
  "packageCode": "JFBXHY",
  "productShowCode": "G_JFBXHY",
  "productShowName": "积分倍享合约",
  "pitemShowCode": "XY",
  "pitemShowName": "合约",
  "activityUrl": "https://service.bj.10086.cn/nwt/portal/bounsPoints"
}
```

第二个配置的 `activityName` 为 `bounsPoints_BXY`，显示名称为“AI豆倍享合约（到期自动取消）”，`pitemShowCode` 为 `BXY`，其他订购字段相同。官方页面当前会跳转错误页并提示业务已下线；页面会明确展示风险，但按产品要求仍开放真实订购尝试，最终结果以运营商接口返回为准。

## 10. 验收标准

- 统一业务订购页可选择“5GA 加速”，管理员页和公共用户账号入口共用该入口。
- 没有 `businessOrder` 权限时，公共用户无法获取预设、创建会话或操作已有会话。
- `VPzD4o4vvy` 自动使用已还原的 5GA 参数。
- AI豆倍享合约可选择到期自动续约 `XY` 或到期自动取消 `BXY`，且不会调用没有源码依据的初始化类型。
- 页面初始只显示账号登录，活动配置仅在登录成功后出现。
- 同一账号已有有效北京移动登录缓存时无需重复验证码登录；缓存失效时才显示重新登录提示。
- public 账号入口只能看到跳转账号所属手机号，不能切换到该用户的其他号码。
- 所有业务订购账号选择器支持输入搜索和键盘选择。
- 管理员新增、编辑的活动配置刷新后仍然存在，普通用户只能使用不能修改。
- 未知活动缺少产品参数时在调用运营商前失败。
- 图形验证码、登录短信、活动查询、首次提交、订购短信和最终确认按状态顺序执行。
- 活动查询失败不会清空已登录会话。
- 所有接口业务消息以消息组件显示，手机号保持脱敏。
- 订购短信阶段可在可拖拽弹窗中查看、显示/隐藏并编辑验证码和订购请求参数；修改参数后旧验证码上下文必须失效。
- 网络中断后的未知订购结果不会被标为成功，也不会自动重复提交。
- 类型检查、API/UI 单元测试和生产构建通过。

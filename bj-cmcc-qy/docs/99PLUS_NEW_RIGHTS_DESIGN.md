# 99plus（新）权益领取开发设计文档

## 1. 背景与目标

`99plus 权益领取` 是北京移动面向已开通 99 会员用户的权益领取入口，包含：

- 199G 流量包或 399 语音年包等通用权益。
- 年度权益与月度权益。
- 99plus（新）会员专属权益。
- 可选折扣/优惠券权益。

现有 `北京移动权益一条龙` 项目已经具备登录、权益查询、券查询、兑换、订单与券码查询能力。新增目标是在现有工作台中增加 `99plus（新）` 业务入口，让用户登录后快速查看自己可领取的 99plus 权益，并完成领取/订购操作。

## 2. 源码分析结论

### 2.1 现有项目结构

主工程：`/Users/ZevinGunn/CMCC-PROJECT/bj-cmcc-qy`

- `backend/src/bmccClient.js`：统一调用 `https://xcxp.bj.10086.cn/rights-intf/api/outer/invoke.do`，负责 AES-CBC 加密、签名排序、`sessKey` 透传和响应解析。
- `backend/src/services`：已有登录、权益、券、兑换、订单、福袋权益服务。
- `backend/src/routes`：按业务暴露 `/api/auth`、`/api/rights`、`/api/exchange`、`/api/fortune` 等接口。
- `frontend/src/api.js`：前端接口封装。
- `frontend/src/App.vue`：单页权益工作台，当前已有全部权益、Plus 福袋、订单等操作流。

99plus 来源资产：`/Users/ZevinGunn/CMCC-PROJECT/99plus权益领取`

关键文件：

- `xcxp.bj.10086.cn/rights-front/dist/7856.async.js`：99plus2 主要接口封装和会员配置。
- `xcxp.bj.10086.cn/rights-front/dist/src__pages__99plus2__index__index.async.js`：99plus2 首页、开通、领取弹窗和提交逻辑。
- `xcxp.bj.10086.cn/rights-front/dist/src__pages__99plus2__product__index.async.js`：权益详情页、价格、验证码、权益领取提交逻辑。

### 2.2 会员档位配置

来源文件中包含 3 个 99Plus（新）会员档位：

| 档位 | offerId | 说明 |
| --- | --- | --- |
| 99Plus-畅享版（新） | `111004275825` | member99Plus2Level 对应高档位之一 |
| 99Plus-优享版（新） | `111004275824` | member99Plus2Level 对应中档位之一 |
| 99Plus-尊享版（新） | `111004275823` | member99Plus2Level 对应高档位之一 |

原页面根据 `userInfo.member99Plus2Level`、`userInfo.starValue`、`userInfo.isThreePointFiveStar` 推导当前展示档位。项目落地时建议后端返回原始用户信息，前端只做展示；实际是否可开通/可领取以接口返回为准。

## 3. 99plus（新）核心接口

所有接口均通过现有 `BmccClient.invoke(abilityCode, body)` 调用 `/rights-intf/api/outer/invoke.do`。

### 3.1 年度/月度核心权益查询

接口：

```txt
abilityCode: rights_qry_new99plus
```

请求体：

```json
{ "belongAreas": ["99PLUS2_CORE_MO"] }
```

或：

```json
{ "belongAreas": ["99PLUS2_CORE_YR"] }
```

用途：

- `99PLUS2_CORE_MO`：查询月度权益。
- `99PLUS2_CORE_YR`：查询年度权益。
- 返回列表中的 `groupOrderTimes > 0` 表示该权益分组已经领取/订购过。

标准化字段：

- `legalRightsNbr`：权益编码，后续领取使用。
- `legalRightsId`：权益 ID。
- `legalRightsName` / `legalRightsDesc`：权益名称/描述。
- `legalRightsAttrs`：包含 `offerId`、`vipPrice`、图片、规则说明等扩展属性。
- `groupOrderTimes`：领取次数或订购次数。
- `belongAreas`：用于判断权益归属。

### 3.2 年/月领取方式查询

接口：

```txt
abilityCode: PLUS99_CLAIM_METHOD_QUERY
```

请求体：

```json
{}
```

返回：

- `"yearly"`：用户应领取年度权益。
- `"monthly"`：用户应领取月度权益。
- `"none"` 或空：无指定领取方式。

页面逻辑：

- 同时查询月度、年度权益。
- 若 `claimMethod === "yearly"`，并且年度权益存在 `groupOrderTimes > 0`，则认为已领取。
- 若 `claimMethod === "monthly"`，并且月度权益存在 `groupOrderTimes > 0`，则认为已领取。

### 3.3 通用权益查询（199G/399 入口）

接口：

```txt
abilityCode: rights_qry_new99plus
```

请求体：

```json
{ "belongAreas": ["99PLUS2_COMM"] }
```

来源页面逻辑：

- 该区域正常应返回 2 个权益。
- 其中一个权益的 `_feAttrOfferId` 为 `111602054897`、`111602056029` 或 `111602056803`。
- 另一个权益的 `_feAttrOfferId` 为 `111602054898`。
- 任一权益 `groupOrderTimes > 0` 时认为通用权益已领取。

业务文案上可展示为：

- `199G 流量包`
- `399 语音年包`

实际名称以接口返回 `legalRightsName` 为准，避免接口侧调整后前端写死过期。

### 3.4 折扣权益查询

接口：

```txt
abilityCode: PLUS99_AREA_RIGHTS_QRY
```

请求体：

```json
{
  "notInBelongAreas": [],
  "belongAreas": ["99PLUS2_DISCOUNT"]
}
```

用途：

- 查询 99plus（新）折扣/优惠权益。
- 详情页中若权益属于 `99PLUS2_DISCOUNT`，领取时会携带 `discount` 参数。

### 3.5 专属权益查询

接口：

```txt
abilityCode: PLUS99_SPEC_AREA_QRY
```

请求体：

```json
{
  "operateCode": "99PLUS2_EXCL",
  "memberType": "99PLUS_NEW"
}
```

用途：

- 查询 99plus（新）专属权益。
- 原页面领取专属权益使用 `PLUS99_CARD_ACT_OPEN`。

### 3.6 活动与折扣信息查询

接口：

```txt
abilityCode: NINETY_NINE_PLUS_GET_INFO
```

请求体：

```json
{ "activeId": 10008 }
```

用途：

- 查询 99plus 活动信息、折扣码、有效期等。
- 原页面对非本网用户特殊处理：`resultMsg === "您不是本网用户,暂不能办理此业务!"`。

### 3.7 权益详情查询

接口：

```txt
abilityCode: RIGHTS_DETAIL_QRY_H5
```

请求体建议：

```json
{ "legalRightsNbr": "权益编码" }
```

用途：

- 查询权益详情页信息。
- 可用于前端展示规则、生效说明、价格、图片和领取确认信息。

### 3.8 权益领取/订购

接口：

```txt
abilityCode: open_rights_new99plus
```

基础请求体：

```json
{
  "legalRightsCode": "权益编码"
}
```

可选请求体：

```json
{
  "legalRightsCode": "权益编码",
  "verifyCode": "短信验证码",
  "discount": 100,
  "wtAc": "触点渠道参数",
  "wtAcId": "触点渠道 ID",
  "platform": 1
}
```

说明：

- `legalRightsCode` 对应 `legalRightsNbr`。
- 当短信校验组件要求验证码时传 `verifyCode`。
- 折扣权益传 `discount`，默认可使用 `100`。
- 原页面在 App 环境会补 `platform = 1`。
- 原页面会尝试补充 `wtAc`、`wtAcId`，当前一条龙项目可以第一阶段不接入，后续如接口强依赖再补。

成功判断：

```txt
resultCode === "0"
```

常见失败：

- `-1002`：验证码校验失败。
- `resultMsg` 包含 `在途订单`：已有处理中订单。
- `resultMsg` 包含 `预付费校验，后付费不校验检查不通过`：用户资费/付费类型不满足。
- `99plus新客户订单提交频率过快,请重试`：提交频率限制。
- 其他失败统一提示接口返回文案。

### 3.9 专属权益领取

接口：

```txt
abilityCode: PLUS99_CARD_ACT_OPEN
```

请求体：

```json
{
  "discountType": "接口返回",
  "batchId": "接口返回",
  "actId": "接口返回",
  "memberType": "99PLUS_NEW"
}
```

说明：

- 用于 `PLUS99_SPEC_AREA_QRY` 返回的专属权益领取。
- 成功后刷新专属权益列表。

### 3.10 99plus 会员开通

原页面开通会员不是权益领取，而是 offer 订购流程：

```json
{ "offerId": "111004275825", "verifyCode": "可选" }
```

来源代码中调用的是公共订购方法，不在 `7856.async.js` 内直接暴露 abilityCode。现有工程已有 `OPEN_TEL_AUTH_LIMIT_MORE` 等订购能力，但 99plus 新会员开通需要单独验证线上接口。建议第一阶段把入口做成“检测未开通时展示开通按钮，但默认不自动订购”，待抓包确认开通接口后再接入真实办理。

## 4. 后端设计

新增文件：

```txt
backend/src/services/plus99NewService.js
backend/src/routes/plus99New.js
```

新增路由挂载：

```txt
app.use("/api/plus99-new", plus99NewRouter)
```

建议接口：

| 本地接口 | 方法 | 作用 |
| --- | --- | --- |
| `/api/plus99-new/summary` | GET | 聚合会员状态、年/月权益、通用权益、折扣权益、专属权益 |
| `/api/plus99-new/core` | GET | 单独查询年/月权益与领取方式 |
| `/api/plus99-new/common` | GET | 查询 199G/399 通用权益 |
| `/api/plus99-new/discount` | GET | 查询折扣权益 |
| `/api/plus99-new/exclusive` | GET | 查询专属权益 |
| `/api/plus99-new/detail/:legalRightsNbr` | GET | 查询权益详情 |
| `/api/plus99-new/claim` | POST | 领取核心/通用/折扣权益 |
| `/api/plus99-new/exclusive/claim` | POST | 领取专属权益 |

### 4.1 summary 返回结构

```json
{
  "member": {
    "level": 0,
    "starValue": 0,
    "isThreePointFiveStar": false,
    "displayPlan": null,
    "rawUser": {}
  },
  "claimMethod": "monthly",
  "hasClaimed": false,
  "core": {
    "monthly": { "canUse": 1, "list": [] },
    "yearly": { "canUse": 1, "list": [] }
  },
  "common": {
    "hasClaimed": false,
    "list": []
  },
  "discount": {
    "activity": null,
    "list": []
  },
  "exclusive": {
    "list": []
  }
}
```

### 4.2 标准化权益对象

沿用 `rightsCatalog.normalizeRight`，并补充 99plus 字段：

```json
{
  "legalRightsId": "",
  "legalRightsNbr": "",
  "legalRightsName": "",
  "legalRightsDesc": "",
  "offerId": "",
  "belongAreas": [],
  "groupOrderTimes": 0,
  "price": "",
  "vipPrice": "",
  "discountPrice": "",
  "img": "",
  "effExplain": "",
  "orderExplain": "",
  "claimType": "monthly|yearly|common|discount|exclusive",
  "claimed": false,
  "raw": {}
}
```

### 4.3 后端领取保护

所有真实提交接口必须保留二次确认：

```json
{ "confirmed": true }
```

`/api/plus99-new/claim` 校验：

- 必须登录。
- 必须传 `legalRightsNbr` 或 `legalRightsCode`。
- 必须 `confirmed === true`。
- 可选 `verifyCode`、`discount`。
- 后端统一转换为 `open_rights_new99plus` 请求体。

`/api/plus99-new/exclusive/claim` 校验：

- 必须登录。
- 必须 `confirmed === true`。
- 必须传 `discountType`、`batchId`、`actId`。
- 固定补 `memberType: "99PLUS_NEW"`。

## 5. 前端设计

### 5.1 信息架构

在现有顶部 tab 增加：

```txt
99plus（新）
```

页面区域：

- 会员状态区：展示当前登录手机号、99plus 档位、是否已领取。
- 年度/月度权益区：根据 `claimMethod` 优先展示可领取类型，另一类收起或次级展示。
- 199G/399 通用权益区：展示两个通用权益，显示已领取状态。
- 专属权益区：展示 `PLUS99_SPEC_AREA_QRY` 返回权益。
- 折扣权益区：展示折扣权益与可用优惠。
- 操作结果区：展示最近一次领取结果，成功后刷新对应列表。

### 5.2 操作流

1. 用户登录。
2. 点击 `99plus（新）` tab。
3. 前端调用 `/api/plus99-new/summary`。
4. 页面展示：
   - 年/月可领状态。
   - 199G/399 通用权益。
   - 专属权益和折扣权益。
5. 用户点击领取。
6. 前端弹出确认，必要时输入验证码。
7. 调用后端领取接口，带 `confirmed: true`。
8. 成功后刷新 summary。

### 5.3 验证码处理

现有工程已有 `sendExchangeSms` 和部分订购接口验证码支持，但 99plus 原页面使用统一短信组件，可能会按 `offerId` 或 `legalRightsNbr` 触发校验。第一阶段建议：

- 默认先无验证码提交。
- 若接口返回 `-1002` 或明确验证码失败，前端显示验证码输入框。
- 如后续确认短信发送接口，增加 `POST /api/plus99-new/sms/send`。

## 6. 详细权益领取流程

### 6.1 年度/月度权益领取

接口链：

1. `rights_qry_new99plus` 查询 `99PLUS2_CORE_MO`。
2. `rights_qry_new99plus` 查询 `99PLUS2_CORE_YR`。
3. `PLUS99_CLAIM_METHOD_QUERY` 判断用户应领年包还是月包。
4. 用户选择权益后调用 `open_rights_new99plus`。

领取请求：

```json
{
  "legalRightsCode": "选中权益 legalRightsNbr",
  "verifyCode": "可选"
}
```

领取后刷新：

- `core`
- `summary`
- 用户信息 `GET_USER_INFO`，用于更新会员/领取状态。

### 6.2 199G/399 通用权益领取

接口链：

1. `rights_qry_new99plus` 查询 `99PLUS2_COMM`。
2. 按接口返回展示 199G/399 选项。
3. 用户选择后调用 `open_rights_new99plus`。

领取请求：

```json
{
  "legalRightsCode": "选中权益 legalRightsNbr",
  "verifyCode": "可选"
}
```

领取后刷新：

- `common`
- `summary`

### 6.3 折扣权益领取

接口链：

1. `PLUS99_AREA_RIGHTS_QRY` 查询 `99PLUS2_DISCOUNT`。
2. `NINETY_NINE_PLUS_GET_INFO` 查询活动/折扣状态。
3. 用户确认后调用 `open_rights_new99plus`。

领取请求：

```json
{
  "legalRightsCode": "选中权益 legalRightsNbr",
  "discount": 100,
  "verifyCode": "可选"
}
```

### 6.4 专属权益领取

接口链：

1. `PLUS99_SPEC_AREA_QRY` 查询 `operateCode=99PLUS2_EXCL`、`memberType=99PLUS_NEW`。
2. 用户点击专属权益。
3. 调用 `PLUS99_CARD_ACT_OPEN`。

领取请求：

```json
{
  "discountType": "选中权益 discountType",
  "batchId": "选中权益 batchId",
  "actId": "选中权益 actId",
  "memberType": "99PLUS_NEW"
}
```

领取后刷新：

- `exclusive`
- `summary`

## 7. 开发步骤

### 阶段一：后端能力

1. 新增 `plus99NewService.js`。
2. 实现：
   - `queryCoreRights`
   - `queryClaimMethod`
   - `queryCommonRights`
   - `queryDiscountRights`
   - `queryExclusiveRights`
   - `queryActivityInfo`
   - `queryRightDetail`
   - `claimRight`
   - `claimExclusiveRight`
   - `querySummary`
3. 新增 `routes/plus99New.js`。
4. 在 `server.js` 挂载 `/api/plus99-new`。
5. 对提交类接口加入 `confirmed=true` 校验。

### 阶段二：前端入口

1. `frontend/src/api.js` 增加 plus99New endpoints。
2. `frontend/src/App.vue` 增加 `99plus（新）` tab。
3. 新增状态：
   - `plus99Summary`
   - `plus99Loading`
   - `plus99Claiming`
   - `plus99SelectedRight`
   - `plus99VerifyCode`
4. 增加领取确认弹窗。
5. 成功后刷新 summary。

### 阶段三：体验与安全

1. 已领取权益置灰，保留“已领取”标识。
2. 未登录、非本网用户、非 99plus 用户给出明确提示。
3. 真实提交前二次确认。
4. 对频率限制、在途订单、验证码错误做专门提示。
5. 保留原始响应折叠查看，便于调试接口侧变更。

## 8. 测试计划

后端：

- `GET /api/plus99-new/summary` 能返回聚合结构。
- 年/月权益为空、接口失败、非本网用户时不崩溃。
- `POST /api/plus99-new/claim` 缺少 `confirmed=true` 时拒绝。
- `POST /api/plus99-new/claim` 缺少权益编码时拒绝。
- `POST /api/plus99-new/exclusive/claim` 缺少三要素时拒绝。

前端：

- 未登录时切换 tab 仍提示登录。
- 登录后可以加载 99plus summary。
- 已领取权益不可重复点击或点击后明确提示。
- 领取失败展示接口文案。
- 领取成功刷新状态。

人工联调：

- 使用真实 99plus 用户验证 `summary`。
- 使用已领取用户验证 `groupOrderTimes` 状态。
- 使用未领取用户小心验证一次领取。
- 专属权益领取单独验证，避免和核心权益混淆。

## 9. 风险与待确认项

1. 99plus 会员开通接口未在当前抓包中完整确认，第一阶段建议只做权益领取，不自动开通会员。
2. 验证码发送接口需进一步抓包确认；第一阶段可先支持验证码输入，不主动发送。
3. `199G/399` 的前端展示名称建议以接口返回为准，避免写死后接口调整。
4. `wtAc/wtAcId/platform` 来源于原页面环境，一条龙本地环境可能没有；如接口强校验，需要补充触点参数获取逻辑。
5. 所有领取接口会真实办理业务，必须保留二次确认和明确按钮文案。

## 10. 建议确认范围

请确认以下产品范围后再开始开发：

- 是否第一阶段只接入“已开通 99plus 用户领取权益”，暂不提供会员开通。
- `199G 流量包 / 399 语音年包` 是否按接口返回名称展示，还是需要固定中文标题。
- 专属权益是否与核心权益放在同一个 tab 下，还是单独分组。
- 领取成功后是否需要自动跳转订单列表，或仅刷新当前页。

## 11. 最新调整方案

### 11.1 入口隔离

99plus（新）权益兑换入口不展示在北京移动权益一条龙主页面。用户必须先登录，然后手动访问：

```txt
/?page=plus99-new
```

主页面不放入口按钮，不影响原有 Plus 券兑换、购物车、订单查询和通用权益订购。

### 11.2 接口分流

99plus 权益兑换页必须区分三类接口：

| 类型 | 使用接口 | 入参特征 |
| --- | --- | --- |
| 北京移动 Plus 券兑换 | `COUPON_OPEN_TEL_FEE_AUTH` | `offerId/rightCode/rightId/certificateId/certificateNum/checkSwitch` |
| 99plus 普通权益兑换 | `open_rights_new99plus` | `legalRightsCode/verifyCode/discount` |
| 99plus 专属权益领取 | `PLUS99_CARD_ACT_OPEN` | `discountType/batchId/actId/memberType=99PLUS_NEW` |

`open_rights_new99plus` 不能复用一条龙 Plus 券兑换入参，否则 `certificateId/certificateNum/rightId` 等字段会污染 99plus 接口。

### 11.3 验证码接口

源码验证码组件 `OrderValidator` 的 99plus 权益详情页调用参数为：

```json
{
  "rightsCode": "legalRightsNbr",
  "discount": 100,
  "activeId": 10008
}
```

对应接口：

```txt
BIZ_NEED_CONFIRM_SMS_QRY
BIZ_CONFIRM_SMS_SEND
```

因此本地新增：

```txt
POST /api/plus99-new/sms/need
POST /api/plus99-new/sms/send
```

这两个接口只服务 99plus 页面，不复用 `/api/exchange/sms/send` 的 `offerId` 发送逻辑。

### 11.4 流量年包和语音年包例外

`99PLUS2_COMM` 下的 199G 流量年包和 399 分钟语音年包仍保留在 99plus 页面中，但作为通用包入口单独展示：

- 不因为其中一个已领取而禁用另一个。
- 不走 Plus 券兑换接口。
- 默认仍按 99plus 订购接口 `open_rights_new99plus` 提交 `legalRightsCode`。
- 如后续抓包确认这两个包需要特殊 activity/offer 接口，再在 `claimType === "common"` 下增加专门分支。

### 11.5 当前落地改动

- 移除一条龙页面显式 `99plus（新）`按钮。
- 保留 `/?page=plus99-new` 隐式路由。
- 新增 99plus 短信发送接口和前端“发送验证码”按钮。
- 保持 99plus 提交入参与 Plus 券兑换入参完全隔离。

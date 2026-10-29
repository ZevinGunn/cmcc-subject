# 幸运三日签活动接口与实现说明

## 1. 文档范围与证据

本文档用于 `cookie-app` 的“幸运三日签”功能，覆盖爱购商城登录凭证、累计签到、每日秒杀资格、短信验证码和确认领取。

分析依据：

- `幸运三日签.har`：实录活动列表和签到状态查询。
- `三日签奖励领取.har`：实录商品详情、会员省份、评价和资格查询。
- `幸运三日签.zip`：页面资源和 `Rights-AccumulatedSignComp 1.1.5` 组件源码。
- `三日签奖品领取.zip`：商品详情资源、`Rights-SeckillComposeComp 1.4.7` 和公共下单组件源码。

证据层级：

- “HAR 实录”表示请求和响应在样例中实际出现。
- “源码确认”表示页面代码明确构造了该请求，但 HAR 没有录到真实调用响应。
- “待联调”表示受上游风控或动态配置影响，不能仅根据静态样例证明生产环境一定受理。

## 2. 活动基本信息

| 字段 | 值 | 用途 |
| --- | --- | --- |
| 活动页 | `/coc3/canvas/rightsmarket-h5-canvas/online/26xysrqtybld` | 官方 H5 页面路由 |
| `activityId` | `17453` | 活动、资格、短信和下单的主活动 ID |
| `taskId` | `2999` | 累计签到任务 ID |
| `channelCode` | `P00000132544` | 活动归属渠道，同时作为 `selfChannelCode` |
| 活动组件 | `Rights-SeckillComposeComp` | 本页实际使用的旧版秒杀组件 |
| 活动时间 | 2026-07-22 00:00:00 至 2026-09-30 23:59:59 | HAR 响应中的活动总周期 |

活动规则由 `getProByActId.data.description` 返回：用户从首次参与的次日起，每日获得 1 次限量秒杀资格；66 元、88 元、100 元话费兑换券在整个活动周期内合计最多获得 1 次。

批次 ID、SKU ID、MID、每日开始时间和库存均是动态数据。HAR 中的 `37747`、`84631` 等只是 2026-08-04 的样例，不得作为下单常量。

## 3. 登录凭证流程

```text
选择 cookie-app 账号
  -> 读取已缓存的 AigouSession
  -> 调用 codeEncryptPhone 验活
  -> 验活成功：复用 Cookie + phone Token
  -> 验活失败：检查/恢复当前 10086 CK
  -> 10086 CK 生成爱购 SSO ticket
  -> userLoginV2 置换新 Token、refreshToken 和 Cookie
  -> 再次验活后加密保存到账号
  -> 请求三日签接口
```

共通请求头：

| 请求头 | 作用 |
| --- | --- |
| `Cookie` | 爱购商城会话 Cookie，每次响应的 `Set-Cookie` 会合并回账号凭证 |
| `phone` | SSO 置换后的爱购用户 Token，不是明文手机号 |
| `Origin` | POST 请求使用 `https://dev.coc.10086.cn` |
| `Referer` | 三日签官方活动页和活动渠道 |

任一上游返回 `resultCode=-516` 或“用户未登录/登录已失效”时，`cookie-app` 会强制忽略旧爱购凭证，用当前有效 10086 CK 重新置换并且最多重试 1 次。该逻辑解决长时间停留后爱购子会话失效、但 10086 CK 仍有效的情况。

## 4. 签到接口

### 4.1 查询签到状态（HAR 实录）

```http
POST /coc3/coc3-market-activity/cmpp-manage/task/getTaskSignInfo
Content-Type: application/json;charset=UTF-8

{"taskId":2999}
```

响应字段：

| 字段 | 含义 | 前端用途 |
| --- | --- | --- |
| `resultCode` | `0` 表示查询成功，`-516` 表示登录失效 | 决定展示状态还是重换凭证 |
| `msg` | 上游结果文案 | 失败时展示 |
| `data.taskId` | 签到任务 ID | 核对任务 |
| `data.accumulateCount` | 已完成的累签次数 | 计算已完成奖励和当前可操作档位 |
| `data.pushStatus` | 提醒/推送状态 | 本实现仅保留，不自动订阅通知 |
| `data.signToday` | 今日是否已签 | `true` 时禁用今日签到 |
| `data.limitCount` | 是否命中活动限制 | `true` 时禁用签到 |
| `data.skuList[].signDays` | 奖励对应第几次签到 | 进度卡标题 |
| `data.skuList[].skuId` | 签到奖励 SKU | 奖励唯一标识，不用于话费券秒杀下单 |
| `data.skuList[].awardName` | 奖励名称 | 奖励文案 |
| `data.skuList[].awardPicUrls` | 奖励图片 | 奖励图 |
| `data.skuList[].hasRemainCount` | 当前奖励是否还有库存 | `0/false` 时禁用当次签到 |

### 4.2 执行签到并领取当日奖励（源码确认）

```http
POST /coc3/coc3-market-activity/cmpp-manage/task/accumulateSign
Content-Type: application/json;charset=UTF-8

{
  "taskId": 2999,
  "channelCode": "P00000132544"
}
```

官方组件在风控数据可用时还可能加入 `taskToken`、`wtAc`和 `wtAcId`。这些值必须由官方风控流程实时生成，不得伪造。

响应处理：

- `resultCode=0` 且 `data` 有奖励：展示领取到的奖励。
- `resultCode=0` 且 `data` 为空：仍视为签到成功，立即重新查询状态。
- `resultCode=500/502`：官方组件显示可重试失败弹窗。
- 其他错误：展示 `msg`。
- `resultCode=-516`：重换爱购凭证后最多重试一次。

### 4.3 签到前端状态机

| 条件 | 状态 | 是否可点 |
| --- | --- | --- |
| 奖励索引 `< accumulateCount` | 已签/已领取 | 否 |
| 索引 `= accumulateCount` 且 `signToday=false` | 今日可签 | 是 |
| `signToday=true` | 今日已签 | 否 |
| `limitCount=true` | 已达活动限制 | 否 |
| 当前奖励 `hasRemainCount=false` | 奖励已领完 | 否 |

`cookie-app` 的签到 API 要求 `confirmationText="确认签到"`，防止误操作或脚本意外调用。

## 5. 秒杀活动与商品接口

### 5.1 查询活动批次和商品（HAR 实录）

```http
GET /coc3/coc3-market-activity/arrange/getProByActId
  ?activityId=17453
  &selfChannelCode=P00000132544
  &batchId=0
  &showLimit=3
  &seckillType=1
  &from=page
```

详情页的同一接口还会传 `batchId`、`mid`、`action=goodinfo`和 `needDesc=1`。

主要响应字段：

| 字段 | 含义 |
| --- | --- |
| `data.id/name/startTime/endTime` | 活动 ID、名称和总时间 |
| `data.type/subType` | 活动类型，样例为 `1/12` |
| `data.repeatable` | 活动是否可重复获取，样例为 `0` |
| `data.description` | HTML 格式活动规则 |
| `subActivityList[].id` | 当日/当场批次 ID，资格和下单前必须使用最新值 |
| `activityStatus` | `0` 未开始，`1` 抢购中，`2` 已结束 |
| `showStartTime/showEndTime` | 批次在页面可见的时间段 |
| `startTime/endTime` | 真正允许抢购的时间段 |
| `goodsList[].aid/abatchId` | 商品归属的活动 ID 和批次 ID |
| `goodsList[].mid` | 商品主档 ID，用于查询详情 |
| `goodsList[].skuid` | 实际领取 SKU ID，用于资格、短信和下单 |
| `name/showName/midName` | 商品名称 |
| `price/originPrice` | 活动价和原价，样例话费券为 0 |
| `num` | 当场投放数 |
| `availableNum` | 当场剩余可领数，`<=0` 按“已抢完”处理 |
| `skuStock` | SKU 总库存，不能代替当场 `availableNum` |
| `salesVolume` | 已售/已领数 |
| `joinStatus` | 当前用户的参与状态，详见状态表 |
| `jumpUrl/useUrl` | 已领取后的使用入口 |
| `maxLimit/maxRange` | 限领数和限制范围 |

### 5.2 辅助查询接口（HAR 实录）

| 接口 | 方法 | 用途 |
| --- | --- | --- |
| `/coc3/coc3-market/api/order/getCurrentTime.do` | POST | 获取服务端时间，官方详情页用于倒计时 |
| `/coc3/coc3-market/arrange/salePage/getProductByMid?mid=...` | GET | 获取商品详情、资费、权益规则和 SKU |
| `/coc3/coc3-market-member/api/member/selectProvinceVip` | POST | 查询分省会员状态；样例请求体为 `vipLevel/province` |
| `/coc3/coc3-market-order/api/external/evaluation/skuEvaluationList` | POST | 商品评价列表，对领取主流程不是必须 |

`cookie-app` 的活动主页不依赖商品评价和会员信息，减少无关上游请求。

## 6. 资格查询和前端状态

### 6.1 资格接口（HAR 实录）

```http
GET /coc3/coc3-market-activity/arrange/checkQualificByActivityId/v3
  ?activityId=17453
  &skuId=<当前 SKU>
  &businessType=1
  &batchId=<当日批次>
```

| 参数 | 用途 |
| --- | --- |
| `activityId` | 主活动 ID |
| `skuId` | 用户选择的话费券 SKU |
| `businessType` | 业务类型，当前页固定为 `1` |
| `batchId` | 当日当场批次 ID |

样例 HAR 在详情页阶段返回 `resultCode=-516`，表示当时的页面登录已失效，不是资格被业务规则拒绝。实现中必须先重换凭证，再根据重试结果判断资格。

页面源码的新商品组件还定义了 `/v5`，但本活动 HAR 实际调用 `/v3`，所以当前实现使用 `/v3`。

### 6.2 `activityStatus` 与 `joinStatus`

| 条件 | 页面状态 | 操作 |
| --- | --- | --- |
| `activityStatus=0` | 即将开始 | 禁止获取验证码 |
| `activityStatus=2` | 已结束 | 禁止获取验证码 |
| `activityStatus=1` 且 `joinStatus=0` 且 `availableNum>0` | 立即抢购 | 允许先查资格，再发送验证码 |
| `joinStatus=1` | 已领取 | 有 `jumpUrl/useUrl` 时显示“去使用” |
| `joinStatus=17` | 已领取 | 有跳转地址时可去使用 |
| `joinStatus=2` | 无参与机会 | 官方页通常禁止抢购 |
| `joinStatus=3` | 已抢完 | 官方页通常禁止抢购 |
| `joinStatus=6` | 本次无机会/下次再来 | 官方页通常禁止抢购 |
| `joinStatus=7` | 暂无资格，官方页可能引导完成任务 | 当前实现仅展示无资格 |
| `availableNum<=0` | 已抢完 | 官方页即使 `joinStatus=0` 通常也禁止抢购 |

运营商官方页通常要求以下条件同时满足才显示“立即抢购”：

1. 账号已有可验活的爱购凭证。
2. 当前批次 `activityStatus=1`。
3. `availableNum>0`。
4. `joinStatus=0`。
5. 资格接口实时返回成功。

`cookie-app` 会保留这些上游状态用于展示，但默认不据此禁用“尝试领取”。后端在资格查询、发短信和确认领取前重新读取活动，以核对 batch/SKU 仍属于当前活动，然后把真实资格、库存、时间和风控判断交给运营商接口。管理员可用本站覆盖配置单独暂停某个权益。

## 7. 抢购验证码

### 7.1 接口（源码确认，HAR 未实录）

```http
POST /coc3/coc3-market/api/sms/qwSendSmsCode
Content-Type: application/json;charset=UTF-8

{
  "receivers": "<爱购用户 Token>",
  "skuId": "<AES(原始SKU_当前毫秒时间戳)>",
  "member": false,
  "businessChannelCode": "P00000132544",
  "activityId": 17453
}
```

| 参数 | 用途 |
| --- | --- |
| `receivers` | 官方 H5 使用当前爱购用户标识，不传库内明文手机号 |
| `skuId` | 不是原始数字；官方前端将 `skuId_timestamp` 用 AES-128-CBC/PKCS7 加密后 Base64 传输 |
| `member` | 是否超市会员环境；当前标准 H5 流程为 `false` |
| `businessChannelCode` | 三日签渠道 |
| `activityId` | 秒杀活动 ID |

响应逻辑：

- `resultCode=0`：发送成功，`data.busiOpId` 可能存在，页面开始 60 秒倒计时。
- `resultCode=-516` 或登录失效文案：重换爱购凭证后重试一次。
- 其他失败：显示 `msg/message`，不进入倒计时。

`busiOpId` 在新版数字商城下单体中使用；本活动的旧版 `activity/placeOrder` 请求体没有引用它。

## 8. 确认抢购/领取

### 8.1 接口（源码确认，HAR 未实录）

```http
POST /coc3/coc3-market-order/api/external/order/activity/placeOrder
Content-Type: application/json;charset=UTF-8

{
  "skuId": 84633,
  "channelCode": "P00000132544",
  "selfChannelCode": "P00000132544",
  "smsCode": "<用户输入的短信验证码>",
  "dealType": 0,
  "activityId": 17453,
  "referer": "<官方活动页>"
}
```

| 参数 | 用途 |
| --- | --- |
| `skuId` | 当前批次中用户选择的原始 SKU ID |
| `channelCode/selfChannelCode` | 活动渠道，旧组件同时传两个字段 |
| `smsCode` | 用户收到的 4-8 位数字验证码；该 activity 端点源码不再对它执行通用下单 AES 转换 |
| `dealType` | 交易类型，旧秒杀组件固定为 `0` |
| `activityId` | 三日签主活动 ID |
| `referer` | 官方活动来源 |

官方页面在提交前还会：

1. 显示 `SecondConfirmBuy3` 二次确认。
2. 在部分环境加入 `wtAc/wtAcId`。
3. 从本地风控 SDK 取得设备标识、WASM 参数和风控请求头。

`cookie-app` 不伪造设备指纹或风控结果。当上游对某个账号要求额外风控验证时，确认接口可能返回风控拒绝，该情况需使用官方活动页完成验证。这是当前唯一个必须通过真实可抢时段联调的不确定项。

### 8.2 响应处理

提供的 HAR 没有下单响应样例，因此不虚构具体 `data` 结构。当前处理原则：

- `resultCode/code=0`：接口层面成功，展示 `msg/message/resultMsg`，然后重新查询活动状态。
- 非 `0`：保留并展示上游错误码与文案。
- `-516`：自动重换凭证并且最多重试 1 次。
- 返回数据中的 Token、Cookie、手机号、短信码和风控字段不会返回前端或写日志。

## 9. `cookie-app` 内部 API

| API | 作用 | 是否改变业务状态 |
| --- | --- | --- |
| `GET /api/lucky-three-day/accounts` | 返回当前用户可用账号 | 否 |
| `POST /api/lucky-three-day/:accountId/status` | 准备凭证，查签到和批次状态 | 仅可能刷新凭证 |
| `POST /api/lucky-three-day/:accountId/sign` | 执行今日签到 | 是 |
| `POST /api/lucky-three-day/:accountId/qualification` | 复核奖品状态并查资格 | 否 |
| `POST /api/lucky-three-day/:accountId/order-sms` | 复核资格并发送验证码 | 发送短信 |
| `POST /api/lucky-three-day/:accountId/confirm` | 复核资格并确认领取 | 是 |
| `GET /api/lucky-three-day/settings` | 管理员读取权益覆盖配置 | 否 |
| `PUT /api/lucky-three-day/settings/:batchId/:skuId` | 管理员设置可尝试状态和展示库存 | 改变本站配置 |

权限规则：

- 管理员可使用所有未停用账号。
- 普通用户必须开启独立的“权益活动”权限，并且只能使用自己关联的账号；该权限默认关闭。
- 禁用账号不可参与活动。

本地覆盖规则：

- 未建立覆盖配置时，每个权益默认允许尝试领取；本站不根据上游的活动时间、`availableNum` 或 `joinStatus` 提前拦截。
- `attemptable=false` 时，本站服务端拒绝资格、短信和领取请求。
- `inventory` 仅覆盖本站展示库存，`upstreamAvailable` 始终保留上游实时库存；自定义库存不会改变运营商库存。
- 即使本站允许尝试，上游仍会按真实活动时间、库存、用户资格和风控结果决定是否受理。

防重复提交：

- 前端为每次领取流程生成 `attemptId`。
- 后端按用户、账号、批次、SKU 和 `attemptId` 合并并发请求。
- 仅成功的上游结果缓存 10 分钟，同一 `attemptId` 重试时复用成功结果，不再重复下单。
- 火爆、资格拒绝和其他明确失败不会缓存，按钮恢复后允许再次发送短信或领取。
- 如请求在上游返回前发生网络超时，结果可能不确定；再次提交前应结合刷新后的 `joinStatus` 判断。
- 该缓存是单进程内存保护；如部署多实例，应将幂等键迁移到 Redis 或数据库唯一约束。

## 10. 前端交互流程

```text
选择账号
  -> 凭证验活/必要时重换
  -> 展示累签进度、当日批次和权益列表

签到：
  点击今日签到 -> 弹窗确认 -> accumulateSign -> 刷新签到状态

话费券：
  点击权益 -> 进入独立详情/等待页 -> 查看开始或结束倒计时
  -> 点击尝试领取
  -> 后端重新查批次/库存/joinStatus（只核对动态 SKU，不做本地库存/时间拦截）
  -> 查资格
  -> 弹出验证码面板
  -> 用户主动获取验证码（仅发送成功后进入 60 秒冷却；失败可立即重试）
  -> 输入验证码和“确认领取”
  -> 服务端再次复核并确认领取（明确失败后按钮恢复，可再次提交）
  -> 刷新活动状态
```

前端不会自动签到、自动发送短信、自动抢购或批量抢购。所有会改变用户活动状态的操作都需要当前用户明确点击。

## 11. 安全与日志

- Aigou Cookie、Token和 refreshToken 继续使用现有凭证库加密存储。
- API 响应只返回脱敏账号和业务状态，不返回 Cookie、Token、SSO ticket 或短信码。
- 共通 HTTP 日志对 `Cookie`、`phone`、Token 和带凭证的 URL 参数脱敏。
- 后端只允许从当前活动响应中选择 batch/SKU/MID，不接受任意 SKU 代理请求。
- 响应数据返回前会递归移除手机号、凭证、短信和风控字段。

## 12. 联调与验收

安全的自动验证范围：

1. 爱购凭证验活与失效后重换。
2. `getTaskSignInfo` 签到状态。
3. `getProByActId` 活动批次和库存。
4. `checkQualificByActivityId/v3` 资格查询。

必须由账号使用者手动确认的验收项：

1. `accumulateSign` 会改变今日签到状态。
2. `qwSendSmsCode` 会发送真实短信。
3. `activity/placeOrder` 会消耗限量资格并可能产生权益订单。

真实抢购联调时应记录脱敏后的 `resultCode`、错误文案、是否要求额外风控、订单结果字段和刷新后的 `joinStatus`，再补充本文档第 8.2 节的精确响应格式。

# 10086 预约回访

## 入口与范围

- Public：宫格与列表的账号操作菜单 → 10086 预约回访。
- 用户管理：用户关联账号操作 → 10086 预约回访。
- V2 账号中心：账号详情底部 → 10086 预约回访。

预约以所选账号的实际 10086 登录身份为准，不允许输入另一个手机号冒用当前登录态。用户只能访问自己的关联账号；管理员可管理账号；尚未绑定用户的旧专属链接沿用链接账号范围，已绑定用户的链接必须登录。

这是商品客服回访工单，不是无业务上下文的通用热线排队。输入商品编码后实时查询商品与档位，再查询回访资格，最后点“确认预约回电”。示例默认编码 `11531947` 来自提供的 HAR，可改成其他商城商品编码。当前未实现脱离业务的任意手机号回拨，也不直接调用订购或扣费接口。

## 源码与抓包校正

本次依据附件 `10086预约回访.zip`、`subPackage-shopDetail-shopDetail.ae056b6e.js`、`预约客服回电.har` 复核，附件内容仅用作证据。

1. HAR 的第一次 `opportunity/create`：`returnCode="0"`、`data.flag=1`，返回 `bizOrderId`。
2. 后三次相同提交：`returnCode="-9999"`、`ok=false`，但 `data.flag=2`；文案为“该受理号码同一商品24h内预约次数大于等于2次或有未处理预约单”。因此必须先识别 flag=2，不能当成普通失败反复重试。
3. `ruleType=11, secondRuleType=1101` 才是主动预约 ACTIVE_ORDER；1107 是 RESULT_CHECK，不可误作为主动预约入口。
4. ZIP 中的失败规则实际返回 `flowChannel=202`，HAR 中返回 `flowChannel=1`。相同规则 ID 不代表所有号码、商品和渠道都有相同资格。
5. 预校验响应 data 是嵌套 JSON 字符串。除 `-1` 外还可能返回 `status=1` 等失败状态；按源码识别通过码和 `result.orderId=N`，将真实失败原因送给规则接口，不伪造失败理由。

## 官方调用链

复用项目已有新零售 SSO 和加解密：10086 CK → `nrauth/auth/encryt/userAuth` → Authorization、实际手机号、省市、渠道 → 下列请求。业务请求 AES-256-CBC/URL-safe Base64，响应解析外层 body 后解密；SSO 使用项目已有独立 AES-128-CBC 实现。凭证不返回浏览器。

所有路径相对 `https://wx.10086.cn/website/nrapigate/`，方法均为 POST。

| 接口 | 关键入参 | 响应使用 |
| --- | --- | --- |
| `nrmix/product/prodWithNormList` | productCode | 商品名称、ID、类别、销售地区及 norms |
| `nrmix/product/norm` | normId | normNumber、名称、价格（分）、预校验字段 |
| `nropportunity/atom/ruleNew` | productCode、productType=1、sessionId、serviceFlag、price、scene、doubleEntranceFlag | 找到所选档位适用的主动预约规则 |
| `nrmix/preCheck/productPreCheck` | packageId、isMain、shopProvinceCode、busiEffectType、specialOfferType、preCheckType、productCode、normId、bizIntfCode、touchCode、shopPageId、productPersonalPageId、sessionId | 主动回访不可用时获取真实资格结果；仅查询，不订购 |
| `nropportunity/atom/failedOrder/check` | normId、failedReason、secondRuleType=202，以及会话、价格、场景 | 验证 flag=1，并获取实时 flowChannel、ruleId、standardDecision、业务分类、requestId |
| `nrmix/opportunity/create` | 下述工单参数 | 处理 success/duplicate/failed/unknown |

预约 payload：商品/档位决定 `normNumber/productCode/productName/normId/normRemark/price/productUrl/firstCategoryId/secondCategoryId/sellProvinceCodes/sellCityCodes`；SSO 决定 `channelCode/provinceCode/cityCode`；实时规则决定 `ruleId/businessId/businessType/subBusinessType/requestId`。主动预约 `type=11,secondType=1101`，失败回访 `type=2,secondType=202`。主动确认使用 `orderType=2`、`productType="1"`、`fChannelCode="ADSPZB-APP-XNYW-EBC"`。

回访流支持 `flowChannel=1` 和源码允许的渠道降级 ACTION 分支；双渠道必须包含 1。在线客服、直接音视频和 202 不冒充回访。需要个人套餐价比较的降档挽留规则提示去官方页面核验，当前不猜测套餐价格。

## 本地 API

前缀 `/api/callback-appointments/:accountId`，方法 POST，返回现有 `{ok,data,requestId}` / `{ok:false,message,errorCode,requestId}` 格式。

| 路径 | 输入 | 输出 |
| --- | --- | --- |
| `/products` | productCode，旧链接可带 publicLinkId | sessionId、maskedPhone、productName、norms、expiresAt |
| `/prepare` | sessionId、normId | preparationId、maskedPhone、productName、normName、expiresAt |
| `/confirm` | sessionId、preparationId | status、message、可选 bizOrderId/upstreamCode |

前端不能传入工单业务字段或规则覆盖值。每一步重新检查账号归属和停用状态，服务端会话另行绑定 ownerKey/accountId；会话有效期 10 分钟。号码与 cookie 的 SSO 实际号码不符则拒绝。

提交期间锁定同号码、同商品。成功与重复预约结果保留 30 分钟，网络结果不明保留 10 分钟，防止相同进程重复创建。缓存为进程内，重启/多实例仍依靠官方去重约束；不承诺分布式 exactly-once。确定失败可手动重试，网络异常不自动重放。

## 验证记录（2026-09-20）

- 使用授权号码 `152****4812` 的本地凭证，真实完成 SSO、商品/档位、规则、预校验和失败回访规则查询。
- 示例商品 `11531947` 未向该号码开放回访，返回 CALLBACK_UNAVAILABLE，没有发送创建工单请求。不能据此声称真实回电成功。
- 单测覆盖官方重复预约语义、主动/失败规则区分、会话归属、档位归属、号码核对、过期、并发、失败重试和网络结果不明不重放。
- `npm run test:callback` 执行专用测试。开发模式可访问 `/src/tests/callback-harness.html` 验证模拟成功、重复、失败与结果未知界面；此测试页不进入生产构建。
- 已通过类型检查、生产构建、现有 API/UI 测试；浏览器验证桌面 1280×720 和手机 390×844 布局、模拟成功、重复预约禁用、失败重试、Escape 和关闭按钮。
- 确认无执行中的批量任务后重启了 PM2 的 cookie-app 服务。真实 public 页面已完成商品查询和资格查询，正常显示该号码/示例商品暂不可预约；服务健康检查通过。

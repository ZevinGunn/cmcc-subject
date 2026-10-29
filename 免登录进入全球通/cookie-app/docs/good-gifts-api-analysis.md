# 好礼多多新零售接口分析

## 1. 通信与加密边界

接口基址为 `https://wx.10086.cn/website/nrapigate/`，通用请求头包括：

- `channelid: BUSINESS_H5`
- `Authorization: <SSO 返回 token>`
- `Content-Type: application/json; charset=UTF-8`
- `Referer: /website/businessPlatform/newCustomShopDetail?...&personalPageId=...`

SSO 请求使用 AES-128-CBC，业务网关使用 AES-256-CBC URL-safe Base64；实现统一复用 `api/services/cmccBenefitOrderCrypto.ts`。密钥不进入前端或文档，业务请求加解密都在服务端完成。

## 2. 接口顺序

| 阶段 | 接口 | 关键入参 | 关键响应 |
| --- | --- | --- | --- |
| SSO | `nrauth/auth/encryt/userAuth` | `backUrl`，指向 `newCustomShopDetail` | token、加密手机号、省市、二级渠道 |
| 页面 | `nrmix/product/newProductPersonalPageById` | `id=personalPageId`, `appFlag=0` | 页面组件、`productData`、全部档位和个性化说明 |
| 规格 | `nrmix/product/norm` | `normId` | 生效方式、预检类型、协议 ID、业务规则 |
| 关联 | `nrmix/product/queryRelevancy` | productId、productCode、productType=1、promotionPage=2 | 营销和赠礼活动 ID |
| 赠礼 | `nrpromotion/atom/courtesy/hcByNorm` | normId | 库存、有效性、consumeType 和可携带活动 ID |
| 预检 | `nrmix/preCheck/productPreCheck` | 商品、档位、分类、页面和个性页字段 | 嵌套 JSON 的 status/message |
| 协议 | `nrproduct/atom/protocol/queryProtocol` | 省市、productCode、normId | 协议 id/流水、名称、内容 |
| 短信 | `nrmix/sms/sendSms` | busiId=2、normIds、生效方式 | status/message |
| 下单 | `nrmix/order/createOrder` | 商品、档位、验证码、页面、协议、关联活动 | returnCode、returnMessage、订单信息 |

页面加载时官方前端还会调用用户策略、商户、规则、优惠券和赠礼查询；订购主链路所需的关联活动通过 `queryRelevancy` 返回，cookie-app 不复制纯展示和埋点请求。

## 3. 会员版样本字段

### 页面查询响应

- `data.id`: `2025100909463488702003179`
- `data.pageName`: 好礼多多（新）会员版
- `data.productData.productId`: `2162553`
- `data.productData.productCode`: `6536561`
- `data.productData.norms[0].normId`: `2237369`
- `data.productData.norms[0].productCode`: `111603016375`
- `data.productData.norms[0].bizIntfCode`: `100_COM`

这些值是证据样本而非永久配置。实现只固定页面标识，其他值每次查询后刷新到服务端会话。

### 预检请求

```json
{
  "packageId": "111603016375",
  "isMain": 0,
  "shopProvinceCode": "100",
  "busiEffectType": "Type_Default",
  "specialOfferType": 0,
  "preCheckType": "2",
  "productCode": 6536561,
  "normId": 2237369,
  "bizIntfCode": "100_COM",
  "touchCode": "",
  "shopPageId": "bff92c1764dc4fb18b5bf03c33d9a5c5",
  "productPersonalPageId": "2025100909463488702003179"
}
```

成功响应的 `data` 仍是 JSON 字符串，需要最多两层解析；最终 `status=0` 才表示预检通过。

### 下单差异字段

个性页相对普通 `shopDetail` 下单必须增加：

- `shopid=pageid`
- `productPersonalPageId`
- `processmethod=productOrder`
- `extendParams=[{type:"newPersonalId", content:personalPageId}]`
- 协议无流水但有主键时使用 `ptId`
- 赠礼活动先用 `hcByNorm` 过滤库存和有效性，再使用 `relevanceActivityVO`；样本 `relActivityType=2`

普通商城流程原有的 `orderResource/signActivity` 不作为个性页固定字段。官方页面的风控 token 由设备指纹脚本生成，生成请求中的 `param` 与浏览器环境动态绑定；会话营销追踪值也来自入口 sessionStorage。服务端不能安全复用或伪造这两类值，因此不从 HAR 固化。若上游后续将风控 token 改为强制字段，需要增加可信的服务端风控 SDK 或由官方页完成提交，不能使用样本 token。

## 4. 成功、失败和不确定结果

- 网关 `returnCode=0`：接口层成功；预检和短信还需继续检查内部 status。
- `SMS_9999`：验证码校验失败，可留在失败结果页重新开始，不声明订购成功。
- `A00012`：申请已提交但结果待确认，禁止直接重复下单。
- HTTP 超时、连接重置：标记 `RESULT_UNCERTAIN`，引导先走官方查询。
- SSO 手机号与所选账号不一致：服务端返回 `ACCOUNT_SESSION_MISMATCH`。

## 5. 流量版复用规则

流量版使用 `personalPageId=2025101316480230602003289` 调用同一页面接口。它的 productId、productCode、档位、资费、协议、预检类型和关联活动均从响应动态读取。只要响应继续满足 `productData.norms[]` 契约，即可展示接口返回的全部档位并完成同一订购流程；若无可办档位则返回 `NORMS_EMPTY`，不会退回会员版配置。

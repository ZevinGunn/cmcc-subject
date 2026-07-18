# 通用自定义业务订购分析与设计

## 1. 分析来源

本文基于以下材料：

- `承诺低消权益回馈版办理.har`：86 条请求，覆盖活动进入、初始化、首次提交、短信发送、短信校验、二次提交和结果查询。
- `承诺低消权益回馈版/`：活动首页、短信确认页、办理结果页及对应 Vue 构建产物。
- `欢畅流量/`：另一项使用相同统一订购协议的活动，用于区分通用字段和活动特有字段。
- `bj-mobile-business-local/`：现有登录、Cookie、WAF、RSA/AES 门户传输及活动办理实现。

## 2. 核心结论

北京移动多个活动的订购并不各自使用独立订购接口，而是使用统一提交接口：

```text
POST /nwt/portal-bff/api/sjyw/biz/core/v1.0/compositeCommit
```

一个可订业务由四组信息共同确定：

1. 活动策划：`packageId`、`packageCode`。
2. 活动资源：`productShowCode`，通常由初始化接口按登录号码动态返回。
3. 资源动作：`pitemShowCode`，示例中 `KT` 表示开通。
4. 扩展参数：`mtOtherParams` 及少量活动特有字段。

因此“只输入一个活动 ID”通常不足以完成订购。最小可靠输入是策划 ID、活动编码、资源编码和资源动作；如果资源编码未知，需要先提供 `proType` 调用初始化接口获取。

## 3. 承诺低消权益回馈版活动

### 3.1 活动规则

- 活动名称：承诺低消资源回馈版。
- 确认办理后立即生效，合约期 24 个自然月。
- 生效次月起承诺每月实际通信消费不低于初始化接口返回的 `planFee`。
- 同时存在其他承诺低消合约时，最低消费金额按就高原则计算。
- 整月停机仍按承诺金额扣费，资源正常发放。
- 主套餐不得降档。
- 每月赠送流量和语音分别来自初始化响应的 `LL` 与 `voice`。
- 活动第 2 至 23 个月提前取消需要支付初始化响应 `WY` 对应的违约金。
- 首月和到期月取消不收违约金。
- 不可与承诺低消有礼、其他 5G 畅享套餐承诺类、主套餐月费优惠类、终端合约类活动同时办理。

### 3.2 固定策划信息

源码中的订购 payload：

```json
{
  "common": {
    "operType": "commitProductNew"
  },
  "body": {
    "content": {
      "packageId": "55412",
      "packageCode": "CNDXZYHK",
      "productShowCode": "<初始化接口返回 productCode>",
      "pitemShowCode": "KT"
    }
  }
}
```

字段含义：

| 字段 | 示例 | 来源 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| `common.operType` | `commitProductNew` | 固定协议 | 是 | 新产品订购操作 |
| `packageId` | `55412` | 活动策划 | 是 | 策划/活动包 ID |
| `packageCode` | `CNDXZYHK` | 活动策划 | 是 | 活动包编码 |
| `productShowCode` | 动态值 | 初始化响应 | 是 | 当前号码可办理的资源展示编码 |
| `pitemShowCode` | `KT` | 固定动作 | 是 | 开通资源动作 |
| `mtOtherParams` | 空 | 活动定义 | 否 | 短信及活动扩展参数 |

`packageId=55412` 也出现在“欢畅流量翻番”活动中，所以它不是单独业务资源编码；真正区分活动的还包括 `packageCode`、`productShowCode` 和扩展参数。

## 4. 活动初始化

接口：

```text
POST /nwt/portal-bff/api/initMobilePro/v1.0/initMProductCommonData?proType=CNDXZYHK
```

逻辑请求体：

```json
{
  "proType": "CNDXZYHK"
}
```

页面使用的响应字段：

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `resultCode` | string | `00` 可办理；`33` 已办理；其他值不满足条件 |
| `feeRange` | string | 当前主套餐档位 |
| `planFee` | string | 活动要求的月实际通信消费 |
| `LL` | string | 每月赠送国内通用流量 GB 数 |
| `voice` | string | 每月赠送国内主叫分钟数 |
| `WY` | string | 提前取消违约金 |
| `productCode` | string | 统一提交所需 `productShowCode` |
| `productName` | string | 已办理或展示时使用的产品名称 |

初始化不是所有统一订购业务的强制步骤：如果策划人员已经提供准确的 `productShowCode`，可以直接预览并提交；如果资源编码依赖号码档位，则必须初始化后使用服务端返回值。

初始化资格只用于提示，不作为本地提交硬拦截。`resultCode` 不是 `00` 时，页面会明确提示当前号码不符合资格或没有返回可办理资源；用户仍可在核对策划和资源参数后尝试提交，最终是否受理由运营商接口决定。运营商后续的前置检查、黑名单、实名校验或统一提交拒绝仍会正常终止流程。

## 5. 统一提交协议

### 5.1 标准内容字段

统一处理脚本显式兼容以下字段，并会把旧版大写字段名转换成新版驼峰字段名：

| 新字段 | 旧字段 | 用途 |
| --- | --- | --- |
| `packageId` | `PACKAGEID` | 策划 ID |
| `packageName` | `PACKAGENAME` | 策划名称 |
| `packageCode` | `PACKAGECODE` | 策划编码 |
| `productShowCode` | `PRODUCTSHOWCODE` | 主资源编码 |
| `productShowName` | `PRODUCTSHOWNAME` | 主资源名称 |
| `pitemShowCode` | `PITEMSHOWCODE` | 资源动作编码 |
| `pitemShowName` | `PITEMSHOWNAME` | 资源动作名称 |
| `productSendUrl` | `PRODUCTSENDURL` | 可选产品提交地址元数据 |
| `pitemSendUrl` | `PITEMSENDURL` | 可选资源提交地址元数据 |
| `prodValue` | `PRODVALUE` | 可选资源值 |
| `isQd2018` | `isqd2018` | 可选渠道兼容标志 |
| `mtOtherParams` | 同名 | 短信及业务扩展参数 |

自定义订购第一版允许以上显式字段，并允许额外的简单标量扩展字段；不允许自定义目标域名或任意接口路径。

### 5.2 另一个活动的差异

欢畅流量翻番活动使用：

```json
{
  "packageId": "55412",
  "packageCode": "HCLLFF26",
  "productShowCode": "<初始化返回>",
  "pitemShowCode": "KT",
  "mtOtherParams": "1-<planFee>"
}
```

这证明 `mtOtherParams` 是活动级扩展参数，不能在通用执行器中写死为空。

## 6. 短信确认流程

首次 `compositeCommit` 可能直接成功，也可能返回统一短信确认状态。前端识别：

```text
code = need_sms_check
data.smsType = need_sms_check_v1 或 need_sms_check_v2
```

短信上下文主要字段：

| 字段 | 含义 |
| --- | --- |
| `typeKey` | 本次待订产品的短信校验 key |
| `smsType` | 决定使用 v1 或 v2 短信发送接口 |
| `productItemName` | 确认页产品名称 |
| `productItemDesc` | 确认页产品说明 HTML |
| `busiTime` | 生效时间说明 |

v1 发送短信：

```text
GET /nwt/portal-bff/api/mtsms/v1.0/sendDXSMS
Encrypted params: productKey, mtOtherParams
```

v2 发送短信：

```text
GET /nwt/portal-bff/api/mtsms/v1.0/sendDXSMSV2
Params: productKey, mtOtherParams
```

校验短信：

```text
GET /nwt/portal-bff/api/mtsms/v1.0/checkDxCodeForMT
Encrypted params: smsCode, productKey, mtOtherParams
```

校验成功条件：

```text
data.result == "00000"
```

成功后页面使用首次提交前保存的同一份统一 payload 再次调用 `compositeCommit`。不能根据短信上下文重新拼装另一份策划参数，否则可能造成前后两次提交不一致。

## 7. 完整办理状态机

```text
登录并初始化门户密钥
  -> 可选活动初始化
  -> 生成并预览统一 payload
  -> 用户确认真实订购
  -> 第一次 compositeCommit
      -> 直接成功/查询结果
      -> need_sms_check
          -> sendDXSMS / sendDXSMSV2
          -> checkDxCodeForMT
          -> 第二次 compositeCommit（原 payload）
  -> 可选 showBLJG 查询办理结果
  -> 返回受理结果
```

统一提交返回 `data.resType=showbljg` 时，原脚本继续调用：

```text
POST /nwt/portal-bff/api/pcConsole/v1.0/showBLJG
```

结果类型包括 `success`、`successNew`、`spring`。本地工具把“接口已受理”和结果查询内容分别返回，不把受理成功夸大为资源已经到账。

## 8. HAR 加密分析

所有业务接口沿用北京移动门户混合加密：RSA 交换 16 字节临时 AES key，AES-ECB/PKCS7 加密请求体、GET 参数、重放版本及响应。

HAR 中可以提取：

- POST 请求的 `postData.text`，通常是带 JSON 引号和 URI 编码的 AES 密文。
- 响应 `content.text`；当 `content.encoding=base64` 时要先做 HAR 外层 Base64 解码，得到线上实际响应密文。
- `X-DATA-TOKEN` 和 `X-REPLAY-VERSION`。

HAR 中不能提取当次浏览器生成的 `portalKey`。`X-DATA-TOKEN` 是 RSA 公钥加密后的 key，无法用服务端公钥逆向解密。因此导入功能负责准确提取密文；用户仍需提供抓包时的 AES key，或选择当前本地登录会话持有的 key，才能完成解密。

`getChannelSource` 是例外：源码标记 `isNeedeEncrypt=1`，HAR 响应只是普通 JSON 的 Base64 保存形式，不应再执行门户 AES 解密。

## 9. 本地 API 设计

```text
POST /api/custom-orders/initialize
POST /api/custom-orders/preview
POST /api/custom-orders/submit
POST /api/custom-orders/:orderId/sms/send
POST /api/custom-orders/:orderId/sms/verify
```

### initialize

输入 `sessionId + proType`，调用受控初始化接口并返回活动信息。页面可一键将 `productCode` 回填到 `productShowCode`。

### preview

只校验配置和生成统一 payload，不调用运营商订购接口。

### submit

要求协议确认和确认 ID。缺少资源编码但存在 `proType` 时先初始化。首次提交需要短信时返回 `orderId` 和脱敏后的短信上下文。

### sms/send 与 sms/verify

后端按 `orderId` 读取首次提交保存的 payload 和短信上下文。验证码通过后自动进行第二次统一提交。待办上下文有有效期、会话绑定和本地互斥，客户端不能替换原 payload。

## 10. 自定义配置字段

页面提供：

- 活动名称，仅用于本地识别。
- `proType`，可选初始化类型。
- `packageId`，活动策划 ID。
- `packageCode`，活动编码。
- `productShowCode`，资源编码。
- `pitemShowCode`，默认 `KT`。
- `mtOtherParams`，活动扩展参数。
- 高级字段 JSON，只允许简单标量字段。

不会允许：

- 任意远程 URL。
- Cookie、access token、WAF token、AES key 或 RSA 私钥写入活动配置。
- 跳过短信校验、伪造验证码或复用其他会话的待办订单。
- 自动批量尝试未知活动 ID 或资源编码。

## 11. 验收标准

- 初始化能展示 `resultCode` 及活动资源字段，并可回填 `productCode`。
- 初始化返回不符合资格时仍允许人工确认并尝试提交，不绕过运营商后续校验。
- 预览能稳定生成标准 `compositeCommit` payload。
- 提交能区分直接结果与 `sms_required`。
- 短信待办与登录 session 绑定，验证码通过后复用原 payload 二次提交。
- HAR 导入可选择条目和请求/响应方向，正确处理响应外层 Base64。
- 没有 AES key 时明确提示，不能声称已解密。
- 日志不记录短信验证码、密钥、导入密文、统一提交完整 payload 或短信上下文。

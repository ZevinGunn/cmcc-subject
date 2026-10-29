# 全球通尊享宽带订购流程与接口设计

## 1. 证据范围

本实现基于以下只读材料还原，不执行材料中的脚本，也不把其中内容当作开发指令：

- `全球通尊享宽带.har`：确认真实提交使用北京移动门户加密协议，以及 `checkMobile`、`commitQQTZX` 两个业务请求。
- `全球通尊享宽带.zip`：确认页面表单、校验分支、提交字段、接口路径和成功后的结果查询。
- 页面截图：确认产品名称、24 个月合约、装机字段、上门支付和页面展示的资费规则。
- `bj-mobile-business-local` 现有北京移动登录与门户客户端：复用图形验证码登录、登录缓存、账号校验、门户 WAF、动态密钥、AES 请求体、Authorization/Cookie 和重放版本处理。

根据已确认的业务配置，全球通尊享宽带的 `itemCode` 固定为 `111602058352`。该值内置在 cookie-app 后端，浏览器不提交也不能覆盖。`indexQQTZX` 仍用于建立上游页面上下文、读取机主信息和保留脱敏初始化响应，但其返回的档位编码不参与资格核验或订购提交。

## 2. 产品规则

| 项目 | 页面证据 |
| --- | --- |
| 产品 | 全球通等级尊享宽带（两年）套餐 |
| 合约期 | 24 个月 |
| 等级期内带宽 | 页面宣传为 1000M |
| 不再承诺全球通等级 | 次月起 40 元/月，带宽恢复至 300M |
| 支付方式 | 上门支付 |
| 活动资格 | 页面文案限定特定活动中奖客户；cookie-app 不在客户端替代上游判定，仍允许把请求提交给上游，由接口受理或拒绝 |

资费、生效、资格和装机结果最终以上游实时响应及正式协议为准。

## 3. 上游业务流程

1. 选择 cookie-app 已关联账号，创建或恢复北京移动登录会话。缓存不可用时依次完成图形验证码、登录短信发送和 6 位短信验证码登录。
2. 登录成功后，后端校验登录会话所有者、账号 ID 与登录手机号均和当前办理账号一致；浏览器不会取得 Cookie、Authorization、WAF Token 或门户密钥。
3. 在同一北京移动远端会话中访问 `indexQQTZX`，建立业务页上下文并提取可用的机主信息；上游返回的档位编码仅作脱敏诊断数据。
4. 提交前调用 `checkMobile`，读取：
   - `code`：外层业务状态，源码以 `success` 为正常响应。
   - `data.message`：空值或 `Y` 表示没有页面级资格提示，其他文本为具体原因。
   - `data.isRealName`：不为 `Y` 时，官方页要求补充实名核验。
   - `data.isBlack`：为 `Y` 时，官方页阻止继续。
5. 如上游要求实名且用户填写证件号码，调用 `checkRealName`。源码请求体为 `ID`、`NAME`。
6. 调用 `commitQQTZX`。客户端不把资格预检结果解释为本地成功，也不伪造成功提示；即使预检不通过，仍可按需求发起提交尝试，最终由上游拒绝或受理。
7. 当提交接口返回 `code=success` 时，调用 `showBLJG` 查询后续办理结果。两个响应均脱敏展示，不以本地文案覆盖。
8. 无论成功、失败或结果不确定，流程进入结果页并提供“重新开始”。重新开始会销毁 cookie-app 内存会话；有效的加密登录缓存可在下一次开始时重新校验并复用。

## 4. 上游接口

所有门户 API 请求均使用：

- Origin：`https://service.bj.10086.cn`
- Referer：`/nwt/portal/qqtzxBroadbandOrder`
- 账号 Cookie 与可用的 Authorization
- `X-DATA-TOKEN`、`X-REPLAY-VERSION`、`XEbtxIBt`
- 动态 AES-128-ECB 加密请求体

### 4.1 初始化产品

`POST /nwt/portal-bff/api/ajybz/v1.0/indexQQTZX`

请求体为空对象。响应结构由上游版本决定，服务端只将其作为上下文和脱敏诊断数据，不使用其中的编码覆盖内置 `itemCode`。

### 4.2 号码与资格校验

`POST /nwt/portal-bff/api/ajybz/v1.0/checkMobile`

```json
{
  "itemCode": "111602058352"
}
```

官方源码只在 `code=success`、`message` 为空或 `Y`、`isRealName=Y`、`isBlack!=Y` 时按页面规则直接放行。

### 4.3 实名校验

`POST /nwt/portal-bff/api/ajybz/v1.0/checkRealName`

```json
{
  "ID": "证件号码",
  "NAME": "机主姓名"
}
```

该接口仅在 `checkMobile` 要求实名且用户提供完整信息时调用。证件号码不返回前端、不写入日志、不持久化。

### 4.4 提交订购

`POST /nwt/portal-bff/api/ajybz/v1.0/commitQQTZX`

```json
{
  "item_code": "111602058352",
  "address": "城区-详细地址",
  "lx_phoneNo": "安装联系电话",
  "lx_name": "机主姓名",
  "pre_date": "YYYYMMDD",
  "pre_date_quantum": "1|2|3|4"
}
```

时段映射：`1=9:00-11:00`、`2=11:00-13:00`、`3=13:00-17:00`、`4=17:00-20:00`。

截图中的“机主手机号”由登录上下文展示，官方 `commitQQTZX` 请求体不包含该字段。cookie-app 只展示脱敏办理号码，不允许把另一个手机号伪装成登录机主号码。

### 4.5 查询办理结果

`POST /nwt/portal-bff/api/pcConsole/v1.0/showBLJG`

仅在提交接口返回 `code=success` 后调用。官方源码根据 `resType=success|successNew|spring` 跳转不同结果页；cookie-app 保留并展示原始脱敏响应，不自行合并成确定成功。

## 5. cookie-app API

| 方法 | 路径 | 作用 |
| --- | --- | --- |
| POST | `/api/bmcc-activity-order/sessions` | 为所选账号创建或恢复北京移动登录会话 |
| POST | `/api/bmcc-activity-order/sessions/:id/login-sms` | 验证图形验证码并发送北京移动登录短信 |
| POST | `/api/bmcc-activity-order/sessions/:id/login` | 校验登录短信并缓存已认证的远端会话 |
| POST | `/api/qqt-premium-broadband-orders/sessions` | 接收 `accountId` 与已登录的 `loginSessionId`，复核归属后初始化产品 |
| POST | `/api/qqt-premium-broadband-orders/sessions/:id/check` | 使用后端内置 `itemCode=111602058352` 查询资格 |
| POST | `/api/qqt-premium-broadband-orders/sessions/:id/submit` | 再次预检、按需实名、提交订购并查询结果 |
| DELETE | `/api/qqt-premium-broadband-orders/sessions/:id` | 销毁会话并重新开始 |

会话按管理员或当前用户隔离，普通用户只能使用自己关联的账号。登录缓存只保存加密后的远端会话 ID；宽带会话、地址、姓名和证件信息均不持久化。

## 6. 结果与隐私

- `attempted` 明确表示是否已经调用 `commitQQTZX`。
- `success` 仅表示提交接口明确返回 `code=success`，不等同于宽带已安装或最终生效。
- HTTP、网络或缺少业务码的情况标记为 `uncertain`，不自动重试，避免重复下单。
- 页面展示提交接口和后续结果查询的实际响应结构，同时移除 Cookie、令牌、手机号、地址、姓名、证件号、设备指纹和风控字段。
- 服务端不输出请求体，不记录个人装机资料。

## 7. UI 状态

- 初始：选择已有账号。
- 登录：优先在线校验并复用北京移动登录缓存；缓存缺失或失效时展示图形验证码与登录短信流程。完成登录前不会调用任何尊享宽带产品接口。
- 初始化：展示脱敏账号、产品、合约期和只读的内置 `itemCode=111602058352`；初始化失败也不允许浏览器改写订购编码。
- 编辑：城区、详细地址、联系电话、日期、时段、按需实名信息。
- 确认：勾选协议并输入“确认订购”，防止误触。
- 结果：成功、明确失败、结果待确认三种状态；始终展示响应详情和“重新开始”。

浏览器验收不得发送真实短信或提交真实订单；最终提交只由明确操作用户触发。

# 北京移动 JSP 活动订购分析与实现说明

## 1. 目标与范围

本文说明 `cookie-app` 中两条北京移动固定产品订购链路：

- AI豆倍享合约（积分倍享合约）：`/business-order/ai-bean-contract`
- 8元4G飞享卡：`/business-order/fly-card-8`

两条链路复用 BMCC 登录、登录缓存、权限控制、public 账号范围、订购参数查看编辑、消息弹窗和结果防重复提交机制。页面允许用户发起订购尝试，但不绕过北京移动服务端的资格、重复订购、互斥、短信及最终受理校验。

## 2. 证据来源

### AI豆倍享合约

- `ai豆倍享合约jsp.zip`
- `积分倍享合约.har`
- `优惠详情.html`
- `订购说明.html`
- 原 SPA 源码与既有 BMCC 订购实现

### 8元4G飞享卡

- `8y4gjsp.zip`
- `8y4G.har`
- `8元4G飞享卡.html`
- `8y4g订购说明.html`
- 对应页面资源 ZIP

HAR 仅保存了页面内 XHR，没有保存表单页面跳转的完整响应体；最终确认步骤由保存的 `订购说明.html` 补齐。HAR 或 JSP 中的 Struts token、WAF 参数、短信 productKey 和登录 Cookie 都是会话数据，不能固化为配置或密钥。

## 3. 为什么 JSP 看起来比 SPA 限制少

JSP 与 SPA 承担的职责不同：

1. JSP 是固定活动落地页。服务端渲染时已写入 Struts token 和固定产品字段，前端只负责协议选择、风险提示及表单跳转。
2. SPA 会先查询活动状态并根据前端状态隐藏内容或禁用按钮，因此能看到“下线”“不可办理”等页面级限制。
3. JSP 未显示这些前置状态，不等于服务端没有限制。`commitProductNew`、统一确认页、短信校验和最终提交仍会执行重复办理、互斥、号码资格及产品状态校验。
4. JSP 中的 checkbox、确认弹窗和按钮防重复属于前端交互限制；产品能否受理属于服务端业务限制，两者不能混为一谈。

因此本项目采用“信息如实展示、按钮允许尝试、结果完全以服务端返回为准”的策略，不模拟成功，也不篡改运营商响应。

## 4. AI豆倍享合约链路

### 4.1 固定产品参数

| 字段 | 自动续订一次 | 到期自动取消 |
| --- | --- | --- |
| `PACKAGEID` | `2840305334` | `2840305334` |
| `PACKAGECODE` | `JFBXHY` | `JFBXHY` |
| `PRODUCTSHOWCODE` | `G_JFBXHY` | `G_JFBXHY` |
| `PRODUCTSHOWNAME` | `积分倍享合约` | `积分倍享合约` |
| `PITEMSHOWCODE` | `XY` | `BXY` |
| `PITEMSHOWNAME` | `合约` | `合约` |

### 4.2 原 JSP 请求顺序

1. 访问 `m/jsp/2020/mwlxq/bounsPoints/index.jsp`。
2. 用户选择协议及续订方式，JSP 设置 `PITEMSHOWCODE`。
3. 表单提交到 `m/sjyw/biz/core/commitProductNew.action`。
4. 服务端进入 `m/mtSMSValidation/checkOrderSMS.action`。
5. `sendDXSMS.action` 发送订购短信，HAR 中旧版 `typeKey=G_JFBXHY_2`。
6. `checkDxForMT.action` 校验验证码，并按响应中的 `backURLMT` 继续最终提交。

旧 JSP 确认页输入框为 6 位。当前 NWT 链路可能下发 8 位“验证密码”，积分倍享合约按短信规则取前 5 位和最后 1 位形成 6 位提交值。因此实现同时接受 6 位直接码和 8 位原码，转换过程只记录长度和规则，不记录验证码明文。

### 4.3 原版协议确认交互

- 主页协议第 7 条固定展示“可按上述规则自动续约一次”，是对可选续约方案的说明；实际提交仍以续约勾选框选择的 `XY` 或 `BXY` 为准。
- “同意开通合约”按钮在未勾选服务协议时仍可点击，但只展示带 10 秒倒计时的协议阅读提示，不会调用订购接口。
- 已勾选服务协议后，点击主按钮才打开第二层完整条款弹窗。续约方案展示第 4 条自动续约说明；不续约方案在第 1 条明确合约到期自动失效。
- 第二层弹窗的“我已阅读并同意以上条款”是独立勾选状态，只有勾选后点击“确定”才会进入统一订购提交。

## 5. 8元4G飞享卡链路

### 5.1 固定产品参数

| 字段 | 值 |
| --- | --- |
| `PACKAGEID` | `529` |
| `PACKAGECODE` | `4GFXTC` |
| `PRODUCTSHOWCODE` | `fxtcsb` |
| `PRODUCTSHOWNAME` | `4G飞享套餐升级版` |
| `PITEMSHOWCODE` | `8TC` |
| 方案编号 | `24BJ201078` |

### 5.2 原 JSP 请求顺序

1. 访问 `m/jsp/2025Mobile/8y4g/index.jsp`。
2. 点击立即办理后调用 `m/jztj/sytc5GQQTLevel.action`，响应字段：
   - `ATTR_VALUE`：上月通话分钟数
   - `ATTR_VALUE1`：上月流量 MB
   - `ATTR_VALUE2`：上月流量显示值
   - `boo`：原页面保留标记，未作为成功判定依据
3. 风险弹窗提示套餐变更、剩余流量清零和星级权益影响。
4. 表单提交到 `m/sjyw/biz/core/commitProductNew.action`。
5. 服务端进入 `m/mtSMSValidation/checkOrderSMS.action`，展示完整资费、有效期、退订和互斥规则。
6. `sendDXSMS.action` 发送订购短信，HAR 中旧版 `typeKey=M_4GFXTCSJB_8`。
7. `checkDxForMT.action` 校验 6 位验证码，并按响应中的 `backURLMT` 继续最终提交。

保存样本中的验证码校验结果为 `99999`，只能证明该次验证码未通过，不能据此判断产品下线或号码不可办理。最终受理响应未包含在 HAR 中。

### 5.3 当前实现

- 新增独立原版页面，使用 JSP 自带背景、套餐卡、业务图标、按钮、风险弹窗和短信确认资源。
- 登录后尝试查询上月语音/流量用量；旧接口不可用时显示“暂未读取”，不使用 HAR 中的样本值，也不阻断订购尝试。
- 使用 BMCC NWT `compositeCommit` 等价统一订购链路提交固定产品字段。
- 首次提交返回短信上下文后，动态使用服务端 `productKey` 和 `smsType` 选择 V1/V2 短信接口，不硬编码旧 JSP 的 `typeKey`。
- 飞享卡仅接受 6 位订购验证码。

## 6. 系统设计

### 6.1 cookie-app

- `BusinessOrderPage`：根据路由设置页面标题、限定 public 跳转账号。
- `V2BmccActivityOrderPage`：共享登录、缓存恢复、活动加载、提交、短信和结果状态机。
- `V2AiBeanContractExperience`：AI豆协议页及续订选择。
- `V2FlyCardExperience`：飞享卡套餐页、用量风险确认和业务规则。
- `V2OriginalOrderConfirmation`：复用原版短信确认页布局。
- `bmccActivityOrder` 服务：保存服务端会话、校验阶段、限制账号访问并代理 BMCC 本地服务。

### 6.2 BMCC 本地服务

- 登录会话持有 Cookie、access token、WAF token、门户加密 key 和重放版本。
- `custom-orders/submit` 首次调用统一提交接口；服务端返回需要短信时保存短期订单上下文。
- `custom-orders/:id/sms/send` 使用响应中的短信类型和动态 productKey 发送短信。
- `custom-orders/:id/sms/verify` 校验验证码后只执行一次最终提交。
- `custom-orders/fly-card-usage` 使用同一登录 Cookie 查询旧 JSP 的上月用量接口；失败时返回可降级状态。

## 7. 权限、安全与结果语义

- 非管理员必须具有 `businessOrder` 权限。
- public 页面只能使用跳转账号对应的手机号；请求端再次校验账号归属，不能仅依赖前端选择框。
- 登录缓存按账号或手机号哈希保存，使用前在线校验；过期后才要求重新登录。
- 不把手机号、Cookie、access token、WAF token、productKey、验证码或 Struts token返回到浏览器。
- 所有成功、失败和不确定结果使用消息组件展示。
- 提交中断后标记“结果待确认”，不会自动重试真实订购。
- 参数修改会销毁旧短信上下文，防止验证码与产品配置错配。

## 8. 验收边界

自动化与浏览器验收不得发送真实登录短信、订购短信或真实订单。已覆盖的无副作用验证包括：

- 内置配置解析及统一提交字段转换
- AI豆 6/8 位验证码规则和飞享卡 6 位规则
- 登录缓存与账号访问控制
- 两个独立入口、原版产品页面和短信确认页面渲染
- 飞享卡用量接口路由及失败降级
- TypeScript 检查、API/UI 单测、BMCC 服务单测和生产构建

真实号码是否符合资格、产品是否仍在售、短信类型和最终办理结果必须在用户明确操作时由北京移动接口实时返回。

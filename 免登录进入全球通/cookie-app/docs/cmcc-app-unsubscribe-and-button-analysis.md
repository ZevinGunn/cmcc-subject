# CMCC App / H5 退订协议与按钮展示分析

## 证据范围与结论

依据用户提供的 `cmccjs.har`、`cmccclient.har`，抓包时间为 2026-10-12。文中 entry 编号为从 0 开始的 HAR 数组索引；源码偏移为解码后 JS 字符串的 UTF-16 字符偏移，不能跨文件版本使用。

App 原生抓包使用 `clientaccess.10086.cn`、`x-qen: 2`；存档 BasicService 的 H5 SDK 生成 `app.10086.cn`、`x-qen: 17`，提交路由为 `BH/unifyCancelServiceh5/getUnifyCancel`。**SDK 的路由表不能证明项目现有 Cookie 会话可使用协议 17**。官方包装层还受 App 环境及远端 `CMCC_BaseH5Module_Switch` 等开关影响，不能把所有网页接口统一认定为 17。

### 2026-10-12 真实账号回归核查

用户授权账号的用户信息和基础功能已订业务查询均返回 HTTP 200、`retCode=000000`。对同一有效会话、同一 5G 优享服务实例：

| 操作 | 请求协议 | HTTP / 响应协议 | 业务结果 |
| --- | --- | --- | --- |
| `getUnifyQuery` 状态查询 | 17（上轮适配器） | 403 | 拒绝 |
| `getUnifyQuery` 状态查询 | 1（原链路） | 200 / `x-pen: 1` | `000000`，Success |
| `getSmsCode` 退订验证码 | 1（原链路） | 200 / `x-pen: 1` | `000000`，SUCCESS |

第一轮只向该账号发送了一次 5G 优享服务退订验证码，没有提交真实退订。证据确认状态查询/SMS 不应跟随提交适配器统一升级，现已恢复其协议 1，包括对应 AES、签名和原 envelope 的 `lk`。这修正了上轮改动导致的验证码兼容性回归；不能据此推断真实退订提交已经恢复。

### 2026-10-12 第二轮：授权真实退订测试

用户随后明确授权真实退订该业务，并提供新发送的业务验证码。本轮短信由已恢复的项目 `sendUnsubscribeSms` 方法发送，HTTP 200、`retCode=000000`。发送前缓存会话返回 `410000`（空闲超时），经过项目既有 10086 → CMCC 置换后，用户信息、基础功能列表和退订状态查询全部成功，排除了使用已过期会话直接提交的情况。更新后的 CMCC Cookie 按项目既有方式加密保存。

业务类型 `01`，使用列表返回的真实 `productCode/instanceId`，最终失效方式 `busiReturnEffTime=0`（下月），短信 `effectiveType=2`。验证码、Cookie、签名和业务实例值不记录到本文。

以下为逐项人工诊断，不是生产自动重试。每次失败后均重新查询业务实例；只有明确拒绝且查询仍生效时才开展下一项对照。没有并发提交、没有换业务或修改失效方式。

| 提交入口 | 路径 | 请求协议 | 实际结果 |
| --- | --- | --- | --- |
| `app.10086.cn` | `BH/unifyCancelServiceh5/getUnifyCancel` | 17，现有项目适配器 | HTTP 403、HTML Forbidden |
| `app.10086.cn` | 同上 | 1 | HTTP 403、HTML Forbidden |
| `app.10086.cn` | `BH/unifyCancelService/getUnifyCancel` | 1 | HTTP 403、HTML Forbidden |
| `clientaccess.10086.cn` | `BH/unifyCancelService/getUnifyCancel` | 1 | HTTP 403、HTML Forbidden |

在最后一项之前，同账号现有会话使用 `clientaccess.10086.cn/BH/unifyQueryService/getUnifyQuery`、协议 1，得到 HTTP 200、`x-pen=1`、`retCode=000000`。因此不能把“只读接口接受协议 1”推断成“提交接口也接受协议 1”，也不能认为仅换成原生域名即可修复退订。

四次提交后的查询均找到相同业务实例，`busiState=4`、`expireDate=生效`、`cancelFlag=1`、`unsubscribeFlag=1`，未查到退订受理结果。**本轮未完成真实退订，不能宣称退订成功或 403 已解决。** 服务端返回的是 HTTP 403 HTML，而非可解密的 `312008/312009` 验证码错误或缺参业务响应，故没有证据把原因归结为验证码输入错误、某个产品编码缺失或本站权限校验。

可确认的失败范围是移动侧退订提交入口对当前请求拒绝；具体是网关配置、协议要求、App 会话限定、风控策略或其他认证检查，通用 HTML 不提供区分依据。与原生抓包相比，仍缺协议 2 的请求密文/`xs/x-token` 生成及响应解密实现、与其匹配的 App `userInfo/token` 上下文。已有协议 1 的参数或网页 Cookie 不能凭空生成这些信息。下一步所需资料是可调试的原生安全模块/bridge，或者该接口加密前的完整请求、签名生成过程及解密后响应（包括失败详情）；若官方 H5 入口也能成功，则需要同会话下的完整成功 H5 链路作为对照。不能只修改 `x-qen` 数字、照抄历史签名或伪造设备字段。

本轮未将临时诊断中的协议/域名切换加入生产代码，生产仍保留已实测成功的状态查询和短信修复。之前的 H5 17 提交适配器已被实测拒绝，属于尚未修复的已知问题。

这构成可确认的协议及路径差异，但不能仅凭 HTTP 403 就认定接口已全面封禁。403 也可能来自会话、网关、签名版本、业务资格或风控。新 HAR 内相关请求 HTTP 200，而业务响应尚未解出，因此不能把这份抓包视为“退订业务成功”的证明。

自动化测试使用合成数据和模拟 HTTPS；上述回归核查使用用户明确授权的项目账号会话，不使用 HAR 中的历史验证码或凭证，不把 H5 Cookie 冒充 App 登录态。

## 源码定位

| JS 文件 | cmccjs.har entry | 作用与搜索关键字 |
| --- | --- | --- |
| `main_businessQuery.8f0416b6.js` | 51 | 页面组件、按钮计算、退订确认；搜索 `busiCancelShow()`、`fitCancelParam()`、`buttonSectionConfig()`、`confirmCancel()` |
| `chunk-common.83875410.js` | 44 | API 包装、环境分支；webpack 模块 `21722`、`72671`；时间含义在 `54229` |
| `CMCCService_module_lite.1.1.16.js` | 46 | SDK、缓存、H5 透传；搜索 `getUnifyCancel`、`BasicService_H5module` |
| `cmcc-v1.0.22.js` | 47 | `cmcc.serviceModule` JS bridge；需要 App 的原生实现 |
| `BasicService_H5module.js` | 48 | H5 路由表、公共入参、请求加密、签名、响应解密 |

官方页面脚本 URL：`https://app.online-cmcc.cn/cmcc-service/app-pages-cdn/js/main_businessQuery.8f0416b6.js`。路由仍称 businessQuery，但同一文件包含 zenith / vista / horizon 三种页面实现，不能只改第一处判断。

## HAR 中的原生接口

| entry | 域名 | 路径 | x-qen / x-pen |
| --- | --- | --- | --- |
| 148 | `client.app.coc.10086.cn` | `/biz-orange/LN/uamstatelogin/login` | 14 / 14 |
| 149 | 同上 | `/biz-orange/LN/uamrandcode/sendMsgLoginNew` | 14 / 14 |
| 153 | 同上 | `/biz-orange/LN/uamthreenetworklogin/login` | 14 / 14 |
| 235、369、481 | `clientaccess.10086.cn` | `/biz-orange/BH/accoutQry/getAccoutInfo` | 2 / 2 |
| 541 | 同上 | `/biz-orange/BN/queryBuinessService/getNewQueryBusiness` | 2 / 2 |
| 628 | 同上 | `/biz-orange/BH/unifyQueryService/getUnifyQuery` | 2 / 2 |
| 633 | 同上 | `/biz-orange/BH/sms/getSmsCode` | 2 / 2 |
| 646 | 同上 | `/biz-orange/BH/unifyCancelService/getUnifyCancel` | 2 / 2 |

原生头包括 `Content-Type: application/Json`、`User-Agent: ChinaMobile/12.5.5 (iPad; iOS 18.7; Scale/2.00)`、Cookie、`xs`、`x-time`、`x-nonce`、`x-token`、`x-sign`。浏览器 Origin/Referer 不存在。原生请求体和响应体均为密文，不能照抄抓包签名或只修改 `x-qen`。

## 本次使用的 H5 请求流程

1. 保持项目原有登录/10086 到 CMCC 会话置换，取得对应手机号的有效 CMCC 会话。
2. `getUnifyQuery` 查询关联及退订状态。
3. `getSmsCode` 发送该业务、该失效方式的退订验证码；上游确认成功后才开始 60 秒冷却。
4. 用户输入验证码，`getUnifyCancel` 只提交一次。
5. 只把解密结果的 `retCode === "000000"` 判断为成功，随后查询状态核对。网络失败、解密失败、缺少结果码均不自动跨域重试。

H5 请求全部 POST 到 `https://app.10086.cn/biz-orange/`：

| 操作 | 路径 | 当前协议 / 验证边界 |
| --- | --- | --- |
| 状态查询 | `BH/unifyQueryService/getUnifyQuery` | 1，授权账号实测成功 |
| 验证码 | `BH/sms/getSmsCode` | 1，授权账号实测成功 |
| 退订提交 | `BH/unifyCancelServiceh5/getUnifyCancel` | 17，第二轮真实提交 HTTP 403，受理未成功 |

共同头为网页 UA、CMCC Cookie、`Origin: https://wx.10086.cn`、businessQuery 页面 Referer、`Content-Type: application/x-www-form-urlencoded`。状态查询/SMS 使用原协议 1 的 AES 加密和 `Accept: application/json, text/plain, */*`；提交适配器使用 SDK 17 和 `Accept: application/json`。body 均为加密字符串，不能转成普通表单字段。

公共 envelope 包含 `ak/cid/en/t/sn/cv/st/sv/sp/xk/xc/imei/nt/sb/prov/city/tel/reqBody/pageURI`。状态查询/SMS 保留原链路 `lk`；以下 SDK 行为仅适用于提交适配器：普通浏览器分支生成并使用请求 `xk`，`lk` 只有加载 SDK 的 URL 含有该参数时才加入。

`x-time` 为毫秒时间戳，`x-nonce` 为 8 位随机数；安全模块生成 `xs`、`x-token` 和加密 body。外层签名可读部分为：

```js
xSign = MD5(xToken + "_" + xTime + "_" + xNonce + "_" + JSESSIONID)
```

无会话时最后一项使用字符串 `null`。请求分支普通为 `17`，灰度脚本路径为 `18`。响应通过 `x-pen` 标识加密版本；`17` 必须由对应官方模块解密，不能继续套用项目原先的响应 AES key。当前适配器只支持正式 H5 17，未知加密版本拒绝当作成功。

本地固定官方 SDK 在 `api/vendor/cmcc/BasicService_H5module.js`，来源为 cmccjs.har entry 48 的公共 JS 响应，未包含请求、Cookie 或账号凭证。文件 SHA-256：`2b3b008f515b739a71a74addee6fa072f615b744cfffe56bc912f38e8c91079a`。适配器 `api/services/cmccBusinessH5.ts` 校验指纹，在独立 VM 内运行；XHR 仅收集请求和离线解码，不具备网络能力，不提供 require/process，不执行响应携带的代码。各请求创建独立上下文，避免混用不同账号会话。实际 HTTPS 仍统一交由项目的 HTTP 服务完成。

固定官方模块的原因是新版安全核心为 VM 混淆实现；复用存档模块避免猜测加密参数，但离线生成请求不等于上游接受请求。更新该模块时需要重新校验源码来源、更新指纹并运行协议回归测试，不能自动从公网下载执行。

## 退订参数

### 状态查询 reqBody

`cellNum` 为目标手机号，`bindedFlag` 取业务值（项目缺省 `2`），`instanceId` 取业务实例编号。

### 验证码 reqBody

| 参数 | 来源/用途 |
| --- | --- |
| `cellNum` | 当前会话手机号 |
| `busType` | 普通退订为 `1`，主套餐撤销为另一流程 |
| `productName` | 业务名；关联业务追加 `bindedBusiName`（兼容旧 `bunessName`） |
| `productType` | 主视图 `codeType`；省端视图 `bunessType` |
| `productId` | 主视图 `productCode`；省端视图 `bunessCode` |
| `spid` | 主视图 `sPCode`；省端视图 `spid` |
| `bizCode` | 业务编码，不能在同时有 offerId 时无条件覆盖为 offerId |
| `effectiveType` | 验证码专用失效类型；与最终提交值映射不同，见下表 |

### 退订提交 reqBody

`cellNum/productType/productId/spid/bizCode` 同上，另包含：

| 参数 | 来源/用途 |
| --- | --- |
| `smsCode` | 用户收到的 6 位业务退订验证码 |
| `busiReturnEffTime` | 真正的失效方式，不应把选择标记 `2` 直接作为选项提交 |
| `instanceId` | 被退订业务实例；不可随意用产品编码代替 |
| `businessName` | 官方主视图传入业务名；省端提交示例不带此字段 |
| `busiID/busiValue` | 项目已有固话/宽带账号标识，仅相应调用上下文使用 |
| `planId/offerId` | 兼容项目已有业务数据和有权限的手动覆盖；不是此次普通退订前端示例的统一必填项 |

本次在发验证码/提交前检查手机号和产品类型，`01` 缺少产品编码、`02` 缺少服务商或业务编码时明确告知缺项，不发送空参数请求。自定义 ID 权限及退订权限仍由原有后端校验。

### 失效方式

| 业务 `busiReturnEffTime` | 最终提交 | 验证码 `effectiveType` | 含义 |
| --- | --- | --- | --- |
| `0` | `0` | `2` | 下月失效 |
| `1` | `1` | `1` | 立即失效 |
| `3` | `3` | `5` | 次日失效 |
| `2` | 用户选择的 `0/1/3` | 按上面对应映射 | 可选择失效方式；主视图按 `effTimeType.split("|")` 提供选项 |
| 未提供 | 空字符串 | `3` | 具体失效时间以短信为准 |

省端 NY/BK 没有 `effTimeType` 的选择模式，官方提供 `1`（立即）和 `0`（下月），缺省立即。项目新增相应选项，并在验证码发送成功后锁定所选值，重开弹窗保持该值，确保验证码和最终请求一致。数字 `0` 不得通过 `||` 当成空值丢掉。

### 结果处理

解密后一般是 `{retCode, retDesc, rspBody}`。`000000` 为成功；`312008` 为验证码校验失败，`312009` 为验证码与当前业务不符。官方可给出 `errorMsg` 作为提示，其他失败按 `retDesc/retCode` 展示。

官方还对 `900000` 显示处理/受理尚待确认提示，对 `910000/999999` 显示失败；不能因为 HTTP 200 或存在 rspBody 就认定成功。HTML 403 继续提取错误标题/正文，移除源码、脚本、样式。解密失败显示“结果尚未确认，请先刷新已订业务核对状态”，不泄露密文及内部堆栈。

## 退订按钮展示的关键逻辑

### 主视图 zenith

在 `main_businessQuery.8f0416b6.js` 偏移约 **40942**，搜索 `busiCancelShow(){let{cancelFlag`：

```js
busiCancelShow() {
  const { cancelFlag, unsubscribeFlag, busiState, contractFlag } = this.info;
  return !this.majorType
    && this.isCurrentMonth
    && cancelFlag === "0"
    && !["0", "2"].includes(unsubscribeFlag)
    && busiState !== "3"
    && contractFlag !== "0"
    && this.fitCancelParam
    && (this.isTouch || this.pullingTypeLocation.includes("4"));
}
```

`fitCancelParam` 要求有 `codeType`；`01` 必须有 `productCode`；`02` 必须同时有 `bizCode` 和 `sPCode`。`majorType` 是当前主套餐/家庭套餐标签计算值；`isTouch` 是 App 环境分支，不是“支持触摸屏”。

紧接着的 `buttonSectionConfig()` **还有外层 `if (this.isCurrentMonth)`**，并通过以下代码将退订动作放进按钮数组：

```js
if (this.busiCancelShow) buttons.push({ name: "退订", type: "cancel" });
```

因此只把 `unsubscribeFlag` 改成 `1`，或只设置 `cancelFlag = "0"`，都不足以保证按钮出现。

### 省端 vista（NY）

同一文件偏移约 **153356**，另一处 `busiCancelShow()`：

```js
return majorType !== "1"
  && busiCancelFlag === "1"
  && !["0", "2"].includes(unsubscribeFlag)
  && contractExist !== "1"
  && !expired
  && this.fitCancelParam
  && (this.isTouch || this.pullingCancleBtnShow);
```

此处参数使用 `bunessType/bunessCode/spid/bizCode`。省端 `fitCancelParam` 的 `02` 条件较主视图宽松，只在 spid、bizCode 都缺少时隐藏，不代表后端实际受理时可缺少任意一项。

### 另一省端 horizon（BK）

同一文件偏移约 **167282**：

```js
return mainPlan !== "1"
  && showType === "1"
  && unsubscribeFlag !== "0"
  && this.fitCancelParam
  && (this.isTouch || this.pullingTypeLocation.includes("4"));
```

同样需要生成 `{name:"退订", type:"cancel"}` 按钮。

### 如何强制展示所有业务的按钮

对官方页面做本地展示实验，需在**实际使用的各个组件**把 `busiCancelShow()` 改为 `return true`；主视图还必须取消 `buttonSectionConfig()` 外层月份拦截，让它始终加入 `cancel` 动作。若要让折叠状态下也直接看见按钮，还需检查 `buttonSectionData`、`buttonSectionABSortRulesData`、`foldByIndex`、`isFoldProvince` 的折叠/排序渲染条件。强制在按钮数组中保留 cancel 并在可见按钮区渲染，才能避免它只出现在展开区。

只改接口响应中的单个标记不能保证所有页面分支都展示。更直接的展示实验是在三个业务组件的 `buttonSectionConfig()` 中统一返回包含 `{name:"退订",type:"cancel"}` 的列表，并让可见模板直接渲染该动作；这仅改变页面显示。主套餐撤销、合约退订分别有其他接口，普通退订参数缺失、验证码不匹配、合约限制和服务器资格检查仍可能拒绝。

本项目自己的展示逻辑在 `src/pages/BusinessQueryAdmin.tsx` 的 `canUnsubscribe()` 和 JSX 条件 `canManageBusiness && (unsubscribable || withdrawable)`。这里原本已允许未失效的普通业务尝试退订，没有照搬官方全部资格标记。本次保留用户权限边界，没有因为官方按钮实验而取消权限校验或把已失效/主套餐业务全都送到普通退订接口。

## App 原生接口尚缺哪些信息

当前无法完整复现原生 `x-qen: 2` 及登录 `x-qen: 14`。这不是已证明“仅缺一个请求参数”的问题：

1. 缺少原生安全模块生成请求密文、`x-token`、`xs` 的实现/有效密钥上下文，以及 `x-pen: 2/14` 的响应解密实现。旧 H5 key 和新 H5 17 均不能直接代替。
2. 缺少原生 bridge 返回的完整、有效 `userInfo`/App 会话以及公共 envelope 的实际字段取值。JS 中可见 `token/sn/version/st/sv/sp/channel/imei/nt` 等字段名称，但原生密文尚未解出，不能断言这些字段在该次请求中哪些必填、各值是什么。
3. 原生请求尚未取得与协议 2/14 匹配的可控测试会话，无法验证服务端真实受理。此次授权账号已验证协议 1 状态查询/短信，并授权提交退订，但现有 H5/协议 1 提交均返回 403；不能把它当作原生协议 2 的成功复现。抓包里的签名、验证码和历史 Cookie 有时效及请求绑定关系，不能当作长期配置。

官方确认操作还异步调用 `getRiskLevel()` 获取 `devToken`，再上报 `unSubscribeRiskControl`；源码是在独立 Promise 中执行，未等待其成功再发退订。因此不能凭源码就把 devToken 认定为普通退订请求必填字段，也不能编造或复用它。

要继续原生协议，需要原生端安全模块/可调试 bridge 或能展示加密前入参、签名过程和解密后响应的抓包辅助记录，以及匹配的 App 会话。现已实测本项目 H5 17 提交被拒绝；一份官方入口成功的 H5 `getUnifyQuery → getSmsCode → getUnifyCancel` 对照抓包可帮助进一步缩小原因，不能继续以离线模拟成功承诺 403 已消失。

## 验证范围

`api/tests/cmcc-business-unit.ts` 验证官方模块初始化及指纹、17 请求头/签名、会话隔离、业务参数别名、失效时间映射、缺参不请求、清晰业务码判定、未知/损坏加密响应、Cookie 更新、403 不跨网关重试。另单独锁定状态查询/SMS 的协议 1，解密请求检查 envelope、业务参数和签名，并模拟 `x-pen: 1` 加密响应防止被统一升级。自动化 HTTPS 均为假传输；真实状态/SMS 结果见上方核查表。

手机/桌面浏览器以模拟 API 验证选项、提示文案、验证码后锁定、发送和提交参数一致及响应结果展示。没有真实上游 17 成功响应样例，因此加密响应成功解码的依据是复用存档官方解码器，尚未由真实成功样例独立验证。线上发布健康检查只能证明版本和资源更新，不证明移动侧真实退订成功。

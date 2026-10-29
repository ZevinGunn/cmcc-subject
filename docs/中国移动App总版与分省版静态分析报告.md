# 中国移动 App 总版与分省版静态分析报告

> 分析日期：2026-07-24  
> 样本目录：`/Users/ZevinGunn/Library/Mobile Documents/com~apple~Automator/Documents/中国移动/`  
> 分析方式：IPA 包结构、Info.plist、Mach-O Load Command、Objective-C/Swift 元数据、代码签名 Entitlements、字符串和导入符号静态分析

## 1. 结论摘要

总版和分省版不是“只改版本、名称和 Bundle ID 的同一个包”。当前样本至少在以下层面存在差异：

1. **渠道身份**：分省版 `Info.plist` 有独立 `ChannelCode`，总版没有；App Store 数字 ID、构建号也分别独立。
2. **签名身份**：每省使用不同 Apple Team ID、`application-identifier`、APNs 身份、Associated Domains，部分省份还有 Wallet Pass 能力。总版另有 App Group、App Clip、Siri、银联商户、蜂窝套餐等能力。
3. **业务配置**：`meta.config` 内再次写入 Bundle ID；`.conf.ibcx` 每个包均不同；这两项不是修改外层 `Info.plist` 就会自动同步的。
4. **第三方平台身份**：微信、QQ、微博、支付宝、和包、银联等 URL Scheme 按省独立。
5. **可执行代码**：13 个分省主程序 UUID、SHA-256、大小均不同。它们来自同一代码基线，但属于分别构建/链接/签名的产物，不是一个二进制直接套不同壳。
6. **资源**：每个包的 `Assets.car` 均不同。甘肃包尤其特殊，额外携带 16 个 Swift 兼容动态库，`Assets.car` 约 47.6 MB，远大于其他分省包的约 6.3 MB。
7. **扩展和组件**：总版 12.1.3 有 7 个 App Extension；分省版 12.0.5 均没有。总版还替换了部分媒体、会议、支付相关 Framework。
8. **完整性与环境检测**：所有样本含 provision、Bundle ID、越狱和 App Store receipt 相关检查；总版 12.1.3 还出现可配置的重签名、注入检测字段。

因此，**把砸壳后的主程序放进另一个包、只改为分省 BID 再签名，即使能够安装，也无法得到原版的完整行为**。变化的不只是字符串，而是 Apple 签名身份、受限能力、服务端注册、第三方 SDK 身份、资源、内置配置和运行时完整性判断组成的一条身份链。

## 2. 样本边界与重要限制

目录中没有 Xcode 工程或原始源代码，只有 14 个 IPA 和 15 个独立 Mach-O。因此本报告属于**代码级静态逆向分析**，不是对原始 Objective-C/Swift 源文件的审计。

当前总版为 12.1.3，分省版为 12.0.5。总版与分省版之间的差异同时混有“发行模式差异”和“版本迭代差异”，不能把所有 12.1.3 新增项都归因于总/分省模式。13 个分省版版本一致，适合横向比较。

所有 IPA 内主程序的 `cryptid` 为 0。独立 `ChinaMobile 2` 至 `ChinaMobile 14` 与对应分省 IPA 内主程序逐字节 SHA-256 一致。无单独命名的总版 dump；但总版 IPA 内主程序本身也是 `cryptid=0`，可直接静态分析。

本报告能确认“存在并可能参与业务路径”的校验能力。某一校验是否在每次启动执行、具体阻断点是什么，仍需结合失败设备的控制台日志、网络抓包和调用栈动态确认。

## 3. 身份链：为什么只改 BID 不够

```text
Info.plist.CFBundleIdentifier
        |
        +--> meta.config.bundleId / .conf.ibcx / ChannelCode
        |
        +--> CodeDirectory Identifier + application-identifier
        |       +--> Team ID / Keychain access group / APNs topic
        |
        +--> Provisioning Profile Entitlements
        |       +--> Associated Domains / App Groups / Wallet / Siri / Merchant ID
        |
        +--> 微信、QQ、微博、支付 URL Scheme 与平台后台注册
        |
        +--> SDK License / App Store Receipt / 服务端白名单与签名参数
        |
        +--> 运行时 provision、重签、注入、越狱检查
```

这条链上任一环仍指向原 Bundle ID、原 Team 或原渠道，应用就可能表现为降级、登录失败、业务页异常、支付/分享回跳失败、推送失效，或者被安全模块判定为非原版环境。

## 4. 已确认的差异

### 4.1 渠道、应用和构建身份

分省版带有明确的 `ChannelCode`：

| 省份 | ChannelCode | Bundle ID | App Store ID |
|---|---:|---|---:|
| 北京 | B2002 | `com.chinamobile.bj.sc.bjservice` | 438391307 |
| 福建 | B2003 | `com.cmcc.llms` | 913082644 |
| 广东 | B2004 | `com.gdmobile.gmcchh` | 462125072 |
| 甘肃 | B2005 | `com.cmcc.gs` | 1295463910 |
| 江西 | B2006 | `com.appstore.WoxinPro` | 1065421915 |
| 安徽 | B2009 | `com.wangda.zhangting` | 887345990 |
| 广西 | B2010 | `com.gxcmcc.shoujiyingyeting` | 990871348 |
| 重庆 | B2011 | `com.CMCC.CMClient` | 847285955 |
| 江苏 | B2012 | `com.jsmcc.ZP7267A6ES` | 446332125 |
| 山东 | B2013 | `cn.10086.shandongmcc` | 1013744704 |
| 河南 | B2014 | `cn.10086.zsyyt` | 458828858 |
| 浙江 | B2015 | `com.zhejiangcmcc.sjyyt.zjcmcc` | 898243566 |
| 河北 | B2016 | `com.hebeiMobile.ecmc` | 1324924418 |

总版是 `cn.10086.app`、App Store ID `583700738`，没有分省 `ChannelCode`。代码元数据中存在 `initWithChannelCode:provinceCode:`、`setupConfigWithChannelCode:provinceCode:`，并且登录接口形态包含 `bundleId` 和 `channelId`，说明省份身份不是单纯用于桌面名称。

13 个分省包还统一包含 `CoverageServerURL=http://172.16.169.120:3000`，总版不含该键。它是不可从公网访问的私网地址，更像分省打包流水线中的覆盖率/内部采集配置；仅凭静态键值不能证明生产运行时一定会请求它。

### 4.2 内置配置不是同一份

逐文件哈希结果：

| 文件 | 13 个分省版之间 | 总版 12.1.3 | 含义 |
|---|---|---|---|
| `ChannelConfigure.plist` | 完全一致 | 一致 | 全量渠道编码字典，不等于当前包渠道 |
| `MobileRuntime.plist` | 完全一致 | 一致 | 公共运行时配置 |
| `MobileCode.plist` | 完全一致 | 一致 | 公共代码配置 |
| `Business.plist` | 完全一致 | 不同 | 总版 12.1.3 业务配置已迭代 |
| `meta.config` | 每包不同 | 不同 | JSON 中 `bundleId` 与当前包严格对应 |
| `.conf.ibcx` | 每包不同 | 不同 | 27 字节左右的混淆配置，静态样本不足以可靠命名其字段 |
| `Assets.car` | 每包不同 | 不同 | 图标/视觉资源和可能的省份素材不同 |

`meta.config` 的 mPaaS `appId/appKey/rpcGW` 在样本中相同，但 `bundleId` 每包不同。只修改 `Info.plist` 会造成运行时 Bundle ID 与 mPaaS 配置不一致。

### 4.3 Apple 签名能力差异

所有包均使用生产 APNs，并带有公共 Universal Link 域名；每个分省包又绑定各自 Team ID 和省公司域名。举例：

| 包 | Team ID | 省级 Associated Domain | Wallet Pass |
|---|---|---|---|
| 北京 | H6E4UBY7V5 | 无额外省域名 | 无 |
| 安徽 | 33J9DC23ZU | `anhuimobile.com` | `33J9DC23ZU.*` |
| 广东 | 5Z2J3RC5ZQ | `gd.10086.cn` | 无 |
| 江苏 | G76D4JTRK4 | `wap.js.10086.cn` | 无 |
| 河南 | 96F2K6D5VG | `iosul.ha.chinamobile.com` | `96F2K6D5VG.*` |
| 浙江 | SQN84YY35D | `app.m.zj.chinamobile.com` | 无 |
| 甘肃 | 3RA5NCG332 | `gs.10086.cn` | `3RA5NCG332.*` |
| 福建 | V69Q75YL2G | `app.fmcc.com.cn` | `V69Q75YL2G.*` |
| 重庆 | L552KHMTXR | `wap.cq.10086.cn` | `L552KHMTXR.*` |

总版 Team ID 为 `U746D2ER88`，除公共能力外还有：

- `com.apple.developer.associated-appclip-app-identifiers`
- `com.apple.developer.payment-pass-provisioning`
- `com.apple.CommCenter.fine-grained = public-cellular-plan`
- `com.apple.developer.siri`
- 3 个银联 Merchant ID
- 3 个 App Group
- App Clip Associated Domains

普通重签证书不能复制不属于该 Team 的 App Group、Merchant ID、APNs topic、Associated Domains 和受 Apple 审批的私有能力。强行把原 Entitlements 填进新签名，不代表系统会授予这些能力；Provisioning Profile 不包含时通常会安装失败或能力不可用。

### 4.4 三方平台回调身份不同

每个分省包有不同的微信 App ID、QQ App ID/Scheme，以及按省命名的和包、银联、支付宝 Scheme。例如北京为：

- 微信：`wxa48f0b9e1ed8f680`
- QQ：`tencent1102963885`
- 和包：`www.beijing.HeBaopay`
- 支付宝：`www.beijing.Alipay`、`beijing.yn.alipay`、`beijing.yn.newpay`

总版对应值为 `wxba9074d7f4eeae4e`、`QQ06022AD7`、`www.leadeon.HeBaopay`、`www.leadeon.Alipay`。这些标识还需要在微信、QQ、支付平台后台绑定 Bundle ID/Universal Link。仅在 plist 中抄 Scheme 不能复制后台授权。

### 4.5 主程序并非同一个二进制

13 个分省主程序的未定义导入符号数均为 4,973，方法样式字符串计数均为 2,604，说明它们高度可能来自同一 12.0.5 代码基线。但是：

- 每个主程序 LC_UUID 不同；
- 每个主程序 SHA-256 不同；
- `__TEXT` 段约 146.1 MB 至 146.4 MB，存在小幅差异；
- 签名内 Identifier、Team ID、CDHash 不同；
- 文件大小约 213.27 MB 至 213.54 MB。

结论是“同源、分别产出”，不是“一个主程序加 13 份 Info.plist”。

### 4.6 总版的扩展和 Framework 差异

总版 12.1.3 包含 7 个扩展：

1. Siri Intents Service
2. 通知内容扩展
3. 通知 Service 扩展
4. Today Widget
5. WidgetKit 扩展
6. 屏幕共享 Broadcast Upload
7. 屏幕共享 Setup UI

分省 12.0.5 包均不含扩展。总版相对普通分省包新增 `CMMediaSDK.framework`、`HWMMRMedia.framework`、`HWMUISDK.framework`，不再携带 `ECMediaSDK.framework`、`MGProxy.framework`、`SuperPaySDK.framework`。这部分至少有一部分属于 12.1.3 的版本演进。

### 4.7 完整性、重签和运行环境检查

所有已解密主程序均包含以下可复核证据：

- `embedded.mobileprovision`、`ProvisionedDevices`、`ProvisionsAllDevices`、`get-task-allow`
- `SignerIdentity`、`_CodeSignature`
- `The expected hash value of Mobile Provision file was`
- `The expected bundle identify was`
- `SecureUtilityPlus.JailbreakChecker`
- `hasAppStoreReceipt`、`isAppStoreReceiptSandbox`、`hasEmbeddedMobileProvision`
- `license parse bundle_id failed`、`license check bundle_id failed`
- `headersForKeyVerificationWithParams:bundleID:`
- `restSignatureWithParams:bundleID:`
- `createSCodeStringWithParams:timestamp:bundleID:`

总版 12.1.3 额外出现：

- `isAJMReCodeSignTag` / `reCodeSignTag`
- `iOSCheckCodeSign` / `iOSBlockCodeSignAttack`
- `iOSCheckInjection` / `iOSBlockInjectionAttack`
- `checkCodeSignWithProvisionID:`

这些证据说明 App/SDK 确实有能力把 Bundle ID、provision、receipt、签名或注入状态纳入判断。静态分析不能证明每一项都在主启动路径强制阻断，但重签后触发部分业务的风险是实质性的。

### 4.8 从代码元数据重建的身份初始化逻辑

下面是依据可见方法名、配置键和请求格式整理的等价逻辑，不是从原工程复制的源代码：

```objc
NSString *runtimeBID = NSBundle.mainBundle.bundleIdentifier;
NSString *channel = InfoPlist[@"ChannelCode"];       // 总版为空，分省版为 B20xx
NSDictionary *mpaas = LoadJSON(@"meta.config");

SetupConfig(channel, provinceCode);

BOOL identityConsistent = [runtimeBID isEqual:mpaas[@"bundleId"]];
BOOL environmentAccepted = CheckProvisionAndReceipt();
BOOL sdkLicensesAccepted = VerifyLicensesForBundleID(runtimeBID);

RequestContext *context = BuildRequestContext();
context.bundleId = runtimeBID;
context.channelId = channel;
context.headers = SignHeaders(context.params, runtimeBID);

// 部分版本/SDK还可根据下发开关执行：
// CheckCodeSign / BlockCodeSignAttack / CheckInjection / BlockInjectionAttack
```

从这个逻辑可以看出，改 `Info.plist` 只改变 `runtimeBID`，反而会立刻让它与 `meta.config`、SDK License、签名身份或服务端注册中的至少一项产生不一致。

## 5. “改分省 BID 重签后无法实现原版效果”的原因排序

### 5.1 必然发生的变化

1. **Team ID 与 application-identifier 改变**：新证书无法伪装成省公司原 Team。
2. **Keychain namespace 改变**：原登录态、设备标识和 SDK Token 通常无法延续。
3. **APNs topic 改变**：推送 Token 与原 App ID 不再等价。
4. **App Store receipt 环境改变**：侧载包没有原 App Store 收据，或收据身份不匹配。
5. **受限 Entitlements 丢失**：App Group、Wallet、Merchant、Siri、App Clip、蜂窝套餐等能力不能凭改 BID 获得。

### 5.2 当前样本中直接可见的配置不一致

1. `Info.plist.CFBundleIdentifier`
2. `meta.config.bundleId`
3. `.conf.ibcx`
4. `ChannelCode`
5. App Store 数字 `AppID`
6. 微信/QQ/微博/支付 URL Scheme
7. Associated Domains
8. `Assets.car`
9. 可执行文件内原始签名标识及可能的硬编码/SDK License

### 5.3 可能表现为“部分功能不对”而不是闪退

| 现象 | 最可能的层面 |
|---|---|
| 安装失败 | Entitlements 与 profile 不匹配；扩展未逐个重签；嵌套 Framework 签名错误 |
| 能启动但登录/免密登录失败 | Keychain、Bundle ID/channelId 入参、设备风控、服务端白名单 |
| 首页或省份内容不对 | `ChannelCode`、省份配置、缓存/远程配置、服务端按渠道下发 |
| 微信/QQ 分享或登录不能回跳 | Scheme、Universal Link、三方后台 Bundle ID 绑定 |
| 支付拉起后不能回跳 | Merchant/支付 SDK 身份、Scheme、服务端订单签名 |
| 推送收不到 | APNs entitlement、Team/App ID、通知扩展、服务端证书 |
| Widget/屏幕共享/Siri 不工作 | 扩展 Bundle ID、App Group、对应 Entitlements 缺失 |
| 特定 SDK 功能失败 | License 绑定 Bundle ID、签名/provision 哈希、注入/越狱检测 |

所以“无法实现原版效果”通常不是单一 BID 校验导致，而是多层身份同时失配。

## 6. 正确的工程化复现条件

若这是中国移动内部或已获授权的构建工作，达到原版等价行为至少需要：

1. 原始 Xcode 工程和 12.0.5/12.1.3 对应源码分支；
2. 每省独立的 Build Configuration，包括 Bundle ID、`ChannelCode`、App Store ID 和资源；
3. 每省 Apple Developer Team 下合法的证书、App ID 和 Provisioning Profile；
4. 与各 Team 匹配的 APNs、Associated Domains、Wallet、App Group、Merchant、Siri 等能力；
5. 微信、QQ、微博、银联、支付宝等平台的正式应用配置和后台绑定；
6. 与 Bundle ID 对应的 SDK License、`meta.config` 和安全配置；
7. 服务端为每个 `bundleId + channelId + appVersion` 注册的白名单、密钥和风控策略；
8. 对主 App、所有 App Extension、Framework、dylib 完整重签并进行真机回归。

砸壳主程序适合做静态研究、符号恢复和行为定位，不是可替代官方构建链的发布产物。本报告不建议通过修改安全校验来追求“原版效果”；那会绕过症状而不能补回 Apple 和第三方平台授予的身份能力。

## 7. 后续动态确认清单

若要定位当前重签包的首个实际失败点，应补充以下材料：

1. 安装日志或 `ideviceinstaller`/Xcode Devices 错误；
2. 首次启动到出现异常之间的系统 Console 日志；
3. 原版与重签版同一操作的网络 HAR/代理抓包，重点比较请求头中的 bundle、channel、appId、签名字段；
4. 重签后最终生效的 Entitlements 和 Provisioning Profile，而不是打包前的配置文件；
5. 明确“原版效果”具体指启动、登录、首页、支付、推送、分享还是 Widget。

有这些材料后，才能把当前的多原因结论收敛到具体函数、接口和错误码。

# 中国移动 App 样本与包体说明

## 1. 样本概览

样本目录包含：

- 1 个总版 IPA：12.1.3
- 13 个分省 IPA：12.0.5
- 15 个独立 arm64 Mach-O 主程序

所有 IPA 内主程序均为 `cryptid=0`。15 个独立 Mach-O 中有两个完全相同的北京版本，因此独立文件实际覆盖 13 个分省主程序，没有额外的总版副本。

## 2. 独立 Mach-O 与 IPA 映射

| 独立文件 | 对应 IPA | SHA-256 关系 | 备注 |
|---|---|---|---|
| `ChinaMobile` | 中国移动北京-12.0.5.ipa | 完全一致 | 与 `ChinaMobile 2` 重复 |
| `ChinaMobile 2` | 中国移动北京-12.0.5.ipa | 完全一致 | 北京 |
| `ChinaMobile 3` | 中国移动安徽-12.0.5.ipa | 完全一致 | 安徽 |
| `ChinaMobile 4` | 中国移动山东-12.0.5.ipa | 完全一致 | 山东 |
| `ChinaMobile 5` | 中国移动广东-12.0.5.ipa | 完全一致 | 广东 |
| `ChinaMobile 6` | 中国移动广西-12.0.5.ipa | 完全一致 | 广西 |
| `ChinaMobile 7` | 中国移动江苏-12.0.5.ipa | 完全一致 | 江苏 |
| `ChinaMobile 8` | 中国移动江西-12.0.5.ipa | 完全一致 | 江西 |
| `ChinaMobile 9` | 中国移动河北-12.0.5.ipa | 完全一致 | 河北 |
| `ChinaMobile 10` | 中国移动河南-12.0.5.ipa | 完全一致 | 河南 |
| `ChinaMobile 11` | 中国移动浙江-12.0.5.ipa | 完全一致 | 浙江 |
| `ChinaMobile 12` | 中国移动甘肃-12.0.5.ipa | 完全一致 | 甘肃 |
| `ChinaMobile 13` | 中国移动福建-12.0.5.ipa | 完全一致 | 福建 |
| `ChinaMobile 14` | 中国移动重庆-12.0.5.ipa | 完全一致 | 重庆 |

## 3. 包级清单

| 包 | Bundle ID | Channel | Team ID | IPA 大小 | 条目数 | 主程序大小 | Assets.car |
|---|---|---:|---|---:|---:|---:|---:|
| 总版 12.1.3 | `cn.10086.app` | - | U746D2ER88 | 205.09 MB | 4660 | 226.77 MB | 7.39 MB |
| 北京 12.0.5 | `com.chinamobile.bj.sc.bjservice` | B2002 | H6E4UBY7V5 | 174.06 MB | 4369 | 213.30 MB | 6.30 MB |
| 安徽 12.0.5 | `com.wangda.zhangting` | B2009 | 33J9DC23ZU | 174.06 MB | 4369 | 213.29 MB | 6.31 MB |
| 山东 12.0.5 | `cn.10086.shandongmcc` | B2013 | C353C7Q7J9 | 174.06 MB | 4369 | 213.27 MB | 6.32 MB |
| 广东 12.0.5 | `com.gdmobile.gmcchh` | B2004 | 5Z2J3RC5ZQ | 174.15 MB | 4369 | 213.54 MB | 6.30 MB |
| 广西 12.0.5 | `com.gxcmcc.shoujiyingyeting` | B2010 | 76P9SLV5DE | 174.08 MB | 4369 | 213.42 MB | 6.31 MB |
| 江苏 12.0.5 | `com.jsmcc.ZP7267A6ES` | B2012 | G76D4JTRK4 | 174.14 MB | 4369 | 213.47 MB | 6.34 MB |
| 江西 12.0.5 | `com.appstore.WoxinPro` | B2006 | 82652FU479 | 174.16 MB | 4369 | 213.48 MB | 6.31 MB |
| 河北 12.0.5 | `com.hebeiMobile.ecmc` | B2016 | G8X466CYS3 | 174.09 MB | 4369 | 213.34 MB | 6.30 MB |
| 河南 12.0.5 | `cn.10086.zsyyt` | B2014 | 96F2K6D5VG | 174.08 MB | 4369 | 213.31 MB | 6.31 MB |
| 浙江 12.0.5 | `com.zhejiangcmcc.sjyyt.zjcmcc` | B2015 | SQN84YY35D | 174.16 MB | 4369 | 213.53 MB | 6.31 MB |
| 甘肃 12.0.5 | `com.cmcc.gs` | B2005 | 3RA5NCG332 | 237.47 MB | 4525 | 213.32 MB | 47.61 MB |
| 福建 12.0.5 | `com.cmcc.llms` | B2003 | V69Q75YL2G | 174.16 MB | 4368 | 213.46 MB | 6.31 MB |
| 重庆 12.0.5 | `com.CMCC.CMClient` | B2011 | L552KHMTXR | 174.11 MB | 4369 | 213.46 MB | 6.31 MB |

说明：IPA 大小是压缩包大小，主程序和 `Assets.car` 是未压缩大小，因此不能直接相加比较。

## 4. 分省主程序 SHA-256

| 省份 | SHA-256 |
|---|---|
| 北京 | `d68b03eed6254aae259f280dee3299829f2f1d0d8923a7eb5eb34d73248ca1c2` |
| 安徽 | `266a98208989cdf535b39634ae4d8ef1b002574f86e7b832abaac9cdffce4dc4` |
| 山东 | `ac34a6a4ff48fb715508653b68f38c9c0b8e33d6aeaa4eb9d066b85738ccb89d` |
| 广东 | `3abbe4ba7eb0da4714e044cfe396c697f2180ec024508ccc4188cd5a72f293fc` |
| 广西 | `cb05cc432c14837ec885c2cac396a77d8615a090f135835cac790ef2edab3922` |
| 江苏 | `29917336a928711143e647f49ecc4b9c6a97a0bf3158ffdcd149a84a20f2c177` |
| 江西 | `71c4f50322a459263c859cb34b4ce7e7aad7d398a35d2139e8f161d5e6492a7b` |
| 河北 | `07b00bb72014f6af8b9cdececcd340443a1ad04de5fc6260961935e1ac255225` |
| 河南 | `bddc7021212f7318412285540cf6ad8ab19fb15d5f2759ee9dc9b1f05d07851f` |
| 浙江 | `4413aacbb210202901d4cb9bc76af26354fc6e47dcd119fda089a16a4d3f0fb2` |
| 甘肃 | `eae6fa652bbab72f4adfe8b6735b9ebb2db6ed4607f5ffc60a6d0cf4e16c216f` |
| 福建 | `d2e6edd2019cb4738601aeb5966e517a28c702f07241ff11ed6b4cfd00b2b3f6` |
| 重庆 | `b4f3252cecfd1aabc307438b55694a9bf48c1df134af2807870bc19f438df142` |

总版 12.1.3 IPA 内主程序 SHA-256：`060c6b6f391e107c92106fa571e27aad78dfb1a06efeb24175b3b4d58fb60715`。

## 5. 总版扩展清单

| 扩展 | Bundle ID | Extension Point |
|---|---|---|
| ChinaMobileIntentExtension | `cn.10086.app.ChinaMobileIntentExtension` | `com.apple.intents-service` |
| ChinaMobileNotiContentExtension | `cn.10086.app.ChinaMobileNotiContentExtension` | `com.apple.usernotifications.content-extension` |
| ChinaMobileNotiServiceExtension | `cn.10086.app.ChinaMobileNotiServiceExtension` | `com.apple.usernotifications.service` |
| ChinaMobileToday | `cn.10086.app.widgetnew` | `com.apple.widget-extension` |
| ChinaMobileWidgetExtension | `cn.10086.app.ChinaMobileWidget` | `com.apple.widgetkit-extension` |
| ScreenShareExtension | `cn.10086.app.ScreenShareExtension` | `com.apple.broadcast-services-upload` |
| ScreenShareExtensionSetupUI | `cn.10086.app.ScreenShareExtensionSetupUI` | `com.apple.broadcast-services-setupui` |

## 6. Framework 差异

普通分省包包含 20 个主要 Framework，其中包括：

- `ECMediaSDK.framework`
- `MGProxy.framework`
- `SuperPaySDK.framework`
- 公共网络、播放器、RTC、埋点和模型组件

总版 12.1.3 仍为 20 个主要 Framework，但组件组合变化：

- 新增 `CMMediaSDK.framework`
- 新增 `HWMMRMedia.framework`
- 新增 `HWMUISDK.framework`
- 移除 `ECMediaSDK.framework`
- 移除 `MGProxy.framework`
- 移除 `SuperPaySDK.framework`

甘肃包在普通分省组件外，还携带：

`libswiftCore`、`libswiftCoreFoundation`、`libswiftCoreGraphics`、`libswiftCoreImage`、`libswiftCoreLocation`、`libswiftDarwin`、`libswiftDispatch`、`libswiftFoundation`、`libswiftIntents`、`libswiftMetal`、`libswiftObjectiveC`、`libswiftQuartzCore`、`libswiftUIKit`、`libswift_Concurrency`、`libswiftos`、`libswiftsimd`。

## 7. 使用本清单时的注意事项

1. 文件名 `ChinaMobile` 不是总版，它与 `ChinaMobile 2` 都是北京版。
2. 不能依据桌面显示名判断包身份，应同时核对 Bundle ID、ChannelCode、Team ID、主程序 SHA-256 和 Entitlements。
3. 不能把某省主程序替换进另一省包后只改 plist；主程序、配置、资源、签名和服务端身份是一组配套产物。
4. 总版 12.1.3 与分省 12.0.5 版本不同，Framework 和扩展差异不能全部解释成渠道差异。
5. 独立 Mach-O 保留了原签名元数据，但它不是可直接发布的完整 `.app`；重新组包时必须按最终 Team/Profile 重新签主 App 和所有嵌套代码。
6. 13 个分省 `Info.plist` 都含 `CoverageServerURL=http://172.16.169.120:3000`，总版没有；该私网地址应视为打包流水线差异，是否参与实际业务需动态验证。

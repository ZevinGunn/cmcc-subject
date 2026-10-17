# 随行工具箱客户端

CMCC-PROJECT 公网服务的统一 macOS、Windows、Android WebView 工具箱，以及独立的微信原生小程序工程。0.2.0 集成已核实的 14 个公网工具入口，包含业务、权益、查询和管理控制台。桌面采用分类搜索侧栏，安卓通过“全部工具”弹窗搜索与切换。原生小程序仍为首版范围，提供站点登录、移动账号摘要、权限查询、星巴克短信登录、卡券分类筛选与批量复制。

客户端直接访问各项目的现有 HTTPS 公网域名，完整目录见 [服务入口](SERVICES.md)。服务端数据库、CK 置换、权限检查和定时任务继续使用现有部署。各站点保留原有认证与 Cookie 作用域，同域工具共享站点登录。客户端不内置邀请码、账号、密码、CK 或 Token，也不会自动运行订购或退订。网页更新在下次重新加载时生效；客户端自身或内置目录更新需安装新版。

## 桌面端

需要 Node.js >= 22.12.0。

```sh
npm ci
npm run icons
npm run tools:cache
npm run check
npm start
npm run test:desktop
npm run build:mac
npm run build:win
```

产物位于 `artifacts/desktop/`。macOS 分别构建 Apple Silicon 和 Intel 包；Windows 构建 x64 NSIS 安装版、便携版。Windows 最终运行验证应在 Windows 环境进行，仓库提供手动 CI 工作流。若 Electron 自带下载器无法连接，可运行 `node scripts/install-electron.cjs`，或通过 `CLIENT_ELECTRON_ARCHIVE` 指定已下载的压缩包；脚本始终使用官方 npm 包内的 SHA-256 校验。`tools:cache` 对构建工具同样执行固定校验。

桌面壳仅加载本地 UI，IPC 仅接受该本地页面。远程页面位于独立 WebContentsView，开启 sandbox、contextIsolation、webSecurity，禁用 Node.js 与任意网页 native bridge。站点 Cookie 使用专用持久化分区；仅工具编号写入偏好设置，不把完整专属链接或临时 SSO URL 写入设置。

目录中站点的新窗口继续使用浏览器的同域会话规则；运营商等外部 HTTPS 链接在系统浏览器打开，不允许远程内容加载 file、javascript 或任意自定义协议。不使用子域通配信任；只接受目录中的精确域名和明确别名。支持标准浏览器复制、选择文件、站点 JS 确认框、保存下载、前进返回、工具首页、快捷键、断网重试与清除登录。

首版 macOS 构建默认无开发者签名、公证。它是测试分发包，不代表已通过 Apple 信任或应用商店审核。正式发布需配置 Developer ID，启用签名、公证并在真实设备验证。Windows 未签名包可能触发 SmartScreen；证书不包含在仓库中。

## 安卓端

使用 Android 系统 WebView 和原生导航，无常驻 Node.js、跨端 UI 引擎或原生 JS bridge。最低 Android 8（API 26），target/compile API 35。保持浏览器缓存默认策略，不增加高频后台轮询。

需要 JDK 17、Android SDK `platforms;android-35`、`build-tools;35.0.0`、zip 工具。Android Studio 可选。

```sh
export JAVA_HOME="/你的/JDK/目录"
export ANDROID_SDK_ROOT="/你的/Android/SDK"
npm run build:android
```

本机默认查找 `~/.cache/cmcc-clients/jdk/Contents/Home` 与 `~/.cache/cmcc-clients/android-sdk`。构建脚本直接调用官方 javac、aapt2、D8、zipalign、apksigner；没有 Gradle 或远程 Maven 依赖。APK 不含本地密钥。

首构建自动创建独立发布签名，默认保存在 `~/.config/suixing-toolbox/signing/`（可用 `SUIXING_SIGNING_DIR` 指定），目录与文件仅当前用户可读。必须安全备份该目录，后续升级继续使用同一签名。不要把密钥或密码文件提交到 Git。

产物为 `artifacts/android/Suixing-Toolbox-0.2.0-android.apk`。构建结束验证 APK 签名；签名验证不代替真机测试。支持系统返回、键盘与刘海安全区域、专属链接、站点登录、分类工具选择、文件选择、外部 HTTPS 浏览器跳转、断网重试、清除登录。blob 导出等特殊下载请通过“浏览器打开”使用完整版网页；不会向不可信网页开放文件系统或原生下载 bridge。安卓和桌面共用 `shared/services.json`；安卓构建时将目录打入 APK assets，不另外维护一套网址数组。

## 微信小程序

用微信开发者工具打开 `miniprogram/`。工程中的 `touristappid` 仅用于本地工程准备；不是可上传发布的真实 AppID。

正式联调前需要：

1. 用户主体的小程序 AppID，在微信开发者工具中填写，并确认开发成员权限。
2. 在公众平台配置 request 合法域名 `https://home.1008086.xyz`，按平台当前要求完成域名、备案、类目及隐私配置。生产构建保留 `urlCheck: true`。
3. 使用真实设备验证 Set-Cookie 响应可见性、Cookie 请求头、登录过期、短信验证码、剪贴板与网络错误。
4. 通过审核后由账号管理员发布。AppID、扫码验证、平台审核不可由本地打包代替。

小程序通过现有 `/api/auth/login`、`/api/auth/link-login`、`/api/auth/bootstrap`、`/api/auth/me` 与 `/api/starbucks/*` 通信。只保存 `user_session`，不保存密码或上游运营商/星巴克凭证；401 清除本地登录；请求只允许固定 HTTPS 域名，不输出响应中的 HTML 错误源码。登录沿用现有后端行为，可能触发服务端已配置的登录后维护任务。

原生小程序尚未实现网页端的全部运营商业务、扫码登录、周三互助及订购/退订流程。不能声称是网页的完整替代。后续可按功能逐项原生适配；web-view 方案需要先确认主体资格和业务域名权限，首版不依赖该能力。

## 验证与交付

- `npm run check`：导航域名边界、服务目录对公网部署清单的完整覆盖、专属链接清洗、认证 Cookie 处理、HTML 错误处理和 JS 语法验证。
- `npm run test:desktop`：实际启动 Electron，验证工具切换、弹窗关闭、错误链接拦截、远程隔离和两种桌面窗口截图，不调用真实业务操作。
- `npm run test:desktop-security`：使用隔离测试页面验证外链、异步空白弹窗、危险协议拦截与远程页面权限。
- Android 构建：编译、DEX、对齐、签名及签名校验；真机/模拟器验证结果另见交付记录。
- `npm run test:android`：在已启动的专用 Android 模拟器执行工具切换、弹窗与横竖屏测试。默认序列号 `emulator-5554`，可通过 `CLIENT_DEVICE` 指定；仅对测试设备运行。
- `CLIENT_LAYOUT_ONLY=1 npm run test:android`：已完成全目录切换验证后，仅复验输入法、弹窗关闭与横竖屏布局，避免重复运行无关检查。
- `artifacts/` 为本机生成物，不提交到 Git。发布前校验 SHA-256 与实际版本，保留签名备份。
- 本工程不修改既有公网服务运行代码，因此仅新增客户端时无需重启现有 PM2 服务。

首版实际构建与验证情况见 [交付记录](DELIVERY.md)。

# 晋速办实现说明

## 数据流

Vue 3 → 同源 Express API → 单操作锁与状态机 → 按账号隔离的 Chromium 上下文 → 同源 fetch → 官方 HTTPS API。

内置 BCAT5075，同时支持用户配置同协议业务的查询和订购相对路径及 JSON 参数。用户输入手机号和登录验证码后，服务在同一临时浏览器会话发送请求，Cookie 由浏览器处理。本地 API 不开放任意主机 URL、修改登录接口或导入 HAR 会话；Host、Origin、随机 CSRF 头限制本机页面操作。浏览器启用沙箱且保留 TLS 校验。

## 2026-10-17 资料与适配

附件登录页 `app.478f4f4daf96ab943bac.js` 的 Ki3d/oHCY 模块定义请求路径与加密，`10.4a4d7837e46cc6bf6de3.js` 的 loginOfSim 定义登录业务参数。HAR 只有 act 的资格、短信和订购链路，不包含登录短信和登录请求。

| 能力 | 本地接口 | 官方路径（rest/v1 下） |
| --- | --- | --- |
| 登录发码 | POST /api/login/sms | market/wapLogin/sendSmsCode |
| 验证码登录 | POST /api/login/verify | market/wapLogin/login |
| 登录检查/同步 | POST /api/login/sync | market/wapLogin/checkLogin |
| 业务内容与资格 | POST /api/query/content | act/qqt5ga/qryUserQualification |
| 验证级别 | POST /api/order/sms 内部 | act/sensitive/qryTag |
| 业务发码 | POST /api/order/sms | act/smsver/sendSmsCodeNew |
| 业务验证码校验 | POST /api/order/verify | act/smsver/chkSmsCodeNew |
| 确认订购 | POST /api/order/submit | act/qqt5ga/submitPrcOrder |

实际路径为 `/h/{market或act}/rest/v1/{接口}`。market 登录参数使用 `pubInfo.busiType=SSO_LOGIN`、`loginType=sms`、`loginSourceCode=BROWSER`，号码和短信放在 pubInfo，busiInfo 为空对象，均来自附件源码。

`server/protocol.js` 为每次调用生成 16 位随机字母数字 AES 密钥与独立 16 字节 IV。AES-128-CBC/PKCS7 的报文为 IV 十六进制加密文十六进制；公钥支持官网返回的十六进制 DER SPKI，RSA PKCS#1 v1.5 密文放入 E-A-K，时间戳为 E-T-K，HMAC-SHA256(时间戳+报文, AES密钥) 为 E-S-K。响应按本次密钥解密；secretOutId=-1 时解析官方明文包装。解密失败不作为业务结果。

登录请求的 `couponsBusiName` 对齐附件 `/loginSim` 路由标题“SIM认证”。请求环境头由官方 `YWKJ.getHeader()` 在当前浏览器计算；官方 HTML 为空时加载附件原样公共 SDK（来源与哈希见 `server/vendor/README.md`）。环境生成失败不发送请求。`restParams` 仅在官方 `$fchama.httpReady()` 可用时复用，缺失时诊断标记不可用，不构造替代值。发码诊断仅保留三项有限通道状态，不解释未证实的状态含义，也不把 `0000 / OK` 当作手机已收到。

当前 act 公钥入口返回 HTTP 400，market 公钥入口正常。适配仅在无副作用的 act 公钥探测明确不可用时选择同源 market 入口；其相同资格路径已只读实测返回官方“用户未登录”。选好入口后业务请求只发一次，短信或订单绝不换入口重发。登录后的所有写操作仍须通过官方实际响应验证，不能仅依据未登录响应认定交易成功。

已订业务保留原官方页面响应采集路径，不猜测缺失的查询参数。该路径使用此前分析的 act w//H 与 Axios 解密拦截器；官网页面或模块变更可能使列表不可用。

## 状态与恢复

- 登录发码前校验号码与协议；每 60 秒最多一次，10 分钟窗口最多 5 次尝试。登录挑战绑定准确号码和随机 ID，10 分钟过期，每轮最多验证 5 次；这两个期限是本地限制，不宣称为官方验证码有效期。
- 发码响应丢失仍保留本地挑战，以便使用可能已送达的短信；官方明确拒绝时清除挑战。号码变化需重新发码。登录成功后再次检查官方身份，号码不符则关闭会话。
- 777777 和 999999 作为未登录/失效处理。官方账号变化清空该账号的验证码、查询与登录缓存。号码在账号缓存中加密保存；验证码不由应用持久化。
- 内容查询展示来源资料中的产品条款与实际资格响应；内容查询时间不表示线上条款更新时间。
- 内置业务短信沿用 QQT5GA_SMS、BCAT5075、sendType=2；其他业务使用当前配置的短信字段。所有业务均查询官方敏感验证级别，不降级；固定两位按官方位置插入用户输入的六位数字，保留前导零。
- 同一时刻仅允许一项操作。重复发送有冷却，失败的再次校验撤销原验证状态；订购前重新认证和核查资格。
- 已默认享有/已办理时可主动选择“仍尝试办理”。`/api/order/sms` 的严格布尔参数 `attemptAnyway=true` 绑定到当次内存验证码挑战，提交仅读取该挑战标记；普通流程不会自动切换尝试模式。提交前仍重新认证、查询资格、校验短信与用户确认。原 5G-A 放开 included/ordered 两种无需办理状态；通用/不查询业务保持 unverified，只有显式尝试可继续。本地已有办理记录保护、资格过期/无资格和未知响应仍拦截；该参数不传给官方接口。记录保存尝试标记、提交前资格码与官方真实结果，官方拒绝不能报成功。
- fsync 与原子替换先保存订购意图，再发送一次订购；未知响应保留待核查记录。重启将提交中改为待核查，禁止自动重试。
- 当前享有权益不代表本笔交易成功。手动解除待核查拦截必须明确确认原交易未生效。

## 多账号与缓存契约

`accounts.js` 统一操作锁与账号选择；每个账号有独立 Service/OfficialBridge，账号共享 Ledger/Catalog，身份、验证码、资格与已订业务缓存不混用。闲置账号关闭浏览器但保留服务对象的发码冷却，避免切换绕过限制；新账号登录使用单独草稿会话，成功后再选择。全局登录短信冷却/计数跨草稿保留。

- POST `/api/accounts/select` 切换并只读校验；`restore` 恢复当前缓存；`rename` 修改备注；`remove` 必须 confirmed=true，删除缓存与元信息而保留账本。
- 缓存状态：启动 cached → 验证身份后 valid；网络/环境问题为 unavailable，保留凭据供重试；明确 401/身份不符为 expired，清除缓存并允许重登；主动退出为 signed_out。接口不推断固定失效时长，不把临时网络错误归为过期。
- 业务操作前 Service 再次认证；冷缓存先额外核对保存号码，避免错号发码。选择账号生成新 epoch，业务、订单、退出和官方窗口 API 必须携带 `X-Account-Context={账号ID}:{epoch}`；旧页面被拒绝。切换使旧挑战失效，前端关闭旧办理弹窗。缓存本身不暴露到状态 API。
- 输入已有有效号码先恢复，不发送验证码；官方窗口同步遇到已有有效账号也优先保留其会话。可主动退出或移除缓存后重登。
- `account-store.js` 使用随机 256 位本机密钥、每次随机 96 位 nonce、GCM 标签和固定 AAD，原子替换并 fsync。账号号码、备注、当前选择与浏览器状态一起加密。目录 0700、密钥和密文 0600；`.local/` 已忽略。密钥同目录的保护边界是本机文件权限与避免明文泄露，不是抵御已控制本机的进程。
- 浏览器导出仅保留官方 origin、对应域 Cookie（含合法父域），包含必要 IndexedDB；sessionStorage 在新上下文首次导航恢复，标记防止后续导航覆写已轮换的令牌。排除已知短信/验证码/密码命名字段，应用从不将输入验证码写入存储；短信挑战 UUID 不进入缓存。非官方页面禁止导出。
- 每次登录和成功业务操作后更新缓存，切换/退出程序也尝试保存。保存失败保留内存会话并明确提示；损坏/丢密钥拒绝静默覆盖。退出当前账号同时清除内存恢复快照，其他账号不受影响。

## 多业务配置契约

- POST `/api/config/save` 新增（id 为空）或修改（id 与 revision 对应），保存后选中；POST `/api/config/select` 切换；POST `/api/config/delete` 按 id/revision 删除，至少保留一个。均要求本机 Host/Origin/CSRF 并受单操作锁约束。
- 业务发码请求携带 `config:{id,revision}`，拒绝过时页面；短信挑战绑定账号、配置 ID 与版本。修改/切换清除资格、内容和短信，不清除登录；冷却不因切换解除。
- 相对路径仅允许业务段，拒绝 URL、查询串、遍历和登录/密钥类入口。queryParams/orderParams 是各 4KB、嵌套不超过五层的 JSON 对象，禁止身份/验证码等动态字段。协议层再次验证配置，登录路由不能被覆盖。
- smsver 发码/校验与 sensitive/qryTag 路径固定；配置覆盖业务类型、产品/活动编码及标题。订购最终载荷为 orderParams 加动态 uuid、短信 busiType 和 couponsBusiName，不保存验证码凭据。
- 这份源码支持观察到的短信字段；HAR 只有加密请求体，并未证明其他业务的全部必填字段。页面星号是本地必填，不宣称官方通用契约；其他参数由用户按目标业务填写。配置资费仅作确认说明。
- qqt5ga 专用资格解释只允许原产品、业务类型与路径；generic 展示真实响应、none 不请求查询，均要求显式尝试。认证失效仍清除会话。
- 产品有 prcId/busiId 时按业务类型与编码识别重复；没有产品编码时按业务类型、订购路径、活动参数与订购 JSON 识别。名称、资费、配置 ID 不参与。原 qqt5ga 记录兼容；不同业务独立拦截，当前账号的记录统一展示。
- 订单持久化非身份配置快照，后续核查不依赖当前选择、编辑或删除后的配置。通用响应不能推断权益已享有；核查提示保留在记录中。
- 配置原子替换并 fsync，失败回滚内存；revision 冲突拒绝覆盖。默认文件缺失时使用内置业务，启动不写运行数据到 Git。

## 文件与验收

`accounts.js`/`account-store.js` 管理多账号与加密会话缓存；`catalog.js` 管理配置校验、版本和持久化；`bridge.js` 管理官方浏览器与请求传输；`protocol.js` 管理签名和解密；`service.js` 管理会话、验证码与订购；`domain.js` 管理严格业务码和脱敏；`ledger.js` 管理脱敏记录；`app.js` 管理本地边界；`web/` 为界面。

测试使用生成的 RSA 密钥、合成号码、离线服务与响应，不导入真实 HAR。`test:ui` 在操作前断言环境为 fixture。真实登录发码在补齐官方环境头后已由用户确认收到，验证码登录与已登录资格查询均已通过真实接口验证；当前号码已默认享有该权益。线上业务列表和真实订购尚未通过线上验收，详见 `VERIFICATION.md`。

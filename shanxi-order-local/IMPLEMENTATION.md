# 晋速办实现说明

## 数据流

Vue 3 → 同源 Express API → 单操作锁与状态机 → 独立 Chromium 上下文 → 同源 fetch → 官方 HTTPS API。

订购白名单仅覆盖 BCAT5075。用户输入手机号和登录验证码后，服务在同一临时浏览器会话发送请求，Cookie 由浏览器处理。本地 API 不开放任意 URL、任意官方方法或导入 HAR 会话；Host、Origin、随机 CSRF 头限制本机页面操作。浏览器启用沙箱且保留 TLS 校验。

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
- 777777 和 999999 作为未登录/失效处理。官方账号变化清空验证码及查询缓存。原始号码与验证码不落盘。
- 内容查询展示来源资料中的产品条款与实际资格响应；内容查询时间不表示线上条款更新时间。
- 业务短信严格沿用 QQT5GA_SMS、BCAT5075、sendType=2 和敏感验证级别，不降级；固定两位按官方位置插入用户输入的六位数字，保留前导零。
- 同一时刻仅允许一项操作。重复发送有冷却，失败的再次校验撤销原验证状态；订购前重新认证和核查资格。
- fsync 与原子替换先保存订购意图，再发送一次订购；未知响应保留待核查记录。重启将提交中改为待核查，禁止自动重试。
- 当前享有权益不代表本笔交易成功。手动解除待核查拦截必须明确确认原交易未生效。

## 文件与验收

`bridge.js` 管理官方浏览器与请求传输；`protocol.js` 管理签名和解密；`service.js` 管理会话、验证码与订购；`domain.js` 管理严格业务码和脱敏；`ledger.js` 管理脱敏记录；`app.js` 管理本地边界；`web/` 为界面。

测试使用生成的 RSA 密钥、合成号码、离线服务与响应，不导入真实 HAR。`test:ui` 在操作前断言环境为 fixture。真实登录发码在补齐官方环境头后已由用户确认收到，验证码登录与已登录资格查询均已通过真实接口验证；当前号码已默认享有该权益。线上业务列表和真实订购尚未通过线上验收，详见 `VERIFICATION.md`。

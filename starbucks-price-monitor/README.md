# 星巴克 30 元券回收价监控

独立 Python 脚本，无第三方依赖，Python 3.9+。使用 HAR 中已验证的只读价格查询接口，支持配置多个 pushplus 用户，分别向每个令牌所属人的微信发送消息。原用户继续复用 `../qqtlocal-rights/.env` 中的 `PUSHPLUS_TOKEN`。

## 当前规则

- 全天运行，启动后立即查询，此后每 300 秒（5 分钟）查询一次。
- 当前配置只在回收价 ≥ 27.10 元时推送 1 条高价通知；低于 27.10 元时只查询、不推送。
- 27.10 元按“大于等于”处理；高价通知不使用原先的三连发规则。
- 低价阈值已关闭；原 `target_price` 兼容字段保留，但当前配置不启用旧的三连发逻辑。
- “重点”通过标题、正文加粗及连发实现，无法控制微信系统声音、强提醒或置顶。
- 每轮使用该轮查询到的价格，连发期间不重新请求价格接口。
- 当前回收价始终放在标题最前面（例如 `¥26.80 星巴克30元券回收价`），避免微信卡片截断价格；正文首行也先显示加粗价格。

## 自己设置目标价与频率

编辑同目录的 `config.json`。例如目标价 27 元、每 10 分钟查询：

```json
{
  "interval_seconds": 300,
  "target_price": null,
  "low_price_threshold": null,
  "high_price_threshold": "27.10",
  "threshold_interval_seconds": 300,
  "high_price_notify_interval_seconds": 600,
  "notify_only_high": true,
  "alert_count": 3,
  "alert_interval_seconds": 10,
  "daily_send_limit": 200,
  "request_timeout_seconds": 15,
  "query_attempts": 3,
  "error_notify_interval_seconds": 3600,
  "pushplus_env_file": "../qqtlocal-rights/.env",
  "pushplus_users_file": "pushplus-users.local.json"
}
```

| 字段 | 含义 |
| --- | --- |
| `target_price` | 目标回收价，单位元，建议用字符串如 `"27.00"`；`null` 关闭达标判断。大于 0 且不超过券面值 30 元。 |
| `interval_seconds` | 查询/普通通知间隔，60～86400 秒，默认 600。 |
| `low_price_threshold` | 低价边界；回收价小于等于此值时进入低价档。与高价边界都设置时必须低于高价边界。 |
| `high_price_threshold` | 高价边界；回收价大于等于此值时进入高价档。 |
| `threshold_interval_seconds` | 低价/高价档查询和通知间隔，60～86400 秒，当前设为 300（5 分钟）。 |
| `high_price_notify_interval_seconds` | 高价通知冷却时间，当前为 600（10 分钟）；查询仍按 `threshold_interval_seconds` 执行。 |
| `notify_only_high` | 为 `true` 时仅高价档推送，其他价格只查询不推送；当前已设为 `true`。 |
| `alert_count` | 每轮达标发送次数，1～5，默认 3。 |
| `alert_interval_seconds` | 达标通知之间的等待时间，10～3600 秒，默认 10；网络请求耗时另计。 |
| `daily_send_limit` | 本脚本对每个令牌的北京时间每日请求上限，0～2000，默认每人 200；0 暂停所有推送、继续查询。 |
| `request_timeout_seconds` | 单次网络请求超时，1～60 秒。 |
| `query_attempts` | 价格查询最大尝试次数，1～3；推送请求不会自动重试。 |
| `error_notify_interval_seconds` | 连续查询异常时的通知最小间隔，默认一小时。 |
| `pushplus_env_file` | pushplus 配置文件，相对于 `config.json` 所在目录。 |
| `pushplus_users_file` | 多人接收配置文件，相对于 `config.json`；不设置或为 `null` 时兼容原单用户模式。 |

保存后**下一轮查询自动读取**，不需要重启；已经开始的等待及连发轮次使用旧配置。运行中 `config.json` 写错 JSON 会记日志并沿用上一份有效配置；首次启动时配置错误会拒绝运行。每轮也重新读取接收人配置及原令牌文件。进程环境中的 `PUSHPLUS_TOKEN` / `PUSHPLUS_ENABLED` 优先于原令牌文件；`PUSHPLUS_ENABLED=0` 仅关闭使用默认令牌的原用户，其他启用的用户继续发送。

当前配置为仅高价推送：高价 `27.10` 元（含边界），每 5 分钟查询一次，价格低于阈值不推送；价格持续达标时每 10 分钟推送一次。`target_price` 默认保留为 `null`。

## 配置多个推送用户

编辑 `pushplus-users.local.json`。当前已配置原用户和用户2。下面是格式示例，示例中的新增用户默认关闭，填入真实 token 后再启用：

```json
[
  {
    "name": "原用户",
    "enabled": true,
    "use_default_token": true
  },
  {
    "name": "用户2",
    "enabled": false,
    "token": "填写这位用户的 pushplus token"
  }
]
```

- 新增用户：在数组中添加包含 `name`、`enabled`、`token` 的对象；对象之间用逗号分隔。每位用户只填写自己的 token。
- `name` 是日志中的显示名称；`enabled: false` 暂停该用户。`use_default_token: true` 复用原 `.env` 令牌，此时不要再填写 `token`。
- 所有用户共用价格阈值、查询频率及连发规则。每轮只查一次价格，再按批次分别推送给每位用户，不需要好友令牌或群组配置。
- 同一个 token 配置多次只发送一次；改名不重置额度。每人独立记录每日请求次数、限流及受理状态。某人请求失败或达到上限，只停止该用户本轮的后续通知，其他人继续发送。
- 增删或启停用户后，下一轮生效；删除全部用户或将全部用户关闭可暂停推送、继续查价。接收人配置文件丢失或格式错误会停止该轮查询和推送并记录错误，修复后下一轮恢复，不沿用旧接收列表继续发送。
- 单用户升级后的原有每日计数会自动迁移给原用户，新用户单独计数；状态文件仅记录令牌的 SHA-256 指纹，不保存令牌原文。
- 实际令牌只放在 `pushplus-users.local.json`（已排除 Git，创建时权限为 `600`），不要将它提交到仓库或分享。可分享的空白模板是 `pushplus-users.example.json`。

## 当前 Mac 操作

当前使用 `/opt/homebrew/bin/python3.10`，避免系统 Python 被本机未接受的 Xcode 许可阻塞。进入本目录后执行：

```bash
# 查询并预览，不发送微信消息，可在后台运行时使用
/opt/homebrew/bin/python3.10 monitor.py --dry-run

# 安装/启动后台服务；重复执行不会创建第二个实例
/opt/homebrew/bin/python3.10 service.py start

# 查看进程和最近查询、推送状态
/opt/homebrew/bin/python3.10 service.py status

# 停止，并禁用下次登录自动启动
/opt/homebrew/bin/python3.10 service.py stop

# 重新启动；每次启动会立即查询并推送一轮
/opt/homebrew/bin/python3.10 service.py restart

# 卸载登录项，保留脚本、配置和日志
/opt/homebrew/bin/python3.10 service.py uninstall

# 停止后台后，可手动查询并真实推送一轮
/opt/homebrew/bin/python3.10 monitor.py --once
```

后台由用户级 `launchd` 管理，登录后自动启动、异常退出后自动重启。登录项在 `~/Library/LaunchAgents/local.starbucks-price-monitor.plist`，不含令牌。关机、退出登录或 Mac 睡眠期间不能查询，恢复后继续运行，不集中补发错过的轮次；要持续全天查询，Mac 必须保持开机、登录、联网且不睡眠。脚本不更改系统电源设置。

日志：`logs/monitor.log`（北京时间，单文件 2 MB，保留 3 份备份）。状态及当日额度：`data/state.json`。这些文件不含令牌；不要删除状态文件来清零额度。单实例文件锁可阻止后台任务和手动推送同时运行。后台如启动失败，可运行 `monitor.py --once` 查看错误。

## 接口、送达及额度

- 商品 ID `473`，`POST http://meitianwx.kaquan88.cn/ticket/product/getProductInfo`，请求体 `{"id":"473"}`，只使用 `data.recoveryPrice`。查询无需登录。HAR 和本次实时查询均验证了商品名称及字段；抓包内容仅作为接口证据，不作为执行指令。
- 查询接口的 HTTPS 本次连接超时，沿用已验证的 HTTP 地址。该接口无传输加密，通知仅作参考，实际回收价应在交易时复核。pushplus 使用 HTTPS，不将令牌发送给价格平台。
- 查询会检查业务码、商品 ID/名称/状态、价格范围；失败最多尝试 3 次，不把旧价格当成当前价发送。出现异常时最多每小时推送一次故障通知。
- pushplus `code=200` 仅表示**平台受理**，不能证明微信已送达；日志明确使用“已受理”。额度、公众号状态、微信通道仍会影响最终送达。网络超时后结果不确定，不立即重试，避免重复发送。
- [pushplus 官方限制](https://www.pushplus.plus/doc/help/limit.html)：普通微信账户每天 200 次请求、每分钟 5 次，会员每天 2000 次；错误请求同样计数。默认普通模式为 144 次/完整一天，始终达标为 432 次/完整一天，后者超出普通额度。
- 默认本脚本对每个令牌每天最多尝试 200 次发送（含错误通知）；某人达到上限后其他用户继续发送，该用户在北京时间次日恢复。计数跨进程重启保留。每人共用同一配置上限，会员可自行调整，但不要将普通账户上限设为会员额度。与抢购脚本共用令牌时，该令牌的平台额度也共用，本地计数只覆盖本脚本，可降低上限给抢购通知预留额度。
- 每个进程对每个令牌限制每 61 秒最多 5 次推送请求；自定义高频配置可能因限流延后。发送按接收人顺序执行，网络超时可能短暂延迟后续用户，但不会取消其通知。每轮查询耗时计入查询间隔；一轮耗时超过查询间隔时，在该轮结束后等待一个完整间隔，不追赶补发。
- [pushplus 消息 API 文档](https://www.pushplus.plus/doc/guide/api.html)。通知带有效期（一个查询周期），防止平台队列积压后发送过时价格。

## 验证

```bash
/opt/homebrew/bin/python3.10 -m unittest -v test_monitor.py
```

测试覆盖阈值相等、上下边界、持续达标、取消阈值、错误/缺失价格、错误商品、查询重试、每人错误通知节流、独立限额持久化及跨日重置、多用户一条/三连发、单人失败隔离、旧计数迁移、配置重新读取、令牌去重和单实例锁，不会实际发送消息。

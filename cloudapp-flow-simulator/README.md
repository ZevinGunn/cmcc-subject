# 云应用全流程离线模拟器

这是一个用于学习和测试状态机的离线样例，不连接任何生产接口，也不能换取真实门户、控制面或播放器凭据。

## 能模拟什么

模拟链路为：

```text
10086 会话样例
  -> 一次性入口样例
  -> 门户会话交换样例
  -> 应用配置与能力授权样例
  -> 异步创建云实例样例
  -> 有界轮询样例
  -> 播放器与信令票据样例
  -> PLAYING
```

内置场景：

| 场景 | 结果 |
|---|---|
| `12924-ready` | `canPlay=1`，能力成功，最终进入 `PLAYING` |
| `10607-denied` | `canPlay=0`、能力码 `6000608`，停止在授权拒绝 |
| `sso-expired` | 模拟入口会话失效，不签发入口样例 |
| `launch-timeout` | 模拟持续返回 `15003`，达到轮询预算后超时 |

## 运行

无需安装第三方依赖，使用 Node.js 18 或更高版本：

```bash
cd /Users/ZevinGunn/CMCC-PROJECT/cloudapp-flow-simulator
npm test

node src/cli.js \
  --cookie fixture:wx-valid \
  --scenario 12924-ready
```

默认遮蔽所有凭据样例。需要观察虚构 Token 在各阶段如何变化时：

```bash
node src/cli.js \
  --cookie fixture:wx-valid \
  --scenario 12924-ready \
  --show-fixtures
```

结构化输出：

```bash
node src/cli.js \
  --cookie fixture:wx-valid \
  --scenario 10607-denied \
  --json
```

过期会话场景必须使用对应的虚构输入：

```bash
node src/cli.js \
  --cookie fixture:wx-expired \
  --scenario sso-expired
```

## 安全边界

- `--cookie` 仅接受 `fixture:wx-valid` 和 `fixture:wx-expired`。
- 常见真实 Cookie 字符串、任意 Token 或其他输入都会被拒绝。
- `FixtureCloudAppAdapter` 是模拟器唯一允许的适配器类型。
- 核心运行源码不包含 URL、HTTP 客户端或 `fetch()` 调用。
- 所有虚构值均以 `DEMO_ONLY_` 开头，默认输出为 `[REDACTED_FIXTURE]`。
- 本项目不提供生产接口连接器、Cookie 导入、Cookie 重放或真实凭据导出能力。

若要接入正式授权的测试环境，应在独立私有项目中实现服务端 BFF/适配器，使用测试账号、接口方提供的凭据和域名白名单，并完成审计、重放保护、凭据托管及日志脱敏。不要把真实环境适配器加入本离线示例。

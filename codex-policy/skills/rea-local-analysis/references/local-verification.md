# 本机接入验证

验证日期：2026-10-30，Asia/Shanghai。这里记录一次真实验收，后续工具版本、路径或目标哈希改变时应重新判断适用性。

## 已验证

- REA CLI 6.8.0；官方技能版本 50；独立 MCP 客户端从实际 Codex 配置启动服务，发现 229 个工具，并成功调用 `inspect_android_class`。
- 通过 `DEVELOPER_DIR=/Library/Developer/CommandLineTools` 选择已安装的独立工具链后，真实 JavaScript 静态分析完成；没有接受 Xcode 许可或更改系统工具链选择。
- 复用现有 Zulu JDK 17.0.20.1。JADX 0.7.1 从 REA 文档指定的上游地址获取，SHA-256 与 REA `JadxRelease.ts` 中的固定值一致：`6e5eacf500b64292bfb73c49797c1958f6ee44646e43e868039ae7feb573ff75`。
- 样本为用户提供的中国移动 10.2.1 APK，247,748,772 字节，SHA-256 `b544c8c4df1fa6ed7171f40a241dd81e201c5f3f149478adac308e61e2d41e74`。JADX 成功读取包声明、2,773 个类及 11,783 个资源，查询到四个 `s.h.e.l.l` 壳类；MCP 返回 `s.h.e.l.l.A` 的方法与字段。
- 方法级检查成功返回 `s.h.e.l.l.A.<init>()V` 的完整 Smali。Java 方法体不可用，REA 标记 `java_body_unavailable` 并回退到 Smali；这不是恢复 Java 源码或脱壳成功。
- 从同一 APK 提取的 `cmcc.js` 完成语法/语义静态分析：1 个选中文件，801 个 AST 节点，0 个解析失败。语义未知项仍须保留，分析完成不代表全部行为已恢复。
- 自定义 skill 的 YAML/frontmatter、界面元数据及 MCP TOML 已使用现有 YAML/TOML 解析器校验，MCP 环境与 `codex-policy/rea/profile.json` 一致。标准 Python skill 校验器缺少 PyYAML，因此使用现有 Node YAML 解析器检查对应结构；没有额外修改 Python 环境。

## 证据位置

原始 APK、提取文件、完整 Evidence 和一次性验证脚本留在本机，不提交到 Git：

`/Users/ZevinGunn/.local/share/rea/evidence/integration-20261030/`

| 文件 | 内容 |
| --- | --- |
| `target-identity.json` | 原始路径、快照、大小和哈希 |
| `doctor.json` | 定向接入检查 |
| `cmcc-package-summary.json`、`cmcc-package` | Android 包分析摘要和完整 Evidence bundle 文件 |
| `cmcc-bridge-summary.json`、`cmcc-bridge` | APK 内 JS 分析摘要和完整 Evidence bundle 文件 |
| `cmcc-shell-classes.json` | 类查询及覆盖范围 |
| `mcp-check.json`、`mcp-class.json` | 实际 Codex 配置启动的独立 MCP 调用结果 |
| `cmcc-shell-constructor.json` | 方法级 Smali 及 Java 不可用标记 |

关键 Evidence：Android 包 `ev_82be050583a50aa7c80642cf71209cc2799a01090f961e69d0d6bb83cbc16a3e`；JavaScript `ev_ce8383b2718e38d42ec82b096b0a27c79788c8d5de95309de8a084010406cd50`；MCP 类检查 `ev_7d2c0f3ef45ef8a43d6b0489e729d0d9b84b72f3262951fa1da36dc4ea56b5bc`。这些是已保存输出中的标识，不保证跨进程能直接按 ID 读取；跨会话优先读取磁盘 bundle。

## 边界

没有执行 APK、发送验证码、访问账号业务接口或验证云端多会话。没有完成脱壳，也没有配置或验收 Ghidra/Hopper。APK 可见类清单不能证明隐藏或动态加载代码不存在。

MCP 配置和新 skill 已写入；本次独立 MCP 验收成功不等于 Codex 当前会话的旧服务已重新加载。重启或重连后才使用新环境，CLI 后备入口可立即使用。

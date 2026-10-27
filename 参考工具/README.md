# 本地参考工具

本目录保存用于后续功能增强和接口分析的第三方参考项目。参考项目保持独立 Git 仓库，不直接合并到 CMCC-PROJECT 的运行代码中。

## 已拉取项目

| 项目 | 本地路径 | 来源 | 当前提交 |
| --- | --- | --- | --- |
| REA | 参考工具/rea | https://github.com/morluto/rea | d6f88becd531cabafca1d968b89cf7fc77a80041 |
| cmcc-auto-checkin | 参考工具/cmcc-auto-checkin | https://github.com/yupaiLy/cmcc-auto-checkin | b2cef5b1a2c788df3ff4d6f0f948667f960a2dcf |

## REA 本地应用状态

- Node.js 22.23.4 已安装，REA 生产构建已通过。
- Codex MCP 已写入 /Users/ZevinGunn/.codex/config.toml，对应命令使用本地 参考工具/rea/scripts/rea.mjs mcp。
- REA skill 已安装到 /Users/ZevinGunn/.agents/skills/reverse-engineer-anything，状态为 aligned。
- 配置备份位于 /Users/ZevinGunn/.codex/config.toml.rea.backup。
- 修改 Codex 配置后通常需要重启 Codex 会话，新的 MCP 工具才会出现在当前会话中。
- 当前未安装 Hopper、Ghidra、JADX、Kuna，因此原生二进制和 Android 深度分析能力暂不可用；这不影响静态 JavaScript/Web 分析。

可用检查命令：

    cd /Users/ZevinGunn/CMCC-PROJECT/参考工具/rea
    /Users/ZevinGunn/.nvm/versions/node/v22.23.4/bin/node scripts/rea.mjs doctor --format json

## cmcc-auto-checkin 本地环境

- Python 3.10.13 隔离环境：参考工具/cmcc-auto-checkin/.venv310。
- requests、cryptography 已安装，主要 Python 脚本已通过 compileall 和 --help 冒烟检查。
- 未创建真实 config.json，没有写入手机号、App Token、Cookie、JWT 或推送凭据。
- 运行前应只使用本人账号和本人抓包得到的凭据，并先使用 --dry-run 检查状态。

示例：

    cd /Users/ZevinGunn/CMCC-PROJECT/参考工具/cmcc-auto-checkin
    .venv310/bin/python cmcc_sign.py --config config.json --dry-run
    .venv310/bin/python cmcc_wed.py --config config.json --dry-run

这些命令不会替代现有 cookie-app 的账号管理和权限控制，也不会自动执行真实签到、领奖、秒杀、抽奖、充值或订购行为。后续若要接入现有项目，应先完成接口、凭据生命周期、频率限制和失败回滚的独立评估。

## 版本与文件管理

两个参考目录保留各自的上游 Git 历史；依赖目录、构建缓存和 Python 虚拟环境不作为主仓库源码提交。任何后续修改应先在参考仓库内验证，再以最小变更方式迁移到目标项目。

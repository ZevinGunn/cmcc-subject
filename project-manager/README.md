# Project Ops 服务运维后台

为 CMCC-PROJECT 中的应用提供统一的运行状态、服务操作、发布和排障入口。它管理应用与部署过程，不处理运营商账号订购业务。

## 已实现功能

- 服务清单：读取 `services.json` 中的服务标识、PM2 名称、端口、域名、能力与发布命令。`projects.json` 仅为遗留资料，不是当前运行清单。
- 分层巡检：检查进程、端口归属、应用健康、公网 HTTPS 和前端产物；区分健康、降级、不可用及操作中状态。
- 单服务操作：启动、停止、重启、测试、构建、发布和检查，按服务支持的能力开放操作。
- 发布流程：测试与隔离构建、产物校验和切换、准确服务重启、发布后检查，以及失败时的恢复流程。
- 操作任务：异步执行、互斥控制、阶段进度、执行输出和操作历史；服务重启也有独立任务处理。
- 日志与存储：查看服务/操作日志，盘点日志、缓存、依赖和备份等空间，并提供受控清理入口。
- 管理访问：管理员登录、会话、登录限流和凭据轮换；V1 `/home` 与 V2 `/v2` 共用后端。

## 主要文件

| 路径 | 作用 |
| --- | --- |
| `server.js` | HTTP 服务、认证、健康检查、服务操作与发布实现 |
| `services.json` | 当前运行清单与各服务支持的操作 |
| `public/v2.html`、`public/v2.js`、`public/v2.css` | V2 运维界面 |
| `ops-cli.js` | 使用同一运维实现的命令行入口 |
| `self-restart-worker.js` | 后台自身重启及后检 |
| `scripts/` | 凭据轮换等维护脚本 |
| `runtime/` | 本机运行状态与操作记录，不作为可分享源码 |

## 本地启动

项目为 Node.js ES module 工程，`package.json` 未声明第三方运行依赖。先复制 `.env.example` 为本地 `.env`，填写自己的管理密码和会话密钥，核对 `services.json` 中的实际路径、PM2 配置和命令，再启动：

```bash
npm start
```

默认监听 `127.0.0.1:7800`，V2 界面为 `/v2`。`HOST`、`PORT`、`PM2_BIN` 和 `MANAGER_RUNTIME_DIR` 可按环境设置。示例配置不是可直接复用的生产凭据；仅复制源码不会自动配置 PM2、Nginx 或公网通道。

## 检查与命令行

```bash
npm run check
npm test
node ops-cli.js --help
```

在工作区根目录运行的运维命令：

```bash
node project-manager/ops-cli.js build-all
node project-manager/ops-cli.js rebuild <service-id>
```

`build-all` 进行检查与隔离构建，不切换线上产物；`rebuild` 会进入实际构建、切换、重启、后检与失败恢复链路，执行前应核对具体服务。纯 README 修改无需运行这些发布操作。

产品与交互设计见 [V2 设计说明](docs/v2/PROJECT-MANAGER-V2-产品与交互设计.md)，实现背景见 [V2 开发方案](docs/v2/PROJECT-MANAGER-V2-开发修改方案.md)；其中标为待办的内容不属于当前已实现能力。

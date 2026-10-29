# Project Ops V2 开发修改方案

## 0. 2026-07-19 当前实施状态

Phase 0-3 已完成当前版本交付：

- V1 `/home` 保留并增加 V2 入口；V2 使用独立 `/v2/*` 静态页面。
- `services.json` 是唯一运行清单，覆盖 11 个应用、5 类基础设施和 12 个应用域名。服务端、V1/V2、部署脚本和 CLI 均从该文件读取或派生数据。
- `projects.json` 仅作为遗留文件保留，`server.js` 不再读取；V1 兼容项目列表由 `services.json` 在内存中生成。
- 已实现总览、服务、发布、操作、日志、存储、系统七个视图，以及登录、服务详情、操作详情、危险操作确认、任务轮询和移动端导航。
- 七页交互原型 `project-manager-v2-prototype.html` 已同步覆盖上述页面与关键交互。
- 写操作使用跨进程原子锁和后台任务模型，成功提交返回 `202 + operationId`；已有任务运行时返回 `409 operation_busy`，当前不实现等待队列。
- 操作中心支持选择允许自动操作的服务后批量启动、停止和重启。`protected` 或 `automaticOperations: false` 的服务不进入批量列表，只允许单独操作。
- 构建使用隔离候选目录并校验 `index.html` 及本地脚本/样式引用；部署使用同文件系统受保护切换，随后执行应用、前端入口和静态资源后检，失败自动恢复旧产物，启动时恢复切换中断留下的有效备份。
- 选择服务查看日志时，API 组合该服务的 PM2 输出与关联操作日志，并统一执行输出脱敏。
- `wangka`、`yunpan` 使用 `restricted-pending-auth`：同时检测根页面和健康路径；`401/403` 或 `accessRedirectHosts` 白名单中的 Cloudflare Access 跳转视为鉴权阻断，`404/000` 只表示路由关闭，任意 `2xx` 视为未授权暴露。
- `qqtlocal` 因 8899 已知双监听设置为 `automaticOperations: false`；仍持续监控并允许单独检查或操作，但不会进入一键或批量自动启停。
- V1 `rebuild`、`frontend-update` 与 CLI `build-all`、`rebuild` 已复用 V2 的安全构建和发布链路。
- 已实现有期限可撤销会话、登录限流、Strict/Secure Cookie、同源校验、64 KB 请求上限、安全响应头、HTTP 到 HTTPS 跳转和敏感输出脱敏。
- 运行日志写入忽略版本控制的 `runtime/`，单文件 5 MB 轮转并保留最近 5 份；历史日志仍只读兼容。

上线后仍需人工协调：

- `wangka` 与 `yunpan` 在完成 Cloudflare Access 或统一管理员鉴权前保持 `restricted-pending-auth`，不能按普通公开服务验收。
- 先识别并收敛 8899 的额外监听进程，再评估是否恢复 `qqtlocal` 自动操作。
- `.env` 和旧操作日志已经停止跟踪，管理口令与会话密钥已经轮换并加载到正式进程；远端 Git 历史仍含已失效旧值，后续需单独评估历史重写。
- Project Ops 已迁移为非 root 进程；部分历史业务服务仍以 root 运行，后续需要按服务迁移到最小权限账户。
- 构建和部署只处理当前本地代码，不自动执行 `git pull`，避免覆盖脏工作树。

V2.1 backlog，不属于当前交付：

- 待发布 Git 变更预览与变更摘要。
- 从发布历史发起手动回滚。

交互原型发布页中的“待发布变更”区域用于表达 V2.1 方向，不是当前 API 或线上页面的已交付能力。

## 1. 实施原则

- 保留 V1 的 `public/app.js`、`public/styles.css` 和 `/home` 行为，但不保留第二份运行配置。
- V1/V2、脚本和 CLI 统一以 `services.json` 为能力、路径、PM2、端口、域名与暴露策略来源。
- V2 使用独立 `public/v2.html`、`public/v2.js`、`public/v2.css`，不引入前端框架和构建链。
- 后端只执行服务清单中的固定命令；API 不接受任意 Shell、路径、PM2 名称或端口。
- 客户端按 `capabilities`、`protected`、`automaticOperations` 渲染动作，服务端再次校验，不能信任客户端。
- 写操作串行互斥，不使用浏览器端 `busy` 状态代替服务端锁，也不把被拒绝请求描述成已排队。

## 2. 文件改造

### project-manager

| 文件 | 当前职责 |
| --- | --- |
| `server.js` | 唯一清单适配、路由安全、认证、全局锁、V1/V2 API、多层健康、批量动作、发布链路、日志组合与输出脱敏 |
| `services.json` | 唯一运行清单；描述应用、基础设施、能力、命令、暴露策略和自动操作资格 |
| `projects.json` | 遗留文件；运行时不读取，不得继续作为配置来源 |
| `public/index.html` / `public/app.js` | V1 兼容页面与版本入口；重构/更新打包调用统一安全链路 |
| `public/v2.html` | V2 独立入口 |
| `public/v2.js` | 七页路由、状态管理、服务表、批量控制、详情、确认、任务轮询和日志筛选 |
| `public/v2.css` | V2 工作台设计系统和 320px 响应式布局 |
| `ops-cli.js` | CLI 到统一构建/重构执行器的受控入口 |
| `test/security.test.js` | 输出脱敏回归测试 |
| `test/frontend-release.test.js` | 隔离构建、静态引用校验、受保护切换、回滚和中断恢复测试 |
| `.env.example` | 必填环境变量示例，不包含真实密钥 |
| `.gitignore` | 忽略 `.env` 和运行日志 |

### 部署脚本

| 文件 | 当前职责 |
| --- | --- |
| `start-services.sh` | 按 `services.json` 启动允许自动操作的业务服务并执行端口自检 |
| `stop-services.sh` | 只停止允许自动操作的业务 PM2，保留管理台和基础设施 |
| `stop-all.sh` | CLI 完整关机入口，不由 V2 页面调用 |
| `build-all.sh` | 通过 `ops-cli.js` 执行测试和隔离构建校验，不切换线上产物 |
| `rebuild.sh` | 通过 `ops-cli.js` 执行测试、隔离构建、受保护切换、重启、后检和失败恢复 |
| `healthcheck.sh` | 按 `services.json` 覆盖 11 个应用并区分普通公网与受限公网策略 |
| `cloudflared-setup.sh` / `apply-bmcc-public.sh` / `cmcc.nginx.conf` | 维护现有公网路由和 `notice` 历史别名；受限服务不创建 Tunnel/DNS，Nginx 默认返回 404 |
| `运维手册.md` | 记录服务数量、命令语义、人工限制和 V2 入口 |

## 3. V2 API

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET | `/api/v2/overview` | 总览统计、事件、当前互斥任务 |
| GET | `/api/v2/services` | 多层状态、暴露策略与能力列表 |
| GET | `/api/v2/services/:id` | 服务详情和最近操作 |
| GET | `/api/v2/services/:id/logs` | 兼容读取目标服务 PM2 最近日志 |
| POST | `/api/v2/services/:id/actions` | 单服务白名单动作：start/stop/restart/build/test/deploy/check |
| POST | `/api/v2/actions` | 批量启停/重启/检测及受控存储清理 |
| GET | `/api/v2/operations` | 当前互斥任务与有界历史 |
| GET | `/api/v2/operations/:id` | 阶段、命令摘要、脱敏输出和结果 |
| GET | `/api/v2/inventory` | 服务清单、基础设施、安全状态与配置漂移 |
| GET | `/api/v2/logs` | 操作日志；传 `serviceId` 时组合 PM2 与关联操作日志 |
| GET | `/api/v2/storage` | 存储分类、锁定状态和保留策略 |

所有写 API 共用单任务全局锁。任务创建后异步执行并返回 `202`；锁已被占用时直接返回 `409 operation_busy`，不会创建排队项。前端显示当前任务并要求用户稍后重试。

## 4. 服务清单模型

```json
{
  "id": "home",
  "name": "全球通免登录",
  "group": "business",
  "kind": "application",
  "directory": "免登录进入全球通/cookie-app",
  "runtime": "node-typescript",
  "pm2Name": "cookie-app",
  "port": 3101,
  "domains": ["home.1008086.xyz"],
  "healthPath": "/api/health",
  "allowedStatus": [200],
  "dependencies": ["pm2", "postgres", "nginx", "cloudflare-main"],
  "capabilities": ["start", "stop", "restart", "build", "test", "deploy", "check", "logs"],
  "build": {
    "cwd": "免登录进入全球通/cookie-app",
    "command": ["npm", "run", "build"],
    "artifact": "免登录进入全球通/cookie-app/dist/index.html"
  },
  "test": {
    "cwd": "免登录进入全球通/cookie-app",
    "command": ["npm", "test"],
    "requiredForDeploy": false
  },
  "protected": false,
  "exposure": "public"
}
```

字段约束：

- `capabilities` 决定单服务动作白名单。
- `protected: true` 的管理服务不能进入破坏性批量动作。
- `automaticOperations` 缺省或不为 `false` 时可进入自动操作候选；显式为 `false` 的服务继续监控并可单独操作，但不能进入一键或批量自动启停。
- `exposure: restricted-pending-auth` 使用安全访问状态模型，不以公网 `200` 作为健康条件。
- `projects.json` 不参与模型合并；V1 需要的 `backend`、`frontend` 等兼容结构由服务端从本模型派生。

## 5. 操作与发布实现

### 5.1 单服务与批量动作

- `start`：启动目标 PM2，等待端口、应用和公网策略后检。
- `restart`：执行 `pm2 restart <name> --update-env`，不会隐式构建；随后检测恢复状态。
- `stop`：只停止目标业务 PM2，并确认目标端口不再监听。管理台、Nginx、Tunnel 和数据库保持运行。
- `test`：只执行 `services.json` 中配置的固定测试命令。
- `check`：检查 PM2、唯一监听 PID 是否属于 PM2 进程树、应用健康、受限/普通公网策略和前端产物。
- 批量启动、停止和重启按用户选择顺序串行执行；任一步失败时停止后续破坏性动作。
- 受保护或 `automaticOperations: false` 的服务由前后端双重排除在批量动作之外。

### 5.2 build

1. 在与线上 `dist` 分离的候选目录执行清单中的 `npm run build`。
2. 验证候选目录存在非空 `index.html`。
3. 解析 `script[src]` 与 `link[href]`，拒绝路径越界、非法编码、缺失或空的本地静态资源。
4. 校验成功后删除候选目录；`build` 只验证，不切换线上产物。
5. 构建或校验失败时直接清理候选目录，线上 `dist` 保持不变。

### 5.3 deploy

1. 执行 `requiredForDeploy` 测试。
2. 完成隔离构建和静态引用校验。
3. 在同一文件系统内将现有 `dist` 快速重命名为受保护备份，再把候选目录切换为线上 `dist`；若进程在两步之间中断，下次启动从最新有效备份恢复。
4. 重启目标后端并检查 PM2、端口、应用和公网策略。
5. 对前端首页及最多四个构建引用资源执行公网 `200` 后检。
6. 切换、重启、应用后检或前端后检失败时恢复旧产物，并在恢复成功后再次重启进程。
7. 全部通过后删除候选目录和回滚备份。

当前只有失败自动回滚，没有从历史记录发起手动回滚的 API 或按钮。

### 5.4 V1 与 CLI 复用

- V1 `rebuild` 调用 `rebuildService`；有可部署前端时走完整 `deploy`，后端服务走测试、重启和后检。
- V1 `frontend-update` 直接复用 `deployService`，不再原地覆盖线上 `dist`。
- CLI `build-all` 通过 `ops-cli.js` 对清单内项目执行测试和隔离构建校验，不上线产物。
- CLI `rebuild <id|all>` 通过同一执行器完成测试、发布或后端重启；`all` 只选择允许自动操作且未受保护的应用。

## 6. 受限公网与人工服务

### 6.1 wangka / yunpan

- `exposure` 为 `restricted-pending-auth`，`automaticOperations` 为 `false`。
- `401/403` 或跳转到清单 `accessRedirectHosts` 明确配置的 Cloudflare Access team host 表示鉴权阻断；`404/000` 只表示公网路由关闭，记录“尚未验收鉴权”提醒。
- 根页面与健康路径必须同时检查；任一路径返回 `200` 都视为未授权暴露，非可信 `3xx` 或其他状态视为访问控制不确定。
- 公网返回 `200` 表示绕过访问控制，产生未授权暴露安全告警并按不可用处理。
- 无响应或其他状态不能证明访问控制有效，维持降级并要求人工检查。
- 在鉴权完成前不修复为普通公开路由，也不进入批量自动启停。

### 6.2 qqtlocal

- 8899 已知存在 PM2 外的额外监听进程，`automaticOperations` 为 `false`。
- 服务仍出现在总览、服务、日志和系统漂移检测中，也可单独执行检查或明确操作。
- 一键和批量自动启停不会包含该服务；必须先人工确认监听进程归属并完成收敛。

## 7. 安全修改

- 启动时缺少 `MANAGER_PASSWORD` 或 `MANAGER_SESSION_SECRET` 直接失败。
- 登录按 IP 维护失败窗口；达到阈值返回 429。
- Cookie 在生产和 HTTPS 转发场景使用 `HttpOnly; Secure; SameSite=Strict`。
- 写请求执行同源校验，请求体限制 64 KB，JSON 和静态路径异常返回 4xx。
- 命令、目录、PM2 名称、端口和能力均来自 `services.json` 白名单。
- 全局操作锁使用原子文件创建并支持陈旧锁恢复；并发写操作返回 409。
- 对操作日志、PM2 输出和 API 响应应用密钥、Authorization、Cookie、数据库 URL 脱敏。
- `.env` 与旧操作日志已停止跟踪；轮换脚本同步更新本地 `.env`、轮换时间标记和 macOS 钥匙串，正式进程重启后旧会话失效。

## 8. 验证与验收

### 自动化

- `npm run check`：校验 `server.js` 与 `public/v2.js` 语法。
- `npm test`：覆盖敏感输出脱敏、可信代理登录限流、实时操作阶段、隔离构建不触碰线上产物、静态引用缺失拒绝、受保护切换完成、自动回滚和中断恢复。
- 服务启动时校验服务 ID、PM2 名称、端口、应用域名、依赖和操作路径。
- 部署脚本执行 `bash -n`，文档与代码执行 `git diff --check`。

### 手工验收

1. 桌面和 320px 移动端逐页检查七个 V2 页面、服务详情、批量控制和确认弹窗。
2. 使用两个管理台实例并发提交操作，确认一个返回 `202`、另一个返回 `409`，且任务完成后锁释放。
3. 选择服务查看日志，确认同时出现 PM2 与关联操作来源且敏感字段被脱敏。
4. 使用测试产物验证入口引用缺失时拒绝发布、后检失败时恢复旧产物。
5. 验证 `restricted-pending-auth` 的阻断状态与未授权 `200` 告警语义。
6. 验证 V1 更新打包及 CLI `build-all`、`rebuild` 使用同一安全链路。

## 9. 回退

- V1 `/home` 始终保留并与 V2 共用认证、清单和执行器。
- V2 静态文件可独立移除，不影响 V1 页面，但 `services.json` 仍是唯一运行清单。
- V2 API 不替换现有 V1 路由；V1 兼容数据由清单动态生成。
- 部署失败自动恢复旧产物；服务启动时也会尝试恢复中断切换留下的最新有效备份。
- 配置和脚本修改保留版本控制差异，逐项验证后再执行批量动作。

## 10. V2.1 backlog

- 读取 Git 工作树并展示待发布文件、提交差异和变更摘要。
- 为已保留且通过校验的历史产物提供受控手动回滚任务。

在上述能力实现并通过安全验收前，发布页只展示可发布服务、构建/部署动作和含自动恢复结果的发布历史。

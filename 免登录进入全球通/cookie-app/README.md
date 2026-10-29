# cookie-app

`cookie-app` 是“免登录进入中国移动/全球通”方向的工程化版本，负责账号登录态管理、Cookie/Token 刷新、全球通签到和公共链接绑定。

## 业务订购

V2 管理台已提供管理员专用的业务订购工作台，覆盖登录验证码、登录、产品与协议查询、订购验证码和确认订购。默认支持全球通卓越钻石卡合约，并允许在核对匹配的 `pageId`、`touchCode` 后更换 `productCode`。

- [业务流程与接口说明](./docs/global-diamond-order-business-api.md)
- [产品与开发设计](./docs/global-diamond-order-product-development.md)
- [北京移动 5GA 活动订购分析与开发设计](./docs/bmcc-5ga-activity-order.md)

## 当前架构

- 前端：React + Vite + TypeScript
- 后端：Express + TypeScript
- 主存储：PostgreSQL + Prisma
- 敏感字段加密：AES-256-GCM
- 批量任务：Node worker 或 Go worker

## 运行要求

运行前必须提供：

- `DATABASE_URL`
- `CMCC_DB_ENCRYPTION_KEY`
- `ADMIN_KEY`

未配置完整时，服务会在启动阶段直接失败，不再回退到 JSON 文件存储。

## 服务端登录护栏

默认策略已经偏向“去自动登录化”：

- `CMCC_PUBLIC_SERVICE_LOGIN_ENABLED=1`
  公共链接页默认开启服务端短信登录。
- `CMCC_ADMIN_SERVICE_LOGIN_ENABLED=1`
  管理员侧默认保留手动服务端登录能力；如需彻底关闭，可设为 `0`。
- `CMCC_SERVICE_LOGIN_GLOBAL_COOLDOWN_SECONDS=15`
  全局服务端登录冷却，避免同一时间段集中触发。
- `CMCC_SERVICE_SMS_SEND_COOLDOWN_SECONDS=90`
  同一手机号服务端发送验证码冷却。
- `CMCC_SERVICE_SMS_LOGIN_COOLDOWN_SECONDS=180`
  同一手机号服务端验证码登录冷却。
- `CMCC_SMS_LOGIN_REMINDER_HOURS=12`
  距离 `smsLoginExpireAt` 小于该阈值时，向专属链接 PushPlus 发送到期提醒。
- `CMCC_SMS_LOGIN_REMINDER_COOLDOWN_MIN=360`
  同一账号的到期提醒最短发送间隔，避免重复提醒。

专属链接页默认保留手机号验证码登录与全球通登录入口；如需关闭公共页服务端登录，可改环境变量：

```bash
CMCC_PUBLIC_SERVICE_LOGIN_ENABLED=0
```

## 最简单的启动方式

如果你本机装了 Docker，可以直接按下面做：

```bash
npm install
APP_ENV=development npm run setup:env
APP_ENV=development npm run start:dev
```

这会自动完成：

- 生成开发环境配置文件
- 让 `.env.development` 中的 `DATABASE_URL` 自动匹配 Docker 里的 PostgreSQL 账号
- 默认使用 `55432` 端口，避开本机已有 PostgreSQL 的 `5432` 冲突
- 启动 PostgreSQL 容器
- 自动建库建表
- 如果检测到旧 JSON 数据且数据库为空，自动导入一次
- 启动前端和后端

如果你已经有一套本机 PostgreSQL 在用，可以在环境文件里设置：

```bash
USE_DOCKER_POSTGRES=0
```

这时启动脚本会直接使用 `DATABASE_URL` 指向的现有数据库，不再启动 Docker PostgreSQL。

## 常用命令

```bash
npm run db:generate
npm run db:migrate
npm run server:dev
npm run dev
```

数据库相关：

```bash
APP_ENV=development npm run db:up
APP_ENV=development npm run db:init
APP_ENV=development npm run db:down
```

生产部署：

```bash
npm run db:deploy
npm run build
```

每次代码修改后使用统一发布命令（源码先提交Git）：

```bash
npm run release
```

发布会依次运行检查与测试，在临时目录构建，生成 `.deploy/dist-<版本>.tar.gz`，将 `dist` 指向新产物并重载本仓库的 PM2 `cookie-app` 服务。随后核对本机和 `https://home.1008086.xyz` 的API进程版本、页面资源名及资源内容；任一步骤失败均不报告发布成功。`/api/health` 的 `data.release` 和 `serverStartedAt` 可用来确认后端已更新，健康响应禁用缓存。

前端切换保留最近构建的哈希资源，已打开页面仍可加载旧资源。测试/构建失败保留在线dist；切换后的验证失败会恢复上一版dist并尝试重载，但不会自动回滚Git源码或数据库。服务重载会清除内存订购会话；发布不会主动触发短信、订购或数据库迁移。`.deploy` 保存日志、压缩包与历次产物，不进入Git。

可通过 `PM2_CLI` 指定PM2脚本路径、`GIT_BIN` 指定Git程序、`PUBLIC_BASE_URL`指定公网验证地址；服务名称默认cookie-app，且工作目录必须与本仓库一致。发布不修改已有PM2运行环境。

## 备份

```bash
APP_ENV=production npm run db:backup
```

恢复：

```bash
APP_ENV=production npm run db:restore -- ./backups/production/xxx.sql.gz
```

## 历史 JSON 数据迁移

若之前数据仍保存在 `data/cmcc-accounts.json` 和 `data/public-links.json`，可执行：

```bash
npm run db:import
```

这一步只用于一次性导入，导入完成后运行时不会再使用 JSON 文件。

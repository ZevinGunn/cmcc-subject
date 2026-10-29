# PostgreSQL 持久化说明（cookie-app）

当前项目运行时已经统一使用 **PostgreSQL + Prisma** 作为主存储。

旧的 `data/*.json` 文件只保留为一次性导入来源，不再作为运行时存储。

- 必须持久化
  - 账号（Account）
  - 专属链接及绑定关系（PublicLink / PublicLinkAccount）
  - 服务端操作日志（LogEntry）
- 不持久化
  - 当天签到缓存、当天展示缓存等：继续由前端 `localStorage (cmcc_*)` 负责

## 1. 安装与启动 PostgreSQL（Mac mini）

如果你用 Homebrew：

```bash
brew install postgresql@16
brew services start postgresql@16
```

创建数据库（示例库名 `cmcc_cookie_app`）：

```bash
createdb cmcc_cookie_app
```

## 2. 配置环境变量

复制并编辑 `cookie-app/.env`：

```bash
cp .env.example .env
```

建议同时准备多环境文件：

- `.env.development`
- `.env.staging`
- `.env.production`

核心变量如下：

```bash
DATABASE_URL="postgresql://USER:CHANGE_ME_PASSWORD@127.0.0.1:5432/cmcc_cookie_app?schema=public"
CMCC_DB_ENCRYPTION_KEY="base64-32-bytes"
```

生成加密 key：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

说明：
- `CMCC_DB_ENCRYPTION_KEY` 用于对 Cookie / Headers / newHomeUrl / token / qqtInfo / 日志 meta 等敏感字段做 AES-256-GCM 加密后落库。
- `DATABASE_URL` 必须是 PostgreSQL 连接串；MySQL/SQLite 不再支持。
- 如果未设置 `DATABASE_URL`、`CMCC_DB_ENCRYPTION_KEY` 或 `ADMIN_KEY`，服务会在启动时直接失败。

## 3. 安装依赖（pnpm）

本仓库以 `pnpm` 为准（不要在 `cookie-app/` 用 `npm i` 混装）：

```bash
corepack enable
corepack prepare pnpm@10.23.0 --activate
pnpm install
```

## 4. 建表迁移

如果你不想手工创建数据库，推荐直接用 Docker：

```bash
APP_ENV=development npm run setup:env
APP_ENV=development npm run db:init
```

这会自动：

- 生成 `.env.development` 和 `.env.docker`
- 启动本地 PostgreSQL
- 执行 Prisma migration
- 自动尝试导入旧 JSON 数据

如果你已经有现成 PostgreSQL，可在 `.env.<env>` 中设置：

```bash
USE_DOCKER_POSTGRES=0
```

这样 `db:init` 只会执行 Prisma migration 和导入逻辑，不会启动 Docker 容器。

开发环境：

```bash
pnpm db:migrate
```

生产环境（部署时）：

```bash
pnpm db:deploy
```

## 5. 从 JSON 导入到数据库（一次性）

会读取历史文件：

- `ACCOUNTS_STORE_PATH`（默认 `data/cmcc-accounts.json`）
- `PUBLIC_LINKS_STORE_PATH`（默认 `data/public-links.json`）

执行：

```bash
pnpm db:import
```

## 6. 启动后端

```bash
pnpm server:dev
```

或前后端一起：

```bash
pnpm dev
```

如果要走一键流程：

```bash
APP_ENV=development npm run start:dev
```

## 7. 备份与恢复

备份：

```bash
npm run db:backup
```

恢复：

```bash
npm run db:restore -- ./backups/production/your-backup.sql.gz
```

可用环境变量：

- `APP_ENV`：选择 `.env.<APP_ENV>`，默认 `development`
- `ENV_FILE`：显式指定环境文件
- `PG_BACKUP_DIR`：备份输出目录
- `PG_BACKUP_RETENTION_DAYS`：保留天数

应用启动后默认会每 24 小时自动备份，也可以在 V2「系统设置」中查看状态或立即执行。若使用外部 cron，请关闭内置备份以避免重复：

```bash
0 3 * * * cd /path/to/cookie-app && APP_ENV=production npm run db:backup
```

内置维护相关环境变量：

- `DB_MAINTENANCE_ENABLED`：总开关，默认 `true`
- `DB_BACKUP_ENABLED` / `DB_BACKUP_INTERVAL_HOURS`：定期备份开关和周期
- `DB_CLEANUP_ENABLED` / `DB_CLEANUP_INTERVAL_HOURS`：过期数据清理开关和周期
- `DB_SESSION_RETENTION_DAYS`：过期或已撤销用户会话保留天数
- `DB_LOG_RETENTION_DAYS`：操作日志保留天数
- `DB_TASK_RETENTION_DAYS`：已结束任务保留天数
- `DB_SCHEDULE_FIRE_RETENTION_DAYS`：调度触发记录保留天数
- `DB_DAILY_STATE_RETENTION_DAYS`：已结束每日任务状态保留天数

自动清理不会删除账号、登录凭据、用户、产品库、活动调度或运行中的任务。

## 8. 安全建议

- 不要把 Postgres 直接暴露到公网；应用和 DB 走同机 `127.0.0.1` 连接即可。
- `DATABASE_URL` 与 `CMCC_DB_ENCRYPTION_KEY` 放在服务器环境变量或 `.env`，不要提交到仓库。
- 为其他项目提供只读数据库账号，或者优先通过本项目 API 访问，避免多个项目直接写同一批业务表。

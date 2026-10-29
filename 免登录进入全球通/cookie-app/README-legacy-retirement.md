# 老库退役说明

当前主库已经切换为 Docker PostgreSQL：

- 主库地址：`127.0.0.1:55432`
- 主库用户：`cmcc_user`
- 主库库名：`cmcc_cookie_app`

原来的本机 PostgreSQL 老库：

- 地址：`127.0.0.1:5432`
- 用户：`ZevinGunn`
- 库名：`cmcc_cookie_app`

已经不再作为运行主库使用。

## 退役步骤

### 1. 备份老库

```bash
LEGACY_DATABASE_URL="postgresql://ZevinGunn@127.0.0.1:5432/cmcc_cookie_app?schema=public" \
npm run db:backup:legacy
```

### 2. 将老库标记为只读

```bash
LEGACY_DB_HOST=127.0.0.1 \
LEGACY_DB_PORT=5432 \
LEGACY_DB_USER=ZevinGunn \
LEGACY_DB_NAME=cmcc_cookie_app \
npm run db:retire:legacy
```

脚本会执行：

- `ALTER DATABASE ... SET default_transaction_read_only = on`
- 给数据库写入退役备注

## 当前推荐做法

- 开发和运行只使用 `.env.development` 中的 Docker 新库配置
- 不要再把 `DATABASE_URL` 改回 `127.0.0.1:5432`
- 老库只作为历史备份和应急核对使用

## 如需回滚

如果必须临时恢复老库写入，可手动执行：

```sql
ALTER DATABASE "cmcc_cookie_app" SET default_transaction_read_only = off;
```

但正常情况下不建议这样做。

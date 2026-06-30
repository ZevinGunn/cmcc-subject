# 北京电信本地助手

本项目用于本机管理多个北京电信手机号的 WAP 登录会话，查询余额、账单候选接口和权益活动，并手动触发权益领取。

## 运行

```bash
pnpm install
pnpm run dev
```

- 前端：http://127.0.0.1:5711
- 后端：http://127.0.0.1:5710

默认 Playwright 使用无头浏览器。如果电信 WAP 风控要求人工验证，可以用：

```bash
CT189_HEADLESS=false pnpm --filter ct189-local-backend run dev
```

## 一期功能

- 多手机号本地管理
- 服务密码登录
- 当前登录号码确认
- 活动 310 资格/说明查询
- 活动 310 手动领取/抽奖
- 余额/账单候选接口接入
- 原始响应和操作日志查看

## 本地数据

数据保存于：

- `backend/data/accounts.json`
- `backend/data/browser/<accountId>/`

这些目录包含本地 cookie/session，请勿提交到仓库或发给他人。

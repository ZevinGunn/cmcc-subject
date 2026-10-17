# 晋速办公网版

入口：`https://project.1008086.xyz/apps/shanxi/`，也可从 Project Ops `/home` 或 V2 服务中心进入。

必须先登录 Project Ops。平台所有者可直接进入，其他管理员须拥有 `shanxi` 项目权限。平台会话过期后须重新登录平台，已保存的移动登录缓存不会因此清空；恢复移动登录时仍由官方校验有效期。

公网版与本机版使用相同的验证码登录、业务查询、自定义配置、多账号管理及订购流程。公网版不提供服务器图形窗口，官方要求人工页面验证时会提示使用本机版或稍后重试。公网真实短信送达与真实订购仍需持号用户操作确认，部署验证不自动触发短信或订购。

## 运行与保存

- PM2 服务：`shanxi-public`，Node 20+，仅监听 `127.0.0.1:4319`。
- Project Ops 的受保护网关校验实时平台会话与项目权限，剥离外来身份头和 Cookie，再签署租户、请求方法、路径及时间。后端拒绝缺少有效签名的请求。
- 每个管理员 ID 对应 `.public/users/<SHA-256>/` 独立目录，移动账号缓存使用各自 AES-GCM 密钥加密；配置、操作锁、CSRF、账号选择、订单记录也独立。
- `.local/` 不迁移、不公开。`.public/`、`dist-public/` 均不纳入 Git。备份时保留运行目录与其中密钥，不能只备份加密文件。
- 30 分钟无请求且无业务执行的租户释放浏览器与内存；再次进入从持久缓存恢复。最多同时保留 32 个租户上下文，达到限制时明确返回繁忙。
- 网关入口属于 Project Ops；其重启会使平台会话失效。公网订购服务单独运行，正常重启等待现有请求结束。无法确定的订单仍保留待核查状态，不自动重试订购。

## 部署

在项目根目录执行：

```sh
npm test
npm run build
npm run build:public
npm run test:ui
node test/ui-acceptance.mjs --public
node scripts/prepare-public.mjs
pm2 start ecosystem.public.config.cjs --only shanxi-public
```

已存在服务时用 `pm2 restart shanxi-public`；网关代码或项目目录变更时仅重启 `project-manager`。提交验证通过的源码后再切换服务。配置未改变时不需要重载 Nginx 或隧道。

验收需确认匿名页面跳转登录、匿名 API 返回 401、平台登录后实际页面与版本化 JS/CSS 内容匹配 `dist-public/`，并核查项目入口 URL。安全测试覆盖签名篡改、跨租户配置与 CSRF、外站来源、远程窗口禁用和空闲恢复。UI 全流程通过离线夹具验证，不访问真实移动业务接口。

回退网关时保留已有平台修改，仅撤销本次接入对应代码；回退晋速办时恢复上一个源码与构建版本，并仅重启 `shanxi-public`。运行数据和网关密钥始终保留，不用清空缓存解决部署问题。

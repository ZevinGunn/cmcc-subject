# 晋速办公网版

独立服务地址：**https://shanxi.1008086.xyz/**。直接打开晋速办，使用山西移动短信登录，无需登录 Project Ops。

**https://project.1008086.xyz/home 仅用于项目维护**，保留进程状态、日志、重启及新服务入口。旧 `/apps/shanxi/` 页面跳转新域名，旧业务 API 返回 410，不转发短信或订单。

公网版与本机版支持相同的验证码登录、业务查询、自定义配置、多账号管理和订购流程。公网版不提供服务器图形窗口，官方要求人工页面验证时会提示使用本机版或稍后重试。部署验证不发送真实短信或提交真实订单。

1.5 起两版均提供“加解密工具”，包含入参和响应的加密/解密、可选 RSA 请求头生成、签名校验及复制。无需移动账号；保留本站 Cookie、Origin、CSRF 保护。计算只在当前服务内存完成，不记录输入或密钥，也不调用官方业务接口。

## 缓存和访问边界

- 每个浏览器获得随机、签名的 `__Host-shanxi_workspace` Cookie，带 Secure、HttpOnly、SameSite=Strict 属性，仅属于新域名。最长保存一年，移动登录有效期仍由官方决定。
- 同一浏览器刷新、关闭再打开及服务重启后，通过原 Cookie 恢复缓存。不同浏览器、设备或清除 Cookie 后使用独立缓存空间；跨设备不自动同步移动账号。
- `.public/users/<SHA-256>/` 分别保存 AES-GCM 加密的账号会话、业务配置和订单，CSRF、当前账号及验证码流程独立。伪造旧平台身份头无法选择其他空间。
- `.local/` 和原平台账号目录保留，不迁移给匿名访客。签名密钥沿用 `.public/gateway-key` 文件名，备份需保留密钥和运行数据，不能只备份加密文件。
- 写接口同时要求本站 Origin、浏览器缓存凭据和随机 CSRF。仍需完成移动短信登录和单笔订单确认才能订购。
- 同一来源网络最多 10 次短信请求 / 10 分钟，清除浏览器 Cookie 不重置限制。原有账号、验证码和订购防重复保护继续生效。
- 30 分钟无请求且无业务执行的空间释放浏览器与内存，最多同时保留 32 个空间上下文。容量已满时明确提示繁忙，不覆盖其他用户的数据。

## 独立服务部署

PM2 进程：`shanxi-public`（127.0.0.1:4319）与 `shanxi-tunnel`。使用单独的 `cmcc-shanxi` Cloudflare Tunnel，直接连到回环服务，无需修改或重载其他域名的 Nginx、共享隧道。

在本目录完成测试、构建并提交后执行：

```sh
npm test
npm run build
npm run build:public
npm run test:ui
node test/ui-acceptance.mjs --public
node test/ui-acceptance.mjs --public --config
node scripts/publish-domain.mjs
```

发布脚本创建或复用准确命名的独立隧道，校验 ingress 后添加新 DNS，不覆盖已有无关 DNS，只更新晋速办两个进程并保存 PM2 配置。隧道凭据保存在用户 `.cloudflared/`，生成配置在 `.public/tunnel.yml`；不提交凭据、缓存和构建产物。需要本机已授权的 Cloudflare 证书与 PM2，命令路径可通过 `CLOUDFLARED_BIN`、`PM2_BIN` 覆盖。

服务清单或旧地址跳转规则改变时，检查无在途运维操作，再单独重启 `project-manager`。这仅更新维护入口，独立站运行不依赖平台会话。

仅晋速办应用代码更新时，无需重新配置 DNS、运行隧道发布脚本或重启隧道。先用 `npm run build:public -- --outDir <绝对暂存目录>` 构建，设置 `UI_FIXTURE_DIST=<绝对暂存目录>` 运行 `node test/ui-crypto.mjs --public` 及原有公网离线流程。测试并提交后保留旧 `dist-public`，将通过验证的暂存产物切换到 `dist-public`，仅重启 PM2 `shanxi-public`。随后运行 `node test/ui-crypto.mjs --live` 用合成数据核验实际独立域名四种操作，并比较公网资源哈希与部署产物。失败时恢复旧源码及旧产物并重启此进程。

验收需核对实际 HTTPS 首页、版本、JS/CSS/图标哈希，确认无需平台登录、手机页面正常、不同浏览器缓存隔离以及原管理页链接正确。旧地址只跳转页面，订购与短信 API 必须拒绝重放。

回退时恢复晋速办上一个源码与构建版本，仅更新准确对应的进程；保留运行数据及所有密钥。独立隧道配置的前一版本保存在 `.public/tunnel.yml.previous`。不清空缓存，不更改其他域名 DNS 或共享隧道。

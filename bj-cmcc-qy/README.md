# 北京移动权益一条龙

新项目目录，基于原始线上 JS bundle 还原接口封装，提供本地后端代理和 Vue 工作台。

## 目录

- `backend/src/bmccClient.js`：`/rights-intf/api/outer/invoke.do` AES-CBC、SHA256 签名、统一响应解析。
- `backend/src/services`：登录、券、权益、兑换、订单服务。
- `frontend/src/App.vue`：一屏式操作台。
- `vendor/original`：从原项目复制的关键 JS 和 Plus 纯享包数据，方便继续溯源。

## 运行

当前环境如 `node` 不在 PATH，先临时加入 Codex bundled Node：

```bash
export PATH="/Users/ZevinGunn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
```

安装：

```bash
npm run install:all
```

开发：

```bash
npm run dev
```

单独启动：

```bash
npm --prefix backend run start
npm --prefix frontend run dev
```

访问：

```txt
http://localhost:5174/
```

## 部署文档

- 本地与服务器部署：[docs/LOCAL_DEPLOY.md](/Users/ZevinGunn/Desktop/一些小项目/北京移动权益获取/bmcc-rights-one-stop/docs/LOCAL_DEPLOY.md)
- Nginx 代理到 `http://zevingunn.dns.army:5703/`：[docs/NGINX_PROXY_5703.md](/Users/ZevinGunn/Desktop/一些小项目/北京移动权益获取/bmcc-rights-one-stop/docs/NGINX_PROXY_5703.md)

## 已实现功能

- 短信登录：`SMS_VERI_CODE_SEND`、`APP_LOGIN_CHK_SMS`
- Plus 券数量：`COUPON_INFO_QRY`
- 权益列表/详情：`RIGHTS_INFO_TELE_PAGE`
- Plus 纯享包本地清单：来自 `vendor/original/plus-packages.json`
- 兑换预览：自动补齐 `offerId/rightCode/rightId/certificateId/certificateNum`
- 兑换提交：`COUPON_OPEN_TEL_FEE_AUTH`，必须 `confirmed=true`
- 订单列表：`COUPON_RECODES_QRY`
- 订单详情：`GET_ORDER_DETAIL_INFO`
- 调试调用：`POST /api/debug/invoke`

## 关键常量

```txt
AES-CBC key: A9B6C6D8E4F3G2H1
AES-CBC iv:  3468546098617985
accessToken: 1924d545b02f4de6b26e017253a5dd2d
通用券 certificateId: 1387830401690525697
特殊专属券 certificateId: 2035955123043438593
```

## 注意

兑换提交会真实请求北京移动接口。前端按钮和后端路由都保留二次确认，避免误点误兑。

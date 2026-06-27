# 本地与服务器部署文档

本文档适用于项目：

`/Users/ZevinGunn/Desktop/一些小项目/北京移动权益获取/bmcc-rights-one-stop`

推荐的生产部署方式：

- 前端：`Vite build` 产物交给 `Nginx`
- 后端：`Node.js` 常驻运行在 `3010`
- 反向代理：`Nginx` 将 `/api` 转发到后端

## 1. 环境要求

- Node.js 18+，推荐 Node.js 20+
- npm 9+
- Linux 服务器推荐 Ubuntu 22.04 / Debian 12 / CentOS Stream 9
- Nginx 1.20+

本项目默认端口：

- 前端开发：`5174`
- 后端接口：`3010`

## 2. 上传项目

把整个项目目录上传到服务器，例如：

```bash
/srv/bmcc-rights-one-stop
```

示例：

```bash
mkdir -p /srv/bmcc-rights-one-stop
```

## 3. 安装依赖

进入项目目录：

```bash
cd /srv/bmcc-rights-one-stop
```

安装全部依赖：

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

## 4. 配置后端环境变量

复制环境变量模板：

```bash
cp .env.example .env
```

当前项目默认关键配置如下，通常不需要改：

```env
PORT=3010
BMCC_BASE_URL=https://xcxp.bj.10086.cn/rights-intf
BMCC_SOURCE=Local
BMCC_REQUEST_MODE=encrypted-string
BMCC_ACCESS_TOKEN=1924d545b02f4de6b26e017253a5dd2d
BMCC_AES_KEY=A9B6C6D8E4F3G2H1
BMCC_AES_IV=3468546098617985
BMCC_RETAILER_CODE=BJYDJTAPP001
BMCC_SON_RETAILER_CODE=A004
```

注意：

- 后端代码当前没有自动读取 `.env` 文件。
- 最简单的方式是在 `systemd` 里通过 `Environment=` 或 `EnvironmentFile=` 传入。
- 如果你保持默认值，最少只需要传 `PORT=3010` 也能跑。

## 5. 构建前端

执行：

```bash
npm --prefix frontend run build
```

构建产物目录：

```bash
frontend/dist
```

## 6. 本地验证后端

先启动后端：

```bash
npm --prefix backend run start
```

健康检查：

```bash
curl http://127.0.0.1:3010/api/health
```

如果返回类似：

```json
{"ok":true,"uptime":12.3,"requestMode":"encrypted-string"}
```

说明后端正常。

## 7. 使用 systemd 常驻后端

创建服务文件：

```bash
sudo nano /etc/systemd/system/bmcc-rights.service
```

内容示例：

```ini
[Unit]
Description=BMCC Rights Backend
After=network.target

[Service]
Type=simple
WorkingDirectory=/srv/bmcc-rights-one-stop/backend
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=3
Environment=PORT=3010
Environment=BMCC_BASE_URL=https://xcxp.bj.10086.cn/rights-intf
Environment=BMCC_SOURCE=Local
Environment=BMCC_REQUEST_MODE=encrypted-string
Environment=BMCC_ACCESS_TOKEN=1924d545b02f4de6b26e017253a5dd2d
Environment=BMCC_AES_KEY=A9B6C6D8E4F3G2H1
Environment=BMCC_AES_IV=3468546098617985
Environment=BMCC_RETAILER_CODE=BJYDJTAPP001
Environment=BMCC_SON_RETAILER_CODE=A004
User=root
Group=root

[Install]
WantedBy=multi-user.target
```

如果你的 `node` 不在 `/usr/bin/node`，先查一下真实路径：

```bash
which node
```

然后启动：

```bash
sudo systemctl daemon-reload
sudo systemctl enable bmcc-rights.service
sudo systemctl start bmcc-rights.service
sudo systemctl status bmcc-rights.service
```

查看日志：

```bash
journalctl -u bmcc-rights.service -f
```

## 8. 前端生产访问方式

生产环境不建议继续使用：

```bash
npm --prefix frontend run dev
```

正确方式是：

1. 用 `vite build` 打包
2. 由 `Nginx` 直接托管 `frontend/dist`
3. `Nginx` 代理 `/api` 到 `http://127.0.0.1:3010`

## 9. 开发模式启动

如果你只是临时在服务器上联调，也可以直接开发模式运行：

```bash
npm run dev
```

这会同时启动：

- 后端 `3010`
- 前端 `5174`

但这不适合作为长期正式部署方式。

## 10. 部署后的检查清单

执行顺序建议如下：

1. `curl http://127.0.0.1:3010/api/health`
2. 检查 Nginx 是否能访问首页
3. 打开页面后检查登录
4. 登录后检查：
   - Plus 券数量
   - 权益列表
   - 订单按月查询
   - 单个订单查看券码
   - 批量展示二维码

## 11. 常见问题

`页面能打开，但接口 404`

- 一般是 Nginx 没有代理 `/api`

`页面空白或刷新 404`

- 一般是 Nginx 没配置 `try_files`

`后端启动失败`

- 先执行 `which node`
- 检查 `systemd` 中 `ExecStart` 路径是否正确

`接口返回登录失效`

- 这是业务接口真实返回，不是部署问题
- 需要重新登录获取新的本地会话

## 12. 下一步

Nginx 反向代理配置请看：

`docs/NGINX_PROXY_5703.md`

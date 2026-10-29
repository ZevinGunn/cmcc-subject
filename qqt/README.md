# 自建短信登录代理与前端项目

该目录新增了前后端两个子项目，用于通过 Node.js 代理运营方接口，实现短信验证码登录，并在 Vue3 前端中演示登录流程与用户信息查询。

## 项目结构

```
backend/   # Node.js 代理服务
frontend/  # Vue3 + Vite 前端
```

## 后端代理（backend）

### 安装依赖

```bash
cd backend
npm install
```

### 开发运行

```bash
npm run dev
```

默认监听 `http://localhost:3000`，暴露以下接口：

- `POST /api/sms/send` 发送短信验证码
- `POST /api/login` 验证码登录
- `GET  /api/user/profile` 获取登录后的用户信息
- `POST /api/logout` 退出登录

> 若部署到生产，可使用 `npm start`，并自行配置 HTTPS 证书（如使用 `pm2` 或 `systemd` 进行守护）。

## 前端项目（frontend）

### 安装依赖

```bash
cd frontend
npm install
```

### 开发运行

```bash
npm run dev
```

浏览器访问 `http://localhost:5173`，即可使用示例登录页。  
前端通过 Vite 代理将 `/api` 请求转发至本地 `http://localhost:3000` 后端。

### 构建

```bash
npm run build
```

产物默认输出到 `dist/`，可部署在任意静态服务器并将 `/api` 指向后端服务。

## 证书与 Cookie

- 后端默认启用 CORS 和 `withCredentials`，方便在 HTTPS 场景下透传 `xhmqqthy-user-cookie` 等登录态。
- 正式环境建议启用 HTTPS，并为 `Set-Cookie` 添加 `Secure`、`HttpOnly`、`SameSite=None` 等属性。

## 其他说明

- `backend/src/config.js` 中可自定义目标接口、SM2 公钥、AES 密钥与默认 `sspId`。
- 前端 `src/views/Login.vue` 提供折叠式 UI、倒计时与错误提示，可根据业务继续扩展埋点、协议链接等内容。


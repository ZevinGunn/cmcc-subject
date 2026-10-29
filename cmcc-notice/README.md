# 资费公示公告查询（前端解密版）

该项目调用接口 `https://h.app.coc.10086.cn/biz-orange/DH/tariff/personal/announcement/list`。
服务端仅负责加密请求和转发响应，前端使用 AES-CBC 解密并展示公告内容。

## 启动

```bash
npm install
npm start
```

默认打开 `http://localhost:3111`。

工具页面：`http://localhost:3111/tools.html`

服务默认监听 `0.0.0.0`，启动后可通过本机局域网 IP 访问，例如 `http://192.168.1.10:3111`。

## 环境变量

```
PORT=3111
HOST=0.0.0.0
APP_ENV=formal
BASE_HOST=https://h.app.coc.10086.cn
API_PATH=/biz-orange/DH/tariff/personal/announcement/list
```

## 接口

- `GET /api/announcements`
  - 返回字段 `body`（加密内容），由前端解密

- `GET /api/health`

## 说明

- 前端解密默认使用正式环境密钥。
- 若要切换灰度环境，请同步修改前端密钥与 `APP_ENV=gray`。

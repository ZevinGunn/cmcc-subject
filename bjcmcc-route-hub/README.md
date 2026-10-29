# 北京移动业务与权益快捷入口

聚合两个北京移动页面来源，提供搜索、收藏、关联页面查看、微信免登录入口和独立增量导入：

- 业务：`service.bj.10086.cn/nwt/portal/assets/js/index-*.js`
- 权益：`xcxp.bj.10086.cn/rights-front/dist/umi.js`

业务使用 History 路由地址，权益使用 `index.html#/path` Hash 路由地址。两个目录分别保存版本历史和回滚快照。

## 本地开发

```bash
npm run install:all
npm run dev
```

- 前端开发服务：`http://127.0.0.1:5180`
- 后端及生产静态站点：`http://127.0.0.1:8790`

## 测试与构建

```bash
npm test
npm run build
npm start
```

导入管理口令依次读取 `ROUTE_HUB_ADMIN_PASSWORD`、项目管理后台的 `MANAGER_PASSWORD`。生产环境由 PM2 管理，公网地址为 `https://bjcmcc.1008086.xyz/`。

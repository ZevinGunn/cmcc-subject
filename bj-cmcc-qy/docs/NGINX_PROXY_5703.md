# Nginx 反向代理文档

目标域名：

`http://zevingunn.dns.army:5703/`

推荐方案：

- Nginx 监听 `5703`
- 前端静态文件来自：
  `/srv/bmcc-rights-one-stop/frontend/dist`
- `/api` 代理到：
  `http://127.0.0.1:3010`

## 1. 前置条件

确保后端已经常驻运行：

```bash
curl http://127.0.0.1:3010/api/health
```

确保前端已经打包：

```bash
cd /srv/bmcc-rights-one-stop
npm --prefix frontend run build
```

## 2. Nginx 站点配置

创建配置文件：

```bash
sudo nano /etc/nginx/conf.d/bmcc-rights-5703.conf
```

写入以下内容：

```nginx
server {
    listen 5703;
    server_name zevingunn.dns.army;

    root /srv/bmcc-rights-one-stop/frontend/dist;
    index index.html;

    client_max_body_size 10m;

    location /api/ {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_read_timeout 120s;
        proxy_connect_timeout 30s;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 3. 检查并重载 Nginx

检查配置：

```bash
sudo nginx -t
```

重载：

```bash
sudo systemctl reload nginx
```

如果 Nginx 未启动：

```bash
sudo systemctl enable nginx
sudo systemctl start nginx
```

## 4. 防火墙放行 5703

如果你用了 `ufw`：

```bash
sudo ufw allow 5703/tcp
sudo ufw reload
```

如果你用了云服务器安全组，也要额外放行：

- TCP
- 端口 `5703`
- 来源 `0.0.0.0/0` 或你自己的访问范围

## 5. 访问验证

浏览器访问：

```txt
http://zevingunn.dns.army:5703/
```

接口验证：

```bash
curl http://zevingunn.dns.army:5703/api/health
```

## 6. 可选：启用 HTTPS

如果你后续要启用 HTTPS，通常有两种方式：

1. 保留端口 `5703` 只走 HTTP
2. 改成标准 `80/443`，用 `Certbot` 或现有证书接入

如果你希望继续使用 `5703` 并加 HTTPS，也可以额外配置：

```nginx
server {
    listen 5703 ssl;
    server_name zevingunn.dns.army;

    ssl_certificate     /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    root /srv/bmcc-rights-one-stop/frontend/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

注意：

- 自定义端口 HTTPS 需要浏览器访问 `https://zevingunn.dns.army:5703/`
- 如果你只配了 HTTP，访问时要明确使用 `http://`

## 7. 常见问题

`访问首页 502`

- 后端 `3010` 没启动
- 用 `curl http://127.0.0.1:3010/api/health` 检查

`刷新页面 404`

- 缺少：
  `try_files $uri $uri/ /index.html;`

`静态资源 404`

- `root` 目录不对
- 确认 `frontend/dist/index.html` 实际存在

`域名访问不到`

- DNS 没解析到服务器
- 5703 端口没放开
- Nginx 没监听 5703

## 8. 推荐目录结构

建议部署目录：

```txt
/srv/bmcc-rights-one-stop
├── backend
├── frontend
│   └── dist
├── docs
├── package.json
└── .env
```

# 咪咕业务快速订购原型

围绕 `xyw.bj` 营销业务构建的本地操作页面，默认配置为咪咕视频会员年包合约。前端为原生 HTML/JavaScript，后端使用 Python 标准库 `ThreadingHTTPServer` 代理上游请求。

## 已实现功能

- 查询页面状态、活动状态、商品内容及登录后的订购确认信息。
- 获取登录短信、提交登录验证码，并维护当前浏览器对应的内存会话。
- 单独发送订购确认短信，再使用订购验证码提交最终订购请求。
- 在页面新增和维护业务配置，保存到 `config/products.json`。
- 提供会话重置、上游网络诊断、RSA 入参加密与 JSON/Base64 返回内容解析。
- 上游调用包含 urllib 与 curl 后备实现，执行结果在页面展示。

登录验证码和订购验证码分别对应两个阶段。页面中的商品资费来自配置或上游内容，不代表任意账号均有办理资格；接口受理结果以官方响应为准。

## 启动

使用支持该源码的 Python 3 环境，无需安装第三方 Python 包：

```bash
python3 server.py
```

默认访问 `http://127.0.0.1:5708`。可修改监听地址和端口：

```bash
python3 server.py --host 127.0.0.1 --port 5708
```

正常操作顺序：选择业务 → 查询活动/商品 → 登录短信 → 验证码登录 → 核对订购确认信息 → 订购短信 → 最终确认。只有用户主动执行对应步骤才会请求相应接口。

## 主要文件与接口

| 路径 | 作用 |
| --- | --- |
| `server.py` | 配置读写、会话、静态服务、上游请求与诊断 |
| `config/products.json` | 业务标识、商品、活动及接口配置 |
| `public/index.html` | 操作页面、业务配置和解析弹窗 |
| `public/app.js` | 页面状态、RSA 加密及分阶段 API 调用 |

| 本地接口 | 用途 |
| --- | --- |
| `GET /api/products`、`POST /api/products` | 读取/保存业务配置 |
| `GET /api/session`、`POST /api/reset-session` | 查看/重置当前会话 |
| `POST /api/status`、`/api/market-status`、`/api/product-info` | 查询页面、活动和商品 |
| `POST /api/login/send`、`/api/login/confirm` | 登录短信与验证码登录 |
| `POST /api/order/info`、`/api/order/send`、`/api/order/confirm` | 确认信息、订购短信和提交 |
| `POST /api/network-check` | 网络诊断 |

## 当前实现边界

这是本地协议调试原型。当前配置写入接口没有管理员认证；服务端 urllib 上游连接关闭了证书与主机名校验。因此应保持可信本地使用，公网接入前需要补齐访问控制和正常 TLS 校验。

会话保存在进程内存中，服务重启后需要重新登录。RSA 工具可以用公钥加密新入参，不能仅凭公钥解密已有 RSA 密文。源码提供流程实现，不表示本次文档整理执行了真实短信发送或订购验收。

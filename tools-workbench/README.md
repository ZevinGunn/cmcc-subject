# Tools 工具工作台

面向 PC Web 与手机 H5 的本地处理工具集，公网入口为 `https://tools.1008086.xyz/`。

## 功能

- 统一前缀与 Query 参数/后缀拼接，可选对后缀执行 URL Encode，并直接转二维码。
- 摄像头连续扫码、多图片批量解码、记录自定义/自动命名、去重与 CSV 导出。
- 文本逐行批量生成二维码，支持题注、中心图标、颜色和点阵样式。
- AES 口令加密解密、URL 编解码、JSON 格式化/压缩/解转义、QX URL 正则生成。

AES 使用 CryptoJS/OpenSSL 兼容的口令格式。密钥、文本、图片与扫码记录均只在浏览器本地处理，不发送到服务端。

## 开发与验证

```bash
npm install
npm run dev
npm run check
```

生产静态服务默认监听 `127.0.0.1:4177`，健康检查为 `/api/health`。

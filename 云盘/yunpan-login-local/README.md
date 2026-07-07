# 云盘登录本地工作台

本项目封装中国移动云盘 H5 登录链路：获取 RSA 公钥、发送短信验证码、短信登录保存 `authToken/token/Authorization`、获取 `ssoToken`、生成带认证参数的跳转 URL。

## 启动

```bash
cd /Users/ZevinGunn/CMCC-PROJECT/云盘/yunpan-login-local
npm start
```

访问：

```text
http://localhost:7399
```

## 推荐流程

1. 输入手机号。通常可直接点“发送验证码”，系统会自动准备 RSA 公钥和 AESKey。
2. 如果短信接口提示需要人机验证，点击“打开官方滑块验证”，完成后页面会自动填入 `puzzleToken`。
3. 再次点击“发送验证码”，等待云盘短信验证码。
4. 输入短信验证码，点击“登录并保存 Token”。
5. 登录成功后系统会尝试自动获取 `toSourceId=017018` 的 `ssoToken`，并生成 10086 flowShop 跳转链接。
6. 如需手动刷新，点击“生成 10086 跳转”；如需其他业务地址，输入自定义跳转链接后点击“生成认证链接”。

“公钥”按钮保留为调试入口；正常使用时不需要手动点。

## 本地文件

- `src/cryptoBox.js`：AES/RSA/mcloud-sign/Authorization。
- `src/yunpanClient.js`：云盘远端接口封装。
- `src/sessionStore.js`：本地会话持久化。
- `src/server.js`：本地 API 和静态文件服务。
- `public/`：前端工作台。
- `data/session.json`：运行后生成的本地会话文件，包含 token，注意不要提交或外传。

登录成功后，项目会把账号、`authToken`、加密 `token`、`Authorization`、最近一次 `ssoToken`、最近生成的跳转链接写入 `data/session.json`。刷新页面或重启服务后，页面会自动读取该文件并恢复登录状态展示、手机号、上次生成的认证链接。

## 注意

短信接口和 `querySpecTokenV2` 使用用户域 AES-CBC 加密，登录接口使用 AES-ECB 加密业务体并通过 RSA 加密 AESKey。`authToken` 用于生成业务 `Authorization`，`ssoToken` 需要登录后通过 `querySpecToken` 或 `querySpecTokenV2` 获取。

短信验证码接口当前必须在加密业务体里携带 `random` 随机串；如果只发送 `{ account, reqType }`，服务端会返回 `01000001 随机字符串不能为空`。本项目会在发送短信时生成 16 位随机串并保存到本地 session，方便排查同一轮验证码请求。

注意不要把短信接口的 `random` 带进登录接口。登录接口的加密业务体按成功抓包保持为 `account/dycPwd/loginStyle/ifOpenAccount/setCookie`；多传 `random` 这类短信阶段字段会触发 `1010010001 参数错误`。

滑块验证码不能绕过，也不建议做自动破解。前端接入的是官方 AliyunCaptcha 脚本，完成滑块后会拿到 `captchaVerifyParam` 并写入请求的 `puzzleToken` 字段，由云盘短信接口做最终校验。若网络环境拦截了 `o.alicdn.com`，页面会提示滑块脚本未加载，需要更换网络或放行该域名。

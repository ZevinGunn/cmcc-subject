# 为什么电信 WAP 登录必须依赖浏览器环境

## 结论

本项目面对的不是普通 HTTP API 登录，而是带前置 WAF/风控保护的 WAP 页面登录。  
源码里的业务参数只是一部分，真正发到服务器的请求会被浏览器中的 WAF 脚本二次改写。

因此，纯 Node/Python 脚本直接拼接口并不稳定。更可靠的方式是使用真实浏览器环境，让官方页面和 WAF 脚本自然完成动态参数、cookie 和请求体生成。

## 普通脚本能做什么

普通脚本可以轻松完成这些固定逻辑：

```text
手机号输入
服务密码 3DES 加密
POST /wap2017/re/wapFree/cancelAccount/passwordCheck
POST /wap2017/re/activity/qryLoginAccno
```

从业务源码看，服务密码登录确实只做了：

```text
password = 3DES(password, "askgakjgidign399ew3593er", "2156ghrb")
body = { phoneNum, password }
```

如果这是一个普通后端接口，纯脚本完全可行。

## 实际请求为什么不一样

HAR 里的成功请求不是普通 JSON 请求。

成功请求示例：

```text
POST /wap2017/re/wapFree/cancelAccount/passwordCheck?fQbHda09=动态值

Header:
  fQbHda09: 动态值
  Content-Type: application/json; charset=UTF-8

Cookie:
  0yHmMQUi4f9KO=...
  0yHmMQUi4f9KP=...
  jsession_id_4_wap=...
  dcs_c=...

Body:
  OimJ0PkH=动态加密串
```

也就是说，请求在出浏览器前已经被前置 WAF/加固脚本改写：

```text
业务 body:
  {"phoneNum":"...","password":"..."}

实际网络 body:
  OimJ0PkH=...
```

同时 URL、Header、Cookie 都增加了动态字段。

## 412 响应说明了什么

失败时服务器返回：

```text
HTTP 412
Content-Type: text/html
```

返回内容是 WAF challenge 页面，包含类似：

```html
<script src="/ULsVuZGF6JY1/xxx.e17ed02.js"></script>
<script>_$de();</script>
```

这说明请求没有通过风控前置校验，还没有进入真正的 `passwordCheck` 业务逻辑。  
所以这类失败不能按“服务密码错误”或“业务接口参数错”理解。

## 纯脚本为什么不可靠

纯脚本要想成功，必须完整复刻浏览器里发生的事情：

1. 执行 WAF challenge JavaScript
2. 生成动态 cookie
3. 生成动态 URL 参数
4. 生成动态 header
5. 把业务 body 改写为动态密文 body
6. 维持正确 Referer、Origin、sec-ch-ua、UA、Accept-Language
7. 模拟真实浏览器环境特征
8. 处理脚本更新、风控策略变化、验证码或滑块

这些不是一次性固定参数。它们通常和时间、会话、页面状态、浏览器特征、请求顺序有关。

所以纯脚本不是理论上完全不可行，而是：

```text
逆向成本高
维护成本高
容易被 WAF 更新打断
失败时难定位
对多账号长期使用不稳定
```

## 为什么浏览器自动化更适合

Playwright/Selenium 这类浏览器自动化工具运行的是真实浏览器环境。

浏览器自动化可以让官方页面自己完成：

```text
加载 WAF 脚本
执行 challenge
写入 cookie
劫持 XMLHttpRequest/fetch
生成 fQbHda09
生成 OimJ0PkH
发出真实请求
保存 session
```

这样我们不需要手工复刻 WAF 算法，只需要驱动页面：

```text
打开官方页面
等待 WAF 完成
填写手机号
填写服务密码
点击登录按钮
监听接口响应
保存 cookie/session
```

这条路线更接近真实用户操作，也更容易维护。

## 浏览器自动化也不是万能的

浏览器自动化仍可能遇到：

```text
验证码
滑块
短信二次校验
IP 风控
账号风控
浏览器指纹异常
WAF 脚本升级
```

所以第一次登录建议使用可视化模式：

```bash
CT189_HEADLESS=false pnpm run dev:backend
```

如果出现人工验证，可以手动完成一次。完成后保存浏览器 profile，后续查询可以继续复用该会话。

## 推荐实现路线

本项目推荐从“接口直连”改为“官方页面驱动”。

目标链路：

```text
Vue3 前端
  -> 本地后端
    -> Playwright 持久浏览器上下文
      -> 打开 https://wapbj.189.cn/echnwap/scratchLogon
      -> 等待 WAF cookie 出现
      -> 自动填手机号/服务密码
      -> 点击原站登录按钮
      -> 监听 passwordCheck 响应
      -> 监听 qryLoginAccno 响应
      -> 保存 cookie/session
      -> 后续余额/权益查询复用同一浏览器会话
```

## 判断 WAF 是否就绪

可以检查浏览器上下文是否具备这些 cookie：

```text
0yHmMQUi4f9KO
0yHmMQUi4f9KP
jsession_id_4_wap
dcs_c
```

如果 cookie 缺失，直接请求业务接口大概率会返回 412。

## 工程建议

1. 保留接口直连能力作为调试工具，但不要作为主登录方式。
2. 主登录方式改为 Playwright 驱动官方页面。
3. 每个手机号使用独立 browser profile，避免 cookie 串号。
4. 登录失败时保存 WAF 诊断信息：
   - HTTP status
   - response URL
   - page URL
   - cookie names
   - response content type
5. 第一次登录允许可视化模式，方便人工完成 challenge。
6. 后续查询尽量复用已有 session，不频繁重新登录。

## 一句话总结

纯脚本只能复刻业务参数；这个站点还要求复刻浏览器里的 WAF 执行结果。  
与其逆向并维护整套 WAF 算法，不如使用真实浏览器，让官方页面自己生成合法请求。

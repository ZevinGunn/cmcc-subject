# 北京电信 WAP 登录链路与实现设计

## 结论

`wap电信登录` 不是纯 token 登录项目。HAR 和源码显示，主要登录态在浏览器 cookie 与服务端 session 中：

- `jsession_id_4_wap`
- `dcs_c`
- `grey_nbr`
- WAF 动态 cookie，例如 `0yHmMQUi4f9KO`、`0yHmMQUi4f9KP`
- WAF 动态请求参数/请求头，例如 `fQbHda09`

因此本地项目采用 Playwright 持久浏览器上下文，让官方页面自然生成动态 cookie/header，再在同源页面内执行 `fetch` 调用接口。

## 服务密码登录

源码位置：

- `/Users/ZevinGunn/CMCC-PROJECT/wap电信登录/wapbj.189.cn/echnwap/static/js/chunk-b0083200.56853cec.js`

流程：

1. 打开 `https://wapbj.189.cn/echnwap/scratchLogon`
2. 用户输入手机号和服务密码
3. 前端校验服务密码为数字
4. 使用 `TripleDES-CBC-Pkcs7` 加密服务密码
5. 请求 `POST /wap2017/re/wapFree/cancelAccount/passwordCheck`
6. 请求 `POST /wap2017/re/activity/qryLoginAccno` 确认登录号码

加密参数：

```text
algorithm: des-ede3-cbc
key: askgakjgidign399ew3593er
iv: 2156ghrb
output: base64
```

登录请求 body：

```json
{
  "phoneNum": "手机号",
  "password": "3DES(base64)服务密码"
}
```

成功响应：

```json
{
  "result": 0,
  "retCode": "000000",
  "retMsg": "操作成功",
  "object": null
}
```

## 当前登录号码

接口：

```text
POST /wap2017/re/activity/qryLoginAccno
```

HAR 解码后响应：

```json
{
  "result": 0,
  "retCode": "000000",
  "retMsg": "获取登录后的业务号码成功",
  "object": "13311367607"
}
```

## 权益活动

活动 ID：`310`

查询活动说明：

```text
POST /wap2017/re/wapFree/rightsInterestsAct/queryPreactiveInfo
```

body：

```json
{
  "activeId": "310",
  "channelId": "",
  "staffCode": ""
}
```

查询抽奖资格：

```text
POST /wap2017/re/wapFree/rightsInterestsAct/activityCheckV3
```

body：

```json
{
  "activeId": "310"
}
```

领取/抽奖：

```text
POST /wap2017/re/wapFree/rightsInterestsAct/doCheckRightsInterestsV3
```

body：

```json
{
  "activeId": "310",
  "channelId": "",
  "staffCode": ""
}
```

## 余额与账单候选接口

源码中发现这些接口，但 HAR 未覆盖，需要实号登录后继续验证字段：

```text
POST /wap2017/re/wapFree/balanceNewQuery/queryAllNumBalance
POST /wap2017/re/wapFree/balanceNewQuery/qryAccountBal
POST /wap2017/re/wapFree/balanceNewQuery/queryAccountPackageDetail
POST /wap2017/re/wapFree/balanceNewQuery/queryAccountBill
```

## Token 候选接口

源码中存在：

```text
POST /wap2017/re/wapFree/login/openAccessToken
```

HAR 未出现该接口，所以一期只暴露调试入口，不把它作为主登录态。

## 前端设计

第一屏为工作台：

- 左侧：手机号账号列表、添加账号、登录状态
- 主区：登录确认、余额/账单、权益活动、原始响应和日志
- 权益领取使用手动按钮和确认弹窗

## 后端设计

模块：

- `accountStore.js`：本地账号与日志 JSON 存储
- `crypto189.js`：3DES 加密、base64 响应解包、手机号脱敏
- `telecomClient.js`：Playwright 持久上下文和电信接口封装
- `routes/accounts.js`：账号管理
- `routes/ct189.js`：登录、查询、领取

请求策略：

```text
Vue3
  -> Express API
    -> Playwright persistent context per account
      -> official WAP page
        -> same-origin fetch
```

这样可以保留官方 WAP 的动态 cookie、WAF header、Referer 和 UA 逻辑。

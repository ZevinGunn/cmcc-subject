# 周三拼图话费券库存监控

**当前状态：已按用户要求作废并停用。** 本地配置已关闭，cookie-app 启动入口不再启动该监控。保留源码及历史提交，后续只有重新明确启用需求、补足 App CK 库存查询协议后才恢复。以下说明记录原实现。

cookie-app 后台每 15 分钟执行一次，库存不变也推送。服务启动会检查是否到期；最近一次执行时间保存到本地，重载服务不会重复发送。单轮按账号互斥，跨进程锁避免 PM2 重载时重叠执行。启动 cookie-app 后无需打开浏览器。

## 已验证的接口和限制

2026-10-14 核对官方当前源码 `index.D8MnA_li.js`、`hooks.Du_Zb5Ej.js`，以及已有源码压缩包、请求示例；并使用用户授权的尾号 4812 账号实测只读查询。

| 接口（POST，JSON `{}`） | 用途 |
| --- | --- |
| `/hlwyxhdhub/api/wedrecharge/queryPictureActInfo` | `r4Status` 为八折、`r5Status` 为九折的奖励状态 |
| `/hlwyxhdhub/api/wedrecharge/getPrizeList` | 本账号奖品；`fee_r4` 为八折，`fee_r5` 为九折；库存字段为 `stock` |

响应要求 `code="0"`，JSON 和 Base64 JSON 均沿用现有协议解析。优先使用非空、合法的奖品库存值判断有无；只向接收人展示有无，不展示数量。库存字段为空时，奖励状态 `2`（立即领取）可判断有库存，`5`（已领完）可判断无库存。`4` 是锁定，不能当作无库存；`1/3/4/6/7` 分别涉及未集齐、已领取、锁定、已使用、已过期，不能独立证明当前公共库存。

**当前账号实测限制**：4812 的八折、九折奖励状态均为 `6`（已使用），`getPrizeList.stock` 均为 `null`。现有抓包和官方前端未发现独立的全局库存接口。因此这两项会推送“库存未知”，不会以“已使用”冒充“无库存”。若后续补充了独立库存查询接口，应替换只读查询器；不得调用 `receiveNew` 探测库存，因为它会真实领券。

## 凭据续期

正常读取账号库中的活动 CK。收到活动 `GOTO_LOGIN` 或 HTTP 401 时，执行：

1. 云盘 `querySpecTokenV2` 签发 `toSourceId=001191` 票据。
2. 全新 Chrome 会话访问全球通 SSO，确认 `checkLoginStatus.status="1"` 并获取新 `access_token`。
3. 全球通 `getCmpSSOTokenNew.action` 请求 `targetid=017018`。
4. wx10086 `website/sso/netUni` 换取 CK，核对手机号及核心查询身份。
5. 进入周三活动生成新 `HLWHD_SESSION_TOKEN`，再次只读查询。

全部通过后保存派生凭据；保存前重新核对账号和登录信息，避免覆盖刚完成的新登录。云盘业务码 `1010010015` 或 HTTP 401 才认定云盘鉴权过期并通知补登。HTTP 403、风控、渠道限制、网络超时等仅报查询未成功，下个周期重试；不能据此宣告云盘过期。不会清空原凭据，也不会执行抽图、任务上报、转赠或领券。

## 本地配置

配置文件为 `data/wed-coupon-stock-config.local.json`（不进入 Git）：

```json
{
  "enabled": true,
  "accountId": "填写账号的64位ID",
  "userId": "填写账号所属用户ID",
  "phoneSuffix": "4812",
  "pushplusEnvFile": "../../qqtlocal-rights/.env"
}
```

每轮重新读取原 PushPlus 环境文件，不复制 Token。未指定环境文件时使用当前进程的 PushPlus 配置。必须有 Token 且未关闭；只发送给该配置中的接收人。推送通过 HTTPS，设置 15 秒超时，同时核验 HTTP 和 PushPlus 业务码 `200`。已受理不等于微信客户端已读。

推送示例：

```text
8折券：无库存
9折券：有库存
查询时间：2026/10/14 10:00:00
```

状态保存在 `data/wed-coupon-stock-state.local.json`，不保存 Cookie 或 Token。推送失败不会伪造受理成功，也不会立即重复发送可能已经受理的请求；下个 15 分钟周期继续。

- `npm run wed-stock:status`：查看脱敏运行状态。
- `npm run wed-stock:status -- --once`：到期时执行一次真实查询并推送，未到期时只返回状态。
- 已登录管理员可访问 `GET /api/admin/wed-coupon-stock-monitor`，返回启用状态、最近查询、最近推送、下次执行时间；未登录返回 401。
- 修改配置 `enabled=false` 可暂停，删除配置也会暂停。配置变化下个后台 tick 生效；不要求重启其他服务。

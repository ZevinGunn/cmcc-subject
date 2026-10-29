# 移动商城产品查询：业务、接口与开发设计

## 1. 目标与边界

产品查询模块按 `productCode` 调用移动商城产品接口，支持单次查询、批量查询、数字范围扫描、串行或受控并发、定时轮询，并把有效商品的完整响应保存到商品库。

模块位于管理端 `/v2/product-query`。实际联调确认移动商城网关匿名请求返回 `401 / token为空`，因此查询必须选择 cookie-app 已有账号。CK 和商城 Token 仅在后端使用，不返回浏览器。

查询前会校验账号 CK；账号存在云盘会话时可自动换取新 CK。系统随后通过移动商城 SSO 换取 Authorization。查询中授权失效时会强制保活、重新 SSO 并重试当前 code 一次。

## 2. 上游查询流程

1. 校验所选账号存在且未禁用，校验或恢复 10086 CK。
2. 调用 `nrauth/auth/encryt/userAuth` 完成商城 SSO 并取得 Authorization。
3. 校验 `productCode` 为 1-20 位数字并保留前导零。
4. 使用商城现有 `premiumWireEncrypt` 算法加密请求并调用 `nrmix/product/prodWithNormList`。
5. 使用 `premiumWireDecrypt` 解密响应 `body` 并解析业务响应。
6. `returnCode=-9999` 或消息包含“商品不存在”时记为 `not_found`，跳过保存。
7. `returnCode=0` 且存在商品内容时，以 `productCode` 为主键写入或更新商品库。
8. 其他返回作为失败保存到任务明细，便于排查和重试。

保存内容包括常用检索字段 `productId`、`productName`、档位数量，以及未裁剪的完整商品 JSON。

## 3. 管理端 API

所有接口都要求 cookie-app 管理员会话，响应遵循 `{ ok, data, requestId }`。失败响应额外包含 `message` 和 `errorCode`。

### 3.1 单次查询

`POST /api/retail-products/query`

```json
{ "productCode": "4888051", "accountId": "账号ID" }
```

找到商品：

```json
{
  "ok": true,
  "data": {
    "result": {
      "productCode": "4888051",
      "status": "found",
      "message": "查询成功",
      "product": {}
    }
  },
  "requestId": "..."
}
```

商品不存在返回 `status=not_found` 且不写入商品库。上游要求授权时返回 HTTP 424、`errorCode=UPSTREAM_AUTH_REQUIRED`。

### 3.2 查询任务

`POST /api/retail-products/tasks`

批量 code：

```json
{
  "inputType": "codes",
  "accountId": "账号ID",
  "productCodes": "4888051\n11489145",
  "executionMode": "sequential",
  "intervalMs": 1000,
  "concurrency": 1
}
```

范围扫描：

```json
{
  "inputType": "range",
  "accountId": "账号ID",
  "startCode": "001000",
  "endCode": "001999",
  "executionMode": "concurrent",
  "intervalMs": 500,
  "concurrency": 4
}
```

- `GET /api/retail-products/tasks?limit=50`：任务列表，每个任务最多返回前 30 条明细。
- `GET /api/retail-products/tasks/:id`：任务详情，最多返回前 500 条明细。
- `POST /api/retail-products/tasks/:id/cancel`：停止尚未开始的明细，已完成结果保留。

任务状态为 `pending -> running -> success | partial_success | failed | cancelled`；明细状态为 `pending -> running -> found | not_found | failed`。

### 3.3 商品库

- `GET /api/retail-products/products?query=&page=1&pageSize=50`：按 code 或名称检索。
- `GET /api/retail-products/products/:productCode`：读取完整商品内容。
- `DELETE /api/retail-products/products/:productCode`：删除已保存商品，不删除历史任务。

### 3.4 轮询计划

`POST /api/retail-products/schedules`

```json
{
  "name": "每日扫描 4888000-4888999",
  "accountId": "账号ID",
  "startCode": "4888000",
  "endCode": "4888999",
  "executionMode": "concurrent",
  "concurrency": 4,
  "queryIntervalMs": 1000,
  "runIntervalSec": 86400
}
```

- `GET /api/retail-products/schedules`：计划列表。
- `PATCH /api/retail-products/schedules/:id`，请求 `{ "enabled": false }`：启用或暂停。
- `DELETE /api/retail-products/schedules/:id`：删除计划，历史任务保留且 `scheduleId` 置空。

调度器每 15 秒领取到期计划。数据库条件更新保证多进程只有一个实例领取；同一计划已有运行中任务时不会重复创建。服务重启后，运行中的明细和任务会恢复为等待状态并继续。

## 4. 输入限制与执行策略

| 项目 | 限制 |
| --- | --- |
| productCode | 1-20 位数字 |
| 单任务 code 数 | 1-10,000，自动去重 |
| 范围 | 结束值不小于开始值，最多 10,000 个，保留前导零宽度 |
| 查询间隔 | 100-60,000 毫秒 |
| 并发数 | 2-10；串行固定为 1 |
| 轮询周期 | 60 秒至 30 天 |
| 计划单次范围 | 最多 10,000 个 code |

串行模式适合降低上游压力并保持严格顺序；并发模式使用固定大小工作池，仍在每次查询后执行配置的间隔。任务所有状态都持久化，不依赖浏览器保持打开。

## 5. 数据库设计

- `RetailProduct`：以 `productCode` 为主键，存索引字段、完整 JSON、首次/最后发现和最后查询时间。
- `RetailProductQueryTask`：所选账号、任务来源、执行参数、进度计数和最终状态。
- `RetailProductQueryItem`：每个 code 的执行状态、上游消息和错误码。
- `RetailProductQuerySchedule`：所选账号、范围、执行参数、轮询周期和下一次运行时间。

部署时必须依次应用 `20260727152000_add_retail_product_queries` 和 `20260727173000_add_retail_product_query_accounts` 两个迁移，再启动新版本服务。不要在未确认目标数据库的情况下从本地直接执行生产迁移。

## 6. 页面设计

入口位于左侧“产品查询”和“业务查询”页中的“产品查询”快捷项。页面不要求选择账号，包含四个工作区：

- 发起查询：单 code、TXT/CSV 导入、批量 code、范围扫描及执行参数。
- 任务队列：实时进度、发现/不存在/失败计数、停止和明细查看。
- 商品库：code/名称搜索、完整 JSON 查看和删除。
- 轮询计划：范围计划创建、启停和删除。

页面每 2 秒刷新运行中任务；离开页面不会停止后端任务。文件导入会提取独立的 1-20 位数字，允许 CSV 表头存在。

## 7. 错误语义与运维

| errorCode / 状态 | 含义 | 处理 |
| --- | --- | --- |
| `not_found` | `-9999` 或商品不存在 | 正常跳过，不保存 |
| `INVALID_PRODUCT_CODE` | code 格式错误 | 修正输入 |
| `CODE_RANGE_TOO_LARGE` | 范围超过 10,000 | 拆分任务 |
| `ACCOUNT_RECOVERY_FAILED` | CK 失效且自动保活失败 | 重新登录账号或修复云盘会话 |
| `UPSTREAM_AUTH_REQUIRED` | 商城 Authorization 失效且重试失败 | 检查账号和商城 SSO 状态 |
| `UPSTREAM_HTTP` | 上游 HTTP 异常 | 按间隔重试或检查网络 |
| `UPSTREAM_FORMAT` | 加密或响应格式变化 | 对照最新 HAR 更新协议 |

建议上线后监控任务失败率、`UPSTREAM_AUTH_REQUIRED` 数量、平均响应时间和商品新增数量。批量范围应从较低并发、较大间隔开始，确认上游容量后再调整。

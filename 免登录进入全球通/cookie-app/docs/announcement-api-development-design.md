# 公告功能接口与开发设计

## 1. 总体架构

公告功能沿用现有 Express + PostgreSQL + React 架构：

```text
V2 公告管理 -> /api/announcements/admin -> Announcement
public 通知中心 -> /api/announcements/public -> Announcement + AnnouncementReceipt
                                             -> 服务端选择 popupAnnouncement
```

定时发布采用查询时判定有效窗口，不增加常驻调度器。这样在单进程、PM2 或 serverless 部署中行为一致，也避免错过任务导致公告无法发布。

## 2. 数据设计

### 2.1 Announcement

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | text PK | UUID |
| title | text | 1–120 字符 |
| contentHtml | text | 已净化 HTML，最大 200KB |
| level | text | `strong`、`medium`、`weak` |
| important | boolean | 重要公告标记 |
| enabled | boolean | 是否启用 |
| publishAt | timestamp(3) | 发布时间 |
| expireAt | timestamp(3), nullable | 失效时间 |
| createdBy | text, nullable | 管理员标识 |
| createdAt | timestamp(3) | 创建时间 |
| updatedAt | timestamp(3) | 更新时间 |

约束与索引：`level` CHECK 约束；`expireAt > publishAt`；索引 `(enabled, publishAt, expireAt)` 和 `updatedAt`。

### 2.2 AnnouncementReceipt

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| announcementId | text FK | 公告 ID，删除公告时级联删除 |
| userId | text FK | 用户 ID，删除用户时级联删除 |
| readAt | timestamp(3), nullable | 首次已读时间 |
| firstShownAt | timestamp(3), nullable | 首次自动展示时间 |
| lastShownDay | text, nullable | 最近自动展示的北京时间日期 `YYYY-MM-DD` |
| dismissedAt | timestamp(3), nullable | 永久不再提醒时间 |
| updatedAt | timestamp(3) | 更新时间 |

联合主键 `(announcementId, userId)`，并对 `(userId, readAt)` 建索引。

数据库初始化沿用项目已有的 `ensure...Storage()` 模式，在 `announcementStore.ts` 中执行幂等建表、约束和索引；初始化 Promise 在进程内只执行一次。生产部署文档同时记录等价 DDL，后续可迁移到 Prisma migration。

## 3. HTML 安全策略

服务端使用成熟白名单净化库，不使用正则处理 HTML。允许标签：

`p br h1 h2 h3 h4 strong b em i u s ul ol li blockquote pre code a table thead tbody tr th td img hr span div`

允许属性：链接的 `href/title/target/rel`，图片的 `src/alt/title/width/height`，表格单元格的 `colspan/rowspan`。只允许 `http`、`https`、`mailto` 协议；链接统一补 `rel="noopener noreferrer"`，外链可使用 `_blank`。图片禁止 `data:` 和本地文件协议，正文不接受 `style`、`class`、`id` 和所有 `on*` 属性。

纯文本导入在客户端转义后转成段落；无论来源如何，保存接口都会再次净化。净化后正文为空则拒绝保存。

## 4. 通用响应

成功：

```json
{
  "ok": true,
  "data": {},
  "requestId": "uuid"
}
```

失败：

```json
{
  "ok": false,
  "message": "可展示给用户的中文信息",
  "errorCode": "ANNOUNCEMENT_NOT_FOUND",
  "requestId": "uuid"
}
```

错误码：`UNAUTHENTICATED`、`FORBIDDEN`、`INVALID_INPUT`、`INVALID_LEVEL`、`INVALID_SCHEDULE`、`CONTENT_TOO_LARGE`、`ANNOUNCEMENT_NOT_FOUND`、`SERVER_ERROR`。

## 5. public 接口

所有 public 公告接口要求有效 `user_session`。响应仅返回当前已发布且未过期的公告。

### 5.1 获取公告中心

`GET /api/announcements/public`

响应：

```json
{
  "ok": true,
  "data": {
    "announcements": [
      {
        "id": "uuid",
        "title": "维护通知",
        "contentHtml": "<p>...</p>",
        "level": "strong",
        "important": false,
        "publishAt": "2026-07-20T02:00:00.000Z",
        "expireAt": null,
        "readAt": null,
        "dismissedAt": null
      }
    ],
    "unreadCount": 1,
    "popupAnnouncement": { "id": "uuid", "title": "维护通知", "contentHtml": "<p>...</p>", "level": "strong", "important": false, "publishAt": "...", "expireAt": null, "readAt": null, "dismissedAt": null },
    "serverDay": "2026-07-20"
  },
  "requestId": "uuid"
}
```

`popupAnnouncement` 可以为 `null`。服务器负责完整优先级计算，客户端不得自行猜测跨设备提醒状态。

### 5.2 标记已读

`POST /api/announcements/:id/read`

幂等操作。公告不存在或当前不可见返回 404；成功返回最新 `readAt` 和 `unreadCount`。

### 5.3 记录自动展示

`POST /api/announcements/:id/shown`

自动弹窗真正打开后调用，幂等更新 `firstShownAt` 和 `lastShownDay`，同时标记已读。成功返回最新 receipt。这个接口避免“获取列表但页面尚未显示”就消耗提醒机会。

### 5.4 关闭提醒

`POST /api/announcements/:id/dismiss`

请求：

```json
{ "scope": "today" }
```

`scope` 为 `today` 或 `forever`。强等级允许 `today`；重要和中等级允许 `forever`。服务端校验公告策略，非法组合返回 400。普通关闭按钮只提交 `/shown`，不会写永久关闭。

## 6. 管理接口

所有接口要求现有管理员会话或合法管理员鉴权。

### 6.1 列表

`GET /api/announcements/admin?status=all|draft|scheduled|active|expired&level=strong|medium|weak`

返回公告和服务端计算的 `status`，按更新时间倒序。

### 6.2 创建

`POST /api/announcements/admin`

```json
{
  "title": "系统维护通知",
  "contentHtml": "<p>维护时间...</p>",
  "level": "strong",
  "important": false,
  "enabled": true,
  "publishAt": "2026-07-21T01:00:00.000Z",
  "expireAt": "2026-07-22T01:00:00.000Z"
}
```

返回净化后的完整公告。标题去除 HTML 并 trim；发布时间缺省时使用当前服务器时间。

### 6.3 更新

`PUT /api/announcements/admin/:id`

采用完整对象更新，与创建字段一致。修改已发布公告内容不会清除用户 receipt；新公告提醒需创建新公告，避免已关闭用户被意外重复打扰。

### 6.4 删除

`DELETE /api/announcements/admin/:id`

物理删除并级联 receipt。前端必须二次确认。日常下线优先使用 `enabled=false`，保留审计信息。

## 7. 前端模块

- `src/v2/pages/V2AnnouncementsPage.tsx`：列表、筛选、状态、操作。
- `src/v2/components/V2AnnouncementDialog.tsx`：编辑器、导入、预览、校验。
- `src/components/PublicAnnouncementCenter.tsx`：铃铛、badge、列表和详情。
- `src/components/PublicAnnouncementPopup.tsx`：单公告提醒弹窗。
- `src/components/PublicOnboarding.tsx`：锚点式新手引导。
- `src/v2/components/V2DashboardSkeleton.tsx`：工作台稳定骨架。
- `src/lib/safeRichText.ts`：仅提供客户端展示辅助；安全边界仍在服务端。

public 页面协调顺序：鉴权/引导数据加载完成 -> 获取公告 -> 展示一条公告 -> 提交 shown/dismiss -> 队列结束 -> 判断并展示 onboarding。

## 8. 缓存与并发

- 活跃公告列表可在服务端缓存 15 秒，创建、更新、删除后立即失效。
- receipt 是用户状态，不进入全局缓存。
- upsert receipt 使用联合主键，重复点击、网络重试和多设备并发保持幂等。
- 管理保存按钮请求期间禁用，避免重复创建。
- public 端乐观更新 unread badge，接口失败时回滚并提示。

## 9. 测试设计

后端单元测试：输入校验、HTML 净化、状态计算、北京时间日键、popup 优先级、各等级 dismiss 合法性、receipt 幂等。

接口测试：未登录/非管理员拒绝、创建/更新/删除、定时窗口、只返回有效公告、跨用户 receipt 隔离。

UI 测试：badge 上限、列表空态、导入格式与大小、弹窗按钮文案、公告优先于 onboarding、骨架状态。

浏览器验收：桌面 1440×900、移动 390×844，检查 public 顶栏、长标题、长链接、表格横向滚动、弹窗高度、焦点关闭、V2 列表与编辑器无溢出。

## 10. 发布与回滚

1. 部署后首次请求幂等建表，不修改既有业务表字段。
2. 先验证管理接口，再创建一条停用公告做净化和预览测试。
3. 启用测试公告验证 public receipt，不触发任何真实 CMCC 短信或订购。
4. 回滚前端或路由不会影响原有业务；数据表可保留。紧急关闭公告功能时卸载路由/入口，公告数据仍可恢复。


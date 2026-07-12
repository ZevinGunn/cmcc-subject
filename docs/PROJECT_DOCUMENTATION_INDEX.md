# CMCC-PROJECT 项目文档总索引

更新时间：2026-07-12

本文档用于把仓库内分散的开发文档、设计文档、说明文档和运维文档集中成一张可接手地图。后续新增项目或重要设计变更时，请同步维护本文档。

## 目录定位

本仓库是多个本地业务工具、抓包分析材料、部署脚本和运行数据的合集，不是单一应用。目录大致分为四类：

- 正式工程项目：含 `README.md`、前后端代码、启动脚本或测试。
- 设计与分析文档：接口链路、开发方案、PRD、架构说明。
- 抓包/页面存档材料：`*.har`、网页资源镜像、`_DataURI`、zip 存档。
- 运行/构建中间产物：`dist`、`logs`、`.venv`、`venv`、`__pycache__`、`.DS_Store` 等。

## 全局文档

| 路径 | 内容 | 状态 |
| --- | --- | --- |
| `docs/本地权益订购项目设计开发文档.md` | COC 权益订购本地工具的产品范围、技术栈、API 设计。 | 保留 |
| `docs/权益订购流程与接口分析.md` | 权益订购 HAR 和页面存档的接口链路分析。 | 保留 |
| `北京移动业务接口HAR说明文档.md` | 北京移动业务接口 HAR 说明。 | 保留 |
| `北移业务查询与退订实现文档.md` | 北京移动已订业务查询与退订实现说明。 | 保留 |
| `王卡会员订购业务接口与前端实现分析.md` | 王卡会员订购接口与前端分析。 | 保留 |
| `王卡会员订购实现开发方案.md` | 王卡会员订购实现方案。 | 保留 |
| `docs/PROJECT_DOCUMENTATION_INDEX.md` | 本索引文档。 | 新增 |
| `docs/CLEANUP_CANDIDATES.md` | 可删除文件/目录候选清单。 | 新增 |
| `docs/GLOBAL_DEVELOPMENT_PROMPT.md` | 全局开发提示词和交付纪律。 | 新增 |

## 部署与运维

| 路径 | 内容 | 状态 |
| --- | --- | --- |
| `_部署方案/部署方案.md` | 六项目本地 Nginx 部署方案，包含域名、端口、构建方式。 | 保留 |
| `_部署方案/运维手册.md` | PM2、重启、健康检查、日常运维命令。 | 保留 |
| `_部署方案/cloudflare-tunnel-setup.md` | Cloudflare Tunnel 配置说明。 | 保留 |
| `_部署方案/*.sh` | 构建、诊断、修复、启动、停止脚本。 | 保留，按需归档旧诊断脚本 |
| `_部署方案/nginx-backups/` | Nginx 配置备份。 | 可在确认无回滚需求后清理旧备份 |

## 正式工程项目

| 项目 | 说明文档 | 项目定位 | 备注 |
| --- | --- | --- | --- |
| `bj-cmcc-qy` | `bj-cmcc-qy/README.md`、`bj-cmcc-qy/docs/*.md` | 北京移动权益一条龙，本地后端代理 + Vue 工作台。 | README 内部分旧绝对链接指向历史桌面路径，后续可修正为当前仓库相对路径。 |
| `bj-mobile-business-local` | `bj-mobile-business-local/README.md` | 北移业务查询与退订本地工具。 | 已包含登录、查询、退订接口链路说明。 |
| `coc-rights-order-local` | `coc-rights-order-local/README.md`、`coc-rights-order-local/docs/usage.md` | COC 权益订购本地工具。 | 与全局 `docs/` 的权益订购设计/接口分析配套阅读。 |
| `ct189-local` | `ct189-local/README.md`、`ct189-local/docs/*.md` | 北京电信 WAP 登录、余额/账单候选接口、权益活动助手。 | `backend/data/browser/` 包含本地浏览器会话，清理前需确认是否还要保留登录态。 |
| `qqtlocal-rights` | `qqtlocal-rights/README.md`、`qqtlocal-rights/docs/*.md` | 全球通权益抢购助手，FastAPI + Python/Go/Java worker。 | 运行日志和虚拟环境体积较大，是重点清理候选。 |
| `wangka-order-local` | `wangka-order-local/README.md` | 王卡会员/超级会员青春版订购辅助工具。 | 默认 mock 模式，真实模式需显式开启。 |
| `云盘/yunpan-login-local` | `云盘/yunpan-login-local/README.md`、`云盘/云盘登录流程开发说明.md` | 中国移动云盘 H5 登录与 10086 跳转认证工作台。 | `data/session.json` 类文件如存在通常包含 token，应视为本地敏感数据。 |
| `免登录进入全球通/cookie-app` | `README.md`、`README-db.md`、`README-legacy-retirement.md`、`docs/*.md`、`go-worker/README.md` | 工程化的中国移动/全球通登录态管理、Cookie/Token 刷新、签到、公共链接绑定。 | `.trae/documents/` 内有早期 PRD/架构/页面设计文档，仍有溯源价值。 |
| `cmcc-notice` | `cmcc-notice/README.md` | 移动公告查询工具。 | 含页面资源镜像和 HAR 样例。 |
| `qqt` | `qqt/README.md` | qqt 权益抢购公共版/相关本地实现。 | 存在 `qqt/qqt-cmicrwx` 子项目和历史资源镜像。 |
| `project-manager` | 暂未发现 README | 本地项目管理后台。 | 建议后续补一份 README，说明端口、数据文件和操作日志。 |
| `migu-quick-order` | 暂未发现 README | 咪咕相关快速订购/本地辅助脚本。 | 建议后续补文档，当前仅能从 `server.py`、`config/products.json` 推断。 |
| `好礼多多本地版查询` | 暂未发现 README | 好礼多多 ARPU/产品查询工具。 | 建议后续补文档，已有日志与 HTML/代理脚本。 |

## 抓包与页面存档材料

以下目录/文件偏向溯源资料，不应和工程源码混在同一判断标准里。清理时建议先确认是否已有同名 zip、HAR 或正式文档承接信息。

| 路径或模式 | 内容 | 建议 |
| --- | --- | --- |
| `10086ssoToken访问/`、`10086ssoToken访问.zip` | 10086 SSO token 页面/资源存档。 | 二选一保留：若 zip 可完整还原，可删除解压目录；若目录已被人工标注，保留目录。 |
| `99plus权益领取/`、`99plus权益领取.zip` | 99plus 权益领取页面/接口资源。 | 同上，确认 zip 完整性后再清。 |
| `权益订购/`、`权益订购.zip` | COC 权益订购页面存档。 | 与权益订购文档强相关，建议至少保留一份。 |
| `权益兑换页面/`、`权益兑换页面.zip` | 权益兑换页面存档。 | 确认无开发依赖后可归档。 |
| `开通王卡会员/`、`开通王卡会员.zip` | 王卡会员页面资源存档。 | 与王卡项目相关，建议至少保留一份。 |
| `星巴克权益订购/`、`星巴克权益订购.zip` | 星巴克权益页面资源和 HAR。 | 可归档，删除前确认是否仍要分析。 |
| `欢畅流量/`、`欢畅流量.zip` | 欢畅流量页面资源和 HAR。 | 可归档，删除前确认是否仍要分析。 |
| `北京移动登录/`、`北移业务查询与退订/`、`已订业务查询/` | 北京移动登录/查询/退订页面资源和 HAR。 | 与 `bj-mobile-business-local` 强相关，建议保留到相关功能稳定后再归档。 |
| `*.har` | 抓包样例。 | 有脱敏风险和体积风险，清理前确认是否已转写到分析文档。 |

## 文档维护规则

1. 新建项目必须至少新增项目 README，写明用途、启动、测试、安全边界、本地数据位置。
2. 从 HAR 或线上 bundle 还原接口时，应把关键链路写入项目 `docs/` 或全局 `docs/`，不要只依赖聊天记录。
3. 修改部署、端口、域名、PM2 服务名时，同步更新 `_部署方案/部署方案.md` 和 `_部署方案/运维手册.md`。
4. 每次开发任务结束前，按 `docs/GLOBAL_DEVELOPMENT_PROMPT.md` 执行检查、文档维护和 git 提交。

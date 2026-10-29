# 可删除文件与目录候选清单

更新时间：2026-07-12

本文档只列“候选”，不代表已经删除。执行删除前请先确认当前没有服务依赖这些文件，并优先备份敏感数据、登录态、HAR 样例和手工标注材料。

## 高置信度可清理

这些通常是系统垃圾、构建产物、运行日志、Python 缓存或本地依赖缓存。确认当前不需要回看日志/构建产物后可删除。

| 候选 | 类型 | 删除风险 | 建议 |
| --- | --- | --- | --- |
| `.DS_Store` 及各子目录 `.DS_Store` | macOS 元数据 | 低 | 可直接删除，并加入 `.gitignore`。 |
| `.pnpm-store/` | pnpm 本地依赖缓存 | 低到中 | 可删除，后续安装依赖会重新下载；如离线环境则先保留。 |
| `*/dist/` | 前端构建产物 | 中 | 开发仓库中通常可删除，但生产部署正在使用时不要删。 |
| `*/logs/`、`*.log` | 运行日志 | 中 | 可按日期归档后删除；排障窗口内保留最近日志。 |
| `__pycache__/`、`*.pyc` | Python 字节码缓存 | 低 | 可直接删除。 |
| `migu-quick-order/.pycache/` | 异常大的 Python 缓存目录 | 低 | 可直接删除，目录里包含本机 Python 路径缓存。 |
| `qqt/frontend/vite.config.ts.timestamp-*.mjs` | Vite 临时产物 | 低 | 可删除。 |
| `_部署方案/nginx-backups/*.bak.*` | Nginx 旧备份 | 中 | 确认无需回滚后删除旧版本。 |
| `免登录进入全球通/cookie-app/logs/*.log` | cookie-app 运行日志 | 中 | 确认无需排障后删除或归档。 |
| `bj-mobile-business-local/backend/logs/` | 运行日志 | 中 | 确认无需排障后删除或归档。 |
| `qqt/backend/logs/`、`qqt/qqt-cmicrwx/backend/logs/` | 运行日志 | 中 | 确认无需排障后删除或归档。 |
| `project-manager/logs/` | 管理后台操作日志 | 中到高 | 若需要审计则保留；否则可按时间归档。 |

参考命令：

```bash
find . -name .DS_Store -delete
find . -name __pycache__ -type d -prune -exec rm -rf {} +
find . -name '*.pyc' -delete
```

## 本地环境与依赖目录

这些目录可重建，但删除后需要重新安装依赖。若当前服务正在使用对应虚拟环境，不要直接删除。

| 候选 | 类型 | 删除风险 | 建议 |
| --- | --- | --- | --- |
| `qqtlocal-rights/venv/` | Python 虚拟环境 | 中 | 确认可重新 `./run.sh` 或 pip install 后删除。 |
| `qqtlocal-rights/venv-linux/` | Linux Python 虚拟环境 | 中 | macOS 本地通常可删；若用于部署打包则先归档。 |
| `免登录进入全球通/.venv/` | Python 虚拟环境 | 中 | 确认没有脚本依赖后删除。 |
| `qqtlocal-rights/java-worker/.mvn/apache-maven-3.9.9/` | Maven wrapper 下载缓存 | 中 | 可重下，但离线构建会受影响。 |
| `qqtlocal-rights/go-worker/go-worker` | Go 编译产物 | 低到中 | 可删除，重新构建即可。 |

## 浏览器会话与本地数据

这些目录可能包含 cookie、token、登录态、账号配置或本地数据库。技术上可删除，但业务风险高。

| 候选 | 类型 | 删除风险 | 建议 |
| --- | --- | --- | --- |
| `ct189-local/backend/data/browser/` | Playwright/浏览器会话 | 高 | 删除会丢失电信登录态；只在明确要重置账号会话时删除。 |
| `云盘/yunpan-login-local/data/session.json` | 云盘 token/认证链接缓存 | 高 | 若存在，视为敏感数据；删除前确认不再需要登录态。 |
| `project-manager/projects.json` | 管理后台项目清单 | 高 | 不建议删除。 |
| `project-manager/logs/operations.jsonl` | 管理后台操作日志 | 中到高 | 需要审计则保留。 |
| `qqtlocal-rights/data/*.json` | 任务、密钥、账号数据 | 高 | 不建议删除。 |
| `免登录进入全球通/cookie-app/data/`、`backups/` | 旧数据/备份 | 高 | 清理前先确认数据库迁移和备份状态。 |

## 抓包、zip 与页面镜像

这些属于开发溯源材料。它们占空间、数量多，但可能是接口还原的唯一证据。建议按“已写入文档”和“是否仍在开发”分批清理。

| 候选 | 类型 | 删除风险 | 建议 |
| --- | --- | --- | --- |
| 根目录 `*.har` | 抓包样例 | 中到高 | 若已转写到对应接口分析文档，可转移到归档目录或删除副本。 |
| `云盘/*.har`、`免登录进入全球通/**/*.har` | 登录/认证链路抓包 | 高 | 常含认证链路细节，先归档加密备份再清。 |
| `*.zip` 与同名解压目录并存 | 页面存档重复 | 中 | 校验 zip 可完整还原后，保留 zip 或目录之一。 |
| `*/_DataURI/*.txt` | 页面资源内联数据 | 中 | 若对应页面镜像不再需要，可随镜像目录一起删除。 |
| `北京移动登录/`、`已订业务查询/`、`北移业务查询与退订/` | 页面镜像与 HAR 溯源 | 高 | 与现有北移工具相关，暂建议保留。 |

## 建议的分批清理顺序

1. 第一批：`.DS_Store`、`__pycache__`、`*.pyc`、Vite timestamp 临时文件。
2. 第二批：明确不用于当前生产服务的 `dist/` 和旧 `logs/`。
3. 第三批：可重建的 `venv/`、`.venv/`、`venv-linux/`、`.pnpm-store/`。
4. 第四批：重复的 zip/解压目录和已完成文档沉淀的 HAR。
5. 第五批：浏览器会话、本地账号数据、数据库备份等高风险敏感数据，只在明确重置或归档后处理。

## 后续可执行清单

删除前建议先生成体积报告：

```bash
du -sh .pnpm-store qqtlocal-rights/venv qqtlocal-rights/venv-linux 免登录进入全球通/.venv 2>/dev/null
find . -name .DS_Store -o -name '*.pyc' -o -name '*.log' | wc -l
```

删除动作建议单独开一次提交，不要和功能开发混在一起。

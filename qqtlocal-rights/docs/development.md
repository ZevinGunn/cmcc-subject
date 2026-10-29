# 项目开发文档

## 1. 架构概览
该项目采用前后端分离：**FastAPI** 后端负责任务调度、密钥/管理员校验、日志持久化、调用抢购引擎；**纯静态前端**（`web/index.html`）负责账号管理、参数配置、日志呈现与快捷操作；另外还提供 Go/Java 两个高性能的 worker（放在 `go-worker/`、`java-worker/` 下）作为外部执行器。

```
project/
├── backend/          # FastAPI + APScheduler 主入口
├── web/              # 静态界面：控制台 + 登录页 + 管理员页
├── go-worker/        # Go 语言执行器（编译后执行 binary worker）
├── java-worker/      # Java 执行器（打包为 shaded jar）
├── data/             # json 存储（任务、密钥）
├── logs/             # 运行日志
└── run.sh            # 一键搭建脚本
```

## 2. 启动与开发环境
* Python 3.8+（建议 3.11）；依赖在 `backend/requirements.txt`，`./run.sh` 会自动创建虚拟环境并安装。
* Node.js（用于加密脚本 `backend/js_utils/encrypt.js`），执行注册登录/短信加密。
* Go 1.19+ 和 Java 11+ 为可选，用于编译 `go-worker` 与 `java-worker`。
* 运行：在根目录执行 `./run.sh` 会依次安装依赖、编译 worker、启动 FastAPI 服务（默认 8000）；浏览器访问 `http://localhost:8000/index.html`。

## 3. 核心模块解读

### 3.1 后端 `backend/app.py`
* 通过 APScheduler 管理三种调度：`immediate`、`date`、`cron`。创建任务时会写入 `JOBS` 内存并同步到 `data/jobs.json`。
* 访问控制：`Authorization: Bearer <key>` 负责用户登录，`X-Admin-Token` 负责管理员；密钥存在 `data/auth_keys.json`，`DEFAULT_ADMIN_TTL_SECONDS` 设定 24 小时到期。
* `run_job` 会根据 `executor` 决定调用 `run_poll`、`go` 或 `java` worker；日志通过 `write_log` 写入 `logs/<jobid>-yyyymmdd-HHMMSS.log`。
* `run_poll` 新增 `per_account_delay_ms` 与 `accounts_per_poll` 两个参数，供前端配置“轮询内账号间隔”与“每轮账号数”。当延迟 >0 时，后端在每次轮询中自动降级为顺序执行并按照间隔睡眠，同一轮只操作 `accounts_per_poll` 个账号，保证大批量请求落在 10:00:00.050~0.150 的窗口内。
- 测试模式还会传递 `force_sequential_run_once`，强制在调用 `run_poll` 时完全串行地执行每轮（不开启线程），防止多线程在一轮内同时扫完所有账号导致重复请求频繁。在文档里也可说明 `run_poll` 内部的 `use_threads` 判定逻辑。
* `copy log` 功能在前端组合了页面配置、账号列表、任务状态与日志文本后写入剪贴板，无需后端额外接口。

### 3.2 抢购逻辑 `backend/qqt_mcyp.py`
* `run_poll` 接受 `accounts`、轮询/延迟/并发等参数，向目标站点发送请求并打印每步结果；日志通过传入的 `log` 回调写入文件。
* `query_family_members` 提供亲友圈查询，供前端设置转赠手机号。

### 3.3 前端（`web/`）
* `index.html`：负责账号列表、配置输入、定时任务同步、日志流（含“复制日志”按钮）、“一键清除全部账号”功能以及日志轮询。新增按钮会清空 localStorage、停止调度并重置日志展示，并通过 `copyLogSnapshot` 生成当前配置 & 日志的文本快照。
* `login.html`：用户密钥登录页面，纯白简洁无圆角；提供“使用缓存密钥进入”与“清除缓存”操作。
* `admin.html`：管理员单独页面，提供登录、密钥列表、创建、延长、删除等操作，采用同样的平面设计风格。

## 4. 数据与日志
* `data/auth_keys.json` 记录所有密钥及到期时间，`load_keys`/`save_keys` 负责持久化；过期密钥会定期 `cleanup_expired_keys`。
* `data/jobs.json` 存储任务配置，在 FastAPI 启动时恢复 `JOBS` 并重新注册调度。
* `logs/` 目录下每个 job 生成多个文件，路径格式为 `<jobid>-%Y%m%d-%H%M%S.log`，`copyLogSnapshot` 会拉取最新一份日志并与配置/账号一起导出。

## 5. 扩展参考
* 添加新执行器：实现一个能读取 JSON（和 `go-worker/main.go` 或 Java worker` 的 `main` 入口类似）并输出日志的独立程序，再在 `run_external_worker` 中注册即可。
* 修改调度：参考 `create_job` -> `add_job_to_scheduler` 的流程，可增加额外触发器或 `monitor_mode` 逻辑。
* UI 增强：`web/index.html` 中 `users`、`config`、`logTimer` 等变量即为全局状态；`saveConfig` 会同步至后端，`copyLogSnapshot` 将当前配置、账号状态等信息整合为纯文本，可复用在其他辅助工具。

## 6. 测试与辅助脚本
* `test_token.py` / `verify_flow.py` / `test_ui_flow.py` 可用作手动验证登录或 UI 行为；具体使用方式请根据脚本内部提示。
* `./run.sh` 也会检查 Go/Java worker 是否编译完成，适合用于 CI 预检。

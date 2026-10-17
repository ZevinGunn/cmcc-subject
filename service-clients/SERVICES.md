# 统一工具箱服务目录

2026-10-17 对照 `project-manager/services.json`、实际 Nginx 配置及公网响应核实。覆盖服务清单中的 11 项已开放应用，并加入同域的周三工具箱、星巴克与移动管理入口，共 14 个入口；各业务内部页面继续通过原网站菜单访问，不需要在壳内逐个重建。管理入口沿用原站管理员登录，不因出现在菜单而获得权限。

| 分类 | 入口 | 公网地址 |
| --- | --- | --- |
| 移动业务 | 移动账号 | https://home.1008086.xyz/public |
| 移动业务 | 北京移动业务 | https://bmcc.1008086.xyz/ |
| 移动业务 | 业务快捷入口 | https://bjcmcc.1008086.xyz/ |
| 权益活动 | 周三拼图 | https://home.1008086.xyz/wed-puzzle/ |
| 权益活动 | 星巴克卡券 | https://home.1008086.xyz/starbucks |
| 权益活动 | 北京移动权益 | https://rights.1008086.xyz/ |
| 权益活动 | QQT 公共版 | https://qqt.1008086.xyz/ |
| 权益活动 | QQT 极速抢购 | https://qqtlocal.1008086.xyz/ |
| 查询与工具 | 北京移动合约查询 | https://contracts.1008086.xyz/ |
| 查询与工具 | ARPU 消费查询 | https://arpu.1008086.xyz/ |
| 查询与工具 | 资费公告查询 | https://notice.1008086.xyz/ |
| 查询与工具 | Tools 工具工作台 | https://tools.1008086.xyz/ |
| 管理控制台 | 移动用户管理 | https://home.1008086.xyz/ |
| 管理控制台 | Project Ops | https://project.1008086.xyz/ |

合约旧域名 `contract3.1008086.xyz`、公告别名 `notic.1008086.xyz` 允许在壳内访问。其他外部 HTTPS 地址使用系统浏览器；其他协议被拦截。关闭的王卡 `wangka.1008086.xyz`、独立云盘工作台 `yunpan.1008086.xyz` 当前都返回 404，部署清单标注 `restricted-pending-auth`，不加入已开放工具目录。

## 后续维护

`shared/services.json` 是桌面与安卓的唯一入口来源。增加公网项目时，在该文件补充 ID、名称、完整 HTTPS URL、分组、说明与部署清单中的 `sourceService`。公网项目覆盖测试会识别遗漏、非公网项目、错域名、未知分组和重复 ID。新增受信任别名必须明确写入 `aliases`，不使用 `*.1008086.xyz`。

只改变某个现有 Web 服务内部功能时，按该服务正常发布，客户端重新加载即可使用。新增入口或修改壳本身则重新打包。客户端仅创建一个主网页视图，切换时复用，不为每项工具常驻启动页面；站点 Cookie 和存储由浏览器按域名管理。切回工具会恢复本次进程内记住的地址，表单等页面运行状态不保证保留。

微信小程序不能直接沿用普通 WebView 壳的权限条件。当前未注册 AppID，原生小程序工程保持首版功能范围，统一 Web 工具箱本轮适用于 macOS、Windows 和 Android。

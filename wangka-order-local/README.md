# 王卡会员便捷订购本地工具

本项目是一个本地运行的王卡会员/超级会员青春版订购辅助工具，用于在用户本人合法会话内完成：

- 查询普通王卡会员状态
- 普通王卡会员短信发送、短信校验、入会提交
- 查询超级会员青春版套餐
- 青春版短信发送、短信校验、订购提交
- HAR/mock 流程测试

默认运行在 mock 模式，只读取项目根目录中的 HAR 样例，不会调用真实上游接口，不会发送短信，不会提交订购。

前端和 API 响应会对手机号、`RNC(...)`、验证码票据等敏感字段做脱敏展示。后端仅在当前进程内短时保存必要上下文，用于同一会话的下一步接口调用。

## 安全边界

- 不绕过阿里 NVC、腾讯验证码或短信验证码。
- 不生成或伪造 `RNC(...)` 密文。
- 不批量订购。
- 不保存完整 Cookie、验证码、RNC 到长期日志。
- 真实模式必须手动设置 `WANGKA_LIVE=1`，并由用户提供合法 Cookie、验证码票据和短信码。

## 启动

```bash
cd /Users/ZevinGunn/CMCC-PROJECT/wangka-order-local
python3 server.py --port 8787
```

浏览器打开：

```text
http://127.0.0.1:8787/
```

## 测试

```bash
cd /Users/ZevinGunn/CMCC-PROJECT/wangka-order-local
python3 -m unittest discover -s tests -v
```

## 真实模式

真实模式只提供接口转发能力，验证码仍必须由用户在真实页面/浏览器环境中完成。

```bash
WANGKA_LIVE=1 python3 server.py --port 8787
```

真实提交类接口需要显式传入确认短语：

```text
我确认本人办理
```

否则后端会拒绝调用上游提交接口。

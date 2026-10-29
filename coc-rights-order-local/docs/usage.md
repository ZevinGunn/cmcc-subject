# 使用说明

## 常用输入

```text
权益 code：bojinyear
skuId：77626
channelCode：P00000139704
referer：bojinyear
```

## API

- `GET /api/products`
- `GET /api/layout/resolve?code=bojinyear`
- `POST /api/sku/type`
- `POST /api/sms/send`
- `GET /api/risk/c1`
- `POST /api/order/direct`

## 风控

当前实现按 HAR 中可验证的简化链路提交，`operDfp` 默认可空。若真实请求返回风控相关错误，再接入 Playwright 打开原始页面采集 `BSFIT_DEVICEID` 与 `risk-device-token`。

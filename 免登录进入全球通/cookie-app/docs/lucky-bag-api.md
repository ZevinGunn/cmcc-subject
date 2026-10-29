# 福袋接口说明

## 上游通信

基址 `https://dev.coc.10086.cn/coc/`；POST JSON，服务端保存 Cookie、userId、手机号和临时加密上下文。Referer/sourceUrl 使用对应业务 `/index?pageId=...&channelId=...`。Cookie、短信码、加密材料不返回前端、不写文档或日志。

| 接口 | 加密 | 请求字段 | 源码响应契约 |
| --- | --- | --- | --- |
| user/userVerification | Aurora | mobile | code=0；data.isCmcc=1 表示非移动；cityId/areaCode |
| user/smsCode（登录） | Aurora | mobile,userId | code=0 |
| user/loginCheck | Aurora | mobile,smsCode,verifyType=0 | code=0；data.userId/provinceCode/maskedMobile，可有 token |
| pkg/contract/common/productRelation | 明文 | type=0,productCodes,touchCode,pageId,userId,sourceUrl；标准版带 mobile | code=0；data.isOrder,respDTOList[].productCode |
| grocer/copyWriting/page/query | Meteor | configType=2（主规则）或3（权益详情）,pageId,productCode,provinceCode | code=0；data.configList[].subContent |
| grocer/protocol/prov/queryProtocol | Meteor | pageId,productCode=所选组合码,provinceCode,userId,verifyType="0" | code=0；data[] 协议名称、内容、protocolSequenceId |
| user/smsCode（订购） | Aurora | mobile,userId,productCode,pageId,touchCode,smsCodeTypeEnum="505",templateNo="1871462953729064960" | code=0 |
| pkg/order/combineBookProduct | 明文 | 公共字段+productCode=组合码；豪华带nProductCode=主码；标准带mobile | code=0 表示上游受理，关系刷新确认生效 |
| pkg/order/combineProductChange | 明文 | 公共字段+productCode=权益码,pcardPasswd=主码,mobile | code=0 表示上游受理，关系刷新确认生效 |

公共订购字段：pageId,touchCode,uid="",sellerId="",channelSeqId="",sourceUrl,protocolSequenceId,smsCode,verifyType=0,smsCodeTypeEnum="505",userId。豪华归档使用登录返回的 maskedMobile 进行权益变更；标准使用完整手机号。协议始终查询组合产品码，即使变更提交和订购短信使用权益码，此差异来自实际源码。

### 加密差异

Aurora：AES-128-ECB/PKCS7，JSON 加密后 Base64 放入 cocEnContent；coc-aurora 为 RSA/PKCS1 加密的16字符随机 AES key，coc-aurora-v=2，coc-en-version=1486234121417629696。

Meteor：每次请求重新生成16字符 AES key；先将 key 以 UTF8 转 Base64 后 RSA/PKCS1 加密，放入 coc-meteor；coc-meteor-v=2。AES 密文 Base64 字符串再做一次 UTF8 Base64，放入 cocEnContent。若响应含 returnData，以该请求 AES key 解密后 JSON 解析。不得误用 Aurora 请求头或复制 HAR 密文。

## cookie-app 接口

复用 `/api/benefit-orders`，所有接口沿用管理员或 businessOrder 权限、会话 ownerKey 和账号归属校验。

| 方法/路径 | 入参 | 输出/效果 |
| --- | --- | --- |
| POST /sessions | workflow="lucky_bag",bagVariant="standard"或"deluxe",accountId；管理员可phone | 初始化独立短信会话；业务编码由服务端固定 |
| POST /sessions/:id/login-sms | {} | 登录短信及冷却 |
| POST /sessions/:id/login | code（6位） | authenticated |
| POST /sessions/:id/product | {} | 查询关系、规则及候选权益；成功结果页也可刷新关系 |
| POST /sessions/:id/selection | selectedIds=[权益产品码] | 重新验证关系、获取协议；拒绝跨版本/重复权益 |
| POST /sessions/:id/order-sms | acceptedProtocol=true | 重新确认关系未变化，发送针对当前目标的订购短信 |
| POST /sessions/:id/confirm | code,acceptedProtocol=true,confirmationText="确认订购" | 最后核对关系，单次提交并保存脱敏结果 |
| POST /sessions/:id/back | {} | 回权益选择；清除协议/短信授权，保留短信冷却 |
| DELETE /sessions/:id | 无 | 销毁会话；在途操作拒绝销毁 |

product 增加 bagStatus：variant,mainOrdered,currentBenefitCodes,action（main_order/benefit_order/benefit_change）,mainMonthlyFee。norms 采用既有字段；首订 price 为主资费，已有主资费 price=0 表示套餐内候选展示，不保证协议费用恒为0。

## 错误与兼容

非法版本/权益400；缺协议/未确认/关系变化/当前操作冲突409；无权限403；会话过期404；短信冷却429；上游认证过期410；格式或网关错误424。关系缺失或未知权益采用失败关闭，防止错误切换主资费。所有长请求保持旧数据供查看；返回步骤后必须重新读取协议并发送短信。强制尝试选项不绕过关系、协议或权益白名单。

已知证据限制：HAR 无响应体，错误码细节除源码中的 code=0、code=40（登录超时）外不猜测。订购发出后若响应缺code、无法解析或网络超时，统一结果待确认，不自动再次下单。

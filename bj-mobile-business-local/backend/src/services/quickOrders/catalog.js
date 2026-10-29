const platforms = [
  {
    id: 'xyw',
    name: 'xyw.bj 新业务订购',
    shortName: '新业务',
    authentication: '输入办理手机号，通过独立登录验证码建立 xyw.bj 会话',
    productName: '咪咕视频会员年包合约',
    businessId: 'migu-video-year',
    capabilities: ['短信登录', '实时活动与资格', '业务选择', '订购短信确认'],
    warning: '登录验证码和订购验证码用途不同；最终响应不明确时必须先通过官方渠道核验。',
  },
  {
    id: 'north',
    name: '北移业务订购',
    shortName: '北移',
    authentication: '复用当前北京移动登录会话',
    productName: '欢畅流量翻番',
    capabilities: ['实时资格', '动态承诺消费', '短信确认'],
    warning: '订购会改变当前号码业务状态；结果未知时必须先在官方渠道核验。',
  },
  {
    id: 'retail',
    name: '中移商城业务订购',
    shortName: '中移商城',
    authentication: '输入当前 wx.10086.cn 商城 Cookie',
    productName: '欢畅流量翻番',
    capabilities: ['商城 SSO', '实时规格', '协议与预校验', '短信确认'],
    warning: 'Cookie 只保存在服务端内存会话中，页面刷新后不会恢复。',
  },
  {
    id: 'grid',
    name: '网格通业务订购',
    shortName: '网格通',
    authentication: '输入手机号和平台生成的完整入口 URL',
    productName: '欢畅流量翻番',
    capabilities: ['客户资格', '动态低消档位', '短信挑战', '一次性令牌'],
    warning: '入口中的渠道参数必须来自平台原链接，系统不会生成或替换。',
  },
  {
    id: 'cloud',
    name: '家庭云电脑订购',
    shortName: '云电脑',
    authentication: '输入新鲜的中国移动 App 一键登录 Token',
    productName: '家庭云电脑',
    businessId: 'cloud-computer',
    capabilities: ['App 一键登录', '实时产品与确认信息', '短信确认', '单次最终提交'],
    warning: 'Token 必须来自当前账号的中国移动 App 登录链路；系统不保存 Token，最终结果未知时禁止重试。',
  },
]

export function quickOrderCatalog() {
  return {
    businessId: 'unified-quick-order',
    businessName: '统一业务快捷订购',
    platforms,
    stages: ['LOGIN_REQUIRED', 'LOGIN_SMS_SENT', 'AUTHENTICATED', 'PRODUCT_READY', 'SELECTION_READY', 'SMS_SENT', 'SUBMITTING', 'FINISHED', 'FAILED', 'UNKNOWN'],
    finalConfirmationRequired: true,
  }
}

export function findPlatform(id) {
  return platforms.find((item) => item.id === String(id || '')) || null
}

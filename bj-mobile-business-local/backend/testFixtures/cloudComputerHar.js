export const CLOUD_HAR_FIXTURE = {
  login: {
    success: true,
    data: {
      code: '200',
      msg: '操作成功',
      obj: { headerName: 'mop_mkt_web_token', phone: '13800138000', token: 'mock-session-token-36-characters-long' },
    },
  },
  marketStatus: {
    success: true,
    data: { code: '200', msg: '操作成功', obj: { useCaptchaDirectly: 1, trustLegacyUaToken: 0, status: 1 } },
  },
  products: {
    '78870ece2bdf42bc8a278e9e9bc595ea': {
      success: true,
      data: {
        code: '200',
        msg: '操作成功',
        obj: [{
          productCode: '78870ece2bdf42bc8a278e9e9bc595ea',
          offerId: '111602043971',
          productName: '家庭云电脑畅享版月包',
          descr: '<p>19.9元/月，立即生效，CPU4核、内存8G、磁盘80GB。</p>',
        }],
      },
    },
    '78289f7840634282b781f28576bbace5': {
      success: true,
      data: {
        code: '200',
        msg: '操作成功',
        obj: [{
          productCode: '78289f7840634282b781f28576bbace5',
          offerId: '111602043972',
          productName: '家庭云电脑高级版月包',
          descr: '<p>29.9元/月，立即生效，CPU8核、内存16G、磁盘80GB。</p>',
        }],
      },
    },
  },
  orderInfo: {
    success: true,
    data: {
      code: '200',
      msg: '操作成功',
      obj: {
        productName: '家庭云电脑高级版月包（方案编号：25BJ200211)',
        phone: '13800138000',
        fullDescr: '<p>套餐价格：29.9元/月(连续包月)</p><p>立即订购，立即生效，话费支付。</p>',
      },
    },
  },
  smsSent: { success: true, data: { code: '200', msg: '操作成功' } },
  invalidSmsOrder: { success: true, data: { code: '99904', msg: '验证码错误' } },
}

// HAR did not contain a successful final response. This fixture follows the
// captured page bundle's explicit code=200 and obj.result!=false contract.
export const SOURCE_DERIVED_SUCCESS = {
  success: true,
  data: { code: '200', msg: '操作成功', obj: { result: true, descr: '订购成功' } },
}

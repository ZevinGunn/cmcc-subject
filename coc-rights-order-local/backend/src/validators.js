export function isSkuId(value) {
  return /^\d+$/.test(String(value || '').trim());
}

export function assertPhone(phone) {
  if (!/^1\d{10}$/.test(String(phone || '').trim())) {
    throw Object.assign(new Error('请输入有效的 11 位中国大陆手机号'), {
      status: 400
    });
  }
}

export function assertSmsCode(smsCode) {
  if (!/^\d{4,8}$/.test(String(smsCode || '').trim())) {
    throw Object.assign(new Error('请输入 4-8 位数字验证码'), {
      status: 400
    });
  }
}

export function assertSkuId(skuId) {
  if (!isSkuId(skuId)) {
    throw Object.assign(new Error('请输入有效的 skuId'), { status: 400 });
  }
}

export function normalizeCode(value) {
  return String(value || '').trim();
}

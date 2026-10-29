import { buildEncryptedPackageBody } from './packageCrypto.js';
import { md5Hex, reverseBase64 } from './crypto.js';
import { buildPackageReferer } from './cocClient.js';

export function makePackageSmsRequest({
  phone,
  pageId,
  productCode,
  touchCode,
  smsCodeTypeEnum = '505'
}) {
  return buildEncryptedPackageBody({
    mobile: phone,
    pageId,
    productCode,
    smsCodeTypeEnum,
    touchCode
  });
}

export function makePackageLoginCheckRequest({ phone, smsCode, userId = '' }) {
  return buildEncryptedPackageBody({
    mobile: phone,
    smsCode,
    uid: '',
    userId,
    verifyType: 1
  });
}

export function makePackageBookProductRequest({
  phone,
  smsCode,
  pageId,
  productCode,
  touchCode,
  protocolSequenceId,
  referer,
  userId = '',
  sellerId = null,
  sellerMobile = null,
  yx = ''
}) {
  const mobile = reverseBase64(phone);
  return {
    digest: md5Hex(`${phone}coc${mobile}`),
    pageId,
    productCode,
    touchCode,
    sellerId,
    sellerMobile,
    verifyType: 2,
    protocolSequenceId,
    sourceUrl: buildPackageReferer({ referer, pageId, channelCode: touchCode }),
    userId,
    encrypt: { mobile },
    mobile,
    smsCode,
    ext: JSON.stringify({ wtAc: `${touchCode}_${yx}` })
  };
}

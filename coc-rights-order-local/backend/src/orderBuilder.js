import {
  buildOrderProof,
  buildSmsPayload,
  encryptOrderPhone,
  encryptOrderSmsCode
} from './crypto.js';

export function makeSmsRequest({ phone, skuId }) {
  return buildSmsPayload({ phone, skuId });
}

export function makeDirectOrderRequest({
  phone,
  smsCode,
  skuId,
  channelCode,
  selfChannelCode,
  referer,
  receipt = true,
  receiptModule = true,
  operDfp = null
}) {
  const proof = buildOrderProof(phone, smsCode);
  return {
    skuId: String(skuId),
    channelCode,
    selfChannelCode: selfChannelCode || channelCode,
    smsCode: encryptOrderSmsCode(smsCode),
    dealType: 0,
    receipt: Boolean(receipt),
    receiptModule: Boolean(receiptModule),
    ticket: 'MOBILE',
    ticketType: 7,
    businessType: 'RIGHTS_MARKET',
    wxoaType: '',
    ...proof,
    from: '',
    phone: encryptOrderPhone(phone),
    referer,
    operDfp: operDfp || null
  };
}

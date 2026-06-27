import { clientFor } from "../bmccClient.js";

export async function queryCouponSummary(session) {
  return clientFor(session).invoke("COUPON_INFO_QRY", { queryScope: "4" });
}

export function summarizeCoupon(data = {}) {
  return {
    universalCanUse: Number(data.universalCouponCanUseNum || 0),
    universalTotal: Number(data.universalCouponTotalNum || 0),
    universalUsed: Number(data.universalCouponUsedNum || 0),
    exclusiveCanUse: Number(data.exclusiveCouponCanUseNum || 0),
    exclusiveTotal: Number(data.exclusiveCouponTotalNum || 0),
    exclusiveUsed: Number(data.exclusiveCouponUsedNum || 0),
    exclusiveCouponList: data.exclusiveCouponList || [],
    universalCouponList: data.universalCouponList || [],
    legalRightsList: data.legalRightsList || []
  };
}


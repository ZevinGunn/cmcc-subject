export const CLASSIC_RIGHTS = Object.freeze({
  friday_wdmei: Object.freeze({
    action: "friday_wdmei",
    title: "周五狂欢日 · 味多美 10 元兑换券",
    activityId: "315",
    offerCode: "2025091810194425",
    offerName: "味多美10元服务兑换券(周五狂欢日专属)",
  }),
  rights_bag_cash: Object.freeze({
    action: "rights_bag_cash",
    title: "权益福袋 · 10 元翼支付通用权益金",
    // The bag activity number changes independently of the Friday activity.
    // Keep the known range here and discover the live activity by offer code.
    activityId: process.env.CT189_RIGHTS_BAG_ACTIVITY_ID || "",
    activityIdCandidates: Object.freeze([
      ...Array.from({ length: 31 }, (_, index) => String(300 + index)),
    ]),
    offerCode: "202408071136574",
    offerName: "10元翼支付通用权益金(福袋)",
  }),
});

export function isClassicEnvelope(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      (value.result !== undefined || value.retCode !== undefined),
  );
}

export function classicSuccess(value) {
  return Boolean(
    isClassicEnvelope(value) &&
      (value.result === undefined || String(value.result) === "0") &&
      (value.retCode === undefined || String(value.retCode) === "000000"),
  );
}

export function findClassicOffer(activity, definition) {
  const object = activity?.object;
  if (!classicSuccess(activity) || !object || !Array.isArray(object.columnList))
    return null;
  for (const column of object.columnList) {
    for (const offer of column?.offerList || []) {
      if (String(offer?.offercode || "") === definition.offerCode)
        return { ...offer, columnName: column.columnName, realNumber: column.realNumber };
    }
  }
  return null;
}

export function explainClassicEligibility(activity, offer, definition) {
  if (!classicSuccess(activity))
    return activity?.retMsg || "活动资格查询失败，请稍后重试";
  const object = activity.object || {};
  if (object.handle === "2" || object.receive === "1")
    return "当前号码暂不具备该活动资格";
  if (!offer) return `活动未提供默认权益：${definition.offerName}`;
  if (String(object.receive) !== "0") return "当前号码暂不具备该活动资格";
  if (String(object.handle) === "3" || String(offer.realNumber) === "0")
    return "本周期已达到领取上限或权益已领取";
  if (String(offer.receiveMark) !== "P")
    return "默认权益当前不可领取，可能已领取或库存不足";
  return "";
}

export function claimMessage(response) {
  const object = response?.object;
  if (!classicSuccess(response)) return response?.retMsg || "活动预校验失败，请稍后重试";
  if (object?.resultCode === "0") return "领取请求已提交，请以电信权益列表最终状态为准";
  return object?.resultMessage || response?.retMsg || "权益领取失败";
}

import { clientFor } from "../bmccClient.js";

const CORE_MONTHLY_AREA = "99PLUS2_CORE_MO";
const CORE_YEARLY_AREA = "99PLUS2_CORE_YR";
const COMMON_AREA = "99PLUS2_COMM";
const DISCOUNT_AREA = "99PLUS2_DISCOUNT";
const EXCLUSIVE_OPERATE_CODE = "99PLUS2_EXCL";
const MEMBER_TYPE = "99PLUS_NEW";
const ACTIVE_ID = 10008;

export async function queryPlus99NewSummary(session) {
  const [core, common, discount, exclusive, activity] = await Promise.allSettled([
    queryCoreRights(session),
    queryCommonRights(session),
    queryDiscountRights(session),
    queryExclusiveRights(session),
    queryActivityInfo(session)
  ]);

  return {
    member: normalizeMember(session?.userInfo || {}),
    core: settledValue(core, {
      claimMethod: "none",
      hasClaimed: false,
      monthly: { canUse: 1, list: [] },
      yearly: { canUse: 1, list: [] }
    }),
    common: settledValue(common, { hasClaimed: false, list: [] }),
    discount: {
      activity: settledValue(activity, null),
      list: settledValue(discount, [])
    },
    exclusive: {
      list: settledValue(exclusive, [])
    },
    errors: settledErrors({ core, common, discount, exclusive, activity })
  };
}

export async function queryCoreRights(session) {
  const [monthly, yearly, claimMethod] = await Promise.all([
    queryRightsByArea(session, CORE_MONTHLY_AREA, "monthly"),
    queryRightsByArea(session, CORE_YEARLY_AREA, "yearly"),
    queryClaimMethod(session)
  ]);
  const monthlyClaimed = monthly.some((item) => Number(item.groupOrderTimes || 0) > 0);
  const yearlyClaimed = yearly.some((item) => Number(item.groupOrderTimes || 0) > 0);

  return {
    claimMethod,
    hasClaimed: claimMethod === "yearly" ? yearlyClaimed : claimMethod === "monthly" ? monthlyClaimed : false,
    monthly: { canUse: monthlyClaimed ? 0 : 1, list: monthly },
    yearly: { canUse: yearlyClaimed ? 0 : 1, list: yearly }
  };
}

export async function queryClaimMethod(session) {
  const result = await clientFor(session).invoke("PLUS99_CLAIM_METHOD_QUERY", {});
  return result.data || "none";
}

export async function queryCommonRights(session) {
  const list = await queryRightsByArea(session, COMMON_AREA, "common");
  return {
    hasClaimed: list.some((item) => Number(item.groupOrderTimes || 0) > 0),
    list
  };
}

export async function queryDiscountRights(session) {
  const result = await clientFor(session).invoke("PLUS99_AREA_RIGHTS_QRY", {
    notInBelongAreas: [],
    belongAreas: [DISCOUNT_AREA]
  });
  return normalizeList(result.data, "discount");
}

export async function queryExclusiveRights(session) {
  const result = await clientFor(session).invoke("PLUS99_SPEC_AREA_QRY", {
    operateCode: EXCLUSIVE_OPERATE_CODE,
    memberType: MEMBER_TYPE
  });
  return normalizeList(result.data, "exclusive");
}

export async function queryActivityInfo(session) {
  const result = await clientFor(session).invoke("NINETY_NINE_PLUS_GET_INFO", { activeId: ACTIVE_ID });
  return {
    resultCode: result.resultCode,
    resultMsg: result.resultMsg,
    data: result.data,
    raw: result.raw
  };
}

export async function queryPlus99NewDetail(session, legalRightsNbr) {
  return clientFor(session).invoke("RIGHTS_DETAIL_QRY_H5", { legalRightsNbr });
}

export async function queryPlus99NewNeedSms(session, payload = {}) {
  return clientFor(session).invoke("BIZ_NEED_CONFIRM_SMS_QRY", buildPlus99SmsBody(payload), { showToast: true });
}

export async function sendPlus99NewSms(session, payload = {}) {
  return clientFor(session).invoke("BIZ_CONFIRM_SMS_SEND", buildPlus99SmsBody(payload));
}

export async function claimPlus99NewRight(session, payload = {}) {
  const legalRightsCode = payload.legalRightsCode || payload.legalRightsNbr || payload.rightCode;
  const body = compactPayload({
    legalRightsCode,
    verifyCode: payload.verifyCode,
    discount: payload.discount,
    wtAc: payload.wtAc,
    wtAcId: payload.wtAcId,
    platform: payload.platform
  });
  return clientFor(session).invoke("open_rights_new99plus", body, { showToast: true });
}

export async function claimPlus99NewExclusive(session, payload = {}) {
  const body = compactPayload({
    discountType: payload.discountType,
    batchId: payload.batchId,
    actId: payload.actId,
    memberType: payload.memberType || MEMBER_TYPE
  });
  return clientFor(session).invoke("PLUS99_CARD_ACT_OPEN", body, { showToast: true });
}

function buildPlus99SmsBody(payload = {}) {
  const rightsCode = payload.rightsCode || payload.legalRightsNbr || payload.legalRightsCode || payload.rightCode;
  return compactPayload({
    rightsCode,
    discount: payload.discount ?? 100,
    activeId: payload.activeId ?? ACTIVE_ID,
    templateId: payload.templateId,
    phoneNo: payload.phoneNo
  });
}

async function queryRightsByArea(session, area, claimType) {
  const result = await clientFor(session).invoke("rights_qry_new99plus", {
    belongAreas: [area]
  });
  return normalizeList(result.data, claimType);
}

function normalizeList(data, claimType) {
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.legalRightsList)
      ? data.legalRightsList
      : Array.isArray(data?.list)
        ? data.list
        : [];
  return list.map((item) => normalizePlus99Right(item, claimType));
}

export function normalizePlus99Right(item = {}, claimType = "") {
  const attrs = allAttrs(item);
  const legalRightsNbr = item.legalRightsNbr || item.rightCode || item.legalRightsCode || "";
  const offerId = item.offerId || item._feAttrOfferId || attrValue(attrs, "offerId");
  return {
    legalRightsId: item.legalRightsId || item.rightId || "",
    legalRightsNbr,
    legalRightsName: item.legalRightsName || item.legalRightsDesc || item.name || "",
    legalRightsName2: item.legalRightsName2 || "",
    legalRightsDesc: item.legalRightsDesc || "",
    statusCd: item.statusCd || "",
    legalRightsType: item.legalRightsType || "",
    offerId,
    belongAreas: item.belongAreas || item.belongAreaList || attrValues(attrs, "belongArea"),
    groupOrderTimes: Number(item.groupOrderTimes || item.orderTimes || 0),
    price: attrValue(attrs, "price") || attrValue(attrs, "vipPrice"),
    vipPrice: attrValue(attrs, "vipPrice"),
    discountPrice: item.discountPrice || attrValue(attrs, "discountPrice"),
    img: attrValue(attrs, "img_330_182") || attrValue(attrs, "img_211_151") || item.img || "",
    remark: attrValue(attrs, "remark"),
    effExplain: attrValue(attrs, "effExplain"),
    orderExplain: attrValue(attrs, "orderExplain"),
    discountType: item.discountType || "",
    batchId: item.batchId || "",
    actId: item.actId || "",
    claimType,
    claimed: Number(item.groupOrderTimes || item.orderTimes || 0) > 0,
    raw: item
  };
}

function normalizeMember(userInfo = {}) {
  return {
    level: Number(userInfo.member99Plus2Level || 0),
    starValue: Number(userInfo.starValue || 0),
    isThreePointFiveStar: Boolean(userInfo.isThreePointFiveStar),
    phoneNo: userInfo.phoneNo || "",
    desensitizedPhoneNumber: userInfo.desensitizedPhoneNumber || "",
    rawUser: userInfo
  };
}

function allAttrs(item = {}) {
  return [
    ...(Array.isArray(item.legalRightsAttrs) ? item.legalRightsAttrs : []),
    ...(Array.isArray(item.entityAttrs) ? item.entityAttrs : []),
    ...(Array.isArray(item.attrs) ? item.attrs : [])
  ];
}

function attrValue(attrs = [], name) {
  const hit = attrs.find((item) => item?.attrNbr === name || item?.attrName === name || Object.prototype.hasOwnProperty.call(item || {}, name));
  if (!hit) return "";
  return hit.attrValue ?? hit.value ?? hit[name] ?? "";
}

function attrValues(attrs = [], name) {
  return attrs
    .filter((item) => item?.attrNbr === name || item?.attrName === name || Object.prototype.hasOwnProperty.call(item || {}, name))
    .map((item) => item.attrValue ?? item.value ?? item[name])
    .filter(Boolean);
}

function compactPayload(payload = {}) {
  return Object.fromEntries(
    Object.entries(payload)
      .map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])
      .filter(([, value]) => value !== "" && value != null)
  );
}

function settledValue(result, fallback) {
  return result.status === "fulfilled" ? result.value : fallback;
}

function settledErrors(results) {
  return Object.fromEntries(
    Object.entries(results)
      .filter(([, result]) => result.status === "rejected")
      .map(([key, result]) => [key, result.reason?.message || "查询失败"])
  );
}

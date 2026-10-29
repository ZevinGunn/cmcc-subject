import { clientFor } from "../bmccClient.js";
import { attrValue, normalizeRight } from "./rightsCatalog.js";
import { queryCouponSummary, summarizeCoupon } from "./couponService.js";
import { queryAllOrders, queryCertificateCodes, resolveOrderOfferId } from "./orderService.js";
import { queryRightDetail } from "./rightsService.js";

export const UNIVERSAL_CERTIFICATE_ID = "1387830401690525697";

const DEFAULT_NOT_IN_AREAS = ["PLUS_19_BLACKLIST"];
const SYNC_EXCHANGE_OFFER_IDS = new Set(["111602045440", "111602045605", "111602052831"]);
const SYNC_EXCHANGE_NAME_PATTERN = /稻香村|苏禾/;
const PUBLIC_ZERO_COST_RIGHTS = [
  createPublicZeroCostRight({
    legalRightsNbr: "QY1765335520502",
    legalRightsName: "稻香村20元消费券",
    legalRightsDesc: "稻香村20元消费券",
    offerId: "111602052831",
    legalRightsSubordinate: "1200",
    legalRightsType: "1126",
    statusCd: "1200",
    goodsName: "消费券",
    goodsAttr: "20元",
    receiveMode: "1400",
    img: "/rights/202512/205fcd9c-e3ff-4011-8441-17c3a75c530a - 稻香村 1.png",
    instructions: "订购成功后，点击【立即查看】按钮，显示核销二维码；仅适用于门店列表中的门店。",
    partnerName: "北京南山拓谱科技有限公司",
    canExchangeTimes: "5",
    canSaleTimes: "5"
  }),
  createPublicZeroCostRight({
    legalRightsNbr: "QY1765338097429",
    legalRightsName: "物美超市20元通用消费券",
    legalRightsDesc: "物美超市20元通用消费券",
    offerId: "111602052832",
    legalRightsSubordinate: "1200",
    legalRightsType: "1126",
    statusCd: "1000",
    goodsName: "通用消费券",
    goodsAttr: "20元",
    receiveMode: "1500",
    img: "/rights/202512/8e7553d6-5d7b-4dfb-b4a2-61eb5c2d743d-wumei.png",
    instructions: "订购成功后，在订单页点击“存入卡包”，跳转北京移动权益站小程序绑定手机号；小程序拉起失败时可复制订单编码手动兑换。",
    partnerName: "巨澄（北京）文化传媒有限公司",
    canExchangeTimes: "6",
    canSaleTimes: "6"
  })
];
const PUBLIC_ZERO_COST_RIGHTS_NBRS = new Set(PUBLIC_ZERO_COST_RIGHTS.map((item) => item.legalRightsNbr));
const ORDER_POLL_ATTEMPTS = 8;
const ORDER_POLL_INTERVAL_MS = 1800;

export async function queryFortuneBag(session, query = {}) {
  const body = {
    sort: query.sort || "0",
    queryScope: "1",
    qryCertIdByUser: "1",
    returnExchangeTimes: "0",
    notInBelongAreas: DEFAULT_NOT_IN_AREAS
  };
  if (query.legalRightsName) body.legalRightsName = query.legalRightsName;
  if (query.certificateId) body.certificateId = query.certificateId;

  const result = await clientFor(session).invoke("COUPON_INFO_QRY", body);
  const list = Array.isArray(result.data?.legalRightsList) ? result.data.legalRightsList : [];
  const visibleList = list.filter((item) => shouldExposeRight(session, item));
  const normalizedItems = visibleList.map(normalizeFortuneRight);
  const pinnedRights = await resolvePublicZeroCostRights(session, normalizedItems, query.legalRightsName);
  return {
    result,
    summary: summarizeCoupon(result.data || {}),
    items: mergePublicZeroCostRights(normalizedItems, pinnedRights)
  };
}

export async function searchFortuneBag(session, keyword) {
  return queryFortuneBag(session, {
    legalRightsName: keyword,
    certificateId: UNIVERSAL_CERTIFICATE_ID
  });
}

export async function batchExchange(session, items = []) {
  const couponResult = await queryCouponSummary(session);
  const coupon = summarizeCoupon(couponResult.data || {});
  const max = coupon.universalCanUse + coupon.exclusiveCanUse;
  const total = items.reduce(
    (sum, item) => sum + Number(item.quantity || 1) * exchangeCost(item),
    0
  );
  if (total > max) {
    return {
      resultCode: "-1",
      resultMsg: `购物车共需 ${total} 张券，当前可用 ${max} 张`,
      data: []
    };
  }

  const expanded = [];
  for (const item of items) {
    const quantity = Math.max(1, Number(item.quantity || 1));
    for (let i = 0; i < quantity; i += 1) expanded.push(item);
  }

  const data = [];
  for (const item of expanded) {
    const body = buildExchangeBody(item, coupon);
    data.push({
      item: body,
      response: await clientFor(session).invoke("COUPON_OPEN_TEL_FEE_AUTH", body, { showToast: true })
    });
  }
  return { resultCode: "0", resultMsg: "批量兑换请求已完成", data };
}

export async function syncExchangeOne(session, item = {}, options = {}) {
  const usePublicZeroCostFallback = isPublicZeroCostRight(item) && !(item.rightId || item.legalRightsId);
  const requestBody = usePublicZeroCostFallback
    ? buildPublicZeroCostExchangeBody(session, item)
    : buildExchangeBody(item, summarizeCoupon((await queryCouponSummary(session)).data || {}));
  if (
    !requestBody.offerId ||
    !requestBody.rightCode ||
    (usePublicZeroCostFallback ? !requestBody.accNbr : !requestBody.rightId)
  ) {
    return {
      resultCode: "-1",
      resultMsg: "兑换参数不完整",
      item: requestBody,
      exchangeResponse: null,
      order: null,
      codes: [],
      codeDetail: null,
      status: "invalid"
    };
  }

  const startedAt = Date.now();
  const exchangeResponse = await clientFor(session).invoke(
    usePublicZeroCostFallback ? "INNER_OPEN_TEL_FEE_AUTH" : "COUPON_OPEN_TEL_FEE_AUTH",
    requestBody,
    { showToast: true }
  );
  if (!isSuccessResult(exchangeResponse)) {
    return {
      resultCode: exchangeResponse.resultCode || "-1",
      resultMsg: exchangeResponse.resultMsg || "兑换提交失败",
      item: requestBody,
      exchangeResponse,
      order: null,
      codes: [],
      codeDetail: null,
      status: "exchange_failed"
    };
  }

  const order = await waitForOrder(session, item, startedAt, options);
  if (!order) {
    return {
      resultCode: "0",
      resultMsg: "兑换已提交，暂未查询到订单",
      item: requestBody,
      exchangeResponse,
      order: null,
      codes: [],
      codeDetail: null,
      status: "order_pending"
    };
  }

  const codeDetail = await queryCertificateCodes(session, {
    extOrderId: order.custOrderId,
    sku: order.legalRightsNbr
  });
  const codes = Array.isArray(codeDetail.data) ? codeDetail.data.map(normalizeCode) : [];

  return {
    resultCode: "0",
    resultMsg: codes.length ? "兑换完成，已查询到券码" : "兑换完成，订单暂无券码",
    item: requestBody,
    exchangeResponse,
    order: normalizeOrder(order),
    codes,
    codeDetail,
    status: codes.length ? "code_ready" : "code_pending"
  };
}

export async function targetCouponCodes(session, target) {
  const orders = await queryAllOrders(session);
  const orderRows = Array.isArray(orders.data) ? orders.data : [];
  const filtered = orderRows.filter((order) => matchTarget(order, target));
  const codeResults = [];

  for (const order of filtered) {
    const detail = await queryCertificateCodes(session, {
      extOrderId: order.custOrderId,
      sku: order.legalRightsNbr
    });
    const codes = Array.isArray(detail.data) ? detail.data : [];
    for (const code of codes) {
      if (isActiveCode(code)) {
        codeResults.push({
          order: normalizeOrder(order),
          code: normalizeCode(code),
          detail
        });
      }
    }
  }

  return {
    target,
    orders,
    items: codeResults
  };
}

export function normalizeFortuneRight(item = {}) {
  const right = normalizeRight(item);
  const syncExchange = isSyncExchangeRight(right);
  return {
    ...right,
    exchangeMode: syncExchange ? "sync" : "batch",
    syncExchange
  };
}

export function mergePublicZeroCostRights(items = [], pinnedRights = PUBLIC_ZERO_COST_RIGHTS) {
  const pinnedCodes = new Set(pinnedRights.map((item) => item.legalRightsNbr));
  return [
    ...pinnedRights,
    ...items.filter((item) => !pinnedCodes.has(item.legalRightsNbr || item.rightCode || ""))
  ];
}

export function shouldExposeRight(session, item = {}) {
  return Boolean(item && typeof item === "object");
}

export function isPublicZeroCostRight(item = {}) {
  return PUBLIC_ZERO_COST_RIGHTS_NBRS.has(item.legalRightsNbr || item.rightCode || "");
}

export function exchangeCost(item = {}) {
  return Number(item.certificateNum ?? item.exchangeNum ?? 0);
}

export function isSyncExchangeRight(item = {}) {
  const raw = item.raw || item;
  const offerId = String(item.offerId || raw.offerId || attrValue(raw.legalRightsAttrs, "offerId") || "");
  const text = [
    item.legalRightsName,
    item.legalRightsName2,
    item.legalRightsNbr,
    raw.legalRightsName,
    raw.legalRightsDesc,
    raw.brandDTO?.brandName,
    raw.brandDTO?.brandDesc
  ]
    .filter(Boolean)
    .join(" ");
  return SYNC_EXCHANGE_OFFER_IDS.has(offerId) || SYNC_EXCHANGE_NAME_PATTERN.test(text);
}

export function normalizeOrder(order = {}) {
  return {
    custOrderId: order.custOrderId || "",
    extCustOrderId: order.extCustOrderId || "",
    custOrderType: order.custOrderType || "",
    legalRightsName: order.legalRightsName || "",
    legalRightsNbr: order.legalRightsNbr || "",
    date: order.date || "",
    statusCd: order.statusCd || "",
    offerId: resolveOrderOfferId(order),
    receiveMode: attrValueFromOrder(order, "receiveMode"),
    img: attrValueFromOrder(order, "img_330_182"),
    raw: order
  };
}

export function normalizeCode(code = {}) {
  return {
    cardPwd: code.cardPwd || "",
    cardNo: code.cardNo || "",
    state: code.state || "",
    startDate: code.startDate || "",
    endDate: code.endDate || "",
    expDay: code.expDay || code.expDate || ""
  };
}

export function attrValueFromOrder(order, key) {
  for (const attr of order?.legalRightsAttrs || []) {
    if (attr?.attrNbr === key) return attr.attrValue;
    if (Object.prototype.hasOwnProperty.call(attr || {}, key)) return attr[key];
  }
  return "";
}

function matchTarget(order, target) {
  const text = `${order.legalRightsName || ""} ${order.legalRightsNbr || ""} ${JSON.stringify(order.legalRightsAttrs || [])}`;
  if (target === "wedome") return /味多美/.test(text);
  if (target === "daoxiangcun") return /稻香村|苏禾/.test(text);
  return false;
}

function isActiveCode(code) {
  if (String(code.state || "") !== "0") return false;
  const end = parseEndDate(code.endDate);
  return !end || end.getTime() >= Date.now();
}

function isSuccessResult(result = {}) {
  const code = String(result.resultCode ?? "");
  return code === "0" || code === "000000";
}

export function buildExchangeBody(item = {}, coupon = {}) {
  const certificate = resolveCertificate(item, coupon);
  return {
    offerId: item.offerId,
    rightCode: item.rightCode || item.legalRightsNbr,
    rightId: item.rightId || item.legalRightsId,
    certificateId: certificate.certificateId,
    certificateNum: certificate.certificateNum,
    checkSwitch: false
  };
}

export function buildPublicZeroCostExchangeBody(session, item = {}) {
  return {
    accNbr: session?.userInfo?.phoneNo || item.accNbr || "",
    offerId: item.offerId,
    rightCode: item.rightCode || item.legalRightsNbr,
    memberLevelCode: item.memberLevelCode || "1"
  };
}

function resolveCertificate(item = {}, coupon = {}) {
  const kind = item.certificateKind === "exclusive" ? "exclusive" : "universal";
  if (kind === "exclusive") {
    const certificate =
      certificateList(item).find((row) => row.certificateType === "1002" && row.certificateId === item.certificateId) ||
      certificateList(item).find((row) => row.certificateType === "1002" && row.certificateId) ||
      (coupon.exclusiveCouponList || []).find((row) => row.certificateId === item.certificateId) ||
      (coupon.exclusiveCouponList || []).find((row) => row.certificateId);
    if (certificate?.certificateId) {
      return {
        certificateId: certificate.certificateId,
        certificateNum: exchangeCost({
          certificateNum: item.certificateNum,
          exchangeNum: certificate.exchangeNum ?? item.exchangeNum ?? 1
        })
      };
    }
    throw new Error("未找到可用的专属兑换券");
  }

  const universalCertificate =
    certificateList(item).find((row) => row.certificateType === "1001" || row.certificateId === UNIVERSAL_CERTIFICATE_ID) || {};
  return {
    certificateId: UNIVERSAL_CERTIFICATE_ID,
    certificateNum: exchangeCost({
      certificateNum: item.certificateNum,
      exchangeNum: universalCertificate.exchangeNum ?? item.exchangeNum ?? 1
    })
  };
}

function certificateList(item = {}) {
  return item.certificateList || item.raw?.certificateList || [];
}

async function resolvePublicZeroCostRights(session, items, keyword = "") {
  const normalizedKeyword = String(keyword || "").trim().toLowerCase();
  const candidates = PUBLIC_ZERO_COST_RIGHTS.filter((item) =>
    !normalizedKeyword || `${item.legalRightsName} ${item.legalRightsDesc} ${item.legalRightsNbr} ${item.offerId}`.toLowerCase().includes(normalizedKeyword)
  );

  return Promise.all(
    candidates.map(async (fixedItem) => {
      const listedItem = items.find((item) => item.legalRightsNbr === fixedItem.legalRightsNbr);
      if (listedItem) return mergePublicZeroCostRight(fixedItem, listedItem);
      try {
        const detail = await queryRightDetail(session, fixedItem.legalRightsNbr);
        if (detail?.item) return mergePublicZeroCostRight(fixedItem, detail.item);
      } catch {
        // The two public rights can use the existing quick exchange ability without rightId.
      }
      return { ...fixedItem, exchangeAvailable: true };
    })
  );
}

function mergePublicZeroCostRight(fixedItem, liveItem) {
  return {
    ...fixedItem,
    ...liveItem,
    legalRightsName: fixedItem.legalRightsName,
    legalRightsDesc: fixedItem.legalRightsDesc,
    offerId: fixedItem.offerId,
    exchangeNum: 0,
    certificateNum: 0,
    certificateList: fixedItem.certificateList,
    img: liveItem.img || fixedItem.img,
    raw: { ...fixedItem.raw, ...(liveItem.raw || {}) },
    exchangeMode: "sync",
    syncExchange: true,
    publicZeroCost: true,
    exchangeAvailable: true
  };
}

function createPublicZeroCostRight(config) {
  const certificateList = [
    {
      certificateId: UNIVERSAL_CERTIFICATE_ID,
      certificateType: "1001",
      exchangeNum: 0
    }
  ];
  const raw = {
    ...config,
    exchangeNum: 0,
    certificateNum: 0,
    certificateList,
    relatedPeriodic: "0",
    memberPackageLevel: "1000",
    legalRightsAttrs: [
      { attrNbr: "offerId", attrValue: config.offerId },
      { attrNbr: "receiveMode", attrValue: config.receiveMode },
      { attrNbr: "vipPrice", attrValue: "0" },
      { attrNbr: "instructions", attrValue: config.instructions },
      { attrNbr: "partnerName", attrValue: config.partnerName },
      { attrNbr: "canExchangeTimes", attrValue: config.canExchangeTimes },
      { attrNbr: "canSaleTimes", attrValue: config.canSaleTimes },
      { attrNbr: "img_330_182", attrValue: config.img }
    ]
  };
  return {
    ...normalizeFortuneRight(raw),
    exchangeNum: 0,
    certificateNum: 0,
    certificateList,
    exchangeMode: "sync",
    syncExchange: true,
    publicZeroCost: true,
    exchangeAvailable: true,
    pinned: true
  };
}

async function waitForOrder(session, item, startedAt, options = {}) {
  const attempts = Number(options.attempts || ORDER_POLL_ATTEMPTS);
  const intervalMs = Number(options.intervalMs || ORDER_POLL_INTERVAL_MS);
  for (let index = 0; index < attempts; index += 1) {
    const order = await findRecentOrder(session, item, startedAt);
    if (order) return order;
    if (index < attempts - 1) await sleep(intervalMs);
  }
  return null;
}

async function findRecentOrder(session, item, startedAt) {
  const months = recentMonthKeys(startedAt);
  const rows = [];
  for (const month of months) {
    const result = await queryAllOrders(session, { queryMonth: month });
    if (Array.isArray(result.data)) rows.push(...result.data);
  }
  const candidates = rows.filter((order) => orderMatchesItem(order, item));
  candidates.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  return candidates[0] || null;
}

function orderMatchesItem(order = {}, item = {}) {
  const rightCode = item.rightCode || item.legalRightsNbr;
  const offerId = String(item.offerId || "");
  const orderOfferId = String(order.offerId || attrValueFromOrder(order, "offerId") || "");
  if (rightCode && order.legalRightsNbr && String(order.legalRightsNbr) === String(rightCode)) return true;
  if (offerId && orderOfferId && offerId === orderOfferId) return true;
  const itemName = item.legalRightsName || item.raw?.legalRightsName || "";
  return itemName && order.legalRightsName && String(order.legalRightsName).includes(String(itemName).replace(/-Plus版A端$/, ""));
}

function recentMonthKeys(value) {
  const date = new Date(value || Date.now());
  const current = monthKey(date);
  const prevDate = new Date(date);
  prevDate.setMonth(prevDate.getMonth() - 1);
  const prev = monthKey(prevDate);
  return current === prev ? [current] : [current, prev];
}

function monthKey(value) {
  const date = new Date(value);
  const pad = (part) => String(part).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseEndDate(value) {
  if (!value) return null;
  const normalized = String(value).replace(/-/g, "/");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

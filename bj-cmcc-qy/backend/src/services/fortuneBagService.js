import { clientFor } from "../bmccClient.js";
import { attrValue, normalizeRight } from "./rightsCatalog.js";
import { queryCouponSummary, summarizeCoupon } from "./couponService.js";
import { queryAllOrders, queryCertificateCodes } from "./orderService.js";

export const UNIVERSAL_CERTIFICATE_ID = "1387830401690525697";

const DEFAULT_NOT_IN_AREAS = ["PLUS_19_BLACKLIST"];
const HIDDEN_RIGHTS_NBRS = new Set(["QY1765335520502"]);
const ZERO_COST_RIGHTS_ALLOWED_PHONES = new Set(["15210334812"]);
const SYNC_EXCHANGE_OFFER_IDS = new Set(["111602045440", "111602045605", "111602052831"]);
const SYNC_EXCHANGE_NAME_PATTERN = /稻香村|苏禾/;
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
  return {
    result,
    summary: summarizeCoupon(result.data || {}),
    items: visibleList.map(normalizeFortuneRight)
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
  const total = items.reduce((sum, item) => sum + Number(item.quantity || 1) * Number(item.certificateNum || item.exchangeNum || 1), 0);
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
    const body = {
      offerId: item.offerId,
      rightCode: item.rightCode || item.legalRightsNbr,
      rightId: item.rightId || item.legalRightsId,
      certificateId: item.certificateId || UNIVERSAL_CERTIFICATE_ID,
      certificateNum: item.certificateNum || item.exchangeNum || 1,
      checkSwitch: false
    };
    data.push({
      item: body,
      response: await clientFor(session).invoke("COUPON_OPEN_TEL_FEE_AUTH", body, { showToast: true })
    });
  }
  return { resultCode: "0", resultMsg: "批量兑换请求已完成", data };
}

export async function syncExchangeOne(session, item = {}, options = {}) {
  const requestBody = buildExchangeBody(item);
  if (!requestBody.offerId || !requestBody.rightCode || !requestBody.rightId) {
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
  const exchangeResponse = await clientFor(session).invoke("COUPON_OPEN_TEL_FEE_AUTH", requestBody, { showToast: true });
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

function shouldExposeRight(session, item = {}) {
  if (HIDDEN_RIGHTS_NBRS.has(item?.legalRightsNbr || item?.rightCode || "")) return false;
  if (canViewZeroCostRights(session)) return true;
  return rightCost(item) !== 0;
}

function canViewZeroCostRights(session) {
  return ZERO_COST_RIGHTS_ALLOWED_PHONES.has(String(session?.userInfo?.phoneNo || ""));
}

function rightCost(item = {}) {
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
    offerId: order.offerId || attrValueFromOrder(order, "offerId"),
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

function buildExchangeBody(item = {}) {
  return {
    offerId: item.offerId,
    rightCode: item.rightCode || item.legalRightsNbr,
    rightId: item.rightId || item.legalRightsId,
    certificateId: item.certificateId || UNIVERSAL_CERTIFICATE_ID,
    certificateNum: item.certificateNum || item.exchangeNum || 1,
    checkSwitch: false
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

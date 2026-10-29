import { clientFor } from "../bmccClient.js";

export async function queryOrders(session, query = {}) {
  return clientFor(session).invoke("COUPON_RECODES_QRY", {
    busiNbr: query.busiNbr || "LegalRights",
    custOrderType: query.custOrderType || "9003",
    ...query
  });
}

export async function queryAllOrders(session, query = {}) {
  const result = await clientFor(session).invoke("RIGHTS_ALL_RECODE", {
    ...query
  });
  const rows = Array.isArray(result?.data) ? result.data : [];
  return {
    ...result,
    data: rows.map((order) => ({
      ...order,
      offerId: resolveOrderOfferId(order)
    }))
  };
}

export async function queryOrderDetail(session, custOrderId) {
  return clientFor(session).invoke("GET_ORDER_DETAIL_INFO", { custOrderId });
}

export async function queryCertificateCodes(session, payload) {
  return clientFor(session).invoke("MEITUAN_CERTIFICATE_QRY", payload);
}

export function resolveOrderOfferId(order = {}) {
  const direct = order.offerId ?? order.offerid ?? order.offerID ?? order.OFFER_ID;
  if (String(direct ?? "").trim()) return String(direct).trim();

  for (const attr of order.legalRightsAttrs || []) {
    const attrName = String(attr?.attrNbr || "").replace(/[_-]/g, "").toLowerCase();
    if (attrName === "offerid") {
      return String(attr?.attrValue ?? attr?.value ?? "").trim();
    }
    const offerEntry = Object.entries(attr || {}).find(
      ([key]) => key.replace(/[_-]/g, "").toLowerCase() === "offerid"
    );
    if (offerEntry && String(offerEntry[1] ?? "").trim()) return String(offerEntry[1]).trim();
  }
  return "";
}

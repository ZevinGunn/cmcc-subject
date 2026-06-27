import { clientFor } from "../bmccClient.js";

export async function queryOrders(session, query = {}) {
  return clientFor(session).invoke("COUPON_RECODES_QRY", {
    busiNbr: query.busiNbr || "LegalRights",
    custOrderType: query.custOrderType || "9003",
    ...query
  });
}

export async function queryAllOrders(session, query = {}) {
  return clientFor(session).invoke("RIGHTS_ALL_RECODE", {
    ...query
  });
}

export async function queryOrderDetail(session, custOrderId) {
  return clientFor(session).invoke("GET_ORDER_DETAIL_INFO", { custOrderId });
}

export async function queryCertificateCodes(session, payload) {
  return clientFor(session).invoke("MEITUAN_CERTIFICATE_QRY", payload);
}

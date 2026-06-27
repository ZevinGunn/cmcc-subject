import { clientFor } from "../bmccClient.js";
import { loadPlusPackages, normalizeRight } from "./rightsCatalog.js";

export async function queryRights(session, query = {}) {
  const payload = {
    belongAreas: query.belongAreas || ["1000"],
    rightsType: query.rightsType || ["1000", "1001", "1002", "1005", "1006", "1007", "1012", "1013", "1014"],
    page: Number(query.page || 1),
    rows: Number(query.rows || 9999),
    notInBelongAreas: query.notInBelongAreas || ["DETAILS_ORDER_VISIBLE_ONLY"],
    filterBigAttrFlag: query.filterBigAttrFlag ?? true
  };
  if (query.legalRightsNbr) payload.legalRightsNbr = query.legalRightsNbr;
  if (query.keyword) payload.keyword = query.keyword;

  const result = await clientFor(session).invoke("RIGHTS_INFO_TELE_PAGE", payload);
  if (Array.isArray(result.data)) {
    result.items = result.data.map(normalizeRight);
  }
  return result;
}

export async function queryRightDetail(session, legalRightsNbr) {
  const result = await queryRights(session, { page: 1, rows: 1, legalRightsNbr });
  result.item = Array.isArray(result.items) ? result.items[0] : null;
  return result;
}

export function plusPackages() {
  return loadPlusPackages();
}


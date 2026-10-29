import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const plusFile = path.resolve(__dirname, "../../../vendor/original/plus-packages.json");

export function attrValue(attrs = [], name) {
  const hit = attrs.find((item) => item.attrNbr === name);
  return hit?.attrValue || "";
}

export function normalizeRight(item = {}) {
  return {
    legalRightsId: item.legalRightsId || "",
    legalRightsNbr: item.legalRightsNbr || item.rightCode || "",
    legalRightsName: item.legalRightsName || item.legalRightsDesc || "",
    legalRightsName2: item.legalRightsName2 || "",
    statusCd: item.statusCd || "",
    exchangeNum: item.exchangeNum ?? item.certificateNum ?? 0,
    certificateNum: item.certificateNum ?? item.exchangeNum ?? 0,
    certificateList: item.certificateList || [],
    legalRightsType: item.legalRightsType || "",
    offerId: item.offerId || attrValue(item.legalRightsAttrs, "offerId"),
    price: attrValue(item.legalRightsAttrs, "price") || attrValue(item.legalRightsAttrs, "vipPrice"),
    img: attrValue(item.legalRightsAttrs, "img_330_182", true) || attrValue(item.legalRightsAttrs, "img_211_151"),
    remark: attrValue(item.legalRightsAttrs, "remark"),
    orderExplain: attrValue(item.legalRightsAttrs, "orderExplain"),
    raw: item
  };
}

export function loadPlusPackages() {
  try {
    const parsed = JSON.parse(fs.readFileSync(plusFile, "utf8"));
    const rows = Array.isArray(parsed) ? parsed : parsed.data || [];
    return rows.map(normalizeRight);
  } catch {
    return [];
  }
}

export function couponEnough(coupon, right, certificateId) {
  if (!coupon || !right) return false;
  const certificateList = right.raw?.certificateList || right.certificateList || [];
  const need = Number(right.certificateNum ?? right.exchangeNum ?? 0);
  if (!certificateList.length) return Number(coupon.universalCouponCanUseNum || 0) >= need;

  return certificateList.some((cert) => {
    const exchangeNum = Number(cert.exchangeNum ?? 0);
    if (cert.certificateType === "1001") return Number(coupon.universalCouponCanUseNum || 0) >= exchangeNum;
    if (cert.certificateType === "1002") {
      const certId = certificateId || cert.certificateId;
      const hit = (coupon.exclusiveCouponList || []).find((item) => item.certificateId === certId);
      return Number(hit?.exclusiveCouponCanUseNum || 0) >= exchangeNum;
    }
    return false;
  });
}

const { defaults } = require("./config");

function assembleUuid() {
  const s1 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return (
    s1() +
    s1() +
    "-" +
    s1() +
    "-" +
    s1() +
    "-" +
    s1() +
    "-" +
    s1() +
    s1() +
    s1()
  );
}

function randomDigits(length) {
  const digits = "0123456789";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += digits[Math.floor(Math.random() * digits.length)];
  }
  return out;
}

function parseListParam(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  const trimmed = String(value).trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }
  return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
}

function normalizeUserInfo(query) {
  const input = query || {};
  const base = defaults.userInfo;
  return {
    cid: input.cid || base.cid,
    en: input.en || base.en,
    token: input.token || input.t || base.token,
    sn: input.sn || base.sn,
    version: input.version || input.cv || base.version,
    st: input.st || base.st,
    sv: input.sv || base.sv,
    sp: input.sp || base.sp,
    xk: input.xk || base.xk,
    channel: input.channel || base.channel,
    province: input.province || input.prov || base.province,
    city: input.city || base.city,
    phoneNumber: input.phoneNumber || input.tel || base.phoneNumber,
    imei: input.imei || base.imei,
    nt: input.nt || base.nt,
    sb: input.sb || base.sb,
  };
}

function buildReqBody(query, userInfo) {
  const source = query || {};
  const fallbackProvince =
    userInfo.province && userInfo.province !== "9999" && userInfo.province !== "0"
      ? userInfo.province
      : "100";
  const fallbackCity =
    userInfo.city && userInfo.city !== "0" ? userInfo.city : "0000";
  const provinceCode = source.provinceCode || source.provC || fallbackProvince;
  const cityCode = source.cityCode || source.cityC || fallbackCity;
  const cellNum = source.cellNum || userInfo.phoneNumber || "99999999999";
  const channelType = source.channelType || "2";
  const scopePageCode =
    source.scopePageCode || (source.fontType === "2" ? "21106" : "22958");
  const filteredChildIds = parseListParam(
    source.filteredChildIds || source.excludeMarkIds
  );

  return {
    provinceCode,
    cityCode,
    cellNum,
    channelType,
    scopePageCode,
    filteredChildIds,
  };
}

function normalizeNumber(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

module.exports = {
  assembleUuid,
  randomDigits,
  parseListParam,
  normalizeUserInfo,
  buildReqBody,
  normalizeNumber,
};

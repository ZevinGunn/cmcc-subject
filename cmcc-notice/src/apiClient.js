const fetch = require("node-fetch");
const https = require("https");
const crypto = require("crypto");
const { baseHost, apiPath, keys } = require("./config");
const { encryptAES, md5 } = require("./crypto");
const { assembleUuid, randomDigits } = require("./utils");

const legacyRenegotiation =
  crypto.constants && crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT;
const httpsAgent = legacyRenegotiation
  ? new https.Agent({
      keepAlive: true,
      secureOptions: legacyRenegotiation,
    })
  : new https.Agent({ keepAlive: true });

function buildFetchData(userInfo, reqBody) {
  return JSON.stringify({
    cid: userInfo.cid || "0",
    en: userInfo.en || "0",
    t: userInfo.token || "0",
    sn: userInfo.sn || "0",
    cv: userInfo.version || "0",
    st: userInfo.st || "0",
    sv: userInfo.sv || "0",
    sp: userInfo.sp || "0",
    xk: userInfo.xk || "0",
    xc: "web",
    imei: userInfo.imei || "",
    nt: userInfo.nt || "",
    sb: userInfo.sb || "",
    prov: userInfo.province || "0",
    city: userInfo.city || "0",
    tel: userInfo.phoneNumber || "0",
    reqBody,
  });
}

function buildHeaders({ urlPath, xk, jsessionId }) {
  const time = Date.now();
  const nonce = randomDigits(8);
  const tokenPayload = `${xk}_${urlPath}_${time}_${nonce}`;
  const xToken = encryptAES(tokenPayload, keys.reqKey, keys.iv);
  const signPayload = `${xToken}_${time}_${nonce}_${jsessionId}`;

  const origin = baseHost || "https://h.app.coc.10086.cn";
  const info = encodeURIComponent(
    JSON.stringify({
      cid: "0",
      en: "0",
      token: "0",
      sn: "0",
      version: "0",
      st: "0",
      sv: "0",
      sp: "0",
      xk: "0",
      channel: "web",
      province: "9999",
      city: "0000",
      phoneNumber: "99999999999",
      osType: "0",
      isTouch: false,
      hasLogin: false,
      channelType: "2",
    })
  );
  const referer =
    `${origin}/cmcc-app/uni-pages/tariffZoneAnncList.html` +
    `?sourcePageType=tariffZonePers&provC=100&cityC=0000&info=${info}` +
    "&fontType=1&isCareMode=1";
  const userAgent =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) " +
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 " +
    "Mobile/15E148 Safari/604.1";

  return {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
      Origin: origin,
      Referer: referer,
      "User-Agent": userAgent,
      "x-time": String(time),
      "x-nonce": String(nonce),
      "x-token": xToken,
      "x-sign": md5(signPayload),
      "x-qen": "1",
    },
    time,
    nonce,
    xToken,
  };
}

async function fetchAnnouncements({ userInfo, reqBody }) {
  const urlPath = apiPath.startsWith("/") ? apiPath : `/${apiPath}`;
  const url = `${baseHost}${urlPath}`;
  const xk = userInfo.xk && userInfo.xk !== "0" ? userInfo.xk : assembleUuid();
  const enrichedUser = { ...userInfo, xk };
  const fetchData = buildFetchData(enrichedUser, reqBody);
  const jsessionId = null;
  const { headers } = buildHeaders({ urlPath, xk, jsessionId });
  const body = encryptAES(fetchData, keys.reqKey, keys.iv);

  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
    agent: httpsAgent,
  });

  const text = await response.text();
  const xPen = response.headers.get("x-pen");
  let payload;
  try {
    payload = JSON.parse(text);
  } catch (err) {
    payload = { body: text };
  }

  if (!payload || !payload.body) {
    return {
      status: response.status,
      body: null,
      raw: payload,
      xPen,
      requestPayload: fetchData,
    };
  }

  return {
    status: response.status,
    body: payload.body,
    raw: payload,
    xPen,
    requestPayload: fetchData,
  };
}

module.exports = {
  fetchAnnouncements,
};

const path = require("path");

const env = (process.env.APP_ENV || "formal").toLowerCase();
const baseHost = process.env.BASE_HOST || "https://h.app.coc.10086.cn";
const apiPath =
  process.env.API_PATH || "/biz-orange/DH/tariff/personal/announcement/list";

const keys = {
  formal: {
    reqKey: "foorettD7vcBawt3",
    respKey: "UVic06tpXgMNiApm",
    iv: "9791027341711819",
  },
  gray: {
    reqKey: "BHtQRepXEBWle7CJ",
    respKey: "t6MoEZ94s0bDOaws",
    iv: "1234567890123456",
  },
};

const activeKeys = keys[env] || keys.formal;

const defaults = {
  userInfo: {
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
    imei: "",
    nt: "",
    sb: "",
  },
};

const cachePath = path.join(__dirname, "..", "data", "cache.json");

module.exports = {
  env,
  baseHost,
  apiPath,
  keys: activeKeys,
  defaults,
  cachePath,
};

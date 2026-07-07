(function (para) {
  var p = para.sdk_url;
  var n = para.name;
  var w = window;
  var d = document;
  var s = "script";
  var x = null;
  var y = null;
  if (typeof w.hecaiyunDataAnalytic2021 !== "undefined") {
    return false;
  }
  w.hecaiyunDataAnalytic2021 = n;
  w[n] =
    w[n] ||
    function (a) {
      return function () {
        (w[n]._q = w[n]._q || []).push([a, arguments]);
      };
    };
  var ifs = [
    "track",
    "quick",
    "register",
    "registerPage",
    "registerOnce",
    "trackSignup",
    "trackAbtest",
    "setProfile",
    "setOnceProfile",
    "appendProfile",
    "incrementProfile",
    "deleteProfile",
    "unsetProfile",
    "identify",
    "login",
    "logout",
    "trackLink",
    "clearAllRegister",
    "getAppStatus",
    "putPhoneNumberInfo",
    "clearPhoneNumberInfo",
    "customTrackOnce",
    "customRegister",
  ];
  for (var i = 0; i < ifs.length; i++) {
    w[n][ifs[i]] = w[n].call(null, ifs[i]);
  }
  if (!w[n]._t) {
    (x = d.createElement(s)), (y = d.getElementsByTagName(s)[0]);
    x.async = 1;
    x.src = p;
    x.setAttribute("charset", "UTF-8");
    w[n].para = para;
    y.parentNode.insertBefore(x, y);
  }
})({
  sdk_url: "static/js/autoTrack/hecaiyun.sdk.js", // 测试地址
  server_url: "https://datacenter.mail.10086.cn/datacenter/",
  // server_url: window.location.host === 'yun.139.com' ? 'https://datacenter.mail.10086.cn/datacenter/' : 'http://datacentertest.c.139.com/datacenter/', // 生产地址
  name: "hecaiyun",
  show_log: false,
  platform: "h5",
  source: "china-mobile-cloud",
  heatmap: {
    clickmap: "default",
    scroll_notice_map: "default",
  },
});

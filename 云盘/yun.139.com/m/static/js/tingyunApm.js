!(function (t, n, e, i, a) {
  var c = "__ty_web_inject_guard",
    o = "__ty_web_tpl_guard",
    r = "https:",
    d = "http:",
    s = "//";
  function u() {
    var t = [].slice.call(arguments);
    u.q.push(t);
  }
  function _(t) {
    var n,
      i = "tingyun_agent",
      a = e.getElementsByTagName("head")[0];
    !e.getElementById(i) &&
      a &&
      (((n = e.createElement("script")).id = i),
      (n.async = !0),
      (n.crossorigin = "anonymous"),
      (n.src = t),
      a.appendChild(n));
  }
  try {
    if (!n[o]) {
      (u.q = []), (n[i] = u), (n.TINGYUN_COOKIE_VALUE = e.cookie);
      var h = "TINGYUN_DATA=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      (e.cookie = h), (e.cookie = "".concat(h, "path=/")), (n[o] = !0);
    }
    if (!n[c])
      if (!/(MSIE [0-6].\\d+)/.test(n.navigator.userAgent)) {
        var f = {};
        t(f);
        var g,
          p,
          y = f.config || {};
        try {
          g = n.location.protocol;
        } catch (v) {}
        var l = y.addr;
        l
          ? (p = g === r ? l.https : g === d ? l.http : l.other)
          : 0 !== (p = a || "").indexOf(r + s) &&
            0 !== p.indexOf(d + s) &&
            (0 === p.indexOf(s) && (p = p.substring(2)),
            p && (g !== r && g !== d && (g = r), (p = g + s + p))),
          p &&
            n.addEventListener &&
            (n.addEventListener("load", function () {
              try {
                setTimeout(function () {
                  try {
                    _(p);
                  } catch (v) {}
                });
              } catch (v) {}
            }),
            (n[c] = !0));
      }
  } catch (v) {}
})(
  function (ty_tpl) {
    ty_tpl.config = {
      addr: {
        http: "https://data.cmicapm.com:8080/newapp/js/tingyun-origin-7.js",
        https: "https://data.cmicapm.com:8080/newapp/js/tingyun-origin-7.js",
        other: "https://data.cmicapm.com:8080/newapp/js/tingyun-origin-7.js",
      },
    };
  },
  window,
  document,
  "TingyunWeb",
  ""
);
window.TingyunWeb("init", {
  dsn: "25f5153b46354b008f224909eb38d7dc|lNXvexXCq6I|4Nl_NnGbjwY@data.cmicapm.com:8080",
  plugins: ["TingyunPluginEnc"],
  common: {
    protocolDomainConfig: {
      http: "https://data.cmicapm.com:8080/newapp",
      https: "https://data.cmicapm.com:8080/newapp",
      other: "https://data.cmicapm.com:8080/newapp",
    },
  },
  page: {
    drThreshold: 1000,
    fpThreshold: 1000,
    fsThreshold: 1000,
    leThreshold: 2000,
  },
  ajax: {
    recordAll: {
      reqBody: true,
      reqHeaders: true,
      resBody: true,
      resHeaders: true,
      urlParams: true,
    },
  },
  resource: {
    keyUrls: [
      "upload.mcloud.139.com:443/storageWeb/servlet/uploadFileServlet*",
    ],
  },
  replay: {
    sampleRate: 0.1,
  },
  webVitals: {
    ttiThreshold: 1000,
  },
  enc: {
    enabled: true,
    mode: "gm",
    pubKey:
      "04F7700136569F4439EF802B1CE2C1A636EE84AE5B09B784C66BB97837E2B34AB3EF029D9A1CD96C1780D1976B9CB4C4C5A6C190B1DA70E9D2C0A28F455BE3E87B",
  },
});

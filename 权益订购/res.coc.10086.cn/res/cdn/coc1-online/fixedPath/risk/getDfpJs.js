/*
 UAParser.js v0.7.20
 Lightweight JavaScript-based User-Agent string parser
 https://github.com/faisalman/ua-parser-js

 Copyright © 2012-2019 Faisal Salman <f@faisalman.com>
 Licensed under MIT License
*/
function Ka() {
  function mb() {
    new La().getFingerprint(ua, function (a) {
      if (Ma()) JS.onSuccess(a);
    });
  }
  function Rb(a) {
    var b = [],
      c = [],
      d = ["deviceName"],
      e;
    e = [];
    for (var f in a)
      if ("platform" != f && "custID" != f && "timestamp" != f) {
        var g = f,
          h = a[f];
        -1 != d.indexOf(g) && ((g += "Hash"), (h = Na(h)));
        -1 != e.indexOf(g) && c.push({ key: g, value: h });
        b.push({ key: g, value: h });
      }
    c.sort(function (a, b) {
      if ("object" === typeof a && "object" === typeof b && a && b)
        return (
          (a = a.key),
          (b = b.key),
          a === b
            ? 0
            : typeof a === typeof b
            ? a < b
              ? -1
              : 1
            : typeof a < typeof b
            ? -1
            : 1
        );
      throw "error";
    });
    a = c
      .map(function (a) {
        return a.value;
      })
      .join("");
    b.push({ key: "sdkSmartID", value: Na(a) });
    return b;
  }
  function Sb(a, b, c) {
    var d = new Gc();
    d.iv = c;
    d.secretKey = b;
    return d.encryptData_CBC(a);
  }
  function Tb(a, b) {
    var c =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
          ""
        ),
      d = [],
      e;
    b = b || c.length;
    for (e = 0; e < a; e++) d[e] = c[0 | (Math.random() * b)];
    return d.join("");
  }
  function Ub() {
    var a = 0,
      b = ["selenium", "webdriver", "driver"];
    try {
      var a =
          util.inAttrs(
            window,
            "_Selenium_IDE_Recorder,_selenium,callSelenium,__nightmare"
          ) ||
          util.inAttrs(
            window.document,
            "__driver_evaluate,__webdriver_evaluate,__selenium_evaluate,__fxdriver_evaluate,__driver_unwrapped,__webdriver_unwrapped,__selenium_unwrapped,__fxdriver_unwrapped,__webdriver_script_func,__webdriver_script_function,__webdriver_script_fn"
          ),
        c;
      for (c in window.document)
        "$" === c[0] &&
          c.match("^\\$[a-z]dc_") &&
          window.document[c].cache_ &&
          (a = 1);
      for (c = 0; c < b.length; c++)
        window.document.documentElement.getAttribute(b[c]) && (a = 1);
    } catch (d) {}
    try {
      window.external &&
        window.external.toString() &&
        -1 !== window.external.toString().indexOf("Sequentum") &&
        (a = 1);
    } catch (d) {
      a = 0;
    }
    return a;
  }
  function Hc() {
    var a = 0;
    try {
      window.navigator.webdriver && (a = 1);
    } catch (b) {
      a = 0;
    }
    return a;
  }
  function Vb(a) {
    var b = a.length,
      c = 0 == b % 3 ? parseInt(b / 3) : parseInt(b / 3) + 1;
    if (3 > b) return a;
    var d = a.substring(0, 1 * c),
      e = a.substring(1 * c, 2 * c);
    return a.substring(2 * c, b) + d + e;
  }
  function nb(a) {
    return N.SHA256(a).toString(N.enc.Base64);
  }
  function ob(a, b, c) {
    if (Ic) {
      var d = Wb();
      if ("undefined" != d) {
        var e = Ma() ? "WEB" : pb(),
          f =
            ea.substring(0, ea.indexOf("/public")) +
            "/public/collections?channel\x3d" +
            e;
        d.open("post", f, !0);
        d.setRequestHeader("Content-Type", "application/json");
        f = { custID: "JYZX" };
        f.channel = e;
        f.uuid = qb;
        f.serialNum = a;
        f.downloadTime = Jc;
        f.generTime = b;
        f.status = c;
        d.send(JSON.stringify(f));
      }
    }
  }
  function Wb() {
    if ("undefined" != typeof XMLHttpRequest) return new XMLHttpRequest();
    throw "undefined";
  }
  function Na(a) {
    for (var b = [], c = 0; c < 8 * a.length; c += 8)
      b[c >> 5] |= (a.charCodeAt(c / 8) & 255) << c % 32;
    a = 8 * a.length;
    b[a >> 5] |= 128 << a % 32;
    b[(((a + 64) >>> 9) << 4) + 14] = a;
    a = 1732584193;
    for (
      var c = -271733879, d = -1732584194, e = 271733878, f = 0;
      f < b.length;
      f += 16
    ) {
      var g = a,
        h = c,
        u = d,
        n = e;
      a = B(a, c, d, e, b[f + 0], 7, -680876936);
      e = B(e, a, c, d, b[f + 1], 12, -389564586);
      d = B(d, e, a, c, b[f + 2], 17, 606105819);
      c = B(c, d, e, a, b[f + 3], 22, -1044525330);
      a = B(a, c, d, e, b[f + 4], 7, -176418897);
      e = B(e, a, c, d, b[f + 5], 12, 1200080426);
      d = B(d, e, a, c, b[f + 6], 17, -1473231341);
      c = B(c, d, e, a, b[f + 7], 22, -45705983);
      a = B(a, c, d, e, b[f + 8], 7, 1770035416);
      e = B(e, a, c, d, b[f + 9], 12, -1958414417);
      d = B(d, e, a, c, b[f + 10], 17, -42063);
      c = B(c, d, e, a, b[f + 11], 22, -1990404162);
      a = B(a, c, d, e, b[f + 12], 7, 1804603682);
      e = B(e, a, c, d, b[f + 13], 12, -40341101);
      d = B(d, e, a, c, b[f + 14], 17, -1502002290);
      c = B(c, d, e, a, b[f + 15], 22, 1236535329);
      a = C(a, c, d, e, b[f + 1], 5, -165796510);
      e = C(e, a, c, d, b[f + 6], 9, -1069501632);
      d = C(d, e, a, c, b[f + 11], 14, 643717713);
      c = C(c, d, e, a, b[f + 0], 20, -373897302);
      a = C(a, c, d, e, b[f + 5], 5, -701558691);
      e = C(e, a, c, d, b[f + 10], 9, 38016083);
      d = C(d, e, a, c, b[f + 15], 14, -660478335);
      c = C(c, d, e, a, b[f + 4], 20, -405537848);
      a = C(a, c, d, e, b[f + 9], 5, 568446438);
      e = C(e, a, c, d, b[f + 14], 9, -1019803690);
      d = C(d, e, a, c, b[f + 3], 14, -187363961);
      c = C(c, d, e, a, b[f + 8], 20, 1163531501);
      a = C(a, c, d, e, b[f + 13], 5, -1444681467);
      e = C(e, a, c, d, b[f + 2], 9, -51403784);
      d = C(d, e, a, c, b[f + 7], 14, 1735328473);
      c = C(c, d, e, a, b[f + 12], 20, -1926607734);
      a = A(c ^ d ^ e, a, c, b[f + 5], 4, -378558);
      e = A(a ^ c ^ d, e, a, b[f + 8], 11, -2022574463);
      d = A(e ^ a ^ c, d, e, b[f + 11], 16, 1839030562);
      c = A(d ^ e ^ a, c, d, b[f + 14], 23, -35309556);
      a = A(c ^ d ^ e, a, c, b[f + 1], 4, -1530992060);
      e = A(a ^ c ^ d, e, a, b[f + 4], 11, 1272893353);
      d = A(e ^ a ^ c, d, e, b[f + 7], 16, -155497632);
      c = A(d ^ e ^ a, c, d, b[f + 10], 23, -1094730640);
      a = A(c ^ d ^ e, a, c, b[f + 13], 4, 681279174);
      e = A(a ^ c ^ d, e, a, b[f + 0], 11, -358537222);
      d = A(e ^ a ^ c, d, e, b[f + 3], 16, -722521979);
      c = A(d ^ e ^ a, c, d, b[f + 6], 23, 76029189);
      a = A(c ^ d ^ e, a, c, b[f + 9], 4, -640364487);
      e = A(a ^ c ^ d, e, a, b[f + 12], 11, -421815835);
      d = A(e ^ a ^ c, d, e, b[f + 15], 16, 530742520);
      c = A(d ^ e ^ a, c, d, b[f + 2], 23, -995338651);
      a = D(a, c, d, e, b[f + 0], 6, -198630844);
      e = D(e, a, c, d, b[f + 7], 10, 1126891415);
      d = D(d, e, a, c, b[f + 14], 15, -1416354905);
      c = D(c, d, e, a, b[f + 5], 21, -57434055);
      a = D(a, c, d, e, b[f + 12], 6, 1700485571);
      e = D(e, a, c, d, b[f + 3], 10, -1894986606);
      d = D(d, e, a, c, b[f + 10], 15, -1051523);
      c = D(c, d, e, a, b[f + 1], 21, -2054922799);
      a = D(a, c, d, e, b[f + 8], 6, 1873313359);
      e = D(e, a, c, d, b[f + 15], 10, -30611744);
      d = D(d, e, a, c, b[f + 6], 15, -1560198380);
      c = D(c, d, e, a, b[f + 13], 21, 1309151649);
      a = D(a, c, d, e, b[f + 4], 6, -145523070);
      e = D(e, a, c, d, b[f + 11], 10, -1120210379);
      d = D(d, e, a, c, b[f + 2], 15, 718787259);
      c = D(c, d, e, a, b[f + 9], 21, -343485551);
      a = aa(a, g);
      c = aa(c, h);
      d = aa(d, u);
      e = aa(e, n);
    }
    b = [a, c, d, e];
    a = "";
    for (c = 0; c < 4 * b.length; c++)
      a +=
        "0123456789abcdef".charAt((b[c >> 2] >> ((c % 4) * 8 + 4)) & 15) +
        "0123456789abcdef".charAt((b[c >> 2] >> ((c % 4) * 8)) & 15);
    return a;
  }
  function E(a, b, c, d, e, f, g) {
    a = a + (c ^ (b | ~d)) + e + g;
    return ((a << f) | (a >>> (32 - f))) + b;
  }
  function F(a, b, c, d, e, f, g) {
    a = a + (b ^ c ^ d) + e + g;
    return ((a << f) | (a >>> (32 - f))) + b;
  }
  function G(a, b, c, d, e, f, g) {
    a = a + ((b & d) | (c & ~d)) + e + g;
    return ((a << f) | (a >>> (32 - f))) + b;
  }
  function H(a, b, c, d, e, f, g) {
    a = a + ((b & c) | (~b & d)) + e + g;
    return ((a << f) | (a >>> (32 - f))) + b;
  }
  function Xb(a) {
    return (4294967296 * (a - (a | 0))) | 0;
  }
  function L(a, b) {
    "object" === typeof a && ((b = a), (a = void 0));
    if (!(this instanceof L)) return new L(a, b).getResult();
    var c =
        a ||
        (W && W.navigator && W.navigator.userAgent
          ? W.navigator.userAgent
          : ""),
      d = b ? S.extend(Yb, b) : Yb;
    this.getBrowser = function () {
      var a = { name: void 0, version: void 0 };
      O.rgx.call(a, c, d.browser);
      a.major = S.major(a.version);
      return a;
    };
    this.getCPU = function () {
      var a = { architecture: void 0 };
      O.rgx.call(a, c, d.cpu);
      return a;
    };
    this.getDevice = function () {
      var a = { vendor: void 0, model: void 0, type: void 0 };
      O.rgx.call(a, c, d.device);
      return a;
    };
    this.getEngine = function () {
      var a = { name: void 0, version: void 0 };
      O.rgx.call(a, c, d.engine);
      return a;
    };
    this.getOS = function () {
      var a = { name: void 0, version: void 0 };
      O.rgx.call(a, c, d.os);
      return a;
    };
    this.getResult = function () {
      return {
        ua: this.getUA(),
        browser: this.getBrowser(),
        engine: this.getEngine(),
        os: this.getOS(),
        device: this.getDevice(),
        cpu: this.getCPU(),
      };
    };
    this.getUA = function () {
      return c;
    };
    this.setUA = function (a) {
      c = a;
      return this;
    };
    return this;
  }
  function Zb(a) {
    return null != /[\\\"<>\.;]/.exec(a) &&
      "undefined" != typeof encodeURIComponent
      ? encodeURIComponent(a)
      : a;
  }
  function fa(a, b) {
    $b &&
      ((b = b ? "visible" : "hidden"),
      ga && T(a)
        ? (T(a).style.visibility = b)
        : ac("#" + a, "visibility:" + b));
  }
  function ac(a, b, c, d) {
    if (!w.ie || !w.mac) {
      var e = x.getElementsByTagName("head")[0];
      e &&
        ((c = c && "string" == typeof c ? c : "screen"),
        d && (rb = X = null),
        (X && rb == c) ||
          ((d = x.createElement("style")),
          d.setAttribute("type", "text/css"),
          d.setAttribute("media", c),
          (X = e.appendChild(d)),
          w.ie &&
            w.win &&
            "undefined" != typeof x.styleSheets &&
            0 < x.styleSheets.length &&
            (X = x.styleSheets[x.styleSheets.length - 1]),
          (rb = c)),
        w.ie && w.win
          ? X && "object" == typeof X.addRule && X.addRule(a, b)
          : X &&
            "undefined" != typeof x.createTextNode &&
            X.appendChild(x.createTextNode(a + " {" + b + "}")));
    }
  }
  function Oa(a) {
    var b = w.pv;
    a = a.split(".");
    a[0] = parseInt(a[0], 10);
    a[1] = parseInt(a[1], 10) || 0;
    a[2] = parseInt(a[2], 10) || 0;
    return b[0] > a[0] ||
      (b[0] == a[0] && b[1] > a[1]) ||
      (b[0] == a[0] && b[1] == a[1] && b[2] >= a[2])
      ? !0
      : !1;
  }
  function T(a) {
    var b = null;
    try {
      b = x.getElementById(a);
    } catch (c) {}
    return b;
  }
  function bc(a) {
    var b = T(a);
    b &&
      "OBJECT" == b.nodeName &&
      (w.ie && w.win
        ? ((b.style.display = "none"),
          (function d() {
            if (4 == b.readyState) {
              var e = T(a);
              if (e) {
                for (var f in e) "function" == typeof e[f] && (e[f] = null);
                e.parentNode.removeChild(e);
              }
            } else setTimeout(d, 10);
          })())
        : b.parentNode.removeChild(b));
  }
  function sb(a, b, c) {
    var d,
      e = T(c);
    if (w.wk && 312 > w.wk) return d;
    if (e)
      if (("undefined" == typeof a.id && (a.id = c), w.ie && w.win)) {
        var f = "",
          g;
        for (g in a)
          a[g] != Object.prototype[g] &&
            ("data" == g.toLowerCase()
              ? (b.movie = a[g])
              : "styleclass" == g.toLowerCase()
              ? (f += ' class\x3d"' + a[g] + '"')
              : "classid" != g.toLowerCase() &&
                (f += " " + g + '\x3d"' + a[g] + '"'));
        g = "";
        for (var h in b)
          b[h] != Object.prototype[h] &&
            (g +=
              '\x3cparam name\x3d"' + h + '" value\x3d"' + b[h] + '" /\x3e');
        e.outerHTML =
          '\x3cobject classid\x3d"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' +
          f +
          "\x3e" +
          g +
          "\x3c/object\x3e";
        Pa[Pa.length] = a.id;
        d = T(a.id);
      } else {
        h = x.createElement("object");
        h.setAttribute("type", "application/x-shockwave-flash");
        for (var u in a)
          a[u] != Object.prototype[u] &&
            ("styleclass" == u.toLowerCase()
              ? h.setAttribute("class", a[u])
              : "classid" != u.toLowerCase() && h.setAttribute(u, a[u]));
        for (f in b)
          b[f] != Object.prototype[f] &&
            "movie" != f.toLowerCase() &&
            ((a = h),
            (g = f),
            (u = b[f]),
            (c = x.createElement("param")),
            c.setAttribute("name", g),
            c.setAttribute("value", u),
            a.appendChild(c));
        e.parentNode.replaceChild(h, e);
        d = h;
      }
    return d;
  }
  function tb(a) {
    var b = x.createElement("div");
    if (w.win && w.ie) b.innerHTML = a.innerHTML;
    else if ((a = a.getElementsByTagName("object")[0]))
      if ((a = a.childNodes))
        for (var c = a.length, d = 0; d < c; d++)
          (1 == a[d].nodeType && "PARAM" == a[d].nodeName) ||
            8 == a[d].nodeType ||
            b.appendChild(a[d].cloneNode(!0));
    return b;
  }
  function Kc(a) {
    if (w.ie && w.win && 4 != a.readyState) {
      var b = x.createElement("div");
      a.parentNode.insertBefore(b, a);
      b.parentNode.replaceChild(tb(a), b);
      a.style.display = "none";
      (function d() {
        4 == a.readyState ? a.parentNode.removeChild(a) : setTimeout(d, 10);
      })();
    } else a.parentNode.replaceChild(tb(a), a);
  }
  function ub(a, b, c, d) {
    Qa = !0;
    vb = d || null;
    cc = { success: !1, id: c };
    var e = T(c);
    if (e) {
      "OBJECT" == e.nodeName
        ? ((va = tb(e)), (Ra = null))
        : ((va = e), (Ra = c));
      a.id = "SWFObjectExprInst";
      if (
        "undefined" == typeof a.width ||
        (!/%$/.test(a.width) && 310 > parseInt(a.width, 10))
      )
        a.width = "310";
      if (
        "undefined" == typeof a.height ||
        (!/%$/.test(a.height) && 137 > parseInt(a.height, 10))
      )
        a.height = "137";
      x.title = x.title.slice(0, 47) + " - Flash Player Installation";
      d = w.ie && w.win ? "ActiveX" : "PlugIn";
      d =
        "MMredirectURL\x3d" +
        P.location.toString().replace(/&/g, "%26") +
        "\x26MMplayerType\x3d" +
        d +
        "\x26MMdoctitle\x3d" +
        x.title;
      b.flashvars =
        "undefined" != typeof b.flashvars ? b.flashvars + ("\x26" + d) : d;
      w.ie &&
        w.win &&
        4 != e.readyState &&
        ((d = x.createElement("div")),
        (c += "SWFObjectNew"),
        d.setAttribute("id", c),
        e.parentNode.insertBefore(d, e),
        (e.style.display = "none"),
        (function g() {
          4 == e.readyState ? e.parentNode.removeChild(e) : setTimeout(g, 10);
        })());
      sb(a, b, c);
    }
  }
  function wb() {
    return !Qa && Oa("6.0.65") && (w.win || w.mac) && !(w.wk && 312 > w.wk);
  }
  function xb(a) {
    var b = null;
    (a = T(a)) &&
      "OBJECT" == a.nodeName &&
      ("undefined" != typeof a.SetVariable
        ? (b = a)
        : (a = a.getElementsByTagName("object")[0]) && (b = a));
    return b;
  }
  function yb() {
    var a = ba.length;
    if (0 < a)
      for (var b = 0; b < a; b++) {
        var c = ba[b].id,
          d = ba[b].callbackFn,
          e = { success: !1, id: c };
        if (0 < w.pv[0]) {
          var f = T(c);
          if (f)
            if (!Oa(ba[b].swfVersion) || (w.wk && 312 > w.wk))
              if (ba[b].expressInstall && wb()) {
                e = {};
                e.data = ba[b].expressInstall;
                e.width = f.getAttribute("width") || "0";
                e.height = f.getAttribute("height") || "0";
                f.getAttribute("class") &&
                  (e.styleclass = f.getAttribute("class"));
                f.getAttribute("align") && (e.align = f.getAttribute("align"));
                for (
                  var g = {},
                    f = f.getElementsByTagName("param"),
                    h = f.length,
                    u = 0;
                  u < h;
                  u++
                )
                  "movie" != f[u].getAttribute("name").toLowerCase() &&
                    (g[f[u].getAttribute("name")] = f[u].getAttribute("value"));
                ub(e, g, c, d);
              } else Kc(f), d && d(e);
            else fa(c, !0), d && ((e.success = !0), (e.ref = xb(c)), d(e));
        } else
          fa(c, !0),
            d &&
              ((c = xb(c)) &&
                "undefined" != typeof c.SetVariable &&
                ((e.success = !0), (e.ref = c)),
              d(e));
      }
  }
  function dc(a) {
    if ("undefined" != typeof P.addEventListener)
      P.addEventListener("load", a, !1);
    else if ("undefined" != typeof x.addEventListener)
      x.addEventListener("load", a, !1);
    else if ("undefined" != typeof P.attachEvent) {
      var b = P;
      b.attachEvent("onload", a);
      la[la.length] = [b, "onload", a];
    } else if ("function" == typeof P.onload) {
      var c = P.onload;
      P.onload = function () {
        c();
        a();
      };
    } else P.onload = a;
  }
  function ec(a) {
    ga ? a() : (Sa[Sa.length] = a);
  }
  function ma() {
    if (!ga) {
      try {
        var a = x
          .getElementsByTagName("body")[0]
          .appendChild(x.createElement("span"));
        a.parentNode.removeChild(a);
      } catch (c) {
        return;
      }
      ga = !0;
      for (var a = Sa.length, b = 0; b < a; b++) Sa[b]();
    }
  }
  function Ta(a) {
    if (!a) return "";
    var b = a;
    if (-1 != b.indexOf("[") && -1 != b.indexOf("]"))
      return a.substr(a.indexOf("["), a.indexOf("]") + 1);
    a = a.split(":")[0];
    if (Lc(a)) return a.replace(/\s/g, "");
    -1 != a.indexOf("://") && (a = a.substr(a.indexOf("://") + 3));
    var b =
        "com net org gov edu mil biz name info mobi pro travel museum int areo post rec".split(
          " "
        ),
      c = a.split(".");
    if (1 >= c.length || !isNaN(c[c.length - 1])) return a;
    for (a = 0; a < b.length && b[a] != c[c.length - 1]; ) a++;
    if (a != b.length) return "." + c[c.length - 2] + "." + c[c.length - 1];
    for (a = 0; a < b.length && b[a] != c[c.length - 2]; ) a++;
    return a == b.length
      ? c[c.length - 2] + "." + c[c.length - 1]
      : "." + c[c.length - 3] + "." + c[c.length - 2] + "." + c[c.length - 1];
  }
  function Ua() {
    function a() {
      throw Error(
        "'new Fingerprint()' is deprecated, see https://github.com/Valve/fingerprintjs2#upgrade-guide-from-182-to-200"
      );
    }
    function b() {
      var a = document.createElement("canvas"),
        b = null;
      try {
        b = a.getContext("webgl") || a.getContext("experimental-webgl");
      } catch (gd) {}
      b || (b = null);
      return b;
    }
    function c() {
      if (!d()) return !1;
      var a = b();
      return !!window.WebGLRenderingContext && !!a;
    }
    function d() {
      var a = document.createElement("canvas");
      return !(!a.getContext || !a.getContext("2d"));
    }
    function e() {
      var a = navigator.userAgent.toLowerCase(),
        b = navigator.productSub,
        a =
          0 <= a.indexOf("firefox")
            ? "Firefox"
            : 0 <= a.indexOf("opera") || 0 <= a.indexOf("opr")
            ? "Opera"
            : 0 <= a.indexOf("chrome")
            ? "Chrome"
            : 0 <= a.indexOf("safari")
            ? "Safari"
            : 0 <= a.indexOf("trident")
            ? "Internet Explorer"
            : "Other";
      if (
        ("Chrome" === a || "Safari" === a || "Opera" === a) &&
        "20030107" !== b
      )
        return !0;
      b = eval.toString().length;
      if (
        (37 === b && "Safari" !== a && "Firefox" !== a && "Other" !== a) ||
        (39 === b && "Internet Explorer" !== a && "Other" !== a) ||
        (33 === b && "Chrome" !== a && "Opera" !== a && "Other" !== a)
      )
        return !0;
      var c;
      try {
        throw "a";
      } catch (na) {
        try {
          na.toSource(), (c = !0);
        } catch (fc) {
          c = !1;
        }
      }
      return c && "Firefox" !== a && "Other" !== a;
    }
    function f() {
      var a = navigator.userAgent.toLowerCase(),
        b = navigator.oscpu,
        c = navigator.platform.toLowerCase(),
        a =
          0 <= a.indexOf("windows phone")
            ? "Windows Phone"
            : 0 <= a.indexOf("win")
            ? "Windows"
            : 0 <= a.indexOf("android")
            ? "Android"
            : 0 <= a.indexOf("linux") || 0 <= a.indexOf("cros")
            ? "Linux"
            : 0 <= a.indexOf("iphone") || 0 <= a.indexOf("ipad")
            ? "iOS"
            : 0 <= a.indexOf("mac")
            ? "Mac"
            : "Other";
      return (("ontouchstart" in window ||
        0 < navigator.maxTouchPoints ||
        0 < navigator.msMaxTouchPoints) &&
        "Windows Phone" !== a &&
        "Android" !== a &&
        "iOS" !== a &&
        "Other" !== a) ||
        ("undefined" !== typeof b &&
          ((b = b.toLowerCase()),
          (0 <= b.indexOf("win") && "Windows" !== a && "Windows Phone" !== a) ||
            (0 <= b.indexOf("linux") && "Linux" !== a && "Android" !== a) ||
            (0 <= b.indexOf("mac") && "Mac" !== a && "iOS" !== a) ||
            (-1 === b.indexOf("win") &&
              -1 === b.indexOf("linux") &&
              -1 === b.indexOf("mac")) !==
              ("Other" === a)))
        ? !0
        : (0 <= c.indexOf("win") && "Windows" !== a && "Windows Phone" !== a) ||
          ((0 <= c.indexOf("linux") ||
            0 <= c.indexOf("android") ||
            0 <= c.indexOf("pike")) &&
            "Linux" !== a &&
            "Android" !== a) ||
          ((0 <= c.indexOf("mac") ||
            0 <= c.indexOf("ipad") ||
            0 <= c.indexOf("ipod") ||
            0 <= c.indexOf("iphone")) &&
            "Mac" !== a &&
            "iOS" !== a) ||
          (0 > c.indexOf("win") &&
            0 > c.indexOf("linux") &&
            0 > c.indexOf("mac") &&
            0 > c.indexOf("iphone") &&
            0 > c.indexOf("ipad")) !==
            ("Other" === a)
        ? !0
        : "undefined" === typeof navigator.plugins &&
          "Windows" !== a &&
          "Windows Phone" !== a;
    }
    function g() {
      if ("undefined" !== typeof navigator.languages)
        try {
          if (
            navigator.languages[0].substr(0, 2) !==
            navigator.language.substr(0, 2)
          )
            return !0;
        } catch (k) {
          return !0;
        }
      return !1;
    }
    function h() {
      function a(a) {
        c.clearColor(0, 0, 0, 1);
        c.enable(c.DEPTH_TEST);
        c.depthFunc(c.LEQUAL);
        c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT);
        return "[" + a[0] + ", " + a[1] + "]";
      }
      var c;
      c = b();
      if (!c) return null;
      var d = [],
        e = c.createBuffer();
      c.bindBuffer(c.ARRAY_BUFFER, e);
      var f = new Float32Array([
        -0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0,
      ]);
      c.bufferData(c.ARRAY_BUFFER, f, c.STATIC_DRAW);
      e.itemSize = 3;
      e.numItems = 3;
      var f = c.createProgram(),
        g = c.createShader(c.VERTEX_SHADER);
      c.shaderSource(
        g,
        "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate\x3dattrVertex+uniformOffset;gl_Position\x3dvec4(attrVertex,0,1);}"
      );
      c.compileShader(g);
      var p = c.createShader(c.FRAGMENT_SHADER);
      c.shaderSource(
        p,
        "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor\x3dvec4(varyinTexCoordinate,0,1);}"
      );
      c.compileShader(p);
      c.attachShader(f, g);
      c.attachShader(f, p);
      c.linkProgram(f);
      c.useProgram(f);
      f.vertexPosAttrib = c.getAttribLocation(f, "attrVertex");
      f.offsetUniform = c.getUniformLocation(f, "uniformOffset");
      c.enableVertexAttribArray(f.vertexPosArray);
      c.vertexAttribPointer(f.vertexPosAttrib, e.itemSize, c.FLOAT, !1, 0, 0);
      c.uniform2f(f.offsetUniform, 1, 1);
      c.drawArrays(c.TRIANGLE_STRIP, 0, e.numItems);
      try {
        d.push(c.canvas.toDataURL());
      } catch (Mc) {}
      d.push("extensions:" + (c.getSupportedExtensions() || []).join(";"));
      d.push(
        "webgl aliased line width range:" +
          a(c.getParameter(c.ALIASED_LINE_WIDTH_RANGE))
      );
      d.push(
        "webgl aliased point size range:" +
          a(c.getParameter(c.ALIASED_POINT_SIZE_RANGE))
      );
      d.push("webgl alpha bits:" + c.getParameter(c.ALPHA_BITS));
      d.push(
        "webgl antialiasing:" +
          (c.getContextAttributes().antialias ? "yes" : "no")
      );
      d.push("webgl blue bits:" + c.getParameter(c.BLUE_BITS));
      d.push("webgl depth bits:" + c.getParameter(c.DEPTH_BITS));
      d.push("webgl green bits:" + c.getParameter(c.GREEN_BITS));
      d.push(
        "webgl max anisotropy:" +
          (function (a) {
            var b =
              a.getExtension("EXT_texture_filter_anisotropic") ||
              a.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
              a.getExtension("MOZ_EXT_texture_filter_anisotropic");
            return b
              ? ((a = a.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT)),
                0 === a && (a = 2),
                a)
              : null;
          })(c)
      );
      d.push(
        "webgl max combined texture image units:" +
          c.getParameter(c.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
      );
      d.push(
        "webgl max cube map texture size:" +
          c.getParameter(c.MAX_CUBE_MAP_TEXTURE_SIZE)
      );
      d.push(
        "webgl max fragment uniform vectors:" +
          c.getParameter(c.MAX_FRAGMENT_UNIFORM_VECTORS)
      );
      d.push(
        "webgl max render buffer size:" +
          c.getParameter(c.MAX_RENDERBUFFER_SIZE)
      );
      d.push(
        "webgl max texture image units:" +
          c.getParameter(c.MAX_TEXTURE_IMAGE_UNITS)
      );
      d.push("webgl max texture size:" + c.getParameter(c.MAX_TEXTURE_SIZE));
      d.push(
        "webgl max varying vectors:" + c.getParameter(c.MAX_VARYING_VECTORS)
      );
      d.push(
        "webgl max vertex attribs:" + c.getParameter(c.MAX_VERTEX_ATTRIBS)
      );
      d.push(
        "webgl max vertex texture image units:" +
          c.getParameter(c.MAX_VERTEX_TEXTURE_IMAGE_UNITS)
      );
      d.push(
        "webgl max vertex uniform vectors:" +
          c.getParameter(c.MAX_VERTEX_UNIFORM_VECTORS)
      );
      d.push(
        "webgl max viewport dims:" + a(c.getParameter(c.MAX_VIEWPORT_DIMS))
      );
      d.push("webgl red bits:" + c.getParameter(c.RED_BITS));
      d.push("webgl renderer:" + c.getParameter(c.RENDERER));
      d.push(
        "webgl shading language version:" +
          c.getParameter(c.SHADING_LANGUAGE_VERSION)
      );
      d.push("webgl stencil bits:" + c.getParameter(c.STENCIL_BITS));
      d.push("webgl vendor:" + c.getParameter(c.VENDOR));
      d.push("webgl version:" + c.getParameter(c.VERSION));
      try {
        var m = c.getExtension("WEBGL_debug_renderer_info");
        m &&
          (d.push(
            "webgl unmasked vendor:" + c.getParameter(m.UNMASKED_VENDOR_WEBGL)
          ),
          d.push(
            "webgl unmasked renderer:" +
              c.getParameter(m.UNMASKED_RENDERER_WEBGL)
          ));
      } catch (Mc) {}
      if (!c.getShaderPrecisionFormat) return d;
      v(["FLOAT", "INT"], function (a) {
        v(["VERTEX", "FRAGMENT"], function (b) {
          v(["HIGH", "MEDIUM", "LOW"], function (e) {
            v(["precision", "rangeMin", "rangeMax"], function (k) {
              var f = c.getShaderPrecisionFormat(
                c[b + "_SHADER"],
                c[e + "_" + a]
              )[k];
              "precision" !== k && (k = "precision " + k);
              k = [
                "webgl ",
                b.toLowerCase(),
                " shader ",
                e.toLowerCase(),
                " ",
                a.toLowerCase(),
                " ",
                k,
                ":",
                f,
              ].join("");
              d.push(k);
            });
          });
        });
      });
      return d;
    }
    function u(a) {
      if (null == navigator.plugins) return a.NOT_AVAILABLE;
      for (var b = [], c = 0, d = navigator.plugins.length; c < d; c++)
        navigator.plugins[c] && b.push(navigator.plugins[c]);
      for (var c = !1, d = 0, e = a.plugins.sortPluginsFor.length; d < e; d++)
        if (navigator.userAgent.match(a.plugins.sortPluginsFor[d])) {
          c = !0;
          break;
        }
      c &&
        (b = b.sort(function (a, b) {
          return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
        }));
      return n(b, function (a) {
        var b = n(a, function (a) {
          return [a.type, a.suffixes];
        });
        return [a.name, a.description, b];
      });
    }
    function n(a, b) {
      var c = [];
      if (null == a) return c;
      if (Array.prototype.map && a.map === Array.prototype.map) return a.map(b);
      v(a, function (a, d, e) {
        c.push(b(a, d, e));
      });
      return c;
    }
    function v(a, b) {
      if (Array.prototype.forEach && a.forEach === Array.prototype.forEach)
        a.forEach(b);
      else if (a.length === +a.length)
        for (var c = 0, d = a.length; c < d; c++) b(a[c], c, a);
      else for (c in a) a.hasOwnProperty(c) && b(a[c], c, a);
    }
    function p(a, b) {
      a = a || "";
      b = b || 0;
      var c = a.length % 16,
        d = a.length - c,
        e = [0, b];
      b = [0, b];
      for (
        var f,
          k,
          g = [2277735313, 289559509],
          p = [1291169091, 658871167],
          h = 0;
        h < d;
        h += 16
      )
        (f = [
          (a.charCodeAt(h + 4) & 255) |
            ((a.charCodeAt(h + 5) & 255) << 8) |
            ((a.charCodeAt(h + 6) & 255) << 16) |
            ((a.charCodeAt(h + 7) & 255) << 24),
          (a.charCodeAt(h) & 255) |
            ((a.charCodeAt(h + 1) & 255) << 8) |
            ((a.charCodeAt(h + 2) & 255) << 16) |
            ((a.charCodeAt(h + 3) & 255) << 24),
        ]),
          (k = [
            (a.charCodeAt(h + 12) & 255) |
              ((a.charCodeAt(h + 13) & 255) << 8) |
              ((a.charCodeAt(h + 14) & 255) << 16) |
              ((a.charCodeAt(h + 15) & 255) << 24),
            (a.charCodeAt(h + 8) & 255) |
              ((a.charCodeAt(h + 9) & 255) << 8) |
              ((a.charCodeAt(h + 10) & 255) << 16) |
              ((a.charCodeAt(h + 11) & 255) << 24),
          ]),
          (f = l(f, g)),
          (f = oa(f, 31)),
          (f = l(f, p)),
          (e = q(e, f)),
          (e = oa(e, 27)),
          (e = w(e, b)),
          (e = w(l(e, [0, 5]), [0, 1390208809])),
          (k = l(k, p)),
          (k = oa(k, 33)),
          (k = l(k, g)),
          (b = q(b, k)),
          (b = oa(b, 31)),
          (b = w(b, e)),
          (b = w(l(b, [0, 5]), [0, 944331445]));
      f = [0, 0];
      k = [0, 0];
      switch (c) {
        case 15:
          k = q(k, z([0, a.charCodeAt(h + 14)], 48));
        case 14:
          k = q(k, z([0, a.charCodeAt(h + 13)], 40));
        case 13:
          k = q(k, z([0, a.charCodeAt(h + 12)], 32));
        case 12:
          k = q(k, z([0, a.charCodeAt(h + 11)], 24));
        case 11:
          k = q(k, z([0, a.charCodeAt(h + 10)], 16));
        case 10:
          k = q(k, z([0, a.charCodeAt(h + 9)], 8));
        case 9:
          (k = q(k, [0, a.charCodeAt(h + 8)])),
            (k = l(k, p)),
            (k = oa(k, 33)),
            (k = l(k, g)),
            (b = q(b, k));
        case 8:
          f = q(f, z([0, a.charCodeAt(h + 7)], 56));
        case 7:
          f = q(f, z([0, a.charCodeAt(h + 6)], 48));
        case 6:
          f = q(f, z([0, a.charCodeAt(h + 5)], 40));
        case 5:
          f = q(f, z([0, a.charCodeAt(h + 4)], 32));
        case 4:
          f = q(f, z([0, a.charCodeAt(h + 3)], 24));
        case 3:
          f = q(f, z([0, a.charCodeAt(h + 2)], 16));
        case 2:
          f = q(f, z([0, a.charCodeAt(h + 1)], 8));
        case 1:
          (f = q(f, [0, a.charCodeAt(h)])),
            (f = l(f, g)),
            (f = oa(f, 31)),
            (f = l(f, p)),
            (e = q(e, f));
      }
      e = q(e, [0, a.length]);
      b = q(b, [0, a.length]);
      e = w(e, b);
      b = w(b, e);
      e = m(e);
      b = m(b);
      e = w(e, b);
      b = w(b, e);
      return (
        ("00000000" + (e[0] >>> 0).toString(16)).slice(-8) +
        ("00000000" + (e[1] >>> 0).toString(16)).slice(-8) +
        ("00000000" + (b[0] >>> 0).toString(16)).slice(-8) +
        ("00000000" + (b[1] >>> 0).toString(16)).slice(-8)
      );
    }
    function m(a) {
      a = q(a, [0, a[0] >>> 1]);
      a = l(a, [4283543511, 3981806797]);
      a = q(a, [0, a[0] >>> 1]);
      a = l(a, [3301882366, 444984403]);
      return (a = q(a, [0, a[0] >>> 1]));
    }
    function q(a, b) {
      return [a[0] ^ b[0], a[1] ^ b[1]];
    }
    function z(a, b) {
      b %= 64;
      return 0 === b
        ? a
        : 32 > b
        ? [(a[0] << b) | (a[1] >>> (32 - b)), a[1] << b]
        : [a[1] << (b - 32), 0];
    }
    function oa(a, b) {
      b %= 64;
      if (32 === b) return [a[1], a[0]];
      if (32 > b)
        return [
          (a[0] << b) | (a[1] >>> (32 - b)),
          (a[1] << b) | (a[0] >>> (32 - b)),
        ];
      b -= 32;
      return [
        (a[1] << b) | (a[0] >>> (32 - b)),
        (a[0] << b) | (a[1] >>> (32 - b)),
      ];
    }
    function l(a, b) {
      a = [a[0] >>> 16, a[0] & 65535, a[1] >>> 16, a[1] & 65535];
      b = [b[0] >>> 16, b[0] & 65535, b[1] >>> 16, b[1] & 65535];
      var c = [0, 0, 0, 0];
      c[3] += a[3] * b[3];
      c[2] += c[3] >>> 16;
      c[3] &= 65535;
      c[2] += a[2] * b[3];
      c[1] += c[2] >>> 16;
      c[2] &= 65535;
      c[2] += a[3] * b[2];
      c[1] += c[2] >>> 16;
      c[2] &= 65535;
      c[1] += a[1] * b[3];
      c[0] += c[1] >>> 16;
      c[1] &= 65535;
      c[1] += a[2] * b[2];
      c[0] += c[1] >>> 16;
      c[1] &= 65535;
      c[1] += a[3] * b[1];
      c[0] += c[1] >>> 16;
      c[1] &= 65535;
      c[0] += a[0] * b[3] + a[1] * b[2] + a[2] * b[1] + a[3] * b[0];
      c[0] &= 65535;
      return [(c[0] << 16) | c[1], (c[2] << 16) | c[3]];
    }
    function w(a, b) {
      a = [a[0] >>> 16, a[0] & 65535, a[1] >>> 16, a[1] & 65535];
      b = [b[0] >>> 16, b[0] & 65535, b[1] >>> 16, b[1] & 65535];
      var c = [0, 0, 0, 0];
      c[3] += a[3] + b[3];
      c[2] += c[3] >>> 16;
      c[3] &= 65535;
      c[2] += a[2] + b[2];
      c[1] += c[2] >>> 16;
      c[2] &= 65535;
      c[1] += a[1] + b[1];
      c[0] += c[1] >>> 16;
      c[1] &= 65535;
      c[0] += a[0] + b[0];
      c[0] &= 65535;
      return [(c[0] << 16) | c[1], (c[2] << 16) | c[3]];
    }
    var r = {
        preprocessor: null,
        audio: { timeout: 1e3, excludeIOS11: !0 },
        fonts: {
          swfContainerId: "fingerprintjs2",
          swfPath: "flash/compiled/FontList.swf",
          userDefinedFonts: [],
          extendedJsFonts: !1,
        },
        screen: { detectScreenOrientation: !0 },
        plugins: { sortPluginsFor: [/palemoon/i], excludeIE: !1 },
        extraComponents: [],
        excludes: { enumerateDevices: !0, doNotTrack: !0, fontsFlash: !0 },
        NOT_AVAILABLE: "not available",
        ERROR: "error",
        EXCLUDED: "excluded",
      },
      t = [
        {
          key: "userAgent",
          getData: function (a) {
            a(navigator.userAgent);
          },
        },
        {
          key: "webdriver",
          getData: function (a, b) {
            a(
              null == navigator.webdriver
                ? b.NOT_AVAILABLE
                : navigator.webdriver
            );
          },
        },
        {
          key: "language",
          getData: function (a, b) {
            a(
              navigator.language ||
                navigator.userLanguage ||
                navigator.browserLanguage ||
                navigator.systemLanguage ||
                b.NOT_AVAILABLE
            );
          },
        },
        {
          key: "colorDepth",
          getData: function (a, b) {
            a(window.screen.colorDepth || b.NOT_AVAILABLE);
          },
        },
        {
          key: "deviceMemory",
          getData: function (a, b) {
            a(navigator.deviceMemory || b.NOT_AVAILABLE);
          },
        },
        {
          key: "devicePixelRatio",
          getData: function (a, b) {
            a(window.devicePixelRatio || b.NOT_AVAILABLE);
          },
        },
        {
          key: "hardwareConcurrency",
          getData: function (a, b) {
            a(
              navigator.hardwareConcurrency
                ? navigator.hardwareConcurrency
                : b.NOT_AVAILABLE
            );
          },
        },
        {
          key: "screenResolution",
          getData: function (a, b) {
            var c = [window.screen.width, window.screen.height];
            b.screen.detectScreenOrientation && c.sort().reverse();
            a(c);
          },
        },
        {
          key: "availableScreenResolution",
          getData: function (a, b) {
            if (window.screen.availWidth && window.screen.availHeight) {
              var c = [window.screen.availHeight, window.screen.availWidth];
              b.screen.detectScreenOrientation && c.sort().reverse();
              b = c;
            } else b = b.NOT_AVAILABLE;
            a(b);
          },
        },
        {
          key: "timezoneOffset",
          getData: function (a) {
            a(new Date().getTimezoneOffset());
          },
        },
        {
          key: "timezone",
          getData: function (a, b) {
            window.Intl && window.Intl.DateTimeFormat
              ? a(new window.Intl.DateTimeFormat().resolvedOptions().timeZone)
              : a(b.NOT_AVAILABLE);
          },
        },
        {
          key: "sessionStorage",
          getData: function (a, b) {
            var c;
            try {
              c = !!window.sessionStorage;
            } catch (na) {
              c = b.ERROR;
            }
            a(c);
          },
        },
        {
          key: "localStorage",
          getData: function (a, b) {
            var c;
            try {
              c = !!window.localStorage;
            } catch (na) {
              c = b.ERROR;
            }
            a(c);
          },
        },
        {
          key: "indexedDb",
          getData: function (a, b) {
            var c;
            try {
              c = !!window.indexedDB;
            } catch (na) {
              c = b.ERROR;
            }
            a(c);
          },
        },
        {
          key: "addBehavior",
          getData: function (a) {
            a(!(!document.body || !document.body.addBehavior));
          },
        },
        {
          key: "openDatabase",
          getData: function (a) {
            a(!!window.openDatabase);
          },
        },
        {
          key: "cpuClass",
          getData: function (a, b) {
            a(navigator.cpuClass || b.NOT_AVAILABLE);
          },
        },
        {
          key: "navigatorPlatform",
          getData: function (a, b) {
            a(navigator.platform ? navigator.platform : b.NOT_AVAILABLE);
          },
        },
        {
          key: "doNotTrack",
          getData: function (a, b) {
            a(
              navigator.doNotTrack
                ? navigator.doNotTrack
                : navigator.msDoNotTrack
                ? navigator.msDoNotTrack
                : window.doNotTrack
                ? window.doNotTrack
                : b.NOT_AVAILABLE
            );
          },
        },
        {
          key: "plugins",
          getData: function (a, b) {
            if (
              "Microsoft Internet Explorer" === navigator.appName ||
              ("Netscape" === navigator.appName &&
                /Trident/.test(navigator.userAgent))
            )
              if (b.plugins.excludeIE) a(b.EXCLUDED);
              else {
                var c = [];
                (Object.getOwnPropertyDescriptor &&
                  Object.getOwnPropertyDescriptor(window, "ActiveXObject")) ||
                "ActiveXObject" in window
                  ? (c = n(
                      "AcroPDF.PDF;Adodb.Stream;AgControl.AgControl;DevalVRXCtrl.DevalVRXCtrl.1;MacromediaFlashPaper.MacromediaFlashPaper;Msxml2.DOMDocument;Msxml2.XMLHTTP;PDF.PdfCtrl;QuickTime.QuickTime;QuickTimeCheckObject.QuickTimeCheck.1;RealPlayer;RealPlayer.RealPlayer(tm) ActiveX Control (32-bit);RealVideo.RealVideo(tm) ActiveX Control (32-bit);Scripting.Dictionary;SWCtl.SWCtl;Shell.UIHelper;ShockwaveFlash.ShockwaveFlash;Skype.Detection;TDCCtl.TDCCtl;WMPlayer.OCX;rmocx.RealPlayer G2 Control;rmocx.RealPlayer G2 Control.1".split(
                        ";"
                      ),
                      function (a) {
                        try {
                          return new window.ActiveXObject(a), a;
                        } catch (fc) {
                          return b.ERROR;
                        }
                      }
                    ))
                  : c.push(b.NOT_AVAILABLE);
                navigator.plugins && (c = c.concat(u(b)));
                a(c);
              }
            else a(u(b));
          },
        },
        {
          key: "canvas",
          getData: function (a, b) {
            if (d()) {
              var c = [],
                e = document.createElement("canvas");
              e.width = 2e3;
              e.height = 200;
              e.style.display = "inline";
              var f = e.getContext("2d");
              f.rect(0, 0, 10, 10);
              f.rect(2, 2, 6, 6);
              c.push(
                "canvas winding:" +
                  (!1 === f.isPointInPath(5, 5, "evenodd") ? "yes" : "no")
              );
              f.textBaseline = "alphabetic";
              f.fillStyle = "#f60";
              f.fillRect(125, 1, 62, 20);
              f.fillStyle = "#069";
              f.font = b.dontUseFakeFontInCanvas
                ? "11pt Arial"
                : "11pt no-real-font-123";
              f.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 2, 15);
              f.fillStyle = "rgba(102, 204, 0, 0.2)";
              f.font = "18pt Arial";
              f.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 4, 45);
              f.globalCompositeOperation = "multiply";
              f.fillStyle = "rgb(255,0,255)";
              f.beginPath();
              f.arc(50, 50, 50, 0, 2 * Math.PI, !0);
              f.closePath();
              f.fill();
              f.fillStyle = "rgb(0,255,255)";
              f.beginPath();
              f.arc(100, 50, 50, 0, 2 * Math.PI, !0);
              f.closePath();
              f.fill();
              f.fillStyle = "rgb(255,255,0)";
              f.beginPath();
              f.arc(75, 100, 50, 0, 2 * Math.PI, !0);
              f.closePath();
              f.fill();
              f.fillStyle = "rgb(255,0,255)";
              f.arc(75, 75, 75, 0, 2 * Math.PI, !0);
              f.arc(75, 75, 25, 0, 2 * Math.PI, !0);
              f.fill("evenodd");
              e.toDataURL && c.push("canvas fp:" + e.toDataURL());
              a(c);
            } else a(b.NOT_AVAILABLE);
          },
        },
        {
          key: "webgl",
          getData: function (a, b) {
            -1 !=
            navigator.userAgent.toLocaleLowerCase().indexOf("cpu iphone os")
              ? a(b.NOT_AVAILABLE)
              : c()
              ? a(h())
              : a(b.NOT_AVAILABLE);
          },
        },
        {
          key: "webglVendorAndRenderer",
          getData: function (a) {
            if (
              -1 !=
              navigator.userAgent.toLocaleLowerCase().indexOf("cpu iphone os")
            )
              a(ua.NOT_AVAILABLE);
            else if (c()) {
              var d;
              try {
                var e = b(),
                  f = e.getExtension("WEBGL_debug_renderer_info");
                d =
                  e.getParameter(f.UNMASKED_VENDOR_WEBGL) +
                  "~" +
                  e.getParameter(f.UNMASKED_RENDERER_WEBGL);
              } catch (fc) {
                d = null;
              }
              a(d);
            } else a();
          },
        },
        {
          key: "adBlock",
          getData: function (a) {
            var b = document.createElement("div");
            b.innerHTML = "\x26nbsp;";
            b.className = "adsbox";
            var c = !1;
            try {
              document.body.appendChild(b),
                (c =
                  0 ===
                  document.getElementsByClassName("adsbox")[0].offsetHeight),
                document.body.removeChild(b);
            } catch (na) {
              c = !1;
            }
            a(c);
          },
        },
        {
          key: "hasLiedLanguages",
          getData: function (a) {
            a(g());
          },
        },
        {
          key: "hasLiedResolution",
          getData: function (a) {
            a(
              window.screen.width < window.screen.availWidth ||
                window.screen.height < window.screen.availHeight
            );
          },
        },
        {
          key: "hasLiedOs",
          getData: function (a) {
            a(f());
          },
        },
        {
          key: "hasLiedBrowser",
          getData: function (a) {
            a(e());
          },
        },
        {
          key: "touchSupport",
          getData: function (a) {
            var b = 0,
              c;
            "undefined" !== typeof navigator.maxTouchPoints
              ? (b = navigator.maxTouchPoints)
              : "undefined" !== typeof navigator.msMaxTouchPoints &&
                (b = navigator.msMaxTouchPoints);
            try {
              document.createEvent("TouchEvent"), (c = !0);
            } catch (na) {
              c = !1;
            }
            a([b, c, "ontouchstart" in window]);
          },
        },
        {
          key: "fonts",
          getData: function (a, b) {
            function c() {
              var a = document.createElement("span");
              a.style.position = "absolute";
              a.style.left = "-9999px";
              a.style.fontSize = "72px";
              a.style.fontStyle = "normal";
              a.style.fontWeight = "normal";
              a.style.letterSpacing = "normal";
              a.style.lineBreak = "auto";
              a.style.lineHeight = "normal";
              a.style.textTransform = "none";
              a.style.textAlign = "left";
              a.style.textDecoration = "none";
              a.style.textShadow = "none";
              a.style.whiteSpace = "normal";
              a.style.wordBreak = "normal";
              a.style.wordSpacing = "normal";
              a.innerHTML = "mmmmmmmmmmlli";
              return a;
            }
            var d = ["monospace", "sans-serif", "serif"],
              e =
                "Andale Mono;Arial;Arial Black;Arial Hebrew;Arial MT;Arial Narrow;Arial Rounded MT Bold;Arial Unicode MS;Bitstream Vera Sans Mono;Book Antiqua;Bookman Old Style;Calibri;Cambria;Cambria Math;Century;Century Gothic;Century Schoolbook;Comic Sans;Comic Sans MS;Consolas;Courier;Courier New;Geneva;Georgia;Helvetica;Helvetica Neue;Impact;Lucida Bright;Lucida Calligraphy;Lucida Console;Lucida Fax;LUCIDA GRANDE;Lucida Handwriting;Lucida Sans;Lucida Sans Typewriter;Lucida Sans Unicode;Microsoft Sans Serif;Monaco;Monotype Corsiva;MS Gothic;MS Outlook;MS PGothic;MS Reference Sans Serif;MS Sans Serif;MS Serif;MYRIAD;MYRIAD PRO;Palatino;Palatino Linotype;Segoe Print;Segoe Script;Segoe UI;Segoe UI Light;Segoe UI Semibold;Segoe UI Symbol;Tahoma;Times;Times New Roman;Times New Roman PS;Trebuchet MS;Verdana;Wingdings;Wingdings 2;Wingdings 3".split(
                  ";"
                );
            b.fonts.extendedJsFonts &&
              (e = e.concat(
                "Abadi MT Condensed Light;Academy Engraved LET;ADOBE CASLON PRO;Adobe Garamond;ADOBE GARAMOND PRO;Agency FB;Aharoni;Albertus Extra Bold;Albertus Medium;Algerian;Amazone BT;American Typewriter;American Typewriter Condensed;AmerType Md BT;Andalus;Angsana New;AngsanaUPC;Antique Olive;Aparajita;Apple Chancery;Apple Color Emoji;Apple SD Gothic Neo;Arabic Typesetting;ARCHER;ARNO PRO;Arrus BT;Aurora Cn BT;AvantGarde Bk BT;AvantGarde Md BT;AVENIR;Ayuthaya;Bandy;Bangla Sangam MN;Bank Gothic;BankGothic Md BT;Baskerville;Baskerville Old Face;Batang;BatangChe;Bauer Bodoni;Bauhaus 93;Bazooka;Bell MT;Bembo;Benguiat Bk BT;Berlin Sans FB;Berlin Sans FB Demi;Bernard MT Condensed;BernhardFashion BT;BernhardMod BT;Big Caslon;BinnerD;Blackadder ITC;BlairMdITC TT;Bodoni 72;Bodoni 72 Oldstyle;Bodoni 72 Smallcaps;Bodoni MT;Bodoni MT Black;Bodoni MT Condensed;Bodoni MT Poster Compressed;Bookshelf Symbol 7;Boulder;Bradley Hand;Bradley Hand ITC;Bremen Bd BT;Britannic Bold;Broadway;Browallia New;BrowalliaUPC;Brush Script MT;Californian FB;Calisto MT;Calligrapher;Candara;CaslonOpnface BT;Castellar;Centaur;Cezanne;CG Omega;CG Times;Chalkboard;Chalkboard SE;Chalkduster;Charlesworth;Charter Bd BT;Charter BT;Chaucer;ChelthmITC Bk BT;Chiller;Clarendon;Clarendon Condensed;CloisterBlack BT;Cochin;Colonna MT;Constantia;Cooper Black;Copperplate;Copperplate Gothic;Copperplate Gothic Bold;Copperplate Gothic Light;CopperplGoth Bd BT;Corbel;Cordia New;CordiaUPC;Cornerstone;Coronet;Cuckoo;Curlz MT;DaunPenh;Dauphin;David;DB LCD Temp;DELICIOUS;Denmark;DFKai-SB;Didot;DilleniaUPC;DIN;DokChampa;Dotum;DotumChe;Ebrima;Edwardian Script ITC;Elephant;English 111 Vivace BT;Engravers MT;EngraversGothic BT;Eras Bold ITC;Eras Demi ITC;Eras Light ITC;Eras Medium ITC;EucrosiaUPC;Euphemia;Euphemia UCAS;EUROSTILE;Exotc350 Bd BT;FangSong;Felix Titling;Fixedsys;FONTIN;Footlight MT Light;Forte;FrankRuehl;Fransiscan;Freefrm721 Blk BT;FreesiaUPC;Freestyle Script;French Script MT;FrnkGothITC Bk BT;Fruitger;FRUTIGER;Futura;Futura Bk BT;Futura Lt BT;Futura Md BT;Futura ZBlk BT;FuturaBlack BT;Gabriola;Galliard BT;Gautami;Geeza Pro;Geometr231 BT;Geometr231 Hv BT;Geometr231 Lt BT;GeoSlab 703 Lt BT;GeoSlab 703 XBd BT;Gigi;Gill Sans;Gill Sans MT;Gill Sans MT Condensed;Gill Sans MT Ext Condensed Bold;Gill Sans Ultra Bold;Gill Sans Ultra Bold Condensed;Gisha;Gloucester MT Extra Condensed;GOTHAM;GOTHAM BOLD;Goudy Old Style;Goudy Stout;GoudyHandtooled BT;GoudyOLSt BT;Gujarati Sangam MN;Gulim;GulimChe;Gungsuh;GungsuhChe;Gurmukhi MN;Haettenschweiler;Harlow Solid Italic;Harrington;Heather;Heiti SC;Heiti TC;HELV;Herald;High Tower Text;Hiragino Kaku Gothic ProN;Hiragino Mincho ProN;Hoefler Text;Humanst 521 Cn BT;Humanst521 BT;Humanst521 Lt BT;Imprint MT Shadow;Incised901 Bd BT;Incised901 BT;Incised901 Lt BT;INCONSOLATA;Informal Roman;Informal011 BT;INTERSTATE;IrisUPC;Iskoola Pota;JasmineUPC;Jazz LET;Jenson;Jester;Jokerman;Juice ITC;Kabel Bk BT;Kabel Ult BT;Kailasa;KaiTi;Kalinga;Kannada Sangam MN;Kartika;Kaufmann Bd BT;Kaufmann BT;Khmer UI;KodchiangUPC;Kokila;Korinna BT;Kristen ITC;Krungthep;Kunstler Script;Lao UI;Latha;Leelawadee;Letter Gothic;Levenim MT;LilyUPC;Lithograph;Lithograph Light;Long Island;Lydian BT;Magneto;Maiandra GD;Malayalam Sangam MN;Malgun Gothic;Mangal;Marigold;Marion;Marker Felt;Market;Marlett;Matisse ITC;Matura MT Script Capitals;Meiryo;Meiryo UI;Microsoft Himalaya;Microsoft JhengHei;Microsoft New Tai Lue;Microsoft PhagsPa;Microsoft Tai Le;Microsoft Uighur;Microsoft YaHei;Microsoft Yi Baiti;MingLiU;MingLiU_HKSCS;MingLiU_HKSCS-ExtB;MingLiU-ExtB;Minion;Minion Pro;Miriam;Miriam Fixed;Mistral;Modern;Modern No. 20;Mona Lisa Solid ITC TT;Mongolian Baiti;MONO;MoolBoran;Mrs Eaves;MS LineDraw;MS Mincho;MS PMincho;MS Reference Specialty;MS UI Gothic;MT Extra;MUSEO;MV Boli;Nadeem;Narkisim;NEVIS;News Gothic;News GothicMT;NewsGoth BT;Niagara Engraved;Niagara Solid;Noteworthy;NSimSun;Nyala;OCR A Extended;Old Century;Old English Text MT;Onyx;Onyx BT;OPTIMA;Oriya Sangam MN;OSAKA;OzHandicraft BT;Palace Script MT;Papyrus;Parchment;Party LET;Pegasus;Perpetua;Perpetua Titling MT;PetitaBold;Pickwick;Plantagenet Cherokee;Playbill;PMingLiU;PMingLiU-ExtB;Poor Richard;Poster;PosterBodoni BT;PRINCETOWN LET;Pristina;PTBarnum BT;Pythagoras;Raavi;Rage Italic;Ravie;Ribbon131 Bd BT;Rockwell;Rockwell Condensed;Rockwell Extra Bold;Rod;Roman;Sakkal Majalla;Santa Fe LET;Savoye LET;Sceptre;Script;Script MT Bold;SCRIPTINA;Serifa;Serifa BT;Serifa Th BT;ShelleyVolante BT;Sherwood;Shonar Bangla;Showcard Gothic;Shruti;Signboard;SILKSCREEN;SimHei;Simplified Arabic;Simplified Arabic Fixed;SimSun;SimSun-ExtB;Sinhala Sangam MN;Sketch Rockwell;Skia;Small Fonts;Snap ITC;Snell Roundhand;Socket;Souvenir Lt BT;Staccato222 BT;Steamer;Stencil;Storybook;Styllo;Subway;Swis721 BlkEx BT;Swiss911 XCm BT;Sylfaen;Synchro LET;System;Tamil Sangam MN;Technical;Teletype;Telugu Sangam MN;Tempus Sans ITC;Terminal;Thonburi;Traditional Arabic;Trajan;TRAJAN PRO;Tristan;Tubular;Tunga;Tw Cen MT;Tw Cen MT Condensed;Tw Cen MT Condensed Extra Bold;TypoUpright BT;Unicorn;Univers;Univers CE 55 Medium;Univers Condensed;Utsaah;Vagabond;Vani;Vijaya;Viner Hand ITC;VisualUI;Vivaldi;Vladimir Script;Vrinda;Westminster;WHITNEY;Wide Latin;ZapfEllipt BT;ZapfHumnst BT;ZapfHumnst Dm BT;Zapfino;Zurich BlkEx BT;Zurich Ex BT;ZWAdobeF".split(
                  ";"
                )
              ));
            e = e.concat(b.fonts.userDefinedFonts);
            e = e.filter(function (a, b) {
              return e.indexOf(a) === b;
            });
            b = document.getElementsByTagName("body")[0];
            for (
              var f = document.createElement("div"),
                g = document.createElement("div"),
                k = {},
                h = {},
                p = [],
                m = 0,
                q = d.length;
              m < q;
              m++
            ) {
              var z = c();
              z.style.fontFamily = d[m];
              f.appendChild(z);
              p.push(z);
            }
            b.appendChild(f);
            m = 0;
            for (q = d.length; m < q; m++)
              (k[d[m]] = p[m].offsetWidth), (h[d[m]] = p[m].offsetHeight);
            p = {};
            m = 0;
            for (q = e.length; m < q; m++) {
              for (var z = [], n = 0, r = d.length; n < r; n++) {
                var v;
                v = e[m];
                var u = d[n],
                  t = c();
                t.style.fontFamily = "'" + v + "'," + u;
                v = t;
                g.appendChild(v);
                z.push(v);
              }
              p[e[m]] = z;
            }
            b.appendChild(g);
            m = [];
            q = 0;
            for (z = e.length; q < z; q++) {
              n = p[e[q]];
              r = !1;
              for (
                v = 0;
                v < d.length &&
                !(r =
                  n[v].offsetWidth !== k[d[v]] ||
                  n[v].offsetHeight !== h[d[v]]);
                v++
              );
              r && m.push(e[q]);
            }
            b.removeChild(g);
            b.removeChild(f);
            a(m);
          },
          pauseBefore: !0,
        },
        {
          key: "fontsFlash",
          getData: function (a, b) {
            if ("undefined" === typeof window.swfobject)
              return a("swf object not loaded");
            if (!window.swfobject.hasFlashPlayerVersion("9.0.0"))
              return a("flash not installed");
            if (!b.fonts.swfPath) return a("missing options.fonts.swfPath");
            window.___fp_swf_loaded = function (b) {
              a(b);
            };
            var c = b.fonts.swfContainerId,
              d = document.createElement("div");
            d.setAttribute("id", (void 0).fonts.swfContainerId);
            document.body.appendChild(d);
            window.swfobject.embedSWF(
              b.fonts.swfPath,
              c,
              "1",
              "1",
              "9.0.0",
              !1,
              { onReady: "___fp_swf_loaded" },
              { allowScriptAccess: "always", menu: "false" },
              {}
            );
          },
          pauseBefore: !0,
        },
        {
          key: "audio",
          getData: function (a, b) {
            var c = b.audio;
            if (
              c.excludeIOS11 &&
              navigator.userAgent.match(/OS 11.+Version\/11.+Safari/)
            )
              return a(b.EXCLUDED);
            var d =
              window.OfflineAudioContext || window.webkitOfflineAudioContext;
            if (null == d) return a(b.NOT_AVAILABLE);
            var e = new d(1, 44100, 44100),
              f = e.createOscillator();
            f.type = "triangle";
            f.frequency.setValueAtTime(1e4, e.currentTime);
            var g = e.createDynamicsCompressor();
            v(
              [
                ["threshold", -50],
                ["knee", 40],
                ["ratio", 12],
                ["reduction", -20],
                ["attack", 0],
                ["release", 0.25],
              ],
              function (a) {
                void 0 !== g[a[0]] &&
                  "function" === typeof g[a[0]].setValueAtTime &&
                  g[a[0]].setValueAtTime(a[1], e.currentTime);
              }
            );
            f.connect(g);
            g.connect(e.destination);
            f.start(0);
            e.startRendering();
            var h = setTimeout(function () {
              console.warn(
                'Audio fingerprint timed out. Please report bug at https://github.com/Valve/fingerprintjs2 with your user agent: "' +
                  navigator.userAgent +
                  '".'
              );
              e.oncomplete = function () {};
              e = null;
              return a("audioTimeout");
            }, c.timeout);
            e.oncomplete = function (b) {
              var c;
              try {
                clearTimeout(h),
                  (c = b.renderedBuffer
                    .getChannelData(0)
                    .slice(4500, 5e3)
                    .reduce(function (a, b) {
                      return a + Math.abs(b);
                    }, 0)
                    .toString()),
                  f.disconnect(),
                  g.disconnect();
              } catch (zb) {
                a(zb);
                return;
              }
              a(c);
            };
          },
        },
        {
          key: "enumerateDevices",
          getData: function (a, b) {
            if (
              !navigator.mediaDevices ||
              !navigator.mediaDevices.enumerateDevices
            )
              return a(b.NOT_AVAILABLE);
            navigator.mediaDevices.enumerateDevices().then(function (b) {
              a(
                b.map(function (a) {
                  return (
                    "id\x3d" +
                    a.deviceId +
                    ";gid\x3d" +
                    a.groupId +
                    ";" +
                    a.kind +
                    ";" +
                    a.label
                  );
                })
              );
            });
          },
        },
      ];
    a.get = function (a, b) {
      function c(d) {
        h += 1;
        if (h >= a.components.length) b(g.data);
        else {
          var e = a.components[h];
          if (a.excludes[e.key]) c(!1);
          else if (!d && e.pauseBefore)
            --h,
              setTimeout(function () {
                c(!0);
              }, 1);
          else
            try {
              e.getData(function (a) {
                g.addPreprocessedComponent(e.key, a);
                c(!1);
              }, a);
            } catch (zb) {
              g.addPreprocessedComponent(e.key, String(zb)), c(!1);
            }
        }
      }
      b ? a || (a = {}) : ((b = a), (a = {}));
      var d = a;
      if (null != r) {
        var e, f;
        for (f in r)
          (e = r[f]),
            null == e ||
              Object.prototype.hasOwnProperty.call(d, f) ||
              (d[f] = e);
      }
      a.components = a.extraComponents.concat(t);
      var g = {
          data: [],
          addPreprocessedComponent: function (b, c) {
            "function" === typeof a.preprocessor && (c = a.preprocessor(b, c));
            g.data.push({ key: b, value: c });
          },
        },
        h = -1;
      c(!1);
    };
    a.getPromise = function (b) {
      return new Promise(function (c) {
        a.get(b, c);
      });
    };
    a.getV18 = function (b, c) {
      null == c && ((c = b), (b = {}));
      return a.get(b, function (a) {
        for (var d = [], e = 0; e < a.length; e++) {
          var f = a[e];
          f.value === (b.NOT_AVAILABLE || "not available")
            ? d.push({ key: f.key, value: "unknown" })
            : "plugins" === f.key
            ? d.push({
                key: "plugins",
                value: n(f.value, function (a) {
                  var b = n(a[2], function (a) {
                    return a.join ? a.join("~") : a;
                  }).join(",");
                  return [a[0], a[1], b].join("::");
                }),
              })
            : -1 !== ["canvas", "webgl"].indexOf(f.key)
            ? d.push({ key: f.key, value: f.value.join("~") })
            : -1 !==
              [
                "sessionStorage",
                "localStorage",
                "indexedDb",
                "addBehavior",
                "openDatabase",
              ].indexOf(f.key)
            ? f.value && d.push({ key: f.key, value: 1 })
            : f.value
            ? d.push(
                f.value.join ? { key: f.key, value: f.value.join(";") } : f
              )
            : d.push({ key: f.key, value: f.value });
        }
        a = p(
          n(d, function (a) {
            return a.value;
          }).join("~~~"),
          31
        );
        c(a, d);
      });
    };
    a.x64hash128 = p;
    a.VERSION = "2.1.0";
    return a;
  }
  function A(a, b, c, d, e, f) {
    a = aa(aa(b, a), aa(d, f));
    return aa((a << e) | (a >>> (32 - e)), c);
  }
  function B(a, b, c, d, e, f, g) {
    return A((b & c) | (~b & d), a, b, e, f, g);
  }
  function C(a, b, c, d, e, f, g) {
    return A((b & d) | (c & ~d), a, b, e, f, g);
  }
  function D(a, b, c, d, e, f, g) {
    return A(c ^ (b | ~d), a, b, e, f, g);
  }
  function aa(a, b) {
    var c = (a & 65535) + (b & 65535);
    return (((a >> 16) + (b >> 16) + (c >> 16)) << 16) | (c & 65535);
  }
  function gc() {
    this.mode = 1;
    this.isPadding = !0;
    this.sk = Array(32);
  }
  function hc() {
    this.SM4_ENCRYPT = 1;
    this.SM4_DECRYPT = 0;
    var a = [
        214, 144, 233, 254, 204, 225, 61, 183, 22, 182, 20, 194, 40, 251, 44, 5,
        43, 103, 154, 118, 42, 190, 4, 195, 170, 68, 19, 38, 73, 134, 6, 153,
        156, 66, 80, 244, 145, 239, 152, 122, 51, 84, 11, 67, 237, 207, 172, 98,
        228, 179, 28, 169, 201, 8, 232, 149, 128, 223, 148, 250, 117, 143, 63,
        166, 71, 7, 167, 252, 243, 115, 23, 186, 131, 89, 60, 25, 230, 133, 79,
        168, 104, 107, 129, 178, 113, 100, 218, 139, 248, 235, 15, 75, 112, 86,
        157, 53, 30, 36, 14, 94, 99, 88, 209, 162, 37, 34, 124, 59, 1, 33, 120,
        135, 212, 0, 70, 87, 159, 211, 39, 82, 76, 54, 2, 231, 160, 196, 200,
        158, 234, 191, 138, 210, 64, 199, 56, 181, 163, 247, 242, 206, 249, 97,
        21, 161, 224, 174, 93, 164, 155, 52, 26, 85, 173, 147, 50, 48, 245, 140,
        177, 227, 29, 246, 226, 46, 130, 102, 202, 96, 192, 41, 35, 171, 13, 83,
        78, 111, 213, 219, 55, 69, 222, 253, 142, 47, 3, 255, 106, 114, 109,
        108, 91, 81, 141, 27, 175, 146, 187, 221, 188, 127, 17, 217, 92, 65, 31,
        16, 90, 216, 10, 193, 49, 136, 165, 205, 123, 189, 45, 116, 208, 18,
        184, 229, 180, 176, 137, 105, 151, 74, 12, 150, 119, 126, 101, 185, 241,
        9, 197, 110, 198, 132, 24, 240, 125, 236, 58, 220, 77, 32, 121, 238, 95,
        62, 215, 203, 57, 72,
      ],
      b = [2746333894, 1453994832, 1736282519, 2993693404],
      c = [
        462357, 472066609, 943670861, 1415275113, 1886879365, 2358483617,
        2830087869, 3301692121, 3773296373, 4228057617, 404694573, 876298825,
        1347903077, 1819507329, 2291111581, 2762715833, 3234320085, 3705924337,
        4177462797, 337322537, 808926789, 1280531041, 1752135293, 2223739545,
        2695343797, 3166948049, 3638552301, 4110090761, 269950501, 741554753,
        1213159005, 1684763257,
      ];
    this.GET_ULONG_BE = function (a, b) {
      return (
        ((a[b] & 255) << 24) |
        ((a[b + 1] & 255) << 16) |
        ((a[b + 2] & 255) << 8) |
        (a[b + 3] & 255)
      );
    };
    this.PUT_ULONG_BE = function (a, b, c) {
      var d = 255 & (a >> 24),
        e = 255 & (a >> 16),
        f = 255 & (a >> 8);
      a &= 255;
      b[c] = 128 < d ? d - 256 : d;
      b[c + 1] = 128 < e ? e - 256 : e;
      b[c + 2] = 128 < f ? f - 256 : f;
      b[c + 3] = 128 < a ? a - 256 : a;
    };
    this.SHL = function (a, b) {
      return (a & 4294967295) << b;
    };
    this.ROTL = function (a, b) {
      return this.SHL(a, b) | (a >> (32 - b));
    };
    this.sm4Lt = function (a) {
      var b = Array(4),
        c = Array(4);
      this.PUT_ULONG_BE(a, b, 0);
      c[0] = this.sm4Sbox(b[0]);
      c[1] = this.sm4Sbox(b[1]);
      c[2] = this.sm4Sbox(b[2]);
      c[3] = this.sm4Sbox(b[3]);
      a = this.GET_ULONG_BE(c, 0);
      return (
        a ^
        this.ROTL(a, 2) ^
        this.ROTL(a, 10) ^
        this.ROTL(a, 18) ^
        this.ROTL(a, 24)
      );
    };
    this.sm4F = function (a, b, c, g, h) {
      return a ^ this.sm4Lt(b ^ c ^ g ^ h);
    };
    this.sm4CalciRK = function (a) {
      var b = Array(4),
        c = Array(4);
      this.PUT_ULONG_BE(a, b, 0);
      c[0] = this.sm4Sbox(b[0]);
      c[1] = this.sm4Sbox(b[1]);
      c[2] = this.sm4Sbox(b[2]);
      c[3] = this.sm4Sbox(b[3]);
      a = this.GET_ULONG_BE(c, 0);
      return a ^ this.ROTL(a, 13) ^ this.ROTL(a, 23);
    };
    this.sm4Sbox = function (b) {
      b = a[b & 255];
      return 128 < b ? b - 256 : b;
    };
    this.sm4_setkey_enc = function (a, b) {
      if (null == a) return alert("ctx is null!"), !1;
      if (null == b || 16 != b.length) return alert("key error!"), !1;
      a.mode = this.SM4_ENCRYPT;
      this.sm4_setkey(a.sk, b);
    };
    this.sm4_setkey = function (a, e) {
      var d = Array(4),
        g = Array(36);
      d[0] = this.GET_ULONG_BE(e, 0);
      d[1] = this.GET_ULONG_BE(e, 4);
      d[2] = this.GET_ULONG_BE(e, 8);
      d[3] = this.GET_ULONG_BE(e, 12);
      g[0] = d[0] ^ b[0];
      g[1] = d[1] ^ b[1];
      g[2] = d[2] ^ b[2];
      g[3] = d[3] ^ b[3];
      for (e = 0; 32 > e; e++)
        (g[e + 4] =
          g[e] ^ this.sm4CalciRK(g[e + 1] ^ g[e + 2] ^ g[e + 3] ^ c[e])),
          (a[e] = g[e + 4]);
    };
    this.padding = function (a, b) {
      if (null == a) return null;
      if (b == this.SM4_ENCRYPT) {
        var c = parseInt(16 - (a.length % 16));
        b = a.slice(0);
        for (var d = 0; d < c; d++) b[a.length + d] = c;
      } else (c = a[a.length - 1]), (b = a.slice(0, a.length - c));
      return b;
    };
    this.sm4_one_round = function (a, b, c) {
      var d = 0,
        e = Array(36);
      e[0] = this.GET_ULONG_BE(b, 0);
      e[1] = this.GET_ULONG_BE(b, 4);
      e[2] = this.GET_ULONG_BE(b, 8);
      for (e[3] = this.GET_ULONG_BE(b, 12); 32 > d; )
        (e[d + 4] = this.sm4F(e[d], e[d + 1], e[d + 2], e[d + 3], a[d])), d++;
      this.PUT_ULONG_BE(e[35], c, 0);
      this.PUT_ULONG_BE(e[34], c, 4);
      this.PUT_ULONG_BE(e[33], c, 8);
      this.PUT_ULONG_BE(e[32], c, 12);
    };
    this.sm4_crypt_ecb = function (a, b) {
      null == b && alert("input is null!");
      a.isPadding &&
        a.mode == this.SM4_ENCRYPT &&
        (b = this.padding(b, this.SM4_ENCRYPT));
      for (var c = 0, d = b.length, e = []; 0 < d; d -= 16) {
        var u = Array(16),
          n = b.slice(16 * c, 16 * (c + 1));
        this.sm4_one_round(a.sk, n, u);
        e = e.concat(u);
        c++;
      }
      b = e;
      a.isPadding &&
        a.mode == this.SM4_DECRYPT &&
        (b = this.padding(b, this.SM4_DECRYPT));
      for (c = 0; c < b.length; c++) 0 > b[c] && (b[c] += 256);
      return b;
    };
    this.sm4_crypt_cbc = function (a, b, c) {
      (null != b && 16 == b.length) || alert("iv error!");
      null == c && alert("input is null!");
      a.isPadding &&
        a.mode == this.SM4_ENCRYPT &&
        (c = this.padding(c, this.SM4_ENCRYPT));
      var d,
        e = c.length,
        f = [];
      if (a.mode == this.SM4_ENCRYPT)
        for (var n = 0; 0 < e; e -= 16) {
          var v = Array(16),
            p = Array(16),
            m = c.slice(16 * n, 16 * (n + 1));
          for (d = 0; 16 > d; d++) v[d] = m[d] ^ b[d];
          this.sm4_one_round(a.sk, v, p);
          b = p.slice(0, 16);
          f = f.concat(p);
          n++;
        }
      else
        for (var q, n = 0; 0 < e; e -= 16) {
          v = Array(16);
          p = Array(16);
          m = c.slice(16 * n, 16 * (n + 1));
          q = m.slice(0, 16);
          sm4_one_round(a.sk, m, v);
          for (d = 0; 16 > d; d++) p[d] = v[d] ^ b[d];
          b = q.slice(0, 16);
          f = f.concat(p);
          n++;
        }
      b = f;
      a.isPadding &&
        a.mode == this.SM4_DECRYPT &&
        (b = this.padding(b, this.SM4_DECRYPT));
      for (d = 0; d < b.length; d++) 0 > b[d] && (b[d] += 256);
      return b;
    };
  }
  function Gc() {
    this.secretKey = "11HDESaAhiHHugDz";
    this.iv = "";
    this.hexString = !1;
    this.encryptData_ECB = function (a) {
      try {
        var b = new hc(),
          c = new gc();
        c.isPadding = !0;
        c.mode = b.SM4_ENCRYPT;
        var d = stringToByte(this.secretKey);
        b.sm4_setkey_enc(c, d);
        var e = b.sm4_crypt_ecb(c, stringToByte(a)),
          f = base64js.fromByteArray(e);
        null != f && 0 < f.trim().length && f.replace(/(\s*|\t|\r|\n)/g, "");
        return f;
      } catch (g) {
        return null;
      }
    };
    this.encryptData_CBC = function (a) {
      try {
        var b = new hc(),
          c = new gc();
        c.isPadding = !0;
        c.mode = b.SM4_ENCRYPT;
        var d = stringToByte(this.secretKey),
          e = stringToByte(this.iv);
        b.sm4_setkey_enc(c, d);
        var f = b.sm4_crypt_cbc(c, e, stringToByte(a)),
          g = base64js.fromByteArray(f);
        null != g && 0 < g.trim().length && g.replace(/(\s*|\t|\r|\n)/g, "");
        return g;
      } catch (h) {
        return null;
      }
    };
    stringToByte = function (a) {
      var b = [],
        c,
        d;
      c = a.length;
      for (var e = 0; e < c; e++)
        (d = a.charCodeAt(e)),
          65536 <= d && 1114111 >= d
            ? (b.push(((d >> 18) & 7) | 240),
              b.push(((d >> 12) & 63) | 128),
              b.push(((d >> 6) & 63) | 128),
              b.push((d & 63) | 128))
            : 2048 <= d && 65535 >= d
            ? (b.push(((d >> 12) & 15) | 224),
              b.push(((d >> 6) & 63) | 128),
              b.push((d & 63) | 128))
            : 128 <= d && 2047 >= d
            ? (b.push(((d >> 6) & 31) | 192), b.push((d & 63) | 128))
            : b.push(d & 255);
      return b;
    };
    byteToString = function (a) {
      if ("string" === typeof a) return a;
      for (var b = "", c = 0; c < a.length; c++) {
        var d = a[c].toString(2),
          e = d.match(/^1+?(?=0)/);
        if (e && 8 == d.length) {
          for (
            var d = e[0].length, e = a[c].toString(2).slice(7 - d), f = 1;
            f < d;
            f++
          )
            e += a[f + c].toString(2).slice(2);
          b += String.fromCharCode(parseInt(e, 2));
          c += d - 1;
        } else b += String.fromCharCode(a[c]);
      }
      return b;
    };
  }
  function Va(a) {
    try {
      var b,
        c,
        d,
        e = document.cookie.split(";");
      for (b = 0; b < e.length; b++)
        if (
          ((c = e[b].substr(0, e[b].indexOf("\x3d"))),
          (d = e[b].substr(e[b].indexOf("\x3d") + 1)),
          (c = c.replace(/^\s+|\s+$/g, "")),
          (a = a.replace(/^\s+|\s+$/g, "")),
          c == a)
        )
          return unescape(d);
    } catch (f) {}
  }
  function Wa(a, b, c, d, e, f) {
    var g = new Date();
    g.setTime(g.getTime());
    -1 != c
      ? ((c *= 864e5),
        (g = new Date(g.getTime() + c)),
        (cookieString =
          a +
          "\x3d" +
          escape(b) +
          (c ? ";expires\x3d" + g.toGMTString() : "") +
          (d ? ";path\x3d" + d : "") +
          (e ? ";domain\x3d" + e : "") +
          (f ? ";secure" : "")))
      : ((g = -1),
        (cookieString =
          a +
          "\x3d" +
          escape(b) +
          (c ? ";expires\x3d" + g : "") +
          (d ? ";path\x3d" + d : "") +
          (e ? ";domain\x3d" + e : "") +
          (f ? ";secure" : "")));
    document.cookie = cookieString;
  }
  function Lc(a) {
    a = a.replace(/\s/g, "");
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(a)) {
      a = a.split(".");
      if (0 == parseInt(parseFloat(a[0])) || 0 == parseInt(parseFloat(a[3])))
        return !1;
      for (var b = 0; b < a.length; b++)
        if (255 < parseInt(parseFloat(a[b]))) return !1;
      return !0;
    }
    return !1;
  }
  function Ma() {
    return void 0 !== window.SDKElement && "" !== window.SDKElement ? !0 : !1;
  }
  function Wa(a, b, c, d) {
    try {
      var e = new Date();
      e.setTime(e.getTime() + 864e5 * Number(c));
      document.cookie =
        1 == d
          ? a +
            "\x3d" +
            b +
            "; path\x3d/;expires \x3d " +
            e.toGMTString() +
            ";domain\x3d" +
            Ta(window.location.host) +
            ";secure\x3d" +
            d
          : a +
            "\x3d" +
            b +
            "; path\x3d/;expires \x3d " +
            e.toGMTString() +
            ";domain\x3d" +
            Ta(window.location.host);
    } catch (f) {}
  }
  function pb() {
    return ("ontouchstart" in window ||
      0 < navigator.maxTouchPoints ||
      0 < navigator.msMaxTouchPoints) &&
      navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
      ? "WAP"
      : "WEB";
  }
  function La() {
    this.dfpCache = new evercookie();
  }
  var ea =
      "https://dev.coc.10086.cn/coc3/gr/risk-ability/dfpRisk/getDfpOuterCode",
    Nc = window.bs_timestamp,
    qb = window.bs_uuid,
    wa = qb,
    xa = window.bs_serial_num_switch,
    Oc = window.bs_gener_timeout,
    Jc = new Date().getTime() - Nc,
    Ic = window.bs_report_rate_switch;
  "undefined" !== typeof window && "function" === typeof define && define.amd
    ? define(Ua)
    : "undefined" !== typeof module && module.exports
    ? (module.exports = Ua())
    : this.exports
    ? (this.exports = Ua())
    : (this.Fingerprint2 = Ua());
  var ic = {
    now: function () {
      return new Date().getTime();
    },
    rand: function () {
      return Math.random().toString().substr(2);
    },
    removeElem: function (a) {
      var b = a.parentNode;
      if (b)
        try {
          b.removeChild(a);
        } catch (c) {}
    },
    parseData: function (a) {
      var b = "";
      if ("string" === typeof a) b = a;
      else if ("object" === typeof a)
        for (var c in a) b += "\x26" + c + "\x3d" + encodeURIComponent(a[c]);
      b += "\x26_time\x3d" + this.now();
      return (b = b.substr(1));
    },
    getJSON: function (a, b, c) {
      b = document.createElement("script");
      b.type = "text/javascript";
      b.src = a;
      b.id = "id_callbackFunction";
      window.callbackFunction = function (a) {
        window.callbackFunction = void 0;
        var b = document.getElementById("id_callbackFunction");
        b && ic.removeElem(b);
        c(a);
      };
      var d = document.getElementsByTagName("head");
      !d ||
        !d[0] ||
        (document.getElementById("id_callbackFunction") &&
          -1 != a.indexOf("getFinger")) ||
        d[0].appendChild(b);
    },
  };
  "object" != typeof JSON && (JSON = {});
  (function () {
    function a(a) {
      return 10 > a ? "0" + a : a;
    }
    function b() {
      return this.valueOf();
    }
    function c(a) {
      return (
        (m.lastIndex = 0),
        m.test(a)
          ? '"' +
            a.replace(m, function (a) {
              var b = g[a];
              return "string" == typeof b
                ? b
                : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) +
            '"'
          : '"' + a + '"'
      );
    }
    function d(a, b) {
      var g,
        m,
        p,
        q = e,
        k = b[a];
      switch (
        (k &&
          "object" == typeof k &&
          "function" == typeof k.toJSON &&
          (k = k.toJSON(a)),
        "function" == typeof h && (k = h.call(b, a, k)),
        typeof k)
      ) {
        case "string":
          return c(k);
        case "number":
          return isFinite(k) ? String(k) : "null";
        case "boolean":
        case "null":
          return String(k);
        case "object":
          if (!k) return "null";
          if (
            ((e += f),
            (p = []),
            "[object Array]" === Object.prototype.toString.apply(k))
          ) {
            b = k.length;
            for (a = 0; b > a; a += 1) p[a] = d(a, k) || "null";
            return (
              (m =
                0 === p.length
                  ? "[]"
                  : e
                  ? "[\n" + e + p.join(",\n" + e) + "\n" + q + "]"
                  : "[" + p.join(",") + "]"),
              (e = q),
              m
            );
          }
          if (h && "object" == typeof h)
            for (b = h.length, a = 0; b > a; a += 1)
              "string" == typeof h[a] &&
                ((g = h[a]),
                (m = d(g, k)),
                m && p.push(c(g) + (e ? ": " : ":") + m));
          else
            for (g in k)
              Object.prototype.hasOwnProperty.call(k, g) &&
                ((m = d(g, k)), m && p.push(c(g) + (e ? ": " : ":") + m));
          return (
            (m =
              0 === p.length
                ? "{}"
                : e
                ? "{\n" + e + p.join(",\n" + e) + "\n" + q + "}"
                : "{" + p.join(",") + "}"),
            (e = q),
            m
          );
      }
    }
    var e,
      f,
      g,
      h,
      u = /^[\],:{}\s]*$/,
      n = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
      v = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
      p = /(?:^|:|,)(?:\s*\[)+/g,
      m =
        /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      q =
        /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    "function" != typeof Date.prototype.toJSON &&
      ((Date.prototype.toJSON = function () {
        return isFinite(this.valueOf())
          ? this.getUTCFullYear() +
              "-" +
              a(this.getUTCMonth() + 1) +
              "-" +
              a(this.getUTCDate()) +
              "T" +
              a(this.getUTCHours()) +
              ":" +
              a(this.getUTCMinutes()) +
              ":" +
              a(this.getUTCSeconds()) +
              "Z"
          : null;
      }),
      (Boolean.prototype.toJSON = b),
      (Number.prototype.toJSON = b),
      (String.prototype.toJSON = b));
    "function" != typeof JSON.stringify &&
      ((g = {
        "\b": "\\b",
        "   ": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\",
      }),
      (JSON.stringify = function (a, b, c) {
        var g;
        if (((e = ""), (f = ""), "number" == typeof c))
          for (g = 0; c > g; g += 1) f += " ";
        else "string" == typeof c && (f = c);
        if (
          ((h = b),
          b &&
            "function" != typeof b &&
            ("object" != typeof b || "number" != typeof b.length))
        )
          throw Error("JSON.stringify");
        return d("", { "": a });
      }));
    "function" != typeof JSON.parse &&
      (JSON.parse = function (a, b) {
        function c(a, d) {
          var e,
            f,
            g = a[d];
          if (g && "object" == typeof g)
            for (e in g)
              Object.prototype.hasOwnProperty.call(g, e) &&
                ((f = c(g, e)), void 0 !== f ? (g[e] = f) : delete g[e]);
          return b.call(a, d, g);
        }
        var d;
        if (
          ((a = String(a)),
          (q.lastIndex = 0),
          q.test(a) &&
            (a = a.replace(q, function (a) {
              return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            })),
          u.test(a.replace(n, "@").replace(v, "]").replace(p, "")))
        )
          return (
            (d = eval("(" + a + ")")),
            "function" == typeof b ? c({ "": d }, "") : d
          );
        throw new SyntaxError("JSON.parse");
      });
  })();
  Array.prototype.indexOf ||
    (Array.prototype.indexOf = function (a, b) {
      if (null == this) throw new TypeError("'this' is null or undefined");
      var c = Object(this),
        d = c.length >>> 0;
      if (0 === d) return -1;
      b = +b || 0;
      Infinity === Math.abs(b) && (b = 0);
      if (b >= d) return -1;
      for (b = Math.max(0 <= b ? b : d - Math.abs(b), 0); b < d; ) {
        if (b in c && c[b] === a) return b;
        b++;
      }
      return -1;
    });
  var Xa,
    P = window,
    x = document,
    ca = navigator,
    jc = !1,
    Sa = [
      function () {
        if (jc) {
          var a = x.getElementsByTagName("body")[0],
            b = x.createElement("object");
          b.setAttribute("type", "application/x-shockwave-flash");
          var c = a.appendChild(b);
          if (c) {
            var d = 0;
            (function f() {
              if ("undefined" != typeof c.GetVariable) {
                var g = c.GetVariable("$version");
                g &&
                  ((g = g.split(" ")[1].split(",")),
                  (w.pv = [
                    parseInt(g[0], 10),
                    parseInt(g[1], 10),
                    parseInt(g[2], 10),
                  ]));
              } else if (10 > d) {
                d++;
                setTimeout(f, 10);
                return;
              }
              a.removeChild(b);
              c = null;
              yb();
            })();
          } else yb();
        } else yb();
      },
    ],
    ba = [],
    Pa = [],
    la = [],
    va,
    Ra,
    vb,
    cc,
    ga = !1,
    Qa = !1,
    X,
    rb,
    $b = !0,
    w,
    Pc =
      "undefined" != typeof x.getElementById &&
      "undefined" != typeof x.getElementsByTagName &&
      "undefined" != typeof x.createElement,
    Ya = ca.userAgent.toLowerCase(),
    Za = ca.platform.toLowerCase(),
    Qc = Za ? /win/.test(Za) : /win/.test(Ya),
    Rc = Za ? /mac/.test(Za) : /mac/.test(Ya),
    Sc = /webkit/.test(Ya)
      ? parseFloat(Ya.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1"))
      : !1,
    Ab = !+"\v1",
    ya = [0, 0, 0],
    M = null;
  if (
    "undefined" != typeof ca.plugins &&
    "object" == typeof ca.plugins["Shockwave Flash"]
  )
    !(M = ca.plugins["Shockwave Flash"].description) ||
      ("undefined" != typeof ca.mimeTypes &&
        ca.mimeTypes["application/x-shockwave-flash"] &&
        !ca.mimeTypes["application/x-shockwave-flash"].enabledPlugin) ||
      ((jc = !0),
      (Ab = !1),
      (M = M.replace(/^.*\s+(\S+\s+\S+$)/, "$1")),
      (ya[0] = parseInt(M.replace(/^(.*)\..*$/, "$1"), 10)),
      (ya[1] = parseInt(M.replace(/^.*\.(.*)\s.*$/, "$1"), 10)),
      (ya[2] = /[a-zA-Z]/.test(M)
        ? parseInt(M.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10)
        : 0));
  else if ("undefined" != typeof P.ActiveXObject)
    try {
      if (
        (M = new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable(
          "$version"
        ))
      )
        (Ab = !0),
          (M = M.split(" ")[1].split(",")),
          (ya = [parseInt(M[0], 10), parseInt(M[1], 10), parseInt(M[2], 10)]);
    } catch (a) {}
  w = { w3: Pc, pv: ya, wk: Sc, ie: Ab, win: Qc, mac: Rc };
  w.w3 &&
    ((("undefined" != typeof x.readyState && "complete" == x.readyState) ||
      ("undefined" == typeof x.readyState &&
        (x.getElementsByTagName("body")[0] || x.body))) &&
      ma(),
    ga ||
      ("undefined" != typeof x.addEventListener &&
        x.addEventListener("DOMContentLoaded", ma, !1),
      w.ie &&
        w.win &&
        (x.attachEvent("onreadystatechange", function b() {
          "complete" == x.readyState &&
            (x.detachEvent("onreadystatechange", b), ma());
        }),
        P == top &&
          (function c() {
            if (!ga) {
              try {
                x.documentElement.doScroll("left");
              } catch (d) {
                setTimeout(c, 0);
                return;
              }
              ma();
            }
          })()),
      w.wk &&
        (function b() {
          ga ||
            (/loaded|complete/.test(x.readyState) ? ma() : setTimeout(b, 0));
        })(),
      dc(ma)));
  w.ie &&
    w.win &&
    window.attachEvent("onunload", function () {
      for (var a = la.length, b = 0; b < a; b++)
        la[b][0].detachEvent(la[b][1], la[b][2]);
      a = Pa.length;
      for (b = 0; b < a; b++) bc(Pa[b]);
      for (var c in w) w[c] = null;
      w = null;
      for (var d in Xa) Xa[d] = null;
      Xa = null;
    });
  Xa = {
    registerObject: function (a, b, c, d) {
      if (w.w3 && a && b) {
        var e = {};
        e.id = a;
        e.swfVersion = b;
        e.expressInstall = c;
        e.callbackFn = d;
        ba[ba.length] = e;
        fa(a, !1);
      } else d && d({ success: !1, id: a });
    },
    getObjectById: function (a) {
      if (w.w3) return xb(a);
    },
    embedSWF: function (a, b, c, d, e, f, g, h, u, n) {
      var v = { success: !1, id: b };
      w.w3 && !(w.wk && 312 > w.wk) && a && b && c && d && e
        ? (fa(b, !1),
          ec(function () {
            c += "";
            d += "";
            var p = {};
            if (u && "object" === typeof u) for (var m in u) p[m] = u[m];
            p.data = a;
            p.width = c;
            p.height = d;
            m = {};
            if (h && "object" === typeof h) for (var q in h) m[q] = h[q];
            if (g && "object" === typeof g)
              for (var z in g)
                m.flashvars =
                  "undefined" != typeof m.flashvars
                    ? m.flashvars + ("\x26" + z + "\x3d" + g[z])
                    : z + "\x3d" + g[z];
            if (Oa(e))
              (q = sb(p, m, b)),
                p.id == b && fa(b, !0),
                (v.success = !0),
                (v.ref = q);
            else {
              if (f && wb()) {
                p.data = f;
                ub(p, m, b, n);
                return;
              }
              fa(b, !0);
            }
            n && n(v);
          }))
        : n && n(v);
    },
    switchOffAutoHideShow: function () {
      $b = !1;
    },
    ua: w,
    getFlashPlayerVersion: function () {
      return { major: w.pv[0], minor: w.pv[1], release: w.pv[2] };
    },
    hasFlashPlayerVersion: Oa,
    createSWF: function (a, b, c) {
      if (w.w3) return sb(a, b, c);
    },
    showExpressInstall: function (a, b, c, d) {
      w.w3 && wb() && ub(a, b, c, d);
    },
    removeSWF: function (a) {
      w.w3 && bc(a);
    },
    createCSS: function (a, b, c, d) {
      w.w3 && ac(a, b, c, d);
    },
    addDomLoadEvent: ec,
    addLoadEvent: dc,
    getQueryParamValue: function (a) {
      var b = x.location.search || x.location.hash;
      if (b) {
        /\?/.test(b) && (b = b.split("?")[1]);
        if (null == a) return Zb(b);
        for (var b = b.split("\x26"), c = 0; c < b.length; c++)
          if (b[c].substring(0, b[c].indexOf("\x3d")) == a)
            return Zb(b[c].substring(b[c].indexOf("\x3d") + 1));
      }
      return "";
    },
    expressInstallCallback: function () {
      if (Qa) {
        var a = T("SWFObjectExprInst");
        a &&
          va &&
          (a.parentNode.replaceChild(va, a),
          Ra && (fa(Ra, !0), w.ie && w.win && (va.style.display = "block")),
          vb && vb(cc));
        Qa = !1;
      }
    },
  };
  try {
    var y = window,
      I = y.document,
      Bb = y.globalStorage,
      Tc = y.swfobject;
    try {
      var Cb = y.localStorage;
    } catch (a) {}
    try {
      var Db = y.sessionStorage;
    } catch (a) {}
    var za,
      $a,
      kc = {
        history: !1,
        java: !1,
        tests: 2,
        silverlight: !1,
        domain: Ta(y.location.host),
        baseurl: "",
        asseturi: "/assets",
        authPath: !1,
      };
    y._evercookie_flash_var = function (a) {
      za = a;
      (a = I.getElementById("myswf")) &&
        a.parentNode &&
        a.parentNode.removeChild(a);
    };
    y.evercookie = y.Evercookie = function (a) {
      a = a || {};
      var b = {},
        c;
      for (c in kc) {
        var d = a[c];
        b[c] = "undefined" !== typeof d ? d : kc[c];
      }
      "function" === typeof b.domain && (b.domain = b.domain(y));
      var e = b.tests,
        f = b.domain,
        g = this;
      this._ec = {};
      this.get = function (a, b, c) {
        g._evercookie(a, b, void 0, void 0, c);
      };
      this.set = function (a, b) {
        g._evercookie(a, function () {}, b);
      };
      this._evercookie = function (a, b, c, d, f) {
        void 0 === g._evercookie && (g = this);
        void 0 === d && (d = 0);
        0 === d &&
          (g.evercookie_database_storage(a, c),
          g.evercookie_indexdb_storage(a, c),
          (g._ec.userData = g.evercookie_userdata(a, c)),
          (g._ec.localData = g.evercookie_local_storage(a, c)),
          (g._ec.globalData = g.evercookie_global_storage(a, c)),
          (g._ec.sessionData = g.evercookie_session_storage(a, c)));
        if (void 0 !== c)
          ("undefined" === typeof za || "undefined" === typeof $a) &&
            d++ < e &&
            setTimeout(function () {
              g._evercookie(a, b, c, d, f);
            }, 300);
        else if (
          ((y.openDatabase && "undefined" === typeof g._ec.dbData) ||
            (("indexedDB" in y ||
              (y.indexedDB =
                y.indexedDB ||
                y.mozIndexedDB ||
                y.webkitIndexedDB ||
                y.msIndexedDB)) &&
              ("undefined" === typeof g._ec.idbData || "" === g._ec.idbData)) ||
            "undefined" === typeof za ||
            "undefined" === typeof g._ec.etagData ||
            "undefined" === typeof g._ec.cacheData ||
            "undefined" === typeof g._ec.javaData ||
            (I.createElement("canvas").getContext &&
              ("undefined" === typeof g._ec.pngData || "" === g._ec.pngData)) ||
            "undefined" === typeof $a) &&
          d++ < e
        )
          setTimeout(function () {
            g._evercookie(a, b, c, d, f);
          }, 20);
        else {
          g._ec.lsoData = g.getFromStr(a, za);
          za = void 0;
          g._ec.slData = g.getFromStr(a, $a);
          $a = void 0;
          var m = g._ec,
            p = [],
            h = 0,
            q,
            k;
          g._ec = {};
          for (k in m)
            m[k] &&
              "null" !== m[k] &&
              "undefined" !== m[k] &&
              (p[m[k]] = void 0 === p[m[k]] ? 1 : p[m[k]] + 1);
          for (k in p) p[k] > h && ((h = p[k]), (q = k));
          void 0 === q || (void 0 !== f && 1 === f) || g.set(a, q);
          "function" === typeof b && b(q, m);
        }
      };
      this.evercookie_userdata = function (a, b) {
        try {
          var c = this.createElem("div", "userdata_el", 1);
          if (c.addBehavior)
            if (((c.style.behavior = "url(#default#userData)"), void 0 !== b))
              c.setAttribute(a, b), c.save(a);
            else return c.load(a), c.getAttribute(a);
        } catch (z) {}
      };
      this.evercookie_local_storage = function (a, b) {
        try {
          if (Cb)
            if (void 0 !== b) Cb.setItem(a, b);
            else return Cb.getItem(a);
        } catch (q) {}
      };
      this.evercookie_database_storage = function (a, b) {
        try {
          if (y.openDatabase) {
            var c = y.openDatabase(
              "sqlite_evercookie",
              "",
              "evercookie",
              1048576
            );
            void 0 !== b
              ? c.transaction(function (c) {
                  c.executeSql(
                    "CREATE TABLE IF NOT EXISTS cache(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, value TEXT NOT NULL, UNIQUE (name))",
                    [],
                    function () {},
                    function () {}
                  );
                  c.executeSql(
                    "INSERT OR REPLACE INTO cache(name, value) VALUES(?, ?)",
                    [a, b],
                    function () {},
                    function () {}
                  );
                })
              : c.transaction(function (b) {
                  b.executeSql(
                    "SELECT value FROM cache WHERE name\x3d?",
                    [a],
                    function (a, b) {
                      g._ec.dbData =
                        1 <= b.rows.length ? b.rows.item(0).value : "";
                    },
                    function () {}
                  );
                });
          }
        } catch (z) {}
      };
      this.evercookie_indexdb_storage = function (a, b) {
        try {
          if (
            ("indexedDB" in y ||
              ((indexedDB =
                y.indexedDB ||
                y.mozIndexedDB ||
                y.webkitIndexedDB ||
                y.msIndexedDB),
              (IDBTransaction =
                y.IDBTransaction ||
                y.webkitIDBTransaction ||
                y.msIDBTransaction),
              (IDBKeyRange =
                y.IDBKeyRange || y.webkitIDBKeyRange || y.msIDBKeyRange)),
            indexedDB)
          ) {
            var c = indexedDB.open("idb_evercookie", 1);
            c.onerror = function () {};
            c.onupgradeneeded = function (a) {
              a.target.result.createObjectStore("evercookie", {
                keyPath: "name",
                unique: !1,
              });
            };
            c.onsuccess =
              void 0 !== b
                ? function (c) {
                    c = c.target.result;
                    c.objectStoreNames.contains("evercookie") &&
                      c
                        .transaction(["evercookie"], "readwrite")
                        .objectStore("evercookie")
                        .put({ name: a, value: b });
                    c.close();
                  }
                : function (b) {
                    b = b.target.result;
                    if (b.objectStoreNames.contains("evercookie")) {
                      var c = b
                        .transaction(["evercookie"])
                        .objectStore("evercookie")
                        .get(a);
                      c.onsuccess = function () {
                        g._ec.idbData =
                          void 0 === c.result ? void 0 : c.result.value;
                      };
                    } else g._ec.idbData = void 0;
                    b.close();
                  };
          }
        } catch (z) {}
      };
      this.evercookie_session_storage = function (a, b) {
        try {
          if (Db)
            if (void 0 !== b) Db.setItem(a, b);
            else return Db.getItem(a);
        } catch (q) {}
      };
      this.evercookie_global_storage = function (a, b) {
        if (Bb) {
          var c = this.getHost();
          try {
            if (void 0 !== b) Bb[c][a] = b;
            else return Bb[c][a];
          } catch (z) {}
        }
      };
      this.encode = function (a) {
        var b = "",
          c,
          d,
          e,
          f,
          g,
          h,
          p = 0;
        for (a = this._utf8_encode(a); p < a.length; )
          (c = a.charCodeAt(p++)),
            (d = a.charCodeAt(p++)),
            (e = a.charCodeAt(p++)),
            (f = c >> 2),
            (c = ((c & 3) << 4) | (d >> 4)),
            (g = ((d & 15) << 2) | (e >> 6)),
            (h = e & 63),
            isNaN(d) ? (g = h = 64) : isNaN(e) && (h = 64),
            (b =
              b +
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(
                f
              ) +
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(
                c
              ) +
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(
                g
              ) +
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(
                h
              ));
        return b;
      };
      this.decode = function (a) {
        var b = "",
          c,
          d,
          e,
          f,
          g,
          h = 0;
        for (a = a.replace(/[^A-Za-z0-9\+\/\=]/g, ""); h < a.length; )
          (c =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".indexOf(
              a.charAt(h++)
            )),
            (d =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".indexOf(
                a.charAt(h++)
              )),
            (f =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".indexOf(
                a.charAt(h++)
              )),
            (g =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".indexOf(
                a.charAt(h++)
              )),
            (c = (c << 2) | (d >> 4)),
            (d = ((d & 15) << 4) | (f >> 2)),
            (e = ((f & 3) << 6) | g),
            (b += String.fromCharCode(c)),
            64 !== f && (b += String.fromCharCode(d)),
            64 !== g && (b += String.fromCharCode(e));
        return (b = this._utf8_decode(b));
      };
      this._utf8_encode = function (a) {
        a = a.replace(/\r\n/g, "\n");
        for (var b = "", c = 0, d = a.length, e; c < d; c++)
          (e = a.charCodeAt(c)),
            128 > e
              ? (b += String.fromCharCode(e))
              : (127 < e && 2048 > e
                  ? (b += String.fromCharCode((e >> 6) | 192))
                  : ((b += String.fromCharCode((e >> 12) | 224)),
                    (b += String.fromCharCode(((e >> 6) & 63) | 128))),
                (b += String.fromCharCode((e & 63) | 128)));
        return b;
      };
      this._utf8_decode = function (a) {
        for (var b = "", c = 0, d = a.length, e, f, g; c < d; )
          (e = a.charCodeAt(c)),
            128 > e
              ? ((b += String.fromCharCode(e)), (c += 1))
              : 191 < e && 224 > e
              ? ((f = a.charCodeAt(c + 1)),
                (b += String.fromCharCode(((e & 31) << 6) | (f & 63))),
                (c += 2))
              : ((f = a.charCodeAt(c + 1)),
                (g = a.charCodeAt(c + 2)),
                (b += String.fromCharCode(
                  ((e & 15) << 12) | ((f & 63) << 6) | (g & 63)
                )),
                (c += 3));
        return b;
      };
      this.createElem = function (a, b, c) {
        a =
          void 0 !== b && I.getElementById(b)
            ? I.getElementById(b)
            : I.createElement(a);
        a.style.visibility = "hidden";
        a.style.position = "absolute";
        b && a.setAttribute("id", b);
        c && I.body.appendChild(a);
        return a;
      };
      var h = (this.waitForSwf = function (a) {
        void 0 === a ? (a = 0) : a++;
        a < e &&
          "undefined" === typeof Tc &&
          setTimeout(function () {
            h(a);
          }, 300);
      });
      this.evercookie_cookie = function (a, b) {
        if (void 0 !== b)
          I.cookie =
            a +
            "\x3d" +
            b +
            "; expires\x3dTue, 31 Dec 2030 00:00:00 UTC; path\x3d/; domain\x3d" +
            f;
        else return this.getFromStr(a, I.cookie);
      };
      this.getFromStr = function (a, b) {
        if ("string" === typeof b) {
          a += "\x3d";
          b = b.split(/[;&]/);
          var c, d;
          for (c = 0; c < b.length; c++) {
            for (d = b[c]; " " === d.charAt(0); ) d = d.substring(1, d.length);
            if (0 === d.indexOf(a)) return d.substring(a.length, d.length);
          }
        }
      };
      this.getHost = function () {
        return Ta(y.location.host);
      };
      this.toHex = function (a) {
        for (var b = "", c = a.length, d = 0, e; d < c; ) {
          for (e = a.charCodeAt(d++).toString(16); 2 > e.length; ) e = "0" + e;
          b += e;
        }
        return b;
      };
      this.fromHex = function (a) {
        for (var b = "", c = a.length, d; 0 <= c; )
          (d = c - 2),
            (b = String.fromCharCode("0x" + a.substring(d, c)) + b),
            (c = d);
        return b;
      };
      var u = this.createElem("a", "_ec_rgb_link"),
        n,
        v;
      try {
        (n = 1),
          (v = I.createElement("style")),
          v.styleSheet
            ? (v.styleSheet.innerHTML =
                "#_ec_rgb_link:visited{display:none;color:#FF0000}")
            : v.innerHTML
            ? (v.innerHTML =
                "#_ec_rgb_link:visited{display:none;color:#FF0000}")
            : v.appendChild(
                I.createTextNode(
                  "#_ec_rgb_link:visited{display:none;color:#FF0000}"
                )
              );
      } catch (p) {
        n = 0;
      }
      this._getRGB = function (a, b) {
        if (b && 0 === n) return -1;
        u.href = a;
        u.innerHTML = a;
        I.body.appendChild(v);
        I.body.appendChild(u);
        if (I.defaultView) {
          if (null == I.defaultView.getComputedStyle(u, null)) return -1;
          a = I.defaultView.getComputedStyle(u, null).getPropertyValue("color");
        } else a = u.currentStyle.color;
        return a;
      };
    };
  } catch (a) {}
  var W = "object" === typeof window ? window : this,
    S = {
      extend: function (a, b) {
        var c = {},
          d;
        for (d in a)
          c[d] = b[d] && 0 === b[d].length % 2 ? b[d].concat(a[d]) : a[d];
        return c;
      },
      has: function (a, b) {
        return "string" === typeof a
          ? -1 !== b.toLowerCase().indexOf(a.toLowerCase())
          : !1;
      },
      lowerize: function (a) {
        return a.toLowerCase();
      },
      major: function (a) {
        return "string" === typeof a
          ? a.replace(/[^\d\.]/g, "").split(".")[0]
          : void 0;
      },
      trim: function (a) {
        return a.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
      },
    },
    O = {
      rgx: function (a, b) {
        for (var c = 0, d, e, f, g, h, u; c < b.length && !h; ) {
          var n = b[c],
            v = b[c + 1];
          for (d = e = 0; d < n.length && !h; )
            if ((h = n[d++].exec(a)))
              for (f = 0; f < v.length; f++)
                (u = h[++e]),
                  (g = v[f]),
                  "object" === typeof g && 0 < g.length
                    ? 2 == g.length
                      ? (this[g[0]] =
                          "function" == typeof g[1] ? g[1].call(this, u) : g[1])
                      : 3 == g.length
                      ? (this[g[0]] =
                          "function" !== typeof g[1] || (g[1].exec && g[1].test)
                            ? u
                              ? u.replace(g[1], g[2])
                              : void 0
                            : u
                            ? g[1].call(this, u, g[2])
                            : void 0)
                      : 4 == g.length &&
                        (this[g[0]] = u
                          ? g[3].call(this, u.replace(g[1], g[2]))
                          : void 0)
                    : (this[g] = u ? u : void 0);
          c += 2;
        }
      },
      str: function (a, b) {
        for (var c in b)
          if ("object" === typeof b[c] && 0 < b[c].length)
            for (var d = 0; d < b[c].length; d++) {
              if (S.has(b[c][d], a)) return "?" === c ? void 0 : c;
            }
          else if (S.has(b[c], a)) return "?" === c ? void 0 : c;
        return a;
      },
    },
    pa = {
      browser: {
        oldsafari: {
          version: {
            "1.0": "/8",
            1.2: "/1",
            1.3: "/3",
            "2.0": "/412",
            "2.0.2": "/416",
            "2.0.3": "/417",
            "2.0.4": "/419",
            "?": "/",
          },
        },
      },
      device: {
        amazon: { model: { "Fire Phone": ["SD", "KF"] } },
        sprint: {
          model: { "Evo Shift 4G": "7373KT" },
          vendor: { HTC: "APA", Sprint: "Sprint" },
        },
      },
      os: {
        windows: {
          version: {
            ME: "4.90",
            "NT 3.11": "NT3.51",
            "NT 4.0": "NT4.0",
            2e3: "NT 5.0",
            XP: ["NT 5.1", "NT 5.2"],
            Vista: "NT 6.0",
            7: "NT 6.1",
            8: "NT 6.2",
            8.1: "NT 6.3",
            10: ["NT 6.4", "NT 10.0"],
            RT: "ARM",
          },
        },
      },
    },
    Yb = {
      browser: [
        [
          /(opera\smini)\/([\w\.-]+)/i,
          /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,
          /(opera).+version\/([\w\.]+)/i,
          /(opera)[\/\s]+([\w\.]+)/i,
        ],
        ["name", "version"],
        [/(opios)[\/\s]+([\w\.]+)/i],
        [["name", "Opera Mini"], "version"],
        [/\s(opr)\/([\w\.]+)/i],
        [["name", "Opera"], "version"],
        [
          /(kindle)\/([\w\.]+)/i,
          /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i,
          /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
          /(?:ms|\()(ie)\s([\w\.]+)/i,
          /(rekonq)\/([\w\.]*)/i,
          /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon)\/([\w\.-]+)/i,
        ],
        ["name", "version"],
        [/(konqueror)\/([\w\.]+)/i],
        [["name", "Konqueror"], "version"],
        [/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],
        [["name", "IE"], "version"],
        [/(edge|edgios|edga|edg)\/((\d+)?[\w\.]+)/i],
        [["name", "Edge"], "version"],
        [/(yabrowser)\/([\w\.]+)/i],
        [["name", "Yandex"], "version"],
        [/(puffin)\/([\w\.]+)/i],
        [["name", "Puffin"], "version"],
        [/(focus)\/([\w\.]+)/i],
        [["name", "Firefox Focus"], "version"],
        [/(opt)\/([\w\.]+)/i],
        [["name", "Opera Touch"], "version"],
        [/((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i],
        [["name", "UCBrowser"], "version"],
        [/(comodo_dragon)\/([\w\.]+)/i],
        [["name", /_/g, " "], "version"],
        [/(windowswechat qbcore)\/([\w\.]+)/i],
        [["name", "WeChat(Win) Desktop"], "version"],
        [/(micromessenger)\/([\w\.]+)/i],
        [["name", "WeChat"], "version"],
        [/(brave)\/([\w\.]+)/i],
        [["name", "Brave"], "version"],
        [/(qqbrowserlite)\/([\w\.]+)/i],
        ["name", "version"],
        [/(QQ)\/([\d\.]+)/i],
        ["name", "version"],
        [/m?(qqbrowser)[\/\s]?([\w\.]+)/i],
        ["name", "version"],
        [/(BIDUBrowser)[\/\s]?([\w\.]+)/i],
        ["name", "version"],
        [/(2345Explorer)[\/\s]?([\w\.]+)/i],
        ["name", "version"],
        [/(MetaSr)[\/\s]?([\w\.]+)/i],
        ["name"],
        [/(LBBROWSER)/i],
        ["name"],
        [/xiaomi\/miuibrowser\/([\w\.]+)/i],
        ["version", ["name", "MIUI Browser"]],
        [/;fbav\/([\w\.]+);/i],
        ["version", ["name", "Facebook"]],
        [/safari\s(line)\/([\w\.]+)/i, /android.+(line)\/([\w\.]+)\/iab/i],
        ["name", "version"],
        [/headlesschrome(?:\/([\w\.]+)|\s)/i],
        ["version", ["name", "Chrome Headless"]],
        [/\swv\).+(chrome)\/([\w\.]+)/i],
        [["name", /(.+)/, "$1 WebView"], "version"],
        [/((?:oculus|samsung)browser)\/([\w\.]+)/i],
        [["name", /(.+(?:g|us))(.+)/, "$1 $2"], "version"],
        [/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i],
        ["version", ["name", "Android Browser"]],
        [/(sailfishbrowser)\/([\w\.]+)/i],
        [["name", "Sailfish Browser"], "version"],
        [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i],
        ["name", "version"],
        [/(dolfin)\/([\w\.]+)/i],
        [["name", "Dolphin"], "version"],
        [/((?:android.+)crmo|crios)\/([\w\.]+)/i],
        [["name", "Chrome"], "version"],
        [/(coast)\/([\w\.]+)/i],
        [["name", "Opera Coast"], "version"],
        [/fxios\/([\w\.-]+)/i],
        ["version", ["name", "Firefox"]],
        [/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],
        ["version", ["name", "Mobile Safari"]],
        [/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],
        ["version", "name"],
        [/webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i],
        [["name", "GSA"], "version"],
        [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],
        ["name", ["version", O.str, pa.browser.oldsafari.version]],
        [/(webkit|khtml)\/([\w\.]+)/i],
        ["name", "version"],
        [/(navigator|netscape)\/([\w\.-]+)/i],
        [["name", "Netscape"], "version"],
        [
          /(swiftfox)/i,
          /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
          /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,
          /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,
          /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
          /(links)\s\(([\w\.]+)/i,
          /(gobrowser)\/?([\w\.]*)/i,
          /(ice\s?browser)\/v?([\w\._]+)/i,
          /(mosaic)[\/\s]([\w\.]+)/i,
        ],
        ["name", "version"],
      ],
      cpu: [
        [/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],
        [["architecture", "amd64"]],
        [/(ia32(?=;))/i],
        [["architecture", S.lowerize]],
        [/((?:i[346]|x)86)[;\)]/i],
        [["architecture", "ia32"]],
        [/windows\s(ce|mobile);\sppc;/i],
        [["architecture", "arm"]],
        [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],
        [["architecture", /ower/, "", S.lowerize]],
        [/(sun4\w)[;\)]/i],
        [["architecture", "sparc"]],
        [
          /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+[;l]))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i,
        ],
        [["architecture", S.lowerize]],
      ],
      device: [
        [/\((ipad|playbook);[\w\s\),;-]+(rim|apple)/i],
        ["model", "vendor", ["type", "tablet"]],
        [/applecoremedia\/[\w\.]+ \((ipad)/],
        ["model", ["vendor", "Apple"], ["type", "tablet"]],
        [/(apple\s{0,1}tv)/i],
        [
          ["model", "Apple TV"],
          ["vendor", "Apple"],
        ],
        [
          /(archos)\s(gamepad2?)/i,
          /(hp).+(touchpad)/i,
          /(hp).+(tablet)/i,
          /(kindle)\/([\w\.]+)/i,
          /\s(nook)[\w\s]+build\/(\w+)/i,
          /(dell)\s(strea[kpr\s\d]*[\dko])/i,
        ],
        ["vendor", "model", ["type", "tablet"]],
        [/(kf[A-z]+)\sbuild\/.+silk\//i],
        ["model", ["vendor", "Amazon"], ["type", "tablet"]],
        [/(sd|kf)[0349hijorstuw]+\sbuild\/.+silk\//i],
        [
          ["model", O.str, pa.device.amazon.model],
          ["vendor", "Amazon"],
          ["type", "mobile"],
        ],
        [/android.+aft([bms])\sbuild/i],
        ["model", ["vendor", "Amazon"], ["type", "smarttv"]],
        [/\((ip[honed|\s\w*]+);.+(apple)/i],
        ["model", "vendor", ["type", "mobile"]],
        [/\((ip[honed|\s\w*]+);/i],
        ["model", ["vendor", "Apple"], ["type", "mobile"]],
        [
          /(blackberry)[\s-]?(\w+)/i,
          /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i,
          /(hp)\s([\w\s]+\w)/i,
          /(asus)-?(\w+)/i,
        ],
        ["vendor", "model", ["type", "mobile"]],
        [/\(bb10;\s(\w+)/i],
        ["model", ["vendor", "BlackBerry"], ["type", "mobile"]],
        [
          /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone|p00c)/i,
        ],
        ["model", ["vendor", "Asus"], ["type", "tablet"]],
        [/(sony)\s(tablet\s[ps])\sbuild\//i, /(sony)?(?:sgp.+)\sbuild\//i],
        [
          ["vendor", "Sony"],
          ["model", "Xperia Tablet"],
          ["type", "tablet"],
        ],
        [
          /android.+\s([c-g]\d{4}|so[-l]\w+)(?=\sbuild\/|\).+chrome\/(?![1-6]{0,1}\d\.))/i,
        ],
        ["model", ["vendor", "Sony"], ["type", "mobile"]],
        [/\s(ouya)\s/i, /(nintendo)\s([wids3u]+)/i],
        ["vendor", "model", ["type", "console"]],
        [/android.+;\s(shield)\sbuild/i],
        ["model", ["vendor", "Nvidia"], ["type", "console"]],
        [/(playstation\s[34portablevi]+)/i],
        ["model", ["vendor", "Sony"], ["type", "console"]],
        [/(sprint\s(\w+))/i],
        [
          ["vendor", O.str, pa.device.sprint.vendor],
          ["model", O.str, pa.device.sprint.model],
          ["type", "mobile"],
        ],
        [
          /(htc)[;_\s-]+([\w\s]+(?=\)|\sbuild)|\w+)/i,
          /(zte)-(\w*)/i,
          /(alcatel|geeksphone|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i,
        ],
        ["vendor", ["model", /_/g, " "], ["type", "mobile"]],
        [/(nexus\s9)/i],
        ["model", ["vendor", "HTC"], ["type", "tablet"]],
        [/d\/huawei([\w\s-]+)[;\)]/i, /(nexus\s6p)/i],
        ["model", ["vendor", "Huawei"], ["type", "mobile"]],
        [/(microsoft);\s(lumia[\s\w]+)/i],
        ["vendor", "model", ["type", "mobile"]],
        [/[\s\(;](xbox(?:\sone)?)[\s\);]/i],
        ["model", ["vendor", "Microsoft"], ["type", "console"]],
        [/(kin\.[onetw]{3})/i],
        [
          ["model", /\./g, " "],
          ["vendor", "Microsoft"],
          ["type", "mobile"],
        ],
        [
          /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i,
          /mot[\s-]?(\w*)/i,
          /(XT\d{3,4}) build\//i,
          /(nexus\s6)/i,
        ],
        ["model", ["vendor", "Motorola"], ["type", "mobile"]],
        [/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],
        ["model", ["vendor", "Motorola"], ["type", "tablet"]],
        [/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i],
        [
          ["vendor", S.trim],
          ["model", S.trim],
          ["type", "smarttv"],
        ],
        [/hbbtv.+maple;(\d+)/i],
        [
          ["model", /^/, "SmartTV"],
          ["vendor", "Samsung"],
          ["type", "smarttv"],
        ],
        [/\(dtv[\);].+(aquos)/i],
        ["model", ["vendor", "Sharp"], ["type", "smarttv"]],
        [
          /android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,
          /((SM-T\w+))/i,
        ],
        [["vendor", "Samsung"], "model", ["type", "tablet"]],
        [/smart-tv.+(samsung)/i],
        ["vendor", ["type", "smarttv"], "model"],
        [
          /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
          /(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i,
          /sec-((sgh\w+))/i,
        ],
        [["vendor", "Samsung"], "model", ["type", "mobile"]],
        [/sie-(\w*)/i],
        ["model", ["vendor", "Siemens"], ["type", "mobile"]],
        [/(maemo|nokia).*(n900|lumia\s\d+)/i, /(nokia)[\s_-]?([\w-]*)/i],
        [["vendor", "Nokia"], "model", ["type", "mobile"]],
        [/android[x\d\.\s;]+\s([ab][1-7]\-?[0178a]\d\d?)/i],
        ["model", ["vendor", "Acer"], ["type", "tablet"]],
        [/android.+([vl]k\-?\d{3})\s+build/i],
        ["model", ["vendor", "LG"], ["type", "tablet"]],
        [/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],
        [["vendor", "LG"], "model", ["type", "tablet"]],
        [/(lg) netcast\.tv/i],
        ["vendor", "model", ["type", "smarttv"]],
        [
          /(nexus\s[45])/i,
          /lg[e;\s\/-]+(\w*)/i,
          /android.+lg(\-?[\d\w]+)\s+build/i,
        ],
        ["model", ["vendor", "LG"], ["type", "mobile"]],
        [/(lenovo)\s?(s(?:5000|6000)(?:[\w-]+)|tab(?:[\s\w]+))/i],
        ["vendor", "model", ["type", "tablet"]],
        [/android.+(ideatab[a-z0-9\-\s]+)/i],
        ["model", ["vendor", "Lenovo"], ["type", "tablet"]],
        [/(lenovo)[_\s-]?([\w-]+)/i],
        ["vendor", "model", ["type", "mobile"]],
        [/linux;.+((jolla));/i],
        ["vendor", "model", ["type", "mobile"]],
        [/((pebble))app\/[\d\.]+\s/i],
        ["vendor", "model", ["type", "wearable"]],
        [/android.+;\s(oppo)\s?([\w\s]+)\sbuild/i],
        ["vendor", "model", ["type", "mobile"]],
        [/crkey/i],
        [
          ["model", "Chromecast"],
          ["vendor", "Google"],
        ],
        [/android.+;\s(glass)\s\d/i],
        ["model", ["vendor", "Google"], ["type", "wearable"]],
        [/android.+;\s(pixel c)[\s)]/i],
        ["model", ["vendor", "Google"], ["type", "tablet"]],
        [/android.+;\s(pixel( [23])?( xl)?)[\s)]/i],
        ["model", ["vendor", "Google"], ["type", "mobile"]],
        [
          /android.+;\s(\w+)\s+build\/hm\1/i,
          /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,
          /android.+(mi[\s\-_]*(?:a\d|one|one[\s_]plus|note lte)?[\s_]*(?:\d?\w?)[\s_]*(?:plus)?)\s+build/i,
          /android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+))\s+build/i,
        ],
        [
          ["model", /_/g, " "],
          ["vendor", "Xiaomi"],
          ["type", "mobile"],
        ],
        [/android.+(mi[\s\-_]*(?:pad)(?:[\s_]*[\w\s]+))\s+build/i],
        [
          ["model", /_/g, " "],
          ["vendor", "Xiaomi"],
          ["type", "tablet"],
        ],
        [/android.+;\s(m[1-5]\snote)\sbuild/i],
        ["model", ["vendor", "Meizu"], ["type", "mobile"]],
        [/(mz)-([\w-]{2,})/i],
        [["vendor", "Meizu"], "model", ["type", "mobile"]],
        [/android.+a000(1)\s+build/i, /android.+oneplus\s(a\d{4})\s+build/i],
        ["model", ["vendor", "OnePlus"], ["type", "mobile"]],
        [/android.+[;\/]\s*(RCT[\d\w]+)\s+build/i],
        ["model", ["vendor", "RCA"], ["type", "tablet"]],
        [/android.+[;\/\s]+(Venue[\d\s]{2,7})\s+build/i],
        ["model", ["vendor", "Dell"], ["type", "tablet"]],
        [/android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i],
        ["model", ["vendor", "Verizon"], ["type", "tablet"]],
        [/android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i],
        [["vendor", "Barnes \x26 Noble"], "model", ["type", "tablet"]],
        [/android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i],
        ["model", ["vendor", "NuVision"], ["type", "tablet"]],
        [/android.+;\s(k88)\sbuild/i],
        ["model", ["vendor", "ZTE"], ["type", "tablet"]],
        [/android.+[;\/]\s*(gen\d{3})\s+build.*49h/i],
        ["model", ["vendor", "Swiss"], ["type", "mobile"]],
        [/android.+[;\/]\s*(zur\d{3})\s+build/i],
        ["model", ["vendor", "Swiss"], ["type", "tablet"]],
        [/android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i],
        ["model", ["vendor", "Zeki"], ["type", "tablet"]],
        [
          /(android).+[;\/]\s+([YR]\d{2})\s+build/i,
          /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i,
        ],
        [["vendor", "Dragon Touch"], "model", ["type", "tablet"]],
        [/android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i],
        ["model", ["vendor", "Insignia"], ["type", "tablet"]],
        [/android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i],
        ["model", ["vendor", "NextBook"], ["type", "tablet"]],
        [
          /android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i,
        ],
        [["vendor", "Voice"], "model", ["type", "mobile"]],
        [/android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i],
        [["vendor", "LvTel"], "model", ["type", "mobile"]],
        [/android.+;\s(PH-1)\s/i],
        ["model", ["vendor", "Essential"], ["type", "mobile"]],
        [/android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i],
        ["model", ["vendor", "Envizen"], ["type", "tablet"]],
        [/android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i],
        ["vendor", "model", ["type", "tablet"]],
        [/android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i],
        ["model", ["vendor", "MachSpeed"], ["type", "tablet"]],
        [/android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i],
        ["vendor", "model", ["type", "tablet"]],
        [/android.+[;\/]\s*TU_(1491)\s+build/i],
        ["model", ["vendor", "Rotor"], ["type", "tablet"]],
        [/android.+(KS(.+))\s+build/i],
        ["model", ["vendor", "Amazon"], ["type", "tablet"]],
        [/android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i],
        ["vendor", "model", ["type", "tablet"]],
        [/\s(tablet|tab)[;\/]/i, /\s(mobile)(?:[;\/]|\ssafari)/i],
        [["type", S.lowerize], "vendor", "model"],
        [/[\s\/\(](smart-?tv)[;\)]/i],
        [["type", "smarttv"]],
        [/(android[\w\.\s\-]{0,9});.+build/i],
        ["model", ["vendor", "Generic"]],
      ],
      engine: [
        [/windows.+\sedge\/([\w\.]+)/i],
        ["version", ["name", "EdgeHTML"]],
        [/webkit\/537\.36.+chrome\/(?!27)/i],
        [["name", "Blink"]],
        [
          /(presto)\/([\w\.]+)/i,
          /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
          /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,
          /(icab)[\/\s]([23]\.[\d\.]+)/i,
        ],
        ["name", "version"],
        [/rv\:([\w\.]{1,9}).+(gecko)/i],
        ["version", "name"],
      ],
      os: [
        [/microsoft\s(windows)\s(vista|xp)/i],
        ["name", "version"],
        [
          /(windows)\snt\s6\.2;\s(arm)/i,
          /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i,
          /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i,
        ],
        ["name", ["version", O.str, pa.os.windows.version]],
        [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],
        [
          ["name", "Windows"],
          ["version", O.str, pa.os.windows.version],
        ],
        [/\((bb)(10);/i],
        [["name", "BlackBerry"], "version"],
        [
          /(blackberry)\w*\/?([\w\.]*)/i,
          /(tizen)[\/\s]([\w\.]+)/i,
          /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|sailfish|contiki)[\/\s-]?([\w\.]*)/i,
        ],
        ["name", "version"],
        [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i],
        [["name", "Symbian"], "version"],
        [/\((series40);/i],
        ["name"],
        [/mozilla.+\(mobile;.+gecko.+firefox/i],
        [["name", "Firefox OS"], "version"],
        [
          /(nintendo|playstation)\s([wids34portablevu]+)/i,
          /(mint)[\/\s\(]?(\w*)/i,
          /(mageia|vectorlinux)[;\s]/i,
          /(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i,
          /(hurd|linux)\s?([\w\.]*)/i,
          /(gnu)\s?([\w\.]*)/i,
        ],
        ["name", "version"],
        [/(cros)\s[\w]+\s([\w\.]+\w)/i],
        [["name", "Chromium OS"], "version"],
        [/(sunos)\s?([\w\.\d]*)/i],
        [["name", "Solaris"], "version"],
        [/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i],
        ["name", "version"],
        [/(haiku)\s(\w+)/i],
        ["name", "version"],
        [
          /cfnetwork\/.+darwin/i,
          /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i,
        ],
        [
          ["version", /_/g, "."],
          ["name", "iOS"],
        ],
        [/(mac\sos\sx)\s?([\w\s\.]*)/i, /(macintosh|mac(?=_powerpc)\s)/i],
        [
          ["name", "Mac OS"],
          ["version", /_/g, "."],
        ],
        [
          /((?:open)?solaris)[\/\s-]?([\w\.]*)/i,
          /(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i,
          /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i,
          /(unix)\s?([\w\.]*)/i,
        ],
        ["name", "version"],
      ],
    };
  L.VERSION = "0.7.20";
  L.BROWSER = { NAME: "name", MAJOR: "major", VERSION: "version" };
  L.CPU = { ARCHITECTURE: "architecture" };
  L.DEVICE = {
    MODEL: "model",
    VENDOR: "vendor",
    TYPE: "type",
    CONSOLE: "console",
    MOBILE: "mobile",
    SMARTTV: "smarttv",
    TABLET: "tablet",
    WEARABLE: "wearable",
    EMBEDDED: "embedded",
  };
  L.ENGINE = { NAME: "name", VERSION: "version" };
  L.OS = { NAME: "name", VERSION: "version" };
  "undefined" !== typeof exports
    ? ("undefined" !== typeof module &&
        module.exports &&
        (exports = module.exports = L),
      (exports.UAParser = L))
    : "function" === typeof define && define.amd
    ? define(function () {
        return L;
      })
    : W && (W.UAParser = L);
  var qa = W && (W.jQuery || W.Zepto);
  if ("undefined" !== typeof qa && !qa.ua) {
    var ab = new L();
    qa.ua = ab.getResult();
    qa.ua.get = function () {
      return ab.getUA();
    };
    qa.ua.set = function (a) {
      ab.setUA(a);
      a = ab.getResult();
      for (var b in a) qa.ua[b] = a[b];
    };
  }
  var Eb;
  if (!(Eb = N)) {
    var Aa = Math,
      bb = {},
      cb = (bb.lib = {}),
      lc = function () {},
      Ba = (cb.Base = {
        extend: function (a) {
          lc.prototype = this;
          var b = new lc();
          a && b.mixIn(a);
          b.hasOwnProperty("init") ||
            (b.init = function () {
              b.$super.init.apply(this, arguments);
            });
          b.init.prototype = b;
          b.$super = this;
          return b;
        },
        create: function () {
          var a = this.extend();
          a.init.apply(a, arguments);
          return a;
        },
        init: function () {},
        mixIn: function (a) {
          for (var b in a) a.hasOwnProperty(b) && (this[b] = a[b]);
          a.hasOwnProperty("toString") && (this.toString = a.toString);
        },
        clone: function () {
          return this.init.prototype.extend(this);
        },
      }),
      Ca = (cb.WordArray = Ba.extend({
        init: function (a, b) {
          a = this.words = a || [];
          this.sigBytes = void 0 != b ? b : 4 * a.length;
        },
        toString: function (a) {
          return (a || Uc).stringify(this);
        },
        concat: function (a) {
          var b = this.words,
            c = a.words,
            d = this.sigBytes;
          a = a.sigBytes;
          this.clamp();
          if (d % 4)
            for (var e = 0; e < a; e++)
              b[(d + e) >>> 2] |=
                ((c[e >>> 2] >>> (24 - (e % 4) * 8)) & 255) <<
                (24 - ((d + e) % 4) * 8);
          else if (65535 < c.length)
            for (e = 0; e < a; e += 4) b[(d + e) >>> 2] = c[e >>> 2];
          else b.push.apply(b, c);
          this.sigBytes += a;
          return this;
        },
        clamp: function () {
          var a = this.words,
            b = this.sigBytes;
          a[b >>> 2] &= 4294967295 << (32 - (b % 4) * 8);
          a.length = Aa.ceil(b / 4);
        },
        clone: function () {
          var a = Ba.clone.call(this);
          a.words = this.words.slice(0);
          return a;
        },
        random: function (a) {
          for (var b = [], c = 0; c < a; c += 4)
            b.push((4294967296 * Aa.random()) | 0);
          return new Ca.init(b, a);
        },
      })),
      Fb = (bb.enc = {}),
      Uc = (Fb.Hex = {
        stringify: function (a) {
          var b = a.words;
          a = a.sigBytes;
          for (var c = [], d = 0; d < a; d++) {
            var e = (b[d >>> 2] >>> (24 - (d % 4) * 8)) & 255;
            c.push((e >>> 4).toString(16));
            c.push((e & 15).toString(16));
          }
          return c.join("");
        },
        parse: function (a) {
          for (var b = a.length, c = [], d = 0; d < b; d += 2)
            c[d >>> 3] |= parseInt(a.substr(d, 2), 16) << (24 - (d % 8) * 4);
          return new Ca.init(c, b / 2);
        },
      }),
      mc = (Fb.Latin1 = {
        stringify: function (a) {
          var b = a.words;
          a = a.sigBytes;
          for (var c = [], d = 0; d < a; d++)
            c.push(
              String.fromCharCode((b[d >>> 2] >>> (24 - (d % 4) * 8)) & 255)
            );
          return c.join("");
        },
        parse: function (a) {
          for (var b = a.length, c = [], d = 0; d < b; d++)
            c[d >>> 2] |= (a.charCodeAt(d) & 255) << (24 - (d % 4) * 8);
          return new Ca.init(c, b);
        },
      }),
      Vc = (Fb.Utf8 = {
        stringify: function (a) {
          try {
            return decodeURIComponent(escape(mc.stringify(a)));
          } catch (b) {
            throw Error("Malformed UTF-8 data");
          }
        },
        parse: function (a) {
          return mc.parse(unescape(encodeURIComponent(a)));
        },
      }),
      nc = (cb.BufferedBlockAlgorithm = Ba.extend({
        reset: function () {
          this._data = new Ca.init();
          this._nDataBytes = 0;
        },
        _append: function (a) {
          "string" == typeof a && (a = Vc.parse(a));
          this._data.concat(a);
          this._nDataBytes += a.sigBytes;
        },
        _process: function (a) {
          var b = this._data,
            c = b.words,
            d = b.sigBytes,
            e = this.blockSize,
            f = d / (4 * e),
            f = a ? Aa.ceil(f) : Aa.max((f | 0) - this._minBufferSize, 0);
          a = f * e;
          d = Aa.min(4 * a, d);
          if (a) {
            for (var g = 0; g < a; g += e) this._doProcessBlock(c, g);
            g = c.splice(0, a);
            b.sigBytes -= d;
          }
          return new Ca.init(g, d);
        },
        clone: function () {
          var a = Ba.clone.call(this);
          a._data = this._data.clone();
          return a;
        },
        _minBufferSize: 0,
      }));
    cb.Hasher = nc.extend({
      cfg: Ba.extend(),
      init: function (a) {
        this.cfg = this.cfg.extend(a);
        this.reset();
      },
      reset: function () {
        nc.reset.call(this);
        this._doReset();
      },
      update: function (a) {
        this._append(a);
        this._process();
        return this;
      },
      finalize: function (a) {
        a && this._append(a);
        return this._doFinalize();
      },
      blockSize: 16,
      _createHelper: function (a) {
        return function (b, c) {
          return new a.init(c).finalize(b);
        };
      },
      _createHmacHelper: function (a) {
        return function (b, c) {
          return new Wc.HMAC.init(a, c).finalize(b);
        };
      },
    });
    var Wc = (bb.algo = {});
    Eb = bb;
  }
  for (
    var N = Eb,
      db = Math,
      eb = N,
      ha = eb.lib,
      Xc = ha.WordArray,
      fb = ha.Hasher,
      ha = eb.algo,
      oc = [],
      pc = [],
      gb = 2,
      Da = 0;
    64 > Da;

  ) {
    var ra;
    a: {
      ra = gb;
      for (var Yc = db.sqrt(ra), Gb = 2; Gb <= Yc; Gb++)
        if (!(ra % Gb)) {
          ra = !1;
          break a;
        }
      ra = !0;
    }
    ra &&
      (8 > Da && (oc[Da] = Xb(db.pow(gb, 0.5))),
      (pc[Da] = Xb(db.pow(gb, 1 / 3))),
      Da++);
    gb++;
  }
  var ia = [],
    ha = (ha.SHA256 = fb.extend({
      _doReset: function () {
        this._hash = new Xc.init(oc.slice(0));
      },
      _doProcessBlock: function (a, b) {
        for (
          var c = this._hash.words,
            d = c[0],
            e = c[1],
            f = c[2],
            g = c[3],
            h = c[4],
            u = c[5],
            n = c[6],
            v = c[7],
            p = 0;
          64 > p;
          p++
        ) {
          if (16 > p) ia[p] = a[b + p] | 0;
          else {
            var m = ia[p - 15],
              q = ia[p - 2];
            ia[p] =
              (((m << 25) | (m >>> 7)) ^ ((m << 14) | (m >>> 18)) ^ (m >>> 3)) +
              ia[p - 7] +
              (((q << 15) | (q >>> 17)) ^
                ((q << 13) | (q >>> 19)) ^
                (q >>> 10)) +
              ia[p - 16];
          }
          m =
            v +
            (((h << 26) | (h >>> 6)) ^
              ((h << 21) | (h >>> 11)) ^
              ((h << 7) | (h >>> 25))) +
            ((h & u) ^ (~h & n)) +
            pc[p] +
            ia[p];
          q =
            (((d << 30) | (d >>> 2)) ^
              ((d << 19) | (d >>> 13)) ^
              ((d << 10) | (d >>> 22))) +
            ((d & e) ^ (d & f) ^ (e & f));
          v = n;
          n = u;
          u = h;
          h = (g + m) | 0;
          g = f;
          f = e;
          e = d;
          d = (m + q) | 0;
        }
        c[0] = (c[0] + d) | 0;
        c[1] = (c[1] + e) | 0;
        c[2] = (c[2] + f) | 0;
        c[3] = (c[3] + g) | 0;
        c[4] = (c[4] + h) | 0;
        c[5] = (c[5] + u) | 0;
        c[6] = (c[6] + n) | 0;
        c[7] = (c[7] + v) | 0;
      },
      _doFinalize: function () {
        var a = this._data,
          b = a.words,
          c = 8 * this._nDataBytes,
          d = 8 * a.sigBytes;
        b[d >>> 5] |= 128 << (24 - (d % 32));
        b[(((d + 64) >>> 9) << 4) + 14] = db.floor(c / 4294967296);
        b[(((d + 64) >>> 9) << 4) + 15] = c;
        a.sigBytes = 4 * b.length;
        this._process();
        return this._hash;
      },
      clone: function () {
        var a = fb.clone.call(this);
        a._hash = this._hash.clone();
        return a;
      },
    }));
  eb.SHA256 = fb._createHelper(ha);
  eb.HmacSHA256 = fb._createHmacHelper(ha);
  var qc = N,
    Zc = qc.lib.WordArray;
  qc.enc.Base64 = {
    stringify: function (a) {
      var b = a.words,
        c = a.sigBytes,
        d = this._map;
      a.clamp();
      a = [];
      for (var e = 0; e < c; e += 3)
        for (
          var f =
              (((b[e >>> 2] >>> (24 - (e % 4) * 8)) & 255) << 16) |
              (((b[(e + 1) >>> 2] >>> (24 - ((e + 1) % 4) * 8)) & 255) << 8) |
              ((b[(e + 2) >>> 2] >>> (24 - ((e + 2) % 4) * 8)) & 255),
            g = 0;
          4 > g && e + 0.75 * g < c;
          g++
        )
          a.push(d.charAt((f >>> (6 * (3 - g))) & 63));
      if ((b = d.charAt(64))) for (; a.length % 4; ) a.push(b);
      return a.join("");
    },
    parse: function (a) {
      var b = a.length,
        c = this._map,
        d = c.charAt(64);
      d && ((d = a.indexOf(d)), -1 != d && (b = d));
      for (var d = [], e = 0, f = 0; f < b; f++)
        if (f % 4) {
          var g = c.indexOf(a.charAt(f - 1)) << ((f % 4) * 2),
            h = c.indexOf(a.charAt(f)) >>> (6 - (f % 4) * 2);
          d[e >>> 2] |= (g | h) << (24 - (e % 4) * 8);
          e++;
        }
      return Zc.create(d, e);
    },
    _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  };
  for (
    var Hb = Math,
      hb = N,
      ja = hb.lib,
      $c = ja.WordArray,
      ib = ja.Hasher,
      ja = hb.algo,
      l = [],
      jb = 0;
    64 > jb;
    jb++
  )
    l[jb] = (4294967296 * Hb.abs(Hb.sin(jb + 1))) | 0;
  ja = ja.MD5 = ib.extend({
    _doReset: function () {
      this._hash = new $c.init([1732584193, 4023233417, 2562383102, 271733878]);
    },
    _doProcessBlock: function (a, b) {
      for (var c = 0; 16 > c; c++) {
        var d = b + c,
          e = a[d];
        a[d] =
          (((e << 8) | (e >>> 24)) & 16711935) |
          (((e << 24) | (e >>> 8)) & 4278255360);
      }
      var c = this._hash.words,
        d = a[b + 0],
        e = a[b + 1],
        f = a[b + 2],
        g = a[b + 3],
        h = a[b + 4],
        u = a[b + 5],
        n = a[b + 6],
        v = a[b + 7],
        p = a[b + 8],
        m = a[b + 9],
        q = a[b + 10],
        w = a[b + 11],
        x = a[b + 12],
        y = a[b + 13],
        A = a[b + 14];
      a = a[b + 15];
      b = c[0];
      var r = c[1],
        t = c[2],
        k = c[3];
      b = H(b, r, t, k, d, 7, l[0]);
      k = H(k, b, r, t, e, 12, l[1]);
      t = H(t, k, b, r, f, 17, l[2]);
      r = H(r, t, k, b, g, 22, l[3]);
      b = H(b, r, t, k, h, 7, l[4]);
      k = H(k, b, r, t, u, 12, l[5]);
      t = H(t, k, b, r, n, 17, l[6]);
      r = H(r, t, k, b, v, 22, l[7]);
      b = H(b, r, t, k, p, 7, l[8]);
      k = H(k, b, r, t, m, 12, l[9]);
      t = H(t, k, b, r, q, 17, l[10]);
      r = H(r, t, k, b, w, 22, l[11]);
      b = H(b, r, t, k, x, 7, l[12]);
      k = H(k, b, r, t, y, 12, l[13]);
      t = H(t, k, b, r, A, 17, l[14]);
      r = H(r, t, k, b, a, 22, l[15]);
      b = G(b, r, t, k, e, 5, l[16]);
      k = G(k, b, r, t, n, 9, l[17]);
      t = G(t, k, b, r, w, 14, l[18]);
      r = G(r, t, k, b, d, 20, l[19]);
      b = G(b, r, t, k, u, 5, l[20]);
      k = G(k, b, r, t, q, 9, l[21]);
      t = G(t, k, b, r, a, 14, l[22]);
      r = G(r, t, k, b, h, 20, l[23]);
      b = G(b, r, t, k, m, 5, l[24]);
      k = G(k, b, r, t, A, 9, l[25]);
      t = G(t, k, b, r, g, 14, l[26]);
      r = G(r, t, k, b, p, 20, l[27]);
      b = G(b, r, t, k, y, 5, l[28]);
      k = G(k, b, r, t, f, 9, l[29]);
      t = G(t, k, b, r, v, 14, l[30]);
      r = G(r, t, k, b, x, 20, l[31]);
      b = F(b, r, t, k, u, 4, l[32]);
      k = F(k, b, r, t, p, 11, l[33]);
      t = F(t, k, b, r, w, 16, l[34]);
      r = F(r, t, k, b, A, 23, l[35]);
      b = F(b, r, t, k, e, 4, l[36]);
      k = F(k, b, r, t, h, 11, l[37]);
      t = F(t, k, b, r, v, 16, l[38]);
      r = F(r, t, k, b, q, 23, l[39]);
      b = F(b, r, t, k, y, 4, l[40]);
      k = F(k, b, r, t, d, 11, l[41]);
      t = F(t, k, b, r, g, 16, l[42]);
      r = F(r, t, k, b, n, 23, l[43]);
      b = F(b, r, t, k, m, 4, l[44]);
      k = F(k, b, r, t, x, 11, l[45]);
      t = F(t, k, b, r, a, 16, l[46]);
      r = F(r, t, k, b, f, 23, l[47]);
      b = E(b, r, t, k, d, 6, l[48]);
      k = E(k, b, r, t, v, 10, l[49]);
      t = E(t, k, b, r, A, 15, l[50]);
      r = E(r, t, k, b, u, 21, l[51]);
      b = E(b, r, t, k, x, 6, l[52]);
      k = E(k, b, r, t, g, 10, l[53]);
      t = E(t, k, b, r, q, 15, l[54]);
      r = E(r, t, k, b, e, 21, l[55]);
      b = E(b, r, t, k, p, 6, l[56]);
      k = E(k, b, r, t, a, 10, l[57]);
      t = E(t, k, b, r, n, 15, l[58]);
      r = E(r, t, k, b, y, 21, l[59]);
      b = E(b, r, t, k, h, 6, l[60]);
      k = E(k, b, r, t, w, 10, l[61]);
      t = E(t, k, b, r, f, 15, l[62]);
      r = E(r, t, k, b, m, 21, l[63]);
      c[0] = (c[0] + b) | 0;
      c[1] = (c[1] + r) | 0;
      c[2] = (c[2] + t) | 0;
      c[3] = (c[3] + k) | 0;
    },
    _doFinalize: function () {
      var a = this._data,
        b = a.words,
        c = 8 * this._nDataBytes,
        d = 8 * a.sigBytes;
      b[d >>> 5] |= 128 << (24 - (d % 32));
      var e = Hb.floor(c / 4294967296);
      b[(((d + 64) >>> 9) << 4) + 15] =
        (((e << 8) | (e >>> 24)) & 16711935) |
        (((e << 24) | (e >>> 8)) & 4278255360);
      b[(((d + 64) >>> 9) << 4) + 14] =
        (((c << 8) | (c >>> 24)) & 16711935) |
        (((c << 24) | (c >>> 8)) & 4278255360);
      a.sigBytes = 4 * (b.length + 1);
      this._process();
      a = this._hash;
      b = a.words;
      for (c = 0; 4 > c; c++)
        (d = b[c]),
          (b[c] =
            (((d << 8) | (d >>> 24)) & 16711935) |
            (((d << 24) | (d >>> 8)) & 4278255360));
      return a;
    },
    clone: function () {
      var a = ib.clone.call(this);
      a._hash = this._hash.clone();
      return a;
    },
  });
  hb.MD5 = ib._createHelper(ja);
  hb.HmacMD5 = ib._createHmacHelper(ja);
  var Ib = N,
    Ea = Ib.lib,
    rc = Ea.Base,
    ad = Ea.WordArray,
    Ea = Ib.algo,
    bd = (Ea.EvpKDF = rc.extend({
      cfg: rc.extend({ keySize: 4, hasher: Ea.MD5, iterations: 1 }),
      init: function (a) {
        this.cfg = this.cfg.extend(a);
      },
      compute: function (a, b) {
        for (
          var c = this.cfg,
            d = c.hasher.create(),
            e = ad.create(),
            f = e.words,
            g = c.keySize,
            c = c.iterations;
          f.length < g;

        ) {
          h && d.update(h);
          var h = d.update(a).finalize(b);
          d.reset();
          for (var u = 1; u < c; u++) (h = d.finalize(h)), d.reset();
          e.concat(h);
        }
        e.sigBytes = 4 * g;
        return e;
      },
    }));
  Ib.EvpKDF = function (a, b, c) {
    return bd.create(c).compute(a, b);
  };
  if (!N.lib.Cipher) {
    var Y = N,
      U = Y.lib,
      Fa = U.Base,
      Ga = U.WordArray,
      sc = U.BufferedBlockAlgorithm,
      tc = Y.enc.Base64,
      cd = Y.algo.EvpKDF,
      kb = (U.Cipher = sc.extend({
        cfg: Fa.extend(),
        createEncryptor: function (a, b) {
          return this.create(this._ENC_XFORM_MODE, a, b);
        },
        createDecryptor: function (a, b) {
          return this.create(this._DEC_XFORM_MODE, a, b);
        },
        init: function (a, b, c) {
          this.cfg = this.cfg.extend(c);
          this._xformMode = a;
          this._key = b;
          this.reset();
        },
        reset: function () {
          sc.reset.call(this);
          this._doReset();
        },
        process: function (a) {
          this._append(a);
          return this._process();
        },
        finalize: function (a) {
          a && this._append(a);
          return this._doFinalize();
        },
        keySize: 4,
        ivSize: 4,
        _ENC_XFORM_MODE: 1,
        _DEC_XFORM_MODE: 2,
        _createHelper: function (a) {
          return {
            encrypt: function (b, c, d) {
              return ("string" == typeof c ? uc : sa).encrypt(a, b, c, d);
            },
            decrypt: function (b, c, d) {
              return ("string" == typeof c ? uc : sa).decrypt(a, b, c, d);
            },
          };
        },
      }));
    U.StreamCipher = kb.extend({
      _doFinalize: function () {
        return this._process(!0);
      },
      blockSize: 1,
    });
    var Ha = (Y.mode = {}),
      vc = function (a, b, c) {
        var d = this._iv;
        d ? (this._iv = void 0) : (d = this._prevBlock);
        for (var e = 0; e < c; e++) a[b + e] ^= d[e];
      },
      ka = (U.BlockCipherMode = Fa.extend({
        createEncryptor: function (a, b) {
          return this.Encryptor.create(a, b);
        },
        createDecryptor: function (a, b) {
          return this.Decryptor.create(a, b);
        },
        init: function (a, b) {
          this._cipher = a;
          this._iv = b;
        },
      })).extend();
    ka.Encryptor = ka.extend({
      processBlock: function (a, b) {
        var c = this._cipher,
          d = c.blockSize;
        vc.call(this, a, b, d);
        c.encryptBlock(a, b);
        this._prevBlock = a.slice(b, b + d);
      },
    });
    ka.Decryptor = ka.extend({
      processBlock: function (a, b) {
        var c = this._cipher,
          d = c.blockSize,
          e = a.slice(b, b + d);
        c.decryptBlock(a, b);
        vc.call(this, a, b, d);
        this._prevBlock = e;
      },
    });
    Ha = Ha.CBC = ka;
    ka = (Y.pad = {}).Pkcs7 = {
      pad: function (a, b) {
        b *= 4;
        b -= a.sigBytes % b;
        for (
          var c = (b << 24) | (b << 16) | (b << 8) | b, d = [], e = 0;
          e < b;
          e += 4
        )
          d.push(c);
        b = Ga.create(d, b);
        a.concat(b);
      },
      unpad: function (a) {
        a.sigBytes -= a.words[(a.sigBytes - 1) >>> 2] & 255;
      },
    };
    U.BlockCipher = kb.extend({
      cfg: kb.cfg.extend({ mode: Ha, padding: ka }),
      reset: function () {
        kb.reset.call(this);
        var a = this.cfg,
          b = a.iv,
          a = a.mode;
        if (this._xformMode == this._ENC_XFORM_MODE) var c = a.createEncryptor;
        else (c = a.createDecryptor), (this._minBufferSize = 1);
        this._mode = c.call(a, this, b && b.words);
      },
      _doProcessBlock: function (a, b) {
        this._mode.processBlock(a, b);
      },
      _doFinalize: function () {
        var a = this.cfg.padding;
        if (this._xformMode == this._ENC_XFORM_MODE) {
          a.pad(this._data, this.blockSize);
          var b = this._process(!0);
        } else (b = this._process(!0)), a.unpad(b);
        return b;
      },
      blockSize: 4,
    });
    var Jb = (U.CipherParams = Fa.extend({
        init: function (a) {
          this.mixIn(a);
        },
        toString: function (a) {
          return (a || this.formatter).stringify(this);
        },
      })),
      Ha = ((Y.format = {}).OpenSSL = {
        stringify: function (a) {
          var b = a.ciphertext;
          a = a.salt;
          return (
            a ? Ga.create([1398893684, 1701076831]).concat(a).concat(b) : b
          ).toString(tc);
        },
        parse: function (a) {
          a = tc.parse(a);
          var b = a.words;
          if (1398893684 == b[0] && 1701076831 == b[1]) {
            var c = Ga.create(b.slice(2, 4));
            b.splice(0, 4);
            a.sigBytes -= 16;
          }
          return Jb.create({ ciphertext: a, salt: c });
        },
      }),
      sa = (U.SerializableCipher = Fa.extend({
        cfg: Fa.extend({ format: Ha }),
        encrypt: function (a, b, c, d) {
          d = this.cfg.extend(d);
          var e = a.createEncryptor(c, d);
          b = e.finalize(b);
          e = e.cfg;
          return Jb.create({
            ciphertext: b,
            key: c,
            iv: e.iv,
            algorithm: a,
            mode: e.mode,
            padding: e.padding,
            blockSize: a.blockSize,
            formatter: d.format,
          });
        },
        decrypt: function (a, b, c, d) {
          d = this.cfg.extend(d);
          b = this._parse(b, d.format);
          return a.createDecryptor(c, d).finalize(b.ciphertext);
        },
        _parse: function (a, b) {
          return "string" == typeof a ? b.parse(a, this) : a;
        },
      })),
      Y = ((Y.kdf = {}).OpenSSL = {
        execute: function (a, b, c, d) {
          d || (d = Ga.random(8));
          a = cd.create({ keySize: b + c }).compute(a, d);
          c = Ga.create(a.words.slice(b), 4 * c);
          a.sigBytes = 4 * b;
          return Jb.create({ key: a, iv: c, salt: d });
        },
      }),
      uc = (U.PasswordBasedCipher = sa.extend({
        cfg: sa.cfg.extend({ kdf: Y }),
        encrypt: function (a, b, c, d) {
          d = this.cfg.extend(d);
          c = d.kdf.execute(c, a.keySize, a.ivSize);
          d.iv = c.iv;
          a = sa.encrypt.call(this, a, b, c.key, d);
          a.mixIn(c);
          return a;
        },
        decrypt: function (a, b, c, d) {
          d = this.cfg.extend(d);
          b = this._parse(b, d.format);
          c = d.kdf.execute(c, a.keySize, a.ivSize, b.salt);
          d.iv = c.iv;
          return sa.decrypt.call(this, a, b, c.key, d);
        },
      }));
  }
  for (
    var Kb = N,
      wc = Kb.lib.BlockCipher,
      Lb = Kb.algo,
      K = [],
      xc = [],
      yc = [],
      zc = [],
      Ac = [],
      Bc = [],
      Mb = [],
      Nb = [],
      Ob = [],
      Pb = [],
      V = [],
      Z = 0;
    256 > Z;
    Z++
  )
    V[Z] = 128 > Z ? Z << 1 : (Z << 1) ^ 283;
  for (var Q = 0, da = 0, Z = 0; 256 > Z; Z++) {
    var R = da ^ (da << 1) ^ (da << 2) ^ (da << 3) ^ (da << 4),
      R = (R >>> 8) ^ (R & 255) ^ 99;
    K[Q] = R;
    xc[R] = Q;
    var lb = V[Q],
      Cc = V[lb],
      Dc = V[Cc],
      J = (257 * V[R]) ^ (16843008 * R);
    yc[Q] = (J << 24) | (J >>> 8);
    zc[Q] = (J << 16) | (J >>> 16);
    Ac[Q] = (J << 8) | (J >>> 24);
    Bc[Q] = J;
    J = (16843009 * Dc) ^ (65537 * Cc) ^ (257 * lb) ^ (16843008 * Q);
    Mb[R] = (J << 24) | (J >>> 8);
    Nb[R] = (J << 16) | (J >>> 16);
    Ob[R] = (J << 8) | (J >>> 24);
    Pb[R] = J;
    Q ? ((Q = lb ^ V[V[V[Dc ^ lb]]]), (da ^= V[V[da]])) : (Q = da = 1);
  }
  var dd = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
    Lb = (Lb.AES = wc.extend({
      _doReset: function () {
        for (
          var a = this._key,
            b = a.words,
            c = a.sigBytes / 4,
            a = 4 * ((this._nRounds = c + 6) + 1),
            d = (this._keySchedule = []),
            e = 0;
          e < a;
          e++
        )
          if (e < c) d[e] = b[e];
          else {
            var f = d[e - 1];
            e % c
              ? 6 < c &&
                4 == e % c &&
                (f =
                  (K[f >>> 24] << 24) |
                  (K[(f >>> 16) & 255] << 16) |
                  (K[(f >>> 8) & 255] << 8) |
                  K[f & 255])
              : ((f = (f << 8) | (f >>> 24)),
                (f =
                  (K[f >>> 24] << 24) |
                  (K[(f >>> 16) & 255] << 16) |
                  (K[(f >>> 8) & 255] << 8) |
                  K[f & 255]),
                (f ^= dd[(e / c) | 0] << 24));
            d[e] = d[e - c] ^ f;
          }
        b = this._invKeySchedule = [];
        for (c = 0; c < a; c++)
          (e = a - c),
            (f = c % 4 ? d[e] : d[e - 4]),
            (b[c] =
              4 > c || 4 >= e
                ? f
                : Mb[K[f >>> 24]] ^
                  Nb[K[(f >>> 16) & 255]] ^
                  Ob[K[(f >>> 8) & 255]] ^
                  Pb[K[f & 255]]);
      },
      encryptBlock: function (a, b) {
        this._doCryptBlock(a, b, this._keySchedule, yc, zc, Ac, Bc, K);
      },
      decryptBlock: function (a, b) {
        var c = a[b + 1];
        a[b + 1] = a[b + 3];
        a[b + 3] = c;
        this._doCryptBlock(a, b, this._invKeySchedule, Mb, Nb, Ob, Pb, xc);
        c = a[b + 1];
        a[b + 1] = a[b + 3];
        a[b + 3] = c;
      },
      _doCryptBlock: function (a, b, c, d, e, f, g, h) {
        for (
          var u = this._nRounds,
            n = a[b] ^ c[0],
            v = a[b + 1] ^ c[1],
            p = a[b + 2] ^ c[2],
            m = a[b + 3] ^ c[3],
            q = 4,
            l = 1;
          l < u;
          l++
        )
          var w =
              d[n >>> 24] ^
              e[(v >>> 16) & 255] ^
              f[(p >>> 8) & 255] ^
              g[m & 255] ^
              c[q++],
            x =
              d[v >>> 24] ^
              e[(p >>> 16) & 255] ^
              f[(m >>> 8) & 255] ^
              g[n & 255] ^
              c[q++],
            y =
              d[p >>> 24] ^
              e[(m >>> 16) & 255] ^
              f[(n >>> 8) & 255] ^
              g[v & 255] ^
              c[q++],
            m =
              d[m >>> 24] ^
              e[(n >>> 16) & 255] ^
              f[(v >>> 8) & 255] ^
              g[p & 255] ^
              c[q++],
            n = w,
            v = x,
            p = y;
        w =
          ((h[n >>> 24] << 24) |
            (h[(v >>> 16) & 255] << 16) |
            (h[(p >>> 8) & 255] << 8) |
            h[m & 255]) ^
          c[q++];
        x =
          ((h[v >>> 24] << 24) |
            (h[(p >>> 16) & 255] << 16) |
            (h[(m >>> 8) & 255] << 8) |
            h[n & 255]) ^
          c[q++];
        y =
          ((h[p >>> 24] << 24) |
            (h[(m >>> 16) & 255] << 16) |
            (h[(n >>> 8) & 255] << 8) |
            h[v & 255]) ^
          c[q++];
        m =
          ((h[m >>> 24] << 24) |
            (h[(n >>> 16) & 255] << 16) |
            (h[(v >>> 8) & 255] << 8) |
            h[p & 255]) ^
          c[q++];
        a[b] = w;
        a[b + 1] = x;
        a[b + 2] = y;
        a[b + 3] = m;
      },
      keySize: 8,
    }));
  Kb.AES = wc._createHelper(Lb);
  (function (a) {
    "object" === typeof exports && "undefined" !== typeof module
      ? (module.exports = a())
      : "function" === typeof define && define.amd
      ? define([], a)
      : (("undefined" !== typeof window
          ? window
          : "undefined" !== typeof global
          ? global
          : "undefined" !== typeof self
          ? self
          : this
        ).base64js = a());
  })(function () {
    return (function b(c, d, e) {
      function f(h, n) {
        if (!d[h]) {
          if (!c[h]) {
            var v = "function" == typeof require && require;
            if (!n && v) return v(h, !0);
            if (g) return g(h, !0);
            n = Error("Cannot find module '" + h + "'");
            throw ((n.code = "MODULE_NOT_FOUND"), n);
          }
          n = d[h] = { exports: {} };
          c[h][0].call(
            n.exports,
            function (b) {
              var d = c[h][1][b];
              return f(d ? d : b);
            },
            n,
            n.exports,
            b,
            c,
            d,
            e
          );
        }
        return d[h].exports;
      }
      for (
        var g = "function" == typeof require && require, h = 0;
        h < e.length;
        h++
      )
        f(e[h]);
      return f;
    })(
      {
        "/": [
          function (b, c, d) {
            function e(b) {
              var c = b.length;
              if (0 < c % 4)
                throw Error("Invalid string. Length must be a multiple of 4");
              return "\x3d" === b[c - 2] ? 2 : "\x3d" === b[c - 1] ? 1 : 0;
            }
            function f(b, c, d) {
              for (var e = [], f = c; f < d; f += 3)
                (c = (b[f] << 16) + (b[f + 1] << 8) + b[f + 2]),
                  e.push(
                    g[(c >> 18) & 63] +
                      g[(c >> 12) & 63] +
                      g[(c >> 6) & 63] +
                      g[c & 63]
                  );
              return e.join("");
            }
            d.byteLength = function (b) {
              return (3 * b.length) / 4 - e(b);
            };
            d.toByteArray = function (b) {
              var c, d, f, g, n;
              c = b.length;
              g = e(b);
              n = new u((3 * c) / 4 - g);
              d = 0 < g ? c - 4 : c;
              var l = 0;
              for (c = 0; c < d; c += 4)
                (f =
                  (h[b.charCodeAt(c)] << 18) |
                  (h[b.charCodeAt(c + 1)] << 12) |
                  (h[b.charCodeAt(c + 2)] << 6) |
                  h[b.charCodeAt(c + 3)]),
                  (n[l++] = (f >> 16) & 255),
                  (n[l++] = (f >> 8) & 255),
                  (n[l++] = f & 255);
              2 === g
                ? ((f =
                    (h[b.charCodeAt(c)] << 2) | (h[b.charCodeAt(c + 1)] >> 4)),
                  (n[l++] = f & 255))
                : 1 === g &&
                  ((f =
                    (h[b.charCodeAt(c)] << 10) |
                    (h[b.charCodeAt(c + 1)] << 4) |
                    (h[b.charCodeAt(c + 2)] >> 2)),
                  (n[l++] = (f >> 8) & 255),
                  (n[l++] = f & 255));
              return n;
            };
            d.fromByteArray = function (b) {
              for (
                var c = b.length, d = c % 3, e = "", h = [], n = 0, u = c - d;
                n < u;
                n += 16383
              )
                h.push(f(b, n, n + 16383 > u ? u : n + 16383));
              1 === d
                ? ((b = b[c - 1]),
                  (e += g[b >> 2]),
                  (e += g[(b << 4) & 63]),
                  (e += "\x3d\x3d"))
                : 2 === d &&
                  ((b = (b[c - 2] << 8) + b[c - 1]),
                  (e += g[b >> 10]),
                  (e += g[(b >> 4) & 63]),
                  (e += g[(b << 2) & 63]),
                  (e += "\x3d"));
              h.push(e);
              return h.join("");
            };
            var g = [],
              h = [],
              u = "undefined" !== typeof Uint8Array ? Uint8Array : Array;
            for (b = 0; 64 > b; ++b)
              (g[b] =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
                  b
                ]),
                (h[
                  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charCodeAt(
                    b
                  )
                ] = b);
            h[45] = 62;
            h[95] = 63;
          },
          {},
        ],
      },
      {},
      []
    )("/");
  });
  "function" != typeof Array.prototype.map &&
    (Array.prototype.map = function (a, b) {
      var c = [];
      if ("function" === typeof a)
        for (var d = 0, e = this.length; d < e; d++)
          c.push(a.call(b, this[d], d, this));
      return c;
    });
  "function" !== typeof String.prototype.trim &&
    (String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, "");
    });
  ob(null, null, "download");
  void 0 != Va("fp_ver") && Wa("fp_ver", "", -1, !1);
  var ta = 0;
  try {
    localStorage.length || ((localStorage.x = 1), localStorage.removeItem("x"));
  } catch (a) {
    ta = navigator.cookieEnabled ? 1 : 0;
  }
  try {
    var Ec = window.RequestFileSystem || window.webkitRequestFileSystem;
    Ec &&
      Ec(
        0,
        0,
        function () {},
        function () {
          ta = 1;
        }
      );
    try {
      "storage" in navigator &&
        "estimate" in navigator.storage &&
        navigator.storage.estimate().then(function (a) {
          12e7 > a.quota && (ta = 1);
        });
    } catch (a) {}
    "MozAppearance" in document.documentElement.style &&
      (navigator.serviceWorker || (ta = 1));
    window.indexedDB ||
      (!window.PointerEvent && !window.MSPointerEvent) ||
      (ta = 1);
  } catch (a) {}
  La.prototype = {
    constructor: La(),
    sortElements: function (a) {
      a.sort(function (a, c) {
        if ("object" === typeof a && "object" === typeof c && a && c)
          return (
            (a = a.key),
            (c = c.key),
            a === c
              ? 0
              : typeof a === typeof c
              ? a < c
                ? -1
                : 1
              : typeof a < typeof c
              ? -1
              : 1
          );
        throw "error";
      });
    },
    calcHash: function (a) {
      for (var b = "", c = 0; c < a.length; c++) b += a[c].key + a[c].value;
      try {
        var d = nb(b),
          e = Vb(d),
          f,
          g = Vb(e),
          h = g.length,
          u = g.split("");
        for (a = 0; a < parseInt(h / 2); a++)
          if (0 == a % 2) {
            var n = g.charAt(a);
            u[a] = u[h - 1 - a];
            u[h - 1 - a] = n;
          }
        f = u.join("");
        b = nb(f);
      } catch (v) {}
      return (b = nb(b));
    },
    getSendString: function (a) {
      for (var b = "", c = 0; c < a.length; c++)
        b += '"' + a[c].key + '":"' + a[c].value + '",';
      return "{" + b.substring(0, b.length - 1) + "}";
    },
    getCrossKey: function () {
      var a = [],
        b = {
          Linux:
            "colorDepth pixelRatio timezoneOffset cpuClass navigatorPlatform touchSupport fontsHash webglVendorAndRenderer".split(
              " "
            ),
          Win32:
            "colorDepth resolution timezoneOffset navigatorPlatform webglVendorAndRenderer touchSupport".split(
              " "
            ),
          Win64:
            "colorDepth screenResolution timezoneOffset navigatorPlatform webglVendorAndRenderer touchSupport".split(
              " "
            ),
          MacIntel:
            "colorDepth screenResolution pixelRatio timezoneOffset navigatorPlatform touchSupport".split(
              " "
            ),
          iPhone:
            "canvasHash colorDepth timezoneOffset cpuClass navigatorPlatform touchSupport screenResolution pixelRatio fontsHash webglVendorAndRenderer".split(
              " "
            ),
        };
      /Linux|linux/g.test(navigator.platform) && (a = b.Linux);
      navigator.platform &&
        b[navigator.platform] &&
        (a = b[navigator.platform]);
      return a;
    },
    setMoreInfo: function (a) {
      a.push({
        key: "javaEnabled",
        value: navigator.javaEnabled() ? "1" : "0",
      });
      for (var b = navigator.mimeTypes, c = "", d = 0; d < b.length; d++)
        c += b[d].type + "#";
      a.push({ key: "mimeTypesHash", value: Na(c.substr(0, c.length - 1)) });
      a.push({
        key: "cookieEnabled",
        value: navigator.cookieEnabled ? "1" : "0",
      });
      b = 0;
      try {
        if (
          0 <= navigator.userAgent.toString().indexOf("MSIE") ||
          window.ActiveXObject ||
          "ActiveXObject" in window
        )
          var e = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"),
            b = Number(
              e
                .GetVariable("$version")
                .split(" ")[1]
                .replace(/,/g, ".")
                .replace(/^(d+.d+).*$/, "$1")
            );
        else
          navigator.plugins &&
            0 < navigator.plugins.length &&
            (e = navigator.plugins["Shockwave Flash"]) &&
            ((flashArr = e.description.split(" ")),
            (b = flashArr[2] + " " + flashArr[3]));
      } catch (f) {}
      a.push({ key: "flashVersion", value: b });
      a.push({
        key: "doNotTrack",
        value:
          navigator.doNotTrack ||
          navigator.msDoNotTrack ||
          window.doNotTrack ||
          "unknown",
      });
      e = new UAParser();
      e.setUA(navigator.userAgent);
      e = e.getResult();
      a.push({ key: "browserName", value: e.browser.name });
      a.push({ key: "browserVersion", value: e.browser.version });
      a.push({ key: "os", value: e.os.name });
      a.push({ key: "osVersion", value: e.os.version });
      a.push({ key: "browserEngine", value: e.engine.name });
      a.push({ key: "browserEngineVersion", value: e.engine.version });
      a.push({ key: "deviceType", value: e.device.type });
      a.push({ key: "deviceVendor", value: e.device.vendor });
    },
    getCollectElements: function (a, b) {
      var c = this,
        d = {};
      a.fpExcludes && (d.excludes = a.fpExcludes);
      d.extraComponents = [
        {
          key: "localCode",
          getData: function (a) {
            var b = 0,
              c =
                window.RTCPeerConnection ||
                window.webkitRTCPeerConnection ||
                window.mozRTCPeerConnection;
            if ("function" == typeof c) {
              try {
                var d = new c({ iceServers: [] });
                d.createDataChannel("", { reliable: !1 });
              } catch (n) {
                if (2 != b) {
                  b = 1;
                  a();
                  return;
                }
              }
              var e = !1;
              d.onicecandidate = function (c) {
                var d = /([0-9]{1,3}(\.[0-9]{1,3}){3})/,
                  f = [];
                "complete" != c.target.iceGatheringState ||
                  e ||
                  ((e = !0),
                  c.target.localDescription.sdp
                    .split("\n")
                    .forEach(function (a) {
                      (a = d.exec(a)) &&
                        "127.0.0.1" != a[1] &&
                        "0.0.0.0" != a[1] &&
                        -1 === f.indexOf(a[1]) &&
                        f.push(a[1]);
                    }),
                  2 != b && ((b = 1), a(0 < f.length ? f.sort()[0] : "")));
              };
              d.onaddstream = function (a) {
                remoteVideo.src = window.URL.createObjectURL(a.stream);
              };
              d.createOffer(
                function (a) {
                  d.setLocalDescription(
                    a,
                    function () {},
                    function () {}
                  );
                },
                function () {},
                {}
              );
              setTimeout(function () {
                0 == b && ((b = 2), a());
              }, 500);
            } else a();
          },
        },
        {
          key: "isIncognito",
          getData: function (a) {
            a(ta);
          },
        },
        {
          key: "isRiskBrowser",
          getData: function (a) {
            a(
              (/PhantomJS/.test(navigator.userAgent) ||
              window.callPhantom ||
              window._phantom ||
              /HeadlessChrome/.test(navigator.userAgent) ||
              0 == navigator.plugins.length ||
              "" == navigator.languages
                ? 1
                : 0) || Ub()
            );
          },
        },
      ];
      Fingerprint2.get(d, function (d) {
        var e = d.map(function (a) {
          return a.value;
        });
        c.setMoreInfo(d);
        if (a.extendFields) {
          for (var g = [], h = 0, u = a.extendFields.length; h < u; h++) {
            var n = a.extendFields[h];
            g.push({ key: "ex_" + n.key, value: n.value });
          }
          d = d.concat(g);
        }
        var l = [];
        xa && l.push({ key: "serialNum", value: wa });
        g = ["fonts", "webgl", "plugins", "canvas"];
        u = c.getCrossKey();
        n = [];
        for (h = 0; h < d.length; h++) {
          var p = d[h],
            m = p.key.replace(/%/gm, ""),
            q = p.value;
          void 0 !== q &&
            "" !== q &&
            ("platform" == m && (m = "navigatorPlatform"),
            p.value instanceof Array &&
              (-1 != g.indexOf(m)
                ? ((m += "Hash"), (q = Na(q.join("#"))))
                : (q = q.toString().replace(/%/gm, ""))),
            -1 != u.indexOf(m) && n.push(q),
            l.push({ key: m, value: q }));
        }
        d =
          Fingerprint2.x64hash128(n.join(""), 31).substring(0, 16) +
          Fingerprint2.x64hash128(e.join(""), 31).substring(16);
        l.push({ key: "WEB" == pb() ? "webSmartID" : "wapSmartID", value: d });
        l.push({ key: "isSelenium", value: Ub() || Hc() });
        c.dfpCache.get("BSFIT_CACHE", function (a) {
          a && l.push({ key: "cookieCode", value: a });
          l.push({ key: "custID", value: "JYZX" });
          l.push({ key: "platform", value: pb() });
          c.sortElements(l);
          a = c.calcHash(l);
          l.push({ key: "hashCode", value: a });
          l.push({ key: "algID", value: "l4ehhNODhH" });
          l.push({ key: "timestamp", value: new Date().getTime() });
          "function" == typeof b && b(l);
        });
      });
    },
    collectionSDKElements: function (a, b) {
      var c = this,
        d = {};
      a.fpExcludes && (d.excludes = a.fpExcludes);
      Fingerprint2.get(d, function (d) {
        var e = d.map(function (a) {
            return a.value;
          }),
          g = [];
        xa && g.push({ key: "serialNum", value: wa });
        for (var h = c.getCrossKey(), l = [], n = 0; n < d.length; n++) {
          var v = d[n],
            p = v.key.replace(/%/gm, ""),
            v = v.value;
          void 0 !== v && "" !== v && -1 != h.indexOf(p) && l.push(v);
        }
        try {
          a.extendFields && (g = g.concat(a.extendFields));
        } catch (m) {}
        d =
          Fingerprint2.x64hash128(l.join(""), 31).substring(0, 16) +
          Fingerprint2.x64hash128(e.join(""), 31).substring(16);
        g.push({ key: "wapSmartID", value: d });
        g.push({ key: "custID", value: "JYZX" });
        g.push({ key: "platform", value: "WEB" });
        c.dfpCache.get("BSFIT_CACHE", function (a) {
          a && g.push({ key: "cookieCode", value: a });
          c.sortElements(g);
          a = c.calcHash(g);
          g.push({ key: "hashCode", value: a });
          g.push({ key: "algID", value: "l4ehhNODhH" });
          g.push({ key: "timestamp", value: new Date().getTime() });
          "function" == typeof b && b(g);
        });
      });
    },
    storeCache: function (a) {
      a = JSON.parse(a);
      for (var b in a)
        "dfp" == b
          ? Va("BSFIT_DEVICEID") != a[b] && Wa("BSFIT_DEVICEID", a[b], 1e3, !1)
          : "exp" == b
          ? Wa("BSFIT_EXPIRATION", a[b], 1e3, !1)
          : "cookieCode" == b && this.dfpCache.set("BSFIT_CACHE", a[b]);
    },
    getEncryptKey: function () {
      var a = Tb(16, 16),
        b = Tb(16, 16);
      return a + b;
    },
    getEncryptMode: function () {
      return 1;
    },
    sendGenerateInfo: function (a, b) {
      new Date().getTime();
      var c = this,
        d = c.getSendString(a);
      a = c.getEncryptKey();
      var e = Wb();
      if ("undefined" != e) {
        var f = ea + "?channel\x3dWEB",
          g = new Date().getTime();
        e.open("post", f, !0);
        e.setRequestHeader("Content-Type", "application/json");
        if (xa)
          try {
            e.timeout = Oc;
          } catch (h) {}
        e.onreadystatechange = function () {
          if (4 == e.readyState && 200 == e.status) {
            var a = new Date().getTime(),
              d = e.responseText;
            160 < d.length && (c.storeCache(d), "function" == typeof b && b(d));
            ob(null, a - g, "success");
          }
        };
        xa &&
          (e.ontimeout = function () {
            var a = new Date().getTime(),
              d =
                '{"exp":' +
                new Date().setHours(new Date().getHours() + 1) +
                ',"dfp":"' +
                wa +
                '"}';
            c.storeCache(d);
            "function" == typeof b && b(d);
            ob(wa, a - g, "timeout");
          });
        d = Sb(d, a.substring(0, 16), a.substring(16));
        f = {};
        f.bsk = a;
        f.inputItem = d;
        f.bse = c.getEncryptMode();
        e.send(JSON.stringify(f));
      } else
        (d = encodeURIComponent(Sb(d, a.substring(0, 16), a.substring(16)))),
          -1 != ea.indexOf("post") && (ea = ea.replace("post", "jsonp")),
          ic.getJSON(
            ea +
              "?bsk\x3d" +
              a +
              "\x26inputItem\x3d" +
              d +
              "\x26bse\x3d" +
              c.getEncryptMode() +
              "\x26channel\x3dWEB",
            null,
            function (a) {
              c.storeCache(a);
              "function" == typeof b && b(a);
            }
          );
    },
    getFingerprint: function (a, b) {
      var c = this,
        d = Va("BSFIT_DEVICEID") || "",
        e = Va("BSFIT_EXPIRATION") || 0;
      "" != d && 64 < d.length && 0 != e && 9e5 < e - new Date().getTime()
        ? "function" == typeof b && b(JSON.stringify({ dfp: d, exp: e }))
        : (xa &&
            (wa = N.enc.Base64.stringify(
              N.enc.Utf8.parse(qb + "#" + new Date().getTime())
            )),
          Ma()
            ? this.collectionSDKElements(a, function (a) {
                c.sendGenerateInfo(a, b);
              })
            : this.getCollectElements(a, function (a) {
                c.sendGenerateInfo(a, b);
              }));
    },
    getFingerprintBySDK: function (a) {
      var b = "string" === typeof a ? JSON.parse(a) : a;
      a = {};
      b = Rb(b);
      a.extendFields = b;
      a.fpExcludes = {
        webgl: !0,
        plugins: !0,
        webglVendorAndRenderer: !0,
        canvas: !0,
        enumerateDevices: !0,
        pixelRatio: !0,
        doNotTrack: !0,
        fontsFlash: !0,
      };
      this.getFingerprint(a, function (a) {
        JS.onSuccess(a);
      });
    },
  };
  var ua = {};
  if (Ma()) {
    var ed =
        "string" === typeof window.SDKElement
          ? JSON.parse(window.SDKElement)
          : window.SDKElement,
      fd = Rb(ed);
    ua.extendFields = fd;
    ua.fpExcludes = {
      webgl: !0,
      plugins: !0,
      webglVendorAndRenderer: !0,
      canvas: !0,
      enumerateDevices: !0,
      pixelRatio: !0,
      doNotTrack: !0,
      fontsFlash: !0,
    };
  } else ua.extendFields = [];
  var Ia = [],
    Qb = !1,
    Fc = !1;
  if ("function" !== typeof mb)
    throw new TypeError("callback for docReady(fn) must be a function");
  if (Qb)
    setTimeout(function () {
      mb(void 0);
    }, 1);
  else {
    Ia.push({ fn: mb, ctx: void 0 });
    var Ja = function () {
      if (!Qb) {
        Qb = !0;
        for (var a = 0; a < Ia.length; a++) Ia[a].fn.call(window, Ia[a].ctx);
        Ia = [];
      }
    };
    "complete" === document.readyState
      ? setTimeout(Ja, 1)
      : Fc ||
        (document.addEventListener
          ? (document.addEventListener("DOMContentLoaded", Ja, !1),
            window.addEventListener("load", Ja, !1))
          : (document.attachEvent("onreadystatechange", function () {
              "complete" === document.readyState && Ja();
            }),
            window.attachEvent("onload", Ja)),
        (Fc = !0));
  }
  return La;
}
"undefined" !== typeof window && "function" === typeof define && define.amd
  ? define(Ka)
  : "undefined" !== typeof module && module.exports
  ? (module.exports = Ka())
  : this.exports
  ? (this.exports = Ka())
  : (this.BSDeviceFingerprint = Ka());

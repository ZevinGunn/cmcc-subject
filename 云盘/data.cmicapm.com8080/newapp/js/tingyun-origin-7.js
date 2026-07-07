/*!VERSION=3.7.0-zhongyihulianwang.1*/
var TINGYUN = (function () {
  function t(t, e) {
    return Function.prototype.apply.apply(t, e);
  }
  function e(t, e) {
    return function () {
      return t.apply(e, arguments);
    };
  }
  function n(t) {
    return (
      (n =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (t) {
              return typeof t;
            }
          : function (t) {
              return t &&
                "function" == typeof Symbol &&
                t.constructor === Symbol &&
                t !== Symbol.prototype
                ? "symbol"
                : typeof t;
            }),
      n(t)
    );
  }
  function r(t, e, n) {
    return (
      (e = (function (t) {
        var e = (function (t, e) {
          if ("object" != typeof t || null === t) return t;
          var n = t[Symbol.toPrimitive];
          if (n !== undefined) {
            var r = n.call(t, e || "default");
            if ("object" != typeof r) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === e ? String : Number)(t);
        })(t, "string");
        return "symbol" == typeof e ? e : String(e);
      })(e)) in t
        ? Object.defineProperty(t, e, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[e] = n),
      t
    );
  }
  function i(t, e, r) {
    var i,
      a = 0;
    if (t)
      if (
        (function (t) {
          var e = !!t && "length" in t && t.length,
            r = n(t);
          return (
            "function" !== r &&
            ("array" === r ||
              0 === e ||
              ("number" == typeof e && e > 0 && e - 1 in t))
          );
        })(t)
      )
        for (i = t.length; a < i && !1 !== e.call(t[a], t[a], a); a++);
      else
        for (a in t)
          if (
            (r || Object.prototype.hasOwnProperty.call(t, a)) &&
            !1 === e.call(t[a], t[a], a)
          )
            break;
    return t;
  }
  var a = window.encodeURIComponent;
  function o(t) {
    return a ? a(t) : t;
  }
  function c(t) {
    return function (e) {
      return "Array" === t && Array.isArray
        ? Array.isArray(e)
        : Object.prototype.toString.call(e) === "[object " + t + "]";
    };
  }
  var s = c("String"),
    u = c("Array"),
    f = c("Object"),
    d = c("Number"),
    l = c("Headers"),
    h = c("Request"),
    p = function (t) {
      return "function" == typeof t;
    };
  function v() {
    this.events = {};
  }
  v.prototype = {
    on: function (t, e) {
      var n = this;
      return (
        s(t)
          ? (n.events[t] || (n.events[t] = [])).push(e)
          : u(t) &&
            i(t, function (t) {
              n.on(t, e);
            }),
        n
      );
    },
    off: function (t, e) {
      var n = arguments.length,
        r = this;
      if (0 === n) return (r.events = {}), r;
      var i = r.events[t];
      if (!i) return r;
      if (1 === n) return (r.events[t] = null), r;
      for (var a = i.length; a--; )
        if (i[a] === e) {
          i.splice(a, 1);
          break;
        }
      return r;
    },
    emit: function (t) {
      var e = [].slice.call(arguments, 1),
        n = this.events[t];
      return (
        n &&
          i(n, function (t) {
            return t.apply(this, e);
          }),
        this
      );
    },
    unshift: function (t, e) {
      var n = this;
      return (n.events[t] || (n.events[t] = [])).unshift(e), n;
    },
  };
  var m = [].slice;
  function y(t) {
    return (
      arguments.length < 2 ||
        !t ||
        i(m.call(arguments, 1), function (e) {
          i(e, function (e, n) {
            t[n] = e;
          });
        }),
      t
    );
  }
  function g(t, e) {
    for (var n = -1, r = 0, i = null == t ? 0 : t.length, a = []; ++n < i; ) {
      var o = t[n];
      e(o, n, t) && (a[r++] = o);
    }
    return a;
  }
  var b = +new Date();
  function w(t, e, n) {
    var r;
    if (null == t) return -1;
    var i = Object(t),
      a = i.length >>> 0;
    if (0 === a) return -1;
    var o = +n || 0;
    if ((Math.abs(o) === Infinity && (o = 0), o >= a)) return -1;
    for (r = Math.max(o >= 0 ? o : a - Math.abs(o), 0); r < a; ) {
      if (r in i && i[r] === e) return r;
      r++;
    }
    return -1;
  }
  var E = function () {
    return !document.addEventListener;
  };
  function T(t) {
    var e = !1;
    try {
      /\{\s+\[native code\]/.test(Function.prototype.toString.call(t)) &&
        (e = !0);
    } catch (n) {}
    return e;
  }
  function x(t) {
    return JSON.parse(t);
  }
  function _(t) {
    return JSON.stringify(t);
  }
  function S(t) {
    return (
      !(!s(t) || null == t) &&
      (("{" === t.charAt(0) && "}" === t.charAt(t.length - 1)) ||
        ("[" === t.charAt(0) && "]" === t.charAt(t.length - 1)))
    );
  }
  function k(t) {
    return S(t) ? new Function("return " + t)() : null;
  }
  var C,
    A,
    O = '"',
    R = "ARRAY",
    N = "OBJECT_KEY",
    I = "OBJECT_VALUE",
    j = "__TY_MARK_OBJECT_VALUE_UNDEFINED__";
  function D(t, e) {
    switch (n(t)) {
      case "object":
        if (!t) return e === I ? null : "null";
        if (t instanceof Array) {
          var r = m.call(t);
          return (
            i(r, function (t, e) {
              r[e] = D(t, R);
            }),
            "[" + r.join(",") + "]"
          );
        }
        if (t instanceof Date) return t.getTime().toString();
        var a = "";
        return (
          i(t, function (t, e) {
            if (!p(t)) {
              var n = D(t, I);
              if (n !== j) {
                var r = D(e, N);
                a += r + ":" + n + ",";
              }
            }
          }),
          a && (a = a.substr(0, a.length - 1)),
          "{" + a + "}"
        );
      case "string":
        for (var o = "", c = 0; c < t.length; c++) {
          var s = t.charAt(c);
          switch (s) {
            case '"':
              o += '\\"';
              break;
            case "\\":
              o += "\\\\";
              break;
            case "\b":
              o += "\\b";
              break;
            case "\f":
              o += "\\f";
              break;
            case "\n":
              o += "\\n";
              break;
            case "\r":
              o += "\\r";
              break;
            case "\t":
              o += "\\t";
              break;
            default:
              o += s;
          }
        }
        return O + o + O;
      case "number":
        return isNaN(t) ? null : t;
      case "boolean":
        return t;
      case "function":
        return D(t.toString());
      case "undefined":
        return e === I ? j : e === R ? "null" : "undefined";
      default:
        return '"undefined"';
    }
  }
  var P,
    L,
    H = window.JSON;
  function M(t, e) {
    var n = null == t ? 0 : t.length;
    if (!n) return -1;
    for (var r = n; r--; ) if (t[r] === e) return r;
    return r;
  }
  function q(t) {
    return setTimeout(t, 0);
  }
  function B() {}
  function U() {
    return +new Date();
  }
  function z(t) {
    return function () {
      if (null !== t) {
        var e = t;
        (t = null), e.apply(this, arguments);
      }
    };
  }
  function F(t, e) {
    return setTimeout(t, e || 0);
  }
  function V(t) {
    return t
      ? s(t)
        ? t.length
        : window.ArrayBuffer && t instanceof ArrayBuffer
        ? t.byteLength
        : window.Blob && t instanceof Blob
        ? t.size
        : t.length
        ? t.length
        : 0
      : 0;
  }
  function K(t, e, n) {
    return !!t && ((n = n || 0), t.indexOf(e) == n);
  }
  (P = H && H.parse),
    (C = p(P) && T(P) ? x : k),
    (A = (function () {
      var t = H && H.stringify;
      if (!p(t) || !T(t)) return !1;
      var e = !0;
      try {
        i([Boolean, Number, String, Object, Array], function (t) {
          if (t.prototype.toJSON) return (e = !1), !1;
        });
      } catch (n) {}
      return e;
    })()
      ? _
      : D),
    (L = window.addEventListener
      ? function (t, e, n, r) {
          return t.addEventListener(e, n, r);
        }
      : function (t, e, n) {
          return t.attachEvent("on" + e, n);
        });
  var Y = String.prototype.trim
      ? function (t) {
          return null == t ? "" : t.trim();
        }
      : function (t) {
          return null == t
            ? ""
            : t.toString().replace(/^\s+/, "").replace(/\s+$/, "");
        },
    J = (function () {
      function t(t) {
        return t < 0
          ? NaN
          : t <= 30
          ? 0 | (Math.random() * (1 << t))
          : t <= 53
          ? (0 | (Math.random() * (1 << 30))) +
            (0 | (Math.random() * (1 << (t - 30)))) * (1 << 30)
          : NaN;
      }
      function e(t, e) {
        for (
          var n = t.toString(16), r = e - n.length, i = "0";
          r > 0;
          r >>>= 1, i += i
        )
          1 & r && (n = i + n);
        return n;
      }
      return function (n) {
        var r = "-";
        return (
          n && (r = ""),
          e(t(32), 8) +
            r +
            e(t(16), 4) +
            r +
            e(16384 | t(12), 4) +
            r +
            e(32768 | t(14), 4) +
            r +
            e(t(48), 12)
        );
      };
    })(),
    G = { imageResources: [] },
    W = {};
  var X = {
      context: null,
      uniqueId: 0,
      actions: [],
      opt_custom_param: null,
      unAssignedEvents: [],
      cpActions: [],
      recordingCpActions: !1,
      cpParent: null,
      cpRemain: { ajax: 0, iframe: 0 },
      tryEndCpActionsFailed: !1,
      pfSent: !1,
      ajaxUniqueId: 0,
      scope: null,
      enableLCPObserver: !0,
      recordingPageLoadEvent: !1,
      recentFinishedAjaxContext: null,
      pageLoadEventEnd: !1,
      nbsJsBridgeData: {},
      did: null,
      uid: null,
      pageActionData: null,
      routeAid: null,
    },
    Q = "error",
    $ = "load",
    Z = "unload",
    tt = "beforeunload",
    et = "pagehide",
    nt = "readystatechange",
    rt = "complete",
    it = "DOMContentLoaded",
    at = "_ty_rum",
    ot = "TINGYUN",
    ct = "__ign",
    st = "1",
    ut = "2",
    ft = "3",
    dt = "4",
    lt = "5",
    ht = "reqBody",
    pt = "TINGYUN_COOKIE_VALUE",
    vt = "TINGYUN_DATA",
    mt = "X-Tingyun",
    yt = "X-Tingyun-Data",
    gt = "TY_BASE64",
    bt = "__TINGYUN",
    wt = "ty_",
    Et = 6e4,
    Tt = "common",
    xt = "event",
    _t = "ajax",
    St = "timer",
    kt = "iframe",
    Ct = "pf",
    At = "crossPage",
    Ot = "jsError",
    Rt = "resource",
    Nt = "batch",
    It = "trace",
    jt = "main",
    Dt = "quit",
    Pt = "pending",
    Lt = "finish",
    Ht = "timeout",
    Mt = "startTime",
    qt = "fetchStart",
    Bt = "requestStart",
    Ut = "responseStart",
    zt = "responseEnd",
    Ft = "domContentLoadedEventStart",
    Vt = "domContentLoadedEventEnd",
    Kt = "domInteractive",
    Yt = "domComplete",
    Jt = "loadEventStart",
    Gt = "loadEventEnd",
    Wt = "unloadEventStart",
    Xt = "unloadEventEnd",
    Qt = "domainLookupStart",
    $t = "domainLookupEnd",
    Zt = "redirectStart",
    te = "redirectEnd",
    ee = "connectStart",
    ne = "connectEnd",
    re = "secureConnectionStart",
    ie = "transferSize",
    ae = "encodedBodySize",
    oe = "decodedBodySize",
    ce = "nextHopProtocol",
    se = "duration",
    ue = 5,
    fe = "__ty_crs_page_events",
    de = "window_open",
    le = "a_link",
    he = "form_submit",
    pe = "__ty_event_patch_tag",
    ve = "__ty_event_patch_disable",
    me = "__ty_event_patch_id",
    ye = "click",
    ge = "submit",
    be = "spe",
    we = "addEventListener",
    Ee = "onProperty",
    Te = "inline",
    xe = "IMG",
    _e = "A",
    Se = "FORM",
    ke = "__ty_xhr_hooked",
    Ce = "__ty_xhr_hooked_type",
    Ae = 200,
    Oe = "TY_USER_ID",
    Re = "TY_SESSION_N_ID",
    Ne = "TY_DEVICE_N_ID",
    Ie = 21e5,
    je = 288e5,
    De = "|",
    Pe = "__TY_SPE_STORE",
    Le = 6e5,
    He = "auto",
    Me = "defined",
    qe = "route",
    Be = 500,
    Ue = "__TY_ELEMENT_CB",
    ze = "__TY_IMAGE_LOAD_HOOK",
    Fe = 60,
    Ve = "__tagFirstPaintTime",
    Ke = 500,
    Ye = 1e4,
    Je = "hashchange",
    Ge = "popstate",
    We = "normal",
    Xe = "script",
    Qe = "current",
    $e = "crossPage",
    Ze = "visibilitychange",
    tn = "URL",
    en = "QH",
    nn = "QB",
    rn = "RH",
    an = "RB",
    on = "reqHeaders",
    cn = "reqBody",
    sn = "resHeaders",
    un = "resBody",
    fn = 200,
    dn = "lifecycle",
    ln = "action",
    hn = "send",
    pn = "init",
    vn = "page",
    mn = "ajax",
    yn = "error",
    gn = "userAction",
    bn = "beforeSend",
    wn = "send",
    En = "paint",
    Tn = "largest-contentful-paint",
    xn = "first-contentful-paint",
    _n = 500,
    Sn = 1e4,
    kn = 100,
    Cn = "__ty_resource_load_bind_id",
    An = "xhr",
    On = "fetch",
    Rn = "mPaaS_rpc",
    Nn = "resource",
    In = "auto",
    jn = "immediateEvent",
    Dn = 1,
    Pn = 2,
    Ln = 3,
    Hn = "beacon",
    Mn = "TINGYUN_STORAGE",
    qn = "AGENT_CONFIG",
    Bn = 10,
    Un = 3e4,
    zn = "GET",
    Fn = "POST",
    Vn = "http://mgw/",
    Kn = 100,
    Yn = 2e3,
    Jn = 4e3,
    Gn = 4e3,
    Wn = 7e3,
    Xn = "userAction",
    Qn = "userEvent",
    $n = "setUser",
    Zn = "subscribeData",
    tr = "Server-Timing",
    er = "xmlhttprequest",
    nr = "fetch",
    rr = "session",
    ir = "history",
    ar = "hash",
    or = "auto",
    cr = "fid",
    sr = "cls",
    ur = "tti",
    fr = "tbt",
    dr = 5e3,
    lr = 10,
    hr = 430080,
    pr = 1e3,
    vr = 200,
    mr = "default",
    yr = "http",
    gr = "info",
    br = "console",
    wr = "dom",
    Er = "fetch",
    Tr = "xhr",
    xr = "history",
    _r = "navigation",
    Sr = "error",
    kr = "report",
    Cr = "resource",
    Ar = "longtask",
    Or = "navigation",
    Rr = "first-input",
    Nr = "performance",
    Ir = Cr,
    jr = Or,
    Dr = 5e3,
    Pr = 1e3,
    Lr = { error: 990, abort: 905, timeout: 903 },
    Hr = "id",
    Mr = "appKey",
    qr = "token",
    Br = "key",
    Ur = "env",
    zr = "replay",
    Fr = "dsn",
    Vr = "c",
    Kr = "apply",
    Yr = "init",
    Jr = "tingyun",
    Gr = "w3c-trace-context",
    Wr = "sw8",
    Xr = "http://",
    Qr = "https://",
    $r = "file://",
    Zr = "TOKEN_",
    ti = "APPKEY_",
    ei = "CK",
    ni = "|",
    ri = { lifecycle: [pn], action: [vn, mn, yn, gn], send: [bn, wn] },
    ii = "default",
    ai = {};
  function oi(t, e) {
    return "".concat(t, "_").concat(e || ii);
  }
  function ci(t) {
    if (t && f(t)) {
      var e = t.type,
        n = t.name,
        r = t.handler,
        i = t.options;
      if (!(null == ri[e] || (n && w(ri[e], n) < 0) || !p(r) || (i && !f(i))))
        if (n === vn && X.pageActionData)
          li(t, { args: { actionData: X.pageActionData } });
        else {
          var a = oi(e, n);
          ai[a] || (ai[a] = []), ai[a].push(t);
        }
    }
  }
  function si(t, e) {
    ci({ type: dn, name: t, handler: e });
  }
  function ui(t, e, n) {
    ci({ type: ln, name: t, handler: e, options: n });
  }
  function fi(t, e) {
    ci({ type: hn, name: t, handler: e });
  }
  function di(t) {
    var e,
      n = t.type,
      r = t.name,
      a = t.args,
      o = t.scope,
      c = oi(n, r);
    if (ai[c])
      try {
        i(ai[c], function (t) {
          if (!1 === li(t, { args: a, scope: o })) return (e = !1), !1;
        });
      } catch (s) {}
    return e;
  }
  function li(t, e) {
    var n,
      r = e.args,
      i = e.scope,
      a = r || {};
    i && (a.scope = i);
    try {
      n = t.handler.call(i, a);
    } catch (o) {}
    return n;
  }
  function hi(t) {
    (t = t || {}),
      (this._contexts = t.contexts || null),
      (this._name = t.name),
      (this._tags = null),
      (this._metrics = null),
      (this._params = null);
  }
  function pi() {
    X.scope || (X.scope = new hi({ name: "ROOT" }));
  }
  function vi() {
    pi(), X.scope.setContext.apply(X.scope, arguments);
  }
  function mi(t, e, n) {
    if (t && e) {
      n || (n = "scope");
      var r = e ? e.getData() : null;
      return r && (t[n] = r), t;
    }
  }
  function yi() {
    return pi(), X.scope;
  }
  (hi.prototype.setContext = function (t, e) {
    var n = this;
    t && f(t)
      ? i(t, function (t, e) {
          n._mergeContext(e, t);
        })
      : this._mergeContext(t, e);
  }),
    (hi.prototype.setBreadcrumbs = function (t) {
      if (t)
        if (this._breadcrumbs)
          try {
            this._breadcrumbs = this._breadcrumbs.concat(t);
          } catch (e) {}
        else this._breadcrumbs = t;
    }),
    (hi.prototype.setTag = function (t, e) {
      null != t &&
        null != e &&
        (this._tags || (this._tags = {}), (this._tags[t] = e));
    }),
    (hi.prototype.setMetric = function (t, e, n) {
      if (null != t && null != e) {
        this._metrics || (this._metrics = {});
        var r = { data: e };
        n && (r.unit = n), (this._metrics[t] = r);
      }
    }),
    (hi.prototype.setParams = function (t) {
      this._params || (this._params = {}), y(this._params, t);
    }),
    (hi.prototype.setExtraContext = function (t) {
      this.setContext("extra", t);
    }),
    (hi.prototype.getContext = function (t) {
      return null == t
        ? this._contexts
        : null == this._contexts
        ? null
        : this._contexts[t];
    }),
    (hi.prototype.getData = function () {
      if (this._isEmptyScope()) return null;
      var t = {};
      return (
        this._contexts && (t.contexts = this._contexts),
        this._breadcrumbs && (t.breadcrumbs = this._breadcrumbs),
        this._tags && (t.tags = this._tags),
        this._metrics && (t.metrics = this._metrics),
        this._params && (t.params = this._params),
        t
      );
    }),
    (hi.prototype._isEmptyScope = function () {
      return (
        null == this._contexts &&
        null == this._breadcrumbs &&
        null == this._tags &&
        null == this._metrics &&
        null == this._params
      );
    }),
    (hi.prototype._mergeContext = function (t, e) {
      null != t &&
        null != e &&
        (this._contexts || (this._contexts = {}),
        f(this._contexts[t]) && f(e)
          ? (this._contexts[t] = y(this._contexts[t] || {}, e))
          : (this._contexts[t] = e));
    }),
    (hi.prototype.toJSON = function () {
      return undefined;
    });
  var gi,
    bi = window.Error,
    wi = window.document,
    Ei = window.XMLHttpRequest,
    Ti = window.location,
    xi = window.navigator,
    _i = {},
    Si = {};
  function ki() {
    try {
      gi || (gi = window.navigator.userAgent.substring(0, 256));
    } catch (t) {}
    return gi;
  }
  var Ci,
    Ai,
    Oi = !/(MSIE [0-8].\d+)/.test(ki()) && document.addEventListener;
  function Ri() {
    return Oi;
  }
  var Ni = [],
    Ii = [];
  function ji() {
    return Ni;
  }
  function Di() {
    return Ii;
  }
  "onpagehide" in window
    ? ((Ni = [et]), (Ii = [$, et]))
    : ((Ni = [Z, tt]), (Ii = [$, Z, tt]));
  function Pi() {
    return (
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.nbsBrowserAgent &&
      window.webkit.messageHandlers.nbsBrowserAgent.postMessage
    );
  }
  function Li() {
    return "undefined" != typeof nbsJsBridge && nbsJsBridge.postMessage;
  }
  function Hi(t) {
    return s(t) || (t = A(t)), t;
  }
  var Mi,
    qi = "display:none";
  function Bi(t, e) {
    var n = t.url,
      r = t.data,
      i = t.callback,
      a = t.method,
      o = t.timeout,
      c = z(i),
      s = new XDomainRequest();
    (s[ct] = !0),
      (a = a || Fn),
      s.open(a, n),
      (s.onload = function () {
        c(s.responseText), e(!0);
      }),
      (s.onerror = function (t) {
        c(t), e(!1);
      }),
      o && (s.timeout = o),
      q(function () {
        a === Fn ? s.send(Hi(r)) : s.send();
      });
  }
  function Ui(t, e, n) {
    var r = document.createElement(t);
    try {
      for (var i in e) r[i] = e[i];
    } catch (c) {
      var a = "<" + t;
      for (var o in e) a += " " + o + '="' + e[o] + '"';
      (a += ">"), n || (a += "</" + t + ">"), (r = document.createElement(a));
    }
    return r;
  }
  function zi(t, e) {
    var n = t.url,
      r = t.data,
      i = t.callback,
      a = Ui("div", { style: qi }),
      o = Ui("iframe", { name: "ty_form", width: 0, height: 0, style: qi }),
      c = Ui("form", {
        style: qi,
        action: n,
        enctype: "application/x-www-form-urlencoded",
        method: "post",
        target: "ty_form",
      }),
      s = Ui("input", { name: "data", type: "hidden" }, !0);
    (s.value = Hi(r)),
      c.appendChild(s),
      a.appendChild(o),
      a.appendChild(c),
      document.body.appendChild(a),
      c.submit();
    var u = z(function (t) {
      i && i(), document.body.removeChild(a), e(t);
    });
    (o.onreadystatechange = function () {
      (o.readyState !== rt && 4 !== o.readyState) || u(!0);
    }),
      (o.onload = function () {
        u(!0);
      }),
      (o.onerror = function () {
        u(!1);
      });
  }
  function Fi(t, e) {
    var n = t.url,
      r = t.data,
      i = t.header,
      a = t.callback,
      o = t.method,
      c = t.timeout,
      s = z(a),
      u = new Ei();
    try {
      (u[ct] = !0), (o = o || Fn);
      try {
        u.open(o, n, !0);
      } catch (d) {
        return zi(t, e);
      }
      for (var f in (u.overrideMimeType && u.overrideMimeType("text/html"),
      c && (u.timeout = c),
      (u.onreadystatechange = function () {
        if (4 == u.readyState) {
          s(u.responseText);
          var t = u.status;
          e(200 === t || (t >= 400 && t < 500));
        }
      }),
      (u.onerror = function () {
        s(), e(!1);
      }),
      i))
        u.setRequestHeader(f, i[f]);
      o === Fn ? u.send(Hi(r)) : u.send();
    } catch (d) {
      e(!1);
    }
  }
  function Vi(t, e) {
    var n = t.url,
      r = t.data,
      i = t.callback;
    try {
      var a = xi.sendBeacon(n, Hi(r));
      i && i(), e(a);
    } catch (o) {
      e(!1);
    }
  }
  function Ki(t, e) {
    var n = {
      url: t,
      header: { "content-type": "text/plain;charset=UTF-8" },
      body: Hi(e),
    };
    return Hi({ type: 0, params: { ri: n } });
  }
  function Yi(t, e) {
    var n = t.url,
      r = t.data,
      i = t.callback;
    try {
      window.webkit.messageHandlers.nbsBrowserAgent.postMessage(Ki(n, r));
    } catch (a) {}
    i && i(), e(!0);
  }
  function Ji(t, e) {
    var n = t.url,
      r = t.data,
      i = t.callback;
    try {
      nbsJsBridge.postMessage(Ki(n, r));
    } catch (a) {}
    i && i(), e(!0);
  }
  function Gi() {
    var t = this;
    (this.size = Kn),
      (this.queue = []),
      (this.running = !1),
      (this.post = null),
      (this.callbackPost = null),
      (this.canToggleToSendBeacon = !1),
      this.initSendingMethod(),
      L(window, et, function () {
        t.canToggleToSendBeacon && ((t.post = Vi), (Si.initiator = Hn));
      });
  }
  function Wi(t) {
    Mi && Mi.add(t);
  }
  (Gi.prototype.add = function (t) {
    this.queue.length >= this.size ||
      !t ||
      (null == t.retry && (t.retry = !0),
      this.queue.push(t),
      this.running || ((this.running = !0), this.run()));
  }),
    (Gi.prototype.run = function () {
      var t = this,
        e = this.queue[0];
      this.handler(e, function (n) {
        n || !e.retry
          ? (t.queue.shift(), t.queue.length > 0 ? t.run() : (t.running = !1))
          : (t.running = !1);
      });
    }),
    (Gi.prototype.handler = function (t, e) {
      var n = this.post;
      t.needPostCallback && (n = this.callbackPost),
        n(
          t,
          z(function (t) {
            e(t);
          })
        );
    }),
    (Gi.prototype.initSendingMethod = function () {
      var t,
        e,
        n,
        r,
        i,
        a = !1;
      xi.sendBeacon && (a = !0),
        (e = Fi),
        Pi()
          ? ((t = Yi), (a = !1), (Si.initiator = "messageHandler"))
          : Li()
          ? ((t = Ji), (a = !1), (Si.initiator = "jsBridge"))
          : window.XDomainRequest
          ? ((t = e = Bi), (Si.initiator = "xdr"))
          : ((n = window.navigator.standalone),
            (r = ki().toLowerCase()),
            (i = /safari/.test(r)),
            (/iphone|ipod|ipad/.test(r) && !n && !i) ||
            (_i[Mr] && !Pi() && !Li())
              ? ((t = Fi), (a = !1), (Si.initiator = "xhr"))
              : Ci
              ? ((t = zi), (Si.initiator = "form"))
              : ((t = Fi), (Si.initiator = "xhr"))),
        t ||
          ((t = function (t, e) {
            e(!0);
          }),
          (a = !1)),
        (this.canToggleToSendBeacon = a),
        (this.post = t),
        (this.callbackPost = e);
    });
  var Xi = "xhrs",
    Qi = "errs",
    $i = "resErrs",
    Zi = "vc",
    ta = "tti";
  function ea(t, e) {
    t.cache[e] = [];
  }
  function na() {
    (this.cache = {}),
      (this.snapshot = {}),
      ea(this, Xi),
      ea(this, Qi),
      ea(this, $i),
      ea(this, Zi),
      (this.addCache = function (t, e) {
        if (this.cache[t] && e)
          try {
            var n = e();
            n && this.cache[t].push(n);
          } catch (r) {}
      }),
      (this.getCache = function (t) {
        return this.cache[t];
      }),
      (this.getCacheSnapshot = function (t, e) {
        if (!e) return this.getCache(t);
        var n = this.snapshot[t];
        n || (n = this.snapshot[t] = {});
        var r = n[e];
        return r || (r = n[e] = this.cache[t].slice()), r;
      }),
      (this.clearCache = function (t) {
        var e = this;
        i(t, function (t) {
          e.cache[t] && (e.cache[t] = null),
            e.snapshot[t] && (e.snapshot[t] = null);
        });
      }),
      v.call(this);
  }
  function ra(t) {
    var e = t.url,
      n = t.body,
      r = t.type,
      i = t.callback;
    i = i || B;
    var a,
      o = { url: e, body: n, type: r };
    try {
      a = di({ type: hn, name: bn, args: o });
    } catch (c) {}
    !1 !== a &&
      Wi({
        url: o.url,
        data: o.body,
        callback: function () {
          try {
            di({ type: hn, name: wn, args: o }), i();
          } catch (c) {}
        },
        retry: t.retry,
      });
  }
  y(na.prototype, v.prototype);
  var ia,
    aa = new na();
  function oa(t) {
    try {
      return (e = t) && s(e) ? C(e) : e;
    } catch (n) {}
    var e;
    return null;
  }
  function ca(t, e, n) {
    if (null == t[e] || u(t[e])) u(t[e]) ? t[e].push(n) : (t[e] = n);
    else {
      var r = t[e];
      (t[e] = [r]), t[e].push(n);
    }
  }
  function sa(t) {
    return ia.call(t);
  }
  function ua(t) {
    if (!t || !s(t)) return "";
    var e,
      n = t.indexOf("?");
    return n >= 0 && (e = t.substring(n + 1)), e;
  }
  function fa(t) {
    var e = ua(t);
    return { queryObj: da(e), queryString: e };
  }
  function da(t) {
    var e = {};
    return (
      t &&
        i(t.split("&"), function (t) {
          var n = t.split("="),
            r = la(n[0]),
            i = la(n[1]);
          if (s(i) && window.isNaN(i)) {
            var a = oa(i);
            null != a && (i = a);
          }
          r && null != i && ca(e, r, i);
        }),
      e
    );
  }
  function la(t) {
    try {
      return decodeURIComponent(t);
    } catch (e) {}
    return null;
  }
  function ha(t) {
    var e = [];
    return (
      i(t, function (t, n) {
        var r = o(n) + "=" + o(t);
        e.push(r);
      }),
      e.join("&")
    );
  }
  function pa(t, e) {
    var n = ha(e);
    return (t += (t.indexOf("?") > 0 ? "&" : "?") + n);
  }
  function va() {
    return window.location.href;
  }
  function ma(t) {
    var e = M(t, "/");
    return e > -1 && (t = t.substring(0, e)), t;
  }
  aa.on("send", ra),
    (ia = String.prototype.trim
      ? String.prototype.trim
      : function () {
          return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
        });
  var ya,
    ga,
    ba,
    wa = /(msie|trident)/i.test(ki()),
    Ea = document.createElement("a");
  function Ta(t) {
    var e = t;
    return (
      wa && (Ea.setAttribute("href", e), (e = Ea.href)),
      Ea.setAttribute("href", e),
      {
        href: Ea.href,
        protocol: Ea.protocol ? Ea.protocol.replace(/:$/, "") : "",
        host: Ea.host,
        search: Ea.search ? Ea.search.replace(/^\?/, "") : "",
        hash: Ea.hash ? Ea.hash.replace(/^#/, "") : "",
        hostname: Ea.hostname,
        port: Ea.port,
        pathname:
          "/" === Ea.pathname.charAt(0) ? Ea.pathname : "/" + Ea.pathname,
      }
    );
  }
  (ya = function (t) {
    try {
      return window.localStorage.getItem(t);
    } catch (e) {}
  }),
    (ga = function (t, e) {
      try {
        window.localStorage.setItem(t, e);
      } catch (n) {}
      return e;
    }),
    (ba = function (t) {
      try {
        window.localStorage.removeItem(t);
      } catch (e) {}
    });
  var xa = null;
  function _a(t, e) {
    if (null != xa && p(xa)) {
      var n = { type: 1, params: { event_name: t } };
      e && (n.params.data = e);
      try {
        xa(A(n));
      } catch (r) {}
    }
  }
  var Sa = 50;
  function ka() {
    return X.did;
  }
  function Ca(t) {
    null != t && ((X.did = t), ga(Ne, t));
  }
  function Aa() {
    var t = X.uid;
    return (
      t || ((t = ya(Oe)) ? ((t = t.substring(0, Sa)), (X.uid = t), t) : null)
    );
  }
  function Oa(t, e) {
    (e = e || {}),
      null != t &&
        ((t = t.substring(0, Sa)),
        (X.uid = t),
        e.noStore || ga(Oe, t),
        e.noDispatch || _a($n, { id: X.uid }));
  }
  function Ra() {
    var t = window.TINGYUN_RELEASE && window.TINGYUN_RELEASE.id;
    return t || (t = _i.releaseId), t;
  }
  var Na,
    Ia = "http:",
    ja = "https:",
    Da = {
      ref: document.URL,
      referrer: document.referrer,
      v: "3.7.0-zhongyihulianwang.1",
      av: "3.7.0-zhongyihulianwang.1",
      ua: (navigator || {}).userAgent,
    };
  function Pa() {
    return Na;
  }
  function La(t) {
    return y(
      {},
      Da,
      (function () {
        var t = { did: ka(), url: va() },
          e = Aa();
        e && (t.uid = e);
        var n = Ra();
        return n && (t.rid = n), t;
      })(),
      t
    );
  }
  function Ha(t) {
    return { beacon: Pa(), query: (t = La(t)) };
  }
  function Ma() {
    (Da.ref = document.URL),
      (function () {
        try {
          return window.self !== window.top;
        } catch (t) {
          return !1;
        }
      })() && (Da.ifr = 1);
    var t = {};
    (t[qr] = _i[qr] || ""),
      (t[Br] = _i[Br] || ""),
      (t[Hr] = _i[Hr] || ""),
      (t[Mr] = _i[Mr] || ""),
      t[Br] || t[Mr] || !t[qr] || (t[Br] = t[qr]),
      (_i[Vr] = t[qr] + ni + t[Br] + ni + t[Hr] + ni + t[Mr]),
      qa(Ur),
      qa(Vr);
  }
  function qa(t) {
    try {
      _i[t] ? (Da[t] = _i[t]) : delete Da[t];
    } catch (e) {}
  }
  function Ba() {
    return window[ot] && window[ot].inited;
  }
  function Ua(t, e) {
    return t === "[object " + e + "]";
  }
  function za(t) {
    return t && t.length > 0;
  }
  var Fa = [on, cn, sn, un];
  function Va(t) {
    return !!t;
  }
  function Ka(t, e) {
    var n = [];
    return (
      e &&
        i(t, function (t) {
          t &&
            t.url &&
            (i(Fa, function (e) {
              var n = !1;
              u(t[e]) &&
                ((t[e] = g(t[e], function (t) {
                  return t && s(t);
                })),
                (n = za(t[e]))),
                n
                  ? (e !== on && e !== sn) ||
                    (function (t, e) {
                      t[e] &&
                        i(t[e], function (n, r) {
                          n && (t[e][r] = n.toLowerCase());
                        });
                    })(t, e)
                  : delete t[e];
            }),
            n.push(t));
        }),
      n
    );
  }
  function Ya(t) {
    return t;
  }
  function Ja(t, e) {
    if (d(t))
      return (
        (t = +t),
        e
          ? null != e.min && t < e.min
            ? e.min
            : null != e.max && t > e.max
            ? e.max
            : t
          : t
      );
  }
  function Ga(t) {
    return Ja(t, { min: 0 });
  }
  var Wa,
    Xa,
    Qa,
    $a,
    Za = (function () {
      try {
        var t = J();
        return (
          window.localStorage.setItem(t, t),
          window.localStorage.removeItem(t),
          !0
        );
      } catch (e) {
        return !1;
      }
    })(),
    to = {};
  function eo(t, e, n) {
    if (to.localStorage && t && e) {
      var r = oa(ya(Mn));
      r || (r = {}),
        e && n ? (r[t] || (r[t] = {}), (r[t][e] = n)) : (r[t] = e),
        ga(Mn, A(r));
    }
  }
  function no(t, e) {
    if (to.localStorage && t && e) {
      var n = oa(ya(Mn));
      if (n && n[t]) return n[t][e];
    }
  }
  (to.localStorage = Za),
    (to.getEntriesByName =
      window.performance && p(window.performance.getEntriesByName)),
    (Qa = wi.createElement("div")),
    ($a = wi.createElement("div")).style &&
      (($a.style.cssText = "float:left;opacity:.5"),
      (to.opacity = "0.5" === $a.style.opacity),
      (to.cssFloat = !!$a.style.cssFloat),
      ($a.style.backgroundClip = "content-box"),
      ($a.cloneNode(!0).style.backgroundClip = ""),
      (to.clearCloneStyle = "content-box" === $a.style.backgroundClip),
      ((Qa = wi.createElement("div")).style.cssText =
        "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute"),
      ($a.innerHTML = ""),
      Qa.appendChild($a),
      (to.boxSizing =
        "" === $a.style.boxSizing ||
        "" === $a.style.MozBoxSizing ||
        "" === $a.style.WebkitBoxSizing),
      (to.reliableHiddenOffsets = function () {
        return (
          null == Wa &&
            ((n = wi.documentElement).appendChild(Qa),
            ($a.style.cssText =
              "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%"),
            (Wa = !1),
            window.getComputedStyle &&
              ((e = window.getComputedStyle($a)),
              (Wa = "1%" !== (e || {}).top),
              (e || {}).marginLeft,
              (e || { width: "4px" }).width,
              ($a.style.marginRight = "50%"),
              (e || { marginRight: "4px" }).marginRight,
              ((t = $a.appendChild(wi.createElement("div"))).style.cssText =
                $a.style.cssText =
                  "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0"),
              (t.style.marginRight = t.style.width = "0"),
              ($a.style.width = "1px"),
              parseFloat((window.getComputedStyle(t) || {}).marginRight),
              $a.removeChild(t)),
            ($a.style.display = "none"),
            (Xa = 0 === $a.getClientRects().length) &&
              (($a.style.display = ""),
              ($a.innerHTML = "<table><tr><td></td><td>t</td></tr></table>"),
              ((t = $a.getElementsByTagName("td"))[0].style.cssText =
                "margin:0;border:0;padding:0;display:none"),
              (Xa = 0 === t[0].offsetHeight) &&
                ((t[0].style.display = ""),
                (t[1].style.display = "none"),
                (Xa = 0 === t[0].offsetHeight))),
            n.removeChild(Qa)),
          Xa
        );
        var t, e, n;
      }));
  var ro = 65536,
    io = 6048e5;
  function ao(t, e) {
    var n = V(A(e));
    if (!(n > ro)) {
      var r = {},
        a = (function () {
          if (to.localStorage) return ya(Mn);
        })(),
        o = oa(a);
      if (o && o[qn])
        if (V(a) + n > ro) {
          var c = [];
          i(o[qn], function (t, e) {
            if (!t || !e) return !0;
            t.lastUpdate &&
              U() - t.lastUpdate < io &&
              c.push({ time: t.lastUpdate, key: e, value: t });
          });
          try {
            c.sort(function (t, e) {
              return e.time - t.time;
            });
          } catch (u) {}
          var s = n;
          i(c, function (t) {
            var e = V(A(t.value));
            if (s + e > ro) return !1;
            (r[t.key] = t.value), (s += e);
          });
        } else
          i(o[qn], function (t, e) {
            if (!t || !e) return !0;
            t.lastUpdate && U() - t.lastUpdate < io && (r[e] = t);
          });
      (r[t] = e), eo(qn, r);
    }
  }
  var oo,
    co = {},
    so = {},
    uo = ["domain", qr, Br, Hr, Mr, Ur, "release", "plugins"],
    fo = [
      "common",
      "page",
      "ajax",
      "jsError",
      "operation",
      "requestTracing",
      "resource",
      "configReload",
      zr,
      "webVitals",
      "enc",
      "breadcrumbs",
    ],
    lo = r({}, zr, {
      enabled: [Ya, !1],
      sampleRate: [Ja, -1, { min: -1, max: 1 }],
      uploadInterval: [Ga, 10],
      uploadEveryEvents: [Ga, 100],
      options: [Ya],
      privacyMode: [Ya],
      blockClass: [Ya],
      maskTextClass: [Ya],
      ignoreClass: [Ya],
    });
  function ho(t) {
    return yo(t, !0);
  }
  function po(t) {
    return yo(t, !1);
  }
  function vo(t, e) {
    return null != t && t > 0 ? t : e;
  }
  function mo(t, e, n) {
    var r;
    try {
      r = Ja(t, n);
    } catch (i) {}
    return null == r && (r = e), r;
  }
  function yo(t, e) {
    return null != t ? 1 == t : e;
  }
  function go(t, e) {
    return null != t ? t : e;
  }
  function bo() {
    var t, e, n, r;
    y(_i, {
      beacon: go(so.domain),
      id: go(so.id),
      key: go(so.key),
      appKey: go(so.appKey),
      token: go(so.token),
      env: go(so.env),
      releaseId: go(so.release),
      console_debug: po(so.common.debug),
      sessionMode: go(so.common.sessionMode, In),
      sendProtocol: go(so.common.sendProtocol),
      protocolDomainConfig: go(so.common.protocolDomainConfig),
      optCustomParamRules:
        ((n = so.common.paramCollection),
        (r = {}),
        i(n, function (t) {
          t &&
            t.key &&
            s(t.key) &&
            w(r[t.type] || [], t.key) < 0 &&
            (r[t.type] = r[t.type] || []).push(t.key);
        }),
        r),
      sendInterval: go(so.common.sendInterval, dr),
      sendMaxLen: go(so.common.sendMaxLen, lr),
      sendMaxSize: go(so.common.sendMaxSize, hr),
      useRemoteConfig: ho(so.common.useRemoteConfig),
      routerEnable: ho(so.page.routerEnabled),
      routerMode: go(so.page.routerMode, or),
      router_event_delay: vo(so.page.routerOperationDelay, Ke),
      collect_noajax_hashroute: po(so.page.uploadNoAjaxHashRouter),
      fp_threshold: go(so.page.fpThreshold, Yn),
      fs_threshold: go(so.page.fsThreshold, Jn),
      dr_threshold: go(so.page.drThreshold, Gn),
      le_threshold: go(so.page.leThreshold, Wn),
      pageLoadDelay: vo(so.page.pageLoadDelay, _n),
      lcpAsFs: ho(so.page.lcpAsFs),
      monitor_dom_mutation: ho(so.page.mutationEnabled),
      fs_resources: go(so.page.fsResources),
      hookAjax: ho(so.ajax.enabled),
      hookXhr: ho(so.ajax.xhrEnabled),
      hookFetch: ho(so.ajax.fetchEnabled),
      hookMPaas: ho(so.ajax.mPaaSEnabled),
      hook_xhr_setrequestheader: ho(so.ajax.hookXhrSetRequestHeader),
      ajaxBlacklist: go(so.ajax.ignoreUrls),
      ajRecordAll: go(so.ajax.recordAll),
      ajRecordEnabled: po(so.ajax.recordEnabled),
      ajRecords: go(so.ajax.recordConfig),
      ajRecordBlockEnabled: po(so.ajax.recordBlockEnabled),
      ajBlockRecords: go(so.ajax.recordBlockConfig),
      ajBodyMaxSize: 1024 * mo(so.ajax.bodyMaxSize, 10, { min: 1, max: 1024 }),
      jsErrorEnabled: ho(so.jsError.enabled),
      errorEnabled: ho(so.jsError.errorEnabled),
      unhandledrejectionEnabled: ho(so.jsError.unhandledrejectionEnabled),
      uploadEmptyFileErrors: po(so.jsError.uploadEmptyFileErrors),
      catchAsyncCallback: po(so.jsError.catchAsyncCallback),
      hook_auto_event: ho(so.operation.enabled),
      hook_inline_event: ho(so.operation.inlineEventEnabled),
      hookOnProperty: ho(so.operation.onPropertyEnabled),
      hookEventListener: ho(so.operation.eventListenerEnabled),
      monitorRage: ho(so.operation.rageClickEnabled),
      inline_event_associate_threshold: vo(
        so.operation.inlineEventThreshold,
        Ae
      ),
      hook_cross_page: ho(so.operation.crossPageEnabled),
      eventResources: go(so.operation.itemUrls),
      eventResourcesIgnore: go(so.operation.ignoreItemUrls),
      eventTimeout: go(so.operation.timeout, Et),
      resourceAssociateThreshold: vo(
        so.operation.resourceAssociationThreshold,
        kn
      ),
      resourceWaitTime: vo(so.operation.resourceAssociationWaitTime, Sn),
      x_server_switch: ho(so.requestTracing.enabled),
      serverTiming: po(so.requestTracing.serverTimingEnabled),
      corsDomains: go(so.requestTracing.corsDomains),
      apmHeaders: go(so.requestTracing.apmHeaders),
      autoAddApmHeader: po(so.requestTracing.autoAddApmHeader),
      propagators:
        ((t = go(so.requestTracing.propagators, [Jr])),
        (e = {}),
        i(t, function (t) {
          e[t] = !0;
        }),
        e),
      monitorResources: go(so.resource.keyUrls),
      hook_iframe: ho(so.resource.iframeEnabled),
      configLoad: ho(so.configReload.enabled),
      configLoadInterval: vo(so.configReload.expire, Bn),
      webVitalsEnabled: ho(so.webVitals.enabled),
      webVitalsFIDEnabled: ho(so.webVitals.fidEnabled),
      webVitalsCLSEnabled: ho(so.webVitals.clsEnabled),
      webVitalsTTIEnabled: ho(so.webVitals.ttiEnabled),
      webVitalsTBTEnabled: ho(so.webVitals.tbtEnabled),
      webVitalsTTIThreshold: go(so.webVitals.ttiThreshold, Dr),
      webVitalsTTIMutationCheckRate: go(so.webVitals.ttiMutationCheckRate, Pr),
      encEnabled: po(so.enc.enabled),
      encMode: go(so.enc.mode),
      encPubKey: go(so.enc.pubKey),
      encReplayEnabled: po(so.enc.replayEnabled),
      bcEnabled: ho(so.breadcrumbs.enabled),
      bcConsoleEnabled: ho(so.breadcrumbs.consoleEnabled),
      bcDomEnabled: ho(so.breadcrumbs.domEnabled),
      bcFetchEnabled: ho(so.breadcrumbs.fetchEnabled),
      bcXhrEnabled: ho(so.breadcrumbs.xhrEnabled),
      bcHistoryEnabled: ho(so.breadcrumbs.historyEnabled),
      bcNavigationEnabled: ho(so.breadcrumbs.navigationEnabled),
      bcMaxCacheSize: vo(so.breadcrumbs.maxCacheSize, vr),
      bcParseConsoleParam: po(so.breadcrumbs.parseConsoleParam),
    }),
      i(lo, function (t, e) {
        var n = so[e] || {},
          r = (_i[e] = {});
        i(t, function (t, e) {
          var i = t[0],
            a = t[1],
            o = t[2];
          try {
            r[e] = i.call(null, n[e], o);
          } catch (c) {}
          null == r[e] && null != a && (r[e] = a);
        });
      });
  }
  function wo() {
    i(_i.corsDomains, function (t) {
      return "*" !== t || ((_i.apmEnableAllCorsDomains = !0), !1);
    });
    var t,
      e,
      n,
      r,
      a,
      o = (function () {
        var t, e;
        try {
          t = window.location.protocol;
        } catch (i) {}
        var n = _i.protocolDomainConfig;
        if (
          (n &&
            (e = t === ja ? n.https : t === Ia ? n.http : n.other || n.https),
          !e)
        ) {
          var r = _i.sendProtocol;
          r && (t = r),
            t !== ja && t !== Ia && (t = ja),
            _i.beacon && (e = t + "//" + _i.beacon);
        }
        return e && (Na = e), e;
      })();
    Ma();
    try {
      (t = _i.networkRecord = {}),
        (e = !1),
        (n = !1),
        (r = {}),
        (a = _i.ajRecordAll) &&
          ((r[tn] = Va(a.urlParams)),
          (r[en] = Va(a[on])),
          (r[nn] = Va(a[cn])),
          (r[rn] = Va(a[sn])),
          (r[an] = Va(a[un])),
          (e = !(!r[tn] || r[en] || r[nn] || r[rn] || r[an])),
          (n = !!(r[tn] || r[en] || r[nn] || r[rn] || r[an]))),
        (t.config = { enabled: n, urlOnly: e, pos: r }),
        n &&
          !e &&
          ((t.white = Ka(_i.ajRecords, _i.ajRecordEnabled)),
          (t.black = Ka(_i.ajBlockRecords, _i.ajRecordBlockEnabled)));
    } catch (c) {}
    return o;
  }
  function Eo() {
    return _i;
  }
  function To(t, e) {}
  function xo(t) {
    return t[qr] || t[Mr] || t[Br];
  }
  function _o(t) {
    !(function (t) {
      var e = t[Fr];
      if (null != e) {
        var n = e.indexOf("@");
        if (!(n <= 0)) {
          var r,
            i,
            a,
            o = e.substring(0, n);
          if (
            ((r = e.substring(n + 1)),
            0 === o.indexOf(Xr)
              ? ((i = o.substring(Xr.length)), (a = Xr))
              : 0 === o.indexOf(Qr)
              ? ((i = o.substring(Qr.length)), (a = Qr))
              : (i = o),
            i)
          ) {
            if (a && (!t.common || !t.common.sendProtocol)) {
              var c = a.substring(0, a.length - 2);
              (t.common = t.common || {}).sendProtocol = c;
            }
            t.domain = r;
            var s = i.split(ni);
            (t[qr] = s[0]), (t[Br] = s[1]), (t[Hr] = s[2]), (t[Mr] = s[3]);
          }
        }
      }
    })(t);
    var e = (function (t) {
      if (Ba()) {
        var e = !so[Mr] && t[Mr];
        return (
          so[Mr] &&
            !t[Mr] &&
            i([Hr, Br, Mr, qr], function (t) {
              try {
                delete so[t];
              } catch (e) {}
            }),
          e
        );
      }
    })(t);
    if (e) return { valid: !1 };
    var n = (function (t) {
        var e;
        return (
          (e = xo(t) ? (t[Mr] ? ti + t[Mr] : t[qr] ? Zr + t[qr] : ei) : oo),
          (oo = e || ei)
        );
      })(t),
      r = {};
    (t && t.common && !1 === t.common.useRemoteConfig) ||
      n === ei ||
      (r = no(qn, n) || {}),
      (function (t, e, n) {
        (t = t || {}), (e = e || {});
        var r = (co[n] = co[n] || {});
        i(uo, function (n) {
          var i = e[n] || t[n];
          i && (r[n] = i);
        }),
          i(fo, function (n) {
            r[n] = y(r[n] || {}, t[n], e[n]);
          }),
          (so = r);
      })(t, r.config, n),
      bo();
    var a = wo();
    return { config: so, configKey: n, storedConfig: r, valid: xo(_i) && a };
  }
  var So,
    ko = {};
  function Co(t, e) {
    t && p(e) && (ko[t] || (ko[t] = []), ko[t].push(e));
  }
  function Ao(t, e) {
    t &&
      ko[t] &&
      0 !== ko[t].length &&
      i(ko[t], function (t) {
        try {
          t(e);
        } catch (n) {}
      });
  }
  function Oo() {
    return So;
  }
  function Ro(t) {
    (So = t[0]), t[0] && (Da.sid = t[0]), t[1] && (Da.__s = +t[1]);
  }
  function No() {
    return _i.sessionMode == In && to.localStorage;
  }
  var Io = !0;
  function jo(t) {
    t && 3 === t.length && (ga(Re, t.join(De)), Ro(t));
  }
  function Do(t) {
    var e = Oo(),
      n = U();
    t || (t = J());
    var r = [t, n, n];
    jo(r);
    var i = Oo();
    return (
      Ao(rr, { prev: e, current: i, init: Io }),
      null != X.nbsJsBridgeData.sessionId && (X.nbsJsBridgeData.sessionId = i),
      r
    );
  }
  function Po() {
    var t = (function () {
        var t = ya(Re);
        if (t) {
          var e = t.split(De);
          return e && ((e[1] = +e[1]), (e[2] = +e[2])), e;
        }
        return null;
      })(),
      e = !0,
      n = X.nbsJsBridgeData.sessionId;
    return (
      (e =
        !(!t || 3 !== t.length || !t[0] || isNaN(t[1]) || isNaN(t[2])) &&
        (null != n ? n === t[0] : U() - t[2] <= Ie && U() - t[1] <= je)) ||
        Do(n),
      { session: t, valid: e }
    );
  }
  var Lo,
    Ho = new v(),
    Mo =
      (r((Lo = {}), Tt, "c"),
      r(Lo, xt, "e"),
      r(Lo, _t, "a"),
      r(Lo, kt, "i"),
      r(Lo, Ct, "p"),
      r(Lo, Ot, "j"),
      r(Lo, jn, "event"),
      r(Lo, Nt, "b"),
      Lo),
    qo = "page",
    Bo = "size",
    Uo = "len",
    zo = "timer",
    Fo = et,
    Vo = ["ps", "ss", "rs"],
    Ko = { size: 0, q: [], options: null };
  function Yo(t, e, n) {
    var r = { msg: t, size: e, options: n };
    n.crossPage ? Ko.q.unshift(r) : Ko.q.push(r),
      (Ko.size += e),
      Ko.options
        ? i(n, function (t, e) {
            if (null == Ko.options[e] || "query" !== e) Ko.options[e] = t;
            else {
              var r = Ko.options.query;
              i(n.query, function (t, e) {
                w(Vo, e) > -1
                  ? null == r[e]
                    ? (r[e] = t)
                    : (r[e] += t)
                  : (r[e] = t);
              });
            }
          })
        : (Ko.options = n);
  }
  function Jo(t) {
    var e = mi({ type: Tt, _debug: y(t || {}, Si) }, yi());
    return X.opt_custom_param && (e.optCustomParam = X.opt_custom_param), e;
  }
  function Go(t, e) {
    if (t && t.type) {
      (e = e || {}).query = e.query || {};
      var n = 1 === e.query.ps;
      try {
        e.cb && (e.cb.call(null, t), delete e.cb);
      } catch (a) {}
      var r = Wo(t) + A(t),
        i = V(r);
      return Ko.size + i >= _i.sendMaxSize
        ? (Xo({ tr: Bo }), void Yo(r, i, e))
        : Ko.q.length + 1 >= _i.sendMaxLen
        ? (Yo(r, i, e), void Xo({ tr: Uo }))
        : n
        ? (Yo(r, i, e), void Xo({ tr: qo }))
        : void Yo(r, i, e);
    }
  }
  function Wo(t) {
    var e = Mo[t.type];
    return e || (e = t.type), e;
  }
  function Xo(t) {
    if (0 !== Ko.q.length) {
      var e, n;
      No() && ((e = Po()), (n = e.session), e.valid && ((n[2] = U()), jo(n)));
      var r = Ko.q,
        a = Ko.options,
        o = a.requestInfo;
      o || (o = Ha()),
        y(o.query, a.query || {}, { __r: U() }),
        (o.path = "/action");
      var c = a.commonActionInfoMessage ? a.commonActionInfoMessage : Jo(t),
        s = Wo(c) + A(c),
        u = V(s),
        f = r,
        d = !1;
      if (Ko.size + u >= _i.sendMaxSize) {
        for (var l = u, h = []; r.length > 0; ) {
          var p = r[0];
          if (!p) break;
          var v = l + p.size;
          if (!(v < _i.sendMaxSize)) break;
          h.push(r.shift()), (l = v);
        }
        h.length > 0 && ((f = h), (d = !0));
      }
      (o.data = [s]),
        i(f, function (t) {
          t.msg && o.data.push(t.msg);
        });
      var m = (function (t) {
          var e = t.beacon,
            n = t.path,
            r = t.query;
          return pa("".concat(e).concat(n), r);
        })(o),
        g = o.data.join("\n");
      aa.emit("send", { url: m, body: g, type: "action" }),
        (Ko.q = []),
        (Ko.size = 0),
        (Ko.options = null),
        d &&
          i(r, function (t) {
            Yo(t.msg, t.size, t.options);
          });
    }
  }
  var Qo,
    $o = [_t, St, kt, Rt];
  function Zo(t, e) {
    i(t, function (t) {
      i(e, function (e) {
        t.cid === e.id &&
          (t.state || (t.state = e.state),
          e.items && e.items.length > 0 && (t.items = e.items));
      });
    }),
      i(e, function (t) {
        Zo(t.items, t.children);
      });
  }
  function tc(t) {
    var e;
    (t = t || {}),
      (this.id = ++X.uniqueId),
      (this.parent = t.parent || null),
      (this.children = []),
      (this.name = t.name || ""),
      (this.type = t.type || xt),
      (this.subType = this.type === xt ? t.subType || "click" : t.subType),
      (this.items = []),
      (this.remain =
        ((e = {}),
        i($o, function (t) {
          e[t] = { current: 0, children: 0 };
        }),
        e)),
      (this.s = t.s || U()),
      (this.e = null),
      (this.data = t.data),
      (this.state = Pt),
      (this.crossPage = t.crossPage || !1),
      (this.postComposer = []),
      (this.endLock = t.endLock),
      this.registerTimeout(),
      (this.closed = !1),
      (this.isTimeout = !1),
      (this.cleared = !1),
      (this.stateChanged = !1),
      (this.actionCount = {
        ajax: this.type === _t ? 1 : 0,
        iframe: this.type === kt ? 1 : 0,
      }),
      (this.sent = !1),
      (this.sendOptions = {}),
      (this.spe = null),
      null != this.parent && this.parent.children.push(this),
      (this.eventData = null),
      (this.resource = {
        handler: {},
        statistic: {},
        record: { timeout: [], error: [] },
      }),
      (this._ctx = {}),
      (this.aid = t.aid || (t.parent && t.parent.aid)),
      (this.associated = !1);
  }
  function ec(t) {
    var e = Oo(),
      n = { id: t || J(), time: U() };
    !(function (t) {
      Ro([t.id, t.startTime]);
    })(n);
    var r = Oo();
    return Ao(rr, { prev: e, current: r, init: !1 }), n;
  }
  function nc() {
    var t, e;
    No() && ((t = Po()), (e = t.session), t.valid && jo(e), (Io = !1));
  }
  function rc() {
    if (!Qo) {
      try {
        Qo = window.performance.timing.navigationStart;
      } catch (t) {}
      Qo || (Qo = b);
    }
    return Qo;
  }
  (tc.prototype.end = function (t) {
    var e;
    this.closed
      ? !this.cleared && _i.console_debug
      : (t &&
          ((this.actionCount.ajax += t.actionCount.ajax),
          (this.actionCount.iframe += t.actionCount.iframe),
          (function (t, e) {
            i(t, function (t) {
              t.cid === e.id &&
                e.items &&
                e.items.length > 0 &&
                (t.items = e.items);
            });
          })(this.items, t),
          this.updateRemain(-1, t.type)),
        this.endLock ||
          ((this.isNoRemain() || this.isTimeout || this.associated) &&
            ((this.e = U()),
            (this.closed = !0),
            this.i && clearTimeout(this.i),
            this.e - this.s > _i.eventTimeout && (this.isTimeout = !0),
            this.setState(this.isTimeout ? Ht : Lt),
            this.data && (this.data.state = this.state),
            this.parent
              ? this.parent.end(this)
              : (this.isTimeout &&
                (this.isRemainMeaningfulAction() || this.isMeaningfulAction())
                  ? (e = this.composeTimeoutActionData())
                  : (this.isMeaningfulAction() || this.associated) &&
                    (e = this.composeActionData()),
                e &&
                  ((this.eventData = e),
                  this.spe && this.buildEventDataWithSpe(),
                  this.send()),
                (X.context = null)))));
  }),
    (tc.prototype.isNoRemain = function (t) {
      t = t || {};
      var e = !0;
      return (
        i(this.remain, function (n, r) {
          return (
            !!(t.ignoreFields && w(t.ignoreFields, r) > -1) ||
            (n.current <= 0 && (!!t.testCurrent || n.children <= 0)
              ? void 0
              : ((e = !1), !1))
          );
        }),
        e
      );
    }),
    (tc.prototype.clear = function () {
      (this.closed = !0), (this.cleared = !0), this.i && clearTimeout(this.i);
    }),
    (tc.prototype.isMeaningfulAction = function () {
      return (
        this.actionCount.ajax > 0 ||
        this.actionCount.iframe > 0 ||
        this.type === Ct
      );
    }),
    (tc.prototype.isRemainMeaningfulAction = function () {
      return (
        this.remain.ajax.current > 0 ||
        this.remain.ajax.children > 0 ||
        this.remain.iframe.current > 0 ||
        this.remain.iframe.children > 0
      );
    }),
    (tc.prototype.timeout = function () {
      (this.isTimeout = !0), this.setState(Ht), this.end(null, !0);
    }),
    (tc.prototype.setData = function (t) {
      this.data || (this.data = {}), y(this.data, t || {});
    }),
    (tc.prototype.composeActionData = function () {
      var t = y({}, this.data || {});
      return (
        this.items &&
          this.items.length > 0 &&
          (t.items = (this.items || []).slice()),
        {
          type: this.type,
          subType: this.subType,
          start: this.s,
          end: this.e,
          duration: this.e - this.s > 0 ? this.e - this.s : 0,
          data: t,
        }
      );
    }),
    (tc.prototype.composeTimeoutActionData = function () {
      return this.collectActionDataFromTop(), this.composeActionData();
    }),
    (tc.prototype.collectActionDataFromTop = function () {
      Zo(this.items, this.children);
    }),
    (tc.prototype.collectCrossPageData = function (t) {
      if (
        (t || (t = []),
        (this.crossPage = !0),
        this.data && (this.data.crossPage = !0),
        t.unshift(this.data),
        this.parent)
      )
        return this.parent.collectCrossPageData(t);
      var e = { type: this.type, subType: this.subType, start: this.s };
      return (
        (this.isNoRemain() || 1 === this.children.length) && this.clear(),
        {
          action: e,
          data: t,
          requestInfo: Ha(),
          commonActionInfo: Jo(),
          fromUrl: Da.ref,
        }
      );
    }),
    (tc.prototype.canEnd = function (t) {
      return !this.closed && this.isNoRemain(y({ testCurrent: !0 }, t));
    }),
    (tc.prototype.updateRemain = function (t, e) {
      if (this.remain[e]) {
        e || (e = _t);
        var n = t || 0;
        this.remain[e].current = this.remain[e].current + n;
        for (var r = this.parent; r; )
          (r.remain[e].children = r.remain[e].children + n), (r = r.parent);
      }
    }),
    (tc.prototype.setState = function (t) {
      return (
        !this.stateChanged && ((this.state = t), (this.stateChanged = !0), !0)
      );
    }),
    (tc.prototype.current = function () {
      return X.context;
    }),
    (tc.prototype.buildEventDataWithSpe = function () {
      if (this.spe && this.eventData && this.eventData.data) {
        var t = this.spe.xhrs;
        (this.spe.hasAjax = t && t.length > 0),
          delete this.spe.xhrs,
          (this.eventData.data.spe = this.spe);
      }
    }),
    (tc.prototype.setSpe = function (t) {
      if (t) return (this.spe = t), this.sent;
    }),
    (tc.prototype.send = function () {
      var t = this;
      if (!this.sent) {
        var e = {};
        this.spe &&
          ((e.query = { ss: 1 }), this.spe.type === qe && (e.query.rs = 1)),
          this.postComposer.length > 0 &&
            i(this.postComposer, function (e) {
              e.call(null, t);
            }),
          this.setSendOptions(e),
          Go(this.eventData, this.sendOptions),
          (this.sent = !0);
      }
    }),
    (tc.prototype.addResource = function (t, e) {
      var n = this;
      if (t && !t[Cn]) {
        var r = {
            start: e,
            name: t.src || "",
            type: t.nodeName ? t.nodeName.toLowerCase() : "",
            timeout: !1,
            load: !1,
            error: !1,
            finished: !1,
          },
          i = J();
        (t[Cn] = i),
          (this.resource.handler[i] = r),
          this.countResource("total", t.src),
          this.updateRemain(1, Rt),
          (r.timerId = F(function () {
            var e = n.resource.handler[i];
            e &&
              !e.finished &&
              (n.countResource("timeout", t.src),
              (e.timeout = !0),
              (e.finished = !0),
              n.updateRemain(-1, Rt),
              n.end());
          }, _i.resourceWaitTime)),
          (r.handler = function (e) {
            var r = n.resource.handler[i];
            if (r && !r.finished) {
              clearTimeout(r.timerId), n.updateRemain(-1, Rt);
              try {
                n.countResource(e.type, t.src), (r[e.type] = !0);
              } catch (e) {}
              (r.finished = !0), n.end();
            }
          }),
          0 !== r.name.indexOf("data:image/")
            ? (t.addEventListener("load", r.handler),
              t.addEventListener("error", r.handler))
            : r.handler({ type: "load" });
      }
    }),
    (tc.prototype.countResource = function (t, e, n) {
      this.resource.statistic[t] || (this.resource.statistic[t] = {}),
        this.resource.statistic[t][e] || (this.resource.statistic[t][e] = 0),
        (this.resource.statistic[t][e] += n || 1);
    }),
    (tc.prototype.hasChildType = function (t) {
      var e = !1;
      return (
        i(this.children, function (n) {
          if (n.type === t) return (e = !0), !1;
        }),
        e
      );
    }),
    (tc.buildImmediateAction = function (t, e, n, r) {
      var i = y(
        { type: t, state: "finish" },
        (r = r || {}).actionOptions || {}
      );
      return (
        e && (i.subType = e),
        n && (i.data = n),
        i.data && (i.data.state = i.state),
        r.notSend || Go(i, r.sendOptions),
        i
      );
    }),
    (tc.getRootContext = function (t, e) {
      if (!t && !p(e)) return null;
      for (; t; ) {
        if (null == t.parent && e.call(null, t)) return t;
        t = t.parent;
      }
      return null;
    }),
    (tc.containContext = function (t, e) {
      if (!t && !p(e)) return !1;
      for (; t; ) {
        if (e.call(null, t)) return !0;
        t = t.parent;
      }
      return !1;
    }),
    (tc.prototype.toJSON = function () {
      return undefined;
    }),
    (tc.prototype.setSendOptions = function (t) {
      this.sendOptions || (this.sendOptions = {}), y(this.sendOptions, t);
    }),
    (tc.prototype.registerTimeout = function () {
      var t = this;
      null == this.parent &&
        this.type !== Ct &&
        (this.i = F(function () {
          t.timeout();
        }, _i.eventTimeout));
    }),
    (tc.prototype.addPostComposer = function (t) {
      this.postComposer.push(t);
    }),
    (tc.prototype.markAssociated = function () {
      this.isDomEvent() &&
        this.children.length <= 0 &&
        ((this.associated = !0), this.end());
    }),
    (tc.prototype.isDomEvent = function () {
      return this.type === xt && this.subType !== be;
    });
  var ic =
    window.performance && p(window.performance.now)
      ? function () {
          return performance.now();
        }
      : function () {
          return U() - rc();
        };
  function ac(t) {
    try {
      return t > 1e12;
    } catch (e) {}
    return !1;
  }
  function oc(t) {
    return t - rc();
  }
  function cc(t) {
    (t = t || {}),
      (this._capacity = t.capacity || 10),
      (this._cache = {}),
      (this._cacheKeys = []),
      (this._size = 0);
  }
  function sc(t, e, n) {
    if (t && n && p(n)) {
      var r = t[e];
      if (!r || !r._wrapped) {
        var i = n(r, e);
        return i && (i._wrapped = !0), (t[e] = i), i;
      }
    }
  }
  function uc(t, e) {
    var n;
    return (
      t &&
        ((n = !0),
        i(
          t,
          function () {
            return (n = !1);
          },
          e
        )),
      !!n
    );
  }
  (cc.prototype.put = function (t, e) {
    if (!this._cache[t]) {
      if (this._size >= this._capacity)
        try {
          var n = this._cacheKeys.shift();
          this._size--, (this._cache[n] = null), delete this._cache[n];
        } catch (r) {}
      this._cacheKeys.push(t), this._size++;
    }
    this._cache[t] = e;
  }),
    (cc.prototype.get = function (t) {
      return this._cache[t];
    });
  var fc = p(Object.keys)
    ? function (t) {
        var e = 0;
        try {
          e = Object.keys(t).length;
        } catch (n) {}
        return e;
      }
    : function (t) {
        var e = 0;
        return (
          i(t, function () {
            e++;
          }),
          e
        );
      };
  function dc(t, e, n) {
    null == n || uc(n) || (t[e] = n);
  }
  function lc(t, e, n) {
    null != n && (t[e] = n);
  }
  var hc = [ye, ge],
    pc = 1,
    vc = 2;
  function mc(t, e) {
    return function (n) {
      if (
        window[bt].hook &&
        window[bt].hook.eventCb &&
        (function (t) {
          return (
            t &&
            t.target instanceof window.HTMLElement &&
            t.currentTarget instanceof window.HTMLElement
          );
        })(n)
      ) {
        var r = { originalCallback: t, eventHandlerType: e };
        return window[bt].hook.eventCb.call(this, arguments, r);
      }
      return t.apply(this, arguments);
    };
  }
  function yc(t) {
    var e;
    return (
      !(function (t) {
        return p(t);
      })(t)
        ? (function (t) {
            return f(t) && p(t.handleEvent);
          })(t) && (e = vc)
        : (e = pc),
      { isValid: t && e, listenerType: e }
    );
  }
  function gc(t) {
    return function () {
      try {
        var e = arguments[0],
          n = arguments[1],
          r = arguments[2],
          i = !0;
        r && f(r) && r[ve] && (i = !1);
        var a = yc(n),
          o = a.isValid,
          c = a.listenerType;
        if (i && hc.indexOf(e) > -1 && o && c === pc) {
          var s = n[Ue];
          s ||
            (!(function (t, e, n) {
              try {
                if (p(Object.defineProperty))
                  try {
                    Object.defineProperty(t, e, {
                      value: n,
                      writable: !0,
                      configurable: !0,
                    });
                  } catch (r) {
                    t[e] = n;
                  }
                else t[e] = n;
              } catch (r) {}
            })(n, Ue, mc(n, we)),
            (s = n[Ue])),
            s && (arguments[1] = s);
        }
      } catch (u) {}
      return t && t.apply(this, arguments);
    };
  }
  function bc() {
    try {
      window.EventTarget &&
        (sc(window.EventTarget.prototype, "addEventListener", function (t) {
          return gc(t);
        }),
        sc(window.EventTarget.prototype, "removeEventListener", function (t) {
          return (function (t) {
            return function (e, n) {
              try {
                if (n && hc.indexOf(e) > -1) {
                  var r = n[Ue];
                  if (r) {
                    var i = [].slice.call(arguments);
                    (i[1] = r), t.apply(this, i);
                  }
                }
              } catch (a) {}
              return t && t.apply(this, arguments);
            };
          })(t);
        }));
    } catch (t) {}
  }
  var wc,
    Ec = [ye, ge],
    Tc = [],
    xc = new cc({ capacity: 5 }),
    _c = new cc({ capacity: 5 }),
    Sc = null;
  function kc(t) {
    return !!t.match(kc.regex);
  }
  function Cc(t) {
    try {
      if (!t) return "";
      for (
        var e = [],
          n = t.parentNode,
          r = function () {
            var r,
              i,
              a = t.tagName;
            i = (r = n.children)
              ? 1 ===
                g(r, function (t) {
                  return t.tagName === a;
                }).length
                ? a
                : "".concat(a, ":nth-child(").concat(1 + w(r, t), ")")
              : a;
            var o = t.id ? "#".concat(t.id) : "",
              c = t.className;
            s(c) && (c = sa(c));
            var u = "";
            if (c) {
              var f = c.split(" ");
              f &&
                (u = g(f, function (t) {
                  return sa(t);
                })
                  .map(function (t) {
                    return ".".concat(t);
                  })
                  .join(""));
            }
            e.unshift("".concat(i).concat(o).concat(u)),
              (n = (t = n).parentNode);
          };
        n;

      )
        r();
      return "".concat(e.join(" > ")).toLowerCase();
    } catch (i) {
      return "";
    }
  }
  function Ac(t, e, n) {
    var r,
      i = t.target,
      a = i.nodeName,
      o = i.id,
      c = i.className,
      s = i.title,
      u = i.value,
      f = i.innerText,
      d = a + o,
      l = (function (t) {
        return !(
          (null == t.isTrusted && null == t.pointerType) ||
          (t.isTrusted && (null == t.pointerType || t.pointerType))
        );
      })(t),
      h = {
        type: xt,
        id: o,
        nodeName: a,
        className: c,
        title: s,
        value: u,
        text: a === Se ? "" : ((r = f), (r && r.substr(0, 256)) || ""),
        path: Cc(t.target),
        trigger: l ? Xe : We,
        range: Qe,
      },
      p = t[me];
    if ((p || ((p = J()), (t[me] = p)), (h.eventId = p), l)) {
      var v = t.timeStamp && U();
      Sc && Math.abs(v - Sc.timestamp) <= fn && (h.refId = Sc.eventId);
    } else Sc = { timestamp: t.timeStamp && U(), eventId: h.eventId };
    if (xe === a) {
      var m = t.target.getAttribute("src");
      m && !kc(m) && (h.src = m);
    }
    if (_e === a) {
      var g = t.target.getAttribute("href");
      g && (h.href = g);
    }
    return (
      (h.eventHandlerType = e),
      (h.actionId = p),
      new tc(
        y({ name: d, type: xt, subType: t.type || ye, data: h, aid: p }, n)
      )
    );
  }
  function Oc(t, e) {
    X.context = Ac(t, e);
  }
  function Rc() {
    var t = X.context;
    t && t.canEnd() && t.end(), (X.context = null);
  }
  function Nc(t, e) {
    var n,
      r = e.originalCallback,
      i = e.eventHandlerType,
      a = t[0],
      o = !(a && a.target && Ec.indexOf(a.type) > -1);
    if (!o)
      try {
        Oc.call(this, a, i);
      } catch (c) {}
    try {
      n = r.apply(this, t);
    } finally {
      if (!o)
        try {
          X.context &&
            !X.context.canEnd({ ignoreFields: [St] }) &&
            ((a[pe] = !0),
            a[me] && X.context.isDomEvent() && _c.put(a[me], X.context)),
            Rc.apply(this);
        } catch (c) {}
    }
    return n;
  }
  function Ic(t) {
    var e =
        window.performance && window.performance.timing
          ? window.performance.timing.navigationStart
          : b,
      n = t.timeStamp;
    return (n = n ? (ac(n) ? n : Math.round(t.timeStamp + e)) : U());
  }
  function jc(t, e) {
    return Math.abs(t - e) < _i.inline_event_associate_threshold;
  }
  function Dc(t) {
    var e = g(Tc, function (t) {
        return !t[pe];
      }),
      n = e[e.length - 1];
    if (n) {
      var r,
        i = Ic(n);
      if (jc(i, t))
        return (
          n[me] && (r = xc.get(n[me])),
          r || ((r = Ac(n, Te, { s: i })), n[me] && xc.put(n[me], r)),
          r
        );
    }
  }
  function Pc() {
    _i.hook_auto_event &&
      (window[bt].hook && (window[bt].hook.eventCb = Nc),
      !window[bt].listenerHooked &&
        window.HTMLElement &&
        (_i.hookEventListener && bc(),
        _i.hookOnProperty &&
          (function () {
            try {
              if (!Object.getOwnPropertyDescriptor || !Object.defineProperty)
                return;
              i(hc, function (t) {
                var e = "on" + t,
                  n = Object.getOwnPropertyDescriptor(
                    window.HTMLElement.prototype,
                    e
                  );
                if (!n) return !0;
                var r = n.get,
                  i = n.set;
                if (!r || !i) return !0;
                Object.defineProperty(window.HTMLElement.prototype, e, {
                  get: function () {
                    return r.apply(this, arguments);
                  },
                  set: function () {
                    try {
                      var t = arguments[0];
                      t && (arguments[0] = mc(t, Ee));
                    } catch (e) {}
                    i.apply(this, arguments);
                  },
                  configurable: !0,
                  enumerable: !0,
                });
              });
            } catch (t) {}
          })()),
      _i.hook_inline_event &&
        i(Ec, function (t) {
          document.addEventListener(
            t,
            function (t) {
              Tc.length >= ue && Tc.shift(), Tc.push(t);
            },
            r({ capture: !0 }, ve, !0)
          );
        }));
  }
  function Lc(t) {
    (this.data = []), (this.maxSize = t.maxSize);
  }
  function Hc(t) {
    _i.bcEnabled &&
      t &&
      t.category &&
      (t.timestamp || (t.timestamp = U()),
      t.type || (t.type = mr),
      t.level || (t.level = gr),
      t.message || (t.message = ""),
      wc && wc.add(t));
  }
  function Mc(t) {
    var e = {},
      n = t.split(":");
    if (!n) return e;
    if (1 === n.length)
      (e.filename = n[0]), (e.lineno = 0), (e.colno = 0), (e.resolveLevel = Dn);
    else if (n.length >= 2) {
      var r,
        i = n[n.length - 1],
        a = n[n.length - 2],
        o = !isNaN(+i),
        c = !isNaN(+a);
      o && c
        ? ((r = 2), (e.lineno = +a), (e.colno = +i), (e.resolveLevel = Ln))
        : o
        ? ((r = 1), (e.lineno = +i), (e.colno = 0), (e.resolveLevel = Pn))
        : ((r = 0), (e.lineno = 0), (e.colno = 0), (e.resolveLevel = Dn)),
        (e.filename = (n.slice(0, n.length - r) || []).join(":"));
    }
    return e;
  }
  function qc(t) {
    if (t) {
      var e,
        n = {};
      return (
        i(t.split(/\n/), function (t) {
          var r = (function (t) {
            if (t && (t = sa(t))) {
              var e;
              if (0 === t.indexOf("at ")) {
                var n = t.indexOf("("),
                  r = t.indexOf(")");
                if (n > -1 && r > -1) {
                  var i = n + 1;
                  i > r && (i = r);
                  var a = t.substring(i, r);
                  a && (e = Mc(a));
                } else {
                  var o = t.split(" "),
                    c = o[o.length - 1];
                  c && (e = Mc(c));
                }
              } else if (t.indexOf("@") > -1) {
                var s = t.split("@");
                s[1] && (e = Mc(s[1]));
              }
              return e;
            }
          })(t);
          if (!r) return !0;
          var i = r.resolveLevel;
          if (i === Ln) {
            if (r.filename && r.lineno > 0 && r.colno > 0) return (e = r), !1;
          } else n[i] || (n[i] = r);
        }),
        e || (e = n[Pn] || n[Dn]),
        e
      );
    }
  }
  (kc.regex =
    /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*)\s*$/i),
    (Lc.prototype.add = function (t) {
      t &&
        (this.data.length === this.maxSize && this.data.shift(),
        this.data.push(t));
    }),
    (Lc.prototype.getAll = function () {
      return this.data;
    });
  var Bc = Object.create
      ? Object.create
      : function (t) {
          function e() {}
          return (e.prototype = t), new e();
        },
    Uc = 1,
    zc = 2,
    Fc = 4,
    Vc = 8;
  function Kc(t, e) {
    (this.flags = 0),
      p(t.create) && ((this.create = t.create), (this.flags |= Uc)),
      p(t.before) && ((this.before = t.before), (this.flags |= zc)),
      p(t.after) && ((this.after = t.after), (this.flags |= Fc)),
      p(t.error) && ((this.error = t.error), (this.flags |= Vc)),
      (this.data = e);
  }
  var Yc,
    Jc = Kc.prototype;
  function Gc(t, e) {
    return !Yc || Yc.flags <= 0
      ? t
      : (function (t, e) {
          var n = e || Yc.data;
          if (!n && 0 != (Yc.flags & Uc)) {
            var r = Yc.create(Yc.data);
            r !== undefined && (n = r);
          }
          return function () {
            var e;
            if (
              (0 != (Yc.flags & zc) && Yc.before(this, n),
              _i.catchAsyncCallback)
            ) {
              try {
                e = t.apply(this, arguments);
              } catch (r) {
                throw (0 != (Yc.flags & Vc) && Yc.error(n, r), r);
              }
              0 != (Yc.flags & Fc) && Yc.after(this, n);
            } else
              try {
                e = t.apply(this, arguments);
              } finally {
                0 != (Yc.flags & Fc) && Yc.after(this, n);
              }
            return e;
          };
        })(t, e);
  }
  function Wc(t, e) {
    return (function (t) {
      return function () {
        var e;
        try {
          e = t.apply(this, arguments);
        } finally {
          X.context = null;
        }
        return e;
      };
    })(Gc(t, e));
  }
  function Xc() {
    (this.id = null), (this.active = null), (this._set = []);
  }
  function Qc() {
    var t = new Xc();
    return (
      (t.id = (function (t, e) {
        if (!Yc) {
          if (!f(t) || !t)
            throw new TypeError("callbacks arguments must be an object");
          return (Yc = new Kc(t, e));
        }
      })({
        create: function () {
          return t.active;
        },
        before: function (e, n) {
          n && t.enter(n);
        },
        after: function (e, n) {
          n && t.exit(n);
        },
        error: function (e, n) {
          if (e) {
            try {
              var r = "moduleId";
              n[r] = e[r];
            } catch (i) {}
            t.exit(e);
          }
        },
      })),
      t
    );
  }
  (Jc.create = Jc.before = Jc.after = Jc.error = null),
    (Xc.prototype = {
      createContext: function () {
        return Bc(this.active);
      },
      getContext: function () {
        return this.active;
      },
      get: function (t) {
        if (this.active) return this.active[t];
      },
      set: function (t, e) {
        if (this.active) return (this.active[t] = e);
      },
      enter: function (t) {
        if (!t) throw new bi("context required!");
        this._set.push(this.active), (this.active = t);
      },
      exit: function (t) {
        if (!t) throw new bi("context required!");
        if (t !== this.active) {
          var e = this._set.lastIndexOf
            ? this._set.lastIndexOf(t)
            : M(this._set, t);
          if (e < 0) throw new bi("context not currently entered!");
          this._set.splice(e, 1);
        } else this.active = this._set.pop();
      },
      bind: function (t, e) {
        e || (e = this.active ? this.active : this.createContext());
        var n = this;
        return function () {
          n.enter(e);
          try {
            return t.apply(this, arguments);
          } catch (i) {
            try {
              var r = "moduleId";
              i[r] = e[r];
            } catch (a) {}
            throw i;
          } finally {
            n.exit(e);
          }
        };
      },
    });
  var $c,
    Zc = !1;
  var ts = (Zc || (($c = Qc()), (Zc = !0)), $c),
    es = 1e4,
    ns = 0,
    rs = {},
    is = {},
    as = "js",
    os = "other";
  function cs(t) {
    (this.limit = t), this.reset();
  }
  cs.prototype = {
    add: function (t, e) {
      this.len > this.limit || this.get(t) || ((this.c[t] = e), this.len++);
    },
    get: function (t) {
      return this.c[t];
    },
    reset: function () {
      (this.c = {}), (this.len = 0);
    },
  };
  var ss = new cs(100);
  function us(t, e, n, r, i, a, o, c, s) {
    var u = this;
    (u.id = t),
      (u.time = U()),
      (u.msg = e),
      (u.lineno = r),
      (u.colno = i),
      (u.filename = n),
      (u.count = 1),
      (u.stack = (a && a.stack) || ""),
      (u.module = o),
      (u.trigger = c || Sr),
      (u.error = a),
      (u.category = s),
      u.fix();
    var f = (function (t, e, n, r, i) {
        return String(t) + String(e) + String(n) + String(r) + String(i);
      })(e, r, i, o, s),
      d = rs[f];
    (u.ep = d ? 0 : 1),
      (rs[f] = !0),
      (u.fep = 0),
      (u.trace = {}),
      this.recordFileName();
  }
  function fs() {
    var t,
      e,
      n =
        ((t = ss.c),
        (e = []),
        i(t, function (t) {
          e.push(t.toObject());
        }),
        e);
    if (n && n.length) {
      var r = 0;
      try {
        r = parseInt((U() - (G.pfStart || b)) / 1e3);
      } catch (o) {}
      var a = { fu: ns || ns++, os: r };
      tc.buildImmediateAction(Ot, null, null, {
        actionOptions: y(a, { items: n }),
      }),
        ss.reset();
    }
  }
  function ds(t, e, n, r, i, a, o) {
    if (e || _i.uploadEmptyFileErrors) {
      var c = i && i.moduleId,
        s = as;
      try {
        o &&
          o.category &&
          ((o.category !== as && o.category !== os) || (s = o.category),
          delete o.category);
      } catch (p) {}
      var u = (function (t, e, n, r, i, a) {
          return (
            String(t) +
            String(e) +
            String(n) +
            String(r) +
            String(i) +
            String(a)
          );
        })(e, t, n, r, c, s),
        f = ss.get(u);
      f
        ? f.increase()
        : ((f = new us(u, t, e, n, r, i, c, a, s)),
          ss.add(u, f),
          aa.addCache(Qi, function () {
            return f;
          }));
      var d = f.initTraceInstance();
      f.triggerActionHook(d);
      var l = d.scope;
      if (o)
        try {
          if (l) {
            var h = o;
            o.breadcrumbs
              ? (l.setBreadcrumbs(o.breadcrumbs), (h = o.contexts))
              : o.contexts && (h = o.contexts),
              l.setContext(h);
          }
        } catch (p) {}
      return (
        l.setBreadcrumbs(
          (function () {
            if (wc) {
              var t = wc.getAll();
              if (0 !== t.length) return t;
            }
          })()
        ),
        (f.trace[d.id] = { time: d.time, scope: d.scope, aid: d.aid }),
        d.id
      );
    }
  }
  function ls(t, e, n) {
    if (Ba() && _i.jsErrorEnabled && t) {
      var r = t.message || "",
        i = t.stack,
        a = t.fileName || "",
        o = t.lineNumber || 0,
        c = t.columnNumber || 0;
      if (i && (!a || o <= 0 || c <= 0)) {
        var s = qc(i);
        s && ((a = s.filename), (o = s.lineno), (c = s.colno));
      }
      return ds(r, a, o, c, { stack: i }, n || kr, e);
    }
  }
  function hs(t) {
    return p(t) ? t.apply(this) : t;
  }
  function ps(t) {
    if (Ba() && t && f(t)) {
      var e = t.name,
        n = t.msg,
        r = t.status,
        i = t.context,
        a = hs(e),
        o = hs(n),
        c = hs(r),
        s = hs(i),
        u = { type: jn, name: a, time: U() };
      u.name &&
        (o && (u.msg = o),
        c && (u.status = c),
        s && f(s) && (u.scope = { contexts: s }),
        tc.buildImmediateAction(jn, null, u),
        _a(Qn));
    }
  }
  function vs(t) {
    return gs(t, _i.optCustomParamRules[st], !0);
  }
  us.prototype = {
    increase: function () {
      this.recordFileName(), this.count++;
    },
    recordFileName: function () {
      var t = this.filename || "_";
      (this.fep += is[t] ? 0 : 1), (is[t] = !0);
    },
    fix: function () {
      var t = this.stack;
      if (t && s(t)) {
        t = t.split(/\n/);
        var e = [];
        i(t, function (t, n) {
          -1 == t.indexOf("__ty_asyncWrap__") && e.push(t);
        }),
          (this.stack = e.join("\n"));
      }
    },
    getErrorOverview: function () {
      var t = this;
      return {
        o: t.time,
        e: t.msg,
        l: t.lineno,
        c: t.colno,
        r: t.filename,
        ec: t.count,
        s: t.stack,
        m: t.module,
        ep: t.ep,
        fep: t.fep,
        tr: t.trigger,
        cat: t.category,
      };
    },
    toObject: function () {
      var t = this.getErrorOverview(),
        e = {};
      return (
        i(this.trace, function (t, n) {
          var r = { time: t.time },
            i = t.aid;
          i && (r.actionId = i), (e[n] = mi(r, t.scope));
        }),
        (t.trace = e),
        t
      );
    },
    initTraceInstance: function () {
      var t = { id: J(), time: U(), scope: new hi() },
        e = (function (t) {
          try {
            var e = ts.get("event");
            if (e && e.key && e.type === He && e.aid) return e.aid;
            var n = X.context;
            return (
              n ||
                (n = (function (t) {
                  var e = Tc[Tc.length - 1];
                  if (e) {
                    var n = Ic(e);
                    if (jc(n, t)) {
                      var r,
                        i = e[me];
                      return (
                        i && (r = e[pe] ? _c.get(i) : xc.get(i)),
                        r ||
                          ((r = Ac(e, Te, { s: n })),
                          e[me] && xc.put(e[me], r)),
                        r
                      );
                    }
                  }
                })(t)),
              n && n.aid && n.markAssociated(),
              (n && n.aid) || X.routeAid
            );
          } catch (r) {}
        })(t.time);
      return e && (t.aid = e), t;
    },
    triggerActionHook: function (t) {
      if (t) {
        var e = y(this.getErrorOverview(), { id: t.id, o: t.time });
        di({
          type: ln,
          name: yn,
          args: { target: this.error, actionData: e },
          scope: t.scope,
        }),
          e.id && (t.id = e.id);
      }
    },
  };
  var ms = {};
  function ys(t) {
    return ((t += "") && t.substr(0, 128)) || "";
  }
  function gs(t, e, n) {
    var r;
    if (t && e && e.length && e.length > 0) {
      var a = p(t) ? t() : t;
      a &&
        i(e, function (t) {
          var e = a[t];
          if (null != e) ca((r = r || {}), t, e);
          else if (n) {
            var o = (function (t, e) {
              var n = t + "." + e;
              if (ms[n]) return ms[n];
              var r = (e || "").split("."),
                a = "";
              e && 0 !== e.indexOf("[") && (a = ".");
              var o,
                c = t;
              i(r, function (t, e) {
                0 === e && (c += a),
                  t.indexOf("-") > -1 &&
                  0 !== t.indexOf("[") &&
                  t.indexOf("]") !== t.length - 1
                    ? (c += "['" + t + "']")
                    : (c += (e > 0 ? "." : "") + t);
              });
              try {
                o = new Function(
                  t,
                  "try{return " + c + ";}catch(e){}return null;"
                );
              } catch (s) {
                o = B;
              }
              return (ms[n] = o), o;
            })(ht, t);
            null != (e = o(a)) && ca((r = r || {}), t, e);
          }
        });
    }
    return r;
  }
  var bs = !0,
    ws = { start: b, e: {} };
  function Es(t) {
    bs && t();
  }
  var Ts = [];
  function xs(t) {
    Ts.push({ cb: t });
  }
  function _s() {
    L(
      window,
      "pageshow",
      function (t) {
        t &&
          t.persisted &&
          (function (t) {
            i(Ts, function (e) {
              e.cb(t);
            });
          })(t);
      },
      !0
    );
  }
  var Ss = {};
  function ks(t, e) {
    Ss[J()] = { cb: t, once: e };
  }
  var Cs = -1;
  function As(t) {
    try {
      var e = [];
      i(Ss, function (n, r) {
        var i = n.cb,
          a = n.once;
        i && i(t), a && e.push(r);
      }),
        i(e, function (t) {
          delete Ss[t];
        });
    } catch (t) {}
  }
  function Os() {
    (Cs = "hidden" === document.visibilityState ? 0 : Infinity),
      ks(function (t) {
        var e = t.timeStamp;
        e && (Cs = e);
      }, !0);
  }
  function Rs() {
    return Cs;
  }
  var Ns = {};
  function Is(t) {
    Ns[t] && (Ns[t] = []);
  }
  var js,
    Ds,
    Ps = { stop: B },
    Ls = (function () {
      try {
        var t = new window.PerformanceObserver(function () {});
        return t.observe({ type: En, buffered: !0 }), t.disconnect(), !0;
      } catch (e) {
        return !1;
      }
    })();
  function Hs(t, e, n) {
    var r, a, o;
    try {
      if (!Ms(t)) return Ps;
      if (t === Rr && !("PerformanceEventTiming" in window)) return Ps;
      var c = function (t) {
        i(t, function (t) {
          try {
            e(t);
          } catch (n) {}
        });
      };
      (r = new PerformanceObserver(function (t) {
        try {
          c(t.getEntries());
        } catch (e) {}
      })),
        null == n && (n = !0),
        r &&
          (Ls && n
            ? r.observe({ type: t, buffered: !0 })
            : (c(((o = Ns[(a = t)]), Is(a), o)),
              r.observe({ entryTypes: [t] })));
    } catch (s) {}
    return {
      po: r,
      stop: function () {
        try {
          r && r.disconnect();
        } catch (s) {}
      },
    };
  }
  function Ms(t) {
    return (
      window.PerformanceObserver &&
      w(window.PerformanceObserver.supportedEntryTypes, t) > -1
    );
  }
  function qs(t) {
    var e;
    try {
      e = t.getBoundingClientRect ? t.getBoundingClientRect() : undefined;
    } catch (n) {}
    return e;
  }
  function Bs(t) {
    t.startTime < Rs() && (Ds = t);
  }
  function Us() {
    try {
      if (!js) return;
      i(js.takeRecords(), function (t) {
        Bs(t);
      }),
        js.disconnect();
    } catch (t) {}
  }
  function zs() {
    if (Ds) {
      var t,
        e = Ds.element;
      if (e) {
        var n = { top: window.pageYOffset || 0, left: window.pageXOffset || 0 },
          r = qs(e);
        r &&
          (t = {
            top: r.top,
            left: r.left,
            width: r.width,
            height: r.height,
            pageTop: n.top,
            pageLeft: n.left,
          });
      }
      return {
        value: Ds.startTime,
        data: {
          loadTime: Ds.loadTime,
          renderTime: Ds.renderTime,
          element: {
            id: Ds.id,
            path: Cc(e),
            size: Ds.size,
            url: Ds.url,
            rect: t,
          },
        },
      };
    }
  }
  var Fs = [Zt, te, "workerStart", Qt, $t, ee, ne, Bt, Ut, re, ie, ae, oe],
    Vs = "getEntriesByType",
    Ks = { UNKNOWN: 0, TRUE: 1, FALSE: 2 };
  function Ys(t, e) {
    try {
      var n;
      return (
        e || (e = window.performance || {}), p(e[Vs]) && (n = e[Vs](t)), n || []
      );
    } catch (r) {
      return [];
    }
  }
  function Js(t) {
    t || (t = {});
    var e = t,
      n = e.wd,
      r = e.startTime;
    n || (n = window);
    var i = n.performance || {},
      a = i.timing;
    return (
      r || (r = a && a.navigationStart ? a.navigationStart : b),
      y(t, { wd: n, performance: i, timing: a, startTime: r })
    );
  }
  function Gs(t) {
    return t > 0 ? t : 0;
  }
  function Ws(t) {
    return y(t.item, t.extra);
  }
  function Xs(t) {
    var e = Qs(t),
      n = e.item,
      r = e.extra;
    return (
      (n.di = Gs(t[Kt])),
      (n.dcls = Gs(t[Ft])),
      (n.dcle = Gs(t[Vt])),
      (n.dc = Gs(t[Yt])),
      (n.ls = Gs(t[Jt])),
      (n.le = Gs(t[Gt])),
      (n.us = Gs(t[Wt])),
      (n.ue = Gs(t[Xt])),
      (n.rds = Gs(t[Zt])),
      (n.rde = Gs(t[te])),
      { item: n, extra: r }
    );
  }
  function Qs(t, e) {
    var n = {
        o: Gs(t[Mt]),
        rt: t.initiatorType,
        n: t.name,
        f: Gs(t[qt]),
        ds: Gs(t[Qt]),
        de: Gs(t[$t]),
        cs: Gs(t[ee]),
        ce: Gs(t[ne]),
        sl: Gs(t[re]),
        qs: Gs(t[Bt]),
        rs: Gs(t[Ut]),
        re: Gs(t[zt]),
        ts: Gs(t[ie]),
        es: Gs(t[ae]),
        dbs: Gs(t[oe]),
      },
      r = t.entryType,
      a = t[se];
    null == a &&
      (r === Cr ? (a = t[zt] - t[Mt]) : r === Or && (a = t[Gt] - t[Mt])),
      null != a && (n.du = Gs(a));
    var o = {},
      c = t.initiatorType,
      s = t.name;
    if (er === c || nr === c) {
      var u = c === er ? An : On,
        f = Zs(s, aa.getCacheSnapshot(Xi, e), u);
      f
        ? (i(f, function (t, e) {
            0 == e.indexOf("s_") && (o[e] = t);
          }),
          f.st && (o.st = f.st),
          f.apms && (o.apms = f.apms),
          (o.status = f.status),
          (o.cb = f.cb),
          (o.err = f.err),
          (o.error = f.status >= 400 || f.err > 0 ? Ks.TRUE : Ks.FALSE),
          (o.method = f.method))
        : (o.error = Ks.UNKNOWN);
    } else {
      var d;
      r === Cr &&
        ((d = Zs(s, aa.getCacheSnapshot($i, e))),
        (o.error = d ? Ks.TRUE : Ks.FALSE),
        (o.err = d ? Lr.error : 0));
      var l = 200;
      d ? (l = 0) : 300 === t[ie] && (l = 304), (o.status = l);
    }
    return (
      (o.cors = (function (t) {
        var e = !0;
        i(Fs, function (n) {
          if (null != t[n] && 0 !== t[n]) return (e = !1), !1;
        });
        var n = !0;
        ce in t && (n = "" === t[ce]);
        return e && n ? Ks.TRUE : Ks.FALSE;
      })(t)),
      (o.cached = (function (t, e) {
        if (e === Ks.TRUE) return Ks.UNKNOWN;
        if (null == t[ie]) return Ks.UNKNOWN;
        return t[ie] <= 300 ? Ks.TRUE : Ks.FALSE;
      })(t, n.cors)),
      (o.compressed = (function (t, e) {
        if (e === Ks.TRUE) return Ks.UNKNOWN;
        if (null == t[ae] || null == t[oe]) return Ks.UNKNOWN;
        return t[ae] < t[oe] ? Ks.TRUE : Ks.FALSE;
      })(t, n.cors)),
      { item: n, extra: o }
    );
  }
  function $s() {
    var t,
      e = Js(),
      n = e.performance,
      r = e.timing,
      i = Ys(Or, n);
    if (!(t = i && i[0]) && r)
      for (var a in ((t = {
        entryType: Or,
        initiatorType: Or,
        name: Da.ref,
        startTime: 0,
      }),
      r))
        "navigationStart" !== a &&
          "toJSON" !== a &&
          (t[a] = Gs(r[a] - r.navigationStart));
    return t;
  }
  function Zs(t, e, n) {
    var r, a;
    if (t)
      return (
        i(e, function (e, i) {
          if (e && t.indexOf(e.url) > -1 && (!n || e.subType === n))
            return (r = e), (a = i), !1;
        }),
        r && e.splice(a, 1),
        r
      );
  }
  var tu = 0,
    eu = 1,
    nu = 2,
    ru = 3;
  function iu(t, e) {
    var n,
      r = Js(e),
      i = r.timing,
      a = r.startTime,
      o = r.ifr,
      c = 0;
    i && ((c = i[Ft] || i.domInteractive || i.domLoading || c), (n = eu)),
      c <= 0 &&
        !o &&
        (aa.domContentLoadedEventStart
          ? ((c = aa.domContentLoadedEventStart), (n = nu))
          : ((c = aa._end), (n = ru)));
    var s = c - a;
    s < 0 && ((s = t.metric.fp), (n = tu)),
      (t.metric.dr = Math.round(s)),
      (t.debug.dr = n);
  }
  var au,
    ou = [],
    cu = !1;
  function su() {
    return { value: au, inited: cu };
  }
  function uu(t) {
    var e;
    t || (t = window);
    try {
      e =
        t.performance &&
        t.performance.getEntriesByName &&
        t.performance.getEntriesByName(xn)[0];
    } catch (n) {}
    return e;
  }
  function fu() {
    var t,
      e = function (e) {
        try {
          if (e.name !== xn) return;
          t && t.disconnect(),
            e.startTime < Rs() && (au = e.startTime),
            (function (t) {
              i(ou, function (e) {
                e(t);
              });
            })({ value: au }),
            (cu = !0);
        } catch (n) {}
      },
      n = uu();
    n ? e(n) : (t = Hs(En, e).po);
  }
  var du = 0,
    lu = 1,
    hu = 2,
    pu = 3,
    vu = 4,
    mu = 5;
  function yu(t, e) {
    var n,
      r = Js(e),
      a = r.performance,
      o = r.timing,
      c = r.startTime,
      s = r.wd,
      u = r.ifr,
      f = 0,
      d = 0;
    if (u) {
      var l = uu(s);
      l && (d = l.startTime);
    } else d = su().value;
    if (
      (d > 0
        ? ((f = d), (n = lu))
        : a.getEntriesByName && o
        ? ((f = o.domLoading),
          i(G.resources, function (t) {
            var e = a.getEntriesByName(t);
            if (1 === e.length) {
              var n = e[0].responseEnd;
              n > f && (f = n);
            }
          }),
          (f -= c),
          (n = vu))
        : s.TINGYUN &&
          s.TINGYUN[Ve] &&
          ((f = s.TINGYUN[Ve] - c) < 0 && (f = 0), (n = mu)),
      !f || f <= 0)
    ) {
      if (s.chrome && s.chrome.loadTimes) {
        var h = s.chrome.loadTimes();
        h && h.firstPaintTime && ((f = 1e3 * h.firstPaintTime - c), (n = hu));
      } else o && o.msFirstPaint && ((f = o.msFirstPaint - c), (n = pu));
      (!f || f <= 0) && ((f = 0), (n = du));
    }
    (t.metric.fp = Math.round(f)), (t.debug.fp = n);
  }
  function gu(t) {
    return to.reliableHiddenOffsets()
      ? t.offsetWidth <= 0 && t.offsetHeight <= 0 && !t.getClientRects().length
      : (function (t) {
          for (; t && 1 === t.nodeType; ) {
            if ("none" === bu(t) || "hidden" === t.type) return !0;
            t = t.parentNode;
          }
          return !1;
        })(t);
  }
  function bu(t) {
    return t.style && t.style.display;
  }
  var wu = 0,
    Eu = 1,
    Tu = 2,
    xu = 3,
    _u = 4,
    Su = 5;
  function ku(t, e) {
    var n,
      r = Js(e),
      a = r.performance,
      o = r.timing,
      c = r.startTime,
      s = r.ifr,
      u = r.wd,
      f = t.metric.fp,
      d = f || 0,
      l = Su,
      h = 0;
    if (!s) {
      var v = zs();
      v && ((h = v.value), (n = v.data));
    }
    if (_i.lcpAsFs && h > 0) (d = h), (l = Eu);
    else if (!s && G.lcpStopTime) (d = G.lcpStopTime - c), (l = Tu);
    else if (
      (function () {
        var t = !0;
        document.createElement("img").getBoundingClientRect || (t = !1);
        return t;
      })()
    ) {
      var m = s ? [] : G.imageResources || [],
        y = u.innerHeight,
        g = u.innerWidth;
      y || (y = u.document.documentElement.clientHeight),
        g || (g = u.document.documentElement.clientWidth);
      var b = [];
      m.length > 0
        ? i(m, function (t) {
            Cu(t.element, y, g) && b.push(t);
          })
        : p(a.getEntriesByName) &&
          i(u.document.querySelectorAll("img"), function (t) {
            Cu(t, y, g) && b.push({ element: t });
          });
      var w = ((o && o.loadEventEnd) || aa.loadEventEnd) - c;
      i(b, function (t) {
        if (t.loadTime) {
          var e = t.loadTime - c;
          e > d && ((d = e), (l = _u));
        } else if (t.element && t.element.src) {
          var n = a.getEntriesByName(t.element.src);
          if (n && n.length) {
            var r = n[0];
            if (r) {
              var i = r.responseEnd;
              r.fetchStart <= w && i > d && ((d = i), (l = xu));
            }
          }
        }
      });
    }
    d < f && ((l = Su), (d = f || 0) <= 0 && ((d = 0), (l = wu))),
      (t.metric.fs = Math.round(d)),
      (t.debug.fs = l),
      n && (t.data || (t.data = {}), (t.data.fs = { lcp: n }));
  }
  function Cu(t, e, n) {
    return (
      t.src &&
      (function (t) {
        if (!t) return !1;
        if (!_i.fs_resources || 0 === _i.fs_resources.length) return !0;
        var e = !1;
        return (
          i(_i.fs_resources, function (n) {
            if (t.indexOf(n) > -1) return (e = !0), !1;
          }),
          e
        );
      })(t.src) &&
      (function (t, e, n) {
        if (t) {
          var r = window.pageYOffset;
          if (
            t.top +
              (0 === r ? 0 : r || document.scrollTop || 0) -
              (document.clientTop || 0) >=
            e
          )
            return !1;
          var i = t.left;
          return i >= 0 && i < n;
        }
        return !1;
      })(qs(t), e, n) &&
      !gu(t)
    );
  }
  function Au(t, e) {
    var n = t.metric;
    n.loadEventEnd = n.le;
    var r = Js(e),
      i = r.timing,
      a = r.startTime,
      o = r.context,
      c = r.ifr,
      s = 0;
    if (o && o.hasChildType(_t)) s = U() - a;
    else {
      var u,
        f = i && i.loadEventEnd;
      u = c ? f || U() : f || aa.loadEventEnd || U();
      var d = 0;
      a > 0 && u > a && (d = u - a);
      var l = [n.fs, n.dr, n.fp, d];
      s = Math.max.apply(null, l);
    }
    n.le = Math.round(s);
  }
  function Ou(t) {
    return t.loadEventEnd || t._end;
  }
  function Ru(t) {
    var e = t.fp || 0,
      n = 0,
      r =
        window.performance &&
        window.performance.timing &&
        window.performance.timing.navigationStart;
    return r || ((r = b), (e = 0)), (n = U() - r - e) < 0 && (n = 0), n;
  }
  function Nu(t) {
    var e,
      n = {},
      r = (t.performance || {}).timing,
      a = (t.TINGYUN && t.TINGYUN.globalStart) || b,
      o = (t.TINGYUN && t.TINGYUN.currentAgent) || aa;
    if (r) {
      Es(function () {
        var t = (ws.t = {});
        i(
          r,
          function (e, n) {
            p(e) || (t[n] = e);
          },
          !0
        );
      }),
        r.navigationStart && (a = r.navigationStart),
        (n = {
          ns: a,
          f: v(qt),
          qs: v(Bt),
          rs: v(Ut),
          re: v(zt),
          os: v(Ft),
          oe: v(Vt),
          oi: v(Kt),
          oc: v(Yt),
          ls: v(Jt),
          le: v(Gt),
          tus: v(Wt),
          tue: v(Xt),
        });
      var c = v(Qt),
        s = v($t),
        u = v(Zt),
        f = v(te),
        d = v(ee),
        l = v(ne);
      if (
        ((n.cs = d),
        (n.ce = l),
        (n.ds = c),
        (n.de = s),
        (f - u > 0 || f > 0) && ((n.es = u), (n.ee = f)),
        0 == n.le)
      ) {
        var h = Ou(o);
        n.ue = h - a;
      }
      o && (o._le = n.ue || n.le), r[re] ? (n.sl = v(re)) : (n.sl = 0);
    } else n = { t: a, le: Ou(o) - a };
    try {
      Qi in o ? (e = o.errs) : o.getCache && (e = o.getCache(Qi));
    } catch (m) {}
    return (n.je = (e && e.length) || 0), n;
    function v(t) {
      return r[t] > 0 ? r[t] - a : 0;
    }
  }
  var Iu = "undefined" != typeof window.console,
    ju = 1,
    Du = 0,
    Pu = "success",
    Lu = "fail",
    Hu = {},
    Mu = {};
  function qu(t) {
    var e = t,
      n = t.xhrs;
    (e.hasAjax = n && n.length > 0), delete e.xhrs;
    var r = { ss: 1 };
    t.type === qe && (r.rs = 1),
      tc.buildImmediateAction(
        xt,
        be,
        { type: xt, items: n, spe: e },
        { sendOptions: { query: r } }
      ),
      _a(Xn);
  }
  function Bu(t) {
    if (Mu[t.key]) {
      var e = Mu[t.key];
      delete Mu[t.key],
        e.sent || (!e.isMeaningfulAction() && e.isNoRemain())
          ? qu(t)
          : (e.setSpe(t),
            F(function () {
              e.sent ? _a(Xn) : ((e.spe = null), qu(t));
            }, Ye));
    } else qu(t);
  }
  function Uu(t) {
    Iu && console.warn(t || "Event key required!");
  }
  var zu = Uu.prototype;
  function Fu(t) {
    (t = t || {}),
      (this.key = t.key),
      (this.type = t.type || Me),
      (this.timeout = t.timeout || Le),
      (this.status = ju),
      (this.remain = 0),
      (this.xhrs = []),
      (this.s = U()),
      (this.e = null),
      (this.called = this.sent = this.stored = !1),
      t.debugInfo && (this.debugInfo = t.debugInfo),
      (this.duration = t.duration || 0),
      t.op && (this.op = t.op),
      t.desc && (this.desc = t.desc),
      (this.scope = new hi({ contexts: t.context })),
      (this.aid = null);
  }
  zu.fail = zu.end = zu.store = B;
  var Vu = Fu.prototype;
  function Ku(t) {
    var e = (t = t || {}).key;
    if (!e) return new Uu();
    if (Hu[e]) return new Uu("event " + e + " is executing");
    Hu[e] = !0;
    var n = ts.createContext();
    ts.enter(n);
    var r,
      i = new Fu(t);
    if (
      ((i._end = function () {
        var t = this;
        t.sent || t.stored || 0 !== t.remain || !t.called
          ? t.stored && this.refreshEventAndStore(n)
          : t.finish().send(n);
      }),
      (i.end = function (t) {
        t = t || {};
        var e = this;
        e.called
          ? Iu && console.warn("Event " + this.key + "has ended or failed!")
          : ((e.called = !0),
            ts.exit(n),
            null != t.status &&
              (t.status === Pu
                ? (e.status = ju)
                : t.status === Lu
                ? (e.status = Du)
                : (t.status !== ju && t.status !== Du) ||
                  (e.status = t.status)),
            t.context && f(t.context) && e.scope.setContext(t.context),
            t.storeEvent || e._end());
      }),
      (i.finish = function () {
        var t = this;
        return (t.e = U()), t.i && clearTimeout(t.i), delete Hu[t.key], t;
      }),
      (i.fail = function (t) {
        this.end(y(t || {}, { status: Du }));
      }),
      (i.store = function () {
        this.end({ storeEvent: !0 }),
          this.refreshEventAndStore(n),
          (this.stored = !0);
      }),
      (i.setTag = function (t, e) {
        this.scope && this.scope.setTag(t, e);
      }),
      (i.setMetric = function (t, e, n) {
        this.scope && this.scope.setMetric(t, e, n);
      }),
      i.type === qe)
    ) {
      var a = (function (t) {
        var e;
        return (
          (e = X.context
            ? tc.getRootContext(X.context, function (t) {
                return t.type === xt && t.subType !== be;
              })
            : Dc(t.s)),
          e && !e.closed && (Mu[t.key] = e),
          Mu[t.key]
        );
      })(i);
      r = a && a.data && a.data.aid;
    }
    return (
      r || (r = J()),
      (i.aid = r),
      i.type === qe && (X.routeAid = r),
      ts.set("event", i),
      i
    );
  }
  function Yu(t) {
    if (Ba()) {
      var e = oa(ya(Pe));
      if (e && e.start && (!(t = t || {}).key || e.key === t.key)) {
        var n = t.timeout;
        if ((n || (n = 6e4), (e.duration = U() - e.start), e.duration > n))
          ba(Pe);
        else {
          var r = window.performance && window.performance.timing;
          if (
            r &&
            r.navigationStart &&
            (r.loadEventEnd || r.loadEventStart) &&
            r.navigationStart - e.start >= 0
          ) {
            var i = {
              method: "GET",
              url: Da.ref,
              status: 200,
              type: _t,
              subType: Ct,
              startSpeOffset: r.navigationStart - e.start,
              start: r.navigationStart,
              __spe: 1,
              du: (r.loadEventEnd || r.loadEventStart) - r.navigationStart,
            };
            e.xhrs || (e.xhrs = []), e.xhrs.push(i);
          }
          var a = ju;
          t.status && (a = t.status === Pu ? ju : 0),
            (e.status = a),
            ba(Pe),
            Bu(e);
        }
      }
    }
  }
  function Ju(t, e) {
    e.status && e.status === Lu ? t.fail() : t.end();
  }
  function Gu(t, e) {
    if (!Ba()) return new Uu("Agent is not inited!");
    if (t) {
      e = e || t.immediate;
      var n = Ku(
        (t = y(
          { type: He },
          e ? { debugInfo: { immediate: !0 } } : {},
          t || {}
        ))
      );
      if (e) Ju(n, t);
      else if (t.autoEnd) {
        var r = t.endDelay;
        (!r || r <= 0) && (r = Be),
          F(function () {
            Ju(n, t);
          }, r);
      }
      return n;
    }
  }
  function Wu(t) {
    var e = Mu[t];
    if (e && !e.closed) return e;
  }
  (Vu.end = Vu.finish = Vu.fail = null),
    (Vu.send = function (t) {
      this.sent = !0;
      var e = this.getEventData(t);
      (!_i.collect_noajax_hashroute &&
        ((e.debugInfo && e.debugInfo.api === Je) ||
          (e.type === qe && e.key.indexOf("#") > -1)) &&
        0 === e.xhrs.length) ||
        e.duration >= this.timeout ||
        (di({ type: ln, name: gn, args: { actionData: e }, scope: this.scope }),
        mi(e, this.scope),
        Bu(e));
    }),
    (Vu.getEventData = function (t) {
      var e = this,
        n = (t.event && t.event.xhrs) || [];
      i(n, function (t) {
        t.startSpeOffset = t.start - e.s;
      });
      var r = {
        key: e.key,
        start: e.s,
        duration: e.e - e.s,
        status: e.status,
        type: e.type,
        xhrs: n,
      };
      return (
        e.duration > 0 &&
          ((r.duration = e.duration), (r.start = e.e - e.duration)),
        e.type === qe && _i.baseHref && (r.baseHref = _i.baseHref),
        this.debugInfo && (r.debugInfo = this.debugInfo),
        this.op && (r.op = this.op),
        this.desc && (r.desc = this.desc),
        this.aid && (r.actionId = this.aid),
        r
      );
    }),
    (Vu.refreshEventAndStore = function (t) {
      this.finish();
      var e = this.getEventData(t);
      ga(Pe, A(e));
    });
  var Xu,
    Qu,
    $u,
    Zu,
    tf,
    ef,
    nf,
    rf,
    af,
    of,
    cf,
    sf,
    uf,
    ff,
    df,
    lf = window,
    hf =
      ((Qu = (function (t) {
        for (var e = {}, n = 0, r = t.length; n < r; n++) e[t.charAt(n)] = n;
        return e;
      })(
        (Xu =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")
      )),
      ($u = String.fromCharCode),
      (Zu = function (t) {
        if (t.length < 2)
          return (e = t.charCodeAt(0)) < 128
            ? t
            : e < 2048
            ? $u(192 | (e >>> 6)) + $u(128 | (63 & e))
            : $u(224 | ((e >>> 12) & 15)) +
              $u(128 | ((e >>> 6) & 63)) +
              $u(128 | (63 & e));
        var e =
          65536 + 1024 * (t.charCodeAt(0) - 55296) + (t.charCodeAt(1) - 56320);
        return (
          $u(240 | ((e >>> 18) & 7)) +
          $u(128 | ((e >>> 12) & 63)) +
          $u(128 | ((e >>> 6) & 63)) +
          $u(128 | (63 & e))
        );
      }),
      (tf = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g),
      (ef = function (t) {
        return t.replace(tf, Zu);
      }),
      (nf = function (t) {
        var e = [0, 2, 1][t.length % 3],
          n =
            (t.charCodeAt(0) << 16) |
            ((t.length > 1 ? t.charCodeAt(1) : 0) << 8) |
            (t.length > 2 ? t.charCodeAt(2) : 0);
        return [
          Xu.charAt(n >>> 18),
          Xu.charAt((n >>> 12) & 63),
          e >= 2 ? "=" : Xu.charAt((n >>> 6) & 63),
          e >= 1 ? "=" : Xu.charAt(63 & n),
        ].join("");
      }),
      (rf = lf.btoa
        ? function (t) {
            return lf.btoa(t);
          }
        : function (t) {
            return t.replace(/[\s\S]{1,3}/g, nf);
          }),
      (af = function (t) {
        return "[object Uint8Array]" === Object.prototype.toString.call(t)
          ? t.toString("base64")
          : rf(ef(String(t)));
      }),
      (of = function (t, e) {
        return e
          ? af(String(t))
              .replace(/[+\/]/g, function (t) {
                return "+" == t ? "-" : "_";
              })
              .replace(/=/g, "")
          : af(t);
      }),
      (cf = new RegExp(
        [
          "[\xc0-\xdf][\x80-\xbf]",
          "[\xe0-\xef][\x80-\xbf]{2}",
          "[\xf0-\xf7][\x80-\xbf]{3}",
        ].join("|"),
        "g"
      )),
      (sf = function (t) {
        switch (t.length) {
          case 4:
            var e =
              (((7 & t.charCodeAt(0)) << 18) |
                ((63 & t.charCodeAt(1)) << 12) |
                ((63 & t.charCodeAt(2)) << 6) |
                (63 & t.charCodeAt(3))) -
              65536;
            return $u(55296 + (e >>> 10)) + $u(56320 + (1023 & e));
          case 3:
            return $u(
              ((15 & t.charCodeAt(0)) << 12) |
                ((63 & t.charCodeAt(1)) << 6) |
                (63 & t.charCodeAt(2))
            );
          default:
            return $u(((31 & t.charCodeAt(0)) << 6) | (63 & t.charCodeAt(1)));
        }
      }),
      (uf = function (t) {
        return t.replace(cf, sf);
      }),
      (ff = function (t) {
        var e = t.length,
          n = e % 4,
          r =
            (e > 0 ? Qu[t.charAt(0)] << 18 : 0) |
            (e > 1 ? Qu[t.charAt(1)] << 12 : 0) |
            (e > 2 ? Qu[t.charAt(2)] << 6 : 0) |
            (e > 3 ? Qu[t.charAt(3)] : 0),
          i = [$u(r >>> 16), $u((r >>> 8) & 255), $u(255 & r)];
        return (i.length -= [0, 0, 2, 1][n]), i.join("");
      }),
      (df = lf.atob
        ? function (t) {
            return lf.atob(t);
          }
        : function (t) {
            return t.replace(/\S{1,4}/g, ff);
          }),
      {
        atob: function (t) {
          return df(String(t).replace(/[^A-Za-z0-9\+\/]/g, ""));
        },
        btoa: rf,
        utob: ef,
        encode: of,
        encodeURI: function (t) {
          return of(t, !0);
        },
        btou: uf,
        decode: function (t) {
          return (function (t) {
            return uf(df(t));
          })(
            String(t)
              .replace(/[-_]/g, function (t) {
                return "-" == t ? "+" : "/";
              })
              .replace(/[^A-Za-z0-9\+\/]/g, "")
          );
        },
      });
  function pf(t) {
    return hf.encode(t, !0);
  }
  var vf,
    mf,
    yf = "TINGYUN_EK_CACHE",
    gf = "GM",
    bf = "light",
    wf = "gm",
    Ef = to.localStorage,
    Tf = !1;
  function xf() {
    try {
      var t = Aa();
      if (!t) return;
      if (!vf || !mf) return "base64#".concat(pf(t));
      var e = mf,
        n = e.sm2Enc,
        r = (0, e.sm4Enc)(t, vf),
        i = n(vf, _i.encPubKey);
      if (r && i) return "gmjs#".concat(i, "#").concat(r);
    } catch (a) {}
  }
  function _f(t) {
    try {
      if (
        ((n = _i.encMode),
        (r = n === wf || (n !== wf && n !== bf)),
        !(_i.encEnabled && _i.encPubKey && r))
      )
        return void (mf = null);
      var e = t.plugins.enc;
      if (!(e && e[gf] && e[gf].sm2Enc && e[gf].sm4Enc))
        return void (mf = null);
      (mf = e[gf]),
        Ef && (vf = ya(yf)),
        vf || Sf(),
        Tf ||
          (Co(rr, function (t) {
            t && !t.init && t.current && t.current !== t.prev && Sf();
          }),
          (Tf = !0));
    } catch (i) {}
    var n, r;
  }
  function Sf() {
    try {
      (vf = J(!0)), Ef && ga(yf, vf);
    } catch (t) {}
  }
  var kf,
    Cf = "__ty_plugin_registers",
    Af = "__ty_plugins",
    Of = {};
  function Rf() {
    return (
      kf ||
        (kf = {
          constant: { OBSERVER_SESSION: rr, PAGEHIDE: et },
          util: {
            noop: B,
            on: L,
            support: to,
            stringify: A,
            UUID: J,
            now: U,
            Base64: hf,
          },
          bridge: {
            getSid: Oo,
            getUid: Aa,
            getDid: ka,
            registerObserver: Co,
            sendRequest: ra,
            getUrlWithParam: pa,
            getSendOrigin: Pa,
            setDefaultConfig: To,
            getAgentConfig: Eo,
            getAgentStorage: no,
            setAgentStorage: eo,
          },
          common: { agentVersion: "3.7.0-zhongyihulianwang.1" },
          plugins: {},
        }),
      kf
    );
  }
  function Nf(t) {
    try {
      if (s(t)) {
        var e = t;
        (t = (function (t) {
          var e = window[Af];
          if (e && p(e[t]))
            try {
              return e[t]();
            } catch (n) {}
        })(e)),
          t ||
            (function (t) {
              (window[Cf] && window[Cf][t]) ||
                (window[Cf] || (window[Cf] = {}), (window[Cf][t] = Nf));
            })(e);
      }
      if (!t || !t.name) return;
      var n = t.name;
      if (Of[n]) return;
      (Of[n] = t),
        t.hooks &&
          (t.hooks.init && si(pn, t.hooks.init),
          t.hooks.beforeSend && fi(bn, t.hooks.beforeSend),
          t.hooks.send && fi(wn, t.hooks.send),
          t.hooks.action &&
            ((r = t.hooks.action),
            p(r) &&
              i(ri.action, function (t) {
                ui(t, function (e) {
                  r.call(null, { name: t, params: e });
                });
              }))),
        "TingyunPluginEnc" === n &&
          si(pn, function () {
            _f(Rf());
          }),
        Ba() && If(Yr, t);
    } catch (a) {}
    var r;
  }
  function If(t, e) {
    try {
      e && p(e[t]) && e[t](Rf());
    } catch (n) {}
  }
  var jf,
    Df,
    Pf = ["pushState", "replaceState"];
  function Lf(t) {
    if (_i.routerEnable) {
      var e = va();
      if (e) {
        var n = jf;
        (jf = e),
          Gu({
            key: e,
            autoEnd: !0,
            endDelay: _i.router_event_delay,
            type: qe,
            debugInfo: { api: t },
          }),
          Hf(e, n);
      }
    }
  }
  function Hf(t, e) {
    if (_i.bcHistoryEnabled && t) {
      var n = { to: t };
      e && (n.from = e), Hc({ category: xr, message: t, data: n });
    }
  }
  function Mf() {
    i(Pf, function (t) {
      sc(window.history, t, function (e) {
        return function (n, r, i) {
          var a;
          a = e.apply(this, arguments);
          try {
            Lf(t);
          } catch (o) {}
          return a;
        };
      });
    }),
      L(window, Ge, function () {
        Lf(Ge);
      });
  }
  function qf() {
    L(window, Je, function () {
      Lf(Je);
    });
  }
  var Bf = {
    mainVersion: 3,
    version: "3.7.0-zhongyihulianwang.1",
    createEvent: Gu,
    globalStart: b,
    currentAgent: aa,
    mark: function (t, e) {
      if (t) {
        var n,
          r,
          i = t.split("_"),
          a = i[0],
          o = i[1];
        "ty" === a &&
          o &&
          ((n = o), (r = { timestamp: U(), data: e }), (W[n] = r));
      }
    },
    wrapVueRouter: function (t, e) {
      Ba() &&
        ((e && f(e)) || (e = {}),
        t &&
          t.afterEach &&
          ((_i.routerEnable = !1),
          t.afterEach(function (t) {
            var n = t.fullPath;
            if ((n = n ? window.location.origin + n : t.path)) {
              var r = {
                key: n,
                type: qe,
                autoEnd: !0,
                endDelay: _i.router_event_delay,
                debugInfo: { api: "vueRouter" },
              };
              y(r, e), Gu(r);
              var i = Df;
              (Df = n), Hf(n, i);
            }
          })));
    },
    setUid: Oa,
    createAutoEvent: Gu,
    endStoreEvent: Yu,
    endStoredAction: Yu,
    captureException: function (t, e) {
      return ls(t, e, kr);
    },
    setDid: Ca,
    addHook: ci,
    addLifeCycleHook: si,
    addActionHook: ui,
    addSendHook: fi,
    setContext: vi,
    setExtraContext: function () {
      pi(), X.scope.setExtraContext.apply(X.scope, arguments);
    },
    stopLCPObserver: function () {
      (G.lcpStopTime = U()), Us();
    },
    checkHookSupported: function (t, e) {
      return ri[t] && w(ri[t], e) > -1;
    },
    newEvent: ps,
    createCustomEvent: ps,
    parseQuery: function (t) {
      return da(ua(t));
    },
    JSON: { stringify: A, parse: oa },
    newAction: Gu,
    getAgentConfig: Eo,
    util: { uuid: J },
    startNextSession: function (t) {
      Ba() && (No() ? Do(t) : ec(t), _a("newSession", { id: Oo() }));
    },
    addPlugin: Nf,
  };
  function Uf(t, e) {
    Bf[t] = e;
  }
  var zf = "TingyunWeb";
  function Ff(t) {
    if (t && p(Bf[t])) {
      var e = [].slice.call(arguments, 1);
      return Bf[t].apply(null, e);
    }
  }
  function Vf() {
    if (window[zf]) {
      try {
        !(function () {
          var t = window[zf].po;
          if (!t) return;
          var e = t.observer,
            n = t.entries;
          if (!e || !n) return;
          (function (t) {
            var e = {};
            i(t, function (t) {
              var n = t.entryType;
              n && (e[n] || (e[n] = []), e[n].push(t));
            }),
              (Ns = e);
          })(n),
            (t.entries = null),
            e.disconnect(),
            (window[zf].po = null);
        })();
      } catch (t) {}
      i(window[zf].q, function (e) {
        try {
          Ff.apply(null, e);
        } catch (t) {}
      }),
        (window[zf] = Ff);
    } else window[zf] = Ff;
  }
  var Kf = Ta(Ti.href);
  function Yf(t) {
    if (!s(t)) return { valid: !1 };
    var e = Ta(t);
    return {
      valid: e.protocol === Kf.protocol && e.host === Kf.host,
      parsed: e,
    };
  }
  function Jf(t) {
    if (_i.apmEnableAllCorsDomains) return !0;
    var e,
      n,
      r = Yf(t),
      a = r.valid,
      o = r.parsed;
    return (
      a ||
      (o &&
        o.host &&
        ((e = o.host),
        (n = !1),
        i(_i.corsDomains, function (t) {
          if (e.indexOf(t) > -1) return (n = !0), !1;
        }),
        n))
    );
  }
  function Gf(t, e, n) {
    if (t && t[e])
      try {
        sc(t, e, n);
      } catch (r) {}
  }
  function Wf(t, e, n) {
    t &&
      t.context &&
      t.context.parent &&
      ((t.pcid = t.context.parent.id),
      t.context.parent.updateRemain(1, e),
      t.context.parent.items.push(t.context.data),
      n && t.context.parent.children.push(t.context));
  }
  function Xf(t) {
    if (!t) return !1;
    var e = _i.eventResources && _i.eventResources.length > 0,
      n = _i.eventResourcesIgnore && _i.eventResourcesIgnore.length > 0;
    return e && n ? Qf(t) && $f(t) : e ? Qf(t) : !n || $f(t);
  }
  function Qf(t) {
    var e = !1;
    return (
      i(_i.eventResources, function (n) {
        if (t.indexOf(n) > -1) return (e = !0), !1;
      }),
      e
    );
  }
  function $f(t) {
    var e = !0;
    return (
      i(_i.eventResourcesIgnore, function (n) {
        if (t.indexOf(n) > -1) return (e = !1), !1;
      }),
      e
    );
  }
  function Zf(t, e) {
    var n,
      r = X.context;
    if (
      !(
        t.shouldAddToEvent ||
        (!(function (t) {
          return tc.containContext(t, function (t) {
            return t && (t.type === Ct || (t.type === xt && t.subType !== be));
          });
        })(r) &&
          r)
      )
    )
      return null;
    if (r) return r;
    if (Ri()) {
      var i = Dc(t.start || U());
      if (i && !(n = i.closed)) return i;
    }
    return (
      !n && e && (r = e()),
      !r &&
        X.recordingPageLoadEvent &&
        X.pageLoadEvent &&
        ((r = X.pageLoadEvent), X.recordingCpActions && (t.crossPage = !0)),
      r
    );
  }
  var td = [];
  var ed,
    nd = !1,
    rd = [
      "id",
      "tname",
      "tid",
      "rid",
      "duration",
      "user",
      "bid",
      "ber",
      "isError",
    ];
  function id(t) {
    var e, n, r;
    if (t)
      if (0 === t.indexOf(gt)) {
        var i = t.substring(gt.length);
        try {
          e = oa((n = hf.decode(i)));
        } catch (a) {}
      } else {
        try {
          e = oa((n = decodeURIComponent(t)));
        } catch (a) {}
        if (!e)
          try {
            e = oa((n = decodeURIComponent(n)));
          } catch (a) {
            (r = a && a.message),
              (function (t, e) {
                var n = "ok";
                if (!t) return e.length ? e.join("\n") : n;
                e.push(t);
              })(r, td);
          }
      }
    return e;
  }
  function ad() {
    try {
      if (nd) return;
      var t = (function () {
          var t = {},
            e = (function (t, e, n) {
              if (!n)
                try {
                  n = (e && window[e]) || wi.cookie || "";
                } catch (i) {}
              if (n) {
                var r = n.match(new RegExp("(^|;\\s*)(" + t + ")=([^;]*)"));
                return r ? r[3] : null;
              }
              return null;
            })(vt, pt);
          e &&
            ((t = id(e)),
            (function (t, e, n, r, i) {
              var a = t + "=" + e;
              if (n) {
                var o = new Date();
                o.setTime(o.getTime() + 1e3 * n),
                  (a += ";expires=" + o.toGMTString());
              }
              r && (a += ";path=" + r), ((i || wi).cookie = a);
            })(vt, "", -1e3, "/"));
          return t;
        })(),
        e = {};
      t &&
        f(t) &&
        ((e.s_id = t.id),
        (e.s_tname = t.tname),
        (e.s_tid = t.tid),
        (e.s_rid = t.rid),
        (e.s_duration = t.duration),
        "user" in t && ((e.s_user = t.user), Oa(t.user)),
        "bid" in t && (e.s_bid = ys(t.bid)),
        "ber" in t && (e.s_ber = t.ber),
        "isError" in t && (e.s_isError = t.isError)),
        (ed = e),
        (nd = !0);
    } catch (n) {}
  }
  function od() {
    return ed;
  }
  var cd = 0,
    sd = "load",
    ud = "reload",
    fd = ["__wvjb_queue_message__", "__bridge_loaded__"];
  function dd(t, e, n) {
    if (
      !(function (t) {
        if (!t) return !0;
        var e = !1,
          n = t.substring(0, 100);
        try {
          i(fd, function (t) {
            if (n.indexOf(t) > -1) return (e = !0), !1;
          });
        } catch (r) {
          e = !0;
        }
        return e;
      })(e) &&
      t
    ) {
      n || (n = t.src ? ud : sd);
      var r,
        a = {
          id: cd++,
          src: e,
          loadType: n,
          start: U(),
          sameOrigin: ((r = e), Yf(r).valid),
          shouldAddToEvent: Xf(e),
        };
      !(function (t) {
        t.context ||
          (t.context = new tc({
            parent: Zf(t),
            name: "".concat(t.src, "-").concat(t.id),
            type: kt,
          }));
      })(a),
        a.crossPage && (a.context.crossPage = !0),
        a.context.setData({
          type: kt,
          loadType: a.loadType,
          id: a.id,
          cid: a.context.id,
          src: a.src,
          start: a.start,
          sameOrigin: a.sameOrigin,
        }),
        Wf(a, kt),
        t.addEventListener("load", function i() {
          try {
            if (
              ((a.end = U()),
              a.sameOrigin &&
                this &&
                this.contentWindow &&
                this.contentWindow.document)
            ) {
              a.url = this.contentWindow.document.URL;
              var e = this.contentWindow[ot],
                n = !1;
              e &&
                ((a.pvid = e.pvid || ""),
                p(e.checkHookSupported) &&
                  e.checkHookSupported(ln, vn) &&
                  ((n = !0),
                  e.addActionHook(vn, function (t) {
                    var e;
                    t && t.actionData && (e = pd(t.actionData)),
                      e || (e = hd(this.contentWindow, a.start)),
                      ld(a, e);
                  }))),
                n || ld(a, hd(this.contentWindow, a.start));
            } else ld(a);
          } catch (r) {
            ld(a);
          }
          try {
            t.removeEventListener("load", i);
          } catch (r) {}
        });
    }
  }
  function ld(t, e) {
    t.callbackEnd ||
      ((t.callbackEnd = !0),
      (t.iframePageMetric = e),
      (function (t) {
        t.context.setData(
          y({ pvid: t.pvid, end: t.end, url: t.url }, t.iframePageMetric)
        );
      })(t),
      (function (t) {
        if (!t.context) return;
        t.context.setData({ state: Lt }), t.context.canEnd() && t.context.end();
      })(t));
  }
  function hd(t, e) {
    if (!t) return {};
    var n = Nu(t),
      r = { metric: { le: n.le, f: n.f }, debug: {} },
      i = { wd: t, startTime: e, ifr: !0 };
    return yu(r, i), ku(r, i), iu(r, i), Au(r, i), pd(r.metric);
  }
  function pd(t) {
    if (t) {
      var e,
        n,
        r = {
          f: t.f,
          fp: t.fp,
          fs: t.fs,
          dr: t.dr,
          le: t.le,
          loadEventEnd: t.loadEventEnd,
          je: t.je || 0,
        };
      return (
        (e = t),
        (n = r),
        i(rd, function (t) {
          var r = "s_".concat(t);
          null != e[r] && (n[r] = e[r]);
        }),
        r
      );
    }
  }
  function vd() {
    if (_i.hook_iframe && Ri())
      try {
        !(function () {
          function t(t) {
            return function (e) {
              try {
                "IFRAME" === e.nodeName && e.src && dd(e, e.src, sd);
              } catch (n) {}
              return t.apply(this, arguments);
            };
          }
          window.Node &&
            (Gf(window.Node.prototype, "appendChild", t),
            Gf(window.Node.prototype, "insertBefore", t));
        })(),
          (function () {
            if (Object.getOwnPropertyDescriptor && Object.defineProperty) {
              var t = Object.getOwnPropertyDescriptor(
                HTMLIFrameElement.prototype,
                "src"
              );
              if (t) {
                var e = t.get,
                  n = t.set;
                e &&
                  n &&
                  Object.defineProperty(HTMLIFrameElement.prototype, "src", {
                    get: function () {
                      return e.apply(this, arguments);
                    },
                    set: function () {
                      try {
                        wi &&
                          wi.body &&
                          wi.body.contains &&
                          wi.body.contains(this) &&
                          dd(this, arguments[0]);
                      } catch (t) {}
                      n.apply(this, arguments);
                    },
                    enumerable: !0,
                    configurable: !0,
                  });
              }
            }
          })();
      } catch (t) {}
  }
  var md = "CK",
    yd = {};
  function gd(t, e) {
    if (
      t &&
      t !== md &&
      (function (t) {
        return !(
          !_i.configLoad ||
          !_i.useRemoteConfig ||
          !to.localStorage ||
          (t &&
            t.config &&
            !(U() - (t.lastUpdate || 0) > 6e4 * _i.configLoadInterval))
        );
      })(e) &&
      !yd[t]
    ) {
      yd[t] = !0;
      var n = { v: "3.7.0-zhongyihulianwang.1", _r: U() },
        r = (_i[qr] || "") + (_i[Mr] ? ni + ni + ni + _i[Mr] : "");
      (n[Vr] = r),
        Wi({
          url: "".concat(Pa(), "/web-config?").concat(ha(n)),
          method: zn,
          timeout: Un,
          needPostCallback: !0,
          callback: function (e) {
            var n = oa(e);
            if (n) {
              var r = n.code,
                i = n.data;
              200 === r && f(i) && ao(t, { lastUpdate: U(), config: i });
            }
          },
          retry: !1,
        });
    }
  }
  var bd,
    wd = !1;
  try {
    (bd = window.__zone_symbol__MutationObserver || window.MutationObserver),
      (wd = p(bd));
  } catch (Tv) {}
  function Ed(t, e, n) {
    if (!(wd && bd && t && e)) return B;
    var r;
    try {
      (r = new bd(function (t) {
        i(t, function (t) {
          try {
            t && n(t);
          } catch (Tv) {}
        });
      })) && r.observe(t, e);
    } catch (Tv) {}
    return function () {
      try {
        return r && r.disconnect();
      } catch (Tv) {}
    };
  }
  function Td(t, e) {
    return w(t, e) > -1;
  }
  var xd = ["IMG", "SCRIPT", "IFRAME"];
  function _d(t) {
    if (Td(xd, t.nodeName) && Xf(t.src) && !gu(t)) {
      var e = X.recentFinishedAjaxContext;
      if (e && e.data) {
        var n = U();
        if (n - e.data.end <= _i.resourceAssociateThreshold) {
          var r = tc.getRootContext(e, function (t) {
            return t.type === Ct || (t.type === xt && !t.subType === be);
          });
          r && r.addResource(t, n);
        }
      }
    }
    i(t.children, _d);
  }
  var Sd = null;
  function kd() {
    i(wi.getElementsByTagName("img"), function (t) {
      t.complete ||
        t[ze] ||
        ((t[ze] = !0),
        L(t, $, function () {
          G.imageResources.push({ loadTime: U(), element: t });
        }));
    });
  }
  function Cd() {
    Ho.on(
      $,
      z(function () {
        t();
        var e = U();
        Es(function () {
          ws.load = e;
        }),
          (aa.loadEventEnd = e),
          clearInterval(Sd);
      })
    ),
      i(Di(), function (t) {
        L(window, t, function (e) {
          Es(function () {
            (ws.e[t] || (ws.e[t] = [])).push(U());
          }),
            Ho.emit(t, e);
        });
      });
    var t = z(function () {
      var t, e;
      _i.monitor_dom_mutation &&
        ((t = document.getElementsByTagName("body")),
        (e = t && t[0]) &&
          Ed(e, { childList: !0, subtree: !0 }, function (t) {
            i(t.addedNodes, _d);
          }));
      var n = U();
      if (
        (Es(function () {
          ws.end = n;
        }),
        (aa.domContentLoadedEventStart = n),
        Ri() && window.performance && window.performance.getEntriesByName)
      ) {
        if (!wi.querySelectorAll) return;
        (G.resources = G.resources || []),
          i(wi.querySelectorAll("head>link,head>script"), function (t) {
            var e;
            "LINK" == t.tagName
              ? (e = t.href)
              : "SCRIPT" != t.tagName || t.defer || t.async || (e = t.src),
              e && G.resources.push(e);
          });
      }
    });
    if (
      (Ri() && L(wi, it, t),
      L(wi, nt, function (e) {
        wi.readyState === rt && t();
      }),
      (!Ri() || (window.performance && !window.performance.getEntriesByName)) &&
        (Sd = setInterval(kd, Fe)),
      !Ri())
    )
      try {
        !(function (t) {
          var e = wi.createElement("script");
          e.type = "text/javascript";
          try {
            e.appendChild(wi.createTextNode(t));
          } catch (n) {
            e.text = t;
          }
          wi.getElementsByTagName("head")[0].appendChild(e);
        })("if(window.TINGYUN) {window.TINGYUN.".concat(Ve, "=+new Date();}"));
      } catch (Tv) {}
  }
  function Ad() {
    try {
      _s(),
        Os(),
        xs(function () {
          q(function () {
            Os();
          });
        }),
        L(
          document,
          Ze,
          function (t) {
            "hidden" === document.visibilityState && As(t),
              aa.addCache(Zi, function () {
                return { state: document.visibilityState, time: U() };
              });
          },
          !0
        ),
        L(window, et, As, !0),
        Cd();
    } catch (Tv) {}
  }
  function Od(t, e) {
    for (var n = U(), r = e.length - 1; r >= 0; r--) {
      var i = e[r];
      i.type === xt || i.end || (i.end = n), e[r - 1] && (e[r - 1].items = [i]);
      var a = void 0;
      (a =
        i.start && i.end && i.end - i.start > _i.eventTimeout
          ? Ht
          : (i.type === xt && e[r + 1] && e[r + 1].state) || Lt),
        (i.state = a);
    }
    (t.data = e[0]), (t.end = n);
  }
  function Rd(t) {
    var e = X.cpParent;
    if (e) {
      X.recordingCpActions = !1;
      var n = e.action,
        r = e.data,
        i = e.commonActionInfo,
        a = e.requestInfo;
      if (n && r && 0 !== r.length) {
        (r[r.length - 1].items = [t.eventData.data]),
          Od(n, r),
          n.data && (n.data.range = $e);
        var o = { pageParam: La() };
        X.opt_custom_param && (o.cpOptCustomParam = X.opt_custom_param);
        var c = y(i || {}, mi(o, yi(), "cpScope"));
        (t.eventData = n),
          t.setSendOptions({
            commonActionInfoMessage: c,
            requestInfo: a,
            crossPage: !0,
          });
      }
    }
  }
  var Nd = 0,
    Id = null;
  function jd(t) {
    if (t.parent) {
      var e = Nd++,
        n = t.url || "",
        r = U(),
        i = new tc({
          parent: t.parent,
          name: "".concat(n, "-").concat(e),
          type: At,
          subType: t.subType || de,
        });
      i.setData({
        type: At,
        subType: i.subType,
        id: e,
        cid: i.id,
        url: n,
        start: r,
      });
      var a = i.collectCrossPageData();
      (Id = a),
        (function (t) {
          ga(fe, A(t));
        })(a),
        i.clear(),
        (i = null);
    }
  }
  function Dd(t) {
    return function () {
      var e = t.apply(this, arguments);
      try {
        if (e)
          jd({
            url: arguments[0],
            parent: (function (t) {
              if (t) {
                var e = Tc[Tc.length - 1];
                if (e) {
                  var n = Ic(e);
                  return jc(n, t) ? Ac(e, Te, { s: n }) : void 0;
                }
              }
            })(U()),
          });
      } catch (Tv) {}
      return e;
    };
  }
  function Pd() {
    i([ye, ge], function (t) {
      wi.addEventListener(
        t,
        function (e) {
          if (e && e.target)
            try {
              var n =
                t === ye
                  ? (function (t) {
                      return {
                        valid:
                          _e === t.target.nodeName &&
                          !t.defaultPrevented &&
                          t.target.href,
                        url: t.target.href,
                        subType: le,
                      };
                    })(e)
                  : (function (t) {
                      return {
                        valid:
                          Se === t.target.nodeName &&
                          !t.defaultPrevented &&
                          t.target.action,
                        url: t.target.action,
                        subType: he,
                      };
                    })(e);
              if (n.valid) {
                var r =
                  e.timeStamp &&
                  (function (t) {
                    var n;
                    try {
                      n = g(Tc, function (e) {
                        return (
                          e.timeStamp === t.timeStamp &&
                          t.target.nodeName === e.target.nodeName
                        );
                      })[0];
                    } catch (e) {}
                    if (n) return Ac(n, Te, { s: Ic(n) });
                  })(e);
                jd({ subType: n.subType, url: n.url, parent: r });
              }
            } catch (e) {}
        },
        r({}, ve, !0)
      );
    });
  }
  function Ld() {
    !(function (t) {
      if (t) {
        var e = t.action,
          n = t.data;
        e && n && 0 !== n.length && (Od(e, n), Go(e));
      }
    })(Id),
      (Id = null);
  }
  function Hd() {
    _i.hook_cross_page &&
      (sc(window, "open", Dd),
      Pd(),
      ks(function () {
        Ld();
      }));
  }
  var Md = [];
  function qd(t) {
    t &&
      (0 === Md.length &&
        L(
          document,
          ye,
          function (t) {
            i(Md, function (e) {
              e(t);
            });
          },
          !0
        ),
      Md.push(t));
  }
  var Bd = 50;
  function Ud() {
    qd(function (t) {
      try {
        if (!t) return;
        var e = t.target || t.srcElement;
        if (!e) return;
        var n = (function (t) {
            var e = rc(),
              n = t.timeStamp;
            return n ? (ac(n) ? n : Math.round(t.timeStamp + e)) : U();
          })(t),
          r = e.outerText || "";
        r && (r = r.substring(0, Bd));
        var i = { path: Cc(e) };
        Hc({ timestamp: n, message: r, category: wr, data: i });
      } catch (t) {
        console.log(t);
      }
    });
  }
  var zd = "sw8",
    Fd = "Page",
    Vd = "1.0.0";
  function Kd(t, e, n) {
    return t || (t = n), t.substring(0, e);
  }
  var Yd = "traceparent",
    Jd = "tracestate";
  function Gd(t) {
    var e, n;
    do {
      (e = ""), (n = 0);
      for (var r = 0; r < t; r++) {
        var i = Math.floor(16 * Math.random()).toString(16);
        (e += i), "0" === i && n++;
      }
    } while (n === t);
    return e;
  }
  function Wd(t) {
    return t || "";
  }
  var Xd,
    Qd = { uniqueId: 0 },
    $d = [],
    Zd = "add",
    tl = "remove",
    el = "opt_custom_param",
    nl = "opera_all_param",
    rl = "content-type",
    il = "sid",
    al = "vid",
    ol = "aid",
    cl = "u",
    sl = "tingyun",
    ul = sl + "=";
  function fl(t, e, n) {
    t.apms || (t.apms = {}), null != e && null != n && (t.apms[e] = n);
  }
  function dl(t, e) {
    if (!_i.x_server_switch) return !1;
    var n = !1;
    try {
      if (_i.key && Nl(t, Jr)) {
        var a = (function () {
            try {
              return J(!0).substring(0, 16);
            } catch (Tv) {}
          })(),
          o = ll();
        a && (o += ";x=" + a);
        var c = xf();
        c && (o += ";u=" + c),
          t.addHeader(mt, o),
          (n = !0),
          (t.xTingyunSent = !0);
      }
      var s = t.pgHeaders;
      if (
        (s ||
          (s = (function (t) {
            var e;
            return (
              r((e = {}), Yd, t.getHeader(Yd)),
              r(e, Jd, t.getHeader(Jd)),
              r(e, zd, t.getHeader(zd)),
              e
            );
          })(t)),
        i(_i.propagators, function (r, i) {
          if (Nl(t, i))
            if (i === Gr) {
              var a = s[Yd],
                o = s[Jd];
              a
                ? o
                  ? e ||
                    ((o = Wd(o + "," + Il(t))), t.addHeader(Jd, o), (n = !0))
                  : ((o = Wd(Il(t))), t.addHeader(Jd, o), (n = !0))
                : o ||
                  ((a = "00-" + Gd(32) + "-" + Gd(16) + "-01"),
                  (o = Wd(Il(t))),
                  t.addHeader(Yd, a),
                  t.addHeader(Jd, o),
                  (n = !0)),
                a && fl(t, Yd, a),
                o && fl(t, Jd, o);
            } else if (i === Wr) {
              var c = s[zd];
              s[zd] ||
                ((c = (function (t) {
                  var e,
                    n = t.url;
                  try {
                    e = Ta(t.url);
                  } catch (Tv) {}
                  return (
                    "1-" +
                    pf(J()) +
                    "-" +
                    pf(J()) +
                    "-0-" +
                    pf(Kd(e && e.hostname, 50, n)) +
                    "-" +
                    pf(Kd(Ra(), 50, Vd)) +
                    "-" +
                    pf(Kd(va(), 150, Fd)) +
                    "-" +
                    pf((e && e.host) || n)
                  );
                })(t)),
                t.addHeader(zd, c),
                (n = !0)),
                c && fl(t, zd, c);
            }
        }),
        _i.apmHeaders)
      ) {
        var u = J(!0);
        i(_i.apmHeaders, function (e) {
          if (e) {
            var r = t.getHeader(e);
            null == r &&
              _i.autoAddApmHeader &&
              t.sameOrigin &&
              (t.addHeader(e, u), (n = !0), (r = u)),
              null != r && fl(t, e, r);
          }
        });
      }
    } catch (Tv) {}
    return n;
  }
  function ll() {
    return _i.key ? "c=B|" + _i.key : "";
  }
  function hl(t, e) {
    t.context ||
      ((t.context = new tc({
        parent: Zf(t, function () {
          var t = ts.get("event");
          if (t && t.type == qe) return Wu(t.key);
        }),
        name: "".concat(t.url, "-").concat(t.id),
        type: _t,
        subType: e || An,
      })),
      t.crossPage && t.context.setData({ crossPage: !0 }));
  }
  function pl(t, e) {
    if (_i.x_server_switch) {
      var n = t.context.data;
      if ((t.apms && (n.apms = t.apms), t.sameOrigin)) {
        var r = t.xTingyunSent ? oa(e(yt)) : null;
        if (r) {
          if (
            ((n.hasServerHeader = !0),
            (n.s_id = r.id),
            (n.s_tname = r.tname),
            (n.s_tid = r.tid),
            (n.s_rid = r.rid),
            (n.s_duration = r.duration),
            "user" in r)
          ) {
            var i = r.user,
              a = i;
            if (null != i && 0 === i.indexOf(gt)) {
              var o = i.substring(gt.length);
              try {
                a = hf.decode(o);
              } catch (Tv) {}
            }
            (n.s_user = a), Oa(a);
          }
          "bid" in r && (n.s_bid = ys(r.bid)),
            "ber" in r && (n.s_ber = r.ber),
            "isError" in r && (n.s_isError = r.isError);
        } else n.hasServerHeader = !1;
        if (_i.serverTiming)
          try {
            var c = e(tr);
            c && (n.st = c);
          } catch (Tv) {}
      }
    }
  }
  function vl(t) {
    var e = t.context.data;
    t.key && ((e.__spe = 1), (e.op = t.key));
  }
  function ml(t, e) {
    try {
      var n = e(rl);
      n && (t.ct = n);
    } catch (Tv) {}
  }
  function yl(t) {
    X.context = t.context;
  }
  function gl(t) {
    if (t.context) {
      var e = !1;
      return (
        t.context.setData({ state: Lt }),
        t.context.canEnd() && (t.context.end(), (e = !0)),
        e
      );
    }
  }
  function bl(t) {
    if (!t || !t.context) return {};
    var e = t.context.data,
      n = {
        method: e.method,
        url: e.url,
        start: e.start,
        end: e.end,
        du: e.du,
        status: e.status,
      };
    return (
      t.context.subType === An
        ? y(n, {
            err: e.err,
            rec: e.rec,
            send: e.send,
            requestHeader: t.headerRecord,
          })
        : y(n, { requestHeader: t.fetchOptions.headers }),
      n
    );
  }
  function wl(t) {
    var e = ts.get("event");
    if (e && e.key) {
      if (e.type === qe) {
        var n = Wu(e.key),
          r = tc.getRootContext(t.context, function (t) {
            return t.type === xt && t.subType !== be;
          });
        if (n && r && n.id != r.id) return;
      }
      (t.key = e.key),
        e.remain++,
        (e.type !== He && t.context.aid) || (t.aid = e.aid);
    }
  }
  function El(t) {
    var e = !0;
    return (
      i(_i.ajaxBlacklist, function (n) {
        if (n && t.indexOf(n) > -1) return (e = !1), !1;
      }),
      e
    );
  }
  function Tl(t, e) {
    var n = {
      url: t.url,
      status_code: t.status,
      method: t.method,
      duration: t.du,
    };
    t.apms && (n.apms = t.apms),
      Hc({
        type: yr,
        category: e,
        message: t.url,
        timestamp: t.start,
        data: n,
      });
  }
  function xl(t, e) {
    $d.length > 0 &&
      i($d, function (n) {
        n(t, e);
      });
  }
  function _l(t) {
    xl(Zd, t);
  }
  function Sl(t) {
    xl(tl, t);
  }
  function kl(t) {
    $d.push(t);
  }
  function Cl(t) {
    var e = w($d, t);
    e > -1 && $d.splice(e, 1);
  }
  function Al(t, e, n) {
    if (t && e && n) {
      var r = sa(e.toLowerCase());
      r && (t[r] = { key: e, value: n });
    }
  }
  function Ol(t) {
    return t.aid || t.context.aid || X.routeAid;
  }
  function Rl(t, e) {
    try {
      var n = Ol(e);
      n && (t.actionId = n);
    } catch (Tv) {}
  }
  function Nl(t, e) {
    if (!_i.propagators[e]) return !1;
    var n = t.sameOrigin;
    return null == n && ((n = Jf(t.url)), (t.sameOrigin = n)), n;
  }
  function Il(t) {
    var e = ll(),
      n = (e ? e + ";" : "") + il + "=" + Da.sid + ";" + al + "=" + Da.pvid,
      r = Ol(t);
    r && (n += ";" + ol + "=" + r);
    var i = xf();
    return i && (n += ";" + cl + "=" + i), sl + "=" + pf(n);
  }
  var jl = ["$.", "$["],
    Dl = "__TY_ROOT__",
    Pl = ["authorization", "proxy-authorization", "set-cookie"],
    Ll =
      (r((Xd = {}), on, en), r(Xd, cn, nn), r(Xd, sn, rn), r(Xd, un, an), Xd);
  function Hl(t, e, n) {
    var r = !0,
      a = !1,
      o = {};
    return (
      i(e, function (e) {
        var c = e.url;
        if (t.indexOf(c) > -1)
          return (
            (a = !0),
            n || e[on] || e[cn] || e[sn] || e[un]
              ? i(Ll, function (t, n) {
                  i(e[n], function (e) {
                    e && (o[t] || (o[t] = []), o[t].push({ key: e }));
                  });
                })
              : (r = !1),
            !1
          );
      }),
      !a && n && (r = !1),
      { matched: a, enabled: r, white: n, posRule: o }
    );
  }
  function Ml(t, e, n) {
    w(Pl, e) < 0 && e && n && (t[n.key] = n.value);
  }
  function ql(t, e, n, r) {
    n
      ? i(n, function (n) {
          var r = n.key;
          Ml(t, r, e[r]);
        })
      : i(e, function (e, n) {
          var a = !1;
          i(r, function (t) {
            if (t.key === n) return (a = !0), !1;
          }),
            a || Ml(t, n, e);
        });
  }
  function Bl(t, e) {
    var n,
      r = !1,
      i = !1;
    return (
      e
        ? ((n = e.posRule[t]), (i = e.white) || e.matched || (r = !0))
        : (r = !0),
      { all: r, white: i, rules: n }
    );
  }
  function Ul(t, e) {
    var n = e.all,
      r = e.white,
      i = e.rules,
      a = {};
    return (
      i ? (r ? ql(a, t, i, null) : ql(a, t, null, i)) : (n || r) && ql(a, t), a
    );
  }
  function zl(t) {
    try {
      return t.slice(0, _i.ajBodyMaxSize);
    } catch (Tv) {}
  }
  function Fl(t) {
    var e = !1,
      n = t;
    n &&
      ((function (t, e) {
        var n;
        return (
          i(e, function (e) {
            if (t.charAt(0) === e && t.charAt(t.length - 1) === e)
              return (n = e), !1;
          }),
          n
        );
      })((n = sa(n)), ["'", '"'])
        ? ((e = !0), (n = n.substring(1, n.length - 1)))
        : (e = isNaN(+n)));
    return { key: n, obj: e };
  }
  function Vl(t, e) {
    var n = e.jp,
      r = e.paths,
      a = e.key;
    return (
      (null != n && r) ||
        ((n = e.jp =
          (function (t) {
            return t && w(jl, t.substring(0, 2)) > -1;
          })(a)),
        (r = e.paths =
          n
            ? (function (t) {
                t = t.substring(1);
                var e = [];
                return (
                  i(t.split(/\.|\[|\]/), function (t) {
                    var n = Fl(t);
                    n.key && e.push(n);
                  }),
                  e
                );
              })(a)
            : [{ key: a, obj: !u(t) }])),
      e
    );
  }
  function Kl(t, e, n) {
    var r, i;
    (i =
      n && n.length > 1
        ? (function (t, e) {
            for (
              var n = -1, r = null == t ? 0 : t.length, i = new Array(r);
              ++n < r;

            )
              i[n] = e(t[n], n, t);
            return i;
          })((r = n.slice(0, -1)), function (t) {
            return t.key;
          }).join(".")
        : Dl),
      t[i] || (t[i] = { ppath: r, indexes: [] }),
      t[i].indexes.push(+e);
  }
  function Yl(t, e, n) {
    var r = n.all,
      a = n.white,
      o = n.rules;
    if (o) {
      var c,
        s = S(t) && e();
      return s
        ? ((c = a
            ? (function (t, e) {
                var n,
                  r = [];
                return (
                  i(e, function (e) {
                    var n = Vl(t, e),
                      a = n.jp,
                      o = n.paths,
                      c = n.key,
                      s = !1;
                    if (a) {
                      var u = t;
                      i(o, function (t, e) {
                        var n = t.key;
                        if (e === o.length - 1) s = n in u;
                        else {
                          var r = u[n];
                          if (null == r) return !1;
                          u = r;
                        }
                      });
                    } else s = c in t;
                    s && r.push(o);
                  }),
                  i(r, function (e) {
                    n || (n = u(t) ? [] : {});
                    var r = n,
                      a = t;
                    i(e, function (t, n) {
                      var i = t.key,
                        o = t.obj;
                      n === e.length - 1
                        ? o
                          ? (r[i] = a[i])
                          : r.push(a[i])
                        : (r[i] || (r[i] = e[n + 1].obj ? {} : []),
                          (r = r[i]),
                          (a = a[i]));
                    });
                  }),
                  n
                );
              })(s, o)
            : (function (t, e) {
                var n = u(t),
                  r = {},
                  a = !1;
                i(e, function (e) {
                  var o = Vl(t, e),
                    c = o.jp,
                    s = o.paths,
                    u = o.key;
                  if (c) {
                    var f = t;
                    i(s, function (t, e) {
                      var n = t.key,
                        i = t.obj;
                      if (e === s.length - 1)
                        n in f && (i ? delete f[n] : (Kl(r, n, s), (a = !0)));
                      else {
                        var o = f[n];
                        if (null == o) return !1;
                        f = o;
                      }
                    });
                  } else u in t && (n ? (Kl(r, u), (a = !0)) : delete t[u]);
                });
                try {
                  a &&
                    i(r, function (e, n) {
                      var r = e.ppath,
                        a = e.indexes;
                      a.sort(function (t, e) {
                        return e - t;
                      });
                      var o,
                        c = t;
                      n === Dl
                        ? (o = c)
                        : i(r, function (t, e) {
                            var n = t.key;
                            if (e === r.length - 1) o = c[n];
                            else {
                              var i = c[n];
                              if (null == i) return (o = null), !1;
                              c = i;
                            }
                          }),
                        u(o) &&
                          i(a, function (t) {
                            o.splice(t, 1);
                          });
                    });
                } catch (Tv) {}
                return t;
              })(s, o)),
          c && (!uc(c) || c.length > 0) ? zl(A(c)) : null)
        : null;
    }
    return r || a ? zl(t) : null;
  }
  function Jl(t, e, n, r, i) {
    var a,
      o,
      c = fa(t),
      s = !1,
      u = !1;
    return (
      (c.getQB = function () {
        if (e) return s || ((a = n(e)), (s = !0)), a;
      }),
      (c.getRB = function () {
        if (r) return u || ((o = i(r)), (u = !0)), o;
      }),
      c
    );
  }
  function Gl(t, e, n, r, i, a) {
    var o = t.queryString,
      c = _i.networkRecord,
      s = c.config,
      u = c.white,
      f = c.black;
    if (s.enabled) {
      var d,
        l = s.pos,
        h = {};
      return (
        l[tn] && o && (h[tn] = zl(o)),
        s.urlOnly
          ? h
          : ((e = (function (t) {
              try {
                t = sa(String(t));
                var e = va();
                if (!t) return e;
                if (K(t, Xr) || K(t, Qr) || K(t, $r)) return t;
                var n = "";
                K(e, Xr)
                  ? (n = Xr)
                  : K(e, Qr)
                  ? (n = Qr)
                  : K(e, $r) && (n = $r);
                var r = e.substring(n.length),
                  i = "";
                if (K(t, "/")) {
                  var a = r.indexOf("/");
                  a > -1 && (r = r.substring(0, a)), (i = r + t);
                } else
                  (r = ma(r)),
                    K(t, "./")
                      ? (t = t.substring(2))
                      : K(t, "../") && ((t = t.substring(3)), (r = ma(r))),
                    (i = r + "/" + t);
                return n + i;
              } catch (Tv) {}
            })(e)),
            za(u) ? (d = Hl(e, u, !0)) : za(f) && (d = Hl(e, f, !1)),
            !d || d.enabled
              ? (l[en] && dc(h, en, Ul(n(), Bl(en, d))),
                l[nn] && r && lc(h, nn, Yl(r, t.getQB, Bl(nn, d))),
                l[rn] && dc(h, rn, Ul(i(), Bl(rn, d))),
                l[an] && a && lc(h, an, Yl(a, t.getRB, Bl(an, d))),
                h)
              : h)
      );
    }
  }
  var Wl = c("URL"),
    Xl = {
      literal: {
        addHeader: function (t, e) {
          t && e && (this.fetchOptions.headers[t] = e);
        },
        getHeader: function (t) {
          return this.fetchOptions.headers[t];
        },
      },
      headers: {
        addHeader: function (t, e) {
          t && e && this.fetchOptions.headers.set(t, e);
        },
        getHeader: function (t) {
          return this.fetchOptions.headers.get(t);
        },
      },
      notSupport: { addHeader: B, getHeader: B },
    };
  function Ql(t) {
    if (this.headers) return this.headers.get(t);
  }
  function $l(t, n) {
    if (t && t.context) {
      t.context.setData({
        end: t.end,
        du: t.status > 0 ? t.end - t.start : 0,
        status: t.status,
        state: Lt,
      });
      var r = t.context.data;
      r.err = n ? 0 : Lr.error;
      var a = e(Ql, n || {});
      pl(t, a), vl(t);
      try {
        var o = Jl(t.url, t.reqBody, oa, t.resBody, oa);
        try {
          dc(
            r,
            el,
            (function (t, e, n) {
              var r = {};
              return (
                lc(r, st, vs(t.queryObj)),
                dc(
                  r,
                  ut,
                  (function (t) {
                    var e = {};
                    return (
                      i(_i.optCustomParamRules[ut], function (n) {
                        var r = t.getHeader(n);
                        null != r && (e[n] = r);
                      }),
                      e
                    );
                  })(e)
                ),
                dc(
                  r,
                  dt,
                  (function (t) {
                    if (!t) return;
                    var e = {};
                    return (
                      i(_i.optCustomParamRules[dt], function (n) {
                        var r = t.headers.get(n);
                        null != r && (e[n] = r);
                      }),
                      e
                    );
                  })(n)
                ),
                r
              );
            })(o, t, n)
          );
        } catch (Tv) {}
        try {
          dc(
            r,
            nl,
            Gl(
              o,
              t.url,
              function () {
                try {
                  var e = {},
                    n = t.fetchOptions.headers;
                  return (
                    f(n)
                      ? i(n, function (t, n) {
                          Al(e, n, t);
                        })
                      : l(n)
                      ? n.forEach(function (t, n) {
                          Al(e, n, t);
                        })
                      : u(n) &&
                        i(n, function (t) {
                          Al(e, t[0], t[1]);
                        }),
                    e
                  );
                } catch (Tv) {}
              },
              t.reqBody,
              function () {
                try {
                  if (n && n.headers) {
                    var t = {};
                    return (
                      n.headers.forEach(function (e, n) {
                        Al(t, n, e);
                      }),
                      t
                    );
                  }
                } catch (Tv) {}
              },
              t.resBody
            )
          );
        } catch (Tv) {}
      } catch (Tv) {}
      return ml(r, a), Rl(r, t), r;
    }
  }
  function Zl(t) {
    var e = {};
    return (
      s(t)
        ? (e.url = t)
        : Wl(t) && s(t.href)
        ? (e.url = t.href)
        : y(
            e,
            (function (t) {
              if (!h(t) && !f(t)) return null;
              var e = {};
              return (
                t.url && (e.url = t.url),
                t.method && (e.method = t.method),
                t.headers && (e.headers = t.headers),
                t.body && s(t.body) && (e.reqBody = t.body),
                e
              );
            })(t)
          ),
      e
    );
  }
  function th(t, e, n) {
    return t.read().then(function (r) {
      if (r.done) return n;
      var i = r.value;
      return (n += e.decode(i)), th(t, e, n);
    });
  }
  function eh(t) {
    return new Promise(function (e) {
      try {
        var n = t.clone().body;
        if (n)
          th(n.getReader(), new TextDecoder(), "")
            .then(function (t) {
              e(t);
            })
            ["catch"](function () {
              e();
            });
        else e();
      } catch (Tv) {
        e();
      }
    });
  }
  function nh(t) {
    return function () {
      var e,
        r,
        i = m.call(arguments, 0);
      try {
        var a = {};
        if ((i && ((a = Zl(i[0])), i[1] && y(a, Zl(i[1]))), (e = El(a.url)))) {
          if (
            ((function (t) {
              var e = !0,
                n = !0;
              t.fetchOptions.headers ||
                ((e = !1), (t.fetchOptions.headers = {}));
              var r = t.fetchOptions.headers;
              l(r)
                ? y(t, Xl.headers)
                : f(r)
                ? y(t, Xl.literal)
                : ((n = !1), y(t, Xl.notSupport)),
                (t.hasOriginalHeaders = e),
                (t.supportAddHeaders = n);
            })(
              (r = {
                id: Qd.uniqueId++,
                method: a.method || zn,
                url: a.url,
                start: U(),
                fetchOptions: a,
                shouldAddToEvent: Xf(a.url),
                scope: new hi(),
                initiatorType: nr,
              })
            ),
            hl(r, On),
            r.supportAddHeaders)
          ) {
            var o = dl(r, !1);
            if (!r.hasOriginalHeaders && o)
              try {
                i[1] || (i[1] = {}), (i[1].headers = r.fetchOptions.headers);
              } catch (Tv) {
                o = !1;
              }
            r.headerAdded = o;
          }
          wl(r),
            r.context.setData({
              type: _t,
              subType: On,
              id: r.id,
              cid: r.context.id,
              method: r.method,
              url: r.url,
              start: r.start,
            }),
            Wf(r, _t),
            _l(r),
            _i.networkRecord.config.pos[nn] &&
              a.reqBody &&
              (r.reqBody = a.reqBody);
        }
      } catch (Tv) {}
      var c,
        u = t.apply(this, i);
      return e && (c = u) && "object" === n(c) && p(c.then)
        ? u.then(
            Wc(function (t) {
              try {
                (r.end = U()),
                  new Promise(function (e) {
                    _i.networkRecord.config.pos[an]
                      ? eh(t)
                          .then(function (n) {
                            n && s(n) && (r.resBody = n), e(t);
                          })
                          ["catch"](function () {
                            e(t);
                          })
                      : e(t);
                  }).then(
                    Wc(function (t) {
                      try {
                        rh(r, t);
                      } catch (Tv) {}
                    })
                  );
              } catch (Tv) {}
              return t;
            }),
            Wc(function (t) {
              try {
                rh(r, null);
              } catch (Tv) {}
              throw t;
            })
          )
        : u;
    };
  }
  function rh(t, e) {
    if (t) {
      t.end || (t.end = U()), (t.status = e ? e.status : 0);
      var n = $l(t, e),
        r = bl(t);
      di({
        type: ln,
        name: mn,
        args: { target: e || {}, actionData: r },
        scope: t.scope,
      }),
        r.st && (n.st = r.st),
        mi(n, t.scope);
      var i = ts.get("event");
      i && i.key == t.key && (i.xhrs.push(n), 0 == --i.remain && i._end()),
        aa.addCache(Xi, function () {
          return n;
        }),
        Sl(t),
        q(function () {
          gl(t), _i.bcFetchEnabled && Tl(n, Er);
        });
    }
  }
  function ih(t, e, n) {
    if (t && t.context && !t.composed) {
      t.composed = !0;
      var r,
        a,
        o,
        c,
        f = oa(e),
        d = {};
      (d[ut] =
        ((r = n.headers || {}),
        (a = {}),
        i(_i.optCustomParamRules[ut], function (t) {
          var e = r[t];
          null != e && (a[t] = e);
        }),
        a)),
        (d[ft] =
          ((o = n.requestData),
          (c = {}),
          o &&
            u(o) &&
            o.length > 0 &&
            i(o, function (t) {
              var e = t;
              s(t) && (e = oa(t)), y(c, gs(e, _i.optCustomParamRules[ft], !0));
            }),
          c));
      var l = (function (t) {
          var e = {};
          return (
            i(t, function (t, n) {
              uc(t) || (e[n] = t);
            }),
            uc(e) ? void 0 : e
          );
        })(d),
        h = {
          end: t.end,
          du: t.end - t.start,
          cb: t.cbTime,
          status: 200,
          err: f && null != f.error ? f.error : 0,
          state: Lt,
        };
      l && (h.opt_custom_param = l), Rl(h, t), t.context.setData(h);
      try {
        vl(t);
      } catch (Tv) {}
    }
  }
  function ah(t) {
    return function () {
      try {
        var e = arguments[1];
        if ("rpc" === arguments[0] && e && e.operationType) {
          var n = Vn + e.operationType,
            r = {
              id: Qd.uniqueId++,
              url: n,
              method: "",
              start: U(),
              shouldAddToEvent: Xf(n),
              scope: new hi(),
            };
          hl(r, Rn),
            wl(r),
            r.context.setData({
              type: _t,
              subType: Rn,
              id: r.id,
              cid: r.context.id,
              method: r.method,
              url: r.url,
              start: r.start,
            }),
            Wf(r, _t),
            (arguments[2] = (function (t, e, n) {
              return Wc(function (r) {
                var i;
                try {
                  (t.end = U()), (i = U());
                } catch (Tv) {}
                try {
                  if (p(e)) return e.apply(this, arguments);
                } finally {
                  try {
                    var a = U();
                    (t.cbTime = a - i),
                      ih(t, r, n),
                      di({
                        type: ln,
                        name: mn,
                        args: { target: this, actionData: t.context.data },
                        scope: t.scope,
                      }),
                      mi(t.context.data, t.scope);
                    var o = ts.get("event");
                    o &&
                      o.key == t.key &&
                      (o.xhrs.push(t.context.data),
                      0 == --o.remain && o._end()),
                      gl(t);
                  } catch (Tv) {}
                }
              });
            })(r, arguments[2], e));
        }
      } catch (Tv) {}
      return t.apply(this, arguments);
    };
  }
  var oh = [],
    ch = !1;
  function sh(t) {
    return (
      ch ||
        (L(
          document,
          "error",
          function (t) {
            t &&
              t.target &&
              (t.target.src || t.target.href) &&
              i(oh, function (e) {
                e(t);
              });
          },
          !0
        ),
        (ch = !0)),
      t && oh.push(t),
      function () {
        try {
          var e = w(oh, t);
          e > -1 && oh.splice(e, 1);
        } catch (Tv) {}
      }
    );
  }
  var uh = ["css", "link", "script", "img", "other"],
    fh = {},
    dh = {},
    lh = !1;
  function hh(t, e) {
    if (t[e]) {
      for (var n = t[e].shift(); n && n.sent; ) n = t[e].shift();
      return n && !n.sent && n.value ? n : undefined;
    }
  }
  function ph(t, e, n) {
    if (n) {
      t[e] || (t[e] = []);
      var r = { sent: !1, value: n };
      return t[e].push(r), r;
    }
  }
  function vh(t) {
    if (!t) return !1;
    if (
      !(t = (function (t) {
        var e = t.indexOf("://");
        if (e < 0) return t;
        return (t = t.substring(e + 3)), t;
      })(t))
    )
      return !1;
    var e = !1;
    return (
      i(_i.monitorResources, function (n) {
        if (
          (function (t, e) {
            return (
              !(!t || !e) &&
              (e.indexOf("*") < 0 && e.indexOf("?") < 0
                ? t === e
                : (function (t, e) {
                    for (var n = 0, r = 0, i = -1, a = 0; n < t.length; )
                      if (r < e.length && (t[n] === e[r] || "?" === e[r]))
                        n++, r++;
                      else if (r < e.length && "*" == e[r])
                        (i = r), (a = n), r++;
                      else {
                        if (-1 == i) return !1;
                        (r = i + 1), (n = ++a);
                      }
                    for (; r < e.length && "*" == e[r]; ) r++;
                    return r == e.length;
                  })(t, e))
            );
          })(t, n)
        )
          return (e = !0), !1;
      }),
      e
    );
  }
  function mh(t) {
    var e = t.url,
      n = t.error,
      r = t.res;
    if (e) {
      var i, a, o, c, s, u, f, d;
      r && !n
        ? ((f = r.startTime),
          d || (d = rc()),
          (a =
            (i = Math.round((d || 0) + (f || 0))) +
            (o = Math.round(r.duration))),
          (c = 200),
          (s = 0),
          (u = r.transferSize || 0))
        : ((i = a = U()), (o = 0), (c = 0), (s = Lr.error), (u = 0));
      var l = {
        type: _t,
        subType: Nn,
        method: zn,
        url: e,
        start: i,
        end: a,
        du: o,
        status: c,
        err: s,
        rec: u,
      };
      tc.buildImmediateAction(_t, Nn, l);
    }
  }
  function yh() {
    var t = Hs(Cr, function (t) {
      var e = (function (t) {
          if (!t) return { valid: !1 };
          var e = t.initiatorType,
            n = t.name,
            r = w(uh, e) > -1,
            i = vh(n);
          return { url: n, valid: r && i };
        })(t),
        n = e.url;
      if (e.valid) {
        var r = hh(dh, n);
        if (r) mh({ url: n, res: t, error: r.value }), (r.sent = !0);
        else {
          var i = ph(fh, n, t);
          F(function () {
            i.sent || (mh({ url: n, res: t, error: !1 }), (i.sent = !0));
          });
        }
      }
    });
    t.po && (lh = !0);
  }
  function gh() {
    sh(function (t) {
      var e = t.target.src || t.target.href;
      if (
        (aa.addCache($i, function () {
          return { url: e, error: !0 };
        }),
        lh)
      )
        try {
          var n = (function (t) {
            return vh(t);
          })(e);
          if (!n) return;
          var r = hh(fh, e);
          if (r) mh({ url: e, res: r.value, error: !0 }), (r.sent = !0);
          else {
            var i = ph(dh, e, !0);
            F(function () {
              i.sent || (mh({ url: e, error: !0 }), (i.sent = !0));
            });
          }
        } catch (Tv) {}
    });
  }
  var bh = "onload",
    wh = "on" + nt,
    Eh = {},
    Th = "open",
    xh = "setRequestHeader",
    _h = "send",
    Sh = !0;
  function kh(t) {
    return Eh[t[at]];
  }
  function Ch(t) {
    return !!t && !t[ct];
  }
  function Ah(e) {
    return function (n, r) {
      try {
        var i = this;
        if ((!El(r) && i && (i[ct] = !0), Ch(i))) {
          var a = {};
          (a.method = n),
            (a.url = r),
            (a.id = Qd.uniqueId++),
            (a.jserror = !1),
            (a.headerRecord = {}),
            (a.scope = new hi()),
            (a.shouldAddToEvent = Xf(r)),
            (a.initiatorType = er),
            (a.pgHeaders = {}),
            y(
              a,
              ((o = i),
              {
                addHeader: function (t, e) {
                  try {
                    t && e && o.setRequestHeader(t, e);
                  } catch (Tv) {}
                },
                getHeader: function (t) {
                  return this.headerRecord[t];
                },
              })
            ),
            hl(a),
            wl(a),
            a.context.setData({
              type: _t,
              subType: An,
              id: a.id,
              cid: a.context.id,
              method: a.method,
              url: a.url,
              state: a.state,
              jserror: a.jserror,
            }),
            Wf(a, _t),
            (a.toJSON = function () {
              return undefined;
            }),
            (function (t, e) {
              (t[at] = e.id), (Eh[e.id] = e);
            })(i, a);
        }
      } catch (Tv) {}
      var o;
      return Sh ? e.apply(this, arguments) : t(e, [this, arguments]);
    };
  }
  function Oh(e) {
    return function (n, r) {
      try {
        var a;
        if (Ch(this) && (a = kh(this)) && n && r) {
          var o =
            ((u = n),
            i(_i.optCustomParamRules[ut], function (t) {
              if (u === t) return (f = !0), !1;
            }),
            f);
          if (_i.x_server_switch) {
            var c = Y(n.toLowerCase());
            if (
              c === Jd &&
              !(function (t) {
                return t && t.indexOf(ul) > -1;
              })(r) &&
              Nl(a, Gr) &&
              !a.pgHeaders[Jd]
            ) {
              var s = Wd(r + "," + Il(a));
              s && (r = arguments[1] = s);
            }
            (c !== Jd && c !== Yd && c !== zd) || (a.pgHeaders[c] = r);
          }
          a &&
            o &&
            (a.reqHeaderParam || (a.reqHeaderParam = {}),
            (a.reqHeaderParam[n] = r)),
            a.headerRecord || (a.headerRecord = {}),
            (a.headerRecord[n] = r),
            _i.networkRecord.config.pos[en] &&
              (a._reqHeaders || (a._reqHeaders = {}), Al(a._reqHeaders, n, r));
        }
      } catch (Tv) {}
      var u, f;
      return Sh ? e.apply(this, arguments) : t(e, [this, arguments]);
    };
  }
  function Rh(e) {
    return function (n) {
      try {
        var r,
          a = this;
        Ch(a) &&
          (r = kh(a)) &&
          ((r.start = U()),
          (r.reqSize = V(n)),
          n && s(n) && (r.requestData = n),
          r.context.setData({ start: r.start }),
          (function (t, e) {
            var n = ts.getContext();
            function r(r) {
              return Wc(function () {
                var n, i;
                if ((jh(t, e), p(r)))
                  if (
                    (e && 4 == t.readyState && ((i = U()), yl(e)),
                    _i.catchAsyncCallback)
                  )
                    try {
                      n = r.apply(this, arguments);
                    } catch (Tv) {
                      throw (e && (e.jserror = !0), Tv);
                    } finally {
                      e && 4 == t.readyState && (e.cbTime = U() - i);
                    }
                  else
                    try {
                      n = r.apply(this, arguments);
                    } finally {
                      e && 4 == t.readyState && (e.cbTime = U() - i);
                    }
                return n;
              }, n);
            }
            Ih(t, r);
            try {
              Ri()
                ? (function (t, e) {
                    i(Lr, function (n, r) {
                      L(
                        t,
                        r,
                        Wc(function () {
                          Nh(e, n, r), t && t[Ce] === bh && jh(t, e);
                        })
                      );
                    });
                  })(t, e)
                : (function (t, e) {
                    i(Lr, function (n, r) {
                      var i = "on" + r;
                      t[i]
                        ? sc(t, i, function (t) {
                            return function () {
                              if ((Nh(e, n, r), p(t)))
                                return t.apply(this, arguments);
                            };
                          })
                        : (t[i] = function () {
                            Nh(e, n, r);
                          });
                    });
                  })(t, e);
            } catch (Tv) {}
            if (!t[ke]) {
              var a = Wc(function () {
                t[ke] || (4 === t.readyState && jh(t, e));
              }, n);
              try {
                Ri() ? L(t, nt, a) : ((t[wh] = a), (t[wh][ke] = !0));
              } catch (Tv) {
                return;
              }
            }
            q(function () {
              Ih(t, r);
            });
          })(a, r),
          dl(r, !0),
          _l(r));
      } catch (Tv) {}
      return Sh ? e.apply(this, arguments) : t(e, [this, arguments]);
    };
  }
  function Nh(t, e, n) {
    t && ((t.errorCode = e), (t.errorEvent = n));
  }
  function Ih(t, e) {
    Ri() && t[bh] && !t[ke] && (sc(t, bh, e), (t[ke] = !0), (t[Ce] = bh));
    var n = t[wh];
    !n || t[ke] || n[ke] || (sc(t, wh, e), (t[ke] = !0), (t[Ce] = wh));
  }
  function jh(t, n) {
    try {
      if (!n) return;
      if (((n.end = U()), (n.readyState = t.readyState), 4 == t.readyState)) {
        if (n.callbackEnd) return;
        (n.callbackEnd = !0),
          Ri() && delete t[ke],
          yl(n),
          (n.status = t.status);
        var r = (function (t) {
          var e = "";
          try {
            if ("" == t.responseType || "text" == t.responseType)
              e = t.responseText;
            else if (t.response) e = t.response;
            else
              try {
                e = t.responseText;
              } catch (Tv) {}
          } catch (Tv) {}
          return e || "";
        })(t);
        r && s(r) && (n.text = r), (n.resSize = V(r));
        var a = (function (t, n) {
            if (!t || !t.context || t.composed) return;
            var r = t.status;
            y(t.context.data, {
              end: t.end,
              du: r > 0 ? t.end - t.start : 0,
              cb: t.cbTime || 0,
              status: r,
              err: t.errorCode ? t.errorCode : 0,
              rec: t.resSize,
              send: t.reqSize,
              state: Lt,
            });
            var a = t.context.data,
              o = e(Dh, n);
            pl(t, o), vl(t);
            try {
              var c = Jl(t.url, t.requestData, Ph, t.text, oa);
              try {
                dc(
                  a,
                  el,
                  (function (t, e, n) {
                    var r = {};
                    return (
                      lc(r, st, vs(t.queryObj)),
                      dc(r, ut, e.reqHeaderParam),
                      lc(r, ft, gs(t.getQB, _i.optCustomParamRules[ft], !0)),
                      lc(
                        r,
                        dt,
                        (function (t, e) {
                          var n;
                          return (
                            i(e, function (e) {
                              var r = (function (t, e) {
                                if (t && t.getResponseHeader)
                                  try {
                                    return t.getResponseHeader(e);
                                  } catch (Tv) {}
                              })(t, e);
                              null != r && ca((n = n || {}), e, r);
                            }),
                            n
                          );
                        })(n, _i.optCustomParamRules[dt])
                      ),
                      lc(r, lt, gs(t.getRB, _i.optCustomParamRules[lt], !0)),
                      r
                    );
                  })(c, t, n)
                );
              } catch (Tv) {}
              try {
                dc(
                  a,
                  nl,
                  Gl(
                    c,
                    a.url,
                    function () {
                      return t._reqHeaders;
                    },
                    t.requestData,
                    function () {
                      try {
                        return (function (t) {
                          if (!t) return {};
                          var e = t.split(/\r?\n/),
                            n = {};
                          return (
                            i(e, function (t) {
                              if (!t) return !0;
                              var e = t.indexOf(":");
                              if (e > -1) {
                                var r = Y(t.substring(0, e)),
                                  i = Y(t.substring(e + 1));
                                Al(n, r, i);
                              }
                            }),
                            n
                          );
                        })(n.getAllResponseHeaders());
                      } catch (Tv) {}
                    },
                    t.text
                  )
                );
              } catch (Tv) {}
            } catch (Tv) {}
            return ml(a, o), Rl(a, t), (t.composed = !0), a;
          })(n, t),
          o = bl(n);
        di({
          type: ln,
          name: mn,
          args: { target: t, actionData: o },
          scope: n.scope,
        }),
          o.st && (a.st = o.st),
          n.shouldAddToEvent && (X.recentFinishedAjaxContext = n.context),
          aa.addCache(Xi, function () {
            var e = a;
            try {
              t.responseURL && (e = y({}, a, { url: t.responseURL }));
            } catch (Tv) {}
            return e;
          }),
          Sl(n);
        var c = ts.get("event");
        q(function () {
          try {
            !(function (t, e) {
              t && e && t.jserror && (e.jserror = t.jserror);
              t.errorCode && !e.err && (e.err = t.errorCode);
              t.cbTime && !e.cb && (e.cb = t.cbTime);
              mi(e, t.scope);
            })(n, a),
              c &&
                c.key == n.key &&
                (c.xhrs.push(a), 0 == --c.remain && c._end()),
              gl(n),
              (function (t) {
                try {
                  (Eh[t[at]] = null), delete Eh[t[at]];
                } catch (Tv) {}
              })(t),
              _i.bcXhrEnabled && Tl(a, Tr);
          } catch (Tv) {}
        });
      }
    } catch (Tv) {}
  }
  function Dh(t) {
    return this.getResponseHeader(t);
  }
  function Ph(t) {
    var e,
      n,
      r = oa(t);
    return (
      r || ((n = {}), (r = s((e = (e = t) || "")) && e ? (n = da(e)) : n)), r
    );
  }
  function Lh(t) {
    if (!t || !(t[Th] && t[xh] && t[_h])) return !1;
    var e, n, r, i;
    try {
      (n = Kr in t[Th]),
        (r = Kr in t[xh]),
        (i = Kr in t[_h]),
        (e = n === r && r === i);
    } catch (Tv) {
      e = !1;
    }
    return !!e && !(!(Sh = n) && Ri());
  }
  function Hh() {
    _i.hookAjax &&
      ((function () {
        if (_i.hookXhr) {
          var t = Ei && Ei.prototype;
          if (Lh(t))
            sc(t, Th, Ah),
              _i.hook_xhr_setrequestheader && sc(t, xh, Oh),
              sc(t, _h, Rh);
          else if (Ei)
            try {
              Lh(new Ei()) &&
                (window.XMLHttpRequest = function () {
                  var t = new Ei();
                  return (
                    sc(t, Th, Ah),
                    _i.hook_xhr_setrequestheader && sc(t, xh, Oh),
                    sc(t, _h, Rh),
                    t
                  );
                });
            } catch (Tv) {}
        }
      })(),
      _i.hookFetch &&
        window.fetch &&
        window.Promise &&
        Ri() &&
        sc(window, "fetch", nh),
      _i.hookMPaas &&
        window.AlipayJSBridge &&
        p(window.AlipayJSBridge.call) &&
        sc(window.AlipayJSBridge, "call", ah),
      Ri() &&
        (function () {
          if ((gh(), _i.monitorResources && 0 !== _i.monitorResources.length))
            try {
              yh();
            } catch (Tv) {}
        })());
  }
  var Mh = ["trace", "debug", "info", "warn", "error", "log"],
    qh = 1024,
    Bh = "[?]",
    Uh = 10;
  function zh(t) {
    var e,
      n = !0;
    try {
      e = Kr in t;
    } catch (Tv) {
      n = !1;
    }
    return e || Ai || (n = !1), { enabled: n, canApply: e };
  }
  function Fh() {
    var e = _i.bcParseConsoleParam
      ? function (t) {
          return Hi(t);
        }
      : function (t) {
          return String(t);
        };
    i(Mh, function (n) {
      try {
        var r = window.console[n];
        if (!r) return;
        var a = 0,
          o = !0,
          c = zh(r),
          s = c.enabled,
          u = c.canApply;
        if (!s) return;
        window.console[n] = function () {
          try {
            if (o && a < Uh) {
              a++;
              var c = [],
                s = [].slice.call(arguments);
              !(function (t) {
                i(t, function (e, n) {
                  if ("ref=Ref<" === e) return (t[n + 1] = "viewRef"), !1;
                });
              })(s),
                i(s, function (t) {
                  try {
                    var n = e(t);
                    n !== undefined && a <= 1 && c.push(n);
                  } catch (Tv) {
                    c.push(Bh);
                  }
                });
              var f = c.join(" ");
              if (f) {
                var d = n;
                "log" === d && (d = "info"),
                  (f = f.substring(0, qh)),
                  Hc({ category: br, level: d, message: f });
              }
              a--;
            } else o = !1;
          } catch (Tv) {}
          return u ? r.apply(this, arguments) : t(r, [this, arguments]);
        };
      } catch (Tv) {}
    });
  }
  function Vh() {
    var t = window.onerror;
    (window.onerror = function (e, n, r, i, a) {
      if ((ds(e, n, r, i, a), p(t))) return t.apply(this, arguments);
    }),
      (window.onerror._ty = !0);
  }
  function Kh() {
    var t = window.onerror;
    (t && t._ty) || Vh();
  }
  function Yh(t) {
    var e, n, r, i, a;
    (t instanceof window.Event ||
      (window.ErrorEvent && t instanceof window.ErrorEvent)) &&
      ((e =
        t.message ||
        (t.error && (t.error.message || t.error.constructor.name)) ||
        ""),
      (n = t.lineno || 0),
      (r = t.colno || 0),
      (i =
        t.filename ||
        (t.error && t.error.filename) ||
        (t.target && t.target.baseURI) ||
        ""),
      (a = t.error)),
      ds(e, i, n, r, a);
  }
  function Jh(t) {
    if (t) {
      var e;
      try {
        "reason" in t
          ? (e = t.reason)
          : "detail" in t && "reason" in t.detail && (e = t.detail.reason);
      } catch (t) {}
      if (e) {
        var n = Object.prototype.toString.call(e);
        if (Ua(n, "ErrorEvent") && e.error) Yh(e);
        else {
          var r,
            a = (function (t, e) {
              var n,
                r = !1;
              return (
                i(e, function (e) {
                  if (Ua(t, e)) return (n = e), (r = !0), !1;
                }),
                { typeName: n, ok: r }
              );
            })(n, ["Error", "DOMException", "DOMError"]),
            o = a.ok,
            c = a.typeName;
          if (o) {
            if ("stack" in e) return void ls(e, null, Sr);
            var s = e.name || c;
            r = e.message ? "".concat(s, ": ").concat(e.message) : s;
          }
          r || (r = Hi(e)), ds(r);
        }
      }
    }
  }
  function Gh() {
    _i.jsErrorEnabled &&
      (Ho.on(Di(), function () {
        fs();
      }),
      setInterval(fs, es),
      (function () {
        if (_i.errorEnabled) {
          var t = E();
          t ? Vh() : L(window, Q, Yh),
            Ho.on($, function () {
              t && q(Kh);
            });
        }
      })(),
      _i.unhandledrejectionEnabled && L(window, "unhandledrejection", Jh));
  }
  function Wh(t, e) {
    if ("undefined" != typeof nbsJsBridge && nbsJsBridge.logJsResult) {
      var n = { rm: {}, em: [], cpm: {} };
      e && (n.rm.res = e.res || []),
        t && ((n.cpm = t), (n.cpm.ul = Da.ref)),
        nbsJsBridge.logJsResult(A(n));
    }
  }
  var Xh = 1,
    Qh = { UNKNOWN: 0, SUCCESS: 1, FAIL: 2 },
    $h = "attributes",
    Zh = "metrics";
  function tp(t, e) {
    var n = { type: It };
    t && (n.spans = t), e && (n.events = e), Go({ type: Nt, data: n });
  }
  function ep(t, e) {
    return y(t, { attributes: e });
  }
  function np(t) {
    return null == t || t < 0;
  }
  function rp(t, e) {
    if (
      ((e = e || {}),
      t &&
        ((function (t) {
          return t[$h] && t[$h].state === Xh;
        })(e) ||
          !np(t.duration)))
    )
      return (
        e[$h] && (t[$h] = e[$h]),
        e[Zh] && e[Zh].length > 0 && (t[Zh] = e[Zh]),
        t
      );
  }
  function ip(t, e, n) {
    return rp({ type: Nr, name: t, duration: e }, n);
  }
  function ap(t, e, n) {
    var r = (function (t, e) {
      if (t && !np(e)) return { name: t, value: e };
    })(e, n);
    r && t.push(r);
  }
  function op(t, e) {
    e && t.push(e);
  }
  var cp,
    sp,
    up = 5e3,
    fp = 1e3,
    dp = 2,
    lp = 50,
    hp = ["IMG", "SCRIPT", "IFRAME", "LINK", "AUDIO", "VIDEO", "SOURCE"],
    pp = [],
    vp = {},
    mp = [],
    yp = [],
    gp = 0,
    bp = !1,
    wp = !1,
    Ep = 0,
    Tp = 0,
    xp = !1,
    _p = !1,
    Sp = !1,
    kp = ["beacon", "preflight"],
    Cp = 60;
  function Ap() {
    var t = fc(vp);
    if (t > dp) return ic();
    var e = [];
    i(pp, function (t) {
      e.push([t.startTime, 0]), e.push([t.endTime, 1]);
    }),
      i(vp, function (t) {
        e.push([t.startTime, 0]);
      }),
      e.sort(function (t, e) {
        return e[0] - t[0];
      });
    var n = 0;
    return (
      i(e, function (e) {
        var r = e[0];
        if (0 === e[1]) t--;
        else if (++t > dp) return (n = r), !1;
      }),
      n
    );
  }
  function Op(t) {
    var e,
      n = t.item,
      i = t.extra;
    "error" in i && ((e = i.error), delete i.error);
    var a = n.n;
    return (
      delete n.n,
      r(
        { startTime: n.o, duration: n.du, name: a, error: e },
        $h,
        y({ entry: n }, i)
      )
    );
  }
  function Rp() {
    var t = [],
      e = [];
    if ((_i.webVitalsTBTEnabled && Ep > 0 && ap(e, fr, Ep), xp)) {
      ap(e, "fp", gp);
      var n = X.pageActionData;
      n && (ap(e, "fs", n.fs), ap(e, "le", n.le));
      var a = $s();
      if (a) {
        var o = Op(Xs(a)),
          c = o.startTime,
          s = o.duration;
        y(o[$h], od()),
          op(
            t,
            rp(
              {
                type: jr,
                name: o.name,
                startTime: c,
                duration: s,
                endTime: c + s,
              },
              r({}, $h, o[$h])
            )
          );
      }
      i(yp, function (e) {
        var n,
          i = Op(Qs(e, ta)),
          a = i.error;
        a === Ks.TRUE ? (n = Qh.FAIL) : a === Ks.UNKNOWN && (n = Qh.UNKNOWN);
        var o = i.startTime,
          c = i.duration,
          s = {
            type: Ir,
            name: i.name,
            startTime: o,
            duration: c,
            endTime: o + c,
          };
        null != n && (s.status = { code: n }), op(t, rp(s, r({}, $h, i[$h])));
      }),
        i(vp, function (e) {
          op(
            t,
            (function (t) {
              return rp(
                {
                  type: Ir,
                  name: t.name,
                  startTime: t.startTime,
                  status: { code: 0 },
                },
                r({}, $h, { entry: { rt: t.initiatorType }, state: Xh })
              );
            })(e)
          );
        }),
        (t = t.concat(mp));
    }
    var u = ip(ur, Tp, r({}, Zh, e));
    u && (t.unshift(u), tp(t)), (wp = !0);
    try {
      (pp.length = 0), (mp.length = 0), (yp.length = 0), (vp = {});
    } catch (Tv) {}
  }
  function Np() {
    try {
      _p && ((_p = !1), Rp());
    } catch (Tv) {}
  }
  function Ip() {
    if (!Ri()) return !1;
    var t = "PerformanceLongTaskTiming" in window && Ms(Ar),
      e = wd,
      n = Ms(Cr);
    return t && e && n;
  }
  function jp(t) {
    if (t) {
      var e = [];
      return (
        i(t, function (t) {
          t &&
            e.push({
              containerType: t.containerType,
              containerSrc: t.containerSrc,
              containerId: t.containerId,
              containerName: t.containerName,
            });
        }),
        e
      );
    }
  }
  function Dp() {
    var t = Hs(Cr, function (t) {
      t &&
        (t.name &&
          !Td(kp, t.initiatorType) &&
          (function (t) {
            var e = t.name,
              n = t.startTime,
              r = n + t.duration;
            pp.push({ entryType: Cr, name: e, startTime: n, endTime: r });
            var i = Ap();
            i > 0 && cp.setTriggerTime(i + up);
          })(t),
        yp.push(t));
    });
    return t.stop;
  }
  function Pp(t) {
    return t && (t.src || t.href) && Td(hp, t.nodeName);
  }
  function Lp(t) {
    var e = !1;
    return (
      i(t, function (t) {
        if (Pp(t) || Lp(t.children)) return (e = !0), !1;
      }),
      e
    );
  }
  function Hp(t) {
    cp.setTriggerTime(ic() + up);
  }
  function Mp(t) {
    var e,
      n,
      r,
      i = function (t) {
        (("childList" === t.type && Lp(t.addedNodes)) ||
          ("attributes" === t.type && Pp(t.target))) &&
          Hp();
      },
      a =
        t > 0
          ? ((e = i),
            (n = t),
            (r = 0),
            function () {
              var t = U();
              if (t - r >= n)
                try {
                  return e.apply(this, arguments);
                } finally {
                  r = t;
                }
            })
          : i;
    return Ed(
      document.documentElement,
      {
        attributes: !0,
        childList: !0,
        subtree: !0,
        attributeFilter: ["src", "href"],
      },
      a
    );
  }
  function qp() {
    function t(t, e) {
      try {
        if (!(r = e).method || r.method.toUpperCase() !== zn) return;
        var n = e.id;
        t === Zd
          ? (function (t, e) {
              vp[t] || (vp[t] = e);
            })(n, {
              initiatorType: e.initiatorType,
              startTime: oc(e.start),
              name: e.url,
            })
          : (function (t) {
              delete vp[t];
            })(n);
      } catch (Tv) {}
      var r;
    }
    return (
      kl(t),
      function () {
        Cl(t);
      }
    );
  }
  function Bp() {
    var t,
      e = qp(),
      n = _i.webVitalsTTIMutationCheckRate;
    return (
      n >= 0 && (t = Mp(n)),
      function () {
        e(), t && t();
      }
    );
  }
  function Up() {
    if (Ip() && _i.webVitalsTTIEnabled) {
      var t;
      (bp = !0),
        (function (t) {
          try {
            wi.readyState === rt ? t() : Ho.on($, t);
          } catch (Tv) {}
        })(function () {
          q(function () {
            (Sp = !0), Np();
          });
        }),
        Ho.on(ji(), function () {
          Np();
        });
      var e,
        n,
        i,
        a,
        o,
        c,
        s = Dp(),
        u =
          ((e = Hs(
            Ar,
            function (t) {
              if (t) {
                var e = t.startTime,
                  n = t.duration,
                  i = e + n,
                  a = n - lp;
                a > 0 && gp && e >= gp && (Ep += a);
                var o = rp(
                  {
                    type: t.entryType,
                    name: t.name,
                    startTime: e,
                    duration: n,
                    endTime: i,
                  },
                  r({}, $h, { attribution: jp(t.attribution) })
                );
                op(mp, o), (sp = o), cp.setTriggerTime(i + up);
              }
            },
            !1
          )),
          e.stop);
      (n = h),
        (i = null),
        (a = -1),
        (o = !1),
        (cp = {
          setTriggerTime: function (t) {
            return !(t <= a || !n || ((a = t), c(), 0));
          },
          getTriggerTime: function () {
            return a;
          },
          schedule: (c = function () {
            if (!o || !n) return !1;
            var t = a - ic();
            return (
              t >= 0 &&
              (clearTimeout(i),
              (i = setTimeout(function () {
                try {
                  n();
                } catch (Tv) {}
              }, t)),
              !0)
            );
          }),
          start: function () {
            if (!o && n) return (o = !0), c();
          },
          disable: function () {
            clearTimeout(i), (i = null), (a = -1), (o = !1), (n = null);
          },
        });
      var f = su(),
        d = f.inited;
      (gp = f.value),
        d && (null == gp || gp <= 0)
          ? l()
          : d
          ? q(function () {
              var e = Math.max(gp + up, cp.getTriggerTime());
              if (ic() >= e)
                try {
                  h();
                } catch (Tv) {}
              else (t = Bp()), cp.setTriggerTime(e), cp.start() || l();
            })
          : ((t = Bp()),
            (function (t) {
              au ? t({ value: au }) : ou.push(t);
            })(function (t) {
              var e = t.value;
              null != (gp = e) && gp > 0
                ? (cp.setTriggerTime(gp + up), cp.start() || l())
                : l();
            }));
    } else
      try {
        Is(Ar);
      } catch (Tv) {}
    function l() {
      try {
        t && t(), s(), u(), cp.disable(), X.pfSent && aa.clearCache([Xi, $i]);
      } catch (Tv) {}
    }
    function h() {
      var t = ic(),
        e = (function (t) {
          return !(t - (sp ? sp.endTime : gp) < up || t - Ap() < up);
        })(t);
      e
        ? (!(function () {
            if ((sp && (Tp = sp.endTime), Tp < gp && (Tp = gp), !(Tp <= 0)))
              if (((xp = Tp >= _i.webVitalsTTIThreshold), Sp))
                try {
                  Rp();
                } catch (Tv) {}
              else _p = !0;
          })(),
          l())
        : Cp > 0
        ? (Cp--, cp.setTriggerTime(t + fp))
        : l();
    }
  }
  var zp,
    Fp = {},
    Vp = {};
  function Kp(t, e) {
    var n = Js().performance,
      r = { tt: o(wi.title), charset: wi.characterSet };
    if (
      (Es(function () {
        uc(t.resource.handler) || (ws.resource = t.resource.statistic),
          (r.debug = ws);
      }),
      (bs = !1),
      n && e.slowPage)
    ) {
      var a = [];
      try {
        a = Ys(Cr, n);
      } catch (Tv) {}
      var c = [],
        s = $s();
      s && c.push(Ws(Xs(s)));
      var u = [];
      i(a, function (t) {
        var e = Ws(Qs(t, "pf"));
        u.push(e);
      });
      var f = [];
      i(Vp, function (t) {
        f.push(
          (function (t) {
            return {
              o: Gs(oc(t.start)),
              rt: t.initiatorType,
              n: t.url,
              method: t.method,
            };
          })(t)
        );
      }),
        c.length > 0 && (r.navigation = c),
        u.length > 0 && (r.res = u),
        f.length > 0 && (r.pending = f);
    }
    e.metricData && (r.metric = e.metricData), e.marks && (r.mark = e.marks);
    var d = aa.getCache(Zi);
    return d && d.length > 0 && (r.vsby = d), r;
  }
  function Yp() {
    var t = {},
      e = 0,
      n = window.performance;
    i(Ys("mark", n), function (n) {
      if (n && n.name && n.startTime && 0 === n.name.indexOf(wt)) {
        var r = n.name.substring(wt.length);
        r && ((t[r] = Math.round(n.startTime)), (e += 1));
      }
    });
    var r = n && n.timing ? n.timing.navigationStart : b,
      a = y({}, (window[bt] && window[bt].data) || {}, W || {});
    return (
      a &&
        n &&
        n.timing &&
        i(a, function (n, i) {
          n && f(n) && n.timestamp && ((t[i] = n.timestamp - r), (e += 1));
        }),
      e > 0 ? t : null
    );
  }
  function Jp(t, e, n) {
    var r = y({}, t || {}, { type: Ct, subType: n });
    return X.recordingCpActions && (r.crossPage = !0), e && (r.body = e), r;
  }
  var Gp = z(function () {
      if (Fp.overview) {
        var t = y({}, Fp.overview),
          e = Ru(t);
        t.st = e;
        var n = Jp(t, null, Dt);
        tc.buildImmediateAction(Ct, Dt, n);
      }
    }),
    Wp = z(function (t) {
      if (!X.pfSent) {
        var e = y(Nu(window), od()),
          n = { metric: { le: e.le }, debug: {} };
        try {
          yu(n), iu(n), ku(n), Au(n, { context: t });
        } catch (Tv) {}
        Es(function () {
          ws.calc = n.debug;
        });
        var r = y(e, n.metric),
          a = Yp();
        a &&
          i(a, function (t, e) {
            d(t) && t >= 0 && (r[e] = t);
          });
        var o = "";
        i(["fp", "fs", "dr", "le"], function (t) {
          o +=
            (r.f > 0 ? r[t] - r.f : r[t]) >= _i[t + "_threshold"] ? "1" : "0";
        }),
          (r.trflag = o || "0000");
        var c,
          s = Kp(t, {
            metricData: n.data,
            slowPage: ((c = o), c && c.indexOf("1") > -1),
            marks: a,
          });
        t._ctx.pageClose && (r.st = Ru(r)), (Fp.overview = r);
        var u = Jp(r, s, jt);
        t.setSendOptions({ query: { ps: 1 } }), y(t.eventData.data, u);
        try {
          Wh(r, s);
        } catch (Tv) {}
        (X.pfSent = !0),
          (G.pfStart = U()),
          aa.clearCache([Zi, Qi]),
          (bp && !wp) || aa.clearCache([Xi, $i]),
          zp && zp(),
          di({ type: ln, name: vn, args: { actionData: u }, scope: yi() }),
          (X.pageActionData = u);
      }
    });
  function Xp(t) {
    (X.recordingPageLoadEvent = !1),
      X.pageLoadEvent &&
        (t && (X.pageLoadEvent._ctx.pageClose = !0),
        (X.pageLoadEvent.endLock = !1),
        X.pageLoadEvent.end());
  }
  var Qp = z(function () {
    X.pageLoadEvent &&
      (X.pageLoadEvent.closed
        ? Gp()
        : (Xp(!0), X.pageLoadEvent.closed || X.pageLoadEvent.timeout()));
  });
  function $p() {
    ad(),
      (function () {
        try {
          var t = fa(Da.ref).queryObj;
          if (t) {
            var e = vs(t);
            if (e) {
              var n = {};
              (n[st] = e), (X.opt_custom_param = n);
            }
          }
        } catch (Tv) {}
      })();
    try {
      _i.baseHref = (wi.getElementsByTagName("base")[0] || {}).href;
    } catch (Tv) {}
    var t = window.screen;
    t && ((Da.sh = t.height), (Da.sw = t.width)),
      (Da.pvid = J()),
      Uf("pvid", Da.pvid);
    var e,
      n = Js().startTime;
    _i.bcNavigationEnabled &&
      Hc({ category: _r, timestamp: n, message: Da.ref }),
      (zp = (function () {
        function t(t, e) {
          Vp && (t === Zd ? (Vp[e.id] = e) : delete Vp[e.id]);
        }
        return (
          kl(t),
          function () {
            (Vp = null), Cl(t);
          }
        );
      })()),
      (e = { ns: n }),
      yi().setParams(e);
  }
  function Zp() {
    if (
      ((X.recordingPageLoadEvent = !0),
      (X.pageLoadEvent = new tc({ type: Ct, subType: jt, endLock: !0 })),
      X.pageLoadEvent.addPostComposer(Wp),
      Ri())
    ) {
      var t = oa(ya(fe));
      t &&
        t.fromUrl &&
        wi.referrer &&
        t.fromUrl.indexOf(wi.referrer) > -1 &&
        ((X.recordingCpActions = !0),
        (X.cpParent = t),
        X.pageLoadEvent.addPostComposer(Rd)),
        ba(fe);
    }
    return (
      (function () {
        if (Ri()) {
          var t = 0;
          try {
            t = window.performance.timing.loadEventEnd;
          } catch (Tv) {}
          return t > 0;
        }
        return wi.readyState === rt;
      })() &&
        !X.pfSent &&
        F(Xp, 0),
      Ho.on($, function () {
        var t = 0;
        if (_i.pfDelay && f(_i.pfDelay)) {
          var e = Yp();
          i(_i.pfDelay, function (n, r) {
            (!e || null == e[r]) && d(n) && n > t && (t = n);
          });
        }
        X.pageLoadEvent &&
          !X.pageLoadEvent.hasChildType(_t) &&
          _i.pageLoadDelay > t &&
          (t = _i.pageLoadDelay),
          F(Xp, t);
      }).on(ji(), Qp)
    );
  }
  var tv = "rage_click",
    ev = 3,
    nv = 300,
    rv = 0,
    iv = 0;
  function av(t) {
    if ((U() - iv > nv && (rv = 0), rv++, (iv = U()), rv === ev))
      try {
        ps({ name: tv, context: { path: Cc(t.target || t.srcElement) } });
      } catch (Tv) {}
  }
  var ov = 0,
    cv = [],
    sv = 0,
    uv = [],
    fv = 0;
  function dv(t) {
    if (t)
      return { top: t.top, left: t.left, width: t.width, height: t.height };
  }
  function lv() {
    try {
      if (!_i.webVitalsCLSEnabled) return;
      var t = function (t) {
          try {
            if (t.hadRecentInput) return;
            var e = uv[0],
              n = uv[uv.length - 1];
            sv &&
            t.startTime - n.startTime < 1e3 &&
            t.startTime - e.startTime < 5e3
              ? ((sv += t.value), uv.push(t))
              : ((sv = t.value), (uv = [t])),
              sv > ov && ((ov = sv), (cv = uv));
          } catch (Tv) {}
        },
        e = Hs("layout-shift", t).po;
      e &&
        (ks(function () {
          try {
            i(e.takeRecords(), function (e) {
              t(e);
            }),
              (function () {
                if (!(ov <= fv)) {
                  var t = [];
                  i(cv, function (e) {
                    var n = [];
                    i(e.sources, function (t) {
                      var e = {
                          currentRect: dv(t.currentRect),
                          previousRect: dv(t.previousRect),
                        },
                        r = t.node;
                      if (r) {
                        var i,
                          a = r.nodeType,
                          o = r;
                        1 !== a && (o = r.parentNode),
                          (o && 1 === o.nodeType) || (o = null),
                          (i = Cc(o)) && (e.node = { path: i, type: a });
                      }
                      n.push(e);
                    });
                    var r = { value: e.value };
                    n.length > 0 && (r.sources = n),
                      t.push(
                        ep(
                          { entryType: e.entryType, startTime: e.startTime },
                          r
                        )
                      );
                  });
                  var e = ip(sr, ov, r({}, $h, { entries: t }));
                  e && tp([e]), (fv = ov);
                }
              })();
          } catch (Tv) {}
        }),
        xs(function () {
          (ov = 0), (cv = []), (sv = 0), (uv = []), (fv = 0);
        }));
    } catch (Tv) {}
  }
  function hv() {
    if (Ri()) {
      try {
        fu(),
          (js = Hs(Tn, Bs).po) &&
            (i(["keydown", "click"], function (t) {
              L(document, t, Us, { once: !0, capture: !0 });
            }),
            ks(Us, !0));
      } catch (Tv) {}
      if (_i.webVitalsEnabled)
        try {
          !(function () {
            try {
              if (!_i.webVitalsFIDEnabled) return;
              var t = z(function (t) {
                  try {
                    if (t.startTime < Rs()) {
                      var e = t.processingStart - t.startTime,
                        n = ep(
                          {
                            entryType: t.entryType,
                            name: t.name,
                            duration: t.duration,
                            startTime: t.startTime,
                          },
                          {
                            processingStart: t.processingStart,
                            processingEnd: t.processingEnd,
                          }
                        ),
                        i = ip(cr, e, r({}, $h, { entry: n }));
                      i && tp([i]);
                    }
                  } catch (Tv) {}
                }),
                e = Ys(Rr)[0];
              if (e) t(e);
              else {
                var n = Hs(Rr, t).po;
                n &&
                  ks(function () {
                    try {
                      i(n.takeRecords(), function (e) {
                        t(e);
                      }),
                        n.disconnect();
                    } catch (Tv) {}
                  }, !0);
              }
            } catch (Tv) {}
          })(),
            lv(),
            Up();
        } catch (Tv) {}
    }
  }
  var pv = "tyAppData";
  function vv(t, e) {
    t &&
      (null != t.deviceId && Ca(t.deviceId),
      null != t.userId && Oa(t.userId, { noDispatch: !0 }),
      vi(t.context),
      (X.nbsJsBridgeData = t),
      e && nc());
  }
  function mv() {
    Pi()
      ? (xa = function (t) {
          window.webkit.messageHandlers.nbsBrowserAgent.postMessage(t);
        })
      : Li() &&
        (xa = function (t) {
          nbsJsBridge.postMessage(t);
        }),
      (function () {
        try {
          if ("undefined" == typeof nbsJsBridge) return;
          var t = nbsJsBridge.context;
          t && vv(t, !1),
            L(window, pv, function (t) {
              try {
                vv(oa(t && t.detail), !0);
              } catch (t) {}
            }),
            _a(Zn);
        } catch (Tv) {}
      })();
  }
  function yv() {
    var t;
    pi(),
      mv(),
      (function () {
        if (!X.did) {
          var t = ya(Ne);
          t || ((t = J()), ga(Ne, t)), (X.did = t);
        }
        if (!X.uid) {
          var e = ya(Oe);
          e && ((e = e.substring(0, Sa)), (X.uid = e));
        }
      })(),
      nc(),
      _i.bcEnabled && (wc = new Lc({ maxSize: _i.bcMaxCacheSize })),
      $p(),
      (Mi = new Gi()),
      Ad(),
      Zp(),
      Hh(),
      Gh(),
      _i.routerEnable &&
        (_i.routerMode === ir && window.history
          ? Mf()
          : _i.routerMode === ar
          ? qf()
          : window.history
          ? Mf()
          : qf()),
      (function () {
        if ((_i.bcEnabled && _i.bcDomEnabled && Ud(), Ri()))
          try {
            Pc(), Hd();
          } catch (Tv) {}
      })(),
      vd(),
      _i.monitorRage && qd(av),
      hv(),
      _i.bcConsoleEnabled && window.console && Fh(),
      (aa._end = U()),
      Es(function () {
        ws._end = aa._end;
      }),
      (t = _i.sendInterval),
      _i.sendInterval < pr && (t = pr),
      setInterval(function () {
        Xo({ tr: zo });
      }, t),
      Ho.on(ji(), function () {
        Xo({ tr: Fo });
      });
  }
  function gv(t) {
    var e = {};
    if (p(t)) {
      var n = {};
      t(n), (e = n);
    } else e = { server: t };
    var r = e.server;
    if (r) {
      window[bt] || (window[bt] = { hook: {} });
      var a = _o(r),
        o = a.config,
        c = a.configKey,
        s = a.storedConfig;
      if (a.valid) {
        var u = !Ba();
        u &&
          (i(o.plugins, function (t) {
            Nf(t);
          }),
          yv(),
          (window[ot].inited = !0),
          Ba() &&
            i(Of, function (t) {
              If(Yr, t);
            })),
          Ba() &&
            (di({ type: dn, name: pn, args: { firstInit: u, config: r } }),
            gd(c, s));
      }
    }
  }
  var bv = !0;
  function wv(t) {
    bv = t;
  }
  function Ev(t) {
    try {
      if (!bv || !t || (!p(t) && !f(t))) return;
      gv(t);
    } catch (Tv) {}
  }
  return (function () {
    if (window[ot] && 3 === window[ot].mainVersion) return window[ot];
    try {
      wv(
        (function () {
          try {
            var t = /MSIE (\d+).\d+/.exec(ki());
            if (t && t[1]) {
              var e = parseInt(t[1]);
              (Ci = e <= 7), (Ai = e <= 9);
            }
          } catch (Tv) {
            try {
              (Ci = /(MSIE [0-7].\d+)/.test(ki())),
                (Ai = /(MSIE [0-9].\d+)/.test(ki()));
            } catch (Tv) {
              return !1;
            }
          }
          return !0;
        })()
      );
    } catch (Tv) {
      wv(!1);
    }
    Uf("init", Ev), (window[ot] = Bf);
    try {
      Vf();
    } catch (Tv) {}
    return Bf;
  })();
})();

/*!VERSION=0.2.0,PLUGIN_NAME=TingyunPluginEnc*/
var TingyunPluginEnc = (function () {
  var t, i;
  function r() {
    return t.bridge.getAgentConfig();
  }
  function e() {
    return t.util;
  }
  !(function (t) {
    (t[(t.GM = 0)] = "GM"), (t[(t.LIGHT = 1)] = "LIGHT");
  })(i || (i = {}));
  var n,
    o =
      "undefined" == typeof window
        ? { navigator: { appName: "Netscape" } }
        : window;
  function s(t, i, r) {
    null != t &&
      ("number" == typeof t
        ? this.fromNumber(t, i, r)
        : null == i && "string" != typeof t
        ? this.fromString(t, 256)
        : this.fromString(t, i));
  }
  function h() {
    return new s(null);
  }
  "Microsoft Internet Explorer" == o.navigator.appName
    ? ((s.prototype.am = function (t, i, r, e, n, o) {
        for (var s = 32767 & i, h = i >> 15; --o >= 0; ) {
          var u = 32767 & this[t],
            f = this[t++] >> 15,
            a = h * u + f * s;
          (n =
            ((u = s * u + ((32767 & a) << 15) + r[e] + (1073741823 & n)) >>>
              30) +
            (a >>> 15) +
            h * f +
            (n >>> 30)),
            (r[e++] = 1073741823 & u);
        }
        return n;
      }),
      (n = 30))
    : "Netscape" != o.navigator.appName
    ? ((s.prototype.am = function (t, i, r, e, n, o) {
        for (; --o >= 0; ) {
          var s = i * this[t++] + r[e] + n;
          (n = Math.floor(s / 67108864)), (r[e++] = 67108863 & s);
        }
        return n;
      }),
      (n = 26))
    : ((s.prototype.am = function (t, i, r, e, n, o) {
        for (var s = 16383 & i, h = i >> 14; --o >= 0; ) {
          var u = 16383 & this[t],
            f = this[t++] >> 14,
            a = h * u + f * s;
          (n =
            ((u = s * u + ((16383 & a) << 14) + r[e] + n) >> 28) +
            (a >> 14) +
            h * f),
            (r[e++] = 268435455 & u);
        }
        return n;
      }),
      (n = 28)),
    (s.prototype.DB = n),
    (s.prototype.DM = (1 << n) - 1),
    (s.prototype.DV = 1 << n),
    (s.prototype.FV = Math.pow(2, 52)),
    (s.prototype.F1 = 52 - n),
    (s.prototype.F2 = 2 * n - 52);
  var u,
    f,
    a = new Array();
  for (u = "0".charCodeAt(0), f = 0; f <= 9; ++f) a[u++] = f;
  for (u = "a".charCodeAt(0), f = 10; f < 36; ++f) a[u++] = f;
  for (u = "A".charCodeAt(0), f = 10; f < 36; ++f) a[u++] = f;
  function l(t) {
    return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(t);
  }
  function c(t, i) {
    var r = a[t.charCodeAt(i)];
    return null == r ? -1 : r;
  }
  function p(t) {
    var i = h();
    return i.fromInt(t), i;
  }
  function g(t) {
    var i,
      r = 1;
    return (
      0 != (i = t >>> 16) && ((t = i), (r += 16)),
      0 != (i = t >> 8) && ((t = i), (r += 8)),
      0 != (i = t >> 4) && ((t = i), (r += 4)),
      0 != (i = t >> 2) && ((t = i), (r += 2)),
      0 != (i = t >> 1) && ((t = i), (r += 1)),
      r
    );
  }
  function y(t) {
    this.m = t;
  }
  function v(t) {
    (this.m = t),
      (this.mp = t.invDigit()),
      (this.mpl = 32767 & this.mp),
      (this.mph = this.mp >> 15),
      (this.um = (1 << (t.DB - 15)) - 1),
      (this.mt2 = 2 * t.t);
  }
  function m(t, i) {
    return t & i;
  }
  function d(t, i) {
    return t | i;
  }
  function B(t, i) {
    return t ^ i;
  }
  function T(t, i) {
    return t & ~i;
  }
  function w(t) {
    if (0 == t) return -1;
    var i = 0;
    return (
      0 == (65535 & t) && ((t >>= 16), (i += 16)),
      0 == (255 & t) && ((t >>= 8), (i += 8)),
      0 == (15 & t) && ((t >>= 4), (i += 4)),
      0 == (3 & t) && ((t >>= 2), (i += 2)),
      0 == (1 & t) && ++i,
      i
    );
  }
  function F(t) {
    for (var i = 0; 0 != t; ) (t &= t - 1), ++i;
    return i;
  }
  function b() {}
  function I(t) {
    return t;
  }
  function E(t) {
    (this.r2 = h()),
      (this.q3 = h()),
      s.ONE.dlShiftTo(2 * t.t, this.r2),
      (this.mu = this.r2.divide(t)),
      (this.m = t);
  }
  (y.prototype.convert = function (t) {
    return t.s < 0 || t.compareTo(this.m) >= 0 ? t.mod(this.m) : t;
  }),
    (y.prototype.revert = function (t) {
      return t;
    }),
    (y.prototype.reduce = function (t) {
      t.divRemTo(this.m, null, t);
    }),
    (y.prototype.mulTo = function (t, i, r) {
      t.multiplyTo(i, r), this.reduce(r);
    }),
    (y.prototype.sqrTo = function (t, i) {
      t.squareTo(i), this.reduce(i);
    }),
    (v.prototype.convert = function (t) {
      var i = h();
      return (
        t.abs().dlShiftTo(this.m.t, i),
        i.divRemTo(this.m, null, i),
        t.s < 0 && i.compareTo(s.ZERO) > 0 && this.m.subTo(i, i),
        i
      );
    }),
    (v.prototype.revert = function (t) {
      var i = h();
      return t.copyTo(i), this.reduce(i), i;
    }),
    (v.prototype.reduce = function (t) {
      for (; t.t <= this.mt2; ) t[t.t++] = 0;
      for (var i = 0; i < this.m.t; ++i) {
        var r = 32767 & t[i],
          e =
            (r * this.mpl +
              (((r * this.mph + (t[i] >> 15) * this.mpl) & this.um) << 15)) &
            t.DM;
        for (
          t[(r = i + this.m.t)] += this.m.am(0, e, t, i, 0, this.m.t);
          t[r] >= t.DV;

        )
          (t[r] -= t.DV), t[++r]++;
      }
      t.clamp(),
        t.drShiftTo(this.m.t, t),
        t.compareTo(this.m) >= 0 && t.subTo(this.m, t);
    }),
    (v.prototype.mulTo = function (t, i, r) {
      t.multiplyTo(i, r), this.reduce(r);
    }),
    (v.prototype.sqrTo = function (t, i) {
      t.squareTo(i), this.reduce(i);
    }),
    (s.prototype.copyTo = function (t) {
      for (var i = this.t - 1; i >= 0; --i) t[i] = this[i];
      (t.t = this.t), (t.s = this.s);
    }),
    (s.prototype.fromInt = function (t) {
      (this.t = 1),
        (this.s = t < 0 ? -1 : 0),
        t > 0 ? (this[0] = t) : t < -1 ? (this[0] = t + this.DV) : (this.t = 0);
    }),
    (s.prototype.fromString = function (t, i) {
      var r;
      if (16 == i) r = 4;
      else if (8 == i) r = 3;
      else if (256 == i) r = 8;
      else if (2 == i) r = 1;
      else if (32 == i) r = 5;
      else {
        if (4 != i) return void this.fromRadix(t, i);
        r = 2;
      }
      (this.t = 0), (this.s = 0);
      for (var e = t.length, n = !1, o = 0; --e >= 0; ) {
        var h = 8 == r ? 255 & t[e] : c(t, e);
        h < 0
          ? "-" == t.charAt(e) && (n = !0)
          : ((n = !1),
            0 == o
              ? (this[this.t++] = h)
              : o + r > this.DB
              ? ((this[this.t - 1] |= (h & ((1 << (this.DB - o)) - 1)) << o),
                (this[this.t++] = h >> (this.DB - o)))
              : (this[this.t - 1] |= h << o),
            (o += r) >= this.DB && (o -= this.DB));
      }
      8 == r &&
        0 != (128 & t[0]) &&
        ((this.s = -1),
        o > 0 && (this[this.t - 1] |= ((1 << (this.DB - o)) - 1) << o)),
        this.clamp(),
        n && s.ZERO.subTo(this, this);
    }),
    (s.prototype.clamp = function () {
      for (var t = this.s & this.DM; this.t > 0 && this[this.t - 1] == t; )
        --this.t;
    }),
    (s.prototype.dlShiftTo = function (t, i) {
      var r;
      for (r = this.t - 1; r >= 0; --r) i[r + t] = this[r];
      for (r = t - 1; r >= 0; --r) i[r] = 0;
      (i.t = this.t + t), (i.s = this.s);
    }),
    (s.prototype.drShiftTo = function (t, i) {
      for (var r = t; r < this.t; ++r) i[r - t] = this[r];
      (i.t = Math.max(this.t - t, 0)), (i.s = this.s);
    }),
    (s.prototype.lShiftTo = function (t, i) {
      var r,
        e = t % this.DB,
        n = this.DB - e,
        o = (1 << n) - 1,
        s = Math.floor(t / this.DB),
        h = (this.s << e) & this.DM;
      for (r = this.t - 1; r >= 0; --r)
        (i[r + s + 1] = (this[r] >> n) | h), (h = (this[r] & o) << e);
      for (r = s - 1; r >= 0; --r) i[r] = 0;
      (i[s] = h), (i.t = this.t + s + 1), (i.s = this.s), i.clamp();
    }),
    (s.prototype.rShiftTo = function (t, i) {
      i.s = this.s;
      var r = Math.floor(t / this.DB);
      if (r >= this.t) i.t = 0;
      else {
        var e = t % this.DB,
          n = this.DB - e,
          o = (1 << e) - 1;
        i[0] = this[r] >> e;
        for (var s = r + 1; s < this.t; ++s)
          (i[s - r - 1] |= (this[s] & o) << n), (i[s - r] = this[s] >> e);
        e > 0 && (i[this.t - r - 1] |= (this.s & o) << n),
          (i.t = this.t - r),
          i.clamp();
      }
    }),
    (s.prototype.subTo = function (t, i) {
      for (var r = 0, e = 0, n = Math.min(t.t, this.t); r < n; )
        (e += this[r] - t[r]), (i[r++] = e & this.DM), (e >>= this.DB);
      if (t.t < this.t) {
        for (e -= t.s; r < this.t; )
          (e += this[r]), (i[r++] = e & this.DM), (e >>= this.DB);
        e += this.s;
      } else {
        for (e += this.s; r < t.t; )
          (e -= t[r]), (i[r++] = e & this.DM), (e >>= this.DB);
        e -= t.s;
      }
      (i.s = e < 0 ? -1 : 0),
        e < -1 ? (i[r++] = this.DV + e) : e > 0 && (i[r++] = e),
        (i.t = r),
        i.clamp();
    }),
    (s.prototype.multiplyTo = function (t, i) {
      var r = this.abs(),
        e = t.abs(),
        n = r.t;
      for (i.t = n + e.t; --n >= 0; ) i[n] = 0;
      for (n = 0; n < e.t; ++n) i[n + r.t] = r.am(0, e[n], i, n, 0, r.t);
      (i.s = 0), i.clamp(), this.s != t.s && s.ZERO.subTo(i, i);
    }),
    (s.prototype.squareTo = function (t) {
      for (var i = this.abs(), r = (t.t = 2 * i.t); --r >= 0; ) t[r] = 0;
      for (r = 0; r < i.t - 1; ++r) {
        var e = i.am(r, i[r], t, 2 * r, 0, 1);
        (t[r + i.t] += i.am(r + 1, 2 * i[r], t, 2 * r + 1, e, i.t - r - 1)) >=
          i.DV && ((t[r + i.t] -= i.DV), (t[r + i.t + 1] = 1));
      }
      t.t > 0 && (t[t.t - 1] += i.am(r, i[r], t, 2 * r, 0, 1)),
        (t.s = 0),
        t.clamp();
    }),
    (s.prototype.divRemTo = function (t, i, r) {
      var e = t.abs();
      if (!(e.t <= 0)) {
        var n = this.abs();
        if (n.t < e.t)
          return null != i && i.fromInt(0), void (null != r && this.copyTo(r));
        null == r && (r = h());
        var o = h(),
          u = this.s,
          f = t.s,
          a = this.DB - g(e[e.t - 1]);
        a > 0
          ? (e.lShiftTo(a, o), n.lShiftTo(a, r))
          : (e.copyTo(o), n.copyTo(r));
        var l = o.t,
          c = o[l - 1];
        if (0 != c) {
          var p = c * (1 << this.F1) + (l > 1 ? o[l - 2] >> this.F2 : 0),
            y = this.FV / p,
            v = (1 << this.F1) / p,
            m = 1 << this.F2,
            d = r.t,
            B = d - l,
            T = null == i ? h() : i;
          for (
            o.dlShiftTo(B, T),
              r.compareTo(T) >= 0 && ((r[r.t++] = 1), r.subTo(T, r)),
              s.ONE.dlShiftTo(l, T),
              T.subTo(o, o);
            o.t < l;

          )
            o[o.t++] = 0;
          for (; --B >= 0; ) {
            var w =
              r[--d] == c ? this.DM : Math.floor(r[d] * y + (r[d - 1] + m) * v);
            if ((r[d] += o.am(0, w, r, B, 0, l)) < w)
              for (o.dlShiftTo(B, T), r.subTo(T, r); r[d] < --w; )
                r.subTo(T, r);
          }
          null != i && (r.drShiftTo(l, i), u != f && s.ZERO.subTo(i, i)),
            (r.t = l),
            r.clamp(),
            a > 0 && r.rShiftTo(a, r),
            u < 0 && s.ZERO.subTo(r, r);
        }
      }
    }),
    (s.prototype.invDigit = function () {
      if (this.t < 1) return 0;
      var t = this[0];
      if (0 == (1 & t)) return 0;
      var i = 3 & t;
      return (i =
        ((i =
          ((i =
            ((i = (i * (2 - (15 & t) * i)) & 15) * (2 - (255 & t) * i)) & 255) *
            (2 - (((65535 & t) * i) & 65535))) &
          65535) *
          (2 - ((t * i) % this.DV))) %
        this.DV) > 0
        ? this.DV - i
        : -i;
    }),
    (s.prototype.isEven = function () {
      return 0 == (this.t > 0 ? 1 & this[0] : this.s);
    }),
    (s.prototype.exp = function (t, i) {
      if (t > 4294967295 || t < 1) return s.ONE;
      var r = h(),
        e = h(),
        n = i.convert(this),
        o = g(t) - 1;
      for (n.copyTo(r); --o >= 0; )
        if ((i.sqrTo(r, e), (t & (1 << o)) > 0)) i.mulTo(e, n, r);
        else {
          var u = r;
          (r = e), (e = u);
        }
      return i.revert(r);
    }),
    (s.prototype.toString = function (t) {
      if (this.s < 0) return "-" + this.negate().toString(t);
      var i;
      if (16 == t) i = 4;
      else if (8 == t) i = 3;
      else if (2 == t) i = 1;
      else if (32 == t) i = 5;
      else {
        if (4 != t) return this.toRadix(t);
        i = 2;
      }
      var r,
        e = (1 << i) - 1,
        n = !1,
        o = "",
        s = this.t,
        h = this.DB - ((s * this.DB) % i);
      if (s-- > 0)
        for (
          h < this.DB && (r = this[s] >> h) > 0 && ((n = !0), (o = l(r)));
          s >= 0;

        )
          h < i
            ? ((r = (this[s] & ((1 << h) - 1)) << (i - h)),
              (r |= this[--s] >> (h += this.DB - i)))
            : ((r = (this[s] >> (h -= i)) & e),
              h <= 0 && ((h += this.DB), --s)),
            r > 0 && (n = !0),
            n && (o += l(r));
      return n ? o : "0";
    }),
    (s.prototype.negate = function () {
      var t = h();
      return s.ZERO.subTo(this, t), t;
    }),
    (s.prototype.abs = function () {
      return this.s < 0 ? this.negate() : this;
    }),
    (s.prototype.compareTo = function (t) {
      var i = this.s - t.s;
      if (0 != i) return i;
      var r = this.t;
      if (0 != (i = r - t.t)) return this.s < 0 ? -i : i;
      for (; --r >= 0; ) if (0 != (i = this[r] - t[r])) return i;
      return 0;
    }),
    (s.prototype.bitLength = function () {
      return this.t <= 0
        ? 0
        : this.DB * (this.t - 1) + g(this[this.t - 1] ^ (this.s & this.DM));
    }),
    (s.prototype.mod = function (t) {
      var i = h();
      return (
        this.abs().divRemTo(t, null, i),
        this.s < 0 && i.compareTo(s.ZERO) > 0 && t.subTo(i, i),
        i
      );
    }),
    (s.prototype.modPowInt = function (t, i) {
      var r;
      return (r = t < 256 || i.isEven() ? new y(i) : new v(i)), this.exp(t, r);
    }),
    (s.ZERO = p(0)),
    (s.ONE = p(1)),
    (b.prototype.convert = I),
    (b.prototype.revert = I),
    (b.prototype.mulTo = function (t, i, r) {
      t.multiplyTo(i, r);
    }),
    (b.prototype.sqrTo = function (t, i) {
      t.squareTo(i);
    }),
    (E.prototype.convert = function (t) {
      if (t.s < 0 || t.t > 2 * this.m.t) return t.mod(this.m);
      if (t.compareTo(this.m) < 0) return t;
      var i = h();
      return t.copyTo(i), this.reduce(i), i;
    }),
    (E.prototype.revert = function (t) {
      return t;
    }),
    (E.prototype.reduce = function (t) {
      for (
        t.drShiftTo(this.m.t - 1, this.r2),
          t.t > this.m.t + 1 && ((t.t = this.m.t + 1), t.clamp()),
          this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3),
          this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
        t.compareTo(this.r2) < 0;

      )
        t.dAddOffset(1, this.m.t + 1);
      for (t.subTo(this.r2, t); t.compareTo(this.m) >= 0; ) t.subTo(this.m, t);
    }),
    (E.prototype.mulTo = function (t, i, r) {
      t.multiplyTo(i, r), this.reduce(r);
    }),
    (E.prototype.sqrTo = function (t, i) {
      t.squareTo(i), this.reduce(i);
    });
  var D,
    A,
    q,
    S = [
      2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67,
      71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149,
      151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229,
      233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313,
      317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409,
      419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499,
      503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601,
      607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691,
      701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809,
      811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907,
      911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997,
    ],
    L = (1 << 26) / S[S.length - 1];
  function x(t, i) {
    (this.x = i), (this.q = t);
  }
  function O(t, i, r, e) {
    (this.curve = t),
      (this.x = i),
      (this.y = r),
      (this.z = null == e ? s.ONE : e),
      (this.zinv = null);
  }
  function M(t, i, r) {
    (this.q = t),
      (this.a = this.fromBigInteger(i)),
      (this.b = this.fromBigInteger(r)),
      (this.infinity = new O(this, null, null));
  }
  function C() {
    (this.i = 0), (this.j = 0), (this.S = new Array());
  }
  function _() {
    var t;
    (t = new Date().getTime()),
      (A[q++] ^= 255 & t),
      (A[q++] ^= (t >> 8) & 255),
      (A[q++] ^= (t >> 16) & 255),
      (A[q++] ^= (t >> 24) & 255),
      q >= 256 && (q -= 256);
  }
  if (
    ((s.prototype.chunkSize = function (t) {
      return Math.floor((Math.LN2 * this.DB) / Math.log(t));
    }),
    (s.prototype.toRadix = function (t) {
      if ((null == t && (t = 10), 0 == this.signum() || t < 2 || t > 36))
        return "0";
      var i = this.chunkSize(t),
        r = Math.pow(t, i),
        e = p(r),
        n = h(),
        o = h(),
        s = "";
      for (this.divRemTo(e, n, o); n.signum() > 0; )
        (s = (r + o.intValue()).toString(t).substr(1) + s), n.divRemTo(e, n, o);
      return o.intValue().toString(t) + s;
    }),
    (s.prototype.fromRadix = function (t, i) {
      this.fromInt(0), null == i && (i = 10);
      for (
        var r = this.chunkSize(i),
          e = Math.pow(i, r),
          n = !1,
          o = 0,
          h = 0,
          u = 0;
        u < t.length;
        ++u
      ) {
        var f = c(t, u);
        f < 0
          ? "-" == t.charAt(u) && 0 == this.signum() && (n = !0)
          : ((h = i * h + f),
            ++o >= r &&
              (this.dMultiply(e), this.dAddOffset(h, 0), (o = 0), (h = 0)));
      }
      o > 0 && (this.dMultiply(Math.pow(i, o)), this.dAddOffset(h, 0)),
        n && s.ZERO.subTo(this, this);
    }),
    (s.prototype.fromNumber = function (t, i, r) {
      if ("number" == typeof i)
        if (t < 2) this.fromInt(1);
        else
          for (
            this.fromNumber(t, r),
              this.testBit(t - 1) ||
                this.bitwiseTo(s.ONE.shiftLeft(t - 1), d, this),
              this.isEven() && this.dAddOffset(1, 0);
            !this.isProbablePrime(i);

          )
            this.dAddOffset(2, 0),
              this.bitLength() > t && this.subTo(s.ONE.shiftLeft(t - 1), this);
      else {
        var e = new Array(),
          n = 7 & t;
        (e.length = 1 + (t >> 3)),
          i.nextBytes(e),
          n > 0 ? (e[0] &= (1 << n) - 1) : (e[0] = 0),
          this.fromString(e, 256);
      }
    }),
    (s.prototype.bitwiseTo = function (t, i, r) {
      var e,
        n,
        o = Math.min(t.t, this.t);
      for (e = 0; e < o; ++e) r[e] = i(this[e], t[e]);
      if (t.t < this.t) {
        for (n = t.s & this.DM, e = o; e < this.t; ++e) r[e] = i(this[e], n);
        r.t = this.t;
      } else {
        for (n = this.s & this.DM, e = o; e < t.t; ++e) r[e] = i(n, t[e]);
        r.t = t.t;
      }
      (r.s = i(this.s, t.s)), r.clamp();
    }),
    (s.prototype.changeBit = function (t, i) {
      var r = s.ONE.shiftLeft(t);
      return this.bitwiseTo(r, i, r), r;
    }),
    (s.prototype.addTo = function (t, i) {
      for (var r = 0, e = 0, n = Math.min(t.t, this.t); r < n; )
        (e += this[r] + t[r]), (i[r++] = e & this.DM), (e >>= this.DB);
      if (t.t < this.t) {
        for (e += t.s; r < this.t; )
          (e += this[r]), (i[r++] = e & this.DM), (e >>= this.DB);
        e += this.s;
      } else {
        for (e += this.s; r < t.t; )
          (e += t[r]), (i[r++] = e & this.DM), (e >>= this.DB);
        e += t.s;
      }
      (i.s = e < 0 ? -1 : 0),
        e > 0 ? (i[r++] = e) : e < -1 && (i[r++] = this.DV + e),
        (i.t = r),
        i.clamp();
    }),
    (s.prototype.dMultiply = function (t) {
      (this[this.t] = this.am(0, t - 1, this, 0, 0, this.t)),
        ++this.t,
        this.clamp();
    }),
    (s.prototype.dAddOffset = function (t, i) {
      if (0 != t) {
        for (; this.t <= i; ) this[this.t++] = 0;
        for (this[i] += t; this[i] >= this.DV; )
          (this[i] -= this.DV),
            ++i >= this.t && (this[this.t++] = 0),
            ++this[i];
      }
    }),
    (s.prototype.multiplyLowerTo = function (t, i, r) {
      var e,
        n = Math.min(this.t + t.t, i);
      for (r.s = 0, r.t = n; n > 0; ) r[--n] = 0;
      for (e = r.t - this.t; n < e; ++n)
        r[n + this.t] = this.am(0, t[n], r, n, 0, this.t);
      for (e = Math.min(t.t, i); n < e; ++n) this.am(0, t[n], r, n, 0, i - n);
      r.clamp();
    }),
    (s.prototype.multiplyUpperTo = function (t, i, r) {
      --i;
      var e = (r.t = this.t + t.t - i);
      for (r.s = 0; --e >= 0; ) r[e] = 0;
      for (e = Math.max(i - this.t, 0); e < t.t; ++e)
        r[this.t + e - i] = this.am(i - e, t[e], r, 0, 0, this.t + e - i);
      r.clamp(), r.drShiftTo(1, r);
    }),
    (s.prototype.modInt = function (t) {
      if (t <= 0) return 0;
      var i = this.DV % t,
        r = this.s < 0 ? t - 1 : 0;
      if (this.t > 0)
        if (0 == i) r = this[0] % t;
        else for (var e = this.t - 1; e >= 0; --e) r = (i * r + this[e]) % t;
      return r;
    }),
    (s.prototype.millerRabin = function (t) {
      var i = this.subtract(s.ONE),
        r = i.getLowestSetBit();
      if (r <= 0) return !1;
      var e = i.shiftRight(r);
      (t = (t + 1) >> 1) > S.length && (t = S.length);
      for (var n = h(), o = 0; o < t; ++o) {
        n.fromInt(S[Math.floor(Math.random() * S.length)]);
        var u = n.modPow(e, this);
        if (0 != u.compareTo(s.ONE) && 0 != u.compareTo(i)) {
          for (var f = 1; f++ < r && 0 != u.compareTo(i); )
            if (0 == (u = u.modPowInt(2, this)).compareTo(s.ONE)) return !1;
          if (0 != u.compareTo(i)) return !1;
        }
      }
      return !0;
    }),
    (s.prototype.clone = function () {
      var t = h();
      return this.copyTo(t), t;
    }),
    (s.prototype.intValue = function () {
      if (this.s < 0) {
        if (1 == this.t) return this[0] - this.DV;
        if (0 == this.t) return -1;
      } else {
        if (1 == this.t) return this[0];
        if (0 == this.t) return 0;
      }
      return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0];
    }),
    (s.prototype.byteValue = function () {
      return 0 == this.t ? this.s : (this[0] << 24) >> 24;
    }),
    (s.prototype.shortValue = function () {
      return 0 == this.t ? this.s : (this[0] << 16) >> 16;
    }),
    (s.prototype.signum = function () {
      return this.s < 0
        ? -1
        : this.t <= 0 || (1 == this.t && this[0] <= 0)
        ? 0
        : 1;
    }),
    (s.prototype.toByteArray = function () {
      var t = this.t,
        i = new Array();
      i[0] = this.s;
      var r,
        e = this.DB - ((t * this.DB) % 8),
        n = 0;
      if (t-- > 0)
        for (
          e < this.DB &&
          (r = this[t] >> e) != (this.s & this.DM) >> e &&
          (i[n++] = r | (this.s << (this.DB - e)));
          t >= 0;

        )
          e < 8
            ? ((r = (this[t] & ((1 << e) - 1)) << (8 - e)),
              (r |= this[--t] >> (e += this.DB - 8)))
            : ((r = (this[t] >> (e -= 8)) & 255),
              e <= 0 && ((e += this.DB), --t)),
            0 != (128 & r) && (r |= -256),
            0 == n && (128 & this.s) != (128 & r) && ++n,
            (n > 0 || r != this.s) && (i[n++] = r);
      return i;
    }),
    (s.prototype.equals = function (t) {
      return 0 == this.compareTo(t);
    }),
    (s.prototype.min = function (t) {
      return this.compareTo(t) < 0 ? this : t;
    }),
    (s.prototype.max = function (t) {
      return this.compareTo(t) > 0 ? this : t;
    }),
    (s.prototype.and = function (t) {
      var i = h();
      return this.bitwiseTo(t, m, i), i;
    }),
    (s.prototype.or = function (t) {
      var i = h();
      return this.bitwiseTo(t, d, i), i;
    }),
    (s.prototype.xor = function (t) {
      var i = h();
      return this.bitwiseTo(t, B, i), i;
    }),
    (s.prototype.andNot = function (t) {
      var i = h();
      return this.bitwiseTo(t, T, i), i;
    }),
    (s.prototype.not = function () {
      for (var t = h(), i = 0; i < this.t; ++i) t[i] = this.DM & ~this[i];
      return (t.t = this.t), (t.s = ~this.s), t;
    }),
    (s.prototype.shiftLeft = function (t) {
      var i = h();
      return t < 0 ? this.rShiftTo(-t, i) : this.lShiftTo(t, i), i;
    }),
    (s.prototype.shiftRight = function (t) {
      var i = h();
      return t < 0 ? this.lShiftTo(-t, i) : this.rShiftTo(t, i), i;
    }),
    (s.prototype.getLowestSetBit = function () {
      for (var t = 0; t < this.t; ++t)
        if (0 != this[t]) return t * this.DB + w(this[t]);
      return this.s < 0 ? this.t * this.DB : -1;
    }),
    (s.prototype.bitCount = function () {
      for (var t = 0, i = this.s & this.DM, r = 0; r < this.t; ++r)
        t += F(this[r] ^ i);
      return t;
    }),
    (s.prototype.testBit = function (t) {
      var i = Math.floor(t / this.DB);
      return i >= this.t ? 0 != this.s : 0 != (this[i] & (1 << t % this.DB));
    }),
    (s.prototype.setBit = function (t) {
      return this.changeBit(t, d);
    }),
    (s.prototype.clearBit = function (t) {
      return this.changeBit(t, T);
    }),
    (s.prototype.flipBit = function (t) {
      return this.changeBit(t, B);
    }),
    (s.prototype.add = function (t) {
      var i = h();
      return this.addTo(t, i), i;
    }),
    (s.prototype.subtract = function (t) {
      var i = h();
      return this.subTo(t, i), i;
    }),
    (s.prototype.multiply = function (t) {
      var i = h();
      return this.multiplyTo(t, i), i;
    }),
    (s.prototype.divide = function (t) {
      var i = h();
      return this.divRemTo(t, i, null), i;
    }),
    (s.prototype.remainder = function (t) {
      var i = h();
      return this.divRemTo(t, null, i), i;
    }),
    (s.prototype.divideAndRemainder = function (t) {
      var i = h(),
        r = h();
      return this.divRemTo(t, i, r), new Array(i, r);
    }),
    (s.prototype.modPow = function (t, i) {
      var r,
        e,
        n = t.bitLength(),
        o = p(1);
      if (n <= 0) return o;
      (r = n < 18 ? 1 : n < 48 ? 3 : n < 144 ? 4 : n < 768 ? 5 : 6),
        (e = n < 8 ? new y(i) : i.isEven() ? new E(i) : new v(i));
      var s = new Array(),
        u = 3,
        f = r - 1,
        a = (1 << r) - 1;
      if (((s[1] = e.convert(this)), r > 1)) {
        var l = h();
        for (e.sqrTo(s[1], l); u <= a; )
          (s[u] = h()), e.mulTo(l, s[u - 2], s[u]), (u += 2);
      }
      var c,
        m,
        d = t.t - 1,
        B = !0,
        T = h();
      for (n = g(t[d]) - 1; d >= 0; ) {
        for (
          n >= f
            ? (c = (t[d] >> (n - f)) & a)
            : ((c = (t[d] & ((1 << (n + 1)) - 1)) << (f - n)),
              d > 0 && (c |= t[d - 1] >> (this.DB + n - f))),
            u = r;
          0 == (1 & c);

        )
          (c >>= 1), --u;
        if (((n -= u) < 0 && ((n += this.DB), --d), B))
          s[c].copyTo(o), (B = !1);
        else {
          for (; u > 1; ) e.sqrTo(o, T), e.sqrTo(T, o), (u -= 2);
          u > 0 ? e.sqrTo(o, T) : ((m = o), (o = T), (T = m)),
            e.mulTo(T, s[c], o);
        }
        for (; d >= 0 && 0 == (t[d] & (1 << n)); )
          e.sqrTo(o, T),
            (m = o),
            (o = T),
            (T = m),
            --n < 0 && ((n = this.DB - 1), --d);
      }
      return e.revert(o);
    }),
    (s.prototype.modInverse = function (t) {
      var i = t.isEven();
      if ((this.isEven() && i) || 0 == t.signum()) return s.ZERO;
      for (
        var r = t.clone(),
          e = this.clone(),
          n = p(1),
          o = p(0),
          h = p(0),
          u = p(1);
        0 != r.signum();

      ) {
        for (; r.isEven(); )
          r.rShiftTo(1, r),
            i
              ? ((n.isEven() && o.isEven()) ||
                  (n.addTo(this, n), o.subTo(t, o)),
                n.rShiftTo(1, n))
              : o.isEven() || o.subTo(t, o),
            o.rShiftTo(1, o);
        for (; e.isEven(); )
          e.rShiftTo(1, e),
            i
              ? ((h.isEven() && u.isEven()) ||
                  (h.addTo(this, h), u.subTo(t, u)),
                h.rShiftTo(1, h))
              : u.isEven() || u.subTo(t, u),
            u.rShiftTo(1, u);
        r.compareTo(e) >= 0
          ? (r.subTo(e, r), i && n.subTo(h, n), o.subTo(u, o))
          : (e.subTo(r, e), i && h.subTo(n, h), u.subTo(o, u));
      }
      return 0 != e.compareTo(s.ONE)
        ? s.ZERO
        : u.compareTo(t) >= 0
        ? u.subtract(t)
        : u.signum() < 0
        ? (u.addTo(t, u), u.signum() < 0 ? u.add(t) : u)
        : u;
    }),
    (s.prototype.pow = function (t) {
      return this.exp(t, new b());
    }),
    (s.prototype.gcd = function (t) {
      var i = this.s < 0 ? this.negate() : this.clone(),
        r = t.s < 0 ? t.negate() : t.clone();
      if (i.compareTo(r) < 0) {
        var e = i;
        (i = r), (r = e);
      }
      var n = i.getLowestSetBit(),
        o = r.getLowestSetBit();
      if (o < 0) return i;
      for (
        n < o && (o = n), o > 0 && (i.rShiftTo(o, i), r.rShiftTo(o, r));
        i.signum() > 0;

      )
        (n = i.getLowestSetBit()) > 0 && i.rShiftTo(n, i),
          (n = r.getLowestSetBit()) > 0 && r.rShiftTo(n, r),
          i.compareTo(r) >= 0
            ? (i.subTo(r, i), i.rShiftTo(1, i))
            : (r.subTo(i, r), r.rShiftTo(1, r));
      return o > 0 && r.lShiftTo(o, r), r;
    }),
    (s.prototype.isProbablePrime = function (t) {
      var i,
        r = this.abs();
      if (1 == r.t && r[0] <= S[S.length - 1]) {
        for (i = 0; i < S.length; ++i) if (r[0] == S[i]) return !0;
        return !1;
      }
      if (r.isEven()) return !1;
      for (i = 1; i < S.length; ) {
        for (var e = S[i], n = i + 1; n < S.length && e < L; ) e *= S[n++];
        for (e = r.modInt(e); i < n; ) if (e % S[i++] == 0) return !1;
      }
      return r.millerRabin(t);
    }),
    (s.prototype.square = function () {
      var t = h();
      return this.squareTo(t), t;
    }),
    (x.prototype.equals = function (t) {
      return t == this || (this.q.equals(t.q) && this.x.equals(t.x));
    }),
    (x.prototype.toBigInteger = function () {
      return this.x;
    }),
    (x.prototype.negate = function () {
      return new x(this.q, this.x.negate().mod(this.q));
    }),
    (x.prototype.add = function (t) {
      return new x(this.q, this.x.add(t.toBigInteger()).mod(this.q));
    }),
    (x.prototype.subtract = function (t) {
      return new x(this.q, this.x.subtract(t.toBigInteger()).mod(this.q));
    }),
    (x.prototype.multiply = function (t) {
      return new x(this.q, this.x.multiply(t.toBigInteger()).mod(this.q));
    }),
    (x.prototype.square = function () {
      return new x(this.q, this.x.square().mod(this.q));
    }),
    (x.prototype.divide = function (t) {
      return new x(
        this.q,
        this.x.multiply(t.toBigInteger().modInverse(this.q)).mod(this.q)
      );
    }),
    (x.prototype.getByteLength = function () {
      return Math.floor((this.toBigInteger().bitLength() + 7) / 8);
    }),
    (O.prototype.getX = function () {
      return (
        null == this.zinv && (this.zinv = this.z.modInverse(this.curve.q)),
        this.curve.fromBigInteger(
          this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q)
        )
      );
    }),
    (O.prototype.getY = function () {
      return (
        null == this.zinv && (this.zinv = this.z.modInverse(this.curve.q)),
        this.curve.fromBigInteger(
          this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q)
        )
      );
    }),
    (O.prototype.equals = function (t) {
      return (
        t == this ||
        (this.isInfinity()
          ? t.isInfinity()
          : t.isInfinity()
          ? this.isInfinity()
          : !!t.y
              .toBigInteger()
              .multiply(this.z)
              .subtract(this.y.toBigInteger().multiply(t.z))
              .mod(this.curve.q)
              .equals(s.ZERO) &&
            t.x
              .toBigInteger()
              .multiply(this.z)
              .subtract(this.x.toBigInteger().multiply(t.z))
              .mod(this.curve.q)
              .equals(s.ZERO))
      );
    }),
    (O.prototype.isInfinity = function () {
      return (
        (null == this.x && null == this.y) ||
        (this.z.equals(s.ZERO) && !this.y.toBigInteger().equals(s.ZERO))
      );
    }),
    (O.prototype.negate = function () {
      return new O(this.curve, this.x, this.y.negate(), this.z);
    }),
    (O.prototype.add = function (t) {
      if (this.isInfinity()) return t;
      if (t.isInfinity()) return this;
      var i = t.y
          .toBigInteger()
          .multiply(this.z)
          .subtract(this.y.toBigInteger().multiply(t.z))
          .mod(this.curve.q),
        r = t.x
          .toBigInteger()
          .multiply(this.z)
          .subtract(this.x.toBigInteger().multiply(t.z))
          .mod(this.curve.q);
      if (s.ZERO.equals(r))
        return s.ZERO.equals(i) ? this.twice() : this.curve.getInfinity();
      var e = new s("3"),
        n = this.x.toBigInteger(),
        o = this.y.toBigInteger(),
        h = (t.x.toBigInteger(), t.y.toBigInteger(), r.square()),
        u = h.multiply(r),
        f = n.multiply(h),
        a = i.square().multiply(this.z),
        l = a
          .subtract(f.shiftLeft(1))
          .multiply(t.z)
          .subtract(u)
          .multiply(r)
          .mod(this.curve.q),
        c = f
          .multiply(e)
          .multiply(i)
          .subtract(o.multiply(u))
          .subtract(a.multiply(i))
          .multiply(t.z)
          .add(i.multiply(u))
          .mod(this.curve.q),
        p = u.multiply(this.z).multiply(t.z).mod(this.curve.q);
      return new O(
        this.curve,
        this.curve.fromBigInteger(l),
        this.curve.fromBigInteger(c),
        p
      );
    }),
    (O.prototype.twice = function () {
      if (this.isInfinity()) return this;
      if (0 == this.y.toBigInteger().signum()) return this.curve.getInfinity();
      var t = new s("3"),
        i = this.x.toBigInteger(),
        r = this.y.toBigInteger(),
        e = r.multiply(this.z),
        n = e.multiply(r).mod(this.curve.q),
        o = this.curve.a.toBigInteger(),
        h = i.square().multiply(t);
      s.ZERO.equals(o) || (h = h.add(this.z.square().multiply(o)));
      var u = (h = h.mod(this.curve.q))
          .square()
          .subtract(i.shiftLeft(3).multiply(n))
          .shiftLeft(1)
          .multiply(e)
          .mod(this.curve.q),
        f = h
          .multiply(t)
          .multiply(i)
          .subtract(n.shiftLeft(1))
          .shiftLeft(2)
          .multiply(n)
          .subtract(h.square().multiply(h))
          .mod(this.curve.q),
        a = e.square().multiply(e).shiftLeft(3).mod(this.curve.q);
      return new O(
        this.curve,
        this.curve.fromBigInteger(u),
        this.curve.fromBigInteger(f),
        a
      );
    }),
    (O.prototype.multiply = function (t) {
      if (this.isInfinity()) return this;
      if (0 == t.signum()) return this.curve.getInfinity();
      var i,
        r = t,
        e = r.multiply(new s("3")),
        n = this.negate(),
        o = this;
      for (i = e.bitLength() - 2; i > 0; --i) {
        o = o.twice();
        var h = e.testBit(i);
        h != r.testBit(i) && (o = o.add(h ? this : n));
      }
      return o;
    }),
    (O.prototype.multiplyTwo = function (t, i, r) {
      var e;
      e = t.bitLength() > r.bitLength() ? t.bitLength() - 1 : r.bitLength() - 1;
      for (var n = this.curve.getInfinity(), o = this.add(i); e >= 0; )
        (n = n.twice()),
          t.testBit(e)
            ? (n = r.testBit(e) ? n.add(o) : n.add(this))
            : r.testBit(e) && (n = n.add(i)),
          --e;
      return n;
    }),
    (O.prototype.getEncoded = function (t) {
      var i = function (t, i) {
          var r = t.toByteArrayUnsigned();
          if (i < r.length) r = r.slice(r.length - i);
          else for (; i > r.length; ) r.unshift(0);
          return r;
        },
        r = this.getX().toBigInteger(),
        e = this.getY().toBigInteger(),
        n = i(r, 32);
      return (
        t
          ? e.isEven()
            ? n.unshift(2)
            : n.unshift(3)
          : (n.unshift(4), (n = n.concat(i(e, 32)))),
        n
      );
    }),
    (O.decodeFrom = function (t, i) {
      i[0];
      var r = i.length - 1,
        e = i.slice(1, 1 + r / 2),
        n = i.slice(1 + r / 2, 1 + r);
      e.unshift(0), n.unshift(0);
      var o = new s(e),
        h = new s(n);
      return new O(t, t.fromBigInteger(o), t.fromBigInteger(h));
    }),
    (O.decodeFromHex = function (t, i) {
      i.substr(0, 2);
      var r = i.length - 2,
        e = i.substr(2, r / 2),
        n = i.substr(2 + r / 2, r / 2),
        o = new s(e, 16),
        h = new s(n, 16);
      return new O(t, t.fromBigInteger(o), t.fromBigInteger(h));
    }),
    (O.prototype.add2D = function (t) {
      if (this.isInfinity()) return t;
      if (t.isInfinity()) return this;
      if (this.x.equals(t.x))
        return this.y.equals(t.y) ? this.twice() : this.curve.getInfinity();
      var i = t.x.subtract(this.x),
        r = t.y.subtract(this.y).divide(i),
        e = r.square().subtract(this.x).subtract(t.x),
        n = r.multiply(this.x.subtract(e)).subtract(this.y);
      return new O(this.curve, e, n);
    }),
    (O.prototype.twice2D = function () {
      if (this.isInfinity()) return this;
      if (0 == this.y.toBigInteger().signum()) return this.curve.getInfinity();
      var t = this.curve.fromBigInteger(s.valueOf(2)),
        i = this.curve.fromBigInteger(s.valueOf(3)),
        r = this.x
          .square()
          .multiply(i)
          .add(this.curve.a)
          .divide(this.y.multiply(t)),
        e = r.square().subtract(this.x.multiply(t)),
        n = r.multiply(this.x.subtract(e)).subtract(this.y);
      return new O(this.curve, e, n);
    }),
    (O.prototype.multiply2D = function (t) {
      if (this.isInfinity()) return this;
      if (0 == t.signum()) return this.curve.getInfinity();
      var i,
        r = t,
        e = r.multiply(new s("3")),
        n = this.negate(),
        o = this;
      for (i = e.bitLength() - 2; i > 0; --i) {
        o = o.twice();
        var h = e.testBit(i);
        h != r.testBit(i) && (o = o.add2D(h ? this : n));
      }
      return o;
    }),
    (O.prototype.isOnCurve = function () {
      var t = this.getX().toBigInteger(),
        i = this.getY().toBigInteger(),
        r = this.curve.getA().toBigInteger(),
        e = this.curve.getB().toBigInteger(),
        n = this.curve.getQ(),
        o = i.multiply(i).mod(n),
        s = t.multiply(t).multiply(t).add(r.multiply(t)).add(e).mod(n);
      return o.equals(s);
    }),
    (O.prototype.toString = function () {
      return (
        "(" +
        this.getX().toBigInteger().toString() +
        "," +
        this.getY().toBigInteger().toString() +
        ")"
      );
    }),
    (O.prototype.validate = function () {
      var t = this.curve.getQ();
      if (this.isInfinity()) throw new Error("Point is at infinity.");
      var i = this.getX().toBigInteger(),
        r = this.getY().toBigInteger();
      if (i.compareTo(s.ONE) < 0 || i.compareTo(t.subtract(s.ONE)) > 0)
        throw new Error("x coordinate out of bounds");
      if (r.compareTo(s.ONE) < 0 || r.compareTo(t.subtract(s.ONE)) > 0)
        throw new Error("y coordinate out of bounds");
      if (!this.isOnCurve()) throw new Error("Point is not on the curve.");
      if (this.multiply(t).isInfinity())
        throw new Error("Point is not a scalar multiple of G.");
      return !0;
    }),
    (M.prototype.getQ = function () {
      return this.q;
    }),
    (M.prototype.getA = function () {
      return this.a;
    }),
    (M.prototype.getB = function () {
      return this.b;
    }),
    (M.prototype.equals = function (t) {
      return (
        t == this ||
        (this.q.equals(t.q) && this.a.equals(t.a) && this.b.equals(t.b))
      );
    }),
    (M.prototype.getInfinity = function () {
      return this.infinity;
    }),
    (M.prototype.fromBigInteger = function (t) {
      return new x(this.q, t);
    }),
    (M.prototype.decodePointHex = function (t) {
      switch (parseInt(t.substr(0, 2), 16)) {
        case 0:
          return this.infinity;
        case 2:
        case 3:
        default:
          return null;
        case 4:
        case 6:
        case 7:
          var i = (t.length - 2) / 2,
            r = t.substr(2, i),
            e = t.substr(i + 2, i);
          return new O(
            this,
            this.fromBigInteger(new s(r, 16)),
            this.fromBigInteger(new s(e, 16))
          );
      }
    }),
    (C.prototype.init = function (t) {
      var i, r, e;
      for (i = 0; i < 256; ++i) this.S[i] = i;
      for (r = 0, i = 0; i < 256; ++i)
        (r = (r + this.S[i] + t[i % t.length]) & 255),
          (e = this.S[i]),
          (this.S[i] = this.S[r]),
          (this.S[r] = e);
      (this.i = 0), (this.j = 0);
    }),
    (C.prototype.next = function () {
      var t;
      return (
        (this.i = (this.i + 1) & 255),
        (this.j = (this.j + this.S[this.i]) & 255),
        (t = this.S[this.i]),
        (this.S[this.i] = this.S[this.j]),
        (this.S[this.j] = t),
        this.S[(t + this.S[this.i]) & 255]
      );
    }),
    null == A)
  ) {
    var R;
    for (A = new Array(), q = 0; q < 256; )
      (R = Math.floor(65536 * Math.random())),
        (A[q++] = R >>> 8),
        (A[q++] = 255 & R);
    (q = 0), _();
  }
  function N() {
    if (null == D) {
      for (_(), (D = new C()).init(A), q = 0; q < A.length; ++q) A[q] = 0;
      q = 0;
    }
    return D.next();
  }
  function k() {}
  function z(t, i, r, e, n) {
    var o;
    o =
      i + n > t.length && e + n <= r.length
        ? t.length - i
        : e + n > r.length && i + n <= t.length
        ? r.length - e
        : i + n <= t.length && e + n <= r.length
        ? n
        : r.length < t.length
        ? r.length - e
        : t.length - e;
    for (var s = 0; s < o; s++) r[s + e] = t[s + i];
  }
  function P(t) {
    return new Array((t >> 24) & 255, (t >> 16) & 255, (t >> 8) & 255, 255 & t);
  }
  function K(t) {
    for (var i = new Array(4 * t.length), r = 0; r < t.length; r++)
      z(P(t[r]), 0, i, 4 * r, 4);
    return i;
  }
  function Y(t, i) {
    return i + 3 < t.length
      ? (t[i] << 24) | (t[i + 1] << 16) | (t[i + 2] << 8) | t[i + 3]
      : i + 2 < t.length
      ? (t[i + 1] << 16) | (t[i + 2] << 8) | t[i + 3]
      : i + 1 < t.length
      ? (t[i] << 8) | t[i + 1]
      : t[i];
  }
  function V(t) {
    for (
      var i = Math.ceil(t.length / 4), r = new Array(i), e = 0;
      e < t.length;
      e++
    )
      t[e] = 255 & t[e];
    for (e = 0; e < r.length; e++) r[e] = Y(t, 4 * e);
    return r;
  }
  function j() {}
  function Z() {
    (this.ivByte = new Array(
      115,
      128,
      22,
      111,
      73,
      20,
      178,
      185,
      23,
      36,
      66,
      215,
      218,
      138,
      6,
      0,
      169,
      111,
      48,
      188,
      22,
      49,
      56,
      170,
      227,
      141,
      238,
      77,
      176,
      251,
      14,
      78
    )),
      (this.iv = V(this.ivByte)),
      (this.tj = new Array(64)),
      (this.BLOCK_BYTE_LEN = 64),
      (this.vbuf = new Array(8)),
      (this.dataBuf = new Array(64)),
      (this.dataBufLen = 0),
      (this.totalLen = 0);
    for (var t = 0; t < 64; t++) this.tj[t] = t <= 15 ? 2043430169 : 2055708042;
    z(this.iv, 0, this.vbuf, 0, this.vbuf.length);
  }
  (k.prototype.nextBytes = function (t) {
    var i;
    for (i = 0; i < t.length; ++i) t[i] = N();
  }),
    (j.encode = function (t, i, r) {
      for (
        var e = new Array(2 * r),
          n = new Array(
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "A",
            "B",
            "C",
            "D",
            "E",
            "F"
          ),
          o = i,
          s = 0;
        o < r + i;
        o++, s++
      )
        (e[s] = n[(255 & t[o]) >> 4]), (e[++s] = n[15 & t[o]]);
      return e.join("");
    }),
    (j.decode = function (t) {
      if (null == t || "" == t) return null;
      if (t.length % 2 != 0) return null;
      for (
        var i = t.length / 2,
          r = this.toCharCodeArray(t),
          e = new Array(i),
          n = 0;
        n < i;
        n++
      ) {
        if (r[2 * n] >= 48 && r[2 * n] <= 57) e[n] = (r[2 * n] - 48) << 4;
        else if (r[2 * n] >= 65 && r[2 * n] <= 70)
          e[n] = (r[2 * n] - 65 + 10) << 4;
        else {
          if (!(r[2 * n] >= 97 && r[2 * n] <= 102)) return null;
          e[n] = (r[2 * n] - 97 + 10) << 4;
        }
        if (r[2 * n + 1] >= 48 && r[2 * n + 1] <= 57)
          e[n] = e[n] | (r[2 * n + 1] - 48);
        else if (r[2 * n + 1] >= 65 && r[2 * n + 1] <= 70)
          e[n] = e[n] | (r[2 * n + 1] - 65 + 10);
        else {
          if (!(r[2 * n + 1] >= 97 && r[2 * n + 1] <= 102)) return null;
          e[n] = e[n] | (r[2 * n + 1] - 97 + 10);
        }
      }
      return e;
    }),
    (j.utf8StrToHex = function (t) {
      for (
        var i = encodeURIComponent(t),
          r = unescape(i),
          e = r.length,
          n = [],
          o = 0;
        o < e;
        o++
      )
        n[o] = r.charCodeAt(o).toString(16);
      return n.join("");
    }),
    (j.utf8StrToBytes = function (t) {
      for (
        var i = encodeURIComponent(t),
          r = unescape(i),
          e = r.length,
          n = [],
          o = 0;
        o < e;
        o++
      )
        n[o] = r.charCodeAt(o);
      return n;
    }),
    (j.hexToUtf8Str = function (t) {
      for (var i = j.decode(t), r = [], e = 0; e < i.length; e++)
        r.push(String.fromCharCode(i[e]));
      return decodeURIComponent(escape(r.join("")));
    }),
    (j.bytesToUtf8Str = function (t) {
      for (var i = t, r = [], e = 0; e < i.length; e++)
        r.push(String.fromCharCode(i[e]));
      return decodeURIComponent(escape(r.join("")));
    }),
    (j.toCharCodeArray = function (t) {
      for (var i = new Array(t.length), r = 0; r < t.length; r++)
        i[r] = t.charCodeAt(r);
      return i;
    }),
    (Z.prototype = {
      ffj: function (t, i, r, e) {
        return e <= 15 ? t ^ i ^ r : (t & i) | (t & r) | (i & r);
      },
      ggj: function (t, i, r, e) {
        return e <= 15 ? t ^ i ^ r : (t & i) | (~t & r);
      },
      p0: function (t) {
        return t ^ ((t << 9) | (t >>> 23)) ^ ((t << 17) | (t >>> 15));
      },
      p1: function (t) {
        return t ^ ((t << 15) | (t >>> 17)) ^ ((t << 23) | (t >>> 9));
      },
      cycleLeft: function (t, i) {
        return (t << i) | (t >>> (32 - i));
      },
      padding: function (t) {
        var i,
          r,
          e = 0,
          n = t.length;
        return (
          (e = 64 - ((n + 1 + 8) % 64)) >= 64 && (e = 0),
          ((i = new Array(e + 1 + n + 8))[n] = 128),
          z(t, 0, i, 0, n),
          z(
            ((r = this.totalLen << 3),
            new Array(
              0,
              0,
              0,
              0,
              (r >> 24) & 255,
              (r >> 16) & 255,
              (r >> 8) & 255,
              255 & r
            )),
            0,
            i,
            n + e + 1,
            8
          ),
          i
        );
      },
      iterate: function (t) {
        var i,
          r,
          e,
          n = t.length,
          o = parseInt(n / 16);
        (i = this.vbuf), (r = new Array(16));
        for (var s = 0; s < o; s++)
          z(t, 16 * s, r, 0, r.length),
            (e = this.expand(r)),
            (i = this.cf(i, e[0], e[1]));
        z(i, 0, this.vbuf, 0, i.length);
      },
      expand: function (t) {
        var i = new Array(68),
          r = new Array(64);
        z(t, 0, i, 0, t.length);
        for (var e = 16; e < i.length; e++)
          i[e] =
            this.p1(i[e - 16] ^ i[e - 9] ^ this.cycleLeft(i[e - 3], 15)) ^
            this.cycleLeft(i[e - 13], 7) ^
            i[e - 6];
        for (e = 0; e < r.length; e++) r[e] = i[e] ^ i[e + 4];
        return new Array(i, r);
      },
      cf: function (t, i, r) {
        var e, n, o, s, h, u, f, a, l, c, p, g, y;
        (n = t[0]),
          (o = t[1]),
          (s = t[2]),
          (h = t[3]),
          (u = t[4]),
          (f = t[5]),
          (a = t[6]),
          (l = t[7]);
        for (var v = 0; v < 64; v++)
          (p =
            (c = this.cycleLeft(
              this.cycleLeft(n, 12) + u + this.cycleLeft(this.tj[v], v),
              7
            )) ^ this.cycleLeft(n, 12)),
            (g = this.ffj(n, o, s, v) + h + p + r[v]),
            (y = this.ggj(u, f, a, v) + l + c + i[v]),
            (h = s),
            (s = this.cycleLeft(o, 9)),
            (o = n),
            (n = g),
            (l = a),
            (a = this.cycleLeft(f, 19)),
            (f = u),
            (u = this.p0(y));
        return (
          ((e = new Array(8))[0] = n ^ t[0]),
          (e[1] = o ^ t[1]),
          (e[2] = s ^ t[2]),
          (e[3] = h ^ t[3]),
          (e[4] = u ^ t[4]),
          (e[5] = f ^ t[5]),
          (e[6] = a ^ t[6]),
          (e[7] = l ^ t[7]),
          e
        );
      },
      digest: function (t) {
        var i = V(this.padding(t));
        return this.iterate(i), K(this.vbuf);
      },
      update: function (t, i, r) {
        var e = parseInt((r + this.dataBufLen) / 64);
        if (((this.totalLen += r), r + this.dataBufLen < this.BLOCK_BYTE_LEN))
          z(t, 0, this.dataBuf, this.dataBufLen, r),
            (this.dataBufLen = r + this.dataBufLen);
        else {
          var n;
          z(
            t,
            0,
            this.dataBuf,
            this.dataBufLen,
            this.BLOCK_BYTE_LEN - this.dataBufLen
          ),
            (n = V(this.dataBuf)),
            this.iterate(n);
          for (var o = 1; o < e; o++)
            z(
              t,
              o * this.BLOCK_BYTE_LEN - this.dataBufLen,
              this.dataBuf,
              0,
              this.BLOCK_BYTE_LEN
            ),
              (n = V(this.dataBuf)),
              this.iterate(n);
          z(
            t,
            e * this.BLOCK_BYTE_LEN - this.dataBufLen,
            this.dataBuf,
            0,
            r - (e * this.BLOCK_BYTE_LEN - this.dataBufLen)
          ),
            (this.dataBufLen = r - (e * this.BLOCK_BYTE_LEN - this.dataBufLen));
        }
      },
      doFinal: function () {
        var t = new Array(this.dataBufLen);
        z(this.dataBuf, 0, t, 0, this.dataBufLen);
        var i = V(this.padding(t));
        return this.iterate(i), K(this.vbuf);
      },
    });
  var U = "FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFF",
    G = "FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFC",
    X = "28E9FA9E9D9F5E344D5A9E4BCF6509A7F39789F515AB8F92DDBCBD414D940E93",
    H = "FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFF7203DF6B21C6052B53BBF40939D54123",
    Q = "32C4AE2C1F1981195F9904466A39C9948FE30BBFF2660BE1715A4589334C74C7",
    W = "BC3736A2F4F6779C59BDCEE36B692153D0A9877CC62A474002DF32E52139F0A0";
  function J() {
    (this.ecc_p = new s(U, 16)),
      (this.ecc_a = new s(G, 16)),
      (this.ecc_b = new s(X, 16)),
      (this.ecc_n = new s(H, 16)),
      (this.ecc_gx = new s(Q, 16)),
      (this.ecc_gy = new s(W, 16)),
      (this.rng = new k()),
      (this.ecCurve = new M(this.ecc_p, this.ecc_a, this.ecc_b)),
      (this.ecPointG = O.decodeFromHex(this.ecCurve, "04" + Q + W));
  }
  function $() {
    (this.sbox = new Array(
      214,
      144,
      233,
      254,
      204,
      225,
      61,
      183,
      22,
      182,
      20,
      194,
      40,
      251,
      44,
      5,
      43,
      103,
      154,
      118,
      42,
      190,
      4,
      195,
      170,
      68,
      19,
      38,
      73,
      134,
      6,
      153,
      156,
      66,
      80,
      244,
      145,
      239,
      152,
      122,
      51,
      84,
      11,
      67,
      237,
      207,
      172,
      98,
      228,
      179,
      28,
      169,
      201,
      8,
      232,
      149,
      128,
      223,
      148,
      250,
      117,
      143,
      63,
      166,
      71,
      7,
      167,
      252,
      243,
      115,
      23,
      186,
      131,
      89,
      60,
      25,
      230,
      133,
      79,
      168,
      104,
      107,
      129,
      178,
      113,
      100,
      218,
      139,
      248,
      235,
      15,
      75,
      112,
      86,
      157,
      53,
      30,
      36,
      14,
      94,
      99,
      88,
      209,
      162,
      37,
      34,
      124,
      59,
      1,
      33,
      120,
      135,
      212,
      0,
      70,
      87,
      159,
      211,
      39,
      82,
      76,
      54,
      2,
      231,
      160,
      196,
      200,
      158,
      234,
      191,
      138,
      210,
      64,
      199,
      56,
      181,
      163,
      247,
      242,
      206,
      249,
      97,
      21,
      161,
      224,
      174,
      93,
      164,
      155,
      52,
      26,
      85,
      173,
      147,
      50,
      48,
      245,
      140,
      177,
      227,
      29,
      246,
      226,
      46,
      130,
      102,
      202,
      96,
      192,
      41,
      35,
      171,
      13,
      83,
      78,
      111,
      213,
      219,
      55,
      69,
      222,
      253,
      142,
      47,
      3,
      255,
      106,
      114,
      109,
      108,
      91,
      81,
      141,
      27,
      175,
      146,
      187,
      221,
      188,
      127,
      17,
      217,
      92,
      65,
      31,
      16,
      90,
      216,
      10,
      193,
      49,
      136,
      165,
      205,
      123,
      189,
      45,
      116,
      208,
      18,
      184,
      229,
      180,
      176,
      137,
      105,
      151,
      74,
      12,
      150,
      119,
      126,
      101,
      185,
      241,
      9,
      197,
      110,
      198,
      132,
      24,
      240,
      125,
      236,
      58,
      220,
      77,
      32,
      121,
      238,
      95,
      62,
      215,
      203,
      57,
      72
    )),
      (this.fk = new Array(2746333894, 1453994832, 1736282519, 2993693404)),
      (this.ck = new Array(
        462357,
        472066609,
        943670861,
        1415275113,
        1886879365,
        2358483617,
        2830087869,
        3301692121,
        3773296373,
        4228057617,
        404694573,
        876298825,
        1347903077,
        1819507329,
        2291111581,
        2762715833,
        3234320085,
        3705924337,
        4177462797,
        337322537,
        808926789,
        1280531041,
        1752135293,
        2223739545,
        2695343797,
        3166948049,
        3638552301,
        4110090761,
        269950501,
        741554753,
        1213159005,
        1684763257
      ));
  }
  function tt(t, i) {
    var r = j.utf8StrToHex(t);
    return new J().encrypt(i, r);
  }
  function it(t, i) {
    var r = j.utf8StrToBytes(t),
      e = j.decode(i),
      n = new $().encrypt_ecb(e, r);
    return j.encode(n, 0, n.length);
  }
  (J.prototype = {
    getBigRandom: function (t) {
      return new s(t.bitLength(), this.rng).mod(t.subtract(s.ONE)).add(s.ONE);
    },
    generateKeyPairHex: function () {
      var t = this.generateKeyPairBigInteger(),
        i = t.pubkey.getX().toBigInteger(),
        r = t.pubkey.getY().toBigInteger();
      return {
        privkeyhex: ("0000000000" + t.privkey.toString(16)).slice(-64),
        pubkeyhex:
          "04" +
          ("0000000000" + i.toString(16)).slice(-64) +
          ("0000000000" + r.toString(16)).slice(-64),
      };
    },
    generateKeyPairBigInteger: function () {
      for (var t = this.ecc_n, i = null, r = null; ; ) {
        do {
          i = this.getBigRandom(t);
        } while (
          i.equals(s.ZERO) ||
          i.compareTo(t) >= 0 ||
          i.bitLength() < 249
        );
        if (
          (r = this.ecPointG.multiply(i)).getX().toBigInteger().bitLength() >=
            249 &&
          r.getY().toBigInteger().bitLength() >= 249
        )
          break;
      }
      return { privkey: i, pubkey: r };
    },
    formartXY: function (t, i) {
      for (var r = new Array(i), e = 0; e < r.length; e++) r[e] = 0;
      var n = t.toByteArray();
      return null == n
        ? null
        : (n.length > i
            ? z(n, n.length - i, r, 0, i)
            : n.length == i
            ? (r = n)
            : z(n, 0, r, i - n.length, n.length),
          r);
    },
    kdf: function (t, i) {
      for (
        var r, e = Math.ceil(i.length / 32), n = new Array(32), o = 0;
        o < e;
        o++
      ) {
        (r = new Z()).update(t, 0, t.length),
          r.update(P(o + 1), 0, 4),
          (n = r.doFinal());
        for (var s = 0; s < n.length && 32 * o + s < i.length; s++)
          i[32 * o + s] ^= n[s];
      }
      return 0;
    },
    arrayCompare: function (t, i, r, e, n) {
      if (t.length - i < n) return -1;
      if (r.length - e < n) return -1;
      for (var o = 0; o < n; o++) if (t[i++] != r[e++]) return -1;
      return 0;
    },
    encrypt: function (t, i) {
      if (null == t || 0 == t.length || null == i || 0 == i.length) return null;
      128 == t.length && (t = "04" + t);
      var r = j.decode(i),
        e = O.decodeFromHex(this.ecCurve, t),
        n = null,
        o = null,
        s = null,
        h = null,
        u = 0;
      do {
        var f = this.generateKeyPairBigInteger();
        o = f.pubkey;
        var a = e.multiply(f.privkey);
        (s = this.formartXY(a.getX().toBigInteger(), 32)),
          (h = this.formartXY(a.getY().toBigInteger(), 32)),
          z(r, 0, (n = new Array(r.length)), 0, r.length);
        var l = new Array(s.length + h.length);
        z(s, 0, l, 0, s.length),
          z(h, 0, l, s.length, h.length),
          this.kdf(l, n),
          u++;
      } while (0 == this.arrayCompare(n, 0, r, 0, r.length) && u < 10);
      if (u >= 10) return null;
      var c = new Z();
      c.update(s, 0, s.length),
        c.update(r, 0, r.length),
        c.update(h, 0, h.length);
      var p = c.doFinal(),
        g = o.getX().toBigInteger().toByteArray(),
        y = o.getY().toBigInteger().toByteArray(),
        v = this.cipherToDer(g, y, n, p);
      return j.encode(v, 0, v.length);
    },
    cipherToDer: function (t, i, r, e) {
      var n = r.length,
        o = [];
      if (n < 128) (o[0] = 4), (o[1] = n);
      else {
        o[0] = 4;
        for (var s = P(n), h = 0; 0 == s[h] && h < s.length; ) h++;
        o[1] = 128 | (s.length - h);
        for (var u = 2; h < s.length; h++, u++) o[u] = s[h];
      }
      var f = t.length + i.length + r.length + e.length + 6 + o.length,
        a = [];
      if (((a[0] = 48), f < 128)) a[1] = f;
      else {
        var l = P(f);
        for (h = 0; 0 == l[h] && h < l.length; ) h++;
        for (a[1] = 128 | (l.length - h), u = 2; h < l.length; h++, u++)
          a[u] = l[h];
      }
      var c = new Array(f + a.length),
        p = 0;
      return (
        z(a, 0, c, 0, a.length),
        (p += a.length),
        (c[p++] = 2),
        (c[p++] = t.length),
        z(t, 0, c, p, t.length),
        (p += t.length),
        (c[p++] = 2),
        (c[p++] = i.length),
        z(i, 0, c, p, i.length),
        (p += i.length),
        (c[p++] = 4),
        (c[p++] = e.length),
        z(e, 0, c, p, e.length),
        z(o, 0, c, (p += e.length), o.length),
        z(r, 0, c, (p += o.length), r.length),
        c
      );
    },
    derDecode: function (t) {
      var i = 0;
      if (48 != t[i++]) return null;
      (255 & t[i]) <= 127 ? i++ : (i += 1 + (127 & t[i]));
      var r = t[++i],
        e = new Array(r);
      z(t, ++i, e, 0, r), (i += r);
      var n = t[++i],
        o = new Array(n);
      z(t, ++i, o, 0, n), (i += n);
      var s = t[++i],
        h = new Array(s);
      z(t, ++i, h, 0, s), (i += s);
      var u = 0;
      if ((255 & t[++i]) <= 127) u = 255 & t[i];
      else {
        for (var f = 0, a = (127 & t[i]) - 1; f < (127 & t[i]); f++, a--)
          u |= (255 & t[i + f + 1]) << (8 * a);
        i += 127 & t[i];
      }
      var l = new Array(u);
      return z(t, ++i, l, 0, u), (i += u), { c1x: e, c1y: o, c2: l, c3: h };
    },
  }),
    ($.prototype = {
      expandKey: function (t) {
        var i = new Array(36),
          r = V(t);
        (i[0] = r[0] ^ this.fk[0]),
          (i[1] = r[1] ^ this.fk[1]),
          (i[2] = r[2] ^ this.fk[2]),
          (i[3] = r[3] ^ this.fk[3]);
        for (var e = new Array(32), n = 0; n < 32; n++)
          (i[n + 4] =
            i[n] ^ this.T1(i[n + 1] ^ i[n + 2] ^ i[n + 3] ^ this.ck[n])),
            (e[n] = i[n + 4]);
        return e;
      },
      T1: function (t) {
        var i = new Array(4),
          r = P(t);
        (i[0] = this.sbox[255 & r[0]]),
          (i[1] = this.sbox[255 & r[1]]),
          (i[2] = this.sbox[255 & r[2]]),
          (i[3] = this.sbox[255 & r[3]]);
        var e = Y(i, 0);
        return e ^ ((e << 13) | (e >>> 19)) ^ ((e << 23) | (e >>> 9));
      },
      one_encrypt: function (t, i) {
        var r = new Array(36);
        (r[0] = Y(i, 0)), (r[1] = Y(i, 4)), (r[2] = Y(i, 8)), (r[3] = Y(i, 12));
        for (var e = 0; e < 32; e++)
          r[e + 4] = r[e] ^ this.T0(r[e + 1] ^ r[e + 2] ^ r[e + 3] ^ t[e]);
        var n = new Array(4);
        for (e = 35; e >= 32; e--) n[35 - e] = r[e];
        return K(n);
      },
      T0: function (t) {
        var i = P(t),
          r = new Array(4);
        (r[0] = this.sbox[255 & i[0]]),
          (r[1] = this.sbox[255 & i[1]]),
          (r[2] = this.sbox[255 & i[2]]),
          (r[3] = this.sbox[255 & i[3]]);
        var e = Y(r, 0);
        return (
          e ^
          ((e << 2) | (e >>> 30)) ^
          ((e << 10) | (e >>> 22)) ^
          ((e << 18) | (e >>> 14)) ^
          ((e << 24) | (e >>> 8))
        );
      },
      pkcs7padding: function (t, i) {
        if (null == t) return null;
        var r = null;
        if (1 == i) {
          var e = 16 - (t.length % 16);
          z(t, 0, (r = new Array(t.length + e)), 0, t.length);
          for (var n = 0; n < e; n++) r[t.length + n] = e;
        } else
          (e = t[t.length - 1]),
            z(t, 0, (r = new Array(t.length - e)), 0, t.length - e);
        return r;
      },
      encrypt_ecb: function (t, i) {
        if (t == undefined || null == t || t.length % 16 != 0)
          return console.log("sm4 key is error!"), null;
        if (i == undefined || null == i || i.length <= 0)
          return console.log("data is error!"), null;
        for (
          var r = this.expandKey(t),
            e = 16,
            n = parseInt(i.length / e),
            o = new Array((n + 1) * e),
            s = new Array(e),
            h = 0;
          h < n;
          h++
        )
          z(i, h * e, s, 0, e), z(this.one_encrypt(r, s), 0, o, h * e, e);
        var u = new Array(i.length % e);
        u.length > 0 && z(i, n * e, u, 0, i.length % e);
        var f = this.pkcs7padding(u, 1);
        return z(this.one_encrypt(r, f), 0, o, n * e, e), o;
      },
    });
  var rt,
    et = "";
  function nt() {
    return et || (et = e().UUID(!0)), et;
  }
  var ot,
    st,
    ht = (function () {
      function t() {
        this.type = i.GM;
      }
      return (
        (t.getInstance = function () {
          return rt || (rt = new t()), rt;
        }),
        (t.prototype.encryptBody = function (t) {
          if (!t) return t;
          var i = t,
            n = { source: "web" },
            o = nt(),
            s = e().now() + "_" + e().UUID() + "__ty_enc_body__" + t;
          return (
            (n.body = it(s, o)),
            (n.encKey = tt(o, r().encPubKey)),
            (n.hash = (function (t) {
              var i = j.utf8StrToBytes(t),
                r = new Z();
              r.update(i, 0, i.length);
              var e = r.doFinal();
              return j.encode(e, 0, e.length);
            })(s)),
            n.body && n.encKey && n.hash && (i = e().stringify(n)),
            i
          );
        }),
        (t.prototype.encryptParams = function (t) {
          return t ? it(t, nt()) : t;
        }),
        t
      );
    })(),
    ut = { sm2Enc: tt, sm4Enc: it },
    ft = (function () {
      function t() {
        this.type = i.LIGHT;
      }
      return (
        (t.getInstance = function () {
          return ot || (ot = new t()), ot;
        }),
        (t.prototype.encryptBody = function (t) {
          return this.lightweightEncrypt(t);
        }),
        (t.prototype.encryptParams = function (t) {
          return this.lightweightEncrypt(t);
        }),
        (t.prototype.lightweightEncrypt = function (t) {
          if (!t) return t;
          for (
            var i = e(),
              r = i.Base64.encode("".concat(i.now(), "_").concat(t)),
              n = Math.floor(8 * Math.random() + 1),
              o = r.substring(0, n),
              s = r.split(""),
              h = o.split(""),
              u = s.length - 1;
            u >= 0 && (s.splice(u + 1, 0, h.shift()), (u -= 2), 0 !== h.length);

          );
          if (h.length > 0) for (; h.length > 0; ) s.unshit(h.shift());
          for (
            var f = s.join(""), a = i.Base64.encode(f), l = a.length - 1;
            "=" === a[l];

          )
            l--;
          return a.substring(0, l + 1) + n + a.substring(l + 1);
        }),
        t
      );
    })(),
    at = "TingyunPluginEnc",
    lt = "__ty_plugin_registers",
    ct = "__ty_plugins";
  !(function (t) {
    (t.TOKEN = "T"), (t.APP_KEY = "A"), (t.KEY = "K");
  })(st || (st = {}));
  var pt,
    gt = { gm: ht.getInstance(), light: ft.getInstance() };
  function yt(i) {
    var e = i.url,
      n = i.body;
    try {
      if (e) {
        var o = e.indexOf("?");
        if (o > -1) {
          var s = e.substring(o + 1),
            u = e.substring(0, o),
            f = { e: pt.encryptParams(s), m: pt.type },
            a = r();
          a.token
            ? ((f.t = st.TOKEN), (f.k = a.token))
            : a.appKey
            ? ((f.t = st.APP_KEY), (f.k = a.appKey))
            : a.key && ((f.t = st.KEY), (f.k = a.key)),
            (i.url = t.bridge.getUrlWithParam(u, f));
        }
      }
      n && (i.body = pt.encryptBody(n));
    } catch (h) {
      (i.url = e), (i.body = n);
    }
  }
  function vt() {
    var e = t;
    if (e) {
      var n,
        o = r(),
        s = o.encMode;
      (n = s in gt ? gt[s] : gt.gm).type !== i.GM || o.encPubKey || (n = null),
        (pt = n);
      try {
        o.encEnabled &&
          n &&
          n.type === i.GM &&
          e.plugins &&
          (e.plugins.enc = { GM: ut });
      } catch (h) {}
    }
  }
  function mt() {
    return {
      name: at,
      init: function (i) {
        !(function (i) {
          t = i;
        })(i),
          vt();
      },
      hooks: {
        init: function () {
          vt();
        },
        beforeSend: function (t) {
          var i = r();
          i.encEnabled &&
            pt &&
            (i.encReplayEnabled || "replay" !== t.type) &&
            yt(t);
        },
      },
    };
  }
  return (
    (function () {
      try {
        if (window[lt] && window[lt][at])
          return window[lt][at](mt()), void delete window[lt][at];
        if (window[ct] && window[ct][at]) return;
        window[ct] || (window[ct] = {}), (window[ct][at] = mt);
      } catch (h) {}
    })(),
    mt
  );
})();

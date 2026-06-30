!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define(t)
    : ((e = "undefined" != typeof globalThis ? globalThis : e || self).cmos =
        t());
})(this, function () {
  "use strict";
  const e = ["web", "wxwv", "minp", "alip", "baidup", "qq", "bytedance"],
    t = {
      autotrack: { type: "boolean", default: !0 },
      compress: { type: "boolean", default: !0 },
      dataCollect: { type: "boolean", default: !0 },
      debug: { type: "boolean", default: !1 },
      hashtag: { type: "boolean", default: !1 },
      touch: { type: "boolean", default: !1 },
      version: { type: "string", default: "1.0.0" },
      platform: { type: "string", default: "web" },
      cookieDomain: { type: "string", default: "" },
      sendType: { type: "string", default: "beacon" },
    },
    i = {
      enableIdMapping: { type: "boolean", default: !1 },
      gtouchHost: { type: "string", default: "" },
      host: { type: "string", default: "napi.growingio.com" },
      ignoreFields: { type: "array", default: [] },
      penetrateHybrid: { type: "boolean", default: !0 },
      scheme: {
        type: "string",
        default:
          location.protocol.indexOf("http") > -1
            ? location.protocol.replace(":", "")
            : "https",
      },
      sessionExpires: { type: "number", default: 30 },
      performance: { type: "object", default: { monitor: !1, exception: !1 } },
      embeddedIgnore: { type: "array", default: [] },
      storageType: { type: "string", default: "cookie" },
    },
    n = {},
    r = [
      "clearUserId",
      "getGioInfo",
      "getLocation",
      "getOption",
      "init",
      "setDataCollect",
      "setOption",
      "setUserId",
      "track",
      "setGeneralProps",
      "clearGeneralProps",
      "enableDebug",
      "enableHT",
      "setAutotrack",
      "setTrackerHost",
      "setTrackerScheme",
      "setUserAttributes",
      "getVisitorId",
      "getDeviceId",
      "registerPlugins",
      "getPlugins",
      "sendPage",
      "sendVisit",
      "trackTimerStart",
      "trackTimerPause",
      "trackTimerResume",
      "trackTimerEnd",
      "removeTimer",
      "clearTrackTimer",
    ],
    s = [
      "autotrack",
      "dataCollect",
      "dataSourceId",
      "debug",
      "host",
      "hashtag",
      "scheme",
    ],
    o = { autotrack: "无埋点采集", dataCollect: "数据采集", debug: "调试模式" },
    a = ["send", "setConfig", "collectImp", "setPlatformProfile"],
    d = ["screenHeight", "screenWidth"],
    c = { click: "VIEW_CLICK", change: "VIEW_CHANGE", submit: "FORM_SUBMIT" };
  var u,
    l,
    h,
    g,
    p,
    m =
      "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof self
        ? self
        : {},
    f =
      "function" == typeof Array.from
        ? Array.from
        : (l ||
            ((l = 1),
            (h = function (e) {
              return "function" == typeof e;
            }),
            (g = function (e) {
              var t = (function (e) {
                var t = Number(e);
                return isNaN(t)
                  ? 0
                  : 0 !== t && isFinite(t)
                  ? (t > 0 ? 1 : -1) * Math.floor(Math.abs(t))
                  : t;
              })(e);
              return Math.min(Math.max(t, 0), 9007199254740991);
            }),
            (p = function (e) {
              var t = e.next();
              return !t.done && t;
            }),
            (u = function (e) {
              var t,
                i,
                n,
                r = this,
                s = arguments.length > 1 ? arguments[1] : void 0;
              if (void 0 !== s) {
                if (!h(s))
                  throw new TypeError(
                    "Array.from: when provided, the second argument must be a function"
                  );
                arguments.length > 2 && (t = arguments[2]);
              }
              var o = (function (e, t) {
                if (null != e && null != t) {
                  var i = e[t];
                  if (null == i) return;
                  if (!h(i)) throw new TypeError(i + " is not a function");
                  return i;
                }
              })(
                e,
                (function (e) {
                  if (null != e) {
                    if (
                      ["string", "number", "boolean", "symbol"].indexOf(
                        typeof e
                      ) > -1
                    )
                      return Symbol.iterator;
                    if (
                      "undefined" != typeof Symbol &&
                      "iterator" in Symbol &&
                      Symbol.iterator in e
                    )
                      return Symbol.iterator;
                    if ("@@iterator" in e) return "@@iterator";
                  }
                })(e)
              );
              if (void 0 !== o) {
                i = h(r) ? Object(new r()) : [];
                var a,
                  d,
                  c = o.call(e);
                if (null == c)
                  throw new TypeError(
                    "Array.from requires an array-like or iterable object"
                  );
                for (n = 0; ; ) {
                  if (!(a = p(c))) return (i.length = n), i;
                  (d = a.value), (i[n] = s ? s.call(t, d, n) : d), n++;
                }
              } else {
                var u = Object(e);
                if (null == e)
                  throw new TypeError(
                    "Array.from requires an array-like object - not null or undefined"
                  );
                var l,
                  m = g(u.length);
                for (i = h(r) ? Object(new r(m)) : Array(m), n = 0; m > n; )
                  (l = u[n]), (i[n] = s ? s.call(t, l, n) : l), n++;
                i.length = m;
              }
              return i;
            })),
          u);
  const v = (e) => R(["undefined", "null"], X(e)),
    I = (e) => "string" === X(e),
    w = (e) => "number" === X(e),
    y = (e) => "NaN" === j(Number(e)),
    b = (e) => "boolean" === X(e),
    O = (e) => "object" === X(e) && !v(e),
    E = (e) => "regexp" === X(e),
    _ = (e) => ["function", "asyncfunction"].includes(X(e)),
    S = (e) => Array.isArray(e) && "array" === X(e),
    T = (e) => "date" === X(e),
    N = (e, t) =>
      w(e)
        ? Number(e.toFixed(w(t) ? t : 2))
        : I(e) && "NaN" !== j(Number(e))
        ? Number(Number(e).toFixed(w(t) ? t : 2))
        : e,
    C = (e) => {
      try {
        return k(e)[0];
      } catch (e) {
        return;
      }
    },
    P = (e) => {
      try {
        const t = k(e);
        return t[t.length - 1];
      } catch (e) {
        return;
      }
    },
    L = (e, t = 1) => (S(e) && w(t) ? e.slice(t > 0 ? t : 1, e.length) : e),
    x = (e) => {
      if (S(e)) {
        let t = 0;
        const i = [];
        for (const n of e) n && !$(n) && (i[t++] = n);
        return i;
      }
      return e;
    },
    A = (e, t) => e[D(e, t)],
    D = (e, t) => {
      let i = -1;
      return S(e) && e.every((e, n) => !t(e) || ((i = n), !1)), i;
    },
    R = (e, t) => ("array" === X(e) || "string" === X(e)) && e.indexOf(t) >= 0,
    k = f,
    j = (e) => (v(e) ? "" : "" + e),
    U = (e, t) => ("string" == typeof e ? e.split(t) : e),
    q = (e) => {
      if (I(e)) {
        const t = U(e, "");
        return `${C(t).toLowerCase()}${L(t).join("")}`;
      }
      return e;
    },
    G = (e, t) => !!I(e) && e.slice(0, t.length) === t,
    H = (e, t) => {
      if (I(e)) {
        const { length: i } = e;
        let n = i;
        n > i && (n = i);
        const r = n;
        return (n -= t.length), n >= 0 && e.slice(n, r) === t;
      }
      return !1;
    },
    B = {}.hasOwnProperty,
    M = (e, t) => !v(e) && B.call(e, t),
    K = (e) => (O(e) ? Object.keys(e) : []),
    F = (e, t) => {
      K(e).forEach((i) => t(e[i], i));
    },
    V = (e, t) => {
      const i = K(e);
      return !(
        !O(e) ||
        !O(t) ||
        i.length !== K(t).length ||
        R(
          i.map((i, n) => (O(e[i]) ? V(e[i], t[i]) : e[i] === t[i])),
          !1
        )
      );
    },
    W = (e, t) => {
      if (!O(e)) return !1;
      try {
        return "string" === X(t)
          ? delete e[t]
          : "array" === X(t)
          ? t.map((t) => delete e[t])
          : (E(t) &&
              K(e).forEach((i) => {
                t.test(i) && W(e, i);
              }),
            !0);
      } catch (e) {
        return !1;
      }
    },
    $ = (e) => (S(e) ? 0 === e.length : O(e) ? 0 === K(e).length : !e),
    X = (e) => ({}.toString.call(e).slice(8, -1).toLowerCase());
  var z = Object.freeze({
    __proto__: null,
    isNil: v,
    isString: I,
    isNumber: w,
    isNaN: y,
    isBoolean: b,
    isObject: O,
    isRegExp: E,
    isFunction: _,
    isArray: S,
    isDate: T,
    fixed: N,
    head: C,
    last: P,
    drop: L,
    dropWhile: (e, t) => (S(e) ? e.filter((e) => !t(e)) : e),
    compact: x,
    find: A,
    findIndex: D,
    includes: R,
    arrayFrom: k,
    toString: j,
    split: U,
    lowerFirst: q,
    upperFirst: (e) => {
      if (I(e)) {
        const t = U(e, "");
        return `${C(t).toUpperCase()}${L(t).join("")}`;
      }
      return e;
    },
    startsWith: G,
    endsWith: H,
    has: M,
    keys: K,
    forEach: F,
    isEqual: V,
    get: (e, t, i) => {
      let n = e;
      return O(e)
        ? (t.split(".").forEach((e) => {
            n = n ? n[e] : i;
          }),
          n)
        : i;
    },
    unset: W,
    isEmpty: $,
    typeOf: X,
    formatDate: (e) => {
      if (T(e)) {
        const t = (e) => (10 > e ? "0" + e : e);
        return (
          e.getFullYear() +
          "-" +
          t(e.getMonth() + 1) +
          "-" +
          t(e.getDate()) +
          " " +
          t(e.getHours()) +
          ":" +
          t(e.getMinutes()) +
          ":" +
          t(e.getSeconds()) +
          "." +
          t(e.getMilliseconds())
        );
      }
      return e;
    },
  });
  const J = (e, t) => {
      console.log(
        "%c [cmos-log]：" + e,
        {
          info: "color: #3B82F6;",
          error: "color: #EF4444;",
          warn: "color: #F59E0B;",
          success: "color: #10B981;",
        }[t] || ""
      );
    },
    Q = (e) => {
      try {
        return e();
      } catch (e) {
        return;
      }
    },
    Z = (e) => {
      const t = {};
      return (
        O(e) &&
          F(e, (e, i) => {
            var n;
            const r = j(i).slice(0, 100);
            O(e)
              ? (t[r] = Z(e))
              : S(e)
              ? ((t[r] = e.slice(0, 100)),
                "cdp" ===
                  (null === (n = window.vds) || void 0 === n
                    ? void 0
                    : n.gioEnvironment) &&
                  (t[r] = t[r].join("||").slice(0, 1e3)))
              : (t[r] = v(e) ? "" : j(e).slice(0, 1e3));
          }),
        t
      );
    },
    Y = (e, t, i, n = {}) => {
      document.addEventListener
        ? e.addEventListener(
            t,
            i,
            Object.assign(Object.assign({}, { capture: !0 }), n)
          )
        : e.attachEvent
        ? e.attachEvent("on" + t, i)
        : (e["on" + t] = i);
    },
    ee = (e, t) =>
      I(e) && !$(e) && e.match(/^[a-zA-Z_][0-9a-zA-Z_]{0,100}$/)
        ? t()
        : (J(
            "事件名格式不正确，只能包含数字、字母和下划线，且不能以数字开头，字符总长度不能超过100!",
            "error"
          ),
          !1);
  var te = Object.freeze({
    __proto__: null,
    consoleText: J,
    niceTry: Q,
    limitObject: Z,
    addListener: Y,
    flattenObject: (e = {}) => {
      const t = Object.assign({}, e);
      return (
        K(t).forEach((e) => {
          O(t[e])
            ? (K(t[e]).forEach((i) => {
                t[`${e}_${i}`] = j(t[e][i]);
              }),
              W(t, e))
            : S(t[e])
            ? (t[e].forEach((i, n) => {
                O(i)
                  ? K(i).forEach((r) => {
                      t[`${e}_${n}_${r}`] = j(i[r]);
                    })
                  : (t[`${e}_${n}`] = j(i));
              }),
              W(t, e))
            : v(t[e]) || "" === t[e]
            ? W(t, e)
            : (t[e] = j(t[e]));
        }),
        Z(t)
      );
    },
    eventNameValidate: ee,
    getGioFunction: () => {
      var e, t, i, n;
      const r = window._gio_local_vds || "vds",
        s =
          null !==
            (t =
              null === (e = window[r]) || void 0 === e
                ? void 0
                : e.namespace) && void 0 !== t
            ? t
            : "gdp";
      return _(window[s])
        ? window[s]
        : null !==
            (n = null !== (i = window.gdp) && void 0 !== i ? i : window.gio) &&
          void 0 !== n
        ? n
        : function () {};
    },
  });
  const ie = (e) => (I(e) && e.length > 0) || (w(e) && e > 0),
    ne =
      /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/i,
    re =
      /^(https?:\/\/)|(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
  function se(e) {
    for (var t = 1; arguments.length > t; t++) {
      var i = arguments[t];
      for (var n in i) e[n] = i[n];
    }
    return e;
  }
  var oe = (function e(t, i) {
    function n(e, n, r) {
      if ("undefined" != typeof document) {
        "number" == typeof (r = se({}, i, r)).expires &&
          (r.expires = new Date(Date.now() + 864e5 * r.expires)),
          r.expires && (r.expires = r.expires.toUTCString()),
          (e = encodeURIComponent(e)
            .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
            .replace(/[()]/g, escape));
        var s = "";
        for (var o in r)
          r[o] &&
            ((s += "; " + o), !0 !== r[o] && (s += "=" + r[o].split(";")[0]));
        return (document.cookie = e + "=" + t.write(n, e) + s);
      }
    }
    return Object.create(
      {
        set: n,
        get: function (e) {
          if ("undefined" != typeof document && (!arguments.length || e)) {
            for (
              var i = document.cookie ? document.cookie.split("; ") : [],
                n = {},
                r = 0;
              r < i.length;
              r++
            ) {
              var s = i[r].split("="),
                o = s.slice(1).join("=");
              try {
                var a = decodeURIComponent(s[0]);
                if (((n[a] = t.read(o, a)), e === a)) break;
              } catch (e) {}
            }
            return e ? n[e] : n;
          }
        },
        remove: function (e, t) {
          n(e, "", se({}, t, { expires: -1 }));
        },
        withAttributes: function (t) {
          return e(this.converter, se({}, this.attributes, t));
        },
        withConverter: function (t) {
          return e(se({}, this.converter, t), this.attributes);
        },
      },
      {
        attributes: { value: Object.freeze(i) },
        converter: { value: Object.freeze(t) },
      }
    );
  })(
    {
      read: function (e) {
        return (
          '"' === e[0] && (e = e.slice(1, -1)),
          e.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
        );
      },
      write: function (e) {
        return encodeURIComponent(e).replace(
          /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
          decodeURIComponent
        );
      },
    },
    { path: "/" }
  );
  const ae = () =>
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
        const t = (16 * Math.random()) | 0;
        return ("x" === e ? t : (3 & t) | 8).toString(16);
      }),
    de = (e) => (H(e, "_gioenc") ? e.slice(0, -7) : e),
    ce = () => {
      const e = window.navigator.userAgent;
      return (
        /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(e) &&
        !/chrome\/(\d+\.\d+)/i.test(e)
      );
    },
    ue = (e) => (y(Number(e)) && Q(() => JSON.parse(e))) || e,
    le = { A: 1, a: 1, Z: 1, z: 1, "@": 1, "{": 1 },
    he = (e) => (v(e) ? e : Q(() => "gioenc-" + pe(e)) || e),
    ge = (e) =>
      (I(e) && G(e, "gioenc-") && Q(() => pe(e.replace("gioenc-", "")))) || e,
    pe = (e) =>
      (e = e || "")
        .split("")
        .map((e) => (le[e] ? e : me(e)))
        .join(""),
    me = (e) => {
      if (/[0-9]/.test(e)) return 1 ^ +e;
      {
        let t = e.charCodeAt(0);
        return String.fromCharCode(1 ^ t);
      }
    };
  class fe {
    constructor(e) {
      (this.domain = e),
        (this.getItem = (e) =>
          ue(ge(oe.get(de(e), { domain: this.domain, path: "/" })))),
        (this.setItem = (e, t, i) => {
          let n;
          (n = I(t)
            ? t.length
              ? H(e, "_gioenc")
                ? he(t)
                : t
              : ""
            : JSON.stringify(t)),
            oe.set(de(e), n, {
              expires: i ? new Date(i) : 3650,
              domain: this.domain,
              path: "/",
            });
        }),
        (this.removeItem = (e) => {
          oe.remove(de(e), { domain: this.domain, path: "/" });
        }),
        (this.hasItem = (e) => R(K(oe.get()), de(e))),
        (this.getKeys = () => K(oe.get())),
        (this.type = "Cookie");
    }
  }
  class ve {
    constructor() {
      (this.getItem = (e) => {
        const t = Q(() => JSON.parse(localStorage.getItem(de(e)) || "")) || {};
        return O(t) && t.expiredAt > +Date.now() ? ue(ge(t.value)) : void 0;
      }),
        (this.setItem = (e, t, i) => {
          const n = null != i ? i : +new Date(9999, 12);
          localStorage.setItem(
            de(e),
            JSON.stringify({
              value: I(t) && t.length && H(e, "_gioenc") ? he(t) : t,
              expiredAt: n,
            })
          );
        }),
        (this.removeItem = (e) => localStorage.removeItem(de(e))),
        (this.hasItem = (e) => !!localStorage.getItem(de(e))),
        (this.getKeys = () =>
          k(Array(localStorage.length)).map((e, t) => localStorage.key(t))),
        (this.type = "localStorage");
    }
  }
  const Ie = {};
  class we {
    constructor() {
      (this.getItem = (e) => {
        const t = Q(() => JSON.parse(Ie[de(e)] || ""));
        return O(t) && t.expiredAt > +Date.now() ? ue(ge(t.value)) : void 0;
      }),
        (this.setItem = (e, t, i) => {
          const n = null != i ? i : +new Date(9999, 12);
          Ie[de(e)] = JSON.stringify({
            value: I(t) && t.length ? he(t) : t,
            expiredAt: n,
          });
        }),
        (this.removeItem = (e) => W(Ie, de(e))),
        (this.hasItem = (e) => M(Ie, de(e))),
        (this.getKeys = () => K(Ie)),
        (this.type = "memory");
    }
  }
  let ye;
  const be = /^(\.ac\.|\.br\.|\.co\.|\.com\.|\.edu\.|\.gov\.|\.org\.|\.net\.)/,
    Oe = (e) => {
      const t = [];
      try {
        const i = e.split("."),
          n = P(i);
        if (
          i.length >= 2 &&
          (isNaN(Number(n)) || 0 > Number(n) || Number(n) > 255)
        ) {
          const e = "." + i.slice(-2).join(".");
          be.test(e) ? (ye = e) : t.push(e);
          const n = "." + i.slice(-3).join(".");
          be.test(n) || t.includes(n) || t.push(n);
          const r = "." + i.slice(-4).join(".");
          be.test(r) || t.includes(r) || t.push(r);
        }
      } catch (e) {}
      return t;
    },
    Ee = (e) => {
      let t = "";
      return e.every((e) => !_e(e) || ((t = e), !1)), t;
    },
    _e = (e) => {
      try {
        oe.set("gioCookie", "yes", { domain: e });
        const t = !!oe.get("gioCookie", { domain: e });
        return oe.remove("gioCookie", { domain: e }), t;
      } catch (e) {
        return !1;
      }
    },
    Se = (e) => {
      let t,
        i,
        n,
        { storageType: r, cookieDomain: s, projectId: o } = e;
      if (
        (R(["cookie", "localstorage"], r) || (r = "cookie"),
        "cookie" === r &&
          ((n =
            navigator.userAgent.indexOf("Electron") > -1 ||
            R(["", "localhost", "127.0.0.1"], window.location.hostname) ||
            !R(["http:", "https:"], window.location.protocol)
              ? ""
              : Ee([
                  ...Oe(window.location.hostname),
                  window.location.hostname,
                ])),
          (i = !!n)),
        "cookie" === r && i)
      ) {
        const e = new fe(n);
        if (s) {
          let t = Oe(s);
          const i = Ee($(t) ? [] : [s, ...Oe(s)]);
          i && _e(i)
            ? (e.domain = i)
            : J("指定Cookie域无效或无权限，使用默认域！", "warn");
        }
        t = e;
      } else
        t = (() => {
          try {
            const e = window.localStorage,
              t = "__storage_test__";
            return e.setItem(t, t), e.removeItem(t), !0;
          } catch (e) {
            return !1;
          }
        })()
          ? new ve()
          : new we();
      return (
        "cookie" === r &&
          ye &&
          _e(ye) &&
          ((e, t, i) => {
            if (t && _e(t)) {
              let n = new fe(t);
              [
                i + "_gdp_session_id",
                "gdp_user_id_gioenc",
                i + "_gdp_cs1_gioenc",
                i + "_gdp_user_key_gioenc",
                i + "_gdp_gio_id_gioenc",
                i + "_gdp_sequence_ids",
                i + "_gdp_session_id_sent",
              ].forEach((t) => {
                const i = n.getItem(t);
                n.hasItem(t) && (e.setItem(t, i), n.removeItem(t));
              }),
                (n = void 0);
            }
          })(t, ye, o),
        t
      );
    };
  var Te = "OPTION_INITIALIZED",
    Ne = "SDK_INITIALIZED",
    Ce = "SESSIONID_UPDATE",
    Pe = "SET_USERID",
    Le = "SET_USERKEY",
    xe = {
      name: "gioCompress",
      method: class {
        constructor(e) {
          (this.growingIO = e),
            (this._compress = (e, t, i) => {
              if (null === e) return "";
              let n,
                r,
                s,
                o = {},
                a = {},
                d = "",
                c = "",
                u = "",
                l = 2,
                h = 3,
                g = 2,
                p = [],
                m = 0,
                f = 0;
              for (s = 0; s < e.length; s += 1)
                if (
                  ((d = e.charAt(s)),
                  {}.hasOwnProperty.call(o, d) || ((o[d] = h++), (a[d] = !0)),
                  (c = u + d),
                  {}.hasOwnProperty.call(o, c))
                )
                  u = c;
                else {
                  if ({}.hasOwnProperty.call(a, u)) {
                    if (256 > u.charCodeAt(0)) {
                      for (n = 0; g > n; n++)
                        (m <<= 1),
                          f === t - 1 ? ((f = 0), p.push(i(m)), (m = 0)) : f++;
                      for (r = u.charCodeAt(0), n = 0; 8 > n; n++)
                        (m = (m << 1) | (1 & r)),
                          f === t - 1 ? ((f = 0), p.push(i(m)), (m = 0)) : f++,
                          (r >>= 1);
                    } else {
                      for (r = 1, n = 0; g > n; n++)
                        (m = (m << 1) | r),
                          f === t - 1 ? ((f = 0), p.push(i(m)), (m = 0)) : f++,
                          (r = 0);
                      for (r = u.charCodeAt(0), n = 0; 16 > n; n++)
                        (m = (m << 1) | (1 & r)),
                          f === t - 1 ? ((f = 0), p.push(i(m)), (m = 0)) : f++,
                          (r >>= 1);
                    }
                    l--, 0 === l && ((l = Math.pow(2, g)), g++), delete a[u];
                  } else
                    for (r = o[u], n = 0; g > n; n++)
                      (m = (m << 1) | (1 & r)),
                        f === t - 1 ? ((f = 0), p.push(i(m)), (m = 0)) : f++,
                        (r >>= 1);
                  l--,
                    0 === l && ((l = Math.pow(2, g)), g++),
                    (o[c] = h++),
                    (u = d + "");
                }
              if ("" !== u) {
                if ({}.hasOwnProperty.call(a, u)) {
                  if (256 > u.charCodeAt(0)) {
                    for (n = 0; g > n; n++)
                      (m <<= 1),
                        f === t - 1 ? ((f = 0), p.push(i(m)), (m = 0)) : f++;
                    for (r = u.charCodeAt(0), n = 0; 8 > n; n++)
                      (m = (m << 1) | (1 & r)),
                        f === t - 1 ? ((f = 0), p.push(i(m)), (m = 0)) : f++,
                        (r >>= 1);
                  } else {
                    for (r = 1, n = 0; g > n; n++)
                      (m = (m << 1) | r),
                        f === t - 1 ? ((f = 0), p.push(i(m)), (m = 0)) : f++,
                        (r = 0);
                    for (r = u.charCodeAt(0), n = 0; 16 > n; n++)
                      (m = (m << 1) | (1 & r)),
                        f === t - 1 ? ((f = 0), p.push(i(m)), (m = 0)) : f++,
                        (r >>= 1);
                  }
                  l--, 0 === l && ((l = Math.pow(2, g)), g++), delete a[u];
                } else
                  for (r = o[u], n = 0; g > n; n++)
                    (m = (m << 1) | (1 & r)),
                      f === t - 1 ? ((f = 0), p.push(i(m)), (m = 0)) : f++,
                      (r >>= 1);
                l--, 0 === l && ((l = Math.pow(2, g)), g++);
              }
              for (r = 2, n = 0; g > n; n++)
                (m = (m << 1) | (1 & r)),
                  f === t - 1 ? ((f = 0), p.push(i(m)), (m = 0)) : f++,
                  (r >>= 1);
              for (;;) {
                if (((m <<= 1), f === t - 1)) {
                  p.push(i(m));
                  break;
                }
                f++;
              }
              return p.join("");
            }),
            (this.compress = (e) => {
              const t = this;
              return this._compress(e, 16, function (e) {
                return t.f(e);
              });
            }),
            (this.compressToUTF16 = (e) => {
              const t = this;
              return null === e
                ? ""
                : this._compress(e, 15, function (e) {
                    return t.f(e + 32);
                  }) + " ";
            }),
            (this.compressToUint8Array = (e) => {
              const t = this.compress(e),
                i = new Uint8Array(2 * t.length);
              for (let e = 0, n = t.length; n > e; e++) {
                const n = t.charCodeAt(e);
                (i[2 * e] = n >>> 8), (i[2 * e + 1] = n % 256);
              }
              return i;
            }),
            (this.compressToEncodedURIComponent = (e) => {
              if (null === e) return "";
              const t = this;
              return this._compress(e, 6, function (e) {
                return t.keyStrUriSafe.charAt(e);
              });
            }),
            (this.f = String.fromCharCode),
            (this.keyStrUriSafe =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$");
        }
      },
    },
    Ae = {
      name: "gioCustomTracking",
      method: class {
        constructor(e) {
          (this.growingIO = e),
            (this.getValidResourceItem = (e) => {
              if (e && O(e) && e.id && e.key) {
                const t = {
                  id: I(e.id) ? e.id : j(e.id),
                  key: I(e.key) ? e.key : j(e.key),
                };
                return e.attributes && (t.attributes = e.attributes), t;
              }
            }),
            (this.getDynamicAttributes = (e) => (
              v(e) ||
                K(e).forEach((t) => {
                  _(e[t])
                    ? (e[t] = e[t]())
                    : O(e[t])
                    ? W(e, t)
                    : S(e[t]) || (e[t] = j(e[t]));
                }),
              e
            )),
            (this.buildCustomEvent = (e, t, i, n) => {
              ee(e, () => {
                const {
                  dataStore: {
                    eventContextBuilder: r,
                    eventConverter: s,
                    currentPage: o,
                  },
                } = this.growingIO;
                let a = Object.assign(
                  {
                    eventType: "CUSTOM",
                    eventName: e,
                    pageShowTimestamp: null == o ? void 0 : o.time,
                    attributes: Z(
                      this.getDynamicAttributes(O(t) && !$(t) ? t : void 0)
                    ),
                    resourceItem: Z(this.getValidResourceItem(i)),
                  },
                  r()
                );
                $(n) || (a = Object.assign(Object.assign({}, a), n)), s(a);
              });
            }),
            (this.buildUserAttributesEvent = (e, t) => {
              const {
                dataStore: { eventContextBuilder: i, eventConverter: n },
              } = this.growingIO;
              let r = Object.assign(
                { eventType: "LOGIN_USER_ATTRIBUTES", attributes: Z(e) },
                i()
              );
              $(t) || (r = Object.assign(Object.assign({}, r), t)), n(r);
            });
        }
      },
    },
    De = {},
    Re = {}.hasOwnProperty;
  function ke(e) {
    try {
      return decodeURIComponent(e.replace(/\+/g, " "));
    } catch (e) {
      return null;
    }
  }
  function je(e) {
    try {
      return encodeURIComponent(e);
    } catch (e) {
      return null;
    }
  }
  (De.stringify = function (e, t) {
    t = t || "";
    var i,
      n,
      r = [];
    for (n in ("string" != typeof t && (t = "?"), e))
      if (Re.call(e, n)) {
        if (
          ((i = e[n]) || (null != i && !isNaN(i)) || (i = ""),
          (n = je(n)),
          (i = je(i)),
          null === n || null === i)
        )
          continue;
        r.push(n + "=" + i);
      }
    return r.length ? t + r.join("&") : "";
  }),
    (De.parse = function (e) {
      for (var t, i = /([^=?#&]+)=?([^&]*)/g, n = {}; (t = i.exec(e)); ) {
        var r = ke(t[1]),
          s = ke(t[2]);
        null === r || null === s || r in n || (n[r] = s);
      }
      return n;
    });
  const Ue = {
      gioprojectid: "projectId",
      giodatacollect: "dataCollect",
      gioappid: "domain",
      giodatasourceid: "dataSourceId",
      gios: "sessionId",
      giou: "uid",
      giocs1: "userId",
      gioid: "gioId",
      giouserkey: "userKey",
      gioappchannel: "appChannel",
      giodevicebrand: "deviceBrand",
      giodevicemodel: "deviceModel",
      giodevicetype: "deviceType",
      giolanguage: "language",
      gionetworkstate: "networkState",
      giooperatingsystem: "operatingSystem",
      gioplatform: "platform",
      gioplatformversion: "platformVersion",
      gioscreenheight: "screenHeight",
      gioscreenwidth: "screenWidth",
    },
    qe = [
      "giodatasourceid",
      "gioplatform",
      "gioappchannel",
      "giodevicebrand",
      "giodevicemodel",
      "giodevicetype",
      "giolanguage",
      "gionetworkstate",
      "giooperatingsystem",
      "gioplatformversion",
      "gioscreenheight",
      "gioscreenwidth",
    ],
    Ge = ["giocs1", "gios", "giou", "gioid", "giouserkey"],
    He = "gio_search_cookie_gioenc";
  var Be = {
      name: "gioEmbeddedAdapter",
      method: class {
        constructor(e) {
          (this.growingIO = e),
            (this.main = () => {
              var e;
              const { projectId: t, appId: i } = this.growingIO.vdsConfig,
                n = this.getGQS();
              let r = !1;
              return (
                "none" !== this.qsFrom &&
                  n.gioprojectid === t &&
                  n.gioappid === i &&
                  ($(n)
                    ? this.growingIO.storage.removeItem(He)
                    : this.growingIO.storage.setItem(He, De.stringify(n)),
                  M(n, "giodatacollect") &&
                    (this.growingIO.vdsConfig.dataCollect = R(
                      ["true", !0],
                      n.giodatacollect
                    )),
                  null === (e = this.growingIO.emitter) ||
                    void 0 === e ||
                    e.on("SDK_INITIALIZED", () => {
                      const {
                        userStore: e,
                        vdsConfig: { sessionExpires: t },
                        dataStore: { eventContextBuilderInst: i },
                      } = this.growingIO;
                      Ge.forEach((t) => {
                        var i;
                        e[Ue[t]] = null !== (i = n[t]) && void 0 !== i ? i : "";
                      }),
                        window.setInterval(() => {
                          e.sessionId = n.gios;
                        }, 0.8 * t * 60 * 1e3),
                        qe.forEach((e) => {
                          M(n, e) && (i.minpExtraParams[Ue[e]] = n[e]);
                        });
                    }),
                  (this.growingIO.setUserId = () => {}),
                  (this.growingIO.clearUserId = () => {}),
                  M(n, "giodatacollect") &&
                    ((this.growingIO.setDataCollect = () => {}),
                    (this.growingIO.setOption = () => {})),
                  (r = !0)),
                this.gioURLRewrite(),
                r
              );
            }),
            (this.getGQS = () => {
              const { hashtag: e } = this.growingIO.vdsConfig,
                t = this.growingIO.storage.getItem(He),
                i = window.location.search,
                n = window.location.hash,
                r = e ? n.substring(n.indexOf("?") + 1) : "",
                s = De.parse(i),
                o = De.parse(r),
                a = De.parse((t || "").replace("gioenc-", ""));
              let d = {};
              if (M(s, "gioprojectid")) (d = s), (this.qsFrom = "search");
              else if (M(o, "gioprojectid")) (d = o), (this.qsFrom = "hash");
              else {
                if (!M(a, "gioprojectid")) return (this.qsFrom = "none"), {};
                (d = a), (this.qsFrom = "cookie");
              }
              const c = {},
                u = {},
                l = [
                  "gioappid",
                  "gioprojectid",
                  "giodatacollect",
                  ...Ge,
                  ...qe,
                ];
              return (
                K(d).forEach((e) => {
                  const t = e.toLowerCase();
                  R(l, t)
                    ? R(["", "undefined", "null", void 0, null], d[e]) ||
                      ((c[t] = d[e]),
                      R(["true", "TRUE", !0], d[e]) && (c[t] = !0),
                      R(["false", "FALSE", !1], d[e]) && (c[t] = !1))
                    : (u[e] = d[e]);
                }),
                (this.gqs = c),
                (this.ngqs = u),
                c
              );
            }),
            (this.gioURLRewrite = () => {
              const { hashtag: e } = this.growingIO.vdsConfig;
              let t = window.location.search,
                i = window.location.hash,
                n = !1;
              if (
                ("search" === this.qsFrom &&
                  ((t = De.stringify(this.ngqs, !0)), (n = !0)),
                e &&
                  "hash" === this.qsFrom &&
                  ((i = `${i.split("?")[0]}${De.stringify(this.ngqs, !0)}`),
                  (n = !0)),
                n)
              ) {
                const e = `${window.location.pathname}${t || ""}${i || ""}`;
                window.history.replaceState(null, document.title, e);
              }
            }),
            (this.gqs = {}),
            (this.ngqs = {}),
            (this.qsFrom = "search"),
            this.growingIO.emitter.on(Te, () => {
              this.growingIO.useEmbeddedInherit = this.main();
            });
        }
      },
    },
    Me = {},
    Ke = {};
  !(function (e) {
    var t =
      (m && m.__spreadArray) ||
      function (e, t, i) {
        if (i || 2 === arguments.length)
          for (var n, r = 0, s = t.length; s > r; r++)
            (!n && r in t) ||
              (n || (n = [].slice.call(t, 0, r)), (n[r] = t[r]));
        return e.concat(n || [].slice.call(t));
      };
    Object.defineProperty(e, "__esModule", { value: !0 }),
      (e.GROWING_TITLE_OLD =
        e.GROWING_TITLE =
        e.GROWING_GTITLE =
        e.GROWING_CDP_INDEX =
        e.GROWING_INDEX_OLD =
        e.GROWING_INDEX =
        e.GROWING_CONTAINER =
        e.GROWING_TRACK =
        e.GROWING_IGNORE =
        e.VALID_CLASS_SELECTOR =
        e.VALID_ID_SELECTOR =
        e.INVALID_NUMERIC_RE =
        e.INVALID_CAMELCASE_RE =
        e.EXCLUDE_CLASS_RE =
        e.UNSUPPORTED_TAGS =
        e.TEXT_NODE =
        e.UNSUPPORTED_CLICK_TAGS =
        e.SUPPORTED_ICON_TAGS =
        e.SUPPORTED_CHANGE_TYPES =
        e.SUPPORTED_CLICK_INPUT_TYPES =
        e.SUPPORTED_CONTAINER_TAGS =
        e.LIST_TAGS =
          void 0),
      (e.LIST_TAGS = ["TR", "LI", "DL"]),
      (e.SUPPORTED_CONTAINER_TAGS = t(["A", "BUTTON"], e.LIST_TAGS, !0)),
      (e.SUPPORTED_CLICK_INPUT_TYPES = ["button", "submit", "reset"]),
      (e.SUPPORTED_CHANGE_TYPES = ["radio", "checkbox", "search"]),
      (e.SUPPORTED_ICON_TAGS = ["I", "EM", "svg", "IMG"]),
      (e.UNSUPPORTED_CLICK_TAGS = ["TEXTAREA", "HTML", "BODY"]),
      (e.TEXT_NODE = ["I", "SPAN", "EM", "B", "STRONG"]),
      (e.UNSUPPORTED_TAGS = [
        "tspan",
        "text",
        "g",
        "rect",
        "path",
        "defs",
        "clippath",
        "desc",
        "title",
        "math",
        "use",
      ]),
      (e.EXCLUDE_CLASS_RE =
        /(^| |[^ ]+\-)(clear|clearfix|active|hover|enabled|current|selected|unselected|hidden|display|focus|disabled|undisabled|open|checked|unchecked|undefined|null|ng-|growing-)[^\. ]*/g),
      (e.INVALID_CAMELCASE_RE = /[a-z][A-Z][a-z][A-Z]/),
      (e.INVALID_NUMERIC_RE = /[0-9][0-9][0-9][0-9]/),
      (e.VALID_ID_SELECTOR = /^[a-zA-Z-\_][a-zA-Z\-\_0-9]+$/),
      (e.VALID_CLASS_SELECTOR = /^([a-zA-Z\-\_0-9]+)$/),
      (e.GROWING_IGNORE = "data-growing-ignore"),
      (e.GROWING_TRACK = "data-growing-track"),
      (e.GROWING_CONTAINER = "data-growing-container"),
      (e.GROWING_INDEX = "data-growing-index"),
      (e.GROWING_INDEX_OLD = "data-growing-idx"),
      (e.GROWING_CDP_INDEX = "data-index"),
      (e.GROWING_GTITLE = "data-growing-title"),
      (e.GROWING_TITLE = "data-title"),
      (e.GROWING_TITLE_OLD = "growing-title");
  })(Ke);
  var Fe = {},
    Ve = {};
  Object.defineProperty(Ve, "__esModule", { value: !0 }),
    (Ve.lastFindIndex =
      Ve.findIndex =
      Ve.arrayEquals =
      Ve.rmBlank =
      Ve.normalizePath =
      Ve.splitNoEmpty =
      Ve.filterText =
        void 0);
  var We = /\s+/g;
  (Ve.filterText = function (e, t) {
    if ((void 0 === t && (t = !0), !e)) return "";
    var i = e.replace(We, " ").trim();
    return t && i.length > 50 ? i.slice(0, 50) : i;
  }),
    (Ve.splitNoEmpty = function (e, t) {
      return e
        ? e.split(t).filter(function (e) {
            return !!e;
          })
        : [];
    }),
    (Ve.normalizePath = function (e) {
      return e.replace(/\/+$/g, "") || "/";
    }),
    (Ve.rmBlank = function (e) {
      return e ? e.replace(/[\n \t]+/g, "") : "";
    }),
    (Ve.arrayEquals = function (e, t) {
      return (
        !!e &&
        !!t &&
        e.length === t.length &&
        e.every(function (e, i) {
          return e === t[i];
        })
      );
    }),
    (Ve.findIndex = function (e, t) {
      if (!Array.isArray(e) || "function" != typeof t) return -1;
      for (var i = 0; i < e.length; i++) if (t(e[i])) return i;
      return -1;
    }),
    (Ve.lastFindIndex = function (e, t) {
      if (null == e || "function" != typeof t) return -1;
      for (var i = e.length - 1; i >= 0; i--) if (t(e[i])) return i;
      return -1;
    }),
    (function (e) {
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.removeDiffTagOnHeadAndTail =
          e.computeXpath =
          e.getMarkIndex =
          e.getEffectiveNode =
          e.isIgnore =
          e.depthInside =
          e.changeableInput =
          e.clickableInput =
          e.onlyContainsTextChildren =
          e.onlyContainsIconChildren =
          e.supportIconTag =
          e.isContainerTag =
          e.isListTag =
          e.isParentOfLeaf =
          e.isLeaf =
          e.getChildren =
          e.getDeepChildren =
          e.findParent =
          e.isRootNode =
          e.hasValidAttribute =
          e.arrayFrom =
            void 0);
      var t = Ve,
        i = Ke;
      (e.arrayFrom = function (e) {
        return [].slice.call(e);
      }),
        (e.hasValidAttribute = function (e, t) {
          if (!(e instanceof Element)) return !1;
          var i = e.getAttribute(t);
          return null !== i && "false" !== i;
        }),
        (e.isRootNode = function (e) {
          return !e || ["BODY", "HTML", "#document"].includes(e.nodeName);
        }),
        (e.findParent = function (t, i) {
          for (var n = t.parentNode; n && !(0, e.isRootNode)(n); ) {
            if (i(n)) return n;
            n = n.parentNode;
          }
        }),
        (e.getDeepChildren = function (t) {
          var i = [],
            n = [],
            r = (0, e.getChildren)(t);
          n.push.apply(n, r);
          for (var s = 0; s < n.length; ) {
            var o = n[s++];
            i.push(o), n.push.apply(n, (0, e.getChildren)(o));
          }
          return i;
        }),
        (e.getChildren = function (t) {
          try {
            return (null == t ? void 0 : t.childNodes)
              ? (0, e.arrayFrom)(t.childNodes).filter(function (e) {
                  return e.nodeType === Node.ELEMENT_NODE;
                })
              : [];
          } catch (e) {
            return [];
          }
        }),
        (e.isLeaf = function (t) {
          return (
            !t.hasChildNodes() ||
            "svg" === t.nodeName ||
            0 === (0, e.getChildren)(t).length
          );
        }),
        (e.isParentOfLeaf = function (t) {
          return (
            !(!t.hasChildNodes() || "svg" === t.nodeName) &&
            0 ===
              (0, e.arrayFrom)(t.childNodes).filter(function (t) {
                return !(0, e.isLeaf)(t);
              }).length
          );
        }),
        (e.isListTag = function (e) {
          return i.LIST_TAGS.includes(e.nodeName);
        }),
        (e.isContainerTag = function (t) {
          return (
            (0, e.hasValidAttribute)(t, i.GROWING_CONTAINER) ||
            i.SUPPORTED_CONTAINER_TAGS.includes(t.nodeName)
          );
        }),
        (e.supportIconTag = function (e) {
          return i.SUPPORTED_ICON_TAGS.includes(e.nodeName);
        }),
        (e.onlyContainsIconChildren = function (t) {
          if (t.textContent) return !1;
          var i = (0, e.getChildren)(t);
          if (0 === i.length) return !1;
          for (var n = 0, r = i; n < r.length; n++) {
            var s = r[n];
            if (!(0, e.supportIconTag)(s) && "SPAN" !== s.nodeName) return !1;
          }
          return !0;
        }),
        (e.onlyContainsTextChildren = function (t) {
          return (
            0 !== (0, e.getChildren)(t).length &&
            !(0, e.getDeepChildren)(t)
              .map(function (e) {
                return e.tagName;
              })
              .some(function (e) {
                return !i.TEXT_NODE.includes(e);
              })
          );
        }),
        (e.clickableInput = function (e) {
          return (
            e instanceof HTMLInputElement &&
            i.SUPPORTED_CLICK_INPUT_TYPES.includes(e.type)
          );
        }),
        (e.changeableInput = function (e) {
          return (
            e instanceof HTMLInputElement &&
            i.SUPPORTED_CHANGE_TYPES.includes(e.type)
          );
        }),
        (e.depthInside = function (t, i, n) {
          if ((void 0 === i && (i = 4), void 0 === n && (n = 1), n > i))
            return !1;
          for (
            var r = "svg" === t.tagName ? [] : (0, e.getChildren)(t), s = 0;
            s < r.length;
            s++
          ) {
            var o = r[s];
            if (!(0, e.depthInside)(o, i, n + 1)) return !1;
          }
          return i >= n;
        }),
        (e.isIgnore = function (t) {
          if (
            !(t instanceof Element) ||
            (0, e.hasValidAttribute)(t, i.GROWING_IGNORE)
          )
            return !0;
          for (var n = t.parentNode; n && !(0, e.isRootNode)(n); ) {
            if ((0, e.hasValidAttribute)(n, i.GROWING_IGNORE)) return !0;
            n = n.parentNode;
          }
          return !1;
        }),
        (e.getEffectiveNode = function (t) {
          for (
            var n = function (e) {
              return (
                e instanceof Element &&
                !i.UNSUPPORTED_TAGS.includes(
                  ((t = e),
                  null === (n = t.tagName) || void 0 === n
                    ? void 0
                    : n.toLowerCase())
                )
              );
              var t, n;
            };
            t && !n(t) && t.parentNode;

          )
            t = t.parentNode;
          var r,
            s = t.parentNode;
          return !(0, e.isRootNode)(s) &&
            ((0, e.onlyContainsIconChildren)(s) ||
              ("BUTTON" === (r = s).tagName &&
                (0, e.onlyContainsTextChildren)(r)))
            ? s
            : t;
        }),
        (e.getMarkIndex = function (e) {
          if (e instanceof Element)
            for (
              var t = 0,
                n = [i.GROWING_INDEX, i.GROWING_INDEX_OLD, i.GROWING_CDP_INDEX];
              n.length > t;
              t++
            ) {
              var r = n[t],
                s = e.getAttribute(r);
              if (null !== s) {
                if (/^\d{1,10}$/.test(s)) {
                  var o = Number(s);
                  if (o >= 0 && 2147483647 > o) return o;
                }
                window.console.error(
                  "[GioNode]：标记的index不符合规范（index必须是大于等于0且小于2147483647的整数字）。",
                  s
                );
                break;
              }
            }
        }),
        (e.computeXpath = function (e) {
          if (!e) return console.error("Invalid target node"), ["", "", ""];
          for (
            var t = e.parentPaths(!0),
              i = Math.min(t.length, +(t.length >= 10) + 4),
              n = ["", "", ""],
              r = 0;
            r < t.length;
            r++
          ) {
            var s = t[r].path,
              o = t[r].name;
            (n[0] = s + n[0]),
              (n[2] = "/".concat(o) + n[2]),
              i > r && (n[1] = s + n[1]);
          }
          return n;
        }),
        (e.removeDiffTagOnHeadAndTail = function (e, i) {
          var n = function (e) {
              return e.nodeName === i.nodeName;
            },
            r = (0, t.findIndex)(e, n);
          if (-1 === r) return [];
          var s = (0, t.lastFindIndex)(e, n);
          return -1 === s ? [] : e.slice(r, s + 1);
        });
    })(Fe);
  var $e = {},
    Xe = {};
  Object.defineProperty(Xe, "__esModule", { value: !0 });
  var ze = Ke,
    Je = Ve,
    Qe = Fe;
  function Ze(e) {
    var t;
    if (!(e instanceof Element)) return null;
    var i = null === (t = e.id) || void 0 === t ? void 0 : t.trim();
    return i && ze.VALID_ID_SELECTOR.test(i) ? i : null;
  }
  function Ye(e) {
    var t;
    if (!(e instanceof Element)) return [];
    var i = e.getAttribute("name");
    if (i) return [i];
    if (e.hasAttribute("class")) {
      var n =
        null === (t = e.getAttribute("class")) || void 0 === t
          ? void 0
          : t.replace(ze.EXCLUDE_CLASS_RE, "").trim();
      if (null == n ? void 0 : n.length)
        return n
          .split(/\s+/)
          .filter(function (e) {
            return (
              ze.VALID_CLASS_SELECTOR.test(e) &&
              !ze.INVALID_CAMELCASE_RE.test(e) &&
              !ze.INVALID_NUMERIC_RE.test(e)
            );
          })
          .sort();
    }
    return [];
  }
  var et = (function () {
    function e(e) {
      (this._parent = null),
        (this.node = e),
        (this.tagName = this.node.nodeName),
        (this.name = this.tagName.toLowerCase()),
        (this.id = Ze(this.node)),
        (this.classList = Ye(this.node)),
        this.guessListAndIndex();
    }
    return (
      (e.prototype.guessListAndIndex = function () {
        var e,
          t = this;
        this._tagList = (0, Qe.isListTag)(this.node);
        var i = (0, Qe.getChildren)(this.node.parentNode),
          n = (0, Qe.removeDiffTagOnHeadAndTail)(i, this.node),
          r = n.length;
        if (this._tagList) {
          var s = n
            .filter(function (e) {
              return e.tagName === t.tagName;
            })
            .indexOf(this.node);
          -1 !== s && (this._index = s + 1);
        }
        if (
          n.length >= 3 &&
          (null === (e = this.classList) || void 0 === e ? void 0 : e.length)
        ) {
          var o,
            a = 0,
            d = this.tagName,
            c = -1;
          for (s = 1; r > s; s++) {
            var u = n[s - 1];
            if (u instanceof Element) {
              if (u.tagName !== d) {
                a = 0;
                break;
              }
              var l = Ye(u);
              (0, Je.arrayEquals)(this.classList, l) && a++,
                this.node === u && (c = s);
            }
          }
          (o = c),
            3 > a ||
              ((this._pseudoList = !0), (this._index = this._index || o));
        }
      }),
      Object.defineProperty(e.prototype, "path", {
        get: function () {
          var e;
          return (
            this._path ||
              ((this._path = "/".concat(this.name)),
              this.id && (this._path += "#".concat(this.id)),
              (null === (e = this.classList) || void 0 === e
                ? void 0
                : e.length) &&
                (this._path += ".".concat(this.classList.join(".")))),
            this._path
          );
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "pseudoList", {
        get: function () {
          return !!this._pseudoList;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "list", {
        get: function () {
          return !!this._tagList || !!this._pseudoList;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "index", {
        get: function () {
          var e;
          return null !== (e = (0, Qe.getMarkIndex)(this.node)) && void 0 !== e
            ? e
            : this._index;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "container", {
        get: function () {
          return (0, Qe.isContainerTag)(this.node) || this.list;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "parent", {
        get: function () {
          var t;
          if (
            !(null === (t = this.node) || void 0 === t ? void 0 : t.parentNode)
          )
            return null;
          var i = this.node.parentNode,
            n = e._parentCache.get(i),
            r = Ze(i),
            s = Ye(i);
          return (
            (!n || n.id !== r || !(0, Je.arrayEquals)(n.classList, s)) &&
              ((n = new e(i)), e._parentCache.set(i, n)),
            (this._parent = n),
            this._parent
          );
        },
        enumerable: !1,
        configurable: !0,
      }),
      (e.prototype.parentPaths = function (e) {
        void 0 === e && (e = !1);
        for (
          var t = e ? [this] : [], i = this.parent;
          i && !(0, Qe.isRootNode)(i.node);

        )
          t.push(i), (i = i.parent);
        return t;
      }),
      (e._parentCache = new WeakMap()),
      e
    );
  })();
  Xe.default = et;
  var tt = {};
  Object.defineProperty(tt, "__esModule", { value: !0 }),
    (tt.getElementHref = tt.getImgHref = tt.getAnchorHref = void 0);
  var it = Ve;
  function nt(e) {
    if (e.hasAttribute("href")) {
      var t = e.getAttribute("href");
      if (t && 0 !== t.indexOf("javascript"))
        return (0, it.normalizePath)(t.slice(0, 320));
    }
  }
  function rt(e) {
    if (e.src && -1 === e.src.indexOf("data:image")) return e.src;
  }
  (tt.getAnchorHref = nt),
    (tt.getImgHref = rt),
    (tt.getElementHref = function (e) {
      var t = e;
      if (t)
        switch (e.nodeName.toLowerCase()) {
          case "a":
            return nt(t);
          case "img":
            return rt(t);
        }
    });
  var st = {},
    ot =
      (m && m.__importDefault) ||
      function (e) {
        return e && e.__esModule ? e : { default: e };
      };
  Object.defineProperty(st, "__esModule", { value: !0 }),
    (st.getElementContent = st.getFormContent = void 0);
  var at = Fe,
    dt = tt,
    ct = Ke,
    ut = ot(Xe),
    lt = Ve,
    ht = function (e) {
      return e.htmlFor || e.getAttribute("for");
    };
  function gt(e) {
    var t = e.node;
    return e.list ? pt(t) : (0, lt.filterText)(t.textContent) || void 0;
  }
  function pt(e) {
    for (
      var t, i = !1, n = 0, r = (0, at.arrayFrom)(e.childNodes);
      n < r.length;
      n++
    ) {
      var s = r[n];
      if (s.nodeType === Node.TEXT_NODE) {
        var o = (0, lt.filterText)(s.textContent);
        if (o) return o;
      }
      if (
        s.nodeType === Node.ELEMENT_NODE &&
        -1 === ["INPUT", "SELECT"].indexOf(s.nodeName)
      ) {
        if (new ut.default(s).pseudoList) return;
        i = (0, at.onlyContainsIconChildren)(s) || (0, at.supportIconTag)(s);
        var a = ft(s);
        if (i) (t = a), (i = !1);
        else if ((a || (a = pt(s)), a)) return a;
      }
    }
    return t;
  }
  function mt(e) {
    for (
      var t = e.getElementsByTagName("input"), i = 0, n = (0, at.arrayFrom)(t);
      i < n.length;
      i++
    ) {
      var r = n[i];
      if (
        ("search" === r.type ||
          ("text" === r.type &&
            ("q" === r.id ||
              -1 !== r.id.indexOf("search") ||
              "q" === r.name ||
              -1 !== r.name.indexOf("search")))) &&
        !(0, at.isIgnore)(r)
      ) {
        var s = ft(r);
        if (s) return s;
      }
    }
  }
  function ft(e) {
    return (
      (function (e) {
        var t = e;
        if (t) {
          var i = (function (e) {
            var t =
              e.getAttribute(ct.GROWING_GTITLE) ||
              e.getAttribute(ct.GROWING_TITLE) ||
              e.getAttribute(ct.GROWING_TITLE_OLD) ||
              e.getAttribute("title");
            return null == t ? void 0 : t.trim();
          })(t);
          if (i) return i;
          var n,
            r,
            s,
            o = new ut.default(e);
          switch (e.nodeName.toLowerCase()) {
            case "a":
              return (function (e) {
                if (
                  ((0, at.isLeaf)(e) || (0, at.onlyContainsIconChildren)(e)) &&
                  e.textContent
                ) {
                  var t = (0, lt.filterText)(e.textContent);
                  if (t) return t;
                }
                var i = (0, dt.getAnchorHref)(e);
                if (i) {
                  var n = i.indexOf("?");
                  return n > -1 ? i.slice(0, n) : i;
                }
              })(t);
            case "svg":
              return (function (e) {
                for (
                  var t = 0, i = (0, at.arrayFrom)(e.childNodes);
                  t < i.length;
                  t++
                ) {
                  var n = i[t];
                  if (
                    n.nodeType === Node.ELEMENT_NODE &&
                    "use" === n.tagName.toLowerCase() &&
                    n.hasAttribute("xlink:href")
                  )
                    return n.getAttribute("xlink:href");
                }
              })(t);
            case "button":
              return (
                null === (s = (r = t).name) || void 0 === s ? void 0 : s.length
              )
                ? r.name
                : (0, lt.filterText)(r.textContent) || pt(r);
            case "img":
              return (function (e) {
                if (e.alt) return e.alt;
                var t = (0, dt.getImgHref)(e);
                if (t) {
                  var i = t.split("?")[0].split("/");
                  if (i.length > 0) return i[i.length - 1];
                }
              })(t);
            case "label":
              return gt(o);
            case "input":
              return (function (e) {
                if ((0, at.clickableInput)(e)) return e.value;
                if (
                  "password" !== e.type &&
                  (0, at.hasValidAttribute)(e, ct.GROWING_TRACK)
                )
                  return e.value;
                if ((0, at.changeableInput)(e)) {
                  var t = (0, at.findParent)(e, function (e) {
                    return "LABEL" === e.nodeName;
                  });
                  if (!t && e.id)
                    for (
                      var i = document.body.getElementsByTagName("label"),
                        n = 0;
                      n < i.length;
                      n++
                    ) {
                      var r = i[n];
                      if (ht(r) === e.id) {
                        t = r;
                        break;
                      }
                    }
                  if (t) {
                    var s = gt(new ut.default(t));
                    if (s && s.length > 0) return s + " (" + e.checked + ")";
                  }
                  return e.value;
                }
              })(t);
            case "select":
              return (
                (n = t),
                (0, at.arrayFrom)(n.options)
                  .filter(function (e) {
                    return e.selected;
                  })
                  .map(function (e) {
                    return e.label;
                  })
                  .join(", ") || n.value
              );
            case "form":
              return mt(t);
          }
          return (0, at.isLeaf)(t)
            ? (function (e) {
                var t = (0, lt.filterText)(e.textContent);
                if (t) return t;
              })(t)
            : (0, at.isParentOfLeaf)(t) && !(0, at.onlyContainsIconChildren)(t)
            ? (function (e) {
                for (
                  var t = "", i = 0, n = (0, at.arrayFrom)(e.childNodes);
                  i < n.length;
                  i++
                ) {
                  var r = n[i];
                  t +=
                    (r.nodeType === Node.TEXT_NODE && r.textContent
                      ? r.textContent.trim()
                      : "") + " ";
                }
                return (0, lt.filterText)(t, !1);
              })(t)
            : o.container || (0, at.onlyContainsIconChildren)(e)
            ? pt(t)
            : void 0;
        }
      })(e) || void 0
    );
  }
  (st.getFormContent = mt), (st.getElementContent = ft);
  var vt,
    It =
      (m && m.__extends) ||
      ((vt = function (e, t) {
        return (
          (vt =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (e, t) {
                e.__proto__ = t;
              }) ||
            function (e, t) {
              for (var i in t) ({}.hasOwnProperty.call(t, i) && (e[i] = t[i]));
            }),
          vt(e, t)
        );
      }),
      function (e, t) {
        if ("function" != typeof t && null !== t)
          throw new TypeError(
            "Class extends value " + t + " is not a constructor or null"
          );
        function i() {
          this.constructor = e;
        }
        vt(e, t),
          (e.prototype =
            null === t
              ? Object.create(t)
              : ((i.prototype = t.prototype), new i()));
      }),
    wt =
      (m && m.__importDefault) ||
      function (e) {
        return e && e.__esModule ? e : { default: e };
      };
  Object.defineProperty($e, "__esModule", { value: !0 });
  var yt = wt(Xe),
    bt = tt,
    Ot = st,
    Et = Fe,
    _t = (function (e) {
      function t(t) {
        var i = e.call(this, t) || this;
        i.node = t;
        var n = (0, Et.computeXpath)(i),
          r = n[0],
          s = n[1],
          o = n[2];
        return (i.fullXpath = r), (i.xpath = s), (i.skeleton = o), i;
      }
      return (
        It(t, e),
        Object.defineProperty(t.prototype, "href", {
          get: function () {
            return (0, bt.getElementHref)(this.node);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "content", {
          get: function () {
            return (0, Ot.getElementContent)(this.node);
          },
          enumerable: !1,
          configurable: !0,
        }),
        t
      );
    })(yt.default);
  $e.default = _t;
  var St =
      (m && m.__assign) ||
      function () {
        return (
          (St =
            Object.assign ||
            function (e) {
              for (var t, i = 1, n = arguments.length; n > i; i++)
                for (var r in (t = arguments[i]))
                  ({}.hasOwnProperty.call(t, r) && (e[r] = t[r]));
              return e;
            }),
          St.apply(this, arguments)
        );
      },
    Tt =
      (m && m.__importDefault) ||
      function (e) {
        return e && e.__esModule ? e : { default: e };
      };
  Object.defineProperty(Me, "__esModule", { value: !0 });
  var Nt = Ke,
    Ct = Fe,
    Pt = Tt($e),
    Lt = (function () {
      function e(e, t, i) {
        void 0 === t && (t = null),
          void 0 === i && (i = !0),
          (this.origin = e),
          (this.action = t),
          (this.direct = i),
          (this.target = "self" === t ? e : (0, Ct.getEffectiveNode)(e)),
          (this.ignore = (0, Ct.isIgnore)(this.target)),
          (this.vnode = new Pt.default(this.target)),
          (this.tagName = this.vnode.tagName);
      }
      return (
        Object.defineProperty(e.prototype, "content", {
          get: function () {
            return this.vnode.content;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "href", {
          get: function () {
            return this.vnode.href;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "index", {
          get: function () {
            return this.vnode.index;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype.inferParentIndex = function () {
          var t = this;
          return (
            this.parentIndex ||
              (0, Ct.findParent)(this.target, function (i) {
                var n = new e(i, t.action, !1);
                return !(
                  !n.traceable() ||
                  !n.index ||
                  ((t.parentIndex = n.index), 0)
                );
              }),
            this.parentIndex
          );
        }),
        Object.defineProperty(e.prototype, "xpath", {
          get: function () {
            return this.vnode.xpath;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "fullXpath", {
          get: function () {
            return this.vnode.fullXpath;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "skeleton", {
          get: function () {
            return this.vnode.skeleton;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype.info = function (e) {
          return (
            void 0 === e && (e = !0),
            e && this.inferParentIndex(),
            {
              skeleton: this.skeleton,
              fullXpath: this.fullXpath,
              xpath: this.xpath,
              content: this.content,
              href: this.href,
              index: this.parentIndex || this.index,
            }
          );
        }),
        (e.prototype.traceable = function () {
          if (this.ignore) return !1;
          if (this.direct) {
            if ("click" === this.action || "hover" === this.action) {
              if (-1 !== Nt.UNSUPPORTED_CLICK_TAGS.indexOf(this.target.tagName))
                return !1;
              if (
                "INPUT" === this.target.tagName &&
                !(0, Ct.clickableInput)(this.target)
              )
                return !1;
              if (
                !(0, Ct.isContainerTag)(this.target) &&
                !(0, Ct.depthInside)(this.target, 5)
              )
                return !1;
            }
            return !0;
          }
          return this.vnode.container;
        }),
        (e.prototype.trackNodes = function () {
          if (!this.traceable()) return [];
          var e,
            t = [this];
          if ("submit" !== this.action)
            for (var i = this.parentElement; i; ) {
              if (i.ignore) return [];
              i.traceable() && t.unshift(i), (i = i.parentElement);
            }
          return t.map(function (t) {
            var i = t.info(!1),
              n = i.index;
            return !e && n && (e = n), St(St({}, i), { index: e || n });
          });
        }),
        Object.defineProperty(e.prototype, "parentElement", {
          get: function () {
            var t = this.target.parentElement;
            if (t && !(0, Ct.isRootNode)(t)) return new e(t, this.action, !1);
          },
          enumerable: !1,
          configurable: !0,
        }),
        e
      );
    })(),
    xt = (Me.default = Lt);
  class At {
    constructor(e) {
      this.handler = e;
      const t = navigator.userAgent,
        i = /chrome/i.exec(t),
        n = /android/i.exec(t);
      this.hasTouch = "ontouchstart" in window && !(i && !n);
    }
    main() {
      const e = this.hasTouch ? ["touchstart"] : ["mousedown"],
        t = this.hasTouch
          ? ["touchend", "touchcancel"]
          : ["mouseup", "mouseleave"],
        i = this.hasTouch ? ["touchmove"] : ["mousemove"];
      for (const t of e) Y(window, t, this.touchStartHandler.bind(this));
      for (const e of i) Y(window, e, this.touchMoveHandler.bind(this));
      for (const e of t) Y(window, e, this.touchStopHandler.bind(this));
    }
    touchStartHandler(e) {
      if (e.which > 1) return;
      const t = +Date.now();
      this.safeguard !== t &&
        (this.touchTimeout && clearTimeout(this.touchTimeout),
        (this.safeguard = t),
        (this.touchEvent = {
          time: t,
          target: e.target,
          x: this._page("x", e),
          y: this._page("y", e),
          isTrusted: !0,
          type: "click",
        }));
    }
    touchMoveHandler(e) {
      const t = Math.abs(
          this._page("x", e) - (this.touchEvent && this.touchEvent.x) || 0
        ),
        i = Math.abs(
          this._page("y", e) - (this.touchEvent && this.touchEvent.y) || 0
        );
      (t > 10 || i > 10) && (this.touchEvent = null);
    }
    touchStopHandler(e) {
      const t = +Date.now() - (this.touchEvent && this.touchEvent.time) || 0;
      this.touchEvent && 200 > t
        ? (this.touchTimeout = setTimeout(() => {
            this.handler(this.touchEvent), (this.touchEvent = null);
          }, 200))
        : this.touchEvent &&
          t >= 200 &&
          700 > t &&
          (this.handler(this.touchEvent), (this.touchEvent = null));
    }
    _page(e, t) {
      return (this.hasTouch ? t.touches[0] : t)["page" + e.toUpperCase()];
    }
  }
  var Dt = {
    name: "gioEventAutoTracking",
    method: class {
      constructor(e) {
        (this.growingIO = e),
          (this.main = () => {
            Y(document, "submit", this._handleAction),
              Y(document, "change", this._handleAction);
            const { vdsConfig: e } = this.growingIO;
            e.touch
              ? new At(this._handleAction).main()
              : Y(document, "click", this._handleAction);
          }),
          (this._handleAction = (e, t) => {
            const { vdsConfig: i, emitter: n } = this.growingIO;
            if (!i.autotrack) return !1;
            const r = e.target;
            if (!r) return !1;
            let s = new xt(r, e.type, !0).trackNodes();
            if (("click" !== e.type && (s = $(P(s)) ? [] : [P(s)]), $(s)))
              return !1;
            null == n ||
              n.emit("onComposeBefore", {
                event: t,
                params: null != e ? e : {},
              }),
              s.forEach((t) => {
                const { fullXpath: n, index: r, content: s, href: o } = t;
                if (
                  !G(t.fullXpath || "", "/div#__vconsole") &&
                  !G(t.fullXpath || "", "/div#__giokit") &&
                  (i.debug && console.log("Action：", e.type, Date.now()), n)
                ) {
                  const {
                    dataStore: {
                      eventContextBuilder: t,
                      eventConverter: i,
                      currentPage: a,
                    },
                  } = this.growingIO;
                  i(
                    Object.assign(
                      Object.assign(
                        {
                          eventType: c[e.type],
                          element: [
                            { xpath: n, index: r, textValue: s, hyperlink: o },
                          ],
                        },
                        t()
                      ),
                      { pageShowTimestamp: a.time }
                    )
                  );
                }
              });
          });
      }
    },
  };
  let Rt;
  const kt = [
      "VIEW_CLICK",
      "VIEW_CHANGE",
      "FORM_SUBMIT",
      "PAGE",
      "CUSTOM",
      "LOGIN_USER_ATTRIBUTES",
    ],
    jt = ["LOGIN_USER_ATTRIBUTES"];
  var Ut = {
    name: "gioHybridAdapter",
    method: class {
      constructor(e) {
        (this.growingIO = e),
          (this.penetrateHybrid = !0),
          (this.onOptionsInit = () => {
            const { vdsConfig: e, emitter: t } = this.growingIO;
            b(e.penetrateHybrid) && (this.penetrateHybrid = e.penetrateHybrid),
              this._initHybridBridge() &&
                ((this.onSendBefore = this.sendBeforeListener),
                this.hybridConfig.projectId ===
                  this.growingIO.vdsConfig.projectId &&
                  (this.growingIO.useHybridInherit = !0)),
              this.growingIO.useHybridInherit &&
                (null == t ||
                  t.on(Pe, ({ newUserId: e, oldUserId: t, userKey: i }) => {
                    this.penetrateHybrid &&
                      (!e && t
                        ? i
                          ? this._clearNativeUserIdAndUserKey()
                          : this._clearNativeUserId()
                        : i
                        ? this._setNativeUserIdAndUserKey(j(e), j(i))
                        : this._setNativeUserId(j(e)));
                  }),
                null == t ||
                  t.on(Le, ({ newUserKey: e, oldUserKey: t, userId: i }) => {
                    this.penetrateHybrid &&
                      (!e && t
                        ? this._clearNativeUserIdAndUserKey()
                        : this._setNativeUserIdAndUserKey(j(i), j(e)));
                  }));
          }),
          (this._initHybridBridge = () => {
            var e, t, i;
            let n = !1;
            return (
              (this.hasHybridBridge = !!window.GrowingWebViewJavascriptBridge),
              this.hasHybridBridge
                ? ((null ===
                    (e =
                      null === window || void 0 === window
                        ? void 0
                        : window.GrowingWebViewJavascriptBridge) || void 0 === e
                    ? void 0
                    : e.configuration) ||
                    (window.GrowingWebViewJavascriptBridge.configuration =
                      JSON.parse(
                        window.GrowingWebViewJavascriptBridge.getConfiguration()
                      )),
                  (null ===
                    (t =
                      null === window || void 0 === window
                        ? void 0
                        : window.GrowingWebViewJavascriptBridge) || void 0 === t
                    ? void 0
                    : t.configuration) &&
                    (this.hybridConfig =
                      null ===
                        (i =
                          null === window || void 0 === window
                            ? void 0
                            : window.GrowingWebViewJavascriptBridge) ||
                      void 0 === i
                        ? void 0
                        : i.configuration),
                  (n = !0))
                : Rt.consoleText(
                    "HybridAdapter：当前不存在 WebViewJavascriptBridge，Web模式。",
                    "info"
                  ),
              n
            );
          }),
          (this.sendBeforeListener = ({ requestData: e }) => {
            if (this.hasHybridBridge) {
              const t = this.processAttributes(Object.assign({}, e));
              R(kt, t.eventType) &&
                (R(jt, t.eventType)
                  ? this.penetrateHybrid && this._dispatchEvent(t)
                  : (this.penetrateHybrid || W(t, ["userId", "userKey", "cs1"]),
                    this._dispatchEvent(t)));
            }
          }),
          (this.processAttributes = (e) => (
            F(e, (t, i) => {
              O(t) || S(t)
                ? F(e[i], (t, n) => {
                    O(t) || S(t)
                      ? (e[i][n] = JSON.stringify(t))
                      : (e[i][n] = j(t));
                  })
                : (e[i] = j(t));
            }),
            e
          )),
          (this._setNativeUserId = (e) => {
            Q(() => window.GrowingWebViewJavascriptBridge.setNativeUserId(e));
          }),
          (this._clearNativeUserId = () => {
            Q(() => window.GrowingWebViewJavascriptBridge.clearNativeUserId());
          }),
          (this._setNativeUserIdAndUserKey = (e, t) => {
            Q(() =>
              window.GrowingWebViewJavascriptBridge.setNativeUserIdAndUserKey(
                e,
                t
              )
            );
          }),
          (this._clearNativeUserIdAndUserKey = () => {
            Q(() =>
              window.GrowingWebViewJavascriptBridge.clearNativeUserIdAndUserKey()
            );
          }),
          (this._dispatchEvent = (e) => {
            Q(() => {
              var t;
              return null === (t = window.GrowingWebViewJavascriptBridge) ||
                void 0 === t
                ? void 0
                : t.dispatchEvent(JSON.stringify(e));
            });
          });
        const { emitter: t, utils: i } = this.growingIO;
        (Rt = i), t.on(Te, this.onOptionsInit);
      }
    },
  };
  const qt = ["i", "span", "em", "b", "strong", "svg"];
  var Gt;
  !(function (e) {
    (e[(e.OUTER = 0)] = "OUTER"),
      (e[(e.INNER_COVERED = 1)] = "INNER_COVERED"),
      (e[(e.INNER_SHOW = 2)] = "INNER_SHOW");
  })(Gt || (Gt = {}));
  const Ht = [
      "HR",
      "BR",
      "SCRIPT",
      "NOSCRIPT",
      "STYLE",
      "HEAD",
      "BASE",
      "LINK",
      "META",
      "TITLE",
      "BODY",
      "HTML",
      "TEMPLATE",
      "CODE",
      ...Ke.UNSUPPORTED_CLICK_TAGS,
    ],
    Bt = ["SELECT", "A", "BUTTON", "INPUT", "IMG", "FORM"],
    Mt = (e, t, i) => document.elementFromPoint(t, i) === e;
  class Kt {
    constructor(e, t, i) {
      (this.node = e),
        (this.parentNodeDesc = t),
        (this.devicesInfo = i),
        (this.proxy = new xt(e)),
        (this.tagName = this.node.tagName),
        (this.name = this.tagName.toLowerCase()),
        (this.isIgnore = !!this.node.dataset.growingIgnore),
        (this.isUnSupported = -1 !== Ht.indexOf(this.tagName)),
        (this.rect = this.computeWindowRect());
    }
    info() {
      const e = this.desc();
      e.zLevel += this.devicesInfo.webviewZLevel;
      const t = this.getDeviceRect(this.rect);
      return (
        W(e, "isContainer"),
        Object.assign(Object.assign(Object.assign({}, e), t), {
          parentXPath: this.parentNodeDesc.isContainer
            ? this.parentNodeDesc.xpath
            : void 0,
          href: this.proxy.href,
          content: this.proxy.content,
          nodeType: this.nodeType(),
        })
      );
    }
    nodeType() {
      return "input" !== this.name || Fe.changeableInput(this.node)
        ? this.node.tagName
        : "INPUT_BTN";
    }
    desc() {
      return {
        index: this.parentNodeDesc.index || this.proxy.index,
        zLevel: this.zLevel(),
        xpath: this.proxy.xpath,
        isContainer: this.isDefinedContainer(),
      };
    }
    cssVisible() {
      const e = this.computedStyle();
      return (
        Number(e.opacity) > 0 &&
        "visible" === e.visibility &&
        "none" !== e.display
      );
    }
    viewportStatus() {
      const { top: e, left: t, width: i, height: n } = this.rect,
        { winWidth: r, winHeight: s } = this.devicesInfo;
      if (0 >= i || 0 >= n) return Gt.OUTER;
      const o = this.node;
      return s > e && r > t && i > 0 && n > 0
        ? Mt(o, t + i / 2, e + n / 2) ||
          Mt(o, t + 1, e + 1) ||
          Mt(o, t + i - 1, e + 1) ||
          Mt(o, t + 1, e + n - 1) ||
          Mt(o, t + i - 1, e + n - 1)
          ? Gt.INNER_SHOW
          : Gt.INNER_COVERED
        : Gt.OUTER;
    }
    isCircleable() {
      return (
        this.proxy.target === this.proxy.origin &&
        (!!this.isDefinedContainer() ||
          (!(
            "input" === this.name &&
            this.node instanceof HTMLInputElement &&
            "password" === this.node.type
          ) &&
            (-1 !== Bt.indexOf(this.name) ||
              (Fe.isLeaf(this.node)
                ? !this.isBigBlank()
                : this.hasBackgroundImage() && Fe.depthInside(this.node, 4)))))
      );
    }
    isSimpleContainer() {
      return (
        "select" === this.name ||
        (this.isDefaultContainer() &&
          ((function (e, t) {
            if (0 === e.children.length) return !1;
            for (const i of k(e.children))
              if (-1 === t.indexOf(i.tagName.toLowerCase())) return !1;
            return !0;
          })(this.node, qt) ||
            !this.node.childElementCount))
      );
    }
    isDefinedContainer() {
      var e;
      return v(this.isContainer)
        ? this.isDefaultContainer() ||
            this.isMarkContainer() ||
            (Fe.isParentOfLeaf(this.node) &&
              (!!(null === (e = this.node.innerText) || void 0 === e
                ? void 0
                : e.trim().length) ||
                (function (e) {
                  const t = e.attributes;
                  if (t.length > 0)
                    for (let e = 0; e < t.length; e++) {
                      const i = t[e].value;
                      if (i && "false" !== i) return !0;
                    }
                  return !1;
                })(this.node))) ||
            "select" === this.name
        : !!this.isContainer;
    }
    isDefaultContainer() {
      return (
        -1 !== Ke.SUPPORTED_CONTAINER_TAGS.indexOf(this.tagName) ||
        Fe.clickableInput(this.node)
      );
    }
    isMarkContainer() {
      return (
        this.node.hasAttribute("data-growing-container") ||
        this.node.hasAttribute("growing-container")
      );
    }
    isBigBlank() {
      var e, t;
      const i =
          null !==
            (t =
              null === (e = this.node.innerText) || void 0 === e
                ? void 0
                : e.trim().length) && void 0 !== t
            ? t
            : 0,
        { width: n, height: r } = this.rect,
        { winWidth: s, winHeight: o } = this.devicesInfo;
      return !i && (n > s >> 1 || r > o >> 1);
    }
    hasBackgroundImage() {
      const e = this.computedStyle().backgroundImage;
      return !!e && "none" !== e && e.length > 0;
    }
    zLevel() {
      const e = this.computedStyle(),
        t = e.zIndex;
      if ("auto" !== t) return Number(t || "0") + this.parentNodeDesc.zLevel;
      switch (e.position) {
        case "relative":
          return this.parentNodeDesc.zLevel + 2;
        case "sticky":
          return this.parentNodeDesc.zLevel + 3;
        case "absolute":
          return this.parentNodeDesc.zLevel + 4;
        case "fixed":
          return this.parentNodeDesc.zLevel + 5;
        default:
          return this.parentNodeDesc.zLevel + 1;
      }
    }
    computeWindowRect() {
      if (this.rect) return this.rect;
      const e = this.node.getBoundingClientRect(),
        t = e.top,
        i = e.bottom,
        n = e.left;
      let r = e.right - n,
        s = i - t;
      return (
        0 > t
          ? (s = t + s)
          : t + s > this.devicesInfo.winHeight &&
            (s = this.devicesInfo.winHeight - t),
        0 > n
          ? (r = n + r)
          : n + r > this.devicesInfo.winWidth &&
            (r = this.devicesInfo.winWidth - n),
        (this.rect = { top: t, left: n, width: r, height: s }),
        this.rect
      );
    }
    computedStyle() {
      return window.getComputedStyle(this.node);
    }
    getDeviceRect(e) {
      const { scale: t, webviewTop: i, webviewLeft: n } = this.devicesInfo;
      return {
        top: e.top * t + i,
        left: e.left * t + n,
        width: e.width * t,
        height: e.height * t,
      };
    }
  }
  const Ft = ["DOMContentLoaded", "onreadystatechange"],
    Vt = [
      "scroll",
      "resize",
      "load",
      "beforeunload",
      "popstate",
      "hashchange",
      "pagehide",
      "unload",
    ];
  class Wt {
    constructor(e) {
      (this.growingIO = e), this.addDomChangeListener();
    }
    getDomTree(e, t, i, n, r, s) {
      const o = (function (e, t, i, n, r) {
          const s = document.documentElement.clientWidth;
          return {
            winWidth: s,
            winHeight: document.documentElement.clientHeight,
            scale: i / s,
            webviewTop: t,
            webviewLeft: e,
            webviewWidth: i,
            webviewHeight: n,
            webviewZLevel: r,
          };
        })(e, t, i, n, r),
        a = this.getElementsByParent(
          s || document.body,
          { isContainer: !1, zLevel: 0 },
          o
        ),
        {
          domain: d,
          path: c,
          query: u,
          title: l,
        } = this.growingIO.dataStore.currentPage;
      return { page: { domain: d, path: c, query: u, title: l }, elements: a };
    }
    getElementsByParent(e, t, i) {
      const n = [];
      return (
        [].slice
          .call(e.childNodes, 0)
          .filter((e) => 1 === e.nodeType)
          .forEach((e) => {
            const r = new Kt(e, t, i);
            if (r.cssVisible() && !r.isIgnore) {
              switch (r.viewportStatus()) {
                case Gt.INNER_SHOW:
                  r.isCircleable() && n.push(r.info());
                  break;
                case Gt.INNER_COVERED:
                  r.isDefaultContainer() && n.push(r.info());
              }
              r.isSimpleContainer() ||
                [].push.apply(n, this.getElementsByParent(e, r.desc(), i));
            }
          }),
        n
      );
    }
    addDomChangeListener() {
      let e;
      const t =
        (t = "") =>
        () => {
          var i;
          "beforeunload" === t && e && e.disconnect(),
            null === (i = window.GrowingWebViewJavascriptBridge) ||
              void 0 === i ||
              i.onDomChanged();
        };
      (e = new MutationObserver(t("mutation"))),
        e.observe(document.body, {
          attributes: !0,
          characterData: !0,
          childList: !0,
          subtree: !0,
        }),
        Ft.forEach((e) => {
          Y(document, e, t(e));
        }),
        Vt.forEach((e) => {
          Y(window, e, t(e));
        });
    }
  }
  class $t {
    constructor(e) {
      var t;
      (this.growingIO = e),
        null === (t = this.growingIO.emitter) ||
          void 0 === t ||
          t.on(Ne, () => {
            if (window.GrowingWebViewJavascriptBridge) {
              const e = this;
              window.GrowingWebViewJavascriptBridge.getDomTree = function () {
                if (arguments.length >= 4)
                  return (
                    $t.bindGetDomTree(e.growingIO),
                    $t.domHelper.getDomTree.apply($t.domHelper, arguments)
                  );
              };
            }
          });
    }
    static bindGetDomTree(e) {
      this.domHelper ||
        ((this.domHelper = new Wt(e)),
        (window.GrowingWebViewJavascriptBridge.getDomTree =
          this.domHelper.getDomTree.bind(this.domHelper)));
    }
  }
  var Xt = { name: "gioHybridCircle", method: $t },
    zt = {
      name: "gioImpressionTracking",
      method: class {
        constructor(e) {
          var t;
          (this.growingIO = e),
            (this.documentReady = !1),
            (this.main = (e) => {
              "listener" === e
                ? ((this.documentReady = !0),
                  this.growingIO.gioSDKInitialized &&
                    this.initMutationObserver())
                : "emitter" === e &&
                  this.documentReady &&
                  this.initMutationObserver();
            }),
            (this.initIntersectionObserver = () => {
              this.intersectionObserver = new IntersectionObserver((e) => {
                $(e) ||
                  e.map((e) => {
                    const { dataset: t } = e.target;
                    if (e.intersectionRatio > 0) {
                      const {
                          eventId: e,
                          properties: i,
                          items: n,
                        } = this.getImpressionProperties(t),
                        r = t.id;
                      if (r) {
                        if ("once" === t.gioImpType && M(this.sentImps, r))
                          return;
                        this.sentImps[r] = {
                          eventId: e,
                          properties: i,
                          items: n,
                        };
                      }
                      e && this.growingIO.track(e, i, n);
                    }
                  });
              });
            }),
            (this.initMutationObserver = () => {
              if (this.mutationObserver) return !1;
              const e = document.querySelectorAll("[data-gio-imp-track]");
              k(e).map((e) => {
                var t;
                null === (t = this.intersectionObserver) ||
                  void 0 === t ||
                  t.observe(e);
              }),
                (this.mutationObserver = new MutationObserver((e) =>
                  e.map((e) => {
                    var t;
                    if ("attributes" === e.type) {
                      const { dataset: i } = e.target;
                      if (i.gioImpTrack)
                        return null === (t = this.intersectionObserver) ||
                          void 0 === t
                          ? void 0
                          : t.observe(e.target);
                    }
                  })
                )),
                this.mutationObserver.observe(document.body, {
                  attributes: !0,
                  childList: !0,
                  subtree: !0,
                  attributeOldValue: !0,
                  attributeFilter: [
                    "data-gio-imp-track",
                    "data-gio-imp-attrs",
                    "data-gio-imp-items",
                    /^data-gio-track-[a-z]+$/i,
                  ],
                });
            }),
            (this.getImpressionProperties = (e) => {
              let t = { eventId: void 0, properties: {} };
              if (!(null == e ? void 0 : e.gioImpTrack)) return t;
              if (((t.eventId = e.gioImpTrack), M(e, "gioImpAttrs")))
                (t.properties = Q(() =>
                  O(e.gioImpAttrs) ? e.gioImpAttrs : JSON.parse(e.gioImpAttrs)
                )),
                  (t.items = Q(() =>
                    O(e.gioImpItems) ? e.gioImpItems : JSON.parse(e.gioImpItems)
                  ));
              else {
                const i = /^gioTrack(.+)/;
                for (const n in e) {
                  let r;
                  const s = n.match(i);
                  s &&
                    ((r = q(s[1])), "track" !== r && (t.properties[r] = e[n]));
                }
              }
              return (
                (t.properties = Z(t.properties)),
                (t.items = Z(t.items)),
                (/^\w+$/.test(t.eventId) &&
                  !Number.isInteger(Number(C(t.eventId.split(""))))) ||
                  ((t.eventId = null), (t = {})),
                t
              );
            }),
            (this.sentImps = {}),
            window.ActiveXObject ||
            "ActiveXObject" in window ||
            (navigator.userAgent.indexOf("compatible") > -1 &&
              navigator.userAgent.indexOf("MSIE") > -1) ||
            (navigator.userAgent.indexOf("Trident") > -1 &&
              navigator.userAgent.indexOf("rv:11.0") > -1)
              ? J(
                  "IE浏览器不支持半自动埋点，impressionTracking已自动关闭！",
                  "warn"
                )
              : (this.initIntersectionObserver(),
                Y(
                  document,
                  "readystatechange",
                  () => {
                    R(["interactive", "complete"], document.readyState) &&
                      this.main("listener");
                  },
                  { once: !0 }
                ),
                null === (t = this.growingIO.emitter) ||
                  void 0 === t ||
                  t.on(Ne, () => this.main("emitter")),
                Y(window, "unload", () => {
                  var e, t;
                  null === (e = this.intersectionObserver) ||
                    void 0 === e ||
                    e.disconnect(),
                    null === (t = this.mutationObserver) ||
                      void 0 === t ||
                      t.disconnect();
                }));
        }
      },
    },
    Jt = {
      name: "gioLimiting",
      method: class {
        constructor(e) {
          (this.growingIO = e),
            (this.requestURL = ""),
            (this.status = "0"),
            (this.limitObject = {}),
            (this.defaulFrequency = "300"),
            (this.frequency = ""),
            (this.timer = null),
            (this.getLimitData = () => {
              this.generateURL();
              const e = new XMLHttpRequest();
              (e.timeout = 5e3),
                e.open("POST", this.requestURL, !0),
                e.setRequestHeader(
                  "Content-Type",
                  "application/json;charset=UTF-8"
                ),
                (e.onreadystatechange = function () {
                  if (4 === e.readyState)
                    try {
                      let t;
                      if (200 !== e.status) throw Error("HTTP " + e.status);
                      (t = JSON.parse(e.responseText)),
                        "0" === t.result &&
                          ((this.status = t.status || "0"),
                          (this.frequency =
                            t.frequency || this.defaultFrequency),
                          (this.limitObject = t.type || {}));
                    } catch (e) {
                      J("请求限流配置失败！", "error");
                    } finally {
                      try {
                        if (!this.frequency || 0 >= parseInt(this.frequency))
                          return;
                        this.timer && clearTimeout(this.timer),
                          (this.timer = setTimeout(() => {
                            this.getLimitData();
                          }, 1e3 * parseInt(this.frequency)));
                      } catch (e) {
                        J("限流定时器异常！", "error");
                      }
                    }
                }.bind(this)),
                (e.ontimeout = () => {
                  J("请求超时！", "error");
                  try {
                    if (!this.frequency || 0 >= parseInt(this.frequency))
                      return;
                    this.timer && clearTimeout(this.timer),
                      (this.timer = setTimeout(() => {
                        this.getLimitData();
                      }, 1e3 * parseInt(this.frequency)));
                  } catch (e) {
                    J("限流定时器异常！", "error");
                  }
                }),
                (e.onerror = () => {
                  J("请求限流配置失败！", "error");
                  try {
                    if (!this.frequency || 0 >= parseInt(this.frequency))
                      return;
                    this.timer && clearTimeout(this.timer),
                      (this.timer = setTimeout(() => {
                        this.getLimitData();
                      }, 1e3 * parseInt(this.frequency)));
                  } catch (e) {
                    J("限流定时器异常！", "error");
                  }
                }),
                e.send(JSON.stringify({}));
            }),
            (this.canUploadData = (e) => {
              switch (this.status) {
                case "0":
                default:
                  return !0;
                case "1": {
                  let t = !0;
                  try {
                    for (const i in this.limitObject)
                      if ({}.hasOwnProperty.call(this.limitObject, i)) {
                        const n = e[i];
                        if (!n) continue;
                        if (((t = !this.limitObject[i].includes(n)), !t)) break;
                      }
                  } catch (e) {
                    J("限流判断异常！", "error");
                  }
                  return t;
                }
                case "2":
                  return !1;
              }
            }),
            (this.generateURL = () => {
              if (this.requestURL) return;
              let {
                scheme: e,
                host: t = "",
                projectId: i,
              } = this.growingIO.vdsConfig;
              e && G(e, "http")
                ? H(j(e), "://") || (e += "://")
                : (e = "https://"),
                (t = t.replace("http://", "").replace("https://", "")),
                (this.requestURL = `${e}${t}/v3/projects/${i}/query`);
            }),
            this.growingIO.emitter.on("SDK_INITIALIZED", this.getLimitData);
        }
      },
    };
  class Qt {
    constructor(e) {
      (this.growingIO = e),
        (this.listenerSet = !1),
        (this.setListeners = () => {
          this.listenerSet ||
            (window.addEventListener(
              "unhandledrejection",
              this.handleError,
              !0
            ),
            window.addEventListener("error", this.handleError, !0)),
            (this.listenerSet = !0);
        }),
        (this.handleError = (e) => {
          e.reason
            ? this.errorParse(e.reason.stack, e.reason.message, e.eventTime)
            : e.error
            ? this.errorParse(e.error.stack, e.error.message, e.eventTime)
            : e.target &&
              this.buildErrorEvent(
                {
                  error_type: "Resource loading error",
                  error_content:
                    "at " +
                    (e.target.href || e.target.src || e.target.currentSrc),
                },
                e.eventTime
              );
        }),
        (this.errorParse = (e, t, i) => {
          var n, r, s;
          const o = I(e) && e.length ? e.split("\n") : [],
            a = {
              error_type: t || o[0],
              error_content: ce()
                ? (null !== (n = o[0]) && void 0 !== n ? n : "").trim() ||
                  (null !== (r = o[1]) && void 0 !== r ? r : "").trim()
                : (null !== (s = o[1]) && void 0 !== s ? s : "").trim(),
            };
          this.buildErrorEvent(a, i);
        }),
        (this.destroy = () => {
          window.removeEventListener("unhandledrejection", this.handleError),
            window.removeEventListener("error", this.handleError);
        }),
        (this.buildErrorEvent = (e, t) => {
          var i;
          null === (i = this.growingIO.plugins.gioPerformance) ||
            void 0 === i ||
            i.buildPerfEvent("apm_system_error", e, t);
        }),
        this.setListeners(),
        window.gdp.ef &&
          (window.removeEventListener("unhandledrejection", window.gdp.ef),
          window.removeEventListener("error", window.gdp.ef),
          (window.gdp.ef = void 0)),
        !$(window.gdp.e) &&
          S(window.gdp.e) &&
          (window.gdp.e.forEach(this.handleError), (window.gdp.e = void 0));
    }
  }
  var Zt = -1,
    Yt = function (e) {
      addEventListener(
        "pageshow",
        function (t) {
          t.persisted && ((Zt = t.timeStamp), e(t));
        },
        !0
      );
    },
    ei = function () {
      return (
        window.performance &&
        performance.getEntriesByType &&
        performance.getEntriesByType("navigation")[0]
      );
    },
    ti = function () {
      var e = ei();
      return (e && e.activationStart) || 0;
    },
    ii = function (e, t) {
      var i = ei(),
        n = "navigate";
      return (
        0 > Zt
          ? i &&
            (document.prerendering || ti() > 0
              ? (n = "prerender")
              : document.wasDiscarded
              ? (n = "restore")
              : i.type && (n = i.type.replace(/_/g, "-")))
          : (n = "back-forward-cache"),
        {
          name: e,
          value: void 0 === t ? -1 : t,
          rating: "good",
          delta: 0,
          entries: [],
          id: "v3-"
            .concat(Date.now(), "-")
            .concat(Math.floor(8999999999999 * Math.random()) + 1e12),
          navigationType: n,
        }
      );
    },
    ni = function (e, t, i) {
      try {
        if (PerformanceObserver.supportedEntryTypes.includes(e)) {
          var n = new PerformanceObserver(function (e) {
            Promise.resolve().then(function () {
              t(e.getEntries());
            });
          });
          return (
            n.observe(Object.assign({ type: e, buffered: !0 }, i || {})), n
          );
        }
      } catch (e) {}
    },
    ri = function (e, t, i, n) {
      var r, s;
      return function (o) {
        t.value >= 0 &&
          (o || n) &&
          ((s = t.value - (r || 0)) || void 0 === r) &&
          ((r = t.value),
          (t.delta = s),
          (t.rating = (function (e, t) {
            return e > t[1] ? "poor" : e > t[0] ? "needs-improvement" : "good";
          })(t.value, i)),
          e(t));
      };
    },
    si = function (e) {
      requestAnimationFrame(function () {
        return requestAnimationFrame(function () {
          return e();
        });
      });
    },
    oi = -1,
    ai = function () {
      return "hidden" !== document.visibilityState || document.prerendering
        ? 1 / 0
        : 0;
    },
    di = function (e) {
      "hidden" === document.visibilityState &&
        oi > -1 &&
        ((oi = "visibilitychange" === e.type ? e.timeStamp : 0), ui());
    },
    ci = function () {
      addEventListener("visibilitychange", di, !0),
        addEventListener("prerenderingchange", di, !0);
    },
    ui = function () {
      removeEventListener("visibilitychange", di, !0),
        removeEventListener("prerenderingchange", di, !0);
    },
    li = function () {
      return (
        0 > oi &&
          ((oi = ai()),
          ci(),
          Yt(function () {
            setTimeout(function () {
              (oi = ai()), ci();
            }, 0);
          })),
        {
          get firstHiddenTime() {
            return oi;
          },
        }
      );
    },
    hi = function (e) {
      document.prerendering
        ? addEventListener(
            "prerenderingchange",
            function () {
              return e();
            },
            !0
          )
        : e();
    },
    gi = [1800, 3e3],
    pi = [2500, 4e3],
    mi = {},
    fi = [800, 1800],
    vi = function e(t) {
      document.prerendering
        ? hi(function () {
            return e(t);
          })
        : "complete" !== document.readyState
        ? addEventListener(
            "load",
            function () {
              return e(t);
            },
            !0
          )
        : setTimeout(t, 0);
    },
    Ii = function (e, t) {
      t = t || {};
      var i = ii("TTFB"),
        n = ri(e, i, fi, t.reportAllChanges);
      vi(function () {
        var r = ei();
        if (r) {
          var s = r.responseStart;
          if (0 >= s || s > performance.now()) return;
          (i.value = Math.max(s - ti(), 0)),
            (i.entries = [r]),
            n(!0),
            Yt(function () {
              (i = ii("TTFB", 0)), (n = ri(e, i, fi, t.reportAllChanges))(!0);
            });
        }
      });
    };
  const wi = {
      FCP: "first_contentful_paint_duration",
      LCP: "largest_contentful_paint_duration",
      TTFB: "first_byte_duration",
    },
    yi = "gioPerformanceInfo";
  function bi(e, t) {
    const i = JSON.parse(localStorage.getItem(yi) || "{}");
    e && (i[e] = t), localStorage.setItem(yi, JSON.stringify(i));
  }
  function Oi(e = "") {
    const t = JSON.parse(localStorage.getItem(yi) || "{}");
    if (e) return t[e] || "";
  }
  "waiting" === Oi("gioPageStatus")
    ? bi("gioPageStatus", "fail")
    : (bi("gioPageStatus", "waiting"),
      bi("gioPageParams", { href: window.location.href, time: Date.now() }));
  class Ei {
    constructor(e, t = {}) {
      var i, n;
      (this.growingIO = e),
        (this.options = t),
        (this.performance = {}),
        (this.timer = null),
        (this.timerDuring = 3e3),
        (this.timerKey = "gioTimerPerformance"),
        (this.setPerformanceData = (e) => {
          this.vitalsData[e.name].push(e);
        }),
        (this.getLaunchTime = () => {
          const { loadEventEnd: e, navigationStart: t } =
            window.performance.timing;
          return e - t;
        }),
        (this.getInteractiveTime = () => {
          const { domContentLoadedEventEnd: e, navigationStart: t } =
            window.performance.timing;
          return e - t;
        }),
        (this.getPageStatus = () => {
          var e, t;
          "fail" === Oi("gioPageStatus") &&
            (null === (e = this.growingIO.plugins.gioPerformance) ||
              void 0 === e ||
              e.buildPerfEvent(
                "apm_web_loadFail",
                Object.assign({}, Oi("gioPageParams"))
              ));
          const i = JSON.parse(localStorage.getItem(this.timerKey));
          i &&
            (null === (t = this.growingIO.plugins.gioPerformance) ||
              void 0 === t ||
              t.buildPerfEvent("apm_web_stay_time", Object.assign({}, i)),
            setTimeout(() => {
              localStorage.removeItem(this.timerKey);
            }, 10)),
            setTimeout(() => {
              this.gioStorageSave("gioPageStatus", "success");
            }, 10);
        }),
        (this.clearPageStatus = () => {
          var e;
          performance.mark("end"),
            performance.measure("myMeasurement", "start", "end");
          const t = performance.getEntriesByName("myMeasurement", "measure"),
            i = t[t.length - 1];
          i &&
            (null === (e = this.growingIO.plugins.gioPerformance) ||
              void 0 === e ||
              e.buildPerfEvent("apm_web_stay_time", {
                durationTime: Number(i.duration),
                leaveTime: new Date().toLocaleString(),
                enterTime: new Date(
                  Date.now() - Number(i.duration)
                ).toLocaleString(),
              })),
            localStorage.removeItem(this.timerKey),
            clearInterval(this.timer),
            (this.timer = null);
        }),
        (this.setInterval = () => {
          this.timer = setInterval(() => {
            performance.mark("end"),
              performance.measure("myMeasurement", "start", "end");
            const e = performance.getEntriesByName("myMeasurement", "measure"),
              t = e[e.length - 1];
            t &&
              localStorage.setItem(
                this.timerKey,
                JSON.stringify({
                  durationTime: Number(t.duration),
                  leaveTime: new Date().toLocaleString(),
                  enterTime: new Date(Date.now() - t.duration).toLocaleString(),
                })
              );
          }, this.timerDuring);
        }),
        (this.generatePerfData = () => {
          this.getPageStatus(),
            this.watchPage(),
            performance.mark("start"),
            this.setInterval(),
            window.setTimeout(() => {
              const e = {
                page_launch_duration: this.getLaunchTime(),
                interactive_duration: this.getInteractiveTime(),
              };
              F(this.vitalsData, (t, i) => {
                $(t) || (e[wi[i]] = N(P(t).value, 0));
              }),
                V(e, this.performance) ||
                  (this.buildMonitorEvent(e), (this.performance = e));
            }, 1e3);
        }),
        (this.destroy = () => {
          window.removeEventListener("load", this.generatePerfData),
            window.removeEventListener("beforeunload", this.clearPageStatus);
        }),
        (this.buildMonitorEvent = (e) => {
          var t, i, n;
          e.first_contentful_paint_duration > 3e3 &&
            (null === (t = this.growingIO.plugins.gioPerformance) ||
              void 0 === t ||
              t.buildPerfEvent("apm_web_launch", e)),
            e.first_contentful_paint_duration > 1e4 &&
              (null === (i = this.growingIO.plugins.gioPerformance) ||
                void 0 === i ||
                i.buildPerfEvent("apm_web_launch_time_10", e)),
            e.first_contentful_paint_duration > 2e4 &&
              (null === (n = this.growingIO.plugins.gioPerformance) ||
                void 0 === n ||
                n.buildPerfEvent("apm_web_launch_time_20", e));
        }),
        (this.vitalsData = { FCP: [], FID: [], INP: [], LCP: [], TTFB: [] }),
        (i = this.setPerformanceData),
        (n = n || {}),
        hi(function () {
          var e,
            t = li(),
            r = ii("FCP"),
            s = ni("paint", function (i) {
              i.forEach(function (i) {
                "first-contentful-paint" === i.name &&
                  (s.disconnect(),
                  i.startTime < t.firstHiddenTime &&
                    ((r.value = Math.max(i.startTime - ti(), 0)),
                    r.entries.push(i),
                    e(!0)));
              });
            });
          s &&
            ((e = ri(i, r, gi, n.reportAllChanges)),
            Yt(function (t) {
              (r = ii("FCP")),
                (e = ri(i, r, gi, n.reportAllChanges)),
                si(function () {
                  (r.value = performance.now() - t.timeStamp), e(!0);
                });
            }));
        }),
        (function (e, t) {
          (t = t || {}),
            hi(function () {
              var i,
                n = li(),
                r = ii("LCP"),
                s = function (e) {
                  var t = e[e.length - 1];
                  t &&
                    t.startTime < n.firstHiddenTime &&
                    ((r.value = Math.max(t.startTime - ti(), 0)),
                    (r.entries = [t]),
                    i());
                },
                o = ni("largest-contentful-paint", s);
              if (o) {
                i = ri(e, r, pi, t.reportAllChanges);
                var a = (function (e) {
                  var t = !1;
                  return function (i) {
                    t || (e(), (t = !0));
                  };
                })(function () {
                  mi[r.id] ||
                    (s(o.takeRecords()),
                    o.disconnect(),
                    (mi[r.id] = !0),
                    i(!0));
                });
                ["keydown", "click"].forEach(function (e) {
                  addEventListener(
                    e,
                    function () {
                      return setTimeout(a, 0);
                    },
                    !0
                  );
                }),
                  (function (e) {
                    var t = function (t) {
                      ("pagehide" !== t.type &&
                        "hidden" !== document.visibilityState) ||
                        e(t);
                    };
                    addEventListener("visibilitychange", t, !0),
                      addEventListener("pagehide", t, !0);
                  })(a),
                  Yt(function (n) {
                    (r = ii("LCP")),
                      (i = ri(e, r, pi, t.reportAllChanges)),
                      si(function () {
                        (r.value = performance.now() - n.timeStamp),
                          (mi[r.id] = !0),
                          i(!0);
                      });
                  });
              }
            });
        })(this.setPerformanceData, { reportAllChanges: !0 }),
        Ii(this.setPerformanceData),
        window.addEventListener("load", this.generatePerfData);
      let r = !0;
      window.addEventListener("beforeunload", () => {
        r && ((r = !1), this.clearPageStatus());
      }),
        window.addEventListener("visibilitychange", () => {
          "hidden" === document.visibilityState &&
            r &&
            ((r = !1), this.clearPageStatus()),
            "visible" === document.visibilityState && (r = !0);
        }),
        window.addEventListener("pagehide", () => {
          r && ((r = !1), this.clearPageStatus());
        });
    }
    watchPage() {
      this.watchDom(), this.getPageLoadType();
    }
    getPageLoadType() {
      performance.getEntriesByType("navigation")[0].type;
    }
    sendPageError() {
      var e;
      null === (e = this.growingIO.plugins.gioPerformance) ||
        void 0 === e ||
        e.buildPerfEvent("apm_web_page_destroy_error");
    }
    watchDom() {
      const e = document.querySelector("html");
      new MutationObserver((e, t) => {
        document.querySelector("body") ||
          (this.sendPageError(), t.disconnect());
      }).observe(e, { attributes: !0, childList: !0, subtree: !0 });
    }
    getScriptUrl() {
      const e = document.querySelectorAll("script[src]"),
        t = [];
      for (let i = 0; i < e.length; i += 1) {
        let n = e[i];
        n.src.includes("/sw.js") && t.push(n);
      }
      if (t[0]) return t[0].src;
    }
    gioStorageSave(e, t) {
      return bi(e, t);
    }
    gioStorageGet(e = "") {
      return Oi(e);
    }
    gioStorageRemove(e) {
      return (function (e) {
        const t = JSON.parse(localStorage.getItem(yi) || "{}");
        if (e) return (t[e] = void 0);
        localStorage.setItem(yi, JSON.stringify(t));
      })(e);
    }
  }
  function _i(e, t, i, n = !1) {
    if (!v(e) && (M(e, t) || n)) {
      const n = i(e[t]);
      "function" == typeof n && (e[t] = n);
    }
  }
  class Si {
    constructor(e, t) {
      (this.growingIO = e),
        (this.options = t),
        (this.initOptions = () => {
          var e;
          O(this.options.network) &&
            (null === (e = this.options.network) || void 0 === e
              ? void 0
              : e.exclude) &&
            (this.excludeRegExp = this.options.network.exclude);
        }),
        (this.verifyUrl = (e) => {
          let t = null;
          if ("string" == typeof e) t = e;
          else if (e instanceof URL) t = e.href;
          else if (e instanceof Request) t = e.url;
          else if (e && "function" == typeof e.toString)
            try {
              t = e.toString();
            } catch (e) {}
          if ("string" != typeof t || "[object Object]" === t || "" === t)
            return !1;
          if (t.indexOf(this.growingIO.uploader.requestURL) > -1) return !0;
          if (S(this.excludeRegExp)) {
            const e = x(
              this.excludeRegExp.map((e) =>
                E(e) ? e.test(t) : I(e) ? t.indexOf(e) > -1 : void 0
              )
            );
            return !$(e);
          }
          return I(this.excludeRegExp)
            ? t.indexOf(this.excludeRegExp) > -1
            : !!E(this.excludeRegExp) && this.excludeRegExp.test(t);
        }),
        (this.getTimestamp = () =>
          window.performance ? window.performance.now() : Date.now()),
        (this.hookXHR = () => {
          const e = this;
          this.originXHR = window.XMLHttpRequest;
          const t = XMLHttpRequest.prototype;
          let i = {};
          _i(
            t,
            "open",
            (t) =>
              function (...n) {
                (this.gio_XHR_id = ae()),
                  e.verifyUrl(n[1]) ||
                    (i[this.gio_XHR_id] = {
                      type: "XHR",
                      method: n[0],
                      url: n[1],
                    }),
                  t.apply(this, n);
              }
          ),
            _i(
              t,
              "send",
              (t) =>
                function (...n) {
                  this.addEventListener("loadend", (t) => {
                    i[this.gio_XHR_id] &&
                      ((i[this.gio_XHR_id] = Object.assign(
                        Object.assign({}, i[this.gio_XHR_id]),
                        {
                          duration:
                            (t.timeStamp || e.getTimestamp()) -
                            i[this.gio_XHR_id].start,
                          status: this.status,
                        }
                      )),
                      e.buildNetworkEvent(i[this.gio_XHR_id]),
                      W(i, this.gio_XHR_id));
                  }),
                    this.addEventListener("error", () => {
                      e.buildErrorEvent({
                        error_title: "XMLHttpRequest Error",
                        error_content: this.status,
                      });
                    }),
                    i[this.gio_XHR_id] &&
                      (i[this.gio_XHR_id].start = e.getTimestamp()),
                    t.apply(this, n);
                }
            );
        }),
        (this.hookFetch = () => {
          const e = this;
          (this.originFetch = window.fetch),
            _i(
              window,
              "fetch",
              (t) =>
                function (i, n = {}) {
                  let r = null,
                    s = null;
                  return (
                    "string" == typeof i
                      ? (s = i)
                      : i instanceof URL
                      ? (s = i.href)
                      : i instanceof Request && (s = i.url),
                    s &&
                      !e.verifyUrl(s) &&
                      (r = {
                        type: "Fetch",
                        method: (
                          n.method || (i instanceof Request ? i.method : "GET")
                        ).toUpperCase(),
                        url: s,
                        start: e.getTimestamp(),
                      }),
                    t(i, n).then(
                      (t) => {
                        try {
                          if (r) {
                            const i = Math.max(0, e.getTimestamp() - r.start);
                            e.buildNetworkEvent(
                              Object.assign(Object.assign({}, r), {
                                duration: i,
                                status: t.status,
                              })
                            );
                          }
                        } catch (e) {
                          console.warn("GrowingIO fetch monitor error:", e);
                        }
                        return t;
                      },
                      (t) => {
                        var i;
                        try {
                          if (r) {
                            const n =
                              (null === (i = t.stack) || void 0 === i
                                ? void 0
                                : i.split("\n")) || [];
                            e.buildErrorEvent({
                              error_title:
                                n[0] || j(t) || "Fetch Request Error",
                              error_content: r.url,
                            });
                          }
                        } catch (e) {
                          console.warn(
                            "GrowingIO fetch error monitor error:",
                            e
                          );
                        }
                        return Promise.reject(t);
                      }
                    )
                  );
                }
            );
        }),
        (this.buildErrorEvent = (e) => {
          if (!this.options.exception) return;
          const {
            dataStore: {
              eventContextBuilder: t,
              eventConverter: i,
              currentPage: n,
            },
          } = this.growingIO;
          i(
            Object.assign(
              {
                eventType: "CUSTOM",
                pageShowTimestamp: n.time,
                eventName: "Error",
                attributes: e,
              },
              t()
            )
          );
        }),
        (this.destroy = () => {
          (window.XMLHttpRequest = this.originXHR),
            (window.fetch = this.originFetch);
        }),
        (this.buildNetworkEvent = (e) => {
          var i;
          if (!1 === t.network) return;
          const { duration: n, url: r, method: s, status: o } = e;
          null === (i = this.growingIO.plugins.gioPerformance) ||
            void 0 === i ||
            i.buildPerfEvent("apm_network_request", {
              response_duration: n,
              request_address: r,
              request_method: s,
              http_code: o,
            });
        }),
        this.initOptions(),
        this.hookXHR(),
        this.hookFetch(),
        window.performance ||
          J("当前浏览器无法支持性能相关API，网络监测数据可能存在偏差!", "warn");
    }
  }
  let Ti;
  const Ni = {
      install(e) {
        if (e && e.config) {
          const t = function (t, i, n) {
            Ci.call(this, t, i, n, e);
          };
          if (_(e.config.errorHandler)) {
            const i = e.config.errorHandler;
            e.config.errorHandler = function () {
              const e = i.apply(this, arguments);
              return t(arguments[0], arguments[1], arguments[2]), e;
            };
          } else e.config.errorHandler = t;
        }
      },
    },
    Ci = (e, t, i, n) => {
      let r = {
        message: `${e.message}(${i})`,
        name: e.name,
        stack: e.stack || [],
      };
      if (null == n ? void 0 : n.version)
        switch (
          Number.parseInt(C(U(null == n ? void 0 : n.version, ".")), 10)
        ) {
          case 2:
            r = Object.assign(Object.assign({}, r), Pi(t));
            break;
          case 3:
            r = Object.assign(Object.assign({}, r), Li(t));
            break;
          default:
            return;
        }
      (r = Object.assign(Object.assign({}, r), xi(r.stack))),
        (window.gdp || window.gio || function () {})(
          "track",
          "apm_system_error",
          {
            error_type: `${r.name}: ${r.message}`,
            error_content: `at ${r.functionName} (${r.componentName})`,
          }
        );
    },
    Pi = (e) => {
      let t = "";
      if (e.$root === e) t = "root";
      else {
        const i = e._isVue
          ? (e.$options && e.$options.name) ||
            (e.$options && e.$options._componentTag)
          : e.name;
        t =
          (i ? "component <" + i + ">" : "anonymous component") +
          (e._isVue && e.$options && e.$options.__file
            ? " at " + (e.$options && e.$options.__file)
            : "");
      }
      return { componentName: t };
    },
    Li = (e) => {
      let t = "";
      if (e.$root === e) t = "root";
      else {
        const i = e.$options && e.$options.name;
        t = i ? "component <" + i + ">" : "anonymous component";
      }
      return { componentName: t };
    },
    xi = (e) => {
      const t = e.split("\n");
      let i;
      return (
        A(t, (e) => {
          const t = e.match(/at (.*?) \((.*):(\d{1,}):(\d{1,})\)/);
          if (S(t) && !i) return (i = t[1]), t.length > 0;
        }),
        { title: t[0], functionName: i }
      );
    };
  var Ai = {
    name: "gioPerformance",
    method: class {
      constructor(e) {
        var t;
        (this.growingIO = e),
          (this.inited = !1),
          (this.cacheQueue = []),
          (this.init = () => {
            if (this.inited) return;
            const { performance: e, dataCollect: t } = this.growingIO.vdsConfig;
            e.monitor && (this.monitor = new Ei(this.growingIO)),
              e.exception && (this.exception = new Qt(this.growingIO)),
              (this.network = new Si(this.growingIO, e)),
              t && this.sendCacheQuene(),
              (this.inited = !0);
          }),
          (this.sendCacheQuene = () => {
            Ti.isEmpty(this.cacheQueue) ||
              (this.cacheQueue.forEach((e) => {
                this.buildPerfEvent(e.eventName, e.attributes, e.eventTime);
              }),
              (this.cacheQueue = []));
          }),
          (this.buildPerfEvent = (e, t, i) => {
            const {
              dataStore: {
                eventContextBuilder: n,
                eventConverter: r,
                currentPage: s,
              },
              vdsConfig: o,
              gioSDKInitialized: a,
            } = this.growingIO;
            if (!a || !o.dataCollect)
              return void this.cacheQueue.push({
                eventName: e,
                attributes: t,
                eventTime: i || +Date.now(),
              });
            Ti.forEach(t, (e, i) => {
              (Ti.isNaN(e) || Ti.isNil(e)) && (t[i] = 0),
                (t[i] = Ti.fixed(e, 0));
            });
            const d = Object.assign(
              {
                eventType: "CUSTOM",
                pageShowTimestamp: s.time,
                eventName: e,
                attributes: t,
              },
              n()
            );
            i && (d.timestamp = i), r(d);
          }),
          (Ti = this.growingIO.utils),
          this.growingIO.gioSDKInitialized
            ? this.init()
            : this.growingIO.emitter.on("SDK_INITIALIZED_COMPLATE", () => {
                this.init();
              }),
          null === (t = this.growingIO.emitter) ||
            void 0 === t ||
            t.on("OPTION_CHANGE", ({ optionName: e, optionValue: t }) => {
              "dataCollect" === e && !0 === t && this.sendCacheQuene();
            });
      }
    },
    GioVue: Ni,
    gioReactErrorReport: (e, t) => {
      const i = e.stack.split("\n")[0],
        n = t.componentStack.split("\n"),
        r = [];
      n.forEach((e) => {
        const t = (e + " ").match(/at (.*?) /);
        S(t) && t[1] && r.push(t[1]);
      });
      const s = "at " + L(r.reverse()).join("/");
      (window.gdp || window.gio || function () {})(
        "track",
        "apm_system_error",
        { error_type: i, error_content: s }
      );
    },
  };
  class Di {
    constructor(e) {
      var t, i, n, r;
      (this.growingIO = e),
        (this.innerPluginInit = () => {
          var e;
          K(
            null === (e = this.pluginsContext) || void 0 === e
              ? void 0
              : e.plugins
          ).forEach((e) => {
            var t;
            const { name: i, method: n } =
                null !==
                  (t = Q(() => {
                    var t;
                    return null === (t = this.pluginsContext) || void 0 === t
                      ? void 0
                      : t.plugins[e];
                  })) && void 0 !== t
                  ? t
                  : {},
              r = A(this.pluginItems, (e) => e.name === i);
            r ||
              this.pluginItems.push({
                name: q(i || e),
                method: n || ((e) => {}),
              });
          }),
            $(this.pluginItems) || this.installAll();
        }),
        (this.install = (e, t, i) => {
          var n, r;
          const s = t || A(this.pluginItems, (t) => t.name === e);
          if (
            (null === (n = this.growingIO) || void 0 === n
              ? void 0
              : n.plugins)[e]
          )
            return J(`重复加载插件 ${e} 或插件重名，已跳过加载!`, "warn"), !1;
          if (!s) return J(`插件加载失败!不存在名为 ${e} 的插件!`, "error"), !1;
          try {
            return (
              ((null === (r = this.growingIO) || void 0 === r
                ? void 0
                : r.plugins)[e] = new s.method(this.growingIO, i)),
              "cdp" === this.growingIO.gioEnvironment &&
                t &&
                J("加载插件 " + e, "info"),
              !0
            );
          } catch (e) {
            return J("插件加载异常 " + e, "error"), !1;
          }
        }),
        (this.installAll = (e) => {
          (e || this.pluginItems).forEach((t) => {
            this.install(
              t.name,
              e ? t : void 0,
              e ? (null == t ? void 0 : t.options) : void 0
            ) &&
              !A(this.pluginItems, (e) => e.name === t.name) &&
              this.pluginItems.push({
                name: q(t.name),
                method: t.method ? t.method : () => {},
              });
          });
        }),
        (this.uninstall = (e) => {
          var t;
          W(this.pluginItems, e);
          const i = W(
            null === (t = this.growingIO) || void 0 === t ? void 0 : t.plugins,
            e
          );
          return i || J(`卸载插件 ${e} 失败!`, "error"), i;
        }),
        (this.uninstallAll = () => {
          this.pluginItems.forEach((e) => this.uninstall(e.name));
        }),
        (this.lifeError = (e, t) => J(`插件执行错误 ${e.name} ${t}`, "error")),
        (this.onComposeBefore = (e) => {
          this.pluginItems.forEach((t) => {
            var i;
            const n =
              null === (i = this.growingIO.plugins[t.name]) || void 0 === i
                ? void 0
                : i.onComposeBefore;
            if (n && _(n))
              try {
                n(e);
              } catch (e) {
                this.lifeError(t, e);
              }
          });
        }),
        (this.onComposeAfter = (e) => {
          this.pluginItems.forEach((t) => {
            var i;
            const n =
              null === (i = this.growingIO.plugins[t.name]) || void 0 === i
                ? void 0
                : i.onComposeAfter;
            if (n && _(n))
              try {
                n(e);
              } catch (e) {
                this.lifeError(t, e);
              }
          });
        }),
        (this.onSendBefore = (e) => {
          this.pluginItems.forEach((t) => {
            var i;
            const n =
              null === (i = this.growingIO.plugins[t.name]) || void 0 === i
                ? void 0
                : i.onSendBefore;
            if (n && _(n))
              try {
                n(e);
              } catch (e) {
                this.lifeError(t, e);
              }
          });
        }),
        (this.onSendAfter = (e) => {
          this.pluginItems.forEach((t) => {
            var i;
            const n =
              null === (i = this.growingIO.plugins[t.name]) || void 0 === i
                ? void 0
                : i.onSendAfter;
            if (n && _(n))
              try {
                n(e);
              } catch (e) {
                this.lifeError(t, e);
              }
          });
        }),
        (this.pluginsContext = { plugins: {} }),
        (this.pluginItems = []),
        null === (t = this.growingIO.emitter) ||
          void 0 === t ||
          t.on("onComposeBefore", this.onComposeBefore),
        null === (i = this.growingIO.emitter) ||
          void 0 === i ||
          i.on("onComposeAfter", this.onComposeAfter),
        null === (n = this.growingIO.emitter) ||
          void 0 === n ||
          n.on("onSendBefore", this.onSendBefore),
        null === (r = this.growingIO.emitter) ||
          void 0 === r ||
          r.on("onSendAfter", this.onSendAfter);
    }
  }
  class Ri extends Di {
    constructor(e) {
      super(e),
        (this.growingIO = e),
        (this.growingIO.gioSDKFull = !0),
        (this.pluginsContext = {
          plugins: {
            gioCompress: xe,
            gioCustomTracking: Ae,
            gioEmbeddedAdapter: Be,
            gioEventAutoTracking: Dt,
            gioHybridAdapter: Ut,
            gioHybridCircle: Xt,
            gioImpressionTracking: zt,
            gioLimiting: Jt,
            gioPerformance: Ai,
          },
        });
    }
  }
  class ki {
    constructor() {
      var e;
      (this.trackingId = "g0"),
        (this.init = (e) => {
          var t, i, n, r, s;
          J("Web SDK 初始化中...", "info");
          const {
            initOptions: o,
            currentPage: a,
            sendVisit: d,
            sendPage: c,
          } = this.dataStore;
          o(e),
            (this.storage = Se(this.vdsConfig)),
            this.initCallback(),
            null === (t = this.emitter) || void 0 === t || t.emit(Te, this),
            null ===
              (n =
                null === (i = this.plugins) || void 0 === i
                  ? void 0
                  : i.gioEventAutoTracking) ||
              void 0 === n ||
              n.main(),
            a.hookHistory(),
            a.parsePage(),
            null === (r = this.emitter) || void 0 === r || r.emit(Ne, this),
            J("Web SDK 初始化完成！", "success"),
            this.useEmbeddedInherit ||
              ((this.dataStore.lastVisitEvent.timestamp = a.time), d()),
            c(),
            (this.gioSDKInitialized = !0),
            (this.vdsConfig.gioSDKInitialized = !0),
            (window[this.vds] = this.vdsConfig),
            null === (s = this.emitter) ||
              void 0 === s ||
              s.emit("SDK_INITIALIZED_COMPLATE", this);
        }),
        (this.setOption = (e, t) => {
          if (R(s, e)) {
            const i = this.dataStore.setOption(e, t);
            return i && o[e] && J(`已${t ? "开启" : "关闭"}${o[e]}`, "info"), i;
          }
          return J(`不存在可修改的配置项：${e}，请检查后重试!`, "warn"), !1;
        }),
        (this.getOption = (e) => this.dataStore.getOption(e)),
        (this.setGeneralProps = (e) => {
          O(e) && !$(e)
            ? ((this.dataStore.generalProps = Object.assign(
                Object.assign({}, this.dataStore.generalProps),
                e
              )),
              K(this.dataStore.generalProps).forEach((e) => {
                R([void 0, null], this.dataStore.generalProps[e]) &&
                  (this.dataStore.generalProps[e] = "");
              }))
            : this.callError("setGeneralProps");
        }),
        (this.clearGeneralProps = (e) => {
          S(e) && !$(e)
            ? e.forEach((e) => {
                W(this.dataStore.generalProps, e);
              })
            : (this.dataStore.generalProps = {});
        }),
        (this.reissuePage = () => {
          this.dataStore.sendPage();
        }),
        (this.notRecommended = () =>
          J(
            "不推荐的方法使用，建议使用 gio('setOption', [optionName], [value])!",
            "info"
          )),
        (this.callError = (e, t = !0, i = "参数不合法") =>
          J(`${t ? "调用" : "设置"} ${e} 失败，${i}!`, "warn")),
        (this.gioEnvironment = "cdp"),
        (this.sdkVersion = "5.1.1"),
        (this.vds = window.gioCompatibilityVds ? "gdp_vds" : "vds"),
        (this.utils = Object.assign({}, z, te, De)),
        (this.emitter = {
          all: (e = e || new Map()),
          on: function (t, i) {
            var n = e.get(t);
            n ? n.push(i) : e.set(t, [i]);
          },
          off: function (t, i) {
            var n = e.get(t);
            n && (i ? n.splice(n.indexOf(i) >>> 0, 1) : e.set(t, []));
          },
          emit: function (t, i) {
            var n = e.get(t);
            n &&
              n.slice().map(function (e) {
                e(i);
              }),
              (n = e.get("*")) &&
                n.slice().map(function (e) {
                  e(t, i);
                });
          },
        }),
        (this.useEmbeddedInherit = !1),
        (this.useHybridInherit = !1),
        (this.gioSDKInitialized = !1),
        (this.plugins = new Ri(this)),
        this.plugins.innerPluginInit();
    }
  }
  class ji {
    constructor(e) {
      this.growingIO = e;
      const { projectId: t } = this.growingIO.vdsConfig,
        {
          getItem: i,
          setItem: n,
          getKeys: r,
          removeItem: s,
        } = this.growingIO.storage;
      (this.getItem = i),
        (this.setItem = n),
        (this.getKeys = r),
        (this.removeItem = s),
        (this.sIdStorageName = t + "_gdp_session_id"),
        (this.uidStorageName = "gdp_user_id_gioenc"),
        (this.userIdStorageName = t + "_gdp_cs1_gioenc"),
        (this.userKeyStorageName = t + "_gdp_user_key_gioenc"),
        (this.gioIdStorageName = t + "_gdp_gio_id_gioenc");
    }
    get sessionId() {
      return (
        this.getItem(this.sIdStorageName) ||
        ((this.sessionId = ae()), this.sessionId)
      );
    }
    set sessionId(e) {
      var t;
      e || (e = ae());
      const i = this.getItem(this.sIdStorageName) || this.prevSessionId,
        { sessionExpires: n = 30 } = this.growingIO.vdsConfig;
      this.setItem(this.sIdStorageName, e, +Date.now() + 60 * n * 1e3),
        i !== e &&
          (this.getKeys()
            .filter((e) => /.+_gdp_session_id_.{36}/.test(e))
            .forEach((e) => {
              this.removeItem(e);
            }),
          this.setItem(this.growingIO.dataStore.visitStorageName, ""),
          null === (t = this.growingIO.emitter) ||
            void 0 === t ||
            t.emit(Ce, { newSessionId: e, oldSessionId: i })),
        (this.prevSessionId = e);
    }
    get uid() {
      return this.getItem(this.uidStorageName) || ((this.uid = ae()), this.uid);
    }
    set uid(e) {
      var t;
      const i = this.getItem(this.uidStorageName) || this.prevUId;
      this.setItem(this.uidStorageName, e),
        i !== e &&
          (null === (t = this.growingIO.emitter) ||
            void 0 === t ||
            t.emit("UID_UPDATE", { newUId: e, oldUId: i })),
        (this.prevUId = e);
    }
    get userId() {
      return this.getItem(this.userIdStorageName) || "";
    }
    set userId(e) {
      var t, i;
      const n = this.getItem(this.userIdStorageName) || this.prevUserId;
      this.setItem(this.userIdStorageName, e),
        null === (t = this.growingIO.emitter) ||
          void 0 === t ||
          t.emit(Pe, { newUserId: e, oldUserId: n, userKey: this.userKey }),
        n !== e &&
          (null === (i = this.growingIO.emitter) ||
            void 0 === i ||
            i.emit("USERID_UPDATE", {
              newUserId: e,
              oldUserId: n,
              userKey: this.userKey,
            })),
        e && (this.gioId = e),
        (this.prevUserId = e);
    }
    get userKey() {
      return this.getItem(this.userKeyStorageName) || "";
    }
    set userKey(e) {
      var t, i;
      const n = this.getItem(this.userKeyStorageName) || this.prevUserKey;
      this.setItem(this.userKeyStorageName, e),
        null === (t = this.growingIO.emitter) ||
          void 0 === t ||
          t.emit(Le, { newUserKey: e, oldUserKey: n, userId: this.userId }),
        n !== e &&
          (null === (i = this.growingIO.emitter) ||
            void 0 === i ||
            i.emit("USERKEY_UPDATE", {
              newUserKey: e,
              oldUserKey: n,
              userId: this.userId,
            })),
        (this.prevUserKey = e);
    }
    get gioId() {
      return this.getItem(this.gioIdStorageName) || "";
    }
    set gioId(e) {
      var t;
      const i = this.getItem(this.gioIdStorageName) || this.prevGioId;
      this.setItem(this.gioIdStorageName, e),
        i !== e &&
          (null === (t = this.growingIO.emitter) ||
            void 0 === t ||
            t.emit("GIOID_UPDATE", { newGioId: e, oldGioId: i })),
        (this.prevGioId = e);
    }
  }
  class Ui {
    constructor(e) {
      (this.growingIO = e),
        (this.main = () => {
          var e, t;
          const {
              sdkVersion: i,
              useEmbeddedInherit: n,
              vdsConfig: r,
              userStore: s,
              dataStore: o,
              trackingId: a,
            } = this.growingIO,
            { path: d, query: c } = o.currentPage;
          let u = {
            appVersion: r.version,
            dataSourceId: r.dataSourceId,
            deviceId: s.uid,
            domain: n ? r.appId : window.location.host,
            gioId: s.gioId,
            language: navigator.language,
            path: d,
            platform: r.platform,
            query: c,
            referralPage:
              (null === (e = o.lastPageEvent) || void 0 === e
                ? void 0
                : e.referralPage) || "",
            screenHeight: window.screen.height,
            screenWidth: window.screen.width,
            sdkVersion: i,
            sessionId: s.sessionId,
            timestamp: +Date.now(),
            title:
              null !== (t = Q(() => document.title.slice(0, 255))) &&
              void 0 !== t
                ? t
                : "",
            userId: s.userId,
          };
          if (
            (r.enableIdMapping && (u.userKey = s.userKey),
            $(r.ignoreFields) ||
              r.ignoreFields.forEach((e) => {
                W(u, e);
              }),
            n && !$(this.minpExtraParams))
          ) {
            const e = Object.assign({}, u);
            F(
              Object.assign(Object.assign({}, u), this.minpExtraParams),
              (t, i) => {
                var n;
                R(r.embeddedIgnore, i)
                  ? ((u[i] = e[i]),
                    "domain" === i && (u[i] = window.location.host))
                  : (u[i] =
                      null !== (n = this.minpExtraParams[i]) && void 0 !== n
                        ? n
                        : u[i]);
              }
            );
          }
          return (u.trackingId = a), u;
        }),
        (this.minpExtraParams = {});
    }
  }
  class qi {
    constructor(e) {
      (this.growingIO = e),
        (this.parsePage = () => {
          const { hashtag: e } = this.growingIO.vdsConfig,
            t = location.pathname,
            i = location.search,
            n = location.hash,
            r = n.indexOf("?");
          (this.domain = window.location.host),
            (this.title = document.title.slice(0, 255)),
            (this.time = +Date.now()),
            (this.path = t),
            (this.query = i),
            e &&
              (r > -1
                ? ((this.path += n.slice(0, r)),
                  (this.query = this.query + "&" + n.slice(r + 1)))
                : (this.path += n)),
            this.query &&
              R(["?", "&"], this.query.charAt(0)) &&
              (this.query = this.query.slice(1));
        }),
        (this._getNoHashHref = () => {
          const {
            protocol: e,
            host: t,
            pathname: i,
            search: n,
          } = window.location;
          return `${e}://${t}${i}${n}`;
        }),
        (this.getReferralPage = () => {
          var e, t;
          const {
            dataStore: { lastPageEvent: i },
          } = this.growingIO;
          return (null == i ? void 0 : i.path) === this.path &&
            (null !== (e = null == i ? void 0 : i.query) && void 0 !== e
              ? e
              : "") === (null !== (t = this.query) && void 0 !== t ? t : "")
            ? null == i
              ? void 0
              : i.referralPage
            : (null == i ? void 0 : i.path)
            ? this.lastHref
            : document.referrer;
        }),
        (this.pageListener = () => {
          const { hashtag: e } = this.growingIO.vdsConfig;
          let t = window.location.href,
            i = this.lastHref;
          e || ((t = this._getNoHashHref()), (i = this.lastNoHashHref)),
            i !== t && (this.parsePage(), this.buildPageEvent());
        }),
        (this.hookHistory = () => {
          const e = window.history.pushState,
            t = window.history.replaceState,
            i = this;
          e &&
            Q(
              () =>
                (window.history.pushState = function () {
                  e.apply(window.history, arguments),
                    setTimeout(i.pageListener);
                })
            ),
            t &&
              Q(
                () =>
                  (window.history.replaceState = function () {
                    t.apply(window.history, arguments),
                      setTimeout(i.pageListener);
                  })
              ),
            Y(window, "popstate", this.pageListener);
          const { hashtag: n } = this.growingIO.vdsConfig;
          n && Y(window, "hashchange", this.pageListener);
        }),
        (this.buildPageEvent = (e) => {
          const {
            dataStore: {
              lastPageEvent: t,
              eventContextBuilder: i,
              eventConverter: n,
            },
          } = this.growingIO;
          let r = Object.assign(Object.assign({ eventType: "PAGE" }, i()), {
            protocolType: location.protocol.substring(
              0,
              location.protocol.length - 1
            ),
            referralPage: this.getReferralPage(),
          });
          $(e) || (r = Object.assign(Object.assign({}, r), e)),
            (r.timestamp = this.time),
            n(r),
            (this.lastHref = window.location.href),
            (this.lastNoHashHref = this._getNoHashHref()),
            (this.lastLocation = Object.assign({}, window.location));
        }),
        (this.title = document.title.slice(0, 255)),
        (this.lastLocation = Object.assign({}, window.location));
    }
  }
  const Gi = { referralPage: document.referrer };
  class Hi {
    constructor(r) {
      var a, c, u;
      (this.growingIO = r),
        (this.ALLOW_SETTING = Object.assign(
          Object.assign({}, t),
          "saas" === this.growingIO.gioEnvironment ? n : i
        )),
        (this.allowOptKeys = Object.keys(this.ALLOW_SETTING)),
        (this.trackTimers = {}),
        (this.setSequenceIds = (e, t) => {
          let i = this.growingIO.storage.getItem(this.seqStorageIdName) || {};
          "gsid" === e
            ? (i.globalKey = t)
            : (i = Object.assign(Object.assign({}, i), t)),
            this.growingIO.storage.setItem(this.seqStorageIdName, i);
        }),
        (this.initOptions = (t) => {
          var i, n, r, s, a, c, u;
          const { projectId: l, dataSourceId: h, appId: g } = t;
          this.initialDataSourceId = h;
          const p = {};
          this.allowOptKeys.forEach((i) => {
            const n = this.ALLOW_SETTING[i].type;
            let r = S(n) ? !R(n, X(t[i])) : X(t[i]) !== n;
            "platform" !== i || R(e, t[i]) || (r = !0),
              r
                ? (p[i] = this.ALLOW_SETTING[i].default)
                : "ignoreFields" === i
                ? (p.ignoreFields = t.ignoreFields.filter((e) => R(d, e)))
                : ((p[i] = t[i]),
                  R(["dataCollect", "autotrack"], i) &&
                    (p[i] || J("已关闭" + o[i], "info")));
          }),
            (p.sessionExpires = Math.round(p.sessionExpires)),
            (y(p.sessionExpires) ||
              1 > p.sessionExpires ||
              p.sessionExpires > 360) &&
              (p.sessionExpires = 30),
            (p.storageType = p.storageType.toLowerCase()),
            (p.sendType = p.sendType.toLowerCase()),
            R(["beacon", "xhr"], p.sendType) || (p.sendType = "beacon"),
            (this.growingIO.vdsConfig = Object.assign(
              Object.assign(
                Object.assign(
                  {},
                  null !== (i = window.vds) && void 0 !== i ? i : {}
                ),
                p
              ),
              {
                projectId: l,
                dataSourceId: h,
                appId: g,
                performance: {
                  monitor:
                    null ===
                      (r =
                        null === (n = p.performance) || void 0 === n
                          ? void 0
                          : n.monitor) ||
                    void 0 === r ||
                    r,
                  exception:
                    null ===
                      (a =
                        null === (s = p.performance) || void 0 === s
                          ? void 0
                          : s.exception) ||
                    void 0 === a ||
                    a,
                  network:
                    null !==
                      (u =
                        null === (c = p.performance) || void 0 === c
                          ? void 0
                          : c.network) &&
                    void 0 !== u &&
                    u,
                },
              }
            )),
            (window.vds = this.growingIO.vdsConfig),
            (this.seqStorageIdName = l + "_gdp_sequence_ids"),
            (this.visitStorageName = l + "_gdp_session_id_sent");
        }),
        (this.setOption = (e, t) => {
          var i;
          const {
              vdsConfig: n,
              callError: r,
              uploader: o,
              emitter: a,
            } = this.growingIO,
            d = I(e) && R(s, e),
            c =
              d &&
              typeof t ===
                ((null === (i = this.ALLOW_SETTING[e]) || void 0 === i
                  ? void 0
                  : i.type) || "string"),
            u = Object.assign({}, n);
          return d && c
            ? ((n[e] = t),
              "dataCollect" === e &&
                u.dataCollect !== t &&
                (t
                  ? (this.sendVisit(!0), this.sendPage())
                  : this.growingIO.clearTrackTimer()),
              R(["host", "scheme"], e) && (null == o || o.generateHost()),
              null == a ||
                a.emit("OPTION_CHANGE", { optionName: e, optionValue: t }),
              (window.vds[e] = t),
              !0)
            : (r("setOption > " + e), !1);
        }),
        (this.getOption = (e) => {
          const { vdsConfig: t, callError: i } = this.growingIO;
          return e && M(t, j(e))
            ? t[j(e)]
            : v(e)
            ? Object.assign({}, t)
            : void i("getOption > " + e);
        }),
        (this.sendVisit = (e) => {
          const {
              userStore: { sessionId: t },
              storage: i,
            } = this.growingIO,
            n = i.getItem(this.visitStorageName);
          (!e && t === n) ||
            ((this.lastVisitEvent.timestamp = this.currentPage.time - 1),
            this.buildVisitEvent());
        }),
        (this.buildVisitEvent = (e) => {
          const {
              dataStore: { eventContextBuilder: t, eventConverter: i },
              emitter: n,
              storage: r,
            } = this.growingIO,
            {
              referralPage: s,
              title: o,
              path: a,
              query: d,
              timestamp: c,
            } = this.lastVisitEvent;
          let u = Object.assign(Object.assign({ eventType: "VISIT" }, t()), {
            referralPage: s || this.currentPage.getReferralPage(),
            timestamp: c,
          });
          a && ((u.title = o), (u.path = a), (u.query = d)),
            $(e) ||
              ((u.session = (null == e ? void 0 : e.session) || u.session),
              (u.trackingId = null == e ? void 0 : e.trackingId),
              (u = Object.assign(Object.assign({}, u), e)));
          const l = ({ requestData: e }) => {
            "VISIT" === e.eventType &&
              (r.setItem(this.visitStorageName, e.sessionId),
              n.off("onSendAfter", l));
          };
          n.on("onSendAfter", l), i(u);
        }),
        (this.sendPage = (e) => {
          e && this.currentPage.parsePage(), this.currentPage.buildPageEvent();
        }),
        (this.buildErrorEvent = (e) => {
          const {
            dataStore: { eventContextBuilder: t, eventConverter: i },
          } = this.growingIO;
          i(
            Object.assign(
              {
                eventType: "CUSTOM",
                pageShowTimestamp: this.currentPage.time,
                eventName: "onError",
                attributes: e,
              },
              t()
            )
          );
        }),
        (this.currentPage = new qi(this.growingIO)),
        (this.eventContextBuilderInst = new Ui(this.growingIO)),
        (this.eventContextBuilder = this.eventContextBuilderInst.main),
        (this.generalProps = {}),
        (this.lastVisitEvent = Gi),
        null === (a = this.growingIO.emitter) ||
          void 0 === a ||
          a.on("onComposeAfter", ({ composedEvent: e }) => {
            ("VISIT" !== e.eventType && "vst" !== e.t) ||
              e.trackingId !== this.growingIO.trackingId ||
              (this.lastVisitEvent = e);
          }),
        (this.lastPageEvent = {}),
        null === (c = this.growingIO.emitter) ||
          void 0 === c ||
          c.on("onComposeAfter", ({ composedEvent: e }) => {
            ("PAGE" !== e.eventType && "page" !== e.t) ||
              e.trackingId !== this.growingIO.trackingId ||
              (this.lastPageEvent = e);
          }),
        null === (u = this.growingIO.emitter) ||
          void 0 === u ||
          u.on(Ce, () => {
            if (this.growingIO.gioSDKInitialized) {
              this.currentPage.parsePage();
              const {
                title: e,
                path: t,
                query: i,
                time: n,
                getReferralPage: r,
              } = this.currentPage;
              (this.lastVisitEvent = {
                referralPage: document.referrer || r(),
                title: e,
                path: t,
                query: i,
                timestamp: n - 1,
              }),
                this.sendVisit(!0),
                this.sendPage(!0);
            }
          });
    }
    get esid() {
      const e = this.growingIO.storage.getItem(this.seqStorageIdName) || {};
      let t = Object.assign({}, e);
      return (
        W(t, "globalKey"),
        (t = O(t) && !v(t) ? t : {}),
        (this._esid = {}),
        K(t).forEach((e) => {
          this._esid[e] = y(Number(t[e])) || t[e] >= 1e9 || 1 > t[e] ? 1 : t[e];
        }),
        this._esid
      );
    }
    set esid(e) {
      const t = {};
      K(e).forEach((i) => {
        t[i] = y(e[i]) || e[i] >= 1e9 || 1 > e[i] ? 1 : e[i];
      }),
        V(this._esid, t) ||
          ((this._esid = t), this.setSequenceIds("esid", this._esid));
    }
    get gsid() {
      const e = this.growingIO.storage.getItem(this.seqStorageIdName) || {},
        t = Number(e.globalKey);
      return (this._gsid = y(t) || t >= 1e9 || 1 > t ? 1 : t), this._gsid;
    }
    set gsid(e) {
      y(Number(e)) || e >= 1e9 || 1 > e ? (this._gsid = 1) : (this._gsid = e),
        this.setSequenceIds("gsid", this._gsid);
    }
  }
  class Bi extends Hi {
    constructor(e) {
      super(e),
        (this.growingIO = e),
        (this.eventConverter = (e) => {
          var t;
          const { vdsConfig: i, dataStore: n, uploader: r } = this.growingIO;
          if (i.dataCollect) {
            e.trackingId === this.growingIO.trackingId &&
              ((e.globalSequenceId = n.gsid),
              (e.eventSequenceId = n.esid[e.eventType] || 1));
            const i = {};
            F(e, (e, t) => {
              var n;
              if ("element" === t) {
                const t = null !== (n = C(e)) && void 0 !== n ? n : {};
                F(t, (e, t) => {
                  ($(e) && 0 !== e) || (i[t] = e);
                });
              } else (($(e) || v(e)) && 0 !== e) || (i[t] = e);
            }),
              e.trackingId === this.growingIO.trackingId &&
                ((this.growingIO.dataStore.gsid += 1),
                (this.growingIO.dataStore.esid = Object.assign(
                  Object.assign({}, this.growingIO.dataStore.esid),
                  {
                    [i.eventType]:
                      (this.growingIO.dataStore.esid[i.eventType] || 1) + 1,
                  }
                ))),
              null === (t = this.growingIO.emitter) ||
                void 0 === t ||
                t.emit("onComposeAfter", {
                  composedEvent: Object.assign({}, i),
                }),
              e.trackingId === this.growingIO.trackingId && r.commitRequest(i);
          } else "VISIT" === e.eventType && (this.lastVisitEvent = e);
        });
    }
  }
  class Mi {
    constructor(e) {
      (this.growingIO = e),
        (this.getSendType = () => {
          const { sendType: e } = this.growingIO.vdsConfig;
          return "beacon" === e
            ? (() => {
                var e;
                const t = !!(null ===
                    (e =
                      null === window || void 0 === window
                        ? void 0
                        : window.navigator) || void 0 === e
                    ? void 0
                    : e.sendBeacon),
                  i = window.navigator.userAgent;
                if (i.match(/(iPad|iPhone|iPod)/g)) {
                  const e = ((e) => {
                    const t = e
                      .toLowerCase()
                      .match(/cpu.*os (.*?) like mac os/i);
                    return !t || 2 > t.length
                      ? 0
                      : +t[1].split("_").slice(0, 2).join(".");
                  })(i);
                  return t && e > 13;
                }
                return t;
              })()
              ? "beacon"
              : "xhr"
            : e;
        }),
        (this.commitRequest = (e) => {
          const t = Object.assign({}, e);
          this.requestQueue.push(
            Object.assign(Object.assign({}, t), {
              requestType: this.getSendType(),
            })
          ),
            this.initiateRequest();
        }),
        (this.initiateRequest = () => {
          var e, t, i, n;
          if (
            [...this.requestQueue].length > 0 &&
            this.requestingNum < this.requestLimit
          ) {
            const {
              vdsConfig: r,
              emitter: s,
              plugins: o,
              useHybridInherit: a,
            } = this.growingIO;
            if (
              ((this.requestQueue = [...this.requestQueue].filter(
                (e) =>
                  (this.retryIds[e.globalSequenceId || e.esid] || 0) <=
                  this.retryLimit
              )),
              $(this.requestQueue))
            )
              return;
            const d = this.requestQueue.shift(),
              { requestType: c } = d;
            null == s ||
              s.emit("onSendBefore", { requestData: Object.assign({}, d) });
            const u = Object.assign({}, d);
            if (
              (W(u, ["requestType", "trackingId"]),
              r.debug &&
                console.log(
                  "[GrowingIO Debug]:",
                  JSON.stringify(u, null, 2).replace(/\"/g, ce() ? "" : '"')
                ),
              (this.requestingNum += 1),
              a)
            )
              return this.requestSuccessFn(d), !1;
            let l = Object.assign({}, u);
            const h =
              null ===
                (t =
                  null === (e = null == o ? void 0 : o.gioLimiting) ||
                  void 0 === e
                    ? void 0
                    : e.canUploadData(l)) ||
              void 0 === t ||
              t;
            if ((console.log("限流插件:", l, h), !h)) return;
            switch (
              (r.compress && (null == o ? void 0 : o.gioCompress)
                ? ((this.compressType = "1"),
                  (l =
                    "image" === c
                      ? null === (i = null == o ? void 0 : o.gioCompress) ||
                        void 0 === i
                        ? void 0
                        : i.compressToUTF16(JSON.stringify([l]))
                      : null === (n = null == o ? void 0 : o.gioCompress) ||
                        void 0 === n
                      ? void 0
                      : n.compressToUint8Array(JSON.stringify([l]))))
                : ((this.compressType = "0"), (l = JSON.stringify([l]))),
              c)
            ) {
              case "beacon":
              default:
                this.sendByBeacon(d, l);
                break;
              case "xhr":
                this.sendByXHR(d, l);
              case "image":
            }
          }
        }),
        (this.generateURL = () =>
          `${this.requestURL}?stm=${+Date.now()}&compress=${
            this.compressType
          }`),
        (this.sendByBeacon = (e, t) => {
          navigator.sendBeacon(this.generateURL(), t)
            ? this.requestSuccessFn(e)
            : this.requestFailFn(e, "beacon");
        }),
        (this.sendByXHR = (e, t) => {
          const i = new XMLHttpRequest();
          if (i)
            return (
              i.open("POST", this.generateURL(), !0),
              (i.onreadystatechange = () => {
                4 === i.readyState &&
                  (200 === i.status || 204 === i.status
                    ? this.requestSuccessFn(e)
                    : this.requestFailFn(e, "xhr"));
              }),
              i.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"),
              void i.send(t)
            );
          if (
            null === window || void 0 === window
              ? void 0
              : window.XDomainRequest
          ) {
            const n = new window.XDomainRequest();
            n.open(
              "POST",
              this.generateURL().replace("https://", "http://"),
              !0
            ),
              (n.onload = () => {
                200 === i.status || 204 === n.status
                  ? this.requestSuccessFn(e)
                  : this.requestFailFn(e, "xhr");
              }),
              (n.onerror = n.ontimeout =
                () => {
                  this.requestFailFn(e, "xhr");
                }),
              n.send(t);
          }
        }),
        (this.sendByImage = (e, t) => {
          const i = `${this.generateURL()}&data=${t}`;
          let n = document.createElement("img");
          (n.width = 1),
            (n.height = 1),
            (n.onload = () => {
              this.requestSuccessFn(e), this.clearImage(n);
            }),
            (n.onerror = n.onabort =
              () => {
                this.requestSuccessFn(e), this.clearImage(n);
              }),
            (n.src = i);
        }),
        (this.clearImage = (e) => {
          (e.src = ""),
            (e.onload = () => {}),
            (e.onerror = e.onerabort = () => {}),
            (e = null);
        }),
        (this.requestSuccessFn = (e) => {
          var t;
          this.requestingNum -= 1;
          const i = e.globalSequenceId || e.esid || -1;
          this.retryIds[i] && (this.retryIds[i] = 0),
            e.trackingId === this.growingIO.trackingId &&
              (this.growingIO.userStore.sessionId = e.sessionId),
            null === (t = this.growingIO.emitter) ||
              void 0 === t ||
              t.emit("onSendAfter", { requestData: Object.assign({}, e) }),
            this.initiateRequest();
        }),
        (this.requestFailFn = (e, t) => {
          this.requestingNum -= 1;
          const i = e.globalSequenceId || e.esid || -1;
          this.retryIds[i] || (this.retryIds[i] = 0), (this.retryIds[i] += 1);
          const n = this.requestQueue.some(
            (t) =>
              t.globalSequenceId === e.globalSequenceId && t.esid === e.esid
          );
          let r = t;
          if (
            (this.retryIds[i] < this.retryLimit + 1 ||
              ((r = "beacon" === t ? "xhr" : "xhr" === t ? "image" : void 0),
              (this.retryIds[i] = 0)),
            !n && r)
          ) {
            let t = window.setTimeout(() => {
              $(this.requestQueue)
                ? (this.requestQueue.push(
                    Object.assign(Object.assign({}, e), { requestType: r })
                  ),
                  this.initiateRequest())
                : this.requestQueue.push(
                    Object.assign(Object.assign({}, e), { requestType: r })
                  ),
                window.clearTimeout(t),
                (t = null);
            }, 800);
          }
        }),
        (this.requestQueue = []),
        (this.requestLimit = 10),
        (this.requestTimeout = 5e3),
        (this.retryLimit = 1),
        (this.retryIds = {}),
        (this.requestingNum = 0),
        (this.requestURL = "");
    }
  }
  class Ki extends Mi {
    constructor(e) {
      super(e),
        (this.growingIO = e),
        (this.generateHost = () => {
          let {
            scheme: e,
            host: t = "",
            projectId: i,
          } = this.growingIO.vdsConfig;
          e
            ? H(j(e), "://") || (e += "://")
            : (e =
                (location.protocol.indexOf("http") > -1
                  ? location.protocol.replace(":", "")
                  : "https") + "//"),
            G(t, "http") &&
              (t = t.substring(t.indexOf("://") + (H(j(e), "://") ? 3 : 0))),
            (this.requestURL = `${e}${t}/v3/projects/${i}/collect`);
        }),
        (this.requestURL = ""),
        this.generateHost();
    }
  }
  class Fi extends ki {
    constructor() {
      super(),
        (this.registerPlugins = (e) => {
          S(e)
            ? (e.forEach((t, i) => {
                var n, r;
                $(t) || v(t)
                  ? J("插件不合法，跳过加载!", "warn")
                  : (null === (n = t.js) || void 0 === n
                      ? void 0
                      : n.default) &&
                    (e[i] = Object.assign(
                      Object.assign(
                        {},
                        null === (r = t.js) || void 0 === r ? void 0 : r.default
                      ),
                      { options: t.options }
                    ));
              }),
              (e = x(e)),
              this.plugins.installAll(e))
            : J("插件注册失败，请检查!", "error");
        }),
        (this.initCallback = () => {
          (this.uploader = new Ki(this)), (this.userStore = new ji(this));
        }),
        (this.getPlugins = () => this.plugins.pluginItems),
        (this.setTrackerScheme = (e) => {
          R(["http", "https"], e)
            ? (this.dataStore.setOption("scheme", e), this.notRecommended())
            : this.callError("scheme", !1);
        }),
        (this.setTrackerHost = (e) => {
          ne.test(e) || re.test(e)
            ? (this.dataStore.setOption("host", e), this.notRecommended())
            : this.callError("host", !1);
        }),
        (this.setDataCollect = (e) => {
          this.setOption("dataCollect", !!e), this.notRecommended();
        }),
        (this.setAutotrack = (e) => {
          this.setOption("autotrack", !!e), this.notRecommended();
        }),
        (this.enableDebug = (e) => {
          this.setOption("debug", !!e), this.notRecommended();
        }),
        (this.enableHT = (e) => {
          this.setOption("hashtag", !!e), this.notRecommended();
        }),
        (this.getVisitorId = () => this.userStore.uid),
        (this.getDeviceId = () => this.userStore.uid),
        (this.setUserAttributes = (e, t) => {
          var i, n;
          !$(e) && O(e)
            ? null ===
                (n =
                  null === (i = this.plugins) || void 0 === i
                    ? void 0
                    : i.gioCustomTracking) ||
              void 0 === n ||
              n.buildUserAttributesEvent(e, t)
            : this.callError("setUserAttributes");
        }),
        (this.setUserId = (e, t) => {
          if (ie(j(e).trim())) {
            const i = this.userStore.gioId;
            this.vdsConfig.enableIdMapping &&
              (this.userStore.userKey =
                !v(t) && j(t).length > 0 ? j(t).slice(0, 1e3) : ""),
              (this.userStore.userId = j(e).slice(0, 1e3)),
              i &&
                i !== this.userStore.userId &&
                (this.userStore.sessionId = "");
          } else this.clearUserId(), this.callError("setUserId");
        }),
        (this.clearUserId = () => {
          (this.userStore.userId = ""), (this.userStore.userKey = "");
        }),
        (this.track = (e, t, i, n) => {
          var r, s;
          (
            (null ===
              (s =
                null === (r = this.plugins) || void 0 === r
                  ? void 0
                  : r.gioCustomTracking) || void 0 === s
              ? void 0
              : s.buildCustomEvent) || function () {}
          )(
            e,
            Object.assign(
              Object.assign({}, this.dataStore.generalProps),
              O(t) && !$(t) ? t : {}
            ),
            i,
            n
          );
        }),
        (this.sendPage = (e) => this.dataStore.currentPage.buildPageEvent(e)),
        (this.sendVisit = (e) => this.dataStore.buildVisitEvent(e)),
        (this.trackTimerStart = (e, t) => {
          this.vdsConfig.dataCollect &&
            ee(e, () => {
              const i = ae();
              _(t)
                ? ((this.dataStore.trackTimers[i] = {
                    eventName: e,
                    leng: 0,
                    start: +Date.now(),
                  }),
                  t(i))
                : J("回调方法不合法，返回timerId失败!");
            });
        }),
        (this.trackTimerPause = (e) => {
          if (e && this.dataStore.trackTimers[e]) {
            const t = this.dataStore.trackTimers[e];
            t.start && (t.leng = t.leng + (+Date.now() - t.start)),
              (t.start = 0);
          }
        }),
        (this.trackTimerResume = (e) => {
          if (e && this.dataStore.trackTimers[e]) {
            const t = this.dataStore.trackTimers[e];
            0 === t.start && (t.start = +Date.now());
          }
        }),
        (this.trackTimerEnd = (e, t) => {
          if (this.vdsConfig.dataCollect) {
            const i = 864e5;
            if (e && this.dataStore.trackTimers[e]) {
              const n = this.dataStore.trackTimers[e];
              if (0 !== n.start) {
                const e = +Date.now() - n.start;
                n.leng = e > 0 ? n.leng + e : 0;
              }
              this.track(
                n.eventName,
                Object.assign(Object.assign({}, t), {
                  event_duration: n.leng > i ? 0 : n.leng / 1e3,
                })
              ),
                this.removeTimer(e);
            } else J("未查找到对应的计时器，请检查!", "error");
          }
        }),
        (this.removeTimer = (e) => {
          e &&
            this.dataStore.trackTimers[e] &&
            delete this.dataStore.trackTimers[e];
        }),
        (this.clearTrackTimer = () => {
          this.dataStore.trackTimers = {};
        }),
        (this.dataStore = new Bi(this));
    }
  }
  let Vi;
  return (
    (function () {
      var e, t, i, n, s;
      let o = window.gioCompatibilityVds ? "gdp_vds" : "vds";
      if (null === (e = window[o]) || void 0 === e ? void 0 : e.gioSDKInstalled)
        return (
          (Vi = window.gdp),
          void J(
            "SDK重复加载，请检查是否重复加载SDK或接入其他平台SDK导致冲突!",
            "warn"
          )
        );
      window[o] = Object.assign(
        Object.assign({}, null !== (t = window[o]) && void 0 !== t ? t : {}),
        { gioSDKInstalled: !0 }
      );
      const d = new Fi();
      Vi = function () {
        var e;
        const t = arguments[0];
        if (I(t) && R(r, t) && d[t]) {
          const e = L(k(arguments));
          if ("init" === t) {
            const t = ((e) => {
              var t;
              return e.vdsConfig ||
                e.gioSDKInitialized ||
                (null === (t = window.vds) || void 0 === t
                  ? void 0
                  : t.gioSDKInitialized)
                ? (J(
                    "SDK重复初始化，请检查是否重复加载SDK或接入其他平台SDK导致冲突!",
                    "warn"
                  ),
                  !1)
                : !(
                    R(["", "localhost", "127.0.0.1"], location.hostname) &&
                    !window._gr_ignore_local_rule &&
                    (J("当前SDK不允许在本地环境初始化!", "warn"), 1)
                  );
            })(d);
            if (!t) return;
            const i = ((e) =>
              !$(x(e)) ||
              (J(
                'SDK初始化失败，请使用 gdp("init", "您的项目 accountId", "您项目的 dataSourceId", options); 进行初始化!',
                "error"
              ),
              !1))(e);
            if (!i) return;
            const n = ((e) => {
              const t = C(e);
              let i = P(e);
              return ie(j(t).trim())
                ? ((O(i) && i) || (i = {}), { projectId: t, userOptions: i })
                : (J("SDK初始化失败，accountId 参数不合法!", "error"), !1);
            })(e);
            if (!n) return;
            const r = ((e) => {
              const t = e[1],
                i = e[2],
                n = P(e);
              return t && I(t)
                ? { dataSourceId: t, appId: I(i) ? i : "", cdpOptions: n }
                : (J("SDK初始化失败，dataSourceId 参数不合法!", "error"), !1);
            })(e);
            if (!r) return;
            const { projectId: s } = n,
              { dataSourceId: o, appId: a, cdpOptions: c } = r;
            d.init(
              Object.assign(Object.assign({}, c), {
                projectId: s,
                dataSourceId: o,
                appId: a,
              })
            );
          } else if ("registerPlugins" === t) d.registerPlugins(e[0]);
          else {
            if (d.gioSDKInitialized && d.vdsConfig) return d[t](...e);
            d.emitter.emit("UNINITIALIZED_CALL", arguments),
              J("SDK未初始化!", "error");
          }
        } else
          R(a, t)
            ? J(`方法 ${j(t)} 已被弃用，请移除!`, "warn")
            : J(`不存在名为 ${j(t)} 的方法调用!`, "error");
        window[o] = Object.assign(Object.assign({}, window[o]), {
          _gr_ignore_local_rule:
            null !== (e = window._gr_ignore_local_rule) && void 0 !== e && e,
          gioEnvironment: "cdp",
          gioSDKVersion: d.sdkVersion,
          gioSDKFull: d.gioSDKFull,
          canIUse: (e) => R(r, e) && d[e],
        });
      };
      const c =
          null ===
            (i = null === window || void 0 === window ? void 0 : window.gdp) ||
          void 0 === i
            ? void 0
            : i.q,
        u =
          null ===
            (n = null === window || void 0 === window ? void 0 : window.gdp) ||
          void 0 === n
            ? void 0
            : n.e,
        l =
          null ===
            (s = null === window || void 0 === window ? void 0 : window.gdp) ||
          void 0 === s
            ? void 0
            : s.ef;
      (window.gdp = Vi),
        (window.gdp.e = u),
        (window.gdp.ef = l),
        S(c) &&
          !$(c) &&
          c.forEach((e) => {
            Vi.apply(null, e);
          });
    })(),
    Vi
  );
});

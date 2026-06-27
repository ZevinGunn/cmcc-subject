/*! For license information please see framework.js.LICENSE.txt */
"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["26"],
  {
    99576(e, t, r) {
      var n = r(61418);
      (t.createRoot = n.createRoot), (t.hydrateRoot = n.hydrateRoot);
    },
    25657(e, t, r) {
      r.d(t, { ok: () => o });
      var n = r(41486),
        a = r(65903);
      function o(e) {
        let t = (0, n.useRef)(i(e)),
          r = (0, a.zy)(),
          o = (0, n.useMemo)(() => {
            let e = i(r.search);
            for (let r of t.current.keys())
              e.has(r) ||
                t.current.getAll(r).forEach((t) => {
                  e.append(r, t);
                });
            return e;
          }, [r.search]),
          s = (0, a.Zp)();
        return [
          o,
          (0, n.useCallback)(
            (e, t) => {
              s("?" + i(e), t);
            },
            [s]
          ),
        ];
      }
      function i(e) {
        return (
          void 0 === e && (e = ""),
          new URLSearchParams(
            "string" == typeof e ||
            Array.isArray(e) ||
            e instanceof URLSearchParams
              ? e
              : Object.keys(e).reduce((t, r) => {
                  let n = e[r];
                  return t.concat(
                    Array.isArray(n) ? n.map((e) => [r, e]) : [[r, n]]
                  );
                }, [])
          )
        );
      }
    },
    65903(e, t, r) {
      var n, a;
      r.d(t, {
        ue: () => d,
        sv: () => k,
        C5: () => U,
        jb: () => s,
        tW: () => f,
        Ix: () => B,
        B6: () => g,
        g: () => P,
        zy: () => T,
        Ye: () => j,
        Zp: () => x,
        P1: () => _,
      }),
        ((a = n || (n = {})).Pop = "POP"),
        (a.Push = "PUSH"),
        (a.Replace = "REPLACE");
      function o(e) {
        var t = {};
        if (e) {
          var r = e.indexOf("#");
          r >= 0 && ((t.hash = e.substr(r)), (e = e.substr(0, r)));
          var n = e.indexOf("?");
          n >= 0 && ((t.search = e.substr(n)), (e = e.substr(0, n))),
            e && (t.pathname = e);
        }
        return t;
      }
      var i = r(41486);
      const s = (0, i.createContext)(null);
      const u = (0, i.createContext)(null);
      const l = (0, i.createContext)({ outlet: null, matches: [] });
      function c(e, t) {
        if (!e) throw new Error(t);
      }
      function f(e, t) {
        return (
          void 0 === t && (t = {}),
          e
            .replace(/:(\w+)/g, (e, r) => (null == t[r] && c(!1), t[r]))
            .replace(/\/*\*$/, (e) =>
              null == t["*"] ? "" : t["*"].replace(/^\/*/, "/")
            )
        );
      }
      function d(e, t, r) {
        void 0 === r && (r = "/");
        let n = w(("string" == typeof t ? o(t) : t).pathname || "/", r);
        if (null == n) return null;
        let a = h(e);
        !(function (e) {
          e.sort((e, t) =>
            e.score !== t.score
              ? t.score - e.score
              : (function (e, t) {
                  let r =
                    e.length === t.length &&
                    e.slice(0, -1).every((e, r) => e === t[r]);
                  return r ? e[e.length - 1] - t[t.length - 1] : 0;
                })(
                  e.routesMeta.map((e) => e.childrenIndex),
                  t.routesMeta.map((e) => e.childrenIndex)
                )
          );
        })(a);
        let i = null;
        for (let e = 0; null == i && e < a.length; ++e) i = y(a[e], n);
        return i;
      }
      function h(e, t, r, n) {
        return (
          void 0 === t && (t = []),
          void 0 === r && (r = []),
          void 0 === n && (n = ""),
          e.forEach((e, a) => {
            let o = {
              relativePath: e.path || "",
              caseSensitive: !0 === e.caseSensitive,
              childrenIndex: a,
              route: e,
            };
            o.relativePath.startsWith("/") &&
              (o.relativePath.startsWith(n) || c(!1),
              (o.relativePath = o.relativePath.slice(n.length)));
            let i = E([n, o.relativePath]),
              s = r.concat(o);
            e.children &&
              e.children.length > 0 &&
              (!0 === e.index && c(!1), h(e.children, t, s, i)),
              (null != e.path || e.index) &&
                t.push({ path: i, score: v(i, e.index), routesMeta: s });
          }),
          t
        );
      }
      const p = /^:\w+$/,
        m = (e) => "*" === e;
      function v(e, t) {
        let r = e.split("/"),
          n = r.length;
        return (
          r.some(m) && (n += -2),
          t && (n += 2),
          r
            .filter((e) => !m(e))
            .reduce((e, t) => e + (p.test(t) ? 3 : "" === t ? 1 : 10), n)
        );
      }
      function y(e, t) {
        let { routesMeta: r } = e,
          n = {},
          a = "/",
          o = [];
        for (let e = 0; e < r.length; ++e) {
          let i = r[e],
            s = e === r.length - 1,
            u = "/" === a ? t : t.slice(a.length) || "/",
            l = g(
              { path: i.relativePath, caseSensitive: i.caseSensitive, end: s },
              u
            );
          if (!l) return null;
          Object.assign(n, l.params);
          let c = i.route;
          o.push({
            params: n,
            pathname: E([a, l.pathname]),
            pathnameBase: R(E([a, l.pathnameBase])),
            route: c,
          }),
            "/" !== l.pathnameBase && (a = E([a, l.pathnameBase]));
        }
        return o;
      }
      function g(e, t) {
        "string" == typeof e && (e = { path: e, caseSensitive: !1, end: !0 });
        let [r, n] = (function (e, t, r) {
            void 0 === t && (t = !1);
            void 0 === r && (r = !0);
            let n = [],
              a =
                "^" +
                e
                  .replace(/\/*\*?$/, "")
                  .replace(/^\/*/, "/")
                  .replace(/[\\.*+^$?{}|()[\]]/g, "\\$&")
                  .replace(/:(\w+)/g, (e, t) => (n.push(t), "([^\\/]+)"));
            e.endsWith("*")
              ? (n.push("*"),
                (a += "*" === e || "/*" === e ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
              : (a += r ? "\\/*$" : "(?:(?=[.~-]|%[0-9A-F]{2})|\\b|\\/|$)");
            let o = new RegExp(a, t ? void 0 : "i");
            return [o, n];
          })(e.path, e.caseSensitive, e.end),
          a = t.match(r);
        if (!a) return null;
        let o = a[0],
          i = o.replace(/(.)\/+$/, "$1"),
          s = a.slice(1);
        return {
          params: n.reduce((e, t, r) => {
            if ("*" === t) {
              let e = s[r] || "";
              i = o.slice(0, o.length - e.length).replace(/(.)\/+$/, "$1");
            }
            return (
              (e[t] = (function (e, t) {
                try {
                  return decodeURIComponent(e);
                } catch (t) {
                  return e;
                }
              })(s[r] || "")),
              e
            );
          }, {}),
          pathname: o,
          pathnameBase: i,
          pattern: e,
        };
      }
      function b(e, t, r) {
        let n,
          a = "string" == typeof e ? o(e) : e,
          i = "" === e || "" === a.pathname ? "/" : a.pathname;
        if (null == i) n = r;
        else {
          let e = t.length - 1;
          if (i.startsWith("..")) {
            let t = i.split("/");
            for (; ".." === t[0]; ) t.shift(), (e -= 1);
            a.pathname = t.join("/");
          }
          n = e >= 0 ? t[e] : "/";
        }
        let s = (function (e, t) {
          void 0 === t && (t = "/");
          let {
              pathname: r,
              search: n = "",
              hash: a = "",
            } = "string" == typeof e ? o(e) : e,
            i = r
              ? r.startsWith("/")
                ? r
                : (function (e, t) {
                    let r = t.replace(/\/+$/, "").split("/");
                    return (
                      e.split("/").forEach((e) => {
                        ".." === e
                          ? r.length > 1 && r.pop()
                          : "." !== e && r.push(e);
                      }),
                      r.length > 1 ? r.join("/") : "/"
                    );
                  })(r, t)
              : t;
          return { pathname: i, search: O(n), hash: S(a) };
        })(a, n);
        return (
          i &&
            "/" !== i &&
            i.endsWith("/") &&
            !s.pathname.endsWith("/") &&
            (s.pathname += "/"),
          s
        );
      }
      function w(e, t) {
        if ("/" === t) return e;
        if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
        let r = e.charAt(t.length);
        return r && "/" !== r ? null : e.slice(t.length) || "/";
      }
      const E = (e) => e.join("/").replace(/\/\/+/g, "/"),
        R = (e) => e.replace(/\/+$/, "").replace(/^\/*/, "/"),
        O = (e) => (e && "?" !== e ? (e.startsWith("?") ? e : "?" + e) : ""),
        S = (e) => (e && "#" !== e ? (e.startsWith("#") ? e : "#" + e) : "");
      function A() {
        return null != (0, i.useContext)(u);
      }
      function T() {
        return A() || c(!1), (0, i.useContext)(u).location;
      }
      function x() {
        A() || c(!1);
        let { basename: e, navigator: t } = (0, i.useContext)(s),
          { matches: r } = (0, i.useContext)(l),
          { pathname: n } = T(),
          a = JSON.stringify(r.map((e) => e.pathnameBase)),
          o = (0, i.useRef)(!1);
        return (
          (0, i.useEffect)(() => {
            o.current = !0;
          }),
          (0, i.useCallback)(
            function (r, i) {
              if ((void 0 === i && (i = {}), !o.current)) return;
              if ("number" == typeof r) return void t.go(r);
              let s = b(r, JSON.parse(a), n);
              "/" !== e && (s.pathname = E([e, s.pathname])),
                (i.replace ? t.replace : t.push)(s, i.state);
            },
            [e, t, a, n]
          )
        );
      }
      const C = (0, i.createContext)(null);
      function _(e) {
        let t = (0, i.useContext)(l).outlet;
        return t ? (0, i.createElement)(C.Provider, { value: e }, t) : t;
      }
      function P() {
        let { matches: e } = (0, i.useContext)(l),
          t = e[e.length - 1];
        return t ? t.params : {};
      }
      function j(e, t) {
        A() || c(!1);
        let { matches: r } = (0, i.useContext)(l),
          n = r[r.length - 1],
          a = n ? n.params : {},
          s = (n && n.pathname, n ? n.pathnameBase : "/");
        n && n.route;
        let u,
          f = T();
        if (t) {
          var h;
          let e = "string" == typeof t ? o(t) : t;
          "/" === s ||
            (null == (h = e.pathname) ? void 0 : h.startsWith(s)) ||
            c(!1),
            (u = e);
        } else u = f;
        let p = u.pathname || "/",
          m = d(e, { pathname: "/" === s ? p : p.slice(s.length) || "/" });
        return N(
          m &&
            m.map((e) =>
              Object.assign({}, e, {
                params: Object.assign({}, a, e.params),
                pathname: E([s, e.pathname]),
                pathnameBase:
                  "/" === e.pathnameBase ? s : E([s, e.pathnameBase]),
              })
            ),
          r
        );
      }
      function N(e, t) {
        return (
          void 0 === t && (t = []),
          null == e
            ? null
            : e.reduceRight(
                (r, n, a) =>
                  (0, i.createElement)(l.Provider, {
                    children: void 0 !== n.route.element ? n.route.element : r,
                    value: { outlet: r, matches: t.concat(e.slice(0, a + 1)) },
                  }),
                null
              )
        );
      }
      function U(e) {
        let { to: t, replace: r, state: n } = e;
        A() || c(!1);
        let a = x();
        return (
          (0, i.useEffect)(() => {
            a(t, { replace: r, state: n });
          }),
          null
        );
      }
      function k(e) {
        return _(e.context);
      }
      function B(e) {
        let {
          basename: t = "/",
          children: r = null,
          location: a,
          navigationType: l = n.Pop,
          navigator: f,
          static: d = !1,
        } = e;
        A() && c(!1);
        let h = R(t),
          p = (0, i.useMemo)(
            () => ({ basename: h, navigator: f, static: d }),
            [h, f, d]
          );
        "string" == typeof a && (a = o(a));
        let {
            pathname: m = "/",
            search: v = "",
            hash: y = "",
            state: g = null,
            key: b = "default",
          } = a,
          E = (0, i.useMemo)(() => {
            let e = w(m, h);
            return null == e
              ? null
              : { pathname: e, search: v, hash: y, state: g, key: b };
          }, [h, m, v, y, g, b]);
        return null == E
          ? null
          : (0, i.createElement)(
              s.Provider,
              { value: p },
              (0, i.createElement)(u.Provider, {
                children: r,
                value: { location: E, navigationType: l },
              })
            );
      }
    },
    77462(e, t, r) {
      var n = r(41486),
        a = Symbol.for("react.element"),
        o = Symbol.for("react.fragment"),
        i = Object.prototype.hasOwnProperty,
        s =
          n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
            .ReactCurrentOwner,
        u = { key: !0, ref: !0, __self: !0, __source: !0 };
      function l(e, t, r) {
        var n,
          o = {},
          l = null,
          c = null;
        for (n in (void 0 !== r && (l = "" + r),
        void 0 !== t.key && (l = "" + t.key),
        void 0 !== t.ref && (c = t.ref),
        t))
          i.call(t, n) && !u.hasOwnProperty(n) && (o[n] = t[n]);
        if (e && e.defaultProps)
          for (n in (t = e.defaultProps)) void 0 === o[n] && (o[n] = t[n]);
        return {
          $$typeof: a,
          type: e,
          key: l,
          ref: c,
          props: o,
          _owner: s.current,
        };
      }
      (t.Fragment = o), (t.jsx = l), (t.jsxs = l);
    },
    86070(e, t, r) {
      e.exports = r(77462);
    },
    50584(e, t, r) {
      r.d(t, { A: () => Ut });
      var n = {};
      function a(e, t) {
        return function () {
          return e.apply(t, arguments);
        };
      }
      r.r(n),
        r.d(n, {
          hasBrowserEnv: () => me,
          hasStandardBrowserEnv: () => ye,
          hasStandardBrowserWebWorkerEnv: () => ge,
          navigator: () => ve,
          origin: () => be,
        });
      var o,
        { toString: i } = Object.prototype,
        { getPrototypeOf: s } = Object,
        { iterator: u, toStringTag: l } = Symbol,
        c =
          ((o = Object.create(null)),
          (e) => {
            var t = i.call(e);
            return o[t] || (o[t] = t.slice(8, -1).toLowerCase());
          }),
        f = (e) => ((e = e.toLowerCase()), (t) => c(t) === e),
        d = (e) => (t) => typeof t === e,
        { isArray: h } = Array,
        p = d("undefined");
      var m = f("ArrayBuffer");
      var v = d("string"),
        y = d("function"),
        g = d("number"),
        b = (e) => null !== e && "object" == typeof e,
        w = (e) => {
          if ("object" !== c(e)) return !1;
          var t = s(e);
          return !(
            (null !== t &&
              t !== Object.prototype &&
              null !== Object.getPrototypeOf(t)) ||
            l in e ||
            u in e
          );
        },
        E = f("Date"),
        R = f("File"),
        O = f("Blob"),
        S = f("FileList"),
        A = f("URLSearchParams"),
        [T, x, C, _] = ["ReadableStream", "Request", "Response", "Headers"].map(
          f
        );
      function P(e, t) {
        var r,
          n,
          { allOwnKeys: a = !1 } =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        if (null != e)
          if (("object" != typeof e && (e = [e]), h(e)))
            for (r = 0, n = e.length; r < n; r++) t.call(null, e[r], r, e);
          else {
            var o,
              i = a ? Object.getOwnPropertyNames(e) : Object.keys(e),
              s = i.length;
            for (r = 0; r < s; r++) (o = i[r]), t.call(null, e[o], o, e);
          }
      }
      function j(e, t) {
        t = t.toLowerCase();
        for (var r, n = Object.keys(e), a = n.length; a-- > 0; )
          if (t === (r = n[a]).toLowerCase()) return r;
        return null;
      }
      var N =
          "undefined" != typeof globalThis
            ? globalThis
            : "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : global,
        U = (e) => !p(e) && e !== N;
      var k,
        B =
          ((k = "undefined" != typeof Uint8Array && s(Uint8Array)),
          (e) => k && e instanceof k),
        L = f("HTMLFormElement"),
        F = ((e) => {
          var { hasOwnProperty: t } = e;
          return (e, r) => t.call(e, r);
        })(Object.prototype),
        D = f("RegExp"),
        q = (e, t) => {
          var r = Object.getOwnPropertyDescriptors(e),
            n = {};
          P(r, (r, a) => {
            var o;
            !1 !== (o = t(r, a, e)) && (n[a] = o || r);
          }),
            Object.defineProperties(e, n);
        };
      var I,
        M,
        W,
        z,
        J = f("AsyncFunction"),
        H =
          ((I = "function" == typeof setImmediate),
          (M = y(N.postMessage)),
          I
            ? setImmediate
            : M
            ? ((W = "axios@".concat(Math.random())),
              (z = []),
              N.addEventListener(
                "message",
                (e) => {
                  var { source: t, data: r } = e;
                  t === N && r === W && z.length && z.shift()();
                },
                !1
              ),
              (e) => {
                z.push(e), N.postMessage(W, "*");
              })
            : (e) => setTimeout(e)),
        $ =
          "undefined" != typeof queueMicrotask
            ? queueMicrotask.bind(N)
            : ("undefined" != typeof process && process.nextTick) || H,
        K = {
          isArray: h,
          isArrayBuffer: m,
          isBuffer: function (e) {
            return (
              null !== e &&
              !p(e) &&
              null !== e.constructor &&
              !p(e.constructor) &&
              y(e.constructor.isBuffer) &&
              e.constructor.isBuffer(e)
            );
          },
          isFormData: (e) => {
            var t;
            return (
              e &&
              (("function" == typeof FormData && e instanceof FormData) ||
                (y(e.append) &&
                  ("formdata" === (t = c(e)) ||
                    ("object" === t &&
                      y(e.toString) &&
                      "[object FormData]" === e.toString()))))
            );
          },
          isArrayBufferView: function (e) {
            return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView
              ? ArrayBuffer.isView(e)
              : e && e.buffer && m(e.buffer);
          },
          isString: v,
          isNumber: g,
          isBoolean: (e) => !0 === e || !1 === e,
          isObject: b,
          isPlainObject: w,
          isReadableStream: T,
          isRequest: x,
          isResponse: C,
          isHeaders: _,
          isUndefined: p,
          isDate: E,
          isFile: R,
          isBlob: O,
          isRegExp: D,
          isFunction: y,
          isStream: (e) => b(e) && y(e.pipe),
          isURLSearchParams: A,
          isTypedArray: B,
          isFileList: S,
          forEach: P,
          merge: function e() {
            for (
              var { caseless: t } = (U(this) && this) || {},
                r = {},
                n = (n, a) => {
                  var o = (t && j(r, a)) || a;
                  w(r[o]) && w(n)
                    ? (r[o] = e(r[o], n))
                    : w(n)
                    ? (r[o] = e({}, n))
                    : h(n)
                    ? (r[o] = n.slice())
                    : (r[o] = n);
                },
                a = 0,
                o = arguments.length;
              a < o;
              a++
            )
              arguments[a] && P(arguments[a], n);
            return r;
          },
          extend: function (e, t, r) {
            var { allOwnKeys: n } =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : {};
            return (
              P(
                t,
                (t, n) => {
                  r && y(t) ? (e[n] = a(t, r)) : (e[n] = t);
                },
                { allOwnKeys: n }
              ),
              e
            );
          },
          trim: (e) =>
            e.trim
              ? e.trim()
              : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""),
          stripBOM: (e) => (65279 === e.charCodeAt(0) && (e = e.slice(1)), e),
          inherits: (e, t, r, n) => {
            (e.prototype = Object.create(t.prototype, n)),
              (e.prototype.constructor = e),
              Object.defineProperty(e, "super", { value: t.prototype }),
              r && Object.assign(e.prototype, r);
          },
          toFlatObject: (e, t, r, n) => {
            var a,
              o,
              i,
              u = {};
            if (((t = t || {}), null == e)) return t;
            do {
              for (o = (a = Object.getOwnPropertyNames(e)).length; o-- > 0; )
                (i = a[o]),
                  (n && !n(i, e, t)) || u[i] || ((t[i] = e[i]), (u[i] = !0));
              e = !1 !== r && s(e);
            } while (e && (!r || r(e, t)) && e !== Object.prototype);
            return t;
          },
          kindOf: c,
          kindOfTest: f,
          endsWith: (e, t, r) => {
            (e = String(e)),
              (void 0 === r || r > e.length) && (r = e.length),
              (r -= t.length);
            var n = e.indexOf(t, r);
            return -1 !== n && n === r;
          },
          toArray: (e) => {
            if (!e) return null;
            if (h(e)) return e;
            var t = e.length;
            if (!g(t)) return null;
            for (var r = new Array(t); t-- > 0; ) r[t] = e[t];
            return r;
          },
          forEachEntry: (e, t) => {
            for (var r, n = (e && e[u]).call(e); (r = n.next()) && !r.done; ) {
              var a = r.value;
              t.call(e, a[0], a[1]);
            }
          },
          matchAll: (e, t) => {
            for (var r, n = []; null !== (r = e.exec(t)); ) n.push(r);
            return n;
          },
          isHTMLForm: L,
          hasOwnProperty: F,
          hasOwnProp: F,
          reduceDescriptors: q,
          freezeMethods: (e) => {
            q(e, (t, r) => {
              if (y(e) && -1 !== ["arguments", "caller", "callee"].indexOf(r))
                return !1;
              var n = e[r];
              y(n) &&
                ((t.enumerable = !1),
                "writable" in t
                  ? (t.writable = !1)
                  : t.set ||
                    (t.set = () => {
                      throw Error(
                        "Can not rewrite read-only method '" + r + "'"
                      );
                    }));
            });
          },
          toObjectSet: (e, t) => {
            var r = {},
              n = (e) => {
                e.forEach((e) => {
                  r[e] = !0;
                });
              };
            return h(e) ? n(e) : n(String(e).split(t)), r;
          },
          toCamelCase: (e) =>
            e
              .toLowerCase()
              .replace(/[-_\s]([a-z\d])(\w*)/g, function (e, t, r) {
                return t.toUpperCase() + r;
              }),
          noop: () => {},
          toFiniteNumber: (e, t) =>
            null != e && Number.isFinite((e = +e)) ? e : t,
          findKey: j,
          global: N,
          isContextDefined: U,
          isSpecCompliantForm: function (e) {
            return !!(e && y(e.append) && "FormData" === e[l] && e[u]);
          },
          toJSONObject: (e) => {
            var t = new Array(10),
              r = (e, n) => {
                if (b(e)) {
                  if (t.indexOf(e) >= 0) return;
                  if (!("toJSON" in e)) {
                    t[n] = e;
                    var a = h(e) ? [] : {};
                    return (
                      P(e, (e, t) => {
                        var o = r(e, n + 1);
                        !p(o) && (a[t] = o);
                      }),
                      (t[n] = void 0),
                      a
                    );
                  }
                }
                return e;
              };
            return r(e, 0);
          },
          isAsyncFn: J,
          isThenable: (e) => e && (b(e) || y(e)) && y(e.then) && y(e.catch),
          setImmediate: H,
          asap: $,
          isIterable: (e) => null != e && y(e[u]),
        },
        V = r(13454);
      function X(e, t, r, n, a) {
        Error.call(this),
          Error.captureStackTrace
            ? Error.captureStackTrace(this, this.constructor)
            : (this.stack = new Error().stack),
          (this.message = e),
          (this.name = "AxiosError"),
          t && (this.code = t),
          r && (this.config = r),
          n && (this.request = n),
          a &&
            ((this.response = a), (this.status = a.status ? a.status : null));
      }
      K.inherits(X, Error, {
        toJSON: function () {
          return {
            message: this.message,
            name: this.name,
            description: this.description,
            number: this.number,
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            config: K.toJSONObject(this.config),
            code: this.code,
            status: this.status,
          };
        },
      });
      var G = X.prototype,
        Z = {};
      [
        "ERR_BAD_OPTION_VALUE",
        "ERR_BAD_OPTION",
        "ECONNABORTED",
        "ETIMEDOUT",
        "ERR_NETWORK",
        "ERR_FR_TOO_MANY_REDIRECTS",
        "ERR_DEPRECATED",
        "ERR_BAD_RESPONSE",
        "ERR_BAD_REQUEST",
        "ERR_CANCELED",
        "ERR_NOT_SUPPORT",
        "ERR_INVALID_URL",
      ].forEach((e) => {
        Z[e] = { value: e };
      }),
        Object.defineProperties(X, Z),
        Object.defineProperty(G, "isAxiosError", { value: !0 }),
        (X.from = (e, t, r, n, a, o) => {
          var i = Object.create(G);
          return (
            K.toFlatObject(
              e,
              i,
              function (e) {
                return e !== Error.prototype;
              },
              (e) => "isAxiosError" !== e
            ),
            X.call(i, e.message, t, r, n, a),
            (i.cause = e),
            (i.name = e.name),
            o && Object.assign(i, o),
            i
          );
        });
      var Q = X,
        Y = r(42796).Buffer;
      function ee(e) {
        return K.isPlainObject(e) || K.isArray(e);
      }
      function te(e) {
        return K.endsWith(e, "[]") ? e.slice(0, -2) : e;
      }
      function re(e, t, r) {
        return e
          ? e
              .concat(t)
              .map(function (e, t) {
                return (e = te(e)), !r && t ? "[" + e + "]" : e;
              })
              .join(r ? "." : "")
          : t;
      }
      var ne = K.toFlatObject(K, {}, null, function (e) {
        return /^is[A-Z]/.test(e);
      });
      var ae = function (e, t, r) {
        if (!K.isObject(e)) throw new TypeError("target must be an object");
        t = t || new FormData();
        var n = (r = K.toFlatObject(
            r,
            { metaTokens: !0, dots: !1, indexes: !1 },
            !1,
            function (e, t) {
              return !K.isUndefined(t[e]);
            }
          )).metaTokens,
          a = r.visitor || l,
          o = r.dots,
          i = r.indexes,
          s =
            (r.Blob || ("undefined" != typeof Blob && Blob)) &&
            K.isSpecCompliantForm(t);
        if (!K.isFunction(a)) throw new TypeError("visitor must be a function");
        function u(e) {
          if (null === e) return "";
          if (K.isDate(e)) return e.toISOString();
          if (!s && K.isBlob(e))
            throw new Q("Blob is not supported. Use a Buffer instead.");
          return K.isArrayBuffer(e) || K.isTypedArray(e)
            ? s && "function" == typeof Blob
              ? new Blob([e])
              : Y.from(e)
            : e;
        }
        function l(e, r, a) {
          var s = e;
          if (e && !a && "object" == typeof e)
            if (K.endsWith(r, "{}"))
              (r = n ? r : r.slice(0, -2)), (e = JSON.stringify(e));
            else if (
              (K.isArray(e) &&
                (function (e) {
                  return K.isArray(e) && !e.some(ee);
                })(e)) ||
              ((K.isFileList(e) || K.endsWith(r, "[]")) && (s = K.toArray(e)))
            )
              return (
                (r = te(r)),
                s.forEach(function (e, n) {
                  !K.isUndefined(e) &&
                    null !== e &&
                    t.append(
                      !0 === i ? re([r], n, o) : null === i ? r : r + "[]",
                      u(e)
                    );
                }),
                !1
              );
          return !!ee(e) || (t.append(re(a, r, o), u(e)), !1);
        }
        var c = [],
          f = Object.assign(ne, {
            defaultVisitor: l,
            convertValue: u,
            isVisitable: ee,
          });
        if (!K.isObject(e)) throw new TypeError("data must be an object");
        return (
          (function e(r, n) {
            if (!K.isUndefined(r)) {
              if (-1 !== c.indexOf(r))
                throw Error("Circular reference detected in " + n.join("."));
              c.push(r),
                K.forEach(r, function (r, o) {
                  !0 ===
                    (!(K.isUndefined(r) || null === r) &&
                      a.call(t, r, K.isString(o) ? o.trim() : o, n, f)) &&
                    e(r, n ? n.concat(o) : [o]);
                }),
                c.pop();
            }
          })(e),
          t
        );
      };
      function oe(e) {
        var t = {
          "!": "%21",
          "'": "%27",
          "(": "%28",
          ")": "%29",
          "~": "%7E",
          "%20": "+",
          "%00": "\0",
        };
        return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (e) {
          return t[e];
        });
      }
      function ie(e, t) {
        (this._pairs = []), e && ae(e, this, t);
      }
      var se = ie.prototype;
      (se.append = function (e, t) {
        this._pairs.push([e, t]);
      }),
        (se.toString = function (e) {
          var t = e
            ? function (t) {
                return e.call(this, t, oe);
              }
            : oe;
          return this._pairs
            .map(function (e) {
              return t(e[0]) + "=" + t(e[1]);
            }, "")
            .join("&");
        });
      var ue = ie;
      function le(e) {
        return encodeURIComponent(e)
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",")
          .replace(/%20/g, "+")
          .replace(/%5B/gi, "[")
          .replace(/%5D/gi, "]");
      }
      function ce(e, t, r) {
        if (!t) return e;
        var n = (r && r.encode) || le;
        K.isFunction(r) && (r = { serialize: r });
        var a,
          o = r && r.serialize;
        if (
          (a = o
            ? o(t, r)
            : K.isURLSearchParams(t)
            ? t.toString()
            : new ue(t, r).toString(n))
        ) {
          var i = e.indexOf("#");
          -1 !== i && (e = e.slice(0, i)),
            (e += (-1 === e.indexOf("?") ? "?" : "&") + a);
        }
        return e;
      }
      var fe = class {
          use(e, t, r) {
            return (
              this.handlers.push({
                fulfilled: e,
                rejected: t,
                synchronous: !!r && r.synchronous,
                runWhen: r ? r.runWhen : null,
              }),
              this.handlers.length - 1
            );
          }
          eject(e) {
            this.handlers[e] && (this.handlers[e] = null);
          }
          clear() {
            this.handlers && (this.handlers = []);
          }
          forEach(e) {
            K.forEach(this.handlers, function (t) {
              null !== t && e(t);
            });
          }
          constructor() {
            this.handlers = [];
          }
        },
        de = {
          silentJSONParsing: !0,
          forcedJSONParsing: !0,
          clarifyTimeoutError: !1,
        },
        he = r(20837),
        pe = {
          isBrowser: !0,
          classes: {
            URLSearchParams:
              "undefined" != typeof URLSearchParams ? URLSearchParams : ue,
            FormData: "undefined" != typeof FormData ? FormData : null,
            Blob: "undefined" != typeof Blob ? Blob : null,
          },
          protocols: ["http", "https", "file", "blob", "url", "data"],
        },
        me = "undefined" != typeof window && "undefined" != typeof document,
        ve = ("object" == typeof navigator && navigator) || void 0,
        ye =
          me &&
          (!ve ||
            ["ReactNative", "NativeScript", "NS"].indexOf(ve.product) < 0),
        ge =
          "undefined" != typeof WorkerGlobalScope &&
          self instanceof WorkerGlobalScope &&
          "function" == typeof self.importScripts,
        be = (me && window.location.href) || "http://localhost",
        we = (0, he._)({}, n, pe);
      var Ee = function (e) {
        function t(e, r, n, a) {
          var o = e[a++];
          if ("__proto__" === o) return !0;
          var i = Number.isFinite(+o),
            s = a >= e.length;
          return (
            (o = !o && K.isArray(n) ? n.length : o),
            s
              ? (K.hasOwnProp(n, o) ? (n[o] = [n[o], r]) : (n[o] = r), !i)
              : ((n[o] && K.isObject(n[o])) || (n[o] = []),
                t(e, r, n[o], a) &&
                  K.isArray(n[o]) &&
                  (n[o] = (function (e) {
                    var t,
                      r,
                      n = {},
                      a = Object.keys(e),
                      o = a.length;
                    for (t = 0; t < o; t++) n[(r = a[t])] = e[r];
                    return n;
                  })(n[o])),
                !i)
          );
        }
        if (K.isFormData(e) && K.isFunction(e.entries)) {
          var r = {};
          return (
            K.forEachEntry(e, (e, n) => {
              t(
                (function (e) {
                  return K.matchAll(/\w+|\[(\w*)]/g, e).map((e) =>
                    "[]" === e[0] ? "" : e[1] || e[0]
                  );
                })(e),
                n,
                r,
                0
              );
            }),
            r
          );
        }
        return null;
      };
      var Re = {
        transitional: de,
        adapter: ["xhr", "http", "fetch"],
        transformRequest: [
          function (e, t) {
            var r,
              n = t.getContentType() || "",
              a = n.indexOf("application/json") > -1,
              o = K.isObject(e);
            if (
              (o && K.isHTMLForm(e) && (e = new FormData(e)), K.isFormData(e))
            )
              return a ? JSON.stringify(Ee(e)) : e;
            if (
              K.isArrayBuffer(e) ||
              K.isBuffer(e) ||
              K.isStream(e) ||
              K.isFile(e) ||
              K.isBlob(e) ||
              K.isReadableStream(e)
            )
              return e;
            if (K.isArrayBufferView(e)) return e.buffer;
            if (K.isURLSearchParams(e))
              return (
                t.setContentType(
                  "application/x-www-form-urlencoded;charset=utf-8",
                  !1
                ),
                e.toString()
              );
            if (o) {
              if (n.indexOf("application/x-www-form-urlencoded") > -1)
                return (function (e, t) {
                  return ae(
                    e,
                    new we.classes.URLSearchParams(),
                    Object.assign(
                      {
                        visitor: function (e, t, r, n) {
                          return we.isNode && K.isBuffer(e)
                            ? (this.append(t, e.toString("base64")), !1)
                            : n.defaultVisitor.apply(this, arguments);
                        },
                      },
                      t
                    )
                  );
                })(e, this.formSerializer).toString();
              if (
                (r = K.isFileList(e)) ||
                n.indexOf("multipart/form-data") > -1
              ) {
                var i = this.env && this.env.FormData;
                return ae(
                  r ? { "files[]": e } : e,
                  i && new i(),
                  this.formSerializer
                );
              }
            }
            return o || a
              ? (t.setContentType("application/json", !1),
                (function (e, t, r) {
                  if (K.isString(e))
                    try {
                      return (t || JSON.parse)(e), K.trim(e);
                    } catch (e) {
                      if ("SyntaxError" !== e.name) throw e;
                    }
                  return (r || JSON.stringify)(e);
                })(e))
              : e;
          },
        ],
        transformResponse: [
          function (e) {
            var t = this.transitional || Re.transitional,
              r = t && t.forcedJSONParsing,
              n = "json" === this.responseType;
            if (K.isResponse(e) || K.isReadableStream(e)) return e;
            if (e && K.isString(e) && ((r && !this.responseType) || n)) {
              var a = !(t && t.silentJSONParsing) && n;
              try {
                return JSON.parse(e);
              } catch (e) {
                if (a) {
                  if ("SyntaxError" === e.name)
                    throw Q.from(
                      e,
                      Q.ERR_BAD_RESPONSE,
                      this,
                      null,
                      this.response
                    );
                  throw e;
                }
              }
            }
            return e;
          },
        ],
        timeout: 0,
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
        maxContentLength: -1,
        maxBodyLength: -1,
        env: { FormData: we.classes.FormData, Blob: we.classes.Blob },
        validateStatus: function (e) {
          return e >= 200 && e < 300;
        },
        headers: {
          common: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": void 0,
          },
        },
      };
      K.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
        Re.headers[e] = {};
      });
      var Oe = Re,
        Se = K.toObjectSet([
          "age",
          "authorization",
          "content-length",
          "content-type",
          "etag",
          "expires",
          "from",
          "host",
          "if-modified-since",
          "if-unmodified-since",
          "last-modified",
          "location",
          "max-forwards",
          "proxy-authorization",
          "referer",
          "retry-after",
          "user-agent",
        ]),
        Ae = Symbol("internals");
      function Te(e) {
        return e && String(e).trim().toLowerCase();
      }
      function xe(e) {
        return !1 === e || null == e ? e : K.isArray(e) ? e.map(xe) : String(e);
      }
      function Ce(e, t, r, n, a) {
        return K.isFunction(n)
          ? n.call(this, t, r)
          : (a && (t = r),
            K.isString(t)
              ? K.isString(n)
                ? -1 !== t.indexOf(n)
                : K.isRegExp(n)
                ? n.test(t)
                : void 0
              : void 0);
      }
      class _e {
        set(e, t, r) {
          var n = this;
          function a(e, t, r) {
            var a = Te(t);
            if (!a) throw new Error("header name must be a non-empty string");
            var o = K.findKey(n, a);
            (!o ||
              void 0 === n[o] ||
              !0 === r ||
              (void 0 === r && !1 !== n[o])) &&
              (n[o || t] = xe(e));
          }
          var o = (e, t) => K.forEach(e, (e, r) => a(e, r, t));
          if (K.isPlainObject(e) || e instanceof this.constructor) o(e, t);
          else if (
            K.isString(e) &&
            (e = e.trim()) &&
            !/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim())
          )
            o(
              ((e) => {
                var t,
                  r,
                  n,
                  a = {};
                return (
                  e &&
                    e.split("\n").forEach(function (e) {
                      (n = e.indexOf(":")),
                        (t = e.substring(0, n).trim().toLowerCase()),
                        (r = e.substring(n + 1).trim()),
                        !t ||
                          (a[t] && Se[t]) ||
                          ("set-cookie" === t
                            ? a[t]
                              ? a[t].push(r)
                              : (a[t] = [r])
                            : (a[t] = a[t] ? a[t] + ", " + r : r));
                    }),
                  a
                );
              })(e),
              t
            );
          else if (K.isObject(e) && K.isIterable(e)) {
            var i,
              s,
              u = {};
            for (var l of e) {
              if (!K.isArray(l))
                throw TypeError("Object iterator must return a key-value pair");
              u[(s = l[0])] = (i = u[s])
                ? K.isArray(i)
                  ? [...i, l[1]]
                  : [i, l[1]]
                : l[1];
            }
            o(u, t);
          } else null != e && a(t, e, r);
          return this;
        }
        get(e, t) {
          if ((e = Te(e))) {
            var r = K.findKey(this, e);
            if (r) {
              var n = this[r];
              if (!t) return n;
              if (!0 === t)
                return (function (e) {
                  for (
                    var t,
                      r = Object.create(null),
                      n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
                    (t = n.exec(e));

                  )
                    r[t[1]] = t[2];
                  return r;
                })(n);
              if (K.isFunction(t)) return t.call(this, n, r);
              if (K.isRegExp(t)) return t.exec(n);
              throw new TypeError("parser must be boolean|regexp|function");
            }
          }
        }
        has(e, t) {
          if ((e = Te(e))) {
            var r = K.findKey(this, e);
            return !(!r || void 0 === this[r] || (t && !Ce(0, this[r], r, t)));
          }
          return !1;
        }
        delete(e, t) {
          var r = this,
            n = !1;
          function a(e) {
            if ((e = Te(e))) {
              var a = K.findKey(r, e);
              !a || (t && !Ce(0, r[a], a, t)) || (delete r[a], (n = !0));
            }
          }
          return K.isArray(e) ? e.forEach(a) : a(e), n;
        }
        clear(e) {
          for (var t = Object.keys(this), r = t.length, n = !1; r--; ) {
            var a = t[r];
            (e && !Ce(0, this[a], a, e, !0)) || (delete this[a], (n = !0));
          }
          return n;
        }
        normalize(e) {
          var t = this,
            r = {};
          return (
            K.forEach(this, (n, a) => {
              var o = K.findKey(r, a);
              if (o) return (t[o] = xe(n)), void delete t[a];
              var i = e
                ? (function (e) {
                    return e
                      .trim()
                      .toLowerCase()
                      .replace(
                        /([a-z\d])(\w*)/g,
                        (e, t, r) => t.toUpperCase() + r
                      );
                  })(a)
                : String(a).trim();
              i !== a && delete t[a], (t[i] = xe(n)), (r[i] = !0);
            }),
            this
          );
        }
        concat() {
          for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
            t[r] = arguments[r];
          return this.constructor.concat(this, ...t);
        }
        toJSON(e) {
          var t = Object.create(null);
          return (
            K.forEach(this, (r, n) => {
              null != r &&
                !1 !== r &&
                (t[n] = e && K.isArray(r) ? r.join(", ") : r);
            }),
            t
          );
        }
        [Symbol.iterator]() {
          return Object.entries(this.toJSON())[Symbol.iterator]();
        }
        toString() {
          return Object.entries(this.toJSON())
            .map((e) => {
              var [t, r] = e;
              return t + ": " + r;
            })
            .join("\n");
        }
        getSetCookie() {
          return this.get("set-cookie") || [];
        }
        get [Symbol.toStringTag]() {
          return "AxiosHeaders";
        }
        static from(e) {
          return e instanceof this ? e : new this(e);
        }
        static concat(e) {
          for (
            var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1;
            n < t;
            n++
          )
            r[n - 1] = arguments[n];
          var a = new this(e);
          return r.forEach((e) => a.set(e)), a;
        }
        static accessor(e) {
          var t = (this[Ae] = this[Ae] = { accessors: {} }).accessors,
            r = this.prototype;
          function n(e) {
            var n = Te(e);
            t[n] ||
              (!(function (e, t) {
                var r = K.toCamelCase(" " + t);
                ["get", "set", "has"].forEach((n) => {
                  Object.defineProperty(e, n + r, {
                    value: function (e, r, a) {
                      return this[n].call(this, t, e, r, a);
                    },
                    configurable: !0,
                  });
                });
              })(r, e),
              (t[n] = !0));
          }
          return K.isArray(e) ? e.forEach(n) : n(e), this;
        }
        constructor(e) {
          e && this.set(e);
        }
      }
      _e.accessor([
        "Content-Type",
        "Content-Length",
        "Accept",
        "Accept-Encoding",
        "User-Agent",
        "Authorization",
      ]),
        K.reduceDescriptors(_e.prototype, (e, t) => {
          var { value: r } = e,
            n = t[0].toUpperCase() + t.slice(1);
          return {
            get: () => r,
            set(e) {
              this[n] = e;
            },
          };
        }),
        K.freezeMethods(_e);
      var Pe = _e;
      function je(e, t) {
        var r = this || Oe,
          n = t || r,
          a = Pe.from(n.headers),
          o = n.data;
        return (
          K.forEach(e, function (e) {
            o = e.call(r, o, a.normalize(), t ? t.status : void 0);
          }),
          a.normalize(),
          o
        );
      }
      function Ne(e) {
        return !(!e || !e.__CANCEL__);
      }
      function Ue(e, t, r) {
        Q.call(this, null == e ? "canceled" : e, Q.ERR_CANCELED, t, r),
          (this.name = "CanceledError");
      }
      K.inherits(Ue, Q, { __CANCEL__: !0 });
      var ke = Ue;
      function Be(e, t, r) {
        var n = r.config.validateStatus;
        r.status && n && !n(r.status)
          ? t(
              new Q(
                "Request failed with status code " + r.status,
                [Q.ERR_BAD_REQUEST, Q.ERR_BAD_RESPONSE][
                  Math.floor(r.status / 100) - 4
                ],
                r.config,
                r.request,
                r
              )
            )
          : e(r);
      }
      var Le = function (e, t) {
        e = e || 10;
        var r,
          n = new Array(e),
          a = new Array(e),
          o = 0,
          i = 0;
        return (
          (t = void 0 !== t ? t : 1e3),
          function (s) {
            var u = Date.now(),
              l = a[i];
            r || (r = u), (n[o] = s), (a[o] = u);
            for (var c = i, f = 0; c !== o; ) (f += n[c++]), (c %= e);
            if (((o = (o + 1) % e) === i && (i = (i + 1) % e), !(u - r < t))) {
              var d = l && u - l;
              return d ? Math.round((1e3 * f) / d) : void 0;
            }
          }
        );
      };
      var Fe,
        De,
        qe = function (e, t) {
          var r,
            n,
            a = 0,
            o = 1e3 / t,
            i = function (t) {
              var o =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : Date.now();
              (a = o),
                (r = null),
                n && (clearTimeout(n), (n = null)),
                e.apply(null, t);
            };
          return [
            function () {
              for (
                var e = arguments.length, t = new Array(e), s = 0;
                s < e;
                s++
              )
                t[s] = arguments[s];
              var u = Date.now(),
                l = u - a;
              l >= o
                ? i(t, u)
                : ((r = t),
                  n ||
                    (n = setTimeout(() => {
                      (n = null), i(r);
                    }, o - l)));
            },
            () => r && i(r),
          ];
        },
        Ie = function (e, t) {
          var r =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : 3,
            n = 0,
            a = Le(50, 250);
          return qe((r) => {
            var o = r.loaded,
              i = r.lengthComputable ? r.total : void 0,
              s = o - n,
              u = a(s);
            (n = o),
              e({
                loaded: o,
                total: i,
                progress: i ? o / i : void 0,
                bytes: s,
                rate: u || void 0,
                estimated: u && i && o <= i ? (i - o) / u : void 0,
                event: r,
                lengthComputable: null != i,
                [t ? "download" : "upload"]: !0,
              });
          }, r);
        },
        Me = (e, t) => {
          var r = null != e;
          return [
            (n) => t[0]({ lengthComputable: r, total: e, loaded: n }),
            t[1],
          ];
        },
        We = (e) =>
          function () {
            for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
              r[n] = arguments[n];
            return K.asap(() => e(...r));
          },
        ze = we.hasStandardBrowserEnv
          ? ((Fe = new URL(we.origin)),
            (De =
              we.navigator && /(msie|trident)/i.test(we.navigator.userAgent)),
            (e) => (
              (e = new URL(e, we.origin)),
              Fe.protocol === e.protocol &&
                Fe.host === e.host &&
                (De || Fe.port === e.port)
            ))
          : () => !0,
        Je = we.hasStandardBrowserEnv
          ? {
              write(e, t, r, n, a, o) {
                var i = [e + "=" + encodeURIComponent(t)];
                K.isNumber(r) && i.push("expires=" + new Date(r).toGMTString()),
                  K.isString(n) && i.push("path=" + n),
                  K.isString(a) && i.push("domain=" + a),
                  !0 === o && i.push("secure"),
                  (document.cookie = i.join("; "));
              },
              read(e) {
                var t = document.cookie.match(
                  new RegExp("(^|;\\s*)(" + e + ")=([^;]*)")
                );
                return t ? decodeURIComponent(t[3]) : null;
              },
              remove(e) {
                this.write(e, "", Date.now() - 864e5);
              },
            }
          : { write() {}, read: () => null, remove() {} };
      function He(e, t, r) {
        var n = !/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t);
        return e && (n || 0 == r)
          ? (function (e, t) {
              return t
                ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "")
                : e;
            })(e, t)
          : t;
      }
      var $e = (e) => (e instanceof Pe ? (0, he._)({}, e) : e);
      function Ke(e, t) {
        t = t || {};
        var r = {};
        function n(e, t, r, n) {
          return K.isPlainObject(e) && K.isPlainObject(t)
            ? K.merge.call({ caseless: n }, e, t)
            : K.isPlainObject(t)
            ? K.merge({}, t)
            : K.isArray(t)
            ? t.slice()
            : t;
        }
        function a(e, t, r, a) {
          return K.isUndefined(t)
            ? K.isUndefined(e)
              ? void 0
              : n(void 0, e, 0, a)
            : n(e, t, 0, a);
        }
        function o(e, t) {
          if (!K.isUndefined(t)) return n(void 0, t);
        }
        function i(e, t) {
          return K.isUndefined(t)
            ? K.isUndefined(e)
              ? void 0
              : n(void 0, e)
            : n(void 0, t);
        }
        function s(r, a, o) {
          return o in t ? n(r, a) : o in e ? n(void 0, r) : void 0;
        }
        var u = {
          url: o,
          method: o,
          data: o,
          baseURL: i,
          transformRequest: i,
          transformResponse: i,
          paramsSerializer: i,
          timeout: i,
          timeoutMessage: i,
          withCredentials: i,
          withXSRFToken: i,
          adapter: i,
          responseType: i,
          xsrfCookieName: i,
          xsrfHeaderName: i,
          onUploadProgress: i,
          onDownloadProgress: i,
          decompress: i,
          maxContentLength: i,
          maxBodyLength: i,
          beforeRedirect: i,
          transport: i,
          httpAgent: i,
          httpsAgent: i,
          cancelToken: i,
          socketPath: i,
          responseEncoding: i,
          validateStatus: s,
          headers: (e, t, r) => a($e(e), $e(t), 0, !0),
        };
        return (
          K.forEach(Object.keys(Object.assign({}, e, t)), function (n) {
            var o = u[n] || a,
              i = o(e[n], t[n], n);
            (K.isUndefined(i) && o !== s) || (r[n] = i);
          }),
          r
        );
      }
      var Ve,
        Xe,
        Ge = (e) => {
          var t,
            r = Ke({}, e),
            {
              data: n,
              withXSRFToken: a,
              xsrfHeaderName: o,
              xsrfCookieName: i,
              headers: s,
              auth: u,
            } = r;
          if (
            ((r.headers = s = Pe.from(s)),
            (r.url = ce(
              He(r.baseURL, r.url, r.allowAbsoluteUrls),
              e.params,
              e.paramsSerializer
            )),
            u &&
              s.set(
                "Authorization",
                "Basic " +
                  btoa(
                    (u.username || "") +
                      ":" +
                      (u.password
                        ? unescape(encodeURIComponent(u.password))
                        : "")
                  )
              ),
            K.isFormData(n))
          )
            if (we.hasStandardBrowserEnv || we.hasStandardBrowserWebWorkerEnv)
              s.setContentType(void 0);
            else if (!1 !== (t = s.getContentType())) {
              var [l, ...c] = t
                ? t
                    .split(";")
                    .map((e) => e.trim())
                    .filter(Boolean)
                : [];
              s.setContentType([l || "multipart/form-data", ...c].join("; "));
            }
          if (
            we.hasStandardBrowserEnv &&
            (a && K.isFunction(a) && (a = a(r)), a || (!1 !== a && ze(r.url)))
          ) {
            var f = o && i && Je.read(i);
            f && s.set(o, f);
          }
          return r;
        },
        Ze =
          "undefined" != typeof XMLHttpRequest &&
          function (e) {
            return new Promise(function (t, r) {
              var n,
                a,
                o,
                i,
                s,
                u = Ge(e),
                l = u.data,
                c = Pe.from(u.headers).normalize(),
                {
                  responseType: f,
                  onUploadProgress: d,
                  onDownloadProgress: h,
                } = u;
              function p() {
                i && i(),
                  s && s(),
                  u.cancelToken && u.cancelToken.unsubscribe(n),
                  u.signal && u.signal.removeEventListener("abort", n);
              }
              var m = new XMLHttpRequest();
              function v() {
                if (m) {
                  var n = Pe.from(
                    "getAllResponseHeaders" in m && m.getAllResponseHeaders()
                  );
                  Be(
                    function (e) {
                      t(e), p();
                    },
                    function (e) {
                      r(e), p();
                    },
                    {
                      data:
                        f && "text" !== f && "json" !== f
                          ? m.response
                          : m.responseText,
                      status: m.status,
                      statusText: m.statusText,
                      headers: n,
                      config: e,
                      request: m,
                    }
                  ),
                    (m = null);
                }
              }
              m.open(u.method.toUpperCase(), u.url, !0),
                (m.timeout = u.timeout),
                "onloadend" in m
                  ? (m.onloadend = v)
                  : (m.onreadystatechange = function () {
                      m &&
                        4 === m.readyState &&
                        (0 !== m.status ||
                          (m.responseURL &&
                            0 === m.responseURL.indexOf("file:"))) &&
                        setTimeout(v);
                    }),
                (m.onabort = function () {
                  m &&
                    (r(new Q("Request aborted", Q.ECONNABORTED, e, m)),
                    (m = null));
                }),
                (m.onerror = function () {
                  r(new Q("Network Error", Q.ERR_NETWORK, e, m)), (m = null);
                }),
                (m.ontimeout = function () {
                  var t = u.timeout
                      ? "timeout of " + u.timeout + "ms exceeded"
                      : "timeout exceeded",
                    n = u.transitional || de;
                  u.timeoutErrorMessage && (t = u.timeoutErrorMessage),
                    r(
                      new Q(
                        t,
                        n.clarifyTimeoutError ? Q.ETIMEDOUT : Q.ECONNABORTED,
                        e,
                        m
                      )
                    ),
                    (m = null);
                }),
                void 0 === l && c.setContentType(null),
                "setRequestHeader" in m &&
                  K.forEach(c.toJSON(), function (e, t) {
                    m.setRequestHeader(t, e);
                  }),
                K.isUndefined(u.withCredentials) ||
                  (m.withCredentials = !!u.withCredentials),
                f && "json" !== f && (m.responseType = u.responseType),
                h && (([o, s] = Ie(h, !0)), m.addEventListener("progress", o)),
                d &&
                  m.upload &&
                  (([a, i] = Ie(d)),
                  m.upload.addEventListener("progress", a),
                  m.upload.addEventListener("loadend", i)),
                (u.cancelToken || u.signal) &&
                  ((n = (t) => {
                    m &&
                      (r(!t || t.type ? new ke(null, e, m) : t),
                      m.abort(),
                      (m = null));
                  }),
                  u.cancelToken && u.cancelToken.subscribe(n),
                  u.signal &&
                    (u.signal.aborted
                      ? n()
                      : u.signal.addEventListener("abort", n)));
              var y,
                g,
                b =
                  ((y = u.url),
                  ((g = /^([-+\w]{1,25})(:?\/\/|:)/.exec(y)) && g[1]) || "");
              b && -1 === we.protocols.indexOf(b)
                ? r(
                    new Q(
                      "Unsupported protocol " + b + ":",
                      Q.ERR_BAD_REQUEST,
                      e
                    )
                  )
                : m.send(l || null);
            });
          },
        Qe = r(43952),
        Ye = (e, t) => {
          var { length: r } = (e = e ? e.filter(Boolean) : []);
          if (t || r) {
            var n,
              a = new AbortController(),
              o = function (e) {
                if (!n) {
                  (n = !0), s();
                  var t = e instanceof Error ? e : this.reason;
                  a.abort(
                    t instanceof Q
                      ? t
                      : new ke(t instanceof Error ? t.message : t)
                  );
                }
              },
              i =
                t &&
                setTimeout(() => {
                  (i = null),
                    o(
                      new Q(
                        "timeout ".concat(t, " of ms exceeded"),
                        Q.ETIMEDOUT
                      )
                    );
                }, t),
              s = () => {
                e &&
                  (i && clearTimeout(i),
                  (i = null),
                  e.forEach((e) => {
                    e.unsubscribe
                      ? e.unsubscribe(o)
                      : e.removeEventListener("abort", o);
                  }),
                  (e = null));
              };
            e.forEach((e) => e.addEventListener("abort", o));
            var { signal: u } = a;
            return (u.unsubscribe = () => K.asap(s)), u;
          }
        },
        et = r(82244),
        tt = r(75895),
        rt = r(42121),
        nt = r(17329),
        at = function* (e, t) {
          var r = e.byteLength;
          if (!t || r < t) yield e;
          else
            for (var n, a = 0; a < r; )
              (n = a + t), yield e.slice(a, n), (a = n);
        },
        ot = function (e) {
          return (0, nt._)(function* () {
            if (e[Symbol.asyncIterator]) yield* (0, et._)((0, tt._)(e));
            else {
              var t = e.getReader();
              try {
                for (;;) {
                  var { done: r, value: n } = yield (0, rt._)(t.read());
                  if (r) break;
                  yield n;
                }
              } finally {
                yield (0, rt._)(t.cancel());
              }
            }
          })();
        },
        it = (e, t, r, n) => {
          var a,
            o = (function (e, t) {
              return (0, nt._)(function* () {
                var r,
                  n = !1,
                  a = !1;
                try {
                  for (
                    var o, i = (0, tt._)(ot(e));
                    (n = !(o = yield (0, rt._)(i.next())).done);
                    n = !1
                  ) {
                    var s = o.value;
                    yield* (0, et._)((0, tt._)(at(s, t)));
                  }
                } catch (e) {
                  (a = !0), (r = e);
                } finally {
                  try {
                    n && null != i.return && (yield (0, rt._)(i.return()));
                  } finally {
                    if (a) throw r;
                  }
                }
              })();
            })(e, t),
            i = 0,
            s = (e) => {
              a || ((a = !0), n && n(e));
            };
          return new ReadableStream(
            {
              pull: (e) =>
                (0, V._)(function* () {
                  try {
                    var { done: t, value: n } = yield o.next();
                    if (t) return s(), void e.close();
                    var a = n.byteLength;
                    if (r) {
                      var u = (i += a);
                      r(u);
                    }
                    e.enqueue(new Uint8Array(n));
                  } catch (e) {
                    throw (s(e), e);
                  }
                })(),
              cancel: (e) => (s(e), o.return()),
            },
            { highWaterMark: 2 }
          );
        },
        st =
          "function" == typeof fetch &&
          "function" == typeof Request &&
          "function" == typeof Response,
        ut = st && "function" == typeof ReadableStream,
        lt =
          st &&
          ("function" == typeof TextEncoder
            ? ((Ve = new TextEncoder()), (e) => Ve.encode(e))
            : (e) =>
                (0, V._)(function* () {
                  return new Uint8Array(yield new Response(e).arrayBuffer());
                })()),
        ct = function (e) {
          for (
            var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1;
            n < t;
            n++
          )
            r[n - 1] = arguments[n];
          try {
            return !!e(...r);
          } catch (e) {
            return !1;
          }
        },
        ft =
          ut &&
          ct(() => {
            var e = !1,
              t = new Request(we.origin, {
                body: new ReadableStream(),
                method: "POST",
                get duplex() {
                  return (e = !0), "half";
                },
              }).headers.has("Content-Type");
            return e && !t;
          }),
        dt = ut && ct(() => K.isReadableStream(new Response("").body)),
        ht = { stream: dt && ((e) => e.body) };
      st &&
        ((Xe = new Response()),
        ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((e) => {
          !ht[e] &&
            (ht[e] = K.isFunction(Xe[e])
              ? (t) => t[e]()
              : (t, r) => {
                  throw new Q(
                    "Response type '".concat(e, "' is not supported"),
                    Q.ERR_NOT_SUPPORT,
                    r
                  );
                });
        }));
      var pt = (e, t) =>
          (0, V._)(function* () {
            var r = K.toFiniteNumber(e.getContentLength());
            return null == r
              ? ((e) =>
                  (0, V._)(function* () {
                    if (null == e) return 0;
                    if (K.isBlob(e)) return e.size;
                    if (K.isSpecCompliantForm(e)) {
                      var t = new Request(we.origin, {
                        method: "POST",
                        body: e,
                      });
                      return (yield t.arrayBuffer()).byteLength;
                    }
                    return K.isArrayBufferView(e) || K.isArrayBuffer(e)
                      ? e.byteLength
                      : (K.isURLSearchParams(e) && (e += ""),
                        K.isString(e) ? (yield lt(e)).byteLength : void 0);
                  })())(t)
              : r;
          })(),
        mt = {
          http: null,
          xhr: Ze,
          fetch:
            st &&
            ((e) =>
              (0, V._)(function* () {
                var {
                  url: t,
                  method: r,
                  data: n,
                  signal: a,
                  cancelToken: o,
                  timeout: i,
                  onDownloadProgress: s,
                  onUploadProgress: u,
                  responseType: l,
                  headers: c,
                  withCredentials: f = "same-origin",
                  fetchOptions: d,
                } = Ge(e);
                l = l ? (l + "").toLowerCase() : "text";
                var h,
                  p,
                  m = Ye([a, o && o.toAbortSignal()], i),
                  v =
                    m &&
                    m.unsubscribe &&
                    (() => {
                      m.unsubscribe();
                    });
                try {
                  if (
                    u &&
                    ft &&
                    "get" !== r &&
                    "head" !== r &&
                    0 !== (p = yield pt(c, n))
                  ) {
                    var y,
                      g = new Request(t, {
                        method: "POST",
                        body: n,
                        duplex: "half",
                      });
                    if (
                      (K.isFormData(n) &&
                        (y = g.headers.get("content-type")) &&
                        c.setContentType(y),
                      g.body)
                    ) {
                      var [b, w] = Me(p, Ie(We(u)));
                      n = it(g.body, 65536, b, w);
                    }
                  }
                  K.isString(f) || (f = f ? "include" : "omit");
                  var E = "credentials" in Request.prototype;
                  h = new Request(
                    t,
                    (0, Qe._)((0, he._)({}, d), {
                      signal: m,
                      method: r.toUpperCase(),
                      headers: c.normalize().toJSON(),
                      body: n,
                      duplex: "half",
                      credentials: E ? f : void 0,
                    })
                  );
                  var R = yield fetch(h),
                    O = dt && ("stream" === l || "response" === l);
                  if (dt && (s || (O && v))) {
                    var S = {};
                    ["status", "statusText", "headers"].forEach((e) => {
                      S[e] = R[e];
                    });
                    var A = K.toFiniteNumber(R.headers.get("content-length")),
                      [T, x] = (s && Me(A, Ie(We(s), !0))) || [];
                    R = new Response(
                      it(R.body, 65536, T, () => {
                        x && x(), v && v();
                      }),
                      S
                    );
                  }
                  l = l || "text";
                  var C = yield ht[K.findKey(ht, l) || "text"](R, e);
                  return (
                    !O && v && v(),
                    yield new Promise((t, r) => {
                      Be(t, r, {
                        data: C,
                        headers: Pe.from(R.headers),
                        status: R.status,
                        statusText: R.statusText,
                        config: e,
                        request: h,
                      });
                    })
                  );
                } catch (t) {
                  if (
                    (v && v(),
                    t &&
                      "TypeError" === t.name &&
                      /Load failed|fetch/i.test(t.message))
                  )
                    throw Object.assign(
                      new Q("Network Error", Q.ERR_NETWORK, e, h),
                      { cause: t.cause || t }
                    );
                  throw Q.from(t, t && t.code, e, h);
                }
              })()),
        };
      K.forEach(mt, (e, t) => {
        if (e) {
          try {
            Object.defineProperty(e, "name", { value: t });
          } catch (e) {}
          Object.defineProperty(e, "adapterName", { value: t });
        }
      });
      var vt = (e) => "- ".concat(e),
        yt = (e) => K.isFunction(e) || null === e || !1 === e,
        gt = (e) => {
          e = K.isArray(e) ? e : [e];
          for (var t, r, { length: n } = e, a = {}, o = 0; o < n; o++) {
            var i = void 0;
            if (
              ((r = t = e[o]),
              !yt(t) && void 0 === (r = mt[(i = String(t)).toLowerCase()]))
            )
              throw new Q("Unknown adapter '".concat(i, "'"));
            if (r) break;
            a[i || "#" + o] = r;
          }
          if (!r) {
            var s = Object.entries(a).map((e) => {
                var [t, r] = e;
                return (
                  "adapter ".concat(t, " ") +
                  (!1 === r
                    ? "is not supported by the environment"
                    : "is not available in the build")
                );
              }),
              u = n
                ? s.length > 1
                  ? "since :\n" + s.map(vt).join("\n")
                  : " " + vt(s[0])
                : "as no adapter specified";
            throw new Q(
              "There is no suitable adapter to dispatch the request " + u,
              "ERR_NOT_SUPPORT"
            );
          }
          return r;
        };
      function bt(e) {
        if (
          (e.cancelToken && e.cancelToken.throwIfRequested(),
          e.signal && e.signal.aborted)
        )
          throw new ke(null, e);
      }
      function wt(e) {
        return (
          bt(e),
          (e.headers = Pe.from(e.headers)),
          (e.data = je.call(e, e.transformRequest)),
          -1 !== ["post", "put", "patch"].indexOf(e.method) &&
            e.headers.setContentType("application/x-www-form-urlencoded", !1),
          gt(e.adapter || Oe.adapter)(e).then(
            function (t) {
              return (
                bt(e),
                (t.data = je.call(e, e.transformResponse, t)),
                (t.headers = Pe.from(t.headers)),
                t
              );
            },
            function (t) {
              return (
                Ne(t) ||
                  (bt(e),
                  t &&
                    t.response &&
                    ((t.response.data = je.call(
                      e,
                      e.transformResponse,
                      t.response
                    )),
                    (t.response.headers = Pe.from(t.response.headers)))),
                Promise.reject(t)
              );
            }
          )
        );
      }
      var Et = "1.9.0",
        Rt = {};
      ["object", "boolean", "number", "function", "string", "symbol"].forEach(
        (e, t) => {
          Rt[e] = function (r) {
            return typeof r === e || "a" + (t < 1 ? "n " : " ") + e;
          };
        }
      );
      var Ot = {};
      (Rt.transitional = function (e, t, r) {
        return (n, a, o) => {
          if (!1 === e)
            throw new Q(
              (function (e, t) {
                return (
                  "[Axios v1.9.0] Transitional option '" +
                  e +
                  "'" +
                  t +
                  (r ? ". " + r : "")
                );
              })(a, " has been removed" + (t ? " in " + t : "")),
              Q.ERR_DEPRECATED
            );
          return t && !Ot[a] && (Ot[a] = !0), !e || e(n, a, o);
        };
      }),
        (Rt.spelling = function (e) {
          return (e, t) => !0;
        });
      var St = {
          assertOptions: function (e, t, r) {
            if ("object" != typeof e)
              throw new Q("options must be an object", Q.ERR_BAD_OPTION_VALUE);
            for (var n = Object.keys(e), a = n.length; a-- > 0; ) {
              var o = n[a],
                i = t[o];
              if (i) {
                var s = e[o],
                  u = void 0 === s || i(s, o, e);
                if (!0 !== u)
                  throw new Q(
                    "option " + o + " must be " + u,
                    Q.ERR_BAD_OPTION_VALUE
                  );
              } else if (!0 !== r)
                throw new Q("Unknown option " + o, Q.ERR_BAD_OPTION);
            }
          },
          validators: Rt,
        },
        At = St.validators;
      class Tt {
        request(e, t) {
          return (0, V._)(function* () {
            try {
              return yield this._request(e, t);
            } catch (e) {
              if (e instanceof Error) {
                var r = {};
                Error.captureStackTrace
                  ? Error.captureStackTrace(r)
                  : (r = new Error());
                var n = r.stack ? r.stack.replace(/^.+\n/, "") : "";
                try {
                  e.stack
                    ? n &&
                      !String(e.stack).endsWith(n.replace(/^.+\n.+\n/, "")) &&
                      (e.stack += "\n" + n)
                    : (e.stack = n);
                } catch (e) {}
              }
              throw e;
            }
          }).call(this);
        }
        _request(e, t) {
          "string" == typeof e ? ((t = t || {}).url = e) : (t = e || {}),
            (t = Ke(this.defaults, t));
          var { transitional: r, paramsSerializer: n, headers: a } = t;
          void 0 !== r &&
            St.assertOptions(
              r,
              {
                silentJSONParsing: At.transitional(At.boolean),
                forcedJSONParsing: At.transitional(At.boolean),
                clarifyTimeoutError: At.transitional(At.boolean),
              },
              !1
            ),
            null != n &&
              (K.isFunction(n)
                ? (t.paramsSerializer = { serialize: n })
                : St.assertOptions(
                    n,
                    { encode: At.function, serialize: At.function },
                    !0
                  )),
            void 0 !== t.allowAbsoluteUrls ||
              (void 0 !== this.defaults.allowAbsoluteUrls
                ? (t.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls)
                : (t.allowAbsoluteUrls = !0)),
            St.assertOptions(
              t,
              {
                baseUrl: At.spelling("baseURL"),
                withXsrfToken: At.spelling("withXSRFToken"),
              },
              !0
            ),
            (t.method = (
              t.method ||
              this.defaults.method ||
              "get"
            ).toLowerCase());
          var o = a && K.merge(a.common, a[t.method]);
          a &&
            K.forEach(
              ["delete", "get", "head", "post", "put", "patch", "common"],
              (e) => {
                delete a[e];
              }
            ),
            (t.headers = Pe.concat(o, a));
          var i = [],
            s = !0;
          this.interceptors.request.forEach(function (e) {
            ("function" == typeof e.runWhen && !1 === e.runWhen(t)) ||
              ((s = s && e.synchronous), i.unshift(e.fulfilled, e.rejected));
          });
          var u,
            l = [];
          this.interceptors.response.forEach(function (e) {
            l.push(e.fulfilled, e.rejected);
          });
          var c,
            f = 0;
          if (!s) {
            var d = [wt.bind(this), void 0];
            for (
              d.unshift.apply(d, i),
                d.push.apply(d, l),
                c = d.length,
                u = Promise.resolve(t);
              f < c;

            )
              u = u.then(d[f++], d[f++]);
            return u;
          }
          c = i.length;
          var h = t;
          for (f = 0; f < c; ) {
            var p = i[f++],
              m = i[f++];
            try {
              h = p(h);
            } catch (e) {
              m.call(this, e);
              break;
            }
          }
          try {
            u = wt.call(this, h);
          } catch (e) {
            return Promise.reject(e);
          }
          for (f = 0, c = l.length; f < c; ) u = u.then(l[f++], l[f++]);
          return u;
        }
        getUri(e) {
          return ce(
            He((e = Ke(this.defaults, e)).baseURL, e.url, e.allowAbsoluteUrls),
            e.params,
            e.paramsSerializer
          );
        }
        constructor(e) {
          (this.defaults = e || {}),
            (this.interceptors = { request: new fe(), response: new fe() });
        }
      }
      K.forEach(["delete", "get", "head", "options"], function (e) {
        Tt.prototype[e] = function (t, r) {
          return this.request(
            Ke(r || {}, { method: e, url: t, data: (r || {}).data })
          );
        };
      }),
        K.forEach(["post", "put", "patch"], function (e) {
          function t(t) {
            return function (r, n, a) {
              return this.request(
                Ke(a || {}, {
                  method: e,
                  headers: t ? { "Content-Type": "multipart/form-data" } : {},
                  url: r,
                  data: n,
                })
              );
            };
          }
          (Tt.prototype[e] = t()), (Tt.prototype[e + "Form"] = t(!0));
        });
      var xt = Tt;
      class Ct {
        throwIfRequested() {
          if (this.reason) throw this.reason;
        }
        subscribe(e) {
          this.reason
            ? e(this.reason)
            : this._listeners
            ? this._listeners.push(e)
            : (this._listeners = [e]);
        }
        unsubscribe(e) {
          if (this._listeners) {
            var t = this._listeners.indexOf(e);
            -1 !== t && this._listeners.splice(t, 1);
          }
        }
        toAbortSignal() {
          var e = new AbortController(),
            t = (t) => {
              e.abort(t);
            };
          return (
            this.subscribe(t),
            (e.signal.unsubscribe = () => this.unsubscribe(t)),
            e.signal
          );
        }
        static source() {
          var e;
          return {
            token: new Ct(function (t) {
              e = t;
            }),
            cancel: e,
          };
        }
        constructor(e) {
          if ("function" != typeof e)
            throw new TypeError("executor must be a function.");
          var t;
          this.promise = new Promise(function (e) {
            t = e;
          });
          var r = this;
          this.promise.then((e) => {
            if (r._listeners) {
              for (var t = r._listeners.length; t-- > 0; ) r._listeners[t](e);
              r._listeners = null;
            }
          }),
            (this.promise.then = (e) => {
              var t,
                n = new Promise((e) => {
                  r.subscribe(e), (t = e);
                }).then(e);
              return (
                (n.cancel = function () {
                  r.unsubscribe(t);
                }),
                n
              );
            }),
            e(function (e, n, a) {
              r.reason || ((r.reason = new ke(e, n, a)), t(r.reason));
            });
        }
      }
      var _t = Ct;
      var Pt = {
        Continue: 100,
        SwitchingProtocols: 101,
        Processing: 102,
        EarlyHints: 103,
        Ok: 200,
        Created: 201,
        Accepted: 202,
        NonAuthoritativeInformation: 203,
        NoContent: 204,
        ResetContent: 205,
        PartialContent: 206,
        MultiStatus: 207,
        AlreadyReported: 208,
        ImUsed: 226,
        MultipleChoices: 300,
        MovedPermanently: 301,
        Found: 302,
        SeeOther: 303,
        NotModified: 304,
        UseProxy: 305,
        Unused: 306,
        TemporaryRedirect: 307,
        PermanentRedirect: 308,
        BadRequest: 400,
        Unauthorized: 401,
        PaymentRequired: 402,
        Forbidden: 403,
        NotFound: 404,
        MethodNotAllowed: 405,
        NotAcceptable: 406,
        ProxyAuthenticationRequired: 407,
        RequestTimeout: 408,
        Conflict: 409,
        Gone: 410,
        LengthRequired: 411,
        PreconditionFailed: 412,
        PayloadTooLarge: 413,
        UriTooLong: 414,
        UnsupportedMediaType: 415,
        RangeNotSatisfiable: 416,
        ExpectationFailed: 417,
        ImATeapot: 418,
        MisdirectedRequest: 421,
        UnprocessableEntity: 422,
        Locked: 423,
        FailedDependency: 424,
        TooEarly: 425,
        UpgradeRequired: 426,
        PreconditionRequired: 428,
        TooManyRequests: 429,
        RequestHeaderFieldsTooLarge: 431,
        UnavailableForLegalReasons: 451,
        InternalServerError: 500,
        NotImplemented: 501,
        BadGateway: 502,
        ServiceUnavailable: 503,
        GatewayTimeout: 504,
        HttpVersionNotSupported: 505,
        VariantAlsoNegotiates: 506,
        InsufficientStorage: 507,
        LoopDetected: 508,
        NotExtended: 510,
        NetworkAuthenticationRequired: 511,
      };
      Object.entries(Pt).forEach((e) => {
        var [t, r] = e;
        Pt[r] = t;
      });
      var jt = Pt;
      var Nt = (function e(t) {
        var r = new xt(t),
          n = a(xt.prototype.request, r);
        return (
          K.extend(n, xt.prototype, r, { allOwnKeys: !0 }),
          K.extend(n, r, null, { allOwnKeys: !0 }),
          (n.create = function (r) {
            return e(Ke(t, r));
          }),
          n
        );
      })(Oe);
      (Nt.Axios = xt),
        (Nt.CanceledError = ke),
        (Nt.CancelToken = _t),
        (Nt.isCancel = Ne),
        (Nt.VERSION = Et),
        (Nt.toFormData = ae),
        (Nt.AxiosError = Q),
        (Nt.Cancel = Nt.CanceledError),
        (Nt.all = function (e) {
          return Promise.all(e);
        }),
        (Nt.spread = function (e) {
          return function (t) {
            return e.apply(null, t);
          };
        }),
        (Nt.isAxiosError = function (e) {
          return K.isObject(e) && !0 === e.isAxiosError;
        }),
        (Nt.mergeConfig = Ke),
        (Nt.AxiosHeaders = Pe),
        (Nt.formToJSON = (e) => Ee(K.isHTMLForm(e) ? new FormData(e) : e)),
        (Nt.getAdapter = gt),
        (Nt.HttpStatusCode = jt),
        (Nt.default = Nt);
      var Ut = Nt;
    },
  },
]);

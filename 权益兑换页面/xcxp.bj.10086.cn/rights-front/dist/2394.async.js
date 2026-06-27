(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["2394"],
  {
    73156() {},
    70120() {},
    79878() {},
    67238() {},
    74546(e, t, r) {
      "use strict";
      var n = r(43941),
        i = r(22153),
        u = r(46683);
      t.A = function (e, t, r) {
        void 0 === r && (r = {});
        var a = r.enable,
          o = void 0 === a || a,
          c = (0, n.A)(t);
        (0, u.A)(
          function () {
            if (o) {
              var t = (0, i.e)(r.target, window);
              if (null == t ? void 0 : t.addEventListener) {
                var n = function (e) {
                    return c.current(e);
                  },
                  u = Array.isArray(e) ? e : [e];
                return (
                  u.forEach(function (e) {
                    t.addEventListener(e, n, {
                      capture: r.capture,
                      once: r.once,
                      passive: r.passive,
                    });
                  }),
                  function () {
                    u.forEach(function (e) {
                      t.removeEventListener(e, n, { capture: r.capture });
                    });
                  }
                );
              }
            }
          },
          [e, r.capture, r.once, r.passive, o],
          r.target
        );
      };
    },
    53487(e, t, r) {
      "use strict";
      var n = r(41486),
        i = r(54670),
        u = r(64176);
      t.A = function (e, t, r) {
        void 0 === r && (r = {});
        var a = (0, i.A)(e),
          o = (0, n.useRef)(null),
          c = (0, n.useCallback)(function () {
            o.current && clearInterval(o.current);
          }, []);
        return (
          (0, n.useEffect)(
            function () {
              if ((0, u.Et)(t) && !(t < 0))
                return r.immediate && a(), (o.current = setInterval(a, t)), c;
            },
            [t, r.immediate]
          ),
          c
        );
      };
    },
    17148(e, t, r) {
      "use strict";
      r.d(t, { A: () => v });
      var n = r(5482),
        i = r(41486),
        u = r(74546),
        a = r(54670),
        o = r(67738),
        c = r(64176),
        f = "AHOOKS_SYNC_STORAGE_EVENT_NAME";
      var l,
        s = r(28700),
        v =
          ((l = function () {
            return s.A ? sessionStorage : void 0;
          }),
          function (e, t) {
            var r;
            void 0 === t && (t = {});
            var s = t.listenStorageChange,
              v = void 0 !== s && s,
              d = t.onError,
              p = void 0 === d ? function (e) {} : d;
            try {
              r = l();
            } catch (e) {
              p(e);
            }
            function g() {
              try {
                var n = null == r ? void 0 : r.getItem(e);
                if (n)
                  return (
                    (i = n), t.deserializer ? t.deserializer(i) : JSON.parse(i)
                  );
              } catch (e) {
                p(e);
              }
              var i;
              return (0, c.Tn)(t.defaultValue)
                ? t.defaultValue()
                : t.defaultValue;
            }
            var m = (0, n.__read)((0, i.useState)(g), 2),
              A = m[0],
              y = m[1];
            (0, o.A)(
              function () {
                y(g());
              },
              [e]
            );
            var h = function (t) {
              t.key === e && t.storageArea === r && y(g());
            };
            return (
              (0, u.A)("storage", h, { enable: v }),
              (0, u.A)(
                f,
                function (e) {
                  h(e.detail);
                },
                { enable: v }
              ),
              [
                A,
                (0, a.A)(function (n) {
                  var i = (0, c.Tn)(n) ? n(A) : n;
                  v || y(i);
                  try {
                    var u = void 0,
                      a = null == r ? void 0 : r.getItem(e);
                    (0, c.XB)(i)
                      ? ((u = null), null == r || r.removeItem(e))
                      : ((u = (function (e) {
                          return t.serializer
                            ? t.serializer(e)
                            : JSON.stringify(e);
                        })(i)),
                        null == r || r.setItem(e, u)),
                      dispatchEvent(
                        new CustomEvent(f, {
                          detail: {
                            key: e,
                            newValue: u,
                            oldValue: a,
                            storageArea: r,
                          },
                        })
                      );
                  } catch (e) {
                    p(e);
                  }
                }),
              ]
            );
          });
    },
    23614(e, t, r) {
      "use strict";
      var n = r(41486),
        i = r(4958),
        u = r(56522),
        a = r(22153);
      t.A = function (e) {
        return function (t, r, o) {
          var c = (0, n.useRef)(!1),
            f = (0, n.useRef)([]),
            l = (0, n.useRef)([]),
            s = (0, n.useRef)();
          e(function () {
            var e,
              n = (Array.isArray(o) ? o : [o]).map(function (e) {
                return (0, a.e)(e);
              });
            if (!c.current)
              return (
                (c.current = !0),
                (f.current = n),
                (l.current = r),
                void (s.current = t())
              );
            (n.length === f.current.length &&
              (0, u.A)(f.current, n) &&
              (0, u.A)(l.current, r)) ||
              (null === (e = s.current) || void 0 === e || e.call(s),
              (f.current = n),
              (l.current = r),
              (s.current = t()));
          }),
            (0, i.A)(function () {
              var e;
              null === (e = s.current) || void 0 === e || e.call(s),
                (c.current = !1);
            });
        };
      };
    },
    22153(e, t, r) {
      "use strict";
      r.d(t, { e: () => u });
      var n = r(64176),
        i = r(28700);
      function u(e, t) {
        if (i.A)
          return e ? ((0, n.Tn)(e) ? e() : "current" in e ? e.current : e) : t;
      }
    },
    46683(e, t, r) {
      "use strict";
      var n = r(41486),
        i = (0, r(23614).A)(n.useEffect);
      t.A = i;
    },
    19551(e, t, r) {
      var n = "Expected a function",
        i = /^\s+|\s+$/g,
        u = /^[-+]0x[0-9a-f]+$/i,
        a = /^0b[01]+$/i,
        o = /^0o[0-7]+$/i,
        c = parseInt,
        f = "object" == typeof r.g && r.g && r.g.Object === Object && r.g,
        l = "object" == typeof self && self && self.Object === Object && self,
        s = f || l || Function("return this")(),
        v = Object.prototype.toString,
        d = Math.max,
        p = Math.min,
        g = function () {
          return s.Date.now();
        };
      function m(e, t, r) {
        var i,
          u,
          a,
          o,
          c,
          f,
          l = 0,
          s = !1,
          v = !1,
          m = !0;
        if ("function" != typeof e) throw new TypeError(n);
        function h(t) {
          var r = i,
            n = u;
          return (i = u = void 0), (l = t), (o = e.apply(n, r));
        }
        function b(e) {
          return (l = e), (c = setTimeout(O, t)), s ? h(e) : o;
        }
        function E(e) {
          var r = e - f;
          return void 0 === f || r >= t || r < 0 || (v && e - l >= a);
        }
        function O() {
          var e = g();
          if (E(e)) return T(e);
          c = setTimeout(
            O,
            (function (e) {
              var r = t - (e - f);
              return v ? p(r, a - (e - l)) : r;
            })(e)
          );
        }
        function T(e) {
          return (c = void 0), m && i ? h(e) : ((i = u = void 0), o);
        }
        function w() {
          var e = g(),
            r = E(e);
          if (((i = arguments), (u = this), (f = e), r)) {
            if (void 0 === c) return b(f);
            if (v) return (c = setTimeout(O, t)), h(f);
          }
          return void 0 === c && (c = setTimeout(O, t)), o;
        }
        return (
          (t = y(t) || 0),
          A(r) &&
            ((s = !!r.leading),
            (a = (v = "maxWait" in r) ? d(y(r.maxWait) || 0, t) : a),
            (m = "trailing" in r ? !!r.trailing : m)),
          (w.cancel = function () {
            void 0 !== c && clearTimeout(c), (l = 0), (i = f = u = c = void 0);
          }),
          (w.flush = function () {
            return void 0 === c ? o : T(g());
          }),
          w
        );
      }
      function A(e) {
        var t = typeof e;
        return !!e && ("object" == t || "function" == t);
      }
      function y(e) {
        if ("number" == typeof e) return e;
        if (
          (function (e) {
            return (
              "symbol" == typeof e ||
              ((function (e) {
                return !!e && "object" == typeof e;
              })(e) &&
                "[object Symbol]" == v.call(e))
            );
          })(e)
        )
          return NaN;
        if (A(e)) {
          var t = "function" == typeof e.valueOf ? e.valueOf() : e;
          e = A(t) ? t + "" : t;
        }
        if ("string" != typeof e) return 0 === e ? e : +e;
        e = e.replace(i, "");
        var r = a.test(e);
        return r || o.test(e) ? c(e.slice(2), r ? 2 : 8) : u.test(e) ? NaN : +e;
      }
      e.exports = function (e, t, r) {
        var i = !0,
          u = !0;
        if ("function" != typeof e) throw new TypeError(n);
        return (
          A(r) &&
            ((i = "leading" in r ? !!r.leading : i),
            (u = "trailing" in r ? !!r.trailing : u)),
          m(e, t, { leading: i, maxWait: t, trailing: u })
        );
      };
    },
  },
]);

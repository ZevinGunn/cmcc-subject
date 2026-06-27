(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["8016"],
  {
    67238() {},
    19551(t, n, e) {
      var o = "Expected a function",
        r = /^\s+|\s+$/g,
        i = /^[-+]0x[0-9a-f]+$/i,
        a = /^0b[01]+$/i,
        c = /^0o[0-7]+$/i,
        l = parseInt,
        s = "object" == typeof e.g && e.g && e.g.Object === Object && e.g,
        u = "object" == typeof self && self && self.Object === Object && self,
        d = s || u || Function("return this")(),
        f = Object.prototype.toString,
        p = Math.max,
        m = Math.min,
        g = function () {
          return d.Date.now();
        };
      function v(t, n, e) {
        var r,
          i,
          a,
          c,
          l,
          s,
          u = 0,
          d = !1,
          f = !1,
          v = !0;
        if ("function" != typeof t) throw new TypeError(o);
        function w(n) {
          var e = r,
            o = i;
          return (r = i = void 0), (u = n), (c = t.apply(o, e));
        }
        function b(t) {
          return (u = t), (l = setTimeout(O, n)), d ? w(t) : c;
        }
        function _(t) {
          var e = t - s;
          return void 0 === s || e >= n || e < 0 || (f && t - u >= a);
        }
        function O() {
          var t = g();
          if (_(t)) return S(t);
          l = setTimeout(
            O,
            (function (t) {
              var e = n - (t - s);
              return f ? m(e, a - (t - u)) : e;
            })(t)
          );
        }
        function S(t) {
          return (l = void 0), v && r ? w(t) : ((r = i = void 0), c);
        }
        function x() {
          var t = g(),
            e = _(t);
          if (((r = arguments), (i = this), (s = t), e)) {
            if (void 0 === l) return b(s);
            if (f) return (l = setTimeout(O, n)), w(s);
          }
          return void 0 === l && (l = setTimeout(O, n)), c;
        }
        return (
          (n = y(n) || 0),
          h(e) &&
            ((d = !!e.leading),
            (a = (f = "maxWait" in e) ? p(y(e.maxWait) || 0, n) : a),
            (v = "trailing" in e ? !!e.trailing : v)),
          (x.cancel = function () {
            void 0 !== l && clearTimeout(l), (u = 0), (r = s = i = l = void 0);
          }),
          (x.flush = function () {
            return void 0 === l ? c : S(g());
          }),
          x
        );
      }
      function h(t) {
        var n = typeof t;
        return !!t && ("object" == n || "function" == n);
      }
      function y(t) {
        if ("number" == typeof t) return t;
        if (
          (function (t) {
            return (
              "symbol" == typeof t ||
              ((function (t) {
                return !!t && "object" == typeof t;
              })(t) &&
                "[object Symbol]" == f.call(t))
            );
          })(t)
        )
          return NaN;
        if (h(t)) {
          var n = "function" == typeof t.valueOf ? t.valueOf() : t;
          t = h(n) ? n + "" : n;
        }
        if ("string" != typeof t) return 0 === t ? t : +t;
        t = t.replace(r, "");
        var e = a.test(t);
        return e || c.test(t) ? l(t.slice(2), e ? 2 : 8) : i.test(t) ? NaN : +t;
      }
      t.exports = function (t, n, e) {
        var r = !0,
          i = !0;
        if ("function" != typeof t) throw new TypeError(o);
        return (
          h(e) &&
            ((r = "leading" in e ? !!e.leading : r),
            (i = "trailing" in e ? !!e.trailing : i)),
          v(t, n, { leading: r, maxWait: n, trailing: i })
        );
      };
    },
    41894(t, n, e) {
      "use strict";
      e.r(n), e.d(n, { default: () => N });
      var o = e(13454),
        r = e(86070),
        i = (e(96562), e(38458)),
        a = e(41486),
        c = "SceneBanner___rsBYN",
        l = "SwiperViewport___srFJn",
        s = "SwiperContainer___vnOE5",
        u = "SwiperSlide___Z6BFK",
        d = "BannerImage___D1nsA",
        f = "SwiperIndicator___K2dLS",
        p = "IndicatorItem___X3cmE",
        m = "active___gqub8",
        g = "SceneBannerSkeleton___qZZCG",
        v = "SceneBannerSkeletonNode___oXI8x",
        h = e(36847),
        y = e(73508),
        w = e(22580),
        b = e(82647),
        _ = e(20696),
        O = e(13526),
        S = e(7960),
        x = e(77532),
        j = e(19331);
      function I() {
        return (0, r.jsx)(i.A, {
          title: !1,
          paragraph: !1,
          animation: "breath",
          className: g,
          children: (0, r.jsx)(i.A.Node, { className: v }),
        });
      }
      function N() {
        var [t, n] = (0, j.A)({ loop: !0, align: "start" }, [
            (0, x.A)({ delay: 3e3, playOnInit: !0, stopOnInteraction: !1 }),
          ]),
          {
            selectedIndex: e,
            scrollSnaps: i,
            onDotButtonClick: g,
          } = (0, w._)(n),
          { data: v } = (0, y.A)(() =>
            (0, o._)(function* () {
              var t,
                n = yield (0, h.n3)("formalTop");
              return (null === (t = n.data) || void 0 === t ? void 0 : t.length)
                ? n.data
                : [];
            })()
          ),
          N = (0, a.useCallback)((t, n) => {
            b.U.bpEverythingClick({
              busName: "通用运营位",
              moduleName: "场景banner位",
              pointPosition: "".concat(n + 1, "-").concat(t.rightsTitle),
              nextUrl: "".concat(t.linkValue),
            }),
              _.x.navToOp({ data: t });
          }, []);
        return (null == v ? void 0 : v.length)
          ? (0, r.jsxs)("div", {
              className: c,
              children: [
                (0, r.jsx)("div", {
                  className: l,
                  ref: t,
                  children: (0, r.jsx)("div", {
                    className: s,
                    children: v.map((t, n) =>
                      (0, r.jsx)(
                        "div",
                        {
                          className: u,
                          children: (0, r.jsx)(S._, {
                            className: d,
                            onClick: () => N(t, n),
                            src: "".concat(gImgUrlPrefixLegacy).concat(t.icon),
                            alt: "",
                            fit: "fill",
                          }),
                        },
                        t.configId
                      )
                    ),
                  }),
                }),
                i.length > 1 &&
                  (0, r.jsx)("div", {
                    className: f,
                    children: i.map((t, n) =>
                      (0, r.jsx)(
                        "div",
                        {
                          className: (0, O.A)(p, n === e && m),
                          onClick: () => g(n),
                        },
                        n
                      )
                    ),
                  }),
              ],
            })
          : (0, r.jsx)(I, {});
      }
    },
    7960(t, n, e) {
      "use strict";
      e.d(n, { _: () => d });
      var o = e(20837),
        r = e(50654),
        i = e(86070),
        a = (e(79065), e(28535), e(49703)),
        c = e(13438),
        l = e(41486),
        s = e.n(l),
        u = e(99496);
      function d(t) {
        var {
            lazy: n = !0,
            hasBottomOverlap: e = !1,
            offset: l = 0,
            src: d,
          } = t,
          f = (0, r._)(t, ["lazy", "hasBottomOverlap", "offset", "src"]),
          p = (0, u.$)(d),
          [m, g] = s().useState(!1);
        return n
          ? (0, i.jsx)(a.A, {
              style: { fontSize: 0 },
              onVisibleChange: (t) => g(t),
              offset: l,
              once: !0,
              children: (0, i.jsx)(
                c.A,
                (0, o._)(
                  {
                    src: p,
                    showImage: m,
                    bottomOverlap: e ? void 0 : null,
                    animateDuration: 150,
                  },
                  f
                )
              ),
            })
          : (0, i.jsx)(
              c.A,
              (0, o._)({ bottomOverlap: null, animateDuration: 150, src: p }, f)
            );
      }
    },
    22580(t, n, e) {
      "use strict";
      e.d(n, { _: () => r });
      var o = e(41486);
      function r(t) {
        var [n, e] = (0, o.useState)(0),
          [r, i] = (0, o.useState)([]),
          a = (0, o.useCallback)(
            (n) => {
              t && t.scrollTo(n);
            },
            [t]
          ),
          c = (0, o.useCallback)((t) => {
            i(t.scrollSnapList());
          }, []),
          l = (0, o.useCallback)((t) => {
            e(t.selectedScrollSnap());
          }, []);
        return (
          (0, o.useEffect)(() => {
            t &&
              (c(t),
              l(t),
              t.on("reInit", c),
              t.on("reInit", l),
              t.on("select", l));
          }, [t, c, l]),
          { selectedIndex: n, scrollSnaps: r, onDotButtonClick: a }
        );
      }
    },
    99496(t, n, e) {
      "use strict";
      e.d(n, { $: () => c, h: () => l });
      var o = e(13454),
        r = e(81566),
        i = e(2307),
        a = /^\d{6}\//;
      function c(t) {
        if (!t) return "";
        if (/^https?:\/\//i.test(t)) return t;
        var n = t.replace(/^\/+/, "");
        return (
          n.startsWith("images/rights/") && (n = n.slice("images/".length)),
          !n.startsWith("rights/") && a.test(n) && (n = "rights/".concat(n)),
          "".concat(gImgUrlPrefixLegacy, "/").concat(n)
        );
      }
      function l(t, n) {
        return (0, o._)(function* () {
          try {
            if ((0, r.D8)()) {
              try {
                i.t.savePhoto({ type: "1", data: t, phoneNum: n });
              } catch (t) {
                throw new Error("保存图片失败，请稍后重试");
              }
              return;
            }
            var e = t.startsWith("http")
                ? t
                : "".concat(window.location.origin).concat(t),
              a = yield fetch(e);
            if (!a.ok) throw new Error("图片加载失败");
            var c = yield a.blob(),
              l = window.URL.createObjectURL(c),
              s = document.createElement("a");
            (s.href = l),
              (s.download = n || "image_".concat(Date.now(), ".png")),
              (s.style.display = "none"),
              document.body.appendChild(s),
              s.click(),
              document.body.removeChild(s),
              window.URL.revokeObjectURL(l);
          } catch (e) {
            try {
              yield (function (t, n) {
                return (0, o._)(function* () {
                  return new Promise((e, o) => {
                    var r = new Image();
                    (r.crossOrigin = "anonymous"),
                      (r.onload = () => {
                        try {
                          var t = document.createElement("canvas");
                          (t.width = r.width), (t.height = r.height);
                          var i = t.getContext("2d");
                          if (!i)
                            return void o(new Error("无法创建 Canvas 上下文"));
                          i.drawImage(r, 0, 0),
                            t.toBlob(
                              (t) => {
                                if (t) {
                                  var r = window.URL.createObjectURL(t),
                                    i = document.createElement("a");
                                  (i.href = r),
                                    (i.download =
                                      n || "image_".concat(Date.now(), ".png")),
                                    (i.style.display = "none"),
                                    document.body.appendChild(i),
                                    i.click(),
                                    document.body.removeChild(i),
                                    window.URL.revokeObjectURL(r),
                                    e();
                                } else o(new Error("图片转换失败"));
                              },
                              "image/png",
                              1
                            );
                        } catch (t) {
                          o(t);
                        }
                      }),
                      (r.onerror = () => {
                        o(new Error("图片加载失败"));
                      }),
                      (r.src = t);
                  });
                })();
              })(t, n);
            } catch (t) {
              throw new Error("保存图片失败，请稍后重试");
            }
          }
        })();
      }
    },
    77532(t, n, e) {
      "use strict";
      e.d(n, { A: () => r });
      const o = {
        active: !0,
        breakpoints: {},
        delay: 4e3,
        jump: !1,
        playOnInit: !0,
        stopOnFocusIn: !0,
        stopOnInteraction: !0,
        stopOnMouseEnter: !1,
        stopOnLastSnap: !1,
        rootNode: null,
      };
      function r(t = {}) {
        let n,
          e,
          i,
          a,
          c = null,
          l = 0,
          s = !1,
          u = !1,
          d = !1,
          f = !1;
        function p() {
          i ||
            (v()
              ? (d = !0)
              : (s || e.emit("autoplay:play"),
                (function () {
                  const { ownerWindow: t } = e.internalEngine();
                  t.clearTimeout(l),
                    (l = t.setTimeout(_, a[e.selectedScrollSnap()])),
                    (c = new Date().getTime()),
                    e.emit("autoplay:timerset");
                })(),
                (s = !0)));
        }
        function m() {
          i ||
            (s && e.emit("autoplay:stop"),
            (function () {
              const { ownerWindow: t } = e.internalEngine();
              t.clearTimeout(l),
                (l = 0),
                (c = null),
                e.emit("autoplay:timerstopped");
            })(),
            (s = !1));
        }
        function g() {
          if (v()) return (d = s), m();
          d && p();
        }
        function v() {
          const { ownerDocument: t } = e.internalEngine();
          return "hidden" === t.visibilityState;
        }
        function h() {
          u || m();
        }
        function y() {
          u || p();
        }
        function w() {
          (u = !0), m();
        }
        function b() {
          (u = !1), p();
        }
        function _() {
          const { index: t } = e.internalEngine(),
            o = t.clone().add(1).get(),
            r = e.scrollSnapList().length - 1,
            i = n.stopOnLastSnap && o === r;
          if (
            (e.canScrollNext() ? e.scrollNext(f) : e.scrollTo(0, f),
            e.emit("autoplay:select"),
            i)
          )
            return m();
          p();
        }
        return {
          name: "autoplay",
          options: t,
          init: function (c, l) {
            e = c;
            const { mergeOptions: s, optionsAtMedia: u } = l,
              d = s(o, r.globalOptions),
              v = s(d, t);
            if (((n = u(v)), e.scrollSnapList().length <= 1)) return;
            (f = n.jump),
              (i = !1),
              (a = (function (t, n) {
                const e = t.scrollSnapList();
                return "number" == typeof n ? e.map(() => n) : n(e, t);
              })(e, n.delay));
            const { eventStore: _, ownerDocument: O } = e.internalEngine(),
              S = !!e.internalEngine().options.watchDrag,
              x = (function (t, n) {
                const e = t.rootNode();
                return (n && n(e)) || e;
              })(e, n.rootNode);
            _.add(O, "visibilitychange", g),
              S && e.on("pointerDown", h),
              S && !n.stopOnInteraction && e.on("pointerUp", y),
              n.stopOnMouseEnter && _.add(x, "mouseenter", w),
              n.stopOnMouseEnter &&
                !n.stopOnInteraction &&
                _.add(x, "mouseleave", b),
              n.stopOnFocusIn && e.on("slideFocusStart", m),
              n.stopOnFocusIn &&
                !n.stopOnInteraction &&
                _.add(e.containerNode(), "focusout", p),
              n.playOnInit && p();
          },
          destroy: function () {
            e
              .off("pointerDown", h)
              .off("pointerUp", y)
              .off("slideFocusStart", m),
              m(),
              (i = !0),
              (s = !1);
          },
          play: function (t) {
            void 0 !== t && (f = t), p();
          },
          stop: function () {
            s && m();
          },
          reset: function () {
            s && p();
          },
          isPlaying: function () {
            return s;
          },
          timeUntilNext: function () {
            return c
              ? a[e.selectedScrollSnap()] - (new Date().getTime() - c)
              : null;
          },
        };
      }
      r.globalOptions = void 0;
    },
  },
]);

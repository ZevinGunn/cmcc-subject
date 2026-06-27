"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["5164"],
  {
    86384(e, a, s) {
      s.d(a, { N: () => p, J: () => x });
      var t = s(86070),
        l = (s(41486), "OrderPayDiscountModal___lAiNA"),
        n = "tips___GW8cb",
        r = "orderIdWrap___PdX7f",
        i = "copyButton___lHohF",
        o = "endTime___hOc2p",
        d = s(15189),
        c = s(2307),
        _ = s(54447),
        u = s(891),
        h = s(64850),
        g = s(33843),
        v = s(58349),
        m = s(59344);
      function x(e) {
        (0, h.fx)()
          ? _.a.navigateTo({
              url: "/package-a/pages/pay-discount-exchange/index?id=".concat(e),
            })
          : c.t
              .openMiniProgram({
                userName: "gh_f66fe1a519f1",
                path: "/package-a/pages/pay-discount-exchange/index?id=".concat(
                  e
                ),
                miniProgramType: 0,
              })
              .catch(() => {
                m.Z.loading(),
                  (0, d.Az)({
                    path: "package-a/pages/pay-discount-exchange/index",
                    query: "id=".concat(e),
                    envVersion: "release",
                  })
                    .then((e) => {
                      var a;
                      m.Z.clear(),
                        (
                          null === (a = e.data) || void 0 === a
                            ? void 0
                            : a.startsWith("https")
                        )
                          ? (window.location.href = e.data)
                          : m.Z.info("跳转失败，请手动兑换");
                    })
                    .catch(() => {
                      m.Z.clear();
                    });
              });
      }
      function p(e) {
        var {
          open: a,
          orderId: s,
          tipsText: d,
          onClose: c,
          onAfterClose: _ = () => {},
          endTime: h,
        } = e;
        return (0, t.jsx)(g.R.ControlledComponent, {
          open: a,
          title: "温馨提示",
          onClose: c,
          okButtonText: "存入卡包",
          onOk: () => {
            x(s);
          },
          onAfterClose: _,
          children: (0, t.jsxs)("div", {
            className: l,
            children: [
              (0, t.jsx)(v.s, { className: n, text: d }),
              (0, t.jsxs)("div", {
                className: r,
                children: [
                  (0, t.jsxs)("span", { children: ["订单号：", s] }),
                  (0, t.jsx)("div", {
                    className: i,
                    onClick: () => {
                      u.V.writeText({ text: s });
                    },
                    children: "复制",
                  }),
                ],
              }),
              h
                ? (0, t.jsxs)("div", {
                    className: o,
                    children: ["有效期至：", h],
                  })
                : null,
            ],
          }),
        });
      }
    },
    30650(e, a, s) {
      s.d(a, { s: () => b });
      var t = s(86070),
        l = (s(41486), "QrcodeModal___JTdVb"),
        n = "CloseButton___ZFAzD",
        r = "CloseIcon___Qm7ap",
        i = "Header___VFp9R",
        o = "Icon___lFqRA",
        d = "Name___AQ5_E",
        c = "Body___XS0Y0",
        _ = "Footer___rX12Z",
        u = "OkButton___PbtOA",
        h = "Tips___C8EYz",
        g = "QrCodeWrap___b9VO5",
        v = "QrCode___qB842",
        m = "Disabled___UJvEC",
        x = "QrCodeValue___EgFAj",
        p = "StatusText___fn0_p",
        N = "TimeText___TJQte",
        f = "QrCodeBadge___oG9Xz",
        I = s(93521),
        C = s(13526),
        A = s(62033),
        T = s(58349),
        j = s(88815);
      function P(e) {
        var { statusText: a } = e;
        return "已过期" === a
          ? (0, t.jsx)("div", { className: f, children: "二维码已失效" })
          : "已使用" === a
          ? (0, t.jsx)("div", { className: f, children: "二维码已使用" })
          : null;
      }
      function b(e) {
        var {
            open: a,
            startTime: s,
            icon: f,
            title: b,
            description: M,
            qrcodeValue: R,
            showQrcodeValue: L = !1,
            onOk: S,
            state: y,
            endTime: U,
          } = e,
          O =
            "1" === y
              ? "已使用"
              : (0, I._d)(U)
              ? "已过期"
              : "0" === y
              ? "待使用"
              : null,
          E =
            "已过期" === O
              ? "过期时间：".concat(U)
              : "待使用" === O
              ? "使用时间：".concat(s, " - ").concat(U)
              : null;
        return (0, t.jsx)(A.v, {
          open: a,
          children: (0, t.jsxs)("div", {
            className: l,
            children: [
              (0, t.jsx)("div", {
                className: n,
                onClick: S,
                children: (0, t.jsx)("img", {
                  className: r,
                  src: "".concat(
                    gImgUrlPrefixLegacy,
                    "/rights/202508/0c3bf088-359d-4ee2-8551-dbbb5297a76d-agea.png"
                  ),
                  alt: "",
                }),
              }),
              (0, t.jsxs)("div", {
                className: i,
                children: [
                  (0, t.jsx)("img", { className: o, src: f, alt: "" }),
                  (0, t.jsx)("div", { className: d, children: b }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: c,
                children: [
                  (0, t.jsx)("div", {
                    className: h,
                    children: (0, t.jsx)(T.s, { text: M }),
                  }),
                  (0, t.jsxs)("div", {
                    className: g,
                    children: [
                      (0, t.jsx)("div", {
                        className: (0, C.A)(v, "待使用" !== O && m),
                        children: (0, t.jsx)(j.h, { value: R, size: 100 }),
                      }),
                      O ? (0, t.jsx)(P, { statusText: O }) : null,
                    ],
                  }),
                  (0, t.jsx)("div", { className: p, children: O }),
                  L ? (0, t.jsx)("div", { className: x, children: R }) : null,
                  E ? (0, t.jsx)("div", { className: N, children: E }) : null,
                ],
              }),
              (0, t.jsx)("div", {
                className: _,
                children: (0, t.jsx)("button", {
                  className: u,
                  type: "button",
                  onClick: S,
                  children: "我知道了",
                }),
              }),
            ],
          }),
        });
      }
    },
    10059(e, a, s) {
      s.d(a, { Y: () => o });
      var t = s(86070),
        l = s(41486),
        n = {
          StackStatusBadge: "StackStatusBadge___NXhGS",
          center: "center___EATJ2",
          sm: "sm___exTPc",
          md: "md___L_Vn4",
          lg: "lg___aBUVZ",
        },
        r = s(66782),
        i = s(13526),
        o = (0, l.memo)((e) => {
          var { size: a = "md", position: s = "center", statusCd: l } = e;
          return (0, r.nt)(l)
            ? (0, t.jsx)("div", {
                className: (0, i.A)(n.StackStatusBadge, n[s], n[a]),
                children: "补货中",
              })
            : null;
        });
      o.displayName = "StackStatusBadge";
    },
    58349(e, a, s) {
      s.d(a, { s: () => g });
      var t = s(20837),
        l = s(43952),
        n = s(50654),
        r = s(86070),
        i = (s(75837), s(19784)),
        o = s(41486),
        d = s.n(o),
        c = "WithImagePreview____6O8T",
        _ = s(20696),
        u = s(13526);
      function h(e) {
        if ("undefined" == typeof window || "undefined" == typeof DOMParser)
          return [];
        var a = new DOMParser().parseFromString(e, "text/html");
        return Array.from(a.querySelectorAll("img"))
          .map((e) =>
            (function (e) {
              if (!e || "undefined" == typeof window) return null != e ? e : "";
              try {
                return new URL(e, window.location.href).href;
              } catch (a) {
                return e;
              }
            })(e.getAttribute("src"))
          )
          .filter(Boolean);
      }
      var g = d().forwardRef((e, a) => {
        var { text: s, enableImagePreview: o, className: g, onClick: v } = e,
          m = (0, n._)(e, [
            "text",
            "enableImagePreview",
            "className",
            "onClick",
          ]),
          {
            assignRef: x,
            handleContainerClick: p,
            closePreview: N,
            previewOpenIndex: f,
            previewImages: I,
          } = (function (e, a, s, t) {
            var l = d().useRef(null),
              [n, r] = d().useState(-1),
              i = d().useMemo(
                () => (a && "string" == typeof e ? h(e) : []),
                [a, e]
              );
            return (
              d().useLayoutEffect(() => {
                a &&
                  l.current &&
                  l.current.querySelectorAll("img").forEach((e, a) => {
                    e.dataset.previewIndex = String(a);
                  });
              }, [e, a]),
              {
                assignRef: d().useCallback(
                  (e) => {
                    (l.current = e),
                      "function" == typeof s ? s(e) : s && (s.current = e);
                  },
                  [s]
                ),
                handleContainerClick: d().useCallback(
                  (e) => {
                    var s = e.target.closest("a");
                    if (s) {
                      e.preventDefault();
                      var l = s.dataset.type,
                        n = s.href;
                      return n.includes("sourceid")
                        ? void _.x.navToZGYD(n)
                        : n.includes("mpf.tuopukeji.cn")
                        ? void _.x.navToOuter(n)
                        : void (l
                            ? _.x.navToOp({ data: { linkValue: n, text6: l } })
                            : _.x.navToHref(n));
                    }
                    if ((null == t || t(e), a && !e.defaultPrevented)) {
                      var { target: o } = e;
                      if (o instanceof HTMLImageElement) {
                        var d = o.dataset.previewIndex;
                        if (void 0 !== d) {
                          var c = Number(d);
                          !Number.isFinite(c) || c < 0 || c >= i.length || r(c);
                        }
                      }
                    }
                  },
                  [a, i.length, t]
                ),
                closePreview: d().useCallback(() => {
                  r(-1);
                }, []),
                previewOpenIndex: n,
                previewImages: i.map((e) => ({ src: e })),
              }
            );
          })(s, o, a, v);
        return "string" != typeof s
          ? null
          : (0, r.jsxs)(r.Fragment, {
              children: [
                (0, r.jsx)(
                  "div",
                  (0, l._)((0, t._)({}, m), {
                    ref: x,
                    className: (0, u.A)(o && c, g),
                    onClick: p,
                    dangerouslySetInnerHTML: { __html: s },
                  })
                ),
                o && I.length > 0
                  ? (0, r.jsx)(i.Ay, {
                      images: I,
                      openIndex: f,
                      close: N,
                      onClose: N,
                    })
                  : null,
              ],
            });
      });
      g.displayName = "RichText";
    },
    66523(e, a, s) {
      s.d(a, { C: () => c });
      var t = s(86070),
        l = s(41486),
        n = "StatusBlock___UGSo5",
        r = "image___JbQ_M",
        i = "title___El7S_",
        o = s(13526),
        d = {
          loading:
            "/rights/202601/c2d54814-e34a-4611-a30d-2eb6ba19df02-loading.png",
          empty: "/rights/202405/2d4665ae-3d62-4158-b12d-1036cc51874f-ept.png",
        };
      function c(e) {
        var {
            status: a = "empty",
            title: s,
            style: c,
            className: _,
            iconStyle: u,
            titleStyle: h,
          } = e,
          g = (0, l.useMemo)(() => d[a], [a]),
          v = s || ("loading" === a ? "加载中..." : "暂无数据");
        return (0, t.jsxs)("div", {
          className: (0, o.A)(n, _),
          style: c,
          children: [
            (0, t.jsx)("img", {
              className: r,
              src: "".concat(gImgUrlPrefixLegacy).concat(g),
              alt: "",
              style: u,
            }),
            (0, t.jsx)("span", { className: i, style: h, children: v }),
          ],
        });
      }
    },
    62127(e, a, s) {
      s.d(a, { x: () => r });
      var t = s(13454),
        l = s(53219),
        n = s(88229);
      var r = (e, a) => {
        (0, l.A)(() => {
          !(function (e, a) {
            (0, t._)(function* () {
              if (null == e ? void 0 : e.length) {
                a && a > 0 && (yield (0, n.y)(a));
                var s = [];
                !(function (e) {
                  for (var a = 0; a < e.length; a += 1)
                    (s[a] = new Image()), (s[a].src = e[a]);
                })(e);
              }
            })();
          })(e, a);
        });
      };
    },
    19397(e, a, s) {
      var t = s(41486),
        l = s(80085);
      a.A = function () {
        var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          [a, s] = (0, l.ok)(),
          { map: n = {}, defaults: r = {} } = e;
        return (
          (0, t.useEffect)(() => {
            var e = new URLSearchParams(a),
              t = !1;
            Object.entries(n).forEach((s) => {
              var [l, n] = s,
                r = a.get(l);
              null !== r && (e.delete(l), e.set(n, r), (t = !0));
            }),
              Object.entries(r).forEach((a) => {
                var [s, l] = a;
                e.get(s) || (e.set(s, l), (t = !0));
              }),
              t && s(e, { replace: !0 });
          }, [a, s, n, r]),
          [a, s]
        );
      };
    },
    20882(e, a, s) {
      s.d(a, { OH: () => o, OR: () => i });
      var t = s(41486),
        l = s(53219),
        n = s(81566);
      function r() {
        return (0, n.D8)() || (0, n.oK)() || (0, n.Mq)()
          ? 0
          : 0.88 *
              Number(
                document.querySelector("html").style.fontSize.replace("px", "")
              );
      }
      function i() {
        return r() || 20;
      }
      var o = () => {
        var [e, a] = (0, t.useState)(0);
        return (
          (0, l.A)(() => {
            a(r());
          }),
          e
        );
      };
    },
    14741(e, a, s) {
      s.d(a, { p: () => l });
      var t = s(41486),
        l = () => {
          var [e, a] = (0, t.useState)(!1),
            [s, l] = (0, t.useState)(0),
            [n, r] = (0, t.useState)(0),
            [i] = (0, t.useState)(10);
          return (
            (0, t.useEffect)(() => {
              var e = (e) => {
                  l(e.touches[0].clientX), r(e.touches[0].clientY);
                },
                t = (e) => {
                  var t = Math.abs(e.touches[0].clientX - s),
                    l = Math.abs(e.touches[0].clientY - n);
                  (t > i || l > i) && a(!0);
                },
                o = () => {
                  a(!1);
                };
              return (
                document.addEventListener("touchstart", e),
                document.addEventListener("touchmove", t),
                document.addEventListener("touchend", o),
                () => {
                  document.removeEventListener("touchstart", e),
                    document.removeEventListener("touchmove", t),
                    document.removeEventListener("touchend", o);
                }
              );
            }, [s, n, i]),
            e
          );
        };
    },
    49904(e, a, s) {
      s.r(a), s.d(a, { default: () => Vt });
      var t = s(86070),
        l = s(41486),
        n = s.n(l),
        r = "Page___ajrOM",
        i = s(19397),
        o = s(2307);
      var d = s(77602),
        c = {
          comp: "comp___caMdz",
          hide: "hide___Pe6aM",
          showAll: "showAll___G0GlM",
          showClose: "showClose___RlOHC",
          icon: "icon___kje6T",
          closeButton: "closeButton___bd1Ve",
          closeButtonImg: "closeButtonImg___nIOeg",
          tips: "tips___pzEE9",
          okButton: "okButton___sjBLn",
        },
        _ = s(14741),
        u = s(81566),
        h = s(20696),
        g = s(13526),
        v = s(52185);
      function m() {
        var { status: e, setStatus: a } = (function () {
            var [e, a] = (0, l.useState)("hide"),
              s = (0, l.useRef)(null),
              t = (0, l.useRef)(null),
              n = (0, _.p)();
            return (
              (0, l.useEffect)(
                () => (
                  (t.current = setTimeout(() => {
                    a("showAll");
                  }, 1e4)),
                  () => {
                    t.current && clearTimeout(t.current);
                  }
                ),
                []
              ),
              (0, l.useEffect)(() => {
                n && "showAll" === e && a("showClose");
              }, [n, e]),
              (0, l.useEffect)(
                () => (
                  "showClose" !== e ||
                    n ||
                    (s.current && clearTimeout(s.current),
                    (s.current = setTimeout(() => {
                      a("showAll");
                    }, 4e3))),
                  () => {
                    s.current && clearTimeout(s.current);
                  }
                ),
                [e, n]
              ),
              { status: e, setStatus: a }
            );
          })(),
          s = (0, l.useCallback)(() => {
            a("hide");
          }, [a]),
          n = (0, l.useCallback)(() => {
            h.x.navToZGYD(v.Pr);
          }, []);
        return (0, t.jsxs)("div", {
          className: (0, g.A)(c.comp, c[e]),
          children: [
            (0, t.jsx)("div", {
              className: c.closeButton,
              onClick: s,
              children: (0, t.jsx)("img", {
                className: c.closeButtonImg,
                src: "".concat(
                  gImgUrlPrefixLegacy,
                  "/rights/202411/15b27b03-80ed-482a-8050-6eaba88ede12-close.png"
                ),
                alt: "",
              }),
            }),
            (0, t.jsx)("img", {
              className: c.icon,
              src: "".concat(
                gImgUrlPrefixLegacy,
                "/rights/202411/06756771-df4f-409d-a3f1-6cfc8234e94d-2222.png"
              ),
              alt: "",
            }),
            (0, t.jsx)("div", {
              className: c.tips,
              children: "有任何问题可以咨询在线客服哦~",
            }),
            (0, t.jsx)("div", {
              className: c.okButton,
              onClick: n,
              children: "立即咨询 >",
            }),
          ],
        });
      }
      function x() {
        return (0, l.useMemo)(() => (0, u.D8)(), []) ? (0, t.jsx)(m, {}) : null;
      }
      var p = s(73147),
        N = s(13454),
        f = s(20837),
        I = s(43952),
        C = (s(30913), s(30176)),
        A = "MuCopyView___bbJdI",
        T = "back___zyYnx",
        j = "top_des___x59R3",
        P = "span_text___l029Y",
        b = "copy_view___gTE0s",
        M = "cpoy_des____9tE1",
        R = "copy___D0kMk",
        L = "disabled___q_uGw",
        S = "time___ImE1L",
        y = "bottom_view___eP0XD",
        U = "botton___NRVIK",
        O = "top_view___ShUw0",
        E = "title___eHwoi",
        k = "nameText___qdUZb",
        B = "button4___vJMdg",
        w = "phoneNo___Eu1qT",
        D = "codeInput___YSnaa",
        Y = "codeInputInner___FkzVU",
        G = "NormalCloseButton___N10n6",
        V = "NormalCloseButtonImage___fVKuB",
        H = s(12457),
        Q = s(891),
        F = s(95526),
        K = s(35574),
        Z = s(62033),
        W = s(59344);
      function J(e) {
        var a,
          { open: s, legalRights: n, codeList: r, onClose: i } = e,
          o = (0, K.nc)((e) => e.userInfo),
          d = (null == o ? void 0 : o.phoneNo) || "",
          [c, _] = (0, l.useState)(r),
          [u, v] = (0, l.useState)(0),
          [m, x] = (0, l.useState)("");
        return (
          (0, l.useEffect)(() => {
            var e = 0;
            r.forEach((a) => {
              "1" === a.state && (e += 1);
            }),
              v(e);
          }, [r]),
          (0, l.useEffect)(() => {
            _(r);
          }, [r]),
          (0, t.jsx)(Z.v, {
            open: s,
            closeOnMaskClick: !0,
            onClose: i,
            children: (0, t.jsxs)("div", {
              className: A,
              children: [
                (0, t.jsx)("div", {
                  className: O,
                  children: (0, t.jsx)("div", {
                    className: E,
                    children: r.length ? "商品内含兑换码，请手动复制" : null,
                  }),
                }),
                (0, t.jsxs)("div", {
                  className: k,
                  children: [
                    "【",
                    null == n ? void 0 : n.legalRightsName,
                    "】",
                  ],
                }),
                (0, t.jsxs)("div", {
                  className: T,
                  children: [
                    (0, t.jsxs)("div", {
                      className: j,
                      children: [
                        "请点击",
                        (0, t.jsx)("span", {
                          className: P,
                          children: "“复制”",
                        }),
                        "按钮，粘贴到兑换处进行兑换",
                      ],
                    }),
                    (0, t.jsx)("div", {
                      children: (0, F.A)(c)
                        ? c.map((e, a) =>
                            (0, t.jsxs)(
                              "div",
                              {
                                className: b,
                                children: [
                                  (0, t.jsxs)("div", {
                                    className: M,
                                    children: ["兑换码：", e.cardPwd],
                                  }),
                                  (0, t.jsx)("div", {
                                    className: (0, g.A)(
                                      R,
                                      "1" === e.state && L
                                    ),
                                    onClick: () =>
                                      ((e) => {
                                        "1" !== e.state &&
                                          Q.V.writeText({ text: e.cardPwd });
                                      })(e),
                                    children:
                                      "1" === e.state ? "已使用" : "复制",
                                  }),
                                ],
                              },
                              a
                            )
                          )
                        : null,
                    }),
                    (0, t.jsxs)("div", {
                      className: S,
                      children: [
                        "有效期时间至：",
                        null === (a = r[0]) || void 0 === a
                          ? void 0
                          : a.endDate,
                      ],
                    }),
                    (0, t.jsx)("div", { className: w, children: d }),
                    (0, t.jsx)(C.A, {
                      className: D,
                      inputClass: Y,
                      value: m,
                      onChange: (e, a) => x(a),
                      blockChangeWhenCompositing: !0,
                      placeholder: "粘贴卡密在此处进行兑换",
                      clearable: !0,
                      border: "none",
                      onClear: () => {
                        x("");
                      },
                    }),
                    (0, t.jsxs)("div", {
                      className: y,
                      children: [
                        (0, t.jsx)("div", {
                          className: U,
                          onClick: () => {
                            return (
                              (e = d),
                              (0, N._)(function* () {
                                if (m) {
                                  var a = yield (0, H.Q)({
                                      cardNo: e,
                                      cardCode: m,
                                      sku:
                                        null == n ? void 0 : n.legalRightsNbr,
                                    }),
                                    s = !1;
                                  try {
                                    var t, l;
                                    s =
                                      "0" ===
                                      (null === (l = JSON.parse(a.data)) ||
                                      void 0 === l ||
                                      null === (t = l.body) ||
                                      void 0 === t
                                        ? void 0
                                        : t.chargeState);
                                  } catch (e) {}
                                  if (s) {
                                    W.Z.success("兑换成功");
                                    var o = c.map((e) =>
                                      e.cardPwd === m
                                        ? (0, I._)((0, f._)({}, e), {
                                            state: "1",
                                          })
                                        : e
                                    );
                                    if ((_(o), r.length <= 1)) i();
                                    else {
                                      var d = u + 1;
                                      d === r.length ? i() : v(d);
                                    }
                                  } else
                                    try {
                                      W.Z.info(
                                        JSON.parse(a.data).body.chargeDesc
                                      );
                                    } catch (e) {
                                      W.Z.info("领取失败");
                                    }
                                } else W.Z.info("请输入卡密");
                              })()
                            );
                            var e;
                          },
                          children: "立即充值",
                        }),
                        "QY1709621567103" ===
                        (null == n ? void 0 : n.legalRightsNbr)
                          ? (0, t.jsx)("div", {
                              className: B,
                              onClick: () => {
                                h.x.navToZGYD(
                                  "https://dev.coc.10086.cn/coc3/rights-singlepages/mswmzzy?sourceid=056002"
                                );
                              },
                              children: "前往美团外卖点单",
                            })
                          : null,
                      ],
                    }),
                  ],
                }),
                (0, t.jsx)("div", {
                  className: G,
                  onClick: i,
                  children: (0, t.jsx)("img", {
                    className: V,
                    src: "".concat(
                      gImgUrlPrefixLegacy,
                      "/rights/202309/9c6b21e4-f860-4bbd-b7d3-af3430900604-wqe.png"
                    ),
                    alt: "",
                  }),
                }),
              ],
            }),
          })
        );
      }
      function q() {
        var e = (0, p.useStoreActions)(),
          a = (0, p.useStore)((e) => e.multiCodeModal),
          s = (0, p.useStore)((e) => e.currentOrderInfo),
          l = (0, p.useStore)((e) => e.codeList);
        return (0, t.jsx)(J, {
          open: a.open,
          legalRights: s,
          codeList: l,
          onClose: () => {
            e.batchUpdate({ multiCodeModal: { open: !1 } });
          },
        });
      }
      var z = s(86384);
      function X() {
        var e = (0, p.useStoreActions)(),
          a = (0, p.useStore)((e) => e.payDiscountModal);
        return (0, t.jsx)(z.N, {
          open: a.open,
          onClose: () => {
            e.batchUpdate({
              payDiscountModal: (0, I._)((0, f._)({}, a), { open: !1 }),
            });
          },
          tipsText: a.tipsText,
          orderId: a.orderId,
          endTime: a.endTime,
        });
      }
      var $ = s(21051),
        ee = s(66782),
        ae = s(30650);
      function se() {
        var e = (0, p.useStoreActions)(),
          a = (0, p.useStore)((e) => e.qrCodeModal),
          s = (0, p.useStore)((e) => e.currentOrderInfo),
          n = (0, l.useMemo)(
            () =>
              gImgUrlPrefixLegacy +
              (0, $.Gx)(null == s ? void 0 : s.legalRightsAttrs, "img_211_151"),
            [s]
          ),
          r = (0, l.useMemo)(
            () =>
              (0, $.Gx)(
                null == s ? void 0 : s.legalRightsAttrs,
                "instructions"
              ),
            [s]
          ),
          i = (0, l.useMemo)(() => (0, ee.Wj)(s), [s]);
        return (0, t.jsx)(ae.s, {
          open: a.open,
          icon: n,
          title: (null == s ? void 0 : s.legalRightsName) || "",
          description: r,
          qrcodeValue: a.code,
          endTime: a.endTime,
          startTime: a.startTime,
          state: a.state,
          showQrcodeValue: i,
          onOk: () => {
            e.batchUpdate({
              qrCodeModal: {
                open: !1,
                data: {},
                code: "",
                endTime: "",
                startTime: "",
                state: "0",
              },
            });
          },
        });
      }
      s(94012);
      var te = s(22810),
        le = "List___m7lem",
        ne = "Option___IRQv0",
        re = "OptionIcon___LTvZH",
        ie = "OptionName___K0ucd",
        oe = "OptionCheckedIcon___x63Jf",
        de = [
          {
            icon: "/rights/202509/e319610d-c469-4ae5-ba55-7b2d3e6955d1-07.png",
            name: "微信支付",
            value: "WEIXIN-WAP",
          },
          {
            icon: "/rights/202509/d0e3dfc4-ba35-4d95-91ff-e10582b6cd7a-08.png",
            name: "支付宝",
            value: "ALIPAY-WAP",
          },
          {
            icon: "/rights/202509/66fdc7e8-654f-40e8-a2e6-05568334825b-06.png",
            name: "和包支付",
            value: "CMPAY-WAP",
          },
        ],
        ce = s(50654),
        _e = "Modal___bMvi3",
        ue = "Header___oHQkT",
        he = "BackButton___Shr6r",
        ge = "BackButtonIcon___jnhzA",
        ve = "BackButtonIconImg___unxjT",
        me = "Title___Nn_es",
        xe = "Body___NWudn",
        pe = s(98165);
      function Ne(e) {
        var { children: a, visible: s, title: l, onClose: n } = e,
          r = (0, ce._)(e, ["children", "visible", "title", "onClose"]);
        return (0, t.jsx)(
          pe.f,
          (0, I._)(
            (0, f._)(
              { visible: s, hasCloseButton: !1, hasFoot: !1, zIndex: 999 },
              r
            ),
            {
              children: (0, t.jsxs)("div", {
                className: _e,
                children: [
                  (0, t.jsx)("div", {
                    className: ue,
                    children: (0, t.jsxs)("div", {
                      className: he,
                      onClick: n,
                      children: [
                        (0, t.jsx)("div", {
                          className: ge,
                          children: (0, t.jsx)("img", {
                            className: ve,
                            src: "".concat(
                              gImgUrlPrefixLegacy,
                              "/rights/202509/572619e0-b9e7-4d92-99de-8e8453fe2893-01.png"
                            ),
                            alt: "",
                          }),
                        }),
                        (0, t.jsx)("div", { className: me, children: l }),
                      ],
                    }),
                  }),
                  (0, t.jsx)("div", { className: xe, children: a }),
                ],
              }),
            }
          )
        );
      }
      function fe() {
        var e = (0, p.useStore)((e) => e.paymentMethodModal),
          a = (0, p.useStore)((e) => e.currentPaymentMethod),
          s = (0, p.useStoreActions)();
        return (0, t.jsx)(Ne, {
          visible: e.open,
          title: "选择支付方式",
          onClose: () => {
            s.batchUpdate({ paymentMethodModal: { open: !1 } });
          },
          children: (0, t.jsx)("div", {
            className: le,
            children: de.map((e) =>
              (0, t.jsxs)(
                n().Fragment,
                {
                  children: [
                    (0, t.jsxs)("div", {
                      className: ne,
                      onClick: () => {
                        s.batchUpdate({
                          currentPaymentMethod: e.value,
                          paymentMethodModal: { open: !1 },
                        });
                      },
                      children: [
                        (0, t.jsx)("img", {
                          className: re,
                          src: "".concat(gImgUrlPrefixLegacy).concat(e.icon),
                          alt: "",
                        }),
                        (0, t.jsx)("span", { className: ie, children: e.name }),
                        e.value === a
                          ? (0, t.jsx)("img", {
                              className: oe,
                              src: "".concat(
                                gImgUrlPrefixLegacy,
                                "/rights/202509/ef265e59-804b-4c03-ae5a-7d7343c161ee-02.png"
                              ),
                              alt: "",
                            })
                          : null,
                      ],
                    }),
                    (0, t.jsx)(te.A, {
                      style: { padding: 0, borderColor: "#E5E5E5" },
                    }),
                  ],
                },
                e.value
              )
            ),
          }),
        });
      }
      var Ie = "Container___esfkS",
        Ce = s(15189),
        Ae = s(62127),
        Te = "Container___hHisw",
        je = "CombList___UPKdo",
        Pe = "CombItem___lhaUP",
        be = "Disabled___C6BL1",
        Me = "CombItemButtonText___RYieq",
        Re = "CombItemIcon___cVf6r",
        Le = "CombItemName___spiDi",
        Se = "CombItemButton___NC3Wr",
        ye = "CombItemButtonIcon___fxqog";
      function Ue(e) {
        var { data: a } = e,
          s = (0, ce._)(e, ["data"]);
        return (0, t.jsxs)(
          "div",
          (0, I._)((0, f._)({ className: (0, g.A)(Pe, a.disabled && be) }, s), {
            children: [
              (0, t.jsx)("img", {
                className: Re,
                src: "".concat(gImgUrlPrefixLegacy).concat(a.icon),
                alt: "",
              }),
              (0, t.jsx)("span", { className: Le, children: a.name }),
              (0, t.jsxs)("button", {
                className: Se,
                type: "button",
                children: [
                  (0, t.jsx)("span", { className: Me, children: a.buttonText }),
                  (0, t.jsx)("img", {
                    className: ye,
                    src: "".concat(
                      gImgUrlPrefixLegacy,
                      "/rights/202509/b5d9df58-1273-4ccb-af31-cbd4b0581973-ahgo.png"
                    ),
                    alt: "",
                  }),
                ],
              }),
            ],
          })
        );
      }
      function Oe() {
        var e = (0, p.useStore)((e) => e.currentPaymentMethod),
          a = de.find((a) => a.value === e),
          s = (0, p.useStoreActions)();
        return (0, t.jsx)("div", {
          className: Te,
          children: (0, t.jsx)("div", {
            className: je,
            children: (0, t.jsx)(Ue, {
              data: (0, I._)((0, f._)({}, a), {
                buttonText: "切换方式",
                disabled: !1,
              }),
              onClick: () => {
                s.batchUpdate({ paymentMethodModal: { open: !0 } });
              },
            }),
          }),
        });
      }
      var Ee = "ProductInfo___kSDTy",
        ke = "ProductInfoItem___vYCdQ",
        Be = "ProductInfoLabel___KvS4h",
        we = "ProductInfoText___QPjYd",
        De = s(64308);
      function Ye() {
        var e = (0, p.useStore)((e) => e.currentOrderInfo),
          a = null == e ? void 0 : e.legalRightsDesc,
          s = (0, l.useMemo)(
            () =>
              (0, De.lK)(
                null == e ? void 0 : e.legalRightsAttrs,
                "effExplain",
                !1
              )
                ? (0, De.lK)(
                    null == e ? void 0 : e.legalRightsAttrs,
                    "effExplain",
                    !1
                  )
                : "详见产品介绍",
            [null == e ? void 0 : e.legalRightsAttrs]
          );
        return (0, t.jsxs)("div", {
          className: Ee,
          children: [
            (0, t.jsxs)("div", {
              className: ke,
              children: [
                (0, t.jsx)("div", { className: Be, children: "已选商品" }),
                (0, t.jsx)("div", { className: we, children: a }),
              ],
            }),
            (0, t.jsxs)("div", {
              className: ke,
              children: [
                (0, t.jsx)("div", { className: Be, children: "生效时间" }),
                (0, t.jsx)("div", {
                  className: we,
                  children: "以权益到账短信或权益方说明为准",
                }),
              ],
            }),
            (0, t.jsxs)("div", {
              className: ke,
              children: [
                (0, t.jsx)("div", { className: Be, children: "续订规则" }),
                (0, t.jsx)("div", { className: we, children: s }),
              ],
            }),
          ],
        });
      }
      var Ge = "OkButton___QJTrW",
        Ve = "Purple___wKd91",
        He = "Disabled___V_q_m",
        Qe = "LoadingIcon___DHQAB";
      function Fe(e) {
        var { loading: a, disabled: s, onOk: l } = e;
        return (0, t.jsxs)("div", {
          className: (0, g.A)(Ge, Ve, (a || s) && He),
          onClick: l,
          children: [
            a
              ? (0, t.jsx)("span", { className: (0, g.A)(Qe, "ani-rotate") })
              : null,
            a ? "正在支付中" : "确认支付",
          ],
        });
      }
      var Ke = "PriceDisplay___FqGi9",
        Ze = "DiscountsPrice___jOhGL",
        We = "CurrencySymbol___NNgGX",
        Je = "PriceValue___aaz4i";
      function qe() {
        var e = (0, p.useStore)((e) => e.currentOrderInfo);
        return (0, t.jsxs)("div", {
          className: Ke,
          children: [
            (0, t.jsxs)("div", {
              className: Ze,
              children: [
                (0, t.jsx)("span", { className: We, children: "￥" }),
                (0, t.jsx)("span", {
                  className: Je,
                  children: null == e ? void 0 : e.price,
                }),
              ],
            }),
            null,
          ],
        });
      }
      var ze = s(33843),
        Xe = () => {
          (0, Ae.x)(
            de.map((e) => "".concat(gImgUrlPrefixLegacy).concat(e.icon))
          );
          var e = (0, p.useStoreActions)(),
            a = (0, p.useStore)((e) => e.currentOrderInfo),
            s = (0, p.useStore)((e) => e.repayModal.open),
            n = (0, p.useStore)((e) => e.currentPaymentMethod),
            [r, i] = (0, l.useState)(!1);
          return (0, t.jsx)(pe.f, {
            visible: s,
            hasFoot: !1,
            onClose: () => {
              e.batchUpdate({
                currentPaymentMethod: void 0,
                repayModal: { open: !1 },
              });
            },
            children: (0, t.jsxs)("div", {
              className: Ie,
              children: [
                (0, t.jsx)(qe, {}),
                (0, t.jsx)(Ye, {}),
                (0, t.jsx)(Oe, {}),
                (0, t.jsx)(Fe, {
                  loading: r,
                  onOk: () =>
                    (0, N._)(function* () {
                      var e;
                      if (a && n) {
                        i(!0);
                        var s = yield (0, Ce.Mc)({
                          channelOrderId: a.custOrderId,
                          paymentType: n,
                        });
                        i(!1),
                          "0" === s.resultCode &&
                          (null === (e = s.data) || void 0 === e
                            ? void 0
                            : e.thirdEditUrl)
                            ? (window.location.href = s.data.thirdEditUrl)
                            : ze.R.openCommonOrderFailModal();
                      }
                    })(),
                }),
              ],
            }),
          });
        };
      Xe.displayName = "RepayModal";
      var $e = n().forwardRef(Xe);
      function ea() {
        return (0, t.jsxs)(t.Fragment, {
          children: [(0, t.jsx)($e, {}), (0, t.jsx)(fe, {})],
        });
      }
      var aa = {
          copyViewContainer: "copyViewContainer___GyQLx",
          submitButton: "submitButton___nD0RV",
          content: "content___YHPsz",
          topDesc: "topDesc___sp1xT",
          copyList: "copyList___Gmfbq",
          time: "time___pJMMi",
          head: "head___A6kTW",
          icon: "icon___Uz1Gl",
          title: "title___ewHpy",
          marqueeContainer: "marqueeContainer___MeMvi",
          marqueeText: "marqueeText___piPrd",
          marquee: "marquee___sKg6t",
          flexBox: "flexBox___JxaKF",
        },
        sa = s(19694),
        ta = s(90570),
        la = s(32792),
        na = s(58349);
      function ra(e) {
        var {
            open: a,
            legalRights: s,
            codeList: r = {},
            onClose: i = () => {},
          } = e,
          [o, d] = (0, l.useState)(""),
          { copy: c, state: _ } = (function () {
            var [e, a] = (0, l.useState)(!1);
            return {
              copy: (e) => {
                var s, t;
                (null == e ? void 0 : e.length) &&
                  (null === (t = navigator) ||
                    void 0 === t ||
                    null === (s = t.clipboard) ||
                    void 0 === s ||
                    s.writeText(e).then(
                      () => a(!0),
                      () => a(!1)
                    ));
              },
              state: e,
            };
          })(),
          u = _
            ? (function (e) {
                if (sa.A(e) || ta.A(e)) return "";
                var a = (0, ee.xI)(e);
                return "1500" === a
                  ? "已经自动帮您复制订单号"
                  : "1300" === a
                  ? "已经自动帮您复制链接"
                  : ("1100" === a || e.legalRightsNbr,
                    "已经自动帮您复制兑换码");
              })(s)
            : "自动复制失败，请手动复制～";
        (0, l.useEffect)(() => {
          var e = "";
          if (F.A(r) && 1 === r.length) {
            var a,
              s,
              t = null === (a = r[0]) || void 0 === a ? void 0 : a.cardPwd,
              l = null === (s = r[0]) || void 0 === s ? void 0 : s.cardNo;
            e = (null == t ? void 0 : t.length) ? t : l;
          } else if (la.A(r)) {
            var n = null == r ? void 0 : r.cardPwd,
              i = null == r ? void 0 : r.cardNo;
            (e = (null == n ? void 0 : n.length) ? n : i), d(e);
          }
          c(e);
        }, [r, c]);
        var h = (0, l.useMemo)(() => {
            var e;
            return sa.A(s) || ta.A(s)
              ? null
              : "QY1657789125042" === s.legalRightsNbr
              ? "登录“开心消消乐”APP，点击左下角菜单栏，找到“兑换中心”-“点击对话框空白处”-“输入兑换码”-点击“领取”"
              : (null ===
                  (e = s.legalRightsAttrs.find((e) => e.instructions)) ||
                void 0 === e
                  ? void 0
                  : e.instructions) || "暂无商品描述";
          }, [s]),
          v = (0, l.useMemo)(
            () =>
              r
                ? F.A(r) && r.length && r[0].endDate
                  ? "有效期时间至：".concat(r[0].endDate)
                  : la.A(r) && r.endDate
                  ? "有效期时间至：".concat(r.endDate)
                  : null
                : null,
            [r]
          ),
          m = (e) => {
            var a,
              t = "兑换码：";
            return (
              "1500" === (0, ee.xI)(s) && (t = "订单号："),
              "1300" ===
                (null === (a = s.legalRightsAttrs.find((e) => e.receiveMode)) ||
                void 0 === a
                  ? void 0
                  : a.receiveMode) && (t = "账号绑定链接："),
              (0, ee.H)(s, ["Ticket_Code_Password"]) &&
                0 === e &&
                (t = "兑换密码："),
              (0, ee.H)(s, ["Ticket_Code_Password"]) &&
                1 === e &&
                (t = "电子券码："),
              (0, ee.H)(s, ["TiktokLife"]) && 0 === e && (t = "兑换码1："),
              (0, ee.H)(s, ["TiktokLife"]) && 1 === e && (t = "兑换码2："),
              t
            );
          };
        return (0, t.jsx)(Z.v, {
          open: a,
          children: (0, t.jsxs)("div", {
            className: aa.copyViewContainer,
            children: [
              F.A(r) && r.length > 1
                ? null
                : (0, t.jsxs)("div", {
                    className: aa.head,
                    children: [
                      _
                        ? (0, t.jsx)("img", {
                            className: aa.icon,
                            src: "".concat(
                              gImgUrlPrefixLegacy,
                              "/rights/202303/fcad8093-d2b2-4852-82f6-68a44474fe53-icon_success.png"
                            ),
                            alt: "",
                          })
                        : null,
                      (0, t.jsx)("div", { className: aa.title, children: u }),
                    ],
                  }),
              (0, t.jsxs)("div", {
                className: aa.content,
                children: [
                  (0, t.jsx)(na.s, { className: aa.topDesc, text: h }),
                  (0, t.jsx)("div", {
                    className: aa.copyList,
                    children: (() => {
                      var e;
                      if (sa.A(s) || ta.A(s)) return null;
                      var a =
                        null ===
                          (e = s.legalRightsAttrs.find((e) => e.receiveMode)) ||
                        void 0 === e
                          ? void 0
                          : e.receiveMode;
                      return "QY1657789125042" === s.legalRightsNbr
                        ? Array.isArray(r) &&
                            r.map((e, a) =>
                              (0, t.jsxs)(
                                "div",
                                {
                                  style: {
                                    display: "flex",
                                    justifyContent: "space-between",
                                  },
                                  children: [
                                    e.cardNo
                                      ? (0, t.jsxs)("div", {
                                          children: ["兑换账号：", e.cardNo],
                                        })
                                      : null,
                                    e.cardPwd
                                      ? (0, t.jsxs)("div", {
                                          children: ["兑换码：", e.cardPwd],
                                        })
                                      : null,
                                    (0, t.jsx)("div", {
                                      children:
                                        "1" !== e.state ? "未使用" : "已使用",
                                    }),
                                  ],
                                },
                                a
                              )
                            )
                        : r.length
                        ? r.map((e, a) =>
                            (0, t.jsxs)(
                              n().Fragment,
                              {
                                children: [
                                  (0, ee.H)(s, ["TiktokLife"])
                                    ? null
                                    : (0, t.jsxs)("div", {
                                        style: {
                                          display: "flex",
                                          width: "100%",
                                          justifyContent: "space-between",
                                        },
                                        children: [
                                          e.cardNo
                                            ? (0, t.jsxs)("div", {
                                                children: [
                                                  (0, ee.H)(s, [
                                                    "Ticket_Code_Password",
                                                  ])
                                                    ? "兑换卡号："
                                                    : "兑换账号：",
                                                  e.cardNo,
                                                ],
                                              })
                                            : null,
                                          (0, t.jsx)("div", {
                                            className: aa.copy,
                                            style: {
                                              color:
                                                "1" === e.state
                                                  ? "#ccc"
                                                  : "#ff6200",
                                              whiteSpace: "nowrap",
                                              marginLeft: "4px",
                                            },
                                            onClick: () => {
                                              "1" !== e.state &&
                                                Q.V.writeText({
                                                  text: e.cardNo,
                                                });
                                            },
                                            children: e.cardNo
                                              ? "1" !== e.state
                                                ? "复制"
                                                : "已使用"
                                              : "",
                                          }),
                                        ],
                                      }),
                                  (0, t.jsxs)("div", {
                                    style: {
                                      display: "flex",
                                      width: "100%",
                                      justifyContent: "space-between",
                                    },
                                    children: [
                                      (0, ee.H)(s, ["TiktokLife"])
                                        ? (0, t.jsxs)("div", {
                                            className: aa.flexBox,
                                            children: [
                                              e.cardPwd ? m(a) : "",
                                              (0, t.jsx)("div", {
                                                className: aa.marqueeContainer,
                                                children: (0, t.jsx)("span", {
                                                  className: aa.marqueeText,
                                                  children: e.cardPwd
                                                    ? e.cardPwd
                                                    : "",
                                                }),
                                              }),
                                            ],
                                          })
                                        : (0, t.jsx)("div", {
                                            children: (0, t.jsxs)("div", {
                                              className: aa.flexBox,
                                              children: [
                                                e.cardPwd ? m(a) : "",
                                                (0, t.jsx)("div", {
                                                  className:
                                                    aa.marqueeContainer,
                                                  children: (0, t.jsx)("span", {
                                                    className: (0, g.A)({
                                                      [aa.marqueeText]:
                                                        e.cardPwd.length > 21,
                                                    }),
                                                    children: e.cardPwd
                                                      ? e.cardPwd
                                                      : "",
                                                  }),
                                                }),
                                              ],
                                            }),
                                          }),
                                      (0, t.jsx)("div", {
                                        className: aa.copy,
                                        style: {
                                          color:
                                            "1" === e.state
                                              ? "#ccc"
                                              : "#ff6200",
                                          whiteSpace: "nowrap",
                                          marginLeft: "4px",
                                        },
                                        onClick: () => {
                                          "1" !== e.state &&
                                            Q.V.writeText({ text: e.cardPwd });
                                        },
                                        children: e.cardPwd
                                          ? "1" !== e.state
                                            ? "复制"
                                            : "已使用"
                                          : "",
                                      }),
                                    ],
                                  }),
                                ],
                              },
                              a
                            )
                          )
                        : "1500" === (0, ee.xI)(s)
                        ? "订单号：".concat(o)
                        : o
                        ? ""
                            .concat(
                              "1300" === a ? "账号绑定链接：" : "兑换码："
                            )
                            .concat(o)
                        : "";
                    })(),
                  }),
                  v
                    ? (0, t.jsxs)("div", {
                        className: aa.time,
                        children: [
                          v,
                          (0, t.jsx)("br", {}),
                          (0, ee.H)(s, ["Ticket_Code_Password"]) && r.length
                            ? "电子券码有效期至：".concat(r[1].endDate)
                            : "",
                        ],
                      })
                    : null,
                  (0, t.jsx)("div", {
                    className: aa.submitButton,
                    onClick: i,
                    children: "我知道了",
                  }),
                ],
              }),
            ],
          }),
        });
      }
      function ia() {
        var e = (0, p.useStoreActions)(),
          a = (0, p.useStore)((e) => e.singleCodeModal),
          s = (0, p.useStore)((e) => e.currentOrderInfo),
          l = (0, p.useStore)((e) => e.codeList);
        return (0, t.jsx)(ra, {
          open: a.open,
          legalRights: s,
          codeList: l,
          onClose: () => {
            e.batchUpdate({ singleCodeModal: { open: !1 } });
          },
        });
      }
      var oa = "Modal___Z4cv2",
        da = "particulars___FzC9M",
        ca = "particularsTitle___OI3r1",
        _a = "particularsContent___xbGGX",
        ua = "popup4Explain___iDXiA",
        ha = "popup4Button___E_G6Q";
      function ga() {
        var e = (0, p.useStoreActions)(),
          a = (0, p.useStore)((e) => e.viewModal),
          s = (0, p.useStore)((e) => e.currentOrderInfo),
          n = null == s ? void 0 : s.legalRightsName,
          r = (0, l.useMemo)(
            () => (0, $.Gx)(null == s ? void 0 : s.legalRightsAttrs, "remark"),
            [null == s ? void 0 : s.legalRightsAttrs]
          );
        return (0, t.jsx)(Z.v, {
          closeOnMaskClick: !0,
          open: a.open,
          children: (0, t.jsxs)("div", {
            className: oa,
            children: [
              (0, t.jsxs)("div", {
                className: da,
                children: [
                  (0, t.jsx)("div", { className: ca, children: "权益名称：" }),
                  (0, t.jsx)("div", { className: _a, children: n }),
                ],
              }),
              (0, t.jsx)("div", { className: ca, children: "权益说明：" }),
              (0, t.jsx)(na.s, { className: ua, text: r }),
              (0, t.jsx)("div", {
                className: ha,
                onClick: () => {
                  e.batchUpdate({ viewModal: { open: !1 } });
                },
                children: "我知道了",
              }),
            ],
          }),
        });
      }
      s(24426);
      var va = s(27661),
        ma = "orderList___Pf43C",
        xa = "footerTips___D1nf_",
        pa = "footerTips2___UaruG",
        Na = "PullRefresh___nDF8I",
        fa = s(80085),
        Ia = s(93521),
        Ca = s(98973),
        Aa = s(346),
        Ta = s(66420),
        ja = (s(29117), s(55970)),
        Pa = "BuyCateCard___mrJy1",
        ba = "center___PdVdc",
        Ma = "top_view___Jlgh3",
        Ra = "buy_time___a_vSG",
        La = "top_view_left_text___MIuZN",
        Sa = "center_view___uxssz",
        ya = "IconWrap___WefVL",
        Ua = "icon___DaOlE",
        Oa = "center_right___WZPci",
        Ea = "center_right_top___DNHhM",
        ka = "center_right_top_title___U_0KW",
        Ba = "center_right_top_money___tcKPt",
        wa = "center_right_center___Q_3Xm",
        Da = "center_right_bottom___s04nk",
        Ya = "bottom_view___mF1QB",
        Ga = "bottom_view_right___ST8y5",
        Va = "ReorderButton___OTLEF",
        Ha = "CommonButton___O6ucy",
        Qa = "orderState___EgtOT",
        Fa = "orderStateImg____EU0T",
        Ka = "orderStateBottom___kYbdO",
        Za = "orderStateLeft___WGSQP",
        Wa = "orderStateRight___hmMAW",
        Ja = "ExtraTips___COJGv",
        qa = "FooterTips___Dn_Pb",
        za = "CancelOrderButton___xQGxv",
        Xa = "RepayButton___UkIne",
        $a = "RepayButtonCountDown___hLNZq",
        es = "RepayButtonText___tactJ",
        as = () => {
          var e = (0, p.useStoreActions)(),
            [a] = (0, fa.ok)(),
            s = a.get("date"),
            t = a.get("status"),
            l = a.get("category");
          return {
            queryOrders: () => {
              e.updateOrderList(t, l, s);
            },
          };
        },
        ss = s(10059),
        ts = [
          "QY1656670801142",
          "QY1709621567103",
          "QY1657789125042",
          "QY1651155514697",
          "QY1651213843552",
          "QY1651214117903",
        ],
        ls = (e) => {
          var a = (0, p.useStoreActions)(),
            {
              orderInfo: s,
              onDetailButtonClick: n,
              onExchangeButtonClick: r,
            } = e,
            { queryOrders: i } = as(),
            o = (0, l.useMemo)(() => (0, ee.Cg)(s), [s]),
            {
              date: d = "",
              legalRightsAttrs: c,
              legalRightsNbr: _,
              linkUrl: u,
              statusCd: g,
            } = s,
            v = (0, f._)({}, s);
          c.forEach((e) => {
            v = (0, f._)({}, v, e);
          });
          var m,
            x,
            I = d ? d.substring(0, 10) : "",
            C = (0, ee.Sl)(s),
            A = (() => {
              var { statusCd: e } = s;
              return "1000" === e
                ? "已完成"
                : ["1100", "1200", "1300"].includes(e)
                ? "权益购买失败"
                : (0, Ca._g)(e)
                ? "交易中"
                : (0, Ca.Ri)(e)
                ? "已关闭"
                : "";
            })(),
            T = (0, Ca._g)(g) ? "请在30分钟内确认" : null,
            j = (e) =>
              "QY1650613475930" === e || "QY1708589422101" === e
                ? "查看使用"
                : "QY1689749726840" === e
                ? "美食专区"
                : "获取卡密",
            P = () => {
              if (
                (0, ee.h1)({
                  belongAreas: o,
                  targetAreas: ["ACT_RIGHTS_PICK2"],
                })
              )
                h.x.navToPath("/act/pick2");
              else if (
                (0, ee.h1)({ belongAreas: o, targetAreas: ["ACT_RIGHTS_PICK"] })
              )
                h.x.navToPath("/act/pick");
              else if (
                (0, ee.h1)({
                  belongAreas: o,
                  targetAreas: [
                    "M2_VIP_LUCKY_BAG",
                    "M3_VIP_LUCKY_BAG",
                    "M4_VIP_LUCKY_BAG",
                    "M5_VIP_LUCKY_BAG",
                    "M2_VIP_DISCOUNT_PURCHASE",
                    "M3_VIP_DISCOUNT_PURCHASE",
                    "M4_VIP_DISCOUNT_PURCHASE",
                    "M5_VIP_DISCOUNT_PURCHASE",
                  ],
                })
              )
                h.x.navToPath("/Mzone");
              else {
                if (!(0, ee.h1)({ belongAreas: o, targetAreas: ["ZWRIGHTS"] }))
                  return (0, ee.h1)({
                    belongAreas: o,
                    targetAreas: [
                      "99PLUS_CORE",
                      "99PLUS_DISCOUNT",
                      "99PLUS2_CORE_YR",
                      "99PLUS2_CORE_MO",
                      "99PLUS2_DISCOUNT",
                    ],
                  })
                    ? "99PLUS_NEW" === (null == s ? void 0 : s.orderSource)
                      ? void h.x.navToPath("/99plus2")
                      : void h.x.navToPath("/99plus")
                    : void ((0, ee.h1)({
                        belongAreas: o,
                        targetAreas: ["COMMON_HALF_PRICE"],
                      })
                        ? (0, Ca.E$)(s.date)
                          ? h.x.navToPath("/phoneZone/goodsDetail", {
                              legalRightsNbr:
                                null == s ? void 0 : s.legalRightsNbr,
                              legalRightsId:
                                null == s ? void 0 : s.legalRightsId,
                              offerId: null == s ? void 0 : s.offerId,
                            })
                          : h.x.utils.navToHomePage()
                        : (0, ee.h1)({
                            belongAreas: o,
                            targetAreas: [
                              "halfPriceArea-Gold",
                              "halfPriceArea-Plus",
                              "LIMIT_M1_BJ_WZG",
                            ],
                          })
                        ? h.x.utils.navToHomePage()
                        : "3000" !== s.legalRightsType ||
                          (!s.legalRightsName.includes("咪咕") &&
                            !s.legalRightsName.includes("NBA"))
                        ? "黄金5元话费折扣券（北京移动 PLUS 黄金会员专属）" !==
                            (null == s ? void 0 : s.legalRightsName) &&
                          "黄金5元话费折扣券（北京移动 PLUS 黄金会员专属）" !==
                            (null == s ? void 0 : s.legalRightsName)
                          ? (0, ee.h1)({
                              belongAreas: o,
                              targetAreas: ["LIMIT_M2_BJ_LL"],
                            })
                            ? h.x.utils.navToHomePage()
                            : (0, ee.h1)({
                                belongAreas: o,
                                targetAreas: ["LIMIT_M1_BJ_FD"],
                              })
                            ? h.x.navToPath("/phoneZone/goodsDetail", {
                                fromPageType: "PlatinumRight",
                                legalRightsNbr:
                                  null == s ? void 0 : s.legalRightsNbr,
                                legalRightsId:
                                  null == s ? void 0 : s.legalRightsId,
                                offerId: null == s ? void 0 : s.offerId,
                              })
                            : (0, ee.h1)({
                                belongAreas: o,
                                targetAreas: ["LOCAL_MEM_BONUS"],
                              })
                            ? h.x.navToPath("/activity/GoLocal/goodDetail", {
                                legalRightsNbr:
                                  null == s ? void 0 : s.legalRightsNbr,
                              })
                            : (0, ee.h1)({
                                belongAreas: o,
                                targetAreas: ["LIMIT_M1_2"],
                              })
                            ? h.x.navToPath("/plusThird", { pageType: "Gold" })
                            : (0, ee.h1)({
                                belongAreas: o,
                                targetAreas: ["LIMIT_M1_1", "LIMIT_M2_1"],
                              })
                            ? h.x.navToPath("/phoneZone/goodsDetail", {
                                fromPageType: "GoldRight",
                                legalRightsNbr:
                                  null == s ? void 0 : s.legalRightsNbr,
                                legalRightsId:
                                  null == s ? void 0 : s.legalRightsId,
                                offerId: null == s ? void 0 : s.offerId,
                              })
                            : "NOTEXIST_LEGALRIGHTS" !==
                              (null == s ? void 0 : s.legalRightsNbr)
                            ? n(s)
                            : h.x.utils.navToHomePage()
                          : h.x.navToPath("/fivePhoneBill")
                        : h.x.navToPath("/SportZone"));
                h.x.navToZW(
                  "https://plus.bj.10086.cn/eisp-portal/?ver=pro#/couponIssuance?channelId=1"
                );
              }
            },
            b = () =>
              (0, N._)(function* () {
                W.Z.loading();
                var e = yield (0, Ce.N4)({ channelOrderId: s.custOrderId });
                if ((W.Z.clear(), "0" === e.resultCode))
                  return i(), void W.Z.info("取消成功");
                W.Z.info("系统繁忙，请稍后再试");
              })(),
            M = () =>
              (0, N._)(function* () {
                a.batchUpdate({ repayModal: { open: !0 } });
              })(),
            R =
              {
                "7 ": "混合支付",
                10: "能开话费支付",
                11: "第三方支付",
                12: "权益额度支付",
                13: "积分混合支付",
                14: "云货架渠道侧扣费单次点播",
                15: "北京通兑券",
                16: "省渠道领取",
                17: "兑换券支付",
                18: "话费连续包月（首月积分）",
                20: "三方支付连续包月 - 三网版",
                24: "爆米券支付",
              }[s.payType] || "话费支付 单次点播";
          return (0, t.jsxs)("div", {
            className: Pa,
            children: [
              "1200" === s.legalRightsSubordinate &&
              s.legalRightsAttrs.find(
                (e) => "1000" === (null == e ? void 0 : e.syncGroup)
              )
                ? "1000" === s.statusCd
                  ? (0, t.jsxs)("div", {
                      className: Qa,
                      children: [
                        (0, t.jsx)("img", {
                          src: "".concat(
                            gImgUrlPrefixLegacy,
                            "/rights/202305/f06ed59b-49a2-4c1c-8627-53d57fead398-8421.png"
                          ),
                          alt: "",
                          className: Fa,
                        }),
                        (0, t.jsxs)("div", {
                          className: Ka,
                          children: [
                            (0, t.jsx)("div", {
                              className: Za,
                              children: "您的订单已提交成功",
                            }),
                            (0, t.jsx)("div", {
                              className: Wa,
                              children: "权益发放成功",
                            }),
                          ],
                        }),
                      ],
                    })
                  : ["1100", "1200", "1300"].includes(s.statusCd)
                  ? (0, t.jsxs)("div", {
                      className: Qa,
                      children: [
                        (0, t.jsx)("img", {
                          src: "".concat(
                            gImgUrlPrefixLegacy,
                            "/rights/202305/38aa325f-5982-4de1-9c63-9f2721730a7d-7002.png"
                          ),
                          alt: "",
                          className: Fa,
                        }),
                        (0, t.jsxs)("div", {
                          className: Ka,
                          children: [
                            (0, t.jsx)("div", {
                              className: Za,
                              children: "您的订单已提交成功",
                            }),
                            (0, t.jsx)("div", {
                              className: Wa,
                              children: "权益发放失败",
                            }),
                          ],
                        }),
                      ],
                    })
                  : "1400" === s.statusCd
                  ? (0, t.jsxs)("div", {
                      className: Qa,
                      children: [
                        (0, t.jsx)("img", {
                          src: "".concat(
                            gImgUrlPrefixLegacy,
                            "/rights/202305/61ae5b5f-aa0a-424f-a85e-d5da047ff7be-54023.png"
                          ),
                          alt: "",
                          className: Fa,
                        }),
                        (0, t.jsxs)("div", {
                          className: Ka,
                          children: [
                            (0, t.jsx)("div", {
                              className: Za,
                              children: "您的订单已提交成功",
                            }),
                            (0, t.jsx)("div", {
                              className: Wa,
                              style: { color: "#FE642B" },
                              children: "权益发放处理中",
                            }),
                          ],
                        }),
                      ],
                    })
                  : null
                : null,
              (0, t.jsxs)("div", {
                className: ba,
                children: [
                  (0, t.jsxs)("div", {
                    className: Ma,
                    children: [
                      (0, t.jsxs)("div", {
                        className: Ra,
                        children: ["订购日期：", I],
                      }),
                      (0, t.jsx)("div", { className: La, children: A }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className: Sa,
                    children: [
                      (0, t.jsxs)("div", {
                        className: ya,
                        children: [
                          (0, t.jsx)(ss.Y, {
                            statusCd: s.statusCd,
                            size: "lg",
                          }),
                          (0, t.jsx)("img", { src: C, className: Ua, alt: "" }),
                        ],
                      }),
                      (0, t.jsxs)("div", {
                        className: Oa,
                        children: [
                          (0, t.jsxs)("div", {
                            className: Ea,
                            children: [
                              (0, t.jsx)("div", {
                                className: ka,
                                children:
                                  -1 !== s.legalRightsName.indexOf("_")
                                    ? s.legalRightsName.slice(
                                        s.legalRightsName.indexOf("_") + 1
                                      )
                                    : s.legalRightsName,
                              }),
                              (0, t.jsx)("div", {
                                className: Ba,
                                children: v.price ? "¥".concat(v.price) : "",
                              }),
                            ],
                          }),
                          (0, t.jsx)("div", { className: wa, children: R }),
                          (0, Ca._g)(g)
                            ? "应付款".concat(null == s ? void 0 : s.price)
                            : "1000" === v.statusCd
                            ? (0, t.jsxs)("div", {
                                className: Da,
                                children: [
                                  "已付款￥",
                                  "0" === v.justForMember
                                    ? v.price
                                    : v.vipPrice,
                                ],
                              })
                            : null,
                        ],
                      }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className: Ya,
                    children: [
                      T
                        ? (0, t.jsx)("div", { className: qa, children: T })
                        : null,
                      (0, t.jsxs)("div", {
                        className: Ga,
                        children: [
                          (0, Ca._g)(s.statusCd)
                            ? (0, t.jsx)("button", {
                                className: za,
                                type: "button",
                                onClick: b,
                                children: "取消订单",
                              })
                            : "QY1623033339536" === s.legalRightsNbr ||
                              (null == s ||
                              null === (x = s.legalRightsAttrs) ||
                              void 0 === x
                                ? void 0
                                : x.find(
                                    (e) =>
                                      "LOCAL_MEM_BONUS" ===
                                      (null == e ? void 0 : e.belongAreas)
                                  ))
                            ? null
                            : (0, t.jsx)("div", {
                                className: Va,
                                onClick: P,
                                children: "再次购买",
                              }),
                          (() => {
                            if ((0, Ca._g)(s.statusCd)) {
                              var e = (0, Ia.aL)(s.remainTime);
                              return (0, t.jsxs)("button", {
                                className: Xa,
                                type: "button",
                                onClick: M,
                                children: [
                                  (0, t.jsx)(ja.A, {
                                    className: $a,
                                    format: "mm:ss",
                                    time: e,
                                  }),
                                  (0, t.jsx)("span", {
                                    className: es,
                                    children: "确认支付",
                                  }),
                                ],
                              });
                            }
                            var a;
                            return ts.includes(_)
                              ? (0, t.jsx)("div", {
                                  className: Ha,
                                  onClick: () => {
                                    r(s);
                                  },
                                  children: (
                                    null == s ||
                                    null === (a = s.legalRightsAttrs) ||
                                    void 0 === a
                                      ? void 0
                                      : a.find(
                                          (e) =>
                                            "halfPriceArea-Plus" ===
                                            (null == e ? void 0 : e.belongAreas)
                                        )
                                  )
                                    ? "充值/使用"
                                    : "激活充值",
                                })
                              : ("" !== u && u && "1200" !== g && j(_), null);
                          })(),
                        ],
                      }),
                    ],
                  }),
                  ((m =
                    "1300" === s.statusCd
                      ? "权益发放失败，后续将人工补发，敬请关注"
                      : null),
                  m ? (0, t.jsx)("div", { className: Ja, children: m }) : null),
                ],
              }),
            ],
          });
        },
        ns = s(25657),
        rs = "ExcCateCard___fgEC_",
        is = "orderProgress___nNHgJ",
        os = "orderStateImg___Cqiks",
        ds = "orderStateBottom___Blr2b",
        cs = "orderStateLeft___ngS0U",
        _s = "orderStateRight___R4dA5",
        us = "orderCard___WsDKM",
        hs = "head___rOEAt",
        gs = "buy_time___g7R9o",
        vs = "bottom_view_left_text___plckL",
        ms = "body___Xz2xu",
        xs = "IconWrap___LAUD2",
        ps = "icon___CpC2c",
        Ns = "center_right___e__nE",
        fs = "center_right_top___ITEvQ",
        Is = "center_right_top_title___IwH4m",
        Cs = "center_right_top_money___oTorc",
        As = "center_right_center___J1lG9",
        Ts = "center_right_bottom___AH4Jq",
        js = "foot___H0PSe",
        Ps = "bottom_view_right___Aoxxi",
        bs = "bottom_view_right_button___mKf7g",
        Ms = "bottom_view_right_button2___gSW0O",
        Rs = "button4___jtla3",
        Ls = "button5___8NuPQ",
        Ss = "SecButton___GKdnS",
        ys = [
          "QY1656670801142",
          "QY1709621567103",
          "QY1657789125042",
          "QY1651155514697",
          "QY1651213843552",
          "QY1651214117903",
        ],
        Us = [
          "QY1622613823700",
          "QY1647332740449",
          "QY1667896527855",
          "QY1667898438042",
          "QY1667898532929",
          "QY1622763806690",
          "QY1623335497444",
          "QY1645498970176",
          "QY1648520729398",
        ],
        Os = [
          "QY1658298793746",
          "QY1645498970176",
          "QY1622613823700",
          "QY1622763806690",
          "QY1648520729398",
        ],
        Es = {
          "7 ": "混合支付",
          10: "能开话费支付",
          11: "第三方支付",
          12: "权益额度支付",
          13: "积分混合支付",
          14: "云货架渠道侧扣费单次点播",
          15: "北京通兑券",
          16: "省渠道领取",
          17: "兑换券支付",
          18: "话费连续包月（首月积分）",
          20: "三方支付连续包月 - 三网版",
          24: "爆米券支付",
        };
      function ks(e) {
        var a,
          s,
          {
            orderInfo: n,
            onExchangeButtonClick: r = () => {},
            onDetailButtonClick: i = () => {},
          } = e,
          {
            legalRightsName: o = "",
            date: d = "",
            legalRightsAttrs: c,
            entityAttrs: _,
            legalRightsNbr: u,
            linkUrl: g,
            certificateNum: m,
            statusCd: x,
          } = n,
          p = ((e) => {
            var a = null;
            return (
              e.counonInfo &&
                (a = {
                  couponId: e.counonInfo.counonId,
                  couponName: e.counonInfo.counonName,
                  couponType: e.counonInfo.counonType,
                  couponNum: e.counonInfo.counonNum,
                }),
              a
            );
          })(n),
          [N] = (0, ns.ok)(),
          f = N.get("mt"),
          I = (0, K.nc)((e) => e.userInfo),
          C = (null == I ? void 0 : I.starValue) || 0,
          A = null == I ? void 0 : I.isGlobalLocalPlusOrGlobalBrand,
          T = null == I ? void 0 : I.isLocalPlus,
          j = null == I ? void 0 : I.isLhPlus,
          P = d ? d.substring(0, 10) : "",
          b = (c || _).filter(
            (e) => "img_211_151" === e.attrNbr || e.img_211_151
          ),
          M = (0, De.py)(
            (null === (a = b[0]) || void 0 === a ? void 0 : a.img_211_151) ||
              (null === (s = b[0]) || void 0 === s ? void 0 : s.attrValue)
          ),
          R = (() => {
            var [e] = (0, fa.ok)();
            return "local" === e.get("category");
          })(),
          L = (0, l.useMemo)(() => (0, ee.xI)(n), [n]),
          S = (0, l.useMemo)(() => (0, ee.Cg)(n), [n]),
          y = (0, l.useMemo)(() => {
            var { statusCd: e } = n;
            switch (e) {
              case "1000":
                return "已完成";
              case "1200":
              case "1100":
                return (0, ee.h1)({
                  belongAreas: S,
                  targetAreas: [
                    "M2_VIP_LUCKY_BAG",
                    "M3_VIP_LUCKY_BAG",
                    "M4_VIP_LUCKY_BAG",
                    "M5_VIP_LUCKY_BAG",
                  ],
                })
                  ? "领取失败"
                  : "兑换失败";
              case "1400":
                return "开通中";
            }
            return "已完成";
          }, [n, S]),
          U = (0, l.useMemo)(() => {
            if (
              ("1200" === n.statusCd || "1100" === n.statusCd || "3" === f) &&
              "1200" === n.legalRightsSubordinate &&
              n.legalRightsAttrs.find(
                (e) => "1000" === (null == e ? void 0 : e.syncGroup)
              ) &&
              !S.includes("ACT_N_CHOOSE_2") &&
              !(0, ee.h1)({
                belongAreas: S,
                targetAreas: [
                  "M2_VIP_LUCKY_BAG",
                  "M3_VIP_LUCKY_BAG",
                  "M4_VIP_LUCKY_BAG",
                  "M5_VIP_LUCKY_BAG",
                ],
              })
            )
              return "number" == typeof m
                ? "已退回".concat(m, "张兑换券")
                : null;
            if (
              -1 !== o.indexOf("赠品") ||
              void 0 === m ||
              S.includes("ACT_N_CHOOSE_2")
            )
              return null;
            if (!p) return null;
            var e = "1400" === n.statusCd ? "需" : "已",
              a = "1001" === p.couponType ? "兑换券" : "专属兑换券";
            return ""
              .concat(e, "消耗")
              .concat(null == p ? void 0 : p.couponNum, "张")
              .concat(a);
          }, [
            S,
            m,
            f,
            n.legalRightsAttrs,
            n.legalRightsSubordinate,
            n.statusCd,
            o,
            p,
          ]),
          O = (0, l.useMemo)(
            () =>
              R || -1 !== o.indexOf("赠品")
                ? null
                : n.payType
                ? Es[n.payType]
                : (0, ee.h1)({
                    belongAreas: S,
                    targetAreas: [
                      "99PLUS_CORE",
                      "99PLUS2_CORE_YR",
                      "99PLUS2_CORE_MO",
                      "M2_VIP_LUCKY_BAG",
                      "M3_VIP_LUCKY_BAG",
                      "M4_VIP_LUCKY_BAG",
                      "M5_VIP_LUCKY_BAG",
                    ],
                  })
                ? "会员领取 单次点播"
                : (0, ee.h1)({
                    belongAreas: S,
                    targetAreas: [
                      "99PLUS_DISCOUNT",
                      "M2_VIP_DISCOUNT_PURCHASE",
                      "M3_VIP_DISCOUNT_PURCHASE",
                      "M4_VIP_DISCOUNT_PURCHASE",
                      "M5_VIP_DISCOUNT_PURCHASE",
                      "ZWRIGHTS",
                    ],
                  })
                ? "话费支付 单次点播"
                : "兑换券兑换 单次兑换",
            [S, R, o, n.payType]
          ),
          E = (e) => {
            if ((e.stopPropagation(), R))
              h.x.navToZGYD(
                "https://plus.bj.10086.cn/eisp-portal/?ver=pro#/smartMall/nativeDetail?type=A&skuId=".concat(
                  (0, ee.ik)(n)
                )
              );
            else if (
              (0, ee.h1)({
                belongAreas: S,
                targetAreas: [
                  "M2_VIP_LUCKY_BAG",
                  "M3_VIP_LUCKY_BAG",
                  "M4_VIP_LUCKY_BAG",
                  "M5_VIP_LUCKY_BAG",
                  "M2_VIP_DISCOUNT_PURCHASE",
                  "M3_VIP_DISCOUNT_PURCHASE",
                  "M4_VIP_DISCOUNT_PURCHASE",
                  "M5_VIP_DISCOUNT_PURCHASE",
                ],
              })
            )
              h.x.navToPath("/Mzone");
            else {
              if (!(0, ee.h1)({ belongAreas: S, targetAreas: ["ZWRIGHTS"] }))
                return (0, ee.h1)({
                  belongAreas: S,
                  targetAreas: [
                    "99PLUS_CORE",
                    "99PLUS_DISCOUNT",
                    "99PLUS2_CORE_YR",
                    "99PLUS2_CORE_MO",
                    "99PLUS2_DISCOUNT",
                  ],
                })
                  ? "99PLUS_NEW" === (null == n ? void 0 : n.orderSource)
                    ? void h.x.navToPath("/99plus2")
                    : void h.x.navToPath("/99plus")
                  : void ((0, ee.h1)({
                      belongAreas: S,
                      targetAreas: ["zw_1003"],
                    })
                      ? h.x.utils.navToZWPage(n)
                      : (0, ee.h1)({ belongAreas: S, targetAreas: ["GIFT"] })
                      ? h.x.navToPath("/plusThird", { mudel: "mod1" })
                      : (0, ee.h1)({
                          belongAreas: S,
                          targetAreas: ["Sport_Area"],
                        })
                      ? h.x.navToPath("/SportZone/goodDetail", {
                          offerId: n.offerId,
                          legalRightsId: n.id,
                          legalRightsNbr: n.legalRightsNbr,
                        })
                      : "QY1712920184378" === n.legalRightsNbr ||
                        (0, ee.H)(n, ["ACT_N_CHOOSE_2"])
                      ? h.x.navToPath("/activity/MultipleGoodDetail")
                      : (0, ee.H)(n, ["PLUS_19_WHITELIST", "PLUS_19_BLACKLIST"])
                      ? h.x.navToPath("/plusThird/goodDetail", {
                          offerId: n.offerId,
                          legalRightsId: n.id,
                          legalRightsNbr: n.legalRightsNbr,
                        })
                      : "QY1673488650553" === u ||
                        "QY1622613823700" === u ||
                        "QY1622763806690" === u ||
                        (Us.includes(u) && C < 4 && !A) ||
                        (Os.includes(u) && (C >= 4 || A))
                      ? h.x.navToPath("/plusThird", { mudel: "mod1" })
                      : -1 !== o.indexOf("五折购")
                      ? h.x.utils.navToHomePage()
                      : (T &&
                          !A &&
                          n.legalRightsAttrs.find(
                            (e) => "qqt" === (null == e ? void 0 : e.brand)
                          )) ||
                        (j &&
                          Number(C) < 4 &&
                          n.legalRightsAttrs.find(
                            (e) => "qqt" === (null == e ? void 0 : e.brand)
                          )) ||
                        (((T && A) || (j && Number(C) >= 4)) &&
                          n.legalRightsAttrs.find(
                            (e) => "szx" === (null == e ? void 0 : e.brand)
                          ))
                      ? h.x.navToPath("/plusThird", { mudel: "mod1" })
                      : -1 === o.indexOf("赠品") && i(n));
              h.x.navToZW(
                "https://plus.bj.10086.cn/eisp-portal/?ver=pro#/couponIssuance?channelId=1"
              );
            }
          },
          k = () => {
            var e, a, s, l;
            if (
              "1200" !== n.statusCd &&
              "1000" !== L &&
              (ys.includes(u) ||
                "1100" === L ||
                "1200" === L ||
                "1300" === L ||
                "1400" === L ||
                "1500" === L ||
                ("1200" === (null == n ? void 0 : n.legalRightsSubordinate) &&
                  (null == n ||
                  null === (e = n.legalRightsAttrs) ||
                  void 0 === e
                    ? void 0
                    : e.find(
                        (e) => "1000" === (null == e ? void 0 : e.syncGroup)
                      )) &&
                  null !==
                    (null == n ||
                    null === (a = n.custOrderAttrs) ||
                    void 0 === a
                      ? void 0
                      : a.resourceCode) &&
                  "" !==
                    (null == n ||
                    null === (s = n.custOrderAttrs) ||
                    void 0 === s
                      ? void 0
                      : s.resourceCode) &&
                  (null == n || null === (l = n.custOrderAttrs) || void 0 === l
                    ? void 0
                    : l.resourceCode) &&
                  "QY1683717381999" !== u &&
                  "QY1632823068390" !== u))
            ) {
              var i = "";
              return (
                (i =
                  "1500" === L
                    ? "存入卡包"
                    : S.includes("UnitedStatesTuanZone")
                    ? "充值/使用"
                    : "1200" === L
                    ? "激活充值"
                    : "1100" === L
                    ? "一键兑换"
                    : "1300" === L
                    ? "查看链接"
                    : "1400" === L
                    ? "立即查看"
                    : "激活充值"),
                (0, t.jsx)("div", {
                  className: Ms,
                  onClick: () => r(n),
                  children: i,
                })
              );
            }
            if ("" !== g && g && "1200" !== x) {
              var o = "";
              return (
                (o = S.includes("FillShippingAddress")
                  ? "填写地址"
                  : "QY1650613475930" === u || "QY1708589422101" === u
                  ? "查看使用"
                  : "获取卡密"),
                (0, t.jsx)("div", {
                  className: Ms,
                  onClick: () => h.x.navToOuter(g),
                  children: o,
                })
              );
            }
            return null;
          };
        return (0, ee.h1)({ belongAreas: S, targetAreas: ["ZWRIGHTS"] }) &&
          "1000" !== n.statusCd
          ? null
          : (0, t.jsxs)("div", {
              className: rs,
              children: [
                (() => {
                  if (R) return null;
                  if (
                    (0, ee.h1)({
                      belongAreas: S,
                      targetAreas: [
                        "M2_VIP_LUCKY_BAG",
                        "M3_VIP_LUCKY_BAG",
                        "M4_VIP_LUCKY_BAG",
                        "M5_VIP_LUCKY_BAG",
                      ],
                    })
                  )
                    return null;
                  if (
                    "1200" === n.legalRightsSubordinate &&
                    n.legalRightsAttrs.find(
                      (e) => "1000" === (null == e ? void 0 : e.syncGroup)
                    )
                  ) {
                    if ("1000" === n.statusCd)
                      return (0, t.jsxs)("div", {
                        className: is,
                        children: [
                          (0, t.jsx)("img", {
                            src: "".concat(
                              gImgUrlPrefixLegacy,
                              "/rights/202305/f06ed59b-49a2-4c1c-8627-53d57fead398-8421.png"
                            ),
                            alt: "",
                            className: os,
                          }),
                          (0, t.jsxs)("div", {
                            className: ds,
                            children: [
                              (0, t.jsx)("div", {
                                className: cs,
                                children: "您的订单已提交成功",
                              }),
                              (0, t.jsx)("div", {
                                className: _s,
                                children: "权益发放成功",
                              }),
                            ],
                          }),
                        ],
                      });
                    if ("1200" === n.statusCd)
                      return (0, t.jsxs)("div", {
                        className: is,
                        children: [
                          (0, t.jsx)("img", {
                            src: "".concat(
                              gImgUrlPrefixLegacy,
                              "/rights/202305/38aa325f-5982-4de1-9c63-9f2721730a7d-7002.png"
                            ),
                            alt: "",
                            className: os,
                          }),
                          (0, t.jsxs)("div", {
                            className: ds,
                            children: [
                              (0, t.jsx)("div", {
                                className: cs,
                                children: "您的订单已提交成功",
                              }),
                              (0, t.jsxs)("div", {
                                className: _s,
                                children: [
                                  "权益发放失败",
                                  -1 !== o.indexOf("赠品")
                                    ? ""
                                    : "，兑换券已退回",
                                ],
                              }),
                            ],
                          }),
                        ],
                      });
                    if ("1100" === n.statusCd)
                      return (0, t.jsxs)("div", {
                        className: is,
                        children: [
                          (0, t.jsx)("img", {
                            src: "".concat(
                              gImgUrlPrefixLegacy,
                              "/rights/202305/38aa325f-5982-4de1-9c63-9f2721730a7d-7002.png"
                            ),
                            alt: "",
                            className: os,
                          }),
                          (0, t.jsxs)("div", {
                            className: ds,
                            children: [
                              (0, t.jsx)("div", {
                                className: cs,
                                children: "您的订单已提交成功",
                              }),
                              (0, t.jsxs)("div", {
                                className: _s,
                                children: [
                                  "订单超时，交易已关闭",
                                  -1 !== o.indexOf("赠品")
                                    ? ""
                                    : " 兑换券已退回",
                                ],
                              }),
                            ],
                          }),
                        ],
                      });
                    if ("1400" === n.statusCd)
                      return (0, t.jsxs)("div", {
                        className: is,
                        children: [
                          (0, t.jsx)("img", {
                            src: "".concat(
                              gImgUrlPrefixLegacy,
                              "/rights/202305/61ae5b5f-aa0a-424f-a85e-d5da047ff7be-54023.png"
                            ),
                            alt: "",
                            className: os,
                          }),
                          (0, t.jsxs)("div", {
                            className: ds,
                            children: [
                              (0, t.jsx)("div", {
                                className: cs,
                                children: "您的订单已提交成功",
                              }),
                              (0, t.jsx)("div", {
                                className: _s,
                                style: { color: "#FE642B" },
                                children: "权益发放处理中",
                              }),
                            ],
                          }),
                        ],
                      });
                  }
                  return null;
                })(),
                (0, t.jsxs)("div", {
                  className: us,
                  children: [
                    (0, t.jsxs)("div", {
                      className: hs,
                      children: [
                        (0, t.jsxs)("div", {
                          className: gs,
                          children: ["兑换日期：", P],
                        }),
                        (0, t.jsx)("div", { className: vs, children: y }),
                      ],
                    }),
                    (0, t.jsxs)("div", {
                      className: ms,
                      children: [
                        (0, t.jsxs)("div", {
                          className: xs,
                          children: [
                            (0, t.jsx)(ss.Y, {
                              statusCd: n.statusCd,
                              size: "lg",
                            }),
                            (0, t.jsx)("img", {
                              src: M,
                              className: ps,
                              alt: "",
                            }),
                          ],
                        }),
                        (0, t.jsxs)("div", {
                          className: Ns,
                          children: [
                            (0, t.jsxs)("div", {
                              className: fs,
                              children: [
                                (0, t.jsx)("div", {
                                  className: Is,
                                  children: o,
                                }),
                                (0, t.jsx)("div", {
                                  className: Cs,
                                  children: (() => {
                                    if (R) {
                                      var e = (0, ee._t)(n);
                                      return e ? "¥".concat(e) : null;
                                    }
                                    return -1 !== o.indexOf("赠品") ||
                                      void 0 === m ||
                                      S.includes("ACT_N_CHOOSE_2")
                                      ? null
                                      : "".concat(m, "张兑换券");
                                  })(),
                                }),
                              ],
                            }),
                            (0, t.jsx)("div", { className: As, children: O }),
                            U
                              ? (0, t.jsx)("div", {
                                  className: Ts,
                                  children: U,
                                })
                              : null,
                          ],
                        }),
                      ],
                    }),
                    (0, ee.H)(n, ["GIFT"])
                      ? null
                      : (0, t.jsx)("div", {
                          className: js,
                          children: (0, t.jsxs)("div", {
                            className: Ps,
                            children: [
                              "QY1650613475930" === u ||
                              "QY1708589422101" === u ||
                              "QY1689749726840" === u
                                ? (0, t.jsx)("div", {
                                    className: Ms,
                                    onClick: () => {
                                      h.x.navToOuter(
                                        "https://mpf.tuopukeji.cn/food-zone/"
                                      );
                                    },
                                    children: "美食专区",
                                  })
                                : "QY1703494955718" === u ||
                                  "QY1728888497481" === u
                                ? (0, t.jsx)("div", {
                                    className: Ms,
                                    onClick: () => {
                                      h.x.navToOuter(
                                        "https://www.maxweb.cn/bmh/#/"
                                      );
                                    },
                                    children: "百米花专区",
                                  })
                                : null,
                              -1 !== o.indexOf("赠品")
                                ? null
                                : R
                                ? (0, t.jsx)("div", {
                                    className: bs,
                                    onClick: E,
                                    children: "再次购买",
                                  })
                                : (0, ee.h1)({
                                    belongAreas: S,
                                    targetAreas: [
                                      "99PLUS_CORE",
                                      "99PLUS2_CORE_YR",
                                      "99PLUS2_CORE_MO",
                                    ],
                                  }) ||
                                  (0, ee.h1)({
                                    belongAreas: S,
                                    targetAreas: [
                                      "M2_VIP_LUCKY_BAG",
                                      "M3_VIP_LUCKY_BAG",
                                      "M4_VIP_LUCKY_BAG",
                                      "M5_VIP_LUCKY_BAG",
                                    ],
                                  })
                                ? (0, t.jsx)("div", {
                                    className: bs,
                                    onClick: E,
                                    children: "再次领取",
                                  })
                                : (0, ee.h1)({
                                    belongAreas: S,
                                    targetAreas: [
                                      "M2_VIP_DISCOUNT_PURCHASE",
                                      "M3_VIP_DISCOUNT_PURCHASE",
                                      "M4_VIP_DISCOUNT_PURCHASE",
                                      "M5_VIP_DISCOUNT_PURCHASE",
                                    ],
                                  })
                                ? (0, t.jsx)("div", {
                                    className: bs,
                                    onClick: E,
                                    children: "再次购买",
                                  })
                                : (0, ee.h1)({
                                    belongAreas: S,
                                    targetAreas: ["ZWRIGHTS"],
                                  }) && "1000" !== n.statusCd
                                ? null
                                : (0, ee.h1)({
                                    belongAreas: S,
                                    targetAreas: ["ZWRIGHTS"],
                                  }) && "1000" === n.statusCd
                                ? (0, t.jsx)("div", {
                                    className: bs,
                                    onClick: E,
                                    children: "查看券码",
                                  })
                                : (0, ee.h1)({
                                    belongAreas: S,
                                    targetAreas: [
                                      "99PLUS_DISCOUNT",
                                      "99PLUS2_DISCOUNT",
                                    ],
                                  })
                                ? (0, t.jsx)("div", {
                                    className: bs,
                                    onClick: E,
                                    children: "再次购买",
                                  })
                                : (0, t.jsx)("div", {
                                    className: bs,
                                    onClick: E,
                                    children: "再次兑换",
                                  }),
                              k(),
                              "QY1717747609164" === u
                                ? (0, t.jsx)("div", {
                                    className: Rs,
                                    onClick: () => {
                                      h.x.navToZGYD(
                                        "https://dev.coc.10086.cn/coc2/web/pullapp/index.html?targetURL=https://h.app.coc.10086.cn/cmcc-app/eleme/eleme.html"
                                      );
                                    },
                                    children: "前往饿了么点单",
                                  })
                                : null,
                              S.includes("appleButton")
                                ? (0, t.jsx)("div", {
                                    className: Ls,
                                    onClick: () => {
                                      h.x.navToZGYD(
                                        "https://plus.migu.cn/c/0fl4yn?sourceid=012041&tp=ANDT"
                                      );
                                    },
                                    children: "绑定激活",
                                  })
                                : null,
                              S.includes("99PLUS_EXCL_RB_30004")
                                ? (0, t.jsx)("button", {
                                    className: Ss,
                                    type: "button",
                                    onClick: () => {
                                      h.x.navToZGYD(v.zf);
                                    },
                                    children: "前往自提专区",
                                  })
                                : null,
                            ],
                          }),
                        }),
                  ],
                }),
              ],
            });
      }
      var Bs = "RecCateCard___VaEdT",
        ws = "Header___ENU1s",
        Ds = "left___czZPl",
        Ys = "right___olFHd",
        Gs = "Body___SOv28",
        Vs = "IconWrap___nGGIW",
        Hs = "renderLingQuBoxImg___Yj5TK",
        Qs = "renderLingQucontent___Ldt61",
        Fs = "renderLingQuConTit___yYz6R",
        Ks = "renderLingQuConDesc___M647W",
        Zs = "Footer___ZWaAM",
        Ws = "MainButton___D3kov",
        Js = "SecButton___pj3C3",
        qs = "Vipprice___B1vWo",
        zs = "Tips___Sgr_l",
        Xs = (e) => {
          var a,
            s,
            { orderInfo: n, onViewAndUseButtonClick: r } = e,
            i = (0, l.useMemo)(() => (0, ee.Cg)(n), [n]),
            o = (0, ee.Sl)(n),
            d = n.createDate ? n.createDate : n.date,
            c = (0, l.useMemo)(
              () =>
                i.includes("JINGXIFUDI_FREE") ||
                i.includes("JINGXIFUDI_HALF_PRICE") ||
                i.includes("JINGXIFUDI_CONSUMER"),
              [i]
            ),
            _ = (0, l.useMemo)(() => {
              var e;
              return null == n ||
                null === (e = n.legalRightsAttrs) ||
                void 0 === e
                ? void 0
                : e.find(
                    (e) =>
                      "LIMIT_M1_CAR_FW_1" ===
                        (null == e ? void 0 : e.belongAreas) ||
                      "LIMIT_M1_CAR_FW_2" ===
                        (null == e ? void 0 : e.belongAreas) ||
                      "LIMIT_M1_CAR_RE" === (null == e ? void 0 : e.belongAreas)
                  );
            }, [null == n ? void 0 : n.legalRightsAttrs]),
            u =
              "NOTEXIST_LEGALRIGHTS" === n.legalRightsNbr ||
              i.includes("99PLUS_EXCL_RB_30004")
                ? null
                : "已付款￥0",
            g = (0, l.useMemo)(() => {
              if (null == n ? void 0 : n.prizeName) return n.prizeName;
              if (null == n ? void 0 : n.legalRightsName) {
                var e = n.legalRightsName.indexOf("_");
                return -1 !== e
                  ? n.legalRightsName.slice(e + 1)
                  : n.legalRightsName;
              }
              return "";
            }, [
              null == n ? void 0 : n.legalRightsName,
              null == n ? void 0 : n.prizeName,
            ]),
            m = (0, l.useMemo)(() => {
              var e;
              return c
                ? "查看使用"
                : (
                    null == n ||
                    null === (e = n.legalRightsAttrs) ||
                    void 0 === e
                      ? void 0
                      : e.find(
                          (e) =>
                            "LIMIT_M1_JL_COLLECT" ===
                            (null == e ? void 0 : e.belongAreas)
                        )
                  )
                ? "优惠买单"
                : _
                ? "查看使用"
                : "NOTEXIST_LEGALRIGHTS" ===
                  (null == n ? void 0 : n.legalRightsNbr)
                ? "再次购买"
                : "再次领取";
            }, [
              _,
              c,
              null == n ? void 0 : n.legalRightsAttrs,
              null == n ? void 0 : n.legalRightsNbr,
            ]),
            x =
              "1100" === n.statusCd ||
              "1200" === n.statusCd ||
              "1300" === n.statusCd
                ? "领取失败"
                : "1400" === n.statusCd
                ? "开通中"
                : "已完成",
            p =
              "1300" === n.statusCd
                ? "权益发放失败，后续将人工补发，敬请关注"
                : null,
            N = "前往自提专区",
            f = () => {
              var e;
              if (c)
                h.x.navToPath("/jingxifudi/result", {
                  no: n.custOrderId,
                  nbr: n.legalRightsNbr,
                });
              else {
                if (
                  !(0, ee.h1)({
                    belongAreas: i,
                    targetAreas: [
                      "M2_VIP_LUCKY_BAG",
                      "M3_VIP_LUCKY_BAG",
                      "M4_VIP_LUCKY_BAG",
                      "M5_VIP_LUCKY_BAG",
                      "M2_VIP_DISCOUNT_PURCHASE",
                      "M3_VIP_DISCOUNT_PURCHASE",
                      "M4_VIP_DISCOUNT_PURCHASE",
                      "M5_VIP_DISCOUNT_PURCHASE",
                    ],
                  })
                )
                  return (0, ee.h1)({
                    belongAreas: i,
                    targetAreas: [
                      "99PLUS_CORE",
                      "99PLUS_DISCOUNT",
                      "99PLUS2_CORE_YR",
                      "99PLUS2_CORE_MO",
                      "99PLUS2_DISCOUNT",
                    ],
                  })
                    ? "99PLUS_NEW" === (null == n ? void 0 : n.orderSource)
                      ? void h.x.navToPath("/99plus2")
                      : void h.x.navToPath("/99plus")
                    : void ((0, ee.h1)({
                        belongAreas: i,
                        targetAreas: ["LIMIT_M2_1"],
                      })
                        ? h.x.utils.navToRightsDetailPage(n)
                        : (0, ee.h1)({
                            belongAreas: i,
                            targetAreas: ["LIMIT_M1_BJ_FD_ENJOY"],
                          })
                        ? h.x.navToZW(
                            "https://plus.bj.10086.cn/eisp-portal/?ver=pro#/bjcxfd/goodsDetail\n          ?aiden=2410389136038073594&thirdGoodsId=".concat(
                              (0, ee.ik)(n)
                            )
                          )
                        : (0, ee.h1)({
                            belongAreas: i,
                            targetAreas: ["LIMIT_M1_BJ_LL_ENJOY"],
                          })
                        ? h.x.navToZW(
                            "https://plus.bj.10086.cn/eisp-portal/?ver=pro#/bjcxtxqy/goodsDetail\n          ?aiden=2410389196167615726&thirdGoodsId=".concat(
                              (0, ee.ik)(n)
                            )
                          )
                        : _
                        ? r(n)
                        : (
                            null == n ||
                            null === (e = n.legalRightsAttrs) ||
                            void 0 === e
                              ? void 0
                              : e.find(
                                  (e) =>
                                    "LIMIT_M1_JL_COLLECT" ===
                                    (null == e ? void 0 : e.belongAreas)
                                )
                          )
                        ? h.x.navToZGYD(
                            "https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/sczkbj?channelCode=P00000010862"
                          )
                        : (0, ee.h1)({
                            belongAreas: i,
                            targetAreas: [
                              "LIMIT_M1_V_FOOD_RB",
                              "LIMIT_M1_V_FOOD_FLOW",
                              "LIMIT_M1_V_MOVIE_RB",
                              "LIMIT_M1_V_MOVIE_FLOW",
                              "LIMIT_M1_V_SUPERMARKET_RB",
                              "LIMIT_M1_V_SUPERMARKET_FLOW",
                            ],
                          })
                        ? h.x.utils.navToHomePage()
                        : "NOTEXIST_LEGALRIGHTS" !== n.legalRightsNbr
                        ? (0, ee.h1)({
                            belongAreas: i,
                            targetAreas: ["COMMON_HALF_PRICE"],
                          })
                          ? (0, Ca.E$)(n.date)
                            ? h.x.navToPath("/phoneZone/goodsDetail", {
                                legalRightsNbr:
                                  null == n ? void 0 : n.legalRightsNbr,
                                legalRightsId:
                                  null == n ? void 0 : n.legalRightsId,
                                offerId: null == n ? void 0 : n.offerId,
                              })
                            : h.x.utils.navToHomePage()
                          : (0, ee.h1)({
                              belongAreas: i,
                              targetAreas: [
                                "halfPriceArea-Gold",
                                "halfPriceArea-Plus",
                                "LIMIT_M1_BJ_WZG",
                              ],
                            })
                          ? h.x.utils.navToHomePage()
                          : "黄金5元话费折扣券（北京移动 PLUS 黄金会员专属）" !==
                            (null == n ? void 0 : n.legalRightsName)
                          ? (0, ee.h1)({
                              belongAreas: i,
                              targetAreas: ["LIMIT_M2_BJ_LL"],
                            })
                            ? h.x.utils.navToHomePage()
                            : (0, ee.h1)({
                                belongAreas: i,
                                targetAreas: ["LIMIT_M1_BJ_FD"],
                              })
                            ? h.x.navToPath("/phoneZone/goodsDetail", {
                                fromPageType: "PlatinumRight",
                                legalRightsNbr:
                                  null == n ? void 0 : n.legalRightsNbr,
                                legalRightsId:
                                  null == n ? void 0 : n.legalRightsId,
                                offerId: null == n ? void 0 : n.offerId,
                              })
                            : (0, ee.h1)({
                                belongAreas: i,
                                targetAreas: ["LIMIT_M1_2"],
                              })
                            ? h.x.navToPath("/plusThird", { pageType: "Gold" })
                            : (0, ee.h1)({
                                belongAreas: i,
                                targetAreas: ["LIMIT_M1_1", "LIMIT_M2_1"],
                              })
                            ? h.x.navToPath("/phoneZone/goodsDetail", {
                                fromPageType: "GoldRight",
                                legalRightsNbr:
                                  null == n ? void 0 : n.legalRightsNbr,
                                legalRightsId:
                                  null == n ? void 0 : n.legalRightsId,
                                offerId: null == n ? void 0 : n.offerId,
                              })
                            : "NOTEXIST_LEGALRIGHTS" !==
                              (null == n ? void 0 : n.legalRightsNbr)
                            ? h.x.navToPath("/plusThird", { pageType: "Plus" })
                            : h.x.utils.navToHomePage()
                          : h.x.navToPath("/fivePhoneBill")
                        : h.x.utils.navToHomePage());
                h.x.navToPath("/Mzone");
              }
            },
            I = () => {
              h.x.navToZGYD(v.zf);
            };
          return (0, t.jsxs)("div", {
            className: Bs,
            children: [
              (0, t.jsxs)("div", {
                className: ws,
                children: [
                  (0, t.jsxs)("div", {
                    className: Ds,
                    children: ["订购日期：", d],
                  }),
                  (0, t.jsx)("div", { className: Ys, children: x }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: Gs,
                children: [
                  (0, t.jsxs)("div", {
                    className: Vs,
                    children: [
                      (0, t.jsx)(ss.Y, { statusCd: n.statusCd, size: "lg" }),
                      (0, t.jsx)("img", { alt: "", src: o, className: Hs }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className: Qs,
                    children: [
                      (0, t.jsx)("div", { className: Fs, children: g }),
                      (0, t.jsx)("p", {
                        className: Ks,
                        children:
                          "NOTEXIST_LEGALRIGHTS" === n.legalRightsNbr
                            ? "话费支付 单次点播"
                            : "会员领取 单次点播",
                      }),
                    ],
                  }),
                  (0, t.jsx)("div", { className: qs, children: u }),
                ],
              }),
              ((a = (0, t.jsx)("button", {
                className: Ws,
                type: "button",
                onClick: f,
                children: m,
              })),
              (s = (0, t.jsx)("button", {
                className: Js,
                type: "button",
                onClick: I,
                children: N,
              })),
              i.includes("Rights_FKS")
                ? (0, t.jsx)("div", { className: Zs })
                : i.includes("99PLUS_EXCL_RB_30004")
                ? (0, t.jsxs)("div", { className: Zs, children: [a, s] })
                : (0, t.jsx)("div", { className: Zs, children: a })),
              p ? (0, t.jsx)("div", { className: zs, children: p }) : null,
            ],
          });
        },
        $s = "RenewalOrderCard___sd7qu",
        et = "center___oqukQ",
        at = "topRow___Y9geX",
        st = "buyTime___JYnxK",
        tt = "statusText___y1utZ",
        lt = "centerRow___lLohc",
        nt = "icon___amX6B",
        rt = "infoBlock___drbWG",
        it = "title___XtbpL",
        ot = "desc___blThw",
        dt = "bottomRow___wrJH7",
        ct = "cancelButton___PZC88",
        _t = "disabled___ii0ZG",
        ut = s(71519),
        ht = "".concat(
          gImgUrlPrefixLegacy,
          "/rights/202604/69b5d1eb-cdb1-4fab-9799-5a65b3975b50-ahgehaog.png"
        );
      function gt(e) {
        var a,
          { orderInfo: s } = e,
          { queryOrders: l } = as(),
          n =
            "1000" === (null == s ? void 0 : s.statusCd)
              ? { disabled: !1, text: "取消" }
              : "1001" === (null == s ? void 0 : s.statusCd)
              ? { disabled: !0, text: "已取消" }
              : { disabled: !0, text: "取消" };
        return (0, t.jsx)("div", {
          className: $s,
          children: (0, t.jsxs)("div", {
            className: et,
            children: [
              (0, t.jsxs)("div", {
                className: at,
                children: [
                  (0, t.jsxs)("div", {
                    className: st,
                    children: [
                      "订购日期：",
                      (null == s ? void 0 : s.createDate) || "",
                    ],
                  }),
                  (0, t.jsx)("div", { className: tt, children: "已完成" }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: lt,
                children: [
                  (0, t.jsx)("img", { src: ht, className: nt, alt: "" }),
                  (0, t.jsxs)("div", {
                    className: rt,
                    children: [
                      (0, t.jsx)("div", {
                        className: it,
                        children:
                          ((a = null == s ? void 0 : s.offerId),
                          a
                            ? "111004275439" === a
                              ? "99Plus-尊享版"
                              : "111004275440" === a
                              ? "99Plus-优享版"
                              : "111004275441" === a
                              ? "99Plus-畅享版"
                              : "111004275823" === a
                              ? "99Plus（新）-尊享版"
                              : "111004275824" === a
                              ? "99Plus（新）-优享版"
                              : "111004275825" === a
                              ? "99Plus（新）-畅享版"
                              : ""
                            : ""),
                      }),
                      (0, t.jsx)("div", {
                        className: ot,
                        children: "话费支付，单次点播",
                      }),
                    ],
                  }),
                ],
              }),
              (0, t.jsx)("div", {
                className: dt,
                children: (0, t.jsx)("button", {
                  className: (0, g.$)(ct, n.disabled && _t),
                  type: "button",
                  onClick: () =>
                    (0, N._)(function* () {
                      if (
                        "1000" === (null == s ? void 0 : s.statusCd) &&
                        (null == s ? void 0 : s.appointRenewId)
                      ) {
                        var e = yield (0, ut.Pe)({
                          appointRenewId: s.appointRenewId,
                          cancelReason: "USER_CANCEL",
                          cancelChannel: "H5",
                        });
                        if ("0" === (null == e ? void 0 : e.resultCode))
                          return W.Z.success("取消成功"), void l();
                        W.Z.info("系统繁忙，请稍后再试");
                      }
                    })(),
                  children: n.text,
                }),
              }),
            ],
          }),
        });
      }
      var vt = [
          "LIMIT_M2_1",
          "LIMIT_M1_1",
          "LIMIT_M1_2",
          "1016",
          "LIMIT_M1_BJ_FD",
          "LIMIT_M2_BJ_LL",
          "LIMIT_M1_BJ_FD_ENJOY",
          "LIMIT_M1_BJ_LL_ENJOY",
          "2023",
          "2024",
          "2025",
          "2053",
          "2054",
          "2061",
          "2062",
          "2063",
          "2032",
          "LIMIT_M1_V_FOOD_RB",
          "LIMIT_M1_V_FOOD_FLOW",
          "LIMIT_M1_V_MOVIE_RB",
          "LIMIT_M1_V_MOVIE_FLOW",
          "LIMIT_M1_V_SUPERMARKET_RB",
          "LIMIT_M1_V_SUPERMARKET_FLOW",
          "LIMIT_M1_CAR_FW_1",
          "LIMIT_M1_CAR_FW_2",
          "LIMIT_M1_CAR_RE",
          "LIMIT_M1_JL_COLLECT",
          "Rights_FKS",
          "JINGXIFUDI_FREE",
          "JINGXIFUDI_HALF_PRICE",
          "JINGXIFUDI_CONSUMER",
        ],
        mt = [
          "1000",
          "1011",
          "halfPriceArea-Plus",
          "halfPriceArea-Gold",
          "COMMON_HALF_PRICE",
          "LIMIT_M1_BJ_WZG",
          "LIMIT_M1_V_FOOD_FF",
          "LIMIT_M1_V_MOVIE_FF",
          "LIMIT_M1_V_SUPERMARKET_FF",
          "LOCAL_MEM_BONUS",
          "ACT_RIGHTS_PICK",
          "ACT_RIGHTS_PICK2",
        ],
        xt = [
          "2023",
          "2024",
          "2025",
          "2053",
          "2054",
          "2061",
          "2062",
          "2063",
          "2032",
        ],
        pt = [
          "99PLUS_CORE",
          "99PLUS_DISCOUNT",
          "99PLUS2_CORE_YR",
          "99PLUS2_CORE_MO",
          "99PLUS2_DISCOUNT",
          "zw_1003",
        ];
      function Nt(e) {
        var a,
          {
            orderInfo: s = {},
            onExchangeButtonClick: l = () => {},
            onDetailButtonClick: n = () => {},
            onViewAndUseButtonClick: r = () => {},
          } = e,
          i = (0, ee.Cg)(s),
          o =
            (0, ee.h1)({ belongAreas: i, targetAreas: vt }) ||
            xt.includes(s.legalRightsType),
          d = (0, ee.h1)({ belongAreas: i, targetAreas: mt }),
          c =
            (0, ee.h1)({ belongAreas: i, targetAreas: pt }) ||
            (null == s || null === (a = s.legalRightsAttrs) || void 0 === a
              ? void 0
              : a.length);
        return (null == s ? void 0 : s.appointRenewId)
          ? (0, t.jsx)(gt, { orderInfo: s })
          : o
          ? (0, t.jsx)(Xs, { orderInfo: s, onViewAndUseButtonClick: r })
          : d
          ? (0, t.jsx)(ls, {
              orderInfo: s,
              onDetailButtonClick: n,
              onExchangeButtonClick: l,
            })
          : c
          ? (0, t.jsx)(ks, (0, f._)({}, e))
          : (0, t.jsx)(Xs, { orderInfo: s, onViewAndUseButtonClick: r });
      }
      var ft = s(28237),
        It = s(66523);
      function Ct() {
        var [e] = (0, fa.ok)(),
          a = e.get("date"),
          s = e.get("status"),
          n = e.get("category"),
          r = (0, p.useStoreActions)(),
          i = (0, p.useStore)((e) => e.orderList),
          o = (0, p.useStore)((e) => e.orderListLoading),
          [d, c] = (0, l.useState)(0);
        (0, l.useEffect)(() => {
          c((e) => e + 1);
        }, [i]);
        var _ = (e) => {
            var a = (0, ee.Cg)(e);
            "QY1709622539556" !== e.legalRightsNbr
              ? (0, ee.h1)({
                  belongAreas: a,
                  targetAreas: ["COMMON_HALF_PRICE"],
                })
                ? (0, Ca.E$)(e.date)
                  ? h.x.navToPath("/phoneZone/goodsDetail", {
                      offerId: e.offerId,
                      legalRightsId: e.id,
                      legalRightsNbr: e.legalRightsNbr,
                    })
                  : h.x.utils.navToHomePage()
                : (0, ee.h1)({
                    belongAreas: a,
                    targetAreas: [
                      "M2_VIP_LUCKY_BAG",
                      "M3_VIP_LUCKY_BAG",
                      "M4_VIP_LUCKY_BAG",
                      "M5_VIP_LUCKY_BAG",
                      "M2_VIP_DISCOUNT_PURCHASE",
                      "M3_VIP_DISCOUNT_PURCHASE",
                      "M4_VIP_DISCOUNT_PURCHASE",
                      "M5_VIP_DISCOUNT_PURCHASE",
                    ],
                  })
                ? h.x.navToPath("/Mzone")
                : (0, ee.h1)({
                    belongAreas: a,
                    targetAreas: [
                      "halfPriceArea-Gold",
                      "halfPriceArea-Plus",
                      "LIMIT_M1_BJ_WZG",
                    ],
                  })
                ? h.x.utils.navToHomePage()
                : (0, ee.h1)({
                    belongAreas: a,
                    targetAreas: [
                      "1000",
                      "1011",
                      "LIMIT_M1_1",
                      "LIMIT_M2_1",
                      "BTH_DISCOUNTS",
                    ],
                  })
                ? h.x.navToPath("/phoneZone/goodsDetail", {
                    offerId: e.offerId,
                    legalRightsId: e.id,
                    typeCode: e.codeType,
                    legalRightsNbr: e.legalRightsNbr,
                    brandId: e.brandId,
                  })
                : (0, ee.h1)({
                    belongAreas: a,
                    targetAreas: ["ACT_N_CHOOSE_2"],
                  }) || "QY1712920184378" === e.legalRightsNbr
                ? h.x.navToPath("/activity/MultipleGoodDetail")
                : h.x.navToPath("/plusThird/goodDetail", {
                    offerId: e.offerId,
                    legalRightsId: e.id,
                    typeCode: e.codeType,
                    legalRightsNbr: e.legalRightsNbr,
                  })
              : h.x.navToPath("/plusThird/goodDetail", {
                  legalRightsNbr: "QY1622624839221",
                  legalRightsId: "1400016164398051329",
                  offerId: "111602015794",
                });
          },
          u = (e) =>
            (0, N._)(function* () {
              if ("1000" === e.statusCd) {
                r.batchUpdate({ currentOrderInfo: e });
                var a,
                  s = (0, ee.xI)(e);
                if ("1500" !== s) {
                  if (s && ["1100", "1200", "1300", "1400"].includes(s)) {
                    var t,
                      l = yield (0, H.tv)({
                        extOrderId: e.custOrderId,
                        sku: e.legalRightsNbr,
                        extCustOrderId: e.extCustOrderId,
                      });
                    if (Array.isArray(l.data) && l.data.length)
                      return (
                        r.batchUpdate({ codeList: l.data }),
                        void ("1200" === s ||
                        Ta.multipleCodeRightsNbr.includes(e.legalRightsNbr)
                          ? r.batchUpdate({ multiCodeModal: { open: !0 } })
                          : "1100" === s ||
                            "1300" === s ||
                            "QY1657789125042" === e.legalRightsNbr
                          ? r.batchUpdate({ singleCodeModal: { open: !0 } })
                          : s &&
                            (0, $.w3)(s) &&
                            r.batchUpdate({
                              qrCodeModal: {
                                open: !0,
                                data: e,
                                code: l.data[0].cardPwd,
                                endTime: l.data[0].endDate,
                                startTime: l.data[0].startDate,
                                state: l.data[0].state,
                              },
                            }))
                      );
                    var n = (0, Aa.L)(
                      null == e ||
                        null === (t = e.custOrderAttrs) ||
                        void 0 === t
                        ? void 0
                        : t.resourceCode
                    );
                    if (!n.length) return;
                    var i = n.map((a) => {
                      var s, t;
                      return {
                        cardPwd: a,
                        endDate:
                          ((t =
                            null == e ||
                            null === (s = e.custOrderAttrs) ||
                            void 0 === s
                              ? void 0
                              : s.expTime),
                          t
                            ? ""
                                .concat(t.slice(0, 4), "-")
                                .concat(t.slice(4, 6), "-")
                                .concat(t.slice(6, 8))
                            : ""),
                      };
                    });
                    if (
                      (r.batchUpdate({ codeList: i }),
                      "1200" === s ||
                        Ta.multipleCodeRightsNbr.includes(e.legalRightsNbr))
                    )
                      r.batchUpdate({ multiCodeModal: { open: !0 } });
                    else if (
                      "1100" === s ||
                      "1300" === s ||
                      "QY1657789125042" === e.legalRightsNbr
                    )
                      r.batchUpdate({ singleCodeModal: { open: !0 } });
                    else if (s && (0, $.w3)(s)) {
                      var o, d, c;
                      r.batchUpdate({
                        qrCodeModal: {
                          open: !0,
                          data: e,
                          code: (0, Aa.L)(
                            null === (o = e.custOrderAttrs) || void 0 === o
                              ? void 0
                              : o.resourceCode
                          )[0],
                          endTime: (0, Ia.dy)(
                            null === (d = e.custOrderAttrs) || void 0 === d
                              ? void 0
                              : d.expTime
                          ),
                          startTime: (0, Ia.dy)(
                            null === (c = e.custOrderAttrs) || void 0 === c
                              ? void 0
                              : c.effTime
                          ),
                          state: "0",
                        },
                      });
                    }
                  }
                } else
                  r.batchUpdate({
                    payDiscountModal: {
                      open: !0,
                      tipsText: (0, ee.GU)(e),
                      orderId: e.custOrderId,
                      endTime: (0, $.Yq)(
                        null === (a = e.custOrderAttrs) || void 0 === a
                          ? void 0
                          : a.expTime
                      ),
                    },
                  });
              }
            })(),
          g = (e) => {
            r.batchUpdate({ currentOrderInfo: e, viewModal: { open: !0 } });
          };
        return (
          (0, l.useEffect)(() => {
            r.updateOrderList(s, n, a);
          }, [r, n, a, s]),
          (0, t.jsx)(
            va.A,
            {
              className: Na,
              useHideAsNestedScroll: !1,
              useIosOptimize: !0,
              onRefresh: () =>
                (0, N._)(function* () {
                  r.updateOrderList(s, n, a);
                })(),
              children: o
                ? Array.from(new Array(9).keys()).map((e) =>
                    (0, t.jsx)(ft.QU, {}, e)
                  )
                : (null == i ? void 0 : i.length)
                ? (0, t.jsxs)(
                    "div",
                    {
                      className: ma,
                      children: [
                        i.map((e, a) =>
                          (0, t.jsx)(
                            Nt,
                            {
                              onExchangeButtonClick: u,
                              onDetailButtonClick: _,
                              onViewAndUseButtonClick: g,
                              orderInfo: e,
                            },
                            a
                          )
                        ),
                        (0, t.jsx)("div", {
                          className: xa,
                          children: a
                            ? ""
                            : "以上展示近三月记录，如需查询更多，请点击右上角“选择时间”",
                        }),
                      ],
                    },
                    "orderList_".concat(d)
                  )
                : (0, t.jsxs)(
                    "div",
                    {
                      className: ma,
                      children: [
                        (0, t.jsx)(It.C, {}),
                        (0, t.jsx)("div", {
                          className: pa,
                          children: a
                            ? ""
                            : "以上展示近三月记录，如需查询更多，请点击右上角“选择时间”",
                        }),
                      ],
                    },
                    "orderList_".concat(d)
                  ),
            },
            "PullRefresh_".concat(d)
          )
        );
      }
      s(99784);
      var At = s(98998),
        Tt = "OrderTabs___Fn9WH",
        jt = s(20882),
        Pt = (s(27348), s(24842)),
        bt = "Tabs___rBNMc",
        Mt = "itemBack____GvUn",
        Rt = "selTitle___gRP27",
        Lt = "normalTitle____nruG",
        St = "line___QDu3S",
        yt = "DatePicker___jtZEk",
        Ut = "icon___hENiN",
        Ot = [
          { label: "全部", key: "all" },
          { label: "交易中", key: "trading" },
          { label: "已成功", key: "success" },
          { label: "已关闭", key: "closed" },
        ],
        Et = () => {
          var [e, a] = (0, fa.ok)(),
            s = e.get("status"),
            n = e.get("date"),
            [r, i] = (0, l.useState)(!1);
          return (0, t.jsxs)("div", {
            className: bt,
            children: [
              Ot.map((l, n) =>
                (0, t.jsxs)(
                  "div",
                  {
                    className: Mt,
                    onClick: () =>
                      ((s) => {
                        window.scrollTo({
                          left: 0,
                          top: 0,
                          behavior: "smooth",
                        });
                        var t = new URLSearchParams(e);
                        t.set("status", s), a(t, { replace: !0 });
                      })(l.key),
                    children: [
                      (0, t.jsx)("div", {
                        className: l.key === s ? Rt : Lt,
                        children: l.label || "",
                      }),
                      l.key === s && (0, t.jsx)("div", { className: St }),
                    ],
                  },
                  l.key
                )
              ),
              (0, t.jsxs)("div", {
                className: yt,
                onClick: () => {
                  i(!0);
                },
                children: [
                  6 === (null == n ? void 0 : n.length)
                    ? "".concat(
                        "".concat(n.slice(0, 4), ".").concat(n.slice(4))
                      )
                    : "选择时间",
                  (0, t.jsx)("span", { className: Ut }),
                ],
              }),
              (0, t.jsx)(Pt.A, {
                visible: r,
                mode: "date",
                typeArr: ["year", "month"],
                maskClosable: !0,
                disabled: !1,
                maxTs: Date.now(),
                minTs: 16094592e5,
                onHide: () => {
                  i(!1);
                },
                onChange: (s) => {
                  var t = new Date(s),
                    l = t.getFullYear(),
                    n = String(t.getMonth() + 1).padStart(2, "0"),
                    r = "".concat(l).concat(n),
                    i = new URLSearchParams(e);
                  i.set("date", r), a(i, { replace: !0 });
                },
              }),
            ],
          });
        },
        kt = "Tabs____xVzr",
        Bt = "Button___xIy_1",
        wt = "Active___a29iC",
        Dt = [
          { label: "全部", key: "all" },
          { label: "兑换类", key: "9003" },
          { label: "领取类", key: "9005" },
          { label: "购买类", key: "9004" },
          { label: "转赠记录", key: "transfer" },
        ],
        Yt = () => {
          var [e, a] = (0, fa.ok)(),
            s = e.get("category");
          return "local" === s
            ? null
            : (0, t.jsx)("div", {
                className: kt,
                children: Dt.map((l, n) =>
                  (0, t.jsx)(
                    "button",
                    {
                      type: "button",
                      className: (0, g.A)(Bt, l.key === s && wt),
                      onClick: () =>
                        ((s) => {
                          if ("transfer" !== s) {
                            window.scrollTo({
                              left: 0,
                              top: 0,
                              behavior: "smooth",
                            });
                            var t = new URLSearchParams(e);
                            t.set("category", s), a(t, { replace: !0 });
                          } else h.x.navToPath("/orderList/sendTicket");
                        })(l.key),
                      children: l.label,
                    },
                    l.key
                  )
                ),
              });
        },
        Gt = () => {
          var e = (0, jt.OH)();
          return (0, t.jsx)(At.A, {
            topOffset: e,
            children: (0, t.jsxs)("div", {
              className: Tt,
              children: [(0, t.jsx)(Et, {}), (0, t.jsx)(Yt, {})],
            }),
          });
        };
      function Vt() {
        return (
          (0, l.useEffect)(
            () => (
              o.t.setPullRefresh(!1),
              () => {
                o.t.setPullRefresh(!0);
              }
            ),
            []
          ),
          (0, i.A)({
            map: { custOrderType: "category" },
            defaults: { category: "all", status: "all" },
          }),
          (0, t.jsxs)("div", {
            className: r,
            children: [
              (0, t.jsx)(d.Q, { title: "订单页" }),
              (0, t.jsx)(Gt, {}),
              (0, t.jsx)(Ct, {}),
              (0, t.jsx)(x, {}),
              (0, t.jsx)(ia, {}),
              (0, t.jsx)(q, {}),
              (0, t.jsx)(se, {}),
              (0, t.jsx)(X, {}),
              (0, t.jsx)(ga, {}),
              (0, t.jsx)(ea, {}),
            ],
          })
        );
      }
    },
    71519(e, a, s) {
      s.d(a, { Pe: () => i, lr: () => r, wk: () => n });
      var t = s(13454),
        l = s(78337);
      function n() {
        return (0, t._)(function* () {
          var e,
            a = yield (0, l.t)({
              abilityCode: "API_99PLUS_CHECK_RENEWAL_STATE",
              data: {},
            });
          return "number" !=
            typeof (null === (e = a.data) || void 0 === e ? void 0 : e.state)
            ? null
            : a.data.state;
        })();
      }
      function r(e) {
        return (0, t._)(function* () {
          return (0,
          l.t)({ abilityCode: "API_99PLUS_CREATE_RENEWAL", data: e, showToast: !0 });
        })();
      }
      function i(e) {
        return (0, t._)(function* () {
          return (0,
          l.t)({ abilityCode: "API_99PLUS_CANCEL_RENEWAL", data: e, showToast: !0 });
        })();
      }
    },
    93521(e, a, s) {
      s.d(a, { _d: () => n, aL: () => i, dy: () => r });
      var t = s(56287),
        l = s.n(t);
      function n(e) {
        var a = l()(),
          s = l()(e);
        return a.isAfter(s);
      }
      function r(e) {
        return "string" != typeof e
          ? e
          : l()(e, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss");
      }
      function i(e) {
        return e
          ? l()(e, "HH:mm:ss").valueOf() - l()().startOf("day").valueOf()
          : 0;
      }
    },
  },
]);

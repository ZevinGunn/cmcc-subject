"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["5812"],
  {
    73852(e, n, t) {
      t.d(n, { i: () => l });
      var a = t(41486),
        o = t(12457),
        r = t(80085),
        i = t(20696);
      function l() {
        var e = (0, r.MT)(),
          n = (0, a.useCallback)(() => {
            "" !== e &&
              (0, o.VD)({ pageCode: e }).then((e) => {
                ("20001" !== e.resultCode && "20002" !== e.resultCode) ||
                  i.x.navToPath("activity/offline");
              });
          }, [e]);
        (0, a.useEffect)(() => {
          n();
        }, [n]);
      }
    },
    66992(e, n, t) {
      t.r(n), t.d(n, { default: () => bt });
      var a = t(86070),
        o = t(41486),
        r = t.n(o),
        i = "Page___NPRhc",
        l = t(62127),
        s = t(73852),
        c = t(80085),
        d = t(4600),
        u = t(52180),
        g = "Module___C4oiw",
        m = t(82647),
        f = "ButtonGroup___yrL0A",
        v = "RulesButton___aToVr",
        _ = "OrderButton___FoZHo",
        p = t(20696);
      function h(e) {
        var { onRulesButtonClick: n } = e;
        return (0, a.jsxs)("div", {
          className: f,
          children: [
            (0, a.jsx)("button", { className: v, type: "button", onClick: n }),
            (0, a.jsx)("button", {
              className: _,
              type: "button",
              onClick: () => {
                m.U.bpEverythingClick({
                  moduleName: "banner",
                  pointPosition: "我的订单",
                }),
                  p.x.navToPath("/orderList");
              },
            }),
          ],
        });
      }
      t(9474);
      var x = t(47971),
        b = "OfferOrderBtnWrap___jfmB9",
        y = "OfferOrderBtn___Fonpe",
        C = "Agreement___w1wN6",
        j = "CustomCheckbox___y_vLr",
        N = "AgreementButton___SOalD",
        I = "AniShake___cGb8Q",
        k = t(13526),
        O = t(25755),
        M = t(50067);
      function R(e) {
        var { onRulesButtonClick: n } = e,
          t = (0, M.useStore)((e) => {
            var n;
            return null === (n = e.memberConfig) || void 0 === n
              ? void 0
              : n.offerOrderBtn;
          }),
          o = (0, M.useStore)((e) => e.isAgreement),
          r = (0, M.useStore)((e) => e.shakeAgreement),
          i = (0, M.useStoreActions)(),
          { openOfferOrderConfirmModal: l } = (0,
          M.useOpenOfferOrderConfirmModal)();
        return (0, a.jsxs)("div", {
          className: b,
          children: [
            (0, a.jsx)("img", {
              className: (0, k.A)(y, "ani-pulse-sm"),
              src: t,
              alt: "",
              onClick: () => {
                m.U.bpEverythingClick({
                  moduleName: "banner",
                  pointPosition: "开通按钮",
                }),
                  l();
              },
            }),
            (0, a.jsxs)("div", {
              className: (0, k.A)(C, r && I),
              children: [
                (0, a.jsx)(x.A, {
                  value: 1,
                  checked: o,
                  onChange: () => {
                    m.U.bpEverythingClick({
                      moduleName: "banner",
                      pointPosition: "协议勾选按钮",
                    }),
                      i.updateIsAgreement(!o);
                  },
                  className: j,
                  icons: {
                    normal: (0, a.jsx)(O.Q, { color: "#9A8D82" }),
                    active: (0, a.jsx)(O.K, { color: "#9A8D82" }),
                  },
                  children: "我已阅读并同意",
                }),
                (0, a.jsx)("span", {
                  className: N,
                  onClick: n,
                  children: "《活动规则》",
                }),
              ],
            }),
          ],
        });
      }
      var P = "Modal___ooNwI",
        S = "CloseButton___jOMBp",
        U = "CloseButtonIcon___HXMo_",
        T = "Body___XmVSG",
        B = t(62033),
        L = t(58349),
        w = t(62144);
      function A() {
        var e = (0, M.useStore)((e) => e.actRules),
          n = (0, w.useMemberIndex)(),
          t = e ? e[n].rightsRemarks : null;
        return (0, a.jsx)(L.s, { text: t });
      }
      function E(e) {
        var { open: n, onClose: t } = e;
        return (0, a.jsx)(B.v, {
          open: n,
          children: (0, a.jsxs)("div", {
            className: P,
            style: {
              backgroundImage: "url(".concat(
                gImgUrlPrefixLegacy,
                "/rights/202505/0f9f4e7b-2d64-43b7-99e9-8c8f8bbcaffc-ahogao.png)"
              ),
            },
            children: [
              (0, a.jsx)("div", { className: T, children: (0, a.jsx)(A, {}) }),
              (0, a.jsx)("div", {
                className: S,
                onClick: t,
                children: (0, a.jsx)("img", {
                  className: U,
                  src: "".concat(
                    gImgUrlPrefixLegacy,
                    "/rights/202505/42277ba8-28c6-4afe-b2ba-17a5b3297595-06.png"
                  ),
                  alt: "",
                }),
              }),
            ],
          }),
        });
      }
      var V = t(55370);
      function H() {
        var e = (0, M.useStore)((e) => {
            var n;
            return null === (n = e.memberConfig) || void 0 === n
              ? void 0
              : n.bannerBg;
          }),
          n = (0, V.a)(),
          [t, r] = (0, o.useState)(!1);
        return (0, a.jsxs)("div", {
          className: g,
          style: { backgroundImage: "url(".concat(e, ")") },
          id: d.moduleIds.banner,
          children: [
            (0, a.jsx)(h, {
              onRulesButtonClick: () => {
                m.U.bpEverythingClick({
                  moduleName: "banner",
                  pointPosition: "使用规则按钮",
                }),
                  m.U.bpModalShow({ envName: "规则弹窗" }),
                  r(!0);
              },
            }),
            0 === n
              ? (0, a.jsx)(R, {
                  onRulesButtonClick: () => {
                    m.U.bpEverythingClick({
                      moduleName: "banner",
                      pointPosition: "《使用规则》",
                    }),
                      m.U.bpModalShow({ envName: "规则弹窗" }),
                      r(!0);
                  },
                })
              : null,
            (0, a.jsx)(E, {
              open: t,
              onClose: () => {
                m.U.bpModalHide({ envName: "规则弹窗" }), r(!1);
              },
            }),
          ],
        });
      }
      var z = "Module___VbrLT",
        F = "Icon___DVrU5",
        D = "OffsetY___MIcW3",
        Z = "OffsetYSm___NMqe6",
        Y = t(18843),
        q = t(66314),
        G = t(74546);
      var W = "Module___GsZbq",
        K = "Icon___ql6XJ",
        Q = t(64308);
      function X() {
        return {
          icons: (0, o.useMemo)(
            () => [
              {
                id: d.moduleIds.comm,
                name: "通信权益",
                normal:
                  "/rights/202603/84a8f2db-d46a-422a-83a5-08200c21bc07-f2.png",
                active:
                  "/rights/202603/36de3478-cec7-4d4c-970d-1dc29a91d5a0-f1.png",
              },
              {
                id: d.moduleIds.core,
                name: "核心权益",
                normal:
                  "/rights/202505/4e795dda-7649-428c-826d-5a9f5c6b1e69-05.png",
                active:
                  "/rights/202505/db30b181-7f52-4938-95da-a6480411cdf9-03.png",
              },
              {
                id: d.moduleIds.exclusive,
                name: "专属权益",
                normal:
                  "/rights/202505/a6951f80-d8d9-4f0b-88c7-4faf6efa3d9d-07.png",
                active:
                  "/rights/202505/463a1c03-2a2c-47ff-87fe-8145303e08e0-01.png",
              },
            ],
            []
          ),
        };
      }
      var J = r().forwardRef((e, n) => {
        var { currentModuleId: t } = e,
          { icons: o } = X(),
          i = r().useRef(null);
        r().useImperativeHandle(n, () => i.current);
        return (0, a.jsx)("div", {
          className: W,
          id: d.moduleIds.stickyCategories,
          ref: i,
          children: o.map((e, n) =>
            (0, a.jsx)(
              "img",
              {
                className: K,
                src: ""
                  .concat(gImgUrlPrefixLegacy)
                  .concat(
                    "string" == typeof t && t === e.id ? e.active : e.normal
                  ),
                alt: "",
                onClick: () =>
                  ((e) => {
                    m.U.bpEverythingClick({
                      moduleName: "权益分类",
                      pointPosition: e.name,
                    }),
                      setTimeout(() => {
                        var n = 89;
                        i.current && (n = i.current.clientHeight + 8),
                          (0, Q.PA)("#".concat(e.id), -n);
                      }, 300);
                  })(e),
              },
              e.id
            )
          ),
        });
      });
      function $() {
        var e = (0, V.a)(),
          { icons: n } = X(),
          t = (0, o.useRef)(null),
          r = (0, o.useRef)(null),
          i = (function (e, n) {
            var [t, a] = (0, o.useState)(null),
              { run: r } = (0, q.A)(
                () => {
                  for (var t of n) {
                    var o = document.getElementById(t.id);
                    if (o) {
                      var r = o.getBoundingClientRect(),
                        i = 89;
                      if (
                        (e.current && (i = e.current.clientHeight + 50),
                        r.top > 0 && r.top < i)
                      ) {
                        a(t.id);
                        break;
                      }
                    }
                  }
                },
                { leading: !0, trailing: !0, wait: 100 }
              );
            return (0, G.A)("scroll", r, { target: window.document }), t;
          })(r, n),
          [, l] = (0, Y.A)(() => t.current, { threshold: [0, 0.66, 1] }),
          s = 0 === l || ("number" == typeof l && l < 0.66);
        return (0, a.jsxs)(a.Fragment, {
          children: [
            (0, a.jsx)("div", {
              ref: t,
              className: z,
              style: { marginTop: 0 === e ? "-1rem" : "-1.61rem" },
              id: d.moduleIds.categories,
              children: n.map((e, t) =>
                (0, a.jsx)(
                  "img",
                  {
                    className: (0, k.A)(
                      F,
                      4 === n.length && (0 === t || 3 === t) && D,
                      3 === n.length && (0 === t || 2 === t) && Z
                    ),
                    src: "".concat(gImgUrlPrefixLegacy).concat(e.normal),
                    alt: "",
                    onClick: () =>
                      ((e) => {
                        m.U.bpEverythingClick({
                          moduleName: "权益分类",
                          pointPosition: e.name,
                        }),
                          setTimeout(() => {
                            (0, u.scrollToModule)(e.id);
                          }, 300);
                      })(e),
                  },
                  e.id
                )
              ),
            }),
            s ? (0, a.jsx)(J, { ref: r, currentModuleId: i }) : null,
          ],
        });
      }
      var ee = {
        ModuleRightsApp: "ModuleRightsApp___Utk0B",
        Img: "Img___jILSQ",
        Button: "Button___Jlyrp",
        Button1: "Button1___NJVnv",
        Button2: "Button2___G1ivk",
        Button3: "Button3___VCVHE",
      };
      function ne() {
        var e = (0, V.a)(),
          n = (0, M.useStore)((e) => e.cmccAppRights),
          { openOfferOrderConfirmModal: t } = (0,
          M.useOpenOfferOrderConfirmModal)(),
          o = "".concat(
            gImgUrlPrefixLegacy,
            0 === e
              ? "/rights/202603/0627fe00-6c18-40e5-8519-af9c4b054359-f2.png"
              : "/rights/202603/edadac36-89de-4737-aaf3-3bc6ffb5e1ca-f1.png"
          );
        return n
          ? (0, a.jsxs)("div", {
              className: ee.ModuleRightsApp,
              children: [
                (0, a.jsx)("img", {
                  className: ee.Img,
                  src: "".concat(gImgUrlPrefixLegacy).concat(n.card),
                  alt: "",
                }),
                n.buttonList.map((n, r) =>
                  (0, a.jsx)(
                    "button",
                    {
                      className: (0, k.A)(
                        ee.Button,
                        ee["Button".concat(r + 1)]
                      ),
                      type: "button",
                      onClick: () => {
                        return (
                          (a = n),
                          m.U.bpEverythingClick({
                            moduleName: "中国移动APP专属权益",
                            pointPosition: a.rightsTitle,
                          }),
                          void (0 !== e ? p.x.navToOp({ data: a }) : t())
                        );
                        var a;
                      },
                      children: (0, a.jsx)("img", { src: o, alt: "" }),
                    },
                    n.configId
                  )
                ),
              ],
            })
          : null;
      }
      var te = t(13454),
        ae = "Module___eZlQK",
        oe = "Button___liI3F",
        re = "ButtonImg___A56ZF";
      function ie() {
        var e = (0, V.a)(),
          { openOfferOrderConfirmModal: n } = (0,
          M.useOpenOfferOrderConfirmModal)(),
          t = (0, M.useStore)((e) => e.commRights),
          o = (0, M.useStoreActions)();
        return (0, a.jsx)("div", {
          className: ae,
          id: d.moduleIds.comm,
          children:
            null == t
              ? void 0
              : t.list.map((r) => {
                  var i = ((e) => {
                    if (!e.isMember)
                      return {
                        src: "".concat(
                          gImgUrlPrefixLegacy,
                          "/rights/202507/e1e818e1-c342-4cce-9bd1-e14c772b2cfc-04.png"
                        ),
                        disabled: !1,
                      };
                    if (e.hasClaimed) {
                      if (0 === e.groupOrderTimes)
                        return {
                          src: "".concat(
                            gImgUrlPrefixLegacy,
                            "/rights/202603/4847724b-8600-42ed-83a5-881533c3708e-ajgohawohgoe.png"
                          ),
                          disabled: !0,
                        };
                      if (e.groupOrderTimes > 0)
                        return {
                          src: "".concat(
                            gImgUrlPrefixLegacy,
                            "/rights/202507/257fc23c-4524-4ef3-8a30-be2cb57dd81f-01.png"
                          ),
                          disabled: !0,
                        };
                    }
                    return {
                      src: "".concat(
                        gImgUrlPrefixLegacy,
                        "/rights/202507/7d7d7e30-9ebe-40ed-833f-94af6d94923a-03.png"
                      ),
                      disabled: !1,
                    };
                  })({
                    groupOrderTimes: r.groupOrderTimes || 0,
                    hasClaimed: t.hasClaimed,
                    isMember: e > 0,
                  });
                  return (0, a.jsx)(
                    "button",
                    {
                      className: oe,
                      type: "button",
                      onClick: () =>
                        ((t, a) =>
                          (0, te._)(function* () {
                            a.disabled ||
                              (0 !== e
                                ? o.updateCommOrderConfirmModal({
                                    open: !0,
                                    data: t,
                                  })
                                : n());
                          })())(r, i),
                      children: (0, a.jsx)("img", {
                        className: re,
                        src: i.src,
                        alt: "",
                      }),
                    },
                    r.legalRightsNbr
                  );
                }),
        });
      }
      var le = "Module___UcFzT",
        se = "ModuleHorizontal___sIuKH",
        ce = "ModuleVerticalCollapsed___u0Rfp",
        de = "ModuleVerticalExpanded___d64VW",
        ue = "Body___qv6VI",
        ge = "RbAreaWrapper___k2YnO",
        me = "RbArea___Qp815",
        fe = "Item___iej8Z";
      var ve = "CardWrapper___juXIM",
        _e = "Card___hiZVi",
        pe = "Content___cR5R6",
        he = "Icon___jv6me",
        xe = "Name___ie0PH",
        be = "Button___qjxSi",
        ye = t(66782),
        Ce = t(7960),
        je = t(1232),
        Ne = {
          lock: "/rights/202507/e1e818e1-c342-4cce-9bd1-e14c772b2cfc-04.png",
          "rec-now":
            "/rights/202507/7d7d7e30-9ebe-40ed-833f-94af6d94923a-03.png",
          received:
            "/rights/202507/257fc23c-4524-4ef3-8a30-be2cb57dd81f-01.png",
          "rec-next":
            "/rights/202507/def9e216-3e43-4ffc-b179-f4f9fcc8349f-02.png",
          "disabled-rec-now":
            "/rights/202603/4847724b-8600-42ed-83a5-881533c3708e-ajgohawohgoe.png",
        };
      function Ie(e) {
        var {
            rightsInfo: n,
            status: t,
            layout: o = "horizontal",
            showChangLingBadge: r = !1,
            onButtonClick: i,
          } = e,
          l = gImgUrlPrefixLegacy + Ne[t];
        return (0, a.jsxs)("div", {
          className: ve,
          "data-layout": o,
          children: [
            r
              ? (0, a.jsx)(je.t, {
                  status: (0, ye.To)(n),
                  placement: "topRight",
                })
              : null,
            (0, a.jsx)(Ce._, {
              className: he,
              fit: "cover",
              src: (0, ye.DO)(n, "211x151"),
            }),
            (0, a.jsx)("div", {
              className: _e,
              onClick: () => {
                i(n, t);
              },
              children: (0, a.jsxs)("div", {
                className: pe,
                children: [
                  (0, a.jsx)("div", {
                    className: xe,
                    children: null == n ? void 0 : n.legalRightsName,
                  }),
                  l
                    ? (0, a.jsx)("img", { className: be, src: l, alt: "" })
                    : null,
                ],
              }),
            }),
          ],
        });
      }
      var ke = "Carousel___tmub4",
        Oe = "StaticRow___sHeEX",
        Me = "SwiperViewport___DjvzU",
        Re = "SwiperContainer___LDW9V",
        Pe = "SwiperSlide___G26kx",
        Se = t(77532),
        Ue = t(19331);
      function Te(e, n) {
        return r().Children.map(e, (e) =>
          r().isValidElement(e)
            ? (0, a.jsx)("div", { className: n, children: e })
            : null
        );
      }
      function Be(e) {
        var { autoplay: n, children: t } = e,
          [r, i] = (0, Ue.A)(
            { slidesToScroll: 3, loop: !0, align: "start", containScroll: !1 },
            [(0, Se.A)({ delay: 3e3, playOnInit: !1, stopOnInteraction: !1 })]
          );
        return (
          (0, o.useEffect)(() => {
            if (i) {
              var e = () => {
                var e,
                  t =
                    null === (e = i.plugins()) || void 0 === e
                      ? void 0
                      : e.autoplay;
                t &&
                  (i.scrollSnapList().length <= 1
                    ? t.stop()
                    : n
                    ? t.play()
                    : t.stop());
              };
              return (
                e(),
                i.on("reInit", e),
                () => {
                  i.off("reInit", e);
                }
              );
            }
          }, [n, i]),
          (0, a.jsx)("div", {
            className: Me,
            ref: r,
            children: (0, a.jsx)("div", { className: Re, children: Te(t, Pe) }),
          })
        );
      }
      function Le(e) {
        var { autoplay: n, itemCount: t, children: o } = e,
          r = t > 3;
        return (0, a.jsx)("div", {
          className: ke,
          children: r
            ? (0, a.jsx)(Be, { autoplay: n, children: o })
            : (0, a.jsx)("div", { className: Oe, children: o }),
        });
      }
      function we(e) {
        var n,
          t,
          r,
          {
            claimMethod: i,
            data: l,
            type: s,
            layout: c = "horizontal",
            autoplay: d = !1,
          } = e,
          u = (0, V.a)(),
          g = 0 === (null == l ? void 0 : l.canUse),
          {
            ref: f,
            isAtTop: v,
            isAtBottom: _,
          } = (function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {},
              { topThreshold: n = 0, bottomThreshold: t = 0 } = e,
              a = (0, o.useRef)(null),
              [r, i] = (0, o.useState)(!0),
              [l, s] = (0, o.useState)(!1),
              c = (0, o.useCallback)((e) => {
                a.current = e;
              }, []),
              d = (0, o.useCallback)(() => {
                var e = a.current;
                if (e) {
                  var { scrollTop: o, scrollHeight: r, clientHeight: l } = e,
                    c = o + l >= r - t || r <= l;
                  i(o <= n), s(c);
                }
              }, [t, n]);
            return (
              (0, o.useEffect)(() => {
                var e = a.current;
                if (e) {
                  var n = () => {
                    d();
                  };
                  return (
                    d(),
                    e.addEventListener("scroll", n, { passive: !0 }),
                    () => {
                      e.removeEventListener("scroll", n);
                    }
                  );
                }
              }, [d]),
              { ref: c, isAtTop: r, isAtBottom: l }
            );
          })(),
          h = (0, o.useCallback)((e, n) => {
            if (
              (m.U.bpEverythingClick({
                moduleName: "核心权益",
                pointPosition: e.legalRightsName,
              }),
              "disabled-rec-now" !== n)
            )
              return "received" === n
                ? (m.U.bpEverythingClick({
                    moduleName: "核心权益",
                    pointPosition: "已领按钮",
                  }),
                  void p.x.navToPath("/99plus2/product", {
                    nbr: e.legalRightsNbr,
                  }))
                : "rec-next" === n
                ? (m.U.bpEverythingClick({
                    moduleName: "核心权益",
                    pointPosition: "下月再领按钮",
                  }),
                  void p.x.navToPath("/99plus2/product", {
                    nbr: e.legalRightsNbr,
                  }))
                : "lock" === n
                ? (m.U.bpEverythingClick({
                    moduleName: "核心权益",
                    pointPosition: "开通解锁按钮",
                  }),
                  void p.x.navToPath("/99plus2/product", {
                    nbr: e.legalRightsNbr,
                  }))
                : void (
                    "rec-now" === n &&
                    (m.U.bpEverythingClick({
                      moduleName: "核心权益",
                      pointPosition: "立即领取按钮",
                    }),
                    p.x.navToPath("/99plus2/product", {
                      nbr: e.legalRightsNbr,
                    }))
                  );
          }, []),
          x = (e) =>
            0 === u
              ? "lock"
              : "string" == typeof i && "none" === i
              ? "rec-now"
              : "string" == typeof i && i !== s
              ? "disabled-rec-now"
              : g
              ? e.groupOrderTimes && e.groupOrderTimes > 0
                ? "received"
                : "yearly" === i
                ? "disabled-rec-now"
                : "rec-next"
              : "rec-now",
          b =
            null == l || null === (n = l.list) || void 0 === n
              ? void 0
              : n.map((e) =>
                  (0, a.jsx)(
                    "div",
                    {
                      className: fe,
                      children: (0, a.jsx)(Ie, {
                        layout: c,
                        status: x(e),
                        rightsInfo: e,
                        showChangLingBadge: "monthly" === s,
                        onButtonClick: h,
                      }),
                    },
                    null == e ? void 0 : e.legalRightsNbr
                  )
                );
        return (0, a.jsx)("div", {
          className: ge,
          "data-layout": c,
          "data-at-top": v ? "true" : "false",
          "data-at-bottom": _ ? "true" : "false",
          children:
            "vertical" === c
              ? (0, a.jsx)(Le, {
                  autoplay: d,
                  itemCount:
                    null !==
                      (r =
                        null == l || null === (t = l.list) || void 0 === t
                          ? void 0
                          : t.length) && void 0 !== r
                      ? r
                      : 0,
                  children: b,
                })
              : (0, a.jsx)("div", { className: me, ref: f, children: b }),
        });
      }
      function Ae() {
        var e = (0, M.useStore)((e) => e.coreRights);
        return (0, a.jsx)(we, {
          type: "monthly",
          claimMethod: null == e ? void 0 : e.claimMethod,
          data: null == e ? void 0 : e.monthlyRights,
        });
      }
      function Ee() {
        var e = (0, M.useStore)((e) => e.coreRights);
        return (0, a.jsx)(we, {
          type: "yearly",
          claimMethod: null == e ? void 0 : e.claimMethod,
          data: null == e ? void 0 : e.yearlyRights,
        });
      }
      function Ve() {
        return (0, a.jsxs)("div", {
          className: ue,
          children: [(0, a.jsx)(Ae, {}), (0, a.jsx)(Ee, {})],
        });
      }
      function He(e) {
        var n = (0, V.a)(),
          t = (0, M.useStore)((e) => {
            var n;
            return null === (n = e.coreRights) || void 0 === n
              ? void 0
              : n.claimMethod;
          }),
          a = (function (e, n) {
            return 0 !== e && "none" !== n && n
              ? "yearly" === n
                ? "vertical-yearly-primary"
                : "vertical-monthly-primary"
              : "horizontal";
          })(n, t),
          o = "vertical-yearly-primary" === a ? "yearly" : "monthly";
        return {
          layoutMode: a,
          primaryType: o,
          secondaryType: "yearly" === o ? "monthly" : "yearly",
          claimMethod: t,
          moduleBgVariant:
            "horizontal" === a
              ? "horizontal"
              : e
              ? "vertical-expanded"
              : "vertical-collapsed",
        };
      }
      var ze = "VerticalBody___tX1Nu",
        Fe = "SecondarySlot___h295s",
        De = "SecondaryContent___V6qy3",
        Ze = "Bar___PgXEg",
        Ye = "Logos___fPZ2B",
        qe = "LogoItem___EGPmj",
        Ge = "LogoImg___iRvzY",
        We = "Label___nmzpb",
        Ke = "Toggle___lYFjE",
        Qe = "ToggleText___E3y_G",
        Xe = "Arrow___RudBg",
        Je = "/rights/202606/a21fcab3-a7b6-4ee7-8a0a-3358574308b3-f4.png",
        $e = {
          monthly: {
            title: "领月福袋",
            subtitle: "每月任领1款",
            collapsedLabel: "查看月福袋",
          },
          yearly: {
            title: "领年福袋",
            subtitle: "每年任领1款",
            collapsedLabel: "查看年福袋",
          },
        },
        en = { duration: 0.35, ease: [0.4, 0, 0.2, 1] };
      function nn(e) {
        var n,
          t,
          { type: o, data: r, onToggle: i } = e,
          l =
            null !==
              (t =
                null == r || null === (n = r.list) || void 0 === n
                  ? void 0
                  : n.slice(0, 3)) && void 0 !== t
              ? t
              : [],
          s = $e[o].collapsedLabel,
          c = [
            ...l.map((e) => ({
              key: e.legalRightsNbr,
              src: (0, ye.DO)(e, "211x151"),
            })),
            { key: "more", src: gImgUrlPrefixLegacy + Je },
          ];
        return (0, a.jsxs)("button", {
          type: "button",
          className: Ze,
          onClick: i,
          "aria-expanded": !1,
          children: [
            (0, a.jsx)("div", {
              className: Ye,
              children: c.map((e) =>
                (0, a.jsx)(
                  "div",
                  {
                    className: qe,
                    "data-type": "more" === e.key ? "more" : "rights",
                    children: (0, a.jsx)(Ce._, {
                      lazy: !1,
                      className: Ge,
                      fit: "cover",
                      src: e.src,
                      alt: "",
                    }),
                  },
                  e.key
                )
              ),
            }),
            (0, a.jsx)("span", { className: We, children: s }),
            (0, a.jsxs)("span", {
              className: Ke,
              children: [
                (0, a.jsx)("span", { className: Qe, children: "展开" }),
                (0, a.jsx)("span", { className: Xe }),
              ],
            }),
          ],
        });
      }
      var tn = "Section___pyDS2",
        an = "Header___vdUC7",
        on = "HeaderMain___bxOdP",
        rn = "HeaderIcon___tLGE8",
        ln = "HeaderTitle___gUlf0",
        sn = "HeaderSubtitle___qMQ8o",
        cn = "CollapseBtn___g0a_Z",
        dn = "CollapseText___WQ9E_",
        un = "CollapseArrow___t6SOT";
      function gn(e) {
        var {
            type: n,
            layout: t,
            claimMethod: o,
            data: r,
            collapsible: i = !1,
            onCollapse: l,
            autoplay: s,
          } = e,
          c = $e[n];
        return (0, a.jsxs)("div", {
          className: tn,
          "data-layout": t,
          children: [
            "vertical" === t
              ? (0, a.jsxs)("div", {
                  className: an,
                  "data-collapsible": i ? "true" : "false",
                  children: [
                    (0, a.jsxs)("div", {
                      className: on,
                      children: [
                        (0, a.jsx)("span", { className: rn }),
                        (0, a.jsx)("span", {
                          className: ln,
                          children: c.title,
                        }),
                        (0, a.jsx)("span", {
                          className: sn,
                          children: c.subtitle,
                        }),
                      ],
                    }),
                    i
                      ? (0, a.jsxs)("button", {
                          type: "button",
                          className: cn,
                          onClick: l,
                          children: [
                            (0, a.jsx)("span", {
                              className: dn,
                              children: "收起",
                            }),
                            (0, a.jsx)("span", { className: un }),
                          ],
                        })
                      : null,
                  ],
                })
              : null,
            (0, a.jsx)(we, {
              type: n,
              layout: t,
              claimMethod: o,
              data: r,
              autoplay: s,
            }),
          ],
        });
      }
      var mn = t(63373);
      function fn(e) {
        var { secondaryExpanded: n, onSecondaryExpandedChange: t } = e,
          { primaryType: r, secondaryType: i, claimMethod: l } = He(n),
          s = (0, M.useStore)((e) => {
            var n;
            return null === (n = e.coreRights) || void 0 === n
              ? void 0
              : n.monthlyRights;
          }),
          c = (0, M.useStore)((e) => {
            var n;
            return null === (n = e.coreRights) || void 0 === n
              ? void 0
              : n.yearlyRights;
          }),
          [d, u] = (0, o.useState)(!1);
        (0, o.useEffect)(() => {
          n && u(!0);
        }, [n]);
        var g = "monthly" === r ? s : c,
          m = "monthly" === i ? s : c;
        return (0, a.jsxs)("div", {
          className: ze,
          children: [
            (0, a.jsx)(gn, {
              type: r,
              layout: "vertical",
              claimMethod: l,
              data: g,
              autoplay: !0,
            }),
            (0, a.jsxs)(mn.P.div, {
              className: Fe,
              "data-expanded": n ? "true" : "false",
              initial: !1,
              animate: { height: n ? 287 : 50 },
              transition: en,
              children: [
                n
                  ? null
                  : (0, a.jsx)(nn, { type: i, data: m, onToggle: () => t(!0) }),
                d
                  ? (0, a.jsx)("div", {
                      className: De,
                      "data-visible": n ? "true" : "false",
                      "aria-hidden": !n,
                      children: (0, a.jsx)(gn, {
                        type: i,
                        layout: "vertical",
                        claimMethod: l,
                        data: m,
                        collapsible: !0,
                        autoplay: n,
                        onCollapse: () => t(!1),
                      }),
                    })
                  : null,
              ],
            }),
          ],
        });
      }
      function vn() {
        var [e, n] = (0, o.useState)(!1),
          { layoutMode: t, moduleBgVariant: r } = He(e),
          [i, l] = (0, o.useState)(t);
        return (
          t !== i && (l(t), "horizontal" === t && n(!1)),
          (0, a.jsx)("div", {
            className: (0, k.A)(le, {
              [se]: "horizontal" === r,
              [ce]: "vertical-collapsed" === r,
              [de]: "vertical-expanded" === r,
            }),
            id: d.moduleIds.core,
            children:
              "horizontal" === t
                ? (0, a.jsx)(Ve, {})
                : (0, a.jsx)(fn, {
                    secondaryExpanded: e,
                    onSecondaryExpandedChange: n,
                  }),
          })
        );
      }
      var _n = "Module___gQBHh",
        pn = "Line___EwZKb",
        hn = t(20837),
        xn = t(43952),
        bn = t(50654),
        yn = "Title___piUXx",
        Cn = "Highlight___xTOK7",
        jn = "Modal___Yxo_v",
        Nn = "CloseButton___eZJM_",
        In = "CloseButtonIcon___YnuDw",
        kn = "Foot___GBCno",
        On = "OkButton___CUxie",
        Mn = "Body___KhgB_";
      function Rn(e) {
        var {
          open: n,
          onClose: t,
          onOk: o,
          children: r,
          backgroundImage: i,
          okBtnImage: l,
        } = e;
        return (0, a.jsx)(B.v, {
          open: n,
          children: (0, a.jsxs)("div", {
            className: jn,
            style: { backgroundImage: "url(".concat(i, ")") },
            children: [
              (0, a.jsx)("div", { className: Mn, children: r }),
              (0, a.jsx)("div", {
                className: kn,
                children: (0, a.jsx)("img", {
                  className: On,
                  onClick: o,
                  src: l,
                  alt: "",
                }),
              }),
              (0, a.jsx)("div", {
                className: Nn,
                onClick: t,
                children: (0, a.jsx)("img", {
                  className: In,
                  src: "".concat(
                    gImgUrlPrefixLegacy,
                    "/rights/202505/42277ba8-28c6-4afe-b2ba-17a5b3297595-06.png"
                  ),
                  alt: "",
                }),
              }),
            ],
          }),
        });
      }
      function Pn(e) {
        var { rightsName: n } = e,
          t = (0, bn._)(e, ["rightsName"]);
        return (0, a.jsx)(
          Rn,
          (0, xn._)(
            (0, hn._)(
              {
                backgroundImage: "".concat(
                  gImgUrlPrefixLegacy,
                  "/rights/202505/99158c30-3543-4884-ba75-097814e913ec-05.png"
                ),
                okBtnImage: "".concat(
                  gImgUrlPrefixLegacy,
                  "/rights/202505/6305789a-3b41-4c73-a33d-a6cd94a855f0-zhouahg.png"
                ),
              },
              t
            ),
            {
              children: (0, a.jsxs)("div", {
                className: yn,
                children: [
                  "您已领取",
                  (0, a.jsx)("span", { className: Cn, children: n }),
                  "，请您前往中国移动APP手厅-我的卡券查看",
                ],
              }),
            }
          )
        );
      }
      var Sn = "ExclusiveRightsCard___RFZaN",
        Un = "Info___TCHMv",
        Tn = "Title___PmxKF",
        Bn = "Subtitle___n5lqC",
        Ln = "Button___Aw62x",
        wn = "Sm___ui1Vc",
        An = "Icon___vgYng",
        En = "Lg___RKSkG",
        Vn = {
          rec: "/rights/202505/aa2e9096-3cfc-4f25-83fa-0ace197eb45f-01.png",
          view: "/rights/202505/282a8552-512b-4b07-9208-b31cceccface-02.png",
          lock: "/rights/202505/b25a3268-501e-4e4c-bc96-9641324c5994-03.png",
          "has-rec":
            "/rights/202505/ce9f4614-3c47-4e15-a1b4-92dacf1f40a6-04.png",
        };
      function Hn(e) {
        var { size: n, rightsInfo: t, buttonType: o, onButtonClick: r } = e,
          i = Vn[o];
        return (0, a.jsxs)("div", {
          className: (0, k.A)(Sn, "sm" === n ? wn : En),
          children: [
            (0, a.jsxs)("div", {
              className: Un,
              children: [
                (0, a.jsx)("div", { className: Tn, children: t.name }),
                (0, a.jsx)("div", { className: Bn, children: t.subName }),
                (0, a.jsx)("img", {
                  className: Ln,
                  src: "".concat(gImgUrlPrefixLegacy).concat(i),
                  alt: "",
                  onClick: () => r(o, t),
                }),
              ],
            }),
            (0, a.jsx)("img", {
              className: An,
              src: "".concat(gImgUrlPrefixLegacy).concat(t.img1),
              alt: "",
            }),
          ],
        });
      }
      var zn = t(33843),
        Fn = t(86503);
      function Dn() {
        var e = (0, V.a)(),
          n = (0, M.useStoreActions)(),
          [t, r] = (0, o.useState)(!1),
          [i, l] = (0, o.useState)(),
          s = (0, M.useStore)((e) => e.exclusiveRightsList),
          { openOfferOrderConfirmModal: c } = (0,
          M.useOpenOfferOrderConfirmModal)(),
          g = (n) =>
            0 === e
              ? "lock"
              : n.name.includes("石油")
              ? "view"
              : "1" === n.state
              ? "has-rec"
              : "rec",
          f = (e, t) =>
            (0, te._)(function* () {
              if ("lock" === e)
                return (
                  m.U.bpEverythingClick({
                    moduleName: "专属权益",
                    pointPosition: "开通按钮",
                  }),
                  void c({ scrollToAgreement: !0, sleepDuration: 800 })
                );
              if ("view" === e)
                return (
                  m.U.bpEverythingClick({
                    moduleName: "专属权益",
                    pointPosition: "查看按钮",
                  }),
                  void p.x.navToOp({ data: t })
                );
              if ("has-rec" === e)
                return (
                  m.U.bpEverythingClick({
                    moduleName: "专属权益",
                    pointPosition: "已领取按钮",
                  }),
                  void (0, u.navToPhoneCouponUsePage)()
                );
              if ("rec" === e) {
                if (
                  (m.U.bpEverythingClick({
                    moduleName: "专属权益",
                    pointPosition: t.discountName,
                  }),
                  "0" ===
                    (yield (0, Fn.Px)({
                      discountType: t.discountType,
                      batchId: t.batchId,
                      actId: t.actId,
                      memberType: "99PLUS_NEW",
                    })).resultCode)
                )
                  return l(t), r(!0), void n.updateExclusiveRightsList();
                zn.R.openCommonOrderFailModal();
              }
            })();
        return (0, a.jsxs)(a.Fragment, {
          children: [
            (0, a.jsxs)("div", {
              className: _n,
              id: d.moduleIds.exclusive,
              children: [
                s && s.length > 1 ? (0, a.jsx)("div", { className: pn }) : null,
                null == s
                  ? void 0
                  : s.map((e) =>
                      (0, a.jsx)(
                        Hn,
                        {
                          size: 1 === s.length ? "lg" : "sm",
                          rightsInfo: e,
                          buttonType: g(e),
                          onButtonClick: f,
                        },
                        e.batchId
                      )
                    ),
              ],
            }),
            (0, a.jsx)(Pn, {
              open: t,
              rightsName:
                ((null == i ? void 0 : i.name) || "") +
                ((null == i ? void 0 : i.subName) || ""),
              onClose: () => {
                r(!1);
              },
              onOk: () => {
                (0, u.navToPhoneCouponUsePage)();
              },
            }),
          ],
        });
      }
      t(48803);
      var Zn = t(23449),
        Yn = "NotificationBar___ofhfi",
        qn = t(36847),
        Gn = t(73508),
        Wn = t(45516);
      function Kn() {
        var { data: e } = (0, Gn.A)(
          () =>
            (0, te._)(function* () {
              var e = yield (0, qn.n3)("99PLUS2_NOTICE");
              return e.data && 0 !== e.data.length
                ? e.data[0].rightsRemarks
                : "";
            })(),
          { cacheKey: "99PLUS2_NOTICE" }
        );
        return (0, a.jsx)("div", {
          className: Yn,
          children: (0, a.jsx)(Zn.A, {
            closeable: !0,
            marquee: "overflow",
            leftContent: (0, a.jsx)(Wn.A, {}),
            children: e,
          }),
        });
      }
      var Qn = "BottomModal___uD4Ux",
        Xn = "Body___JTq14",
        Jn = "PhoneNo___hxtrT",
        $n = "Content___We02r",
        et = t(35574),
        nt = t(98165),
        tt = t(62116);
      function at(e) {
        var { open: n, onClose: t, onOk: i } = e,
          l = (0, et.nc)((e) => {
            var n;
            return (
              (null === (n = e.userInfo) || void 0 === n
                ? void 0
                : n.desensitizedPhoneNumber) || ""
            );
          }),
          s = (0, M.useStore)((e) => {
            var n;
            return null === (n = e.commOrderConfirmModal) || void 0 === n
              ? void 0
              : n.data;
          }),
          c = (null == s ? void 0 : s._feAttrOfferId) || "",
          d = (null == s ? void 0 : s.legalRightsName) || "",
          u = (0, o.useMemo)(() => (0, ye.cW)(s), [s]),
          g = r().useRef(null),
          [f, v] = (0, o.useState)(!1);
        return (0, a.jsx)(nt.f, {
          rounded: !0,
          visible: n,
          titleText: "订购说明",
          bodyStyle: { padding: "0 0.12rem" },
          onClose: t,
          onOk: () => {
            var e;
            m.U.bpEverythingClick({
              moduleName: "会员开通-二次确认弹窗",
              pointPosition: "开通按钮",
            });
            var n =
              null === (e = g.current) || void 0 === e
                ? void 0
                : e.getVerificationCode();
            (!f || "string" == typeof n) && i({ verifyCode: n });
          },
          children: (0, a.jsxs)("div", {
            className: Qn,
            children: [
              (0, a.jsxs)("div", {
                className: Xn,
                children: [
                  "正在为",
                  (0, a.jsx)("span", { className: Jn, children: l }),
                  "办理",
                  d,
                  "，业务规则如下：",
                  (0, a.jsx)(L.s, { className: $n, text: u }),
                ],
              }),
              (0, a.jsx)(tt.R, {
                wrapVisible: n,
                style: { marginTop: ".3rem" },
                ref: g,
                offerId: c,
                onCheck: v,
              }),
            ],
          }),
        });
      }
      var ot = t(16915),
        rt = t(98833),
        it = "Content___zxpTA";
      function lt(e) {
        var n = (0, ot._)({}, (0, rt._)(e)),
          t = (0, M.useStore)((e) => {
            var n;
            return null === (n = e.memberConfig) || void 0 === n
              ? void 0
              : n.offerName;
          });
        return (0, a.jsx)(
          Rn,
          (0, xn._)(
            (0, hn._)(
              {
                backgroundImage: "".concat(
                  gImgUrlPrefixLegacy,
                  "/rights/202505/99158c30-3543-4884-ba75-097814e913ec-05.png"
                ),
                okBtnImage: "".concat(
                  gImgUrlPrefixLegacy,
                  "/rights/202505/e6547533-afbb-4819-aac4-cc05e6f052fb-hgka.png"
                ),
              },
              n
            ),
            {
              children: (0, a.jsxs)("div", {
                className: it,
                children: [
                  (0, a.jsx)("div", { children: "恭喜您" }),
                  (0, a.jsxs)("div", {
                    children: ["领取成功", (0, a.jsx)("span", { children: t })],
                  }),
                ],
              }),
            }
          )
        );
      }
      var st = t(59344);
      function ct() {
        var e = (0, et.nc)((e) => e.updateStoreUserInfo),
          n = (0, M.useStore)((e) => e.commOrderConfirmModal),
          t = (0, M.useStoreActions)(),
          [r, i] = (0, o.useState)(!1);
        return (0, a.jsxs)(a.Fragment, {
          children: [
            (0, a.jsx)(at, {
              open: n.open,
              onClose: () => {
                t.updateCommOrderConfirmModal({ open: !1, data: n.data });
              },
              onOk: (a) =>
                (0, te._)(function* () {
                  var o,
                    r,
                    l,
                    s,
                    c,
                    d,
                    u,
                    g,
                    f,
                    v,
                    _,
                    p,
                    { verifyCode: h } = a,
                    x = {
                      legalRightsCode:
                        (null === (o = n.data) || void 0 === o
                          ? void 0
                          : o.legalRightsNbr) || "",
                    };
                  h && (x.verifyCode = h);
                  var b = yield (0, Fn.HF)(x);
                  if (
                    (m.U.bpProductionOrder({
                      productName:
                        (null === (r = n.data) || void 0 === r
                          ? void 0
                          : r.legalRightsName) || "",
                      offerId:
                        (null === (l = n.data) || void 0 === l
                          ? void 0
                          : l._feAttrOfferId) || "",
                      rightsCode:
                        (null === (s = n.data) || void 0 === s
                          ? void 0
                          : s.legalRightsNbr) || "",
                      orderResp: b,
                    }),
                    "0" === b.resultCode)
                  )
                    return (
                      e(),
                      t.updateCommOrderConfirmModal({ open: !1, data: null }),
                      i(!0),
                      void t.updateCommRights()
                    );
                  "-1002" !== b.resultCode
                    ? (t.updateCommOrderConfirmModal({ open: !1, data: null }),
                      "99plus新客户订单提交频率过快,请重试" !== b.resultMsg
                        ? -1 ===
                          (null == b ||
                          null === (c = b.resultMsg) ||
                          void 0 === c
                            ? void 0
                            : c.indexOf("在途订单"))
                          ? -1 ===
                            (null == b ||
                            null === (d = b.resultMsg) ||
                            void 0 === d
                              ? void 0
                              : d.indexOf("预付费校验，后付费不校验检查不通过"))
                            ? -1 ===
                              (null == b ||
                              null === (u = b.resultMsg) ||
                              void 0 === u
                                ? void 0
                                : u.indexOf("互斥"))
                              ? -1 ===
                                  (null == b ||
                                  null === (g = b.resultMsg) ||
                                  void 0 === g
                                    ? void 0
                                    : g.indexOf("停机")) &&
                                -1 ===
                                  (null == b ||
                                  null === (f = b.resultMsg) ||
                                  void 0 === f
                                    ? void 0
                                    : f.indexOf("过渡期"))
                                ? -1 ===
                                  (null == b ||
                                  null === (v = b.resultMsg) ||
                                  void 0 === v
                                    ? void 0
                                    : v.indexOf("用户已订购北京移动"))
                                  ? -1 ===
                                    (null == b ||
                                    null === (_ = b.resultMsg) ||
                                    void 0 === _
                                      ? void 0
                                      : _.indexOf("订单受理中"))
                                    ? -1 ===
                                      (null == b ||
                                      null === (p = b.resultMsg) ||
                                      void 0 === p
                                        ? void 0
                                        : p.indexOf("用户订购次数超过"))
                                      ? zn.R.openCommonOrderFailModal()
                                      : zn.R.open({
                                          titleIcon: "warning",
                                          title: "温馨提示",
                                          content:
                                            "【办理失败】尊敬的用户您好，您的手机号订购次数超过限制，具体情况请您详细观看订购规则，感谢您的使用。【中国移动】",
                                        })
                                    : zn.R.open({
                                        titleIcon: "warning",
                                        title: "温馨提示",
                                        content:
                                          "【办理失败】尊敬的用户您好，因系统繁忙您所申请的业务无法受理，请您稍后再试，给您带来的不便，敬请谅解。【中国移动】",
                                      })
                                  : zn.R.open({
                                      titleIcon: "warning",
                                      title: "温馨提示",
                                      content:
                                        "【办理失败】尊敬的客户您好，您申请的该业务已处于开通状态。感谢您的使用。【中国移动】",
                                    })
                                : zn.R.open({
                                    titleIcon: "warning",
                                    title: "温馨提示",
                                    content:
                                      "【办理失败】尊敬的用户您好，您的手机号订购异常，感谢您的使用。【中国移动】",
                                  })
                              : zn.R.open({
                                  titleIcon: "warning",
                                  title: "温馨提示",
                                  content:
                                    "【办理失败】尊敬的用户您好，由于您参加了其他产品，与该产品不能同时订购，感谢您的使用。【中国移动】",
                                })
                            : zn.R.open({
                                titleIcon: "warning",
                                title: "温馨提示",
                                content:
                                  "【余额不足提醒】尊敬的客户您好，您的账户余额不足，不能成功扣费，请充值后在办理此业务。【中国移动】",
                              })
                          : zn.R.open({
                              titleIcon: "warning",
                              title: "温馨提示",
                              content:
                                "【办理失败】尊敬的用户您好，因系统繁忙您所申请的业务无法受理，请您稍后再试，给您带来的不便，敬请谅解。【中国移动】",
                            })
                        : zn.R.open({
                            title: "领取失败",
                            titleIcon: "warning",
                            content: "系统繁忙，请稍后再试",
                          }))
                    : st.Z.info("验证码校验失败");
                })(),
            }),
            (0, a.jsx)(lt, {
              open: r,
              onClose: () => {
                i(!1);
              },
              onOk: () => {
                i(!1);
              },
            }),
          ],
        });
      }
      var dt = t(44418),
        ut = t(40998),
        gt = t(56287),
        mt = t.n(gt),
        ft = "BottomModal____NnFb",
        vt = "Content___giLa0";
      function _t(e) {
        var { open: n, onClose: t, onOk: i } = e,
          l = (0, et.nc)((e) => {
            var n;
            return (
              (null === (n = e.userInfo) || void 0 === n
                ? void 0
                : n.desensitizedPhoneNumber) || ""
            );
          }),
          s = (0, M.useStore)((e) => {
            var n;
            return (
              (null === (n = e.memberConfig) || void 0 === n
                ? void 0
                : n.offerRulesText) || ""
            );
          }),
          c = (0, M.useStore)((e) => {
            var n;
            return (
              (null === (n = e.memberConfig) || void 0 === n
                ? void 0
                : n.offerName) || ""
            );
          }),
          d = (0, M.useStore)((e) => {
            var n;
            return (
              (null === (n = e.memberConfig) || void 0 === n
                ? void 0
                : n.offerId) || ""
            );
          }),
          u = "正在为"
            .concat(l, "办理")
            .concat(c, "，业务规则如下：")
            .concat(s),
          g = r().useRef(null),
          [f, v] = (0, o.useState)(!1);
        return (0, a.jsx)(nt.f, {
          rounded: !0,
          visible: n,
          titleText: "订购说明",
          bodyStyle: { padding: "0 0.12rem" },
          onClose: t,
          onOk: () => {
            var e;
            m.U.bpEverythingClick({
              moduleName: "会员开通-二次确认弹窗",
              pointPosition: "开通按钮",
            });
            var n =
              null === (e = g.current) || void 0 === e
                ? void 0
                : e.getVerificationCode();
            (!f || "string" == typeof n) &&
              i({ verifyCode: n, offerId: d, offerName: c });
          },
          children: (0, a.jsxs)("div", {
            className: ft,
            children: [
              (0, a.jsx)(L.s, { className: vt, text: u }),
              (0, a.jsx)(tt.R, {
                wrapVisible: n,
                style: { marginTop: ".3rem" },
                ref: g,
                offerId: d,
                onCheck: v,
              }),
            ],
          }),
        });
      }
      var pt = "Content___W0cJ6";
      function ht(e) {
        var n = (0, ot._)({}, (0, rt._)(e)),
          t = (0, M.useStore)((e) => {
            var n;
            return null === (n = e.memberConfig) || void 0 === n
              ? void 0
              : n.offerName;
          });
        return (0, a.jsx)(
          Rn,
          (0, xn._)(
            (0, hn._)(
              {
                backgroundImage: "".concat(
                  gImgUrlPrefixLegacy,
                  "/rights/202505/99158c30-3543-4884-ba75-097814e913ec-05.png"
                ),
                okBtnImage: "".concat(
                  gImgUrlPrefixLegacy,
                  "/rights/202505/e6547533-afbb-4819-aac4-cc05e6f052fb-hgka.png"
                ),
              },
              n
            ),
            {
              children: (0, a.jsxs)("div", {
                className: pt,
                children: [
                  (0, a.jsx)("div", { children: "恭喜您" }),
                  (0, a.jsxs)("div", {
                    children: ["订购成功", (0, a.jsx)("span", { children: t })],
                  }),
                ],
              }),
            }
          )
        );
      }
      function xt() {
        var e = (0, et.nc)((e) => e.updateStoreUserInfo),
          n = (0, M.useStore)((e) => e.offerOrderConfirmModalVisible),
          t = (0, M.useStoreActions)(),
          [r, i] = (0, o.useState)(!1),
          { isFromStarFire: l, starfireParams: s } = (0, ut.q)();
        return (0, a.jsxs)(a.Fragment, {
          children: [
            (0, a.jsx)(_t, {
              open: n,
              onClose: () => {
                t.updateOfferOrderConfirmModalVisible(!1);
              },
              onOk: (n) =>
                (0, te._)(function* () {
                  var a,
                    o,
                    r,
                    c,
                    d,
                    u,
                    g,
                    f,
                    { verifyCode: v, offerId: _, offerName: p } = n;
                  if (_ && p) {
                    var h = { offerId: _ };
                    v && (h.verifyCode = v),
                      l &&
                        s &&
                        ((h.assistantUserInfo = s.assistantUserInfo),
                        (h.goodsInfo = s.goodsInfo),
                        (h.customerPhone = s.customerPhone),
                        (h.clickTime = mt()().format("YYYY-MM-DD HH:mm:ss")));
                    var x = yield (0, dt.VD)(h);
                    if (
                      (m.U.bpProductionOrder({
                        productName: p,
                        offerId: _,
                        rightsCode: "",
                        orderResp: x,
                      }),
                      "0" === x.resultCode)
                    )
                      return (
                        e(),
                        t.updateOfferOrderConfirmModalVisible(!1),
                        i(!0),
                        t.updateActRules(),
                        t.updateCoreRights(),
                        t.updateDiscountInfo(),
                        t.updateDiscountRightsList(),
                        void t.updateExclusiveRightsList()
                      );
                    "-1002" !== x.resultCode
                      ? (t.updateOfferOrderConfirmModalVisible(!1),
                        -1 ===
                        (null == x || null === (a = x.resultMsg) || void 0 === a
                          ? void 0
                          : a.indexOf("在途订单"))
                          ? -1 ===
                            (null == x ||
                            null === (o = x.resultMsg) ||
                            void 0 === o
                              ? void 0
                              : o.indexOf("预付费校验，后付费不校验检查不通过"))
                            ? -1 ===
                              (null == x ||
                              null === (r = x.resultMsg) ||
                              void 0 === r
                                ? void 0
                                : r.indexOf("互斥"))
                              ? -1 ===
                                  (null == x ||
                                  null === (c = x.resultMsg) ||
                                  void 0 === c
                                    ? void 0
                                    : c.indexOf("停机")) &&
                                -1 ===
                                  (null == x ||
                                  null === (d = x.resultMsg) ||
                                  void 0 === d
                                    ? void 0
                                    : d.indexOf("过渡期"))
                                ? -1 ===
                                  (null == x ||
                                  null === (u = x.resultMsg) ||
                                  void 0 === u
                                    ? void 0
                                    : u.indexOf("用户已订购北京移动"))
                                  ? -1 ===
                                    (null == x ||
                                    null === (g = x.resultMsg) ||
                                    void 0 === g
                                      ? void 0
                                      : g.indexOf("订单受理中"))
                                    ? -1 ===
                                      (null == x ||
                                      null === (f = x.resultMsg) ||
                                      void 0 === f
                                        ? void 0
                                        : f.indexOf("用户订购次数超过"))
                                      ? zn.R.openCommonOrderFailModal()
                                      : zn.R.open({
                                          titleIcon: "warning",
                                          title: "温馨提示",
                                          content:
                                            "【办理失败】尊敬的用户您好，您的手机号订购次数超过限制，具体情况请您详细观看订购规则，感谢您的使用。【中国移动】",
                                        })
                                    : zn.R.open({
                                        titleIcon: "warning",
                                        title: "温馨提示",
                                        content:
                                          "【办理失败】尊敬的用户您好，因系统繁忙您所申请的业务无法受理，请您稍后再试，给您带来的不便，敬请谅解。【中国移动】",
                                      })
                                  : zn.R.open({
                                      titleIcon: "warning",
                                      title: "温馨提示",
                                      content:
                                        "【办理失败】尊敬的客户您好，您申请的该业务已处于开通状态。感谢您的使用。【中国移动】",
                                    })
                                : zn.R.open({
                                    titleIcon: "warning",
                                    title: "温馨提示",
                                    content:
                                      "【办理失败】尊敬的用户您好，您的手机号订购异常，感谢您的使用。【中国移动】",
                                  })
                              : zn.R.open({
                                  titleIcon: "warning",
                                  title: "温馨提示",
                                  content:
                                    "【办理失败】尊敬的用户您好，由于您参加了其他产品，与该产品不能同时订购，感谢您的使用。【中国移动】",
                                })
                            : zn.R.open({
                                titleIcon: "warning",
                                title: "温馨提示",
                                content:
                                  "【余额不足提醒】尊敬的客户您好，您的账户余额不足，不能成功扣费，请充值后在办理此业务。【中国移动】",
                              })
                          : zn.R.open({
                              titleIcon: "warning",
                              title: "温馨提示",
                              content:
                                "【办理失败】尊敬的用户您好，因系统繁忙您所申请的业务无法受理，请您稍后再试，给您带来的不便，敬请谅解。【中国移动】",
                            }))
                      : st.Z.info("验证码校验失败");
                  }
                })(),
            }),
            (0, a.jsx)(ht, {
              open: r,
              onClose: () => {
                i(!1);
              },
              onOk: () => {
                i(!1);
              },
            }),
          ],
        });
      }
      function bt() {
        return (
          (0, s.i)(),
          (0, M.useInitializeStore)(),
          (() => {
            var [e] = (0, c.ok)(),
              n = e.get("m");
            if (n) {
              var t = d.moduleIds[n];
              t &&
                setTimeout(() => {
                  (0, u.scrollToModule)(t);
                }, 500);
            }
          })(),
          (0, l.x)([
            "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202505/42277ba8-28c6-4afe-b2ba-17a5b3297595-06.png"
            ),
            "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202505/0f9f4e7b-2d64-43b7-99e9-8c8f8bbcaffc-ahogao.png"
            ),
            "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202505/99158c30-3543-4884-ba75-097814e913ec-05.png"
            ),
            "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202505/6305789a-3b41-4c73-a33d-a6cd94a855f0-zhouahg.png"
            ),
            "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202505/e6547533-afbb-4819-aac4-cc05e6f052fb-hgka.png"
            ),
            "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202606/3d320627-96af-4642-bebc-87e69a8ee395-12222.png"
            ),
            "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202606/49f1aae7-7b49-4e77-81c1-abbfd26d19f2-f3.png"
            ),
          ]),
          (0, a.jsxs)("div", {
            className: i,
            children: [
              (0, a.jsx)(Kn, {}),
              (0, a.jsx)(H, {}),
              (0, a.jsx)($, {}),
              (0, a.jsx)(ie, {}),
              (0, a.jsx)(vn, {}),
              (0, a.jsx)(Dn, {}),
              (0, a.jsx)(ne, {}),
              (0, a.jsx)(xt, {}),
              (0, a.jsx)(ct, {}),
            ],
          })
        );
      }
    },
  },
]);
